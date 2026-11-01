// @versione 2026-11-01.1 | ordine_difesa.js | proprieta`: chat MOTORE
// ==========================================
// 🛡️ DIFESA: SCHIVATA, RESET E SOPPRESSIONE - ordine_difesa.js
// ------------------------------------------
// RISCRITTO sopra MotoreN5. Solo interfaccia: le regole stanno nel motore.
//
// Correzioni rispetto alla versione precedente:
//
//  1. IL FUOCO DI SOPPRESSIONE NON SCEGLIEVA UN'ARMA. Attivava lo stato e
//     basta. La regola: serve un'arma col Tratto "Suppressive Fire", e il
//     suo profilo viene SOSTITUITO dalla SF Mode, che cambia gittata e
//     Burst (B3) ma NON PS, munizioni e Tratti. Il payload verso l'Hub non
//     conteneva niente di tutto questo.
//
//  2. IL BURST IN ARO È 3 E VA SU UN BERSAGLIO SOLO. Non si divide fra più
//     nemici attivi, nemmeno reagendo a un Ordine Coordinato.
//
//  3. I VALORI DI SCHIVATA E RESET NON ERANO CALCOLATI. La schermata
//     mostrava PH o WIP grezzi e applicava il -3 solo nel testo; il payload
//     spediva un'arma finta con bands:[{mod:malusLoF}].
//
//  4. LE CAUSE DI CANCELLAZIONE erano una sola (nuova attivazione). Sono
//     sette: Ordine dichiarato, ARO diverso da BS con SF Mode, arma non
//     idonea, Stato Nullo, Accecato, Ingaggiato, Immobilizzato, Isolato,
//     Ritirata!
// ==========================================

(function () {
    'use strict';

    function motore() {
        if (!window.MotoreN5) {
            alert('⛔ motore_regole_n5.js non è caricato: le azioni difensive non possono funzionare.');
            return null;
        }
        return window.MotoreN5;
    }

    // 28 ottobre (Paolo): il colore e` dell'ORDINE, non del modulo (M.COLORI_ORDINE nel
    // motore: Movimenti blu, Abilita` Brevi verdi, Ordini Interi rossi). COL legge le
    // tinte dell'Ordine in corso a ogni uso; 'SCHIVATA' e` quello di casa. Prima: { bordo: '#00ffff', fuoco: '#ff6600' };.
    const COL = (function () {
        const ripiego = { bordo: '#00ffff', sfondo: '#111111', riquadro: '#111111', tenue: '#00ffff', testo: '#00ffff' };
        const o = {};
        ['bordo', 'sfondo', 'riquadro', 'tenue', 'testo'].forEach(function (k) {
            Object.defineProperty(o, k, { enumerable: true, get: function () {
                const M = window.MotoreN5;
                return (M && typeof M.colOrdine === 'function') ? M.colOrdine('SCHIVATA')[k] : ripiego[k];
            } });
        });
        return o;
    })();

    window.avviaFaseDifesa = function (actionId, isSecondHalf) {
        window.currentOrder = window.currentOrder || {};
        window.currentOrder.isSecondHalf = isSecondHalf;
        if (!isSecondHalf) window.currentOrder.action1 = actionId;
        window.currentOrder.action = actionId;

        window.currentOrder.weapon = 'NESSUNA';
        window.combatTargets = [];

        if (!isSecondHalf) {
            // Prima metà: scatta l'allarme ARO senza bersagli.
            if (window.confirmMultiAro) window.confirmMultiAro(true);
        } else {
            window.preparaModificatoriDifesa(actionId);
        }
    };

    // ==============================================================
    // SCHIVATA E RESET
    // ==============================================================
    window.preparaModificatoriDifesa = function (actionId) {
        const M = motore(); if (!M) return;
        if (window.mostraTitoloUnitaCorrente) window.mostraTitoloUnitaCorrente();

        const schivata = (actionId === 'SCHIVATA');
        const nome = schivata ? 'SCHIVATA' : 'RESET';
        const container = document.getElementById('targets-allocation-container');
        window.MotoreN5.azzeraNote('step-modifiers');

        let html = `${window.MotoreN5.intestazioneOrdine({ colore: COL, titolo: `${nome}` })}`;

        window.coordUnits.forEach(function (u, index) {
            if (!u.difesaOpts) u.difesaOpts = { hasLoF: true, controSagoma: false };

            const membriFT = (window.fireteamManager && u.states && u.states.fireteam)
                ? window.fireteamManager.getMembriAttivi(window.roster || [], u.combatGroup, u.states.fireteam).length
                : 0;

            const esito = schivata
                ? M.modSchivata(u, {
                      haLoFVersoAttaccante: u.difesaOpts.hasLoF,
                      controSagoma: u.difesaOpts.controSagoma,
                      membriFireteam: membriFT
                  })
                : M.modReset(u, {});

            u.difesaEsito = esito;

            // 31 ottobre (Paolo, collaudo grafico): la scheda dell'Attacco BS
            // (M.schedaBS), senza l'omino e il cervello. Valore e MOD nella ⓘ.
            const chi = u.alias || u.nome;

            let opzioni = '';
            if (schivata) {
                // Il -3 di LoF vale solo sulla Schivata: sul Reset non si mostra.
                const ic = (k) => (typeof window.iconaInterruttore === 'function') ? window.iconaInterruttore(k, 44, true) : '';
                opzioni = `<div style="display:flex; gap:10px;"><button type="button" class="huge-btn tasto-lof-difesa" style="flex:1; margin:0; min-height:90px; font-size:var(--fs-l); flex-direction:column; justify-content:center; align-items:center; text-align:center; ${M.stileColore(u.difesaOpts.hasLoF ? 'si' : 'attenzione')}"
                    onclick="window.toggleDifesaLoF(${index}, '${actionId}')">${u.difesaOpts.hasLoF ? ic('lofSi') + 'HO LINEA DI TIRO VERSO CHI ATTACCA' : ic('lofNo') + 'NESSUNA LINEA DI TIRO (-3 PH)'}</button></div>`;

                // 26 ottobre (Paolo): il tasto "STO SCHIVANDO UNA SAGOMA" non
                // serve piu`. All'Hub la Schivata si ricalcola contro l'ARO
                // vero (M.modReazione legge la Sagoma dall'arma del reattivo),
                // e qui dava solo una nota. Restano la funzione e il campo,
                // spenti, per le buste vecchie.
            }

            html += M.schedaBS.apri() + M.schedaBS.testa(chi) + opzioni + `</div>`;
            // 28 ottobre (Paolo): le note della Schivata o del Reset nella ⓘ.
            esito.note.forEach(n => M.nota('step-modifiers', (u.alias || u.nome) + ': ' + (schivata ? 'Schivata' : 'Reset'), n, { tipo: 'regole' }));
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
            nuovo.onclick = function () { window.eseguiCalcoloDifesa(); };
            nuovo.innerText = 'ESEGUI CALCOLO';   // 31 ottobre (Paolo): un'etichetta sola per tutti gli Ordini
        }

        window.goToStep('step-modifiers');
    };

    window.toggleDifesaLoF = function (index, actionId) {
        const u = window.coordUnits[index];
        u.difesaOpts.hasLoF = !u.difesaOpts.hasLoF;
        window.preparaModificatoriDifesa(actionId);
    };
    window.toggleDifesaSagoma = function (index, actionId) {
        const u = window.coordUnits[index];
        u.difesaOpts.controSagoma = !u.difesaOpts.controSagoma;
        window.preparaModificatoriDifesa(actionId);
    };

    window.eseguiCalcoloDifesa = function () {
        const M = motore(); if (!M) return;
        const schivata = (window.currentOrder.action === 'SCHIVATA');
        const azione = schivata ? M.AZIONI.SCHIVATA : M.AZIONI.RESET;

        window.coordUnits.forEach(function (u) {
            const esito = u.difesaEsito || (schivata ? M.modSchivata(u, {}) : M.modReset(u, {}));
            window.coordPayloads.push({
                attaccante: u,
                azione: azione,
                arma: { nome: azione, burst: 1, ammo: 'NESSUNA', ammoOpzioni: ['NESSUNA'],
                        isDifesa: true, bands: [], notazioni: [] },
                bersagli: [],   // il motore mette il segnaposto: la difesa non ha un bersaglio singolo
                regole: {
                    attributo: esito.attributo,
                    valoreSuccesso: esito.valore,
                    base: esito.base,
                    mod: esito.mod,
                    voci: esito.voci,
                    controSagoma: !!(u.difesaOpts && u.difesaOpts.controSagoma),
                    haLoF: !!(u.difesaOpts && u.difesaOpts.hasLoF)
                }
            });
        });

        const spedito = M.inviaCalcolo(window.coordPayloads, { isCoordinated: window.coordMode });
        if (!spedito) { window.coordPayloads = []; return; }

        const calcDiv = document.getElementById('calc-result');
        if (calcDiv) {
            calcDiv.innerHTML = `
                <div style="text-align:center; padding:20px; border:2px solid ${COL.bordo}; background:rgba(0,255,255,0.1); margin-top:20px;">
                    <h2 style="color:${COL.bordo}; margin:0;">DATI DIFENSIVI INVIATI</h2>
                    <p style="font-size:var(--fs-xs); color:var(--mn-debole,#aaaaaa);">In attesa della risoluzione all'Hub...</p>
                </div>`;
            calcDiv.style.display = 'block';
        }
    };

    // ==============================================================
    // FUOCO DI SOPPRESSIONE
    // ==============================================================
    window.avviaSoppressione = function () {
        const M = motore(); if (!M) return;
        // Ordine Intero: le tinte di SOPPRESSIONE (rosso), non quelle della Schivata.
        const COL = M.segnaColoreOrdine(M.coloreOrdine('SOPPRESSIONE'));
        const unita = window.currentOrder.unit;
        const esito = M.armiSoppressione(unita);

        const container = document.getElementById('weapon-buttons-container');

        window.MotoreN5.azzeraNote('step-weapon');
        container.innerHTML = `${window.MotoreN5.intestazioneOrdine({ step: 'step-weapon', colore: COL, titolo: `FUOCO DI SOPPRESSIONE`, nota: `Ordine Intero · scegli l'arma da mettere in SF Mode` })}`;

        if (esito.armi.length === 0) {
            container.innerHTML += `<p style="color:var(--mn-errore,#ff3333); text-align:center; font-size:var(--fs-m);">
                ❌ Nessuna arma utilizzabile per il Fuoco di Soppressione.</p>`;
        } else {
            // 31 ottobre (Paolo): il bottone dell'arma dell'Attacco BS
            // (M.bottoneArma), col profilo SF Mode (Burst e gittate SF).
            M.nota('step-weapon', 'SF Mode', 'Il profilo SF Mode sostituisce gittate e Burst; PS e munizioni restano quelli dell\'arma.', { tipo: 'regole' });
            esito.armi.forEach(function (p) {
                const nomeEsc = p.nome.replace(/'/g, "\\'");
                const tocco = `onclick="window.confermaSoppressione('${nomeEsc}')"`;
                if (typeof M.bottoneArma !== 'function') {
                    container.innerHTML += `<button class="huge-btn" style="border-color:${COL.bordo};" ${tocco}>${p.nome}</button>`;
                    return;
                }
                container.innerHTML += M.bottoneArma(Object.assign({}, p, M.profiloSF(p)), { attributi: tocco });
            });
        }

        // 28 ottobre (Paolo): perche` non si puo`, nella ⓘ (o sotto il tasto).
        esito.escluse.forEach(x => window.MotoreN5.nota('step-weapon', x.nome + ' non utilizzabile', x.motivo, { tipo: 'nonpuo' }));
        esito.avvisi.forEach(function (a) {
            container.innerHTML += `<div style="margin-top:10px; padding:10px; background:var(--mn-nota-fondo,#1a1000); border:1px solid var(--mn-nota-bordo,#664400); border-radius:5px; color:var(--mn-nota-tenue,#cc9955); font-size:var(--fs-s);">
                ⚠️ ${a.messaggio}<br><span style="color:var(--mn-nota-tenue,#cc9955);">${a.dettaglio || ''}</span></div>`;
        });

        window.goToStep('step-weapon');
    };

    window.confermaSoppressione = function (nomeArma) {
        const M = motore(); if (!M) return;
        const unita = window.currentOrder.unit;
        const arma = M.profiloArma(nomeArma);
        const sf = M.profiloSF(arma);

        if (!unita.states) unita.states = {};
        unita.states.suppressive = true;
        unita.states.suppressiveWeapon = sf.nome;

        // Il Fireteam si scioglie per chi entra in Soppressione.
        const eraInFireteam = !!(unita.states.fireteam);
        if (eraInFireteam) unita.states.fireteam = '';

        // 18 ottobre (Paolo, DIF-10): la Soppressione e` un Ordine intero e
        // come ogni Ordine genera ARO. L'allarme partiva, ma fatto a mano
        // (senza la busta di M.allarmeOrdine) e senza nessun invio all'Hub:
        // il tabellone non sapeva di dover aspettare un ARO e non mostrava
        // niente. Ora: allarme standard (con la SF Mode, che e` pubblica:
        // lo Stato si vede sul tavolo), poi una busta senza tiro con
        // aroAtteso, come il Cybermask.
        const sfPubblico = {
            arma: sf.nome, armaOriginale: sf.nomeOriginale,
            burst: sf.burst, bands: sf.bands,
            ammo: sf.ammo, ps: sf.dam,
            malusAiNemici: -3,
            burstSuUnSoloBersaglio: true
        };
        const al = M.allarmeOrdine(M.AZIONI.SOPPRESSIONE, { unita: unita, coordUnits: [unita], coordMode: false });
        if (al.payload) {
            al.payload.sfMode = sfPubblico;
            if (typeof window.inviaAllarmeAro === 'function') window.inviaAllarmeAro(al.payload);
        }
        const notaSF = unita.alias || unita.nome;
        window.coordPayloads = [{
            attaccante: unita, azione: M.AZIONI.SOPPRESSIONE,
            arma: Object.assign({}, arma, { nome: sf.nome, burst: sf.burst, bands: sf.bands }), bersagli: [], burstDisponibile: 0,
            regole: { senzaTiro: true, isLongSkill: true, sfMode: sfPubblico,
                      noteScontro: [notaSF + ' entra in Fuoco di Soppressione con ' + sf.nome + ' (B' + sf.burst + ' in ARO, -3 a chi gli dichiara BS Attack).'],
                      note: ['Nessun tiro: lo Stato si attiva a fine Ordine.'] }
        }];
        if (typeof M.inviaCalcolo === 'function') {
            M.inviaCalcolo(window.coordPayloads, { isCoordinated: false, aroAtteso: !!(al.aro && al.aro.genera) });
        }

        const fazione = document.title.includes('NOMADS') ? 'NOMADI' : 'PANOCEANIA';
        // 🔴 Qui partiva window.roster INTERO — il privato — sul canale di
        // setup, ogni volta che un'unita` entrava in Fuoco di Soppressione.
        // Ora il mittente unico riceve il roster e manda solo il pubblico.
        if (window.inviaSchieramentoAllHub) {
            window.inviaSchieramentoAllHub(fazione, {
                roster: window.roster, strutture: window.activeStructures || [],
                terreni: window.activeTerrains || [],
            motivo: 'AGGIORNAMENTO'   // la stessa partita: nessuna conferma all'Hub
            });
        }

        const avvisoSF = (sf.avvisi && sf.avvisi.length)
            ? `\n\n⚠️ ${sf.avvisi[0].messaggio}` : '';

        alert(`🔥 ${unita.alias || unita.nome} è in Fuoco di Soppressione con ${sf.nome}.\n\n` +
              `In ARO reagirà con Burst ${sf.burst}, tutto su UN SOLO bersaglio.\n` +
              `Chi gli dichiara BS Attack applica -3.\n` +
              `PS, munizioni e Tratti restano quelli originali; cambiano solo gittata e Burst.` +
              (eraInFireteam ? '\n\nL\'unità è uscita dal Fireteam.' : '') +
              avvisoSF +
              `\n\nLo stato si annulla se: dichiari un Ordine, dichiari un ARO diverso da un BS Attack in SF Mode, ` +
              `o entri in Stato Nullo, Accecato, Ingaggiato, Immobilizzato, Isolato o Ritirata!`);

        window.goToStep('step-group');
    };

    console.log('🛡️ ordine_difesa.js riscritto su MotoreN5.');
})();


// Dichiarazione di versione per il controllo incrociato fra chat.
// Funziona anche se questo file si carica PRIMA del motore: in quel
// caso la versione resta in coda e il motore la raccoglie all'avvio.
(function () {
    var g = (typeof window !== 'undefined') ? window : globalThis;
    var v = { file: 'ordine_difesa.js', versione: '2026-11-01.1', proprieta: 'MOTORE' };
    if (g.MotoreN5 && g.MotoreN5.dichiaraVersione) g.MotoreN5.dichiaraVersione(v.file, v.versione, v.proprieta);
    else { g.__versioniN5 = g.__versioniN5 || []; g.__versioniN5.push(v); }
})();
