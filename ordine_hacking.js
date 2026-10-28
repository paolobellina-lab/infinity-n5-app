// @versione 2026-10-28.3 | ordine_hacking.js | proprieta`: chat MOTORE
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
//  - il pulsante VIA REPEATER NEMICO, per bersaglio (righe 4797-4802 e
//    4850-4852): Firewall -3 e solo contro Hacker. Scrive
//    bersaglio.repeaterNemico; la regola sta in M.firewallApplicato e
//    M.viaRepeaterNemico.
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

    // 28 ottobre (Paolo): il colore e` dell'ORDINE, non del modulo (M.COLORI_ORDINE nel
    // motore: Movimenti blu, Abilita` Brevi verdi, Ordini Interi rossi). COL legge le
    // tinte dell'Ordine in corso a ogni uso; 'HACKING' e` quello di casa. Prima: { bordo: '#00ffff', sfondo: '#002244' };.
    const COL = (function () {
        const ripiego = { bordo: '#00ffff', sfondo: '#002244', riquadro: '#002244', tenue: '#00ffff', testo: '#00ffff' };
        const o = {};
        ['bordo', 'sfondo', 'riquadro', 'tenue', 'testo'].forEach(function (k) {
            Object.defineProperty(o, k, { enumerable: true, get: function () {
                const M = window.MotoreN5;
                return (M && typeof M.colOrdine === 'function') ? M.colOrdine('HACKING')[k] : ripiego[k];
            } });
        });
        return o;
    })();

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
        window.MotoreN5.azzeraNote('step-weapon');

        container.innerHTML = `${window.MotoreN5.intestazioneOrdine({ colore: COL, titolo: `INFOGUERRA`, nota: `WIP ${unita.wip || '?'} · ${esito.dispositivi.length ? esito.dispositivi.join(' + ') : 'nessun dispositivo'}` })}`;

        if (esito.programmi.length === 0) {
            container.innerHTML += `<p style="color:var(--mn-errore,#ff3333); text-align:center; font-size:var(--fs-m);">
                ❌ Nessun programma d'attacco disponibile con questo dispositivo.</p>`;
        } else {
            esito.programmi.forEach(function (p) {
                const bers = p.bersaglio === 'chiunque' ? 'Qualsiasi nemico'
                           : p.bersaglio === 'soloTAG' ? 'Solo TAG'
                           : p.bersaglio === 'soloHackerNemico' ? 'Solo Hacker nemici'
                           : 'Solo Hackerabili';
                const salvezza = `PS ${p.ps}${p.dimezzaBTS ? ' · BTS dimezzato' : ' · BTS pieno'}${p.salvezze > 1 ? ` · ${p.salvezze} salvezze` : ''}`;
                const nomeEsc = (p.scelta || p.nome).replace(/'/g, "\\'");
                // 9 ottobre: il bottone approvato da Paolo (M.bottoneArma), col
                // contorno azzurro dei programmi e l'icona dello stato che il
                // programma provoca. Sotto, quello che serve per scegliere.
                container.innerHTML += M.bottoneArma(p, { attributi: `onclick="window.declareHackingAttack('${nomeEsc}')"`,
                    sotto: `${bers} · B${p.burst} · ${salvezza}` });
            });
        }

        // 💻 FAIRY DUST (Paolo, 12 ottobre: "e` un programma hacking e quindi
        // va li`"). Supportware, Long Skill, No Roll: un bottone suo, poi la
        // scelta del Tipo di Truppa. Il resto del Supportware resta elencato.
        if (M.haProgramma && M.haProgramma(unita, 'FAIRY DUST')) {
            const fd = M.fairyDustDichiarabile(unita, { secondaMeta: !!(window.currentOrder && window.currentOrder.isSecondHalf) });
            const attivo = ((unita.states || {}).fairyDust) || null;
            container.innerHTML += M.bottoneArma({ nome: 'FAIRY DUST' }, {
                attributi: fd.puo ? `onclick="window.mostraFairyDust()"` : `onclick="alert('⛔ ${String(fd.motivo || '').replace(/'/g, "\\'")}')"`,
                sotto: (attivo ? `Attivo sui ${attivo} · ` : '') + 'Supportware · Abilità Lunga · nessun tiro' + (fd.puo ? '' : ` · ⛔ ${fd.motivo}`) });
        }

        // 💻 CYBERMASK e WHITE NOISE (Paolo, 18 ottobre): "generano ARO,
        // quindi sono da considerare come Ordini". Nessun tiro. Il Cybermask
        // e` un'Abilita` Lunga (solo come Ordine intero); il White Noise
        // un'Abilita` Breve (prima o seconda meta`). Lo stato IMP-2 NON si
        // mette da qui: lo mette il giocatore dall'editor degli stati.
        const secondaMeta = !!(window.currentOrder && window.currentOrder.isSecondHalf);
        ['CYBERMASK', 'WHITE NOISE'].forEach(function (nome) {
            if (!(M.haProgramma && M.haProgramma(unita, nome))) return;
            const lunga = (nome === 'CYBERMASK');
            const blocco = (lunga && secondaMeta) ? 'è un\'Abilità Lunga: si dichiara solo come Ordine intero, non come seconda metà' : null;
            container.innerHTML += M.bottoneArma({ nome: nome }, {
                attributi: blocco ? `onclick="alert('⛔ ${nome}: ${blocco}.')"` : `onclick="window.dichiaraProgrammaSenzaTiro('${nome}')"`,
                sotto: (lunga ? 'Abilità Lunga · Ordine intero' : 'Abilità Breve') + ' · nessun tiro · genera ARO' + (blocco ? ' · ⛔ non come seconda metà' : '') });
        });

        // I programmi non d'attacco esistono: si dicono, non si nascondono.
        esito.nonAttacco = esito.nonAttacco.filter(p => ['FAIRY DUST', 'CYBERMASK', 'WHITE NOISE'].indexOf(p.nome) < 0);
        // Il Cybermask NON e` "non gestito": e` una Long Skill a se`, e la
        // sua nota di catalogo dice dove si dichiara.
        // 28 ottobre (Paolo): nella ⓘ (o in cima), non in un riquadro sotto.
        esito.nonAttacco.forEach(p => M.nota('step-weapon', p.nome + ': non gestito da questa schermata', p.note || p.tipo, { tipo: 'nonpuo' }));
        if (esito.avvisi.length > 0) {
            container.innerHTML += `<div style="margin-top:10px; padding:10px; background:var(--mn-nota-fondo,#1a1000); border:1px solid var(--mn-nota-bordo,#664400); border-radius:5px; color:var(--mn-nota-tenue,#cc9955); font-size:var(--fs-s);">` +
                esito.avvisi.map(a => `⚠️ ${a.messaggio}`).join('<br>') + `</div>`;
        }

        window.goToStep('step-weapon');
    };

    // ==============================================================
    // 1b. FAIRY DUST: il Tipo di Truppa, poi l'invio
    // ==============================================================
    window.mostraFairyDust = function () {
        const M = motore(); if (!M) return;
        const unita = window.coordUnits[window.coordIndex];
        const container = document.getElementById('weapon-buttons-container');
        window.MotoreN5.azzeraNote('step-weapon');
        if (!container) return;
        const lista = window.roster || [];
        container.innerHTML = `${window.MotoreN5.intestazioneOrdine({ colore: COL, titolo: `FAIRY DUST`, nota: `Scegli il Tipo di Truppa della tua lista che riceve Firewall (-3) su tutto il tavolo.<br>Abilità Lunga: Ordine intero, nessun tiro.` })}` +
            M.TIPI_FAIRY_DUST.map(function (tp) {
                const quanti = lista.filter(u => String(u.tipo || '').toUpperCase() === tp).length;
                return `<button class="huge-btn" style="width:100%; min-height:56px; margin-bottom:6px; background:var(--mn-fondo-tasto,#111111); border-color:${COL.bordo};"
                    onclick="window.eseguiFairyDust('${tp}')">${tp} <span style="color:var(--mn-spento,#888888); font-size:var(--fs-s);">(${quanti} in lista)</span></button>`;
            }).join('');
        window.goToStep('step-weapon');
    };

    window.eseguiFairyDust = function (tipo) {
        const M = motore(); if (!M) return;
        const unita = window.coordUnits[window.coordIndex];
        const d = M.dichiaraFairyDust(unita, tipo);
        if (d.errori.length) return alert('⛔ ' + d.errori.map(e => e.messaggio).join('\n') + '\n\nL\'ordine NON è stato eseguito.');
        window.currentOrder.action = M.AZIONI.FAIRY_DUST;
        window.coordPayloads.push({
            attaccante: unita, azione: M.AZIONI.FAIRY_DUST, arma: null, bersagli: [], burstDisponibile: 0,
            regole: { senzaTiro: true, isLongSkill: true, fairyDust: d.unitaAggiornata.states.fairyDust,
                      noteScontro: d.note.slice(0, 1), note: d.note }
        });
        const al = M.allarmeOrdine(M.AZIONI.FAIRY_DUST, { unita: unita, coordUnits: window.coordUnits, coordMode: window.coordMode });
        if (al.payload && typeof window.inviaAllarmeAro === 'function') window.inviaAllarmeAro(al.payload);
        const spedito = M.inviaCalcolo(window.coordPayloads, { isCoordinated: window.coordMode, aroAtteso: !!(al.aro && al.aro.genera) });
        if (!spedito) { window.coordPayloads.pop(); return; }
        // Lo stato sull'hacker, alla FINE (come il Cybermask): lo vede anche
        // l'avversario, che calcola i suoi attacchi di hacking.
        if (typeof window.sostituisciUnita === 'function') window.sostituisciUnita(unita, d.unitaAggiornata, 'Fairy Dust');
        else alert('⛔ Lo stato non è stato applicato: motore_core.js non è aggiornato.');
        const div = document.getElementById('calc-result');
        if (div) {
            div.innerHTML = `<div style="text-align:center; padding:20px; border:2px solid ${COL.bordo}; margin-top:20px;">
                <h2 style="color:${COL.bordo}; margin:0;">FAIRY DUST SUI ${d.unitaAggiornata.states.fairyDust}</h2>
                <p style="font-size:var(--fs-s); color:var(--mn-testo-2,#cccccc);">${d.note.join('<br>')}</p></div>`;
            div.style.display = 'block';
        }
    };

    // ==============================================================
    // 1c. CYBERMASK e WHITE NOISE: Ordini senza tiro che generano ARO
    // ==============================================================
    // White Noise (Breve) passa dal percorso degli ordini senza tiro di
    // ordine_movimento.js: prima meta` -> allarme e seconda meta`; seconda
    // meta` -> chiusura dell'Ordine. Il Cybermask (Lunga) chiude l'Ordine qui,
    // come il Fairy Dust: allarme, busta senza tiro, nessuno stato cambiato.
    window.dichiaraProgrammaSenzaTiro = function (nome) {
        const M = motore(); if (!M) return;
        const unita = window.coordUnits[window.coordIndex];
        const o = window.currentOrder = window.currentOrder || {};
        if (nome === 'WHITE NOISE') {
            o.action = 'WHITE NOISE';
            if (!o.isSecondHalf) { o.action1 = 'WHITE NOISE'; o.isLongSkill = false; }
            if (typeof window.eseguiMovimentoAutomatico !== 'function') return alert('⛔ ordine_movimento.js non caricato: il White Noise non si puo` dichiarare.');
            return window.eseguiMovimentoAutomatico();
        }
        if (o.isSecondHalf) return alert('⛔ CYBERMASK è un\'Abilità Lunga: si dichiara solo come Ordine intero.');
        o.action = o.action1 = M.AZIONI.CYBERMASK; o.isLongSkill = true;
        const H = (window.CATALOGO_N5 && window.CATALOGO_N5.HACKING) || {};
        const info = (H.programmi && H.programmi.CYBERMASK) || H.CYBERMASK || null;
        const nota = (info && info.note) || 'Abilità Lunga, nessun tiro. Lo stato IMP-2 lo metti tu dall\'editor degli stati.';
        window.coordPayloads = window.coordPayloads || [];
        window.coordPayloads.push({
            attaccante: unita, azione: M.AZIONI.CYBERMASK, arma: null, bersagli: [], burstDisponibile: 0,
            regole: { senzaTiro: true, isLongSkill: true, noteScontro: [nota], note: [nota] }
        });
        const al = M.allarmeOrdine(M.AZIONI.CYBERMASK, { unita: unita, coordUnits: window.coordUnits, coordMode: window.coordMode });
        if (al.payload && typeof window.inviaAllarmeAro === 'function') window.inviaAllarmeAro(al.payload);
        const spedito = M.inviaCalcolo(window.coordPayloads, { isCoordinated: window.coordMode, aroAtteso: !!(al.aro && al.aro.genera) });
        if (!spedito) { window.coordPayloads.pop(); return; }
        const div = document.getElementById('calc-result');
        if (div) {
            div.innerHTML = `<div style="text-align:center; padding:20px; border:2px solid ${COL.bordo}; margin-top:20px;">
                <h2 style="color:${COL.bordo}; margin:0;">CYBERMASK DICHIARATO</h2>
                <p style="font-size:var(--fs-s); color:var(--mn-testo-2,#cccccc);">${nota}</p></div>`;
            div.style.display = 'block';
        }
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
            // L'attacco passa da un Repeater nemico? Lo dice il giocatore col
            // pulsante: nasce spento. UN campo, letto dal motore.
            t.repeaterNemico = false;
        });

        window.renderTargetsAllocationHacking();
        window.goToStep('step-modifiers');
    };

    window.renderTargetsAllocationHacking = function () {
        const M = motore(); if (!M) return;
        const unita = window.coordUnits[window.coordIndex];
        const programma = M.armaDaProgrammaDi(window.currentOrder.unit, window.currentOrder.weapon);
        const container = document.getElementById('targets-allocation-container');
        window.MotoreN5.azzeraNote('step-modifiers');

        const assegnati = window.combatTargets.reduce((s, t) => s + (t.burst || 0), 0);
        const restanti = window.totalBurst - assegnati;

        let html = `<div style="text-align:center; color:var(--mn-testo,#ffffff); margin-bottom:5px; font-size:var(--fs-m);">
            PROGRAMMI DA ASSEGNARE: <b style="color:${COL.bordo}; font-size:var(--fs-l);">${restanti}</b></div>
            <div style="text-align:center; color:var(--mn-spento,#888888); font-size:var(--fs-xs); margin-bottom:15px;">
                ${programma.nome} · B${programma.burst} · ${programma.ammo} · PS ${programma.ps}
                ${programma.dimezzaBTS ? ' · BTS dimezzato' : ' · BTS pieno'}</div>`;

        window.combatTargets.forEach(function (tgt, index) {
            const dif = M.rosterNemico().find(u => u.id === tgt.id) || {};
            const fw = M.valoreFirewall ? M.valoreFirewall(dif) : 0;
            const mods = M.modHacking(unita, dif, programma, { firewallNemico: fw, repeaterNemico: !!tgt.repeaterNemico });
            const REP = (window.CATALOGO_N5 && window.CATALOGO_N5.REPEATER_NEMICO) || {};
            const rep = !!tgt.repeaterNemico;

            const dettaglio = mods.voci.length
                ? mods.voci.map(v => `<div style="display:flex; justify-content:space-between; padding:2px 0;">
                        <span style="color:var(--mn-debole,#aaaaaa);">${v.motivo}</span>
                        <b style="color:${v.valore >= 0 ? 'var(--mn-si,#00ff00)' : 'var(--mn-errore,#ff3333)'};">${v.valore > 0 ? '+' + v.valore : v.valore}</b></div>`).join('')
                : `<div style="color:var(--mn-spento,#888888); text-align:center;">Nessun modificatore</div>`;

            html += `
            <div class="target-card" style="border-left:4px solid ${COL.bordo}; margin-bottom:20px; background:rgba(0,255,255,0.05); padding:15px; border-radius:5px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <b style="color:${COL.bordo}; font-size:var(--fs-l);">${tgt.name}</b>
                    <div class="burst-ctrl" style="border-color:${COL.bordo};">
                        <button class="burst-btn" style="background:${COL.bordo};" onclick="window.adjustTargetBurstHacking(${index}, -1)">-</button>
                        <span style="margin:0 10px; font-size:var(--fs-l); font-weight:bold; color:${tgt.burst > 0 ? 'var(--mn-si,#00ff00)' : 'var(--mn-spento,#888888)'}">${tgt.burst} B</span>
                        <button class="burst-btn" style="background:${COL.bordo}; opacity:${restanti > 0 ? 1 : 0.3}" onclick="window.adjustTargetBurstHacking(${index}, 1)">+</button>
                    </div>
                </div>

                <div style="background:var(--mn-ordine-riquadro,#001a22); border:1px solid var(--mn-ordine-tenue,#005566); padding:10px; border-radius:5px; margin-bottom:10px; font-size:var(--fs-s);">
                    <div style="text-align:center; color:var(--mn-testo,#ffffff); margin-bottom:6px;">
                        WIP base <b>${mods.base}</b> → Valore di Successo <b style="color:${COL.bordo}; font-size:var(--fs-l);">${mods.valore}</b>
                    </div>
                    <div style="border-top:1px solid var(--mn-ordine-tenue,#004455); padding-top:6px;">${dettaglio}</div>
                </div>

                <button onclick="window.toggleRepeaterNemicoHacking(${index})"
                    style="width:100%; padding:12px; margin-bottom:10px; font-size:var(--fs-m); font-weight:bold; border-radius:5px; cursor:pointer;
                           background:${rep ? 'var(--mn-attenzione-fondo,#554400)' : 'var(--mn-fondo-tasto,#111111)'}; color:${rep ? 'var(--mn-acceso,#ffaa33)' : 'var(--mn-spento,#888888)'}; border:2px solid ${rep ? 'var(--mn-acceso,#ffaa33)' : 'var(--mn-bordo-spento,#555555)'};">
                    📡 ${REP.pulsante || 'VIA REPEATER NEMICO'}: ${rep ? 'SÌ (Firewall ' + (REP.firewall || -3) + ')' : 'NO'}
                </button>
                ${rep ? `<div style="color:var(--mn-debole,#aaaaaa); font-size:var(--fs-xs); margin:-4px 0 10px; text-align:center;">${REP.spiegazione || ''}</div>` : ''}
                <div style="margin-bottom:10px;">${M.rigaRequisiti(['area'], tgt, index, 'window.toggleRequisitoHacking')}</div>
                ${mods.requisitoFallito ? `<div style="padding:10px; margin-bottom:10px; background:var(--mn-errore-fondo,#330000); border:2px solid var(--mn-errore,#ff3333); border-radius:5px; color:var(--mn-errore-testo,#ff9999); font-size:var(--fs-s);">
                    <b>⚠️ REQUISITO NON SODDISFATTO → IDLE</b><br>${mods.avvisi.join('<br>')}</div>` : ''}

                <div style="text-align:center; padding:8px; background:var(--mn-ordine-riquadro,#001122); border:1px solid ${COL.bordo}; color:${COL.bordo}; font-size:var(--fs-s); border-radius:5px;">
                    Se fallisce il Tiro Salvezza: <b>${programma.effetto}</b>
                </div>
            </div>`;
        });

        // 28 ottobre (Paolo): la regola nella ⓘ (o in cima), non a schermo.
        M.nota('step-modifiers', 'Area di Hacking', 'Niente LoF, gittata, copertura né mimetismo. Solo truppe in forma di Modello sono bersagliabili: i Marker vanno Scoperti prima.', { tipo: 'mod' });

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
            // Il tasto diventa IDLE se il requisito manca (M.tastoConRequisiti).
            M.tastoConRequisiti(nuovo, M.requisitiDichiarati(window.combatTargets, ['area']), 'ESEGUI ATTACCO CYBER', function () { window.eseguiCalcoloHacking(); });
        }
    };

    // Il pulsante del Repeater nemico, come quello della Copertura
    // nell'Attacco BS: cambia UN campo del bersaglio e ridisegna.
    window.toggleRepeaterNemicoHacking = function (i) {
        const tgt = window.combatTargets && window.combatTargets[i];
        if (!tgt) return;
        tgt.repeaterNemico = !tgt.repeaterNemico;
        window.renderTargetsAllocationHacking();
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
    // Gli interruttori dei requisiti (Linea di Tiro, gittata, contatto...):
    // la regola e i testi stanno nel motore, M.REQUISITI_TAVOLO.
    window.toggleRequisitoHacking = function (i, chiave) {
        const M = motore(); if (!M) return;
        if (M.invertiRequisito(window.combatTargets[i], chiave)) window.renderTargetsAllocationHacking();
    };

    window.eseguiCalcoloHacking = function () {
        const M = motore(); if (!M) return;
        // Chi e` fuori dall'Area di Hacking: i suoi dadi si perdono (righe
        // 3111-3114, valgono per ogni Burst diviso); se non resta nessuno, Idle.
        const req = M.requisitiDichiarati(window.combatTargets, ['area']);
        if (req.idle) return M.idleDaRequisito(req);
        const unita = window.coordUnits[window.coordIndex];
        const programma = M.armaDaProgrammaDi(window.currentOrder.unit, window.currentOrder.weapon);

        const perBersaglio = window.combatTargets.map(function (t) {
            const dif = M.rosterNemico().find(u => u.id === t.id) || {};
            const fw = M.valoreFirewall ? M.valoreFirewall(dif) : 0;
            const m = M.modHacking(unita, dif, programma, { firewallNemico: fw, repeaterNemico: !!t.repeaterNemico });
            // `firewall`: quello che SI APPLICA (proprio o del Repeater), non
            // piu` solo il proprio.
            return { bersaglio: t.name, valoreSuccesso: m.valore, base: m.base, mod: m.mod, voci: m.voci,
                     firewall: m.firewall, firewallFonte: m.firewallFonte,
                     repeaterNemico: !!t.repeaterNemico, requisitoFallito: !!m.requisitoFallito };
        });

        window.coordPayloads.push({
            attaccante: unita,
            azione: M.AZIONI.HACKING,
            arma: programma,
            programma: programma.nome,
            bersagli: M.bersagliConRequisiti(window.combatTargets, req),
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
                    <p style="font-size:var(--fs-xs); color:var(--mn-debole,#aaaaaa);">Risoluzione Infoguerra in corso all'Hub...</p>
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
    var v = { file: 'ordine_hacking.js', versione: '2026-10-28.3', proprieta: 'MOTORE' };
    if (g.MotoreN5 && g.MotoreN5.dichiaraVersione) g.MotoreN5.dichiaraVersione(v.file, v.versione, v.proprieta);
    else { g.__versioniN5 = g.__versioniN5 || []; g.__versioniN5.push(v); }
})();
