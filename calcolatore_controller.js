// @versione 2026-10-07.1 | calcolatore_controller.js | proprieta`: chat INTERFACCIA
// ==========================================
// 🖥️ HUB CONTROLLER & UI - hub-controller.js
// ==========================================

window.gameState = { nomads: [], panoceania: [], activeFaction: 'NOMADI',
    // Scenografia e terreno del tavolo, tenuti separati per fonte:
    // sono elementi neutri con cui interagiscono entrambi i giocatori.
    scenario: { nomads: { strutture: [], terreni: [] }, panoceania: { strutture: [], terreni: [] } } };

// --- 1. GESTIONE LOG E TURNI ---
window.updateLog = (msg) => {
    const log = document.getElementById('battle-log');
    if (!log) return;
    log.innerHTML += `<div>[${new Date().toLocaleTimeString()}] ${msg}</div>`;
    log.scrollTop = log.scrollHeight;
};

// ==========================================================================
//  I LATI DEL TABELLONE: DOVE SIEDONO I GIOCATORI
// ==========================================================================
// 7 ottobre, Paolo dal tavolo. Nomads rossi e PanOceania blu, SEMPRE; a
// sinistra o a destra secondo come i due giocatori sono seduti davanti al
// tabellone, e NON secondo chi e` attivo. Prima i pannelli avevano un posto
// fisso (Nomads a sinistra) e la risoluzione metteva a sinistra l'attivo:
// due criteri diversi sullo stesso schermo, e nessuno dei due era la sedia.
// La scelta sta su QUESTO dispositivo e non viaggia: e` di chi guarda
// questo schermo, non della partita. La chiave non e` un canale.
window.CHIAVE_LATI = 'hub_lati_invertiti';
window.latiInvertiti = (function () {
    try { return localStorage.getItem(window.CHIAVE_LATI) === '1'; } catch (e) { return false; }
})();
// 'SX' o 'DX'. Senza inversione i Nomads stanno a sinistra, come prima.
window.latoDi = (fazione) => ((fazione === 'NOMADI') !== window.latiInvertiti) ? 'SX' : 'DX';
window.COLORE_FAZIONE = { NOMADI: '#ff0000', PANOCEANIA: '#00ccff' };

window.applicaLati = () => {
    const nom = document.getElementById('pannello-nomads'), pan = document.getElementById('pannello-pano');
    if (nom) nom.style.order = (window.latoDi('NOMADI') === 'SX') ? '1' : '2';
    if (pan) pan.style.order = (window.latoDi('PANOCEANIA') === 'SX') ? '1' : '2';
};

window.invertiLati = () => {
    window.latiInvertiti = !window.latiInvertiti;
    try { localStorage.setItem(window.CHIAVE_LATI, window.latiInvertiti ? '1' : '0'); } catch (e) { window.ultimaEccezione = e; }
    window.applicaLati();
    // Una risoluzione a schermo si ridisegna subito: se restasse coi lati
    // di prima, pannelli e scontri direbbero due cose diverse.
    const ris = document.getElementById('step-resolution');
    if (ris && ris.style.display === 'block' && window.ultimiScontri) window.mostraSchermataRisoluzione(window.ultimiScontri);
    window.updateLog('\u21c4 Lati invertiti: a sinistra ' + (window.latoDi('NOMADI') === 'SX' ? 'NOMADS' : 'PANOCEANIA') + '.');
};

// La scritta del turno: sta in un punto solo, cosi` cambio turno e ripresa
// della partita non possono scriverla in due modi.
window.scriviTurno = () => {
    const textElem = document.getElementById('current-active-text');
    if (!textElem) return;
    textElem.innerText = window.gameState.activeFaction;
    textElem.style.color = window.COLORE_FAZIONE[window.gameState.activeFaction] || '#ffffff';
};

window.toggleTurn = () => {
    window.gameState.activeFaction = (window.gameState.activeFaction === 'NOMADI') ? 'PANOCEANIA' : 'NOMADI';
    
    // Azzera i canali ARO al cambio turno
    localStorage.removeItem(window.MotoreN5.CANALI.COMUNICAZIONE);
    localStorage.removeItem(window.MotoreN5.CANALI.ALLARME_ATTACCO);
    localStorage.removeItem(window.MotoreN5.CANALI.ARO_NOMADI);
    localStorage.removeItem(window.MotoreN5.CANALI.ARO_PANOCEANIA);

    // Aggiorna l'interfaccia dell'HUB
    window.scriviTurno();

    // SPEDISCE IL SEGNALE DI CAMBIO TURNO VIA CLOUD
    localStorage.setItem(window.MotoreN5.CANALI.HUB_TURNO, JSON.stringify({ attivo: window.gameState.activeFaction }));
    
    // 🔴 7 ottobre, difetto di questa chat: il turno nuovo andava alle app
    // (canale HUB_TURNO) ma NON nello stato salvato della partita, che si
    // riscriveva solo al primo cambio di stato successivo. Un Hub riaperto
    // subito dopo il cambio turno riprendeva la partita nel turno di
    // prima. Misurato: Hub su PANOCEANIA, stato sul server ancora NOMADI.
    window.broadcastState();

    window.updateLog(`🔄 CAMBIO TURNO: Ora è il turno di ${window.gameState.activeFaction}`);
};

window.resetPartita = () => {
    if(confirm("⚠️ ATTENZIONE! Vuoi resettare l'intera partita? Tutti i dati sul server verranno distrutti e le app torneranno allo schieramento iniziale!")) {
        const canaliCloud = [
            window.MotoreN5.CANALI.HUB_TURNO, window.MotoreN5.CANALI.HUB_SBLOCCO, window.MotoreN5.CANALI.SETUP_PANOCEANIA, 
            window.MotoreN5.CANALI.SETUP_NOMADI, window.MotoreN5.CANALI.ALLARME_ATTACCO, window.MotoreN5.CANALI.COMUNICAZIONE,
            window.MotoreN5.CANALI.ARO_PANOCEANIA, window.MotoreN5.CANALI.ARO_NOMADI, window.MotoreN5.CANALI.HUB_CALCOLO, 
            window.MotoreN5.CANALI.STATO_PARTITA, window.MotoreN5.CANALI.HUB_STATO
        ];
        
        canaliCloud.forEach(canale => localStorage.removeItem(canale));
        window.updateLog("🛑 SERVER RESETTATO! I dati della vecchia partita sono stati distrutti.");
        
        setTimeout(() => window.location.reload(), 1500);
    }
};

// ==========================================================================
//  PRIMA LETTURA DAL CLOUD: NIENTE PARTE PRIMA
// ==========================================================================
// L'Hub partiva con gameState vuoto e non rileggeva mai global_game_state.
// Chiuso a meta` partita e riaperto, ricominciava da zero — e il primo
// broadcastState() cancellava la partita anche su Firebase, per tutti.
// Bastava riaprire la pagina per distruggere il tavolo.
//
// Ora finche` cloudPronto non si risolve non si trasmette e non si
// elabora: il ciclo gira a vuoto. Poi, se sul cloud c'e` una partita, la
// si RIPRENDE, senza chiedere niente. Per iniziarne una nuova resta il
// solo pulsante di reset, che non e` stato toccato.
window.hubPronto = false;

window.broadcastState = () => {
    if (!window.hubPronto) {
        // Non e` un errore: e` il cancello. Trasmettere adesso sovrascriverebbe
        // col vuoto la partita che sta ancora arrivando.
        console.warn('\u23f8 broadcastState ignorato: prima lettura dal cloud non ancora conclusa.');
        return;
    }
    localStorage.setItem(window.MotoreN5.CANALI.STATO_PARTITA, JSON.stringify(window.gameState));
};

window.avvisoHub = (testo, colore) => {
    const box = document.getElementById('avviso-hub');
    if (!box) return;
    if (!testo) { box.style.display = 'none'; box.innerHTML = ''; return; }
    box.style.background = colore || '#3a2a00';
    box.innerHTML = testo;
    box.style.display = 'block';
};

// Riprende la partita che sta sul cloud. Non chiede conferma: riaprire
// l'Hub a meta` partita significa voler continuare, non ricominciare.
window.riprendiPartitaHub = () => {
    let stato = null;
    try { stato = JSON.parse(localStorage.getItem(window.MotoreN5.CANALI.STATO_PARTITA) || 'null'); }
    catch (e) { window.ultimaEccezione = e; }

    const unita = stato ? ((stato.nomads || []).length + (stato.panoceania || []).length) : 0;
    if (!unita) return false;

    window.gameState = {
        nomads: stato.nomads || [],
        panoceania: stato.panoceania || [],
        activeFaction: stato.activeFaction || 'NOMADI',
        scenario: stato.scenario || { nomads: { strutture: [], terreni: [] }, panoceania: { strutture: [], terreni: [] } }
    };
    // 🔴 7 ottobre, difetto di questa chat trovato rifacendo la riga in
    // alto: qui il turno si rileggeva dal server ma la SCRITTA non si
    // aggiornava. Riaprendo l'Hub durante il turno di PanOceania il
    // tabellone continuava a dire "NOMADI" fino al cambio turno dopo.
    window.scriviTurno();
    window.updateLog('\u21a9\ufe0f Partita ripresa: ' + unita + ' unit\u00e0 sul tavolo, turno ' + window.gameState.activeFaction + '.');
    if (window.refreshUI) window.refreshUI();
    if (window.aggiornaScenario) window.aggiornaScenario();
    return true;
};

// Il cancello vero e proprio.
(async function apriQuandoIlCloudRisponde() {
    const riprova = async () => {
        let esito = { confermato: false };
        try { esito = await window.cloudPronto; } catch (e) { window.ultimaEccezione = e; }

        if (!esito || !esito.confermato) {
            // NON si parte vuoti in silenzio: chi guarda l'Hub deve sapere che
            // quello che vede non e` la partita, ma una pagina che non ha
            // ancora letto niente.
            window.avvisoHub('\u26a0\ufe0f PARTITA NON LETTA DAL SERVER' +
                '<div style="font-size:14px; color:#ffcc88; margin-top:4px;">L\'Hub non trasmette e non elabora finch\u00e9 non riesce a leggere. Riprovo da solo.</div>', '#3a2a00');
            if (typeof window.riprovaCloud === 'function') {
                setTimeout(async () => {
                    let nuovo = { confermato: false };
                    try { nuovo = await window.riprovaCloud(); } catch (e) { window.ultimaEccezione = e; }
                    if (nuovo && nuovo.confermato) { window.avvisoHub(null); apri(); }
                    else riprova();
                }, 4000);
            }
            return;
        }
        window.avvisoHub(null);
        apri();
    };

    const apri = () => {
        const ripresa = window.riprendiPartitaHub();
        window.hubPronto = true;
        if (!ripresa) window.updateLog('\u2705 Hub pronto. Nessuna partita in corso sul server: in attesa degli schieramenti.');
    };

    riprova();
})();

// Le reazioni dell'avversario sono arrivate?
//
// NON si guardano i canali ARO: nello stesso giro del ciclo il ramo delle
// reazioni li legge e li CANCELLA, mettendo il contenuto in latestAroData,
// e gira prima del calcolo. Guardando i canali si troverebbe sempre vuoto.
// Il segnale vero e` latestAroData, che vale anche quando il reattivo non
// ha dichiarato nulla: un elenco vuoto e` una risposta, l'assenza no.
window.reazioniPronte = () => {
    if (window.latestAroData !== null && window.latestAroData !== undefined) return true;
    const C = window.MotoreN5.CANALI;
    return !!(localStorage.getItem(C.ARO_NOMADI) || localStorage.getItem(C.ARO_PANOCEANIA));
};
window.attesaAroDetta = false;
// L'Ordine a cui appartengono le reazioni in memoria: vedi il ramo
// dell'allarme nel ciclo di ascolto.
window.ordineDelleReazioni = null;

// Un setup che arriva mentre quella fazione ha gia` unita` in gioco NON si
// applica in silenzio: sarebbe un tocco sul pulsante "invia all'Hub" a
// distruggere ferite e stati di tutta la squadra. Si chiede a chi arbitra.
window.setupAccettabile = (fazione, quante, motivo) => {
    const chiave = (fazione === 'NOMADI') ? 'nomads' : 'panoceania';
    const inGioco = (window.gameState[chiave] || []).length;
    if (!inGioco) return true;

    // Il canale di setup lo usano DUE cose diverse: una lista nuova, che
    // sostituisce la squadra, e un aggiornamento della stessa partita —
    // uno stato salvato, il Fuoco di Soppressione, un token piazzato.
    // Chiedere per entrambe significa mettere "Sostituisco?" davanti
    // all'arbitro a ogni ferita segnata. Il motivo arriva nella busta.
    if (motivo === 'AGGIORNAMENTO') return true;
    const nome = (fazione === 'NOMADI') ? 'Nomads' : 'PanOceania';
    window.updateLog('\u26a0\ufe0f ' + nome + ' ha rimandato la lista (' + quante + ' unit\u00e0) mentre ne ha gi\u00e0 ' + inGioco + ' in gioco.');
    return confirm(nome + ' ha rimandato la lista mentre la partita e` in corso.\n\n' +
        'In gioco ora: ' + inGioco + ' unit\u00e0. In arrivo: ' + quante + '.\n\n' +
        'Sostituire quella in gioco significa perdere ferite e stati di quella fazione.\n\nSostituisco?');
};

// --- 2. LOOP DI ASCOLTO (IL VIGILE URBANO) ---
setInterval(() => {
    // Finche` la prima lettura non e` conclusa il ciclo gira a vuoto: i
    // canali restano dove sono e verranno letti al giro dopo.
    if (!window.hubPronto) return;

    // Ascolto Setup Nomadi
    let sNom = localStorage.getItem(window.MotoreN5.CANALI.SETUP_NOMADI);
    if(sNom) {
        const datiNom = JSON.parse(sNom);
        if (!window.setupAccettabile('NOMADI', (datiNom.roster || []).length, datiNom.motivo)) {
            localStorage.removeItem(window.MotoreN5.CANALI.SETUP_NOMADI);
            window.updateLog('\u21a9\ufe0f Lista dei Nomads ignorata: resta quella in gioco.');
            return;
        }
        window.gameState.nomads = datiNom.roster;
        // Il pacchetto di schieramento porta da sempre anche strutture e
        // terreni: qui si leggeva solo .roster e il resto finiva nel nulla.
        // Sono elementi del tavolo con cui interagiscono entrambi i
        // giocatori, quindi devono stare da qualche parte in mezzo.
        window.gameState.scenario.nomads = {
            strutture: datiNom.strutture || [],
            terreni: datiNom.terreni || []
        };
        localStorage.removeItem(window.MotoreN5.CANALI.SETUP_NOMADI);
        window.updateLog("Nomads: Roster ricevuto.");
        window.refreshUI(); window.broadcastState();
    }
    // Ascolto Setup PanO
    let sPano = localStorage.getItem(window.MotoreN5.CANALI.SETUP_PANOCEANIA);
    if(sPano) {
        const datiPano = JSON.parse(sPano);
        if (!window.setupAccettabile('PANOCEANIA', (datiPano.roster || []).length, datiPano.motivo)) {
            localStorage.removeItem(window.MotoreN5.CANALI.SETUP_PANOCEANIA);
            window.updateLog('\u21a9\ufe0f Lista di PanOceania ignorata: resta quella in gioco.');
            return;
        }
        window.gameState.panoceania = datiPano.roster;
        window.gameState.scenario.panoceania = {
            strutture: datiPano.strutture || [],
            terreni: datiPano.terreni || []
        };
        localStorage.removeItem(window.MotoreN5.CANALI.SETUP_PANOCEANIA);
        window.updateLog("PanOceania: Roster ricevuto.");
        window.refreshUI(); window.broadcastState();
    }
    // Allarme ARO
    let attacco = localStorage.getItem(window.MotoreN5.CANALI.COMUNICAZIONE);
    if(attacco) {
        window.updateLog("⚠️ ATTACCO! Allarme ARO inviato.");
        let datiAttacco = JSON.parse(attacco);
        // 🔴 7 ottobre. LE REAZIONI SONO DI UN ORDINE, e qui restavano in
        // memoria finche` chi arbitra non premeva "APPLICA RISULTATI". Un
        // ARO a cui non seguiva un calcolo (o un tabellone non chiuso)
        // lasciava latestAroData pieno: la busta dell'Ordine DOPO, con
        // aroAtteso, trovava "reazioni pronte", veniva calcolata subito
        // con le reazioni VECCHIE, e l'ARO nuovo arrivava a calcolo gia`
        // a schermo senza piu` comparire. Misurato coi tre dispositivi:
        // Idle + ARO, poi Piazzare Equipaggiamento.
        // Dal motore_core 2026-10-07.1 un Ordine manda UN allarme, e
        // l'allarme porta ordineId: un identificativo nuovo vuol dire
        // Ordine nuovo, e le reazioni di prima non sono sue. Senza
        // identificativo non si puo` sapere, e non si tocca niente.
        const ordineAllarme = (datiAttacco && datiAttacco.ordineId != null) ? String(datiAttacco.ordineId) : null;
        if (ordineAllarme !== null && ordineAllarme !== window.ordineDelleReazioni) {
            if (window.latestAroData !== null && window.latestAroData !== undefined) {
                window.updateLog('\ud83e\uddf9 Ordine nuovo: le reazioni dell\'Ordine precedente non valgono piu`.');
            }
            window.latestAroData = null;
            window.attesaAroDetta = false;
            window.ordineDelleReazioni = ordineAllarme;
        }
        datiAttacco.timestamp_allarme = Date.now(); 
        localStorage.setItem(window.MotoreN5.CANALI.ALLARME_ATTACCO, JSON.stringify(datiAttacco));
        localStorage.removeItem(window.MotoreN5.CANALI.COMUNICAZIONE);
    }

    // ARO Nomadi
    let aroNomadi = localStorage.getItem(window.MotoreN5.CANALI.ARO_NOMADI);
    if(aroNomadi) {
        window.updateLog("🛡️ ARO Nomadi completato! PanOceania può procedere.");
        localStorage.setItem(window.MotoreN5.CANALI.HUB_SBLOCCO, Date.now().toString()); 
        window.latestAroData = JSON.parse(aroNomadi).reazioni; 
        localStorage.removeItem(window.MotoreN5.CANALI.ARO_NOMADI);
    }

    // ARO PanOceania
    let aroPano = localStorage.getItem(window.MotoreN5.CANALI.ARO_PANOCEANIA);
    if(aroPano) {
        window.updateLog("🛡️ ARO PanOceania completato! I Nomadi possono procedere.");
        localStorage.setItem(window.MotoreN5.CANALI.HUB_SBLOCCO, Date.now().toString()); 
        window.latestAroData = JSON.parse(aroPano).reazioni; 
        localStorage.removeItem(window.MotoreN5.CANALI.ARO_PANOCEANIA);
    }
    
    // Cambi di Stato
    let updateState = localStorage.getItem(window.MotoreN5.CANALI.HUB_STATO);
    if(updateState) {
        let data = JSON.parse(updateState);
        let faction = data.fazione === 'NOMADI' ? window.gameState.nomads : window.gameState.panoceania;
        let unit = faction.find(u => u.id === data.unitId);
        if(unit) {
            unit.state = data.newState;

            // L'app spedisce anche fullStates, cioe` TUTTI i flag (camo,
            // engaged, targeted, immobilizzato...). Prima veniva
            // scartato qui alla porta e il tabellone poteva mostrare solo
            // lo stato vitale: e` la ragione per cui gli stati aggiornati
            // durante la partita non comparivano.
            if (data.fullStates) unit.states = data.fullStates;

            const attivi = window.elencoStatiAttivi(unit);
            window.updateLog(`🩺 STATO AGGIORNATO: ${unit.alias || unit.nome} → ${attivi || data.newState}`);
            window.broadcastState(); 
        }
        localStorage.removeItem(window.MotoreN5.CANALI.HUB_STATO);
        window.refreshUI(); 
    }

    // Ascolto Calcoli (Innesca il Motore Matematico)
    let calcolo = localStorage.getItem(window.MotoreN5.CANALI.HUB_CALCOLO);
    if(calcolo) {
        let datiReali = JSON.parse(calcolo);

        // Una busta con aroAtteso dice: "il movimento ha chiesto un ARO, le
        // reazioni stanno arrivando". Calcolarla subito darebbe un movimento
        // senza opposizione, e l'ARO arriverebbe quando il risultato e` gia`
        // a schermo. Si aspetta: la busta resta sul canale e si rilegge al
        // giro dopo, insieme alle reazioni.
        if (datiReali.aroAtteso && !window.reazioniPronte()) {
            if (!window.attesaAroDetta) {
                window.updateLog('\u23f3 Ordine ricevuto: si aspettano le reazioni dichiarate.');
                window.attesaAroDetta = true;
            }
            return;
        }
        window.attesaAroDetta = false;

        window.updateLog("🎲 Ricevuti i parametri finali! Calcolo in corso...");

        // 1. ELIMINIAMO SUBITO IL DATO: così se il calcolo esplode, non entriamo nel loop infinito
        localStorage.removeItem(window.MotoreN5.CANALI.HUB_CALCOLO);
        
        // 2. GABBIA DI SICUREZZA (Try-Catch)
        try {
            if(window.generaRisoluzioneDaDati) {
                let scontriCalcolati = window.generaRisoluzioneDaDati(datiReali);
                window.mostraSchermataRisoluzione(scontriCalcolati, datiReali);
            } else {
                console.error("Errore: Motore Matematico non trovato!");
                window.updateLog("<span style='color:red;'>❌ ERRORE: File calcolatore_math.js non collegato!</span>");
            }
        } catch (errore) {
            console.error("🚨 CRASH DURANTE IL CALCOLO:", errore);
            window.updateLog(`<span style='color:red; font-weight:bold;'>❌ CRASH DEL MOTORE: ${errore.message}</span>`);
            window.updateLog(`<span style='color:#ff9900; font-size:10px;'>Apri la console del browser (F12) per i dettagli.</span>`);
        }
    }
}, 1000);

// --- 3. GENERAZIONE INTERFACCIA HUB ---

// Vocabolario VISIVO: id dello stato -> icona e colore.
// Il NOME non si legge piu` da qui: lo dice M.statiPerCategoria insieme
// alla categoria e all'ordine. Il campo `testo` resta solo come ripiego.
// Qui non c'e` nessuna regola di gioco: quali stati esistono e quando sono
// attivi lo decide M.statoBersaglio(). Questo oggetto dice solo come si
// disegnano. Se il motore aggiunge uno stato che qui non c'e`, viene
// mostrato lo stesso con l'etichetta grezza (vedi sotto): meglio un'icona
// mancante che uno stato invisibile sul tabellone.
window.STATI_TABELLONE = {
    // vitali
    morto:          { icona: '☠️',  testo: 'MORTO',           sfondo: '#000000', colore: '#ff4444' },
    incosciente:    { icona: '💀',  testo: 'INCOSCIENTE',     sfondo: '#8b0000', colore: '#ffffff' },
    retreat:        { icona: '🏳️',  testo: 'RITIRATA!',       sfondo: '#664400', colore: '#ffcc00' },
    // posizione / combattimento
    engaged:        { icona: '⚔️',  testo: 'IN MISCHIA',      sfondo: '#7a2800', colore: '#ffdddd' },
    suppressive:    { icona: '🔥',  testo: 'SOPPRESSIVO',     sfondo: '#ff6600', colore: '#000000' },
    targeted:       { icona: '🎯',  testo: 'BERSAGLIATO',     sfondo: '#aa0055', colore: '#ffffff' },
    foxhole:        { icona: '🕳️',  testo: 'FOXHOLE',         sfondo: '#3a2f1b', colore: '#e0c890' },
    // menomazioni
    stordito:       { icona: '💫',  testo: 'STORDITO',        sfondo: '#555555', colore: '#ffffff' },
    immA:           { icona: '🕸️',  testo: 'IMMOBILIZZATO-A', sfondo: '#444466', colore: '#ccccff' },
    immB:           { icona: '⛓️',  testo: 'IMMOBILIZZATO-B', sfondo: '#222244', colore: '#ccccff' },
    isolato:        { icona: '📵',  testo: 'ISOLATO',         sfondo: '#4d004d', colore: '#ffccff' },
    disconnesso:    { icona: '🔌',  testo: 'DISCONNESSO',     sfondo: '#333355', colore: '#aaaaff' },
    posseduto:      { icona: '😈',  testo: 'POSSEDUTO',       sfondo: '#550000', colore: '#ff9999' },
    sepsitorizzato: { icona: '🧠',  testo: 'SEPSITORIZZATO',  sfondo: '#440044', colore: '#ff99ff' },
    // occultamento
    camo:           { icona: '👤',  testo: 'CAMO',            sfondo: '#444400', colore: '#ffff00' },
    imp:            { icona: '🥸',  testo: 'IMPERSONAZIONE',  sfondo: '#443300', colore: '#ffcc66' },
    hidden:         { icona: '🫥',  testo: 'NASCOSTO',        sfondo: '#1a1a1a', colore: '#888888' },
    decoy:          { icona: '🪞',  testo: 'DECOY',           sfondo: '#204040', colore: '#99ffff' },
    holoecho:       { icona: '🌀',  testo: 'HOLOECHO',        sfondo: '#204040', colore: '#99ffff' },
    holomask:       { icona: '🎭',  testo: 'HOLOMASK',        sfondo: '#204040', colore: '#99ffff' }
};


// `nullo` aggiunge un segno UGUALE per tutti gli stati Null, oltre a icona
// e colore propri: bordo rosso e la parola NULL, perche` il colore da solo
// non basta a chi non lo distingue e con poca luce al tavolo.
// 7 ottobre, Paolo: gli stati si mostrano con l'ICONA dello stato, non con
// la scritta. I file li mette lui in img/, coi nomi qui sotto (gli stessi
// che l'app dei giocatori usa gia` in generaIconeStati, piu` i cinque che
// l'app non aveva). Finche` un file manca NON sparisce lo stato: al posto
// dell'immagine torna l'etichetta di prima, simbolo e scritta. Il nome
// resta sempre nel suggerimento e nel riquadro che si apre toccando.
window.ICONE_STATI = {
    morto: 'icon_dead', incosciente: 'icon_unc', retreat: 'icon_retreat',
    engaged: 'icon_engaged', suppressive: 'icon_suppressive', targeted: 'icon_targeted', foxhole: 'icon_foxhole',
    stordito: 'icon_stunned', immA: 'icon_imma', immB: 'icon_immb', isolato: 'icon_isolated',
    disconnesso: 'icon_disconnected', posseduto: 'icon_possessed', sepsitorizzato: 'icon_sepsitorized',
    camo: 'icon_camo', imp: 'icon_imp', hidden: 'icon_hidden', decoy: 'icon_decoy',
    holoecho: 'icon_holoecho', holomask: 'icon_holomask'
};

window.etichettaStato = (icona, testo, sfondo, colore, titolo, nullo, idStato) => {
    const bordo = nullo ? ' box-shadow: inset 0 0 0 2px #ff2020;' : '';
    const segno = nullo ? ` <b style="color:#ff5050; font-size:9px; letter-spacing:1px;">NULL</b>` : '';
    const suggerimento = nullo
        ? (titolo ? titolo + ' \u2014 ' : '') + 'Stato Null: non da` Ordini ne` Punti Vittoria'
        : (titolo || testo);
    // Il suggerimento del browser si vede solo col mouse, e l'Hub puo` stare
    // su un tablet: quindi l'etichetta si tocca e apre lo stesso testo in un
    // riquadro sotto il tabellone. Le due strade mostrano la stessa cosa.
    const tocco = idStato
        ? ` onclick="window.mostraDettaglioStato('${String(idStato).replace(/'/g, "\\'")}', '${String(testo).replace(/'/g, "\\'")}')" style="cursor:pointer;"`
        : '';
    const file = idStato ? window.ICONE_STATI[idStato] : null;
    if (file) {
        // Se il file manca, l'immagine si toglie e ricompare la scritta
        // (che e` gia` nel nodo, nascosta): niente stato invisibile.
        return `<span class="state-tag state-icona"${tocco.replace(' style="cursor:pointer;"', '')} style="background:transparent; color:${colore};${bordo} cursor:pointer; padding:0;" title="${suggerimento}">` +
            `<img src="img/${file}.png" alt="${String(testo).replace(/"/g, '&quot;')}" style="width:38px; height:38px; object-fit:contain; vertical-align:middle;" ` +
            `onerror="this.style.display='none'; this.parentNode.style.background='${sfondo}'; this.parentNode.style.padding='2px 6px'; this.nextSibling.style.display='inline';">` +
            `<span style="display:none;">${icona} ${testo}</span>${segno}</span>`;
    }
    return `<span class="state-tag"${tocco ? tocco.replace(' style="cursor:pointer;"', '') : ''} style="background:${sfondo}; color:${colore};${bordo}${idStato ? ' cursor:pointer;' : ''}" title="${suggerimento}">${icona} ${testo}${segno}</span>`;
};

// Il riquadro sotto il tabellone: nome, categoria e come si esce. Si apre
// toccando un'etichetta, e si chiude toccando di nuovo la stessa.
window.dettaglioStatoAperto = null;

window.mostraDettaglioStato = (idStato, nome) => {
    const box = document.getElementById('dettaglio-stato');
    if (!box) return;
    if (window.dettaglioStatoAperto === idStato) {
        window.dettaglioStatoAperto = null;
        box.style.display = 'none';
        box.innerHTML = '';
        return;
    }
    window.dettaglioStatoAperto = idStato;

    const voce = ((window.CATALOGO_N5 || {}).STATI || {})[idStato] ||
                 ((window.CATALOGO_N5 || {}).STATI_NON_GESTITI || {})[idStato] || {};
    const modi = Array.isArray(voce.cancellazione) ? voce.cancellazione : null;

    let corpo;
    if (modi === null) corpo = '<div style="color:#aa8866;">Come si esce: non ancora verificato sul regolamento.</div>';
    else if (!modi.length) corpo = '<div style="color:#ff8888;">Non se ne esce.</div>';
    else corpo = '<div style="color:#ccc;">Come si esce:</div><ul style="margin:4px 0 0 18px; color:#ccc;">' +
                 modi.map(m => `<li>${m}</li>`).join('') + '</ul>';

    box.innerHTML = `<div style="display:flex; justify-content:space-between; align-items:center;">
            <b style="color:#fff; font-size:17px;">${nome}</b>
            <span style="color:#888; font-size:13px;">tocca di nuovo per chiudere</span>
        </div>${corpo}`;
    box.style.display = 'block';
};

// Elenco testuale degli stati attivi, per il log.
window.elencoStatiAttivi = (unit) => {
    const M = window.MotoreN5;
    if (!M || typeof M.statiPerCategoria !== 'function') return '';
    try {
        // Stessa fonte del tabellone: log ed etichette non possono divergere.
        const nomi = [];
        (M.statiPerCategoria(unit) || []).forEach(g => (g.stati || []).forEach(st => nomi.push(st.nome || st.id)));
        return nomi.length ? nomi.join(', ') : 'ATTIVO';
    } catch (errore) {
        window.ultimaEccezione = errore;
        return 'STATI ILLEGGIBILI';
    }
};

// Come si esce da uno stato, preso dal catalogo. Nessuna regola qui: si
// legge un elenco di frasi gia` scritte, e se non c'e` non si inventa.
window.comeSiEsce = (idStato) => {
    try {
        const voce = ((window.CATALOGO_N5 || {}).STATI || {})[idStato];
        const modi = voce && voce.cancellazione;
        if (!Array.isArray(modi) || !modi.length) return '';
        return '\n\nCome si esce:\n\u2022 ' + modi.join('\n\u2022 ');
    } catch (e) {
        window.ultimaEccezione = e;
        return '';
    }
};

window.generateStateTags = (unit) => {
    const M = window.MotoreN5;

    if (!M || typeof M.statiPerCategoria !== 'function' || typeof M.statoBersaglio !== 'function') {
        return window.etichettaStato('\u26d4', 'MOTORE ASSENTE', '#ff0000', '#ffffff',
            'motore_regole_n5.js non caricato: gli stati non sono leggibili');
    }

    let tags = "";

    // 1. Stati attivi, raggruppati e ORDINATI DAL MOTORE.
    //    Prima l'ordine stava in una costante qui e i nomi nella tabella
    //    delle icone: due copie di un dato che il motore possiede. Ora
    //    M.statiPerCategoria restituisce i gruppi nell'ordine di
    //    CATALOGO_N5.CATEGORIE_STATI e il nome di ogni stato lo dice lui.
    //    Qui resta solo il vocabolario visivo: icona e colore.
    (M.statiPerCategoria(unit) || []).forEach(gruppo => {
        (gruppo.stati || []).forEach(stato => {
            const v = window.STATI_TABELLONE[stato.id];
            const nome = stato.nome || (v && v.testo) || String(stato.id).toUpperCase();
            // Il segno Null si legge SOLO dal campo `nullo` dello stato. Non
            // dal nome della categoria: "NULLO" contiene anche Ritirata!, che
            // Null non e`, mentre Posseduto e Sepsitorizzato sono Null e stanno
            // in INFOGUERRA. Ricavarlo dalla categoria sbaglierebbe su tre.
            const nullo = stato.nullo === true;
            // Come si esce dallo stato, se il catalogo lo dice: finisce nel
            // suggerimento dell'etichetta, cosi` chi arbitra lo legge senza
            // aprire il regolamento. Si legge il campo per QUALUNQUE stato:
            // oggi ce l'ha solo lo Stordito, e quando ne arriveranno altri
            // compariranno da soli.
            const titolo = gruppo.categoria + window.comeSiEsce(stato.id);
            if (v) {
                tags += window.etichettaStato(v.icona, nome, v.sfondo, v.colore, titolo, nullo, stato.id);
            } else {
                // Il motore lo conosce, il tabellone non sa disegnarlo:
                // si mostra col suo nome vero. Manca l'icona, non lo stato.
                tags += window.etichettaStato('\u2753', nome, '#552200', '#ffaa66',
                    gruppo.categoria + ' \u2014 icona non prevista dal tabellone' + window.comeSiEsce(stato.id), nullo, stato.id);
            }
        });
    });

    // 2. Quello che solo statoBersaglio sa: cosa il profilo scrive e il
    //    motore non normalizza, piu` le quantita`.
    const s = M.statoBersaglio(unit);

    (s.nonNormalizzati || []).forEach(k => {
        tags += window.etichettaStato('\u2753', String(k).toUpperCase(), '#552200', '#ffaa66',
            'Stato presente nel profilo ma non normalizzato dal motore');
    });

    const q = s.quantita || {};
    const ferite = (unit.states && unit.states.wounds) ? parseInt(unit.states.wounds, 10) : 0;
    if (ferite > 0) {
        const totale = (q.ferite != null) ? `/${q.ferite} ${q.attributoFerite || ''}`.trim() : '';
        tags += window.etichettaStato('\ud83e\ude78', `${ferite}${totale}`, '#cc0000', '#ffffff', 'Ferite subite');
    }
    if (q.fireteam) {
        const stella = q.leaderFireteam ? ' \u2b50' : '';
        tags += window.etichettaStato('\ud83d\udd17', `FIRETEAM ${q.fireteam}${stella}`, '#003366', '#00ccff',
            q.leaderFireteam ? 'Leader del Fireteam' : 'Membro del Fireteam');
    }

    return tags;
};

window.rigaUnita = (u) => {
    // L'Hub non carica motore_core.js, quindi qui NON c'e` il router a fare
    // da rete. Senza questa gabbia una sola unita` con un dato malformato
    // fa saltare tutto il tabellone, a ogni aggiornamento di stato.
    // Meglio una riga sbagliata che una griglia vuota.
    //
    // Era gia` stata messa il 14 settembre e si e` persa: la versione .4 e`
    // stata costruita su una copia del progetto piu` vecchia della .3.
    let tags;
    try {
        tags = window.generateStateTags(u);
    } catch (errore) {
        console.error('\ud83d\udea8 Stati illeggibili per', (u && (u.alias || u.nome)) || '(unita` senza nome)', errore);
        window.ultimaEccezione = errore;
        tags = window.etichettaStato('\ud83d\udea8', 'STATI ILLEGGIBILI', '#ff0000', '#ffffff', errore.message);
    }
    return `<div style="padding: 8px 0; border-bottom: 1px dashed #333;">
            <b style="color:#fff; font-size:16px;">${u.alias || u.nome}</b>
            ${tags ? `<div class="state-tags-row">${tags}</div>` : ''}
        </div>`;
};

window.rigaScenario = (u, fonte) => {
    const tags = window.generateStateTags(u);
    return `<div style="padding: 8px 0; border-bottom: 1px dashed #333;">
            <b style="color:#ccc; font-size:16px;">${u.alias || u.nome || u.name}</b>
            <span style="color:#666; font-size:12px;"> [${u.tipo || 'STRUTTURA'}]${u.skills && u.skills !== '-' ? ' | ' + u.skills : ''}</span>
            <span style="color:#555; font-size:11px;"> dichiarato da ${fonte}</span>
            ${tags ? `<div class="state-tags-row">${tags}</div>` : ''}
        </div>`;
};

window.aggiornaScenario = () => {
    const cont = document.getElementById('status-scenario');
    if (!cont) return;

    const sc = window.gameState.scenario || {};
    let html = "";

    // Le liste restano separate per fonte: se entrambi dichiarano la stessa
    // console si vedono due voci, e si corregge a voce. Unirle in silenzio
    // nasconderebbe il disaccordo su com'e` fatto il tavolo.
    [['nomads', 'NOMADS'], ['panoceania', 'PANOCEANIA']].forEach(([chiave, etichetta]) => {
        const parte = sc[chiave] || {};
        (parte.strutture || []).forEach(st => { html += window.rigaScenario(st, etichetta); });
    });

    // I terreni, al contrario delle strutture, si mostrano una volta sola.
    // Il tavolo e` uno: "Palude" due volte e` solo rumore. Due console
    // identiche invece possono essere due console vere, quindi quelle
    // restano separate per fonte.
    const terreni = [];
    const idVisti = [];
    [['nomads', 'NOMADS'], ['panoceania', 'PANOCEANIA']].forEach(([chiave, etichetta]) => {
        ((sc[chiave] || {}).terreni || []).forEach(t => {
            if (!t || idVisti.indexOf(t.id) >= 0) return;
            idVisti.push(t.id);
            terreni.push(`<span class="state-tag" style="background:#243524; color:#9ad79a;" title="dichiarato da ${etichetta}">🌐 ${t.nome}${(t.tratti && t.tratti.length) ? ' (' + t.tratti.join(', ') + ')' : ''}</span>`);
        });
    });
    if (terreni.length) html += `<div class="state-tags-row" style="margin-top:8px;">${terreni.join('')}</div>`;

    cont.innerHTML = html || "Nessun elemento dichiarato.";
};

window.refreshUI = () => {
    const statNomads = document.getElementById('status-nomads');
    const statPano = document.getElementById('status-pano');

    if(statNomads) statNomads.innerHTML = window.gameState.nomads.map(window.rigaUnita).join('');
    if(statPano) statPano.innerHTML = window.gameState.panoceania.map(window.rigaUnita).join('');

    window.aggiornaScenario();
};

window.toggleDettagli = (id) => {
    let el = document.getElementById(id);
    if(el) el.style.display = (el.style.display === 'none') ? 'block' : 'none';
};

// I DADI PERSI. Con il Burst diviso, i dadi dati a un bersaglio senza
// requisito (niente Linea di Tiro, fuori gittata) non si tirano: gli altri
// si`. Dal motore 2026-10-07.3 quel bersaglio resta nella BUSTA a Burst 0,
// con dadiPersi e requisitoMancante; ma fra gli SCONTRI non c'e`, perche`
// non c'e` nessun tiro da mostrare. Misurato il 7 ottobre coi tre
// dispositivi (HMG, 2 dadi su un bersaglio e 2 su uno senza Linea di Tiro):
// il tabellone mostrava un solo scontro da 2 dadi e degli altri 2 non
// diceva niente. Qui si leggono dalla busta e si scrivono sopra gli
// scontri. Nessuna regola: numero e motivo sono quelli che ha scritto il
// motore.
window.dadiPersiHtml = (busta) => {
    const righe = [];
    ((busta && busta.attacchi) || []).forEach(a => {
        ((a && a.bersagli) || []).forEach(b => {
            if (!b || !(b.dadiPersi > 0)) return;
            righe.push(`<b>${a.attaccante || '?'}</b> \u2192 <b>${b.name || b.nome || b.alias || '?'}</b>: ` +
                `${b.dadiPersi} ${b.dadiPersi === 1 ? 'dado NON si tira' : 'dadi NON si tirano'}` +
                (b.requisitoMancante ? ` <span style="color:#cc9966;">(${b.requisitoMancante})</span>` : ''));
        });
    });
    if (!righe.length) return '';
    return `<div id="dadi-persi" style="margin-bottom:20px; padding:12px; background:#221500; border:2px solid #ff9900; border-radius:8px; color:#ffbb55; font-size:16px;">` +
        `<b style="color:#ff9900;">\ud83c\udfb2 DADI PERSI</b><br>` + righe.join('<br>') + `</div>`;
};

// `busta` e` facoltativa: chi la passa vede anche i dadi persi.
window.mostraSchermataRisoluzione = (scontri, busta) => {
    // Tenuti da parte per ridisegnare quando si invertono i lati.
    if (busta !== undefined) window.ultimaBusta = busta;
    else if (scontri !== window.ultimiScontri) window.ultimaBusta = null;
    window.ultimiScontri = scontri;
    document.querySelector('.turn-controller').style.display = 'none';
    document.querySelector('.status-grid').style.display = 'none';
    document.querySelector('.log-container').style.display = 'none';
    
    document.getElementById('step-resolution').style.display = 'block';

    let container = document.getElementById('clash-container');
    container.innerHTML = window.dadiPersiHtml(window.ultimaBusta);

    if (!scontri || scontri.length === 0) {
        container.innerHTML += `<h2 style="color:red; text-align:center;">NESSUN TIRO DI DADO DA EFFETTUARE.</h2>`;
        return;
    }

    scontri.forEach((scontro, index) => {
        let dadiDifensoreHtml = scontro.reattivo.burst > 0 
            ? `<div style="margin-top:15px; font-size:18px; color:#fff;">Dadi da lanciare: <span style="color:#ffcc00; font-weight:bold; font-size:28px;">${scontro.reattivo.burst}</span></div>`
            : `<div style="margin-top:15px; font-size:18px; color:#555;">Nessun dado</div>`;

        let dadiAttaccanteHtml = scontro.attivo.burst > 0 
            ? `<div style="margin-top:15px; font-size:18px; color:#fff;">Dadi da lanciare: <span style="color:#ffcc00; font-weight:bold; font-size:28px;">${scontro.attivo.burst}</span></div>`
            : `<div style="margin-top:15px; font-size:18px; color:#555;">Nessun dado</div>`;

        // Un Valore di Successo sotto 1 e` un FALLIMENTO AUTOMATICO. Il motore
        // non lo porta piu` a 1: manda il valore vero (0 o negativo) con
        // impossibile: true. Mostrato cosi` com'e`, il numero grande diceva
        // "Successo al: -2 (o meno)" in verde, mentre sotto, piccolo, l'avviso
        // rosso diceva il contrario. Il flag lo leggiamo dai dati grezzi che
        // l'adattatore passa gia` (dati), senza riscrivere la regola del <1.
        // 6 ottobre, due casi che il motore ora dichiara e che qui non si
        // leggevano:
        // - requisitoFallito: l'Abilita` dichiarata diventa un Idle (burst 0).
        //   Il tabellone mostrava l'azione dichiarata e sotto "Nessun dado",
        //   senza dire perche`: sembrava un calcolo mancato. Va letto PRIMA
        //   del controllo sul burst, che qui e` 0 per forza.
        // - successoAutomatico: lo Scoprire senza tiro arrivava come
        //   "Successo al: Auto (o meno)".
        const valoreSuccesso = (lato) => {
            if (lato && lato.dati && lato.dati.requisitoFallito) {
                return `<span style="color:#ff9900; font-weight:bold; font-size:22px;">IDLE</span><br>` +
                       `<span style="color:#cc8844; font-size:12px;">Requisito non soddisfatto: l'Abilit\u00e0 dichiarata non si esegue</span><br>`;
            }
            if (lato && lato.dati && lato.dati.successoAutomatico) {
                return `<span style="color:#00ff00; font-weight:bold; font-size:22px;">SUCCESSO AUTOMATICO</span><br>` +
                       `<span style="color:#888; font-size:12px;">Nessun tiro</span><br>`;
            }
            // 7 ottobre (motore .07.3): colpoAnnullato azzera il Burst. Senza
            // questa riga il tabellone diceva "Nessun dado" e basta, come
            // per un'Abilita` che non tira: il perche` va scritto.
            if (lato && lato.dati && lato.dati.colpoAnnullato) {
                return `<span style="color:#ff5555; font-weight:bold; font-size:22px;">COLPO ANNULLATO</span><br>` +
                       // Il motivo e` del motore (dati.note). Stava solo nei
                       // dettagli, che sono chiusi: qui si legge subito.
                       `<span style="color:#cc8888; font-size:12px;">${(Array.isArray(lato.dati.note) && lato.dati.note.length) ? lato.dati.note.join('<br>') : 'Il tiro non si esegue.'}</span><br>`;
            }
            if (!(lato && lato.burst > 0)) return `<br>`;
            // Misurato il 6 ottobre con INGRESSO IN CAMPO e TRINCERARSI: il
            // calcolo manda burst 1 e mod null, e qui usciva in verde
            // "Successo al: null (o meno)". Un valore che non c'e` non si
            // stampa come se ci fosse: si dice che manca.
            if (lato.mod === null || lato.mod === undefined) {
                return `<span style="color:#888; font-size:13px;">Valore di Successo non fornito dal calcolo</span><br>`;
            }
            if (lato.dati && lato.dati.impossibile) {
                return `<span style="color:#ff3333; font-weight:bold; font-size:22px;">FALLIMENTO AUTOMATICO</span><br>` +
                       `<span style="color:#aa6666; font-size:12px;">Valore di Successo ${lato.mod}: sotto 1 il tiro fallisce</span><br>`;
            }
            return `<span style="color:#aaa; font-size:14px;">Successo al:</span> <span style="color:#00ff00; font-weight:bold; font-size:24px;">${lato.mod}</span> <span style="color:#888; font-size:12px;">(o meno)</span><br>`;
        };

        let modAttaccanteHtml = valoreSuccesso(scontro.attivo);
        let modDifensoreHtml = valoreSuccesso(scontro.reattivo);

        // 🔴 7 ottobre (Paolo, dal tavolo): IL LATO E` QUELLO DOVE SIEDE IL
        // GIOCATORE, non quello di chi e` attivo. Prima l'attivo stava sempre
        // a sinistra: a ogni cambio di turno le due fazioni si scambiavano di
        // posto sul tabellone, e chi guardava dalla sua sedia doveva
        // ricercarsi ogni volta. Ora la colonna la decide window.latoDi
        // (tasto INVERTI LATI), il colore resta della fazione (Nomads rossi,
        // PanOceania blu) e chi e` attivo lo dice una scritta in ogni cella,
        // perche` la posizione non lo dice piu`.
        const colore = (fazione) => (fazione === 'NOMADI') ? '#ff3333' : '#00ccff';
        const attivoADestra = window.latoDi(scontro.attivo.fazione) === 'DX';
        const sfondo = (fazione, aDestra) => 'linear-gradient(' + (aDestra ? '-90deg' : '90deg') + ', ' +
            ((fazione === 'NOMADI') ? '#330000' : '#001a33') + ', #000)';
        const SPENTO = 'rgba(255,255,255,0.02)';
        const ruolo = (attivo) => `<span style="color:#888; font-size:11px; letter-spacing:1px;">${attivo ? '▶ ATTIVO' : '🛡️ REATTIVO'}</span><br>`;
        // Una riga a due colonne. Si passano SEMPRE la cella dell'attivo e
        // quella del reattivo, in quest'ordine: dove finiscono lo decide il
        // posto a sedere. `acceso` false = la cella grigia di chi in quel
        // blocco non tira.
        const riga = (cellaAttivo, cellaReattivo, stileRiga, opz) => {
            opz = opz || {};
            const celle = attivoADestra ? [cellaReattivo, cellaAttivo] : [cellaAttivo, cellaReattivo];
            const fondo = (c, aDestra) => (c.fazione === undefined) ? ''
                : 'background:' + (c.acceso === false ? SPENTO : sfondo(c.fazione, aDestra)) + ';';
            return `<div style="display:flex; justify-content:space-between; ${stileRiga || ''}">
                    <div style="flex:1; ${opz.sx || ''} ${fondo(celle[0], false)}">${celle[0].html}</div>
                    <div style="flex:1; text-align:right; ${opz.dx || ''} ${fondo(celle[1], true)}">${celle[1].html}</div>
                </div>`;
        };
        const allineaDalLatoDi = (fazione) => (window.latoDi(fazione) === 'DX') ? 'right' : 'left';
        const testa = (lato, attivo) => ruolo(attivo) +
            `<b style="color:${colore(lato.fazione)}; font-size:22px;">${lato.fazione} ${lato.nome}</b><br>`;
        const cellaPiena = (lato, attivo, modHtml, dadiHtml) => ({ fazione: lato.fazione, html: testa(lato, attivo) +
            `<span style="color:#aaa; font-size:14px;">Azione:</span> <span style="color:#fff;">${lato.azione}</span><br>
                        ${modHtml}
                        ${dadiHtml}` });
        const cellaSpenta = (lato, attivo) => ({ fazione: lato.fazione, acceso: false, html: testa(lato, attivo) +
            `<span style="color:#aaa; font-size:14px;">Azione:</span> <span style="color:#888;">Nessuna reazione incrociata</span><br>
                            <br><div style="margin-top:15px; font-size:18px; color:#555;">Nessun dado</div>` });
        const DUE = { sx: 'border-right:2px solid #333; padding:15px;', dx: 'padding:15px;' };

        let isF2F = scontro.titolo === "TIRO FACCIA A FACCIA";
        let bothActing = scontro.attivo.burst > 0 && scontro.reattivo.burst > 0;

        let htmlScontro = "";

        if (isF2F || !bothActing) {
            htmlScontro =
                riga(cellaPiena(scontro.attivo, true, modAttaccanteHtml, dadiAttaccanteHtml),
                     cellaPiena(scontro.reattivo, false, modDifensoreHtml, dadiDifensoreHtml),
                     'background:#000; border-radius:8px; overflow:hidden;', DUE) +
                riga({ html: `<b style="color:#aaa;">🛡️ SE COLPITO DAL NEMICO:</b><br>${scontro.attivo.salvezza}` },
                     { html: `<b style="color:#aaa;">🛡️ SE COLPITO DALL'ATTACCANTE:</b><br>${scontro.reattivo.salvezza}` },
                     'margin-top:10px; background:#0a0a0a; border-radius:5px; padding:10px; font-size:14px; border: 1px solid #333;',
                     { sx: 'border-right:1px dashed #333; padding-right:10px;', dx: 'padding-left:10px;' });
        } else {
            const blocco = (chiTira, celle, colpito) => `
                <div style="background:#1a1a1a; border: 1px dashed #555; border-radius: 8px; padding: 10px; margin-bottom: 15px;">
                    <h4 style="color:#888; margin-top:0; text-align:center;">▶ RISOLUZIONE ${chiTira.fazione}</h4>
                    ${riga(celle[0], celle[1], 'background:#000; border-radius:8px; overflow:hidden; border:1px solid #333;', DUE)}
                    <div style="margin-top:10px; background:#0a0a0a; border-radius:5px; padding:10px; font-size:14px; border: 1px solid #333; text-align:${allineaDalLatoDi(colpito.fazione)};">
                        <b style="color:#aaa;">🛡️ SE COLPITO DA ${chiTira.fazione}:</b><br>
                        ${colpito.salvezza}
                    </div>
                </div>`;
            htmlScontro =
                blocco(scontro.attivo, [cellaPiena(scontro.attivo, true, modAttaccanteHtml, dadiAttaccanteHtml), cellaSpenta(scontro.reattivo, false)], scontro.reattivo) +
                blocco(scontro.reattivo, [cellaSpenta(scontro.attivo, true), cellaPiena(scontro.reattivo, false, modDifensoreHtml, dadiDifensoreHtml)], scontro.attivo);
        }

        // Le note DELLO SCONTRO (6 ottobre): dal calcolatore_math 2026-10-06.1
        // arrivano scontro.note e scontro.coperturaNegata. La piu` importante
        // e` la Copertura Parziale negata da Salto o Ingresso in Campo: se
        // il reattivo l'aveva dichiarata e il calcolo l'ha ignorata, i due
        // giocatori devono leggerlo SUL tabellone, non nei dettagli chiusi.
        // Il testo e` del motore; qui solo il riquadro.
        const noteScontro = Array.isArray(scontro.note) ? scontro.note.filter(Boolean) : [];
        const noteScontroHtml = noteScontro.length
            ? `<div style="margin-top:10px; padding:10px; background:#221500; border:1px solid #ff9900; border-radius:5px; color:#ffbb55; font-size:14px;">` +
              // Un'unita` non trovata non e` una nota fra le altre: il
              // calcolo sotto NON e` affidabile, e va detto in rosso, prima.
              ((scontro.attaccanteNonRisolto || scontro.bersaglioNonRisolto)
                  ? '<b style="color:#ff5555;">\ud83d\udea8 CALCOLO NON AFFIDABILE: ' +
                    (scontro.attaccanteNonRisolto ? 'ATTACCANTE' : 'BERSAGLIO') +
                    ((scontro.attaccanteNonRisolto && scontro.bersaglioNonRisolto) ? ' E BERSAGLIO' : '') + ' NON TROVATO</b><br>'
                  : '') +
              (scontro.coperturaNegata ? '<b>⛔ COPERTURA PARZIALE NEGATA</b><br>' : '') + noteScontro.join('<br>') + `</div>`
            : '';

        container.innerHTML += `
            <div style="background:#111; border:2px solid #444; border-radius:10px; padding:15px; margin-bottom:20px; box-shadow: 0 0 15px rgba(255,255,255,0.05);">
                <h3 style="color:${isF2F ? '#00ff00' : '#ffcc00'}; text-align:center; margin-top:0; font-family:'Teko'; font-size:32px; letter-spacing:1px;">${scontro.titolo}</h3>
                
                ${htmlScontro}
                ${noteScontroHtml}

                <div style="text-align:center; margin-top:15px;">
                    <button onclick="window.toggleDettagli('dettagli-${index}')" style="background:#222; border:1px dashed #555; color:#aaa; font-family:'Share Tech Mono'; padding:5px 15px; cursor:pointer; font-size:12px; border-radius:5px;">🔍 MOSTRA DETTAGLI CALCOLI</button>
                </div>

                <div id="dettagli-${index}" style="display:none; margin-top:10px; padding:10px; background:#0a0a0a; border:1px solid #333; border-radius:5px; font-size:14px;">
                    ${riga({ html: scontro.attivo.dettagliMod || "-" }, { html: scontro.reattivo.dettagliMod || "-" }, '',
                           { sx: 'border-right:1px solid #333; padding-right:10px; color:#ddd;', dx: 'padding-left:10px; color:#ddd;' })}
                </div>
            </div>
        `;
    });
};

window.chiudiRisoluzione = () => {
    // 1. Torna alla vista radar dell'Hub
    document.getElementById('step-resolution').style.display = 'none';
    // '' e non 'block': la riga in alto e` un flex (7 ottobre), e 'block'
    // scritto qui la rimetteva in colonna dopo la prima risoluzione.
    document.querySelector('.turn-controller').style.display = '';
    document.querySelector('.status-grid').style.display = 'grid'; 
    document.querySelector('.log-container').style.display = 'block';

    // 2. Svuota il tabellone degli scontri gia' risolti
    const clash = document.getElementById('clash-container');
    if (clash) clash.innerHTML = "";

    // 3. Chiude l'ordine: senza questo azzeramento le reazioni ARO di questo
    //    ordine restano in memoria e vengono riusate nel calcolo successivo.
    window.latestAroData = null;

    // 4. Ripulisce i canali dell'ordine appena chiuso.
    //    hub_sblocco_attivo in particolare: se resta sul server, un'app che si
    //    ricarica lo rilegge all'avvio e si sblocca la 2a meta' dell'ordine
    //    senza che nessuno abbia dichiarato un ARO.
    localStorage.removeItem(window.MotoreN5.CANALI.HUB_SBLOCCO);
    localStorage.removeItem(window.MotoreN5.CANALI.ALLARME_ATTACCO);
    localStorage.removeItem(window.MotoreN5.CANALI.COMUNICAZIONE);

    window.updateLog("✅ Ordine chiuso. Hub pronto per il prossimo ordine.");
    window.refreshUI();
};

// Dichiarazione di versione per il controllo incrociato fra chat.
// Funziona anche se questo file si carica PRIMA del motore: in quel
// caso la versione resta in coda e il motore la raccoglie all'avvio.
(function () {
    var g = (typeof window !== 'undefined') ? window : globalThis;
    var v = { file: 'calcolatore_controller.js', versione: '2026-10-07.1', proprieta: 'INTERFACCIA' };
    if (g.MotoreN5 && g.MotoreN5.dichiaraVersione) g.MotoreN5.dichiaraVersione(v.file, v.versione, v.proprieta);
    else { g.__versioniN5 = g.__versioniN5 || []; g.__versioniN5.push(v); }
})();
