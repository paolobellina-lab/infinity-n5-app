// @versione 2026-10-28.4 | ordine_trincerarsi.js | proprieta`: chat MOTORE
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
// (REGOLE_N5_v5_1_1.txt, Sapper, righe 9841-9847)
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

    // 28 ottobre (Paolo): il colore e` dell'ORDINE, non del modulo (M.COLORI_ORDINE nel
    // motore: Movimenti blu, Abilita` Brevi verdi, Ordini Interi rossi). COL legge le
    // tinte dell'Ordine in corso a ogni uso; 'TRINCERARSI' e` quello di casa. Prima: { bordo: '#aa8855', sfondo: '#2a2218' };.
    const COL = (function () {
        const ripiego = { bordo: '#aa8855', sfondo: '#2a2218', riquadro: '#2a2218', tenue: '#aa8855', testo: '#aa8855' };
        const o = {};
        ['bordo', 'sfondo', 'riquadro', 'tenue', 'testo'].forEach(function (k) {
            Object.defineProperty(o, k, { enumerable: true, get: function () {
                const M = window.MotoreN5;
                return (M && typeof M.colOrdine === 'function') ? M.colOrdine('TRINCERARSI')[k] : ripiego[k];
            } });
        });
        return o;
    })();

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
        window.MotoreN5.azzeraNote('step-modifiers');
        if (!container) return;

        if (!pre.puo) {
            container.innerHTML = `<div style="background:${COL.sfondo}; border:1px solid var(--mn-errore-bordo,#883333); padding:16px; border-radius:5px; text-align:center;">
                <b style="color:var(--mn-errore,#ff3333); font-size:var(--fs-m);">🕳️ TRINCERARSI NON DISPONIBILE</b>
                <div style="color:var(--mn-testo-2,#cccccc); font-size:var(--fs-s); margin-top:10px;">${pre.motivo}</div>
                ${pre.blocchi.length > 1 ? `<div style="color:var(--mn-spento,#888888); font-size:var(--fs-xs); margin-top:8px;">` +
                    pre.blocchi.slice(1).map(b => `• ${b}`).join('<br>') + `</div>` : ''}
            </div>`;
            window.aggiornaPulsanteTrincera(true);
            return window.goToStep('step-modifiers');
        }

        const esito = M.risolviTrincerarsi(unita, window.trinceraSpazio);
        const r = window.trinceraSpazio;

        container.innerHTML = `
            ${window.MotoreN5.intestazioneOrdine({ colore: COL, titolo: `🕳️ TRINCERARSI` })}
            <div style="color:var(--mn-debole,#aaaaaa); font-size:var(--fs-s); text-align:center; margin-bottom:16px;">
                Ordine Intero, nessun tiro. Il calcolatore non ha la mappa.</div>

            <div style="background:${COL.sfondo}; border:1px solid ${COL.bordo}; padding:14px; border-radius:5px;">
                <div style="color:var(--mn-testo,#ffffff); font-size:var(--fs-m); margin-bottom:12px;">${pre.domanda}</div>
                <div style="display:flex; gap:8px;">
                    <button class="huge-btn" style="flex:1; min-height:50px; ${r === true ? 'background:var(--mn-si-fondo,#004400); border-color:var(--mn-si,#00ff00);' : 'background:var(--mn-fondo-tasto,#111111);'}"
                        onclick="window.rispondiTrincera(true)">SÌ</button>
                    <button class="huge-btn" style="flex:1; min-height:50px; ${r === false ? 'background:var(--mn-attenzione-fondo,#554400); border-color:var(--mn-acceso,#ffaa33);' : 'background:var(--mn-fondo-tasto,#111111);'}"
                        onclick="window.rispondiTrincera(false)">NO</button>
                </div>
            </div>

            ${r === false ? `<div style="margin-top:14px; padding:14px; background:var(--mn-nota-fondo,#1a1000); border:2px solid var(--mn-acceso,#ffaa33); border-radius:5px;">
                <b style="color:var(--mn-acceso,#ffaa33); font-size:var(--fs-m);">⚠️ LA TRUPPA ESEGUE UN IDLE</b>
                <div style="color:var(--mn-testo-2,#cccccc); font-size:var(--fs-s); margin-top:8px;">${esito.motivo}</div>
                <div style="color:var(--mn-nota-testo,#ffcc66); font-size:var(--fs-s); margin-top:6px;">L'Ordine è comunque speso.</div>
            </div>` : ''}

            ${r === true ? `<div style="margin-top:14px; padding:14px; background:var(--mn-ordine-riquadro,#1a2a18); border:2px solid var(--mn-ordine-bordo,#66cc66); border-radius:5px;">
                <b style="color:var(--mn-si-testo,#88ff88); font-size:var(--fs-m);">🕳️ ENTRA IN STATO FOXHOLE</b>
                <div style="color:var(--mn-testo-2,#cccccc); font-size:var(--fs-s); margin-top:8px;">${esito.token}</div>
                <div style="color:var(--mn-debole,#aaaaaa); font-size:var(--fs-xs); margin-top:8px; line-height:1.6;">
                    ${esito.note.map(n => `• ${n}`).join('<br>')}
                </div>
            </div>` : ''}`;

        // "Non risposto" lo dice il motore: null e '' non sono una risposta.
        window.aggiornaPulsanteTrincera(!!esito.incompleto, !!esito.idle);
        window.goToStep('step-modifiers');
    };

    window.rispondiTrincera = function (v) {
        window.trinceraSpazio = v;
        window.mostraTrinceramento();
    };

    window.aggiornaPulsanteTrincera = function (disabilitato, idle) {
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
                        : (idle ? 'ESEGUI IDLE' : 'TRINCERATI');
    };

    window.eseguiTrinceramento = function () {
        const M = motore(); if (!M) return;
        const unita = window.coordUnits[window.coordIndex];
        const pre = M.puoTrincerarsi(unita);
        if (!pre.puo) return alert(`⛔ ${pre.motivo}\n\nL'ordine non è stato eseguito.`);

        // Tre esiti, dal motore: NON RISPOSTO non esegue.
        const esito = M.risolviTrincerarsi(unita, window.trinceraSpazio);
        if (esito.incompleto) {
            return alert('⚠️ Rispondi alla domanda sullo spazio prima di procedere.');
        }

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

        // 🔴 L'AVVERSARIO DEVE SAPERE DELL'ORDINE. Trincerarsi genera ARO
        // (catalogo, MOVIMENTO.senzaTiro), e anche l'Idle da requisito
        // fallito lo genera — ma l'allarme da qui non partiva mai, e la busta
        // non diceva all'Hub di aspettare le reazioni. MISURATO il 6 ottobre:
        // zero allarmi, aroAtteso false. E` lo stesso difetto che avevano
        // Piazzare Equipaggiamento e l'Idle (A-13). L'allarme lo costruisce
        // il motore (M.allarmeOrdine), come per tutti gli ordini senza tiro.
        const al = M.allarmeOrdine(M.AZIONI.TRINCERARSI, {
            unita: unita, coordUnits: window.coordUnits, coordMode: window.coordMode,
            azioneSeconda: window.currentOrder && window.currentOrder.action
        });
        if (al.payload && typeof window.inviaAllarmeAro === 'function') window.inviaAllarmeAro(al.payload);
        const spedito = M.inviaCalcolo(window.coordPayloads, { isCoordinated: window.coordMode, aroAtteso: !!(al.aro && al.aro.genera) });
        if (!spedito) { window.coordIndex--; window.coordPayloads.pop(); return; }

        const div = document.getElementById('calc-result');
        if (div) {
            div.innerHTML = `<div style="text-align:center; padding:20px; border:2px solid ${COL.bordo}; background:rgba(170,136,85,0.1); margin-top:20px;">
                <h2 style="color:${COL.bordo}; margin:0;">${esito.entra ? 'TRINCERATO' : 'IDLE'}</h2>
                <p style="font-size:var(--fs-s); color:var(--mn-testo-2,#cccccc);">${esito.entra ? esito.token : esito.motivo}</p>
            </div>`;
            div.style.display = 'block';
        }
    };

    console.log('🕳️ ordine_trincerarsi.js caricato.');
})();

// Dichiarazione di versione per il controllo incrociato fra chat.
(function () {
    var g = (typeof window !== 'undefined') ? window : globalThis;
    var v = { file: 'ordine_trincerarsi.js', versione: '2026-10-28.4', proprieta: 'MOTORE' };
    if (g.MotoreN5 && g.MotoreN5.dichiaraVersione) g.MotoreN5.dichiaraVersione(v.file, v.versione, v.proprieta);
    else { g.__versioniN5 = g.__versioniN5 || []; g.__versioniN5.push(v); }
})();
