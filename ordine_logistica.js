// @versione 2026-10-28.4 | ordine_logistica.js | proprieta`: chat MOTORE
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

    // 28 ottobre (Paolo): il colore e` dell'ORDINE, non del modulo (M.COLORI_ORDINE nel
    // motore: Movimenti blu, Abilita` Brevi verdi, Ordini Interi rossi). COL legge le
    // tinte dell'Ordine in corso a ogni uso; 'REQUEST SPEEDBALL' e` quello di casa. Prima: { bordo: '#88aaff', sfondo: '#161d33' };.
    const COL = (function () {
        const ripiego = { bordo: '#88aaff', sfondo: '#161d33', riquadro: '#161d33', tenue: '#88aaff', testo: '#88aaff' };
        const o = {};
        ['bordo', 'sfondo', 'riquadro', 'tenue', 'testo'].forEach(function (k) {
            Object.defineProperty(o, k, { enumerable: true, get: function () {
                const M = window.MotoreN5;
                return (M && typeof M.colOrdine === 'function') ? M.colOrdine('REQUEST SPEEDBALL')[k] : ripiego[k];
            } });
        });
        return o;
    })();

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
        window.MotoreN5.azzeraNote('step-modifiers');
        if (!container) return;

        if (!e.valido) {
            container.innerHTML = `<div style="padding:16px; text-align:center; background:var(--mn-errore-fondo,#330000); border:1px solid var(--mn-errore-bordo,#883333); border-radius:5px;">
                <b style="color:var(--mn-errore,#ff3333);">INGRESSO IN CAMPO NON DISPONIBILE</b>
                <div style="color:var(--mn-testo-2,#cccccc); font-size:var(--fs-s); margin-top:8px;">${e.motivo}</div></div>`;
            window.aggiornaPulsanteLogistica(true, 'NON DISPONIBILE');
            return window.goToStep('step-modifiers');
        }

        const r = window.logisticaRisposta;
        // Tre esiti, dal motore (M.valutaDomande): NON RISPOSTO non esegue.
        const dom = window.statoDomandaIngresso();
        container.innerHTML = `
            ${window.MotoreN5.intestazioneOrdine({ colore: COL, titolo: `🪂 INGRESSO IN CAMPO` })}
            <div style="color:var(--mn-debole,#aaaaaa); font-size:var(--fs-s); text-align:center; margin-bottom:16px;">
                Ordine Intero. Il calcolatore non ha la mappa.</div>

            <div style="background:var(--mn-ordine-riquadro,#0d1428); border:1px solid var(--mn-ordine-tenue,#2a3a66); padding:12px; border-radius:5px;">
                <div style="text-align:center; color:var(--mn-testo,#ffffff); margin-bottom:8px;">
                    PH <b style="color:${COL.bordo}; font-size:var(--fs-l);">${e.valore}</b></div>
                ${e.voci.map(v => `<div style="display:flex; justify-content:space-between; color:var(--mn-debole,#aaaaaa); font-size:var(--fs-s);">
                    <span>${v.motivo}</span></div>`).join('')}
                ${e.critici && !e.critici.nessunTiro ? `<div style="text-align:center; color:var(--mn-attenzione,#ffcc00); font-size:var(--fs-xs); margin-top:6px;">🎯 ${e.critici.testo}</div>` : ''}
            </div>

            <div style="margin-top:14px; background:${COL.sfondo}; border:1px solid ${COL.bordo}; padding:14px; border-radius:5px;">
                <div style="color:var(--mn-testo,#ffffff); font-size:var(--fs-m); margin-bottom:10px;">${e.domanda}</div>
                <div style="color:var(--mn-debole,#aaaaaa); font-size:var(--fs-xs); line-height:1.6; margin-bottom:12px;">
                    ${e.divieti.map(d => `• ${d}`).join('<br>')}</div>
                <div style="display:flex; gap:8px;">
                    <button class="huge-btn" style="flex:1; min-height:48px; ${r === true ? 'background:var(--mn-si-fondo,#004400); border-color:var(--mn-si,#00ff00);' : 'background:var(--mn-fondo-tasto,#111111);'}"
                        onclick="window.rispondiLogistica(true)">SÌ</button>
                    <button class="huge-btn" style="flex:1; min-height:48px; ${r === false ? 'background:var(--mn-attenzione-fondo,#554400); border-color:var(--mn-acceso,#ffaa33);' : 'background:var(--mn-fondo-tasto,#111111);'}"
                        onclick="window.rispondiLogistica(false)">NO</button>
                </div>
                ${dom.esito === 'BLOCCATA' ? `<div style="margin-top:10px; padding:10px; background:var(--mn-errore-fondo,#330000); border:1px solid var(--mn-errore,#ff3333); border-radius:4px; color:var(--mn-errore-testo,#ff9999); font-size:var(--fs-s);">
                    ⛔ ${dom.motivo}</div>` : ''}
            </div>

            <div style="margin-top:14px; padding:12px; background:var(--mn-nota-fondo,#1a1000); border:1px solid var(--mn-nota-bordo,#664400); border-radius:5px;">
                <b style="color:var(--mn-nota-testo,#ffcc66); font-size:var(--fs-s);">SE IL TIRO FALLISCE</b>
                <div style="color:var(--mn-testo-2,#cccccc); font-size:var(--fs-s); margin-top:6px; line-height:1.6;">
                    • ${e.seFallisce.dove}<br>
                    • ${e.seFallisce.perdeMarker}<br>
                    • ${e.seFallisce.deployableRimossi}
                </div>
                <div style="color:var(--mn-nota-testo,#ffcc66); font-size:var(--fs-xs); margin-top:8px;">
                    La truppa entra comunque: l'Ordine non è sprecato.</div>
            </div>`;
        // 28 ottobre (Paolo): le note nella ⓘ (o sotto il tasto).
        e.note.forEach(n => window.MotoreN5.nota('step-modifiers', 'Ingresso in campo', n, { tipo: 'regole' }));

        window.aggiornaPulsanteLogistica(!dom.puoProcedere,
            dom.esito === 'BLOCCATA' ? 'PUNTO NON VALIDO' : (dom.esito === 'NON_RISPOSTO' ? 'RISPONDI ALLA DOMANDA' : 'ESEGUI TIRO PH'));
        window.goToStep('step-modifiers');
    };

    // La domanda sul punto di atterraggio, valutata dal motore.
    window.statoDomandaIngresso = function () {
        const M = motore();
        const e = window.logisticaEsito || {};
        if (!M) return { esito: 'NON_RISPOSTO', puoProcedere: false, motivo: 'Motore non caricato.' };
        return M.valutaDomande(e.domande || M.domandeIngressoInCampo(), { puntoValido: window.logisticaRisposta });
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
        window.MotoreN5.azzeraNote('step-modifiers');
        if (!container) return;

        const scelto = window.speedballScelto;
        const tiro = window.speedballTiro;
        const daTiro = (tiro != null) ? M.oggettoSpeedball(tiro) : null;

        container.innerHTML = `
            ${window.MotoreN5.intestazioneOrdine({ colore: COL, titolo: `📦 REQUEST SPEEDBALL` })}
            <div style="color:var(--mn-debole,#aaaaaa); font-size:var(--fs-s); text-align:center; margin-bottom:16px;">
                Abilità Automatica, non un Ordine.</div>

            <div style="background:var(--mn-ordine-riquadro,#0d1428); border:1px solid var(--mn-ordine-tenue,#2a3a66); padding:12px; border-radius:5px; text-align:center;">
                <div style="color:var(--mn-testo,#ffffff);">PH <b style="color:${COL.bordo}; font-size:var(--fs-l);">${e.valore}</b>
                    <span style="color:var(--mn-spento,#888888); font-size:var(--fs-xs);"> — fisso</span></div>
                <div style="color:var(--mn-debole,#aaaaaa); font-size:var(--fs-xs); margin-top:6px;">
                    Un tiro per ciascuno dei ${e.token} Token.</div>
            </div>

            <div style="margin-top:14px; background:${COL.sfondo}; border:1px solid ${COL.bordo}; padding:14px; border-radius:5px;">
                <div style="color:${COL.bordo}; font-size:var(--fs-s); margin-bottom:8px;">PRIMO TOKEN — scegli l'oggetto</div>
                ${Object.keys(e.oggetti).map(function (o) {
                    return `<button class="huge-btn" style="width:100%; min-height:44px; font-size:var(--fs-m); margin-bottom:5px; ${scelto === o ? 'background:var(--mn-ordine-riquadro,#003355); border-color:' + COL.bordo + ';' : 'background:var(--mn-fondo-tasto,#111111);'}"
                        onclick="window.scegliSpeedball('${o.replace(/'/g, "\\'")}')">${o}</button>`;
                }).join('')}
                ${scelto ? `<div style="margin-top:8px; color:var(--mn-ordine-testo,#aaccff); font-size:var(--fs-xs);">${e.oggetti[scelto]}</div>` : ''}
            </div>

            <div style="margin-top:14px; background:${COL.sfondo}; border:1px solid ${COL.bordo}; padding:14px; border-radius:5px;">
                <div style="color:${COL.bordo}; font-size:var(--fs-s); margin-bottom:8px;">SECONDO TOKEN — tira sulla Chart</div>
                <div style="color:var(--mn-debole,#aaaaaa); font-size:var(--fs-xs); line-height:1.7; margin-bottom:10px;">
                    ${e.chart.map(r => `${r.da}-${r.a}: ${r.oggetto}`).join(' &nbsp;·&nbsp; ')}</div>
                <input id="speedball-tiro" type="number" min="1" max="20" value="${tiro != null ? tiro : ''}"
                    placeholder="il risultato del D20"
                    style="width:100%; padding:12px; font-size:var(--fs-m); background:var(--mn-fondo-tasto,#111111); color:var(--mn-testo,#ffffff); border:1px solid ${COL.bordo}; border-radius:4px;"
                    onchange="window.tiraSpeedball(this.value)">
                ${daTiro ? (daTiro.oggetto
                    ? `<div style="margin-top:10px; padding:10px; background:var(--mn-ordine-riquadro,#0d2a18); border:1px solid var(--mn-ordine-bordo,#66cc66); border-radius:4px;">
                        <b style="color:var(--mn-si-testo,#88ff88);">${daTiro.oggetto}</b>
                        <div style="color:var(--mn-testo-2,#cccccc); font-size:var(--fs-xs); margin-top:4px;">${daTiro.effetto}</div></div>`
                    : `<div style="margin-top:10px; padding:10px; background:var(--mn-errore-fondo,#330000); border:1px solid var(--mn-errore,#ff3333); border-radius:4px; color:var(--mn-errore-testo,#ff9999); font-size:var(--fs-s);">⛔ ${daTiro.avviso.messaggio}</div>`) : ''}
            </div>

            ${e.avvisi.length ? `<div style="margin-top:12px; padding:10px; background:var(--mn-nota-fondo,#1a1000); border:1px solid var(--mn-nota-bordo,#664400); border-radius:4px; color:var(--mn-nota-tenue,#cc9955); font-size:var(--fs-s);">` +
                e.avvisi.map(a => `⚠️ ${a.messaggio}`).join('<br>') + `</div>` : ''}
`;
        // 28 ottobre (Paolo): le note nella ⓘ (o sotto il tasto).
        e.note.forEach(n => window.MotoreN5.nota('step-modifiers', 'Speedball', n, { tipo: 'regole' }));

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
            const dom = window.statoDomandaIngresso();
            if (dom.esito === 'NON_RISPOSTO') {
                return alert('⚠️ Conferma che il punto di atterraggio rispetta i divieti prima di tirare.');
            }
            if (!dom.puoProcedere) {
                return alert('⛔ ' + (dom.motivo || 'Punto di atterraggio non valido.'));
            }
            regole.isLongSkill = true;
            regole.seFallisce = e.seFallisce;
            // Lo dice il motore (riga 8059, per azione nel catalogo): qui era
            // un `true` scritto a mano che nessuno leggeva. Ora e` solo l'eco
            // di cio` che M.risolviPayload applica comunque.
            regole.senzaCoperturaParziale = !!(e.coperturaNegata && e.coperturaNegata.negata);
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

        // 🔴 L'INGRESSO IN CAMPO GENERA ARO: "the Reactive Player declares all
        // their AROs", riuscito o fallito il tiro (righe 8055 e 8058). Da qui
        // l'allarme non partiva e la busta non diceva all'Hub di aspettare:
        // MISURATO il 6 ottobre, zero allarmi e aroAtteso false. Senza ARO la
        // Copertura Parziale negata (riga 8059) non aveva niente a cui
        // applicarsi. Lo Speedball NON e` un Ordine: nessun allarme.
        let aro = null;
        if (azione === M.AZIONI.INGRESSO) {
            // 🔴 PRIMA DI TUTTO LA TRUPPA VA SUL TAVOLO: si piazza prima del tiro
            // (riga 8054), e l'avversario reagisce contro un Modello che deve
            // vedere. Restando in Riserva, l'ARO si risolveva contro un'unita`
            // che la vista pubblica non contiene. La regola e` del motore
            // (M.entraInCampo); l'app sostituisce e avvisa l'Hub.
            (window.coordUnits || [unita]).forEach(function (u) {
                const ent = M.entraInCampo(u);
                if (!ent.cambiata) return;
                if (typeof window.sostituisciUnita === 'function') window.sostituisciUnita(u, ent.unitaAggiornata, M.AZIONI.INGRESSO);
                else {
                    console.error('⛔ window.sostituisciUnita manca (motore_core.js vecchio?): la truppa NON è stata portata sul tavolo.');
                    alert('⛔ La truppa non è stata portata sul tavolo: motore_core.js non è aggiornato.');
                }
            });
            const al = M.allarmeOrdine(M.AZIONI.INGRESSO, {
                unita: unita, coordUnits: window.coordUnits, coordMode: window.coordMode,
                azioneSeconda: window.currentOrder && window.currentOrder.action,
                azioneMostrata: M.AZIONI.INGRESSO
            });
            if (al.payload && typeof window.inviaAllarmeAro === 'function') window.inviaAllarmeAro(al.payload);
            aro = al.aro;
        }
        const spedito = M.inviaCalcolo(window.coordPayloads, { isCoordinated: window.coordMode, aroAtteso: !!(aro && aro.genera) });
        if (!spedito) { window.coordIndex--; window.coordPayloads.pop(); return; }
    };

    console.log('🪂 ordine_logistica.js caricato.');
})();

// Dichiarazione di versione per il controllo incrociato fra chat.
(function () {
    var g = (typeof window !== 'undefined') ? window : globalThis;
    var v = { file: 'ordine_logistica.js', versione: '2026-10-28.4', proprieta: 'MOTORE' };
    if (g.MotoreN5 && g.MotoreN5.dichiaraVersione) g.MotoreN5.dichiaraVersione(v.file, v.versione, v.proprieta);
    else { g.__versioniN5 = g.__versioniN5 || []; g.__versioniN5.push(v); }
})();
