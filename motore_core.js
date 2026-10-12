// @versione 2026-10-09.1 | motore_core.js | proprieta`: chat MOTORE
// ==========================================
// 🧠 MOTORE CORE v2.1 - IL VIGILE URBANO & HUB CLOUD
// ==========================================

// --- 1. TRASPORTO CLOUD — uno solo per app e Hub: M.installaTrasportoCloud
// nel motore. (Prima: una copia qui e una in calcolatore_cloud.js.) ---
const trasportoCloud = window.MotoreN5.installaTrasportoCloud();
window.cloudPronto  = trasportoCloud.attesa.pronto;
window.riprovaCloud = trasportoCloud.attesa.riprova;
window.statoCloud   = trasportoCloud.attesa.stato;

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
    // L'identificativo dell'Ordine viaggia con ogni allarme: e` lo stesso per
    // le due meta` dello stesso Ordine, diverso per l'Ordine dopo. Serve al
    // reattivo per legare il RITARDO di un ARO contro un Marker all'Ordine in
    // corso (chat INTERFACCIA, 28 settembre). Prima non lo scriveva nessuno:
    // valeva sempre null. Il controller inoltra l'oggetto intero.
    if (payload && payload.ordineId == null && window.currentOrder && window.currentOrder.id) {
        payload.ordineId = window.currentOrder.id;
    }
    // 🔴 UN ALLARME PER ORDINE, CHIUNQUE LO CHIEDA. La regola c'era gia` nel
    // router (la seconda meta` non rialza l'allarme), ma chi chiamava da
    // fuori la saltava: l'Idle da requisito fallito, premuto dopo un Attacco
    // BS gia` dichiarato, mandava un SECONDO allarme e il reattivo si vedeva
    // chiedere un nuovo ARO (Paolo al tavolo, 6 ottobre). Ora sta qui, dove
    // passano tutti. Senza identificativo d'Ordine non si puo` sapere, e
    // l'allarme parte.
    if (payload && payload.ordineId != null) {
        if (window._ordineAllarmato === payload.ordineId) {
            console.log('🚨 Allarme ARO non ripetuto: questo Ordine ha gia` avvisato l\'avversario.');
            return { inviato: false, ripetuto: true };
        }
        window._ordineAllarmato = payload.ordineId;
    }
    window._codaAllarmi.push(payload);
    spedisciAllarmiInCoda();
};

// 🔴 UN ALLARME NON DEVE COPRIRE QUELLO PRIMA.
// I due tratti che un allarme percorre — app -> Hub (canale COMUNICAZIONE) e
// Hub -> reattivo (canale ALLARME_ATTACCO) — tengono UN valore ciascuno, e
// chi legge passa una volta al secondo (calcolatore_controller.js e il ciclo
// in fondo a questo file). Due allarmi dello stesso giocatore dentro quella
// finestra: il secondo copriva il primo, che andava PERSO, non in ritardo.
// MISURATO dalla chat TEST il 6 ottobre nel banco del giro: senza un giro
// dell'Hub fra MOVIMENTO e IDLE l'Hub inoltrava solo ["IDLE"].
// Qui chi SPEDISCE aspetta: un allarme parte solo quando quello prima e`
// stato consumato su TUTTI E DUE i tratti. Si vede da qui perche` ogni
// dispositivo ha la copia di tutti i canali, e chi legge un canale lo
// cancella. Con un allarme solo — il caso di sempre — non cambia niente:
// parte subito.
// Se nessuno lo consuma (reattivo spento, Hub chiuso) non si aspetta per
// sempre: dopo ATTESA_ALLARME_MS il successivo parte comunque, e lo si dice.
window._codaAllarmi = window._codaAllarmi || [];
window._allarmeInVolo = null;
const ATTESA_ALLARME_MS = 4000, PASSO_ALLARME_MS = 200;

function trattiOccupati() {
    const C = window.MotoreN5.CANALI;
    return !!(localStorage.getItem(C.COMUNICAZIONE) || localStorage.getItem(C.ALLARME_ATTACCO));
}

// L'allarme in volo e` arrivato? Lo si e` VISTO sui canali e ora non c'e`
// piu`. "Non c'e`" da solo non basta: con Firebase la copia locale arriva
// con l'eco, un attimo dopo la scrittura.
function aggiornaAllarmeInVolo() {
    const v = window._allarmeInVolo;
    if (!v) return;
    const occupati = trattiOccupati();
    if (occupati) v.visto = true;
    if (v.visto && !occupati) { window._allarmeInVolo = null; return; }
    if (Date.now() - v.quando > ATTESA_ALLARME_MS) {
        console.warn('⚠️ Core: l\'allarme precedente non risulta consumato dopo ' + ATTESA_ALLARME_MS + ' ms: il successivo parte comunque.');
        window._allarmeInVolo = null;
    }
}

function spedisciAllarmiInCoda() {
    // Un setTimeout che esegue SUBITO (i banchi ne hanno) richiamerebbe
    // questa funzione da dentro se stessa, all'infinito: se e` gia` in
    // corso si esce, il prossimo passo lo fara` chi chiama dopo.
    if (window._allarmiInGiro) return;
    window._allarmiInGiro = true;
    try { passoAllarmi(); } finally { window._allarmiInGiro = false; }
}

function passoAllarmi() {
    aggiornaAllarmeInVolo();
    if (!window._allarmeInVolo && window._codaAllarmi.length) {
        const payload = window._codaAllarmi.shift();
        localStorage.setItem(window.MotoreN5.CANALI.COMUNICAZIONE, JSON.stringify(payload));
        window._allarmeInVolo = { quando: Date.now(), visto: false };
        aggiornaAllarmeInVolo();
        console.log("🚨 Core: Allarme ARO inviato all'Hub.", payload);
    }
    // Si continua a guardare finche` c'e` qualcosa in volo o in coda.
    if ((window._allarmeInVolo || window._codaAllarmi.length) && !window._timerAllarmi) {
        window._timerAllarmi = setTimeout(function () { window._timerAllarmi = null; spedisciAllarmiInCoda(); }, PASSO_ALLARME_MS);
    }
}
window.spedisciAllarmiInCoda = spedisciAllarmiInCoda;
// Il trasporto avvisa a ogni arrivo su un canale: cosi` l'allarme in volo
// risulta VISTO anche se viene consumato prima del prossimo controllo.
if (window.MotoreN5 && Array.isArray(window.MotoreN5.ascoltatoriCanali)) {
    window.MotoreN5.ascoltatoriCanali.push(function (canale, dati) {
        const C = window.MotoreN5.CANALI;
        if (window._allarmeInVolo && dati !== null && (canale === C.COMUNICAZIONE || canale === C.ALLARME_ATTACCO)) {
            window._allarmeInVolo.visto = true;
        }
    });
}

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
    // Senza questa riga l'azione, che e` "senza tiro", cadrebbe nel modulo
    // del Movimento: la truppa "muoverebbe" e resterebbe Modello.
    { test: (a) => a === 'RIENTRARE IN CAMO',         modulo: 'avviaFaseRientroCamo', nome: 'Rientrare in CAMO' },
    // Il Cybermask e` una Long Skill senza tiro con la stessa schermata del
    // rientro (una domanda sulla LoF, poi il Marker): stesso modulo, che
    // distingue le due Abilita` dall'azione. Senza questa riga cadrebbe nel
    // Movimento, come ogni azione "senza tiro".
    { test: (a) => a === 'CYBERMASK',                 modulo: 'avviaFaseRientroCamo', nome: 'Cybermask' },
    { test: (a) => a === 'PIAZZARE EQUIPAGGIAMENTO' || a === 'PIAZZA_DEPLOYABLE',
                                                      modulo: 'avviaFaseDeployable', nome: 'Piazza Deployable' },
    { test: (a) => a === 'MEDICO_INGEGNERE' || a === 'SUPPORTO_WIP' || a === 'SUPPORTO_BS',
                                                      modulo: 'avviaFaseSupporto',   nome: 'Supporto' }
];

// SOSTITUIRE UN'UNITA` CON LA SUA VERSIONE AGGIORNATA — un posto solo.
// Il motore calcola l'unita` nuova e non tocca quella vecchia; qui la si
// applica all'oggetto dell'ordine E a quello del roster (stesso id), e si
// avvisa l'Hub. Prima lo faceva solo applicaStatoDaAbilita, in linea: ora
// lo usa anche il rientro in CAMO, e chi verra` dopo (Cybermask).
//   -> true se l'Hub e` stato avvisato
//   opzioni.senzaInvio: aggiorna il roster SENZA avvisare l'Hub. Serve in
//   schieramento, prima della conferma: li` l'avversario non deve ancora
//   vedere niente, e l'invio vero parte con la conferma. (Domanda della
//   chat INTERFACCIA, 6 ottobre.) Senza il campo si comporta come prima.
window.sostituisciUnita = function (unita, aggiornata, perche, opzioni) {
    if (!unita || !aggiornata) return false;
    const M = window.MotoreN5;
    const nelRoster = (window.roster || []).find(x => x && unita.id && x.id === unita.id);
    const prima = String(unita.deployState || 'NORMAL');
    const eraCamo = !!(M && M.statoBersaglio && M.statoBersaglio(unita).camo);
    [unita, nelRoster].filter(Boolean).forEach(x => Object.assign(x, aggiornata));
    // 🔴 9 ottobre (chat REGOLE, F07): con Camouflage (1 Use) l'uso e`
    // l'ENTRATA nello Stato CAMO, schieramento compreso. Chi ESCE dal CAMO lo
    // ha speso, comunque ci fosse entrato: un Marker schierato dal database
    // nasce in CAMO senza che nessuno chiami consumaCamo. Tutte le uscite
    // (Abilita` dichiarata, ARO, Scoperta) passano di qui.
    if (eraCamo && M && M.camoUnUso && M.camoUnUso(unita) && !M.statoBersaglio(unita).camo && !unita.camoUsato) {
        [unita, nelRoster].filter(Boolean).forEach(x => { x.camoUsato = true; });
    }
    console.log(`🎭 ${M ? M.nomeUnita(unita) : (unita.alias || unita.id)}: ${prima} -> ${unita.deployState} (${perche || 'aggiornamento'}).`);
    if (typeof window.aggiornaGraficaRoster === 'function') window.aggiornaGraficaRoster();
    if (opzioni && opzioni.senzaInvio) return false;
    if (typeof window.inviaSchieramentoAllHub === 'function') {
        window.inviaSchieramentoAllHub(document.title.includes('NOMADS') ? 'NOMADI' : 'PANOCEANIA', {
            roster: window.roster, strutture: window.activeStructures || [],
            terreni: window.activeTerrains || [], motivo: 'AGGIORNAMENTO'
        });
        return true;
    }
    return false;
};

// Cambio di stato di schieramento causato dall'Abilita` dichiarata.
//   -> { cambiato, prima, dopo, note } ; window.ultimoCambioStato per lo schermo
window.applicaStatoDaAbilita = function (unita, azione) {
    const M = window.MotoreN5;
    if (!unita || !M || typeof M.statoDopoAbilita !== 'function') return { cambiato: false };
    const deploy = String(unita.deployState || 'NORMAL').toUpperCase();
    const st = unita.states || {};
    if (deploy === 'NORMAL' && !st.camo && !st.impersonation) return { cambiato: false };
    const r = M.statoDopoAbilita(unita, azione, {});
    if (!r || !r.dopo || !r.prima) return { cambiato: false };
    // `azione` e `unita`: chi mostra window.ultimoCambioStato deve poter
    // sapere se parla di QUESTO Ordine. Resta in memoria anche dopo.
    // `ordine`: l'identificativo dell'Ordine che ha causato il cambio. Chi
    // legge non deve piu` riconoscere "quello di adesso" confrontando
    // l'oggetto. L'oggetto resta comunque NUOVO a ogni cambio, mai
    // modificato sul posto: app.html oggi lo riconosce cosi`.
    const esito = { cambiato: false, prima: r.prima.deployState, dopo: r.dopo.deployState, note: r.note || [],
                    azione: azione, unita: M.nomeUnita(unita),
                    ordine: (window.currentOrder && window.currentOrder.id) || null };
    if (r.dopo.daVerificare) { esito.note = esito.note.concat(['Cambio di stato DA VERIFICARE: non applicato, decidi al tavolo.']); window.ultimoCambioStato = esito; return esito; }
    // "E` cambiato?" si chiede a CIO` CHE IL MOTORE VEDE (M.statoBersaglio),
    // non al testo degli stati. Fino al 5 ottobre si confrontava
    // JSON.stringify(states): un Marker del database nasce con
    // deployState 'CAMO' e SENZA states, statoDopoAbilita gli scrive
    // states.camo = true, e i due testi differivano. MISURATO: ogni Marker
    // che muoveva Cauto risultava "cambiato" (CAMO -> CAMO) e partiva un
    // AGGIORNAMENTO all'Hub per niente.
    const vP = M.statoBersaglio(unita), vD = M.statoBersaglio(r.unitaAggiornata);
    if (r.dopo.deployState === r.prima.deployState &&
        vP.camo === vD.camo && vP.imp === vD.imp && vP.hidden === vD.hidden) return esito;
    esito.cambiato = true;
    window.ultimoCambioStato = esito;
    window.sostituisciUnita(unita, r.unitaAggiornata, azione);
    return esito;
};

window.selectAction = (actionId, isSecondHalf = false) => {
    window.currentOrder = window.currentOrder || {};
    const azione = String(actionId || '').trim();
    // UN ORDINE NUOVO NASCE CON LA PRIMA ABILITA`: nuovo identificativo. La
    // seconda meta` lo conserva; nell'Ordine Coordinato lo conservano anche i
    // partecipanti dopo il primo, perche` l'Ordine e` uno solo. (28 settembre.)
    if (!isSecondHalf && !(window.coordMode && window.coordIndex > 0)) {
        window.currentOrder.id = 'ordine_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 6);
        window.pulisciTokenDisattivati(window.currentOrder.id);
    }
    console.log(`🚥 Router: [${azione}]${isSecondHalf ? ' (seconda metà)' : ''}`);

    // 🔴 HIDDEN E CAMO: dichiarare un'Abilita` puo` rivelare la truppa. La
    // regola la sa M.statoDopoAbilita da giorni, ma nessun modulo la chiamava:
    // un Hidden che attaccava restava nascosto. Si applica QUI, dove passa ogni
    // ordine dichiarato; se lo stato cambia, l'Hub lo sa subito (AGGIORNAMENTO).
    // Se la regola e` ancora da verificare, lo si dice e non si cambia niente.
    window.applicaStatoDaAbilita(window.currentOrder.unit, azione);

    // FOXHOLE: chi dichiara una Skill con etichetta Movimento puo` cancellare
    // lo stato, e lo deve ANNUNCIARE alla dichiarazione (righe 13871-13874).
    // Passa di qui ogni Ordine dichiarato, quindi la domanda sta qui una
    // volta sola. La regola e i testi sono del motore e del catalogo.
    (function () {
        const M = window.MotoreN5, u = window.currentOrder.unit;
        if (!M || !M.foxholeAllaDichiarazione || !u) return;
        const fx = M.foxholeAllaDichiarazione(u, azione, {});
        if (!fx.puoCancellare) return;
        if (window.confirm(fx.domanda)) {
            const r = M.cancellaFoxhole(u);
            window.ultimoCambioStato = { cambiato: true, prima: 'FOXHOLE', dopo: 'NORMAL', note: r.note,
                                         azione: azione, unita: M.nomeUnita(u),
                                         ordine: (window.currentOrder && window.currentOrder.id) || null };
            window.sostituisciUnita(u, r.unitaAggiornata, azione);
            window.currentOrder.foxholeCancellato = true;
        } else {
            window.currentOrder.foxholeCancellato = false;
            if (fx.seNonCancella) alert('⚠️ ' + fx.seNonCancella);
        }
    })();

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
        avviaFaseRientroCamo: 'ordine_rientro_camo.js',
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
// L'Ordine in corso visto da QUESTA app: il proprio (router) o quello
// dell'avversario (dall'allarme, che porta ordineId).
window.ordineInCorso = function () {
    return (window.currentAttackData && window.currentAttackData.ordineId) ||
           (window.currentOrder && window.currentOrder.id) || null;
};
// Toglie i Deployable disattivati in un Ordine DIVERSO da quello che comincia.
window.pulisciTokenDisattivati = function (ordineNuovo) {
    const tolti = [];
    [window.roster || [], window.tokenPiazzati || []].forEach(function (l) {
        for (let k = l.length - 1; k >= 0; k--) {
            const t = l[k];
            if (t && t.deployable && t.disattivata && t.disattivata.ordineId !== ordineNuovo) { tolti.push(t.nome || t.alias); l.splice(k, 1); }
        }
    });
    if (tolti.length && typeof window.inviaSchieramentoAllHub === 'function') {
        window.inviaSchieramentoAllHub(document.title.includes('NOMADS') ? 'NOMADI' : 'PANOCEANIA', {
            roster: window.roster, strutture: window.activeStructures || [],
            terreni: window.activeTerrains || [], motivo: 'AGGIORNAMENTO'
        });
    }
    return tolti;
};

// ALLARME DI UN ORDINE: costruito da M.allarmeOrdine (motore), spedito qui.
// Per chi sta nella pagina e non in un modulo (l'Idle da requisito fallito).
window.inviaAllarmeOrdine = function (actionId, opzioni) {
    const M = window.MotoreN5; opzioni = opzioni || {};
    if (!M) return { genera: false, motivo: 'motore non caricato' };
    const e = M.allarmeOrdine(actionId, Object.assign({
        unita: window.currentOrder && window.currentOrder.unit,
        coordUnits: window.coordUnits, coordMode: window.coordMode,
        azioneSeconda: window.currentOrder && window.currentOrder.action
    }, opzioni));
    if (e.payload && typeof window.inviaAllarmeAro === 'function') window.inviaAllarmeAro(e.payload);
    return e.aro;
};

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
    // Rimozione DIFFERITA (Deactivator): la mina resta, segnata con l'Ordine in
    // corso, e si toglie quando ne comincia un altro (pulisciTokenDisattivati).
    if (r.quando === 'FINE_ORDINE') {
        lista[i].disattivata = { ordineId: window.ordineInCorso() };
        if (typeof window.salvaPartitaLocale === 'function') window.salvaPartitaLocale();
        return { rimosso: false, differito: true, motivo: r.motivo };
    }
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
    // L'allarme in volo e` stato VISTO passare: sul canale verso l'Hub (l'eco
    // della propria scrittura) o gia` inoltrato al reattivo. Serve a
    // distinguere "consumato" da "non ancora arrivato": vedi inviaAllarmeAro.
    if (window._allarmeInVolo && event.newValue != null &&
        (event.key === window.MotoreN5.CANALI.COMUNICAZIONE || event.key === window.MotoreN5.CANALI.ALLARME_ATTACCO)) {
        window._allarmeInVolo.visto = true;
    }
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
    // Un Ordine nuovo dell'avversario: via i Deployable disattivati prima.
    if (dati && dati.ordineId) window.pulisciTokenDisattivati(dati.ordineId);
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
    var v = { file: 'motore_core.js', versione: '2026-10-09.1', proprieta: 'MOTORE' };
    if (g.MotoreN5 && g.MotoreN5.dichiaraVersione) g.MotoreN5.dichiaraVersione(v.file, v.versione, v.proprieta);
    else { g.__versioniN5 = g.__versioniN5 || []; g.__versioniN5.push(v); }
})();
