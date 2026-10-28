// @versione 2026-10-28.4 | ordine_scoprire.js | proprieta`: chat MOTORE
// ==========================================
// 🔍 SCOPRIRE (N5) - ordine_scoprire.js
// ------------------------------------------
// MODULO NUOVO. Il router lo cercava — `window.avviaFaseScoprire` — e non
// lo trovava: l'ordine si fermava con un errore in console.
//
// Regole (wiki N5.3, pagina Discover):
//
//  - Tiro NORMALE su WIP con gli STESSI MOD di un BS Attack: Copertura,
//    gittata, Mimetismo. Non e` un tiro nudo come l'Attacco Intuitivo.
//  - Scoprire ha MOD di gittata PROPRI, la riga "SCOPRIRE" del Weapon
//    Chart: +3 / 0 / 0 / 0 / -3 / -3 / -6.
//  - Serve la LoF al bersaglio, e solo i Marker sono bersagli validi.
//  - Multispectral Visor L2+: contro lo Stato CAMO riesce
//    AUTOMATICAMENTE, senza tirare.
//  - Sensor: +6 WIP contro i Marker Mimetici.
//  - Fallendo non si puo` ritentare sullo stesso Marker fino al proprio
//    Turno successivo; su un Marker diverso si`.
//  - E` un'Abilita` Breve Base: si combina con un'altra Breve. La
//    combinazione classica e` Scoprire + Attacco.
// ==========================================

(function () {
    'use strict';

    function motore() {
        if (!window.MotoreN5) {
            alert('⛔ motore_regole_n5.js non è caricato: Scoprire non può funzionare.');
            return null;
        }
        return window.MotoreN5;
    }

    // 28 ottobre (Paolo): il colore e` dell'ORDINE, non del modulo (M.COLORI_ORDINE nel
    // motore: Movimenti blu, Abilita` Brevi verdi, Ordini Interi rossi). COL legge le
    // tinte dell'Ordine in corso a ogni uso; 'SCOPRIRE' e` quello di casa. Prima: { bordo: '#66ff66', sfondo: '#003300' };.
    const COL = (function () {
        const ripiego = { bordo: '#66ff66', sfondo: '#003300', riquadro: '#003300', tenue: '#66ff66', testo: '#66ff66' };
        const o = {};
        ['bordo', 'sfondo', 'riquadro', 'tenue', 'testo'].forEach(function (k) {
            Object.defineProperty(o, k, { enumerable: true, get: function () {
                const M = window.MotoreN5;
                return (M && typeof M.colOrdine === 'function') ? M.colOrdine('SCOPRIRE')[k] : ripiego[k];
            } });
        });
        return o;
    })();

    window.avviaFaseScoprire = function (actionId, isSecondHalf) {
        window.currentOrder = window.currentOrder || {};
        window.currentOrder.isSecondHalf = isSecondHalf;
        if (!isSecondHalf) window.currentOrder.action1 = actionId;
        window.currentOrder.action = actionId;
        window.currentOrder.weapon = 'SCOPRIRE';

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
            window.setupTargetSelectionScoprire();
        } else {
            window.preparaModificatoriScoprire();
        }
    };

    // ==============================================================
    // 1. BERSAGLIO: solo i Marker
    // ==============================================================
    window.setupTargetSelectionScoprire = function () {
        const M = motore(); if (!M) return;
        const unita = window.coordUnits[window.coordIndex];
        if (window.mostraTitoloUnitaCorrente) window.mostraTitoloUnitaCorrente();

        window.pendingTargets = [];
        const nemici = M.rosterNemico();
        if (nemici.length === 0) return alert('⚠️ Nessuna unità nemica sul tavolo.');

        // Il filtro è già nel motore: Scoprire è l'inverso del BS Attack,
        // solo i Marker sono bersagli validi.
        const giudizi = M.bersagliValidi(M.AZIONI.SCOPRIRE, nemici, { attaccante: unita });
        window.validTargets = M.soloAmmessi(giudizi);
        window.targetsScartati = giudizi.filter(g => !g.ammesso).map(g => ({ nome: g.nome, motivo: g.motivo }));

        const container = document.getElementById('enemy-target-buttons');

        window.MotoreN5.azzeraNote('step-wait-aro');
        if (!container) return;

        container.innerHTML = `${window.MotoreN5.intestazioneOrdine({ colore: COL, titolo: `SCOPRIRE`, nota: `Solo i Marker si possono Scoprire. Serve la Linea di Tiro.` })}`;

        if (window.validTargets.length === 0) {
            container.innerHTML += `<p style="color:var(--mn-errore,#ff3333); text-align:center; font-weight:bold;">Nessun Marker nemico sul tavolo.</p>`;
        } else {
            window.validTargets.forEach(function (u) {
                const nome = M.nomeUnita(u);
                const st = M.statoBersaglio(u);
                const tipo = st.camo ? 'Marker Mimetico' : st.imp ? 'Marker Impersonation' : 'Marker';
                // La riga con la FOTO della pedina la disegna la pagina
                // (window.rigaUnitaConFoto, chat INTERFACCIA, 7 ottobre): stessa
                // foto e stesso font degli altri elenchi. Dove la pagina non
                // c'e` (i banchi) resta il bottone semplice.
                const clic = `onclick="window.scegliBersaglioScoprire('${String(u.id).replace(/'/g, "\\'")}')"`;
                container.innerHTML += (typeof window.rigaUnitaConFoto === 'function')
                    ? window.rigaUnitaConFoto(u, { attributi: clic, fazione: 'NEMICA', sotto: `<span style="font-size:var(--fs-s); color:${COL.bordo};">${tipo}</span>` })
                    : `<button class="huge-btn" style="width:100%; min-height:60px; font-size:var(--fs-l); margin-bottom:6px; background:var(--mn-fondo-tasto,#111111); border-color:${COL.bordo};" ${clic}>
                    🔍 ${nome}<br><span style="font-size:var(--fs-s); color:${COL.bordo};">${tipo}</span></button>`;
            });
        }

        // 28 ottobre (Paolo): perche` non si puo`, nella ⓘ (o sotto il tasto).
        window.targetsScartati.forEach(t => window.MotoreN5.nota('step-wait-aro', t.nome + ' non scopribile', t.motivo, { tipo: 'nonpuo' }));

        window.goToStep('step-wait-aro');
    };

    window.scegliBersaglioScoprire = function (id) {
        const M = motore(); if (!M) return;
        const u = M.rosterNemico().find(x => String(x.id) === String(id));
        if (!u) return;
        // Un bersaglio solo: non si Scopre due volte nello stesso Ordine.
        window.combatTargets = [{
            id: u.id, name: M.nomeUnita(u), burst: 1, cover: false,
            rangeIndex: 0, rangeMod: 0, terrain: 'NESSUNO'
        }];
        window.pendingTargets = [u];
        // SCOPRIRE + ATTACCO (righe 6817-6829): il Marker scelto qui resta
        // scritto nell'Ordine, perche` l'Attacco BS della seconda meta` puo`
        // prenderlo a bersaglio e la busta porta tutte e due le Abilita`.
        // Lo Scoprire e` sempre la PRIMA meta` (Basic Short + Short).
        window.currentOrder.scoprire = window.currentOrder.isSecondHalf ? null
            : { bersaglio: Object.assign({}, window.combatTargets[0]), busta: null, poiAttacco: false, prosegui: null, etichetta: null };
        if (window.confirmMultiAro) window.confirmMultiAro(false);
        else window.preparaModificatoriScoprire();
    };

    // ==============================================================
    // 2. MODIFICATORI
    // ==============================================================
    window.preparaModificatoriScoprire = function () {
        const M = motore(); if (!M) return;
        const unita = window.coordUnits[window.coordIndex];
        if (window.mostraTitoloUnitaCorrente) window.mostraTitoloUnitaCorrente();

        if (!window.combatTargets || window.combatTargets.length === 0) {
            alert('⛔ Nessun Marker scelto.\n\nScoprire richiede un bersaglio in forma di Marker.');
            return window.setupTargetSelectionScoprire();
        }
        if (window.combatTargets.length > 1) window.combatTargets = [window.combatTargets[0]];

        const t = window.combatTargets[0];
        const arma = M.armaScoprire();
        if (typeof t.rangeIndex !== 'number' || t.rangeIndex < 0 || t.rangeIndex >= arma.bands.length) t.rangeIndex = 0;
        t.rangeMod = arma.bands.length ? arma.bands[t.rangeIndex].mod : 0;
        t.burst = 1;

        window.renderScoprire();
        window.goToStep('step-modifiers');
    };

    window.renderScoprire = function () {
        const M = motore(); if (!M) return;
        M.azzeraNote('step-modifiers');
        const unita = window.coordUnits[window.coordIndex];
        const t = window.combatTargets[0];
        const difTrovato = M.rosterNemico().find(u => String(u.id) === String(t.id)) || null;
        const dif = difTrovato || {};
        const arma = M.armaScoprire();
        // 🔴 8 ottobre. Il Marker che ha reagito con un ARO fra le due meta`
        // e` gia` un Modello: lo Scoprire non si tira, e la schermata non
        // deve mostrare WIP, gittata e copertura di un tiro che non c'e`.
        // Vale solo per lo Scoprire della prima meta` ripreso in seconda
        // (currentOrder.scoprire): li` l'ARO puo` essere gia` arrivato.
        const scCombinato = window.currentOrder && window.currentOrder.scoprire;
        const superato = (scCombinato && typeof M.scoprireSuperatoInPagina === 'function')
            ? M.scoprireSuperatoInPagina(difTrovato, { poiAttacco: !!(scCombinato.extraBusta ? scCombinato.extraBusta.poiAttacco : true) })
            : { superato: false };
        // 🔴 IL FIRETEAM VA DETTO ANCHE ALLA SCHERMATA. L'Hub lo conosce e
        // applica il +3 Discover del Livello 3; qui non lo si passava, e con
        // un Fireteam di Livello 3 o piu` la schermata restava 3 punti sotto
        // l'Hub. I membri attivi li da` fireteam.js, il livello lo calcola il
        // motore. (Revisione indipendente, 6 ottobre.)
        const membriFT = (window.fireteamManager && unita && unita.states && unita.states.fireteam)
            ? window.fireteamManager.getMembriAttivi(window.roster || [], unita.combatGroup, unita.states.fireteam) : [];
        const e = M.regoleScoprire(unita, dif, {
            rangeIndex: t.rangeIndex, cover: t.cover, terrain: t.terrain,
            fireteam: membriFT.length ? membriFT : undefined
        });
        window.scoprireEsito = e;

        // 18 ottobre (Paolo): il FUORI GITTATA e` un segmento della barra, e la
        // barra c'e` anche col successo automatico, perche` il FUORI si
        // dichiara li`. 28 ottobre: la barra e` del motore (M.barraGittata),
        // coi numeri sui confini.
        const barraGittata = `<div style="text-align:center; color:var(--mn-debole,#aaaaaa); font-size:var(--fs-xs); margin-bottom:5px;">Gittata (Scoprire ha bande proprie):</div>
                ${M.barraGittata(arma.bands, { indice: t.rangeIndex, tocco: (i) => `window.setRangeScoprire(${i})`,
                    fuori: 'window.toggleFuoriGittataScoprire()', fuoriAttivo: !!t.fuoriGittata, stile: '' })}`;

        let corpo;
        if (superato.superato) {
            corpo = `<div style="text-align:center; padding:20px; background:var(--mn-nota-fondo,#1a1000); border:2px solid var(--mn-attenzione,#ffcc00); border-radius:5px;">
                <b style="color:var(--mn-attenzione,#ffcc00); font-size:var(--fs-l);">SCOPRIRE: NON SI TIRA</b><br>
                <span style="color:var(--mn-nota-tenue,#cc9955); font-size:var(--fs-s);">${superato.testo}</span></div>`;
        } else if (e.automatico) {
            corpo = `<div style="text-align:center; padding:20px; background:var(--mn-si-fondo,#004400); border:2px solid var(--mn-si,#00ff00); border-radius:5px;">
                <b style="color:var(--mn-si,#00ff00); font-size:var(--fs-l);">✅ SUCCESSO AUTOMATICO</b><br>
                <span style="color:var(--mn-ordine-testo,#aaccaa); font-size:var(--fs-s);">${e.note[0]}</span></div>
                <div style="margin-top:12px;">${barraGittata}</div>`;
        } else {

            const dettaglio = e.voci.length
                ? e.voci.map(v => `<div style="display:flex; justify-content:space-between; padding:2px 0;">
                        <span style="color:var(--mn-debole,#aaaaaa);">${v.motivo}</span>
                        <b style="color:${v.valore >= 0 ? 'var(--mn-si,#00ff00)' : 'var(--mn-errore,#ff3333)'};">${v.valore > 0 ? '+' + v.valore : v.valore}</b></div>`).join('')
                : `<div style="color:var(--mn-spento,#888888); text-align:center;">Nessun modificatore</div>`;

            const stileCop = t.cover ? 'background:var(--nomad-orange); color:var(--mn-scuro,#000000);' : 'background:var(--mn-fondo-tasto,#111111); color:var(--mn-testo,#ffffff);';

            corpo = `
                <div style="background:var(--mn-si-fondo,#004400); border:1px solid var(--mn-si-bordo,#005500); padding:12px; border-radius:5px; margin-bottom:12px;">
                    <div style="text-align:center; color:var(--mn-testo,#ffffff); margin-bottom:8px;">
                        WIP ${e.base} → <b style="color:${COL.bordo}; font-size:var(--fs-l);">${e.valore}</b>
                        ${e.impossibile ? '<br><span style="color:var(--mn-errore,#ff3333); font-size:var(--fs-s);">Valore sotto 1: il tiro fallisce automaticamente</span>' : ''}
                    </div>
                    <div style="border-top:1px solid var(--mn-si-fondo,#004400); padding-top:8px; font-size:var(--fs-s);">${dettaglio}</div>
                    ${e.critici && !e.critici.nessunTiro ? `<div style="text-align:center; color:var(--mn-attenzione,#ffcc00); font-size:var(--fs-xs); margin-top:6px;">🎯 ${e.critici.testo}</div>` : ''}
                </div>
                ${barraGittata}
                <button class="huge-btn" style="width:100%; margin-top:12px; min-height:55px; font-size:var(--fs-m); ${stileCop}"
                    onclick="window.toggleCoverScoprire()">${t.cover ? `${(typeof window.iconaInterruttore === 'function') ? window.iconaInterruttore('coverSi') : ''}BERSAGLIO IN COPERTURA` : `${(typeof window.iconaInterruttore === 'function') ? window.iconaInterruttore('coverNo') : ''}BERSAGLIO ALLO SCOPERTO`}</button>`;
        }

        document.getElementById('targets-allocation-container').innerHTML = `
            ${window.MotoreN5.intestazioneOrdine({ colore: COL, titolo: `SCOPRIRE` })}
            <div class="target-card" style="border-left:4px solid ${COL.bordo}; background:rgba(0,255,0,0.04); padding:15px; border-radius:5px;">
                <b style="color:var(--mn-testo,#ffffff); font-size:var(--fs-l); display:block; margin-bottom:12px;">🔍 ${superato.superato ? (M.nomeUnita(difTrovato) || t.name) : t.name}</b>
                ${corpo}
                ${superato.superato ? '' : M.rigaRequisiti(['lof'], t, 0, 'window.toggleRequisitoScoprire')}
            </div>`;
        // 28 ottobre (Paolo): le note del tiro nella ⓘ (o sotto il tasto).
        if (!superato.superato) e.note.forEach(n => M.nota('step-modifiers', 'Scoprire', n, { tipo: 'regole' }));

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
            // In SCOPRIRE + ATTACCO questa schermata e` un PASSO: il tasto
            // porta ai modificatori dell'Attacco, e non spedisce niente.
            const sc = window.currentOrder.scoprire;
            if (sc && sc.poiAttacco) {
                nuovo.onclick = function () { window.confermaScoprirePoiAttacco(); };
                nuovo.innerText = sc.etichetta || 'AVANTI: ATTACCO BS';
                nuovo.style.background = M.COLORE_TASTO.valido;
            } else {
                M.tastoConRequisiti(nuovo, M.requisitiDichiarati([t], ['lof', 'gittata']), e.automatico ? 'SCOPRI (AUTOMATICO)' : 'ESEGUI TIRO DI SCOPERTA', function () { window.eseguiCalcoloScoprire(); });
            }
        }
    };

    window.setRangeScoprire = function (i) {
        const M = motore(); if (!M) return;
        const arma = M.armaScoprire();
        window.combatTargets[0].rangeIndex = i;
        window.combatTargets[0].rangeMod = arma.bands[i] ? arma.bands[i].mod : 0;
        window.combatTargets[0].fuoriGittata = false;     // scelta una fascia: in gittata
        window.renderScoprire();
    };
    // FUORI: lo stesso requisito 'gittata' (M.invertiRequisito), toccato
    // dalla barra. Ritoccato, torna in gittata.
    window.toggleFuoriGittataScoprire = function () { window.toggleRequisitoScoprire(0, 'gittata'); };
    window.toggleCoverScoprire = function () {
        window.combatTargets[0].cover = !window.combatTargets[0].cover;
        window.renderScoprire();
    };

    // ==============================================================
    // 3. INVIO
    // ==============================================================
    // Gli interruttori dei requisiti (Linea di Tiro, gittata, contatto...):
    // la regola e i testi stanno nel motore, M.REQUISITI_TAVOLO.
    window.toggleRequisitoScoprire = function (i, chiave) {
        const M = motore(); if (!M) return;
        if (M.invertiRequisito(window.combatTargets[i], chiave)) window.renderScoprire();
    };

    // La voce di busta dello Scoprire: una sola forma, per lo Scoprire da
    // solo e per SCOPRIRE + ATTACCO.
    window.bustaScoprire = function (extra) {
        const M = motore(); if (!M) return null;
        const e = window.scoprireEsito || {};
        return {
            attaccante: window.coordUnits[window.coordIndex],
            azione: M.AZIONI.SCOPRIRE,
            arma: M.armaScoprire(),
            bersagli: window.combatTargets.slice(0, 1),
            burstDisponibile: 1,
            regole: Object.assign({
                attributo: 'WIP',
                automatico: !!e.automatico,
                valoreSuccesso: e.valore,
                mod: e.mod,
                voci: e.voci,
                nonOffensivo: true,
                successo: e.successo
            }, extra || {})
        };
    };

    // SCOPRIRE + ATTACCO: lo Scoprire e` fissato (gittata, copertura, e se
    // la Linea di Tiro c'e`), e si passa ai modificatori dell'Attacco BS.
    // Se allo Scoprire manca il requisito non si tira: il Marker resta
    // Marker, e i dadi dell'Attacco assegnati a LUI si perdono (righe
    // 3111-3114); quelli su altri bersagli no.
    // Chi viene DOPO lo Scoprire lo dice in sc.prosegui (una funzione) e
    // sc.etichetta (il testo del tasto): l'Attacco BS, o Piazzare
    // Equipaggiamento. sc.extraBusta sono i campi di `regole` della voce:
    // { poiAttacco: true } lega l'esito a un Attacco, { giaDichiarato: true }
    // dice solo che lo Scoprire e` la prima meta` di una combinazione.
    window.confermaScoprirePoiAttacco = function () {
        const M = motore(); if (!M) return;
        const sc = window.currentOrder.scoprire; if (!sc) return;
        const req = M.requisitiDichiarati([window.combatTargets[0]], ['lof', 'gittata']);
        sc.bersaglio = Object.assign({}, window.combatTargets[0]);
        sc.requisitoMancante = req.idle ? req.motivo : null;
        sc.busta = req.idle ? null : window.bustaScoprire(sc.extraBusta || { poiAttacco: true });
        sc.fatto = true;
        if (typeof sc.prosegui === 'function') return sc.prosegui(req);
        window.combatTargets = sc.bersagliAttacco || [];
        window.combatTargets.forEach(function (t) {
            if (String(t.id) === String(sc.bersaglio.id)) t.nonScoperto = !!req.idle;
        });
        window.goToModifiersBS(window.currentOrder.action);
    };

    window.eseguiCalcoloScoprire = function () {
        const M = motore(); if (!M) return;
        const req = M.requisitiDichiarati([window.combatTargets[0]], ['lof', 'gittata']);
        if (req.idle) return M.idleDaRequisito(req);
        const unita = window.coordUnits[window.coordIndex];
        const e = window.scoprireEsito || {};

        window.coordPayloads.push(window.bustaScoprire());

        window.coordIndex++;
        if (window.coordIndex < window.coordUnits.length) {
            window.combatTargets = [];
            window.pendingTargets = [];
            return window.setupTargetSelectionScoprire();
        }

        const spedito = M.inviaCalcolo(window.coordPayloads, { isCoordinated: window.coordMode });
        if (!spedito) { window.coordIndex--; window.coordPayloads.pop(); return; }

        const calcDiv = document.getElementById('calc-result');
        if (calcDiv) {
            calcDiv.innerHTML = `
                <div style="text-align:center; padding:20px; border:2px solid ${COL.bordo}; background:rgba(0,255,0,0.1); margin-top:20px;">
                    <h2 style="color:${COL.bordo}; margin:0;">SCOPERTA INVIATA</h2>
                    <p style="font-size:var(--fs-xs); color:var(--mn-debole,#aaaaaa);">${e.automatico ? 'Successo automatico col Multispectral Visor.' : 'Tiro WIP in corso...'}</p>
                </div>`;
            calcDiv.style.display = 'block';
        }
    };

    console.log('🔍 ordine_scoprire.js caricato.');
})();


// Dichiarazione di versione per il controllo incrociato fra chat.
// Funziona anche se questo file si carica PRIMA del motore: in quel
// caso la versione resta in coda e il motore la raccoglie all'avvio.
(function () {
    var g = (typeof window !== 'undefined') ? window : globalThis;
    var v = { file: 'ordine_scoprire.js', versione: '2026-10-28.4', proprieta: 'MOTORE' };
    if (g.MotoreN5 && g.MotoreN5.dichiaraVersione) g.MotoreN5.dichiaraVersione(v.file, v.versione, v.proprieta);
    else { g.__versioniN5 = g.__versioniN5 || []; g.__versioniN5.push(v); }
})();
