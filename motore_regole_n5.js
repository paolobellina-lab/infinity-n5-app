// @versione 2026-09-23.18 | motore_regole_n5.js | proprieta`: chat MOTORE
// ==========================================
// 🧠 MOTORE REGOLE N5 - motore_regole_n5.js
// ------------------------------------------
// PARTE 1 di N: IL CONTRATTO
//   - vocabolario canonico delle azioni
//   - specifica di cosa serve a ciascuna azione
//   - costruzione e VALIDAZIONE BLOCCANTE del payload verso l'Hub
//
// Principio guida: NIENTE DEFAULT SILENZIOSI.
// Se un dato manca o non torna, l'invio si ferma e il giocatore vede perché.
// Mai più bersagli fantasma, gittate a zero per sbaglio, armi non trovate
// sostituite da un profilo generico senza dirlo.
//
// Dipendenze: catalogo_n5.js (window.CATALOGO_N5)
//             motore_core.js (window.inviaCalcoloAllHub) — solo per l'invio
// Non tocca il DOM salvo in inviaCalcolo(), e nemmeno lì obbligatoriamente
// (window.MotoreN5.onBloccato è sostituibile con una UI a piacere).
// ==========================================

(function () {
    'use strict';

    const G = (typeof window !== 'undefined') ? window : globalThis;
    const M = G.MotoreN5 = G.MotoreN5 || {};

    // ⚠️ UN SOLO numero di versione per file.
    // Prima ce n'erano due: questo, semantico, e la riga "@versione" in testa
    // al file, a data. Si muovevano separatamente, e una chat che citava
    // l'uno mentre l'altro era avanzato faceva passare il controllo
    // incrociato su un file che in realta` era gia` cambiato. E` successo.
    //
    // Ora questo E` la riga in testa: stessa stringa, unica fonte.
    M.VERSIONE = '2026-09-23.18';

    // La tappa funzionale resta, ma come etichetta descrittiva: non si usa
    // per il controllo incrociato.
    M.TAPPA = 'stati-gravita';

    // ------------------------------------------------------------------
    // COSTANTI (dal catalogo, con fallback se non ancora caricato)
    // ------------------------------------------------------------------
    function meccaniche() {
        const c = G.CATALOGO_N5 && G.CATALOGO_N5.MECCANICHE;
        return c || { MOD_MAX: 12, MOD_MIN: -12, SV_MIN: 1, BURST_MAX: 6 };
    }

    // ------------------------------------------------------------------
    // VOCABOLARIO CANONICO — CANALE ATTACCO (canale_hub_calcolo)
    //
    // ATTENZIONE: i valori NON sono stringhe scelte da noi. Sono esattamente
    // quelle che generaRisoluzioneDaDati() in calcolatore_math.js già legge
    // oggi. Adottarle come costanti fissa il contratto SENZA toccare l'Hub.
    // Quando riscriveremo l'Hub potremo cambiare i valori qui in un punto solo.
    // ------------------------------------------------------------------
    // Nota: "ATTACCO SORPRESA" NON e` in questo elenco. In N5 l'Attacco a
    // Sorpresa non e` un Ordine che si dichiara: e` un MOD di -3 che una
    // Skill impone a chi reagisce, e lo applica M.modReazione(). Stava fra
    // le azioni per errore, e il router non aveva modo di instradarlo.
    M.AZIONI = {
        BS_ATTACK:    'ATTACCO BS',
        CC_ATTACK:    'CC_ATTACK',
        BERSERK:      'BERSERK',
        PROTHEION:    'PROTHEION',
        HACKING:      'HACKING',
        INTUITIVO:    'ATTACCO INTUITIVO',
        SPECULATIVO:  'FUOCO SPECULATIVO',
        GUIDATO:      'ATTACCO GUIDATO',
        SCOPRIRE:     'SCOPRIRE',
        SUPPORTO_WIP: 'SUPPORTO_WIP',
        SUPPORTO_BS:  'SUPPORTO_BS',
        INTERAGIRE:   'INTERAGIRE OBIETTIVO',
        DEACTIVATOR:  'DEACTIVATOR',
        PIAZZA_DEPLOYABLE: 'PIAZZARE EQUIPAGGIAMENTO',
        TRINCERARSI:  'TRINCERARSI',
        FORWARD_OBSERVER: 'FORWARD OBSERVER',
        SENSOR:       'SENSOR',
        TRIANGULATED: 'TRIANGULATED FIRE',
        INGRESSO:     'INGRESSO IN CAMPO',
        SPEEDBALL:    'REQUEST SPEEDBALL',
        SCHIVATA:     'SCHIVATA',
        RESET:        'RESET',
        SOPPRESSIONE: 'SOPPRESSIONE'
    };

    // ------------------------------------------------------------------
    // VOCABOLARIO CANONICO — CANALE ARO (canale_aro_*)
    //
    // È un vocabolario DIVERSO, non un duplicato: l'Hub legge reazione.azione
    // con stringhe proprie. Nota l'incoerenza storica che qui resta esplicita:
    // in attacco la schivata è 'SCHIVATA', in reazione è 'DODGE'.
    // Non la sistemiamo ora (romperebbe l'Hub); la rendiamo visibile.
    // ------------------------------------------------------------------
    M.AZIONI_ARO = {
        PIAZZA_DEPLOYABLE: 'PIAZZA_DEPLOYABLE',
        BS_ATTACK: 'BS_ATTACK',
        CC_ATTACK: 'CC_ATTACK',
        HACKING:   'HACKING',
        DODGE:     'DODGE',
        RESET:     'RESET',
        NESSUNO:   'Nessun ARO'
    };

    // ------------------------------------------------------------------
    // SPECIFICA PER AZIONE — cosa il motore pretende prima di spedire
    //
    //   attributo   : su quale caratteristica si tira (info per l'Hub e la UI)
    //   arma        : 'obbligatoria' | 'nessuna'
    //   bersagli    : 'obbligatori'  — almeno uno, reale, sul tavolo
    //                 'segnaposto'   — un solo bersaglio fittizio ammesso (difese)
    //                 'nessuno'      — array vuoto
    //   burst       : 'allocabile'   — il giocatore distribuisce i dadi
    //                 'fisso1'       — regola: sempre Burst 1
    //                 'nessuno'
    //   gittata     : true se i bersagli devono avere un rangeMod scelto
    // ------------------------------------------------------------------
    M.SPEC = {
        'ATTACCO BS':        { schieramento: 'nemico',  attributo: 'BS',  arma: 'obbligatoria', bersagli: 'obbligatori', burst: 'allocabile', gittata: true },
        'CC_ATTACK':         { schieramento: 'nemico',  attributo: 'CC',  arma: 'obbligatoria', bersagli: 'obbligatori', burst: 'allocabile', gittata: false },
        'BERSERK':           { schieramento: 'nemico',  attributo: 'CC',  arma: 'obbligatoria', bersagli: 'obbligatori', burst: 'allocabile', gittata: false },
        'PROTHEION':         { schieramento: 'nemico',  attributo: 'CC',  arma: 'obbligatoria', bersagli: 'obbligatori', burst: 'allocabile', gittata: false },
        'HACKING':           { schieramento: 'nemico',  attributo: 'WIP', arma: 'obbligatoria', bersagli: 'obbligatori', burst: 'allocabile', gittata: false },
        'ATTACCO INTUITIVO': { schieramento: 'nemico',  attributo: 'WIP', arma: 'obbligatoria', bersagli: 'obbligatori', burst: 'fisso1',     gittata: false, tiroNonModificato: true, unSoloBersaglio: true },
        'FUOCO SPECULATIVO': { schieramento: 'nemico',  attributo: 'BS',  arma: 'obbligatoria', bersagli: 'obbligatori', burst: 'fisso1',     gittata: true },
        'ATTACCO GUIDATO':   { schieramento: 'nemico',  attributo: 'BS',  arma: 'obbligatoria', bersagli: 'obbligatori', burst: 'allocabile', gittata: true, primarioBersagliato: true },
        // Lo Scoprire ha bande di gittata PROPRIE (voce "SCOPRIRE" in
        // RULES_WEAPONS) e applica gli stessi MOD di un BS Attack.
        'SCOPRIRE':          { schieramento: 'nemico',  attributo: 'WIP', arma: 'nessuna',      bersagli: 'obbligatori', burst: 'fisso1',     gittata: true, etichetta: 'Discover' },
        'SUPPORTO_WIP':      { schieramento: 'alleato', attributo: 'WIP', arma: 'nessuna',      bersagli: 'obbligatori', burst: 'fisso1',     gittata: false },
        'SUPPORTO_BS':       { schieramento: 'alleato', attributo: 'BS',  arma: 'nessuna',      bersagli: 'obbligatori', burst: 'fisso1',     gittata: false },
        // Le due azioni che agiscono sulla SCENOGRAFIA: bersagli neutri,
        // non filtrati per fazione. Tiro WIP a contatto di Silhouette.
        'INTERAGIRE OBIETTIVO': { schieramento: 'scenografia', attributo: 'WIP', arma: 'nessuna', bersagli: 'obbligatori', burst: 'fisso1', gittata: false, etichetta: 'Interagire' },
        'DEACTIVATOR':          { schieramento: 'scenografia', attributo: 'WIP', arma: 'nessuna', bersagli: 'obbligatori', burst: 'fisso1', gittata: false, etichetta: 'Deactivator' },
        // Piazzare un Deployable: nessun tiro, nessun bersaglio, nessuna
        // gittata. Il nemico reagisce a CHI PIAZZA, mai al deployable.
        // Ordine Intero, nessun tiro, nessun bersaglio: come il Movimento.
        // Tre skill diverse in tutto: tipo, attributo, bersagli, LoF.
        'FORWARD OBSERVER':  { schieramento: 'nemico', attributo: 'WIP', arma: 'nessuna', bersagli: 'obbligatori', burst: 'allocabile', gittata: true, etichetta: 'Forward Observer' },
        'SENSOR':            { schieramento: 'nemico', attributo: 'WIP', arma: 'nessuna', bersagli: 'nessuno',     burst: 'fisso1',     gittata: false, etichetta: 'Sensor' },
        'TRIANGULATED FIRE': { schieramento: 'nemico', attributo: 'BS',  arma: 'obbligatoria', bersagli: 'obbligatori', burst: 'allocabile', gittata: true, etichetta: 'Triangulated Fire' },
        // Ingresso in campo: tiro PH, nessun bersaglio. Speedball: PH fisso 14.
        'INGRESSO IN CAMPO': { schieramento: 'nessuno', attributo: 'PH', arma: 'nessuna', bersagli: 'nessuno', burst: 'fisso1', gittata: false, etichetta: 'Ingresso in campo' },
        'REQUEST SPEEDBALL': { schieramento: 'nessuno', attributo: 'PH', arma: 'nessuna', bersagli: 'nessuno', burst: 'fisso1', gittata: false, etichetta: 'Request Speedball' },
        'TRINCERARSI': { schieramento: 'nessuno', attributo: null, arma: 'nessuna', bersagli: 'nessuno', burst: 'nessuno', gittata: false, tiro: false, etichetta: 'Trincerarsi' },
        'PIAZZARE EQUIPAGGIAMENTO': { schieramento: 'nessuno', attributo: null, arma: 'obbligatoria', bersagli: 'nessuno', burst: 'nessuno', gittata: false, tiro: false, etichetta: 'Piazza Deployable' },
        'SCHIVATA':          { attributo: 'PH',  arma: 'nessuna',      bersagli: 'segnaposto',  burst: 'fisso1',     gittata: false },
        'RESET':             { attributo: 'WIP', arma: 'nessuna',      bersagli: 'segnaposto',  burst: 'fisso1',     gittata: false },
        'SOPPRESSIONE':      { attributo: 'BS',  arma: 'obbligatoria', bersagli: 'nessuno',     burst: 'nessuno',    gittata: false }
    };

    // Nome riservato ai segnaposto legittimi (difese: non c'è un bersaglio singolo).
    M.SEGNAPOSTO = { id: 'all', name: 'Minaccia Reattiva' };

    // ------------------------------------------------------------------
    // LETTURA DELLO STATO DI GIOCO
    // Incapsula la convenzione sparsa oggi in 6 moduli identici.
    // Sovrascrivibile per i test: M._fazione = 'NOMADI'; M._statoGioco = {...}
    // ------------------------------------------------------------------
    M.fazionePropria = function () {
        if (M._fazione) return M._fazione;
        if (typeof document !== 'undefined' && document.title) {
            return document.title.includes('NOMADS') ? 'NOMADI' : 'PANOCEANIA';
        }
        return 'NOMADI';
    };

    function statoGioco() {
        if (M._statoGioco) return M._statoGioco;
        try {
            const raw = G.localStorage && G.localStorage.getItem('global_game_state');
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            return null;
        }
    }

    M.rosterProprio = function () {
        if (Array.isArray(M._rosterProprio)) return M._rosterProprio;
        if (Array.isArray(G.roster)) return G.roster;
        const s = statoGioco();
        if (!s) return [];
        return (M.fazionePropria() === 'NOMADI' ? s.nomads : s.panoceania) || [];
    };

    // Il roster nemico REALE, cioè quello che l'avversario ha schierato.
    // Il fallback ai DB completi (DB_PANOCEANIA / DB_NOMADI) che fanno oggi i moduli
    // è sbagliato: fa comparire tra i bersagli unità mai schierate. Qui non c'è.
    M.rosterNemico = function () {
        if (Array.isArray(M._rosterNemico)) return M._rosterNemico;
        const s = statoGioco();
        if (!s) return [];
        return (M.fazionePropria() === 'NOMADI' ? s.panoceania : s.nomads) || [];
    };

    M.nomeUnita = function (u) {
        if (!u) return '';
        if (typeof u === 'string') return u.trim();
        return String(u.alias || u.nome || u.name || '').trim();
    };

    function trovaNelRoster(roster, rif) {
        if (!rif) return null;
        const id = (typeof rif === 'object') ? rif.id : null;
        const nome = M.nomeUnita(rif).toUpperCase();
        if (id) {
            const perId = roster.find(u => u.id === id);
            if (perId) return perId;
        }
        if (!nome) return null;
        return roster.find(u => M.nomeUnita(u).toUpperCase() === nome) || null;
    }

    // ------------------------------------------------------------------
    // ESITI
    // ------------------------------------------------------------------
    // Avvisi che NON richiedono una scelta: informano e basta.
    // Tutto quello che non e` in questa lista vale 'azione', cioe` va
    // mostrato in evidenza PRIMA dell'invio, quando il giocatore puo`
    // ancora cambiare. Un codice nuovo cade quindi dalla parte prudente:
    // disturba per un avviso innocuo invece di nascondere una scelta.
    const AVVISI_NOTA = [
        'A13',   // gittata riallineata alla banda scelta
        'A15',   // nota sullo stato del bersaglio (Bersagliato, in mischia...)
        'A20',   // burst forzato a 1 per regolamento
        'A30', 'A31', 'A32', 'A33',  // bande di gittata anomale nel database
        'A46', 'A47', 'A49',         // tratti dedotti o assenti
        'A50', 'A50b', 'A51', 'A52', 'A53',  // munizioni: ritirate, sconosciute, assunti
        'A59',   // livello fuori intervallo in una tabella
        'A60',   // sagoma non classificabile
        'A70', 'A71', 'A80', 'A91',  // dati dedotti, non verificati
        'A93', 'A94', 'A96', 'A97', 'A98', 'A99'
    ];

    function err(codice, messaggio, dettaglio) {
        return {
            codice,
            messaggio,
            dettaglio: dettaglio || null,
            // 'azione' = il giocatore puo` ancora cambiare qualcosa
            // 'nota'   = non c'e` niente da fare, serve solo saperlo
            gravita: AVVISI_NOTA.indexOf(codice) >= 0 ? 'nota' : 'azione'
        };
    }

    // Elenco dei codici, per chi vuole verificare la classificazione.
    // 🔴 IL DEFAULT E` 'azione', E NON VA INVERTITO.
    // Un codice che nessuno ha classificato disturba invece di nascondersi:
    // chi aggiunge un avviso nuovo lo vede comparire senza fare altro, e
    // deve dichiararlo in AVVISI_NOTA per zittirlo.
    //
    // Invertire il default sembrerebbe innocuo — gli avvisi gia` classificati
    // continuerebbero a funzionare e nessun test cadrebbe — ma ogni codice
    // NUOVO sparirebbe in silenzio, e nessuno se ne accorgerebbe finche`
    // qualcuno non cerca a mano un avviso che credeva di aver aggiunto.
    //
    // L'interfaccia si appoggia a questo contratto per decidere cosa
    // mostrare. C'e` un test che passa un codice inventato e pretende
    // 'azione': se qualcuno inverte il default, diventa rosso.
    M.gravitaAvviso = function (codice) {
        return AVVISI_NOTA.indexOf(codice) >= 0 ? 'nota' : 'azione';
    };

    // Le categorie di stato, nell'ordine in cui vanno mostrate.
    // 🔴 Lette dal CATALOGO: NOMI_STATI resta per compatibilita`, ma il
    // dato sta accanto allo stato, non in una mappa interna del motore.
    M.categorieStati = function () {
        return ordineCategorie().slice();
    };

    // 🔴 Il nome con cui INTERFACCIA la cercava. Non e` una copia: e` una
    // LETTURA del catalogo, definita come getter. Chi la trova undefined
    // si riscrive la sequenza a mano — che e` esattamente cio` che avere
    // una fonte sola doveva evitare.
    // Un array normale sarebbe stato un secondo posto dove la stessa
    // verita` puo` divergere; un getter no.
    Object.defineProperty(M, 'ORDINE_CATEGORIE', {
        get: function () { return ordineCategorie().slice(); },
        enumerable: true, configurable: true
    });

    // Gli stati attivi di un'unita`, raggruppati per categoria e ordinati.
    M.statiPerCategoria = function (unita) {
        const S = catalogo('STATI') || {};
        const attivi = M.statiAttivi(unita) || [];
        const ordine = M.categorieStati();
        const gruppi = {};

        attivi.forEach(function (a) {
            // Il catalogo ha le stesse chiavi di statiAttivi (id canonici): la voce
            // si prende per id. Prima serviva cercarla per chiave maiuscola e poi
            // per nome, perche` i vocabolari erano due. (23 settembre.)
            const voce = S[a.id] || {};
            const cat = voce.categoria || a.categoria || 'ALTRO';
            (gruppi[cat] = gruppi[cat] || []).push({
                id: a.id,
                nome: voce.nome || a.nome || a.id,
                categoria: cat,
                // Lo stesso flag che legge M.eNullo: l'interfaccia segna i
                // cinque stati Null in rosso (riga 13591) senza copiarsi la
                // lista. (Chat REGOLE, 21 settembre.)
                nullo: voce.statoNullo === true
            });
        });

        return ordine.filter(function (c) { return gruppi[c]; })
                     .map(function (c) { return { categoria: c, stati: gruppi[c] }; })
                     .concat(Object.keys(gruppi)
                        .filter(function (c) { return ordine.indexOf(c) < 0; })
                        .map(function (c) { return { categoria: c, stati: gruppi[c] }; }));
    };

    // ------------------------------------------------------------------
    // creaAttacco() — costruisce e valida UN attacco (una unità)
    //
    // Ritorna { ok, attacco, errori: [], avvisi: [] }
    // Se ok === false, `attacco` è comunque presente per il debug ma NON va spedito.
    // ------------------------------------------------------------------
    M.creaAttacco = function (input) {
        const errori = [];
        const avvisi = [];
        input = input || {};

        const azione = String(input.azione || '').trim();
        const spec = M.SPEC[azione];

        if (!spec) {
            errori.push(err('E01',
                `Azione "${azione || '(vuota)'}" non riconosciuta dal motore.`,
                'Usa una costante di MotoreN5.AZIONI.'));
            return { ok: false, attacco: null, errori, avvisi };
        }

        // --- attaccante ---
        const nomeAtt = M.nomeUnita(input.attaccante);
        if (!nomeAtt) {
            errori.push(err('E02', 'Attaccante mancante o senza nome.'));
        } else {
            const proprio = M.rosterProprio();
            if (proprio.length > 0 && !trovaNelRoster(proprio, input.attaccante)) {
                errori.push(err('E03',
                    `L'attaccante "${nomeAtt}" non risulta nel tuo roster schierato.`,
                    'L\'Hub non riuscirebbe a leggerne le statistiche.'));
            }
        }

        // --- arma ---
        let arma = input.arma || null;
        if (spec.arma === 'obbligatoria') {
            if (!arma || typeof arma !== 'object') {
                errori.push(err('E07', `L'azione "${azione}" richiede un'arma o un programma, ma non ne è stato passato nessuno.`));
            } else {
                if (arma.nonTrovata) {
                    errori.push(err('E08',
                        `L'arma "${arma.nomeRichiesto || '?'}" non esiste nel database armi.`,
                        'Il profilo sarebbe un segnaposto generico: gittata 0, Burst 1, danno 13.'));
                }
                if (Array.isArray(arma.avvisi)) arma.avvisi.forEach(a => avvisi.push(a));
                // I programmi di Hacking non hanno bande: agiscono nell'Area di
                // Hacking, dove la gittata non esiste. Vanno esentati come le
                // Sagome e le armi da CC.
                if (!arma.isTemplate && !arma.isCC && !arma.isDifesa && !arma.isHacking &&
                    (!Array.isArray(arma.bands) || arma.bands.length === 0)) {
                    errori.push(err('E09',
                        `L'arma "${arma.nome || arma.nomeRichiesto || '?'}" non ha bande di gittata e non è a Sagoma né da CC.`));
                }
            }
        } else {
            arma = arma || { burst: 1, ammo: 'NESSUNA', bands: [{ mod: 0, label: 'Nessuna arma' }] };
        }

        // --- piazzare un Deployable: l'arma dev'essere piazzabile ---
        if (azione === M.AZIONI.PIAZZA_DEPLOYABLE) {
            const nomeA = (typeof arma === 'string') ? arma : (arma && arma.nome);
            const p = (typeof arma === 'string') ? M.profiloArma(arma) : arma;
            const tratti = String((p && p.traits) || '').toUpperCase();
            const piazzabile = /DEPLOYABLE/.test(tratti) ||
                               /PERIPHERAL \(ANCILLARY\)/.test(tratti);
            if (!p || p.nonTrovata) {
                errori.push(err('E16', `Nessuna arma da piazzare.`,
                    'Piazzare un Deployable richiede di scegliere quale.'));
            } else if (!piazzabile) {
                errori.push(err('E16', `"${nomeA}" non è un Deployable: non può essere piazzato.`,
                    'Serve il Tratto Deployable, o Peripheral (Ancillary).'));
            } else {
                const usi = M.usiResidui ? M.usiResidui(input.attaccante, p) : null;
                if (usi && usi.residui <= 0) {
                    errori.push(err('E17', `"${p.nome}": usi esauriti.`,
                        `Disposable (${usi.totali}): ne sono già stati spesi ${usi.spesi}.`));
                }
            }
        }

        // --- bersagli ---
        const bersagli = Array.isArray(input.bersagli) ? input.bersagli.slice() : [];

        if (spec.bersagli === 'nessuno') {
            if (bersagli.length > 0) {
                avvisi.push(err('A10', `L'azione "${azione}" non prevede bersagli: ne sono stati ignorati ${bersagli.length}.`));
                bersagli.length = 0;
            }
        } else if (spec.bersagli === 'segnaposto') {
            if (bersagli.length === 0) bersagli.push(Object.assign({ burst: 1, cover: false }, M.SEGNAPOSTO));
            if (bersagli.length > 1) {
                errori.push(err('E11', `L'azione difensiva "${azione}" ammette un solo bersaglio segnaposto, ne sono arrivati ${bersagli.length}.`));
            }
        } else {
            // 'obbligatori': devono essere unità VERE, presenti sul tavolo.
            //
            // 🔴 Tre schieramenti, non due. La SCENOGRAFIA non sta nel roster
            // nemico — e` NEUTRA, e viene da scenario.*.strutture. Il
            // contratto conosceva solo 'alleato' e 'nemico', quindi ogni
            // INTERAGIRE OBIETTIVO e ogni DEACTIVATOR venivano respinti con
            // E05 "nessuna unita` nemica schierata": un blocco corretto nella
            // forma e sbagliato nel merito.
            const eScenico = (spec.schieramento === 'scenografia');
            const nemici = eScenico
                ? M.scenografia().concat(M.deployableInCampo())
                : (spec.schieramento === 'alleato') ? M.rosterProprio() : M.rosterNemico();

            if (bersagli.length === 0) {
                errori.push(err('E04',
                    `L'azione "${azione}" richiede almeno un bersaglio, ma non ne è stato selezionato nessuno.`,
                    'Torna alla selezione bersagli.'));
            }
            if (nemici.length === 0 && bersagli.length > 0) {
                errori.push(eScenico
                    ? err('E05b',
                        'Nessun elemento scenico o dispositivo risulta sul tavolo.',
                        'Torrette, console e antenne si inseriscono dalla sezione del terreno; i dispositivi vanno prima schierati.')
                    : err('E05',
                        'Nessuna unità nemica risulta schierata sul tavolo.',
                        'L\'avversario non ha ancora inviato lo schieramento all\'Hub.'));
            }

            const visti = new Set();
            bersagli.forEach((b, i) => {
                const nomeB = M.nomeUnita(b);
                const etichetta = nomeB || `bersaglio #${i + 1}`;

                // Una munizione incoerente con l'arma si RIFIUTA qui, invece di
                // essere ignorata dopo. (Chat TEST: "rifiutato invece che ignorato".)
                if (b.ammo && arma && Array.isArray(arma.ammoOpzioni) && arma.ammoOpzioni.length &&
                    arma.ammoOpzioni.indexOf(b.ammo) < 0) {
                    errori.push(err('E56', `${etichetta}: munizione "${b.ammo}" non disponibile per ${arma.nome} (${arma.ammoOpzioni.join('/')}).`,
                        'La munizione la decide l\'arma o la sua modalità.'));
                }

                // ⚠️ QUESTO È IL CONTROLLO CHE CHIUDE LA SEGNALAZIONE #5.
                // I moduli attuali inventano { id:'generic1', name:'Bersaglio Primario' }
                // quando la selezione è vuota. L'Hub non lo trova nel gameState,
                // cade sui default (arm 1, ph 11) e produce un Tiro Normale
                // contro un'unità che non esiste. Da qui in poi: blocco.
                if (!nomeB) {
                    errori.push(err('E06', `Il ${etichetta} non ha un nome utilizzabile.`));
                } else if (nomeB.toUpperCase() === 'BERSAGLIO PRIMARIO' || b.id === 'generic1') {
                    errori.push(err('E06',
                        'Bersaglio segnaposto "Bersaglio Primario" rilevato.',
                        'È un placeholder generato quando la selezione bersagli è vuota: non corrisponde a nessuna unità sul tavolo.'));
                } else if (nemici.length > 0 && !trovaNelRoster(nemici, b)) {
                    errori.push(err('E06',
                        `"${nomeB}" non risulta tra le unità nemiche schierate.`,
                        'L\'Hub non troverebbe le sue statistiche e userebbe valori inventati.'));
                }

                // stato del bersaglio: stessa regola che usa la UI per mostrarlo
                const vero = trovaNelRoster(nemici, b);
                if (vero) {
                    const giudizio = M.bersagliValidi(azione, [vero], {
                        attaccante: input.attaccante,
                        programma: input.programma || (arma && arma.nome),
                        fuoriLoF: input.fuoriLoF,
                        consentiFeriti: input.consentiFeriti,
                        ruolo: (i === 0) ? 'primario' : 'secondario'
                    })[0];
                    if (giudizio && !giudizio.ammesso) {
                        errori.push(err('E15', `"${etichetta}" non è un bersaglio valido per ${azione}.`, giudizio.motivo));
                    } else if (giudizio) {
                        giudizio.note.forEach(n => avvisi.push(err('A15', `${etichetta}: ${n}`)));
                    }
                }

                const chiave = (b.id || nomeB).toUpperCase();
                if (visti.has(chiave)) {
                    errori.push(err('E12', `Il bersaglio "${etichetta}" compare due volte nello stesso attacco.`));
                }
                visti.add(chiave);

                // gittata: deve essere una scelta esplicita, non uno zero di default
                // 🔴 `senzaGittata` esclude il controllo: un'arma che si
                // risolve per Zona di Controllo ha UNA banda finta, messa solo
                // per portare l'etichetta del modo. Chiederne la scelta
                // significherebbe pretendere una gittata da un'arma che non
                // ne ha, ed e` cio` che bloccava il Jammer con E13.
                if (spec.gittata && arma && !arma.senzaGittata &&
                    Array.isArray(arma.bands) && arma.bands.length > 0 && !arma.isTemplate) {
                    if (typeof b.rangeIndex !== 'number' || b.rangeIndex < 0 || b.rangeIndex >= arma.bands.length) {
                        errori.push(err('E13',
                            `Nessuna banda di gittata scelta per "${etichetta}".`,
                            `L'arma ha ${arma.bands.length} bande: ` + arma.bands.map(x => `${x.mod > 0 ? '+' : ''}${x.mod} (${x.label})`).join(', ')));
                    } else {
                        const atteso = arma.bands[b.rangeIndex].mod;
                        if (b.rangeMod !== atteso) {
                            avvisi.push(err('A13',
                                `Gittata di "${etichetta}" riallineata a ${atteso > 0 ? '+' : ''}${atteso} (banda ${b.rangeIndex}).`,
                                `Il modulo aveva passato ${b.rangeMod}.`));
                            b.rangeMod = atteso;
                        }
                    }
                }
            });

        }

        // --- burst ---
        const MAXB = meccaniche().BURST_MAX;
        if (spec.burst === 'allocabile') {
            const disponibile = (typeof input.burstDisponibile === 'number')
                ? input.burstDisponibile
                : (arma && typeof arma.burst === 'number' ? arma.burst : 1);
            // 🔴 UN'ARMA A SAGOMA NON DIVIDE I DADI: con un solo uso colpisce
            // tutti quelli sotto l'area — il bersaglio principale e i
            // secondari (regolamento pp.40-42). Sommare i dadi dei bersagli
            // dava "Assegnati 2 dadi ma ne hai solo 1" appena la Sagoma
            // prendeva due truppe. Per le Sagome conta il bersaglio che ne
            // porta di piu`, non la somma. (Chat TEST, 23 settembre.)
            const eSagoma = !!(arma && arma.isTemplate);
            const allocato = eSagoma
                ? bersagli.reduce((m, b) => Math.max(m, parseInt(b.burst, 10) || 0), 0)
                : bersagli.reduce((s, b) => s + (parseInt(b.burst, 10) || 0), 0);

            if (allocato === 0) {
                errori.push(err('E20',
                    'Nessun dado assegnato ai bersagli.',
                    `Hai ${disponibile} dadi da distribuire.`));
            }
            if (allocato > disponibile) {
                errori.push(err('E21', `Assegnati ${allocato} dadi ma ne hai solo ${disponibile}.`));
            }
            if (allocato > MAXB) {
                errori.push(err('E22', `Burst ${allocato} oltre il massimo di ${MAXB} previsto dal regolamento.`));
            }
        } else if (spec.burst === 'fisso1') {
            bersagli.forEach(b => {
                if (b.burst !== 1) {
                    avvisi.push(err('A20', `Burst di "${M.nomeUnita(b) || 'bersaglio'}" forzato a 1: "${azione}" usa sempre Burst 1 per regolamento.`));
                    b.burst = 1;
                }
            });
        }

        const attacco = {
            attaccante: nomeAtt,
            // 🔴 L'id, non solo il nome. Con due Alguacil identici in lista
            // l'Hub cercava per nome e trovava il primo, che poteva non
            // essere quello che ha sparato. I bersagli l'id ce l'avevano
            // gia`: l'attaccante no.
            attaccanteId: (input.attaccante && typeof input.attaccante === 'object')
                ? (input.attaccante.id || null) : null,
            azione: azione,
            arma: arma,
            bersagli: bersagli
        };

        // Senza id l'Hub deve ripiegare sulla ricerca per nome: funziona,
        // ma con due omonimi trova il primo. Si dice, invece di lasciare
        // che il ripiego avvenga in silenzio.
        if (!attacco.attaccanteId && nomeAtt) {
            avvisi.push(err('A100', `L'attaccante "${nomeAtt}" non ha un id.`,
                'L\'Hub lo cercherà per nome: con due unità omonime nel roster può trovare quella sbagliata.'));
        }
        if (azione === M.AZIONI.SPECULATIVO) attacco.isSpeculative = true;

        // Campi extra che i moduli possono allegare per l'Hub. Sono una lista
        // chiusa apposta: il payload resta un contratto, non un sacco aperto.
        // (Senza questo, un modulo che calcola le proprie regole e le mette
        // nel payload se le vedeva scartare in silenzio da creaAttacco.)
        ['regole', 'meta', 'fuoriLoF', 'programma'].forEach(function (k) {
            if (input[k] !== undefined) attacco[k] = input[k];
        });

        return { ok: errori.length === 0, attacco, errori, avvisi };
    };

    // ------------------------------------------------------------------
    // creaPayload() — la busta completa verso l'Hub
    // `attacchi` è un array di input per creaAttacco(), uno per unità.
    // ------------------------------------------------------------------
    M.creaPayload = function (attacchi, opzioni) {
        opzioni = opzioni || {};
        const errori = [];
        const avvisi = [];
        const validati = [];

        if (!Array.isArray(attacchi)) {
            errori.push(err('E00', 'creaPayload: atteso un array di attacchi.'));
            return { ok: false, payload: null, errori, avvisi };
        }

        // Un ordine di puro movimento manda legittimamente zero attacchi.
        if (attacchi.length === 0 && !opzioni.consentiVuoto) {
            errori.push(err('E30',
                'Nessun attacco da inviare.',
                'Se è un ordine di puro movimento, chiama creaPayload con { consentiVuoto: true }.'));
        }

        attacchi.forEach((a, i) => {
            const esito = M.creaAttacco(a);
            const etichetta = M.nomeUnita(a && a.attaccante) || `unità #${i + 1}`;
            esito.errori.forEach(e => errori.push(Object.assign({}, e, { unita: etichetta })));
            esito.avvisi.forEach(e => avvisi.push(Object.assign({}, e, { unita: etichetta })));
            if (esito.attacco) validati.push(esito.attacco);
        });

        // Ordine Coordinato: max 4 unità, e solo la Punta di Lancia spara a Burst pieno.
        if (opzioni.isCoordinated && attacchi.length > 4) {
            errori.push(err('E31', `Ordine Coordinato con ${attacchi.length} unità: il massimo è 4.`));
        }

        const payload = {
            isCoordinated: !!opzioni.isCoordinated,
            attacchi: validati,
            motoreVersione: M.VERSIONE,
            timestamp: Date.now()
        };

        return { ok: errori.length === 0, payload, errori, avvisi };
    };

    // ------------------------------------------------------------------
    // onBloccato() — cosa succede quando la validazione fallisce.
    // Default: alert leggibile. Sostituibile con una UI dedicata:
    //   MotoreN5.onBloccato = (errori, avvisi) => { ...mostra un pannello... };
    // ------------------------------------------------------------------
    M.onBloccato = function (errori, avvisi) {
        const righe = errori.map(e => {
            const chi = e.unita ? `[${e.unita}] ` : '';
            const det = e.dettaglio ? `\n    → ${e.dettaglio}` : '';
            return `• ${chi}${e.messaggio}${det}`;
        });
        const testo = '⛔ INVIO BLOCCATO — il calcolo non è stato spedito all\'Hub.\n\n' + righe.join('\n\n');
        if (typeof G.alert === 'function') G.alert(testo);
        console.error(testo, { errori, avvisi });
    };

    // ------------------------------------------------------------------
    // inviaCalcolo() — l'UNICA porta verso l'Hub.
    // Blocca se la validazione fallisce. Ritorna true solo se ha spedito.
    // ------------------------------------------------------------------
    M.inviaCalcolo = function (attacchi, opzioni) {
        const esito = M.creaPayload(attacchi, opzioni);

        if (!esito.ok) {
            M.onBloccato(esito.errori, esito.avvisi);
            return false;
        }

        if (esito.avvisi.length > 0) {
            console.warn('⚠️ MotoreN5: invio effettuato con avvisi', esito.avvisi);
            esito.payload.avvisi = esito.avvisi;
        }

        if (typeof G.inviaCalcoloAllHub === 'function') {
            G.inviaCalcoloAllHub(esito.payload);
        } else {
            console.error('MotoreN5: inviaCalcoloAllHub non disponibile (motore_core.js non caricato).');
            return false;
        }
        return true;
    };

    // ------------------------------------------------------------------
    // Diagnostica: verifica che il contratto sia allineato all'Hub.
    // Da chiamare in console durante il collaudo.
    // ------------------------------------------------------------------
    M.autotest = function () {
        const problemi = [];
        Object.keys(M.SPEC).forEach(a => {
            if (!Object.values(M.AZIONI).includes(a)) problemi.push(`SPEC contiene "${a}" che non è in AZIONI`);
        });
        Object.values(M.AZIONI).forEach(a => {
            if (!M.SPEC[a]) problemi.push(`AZIONI contiene "${a}" senza SPEC corrispondente`);
        });
        if (!G.CATALOGO_N5) problemi.push('catalogo_n5.js non caricato');
        return problemi.length ? problemi : ['contratto coerente'];
    };


    // ==================================================================
    // PARTE 2: PROFILO ARMA E GITTATE
    // ------------------------------------------------------------------
    // Sostituisce window.getWeaponProfile(), che oggi vive dentro
    // ordine_attacco_bs.js ed è una dipendenza nascosta di CC, hacking,
    // speculativo e guidato.
    //
    // Differenze rispetto alla versione attuale:
    //  1. arma non trovata -> nonTrovata:true (il contratto blocca), non un
    //     profilo generico silenzioso;
    //  2. chiavi di gittata lette con una regex (p|m)(numero), non con cinque
    //     includes() in fila: 'm3b' e 'm3_2' funzionavano solo per fortuna;
    //  3. chiave non riconosciuta -> avviso esplicito, non banda a 0;
    //  4. match approssimato solo se produce UN candidato: se sono più di uno
    //     è ambiguità, e l'ambiguità si dichiara invece di prendere il primo;
    //  5. munizioni separate solo dalla virgola. Il vecchio split /[\/,]/ di
    //     ordine_attacco_cc.js spezzava "E/M" in "E" e "M" e "N/A" in "N" e "A".
    // ==================================================================

    function dbArmi() {
        // 🔴 Qui c'era un ripiego a `G.DB_ARMI`, un nome che NESSUN file del
        // progetto definisce. Un ramo che accetta un nome inesistente non
        // protegge da niente: lo tiene in vita e lo fa sembrare una variante
        // legittima, cosi` che chi scrive un modulo nuovo copiandolo da qui
        // reintroduce l'errore. E` esattamente cio` che e` successo con
        // DB_PANO in roster_manager.js.
        // L'unico nome canonico e` RULES_WEAPONS, definito in database_comune.js.
        return M._dbArmi || G.RULES_WEAPONS || null;
    }

    function normalizza(s) {
        return String(s || '').replace(/\s+/g, ' ').trim();
    }

    // "AP + DA CC Weapon" e "AP+DA CC Weapon" sono la stessa arma: il
    // database usa la seconda grafia, tre profili usano la prima.
    function normalizzaNomeArma(s) {
        return normalizza(s).replace(/\s*\+\s*/g, '+');
    }

    // --- munizioni -----------------------------------------------------
    M.opzioniMunizioni = function (stringaAmmo) {
        const grezze = String(stringaAmmo || 'N').split(',').map(a => a.trim()).filter(Boolean);
        return grezze.length ? grezze : ['N'];
    };

    M.munizioneNota = function (nome) {
        const C = G.CATALOGO_N5;
        if (!C) return true;
        const u = String(nome || '').toUpperCase();
        if (u === 'N/A' || u === 'NESSUNA') return true;
        const chiavi = Object.keys(C.MUNIZIONI || {}).concat(Object.keys(C.MUNIZIONI_COMBINATE || {}));
        return chiavi.some(k => k.toUpperCase() === u);
    };

    // --- bande di gittata ----------------------------------------------
    // Chiave -> MOD. 'p'=positivo, 'm'=negativo, seguito dal valore.
    // Suffissi liberi ammessi per distinguere bande con lo stesso MOD
    // (es. 'm3b', 'm3_2' del Marksman Rifle e del MULTI Sniper).
    M.modDaChiaveGittata = function (chiave) {
        const m = /^([pm])(\d+)/i.exec(String(chiave || '').trim());
        if (!m) return null;
        const valore = parseInt(m[2], 10);
        return m[1].toLowerCase() === 'p' ? valore : -valore;
    };

    // Passo standard delle bande sul Weapon Chart N5: colonne da 8 pollici.
    M.PASSO_GITTATA = 8;

    M.bandeGittata = function (ranges) {
        const bande = [];
        const avvisi = [];
        if (!ranges) return { bande, avvisi };

        // ---- FORMATO NUOVO: lista ordinata, una voce per banda da 8" ----
        // [3, 3, -3, -3, -6, -6]  ->  0-8:+3  8-16:+3  16-24:-3 ... 40-48:-6
        // Oppure lista esplicita: [{a:16, mod:3}, {a:32, mod:-3}]
        if (Array.isArray(ranges)) {
            let inizioL = 0;
            ranges.forEach(function (v, i) {
                let mod, fine;
                if (v && typeof v === 'object') { mod = v.mod; fine = v.a; }
                else { mod = v; fine = (i + 1) * M.PASSO_GITTATA; }

                if (mod === null || mod === undefined || mod === '--') {
                    return;   // colonna fuori gittata: non genera banda
                }
                if (typeof mod !== 'number' || !isFinite(mod)) {
                    avvisi.push(err('A30', `Banda ${i} con MOD non numerico: ignorata.`));
                    return;
                }
                bande.push({ mod: mod, da: inizioL, a: fine, label: `${inizioL}-${fine}"`, indice: i });
                inizioL = fine;
            });
            return { bande, avvisi, formato: 'lista' };
        }

        if (typeof ranges !== 'object') return { bande, avvisi };

        // ---- FORMATO LEGACY: oggetto {p3:16, m3:32, m6:48} ----
        // Una chiave per MOD, quindi non puo` esprimere due bande con lo stesso
        // MOD: da qui le chiavi-tappabuchi tipo 'm3_2'. Supportato finche` il
        // database non e` migrato, ma non estenderlo.
        let inizio = 0;
        Object.keys(ranges).forEach(chiave => {
            const mod = M.modDaChiaveGittata(chiave);
            const fine = parseInt(ranges[chiave], 10);

            if (mod === null) {
                avvisi.push(err('A30',
                    `Banda di gittata "${chiave}" non riconosciuta: ignorata.`,
                    'Le chiavi valide sono p0/p3/p6/m3/m6 con eventuale suffisso (m3b, m3_2).'));
                return;
            }
            if (!isFinite(fine)) {
                avvisi.push(err('A31', `Banda "${chiave}" senza distanza valida: ignorata.`));
                return;
            }
            if (fine <= inizio) {
                avvisi.push(err('A32',
                    `Banda "${chiave}" con distanza ${fine}" non crescente (la precedente finiva a ${inizio}").`,
                    'Le gittate vanno elencate in ordine di distanza crescente.'));
            }
            bande.push({
                mod: mod,
                da: inizio,
                a: fine,
                label: `${inizio}-${fine}"`,
                chiave: chiave
            });
            inizio = fine;
        });
        return { bande, avvisi, formato: 'legacy' };
    };

    // Data una distanza in pollici, quale banda si applica.
    M.bandaPerDistanza = function (arma, pollici) {
        if (!arma || !Array.isArray(arma.bands) || arma.bands.length === 0) return null;
        const d = parseFloat(pollici);
        if (!isFinite(d) || d < 0) return null;
        for (let i = 0; i < arma.bands.length; i++) {
            if (d <= arma.bands[i].a) return { indice: i, banda: arma.bands[i] };
        }
        return { indice: -1, banda: null, fuoriGittata: true, massimo: arma.bands[arma.bands.length - 1].a };
    };

    // --- ricerca del profilo -------------------------------------------
    function cercaChiave(db, nome) {
        const chiavi = Object.keys(db);
        const n = nome.toLowerCase();
        const esatta = chiavi.find(k => k.toLowerCase() === n);
        if (esatta) return { chiave: esatta, esatta: true };
        const candidati = chiavi.filter(k => k.toLowerCase().indexOf(n) === 0);
        if (candidati.length === 1) return { chiave: candidati[0], esatta: false };
        if (candidati.length > 1) return { ambigue: candidati };
        return null;
    }

    M.profiloArma = function (nomeRichiesto) {
        const avvisi = [];
        const nome = normalizzaNomeArma(nomeRichiesto);
        const db = dbArmi();

        const segnaposto = {
            nome: nome, nomeRichiesto: nome, nonTrovata: true,
            burst: 1, dam: 13, ammo: 'N', ammoOpzioni: ['N'],
            bands: [], isTemplate: false, isCC: false,
            notazioni: [], avvisi: avvisi
        };

        if (!nome) {
            avvisi.push(err('A40', 'Nessun nome arma passato a profiloArma().'));
            return segnaposto;
        }
        if (!db) {
            avvisi.push(err('A41', 'Database armi non caricato (RULES_WEAPONS assente).'));
            return segnaposto;
        }

        // 0. alias -> voce canonica (RULES_WEAPONS_ALIAS: 30 nomi alternativi)
        const al = M.risolviAlias(nome);
        if (al && db[al.canonico] && normalizza(al.canonico).toLowerCase() !== nome.toLowerCase()) {
            const p2 = M.profiloArma(al.canonico);
            p2.nomeRichiesto = nome;
            p2.viaAlias = al.alias;
            return p2;
        }

        // 1. nome completo così com'è (copre "MULTI Rifle (AP)", "... (AP Mode)")
        let esito = cercaChiave(db, nome);
        let notazioni = [];

        // 2. altrimenti separa le parentesi: possono essere parte del nome
        //    ufficiale oppure notazioni di profilo come (+1B) o (PH=10)
        if (!esito || esito.ambigue) {
            const gruppi = [];
            const base = normalizza(nome.replace(/\(([^)]*)\)/g, (_, g) => { gruppi.push(g.trim()); return ' '; }));
            if (base && base !== nome) {
                const perBase = cercaChiave(db, base);
                if (perBase && !perBase.ambigue) {
                    esito = perBase;
                    notazioni = gruppi;
                } else {
                    // 3. base + un singolo gruppo: "MULTI Rifle" + "AP" -> "MULTI Rifle (AP)"
                    for (let i = 0; i < gruppi.length && (!esito || esito.ambigue); i++) {
                        const tentativo = cercaChiave(db, `${base} (${gruppi[i]})`);
                        if (tentativo && !tentativo.ambigue) {
                            esito = tentativo;
                            notazioni = gruppi.filter((_, j) => j !== i);
                        }
                    }
                }
            }
        }

        if (!esito) {
            avvisi.push(err('A42', `Arma "${nome}" non presente nel database armi.`));
            return segnaposto;
        }
        if (esito.ambigue) {
            avvisi.push(err('A43',
                `Nome arma "${nome}" ambiguo: corrisponde a ${esito.ambigue.length} profili.`,
                esito.ambigue.join(' | ')));
            return segnaposto;
        }

        const p = db[esito.chiave];

        // 🔴 Voce-contenitore: "MULTI Rifle" ha solo modalita:[...], niente
        // b/dam/bande. Leggere .bande qui sarebbe un errore: si intercetta.
        if (Array.isArray(p.modalita) && p.modalita.length > 0) {
            // Le notazioni scritte sul nome base valgono per TUTTE le
            // modalità: "Heavy Rocket Launcher (PS=5)" significa PS 5 in
            // ogni modalità, quali che siano i valori del Weapon Chart.
            const gruppi = [];
            String(nomeRichiesto || '').replace(/\(([^)]*)\)/g, (_, g) => { gruppi.push(g.trim()); return ' '; });
            return {
                nome: esito.chiave, nomeRichiesto: nome, nonTrovata: false,
                soloModalita: true, modalita: p.modalita.slice(),
                notazioniEreditate: gruppi,
                burst: null, dam: null, ammo: null, ammoOpzioni: [],
                bands: [], isTemplate: false, isCC: false,
                traits: '', traitsFonte: null, notazioni: gruppi,
                avvisi: [err('A51b',
                    `"${esito.chiave}" richiede la scelta di una modalità.`,
                    'Modalità disponibili: ' + p.modalita.join(', '))]
            };
        }

        if (!esito.esatta) {
            avvisi.push(err('A44', `Arma "${nome}" risolta come "${esito.chiave}" (corrispondenza parziale).`));
        }

        // bande
        let bands = [];
        // 🔴 Una Sagoma puo` avere ANCHE le gittate: le Granate e i Missile
        // Launcher ce le hanno. Il vecchio controllo guardava solo `ranges`,
        // quindi col nuovo campo `bande` le buttava via e lo Speculativo
        // calcolava senza MOD di gittata.
        let modo = null, senzaGittata = false, risolveComeCC = false;
        if (p.isTemplate && !p.bande && !p.ranges) {
            bands = [{ mod: 0, da: 0, a: 0, label: `Sagoma ${p.template || ''}`.trim(), chiave: 'template' }];
        } else if (p.bande || p.ranges) {
            const r = M.bandeGittata(p.bande || p.ranges);
            bands = r.bande;
            r.avvisi.forEach(a => avvisi.push(Object.assign({}, a, { arma: esito.chiave })));
        } else if (p.risoluzione) {
            // 🔴 Cinque armi non hanno bande, ne` isTemplate ne` isCC: si
            // risolvono in un altro modo, dichiarato nel campo `risoluzione`.
            // Il dato c'era e non lo leggevo: creaAttacco le respingeva con
            // E09 e 84 profili non potevano usarle.
            modo = catalogo('RISOLUZIONI')[p.risoluzione] || null;
            if (!modo) {
                avvisi.push(err('A45',
                    `"${esito.chiave}" dichiara il modo "${p.risoluzione}", che non è nel catalogo.`));
            } else if (modo.comeCC) {
                risolveComeCC = true;
            } else {
                senzaGittata = true;
                bands = [{ mod: 0, da: 0, a: 0, label: modo.etichetta, chiave: 'risoluzione' }];
                if (modo.fonte === 'dedotto') {
                    avvisi.push(err('A47',
                        `Modo di risoluzione di "${esito.chiave}" dedotto dai Tratti, non letto da una scheda.`,
                        'Da verificare su fonte ufficiale: ' + modo.etichetta));
                }
            }
        } else if (p.armaDalProfilo) {
            // 🔴 armaDalProfilo: "non risolvere l'attacco con me, usa l'arma fra
            // parentesi nel profilo del portatore" (riga 6502). L'Armed Turret
            // non spara con se stessa: spara con la Combi Rifle o il Marksman
            // Rifle scritti fra parentesi. Prima questo ramo dava A45 — il
            // lettore che mancava. La risolve M.armaTorretta. (Chat REGOLE.)
            // (il flag va nel profilo restituito, sotto: qui non si scrive)
        } else if (!p.isCC) {
            avvisi.push(err('A45', `"${esito.chiave}" non ha gittate né flag isTemplate/isCC né un modo di risoluzione.`));
        }

        // munizioni
        const ammoOpzioni = M.opzioniMunizioni(p.ammo);
        // Se l'arma dichiara il proprio salvAttr, l'attributo si sa già: si
        // passa alla munizione, così non emette l'assunto "AP: assunto ARM".
        // Senza, l'avviso scattava 45 volte su dati perfettamente corretti,
        // e un avviso che grida sempre nessuno lo legge più.
        const attrDaChart = p.salvAttr ? (M.parseSalvAttr(p.salvAttr) || {}).attributo : null;
        ammoOpzioni.forEach(a => {
            const ris = M.risolviMunizione(a, attrDaChart ? { attributoArma: attrDaChart } : {});
            ris.avvisi.forEach(av => avvisi.push(Object.assign({}, av, { arma: esito.chiave })));
        });

        const burst = parseInt(p.b, 10);
        let dam = (p.dam === '-' || p.dam === undefined) ? null : parseInt(p.dam, 10);

        // 🔴 "(PS=6)" nel profilo SOSTITUISCE il PS dell'arma. Il PS entra in
        // OGNI Tiro Salvezza, quindi ignorarlo falsava tutti i danni di quelle
        // armi (nel db PanOceania sono ~60 voci fra CC Weapon e pistole).
        const psSost = notazioni.map(M.parseNotazione)
            .filter(n => n.tipo === 'SOSTITUZIONE' && n.attributo === 'PS');
        if (psSost.length > 0) {
            avvisi.push(err('A48',
                `PS di "${esito.chiave}" sostituito: ${dam} → ${psSost[0].valore} come da profilo.`));
            dam = psSost[0].valore;
        }

        // Tratti: ora il DATABASE li ha (campo traits). Il catalogo resta come
        // ripiego per le armi che il db non copre ancora.
        let traits = '';
        let traitsFonte = null;
        if (p.traits !== undefined && p.traits !== null) {
            traits = Array.isArray(p.traits) ? p.traits.join(', ') : String(p.traits);
            traitsFonte = 'database';
        } else {
            const vociTratti = catalogo('TRATTI_ARMA')[esito.chiave] || null;
            if (vociTratti) {
                traits = vociTratti.traits.join(', ');
                traitsFonte = vociTratti.fonte;
                if (vociTratti.fonte === 'dedotto') {
                    avvisi.push(err('A47',
                        `Tratti di "${esito.chiave}" dedotti dal tipo di arma, non letti da una scheda.`,
                        'Da verificare in collaudo: ' + vociTratti.traits.join(', ')));
                }
            } else {
                avvisi.push(err('A49', `"${esito.chiave}" non ha il campo traits nel database armi.`));
            }
        }
        return {
            // Letto da chi riceve il profilo: l'attacco si risolve con l'arma fra
            // parentesi del portatore, non con questa voce (riga 6502).
            armaDalProfilo: !!p.armaDalProfilo,
            nome: esito.chiave,
            nomeRichiesto: nome,
            nonTrovata: false,
            traits: traits,
            traitsFonte: traitsFonte,
            burst: isFinite(burst) ? burst : 1,
            dam: isFinite(dam) ? dam : null,
            ammo: ammoOpzioni[0],
            ammoOpzioni: ammoOpzioni,
            bands: bands,
            isTemplate: !!p.isTemplate,
            template: p.template || null,
            isCC: !!p.isCC || !!risolveComeCC,
            risoluzione: p.risoluzione || null,
            modoRisoluzione: modo,
            senzaGittata: !!senzaGittata,
            // Dal Weapon Chart: hanno la PRECEDENZA sulla munizione.
            salvAttr: p.salvAttr || null,
            // salvAttrDaProfilo: RITIRATO. Vedi tiroSalvezza, avviso A79.
            salvTiri: p.salvTiri || null,
            notazioni: notazioni,
            avvisi: avvisi
        };
    };

    // Elenco delle armi utilizzabili di un'unità, filtrate per tipo di azione.
    M.armiDisponibili = function (unita, azione) {
        const nomi = M.dividiLista(((unita && unita.weapon) || '') + ',' + ((unita && unita.equip) || ''));
        const spec = M.SPEC[azione] || {};
        return nomi.map(n => M.profiloArma(n)).filter(a => {
            if (a.nonTrovata) return true;              // la mostriamo, il contratto la bloccherà
            if (spec.attributo === 'CC') return a.isCC;
            // 🔴 Il requisito e` il TRATTO, non la forma dell'arma.
            //   "BS Weapon with the Intuitive Attack Trait"
            //   "BS Weapon with the Speculative Attack Trait"
            // Filtrare su isTemplate o sulle bande offriva armi che il Tratto
            // non l'hanno: lo Speculativo proponeva un Combi Rifle, un
            // Heavy Flamethrower e una Chain Rifle.
            // (Segnalato dalla chat REGOLE, giro del 20 settembre.)
            const trattiA = String(a.traits || '');
            if (azione === M.AZIONI.INTUITIVO) return /Intuitive Attack/i.test(trattiA);
            if (azione === M.AZIONI.SPECULATIVO) return /Speculative Attack/i.test(trattiA);
            return !a.isCC;
        });
    };

    // Ponte opt-in per i moduli non ancora riscritti. NON si installa da solo:
    // va chiamato esplicitamente, così resta chiaro chi dipende da cosa.
    M.installaCompatibilita = function () {
        G.getWeaponProfile = function (nome) { return M.profiloArma(nome); };
        console.warn('MotoreN5: getWeaponProfile() ora è un ponte verso profiloArma(). Temporaneo.');
    };


    // ==================================================================
    // PARTE 3: RISOLUZIONE DELLE MUNIZIONI
    // ------------------------------------------------------------------
    // In N5 i tipi di munizione sono ESATTAMENTE undici. Le combinate non
    // sono una tabella chiusa: si COMPONGONO dalle basi (regola ufficiale
    // "Combined Ammunition works as a single Ammunition that adds the
    // effects of the different Ammunitions that compose it").
    //
    // risolviMunizione() e` la base su cui poggera` tiroSalvezza().
    // ==================================================================

    function catalogo(sezione) {
        return (G.CATALOGO_N5 && G.CATALOGO_N5[sezione]) || {};
    }

    function vocebase(nome) {
        const MU = catalogo('MUNIZIONI');
        const u = String(nome).toUpperCase();
        const chiave = Object.keys(MU).find(k => k.toUpperCase() === u);
        if (!chiave) return null;
        let voce = MU[chiave];
        if (voce && voce.alias) {                       // 'NORMALE' -> 'N'
            const vero = Object.keys(MU).find(k => k.toUpperCase() === String(voce.alias).toUpperCase());
            if (vero) return { chiave: vero, voce: MU[vero] };
        }
        return { chiave, voce };
    }

    // Priorità dell'attributo quando si compongono più basi:
    // PH (PARA, tiro speciale) > BTS (E/M) > ARM|BTS (AP, ereditato dall'arma) > ARM
    function attributoPiuForte(a, b) {
        const ordine = { 'PH': 4, 'BTS': 3, 'ARM|BTS': 2, 'ARM': 1, 'nessuno': 0 };
        return (ordine[a] || 0) >= (ordine[b] || 0) ? a : b;
    }

    M.risolviMunizione = function (nome, opzioni) {
        opzioni = opzioni || {};
        const avvisi = [];
        const grezzo = String(nome || '').trim();
        const u = grezzo.toUpperCase();

        const esito = {
            nome: grezzo, basi: [], ok: false, rimossa: false, nonOffensiva: false,
            salvezze: 1, attributo: 'ARM', dimezza: false, tiroSpeciale: null,
            dannoPerFallimento: 1, statiFallimento: [], critExtra: 1,
            note: [], avvisi: avvisi
        };

        if (!grezzo || u === 'N/A' || u === 'NESSUNA') {
            esito.ok = true; esito.nonOffensiva = true; esito.salvezze = 0;
            esito.attributo = 'nessuno';
            esito.note.push('Azione senza Tiro Salvezza.');
            return esito;
        }

        // Tiro Salvezza Combinato (attributi diversi) — regola distinta dalle combinate
        if (u === 'ARM+BTS') {
            esito.ok = true; esito.salvezze = 2; esito.attributo = 'ARM+BTS'; esito.basi = ['ARM', 'BTS'];
            esito.note.push('Tiro Salvezza Combinato: una salvezza su ARM e una su BTS. Il Critico aggiunge una salvezza su ARM.');
            return esito;
        }

        // Munizione ritirata da N5
        const RIM = catalogo('MUNIZIONI_RIMOSSE');
        const chiaveRim = Object.keys(RIM).find(k => k.toUpperCase() === u);
        if (chiaveRim) {
            const r = RIM[chiaveRim];
            esito.rimossa = true;
            avvisi.push(err('A50',
                `Munizione "${grezzo}" non esiste in N5 (era ${r.edizione}).`,
                r.note + (r.sostituto ? ` Sostituto in N5: ${r.sostituto}.` : '')));
            if (r.sostituto) {
                const sost = M.risolviMunizione(r.sostituto, opzioni);
                sost.avvisi = avvisi.concat(sost.avvisi);
                sost.rimossa = true;
                sost.nome = grezzo;
                sost.note.push(`Risolta come ${r.sostituto} (equivalente N5 di ${grezzo}).`);
                return sost;
            }
            return esito;
        }

        // Composizione: una o più basi separate da '+'
        const pezzi = u.split('+').map(x => x.trim()).filter(Boolean);
        let trovate = 0;

        pezzi.forEach(pezzo => {
            const b = vocebase(pezzo);
            if (!b) {
                avvisi.push(err('A51', `Componente "${pezzo}" di "${grezzo}" non presente nel catalogo munizioni.`));
                return;
            }
            trovate++;
            esito.basi.push(b.chiave);
            const v = b.voce;

            if (v.nonOffensiva) { esito.nonOffensiva = true; esito.salvezze = 0; }
            else {
                // il numero di salvezze e` quello della base che ne chiede di piu`
                esito.salvezze = Math.max(esito.salvezze, v.salvezze || 0);
                esito.dannoPerFallimento = Math.max(esito.dannoPerFallimento, v.dannoPerFallimento || 0);
            }
            if (v.dimezza) esito.dimezza = true;
            if (v.tiroSpeciale) esito.tiroSpeciale = v.tiroSpeciale;
            if (v.attributo) esito.attributo = attributoPiuForte(esito.attributo, v.attributo);
            if (v.statoFallimento) esito.statiFallimento.push(v.statoFallimento);
            if (v.note) esito.note.push(`${b.chiave}: ${v.note}`);
        });

        if (trovate === 0) {
            avvisi.push(err('A52',
                `Munizione "${grezzo}" sconosciuta.`,
                'In N5 esistono solo: N, AP, DA, EXP, SHOCK, E/M, T2, PARA, STUN, SMOKE, ECLIPSE (piu` le combinate col +).'));
            return esito;
        }

        // AP da solo lascia l'attributo all'arma
        if (esito.attributo === 'ARM|BTS') {
            if (opzioni.attributoArma === 'BTS' || opzioni.attributoArma === 'ARM') {
                esito.attributo = opzioni.attributoArma;
                esito.note.push(`Attributo ${opzioni.attributoArma} ereditato dall'arma (AP dimezza quello che l'arma usa).`);
            } else {
                esito.attributo = 'ARM';
                avvisi.push(err('A53',
                    `"${grezzo}" dimezza ARM o BTS a seconda dell'arma: assunto ARM.`,
                    'Passa { attributoArma: "BTS" } se l\'arma colpisce il BTS.'));
            }
        }

        esito.ok = (trovate === pezzi.length) && !esito.rimossa;
        return esito;
    };

    // Elenco leggibile dei tipi validi, per i messaggi di errore e la UI.
    M.munizioniValide = function () {
        const MU = catalogo('MUNIZIONI');
        return Object.keys(MU).filter(k => !MU[k].alias);
    };


    // ==================================================================
    // PARTE 4: STATI DEL BERSAGLIO E FILTRO BERSAGLI
    // ------------------------------------------------------------------
    // Sostituisce i SEI filtri divergenti sparsi in ordine_attacco_bs.js,
    // _cc.js, _hacking.js, _intuitivo.js, _fuoco_speculativo.js e _guidato.js.
    //
    // Regole verificate sulla wiki N5.2:
    //  - Camouflaged State: "You cannot declare Attacks against Camouflaged
    //    Markers, it is necessary to Discover that Marker first, unless
    //    otherwise specified by a rule or Skill."
    //  - Intuitive Attack: il bersaglio DEVE essere fuori LoF per Zona di
    //    Visibilità Zero, oppure in uno stato che normalmente impedirebbe di
    //    attaccarlo senza Scoprirlo. È il filtro INVERSO di BS Attack.
    //  - Multispectral Visor L3: in Turno Attivo può fare BS Attack su un
    //    Marker CAMO in LoF senza Scoprire, applicando il Mimetismo.
    //  - Decoy: "must be considered as Models for LoF purposes and may be
    //    targeted" — a differenza di CAMO/IMP, i Decoy SI bersagliano.
    //  - Nessuna regola protegge un Incosciente: ferite oltre VITA lo portano
    //    a Morto, quindi è un bersaglio legittimo sia in BS sia in CC.
    //    (Il modulo BS attuale lo escludeva: era un errore.)
    // ==================================================================

    // Lettura normalizzata dello stato. Oggi ogni modulo interroga u.state,
    // u.deployState e u.states.* in modo diverso: qui una volta sola.
    M.statoBersaglio = function (u) {
        u = u || {};
        const st = u.states || {};
        const principale = String(u.state || 'ACTIVE').toUpperCase();
        const deploy = String(u.deployState || 'NORMAL').toUpperCase();
        const tipo = String(u.tipo || 'LI').toUpperCase();

        const base = {
            tipo: tipo,
            morto:        principale === 'DEAD' || !!st.dead,
            incosciente:  principale === 'UNCONSCIOUS' || !!st.unconscious,
            hidden:       deploy === 'HIDDEN' || deploy === 'RESERVE' || deploy === 'AD' || !!st.hidden,
            // 🔴 PREDEFINITO DEL PROFILO contro STATO REALE.
            // 49 profili del database portano state:'CAMO' e deployState:'CAMO'
            // come PREDEFINITO: "questa truppa si schiera come Marker". Non e`
            // lo stato attuale — appena viene Scoperta non lo e` piu`.
            // Se `states` dice esplicitamente false, quella e` la verita`:
            // l'app puo` dichiarare "rivelata" senza dover ripulire il
            // profilo. Se `states` tace, vale il predefinito.
            camo:         (st.camo === false) ? false
                          : (deploy.indexOf('CAMO') === 0 || principale.indexOf('CAMO') === 0 || !!st.camo),
            imp:          (st.impersonation === false) ? false
                          : (deploy.indexOf('IMP') === 0 || principale.indexOf('IMP') === 0 || !!st.impersonation),
            // Letti anche da states.*: e` cosi` che li scrive la pagina Stati,
            // e prima venivano visti solo dal tipo o dal deployState.
            decoy:        tipo === 'DECOY' || deploy === 'DECOY' || !!st.decoy,
            holoecho:     tipo === 'HOLOECHO' || deploy === 'HOLOECHO' || !!st.holoecho,
            holomask:     deploy === 'HOLOMASK' || !!st.holomask,
            engaged:      !!st.engaged,
            targeted:     !!st.targeted,
            suppressive:  !!st.suppressive,
            isolato:      !!st.isolated,
            disconnesso:  !!st.disconnected,
            immA:         !!st.immobilizedA,
            immB:         !!st.immobilizedB,
            // Mancavano: il tabellone li mostra, il motore non li vedeva.
            // prone: NON GESTITO DALL'APP. Il Prone State ESISTE nel regolamento
            // (indice, riga 328): e` l'app che non lo traccia, per decisione di
            // Paolo — non da` MOD al calcolo, e CATALOGO_N5.STATI non lo aveva.
            // La prima versione di questo commento diceva "non e` uno stato in
            // N5": era falso, e insegnava la regola sbagliata. (Chat TEST.)
            // La dichiarazione sta in CATALOGO_N5.STATI_NON_GESTITI.PRONO.
            stordito:     !!st.stunned || !!st.stordito,
            retreat:      !!st.retreat || principale === 'RETREAT',
            posseduto:    !!st.possessed,
            sepsitorizzato: !!st.sepsitorized,
            foxhole:      deploy === 'FOXHOLE' || !!st.foxhole
        };

        // --- lista dei nomi ATTIVI ---
        // Per chiedere "quali stati ha addosso adesso" senza conoscere in
        // anticipo l'elenco. I nomi sono fissi e normalizzati: l'interfaccia
        // ci mappa sopra le icone senza inventarsi la corrispondenza dai
        // nomi grezzi del profilo, che cambiano da un database all'altro.
        base.attivi = Object.keys(base).filter(function (k) { return base[k] === true; });

        // --- stati che il profilo scrive ma qui non sono normalizzati ---
        // Vanno mostrati lo stesso: meglio un'icona mancante che uno stato
        // invisibile sul tabellone.
        // 🔴 `nonNormalizzati` deve elencare STATI sconosciuti, non VALORI.
        // Uno stato e` un interruttore: o c'e` o non c'e`. Un numero o una
        // stringa dentro `states` e` una quantita` o un dettaglio, e va
        // mostrato diversamente — o non mostrato affatto come icona.
        //
        // Elencarli qui costringeva l'interfaccia a filtrarli a valle, cioe`
        // a tenere una seconda lista di eccezioni accanto alla mia. La lista
        // per nome, oltre a tutto, sarebbe rimasta indietro: `wounds` era
        // fuori, ma anche `suppressiveWeapon`, e chiunque ne aggiunga uno
        // domani lo ritroverebbe fra gli stati.
        const NOTI = ['dead', 'unconscious', 'hidden', 'camo', 'impersonation',
                      'decoy', 'holoecho', 'holomask', 'engaged', 'targeted',
                      'suppressive', 'isolated', 'disconnected', 'immobilizedA',
                      // 'prone' resta fra le chiavi NOTE solo perche` un salvataggio
                      // vecchio non diventi un allarme: e` ritirata, nessuno la legge.
                      'immobilizedB', 'prone', 'retreat', 'stunned', 'stordito',
                      'blinded', 'possessed', 'sepsitorized', 'foxhole',
                      'fireteam', 'isFireteamLeader', 'wounds', 'suppressiveWeapon'];
        base.nonNormalizzati = Object.keys(st).filter(function (k) {
            // solo booleani veri: un valore non e` uno stato
            return st[k] === true && NOTI.indexOf(k) < 0;
        });

        // I valori non-booleani di `states` restano disponibili, ma separati:
        // l'interfaccia sa che sono dettagli, non icone da accendere.
        base.dettagli = {};
        Object.keys(st).forEach(function (k) {
            if (st[k] !== true && st[k] !== false && st[k] != null) base.dettagli[k] = st[k];
        });

        // --- quantita`, non solo presenza ---
        // Il tabellone deve poter mostrare "2 Ferite" e "Fireteam A, Livello 3",
        // non solo che lo stato c'e`.
        base.quantita = {
            // Ferite SUBITE (states.wounds, scritto a runtime) e totale del
            // profilo: sono due numeri diversi e il tabellone li vuole
            // entrambi — "2 di 3" dice piu` di "2".
            feriteSubite: (st.wounds != null) ? parseInt(st.wounds, 10) : 0,
            ferite: (u.w != null) ? parseInt(u.w, 10) : (u.s != null ? parseInt(u.s, 10) : null),
            attributoFerite: (u.w != null) ? 'VITA' : (u.s != null ? 'STR' : null),
            armaSoppressione: st.suppressiveWeapon || null,
            fireteam: st.fireteam || null,
            leaderFireteam: !!st.isFireteamLeader,
            // ⚠️ Qui si legge il valore SCRITTO NEL PROFILO, non quello che
            // si applica adesso. M.valoreFirewall() lo azzera se il
            // Dispositivo e` disabilitato (Isolato, Stato Nullo) — e per
            // saperlo chiama statoBersaglio, quindi chiamarlo da qui
            // sarebbe una ricorsione infinita.
            // Il tabellone mostra cosa l'unita` HA; il calcolo usa
            // M.valoreFirewall() per sapere cosa VALE in questo momento.
            firewall: (function () {
                const m = /FIREWALL\s*[\(\[]?\s*(-?\d+)/.exec(
                    ((u.skills || '') + ' ' + (u.equip || '')).toUpperCase());
                if (m) return -Math.abs(parseInt(m[1], 10));
                return /FIREWALL/i.test((u.skills || '') + ' ' + (u.equip || '')) ? -3 : 0;
            })(),
            mimetismo: (typeof M.valoreMimetismo === 'function') ? M.valoreMimetismo(u) : 0,
            martialArts: (typeof M.livelloMartialArts === 'function') ? M.livelloMartialArts(u) : 0
        };

        return base;
    };

    // È in forma di Marker non ancora scoperto? (CAMO o IMP, non Decoy/Holoecho)
    // L'HIDDEN DEPLOYMENT NON c'e`: e` uno stato proprio, SENZA Marker sul
    // tavolo (righe 13889, 13893), non una variante del CAMO. Il Marker
    // Mimetico e` uno solo, col Mimetism (-N) del profilo (riga 13607).
    // LIMITE: il passaggio Hidden -> CAMO alla cancellazione, per chi ha
    // anche Camouflage (riga 13917), non e` modellato. (Chat REGOLE.)
    M.inFormaMarker = function (stato) {
        return !!(stato.camo || stato.imp);
    };

    function skillsDi(u) {
        return (((u && u.skills) || '') + ' ' + ((u && u.equip) || '')).toUpperCase();
    }

    M.haMSV3 = function (u) {
        const s = skillsDi(u);
        return s.indexOf('MULTISPECTRAL VISOR L3') >= 0 || s.indexOf('MSV L3') >= 0 || s.indexOf('MSV3') >= 0;
    };

    function hackabile(u) {
        const s = skillsDi(u);
        const t = String((u && u.tipo) || 'LI').toUpperCase();
        return s.indexOf('HACKABLE') >= 0 || s.indexOf('HACKER') >= 0 ||
               t === 'HI' || t === 'TAG' || t === 'REM';
    }

    // ------------------------------------------------------------------
    // bersagliValidi() — NON restituisce la lista già filtrata.
    // Restituisce TUTTI i candidati con ammesso:true/false e il motivo,
    // così la UI può mostrarli in grigio spiegando perché, e in collaudo
    // si vede subito se un bersaglio sparisce per la ragione sbagliata.
    // ------------------------------------------------------------------
    // La scenografia entra fra i bersagli quando l'azione la ammette.
    // Non passa da rosterNemico(), perche` e` NEUTRA: entrambi i giocatori
    // possono agirci, quindi non si filtra per fazione.
    M.bersagliConScenografia = function (azione, candidati, opzioni) {
        opzioni = opzioni || {};
        const spec = M.SPEC[azione] || {};
        const dalRoster = (spec.schieramento === 'scenografia')
            ? []
            : M.bersagliValidi(azione, candidati, opzioni);
        const scenici = M.bersagliScenografia(azione, { arma: opzioni.arma, ammo: opzioni.ammo });
        return dalRoster.concat(scenici);
    };

    M.bersagliValidi = function (azione, candidati, opzioni) {
        opzioni = opzioni || {};
        const spec = M.SPEC[azione];
        const attaccante = opzioni.attaccante || null;
        const programma = String(opzioni.programma || '').toUpperCase();

        if (!Array.isArray(candidati)) {
            const pool = (spec && spec.schieramento === 'alleato') ? M.rosterProprio() : M.rosterNemico();
            candidati = pool;
        }

        return candidati.map(function (u) {
            const nome = M.nomeUnita(u);
            const s = M.statoBersaglio(u);
            const esito = { unita: u, nome: nome, stato: s, ammesso: true, motivo: null, note: [] };

            // I bersagli che l'arma DICHIARA (D-Charges Demolition Mode:
            // strutture, edifici, nemici Immobilizzati o Null; mai Posseduti o
            // Sepsitorizzati). Agisce solo se chi chiama passa opzioni.arma.
            if (opzioni && opzioni.arma) {
                const da = M.bersaglioAmmessoDaArma(opzioni.arma, u);
                if (da.dichiarato && !da.ammesso) {
                    esito.ammesso = false;
                    esito.motivo = da.motivo;
                    return esito;
                }
            }

            // 🔴 HIDDEN DEPLOYMENT: regola ESPLICITA, non effetto collaterale
            // dell'anti-spoiler. "That Trooper is considered not to be on the
            // game table at all."
            // Serve esplicita perche` la truppa che si rivela cambia STATO,
            // non roster: se la legalita` del bersaglio vivesse nel roster,
            // il motore non saprebbe che ora si puo` sparargli.
            if (s.hidden || (u && u.states && u.states.hidden)) {
                esito.ammesso = false;
                esito.motivo = 'In Hidden Deployment: non è sul tavolo, non può essere bersagliata.';
                return esito;
            }

            // 🔴 Nell'Ordine in cui viene piazzato il token NON e` bersagliabile:
            // il nemico reagisce solo contro chi piazza. (regolamento, riga 5532)
            if (u && u.deployable && u.ordineDiPiazzamento != null &&
                opzioni && opzioni.ordineId != null &&
                String(u.ordineDiPiazzamento) === String(opzioni.ordineId)) {
                esito.ammesso = false;
                esito.motivo = 'Appena piazzato: in questo Ordine il nemico può reagire solo contro chi lo ha piazzato.';
                return esito;
            }

            function nega(motivo) { esito.ammesso = false; esito.motivo = motivo; }

            if (!spec) { nega(`Azione "${azione}" sconosciuta.`); return esito; }

            // --- regole valide per ogni azione ---
            if (s.morto)  { nega('Morto: rimosso dal tavolo.'); return esito; }
            if (s.hidden) { nega('In Schieramento Nascosto/Riserva: non è ancora sul tavolo.'); return esito; }

            const marker = M.inFormaMarker(s);

            switch (azione) {

                case M.AZIONI.SCOPRIRE:
                    // Scoprire fa l'esatto contrario: SOLO i Marker sono bersagli validi.
                    if (!marker) nega('Non è in forma di Marker: non c\'è niente da Scoprire.');
                    break;

                case M.AZIONI.INTUITIVO:
                    // Filtro INVERSO del BS Attack: serve un bersaglio che
                    // normalmente non potresti attaccare senza Scoprirlo.
                    if (!marker && !opzioni.fuoriLoF) {
                        nega('L\'Attacco Intuitivo richiede un bersaglio in forma di Marker o fuori LoF per Zona di Visibilità Zero. Questo è visibile: usa un Attacco BS normale.');
                    }
                    break;

                case M.AZIONI.SPECULATIVO:
                    // Tiro parabolico su un punto: ignora la LoF, i Marker vanno bene.
                    break;

                case M.AZIONI.GUIDATO:
                    // Solo il PRIMARIO deve essere in Stato Bersagliato: i secondari
                    // sono presi dalla sagoma e non hanno bisogno di essere designati.
                    if (marker) nega('In forma di Marker: non può essere in Stato Bersagliato.');
                    else if (opzioni.ruolo === 'primario' && !s.targeted) {
                        nega('Non è in Stato Bersagliato: il primario dell\'Attacco Guidato dev\'essere designato.');
                    } else if (!s.targeted) {
                        // 🔴 Qui c'era "fa solo il proprio Tiro Salvezza (nessun
                        // Faccia a Faccia)". Sbagliato: chi e` preso da una Sagoma
                        // puo` SCHIVARE, e la Schivata contro una Sagoma e` concessa
                        // anche senza LoF.
                        // (Segnalato dalla chat REGOLE, giro del 20 settembre.)
                        esito.secondario = true;
                        esito.note.push('Secondario: preso dalla Sagoma, puo` Schivare.');
                        // Il +3 del Bersagliato vale solo verso chi E` Bersagliato,
                        // non verso i secondari.
                        esito.note.push('Il +3 dello Stato Bersagliato non vale contro i secondari.');

                        // Il Reset NON e` per i secondari (righe 7746-7752): evita solo
                        // se l'utente e` il bersaglio, e chi non lo e` fa un Tiro
                        // Normale — un Reset Normale non evita nulla. Il bersaglio
                        // designato del Guidato e` uno solo, quello Bersagliato.
                        // Chat REGOLE, 23 settembre.
                        esito.note.push('Secondario: il Reset non evita nulla. Solo Schivata (PH-3 senza LoF).');
                    }
                    break;

                case M.AZIONI.CC_ATTACK:
                case M.AZIONI.BERSERK:
                case M.AZIONI.PROTHEION:
                    if (s.camo) nega('Marker CAMO: non si può entrare in contatto base-base con un Marker CAMO. Va Scoperto prima.');
                    else if (s.imp) nega('Marker Impersonation: finché non è Scoperto conta come truppa amica.');
                    else if (s.incosciente) esito.note.push('Incosciente: il CC Attack diventa Colpo di Grazia (Morto automatico, nessun Tiro Salvezza) salvo Dogged/NWI attivi.');
                    break;

                case M.AZIONI.HACKING:
                    if (marker) { nega('In forma di Marker: va Scoperto prima di subire un Attacco Comms.'); break; }
                    if (!hackabile(u) && programma !== 'SPOTLIGHT') {
                        nega(`Non è hackerabile (tipo ${s.tipo}, nessun tratto Hackable/Hacker).`);
                        break;
                    }
                    if (programma === 'TRINITY' && skillsDi(u).indexOf('HACKER') < 0) nega('Trinity colpisce solo Hacker nemici.');
                    else if (programma === 'TOTAL CONTROL' && s.tipo !== 'TAG') nega('Total Control funziona solo contro i TAG.');
                    // 🔴 "an enemy TAG, or a TAG in Possessed State" (riga 5286).
                    // Un TAG ALLEATO Posseduto e` bersaglio legittimo: ogni
                    // salvezza fallita ne CANCELLA il Posseduto (righe 5292-5295).
                    // Prima si ammettevano solo i TAG nemici, e un proprio TAG
                    // posseduto non si poteva liberare.
                    // (Segnalato dalla chat REGOLE, giro del 21 settembre.)
                    else if (programma === 'TOTAL CONTROL' && s.posseduto) {
                        esito.note.push('TAG Posseduto: ogni salvezza fallita cancella il Posseduto e lo riporta a Normale.');
                    }
                    break;

                case M.AZIONI.SUPPORTO_WIP:
                case M.AZIONI.SUPPORTO_BS:
                    // Bersagli ALLEATI, non nemici.
                    if (!s.incosciente && !(opzioni.consentiFeriti && !s.incosciente)) {
                        nega('Il Supporto (Dottore/Ingegnere) bersaglia alleati Incoscienti o macchine con Ferite.');
                    }
                    break;

                default:
                    // BS Attack, Attacco a Sorpresa e ogni futura azione a distanza
                    if (s.camo || s.imp) {
                        if (attaccante && M.haMSV3(attaccante)) {
                            esito.note.push('Marker attaccabile senza Scoprire grazie al Multispectral Visor L3: applica comunque il Mimetismo.');
                        } else {
                            nega(s.camo
                                ? 'Marker CAMO: va Scoperto prima (oppure usa un Attacco Intuitivo).'
                                : 'Marker Impersonation: va Scoperto prima.');
                        }
                    }
                    break;
            }

            // Note informative, non bloccanti
            if (esito.ammesso) {
                if (s.decoy)       esito.note.push('Decoy: bersagliabile come un modello, ma potrebbe essere una replica.');
                if (s.holoecho)    esito.note.push('Holoecho: potrebbe essere una copia olografica.');
                if (s.engaged && spec.attributo === 'BS') esito.note.push('In mischia: il tiro subisce -6 BS.');
                if (s.suppressive) esito.note.push('In Fuoco di Soppressione: -3 al tuo attributo entro 0-24".');
                if (s.targeted && azione !== M.AZIONI.GUIDATO) esito.note.push('Bersagliato: +3 al tuo attributo.');
            }
            return esito;
        });
    };

    // Comodo per la UI: solo gli ammessi.
    M.soloAmmessi = function (esiti) {
        return esiti.filter(function (e) { return e.ammesso; }).map(function (e) { return e.unita; });
    };


    // ==================================================================
    // PARTE 5: BURST INIZIALE
    // ------------------------------------------------------------------
    // Sostituisce le tre copie divergenti in ordine_attacco_bs/_cc/_hacking.
    //
    // Correzione rispetto al codice attuale: quello cercava "+1B" ovunque
    // nella stringa skills, quindi un profilo con "CC Attack (+1B)" dava il
    // dado extra anche agli Attacchi BS. Il MOD tra parentesi vale solo per
    // la skill a cui e` attaccato.
    // Inoltre "+1B" vale SOLO in Turno Attivo, mai in ARO.
    // ==================================================================

    M.burstIniziale = function (unita, arma, opzioni) {
        opzioni = opzioni || {};
        const voci = [];
        const avvisi = [];
        const MAXB = meccaniche().BURST_MAX;
        const attivo = (opzioni.turnoAttivo !== false);

        let base = (arma && typeof arma.burst === 'number') ? arma.burst : 1;
        voci.push({ fonte: 'arma', valore: base, motivo: `Burst dell'arma${arma && arma.nome ? ' ' + arma.nome : ''}` });
        let totale = base;

        // Ordine Coordinato: solo la Punta di Lancia spara a Burst pieno.
        if (opzioni.coordMode && opzioni.indiceCoord > 0) {
            voci.push({ fonte: 'coordinato', valore: 1 - totale, motivo: 'Gregario di Ordine Coordinato: Burst 1' });
            return { valore: 1, base: base, voci: voci, note: [], avvisi: avvisi };
        }

        // "<Skill> (+1B)": il bonus vale solo per la skill a cui e` attaccato.
        const skillAttacco = (opzioni.contesto === 'CC') ? 'CC ATTACK' : 'BS ATTACK';
        const testo = (((unita && unita.skills) || '') + ', ' + ((unita && unita.equip) || '')).toUpperCase();
        const re = new RegExp(skillAttacco.replace(' ', '\\s+') + '\\s*\\(([^)]*)\\)', 'g');
        let m;
        while ((m = re.exec(testo)) !== null) {
            const dentro = m[1].replace(/\s+/g, '');
            const b = /^\+(\d+)B$/.exec(dentro);
            if (b) {
                if (attivo) {
                    const v = parseInt(b[1], 10);
                    totale += v;
                    voci.push({ fonte: 'skill', valore: v, motivo: `${skillAttacco} (+${v}B) — solo in Turno Attivo` });
                } else {
                    avvisi.push(err('A60', `${skillAttacco} (+1B) non si applica in ARO: bonus ignorato.`));
                }
            }
        }

        // Stessa notazione sul nome dell'arma (es. "Combi Rifle (+1B)")
        if (arma && Array.isArray(arma.notazioni)) {
            arma.notazioni.forEach(function (n) {
                const b = /^\+(\d+)\s*B$/i.exec(String(n).replace(/\s+/g, ''));
                if (b && attivo) {
                    const v = parseInt(b[1], 10);
                    totale += v;
                    voci.push({ fonte: 'arma', valore: v, motivo: `Notazione arma (+${v}B)` });
                }
            });
        }

        // 🔴 Qui c'era un ramo che applicava la Saturazione al Burst TOTALE,
        // letto da opzioni.modBurstTerreno. Nessun file lo passava: era morto.
        // Tolto, perche` se qualcuno l'avesse attivato il -1 si sarebbe contato
        // due volte — la Saturazione vive in modAttacco, per bersaglio, dopo
        // la divisione del Burst. (Chat REGOLE, 21 settembre.)

        if (totale > MAXB) {
            voci.push({ fonte: 'regolamento', valore: MAXB - totale, motivo: `Burst massimo ${MAXB}` });
            totale = MAXB;
        }
        if (totale < 1) totale = 1;

        return { valore: totale, base: base, voci: voci, note: [], avvisi: avvisi };
    };

    // NOTA: qui c'era una PRIMA definizione di M.variantiArma, sovrascritta
    // dalla seconda piu` sotto. Codice morto che nessuno eseguiva, e che
    // faceva credere un comportamento diverso a chi lo leggeva per capire.
    // E` lo stesso difetto trovato su M.versioneDaIntestazione.

    // Burst iniziale. Regole applicate:
    //  - base: il Burst dell'arma
    //  - +1B: SOLO se la notazione riguarda l'azione in corso. Il codice
    //    attuale cerca "+1B" ovunque nelle skill, quindi un "CC Attack (+1B)"
    //    faceva salire il Burst anche di un Attacco BS. Qui no.
    //  - il +1B vale solo in Turno Attivo, mai in ARO (regola N5)
    //  - Ordine Coordinato: solo la Punta di Lancia spara a Burst pieno
    //  - tetto assoluto BURST_MAX
    M.burstIniziale = function (unita, arma, opzioni) {
        opzioni = opzioni || {};
        const voci = [];
        const avvisi = [];
        const azione = opzioni.azione || M.AZIONI.BS_ATTACK;
        const spec = M.SPEC[azione] || {};
        const MAXB = meccaniche().BURST_MAX;

        let valore = (arma && typeof arma.burst === 'number') ? arma.burst : 1;
        voci.push({ fonte: 'arma', valore: valore, motivo: `Burst di ${(arma && arma.nome) || 'arma'}` });

        if (spec.burst === 'fisso1') {
            return { valore: 1, base: valore, voci: [{ fonte: 'regola', valore: 1, motivo: `${azione} usa sempre Burst 1` }], avvisi: avvisi };
        }

        // +1B contestuale: "BS Attack (+1B)" conta per il BS, non per il CC
        const etichetta = (spec.attributo === 'CC') ? 'CC ATTACK' : 'BS ATTACK';
        const testo = (((unita && unita.skills) || '') + ' ' + ((unita && unita.equip) || '') + ' ' +
                       ((arma && arma.notazioni) ? arma.notazioni.join(' ') : '')).toUpperCase();
        const regex = new RegExp(etichetta.replace(' ', '\\s+') + '\\s*\\(\\s*\\+1\\s*B\\s*\\)');

        if (regex.test(testo) || /\(\s*\+1\s*B\s*\)/.test(((arma && arma.notazioni) || []).join(' ').toUpperCase())) {
            if (opzioni.inARO) {
                avvisi.push(err('A60', '+1B non applicato: vale solo in Turno Attivo, mai in ARO.'));
            } else {
                valore += 1;
                voci.push({ fonte: '+1B', valore: 1, motivo: `${etichetta} (+1B)` });
            }
        }

        // Ordine Coordinato: gregari a Burst 1
        if (opzioni.coordMode && opzioni.indiceCoord > 0) {
            voci.push({ fonte: 'coordinato', valore: 1 - valore, motivo: 'Gregario di Ordine Coordinato: Burst 1 (solo la Punta di Lancia spara a Burst pieno)' });
            valore = 1;
        }

        if (valore > MAXB) {
            voci.push({ fonte: 'tetto', valore: MAXB - valore, motivo: `Burst limitato a ${MAXB} dal regolamento` });
            valore = MAXB;
        }
        if (valore < 1) valore = 1;

        return { valore: valore, base: (arma && arma.burst) || 1, voci: voci, avvisi: avvisi };
    };


    // ==================================================================
    // PARTE 5: VARIANTI D'ARMA E BURST INIZIALE
    // ==================================================================

    // Un'arma MULTI/Plasma/Missile va scelta in una delle sue modalità.
    // ordine_attacco_bs.js oggi le espande con cinque if scritti a mano
    // (MULTI Marksman, MULTI Sniper, MULTI Rifle, Plasma Carbine, Missile
    // Launcher): ogni arma modale nuova va aggiunta a mano e finora nessuno
    // l'ha fatto. Qui le varianti si ricavano dal database.
    // 🔴 Le NOTAZIONI del profilo si perdevano qui.
    // variantiArma spoglia il nome delle parentesi per trovare i "fratelli",
    // e cosi` "AP CC Weapon(PS=6)" diventava "AP CC Weapon" col dam 8 del
    // database. profiloArma il PS=6 lo agganciava; armiCC, armiARO e
    // armiSoppressione — che passano da qui — no. Due vie per la stessa arma,
    // con due danni diversi, e il Tiro Salvezza sbagliato di due punti.
    function riapplicaNotazioni(profilo, nomeRichiesto) {
        const gruppi = [];
        String(nomeRichiesto || '').replace(/\(([^)]*)\)/g, function (_, g) { gruppi.push(g.trim()); return ' '; });
        if (gruppi.length === 0 || !profilo || profilo.nonTrovata) return profilo;

        const p = Object.assign({}, profilo);
        p.notazioni = (p.notazioni || []).concat(gruppi.filter(function (g) {
            return (p.notazioni || []).indexOf(g) < 0;
        }));

        // 🔴 `nomeRichiesto` deve portare il nome GREZZO, notazioni comprese.
        // Lo spogliavo anche qui, e i moduli — che salvano un nome e poi lo
        // ririsolvono — perdevano il (PS=6) un passo dopo: il Morlock faceva
        // tirare ARM VS 9 invece di VS 7.
        // Il nome e` l'identita` dell'arma: se lo si spoglia, il giro di
        // ritorno non e` piu` reversibile.
        p.nomeRichiesto = nomeRichiesto;

        // Il PS dichiarato dal profilo sostituisce quello del database.
        gruppi.map(function (g) { return M.parseNotazione(g); }).forEach(function (n) {
            if (n.tipo === 'SOSTITUZIONE' && n.attributo === 'PS') p.dam = n.valore;
        });
        return p;
    }

    M.variantiArma = function (nomeRichiesto) {
        const db = dbArmi();
        const nome = normalizza(nomeRichiesto);
        if (!db || !nome) return [];

        // 1. voce-contenitore: "MULTI Sniper Rifle" non ha bande proprie, ha
        //    modalita:[...]. Va ESPANSA, altrimenti i moduli non offrono nulla.
        const esatta = Object.keys(db).find(k => k.toLowerCase() === nome.toLowerCase());
        if (esatta && Array.isArray(db[esatta].modalita) && db[esatta].modalita.length > 0) {
            return db[esatta].modalita.map(m => riapplicaNotazioni(M.profiloArma(m), nome))
                                      .filter(p => !p.nonTrovata);
        }

        // 2. tutte le voci che condividono il nome base, parentesi escluse.
        //    "Missile Launcher" -> se stessa + (Blast Mode) + (Hit Mode).
        //    Nota: NON si passa dall'alias, che collasserebbe il nome base
        //    su una sola modalità facendo sparire le altre.
        const baseNome = normalizza(nome.replace(/\(([^)]*)\)/g, ' ')).toLowerCase();
        if (baseNome) {
            const fratelli = Object.keys(db).filter(function (k) {
                if (Array.isArray(db[k].modalita)) return false;
                return normalizza(k.replace(/\(([^)]*)\)/g, ' ')).toLowerCase() === baseNome;
            });
            if (fratelli.length > 0) {
                // Deduplica: una voce puo` comparire sia come chiave sia come
                // alias (es. "Missile Launcher" e "Missile Launcher (Blast)"
                // portano entrambe a "Missile Launcher (Blast Mode)").
                const visti = new Set();
                const out = [];
                fratelli.map(k => riapplicaNotazioni(M.profiloArma(k), nome)).forEach(function (pr) {
                    if (pr.nonTrovata || visti.has(pr.nome)) return;
                    visti.add(pr.nome);
                    out.push(pr);
                });
                return out;
            }
        }

        if (esatta) return [riapplicaNotazioni(M.profiloArma(esatta), nome)];

        // 3. ultimo tentativo: alias
        const al = M.risolviAlias(nome);
        if (al && db[al.canonico]) return [riapplicaNotazioni(M.profiloArma(al.canonico), nome)];

        return [];
    };

    // Estrae il MOD di una notazione legata a una specifica azione.
    // "BS Attack (+1B), CC Attack (-3)" -> notazioneAzione(s,'BS Attack') = ['+1B']
    // Il codice attuale fa skills.includes('+1B') alla cieca: così il +1B
    // del CC finisce anche sui tiri BS.
    M.notazioneAzione = function (testo, etichetta) {
        const out = [];
        const re = new RegExp(etichetta.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*\\(([^)]*)\\)', 'gi');
        let m;
        while ((m = re.exec(String(testo || ''))) !== null) {
            m[1].split(/[,;]/).forEach(x => { x = x.trim(); if (x) out.push(x); });
        }
        return out;
    };

    // Burst di partenza, con il dettaglio di come ci si è arrivati.
    // ctx: { azione, coordMode, indiceCoord, inARO }
    // ⚠️ Sopra ci sono altre DUE definizioni di M.burstIniziale, piu` vecchie:
    // in JavaScript vince l'ultima, quindi quelle sono codice morto che
    // chi legge il file puo` prendere per la funzione vera. Da togliere in
    // un giro dedicato, con la chat TEST che verifica che nulla le legga.
    M.burstIniziale = function (unita, arma, ctx) {
        ctx = ctx || {};
        // 🔴 UNA domanda, UNA risposta: il Burst in ARO lo calcola
        // burstReattivo, che conosce Total Reaction e Neurocinetics. Qui si
        // dava 1 a tutti — il Sin-Eater compreso — e un modulo che chiamasse
        // questa invece di quella perdeva il Burst pieno. (Chat TEST.)
        if (ctx.inARO && !ctx.coordMode && unita && typeof M.burstReattivo === 'function') {
            const br = M.burstReattivo(unita, arma, ctx);
            return { valore: br.valore, base: br.valore, sd: M.dadiSpeciali(unita, arma, ctx),
                     voci: br.voci || [], note: br.note || [], max: br.valore,
                     unSoloBersaglio: br.unSoloBersaglio };
        }
        const MAXB = meccaniche().BURST_MAX;
        const voci = [];
        const note = [];

        let valore = (arma && typeof arma.burst === 'number') ? arma.burst : 1;
        const base = valore;
        let sd = 0;
        voci.push({ fonte: 'arma', valore: base, motivo: `Burst dell'arma ${(arma && arma.nome) || ''}`.trim() });

        // I dadi speciali si contano SEMPRE: non modificano il Burst, quindi
        // non seguono le sue restrizioni. FAQ 0.1 (set. 2026, F04 — verificata dalla chat REGOLE sulla wiki "Coordinated Orders"): "As SD MODs do
        // not change Burst values, they apply during a Coordinated Order".
        // E la regola dice esplicitamente che valgono in Attivo E in Reattivo.
        sd += M.dadiSpeciali(unita, arma, ctx);

        // 🔴 ORDINE COORDINATO. La Punta di Lancia NON ha il Burst pieno:
        // il regolamento N5 dice che usa META` del Burst dell'arma, bonus
        // compresi, arrotondato per eccesso. Gli altri scendono a 1.
        // Il Leader del Fireteam invece ha il Burst pieno: la wiki mette i
        // due casi in contrasto esplicito, e qui erano trattati uguali.
        if (ctx.coordMode) {
            if (ctx.indiceCoord > 0) {
                voci.push({ fonte: 'coordinato', valore: 1 - valore, motivo: 'Gregario in Ordine Coordinato: Burst 1' });
                valore = 1;
            } else {
                const meta = Math.ceil(valore / 2);
                voci.push({ fonte: 'coordinato', valore: meta - valore,
                            motivo: `Punta di Lancia: metà del Burst arrotondata per eccesso (${valore} → ${meta})` });
                valore = meta;
            }
            if (sd > 0) note.push(`I ${sd} dado/i speciale/i restano: non modificano il Burst.`);
            return { valore, base, sd, voci, note, max: valore };
        }

        // (+1B) vale solo in Turno Attivo, e solo per l'azione a cui è legato.
        const etichetta = (ctx.azione === M.AZIONI.CC_ATTACK || ctx.azione === M.AZIONI.BERSERK ||
                           ctx.azione === M.AZIONI.PROTHEION) ? 'CC Attack' : 'BS Attack';
        if (!ctx.inARO) {
            const daSkill = M.notazioneAzione(((unita && unita.skills) || '') + ' ' + ((unita && unita.equip) || ''), etichetta);
            const daArma = (arma && arma.notazioni) || [];
            daSkill.concat(daArma).map(M.parseNotazione).forEach(function (n) {
                if (n.tipo === 'BURST' && n.valore > 0) {
                    valore += n.valore;
                    voci.push({ fonte: 'notazione', valore: n.valore, motivo: `${etichetta} (${n.raw}): +${n.valore} Burst in Turno Attivo` });
                } else if (n.tipo === 'DADO_SPECIALE') {
                    // già contato da M.dadiSpeciali(): qui si ignora, o si
                    // conterebbe due volte.
                } else if (n.tipo === 'SALVEZZA') {
                    note.push(`${etichetta} (${n.raw}): i tuoi bersagli applicano ${n.valore} ai propri Tiri Salvezza.`);
                } else if (n.tipo === 'MOVIMENTO') {
                    note.push(`${etichetta} (${n.raw}): bonus di movimento, non tocca il Burst.`);
                }
            });
        } else {
            note.push('In ARO il Burst è 1 e le notazioni (+1B) non si applicano.');
            valore = 1;
        }

        if (valore > MAXB) {
            voci.push({ fonte: 'limite', valore: MAXB - valore, motivo: `Burst massimo di regolamento: ${MAXB}` });
            valore = MAXB;
        }
        // 🔴 NEUROCINETICS: Burst 1 in Turno Attivo su TUTTE le armi BS.
        // E qualunque MOD al Burst vale SOLO nel Turno Reattivo: un
        // Sin-Eater in Fireteam non porta il bonus di Burst nel turno
        // attivo. Reggeva solo perche` 1 e` anche il default.
        if (!ctx.reattivo && skillsDi(unita).indexOf('NEUROCINETICS') >= 0 &&
            arma && !arma.isCC) {
            if (valore !== 1) {
                voci.push({ fonte: 'neurocinetics', valore: 1 - valore,
                            motivo: 'Neurocinetics: Burst 1 in Turno Attivo su tutte le armi BS' });
            }
            note.push('Neurocinetics: i MOD al Burst valgono SOLO nel Turno Reattivo.');
            return { valore: 1, base, sd, voci, note, max: 1 };
        }

        // ------------------------------------------------------------------
        // DOUBLE SHOT — nel Turno Attivo l'arma puo` applicare +1 al Burst.
        // 🔴 Con Disposable (2) il MOD si applica SOLO se ENTRAMBI gli usi
        // sono liberi, e applicarlo LI CONSUMA ENTRAMBI, lasciando il
        // portatore in Stato Scarico. Non applicarlo era un Burst dimezzato
        // su tre armi: Disco Baller, Mine Dispenser, Chest Mines (BS Mode).
        // (wiki N5, pagina Traits)
        // ------------------------------------------------------------------
        const TB = catalogo('TRATTI_BURST') || {};
        const DS = TB['Double Shot'];
        let usi = null;
        if (DS && /DOUBLE SHOT/i.test(String((arma && arma.traits) || '')) && !ctx.reattivo) {
            usi = M.usiResidui(ctx.portatore || ctx.attaccante || unita, arma);
            const tuttiLiberi = !usi || usi.spesi === 0;
            if (!tuttiLiberi) {
                note.push(`Double Shot: non applicabile, ${usi.spesi} uso/i già speso/i su ${usi.totali}.`);
            } else if (ctx.doubleShot === false) {
                note.push('Double Shot disponibile ma non dichiarato: consumerebbe tutti gli usi.');
            } else {
                valore += DS.burstMod;
                voci.push({ fonte: 'double-shot', valore: DS.burstMod,
                            motivo: `Double Shot: +${DS.burstMod} Burst` +
                                    (usi ? ` (consuma tutti e ${usi.totali} gli usi)` : '') });
                if (DS.lasciaScarico && usi) note.push('Applicandolo il portatore resta in Stato Scarico.');
            }
        }

        // Il tetto e` sugli usi RESIDUI, e si RICALCOLA: con un uso gia` speso
        // su Disposable (2) il Burst non puo` superare 1.
        if (!usi) usi = M.usiResidui(ctx.portatore || ctx.attaccante || unita, arma);
        if (usi && valore > usi.residui) {
            voci.push({ fonte: 'usi', valore: usi.residui - valore,
                        motivo: `Burst limitato agli usi residui: ${usi.residui} su ${usi.totali}` });
            valore = usi.residui;
        }

        return { valore, base, sd, voci, note, max: valore, usi: usi };
    };


    // ==================================================================
    // PARTE 6: ARMI A SAGOMA (TEMPLATE)
    // ------------------------------------------------------------------
    // Il database ha un solo flag isTemplate + il nome della forma. Non
    // distingue Diretto da Impatto, che invece si comportano in modo
    // opposto: il Diretto NON tira per colpire (chi reagisce fa un Tiro
    // Normale), l'Impatto tira (e ogni colpito fa il proprio Faccia a Faccia).
    // Qui la distinzione si ricava dalla forma e dai tratti, e quando il
    // dato non basta si emette un avviso invece di tirare a indovinare.
    // ==================================================================

    M.tipoTemplate = function (arma) {
        const avvisi = [];
        if (!arma || !arma.isTemplate) return { tipo: null, avvisi: avvisi };

        const forma = String(arma.template || '').toUpperCase();
        const nome = String(arma.nome || '').toUpperCase();
        const tratti = String(arma.traits || '').toUpperCase();

        // 🔴 Il TRATTO ha la precedenza sulla forma: il database ora lo porta
        // ed e` la fonte autorevole. Serve davvero — la "Plasma Carbine
        // (Blast Mode)" ha template "Teardrop" ma Tratto "Impact Template
        // (Circular)": guardando la forma la classificavamo Diretta, cioe`
        // senza tiro per colpire. Sbagliato.
        if (tratti.indexOf('DIRECT TEMPLATE') >= 0) return { tipo: 'DIRETTO', avvisi: avvisi };
        if (tratti.indexOf('IMPACT TEMPLATE') >= 0) return { tipo: 'IMPATTO', avvisi: avvisi };

        // Senza Tratto si ripiega sulla forma.
        if (forma.indexOf('TEARDROP') >= 0 || forma.indexOf('GOCCIA') >= 0) {
            return { tipo: 'DIRETTO', avvisi: avvisi };
        }

        // Le Circolari sono quasi sempre a Impatto (granate, missili, plasma).
        if (forma.indexOf('CIRC') >= 0) {
            // ...ma qualche Circolare è Diretta e si centra sull'attaccante.
            if (nome.indexOf('ZAPPER') >= 0 || nome.indexOf('NANOPULSER') >= 0) {
                return { tipo: 'DIRETTO', avvisi: avvisi };
            }
            return { tipo: 'IMPATTO', avvisi: avvisi };
        }

        avvisi.push(err('A60',
            `"${arma.nome}" è a Sagoma ma non si capisce se Diretta o a Impatto (forma: "${arma.template || 'non indicata'}").`,
            'Assunta a Impatto. Serve il Tratto Direct/Impact Template nel database armi.'));
        return { tipo: 'IMPATTO', avvisi: avvisi };
    };

    // Tutte le regole di risoluzione di una Sagoma, in un oggetto solo.
    // ctx: { haLoFVersoAttaccante, armaDeployable, inCorpoACorpo }
    M.regoleTemplate = function (arma, ctx) {
        ctx = ctx || {};
        const C = catalogo('TEMPLATE');
        const t = M.tipoTemplate(arma);
        if (!t.tipo) return null;

        const tipo = (C.TIPI && C.TIPI[t.tipo]) || {};
        const R = C.REGOLE || {};
        const munizione = M.risolviMunizione(arma && arma.ammo);

        // Una Sagoma senza PS e senza Stati (es. Smoke) può coinvolgere alleati.
        const innocua = !!munizione.nonOffensiva &&
                        (!munizione.statiFallimento || munizione.statiFallimento.length === 0);

        // Schivata: PH, oppure PH-3 senza LoF o contro arma Deployable.
        let modSchivata = 0;
        const motiviSchivata = [];
        if (ctx.haLoFVersoAttaccante === false) { modSchivata = -3; motiviSchivata.push('nessuna LoF verso l\'attaccante'); }
        if (ctx.armaDeployable) { modSchivata = -3; motiviSchivata.push('arma Deployable (mina)'); }

        return {
            tipo: t.tipo,
            nomeTipo: tipo.nome || t.tipo,
            forma: arma.template || null,

            // --- risoluzione dell'attacco ---
            tiroPerColpire: !!tipo.tiroPerColpire,
            reazione: tipo.reazione || 'FACCIA_A_FACCIA',
            confrontoSecondari: tipo.tiroPerColpire ? 'F2F_INDIPENDENTE' : 'TIRO_NORMALE',

            // --- effetti sul calcolo ---
            coperturaAnnullaSalvezza: true,   // niente +3 SR per Copertura Parziale
            coperturaRiduceAttacco: !!tipo.tiroPerColpire, // il -3 BS resta, se un tiro c'è
            criticoSoloSulPrincipale: true,
            modDalBersaglioPrincipale: true,
            fallisceSePrincipaleFuoriArea: true,

            // --- schivata ---
            schivata: {
                attributo: 'PH',
                mod: modSchivata,
                motivi: motiviSchivata,
                concessaSenzaLoF: true
            },

            // --- alleati e mischia ---
            puoCoinvolgereAlleati: innocua,
            colpoAnnullatoSeAlleatiInArea: !innocua,
            consumaUsoSeDisposable: true,
            coinvolgeTuttaLaMischia: !!ctx.inCorpoACorpo,

            note: [
                R.coperturaParzialeAnnullata && R.coperturaParzialeAnnullata.testo,
                R.criticoSoloSulPrincipale && R.criticoSoloSulPrincipale.testo,
                tipo.noteReazione,
                ctx.inCorpoACorpo ? (R.corpoACorpo && R.corpoACorpo.testo) : null
            ].filter(Boolean),
            avvisi: t.avvisi
        };
    };

    // ------------------------------------------------------------------
    // Il +3 di Copertura Parziale al Tiro Salvezza vale?
    // Una funzione sola, così la regola non deve essere ricordata da ogni
    // punto che calcola una salvezza. Oggi in calcolatore_math.js il +3 si
    // applica ogni volta che il flag "cover" è vero: funziona SOLO perché
    // tutti i punti di chiamata si ricordano di passare false per le Sagome.
    // È una regola che vive nel chiamante invece che nella funzione.
    // ------------------------------------------------------------------
    M.coperturaValeSullaSalvezza = function (opzioni) {
        opzioni = opzioni || {};
        if (!opzioni.inCopertura) return { vale: false, mod: 0, motivo: 'Bersaglio non in Copertura Parziale.' };
        if (opzioni.arma && opzioni.arma.isTemplate) {
            return { vale: false, mod: 0, motivo: 'Colpito da arma a Sagoma: la Copertura Parziale non dà il +3 al Tiro Salvezza.' };
        }
        if (opzioni.ignoraCopertura) {
            return { vale: false, mod: 0, motivo: 'L\'attacco ignora la Copertura.' };
        }
        // 🔴 DEPLOYABLE COVER (VITROFERRO), righe 10681-10689: a contatto di
        // Silhouette col Vitroferro il MOD e` +6 invece di +3. Il tipo di
        // copertura lo dichiara il colpo (copertura: 'VITROFERRO'); senza quel
        // dato tutto resta com'e`. Lettore scritto PRIMA che il database porti
        // il dato, cosi` non nasce un dato senza lettore. (Chat DATABASE.)
        if (String(opzioni.copertura || '').toUpperCase() === 'VITROFERRO') {
            return { vale: true, mod: 6, vitroferro: true,
                     motivo: 'Copertura Parziale da Deployable Cover (Vitroferro): +6 al Tiro Salvezza (invece di +3).' };
        }
        return { vale: true, mod: 3, motivo: 'Copertura Parziale: +3 al Tiro Salvezza.' };
    };


    // ==================================================================
    // PARTE 7: ATTACCHI SPECIALI (INTUITIVO / SPECULATIVO)
    // ==================================================================

    M.regoleAttacco = function (azione) {
        const A = catalogo('ATTACCHI');
        return A[azione] || null;
    };

    // Armi utilizzabili per un Attacco Intuitivo.
    //
    // ⚠️ Il requisito vero e` il Tratto "Intuitive Attack" sull'arma, NON
    // l'essere a Sagoma: sono due insiemi diversi. Il database armi non ha
    // ancora un campo traits, quindi ripieghiamo sulle Sagome — che e` la
    // stessa euristica di prima, ma qui e` dichiarata invece che nascosta.
    M.armiIntuitive = function (unita) {
        const avvisi = [];
        const grezze = M.dividiLista(((unita && unita.weapon) || '') + ',' + ((unita && unita.equip) || ''));

        const fuori = [];
        const dentro = [];

        grezze.forEach(function (nome) {
            let varianti = M.variantiArma(nome);
            if (varianti.length === 0) {
                const p = M.profiloArma(nome);
                if (p.nonTrovata) { fuori.push({ nome: nome, motivo: 'non presente nel database armi' }); return; }
                varianti = [p];
            }
            varianti.forEach(function (p) {
                if (dentro.some(x => x.nome === p.nome) || fuori.some(x => x.nome === p.nome)) return;
                const tratti = String(p.traits || '').toUpperCase();
                if (tratti.indexOf('INTUITIVE ATTACK') >= 0) { p._daTratto = true; dentro.push(p); return; }

                // 🔴 Il requisito e` il TRATTO, non l'essere a Sagoma. Ora che
                // il database porta i traits, una Sagoma che il Tratto non ce
                // l'ha va ESCLUSA: le Sagome a Impatto — granate, missili,
                // razzi — non sono utilizzabili per un Attacco Intuitivo, e
                // venivano offerte tutte.
                if (p.traitsFonte === 'database') {
                    if (!p.isCC) fuori.push({ nome: p.nome, motivo: 'non ha il Tratto "Intuitive Attack"' });
                    return;
                }

                // Traits sconosciuti: si ripiega sulle Sagome, dichiarandolo.
                if (p.isTemplate) { p._daTratto = false; dentro.push(p); return; }
                if (!p.isCC) fuori.push({ nome: p.nome, motivo: 'Tratti sconosciuti e non a Sagoma' });
            });
        });

        if (dentro.length > 0 && dentro.every(p => !p._daTratto)) {
            avvisi.push(err('A70',
                'Armi per l\'Attacco Intuitivo scelte fra quelle a Sagoma.',
                'Il requisito vero e` il Tratto "Intuitive Attack": ne` il database armi ne` il catalogo lo indicano per queste armi, quindi la selezione e` approssimata.'));
        } else {
            const dedotte = dentro.filter(p => p._daTratto && p.traitsFonte === 'dedotto');
            if (dedotte.length > 0) {
                avvisi.push(err('A71',
                    `Tratto "Intuitive Attack" dedotto dal tipo di arma per ${dedotte.length}: ` + dedotte.map(p => p.nome).join(', '),
                    'Le voci del catalogo marcate "dedotto" non sono state lette da una scheda: da verificare in collaudo.'));
            }
        }
        return { armi: dentro, escluse: fuori, avvisi: avvisi };
    };

    // Come si risolve un Attacco Intuitivo con quest'arma.
    // Mette insieme le regole dell'Intuitivo e quelle della Sagoma, dove
    // le prime hanno la precedenza (es. sulla reazione).
    M.regoleIntuitivo = function (arma) {
        const R = M.regoleAttacco(M.AZIONI.INTUITIVO) || {};
        const tpl = M.regoleTemplate(arma) || null;
        const avvisi = tpl ? tpl.avvisi.slice() : [];

        return {
            attributo: 'WIP',
            burst: 1,
            tiroNonModificato: true,
            modAmmessi: [],   // nessuno: ne` copertura, ne` gittata, ne` skill, ne` equip
            noteTiro: R.noteTiro || 'Tiro WIP non modificato.',

            unSoloBersaglioPrincipale: true,
            criticoSoloSulPrincipale: true,

            // 🔴 Sovrascrive la regola delle Sagome Dirette: l'Intuitivo un tiro
            // lo richiede, quindi la reazione e` un Faccia a Faccia comunque.
            reazione: 'FACCIA_A_FACCIA',
            noteReazione: R.noteReazione || null,

            sagoma: tpl ? { tipo: tpl.tipo, forma: tpl.forma } : null,
            coperturaAnnullaSalvezza: tpl ? tpl.coperturaAnnullaSalvezza : false,

            // FAQ 0.0.0 (F05, wiki "BS Attack"): conta come BS Attack per i MOD di profilo, ma e` una
            // Long Skill, quindi il +1 SD non si applica.
            contaComeBsAttack: true,
            plusUnSD: false,

            fallimento: R.fallimento || null,
            avvisi: avvisi
        };
    };


    // ==================================================================
    // PARTE 8: TRATTI E FUOCO SPECULATIVO
    // ==================================================================

    M.haTratto = function (arma, tratto) {
        if (!arma) return false;
        const grezzo = arma.traits;
        const lista = Array.isArray(grezzo) ? grezzo : String(grezzo || '').split(',');
        const cercato = String(tratto).trim().toUpperCase();
        return lista.some(function (x) {
            const v = String(x).trim().toUpperCase();
            // "Direct Template (Large Teardrop)" contiene "Direct Template"
            return v === cercato || v.indexOf(cercato) === 0;
        });
    };

    // Su quale attributo si tira con quest'arma.
    // Il Tratto "BS Weapon (PH)" o "(WIP)" sostituisce il BS: le Granate
    // tirano su PH, non su BS. Nessun modulo lo sapeva.
    M.attributoArma = function (arma, azione) {
        const spec = M.SPEC[azione] || {};
        const base = spec.attributo || 'BS';
        if (base !== 'BS') return { attributo: base, motivo: `Attributo dell'azione ${azione}.` };

        if (M.haTratto(arma, 'BS Weapon (PH)')) {
            return { attributo: 'PH', motivo: `${arma.nome}: Tratto "BS Weapon (PH)" — si tira su PH, non su BS.` };
        }
        if (M.haTratto(arma, 'BS Weapon (WIP)')) {
            return { attributo: 'WIP', motivo: `${arma.nome}: Tratto "BS Weapon (WIP)" — si tira su WIP, non su BS.` };
        }
        return { attributo: 'BS', motivo: null };
    };

    // Armi utilizzabili per un Fuoco Speculativo.
    //
    // Il requisito e` il Tratto "Speculative Attack". L'euristica precedente
    // (nome che contiene GRENADE o LAUNCHER) offriva Missile Launcher,
    // Heavy Rocket Launcher e Adhesive Launcher Rifle, che NON possono farlo.
    M.armiSpeculative = function (unita) {
        const avvisi = [];
        const grezze = M.dividiLista(((unita && unita.weapon) || '') + ',' + ((unita && unita.equip) || ''));

        const dentro = [], escluse = [];
        let dedotte = 0;

        grezze.forEach(function (nome) {
            let varianti = M.variantiArma(nome);
            if (varianti.length === 0) {
                const p = M.profiloArma(nome);
                if (p.nonTrovata) { escluse.push({ nome: nome, motivo: 'non presente nel database armi' }); return; }
                varianti = [p];
            }
            varianti.forEach(function (p) {
                if (dentro.some(x => x.nome === p.nome) || escluse.some(x => x.nome === p.nome)) return;
                if (p.isCC) return;
                if (M.haTratto(p, 'Speculative Attack')) {
                    dentro.push(p);
                    if (p.traitsFonte === 'dedotto') dedotte++;
                } else {
                    escluse.push({
                        nome: p.nome,
                        motivo: p.traitsFonte ? 'non ha il Tratto Speculative Attack'
                                              : 'Tratti sconosciuti: non risulta fra le armi speculative note'
                    });
                }
            });
        });

        if (dedotte > 0) {
            avvisi.push(err('A80', `${dedotte} arma/e ammessa/e con Tratti dedotti, non verificati sulla scheda.`));
        }
        return { armi: dentro, escluse: escluse, avvisi: avvisi };
    };

    // Come si risolve un Fuoco Speculativo.
    // ctx: { rangeIndex }
    M.regoleSpeculativo = function (arma, ctx) {
        ctx = ctx || {};
        const R = M.regoleAttacco(M.AZIONI.SPECULATIVO) || {};
        const attr = M.attributoArma(arma, M.AZIONI.SPECULATIVO);
        const tpl = M.regoleTemplate(arma);

        const voci = [{ fonte: 'speculativo', valore: -6, motivo: 'Fuoco Speculativo: -6 fisso' }];

        // I MOD di gittata SI applicano (a differenza dell'Intuitivo).
        let modGittata = 0;
        if (typeof ctx.rangeIndex === 'number' && arma && arma.bands && arma.bands[ctx.rangeIndex]) {
            const b = arma.bands[ctx.rangeIndex];
            modGittata = b.mod;
            voci.push({ fonte: 'gittata', valore: b.mod, motivo: `Gittata ${b.label}` });
        }

        return {
            attributo: attr.attributo,
            noteAttributo: attr.motivo,
            burst: 1,
            malusFisso: -6,
            modGittata: modGittata,
            modTotale: -6 + modGittata,
            voci: voci,

            // 🔴 Cosa NON si applica. Diverso sia dal BS normale sia dall'Intuitivo.
            ignoraMimetismo: true,
            ignoraCopertura: true,
            richiedeLoF: false,
            noteTiro: R.noteTiro || null,

            sagoma: tpl ? { tipo: tpl.tipo, forma: tpl.forma } : null,
            centroSagomaLibero: !!(tpl && tpl.tipo === 'IMPATTO'),
            noteSagoma: (tpl && tpl.tipo === 'IMPATTO') ? R.sagomaCircolare : null,
            coperturaAnnullaSalvezza: tpl ? tpl.coperturaAnnullaSalvezza : false,
            criticoSoloSulPrincipale: tpl ? tpl.criticoSoloSulPrincipale : false,

            contaComeBsAttack: true,
            plusUnSD: false,
            avvisi: tpl ? tpl.avvisi : []
        };
    };


    // ==================================================================
    // PARTE 9: CORPO A CORPO
    // ------------------------------------------------------------------
    // Il modulo CC attuale scrive "Calcola i bonus di Arti Marziali a mente"
    // e non applica nulla. Qui i MOD si calcolano, con il dettaglio di ogni
    // voce, così il giocatore vede da dove viene il numero.
    // ==================================================================

    // Il LIVELLO sta nel NOME: "Martial Arts L3". Il numero fra parentesi in
    // un profilo è sempre un valore-MOD, mai un livello.
    M.livelloMartialArts = function (unita) {
        const s = skillsDi(unita);
        const m = /MARTIAL ARTS\s*L\s*([1-5])/.exec(s);
        return m ? parseInt(m[1], 10) : 0;
    };

    M.haNBW = function (unita) {
        return skillsDi(unita).indexOf('NATURAL BORN WARRIOR') >= 0;
    };

    // 🔴 UNA FUNZIONE SOLA per il MOD di profilo che un'arma impone
    // all'AVVERSARIO nel Faccia a Faccia — "PARA CC Weapon (-3)".
    // La usano sia risolviScontro (il risultato) sia modCC (l'anteprima):
    // prima l'anteprima non conosceva la PARA, e la schermata non mostrava
    // il -3 che poi il risultato applicava. (Chat REGOLE, 21 settembre.)
    //
    // Natural Born Warrior: "In the CC Face to Face Roll, the user ignores
    // all negative MODs imposed by the opposing Trooper", PARA CC Weapon
    // (-3) compresa (REGOLE_N5_v5_1_1.txt righe 9270-9282).
    // ctx.dichiaraCC: il soggetto che SUBISCE il MOD ha dichiarato CC Attack?
    // 🔴 Il NBW e` esentato SOLO se dichiara CC Attack: "must be the target of
    // a CC Attack and must declare a CC Attack" (righe 9266-9267). La PARA
    // vale in ogni Faccia a Faccia, Schivata compresa: un NBW che schiva la
    // subisce. Prima l'esenzione guardava l'azione dell'ATTIVO, non la sua.
    // (Chat REGOLE, 21 settembre.)
    M.modProfiloAvversario = function (armaAvversario, chiSubisce, ctx) {
        ctx = ctx || {};
        if (!armaAvversario) return { valore: 0 };
        const voce = (G.RULES_WEAPONS || {})[armaAvversario.nome] || armaAvversario;
        if (voce.modProfiloSu !== 'F2F_AVVERSARIO') return { valore: 0 };
        const n = (armaAvversario.notazioni || [])
            .map(function (x) { return parseInt(x, 10); })
            .find(function (x) { return isFinite(x) && x < 0; });
        if (!n) return { valore: 0 };
        if (ctx.dichiaraCC === true && M.haNBW(chiSubisce)) {
            return { valore: 0, ignoratoDaNBW: true,
                     nota: `Natural Born Warrior: ignora il ${n} di ${armaAvversario.nome} nel Faccia a Faccia.` };
        }
        return { valore: n,
                 voce: { fonte: 'profilo-avversario', valore: n,
                         motivo: `${armaAvversario.nome} (${n}) dell'avversario: ${n} nel Faccia a Faccia` } };
    };

    // Accessore comune alle tabelle a livelli (Martial Arts, Strategos...).
    // Un livello FUORI INTERVALLO non e` la stessa cosa di "nessun livello":
    // il primo e` un dato sbagliato da segnalare, il secondo e` normale.
    M.livelloDaTabella = function (sezione, livello) {
        // La tabella puo` essere una sezione di primo livello (MARTIAL_ARTS)
        // oppure stare dentro una Skill (SKILL['Strategos']). Si accettano
        // entrambe, così l'accessore vale per tutte e due.
        let C = catalogo(sezione);
        if (!C.livelli) {
            const skill = catalogo('SKILL')[sezione];
            if (skill && skill.livelli) C = skill;
        }
        const liv = parseInt(livello, 10);
        if (!C.livelli) return { voce: null, avviso: err('A59', `Sezione "${sezione}" senza tabella livelli.`) };
        if (!isFinite(liv) || liv <= 0) return { voce: null, avviso: null };   // semplicemente non ce l'ha
        const voce = C.livelli[liv];
        if (voce) return { voce: voce, avviso: null };
        const disponibili = Object.keys(C.livelli).join(', ');
        return { voce: null,
                 avviso: err('A59', `Livello ${liv} fuori intervallo per ${sezione}.`,
                             `Livelli previsti: ${disponibili}.`) };
    };

    function schedaMA(livello) {
        return M.livelloDaTabella('MARTIAL_ARTS', livello).voce;
    }

    // MOD di un CC Attack, con il dettaglio delle voci.
    // ctx: { alleatiIngaggiati, inF2F }
    // Restituisce anche `attributo: 'CC'`, come modSchivata ('PH') e modReset
    // ('WIP'): il riepilogo stampa "Statistica Base (X)" solo se l'attributo
    // c'e`, e per il reattivo in mischia la riga spariva. (Chat TEST, 22 sett.)
    M.modCC = function (attaccante, difensore, arma, ctx) {
        ctx = ctx || {};
        const voci = [];
        const note = [];
        const avvisi = [];

        const base = parseInt((attaccante && attaccante.cc), 10) || 0;
        let mod = 0;

        // --- Martial Arts proprie: Attack MOD ---
        const mioMA = M.livelloMartialArts(attaccante);
        if (mioMA > 0) {
            const sch = schedaMA(mioMA);
            if (sch && sch.attaccoMod !== 0) {
                mod += sch.attaccoMod;
                voci.push({ fonte: 'martial-arts', valore: sch.attaccoMod, motivo: `Martial Arts L${mioMA}: ${sch.attaccoMod > 0 ? '+' : ''}${sch.attaccoMod} CC` });
            } else if (sch) {
                note.push(`Martial Arts L${mioMA}: nessun bonus al CC, ma -3 all'avversario.`);
            }
        }

        // --- Martial Arts del nemico: Opponent MOD (solo nei F2F) ---
        const suoMA = M.livelloMartialArts(difensore);
        if (suoMA > 0 && ctx.inF2F !== false) {
            const sch = schedaMA(suoMA);
            if (sch) {
                if (M.haNBW(attaccante)) {
                    note.push(`Natural Born Warrior annulla il ${sch.avversarioMod} delle Martial Arts L${suoMA} nemiche.`);
                } else {
                    mod += sch.avversarioMod;
                    voci.push({ fonte: 'martial-arts-nemiche', valore: sch.avversarioMod, motivo: `Martial Arts L${suoMA} del nemico: ${sch.avversarioMod} al tuo CC` });
                }
            }
        }

        // --- notazioni di profilo ---
        const mieNotazioni = M.notazioneAzione(skillsDi(attaccante), 'CC Attack')
            .concat((arma && arma.notazioni) || []);
        mieNotazioni.forEach(function (n) {
            const pulita = String(n).toUpperCase().replace(/\s+/g, '');
            const num = /^([+-]\d+)$/.exec(pulita);
            if (num) {
                const v = parseInt(num[1], 10);
                if (v > 0) { mod += v; voci.push({ fonte: 'profilo', valore: v, motivo: `CC Attack (${num[1]})` }); }
            } else if (pulita === 'SR-1' || pulita === 'SR-2') {
                note.push(`CC Attack (${pulita}): i tuoi bersagli applicano ${pulita.slice(2)} ai propri Tiri Salvezza.`);
            } else if (pulita === 'SHOCK' || pulita === 'AP' || pulita === 'DA') {
                note.push(`CC Attack (${pulita}): aggiungi munizioni ${pulita} a tutti i tuoi CC Attack.`);
            }
        });

        // --- notazioni negative del NEMICO: si applicano solo nei F2F ---
        if (ctx.inF2F !== false) {
            // 🔴 "PARA CC Weapon (-N)" E` un MOD al Faccia a Faccia
            // dell'AVVERSARIO, non al Tiro Salvezza: la salvezza PARA e`
            // sempre PH-6 (righe 5715-5718). Qui c'era scritto il contrario,
            // e contraddiceva il divieto in tiroSalvezza.
            // Si applica tramite M.modProfiloAvversario, la stessa funzione
            // che usa risolviScontro: serve ctx.armaAvversario.
            if (ctx.armaAvversario) {
                const pa = M.modProfiloAvversario(ctx.armaAvversario, attaccante, { dichiaraCC: true });
                if (pa.voce) { mod += pa.valore; voci.push(pa.voce); }
                if (pa.nota) note.push(pa.nota);
            }
            const sue = M.notazioneAzione(skillsDi(difensore), 'CC Attack');
            sue.forEach(function (n) {
                const num = /^(-\d+)$/.exec(String(n).replace(/\s+/g, ''));
                if (num) {
                    const v = parseInt(num[1], 10);
                    // 🔴 NBW: ignora tutti i MOD negativi dell'avversario nel F2F
                    // di CC — l'esempio (righe 9275-9282) nomina proprio "CC
                    // Attack (-3)". Arti Marziali e PARA lo controllavano gia`,
                    // questa no. Chi tira in modCC sta dichiarando CC Attack.
                    // (Chat REGOLE, 21 settembre.)
                    if (M.haNBW(attaccante)) {
                        note.push(`Natural Born Warrior: ignora il CC Attack (${num[1]}) del nemico.`);
                        return;
                    }
                    mod += v;
                    voci.push({ fonte: 'profilo-nemico', valore: v, motivo: `Il nemico ha CC Attack (${num[1]}): si applica a te nel Faccia a Faccia` });
                }
            });
        }

        // --- clamp ±12 ---
        const MEC = meccaniche();
        if (mod > MEC.MOD_MAX) { voci.push({ fonte: 'limite', valore: MEC.MOD_MAX - mod, motivo: `MOD massimo ${MEC.MOD_MAX}` }); mod = MEC.MOD_MAX; }
        if (mod < MEC.MOD_MIN) { voci.push({ fonte: 'limite', valore: MEC.MOD_MIN - mod, motivo: `MOD minimo ${MEC.MOD_MIN}` }); mod = MEC.MOD_MIN; }

        let valore = base + mod;
        // 🔴 NIENTE clamp a 1. Per regola un Valore di Successo sotto 1 e`
        // un FALLIMENTO AUTOMATICO: non si tira. Portarlo a 1 inventava un
        // valore — un PH 10 a -12 schivava tirando un 1. Stessa gestione del
        // tiro d'attacco: il valore vero, e il flag `impossibile`.
        // (Segnalato dalla chat REGOLE, giro del 20 settembre.)

        note.push('In Corpo a Corpo non si applicano gittata, copertura né mimetismo.');

        return { valore, base, mod, voci, note, avvisi, attributo: 'CC',
                 impossibile: valore < 1, critici: M.critici(valore) };
    };

    // Burst in CC. Separato dai MOD perché il (+1 SD) NON è un aumento di Burst.
    M.burstCC = function (attaccante, arma, ctx) {
        ctx = ctx || {};
        const MAXB = meccaniche().BURST_MAX;
        const voci = [];
        const note = [];

        let valore = (arma && typeof arma.burst === 'number') ? arma.burst : 1;
        const base = valore;
        voci.push({ fonte: 'arma', valore: base, motivo: `Burst dell'arma ${(arma && arma.nome) || 'CC'}`.trim() });

        // Ordine Coordinato in Corpo a Corpo: regola PROPRIA.
        // Solo la Punta di Lancia tira, e riceve +1 B (e +1 PH al danno) per
        // OGNI alleato partecipante all'Ordine ingaggiato con l'avversario.
        // Non e` il "Close Combat with Multiple Troopers": quello vale per
        // gli alleati in mischia in generale, questo solo per i partecipanti.
        if (ctx.coordMode) {
            if (ctx.indiceCoord > 0) {
                voci.push({ fonte: 'coordinato', valore: 1 - valore,
                            motivo: 'Gregario in Ordine Coordinato: in mischia non tira, solo la Punta di Lancia' });
                return { valore: 0, base, sd: 0, voci, note, max: 0,
                         nonTira: true };
            }
            const partecipanti = parseInt(ctx.partecipantiIngaggiati, 10) || 0;
            if (partecipanti > 0) {
                valore += partecipanti;
                voci.push({ fonte: 'coordinato', valore: partecipanti,
                            motivo: `Punta di Lancia: +${partecipanti}B per gli alleati dell'Ordine ingaggiati` });
                note.push(`La Punta di Lancia somma anche +${partecipanti} al PH per il danno.`);
            }
        }

        let sd = 0;
        const ma = M.livelloMartialArts(attaccante);
        if (ma > 0) {
            const sch = schedaMA(ma);
            if (sch) {
                if (sch.burstMod) { valore += sch.burstMod; voci.push({ fonte: 'martial-arts', valore: sch.burstMod, motivo: `Martial Arts L${ma}: +${sch.burstMod}B` }); }
                if (sch.sd) { sd += sch.sd; note.push(`Martial Arts L${ma}: (+1 SD) — tira un dado in più e poi scartane uno. Non aumenta il Burst.`); }
            }
        }

        // (+1B) di profilo, solo in Turno Attivo e solo se è "CC Attack (+1B)".
        if (!ctx.inARO) {
            const not = M.notazioneAzione(skillsDi(attaccante), 'CC Attack').concat((arma && arma.notazioni) || []);
            if (not.some(x => String(x).toUpperCase().replace(/\s+/g, '') === '+1B')) {
                valore += 1;
                voci.push({ fonte: 'profilo', valore: 1, motivo: 'CC Attack (+1B): +1 Burst in Turno Attivo' });
            }
        }

        // 🔴 "Close Combat with Multiple Troopers": il Gang-Up di N5.
        // +1B per OGNI alleato ingaggiato nella stessa mischia. Il dato non è
        // deducibile: lo dichiara il giocatore.
        const alleati = parseInt(ctx.alleatiIngaggiati, 10) || 0;
        if (alleati > 0) {
            valore += alleati;
            voci.push({ fonte: 'multipli', valore: alleati, motivo: `Close Combat with Multiple Troopers: +${alleati}B (${alleati} alleato/i nella mischia)` });
        }

        if (valore > MAXB) {
            voci.push({ fonte: 'limite', valore: MAXB - valore, motivo: `Burst massimo di regolamento: ${MAXB}` });
            valore = MAXB;
        }
        if (sd > 0) note.push('Il dado (+1 SD) non conta nel massimo di Burst 6.');

        return { valore, base, sd, voci, note, max: valore };
    };

    // Colpo di Grazia: si applica?
    M.colpoDiGrazia = function (difensore) {
        const C = catalogo('CORPO_A_CORPO').colpoDiGrazia || {};
        const s = M.statoBersaglio(difensore);
        if (!s.incosciente) return { applicabile: false, motivo: 'Il bersaglio non è Incosciente.' };

        const sk = skillsDi(difensore);
        if (sk.indexOf('DOGGED') >= 0 || sk.indexOf('NO WOUND INCAPACITATION') >= 0 || sk.indexOf('NWI') >= 0) {
            return { applicabile: false, bloccatoDaSkill: true,
                motivo: 'Il bersaglio ha Dogged o No Wound Incapacitation: il Colpo di Grazia non si usa, il CC Attack si risolve normalmente.' };
        }
        return { applicabile: true, senzaTiro: true, senzaSalvezza: true, motivo: C.effetto || 'Da Incosciente a Morto, senza tiro né Tiro Salvezza.' };
    };

    // Armi utilizzabili in CC.
    M.armiCC = function (unita) {
        const grezze = M.dividiLista(((unita && unita.weapon) || '') + ',' + ((unita && unita.equip) || ''));
        const dentro = [];
        grezze.forEach(function (nome) {
            let varianti = M.variantiArma(nome);
            if (varianti.length === 0) {
                const p = M.profiloArma(nome);
                if (p.nonTrovata) return;
                varianti = [p];
            }
            varianti.forEach(function (p) {
                if (p.isCC && !dentro.some(x => x.nome === p.nome)) dentro.push(p);
            });
        });
        return dentro;
    };


    // ==================================================================
    // PARTE 10: INFOGUERRA (HACKING)
    // ------------------------------------------------------------------
    // Il modulo attuale mostra a QUALSIASI hacker gli stessi cinque
    // programmi. In N5 i programmi disponibili dipendono dal DISPOSITIVO:
    // un Hacking Device standard non puo` usare Trinity, che e` esclusiva
    // del Killer Hacking Device.
    // ==================================================================

    M.dispositiviHacking = function (unita) {
        const D = catalogo('DISPOSITIVI_HACKING');
        // Prima i nomi piu` lunghi: "Hacking Device Plus" contiene "Hacking Device".
        // 🔴 E il testo si CONSUMA: ogni dispositivo trovato si toglie, e un
        // nome piu` corto conta solo se compare ancora da solo. Prima un nome
        // contenuto in uno piu` lungo si scartava SEMPRE — giusto perche`
        // "Killer Hacking Device" non contasse anche come "Hacking Device",
        // sbagliato quando la truppa li dichiara TUTTI E DUE: il secondo
        // spariva, coi suoi programmi. (Chat TEST, 23 settembre.)
        let testo = skillsDi(unita);
        const trovati = [];
        Object.keys(D).sort((a, b) => b.length - a.length).forEach(function (nome) {
            const N = nome.toUpperCase();
            let k;
            while ((k = testo.indexOf(N)) >= 0) {
                if (trovati.indexOf(nome) < 0) trovati.push(nome);
                testo = testo.slice(0, k) + ' '.repeat(N.length) + testo.slice(k + N.length);
            }
        });
        return trovati;
    };

    // Gli UPGRADE scritti fra parentesi ACCANTO a ciascun dispositivo.
    // Il testo si consuma come in dispositiviHacking: "Killer Hacking Device
    // (...)" non si legge anche come "Hacking Device (...)".
    M.upgradePerDispositivo = function (unita) {
        const D = catalogo('DISPOSITIVI_HACKING');
        let testo = skillsDi(unita);
        const out = {};
        Object.keys(D).sort((a, b) => b.length - a.length).forEach(function (nome) {
            const N = nome.toUpperCase();
            let k;
            while ((k = testo.indexOf(N)) >= 0) {
                let fine = k + N.length;
                const m = testo.slice(fine).match(/^\s*\(([^)]*)\)/);
                if (m) {
                    fine += m[0].length;
                    M.notazioniAzione(`${N} (${m[1]})`, nome).filter(n => n.tipo === 'UPGRADE')
                        .forEach(function (n) { out[nome] = (out[nome] || []).concat(n.voci); });
                }
                testo = testo.slice(0, k) + ' '.repeat(fine - k) + testo.slice(fine);
            }
        });
        return out;
    };

    M.programmiDisponibili = function (unita) {
        const D = catalogo('DISPOSITIVI_HACKING');
        const H = catalogo('HACKING');
        const avvisi = [];
        const dispositivi = M.dispositiviHacking(unita);

        if (dispositivi.length === 0) {
            if (skillsDi(unita).indexOf('HACKER') >= 0) {
                avvisi.push(err('A90',
                    `${M.nomeUnita(unita)} risulta Hacker ma non ha un Dispositivo di Hacking nel profilo.`,
                    'Senza dispositivo non si sa quali programmi possa usare.'));
            }
            return { programmi: [], dispositivi: [], avvisi: avvisi };
        }

        // 🔴 GLI UPGRADE APPARTENGONO AL DISPOSITIVO accanto a cui sono scritti
        // (regola, riga 4718 — chat REGOLE, 23 settembre). Un upgrade scritto
        // accanto all'Hacker, non a un dispositivo, vale per la truppa.
        // Prima gli upgrade di tutti i dispositivi finivano in un mucchio unico
        // applicato per nome: con due dispositivi l'Oblivion usciva sempre
        // potenziato, anche dal dispositivo che il potenziamento non l'ha.
        // I programmi disponibili sono l'UNIONE; se lo stesso programma esce
        // DIVERSO da due dispositivi, restano due voci, distinte da `scelta`.
        const perDisp = M.upgradePerDispositivo(unita);
        const perTruppa = [];
        M.notazioniAzione(skillsDi(unita), 'Hacker').filter(n => n.tipo === 'UPGRADE')
            .forEach(n => n.voci.forEach(v => perTruppa.push(v)));
        const upgrade = [];
        const grezze = [];
        dispositivi.forEach(function (d) {
            const ups = (perDisp[d] || []).concat(perTruppa);
            ups.forEach(v => upgrade.push(Object.assign({ dispositivo: d }, v)));
            const nomiD = (D[d].programmi || []).slice();
            ups.forEach(function (v) {
                if (!H[v.programma]) {
                    avvisi.push(err('A94', `Upgrade "${v.programma}": programma non presente nel catalogo.`));
                    return;
                }
                if (nomiD.indexOf(v.programma) < 0) nomiD.push(v.programma);
            });
            nomiD.forEach(function (n) {
                const mod = (ups.find(u => u.programma === n) || {}).modifica || null;
                grezze.push({ nome: n, dispositivo: d, modifica: mod });
            });
        });
        // Stesso programma con la STESSA modifica da piu` dispositivi: una voce sola.
        const uniche = [];
        grezze.forEach(function (g) {
            const gia = uniche.find(u => u.nome === g.nome && JSON.stringify(u.modifica) === JSON.stringify(g.modifica));
            if (gia) gia.dispositivi.push(g.dispositivo);
            else uniche.push(Object.assign({ dispositivi: [g.dispositivo] }, g));
        });
        const programmi = uniche.map(function (u) {
            const v = H[u.nome] || {};
            let voce = Object.assign({ nome: u.nome }, v);
            if (u.modifica && v.tipo === 'ATTACCO') {
                // 🔴 L'upgrade si APPLICA, non si limita a essere segnalato.
                const up = M.applicaUpgrade(voce, u.modifica);
                up.avvisi.forEach(a => avvisi.push(a));
                up.programma.noteUpgrade = up.note;
                voce = up.programma;
            }
            const doppio = uniche.filter(x => x.nome === u.nome).length > 1;
            return Object.assign(voce, {
                dispositivo: u.dispositivi[0], dispositivi: u.dispositivi, modifica: u.modifica,
                // `scelta` e` l'identita` della voce per chi la seleziona: il nome
                // se e` unico, altrimenti nome [dispositivo].
                scelta: doppio ? `${u.nome} [${u.dispositivi.join(' / ')}]` : u.nome
            });
        });

        programmi.filter(p => p.fonte === 'DA VERIFICARE').forEach(function (p) {
            avvisi.push(err('A91', `Dati di "${p.nome}" non verificati sulla scheda ufficiale.`, p.note || null));
        });

        return { programmi: programmi, dispositivi: dispositivi, upgrade: upgrade, avvisi: avvisi };
    };

    M.programmiAttacco = function (unita) {
        const e = M.programmiDisponibili(unita);
        return {
            programmi: e.programmi.filter(p => p.tipo === 'ATTACCO'),
            nonAttacco: e.programmi.filter(p => p.tipo !== 'ATTACCO'),
            dispositivi: e.dispositivi,
            upgrade: e.upgrade || [],
            avvisi: e.avvisi
        };
    };

    // Un programma d'attacco visto come "arma", così il resto del motore
    // (contratto, munizioni, salvezze) lo tratta come tutto il resto.
    // Applica a un programma le modifiche di un UPGRADE del dispositivo.
    // Le forme viste nei database: "+1B" (Burst), "SR-1"/"SR-2" (Tiro Salvezza
    // del bersaglio), "AP" (munizione sostituita).
    M.applicaUpgrade = function (programma, modifica) {
        const note = [];
        const avvisi = [];
        if (!modifica) return { programma, note, avvisi };

        const p = Object.assign({}, programma);
        p.upgrade = modifica;

        String(modifica).split(/[,;]/).map(x => x.trim()).filter(Boolean).forEach(function (pezzo) {
            const n = M.parseNotazione(pezzo);
            switch (n.tipo) {
                case 'BURST':
                    p.burst = Math.max(1, (p.burst || 1) + n.valore);
                    note.push(`Upgrade (${n.raw}): Burst ${programma.burst} → ${p.burst}.`);
                    break;
                case 'SALVEZZA':
                    p.modSalvezzaBersaglio = (p.modSalvezzaBersaglio || 0) + n.valore;
                    note.push(`Upgrade (${n.raw}): i bersagli applicano ${n.valore} ai propri Tiri Salvezza.`);
                    break;
                case 'MUNIZIONE': {
                    const vecchia = p.ammo;
                    p.ammo = n.munizione;
                    p.ammoOpzioni = [n.munizione];
                    const ris = M.risolviMunizione(n.munizione);
                    p.dimezzaBTS = !!ris.dimezza;
                    p.salvezze = ris.salvezze;
                    note.push(`Upgrade (${n.raw}): munizione ${vecchia} → ${n.munizione}.`);
                    break;
                }
                case 'MOD':
                    p.modAttacco = (p.modAttacco || 0) + n.valore;
                    note.push(`Upgrade (${n.raw}): ${n.valore > 0 ? '+' : ''}${n.valore} WIP.`);
                    break;
                default:
                    avvisi.push(err('A94',
                        `Upgrade "${pezzo}" su ${programma.nome}: forma non riconosciuta, non applicata.`));
            }
        });
        return { programma: p, note, avvisi };
    };

    // L'arma di un programma COME QUESTA TRUPPA LO USA: dalla voce scelta
    // (per `scelta`, o per nome se unico), con l'upgrade del dispositivo.
    M.armaDaProgrammaDi = function (unita, scelta) {
        const el = M.programmiDisponibili(unita).programmi;
        const S = String(scelta || '').toUpperCase();
        const perScelta = el.find(p => String(p.scelta).toUpperCase() === S);
        const perNome = el.filter(p => String(p.nome).toUpperCase() === S);
        const voce = perScelta || perNome[0];
        if (!voce) return M.armaDaProgramma(scelta);
        const a = M.armaDaProgramma(voce.nome, voce.modifica);
        a.dispositivo = voce.dispositivo; a.scelta = voce.scelta;
        if (!perScelta && perNome.length > 1) {
            a.avvisi = (a.avvisi || []).concat([err('A101', `"${scelta}": il programma esce da piu dispositivi con upgrade diversi; preso ${voce.scelta}.`)]);
        }
        return a;
    };

    M.armaDaProgramma = function (nomeProgramma, modifica) {
        const H = catalogo('HACKING');
        const chiave = Object.keys(H).find(k => k.toUpperCase() === String(nomeProgramma || '').toUpperCase());
        if (!chiave) {
            return { nome: String(nomeProgramma || ''), nonTrovata: true, burst: 1, ammo: 'N',
                     ammoOpzioni: ['N'], bands: [], isTemplate: false, isCC: false, notazioni: [],
                     avvisi: [err('A92', `Programma "${nomeProgramma}" non presente nel catalogo.`)] };
        }
        // 🔴 `modifica` e` applicata in fondo, e funzionava: era NESSUN
        // CHIAMANTE a passarla. I moduli ricostruivano l'arma dal solo nome e
        // l'upgrade si perdeva — l'elenco diceva Oblivion B3, l'attacco
        // tirava B2; Trinity AP a schermo, N nel tiro. Ora i lettori passano
        // da armaDaProgrammaDi, che la passa. (23 settembre.)
        const p = H[chiave];
        const avvisi = [];
        if (p.tipo !== 'ATTACCO') {
            avvisi.push(err('A93', `"${chiave}" non è un programma d'attacco (${p.tipo}).`, p.note || null));
        }
        const base = {
            nome: chiave, nomeRichiesto: chiave, nonTrovata: false,
            burst: p.burst || 1, dam: p.ps != null ? p.ps : null,
            ammo: p.ammo || 'N', ammoOpzioni: [p.ammo || 'N'],
            bands: [], isTemplate: false, isCC: false, isHacking: true,
            ps: p.ps, dimezzaBTS: !!p.dimezzaBTS, effetto: p.effetto || null,
            // 🔴 Gli Attacchi Comms si salvano SEMPRE su BTS. Senza questo
            // campo la munizione decideva da sola: Carbonite usa DA, che
            // implica ARM, quindi ogni salvezza da hacking veniva calcolata
            // sull'armatura invece che sul BTS.
            salvAttr: p.dimezzaBTS ? 'BTS/2' : 'BTS',
            salvTiri: p.salvezze || null,
            // modAttacco NON va perso: è il +3 WIP di Trinity, che senza
            // questa riga non arrivava mai a modHacking().
            modAttacco: p.modAttacco || 0,
            salvezze: p.salvezze || 1,
            bersaglio: p.bersaglio || 'chiunque', tipo: p.tipo,
            notazioni: [], traits: '', avvisi: avvisi
        };

        if (!modifica) return base;
        const up = M.applicaUpgrade(base, modifica);
        up.avvisi.forEach(a => up.programma.avvisi.push(a));
        up.programma.noteUpgrade = up.note;
        // 🔴 L'attributo di salvezza si ricalcola DOPO l'upgrade: calcolato
        // prima, un upgrade AP lasciava "munizione AP" e salvezza su BTS
        // pieno. Trinity dal Killer con (AP) salva su BTS dimezzato (chat
        // REGOLE, 23 settembre).
        up.programma.salvAttr = up.programma.dimezzaBTS ? 'BTS/2' : 'BTS';
        return up.programma;
    };

    // MOD di un attacco Comms.
    // ctx: { firewallNemico, membriFireteam }
    M.modHacking = function (attaccante, difensore, programma, ctx) {
        ctx = ctx || {};
        const voci = [];
        const note = [];
        const base = parseInt((attaccante && attaccante.wip), 10) || 0;
        let mod = 0;

        if (programma && programma.modAttacco) {
            mod += programma.modAttacco;
            voci.push({ fonte: 'programma', valore: programma.modAttacco, motivo: `${programma.nome}: ${programma.modAttacco > 0 ? '+' : ''}${programma.modAttacco} WIP` });
        }

        // Stato Bersagliato: +3 anche per gli attacchi Comms.
        const s = M.statoBersaglio(difensore);
        if (s.targeted) {
            mod += 3;
            voci.push({ fonte: 'bersagliato', valore: 3, motivo: 'Bersaglio in Stato Bersagliato: +3 WIP' });
        }

        // Firewall del difensore (TinBot): il valore vero, non un -3 fisso.
        const fw = parseInt(ctx.firewallNemico, 10) || 0;
        if (fw < 0) {
            mod += fw;
            voci.push({ fonte: 'firewall', valore: fw, motivo: `Firewall nemico: ${fw} WIP` });
            note.push('Il Firewall dà anche +3 BTS al Tiro Salvezza del bersaglio.');
        }

        // 🔴 NESSUN bonus Fireteam agli Attacchi Comms. Qui c'era "Fireteam
        // da 5+: +1 WIP", con due errori: il bonus non esiste in N5 (il +1 di
        // Livello 4 vale solo sul BS Attack, REGOLE_N5_v5_1_1.txt riga
        // 11932), e comunque avrebbe contato il LIVELLO, non i membri.
        // L'altro percorso lo diceva gia` giusto.
        // (Segnalato dalla chat REGOLE, giro del 20 settembre.)

        const MEC = meccaniche();
        if (mod > MEC.MOD_MAX) { voci.push({ fonte: 'limite', valore: MEC.MOD_MAX - mod, motivo: `MOD massimo ${MEC.MOD_MAX}` }); mod = MEC.MOD_MAX; }
        if (mod < MEC.MOD_MIN) { voci.push({ fonte: 'limite', valore: MEC.MOD_MIN - mod, motivo: `MOD minimo ${MEC.MOD_MIN}` }); mod = MEC.MOD_MIN; }

        let valore = base + mod;
        // 🔴 NIENTE clamp a 1. Per regola un Valore di Successo sotto 1 e`
        // un FALLIMENTO AUTOMATICO: non si tira. Portarlo a 1 inventava un
        // valore — un PH 10 a -12 schivava tirando un 1. Stessa gestione del
        // tiro d'attacco: il valore vero, e il flag `impossibile`.
        // (Segnalato dalla chat REGOLE, giro del 20 settembre.)

        note.push('L\'Hacking agisce nell\'Area di Hacking: non servono LoF, gittata né copertura.');
        return { valore, base, mod, voci, note, avvisi: [],
                 impossibile: valore < 1, critici: M.critici(valore) };
    };


    // Valore reale del Firewall di una truppa (TinBot: -3 o -6).
    // Il codice dell'Hub usava un -3 fisso: qui si legge il numero vero.
    M.valoreFirewall = function (unita) {
        const s = skillsDi(unita);

        // 🔴 I profili scrivono "ECM (Hacker -3)": il MOD ai tiri di Hacking
        // dei nemici. E` la stessa cosa di un Firewall, scritta diversamente.
        // Cercare solo "FIREWALL" lasciava a zero trenta e piu` profili.
        const ecm = /ECM\s*[\(\[]\s*HACKER\s*(-?\d+)/.exec(s);
        if (ecm) {
            const st0 = M.statoBersaglio(unita);
            // 🔴 L'ECM NON segue il Firewall. E` "Automatic Equipment" SENZA
            // etichetta Comms (regolamento 5.1.1, riga 10730). Quindi:
            //  - Isolato: RESTA. L'Isolato spegne solo cio` che e` Comms Attack
            //    o Comms Equipment; gli altri Automatici "continue to work"
            //    (righe 14412-14414, blocco ISOLATED STATE da riga 14399).
            //  - Disconnesso: si SPEGNE, perde gli Automatici (13833-13834).
            //  - Posseduto / Sepsitorizzato: RESTA, "does not interfere with
            //    Automatic..." (righe 14523, 14599).
            // Prima valeva `isolato || morto || incosciente`: l'Isolato lo
            // spegneva a torto, il Disconnesso no. (Chat REGOLE, 21 settembre.)
            // Verificato: la pagina wiki "ECM" e` in versione N5.3 e lo classifica
            // "AUTOMATIC EQUIPMENT" senza etichetta Comms. (Chat REGOLE.)
            if (st0.morto || st0.incosciente || st0.disconnesso) return 0;
            return -Math.abs(parseInt(ecm[1], 10));
        }

        if (s.indexOf('FIREWALL') < 0) return 0;

        // Fonte: wiki "Firewall", FAQ 0.1 (set 2026) — F01, verificata dalla
        // chat REGOLE — piu` l'aggiornamento N5.3.
        //  - F01: il Firewall del DISPOSITIVO DI HACKING non si applica se il
        //    dispositivo e` disabilitato: Isolato O QUALSIASI Stato Null.
        //  - N5.3: il Firewall e` "AUTOMATIC EQUIPMENT", e il Disconnesso perde
        //    gli Automatici (righe 13833-13834): niente Firewall da ogni fonte.
        // Firewall da TinBot su un Posseduto o Sepsitorizzato: NON si applica.
        // Righe 11130-11131: il TinBot da` i suoi MOD "as long as its owner is
        // not in any Null State ... or Isolated State". Quindi eNullo e` giusto
        // anche per questa fonte. Resta un solo limite: il Fairy Dust
        // (Supportware) ha regole proprie, e il motore non distingue la fonte.
        // Chat REGOLE, 23 settembre.
        const st = M.statoBersaglio(unita);
        // Firewall INVARIATO (chat REGOLE, 21 settembre): e` Obligatory, non
        // Automatic (riga 4750), quindi la regola del Disconnesso che spegne
        // gli Automatici non lo tocca in modo evidente. Il commento sopra
        // cita una FAQ 0.1 che nel progetto non c'e`: se dice "Null State",
        // va esteso ai cinque. Caso aperto: il TAG Posseduto e` "nemico" per
        // il suo proprietario (14505), e il suo Firewall potrebbe applicarsi
        // al Total Control del proprietario stesso.
        if (st.isolato || M.eNullo(unita)) return 0;

        // Il valore sta fra parentesi: "Firewall (-3)". Il codice storico
        // cercava le quadre, i profili usano le tonde: si accettano entrambe.
        const m = /FIREWALL\s*[\(\[]?\s*(-?\d+)/.exec(s);
        if (m) return -Math.abs(parseInt(m[1], 10));

        // Presente ma senza valore: -3 e` il caso piu` comune.
        return -3;
    };

    // Regola N5.3: si beneficia di UN SOLO Firewall alla volta. Se una
    // truppa ne avrebbe piu` d'uno, sceglie il giocatore.
    M.firewallMultipli = function (unita) {
        const s = skillsDi(unita);
        const trovati = [];
        const re = /FIREWALL\s*[\(\[]?\s*(-?\d+)/g;
        let m;
        while ((m = re.exec(s)) !== null) trovati.push(-Math.abs(parseInt(m[1], 10)));
        return {
            valori: trovati,
            sceltaRichiesta: trovati.length > 1,
            nota: trovati.length > 1
                ? 'La truppa puo` beneficiare di un solo Firewall: la scelta spetta al giocatore.'
                : null
        };
    };


    // ==================================================================
    // PARTE 11: ATTACCO GUIDATO
    // ------------------------------------------------------------------
    // Il modulo precedente forzava window.currentOrder.weapon a
    // "Smart Missile (Guided)", che nel database armi non esiste: il
    // profilo tornava generico, le bande di gittata erano finte e il
    // payload spediva comunque bands:[{mod:0}].
    //
    // La regola vera: l'attacco DEVE usare la Blast Mode dell'arma, se ne
    // ha una, o una modalità col Tratto Impact Template.
    // ==================================================================

    M.haGuidato = function (unita) {
        const s = skillsDi(unita);
        return s.indexOf('BS ATTACK (GUIDED)') >= 0 || s.indexOf('GUIDED') >= 0;
    };

    // Armi utilizzabili: solo modalità Blast / Impact Template.
    M.armiGuidate = function (unita) {
        const avvisi = [];
        const grezze = M.dividiLista(((unita && unita.weapon) || '') + ',' + ((unita && unita.equip) || ''));

        const dentro = [], escluse = [];

        grezze.forEach(function (nome) {
            let varianti = M.variantiArma(nome);
            if (varianti.length === 0) {
                const p = M.profiloArma(nome);
                if (p.nonTrovata) { escluse.push({ nome: nome, motivo: 'non presente nel database armi' }); return; }
                varianti = [p];
            }
            varianti.forEach(function (p) {
                if (dentro.some(x => x.nome === p.nome) || escluse.some(x => x.nome === p.nome)) return;
                if (p.isCC) return;

                const eBlast = /BLAST/i.test(p.nome);
                const tpl = M.tipoTemplate(p);
                const eImpatto = tpl.tipo === 'IMPATTO';

                if (eBlast || eImpatto) dentro.push(p);
                else escluse.push({ nome: p.nome, motivo: eBlast ? '' : 'non è una Blast Mode né ha il Tratto Impact Template' });
            });
        });

        if (!M.haGuidato(unita)) {
            avvisi.push(err('A95',
                `${M.nomeUnita(unita)} non ha "BS Attack (Guided)" nel profilo.`,
                'L\'Attacco Guidato richiede quella Skill.'));
        }
        return { armi: dentro, escluse: escluse, avvisi: avvisi };
    };

    // Come si risolve un Attacco Guidato.
    // ctx: { rangeIndex, bersaglio }
    M.regoleGuidato = function (arma, ctx) {
        ctx = ctx || {};
        const R = M.regoleAttacco(M.AZIONI.GUIDATO) || {};
        const tpl = M.regoleTemplate(arma);
        const voci = [];

        // La gittata SI applica: si misura in linea retta.
        let modGittata = 0;
        if (typeof ctx.rangeIndex === 'number' && arma && arma.bands && arma.bands[ctx.rangeIndex]) {
            const b = arma.bands[ctx.rangeIndex];
            modGittata = b.mod;
            voci.push({ fonte: 'gittata', valore: b.mod, motivo: `Gittata ${b.label} (misurata in linea retta)` });
        }

        // Stato Bersagliato: +3, ed è un requisito del Guidato, quindi c'è sempre.
        const bonus = R.bonusBersagliato != null ? R.bonusBersagliato : 3;
        voci.push({ fonte: 'bersagliato', valore: bonus, motivo: `Bersaglio in Stato Bersagliato: +${bonus} BS` });

        const modTotale = modGittata + bonus;

        return {
            attributo: 'BS',
            soloTurnoAttivo: true,
            richiedeLoF: false,
            burst: (arma && arma.burst) || 1,

            modGittata: modGittata,
            bonusBersagliato: bonus,
            modTotale: modTotale,
            voci: voci,
            ignoraMimetismo: true,
            ignoraCopertura: true,

            sagoma: tpl ? { tipo: tpl.tipo, forma: tpl.forma } : null,
            coperturaAnnullaSalvezza: tpl ? tpl.coperturaAnnullaSalvezza : false,
            criticoSoloSulPrincipale: true,
            soloPrimarioInF2F: true,

            reazioneBersaglio: R.reazioneBersaglio || 'Schivata a PH-3 oppure Reset a WIP-3.',
            noteGittata: R.noteGittata || null,
            noteSecondari: R.noteSecondari || null,
            avvisi: tpl ? tpl.avvisi : []
        };
    };


    // ==================================================================
    // PARTE 12: DIFESE E FUOCO DI SOPPRESSIONE
    // ==================================================================

    // Schivata: PH, con i MOD che il modulo precedente gestiva a metà.
    // ctx: { haLoFVersoAttaccante, controSagoma, armaDeployable, membriFireteam }
    M.modSchivata = function (unita, ctx) {
        ctx = ctx || {};
        const D = catalogo('DIFESA')['SCHIVATA'] || {};
        const voci = [], note = [];
        // I MOD degli stati: il catalogo li ha, nessuno li leggeva.
        const statiS = M.modStati(unita, 'SCHIVATA');
        // 🔴 "Dodge (PH=11)" SOSTITUISCE il PH di profilo: 14 unità PanO ce l'hanno.
        const attr = M.attributoEffettivo(unita, 'PH', 'Dodge');
        const base = attr.valore;
        if (attr.sostituito) note.push(attr.motivo);
        let mod = 0;

        // 🔴 SIXTH SENSE: "If the user declares Dodge or Reset, no negative
        // MODs are applied, with the exception of the -6 PH for
        // Immobilized-A, the -3 WIP for Immobilized-B and the -9 WIP per
        // Isolated." Applicavamo solo "niente -3 senza LoF": la regola e`
        // molto piu` larga, e copre anche Soppressione e terreni.
        const sestoSenso = M.trattiTiro(unita).sestoSenso;
        // 🔴 Le eccezioni (riga 9941, confermate dalla chat REGOLE: solo queste
        // tre) si leggono dal CATALOGO (SKILL['Sixth Sense']) e si
        // confrontano per ID. Prima: una lista scritta a mano, cercata come
        // SOTTOSTRINGA nel testo del motivo (la sigla IMM-A nella scritta). Una regola
        // di calcolo appesa a una scritta: rendendo la scritta leggibile
        // ("Immobilizzato-A") l'eccezione si spegneva, e il Sesto Senso
        // toglieva un -6 che deve restare. Presa dal test della chat TEST.
        const ECCEZIONI = (((catalogo('SKILL') || {})['Sixth Sense'] || {}).effetto || {}).eccezioni || [];
        statiS.voci.forEach(function (v) {
            const eccezione = ECCEZIONI.indexOf(v.stato) >= 0;
            if (sestoSenso && v.valore < 0 && !eccezione) {
                note.push(`Sesto Senso: ignorato ${v.motivo}.`);
                return;
            }
            mod += v.valore; voci.push(v);
        });
        const permessaS = M.azionePermessaDaStati(unita, 'SCHIVATA');
        if (!permessaS.permessa) note.push(permessaS.motivo);

        // Un solo -3, anche se ricorrono più cause insieme.
        const cause = [];
        if (ctx.haLoFVersoAttaccante === false) cause.push('nessuna LoF verso l\'attaccante');
        if (ctx.armaDeployable) cause.push('arma Deployable (mina)');
        if (ctx.controSagoma && ctx.haLoFVersoAttaccante === false) cause.push('Sagoma senza LoF');
        if (cause.length > 0) {
            // 🔴 Il Sesto Senso ignora OGNI MOD negativo su Schivata e Reset,
            // non solo questo -3. Le sole eccezioni sono IMM-A, IMM-B e
            // Isolato, gestite sopra.
            if (sestoSenso) {
                note.push(`Sesto Senso: ignorato il -3 (${cause[0]}).`);
            } else {
                mod -= 3;
                voci.push({ fonte: 'lof', valore: -3, motivo: `Schivata a -3: ${cause[0]}` });
                if (cause.length > 1) note.push('Più cause di -3 insieme non si sommano: il malus resta -3.');
            }
        }

        // Notazioni di profilo, interpretate per tipo invece che a numero.
        M.notazioniAzione(skillsDi(unita), 'Dodge').forEach(function (n) {
            switch (n.tipo) {
                case 'MOD':
                    // Dodge (-3) è il MOD imposto ai NEMICI, non a sé stessi.
                    if (n.valore > 0) { mod += n.valore; voci.push({ fonte: 'profilo', valore: n.valore, motivo: `Dodge (${n.raw})` }); }
                    else note.push(`Dodge (${n.raw}): è il MOD che i tuoi nemici applicano ai propri tiri contro di te.`);
                    break;
                case 'MOVIMENTO':
                    // 🔴 Dodge (+1") è un bonus di MOVIMENTO: non si somma al tiro.
                    note.push(`Dodge (${n.raw}): ${n.valore > 0 ? '+' : ''}${n.valore}" di movimento extra schivando. Non modifica il tiro.`);
                    break;
                case 'SOSTITUZIONE':
                    break;   // già applicata sulla base, vedi sotto
                case 'MOD_ATTRIBUTO':
                    if (n.attributo === 'PH') {
                        // "Dodge (PH+3)" e "Dodge (+3)" sono la stessa cosa scritta
                        // in due modi: il db li usa entrambi.
                        mod += n.valore;
                        voci.push({ fonte: 'profilo', valore: n.valore, motivo: `Dodge (${n.raw})` });
                    } else if (n.attributo === 'ARM' || n.attributo === 'BTS') {
                        note.push(`Dodge (${n.raw}): se FALLISCI questo tiro, somma ${n.valore > 0 ? '+' : ''}${n.valore} al tuo ${n.attributo} per il Tiro Salvezza. Non modifica il tiro di Schivata.`);
                    } else {
                        note.push(`Dodge (${n.raw}): MOD al ${n.attributo}, non al tiro di Schivata.`);
                    }
                    break;
            }
        });

        // Il +1 Schivata e` il bonus di LIVELLO 3, non "3 membri".
        let livFT = parseInt(ctx.livelloFireteam, 10);
        if (!isFinite(livFT) && Array.isArray(ctx.fireteam)) livFT = M.livelloFireteam(ctx.fireteam).livello;
        if (!isFinite(livFT)) livFT = parseInt(ctx.membriFireteam, 10) || 0;
        if (livFT >= 3) { mod += 1; voci.push({ fonte: 'fireteam', valore: 1, motivo: `Fireteam di Livello ${livFT}: +1 Schivata` }); }

        const MEC = meccaniche();
        if (mod > MEC.MOD_MAX) mod = MEC.MOD_MAX;
        if (mod < MEC.MOD_MIN) { voci.push({ fonte: 'limite', valore: MEC.MOD_MIN - mod, motivo: `MOD minimo ${MEC.MOD_MIN}` }); mod = MEC.MOD_MIN; }
        let valore = base + mod;
        // 🔴 NIENTE clamp a 1. Per regola un Valore di Successo sotto 1 e`
        // un FALLIMENTO AUTOMATICO: non si tira. Portarlo a 1 inventava un
        // valore — un PH 10 a -12 schivava tirando un 1. Stessa gestione del
        // tiro d'attacco: il valore vero, e il flag `impossibile`.
        // (Segnalato dalla chat REGOLE, giro del 20 settembre.)

        if (ctx.controSagoma) note.push(D.concessaSenzaLoF || 'Contro una Sagoma la Schivata è sempre concessa.');
        return { valore, base, mod, voci, note, attributo: 'PH', avvisi: [],
                 impossibile: valore < 1, critici: M.critici(valore) };
    };

    // Reset: WIP. Il malus di LoF non c'entra: è una regola della Schivata.
    M.modReset = function (unita, ctx) {
        ctx = ctx || {};
        const voci = [], note = [];
        const base = parseInt((unita && unita.wip), 10) || 0;
        let mod = 0;

        // I MOD degli stati: IMM-B da` -3 al Reset, Isolato -9. Stavano nel
        // catalogo e non venivano letti.
        // 🔴 E il Sesto Senso ignora ogni MOD negativo anche qui, tranne
        // proprio quei tre.
        const sestoSensoR = M.trattiTiro(unita).sestoSenso;
        // 🔴 Le eccezioni (riga 9941, confermate dalla chat REGOLE: solo queste
        // tre) si leggono dal CATALOGO (SKILL['Sixth Sense']) e si
        // confrontano per ID. Prima: una lista scritta a mano, cercata come
        // SOTTOSTRINGA nel testo del motivo (la sigla IMM-A nella scritta). Una regola
        // di calcolo appesa a una scritta: rendendo la scritta leggibile
        // ("Immobilizzato-A") l'eccezione si spegneva, e il Sesto Senso
        // toglieva un -6 che deve restare. Presa dal test della chat TEST.
        const ECCEZIONI_R = (((catalogo('SKILL') || {})['Sixth Sense'] || {}).effetto || {}).eccezioni || [];
        M.modStati(unita, 'RESET').voci.forEach(function (v) {
            const eccezione = ECCEZIONI_R.indexOf(v.stato) >= 0;
            if (sestoSensoR && v.valore < 0 && !eccezione) {
                note.push(`Sesto Senso: ignorato ${v.motivo}.`);
                return;
            }
            mod += v.valore; voci.push(v);
        });
        const permessaR = M.azionePermessaDaStati(unita, 'RESET');
        if (!permessaR.permessa) note.push(permessaR.motivo);

        const s = M.statoBersaglio(unita);
        // 🔴 Il -3 del Bersagliato ora viene da M.modStati(): applicarlo di
        // nuovo qui lo contava DUE volte, e il Reset scendeva a -6.
        // Resta il solo caso in cui lo stato non e` sull'unita` ma viene
        // dichiarato dal contesto.
        const giaDaStato = voci.some(function (v) { return v.fonte === 'stato'; });
        if (ctx.bersagliato && !s.targeted && !giaDaStato) {
            mod -= 3;
            voci.push({ fonte: 'bersagliato', valore: -3, motivo: 'Stato Bersagliato: -3 ai Tiri Reset' });
        }
        note.push('Il malus di -3 per assenza di LoF vale sulla Schivata, non sul Reset.');

        // 🔴 Il tetto dei MOD vale anche qui. Schivata, CC e Hacking lo
        // applicavano, il Reset no: Bersagliato -3 + IMM-B -3 + Isolato -9
        // = -15, che deve diventare -12 con la voce 'limite'.
        // (Segnalato dalla chat REGOLE, giro del 20 settembre.)
        const MECr = meccaniche();
        if (mod > MECr.MOD_MAX) { voci.push({ fonte: 'limite', valore: MECr.MOD_MAX - mod, motivo: `MOD massimo ${MECr.MOD_MAX}` }); mod = MECr.MOD_MAX; }
        if (mod < MECr.MOD_MIN) { voci.push({ fonte: 'limite', valore: MECr.MOD_MIN - mod, motivo: `MOD minimo ${MECr.MOD_MIN}` }); mod = MECr.MOD_MIN; }

        let valore = base + mod;
        // 🔴 NIENTE clamp a 1. Per regola un Valore di Successo sotto 1 e`
        // un FALLIMENTO AUTOMATICO: non si tira. Portarlo a 1 inventava un
        // valore — un PH 10 a -12 schivava tirando un 1. Stessa gestione del
        // tiro d'attacco: il valore vero, e il flag `impossibile`.
        // (Segnalato dalla chat REGOLE, giro del 20 settembre.)
        return { valore, base, mod, voci, note, attributo: 'WIP', avvisi: [],
                 impossibile: valore < 1, critici: M.critici(valore) };
    };

    // --- Fuoco di Soppressione ---

    M.armiSoppressione = function (unita) {
        const avvisi = [];
        const grezze = M.dividiLista(((unita && unita.weapon) || '') + ',' + ((unita && unita.equip) || ''));
        const dentro = [], escluse = [];
        let dedotte = 0;

        grezze.forEach(function (nome) {
            let varianti = M.variantiArma(nome);
            if (varianti.length === 0) {
                const p = M.profiloArma(nome);
                if (p.nonTrovata) { escluse.push({ nome: nome, motivo: 'non presente nel database armi' }); return; }
                varianti = [p];
            }
            varianti.forEach(function (p) {
                if (dentro.some(x => x.nome === p.nome) || escluse.some(x => x.nome === p.nome)) return;
                if (p.isCC) return;

                // 🔴 Il Tratto si legge sulla MODALITÀ, non sull'arma: un MULTI
                // Rifle in modalità AP entra in Soppressione, in Anti-materiel no.
                if (M.haTratto(p, 'Suppressive Fire')) { dentro.push(p); return; }

                if (p.traitsFonte === 'database') {
                    escluse.push({ nome: p.nome, motivo: 'non ha il Tratto "Suppressive Fire"' });
                } else if (!p.isTemplate && p.bands && p.bands.length > 0) {
                    // Ripiego solo per le armi che il db non copre ancora.
                    dentro.push(p); dedotte++;
                } else {
                    escluse.push({ nome: p.nome, motivo: p.isTemplate ? 'arma a Sagoma' : 'senza gittata' });
                }
            });
        });

        if (dedotte > 0) {
            avvisi.push(err('A96',
                `${dedotte} arma/e ammessa/e senza poter controllare il Tratto "Suppressive Fire".`,
                'Queste voci non hanno il campo traits nel database: la selezione è approssimata.'));
        }
        return { armi: dentro, escluse: escluse, avvisi: avvisi };
    };

    // Profilo SF Mode di un'arma: cambia SOLO gittata e Burst.
    M.profiloSF = function (arma) {
        const SF = catalogo('SF_MODE');
        const avvisi = [];
        if (!arma) return null;

        // Scatta solo se la fonte NON e` verificata: il catalogo ora porta
        // il profilo ufficiale dal Weapon Chart.
        const fonteSF = String(SF.fonte || '');
        if (!fonteSF || /DA VERIFICARE|DA SOSTITUIRE|ripiego|ricostru/i.test(fonteSF)) {
            avvisi.push(err('A97',
                'Profilo SF Mode di ripiego: non letto dal database di fazione.',
                SF.doveTrovarlo || 'Il profilo SF e` un profilo arma e va letto dai db Nomadi/PanOceania.'));
        }

        const r = M.bandeGittata(SF.bande || SF.ranges);
        r.avvisi.forEach(a => avvisi.push(a));

        const maxOrig = (arma.bands && arma.bands.length) ? arma.bands[arma.bands.length - 1].a : null;
        const maxSF = SF.gittataMassima || (r.bande.length ? r.bande[r.bande.length - 1].a : null);
        if (maxOrig && maxSF && maxOrig > maxSF) {
            avvisi.push(err('A98',
                `In Soppressione la gittata massima scende da ${maxOrig}" a ${maxSF}".`,
                'Oltre quel limite si e` fuori gittata: il profilo SF sostituisce le gittate dell\'arma.'));
        }

        return Object.assign({}, arma, {
            nome: `${arma.nome} (SF Mode)`,
            nomeOriginale: arma.nome,
            burst: SF.burst || 3,
            bands: r.bande,
            gittataMassima: SF.gittataMassima || 24,
            noteGittata: SF.noteGittata || null,
            // invariati per regolamento
            dam: arma.dam, ammo: arma.ammo, ammoOpzioni: arma.ammoOpzioni,
            isTemplate: arma.isTemplate, isCC: arma.isCC, traits: arma.traits,
            sfMode: true, avvisi: avvisi
        });
    };

    // Cosa cancella lo Stato Fuoco di Soppressione.
    M.soppressioneCancellata = function (unita, evento) {
        const s = M.statoBersaglio(unita);
        const cause = [];
        if (evento === 'ORDINE') cause.push('la truppa ha dichiarato un Ordine');
        if (evento === 'ARO_NON_BS') cause.push('ARO diverso da un BS Attack con la SF Mode');
        // riga 14666: "any Null or Immobilized State"
        if (M.eNullo(unita)) cause.push('Stato Nullo');
        if (s.isolato) cause.push('Isolato');
        if (s.engaged) cause.push('Ingaggiato');
        if (s.immB || (unita && unita.states && unita.states.immobilizedA)) cause.push('Immobilizzato');
        if (unita && unita.states && unita.states.blinded) cause.push('Accecato');
        if (unita && unita.states && unita.states.retreat) cause.push('Ritirata!');
        return { cancellata: cause.length > 0, cause: cause };
    };


    // ==================================================================
    // PARTE 13: MOVIMENTO E INSTRADAMENTO
    // ------------------------------------------------------------------
    // Il modulo movimento decideva cosa instradare con una lista scritta a
    // mano: 'MOVIMENTO', 'CAUTO', 'SALTO'. Mancava ARRAMPICARSI, e ogni
    // abilità senza tiro aggiunta in futuro sarebbe finita per errore nel
    // ramo che apre una schermata di modificatori inesistente.
    // ==================================================================

    // `unita` facoltativa: con l'unita` la risposta tiene conto delle sue
    // skill. Senza, e` la risposta del catalogo, uguale per tutti.
    M.azioneSenzaTiro = function (actionId, unita) {
        const S = catalogo('MOVIMENTO').senzaTiro || {};
        const id = String(actionId || '').toUpperCase().trim();
        if (!id) return null;
        const chiave = Object.keys(S).find(k => k === id);
        if (!chiave) return null;
        const info = Object.assign({ id: chiave }, S[chiave]);
        // 🔴 CLIMBING PLUS: la scalata diventa un'Abilita` Breve (p.87).
        // M.tipoScalata lo sapeva gia`, ma nessun modulo la chiamava:
        // ordine_movimento chiedeva il tipo qui, e qui la risposta era
        // sempre LONG_SKILL. Una funzione giusta e un lettore che non la
        // usava. Ora la risposta passa da tipoScalata se c'e` l'unita`.
        // (Chat TEST, 23 settembre.)
        if (chiave === 'ARRAMPICARSI' && unita) {
            const ts = M.tipoScalata(unita);
            info.tipo = ts.tipo;
            if (ts.climbingPlus) info.note = ts.nota;
        }
        return info;
    };

    // Quale delle due metà dell'ordine richiede un calcolo?
    // Restituisce null se l'ordine è di puro movimento.
    M.azioneDaRisolvere = function (azione1, azione2) {
        const candidate = [azione1, azione2]
            .map(a => String(a || '').trim())
            .filter(Boolean);
        for (let i = 0; i < candidate.length; i++) {
            if (!M.azioneSenzaTiro(candidate[i])) return candidate[i];
        }
        return null;
    };

    // Questo Ordine genera ARO?
    // ctx: { fuoriLoFeZdC }  — per il Movimento Cauto, dichiarato dal giocatore.
    M.generaAro = function (actionId, ctx) {
        ctx = ctx || {};
        const C = catalogo('MOVIMENTO');
        const a = M.azioneSenzaTiro(actionId);

        // Azione non censita fra quelle senza tiro: è un attacco o simile, ARO sì.
        if (!a) return { genera: true, motivo: null };

        if (a.generaAro === false) {
            return { genera: false, motivo: `${a.nome}: non genera ARO.` };
        }

        // 🔴 Movimento Cauto: la condizione la dichiara il giocatore.
        if (a.generaAro === 'CONDIZIONALE') {
            const mc = C.movimentoCauto || {};
            if (ctx.fuoriLoFeZdC === true) {
                return { genera: false, motivo: mc.testo || 'Movimento Cauto fuori da LoF e ZdC nemiche: nessun ARO.' };
            }
            return { genera: true, motivo: mc.seDentro || 'Movimento Cauto che inizia o finisce dentro LoF o ZdC nemica: ARO come al solito.',
                     condizionale: true };
        }

        return { genera: true, motivo: null };
    };


    // ==================================================================
    // PARTE 14: ARO (TURNO REATTIVO)
    // ------------------------------------------------------------------
    // Il canale ARO ha un vocabolario proprio (M.AZIONI_ARO) perché è così
    // che l'Hub lo legge oggi. Qui si traduce nei due sensi, così i moduli
    // non devono ricordarsi la corrispondenza a memoria.
    // ==================================================================

    // ARO -> attivo. 'DODGE' -> 'SCHIVATA', 'BS_ATTACK' -> 'ATTACCO BS'.
    M.aroAdAzione = function (idAro) {
        const mappa = {
            'BS_ATTACK': M.AZIONI.BS_ATTACK,
            'CC_ATTACK': M.AZIONI.CC_ATTACK,
            'HACKING':   M.AZIONI.HACKING,
            'DODGE':     M.AZIONI.SCHIVATA,
            'RESET':     M.AZIONI.RESET
        };
        return mappa[String(idAro || '').toUpperCase()] || null;
    };

    M.azioneAdAro = function (azione) {
        const a = String(azione || '').toUpperCase();
        const mappa = {};
        mappa[M.AZIONI.BS_ATTACK.toUpperCase()] = 'BS_ATTACK';
        mappa[M.AZIONI.CC_ATTACK.toUpperCase()] = 'CC_ATTACK';
        mappa[M.AZIONI.HACKING.toUpperCase()]   = 'HACKING';
        mappa[M.AZIONI.SCHIVATA.toUpperCase()]  = 'DODGE';
        mappa[M.AZIONI.RESET.toUpperCase()]     = 'RESET';
        return mappa[a] || null;
    };

    // Quali ARO può dichiarare questa truppa contro l'attacco in arrivo.
    // Restituisce tutte le voci con ammesso/motivo, come bersagliValidi.
    M.azioniAroPossibili = function (unita, azioneInArrivo) {
        const st = M.statoBersaglio(unita);
        const sk = skillsDi(unita);
        const inArrivo = String(azioneInArrivo || '').toUpperCase();
        const arrivoHacking = inArrivo === String(M.AZIONI.HACKING).toUpperCase();
        const arrivoGuidato = inArrivo === String(M.AZIONI.GUIDATO).toUpperCase();

        const voci = [
            { id: 'BS_ATTACK', nome: 'Attacco BS' },
            { id: 'CC_ATTACK', nome: 'Attacco in Corpo a Corpo' },
            { id: 'HACKING',   nome: 'Hacking' },
            { id: 'DODGE',     nome: 'Schivata' },
            { id: 'RESET',     nome: 'Reset' }
        ];

        return voci.map(function (v) {
            const e = { id: v.id, nome: v.nome, ammesso: true, motivo: null, note: [] };
            function nega(m) { e.ammesso = false; e.motivo = m; }

            // 🔴 Eccezione: l'ARMED TURRET reagisce, con BS o CC (PARA CC
            // Weapon), e solo agli Ordini dei nemici di chi l'ha schierata
            // (riga 6497) — cioe` quando e` nel roster che reagisce. Contro un
            // Marker non puo`: lo esclude gia` il filtro dei bersagli.
            if (unita && unita.deployable && unita.reagisce) {
                if (v.id !== 'BS_ATTACK' && v.id !== 'CC_ATTACK') {
                    nega('Armed Turret: reagisce solo con un Attacco BS o in CC.');
                    return e;
                }
                e.note.push('Armed Turret: mai contro un Marker (riga 6497).');
            } else
            // 🔴 Un Deployable non schiva e non spara a scelta: ha solo il
            // proprio innesco. Offrirgli BS, CC e Schivata sarebbe offrire
            // azioni che il regolamento non gli concede.
            if (unita && unita.deployable) {
                nega('È un Deployable: reagisce solo col proprio innesco, non dichiara ARO.');
                return e;
            }
            // 🔴 NON M.eNullo: qui si chiede "puo` reagire". Posseduto e
            // Sepsitorizzato sono Null ma REAGISCONO, per l'avversario
            // (righe 14504-14509, 14584-14589): non vanno bloccati.
            // LIMITE NOTO: l'app non modella il cambio di lato, quindi non
            // li offre all'avversario. Annotato, non risolto qui.
            if (st.morto || st.incosciente) { nega('Stato Nullo: non può dichiarare ARO.'); return e; }
            if (st.disconnesso) { nega('Disconnessa: non può dichiarare ARO.'); return e; }

            // 🔴 Lo stato del REATTIVO, non solo l'attacco in arrivo.
            // Prima BS, CC e Hacking venivano offerti anche a truppe IMM-A,
            // IMM-B, Stordite e Ingaggiate. Reggeva solo perche`
            // logica_aro.js chiamava puoFareAzione(), che vive nell'HTML:
            // una regola di gioco custodita dall'interfaccia.
            const perm = M.azionePermessaDaStati(unita, M.aroAdAzione(v.id) || v.id);
            if (!perm.permessa) { nega(perm.motivo); return e; }

            const modSt = M.modStati(unita, M.aroAdAzione(v.id) || v.id);
            modSt.voci.forEach(function (x) { e.note.push(x.motivo); });

            switch (v.id) {
                case 'HACKING':
                    if (sk.indexOf('HACKER') < 0) nega('Non è un Hacker.');
                    else if (M.programmiAttacco(unita).programmi.length === 0) {
                        nega('Nessun programma d\'attacco con questo dispositivo.');
                    }
                    break;
                case 'RESET':
                    // Il Reset difende dagli Attacchi Comms e dall'Attacco Guidato.
                    if (inArrivo && !arrivoHacking && !arrivoGuidato) {
                        nega('Il Reset difende dagli Attacchi Comms e dall\'Attacco Guidato, non da questo attacco.');
                    } else if (arrivoGuidato && !st.targeted) {
                        // Righe 7746-7752: contro il Guidato il Reset vale solo per il
                        // bersaglio designato, quello Bersagliato. (Chat REGOLE.)
                        nega('Contro l\'Attacco Guidato il Reset vale solo per il bersaglio designato (Bersagliato): qui solo Schivata.');
                    }
                    break;
                case 'DODGE':
                    if (arrivoHacking) nega('La Schivata non difende dagli Attacchi Comms: serve un Reset.');
                    else if (st.immB) nega('Immobilizzata: non può schivare.');
                    break;
                case 'BS_ATTACK':
                    if (st.engaged) e.note.push('In mischia: il tiro BS subisce -6.');
                    if (st.suppressive) e.note.push('In Fuoco di Soppressione: reagisce col profilo SF Mode a Burst 3.');
                    break;
                case 'CC_ATTACK':
                    if (!st.engaged) e.note.push('Richiede il contatto di Silhouette col nemico.');
                    break;
            }
            return e;
        });
    };

    // Armi utilizzabili in ARO. Se la truppa è in Fuoco di Soppressione e
    // reagisce con un BS Attack, il profilo diventa quello SF Mode.
    M.armiARO = function (unita, idAro) {
        const st = M.statoBersaglio(unita);
        const avvisi = [];

        if (idAro === 'HACKING') {
            const e = M.programmiAttacco(unita);
            return { armi: e.programmi.map(p => M.armaDaProgrammaDi(unita, p.scelta)), escluse: [], avvisi: e.avvisi };
        }

        const grezze = M.dividiLista(((unita && unita.weapon) || '') + ',' + ((unita && unita.equip) || ''));
        const dentro = [], escluse = [];

        grezze.forEach(function (nome) {
            let varianti = M.variantiArma(nome);
            if (varianti.length === 0) {
                const p = M.profiloArma(nome);
                if (p.nonTrovata) { escluse.push({ nome: nome, motivo: 'non presente nel database armi' }); return; }
                varianti = [p];
            }
            varianti.forEach(function (p) {
                if (dentro.some(x => x.nome === p.nome) || escluse.some(x => x.nome === p.nome)) return;
                // 🔴 vietatoInAro: "Restriction: Cannot be used in ARO" (riga 6045).
                // armiARO espande le modalita`, e offriva "D-Charges (Demolition
                // Mode)" come arma BS di reazione. Nessuno leggeva il campo.
                // (Chat REGOLE, 21 settembre; campo di DATABASE, .20.3.)
                const voceAro = (G.RULES_WEAPONS || {})[p.nome] || p;
                if (voceAro.vietatoInAro) {
                    escluse.push({ nome: p.nome, motivo: 'Non utilizzabile in ARO.' });
                    return;
                }
                if (idAro === 'CC_ATTACK') {
                    if (p.isCC) dentro.push(p);
                } else {
                    if (!p.isCC) dentro.push(p); else escluse.push({ nome: p.nome, motivo: 'arma da Corpo a Corpo' });
                }
            });
        });

        // 🔴 Fuoco di Soppressione: il profilo va sostituito con la SF Mode.
        if (st.suppressive && idAro === 'BS_ATTACK') {
            const sostituiti = dentro.map(function (p) {
                const sf = M.profiloSF(p);
                (sf.avvisi || []).forEach(a => { if (!avvisi.some(x => x.codice === a.codice)) avvisi.push(a); });
                return sf;
            });
            // ⚠️ LIMITE: in Soppressione si offre SOLO il profilo SF Mode. Il
            // modo normale — Burst pieno dell'arma e gittate proprie, che pero`
            // CANCELLA la Soppressione (MAPPA "Suppressive Fire") — e` una scelta
            // legale che oggi non viene proposta in ARO. (Chat REGOLE, 21 sett.)
            // 🔴 Decisione di Paolo (21 settembre): si offre ANCHE il modo
            // normale. `armi` resta coi profili SF, come prima; il modo
            // normale sta in `armiModoNormale`, marcato annullaSoppressione:
            // sceglierlo cancella lo stato (dichiarare un ARO diverso da BS
            // Attack in SF Mode la cancella).
            const normali = dentro.map(function (p) {
                return Object.assign({}, p, { annullaSoppressione: true });
            });
            return { armi: sostituiti, armiModoNormale: normali,
                     escluse: escluse, avvisi: avvisi, sfMode: true,
                     note: ['In Soppressione puoi rispondere col profilo SF Mode, e restare in Soppressione, oppure in modo normale — Burst pieno e gittate dell\'arma — ma la Soppressione si ANNULLA.'] };
        }

        return { armi: dentro, escluse: escluse, avvisi: avvisi, sfMode: false };
    };

    // Burst in ARO: 1, salvo regole che dicano altro.
    M.burstARO = function (unita, arma) {
        const st = M.statoBersaglio(unita);
        const voci = [], note = [];
        let valore = 1;
        voci.push({ fonte: 'aro', valore: 1, motivo: 'In Turno Reattivo il Burst è 1' });

        if (st.suppressive && arma && arma.sfMode) {
            valore = arma.burst || 3;
            voci.push({ fonte: 'soppressione', valore: valore - 1, motivo: `Fuoco di Soppressione: Burst ${valore} col profilo SF Mode` });
            note.push('Il Burst pieno va SEMPRE contro un bersaglio solo: non si divide fra più nemici attivi.');
        }
        return { valore, voci, note, unSoloBersaglio: st.suppressive };
    };


    // ==================================================================
    // PARTE 15: PARSER DELLE NOTAZIONI DI PROFILO
    // ------------------------------------------------------------------
    // Le notazioni fra parentesi nei profili NON sono tutte MOD numerici.
    // Estratte dal database PanOceania (269 unità), le famiglie sono:
    //
    //   +3          MOD all'attributo               Dodge (+3), Berserk (+3)
    //   -3          MOD imposto all'AVVERSARIO      BS Attack (-3), Mimetism (-3)
    //   +1B         MOD al Burst                    Boarding Shotgun (+1B)
    //   +1SD        dado extra, NON Burst           BS Attack (+1SD)
    //   +1"         MOVIMENTO in pollici            Dodge (+1"), Climb (3")
    //   PH=11       SOSTITUZIONE dell'attributo     Dodge (PH=11), Gizmokit (PH=13)
    //   PS=6        SOSTITUZIONE del PS dell'arma   AP CC Weapon (PS=6)
    //   SR-1        MOD al Tiro Salvezza del bersaglio   BS Attack (SR-1)
    //   Shock       munizione aggiunta              CC Attack (Shock)
    //   testo       qualitativo                     Immunity (Shock), Terrain (Total)
    //
    // Trattarle tutte come numeri è sbagliato in due modi opposti: sommare
    // un movimento a un tiro, e ignorare una sostituzione che lo cambia.
    // ==================================================================

    // `etichetta` e` il nome della Skill/Arma a cui la notazione appartiene:
    // serve a distinguere i MOD negativi AUTOMATICI (Mimetism, Surprise
    // Attack, che valgono sempre) da tutti gli altri (Dodge, CC Attack, che
    // valgono solo nei Faccia a Faccia). Senza il nome la distinzione non e`
    // possibile: il valore "-3" da solo non dice a quale classe appartiene.
    M.parseNotazione = function (grezza, etichetta) {
        const t = String(grezza || '').trim();
        if (!t) return { tipo: 'VUOTA', raw: t };

        const compatta = t.replace(/\s+/g, '');

        // MOVIMENTO: numero seguito da " o da 'pollici'. NON è un MOD al tiro.
        let m = /^([+-]?\d+)\s*(?:"|”|''|pollici)$/i.exec(t);
        if (m) return { tipo: 'MOVIMENTO', valore: parseInt(m[1], 10), unita: 'pollici', raw: t,
                        note: 'Bonus di movimento: non si somma al tiro.' };

        // SOSTITUZIONE di attributo o PS: "PH=11", "PS=6", "WIP=13"
        m = /^([A-Z]{2,4})\s*=\s*(\d+)$/i.exec(compatta);
        if (m) return { tipo: 'SOSTITUZIONE', attributo: m[1].toUpperCase(), valore: parseInt(m[2], 10), raw: t,
                        note: `Sostituisce il valore di ${m[1].toUpperCase()}, non lo modifica.` };

        // DADO SPECIALE: "+1SD"
        m = /^([+-]?\d+)SD$/i.exec(compatta);
        if (m) return { tipo: 'DADO_SPECIALE', valore: parseInt(m[1], 10), raw: t,
                        note: 'Dado extra da tirare e poi scartare: NON aumenta il Burst.' };

        // BURST: "+1B"
        m = /^([+-]?\d+)B$/i.exec(compatta);
        if (m) return { tipo: 'BURST', valore: parseInt(m[1], 10), raw: t };

        // TIRO SALVEZZA del bersaglio: "SR-1", "SR-2"
        m = /^SR([+-]\d+)$/i.exec(compatta);
        if (m) return { tipo: 'SALVEZZA', valore: parseInt(m[1], 10), raw: t,
                        note: 'MOD al Tiro Salvezza del BERSAGLIO, non al proprio tiro.' };

        // UPGRADE di un Dispositivo di Hacking: "UPGRADE Zero Pain",
        // "UPGRADE Oblivion +1B, Trinity AP". Aggiunge programmi o li modifica.
        m = /^UPGRADE:?\s*(.+)$/i.exec(t);
        if (m) {
            const noti = Object.keys(catalogo('HACKING'));
            const voci = m[1].split(',').map(x => x.trim()).filter(Boolean).map(function (v) {
                // Il nome del programma puo` essere di piu` parole ("Zero Pain",
                // "Total Control"): si cerca il piu` lungo che combacia, invece
                // di tagliare al primo spazio.
                const U = v.toUpperCase();
                const trovato = noti.filter(k => U.indexOf(k) === 0).sort((a, b) => b.length - a.length)[0];
                if (trovato) {
                    const resto = v.slice(trovato.length).trim();
                    return { programma: trovato, modifica: resto || null };
                }
                const mm = /^([A-Za-z ]+?)\s+([+-].*)$/.exec(v);
                return mm ? { programma: mm[1].trim().toUpperCase(), modifica: mm[2].trim() }
                          : { programma: U, modifica: null };
            });
            return { tipo: 'UPGRADE', voci: voci, raw: t,
                     note: 'Upgrade del Dispositivo di Hacking: aggiunge o modifica programmi.' };
        }

        // MOD a un ATTRIBUTO specifico: "PH+3", "ARM+3", "PH-3".
        // Diverso da "PH=11", che invece SOSTITUISCE il valore.
        m = /^([A-Z]{2,4})([+-]\d+)$/i.exec(compatta);
        if (m) return { tipo: 'MOD_ATTRIBUTO', attributo: m[1].toUpperCase(), valore: parseInt(m[2], 10), raw: t,
                        note: `MOD di ${m[2]} al ${m[1].toUpperCase()}: modifica, non sostituisce.` };

        // MOD numerico puro: "+3", "-6"
        m = /^([+-]\d+)$/.exec(compatta);
        if (m) {
            const v = parseInt(m[1], 10);
            // N5.3: i MOD negativi si dividono in DUE classi.
            //  - Skill/Equipaggiamenti AUTOMATICI (Mimetism -6, Surprise
            //    Attack -3): si applicano SEMPRE, come dicono le loro regole.
            //  - Tutto il resto (Dodge -3, CC Attack -3, PARA CCW -6): si
            //    applicano SOLO nei Tiri Faccia a Faccia.
            const automatica = /(MIMETISM|SURPRISE ATTACK|ALBEDO|ECM|FIREWALL|CAMOUFLAGE|NANOSCREEN)/i
                .test(String(etichetta || '') + ' ' + t);
            return { tipo: 'MOD', valore: v, raw: t,
                     versoAvversario: v < 0,
                     soloInF2F: v < 0 && !automatica,
                     automatica: automatica,
                     note: v < 0
                        ? (automatica
                            ? 'MOD negativo di una Skill automatica: si applica sempre.'
                            : 'MOD negativo imposto all\'avversario, e solo nei Tiri Faccia a Faccia.')
                        : null };
        }

        // MUNIZIONE aggiunta
        if (M.munizioneNota && M.munizioneNota(compatta)) {
            return { tipo: 'MUNIZIONE', munizione: compatta.toUpperCase(), raw: t };
        }

        return { tipo: 'TESTO', testo: t, raw: t };
    };

    // Tutte le notazioni legate a un'etichetta, già interpretate.
    M.notazioniAzione = function (testo, etichetta) {
        return M.notazioneAzione(testo, etichetta).map(n => M.parseNotazione(n, etichetta));
    };

    // Tutte le notazioni di un profilo, ciascuna con la propria etichetta.
    // Serve per i MOD automatici (Mimetism, Surprise Attack), che non sono
    // legati a un'azione ma valgono sempre.
    M.tutteLeNotazioni = function (unita) {
        const testo = skillsDi(unita);
        const out = [];
        const re = /([A-Za-z][A-Za-z0-9\/ :+.-]*?)\s*\(([^()]*(?:\([^()]*\))?[^()]*)\)/g;
        let m;
        while ((m = re.exec(testo)) !== null) {
            const etichetta = m[1].trim().replace(/^[,;]\s*/, '');
            m[2].split(',').forEach(function (v) {
                v = v.trim();
                if (v) out.push(Object.assign({ etichetta: etichetta }, M.parseNotazione(v, etichetta)));
            });
        }
        return out;
    };

    // Valore effettivo di un attributo, tenendo conto delle sostituzioni
    // dichiarate nel profilo. Es. "Dodge (PH=11)" su un'unità con PH 10.
    M.attributoEffettivo = function (unita, attributo, etichetta) {
        const base = parseInt((unita && unita[String(attributo).toLowerCase()]), 10) || 0;
        if (!etichetta) return { valore: base, base: base, sostituito: false };

        const sost = M.notazioniAzione(skillsDi(unita), etichetta)
            .filter(n => n.tipo === 'SOSTITUZIONE' && n.attributo === String(attributo).toUpperCase());

        if (sost.length === 0) return { valore: base, base: base, sostituito: false };

        const v = sost[0].valore;
        return { valore: v, base: base, sostituito: true,
                 motivo: `${etichetta} (${attributo}=${v}): usa ${v} al posto del ${attributo} di profilo (${base}).` };
    };


    // ==================================================================
    // PARTE 16: WEAPON CHART UFFICIALE
    // ------------------------------------------------------------------
    // Adeguamento a RULES_WEAPONS riscritta dal chart (193 voci):
    //   - alias (RULES_WEAPONS_ALIAS)
    //   - voci-contenitore con solo `modalita: [...]`
    //   - salvAttr / salvTiri per arma, che BATTONO la munizione
    // ==================================================================

    // --- alias -> voce canonica ---
    // Risoluzione alias -> voce canonica, con due difese:
    //  1. un alias che differisce dalla voce canonica SOLO per maiuscole
    //     ("Chain-Colt" -> "Chain-colt", "VIRAL Sniper" -> "Viral Sniper")
    //     non e` un alias da seguire: il confronto e` insensibile al caso e
    //     seguirlo significava chiamare profiloArma su sé stesso, all'infinito;
    //  2. catena percorsa con un insieme di visitati, per non dipendere dal
    //     fatto che la tabella sia aciclica.
    M.risolviAlias = function (nome) {
        const A = G.RULES_WEAPONS_ALIAS || M._aliasArmi;
        if (!A) return null;

        const chiavi = Object.keys(A);
        const partenza = normalizza(nome).toLowerCase();
        let corrente = partenza;
        let primoAlias = null;
        const visti = new Set([partenza]);

        for (let i = 0; i < 8; i++) {
            const k = chiavi.find(x => x.toLowerCase() === corrente);
            if (!k) break;
            const dest = normalizza(A[k]).toLowerCase();
            if (dest === corrente) break;      // alias che differisce solo per caso
            if (visti.has(dest)) break;        // ciclo
            visti.add(dest);
            if (!primoAlias) primoAlias = k;
            corrente = dest;
        }

        if (!primoAlias || corrente === partenza) return null;

        // riporta il nome nella grafia del database
        const db = dbArmi() || {};
        const canonico = Object.keys(db).find(x => x.toLowerCase() === corrente) ||
                         chiavi.map(x => A[x]).find(x => normalizza(x).toLowerCase() === corrente) ||
                         corrente;
        return { alias: primoAlias, canonico: canonico };
    };

    // --- voci che sono solo un contenitore di modalità ---
    // "MULTI Rifle" non ha b/dam/bande: ha modalita: ['MULTI Rifle (AP)', ...].
    // Leggere .bande su una di queste è l'errore da intercettare.
    M.modalitaArma = function (nome) {
        const db = dbArmi();
        if (!db) return null;
        let chiave = Object.keys(db).find(k => k.toLowerCase() === normalizza(nome).toLowerCase());
        if (!chiave) {
            const al = M.risolviAlias(nome);
            if (al) chiave = al.canonico;
        }
        if (!chiave) return null;
        const v = db[chiave];
        if (!v || !Array.isArray(v.modalita) || v.modalita.length === 0) return null;
        return { nome: chiave, modalita: v.modalita.slice(), profili: v.modalita.map(m => M.profiloArma(m)) };
    };

    M.eContenitoreDiModalita = function (arma) {
        return !!(arma && arma.soloModalita);
    };

    // --- Tiro Salvezza: l'arma ha la precedenza sulla munizione ---
    //
    // Il Weapon Chart dà attributo e numero di salvezze PER ARMA, e non
    // sempre seguono la munizione:
    //   Breaker Combi Rifle  ammo AP   -> BTS/2   (non ARM/2)
    //   K1 Combi Rifle       ammo N    -> ARM=0
    //   Plasma Rifle         ammo N    -> ARM+BTS, "1e1"
    // Derivare l'attributo dalla munizione farebbe calcolare tutte le
    // Breaker su ARM invece che su BTS.
    M.parseSalvAttr = function (testo) {
        const t = String(testo || '').trim().toUpperCase().replace(/\s+/g, '');
        if (!t) return null;

        // "ARM+BTS": Tiro Salvezza Combinato
        if (/^([A-Z]{2,3})\+([A-Z]{2,3})$/.test(t)) {
            const m = /^([A-Z]{2,3})\+([A-Z]{2,3})$/.exec(t);
            return { attributo: `${m[1]}+${m[2]}`, combinato: [m[1], m[2]], dimezza: false, azzera: false, mod: 0, raw: testo };
        }
        // "BTS/2", "ARM/2": attributo dimezzato
        let m = /^([A-Z]{2,3})\/2$/.exec(t);
        if (m) return { attributo: m[1], dimezza: true, azzera: false, mod: 0, raw: testo };
        // "ARM=0": l'attributo non conta
        m = /^([A-Z]{2,3})=0$/.exec(t);
        if (m) return { attributo: m[1], dimezza: false, azzera: true, mod: 0, raw: testo };
        // "PH-6": tiro speciale su un attributo con MOD
        m = /^([A-Z]{2,3})([+-]\d+)$/.exec(t);
        if (m) return { attributo: m[1], dimezza: false, azzera: false, mod: parseInt(m[2], 10), raw: testo };
        // "ARM", "BTS", "PH"
        if (/^[A-Z]{2,3}$/.test(t)) return { attributo: t, dimezza: false, azzera: false, mod: 0, raw: testo };

        return { attributo: null, raw: testo, nonInterpretabile: true };
    };

    // "1e1" = una salvezza per attributo (Tiro Salvezza Combinato).
    M.parseSalvTiri = function (testo) {
        const t = String(testo || '').trim().toLowerCase().replace(/\s+/g, '');
        if (!t) return null;
        if (/^\d+(e\d+)+$/.test(t)) {
            const pezzi = t.split('e').map(x => parseInt(x, 10));
            return { tiri: pezzi.reduce((a, b) => a + b, 0), perAttributo: pezzi, combinato: true, raw: testo };
        }
        const n = parseInt(t, 10);
        return isFinite(n) ? { tiri: n, combinato: false, raw: testo } : null;
    };

    // Parametri finali del Tiro Salvezza contro un colpo di quest'arma.
    // Ordine di precedenza: campi dell'ARMA > munizione > default.
    M.parametriSalvezza = function (arma, opzioni) {
        opzioni = opzioni || {};
        const avvisi = [];
        const note = [];
        const nomeAmmo = opzioni.ammo || (arma && arma.ammo) || 'N';
        const mun = M.risolviMunizione(nomeAmmo, { attributoArma: opzioni.attributoArma });
        mun.avvisi.forEach(a => avvisi.push(a));

        let attributo = mun.attributo;
        let dimezza = !!mun.dimezza;
        let azzera = false;
        let modAttributo = 0;
        let tiri = mun.salvezze;
        let combinato = (attributo === 'ARM+BTS');
        let fonte = 'munizione';

        let salvAttrEffettivo = arma && arma.salvAttr ? arma.salvAttr : null;

        // 🔴 NON REINTRODURRE `salvAttrDaProfilo`.
        // Qui c'era un ramo che, con quel campo, faceva salvare "PARA CC
        // Weapon (-3)" su PH-3. Era sbagliato: la salvezza PARA e` SEMPRE
        // PH-6 (REGOLE_N5_v5_1_1.txt righe 5715-5718). Il (-3) del profilo
        // e` un MOD al tiro dell'AVVERSARIO nel Faccia a Faccia, e sta nel
        // campo `modProfiloSu` — lo applica risolviScontro, passo 3b.
        // Il ramo era inerte perche` nessuna voce portava piu` il campo, ma
        // chi lo avesse rimesso credendo che servisse avrebbe riattivato in
        // silenzio la salvezza sbagliata. (Chat DATABASE, 21 settembre.)
        // Si guarda la voce del DATABASE: profiloArma non copia piu` il campo,
        // quindi sull'oggetto arma non ci sarebbe e l'avviso non scatterebbe.
        const voceDbSalv = arma ? ((G.RULES_WEAPONS || {})[arma.nome] || arma) : null;
        if (voceDbSalv && voceDbSalv.salvAttrDaProfilo) {
            avvisi.push(err('A79',
                `"${arma.nome}" porta salvAttrDaProfilo, campo ritirato: ignorato.`,
                'La salvezza PARA è sempre PH-6; il MOD del profilo va in modProfiloSu.'));
        }

        const sa = salvAttrEffettivo ? M.parseSalvAttr(salvAttrEffettivo) : null;

        // Se l'arma dichiara il proprio attributo di salvezza, l'assunto
        // "AP dimezza ARM o BTS: assunto ARM" e` gia` superato: l'avviso
        // A53 sarebbe rumore. Con i traits nel database scattava 45 volte
        // su dati corretti, e un avviso che grida sempre non lo legge piu`
        // nessuno.
        if (sa && !sa.nonInterpretabile) {
            for (let i = avvisi.length - 1; i >= 0; i--) {
                if (avvisi[i].codice === 'A53') avvisi.splice(i, 1);
            }
        }

        if (sa && !sa.nonInterpretabile) {
            attributo = sa.attributo;
            dimezza = sa.dimezza;
            azzera = sa.azzera;
            modAttributo = sa.mod || 0;
            combinato = !!sa.combinato;
            fonte = 'arma';
            if (sa.attributo !== mun.attributo) {
                note.push(`Attributo di salvezza ${salvAttrEffettivo} preso dall'arma: la munizione ${nomeAmmo} da sola direbbe ${mun.attributo}.`);
            }
        } else if (sa && sa.nonInterpretabile) {
            avvisi.push(err('A50b', `salvAttr "${salvAttrEffettivo}" di "${arma.nome}" non interpretabile: uso la munizione.`));
        }

        const st = arma && arma.salvTiri ? M.parseSalvTiri(arma.salvTiri) : null;
        if (st) {
            tiri = st.tiri;
            combinato = combinato || st.combinato;
            if (st.combinato) note.push(`${st.raw}: ${st.perAttributo.join(' + ')} salvezze, una per attributo.`);
            fonte = 'arma';
        }

        return {
            attributo, dimezza, azzera, modAttributo, tiri, combinato,
            ps: (arma && arma.dam != null) ? arma.dam : null,
            munizione: nomeAmmo,
            statiFallimento: mun.statiFallimento || [],
            dannoPerFallimento: mun.dannoPerFallimento,
            critExtra: mun.critExtra,
            fonte, note, avvisi
        };
    };


    // ==================================================================
    // PARTE 17: LETTURA DELLE LISTE DI PROFILO
    // ------------------------------------------------------------------
    // Le liste `weapon` e `equip` non si possono spezzare su una virgola
    // qualunque: una virgola dentro le parentesi appartiene alla voce.
    //   "Killer Hacking Device (UPGRADE Oblivion +1B, Trinity AP), Pistol"
    // Lo split ingenuo produceva "…(UPGRADE Oblivion +1B" e "Trinity AP)",
    // cioe` due voci rotte al posto di una.
    // ==================================================================

    M.dividiLista = function (testo) {
        const out = [];
        let corrente = '';
        let livello = 0;
        String(testo || '').split('').forEach(function (ch) {
            if (ch === '(' || ch === '[') livello++;
            else if (ch === ')' || ch === ']') livello = Math.max(0, livello - 1);
            if (ch === ',' && livello === 0) { out.push(corrente); corrente = ''; return; }
            corrente += ch;
        });
        out.push(corrente);
        return out.map(x => normalizza(x)).filter(function (x) {
            // "-" e "--" sono segnaposto per "nessuna arma".
            return x && x !== '-' && x !== '--' && x !== 'None' && x !== 'Nessuna';
        });
    };

    // Voci che compaiono nei profili ma NON sono armi: visori, dispositivi,
    // ripetitori, veicoli. Non devono produrre l'avviso "arma non trovata".
    M.EQUIP_NON_ARMI = [
        'Visor', 'Hacking Device', 'Repeater', 'Motorcycle', 'Baggage',
        'ECM', 'TinBot', 'Albedo', 'Holomask', 'Holoprojector', 'Nanoscreen',
        'Commlink', 'FastPanda', 'Deployable Cover', 'Bangbomb',
        'Cube', 'Medikit', 'Gizmokit', 'Sensor', 'Multiscanner',
        'Panzerfaust Ammo', 'Symbiont', 'Kit'
    ];

    M.eEquipaggiamento = function (nome) {
        const base = normalizza(String(nome || '').replace(/[\(\[][^\)\]]*[\)\]]/g, ' ')).toLowerCase();
        if (!base) return false;
        return M.EQUIP_NON_ARMI.some(function (e) {
            const t = e.toLowerCase();
            return base === t || base.indexOf(t) >= 0;
        });
    };

    // Classifica una voce di profilo: arma utilizzabile, equipaggiamento,
    // o davvero sconosciuta. Serve ai moduli per mostrare il motivo giusto.
    // Le voci di DB_STRUTTURE che un profilo puo` schierare: "Armed Turret
    // (Combi R.)" e` una struttura dispiegabile, non un'arma sconosciuta.
    M.strutturaDaNome = function (nome) {
        const db = G.DB_STRUTTURE;
        if (!Array.isArray(db)) return null;
        const base = normalizza(String(nome || '').replace(/\([^)]*\)/g, ' ')).toUpperCase();
        if (!base) return null;
        return db.find(function (st) {
            const n = normalizza(String(st.nome || '').replace(/\([^)]*\)/g, ' ')).toUpperCase();
            return n === base;
        }) || null;
    };

    M.classificaVoceProfilo = function (nome) {
        const pulito = normalizza(nome);
        if (!pulito) return { tipo: 'VUOTA' };

        // Una struttura dispiegabile: si riconosce prima di cercarla fra le
        // armi, altrimenti "Armed Turret (Combi R.)" risulta sconosciuta.
        const st = M.strutturaDaNome(pulito);
        if (st) {
            const arma = st.armaDalProfilo ? M.armaTorretta(st, pulito) : null;
            return { tipo: 'STRUTTURA', nome: pulito, struttura: st,
                     arma: arma ? arma.arma : null,
                     avvisi: arma ? arma.avvisi : [],
                     motivo: 'struttura dispiegabile, non un\'arma' };
        }

        if (M.eEquipaggiamento(pulito)) {
            return { tipo: 'EQUIPAGGIAMENTO', nome: pulito,
                     motivo: 'equipaggiamento, non un\'arma' };
        }
        const p = M.profiloArma(pulito);
        if (p.nonTrovata) return { tipo: 'SCONOSCIUTA', nome: pulito, profilo: p,
                                   motivo: 'non presente nel database armi' };
        if (p.soloModalita) return { tipo: 'CONTENITORE', nome: pulito, profilo: p,
                                     motivo: 'richiede la scelta di una modalità' };
        return { tipo: 'ARMA', nome: pulito, profilo: p };
    };


    // ==================================================================
    // PARTE 18: TIPO DI CONFRONTO
    // ------------------------------------------------------------------
    // Prima tessera della scomposizione di generaRisoluzioneDaDati.
    // Decide SOLO se il tiro è Faccia a Faccia, Normale o assente: nessun
    // valore di regolamento, quindi si può scrivere prima di sapere cosa
    // il changelog N5.3 abbia cambiato su copertura e mimetismo.
    //
    // Confronto con la riga 419 dell'Hub, che questa sostituirà:
    //  - l'Hub forza il Tiro Normale per l'Attacco Intuitivo. È SBAGLIATO:
    //    l'Intuitivo richiede un tiro WIP, quindi la reazione è simultanea
    //    e si risolve in Faccia a Faccia (wiki, Intuitive Attack).
    //  - l'Hub non tratta le Sagome DIRETTE, dove invece la reazione è un
    //    Tiro Normale per regolamento — e vale per QUALSIASI attacco di
    //    reazione, non solo per la Schivata.
    // ==================================================================

    M.CONFRONTO = { F2F: 'F2F', NORMALE: 'NORMALE', NESSUNO: 'NESSUNO' };

    // attacco:  { azione, arma, attaccante, bersaglio, burst, ammo }
    // reazione: { azione, arma, bersaglio, burst, ammo } oppure null
    // ctx:      { attaccanteHaMSV, difensoreHaMSV }
    M.tipoConfronto = function (attacco, reazione, ctx) {
        ctx = ctx || {};
        attacco = attacco || {};
        const note = [];
        const avvisi = [];

        function esito(tipo, motivo) {
            return { tipo: tipo, motivo: motivo, note: note, avvisi: avvisi };
        }

        const burstAtt = (attacco.burst != null) ? attacco.burst : 1;
        if (burstAtt <= 0) return esito(M.CONFRONTO.NESSUNO, 'L\'attaccante non tira: Burst 0.');

        if (!reazione || !reazione.azione || reazione.azione === M.AZIONI_ARO.NESSUNO) {
            return esito(M.CONFRONTO.NORMALE, 'Nessun ARO dichiarato: l\'attaccante tira da solo.');
        }
        const burstDif = (reazione.burst != null) ? reazione.burst : 1;
        if (burstDif <= 0) {
            return esito(M.CONFRONTO.NORMALE, 'Il reattivo non tira: Burst 0.');
        }

        const azione = String(attacco.azione || '').toUpperCase();

        // --- Attacco Intuitivo: richiede un tiro, quindi F2F ---
        // Vale ANCHE con una Sagoma Diretta: la regola dell'Intuitivo ha la
        // precedenza su quella delle Sagome.
        if (azione === String(M.AZIONI.INTUITIVO).toUpperCase()) {
            note.push('L\'Attacco Intuitivo richiede un tiro WIP: la reazione è simultanea e si risolve in Faccia a Faccia, anche con una Sagoma Diretta.');
            return esito(M.CONFRONTO.F2F, 'Attacco Intuitivo: reazione simultanea.');
        }

        // --- Scoprire non è un attacco: nessun confronto ---
        if (azione === String(M.AZIONI.SCOPRIRE).toUpperCase()) {
            return esito(M.CONFRONTO.NORMALE, 'Scoprire non è un Attacco: non genera Faccia a Faccia.');
        }

        // 🔴 BOOST: il deployable NON TIRA. Si muove fino al contatto e
        // detona, e l'unica difesa e` una Schivata come TIRO NORMALE.
        // Trattarlo come Faccia a Faccia darebbe al koala un tiro che il
        // regolamento non gli concede. (PARTE_1, riga 4700)
        const modoAtt = attacco.arma && attacco.arma.modoRisoluzione;
        if (modoAtt && modoAtt.tiroPerColpire === false) {
            note.push('Il deployable non tira: si muove fino al contatto e detona.');
            note.push('Se la Schivata riesce, l\'attacco è evitato del tutto.');
            return esito(M.CONFRONTO.NORMALE,
                `${modoAtt.etichetta}: il deployable detona senza tirare; l'unica difesa è una Schivata come Tiro Normale.`);
        }

        // --- Sagoma DIRETTA: nessun tiro per colpire, reazione a Tiro Normale ---
        const tpl = attacco.arma ? M.regoleTemplate(attacco.arma) : null;
        if (tpl && tpl.tipo === 'DIRETTO') {
            note.push('Sagoma Diretta: chi è colpito e reagisce fa un Tiro Normale, qualunque sia l\'attacco dichiarato. Il colpo dell\'attaccante è automatico.');
            return esito(M.CONFRONTO.NORMALE, 'Sagoma Diretta: nessun tiro per colpire, quindi niente da opporre.');
        }

        const azReaz = String(reazione.azione || '').toUpperCase();

        // --- Schivata e Reset: sempre opposti al tiro dell'attaccante ---
        // 🔴 Il Reset si oppone SOLO agli Attacchi Comms e ai BS Attack
        // (Guided). Contro un BS Attack normale o un CC Attack non e` un
        // Faccia a Faccia: "If the user is not making a Face to Face Roll ...
        // they will instead make a Normal Roll" (riga 7753). Prima qualunque
        // Reset era F2F. (Trovato col punto Sorpresa 5.2, chat REGOLE.)
        if (azReaz === 'RESET') {
            const azA = String(attacco.azione || '').toUpperCase();
            const resetOpposto = azA === M.AZIONI.HACKING || azA === M.AZIONI.GUIDATO ||
                                 azA === 'HACKING' || azA === 'ATTACCO GUIDATO';
            if (!resetOpposto) {
                return esito(M.CONFRONTO.NORMALE, 'Reset contro un attacco che non e` Comms ne` Guidato: Tiro Normale, non contrapposto.');
            }
        }
        if (azReaz === 'DODGE' || azReaz === 'RESET') {
            return esito(M.CONFRONTO.F2F, `${azReaz === 'DODGE' ? 'Schivata' : 'Reset'} contro l'attacco: Faccia a Faccia.`);
        }

        // --- Attacco di reazione: F2F solo se punta a CHI sta attaccando ---
        const bersaglioReaz = M.nomeUnita(reazione.bersaglio);
        const nomeAtt = M.nomeUnita(attacco.attaccante);
        if (!bersaglioReaz || !nomeAtt || bersaglioReaz.toUpperCase() !== nomeAtt.toUpperCase()) {
            note.push(`Il reattivo attacca ${bersaglioReaz || 'un altro bersaglio'}, non ${nomeAtt}: i due tiri sono indipendenti.`);
            return esito(M.CONFRONTO.NORMALE, 'La reazione non è diretta contro l\'attaccante.');
        }

        // --- Fumo contro Multispectral Visor: il confronto salta ---
        // Chi ha l'MSV vede attraverso il Fumo, quindi il tiro dell'altro
        // non lo ostacola: i due tiri smettono di essere opposti.
        // L'Eclipse invece blocca anche l'MSV, e il F2F resta.
        function usa(m, quale) { return String(m || '').toUpperCase().indexOf(quale) >= 0; }
        const attFumo = usa(attacco.ammo, 'SMOKE') && !usa(attacco.ammo, 'ECLIPSE');
        const difFumo = usa(reazione.ammo, 'SMOKE') && !usa(reazione.ammo, 'ECLIPSE');
        if ((attFumo && ctx.difensoreHaMSV) || (difFumo && ctx.attaccanteHaMSV)) {
            note.push('L\'Eclipse blocca anche i Multispectral Visor: con quello il Faccia a Faccia resterebbe.');
            return esito(M.CONFRONTO.NORMALE, 'Fumo contro Multispectral Visor: i tiri non sono opposti.');
        }

        return esito(M.CONFRONTO.F2F, 'Attacco e reazione si oppongono: Faccia a Faccia.');
    };


    // ==================================================================
    // PARTE 19: TIRO SALVEZZA
    // ------------------------------------------------------------------
    // Seconda tessera della scomposizione. Sostituisce calcolaSalvezza,
    // che oggi deduce TUTTO dalla stringa della munizione con una catena
    // di .includes(): l'attributo, il numero di dadi, il dimezzamento, gli
    // Stati. È lì che vivono i nove rami morti delle munizioni N3.
    //
    // Qui i parametri vengono da M.parametriSalvezza(), che legge i campi
    // ammo / salvAttr / salvTiri del Weapon Chart e usa la munizione solo
    // come ripiego. Nessuna deduzione dal nome.
    //
    // Restituisce DATI, non HTML: la presentazione è dell'interfaccia.
    // ==================================================================

    // bersaglio: unità che subisce il colpo
    // colpo:     { arma, ammo, cover, ignoraCopertura, firewall }
    M.tiroSalvezza = function (bersaglio, colpo, ctx) {
        colpo = colpo || {};
        ctx = ctx || {};
        const voci = [], note = [], avvisi = [];
        // `let`, non `const`: i Tratti condizionali possono sostituire l'arma
        // con una copia potenziata, e la sostituzione deve arrivare al resto
        // della funzione. Con `const` restava un oggetto locale inutilizzato.
        let arma = colpo.arma || null;

        // 🔴 I TRATTI CONDIZIONALI si risolvono QUI, dove il bersaglio e`
        // noto. Il Viral porta "BioWeapon (DA+Shock)": contro un bersaglio
        // con VITA la munizione diventa DA+SHOCK — due salvezze piu` lo
        // Shock — contro uno con STR resta quella di base.
        // Mettere DA+SHOCK fisso nel database avrebbe applicato la regola
        // anche ai bersagli che la regola esclude.
        let armaEff = arma;
        const cond = arma ? M.trattiCondizionali(arma, bersaglio) : { applicati: [], note: [], avvisi: [] };
        cond.avvisi.forEach(a => avvisi.push(a));
        cond.note.forEach(n => note.push(n));

        for (let i = 0; i < cond.applicati.length; i++) {
            const e = cond.applicati[i].effetto;
            // Nessun effetto: il bersaglio non fa il Tiro Salvezza affatto.
            if (e.nessunEffetto) {
                return {
                    offensivo: false, tiri: 0, attributo: null, valoreSuccesso: null,
                    voci: [], avvisi: avvisi, note: note,
                    motivo: cond.applicati[i].motivo ||
                            `Tratto ${cond.applicati[i].tratto}: nessun effetto su questo bersaglio.`
                };
            }
            // Munizione potenziata: si sostituisce l'arma con una copia.
            if (e.munizione) {
                armaEff = Object.assign({}, arma, { ammo: e.munizione, salvTiri: null });
                voci.push({ fonte: 'tratto', valore: 0,
                            motivo: `${cond.applicati[i].tratto}: munizione ${e.munizione}` });
            }
            if (e.attributoAZero) {
                voci.push({ fonte: 'tratto', valore: 0,
                            motivo: `${cond.applicati[i].tratto}: ${e.attributoAZero} del bersaglio ridotto a 0` });
            }
        }
        if (armaEff !== arma) {
            arma = armaEff;
            colpo = Object.assign({}, colpo, { arma: armaEff, ammo: armaEff.ammo });
        }

        // 🔴 Un'arma che NON ATTACCA non infligge Tiri Salvezza, e va
        // controllato QUI. M.deployableAttacca() e` un guardrail opzionale,
        // quindi aggirabile: chi lo dimenticava otteneva "ARM VS 1, PS 0",
        // un numero calcolato su dati che l'arma non ha. La regola non deve
        // dipendere dall'ordine delle chiamate.
        if (arma && arma.modoRisoluzione && arma.modoRisoluzione.attacca === false) {
            const mo = arma.modoRisoluzione;
            return {
                offensivo: false, tiri: 0, attributo: null, valoreSuccesso: null,
                voci: [], avvisi: [],
                note: [`${mo.etichetta}: non attacca, quindi non infligge Tiri Salvezza.` +
                       (mo.effetto ? ` Il suo effetto è: ${mo.effetto}.` : '')],
                motivo: `${mo.etichetta}: nessun Tiro Salvezza.`
            };
        }

        // 🔴 Una voce-contenitore non ha PS né munizione: calcolarci sopra
        // un Tiro Salvezza produce un numero inventato. Va scelta prima una
        // modalità. (Con "Plasma Rifle" senza modalità usciva un ARM+0.)
        if (arma && arma.soloModalita) {
            return { offensivo: false, tiri: 0, attributo: null, valoreSuccesso: null,
                     voci: [], note: [],
                     avvisi: [err('A55', `"${arma.nome}" richiede la scelta di una modalità prima del Tiro Salvezza.`,
                                  'Modalità: ' + (arma.modalita || []).join(', '))] };
        }
        if (arma && arma.nonTrovata) {
            return { offensivo: false, tiri: 0, attributo: null, valoreSuccesso: null,
                     voci: [], note: [],
                     avvisi: [err('A56', `Arma "${arma.nomeRichiesto || '?'}" non trovata: nessun Tiro Salvezza calcolabile.`)] };
        }

        // 🔴 La munizione la decide l'ARMA (o la sua modalita`), non il colpo.
        // Nessuna arma del database ha piu` di una munizione scegliibile: un
        // `ammo` sul colpo diverso da quelle dell'arma non sceglie niente — e
        // prima finiva nell'etichetta ("munizione: AP") mentre il calcolo
        // restava N: un dato che sembrava usato. Ora un ammo incoerente non
        // entra e lo si dice. (Chat TEST, 23 settembre.)
        let ammoColpo = colpo.ammo;
        const ammiesse = (arma && Array.isArray(arma.ammoOpzioni)) ? arma.ammoOpzioni : null;
        if (ammoColpo && ammiesse && ammiesse.length && ammiesse.indexOf(ammoColpo) < 0) {
            avvisi.push(err('A81', `Munizione "${ammoColpo}" non disponibile per ${arma.nome}: si usa ${ammiesse.join('/')}.`,
                'La munizione la decide l\'arma o la sua modalità (MULTI): sceglierla sul bersaglio non la cambia.'));
            ammoColpo = null;
        }
        const par = M.parametriSalvezza(arma, {
            ammo: ammoColpo,
            attributoArma: colpo.attributoArma
        });
        par.avvisi.forEach(a => avvisi.push(a));
        par.note.forEach(n => note.push(n));

        // --- azione non offensiva: nessun tiro ---
        if (par.attributo === 'nessuno' || par.tiri === 0) {
            return { offensivo: false, tiri: 0, note: ['Nessun Tiro Salvezza: azione non offensiva.'],
                     voci, avvisi, attributo: null, valoreSuccesso: null };
        }

        function valoreDi(attr) {
            const v = parseInt((bersaglio && bersaglio[String(attr).toLowerCase()]), 10);
            return isFinite(v) ? v : 0;
        }

        // --- un attributo alla volta, così il Tiro Salvezza Combinato
        //     (ARM+BTS del Plasma) si costruisce con lo stesso codice ---
        const attributi = par.combinato && Array.isArray(par.combinato)
            ? par.combinato
            : (String(par.attributo).indexOf('+') >= 0 ? String(par.attributo).split('+') : [par.attributo]);

        const rami = attributi.map(function (attr) {
            const vociR = [];
            const base = valoreDi(attr);
            let valore = base;
            vociR.push({ fonte: 'base', valore: base, motivo: `${attr} del bersaglio: ${base}` });

            if (par.azzera) {
                vociR.push({ fonte: 'arma', valore: -valore, motivo: `${arma && arma.nome}: ignora il ${attr} (${arma && arma.salvAttr})` });
                valore = 0;
            } else if (par.dimezza) {
                const dopo = Math.ceil(valore / 2);
                vociR.push({ fonte: 'arma', valore: dopo - valore, motivo: `${attr} dimezzato (arrotondato per eccesso)` });
                valore = dopo;
            }

            // Copertura Parziale: +3, ma non contro le Sagome e non se
            // l'attacco la ignora. La regola sta in una funzione sola.
            if (attr === 'ARM') {
                const cop = M.coperturaValeSullaSalvezza({
                    inCopertura: !!colpo.cover,
                    arma: arma,
                    ignoraCopertura: !!colpo.ignoraCopertura,
                    copertura: colpo.copertura
                });
                // 🔴 Qui sta la differenza fra le due skill: No Cover perde
                // anche il +3 ARM, Limited Cover lo tiene.
                const cs = M.coperturaSkill(bersaglio);
                if (cop.vale && cs && cs.cadeMODSalvezza) {
                    note.push(`${cs.skill}: nessun +3 ARM di Copertura al Tiro Salvezza.`);
                } else if (cop.vale) {
                    valore += cop.mod;
                    vociR.push({ fonte: 'copertura', valore: cop.mod, motivo: cop.motivo });
                    // 🔴 TETTO DEL VITROFERRO (riga 10687): "If the total value of
                    // the Trooper's ARM/BTS Attribute plus MODs exceeds 12, apply a
                    // total of 12 instead. Then add the Attack's PS value." Il
                    // tetto vale su attributo+MOD, PRIMA del PS: per questo sta
                    // qui e non sul valoreSuccesso. E` l'unico massimo che il
                    // regolamento pone a una salvezza.
                    if (cop.vitroferro && valore > 12) {
                        vociR.push({ fonte: 'limite', valore: 12 - valore, motivo: 'Vitroferro: ARM/BTS + MOD non oltre 12 (poi si somma il PS).' });
                        valore = 12;
                    }
                }
                else if (colpo.cover) note.push(cop.motivo);
            }

            // Firewall: equivalente della Copertura per gli Attacchi Comms.
            if (attr === 'BTS' && colpo.firewall && parseInt(colpo.firewall, 10) < 0) {
                valore += 3;
                vociR.push({ fonte: 'firewall', valore: 3, motivo: 'Firewall del bersaglio: +3 BTS (equivalente Copertura)' });
            }

            // Tiro speciale con MOD fisso (PARA: PH-6): niente PS.
            if (par.modAttributo) {
                valore += par.modAttributo;
                vociR.push({ fonte: 'arma', valore: par.modAttributo, motivo: `${arma && arma.salvAttr}: tiro speciale su ${attr}` });
                // 🔴 Niente clamp: sotto 1 il Tiro Salvezza e` FALLITO in automatico.
                const vs = valore;
                return { attributo: attr, base, valoreAttributo: valore, ps: null, valoreSuccesso: vs, voci: vociR, tiroSpeciale: true,
                         impossibile: vs < 1 };
            }

            const ps = (par.ps != null) ? par.ps : 0;
            // 🔴 Niente clamp: sotto 1 il Tiro Salvezza e` FALLITO in automatico,
            // e portarlo a 1 dava una salvezza che non esiste.
            const vs = valore + ps;
            vociR.push({ fonte: 'ps', valore: ps, motivo: `PS dell'arma: ${ps}` });
            return { attributo: attr, base, valoreAttributo: valore, ps: ps, valoreSuccesso: vs,
                     critici: M.critici(vs), voci: vociR, impossibile: vs < 1 };
        });

        // Tiri per attributo: "1e1" del Plasma = uno per ciascuno.
        const perAttr = (par.combinato && rami.length > 1) ? 1 : par.tiri;

        return {
            offensivo: true,
            combinato: rami.length > 1,
            attributo: rami.map(r => r.attributo).join('+'),
            rami: rami,
            // scorciatoie per il caso semplice, che è il 95%
            valoreSuccesso: rami.length === 1 ? rami[0].valoreSuccesso : null,
            valoreAttributo: rami.length === 1 ? rami[0].valoreAttributo : null,
            base: rami.length === 1 ? rami[0].base : null,
            ps: par.ps,
            tiri: par.tiri,
            tiriPerAttributo: perAttr,
            munizione: par.munizione,
            statiFallimento: par.statiFallimento,
            dannoPerFallimento: par.dannoPerFallimento,
            critExtra: par.critExtra,
            fonte: par.fonte,
            voci: rami.length === 1 ? rami[0].voci : [].concat.apply([], rami.map(r => r.voci)),
            note: note,
            avvisi: avvisi
        };
    };

    // Riepilogo in una riga, comodo per collaudo e per l'interfaccia.
    M.descriviSalvezza = function (esito) {
        if (!esito || !esito.offensivo) return 'Nessun Tiro Salvezza';
        if (esito.combinato) {
            return esito.rami.map(r => `${r.valoreSuccesso} o meno su ${r.attributo}`).join(' + ');
        }
        const dadi = esito.tiri > 1 ? `${esito.tiri} dadi` : '1 dado';
        return `${dadi} su ${esito.attributo}: ${esito.valoreSuccesso} o meno`;
    };


    // ==================================================================
    // PARTE 20: MOD DELL'ATTACCO
    // ------------------------------------------------------------------
    // Ultima tessera grossa. Sostituisce le righe 253-345 dell'Hub, dove i
    // MOD si accumulano in una variabile insieme all'HTML che li descrive.
    // Qui ogni contributo e` una voce con fonte, valore e motivo, e il
    // dettaglio si costruisce dopo, dall'interfaccia.
    // ==================================================================

    // Lettura dei tratti che incidono sul tiro. Un punto solo, invece di
    // undici .includes() sparsi.
    M.trattiTiro = function (unita) {
        const s = skillsDi(unita);
        function ha() {
            for (let i = 0; i < arguments.length; i++) if (s.indexOf(arguments[i]) >= 0) return true;
            return false;
        }
        const msv3 = M.haMSV3(unita);
        const msv2 = msv3 || ha('MSV2', 'MSV L2', 'MULTISPECTRAL VISOR L2');
        const msv1 = msv2 || ha('MSV1', 'MSV L1', 'MULTISPECTRAL VISOR L1');
        return {
            msv1: msv1, msv2: msv2, msv3: msv3,
            xVisor: ha('X VISOR', 'X-VISOR'),
            marksmanship: ha('MARKSMANSHIP'),
            tinBot: ha('TINBOT', 'FIREWALL'),
            // 🔴 I profili scrivono "ECM (Guided -6)", non "TinBot: Guided".
            // Come per i Multispectral Visor e il Firewall, si accetta la
            // grafia dei profili invece di farne riscrivere trenta.
            tinBotGuided: ha('TINBOT: GUIDED', 'TINBOT GUIDED') ||
                          /ECM\s*\(\s*GUIDED/.test(s),
            albedo: ha('ALBEDO'),
            // Tratti del TURNO REATTIVO, finora assenti dal motore.
            sestoSenso: ha('SIXTH SENSE', 'SESTO SENSO'),
            totalReaction: ha('TOTAL REACTION'),
            neurocinetica: ha('NEUROKINETICS', 'NEUROCINETIC'),
            attaccoSorpresa: ha('SURPRISE ATTACK')
        };
    };

    // Valore del Mimetismo di un bersaglio: -6 se dichiarato, altrimenti -3.
    // Albedo: MOD imposto all'ATTACCANTE, ma solo se quell'attaccante ha
    // un Multispectral Visor o Marksmanship. Il valore sta nel profilo:
    // "Albedo (-3)" o "Albedo (-6)", non e` fisso.
    M.valoreAlbedo = function (unita) {
        const s = skillsDi(unita);
        if (s.indexOf('ALBEDO') < 0) return 0;
        const m = /ALBEDO\s*[\(\[]?\s*(-?\d+)/.exec(s);
        if (m) return -Math.abs(parseInt(m[1], 10));
        const C = catalogo('EQUIP')['Albedo'];
        return (C && C.valoreDefault) ? C.valoreDefault : -6;
    };

    M.valoreMimetismo = function (unita) {
        const s = skillsDi(unita);
        const m = /MIMETISM[^(]*\(\s*(-?\d+)/.exec(s);
        if (m) return -Math.abs(parseInt(m[1], 10));
        return s.indexOf('MIMETISM') >= 0 ? -3 : 0;
    };

    // ctx: {
    //   rangeIndex | rangeMod, cover, terrain, inMischia,
    //   membriFireteam, reazione, distanzaPollici
    // }
    M.modAttacco = function (attaccante, difensore, arma, azione, ctx) {
        ctx = ctx || {};
        const voci = [], note = [], avvisi = [];
        const spec = M.SPEC[azione] || {};
        const tA = M.trattiTiro(attaccante);
        const tD = M.trattiTiro(difensore);
        const statoD = M.statoBersaglio(difensore);
        const statoA = M.statoBersaglio(attaccante);

        // --- attributo di partenza ---
        const attr = M.attributoArma(arma, azione);
        const nomeAttr = attr.attributo;
        let base = parseInt((attaccante && attaccante[String(nomeAttr).toLowerCase()]), 10) || 0;

        // Sostituzione da profilo, es. "BS Attack (BS=13)"
        const sost = M.attributoEffettivo(attaccante, nomeAttr, spec.etichetta || 'BS Attack');
        if (sost.sostituito) { base = sost.valore; note.push(sost.motivo); }
        if (attr.motivo) note.push(attr.motivo);

        let mod = 0;
        function aggiungi(fonte, valore, motivo) {
            if (!valore) { if (motivo) note.push(motivo); return; }
            mod += valore;
            voci.push({ fonte: fonte, valore: valore, motivo: motivo });
        }

        // 🔴 L'Attacco Intuitivo e` un tiro NUDO: nessun MOD, gittata
        // compresa. Si esce subito, prima di ogni altra considerazione.
        if (azione === M.AZIONI.INTUITIVO) {
            note.push('Attacco Intuitivo: tiro WIP non modificato. Nessun MOD si applica, da nessuna fonte.');
            return { valore: base, base: base, mod: 0, attributo: nomeAttr, voci, note, avvisi, burstMod: 0 };
        }

        const inCC = (spec.attributo === 'CC');

        // 🔴 In Corpo a Corpo il calcolo è tutto un altro: Arti Marziali,
        // Natural Born Warrior, notazioni CC. Lo sa modCC, e va chiamato —
        // altrimenti l'attaccante in mischia tira sul CC nudo e le Arti
        // Marziali funzionano solo per chi reagisce.
        if (inCC) {
            const cc = M.modCC(attaccante, difensore, arma, { inF2F: ctx.inF2F !== false });
            cc.attributo = 'CC';
            cc.burstMod = 0;
            cc.impossibile = (cc.valore < 1);
            // Gli stati generali valgono anche in mischia.
            if (statoD.suppressive) {
                cc.mod -= 3; cc.valore -= 3;
                cc.voci.push({ fonte: 'soppressione', valore: -3, motivo: 'Bersaglio in Fuoco di Soppressione: -3' });
            }
            if (statoA.stordito || (attaccante && attaccante.states && attaccante.states.stunned)) {
                cc.mod -= 3; cc.valore -= 3;
                cc.voci.push({ fonte: 'stordito', valore: -3, motivo: 'Attaccante Stordito: -3' });
            }
            if (cc.valore < 1) { cc.impossibile = true; cc.note.push(`Valore di Successo ${cc.valore}: il tiro fallisce automaticamente.`); }
            return cc;
        }

        const tpl = arma ? M.regoleTemplate(arma) : null;
        let burstMod = 0;

        // --- gittata ---
        if (!inCC && azione !== M.AZIONI.HACKING) {
            let rangeMod = 0;
            if (typeof ctx.rangeMod === 'number') rangeMod = ctx.rangeMod;
            else if (typeof ctx.rangeIndex === 'number' && arma && arma.bands && arma.bands[ctx.rangeIndex]) {
                rangeMod = arma.bands[ctx.rangeIndex].mod;
            }
            if (rangeMod !== 0) {
                // X-Visor: riduce il malus di gittata, mai oltre lo zero.
                if (tA.xVisor && rangeMod < 0) {
                    const dopo = Math.min(0, rangeMod + 3);
                    aggiungi('gittata', dopo, `Gittata ${dopo > 0 ? '+' : ''}${dopo} (X-Visor riduce il malus da ${rangeMod})`);
                } else {
                    aggiungi('gittata', rangeMod, `Gittata: ${rangeMod > 0 ? '+' : ''}${rangeMod}`);
                }
            }
        }

        // --- Boost: nessun tiro per colpire, come le Sagome Dirette ---
        const modoR = arma && arma.modoRisoluzione;
        if (modoR && modoR.tiroPerColpire === false) {
            const B = (catalogo('REGOLE_DEPLOYABLE') || {}).boost || {};
            return { valore: null, automatico: true, base: base, mod: 0, attributo: nomeAttr,
                     voci: [], burstMod: 0,
                     note: [`${modoR.etichetta}: il deployable non tira, si muove fino al contatto e detona.`,
                            B.difesa || null, B.rimozione || null].filter(Boolean),
                     avvisi };
        }

        // --- Sagoma Diretta: colpo automatico, nessun tiro ---
        if (tpl && tpl.tipo === 'DIRETTO' && azione !== M.AZIONI.GUIDATO) {
            return { valore: null, automatico: true, base: base, mod: 0, attributo: nomeAttr,
                     voci: [], burstMod: 0,
                     note: ['Sagoma Diretta: colpo automatico, nessun tiro per colpire. Copertura e Mimetismo non entrano nel calcolo.'],
                     avvisi };
        }

        // --- Attacchi Comms ---
        if (azione === M.AZIONI.HACKING) {
            // 🔴 Il +3 WIP di Trinity stava in arma.modAttacco e veniva
            // ignorato: modHacking lo applicava, risolviScontro no, perche`
            // passa da qui. Due percorsi per lo stesso tiro, due risultati.
            if (arma && arma.modAttacco) {
                aggiungi('programma', arma.modAttacco,
                    `${arma.nome}: ${arma.modAttacco > 0 ? '+' : ''}${arma.modAttacco} ${nomeAttr}`);
            }
            const fw = M.valoreFirewall(difensore);
            if (fw < 0) aggiungi('firewall', fw, `Firewall del bersaglio: ${fw} WIP`);
            // 🔴 Fra i Bonus Fireteam ufficiali NON c'e` un +1 WIP per gli
            // Attacchi Comms: il +1 di Livello 4 vale su BS Attack e sulle
            // armi con Tratto BS Weapon (PH)/(WIP), non sui Programmi.
            // (REGOLE_N5_v5_1_1.txt, riga 11932.)
            // Il commento lo diceva gia`, e la riga sotto lo aggiungeva lo
            // stesso se qualcuno passava ctx.bonusHackingFireteam. Tolta.
            if (ctx.bonusHackingFireteam) {
                note.push('Nessun bonus Fireteam agli Attacchi Comms: il +1 di Livello 4 vale solo sul BS Attack.');
            }
        }
        // --- attacchi a distanza ---
        else if (!inCC) {
            // 🔴 Il bonus viene dal LIVELLO del Fireteam, non dal numero di
            // membri. Si accetta anche `membriFireteam` per i chiamanti
            // vecchi, ma con un avviso: e` quasi sempre un valore sbagliato.
            let livFT = parseInt(ctx.livelloFireteam, 10);
            if (!isFinite(livFT) && Array.isArray(ctx.fireteam)) {
                livFT = M.livelloFireteam(ctx.fireteam).livello;
            }
            if (!isFinite(livFT) && ctx.membriFireteam) {
                livFT = parseInt(ctx.membriFireteam, 10) || 0;
                if (livFT >= 2) avvisi.push(err('A99',
                    `Bonus Fireteam calcolati sul numero di membri (${livFT}) invece che sul Livello.`,
                    'Il Livello è il numero di truppe della STESSA Unità: passa `fireteam` o `livelloFireteam`.'));
            }
            if ((livFT || 0) >= 4) {
                aggiungi('fireteam', 1, `Fireteam di Livello ${livFT}: +1 ${nomeAttr}`);
            }

            if (azione === M.AZIONI.GUIDATO) {
                aggiungi('bersagliato', 3, 'Bersaglio Bersagliato: +3 BS');
                note.push('Attacco Guidato: ignora Copertura e Mimetismo.');
                if (tD.tinBotGuided) {
                    // Il valore sta nel profilo: "ECM (Guided -6)". Si legge,
                    // non si assume: esistono anche ECM (Guided -3).
                    const m = /ECM\s*[\(\[]\s*GUIDED\s*(-?\d+)/.exec(skillsDi(difensore));
                    const v = m ? -Math.abs(parseInt(m[1], 10)) : -6;
                    aggiungi('ecm', v, `ECM (Guided ${v}) del bersaglio: ${v} ${nomeAttr}`);
                }
            } else if (azione === M.AZIONI.SPECULATIVO) {
                // 🔴 In N5 il -6 si applica SEMPRE. Toglierlo contro un
                // bersaglio Bersagliato era la regola N4.
                //   "The user must apply a -6 MOD to BS ... and also any Range
                //    MODs. Other negative MODs ... are not applied."
                //   (REGOLE_N5_v5_1_1.txt, riga 3920)
                // E il Bersagliato da` +3 a "any Trooper declaring a BS Attack"
                // (riga 14646): lo Speculativo ha l'etichetta BS Attack, e il +3
                // e` un MOD POSITIVO — il divieto riguarda solo i negativi.
                // Il +3 NON si aggiunge qui: lo da` gia` il ramo generale dello
                // Stato Bersagliato a tutti gli attacchi BS. Aggiungerlo anche
                // qui lo contava DUE volte — e il totale tornava giusto per
                // coincidenza, su un'arma senza banda +3.
                // L'unico difetto era il -6 tolto. Prima: 15 invece di 12.
                // (Segnalato dalla chat REGOLE, giro del 20 settembre.)
                aggiungi('speculativo', -6, 'Fuoco Speculativo: -6 fisso');
                note.push('Fuoco Speculativo: ignora i MOD NEGATIVI di Copertura, Mimetismo e Zone di Visibilità.');
            } else {
                // Copertura Parziale del bersaglio
                if (ctx.cover) {
                    // 🔴 No Cover e Limited Cover fanno cadere ENTRAMBE il -3.
                    // La differenza fra loro sta sulla SALVEZZA, non qui.
                    const cs = M.coperturaSkill(difensore);
                    if (tA.marksmanship) note.push('Marksmanship: il -3 di Copertura non si applica.');
                    else if (cs && cs.cadeMODTiro) note.push(`${cs.skill}: il -3 di Copertura non si applica.`);
                    else if (String(ctx.copertura || '').toUpperCase() === 'VITROFERRO') {
                        // Vitroferro (righe 10682-10684): chi ne reclama Copertura
                        // NON infligge il -3 all'attaccante.
                        note.push('Copertura da Deployable Cover (Vitroferro): nessun -3 all\'attaccante.');
                    }
                    else aggiungi('copertura', -3, 'Bersaglio in Copertura Parziale: -3');
                }
                // 🔴 ALBEDO: la regola era a catalogo ma il motore non la
                // applicava. Colpisce SOLO chi ha un Multispectral Visor o
                // Marksmanship — cioe` proprio chi il Mimetismo lo ignora.
                const alb = M.valoreAlbedo(difensore);
                if (alb < 0 && (tA.msv1 || tA.marksmanship)) {
                    aggiungi('albedo', alb, `Albedo del bersaglio: ${alb} a chi ha Multispectral Visor o Marksmanship`);
                } else if (alb < 0) {
                    note.push(`Albedo (${alb}) del bersaglio: non si applica, l'attaccante non ha Multispectral Visor né Marksmanship.`);
                }

                // Mimetismo, ridotto o annullato dai Multispectral Visor
                const mim = M.valoreMimetismo(difensore);
                if (mim < 0) {
                    if (tA.msv2) note.push(`Multispectral Visor L2+: il Mimetismo (${mim}) non si applica.`);
                    else if (tA.msv1) {
                        const r = Math.min(0, mim + 3);
                        if (r < 0) aggiungi('mimetismo', r, `Mimetismo ${mim}, ridotto a ${r} dal Multispectral Visor L1`);
                        else note.push(`Multispectral Visor L1 annulla il Mimetismo (${mim}).`);
                    } else aggiungi('mimetismo', mim, `Mimetismo del bersaglio: ${mim}`);
                }
            }

            // Terreno e Zone di Visibilità
            const terr = ctx.terrain || 'NESSUNO';
            if (terr && terr !== 'NESSUNO' && typeof G.applicaModTerreno === 'function') {
                // hasMSV3 e` il QUINTO parametro e non lo passavo. NON era un
                // bug: applicaModTerreno lo usa solo per la riga
                // `if (hasMSV3) hasMSV2 = true`, e M.trattiTiro gia` calcola
                // msv2 come `msv3 || ...`, quindi per un'unita` L3 arrivava
                // comunque hasMSV2 = true. Verificato su tutti e 18 i terreni:
                // nessuna differenza.
                // Lo si passa lo stesso, perche` la doppia implicazione e`
                // fragile: se un domani applicaModTerreno usasse hasMSV3 per
                // qualcosa che l'L2 non fa, il difetto comparirebbe in
                // silenzio. Passare la firma completa costa nulla.
                // Sesto argomento: `bersaglio`. Vero quando chi tira e` il
                // bersaglio che risponde all'attaccante (lo passa modReazione).
                // (Chat REGOLE + DATABASE, 21 settembre.)
                // Forma a OGGETTO (database_comune.js 2026-09-21.3): il verso
                // sta scritto nella chiamata. Con sei booleani posizionali
                // un'inversione bersaglio / msv3 cambiava il risultato — -6
                // contro LoF bloccata — senza che nessun controllo lo vedesse.
                const e = G.applicaModTerreno(terr, {
                    msv1: tA.msv1, msv2: tA.msv2, msv3: tA.msv3,
                    marksmanship: tA.marksmanship,
                    bersaglio: !!ctx.bersaglioDellAttacco
                });
                if (e.modB < 0) { burstMod += e.modB; note.push(`Zona di Saturazione: ${e.modB} al Burst.`); }
                if (azione !== M.AZIONI.SPECULATIVO) {
                    if (e.modBS) aggiungi('terreno', e.modBS, e.note || `Terreno ${terr}: ${e.modBS}`);
                    if (e.lofBloccata) {
                        return { valore: null, lofBloccata: true, base: base, mod: mod, attributo: nomeAttr,
                                 voci, burstMod,
                                 note: note.concat(['Nessuna Linea di Tiro: Zona di Visibilità o Rumore Bianco. L\'attacco non è dichiarabile.']),
                                 avvisi };
                    }
                } else if (e.note) note.push(e.note);
            }

            // Sparare dentro una mischia
            if (ctx.inMischia || (ctx.reazione && String(ctx.reazione.azione).toUpperCase() === 'CC_ATTACK')) {
                aggiungi('mischia', -6, 'Tiro dentro una mischia: -6');
            }
        }

        // --- comuni a tutti i tipi di attacco ---
        if (statoD.targeted && azione !== M.AZIONI.GUIDATO && !inCC) {
            aggiungi('bersagliato', 3, `Bersaglio in Stato Bersagliato: +3 ${nomeAttr}`);
        }
        if (statoD.suppressive) {
            // Il regolamento limita il -3 al raggio 0-24".
            // Con la griglia uniforme da 8" del Weapon Chart, le 24" sono
            // SEMPRE un confine fra bande (0-8, 8-16, 16-24, 24-32...), mai
            // un punto interno: quindi la banda scelta basta a decidere,
            // senza bisogno della distanza esatta.
            let d = parseFloat(ctx.distanzaPollici);
            if (!isFinite(d) && typeof ctx.rangeIndex === 'number' && arma && arma.bands && arma.bands[ctx.rangeIndex]) {
                const b = arma.bands[ctx.rangeIndex];
                if (b.a <= 24) d = b.a;             // banda interamente entro le 24"
                else if (b.da >= 24) d = b.da + 1;  // banda interamente oltre
            }
            if (!isFinite(d)) {
                aggiungi('soppressione', -3, 'Bersaglio in Fuoco di Soppressione: -3');
                note.push('Il -3 della Soppressione vale entro 0-24": distanza e banda non indicate, applicato comunque.');
            } else if (d <= 24) {
                aggiungi('soppressione', -3, `Bersaglio in Fuoco di Soppressione a ${d}": -3`);
            } else {
                note.push(`Bersaglio in Fuoco di Soppressione ma a ${d}": oltre le 24", il -3 non si applica.`);
            }
        }
        if (statoA.stordito || (attaccante && attaccante.states && attaccante.states.stunned)) {
            aggiungi('stordito', -3, 'Attaccante Stordito: -3');
        }

        // --- clamp ±12 ---
        const MEC = meccaniche();
        if (mod > MEC.MOD_MAX) { voci.push({ fonte: 'limite', valore: MEC.MOD_MAX - mod, motivo: `MOD massimo ${MEC.MOD_MAX}` }); mod = MEC.MOD_MAX; }
        if (mod < MEC.MOD_MIN) { voci.push({ fonte: 'limite', valore: MEC.MOD_MIN - mod, motivo: `MOD minimo ${MEC.MOD_MIN}` }); mod = MEC.MOD_MIN; }

        // 🔴 NIENTE clamp a 1 sul tiro d'attacco. Un Valore di Successo pari
        // o inferiore a zero significa fallimento automatico, non "5% di
        // probabilita`": portarlo a 1 regalerebbe un tiro che il regolamento
        // non concede. Il minimo di 1 vale sul Tiro Salvezza, non qui.
        const valore = base + mod;
        const impossibile = (valore < 1);
        if (impossibile) note.push(`Valore di Successo ${valore}: il tiro fallisce automaticamente, non c'è nulla da tirare.`);

        return { valore, base, mod, attributo: nomeAttr, impossibile,
                 critici: M.critici(valore), voci, note, avvisi, burstMod };
    };


    // ==================================================================
    // PARTE 21: IL TIRO DEL REATTIVO
    // ------------------------------------------------------------------
    // Sostituisce le righe 358-414 dell'Hub. Riusa i pezzi gia` scritti —
    // modAttacco, modSchivata, modReset, modCC, modHacking — e aggiunge
    // le tre cose che nel motore non c'erano ancora:
    //   Sesto Senso, Total Reaction / Neurocinetica, Attacco a Sorpresa.
    // ==================================================================

    // Il Burst in reazione: 1, salvo Soppressione (gia` gestita in burstARO),
    // Total Reaction e Neurocinetica.
    M.burstReattivo = function (difensore, arma, ctx) {
        ctx = ctx || {};
        const base = M.burstARO(difensore, arma);
        const t = M.trattiTiro(difensore);
        // 🔴 TOTAL REACTION e NEUROCINETICS danno il Burst PIENO dell'arma in
        // ARO, non un 3 fisso: "the user may use the full Burst (B) of their
        // weapon. Any MOD to B will also apply" (righe 10221-10228; wiki
        // "Total Reaction" N5.3). Il catalogo lo diceva gia` (burstPienoInARO)
        // ma nessuno lo leggeva: una HMG (B4) usciva B3.
        // I MOD al Burst — la Saturazione — si applicano dopo, in
        // risolviScontro, sul burstMod del reattivo. Tetto: BURST_MAX.
        // Neurocinetics: pieno SOLO contro un bersaglio.
        // (Chat REGOLE, 21 settembre.)
        if ((t.totalReaction || t.neurocinetica) && arma && !arma.isCC) {
            const MAXB = meccaniche().BURST_MAX;
            const note = (base.note || []).slice();
            // 🔴 Un CONTENITORE con modalita` (MULTI Sniper Rifle) non ha Burst
            // proprio: e` sulle modalita`. Preso dal contenitore veniva null ->
            // 1, e il Sin-Eater usciva B1 in ARO. Regola di lettura di
            // DATABASE: mai leggere sul contenitore. Se arriva il contenitore
            // si prende il Burst della prima modalita`. (Chat TEST, 23 sett.)
            let burstArma = parseInt(arma.burst, 10);
            const voceW = (G.RULES_WEAPONS || {})[arma.nome] || {};
            if (!isFinite(burstArma) && Array.isArray(voceW.modalita) && voceW.modalita.length) {
                const m0 = M.profiloArma(voceW.modalita[0]);
                burstArma = parseInt(m0.burst, 10);
                note.push(`${arma.nome}: Burst letto dalla modalita ${m0.nome}.`);
            }
            const pieno = Math.min(MAXB, isFinite(burstArma) ? burstArma : 1);
            // Il Math.max e` sicuro anche in Soppressione: in quello stato
            // l'ARO passa dal profilo SF Mode (M.profiloSF), che porta gia`
            // burst 3 e le gittate SF. Il "Burst pieno" del Total Reaction in
            // SF Mode e` quindi il B3 del profilo, non il B dell'arma: la
            // combinazione "B4 con gittate SF" non puo` nascere. (Chat REGOLE.)
            const valore = Math.max(pieno, base.valore);
            const voci = (base.voci || []).concat([{ fonte: 'tratto', valore: valore - base.valore,
                motivo: (t.totalReaction ? 'Total Reaction' : 'Neurocinetics') + `: Burst pieno dell'arma in ARO (B${valore})` }]);
            // La notazione (+NB) del profilo NON vale in ARO, nemmeno col Total
            // Reaction: righe 6646-6648, il MOD vale in Turno Attivo e "They may
            // not ... apply this MOD during their Reactive Turn if they declare a
            // BS Attack ARO". Il "any MOD to B" del Total Reaction riguarda i MOD
            // validi in reattivo (es. Saturazione -1). Chat REGOLE, 23 settembre.
            return { valore: valore, voci: voci, note: note,
                     unSoloBersaglio: t.neurocinetica ? true : base.unSoloBersaglio };
        }
        return base;
    };

    // ctx: {
    //   attacco: { azione, arma, attaccante },
    //   rangeIndex | rangeMod, terrain, cover, hasLoF,
    //   membriFireteam, attaccoASorpresa
    // }
    // 🔴 L'id di una REAZIONE in forma unica: quella di M.AZIONI_ARO. Il
    // motore smista le reazioni confrontando con 'DODGE' e 'CC_ATTACK', e
    // tutto il resto finiva nel ramo BS: "SCHIVATA" diventava un attacco BS,
    // "ATTACCO CC" pure. azioneCanonica da sola non basta: restituisce le
    // forme del menu (DODGE -> 'SCHIVATA'). Trovato dal test di equivalenza
    // della chat TEST: etichetta e id devono dare lo stesso scontro.
    M.idAro = function (x) {
        const c = M.azioneCanonica(x) || String(x || '').toUpperCase();
        const mappa = { 'SCHIVATA': 'DODGE', 'ATTACCO BS': 'BS_ATTACK', 'CC_ATTACK': 'CC_ATTACK',
                        'RESET': 'RESET', 'HACKING': 'HACKING' };
        return mappa[c] || String(x || '').toUpperCase();
    };

    M.modReazione = function (difensore, reazione, ctx) {
        ctx = ctx || {};
        reazione = reazione || {};
        if (reazione.azione) reazione = Object.assign({}, reazione, { azione: M.idAro(reazione.azione) });
        const attacco = ctx.attacco || {};
        const attaccante = attacco.attaccante || {};
        const t = M.trattiTiro(difensore);
        const azReaz = String(reazione.azione || '').toUpperCase();

        let esito;

        if (azReaz === 'DODGE') {
            // Il Sesto Senso e le Sagome tolgono il -3 della Schivata senza LoF.
            const tplAtt = attacco.arma ? M.regoleTemplate(attacco.arma) : null;
            // 🔴 Contro un Boost la Schivata e` a PH PIENO: il deployable
            // arriva a contatto, quindi il -3 per assenza di LoF non c'entra.
            const modoB = attacco.arma && attacco.arma.modoRisoluzione;
            const controBoost = !!(modoB && modoB.difesa === 'SCHIVATA_NORMALE');
            const esente = t.sestoSenso || !!tplAtt || controBoost;
            esito = M.modSchivata(difensore, {
                haLoFVersoAttaccante: esente ? true : ctx.hasLoF,
                controSagoma: !!tplAtt,
                membriFireteam: ctx.membriFireteam
            });
            if (esente && ctx.hasLoF === false) {
                esito.note.push(t.sestoSenso
                    ? 'Sesto Senso: nessun -3 alla Schivata senza LoF.'
                    : controBoost
                        ? 'Il deployable arriva a contatto: la Schivata è a PH pieno, la LoF non c\'entra.'
                        : 'Contro una Sagoma la Schivata non subisce il -3 per mancanza di LoF.');
            }
            if (controBoost) {
                // "Se la Schivata riesce, l'attacco e` evitato del tutto" sta
                // gia` nelle note del confronto: ripeterla qui la faceva
                // comparire due volte nella stessa schermata.
                const B = (catalogo('REGOLE_DEPLOYABLE') || {}).boost || {};
                if (B.rimozione) esito.note.push(B.rimozione);
            }
        } else if (azReaz === 'RESET') {
            esito = M.modReset(difensore, {});
        } else if (azReaz === 'HACKING') {
            esito = M.modHacking(difensore, attaccante,
                reazione.arma || (difensore ? M.armaDaProgrammaDi(difensore, reazione.programma) : M.armaDaProgramma(reazione.programma)), {
                    firewallNemico: M.valoreFirewall(attaccante),
                    membriFireteam: ctx.membriFireteam
                });
        } else if (azReaz === 'CC_ATTACK') {
            esito = M.modCC(difensore, attaccante, reazione.arma, { inF2F: true });
        } else {
            // BS_ATTACK e ogni altro tiro a distanza: stesse regole del turno
            // attivo, con i ruoli scambiati.
            // 🔴 La regola della Zona Zero vale solo per "Any Trooper who is the
            // target of a BS Attack" (wiki "Visibility Conditions"). Prima il
            // `true` scattava per OGNI reazione a distanza: un reattivo che
            // spara a chi si MUOVE dietro la zona, o a chi lo HACKERA, riceveva
            // il -6 con LoF invece di non avere LoF. Serve: (1) un'azione con
            // etichetta BS Attack (F05: Intuitivo, Speculativo, Forward
            // Observer, Guidato, Triangulated), (2) diretta a QUESTO reattivo.
            // (Chat REGOLE, 21 settembre.)
            const ETICH_BS = [M.AZIONI.BS_ATTACK, M.AZIONI.INTUITIVO, M.AZIONI.SPECULATIVO,
                              M.AZIONI.FORWARD_OBSERVER, M.AZIONI.GUIDATO, M.AZIONI.TRIANGULATED];
            const azAtt = String(attacco.azione || '');
            const eEtichettaBS = ETICH_BS.indexOf(M.azioneCanonica(azAtt) || azAtt) >= 0;
            const bers = attacco.bersaglio;
            const eQuesto = !bers || bers === difensore ||
                (bers.id != null && bers.id === difensore.id) ||
                (bers.alias && bers.alias === difensore.alias);
            const eBersaglioDiBS = eEtichettaBS && eQuesto;
            const presuntoBersaglio = eEtichettaBS && !bers;
            esito = M.modAttacco(difensore, attaccante, reazione.arma, M.AZIONI.BS_ATTACK, {
                rangeIndex: ctx.rangeIndex, rangeMod: ctx.rangeMod,
                cover: ctx.cover, terrain: ctx.terrain,
                // Chi risponde con un BS Attack all'attaccante che lo ha preso
                // di mira e` il BERSAGLIO: Zona Zero a -6 con LoF (wiki
                // "Visibility Conditions"), Rumore Bianco -6 se ha MSV o
                // Marksmanship. Senza questo la Zona Zero gli toglieva la LoF.
                bersaglioDellAttacco: eBersaglioDiBS,
                membriFireteam: ctx.membriFireteam,
                distanzaPollici: ctx.distanzaPollici
            });

            if (presuntoBersaglio) {
                (esito.note = esito.note || []).push('Bersaglio dell\'attacco non indicato: presunto questo reattivo per la Zona Zero.');
            }

            // 🔴 F17 (wiki "Multispectral Visor", FAQ 0.0.0): chi ha MSV L1 E
            // Sesto Senso, bersaglio di un BS Attack attraverso una Zona di
            // Visibilita` Zero, ignora il -6 del tracciare LoF attraverso quella
            // zona — il -6 che l'MSV L1 normalmente impone. (Chat REGOLE.)
            (function () {
                const tF = M.trattiTiro(difensore);
                const bersaglioDiBS = ctx.attacco && String(ctx.attacco.azione) === M.AZIONI.BS_ATTACK;
                // 🔴 Il SESTO SENSO basta DA SOLO (wiki "Sixth Sense"): chi e`
                // bersaglio di un BS Attack attraverso una Zona Zero "ignores
                // the -6 MOD from the resulting Poor Visibility Zone". F17
                // aggiunge solo il caso con MSV L1. Prima si richiedeva l'MSV L1.
                if (!(tF.sestoSenso && bersaglioDiBS)) return;
                const i6 = (esito.voci || []).findIndex(function (v) { return v.fonte === 'terreno' && v.valore === -6; });
                if (i6 < 0) return;
                // Anche nel Rumore Bianco il -6 cade: lettura della chat REGOLE,
                // wiki Visibility Conditions + FAQ F17 — non una riga del testo.
                // Il Rumore Bianco "acts as a Zero Visibility Zone" per chi ha MSV
                // o Marksmanship, e il divieto di riduzione e` scritto solo per
                // l'MSV; il Sesto Senso ha clausola propria, applicata al caso
                // gemello dalla F17. (23 settembre.)
                esito.voci.splice(i6, 1);
                esito.valore += 6; esito.mod = (esito.mod || 0) + 6;
                (esito.note = esito.note || []).push((tF.msv1 ? 'F17: MSV L1 e ' : '') + 'Sesto Senso: ignorato il -6 della Zona di Visibilita` Zero.');
            })();

            // 🔴 Il Sesto Senso annulla il Mimetismo dell'attaccante. Nel
            // turno attivo questo caso non esiste, quindi va tolto qui.
            if (t.sestoSenso) {
                const mim = esito.voci.filter(v => v.fonte === 'mimetismo');
                if (mim.length > 0) {
                    const tolto = mim.reduce((a, v) => a + v.valore, 0);
                    esito.voci = esito.voci.filter(v => v.fonte !== 'mimetismo');
                    esito.mod -= tolto;
                    esito.valore -= tolto;
                    esito.note.push(`Sesto Senso: il Mimetismo dell'attaccante (${tolto}) non si applica.`);
                }
            }
        }

        // --- Attacco a Sorpresa: -3, annullato dal Sesto Senso ---
        // 🔴 Surprise Attack NON si applica sempre. La skill da` il -3 solo
        // attaccando da uno stato che nasconde la truppa: CAMO,
        // Nascosto, Impersonation. Prima bastava avere la skill, e ogni
        // attacco di Zero, Intruder, Spektr o Croc Man lo portava anche
        // allo scoperto.
        // 🔴 Per il Surprise Attack lo stato deve essere DICHIARATO, non
        // ereditato dal profilo. 49 profili portano state:'CAMO' come
        // predefinito di schieramento: fidarsi di statoBersaglio faceva
        // applicare il -3 anche a un Intruder scoperto da tre turni.
        const sA = (attaccante && attaccante.states) || {};
        const nascosto = !!(sA.camo || sA.impersonation || sA.hidden ||
                            sA.holoecho || sA.holomask);
        const haSorpresa = M.trattiTiro(attaccante).attaccoSorpresa;
        if (haSorpresa && !nascosto && !ctx.attaccoASorpresa) {
            esito.note.push('Surprise Attack: non si applica, l\'attaccante non è in uno stato che lo nasconde.');
        }
        // 🔴 COMBAT INSTINCT: "The user ignores Surprise Attack MODs from
        // attackers." Uno Squalo Mk-II prendeva il -3 come un Fusiliere.
        const tR = M.trattiTiro(difensore);
        const combatInstinct = skillsDi(difensore).indexOf('COMBAT INSTINCT') >= 0;
        // 🔴 NATURAL BORN WARRIOR che dichiara CC Attack: ignora TUTTI i MOD
        // negativi dell'avversario nel Faccia a Faccia di CC, e l'esempio del
        // regolamento nomina per primo proprio "Surprise Attack (-3)"
        // (REGOLE_N5_v5_1_1.txt righe 9270-9282). Il motore lo applicava lo
        // stesso: trovato verificando il punto PARA della chat REGOLE.
        const azR = M.azioneCanonica(reazione && reazione.azione) || String((reazione && reazione.azione) || '').toUpperCase();
        const nbwInCC = M.haNBW(difensore) && azR === M.AZIONI.CC_ATTACK;
        // 🔴 MULTISPECTRAL VISOR L3 (wiki "Multispectral Visor"): ignora i MOD
        // di Surprise Attack se ha LoF verso l'attaccante, e SEMPRE quelli da
        // CC Attack, anche senza LoF. Il blocco controllava Combat Instinct,
        // NBW e Sesto Senso, non l'MSV L3. (Chat REGOLE, 21 settembre.)
        const attaccoCCmsv = String((ctx.attacco && ctx.attacco.azione) || '').toUpperCase() === M.AZIONI.CC_ATTACK;
        const conLoFmsv = !(reazione && reazione.hasLoF === false) && ctx.hasLoF !== false;
        const msv3Ignora = M.haMSV3(difensore) && (attaccoCCmsv || conLoFmsv);
        // 🔴 BIOMETRIC VISOR (wiki "Surprise Attack", See also): ignora la
        // Sorpresa di attaccanti in Impersonation o Holoecho se ha LoF, e
        // SEMPRE contro i loro CC Attack. Stessa forma dell'MSV L3.
        const sAtt = M.statoBersaglio(attaccante);
        const haBio = /BIOMETRIC VISOR/i.test(skillsDi(difensore));
        const bioIgnora = haBio && (sAtt.imp || sAtt.holoecho) && (attaccoCCmsv || conLoFmsv);
        // 🔴 N5.2 (decisione di Paolo: vale la wiki): la Sorpresa vale SOLO
        // sui tiri FACCIA A FACCIA dei bersagli in ARO. La 5.1.1 diceva "any
        // Skill Roll" (riga 10137). Un Reset contro un BS Attack e` un Tiro
        // Normale: niente -3.
        let eF2Fsorp = true;
        if (ctx.attacco && reazione) {
            const cS = M.tipoConfronto(
                { azione: ctx.attacco.azione, arma: ctx.attacco.arma, attaccante: attaccante, burst: 1 },
                // Se la reazione non dice il bersaglio — l'anteprima ARO spesso
                // non lo passa — una reazione a un attacco e` diretta
                // all'attaccante. Senza questo, la Sorpresa spariva anche su un
                // BS contro BS, perche` il classificatore la leggeva "altrove".
                { azione: reazione.azione, arma: reazione.arma,
                  bersaglio: reazione.bersaglio || (attaccante && (attaccante.alias || attaccante.nome)), burst: 1 }, {});
            eF2Fsorp = cS && cS.tipo === M.CONFRONTO.F2F;
            // Nel Coordinato un reattivo puo` mirare a un attivo DIVERSO da
            // quello dello scontro: la presunzione va dichiarata, non taciuta.
            if (!reazione.bersaglio) {
                esito.note.push('Bersaglio della reazione non indicato: presunto l\'attaccante di questo scontro. Nel Coordinato potrebbe essere un altro.');
            }
        }
        if (combatInstinct && (ctx.attaccoASorpresa || (haSorpresa && nascosto))) {
            esito.note.push('Combat Instinct: ignora i MOD di Attacco a Sorpresa.');
        } else if (nbwInCC && (ctx.attaccoASorpresa || (haSorpresa && nascosto))) {
            esito.note.push('Natural Born Warrior: nel Faccia a Faccia di CC ignora il -3 dell\'Attacco a Sorpresa.');
        } else if (!eF2Fsorp && (ctx.attaccoASorpresa || (haSorpresa && nascosto))) {
            esito.note.push('Attacco a Sorpresa: non si applica, non e` un Faccia a Faccia (N5.2).');
        } else if (bioIgnora && (ctx.attaccoASorpresa || (haSorpresa && nascosto))) {
            esito.note.push('Biometric Visor: ignora la Sorpresa di chi e` in Impersonation o Holoecho.');
        } else if (msv3Ignora && (ctx.attaccoASorpresa || (haSorpresa && nascosto))) {
            esito.note.push(attaccoCCmsv
                ? 'Multispectral Visor L3: contro un CC Attack ignora sempre la Sorpresa, anche senza LoF.'
                : 'Multispectral Visor L3: con LoF verso l\'attaccante ignora la Sorpresa.');
        } else if (ctx.attaccoASorpresa || (haSorpresa && nascosto)) {
            // 🔴 Il Sesto Senso toglie i MOD negativi solo "if the user declares
            // Dodge or Reset" (riga 9941). Il testo della Sorpresa non ha
            // eccezioni per il Sesto Senso: annullarla su OGNI ARO era la regola
            // N4. Tocca anche i Fireteam di Livello 5, che danno Sixth Sense.
            // (Chat REGOLE, 21 settembre.)
            // azioneCanonica('DODGE') restituisce 'SCHIVATA': controllare solo
            // 'DODGE' faceva fallire il test su ogni Schivata vera.
            const schivaOResetta = ['DODGE', 'SCHIVATA', 'RESET'].indexOf(azR) >= 0;
            if (t.sestoSenso && schivaOResetta) {
                esito.note.push('Sesto Senso: su Schivata o Reset annulla il MOD dell\'Attacco a Sorpresa.');
            } else {
                // Il valore sta nel profilo: "Surprise Attack (-3)", "(-6)", o
                // "(CC-6)" che vale solo sul Corpo a Corpo. Prima era fisso -3:
                // giusto per tutti i 59 profili di oggi, sbagliato al primo diverso.
                const mS = /SURPRISE ATTACK\s*\(\s*(CC\s*)?(-\d+)\s*\)/i.exec(skillsDi(attaccante));
                const soloCC = !!(mS && mS[1]);
                const inCCs = String((ctx.attacco && ctx.attacco.azione) || '').toUpperCase() === M.AZIONI.CC_ATTACK
                              || azR === M.AZIONI.CC_ATTACK;
                const vS = mS ? parseInt(mS[2], 10) : -3;
                if (soloCC && !inCCs) {
                    esito.note.push(`Surprise Attack (CC${vS}): vale solo nel Corpo a Corpo.`);
                } else {
                    esito.mod = (esito.mod || 0) + vS;
                    esito.valore += vS;
                    esito.voci.push({ fonte: 'sorpresa', valore: vS, motivo: `Attacco a Sorpresa: ${vS}` });
                }
            }
        }

        // --- Stordito ---
        // modAttacco lo applica gia` sull'attaccante del tiro, che qui e` il
        // reattivo: sulla via BS_ATTACK va NON riapplicato, o si conta doppio.
        const st = M.statoBersaglio(difensore);
        const giaApplicato = esito.voci.some(v => v.fonte === 'stordito');
        if (!giaApplicato && (st.stordito || (difensore && difensore.states && difensore.states.stunned))) {
            esito.mod = (esito.mod || 0) - 3;
            esito.valore -= 3;
            esito.voci.push({ fonte: 'stordito', valore: -3, motivo: 'Reattivo Stordito: -3' });
        }

        if (t.sestoSenso) esito.note.push('Sesto Senso attivo.');

        const burst = M.burstReattivo(difensore, reazione.arma, ctx);
        esito.burst = burst.valore;
        esito.vociBurst = burst.voci;
        esito.impossibile = (esito.valore < 1);
        return esito;
    };


    // ==================================================================
    // PARTE 22: ORCHESTRATORE
    // ------------------------------------------------------------------
    // L'ultimo pezzo: mette insieme tipoConfronto, modAttacco, modReazione
    // e tiroSalvezza in uno scontro completo. Sostituisce le 358 righe di
    // generaRisoluzioneDaDati.
    //
    // Restituisce DATI. La forma richiama quella dell'Hub — titolo, attivo,
    // reattivo — così l'interfaccia esistente puo` leggerla, ma al posto
    // dell'HTML precotto ci sono le voci, e ogni numero si puo` risalire.
    // ==================================================================

    // attacco:  { attaccante, azione, arma, bersaglio, burst, ammo, cover,
    //             rangeIndex, terrain, programma }
    // reazione: { difensore, azione, arma, bersaglio, rangeIndex, cover,
    //             terrain, hasLoF, programma }  oppure null
    // ctx:      { membriFireteamAtt, membriFireteamDif, distanzaPollici,
    //             attaccoASorpresa, inMischia }
    M.risolviScontro = function (attacco, reazione, ctx) {
        // Stessa forma per la reazione in TUTTO lo scontro: tipoConfronto,
        // burstReattivo e modReazione leggono l'azione. (Test di equivalenza.)
        // 🔴 Si riassegna il PARAMETRO. La prima versione riscriveva
        // `arguments[1]`, che con parametri nominati non aggiorna `reazione`:
        // sembrava fatto e non faceva niente — l'etichetta 'ATTACCO BS'
        // arrivava a tipoConfronto grezza, che non la riconosceva e toglieva
        // la gittata al reattivo (12 invece di 15). (Test di equivalenza.)
        if (reazione && reazione.azione) {
            reazione = Object.assign({}, reazione, { azione: M.idAro(reazione.azione) });
        }
        ctx = ctx || {};
        attacco = attacco || {};
        const avvisi = [];

        const attaccante = attacco.attaccante || {};
        const difensore = (reazione && reazione.difensore) || attacco.bersaglio || {};
        const azione = attacco.azione;
        // 🔴 L'arma puo` arrivare come NOME: l'app spedisce cfg.arma, che e` la
        // stringa scelta. modAttacco la risolveva da se` (tiro giusto), il
        // Tiro Salvezza no: con "Combi Rifle" salvava a VS 1 con PS null.
        // Numero plausibile, schermata sana — la specie peggiore. Si risolve
        // qui una volta, per tutti i percorsi. (Chat TEST, 23 settembre.)
        const risolvi = function (a) { return (typeof a === 'string') ? M.profiloArma(a) : (a || null); };
        const arma = risolvi(attacco.arma);
        if (reazione && typeof reazione.arma === 'string') reazione = Object.assign({}, reazione, { arma: risolvi(reazione.arma) });

        // --- 1. il tiro dell'attivo ---
        const att = M.modAttacco(attaccante, difensore, arma, azione, {
            rangeIndex: attacco.rangeIndex,
            rangeMod: attacco.rangeMod,
            cover: attacco.cover,
            copertura: attacco.copertura,
            terrain: attacco.terrain,
            livelloFireteam: ctx.livelloFireteamAtt, membriFireteam: ctx.membriFireteamAtt,
            distanzaPollici: ctx.distanzaPollici,
            inMischia: ctx.inMischia,
            reazione: reazione
        });
        att.avvisi.forEach(a => avvisi.push(a));

        let burstAtt = (attacco.burst != null) ? attacco.burst : ((arma && arma.burst) || 1);
        // 🔴 La Saturazione "cannot be reduced below 1" (wiki "Saturation").
        // Il pavimento era 0: un'arma a B1 attraverso la zona faceva 0 colpi.
        // burstMod ha oggi un solo contributore, la Saturazione.
        if (att.burstMod && burstAtt > 0) burstAtt = Math.max(1, burstAtt + att.burstMod);

        // --- 2. il tiro del reattivo ---
        let reaz = null;
        let burstDif = 0;
        if (reazione && reazione.azione && reazione.azione !== M.AZIONI_ARO.NESSUNO) {
            reaz = M.modReazione(difensore, reazione, {
                // `bersaglio`: in questo scontro l'attacco colpisce il difensore.
                // Serve a modReazione per sapere se il reattivo E` il bersaglio.
                attacco: { azione: azione, arma: arma, attaccante: attaccante, bersaglio: difensore },
                rangeIndex: reazione.rangeIndex,
                rangeMod: reazione.rangeMod,
                cover: reazione.cover,
                terrain: reazione.terrain,
                hasLoF: reazione.hasLoF,
                livelloFireteam: ctx.livelloFireteamDif, membriFireteam: ctx.membriFireteamDif,
                distanzaPollici: ctx.distanzaPollici,
                attaccoASorpresa: ctx.attaccoASorpresa
            });
            reaz.avvisi.forEach(a => avvisi.push(a));
            burstDif = reaz.burst;
            // 🔴 La Saturazione vale per OGNI BS Attack da, verso o attraverso
            // la zona — anche quello del reattivo. modReazione calcolava gia` il
            // suo burstMod, e qui veniva buttato via. Mai sotto 1.
            if (reaz.burstMod && burstDif > 0) burstDif = Math.max(1, burstDif + reaz.burstMod);
        }

        // --- 3. il tipo di confronto ---
        const conf = M.tipoConfronto(
            { azione: azione, arma: arma, attaccante: attaccante, burst: burstAtt, ammo: attacco.ammo || (arma && arma.ammo) },
            reazione ? { azione: reazione.azione, arma: reazione.arma, bersaglio: reazione.bersaglio, burst: burstDif, ammo: reazione.ammo } : null,
            {
                attaccanteHaMSV: M.trattiTiro(attaccante).msv1,
                difensoreHaMSV: M.trattiTiro(difensore).msv1
            }
        );

        // --- 3b. MOD di profilo che colpiscono il Faccia a Faccia AVVERSARIO ---
        // 🔴 "PARA CC Weapon (-3)": il (-3) NON e` un MOD al Tiro Salvezza —
        // la salvezza PARA e` SEMPRE PH-6 (REGOLE_N5_v5_1_1.txt righe
        // 5715-5718). E` un MOD al tiro dell'AVVERSARIO nel Faccia a Faccia,
        // come i "CC Attack (-3)" (riga 1938: si applicano solo nei F2F).
        // La chat DATABASE lo ha dichiarato col campo modProfiloSu; il motore
        // non lo leggeva, e con la salvezza corretta il (-3) era sparito del
        // tutto. (Chat DATABASE, database_comune.js 2026-09-20.3.)
        (function applicaModProfiloF2F() {
            if (!conf || conf.tipo !== M.CONFRONTO.F2F) return;
            function applica(armaDi, lato, chi, azioneDichiarata) {
                if (!lato || typeof lato.valore !== 'number') return;
                // gia` applicato da modCC con ctx.armaAvversario: non contarlo due volte
                if ((lato.voci || []).some(function (v) { return v.fonte === 'profilo-avversario'; })) return;
                const azC = M.azioneCanonica(azioneDichiarata) || String(azioneDichiarata || '').toUpperCase();
                const pa = M.modProfiloAvversario(armaDi, chi, { dichiaraCC: azC === M.AZIONI.CC_ATTACK });
                if (pa.voce) {
                    lato.valore += pa.valore; lato.mod = (lato.mod || 0) + pa.valore;
                    (lato.voci = lato.voci || []).push(pa.voce);
                }
                if (pa.nota) (lato.note = lato.note || []).push(pa.nota);
            }
            applica(arma, reaz, difensore, reazione && reazione.azione);
            if (reazione) applica(reazione.arma, att, attaccante, azione);
        })();

        // --- 4. le salvezze, una per verso ---
        // Chi subisce il colpo dell'attivo:
        const salvDifensore = (burstAtt > 0)
            ? M.tiroSalvezza(difensore, {
                  arma: arma, ammo: attacco.ammo || (arma && arma.ammo),
                  cover: attacco.cover,
                  copertura: attacco.copertura,
                  ignoraCopertura: (azione === M.AZIONI.GUIDATO || azione === M.AZIONI.SPECULATIVO),
                  firewall: (azione === M.AZIONI.HACKING) ? M.valoreFirewall(difensore) : 0
              })
            : { offensivo: false, note: ['L\'attaccante non tira: nessun danno.'] };

        // Chi subisce il colpo del reattivo, se il reattivo attacca:
        // 🔴 L'elenco conteneva 'BS_ATTACK', ma l'Hub manda 'ATTACCO BS': il
        // confronto non trovava mai corrispondenza e il reattivo risultava
        // sempre innocuo. Un Fusilier che rispondeva col Combi non infliggeva
        // nessun Tiro Salvezza, e a schermo usciva "il reattivo non infligge
        // danno" accanto a un tiro a 15. Si normalizza, come altrove.
        const azReaz = reazione ? (M.azioneCanonica(reazione.azione) || String(reazione.azione).toUpperCase()) : '';
        const reazAttacca = !!reazione &&
            [M.AZIONI.BS_ATTACK, M.AZIONI.CC_ATTACK, M.AZIONI.HACKING,
             M.AZIONI.INTUITIVO, M.AZIONI.SPECULATIVO].indexOf(azReaz) >= 0;
        const salvAttaccante = (reazAttacca && burstDif > 0)
            ? M.tiroSalvezza(attaccante, {
                  arma: reazione.arma, ammo: reazione.ammo || (reazione.arma && reazione.arma.ammo),
                  // 🔴 La Copertura che il reattivo dichiara sul suo bersaglio —
                  // l'attaccante — e` UN fatto: -3 al tiro del reattivo E +3 alla
                  // salvezza dell'attaccante colpito. Qui si leggeva un campo a
                  // parte, coverAttaccante, che nessun file riempiva: il -3 c'era
                  // e il +3 mai. Si legge `cover`, con coverAttaccante che vince
                  // se qualcuno lo passa esplicito. (Trovato col pulsante ARO.)
                  cover: (reazione.coverAttaccante != null) ? reazione.coverAttaccante : reazione.cover,
                  firewall: (azReaz === M.AZIONI.HACKING) ? M.valoreFirewall(attaccante) : 0
              })
            : { offensivo: false, note: ['Il reattivo non infligge danno.'] };

        return {
            tipo: conf.tipo,
            titolo: conf.tipo === M.CONFRONTO.F2F ? 'TIRO FACCIA A FACCIA'
                  : conf.tipo === M.CONFRONTO.NESSUNO ? 'NESSUN TIRO' : 'TIRO NORMALE',
            motivoConfronto: conf.motivo,

            attivo: {
                nome: M.nomeUnita(attaccante),
                azione: att.automatico ? 'ATTACCO A SAGOMA' : azione,
                attributo: att.attributo,
                base: att.base,
                mod: att.automatico ? 'Auto' : att.valore,
                automatico: !!att.automatico,
                impossibile: !!att.impossibile,
                lofBloccata: !!att.lofBloccata,
                burst: burstAtt,
                voci: att.voci,
                note: att.note,
                // 🔴 Due cose diverse, e l'interfaccia mostrava la sbagliata.
                // `salvezzaInflitta` e` quella che questa unita` INFLIGGE
                // all'altra; `salvezzaSubita` quella che DEVE superare se
                // perde il confronto. Sotto la truppa attiva va la seconda.
                salvezzaInflitta: salvDifensore,
                salvezzaSubita: salvAttaccante
            },

            reattivo: reaz ? {
                nome: M.nomeUnita(difensore),
                azione: reazione.azione,
                attributo: reaz.attributo,
                base: reaz.base,
                mod: reaz.valore,
                impossibile: !!reaz.impossibile,
                burst: burstDif,
                voci: reaz.voci,
                note: reaz.note,
                salvezzaInflitta: salvAttaccante,
                salvezzaSubita: salvDifensore
            } : {
                nome: M.nomeUnita(difensore),
                azione: M.AZIONI_ARO.NESSUNO,
                mod: null, burst: 0, voci: [], note: ['Nessun ARO dichiarato.'],
                salvezzaInflitta: { offensivo: false, note: [] },
                salvezzaSubita: salvDifensore
            },

            note: conf.note,
            avvisi: avvisi
        };
    };

    // Risolve un intero payload: piu` attaccanti, piu` bersagli, le reazioni
    // associate per nome. È il rimpiazzo diretto di generaRisoluzioneDaDati.
    // ------------------------------------------------------------------
    // CONTRATTO di M.risolviPayload(payload, reazioni, ctx) -> [scontro]
    // I campi che LEGGE, coi nomi canonici. Dove sono ammessi piu` nomi,
    // il primo e` quello da scrivere; gli altri si accettano per compatibilita`.
    //
    //   payload    attacchi[]                 (anche vuoto: "io muovo, tu mi spari")
    //              attivo | unita             nome dell'attivo quando attacchi e` vuoto
    //   attacco    attaccante, attaccanteId, azione, bersagli[]
    //              arma                       profilo, oppure NOME (risolto qui)
    //   bersaglio  nome | alias | name        letto con M.nomeUnita
    //              id, burst, rangeIndex, rangeMod
    //              cover (bool), copertura ('VITROFERRO' | 'CUTTING_FOAM' | null)
    //              terrain
    //              ammo — FACOLTATIVO e solo eco: deve coincidere con una
    //                     munizione dell'arma (ammoOpzioni). Non sceglie niente:
    //                     la munizione la decide l'arma o la sua modalita`.
    //                     Incoerente: E56 in creaAttacco, A81 nel calcolo.
    //   reazione   nome | difensore           chi reagisce
    //              azione, arma (profilo o nome), bersaglio (nome), burst,
    //              rangeIndex, rangeMod, terrain, ammo, hasLoF
    //              cover (bool)               copertura del SUO bersaglio
    //              coverAttaccante            solo se diverso da cover
    //   ctx        trovaUnita(nome, id)       obbligatorio con nomi, non oggetti
    // ------------------------------------------------------------------
    M.risolviPayload = function (payload, reazioni, ctx) {
        ctx = ctx || {};
        const scontri = [];
        const attacchi = (payload && payload.attacchi) || [];
        reazioni = reazioni || [];
        const usate = [];   // reazioni gia` opposte a un attacco

        function trovaReazione(nomeDifensore) {
            return reazioni.find(r => M.nomeUnita(r.nome || r.difensore).toUpperCase() ===
                                      String(nomeDifensore).toUpperCase()) || null;
        }

        attacchi.forEach(function (att) {
            const spec = M.SPEC[att.azione] || {};
            const bersagli = att.bersagli || [];

            // Difese pure e Supporto: un solo tiro, nessun confronto.
            if (spec.bersagli === 'segnaposto' || spec.bersagli === 'nessuno' ||
                att.azione === M.AZIONI.SUPPORTO_WIP || att.azione === M.AZIONI.SUPPORTO_BS) {
                const u = ctx.trovaUnita ? ctx.trovaUnita(att.attaccante) : att.attaccante;
                const e = (att.azione === M.AZIONI.SCHIVATA) ? M.modSchivata(u, {})
                        : (att.azione === M.AZIONI.RESET) ? M.modReset(u, {})
                        : { valore: null, base: null, mod: 0, voci: [], note: [], attributo: spec.attributo };
                scontri.push({
                    tipo: M.CONFRONTO.NESSUNO, titolo: 'TIRO DI SUPPORTO / DIFESA',
                    attivo: { nome: M.nomeUnita(att.attaccante), azione: att.azione,
                              attributo: e.attributo, base: e.base, mod: e.valore, burst: 1,
                              voci: e.voci, note: e.note,
                              salvezzaInflitta: { offensivo: false, note: ['Tiro non offensivo.'] } },
                    reattivo: null, note: [], avvisi: []
                });
                return;
            }

            // `usate` e` a livello di funzione: serve anche fuori dal ciclo.
            bersagli.forEach(function (b) {
                if (!b.burst) return;   // bersaglio senza dadi assegnati
                // 🔴 Il nome del bersaglio si legge con M.nomeUnita, che accetta
                // nome, alias e name. L'app scrive `name` (app.html ~1100), il
                // motore e creaAttacco usano `nome`: leggendo solo b.name, un
                // payload costruito con `nome` perdeva l'accoppiamento, e un
                // FACCIA A FACCIA diventava due TIRI NORMALI — cambia chi vince.
                // Quinto caso di "un fatto, due campi". (Chat TEST, 23 sett.)
                const nomeB = M.nomeUnita(b);
                const dif = ctx.trovaUnita ? ctx.trovaUnita(nomeB, b.id) : b;
                const r = trovaReazione(nomeB || M.nomeUnita(dif));
                if (r) usate.push(r);
                scontri.push(M.risolviScontro({
                    attaccante: ctx.trovaUnita
                        ? ctx.trovaUnita(att.attaccante, att.attaccanteId)
                        : att.attaccante,
                    azione: att.azione, arma: att.arma, bersaglio: dif,
                    burst: b.burst, ammo: b.ammo, cover: b.cover,
                    // `copertura`: DA QUALE copertura ('VITROFERRO', 'CUTTING_FOAM').
                    // Viaggia col cover: senza questa riga l'interfaccia lo scriveva
                    // e nessuno lo leggeva — il caso "un fatto, un campo" al rovescio.
                    copertura: b.copertura,
                    rangeIndex: b.rangeIndex, rangeMod: b.rangeMod, terrain: b.terrain
                }, r ? Object.assign({ difensore: dif }, r) : null, ctx));
            });

        });

        // 🔴 I REATTIVI CHE NON SONO BERSAGLIO non producevano nulla.
        // E QUESTO BLOCCO STAVA DENTRO IL CICLO SUGLI ATTACCHI: con zero
        // attacchi — "io muovo, tu mi spari", il caso piu` comune della
        // partita — non girava mai, e l'Hub stampava "NESSUN TIRO DI DADO".
        // Ora sta fuori dal ciclo, e gira anche senza attacchi.
        // (Trovato da Paolo al tavolo; T-01 / A-06 della chat TEST.)
        // Il ciclo gira sui bersagli dell'attacco: chi reagisce senza
        // essere bersagliato — il secondo Fusilier di un fuoco incrociato,
        // o chi spara da un'altra parte del tavolo — spariva del tutto.
        // A schermo usciva un solo scontro, e il giocatore non vedeva il
        // tiro che stava subendo.
        // L'attivo: dal primo attacco se c'e`, altrimenti dall'unita` attiva del
        // payload (chi si e` mosso). Con ZERO attacchi prima non si arrivava qui.
        const att0 = attacchi[0] || {};
        const attivoNome = att0.attaccante || (payload && (payload.attivo || payload.unita));
        const attaccante = ctx.trovaUnita
            ? (ctx.trovaUnita(attivoNome, att0.attaccanteId) || { alias: attivoNome || 'attivo' })
            : (att0.attaccante || { alias: attivoNome || 'attivo' });
        reazioni.forEach(function (r) {
            if (usate.indexOf(r) >= 0) return;
            const reattivo = r.difensore ||
                (ctx.trovaUnita ? ctx.trovaUnita(r.nome) : { alias: r.nome });

            // Chi reagisce senza essere bersaglio fa un TIRO NORMALE:
            // l'attivo non gli sta tirando contro, quindi non c'e` niente
            // da opporre. Se invece punta all'attaccante, e` comunque il
            // suo tiro contro un bersaglio che non reagisce.
            scontri.push(M.risolviScontro({
                attaccante: reattivo,
                azione: M.azioneCanonica(r.azione) || r.azione,
                arma: r.arma,
                bersaglio: r.bersaglio ? (ctx.trovaUnita ? ctx.trovaUnita(r.bersaglio) : { alias: r.bersaglio })
                                       : attaccante,
                burst: r.burst || 1, ammo: r.ammo,
                rangeIndex: r.rangeIndex, rangeMod: r.rangeMod,
                cover: (r.coverAttaccante != null) ? r.coverAttaccante : r.cover, terrain: r.terrain
            }, null, Object.assign({}, ctx, { reattivoNonBersagliato: true })));

            const ultimo = scontri[scontri.length - 1];
            // Il reattivo sta nello slot `attivo` dello scontro: chi lo
            // traduce per il tabellone deve saperlo, o lo mette sotto la
            // fazione attiva. (Chat TEST, 23 settembre.)
            ultimo.reattivoNonBersagliato = true;
            ultimo.note = (ultimo.note || []).concat([
                `${M.nomeUnita(reattivo)} reagisce senza essere bersaglio dell'attacco: il suo è un Tiro Normale a sé.`
            ]);
        });

        return scontri;
    };


    // ==================================================================
    // PARTE 23: DADI SPECIALI E NOTAZIONI, secondo N5.3
    // ------------------------------------------------------------------
    // Dalla pagina "Skills and Equipment Module" (aggiornata N5.3):
    //   - il (+1 SD) vale in Turno Attivo E in Turno Reattivo;
    //   - NON si applica alle Long Skill;
    //   - NON si applica a ciò che non richiede un tiro, per esempio le
    //     Sagome Dirette;
    //   - FAQ 0.1 (F04, wiki "Coordinated Orders"): vale anche negli Ordini Coordinati, perché non cambia
    //     il valore di Burst.
    // ==================================================================

    M.dadiSpeciali = function (unita, arma, ctx) {
        ctx = ctx || {};
        const spec = M.SPEC[ctx.azione] || {};

        // Long Skill: escluse per regola.
        const R = M.regoleAttacco(ctx.azione);
        if ((R && R.tipo === 'LONG_SKILL') || spec.longSkill) return 0;

        // Niente tiro, niente dado extra: le Sagome Dirette non tirano.
        if (arma) {
            const tpl = M.regoleTemplate(arma);
            if (tpl && tpl.tipo === 'DIRETTO' && ctx.azione !== M.AZIONI.INTUITIVO) return 0;
        }

        const etichetta = (spec.attributo === 'CC') ? 'CC Attack' : 'BS Attack';
        const fonti = M.notazioneAzione(skillsDi(unita), etichetta)
            .concat((arma && arma.notazioni) || []);

        let sd = 0;
        fonti.map(M.parseNotazione).forEach(function (n) {
            if (n.tipo === 'DADO_SPECIALE' && n.valore > 0) sd += n.valore;
        });

        // Le Martial Arts danno il proprio (+1 SD) tramite la tabella, non
        // tramite una notazione: quello lo conta burstCC.
        return sd;
    };

    // Le notazioni "ReRoll" hanno un tipo proprio: consentono di ritirare un
    // dado quando si usa quella Skill, Arma o Equipaggiamento.
    M.riTiri = function (unita, arma, azione) {
        const spec = M.SPEC[azione] || {};
        const etichetta = (spec.attributo === 'CC') ? 'CC Attack' : 'BS Attack';
        const fonti = M.notazioneAzione(skillsDi(unita), etichetta)
            .concat((arma && arma.notazioni) || []);
        const n = fonti.filter(x => /^RE\s*ROLL$/i.test(String(x).replace(/\s+/g, ' ').trim()) ||
                                    /^REROLL$/i.test(String(x).replace(/\s+/g, '')));
        return { quanti: n.length,
                 nota: n.length ? 'ReRoll: puoi ritirare un dado del tiro, solo usando questa Skill/Arma.' : null };
    };


    // ==================================================================
    // PARTE 24: CRITICI E VALORI FUORI SCALA
    // ------------------------------------------------------------------
    // Dalla pagina "Rolls":
    //   - Critico: il dado esce ESATTAMENTE pari al Valore di Successo.
    //   - Valore di Successo sotto 1: non si tira, il tiro fallisce.
    //   - Valore di Successo sopra 20: ogni tiro riesce, e i Critici
    //     aumentano. Con SV 23 sono Critici il 20, l'1, il 2 e il 3.
    //   - Nei Faccia a Faccia i Critici vincono sempre; se entrambi fanno
    //     Critico e` pareggio e falliscono entrambi.
    // ==================================================================

    M.critici = function (valoreSuccesso) {
        const sv = parseInt(valoreSuccesso, 10);

        if (!isFinite(sv) || sv < 1) {
            return { valori: [], nessunTiro: true, riesceSempre: false,
                     testo: 'Nessun tiro: il Valore di Successo è sotto 1, il tiro fallisce automaticamente.' };
        }
        if (sv <= 20) {
            return { valori: [sv], nessunTiro: false, riesceSempre: false,
                     testo: `Critico con un ${sv}.` };
        }

        // Sopra 20: il 20 resta Critico, e si aggiungono i risultati bassi
        // pari all'eccedenza. SV 23 -> Critici su 20, 1, 2, 3.
        const extra = [];
        for (let i = 1; i <= Math.min(sv - 20, 20); i++) extra.push(i);
        return {
            valori: [20].concat(extra),
            nessunTiro: false,
            riesceSempre: true,
            eccedenza: sv - 20,
            testo: `Valore di Successo ${sv}: ogni tiro riesce. Critico con 20` +
                   (extra.length ? `, ${extra.join(', ')}` : '') + '.'
        };
    };

    // Esito di un confronto fra due tiri, per la parte che si puo` decidere
    // prima di tirare: chi vince a parita`, chi non tira affatto.
    M.regoleCritico = {
        vinceSempre: 'Nei Tiri Faccia a Faccia un Critico vince sempre, quali che siano i risultati dell\'avversario.',
        doppioCritico: 'Se entrambi ottengono almeno un Critico il Faccia a Faccia e` pari: falliscono entrambi.',
        arrotondamento: 'Ogni divisione si arrotonda per ECCESSO: meta` di 5 e` 3.'
    };


    // ==================================================================
    // PARTE 25: ORDINE COORDINATO E ATTIVAZIONE
    // ==================================================================

    // Una truppa puo` ricevere un Ordine dal Pool?
    // I controlli stavano SOLO dentro ordine_coordinato.js, scritti due
    // volte: in selezionaUnita() e in impostaPuntaDiLancia().
    // Chi puo` ricevere un Ordine dal Pool. E` una regola, non una decisione
    // grafica: l'interfaccia chiede, il motore risponde.
    M.puoRicevereOrdine = function (unita) {
        // 🔴 Un Deployable non riceve Ordini: agisce col proprio innesco.
        if (unita && unita.deployable) {
            return { puo: false, blocchi: [{ stato: 'DEPLOYABLE', motivo: 'È un Deployable: non riceve Ordini dal Pool.' }],
                     motivo: 'È un Deployable: non riceve Ordini dal Pool.',
                     annullaSoppressione: false, notaSoppressione: null };
        }
        const A = catalogo('ATTIVAZIONE').impedita || {};
        const st = M.statoBersaglio(unita);
        const blocchi = [];
        if (st.morto)       blocchi.push({ stato: 'morto', nome: M.nomeStato('morto'), motivo: A['morto'] });
        if (st.incosciente) blocchi.push({ stato: 'incosciente', nome: M.nomeStato('incosciente'), motivo: A['incosciente'] });
        if (st.isolato)     blocchi.push({ stato: 'isolato', nome: M.nomeStato('isolato'), motivo: A['isolato'] });
        if (st.disconnesso) blocchi.push({ stato: 'disconnesso', nome: M.nomeStato('disconnesso'), motivo: A['disconnesso'] });
        // Posseduto e Sepsitorizzato: la truppa passa sotto controllo
        // avversario. La regola e` esplicita per entrambi.
        if (unita && unita.states && unita.states.possessed) blocchi.push({ stato: 'posseduto', nome: M.nomeStato('posseduto'), motivo: A['posseduto'] });
        if (unita && unita.states && unita.states.sepsitorized) blocchi.push({ stato: 'sepsitorizzato', nome: M.nomeStato('sepsitorizzato'), motivo: A['sepsitorizzato'] });

        return {
            puo: blocchi.length === 0,
            blocchi: blocchi,
            motivo: blocchi.length ? blocchi[0].motivo : null,
            // L'attivazione annulla il Fuoco di Soppressione.
            annullaSoppressione: !!st.suppressive,
            notaSoppressione: st.suppressive
                ? (catalogo('ATTIVAZIONE').cancellaSoppressione || null) : null
        };
    };

    // Nome storico, tenuto per non rompere i chiamanti esistenti.
    M.puoEssereAttivata = function (unita) { return M.puoRicevereOrdine(unita); };

    // Un gruppo puo` formare un Ordine Coordinato?
    M.validaCoordinato = function (unita, puntaDiLancia) {
        const C = catalogo('ORDINE_COORDINATO');
        const errori = [];
        const note = [];
        unita = unita || [];

        if (unita.length === 0) errori.push(err('E40', 'Nessuna unità selezionata.'));

        const max = C.massimoTruppe || 4;
        if (unita.length > max) {
            errori.push(err('E41', `Ordine Coordinato con ${unita.length} unità: il massimo è ${max}.`));
        }

        // Stati che impediscono l'attivazione
        unita.forEach(function (u) {
            const a = M.puoRicevereOrdine(u);
            if (!a.puo) errori.push(err('E42', `${M.nomeUnita(u)}: ${a.motivo}`, `Stato ${a.blocchi[0].stato}.`));
            if (a.annullaSoppressione) note.push(`${M.nomeUnita(u)}: attivandolo si annulla il Fuoco di Soppressione.`);
        });

        // Stesso Gruppo di Combattimento
        const gruppi = [];
        unita.forEach(function (u) { if (gruppi.indexOf(u.combatGroup) < 0) gruppi.push(u.combatGroup); });
        if (gruppi.length > 1) {
            errori.push(err('E43', `Le unità appartengono a ${gruppi.length} Gruppi di Combattimento diversi.`,
                'Un Ordine Coordinato richiede lo stesso Gruppo.'));
        }

        // 🔴 Stesso Addestramento: Regolari con Regolari. Il modulo non lo
        // controllava affatto.
        function addestramento(u) {
            const s = skillsDi(u);
            return s.indexOf('IRREGULAR') >= 0 || s.indexOf('IRREGOLARE') >= 0 ? 'IRREGOLARE' : 'REGOLARE';
        }
        const addestramenti = [];
        unita.forEach(function (u) { const a = addestramento(u); if (addestramenti.indexOf(a) < 0) addestramenti.push(a); });
        if (addestramenti.length > 1) {
            errori.push(err('E44', 'Le unità hanno Addestramento diverso: Regolari e Irregolari non possono coordinarsi.',
                addestramenti.join(' e ')));
        }

        // Punta di Lancia
        if (unita.length > 0 && !puntaDiLancia) {
            errori.push(err('E45', 'Nessuna Punta di Lancia designata.'));
        } else if (puntaDiLancia && !unita.some(u => u === puntaDiLancia ||
                   M.nomeUnita(u).toUpperCase() === M.nomeUnita(puntaDiLancia).toUpperCase())) {
            errori.push(err('E46', 'La Punta di Lancia non è fra le unità selezionate.'));
        }

        note.push(C.costo);
        note.push(C.stessoBersaglio);

        return { ok: errori.length === 0, errori, note,
                 costo: C.costo, stessaSequenza: C.stessaSequenza, stessoBersaglio: C.stessoBersaglio };
    };

    // Riepilogo dei dadi di un Ordine Coordinato, per la schermata.
    M.burstCoordinato = function (unita, armi, azione, ctx) {
        ctx = ctx || {};
        const inCC = (M.SPEC[azione] || {}).attributo === 'CC';
        return (unita || []).map(function (u, i) {
            const arma = (armi && armi[i]) || null;
            const b = inCC
                ? M.burstCC(u, arma, { coordMode: true, indiceCoord: i, partecipantiIngaggiati: ctx.partecipantiIngaggiati })
                : M.burstIniziale(u, arma, { azione: azione, coordMode: true, indiceCoord: i });
            return {
                unita: u, nome: M.nomeUnita(u), punta: i === 0,
                burst: b.valore, nonTira: !!b.nonTira, sd: b.sd || 0,
                voci: b.voci, note: b.note
            };
        });
    };


    // ==================================================================
    // PARTE 26: LIVELLO E BONUS DEL FIRETEAM
    // ------------------------------------------------------------------
    // 🔴 Il Livello NON e` il numero di membri: e` il numero di truppe
    // della STESSA UNITA`. Un Fireteam di cinque truppe tutte diverse e`
    // di Livello 1. Contando le teste, il calcolatore regalava a ogni
    // Fireteam misto +1 SD, +3 Discover, +1 Dodge, +1 BS e Sesto Senso.
    // ==================================================================

    // Nome di Unita`: il campo `nome` del database porta le opzioni fra
    // parentesi ("Grenzer (Missile Launcher)"), che non cambiano l'Unita`.
    M.unitaDi = function (u) {
        const grezzo = String((u && (u.unita || u.nome || u.name)) || '').trim();
        return normalizza(grezzo.replace(/\(([^)]*)\)/g, ' ')).toUpperCase();
    };

    // Livello del Fireteam: il gruppo piu` numeroso di truppe della stessa
    // Unita`. `equivalenze` permette di dichiarare che due nomi diversi
    // contano come stessa Unita` (e` cio` che fa la Fireteams Chart del
    // Settoriale: "Griffin (Fennec)" conta come Fennec).
    M.livelloFireteam = function (membri, equivalenze) {
        // 🔴 Un Deployable non e` un membro del Fireteam: contarlo alzerebbe
        // il Livello con un token che non e` una truppa. Come in
        // validaCoordinato, si esclude.
        membri = (membri || []).filter(function (u) { return u && !u.deployable; });
        if (membri.length === 0) return { livello: 0, membri: 0, unita: {}, note: [] };

        function chiave(u) {
            const n = M.unitaDi(u);
            if (equivalenze) {
                const k = Object.keys(equivalenze).find(x => x.toUpperCase() === n);
                if (k) return String(equivalenze[k]).toUpperCase();
            }
            return n;
        }

        const conteggio = {};
        membri.forEach(function (u) { const k = chiave(u); conteggio[k] = (conteggio[k] || 0) + 1; });

        const maggioranza = Math.max.apply(null, Object.keys(conteggio).map(k => conteggio[k]));
        // Il Livello non puo` superare il numero di membri, ed e` almeno 1.
        const livello = Math.max(1, Math.min(maggioranza, membri.length, 5));

        const note = [];
        if (maggioranza < membri.length) {
            note.push(`Fireteam di ${membri.length} truppe ma di Livello ${livello}: solo ${maggioranza} appartengono alla stessa Unità.`);
        }
        return { livello, membri: membri.length, unitaPiuNumerosa: maggioranza, unita: conteggio, note };
    };

    // Bonus effettivi, dal Livello e non dal numero di teste.
    M.bonusFireteam = function (membri, equivalenze) {
        const C = catalogo('FIRETEAM');
        const L = M.livelloFireteam(membri, equivalenze);
        const liv = L.livello;
        const attivi = [];

        const b = {
            livello: liv, membri: L.membri, unita: L.unita,
            ordineUnico: liv >= 1,
            sd: liv >= 2 ? 1 : 0,
            discover: liv >= 3 ? 3 : 0,
            dodge: liv >= 3 ? 1 : 0,
            bs: liv >= 4 ? 1 : 0,
            sestoSenso: liv >= 5,
            note: L.note.slice(),
            avvisi: []
        };

        if (b.sd) attivi.push('BS Attack (+1 SD)');
        if (b.discover) attivi.push('+3 Discover');
        if (b.dodge) attivi.push('+1 Schivata');
        if (b.bs) attivi.push('+1 BS');
        if (b.sestoSenso) attivi.push('Sesto Senso');
        b.elenco = attivi;

        if (C.nonSuDiscover) b.note.push(C.nonSuDiscover);
        if (b.bs) b.note.push('Il +1 BS vale anche per le armi con Tratto "BS Weapon (PH)" o "(WIP)".');
        return b;
    };


    // ==================================================================
    // PARTE 27: INTEGRITA` DEL FIRETEAM E CANCELLAZIONE DEGLI STATI
    // ------------------------------------------------------------------
    // Le regole stavano in DUE file che si contraddicevano:
    //   fireteam.js      -> Soppressione si`, Immobilizzato no   (giusto)
    //   logica_stati.js  -> Immobilizzato si`, Soppressione no   (sbagliato)
    // e a nessuno dei due mancavano solo quelle: delle dieci cause
    // ufficiali ne conoscevano quattro.
    // ==================================================================

    // evento: { coerenzaRotta, ordineIrregolare, ordineTenente, impetuoso,
    //           cambioGruppo, aroDiverso }
    M.rotturaFireteam = function (unita, evento) {
        evento = evento || {};
        const C = catalogo('FIRETEAM_INTEGRITA').cause || {};
        const st = M.statoBersaglio(unita);
        const cause = [];

        function aggiungi(k) { if (C[k]) cause.push({ causa: k, testo: C[k].testo }); }

        // --- automatiche, dallo stato della truppa ---
        if (st.isolato) aggiungi('ISOLATO');
        // riga 11638; Posseduto 14512, Sepsitorizzato 14590
        if (M.eNullo(unita)) aggiungi('STATO_NULLO');
        if (st.camo || st.imp || st.holoecho || st.decoy ||
            (unita && unita.states && (unita.states.holomask || unita.states.impersonation))) {
            aggiungi('FORMA_MARKER');
        }
        if (st.suppressive) aggiungi('SOPPRESSIONE');

        // Possessed e Sepsitorized: il regolamento non li elenca fra le cause,
        // ma una truppa Posseduta passa sotto il controllo avversario.
        // VERIFICATO wiki: la pagina Sepsitorized dice esplicitamente
        // "A Trooper in Sepsitorized State cannot be part of a Fireteam.
        //  If a member of a Fireteam enters Sepsitorized State, they
        //  automatically stop being part of the Fireteam."
        // Non e` piu` una deduzione: era marcato nonUfficiale, non lo e`.
        if (unita && unita.states && unita.states.sepsitorized) {
            cause.push({ causa: 'SEPSITORIZZATO',
                         testo: 'Sepsitorizzato: esce automaticamente dal Fireteam e dal Gruppo di Combattimento.' });
        }
        if (unita && unita.states && unita.states.possessed) {
            cause.push({ causa: 'POSSEDUTO',
                         testo: 'Posseduto: passa sotto controllo avversario, non puo` restare nel Fireteam.' });
        }

        // --- dipendenti dall'evento, non deducibili dallo stato ---
        if (evento.coerenzaRotta) aggiungi('COERENZA');
        if (evento.ordineIrregolare) aggiungi('ORDINE_IRREGOLARE');
        if (evento.ordineTenente) aggiungi('ORDINE_TENENTE');
        if (evento.impetuoso) aggiungi('IMPETUOSO');
        if (evento.cambioGruppo) aggiungi('CAMBIO_GRUPPO');
        if (evento.aroDiverso) aggiungi('ARO_DIVERSO');

        const note = [];
        // 🔴 Gli Immobilizzati NON rompono il Fireteam.
        if (st.immB || (unita && unita.states && unita.states.immobilizedA)) {
            note.push(catalogo('FIRETEAM_INTEGRITA').immobilizzatoNonRompe);
        }

        return {
            esce: cause.length > 0,
            cause: cause,
            motivo: cause.length ? cause[0].testo : null,
            note: note,
            rientro: cause.length ? catalogo('FIRETEAM_INTEGRITA').rientro : null
        };
    };

    // Una truppa puo` ENTRARE in un Fireteam?
    M.puoEntrareInFireteam = function (unita) {
        const F = catalogo('FIRETEAM_INTEGRITA');
        const st = M.statoBersaglio(unita);
        const s = skillsDi(unita);
        const blocchi = [];

        // riga 11551: "Isolated State or any Null State"
        if (st.isolato || M.eNullo(unita)) blocchi.push('Stato Isolato o Nullo.');
        if (M.inFormaMarker(st) || st.decoy) blocchi.push('E` in forma di Marker.');
        if (st.suppressive) blocchi.push('E` in Fuoco di Soppressione.');
        if (s.indexOf('INFILTRATION') >= 0) blocchi.push('Ha l\'Abilita` Infiltrazione.');
        if (s.indexOf('AIRBORNE DEPLOYMENT') >= 0 || s.indexOf('COMBAT JUMP') >= 0) blocchi.push('Ha un\'Abilita` con etichetta Schieramento Aereo.');
        if (s.indexOf('PERIPHERAL') >= 0) blocchi.push('E` una Periferica o il suo Controllore.');

        return { puo: blocchi.length === 0, blocchi: blocchi,
                 motivo: blocchi.length ? blocchi[0] : null,
                 note: blocchi.length === 0 && st.suppressive ? [F.soppressioneAnnullata] : [] };
    };

    // Stati Marker cancellati da Ritirata, Ingaggiato e Stati Nulli.
    // Regola gia` presente nel progetto: qui diventa una funzione sola.
    M.cancellaStatiMarker = function (stati) {
        stati = stati || {};
        const attiva = !!(stati.retreat || stati.engaged || stati.unconscious || stati.dead);
        if (!attiva) return { cancellati: [], stati: stati };

        const cancellati = [];
        ['camo', 'impersonation', 'holoecho', 'holomask', 'decoy'].forEach(function (k) {
            if (stati[k]) { cancellati.push(k); stati[k] = false; }
        });
        return {
            cancellati: cancellati,
            stati: stati,
            motivo: cancellati.length
                ? 'Ritirata!, Ingaggiato e gli Stati Nulli cancellano gli stati che permettono la sostituzione con un Marker.'
                : null
        };
    };


    // ==================================================================
    // PARTE 28: FILTRO ANTI-SPOILER DELLO SCHIERAMENTO
    // ------------------------------------------------------------------
    // 🔴 Il filtro precedente lavorava per SOTTRAZIONE: copiava l'unita`
    // intera e cambiava alias, name e tipo. Di un Marker Mimetico
    // l'avversario riceveva comunque nome dell'Unita`, CC, BS, PH, WIP,
    // ARM, BTS, armi, Abilita` ed Equipaggiamento.
    //
    // Qui si lavora per ELENCO: si copiano solo i campi ammessi. Quel che
    // non e` in lista non parte, anche se domani il profilo ne guadagna
    // altri.
    // ==================================================================

    M.filtraPerAvversario = function (unita) {
        const S = catalogo('SCHIERAMENTO');
        if (!unita) return null;

        const deploy = String(unita.deployState || 'NORMAL').toUpperCase();
        const st = M.statoBersaglio(unita);

        // Non e` sul tavolo: non esiste per l'avversario.
        if ((S.invisibili || []).indexOf(deploy) >= 0 || st.hidden) return null;

        function copia(campi) {
            const out = {};
            campi.forEach(function (k) { if (unita[k] !== undefined) out[k] = unita[k]; });
            return JSON.parse(JSON.stringify(out));
        }

        const eMarker = st.camo || st.imp || deploy.indexOf('CAMO') === 0 || deploy.indexOf('IMP') === 0;

        if (eMarker) {
            // Solo il segnalino. Niente statistiche, armi, Abilita`, nome vero.
            const p = copia(S.campiMarker || ['id', 'deployState']);
            const eCamo = st.camo || deploy.indexOf('CAMO') === 0;
            p.alias = (S.etichette || {})[eCamo ? 'CAMO' : 'IMP'] || 'MARKER';
            p.name = 'MARKER';
            p.nome = 'MARKER';
            p.tipo = 'MARKER';
            p.imgVariant = '0';
            p.states = { camo: eCamo, impersonation: !eCamo };
            return p;
        }

        // Truppa visibile: e` sul tavolo a faccia in su.
        const p = copia(S.campiVisibili || []);

        if (st.holoecho || String(unita.tipo).toUpperCase() === 'HOLOECHO') {
            p.alias = (S.etichette || {}).HOLOECHO || 'COPIA OLOGRAFICA';
        } else if (st.decoy || String(unita.tipo).toUpperCase() === 'DECOY') {
            p.alias = (S.etichette || {}).DECOY || 'BERSAGLIO DECOY';
        }

        if (deploy === 'HOLOMASK' || (unita.states && unita.states.holomask)) {
            // Nome finto e armi nascoste: il resto resta com'e`.
            p.nome = unita.fakeName || p.alias || 'TROOPER SCONOSCIUTO';
            p.name = p.nome;
            p.weapon = 'Sconosciuta';
            p.equip = 'Sconosciuto';
            p.skills = 'Sconosciute';
        }

        if (deploy === 'SEED') {
            const soloSeed = copia(S.campiMarker || ['id']);
            soloSeed.alias = (S.etichette || {}).SEED || 'SEED-EMBRYO';
            soloSeed.name = soloSeed.alias;
            soloSeed.nome = soloSeed.alias;
            soloSeed.tipo = 'MARKER';
            soloSeed.imgVariant = '0';
            return soloSeed;
        }

        if (deploy === 'FOXHOLE') {
            p.states = Object.assign({}, p.states, { foxhole: true });
        }
        return p;
    };

    // Roster pubblico: quello che si spedisce all'avversario.
    M.rosterPubblico = function (roster) {
        return (roster || []).map(M.filtraPerAvversario).filter(u => u !== null);
    };

    // Promemoria dei tiri automatici da fare dopo lo schieramento.
    M.promemoriaSchieramento = function (roster) {
        const S = catalogo('SCHIERAMENTO');
        const P = S.promemoriaPostSchieramento || {};
        const fuori = S.invisibili || [];
        const out = [];

        (roster || []).forEach(function (u) {
            const deploy = String(u.deployState || 'NORMAL').toUpperCase();
            const s = skillsDi(u);
            // Chi non e` sul tavolo non genera promemoria — TRANNE l'Infiltrazione
            // in Hidden Deployment: "Although the Trooper in Hidden Deployment is
            // not considered to be on the table, if the Trooper infiltrates ...
            // the Roll must be made once their position is written down"
            // (righe 13898-13901). Riserva e Airborne restano escluse.
            const fuoriTavolo = fuori.indexOf(deploy) >= 0;
            if (fuoriTavolo && !(deploy === 'HIDDEN' && s.indexOf('INFILTRATION') >= 0)) return;
            Object.keys(P).forEach(function (k) {
                if (s.indexOf(k) < 0) return;
                if (fuoriTavolo && k !== 'INFILTRATION') return;
                // 🔴 Qui c'era `if (k === 'INFILTRATION' && deploy !== 'NORMAL')
                // return;` — il promemoria spariva per chi si schiera come
                // Marker, cioe` proprio l'infiltratore in Camo, il caso piu`
                // comune. Il regolamento non ha eccezioni per lo stato di
                // schieramento: il Tiro di Infiltrazione serve a chiunque si
                // schieri nella meta` avversaria (righe dell'INFILTRATION,
                // "INFILTRATION ROLL"). Chi non e` ancora sul tavolo e` gia`
                // escluso sopra, dagli invisibili. (Chat INTERFACCIA.)
                let testo = P[k];
                // Al tavolo serve il NUMERO, non la regola: PH-3, oppure il PH
                // fra parentesi del profilo ("Infiltration (PH=11)" o "(11)").
                // Per lo Zero, PH 12: tira a 9. (Chat TEST, 21 settembre.)
                if (k === 'INFILTRATION') {
                    const mP = /INFILTRATION\s*[\(\[]\s*(?:PH\s*=?\s*)?(\d+)\s*[\)\]]/.exec(s);
                    const ph = parseInt(u.ph, 10);
                    const tiro = mP ? parseInt(mP[1], 10) : (isFinite(ph) ? ph - 3 : null);
                    if (tiro != null) testo += ` Tiro a ${tiro} (${mP ? 'PH fra parentesi del profilo' : 'PH ' + ph + ' - 3'}).`;
                }
                out.push({ unita: M.nomeUnita(u), skill: k, testo: testo });
            });
        });
        return out;
    };


    // ==================================================================
    // PARTE 29: SCOPRIRE
    // ------------------------------------------------------------------
    // Il router lo aspettava da sempre, il modulo non e` mai esistito.
    // Non e` un tiro nudo: applica gli stessi MOD di un BS Attack, e ha
    // bande di gittata proprie.
    // ==================================================================

    // L'arma virtuale dello Scoprire: la voce "SCOPRIRE" del database armi.
    M.armaScoprire = function () {
        const p = M.profiloArma('SCOPRIRE');
        if (p.nonTrovata) {
            return { nome: 'Scoprire', bands: [], burst: 1, ammo: null, ammoOpzioni: [],
                     isTemplate: false, isCC: false, notazioni: [], nonOffensiva: true,
                     avvisi: [err('A57', 'Voce "SCOPRIRE" assente dal database armi: nessuna banda di gittata.')] };
        }
        return Object.assign({}, p, { nonOffensiva: true, burst: 1 });
    };

    // ctx: { rangeIndex, cover, terrain, livelloFireteam }
    M.modScoprire = function (utente, bersaglio, ctx) {
        ctx = ctx || {};
        const R = M.regoleAttacco(M.AZIONI.SCOPRIRE) || {};
        const arma = M.armaScoprire();
        const tU = M.trattiTiro(utente);
        const st = M.statoBersaglio(bersaglio);
        const s = skillsDi(utente);

        // 🔴 Multispectral Visor L2+: lo Scoprire contro un CAMO
        // riesce AUTOMATICAMENTE, senza tirare.
        if (tU.msv2 && st.camo) {
            return {
                automatico: true, valore: null, base: null, mod: 0, attributo: 'WIP',
                voci: [], avvisi: [],
                note: ['Multispectral Visor L2+: lo Scoprire contro uno Stato CAMO riesce automaticamente, senza tiro.']
            };
        }

        // Base: gli stessi MOD di un BS Attack, ma su WIP.
        const esito = M.modAttacco(utente, bersaglio, arma, M.AZIONI.SCOPRIRE, {
            rangeIndex: ctx.rangeIndex,
            rangeMod: ctx.rangeMod,
            cover: ctx.cover,
            terrain: ctx.terrain
        });

        // Sensor: +6 WIP contro i Marker Mimetici.
        if (s.indexOf('SENSOR') >= 0 && st.camo) {
            esito.mod += 6; esito.valore += 6;
            esito.voci.push({ fonte: 'sensor', valore: 6, motivo: 'Sensor: +6 WIP contro Marker Mimetici' });
        }

        // Impersonation-1 impone -3, che il Biometric Visor ignora.
        const impUno = st.imp && /IMP[-_]?1/i.test(String(bersaglio && bersaglio.deployState || ''));
        if (impUno) {
            if (s.indexOf('BIOMETRIC VISOR') >= 0) {
                esito.note.push('Biometric Visor: ignora il -3 dello Stato Impersonation-1.');
            } else {
                esito.mod -= 3; esito.valore -= 3;
                esito.voci.push({ fonte: 'impersonation', valore: -3, motivo: 'Marker Impersonation-1: -3 WIP allo Scoprire' });
            }
        }

        // Fireteam: il +3 Discover del Livello 3. Il +1 BS e il +1 SD NO.
        let liv = parseInt(ctx.livelloFireteam, 10);
        if (!isFinite(liv) && Array.isArray(ctx.fireteam)) liv = M.livelloFireteam(ctx.fireteam).livello;
        if ((liv || 0) >= 3) {
            esito.mod += 3; esito.valore += 3;
            esito.voci.push({ fonte: 'fireteam', valore: 3, motivo: `Fireteam di Livello ${liv}: +3 Discover` });
        }
        if (R.noBonusFireteam) esito.note.push(R.noBonusFireteam);

        esito.attributo = 'WIP';
        esito.impossibile = (esito.valore < 1);
        esito.critici = M.critici(esito.valore);
        if (R.fallimento) esito.note.push(R.fallimento);
        (arma.avvisi || []).forEach(a => esito.avvisi.push(a));
        return esito;
    };


    // ==================================================================
    // PARTE 29: SCOPRIRE
    // ------------------------------------------------------------------
    // Il modulo non esisteva: il router lo cercava e trovava il vuoto.
    //
    // Scoprire NON e` un tiro nudo come l'Intuitivo: prende gli STESSI MOD
    // di un BS Attack — Copertura, gittata, Mimetismo — e ha gittate
    // proprie, la riga "SCOPRIRE" del Weapon Chart.
    // ==================================================================

    M.armaScoprire = function () {
        const p = M.profiloArma('SCOPRIRE');
        if (p.nonTrovata) {
            return { nome: 'SCOPRIRE', bands: [], burst: 1, ammo: null, ammoOpzioni: [],
                     isTemplate: false, isCC: false, notazioni: [],
                     avvisi: [err('A57', 'Voce "SCOPRIRE" assente dal database armi: nessun MOD di gittata disponibile.')] };
        }
        return p;
    };

    // ctx: { rangeIndex, cover, terrain, livelloFireteam, fireteam }
    M.regoleScoprire = function (attaccante, bersaglio, ctx) {
        ctx = ctx || {};
        const R = M.regoleAttacco(M.AZIONI.SCOPRIRE) || {};
        const tA = M.trattiTiro(attaccante);
        const stD = M.statoBersaglio(bersaglio);
        const arma = M.armaScoprire();
        const note = [], avvisi = (arma.avvisi || []).slice();

        // --- Multispectral Visor L2+: successo automatico sul CAMO ---
        if (stD.camo && tA.msv2) {
            return {
                automatico: true, valore: null, base: null, mod: 0, attributo: 'WIP',
                voci: [], avvisi: avvisi,
                note: ['Multispectral Visor L2+: Scoprire contro lo Stato CAMO riesce AUTOMATICAMENTE, senza tirare.'],
                successo: R.successo || null
            };
        }

        // --- gli stessi MOD di un BS Attack, ma sul WIP ---
        const e = M.modAttacco(attaccante, bersaglio, arma, M.AZIONI.SCOPRIRE, {
            rangeIndex: ctx.rangeIndex, rangeMod: ctx.rangeMod,
            cover: ctx.cover, terrain: ctx.terrain,
            livelloFireteam: ctx.livelloFireteam, fireteam: ctx.fireteam
        });
        e.avvisi.forEach(function (a) { avvisi.push(a); });

        // --- Sensor: +6 contro i Marker Mimetici ---
        if (skillsDi(attaccante).indexOf('SENSOR') >= 0 && stD.camo) {
            e.mod += 6; e.valore += 6;
            e.voci.push({ fonte: 'sensor', valore: 6, motivo: 'Sensor: +6 WIP scoprendo un Marker Mimetico' });
        }

        // --- Discover (+N) di profilo ---
        M.notazioniAzione(skillsDi(attaccante), 'Discover').forEach(function (n) {
            if (n.tipo === 'MOD' && n.valore > 0) {
                e.mod += n.valore; e.valore += n.valore;
                e.voci.push({ fonte: 'profilo', valore: n.valore, motivo: 'Discover (' + n.raw + ')' });
            }
        });

        // --- Fireteam: il +3 di Livello 3. Il +1 SD e il +1 BS NON valgono
        //     su Scoprire: il Livello 2 e` "BS Attack (+1 SD)" (regolamento riga
        //     11895) e il Livello 4 vale "When declaring BS Attack" (riga 11932).
        //     Scoprire non e` un BS Attack, quindi il +1 va tolto se c'era.
        //     (Prima citava una FAQ 0.0.0 che non esiste: la regola sta nel testo.)
        let liv = parseInt(ctx.livelloFireteam, 10);
        if (!isFinite(liv) && Array.isArray(ctx.fireteam)) liv = M.livelloFireteam(ctx.fireteam).livello;
        if ((liv || 0) >= 3) {
            e.voci.filter(function (v) { return v.fonte === 'fireteam'; })
                  .forEach(function (v) { e.mod -= v.valore; e.valore -= v.valore; });
            e.voci = e.voci.filter(function (v) { return v.fonte !== 'fireteam'; });
            e.mod += 3; e.valore += 3;
            e.voci.push({ fonte: 'fireteam', valore: 3, motivo: 'Fireteam di Livello ' + liv + ': +3 Discover' });
            if (R.senzaBonusFireteam) note.push(R.senzaBonusFireteam);
        }

        e.note.forEach(function (n) { note.push(n); });
        if (R.noteTiro) note.push(R.noteTiro);
        if (R.fallimento) note.push(R.fallimento);

        return {
            automatico: false,
            valore: e.valore, base: e.base, mod: e.mod, attributo: 'WIP',
            impossibile: e.valore < 1,
            critici: M.critici(e.valore),
            voci: e.voci, note: note, avvisi: avvisi,
            arma: arma, successo: R.successo || null
        };
    };


    // ==================================================================
    // PARTE 30: SUPPORTO — Dottore, Ingegnere, MediKit, GizmoKit
    // ------------------------------------------------------------------
    // L'ultimo modulo che il router cercava senza trovarlo.
    //
    // 🔴 CHI TIRA CAMBIA:
    //    Dottore e Ingegnere -> tira L'UTENTE, su WIP
    //    MediKit e GizmoKit  -> tira IL BERSAGLIO, su PH
    // Trattarli allo stesso modo significherebbe far tirare la persona
    // sbagliata, con l'attributo sbagliato.
    //
    // E il fallimento non e` uguale: col Dottore e col MediKit il bersaglio
    // MUORE, con Ingegnere e GizmoKit prende una Ferita.
    // ==================================================================

    M.strumentiSupporto = function (unita) {
        const S = catalogo('SUPPORTO');
        const testo = skillsDi(unita);
        const out = [];
        [['DOTTORE', 'DOCTOR'], ['INGEGNERE', 'ENGINEER'],
         ['MEDIKIT', 'MEDIKIT'], ['GIZMOKIT', 'GIZMOKIT']].forEach(function (c) {
            if (testo.indexOf(c[1]) < 0) return;
            const v = S[c[0]];
            if (!v) return;
            out.push(Object.assign({ id: c[0] }, v));
        });
        return out;
    };

    // Bersagli validi per uno strumento di supporto: ALLEATI, non nemici.
    M.bersagliSupporto = function (strumento, alleati, utente) {
        const id = String((strumento && strumento.id) || strumento || '').toUpperCase();

        // 🔴 Uno strumento non riconosciuto NON deve ripiegare sul filtro
        // dell'Ingegnere. Prima 'DOCTOR' invece di 'DOTTORE' faceva accettare
        // i REM al Dottore e rifiutare gli Incoscienti con VITA, col motivo
        // dell'Ingegnere. regoleSupporto falliva con A58, questo no: due
        // percorsi per la stessa domanda, con risposte diverse.
        if (!catalogo('SUPPORTO')[id]) {
            const noti = Object.keys(catalogo('SUPPORTO'))
                .filter(function (k) { return k === k.toUpperCase() && catalogo('SUPPORTO')[k].chiTira; });
            return [{
                unita: null, nome: null, ammesso: false,
                errore: err('A58', `Strumento di supporto "${strumento}" sconosciuto.`,
                            'Attesi: ' + noti.join(', ')),
                motivo: `Strumento "${strumento}" sconosciuto: nessun bersaglio calcolabile.`
            }];
        }

        const perVita = (id === 'DOTTORE' || id === 'MEDIKIT');
        const roster = Array.isArray(alleati) ? alleati : M.rosterProprio();

        return roster.map(function (u) {
            const st = M.statoBersaglio(u);
            const e = { unita: u, nome: M.nomeUnita(u), ammesso: true, motivo: null, note: [] };
            function nega(m) { e.ammesso = false; e.motivo = m; }

            // 🔴 Un Deployable non si ripara: ha STR, quindi entrava nel filtro
            // dell'Ingegnere col motivo sbagliato. E per la regola sui
            // Deployable non va MAI Incosciente, quindi non c'e` niente da
            // recuperare.
            if (u && u.deployable) {
                nega('È un Deployable: passa direttamente a Morto, non c\'è nulla da riparare.');
                return e;
            }
            if (utente && u === utente && st.morto) { nega('In Stato Nullo non si puo` curare se stessi.'); return e; }
            if (st.morto) { nega('Morto: rimosso dal tavolo.'); return e; }

            // 🔴 `s` e` la SILHOUETTE, non la STR, e ce l'hanno TUTTI i
            // profili: Alguacil s=2, Reaktion Zond s=3. Leggerla come STR
            // rendeva haVita sempre falso e haStr sempre vero, quindi il
            // Dottore rifiutava tutti e l'Ingegnere accettava tutti.
            // I campi giusti: VITA = u.w, STR = u.str. La Silhouette non
            // entra in questo controllo.
            const techno = skillsDi(u).indexOf('TECHNORGANIC') >= 0;
            const haVita = (u.w != null) || (u.vita != null) || techno;
            const haStr  = (u.str != null) || techno;

            if (id === 'DOTTORE' || id === 'MEDIKIT') {
                if (!st.incosciente) { nega('Non e` in Stato Incosciente.'); return e; }
                if (!haVita && !techno) { nega('Non ha l\'attributo VITA: serve un Ingegnere o un GizmoKit.'); return e; }
            } else {
                if (!haStr && !techno) { nega('Non ha l\'attributo STR: serve un Dottore o un MediKit.'); return e; }
                if (!st.incosciente && !st.immB && !st.targeted &&
                    !(u.states && (u.states.immobilizedA || u.states.stunned))) {
                    nega('Non ha Ferite da rimuovere ne` Stati annullabili dall\'Ingegnere.');
                    return e;
                }
            }
            if (techno) e.note.push(catalogo('SUPPORTO').technorganic);
            return e;
        });
    };

    // Il tiro. ctx: { inContatto, rangeIndex, cover }
    M.regoleSupporto = function (utente, bersaglio, strumento, ctx) {
        ctx = ctx || {};
        const S = catalogo('SUPPORTO');
        const id = String((strumento && strumento.id) || strumento || '').toUpperCase();
        const R = S[id];
        const note = [], avvisi = [];

        if (!R) {
            return { valido: false, avvisi: [err('A58', `Strumento di supporto "${id}" sconosciuto.`)] };
        }

        const tiraIlBersaglio = (R.chiTira === 'BERSAGLIO');
        const chi = tiraIlBersaglio ? bersaglio : utente;
        const attr = R.attributo;

        // "MediKit (PH=12)" nel profilo del BERSAGLIO sostituisce il suo PH.
        let base = parseInt((chi && chi[String(attr).toLowerCase()]), 10) || 0;
        if (tiraIlBersaglio) {
            const sost = M.attributoEffettivo(bersaglio, attr, R.nome);
            if (sost.sostituito) { base = sost.valore; note.push(sost.motivo); }
        }

        const voci = [{ fonte: 'base', valore: base, motivo: `${attr} di ${M.nomeUnita(chi)}: ${base}` }];
        let mod = 0;

        // Notazioni di profilo: "Doctor (+3)", "Engineer (ReRoll -6)"...
        M.notazioniAzione(skillsDi(utente), R.nome).forEach(function (n) {
            if (n.tipo === 'MOD') {
                mod += n.valore;
                voci.push({ fonte: 'profilo', valore: n.valore, motivo: `${R.nome} (${n.raw})` });
            } else if (n.tipo === 'SOSTITUZIONE' && !tiraIlBersaglio && n.attributo === attr) {
                base = n.valore;
                voci[0] = { fonte: 'base', valore: base, motivo: `${R.nome} (${n.raw}): usa ${base}` };
            } else if (n.tipo === 'TESTO' && /RE ?ROLL/i.test(n.testo)) {
                note.push(`${R.nome} (${n.raw}): consente di ripetere il tiro.`);
            }
        });

        let valore = base + mod;
        // 🔴 NIENTE clamp a 1. Per regola un Valore di Successo sotto 1 e`
        // un FALLIMENTO AUTOMATICO: non si tira. Portarlo a 1 inventava un
        // valore — un PH 10 a -12 schivava tirando un 1. Stessa gestione del
        // tiro d'attacco: il valore vero, e il flag `impossibile`.
        // (Segnalato dalla chat REGOLE, giro del 20 settembre.)

        // Il MediKit/GizmoKit a distanza e` un BS Attack: serve colpire prima.
        let tiroPerColpire = null;
        if (!ctx.inContatto && R.tipo === 'EQUIPAGGIAMENTO') {
            const bs = M.modAttacco(utente, bersaglio, M.armaScoprire(), M.AZIONI.SUPPORTO_BS, {
                rangeIndex: ctx.rangeIndex, cover: false
            });
            tiroPerColpire = { attributo: 'BS', valore: bs.valore, base: bs.base, voci: bs.voci };
            note.push('A distanza il MediKit/GizmoKit e` un BS Attack: prima si colpisce, poi il bersaglio tira.');
        } else if (R.tipo === 'EQUIPAGGIAMENTO') {
            note.push(R.modalita ? R.modalita.contatto : 'In contatto non serve tirare per colpire.');
        }

        note.push(R.successo);
        note.push(`⚠️ ${R.fallimento}`);
        if (R.senzaSalvezza) note.push(R.senzaSalvezza);
        if (S.proneAnnullato) note.push(S.proneAnnullato);
        if (R.riTiro) note.push(R.riTiro);

        return {
            valido: true,
            strumento: R.nome,
            chiTira: R.chiTira,
            nomeChiTira: M.nomeUnita(chi),
            attributo: attr,
            base: base, mod: mod, valore: valore,
            critici: M.critici(valore),
            impossibile: valore < 1,
            fallimentoLetale: !!R.fallimentoLetale,
            tiroPerColpire: tiroPerColpire,
            voci: voci, note: note, avvisi: avvisi
        };
    };


    // ==================================================================
    // PARTE 31: STATI ATTIVI, PER IL TABELLONE
    // ------------------------------------------------------------------
    // statoBersaglio() restituisce una mappa di booleani su TUTTI i nomi.
    // Per il tabellone serve l'altra domanda: "quali stati ha addosso
    // adesso", senza conoscere l'elenco in anticipo.
    //
    // I tre depositi — unit.state, unit.deployState, unit.states.* — li
    // unifica gia` statoBersaglio: qui si trasforma il risultato in lista.
    // ==================================================================

    // 🔴 NOMI_STATI non e` piu` un secondo vocabolario: e` una LETTURA di
    // CATALOGO_N5.STATI, stesse chiavi (gli id canonici), stessa forma di
    // prima ({ id: { nome, categoria } }). Chi la legge non cambia niente;
    // ma nome e categoria stanno in un posto solo. (23 settembre.)
    Object.defineProperty(M, 'NOMI_STATI', {
        enumerable: true, configurable: true,
        get: function () {
            const S = catalogo('STATI') || {};
            const o = {};
            Object.keys(S).forEach(function (id) { o[id] = { nome: S[id].nome, categoria: S[id].categoria }; });
            return o;
        }
    });

    // Ordine di presentazione: prima cio` che toglie la truppa dal gioco.
    // 🔴 La sequenza sta nel CATALOGO. Qui si legge, non si ripete: la
    // copia locale era identica oggi, e sarebbe divergita al primo che
    // aggiunge una categoria da una parte sola.
    function ordineCategorie() {
        const C = catalogo('CATEGORIE_STATI');
        return Array.isArray(C) ? C : ['NULLO', 'IMM', 'INFOGUERRA', 'ALTERAZIONE', 'POSTURA', 'MARKER'];
    }

    // Funziona su QUALSIASI oggetto unita`: quello del gameState dell'Hub,
    // quello del roster locale, quello di un payload. Non serve contesto.
    M.statiAttivi = function (unita) {
        const st = M.statoBersaglio(unita);
        const out = [];

        Object.keys(M.NOMI_STATI).forEach(function (k) {
            if (!st[k]) return;
            const v = M.NOMI_STATI[k];
            out.push({ id: k, nome: v.nome, categoria: v.categoria });
        });

        out.sort(function (a, b) {
            const ord = ordineCategorie();
            return ord.indexOf(a.categoria) - ord.indexOf(b.categoria);
        });
        return out;
    };

    // Le QUANTITA` non sono stati: stanno altrove e si chiedono a parte.
    // ctx: { fireteam } per il livello, se serve.
    M.quantitaUnita = function (unita, ctx) {
        ctx = ctx || {};
        const out = {};
        const w = parseInt(unita && (unita.w != null ? unita.w : unita.s), 10);
        if (isFinite(w)) {
            out.vitaTotale = w;
            out.attributo = (unita.w != null) ? 'VITA' : 'STR';
            // Le ferite subite non stanno nel profilo: le tiene il gioco.
            if (unita.ferite != null) out.ferite = parseInt(unita.ferite, 10) || 0;
        }
        const ma = M.livelloMartialArts(unita);
        if (ma) out.martialArts = ma;
        if (Array.isArray(ctx.fireteam) && ctx.fireteam.length) {
            out.livelloFireteam = M.livelloFireteam(ctx.fireteam).livello;
        }
        const fw = M.valoreFirewall(unita);
        if (fw) out.firewall = fw;
        return out;
    };


    // ==================================================================
    // REGISTRO DELLE VERSIONI
    // ------------------------------------------------------------------
    // Ogni file porta in testa una riga "@versione", ma leggerla richiede
    // aprire i sorgenti. Qui ogni file la DICHIARA al caricamento, così il
    // controllo incrociato fra le tre chat si fa da console:
    //
    //     MotoreN5.versioni()
    //
    // Chi chiede una modifica a un file non suo cita la versione che sta
    // leggendo; chi riceve confronta. Se non coincidono, non si modifica:
    // si chiede di aggiornare il contesto del progetto.
    // ==================================================================

    M._versioni = {};

    M.dichiaraVersione = function (nomeFile, versione, proprieta) {
        M._versioni[nomeFile] = { versione: versione, proprieta: proprieta || null };
    };

    M.versioni = function () {
        const nomi = Object.keys(M._versioni).sort();
        if (nomi.length === 0) {
            console.warn('Nessun file ha dichiarato la propria versione.');
            return {};
        }
        console.log('── versioni dei file caricati ──');

        const daVerificare = [];
        nomi.forEach(function (n) {
            const v = M._versioni[n];
            // 🔴 `null` NON e` "assente": e` "il file non sa la propria
            // versione". E` il caso su cui vogliamo attenzione, quindi si
            // stampa in evidenza invece di scomparire in una riga vuota.
            // Una meta` che tace e` piu` insidiosa di una che mente.
            if (v.versione === null || v.versione === undefined) {
                daVerificare.push(n);
                console.warn('  ' + n.padEnd(30) + '⚠️ DA VERIFICARE (il file non dichiara una versione)' +
                             (v.proprieta ? '   [' + v.proprieta + ']' : ''));
            } else {
                console.log('  ' + n.padEnd(30) + v.versione + (v.proprieta ? '   [' + v.proprieta + ']' : ''));
            }
        });

        const distinte = [];
        nomi.forEach(function (n) {
            const v = M._versioni[n].versione;
            if (v && distinte.indexOf(v) < 0) distinte.push(v);
        });
        if (distinte.length > 1) {
            console.warn('⚠️ Versioni diverse fra i file: ' + distinte.join(', ') +
                         '. Verificare che il contesto del progetto sia aggiornato.');
        }
        if (daVerificare.length > 0) {
            console.warn('⚠️ ' + daVerificare.length + ' file senza versione dichiarata. ' +
                         'Chiamare MotoreN5.verificaSorgenti() per leggerla dalle intestazioni.');
        }
        return M._versioni;
    };

    // Legato a M.VERSIONE, non scritto a mano: un numero copiato diverge alla
    // prima modifica, ed e` esattamente quello che verificaSorgenti() ha appena
    // trovato qui dentro.
    M.dichiaraVersione('motore_regole_n5.js', M.VERSIONE, 'MOTORE');

    // Raccoglie le versioni dei file caricati PRIMA del motore — il catalogo
    // e i database, che vengono per forza prima perche` il motore li legge.
    if (Array.isArray(G.__versioniN5)) {
        G.__versioniN5.forEach(function (v) { M.dichiaraVersione(v.file, v.versione, v.proprieta); });
        G.__versioniN5 = [];
    }


    // ==================================================================
    // VERIFICA DELLE VERSIONI ALLA FONTE
    // ------------------------------------------------------------------
    // Le dichiarazioni dicono cosa un file CREDE di essere. L'intestazione
    // dice cosa il file E`. Sono due cose diverse, e la seconda e` quella
    // che conta: un numero scritto a mano nella dichiarazione puo` restare
    // indietro rispetto alla riga in testa.
    //
    // Il motore legge le intestazioni DEI SORGENTI e le confronta. Prende
    // anche i file che non dichiarano nulla, che e` il motivo per cui e`
    // preferibile al gancio dentro ogni file.
    //
    // 🔴 E calcola un'IMPRONTA del contenuto. Le intestazioni da sole non
    // bastano: il caso "X Visor" era due copie con la STESSA versione e
    // contenuto diverso — un trattino diventato spazio in 38 profili, a
    // parita` di dimensione e numero di righe. Confrontando le impronte
    // due copie divergenti si vedono anche quando il numero non e` salito.
    // ==================================================================

    // Impronta corta e stabile. Non e` crittografica: serve a dire "questi
    // due file sono diversi", non a resistere a una manomissione.
    M.improntaTesto = function (testo) {
        let h1 = 0x811c9dc5, h2 = 0x01000193;
        const t = String(testo || '');
        for (let i = 0; i < t.length; i++) {
            const c = t.charCodeAt(i);
            h1 = ((h1 ^ c) * 0x01000193) >>> 0;
            h2 = ((h2 + c) * 0x85ebca6b) >>> 0;
        }
        return (h1.toString(16).padStart(8, '0') + h2.toString(16).padStart(8, '0')) +
               '-' + t.length;
    };

    M.leggiIntestazione = function (testo) {
        const m = /@versione\s+([^\s|]+)\s*\|\s*([^\s|]+)/.exec(String(testo || '').slice(0, 400));
        return m ? { versione: m[1], file: m[2] } : null;
    };


    // Quali file sono caricati. Nel browser lo dicono i tag <script src>,
    // quindi non serve un elenco scritto a mano che invecchia.
    M.fileCaricati = function () {
        if (typeof document !== 'undefined' && document.querySelectorAll) {
            return Array.prototype.slice.call(document.querySelectorAll('script[src]'))
                .map(function (t) { return t.getAttribute('src'); })
                .filter(function (u) { return u && !/^https?:\/\/(cdn|unpkg|cdnjs)/i.test(u); });
        }
        return Object.keys(M._versioni);
    };

    // Il controllo completo. Asincrono perche` nel browser deve leggere i
    // sorgenti. Restituisce l'elenco dei problemi, vuoto se tutto torna.
    M.verificaVersioni = function () {
        const files = M.fileCaricati();
        const esiti = [];

        function analizza(url, testo) {
            const nome = String(url).split('/').pop();
            const intest = M.leggiIntestazione(testo);
            const dich = M._versioni[nome] || M._versioni[url] || null;
            return {
                file: nome,
                versioneIntestazione: intest ? intest.versione : null,
                versioneDichiarata: dich ? dich.versione : null,
                proprieta: dich ? dich.proprieta : null,
                impronta: M.improntaTesto(testo),
                senzaIntestazione: !intest,
                // 🔴 null NON e` "assente": e` "da verificare", e va stampato.
                daVerificare: !intest || (dich && dich.versione === null),
                discorde: !!(intest && dich && dich.versione && intest.versione !== dich.versione),
                nomeDiscorde: !!(intest && intest.file && intest.file !== nome)
            };
        }

        // --- Node: lettura diretta ---
        if (typeof require === 'function' && typeof process !== 'undefined') {
            const fs = require('fs');
            files.forEach(function (f) {
                try { esiti.push(analizza(f, fs.readFileSync(f, 'utf8'))); }
                catch (e) { esiti.push({ file: f, errore: e.message, daVerificare: true }); }
            });
            return Promise.resolve(M._rapportoVersioni(esiti));
        }

        // --- browser: fetch dei sorgenti gia` caricati ---
        if (typeof fetch !== 'function') {
            return Promise.resolve(M._rapportoVersioni([], [
                'Il browser non espone fetch: impossibile leggere i sorgenti.'
            ]));
        }
        return Promise.all(files.map(function (f) {
            return fetch(f).then(function (r) { return r.text(); })
                .then(function (t) { return analizza(f, t); })
                .catch(function (e) {
                    // Aprendo le pagine da file:// il fetch e` bloccato dal
                    // browser: va detto, non fatto sparire.
                    return { file: String(f).split('/').pop(), errore: e.message, daVerificare: true };
                });
        })).then(function (r) { return M._rapportoVersioni(r); });
    };

    M._rapportoVersioni = function (esiti, avvisiExtra) {
        const problemi = [];
        const daFile = (typeof location !== 'undefined' && /^file:/.test(location.protocol));

        esiti.forEach(function (e) {
            if (e.errore) {
                problemi.push(`${e.file}: sorgente non leggibile (${e.errore})` +
                    (daFile ? ' — le pagine aperte da file:// bloccano fetch: servirle da un server locale.' : ''));
                return;
            }
            if (e.discorde) {
                problemi.push(`${e.file}: l'intestazione dice ${e.versioneIntestazione}, la dichiarazione ${e.versioneDichiarata}.`);
            }
            if (e.senzaIntestazione) {
                problemi.push(`${e.file}: nessuna riga @versione — DA VERIFICARE.`);
            } else if (e.versioneDichiarata === null) {
                problemi.push(`${e.file}: versione ${e.versioneIntestazione} letta dall'intestazione, ma il file non la dichiara — DA VERIFICARE.`);
            }
            if (e.nomeDiscorde) {
                problemi.push(`${e.file}: l'intestazione porta il nome "${e.versioneIntestazione}" di un altro file — copia rinominata?`);
            }
        });
        (avvisiExtra || []).forEach(function (a) { problemi.push(a); });

        // Versioni diverse fra file: il segnale che il contesto e` disallineato.
        const distinte = [];
        esiti.forEach(function (e) {
            const v = e.versioneIntestazione;
            if (v && distinte.indexOf(v) < 0) distinte.push(v);
        });

        const rapporto = { file: esiti, problemi: problemi, versioniDistinte: distinte };

        console.log('── verifica versioni (dalle intestazioni dei sorgenti) ──');
        esiti.forEach(function (e) {
            if (e.errore) { console.log('  ' + String(e.file).padEnd(30) + '⚠️ illeggibile'); return; }
            const v = e.versioneIntestazione || 'DA VERIFICARE';
            console.log('  ' + e.file.padEnd(30) + v.padEnd(16) +
                        (e.impronta ? e.impronta.slice(0, 12) : '') +
                        (e.proprieta ? '  [' + e.proprieta + ']' : ''));
        });
        if (distinte.length > 1) {
            console.warn('⚠️ Versioni diverse fra i file: ' + distinte.join(', ') +
                         '. Il contesto del progetto potrebbe non essere aggiornato.');
        }
        if (problemi.length) { console.warn('⚠️ ' + problemi.length + ' problemi:'); problemi.forEach(function (p) { console.warn('   ' + p); }); }
        else console.log('  nessun problema.');
        return rapporto;
    };


    // ==================================================================
    // LETTURA DELLE INTESTAZIONI DAI SORGENTI
    // ------------------------------------------------------------------
    // Nel browser un commento non e` leggibile a runtime: un file non puo`
    // conoscere la propria intestazione. Puo` pero` leggerla il motore,
    // rifacendo il fetch del sorgente gia` scaricato — costa nulla, e` in
    // cache.
    //
    // Si enumerano i <script src> invece di tenere una lista: cosi` si
    // prendono anche i file che non dichiarano niente, che sono proprio
    // quelli su cui serve attenzione.
    //
    // E gia` che il sorgente e` in mano, se ne calcola l'IMPRONTA. Serve a
    // smascherare il caso che la sola versione non prende: contenuto
    // cambiato e numero fermo. E` successo davvero — due copie dei database
    // identiche per dimensione e numero di righe, diverse in 38 profili
    // per un trattino diventato spazio.
    // ==================================================================

    // Impronta del contenuto. Non e` crittografia: serve solo a dire
    // "questi due file sono diversi", e per quello basta.
    M.impronta = function (testo) {
        let h = 5381;
        const t = String(testo || '');
        for (let i = 0; i < t.length; i++) h = ((h * 33) ^ t.charCodeAt(i)) >>> 0;
        return h.toString(16).padStart(8, '0') + '.' + t.length;
    };

    M.leggiIntestazione = function (testo) {
        const m = /@versione\s+([^\s|]+)\s*\|\s*([^|]+?)\s*\|\s*proprieta`?\s*:\s*([^\n>*-]+)/i
            .exec(String(testo || '').slice(0, 400));
        if (!m) return null;
        return { versione: m[1].trim(), file: m[2].trim(), proprieta: m[3].trim() };
    };

    // Il gancio chiesto dalla chat INTERFACCIA. Sincrono, quindi risponde
    // solo se il sorgente e` gia` stato letto da verificaSorgenti().
    M._sorgenti = {};
    M.versioneDaIntestazione = function (nomeFile) {
        const v = M._sorgenti[nomeFile];
        return v ? v.versione : null;
    };

    // Legge TUTTI i sorgenti caricati e confronta con quanto dichiarato.
    // Asincrona: restituisce una Promise.
    // 🔴 I file che il progetto CONTIENE, non quelli che questa pagina carica.
    // Enumerare document.scripts prende solo cio` che la pagina usa: l'Hub
    // non carica i database di fazione, quindi un database stantio caricato
    // solo dall'app giocatore non comparirebbe MAI nella verifica fatta
    // dall'Hub. E "3 sorgenti, tutto coincide" si legge come "tutto
    // verificato" quando significa "verificato un terzo".
    // ⚠️ Questa lista e` scritta a mano, quindi eredita il difetto che
    // document.scripts evitava: un file nuovo che nessuno aggiunge resta
    // invisibile a entrambi i controlli.
    // Per questo NON si usa da sola: M.fileAttesi() la unisce ai file che
    // si sono dichiarati e a quelli che la pagina ha caricato. Cosi` la
    // lista e` un MINIMO, non un massimo — un file nuovo compare da solo
    // appena dichiara la propria versione o viene caricato, e questa resta
    // utile solo per i file che NON fanno ne` l'una ne` l'altra cosa,
    // cioe` quelli che mancano davvero.
    M.FILE_ATTESI_MINIMI = [
        'catalogo_n5.js', 'motore_regole_n5.js', 'calcolatore_math.js', 'motore_core.js',
        'database_comune.js', 'database_nomad.js', 'database_panoceania.js',
        'logica_aro.js', 'logica_stati.js', 'fireteam.js', 'fase_schieramento.js',
        'ordine_attacco_bs.js', 'ordine_attacco_cc.js', 'ordine_attacco_guidato.js',
        'ordine_attacco_intuitivo.js', 'ordine_coordinato.js', 'ordine_difesa.js',
        'ordine_fuoco_speculativo.js', 'ordine_hacking.js', 'ordine_movimento.js',
        'ordine_scoprire.js', 'ordine_supporto.js', 'calcolatore_controller.js',
        'roster_manager.js'
    ];

    // L'insieme vero dei file attesi: lista minima + chi si e` dichiarato +
    // chi la pagina ha caricato. Le tre fonti si coprono a vicenda.
    M.fileAttesi = function () {
        const insieme = (M.FILE_ATTESI_MINIMI || []).slice();
        function aggiungi(n) { if (n && insieme.indexOf(n) < 0) insieme.push(n); }

        Object.keys(M._versioni || {}).forEach(aggiungi);

        if (typeof document !== 'undefined' && document.scripts) {
            Array.prototype.slice.call(document.scripts).forEach(function (sc) {
                if (sc.src) aggiungi(String(sc.src).split('/').pop().split('?')[0]);
            });
        }

        // QUARTA fonte, solo in Node: l'elenco della cartella. Prende TUTTO,
        // compresi i file che nessuno carica e che non si dichiarano — il
        // buco che le altre tre non coprono. Nel browser non e` possibile,
        // ed e` la ragione per cui FILE_ATTESI_MINIMI continua a servire li`.
        if (typeof require === 'function' && typeof document === 'undefined') {
            try {
                require('fs').readdirSync('.').forEach(function (f) {
                    if (/\.js$/.test(f) && !/^test_/.test(f)) aggiungi(f);
                });
            } catch (e) { /* non in Node, o cartella non leggibile */ }
        }
        // 🔴 I file IMMUTABILI entrano sempre nella verifica di default. Prima
        // fileAttesi raccoglieva solo i .js che servono alla pagina, e l'Hub
        // originale non c'era: il controllo d'impronta esisteva, ma nessuno lo
        // chiamava sul file da sorvegliare. (In browser la verifica guarda gli
        // script della pagina: lì questi file non si controllano.)
        Object.keys(M.FILE_IMMUTABILI || {}).forEach(function (f) {
            if (insieme.indexOf(f) < 0) insieme.push(f);
        });
        return insieme.sort();
    };

    // File che NON devono cambiare: per loro il numero di versione non ha
    // senso, conta l'impronta. Un'impronta diversa non e` "da aggiornare",
    // e` "qualcuno l'ha toccato".
    // Nota: un file immutabile NON riceve nemmeno l'intestazione @versione.
    // Aggiungergliela ne cambierebbe l'impronta, cioe` la cosa stessa che si
    // vuole sorvegliare. L'ho fatto per sbaglio e me ne sono accorto subito:
    // il file va lasciato intatto, e a dichiararlo e` questa riga.
    M.FILE_IMMUTABILI = {
        'calcolatore_math_ORIGINALE.js': 'b645db85.34940',
        // Il testo del regolamento e` una FONTE: non deve cambiare mai. Se la
        // sua impronta cambia, ogni riga citata nei commenti puo` essere
        // sbagliata. (Suggerito dalla chat DATABASE, 21 settembre.)
        'REGOLE_N5_v5_1_1.txt': '5ea7581f.904498'
    };

    // Retrocompatibilita`: chi leggeva M.FILE_ATTESI continua a funzionare.
    Object.defineProperty(M, 'FILE_ATTESI', { get: function () { return M.fileAttesi(); } });

    M.verificaSorgenti = function (elencoFile) {
        const G2 = G;
        let elenco = elencoFile;

        // Browser: si chiede alla pagina quali script ha caricato.
        if (!elenco && typeof document !== 'undefined' && document.scripts) {
            elenco = Array.prototype.slice.call(document.scripts)
                .map(function (sc) { return sc.src; })
                .filter(Boolean);
        }
        // Senza elenco esplicito si verificano ESATTAMENTE i file attesi:
        // né più né meno. Leggere tutta la cartella tirava dentro anche i
        // file di collaudo e gli scratch, e il riepilogo annegava in righe
        // "nessuna intestazione" che non riguardavano il progetto.
        if (!elenco) elenco = M.fileAttesi();
        elenco = (elenco || []).filter(Boolean);

        function leggi(percorso) {
            if (typeof fetch === 'function' && /^https?:|^\//.test(percorso)) {
                return fetch(percorso).then(function (r) { return r.text(); });
            }
            try {
                const fs = require('fs');
                return Promise.resolve(fs.readFileSync(percorso, 'utf8'));
            } catch (e) { return Promise.resolve(null); }
        }

        return Promise.all(elenco.map(function (percorso) {
            const nome = String(percorso).split('/').pop().split('?')[0];
            return leggi(percorso).then(function (testo) {
                // Un file che non si legge non ha impronta: si toglie quella del
                // giro precedente, altrimenti il riepilogo la mostrava ancora per
                // un file che non c'e`. (Chat TEST, 21 settembre.)
                if (testo === null) { delete M._sorgenti[nome]; return { nome: nome, errore: 'non leggibile' }; }
                const intest = M.leggiIntestazione(testo);
                const imp = M.impronta(testo);
                M._sorgenti[nome] = {
                    versione: intest ? intest.versione : null,
                    proprieta: intest ? intest.proprieta : null,
                    impronta: imp
                };
                return { nome: nome, intestazione: intest, impronta: imp };
            });
        })).then(function (letti) {
            const problemi = [];
            letti.forEach(function (r) {
                if (r.errore) {
                    problemi.push(`${r.nome}: ${r.errore} — atteso ma non presente?`);
                    return;
                }
                // Immutabile: si controlla l'impronta, non la versione.
                const attesa = (M.FILE_IMMUTABILI || {})[r.nome];
                if (attesa) {
                    if (r.impronta !== attesa) {
                        problemi.push(`${r.nome}: IMMUTABILE ma l'impronta è cambiata ` +
                                      `(attesa ${attesa}, trovata ${r.impronta}). Qualcuno l'ha modificato.`);
                    }
                    return;
                }
                if (!r.intestazione) {
                    problemi.push(`${r.nome}: nessuna intestazione @versione nel sorgente.`);
                    return;
                }
                // Il nome nell'intestazione deve essere quello del file:
                // una riga copiata da un altro file e non aggiornata si vede qui.
                if (r.intestazione.file !== r.nome) {
                    problemi.push(`${r.nome}: l'intestazione dice "${r.intestazione.file}" — riga copiata da un altro file?`);
                }
                const dich = M._versioni[r.nome];
                if (dich && dich.versione && dich.versione !== r.intestazione.versione) {
                    problemi.push(`${r.nome}: dichiara ${dich.versione} ma l'intestazione dice ${r.intestazione.versione}.`);
                }
                // Colma i null: il file non sapeva la propria versione, ora si`.
                if (dich && !dich.versione) {
                    dich.versione = r.intestazione.versione;
                    if (!dich.proprieta) dich.proprieta = r.intestazione.proprieta;
                }
            });

            const lettiNomi = letti.map(function (r) { return r.nome; });

            // Attesi ma non letti: questa pagina non li carica, oppure
            // mancano dal progetto. In entrambi i casi NON sono verificati,
            // e dirlo e` il punto: senza questa riga "tutto coincide"
            // significherebbe "coincide quel che ho guardato".
            const attesi = M.fileAttesi();
            const nonLetti = attesi.filter(function (f) {
                return lettiNomi.indexOf(f) < 0;
            });
            // Dichiarati (quindi caricati) ma non letti dalla verifica.
            const dichiaratiNonLetti = Object.keys(M._versioni).filter(function (f) {
                return lettiNomi.indexOf(f) < 0;
            });

            console.log('── sorgenti letti: ' + letti.length + ' su ' +
                        attesi.length + ' attesi ──');
            Object.keys(M._sorgenti).sort().forEach(function (n) {
                const v = M._sorgenti[n];
                console.log('  ' + n.padEnd(30) +
                            String(v.versione || '⚠️ SENZA INTESTAZIONE').padEnd(18) +
                            'impronta ' + v.impronta);
            });

            if (nonLetti.length) {
                console.warn('⚠️ NON verificati (' + nonLetti.length + '): ' + nonLetti.join(', '));
                console.warn('   Questa pagina non li carica, o mancano dal progetto. ' +
                             'Un file stantio qui dentro non verrebbe visto.');
            }
            if (dichiaratiNonLetti.length) {
                console.warn('⚠️ Dichiarati ma non riletti dal sorgente: ' + dichiaratiNonLetti.join(', '));
            }

            if (problemi.length) {
                console.warn('⚠️ ' + problemi.length + ' problemi:');
                problemi.forEach(function (p) { console.warn('   ' + p); });
            } else if (nonLetti.length === 0) {
                console.log('✅ tutti i file attesi verificati: intestazioni e dichiarazioni coincidono.');
            } else {
                console.log('✅ i ' + letti.length + ' file letti coincidono — ma ' +
                            nonLetti.length + ' non sono stati verificati.');
            }
            return {
                sorgenti: M._sorgenti,
                problemi: problemi,
                letti: lettiNomi,
                nonLetti: nonLetti,
                completa: nonLetti.length === 0 && problemi.length === 0
            };
        });
    };

    // Confronto fra due installazioni: si scambiano le impronte, non i file.
    // Stessa versione e impronta diversa = copie divergenti, che e`
    // esattamente il caso che il solo numero di versione non prende.
    M.improntaProgetto = function () {
        const nomi = Object.keys(M._sorgenti).sort();
        if (nomi.length === 0) return null;
        return {
            file: nomi.length,
            impronte: nomi.map(function (n) { return n + '=' + M._sorgenti[n].impronta; }).join('\n'),
            complessiva: M.impronta(nomi.map(function (n) { return M._sorgenti[n].impronta; }).join('|'))
        };
    };


    // ==================================================================
    // LEGGERE UN ESITO
    // ------------------------------------------------------------------
    // Il motore usa TRE nomi per il campo booleano di un giudizio, e non
    // sono intercambiabili a caso — ognuno risponde a una domanda diversa:
    //
    //   ok       "questa cosa e` valida?"      creaAttacco, creaPayload,
    //                                          validaCoordinato
    //   puo      "questa truppa puo` ...?"     puoRicevereOrdine,
    //                                          puoEntrareInFireteam
    //   ammesso  "questa voce e` ammessa?"     bersagliValidi,
    //                                          azioniAroPossibili,
    //                                          bersagliSupporto
    //
    // La distinzione ha un senso, ma NON si indovina. Chi legge il campo
    // sbagliato ottiene `undefined`, che in JavaScript e` falso: il
    // risultato e` "nessuno puo` fare niente", plausibile e silenzioso.
    // E` successo davvero, ed e` stato preso solo perche` chi lo leggeva
    // non si e` fidato della frase e ha aperto il codice.
    //
    // M.esito() toglie la necessita` di indovinare: legge quello che c'e`
    // e SOLLEVA un'eccezione se non ce n'e` nessuno, invece di restituire
    // un falso che passa per risposta.
    //
    // ⚠️ Sollevare e` giusto mentre si scrive il codice, ed e` pessimo al
    // tavolo: un'eccezione non catturata pianta la schermata a meta`
    // dichiarazione. Per questo il router in motore_core.js avvolge ogni
    // chiamata ai moduli in un try/catch, e chi lavora a runtime puo` usare
    // M.esitoOppure(risultato, valore), che non solleva mai.
    // ==================================================================

    // Variante che NON solleva: per i percorsi a runtime dove fermarsi
    // costa piu` di sbagliare. Restituisce il valore indicato e lo dice in
    // console, invece di piantare la schermata a meta` dichiarazione.
    M.esitoOppure = function (risultato, valorePredefinito) {
        try {
            return M.esito(risultato);
        } catch (e) {
            console.warn('MotoreN5.esitoOppure(): ' + e.message +
                         ' — uso il valore predefinito (' + valorePredefinito + ').');
            return valorePredefinito;
        }
    };

    M.esito = function (risultato) {
        if (!risultato || typeof risultato !== 'object') {
            throw new Error('MotoreN5.esito(): atteso un oggetto risultato, ricevuto ' + typeof risultato);
        }
        if (typeof risultato.ok === 'boolean') return risultato.ok;
        if (typeof risultato.puo === 'boolean') return risultato.puo;
        if (typeof risultato.ammesso === 'boolean') return risultato.ammesso;
        if (typeof risultato.valido === 'boolean') return risultato.valido;

        throw new Error('MotoreN5.esito(): nessun campo di giudizio in questo risultato. ' +
            'Attesi ok | puo | ammesso | valido, trovati: ' + Object.keys(risultato).join(', '));
    };

    // Il motivo del diniego, con lo stesso criterio.
    M.motivoEsito = function (risultato) {
        if (!risultato || typeof risultato !== 'object') return null;
        if (risultato.motivo) return risultato.motivo;
        if (Array.isArray(risultato.blocchi) && risultato.blocchi.length) {
            return risultato.blocchi[0].motivo || risultato.blocchi[0];
        }
        if (Array.isArray(risultato.errori) && risultato.errori.length) {
            return risultato.errori[0].messaggio || risultato.errori[0];
        }
        return null;
    };


    // ==================================================================
    // NOMI CANONICI DEI DATI
    // ------------------------------------------------------------------
    // I nomi globali che il motore legge. Uno solo per ciascun dato: un
    // ripiego a un nome alternativo non risolve l'incertezza, la nasconde
    // — e se un domani i due nomi puntassero a due copie diverse
    // prenderebbe silenziosamente la prima disponibile.
    //
    // E` successo: roster_manager.js cercava DB_PANO, che nessun file
    // definisce, e l'app PanOceania non trovava il database pur avendo il
    // file regolarmente collegato.
    // ==================================================================

    // ⚠️ L'elenco deve essere COMPLETO. Un elenco parziale e` peggio di
    // nessun elenco: fa sembrare esaustivo un controllo che copre una parte,
    // e chi cura i nomi segnalati crede di aver finito mentre gli altri sono
    // ancora `undefined`. Prima qui c'erano 6 nomi su 12.
    M.NOMI_DATI = {
        // --- catalogo ---
        catalogo:      { nome: 'CATALOGO_N5',          file: 'catalogo_n5.js' },
        // --- armi e munizioni ---
        armi:          { nome: 'RULES_WEAPONS',        file: 'database_comune.js' },
        aliasArmi:     { nome: 'RULES_WEAPONS_ALIAS',  file: 'database_comune.js' },
        // RULES_AMMO rimossa da database_comune.js (chat DATABASE, giro del 21
        // settembre): duplicava CATALOGO_N5.MUNIZIONI, conteneva un errore che il
        // catalogo non ha (T2 con saves: 2), e nessun modulo la leggeva. Tenerla
        // qui faceva segnalare a verificaDati() una lacuna che non esiste.
        // --- scenario ---
        deployables:   { nome: 'DB_DEPLOYABLES',       file: 'database_comune.js' },
        strutture:     { nome: 'DB_STRUTTURE',         file: 'database_comune.js' },
        terreni:       { nome: 'DB_TERRENI',           file: 'database_comune.js' },
        trattiTerreno: { nome: 'TRATTI_TERRENO',       file: 'database_comune.js' },
        // --- roster ---
        rosterPano:    { nome: 'DB_PANOCEANIA',        file: 'database_panoceania.js' },
        rosterNomadi:  { nome: 'DB_NOMADI',            file: 'database_nomad.js' }
    };

    // Le FUNZIONI globali si verificano con typeof === 'function': la sola
    // presenza non basta, perche` una variabile omonima definita altrove
    // passerebbe il controllo.
    M.FUNZIONI_DATI = {
        opzioniTerreni: {
            nome: 'generaOpzioniTerreni', file: 'database_comune.js',
            firma: '(terrenoSelezionato)'
        },
        modTerreno: {
            nome: 'applicaModTerreno', file: 'database_comune.js',
            // Sei argomenti posizionali. `bersaglio` (sesto): true quando chi
            // tira e` il BERSAGLIO che risponde all'attaccante — cambia la
            // Zona Zero e il Rumore Bianco. (database_comune.js 2026-09-21.1)
            // Qui c'era scritto che "una chiamata a quattro argomenti tratta
            // come privi di visore i profili con MSV L3": era falso, trattiTiro
            // passa gia` msv2 = msv3 || ... — e insegnava la regola errata.
            // ⚠️ Sei booleani di fila: un'inversione (bersaglio / hasMSV3) non
            // la prende verificaFirme, che guarda solo la lunghezza.
            // Dalla 2026-09-21.3 accetta anche un oggetto come secondo argomento,
            // ed e` la forma che usa il motore.
            firma: '(terrainId, hasMSV1, hasMSV2, hasMarksmanship, hasMSV3, bersaglio) | (terrainId, { msv1, msv2, msv3, marksmanship, bersaglio })',
            argomenti: 6
        }
    };

    // Quali dati attesi mancano davvero. Dice il nome CANONICO, cosi` chi
    // legge l'errore non va a cercare un sinonimo che non esiste.
    M.datiMancanti = function () {
        const fuori = [];
        Object.keys(M.NOMI_DATI).forEach(function (k) {
            const v = M.NOMI_DATI[k];
            if (G[v.nome] === undefined) fuori.push({ dato: k, nome: v.nome, file: v.file, tipo: 'dato' });
        });
        Object.keys(M.FUNZIONI_DATI).forEach(function (k) {
            const v = M.FUNZIONI_DATI[k];
            if (typeof G[v.nome] !== 'function') {
                fuori.push({ dato: k, nome: v.nome, file: v.file, tipo: 'funzione',
                             dettaglio: G[v.nome] === undefined
                                 ? 'assente'
                                 : 'presente ma non e` una funzione (' + typeof G[v.nome] + ')' });
            }
        });
        return fuori;
    };

    // Le funzioni globali accettano abbastanza argomenti? Una firma piu`
    // corta della nostra non da` errore in JavaScript: passa i parametri in
    // meno come `undefined` e restituisce un risultato sbagliato in silenzio.
    // E` capitato con applicaModTerreno, chiamata a 4 argomenti su 5.
    M.verificaFirme = function () {
        const problemi = [];
        Object.keys(M.FUNZIONI_DATI).forEach(function (k) {
            const v = M.FUNZIONI_DATI[k];
            const f = G[v.nome];
            if (typeof f !== 'function' || !v.argomenti) return;
            if (f.length < v.argomenti) {
                problemi.push(`${v.nome}: accetta ${f.length} argomenti, attesi ${v.argomenti} — firma ${v.firma}.`);
            }
        });
        return problemi;
    };

    M.verificaDati = function () {
        const fuori = M.datiMancanti();
        const firme = M.verificaFirme();
        if (fuori.length === 0 && firme.length === 0) {
            console.log('✅ tutti i ' +
                (Object.keys(M.NOMI_DATI).length + Object.keys(M.FUNZIONI_DATI).length) +
                ' nomi canonici sono presenti, con le firme attese.');
            return { ok: true, mancanti: [], firme: [] };
        }
        if (firme.length) {
            console.warn('⚠️ firme non conformi:');
            firme.forEach(function (p) { console.warn('   ' + p); });
        }
        if (fuori.length === 0) return { ok: false, mancanti: [], firme: firme };
        console.warn('⚠️ dati mancanti (' + fuori.length + '):');
        fuori.forEach(function (f) {
            console.warn('   ' + f.nome + '  [' + f.tipo + ', da ' + f.file + ']' +
                         (f.dettaglio ? ' — ' + f.dettaglio : '') +
                         ' — nome canonico, non cercare sinonimi.');
        });
        // Se manca un file, mancano TUTTI i suoi nomi: si dice, così chi
        // cura i primi due non crede di aver finito.
        const perFile = {};
        fuori.forEach(function (f) { (perFile[f.file] = perFile[f.file] || []).push(f.nome); });
        Object.keys(perFile).forEach(function (file) {
            const totali = Object.keys(M.NOMI_DATI).filter(k => M.NOMI_DATI[k].file === file).length +
                           Object.keys(M.FUNZIONI_DATI).filter(k => M.FUNZIONI_DATI[k].file === file).length;
            if (perFile[file].length === totali && totali > 1) {
                console.warn('   → mancano TUTTI i ' + totali + ' nomi di ' + file +
                             ': probabilmente il file non è caricato.');
            }
        });
        return { ok: false, mancanti: fuori, firme: firme };
    };


    // ==================================================================
    // PARTE 31: SCENOGRAFIA
    // ------------------------------------------------------------------
    // Torrette, console, antenne, porte. Due cose le distinguono dal
    // roster:
    //
    // 1. Sono NEUTRE: non si filtrano per fazione, entrambi i giocatori
    //    possono agirci. Per questo non entrano da rosterNemico().
    //
    // 2. La loro bersagliabilita` dipende dai TRATTI, non dall'essere
    //    strutture. Una Console e` bersaglio di Hacking e non di un Combi
    //    Rifle; una Porta Bulkhead solo di Anti-materiel; il Tech-Coffin
    //    di nessun attacco. Offrirle tutte a tutte le azioni darebbe per
    //    buono un bersaglio che le regole non ammettono.
    // ==================================================================

    // Tutta la scenografia sul tavolo, da entrambe le parti.
    M.scenografia = function () {
        const s = statoGioco();
        const sc = (s && s.scenario) || {};
        const out = [];
        ['nomads', 'panoceania'].forEach(function (fonte) {
            const v = sc[fonte];
            if (!v || !Array.isArray(v.strutture)) return;
            v.strutture.forEach(function (st) {
                if (!st) return;
                out.push(Object.assign({}, st, { fonteScenario: fonte, neutrale: true }));
            });
        });
        return out;
    };

    M.eScenografia = function (u) {
        if (!u) return false;
        if (u.neutrale === true) return true;
        if (u.scenografia === true) return true;   // gettone-struttura (Deployable Cover)
        const t = String(u.tipo || '').toUpperCase();
        // 🔴 Solo STRUTTURA. Niente torrette neutrali (decisione di Paolo): la
        // Armed Turret e` un Deployable del PROPRIETARIO, non scenografia che
        // entrambi possono usare. (Chat REGOLE, righe 6483-6510.)
        return t === 'STRUTTURA';
    };

    // I Tratti di un elemento scenico, normalizzati.
    M.trattiScenografia = function (u) {
        const testo = ((u && u.skills) || '') + ', ' + ((u && u.equip) || '');
        const C = catalogo('SCENOGRAFIA').tratti || {};
        return Object.keys(C).filter(function (nome) {
            // "Indestructible (Opzionale)" e "Repeater (Objective)" vanno presi
            // dal nome base, non dalla stringa intera.
            return testo.toUpperCase().indexOf(nome.toUpperCase()) >= 0;
        });
    };

    // Questo elemento e` bersaglio valido per quest'azione?
    M.scenografiaBersagliabile = function (u, azione, opzioni) {
        opzioni = opzioni || {};
        const C = catalogo('SCENOGRAFIA');
        const tratti = M.trattiScenografia(u);
        // 🔴 L'azione si confronta in forma CANONICA, su entrambi i lati. Il
        // catalogo scrive le etichette del menu ('ATTACCO CC'), il motore usa
        // gli id di M.AZIONI — e quelli non sono uniformi: BS_ATTACK vale
        // 'ATTACCO BS', CC_ATTACK vale 'CC_ATTACK'. Col confronto grezzo
        // 'CC_ATTACK' non trovava 'ATTACCO CC', e una struttura attaccabile
        // in mischia veniva respinta se il modulo passava l'id del motore.
        // I test passavano perche` usavano l'etichetta. (Chat TEST, 22 sett.)
        const canon = function (x) { return M.azioneCanonica(x) || String(x || '').toUpperCase(); };
        const az = canon(azione);
        const contiene = function (lista) { return (lista || []).map(canon).indexOf(az) >= 0; };
        const note = [];

        function voce(t) { return (C.tratti || {})[t] || {}; }

        // 1. I divieti vengono prima di tutto: Indestructible batte il resto.
        for (let i = 0; i < tratti.length; i++) {
            const v = voce(tratti[i]);
            if (Array.isArray(v.vieta) && contiene(v.vieta)) {
                return { ammesso: false, tratti: tratti,
                         motivo: `${tratti[i]}: ${v.nota || 'azione non ammessa.'}` };
            }
        }

        // 2. Munizione obbligatoria: Anti-Materiel Only.
        const soloAM = tratti.filter(function (t) { return voce(t).richiedeMunizione; });
        if (soloAM.length > 0 && contiene(['ATTACCO BS', 'ATTACCO CC', 'FUOCO SPECULATIVO',
                                            'ATTACCO GUIDATO', 'ATTACCO INTUITIVO'])) {
            const v = voce(soloAM[0]);
            const arma = opzioni.arma || null;
            const mun = String((opzioni.ammo || (arma && arma.ammo) || '')).toUpperCase();
            const haAM = (v.richiedeMunizione || []).some(function (x) { return mun.indexOf(x) >= 0; }) ||
                         (arma && (v.richiedeTratto || []).some(function (x) { return M.haTratto(arma, x); }));
            if (!haAM) {
                return { ammesso: false, tratti: tratti,
                         motivo: `${soloAM[0]}: ${v.nota}` +
                                 (arma ? ` L'arma scelta (${arma.nome}) non lo è.` : '') };
            }
            note.push(`${soloAM[0]}: l'attacco passa perché l'arma è Anti-materiel.`);
        }

        // 3. Un Tratto che ammette esplicitamente quest'azione.
        const ammessa = tratti.some(function (t) {
            const v = voce(t);
            return Array.isArray(v.ammette) && contiene(v.ammette);
        });
        if (ammessa) return { ammesso: true, tratti: tratti, note: note };

        // 4. Una TORRETTA con un'arma si comporta come una truppa: ha ARM,
        //    BTS e STR, quindi la si attacca come tale.
        // 🔴 Con `weapon: null` e `armaDalProfilo: true` la torretta sembrava
        // disarmata, e non passava questo ramo. Conta come armata anche se
        // l'arma la dichiara il profilo, o se ha un'arma da mischia.
        const armaSua = String((u && u.weapon) || '').trim();
        const armata = (armaSua && armaSua !== '-' && armaSua !== 'null') ||
                       !!(u && u.armaDalProfilo) ||
                       !!M.armaCCStruttura(u);
        const eTorretta = String((u && u.tipo) || '').toUpperCase() === 'TORRETTA';
        if (eTorretta && armata &&
            contiene(['ATTACCO BS', 'ATTACCO CC', 'FUOCO SPECULATIVO', 'ATTACCO GUIDATO',
                      'ATTACCO INTUITIVO', 'SCOPRIRE'])) {
            note.push(C.torrettaComeTruppa);
            return { ammesso: true, tratti: tratti, note: note };
        }

        // 5. Nessun Tratto la ammette: si dice quali azioni la ammetterebbero.
        const azioniPossibili = [];
        tratti.forEach(function (t) {
            (voce(t).ammette || []).forEach(function (a) {
                if (azioniPossibili.indexOf(a) < 0) azioniPossibili.push(a);
            });
        });
        return {
            ammesso: false, tratti: tratti,
            motivo: tratti.length === 0
                ? 'Elemento scenico senza Tratti che ne permettano il bersagliamento.'
                // Il motivo dice cosa MANCA. Prima "360 Visor: nessuno ammette
                // CC_ATTACK" metteva il primo Tratto davanti, come se fosse la causa.
                : `Nessun Tratto di questo elemento (${tratti.join(', ')}) ammette ${azione}.` +
                  (azioniPossibili.length ? ` Ammette invece: ${azioniPossibili.join(', ')}.` : '')
        };
    };

    // I bersagli scenici validi per un'azione, con il motivo per gli esclusi.
    M.bersagliScenografia = function (azione, opzioni) {
        return M.scenografia().map(function (u) {
            const e = M.scenografiaBersagliabile(u, azione, opzioni);
            return {
                unita: u,
                nome: M.nomeUnita(u),
                tipo: u.tipo,
                scenografia: true,
                ammesso: e.ammesso,
                motivo: e.motivo || null,
                tratti: e.tratti,
                note: e.note || []
            };
        });
    };

    // Le antenne con Tratto Repeater estendono la Zona di Hacking.
    M.ripetitoriInCampo = function () {
        return M.scenografia().filter(function (u) {
            return M.trattiScenografia(u).indexOf('Repeater') >= 0;
        });
    };


    // ==================================================================
    // PARTE 32: RIPRESA DELLA SECONDA META` DELL'ORDINE
    // ------------------------------------------------------------------
    // 🔴 I moduli ramificavano su `isSecondHalf`: se era la seconda meta`
    // saltavano la scelta dell'arma e dei bersagli, dando per fatta quella
    // della prima.
    //
    // Il presupposto vale SOLO se la prima meta` era essa stessa un attacco
    // dello stesso tipo. E` falso ogni volta che si parte con un Movimento
    // — muovi e spari, muovi e vai in mischia — che e` il caso piu` comune
    // al tavolo. Risultato: schermata dell'arma mai costruita, weapon
    // `undefined`, "Nessun bersaglio confermato".
    //
    // La domanda giusta non e` "e` la seconda meta`?" ma "ho davvero arma e
    // bersagli, e vanno bene per QUESTA azione?".
    // ==================================================================

    // 🔴 Il vocabolario delle azioni e` MISTO: "ATTACCO BS" accanto a
    // "CC_ATTACK". Non e` bello ma e` cosi` che l'Hub le legge, e cambiarlo
    // adesso romperebbe i payload in volo. Serve invece normalizzare, perche`
    // i moduli ricevono dal router la forma dell'interfaccia — "ATTACCO CC" —
    // e cercarla in SPEC non trova nulla: ogni controllo che dipende dalla
    // SPEC veniva saltato in silenzio.
    M.azioneCanonica = function (nome) {
        const n = normalizza(nome).toUpperCase();
        if (M.SPEC[n]) return n;

        const sinonimi = {
            'ATTACCO CC': M.AZIONI.CC_ATTACK,
            'CORPO A CORPO': M.AZIONI.CC_ATTACK,
            'CC': M.AZIONI.CC_ATTACK,
            'BS_ATTACK': M.AZIONI.BS_ATTACK,
            'ATTACCO A DISTANZA': M.AZIONI.BS_ATTACK,
            'INTERAGIRE': M.AZIONI.INTERAGIRE,
            'MEDICO_INGEGNERE': M.AZIONI.SUPPORTO_WIP,
            'DODGE': M.AZIONI.SCHIVATA
        };
        if (sinonimi[n] && M.SPEC[sinonimi[n]]) return sinonimi[n];

        // Nessuna corrispondenza: lo si dice invece di trattarla come ignota.
        return null;
    };

    M.riprendiOrdine = function (azione, ctx) {
        ctx = ctx || {};
        const motivi = [];

        if (!ctx.isSecondHalf) {
            return { riprende: false, motivo: 'Prima metà dell\'Ordine: si parte dall\'inizio.' };
        }

        const arma = ctx.arma || null;
        const bersagli = Array.isArray(ctx.bersagli) ? ctx.bersagli : [];

        if (!arma) motivi.push('nessuna arma scelta nella prima metà');
        if (bersagli.length === 0) motivi.push('nessun bersaglio confermato nella prima metà');

        // L'arma della prima meta` non va bene per un'azione di famiglia
        // diversa: un Combi Rifle scelto per un BS Attack non serve in
        // mischia, e un CC Weapon non spara.
        if (arma) {
            const canonica = M.azioneCanonica(azione);
            if (!canonica) {
                motivi.push(`azione "${azione}" non riconosciuta: impossibile verificare l'arma`);
            }
            const spec = (canonica && M.SPEC[canonica]) || {};
            const p = (typeof arma === 'string') ? M.profiloArma(arma) : arma;
            const vuoleCC = (spec.attributo === 'CC');

            // Arma non trovata e arma della famiglia sbagliata sono due
            // problemi diversi, e dirli allo stesso modo manda a cercare
            // nel posto sbagliato.
            if (p && p.nonTrovata) {
                motivi.push(`l'arma della prima metà ("${p.nomeRichiesto || arma}") non è nel database armi`);
            } else if (p && p.soloModalita) {
                motivi.push(`l'arma della prima metà (${p.nome}) richiede la scelta di una modalità`);
            } else if (vuoleCC && p && !p.isCC) {
                motivi.push(`l'arma della prima metà (${p.nome}) non è da Corpo a Corpo`);
            }
            if (!vuoleCC && p && p.isCC && canonica !== M.AZIONI.CC_ATTACK) {
                motivi.push(`l'arma della prima metà (${p.nome}) è da Corpo a Corpo`);
            }
        }

        // Cambio di azione fra le due meta`: l'azione dichiarata prima non
        // e` quella di adesso, quindi i bersagli potrebbero non valere.
        if (ctx.azionePrimaMeta) {
            const prima = String(ctx.azionePrimaMeta).toUpperCase();
            const ora = String(azione).toUpperCase();
            if (prima !== ora && !M.azioneSenzaTiro(prima)) {
                motivi.push(`la prima metà era "${ctx.azionePrimaMeta}": i bersagli vanno riconfermati`);
            }
        }

        if (motivi.length > 0) {
            return {
                riprende: false,
                motivo: 'Seconda metà, ma si riparte dalla scelta dell\'arma: ' + motivi.join('; ') + '.',
                dettaglio: motivi
            };
        }
        return { riprende: true, motivo: 'Arma e bersagli della prima metà sono validi per quest\'azione.' };
    };

    // Comodita` per i moduli: legge da window i campi soliti.
    M.riprendiOrdineDaFinestra = function (azione, isSecondHalf) {
        return M.riprendiOrdine(azione, {
            isSecondHalf: isSecondHalf,
            arma: (G.currentOrder && G.currentOrder.weapon) || null,
            bersagli: G.combatTargets || [],
            azionePrimaMeta: (G.currentOrder && G.currentOrder.action1) || null
        });
    };


    // ==================================================================
    // PARTE 33: TORRETTA — l'arma viene dal PROFILO
    // ------------------------------------------------------------------
    // 🔴 La voce Armed Turret ha `weapon: null` e `armaDalProfilo: true`:
    // l'arma non sta nella struttura, sta fra parentesi nel profilo che la
    // schiera — "Armed Turret (Combi R.)".
    //
    // Chi leggeva `u.weapon` trovava null e la torretta risultava disarmata,
    // quindi non bersagliabile come truppa.
    //
    // Due cose nuove rispetto a prima:
    //  - ha `cc: 5` e `ccWeapon`, quindi combatte anche in mischia;
    //  - ha `Total Reaction`, non "Automated": in ARO tira a Burst 3.
    // ==================================================================

    M.armaTorretta = function (struttura, testoProfilo) {
        const avvisi = [];

        // Se la struttura porta l'arma, e` quella: niente da dedurre.
        const sua = normalizza((struttura && struttura.weapon) || '');
        if (sua && sua !== '-' && sua !== 'null') {
            return { arma: M.profiloArma(sua), fonte: 'struttura', avvisi: avvisi };
        }

        if (!struttura || !struttura.armaDalProfilo) {
            return { arma: null, fonte: null,
                     avvisi: [err('A61', 'Struttura senza arma e senza `armaDalProfilo`: non si sa cosa impugna.')] };
        }

        // L'arma sta fra parentesi nel profilo: "Armed Turret (Combi R.)".
        const nome = normalizza((struttura && struttura.nome) || 'Armed Turret');
        const base = nome.replace(/\s*\([^)]*\)\s*/g, '').trim();
        const re = new RegExp(base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*\\(([^)]*)\\)', 'i');
        const m = re.exec(String(testoProfilo || ''));

        if (!m) {
            return { arma: null, fonte: 'profilo',
                     avvisi: [err('A62', `"${base}" nel profilo non indica l'arma fra parentesi.`,
                        'Senza parentesi non si sa cosa impugna: va scelta a mano.')] };
        }

        const dentro = normalizza(m[1]);
        // Prima il nome completo — un alias puo` risolverlo — poi le
        // abbreviazioni del profilo: "Combi R." sta per "Combi Rifle".
        let p = M.profiloArma(`${base} (${dentro})`);
        // 🔴 La torretta NON spara con se stessa. Da quando il database ha una
        // voce "Armed Turret" (armaDalProfilo, 2026-09-21.4), il primo tentativo
        // — "Armed Turret (Combi R.)" — trovava QUELLA e si fermava: la torretta
        // risultava armata della torretta. Passava solo col nome per esteso,
        // perche` li` un alias risolve all'arma vera. Il contenitore si scarta.
        if (!p.nonTrovata && (p.armaDalProfilo || normalizza(p.nome) === base)) p = { nonTrovata: true };
        if (p.nonTrovata) p = M.profiloArma(dentro);
        if (p.nonTrovata) {
            const esteso = dentro
                .replace(/\bR\.$/i, 'Rifle')
                .replace(/\bP\.$/i, 'Pistol')
                .replace(/\bL\.$/i, 'Launcher')
                .replace(/\bMG$/i, 'Machine Gun');
            if (esteso !== dentro) {
                p = M.profiloArma(esteso);
                if (!p.nonTrovata) {
                    avvisi.push(err('A63', `"${dentro}" risolto come "${p.nome}": abbreviazione del profilo.`));
                }
            }
        }
        if (p.nonTrovata) {
            return { arma: null, fonte: 'profilo', dichiarata: dentro,
                     avvisi: [err('A64', `L'arma "${dentro}" della torretta non è nel database armi.`)] };
        }
        return { arma: p, fonte: 'profilo', dichiarata: dentro, avvisi: avvisi };
    };

    // L'arma da CC della struttura, se ne ha una.
    M.armaCCStruttura = function (struttura) {
        const n = normalizza((struttura && struttura.ccWeapon) || '');
        if (!n || n === '-') return null;
        const p = M.profiloArma(n);
        return p.nonTrovata ? null : p;
    };

    // Una struttura combatte in mischia?
    M.strutturaInMischia = function (struttura) {
        const cc = parseInt((struttura && struttura.cc), 10);
        return {
            puo: isFinite(cc) && cc > 0,
            cc: isFinite(cc) ? cc : null,
            arma: M.armaCCStruttura(struttura),
            nota: isFinite(cc) && cc > 0
                ? 'Ha un valore di CC e un\'arma da mischia: si difende e attacca in Corpo a Corpo.'
                : 'Nessun valore di CC: non combatte in mischia.'
        };
    };


    // ==================================================================
    // PARTE 34: I MOD E I DIVIETI DEGLI STATI
    // ------------------------------------------------------------------
    // 🔴 CATALOGO_N5.STATI contiene da sempre `mod` e `azioniPermesse`, e
    // nessuno li leggeva. Risultato: una truppa Immobilizzata-A schivava a
    // PH pieno invece che a PH-6, una Isolata resettava a WIP pieno invece
    // che a WIP-9, e gli ARO venivano offerti a chi non poteva dichiararli.
    //
    // Reggeva solo perche` logica_aro.js chiamava anche puoFareAzione(), che
    // vive nelle due pagine HTML: una regola di gioco custodita
    // dall'interfaccia, che si riapre in silenzio se l'HTML cambia.
    // ==================================================================

    // ⚠️ NON si chiama statiAttivi: quel nome e` gia` preso da una funzione
    // che serve al TABELLONE e restituisce {id, nome, categoria} ordinati.
    // Definirla di nuovo l'aveva sovrascritta, ed e` lo stesso difetto dei
    // doppioni che abbiamo passato mesi a togliere — fatto da me.
    // Questa risponde a una domanda diversa: quali VOCI DI CATALOGO sono
    // attive, con i loro `mod` e `azioniPermesse`.
    M.statiDiCatalogo = function (unita) {
        const S = catalogo('STATI');
        const st = (unita && unita.states) || {};
        const principale = String((unita && unita.state) || '').toUpperCase();
        const out = [];
        Object.keys(S).forEach(function (nome) {
            const v = S[nome];
            const chiave = v.chiave || nome.toLowerCase();
            const attivo = !!st[chiave] ||
                           principale === nome.toUpperCase() ||
                           (v.vecchiaChiave && principale === v.vecchiaChiave) ||
                           principale === String(chiave).toUpperCase();
            if (attivo) out.push(Object.assign({ stato: nome }, v));
        });
        return out;
    };

    // Il MOD che gli stati impongono a un'azione. Restituisce le VOCI, non
    // solo la somma: ogni numero deve poter essere risalito.
    M.modStati = function (unita, azione) {
        const az = String(azione || '').toUpperCase();
        const voci = [];
        M.statiDiCatalogo(unita).forEach(function (s) {
            if (!s.mod) return;
            const v = s.mod[az];
            if (typeof v === 'number' && v !== 0) {
                voci.push({ fonte: 'stato', stato: s.stato, valore: v, motivo: `Stato ${s.nome || s.stato}: ${v} ${s.mod.attributo || ''}`.trim() });
            }
        });
        return { voci: voci, totale: voci.reduce(function (a, v) { return a + v.valore; }, 0) };
    };

    // Quest'azione e` permessa dagli stati dell'unita`?
    // `azioniPermesse` e` una lista CHIUSA: se c'e`, tutto il resto e` vietato.
    M.azionePermessaDaStati = function (unita, azione) {
        const az = M.azioneCanonica(azione) || String(azione || '').toUpperCase();
        const bloccanti = [];
        M.statiDiCatalogo(unita).forEach(function (s) {
            if (Array.isArray(s.vietaAzioni) && s.vietaAzioni.some(function (x) {
                return M.azioneCanonica(x) === az || String(x).toUpperCase() === az;
            })) {
                bloccanti.push({ stato: s.stato, motivo: `Stato ${s.nome || s.stato}: ${azione} non è permessa.` });
                return;
            }
            if (Array.isArray(s.azioniPermesse) && s.azioniPermesse.length > 0) {
                const dentro = s.azioniPermesse.some(function (x) {
                    return M.azioneCanonica(x) === az || String(x).toUpperCase() === az;
                });
                if (!dentro) {
                    bloccanti.push({ stato: s.stato,
                        motivo: `Stato ${s.nome || s.stato}: permette solo ${s.azioniPermesse.join(', ')}.` });
                }
            }
        });
        return {
            permessa: bloccanti.length === 0,
            bloccanti: bloccanti,
            motivo: bloccanti.length ? bloccanti[0].motivo : null
        };
    };


    // ==================================================================
    // PARTE 35: DEACTIVATOR
    // ------------------------------------------------------------------
    // Bersaglia i Deployable NEMICI gia` schierati, mai i Marker Mimetici.
    // 🔴 Basta la ZdC: la LoF non serve — e` la novita` N5, ed e` cio` che
    // rende utile spegnere un Ripetitore al coperto. Ha gittate proprie,
    // la riga "Deactivator" del Weapon Chart: +6 / +3 / -6.
    // ==================================================================

    M.armaDeactivator = function () {
        const p = M.profiloArma('Deactivator');
        if (p.nonTrovata) {
            return { nome: 'Deactivator', bands: [], burst: 1, ammo: null, ammoOpzioni: [],
                     isTemplate: false, isCC: false, notazioni: [],
                     avvisi: [err('A65', 'Voce "Deactivator" assente dal database armi: nessun MOD di gittata.')] };
        }
        return p;
    };

    // I dispositivi schierati sul tavolo. Li tiene il gameState; se non ci
    // sono, si dice invece di offrire il catalogo come se fossero in campo.
    M.deployableInCampo = function () {
        const st = statoGioco();
        const sc = (st && st.scenario) || {};
        const out = [];
        ['nomads', 'panoceania'].forEach(function (fonte) {
            const v = sc[fonte];
            if (!v) return;
            ['deployables', 'dispositivi', 'deployed'].forEach(function (campo) {
                if (!Array.isArray(v[campo])) return;
                v[campo].forEach(function (d) {
                    if (d) out.push(Object.assign({}, d, { fonteScenario: fonte }));
                });
            });
        });
        return out;
    };

    M.bersagliDeactivator = function (utente, opzioni) {
        opzioni = opzioni || {};
        const C = catalogo('SCENOGRAFIA').deactivator || {};
        const mieiFonte = (M.fazionePropria() === 'NOMADI') ? 'nomads' : 'panoceania';
        const giudizi = [];
        const avvisi = [];

        // I dispositivi schierati, se il gameState li tiene.
        M.deployableInCampo().forEach(function (d) {
            const e = { unita: d, nome: M.nomeUnita(d), tipo: 'DEPLOYABLE',
                        ammesso: true, motivo: null, note: [] };
            function nega(m) { e.ammesso = false; e.motivo = m; }

            // Solo NEMICI.
            if (d.fonteScenario === mieiFonte) {
                nega('E` un tuo dispositivo: il Deactivator agisce solo su quelli nemici.');
            } else {
                const stD = M.statoBersaglio(d);
                // 🔴 Mai i Marker Mimetici. Le mine si schierano come
                // CAMO(-3): finche` non sono Scoperte il Deactivator non le vede.
                if (stD.camo || stD.imp) nega(C.maiCamo || 'In forma di Marker: va Scoperta prima.');
                else if (stD.morto) nega('Gia` distrutto.');
            }
            giudizi.push(e);
        });

        // La scenografia nemica con Tratto Deployable: Armed Turret,
        // Deployable Cover.
        M.scenografia().forEach(function (sc) {
            const tratti = M.trattiScenografia(sc);
            const eDeployable = tratti.indexOf('Deployable') >= 0 ||
                                /DEPLOYABLE/i.test(String(sc.traits || ''));
            if (!eDeployable) return;
            const e = { unita: sc, nome: M.nomeUnita(sc), tipo: sc.tipo,
                        scenografia: true, ammesso: true, motivo: null, note: [] };
            const stS = M.statoBersaglio(sc);
            if (stS.camo || stS.imp) { e.ammesso = false; e.motivo = C.maiCamo; }
            giudizi.push(e);
        });

        if (giudizi.length === 0) {
            avvisi.push(err('A66',
                'Nessun dispositivo schierato sul tavolo, o il gameState non li tiene.',
                'Il Deactivator agisce solo su Deployable GIA` in campo: se ci sono ma non compaiono, la partita non li registra.'));
        }
        return { bersagli: giudizi, avvisi: avvisi };
    };

    // Il tiro. ctx: { rangeIndex, discoBallAlleata }
    M.regoleDeactivator = function (utente, bersaglio, ctx) {
        ctx = ctx || {};
        const C = catalogo('SCENOGRAFIA').deactivator || {};
        const arma = M.armaDeactivator();
        const note = [], avvisi = (arma.avvisi || []).slice();
        const voci = [];

        const base = parseInt((utente && utente.wip), 10) || 0;
        let mod = 0;
        voci.push({ fonte: 'base', valore: base, motivo: `WIP di ${M.nomeUnita(utente)}: ${base}` });

        // Gittata propria.
        if (arma.bands && arma.bands.length) {
            let i = parseInt(ctx.rangeIndex, 10);
            if (!isFinite(i) || i < 0 || i >= arma.bands.length) i = 0;
            const b = arma.bands[i];
            if (b.mod) { mod += b.mod; voci.push({ fonte: 'gittata', valore: b.mod, motivo: `Gittata ${b.label}: ${b.mod > 0 ? '+' : ''}${b.mod}` }); }
        }

        // Disco Baller: riattiva una Disco Ball ALLEATA, con WIP+3.
        if (ctx.discoBallAlleata) {
            mod += 3;
            voci.push({ fonte: 'disco-baller', valore: 3, motivo: 'Disco Baller: +3 WIP riattivando una Disco Ball alleata' });
            note.push(C.discoBall || null);
        }

        if (C.bastaLaZdC) note.push('Basta la ZdC: la Linea di Tiro non serve.');
        if (C.maiCamo) note.push(C.maiCamo);
        if (C.successo) note.push(C.successo);

        const valore = base + mod;
        return {
            valore: valore, base: base, mod: mod, attributo: 'WIP',
            impossibile: valore < 1,
            critici: M.critici(valore),
            arma: arma, voci: voci,
            note: note.filter(Boolean), avvisi: avvisi
        };
    };


    // ==================================================================
    // PARTE 36: DEPLOYABLE — innesco, piazzamento, e le tre domande
    // ------------------------------------------------------------------
    // 🔴 Il BOOST non e` un Faccia a Faccia. Il deployable NON TIRA: si
    // muove fino al contatto e detona, e l'unica difesa e` una Schivata
    // come TIRO NORMALE. Trattarlo come un F2F darebbe al koala un tiro
    // che il regolamento non gli concede.
    // (PARTE_1, righe 4700-4716)
    // ==================================================================

    // Usi residui di un Disposable. Senza un conteggio nel gameState si
    // dice che non lo si sa, invece di dare per buono che ce ne siano.
    M.usiResidui = function (portatore, arma) {
        const tratti = String((arma && arma.traits) || '');
        const m = /Disposable\s*\((\d+)\)/i.exec(tratti);
        if (!m) return null;                       // non e` Disposable
        const totali = parseInt(m[1], 10);

        // 🔴 Gli usi sono CONDIVISI fra le modalita`: le D-Charges hanno tre
        // modalita` e Disposable (3), quindi tre usi IN TOTALE, non tre per
        // modalita`. Contarli per nome di modalita` ne avrebbe dati nove.
        // (wiki N5, pagina Traits)
        const base = normalizza(String(arma.nome || '').replace(/\s*\([^)]*\)\s*/g, ' ')).trim().toUpperCase();
        const spesiMap = (portatore && portatore.usiSpesi) || {};
        let spesi = 0;
        Object.keys(spesiMap).forEach(function (k) {
            const kb = normalizza(String(k).replace(/\s*\([^)]*\)\s*/g, ' ')).trim().toUpperCase();
            if (kb === base) spesi += parseInt(spesiMap[k], 10) || 0;
        });
        return { totali: totali, spesi: spesi, residui: Math.max(0, totali - spesi),
                 condivisiFraModalita: true, chiaveUsi: base };
    };

    M.ePiazzabile = function (arma) {
        const t = String((arma && arma.traits) || '').toUpperCase();
        if (/DEPLOYABLE/.test(t) || /PERIPHERAL \(ANCILLARY\)/.test(t)) return true;
        // 🔴 Le D-Charges in Demolition Mode "Are placed using the Place
        // Deployable Short Skill" (REGOLE_N5_v5_1_1.txt riga 6044), ma il
        // database non porta il Tratto Deployable su quella modalita`: il
        // modo di risoluzione lo dice. Senza questo il modulo di piazzamento
        // non le offriva, e il filtro dei bersagli non veniva mai raggiunto.
        return !!(arma && arma.risoluzione === 'CONTATTO_STRUTTURA');
    };

    // 🔴 COSA SI PIAZZA DAVVERO, data una voce del profilo. UNA funzione,
    // usata da armiPiazzabili e dal Minelayer: prima il Minelayer aveva una
    // sua copia della regola della torretta, e armiPiazzabili era rimasto
    // indietro — Clockmaker e Machinist non vedevano la loro. (Chat INTERFACCIA.)
    //  1. Un'arma CONTENITORE (armaDalProfilo): "Armed Turret (Combi Rifle)"
    //     si riconosce dal NOME, prima che un alias la risolva nella Combi
    //     Rifle montata, che non e` Deployable.
    //  2. Una voce con MODALITA`: non si leggono i traits del contenitore —
    //     regola di lettura della chat DATABASE — ma quelli delle modalita`.
    //     "Drop Bears" si piazza come "Drop Bears (Deployable Mode)", che e`
    //     anche la chiaveArma del gettone in DB_DEPLOYABLES.
    // Un gettone di DB_DEPLOYABLES cercato per NOME (equipaggiamenti senza arma).
    M.gettonePerNome = function (nome) {
        const D = G.DB_DEPLOYABLES; const db = Array.isArray(D) ? D : Object.keys(D || {}).map(function (k) { return Object.assign({ id: k }, D[k]); });
        const n = normalizza(String(nome || '')).toUpperCase();
        return db.find(function (d) { return !d.chiaveArma && normalizza(String(d.nome || '')).toUpperCase() === n; }) || null;
    };
    // Il "profilo" di un equipaggiamento-gettone: la stessa forma che creaDeployable
    // e i menu aspettano da profiloArma, con `gettone` che punta alla voce.
    M.profiloGettone = function (voce) {
        return { nome: voce.nome, nomeRichiesto: voce.nome, nonTrovata: false, gettone: voce,
                 traits: (voce.traits || []).join(', '), bands: [], isCC: false, isTemplate: false,
                 burst: 0, dam: null, ammo: null, avvisi: [], notazioni: [] };
    };

    // TUTTI i piazzabili che una voce del profilo offre. Un contenitore con
    // piu` modalita` Deployable — il Deployable Cover, con Cutting Foam e
    // Vitroferro — le restituisce tutte: la scelta e` del giocatore (riga
    // 10668), non dell'ordine dell'array. piazzabileDaVoce ne dava una sola.
    M.piazzabiliDaVoce = function (nome) {
        const W = G.RULES_WEAPONS || {};
        const n = normalizza(nome || '');
        if (!n) return [];
        const p = M.profiloArma(n);
        const voce = (p && !p.nonTrovata) ? (W[p.nome] || {}) : {};
        if (Array.isArray(voce.modalita)) {
            const cont = Object.keys(W).some(function (k) { return W[k] && W[k].armaDalProfilo && n.toUpperCase().indexOf(k.toUpperCase()) === 0; });
            if (!cont) {
                return voce.modalita
                    .filter(function (m) { return /DEPLOYABLE/i.test(String((W[m] || {}).traits || '')); })
                    .map(function (m) { return M.profiloArma(m); });
            }
        }
        const uno = M.piazzabileDaVoce(nome);
        return uno ? [uno] : [];
    };

    M.piazzabileDaVoce = function (nome) {
        const W = G.RULES_WEAPONS || {};
        const n = normalizza(nome || '');
        if (!n) return null;
        const cont = Object.keys(W).find(function (k) {
            return W[k] && W[k].armaDalProfilo && n.toUpperCase().indexOf(k.toUpperCase()) === 0;
        });
        if (cont) return M.profiloArma(cont);
        // 🔴 Un EQUIPAGGIAMENTO che e` un gettone per NOME — "Deployable
        // Repeater" — non sta in RULES_WEAPONS (non e` un'arma) ma in
        // DB_DEPLOYABLES, con chiaveArma null. La ricerca per arma non lo
        // trovava, e cinque profili non potevano piazzarlo: qui l'elenco a
        // mano dell'interfaccia aveva ragione e il motore no. (Chat
        // INTERFACCIA, 22 settembre.) Si restituisce un profilo minimo,
        // marcato `gettone`, che creaDeployable riconosce.
        const gett = M.gettonePerNome(n);
        if (gett) return M.profiloGettone(gett);
        const p = M.profiloArma(n);
        if (!p || p.nonTrovata) return null;
        const voce = W[p.nome] || {};
        if (Array.isArray(voce.modalita)) {
            const dep = voce.modalita.find(function (m) { return /DEPLOYABLE/i.test(String((W[m] || {}).traits || '')); });
            return dep ? M.profiloArma(dep) : null;
        }
        return M.ePiazzabile(p) ? p : null;
    };

    // Il bersaglio di un'arma che si piazza A CONTATTO di qualcosa: nemici e
    // scenografia, filtrati dai campi che l'arma DICHIARA.
    // (Chat REGOLE, 21 settembre: la funzione esisteva ma nessun modulo la
    // raggiungeva.)
    M.bersagliDaPiazzamento = function (arma, opzioni) {
        opzioni = opzioni || {};
        const candidati = (opzioni.candidati || M.rosterNemico().concat(M.scenografia ? M.scenografia() : []));
        return candidati.map(function (u) {
            const da = M.bersaglioAmmessoDaArma(arma, u);
            return { unita: u, nome: M.nomeUnita(u), ammesso: da.ammesso,
                     motivo: da.ammesso ? null : da.motivo, dichiarato: da.dichiarato };
        });
    };

    // Le armi che una truppa puo` piazzare, con gli usi residui.
    M.armiPiazzabili = function (unita) {
        const dentro = [], escluse = [], avvisi = [];
        M.dividiLista(((unita && unita.weapon) || '') + ',' + ((unita && unita.equip) || ''))
            .forEach(function (nome) {
                const cl = M.classificaVoceProfilo(nome);
                if (cl.tipo === 'VUOTA') return;
                M.piazzabiliDaVoce(nome).forEach(function (p) {
                    if (dentro.some(function (x) { return x.nome === p.nome; })) return;
                    const usi = M.usiResidui(unita, p);
                    if (usi && usi.residui <= 0) {
                        escluse.push({ nome: p.nome, motivo: `Usi esauriti (Disposable ${usi.totali}).` });
                        return;
                    }
                    dentro.push(Object.assign({}, p, { usi: usi }));
                });
            });
        return { armi: dentro, escluse: escluse, avvisi: avvisi };
    };

    // 🔴 L'app non ha la mappa. Queste tre cose non le puo` sapere, e
    // inventarle sarebbe peggio che chiederle: stessa forma della domanda
    // LoF/ZdC che il Movimento Cauto gia` fa.
    M.domandeDeployable = function (fase) {
        const D = catalogo('REGOLE_DEPLOYABLE');
        const dom = (D && D.domande) || {};
        const f = String(fase || '').toUpperCase();

        if (f === 'PIAZZAMENTO') {
            return [{
                id: 'markerNellArea', testo: dom.piazzamento,
                seSi: 'Piazzamento NEGATO, salvo che nell\'area ci sia anche un nemico valido scoperto, o sia già stato fatto un Attacco Intuitivo.',
                blocca: true
            }];
        }
        if (f === 'PERIMETER') {
            return [{
                id: 'percorsoLibero', testo: dom.perimeter,
                seNo: 'Col Tratto Perimeter si piazza ovunque dentro la ZdC, ma il percorso deve essere percorribile.',
                blocca: true, rispostaBloccante: false
            }];
        }
        if (f === 'ATTIVAZIONE') {
            return [{
                id: 'dentroZdC', testo: dom.attivazione,
                seNo: 'Il deployable non si attiva: senza ZdC o con il percorso bloccato non scatta.',
                blocca: true, rispostaBloccante: false
            }];
        }
        return [];
    };

    // Il deployable si attiva contro questo nemico?
    M.innescoDeployable = function (arma, nemico, ctx) {
        ctx = ctx || {};
        const B = (catalogo('REGOLE_DEPLOYABLE') || {}).boost || {};
        const modo = (arma && arma.modoRisoluzione) || null;
        const note = [];

        if (!modo || modo.innesco !== 'ZDC') {
            return { scatta: false, motivo: 'Quest\'arma non si attiva per Zona di Controllo.' };
        }

        const st = M.statoBersaglio(nemico);
        // 🔴 Mai contro i Marker: CAMO, IMP-1, IMP-2.
        if (st.camo || st.imp) {
            return { scatta: false, motivo: B.noteEsclusi || 'Non scatta contro i Marker.' };
        }
        // Il percorso: l'app non lo sa, lo chiede.
        if (ctx.percorsoLibero === false) {
            return { scatta: false, motivo: B.noSePercorsoBloccato || 'Percorso bloccato.' };
        }
        if (ctx.percorsoLibero === undefined) {
            note.push('Percorso non verificato: chiedere se è libero prima di risolvere.');
        }
        // Un altro deployable non lo innesca.
        if (nemico && nemico.deployable) {
            return { scatta: false, motivo: B.nonInnescaAltriDeployable || 'Un Deployable non ne attiva un altro.' };
        }

        return {
            scatta: true,
            difesa: B.difesa || 'Schivata come Tiro Normale.',
            rimozione: B.rimozione || null,
            note: note
        };
    };


    // ==================================================================
    // PARTE 37: CICLO DI VITA DEL DEPLOYABLE PIAZZATO
    // ------------------------------------------------------------------
    // 🔴 Alla Fase Stati si rimuove LA SAGOMA, NON IL TOKEN.
    // Il token resta fino a fine partita o finche` non viene distrutto, ed e`
    // bersagliabile. Rimuoverlo farebbe sparire un bersaglio legittimo dal
    // tavolo senza che nessuno se ne accorga, finche` qualcuno non prova a
    // spararci. (regolamento, righe 4522-4536)
    // ==================================================================

    // Cosa succede a un deployable all'inizio della Fase Stati.
    M.fineTurnoDeployable = function (token) {
        const arma = token && token.chiaveArma ? M.profiloArma(token.chiaveArma) : null;
        const modo = (arma && arma.modoRisoluzione) || null;

        if (!modo || modo.disattivaA !== 'inizio Fase Stati') {
            return { rimuoviToken: false, rimuoviSagoma: false,
                     motivo: 'Nessuna disattivazione prevista alla Fase Stati.' };
        }
        return {
            rimuoviToken: false,                   // 🔴 MAI
            rimuoviSagoma: true,
            disattivato: true,
            motivo: modo.noteDisattivazione ||
                    'Alla Fase Stati si rimuove la Sagoma, non il token.',
            permanenza: modo.permanenza || null,
            riattivabileCon: modo.riattivabileCon || null,
            bersagliabile: modo.bersagliabile !== false
        };
    };

    // Il token nasce dall'ESITO del tiro, non dall'equipaggiamento: nessun
    // profilo porta il "Disco Ball", i portatori hanno il "Disco Baller".
    M.deployableDaEsito = function (arma) {
        const modo = (arma && arma.modoRisoluzione) || null;
        if (!modo || modo.nasceDa !== 'esito arma') return null;

        const db = G.DB_DEPLOYABLES;
        if (!Array.isArray(db)) {
            return { voce: null, avviso: err('A67', 'DB_DEPLOYABLES non caricato: il token non si puo` costruire.') };
        }
        // Si cerca per chiaveArma, che il database mette apposta.
        const voce = db.find(function (d) {
            return normalizza(String(d.chiaveArma || '')).toUpperCase() ===
                   normalizza(String(arma.nome || '')).toUpperCase();
        });
        if (!voce) {
            return { voce: null,
                     avviso: err('A68', `Nessuna voce di DB_DEPLOYABLES con chiaveArma "${arma.nome}".`) };
        }
        return {
            voce: voce,
            sagoma: modo.sagoma || null,
            nota: 'Il token entra in gioco alla Conclusione dell\'Ordine, solo se il tiro riesce.'
        };
    };

    // Un deployable che non attacca non infligge salvezze: si dice, invece
    // di calcolarne una su dati che non ha.
    M.deployableAttacca = function (arma) {
        const modo = (arma && arma.modoRisoluzione) || null;
        if (!modo) return { attacca: true };
        if (modo.attacca === false) {
            return { attacca: false,
                     effetto: modo.effetto || null,
                     motivo: `${modo.etichetta}: non attacca e non infligge Tiri Salvezza.` };
        }
        return { attacca: true };
    };


    // ==================================================================
    // PARTE 38: TRATTI CONDIZIONALI
    // ------------------------------------------------------------------
    // 🔴 Si risolvono al momento del TIRO SALVEZZA, quando il bersaglio e`
    // noto. In profiloArma il bersaglio non c'e` ancora, quindi il Tratto
    // non si puo` valutare: metterci un valore fisso significherebbe
    // applicare la regola anche ai bersagli che la regola esclude.
    //
    // E` la stessa lezione del guardrail opzionale: la condizione va dove si
    // calcola, non dove si ricorda.
    // ==================================================================

    // Il bersaglio ha questo attributo?
    M.haAttributo = function (bersaglio, attributo) {
        if (!bersaglio) return false;
        const a = String(attributo || '').toUpperCase();
        if (a === 'VITA') return bersaglio.w != null || bersaglio.vita != null;
        if (a === 'STR')  return bersaglio.str != null;
        return false;
    };

    // I Tratti condizionali di un'arma, risolti contro un bersaglio.
    // Restituisce le trasformazioni da applicare, non le applica.
    M.trattiCondizionali = function (arma, bersaglio) {
        const C = catalogo('TRATTI_CONDIZIONALI');
        const testo = String((arma && arma.traits) || '');
        const applicati = [], note = [], avvisi = [];

        Object.keys(C).forEach(function (nome) {
            const T = C[nome];
            // Le voci-segnaposto (stringhe) rimandano altrove: non sono regole.
            if (typeof T !== 'object' || T === null) return;
            // Il Tratto e` scritto nel profilo? Anche con un valore fra
            // parentesi: "BioWeapon (DA+Shock)".
            // 🔴 Confine di parola, non semplice contenimento.
            // Undici armi hanno il Tratto "Targetless", che contiene "Target"
            // ma e` il suo opposto: uno startsWith le prenderebbe tutte.
            const re = new RegExp('(^|[,;\\s])' +
                nome.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') +
                '($|[,;\\s(\\[])', 'i');
            if (!re.test(testo)) return;

            // Senza condizione: si applica sempre.
            if (!T.condizione) {
                if (T.sempre) {
                    applicati.push({ tratto: nome, effetto: T.sempre, motivo: T.note || null });
                    if (T.note) note.push(T.note);
                }
                if (T.fonte === 'DA VERIFICARE') {
                    avvisi.push(err('A69', `Tratto "${nome}": dati non verificati su fonte ufficiale.`));
                }
                return;
            }

            // Condizione sull'attributo del bersaglio.
            let vero = null;
            if (T.condizione.attributoBersaglio === 'DA_PARENTESI') {
                const m = new RegExp(nome + '\\s*[\\(\\[]\\s*(VITA|STR)', 'i').exec(testo);
                vero = m ? M.haAttributo(bersaglio, m[1]) : null;
                if (vero === null) {
                    avvisi.push(err('A70b', `Tratto "${nome}" senza attributo fra parentesi: impossibile valutarlo.`));
                    return;
                }
            } else if (T.condizione.attributoBersaglio) {
                vero = M.haAttributo(bersaglio, T.condizione.attributoBersaglio);
            } else if (T.condizione.skillAttaccante) {
                // La condizione guarda l'attaccante, non il bersaglio: qui non
                // lo abbiamo, quindi si dichiara invece di indovinare.
                avvisi.push(err('A69', `Tratto "${nome}": la condizione riguarda l'attaccante, da valutare altrove.`));
                return;
            }

            const ramo = vero ? T.seVero : T.seFalso;
            const notaRamo = vero ? T.noteVero : T.noteFalso;
            if (ramo && !ramo.nessunCambio) {
                applicati.push({ tratto: nome, effetto: ramo, condizioneVera: vero, motivo: notaRamo || null });
            }
            if (notaRamo) note.push(notaRamo);
            if (T.fonte === 'DA VERIFICARE') {
                avvisi.push(err('A69', `Tratto "${nome}": dati non verificati su fonte ufficiale.`));
            }
        });

        return { applicati, note, avvisi };
    };


    // ==================================================================
    // PARTE 39: creaDeployable — il token come unita` vera
    // ------------------------------------------------------------------
    // 🔴 MARKER NON VUOL DIRE MIMETICO. DB_DEPLOYABLES ha due campi che
    // sembrano dire la stessa cosa:
    //     tipo MARKER    + isCamo true   le mine e i Drop Bears: da Scoprire
    //     tipo MARKER    + isCamo false  Disco Ball, Dazer, Repeater: visibili
    //     tipo PERIMETER + isCamo false  CrazyKoala, Madtraps, WildParrot
    // Copiare `tipo` nel campo `tipo` dell'unita` farebbe di un CrazyKoala un
    // bersaglio che "va Scoperto prima" — falso, e invisibile finche` qualcuno
    // non prova a sparargli. Il token porta `categoriaDeployable` e lascia
    // `tipo` fuori, perche` nei database `tipo` significa LI/MI/TAG/REM.
    // ==================================================================

    let _contatoreDeployable = 0;

    M.creaDeployable = function (portatore, arma, ctx) {
        ctx = ctx || {};
        const avvisi = [], errori = [];

        // Oggetti, non nomi: il contratto lo dice, così non si sbagliano firme.
        if (typeof arma === 'string') {
            errori.push(err('E18', 'creaDeployable vuole il PROFILO dell\'arma, non il nome.',
                'Passare M.profiloArma(nome).'));
            return { token: null, portatoreAggiornato: portatore, avvisi, errori };
        }
        if (!arma || arma.nonTrovata) {
            errori.push(err('E18', 'Arma non valida: nessun token da creare.'));
            return { token: null, portatoreAggiornato: portatore, avvisi, errori };
        }

        // 🔴 Una voce-CONTENITORE non ha Tratti propri: il Disposable e il
        // Tratto Deployable vivono sulle modalita`. Respingerla con E20
        // ("nessuna voce in DB_DEPLOYABLES") accusava il database di una
        // lacuna che non ha — la voce c'e`, manca la scelta della modalita`.
        // E senza Tratti non avrebbe nemmeno un limite d'uso.
        if (arma.soloModalita) {
            errori.push(err('E21',
                `"${arma.nome}" è una voce con modalità: va scelta quale prima di piazzare.`,
                'Senza modalità non porta né il Tratto Deployable né il conteggio Disposable.'));
            return { token: null, portatoreAggiornato: portatore, avvisi, errori };
        }

        const db = G.DB_DEPLOYABLES;
        if (!Array.isArray(db)) {
            errori.push(err('E19', 'DB_DEPLOYABLES non caricato.'));
            return { token: null, portatoreAggiornato: portatore, avvisi, errori };
        }

        // --- i due percorsi, che non devono confondersi ---
        const nomeArma = normalizza(String(arma.nome || '')).toUpperCase();
        let voce = null;

        if (ctx.viaEsito) {
            // Nasce dall'ESITO del tiro: si cerca per `generatoDa`.
            // 🔴 Nessuna ricerca di riserva: se il campo manca, e` il file che
            // non e` aggiornato, e cercare per chiaveArma darebbe il token
            // sbagliato in silenzio.
            voce = db.find(function (d) {
                return normalizza(String(d.generatoDa || '')).toUpperCase() === nomeArma;
            }) || null;
            if (!voce) {
                errori.push(err('E20',
                    `Nessuna voce di DB_DEPLOYABLES con generatoDa "${arma.nome}".`,
                    'Il token nasce dall\'esito del tiro e va trovato per `generatoDa`: senza quel campo non si puo` creare.'));
                return { token: null, portatoreAggiornato: portatore, avvisi, errori };
            }
        } else if (arma.gettone) {
            // Equipaggiamento-gettone (Deployable Repeater): la voce e` gia` nota.
            voce = db.find(function (d) { return d.id === arma.gettone.id; }) || arma.gettone;
        } else {
            voce = db.find(function (d) {
                return normalizza(String(d.chiaveArma || '')).toUpperCase() === nomeArma;
            }) || null;
            // 🔴 Una MODALITA` piazzata — "Deployable Cover (Vitroferro)" — ha il
            // gettone sotto il nome del CONTENITORE ("Deployable Cover"): un
            // gettone solo per tutte le varianti, come vuole il database. Si
            // risale al contenitore e si cerca con quello. Senza, il Clockmaker
            // vedeva le due voci e piazzarle dava E20. (Chat DATABASE, 22 sett.)
            if (!voce) {
                const Wd = G.RULES_WEAPONS || {};
                const contenitore = Object.keys(Wd).find(function (k) {
                    return Array.isArray((Wd[k] || {}).modalita) &&
                           Wd[k].modalita.some(function (m) { return normalizza(m).toUpperCase() === nomeArma; });
                });
                if (contenitore) {
                    const nc = normalizza(contenitore).toUpperCase();
                    voce = db.find(function (d) { return normalizza(String(d.chiaveArma || '')).toUpperCase() === nc; }) || null;
                }
            }
            if (!voce) {
                errori.push(err('E20', `Nessuna voce di DB_DEPLOYABLES con chiaveArma "${arma.nome}".`));
                return { token: null, portatoreAggiornato: portatore, avvisi, errori };
            }
        }

        // --- usi ---
        const usi = M.usiResidui(portatore, arma);
        if (usi && usi.residui <= 0) {
            errori.push(err('E17', `"${arma.nome}": usi esauriti (Disposable ${usi.totali}).`));
            return { token: null, portatoreAggiornato: portatore, avvisi, errori };
        }

        // --- il token ---
        _contatoreDeployable += 1;
        const progressivo = _contatoreDeployable;
        const token = {
            id: `dep_${voce.id || 'x'}_${progressivo}_${Date.now()}`,
            nome: `${voce.nome} #${progressivo}`,
            alias: `${voce.nome} #${progressivo}`,
            deployable: true,                       // nome esatto: lo legge innescoDeployable
            chiaveArma: voce.chiaveArma || arma.nome,
            categoriaDeployable: voce.tipo || null, // MAI nel campo `tipo`
            isCamo: !!voce.isCamo,
            arm: voce.arm, bts: voce.bts, str: voce.str, s: voce.s,
            equip: voce.equip || '', armi: voce.armi || '',
            traits: voce.traits || '',
            proprietario: (portatore && (portatore.id || portatore.alias)) || null,
            ordineDiPiazzamento: ctx.ordineId != null ? ctx.ordineId : null,
            states: {}                              // esplicito, non ereditato
        };
        // Un Marker mimetico entra in gioco come Marker.
        if (voce.isCamo) token.states.camo = true;
        // 🔴 Il gettone NON porta `tipo`: nei database significa LI/MI/TAG/REM,
        // e "MARKER" (Repeater) o "TORRETTA" ingannerebbero chi legge il tipo
        // di truppa (test_creadeployable, sezione 4). Ma il Deployable Cover e`
        // scenografia — tipo STRUTTURA nella voce — e senza un segno il
        // Deactivator, l'unico modo di rimuoverlo (riga 10672), non lo vedeva.
        // Si marca con `scenografia: true` e `neutrale` resta com'e`: e` del
        // proprietario, ma il Deactivator NEMICO lo puo` colpire.
        if (String(voce.tipo || '').toUpperCase() === 'STRUTTURA') token.scenografia = true;

        // La VARIANTE scelta (Deployable Cover: Cutting Foam / Vitroferro) sta
        // sull'arma-modalita`, non sul gettone unico: la si porta sul token,
        // cosi` l'interfaccia la trova la` e la passa sul colpo nel campo
        // `copertura`. E` il lettore del campo varianteCopertura del database.
        const vArma = ((G.RULES_WEAPONS || {})[arma.nome] || {}).varianteCopertura;
        if (vArma) { token.varianteCopertura = vArma; token.nome += ` (${arma.nome.replace(/^.*\(([^)]*)\).*$/, '$1')})`; }

        // 🔴 ARMED TURRET: e` un Deployable che REAGISCE. Ha un profilo (BS, CC,
        // skill) e spara con l'arma fra parentesi del PORTATORE — "Armed
        // Turret (Combi Rifle)" — letta da M.armaTorretta (riga 6502). In CC
        // usa la sua PARA CC Weapon (-3). Appartiene a chi l'ha schierata.
        // (Decisione di Paolo: solo la torretta del regolamento. Chat REGOLE.)
        if (voce.armaDalProfilo) {
            const testoPortatore = ((portatore && portatore.weapon) || '') + ', ' + ((portatore && portatore.equip) || '');
            const at = M.armaTorretta({ nome: voce.nome, armaDalProfilo: true }, testoPortatore);
            (at.avvisi || []).forEach(function (a) { avvisi.push(a); });
            token.reagisce = true;
            token.bs = voce.bs; token.cc = voce.cc; token.ph = voce.ph; token.wip = voce.wip;
            token.skills = voce.skills || '';
            token.equip = voce.equip || '';
            token.weapon = at.arma ? at.arma.nome : '';
            token.ccWeapon = voce.ccWeapon || '';
            // Anche `armi`: e` il campo che l'interfaccia legge sul gettone
            // (sulle mine porta la munizione). Due nomi vicini con significati
            // diversi: qui si riempiono entrambi, cosi` chi legge l'uno o
            // l'altro trova l'arma. (Chat INTERFACCIA, 22 settembre.)
            token.armi = token.weapon;
            if (!at.arma) {
                avvisi.push(err('A61', `${voce.nome}: nessuna arma fra parentesi nel profilo del portatore.`,
                    'Il portatore dovrebbe avere "Armed Turret (<arma>)".'));
            }
        }

        if (ctx.ordineId == null) {
            avvisi.push(err('A71', 'Token creato senza `ordineId`.',
                'Senza, non si puo` escluderlo dai bersagli nell\'Ordine in cui e` stato piazzato (regolamento, riga 5532).'));
        }

        // --- il portatore, con l'uso scalato ---
        let portatoreAggiornato = portatore;
        if (usi) {
            const chiave = usi.chiaveUsi || arma.nome;
            portatoreAggiornato = Object.assign({}, portatore, {
                usiSpesi: Object.assign({}, (portatore && portatore.usiSpesi) || {},
                    { [chiave]: (((portatore && portatore.usiSpesi) || {})[chiave] || 0) + 1 })
            });
        }

        return { token, portatoreAggiornato, avvisi, errori };
    };

    // Un deployable che perde l'ultimo punto di STR va DIRETTAMENTE Morto:
    // niente Incosciente, nessuna Ferita in piu`, e si rimuove dal tavolo.
    M.deployableColpito = function (token) {
        if (!token || !token.deployable) return null;
        return {
            direttamenteMorto: true,
            passaDaIncosciente: false,
            rimuoviDalTavolo: true,
            motivo: 'Un Deployable che entra in Stato Incosciente passa automaticamente a Morto, senza Ferita aggiuntiva, e si rimuove dal tavolo.',
            fonte: 'regolamento, voce Deployable'
        };
    };


    // ==================================================================
    // PARTE 40: TRINCERARSI (SAPPER)
    // ------------------------------------------------------------------
    // Ordine Intero, nessun tiro. Il requisito — lo spazio dev'essere
    // grande almeno quanto la Silhouette dello Stato — l'app non lo puo`
    // verificare: non ha la mappa. Quindi lo chiede, e se la risposta e` no
    // la truppa esegue un IDLE, che e` cio` che dice il regolamento — non
    // "l'ordine non si esegue". (PARTE_1, righe 7415-7431)
    // ==================================================================

    M.puoTrincerarsi = function (unita) {
        const T = catalogo('TRINCERARSI');
        const s = skillsDi(unita);
        const st = M.statoBersaglio(unita);
        const blocchi = [];

        if (s.indexOf('SAPPER') < 0) {
            blocchi.push(`Serve l'Abilità ${T.skillRichiesta || 'Sapper'}.`);
        }
        if (st.foxhole) blocchi.push('È già in Stato Foxhole.');
        // 🔴 NON M.eNullo: qui si chiede "puo` agire". Posseduto e
        // Sepsitorizzato agiscono (per l'avversario); il Disconnesso no.
        if (st.morto || st.incosciente || st.disconnesso) blocchi.push('Non puo` agire: Morto, Incosciente o Disconnesso.');

        return {
            puo: blocchi.length === 0,
            blocchi: blocchi,
            motivo: blocchi.length ? blocchi[0] : null,
            tipo: T.tipo || 'LONG_SKILL',
            domanda: T.domanda || null,
            seRequisitoFallisce: T.seRequisitoFallisce || null
        };
    };

    // Esito dell'ordine, data la risposta sullo spazio.
    M.risolviTrincerarsi = function (unita, spazioSufficiente) {
        const T = catalogo('TRINCERARSI');
        const pre = M.puoTrincerarsi(unita);
        if (!pre.puo) {
            return { entra: false, idle: false, motivo: pre.motivo, blocchi: pre.blocchi };
        }
        if (spazioSufficiente === false) {
            // 🔴 NON "ordine annullato": la truppa esegue un Idle. L'Ordine
            // e` speso comunque, e va detto al giocatore.
            // E l'Idle da requisito fallito porta le sue conseguenze: genera
            // ARO, spende i Disposable, rivela i Marker.
            const idle = M.regoleIdle({ daRequisitoFallito: true });
            const cons = M.conseguenzeIdle(unita, null);
            return {
                entra: false, idle: true,
                motivo: T.seRequisitoFallisce,
                generaAro: idle.generaAro,
                note: ['L\'Ordine è comunque speso.']
                    .concat(idle.note).concat(cons.note)
            };
        }
        if (spazioSufficiente === undefined) {
            return { entra: false, idle: false, incompleto: true,
                     motivo: 'Manca la risposta sullo spazio disponibile.' };
        }
        const st = T.statoFoxhole || {};
        return {
            entra: true, idle: false,
            stato: 'foxhole',
            token: 'Foxhole Token accanto alla truppa.',
            note: [T.effetti ? T.effetti.turnoAttivo : null,
                   st.bonus || null,
                   st.bloccaAzioni ? `In Foxhole non si possono dichiarare: ${st.bloccaAzioni.join(', ')}.` : null,
                   st.fonte === 'DA VERIFICARE'
                       ? 'Gli effetti dello Stato Foxhole non sono stati riletti dalla scheda: da verificare.' : null
            ].filter(Boolean)
        };
    };


    // ==================================================================
    // PARTE 41: OSSERVAZIONE — Forward Observer, Sensor, Triangulated Fire
    // ------------------------------------------------------------------
    // 🔴 Si somigliano solo nel nome. Tipo di ordine, attributo, bersagli,
    // MOD applicati e perfino la necessita` della LoF sono diversi in tutte
    // e tre: una funzione sola avrebbe sbagliato due casi su tre.
    // ==================================================================

    M.haSkillOsservazione = function (unita, quale) {
        const s = skillsDi(unita);
        return s.indexOf(String(quale).toUpperCase()) >= 0;
    };

    // ---- FORWARD OBSERVER -------------------------------------------
    // Attacco BS con arma col Tratto BS Weapon (WIP). Invece del Tiro
    // Salvezza impone lo Stato Bersagliato. (riga 6190)
    M.regoleForwardObserver = function (attaccante, bersaglio, ctx) {
        ctx = ctx || {};
        const R = catalogo('OSSERVAZIONE')['FORWARD OBSERVER'] || {};
        const note = [], avvisi = [];

        if (!M.haSkillOsservazione(attaccante, 'FORWARD OBSERVER')) {
            return { valido: false, motivo: 'Serve l\'Abilità Forward Observer.' };
        }
        const arma = M.profiloArma(R.arma || 'Forward Observer');
        if (arma.nonTrovata) {
            avvisi.push(err('A72', 'Voce "Forward Observer" assente dal Weapon Chart.'));
        }

        // L'attributo e` WIP per il Tratto BS Weapon (WIP): modAttacco lo
        // legge gia` dai Tratti dell'arma, quindi non si forza qui.
        const e = M.modAttacco(attaccante, bersaglio, arma, M.AZIONI.FORWARD_OBSERVER, {
            rangeIndex: ctx.rangeIndex, rangeMod: ctx.rangeMod,
            cover: ctx.cover, terrain: ctx.terrain,
            livelloFireteam: ctx.livelloFireteam, fireteam: ctx.fireteam
        });
        e.avvisi.forEach(a => avvisi.push(a));
        e.note.forEach(n => note.push(n));

        if (R.effetto) note.push(R.effetto);
        if (R.token) note.push(R.token);

        return {
            valido: true, arma: arma,
            attributo: e.attributo, base: e.base, mod: e.mod, valore: e.valore,
            impossibile: e.valore < 1, critici: M.critici(e.valore),
            voci: e.voci, note: note, avvisi: avvisi,
            // 🔴 Nessun danno: il bersaglio non tira una salvezza, entra in
            // Stato Bersagliato. Dirlo qui evita che qualcuno ne calcoli una.
            statoInflitto: R.invecheDelDanno || 'targeted',
            salvezzaInflitta: { offensivo: false,
                                note: ['Forward Observer non infligge danno: impone lo Stato Bersagliato.'] }
        };
    };

    // ---- SENSOR ------------------------------------------------------
    // WIP+6, SENZA MOD di gittata ne` di Mimetismo, senza LoF e senza
    // designare un bersaglio: Scopre tutti insieme nella ZdC. (riga 7432)
    M.regoleSensor = function (attaccante, candidati, ctx) {
        ctx = ctx || {};
        const R = catalogo('OSSERVAZIONE')['SENSOR'] || {};
        const note = [], avvisi = [], voci = [];

        if (!M.haSkillOsservazione(attaccante, 'SENSOR')) {
            return { valido: false, motivo: 'Serve l\'Abilità Sensor.' };
        }

        const base = parseInt((attaccante && attaccante.wip), 10) || 0;
        voci.push({ fonte: 'base', valore: base, motivo: `WIP di ${M.nomeUnita(attaccante)}: ${base}` });
        const mod = R.modFisso || 6;
        voci.push({ fonte: 'sensor', valore: mod, motivo: `Sensor: +${mod} WIP` });

        // 🔴 Nessun MOD di gittata ne` di Mimetismo: il regolamento li esclude
        // per nome. Applicarli avrebbe dato al Sensor il -6 di un Mimetism (-6),
        // cioe` esattamente cio` che serve a scoprire.
        note.push('Nessun MOD di gittata né di Mimetismo: il regolamento li esclude.');
        note.push(R.portata || null);

        // Chi c'e` da scoprire: Nascosti e in CAMO, tutti insieme.
        const dentro = [], fuori = [];
        (candidati || M.rosterNemico()).forEach(function (u) {
            const st = M.statoBersaglio(u);
            if (st.hidden || st.camo || st.imp) dentro.push({ unita: u, nome: M.nomeUnita(u) });
            else fuori.push({ nome: M.nomeUnita(u), motivo: 'Non è Nascosto né in forma di Marker.' });
        });

        if (dentro.length === 0) {
            avvisi.push(err('A73', 'Nessun nemico Nascosto o in CAMO fra i candidati.',
                'Il Sensor si dichiara lo stesso, ma non c\'è nulla da Scoprire.'));
        }
        if (R.effettoContinuo) note.push(R.effettoContinuo);

        return {
            valido: true,
            attributo: 'WIP', base: base, mod: mod, valore: base + mod,
            impossibile: (base + mod) < 1, critici: M.critici(base + mod),
            voci: voci, note: note.filter(Boolean), avvisi: avvisi,
            // Un tiro solo, e li scopre TUTTI.
            scopreTutti: true, bersagli: dentro, esclusi: fuori,
            senzaLoF: true, senzaBersaglio: true
        };
    };

    // ---- TRIANGULATED FIRE -------------------------------------------
    // BS Attack senza ALCUN MOD al tiro. Le uniche eccezioni sono i MOD
    // al Burst. E non supera la Gittata Massima dell'arma. (riga 7854)
    M.regoleTriangulated = function (attaccante, bersaglio, arma, ctx) {
        ctx = ctx || {};
        const R = catalogo('OSSERVAZIONE')['TRIANGULATED FIRE'] || {};
        const note = [], avvisi = [];

        if (!M.haSkillOsservazione(attaccante, 'TRIANGULATED FIRE')) {
            return { valido: false, motivo: 'Serve l\'Abilità Triangulated Fire.' };
        }
        if (!arma || arma.nonTrovata) {
            return { valido: false, motivo: 'Nessuna arma BS scelta.' };
        }

        // 🔴 Il tiro e` il BS NUDO. Si calcolano comunque i MOD, ma solo per
        // MOSTRARE quali sono stati ignorati: nasconderli farebbe sembrare
        // che il calcolatore se li sia dimenticati.
        const conMod = M.modAttacco(attaccante, bersaglio, arma, M.AZIONI.BS_ATTACK, {
            rangeIndex: ctx.rangeIndex, rangeMod: ctx.rangeMod,
            cover: ctx.cover, terrain: ctx.terrain
        });
        const base = parseInt((attaccante && attaccante.bs), 10) || 0;
        const ignorati = conMod.voci.filter(function (v) { return v.fonte !== 'base' && v.valore !== 0; });

        // Il limite della Gittata Massima resta.
        let oltreGittata = false;
        if (arma.bands && arma.bands.length && typeof ctx.rangeIndex === 'number') {
            if (ctx.rangeIndex >= arma.bands.length) oltreGittata = true;
        }
        if (oltreGittata) {
            avvisi.push(err('A74', R.limiteGittata ||
                'Triangulated Fire non permette di colpire oltre la Gittata Massima dell\'arma.'));
        }

        note.push(R.effetto || null);
        note.push(R.limiteGittata || null);
        if (ignorati.length) {
            note.push('MOD ignorati dal Triangulated Fire: ' +
                ignorati.map(v => `${v.motivo} (${v.valore > 0 ? '+' : ''}${v.valore})`).join('; ') + '.');
        }

        return {
            valido: true, arma: arma,
            attributo: 'BS', base: base, mod: 0, valore: base,
            impossibile: base < 1, critici: M.critici(base),
            voci: [{ fonte: 'base', valore: base, motivo: `BS di ${M.nomeUnita(attaccante)}: ${base}` }],
            modIgnorati: ignorati,
            valoreConMod: conMod.valore,
            oltreGittata: oltreGittata,
            note: note.filter(Boolean), avvisi: avvisi
        };
    };


    // ==================================================================
    // PARTE 42: INGRESSO IN CAMPO e REQUEST SPEEDBALL
    // ------------------------------------------------------------------
    // Due cose che il regolamento tratta diversamente da come le tratta
    // l'intuito:
    //
    // 🔴 Fallire l'Ingresso in Campo NON significa "non entri": entri lo
    //    stesso, ma nella tua Zona di Schieramento, a contatto col bordo.
    //    Un "non puoi entrare" farebbe perdere un Ordine che invece e`
    //    servito a qualcosa.
    //
    // 🔴 Lo Speedball NON e` un Ordine: e` un'Abilita` Automatica, e il
    //    tiro e` un PH FISSO a 14 — non quello della truppa.
    // ==================================================================

    M.regoleIngressoInCampo = function (unita, ctx) {
        ctx = ctx || {};
        const R = catalogo('INGRESSO_IN_CAMPO') || {};
        const s = skillsDi(unita);
        const note = [], avvisi = [];

        const ha = (R.skillRichieste || []).some(function (k) {
            return s.indexOf(String(k).toUpperCase()) >= 0;
        });
        if (!ha) {
            return { valido: false,
                     motivo: `Serve un'Abilità di Schieramento Aereo: ${(R.skillRichieste || []).join(', ')}.` };
        }

        // "Combat Jump (PH=10)" sostituisce il PH di profilo.
        const attr = M.attributoEffettivo(unita, 'PH', 'Combat Jump');
        const base = attr.valore;
        if (attr.sostituito) note.push(attr.motivo);

        note.push(R.fuoriTavolo || null);
        // 🔴 Vale comunque, riuscito o fallito.
        if (R.restrizione) note.push(R.restrizione);
        if (R.dopoIlTiro) note.push(R.dopoIlTiro);

        return {
            valido: true,
            attributo: 'PH', base: base, mod: 0, valore: base,
            impossibile: base < 1, critici: M.critici(base),
            voci: [{ fonte: 'base', valore: base, motivo: `PH di ${M.nomeUnita(unita)}: ${base}` }],
            divieti: R.divieti || [],
            domanda: R.domanda || null,
            // Cosa succede fallendo: si dice PRIMA di tirare.
            seFallisce: R.seFallisce || null,
            note: note.filter(Boolean), avvisi: avvisi
        };
    };

    // La Speedball Chart: da un tiro all'oggetto.
    M.oggettoSpeedball = function (tiro) {
        const S = catalogo('SPEEDBALL') || {};
        const n = parseInt(tiro, 10);
        if (!isFinite(n)) return { oggetto: null, avviso: err('A75', 'Tiro non valido per la Speedball Chart.') };
        const voce = (S.chart || []).find(function (r) { return n >= r.da && n <= r.a; });
        if (!voce) {
            return { oggetto: null,
                     avviso: err('A75', `Il tiro ${n} non è nella Speedball Chart (1-20).`) };
        }
        return { oggetto: voce.oggetto, effetto: (S.oggetti || {})[voce.oggetto] || null, banda: `${voce.da}-${voce.a}` };
    };

    M.regoleSpeedball = function (unita, ctx) {
        ctx = ctx || {};
        const S = catalogo('SPEEDBALL') || {};
        const note = [], avvisi = [];

        // 🔴 Il PH e` FISSO a 14: non dipende dalla truppa che lo richiede.
        const valore = S.phFisso || 14;
        note.push(S.notePH || null);
        note.push(S.quando || null);
        note.push(S.requisito || null);
        note.push(S.primoToken ? `Primo Token: ${S.primoToken}` : null);
        note.push(S.secondoToken ? `Secondo Token: ${S.secondoToken}` : null);
        note.push(S.noDeactivator || null);
        note.push(S.unoAllaVolta || null);

        if (ctx.tokenDisponibili != null && ctx.tokenDisponibili < (S.token || 2)) {
            avvisi.push(err('A76',
                `Servono ${S.token || 2} Speedball Token, ne risultano ${ctx.tokenDisponibili}.`));
        }

        return {
            valido: true,
            tipo: S.tipo || 'AUTOMATIC_SKILL',
            nonEUnOrdine: true,
            attributo: 'PH', base: valore, mod: 0, valore: valore,
            phFisso: true,
            critici: M.critici(valore),
            voci: [{ fonte: 'regola', valore: valore, motivo: `PH fisso ${valore}: non quello della truppa` }],
            token: S.token || 2,
            chart: S.chart || [],
            oggetti: S.oggetti || {},
            divieti: S.divieti || [],
            note: note.filter(Boolean), avvisi: avvisi
        };
    };


    // ==================================================================
    // PARTE 43: NO COVER e LIMITED COVER
    // ------------------------------------------------------------------
    // 🔴 Sembrano la stessa skill e non lo sono:
    //   No Cover       "do not benefit from Partial Cover MODs"  -> cadono
    //                  ENTRAMBI: il -3 al tiro nemico E il +3 ARM.
    //   Limited Cover  "do not apply the -3 BS MOD"              -> cade
    //                  SOLO il -3. Il +3 ARM resta.
    // Trattarle uguali regalava sei punti al Morlock su ogni scambio:
    // il nemico subiva un -3 che non doveva, e il Morlock si salvava con
    // un +3 che non gli spetta.
    // ==================================================================

    M.coperturaSkill = function (unita) {
        const C = catalogo('COPERTURA_SKILL') || {};
        const s = skillsDi(unita);
        // Con entrambe vince la piu` severa.
        if (s.indexOf('NO COVER') >= 0) return Object.assign({ skill: 'No Cover' }, C['No Cover']);
        if (s.indexOf('LIMITED COVER') >= 0) return Object.assign({ skill: 'Limited Cover' }, C['Limited Cover']);
        return null;
    };


    // ==================================================================
    // PARTE 44: HIDDEN DEPLOYMENT e CLIMBING PLUS
    // ==================================================================

    // 🔴 Una Sagoma NON sceglie un bersaglio: colpisce un'area. Quindi
    // l'esclusione dai bersagli non basta — va detto a parte che chi e` in
    // Hidden Deployment non viene colpito nemmeno per area.
    // "does not affect LoF, is not affected by Template Weapons"
    M.colpitoDaSagoma = function (unita) {
        const st = M.statoBersaglio(unita);
        if (st.hidden) {
            return { colpito: false,
                     motivo: 'In Hidden Deployment: non è sul tavolo, le Sagome non lo colpiscono.',
                     fonte: 'regolamento, p.94' };
        }
        return { colpito: true };
    };

    // Chi sta sotto una Sagoma, escludendo chi non c'e`.
    M.bersagliSottoSagoma = function (candidati) {
        return (candidati || []).map(function (u) {
            const e = M.colpitoDaSagoma(u);
            return { unita: u, nome: M.nomeUnita(u), colpito: e.colpito, motivo: e.motivo || null };
        });
    };

    // Climbing Plus: la scalata diventa un'Abilita` BREVE.
    // Senza, SALTO e` un Ordine Intero.
    M.tipoScalata = function (unita) {
        const ha = skillsDi(unita).indexOf('CLIMBING PLUS') >= 0;
        return {
            tipo: ha ? 'SHORT_SKILL' : 'LONG_SKILL',
            climbingPlus: ha,
            nota: ha
                ? 'Climbing Plus: la scalata è un\'Abilità Breve, quindi mezzo Ordine. Con la seconda Abilità si può continuare a muovere o dichiarare altro.'
                : 'Senza Climbing Plus la scalata è un Ordine Intero.',
            fonte: 'regolamento, p.87'
        };
    };


    // ==================================================================
    // PARTE 45: L'IDLE DA REQUISITO FALLITO
    // ------------------------------------------------------------------
    // 🔴 L'Idle GENERA ARO: "its declaration just activates the Trooper,
    // potentially generating AROs." (p.80)
    //
    // E quando nasce da un requisito non soddisfatto porta due conseguenze
    // che e` facile dimenticare, perche` "non hai fatto niente" suggerisce
    // che non sia successo niente:
    //   - le munizioni Disposable sono comunque SPESE;
    //   - una truppa in forma di Marker viene RIVELATA.
    // ==================================================================

    M.regoleIdle = function (ctx) {
        ctx = ctx || {};
        const I = (catalogo('MOVIMENTO').senzaTiro || {})['IDLE'] || {};
        const note = [I.note || null];

        if (ctx.daRequisitoFallito) {
            (I.seDaRequisitoFallito || []).forEach(function (n) { note.push(n); });
        }
        return {
            generaAro: I.generaAro !== false,
            daRequisitoFallito: !!ctx.daRequisitoFallito,
            spendeDisposable: !!ctx.daRequisitoFallito,
            rivelaMarker: !!ctx.daRequisitoFallito,
            note: note.filter(Boolean),
            fonte: I.fonte || null
        };
    };

    // 🔴 CHI APPLICA LE CONSEGUENZE.
    // La risposta e` la stessa di creaDeployable: il motore calcola l'unita`
    // AGGIORNATA e la restituisce, l'app la sostituisce. Cosi` la regola —
    // "rivelata e sostituita col Modello" — vive in un posto solo, e
    // l'interfaccia non deve sapere che rivelare significa toccare
    // deployState, state E states.camo insieme.
    //
    // conseguenzeIdle() resta e dice COSA cambia, per chi vuole solo
    // mostrarlo; applicaIdle() produce l'oggetto nuovo.
    M.applicaIdle = function (unita, arma, ctx) {
        ctx = ctx || {};
        const c = M.conseguenzeIdle(unita, arma);
        const mutazioni = [];
        let u = Object.assign({}, unita);

        // La rivelazione tocca TRE campi, non uno: chi ne scrivesse solo uno
        // lascerebbe l'unita` per meta` Marker.
        if (c.rivelata) {
            u.deployState = 'NORMAL';
            u.state = (u.state === 'CAMO' || u.state === 'IMP') ? 'ACTIVE' : u.state;
            u.states = Object.assign({}, u.states || {}, { camo: false, impersonation: false });
            mutazioni.push({ campo: 'deployState', da: unita.deployState || null, a: 'NORMAL' });
            mutazioni.push({ campo: 'states.camo', da: !!(unita.states && unita.states.camo), a: false });
        }

        // Il Disposable: un uso speso, sulla chiave condivisa fra le modalita`.
        if (c.usiSpesi && arma) {
            const chiave = (M.usiResidui(unita, arma) || {}).chiaveUsi || arma.nome;
            const prima = ((unita.usiSpesi || {})[chiave] || 0);
            u.usiSpesi = Object.assign({}, unita.usiSpesi || {}, { [chiave]: prima + 1 });
            mutazioni.push({ campo: `usiSpesi.${chiave}`, da: prima, a: prima + 1 });
        }

        return {
            unitaAggiornata: u,
            mutazioni: mutazioni,
            conseguenze: c,
            note: c.note,
            // Vuoto quando l'Idle e` SCELTO: niente da applicare.
            daApplicare: mutazioni.length > 0
        };
    };

    // Un Ordine gia` dichiarato che diventa Idle nel Passo di Risoluzione.
    // 🔴 NON e` un annullamento: l'ARO resta, le conseguenze si applicano,
    // l'Ordine e` speso. E` una CONVERSIONE, e il payload deve dirlo cosi`
    // — un "annulla" farebbe credere che si torni indietro.
    M.convertiInIdle = function (payloadOriginale, unita, arma, motivo) {
        const idle = M.regoleIdle({ daRequisitoFallito: true });
        const app = M.applicaIdle(unita, arma, {});
        return {
            azione: 'IDLE',
            attaccante: app.unitaAggiornata,
            arma: arma || null,
            bersagli: [],
            burstDisponibile: 0,
            regole: {
                senzaTiro: true,
                daRequisitoFallito: true,
                // Non annulla: converte. L'Ordine originale resta speso.
                convertitoDa: (payloadOriginale && payloadOriginale.azione) || null,
                ordineSpeso: true,
                motivo: motivo || 'Requisiti non soddisfatti nel Passo di Risoluzione.',
                generaAro: idle.generaAro,
                mutazioni: app.mutazioni,
                unitaAggiornata: app.unitaAggiornata,
                note: idle.note.concat(app.note)
            }
        };
    };

    // Cosa cambia sull'unita` quando l'Idle nasce da un requisito fallito.
    M.conseguenzeIdle = function (unita, arma) {
        const e = { usiSpesi: null, rivelata: false, note: [] };
        const st = M.statoBersaglio(unita);

        const usi = arma ? M.usiResidui(unita, arma) : null;
        if (usi) {
            e.usiSpesi = { arma: arma.nome, prima: usi.residui, dopo: Math.max(0, usi.residui - 1) };
            e.note.push(`${arma.nome}: un uso Disposable è speso comunque.`);
        }
        if (st.camo || st.imp) {
            e.rivelata = true;
            e.note.push('In forma di Marker: viene rivelata e sostituita col Modello.');
        }
        return e;
    };


    // ==================================================================
    // PARTE 46: CHIAVI, ALIAS, VOCI
    // ------------------------------------------------------------------
    // 🔴 Object.keys(RULES_WEAPONS) conta le CHIAVI, non le armi: 200
    // chiavi, 19 alias, 181 voci distinte. Sembra la cosa ovvia da fare, e
    // per questo l'errore e` ricomparso due volte a tre settimane di
    // distanza — una per parte.
    //
    // La cura non e` una seconda lista da mantenere: gli alias sono gia`
    // dichiarati in RULES_WEAPONS_ALIAS, che e` la fonte. Qui si DERIVA,
    // cosi` non c'e` niente che possa divergere.
    // ==================================================================

    // Le sole chiavi non-alias.
    M.armiCanoniche = function () {
        const W = G.RULES_WEAPONS || {};
        const A = G.RULES_WEAPONS_ALIAS || {};
        // Regge sia con gli alias enumerabili sia senza: nel secondo caso
        // Object.keys non li vede gia`, e il filtro non toglie nulla.
        return Object.keys(W).filter(function (k) { return !(k in A); });
    };

    // Le voci arma vere: canoniche meno i contenitori con modalita`.
    M.armiVere = function () {
        const W = G.RULES_WEAPONS || {};
        return M.armiCanoniche().filter(function (k) { return !W[k].modalita; });
    };

    M.contenitoriArma = function () {
        const W = G.RULES_WEAPONS || {};
        return M.armiCanoniche().filter(function (k) { return !!W[k].modalita; });
    };

    // Il conto, per chi vuole verificarlo invece di fidarsi.
    // 🔴 La relazione, non i valori: chiavi - alias = voci distinte. Regge
    // anche quando il database cresce, e se un giorno non torna significa
    // che c'e` un doppione NON dichiarato in RULES_WEAPONS_ALIAS.
    M.contaArmi = function () {
        const W = G.RULES_WEAPONS || {};
        const A = G.RULES_WEAPONS_ALIAS || {};

        // 🔴 Gli alias possono essere ENUMERABILI o no, e il conto deve
        // reggere in entrambi i casi. Sottrarre sempre 19 era giusto solo
        // finche` Object.keys li includeva: se diventano non enumerabili,
        // sottrarli di nuovo li conta due volte.
        // Si misura quanti ne vede DAVVERO Object.keys, invece di assumerlo.
        const chiavi = Object.keys(W).length;
        const aliasDichiarati = Object.keys(A).length;
        const aliasEnumerabili = Object.keys(W).filter(function (k) { return k in A; }).length;
        const distinti = new Set(Object.keys(W).map(function (k) { return W[k]; })).size;
        const contenitori = M.contenitoriArma().length;

        const coerente = (chiavi - aliasEnumerabili) === distinti;
        return {
            chiavi: chiavi,
            alias: aliasDichiarati,
            aliasEnumerabili: aliasEnumerabili,
            aliasNascosti: aliasEnumerabili === 0 && aliasDichiarati > 0,
            distinti: distinti,
            contenitori: contenitori, armiVere: distinti - contenitori,
            coerente: coerente,
            avviso: coerente ? null : err('A77',
                `Conteggio armi incoerente: ${chiavi} chiavi - ${aliasEnumerabili} alias enumerabili = ${chiavi - aliasEnumerabili}, ma le voci distinte sono ${distinti}.`,
                'C\'è un doppione non dichiarato in RULES_WEAPONS_ALIAS.')
        };
    };


    // ==================================================================
    // PARTE 47: IL PULSANTE DI CALCOLO
    // ------------------------------------------------------------------
    // 🔴 Quattordici moduli clonavano il pulsante con cloneNode(true) e ne
    // riscrivevano onclick ed etichetta, DANDO PER SCONTATO lo stato
    // lasciato da chi aveva usato la schermata prima.
    //
    // ordine_movimento.js lo nasconde — giustamente, li` non c'e` nulla da
    // calcolare — e cloneNode(true) copia lo style inline: il clone
    // nasceva gia` display:none. Etichetta giusta, onclick funzionante,
    // invisibile. Bastava un ordine di puro movimento a inizio partita per
    // rendere non calcolabile tutto il resto della sessione.
    //
    // La cura non e` ripristinare il display in ordine_movimento: chi
    // nasconde qualcosa che non possiede non puo` sapere chi la usera`
    // dopo. La cura e` che chi MOSTRA un calcolo lo renda visibile
    // esplicitamente, invece di ereditare uno stato che non controlla.
    // ==================================================================

    M.pulsanteCalcolo = function (opzioni) {
        opzioni = opzioni || {};
        if (typeof document === 'undefined') return null;

        const btn = document.getElementById('btn-esegui-calcolo') ||
                    document.querySelector('#step-modifiers .huge-btn');
        if (!btn) return null;

        // Il clone serve a buttare via i vecchi listener.
        const nuovo = btn.cloneNode(true);
        if (btn.parentNode) btn.parentNode.replaceChild(nuovo, btn);

        // 🔴 SEMPRE esplicito, in entrambi i versi: mai ereditato.
        nuovo.style.display = (opzioni.nascondi === true) ? 'none' : '';
        if (opzioni.etichetta) nuovo.innerText = opzioni.etichetta;
        nuovo.disabled = !!opzioni.disabilitato;
        nuovo.style.opacity = opzioni.disabilitato ? '0.5' : '';
        if (typeof opzioni.onclick === 'function') {
            nuovo.onclick = function () {
                if (opzioni.disabilitato) return;
                opzioni.onclick();
            };
        }
        return nuovo;
    };


    // ==================================================================
    // PARTE 48: BERSAGLI DICHIARATI DALL'ARMA
    // ------------------------------------------------------------------
    // 🔴 Il nome del modo di risoluzione — CONTATTO_STRUTTURA — faceva
    // credere "solo strutture". Le D-Charges in Demolition Mode colpiscono
    // anche nemici Immobilizzati o in stato Nullo, e mai Sepsitorizzati o
    // Posseduti (REGOLE_N5_v5_1_1.txt righe 6036, 6043-6046).
    // Il filtro legge i campi che l'arma DICHIARA, invece di dedurre dal nome.
    // Se il motore non li leggesse, resterebbero dati morti — come RULES_AMMO.
    // ==================================================================
    M.bersaglioAmmessoDaArma = function (arma, bersaglio) {
        const W = G.RULES_WEAPONS || {};
        const voce = (arma && (W[arma.nome] || arma)) || {};
        const ammessi = voce.bersagliAmmessi;
        const esclusi = voce.bersagliEsclusi;
        if (!Array.isArray(ammessi) && !Array.isArray(esclusi)) {
            return { dichiarato: false, ammesso: true };
        }
        const st = M.statoBersaglio(bersaglio);
        const tipo = String((bersaglio && (bersaglio.tipoScena || bersaglio.tipo)) || '').toUpperCase();
        const categorie = [];
        if (tipo === 'STRUTTURA' || (bersaglio && bersaglio.struttura)) categorie.push('STRUTTURA');
        if (tipo === 'EDIFICIO' || (bersaglio && bersaglio.edificio)) categorie.push('EDIFICIO');
        if (st.immA || st.immB) categorie.push('NEMICO_IMMOBILIZZATO');
        // riga 6036. Posseduto e Sepsitorizzato restano esclusi da
        // bersagliEsclusi, che vince: in pratica si aggiunge il Disconnesso.
        if (M.eNullo(bersaglio)) categorie.push('NEMICO_NULL');
        if (st.sepsitorizzato) categorie.push('SEPSITORIZZATO');
        if (st.posseduto) categorie.push('POSSEDUTO');

        if (Array.isArray(esclusi) && categorie.some(c => esclusi.indexOf(c) >= 0)) {
            return { dichiarato: true, ammesso: false,
                     motivo: `Bersaglio escluso dall'arma: ${categorie.filter(c => esclusi.indexOf(c) >= 0).join(', ')}.` };
        }
        if (Array.isArray(ammessi) && !categorie.some(c => ammessi.indexOf(c) >= 0)) {
            return { dichiarato: true, ammesso: false,
                     motivo: `L'arma colpisce solo: ${ammessi.join(', ')}.` };
        }
        return { dichiarato: true, ammesso: true };
    };


    // ==================================================================
    // PARTE 49: M.eNullo — la nullita` DAL FLAG, non da una lista a mano
    // ------------------------------------------------------------------
    // 🔴 Il flag statoNullo del catalogo non lo leggeva nessuno: il motore
    // scriveva `morto || incosciente` in otto punti. Gli stati Null per
    // regola sono CINQUE (Morto, Disconnesso, Posseduto, Sepsitorizzato,
    // Incosciente).
    // ⚠️ "Null" vuol dire SOLO niente Ordini ne` Punti Vittoria (riga 14910).
    // NON "non agisce": usarla dove si chiede "puo` agire" e` sbagliato —
    // Posseduto e Sepsitorizzato agiscono per l'avversario. Per quelle
    // domande resta la lista esplicita. (Chat REGOLE, 21 settembre.)
    // ==================================================================
    M.eNullo = function (unita) {
        return (M.statiDiCatalogo(unita) || []).some(function (s) {
            const voce = (catalogo('STATI') || {})[s.stato] || s;
            return voce.statoNullo === true;
        });
    };


    // Il reattivo in Soppressione che risponde in modo normale: la
    // Soppressione si annulla. Il motore calcola l'unita` AGGIORNATA, l'app
    // la sostituisce — lo stesso schema di applicaIdle e creaDeployable.
    M.annullaSoppressione = function (unita) {
        const u = Object.assign({}, unita);
        u.states = Object.assign({}, unita.states || {}, { suppressive: false });
        return {
            unitaAggiornata: u,
            mutazioni: [{ campo: 'states.suppressive', da: !!(unita.states && unita.states.suppressive), a: false }],
            nota: 'Risposto in modo normale: la Soppressione si annulla.'
        };
    };


    // ==================================================================
    // PARTE 50: LO STATO DOPO LA DICHIARAZIONE DI UN'ABILITA`
    // ------------------------------------------------------------------
    // M.statoDopoAbilita(unita, abilita, ctx) -> {
    //     unitaAggiornata,          // copia: l'app la sostituisce
    //     prima: { deployState, marker },
    //     dopo:  { deployState, marker, modMarker, sulTavolo },
    //     mutazioni: [{ campo, da, a }],
    //     note: [], fonti: []
    // }
    //   abilita: nome dell'azione come la usa il motore ('MOVIMENTO CAUTO',
    //            'ATTACCO BS', 'IDLE'...), anche in forma non canonica.
    //   ctx.inAro:                     la dichiarazione e` un ARO
    //   ctx.ritardaAroControMarker:    ritarda l'ARO contro un Marker
    //   ctx.impedisceMarkerNemico:     impedisce a un nemico di entrare in
    //                                  stato Marker
    //   marker: 'CAMO' | 'IMP' | null — il Marker Mimetico e` UNO solo e
    //   mostra il Mimetism (-N) del profilo (riga 13607): modMarker.
    //
    // HIDDEN DEPLOYMENT (righe 13915-13922):
    //  - si cancella con QUALUNQUE Ordine o ARO dichiarato (13915);
    //  - chi ha una skill da Marker (Camouflage, Impersonation) RESTA in
    //    forma di Marker se dichiara Movimento Cauto o un'Abilita` Corta Base
    //    senza tiro, se ritarda l'ARO contro un Marker, o se impedisce a un
    //    nemico di entrare in stato Marker (13917-13920);
    //  - altrimenti anche il Marker cade: si piazza il modello (13921).
    // CAMUFFATO (righe 13634-13637): cade se dichiara un Attacco, Look Out!,
    //  un'Abilita` con tiro, o un'Abilita` Lunga diversa dal Movimento Cauto.
    // (Richiesta della chat TEST per la regola della chat REGOLE, 21 sett.)
    // ==================================================================
    M.statoDopoAbilita = function (unita, abilita, ctx) {
        ctx = ctx || {};
        unita = unita || {};
        const deploy = String(unita.deployState || 'NORMAL').toUpperCase();
        const st = unita.states || {};
        const sk = skillsDi(unita);
        const az = String(abilita || '').toUpperCase().trim();
        const note = [], fonti = [];

        const eCauto = az === 'MOVIMENTO CAUTO' || az === 'CAUTIOUS MOVEMENT' || az === 'CAUTIOUS_MOVEMENT';
        const senza = M.azioneSenzaTiro ? M.azioneSenzaTiro(az) : null;
        // "Basic Short Skill senza tiro" — ma NON Look Out! (righe 13917-13918;
        // chat REGOLE). Oggi il catalogo non la classifica Corta Base, quindi
        // non cambierebbe nulla: l'esclusione e` scritta perche` non dipenda
        // da una classificazione che potrebbe cambiare.
        const eLookOut = /LOOK OUT/.test(az);
        const eCortaBaseSenzaTiro = !!(senza && senza.tipo === 'BASIC_SHORT') && !eLookOut;
        const spec = M.SPEC ? M.SPEC[M.azioneCanonica(az) || az] : null;
        const conTiro = !!(spec && spec.attributo) || /LOOK OUT/.test(az);
        const eLunga = !!(senza && senza.tipo === 'LONG') || !!(spec && spec.tipo === 'LONG');

        const skillMarker = /CAMOUFLAGE/.test(sk) ? 'CAMO' : (/IMPERSONATION/.test(sk) ? 'IMP' : null);
        const markerPrima = (deploy === 'CAMO' || st.camo) ? 'CAMO'
                          : ((deploy === 'IMP' || st.impersonation) ? 'IMP' : null);
        const prima = { deployState: deploy, marker: deploy === 'HIDDEN' ? null : markerPrima };

        let deployDopo = deploy, markerDopo = prima.marker;

        let daVerificare = false;
        // SOLO l'Hidden Deployment: Riserva e Airborne, che il flag `hidden`
        // raccoglie insieme, non passano di qui (chat REGOLE).
        if (deploy === 'HIDDEN' && ctx.scoperto) {
            // Scoperta da una skill che lo permette (Sensor): HD cancellato, e il
            // pezzo si piazza come MODELLO. Scoprire = rivelare (wiki "Sensor",
            // N5.3), e la lista che permette di restare Marker (righe
            // 13914-13921) elenca solo cose DICHIARATE dalla truppa.
            // Chat REGOLE, 23 settembre.
            deployDopo = 'NORMAL'; markerDopo = null;
            fonti.push('righe 13914-13921', 'wiki Sensor N5.3');
            note.push('Hidden Deployment scoperto: si piazza come Modello.');
        } else if (deploy === 'HIDDEN') {
            fonti.push('riga 13915');
            const tieneMarker = eCauto || eCortaBaseSenzaTiro ||
                                !!ctx.ritardaAroControMarker || !!ctx.impedisceMarkerNemico;
            if (skillMarker && tieneMarker) {
                deployDopo = skillMarker; markerDopo = skillMarker;
                fonti.push('righe 13917-13920');
                note.push(`Hidden Deployment cancellato: resta in forma di Marker (${skillMarker}).`);
            } else {
                deployDopo = 'NORMAL'; markerDopo = null;
                if (skillMarker) fonti.push('riga 13921');
                note.push('Hidden Deployment cancellato: si piazza il modello nella posizione annotata.');
            }
        } else if (prima.marker === 'CAMO') {
            const cade = conTiro || (eLunga && !eCauto);
            if (cade) {
                deployDopo = 'NORMAL'; markerDopo = null;
                fonti.push('righe 13634-13635');
                note.push('Stato CAMO cancellato: si sostituisce il Marker col modello.');
            }
        }

        const u = Object.assign({}, unita);
        u.deployState = deployDopo;
        // Il campo singolare `state` (vecchio) va tenuto coerente: lasciarlo a
        // "HIDDEN" mentre deployState dice altro e` un campo che mente, e il
        // difetto unit.state contro unit.states e` nato cosi`. (Chat TEST.)
        if (Object.prototype.hasOwnProperty.call(unita, 'state')) u.state = deployDopo;
        u.states = Object.assign({}, st, { camo: markerDopo === 'CAMO', impersonation: markerDopo === 'IMP' });
        if (deploy === 'HIDDEN') u.states.hidden = false;

        const mutazioni = [];
        if (deploy !== deployDopo) mutazioni.push({ campo: 'deployState', da: deploy, a: deployDopo });
        if (!!st.camo !== (markerDopo === 'CAMO')) mutazioni.push({ campo: 'states.camo', da: !!st.camo, a: markerDopo === 'CAMO' });
        if (!!st.impersonation !== (markerDopo === 'IMP')) mutazioni.push({ campo: 'states.impersonation', da: !!st.impersonation, a: markerDopo === 'IMP' });

        const modMarker = markerDopo ? (M.valoreMimetismo ? (M.valoreMimetismo(unita) || 0) : 0) : 0;
        return {
            unitaAggiornata: u,
            prima: prima,
            dopo: { deployState: deployDopo, marker: markerDopo, modMarker: modMarker, sulTavolo: true,
                    daVerificare: daVerificare },
            mutazioni: mutazioni, note: note, fonti: fonti
        };
    };


    // ==================================================================
    // PARTE 51: CAMOUFLAGE (1 USE)
    // ------------------------------------------------------------------
    // Non e` nel testo 5.1.1: il significato lo da` la FAQ F07 (wiki
    // "Camouflaged State", 0.0.0). Lo stato CAMO si usa UNA volta per
    // partita. Schierata come Modello, la truppa puo` entrarci piu` tardi;
    // se ha tentato di schierarsi come Marker e ha fallito l'Infiltrazione,
    // l'uso e` consumato. Il contatore sta sull'unita`: `camoUsato`.
    // (Chat REGOLE, 21 settembre.)
    // ==================================================================
    M.camoUnUso = function (unita) {
        // "Camouflage (1 Use)" (N5) e "Limited Camouflage" (nome N4, che il
        // catalogo tiene come alias). Prima l'alias c'era nel catalogo ma
        // qui non si leggeva: nessun profilo lo usa, ma non doveva divergere.
        return /CAMOUFLAGE\s*[\(\[]\s*1\s*USE|LIMITED CAMOUFLAGE/.test(skillsDi(unita));
    };

    M.puoEntrareInCamo = function (unita) {
        const sk = skillsDi(unita);
        const st = M.statoBersaglio(unita || {});
        if (!/CAMOUFLAGE/.test(sk) && String((unita && unita.tipo) || '').toUpperCase() !== 'MARKER') {
            return { puo: false, motivo: 'Nessuna skill di Camouflage.' };
        }
        if (M.camoUnUso(unita) && unita.camoUsato && !st.camo) {
            return { puo: false, unUso: true,
                     motivo: 'Camouflage (1 Use): lo stato CAMO è già stato usato in questa partita (F07).' };
        }
        return { puo: true, unUso: M.camoUnUso(unita) };
    };

    // Da chiamare quando l'unita` ENTRA in CAMO, o quando fallisce
    // l'Infiltrazione tentando di schierarsi come Marker (F07). Restituisce
    // l'unita` aggiornata: l'app la sostituisce, come applicaIdle.
    M.consumaCamo = function (unita) {
        if (!M.camoUnUso(unita)) return { unitaAggiornata: unita, mutazioni: [] };
        const u = Object.assign({}, unita, { camoUsato: true });
        return { unitaAggiornata: u,
                 mutazioni: [{ campo: 'camoUsato', da: !!unita.camoUsato, a: true }] };
    };


    // La Armed Turret si rimuove quando le Ferite raggiungono la STR (riga
    // 6505). Non attiva altri Deployable (riga 6509): lo garantisce gia`
    // innescoDeployable, che non innesca mai contro un altro Deployable.
    M.torrettaRimossa = function (token, ferite) {
        const str = parseInt(token && token.str, 10);
        return !!(token && token.reagisce) && isFinite(str) && (parseInt(ferite, 10) || 0) >= str;
    };


    // ==================================================================
    // PARTE 51: MINELAYER (regolamento riga 9125)
    // ------------------------------------------------------------------
    // Deployment Skill, facoltativa. Quando la truppa si schiera puo`
    // piazzare un'arma Deployable nella propria ZdC; Disposable -> l'uso si
    // scala. "Minelayer (N)" -> N pezzi. Se si schiera con un'abilita` di
    // Schieramento Superiore e FALLISCE il tiro, perde anche il Deployable.
    // I due requisiti sono geometria del tavolo: l'app non li vede, li
    // conferma il giocatore rispondendo alle domande del catalogo.
    //
    // M.opzioniMinelayer(unita)            -> { ha, pezzi, usati, restanti, armi, domande }
    // M.piazzaConMinelayer(unita, arma, r) -> { token, portatoreAggiornato, avvisi, errori }
    //    r = { nemiciNellArea: false, dentroZona: true } — le due risposte
    // M.minelayerTiroFallito(unita, arma)  -> { portatoreAggiornato, nota }
    // (Il canale Deployable ora esiste: era il pezzo che mancava.)
    // ==================================================================
    M.opzioniMinelayer = function (unita) {
        const sk = skillsDi(unita);
        const m = /MINELAYER(?:\s*\(\s*(\d+)\s*\))?/.exec(sk);
        const C = catalogo('MINELAYER') || {};
        if (!m) return { ha: false, pezzi: 0, usati: 0, restanti: 0, armi: [], domande: [] };
        const pezzi = m[1] ? parseInt(m[1], 10) : 1;
        const usati = parseInt(unita && unita.minelayerUsati, 10) || 0;
        const testo = ((unita && unita.weapon) || '') + ', ' + ((unita && unita.equip) || '');
        // Stessa funzione di armiPiazzabili: una regola sola per "cosa si piazza".
        const armi = testo.split(',').map(function (x) { return normalizza(x); }).filter(Boolean)
            .map(function (n) { return M.piazzabileDaVoce(n); })
            .filter(function (a) { return !!a; })
            .filter(function (a, i, arr) { return arr.findIndex(function (b) { return b.nome === a.nome; }) === i; })
            .map(function (a) {
                const u = M.usiResidui ? M.usiResidui(unita, a) : null;
                return { nome: a.nome, usiResidui: u ? u.residui : null,
                         disponibile: !u || u.residui == null || u.residui > 0 };
            });
        return { ha: true, pezzi: pezzi, usati: usati, restanti: Math.max(0, pezzi - usati),
                 armi: armi, domande: (C.domande || []).slice(), requisiti: (C.requisiti || []).slice() };
    };

    M.piazzaConMinelayer = function (unita, nomeArma, risposte) {
        risposte = risposte || {};
        const op = M.opzioniMinelayer(unita);
        const errori = [];
        if (!op.ha) errori.push(err('E50', 'La truppa non ha Minelayer.'));
        else if (op.restanti <= 0) errori.push(err('E51', `Minelayer: già piazzati ${op.usati} su ${op.pezzi}.`));
        const scelta = op.armi.find(function (a) { return a.nome === M.profiloArma(nomeArma).nome; });
        if (op.ha && !scelta) errori.push(err('E52', `"${nomeArma}" non è un'arma Deployable di questa truppa.`));
        else if (scelta && !scelta.disponibile) errori.push(err('E53', `"${scelta.nome}": usi esauriti.`));
        // I requisiti del tavolo: se il giocatore non li conferma, non si piazza.
        if (risposte.nemiciNellArea !== false) errori.push(err('E54', 'Requisito: nessun nemico né Marker Mimetico nell\'Area d\'Innesco (o nella ZdC per le Perimeter).'));
        if (risposte.dentroZona !== true) errori.push(err('E55', 'Requisito: il punto deve stare dentro l\'area in cui il Minelayer può schierarsi.'));
        if (errori.length) return { token: null, portatoreAggiornato: unita, avvisi: [], errori: errori };

        const r = M.creaDeployable(unita, M.profiloArma(nomeArma), { ordineId: 'SCHIERAMENTO' });
        if (!r.token) return r;
        r.token.schieratoDaMinelayer = true;
        r.portatoreAggiornato = Object.assign({}, r.portatoreAggiornato, { minelayerUsati: op.usati + 1 });
        return r;
    };

    M.minelayerTiroFallito = function (unita, nomeArma) {
        const a = M.profiloArma(nomeArma);
        const disposable = /DISPOSABLE/i.test(String(a.traits || ''));
        let u = unita;
        if (disposable) {
            u = Object.assign({}, unita, { usiSpesi: Object.assign({}, (unita && unita.usiSpesi) || {},
                    { [a.nome]: ((((unita && unita.usiSpesi) || {})[a.nome]) || 0) + 1 }) });
        }
        return { portatoreAggiornato: u,
                 nota: `Tiro di Schieramento Superiore fallito: il Minelayer perde ${a.nome}` + (disposable ? ' (un uso scalato).' : '.') };
    };


    // ==================================================================
    // PARTE 52: I CANALI DI COMUNICAZIONE — i nomi UNA volta sola
    // ------------------------------------------------------------------
    // App giocatore e Hub si parlano attraverso 11 chiavi di localStorage,
    // rispecchiate su Firebase da motore_core.js (app) e calcolatore_cloud.js
    // (Hub). Prima i nomi erano stringhe ripetute in SETTE file, di tre chat.
    // Qui stanno una volta sola: motore_regole_n5.js e` l'unico file caricato
    // da ENTRAMBE le pagine. (Proposta della chat INTERFACCIA, 23 settembre.)
    //
    // Un nome sbagliato NON restituisce undefined in silenzio: lancia un
    // errore. localStorage.getItem(undefined) legge la chiave "undefined" e
    // non dice niente a nessuno — la forma da cui nascono i canali scritti
    // da una parte e letti da nessuno.
    //
    // Chi scrive e chi legge: MISURATO nei file, 23 settembre.
    // ==================================================================
    const CANALI_DATI = {
        HUB_CALCOLO:      'canale_hub_calcolo',
        HUB_STATO:        'hub_update_state',
        ARO_NOMADI:       'canale_aro_nomadi',
        ARO_PANOCEANIA:   'canale_aro_panoceania',
        SETUP_NOMADI:     'canale_setup_nomadi',
        SETUP_PANOCEANIA: 'canale_setup_panoceania',
        COMUNICAZIONE:    'canale_comunicazione_infinity',
        STATO_PARTITA:    'global_game_state',
        HUB_TURNO:        'canale_hub_turno',
        ALLARME_ATTACCO:  'canale_attacco_allarme',
        HUB_SBLOCCO:      'hub_sblocco_attivo'
    };
    M.CANALI = (typeof Proxy === 'function')
        ? new Proxy(Object.freeze(Object.assign({}, CANALI_DATI)), {
            get: function (t, k) {
                if (typeof k !== 'string' || k in t || k === 'toJSON' || k === 'then' || k === 'inspect') return t[k];
                throw new Error(`M.CANALI: canale sconosciuto "${k}". Canali: ${Object.keys(t).join(', ')}.`);
            }
        })
        : Object.freeze(Object.assign({}, CANALI_DATI));

    // Il contratto, come DATO: chi scrive, chi legge.
    M.CANALI_CONTRATTO = Object.freeze({
        canale_hub_calcolo:            { scrive: 'app (motore_core)',  legge: 'hub (controller)', cosa: 'il calcolo da risolvere' },
        hub_update_state:              { scrive: 'app (logica_stati)', legge: 'hub (controller)', cosa: 'stati di un\'unita` modificati' },
        canale_aro_nomadi:             { scrive: 'app (motore_core)',  legge: 'hub (controller)', cosa: 'ARO dei Nomadi' },
        canale_aro_panoceania:         { scrive: 'app (motore_core)',  legge: 'hub (controller)', cosa: 'ARO di PanOceania' },
        canale_setup_nomadi:           { scrive: 'app (schieramento, stati, roster)', legge: 'hub (controller)', cosa: 'roster schierato dei Nomadi' },
        canale_setup_panoceania:       { scrive: 'app (schieramento, stati, roster)', legge: 'hub (controller)', cosa: 'roster schierato di PanOceania' },
        canale_comunicazione_infinity: { scrive: 'app (motore_core)',  legge: 'hub (controller)', cosa: 'ordine dichiarato' },
        global_game_state:             { scrive: 'hub (controller)',   legge: 'app (app.html)',   cosa: 'stato della partita' },
        canale_hub_turno:              { scrive: 'hub (controller)',   legge: 'app (motore_core)', cosa: 'di chi e` il turno' },
        canale_attacco_allarme:        { scrive: 'hub (controller)',   legge: 'app (motore_core)', cosa: 'allarme: chi e` attaccato' },
        hub_sblocco_attivo:            { scrive: 'hub (controller)',   legge: 'app (motore_core)', cosa: 'sblocco del giocatore attivo' }
    });

    // La scelta fazione -> nome, anch'essa una volta sola.
    M.canaleSetup = function (fazione) { return String(fazione).toUpperCase() === 'NOMADI' ? M.CANALI.SETUP_NOMADI : M.CANALI.SETUP_PANOCEANIA; };
    M.canaleAro   = function (fazione) { return String(fazione).toUpperCase() === 'NOMADI' ? M.CANALI.ARO_NOMADI   : M.CANALI.ARO_PANOCEANIA; };

    // Il nome leggibile di uno stato dal suo id canonico.
    M.nomeStato = function (id) { const v = (catalogo('STATI') || {})[id]; return v ? v.nome : String(id); };

    if (typeof module !== 'undefined' && module.exports) module.exports = M;
    console.log(`🧠 motore_regole_n5.js ${M.VERSIONE} caricato — contratto azioni + payload.`);
})();
