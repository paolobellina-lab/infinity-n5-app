// @versione 2026-09-19.1 | ordine_logistica.js | proprieta`: chat MOTORE
// ==========================================
// 🪂 INGRESSO IN CAMPO e REQUEST SPEEDBALL - ordine_logistica.js
// ------------------------------------------
// Gli ultimi due ordini senza modulo. Non sono di combattimento:
// riguardano schieramento e logistica di scenario.
//
// 🔴 Due cose che il regolamento tratta diversamente dall'intuito:
//
//   Fallire l'INGRESSO IN CAMPO non significa "non entri": entri lo
//   stesso, ma nella tua Zona di Schieramento a contatto col bordo, come
//   Modello e senza i Deployable. Dirlo PRIMA del tiro cambia la
//   decisione: un "non puoi entrare" farebbe credere che l'Ordine sia
//   sprecato, e non lo è.
//
//   Il REQUEST SPEEDBALL non è un Ordine: è un'Abilità Automatica, e il
//   tiro è un PH FISSO a 14 — non quello della truppa. Un Trooper con
//   PH 8 tira comunque 14.
// ==========================================

(function () {
    'use strict';

    function motore() {
        if (!window.MotoreN5) {
            alert('⛔ motore_regole_n5.js non è caricato.');
            return null;
        }
        return window.MotoreN5;
    }

    const COL = { bordo: '#88aaff', sfondo: '#161d33' };

    window.avviaFaseLogistica = function (actionId, isSecondHalf) {
        const M = motore(); if (!M) return;
        window.currentOrder = window.currentOrder || {};
        window.currentOrder.action = actionId;
        if (!isSecondHalf) window.currentOrder.action1 = actionId;
        window.currentOrder.isLongSkill = (actionId === M.AZIONI.INGRESSO);

        window.coordIndex = window.coordIndex || 0;
        window.coordPayloads = window.coordPayloads || [];
        window.logisticaRisposta = undefined;
        window.speedballTiro = null;
        window.speedballScelto = null;

        if (actionId === M.AZIONI.SPEEDBALL) return window.renderSpeedball();
        return window.renderIngresso();
    };

    // ==============================================================
    // INGRESSO IN CAMPO
    // ==============================================================
    window.renderIngresso = function () {
        const M = motore(); if (!M) return;
        const unita = window.coordUnits[window.coordIndex];
        if (window.mostraTitoloUnitaCorrente) window.mostraTitoloUnitaCorrente();

        const e = M.regoleIngressoInCampo(unita, {});
        window.logisticaEsito = e;
        const container = document.getElementById('targets-allocation-container');
        if (!container) return;

        if (!e.valido) {
            container.innerHTML = `<div style="padding:16px; text-align:center; background:#2a1010; border:1px solid #883333; border-radius:5px;">
                <b style="color:#ff6666;">INGRESSO IN CAMPO NON DISPONIBILE</b>
                <div style="color:#ccc; font-size:14px; margin-top:8px;">${e.motivo}</div></div>`;
            window.aggiornaPulsanteLogistica(true, 'NON DISPONIBILE');
            return window.goToStep('step-modifiers');
        }

        const r = window.logisticaRisposta;
        container.innerHTML = `
            <h2 style="color:${COL.bordo}; text-align:center; margin-bottom:6px;">🪂 INGRESSO IN CAMPO</h2>
            <div style="color:#aaa; font-size:13px; text-align:center; margin-bottom:16px;">
                Ordine Intero. Il calcolatore non ha la mappa.</div>

            <div style="background:#0d1428; border:1px solid #2a3a66; padding:12px; border-radius:5px;">
                <div style="text-align:center; color:#fff; margin-bottom:8px;">
                    PH <b style="color:${COL.bordo}; font-size:26px;">${e.valore}</b></div>
                ${e.voci.map(v => `<div style="display:flex; justify-content:space-between; color:#aaa; font-size:13px;">
                    <span>${v.motivo}</span></div>`).join('')}
                ${e.critici && !e.critici.nessunTiro ? `<div style="text-align:center; color:#ffcc00; font-size:12px; margin-top:6px;">🎯 ${e.critici.testo}</div>` : ''}
            </div>

            <div style="margin-top:14px; background:${COL.sfondo}; border:1px solid ${COL.bordo}; padding:14px; border-radius:5px;">
                <div style="color:#fff; font-size:15px; margin-bottom:10px;">${e.domanda}</div>
                <div style="color:#999; font-size:12px; line-height:1.6; margin-bottom:12px;">
                    ${e.divieti.map(d => `• ${d}`).join('<br>')}</div>
                <div style="display:flex; gap:8px;">
                    <button class="huge-btn" style="flex:1; min-height:48px; ${r === true ? 'background:#004400; border-color:#00ff00;' : 'background:#111;'}"
                        onclick="window.rispondiLogistica(true)">SÌ</button>
                    <button class="huge-btn" style="flex:1; min-height:48px; ${r === false ? 'background:#553300; border-color:#ffaa33;' : 'background:#111;'}"
                        onclick="window.rispondiLogistica(false)">NO</button>
                </div>
                ${r === false ? `<div style="margin-top:10px; padding:10px; background:#330000; border:1px solid #ff3333; border-radius:4px; color:#ff9999; font-size:13px;">
                    ⛔ Il punto scelto non è valido: scegline un altro prima di tirare.</div>` : ''}
            </div>

            <div style="margin-top:14px; padding:12px; background:#2a2010; border:1px solid #886633; border-radius:5px;">
                <b style="color:#ffcc66; font-size:14px;">SE IL TIRO FALLISCE</b>
                <div style="color:#ddd; font-size:13px; margin-top:6px; line-height:1.6;">
                    • ${e.seFallisce.dove}<br>
                    • ${e.seFallisce.perdeMarker}<br>
                    • ${e.seFallisce.deployableRimossi}
                </div>
                <div style="color:#ffcc88; font-size:12px; margin-top:8px;">
                    La truppa entra comunque: l'Ordine non è sprecato.</div>
            </div>

            ${e.note.length ? `<div style="margin-top:12px; color:#888; font-size:12px; line-height:1.6;">` +
                e.note.map(n => `• ${n}`).join('<br>') + `</div>` : ''}`;

        window.aggiornaPulsanteLogistica(r !== true, r === false ? 'PUNTO NON VALIDO' : 'ESEGUI TIRO PH');
        window.goToStep('step-modifiers');
    };

    window.rispondiLogistica = function (v) {
        window.logisticaRisposta = v;
        window.renderIngresso();
    };

    // ==============================================================
    // REQUEST SPEEDBALL
    // ==============================================================
    window.renderSpeedball = function () {
        const M = motore(); if (!M) return;
        const unita = window.coordUnits[window.coordIndex];
        if (window.mostraTitoloUnitaCorrente) window.mostraTitoloUnitaCorrente();

        const e = M.regoleSpeedball(unita, { tokenDisponibili: window.speedballToken });
        window.logisticaEsito = e;
        const container = document.getElementById('targets-allocation-container');
        if (!container) return;

        const scelto = window.speedballScelto;
        const tiro = window.speedballTiro;
        const daTiro = (tiro != null) ? M.oggettoSpeedball(tiro) : null;

        container.innerHTML = `
            <h2 style="color:${COL.bordo}; text-align:center; margin-bottom:6px;">📦 REQUEST SPEEDBALL</h2>
            <div style="color:#aaa; font-size:13px; text-align:center; margin-bottom:16px;">
                Abilità Automatica, non un Ordine.</div>

            <div style="background:#0d1428; border:1px solid #2a3a66; padding:12px; border-radius:5px; text-align:center;">
                <div style="color:#fff;">PH <b style="color:${COL.bordo}; font-size:26px;">${e.valore}</b>
                    <span style="color:#888; font-size:12px;"> — fisso</span></div>
                <div style="color:#999; font-size:12px; margin-top:6px;">
                    Un tiro per ciascuno dei ${e.token} Token.</div>
            </div>

            <div style="margin-top:14px; background:${COL.sfondo}; border:1px solid ${COL.bordo}; padding:14px; border-radius:5px;">
                <div style="color:${COL.bordo}; font-size:14px; margin-bottom:8px;">PRIMO TOKEN — scegli l'oggetto</div>
                ${Object.keys(e.oggetti).map(function (o) {
                    return `<button class="huge-btn" style="width:100%; min-height:44px; font-size:15px; margin-bottom:5px; ${scelto === o ? 'background:#003355; border-color:' + COL.bordo + ';' : 'background:#111;'}"
                        onclick="window.scegliSpeedball('${o.replace(/'/g, "\\'")}')">${o}</button>`;
                }).join('')}
                ${scelto ? `<div style="margin-top:8px; color:#aaccff; font-size:12px;">${e.oggetti[scelto]}</div>` : ''}
            </div>

            <div style="margin-top:14px; background:${COL.sfondo}; border:1px solid ${COL.bordo}; padding:14px; border-radius:5px;">
                <div style="color:${COL.bordo}; font-size:14px; margin-bottom:8px;">SECONDO TOKEN — tira sulla Chart</div>
                <div style="color:#999; font-size:12px; line-height:1.7; margin-bottom:10px;">
                    ${e.chart.map(r => `${r.da}-${r.a}: ${r.oggetto}`).join(' &nbsp;·&nbsp; ')}</div>
                <input id="speedball-tiro" type="number" min="1" max="20" value="${tiro != null ? tiro : ''}"
                    placeholder="il risultato del D20"
                    style="width:100%; padding:12px; font-size:18px; background:#111; color:#fff; border:1px solid ${COL.bordo}; border-radius:4px;"
                    onchange="window.tiraSpeedball(this.value)">
                ${daTiro ? (daTiro.oggetto
                    ? `<div style="margin-top:10px; padding:10px; background:#0d2a18; border:1px solid #66cc66; border-radius:4px;">
                        <b style="color:#88ff88;">${daTiro.oggetto}</b>
                        <div style="color:#ccc; font-size:12px; margin-top:4px;">${daTiro.effetto}</div></div>`
                    : `<div style="margin-top:10px; padding:10px; background:#330000; border:1px solid #ff3333; border-radius:4px; color:#ff9999; font-size:13px;">⛔ ${daTiro.avviso.messaggio}</div>`) : ''}
            </div>

            ${e.avvisi.length ? `<div style="margin-top:12px; padding:10px; background:#221100; border:1px solid #664400; border-radius:4px; color:#cc9955; font-size:13px;">` +
                e.avvisi.map(a => `⚠️ ${a.messaggio}`).join('<br>') + `</div>` : ''}

            <div style="margin-top:12px; color:#888; font-size:12px; line-height:1.6;">
                ${e.note.map(n => `• ${n}`).join('<br>')}</div>`;

        window.aggiornaPulsanteLogistica(!(scelto && daTiro && daTiro.oggetto), 'CONFERMA SPEEDBALL');
        window.goToStep('step-modifiers');
    };

    window.scegliSpeedball = function (o) { window.speedballScelto = o; window.renderSpeedball(); };
    window.tiraSpeedball = function (v) {
        const n = parseInt(v, 10);
        window.speedballTiro = isFinite(n) ? n : null;
        window.renderSpeedball();
    };

    // ==============================================================
    window.aggiornaPulsanteLogistica = function (disabilitato, etichetta) {
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
        nuovo.onclick = function () { if (!disabilitato) window.eseguiLogistica(); };
        nuovo.innerText = disabilitato ? (etichetta || 'COMPLETA I CAMPI') : (etichetta || 'ESEGUI');
    };

    window.eseguiLogistica = function () {
        const M = motore(); if (!M) return;
        const unita = window.coordUnits[window.coordIndex];
        const azione = window.currentOrder.action;
        const e = window.logisticaEsito;
        if (!e || !e.valido) return alert('⛔ ' + ((e && e.motivo) || 'Azione non valida.'));

        const regole = {
            attributo: e.attributo,
            valoreSuccesso: e.valore,
            voci: e.voci,
            nonOffensivo: true,
            note: e.note
        };

        if (azione === M.AZIONI.INGRESSO) {
            if (window.logisticaRisposta !== true) {
                return alert('⚠️ Conferma che il punto di atterraggio rispetta i divieti prima di tirare.');
            }
            regole.isLongSkill = true;
            regole.seFallisce = e.seFallisce;
            regole.senzaCoperturaParziale = true;
        } else {
            const daTiro = M.oggettoSpeedball(window.speedballTiro);
            if (!window.speedballScelto || !daTiro.oggetto) {
                return alert('⚠️ Scegli l\'oggetto del primo Token e inserisci il tiro del secondo.');
            }
            regole.nonEUnOrdine = true;
            regole.phFisso = true;
            regole.token = [
                { origine: 'scelto', oggetto: window.speedballScelto, effetto: e.oggetti[window.speedballScelto] },
                { origine: 'tirato', tiro: window.speedballTiro, oggetto: daTiro.oggetto, effetto: daTiro.effetto }
            ];
        }

        window.coordPayloads.push({
            attaccante: unita, azione: azione, arma: null,
            bersagli: [], burstDisponibile: 0, regole: regole
        });

        window.coordIndex++;
        if (window.coordIndex < window.coordUnits.length) {
            window.logisticaRisposta = undefined;
            window.speedballTiro = null; window.speedballScelto = null;
            return (azione === M.AZIONI.SPEEDBALL) ? window.renderSpeedball() : window.renderIngresso();
        }

        const spedito = M.inviaCalcolo(window.coordPayloads, { isCoordinated: window.coordMode });
        if (!spedito) { window.coordIndex--; window.coordPayloads.pop(); return; }
    };

    console.log('🪂 ordine_logistica.js caricato.');
})();

// Dichiarazione di versione per il controllo incrociato fra chat.
(function () {
    var g = (typeof window !== 'undefined') ? window : globalThis;
    var v = { file: 'ordine_logistica.js', versione: '2026-09-19.1', proprieta: 'MOTORE' };
    if (g.MotoreN5 && g.MotoreN5.dichiaraVersione) g.MotoreN5.dichiaraVersione(v.file, v.versione, v.proprieta);
    else { g.__versioniN5 = g.__versioniN5 || []; g.__versioniN5.push(v); }
})();
