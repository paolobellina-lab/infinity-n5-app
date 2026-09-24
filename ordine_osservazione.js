// @versione 2026-09-23.1 | ordine_osservazione.js | proprieta`: chat MOTORE
// ==========================================
// 👁️ OSSERVAZIONE (N5) - ordine_osservazione.js
// ------------------------------------------
// Tre azioni che si somigliano SOLO NEL NOME:
//
//   FORWARD OBSERVER    Abilità Breve / ARO · WIP · serve la LoF
//                       Non infligge danno: impone lo Stato Bersagliato
//
//   SENSOR              Abilità Breve · WIP+6 · NESSUNA LoF
//                       Nessun MOD di gittata né di Mimetismo
//                       Nessun bersaglio da designare: li Scopre TUTTI
//                       insieme dentro la Zona di Controllo
//
//   TRIANGULATED FIRE   Ordine Intero · BS · serve la LoF
//                       NESSUN MOD al tiro, tranne quelli al Burst
//                       Non supera la Gittata Massima dell'arma
//
// Tipo di ordine, attributo, bersagli, MOD e perfino la necessità della
// LoF sono diversi in tutte e tre. Un percorso solo avrebbe sbagliato due
// casi su tre, quindi il modulo si dirama subito.
// ==========================================

(function () {
    'use strict';

    function motore() {
        if (!window.MotoreN5) {
            alert('⛔ motore_regole_n5.js non è caricato: l\'osservazione non può funzionare.');
            return null;
        }
        return window.MotoreN5;
    }

    const COL = { bordo: '#66ddcc', sfondo: '#0d2a28' };

    window.avviaFaseOsservazione = function (actionId, isSecondHalf) {
        const M = motore(); if (!M) return;
        window.currentOrder = window.currentOrder || {};
        window.currentOrder.action = actionId;
        if (!isSecondHalf) window.currentOrder.action1 = actionId;
        window.currentOrder.isLongSkill = (actionId === M.AZIONI.TRIANGULATED);

        const ripresa = M.riprendiOrdineDaFinestra(actionId, isSecondHalf);
        if (!ripresa.riprende) {
            if (isSecondHalf) console.log('↩️ ' + ripresa.motivo);
            window.coordIndex = 0;
            window.coordPayloads = [];
            window.combatTargets = [];
            window.pendingTargets = [];
            window.osservazioneArma = null;
            window.avviaPassoOsservazione();
        } else {
            window.renderOsservazione();
        }
    };

    window.avviaPassoOsservazione = function () {
        const M = motore(); if (!M) return;
        const azione = window.currentOrder.action;

        // 🔴 Il Sensor non designa bersagli: si salta direttamente al tiro.
        if (azione === M.AZIONI.SENSOR) return window.renderOsservazione();
        // Il Triangulated Fire serve un'arma BS.
        if (azione === M.AZIONI.TRIANGULATED) return window.mostraArmiTriangulated();
        // Il Forward Observer ha un'arma sua.
        return window.setupBersagliOsservazione();
    };

    // ==============================================================
    // 1a. TRIANGULATED FIRE: quale arma
    // ==============================================================
    window.mostraArmiTriangulated = function () {
        const M = motore(); if (!M) return;
        const unita = window.coordUnits[window.coordIndex];
        if (window.mostraTitoloUnitaCorrente) window.mostraTitoloUnitaCorrente();

        const e = M.armiDisponibili(unita, M.AZIONI.BS_ATTACK);
        window.targetsScartati = (e.escluse || []).map(x => ({ nome: x.nome || x, motivo: x.motivo || '' }));

        const container = document.getElementById('weapon-buttons-container');
        if (!container) return;
        container.innerHTML = `<div style="background:${COL.sfondo}; border:1px solid ${COL.bordo}; padding:12px; border-radius:5px; margin-bottom:15px; text-align:center;">
            <b style="color:${COL.bordo}; font-size:18px;">🎯 TRIANGULATED FIRE</b><br>
            <span style="color:#aaa; font-size:13px;">Ordine Intero. Nessun MOD al tiro,<br>
            tranne quelli che toccano il Burst.</span></div>`;

        (e.armi || []).forEach(function (a) {
            const nomeEsc = String(a.nomeRichiesto || a.nome).replace(/'/g, "\\'");
            container.innerHTML += `<button class="huge-btn" style="width:100%; min-height:58px; font-size:18px; margin-bottom:6px; background:#111; border-color:${COL.bordo};"
                onclick="window.scegliArmaTriangulated('${nomeEsc}')">🎯 ${a.nome}</button>`;
        });
        window.goToStep('step-weapon');
    };

    window.scegliArmaTriangulated = function (nomeGrezzo) {
        window.osservazioneArma = nomeGrezzo;
        window.currentOrder.weapon = nomeGrezzo;
        window.setupBersagliOsservazione();
    };

    // ==============================================================
    // 1b. I BERSAGLI (non per il Sensor)
    // ==============================================================
    window.setupBersagliOsservazione = function () {
        const M = motore(); if (!M) return;
        const unita = window.coordUnits[window.coordIndex];
        const azione = window.currentOrder.action;
        if (window.mostraTitoloUnitaCorrente) window.mostraTitoloUnitaCorrente();

        const nemici = M.rosterNemico();
        const giudizi = M.bersagliValidi(azione, nemici, { attaccante: unita });
        window.validTargets = M.soloAmmessi(giudizi);
        window.targetsScartati = giudizi.filter(g => !g.ammesso).map(g => ({ nome: g.nome, motivo: g.motivo }));

        const fo = (azione === M.AZIONI.FORWARD_OBSERVER);
        const container = document.getElementById('enemy-target-buttons');
        if (!container) return;
        container.innerHTML = `<div style="background:${COL.sfondo}; border:1px solid ${COL.bordo}; padding:12px; border-radius:5px; margin-bottom:15px; text-align:center;">
            <b style="color:${COL.bordo}; font-size:18px;">${fo ? '👁️ FORWARD OBSERVER' : '🎯 TRIANGULATED FIRE'}</b><br>
            <span style="color:#aaa; font-size:13px;">${fo
                ? 'Serve la Linea di Tiro.<br>Non infligge danno: impone lo Stato Bersagliato.'
                : 'Serve la Linea di Tiro.'}</span></div>`;

        if (window.validTargets.length === 0) {
            container.innerHTML += `<p style="color:#ff3333; text-align:center; font-weight:bold;">Nessun bersaglio valido.</p>`;
        } else {
            window.validTargets.forEach(function (u) {
                container.innerHTML += `<button class="huge-btn" style="width:100%; min-height:58px; font-size:18px; margin-bottom:6px; background:#111; border-color:${COL.bordo};"
                    onclick="window.scegliBersaglioOsservazione('${String(u.id).replace(/'/g, "\\'")}')">
                    ${fo ? '👁️' : '🎯'} ${M.nomeUnita(u)}</button>`;
            });
        }
        if (window.targetsScartati.length > 0) {
            container.innerHTML += `<div style="margin-top:15px; padding:10px; background:#111; border:1px solid #444; border-radius:5px; color:#888; font-size:13px;">
                <b style="color:#aaa;">Non bersagliabili:</b><br>` +
                window.targetsScartati.map(t => `• <b>${t.nome}</b> — ${t.motivo}`).join('<br>') + `</div>`;
        }
        window.goToStep('step-wait-aro');
    };

    window.scegliBersaglioOsservazione = function (id) {
        const M = motore(); if (!M) return;
        const u = M.rosterNemico().find(x => String(x.id) === String(id));
        if (!u) return;
        window.combatTargets = [{ id: u.id, name: M.nomeUnita(u), burst: 1, cover: false,
                                  rangeIndex: 0, rangeMod: 0, terrain: 'NESSUNO' }];
        window.pendingTargets = [u];
        window.renderOsservazione();
    };

    // ==============================================================
    // 2. IL TIRO
    // ==============================================================
    window.renderOsservazione = function () {
        const M = motore(); if (!M) return;
        const unita = window.coordUnits[window.coordIndex];
        const azione = window.currentOrder.action;
        let e, corpo = '', titolo = '';

        if (azione === M.AZIONI.SENSOR) {
            e = M.regoleSensor(unita, M.rosterNemico());
            titolo = 'SENSOR';
            if (e.valido) {
                corpo = `<div style="margin-top:12px; padding:12px; background:#0d2a28; border:1px solid ${COL.bordo}; border-radius:5px;">
                    <div style="color:${COL.bordo}; font-size:14px; margin-bottom:8px;">Un tiro solo, e li Scopre TUTTI:</div>
                    ${e.bersagli.length
                        ? e.bersagli.map(b => `<div style="color:#fff; font-size:16px;">👁️ ${b.nome}</div>`).join('')
                        : '<div style="color:#ff9999; font-size:14px;">Nessun nemico Nascosto o in CAMO nella ZdC.</div>'}
                </div>`;
            }
        } else {
            const t = (window.combatTargets || [])[0];
            if (!t) { alert('⛔ Nessun bersaglio scelto.'); return window.setupBersagliOsservazione(); }
            const bers = (window.pendingTargets || [])[0] || {};

            if (azione === M.AZIONI.FORWARD_OBSERVER) {
                e = M.regoleForwardObserver(unita, bers, { rangeIndex: t.rangeIndex, cover: t.cover });
                titolo = 'FORWARD OBSERVER';
                if (e.valido) {
                    corpo = window.barraGittata(e.arma, t, 'window.setRangeOsservazione') +
                        `<div style="margin-top:12px; padding:12px; background:#332200; border:1px solid #cc8800; border-radius:5px; text-align:center;">
                            <b style="color:#ffaa33; font-size:15px;">⚠️ NON INFLIGGE DANNO</b>
                            <div style="color:#ffcc88; font-size:13px; margin-top:6px;">Il bersaglio entra in Stato Bersagliato: nessun Tiro Salvezza.</div>
                        </div>`;
                }
            } else {
                const arma = M.profiloArma(window.osservazioneArma || window.currentOrder.weapon);
                e = M.regoleTriangulated(unita, bers, arma, { rangeIndex: t.rangeIndex, cover: t.cover });
                titolo = 'TRIANGULATED FIRE';
                if (e.valido) {
                    corpo = window.barraGittata(arma, t, 'window.setRangeOsservazione') +
                        (e.modIgnorati.length
                            ? `<div style="margin-top:12px; padding:12px; background:#0d2a28; border:1px solid ${COL.bordo}; border-radius:5px;">
                                <div style="color:${COL.bordo}; font-size:13px; margin-bottom:6px;">MOD ignorati dal Triangulated Fire:</div>
                                ${e.modIgnorati.map(v => `<div style="display:flex; justify-content:space-between; color:#888; font-size:13px;">
                                    <span style="text-decoration:line-through;">${v.motivo}</span>
                                    <b style="text-decoration:line-through;">${v.valore > 0 ? '+' : ''}${v.valore}</b></div>`).join('')}
                                <div style="color:#aaa; font-size:12px; margin-top:8px;">Senza questa Abilità il tiro sarebbe ${e.valoreConMod}.</div>
                            </div>` : '')
                        + (e.oltreGittata ? `<div style="margin-top:10px; padding:10px; background:#330000; border:1px solid #ff3333; border-radius:4px; color:#ff9999; font-size:13px;">
                            ⛔ Oltre la Gittata Massima dell'arma: il Triangulated Fire non lo permette.</div>` : '');
                }
            }
        }

        window.osservazioneEsito = e;
        const container = document.getElementById('targets-allocation-container');
        if (!container) return;

        if (!e || !e.valido) {
            container.innerHTML = `<div style="padding:16px; text-align:center; background:#2a1010; border:1px solid #883333; border-radius:5px;">
                <b style="color:#ff6666;">${titolo || 'OSSERVAZIONE'} NON DISPONIBILE</b>
                <div style="color:#ccc; font-size:14px; margin-top:8px;">${(e && e.motivo) || 'Azione non valida.'}</div></div>`;
            window.aggiornaPulsanteOsservazione(true);
            return window.goToStep('step-modifiers');
        }

        const dettaglio = e.voci.map(v => `<div style="display:flex; justify-content:space-between; padding:2px 0;">
                <span style="color:#aaa;">${v.motivo}</span>
                <b style="color:${v.valore >= 0 ? '#00ff00' : '#ff6666'};">${v.fonte === 'base' ? '' : (v.valore > 0 ? '+' + v.valore : v.valore)}</b></div>`).join('');

        container.innerHTML = `
            <h2 style="color:${COL.bordo}; text-align:center; margin-bottom:16px;">${titolo}</h2>
            <div style="background:#0d2018; border:1px solid #2a5550; padding:12px; border-radius:5px;">
                <div style="text-align:center; color:#fff; margin-bottom:8px;">
                    ${e.attributo} ${e.base} → <b style="color:${COL.bordo}; font-size:26px;">${e.valore}</b>
                    ${e.impossibile ? '<br><span style="color:#ff3333; font-size:13px;">Valore sotto 1: il tiro fallisce automaticamente</span>' : ''}
                </div>
                <div style="border-top:1px solid #1a4440; padding-top:8px; font-size:14px;">${dettaglio}</div>
                ${e.critici && !e.critici.nessunTiro ? `<div style="text-align:center; color:#ffcc00; font-size:12px; margin-top:6px;">🎯 ${e.critici.testo}</div>` : ''}
            </div>
            ${corpo}
            ${e.note.length ? `<div style="margin-top:12px; color:#888; font-size:12px; line-height:1.6;">` +
                e.note.map(n => `• ${n}`).join('<br>') + `</div>` : ''}`;

        window.aggiornaPulsanteOsservazione(false);
        window.goToStep('step-modifiers');
    };

    window.barraGittata = function (arma, t, callback) {
        if (!arma || !arma.bands || !arma.bands.length) return '';
        let seg = '', lab = '';
        arma.bands.forEach(function (b, i) {
            let cls = 'seg-2';
            if (b.mod > 0) cls = 'seg-1'; else if (b.mod === -3) cls = 'seg-3'; else if (b.mod < -3) cls = 'seg-4';
            seg += `<div class="range-seg ${cls} ${t.rangeIndex === i ? 'active' : ''}" onclick="${callback}(${i})">${b.mod > 0 ? '+' + b.mod : b.mod}</div>`;
            lab += `<span>${b.label}</span>`;
        });
        return `<div style="text-align:center; color:#aaa; font-size:12px; margin:12px 0 5px;">Gittata:</div>
            <div class="range-bar">${seg}</div>
            <div style="display:flex; justify-content:space-between; font-size:10px; color:#888; margin-top:4px;">${lab}</div>`;
    };

    window.setRangeOsservazione = function (i) {
        const M = motore(); if (!M) return;
        const azione = window.currentOrder.action;
        const arma = (azione === M.AZIONI.FORWARD_OBSERVER)
            ? M.armaForwardObserver ? M.armaForwardObserver() : M.profiloArma('Forward Observer')
            : M.profiloArma(window.osservazioneArma || window.currentOrder.weapon);
        window.combatTargets[0].rangeIndex = i;
        window.combatTargets[0].rangeMod = (arma.bands && arma.bands[i]) ? arma.bands[i].mod : 0;
        window.renderOsservazione();
    };

    window.aggiornaPulsanteOsservazione = function (disabilitato) {
        const btn = document.getElementById('btn-esegui-calcolo') ||
                    document.querySelector('#step-modifiers .huge-btn');
        if (!btn) return;
        const nuovo = btn.cloneNode(true);
        btn.parentNode.replaceChild(nuovo, btn);
        // 🔴 Il display si rende esplicito SEMPRE: cloneNode(true) copia lo
            // style inline, e se chi ha usato la schermata prima lo aveva
            // nascosto il clone nasceva invisibile. Etichetta giusta,
            // onclick funzionante, pulsante non cliccabile.
            nuovo.style.display = '';
        nuovo.onclick = function () { if (!disabilitato) window.eseguiOsservazione(); };
        nuovo.innerText = disabilitato ? 'NON DISPONIBILE' : 'ESEGUI TIRO';
    };

    // ==============================================================
    // 3. INVIO
    // ==============================================================
    window.eseguiOsservazione = function () {
        const M = motore(); if (!M) return;
        const unita = window.coordUnits[window.coordIndex];
        const azione = window.currentOrder.action;
        const e = window.osservazioneEsito;
        if (!e || !e.valido) return alert('⛔ ' + ((e && e.motivo) || 'Azione non valida.'));

        window.coordPayloads.push({
            attaccante: unita,
            azione: azione,
            arma: e.arma || null,
            bersagli: (azione === M.AZIONI.SENSOR) ? [] : window.combatTargets,
            burstDisponibile: 1,
            regole: {
                attributo: e.attributo,
                valoreSuccesso: e.valore,
                base: e.base, mod: e.mod, voci: e.voci,
                // Forward Observer: nessun danno, uno Stato.
                statoInflitto: e.statoInflitto || null,
                nonOffensivo: !!e.statoInflitto || azione === M.AZIONI.SENSOR,
                // Sensor: un tiro, molti scoperti.
                scopreTutti: !!e.scopreTutti,
                scoperti: e.bersagli || null,
                // Triangulated: quali MOD sono stati ignorati.
                modIgnorati: e.modIgnorati || null,
                note: e.note
            }
        });

        window.coordIndex++;
        if (window.coordIndex < window.coordUnits.length) {
            window.combatTargets = [];
            window.pendingTargets = [];
            window.osservazioneArma = null;
            return window.avviaPassoOsservazione();
        }

        const spedito = M.inviaCalcolo(window.coordPayloads, { isCoordinated: window.coordMode });
        if (!spedito) { window.coordIndex--; window.coordPayloads.pop(); return; }
    };

    console.log('👁️ ordine_osservazione.js caricato.');
})();

// Dichiarazione di versione per il controllo incrociato fra chat.
(function () {
    var g = (typeof window !== 'undefined') ? window : globalThis;
    var v = { file: 'ordine_osservazione.js', versione: '2026-09-19.1', proprieta: 'MOTORE' };
    if (g.MotoreN5 && g.MotoreN5.dichiaraVersione) g.MotoreN5.dichiaraVersione(v.file, v.versione, v.proprieta);
    else { g.__versioniN5 = g.__versioniN5 || []; g.__versioniN5.push(v); }
})();
