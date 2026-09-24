// @versione 2026-09-21.1 | ordine_difesa.js | proprieta`: chat MOTORE
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

    const COL = { bordo: '#00ffff', fuoco: '#ff6600' };

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

        let html = `<h2 style="color:${COL.bordo}; text-align:center; margin-bottom:20px;">MODIFICATORI ${nome}</h2>`;

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

            const colore = schivata ? '#00ff00' : COL.bordo;
            const icona = schivata ? '🏃' : '🧠';

            const dettaglio = esito.voci.length
                ? esito.voci.map(v => `<div style="display:flex; justify-content:space-between; padding:2px 0;">
                        <span style="color:#aaa;">${v.motivo}</span>
                        <b style="color:${v.valore >= 0 ? '#00ff00' : '#ff6666'};">${v.valore > 0 ? '+' + v.valore : v.valore}</b></div>`).join('')
                : `<div style="color:#888; text-align:center;">Nessun modificatore</div>`;

            let opzioni = '';
            if (schivata) {
                // Il -3 di LoF vale solo sulla Schivata: sul Reset non si mostra.
                const stileLoF = u.difesaOpts.hasLoF
                    ? 'background:#004400; color:#00ff00; border-color:#00ff00;'
                    : 'background:#440000; color:#ff5555; border-color:#ff0000;';
                opzioni += `<button type="button" class="huge-btn" style="width:100%; margin-top:10px; min-height:50px; font-size:16px; ${stileLoF}"
                    onclick="window.toggleDifesaLoF(${index}, '${actionId}')">
                    ${u.difesaOpts.hasLoF ? '👁️ HO LINEA DI TIRO VERSO CHI ATTACCA' : '🚫 NESSUNA LINEA DI TIRO (-3 PH)'}</button>`;

                const stileSag = u.difesaOpts.controSagoma
                    ? 'background:#442200; color:#ff9900; border-color:#ff9900;'
                    : 'background:#111; color:#888; border-color:#555;';
                opzioni += `<button type="button" class="huge-btn" style="width:100%; margin-top:8px; min-height:50px; font-size:15px; ${stileSag}"
                    onclick="window.toggleDifesaSagoma(${index}, '${actionId}')">
                    ${u.difesaOpts.controSagoma ? '🔥 STO SCHIVANDO UNA SAGOMA' : 'Attacco normale (non a Sagoma)'}</button>`;
            }

            html += `
            <div class="target-card" style="border-left:4px solid ${colore}; margin-bottom:15px; background:rgba(0,255,255,0.05); padding:15px; border-radius:5px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <b style="color:#fff; font-size:22px;">${icona} ${u.alias || u.nome}</b>
                    <div style="text-align:right;">
                        <span style="color:#888; font-size:13px;">${esito.attributo} ${esito.base} →</span>
                        ${esito.impossibile
                            // 🔴 Dopo aver tolto i clamp a 1, Schivata e Reset possono
                            // scendere sotto 1: e` un FALLIMENTO AUTOMATICO, non un
                            // numero da tirare. Qui si mostrava "-2". Stesso testo di
                            // scoprire, osservazione e scenografia. (Chat REGOLE, 21 sett.)
                            ? '<b style="color:#ff3333; font-size:18px;"> FALLIMENTO AUTOMATICO</b><br><span style="color:#ff9999; font-size:12px;">Valore ' + esito.valore + ' sotto 1: il tiro fallisce automaticamente</span>'
                            : '<b style="color:' + colore + '; font-size:26px;"> ' + esito.valore + '</b>'}
                    </div>
                </div>
                <div style="background:#001a1a; border:1px solid #005555; padding:10px; border-radius:5px; font-size:14px;">${dettaglio}</div>
                ${opzioni}
                ${esito.note.length ? `<div style="margin-top:10px; color:#888; font-size:12px; line-height:1.6;">` + esito.note.map(n => `• ${n}`).join('<br>') + `</div>` : ''}
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
            nuovo.onclick = function () { window.eseguiCalcoloDifesa(); };
            nuovo.innerText = 'ESEGUI TIRO FACCIA A FACCIA';
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
                    <p style="font-size:12px; color:#aaa;">In attesa della risoluzione all'Hub...</p>
                </div>`;
            calcDiv.style.display = 'block';
        }
    };

    // ==============================================================
    // FUOCO DI SOPPRESSIONE
    // ==============================================================
    window.avviaSoppressione = function () {
        const M = motore(); if (!M) return;
        const unita = window.currentOrder.unit;
        const esito = M.armiSoppressione(unita);

        const container = document.getElementById('weapon-buttons-container');
        container.innerHTML = `<div style="background:#331100; border:1px solid ${COL.fuoco}; padding:10px; margin-bottom:15px; text-align:center; color:#fff; border-radius:5px;">
            <b style="color:${COL.fuoco}; font-size:20px;">🔥 FUOCO DI SOPPRESSIONE</b><br>
            <span style="font-size:14px; color:#ccc;">Ordine Intero · scegli l'arma da mettere in SF Mode</span>
        </div>`;

        if (esito.armi.length === 0) {
            container.innerHTML += `<p style="color:#ff3333; text-align:center; font-size:18px;">
                ❌ Nessuna arma utilizzabile per il Fuoco di Soppressione.</p>`;
        } else {
            esito.armi.forEach(function (p) {
                const sf = M.profiloSF(p);
                const gittata = sf.bands.map(b => `${b.mod > 0 ? '+' : ''}${b.mod}`).join(' / ');
                const nomeEsc = p.nome.replace(/'/g, "\\'");
                container.innerHTML += `<button class="huge-btn" style="border-color:${COL.fuoco};" onclick="window.confermaSoppressione('${nomeEsc}')">
                    ${p.nome}<br><span style="color:${COL.fuoco}; font-size:13px;">SF Mode: B${sf.burst} · ${gittata} · PS e munizioni invariati</span>
                </button>`;
            });
        }

        if (esito.escluse.length > 0) {
            container.innerHTML += `<div style="margin-top:15px; padding:10px; background:#111; border:1px solid #444; border-radius:5px; color:#888; font-size:13px;">
                <b style="color:#aaa;">Non utilizzabili:</b><br>` +
                esito.escluse.map(x => `• <b>${x.nome}</b> — ${x.motivo}`).join('<br>') + `</div>`;
        }
        esito.avvisi.forEach(function (a) {
            container.innerHTML += `<div style="margin-top:10px; padding:10px; background:#221100; border:1px solid #664400; border-radius:5px; color:#cc9955; font-size:13px;">
                ⚠️ ${a.messaggio}<br><span style="color:#886644;">${a.dettaglio || ''}</span></div>`;
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

        const payloadInfo = {
            attaccante: unita.alias || unita.nome,
            attaccanti: [unita.alias || unita.nome],
            azione: M.AZIONI.SOPPRESSIONE,
            bersagli: [],
            sfMode: {
                arma: sf.nome, armaOriginale: sf.nomeOriginale,
                burst: sf.burst, bands: sf.bands,
                ammo: sf.ammo, ps: sf.dam,
                malusAiNemici: -3,
                burstSuUnSoloBersaglio: true
            },
            timestamp: Date.now()
        };
        if (window.inviaAllarmeAro) window.inviaAllarmeAro(payloadInfo);

        const fazione = document.title.includes('NOMADS') ? 'NOMADI' : 'PANOCEANIA';
        if (window.inviaSchieramentoAllHub) {
            window.inviaSchieramentoAllHub({
                roster: window.roster, strutture: window.activeStructures,
                terreni: window.activeTerrains, timestamp: Date.now()
            }, fazione);
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
    var v = { file: 'ordine_difesa.js', versione: '2026-09-14.1', proprieta: 'MOTORE' };
    if (g.MotoreN5 && g.MotoreN5.dichiaraVersione) g.MotoreN5.dichiaraVersione(v.file, v.versione, v.proprieta);
    else { g.__versioniN5 = g.__versioniN5 || []; g.__versioniN5.push(v); }
})();
