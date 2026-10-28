// @versione 2026-10-28.4 | ordine_scenografia.js | proprieta`: chat MOTORE
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

    // 28 ottobre (Paolo): il colore e` dell'ORDINE, non del modulo (M.COLORI_ORDINE nel
    // motore: Movimenti blu, Abilita` Brevi verdi, Ordini Interi rossi). COL legge le
    // tinte dell'Ordine in corso a ogni uso; 'INTERAGIRE OBIETTIVO' e` quello di casa. Prima: { bordo: '#ffaa33', sfondo: '#332200' };.
    const COL = (function () {
        const ripiego = { bordo: '#ffaa33', sfondo: '#332200', riquadro: '#332200', tenue: '#ffaa33', testo: '#ffaa33' };
        const o = {};
        ['bordo', 'sfondo', 'riquadro', 'tenue', 'testo'].forEach(function (k) {
            Object.defineProperty(o, k, { enumerable: true, get: function () {
                const M = window.MotoreN5;
                return (M && typeof M.colOrdine === 'function') ? M.colOrdine('INTERAGIRE OBIETTIVO')[k] : ripiego[k];
            } });
        });
        return o;
    })();

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
            intestazione = { colore: COL, titolo: 'DEACTIVATOR',
                nota: 'Solo dispositivi NEMICI già schierati.<br>Basta la Zona di Controllo: la Linea di Tiro non serve.<br>I Marker Mimetici vanno Scoperti prima.' };
        } else {
            giudizi = M.bersagliScenografia(azione, {});
            intestazione = { colore: COL, titolo: 'INTERAGIRE CON OBIETTIVO',
                nota: 'Solo elementi col Tratto Objective.<br>Richiede il contatto di Silhouette.' };
        }

        window.validTargets = giudizi.filter(g => g.ammesso).map(g => g.unita);
        window.targetsScartati = giudizi.filter(g => !g.ammesso)
            .map(g => ({ nome: g.nome, motivo: g.motivo }));

        const container = document.getElementById('enemy-target-buttons');

        window.MotoreN5.azzeraNote('step-wait-aro');
        if (!container) return;

        container.innerHTML = M.intestazioneOrdine(intestazione);

        if (window.validTargets.length === 0) {
            container.innerHTML += `<p style="color:var(--mn-errore,#ff3333); text-align:center; font-weight:bold;">
                ${eDeactivator(azione) ? 'Nessun dispositivo nemico da disattivare.' : 'Nessun obiettivo sul tavolo.'}</p>`;
        } else {
            giudizi.filter(g => g.ammesso).forEach(function (g) {
                const nome = g.nome;
                const sotto = (g.tratti && g.tratti.length) ? g.tratti.join(', ')
                            : (g.tipo || 'dispositivo');
                container.innerHTML += `<button class="huge-btn" style="width:100%; min-height:62px; font-size:var(--fs-l); margin-bottom:6px; background:var(--mn-fondo-tasto,#111111); border-color:${COL.bordo};"
                    onclick="window.scegliBersaglioScenografia('${String(g.unita.id).replace(/'/g, "\\'")}')">
                    ${eDeactivator(azione) ? '🔌' : '🎯'} ${nome}<br>
                    <span style="font-size:var(--fs-s); color:${COL.bordo};">${sotto}</span></button>`;
            });
        }

        // 28 ottobre (Paolo): perche` non si puo`, nella ⓘ (o sotto il tasto).
        window.targetsScartati.forEach(t => window.MotoreN5.nota('step-wait-aro', t.nome + ' non bersagliabile', t.motivo, { tipo: 'nonpuo' }));
        avvisi.forEach(function (a) {
            container.innerHTML += `<div style="margin-top:10px; padding:10px; background:var(--mn-nota-fondo,#1a1000); border:1px solid var(--mn-nota-bordo,#664400); border-radius:5px; color:var(--mn-nota-tenue,#cc9955); font-size:var(--fs-s);">⚠️ ${a.messaggio}</div>`;
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
        M.azzeraNote('step-modifiers');
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
            // 28 ottobre: la barra e` del motore (M.barraGittata), coi numeri sui confini.
            corpo = `<div style="text-align:center; color:var(--mn-debole,#aaaaaa); font-size:var(--fs-xs); margin:10px 0 5px;">Gittata (il Deactivator ha bande proprie):</div>
                ${M.barraGittata(arma.bands, { indice: t.rangeIndex, tocco: (i) => `window.setRangeScenografia(${i})`, stile: '' })}`;

            // Disco Baller: la stessa attrezzatura riaccende una Disco Ball alleata.
            if (/DISCO BALLER/i.test(((unita && unita.skills) || '') + ' ' + ((unita && unita.equip) || ''))) {
                const st = window.scenografiaDiscoBall
                    ? M.stileColore('si')
                    : 'background:var(--mn-fondo-tasto,#111111); border-color:var(--mn-spento,#888888); color:var(--mn-testo,#ffffff);';
                // L'etichetta nomina la Disco Ball in ENTRAMBI gli stati:
                // da spento diceva solo "disattivo un dispositivo nemico", e
                // chi non sapeva dell'interruttore non capiva a cosa servisse.
                corpo += `<button class="huge-btn" style="width:100%; margin-top:12px; min-height:55px; font-size:var(--fs-s); ${st}"
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
                <span style="color:var(--mn-debole,#aaaaaa);">${v.motivo}</span>
                <b style="color:${v.valore >= 0 ? 'var(--mn-si,#00ff00)' : 'var(--mn-errore,#ff3333)'};">${v.fonte === 'base' ? '' : (v.valore > 0 ? '+' + v.valore : v.valore)}</b></div>`).join('');

        document.getElementById('targets-allocation-container').innerHTML = `
            ${window.MotoreN5.intestazioneOrdine({ colore: COL, titolo: `${eDeactivator(azione) ? 'DEACTIVATOR' : 'INTERAGIRE CON OBIETTIVO'}` })}
            <div class="target-card" style="border-left:4px solid ${COL.bordo}; background:rgba(255,170,51,0.05); padding:15px; border-radius:5px;">
                <b style="color:var(--mn-testo,#ffffff); font-size:var(--fs-l); display:block; margin-bottom:12px;">${eDeactivator(azione) ? '🔌' : '🎯'} ${t.name}</b>
                <div style="background:var(--mn-nota-fondo,#1a1000); border:1px solid var(--mn-attenzione-fondo,#554400); padding:12px; border-radius:5px;">
                    <div style="text-align:center; color:var(--mn-testo,#ffffff); margin-bottom:8px;">
                        WIP ${e.base} → <b style="color:${COL.bordo}; font-size:var(--fs-l);">${e.valore}</b>
                        ${e.impossibile ? '<br><span style="color:var(--mn-errore,#ff3333); font-size:var(--fs-s);">Valore sotto 1: il tiro fallisce automaticamente</span>' : ''}
                    </div>
                    <div style="border-top:1px solid var(--mn-nota-bordo,#664400); padding-top:8px; font-size:var(--fs-s);">${dettaglio}</div>
                    ${e.critici && !e.critici.nessunTiro ? `<div style="text-align:center; color:var(--mn-attenzione,#ffcc00); font-size:var(--fs-xs); margin-top:6px;">🎯 ${e.critici.testo}</div>` : ''}
                </div>
                ${corpo}
            </div>`;
        // 28 ottobre (Paolo): le note nella ⓘ (o sotto il tasto).
        e.note.forEach(n => M.nota('step-modifiers', 'Scenografia', n, { tipo: 'regole' }));

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
    var v = { file: 'ordine_scenografia.js', versione: '2026-10-28.4', proprieta: 'MOTORE' };
    if (g.MotoreN5 && g.MotoreN5.dichiaraVersione) g.MotoreN5.dichiaraVersione(v.file, v.versione, v.proprieta);
    else { g.__versioniN5 = g.__versioniN5 || []; g.__versioniN5.push(v); }
})();
