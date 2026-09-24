// @versione 2026-09-23.1 | ordine_hacking.js | proprieta`: chat MOTORE
// ==========================================
// 💻 INFOGUERRA (HACKING) N5 - ordine_hacking.js
// ------------------------------------------
// RISCRITTO sopra MotoreN5. Solo interfaccia: le regole stanno nel motore.
//
// L'errore principale della versione precedente:
//
//   MOSTRAVA GLI STESSI CINQUE PROGRAMMI A QUALSIASI HACKER.
//   In N5 i programmi disponibili dipendono dal DISPOSITIVO, non
//   dall'essere Hacker. Un Hacking Device standard dà Carbonite,
//   Oblivion, Spotlight e Total Control. Trinity è esclusiva del
//   Killer Hacking Device: offrirla a un Interventor non è legale.
//
// Altre correzioni:
//  - i programmi in N5 sono dodici, non cinque. Quelli che non sono
//    attacchi (Cybermask, White Noise, i Supportware EVO) ora sono
//    riconosciuti e mostrati come non gestiti, invece di non esistere.
//  - il Burst viene dal programma, non da getWeaponProfile su una
//    stringa che non era nel database armi (Carbonite non è un'arma).
//  - il MOD di attacco è calcolato: Bersagliato +3, Firewall nemico,
//    bonus Fireteam. Prima la schermata non mostrava nulla.
// ==========================================

(function () {
    'use strict';

    function motore() {
        if (!window.MotoreN5) {
            alert('⛔ motore_regole_n5.js non è caricato: l\'Hacking non può funzionare.');
            return null;
        }
        return window.MotoreN5;
    }

    const COL = { bordo: '#00ffff', sfondo: '#002244' };

    window.avviaFaseHacking = function (actionId, isSecondHalf) {
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
            window.startUnitHackingLoop();
        } else {
            window.preparaModificatoriHacking();
        }
    };

    // ==============================================================
    // 1. SELEZIONE PROGRAMMA (in base al dispositivo)
    // ==============================================================
    window.startUnitHackingLoop = function () {
        const M = motore(); if (!M) return;
        const unita = window.coordUnits[window.coordIndex];
        if (window.mostraTitoloUnitaCorrente) window.mostraTitoloUnitaCorrente();

        const esito = M.programmiAttacco(unita);
        const container = document.getElementById('weapon-buttons-container');

        container.innerHTML = `<div style="background:${COL.sfondo}; border:1px solid ${COL.bordo}; padding:10px; margin-bottom:15px; text-align:center; color:#fff; border-radius:5px;">
            <b style="color:${COL.bordo}; font-size:20px;">💻 INFOGUERRA</b><br>
            <span style="font-size:14px; color:#ccc;">WIP ${unita.wip || '?'} · ${esito.dispositivi.length ? esito.dispositivi.join(' + ') : 'nessun dispositivo'}</span>
        </div>`;

        if (esito.programmi.length === 0) {
            container.innerHTML += `<p style="color:#ff3333; text-align:center; font-size:18px;">
                ❌ Nessun programma d'attacco disponibile con questo dispositivo.</p>`;
        } else {
            esito.programmi.forEach(function (p) {
                const bers = p.bersaglio === 'chiunque' ? 'Qualsiasi nemico'
                           : p.bersaglio === 'soloTAG' ? 'Solo TAG'
                           : p.bersaglio === 'soloHackerNemico' ? 'Solo Hacker nemici'
                           : 'Solo Hackerabili';
                const salvezza = `PS ${p.ps}${p.dimezzaBTS ? ' · BTS dimezzato' : ' · BTS pieno'}${p.salvezze > 1 ? ` · ${p.salvezze} salvezze` : ''}`;
                const nomeEsc = (p.scelta || p.nome).replace(/'/g, "\\'");
                container.innerHTML += `<button class="huge-btn" style="border-color:${COL.bordo};" onclick="window.declareHackingAttack('${nomeEsc}')">
                    ${p.scelta || p.nome}<br><span style="color:${COL.bordo}; font-size:13px;">B${p.burst} · ${p.ammo} · ${salvezza}<br>${bers} → ${p.effetto}</span>
                </button>`;
            });
        }

        // I programmi non d'attacco esistono: si dicono, non si nascondono.
        if (esito.nonAttacco.length > 0) {
            container.innerHTML += `<div style="margin-top:15px; padding:10px; background:#111; border:1px solid #444; border-radius:5px; color:#888; font-size:13px;">
                <b style="color:#aaa;">Altri programmi del dispositivo, non gestiti da questa schermata:</b><br>` +
                esito.nonAttacco.map(p => `• <b>${p.nome}</b> — ${p.note || p.tipo}`).join('<br>') + `</div>`;
        }
        if (esito.avvisi.length > 0) {
            container.innerHTML += `<div style="margin-top:10px; padding:10px; background:#221100; border:1px solid #664400; border-radius:5px; color:#cc9955; font-size:13px;">` +
                esito.avvisi.map(a => `⚠️ ${a.messaggio}`).join('<br>') + `</div>`;
        }

        window.goToStep('step-weapon');
    };

    window.declareHackingAttack = function (nomeProgramma) {
        window.currentOrder.weapon = nomeProgramma;
        window.setupTargetSelectionHacking();
    };

    // ==============================================================
    // 2. BERSAGLI (filtrati per programma)
    // ==============================================================
    window.setupTargetSelectionHacking = function () {
        const M = motore(); if (!M) return;
        const unita = window.coordUnits[window.coordIndex];
        if (window.mostraTitoloUnitaCorrente) window.mostraTitoloUnitaCorrente();

        window.pendingTargets = [];
        const nemici = M.rosterNemico();
        if (nemici.length === 0) return alert('⚠️ Nessuna unità nemica sul tavolo.');

        const programma = window.currentOrder.weapon;
        const giudizi = M.bersagliValidi(M.AZIONI.HACKING, nemici, { attaccante: unita, programma: programma });

        window.validTargets = M.soloAmmessi(giudizi);
        window.targetsScartati = giudizi.filter(g => !g.ammesso).map(g => ({ nome: g.nome, motivo: g.motivo }));

        if (window.validTargets.length === 0) {
            alert(`❌ Nessun bersaglio valido per ${programma}.\n\n` +
                  window.targetsScartati.map(t => `• ${t.nome}: ${t.motivo}`).join('\n'));
            return window.goToStep('step-weapon');
        }

        if (window.renderTargetButtons) window.renderTargetButtons();
        window.goToStep('step-wait-aro');
    };

    // ==============================================================
    // 3. ALLOCAZIONE E MODIFICATORI
    // ==============================================================
    window.preparaModificatoriHacking = function () {
        const M = motore(); if (!M) return;
        const unita = window.coordUnits[window.coordIndex];
        if (window.mostraTitoloUnitaCorrente) window.mostraTitoloUnitaCorrente();

        if (!window.combatTargets || window.combatTargets.length === 0) {
            alert('⛔ Nessun bersaglio confermato.\n\nL\'attacco Comms richiede un bersaglio reale nell\'Area di Hacking.');
            return window.setupTargetSelectionHacking();
        }

        // Il programma È l'arma: il Burst viene da lì, non dal database armi.
        const programma = M.armaDaProgrammaDi(window.currentOrder.unit, window.currentOrder.weapon);
        const burst = M.burstIniziale(unita, programma, {
            azione: M.AZIONI.HACKING,
            coordMode: window.coordMode,
            indiceCoord: window.coordIndex
        });
        window.totalBurst = burst.valore;
        window.burstDettaglio = burst;

        const assegnati = window.combatTargets.reduce((s, t) => s + (t.burst || 0), 0);
        if (assegnati === 0) window.combatTargets[0].burst = window.totalBurst;

        window.combatTargets.forEach(function (t) {
            // L'Hacking ignora distanza, copertura e terreno.
            t.cover = false; t.rangeIndex = 0; t.rangeMod = 0; t.terrain = 'NESSUNO';
            t.ammo = programma.ammo;
        });

        window.renderTargetsAllocationHacking();
        window.goToStep('step-modifiers');
    };

    window.renderTargetsAllocationHacking = function () {
        const M = motore(); if (!M) return;
        const unita = window.coordUnits[window.coordIndex];
        const programma = M.armaDaProgrammaDi(window.currentOrder.unit, window.currentOrder.weapon);
        const container = document.getElementById('targets-allocation-container');

        const assegnati = window.combatTargets.reduce((s, t) => s + (t.burst || 0), 0);
        const restanti = window.totalBurst - assegnati;

        let html = `<div style="text-align:center; color:#fff; margin-bottom:5px; font-size:18px;">
            PROGRAMMI DA ASSEGNARE: <b style="color:${COL.bordo}; font-size:24px;">${restanti}</b></div>
            <div style="text-align:center; color:#888; font-size:12px; margin-bottom:15px;">
                ${programma.nome} · B${programma.burst} · ${programma.ammo} · PS ${programma.ps}
                ${programma.dimezzaBTS ? ' · BTS dimezzato' : ' · BTS pieno'}</div>`;

        window.combatTargets.forEach(function (tgt, index) {
            const dif = M.rosterNemico().find(u => u.id === tgt.id) || {};
            const fw = M.valoreFirewall ? M.valoreFirewall(dif) : 0;
            const mods = M.modHacking(unita, dif, programma, { firewallNemico: fw });

            const dettaglio = mods.voci.length
                ? mods.voci.map(v => `<div style="display:flex; justify-content:space-between; padding:2px 0;">
                        <span style="color:#aaa;">${v.motivo}</span>
                        <b style="color:${v.valore >= 0 ? '#00ff00' : '#ff6666'};">${v.valore > 0 ? '+' + v.valore : v.valore}</b></div>`).join('')
                : `<div style="color:#888; text-align:center;">Nessun modificatore</div>`;

            html += `
            <div class="target-card" style="border-left:4px solid ${COL.bordo}; margin-bottom:20px; background:rgba(0,255,255,0.05); padding:15px; border-radius:5px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <b style="color:${COL.bordo}; font-size:20px;">${tgt.name}</b>
                    <div class="burst-ctrl" style="border-color:${COL.bordo};">
                        <button class="burst-btn" style="background:${COL.bordo};" onclick="window.adjustTargetBurstHacking(${index}, -1)">-</button>
                        <span style="margin:0 10px; font-size:22px; font-weight:bold; color:${tgt.burst > 0 ? '#00ff00' : '#888'}">${tgt.burst} B</span>
                        <button class="burst-btn" style="background:${COL.bordo}; opacity:${restanti > 0 ? 1 : 0.3}" onclick="window.adjustTargetBurstHacking(${index}, 1)">+</button>
                    </div>
                </div>

                <div style="background:#001a22; border:1px solid #005566; padding:10px; border-radius:5px; margin-bottom:10px; font-size:14px;">
                    <div style="text-align:center; color:#fff; margin-bottom:6px;">
                        WIP base <b>${mods.base}</b> → Valore di Successo <b style="color:${COL.bordo}; font-size:20px;">${mods.valore}</b>
                    </div>
                    <div style="border-top:1px solid #004455; padding-top:6px;">${dettaglio}</div>
                </div>

                <div style="text-align:center; padding:8px; background:#001122; border:1px solid ${COL.bordo}; color:${COL.bordo}; font-size:13px; border-radius:5px;">
                    Se fallisce il Tiro Salvezza: <b>${programma.effetto}</b>
                </div>
            </div>`;
        });

        html += `<div style="padding:10px; background:#111; border:1px solid #444; border-radius:5px; color:#888; font-size:12px; line-height:1.6;">
            L'Hacking agisce nell'Area di Hacking: niente LoF, gittata, copertura né mimetismo.<br>
            Solo truppe in forma di Modello sono bersagliabili: i Marker vanno Scoperti prima.
        </div>`;

        container.innerHTML = html;

        const btn = (document.getElementById('btn-esegui-calcolo') || document.querySelector('#step-modifiers .huge-btn'));
        if (btn) {
            const nuovo = btn.cloneNode(true);
            btn.parentNode.replaceChild(nuovo, btn);
            // 🔴 Il display si rende esplicito SEMPRE: cloneNode(true) copia lo
            // style inline, e se chi ha usato la schermata prima lo aveva
            // nascosto il clone nasceva invisibile. Etichetta giusta,
            // onclick funzionante, pulsante non cliccabile.
            nuovo.style.display = '';
            nuovo.onclick = function () { window.eseguiCalcoloHacking(); };
            nuovo.innerText = 'ESEGUI ATTACCO CYBER';
        }
    };

    window.adjustTargetBurstHacking = function (i, delta) {
        const assegnati = window.combatTargets.reduce((s, t) => s + (t.burst || 0), 0);
        const tgt = window.combatTargets[i];
        if (delta > 0 && assegnati < window.totalBurst) tgt.burst += delta;
        else if (delta < 0 && tgt.burst > 0) tgt.burst += delta;
        window.renderTargetsAllocationHacking();
    };

    // ==============================================================
    // 4. INVIO
    // ==============================================================
    window.eseguiCalcoloHacking = function () {
        const M = motore(); if (!M) return;
        const unita = window.coordUnits[window.coordIndex];
        const programma = M.armaDaProgrammaDi(window.currentOrder.unit, window.currentOrder.weapon);

        const perBersaglio = window.combatTargets.map(function (t) {
            const dif = M.rosterNemico().find(u => u.id === t.id) || {};
            const fw = M.valoreFirewall ? M.valoreFirewall(dif) : 0;
            const m = M.modHacking(unita, dif, programma, { firewallNemico: fw });
            return { bersaglio: t.name, valoreSuccesso: m.valore, base: m.base, mod: m.mod, voci: m.voci, firewall: fw };
        });

        window.coordPayloads.push({
            attaccante: unita,
            azione: M.AZIONI.HACKING,
            arma: programma,
            programma: programma.nome,
            bersagli: window.combatTargets,
            burstDisponibile: window.totalBurst,
            regole: {
                attributo: 'WIP',
                ps: programma.ps,
                dimezzaBTS: programma.dimezzaBTS,
                salvezze: programma.salvezze,
                effetto: programma.effetto,
                ignoraGittata: true,
                ignoraCopertura: true,
                ignoraMimetismo: true,
                perBersaglio: perBersaglio
            }
        });

        window.coordIndex++;

        if (window.coordIndex < window.coordUnits.length) {
            window.combatTargets = [];
            window.pendingTargets = [];
            return window.startUnitHackingLoop();
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
                <div style="text-align:center; padding:20px; border:2px solid ${COL.bordo}; background:rgba(0,255,255,0.1); margin-top:20px;">
                    <h2 style="color:${COL.bordo}; margin:0;">ATTACCO CYBER INVIATO</h2>
                    <p style="font-size:12px; color:#aaa;">Risoluzione Infoguerra in corso all'Hub...</p>
                </div>`;
            calcDiv.style.display = 'block';
        }
    };

    console.log('💻 ordine_hacking.js riscritto su MotoreN5.');
})();


// Dichiarazione di versione per il controllo incrociato fra chat.
// Funziona anche se questo file si carica PRIMA del motore: in quel
// caso la versione resta in coda e il motore la raccoglie all'avvio.
(function () {
    var g = (typeof window !== 'undefined') ? window : globalThis;
    var v = { file: 'ordine_hacking.js', versione: '2026-09-14.1', proprieta: 'MOTORE' };
    if (g.MotoreN5 && g.MotoreN5.dichiaraVersione) g.MotoreN5.dichiaraVersione(v.file, v.versione, v.proprieta);
    else { g.__versioniN5 = g.__versioniN5 || []; g.__versioniN5.push(v); }
})();
