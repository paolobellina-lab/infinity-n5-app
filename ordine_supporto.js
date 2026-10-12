// @versione 2026-09-14.1 | ordine_supporto.js | proprieta`: chat MOTORE
// ==========================================
// 🩺 SUPPORTO: MEDICO E INGEGNERE (N5) - ordine_supporto.js
// ------------------------------------------
// ULTIMO MODULO MANCANTE. Il router cercava `window.avviaFaseSupporto`
// e non lo trovava: l'ordine si fermava con un errore in console.
//
// La cosa da non sbagliare è CHI TIRA:
//
//   Dottore, Ingegnere   ->  tira L'UTENTE, su WIP
//   MediKit, GizmoKit    ->  tira IL BERSAGLIO, su PH
//
// E il fallimento non è uguale:
//
//   Dottore, MediKit     ->  il bersaglio MUORE
//   Ingegnere, GizmoKit  ->  il bersaglio prende 1 Ferita
//
// È l'unica azione che punta agli ALLEATI: il roster da cui scegliere è
// il proprio, non quello nemico.
// ==========================================

(function () {
    'use strict';

    function motore() {
        if (!window.MotoreN5) {
            alert('⛔ motore_regole_n5.js non è caricato: il Supporto non può funzionare.');
            return null;
        }
        return window.MotoreN5;
    }

    const COL = { bordo: '#66ccff', sfondo: '#002233' };

    window.avviaFaseSupporto = function (actionId, isSecondHalf) {
        window.currentOrder = window.currentOrder || {};
        window.currentOrder.isSecondHalf = isSecondHalf;
        if (!isSecondHalf) window.currentOrder.action1 = actionId;
        window.currentOrder.action = actionId;

        // 🔴 NON si ramifica su `isSecondHalf`: la seconda metà salta la
        // scelta dell'arma e dei bersagli solo se la prima metà era essa
        // stessa un attacco dello stesso tipo. Partendo da un Movimento —
        // il caso più comune al tavolo — arma e bersagli non ci sono, e si
        // arrivava ai modificatori con weapon undefined.
        const _M = window.MotoreN5;
        const ripresa = _M
            ? _M.riprendiOrdineDaFinestra(actionId, isSecondHalf)
            : { riprende: false, motivo: 'motore non caricato' };
        if (!ripresa.riprende) {
            if (isSecondHalf) console.log('↩️ ' + ripresa.motivo);
            window.coordIndex = 0;
            window.coordPayloads = [];
            window.pendingTargets = [];
            window.supportoStrumento = null;
            window.supportoInContatto = true;
            window.startUnitSupportoLoop();
        } else {
            window.preparaModificatoriSupporto();
        }
    };

    // ==============================================================
    // 1. QUALE STRUMENTO
    // ==============================================================
    window.startUnitSupportoLoop = function () {
        const M = motore(); if (!M) return;
        const unita = window.coordUnits[window.coordIndex];
        if (window.mostraTitoloUnitaCorrente) window.mostraTitoloUnitaCorrente();

        const strumenti = M.strumentiSupporto(unita);
        const container = document.getElementById('weapon-buttons-container');
        if (!container) return;

        container.innerHTML = `<div style="background:${COL.sfondo}; border:1px solid ${COL.bordo}; padding:10px; margin-bottom:15px; text-align:center; color:#fff; border-radius:5px;">
            <b style="color:${COL.bordo}; font-size:20px;">🩺 SUPPORTO</b><br>
            <span style="font-size:14px; color:#ccc;">Bersaglia gli ALLEATI. Abilità Breve, contatto di Silhouette.</span>
        </div>`;

        if (strumenti.length === 0) {
            container.innerHTML += `<p style="color:#ff3333; text-align:center; font-size:18px;">
                ❌ Questa unità non ha Dottore, Ingegnere, MediKit né GizmoKit.</p>`;
        } else {
            strumenti.forEach(function (st) {
                // Chi tira e cosa rischia: si dice subito, non dopo.
                const chi = st.chiTira === 'UTENTE' ? 'tiri tu' : 'tira il bersaglio';
                const rischio = st.fallimentoLetale
                    ? '<span style="color:#ff4444;">fallire = MORTE</span>'
                    : '<span style="color:#ffaa44;">fallire = 1 Ferita</span>';
                container.innerHTML += `<button class="huge-btn" style="border-color:${COL.bordo};" onclick="window.scegliStrumentoSupporto('${st.id}')">
                    ${st.nome}<br><span style="color:${COL.bordo}; font-size:13px;">${chi} su ${st.attributo} · ${rischio}</span></button>`;
            });
        }

        window.goToStep('step-weapon');
    };

    window.scegliStrumentoSupporto = function (id) {
        window.supportoStrumento = id;
        window.setupTargetSelectionSupporto();
    };

    // ==============================================================
    // 2. BERSAGLIO: fra gli ALLEATI
    // ==============================================================
    window.setupTargetSelectionSupporto = function () {
        const M = motore(); if (!M) return;
        const unita = window.coordUnits[window.coordIndex];
        if (window.mostraTitoloUnitaCorrente) window.mostraTitoloUnitaCorrente();

        // 🔴 Il roster è il PROPRIO, non quello nemico.
        const alleati = M.rosterProprio();
        const giudizi = M.bersagliSupporto(window.supportoStrumento, alleati, unita);
        window.validTargets = giudizi.filter(g => g.ammesso).map(g => g.unita);
        window.targetsScartati = giudizi.filter(g => !g.ammesso).map(g => ({ nome: g.nome, motivo: g.motivo }));

        const strumento = (M.strumentiSupporto(unita).find(s => s.id === window.supportoStrumento)) || {};
        const container = document.getElementById('enemy-target-buttons');
        if (!container) return;

        container.innerHTML = `<div style="background:${COL.sfondo}; border:1px solid ${COL.bordo}; padding:12px; border-radius:5px; margin-bottom:15px; text-align:center;">
            <b style="color:${COL.bordo};">🩺 ${strumento.nome || window.supportoStrumento} — SCEGLI L'ALLEATO</b><br>
            <span style="color:#aaa; font-size:12px;">${strumento.bersaglio || 'Alleato da soccorrere.'}</span>
        </div>`;

        if (window.validTargets.length === 0) {
            container.innerHTML += `<p style="color:#ff3333; text-align:center; font-weight:bold;">Nessun alleato da soccorrere.</p>`;
        } else {
            window.validTargets.forEach(function (u) {
                const st = M.statoBersaglio(u);
                const nota = st.incosciente ? 'Incosciente' : 'Ferito o con Stati da annullare';
                container.innerHTML += `<button class="huge-btn" style="width:100%; min-height:60px; font-size:19px; margin-bottom:6px; background:#111; border-color:${COL.bordo};"
                    onclick="window.scegliBersaglioSupporto('${String(u.id).replace(/'/g, "\\'")}')">
                    🩺 ${M.nomeUnita(u)}<br><span style="font-size:13px; color:${COL.bordo};">${nota}</span></button>`;
            });
        }

        if (window.targetsScartati.length > 0) {
            container.innerHTML += `<div style="margin-top:15px; padding:10px; background:#111; border:1px solid #444; border-radius:5px; color:#888; font-size:13px;">
                <b style="color:#aaa;">Non soccorribili:</b><br>` +
                window.targetsScartati.map(t => `• <b>${t.nome}</b> — ${t.motivo}`).join('<br>') + `</div>`;
        }

        window.goToStep('step-wait-aro');
    };

    window.scegliBersaglioSupporto = function (id) {
        const M = motore(); if (!M) return;
        const u = M.rosterProprio().find(x => String(x.id) === String(id));
        if (!u) return;
        window.combatTargets = [{ id: u.id, name: M.nomeUnita(u), burst: 1, cover: false,
                                  rangeIndex: 0, rangeMod: 0, terrain: 'NESSUNO' }];
        window.pendingTargets = [u];
        window.preparaModificatoriSupporto();
    };

    // ==============================================================
    // 3. IL TIRO
    // ==============================================================
    window.preparaModificatoriSupporto = function () {
        const M = motore(); if (!M) return;
        if (!window.combatTargets || window.combatTargets.length === 0) {
            alert('⛔ Nessun alleato scelto.\n\nIl Supporto richiede un bersaglio alleato.');
            return window.setupTargetSelectionSupporto();
        }
        window.renderSupporto();
        window.goToStep('step-modifiers');
    };

    window.renderSupporto = function () {
        const M = motore(); if (!M) return;
        const unita = window.coordUnits[window.coordIndex];
        const t = window.combatTargets[0];
        const bersaglio = M.rosterProprio().find(u => u.id === t.id) || {};
        const e = M.regoleSupporto(unita, bersaglio, window.supportoStrumento,
            { inContatto: window.supportoInContatto !== false, rangeIndex: t.rangeIndex });
        window.supportoEsito = e;

        if (!e.valido) {
            document.getElementById('targets-allocation-container').innerHTML =
                `<p style="color:#ff3333; text-align:center;">${e.avvisi[0].messaggio}</p>`;
            return;
        }

        const dettaglio = e.voci.map(v => `<div style="display:flex; justify-content:space-between; padding:2px 0;">
                <span style="color:#aaa;">${v.motivo}</span>
                <b style="color:${v.valore >= 0 ? '#00ff00' : '#ff6666'};">${v.fonte === 'base' ? '' : (v.valore > 0 ? '+' + v.valore : v.valore)}</b></div>`).join('');

        // Chi tira è l'informazione che il giocatore sbaglia più facilmente.
        const chiTira = e.chiTira === 'UTENTE'
            ? `<b style="color:#66ff66;">TIRI TU</b> — ${e.nomeChiTira}`
            : `<b style="color:#ffcc00;">TIRA IL BERSAGLIO</b> — ${e.nomeChiTira}`;

        const avvertimento = e.fallimentoLetale
            ? `<div style="margin-top:12px; padding:12px; background:#330000; border:2px solid #ff0000; border-radius:5px; text-align:center;">
                 <b style="color:#ff4444; font-size:16px;">⚠️ FALLENDO IL BERSAGLIO MUORE</b><br>
                 <span style="color:#ffaaaa; font-size:12px;">Entra automaticamente in Stato Morto e viene rimosso dal tavolo.</span></div>`
            : `<div style="margin-top:12px; padding:12px; background:#332200; border:1px solid #cc8800; border-radius:5px; text-align:center;">
                 <b style="color:#ffaa44; font-size:15px;">⚠️ Fallendo il bersaglio riceve 1 Ferita</b></div>`;

        let colpire = '';
        if (e.tiroPerColpire) {
            colpire = `<div style="margin-bottom:12px; padding:10px; background:#001a2a; border:1px solid ${COL.bordo}; border-radius:5px;">
                <div style="text-align:center; color:${COL.bordo}; font-size:13px;">Uso a distanza: prima serve colpire</div>
                <div style="text-align:center; color:#fff;">BS ${e.tiroPerColpire.base} → <b style="font-size:20px;">${e.tiroPerColpire.valore}</b></div></div>`;
        }

        const stileContatto = window.supportoInContatto !== false
            ? 'background:#004400; border-color:#00ff00; color:#00ff00;'
            : 'background:#002244; border-color:#00ccff; color:#00ccff;';

        document.getElementById('targets-allocation-container').innerHTML = `
            <h2 style="color:${COL.bordo}; text-align:center; margin-bottom:20px;">${e.strumento.toUpperCase()}</h2>
            <div class="target-card" style="border-left:4px solid ${COL.bordo}; background:rgba(0,204,255,0.05); padding:15px; border-radius:5px;">
                <b style="color:#fff; font-size:22px; display:block; margin-bottom:10px;">🩺 ${t.name}</b>
                <div style="text-align:center; color:#ccc; font-size:14px; margin-bottom:12px;">${chiTira}</div>
                ${colpire}
                <div style="background:#001a22; border:1px solid #005566; padding:12px; border-radius:5px;">
                    <div style="text-align:center; color:#fff; margin-bottom:8px;">
                        ${e.attributo} ${e.base} → <b style="color:${COL.bordo}; font-size:26px;">${e.valore}</b></div>
                    <div style="border-top:1px solid #004455; padding-top:8px; font-size:14px;">${dettaglio}</div>
                    ${e.critici && !e.critici.nessunTiro ? `<div style="text-align:center; color:#ffcc00; font-size:12px; margin-top:6px;">🎯 ${e.critici.testo}</div>` : ''}
                </div>
                ${avvertimento}
                ${window.supportoEquipaggiamento(e) ? `<button class="huge-btn" style="width:100%; margin-top:12px; min-height:55px; font-size:15px; ${stileContatto}"
                    onclick="window.toggleContattoSupporto()">${window.supportoInContatto !== false ? '🤝 IN CONTATTO DI SILHOUETTE' : '🎯 A DISTANZA (serve la LoF)'}</button>` : ''}
                <div style="margin-top:12px; color:#888; font-size:12px; line-height:1.6;">
                    ${e.note.map(n => `• ${n}`).join('<br>')}
                </div>
            </div>`;

        const btn = (document.getElementById('btn-esegui-calcolo') || document.querySelector('#step-modifiers .huge-btn'));
        if (btn) {
            const nuovo = btn.cloneNode(true);
            btn.parentNode.replaceChild(nuovo, btn);
            // 🔴 Il display si rende esplicito SEMPRE: cloneNode(true) copia lo
            // style inline, e se chi ha usato la schermata prima lo aveva
            // nascosto il clone nasceva invisibile. Etichetta giusta,
            // onclick funzionante, pulsante non cliccabile.
            nuovo.style.display = '';
            nuovo.onclick = function () { window.eseguiCalcoloSupporto(); };
            nuovo.innerText = 'ESEGUI ' + e.strumento.toUpperCase();
        }
    };

    // MediKit e GizmoKit hanno le due modalità; Dottore e Ingegnere no.
    window.supportoEquipaggiamento = function (e) {
        return e && (e.strumento === 'MediKit' || e.strumento === 'GizmoKit');
    };
    window.toggleContattoSupporto = function () {
        window.supportoInContatto = (window.supportoInContatto === false);
        window.renderSupporto();
    };

    // ==============================================================
    // 4. INVIO
    // ==============================================================
    window.eseguiCalcoloSupporto = function () {
        const M = motore(); if (!M) return;
        const unita = window.coordUnits[window.coordIndex];
        const e = window.supportoEsito || {};

        window.coordPayloads.push({
            attaccante: unita,
            azione: (e.chiTira === 'BERSAGLIO') ? M.AZIONI.SUPPORTO_BS : M.AZIONI.SUPPORTO_WIP,
            arma: { nome: e.strumento, burst: 1, ammo: null, ammoOpzioni: [],
                    bands: [], isTemplate: false, isCC: false, isDifesa: true, notazioni: [] },
            bersagli: window.combatTargets,
            burstDisponibile: 1,
            regole: {
                strumento: e.strumento,
                chiTira: e.chiTira,
                nomeChiTira: e.nomeChiTira,
                attributo: e.attributo,
                valoreSuccesso: e.valore,
                base: e.base, mod: e.mod, voci: e.voci,
                fallimentoLetale: e.fallimentoLetale,
                tiroPerColpire: e.tiroPerColpire,
                nonOffensivo: true
            }
        });

        window.coordIndex++;
        if (window.coordIndex < window.coordUnits.length) {
            window.combatTargets = [];
            window.pendingTargets = [];
            window.supportoStrumento = null;
            return window.startUnitSupportoLoop();
        }

        const spedito = M.inviaCalcolo(window.coordPayloads, { isCoordinated: window.coordMode });
        if (!spedito) { window.coordIndex--; window.coordPayloads.pop(); return; }

        const calcDiv = document.getElementById('calc-result');
        if (calcDiv) {
            calcDiv.innerHTML = `
                <div style="text-align:center; padding:20px; border:2px solid ${COL.bordo}; background:rgba(0,204,255,0.1); margin-top:20px;">
                    <h2 style="color:${COL.bordo}; margin:0;">SUPPORTO INVIATO</h2>
                    <p style="font-size:12px; color:#aaa;">${e.strumento}: tira ${e.nomeChiTira} su ${e.attributo} ${e.valore}.</p>
                </div>`;
            calcDiv.style.display = 'block';
        }
    };

    console.log('🩺 ordine_supporto.js caricato.');
})();


// Dichiarazione di versione per il controllo incrociato fra chat.
// Funziona anche se questo file si carica PRIMA del motore: in quel
// caso la versione resta in coda e il motore la raccoglie all'avvio.
(function () {
    var g = (typeof window !== 'undefined') ? window : globalThis;
    var v = { file: 'ordine_supporto.js', versione: '2026-09-14.1', proprieta: 'MOTORE' };
    if (g.MotoreN5 && g.MotoreN5.dichiaraVersione) g.MotoreN5.dichiaraVersione(v.file, v.versione, v.proprieta);
    else { g.__versioniN5 = g.__versioniN5 || []; g.__versioniN5.push(v); }
})();
