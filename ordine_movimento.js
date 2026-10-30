// @versione 2026-10-30.1 | ordine_movimento.js | proprieta`: chat MOTORE
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
        // 🔴 Se il motore RISPONDE, decide lui — anche quando dice "Breve".
        // Prima il ripiego sul menu partiva ogni volta che la risposta non era
        // Lunga: leggeva il type 'LONG_MOVE' scritto a mano in app.html, e
        // l'arrampicata di Mary Problems (Climbing Plus: Abilita` Breve)
        // tornava Lunga. Il ripiego vale SOLO se il motore non conosce
        // l'azione. (26 settembre, verificando il menu nuovo di INTERFACCIA.)
        if (info) {
            window.currentOrder.isLongSkill = (info.tipo === 'LONG_SKILL' || info.tipo === 'ENTIRE_ORDER');
        } else if (window.dbAzioniN5) {
            const a = [].concat(window.dbAzioniN5.movimento || [], window.dbAzioniN5.lunghe || [])
                        .find(x => x.id === actionId);
            // Ripiego SOLO per un'azione che il motore non conosce — e lo dice:
            // un ripiego silenzioso e` come e` nato il difetto di ARRAMPICARSI.
            console.warn(`⚠️ "${actionId}": il motore non la conosce, Abilita Lunga decisa dal type del menu.`);
            if (a && a.type && String(a.type).indexOf('LONG') >= 0) window.currentOrder.isLongSkill = true;
        }

        // 20 ottobre (Paolo): SCENDI / RISALI (moto, TAG) cambiano l'unita`
        // prima del Movimento; poi l'Ordine prosegue come un Muovere.
        if (M.AZIONI_TRASPORTO && M.AZIONI_TRASPORTO.indexOf(String(actionId).toUpperCase()) >= 0) {
            if (!window.applicaTrasporto(actionId)) return;
        }
        // 26 ottobre: RELOAD con Baggage.
        if (String(actionId).toUpperCase() === 'RICARICARE') {
            if (!window.applicaRicarica()) return;
        }
        window.eseguiMovimentoAutomatico();
    };

    // Applica smonto, rimonto o risalita sul TAG: il motore calcola, qui si
    // aggiorna il roster (unita` nuove e tolte) e si avvisa l'Hub.
    window.applicaTrasporto = function (actionId) {
        const M = motore(); if (!M) return false;
        const a = String(actionId).toUpperCase();
        const u = window.currentOrder.unit;
        const e = a === 'SCENDI DALLA MOTO' ? M.smontaMoto(u)
                : a === 'RISALI SULLA MOTO' ? M.rimontaMoto(u, window.roster)
                : a === 'SCENDI DAL TAG' ? M.scendiDalTag(u, window.roster)
                : M.risaliSulTag(u, window.roster);
        if (!e.possibile) { alert(M.accenti('⛔ ' + e.motivo)); return false; }
        const togli = (id) => { const i = (window.roster || []).findIndex(x => x && x.id === id); if (i >= 0) window.roster.splice(i, 1); };
        let chi = u;
        if (a === 'RISALI SUL TAG') {
            // Chi riceve l'Ordine da qui in poi e` il TAG: il pilota sparisce
            // (o, se e` quello della lista, torna a bordo: resta nel roster).
            chi = (window.roster || []).find(x => x && x.id === u.tagDi) || u;
            if (e.aBordo) Object.assign(u, e.aBordo); else togli(u.id);
        } else if (e.esistente) {
            // Il pilota della lista era a bordo: scende LUI.
            Object.assign(e.esistente.prima, e.esistente.dopo);
        } else {
            if (e.rimuovi) togli(e.rimuovi);
            if (e.nuova) window.roster.push(e.nuova);
        }
        if (typeof window.sostituisciUnita === 'function') window.sostituisciUnita(chi, e.unitaAggiornata, actionId);
        else Object.assign(chi, e.unitaAggiornata);
        // 29 ottobre (Paolo, LOG-05): sceso dal TAG, la seconda meta` la
        // dichiara il PILOTA, come con la moto. Prima l'Ordine restava al TAG,
        // ora vuoto: nessuna voce si poteva offrire e la schermata della
        // seconda meta` restava vuota, senza uscita.
        if (a === 'SCENDI DAL TAG') {
            const idPil = e.esistente ? e.esistente.prima.id : (e.nuova && e.nuova.id);
            const pil = (window.roster || []).find(x => x && idPil != null && x.id === idPil);
            if (pil) chi = pil;
            else console.error('\u26d4 SCENDI DAL TAG: pilota non trovato nel roster, la seconda meta` resta al TAG.');
        }
        window.currentOrder.unit = chi;
        if (window.spearheadUnit === u) window.spearheadUnit = chi;
        if (Array.isArray(window.coordUnits)) window.coordUnits = window.coordUnits.map(x => x === u ? chi : x);
        // 29 ottobre (collaudo grafico, GR-C09): le note del motore con le
        // lettere accentate vere, non "meta`".
        alert(M.accenti('✅ ' + M.nomeUnita(chi) + ': ' + (e.note || []).join('\n')));
        return true;
    };

    // RELOAD (righe 10479-10500): requisito = nella ZdC di un alleato con
    // Baggage non in Stato Nullo. Se il giocatore dice di no, il Requisito
    // e` fallito: Idle, l'Ordine e` speso e l'ARO resta (come ogni Idle).
    window.applicaRicarica = function () {
        const M = motore(); if (!M) return false;
        const u = window.currentOrder.unit || window.spearheadUnit;
        const p = M.puoRicaricare(u, window.roster);
        if (!p.puo) { alert(M.accenti('⛔ ' + p.motivo)); return false; }
        const si = confirm(M.accenti('🔄 RELOAD — ' + M.nomeUnita(u) + '\n\nÈ nella Zona di Controllo di un alleato con Baggage, non in Stato Nullo?\n' +
                           p.baggage.map(n => '• ' + n).join('\n') +
                           '\n\nOK = sì, si ricarica (' + p.armi.join(', ') + ')\nAnnulla = no: Requisito fallito, IDLE'));
        if (!si) {
            window.currentOrder.ricaricaFallita = true;
            alert('⚠️ Requisito fallito: ' + M.nomeUnita(u) + ' fa IDLE. L\'Ordine è speso e l\'avversario ha il suo ARO.');
            return true;
        }
        const r = M.ricaricaUsi(u);
        if (typeof window.sostituisciUnita === 'function') window.sostituisciUnita(u, r.unitaAggiornata, 'RICARICARE');
        else Object.assign(u, r.unitaAggiornata);
        alert(M.accenti('✅ ' + M.nomeUnita(u) + ' ricarica: ' + r.recuperati.map(x => x.arma + ' (+' + x.usi + ')').join(', ') +
              (r.esclusi.length ? '\nNon ricaricabili: ' + r.esclusi.join(', ') : '') + '\n' + r.note.join('\n')));
        return true;
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
    // L'allarme lo COSTRUISCE il motore (M.allarmeOrdine), uno per tutti gli
    // ordini senza tiro; il modulo lo spedisce. Nessuna dipendenza nuova.
    window.inviaAllarmeMovimento = function (actionId) {
        const M = motore(); if (!M) return { genera: false };
        const e = M.allarmeOrdine(actionId, {
            unita: window.currentOrder.unit, coordUnits: window.coordUnits, coordMode: window.coordMode,
            azioneSeconda: window.currentOrder.action, fuoriLoFeZdC: !!window.cautoFuoriLoF
        });
        if (!e.payload) { console.log('🏃 Nessun allarme ARO: ' + e.aro.motivo); return e.aro; }
        if (typeof window.inviaAllarmeAro === 'function') window.inviaAllarmeAro(e.payload);
        return e.aro;
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
        const esito = M.creaPayload([], { isCoordinated: window.coordMode, consentiVuoto: true,
                                          aroAtteso: !!(aro && aro.genera),
                                          // senza doppioni: in un Ordine Intero action1 e action sono la stessa
                                          azioniDichiarate: [window.currentOrder.action1, window.currentOrder.action].filter(function (a, i, l) { return a && l.indexOf(a) === i; }),
                                          attivo: M.nomeUnita(window.currentOrder.unit),
                                          // Ordine Coordinato: TUTTE le truppe che muovono, non
                                          // solo la prima. Serve al calcolo per sapere a chi e`
                                          // negata la Copertura Parziale dopo un Salto.
                                          attivi: (window.coordMode && Array.isArray(window.coordUnits)) ? window.coordUnits.map(function (u) { return M.nomeUnita(u); }) : undefined,
                                          attivoId: window.currentOrder.unit && window.currentOrder.unit.id });
        if (esito.ok && typeof window.inviaCalcoloAllHub === 'function') {
            window.inviaCalcoloAllHub(esito.payload);
        }

        document.querySelectorAll('.step-container').forEach(el => el.style.display = 'none');
        const stepMod = document.getElementById('step-modifiers');
        if (!stepMod) return;
        stepMod.style.display = 'flex';

        const cont = document.getElementById('targets-allocation-container');

        window.MotoreN5.azzeraNote('step-modifiers');
        if (cont) cont.innerHTML = '';
        const btn = (document.getElementById('btn-esegui-calcolo') || document.querySelector('#step-modifiers .huge-btn'));
        if (btn) btn.style.display = 'none';

        const info = M.azioneSenzaTiro(window.currentOrder.action, window.currentOrder.unit) ||
                     M.azioneSenzaTiro(window.currentOrder.action1, window.currentOrder.unit);
        const nome = info ? info.nome : 'Movimento';

        const calcRes = document.getElementById('calc-result');
        if (calcRes) {
            calcRes.innerHTML = `
                <div style="text-align:center; padding:20px; border:2px solid var(--mn-si,#00ff00); background:rgba(0,255,0,0.1); margin-top:20px;">
                    <h2 style="color:var(--mn-si,#00ff00); margin:0;">${nome.toUpperCase()} REGISTRATO</h2>
                    <p style="font-size:var(--fs-xs); color:var(--mn-debole,#aaaaaa);">Nessun tiro da calcolare. L'Hub risolverà eventuali ARO nemici.</p>
                    ${info && info.note ? `<p style="font-size:var(--fs-xs); color:var(--mn-spento,#888888); margin-top:8px;">${info.note}</p>` : ''}
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
            // 20 ottobre (TEST, difetto 2): le voci passano per puoFareAzione,
            // come nel ramo di app.html. Prima la seconda meta` offriva a
            // tutti SCENDI / RISALI SULLA MOTO e RISALI SUL TAG (e ogni
            // Abilita` Breve, anche quelle che il menu nasconde). L'unita` e`
            // quella dell'Ordine DOPO l'eventuale trasporto: chi e` appena
            // sceso si vede offrire RISALI, non SCENDI.
            // 29 ottobre (Paolo, DIS-07): solo le seconde meta` che stanno con
            // la prima (M.secondaMetaAmmessa): dopo RICARICARE, Move, Scoprire
            // o Idle, non un ATTACCO BS. Prima si offriva ogni Abilita` Breve.
            const insieme = (a) => typeof M.secondaMetaAmmessa !== 'function' || M.secondaMetaAmmessa(act1, a.id).ammessa;
            const offribile = (a) => insieme(a) && (typeof window.puoFareAzione !== 'function' || window.puoFareAzione(unita, a.id));
            if (window.dbAzioniN5 && typeof window.creaBottoneAzione === 'function') {
                (window.dbAzioniN5.movimento || []).filter(offribile).forEach(a => cont2.innerHTML += window.creaBottoneAzione(a, true, '#002244', '#00ffff'));
                (window.dbAzioniN5.brevi || []).filter(offribile).forEach(a => cont2.innerHTML += window.creaBottoneAzione(a, true, '#003300', '#00ff00'));
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
        window.MotoreN5.azzeraNote('step-modifiers');
        if (!cont) return;
        // 28 ottobre (piano grafico, GR-E33): il colore e` quello dell'Ordine
        // (M.coloreOrdine('CAUTO'): Ordine Intero, rosso), con l'intestazione comune.
        const M = window.MotoreN5;
        const col = M.segnaColoreOrdine(M.coloreOrdine('CAUTO'));
        cont.innerHTML = M.intestazioneOrdine({ colore: col, titolo: 'MOVIMENTO CAUTO', nota: 'Ordine Intero · il calcolatore non ha la mappa' }) + `
            <div style="background:${col.riquadro}; border:1px solid ${col.tenue}; padding:14px; border-radius:5px;">
                <div style="text-align:center; color:var(--mn-testo-2,#cccccc); font-size:var(--fs-m); margin-bottom:12px;">
                    Il movimento inizia E finisce fuori dalla LoF e dalla ZdC di ogni nemico?
                </div>
                <button type="button" class="huge-btn" style="width:100%; min-height:55px; margin-bottom:8px; ${window.MotoreN5.stileColore('si')}"
                    onclick="window.rispondiCauto(true, '${dove}')">✅ SÌ, FUORI DA LoF E ZdC — nessun ARO</button>
                <button type="button" class="huge-btn" style="width:100%; min-height:55px; background:var(--mn-nota-fondo,#1a1000); border-color:var(--mn-attenzione,#ffcc00); color:var(--mn-attenzione,#ffcc00);"
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
            <div style="background:var(--mn-fondo-tasto,#111111); border:1px solid var(--mn-bordo-spento,#555555); padding:10px; border-radius:5px; margin-bottom:15px; text-align:center; color:var(--mn-testo-2,#cccccc); font-size:var(--fs-s);">
                <b>MOVIMENTO CAUTO</b> — dichiarato ${fuori ? '<span style="color:var(--mn-si,#00ff00);">fuori da LoF e ZdC: nessun ARO</span>' : '<span style="color:var(--mn-attenzione,#ffcc00);">dentro LoF o ZdC: ARO come al solito</span>'}
                <div style="color:var(--mn-spento,#888888); font-size:var(--fs-xs); margin-top:6px;">${(aro && aro.motivo) || ''}</div>
            </div>` + cont.innerHTML;
    };

    console.log('🏃 ordine_movimento.js riscritto su MotoreN5.');
})();


// Dichiarazione di versione per il controllo incrociato fra chat.
// Funziona anche se questo file si carica PRIMA del motore: in quel
// caso la versione resta in coda e il motore la raccoglie all'avvio.
(function () {
    var g = (typeof window !== 'undefined') ? window : globalThis;
    var v = { file: 'ordine_movimento.js', versione: '2026-10-30.1', proprieta: 'MOTORE' };
    if (g.MotoreN5 && g.MotoreN5.dichiaraVersione) g.MotoreN5.dichiaraVersione(v.file, v.versione, v.proprieta);
    else { g.__versioniN5 = g.__versioniN5 || []; g.__versioniN5.push(v); }
})();
