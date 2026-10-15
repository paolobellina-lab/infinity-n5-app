// @versione 2026-09-14.1 | ordine_scenografia.js | proprieta`: chat MOTORE
// ==========================================
// 🏗️ SCENOGRAFIA (N5) - ordine_scenografia.js
// ------------------------------------------
// MODULO NUOVO. Il router cercava `window.avviaFaseScenografia` per due
// azioni e non lo trovava: finivano nell'alert "Azione non riconosciuta".
//
// Serve DUE azioni che si somigliano solo in superficie:
//
//   INTERAGIRE OBIETTIVO   bersaglio: scenografia col Tratto Objective
//                          contatto di Silhouette, tiro WIP secondo
//                          la Regola di Scenario in vigore
//
//   DEACTIVATOR            bersaglio: Deployable NEMICI già schierati
//                          basta la ZdC, la LoF NON serve
//                          MOD di gittata propri: +6 / +3 / -6
//                          MAI i Marker Mimetici
//
// Le differenze che contano, e che rendono sbagliato trattarle insieme:
//  - INTERAGIRE vuole il contatto, il DEACTIVATOR no;
//  - il DEACTIVATOR ha gittate, INTERAGIRE no;
//  - INTERAGIRE punta alla scenografia NEUTRA, il DEACTIVATOR solo ai
//    dispositivi NEMICI.
// ==========================================

(function () {
    'use strict';

    function motore() {
        if (!window.MotoreN5) {
            alert('⛔ motore_regole_n5.js non è caricato: la scenografia non può funzionare.');
            return null;
        }
        return window.MotoreN5;
    }

    const COL = { bordo: '#ffaa33', sfondo: '#332200' };

    function eDeactivator(azione) {
        return String(azione || '').toUpperCase() === 'DEACTIVATOR';
    }

    window.avviaFaseScenografia = function (actionId, isSecondHalf) {
        const M = motore(); if (!M) return;
        window.currentOrder = window.currentOrder || {};
        window.currentOrder.isSecondHalf = isSecondHalf;
        if (!isSecondHalf) window.currentOrder.action1 = actionId;
        window.currentOrder.action = actionId;
        window.currentOrder.weapon = eDeactivator(actionId) ? 'Deactivator' : null;

        const ripresa = M.riprendiOrdineDaFinestra(actionId, isSecondHalf);
        if (!ripresa.riprende) {
            if (isSecondHalf) console.log('↩️ ' + ripresa.motivo);
            window.coordIndex = 0;
            window.coordPayloads = [];
            window.pendingTargets = [];
            window.combatTargets = [];
            window.setupTargetSelectionScenografia();
        } else {
            window.preparaModificatoriScenografia();
        }
    };

    // ==============================================================
    // 1. BERSAGLIO — le due azioni guardano insiemi diversi
    // ==============================================================
    window.setupTargetSelectionScenografia = function () {
        const M = motore(); if (!M) return;
        const unita = window.coordUnits[window.coordIndex];
        const azione = window.currentOrder.action;
        if (window.mostraTitoloUnitaCorrente) window.mostraTitoloUnitaCorrente();

        let giudizi, avvisi = [], intestazione;

        if (eDeactivator(azione)) {
            const e = M.bersagliDeactivator(unita, {});
            giudizi = e.bersagli;
            avvisi = e.avvisi;
            intestazione = `<b style="color:${COL.bordo}; font-size:18px;">🔌 DEACTIVATOR</b><br>
                <span style="color:#aaa; font-size:13px;">Solo dispositivi NEMICI già schierati.<br>
                Basta la Zona di Controllo: la Linea di Tiro non serve.<br>
                I Marker Mimetici vanno Scoperti prima.</span>`;
        } else {
            giudizi = M.bersagliScenografia(azione, {});
            intestazione = `<b style="color:${COL.bordo}; font-size:18px;">🎯 INTERAGIRE CON OBIETTIVO</b><br>
                <span style="color:#aaa; font-size:13px;">Solo elementi col Tratto Objective.<br>
                Richiede il contatto di Silhouette.</span>`;
        }

        window.validTargets = giudizi.filter(g => g.ammesso).map(g => g.unita);
        window.targetsScartati = giudizi.filter(g => !g.ammesso)
            .map(g => ({ nome: g.nome, motivo: g.motivo }));

        const container = document.getElementById('enemy-target-buttons');
        if (!container) return;

        container.innerHTML = `<div style="background:${COL.sfondo}; border:1px solid ${COL.bordo}; padding:12px; border-radius:5px; margin-bottom:15px; text-align:center;">
            ${intestazione}</div>`;

        if (window.validTargets.length === 0) {
            container.innerHTML += `<p style="color:#ff3333; text-align:center; font-weight:bold;">
                ${eDeactivator(azione) ? 'Nessun dispositivo nemico da disattivare.' : 'Nessun obiettivo sul tavolo.'}</p>`;
        } else {
            giudizi.filter(g => g.ammesso).forEach(function (g) {
                const nome = g.nome;
                const sotto = (g.tratti && g.tratti.length) ? g.tratti.join(', ')
                            : (g.tipo || 'dispositivo');
                container.innerHTML += `<button class="huge-btn" style="width:100%; min-height:62px; font-size:19px; margin-bottom:6px; background:#111; border-color:${COL.bordo};"
                    onclick="window.scegliBersaglioScenografia('${String(g.unita.id).replace(/'/g, "\\'")}')">
                    ${eDeactivator(azione) ? '🔌' : '🎯'} ${nome}<br>
                    <span style="font-size:13px; color:${COL.bordo};">${sotto}</span></button>`;
            });
        }

        if (window.targetsScartati.length > 0) {
            container.innerHTML += `<div style="margin-top:15px; padding:10px; background:#111; border:1px solid #444; border-radius:5px; color:#888; font-size:13px;">
                <b style="color:#aaa;">Non bersagliabili:</b><br>` +
                window.targetsScartati.map(t => `• <b>${t.nome}</b> — ${t.motivo}`).join('<br>') + `</div>`;
        }
        avvisi.forEach(function (a) {
            container.innerHTML += `<div style="margin-top:10px; padding:10px; background:#221100; border:1px solid #664400; border-radius:5px; color:#cc9955; font-size:13px;">⚠️ ${a.messaggio}</div>`;
        });

        window.goToStep('step-wait-aro');
    };

    window.scegliBersaglioScenografia = function (id) {
        const M = motore(); if (!M) return;
        const u = (window.validTargets || []).find(x => String(x.id) === String(id));
        if (!u) return;
        window.combatTargets = [{
            id: u.id, name: M.nomeUnita(u), burst: 1, cover: false,
            rangeIndex: 0, rangeMod: 0, terrain: 'NESSUNO'
        }];
        window.pendingTargets = [u];
        window.preparaModificatoriScenografia();
    };

    // ==============================================================
    // 2. IL TIRO
    // ==============================================================
    window.preparaModificatoriScenografia = function () {
        const M = motore(); if (!M) return;
        if (!window.combatTargets || window.combatTargets.length === 0) {
            alert('⛔ Nessun bersaglio scelto.\n\nQuest\'azione richiede un elemento sul tavolo.');
            return window.setupTargetSelectionScenografia();
        }
        if (window.combatTargets.length > 1) window.combatTargets = [window.combatTargets[0]];
        window.renderScenografia();
        window.goToStep('step-modifiers');
    };

    window.renderScenografia = function () {
        const M = motore(); if (!M) return;
        const unita = window.coordUnits[window.coordIndex];
        const azione = window.currentOrder.action;
        const t = window.combatTargets[0];
        const bersaglio = (window.pendingTargets || [])[0] || {};

        let e, corpo = '';

        if (eDeactivator(azione)) {
            const arma = M.armaDeactivator();
            if (typeof t.rangeIndex !== 'number' || t.rangeIndex < 0 || t.rangeIndex >= arma.bands.length) t.rangeIndex = 0;
            t.rangeMod = arma.bands.length ? arma.bands[t.rangeIndex].mod : 0;

            e = M.regoleDeactivator(unita, bersaglio, {
                rangeIndex: t.rangeIndex,
                discoBallAlleata: !!window.scenografiaDiscoBall
            });

            // Il Deactivator ha gittate proprie: si mostrano.
            let seg = '', lab = '';
            arma.bands.forEach(function (b, i) {
                let cls = 'seg-2';
                if (b.mod > 0) cls = 'seg-1'; else if (b.mod === -3) cls = 'seg-3'; else if (b.mod < -3) cls = 'seg-4';
                seg += `<div class="range-seg ${cls} ${t.rangeIndex === i ? 'active' : ''}" onclick="window.setRangeScenografia(${i})">${b.mod > 0 ? '+' + b.mod : b.mod}</div>`;
                lab += `<span>${b.label}</span>`;
            });
            corpo = `<div style="text-align:center; color:#aaa; font-size:12px; margin:10px 0 5px;">Gittata (il Deactivator ha bande proprie):</div>
                <div class="range-bar">${seg}</div>
                <div style="display:flex; justify-content:space-between; font-size:10px; color:#888; margin-top:4px;">${lab}</div>`;

            // Disco Baller: la stessa attrezzatura riaccende una Disco Ball alleata.
            if (/DISCO BALLER/i.test(((unita && unita.skills) || '') + ' ' + ((unita && unita.equip) || ''))) {
                const st = window.scenografiaDiscoBall
                    ? 'background:#004400; border-color:#00ff00; color:#00ff00;'
                    : 'background:#111; border-color:#888; color:#fff;';
                // L'etichetta nomina la Disco Ball in ENTRAMBI gli stati:
                // da spento diceva solo "disattivo un dispositivo nemico", e
                // chi non sapeva dell'interruttore non capiva a cosa servisse.
                corpo += `<button class="huge-btn" style="width:100%; margin-top:12px; min-height:55px; font-size:14px; ${st}"
                    onclick="window.toggleDiscoBall()">
                    ${window.scenografiaDiscoBall
                        ? '💿 DISCO BALL alleata: RIATTIVO (+3 WIP)'
                        : '🔌 DISCO BALL alleata: no, disattivo un dispositivo nemico'}
                    </button>`;
            }
        } else {
            // INTERAGIRE: nessuna gittata, il tiro lo detta la Regola di Scenario.
            const base = parseInt((unita && unita.wip), 10) || 0;
            e = {
                valore: base, base: base, mod: 0, attributo: 'WIP',
                impossibile: base < 1, critici: M.critici(base),
                voci: [{ fonte: 'base', valore: base, motivo: `WIP di ${M.nomeUnita(unita)}: ${base}` }],
                note: [
                    'Richiede il contatto di Silhouette col bersaglio.',
                    'Il tiro e le condizioni li detta la Regola di Scenario in vigore: il calcolatore non la conosce.'
                ],
                avvisi: []
            };
        }
        window.scenografiaEsito = e;

        const dettaglio = e.voci.map(v => `<div style="display:flex; justify-content:space-between; padding:2px 0;">
                <span style="color:#aaa;">${v.motivo}</span>
                <b style="color:${v.valore >= 0 ? '#00ff00' : '#ff6666'};">${v.fonte === 'base' ? '' : (v.valore > 0 ? '+' + v.valore : v.valore)}</b></div>`).join('');

        document.getElementById('targets-allocation-container').innerHTML = `
            <h2 style="color:${COL.bordo}; text-align:center; margin-bottom:20px;">${eDeactivator(azione) ? 'DEACTIVATOR' : 'INTERAGIRE CON OBIETTIVO'}</h2>
            <div class="target-card" style="border-left:4px solid ${COL.bordo}; background:rgba(255,170,51,0.05); padding:15px; border-radius:5px;">
                <b style="color:#fff; font-size:22px; display:block; margin-bottom:12px;">${eDeactivator(azione) ? '🔌' : '🎯'} ${t.name}</b>
                <div style="background:#1a1000; border:1px solid #554400; padding:12px; border-radius:5px;">
                    <div style="text-align:center; color:#fff; margin-bottom:8px;">
                        WIP ${e.base} → <b style="color:${COL.bordo}; font-size:26px;">${e.valore}</b>
                        ${e.impossibile ? '<br><span style="color:#ff3333; font-size:13px;">Valore sotto 1: il tiro fallisce automaticamente</span>' : ''}
                    </div>
                    <div style="border-top:1px solid #443300; padding-top:8px; font-size:14px;">${dettaglio}</div>
                    ${e.critici && !e.critici.nessunTiro ? `<div style="text-align:center; color:#ffcc00; font-size:12px; margin-top:6px;">🎯 ${e.critici.testo}</div>` : ''}
                </div>
                ${corpo}
                ${e.note.length ? `<div style="margin-top:12px; color:#888; font-size:12px; line-height:1.6;">` +
                    e.note.map(n => `• ${n}`).join('<br>') + `</div>` : ''}
            </div>`;

        const btn = document.getElementById('btn-esegui-calcolo') ||
                    document.querySelector('#step-modifiers .huge-btn');
        if (btn) {
            const nuovo = btn.cloneNode(true);
            btn.parentNode.replaceChild(nuovo, btn);
            // 🔴 Il display si rende esplicito SEMPRE: cloneNode(true) copia lo
            // style inline, e se chi ha usato la schermata prima lo aveva
            // nascosto il clone nasceva invisibile. Etichetta giusta,
            // onclick funzionante, pulsante non cliccabile.
            nuovo.style.display = '';
            nuovo.onclick = function () { window.eseguiCalcoloScenografia(); };
            nuovo.innerText = eDeactivator(azione) ? 'ESEGUI DEACTIVATOR' : 'ESEGUI INTERAZIONE';
        }
    };

    window.setRangeScenografia = function (i) {
        const M = motore(); if (!M) return;
        const arma = M.armaDeactivator();
        window.combatTargets[0].rangeIndex = i;
        window.combatTargets[0].rangeMod = arma.bands[i] ? arma.bands[i].mod : 0;
        window.renderScenografia();
    };
    window.toggleDiscoBall = function () {
        window.scenografiaDiscoBall = !window.scenografiaDiscoBall;
        window.renderScenografia();
    };

    // ==============================================================
    // 3. INVIO
    // ==============================================================
    window.eseguiCalcoloScenografia = function () {
        const M = motore(); if (!M) return;
        const unita = window.coordUnits[window.coordIndex];
        const azione = window.currentOrder.action;
        const e = window.scenografiaEsito || {};

        window.coordPayloads.push({
            attaccante: unita,
            azione: M.azioneCanonica(azione) || azione,
            arma: eDeactivator(azione) ? M.armaDeactivator() : {
                nome: 'INTERAGIRE', burst: 1, ammo: null, ammoOpzioni: [],
                bands: [], isTemplate: false, isCC: false, isDifesa: true, notazioni: []
            },
            bersagli: window.combatTargets,
            burstDisponibile: 1,
            regole: {
                attributo: 'WIP',
                valoreSuccesso: e.valore,
                base: e.base, mod: e.mod, voci: e.voci,
                nonOffensivo: true,
                discoBall: !!window.scenografiaDiscoBall,
                note: e.note
            }
        });

        window.coordIndex++;
        if (window.coordIndex < window.coordUnits.length) {
            window.combatTargets = [];
            window.pendingTargets = [];
            window.scenografiaDiscoBall = false;
            return window.setupTargetSelectionScenografia();
        }

        const spedito = M.inviaCalcolo(window.coordPayloads, { isCoordinated: window.coordMode });
        if (!spedito) { window.coordIndex--; window.coordPayloads.pop(); return; }
        window.scenografiaDiscoBall = false;
    };

    console.log('🏗️ ordine_scenografia.js caricato.');
})();

// Dichiarazione di versione per il controllo incrociato fra chat.
(function () {
    var g = (typeof window !== 'undefined') ? window : globalThis;
    var v = { file: 'ordine_scenografia.js', versione: '2026-09-14.1', proprieta: 'MOTORE' };
    if (g.MotoreN5 && g.MotoreN5.dichiaraVersione) g.MotoreN5.dichiaraVersione(v.file, v.versione, v.proprieta);
    else { g.__versioniN5 = g.__versioniN5 || []; g.__versioniN5.push(v); }
})();
