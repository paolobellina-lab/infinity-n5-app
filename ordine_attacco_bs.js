// @versione 2026-10-07.6 | ordine_attacco_bs.js | proprieta`: chat MOTORE
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
        // 🔴 SCOPRIRE + ATTACCO BS (righe 6817-6829). La prima meta` era uno
        // Scoprire: arma e bersagli dell'Attacco si scelgono ADESSO, e fra i
        // bersagli c'e` il Marker che si sta Scoprendo. Poi si fissano i
        // modificatori dello Scoprire, poi quelli dell'Attacco, e parte UNA
        // busta con tutte e due le Abilita`.
        // Fino alla 2026-10-07.4 questo giro non esisteva: il Marker era
        // escluso, la schermata tornava alla scelta dell'arma all'infinito
        // (riprendiOrdine dice "bersagli da riconfermare" a ogni passaggio) e
        // lo Scoprire andava perso. (Paolo al tavolo, 6 ottobre.)
        const sc = window.scoprireInCorso();
        if (sc) {
            if (window.currentOrder.attaccoSceltoPer === actionId && window.combatTargets && window.combatTargets.length > 0) {
                // Arma e bersagli confermati: ora i modificatori dello Scoprire.
                sc.bersagliAttacco = window.combatTargets;
                sc.poiAttacco = true;
                window.currentOrder.weaponAttacco = window.currentOrder.weapon;
                window.combatTargets = [sc.bersaglio];
                return window.preparaModificatoriScoprire();
            }
            window.currentOrder.attaccoSceltoPer = null;
            window.coordIndex = 0;
            window.coordPayloads = [];
            window.pendingTargets = [];
            window.combatTargets = [];
            return window.startUnitAllocationLoopBS();
        }
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

    // Lo Scoprire dichiarato nella PRIMA meta` di quest'Ordine, se c'e`.
    // Solo Ordine singolo: in un Ordine Coordinato la combinazione non e`
    // costruita, e si resta al giro di sempre.
    window.scoprireInCorso = function () {
        const o = window.currentOrder || {};
        if (!o.isSecondHalf || window.coordMode || !o.scoprire || !o.scoprire.bersaglio) return null;
        return (String(o.action1 || '').toUpperCase() === 'SCOPRIRE') ? o.scoprire : null;
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
        if (window.scoprireInCorso()) window.currentOrder.attaccoSceltoPer = window.currentOrder.action;
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

        const scIn = window.scoprireInCorso();
        const giudizi = M.bersagliValidi(M.AZIONI.BS_ATTACK, nemici,
            { attaccante: unita, scoprendo: scIn ? scIn.bersaglio.id : undefined });

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

        // SCOPRIRE + ATTACCO: tornando dalla schermata dello Scoprire l'arma
        // dell'Ordine e` di nuovo quella dell'Attacco.
        const scGo = window.scoprireInCorso();
        if (scGo && scGo.fatto && window.currentOrder.weaponAttacco) window.currentOrder.weapon = window.currentOrder.weaponAttacco;
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

        if (scGo) window.combatTargets.forEach(function (t) { if (String(t.id) === String(scGo.bersaglio.id)) t.dopoScoprire = true; });

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
        // 🎲 Il DADO SPECIALE: prima si calcolava e nessuno lo mostrava.
        // Con piu` bersagli va a UNO solo: il primo, o quello marcato
        // `dadoSpeciale` (il motore lo assegna nello scontro). (27 settembre.)
        if (window.burstDettaglio && window.burstDettaglio.sd > 0) {
            const sd = window.burstDettaglio.sd;
            html += `<div style="text-align:center; color:#ffcc00; font-size:13px; margin:-8px 0 15px;">` +
                `🎲 +${sd} Dado Speciale: tira ${sd} dado in più su UN bersaglio (il primo), poi scartane ${sd}. Non è un dado di Burst.</div>`;
        }

        const STILE_SI = 'background:#004400; border-color:#00ff00; color:#00ff00;';
        const STILE_NO = 'background:#554400; border-color:#ffcc00; color:#ffcc00;';
        window.combatTargets.forEach(function (tgt, index) {
            const coverStyle = tgt.cover
                ? `background:var(--nomad-orange); color:#000;`
                : `background:${sfondo}; color:#fff;`;

            let rangeHtml;
            if (arma.isTemplate) {
                rangeHtml = `<div style="margin-bottom:15px; text-align:center; padding:10px; background:#440000; border:1px solid #ff0000; color:#ff9900; font-weight:bold; border-radius:5px;">
                    🔥 ATTACCO A SAGOMA<br><span style="font-size:12px; color:#fff;">Colpo Automatico (salta il tiro BS)</span></div>
                    <button class="huge-btn" style="width:100%; margin:0 0 15px; min-height:48px; font-size:15px; ${tgt.fuoriSagoma ? STILE_NO : STILE_SI}" onclick="window.toggleFuoriGittataBS(${index})">${tgt.fuoriSagoma ? 'BERSAGLIO NON SOTTO LA SAGOMA' : 'BERSAGLIO SOTTO LA SAGOMA'}</button>`;
            } else {
                let segmenti = '', etichette = '';
                arma.bands.forEach(function (b, i) {
                    let cls = 'seg-2';
                    if (b.mod > 0) cls = 'seg-1'; else if (b.mod === -3) cls = 'seg-3'; else if (b.mod < -3) cls = 'seg-4';
                    const attivo = (!tgt.fuoriGittata && tgt.rangeIndex === i) ? 'active' : '';
                    segmenti += `<div class="range-seg ${cls} ${attivo}" onclick="window.setTargetRangeBS(${index}, ${i})">${b.mod > 0 ? '+' + b.mod : b.mod}</div>`;
                    etichette += `<span>${b.label}</span>`;
                });
                // L'ultimo segmento: oltre la gittata massima dell'arma. Non e`
                // una banda (non ha un MOD): e` un requisito che manca.
                segmenti += `<div class="range-seg ${tgt.fuoriGittata ? 'active' : ''}" style="background:${tgt.fuoriGittata ? '#ffcc00' : '#332b00'}; color:${tgt.fuoriGittata ? '#000' : '#ffcc00'}; font-size:12px;" onclick="window.toggleFuoriGittataBS(${index})">FUORI</div>`;
                etichette += `<span>oltre</span>`;
                rangeHtml = `<div style="margin-bottom:15px;"><div class="range-bar">${segmenti}</div>
                    <div style="display:flex; justify-content:space-between; font-size:10px; color:#888; margin-top:4px;">${etichette}</div></div>`;
            }

            const ammoHtml = arma.ammoOpzioni
                .map(o => `<option value="${o}" ${o === tgt.ammo ? 'selected' : ''}>Munizioni: ${o}</option>`).join('');

            html += `
            <div class="target-card" style="border-left: 4px solid ${bordo}; margin-bottom: 20px; background: rgba(255,255,255,0.03); padding: 15px; overflow: hidden;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                    <b style="color:var(--nomad-orange); font-size:20px;">${tgt.name}${tgt.dopoScoprire ? ' <span style="font-size:12px; color:#66ff66;">🔍 dopo lo Scoprire</span>' : ''}</b>
                    <div class="burst-ctrl">
                        <button class="burst-btn" onclick="window.adjustTargetBurstBS(${index}, -1)">-</button>
                        <span style="margin: 0 10px; font-size:22px; font-weight:bold; color:${tgt.burst > 0 ? '#00ff00' : '#888'}">${tgt.burst} B</span>
                        <button class="burst-btn" style="opacity:${restanti > 0 ? 1 : 0.3}" onclick="window.adjustTargetBurstBS(${index}, 1)">+</button>
                    </div>
                </div>
                ${rangeHtml}
                <div style="display:flex; gap:10px; margin-top: 15px;">
                    <button class="huge-btn" style="flex:1; margin:0; min-height:55px; font-size:16px; ${coverStyle}" onclick="window.toggleTargetCoverBS(${index})">${tgt.cover ? `${(typeof window.iconaInterruttore === 'function') ? window.iconaInterruttore('coverSi') : ''}IN COPERTURA` : `${(typeof window.iconaInterruttore === 'function') ? window.iconaInterruttore('coverNo') : ''}NO COPERTURA`}</button>
                    <button class="huge-btn" style="flex:1; margin:0; min-height:55px; font-size:16px; ${tgt.lof === false ? STILE_NO : STILE_SI}" onclick="window.toggleLineaDiTiroBS(${index})">${tgt.lof === false ? 'LINEA DI TIRO NO' : 'LINEA DI TIRO SÌ'}</button>
                </div>
                ${window.htmlAlleatiInMischiaBS(tgt, index)}
                ${(tgt.cover && typeof window.sceltaCopertura === 'function')
                    // 🔴 `index`, non `i`: `i` e` la variabile del ciclo delle bande,
                    // gia` chiuso. Valutarla qui sollevava, e renderTargetsAllocationBS
                    // moriva: tasto copertura "che non fa niente" e gittata bloccata.
                    // Errore mio del 23 settembre. (Collaudo al tavolo di Paolo.)
                    ? window.sceltaCopertura(tgt.copertura, 'window.setTargetCoperturaBS', index)
                    : ''}
                <div style="display:flex; gap:10px; margin-top:10px; align-items:flex-end;">
                    <select class="huge-btn" style="flex:1; margin:0; min-height:55px; font-size:16px; background:#002233; color:#fff; border-color:${bordo}; text-align:center; padding:0 10px;" onchange="window.setTargetAmmoBS(${index}, this.value)">
                        ${ammoHtml}
                    </select>
                    <div class="bs-terreno" style="flex:1; min-width:0;">${window.tendinaTerrenoBS(tgt, index)}</div>
                </div>
                ${(typeof window.notaZona === 'function' && tgt.zona) ? (window.notaZona(tgt.zona) || '') : ''}
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
            // 🔴 IL TASTO DIVENTA IDLE quando il requisito manca: niente Linea
            // di Tiro, o bersaglio fuori gittata. Sono le due cose che sa solo
            // chi sta al tavolo; il resto (bersaglio non valido, usi finiti,
            // stati) l'app lo ferma prima. Sostituisce il tasto giallo fisso
            // "Requisito non soddisfatto" della pagina. (Proposta di Paolo, 7
            // ottobre.)
            const req = window.requisitiAttaccoBS();
            nuovo.onclick = function () { return req.idle ? window.idleDaAttaccoBS() : window.eseguiCalcoloBS(); };
            nuovo.innerText = req.idle ? 'IDLE' : 'ESEGUI CALCOLO';
            nuovo.style.background = req.idle ? M.COLORE_TASTO.idle : M.COLORE_TASTO.valido;
        }
    };

    // Chi manca del requisito, bersaglio per bersaglio: la regola e` del
    // motore (M.requisitiDichiarati, righe 3111-3114 e 1244-1247), una per
    // tutte le schermate d'attacco. Qui si dice solo QUALI requisiti ha un
    // Attacco BS: Linea di Tiro, e la gittata — o, per una Sagoma Diretta che
    // di bande non ne ha, l'essere sotto la Sagoma.
    function chiaviBS(M) {
        const arma = M.profiloArma(window.currentOrder.weapon);
        // 'scoperto': solo in SCOPRIRE + ATTACCO, sul Marker, quando allo
        // Scoprire e` mancato il requisito (campo nonScoperto).
        return ((arma && arma.isTemplate) ? ['lof', 'sagoma'] : ['lof', 'gittata']).concat(['scoperto']);
    }
    window.requisitiAttaccoBS = function () {
        const M = motore(); if (!M) return { mancanti: [], idle: false, motivo: '' };
        return M.requisitiDichiarati(window.combatTargets, chiaviBS(M));
    };
    window.idleDaAttaccoBS = function () { const M = motore(); return M ? M.idleDaRequisito(window.requisitiAttaccoBS()) : false; };

    // BERSAGLIO IN CORPO A CORPO: quanti TUOI alleati sono in quella mischia.
    // La regola da` -6 per ognuno (righe 3389-3396), e con una Sagoma il
    // colpo e` annullato se ce n'e` almeno uno. Zero esiste — il bersaglio e`
    // Ingaggiato con qualcuno che non e` tuo alleato — e l'app non ha la
    // mappa: lo dice il giocatore. Parte da 1, il caso normale. Compare solo
    // se il bersaglio e` in stato Ingaggiato. (TPL-01 al tavolo, 7 ottobre:
    // senza la domanda, un Fusilier rimasto Ingaggiato annullava la Sagoma e
    // non c'era modo di dire "nessun alleato".)
    window.htmlAlleatiInMischiaBS = function (tgt, index) {
        const M = motore(); if (!M) return '';
        const vero = M.rosterNemico().find(function (u) { return String(u.id) === String(tgt.id); });
        if (!vero || !M.statoBersaglio(vero).engaged) return '';
        if (typeof tgt.alleatiInMischia !== 'number') tgt.alleatiInMischia = 1;
        return `<div style="margin-top:10px; padding:10px; background:#1a1000; border:1px solid #664400; border-radius:5px;">
            <div style="color:#ffcc66; font-size:13px; margin-bottom:8px; text-align:center;">Bersaglio in Corpo a Corpo: quanti <b>TUOI</b> alleati sono in quella mischia?</div>
            <div style="display:flex; gap:8px;">` + [0, 1, 2, 3].map(function (n) {
                const si = tgt.alleatiInMischia === n;
                return `<button type="button" class="huge-btn" style="flex:1; margin:0; min-height:48px; font-size:18px; ${si ? 'background:#553300; border-color:#ffaa33; color:#ffaa33;' : 'background:#111; color:#888;'}" onclick="window.setAlleatiInMischiaBS(${index}, ${n})">${n}</button>`;
            }).join('') + `</div></div>`;
    };
    window.setAlleatiInMischiaBS = function (i, n) {
        const t = window.combatTargets && window.combatTargets[i]; if (!t) return;
        t.alleatiInMischia = n;
        window.renderTargetsAllocationBS();
    };

    window.toggleRequisitoBS = function (i, chiave) {
        const M = motore(); if (!M) return;
        if (M.invertiRequisito(window.combatTargets && window.combatTargets[i], chiave)) window.renderTargetsAllocationBS();
    };
    window.toggleLineaDiTiroBS = function (i) { window.toggleRequisitoBS(i, 'lof'); };
    window.toggleFuoriGittataBS = function (i) { window.toggleRequisitoBS(i, chiaviBS(motore())[1]); };

    // --- setters ---
    // setTargetRangeBS ora prende solo l'indice: il MOD lo dà l'arma.
    // Prima arrivavano indice e MOD da due strade diverse e potevano
    // disallinearsi, che è uno dei due modi in cui la gittata usciva a zero.
    window.setTargetRangeBS = function (index, rangeIdx) {
        const M = motore(); if (!M) return;
        const arma = M.profiloArma(window.currentOrder.weapon);
        window.combatTargets[index].rangeIndex = rangeIdx;
        window.combatTargets[index].rangeMod = arma.bands[rangeIdx] ? arma.bands[rangeIdx].mod : 0;
        window.combatTargets[index].fuoriGittata = false;   // scelta una banda: e` in gittata
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

    // TERRENO, FUMO ED ECLIPSE: UNA tendina sola (richiesta di Paolo, 5
    // ottobre). La tendina e` quella condivisa della chat INTERFACCIA
    // (window.sceltaTerreno, app.html 2026-10-05.1): consegna un valore
    // composto ("TER_10+FUMO") che separa chi l'ha composto
    // (window.separaTerrenoEZona) — qui non lo si legge a mano. Nella busta i
    // campi restano DUE, terrain e zona.
    //
    // Dove app.html non c'e` (i banchi che caricano solo questo file) si
    // ripiega sulla tendina del solo terreno e lo si DICE: un ripiego muto
    // vorrebbe dire Fumo ed Eclipse spariti dall'Attacco BS in silenzio.
    //
    // I due comandi di prima, setTargetZonaBS e setTargetTerrainBS, sono
    // TOLTI: non li chiamava nessun altro, e due strade per lo stesso campo
    // sono il difetto che torna sempre.
    window.tendinaTerrenoBS = function (tgt, index) {
        if (typeof window.sceltaTerreno === 'function') {
            return window.sceltaTerreno(tgt.terrain, tgt.zona, 'window.setTargetTerrenoBS', index);
        }
        console.error('\u26d4 window.sceltaTerreno manca (app.html non caricato?): tendina del solo terreno, senza Fumo ne` Eclipse.');
        return `<div style="display:flex; margin-top: 25px; margin-bottom: 5px;">
                    <select class="huge-btn" style="flex:1; margin:0; min-height:55px; font-size:16px; background:#111; color:#fff; border-color:#888; text-align:center; padding:0 10px;" onchange="window.setTargetTerrenoBS(${index}, this.value)">
                        ${window.generaOpzioniTerreni ? window.generaOpzioniTerreni(tgt.terrain) : '<option value="NESSUNO">Nessun Terreno</option>'}
                    </select>
                </div>`;
    };

    window.setTargetTerrenoBS = function (i, v) {
        const t = window.combatTargets && window.combatTargets[i];
        if (!t) return;
        if (typeof window.separaTerrenoEZona === 'function') {
            const s = window.separaTerrenoEZona(v);
            t.terrain = s.terrain; t.zona = s.zona;
        } else {
            // Solo col ripiego qui sopra: il valore e` un terreno e basta.
            t.terrain = v || 'NESSUNO'; t.zona = null;
        }
        window.renderTargetsAllocationBS();
    };

    window.toggleTargetCoverBS = function (i) { window.combatTargets[i].cover = !window.combatTargets[i].cover; if (!window.combatTargets[i].cover) window.combatTargets[i].copertura = null; window.renderTargetsAllocationBS(); };
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

        // Burst diviso, e solo ALCUNI bersagli senza requisito: i loro dadi
        // non si tirano (righe 3111-3114, vedi requisitiAttaccoBS). Restano
        // nella busta a Burst 0, con il motivo, cosi` il tabellone lo dice.
        const req = window.requisitiAttaccoBS();
        if (req.idle) return window.idleDaAttaccoBS();
        const bersagli = M.bersagliConRequisiti(window.combatTargets, req);

        // SCOPRIRE + ATTACCO: prima la voce dello Scoprire, poi l'Attacco.
        const scEs = window.scoprireInCorso();
        if (scEs && scEs.busta && window.coordPayloads.indexOf(scEs.busta) < 0) window.coordPayloads.push(scEs.busta);

        window.coordPayloads.push({
            attaccante: unita,
            azione: M.AZIONI.BS_ATTACK,
            arma: arma,
            bersagli: bersagli,
            burstDisponibile: window.totalBurst,
            // Il Marker dello Scoprire della prima meta`: e` cio` che permette
            // di dichiararlo bersaglio (la porta d'invio lo ricontrolla).
            scoprendo: scEs ? scEs.bersaglio.id : undefined
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
            // ...e anche la voce dello Scoprire: si rimette al prossimo invio.
            if (scEs && scEs.busta) { const k = window.coordPayloads.indexOf(scEs.busta); if (k >= 0) window.coordPayloads.splice(k, 1); }
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
    var v = { file: 'ordine_attacco_bs.js', versione: '2026-10-07.6', proprieta: 'MOTORE' };
    if (g.MotoreN5 && g.MotoreN5.dichiaraVersione) g.MotoreN5.dichiaraVersione(v.file, v.versione, v.proprieta);
    else { g.__versioniN5 = g.__versioniN5 || []; g.__versioniN5.push(v); }
})();
