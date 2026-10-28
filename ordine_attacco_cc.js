// @versione 2026-10-28.3 | ordine_attacco_cc.js | proprieta`: chat MOTORE
// ==========================================
// ⚔️ CORPO A CORPO (N5) - ordine_attacco_cc.js
// ------------------------------------------
// RISCRITTO sopra MotoreN5. Solo interfaccia: le regole stanno nel motore.
//
// Cosa cambia rispetto alla versione precedente:
//
//  1. LE ARTI MARZIALI SI CALCOLANO. La schermata precedente scriveva
//     "Calcola i bonus di Arti Marziali a mente" e non applicava nulla.
//     Ora la tabella ufficiale N5 è nel catalogo e il MOD è calcolato,
//     voce per voce, incluso il -3 che le Martial Arts NEMICHE ti impongono.
//
//  2. IL (+1B) ERA LETTO ALLA CIECA. Faceva skills.includes("+1B"), quindi
//     un "BS Attack (+1B)" nel profilo dava un dado in più anche in mischia.
//     Ora conta solo "CC Attack (+1B)", e solo in Turno Attivo.
//
//  3. COLPO DI GRAZIA. Contro un Incosciente non si tira: passa a Morto
//     senza Tiro Salvezza — salvo Dogged o No Wound Incapacitation, dove
//     il CC Attack si risolve normalmente. Prima non era gestito.
//
//  4. CLOSE COMBAT WITH MULTIPLE TROOPERS (il "Gang-Up" di N3): +1B per
//     ogni alleato ingaggiato nella stessa mischia. Non è deducibile dai
//     dati, quindi c'è un selettore.
//
//  5. Il Burst dei gregari nel Coordinato e il massimo di 6 sono nel motore.
// ==========================================

(function () {
    'use strict';

    // 🔴 L'arma da CC del difensore che impone un MOD all'avversario nel
    // Faccia a Faccia — la PARA CC Weapon (-3). L'anteprima non la
    // conosceva e mostrava un valore che il risultato poi abbassava.
    // (Chat REGOLE, 21 settembre.)
    function armaCCAvversario(M, difensore) {
        const W = window.RULES_WEAPONS || {};
        return (M.armiCC(difensore) || []).find(function (a) {
            return (W[a.nome] || a).modProfiloSu === 'F2F_AVVERSARIO';
        }) || null;
    }


    function motore() {
        if (!window.MotoreN5) {
            alert('⛔ motore_regole_n5.js non è caricato: il Corpo a Corpo non può funzionare.');
            return null;
        }
        return window.MotoreN5;
    }

    // 28 ottobre (Paolo): il colore e` dell'ORDINE, non del modulo (M.COLORI_ORDINE nel
    // motore: Movimenti blu, Abilita` Brevi verdi, Ordini Interi rossi). COL legge le
    // tinte dell'Ordine in corso a ogni uso; 'ATTACCO CC' e` quello di casa. Prima: { bordo: '#ffcc00', sfondo: '#331a00' };.
    const COL = (function () {
        const ripiego = { bordo: '#ffcc00', sfondo: '#331a00', riquadro: '#331a00', tenue: '#ffcc00', testo: '#ffcc00' };
        const o = {};
        ['bordo', 'sfondo', 'riquadro', 'tenue', 'testo'].forEach(function (k) {
            Object.defineProperty(o, k, { enumerable: true, get: function () {
                const M = window.MotoreN5;
                return (M && typeof M.colOrdine === 'function') ? M.colOrdine('ATTACCO CC')[k] : ripiego[k];
            } });
        });
        return o;
    })();

    window.avviaFaseCC = function (actionId, isSecondHalf) {
        window.currentOrder = window.currentOrder || {};
        window.currentOrder.isSecondHalf = isSecondHalf;
        if (!isSecondHalf) window.currentOrder.action1 = actionId;
        window.currentOrder.action = actionId;

        // Berserk è un Ordine Intero; CC Attack e Protheion sono Abilità Brevi.
        if (actionId === 'BERSERK') window.currentOrder.isLongSkill = true;

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
            window.ccAlleatiIngaggiati = 0;
            window.startUnitCCLoop();
        } else {
            window.preparaModificatoriCC();
        }
    };

    // ==============================================================
    // 1. SELEZIONE ARMA
    // ==============================================================
    window.startUnitCCLoop = function () {
        const M = motore(); if (!M) return;
        const unita = window.coordUnits[window.coordIndex];
        if (window.mostraTitoloUnitaCorrente) window.mostraTitoloUnitaCorrente();

        const ma = M.livelloMartialArts(unita);
        const container = document.getElementById('weapon-buttons-container');
        window.MotoreN5.azzeraNote('step-weapon');
        container.innerHTML = `${window.MotoreN5.intestazioneOrdine({ colore: COL, titolo: `${window.currentOrder.action === 'BERSERK' ? 'BERSERK' : 'ATTACCO IN MISCHIA'}`, nota: `CC ${unita.cc || '?'}${ma ? ` · Martial Arts L${ma}` : ''}` })}`;

        let armi = M.armiCC(unita);

        // Protheion è dichiarata come azione, non come arma del profilo.
        if (window.currentOrder.action === 'PROTHEION' && !armi.some(a => /PROTHEION/i.test(a.nome))) {
            armi = armi.concat([{ nome: 'Protheion', burst: 1, ammo: 'N', ammoOpzioni: ['N'], isCC: true, bands: [], notazioni: [] }]);
        }
        if (armi.length === 0) {
            const base = M.profiloArma('CC Weapon');
            if (!base.nonTrovata) armi = [base];
        }

        if (armi.length === 0) {
            container.innerHTML += `<p style="color:var(--mn-errore,#ff3333); text-align:center; font-size:var(--fs-m);">❌ Nessuna arma da Corpo a Corpo.</p>`;
        } else {
            armi.forEach(function (p) {
                // 🔴 Si passa il nome GREZZO, non quello spogliato.
                // Le notazioni del profilo — (PS=6), (+1B), (SR-1) —
                // vivono nel nome, e il modulo salva una stringa e poi la
                // ririsolve: spogliandola, il Morlock faceva tirare ARM
                // VS 9 invece di VS 7. Nei due database sono 227 notazioni
                // d'arma che passano da qui.
                const nomeEsc = (p.nomeRichiesto || p.nome).replace(/'/g, "\\'");
                // 9 ottobre: il bottone e` quello approvato da Paolo (M.bottoneArma).
                container.innerHTML += M.bottoneArma(p, { attributi: `onclick="window.declareCCAttack('${nomeEsc}')"` });
            });
        }

        window.goToStep('step-weapon');
    };

    window.declareCCAttack = function (nomeArma) {
        window.currentOrder.weapon = nomeArma;
        window.setupTargetSelectionCC();
    };

    // ==============================================================
    // 2. BERSAGLIO
    // ==============================================================
    window.setupTargetSelectionCC = function () {
        const M = motore(); if (!M) return;
        const unita = window.coordUnits[window.coordIndex];
        if (window.mostraTitoloUnitaCorrente) window.mostraTitoloUnitaCorrente();

        window.pendingTargets = [];
        const nemici = M.rosterNemico();
        if (nemici.length === 0) return alert('⚠️ Nessuna unità nemica sul tavolo.');

        const azione = window.currentOrder.action === 'BERSERK' ? M.AZIONI.BERSERK
                     : window.currentOrder.action === 'PROTHEION' ? M.AZIONI.PROTHEION
                     : M.AZIONI.CC_ATTACK;

        const giudizi = M.bersagliValidi(azione, nemici, { attaccante: unita });
        window.validTargets = M.soloAmmessi(giudizi);
        window.targetsScartati = giudizi.filter(g => !g.ammesso).map(g => ({ nome: g.nome, motivo: g.motivo }));

        if (window.validTargets.length === 0) {
            alert('❌ Nessun bersaglio valido in mischia.\n\n' + window.targetsScartati.map(t => `• ${t.nome}: ${t.motivo}`).join('\n'));
            return window.goToStep('step-weapon');
        }

        if (window.renderTargetButtons) window.renderTargetButtons();
        window.goToStep('step-wait-aro');
    };

    // ==============================================================
    // 3. MODIFICATORI
    // ==============================================================
    window.preparaModificatoriCC = function () {
        const M = motore(); if (!M) return;
        const unita = window.coordUnits[window.coordIndex];
        if (window.mostraTitoloUnitaCorrente) window.mostraTitoloUnitaCorrente();

        if (!window.combatTargets || window.combatTargets.length === 0) {
            alert('⛔ Nessun bersaglio confermato.\n\nIl Corpo a Corpo richiede un nemico in contatto di Silhouette.');
            return window.setupTargetSelectionCC();
        }

        const arma = M.profiloArma(window.currentOrder.weapon);
        const burst = M.burstCC(unita, arma, {
            coordMode: window.coordMode,
            indiceCoord: window.coordIndex,
            alleatiIngaggiati: window.ccAlleatiIngaggiati || 0
        });
        window.totalBurst = burst.valore;
        window.burstDettaglio = burst;

        const assegnati = window.combatTargets.reduce((s, t) => s + (t.burst || 0), 0);
        if (assegnati === 0) window.combatTargets[0].burst = window.totalBurst;

        window.combatTargets.forEach(function (t) {
            // In CC non esistono gittata né copertura.
            t.cover = false; t.rangeIndex = 0; t.rangeMod = 0; t.terrain = 'NESSUNO';
            if (!t.ammo || arma.ammoOpzioni.indexOf(t.ammo) < 0) t.ammo = arma.ammoOpzioni[0];
        });

        window.renderTargetsAllocationCC();
        window.goToStep('step-modifiers');
    };

    window.renderTargetsAllocationCC = function () {
        const M = motore(); if (!M) return;
        const unita = window.coordUnits[window.coordIndex];
        const arma = M.profiloArma(window.currentOrder.weapon);
        const container = document.getElementById('targets-allocation-container');
        window.MotoreN5.azzeraNote('step-modifiers');

        const assegnati = window.combatTargets.reduce((s, t) => s + (t.burst || 0), 0);
        const restanti = window.totalBurst - assegnati;
        const alleati = window.ccAlleatiIngaggiati || 0;

        let html = `<div style="text-align:center; color:var(--mn-testo,#ffffff); margin-bottom:5px; font-size:var(--fs-m);">
            DADI CC DA ASSEGNARE: <b style="color:${COL.bordo}; font-size:var(--fs-l);">${restanti}</b></div>`;

        // 28 ottobre (Paolo): da dove viene il Burst, e il Dado Speciale, nella ⓘ.
        if (window.burstDettaglio) {
            if (window.burstDettaglio.voci.length) M.nota('step-modifiers', 'Burst', window.burstDettaglio.voci.map(v => v.motivo).join(' · '), { tipo: 'regole' });
            if (window.burstDettaglio.sd > 0) {
                M.nota('step-modifiers', 'Dado Speciale', `+${window.burstDettaglio.sd} SD: tira un dado in più e poi scartane uno. Non conta nel Burst.`, { tipo: 'regole' });
            }
        }

        // Alleati nella mischia: dato non deducibile, lo dichiara il giocatore.
        html += `<div style="background:var(--mn-nota-fondo,#1a1000); border:1px solid var(--mn-attenzione-fondo,#554400); padding:12px; border-radius:5px; margin-bottom:15px;">
            <div style="text-align:center; color:var(--mn-nota-tenue,#cc9955); font-size:var(--fs-s); margin-bottom:8px;">
                <b>Close Combat with Multiple Troopers</b><br>
                <span style="font-size:var(--fs-xs); color:var(--mn-nota-tenue,#cc9955);">Quanti TUOI alleati sono ingaggiati in questa mischia? (+1B ciascuno)</span>
            </div>
            <div style="display:flex; justify-content:center; align-items:center; gap:15px;">
                <button class="burst-btn" style="background:var(--mn-attenzione-fondo,#554400);" onclick="window.setCCAlleati(${alleati - 1})">-</button>
                <span style="font-size:var(--fs-l); font-weight:bold; color:${alleati > 0 ? 'var(--mn-si,#00ff00)' : 'var(--mn-spento,#888888)'};">${alleati}</span>
                <button class="burst-btn" style="background:var(--mn-attenzione-fondo,#554400);" onclick="window.setCCAlleati(${alleati + 1})">+</button>
            </div>
        </div>`;

        window.combatTargets.forEach(function (tgt, index) {
            const difensore = M.rosterNemico().find(u => u.id === tgt.id) || {};
            const azione = window.currentOrder.action === 'BERSERK' ? M.AZIONI.BERSERK : M.AZIONI.CC_ATTACK;
            const mods = M.modCC(unita, difensore, arma, { inF2F: true, armaAvversario: armaCCAvversario(M, difensore) });
            const grazia = M.colpoDiGrazia(difensore);

            const dettaglio = mods.voci.length
                ? mods.voci.map(v => `<div style="display:flex; justify-content:space-between; padding:2px 0;">
                        <span style="color:var(--mn-debole,#aaaaaa);">${v.motivo}</span>
                        <b style="color:${v.valore >= 0 ? 'var(--mn-si,#00ff00)' : 'var(--mn-errore,#ff3333)'};">${v.valore > 0 ? '+' + v.valore : v.valore}</b></div>`).join('')
                : `<div style="color:var(--mn-spento,#888888); text-align:center;">Nessun modificatore</div>`;

            const ammoHtml = arma.ammoOpzioni
                .map(o => `<option value="${o}" ${o === tgt.ammo ? 'selected' : ''}>Munizioni: ${o}</option>`).join('');

            // Colpo di Grazia: sostituisce il tiro, o è bloccato da Dogged/NWI.
            let graziaHtml = '';
            if (grazia.applicabile) {
                graziaHtml = `<div style="margin:12px 0; padding:12px; background:var(--mn-errore-fondo,#330000); border:1px solid var(--mn-errore,#ff3333); border-radius:5px; text-align:center;">
                    <b style="color:var(--mn-errore,#ff3333); font-size:var(--fs-m);">☠️ COLPO DI GRAZIA</b><br>
                    <span style="color:var(--mn-errore-testo,#ff9999); font-size:var(--fs-s);">${grazia.motivo}<br>Nessun tiro d'attacco, nessun Tiro Salvezza.</span></div>`;
            } else if (grazia.bloccatoDaSkill) {
                graziaHtml = `<div style="margin:12px 0; padding:12px; background:var(--mn-nota-fondo,#1a1000); border:1px solid var(--mn-nota-bordo,#664400); border-radius:5px; text-align:center;">
                    <b style="color:var(--mn-acceso,#ffaa33); font-size:var(--fs-m);">⚠️ COLPO DI GRAZIA NON APPLICABILE</b><br>
                    <span style="color:var(--mn-nota-tenue,#cc9955); font-size:var(--fs-s);">${grazia.motivo}</span></div>`;
            }

            html += `
            <div class="target-card" style="border-left:4px solid ${COL.bordo}; margin-bottom:20px; background:rgba(255,204,0,0.05); padding:15px; border-radius:5px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <b style="color:${COL.bordo}; font-size:var(--fs-l);">${tgt.name}</b>
                    <div class="burst-ctrl" style="border-color:${COL.bordo};">
                        <button class="burst-btn" style="background:${COL.bordo};" onclick="window.adjustTargetBurstCC(${index}, -1)">-</button>
                        <span style="margin:0 10px; font-size:var(--fs-l); font-weight:bold; color:${tgt.burst > 0 ? 'var(--mn-si,#00ff00)' : 'var(--mn-spento,#888888)'}">${tgt.burst} B</span>
                        <button class="burst-btn" style="background:${COL.bordo}; opacity:${restanti > 0 ? 1 : 0.3}" onclick="window.adjustTargetBurstCC(${index}, 1)">+</button>
                    </div>
                </div>

                ${graziaHtml}

                <div style="background:var(--mn-nota-fondo,#1a1000); border:1px solid var(--mn-nota-bordo,#664400); padding:10px; border-radius:5px; margin-bottom:12px; font-size:var(--fs-s);">
                    <div style="text-align:center; color:var(--mn-testo,#ffffff); margin-bottom:6px;">
                        CC base <b>${mods.base}</b> → Valore di Successo <b style="color:${COL.bordo}; font-size:var(--fs-l);">${mods.valore}</b>
                    </div>
                    <div style="border-top:1px solid var(--mn-nota-bordo,#664400); padding-top:6px;">${dettaglio}</div>
                </div>

                <select class="huge-btn" style="width:100%; margin:0; min-height:55px; font-size:var(--fs-m); background:var(--mn-scuro,#000000); color:var(--mn-testo,#ffffff); border-color:${COL.bordo}; text-align:center; padding:0 10px;" onchange="window.setTargetAmmoCC(${index}, this.value)">
                    ${ammoHtml}
                </select>
                ${M.rigaRequisiti(['contatto'], tgt, index, 'window.toggleRequisitoCC')}

            </div>`;
            mods.note.forEach(n => M.nota('step-modifiers', (window.combatTargets.length > 1 ? tgt.name + ': ' : '') + 'Corpo a Corpo', n, { tipo: 'mod' }));
        });

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
            M.tastoConRequisiti(nuovo, M.requisitiDichiarati(window.combatTargets, ['contatto']), 'ESEGUI ATTACCO IN CORPO A CORPO', function () { window.eseguiCalcoloCC(); });
        }
    };

    window.setCCAlleati = function (n) {
        window.ccAlleatiIngaggiati = Math.max(0, Math.min(5, n));
        window.preparaModificatoriCC();
    };
    window.setTargetAmmoCC = function (i, v) { window.combatTargets[i].ammo = v; window.renderTargetsAllocationCC(); };
    window.adjustTargetBurstCC = function (i, delta) {
        const assegnati = window.combatTargets.reduce((s, t) => s + (t.burst || 0), 0);
        const tgt = window.combatTargets[i];
        if (delta > 0 && assegnati < window.totalBurst) tgt.burst += delta;
        else if (delta < 0 && tgt.burst > 0) tgt.burst += delta;
        window.renderTargetsAllocationCC();
    };

    // ==============================================================
    // 4. INVIO
    // ==============================================================
    // Gli interruttori dei requisiti (Linea di Tiro, gittata, contatto...):
    // la regola e i testi stanno nel motore, M.REQUISITI_TAVOLO.
    window.toggleRequisitoCC = function (i, chiave) {
        const M = motore(); if (!M) return;
        if (M.invertiRequisito(window.combatTargets[i], chiave)) window.renderTargetsAllocationCC();
    };

    window.eseguiCalcoloCC = function () {
        const M = motore(); if (!M) return;
        // Chi non e` a contatto: i suoi dadi si perdono (righe 3111-3114); se
        // non resta nessuno, Idle.
        const req = M.requisitiDichiarati(window.combatTargets, ['contatto']);
        if (req.idle) return M.idleDaRequisito(req);
        const unita = window.coordUnits[window.coordIndex];
        const arma = M.profiloArma(window.currentOrder.weapon);

        const azione = window.currentOrder.action === 'BERSERK' ? M.AZIONI.BERSERK
                     : window.currentOrder.action === 'PROTHEION' ? M.AZIONI.PROTHEION
                     : M.AZIONI.CC_ATTACK;

        // Il MOD lo calcola il motore, non "a mente".
        const perBersaglio = window.combatTargets.map(function (t) {
            const dif = M.rosterNemico().find(u => u.id === t.id) || {};
            const m = M.modCC(unita, dif, arma, { inF2F: true, armaAvversario: armaCCAvversario(M, dif) });
            const g = M.colpoDiGrazia(dif);
            return {
                bersaglio: t.name,
                valoreSuccesso: m.valore, base: m.base, mod: m.mod, voci: m.voci,
                colpoDiGrazia: g.applicabile
            };
        });

        window.coordPayloads.push({
            attaccante: unita,
            azione: azione,
            arma: arma,
            bersagli: M.bersagliConRequisiti(window.combatTargets, req),
            burstDisponibile: window.totalBurst,
            regole: {
                attributo: 'CC',
                martialArts: M.livelloMartialArts(unita),
                naturalBornWarrior: M.haNBW(unita),
                dadiSD: window.burstDettaglio ? window.burstDettaglio.sd : 0,
                alleatiIngaggiati: window.ccAlleatiIngaggiati || 0,
                ignoraGittata: true,
                ignoraCopertura: true,
                perBersaglio: perBersaglio
            }
        });

        window.coordIndex++;

        if (window.coordIndex < window.coordUnits.length) {
            window.combatTargets = [];
            window.pendingTargets = [];
            window.ccAlleatiIngaggiati = 0;
            return window.startUnitCCLoop();
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
                <div style="text-align:center; padding:20px; border:2px solid ${COL.bordo}; background:rgba(255,204,0,0.1); margin-top:20px;">
                    <h2 style="color:${COL.bordo}; margin:0;">INGAGGIO INVIATO</h2>
                    <p style="font-size:var(--fs-xs); color:var(--mn-debole,#aaaaaa);">Risoluzione mischia in corso all'Hub...</p>
                </div>`;
            calcDiv.style.display = 'block';
        }
    };

    console.log('⚔️ ordine_attacco_cc.js riscritto su MotoreN5.');
})();


// Dichiarazione di versione per il controllo incrociato fra chat.
// Funziona anche se questo file si carica PRIMA del motore: in quel
// caso la versione resta in coda e il motore la raccoglie all'avvio.
(function () {
    var g = (typeof window !== 'undefined') ? window : globalThis;
    var v = { file: 'ordine_attacco_cc.js', versione: '2026-10-28.3', proprieta: 'MOTORE' };
    if (g.MotoreN5 && g.MotoreN5.dichiaraVersione) g.MotoreN5.dichiaraVersione(v.file, v.versione, v.proprieta);
    else { g.__versioniN5 = g.__versioniN5 || []; g.__versioniN5.push(v); }
})();
