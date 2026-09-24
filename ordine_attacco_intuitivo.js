// @versione 2026-09-14.2 | ordine_attacco_intuitivo.js | proprieta`: chat MOTORE
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

    const COL = { bordo: '#ff9900', sfondo: '#442200' };

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
        container.innerHTML = `<div style="background:${COL.sfondo}; border:1px solid ${COL.bordo}; padding:10px; margin-bottom:15px; text-align:center; color:#fff; border-radius:5px;">
            <b style="color:${COL.bordo}; font-size:20px;">👻 ATTACCO INTUITIVO</b><br>
            <span style="font-size:14px; color:#ccc;">Ordine Intero · Tiro WIP non modificato · Burst 1</span>
        </div>`;

        const esito = M.armiIntuitive(unita);

        if (esito.armi.length === 0) {
            container.innerHTML += `<p style="color:#ff3333; text-align:center; font-size:18px;">❌ Nessuna arma utilizzabile per un Attacco Intuitivo.</p>`;
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
                container.innerHTML += `<button class="huge-btn" style="border-color:${COL.bordo};" onclick="window.declareIntuitivoAttack('${nomeEsc}')">
                    ${p.nome}<br><span style="color:${COL.bordo}; font-size:14px;">${forma} | ${p.ammoOpzioni.join('/')} | Burst 1</span>
                </button>`;
            });
        }

        // Il limite del database si dichiara, non si nasconde.
        if (esito.avvisi.length > 0) {
            container.innerHTML += `<div style="margin-top:15px; padding:10px; background:#221100; border:1px solid #664400; border-radius:5px; color:#cc9955; font-size:13px;">
                ⚠️ ${esito.avvisi[0].messaggio}<br><span style="color:#886644;">${esito.avvisi[0].dettaglio || ''}</span></div>`;
        }

        window.goToStep('step-weapon');
    };

    window.declareIntuitivoAttack = function (nomeArma) {
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
        const statoLoF = fuoriLoF
            ? `background:#004400; border-color:#00ff00; color:#00ff00;`
            : `background:#222; border-color:#666; color:#aaa;`;

        container.innerHTML = `
            <div style="background:${COL.sfondo}; border:1px solid ${COL.bordo}; padding:12px; border-radius:5px; margin-bottom:15px; text-align:center;">
                <b style="color:${COL.bordo};">🎯 BERSAGLIO PRINCIPALE — UNO SOLO</b><br>
                <span style="color:#aaa; font-size:12px;">Se la Sagoma coinvolge altri nemici, il tiratore deve comunque sceglierne uno solo come Principale.</span>
            </div>
            <button class="huge-btn" style="width:100%; min-height:55px; font-size:15px; margin-bottom:15px; ${statoLoF}" onclick="window.toggleIntuitivoFuoriLoF()">
                ${fuoriLoF ? '🌫️ NESSUNA LoF — Zona di Visibilità Zero' : '👁️ HO LINEA DI TIRO (solo Marker bersagliabili)'}
            </button>
            <div id="intuitivo-bersagli"></div>`;

        const lista = document.getElementById('intuitivo-bersagli');
        if (window.validTargets.length === 0) {
            lista.innerHTML = `<p style="color:#ff3333; text-align:center; font-weight:bold;">Nessun bersaglio valido per un Attacco Intuitivo.</p>`;
        } else {
            window.validTargets.forEach(function (u) {
                const nome = M.nomeUnita(u);
                const scelto = window.combatTargets && window.combatTargets[0] && window.combatTargets[0].id === u.id;
                const sfondo = scelto ? '#663300' : '#111';
                lista.innerHTML += `<button class="huge-btn" style="width:100%; min-height:60px; font-size:19px; margin-bottom:6px; background:${sfondo}; border-color:${COL.bordo};"
                    onclick="window.scegliPrincipaleIntuitivo('${String(u.id).replace(/'/g, "\\'")}')">[${u.tipo || 'LI'}] ${nome}</button>`;
            });
        }

        if (window.targetsScartati.length > 0) {
            lista.innerHTML += `<div style="margin-top:15px; padding:10px; background:#111; border:1px solid #444; border-radius:5px; color:#888; font-size:13px;">
                <b style="color:#aaa;">Non bersagliabili con l'Intuitivo:</b><br>` +
                window.targetsScartati.map(t => `• <b>${t.nome}</b> — ${t.motivo}`).join('<br>') + `</div>`;
        }

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
            ruolo: 'principale'
        }];
        window.pendingTargets = [u];
        window.setupTargetSelectionIntuitivo();
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

        const arma = M.profiloArma(window.currentOrder.weapon);
        const regole = M.regoleIntuitivo(arma);
        const tgt = window.combatTargets[0];

        const container = document.getElementById('targets-allocation-container');
        container.innerHTML = `
            <h2 style="color:${COL.bordo}; text-align:center; margin-bottom:20px;">ATTACCO INTUITIVO</h2>

            <div style="background:#220000; border:1px solid #ff0000; padding:15px; border-radius:5px; margin-bottom:20px; text-align:center;">
                <b style="color:#ff3333; font-size:18px;">TIRO NORMALE SU WIP ${unita.wip}</b><br>
                <span style="color:#ffaaaa; font-size:14px;">${regole.noteTiro}</span>
            </div>

            <div class="target-card" style="border-left:4px solid ${COL.bordo}; margin-bottom:15px; background:rgba(255,153,0,0.05); padding:15px; border-radius:5px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                    <b style="color:#fff; font-size:22px;">🎯 ${tgt.name}</b>
                    <div style="font-size:20px; font-weight:bold; color:${COL.bordo};">1 B</div>
                </div>
                <div style="color:#aaa; font-size:13px; line-height:1.6;">
                    Bersaglio Principale${regole.sagoma ? ` · Sagoma ${regole.sagoma.forma || regole.sagoma.tipo}` : ''}<br>
                    Critico valido solo su questo bersaglio; sui secondari colpiti dalla Sagoma è un successo normale.<br>
                    ${regole.coperturaAnnullaSalvezza ? 'Chi è colpito NON ha il +3 al Tiro Salvezza per Copertura Parziale.<br>' : ''}
                    La reazione del bersaglio è un Faccia a Faccia contro questo tiro WIP.
                </div>
            </div>

            <div style="padding:10px; background:#111; border:1px solid #444; border-radius:5px; color:#888; font-size:12px;">
                Se il tiro WIP fallisce, questa unità non può ritentare un Attacco Intuitivo contro lo stesso bersaglio fino al prossimo Turno Attivo.
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
            nuovo.onclick = function () { window.eseguiCalcoloIntuitivo(); };
            nuovo.innerText = 'LANCIA ATTACCO INTUITIVO';
        }

        window.goToStep('step-modifiers');
    };

    // ==============================================================
    // 4. INVIO
    // ==============================================================
    window.eseguiCalcoloIntuitivo = function () {
        const M = motore(); if (!M) return;
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
                    <p style="font-size:12px; color:#aaa;">Tiro WIP non modificato in corso...</p>
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
    var v = { file: 'ordine_attacco_intuitivo.js', versione: '2026-09-14.2', proprieta: 'MOTORE' };
    if (g.MotoreN5 && g.MotoreN5.dichiaraVersione) g.MotoreN5.dichiaraVersione(v.file, v.versione, v.proprieta);
    else { g.__versioniN5 = g.__versioniN5 || []; g.__versioniN5.push(v); }
})();
