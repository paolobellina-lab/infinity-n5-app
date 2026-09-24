// @versione 2026-09-23.2 | ordine_movimento.js | proprieta`: chat MOTORE
// ==========================================
// 🏃 MOVIMENTO E INSTRADAMENTO (N5) - ordine_movimento.js
// ------------------------------------------
// RISCRITTO sopra MotoreN5. Questo modulo non calcola niente: decide se
// l'ordine è di puro movimento o va instradato al modulo che sa risolverlo.
//
// Correzioni rispetto alla versione precedente:
//
//  1. LA LISTA ERA SCRITTA A MANO: 'MOVIMENTO', 'CAUTO', 'SALTO'. Mancava
//     ARRAMPICARSI (Climb), che è un'Abilità Lunga senza tiro: finiva nel
//     ramo dell'instradamento e chiamava selectAction('ARRAMPICARSI'),
//     che nel Vigile Urbano non esiste e ricadeva qui in un giro infinito.
//     Ora la lista sta nel catalogo, insieme a Idle, Ricaricare, Allerta,
//     Guarda Fuori e Piazza Deployable.
//
//  2. IL MOVIMENTO CAUTO GENERAVA SEMPRE L'ALLARME ARO. La regola: non
//     genera ARO SOLO se inizia e finisce fuori dalla LoF e dalla ZdC di
//     tutti i Modelli e Marker nemici. Se inizia o finisce dentro, gli ARO
//     si generano come al solito. La condizione non è deducibile dai dati,
//     quindi c'è un interruttore.
//
//  3. L'AZIONE SPEDITA NELL'ALLARME ERA SEMPRE act1, anche quando l'ordine
//     era Movimento + qualcos'altro: l'avversario vedeva "MOVIMENTO" e non
//     sapeva cosa stesse arrivando.
// ==========================================

(function () {
    'use strict';

    function motore() {
        if (!window.MotoreN5) {
            alert('⛔ motore_regole_n5.js non è caricato: il movimento non può funzionare.');
            return null;
        }
        return window.MotoreN5;
    }

    window.avviaFaseMovimento = function (actionId, isSecondHalf) {
        const M = motore(); if (!M) return;
        window.currentOrder = window.currentOrder || {};
        window.currentOrder.isSecondHalf = isSecondHalf;
        if (!isSecondHalf) window.currentOrder.action1 = actionId;
        window.currentOrder.action = actionId;
        // Ogni nuovo ordine riparte senza risposta sul Cauto: null = "non
        // ancora chiesto", diverso da false = "dentro LoF/ZdC".
        if (!isSecondHalf) window.cautoFuoriLoF = null;

        window.pendingTargets = window.pendingTargets || [];
        window.combatTargets = window.combatTargets || [];
        window.currentOrder.weapon = window.currentOrder.weapon || 'NONE';

        // Abilità Lunga: il catalogo lo sa, non serve interrogare dbAzioniN5.
        const info = M.azioneSenzaTiro(actionId, window.currentOrder.unit);
        if (info && (info.tipo === 'LONG_SKILL' || info.tipo === 'ENTIRE_ORDER')) {
            window.currentOrder.isLongSkill = true;
        } else if (window.dbAzioniN5) {
            const a = [].concat(window.dbAzioniN5.movimento || [], window.dbAzioniN5.lunghe || [])
                        .find(x => x.id === actionId);
            if (a && a.type && String(a.type).indexOf('LONG') >= 0) window.currentOrder.isLongSkill = true;
        }

        window.eseguiMovimentoAutomatico();
    };

    window.eseguiMovimentoAutomatico = function () {
        const M = motore(); if (!M) return;
        const isSecondHalf = window.currentOrder.isSecondHalf;
        const act1 = window.currentOrder.action1 || '';
        const act2 = window.currentOrder.action || '';

        // Quale delle due metà richiede un calcolo? Lo decide il catalogo.
        const daRisolvere = M.azioneDaRisolvere(act1, act2);

        if (window.currentOrder.isLongSkill || isSecondHalf) {
            if (!daRisolvere) return window.chiudiOrdineMovimento();

            // Instradamento al modulo competente, come seconda metà.
            console.log(`🏃 Movimento: instrado [${daRisolvere}] al router del Core.`);
            if (typeof window.selectAction === 'function') {
                window.selectAction(daRisolvere, true);
            } else {
                alert(`⛔ Router non disponibile: impossibile aprire il modulo per "${daRisolvere}".`);
            }
            return;
        }

        // Prima metà: allarme ARO e preparazione della seconda.
        window.preparaSecondaMeta(act1);
    };

    // ==============================================================
    // ALLARME ARO
    // Estratto perché serve a DUE percorsi: la prima metà di un ordine in
    // due tempi, e gli Ordini Interi (Cauto, Arrampicarsi, Salto) che una
    // prima metà non ce l'hanno. Il codice precedente lo mandava solo dal
    // primo, quindi un Arrampicarsi non avvisava mai l'avversario.
    // ==============================================================
    window.inviaAllarmeMovimento = function (actionId) {
        const M = motore(); if (!M) return { genera: false };
        const unita = window.currentOrder.unit;
        const aro = M.generaAro(actionId, { fuoriLoFeZdC: !!window.cautoFuoriLoF });

        if (!aro.genera) {
            console.log('🏃 Nessun allarme ARO: ' + aro.motivo);
            return aro;
        }
        const payload = {
            isCoordinated: window.coordMode || false,
            attaccante: M.nomeUnita(unita),
            attaccanti: (window.coordUnits || [unita]).map(u => M.nomeUnita(u)),
            // L'azione dichiarata, non sempre act1: se l'ordine è
            // Movimento + Attacco, l'avversario deve vedere l'attacco.
            azione: M.azioneDaRisolvere(actionId, window.currentOrder.action) || actionId,
            azionePrimaMeta: actionId,
            bersagli: [],
            timestamp: Date.now()
        };
        if (typeof window.inviaAllarmeAro === 'function') window.inviaAllarmeAro(payload);
        return aro;
    };

    // ==============================================================
    // ORDINE DI PURO MOVIMENTO: nessun tiro da calcolare
    // ==============================================================
    window.chiudiOrdineMovimento = function () {
        const M = motore(); if (!M) return;

        // Ordine Intero senza prima metà: l'allarme ARO va mandato qui.
        const azione = window.currentOrder.action1 || window.currentOrder.action;
        // 🔴 Il Cauto: la domanda PRIMA dell'allarme. Prima l'allarme e il
        // payload partivano con cautoFuoriLoF ancora false, e l'interruttore
        // si disegnava dopo: l'Hub aveva gia` deciso, e cliccarlo rimandava
        // tutto una seconda volta senza effetto. Ora finche` il giocatore
        // non risponde non parte niente — come i Deployable in
        // ordine_piazzamento. (Chat TEST, segnalazione del 20 settembre.)
        if (String(azione).toUpperCase() === 'CAUTO' && window.cautoFuoriLoF == null) {
            return window.chiediCauto('chiudi');
        }
        let aro = { genera: false };
        if (!window.currentOrder.isSecondHalf) {
            aro = window.inviaAllarmeMovimento(azione);
        }

        // Nessun attacco: la busta va comunque spedita, così l'Hub sa che
        // l'ordine è finito e può risolvere gli eventuali ARO nemici.
        const esito = M.creaPayload([], { isCoordinated: window.coordMode, consentiVuoto: true });
        if (esito.ok && typeof window.inviaCalcoloAllHub === 'function') {
            window.inviaCalcoloAllHub(esito.payload);
        }

        document.querySelectorAll('.step-container').forEach(el => el.style.display = 'none');
        const stepMod = document.getElementById('step-modifiers');
        if (!stepMod) return;
        stepMod.style.display = 'flex';

        const cont = document.getElementById('targets-allocation-container');
        if (cont) cont.innerHTML = '';
        const btn = (document.getElementById('btn-esegui-calcolo') || document.querySelector('#step-modifiers .huge-btn'));
        if (btn) btn.style.display = 'none';

        const info = M.azioneSenzaTiro(window.currentOrder.action, window.currentOrder.unit) ||
                     M.azioneSenzaTiro(window.currentOrder.action1, window.currentOrder.unit);
        const nome = info ? info.nome : 'Movimento';

        const calcRes = document.getElementById('calc-result');
        if (calcRes) {
            calcRes.innerHTML = `
                <div style="text-align:center; padding:20px; border:2px solid #00ff00; background:rgba(0,255,0,0.1); margin-top:20px;">
                    <h2 style="color:#00ff00; margin:0;">${nome.toUpperCase()} REGISTRATO</h2>
                    <p style="font-size:12px; color:#aaa;">Nessun tiro da calcolare. L'Hub risolverà eventuali ARO nemici.</p>
                    ${info && info.note ? `<p style="font-size:12px; color:#888; margin-top:8px;">${info.note}</p>` : ''}
                </div>`;
            calcRes.style.display = 'block';
        }

        // Il Cauto: la risposta e` gia` data e l'allarme e` partito. Si
        // MOSTRA cosa si e` dichiarato; non si offre piu` di cambiarlo.
        if (String(azione).toUpperCase() === 'CAUTO' && cont) {
            window.renderCautoDichiarato(aro, cont);
        }
    };

    // ==============================================================
    // PRIMA METÀ: allarme ARO + bottoni per la seconda
    // ==============================================================
    window.preparaSecondaMeta = function (act1) {
        const M = motore(); if (!M) return;
        const unita = window.currentOrder.unit;

        const cauto = (String(act1).toUpperCase() === 'CAUTO');
        if (cauto && window.cautoFuoriLoF == null) return window.chiediCauto('seconda');
        const aro = window.inviaAllarmeMovimento(act1);

        // Bottoni della seconda metà
        const cont2 = document.getElementById('second-half-buttons-container');
        if (cont2) {
            cont2.innerHTML = '';
            if (window.dbAzioniN5 && typeof window.creaBottoneAzione === 'function') {
                (window.dbAzioniN5.movimento || []).forEach(a => cont2.innerHTML += window.creaBottoneAzione(a, true, '#002244', '#00ffff'));
                (window.dbAzioniN5.brevi || []).forEach(a => cont2.innerHTML += window.creaBottoneAzione(a, true, '#003300', '#00ff00'));
            }
        }

        document.querySelectorAll('.step-container').forEach(el => el.style.display = 'none');
        const step = document.getElementById('step-second-half');
        if (!step) return;
        step.style.display = 'flex';

        const wait = document.getElementById('wait-aro-msg');
        const wrap = document.getElementById('second-half-wrapper');

        if (aro.genera) {
            if (wait) wait.style.display = 'block';
            if (wrap) wrap.style.display = 'none';
        } else {
            // Senza ARO non c'è nulla da attendere: si prosegue subito.
            if (wait) wait.style.display = 'none';
            if (wrap) wrap.style.display = 'block';
        }

        // Movimento Cauto: si mostra la risposta data, prima dell'allarme.
        if (cauto) window.renderCautoDichiarato(aro);
    };

    // La domanda del Cauto, PRIMA dell'allarme. Blocca l'ordine finche` il
    // giocatore non risponde: la condizione la sa solo lui.
    window.chiediCauto = function (dove) {
        document.querySelectorAll('.step-container').forEach(el => el.style.display = 'none');
        const step = document.getElementById('step-modifiers');
        if (step) step.style.display = 'flex';
        const btn = (document.getElementById('btn-esegui-calcolo') || document.querySelector('#step-modifiers .huge-btn'));
        if (btn) btn.style.display = 'none';
        const calcRes = document.getElementById('calc-result');
        if (calcRes) { calcRes.innerHTML = ''; calcRes.style.display = 'none'; }
        const cont = document.getElementById('targets-allocation-container');
        if (!cont) return;
        cont.innerHTML = `
            <div style="background:#111; border:1px solid #ff9900; padding:14px; border-radius:5px;">
                <div style="text-align:center; color:#ccc; font-size:15px; margin-bottom:12px;">
                    <b style="color:#ff9900;">MOVIMENTO CAUTO</b><br>
                    <span style="font-size:13px;">Il movimento inizia E finisce fuori dalla LoF e dalla ZdC di ogni nemico?</span>
                </div>
                <button type="button" class="huge-btn" style="width:100%; min-height:55px; margin-bottom:8px; background:#004400; border-color:#00ff00; color:#00ff00;"
                    onclick="window.rispondiCauto(true, '${dove}')">✅ SÌ, FUORI DA LoF E ZdC — nessun ARO</button>
                <button type="button" class="huge-btn" style="width:100%; min-height:55px; background:#442200; border-color:#ff9900; color:#ff9900;"
                    onclick="window.rispondiCauto(false, '${dove}')">⚠️ NO, DENTRO LoF o ZdC — ARO come al solito</button>
            </div>`;
    };

    window.rispondiCauto = function (fuori, dove) {
        window.cautoFuoriLoF = !!fuori;
        if (dove === 'seconda') window.preparaSecondaMeta(window.currentOrder.action1);
        else window.chiudiOrdineMovimento();
    };

    // Dopo l'allarme: si mostra la risposta data, senza offrire di cambiarla.
    window.renderCautoDichiarato = function (aro, contenitore) {
        const cont = contenitore || document.getElementById('second-half-buttons-container');
        if (!cont) return;
        const fuori = !!window.cautoFuoriLoF;
        cont.innerHTML = `
            <div style="background:#111; border:1px solid #444; padding:10px; border-radius:5px; margin-bottom:15px; text-align:center; color:#ccc; font-size:13px;">
                <b>MOVIMENTO CAUTO</b> — dichiarato ${fuori ? '<span style="color:#00ff00;">fuori da LoF e ZdC: nessun ARO</span>' : '<span style="color:#ff9900;">dentro LoF o ZdC: ARO come al solito</span>'}
                <div style="color:#888; font-size:12px; margin-top:6px;">${(aro && aro.motivo) || ''}</div>
            </div>` + cont.innerHTML;
    };

    console.log('🏃 ordine_movimento.js riscritto su MotoreN5.');
})();


// Dichiarazione di versione per il controllo incrociato fra chat.
// Funziona anche se questo file si carica PRIMA del motore: in quel
// caso la versione resta in coda e il motore la raccoglie all'avvio.
(function () {
    var g = (typeof window !== 'undefined') ? window : globalThis;
    var v = { file: 'ordine_movimento.js', versione: '2026-09-23.1', proprieta: 'MOTORE' };
    if (g.MotoreN5 && g.MotoreN5.dichiaraVersione) g.MotoreN5.dichiaraVersione(v.file, v.versione, v.proprieta);
    else { g.__versioniN5 = g.__versioniN5 || []; g.__versioniN5.push(v); }
})();
