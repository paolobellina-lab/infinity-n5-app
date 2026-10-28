// @versione 2026-10-28.3 | ordine_osservazione.js | proprieta`: chat MOTORE
// ==========================================
// 👁️ OSSERVAZIONE (N5) - ordine_osservazione.js
// ------------------------------------------
// Tre azioni che si somigliano SOLO NEL NOME:
//
//   FORWARD OBSERVER    Abilità Breve / ARO · WIP · serve la LoF
//                       Non infligge danno: impone lo Stato Bersagliato
//
//   SENSOR              Abilità Breve · WIP+6 · NESSUNA LoF
//                       Nessun MOD di gittata né di Mimetismo
//                       Nessun bersaglio da designare: li Scopre TUTTI
//                       insieme dentro la Zona di Controllo
//
//   TRIANGULATED FIRE   Ordine Intero · BS · serve la LoF
//                       NESSUN MOD al tiro, tranne quelli al Burst
//                       Non supera la Gittata Massima dell'arma
//
// Tipo di ordine, attributo, bersagli, MOD e perfino la necessità della
// LoF sono diversi in tutte e tre. Un percorso solo avrebbe sbagliato due
// casi su tre, quindi il modulo si dirama subito.
// ==========================================

(function () {
    'use strict';

    function motore() {
        if (!window.MotoreN5) {
            alert('⛔ motore_regole_n5.js non è caricato: l\'osservazione non può funzionare.');
            return null;
        }
        return window.MotoreN5;
    }

    // 28 ottobre (Paolo): il colore e` dell'ORDINE, non del modulo (M.COLORI_ORDINE nel
    // motore: Movimenti blu, Abilita` Brevi verdi, Ordini Interi rossi). COL legge le
    // tinte dell'Ordine in corso a ogni uso; 'FORWARD OBSERVER' e` quello di casa. Prima: { bordo: '#66ddcc', sfondo: '#0d2a28' };.
    const COL = (function () {
        const ripiego = { bordo: '#66ddcc', sfondo: '#0d2a28', riquadro: '#0d2a28', tenue: '#66ddcc', testo: '#66ddcc' };
        const o = {};
        ['bordo', 'sfondo', 'riquadro', 'tenue', 'testo'].forEach(function (k) {
            Object.defineProperty(o, k, { enumerable: true, get: function () {
                const M = window.MotoreN5;
                return (M && typeof M.colOrdine === 'function') ? M.colOrdine('FORWARD OBSERVER')[k] : ripiego[k];
            } });
        });
        return o;
    })();

    window.avviaFaseOsservazione = function (actionId, isSecondHalf) {
        const M = motore(); if (!M) return;
        window.currentOrder = window.currentOrder || {};
        window.currentOrder.action = actionId;
        if (!isSecondHalf) window.currentOrder.action1 = actionId;
        window.currentOrder.isLongSkill = (actionId === M.AZIONI.TRIANGULATED);

        const ripresa = M.riprendiOrdineDaFinestra(actionId, isSecondHalf);
        if (!ripresa.riprende) {
            if (isSecondHalf) console.log('↩️ ' + ripresa.motivo);
            window.coordIndex = 0;
            window.coordPayloads = [];
            window.combatTargets = [];
            window.pendingTargets = [];
            window.osservazioneArma = null;
            window.avviaPassoOsservazione();
        } else {
            window.renderOsservazione();
        }
    };

    window.avviaPassoOsservazione = function () {
        const M = motore(); if (!M) return;
        const azione = window.currentOrder.action;

        // 🔴 Il Sensor non designa bersagli: si salta direttamente al tiro.
        if (azione === M.AZIONI.SENSOR) return window.renderOsservazione();
        // Il Triangulated Fire serve un'arma BS.
        if (azione === M.AZIONI.TRIANGULATED) return window.mostraArmiTriangulated();
        // Il Forward Observer ha un'arma sua. Si scrive nell'Ordine, perche`
        // dopo l'ARO la ripresa (M.riprendiOrdineDaFinestra) la ritrovi.
        window.currentOrder.weapon = 'Forward Observer';
        return window.setupBersagliOsservazione();
    };

    // ==============================================================
    // 1a. TRIANGULATED FIRE: quale arma
    // ==============================================================
    window.mostraArmiTriangulated = function () {
        const M = motore(); if (!M) return;
        const unita = window.coordUnits[window.coordIndex];
        if (window.mostraTitoloUnitaCorrente) window.mostraTitoloUnitaCorrente();

        // 2026-10-12: armiDisponibili restituisce un ARRAY, non { armi, escluse }.
        // Leggere e.armi dava undefined e il Triangulated non offriva nessuna
        // arma (il test guardava solo che la pagina non fosse vuota, e la
        // intestazione bastava). Le voci senza scheda vanno fra gli scarti.
        const lista = M.armiDisponibili(unita, M.AZIONI.BS_ATTACK) || [];
        const e = { armi: lista.filter(a => !a.nonTrovata),
                    escluse: lista.filter(a => a.nonTrovata).map(a => ({ nome: a.nomeRichiesto || a.nome, motivo: 'non presente nel database armi' })) };
        window.targetsScartati = (e.escluse || []).map(x => ({ nome: x.nome || x, motivo: x.motivo || '' }));

        const container = document.getElementById('weapon-buttons-container');

        window.MotoreN5.azzeraNote('step-weapon');
        if (!container) return;
        container.innerHTML = `${window.MotoreN5.intestazioneOrdine({ colore: COL, titolo: `TRIANGULATED FIRE`, nota: `Ordine Intero. Nessun MOD al tiro,<br> tranne quelli che toccano il Burst.` })}`;

        // 18 ottobre (Paolo): la stessa grafica dell'Attacco BS — il bottone
        // approvato (M.bottoneArma) — invece dei bottoni col solo nome.
        (e.armi || []).forEach(function (a) {
            const nomeEsc = String(a.nomeRichiesto || a.nome).replace(/'/g, "\\'");
            container.innerHTML += (typeof M.bottoneArma === 'function')
                ? M.bottoneArma(a, { attributi: `onclick="window.scegliArmaTriangulated('${nomeEsc}')"` })
                : `<button class="huge-btn" style="width:100%; min-height:58px; font-size:var(--fs-m); margin-bottom:6px; background:var(--mn-fondo-tasto,#111111); border-color:${COL.bordo};"
                    onclick="window.scegliArmaTriangulated('${nomeEsc}')">🎯 ${a.nome}</button>`;
        });
        window.goToStep('step-weapon');
    };

    window.scegliArmaTriangulated = function (nomeGrezzo) {
        window.osservazioneArma = nomeGrezzo;
        window.currentOrder.weapon = nomeGrezzo;
        window.setupBersagliOsservazione();
    };

    // ==============================================================
    // 1b. I BERSAGLI (non per il Sensor)
    // ==============================================================
    window.setupBersagliOsservazione = function () {
        const M = motore(); if (!M) return;
        const unita = window.coordUnits[window.coordIndex];
        const azione = window.currentOrder.action;
        if (window.mostraTitoloUnitaCorrente) window.mostraTitoloUnitaCorrente();

        const nemici = M.rosterNemico();
        const giudizi = M.bersagliValidi(azione, nemici, { attaccante: unita });
        window.validTargets = M.soloAmmessi(giudizi);
        window.targetsScartati = giudizi.filter(g => !g.ammesso).map(g => ({ nome: g.nome, motivo: g.motivo }));

        const fo = (azione === M.AZIONI.FORWARD_OBSERVER);
        const container = document.getElementById('enemy-target-buttons');
        window.MotoreN5.azzeraNote('step-wait-aro');
        if (!container) return;
        // 18 ottobre (Paolo): la pagina dei bersagli e` quella dell'Attacco BS
        // — le righe con la foto (window.renderTargetButtons) e il tasto
        // CONFERMA BERSAGLI, che manda l'allarme ARO e aspetta la risposta.
        // Prima qui c'erano bottoni col solo nome, e toccandone uno si andava
        // al tiro SENZA allarme: l'avversario non reagiva mai.
        if (typeof window.renderTargetButtons === 'function' && typeof window.confirmMultiAro === 'function') {
            window.pendingTargets = [];
            window.renderTargetButtons();
            // 28 ottobre (Paolo): perche` non si puo`, nella ⓘ (o sotto il tasto).
            window.targetsScartati.forEach(t => window.MotoreN5.nota('step-wait-aro', t.nome + ' non bersagliabile', t.motivo, { tipo: 'nonpuo' }));
            return window.goToStep('step-wait-aro');
        }
        container.innerHTML = `${window.MotoreN5.intestazioneOrdine({ colore: COL, titolo: `${fo ? 'FORWARD OBSERVER' : 'TRIANGULATED FIRE'}`, nota: `${fo ? 'Serve la Linea di Tiro.<br>Non infligge danno: impone lo Stato Bersagliato.' : 'Serve la Linea di Tiro.'}` })}`;

        if (window.validTargets.length === 0) {
            container.innerHTML += `<p style="color:var(--mn-errore,#ff3333); text-align:center; font-weight:bold;">Nessun bersaglio valido.</p>`;
        } else {
            window.validTargets.forEach(function (u) {
                container.innerHTML += `<button class="huge-btn" style="width:100%; min-height:58px; font-size:var(--fs-m); margin-bottom:6px; background:var(--mn-fondo-tasto,#111111); border-color:${COL.bordo};"
                    onclick="window.scegliBersaglioOsservazione('${String(u.id).replace(/'/g, "\\'")}')">
                    ${fo ? '👁️' : '🎯'} ${M.nomeUnita(u)}</button>`;
            });
        }
        // 28 ottobre (Paolo): perche` non si puo`, nella ⓘ (o sotto il tasto).
        window.targetsScartati.forEach(t => window.MotoreN5.nota('step-wait-aro', t.nome + ' non bersagliabile', t.motivo, { tipo: 'nonpuo' }));
        window.goToStep('step-wait-aro');
    };

    window.scegliBersaglioOsservazione = function (id) {
        const M = motore(); if (!M) return;
        const u = M.rosterNemico().find(x => String(x.id) === String(id));
        if (!u) return;
        window.combatTargets = [{ id: u.id, name: M.nomeUnita(u), burst: 1, cover: false,
                                  rangeIndex: 0, rangeMod: 0, terrain: 'NESSUNO' }];
        window.pendingTargets = [u];
        window.renderOsservazione();
    };

    // ==============================================================
    // 2. IL TIRO
    // ==============================================================
    function titoloAzione(a) { return String(a || '').toUpperCase(); }

    window.renderOsservazione = function () {
        const M = motore(); if (!M) return;
        const unita = window.coordUnits[window.coordIndex];
        const azione = window.currentOrder.action;
        let e, corpo = '', titolo = '', carta = '';

        if (azione === M.AZIONI.SENSOR) {
            e = M.regoleSensor(unita, M.rosterNemico());
            titolo = 'SENSOR';
            if (e.valido) {
                corpo = `<div style="margin-top:12px; padding:12px; background:var(--mn-ordine-riquadro,#0d2a28); border:1px solid ${COL.bordo}; border-radius:5px;">
                    <div style="color:${COL.bordo}; font-size:var(--fs-s); margin-bottom:8px;">Un tiro solo, e li Scopre TUTTI:</div>
                    ${e.bersagli.length
                        ? e.bersagli.map(b => `<div style="color:var(--mn-testo,#ffffff); font-size:var(--fs-m);">👁️ ${b.nome}</div>`).join('')
                        : '<div style="color:var(--mn-errore-testo,#ff9999); font-size:var(--fs-s);">Nessun nemico Nascosto o in CAMO nella ZdC.</div>'}
                </div>`;
            }
        } else {
            // Un bersaglio solo: dalla pagina dei bersagli possono arrivarne
            // piu` d'uno, e vale il primo.
            if ((window.combatTargets || []).length > 1) {
                alert('⚠️ ' + titoloAzione(azione) + ' ha un bersaglio solo: vale il primo scelto, ' + window.combatTargets[0].name + '.');
                window.combatTargets = [window.combatTargets[0]];
                window.pendingTargets = (window.pendingTargets || []).slice(0, 1);
            }
            const t = (window.combatTargets || [])[0];
            if (!t) { alert('⛔ Nessun bersaglio scelto.'); return window.setupBersagliOsservazione(); }
            const bers = (window.pendingTargets || [])[0] || {};

            if (azione === M.AZIONI.FORWARD_OBSERVER) {
                e = M.regoleForwardObserver(unita, bers, { rangeIndex: t.rangeIndex, cover: t.cover,
                                                          coordMode: window.coordMode, indiceCoord: window.coordIndex });
                titolo = 'FORWARD OBSERVER';
                if (e.valido) {
                    // 18 ottobre (OSS-01): il Burst dell'arma, non 1 fisso.
                    t.burst = e.burst || 1;
                    carta = window.cartaBersaglioOsservazione(t, e.arma);
                    corpo = `<div style="margin-top:12px; padding:12px; background:var(--mn-nota-fondo,#1a1000); border:1px solid var(--mn-nota-bordo,#664400); border-radius:5px; text-align:center;">
                            <b style="color:var(--mn-acceso,#ffaa33); font-size:var(--fs-m);">⚠️ NON INFLIGGE DANNO</b>
                            <div style="color:var(--mn-nota-testo,#ffcc66); font-size:var(--fs-s); margin-top:6px;">Il bersaglio entra in Stato Bersagliato: nessun Tiro Salvezza.</div>
                        </div>`;
                }
            } else {
                const arma = M.profiloArma(window.osservazioneArma || window.currentOrder.weapon);
                e = M.regoleTriangulated(unita, bers, arma, { rangeIndex: t.rangeIndex, cover: t.cover });
                titolo = 'TRIANGULATED FIRE';
                // Dalla pagina dei bersagli il bersaglio arriva senza dadi:
                // un dado, come prima (burstDisponibile 1).
                if (!t.burst) t.burst = 1;
                if (e.valido) {
                    // Il Triangulated ignora la Copertura (riga 10340): niente tasto.
                    t.cover = false;
                    carta = window.cartaBersaglioOsservazione(t, arma, { senzaCopertura: true });
                    corpo = 
                        (e.modIgnorati.length
                            ? `<div style="margin-top:12px; padding:12px; background:var(--mn-ordine-riquadro,#0d2a28); border:1px solid ${COL.bordo}; border-radius:5px;">
                                <div style="color:${COL.bordo}; font-size:var(--fs-s); margin-bottom:6px;">MOD ignorati dal Triangulated Fire:</div>
                                ${e.modIgnorati.map(v => `<div style="display:flex; justify-content:space-between; color:var(--mn-spento,#888888); font-size:var(--fs-s);">
                                    <span style="text-decoration:line-through;">${v.motivo}</span>
                                    <b style="text-decoration:line-through;">${v.valore > 0 ? '+' : ''}${v.valore}</b></div>`).join('')}
                                <div style="color:var(--mn-debole,#aaaaaa); font-size:var(--fs-xs); margin-top:8px;">Senza questa Abilità il tiro sarebbe ${e.valoreConMod}.</div>
                            </div>` : '')
                        + (e.oltreGittata ? `<div style="margin-top:10px; padding:10px; background:var(--mn-errore-fondo,#330000); border:1px solid var(--mn-errore,#ff3333); border-radius:4px; color:var(--mn-errore-testo,#ff9999); font-size:var(--fs-s);">
                            ⛔ Oltre la Gittata Massima dell'arma: il Triangulated Fire non lo permette.</div>` : '');
                }
            }
        }

        window.osservazioneEsito = e;
        const container = document.getElementById('targets-allocation-container');
        window.MotoreN5.azzeraNote('step-modifiers');
        if (!container) return;

        if (!e || !e.valido) {
            container.innerHTML = `<div style="padding:16px; text-align:center; background:var(--mn-errore-fondo,#330000); border:1px solid var(--mn-errore-bordo,#883333); border-radius:5px;">
                <b style="color:var(--mn-errore,#ff3333);">${titolo || 'OSSERVAZIONE'} NON DISPONIBILE</b>
                <div style="color:var(--mn-testo-2,#cccccc); font-size:var(--fs-s); margin-top:8px;">${(e && e.motivo) || 'Azione non valida.'}</div></div>`;
            window.aggiornaPulsanteOsservazione(true);
            return window.goToStep('step-modifiers');
        }

        const dettaglio = e.voci.map(v => `<div style="display:flex; justify-content:space-between; padding:2px 0;">
                <span style="color:var(--mn-debole,#aaaaaa);">${v.motivo}</span>
                <b style="color:${v.valore >= 0 ? 'var(--mn-si,#00ff00)' : 'var(--mn-errore,#ff3333)'};">${v.fonte === 'base' ? '' : (v.valore > 0 ? '+' + v.valore : v.valore)}</b></div>`).join('');

        // 19 ottobre (Paolo): Forward Observer e Triangulated hanno la scheda
        // del bersaglio dell'Attacco BS (cartaBersaglioOsservazione) in
        // cima, e sotto il riquadro del tiro. Il Sensor non ha bersaglio:
        // resta com'era.
        const inCima = carta, sotto = corpo;
        container.innerHTML = `
            ${window.MotoreN5.intestazioneOrdine({ colore: COL, titolo: titolo })}
            ${inCima}
            <div class="riquadro-tiro" style="background:var(--mn-ordine-riquadro,#0d2018); border:1px solid var(--mn-ordine-tenue,#2a5550); padding:12px; border-radius:5px; margin-top:${inCima ? '10px' : '0'};">
                <div style="text-align:center; color:var(--mn-testo,#ffffff); margin-bottom:8px;">
                    ${e.attributo} ${e.base} → <b style="color:${COL.bordo}; font-size:var(--fs-l);">${e.valore}</b>
                    ${e.impossibile ? '<br><span style="color:var(--mn-errore,#ff3333); font-size:var(--fs-s);">Valore sotto 1: il tiro fallisce automaticamente</span>' : ''}
                </div>
                <div style="border-top:1px solid var(--mn-ordine-tenue,#1a4440); padding-top:8px; font-size:var(--fs-s);">${dettaglio}</div>
                ${e.critici && !e.critici.nessunTiro ? `<div style="text-align:center; color:var(--mn-attenzione,#ffcc00); font-size:var(--fs-xs); margin-top:6px;">🎯 ${e.critici.testo}</div>` : ''}
            </div>
            ${sotto}`;
        // 28 ottobre (Paolo): le note del tiro nella ⓘ (o sotto il tasto).
        e.note.forEach(n => window.MotoreN5.nota('step-modifiers', titolo, n, { tipo: 'regole' }));

        window.aggiornaPulsanteOsservazione(false);
        window.goToStep('step-modifiers');
    };

    window.barraGittata = function (arma, t, callback) {
        if (!arma || !arma.bands || !arma.bands.length) return '';
        // 18 ottobre (Paolo): il FUORI GITTATA e` un segmento della barra.
        // 28 ottobre: la barra e` del motore (M.barraGittata), coi numeri sui confini.
        return window.MotoreN5.barraGittata(arma.bands, { indice: t.rangeIndex, tocco: (i) => `${callback}(${i})`,
            fuori: 'window.toggleFuoriGittataOsservazione()', fuoriAttivo: !!t.fuoriGittata });
    };

    // 19 ottobre (Paolo): LA SCHEDA DEL BERSAGLIO, come nell'Attacco BS
    // (ordine_attacco_bs.js, renderTargetsAllocationBS): bordo a sinistra
    // della fazione, nome del bersaglio e Burst in alto, barra delle gittate
    // col FUORI in coda, e sotto i due tasti COPERTURA | LINEA DI TIRO. Il
    // Burst non si divide (un bersaglio solo): si mostra e basta.
    //   opz.senzaCopertura: niente tasto COPERTURA (Triangulated Fire: "without
    //   applying any MODs to the Roll (Range, Cover, ...)", riga 10340).
    //   Nel Forward Observer la Copertura vale: e` un Attacco BS (Tratto
    //   BS Weapon (WIP)) e il motore la applica (modAttacco).
    window.cartaBersaglioOsservazione = function (t, arma, opz) {
        opz = opz || {};
        const M = motore(); if (!M) return '';
        const nomadi = document.title.includes('NOMADS');
        const bordo = nomadi ? 'var(--nomad-red)' : 'var(--nomad-orange)';
        const sfondo = nomadi ? '#1a0000' : '#001122';
        const STILE_SI = M.stileColore('si');
        const STILE_NO = M.stileColore('attenzione');
        const RQ = (M.REQUISITI_TAVOLO || {}).lof || {};
        const noLoF = M.requisitoManca(t, 'lof');
        const icona = (k) => (typeof window.iconaInterruttore === 'function') ? window.iconaInterruttore(k) : '';
        const coverStyle = t.cover ? 'background:var(--nomad-orange); color:var(--mn-scuro,#000000);' : `background:${sfondo}; color:var(--mn-testo,#ffffff);`;
        return `
            <div class="target-card" style="border-left: 4px solid ${bordo}; margin-bottom: 10px; background: rgba(255,255,255,0.03); padding: 15px; overflow: hidden;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                    <b style="color:var(--nomad-orange); font-size:var(--fs-l);">${t.name || 'Bersaglio'}</b>
                    <div class="burst-ctrl"><span style="font-size:var(--fs-l); font-weight:bold; color:var(--mn-si,#00ff00);">Burst <b style="color:var(--mn-si,#00ff00);">${t.burst || 1}</b></span></div>
                </div>
                ${window.barraGittata(arma, t, 'window.setRangeOsservazione')}
                <div style="display:flex; gap:10px; margin-top: 15px;">
                    ${opz.senzaCopertura ? '' : `<button class="huge-btn" style="flex:1; margin:0; min-height:55px; font-size:var(--fs-m); ${coverStyle}" onclick="window.toggleCoperturaOsservazione()">${t.cover ? icona('coverSi') + 'IN COPERTURA' : icona('coverNo') + 'NO COPERTURA'}</button>`}
                    <button class="huge-btn" style="flex:1; margin:0; min-height:55px; font-size:var(--fs-m); ${noLoF ? STILE_NO : STILE_SI}" onclick="window.toggleRequisitoOsservazione(0, 'lof')">${noLoF ? (RQ.no || 'LINEA DI TIRO NO') : (RQ.si || 'LINEA DI TIRO SÌ')}</button>
                </div>
            </div>`;
    };
    window.toggleCoperturaOsservazione = function () {
        const t = (window.combatTargets || [])[0]; if (!t) return;
        t.cover = !t.cover;
        window.renderOsservazione();
    };

    window.setRangeOsservazione = function (i) {
        const M = motore(); if (!M) return;
        const azione = window.currentOrder.action;
        const arma = (azione === M.AZIONI.FORWARD_OBSERVER)
            ? M.armaForwardObserver ? M.armaForwardObserver() : M.profiloArma('Forward Observer')
            : M.profiloArma(window.osservazioneArma || window.currentOrder.weapon);
        window.combatTargets[0].rangeIndex = i;
        window.combatTargets[0].rangeMod = (arma.bands && arma.bands[i]) ? arma.bands[i].mod : 0;
        window.combatTargets[0].fuoriGittata = false;     // scelta una fascia: in gittata
        window.renderOsservazione();
    };
    // FUORI: lo stesso requisito 'gittata' (M.invertiRequisito), dalla barra.
    window.toggleFuoriGittataOsservazione = function () { window.toggleRequisitoOsservazione(0, 'gittata'); };

    window.aggiornaPulsanteOsservazione = function (disabilitato) {
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
        // Il tasto diventa IDLE se manca la Linea di Tiro o la gittata.
        const M = motore();
        const req = (M && !disabilitato) ? window.requisitiOsservazione() : null;
        if (M && req) M.tastoConRequisiti(nuovo, req, 'ESEGUI TIRO', function () { window.eseguiOsservazione(); });
        else { nuovo.onclick = function () {}; nuovo.innerText = 'NON DISPONIBILE'; }
    };

    // ==============================================================
    // 3. INVIO
    // ==============================================================
    // Il Sensor non designa bersagli: nessun requisito da dichiarare.
    window.requisitiOsservazione = function () {
        const M = motore(); if (!M) return null;
        const t = (window.currentOrder.action === M.AZIONI.SENSOR) ? [] : (window.combatTargets || []).slice(0, 1);
        return M.requisitiDichiarati(t, ['lof', 'gittata']);
    };
    // Gli interruttori dei requisiti (Linea di Tiro, gittata, contatto...):
    // la regola e i testi stanno nel motore, M.REQUISITI_TAVOLO.
    window.toggleRequisitoOsservazione = function (i, chiave) {
        const M = motore(); if (!M) return;
        if (M.invertiRequisito(window.combatTargets[i], chiave)) window.renderOsservazione();
    };

    window.eseguiOsservazione = function () {
        const M = motore(); if (!M) return;
        const req = window.requisitiOsservazione();
        if (req && req.idle) return M.idleDaRequisito(req);
        const unita = window.coordUnits[window.coordIndex];
        const azione = window.currentOrder.action;
        const e = window.osservazioneEsito;
        if (!e || !e.valido) return alert('⛔ ' + ((e && e.motivo) || 'Azione non valida.'));

        window.coordPayloads.push({
            attaccante: unita,
            azione: azione,
            arma: e.arma || null,
            bersagli: (azione === M.AZIONI.SENSOR) ? [] : window.combatTargets,
            burstDisponibile: (azione === M.AZIONI.FORWARD_OBSERVER) ? (e.burst || 1) : 1,
            regole: {
                attributo: e.attributo,
                valoreSuccesso: e.valore,
                base: e.base, mod: e.mod, voci: e.voci,
                // Forward Observer: nessun danno, uno Stato.
                statoInflitto: e.statoInflitto || null,
                nonOffensivo: !!e.statoInflitto || azione === M.AZIONI.SENSOR,
                // Sensor: un tiro, molti scoperti.
                scopreTutti: !!e.scopreTutti,
                scoperti: e.bersagli || null,
                // Triangulated: quali MOD sono stati ignorati.
                modIgnorati: e.modIgnorati || null,
                note: e.note
            }
        });

        window.coordIndex++;
        if (window.coordIndex < window.coordUnits.length) {
            window.combatTargets = [];
            window.pendingTargets = [];
            window.osservazioneArma = null;
            return window.avviaPassoOsservazione();
        }

        // 18 ottobre (Paolo, OSS-02): il Sensor non passa dalla scelta dei
        // bersagli, dove parte l'allarme ARO degli altri ordini, e cosi`
        // l'avversario non poteva reagire. Ogni Ordine attiva la truppa e
        // genera ARO: l'allarme si manda qui, e l'Hub aspetta la risposta.
        let aroAtteso;
        if (azione === M.AZIONI.SENSOR && !window.currentOrder.isSecondHalf) {
            const al = M.allarmeOrdine(azione, { unita: unita, coordUnits: window.coordUnits, coordMode: window.coordMode });
            if (al.payload && typeof window.inviaAllarmeAro === 'function') window.inviaAllarmeAro(al.payload);
            aroAtteso = !!(al.aro && al.aro.genera);
        }
        const spedito = M.inviaCalcolo(window.coordPayloads, aroAtteso === undefined ? { isCoordinated: window.coordMode }
                                                                                   : { isCoordinated: window.coordMode, aroAtteso: aroAtteso });
        if (!spedito) { window.coordIndex--; window.coordPayloads.pop(); return; }
    };

    console.log('👁️ ordine_osservazione.js caricato.');
})();

// Dichiarazione di versione per il controllo incrociato fra chat.
(function () {
    var g = (typeof window !== 'undefined') ? window : globalThis;
    var v = { file: 'ordine_osservazione.js', versione: '2026-10-28.3', proprieta: 'MOTORE' };
    if (g.MotoreN5 && g.MotoreN5.dichiaraVersione) g.MotoreN5.dichiaraVersione(v.file, v.versione, v.proprieta);
    else { g.__versioniN5 = g.__versioniN5 || []; g.__versioniN5.push(v); }
})();
