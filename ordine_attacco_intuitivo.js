// @versione 2026-10-28.4 | ordine_attacco_intuitivo.js | proprieta`: chat MOTORE
// ==========================================
// 👻 ATTACCO INTUITIVO (N5) - ordine_attacco_intuitivo.js
// ------------------------------------------
// RISCRITTO sopra MotoreN5. Solo interfaccia: le regole stanno nel motore.
//
// Tre cose che la versione precedente sbagliava (verificate sulla wiki N5.2):
//
//  1. IL TIRO È NUDO. Il regolamento dice "unmodified WIP Roll: MODs from
//     Partial Cover, Special Skills, pieces of Equipment or any other source
//     do not apply". La schermata precedente diceva "ignora Mimetismo e
//     Copertura", che è vero ma parziale: non si applica NIENTE, gittata
//     compresa. Qui infatti non c'è nessun selettore di banda.
//
//  2. UN SOLO BERSAGLIO PRINCIPALE. "If more than one enemy would be affected
//     by the Intuitive Attack, the shooter must choose only one of them as the
//     Main Target." Prima si potevano confermare più bersagli e comparivano
//     tutti con "1 B (Sagoma)", come se ognuno subisse il proprio attacco.
//
//  3. IL BERSAGLIO DEVE ESSERE UN MARKER O FUORI LoF. Prima il filtro
//     accettava chiunque non fosse morto o in Schieramento Nascosto, quindi
//     si poteva dichiarare un Intuitivo contro un nemico in piena vista —
//     che non è legale.
//
// Resta aperto un limite del database: il requisito vero è il Tratto
// "Intuitive Attack" sull'arma, non l'essere a Sagoma. RULES_WEAPONS non ha
// un campo traits, quindi il motore ripiega sulle Sagome e lo dichiara.
// ==========================================

(function () {
    'use strict';

    function motore() {
        if (!window.MotoreN5) {
            alert('⛔ motore_regole_n5.js non è caricato: l\'Attacco Intuitivo non può funzionare.');
            return null;
        }
        return window.MotoreN5;
    }

    // 28 ottobre (Paolo): il colore e` dell'ORDINE, non del modulo (M.COLORI_ORDINE nel
    // motore: Movimenti blu, Abilita` Brevi verdi, Ordini Interi rossi). COL legge le
    // tinte dell'Ordine in corso a ogni uso; 'ATTACCO INTUITIVO' e` quello di casa. Prima: { bordo: '#ff9900', sfondo: '#442200' };.
    const COL = (function () {
        const ripiego = { bordo: '#ff9900', sfondo: '#442200', riquadro: '#442200', tenue: '#ff9900', testo: '#ff9900' };
        const o = {};
        ['bordo', 'sfondo', 'riquadro', 'tenue', 'testo'].forEach(function (k) {
            Object.defineProperty(o, k, { enumerable: true, get: function () {
                const M = window.MotoreN5;
                return (M && typeof M.colOrdine === 'function') ? M.colOrdine('ATTACCO INTUITIVO')[k] : ripiego[k];
            } });
        });
        return o;
    })();

    window.avviaFaseIntuitivo = function (actionId, isSecondHalf) {
        window.currentOrder = window.currentOrder || {};
        window.currentOrder.isSecondHalf = isSecondHalf;
        window.currentOrder.isLongSkill = true;   // l'Intuitivo è una Long Skill
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
            window.startUnitIntuitivoLoop();
        } else {
            window.preparaModificatoriIntuitivo();
        }
    };

    // ==============================================================
    // 1. SELEZIONE ARMA
    // ==============================================================
    window.startUnitIntuitivoLoop = function () {
        const M = motore(); if (!M) return;
        const unita = window.coordUnits[window.coordIndex];
        if (window.mostraTitoloUnitaCorrente) window.mostraTitoloUnitaCorrente();

        const container = document.getElementById('weapon-buttons-container');

        window.MotoreN5.azzeraNote('step-weapon');
        container.innerHTML = `${window.MotoreN5.intestazioneOrdine({ colore: COL, titolo: `ATTACCO INTUITIVO`, nota: `Ordine Intero · Tiro WIP non modificato · Burst 1` })}`;

        const esito = M.armiIntuitive(unita);

        if (esito.armi.length === 0) {
            container.innerHTML += `<p style="color:var(--mn-errore,#ff3333); text-align:center; font-size:var(--fs-m);">❌ Nessuna arma utilizzabile per un Attacco Intuitivo.</p>`;
        } else {
            esito.armi.forEach(function (p) {
                const forma = p.isTemplate ? `Sagoma ${p.template || ''}`.trim() : 'Colpo singolo';
                // 🔴 Si passa il nome GREZZO, non quello spogliato.
                // Le notazioni del profilo — (PS=6), (+1B), (SR-1) —
                // vivono nel nome, e il modulo salva una stringa e poi la
                // ririsolve: spogliandola, il Morlock faceva tirare ARM
                // VS 9 invece di VS 7. Nei due database sono 227 notazioni
                // d'arma che passano da qui.
                const nomeEsc = (p.nomeRichiesto || p.nome).replace(/'/g, "\\'");
                // 9 ottobre: il bottone e` quello approvato da Paolo (M.bottoneArma).
                // 26 ottobre: gli usi Disposable dentro il bottone (M.bottoneArma, opzione usi).
                // A usi finiti il tocco spiega e non sceglie l'arma.
                const usiP = M.usiResidui ? M.usiResidui(unita, p) : null;
                const esaurita = !!(usiP && usiP.residui <= 0);
                container.innerHTML += M.bottoneArma(p, { usi: usiP, attributi: esaurita
                    ? `onclick="alert(window.MotoreN5.messaggioScarico(window.coordUnits[window.coordIndex], window.MotoreN5.profiloArma('${nomeEsc}')))"`
                    : `onclick="window.declareIntuitivoAttack('${nomeEsc}')"` });
            });
        }

        // Il limite del database si dichiara, non si nasconde.
        if (esito.avvisi.length > 0) {
            container.innerHTML += `<div style="margin-top:15px; padding:10px; background:var(--mn-nota-fondo,#1a1000); border:1px solid var(--mn-nota-bordo,#664400); border-radius:5px; color:var(--mn-nota-tenue,#cc9955); font-size:var(--fs-s);">
                ⚠️ ${esito.avvisi[0].messaggio}<br><span style="color:var(--mn-nota-tenue,#cc9955);">${esito.avvisi[0].dettaglio || ''}</span></div>`;
        }

        window.goToStep('step-weapon');
    };

    window.declareIntuitivoAttack = function (nomeArma) {
        const M0 = window.MotoreN5, u0 = window.coordUnits && window.coordUnits[window.coordIndex];
        const usi0 = (M0 && M0.usiResidui && u0) ? M0.usiResidui(u0, M0.profiloArma(nomeArma)) : null;
        if (usi0 && usi0.residui <= 0) return alert('⛔ ' + M0.messaggioScarico(u0, M0.profiloArma(nomeArma)));
        window.currentOrder.weapon = nomeArma;
        window.setupTargetSelectionIntuitivo();
    };

    // ==============================================================
    // 2. BERSAGLIO PRINCIPALE (uno solo)
    // ==============================================================
    window.setupTargetSelectionIntuitivo = function () {
        const M = motore(); if (!M) return;
        const unita = window.coordUnits[window.coordIndex];
        if (window.mostraTitoloUnitaCorrente) window.mostraTitoloUnitaCorrente();

        window.pendingTargets = [];

        const nemici = M.rosterNemico();
        if (nemici.length === 0) {
            return alert('⚠️ Nessuna unità nemica sul tavolo.');
        }

        // fuoriLoF: l'utente dichiara di non avere LoF per una Zona di
        // Visibilità Zero (fumo, oscurità). È l'altro requisito ammesso
        // oltre al bersaglio in forma di Marker.
        const fuoriLoF = !!window.intuitivoFuoriLoF;
        const giudizi = M.bersagliValidi(M.AZIONI.INTUITIVO, nemici, { attaccante: unita, fuoriLoF: fuoriLoF });

        window.validTargets = M.soloAmmessi(giudizi);
        window.targetsScartati = giudizi.filter(g => !g.ammesso).map(g => ({ nome: g.nome, motivo: g.motivo }));

        const container = document.getElementById('enemy-target-buttons');

        window.MotoreN5.azzeraNote('step-wait-aro');
        const statoLoF = fuoriLoF
            ? M.stileColore('si')
            : `background:var(--mn-fondo-riquadro,#222222); border-color:var(--mn-bordo-spento,#555555); color:var(--mn-debole,#aaaaaa);`;

        container.innerHTML = `
            ${window.MotoreN5.intestazioneOrdine({ colore: COL, titolo: `BERSAGLIO PRINCIPALE — UNO SOLO`, nota: `Se la Sagoma coinvolge altri nemici, il tiratore deve comunque sceglierne uno solo come Principale.` })}
            <button class="huge-btn" style="width:100%; min-height:55px; font-size:var(--fs-m); margin-bottom:15px; ${statoLoF}" onclick="window.toggleIntuitivoFuoriLoF()">
                ${fuoriLoF ? `${(typeof window.iconaInterruttore === 'function') ? window.iconaInterruttore('lofNo') : '🌫️ '}NESSUNA LoF — Zona di Visibilità Zero` : `${(typeof window.iconaInterruttore === 'function') ? window.iconaInterruttore('lofSi') : '👁️ '}HO LINEA DI TIRO (solo Marker bersagliabili)`}
            </button>
            <div id="intuitivo-bersagli"></div>`;

        const lista = document.getElementById('intuitivo-bersagli');
        if (window.validTargets.length === 0) {
            lista.innerHTML = `<p style="color:var(--mn-errore,#ff3333); text-align:center; font-weight:bold;">Nessun bersaglio valido per un Attacco Intuitivo.</p>`;
        } else {
            window.validTargets.forEach(function (u) {
                const nome = M.nomeUnita(u);
                const scelto = window.combatTargets && window.combatTargets[0] && window.combatTargets[0].id === u.id;
                const sfondo = scelto ? '#663300' : 'var(--mn-fondo-tasto,#111111)';
                // La riga con la foto, il carattere e il colore di fazione la
                // disegna la pagina (window.rigaUnitaConFoto, chat INTERFACCIA):
                // questo elenco era rimasto l'unico senza. Dove la pagina non
                // c'e` (i banchi) resta il bottone semplice.
                const clic = `onclick="window.scegliPrincipaleIntuitivo('${String(u.id).replace(/'/g, "\\'")}')"`;
                lista.innerHTML += (typeof window.rigaUnitaConFoto === 'function')
                    ? window.rigaUnitaConFoto(u, { attributi: clic, fazione: 'NEMICA', scelta: !!scelto })
                    : `<button class="huge-btn" style="width:100%; min-height:60px; font-size:var(--fs-l); margin-bottom:6px; background:${sfondo}; border-color:${COL.bordo};" ${clic}>[${u.tipo || 'LI'}] ${nome}</button>`;
            });
        }

        // 28 ottobre (Paolo): perche` non si puo`, nella ⓘ (o sotto il tasto).
        window.targetsScartati.forEach(t => window.MotoreN5.nota('step-wait-aro', t.nome + ' non bersagliabile con l\'Intuitivo', t.motivo, { tipo: 'nonpuo' }));

        window.goToStep('step-wait-aro');
    };

    window.toggleIntuitivoFuoriLoF = function () {
        window.intuitivoFuoriLoF = !window.intuitivoFuoriLoF;
        window.combatTargets = [];
        window.setupTargetSelectionIntuitivo();
    };

    window.scegliPrincipaleIntuitivo = function (id) {
        const M = motore(); if (!M) return;
        const u = M.rosterNemico().find(x => String(x.id) === String(id));
        if (!u) return;
        // Uno solo: la scelta sostituisce, non aggiunge.
        window.combatTargets = [{
            id: u.id, name: M.nomeUnita(u), burst: 1,
            cover: false, rangeIndex: 0, rangeMod: 0, terrain: 'NESSUNO',
            ruolo: 'principale',
            // 22 ottobre (INT-01): com'era alla dichiarazione. Se poi il
            // Marker si rivela con il suo ARO, l'Attacco resta valido.
            eraMarker: !!(M.inFormaMarker && M.inFormaMarker(M.statoBersaglio(u)))
        }];
        // 23 ottobre (TEST, INT-01 dalla porta del giocatore): app.html,
        // confirmMultiAro, ricostruisce combatTargets con campi fissi e perde
        // eraMarker e ruolo. Si tengono qui, e preparaModificatoriIntuitivo li
        // rimette dopo la conferma.
        window._sceltaIntuitivo = { id: u.id, eraMarker: window.combatTargets[0].eraMarker, ruolo: 'principale' };
        // 🔴 PRIMA il ridisegno, POI la selezione. setupTargetSelectionIntuitivo
        // azzera pendingTargets (riparte dalla scelta): chiamata dopo aver
        // scritto la selezione la svuotava, e confirmMultiAro rispondeva
        // "Seleziona almeno un bersaglio". L'Attacco Intuitivo non andava
        // avanti con nessun bersaglio. (Paolo al tavolo, 7 ottobre.)
        const scelti = window.combatTargets;
        window.setupTargetSelectionIntuitivo();
        window.combatTargets = scelti;
        window.pendingTargets = [u];
        if (window.confirmMultiAro) window.confirmMultiAro(false);
    };

    // ==============================================================
    // 3. RIEPILOGO (nessun modificatore da scegliere: il tiro è nudo)
    // ==============================================================
    window.preparaModificatoriIntuitivo = function () {
        const M = motore(); if (!M) return;
        const unita = window.coordUnits[window.coordIndex];
        if (window.mostraTitoloUnitaCorrente) window.mostraTitoloUnitaCorrente();

        if (!window.combatTargets || window.combatTargets.length === 0) {
            alert('⛔ Nessun Bersaglio Principale scelto.\n\nL\'Attacco Intuitivo ne richiede esattamente uno.');
            return window.setupTargetSelectionIntuitivo();
        }
        if (window.combatTargets.length > 1) {
            window.combatTargets = [window.combatTargets[0]];
        }
        {
            const s = window._sceltaIntuitivo, t0 = window.combatTargets[0];
            if (s && t0 && String(t0.id) === String(s.id)) {
                if (t0.eraMarker === undefined) t0.eraMarker = s.eraMarker;
                if (!t0.ruolo) t0.ruolo = s.ruolo;
            }
        }

        const arma = M.profiloArma(window.currentOrder.weapon);
        const regole = M.regoleIntuitivo(arma);
        const tgt = window.combatTargets[0];

        const container = document.getElementById('targets-allocation-container');

        window.MotoreN5.azzeraNote('step-modifiers');
        container.innerHTML = `
            ${window.MotoreN5.intestazioneOrdine({ colore: COL, titolo: `ATTACCO INTUITIVO` })}

            <div style="background:var(--mn-errore-fondo,#330000); border:1px solid var(--mn-errore,#ff3333); padding:15px; border-radius:5px; margin-bottom:20px; text-align:center;">
                <b style="color:var(--mn-errore,#ff3333); font-size:var(--fs-m);">TIRO NORMALE SU WIP ${unita.wip}</b><br>
                <span style="color:var(--mn-errore-testo,#ff9999); font-size:var(--fs-s);">${regole.noteTiro}</span>
            </div>

            <div class="target-card" style="border-left:4px solid ${COL.bordo}; margin-bottom:15px; background:rgba(255,153,0,0.05); padding:15px; border-radius:5px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                    <b style="color:var(--mn-testo,#ffffff); font-size:var(--fs-l);">🎯 ${tgt.name}</b>
                    <div style="font-size:var(--fs-l); font-weight:bold; color:${COL.bordo};">1 B</div>
                </div>
                <div style="color:var(--mn-debole,#aaaaaa); font-size:var(--fs-s); line-height:1.6;">
                    Bersaglio Principale${regole.sagoma ? ` · Sagoma ${regole.sagoma.forma || regole.sagoma.tipo}` : ''}
                </div>
                ${M.rigaRequisiti(REQ_INTUITIVO, tgt, 0, 'window.toggleRequisitoIntuitivo')}
                ${(M.domandaAlleatiInMischia && arma && arma.isTemplate) ? M.domandaAlleatiInMischia(tgt, 0, 'window.setAlleatiInMischiaIntuitivo') : ''}
            </div>`;
        // 28 ottobre (Paolo): le regole del tiro nella ⓘ (o in cima), non a schermo.
        M.nota('step-modifiers', 'Critico', 'Vale solo sul Bersaglio Principale; sui secondari colpiti dalla Sagoma è un successo normale.', { tipo: 'regole' });
        if (regole.coperturaAnnullaSalvezza) M.nota('step-modifiers', 'Copertura', 'Chi è colpito NON ha il +3 al Tiro Salvezza per Copertura Parziale.', { tipo: 'mod' });
        M.nota('step-modifiers', 'Reazione del bersaglio', 'Un Faccia a Faccia contro questo tiro WIP.', { tipo: 'regole' });
        M.nota('step-modifiers', 'Se il tiro fallisce', 'Questa unità non può ritentare un Attacco Intuitivo contro lo stesso bersaglio fino al prossimo Turno Attivo.', { tipo: 'regole' });

        const btn = (document.getElementById('btn-esegui-calcolo') || document.querySelector('#step-modifiers .huge-btn'));
        if (btn) {
            const nuovo = btn.cloneNode(true);
            btn.parentNode.replaceChild(nuovo, btn);
            // 🔴 Il display si rende esplicito SEMPRE: cloneNode(true) copia lo
            // style inline, e se chi ha usato la schermata prima lo aveva
            // nascosto il clone nasceva invisibile. Etichetta giusta,
            // onclick funzionante, pulsante non cliccabile.
            nuovo.style.display = '';
            // Il tasto diventa IDLE se il requisito manca (M.tastoConRequisiti).
            M.tastoConRequisiti(nuovo, M.requisitiDichiarati([tgt], REQ_INTUITIVO), 'LANCIA ATTACCO INTUITIVO', function () { window.eseguiCalcoloIntuitivo(); });
        }

        window.goToStep('step-modifiers');
    };

    // ==============================================================
    // 4. INVIO
    // ==============================================================
    // Gli interruttori dei requisiti (Linea di Tiro, gittata, contatto...):
    // la regola e i testi stanno nel motore, M.REQUISITI_TAVOLO.
    // 🔴 15 ottobre (Paolo, dal tavolo): niente requisito "Linea di Tiro"
    // qui. La condizione dell'Intuitivo (Marker, oppure fuori LoF per una
    // Zona di Visibilita` Zero) si sceglie nella pagina dei bersagli e il
    // motore la ricontrolla all'invio (E15). Il requisito generico dell'Attacco
    // BS mandava in IDLE l'Intuitivo dietro il Fumo, cioe` il caso per cui
    // esiste.
    const REQ_INTUITIVO = ['sagoma'];
    window.toggleRequisitoIntuitivo = function (i, chiave) {
        const M = motore(); if (!M) return;
        if (M.invertiRequisito(window.combatTargets[i], chiave)) window.preparaModificatoriIntuitivo();
    };
    // Bersaglio in Corpo a Corpo: la domanda e la regola sono del motore.
    window.setAlleatiInMischiaIntuitivo = function (i, n) {
        const M = motore(); if (!M) return;
        if (M.impostaAlleatiInMischia(window.combatTargets && window.combatTargets[i], n)) window.preparaModificatoriIntuitivo();
    };

    window.eseguiCalcoloIntuitivo = function () {
        const M = motore(); if (!M) return;
        const req = M.requisitiDichiarati([window.combatTargets[0]], REQ_INTUITIVO);
        if (req.idle) return M.idleDaRequisito(req);
        const unita = window.coordUnits[window.coordIndex];

        // Burst sempre 1, qualunque sia il B dell'arma.
        const arma = Object.assign({}, M.profiloArma(window.currentOrder.weapon), { burst: 1 });

        window.coordPayloads.push({
            attaccante: unita,
            azione: M.AZIONI.INTUITIVO,
            arma: arma,
            bersagli: window.combatTargets,
            burstDisponibile: 1,
            fuoriLoF: !!window.intuitivoFuoriLoF
        });

        window.coordIndex++;

        if (window.coordIndex < window.coordUnits.length) {
            window.combatTargets = [];
            window.pendingTargets = [];
            return window.startUnitIntuitivoLoop();
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
                <div style="text-align:center; padding:20px; border:2px solid ${COL.bordo}; background:rgba(255,153,0,0.1); margin-top:20px;">
                    <h2 style="color:${COL.bordo}; margin:0;">ATTACCO INVIATO ALL'HUB</h2>
                    <p style="font-size:var(--fs-xs); color:var(--mn-debole,#aaaaaa);">Tiro WIP non modificato in corso...</p>
                </div>`;
            calcDiv.style.display = 'block';
        }
    };

    console.log('👻 ordine_attacco_intuitivo.js riscritto su MotoreN5.');
})();


// Dichiarazione di versione per il controllo incrociato fra chat.
// Funziona anche se questo file si carica PRIMA del motore: in quel
// caso la versione resta in coda e il motore la raccoglie all'avvio.
(function () {
    var g = (typeof window !== 'undefined') ? window : globalThis;
    var v = { file: 'ordine_attacco_intuitivo.js', versione: '2026-10-28.4', proprieta: 'MOTORE' };
    if (g.MotoreN5 && g.MotoreN5.dichiaraVersione) g.MotoreN5.dichiaraVersione(v.file, v.versione, v.proprieta);
    else { g.__versioniN5 = g.__versioniN5 || []; g.__versioniN5.push(v); }
})();
