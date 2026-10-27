// @versione 2026-10-27.1 | ordine_attacco_bs.js | proprieta`: chat MOTORE
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
                sc.prosegui = null; sc.etichetta = 'AVANTI: ATTACCO BS'; sc.extraBusta = { poiAttacco: true };
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

    // Lo Scoprire dichiarato nella PRIMA meta` di quest'Ordine, se c'e`: la
    // regola e` del motore (M.scoprireInCorso), una per tutte le schermate.
    // Dalla 2026-10-07.7 vale anche in ORDINE COORDINATO: ogni partecipante
    // fissa il suo Scoprire e il suo Attacco, uno dopo l'altro, contro lo
    // stesso Marker (righe 11355-11359), e la busta li porta tutti.
    window.scoprireInCorso = function () {
        const M = window.MotoreN5;
        return (M && M.scoprireInCorso) ? M.scoprireInCorso() : null;
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
        // 2026-10-10.1 (TEST): le armi si leggono da weapon E da equip, come fa
        // M.armiARO. Prima solo da weapon: 629 profili su 765 avevano un'arma
        // (Pistol, Boarding Pistol, MULTI Pistol...) offerta in ARO e non
        // nell'Attacco BS attivo. Le voci di equip che NON sono armi (visori,
        // ECM, Hacking Device...) si saltano in silenzio: non sono "armi
        // scartate", sono un'altra cosa.
        const daWeapon = M.dividiLista(unita.weapon);
        const daEquip = M.dividiLista(unita.equip).filter(function (n) { return daWeapon.indexOf(n) < 0; });
        const grezze = daWeapon.concat(daEquip);
        const profili = [];
        const scartate = [];
        // Si piazzano, non si sparano: hanno l'Ordine Piazzare Equipaggiamento.
        const SI_PIAZZA = ['COPERTURA', 'RIPETITORE', 'PIAZZATO'];

        // 14 ottobre (Paolo al tavolo): un'arma a piu` modalita` (MULTI Sniper
        // Rifle: AP, Shock, Anti-Materiel) compariva con UN BOTTONE PER
        // MODALITA`. Ora un bottone solo; la modalita` si sceglie nella pagina
        // della gittata (window.scegliModoBS). Si raggruppano le modalita`
        // che sopravvivono ai filtri qui sotto, ANCHE quando una e` a Sagoma
        // e l'altra a gittata (Missile Launcher Blast/Hit, Drop Bears): la
        // pagina della gittata si ridisegna sulla modalita` scelta (Paolo,
        // 14 ottobre).
        const gruppi = {};   // nome grezzo -> [nomi delle modalita`]
        grezze.forEach(function (nome) {
            const dallEquip = daEquip.indexOf(nome) >= 0;
            let varianti = M.variantiArma(nome);
            if (varianti.length === 0) {
                const p = M.profiloArma(nome);
                if (p.nonTrovata) {
                    if (!dallEquip) scartate.push({ nome: nome, motivo: 'non presente nel database armi' });
                    return;
                }
                varianti = [p];
            }
            varianti.forEach(function (p) {
                if (p.isCC) { scartate.push({ nome: p.nome, motivo: 'arma da Corpo a Corpo' }); return; }
                const voce = (window.RULES_WEAPONS || {})[p.nome] || p;
                if (SI_PIAZZA.indexOf(voce.risoluzione) >= 0) { scartate.push({ nome: p.nome, motivo: 'si piazza, non si spara' }); return; }
                // 26 ottobre (Paolo): le mine (Shock Mine, Cybermine,
                // Monofilament...) hanno il Tratto Deployable e si mettono sul
                // tavolo con PIAZZARE EQUIPAGGIAMENTO (righe 7542-7573): poi
                // scattano da sole. Non sono un Attacco BS, e non sono Targetless.
                if (/\bDEPLOYABLE\b/i.test(String(p.traits || '')) && !(M.eTargetless && M.eTargetless(p))) {
                    scartate.push({ nome: p.nome, motivo: 'si piazza con PIAZZARE EQUIPAGGIAMENTO, non si spara' }); return;
                }
                // MediKit, GizmoKit, Deactivator: bersaglio vincolato, solo la
                // loro azione (REGOLE, 10 ottobre; M.ARMI_AZIONE_DEDICATA).
                const dedicata = M.azioneDedicataArma ? M.azioneDedicataArma(p.nome) : null;
                if (dedicata) { scartate.push({ nome: p.nome, motivo: 'si usa solo con la sua azione (' + dedicata + ')' }); return; }
                if (profili.some(x => x.nome === p.nome)) return;
                p._famiglia = varianti.length > 1 ? nome : null;
                profili.push(p);
            });
        });
        // Le modalita` della stessa arma, non a Sagoma Diretta: un bottone solo.
        const visti = {};
        const bottoni = [];
        profili.forEach(function (p) {
            const f = p._famiglia;
            if (!f) { bottoni.push(p); return; }
            if (visti[f]) { visti[f].modi.push(p); return; }
            visti[f] = { famiglia: f, modi: [p] };
            bottoni.push(visti[f]);
        });

        if (bottoni.length === 0) {
            container.innerHTML += `<p style="color:#ff3333; text-align:center; font-size:18px;">❌ Nessuna arma a distanza utilizzabile.</p>`;
        } else {
            bottoni.forEach(function (b) {
                if (b.modi && b.modi.length > 1) {
                    const modi = b.modi.map(m => m.nomeRichiesto || m.nome);
                    gruppi[b.famiglia] = modi;
                    const munizioni = [];
                    b.modi.forEach(m => (m.ammoOpzioni || [m.ammo]).forEach(a => { if (a && munizioni.indexOf(a) < 0) munizioni.push(a); }));
                    const vista = Object.assign({}, b.modi[0], { nome: b.famiglia, scelta: null, ammoOpzioni: munizioni });
                    const famEsc = String(b.famiglia).replace(/'/g, "\\'");
                    container.innerHTML += M.bottoneArma(vista, { attributi: `onclick="window.declareAttackBS(window._modiBS['${famEsc}'][0], '${famEsc}')"` });
                    return;
                }
                const p = b.modi ? b.modi[0] : b;
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
                // 9 ottobre: il bottone e` quello approvato da Paolo (M.bottoneArma).
                // 26 ottobre (DIS-02): un'arma Disposable dice i suoi usi sul
                // bottone, e a usi finiti il bottone spiega invece di sparare.
                // La riga degli usi la disegna M.bottoneArma (opzione usi).
                const usiP = M.usiResidui ? M.usiResidui(unita, p) : null;
                if (usiP && usiP.residui <= 0) {
                    container.innerHTML += M.bottoneArma(p, { usi: usiP, attributi: `onclick="alert(window.MotoreN5.messaggioScarico(window.coordUnits[window.coordIndex], window.MotoreN5.profiloArma('${nomeEsc}')))"` });
                    return;
                }
                container.innerHTML += M.bottoneArma(p, { usi: usiP, attributi: `onclick="window.declareAttackBS('${nomeEsc}')"` });
            });
        }
        window._modiBS = gruppi;

        // Le armi scartate si mostrano col motivo, invece di sparire in silenzio.
        if (scartate.length > 0) {
            container.innerHTML += `<div style="margin-top:15px; padding:10px; background:#111; border:1px solid #444; border-radius:5px; color:#888; font-size:13px;">
                Non utilizzabili qui: ` + scartate.map(x => `<b>${x.nome}</b> (${x.motivo})`).join(', ') + `</div>`;
        }

        window.goToStep('step-weapon');
    };

    // 🔴 14 ottobre: SAGOMA DIRETTA, non "qualsiasi Sagoma". Il Blast del
    // Missile Launcher, dei Rocket Launcher e dei Plasma e` una Sagoma
    // d'IMPATTO: si tira BS, con la gittata (M.regoleTemplate: IMPATTO,
    // tiroPerColpire). La pagina guardava isTemplate e la trattava come una
    // Sagoma Diretta: "Colpo Automatico", gittata azzerata — e il calcolo
    // partiva col MOD di gittata a 0.
    function sagomaDiretta(M, a) {
        return !!(a && a.isTemplate && M.regoleTemplate && (M.regoleTemplate(a) || {}).tipo === 'DIRETTO');
    }
    window.sagomaDirettaBS = function (a) { const M = motore(); return M ? sagomaDiretta(M, a) : false; };

    window.declareAttackBS = function (nomeArma, famiglia) {
        const M0 = window.MotoreN5;
        const u0 = window.coordUnits && window.coordUnits[window.coordIndex];
        const usi0 = (M0 && M0.usiResidui && u0) ? M0.usiResidui(u0, M0.profiloArma(nomeArma)) : null;
        if (usi0 && usi0.residui <= 0) return alert('⛔ ' + M0.messaggioScarico(u0, M0.profiloArma(nomeArma)));
        window.currentOrder.weapon = nomeArma;
        // Le modalita` fra cui scegliere nella pagina della gittata (o nessuna).
        window.currentOrder.modiArma = (famiglia && window._modiBS && window._modiBS[famiglia]) ? window._modiBS[famiglia].slice() : null;
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

        // 23 ottobre (Paolo, DIF-14): un'arma TARGETLESS (Smoke Grenades,
        // Smoke Grenade Launcher...) si tira su un PUNTO del tavolo: nessun
        // bersaglio da scegliere (righe 5789-5791). Il punto diventa il solo
        // "bersaglio" e si passa dritti all'allarme ARO, come dopo la scelta.
        // In Ordine Coordinato la schermata resta, con il solo punto.
        const armaSel = M.profiloArma(window.currentOrder.weapon);
        if (M.eTargetless && M.eTargetless(armaSel) && !window.scoprireInCorso()) {
            window.validTargets = [M.bersaglioPunto()];
            window.targetsScartati = [];
            if (!window.coordMode && typeof window.confirmMultiAro === 'function') {
                window.pendingTargets = [M.bersaglioPunto()];
                return window.confirmMultiAro(false);
            }
            if (window.renderTargetButtons) window.renderTargetButtons();
            return window.goToStep('step-wait-aro');
        }

        // 23 ottobre (Paolo, CO-01): nell'Ordine Coordinato tutti attaccano
        // LO STESSO UNICO bersaglio (righe 11356-11358). Il primo partecipante
        // lo sceglie; gli altri lo ricevono e non scelgono.
        const bc = window.coordMode && window.coordIndex > 0 && window.currentOrder && window.currentOrder.bersaglioCoordinato;
        if (bc) {
            window.combatTargets = [Object.assign({ burst: 0, rangeIndex: 0, rangeMod: 0, cover: false, terrain: 'NESSUNO' }, bc)];
            // 26 ottobre (Paolo, SP-07): SCOPRIRE + ATTACCO coordinato. Ogni
            // partecipante ha il SUO Scoprire (gittata, copertura, terreno e
            // Linea di Tiro sono suoi): prima la pagina usciva solo alla Punta,
            // e la busta aveva 4 voci invece di 6. Stesso Marker, pagina nuova.
            const scB = window.scoprireInCorso();
            if (scB && !scB.fatto) {
                scB.bersagliAttacco = window.combatTargets;
                scB.poiAttacco = true;
                scB.prosegui = null; scB.etichetta = 'AVANTI: ATTACCO BS'; scB.extraBusta = { poiAttacco: true };
                window.currentOrder.weaponAttacco = window.currentOrder.weapon;
                window.currentOrder.attaccoSceltoPer = window.currentOrder.action;
                window.combatTargets = [{ id: scB.bersaglio.id, name: scB.bersaglio.name, burst: 1, cover: false,
                                          rangeIndex: 0, rangeMod: 0, terrain: 'NESSUNO' }];
                return window.preparaModificatoriScoprire();
            }
            return window.goToModifiersBS();
        }

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

        // 23 ottobre (TEST, CO-01): nel Coordinato il bersaglio e` UNO gia`
        // nella scelta, perche` l'allarme ARO parte alla conferma: prima il
        // taglio avveniva dopo, e il reattivo vedeva nominato anche un
        // bersaglio che poi non c'era. Il secondo tocco SOSTITUISCE il primo
        // (con una Sagoma d'Impatto no: i secondari sono sotto l'area).
        const tplSel = (armaSel && armaSel.isTemplate && M.regoleTemplate) ? (M.regoleTemplate(armaSel) || {}) : {};
        window._bsUnicoBersaglio = !!window.coordMode && tplSel.tipo !== 'IMPATTO';
        if (typeof window.toggleTargetSelection === 'function' && !window.toggleTargetSelection._unicoBS) {
            const orig = window.toggleTargetSelection;
            const avvolta = function (id) {
                if (!window._bsUnicoBersaglio) return orig.apply(this, arguments);
                const gia = (window.pendingTargets || []).some(function (t) { return String(t.id) === String(id); });
                const t = (window.validTargets || []).find(function (u) { return String(u.id) === String(id); });
                window.pendingTargets = gia ? [] : (t ? [t] : []);
                if (window.renderTargetButtons) window.renderTargetButtons();
            };
            avvolta._unicoBS = true;
            window.toggleTargetSelection = avvolta;
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
        // Coordinato: UN solo bersaglio (righe 11356-11358). Con una Sagoma
        // d'Impatto restano i secondari sotto l'area. Il primo partecipante lo
        // fissa per gli altri.
        if (window.coordMode) {
            const tplC = (arma && arma.isTemplate && M.regoleTemplate) ? (M.regoleTemplate(arma) || {}) : {};
            if (window.combatTargets.length > 1 && tplC.tipo !== 'IMPATTO') {
                alert('⚠️ Ordine Coordinato: tutte le truppe attaccano lo STESSO UNICO bersaglio (righe 11356-11358).\n\nResta ' + window.combatTargets[0].name + '.');
                window.combatTargets = [window.combatTargets[0]];
            }
            if (window.coordIndex === 0) {
                const t0 = window.combatTargets[0];
                window.currentOrder.bersaglioCoordinato = { id: t0.id, name: t0.name };
            }
        }
        // Il punto del tavolo passa per confirmMultiAro, che tiene solo id e
        // nome: qui torna il segno `punto`.
        window.combatTargets.forEach(function (t) { if (String(t.id) === 'punto' && M.bersaglioPunto) Object.assign(t, M.bersaglioPunto(), { cover: false }); });

        // I dadi non ancora assegnati vanno tutti sul primo bersaglio.
        // 🔴 15 ottobre (TPL-07, Paolo dal tavolo): UN'ARMA A SAGOMA NON
        // DIVIDE I DADI. Ogni punto di Burst e` una Sagoma; chi sta sotto
        // una Sagoma ne subisce il colpo senza un dado suo, e chi sta sotto
        // due Sagome fa due Tiri Salvezza. Qui i dadi si davano tutti al
        // primo bersaglio e il secondo restava a 0: il motore, giustamente
        // per un Burst diviso, lo scartava, e l'Orc spariva dal tabellone.
        // Per una Sagoma il numero di ogni bersaglio vuol dire "da quante
        // Sagome e` preso": almeno 1, al massimo il Burst, senza somma (il
        // motore conta gia` il massimo, non la somma: E21).
        // 26 ottobre (Paolo, SG-09): con 2 o piu` Sagome ogni Sagoma ha una
        // LETTERA (A, B, C...) e per ogni bersaglio si accendono le lettere
        // delle Sagome che lo prendono. Niente +/-: un bersaglio puo` stare
        // sotto piu` Sagome, e l'annullamento di una Sagoma (un tuo alleato
        // sotto) vale per tutti quelli sotto la STESSA lettera (motore,
        // M.sagomeConLettera). Partenza: un bersaglio solo sotto tutte; piu`
        // bersagli, una lettera a testa a giro.
        const lettereBS = window.lettereSagomaBS();
        if (arma.isTemplate && lettereBS.length > 1) {
            window.combatTargets.forEach(function (t, k) {
                if (!Array.isArray(t.sagome)) t.sagome = (window.combatTargets.length === 1) ? lettereBS.slice() : [lettereBS[k % lettereBS.length]];
                t.sagome = t.sagome.filter(L => lettereBS.indexOf(L) >= 0);
                t.burst = t.sagome.length;
            });
        } else if (arma.isTemplate) {
            window.combatTargets.forEach(function (t, k) {
                t.sagome = undefined;
                const n = parseInt(t.burst, 10) || 0;
                t.burst = (n >= 1) ? Math.min(n, window.totalBurst) : (k === 0 ? window.totalBurst : 1);
            });
        } else {
            // 26 ottobre (DIS-05, Paolo): con due bersagli e Burst 2 il secondo
            // restava a 0 dadi e spariva dal tabellone ("si vede solo il tiro
            // del Fusilier"). Ora i dadi si dividono a giro, il resto al primo:
            // B2 su due bersagli = 1 e 1; B3 = 2 e 1. Il giocatore li sposta.
            const assegnati = window.combatTargets.reduce((s, t) => s + (t.burst || 0), 0);
            if (assegnati === 0) {
                const n = window.combatTargets.length;
                window.combatTargets.forEach(function (t, k) {
                    t.burst = Math.floor(window.totalBurst / n) + (k < window.totalBurst % n ? 1 : 0);
                });
            }
        }

        // Gittata: banda iniziale esplicita, mai uno zero implicito.
        window.combatTargets.forEach(function (t) {
            if (sagomaDiretta(M, arma)) { t.rangeIndex = 0; t.rangeMod = 0; }
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

        const sagome = !!arma.isTemplate;
        let html = '';
        if (sagome) {
            html += `<div style="text-align:center; color:#fff; margin-bottom:5px; font-size:16px;">` +
                (window.totalBurst > 1
                    ? `${window.totalBurst} SAGOME: per ogni bersaglio accendi le lettere delle Sagome che lo prendono.<br>` +
                      window.lettereSagomaBS().map(function (L) {
                          const sotto = window.combatTargets.filter(t => (t.sagome || []).indexOf(L) >= 0).map(t => t.name);
                          return `<b style="color:${sotto.length ? '#ffcc66' : '#ff6666'};">Sagoma ${L}</b>: ${sotto.length ? sotto.join(', ') : 'nessun bersaglio'}`;
                      }).join(' &nbsp;·&nbsp; ')
                    : `UNA SAGOMA: ogni bersaglio scelto è sotto l'area e ne subisce il colpo.`) + `</div>`;
        } else {
            html += `<div style="text-align:center; color:#fff; margin-bottom:5px; font-size:18px;">
            DADI BS DA ASSEGNARE: <b style="color:var(--nomad-orange); font-size:24px;">${restanti}</b></div>`;
        }

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

        // 22 ottobre (Paolo): SAGOMA D'IMPATTO, un colpo, piu` bersagli. Il
        // tiro e` uno e i MOD vengono dal Principale (righe 3745-3749): sui
        // secondari la gittata, la Copertura, la Linea di Tiro, la munizione e
        // il terreno non servono (la Copertura non da` nemmeno il +3 alla
        // salvezza: e` una Sagoma). Restano il nome e gli alleati in mischia.
        const impattoUnico = impattoUnicoBS(M, arma);
        const STILE_SI = 'background:#004400; border-color:#00ff00; color:#00ff00;';
        const STILE_NO = 'background:#554400; border-color:#ffcc00; color:#ffcc00;';
        window.combatTargets.forEach(function (tgt, index) {
            if (impattoUnico && index > 0) {
                html += `
            <div class="target-card bersaglio-secondario" style="border-left: 4px solid ${bordo}; margin-bottom: 20px; background: rgba(255,255,255,0.03); padding: 15px; overflow: hidden;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <b style="color:var(--nomad-orange); font-size:20px;">${tgt.name}</b>
                    <span style="font-size:14px; font-weight:bold; color:#ffcc66;">SECONDARIO</span>
                </div>
                <div style="color:#bbb; font-size:13px;">Sotto la Sagoma del Principale. Lo stesso tiro vale anche per lui: gittata, copertura e munizione sono quelle del Principale. Reagisce e fa il suo Tiro Salvezza.</div>
                ${window.htmlAlleatiInMischiaBS(tgt, index)}
            </div>`;
                return;
            }
            const coverStyle = tgt.cover
                ? `background:var(--nomad-orange); color:#000;`
                : `background:${sfondo}; color:#fff;`;

            let rangeHtml;
            if (sagomaDiretta(M, arma)) {
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

            // 14 ottobre (Paolo): la MODALITA` dell'arma (MULTI: AP / Shock /
            // Anti-Materiel; Missile Launcher: Blast / Hit) si sceglie QUI, nella
            // tendina delle munizioni che c'era gia`: niente bottoni in piu`.
            // Ogni voce dice munizione e Burst. Cambiare modalita` vale per
            // tutto l'Attacco (una modalita` per Ordine): window.setTargetAmmoBS.
            const modiT = window.currentOrder.modiArma;
            const ammoHtml = (Array.isArray(modiT) && modiT.length > 1)
                ? modiT.map(function (n, mi) {
                    const m = M.profiloArma(n);
                    return (m.ammoOpzioni || [m.ammo]).map(function (a) {
                        const sel = (n === window.currentOrder.weapon && a === tgt.ammo) ? 'selected' : '';
                        return `<option value="${mi}|${a}" ${sel}>Munizioni: ${a} · B${m.burst}${sagomaDiretta(M, m) ? ' · Sagoma' : (m.isTemplate ? ' · Sagoma d\'Impatto' : '')}</option>`;
                    }).join('');
                }).join('')
                : arma.ammoOpzioni
                .map(o => `<option value="${o}" ${o === tgt.ammo ? 'selected' : ''}>Munizioni: ${o}</option>`).join('');

            html += `
            <div class="target-card" style="border-left: 4px solid ${bordo}; margin-bottom: 20px; background: rgba(255,255,255,0.03); padding: 15px; overflow: hidden;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                    <b style="color:var(--nomad-orange); font-size:20px;">${tgt.name}${tgt.dopoScoprire ? ' <span style="font-size:12px; color:#66ff66;">🔍 dopo lo Scoprire</span>' : ''}${(impattoUnico && index === 0) ? ' <span class="etichetta-principale" style="font-size:13px; color:#ffcc66;">PRINCIPALE</span>' : ''}</b>
                    ${(sagome && window.totalBurst <= 1) ? `<span style="font-size:18px; font-weight:bold; color:#00ff00;">1 Sagoma</span>` : (sagome && Array.isArray(tgt.sagome)) ? `<div class="sagome-lettere" style="display:flex; gap:6px;">` +
                        window.lettereSagomaBS().map(function (L) {
                            const on = tgt.sagome.indexOf(L) >= 0;
                            return `<button class="burst-btn tasto-sagoma" style="min-width:44px; font-weight:bold; ${on ? 'background:#ffcc66; color:#000; border-color:#ffcc66;' : 'background:#111; color:#888; border-color:#555;'}" onclick="window.toggleSagomaBS(${index}, '${L}')">${L}</button>`;
                        }).join('') + `</div>` : `<div class="burst-ctrl">
                        <button class="burst-btn" style="opacity:${(sagome ? tgt.burst > 1 : tgt.burst > 0) ? 1 : 0.3}" onclick="window.adjustTargetBurstBS(${index}, -1)">-</button>
                        <span style="margin: 0 10px; font-size:22px; font-weight:bold; color:${tgt.burst > 0 ? '#00ff00' : '#888'}">${tgt.burst} ${sagome ? (tgt.burst === 1 ? 'Sagoma' : 'Sagome') : 'B'}</span>
                        <button class="burst-btn" style="opacity:${(sagome ? tgt.burst < window.totalBurst : restanti > 0) ? 1 : 0.3}" onclick="window.adjustTargetBurstBS(${index}, 1)">+</button>
                    </div>`}
                </div>
                ${rangeHtml}
                ${tgt.punto ? `<div class="nota-punto" style="color:#bbb; font-size:13px; margin-top:10px;">Arma Targetless: si tira su un punto del tavolo, non su una truppa. Niente Copertura né Mimetismo; la gittata è quella fino al punto, e serve la Linea di Tiro verso il punto.</div>` : ''}
                <div style="display:flex; gap:10px; margin-top: 15px;">
                    ${tgt.punto ? '' : `<button class="huge-btn" style="flex:1; margin:0; min-height:55px; font-size:16px; ${coverStyle}" onclick="window.toggleTargetCoverBS(${index})">${tgt.cover ? `${(typeof window.iconaInterruttore === 'function') ? window.iconaInterruttore('coverSi') : ''}IN COPERTURA` : `${(typeof window.iconaInterruttore === 'function') ? window.iconaInterruttore('coverNo') : ''}NO COPERTURA`}</button>`}
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
            // Coordinato: l'Idle e` di questa truppa sola (vedi eseguiCalcoloBS).
            nuovo.onclick = function () { return (req.idle && !window.coordMode) ? window.idleDaAttaccoBS() : window.eseguiCalcoloBS(); };
            nuovo.innerText = req.idle ? (window.coordMode ? 'IDLE (SOLO QUESTA TRUPPA)' : 'IDLE') : 'ESEGUI CALCOLO';
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
        return (sagomaDiretta(M, arma) ? ['lof', 'sagoma'] : ['lof', 'gittata']).concat(['scoperto']);
    }
    // Sagoma d'Impatto, un colpo, piu` bersagli: il tiro e` del Principale.
    function impattoUnicoBS(M, arma) {
        const t = window.combatTargets || [];
        if (!arma || !arma.isTemplate || t.length < 2 || (window.totalBurst || 1) > 1) return false;
        return ((M.regoleTemplate && M.regoleTemplate(arma)) || {}).tipo === 'IMPATTO';
    }
    window.requisitiAttaccoBS = function () {
        const M = motore(); if (!M) return { mancanti: [], idle: false, motivo: '' };
        // I requisiti (Linea di Tiro, gittata) sono del Principale: un
        // secondario sotto la Sagoma non ne ha (righe 3736-3738).
        const arma = M.profiloArma(window.currentOrder.weapon);
        const quali = impattoUnicoBS(M, arma) ? window.combatTargets.slice(0, 1) : window.combatTargets;
        return M.requisitiDichiarati(quali, chiaviBS(M));
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
    // 8 ottobre: la domanda la disegna il motore (M.domandaAlleatiInMischia),
    // la stessa per BS, Speculativo, Guidato e Intuitivo.
    window.htmlAlleatiInMischiaBS = function (tgt, index) {
        const M = motore(); if (!M) return '';
        return M.domandaAlleatiInMischia(tgt, index, 'window.setAlleatiInMischiaBS');
    };
    window.setAlleatiInMischiaBS = function (i, n) {
        const M = motore(); if (!M) return;
        if (M.impostaAlleatiInMischia(window.combatTargets && window.combatTargets[i], n)) window.renderTargetsAllocationBS();
    };

    // Cambio di modalita`: stessa arma, profilo diverso (Burst, munizione,
    // Tratti). I dadi si riassegnano dal principio — il Burst puo` cambiare
    // (MULTI Rifle: B3 in AP, B1 in Anti-Materiel) — e la munizione di ogni
    // bersaglio si riallinea; gittata, copertura e requisiti restano.
    window.scegliModoBS = function (i) {
        const modi = window.currentOrder.modiArma || [];
        if (!modi[i] || modi[i] === window.currentOrder.weapon) return;
        window.currentOrder.weapon = modi[i];
        if (window.currentOrder.weaponAttacco) window.currentOrder.weaponAttacco = modi[i];
        (window.combatTargets || []).forEach(function (t) { t.burst = 0; t.ammo = null; });
        window.goToModifiersBS();
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
    window.setTargetAmmoBS = function (i, v) {
        // "indice|munizione": una voce di un'arma a piu` modalita`.
        const m = /^(\d+)\|(.+)$/.exec(String(v));
        if (m) {
            const modi = window.currentOrder.modiArma || [];
            const nome = modi[parseInt(m[1], 10)];
            if (nome && nome !== window.currentOrder.weapon) {
                window.scegliModoBS(parseInt(m[1], 10));
                // la stessa munizione su tutti i bersagli: una modalita` per Ordine
                (window.combatTargets || []).forEach(function (t) { t.ammo = m[2]; });
                return window.renderTargetsAllocationBS();
            }
            window.combatTargets[i].ammo = m[2];
            return window.renderTargetsAllocationBS();
        }
        window.combatTargets[i].ammo = v; window.renderTargetsAllocationBS();
    };
    // SG-09: le lettere delle Sagome di questo Attacco (una per punto di Burst).
    window.lettereSagomaBS = function () {
        const M = window.MotoreN5; const n = parseInt(window.totalBurst, 10) || 0;
        const L = (M && M.LETTERE_SAGOMA) || ['A', 'B', 'C', 'D', 'E', 'F'];
        return n > 1 ? L.slice(0, n) : [];
    };
    window.toggleSagomaBS = function (i, L) {
        const t = window.combatTargets && window.combatTargets[i]; if (!t) return;
        t.sagome = Array.isArray(t.sagome) ? t.sagome.slice() : [];
        const k = t.sagome.indexOf(L);
        if (k >= 0) t.sagome.splice(k, 1); else t.sagome.push(L);
        t.sagome.sort();
        t.burst = t.sagome.length;
        window.renderTargetsAllocationBS();
    };
    window.adjustTargetBurstBS = function (i, delta) {
        // Sagoma: ogni bersaglio da 1 al Burst, indipendente dagli altri.
        const M = motore(); const arma = M && M.profiloArma(window.currentOrder.weapon);
        if (arma && arma.isTemplate) {
            const t = window.combatTargets[i];
            t.burst = Math.max(1, Math.min(window.totalBurst, (parseInt(t.burst, 10) || 1) + delta));
            return window.renderTargetsAllocationBS();
        }
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
        // 23 ottobre (Paolo, CO-10): in un Ordine Coordinato chi non soddisfa il
        // requisito fa un Idle DA SOLO, "while the others may act normally"
        // (righe 11374-11376). Prima l'Idle chiudeva tutto l'Ordine e saltava
        // anche il tiro della Punta. Ora la sua voce va nella busta a Burst 0,
        // col motivo, e si passa al prossimo partecipante.
        if (req.idle && !window.coordMode) return window.idleDaAttaccoBS();
        // SG-09: con le lettere ogni bersaglio deve stare sotto almeno una Sagoma.
        if (arma.isTemplate && window.lettereSagomaBS().length > 1) {
            const senza = window.combatTargets.filter(t => !(t.sagome || []).length).map(t => t.name);
            if (senza.length) return alert('⚠️ ' + senza.join(', ') + ': nessuna Sagoma accesa. Accendi le lettere delle Sagome che lo prendono, o togli il bersaglio.');
        }
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
            // SCOPRIRE + ATTACCO coordinato: il prossimo partecipante fissa il
            // SUO Scoprire e il SUO Attacco. Il Marker resta lo stesso.
            if (scEs) { scEs.busta = null; scEs.fatto = false; scEs.bersagliAttacco = null; window.currentOrder.attaccoSceltoPer = null; }
            return window.startUnitAllocationLoopBS();
        }

        // Porta unica verso l'Hub: valida tutto e BLOCCA se qualcosa non torna.
        // Copia PRIMA dell'invio: l'uscita dopo l'invio (app.html) azzera
        // coordPayloads e currentOrder (stessa cautela del Fuoco Speculativo).
        const inviatiBS = window.coordPayloads.slice();
        const ordineIdBS = window.currentOrder && window.currentOrder.id;
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

        // 27 ottobre (TEST, DEP-09): il Disco Baller si spara con un Attacco
        // BS (Targetless). Come nel Fuoco Speculativo, il segnalino nasce dal
        // SUCCESSO del tiro: si chiede al giocatore com'e` andata e lo si crea
        // con la stessa funzione (window.esitoDropBearBS, ordine_fuoco_speculativo).
        const lanciBS = inviatiBS.filter(p => p.arma && M.lancioConSegnalino && M.lancioConSegnalino(p.arma));
        if (lanciBS.length && typeof window.esitoDropBearBS === 'function' && typeof window.confirm === 'function') {
            window._dropBearInSospeso = { lanci: lanciBS.map(p => ({ unita: p.attaccante, arma: p.arma })), ordineId: ordineIdBS,
                                          nomeArma: String(lanciBS[0].arma.nome).replace(/ \(BS Mode\)/i, '') };
            const sosp = window._dropBearInSospeso;
            const si = window.confirm('🎯 ' + sosp.nomeArma + ': tira al tavolo.\n\nIl tiro è RIUSCITO?\n\nOK = sì, piazza il segnalino dove è caduto.\nAnnulla = no, fallito (l\'uso è comunque speso).');
            const esito = window.esitoDropBearBS(!!si);
            if (typeof window.alert === 'function') {
                window.alert(si ? ('✅ ' + sosp.nomeArma + ': segnalino piazzato' + (esito && esito.piazzati ? '' : ' (nessun segnalino creato: controlla il roster)') + '.')
                                : ('❌ ' + sosp.nomeArma + ': tiro fallito, nessun segnalino. L\'uso è comunque speso.'));
            }
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
    var v = { file: 'ordine_attacco_bs.js', versione: '2026-10-27.1', proprieta: 'MOTORE' };
    if (g.MotoreN5 && g.MotoreN5.dichiaraVersione) g.MotoreN5.dichiaraVersione(v.file, v.versione, v.proprieta);
    else { g.__versioniN5 = g.__versioniN5 || []; g.__versioniN5.push(v); }
})();
