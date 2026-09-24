// @versione 2026-09-23.1 | motore_core.js | proprieta`: chat MOTORE
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

window.inviaSchieramentoAllHub = (payload, fazione) => {
    let canale = window.MotoreN5.canaleSetup(fazione);
    localStorage.setItem(canale, JSON.stringify(payload));
    console.log(`📡 Core: Dati di schieramento ${fazione} inviati all'Hub.`);
};

window.inviaAllarmeAro = (payload) => {
    localStorage.setItem(window.MotoreN5.CANALI.COMUNICAZIONE, JSON.stringify(payload));
    console.log("🚨 Core: Allarme ARO inviato all'Hub.", payload);
};

window.inviaCalcoloAllHub = (payload) => {
    localStorage.setItem(window.MotoreN5.CANALI.HUB_CALCOLO, JSON.stringify(payload));
    console.log("🎲 Core: Dati di calcolo inviati all'Hub.", payload);
};

window.inviaRispostaAro = (payload, fazione) => {
    const canale = fazione === "NOMADI" ? "canale_aro_nomadi" : "canale_aro_panoceania";
    localStorage.setItem(canale, JSON.stringify(payload));
    console.log(`🛡️ Core: Risposta ARO (${fazione}) inviata all'Hub.`);
};


// --- 3. GESTIONE TURNI E FASI ---
window.isReactiveMode = false;

window.applicaCambioTurno = (valoreRicevuto) => {
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
        localStorage.removeItem(window.MotoreN5.CANALI.ALLARME_ATTACCO);

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
