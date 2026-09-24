// @versione 2026-09-23.2 | ordine_attacco_bs.js | proprieta`: chat MOTORE
// ==========================================
// 🎯 ATTACCO BS (TIRO A DISTANZA) - ordine_attacco_bs.js
// ------------------------------------------
// RISCRITTO sopra MotoreN5. Questo file ora si occupa SOLO di interfaccia:
// disegna schermate e raccoglie scelte. Ogni regola sta nel motore.
//
// Cosa è sparito da qui:
//  - getWeaponProfile()  -> MotoreN5.profiloArma()   (era una dipendenza
//    nascosta di cc/hacking/speculativo/guidato: stava in QUESTO file)
//  - il recupero del roster nemico -> MotoreN5.rosterNemico()
//  - il filtro bersagli -> MotoreN5.bersagliValidi()
//  - il calcolo del Burst -> MotoreN5.burstIniziale()
//  - l'espansione a mano delle armi MULTI -> MotoreN5.variantiArma()
//  - l'invio all'Hub -> MotoreN5.inviaCalcolo()  (che BLOCCA se i dati non tornano)
//
// Bug corretti passando dal motore:
//  - non si inventa più un bersaglio "Bersaglio Primario" quando la selezione
//    è vuota (era la causa della segnalazione #5);
//  - un Incosciente ora è bersagliabile (nessuna regola lo protegge: solo
//    questo modulo lo escludeva);
//  - i Marker CAMO/IMP sono esclusi col motivo, e ammessi se l'attaccante
//    ha un Multispectral Visor L3;
//  - il (+1B) viene applicato solo se è "BS Attack (+1B)": prima un
//    "CC Attack (+1B)" nel profilo dava un dado in più anche sparando.
// ==========================================

(function () {
    'use strict';

    function motore() {
        if (!window.MotoreN5) {
            alert('⛔ motore_regole_n5.js non è caricato: l\'Attacco BS non può funzionare.');
            return null;
        }
        return window.MotoreN5;
    }

    const COL = { bordo: '#00ccff', sfondo: '#002244' };

    // ==============================================================
    // INGRESSO
    // ==============================================================
    window.avviaFaseAttaccoBS = function (actionId, isSecondHalf) {
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
            window.startUnitAllocationLoopBS();
        } else {
            window.goToModifiersBS(actionId);
        }
    };

    // ==============================================================
    // 1. SELEZIONE ARMA
    // ==============================================================
    window.startUnitAllocationLoopBS = function () {
        const M = motore(); if (!M) return;
        const unita = window.coordUnits[window.coordIndex];
        if (window.mostraTitoloUnitaCorrente) window.mostraTitoloUnitaCorrente();

        const container = document.getElementById('weapon-buttons-container');
        container.innerHTML = `<div style="background:${COL.sfondo}; border:1px solid ${COL.bordo}; padding:10px; margin-bottom:15px; text-align:center; color:#fff; border-radius:5px;">
            <b style="color:${COL.bordo}; font-size:20px;">🎯 ATTACCO BS</b><br>
            <span style="font-size:14px; color:#ccc;">Seleziona l'arma a distanza da utilizzare</span>
        </div>`;

        // Ogni voce del profilo può espandersi in più modalità (MULTI, Plasma,
        // Missile...). Le varianti le trova il motore leggendo il database,
        // invece dei cinque casi scritti a mano che c'erano qui.
        const grezze = M.dividiLista(unita.weapon);
        const profili = [];
        const scartate = [];

        grezze.forEach(function (nome) {
            let varianti = M.variantiArma(nome);
            if (varianti.length === 0) {
                const p = M.profiloArma(nome);
                if (p.nonTrovata) { scartate.push({ nome: nome, motivo: 'non presente nel database armi' }); return; }
                varianti = [p];
            }
            varianti.forEach(function (p) {
                if (p.isCC) { scartate.push({ nome: p.nome, motivo: 'arma da Corpo a Corpo' }); return; }
                if (profili.some(x => x.nome === p.nome)) return;
                profili.push(p);
            });
        });

        if (profili.length === 0) {
            container.innerHTML += `<p style="color:#ff3333; text-align:center; font-size:18px;">❌ Nessuna arma a distanza utilizzabile.</p>`;
        } else {
            profili.forEach(function (p) {
                const gittata = p.isTemplate
                    ? `Sagoma ${p.template || ''}`
                    : p.bands.map(b => `${b.mod > 0 ? '+' : ''}${b.mod}`).join(' / ');
                // 🔴 Si passa il nome GREZZO, non quello spogliato.
                // Le notazioni del profilo — (PS=6), (+1B), (SR-1) —
                // vivono nel nome, e il modulo salva una stringa e poi la
                // ririsolve: spogliandola, il Morlock faceva tirare ARM
                // VS 9 invece di VS 7. Nei due database sono 227 notazioni
                // d'arma che passano da qui.
                const nomeEsc = (p.nomeRichiesto || p.nome).replace(/'/g, "\\'");
                container.innerHTML += `<button class="huge-btn" style="border-color:${COL.bordo};" onclick="window.declareAttackBS('${nomeEsc}')">
                    ${p.nome}<br><span style="color:${COL.bordo}; font-size:14px;">B${p.burst} | ${p.ammoOpzioni.join('/')} | ${gittata}</span>
                </button>`;
            });
        }

        // Le armi scartate si mostrano col motivo, invece di sparire in silenzio.
        if (scartate.length > 0) {
            container.innerHTML += `<div style="margin-top:15px; padding:10px; background:#111; border:1px solid #444; border-radius:5px; color:#888; font-size:13px;">
                Non utilizzabili qui: ` + scartate.map(x => `<b>${x.nome}</b> (${x.motivo})`).join(', ') + `</div>`;
        }

        window.goToStep('step-weapon');
    };

    window.declareAttackBS = function (nomeArma) {
        window.currentOrder.weapon = nomeArma;
        window.setupTargetSelectionBS();
    };

    // ==============================================================
    // 2. SELEZIONE BERSAGLIO
    // ==============================================================
    window.setupTargetSelectionBS = function () {
        const M = motore(); if (!M) return;
        const unita = window.coordUnits[window.coordIndex];
        if (window.mostraTitoloUnitaCorrente) window.mostraTitoloUnitaCorrente();

        window.pendingTargets = [];

        const nemici = M.rosterNemico();
        if (nemici.length === 0) {
            return alert('⚠️ Nessuna unità nemica sul tavolo.\n\nL\'avversario non ha ancora inviato lo schieramento all\'Hub.');
        }

        const giudizi = M.bersagliValidi(M.AZIONI.BS_ATTACK, nemici, { attaccante: unita });

        window.validTargets = M.soloAmmessi(giudizi);
        // Esposto per l'interfaccia: i bersagli esclusi, col motivo.
        window.targetsScartati = giudizi.filter(g => !g.ammesso)
            .map(g => ({ nome: g.nome, motivo: g.motivo }));

        if (window.validTargets.length === 0) {
            const motivi = window.targetsScartati.map(t => `• ${t.nome}: ${t.motivo}`).join('\n');
            alert('❌ Nessun bersaglio valido per un Attacco BS.\n\n' + motivi);
            return window.goToStep('step-weapon');
        }

        if (window.renderTargetButtons) window.renderTargetButtons();

        // Se l'interfaccia non mostra ancora gli esclusi, li aggiungiamo qui sotto.
        const cont = document.getElementById('enemy-target-buttons');
        const vecchio = document.getElementById('bs-scartati');
        if (vecchio) vecchio.remove();
        if (cont && window.targetsScartati.length > 0) {
            const div = document.createElement('div');
            div.id = 'bs-scartati';
            div.style.cssText = 'margin-top:15px; padding:10px; background:#111; border:1px solid #444; border-radius:5px; color:#888; font-size:13px;';
            div.innerHTML = '<b style="color:#aaa;">Non bersagliabili ora:</b><br>' +
                window.targetsScartati.map(t => `• <b>${t.nome}</b> — ${t.motivo}`).join('<br>');
            cont.appendChild(div);
        }

        window.goToStep('step-wait-aro');
    };

    // ==============================================================
    // 3. MODIFICATORI
    // ==============================================================
    window.goToModifiersBS = function (finalAction) {
        const M = motore(); if (!M) return;
        if (finalAction) window.currentOrder.action = finalAction;

        const calcRes = document.getElementById('calc-result');
        if (calcRes) calcRes.style.display = 'none';

        const unita = window.coordUnits[window.coordIndex];
        if (window.mostraTitoloUnitaCorrente) window.mostraTitoloUnitaCorrente();

        const arma = M.profiloArma(window.currentOrder.weapon);

        // 🚨 NIENTE BERSAGLIO FANTASMA.
        // Qui il vecchio codice inventava { id:'generic1', name:'Bersaglio Primario' }
        // e lo spediva all'Hub, che non trovandolo nel gameState usava statistiche
        // inventate e produceva due Tiri Normali invece del Faccia a Faccia.
        if (!window.combatTargets || window.combatTargets.length === 0) {
            alert('⛔ Nessun bersaglio confermato.\n\nTorna indietro e selezionane almeno uno: senza un bersaglio reale l\'Hub non può calcolare il confronto.');
            return window.setupTargetSelectionBS();
        }

        const burst = M.burstIniziale(unita, arma, {
            azione: M.AZIONI.BS_ATTACK,
            coordMode: window.coordMode,
            indiceCoord: window.coordIndex
        });
        window.totalBurst = burst.valore;
        window.burstDettaglio = burst;

        // I dadi non ancora assegnati vanno tutti sul primo bersaglio.
        const assegnati = window.combatTargets.reduce((s, t) => s + (t.burst || 0), 0);
        if (assegnati === 0) window.combatTargets[0].burst = window.totalBurst;

        // Gittata: banda iniziale esplicita, mai uno zero implicito.
        window.combatTargets.forEach(function (t) {
            if (arma.isTemplate) { t.rangeIndex = 0; t.rangeMod = 0; }
            else {
                if (typeof t.rangeIndex !== 'number' || t.rangeIndex < 0 || t.rangeIndex >= arma.bands.length) {
                    t.rangeIndex = 0;
                }
                t.rangeMod = arma.bands.length ? arma.bands[t.rangeIndex].mod : 0;
            }
            if (!t.ammo || arma.ammoOpzioni.indexOf(t.ammo) < 0) t.ammo = arma.ammoOpzioni[0];
            if (typeof t.cover !== 'boolean') t.cover = false;
            if (!t.terrain) t.terrain = 'NESSUNO';
        });

        window.renderTargetsAllocationBS();
        window.goToStep('step-modifiers');
    };

    window.renderTargetsAllocationBS = function () {
        const M = motore(); if (!M) return;
        const container = document.getElementById('targets-allocation-container');
        const arma = M.profiloArma(window.currentOrder.weapon);
        const bordo = document.title.includes('NOMADS') ? 'var(--nomad-red)' : 'var(--nomad-orange)';
        const sfondo = document.title.includes('NOMADS') ? '#1a0000' : '#001122';

        const assegnati = window.combatTargets.reduce((s, t) => s + (t.burst || 0), 0);
        const restanti = window.totalBurst - assegnati;

        let html = `<div style="text-align:center; color:#fff; margin-bottom:5px; font-size:18px;">
            DADI BS DA ASSEGNARE: <b style="color:var(--nomad-orange); font-size:24px;">${restanti}</b></div>`;

        // Da dove viene il Burst: utile in collaudo, e non costa niente.
        if (window.burstDettaglio && window.burstDettaglio.voci.length > 1) {
            html += `<div style="text-align:center; color:#888; font-size:12px; margin-bottom:15px;">` +
                window.burstDettaglio.voci.map(v => v.motivo).join(' · ') + `</div>`;
        } else {
            html += `<div style="margin-bottom:15px;"></div>`;
        }

        window.combatTargets.forEach(function (tgt, index) {
            const coverStyle = tgt.cover
                ? `background:var(--nomad-orange); color:#000;`
                : `background:${sfondo}; color:#fff;`;

            let rangeHtml;
            if (arma.isTemplate) {
                rangeHtml = `<div style="margin-bottom:15px; text-align:center; padding:10px; background:#440000; border:1px solid #ff0000; color:#ff9900; font-weight:bold; border-radius:5px;">
                    🔥 ATTACCO A SAGOMA<br><span style="font-size:12px; color:#fff;">Colpo Automatico (salta il tiro BS)</span></div>`;
            } else {
                let segmenti = '', etichette = '';
                arma.bands.forEach(function (b, i) {
                    let cls = 'seg-2';
                    if (b.mod > 0) cls = 'seg-1'; else if (b.mod === -3) cls = 'seg-3'; else if (b.mod < -3) cls = 'seg-4';
                    const attivo = (tgt.rangeIndex === i) ? 'active' : '';
                    segmenti += `<div class="range-seg ${cls} ${attivo}" onclick="window.setTargetRangeBS(${index}, ${i})">${b.mod > 0 ? '+' + b.mod : b.mod}</div>`;
                    etichette += `<span>${b.label}</span>`;
                });
                rangeHtml = `<div style="margin-bottom:15px;"><div class="range-bar">${segmenti}</div>
                    <div style="display:flex; justify-content:space-between; font-size:10px; color:#888; margin-top:4px;">${etichette}</div></div>`;
            }

            const ammoHtml = arma.ammoOpzioni
                .map(o => `<option value="${o}" ${o === tgt.ammo ? 'selected' : ''}>Munizioni: ${o}</option>`).join('');

            html += `
            <div class="target-card" style="border-left: 4px solid ${bordo}; margin-bottom: 20px; background: rgba(255,255,255,0.03); padding: 15px; overflow: hidden;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                    <b style="color:var(--nomad-orange); font-size:20px;">${tgt.name}</b>
                    <div class="burst-ctrl">
                        <button class="burst-btn" onclick="window.adjustTargetBurstBS(${index}, -1)">-</button>
                        <span style="margin: 0 10px; font-size:22px; font-weight:bold; color:${tgt.burst > 0 ? '#00ff00' : '#888'}">${tgt.burst} B</span>
                        <button class="burst-btn" style="opacity:${restanti > 0 ? 1 : 0.3}" onclick="window.adjustTargetBurstBS(${index}, 1)">+</button>
                    </div>
                </div>
                ${rangeHtml}
                <div style="display:flex; gap:10px; margin-top: 15px;">
                    <button class="huge-btn" style="flex:1; margin:0; min-height:55px; font-size:16px; ${coverStyle}" onclick="window.toggleTargetCoverBS(${index})">${tgt.cover ? 'IN COPERTURA' : 'NO COPERTURA'}</button>
                    <select class="huge-btn" style="flex:1; margin:0; min-height:55px; font-size:16px; background:#002233; color:#fff; border-color:${bordo}; text-align:center; padding:0 10px;" onchange="window.setTargetAmmoBS(${index}, this.value)">
                        ${ammoHtml}
                    </select>
                </div>
                ${(tgt.cover && typeof window.sceltaCopertura === 'function')
                    ? window.sceltaCopertura(tgt.copertura, 'window.setTargetCoperturaBS', i)
                    : ''}
                <div style="display:flex; margin-top: 25px; margin-bottom: 5px;">
                    <select class="huge-btn" style="flex:1; margin:0; min-height:55px; font-size:16px; background:#111; color:#fff; border-color:#888; text-align:center; padding:0 10px;" onchange="window.setTargetTerrainBS(${index}, this.value)">
                        ${window.generaOpzioniTerreni ? window.generaOpzioniTerreni(tgt.terrain) : '<option value="NESSUNO">Nessun Terreno</option>'}
                    </select>
                </div>
            </div>`;
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
            nuovo.onclick = function () { window.eseguiCalcoloBS(); };
            nuovo.innerText = 'ESEGUI CALCOLO';
        }
    };

    // --- setters ---
    // setTargetRangeBS ora prende solo l'indice: il MOD lo dà l'arma.
    // Prima arrivavano indice e MOD da due strade diverse e potevano
    // disallinearsi, che è uno dei due modi in cui la gittata usciva a zero.
    window.setTargetRangeBS = function (index, rangeIdx) {
        const M = motore(); if (!M) return;
        const arma = M.profiloArma(window.currentOrder.weapon);
        window.combatTargets[index].rangeIndex = rangeIdx;
        window.combatTargets[index].rangeMod = arma.bands[rangeIdx] ? arma.bands[rangeIdx].mod : 0;
        window.renderTargetsAllocationBS();
    };
    // 🔴 DA QUALE copertura: la tendina e` window.sceltaCopertura (app.html,
    // chat INTERFACCIA). CONTRATTO, scritto sopra la loro funzione:
    //   sceltaCopertura(valoreAttuale, comando, argomento)
    //   comando = NOME della funzione; argomento facoltativo, passato PRIMA
    //   del valore scelto -> onchange="comando(argomento, this.value)".
    // La prima versione passava un pezzo di chiamata invece del nome:
    // parentesi sbilanciate nell'attributo, tendina muta. L'avevo dedotta
    // dal codice invece di chiederla. Il valore ('VITROFERRO',
    // 'CUTTING_FOAM') va in tgt.copertura, accanto a cover, e il motore lo
    // legge nel calcolo. Su Vitroferro: niente -3 a te, +6 alla sua salvezza
    // (tetto 12 prima del PS). (Chat INTERFACCIA, 23 settembre.)
    window.setTargetCoperturaBS = function (i, valore) {
        if (!window.combatTargets[i]) return;
        window.combatTargets[i].copertura = valore || null;
        window.renderTargetsAllocation();
    };

    window.toggleTargetCoverBS = function (i) { window.combatTargets[i].cover = !window.combatTargets[i].cover; if (!window.combatTargets[i].cover) window.combatTargets[i].copertura = null; window.renderTargetsAllocationBS(); };
    window.setTargetTerrainBS = function (i, v) { window.combatTargets[i].terrain = v; window.renderTargetsAllocationBS(); };
    window.setTargetAmmoBS = function (i, v) { window.combatTargets[i].ammo = v; window.renderTargetsAllocationBS(); };
    window.adjustTargetBurstBS = function (i, delta) {
        const assegnati = window.combatTargets.reduce((s, t) => s + (t.burst || 0), 0);
        const tgt = window.combatTargets[i];
        if (delta > 0 && assegnati < window.totalBurst) tgt.burst += delta;
        else if (delta < 0 && tgt.burst > 0) tgt.burst += delta;
        window.renderTargetsAllocationBS();
    };

    // ==============================================================
    // 4. INVIO
    // ==============================================================
    window.eseguiCalcoloBS = function () {
        const M = motore(); if (!M) return;
        const unita = window.coordUnits[window.coordIndex];
        const arma = M.profiloArma(window.currentOrder.weapon);

        window.coordPayloads.push({
            attaccante: unita,
            azione: M.AZIONI.BS_ATTACK,
            arma: arma,
            bersagli: window.combatTargets,
            burstDisponibile: window.totalBurst
        });

        window.coordIndex++;

        // Altre unità nell'Ordine Coordinato: si riparte dall'arma.
        if (window.coordIndex < window.coordUnits.length) {
            window.combatTargets = [];
            window.pendingTargets = [];
            return window.startUnitAllocationLoopBS();
        }

        // Porta unica verso l'Hub: valida tutto e BLOCCA se qualcosa non torna.
        const spedito = M.inviaCalcolo(window.coordPayloads, { isCoordinated: window.coordMode });

        if (!spedito) {
            // Il motore ha già spiegato cosa non va. Si resta sulla schermata
            // per correggere: l'ordine NON è stato consumato.
            window.coordIndex--;
            window.coordPayloads.pop();
            return;
        }

        const calcDiv = document.getElementById('calc-result');
        if (calcDiv) {
            calcDiv.innerHTML = `
                <div style="text-align:center; padding:20px; border:2px solid #00ff00; background:rgba(0,255,0,0.1); margin-top:20px;">
                    <h2 style="color:#00ff00; margin:0;">DATI INVIATI ALL'HUB</h2>
                    <p style="font-size:12px; color:#aaa;">Attacco BS di ${window.coordUnits.length} unità.</p>
                </div>`;
            calcDiv.style.display = 'block';
        }
    };

    console.log('🎯 ordine_attacco_bs.js riscritto su MotoreN5.');
})();


// Dichiarazione di versione per il controllo incrociato fra chat.
// Funziona anche se questo file si carica PRIMA del motore: in quel
// caso la versione resta in coda e il motore la raccoglie all'avvio.
(function () {
    var g = (typeof window !== 'undefined') ? window : globalThis;
    var v = { file: 'ordine_attacco_bs.js', versione: '2026-09-23.2', proprieta: 'MOTORE' };
    if (g.MotoreN5 && g.MotoreN5.dichiaraVersione) g.MotoreN5.dichiaraVersione(v.file, v.versione, v.proprieta);
    else { g.__versioniN5 = g.__versioniN5 || []; g.__versioniN5.push(v); }
})();
