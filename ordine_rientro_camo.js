// @versione 2026-10-06.4 | ordine_rientro_camo.js | proprieta`: chat MOTORE
// ==========================================
// 🎭 ENTRARE IN FORMA DI MARKER (N5) - ordine_rientro_camo.js
// ------------------------------------------
// DUE Abilita`, una schermata. Tutte e due sono Ordini Interi senza tiro e
// senza bersaglio, tutte e due chiedono al giocatore la Linea di Tiro dei
// nemici (l'app non ha la mappa), tutte e due finiscono con un Modello
// sostituito da un Marker:
//
//   RIENTRARE IN CAMO   chi ha Camouflage ed e` stato rivelato torna Marker
//                       CAMO. Riga 13603 (Camouflaged State, ACTIVATION).
//                       Motore: M.puoRientrareInCamo, M.rientraInCamo.
//   CYBERMASK           l'Hacker entra in IMP-2. Righe 5150-5171.
//                       Motore: M.puoUsareCybermask, M.attivaCybermask.
//
// Il nome del file e delle funzioni resta "rientro camo": app.html e i
// banchi li caricano e li chiamano con quel nome, e una seconda schermata
// identica sarebbe stata una seconda copia da tenere allineata.
//
// 🔴 LA DOMANDA HA TRE ESITI (M.valutaDomande): NON RISPOSTO non esegue mai.
// Col NO le due Abilita` fanno LA STESSA COSA (chat REGOLE, 6 ottobre):
// la LoF e` un Requisito per tutte e due (righe 13603 e 5155), e un
// Requisito che manca si risolve con un IDLE — l'Ordine E` speso (righe
// 1240-1247). Fino alla 2026-10-06.1 il rientro in CAMO era VIETATO
// (Ordine non speso): lettura ritirata. Il valore sta nel catalogo.
// Il Cybermask si puo` dichiarare anche da Marker CAMO: il router fa
// cadere il CAMO alla dichiarazione, come per ogni Long Skill.
// La schermata non decide niente di tutto questo: legge l'esito dal motore.
//
// LA SEQUENZA (chat REGOLE, 5 ottobre): l'Abilita` si dichiara, gli ARO si
// dichiarano subito dopo, gli effetti arrivano nella Risoluzione. Quindi
// l'allarme parte con la truppa ancora MODELLO, e chi reagisce NON ha le
// restrizioni degli ARO contro un Marker: puo` dichiarare BS Attack, CC,
// Hacking. Il Marker protegge dall'Ordine successivo, non da questo.
// L'app applica lo stato all'invio della busta e non sa l'esito dell'ARO:
// lo dice in una nota (decisione di Paolo: note, non domande).
// ==========================================

(function () {
    'use strict';

    function motore() {
        if (!window.MotoreN5) {
            alert('⛔ motore_regole_n5.js non è caricato: questa Abilità non può funzionare.');
            return null;
        }
        return window.MotoreN5;
    }

    const COL = { bordo: '#66aa88', sfondo: '#18251f' };

    // Le due Abilita`. `ok` e` l'esito del motore che vuol dire "entra".
    // Tutto cio` che e` regola (chi puo`, le domande, l'esito) viene dalle
    // due funzioni del motore; qui ci sono solo i testi della schermata.
    function abilita(M, actionId) {
        const TAB = {};
        TAB[M.AZIONI.RIENTRO_CAMO] = {
            titolo: 'RIENTRARE IN CAMO', fatto: 'RIENTRATO IN CAMO', riquadro: '🎭 RIENTRA IN CAMO',
            pulsante: 'RIENTRA IN CAMO', ok: 'RIENTRA',
            puo: function (u) { return M.puoRientrareInCamo(u, { inAro: false }); },
            esegui: function (u, R) { return M.rientraInCamo(u, R, { inAro: false }); },
            regole: function (e) { return { rientraInCamo: e.esito === 'RIENTRA' }; }
        };
        TAB[M.AZIONI.CYBERMASK] = {
            titolo: 'CYBERMASK', fatto: 'CYBERMASK ATTIVO: IMP-2', riquadro: '🎭 ENTRA IN IMP-2',
            pulsante: 'ATTIVA IL CYBERMASK', ok: 'ENTRA',
            puo: function (u) { return M.puoUsareCybermask(u, { inAro: false }); },
            esegui: function (u, R) { return M.attivaCybermask(u, R, { inAro: false }); },
            regole: function (e) { return { cybermask: true, entraInImp2: e.esito === 'ENTRA' }; }
        };
        return TAB[String(actionId || '')] || null;
    }
    function abilitaCorrente(M) {
        const id = window.currentOrder && window.currentOrder.action;
        const a = abilita(M, id);
        if (!a) {
            // Mai un ripiego muto: aprire la schermata del rientro per
            // un'azione sconosciuta farebbe entrare in CAMO chi non l'ha chiesto.
            console.error('⛔ ordine_rientro_camo.js: azione non gestita: ' + id);
            alert('⛔ Azione "' + id + '" non gestita da questa schermata.');
        }
        return a;
    }

    window.avviaFaseRientroCamo = function (actionId, isSecondHalf) {
        const M = motore(); if (!M) return;
        window.currentOrder = window.currentOrder || {};
        window.currentOrder.action = actionId;
        window.currentOrder.isLongSkill = true;   // Ordine Intero
        if (!isSecondHalf) window.currentOrder.action1 = actionId;

        window.coordIndex = window.coordIndex || 0;
        window.coordPayloads = window.coordPayloads || [];
        window.rientroCamoRisposte = {};
        window.mostraRientroCamo();
    };

    // L'esito con le risposte di adesso: una funzione sola, cosi` la
    // schermata e l'esecuzione non possono leggerle in due modi.
    function cambioDiQuestoOrdine(M, unita) {
        const cs = window.ultimoCambioStato;
        return (cs && cs.cambiato && window.currentOrder && cs.azione === window.currentOrder.action &&
                cs.unita === M.nomeUnita(unita)) ? cs : null;
    }

    window.esitoRientroCamo = function () {
        const M = motore(); if (!M) return null;
        const A = abilitaCorrente(M); if (!A) return null;
        const unita = window.coordUnits[window.coordIndex];
        return A.esegui(unita, window.rientroCamoRisposte || {});
    };

    window.mostraRientroCamo = function () {
        const M = motore(); if (!M) return;
        const A = abilitaCorrente(M); if (!A) return;
        const unita = window.coordUnits[window.coordIndex];
        if (window.mostraTitoloUnitaCorrente) window.mostraTitoloUnitaCorrente();

        const container = document.getElementById('targets-allocation-container');
        if (!container) return;

        const pre = A.puo(unita);
        if (!pre.puo) {
            container.innerHTML = `<div style="background:${COL.sfondo}; border:1px solid #883333; padding:16px; border-radius:5px; text-align:center;">
                <b style="color:#ff6666; font-size:18px;">🎭 ${A.titolo} NON DISPONIBILE</b>
                <div style="color:#ccc; font-size:14px; margin-top:10px;">${pre.motivo}</div>
                ${pre.blocchi.length > 1 ? `<div style="color:#888; font-size:12px; margin-top:8px;">` +
                    pre.blocchi.slice(1).map(b => `• ${b}`).join('<br>') + `</div>` : ''}
            </div>`;
            window.aggiornaPulsanteRientroCamo('NON_DISPONIBILE');
            return window.goToStep('step-modifiers');
        }

        const esito = window.esitoRientroCamo();
        // Il router ha appena fatto cadere un Marker per dichiarare QUESTA
        // Abilita` (oggi: Cybermask da Marker CAMO)? Lo si dice, con le note
        // del motore. Si controlla che il cambio parli di questo Ordine.
        const cambio = cambioDiQuestoOrdine(M, unita);
        // Le domande sono del motore e possono essere PIU` di una (chi ha
        // Frenzy ne ha due): si mostrano tutte, in ordine, e le risposte
        // stanno per id. Una schermata che ne mostrasse una sola lascerebbe
        // l'altra NON RISPOSTA per sempre.
        const R = window.rientroCamoRisposte || {};
        const riquadro = function (d) {
            const r = R[d.id];
            // Il colore segue l'ESITO della risposta, non la parola: rosso se
            // vieta, arancio se porta a un Idle, verde se lascia passare.
            const cattivo = (d.seBloccata === 'IDLE') ? 'background:#553300; border-color:#ffaa33;' : 'background:#440000; border-color:#ff3333;';
            const buono = 'background:#004400; border-color:#00ff00;';
            const coloreSi = (d.rispostaBloccante === false) ? buono : cattivo;
            const coloreNo = (d.rispostaBloccante === false) ? cattivo : buono;
            return `<div style="background:${COL.sfondo}; border:1px solid ${COL.bordo}; padding:14px; border-radius:5px; margin-bottom:10px;">
                <div style="color:#fff; font-size:16px; margin-bottom:12px;">${d.testo}</div>
                <div style="display:flex; gap:8px;">
                    <button class="huge-btn" style="flex:1; min-height:50px; ${r === true ? coloreSi : 'background:#111;'}"
                        onclick="window.rispondiRientroCamo('${d.id}', true)">SÌ</button>
                    <button class="huge-btn" style="flex:1; min-height:50px; ${r === false ? coloreNo : 'background:#111;'}"
                        onclick="window.rispondiRientroCamo('${d.id}', false)">NO</button>
                </div>
            </div>`;
        };

        container.innerHTML = `
            <h2 style="color:${COL.bordo}; text-align:center; margin-bottom:8px;">🎭 ${A.titolo}</h2>
            <div style="color:#aaa; font-size:13px; text-align:center; margin-bottom:16px;">
                Ordine Intero, nessun tiro. Il calcolatore non ha la mappa.</div>

            ${pre.unUso ? `<div style="margin-bottom:12px; padding:10px; background:#2a2410; border:1px solid #ccaa44; border-radius:4px; color:#eedd99; font-size:13px;">
                ⚠️ Camouflage (1 Use): rientrando si consuma l'unico uso (FAQ F07).</div>` : ''}
            ${(pre.avvisi || []).map(a => `<div style="margin-bottom:12px; padding:10px; background:#2a2410; border:1px solid #ccaa44; border-radius:4px; color:#eedd99; font-size:13px;">⚠️ ${a}</div>`).join('')}

            ${cambio ? `<div style="margin-bottom:12px; padding:10px; background:#2a2410; border:1px solid #ccaa44; border-radius:4px; color:#eedd99; font-size:13px;">
                ⚠️ ${cambio.note.join('<br>')}</div>` : ''}

            ${pre.domande.map(riquadro).join('')}

            ${esito.esito === 'VIETATO' ? `<div style="margin-top:14px; padding:14px; background:#330000; border:2px solid #ff3333; border-radius:5px;">
                <b style="color:#ff6666; font-size:16px;">⛔ NON SI PUÒ: ${A.titolo}</b>
                <div style="color:#ddd; font-size:13px; margin-top:8px;">${esito.motivo}</div>
                <div style="color:#ffaaaa; font-size:13px; margin-top:6px;">L'Ordine NON è speso: torna indietro e dichiara altro.</div>
            </div>` : ''}

            ${esito.esito === 'IDLE' ? `<div style="margin-top:14px; padding:14px; background:#332200; border:2px solid #ffaa33; border-radius:5px;">
                <b style="color:#ffaa33; font-size:16px;">⚠️ LA TRUPPA ESEGUE UN IDLE</b>
                <div style="color:#ddd; font-size:13px; margin-top:8px;">${esito.motivo}</div>
                <div style="color:#ffcc88; font-size:13px; margin-top:6px;">L'Ordine è comunque speso. Se puoi, torna indietro e dichiara altro.</div>
            </div>` : ''}

            ${esito.esito === A.ok ? `<div style="margin-top:14px; padding:14px; background:#16281e; border:2px solid #66cc99; border-radius:5px;">
                <b style="color:#88ffbb; font-size:16px;">${A.riquadro}</b>
                <div style="color:#999; font-size:12px; margin-top:8px; line-height:1.6;">
                    ${esito.note.map(n => `• ${n}`).join('<br>')}
                </div>
            </div>` : ''}`;

        window.aggiornaPulsanteRientroCamo(esito.esito);
        window.goToStep('step-modifiers');
    };

    window.rispondiRientroCamo = function (id, v) {
        window.rientroCamoRisposte = window.rientroCamoRisposte || {};
        window.rientroCamoRisposte[id] = v;
        window.mostraRientroCamo();
    };

    window.aggiornaPulsanteRientroCamo = function (esito) {
        const M = motore();
        const A = M ? abilita(M, window.currentOrder && window.currentOrder.action) : null;
        const ETICHETTE = {
            NON_DISPONIBILE: 'NON DISPONIBILE',
            NON_RISPOSTO: 'RISPONDI ALLE DOMANDE',
            VIETATO: 'NON CONSENTITO',
            IDLE: 'ESEGUI IDLE'
        };
        if (A) ETICHETTE[A.ok] = A.pulsante;
        const btn = document.getElementById('btn-esegui-calcolo') ||
                    document.querySelector('#step-modifiers .huge-btn');
        if (!btn) return;
        const nuovo = btn.cloneNode(true);
        btn.parentNode.replaceChild(nuovo, btn);
        // cloneNode(true) copia lo style inline: il display va reso esplicito
        // (stesso difetto gia` trovato in Trincerarsi).
        nuovo.style.display = '';
        nuovo.onclick = function () { window.eseguiRientroCamo(); };
        nuovo.innerText = ETICHETTE[esito] || 'RISPONDI ALLE DOMANDE';
    };

    window.eseguiRientroCamo = function () {
        const M = motore(); if (!M) return;
        const A = abilitaCorrente(M); if (!A) return;
        const azione = window.currentOrder.action;
        const unita = window.coordUnits[window.coordIndex];
        const esito = window.esitoRientroCamo();

        if (esito.esito === 'NON_DISPONIBILE') return alert(`⛔ ${esito.motivo}\n\nL'ordine non è stato eseguito.`);
        if (esito.esito === 'NON_RISPOSTO') return alert('⚠️ ' + (esito.motivo || 'Manca una risposta.') + ' Rispondi prima di procedere.');
        if (esito.esito === 'VIETATO') return alert(`⛔ ${esito.motivo}\n\nL'Ordine NON è speso.`);

        window.coordPayloads.push({
            attaccante: unita,
            azione: azione,
            arma: null,
            bersagli: [],
            burstDisponibile: 0,
            regole: Object.assign({
                senzaTiro: true,
                isLongSkill: true,
                idle: esito.esito === 'IDLE',
                nuovoMarker: !!esito.nuovoMarker,
                motivo: esito.motivo || null,
                note: ((cambioDiQuestoOrdine(M, unita) || {}).note || []).concat(esito.note || [])
            }, A.regole(esito))
        });
        // Lo stato si applica alla FINE, dopo l'allarme e l'invio: fino ad
        // allora la truppa e` un Modello (vedi LA SEQUENZA in testa).
        window.rientriCamoInSospeso = (window.rientriCamoInSospeso || []).concat([{ unita: unita, esito: esito }]);

        window.coordIndex++;
        if (window.coordIndex < window.coordUnits.length) {
            window.rientroCamoRisposte = {};
            return window.mostraRientroCamo();
        }

        const al = M.allarmeOrdine(azione, {
            unita: unita, coordUnits: window.coordUnits, coordMode: window.coordMode,
            azioneSeconda: window.currentOrder && window.currentOrder.action
        });
        if (al.payload && typeof window.inviaAllarmeAro === 'function') window.inviaAllarmeAro(al.payload);
        const aro = al.aro;
        const spedito = M.inviaCalcolo(window.coordPayloads, { isCoordinated: window.coordMode, aroAtteso: !!(aro && aro.genera) });
        if (!spedito) {
            window.coordIndex--; window.coordPayloads.pop();
            window.rientriCamoInSospeso.pop();
            return;
        }

        // Ora lo stato: l'unita` aggiornata la calcola il motore, la
        // sostituisce l'app (window.sostituisciUnita, motore_core.js), che
        // avvisa anche l'Hub.
        const sospesi = window.rientriCamoInSospeso; window.rientriCamoInSospeso = [];
        sospesi.forEach(function (s) {
            if (typeof window.sostituisciUnita === 'function') {
                window.sostituisciUnita(s.unita, s.esito.unitaAggiornata, azione);
            } else {
                console.error('⛔ window.sostituisciUnita manca (motore_core.js vecchio?): lo stato NON è stato applicato.');
                alert('⛔ Lo stato non è stato applicato: motore_core.js non è aggiornato.');
            }
        });

        const div = document.getElementById('calc-result');
        if (div) {
            div.innerHTML = `<div style="text-align:center; padding:20px; border:2px solid ${COL.bordo}; background:rgba(102,170,136,0.1); margin-top:20px;">
                <h2 style="color:${COL.bordo}; margin:0;">${esito.esito === A.ok ? A.fatto : 'IDLE'}</h2>
                <p style="font-size:13px; color:#ccc;">${(esito.note || [])[0] || esito.motivo || ''}</p>
            </div>`;
            div.style.display = 'block';
        }
    };

    console.log('🎭 ordine_rientro_camo.js caricato.');
})();

// Dichiarazione di versione per il controllo incrociato fra chat.
(function () {
    var g = (typeof window !== 'undefined') ? window : globalThis;
    var v = { file: 'ordine_rientro_camo.js', versione: '2026-10-06.4', proprieta: 'MOTORE' };
    if (g.MotoreN5 && g.MotoreN5.dichiaraVersione) g.MotoreN5.dichiaraVersione(v.file, v.versione, v.proprieta);
    else { g.__versioniN5 = g.__versioniN5 || []; g.__versioniN5.push(v); }
})();
