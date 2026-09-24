// @versione 2026-09-14.2 | ordine_attacco_guidato.js | proprieta`: chat MOTORE
// ==========================================
// 🚀 ATTACCO GUIDATO (N5) - ordine_attacco_guidato.js
// ------------------------------------------
// RISCRITTO sopra MotoreN5. Solo interfaccia: le regole stanno nel motore.
//
// Errori della versione precedente (verificati sulla wiki N5.2):
//
//  1. L'ARMA ERA INVENTATA. Forzava currentOrder.weapon a
//     "Smart Missile (Guided)", che nel database armi non esiste. Il
//     profilo tornava generico, la barra della gittata mostrava bande
//     finte, e il payload spediva comunque bands:[{mod:0}] — cioè la
//     gittata scelta dal giocatore veniva buttata via.
//
//  2. L'ARMA DEVE ESSERE LA BLAST MODE. Regola: "BS Attacks (Guided) must
//     be carried out with the weapon's Blast Mode if it has one, or a Mode
//     with the Impact Template trait". Il modulo non sceglieva nulla.
//
//  3. IL BURST NON È SEMPRE 1. Viene dalla modalità Blast usata. Prima era
//     scritto a mano nel payload.
//
//  4. LA SKILL NON ERA CONTROLLATA. Chiunque poteva dichiarare un Guidato;
//     serve "BS Attack (Guided)" nel profilo.
//
// Confermato invece quel che il modulo già faceva bene: solo il Primario
// fa il Faccia a Faccia, i Secondari solo il Tiro Salvezza; e Mimetismo
// e Copertura si ignorano. La gittata invece SI applica, misurata in
// linea retta fra attaccante e bersaglio.
// ==========================================

(function () {
    'use strict';

    function motore() {
        if (!window.MotoreN5) {
            alert('⛔ motore_regole_n5.js non è caricato: l\'Attacco Guidato non può funzionare.');
            return null;
        }
        return window.MotoreN5;
    }

    const COL = { bordo: '#ff3333', accent: '#00ccff' };

    window.primaryGuidedTarget = null;
    window.secondaryGuidedTargets = [];

    window.avviaFaseGuidato = function (actionId, isSecondHalf) {
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
            window.primaryGuidedTarget = null;
            window.secondaryGuidedTargets = [];
            window.startUnitGuidatoLoop();
        } else {
            window.preparaModificatoriGuidati();
        }
    };

    // ==============================================================
    // 1. SELEZIONE ARMA (solo Blast Mode)
    // ==============================================================
    window.startUnitGuidatoLoop = function () {
        const M = motore(); if (!M) return;
        const unita = window.coordUnits[window.coordIndex];
        if (window.mostraTitoloUnitaCorrente) window.mostraTitoloUnitaCorrente();

        const esito = M.armiGuidate(unita);
        const container = document.getElementById('weapon-buttons-container');

        container.innerHTML = `<div style="background:#220000; border:1px solid ${COL.bordo}; padding:10px; margin-bottom:15px; text-align:center; color:#fff; border-radius:5px;">
            <b style="color:${COL.bordo}; font-size:20px;">🚀 ATTACCO GUIDATO</b><br>
            <span style="font-size:14px; color:#ccc;">BS ${unita.bs || '?'} · solo Turno Attivo · non richiede LoF</span>
        </div>`;

        // La Skill è un requisito: se manca, si dice e non si va avanti.
        if (esito.avvisi.length > 0) {
            container.innerHTML += `<div style="padding:12px; background:#330000; border:1px solid ${COL.bordo}; border-radius:5px; color:#ffaaaa; font-size:14px; margin-bottom:12px;">
                ⛔ ${esito.avvisi[0].messaggio}<br><span style="color:#cc8888;">${esito.avvisi[0].dettaglio || ''}</span></div>`;
        }

        if (esito.armi.length === 0) {
            container.innerHTML += `<p style="color:#ff3333; text-align:center; font-size:18px;">
                ❌ Nessuna Blast Mode disponibile. L'Attacco Guidato richiede la modalità Blast dell'arma, o una modalità col Tratto Impact Template.</p>`;
        } else {
            esito.armi.forEach(function (p) {
                const gittata = p.bands.map(b => `${b.mod > 0 ? '+' : ''}${b.mod}`).join(' / ');
                // 🔴 Si passa il nome GREZZO, non quello spogliato.
                // Le notazioni del profilo — (PS=6), (+1B), (SR-1) —
                // vivono nel nome, e il modulo salva una stringa e poi la
                // ririsolve: spogliandola, il Morlock faceva tirare ARM
                // VS 9 invece di VS 7. Nei due database sono 227 notazioni
                // d'arma che passano da qui.
                const nomeEsc = (p.nomeRichiesto || p.nome).replace(/'/g, "\\'");
                container.innerHTML += `<button class="huge-btn" style="border-color:${COL.bordo};" onclick="window.declareGuidatoAttack('${nomeEsc}')">
                    ${p.nome}<br><span style="color:${COL.bordo}; font-size:14px;">B${p.burst} | ${p.ammo} | Sagoma ${p.template || 'Circolare'} | ${gittata}</span>
                </button>`;
            });
        }

        if (esito.escluse.length > 0) {
            container.innerHTML += `<div style="margin-top:15px; padding:10px; background:#111; border:1px solid #444; border-radius:5px; color:#888; font-size:13px;">
                <b style="color:#aaa;">Non utilizzabili per il Guidato:</b><br>` +
                esito.escluse.map(x => `• <b>${x.nome}</b> — ${x.motivo}`).join('<br>') + `</div>`;
        }

        window.goToStep('step-weapon');
    };

    window.declareGuidatoAttack = function (nomeArma) {
        window.currentOrder.weapon = nomeArma;
        window.renderSelezioneBersagliGuidato();
    };

    // ==============================================================
    // 2. PRIMARIO (Bersagliato) + SECONDARI (sagoma)
    // ==============================================================
    window.renderSelezioneBersagliGuidato = function () {
        const M = motore(); if (!M) return;
        const unita = window.coordUnits[window.coordIndex];
        if (window.mostraTitoloUnitaCorrente) window.mostraTitoloUnitaCorrente();

        const nemici = M.rosterNemico();
        if (nemici.length === 0) return alert('⚠️ Nessuna unità nemica sul tavolo.');

        // Il primario deve essere Bersagliato: lo decide il motore, col ruolo.
        const primari = M.bersagliValidi(M.AZIONI.GUIDATO, nemici, { attaccante: unita, ruolo: 'primario' });
        const secondari = M.bersagliValidi(M.AZIONI.GUIDATO, nemici, { attaccante: unita, ruolo: 'secondario' });

        const ammessiPrim = primari.filter(g => g.ammesso);
        const container = document.getElementById('enemy-target-buttons');

        const btnStd = document.querySelector('#step-wait-aro .huge-btn');
        if (btnStd) btnStd.style.display = 'none';

        container.innerHTML = `
            <div style="background:#220000; border:1px solid ${COL.bordo}; padding:10px; border-radius:5px; margin-bottom:10px; text-align:center;">
                <b style="color:${COL.bordo};">🎯 BERSAGLIO PRIMARIO — dev'essere Bersagliato</b><br>
                <span style="color:#aaa; font-size:12px;">Su di lui si centra la Sagoma. È l'unico che fa il Tiro Faccia a Faccia.</span>
            </div>
            <div id="primary-guided-container" style="margin-bottom:20px;"></div>

            <div style="background:#002244; border:1px solid ${COL.accent}; padding:10px; border-radius:5px; margin-bottom:10px; text-align:center;">
                <b style="color:${COL.accent};">💥 SECONDARI — presi dalla Sagoma</b><br>
                <span style="color:#aaa; font-size:12px;">Fanno solo il proprio Tiro Salvezza: nessun tiro d'attacco dedicato.</span>
            </div>
            <div id="secondary-guided-container"></div>

            <button class="huge-btn" style="background:#004400; border-color:#00ff00; min-height:60px; margin-top:20px; width:100%;"
                onclick="window.confermaBersagliSagomaGuidato()">CONFERMA BERSAGLI <span>(Invia Allarme ARO)</span></button>`;

        const prim = document.getElementById('primary-guided-container');
        if (ammessiPrim.length === 0) {
            const motivi = primari.filter(g => !g.ammesso).map(g => `• <b>${g.nome}</b> — ${g.motivo}`).join('<br>');
            prim.innerHTML = `<p style="color:#ff3333; text-align:center; font-weight:bold;">Nessun bersaglio in Stato Bersagliato sul tavolo.</p>
                <div style="color:#888; font-size:12px; margin-top:8px;">${motivi}</div>`;
        } else {
            ammessiPrim.forEach(function (g) {
                const scelto = window.primaryGuidedTarget && window.primaryGuidedTarget.id === g.unita.id;
                prim.innerHTML += `<button class="huge-btn" style="min-height:60px; font-size:20px; background:${scelto ? '#8b0000' : '#111'}; border-color:${COL.bordo}; margin-bottom:5px; width:100%;"
                    onclick="window.togglePrimaryGuided('${String(g.unita.id).replace(/'/g, "\\'")}')">[${g.unita.tipo || 'LI'}] ${g.nome}</button>`;
            });
        }

        const sec = document.getElementById('secondary-guided-container');
        const altri = secondari.filter(g => g.ammesso &&
            !(window.primaryGuidedTarget && window.primaryGuidedTarget.id === g.unita.id));
        if (altri.length === 0) {
            sec.innerHTML = `<p style="color:#888; text-align:center;">Nessun altro nemico coinvolgibile.</p>`;
        } else {
            altri.forEach(function (g) {
                const scelto = window.secondaryGuidedTargets.some(x => x.id === g.unita.id);
                sec.innerHTML += `<button class="huge-btn" style="min-height:60px; font-size:20px; background:${scelto ? '#003366' : '#111'}; border-color:${COL.accent}; margin-bottom:5px; width:100%;"
                    onclick="window.toggleSecondaryGuided('${String(g.unita.id).replace(/'/g, "\\'")}')">[${g.unita.tipo || 'LI'}] ${g.nome}</button>`;
            });
        }

        window.goToStep('step-wait-aro');
    };

    window.togglePrimaryGuided = function (id) {
        const M = motore(); if (!M) return;
        const u = M.rosterNemico().find(x => String(x.id) === String(id));
        if (!u) return;
        window.primaryGuidedTarget = u;
        // se era fra i secondari, esce
        window.secondaryGuidedTargets = window.secondaryGuidedTargets.filter(x => x.id !== u.id);
        window.renderSelezioneBersagliGuidato();
    };

    window.toggleSecondaryGuided = function (id) {
        const M = motore(); if (!M) return;
        const i = window.secondaryGuidedTargets.findIndex(x => String(x.id) === String(id));
        if (i >= 0) window.secondaryGuidedTargets.splice(i, 1);
        else {
            const u = M.rosterNemico().find(x => String(x.id) === String(id));
            if (u) window.secondaryGuidedTargets.push(u);
        }
        window.renderSelezioneBersagliGuidato();
    };

    window.confermaBersagliSagomaGuidato = function () {
        if (!window.primaryGuidedTarget) {
            return alert('⛔ Devi scegliere un Bersaglio Primario in Stato Bersagliato: è su di lui che si centra la Sagoma.');
        }
        window.pendingTargets = [window.primaryGuidedTarget].concat(window.secondaryGuidedTargets);

        const btnStd = document.querySelector('#step-wait-aro .huge-btn');
        if (btnStd) btnStd.style.display = 'block';

        if (window.confirmMultiAro) window.confirmMultiAro(false);
    };

    // ==============================================================
    // 3. MODIFICATORI (solo la gittata del Primario)
    // ==============================================================
    window.preparaModificatoriGuidati = function () {
        const M = motore(); if (!M) return;
        if (window.mostraTitoloUnitaCorrente) window.mostraTitoloUnitaCorrente();

        if (!window.combatTargets || window.combatTargets.length === 0) {
            alert('⛔ Nessun bersaglio confermato.\n\nL\'Attacco Guidato richiede un Primario in Stato Bersagliato.');
            return window.renderSelezioneBersagliGuidato();
        }

        const arma = M.profiloArma(window.currentOrder.weapon);
        const primo = window.combatTargets[0];
        if (typeof primo.rangeIndex !== 'number' || primo.rangeIndex < 0 || primo.rangeIndex >= arma.bands.length) primo.rangeIndex = 0;

        // La gittata del Primario vale per tutti: la Sagoma è una sola.
        window.combatTargets.forEach(function (t, i) {
            t.rangeIndex = primo.rangeIndex;
            t.rangeMod = arma.bands.length ? arma.bands[primo.rangeIndex].mod : 0;
            t.cover = false;
            t.ammo = arma.ammo;
            t.burst = (i === 0) ? (arma.burst || 1) : 0;
            t.ruolo = (i === 0) ? 'principale' : 'secondario';
        });

        window.renderGuidato();
        window.goToStep('step-modifiers');
    };

    window.renderGuidato = function () {
        const M = motore(); if (!M) return;
        const unita = window.coordUnits[window.coordIndex];
        const arma = M.profiloArma(window.currentOrder.weapon);
        const primo = window.combatTargets[0];
        const regole = M.regoleGuidato(arma, { rangeIndex: primo.rangeIndex });

        let segmenti = '', etichette = '';
        arma.bands.forEach(function (b, i) {
            let cls = 'seg-2';
            if (b.mod > 0) cls = 'seg-1'; else if (b.mod === -3) cls = 'seg-3'; else if (b.mod < -3) cls = 'seg-4';
            const attivo = (primo.rangeIndex === i) ? 'active' : '';
            segmenti += `<div class="range-seg ${cls} ${attivo}" onclick="window.setTargetRangeGuidato(${i})">${b.mod > 0 ? '+' + b.mod : b.mod}</div>`;
            etichette += `<span>${b.label}</span>`;
        });

        const dettaglio = regole.voci.map(v =>
            `<div style="display:flex; justify-content:space-between; padding:2px 0;">
                <span style="color:#aaa;">${v.motivo}</span>
                <b style="color:${v.valore >= 0 ? '#00ff00' : '#ff6666'};">${v.valore > 0 ? '+' + v.valore : v.valore}</b>
             </div>`).join('');

        let html = `<h2 style="color:${COL.bordo}; text-align:center; margin-bottom:20px;">LANCIO MISSILI GUIDATI</h2>

            <div style="background:#220000; border:1px solid ${COL.bordo}; padding:15px; border-radius:5px; margin-bottom:20px;">
                <div style="text-align:center; margin-bottom:12px;">
                    <b style="color:#ff6666; font-size:18px;">TIRO SU BS ${unita.bs || '?'}</b><br>
                    <span style="color:#cc9999; font-size:12px;">${arma.nome} · ${arma.ammo} · Sagoma ${arma.template || 'Circolare'} · B${regole.burst}</span>
                </div>
                <div style="border-top:1px solid #553333; padding-top:10px; font-size:14px;">
                    ${dettaglio}
                    <div style="display:flex; justify-content:space-between; border-top:1px solid #553333; margin-top:8px; padding-top:8px;">
                        <b style="color:#fff;">MOD totale</b>
                        <b style="color:${regole.modTotale >= 0 ? '#00ff00' : '#ff6666'}; font-size:18px;">${regole.modTotale > 0 ? '+' + regole.modTotale : regole.modTotale}</b>
                    </div>
                </div>
            </div>`;

        window.combatTargets.forEach(function (tgt, index) {
            const primario = (index === 0);
            html += `
            <div class="target-card" style="border-left:4px solid ${primario ? COL.bordo : '#555'}; margin-bottom:15px; background:rgba(0,0,0,0.4); padding:15px; border-radius:5px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                    <b style="color:${primario ? '#fff' : '#aaa'}; font-size:22px;">${primario ? '🎯 [PRIMARIO]' : '💥 [SECONDARIO]'} ${tgt.name}</b>
                </div>`;

            if (primario) {
                html += `<div style="text-align:center; color:#aaa; font-size:12px; margin-bottom:5px;">${regole.noteGittata || 'Seleziona la gittata.'}</div>
                    <div class="range-bar">${segmenti}</div>
                    <div style="display:flex; justify-content:space-between; font-size:10px; color:#888; margin-top:4px;">${etichette}</div>
                    <div style="margin-top:10px; padding:8px; background:#001a33; border:1px solid ${COL.accent}; border-radius:5px; color:${COL.accent}; font-size:12px; text-align:center;">
                        Reazione del bersaglio: ${regole.reazioneBersaglio}
                    </div>`;
            } else {
                html += `<div style="text-align:center; padding:10px; background:#440000; border:1px solid ${COL.bordo}; color:#ff9900; font-weight:bold; border-radius:5px;">
                    💥 COINVOLTO NELLA SAGOMA<br><span style="font-size:12px; color:#fff;">Solo Tiro Salvezza. Nessun Faccia a Faccia, e il Critico qui vale come successo normale.</span></div>`;
            }
            html += `</div>`;
        });

        html += `<div style="padding:12px; background:#111; border:1px solid #444; border-radius:5px; color:#888; font-size:12px; line-height:1.7;">
            <b style="color:#aaa;">Cosa NON si applica:</b><br>
            • Mimetismo del bersaglio — ignorato<br>
            • Copertura — ignorata, e chi è colpito dalla Sagoma non ha il +3 al Tiro Salvezza<br>
            • LoF — non serve<br>
            <b style="color:#aaa;">Si applica invece:</b> la gittata, misurata in linea retta fino al bersaglio.
        </div>`;

        document.getElementById('targets-allocation-container').innerHTML = html;

        const btn = (document.getElementById('btn-esegui-calcolo') || document.querySelector('#step-modifiers .huge-btn'));
        if (btn) {
            const nuovo = btn.cloneNode(true);
            btn.parentNode.replaceChild(nuovo, btn);
            // 🔴 Il display si rende esplicito SEMPRE: cloneNode(true) copia lo
            // style inline, e se chi ha usato la schermata prima lo aveva
            // nascosto il clone nasceva invisibile. Etichetta giusta,
            // onclick funzionante, pulsante non cliccabile.
            nuovo.style.display = '';
            nuovo.onclick = function () { window.eseguiCalcoloGuidato(); };
            nuovo.innerText = 'LANCIA MISSILI';
        }
    };

    window.setTargetRangeGuidato = function (rangeIdx) {
        const M = motore(); if (!M) return;
        const arma = M.profiloArma(window.currentOrder.weapon);
        const mod = arma.bands[rangeIdx] ? arma.bands[rangeIdx].mod : 0;
        // Una sola Sagoma: la gittata del Primario vale per tutti.
        window.combatTargets.forEach(function (t) { t.rangeIndex = rangeIdx; t.rangeMod = mod; });
        window.renderGuidato();
    };

    // ==============================================================
    // 4. INVIO
    // ==============================================================
    window.eseguiCalcoloGuidato = function () {
        const M = motore(); if (!M) return;
        const unita = window.coordUnits[window.coordIndex];
        const arma = M.profiloArma(window.currentOrder.weapon);
        const regole = M.regoleGuidato(arma, { rangeIndex: window.combatTargets[0].rangeIndex });

        window.coordPayloads.push({
            attaccante: unita,
            azione: M.AZIONI.GUIDATO,
            arma: arma,
            bersagli: window.combatTargets,
            burstDisponibile: regole.burst,
            regole: {
                attributo: 'BS',
                modGittata: regole.modGittata,
                bonusBersagliato: regole.bonusBersagliato,
                modTotale: regole.modTotale,
                ignoraMimetismo: true,
                ignoraCopertura: true,
                coperturaAnnullaSalvezza: regole.coperturaAnnullaSalvezza,
                criticoSoloSulPrincipale: true,
                soloPrimarioInF2F: true
            }
        });

        window.coordIndex++;

        if (window.coordIndex < window.coordUnits.length) {
            window.combatTargets = [];
            window.pendingTargets = [];
            window.primaryGuidedTarget = null;
            window.secondaryGuidedTargets = [];
            return window.startUnitGuidatoLoop();
        }

        const spedito = M.inviaCalcolo(window.coordPayloads, { isCoordinated: window.coordMode });
        if (!spedito) {
            window.coordIndex--;
            window.coordPayloads.pop();
            return;
        }

        const calcDiv = document.getElementById('calc-result');
        if (calcDiv) {
            calcDiv.innerHTML = `
                <div style="text-align:center; padding:20px; border:2px solid ${COL.bordo}; background:rgba(255,0,0,0.1); margin-top:20px;">
                    <h2 style="color:${COL.bordo}; margin:0;">MISSILI IN VIAGGIO</h2>
                    <p style="font-size:12px; color:#aaa;">Calcolo affidato all'Hub...</p>
                </div>`;
            calcDiv.style.display = 'block';
        }
    };

    console.log('🚀 ordine_attacco_guidato.js riscritto su MotoreN5.');
})();


// Dichiarazione di versione per il controllo incrociato fra chat.
// Funziona anche se questo file si carica PRIMA del motore: in quel
// caso la versione resta in coda e il motore la raccoglie all'avvio.
(function () {
    var g = (typeof window !== 'undefined') ? window : globalThis;
    var v = { file: 'ordine_attacco_guidato.js', versione: '2026-09-14.2', proprieta: 'MOTORE' };
    if (g.MotoreN5 && g.MotoreN5.dichiaraVersione) g.MotoreN5.dichiaraVersione(v.file, v.versione, v.proprieta);
    else { g.__versioniN5 = g.__versioniN5 || []; g.__versioniN5.push(v); }
})();
