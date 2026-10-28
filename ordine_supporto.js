// @versione 2026-10-28.4 | ordine_supporto.js | proprieta`: chat MOTORE
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

    // 28 ottobre (Paolo): il colore e` dell'ORDINE, non del modulo (M.COLORI_ORDINE nel
    // motore: Movimenti blu, Abilita` Brevi verdi, Ordini Interi rossi). COL legge le
    // tinte dell'Ordine in corso a ogni uso; 'MEDICO_INGEGNERE' e` quello di casa. Prima: { bordo: '#66ccff', sfondo: '#002233' };.
    const COL = (function () {
        const ripiego = { bordo: '#66ccff', sfondo: '#002233', riquadro: '#002233', tenue: '#66ccff', testo: '#66ccff' };
        const o = {};
        ['bordo', 'sfondo', 'riquadro', 'tenue', 'testo'].forEach(function (k) {
            Object.defineProperty(o, k, { enumerable: true, get: function () {
                const M = window.MotoreN5;
                return (M && typeof M.colOrdine === 'function') ? M.colOrdine('MEDICO_INGEGNERE')[k] : ripiego[k];
            } });
        });
        return o;
    })();

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
        window.MotoreN5.azzeraNote('step-weapon');
        if (!container) return;

        container.innerHTML = `${window.MotoreN5.intestazioneOrdine({ colore: COL, titolo: `SUPPORTO`, nota: `Bersaglia gli ALLEATI. Abilità Breve, contatto di Silhouette.` })}`;

        if (strumenti.length === 0) {
            container.innerHTML += `<p style="color:var(--mn-errore,#ff3333); text-align:center; font-size:var(--fs-m);">
                ❌ Questa unità non ha Dottore, Ingegnere, MediKit né GizmoKit.</p>`;
        } else {
            strumenti.forEach(function (st) {
                // Chi tira e cosa rischia: si dice subito, non dopo.
                const chi = st.chiTira === 'UTENTE' ? 'tiri tu' : 'tira il bersaglio';
                const rischio = st.fallimentoLetale
                    ? '<span style="color:var(--mn-errore,#ff3333);">fallire = MORTE</span>'
                    : '<span style="color:var(--mn-attenzione,#ffcc00);">fallire = 1 Ferita</span>';
                container.innerHTML += `<button class="huge-btn" style="border-color:${COL.bordo};" onclick="window.scegliStrumentoSupporto('${st.id}')">
                    ${st.nome}<br><span style="color:${COL.bordo}; font-size:var(--fs-s);">${chi} su ${st.attributo} · ${rischio}</span></button>`;
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
        window.MotoreN5.azzeraNote('step-wait-aro');
        if (!container) return;

        container.innerHTML = `${window.MotoreN5.intestazioneOrdine({ colore: COL, titolo: `${strumento.nome || window.supportoStrumento} — SCEGLI L'ALLEATO`, nota: `${strumento.bersaglio || 'Alleato da soccorrere.'}` })}`;

        if (window.validTargets.length === 0) {
            container.innerHTML += `<p style="color:var(--mn-errore,#ff3333); text-align:center; font-weight:bold;">Nessun alleato da soccorrere.</p>`;
        } else {
            window.validTargets.forEach(function (u) {
                const st = M.statoBersaglio(u);
                const nota = st.incosciente ? 'Incosciente' : 'Ferito o con Stati da annullare';
                const clic = `onclick="window.scegliBersaglioSupporto('${String(u.id).replace(/'/g, "\\'")}')"`;
                // 28 ottobre (piano grafico, GR-E19): la riga con la foto, come negli
                // altri elenchi; il perche` (Incosciente...) nella fascia bassa.
                container.innerHTML += (typeof window.rigaUnitaConFoto === 'function')
                    ? window.rigaUnitaConFoto(u, { attributi: clic, etichette: `<span style="color:${COL.bordo};">🩺 ${nota}</span>` })
                    : `<button class="huge-btn" style="width:100%; min-height:60px; font-size:var(--fs-l); margin-bottom:6px; background:var(--mn-fondo-tasto,#111111); border-color:${COL.bordo};" ${clic}>
                    🩺 ${M.nomeUnita(u)}<br><span style="font-size:var(--fs-s); color:${COL.bordo};">${nota}</span></button>`;
            });
        }

        // 28 ottobre (Paolo): perche` non si puo`, nella ⓘ (o sotto il tasto).
        window.targetsScartati.forEach(t => window.MotoreN5.nota('step-wait-aro', t.nome + ' non soccorribile', t.motivo, { tipo: 'nonpuo' }));

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
        M.azzeraNote('step-modifiers');
        const unita = window.coordUnits[window.coordIndex];
        const t = window.combatTargets[0];
        const bersaglio = M.rosterProprio().find(u => u.id === t.id) || {};
        const e = M.regoleSupporto(unita, bersaglio, window.supportoStrumento,
            { inContatto: window.supportoInContatto !== false, rangeIndex: t.rangeIndex });
        window.supportoEsito = e;

        if (!e.valido) {
            document.getElementById('targets-allocation-container').innerHTML =
                `<p style="color:var(--mn-errore,#ff3333); text-align:center;">${e.avvisi[0].messaggio}</p>`;
            return;
        }

        const dettaglio = e.voci.map(v => `<div style="display:flex; justify-content:space-between; padding:2px 0;">
                <span style="color:var(--mn-debole,#aaaaaa);">${v.motivo}</span>
                <b style="color:${v.valore >= 0 ? 'var(--mn-si,#00ff00)' : 'var(--mn-errore,#ff3333)'};">${v.fonte === 'base' ? '' : (v.valore > 0 ? '+' + v.valore : v.valore)}</b></div>`).join('');

        // Chi tira è l'informazione che il giocatore sbaglia più facilmente.
        const chiTira = e.chiTira === 'UTENTE'
            ? `<b style="color:var(--mn-si-testo,#88ff88);">TIRI TU</b> — ${e.nomeChiTira}`
            : `<b style="color:var(--mn-attenzione,#ffcc00);">TIRA IL BERSAGLIO</b> — ${e.nomeChiTira}`;

        const avvertimento = e.fallimentoLetale
            ? `<div style="margin-top:12px; padding:12px; background:var(--mn-errore-fondo,#330000); border:2px solid var(--mn-errore,#ff3333); border-radius:5px; text-align:center;">
                 <b style="color:var(--mn-errore,#ff3333); font-size:var(--fs-m);">⚠️ FALLENDO IL BERSAGLIO MUORE</b><br>
                 <span style="color:var(--mn-errore-testo,#ff9999); font-size:var(--fs-xs);">Entra automaticamente in Stato Morto e viene rimosso dal tavolo.</span></div>`
            : `<div style="margin-top:12px; padding:12px; background:var(--mn-nota-fondo,#1a1000); border:1px solid var(--mn-nota-bordo,#664400); border-radius:5px; text-align:center;">
                 <b style="color:var(--mn-attenzione,#ffcc00); font-size:var(--fs-m);">⚠️ Fallendo il bersaglio riceve 1 Ferita</b></div>`;

        let colpire = '';
        if (e.tiroPerColpire) {
            colpire = `<div style="margin-bottom:12px; padding:10px; background:var(--mn-ordine-riquadro,#001a2a); border:1px solid ${COL.bordo}; border-radius:5px;">
                <div style="text-align:center; color:${COL.bordo}; font-size:var(--fs-s);">Uso a distanza: prima serve colpire</div>
                <div style="text-align:center; color:var(--mn-testo,#ffffff);">BS ${e.tiroPerColpire.base} → <b style="font-size:var(--fs-l);">${e.tiroPerColpire.valore}</b></div>
                ${window.barraGittataSupporto(t, e.tiroPerColpire.bande || [])}</div>`;
        }

        const stileContatto = window.supportoInContatto !== false
            ? M.stileColore('si')
            : 'background:#002244; border-color:#00ccff; color:#00ccff;';

        document.getElementById('targets-allocation-container').innerHTML = `
            ${window.MotoreN5.intestazioneOrdine({ colore: COL, titolo: `${e.strumento.toUpperCase()}` })}
            <div class="target-card" style="border-left:4px solid ${COL.bordo}; background:rgba(0,204,255,0.05); padding:15px; border-radius:5px;">
                <b style="color:var(--mn-testo,#ffffff); font-size:var(--fs-l); display:block; margin-bottom:10px;">🩺 ${t.name}</b>
                <div style="text-align:center; color:var(--mn-testo-2,#cccccc); font-size:var(--fs-s); margin-bottom:12px;">${chiTira}</div>
                ${colpire}
                <div style="background:var(--mn-ordine-riquadro,#001a22); border:1px solid var(--mn-ordine-tenue,#005566); padding:12px; border-radius:5px;">
                    <div style="text-align:center; color:var(--mn-testo,#ffffff); margin-bottom:8px;">
                        ${e.attributo} ${e.base} → <b style="color:${COL.bordo}; font-size:var(--fs-l);">${e.valore}</b></div>
                    <div style="border-top:1px solid var(--mn-ordine-tenue,#004455); padding-top:8px; font-size:var(--fs-s);">${dettaglio}</div>
                    ${e.critici && !e.critici.nessunTiro ? `<div style="text-align:center; color:var(--mn-attenzione,#ffcc00); font-size:var(--fs-xs); margin-top:6px;">🎯 ${e.critici.testo}</div>` : ''}
                </div>
                ${avvertimento}
                ${window.supportoEquipaggiamento(e) ? `<button class="huge-btn" style="width:100%; margin-top:12px; min-height:55px; font-size:var(--fs-m); ${stileContatto}"
                    onclick="window.toggleContattoSupporto()">${window.supportoInContatto !== false ? '🤝 IN CONTATTO DI SILHOUETTE' : '🎯 A DISTANZA (serve la LoF)'}</button>` : ''}
            </div>`;
        // 28 ottobre (Paolo): le note nella ⓘ (o sotto il tasto).
        e.note.forEach(n => M.nota('step-modifiers', e.strumento || 'Supporto', n, { tipo: 'regole' }));

        const btn = (document.getElementById('btn-esegui-calcolo') || document.querySelector('#step-modifiers .huge-btn'));
        if (btn) {
            const nuovo = btn.cloneNode(true);
            btn.parentNode.replaceChild(nuovo, btn);
            // 🔴 Il display si rende esplicito SEMPRE: cloneNode(true) copia lo
            // style inline, e se chi ha usato la schermata prima lo aveva
            // nascosto il clone nasceva invisibile. Etichetta giusta,
            // onclick funzionante, pulsante non cliccabile.
            nuovo.style.display = '';
            // A distanza i requisiti sono quelli di un BS Attack: Linea di
            // Tiro e gittata. Se mancano, il tasto diventa IDLE.
            const req = window.requisitiSupporto();
            nuovo.onclick = function () { return (req && req.idle) ? M.idleDaRequisito(req) : window.eseguiCalcoloSupporto(); };
            nuovo.innerText = (req && req.idle) ? 'IDLE' : 'ESEGUI ' + e.strumento.toUpperCase();
            if (M.COLORE_TASTO) nuovo.style.background = (req && req.idle) ? M.COLORE_TASTO.idle : M.COLORE_TASTO.valido;
        }
    };

    // MediKit e GizmoKit hanno le due modalità; Dottore e Ingegnere no.
    window.supportoEquipaggiamento = function (e) {
        return e && (e.strumento === 'MediKit' || e.strumento === 'GizmoKit');
    };
    // 22 ottobre (Paolo, SUP-02b): a distanza la barra delle gittate del
    // MediKit / GizmoKit, con FUORI in coda, e il tasto della Linea di Tiro:
    // come nella scheda dell'Attacco BS.
    window.barraGittataSupporto = function (t, bande) {
        if (!t || !bande.length) return '';
        const lofNo = t.lof === false;
        // 28 ottobre: la barra e` del motore (M.barraGittata), coi numeri sui confini.
        return window.MotoreN5.barraGittata(bande, { indice: t.rangeIndex || 0, tocco: (i) => `window.setTargetRangeSupporto(${i})`,
                fuori: "window.toggleRequisitoSupporto('gittata')", fuoriAttivo: !!t.fuoriGittata, stile: 'margin-top:10px;' }) + `
            <button class="huge-btn" style="width:100%; margin:10px 0 0; min-height:48px; font-size:var(--fs-m); ${window.MotoreN5.stileColore(lofNo ? 'attenzione' : 'si')}" onclick="window.toggleRequisitoSupporto('lof')">${lofNo ? 'LINEA DI TIRO NO' : 'LINEA DI TIRO SÌ'}</button>`;
    };
    window.setTargetRangeSupporto = function (i) {
        const t = window.combatTargets && window.combatTargets[0]; if (!t) return;
        t.rangeIndex = i; t.fuoriGittata = false;
        window.renderSupporto();
    };
    window.toggleRequisitoSupporto = function (chiave) {
        const M = motore(); if (!M) return;
        if (M.invertiRequisito(window.combatTargets && window.combatTargets[0], chiave)) window.renderSupporto();
    };
    window.requisitiSupporto = function () {
        const M = motore(); if (!M || window.supportoInContatto !== false) return null;
        const e = window.supportoEsito;
        if (!e || !e.tiroPerColpire) return null;
        return M.requisitiDichiarati((window.combatTargets || []).slice(0, 1), ['lof', 'gittata']);
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
        // 18 ottobre (SUP-02/SUP-04): a distanza il tiro per colpire ha il
        // Burst dell'equipaggiamento del profilo — GizmoKit(+1B) tira 2 dadi.
        if (e.tiroPerColpire && typeof M.burstIniziale === 'function') {
            const voce = M.dividiLista(((unita && unita.weapon) || '') + ',' + ((unita && unita.equip) || ''))
                .find(n => String(n).toUpperCase().indexOf(String(e.strumento || '').toUpperCase()) === 0);
            const arma = voce ? M.profiloArma(voce) : null;
            if (arma && !arma.nonTrovata) e.tiroPerColpire.burst = M.burstIniziale(unita, arma, { azione: M.AZIONI.SUPPORTO_BS }).valore;
        }

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

        // 18 ottobre (Paolo, SUP-01): il Supporto non mandava l'allarme ARO,
        // e l'avversario non poteva reagire. "Non e` un ARO" (catalogo) vuol
        // dire che non si dichiara COME reazione; dichiarato nel proprio
        // Turno attiva la truppa e genera ARO come ogni Ordine. L'allarme
        // parte qui, nella prima meta`; in seconda meta` e` gia` partito.
        const opz = { isCoordinated: window.coordMode };
        if (!window.currentOrder.isSecondHalf && typeof M.allarmeOrdine === 'function') {
            const al = M.allarmeOrdine(window.currentOrder.action, { unita: window.coordUnits[0], coordUnits: window.coordUnits, coordMode: window.coordMode });
            if (al.payload && typeof window.inviaAllarmeAro === 'function') window.inviaAllarmeAro(al.payload);
            opz.aroAtteso = !!(al.aro && al.aro.genera);
        }
        const spedito = M.inviaCalcolo(window.coordPayloads, opz);
        if (!spedito) { window.coordIndex--; window.coordPayloads.pop(); return; }

        const calcDiv = document.getElementById('calc-result');
        if (calcDiv) {
            calcDiv.innerHTML = `
                <div style="text-align:center; padding:20px; border:2px solid ${COL.bordo}; background:rgba(0,204,255,0.1); margin-top:20px;">
                    <h2 style="color:${COL.bordo}; margin:0;">SUPPORTO INVIATO</h2>
                    <p style="font-size:var(--fs-xs); color:var(--mn-debole,#aaaaaa);">${e.strumento}: tira ${e.nomeChiTira} su ${e.attributo} ${e.valore}.</p>
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
    var v = { file: 'ordine_supporto.js', versione: '2026-10-28.4', proprieta: 'MOTORE' };
    if (g.MotoreN5 && g.MotoreN5.dichiaraVersione) g.MotoreN5.dichiaraVersione(v.file, v.versione, v.proprieta);
    else { g.__versioniN5 = g.__versioniN5 || []; g.__versioniN5.push(v); }
})();
