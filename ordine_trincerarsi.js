// @versione 2026-09-19.1 | ordine_trincerarsi.js | proprieta`: chat MOTORE
// ==========================================
// 🕳️ TRINCERARSI / SAPPER (N5) - ordine_trincerarsi.js
// ------------------------------------------
// Ordine Intero, nessun tiro, nessun bersaglio: come il Movimento.
//
// 🔴 Il requisito che l'app NON può verificare: lo spazio deve avere
// altezza e larghezza almeno pari alla Silhouette dello Stato Foxhole.
// Senza mappa, si chiede.
//
// E se la risposta è no, la truppa NON "non esegue l'ordine": esegue un
// IDLE. L'Ordine è speso comunque. È la differenza fra "non puoi" e
// "puoi provare e fallire", e il regolamento dice la seconda.
// (PARTE_1, righe 7415-7431)
// ==========================================

(function () {
    'use strict';

    function motore() {
        if (!window.MotoreN5) {
            alert('⛔ motore_regole_n5.js non è caricato: Trincerarsi non può funzionare.');
            return null;
        }
        return window.MotoreN5;
    }

    const COL = { bordo: '#aa8855', sfondo: '#2a2218' };

    window.avviaFaseTrincerarsi = function (actionId, isSecondHalf) {
        const M = motore(); if (!M) return;
        window.currentOrder = window.currentOrder || {};
        window.currentOrder.action = actionId;
        window.currentOrder.isLongSkill = true;   // Ordine Intero
        if (!isSecondHalf) window.currentOrder.action1 = actionId;

        window.coordIndex = window.coordIndex || 0;
        window.coordPayloads = window.coordPayloads || [];
        window.trinceraSpazio = undefined;
        window.mostraTrinceramento();
    };

    window.mostraTrinceramento = function () {
        const M = motore(); if (!M) return;
        const unita = window.coordUnits[window.coordIndex];
        if (window.mostraTitoloUnitaCorrente) window.mostraTitoloUnitaCorrente();

        const pre = M.puoTrincerarsi(unita);
        const container = document.getElementById('targets-allocation-container');
        if (!container) return;

        if (!pre.puo) {
            container.innerHTML = `<div style="background:${COL.sfondo}; border:1px solid #883333; padding:16px; border-radius:5px; text-align:center;">
                <b style="color:#ff6666; font-size:18px;">🕳️ TRINCERARSI NON DISPONIBILE</b>
                <div style="color:#ccc; font-size:14px; margin-top:10px;">${pre.motivo}</div>
                ${pre.blocchi.length > 1 ? `<div style="color:#888; font-size:12px; margin-top:8px;">` +
                    pre.blocchi.slice(1).map(b => `• ${b}`).join('<br>') + `</div>` : ''}
            </div>`;
            window.aggiornaPulsanteTrincera(true);
            return window.goToStep('step-modifiers');
        }

        const esito = M.risolviTrincerarsi(unita, window.trinceraSpazio);
        const r = window.trinceraSpazio;

        container.innerHTML = `
            <h2 style="color:${COL.bordo}; text-align:center; margin-bottom:8px;">🕳️ TRINCERARSI</h2>
            <div style="color:#aaa; font-size:13px; text-align:center; margin-bottom:16px;">
                Ordine Intero, nessun tiro. Il calcolatore non ha la mappa.</div>

            <div style="background:${COL.sfondo}; border:1px solid ${COL.bordo}; padding:14px; border-radius:5px;">
                <div style="color:#fff; font-size:16px; margin-bottom:12px;">${pre.domanda}</div>
                <div style="display:flex; gap:8px;">
                    <button class="huge-btn" style="flex:1; min-height:50px; ${r === true ? 'background:#004400; border-color:#00ff00;' : 'background:#111;'}"
                        onclick="window.rispondiTrincera(true)">SÌ</button>
                    <button class="huge-btn" style="flex:1; min-height:50px; ${r === false ? 'background:#553300; border-color:#ffaa33;' : 'background:#111;'}"
                        onclick="window.rispondiTrincera(false)">NO</button>
                </div>
            </div>

            ${r === false ? `<div style="margin-top:14px; padding:14px; background:#332200; border:2px solid #ffaa33; border-radius:5px;">
                <b style="color:#ffaa33; font-size:16px;">⚠️ LA TRUPPA ESEGUE UN IDLE</b>
                <div style="color:#ddd; font-size:13px; margin-top:8px;">${esito.motivo}</div>
                <div style="color:#ffcc88; font-size:13px; margin-top:6px;">L'Ordine è comunque speso.</div>
            </div>` : ''}

            ${r === true ? `<div style="margin-top:14px; padding:14px; background:#1a2a18; border:2px solid #66cc66; border-radius:5px;">
                <b style="color:#88ff88; font-size:16px;">🕳️ ENTRA IN STATO FOXHOLE</b>
                <div style="color:#ccc; font-size:13px; margin-top:8px;">${esito.token}</div>
                <div style="color:#999; font-size:12px; margin-top:8px; line-height:1.6;">
                    ${esito.note.map(n => `• ${n}`).join('<br>')}
                </div>
            </div>` : ''}`;

        window.aggiornaPulsanteTrincera(r === undefined);
        window.goToStep('step-modifiers');
    };

    window.rispondiTrincera = function (v) {
        window.trinceraSpazio = v;
        window.mostraTrinceramento();
    };

    window.aggiornaPulsanteTrincera = function (disabilitato) {
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
        nuovo.onclick = function () { window.eseguiTrinceramento(); };
        nuovo.innerText = disabilitato ? 'RISPONDI ALLA DOMANDA'
                        : (window.trinceraSpazio === false ? 'ESEGUI IDLE' : 'TRINCERATI');
    };

    window.eseguiTrinceramento = function () {
        const M = motore(); if (!M) return;
        const unita = window.coordUnits[window.coordIndex];
        const pre = M.puoTrincerarsi(unita);
        if (!pre.puo) return alert(`⛔ ${pre.motivo}\n\nL'ordine non è stato eseguito.`);

        if (window.trinceraSpazio === undefined) {
            return alert('⚠️ Rispondi alla domanda sullo spazio prima di procedere.');
        }

        const esito = M.risolviTrincerarsi(unita, window.trinceraSpazio);

        window.coordPayloads.push({
            attaccante: unita,
            azione: M.AZIONI.TRINCERARSI,
            arma: null,
            bersagli: [],
            burstDisponibile: 0,
            regole: {
                senzaTiro: true,
                isLongSkill: true,
                entraInFoxhole: esito.entra,
                idle: !!esito.idle,
                motivo: esito.motivo || null,
                note: esito.note || []
            }
        });

        // Lo stato lo applica l'app, non il payload.
        if (esito.entra) {
            unita.states = unita.states || {};
            unita.states.foxhole = true;
            if (window.aggiornaGraficaRoster) window.aggiornaGraficaRoster();
        }

        window.coordIndex++;
        if (window.coordIndex < window.coordUnits.length) {
            window.trinceraSpazio = undefined;
            return window.mostraTrinceramento();
        }

        const spedito = M.inviaCalcolo(window.coordPayloads, { isCoordinated: window.coordMode });
        if (!spedito) { window.coordIndex--; window.coordPayloads.pop(); return; }

        const div = document.getElementById('calc-result');
        if (div) {
            div.innerHTML = `<div style="text-align:center; padding:20px; border:2px solid ${COL.bordo}; background:rgba(170,136,85,0.1); margin-top:20px;">
                <h2 style="color:${COL.bordo}; margin:0;">${esito.entra ? 'TRINCERATO' : 'IDLE'}</h2>
                <p style="font-size:13px; color:#ccc;">${esito.entra ? esito.token : esito.motivo}</p>
            </div>`;
            div.style.display = 'block';
        }
    };

    console.log('🕳️ ordine_trincerarsi.js caricato.');
})();

// Dichiarazione di versione per il controllo incrociato fra chat.
(function () {
    var g = (typeof window !== 'undefined') ? window : globalThis;
    var v = { file: 'ordine_trincerarsi.js', versione: '2026-09-19.1', proprieta: 'MOTORE' };
    if (g.MotoreN5 && g.MotoreN5.dichiaraVersione) g.MotoreN5.dichiaraVersione(v.file, v.versione, v.proprieta);
    else { g.__versioniN5 = g.__versioniN5 || []; g.__versioniN5.push(v); }
})();
