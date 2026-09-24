// @versione 2026-09-23.4 | calcolatore_controller.js | proprieta`: chat INTERFACCIA
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

window.toggleTurn = () => {
    window.gameState.activeFaction = (window.gameState.activeFaction === 'NOMADI') ? 'PANOCEANIA' : 'NOMADI';
    
    // Azzera i canali ARO al cambio turno
    localStorage.removeItem(window.MotoreN5.CANALI.COMUNICAZIONE);
    localStorage.removeItem(window.MotoreN5.CANALI.ALLARME_ATTACCO);
    localStorage.removeItem(window.MotoreN5.CANALI.ARO_NOMADI);
    localStorage.removeItem(window.MotoreN5.CANALI.ARO_PANOCEANIA);

    // Aggiorna l'interfaccia dell'HUB
    const textElem = document.getElementById('current-active-text');
    if(textElem) {
        textElem.innerText = window.gameState.activeFaction;
        textElem.style.color = (window.gameState.activeFaction === 'NOMADI') ? '#ff0000' : '#00ccff';
    }

    // SPEDISCE IL SEGNALE DI CAMBIO TURNO VIA CLOUD
    localStorage.setItem(window.MotoreN5.CANALI.HUB_TURNO, JSON.stringify({ attivo: window.gameState.activeFaction }));
    
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

window.broadcastState = () => {
    localStorage.setItem(window.MotoreN5.CANALI.STATO_PARTITA, JSON.stringify(window.gameState));
};

// --- 2. LOOP DI ASCOLTO (IL VIGILE URBANO) ---
setInterval(() => {
    // Ascolto Setup Nomadi
    let sNom = localStorage.getItem(window.MotoreN5.CANALI.SETUP_NOMADI);
    if(sNom) {
        const datiNom = JSON.parse(sNom);
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
        window.updateLog("🎲 Ricevuti i parametri finali! Calcolo in corso...");
        let datiReali = JSON.parse(calcolo);
        
        // 1. ELIMINIAMO SUBITO IL DATO: così se il calcolo esplode, non entriamo nel loop infinito
        localStorage.removeItem(window.MotoreN5.CANALI.HUB_CALCOLO);
        
        // 2. GABBIA DI SICUREZZA (Try-Catch)
        try {
            if(window.generaRisoluzioneDaDati) {
                let scontriCalcolati = window.generaRisoluzioneDaDati(datiReali);
                window.mostraSchermataRisoluzione(scontriCalcolati);
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
window.etichettaStato = (icona, testo, sfondo, colore, titolo, nullo) => {
    const bordo = nullo ? ' box-shadow: inset 0 0 0 2px #ff2020;' : '';
    const segno = nullo ? ` <b style="color:#ff5050; font-size:9px; letter-spacing:1px;">NULL</b>` : '';
    const suggerimento = nullo
        ? (titolo ? titolo + ' \u2014 ' : '') + 'Stato Null: non da` Ordini ne` Punti Vittoria'
        : (titolo || testo);
    return `<span class="state-tag" style="background:${sfondo}; color:${colore};${bordo}" title="${suggerimento}">${icona} ${testo}${segno}</span>`;
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
            if (v) {
                tags += window.etichettaStato(v.icona, nome, v.sfondo, v.colore, gruppo.categoria, nullo);
            } else {
                // Il motore lo conosce, il tabellone non sa disegnarlo:
                // si mostra col suo nome vero. Manca l'icona, non lo stato.
                tags += window.etichettaStato('\u2753', nome, '#552200', '#ffaa66',
                    gruppo.categoria + ' \u2014 icona non prevista dal tabellone', nullo);
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

window.mostraSchermataRisoluzione = (scontri) => {
    document.querySelector('.turn-controller').style.display = 'none';
    document.querySelector('.status-grid').style.display = 'none';
    document.querySelector('.log-container').style.display = 'none';
    
    document.getElementById('step-resolution').style.display = 'block';

    let container = document.getElementById('clash-container');
    container.innerHTML = "";

    if (!scontri || scontri.length === 0) {
        container.innerHTML = `<h2 style="color:red; text-align:center;">NESSUN TIRO DI DADO DA EFFETTUARE.</h2>`;
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
        const valoreSuccesso = (lato) => {
            if (!(lato && lato.burst > 0)) return `<br>`;
            if (lato.dati && lato.dati.impossibile) {
                return `<span style="color:#ff3333; font-weight:bold; font-size:22px;">FALLIMENTO AUTOMATICO</span><br>` +
                       `<span style="color:#aa6666; font-size:12px;">Valore di Successo ${lato.mod}: sotto 1 il tiro fallisce</span><br>`;
            }
            return `<span style="color:#aaa; font-size:14px;">Successo al:</span> <span style="color:#00ff00; font-weight:bold; font-size:24px;">${lato.mod}</span> <span style="color:#888; font-size:12px;">(o meno)</span><br>`;
        };

        let modAttaccanteHtml = valoreSuccesso(scontro.attivo);
        let modDifensoreHtml = valoreSuccesso(scontro.reattivo);

        let isNomadsAttivo = scontro.attivo.fazione === 'NOMADI';
        let colAttivo = isNomadsAttivo ? '#ff3333' : '#00ccff';
        let bgAttivo = isNomadsAttivo ? 'linear-gradient(90deg, #330000, #000)' : 'linear-gradient(90deg, #001a33, #000)';
        
        let isNomadsReattivo = scontro.reattivo.fazione === 'NOMADI';
        let colReattivo = isNomadsReattivo ? '#ff3333' : '#00ccff';
        let bgReattivo = isNomadsReattivo ? 'linear-gradient(-90deg, #330000, #000)' : 'linear-gradient(-90deg, #001a33, #000)';

        let isF2F = scontro.titolo === "TIRO FACCIA A FACCIA";
        let bothActing = scontro.attivo.burst > 0 && scontro.reattivo.burst > 0;

        let htmlScontro = "";

        if (isF2F || !bothActing) {
            htmlScontro = `
                <div style="display:flex; justify-content:space-between; background:#000; border-radius:8px; overflow:hidden;">
                    <div style="flex:1; border-right:2px solid #333; padding:15px; background:${bgAttivo};">
                        <b style="color:${colAttivo}; font-size:22px;">${scontro.attivo.fazione} ${scontro.attivo.nome}</b><br>
                        <span style="color:#aaa; font-size:14px;">Azione:</span> <span style="color:#fff;">${scontro.attivo.azione}</span><br>
                        ${modAttaccanteHtml}
                        ${dadiAttaccanteHtml}
                    </div>
                    <div style="flex:1; padding:15px; text-align:right; background:${bgReattivo};">
                        <b style="color:${colReattivo}; font-size:22px;">${scontro.reattivo.fazione} ${scontro.reattivo.nome}</b><br>
                        <span style="color:#aaa; font-size:14px;">Azione:</span> <span style="color:#fff;">${scontro.reattivo.azione}</span><br>
                        ${modDifensoreHtml}
                        ${dadiDifensoreHtml}
                    </div>
                </div>
                <div style="display:flex; justify-content:space-between; margin-top:10px; background:#0a0a0a; border-radius:5px; padding:10px; font-size:14px; border: 1px solid #333;">
                    <div style="flex:1; border-right:1px dashed #333; padding-right:10px;">
                        <b style="color:#aaa;">🛡️ SE COLPITO DAL NEMICO:</b><br>
                        ${scontro.attivo.salvezza}
                    </div>
                    <div style="flex:1; padding-left:10px; text-align:right;">
                        <b style="color:#aaa;">🛡️ SE COLPITO DALL'ATTACCANTE:</b><br>
                        ${scontro.reattivo.salvezza}
                    </div>
                </div>
            `;
        } else {
            htmlScontro = `
                <div style="background:#1a1a1a; border: 1px dashed #555; border-radius: 8px; padding: 10px; margin-bottom: 15px;">
                    <h4 style="color:#888; margin-top:0; text-align:center;">▶ RISOLUZIONE ${scontro.attivo.fazione}</h4>
                    <div style="display:flex; justify-content:space-between; background:#000; border-radius:8px; overflow:hidden; border:1px solid #333;">
                        <div style="flex:1; border-right:2px solid #333; padding:15px; background:${bgAttivo};">
                            <b style="color:${colAttivo}; font-size:22px;">${scontro.attivo.fazione} ${scontro.attivo.nome}</b><br>
                            <span style="color:#aaa; font-size:14px;">Azione:</span> <span style="color:#fff;">${scontro.attivo.azione}</span><br>
                            ${modAttaccanteHtml}
                            ${dadiAttaccanteHtml}
                        </div>
                        <div style="flex:1; padding:15px; text-align:right; background:rgba(255,255,255,0.02);">
                            <b style="color:${colReattivo}; font-size:22px;">${scontro.reattivo.fazione} ${scontro.reattivo.nome}</b><br>
                            <span style="color:#aaa; font-size:14px;">Azione:</span> <span style="color:#888;">Nessuna reazione incrociata</span><br>
                            <br><div style="margin-top:15px; font-size:18px; color:#555;">Nessun dado</div>
                        </div>
                    </div>
                    <div style="margin-top:10px; background:#0a0a0a; border-radius:5px; padding:10px; font-size:14px; border: 1px solid #333; text-align:right;">
                        <b style="color:#aaa;">🛡️ SE COLPITO DA ${scontro.attivo.fazione}:</b><br>
                        ${scontro.reattivo.salvezza}
                    </div>
                </div>

                <div style="background:#1a1a1a; border: 1px dashed #555; border-radius: 8px; padding: 10px;">
                    <h4 style="color:#888; margin-top:0; text-align:center;">▶ RISOLUZIONE ${scontro.reattivo.fazione}</h4>
                    <div style="display:flex; justify-content:space-between; background:#000; border-radius:8px; overflow:hidden; border:1px solid #333;">
                        <div style="flex:1; border-right:2px solid #333; padding:15px; background:rgba(255,255,255,0.02);">
                            <b style="color:${colAttivo}; font-size:22px;">${scontro.attivo.fazione} ${scontro.attivo.nome}</b><br>
                            <span style="color:#aaa; font-size:14px;">Azione:</span> <span style="color:#888;">Nessuna reazione incrociata</span><br>
                            <br><div style="margin-top:15px; font-size:18px; color:#555;">Nessun dado</div>
                        </div>
                        <div style="flex:1; padding:15px; text-align:right; background:${bgReattivo};">
                            <b style="color:${colReattivo}; font-size:22px;">${scontro.reattivo.fazione} ${scontro.reattivo.nome}</b><br>
                            <span style="color:#aaa; font-size:14px;">Azione:</span> <span style="color:#fff;">${scontro.reattivo.azione}</span><br>
                            ${modDifensoreHtml}
                            ${dadiDifensoreHtml}
                        </div>
                    </div>
                    <div style="margin-top:10px; background:#0a0a0a; border-radius:5px; padding:10px; font-size:14px; border: 1px solid #333; text-align:left;">
                        <b style="color:#aaa;">🛡️ SE COLPITO DA ${scontro.reattivo.fazione}:</b><br>
                        ${scontro.attivo.salvezza}
                    </div>
                </div>
            `;
        }

        container.innerHTML += `
            <div style="background:#111; border:2px solid #444; border-radius:10px; padding:15px; margin-bottom:20px; box-shadow: 0 0 15px rgba(255,255,255,0.05);">
                <h3 style="color:${isF2F ? '#00ff00' : '#ffcc00'}; text-align:center; margin-top:0; font-family:'Teko'; font-size:32px; letter-spacing:1px;">${scontro.titolo}</h3>
                
                ${htmlScontro}

                <div style="text-align:center; margin-top:15px;">
                    <button onclick="window.toggleDettagli('dettagli-${index}')" style="background:#222; border:1px dashed #555; color:#aaa; font-family:'Share Tech Mono'; padding:5px 15px; cursor:pointer; font-size:12px; border-radius:5px;">🔍 MOSTRA DETTAGLI CALCOLI</button>
                </div>

                <div id="dettagli-${index}" style="display:none; margin-top:10px; padding:10px; background:#0a0a0a; border:1px solid #333; border-radius:5px; font-size:14px;">
                    <div style="display:flex; justify-content:space-between;">
                        <div style="flex:1; border-right:1px solid #333; padding-right:10px; color:#ddd;">
                            ${scontro.attivo.dettagliMod || "-"}
                        </div>
                        <div style="flex:1; padding-left:10px; text-align:right; color:#ddd;">
                            ${scontro.reattivo.dettagliMod || "-"}
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
};

window.chiudiRisoluzione = () => {
    // 1. Torna alla vista radar dell'Hub
    document.getElementById('step-resolution').style.display = 'none';
    document.querySelector('.turn-controller').style.display = 'block';
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
    var v = { file: 'calcolatore_controller.js', versione: '2026-09-14.2', proprieta: 'INTERFACCIA' };
    if (g.MotoreN5 && g.MotoreN5.dichiaraVersione) g.MotoreN5.dichiaraVersione(v.file, v.versione, v.proprieta);
    else { g.__versioniN5 = g.__versioniN5 || []; g.__versioniN5.push(v); }
})();
