// @versione 2026-09-27.1 | motore_core.js | proprieta`: chat MOTORE
// ==========================================
// 🧠 MOTORE CORE v2.1 - IL VIGILE URBANO & HUB CLOUD
// ==========================================

const firebaseConfig = {
    apiKey: "AIzaSyAMpF8Le_srYjxgC7vb231Ng40iXwr256o",
    authDomain: "infinityn5-database.firebaseapp.com",
    databaseURL: "https://infinityn5-database-default-rtdb.firebaseio.com",
    projectId: "infinityn5-database",
    storageBucket: "infinityn5-database.firebasestorage.app",
    messagingSenderId: "506923243459",
    appId: "1:506923243459:web:4aa5e59c84c9d8156c4f76"
};

// Inizializza Firebase Compat (Evita i blocchi CORS del browser per i file locali)
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// --- 1. MOTORE CLOUD INVISIBILE (Sincronizzazione) ---
// L'elenco dei canali viene dal MOTORE, una volta sola (M.CANALI).
// Prima era una copia qui e una in calcolatore_cloud.js: due elenchi da
// tenere uguali a mano. (Chat INTERFACCIA + MOTORE, 23 settembre.)
const canaliCloud = Object.values(window.MotoreN5.CANALI);

const originalSetItem = localStorage.setItem;
const originalRemoveItem = localStorage.removeItem;

// PRIMA LETTURA DAL CLOUD — per la ripresa della partita.
// window.cloudPronto si risolve quando OGNI canale ha ricevuto il primo valore
// da Firebase (anche null) e la copia locale e` aggiornata; oppure dopo 8
// secondi con { confermato: false }. window.riprovaCloud() da` una nuova
// Promise della stessa forma. La logica sta in M.creaAttesaCloud (motore),
// una volta sola per app e Hub. (Chat INTERFACCIA, 25 settembre.)
const attesaCloud = window.MotoreN5.creaAttesaCloud(canaliCloud, { tempoMassimo: 8000 });
window.cloudPronto  = attesaCloud.pronto;
window.riprovaCloud = attesaCloud.riprova;
window.statoCloud   = attesaCloud.stato;

canaliCloud.forEach(canale => {
    db.ref(canale).on('value', (snapshot) => {
        const dati = snapshot.val();
        if (dati !== null) {
            originalSetItem.call(localStorage, canale, dati);
            let eventoFake = new Event('storage');
            eventoFake.key = canale;
            eventoFake.newValue = dati;
            window.dispatchEvent(eventoFake);
        } else {
            originalRemoveItem.call(localStorage, canale);
        }
        // Si segna DOPO la scrittura: "arrivato" vuol dire "copia locale pronta".
        attesaCloud.segna(canale);
    });
});

localStorage.setItem = function(key, value) {
    if (canaliCloud.includes(key)) {
        db.ref(key).set(value);
    } else {
        originalSetItem.call(localStorage, key, value);
    }
};

localStorage.removeItem = function(key) {
    if (canaliCloud.includes(key)) {
        // 🔴 Si cancella SUBITO anche la copia locale.
        // Prima si chiamava solo db.ref().remove(), e la copia locale
        // spariva solo quando Firebase rimandava l'evento a null — dopo un
        // giro di rete. Nel frattempo chi rileggeva la chiave la trovava
        // ancora li`, e con la rete lenta il ciclo si ripeteva: e` la
        // causa dello scorrimento che tornava in cima ogni secondo.
        originalRemoveItem.call(localStorage, key);
        db.ref(key).remove();
    } else {
        originalRemoveItem.call(localStorage, key);
    }
};

// --- 2. COMUNICAZIONE STANDARD (Spedizionieri) ---

// 🔴 L'UNICO PUNTO CHE SCRIVE I CANALI SETUP_*. Riceve il roster PRIVATO e
// costruisce lui la busta con M.bustaSchieramento: nessun chiamante puo` piu`
// passargli un roster non filtrato. Prima riceveva una busta gia` fatta, e un
// chiamante (il Fuoco di Soppressione) gli dava window.roster intero.
//   inviaSchieramentoAllHub(fazione, { roster, strutture, terreni, motivo })
//   motivo: 'SCHIERAMENTO' (default) | 'AGGIORNAMENTO' — vedi M.bustaSchieramento
//   -> { inviato: true, busta } | { inviato: false, motivo }
// La copia locale PRIVATA si salva PRIMA dell'invio e FUORI dalla busta.
// Senza motore non si spedisce: spedire non filtrato e` peggio che non
// spedire. (Chat INTERFACCIA, 25 settembre.)
window.inviaSchieramentoAllHub = (fazione, dati) => {
    const M = window.MotoreN5;
    if (typeof fazione !== 'string' || !dati || typeof dati !== 'object') {
        console.error('⛔ inviaSchieramentoAllHub(fazione, { roster, strutture, terreni }): firma sbagliata, niente invio.');
        return { inviato: false, motivo: 'firma sbagliata' };
    }
    if (!M || typeof M.bustaSchieramento !== 'function') {
        console.error('⛔ Motore non caricato: lo schieramento NON è stato inviato (senza filtro rivelerebbe CAMO e Hidden).');
        return { inviato: false, motivo: 'motore non caricato' };
    }
    if (typeof window.salvaPartitaLocale === 'function') window.salvaPartitaLocale();
    // I token sul tavolo stanno NEL ROSTER, come le unita` (decisione di
    // Paolo, 26 settembre): viaggiano con lui. window.tokenPiazzati si legge
    // ancora, solo per le copie locali salvate prima; i doppioni li toglie
    // M.bustaSchieramento.
    const token = dati.token || window.tokenPiazzati || [];
    const busta = M.bustaSchieramento(dati.roster, dati.strutture, dati.terreni,
                                      { motivo: dati.motivo, token: token });
    localStorage.setItem(M.canaleSetup(fazione), JSON.stringify(busta));
    console.log(`📡 Core: Dati di schieramento ${fazione} inviati all'Hub.`);
    return { inviato: true, busta: busta };
};

window.inviaAllarmeAro = (payload) => {
    localStorage.setItem(window.MotoreN5.CANALI.COMUNICAZIONE, JSON.stringify(payload));
    console.log("🚨 Core: Allarme ARO inviato all'Hub.", payload);
};

// Scala gli usi Disposable delle armi che hanno sparato, sulle unita` del
// roster di QUESTO giocatore. Un punto solo per tutti i moduli d'attacco
// (e per le reazioni): prima nessuno li scalava. (27 settembre.)
function consumaUsiSpari(voci) {
    const M = window.MotoreN5;
    if (!M || typeof M.consumaUsi !== 'function' || !Array.isArray(window.roster)) return [];
    const fatti = [];
    voci.forEach(function (v) {
        const i = window.roster.findIndex(u => u && ((v.id && u.id === v.id) || (v.nome && M.nomeUnita(u) === v.nome)));
        if (i < 0 || !(v.n > 0)) return;
        const nuova = M.consumaUsi(window.roster[i], v.arma, v.n);
        Object.assign(window.roster[i], { usiSpesi: nuova.usiSpesi });   // stesso oggetto: chi lo tiene lo vede
        fatti.push({ unita: M.nomeUnita(window.roster[i]), arma: v.arma.nome, usi: v.n });
    });
    if (fatti.length && typeof window.salvaPartitaLocale === 'function') window.salvaPartitaLocale();
    return fatti;
}

window.inviaCalcoloAllHub = (payload) => {
    const M = window.MotoreN5;
    localStorage.setItem(M.CANALI.HUB_CALCOLO, JSON.stringify(payload));
    console.log("🎲 Core: Dati di calcolo inviati all'Hub.", payload);
    const voci = ((payload && payload.attacchi) || []).map(function (a) {
        const arma = (typeof a.arma === 'string') ? M.profiloArma(a.arma) : a.arma;
        return { id: a.attaccanteId, nome: M.nomeUnita(a.attaccante), arma: arma,
                 n: M.usiDaConsumare(arma, (a.bersagli || []).map(b => b.burst), a.azione) };
    });
    return consumaUsiSpari(voci);
};

window.inviaRispostaAro = (payload, fazione) => {
    // Residuo del 23 settembre: i doppi apici erano sfuggiti al porto su M.CANALI.
    const canale = window.MotoreN5.canaleAro(fazione);
    localStorage.setItem(canale, JSON.stringify(payload));
    // Anche in ARO un'arma Disposable si consuma: il Burst reattivo lo dice
    // il motore (1, o pieno con Neurocinetics / Total Reaction).
    const M = window.MotoreN5;
    consumaUsiSpari(((payload && payload.reazioni) || []).map(function (r) {
        const u = (window.roster || []).find(x => x && x.id === r.id);
        const arma = r.arma ? ((typeof r.arma === 'string') ? M.profiloArma(r.arma) : r.arma) : null;
        const b = (u && arma) ? (M.burstReattivo(u, arma).valore || 1) : 0;
        return { id: r.id, arma: arma, n: arma ? M.usiDaConsumare(arma, [b], r.azione) : 0 };
    }).filter(v => v.arma));
    console.log(`🛡️ Core: Risposta ARO (${fazione}) inviata all'Hub.`);
};


// --- 3. GESTIONE TURNI E FASI ---
window.isReactiveMode = false;

window.applicaCambioTurno = (valoreRicevuto, opzioni) => {
    opzioni = opzioni || {};
    if (!window.schieramentoCompletato) return;
    
    let dati;
    try {
        dati = typeof valoreRicevuto === 'string' ? JSON.parse(valoreRicevuto) : valoreRicevuto;
    } catch (e) {
        console.error("Errore decodifica dati turno:", e);
        return;
    }

    console.log("🔄 Core: Cambio turno applicato. Tocca a:", dati.attivo);

    document.querySelectorAll('.step-container').forEach(el => el.style.display = 'none');
    document.getElementById('step-sync').style.display = 'none';
    if(document.getElementById('setup')) document.getElementById('setup').style.display = 'none';
    let header = document.getElementById('battle-header');
    if(header) header.style.display = 'none';

    if (dati.attivo === (document.title.includes("NOMADS") ? 'NOMADI' : 'PANOCEANIA')) {
        window.isReactiveMode = false;
        document.getElementById('battle').style.display = 'flex';
        if(window.aggiornaMenuGruppi) window.aggiornaMenuGruppi(); 
    } else {
        window.isReactiveMode = true;
        let banner = document.getElementById('aro-alert-banner');
        if (banner) banner.style.display = 'none';
        // Al cambio turno l'allarme vecchio si toglie. Alla RIPRESA no: il
        // localStorage e` intercettato, e toglierlo qui lo cancellerebbe anche
        // su Firebase, per entrambi — proprio l'ordine a meta` che deve restare
        // leggibile. (25 settembre.)
        if (!opzioni.ripresa) localStorage.removeItem(window.MotoreN5.CANALI.ALLARME_ATTACCO);

        document.getElementById('step-reactive-turn').style.display = 'flex';
        if(window.renderReactiveRoster) window.renderReactiveRoster(); 
    }
};

// --- 4. IL ROUTER DEGLI ORDINI (Il "Vigile Urbano") ---
//
// Era una catena di if/else con le stringhe delle azioni scritte a mano.
// Due difetti:
//
//  1. MANCAVA L'ATTACCO INTUITIVO. Il modulo esiste ed e` collaudato, ma
//     nessun caso lo chiamava: l'azione cadeva nell'else finale e apriva
//     il modulo MOVIMENTO. Dichiarare un Attacco Intuitivo faceva muovere
//     la miniatura.
//
//  2. L'ELSE FINALE INGHIOTTIVA TUTTO. Qualsiasi azione non riconosciuta
//     — un refuso, un'azione nuova, un modulo non caricato — diventava un
//     movimento in silenzio. E` esattamente il "default silenzioso" che
//     abbiamo tolto da ogni altra parte del progetto.
//
// Ora e` una TABELLA. Aggiungere un'azione significa aggiungere una riga,
// e il controllo di coerenza col vocabolario del motore dice subito se
// qualcosa non torna.

window.ROUTER_AZIONI = [
    { test: (a) => a.includes('ATTACCO BS'),          modulo: 'avviaFaseAttaccoBS',  nome: 'Attacco BS' },
    { test: (a) => a === 'ATTACCO INTUITIVO',         modulo: 'avviaFaseIntuitivo',  nome: 'Attacco Intuitivo' },
    { test: (a) => a === 'ATTACCO CC' || a === 'CC_ATTACK' || a === 'BERSERK' || a === 'PROTHEION',
                                                      modulo: 'avviaFaseCC',         nome: 'Corpo a Corpo' },
    { test: (a) => a === 'HACKING',                   modulo: 'avviaFaseHacking',    nome: 'Hacking' },
    { test: (a) => a === 'FUOCO SPECULATIVO',         modulo: 'avviaFaseSpeculativo', nome: 'Fuoco Speculativo' },
    { test: (a) => a === 'ATTACCO GUIDATO',           modulo: 'avviaFaseGuidato',    nome: 'Attacco Guidato' },
    { test: (a) => a === 'SCHIVATA' || a === 'RESET', modulo: 'avviaFaseDifesa',     nome: 'Difesa' },
    // La Soppressione la gestisce il modulo Difesa, che ha avviaSoppressione:
    // finora era raggiungibile solo da un bottone, mai dal router.
    { test: (a) => a === 'SOPPRESSIONE',              modulo: 'avviaSoppressione',   nome: 'Fuoco di Soppressione' },
    { test: (a) => a === 'SCOPRIRE',                  modulo: 'avviaFaseScoprire',   nome: 'Scoprire' },
    // Le due azioni che agiscono sulla SCENOGRAFIA. Finivano nell'alert
    // "Azione non riconosciuta" perche` non avevano bersagli su cui agire:
    // ora la scenografia e` bersagliabile e hanno un senso.
    { test: (a) => a === 'INTERAGIRE OBIETTIVO' || a === 'INTERAGIRE',
                                                      modulo: 'avviaFaseScenografia', nome: 'Interagire con Obiettivo' },
    { test: (a) => a === 'DEACTIVATOR',               modulo: 'avviaFaseScenografia', nome: 'Deactivator' },
    // Piazzare un Deployable: nessun tiro, nessun bersaglio. Il modulo
    // arriva con la passata 3; finche` manca il router lo dice.
    { test: (a) => a === 'FORWARD OBSERVER' || a === 'SENSOR' || a === 'TRIANGULATED FIRE',
                                                      modulo: 'avviaFaseOsservazione', nome: 'Osservazione' },
    { test: (a) => a === 'INGRESSO IN CAMPO' || a === 'REQUEST SPEEDBALL',
                                                      modulo: 'avviaFaseLogistica', nome: 'Logistica' },
    { test: (a) => a === 'TRINCERARSI',               modulo: 'avviaFaseTrincerarsi', nome: 'Trincerarsi' },
    { test: (a) => a === 'PIAZZARE EQUIPAGGIAMENTO' || a === 'PIAZZA_DEPLOYABLE',
                                                      modulo: 'avviaFaseDeployable', nome: 'Piazza Deployable' },
    { test: (a) => a === 'MEDICO_INGEGNERE' || a === 'SUPPORTO_WIP' || a === 'SUPPORTO_BS',
                                                      modulo: 'avviaFaseSupporto',   nome: 'Supporto' }
];

window.selectAction = (actionId, isSecondHalf = false) => {
    window.currentOrder = window.currentOrder || {};
    const azione = String(actionId || '').trim();
    console.log(`🚥 Router: [${azione}]${isSecondHalf ? ' (seconda metà)' : ''}`);

    const voce = window.ROUTER_AZIONI.find(v => v.test(azione));

    if (voce) {
        if (typeof window[voce.modulo] === 'function') {
            // 🔴 RETE CONTRO LE ECCEZIONI.
            // Il motore solleva di proposito quando trova un errore di
            // programmazione — M.esito() su un oggetto senza campo di
            // giudizio, per esempio. E` la scelta giusta mentre si scrive
            // il codice, ed e` pessima al tavolo: senza rete la schermata
            // si pianta a meta` dichiarazione e la partita si ferma.
            //
            // Qui l'ordine non viene eseguito, ma l'app resta viva e il
            // giocatore puo` ridichiarare o scegliere altro. Il dettaglio
            // finisce in console per chi dovra` capirci qualcosa dopo.
            try {
                return window[voce.modulo](azione, isSecondHalf);
            } catch (e) {
                console.error(`⛔ Eccezione nel modulo "${voce.nome}" (${voce.modulo}):`, e);
                window.ultimaEccezione = { modulo: voce.modulo, azione: azione, errore: e, quando: Date.now() };
                alert(`⛔ Errore durante "${voce.nome}".\n\n` +
                      `L'ordine NON è stato eseguito: puoi ridichiararlo o sceglierne un altro.\n\n` +
                      `Dettaglio: ${e && e.message ? e.message : e}`);
                return;
            }
        }
        // Il modulo dovrebbe esserci ma non c'e`: si dice, non si ripiega.
        console.error(`⛔ Modulo "${voce.nome}" mancante (${voce.modulo} non definita).`);
        alert(`⛔ Il modulo "${voce.nome}" non è caricato.\n\nL'ordine non può essere eseguito.`);
        return;
    }

    // Nessuna voce: e` un'azione senza tiro? Il motore lo sa.
    const M = window.MotoreN5;
    const senzaTiro = M ? M.azioneSenzaTiro(azione) : null;

    if (senzaTiro || !M) {
        if (window.avviaFaseMovimento) {
            try {
                return window.avviaFaseMovimento(azione, isSecondHalf);
            } catch (e) {
                console.error('⛔ Eccezione nel modulo Movimento:', e);
                window.ultimaEccezione = { modulo: 'avviaFaseMovimento', azione: azione, errore: e, quando: Date.now() };
                alert(`⛔ Errore durante il Movimento.\n\nL'ordine NON è stato eseguito.\n\n` +
                      `Dettaglio: ${e && e.message ? e.message : e}`);
                return;
            }
        }
        console.warn(`Modulo Movimento assente per ${azione}`);
        return;
    }

    // 🔴 Azione sconosciuta: NON si fa finta che sia un movimento.
    console.error(`⛔ Azione "${azione}" non riconosciuta: né nel router né fra le azioni senza tiro.`);
    alert(`⛔ Azione "${azione}" non riconosciuta.\n\nNon è un attacco noto né un'abilità di movimento: l'ordine non è stato eseguito.`);
};

// Controllo di coerenza fra router e vocabolario del motore.
// Da chiamare in console durante il collaudo.
// 🔴 verificaRouter risponde su cio` che e` caricato IN QUEL MOMENTO.
// In Node quello lo decide chi la chiama, quindi la risposta e` sempre
// ottimista: caricando i moduli a mano e poi chiedendo al router se
// siano a posto, si fa una domanda di cui si conosce gia` la risposta.
//
// E` successo: tre moduli scritti e instradati non erano fra gli
// <script src> di app.html, e per sei ordini l'app dava "Azione non
// riconosciuta" mentre il controllo diceva "router coerente".
//
// Serve una seconda fonte che non dipenda da chi verifica: la lista
// degli script della PAGINA. E` la stessa struttura a piu` fonti di
// M.fileAttesi(), applicata al router.
window.moduliDellaPagina = function () {
    if (typeof document === 'undefined' || !document.scripts) return null;
    return Array.prototype.slice.call(document.scripts)
        .map(function (sc) { return sc.src; })
        .filter(Boolean)
        .map(function (src) { return String(src).split('?')[0].split('/').pop(); });
};

window.verificaRouter = () => {
    const M = window.MotoreN5;
    if (!M) return ['motore non caricato'];
    const problemi = [];

    // I file che la pagina carica davvero. Se non si puo` sapere — in Node
    // senza document.scripts — si dice, invece di dare per verificato cio`
    // che non lo e`.
    const dallaPagina = window.moduliDellaPagina();
    const fileDeiModuli = {
        avviaFaseAttaccoBS: 'ordine_attacco_bs.js',
        avviaFaseCC: 'ordine_attacco_cc.js',
        avviaFaseGuidato: 'ordine_attacco_guidato.js',
        avviaFaseIntuitivo: 'ordine_attacco_intuitivo.js',
        avviaFaseSpeculativo: 'ordine_fuoco_speculativo.js',
        avviaFaseHacking: 'ordine_hacking.js',
        avviaFaseScoprire: 'ordine_scoprire.js',
        avviaFaseSupporto: 'ordine_supporto.js',
        avviaFaseDifesa: 'ordine_difesa.js',
        avviaSoppressione: 'ordine_difesa.js',
        avviaFaseMovimento: 'ordine_movimento.js',
        avviaFaseScenografia: 'ordine_scenografia.js',
        avviaFaseDeployable: 'ordine_piazzamento.js',
        avviaFaseTrincerarsi: 'ordine_trincerarsi.js',
        avviaFaseOsservazione: 'ordine_osservazione.js',
        avviaFaseLogistica: 'ordine_logistica.js'
    };
    if (dallaPagina) {
        window.ROUTER_AZIONI.forEach(function (v) {
            const file = fileDeiModuli[v.modulo];
            if (file && dallaPagina.indexOf(file) < 0) {
                problemi.push(`"${v.nome}": ${file} NON è fra gli <script src> della pagina.`);
            }
        });
    } else {
        problemi.push('⚠️ Lista degli script della pagina non disponibile: verificato solo cosa è caricato in memoria, non cosa la pagina carica.');
    }

    Object.values(M.AZIONI).forEach(function (az) {
        const voce = window.ROUTER_AZIONI.find(v => v.test(az));
        const senzaTiro = M.azioneSenzaTiro(az);
        if (!voce && !senzaTiro) {
            problemi.push(`"${az}" è nel vocabolario del motore ma il router non la instrada.`);
        } else if (voce && typeof window[voce.modulo] !== 'function') {
            problemi.push(`"${az}" -> modulo ${voce.modulo} NON CARICATO.`);
        }
    });
    window.ROUTER_AZIONI.forEach(function (v) {
        if (typeof window[v.modulo] !== 'function') {
            if (!problemi.some(p => p.indexOf(v.modulo) >= 0)) {
                problemi.push(`modulo ${v.modulo} ("${v.nome}") non caricato.`);
            }
        }
    });
    if (problemi.length === 0) {
        return [dallaPagina
            ? `router coerente col motore, e tutti i moduli sono fra gli script della pagina (${dallaPagina.length} file).`
            : 'router coerente col motore (lista della pagina non verificata).'];
    }
    return problemi;
};

// --- UN TOKEN PIAZZATO CHE LASCIA IL TAVOLO ---
// window.rimuoviTokenPiazzato(id, evento) -> { rimosso, motivo, inviato? }
// Chiede al motore se la regola lo toglie (M.tokenDaRimuovere); se si`, lo
// toglie da window.tokenPiazzati e rimanda lo schieramento come
// AGGIORNAMENTO — il mittente salva prima la copia locale, quindi il token
// sparisce anche dalla ripresa. Eventi: 'INNESCO', 'DISTRUTTO', 'MANUALE',
// 'DEACTIVATOR', 'FASE_STATI'. La regola e` del motore, l'array
// dell'interfaccia: questa funzione sta in mezzo. (26 settembre.)
window.rimuoviTokenPiazzato = function (id, evento) {
    const M = window.MotoreN5;
    // Si cerca nel ROSTER, dove stanno i token (piazzati in schieramento o in
    // partita), e per compatibilita` in tokenPiazzati. Solo un Deployable si
    // toglie cosi`: una truppa con lo stesso id no.
    const liste = [window.roster || [], window.tokenPiazzati || []];
    let lista = null, i = -1;
    for (const l of liste) { i = l.findIndex(t => t && t.id === id); if (i >= 0) { lista = l; break; } }
    if (!lista) return { rimosso: false, motivo: 'Token non trovato sul tavolo.' };
    if (!lista[i].deployable) return { rimosso: false, motivo: 'Non e` un Deployable: le truppe non si tolgono da qui.' };
    const r = M.tokenDaRimuovere(lista[i], evento);
    if (!r.rimuovi) return { rimosso: false, motivo: r.motivo, nonSo: r.rimuovi === null };
    const togliDa = function (l) { const k = l.findIndex(t => t && t.id === id); if (k >= 0) l.splice(k, 1); };
    liste.forEach(togliDa);   // da entrambe: un doppione non deve sopravvivere
    const esito = window.inviaSchieramentoAllHub(document.title.includes('NOMADS') ? 'NOMADI' : 'PANOCEANIA', {
        roster: window.roster, strutture: window.activeStructures || [],
        terreni: window.activeTerrains || [], motivo: 'AGGIORNAMENTO'
    });
    return { rimosso: true, motivo: r.motivo, inviato: !!(esito && esito.inviato) };
};

// --- RIPRESA DELLA PARTITA ---
// Da chiamare DOPO window.cloudPronto (confermato), quando la pagina si riapre
// su una partita in corso. Mette schieramentoCompletato a true e applica il
// turno che c'e` sul cloud, come un cambio turno ma SENZA cancellare l'allarme
// ARO. Restituisce cosa ha trovato, anche un ordine rimasto a meta`: per ora
// solo LEGGIBILE, il recupero non fa parte di questo. (Chat INTERFACCIA.)
//   { ripresa: true|false, motivo?, turno, ordineAMeta: { nomeCanale: valore } }
window.riprendiDaStato = function () {
    const C = window.MotoreN5.CANALI;
    const turno = localStorage.getItem(C.HUB_TURNO);
    if (!turno) return { ripresa: false, motivo: 'Sul cloud non c\'e` un turno: nessuna partita da riprendere.' };
    const ordineAMeta = {};
    [C.HUB_CALCOLO, C.COMUNICAZIONE, C.ARO_NOMADI, C.ARO_PANOCEANIA, C.HUB_SBLOCCO, C.ALLARME_ATTACCO].forEach(function (k) {
        const v = localStorage.getItem(k);
        if (v !== null && v !== '') ordineAMeta[k] = v;
    });
    window.schieramentoCompletato = true;
    window.applicaCambioTurno(turno, { ripresa: true });
    let t = turno; try { t = JSON.parse(turno); } catch (e) {}
    return { ripresa: true, turno: t, ordineAMeta: ordineAMeta };
};

// --- 5. ASCOLTATORI GLOBALI (Event Listeners) ---

window.addEventListener('storage', (event) => {
    if (event.key === window.MotoreN5.CANALI.HUB_TURNO) {
        window.applicaCambioTurno(event.newValue);
    }

    if (event.key === window.MotoreN5.CANALI.HUB_SBLOCCO) {
        console.log("🔓 Core: ARO ricevuti dall'avversario. Sblocco UI per seconda metà ordine.");
        let waitMsg = document.getElementById('wait-aro-msg');
        let secondHalf = document.getElementById('second-half-wrapper');
        if(waitMsg) waitMsg.style.display = 'none';
        if(secondHalf) secondHalf.style.display = 'block';
    }
});

// Ascolto Allarme ARO per il giocatore in reattivo
window.currentAttackData = null;

// 🔴 Memoria degli allarmi GIA` CONSUMATI.
// Cancellare subito la copia locale non basta: fra l'invio e il ritorno
// del null da Firebase resta una finestra in cui la chiave e` di nuovo
// presente, e il banner verrebbe rimostrato. Ogni ripetizione fa
// scrollTo(0,0) in logica_aro.js, cioe` riporta il giocatore in cima
// mentre sta leggendo. Qui si ricorda cosa e` gia` stato mostrato.
window._allarmiConsumati = window._allarmiConsumati || [];

function firmaAllarme(grezzo) {
    // Non si usa il timestamp da solo: due attacchi diversi nello stesso
    // secondo avrebbero la stessa firma. Si usa il contenuto intero.
    if (!window.MotoreN5 || typeof window.MotoreN5.impronta !== 'function') return String(grezzo);
    return window.MotoreN5.impronta(String(grezzo));
}

setInterval(() => {
    if (!window.isReactiveMode) return;

    const attacco = localStorage.getItem(window.MotoreN5.CANALI.ALLARME_ATTACCO);
    if (!attacco) return;

    const firma = firmaAllarme(attacco);
    if (window._allarmiConsumati.indexOf(firma) >= 0) {
        // Gia` mostrato: si ripulisce la copia rimasta e si tace.
        localStorage.removeItem(window.MotoreN5.CANALI.ALLARME_ATTACCO);
        return;
    }

    let dati;
    try { dati = JSON.parse(attacco); }
    catch (e) {
        console.error('⛔ Allarme ARO illeggibile, scartato:', e);
        window._allarmiConsumati.push(firma);
        localStorage.removeItem(window.MotoreN5.CANALI.ALLARME_ATTACCO);
        return;
    }

    window._allarmiConsumati.push(firma);
    // Non cresce senza fine: della coda serve solo il tratto recente.
    if (window._allarmiConsumati.length > 40) window._allarmiConsumati.splice(0, 20);

    window.currentAttackData = dati;
    localStorage.removeItem(window.MotoreN5.CANALI.ALLARME_ATTACCO);
    if (window.mostraBannerAllarme) window.mostraBannerAllarme();
}, 1000);

// Da chiamare quando il giocatore chiude il turno reattivo: il prossimo
// attacco, anche identico, deve poter rimostrare il banner.
window.azzeraAllarmiConsumati = function () {
    window._allarmiConsumati = [];
};

// Dichiarazione di versione per il controllo incrociato fra chat.
// Funziona anche se questo file si carica PRIMA del motore: in quel
// caso la versione resta in coda e il motore la raccoglie all'avvio.
(function () {
    var g = (typeof window !== 'undefined') ? window : globalThis;
    var v = { file: 'motore_core.js', versione: '2026-09-19.4', proprieta: 'MOTORE' };
    if (g.MotoreN5 && g.MotoreN5.dichiaraVersione) g.MotoreN5.dichiaraVersione(v.file, v.versione, v.proprieta);
    else { g.__versioniN5 = g.__versioniN5 || []; g.__versioniN5.push(v); }
})();
