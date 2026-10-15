// @versione 2026-09-29.1 | test_giro_ritorno.js | proprieta`: chat TEST
// ================================================================
// IL GIRO COMPLETO: app attiva -> Hub -> app reattiva -> Hub -> risoluzione.
// Proposto da INTERFACCIA il 29 settembre, ed è il percorso su cui poggia
// tutto il resto: nessun banco lo eseguiva. Ognuno di noi provava il proprio
// pezzo con un dato costruito a mano, e i due pezzi si parlavano solo nella
// nostra immaginazione — è così che l'ordineId risultava "non arriva" quando
// mancava soltanto il passaggio intermedio.
//
// Qui girano TRE contesti separati, come i tre dispositivi veri: l'app
// Nomadi, l'app PanOceania e l'Hub. Ognuno ha il suo localStorage; il
// "server" è un oggetto in mezzo che recapita le chiavi agli altri due,
// come fa Firebase. Nessuno dei tre vede la memoria degli altri.
// ================================================================
let passati = 0, falliti = 0;
const ok = (c, m) => { if (c) { passati++; console.log('  ✅ ' + m); } else { falliti++; console.log('  ❌ ' + m); } };
const J = JSON.stringify;
const vm = require('vm'), fs = require('fs');
const DIR = (process.env.CARTELLA || __dirname).replace(/\/?$/, '/');

// L'elenco dei canali si chiede al motore, una volta: scriverlo a mano qui
// vorrebbe dire tenerne una seconda copia, e un nome sbagliato farebbe
// sembrare che il messaggio non parta — si cercherebbe il difetto nel codice
// che funziona. È la stessa ragione per cui esiste M.CANALI.
global.window = global;
require(DIR + 'catalogo_n5.js'); require(DIR + 'database_comune.js');
const CANALI_VERI = require(DIR + 'motore_regole_n5.js').CANALI;

// --- il server: una mappa di chiavi, e chi ascolta ---
const server = {};
const dispositivi = [];
const transito = [];   // il registro di cosa è passato dal server, e da chi
function recapita(da, chiave, valore) {
    server[chiave] = valore;
    transito.push({ da: da.nome, chiave: chiave, vuoto: valore === null });
    dispositivi.forEach(d => { if (d !== da) d.riceve(chiave, valore); });
}
const passato = (chiave, da) => transito.some(t => t.chiave === chiave && !t.vuoto && (!da || t.da === da));

function avvia(nome, titolo, moduli) {
    const memoria = {};
    const g = { console: { log: () => {}, warn: () => {}, error: () => {} } };
    g.window = g; g.globalThis = g;
    const el = () => ({ innerHTML: '', style: {}, value: '', checked: false, appendChild(){}, addEventListener(){},
        classList: { add(){}, remove(){} }, cloneNode() { return el(); }, parentNode: { replaceChild(){}, insertBefore(){} } });
    g.document = { title: titolo, getElementById: () => el(), querySelector: () => el(), querySelectorAll: () => [],
        createElement: () => el(), addEventListener(){}, body: el(), documentElement: { setAttribute(){} } };
    g.alert = () => {}; g.confirm = () => true; g.prompt = () => null;
    // Ogni file può avere il suo ciclo: motore_core ne ha due — uno per il
    // cambio turno, uno per gli allarmi in arrivo. Tenerne uno solo vuol dire
    // eseguire metà dispositivo, e il pezzo che manca è sempre quello che
    // serve alla prova.
    g._cicli = [];
    g.setInterval = (fn) => { g._cicli.push(fn); return g._cicli.length; }; g.setTimeout = () => 0;
    g.addEventListener = (tipo, fn) => { if (tipo === 'storage') g._storage = fn; };
    g.history = { pushState(){}, replaceState(){} };
    // motore_core costruisce un evento 'storage' finto per avvisare la pagina:
    // senza Event il recapito solleva a metà strada, e il messaggio si perde
    // in un punto che non c'entra col codice in prova.
    g.Event = function (tipo) { this.type = tipo; };
    g.dispatchEvent = (ev) => { if (g._storage) g._storage(ev); };
    g.location = { search: '', replace(){} };
    // I canali NON si scrivono a mano: si leggono da M.CANALI, che è l'unica
    // lista vera. Scrivendoli qui, un nome sbagliato — "hub_calcolo" invece di
    // "canale_hub_calcolo" — fa sembrare che il messaggio non parta, e si
    // finisce a cercare il difetto nel codice che funziona.
    const CLOUD = Object.keys(CANALI_VERI).map(k => CANALI_VERI[k]);
    const dispositivo = { nome: nome, g: g, memoria: memoria };
    // Il localStorage è SOLO locale. Chi porta i canali fuori dal dispositivo
    // è motore_core, che intercetta setItem e scrive su Firebase: se il finto
    // Firebase ingoia, il messaggio non parte e sembra un difetto del codice.
    // (INTERFACCIA ci è incappata il 25 settembre, e questo banco alla prima
    // stesura pure: scriveva sul localStorage e si chiedeva perché non
    // arrivasse niente.)
    g.localStorage = {
        getItem: k => (k in memoria ? memoria[k] : null),
        setItem: (k, v) => { memoria[k] = String(v); },
        removeItem: k => { delete memoria[k]; }
    };
    const ascolti = {};
    dispositivo.riceve = (k, v) => {
        // Come il trasporto vero: il server annuncia, il cloud scrive la copia
        // locale e poi avvisa chi ascolta.
        if (ascolti[k]) ascolti[k]({ val: () => v });
        else { if (v === null) delete memoria[k]; else memoria[k] = v; if (g._storage) g._storage({ key: k, newValue: v }); }
    };
    g.firebase = { initializeApp: () => ({}), database: () => ({ ref: (k) => ({
        on: (evento, fn) => { ascolti[k] = fn; },
        set: (v) => recapita(dispositivo, k, String(v)),
        update: () => {},
        remove: () => recapita(dispositivo, k, null),
        once: () => Promise.resolve({ val: () => (k in server ? server[k] : null) })
    }) }) };
    const ctx = vm.createContext(g);
    moduli.forEach(f => vm.runInContext(fs.readFileSync(DIR + f, 'utf8'), ctx, { filename: f }));
    dispositivo.giro = () => g._cicli.forEach(fn => fn());
    dispositivi.push(dispositivo);
    return dispositivo;
}

const BASE = ['catalogo_n5.js', 'database_comune.js', 'database_nomad.js', 'database_panoceania.js', 'motore_regole_n5.js'];
const nomadi = avvia('app NOMADI', 'NOMADS', BASE.concat(['motore_core.js']));
const pano = avvia('app PANOCEANIA', 'PANOCEANIA', BASE.concat(['motore_core.js']));
// L'Hub carica anche calcolatore_cloud.js: è LUI che porta i canali fuori
// dalla pagina dell'Hub, come motore_core fa nelle due app. Senza, l'Hub
// riceve e non risponde mai — e il banco direbbe che il difetto è nel
// controller. L'ordine dei file è quello della pagina vera.
const hub = avvia('HUB', 'HUB', BASE.concat(['calcolatore_cloud.js', 'calcolatore_math.js', 'calcolatore_controller.js']));
hub.g.hubPronto = true;
// L'app che riceve l'allarme è quella reattiva: senza questo interruttore il
// suo ascoltatore ignora tutto, come nel turno in cui tocca a lei.
pano.g.isReactiveMode = true;

console.log('\n=== 1. I tre dispositivi partono separati ===');
ok(nomadi.g.MotoreN5 && pano.g.MotoreN5 && hub.g.MotoreN5, 'tre contesti, tre copie del motore');
ok(nomadi.g !== pano.g && nomadi.g.localStorage !== pano.g.localStorage,
   'e tre memorie diverse: nessuno vede quella degli altri');
nomadi.g.localStorage.setItem('prova_locale', 'x');
ok(pano.g.localStorage.getItem('prova_locale') === null,
   'una chiave che non è un canale resta sul dispositivo');

console.log('\n=== 2. L allarme fa il giro: Nomadi -> Hub -> PanOceania ===');
const C = nomadi.g.MotoreN5.CANALI;
nomadi.g.currentOrder = { id: 'ordine-1', unit: { alias: 'Alguacil' } };
nomadi.g.inviaAllarmeAro({ attaccante: 'Alguacil (Combi Rifle)', azione: 'ATTACCO BS', bersagli: [] });
ok(server[C.COMUNICAZIONE] != null, 'l app attiva scrive sul canale di comunicazione');
ok(hub.g.localStorage.getItem(C.COMUNICAZIONE) != null, 'e l Hub lo riceve');
hub.giro();                                       // un giro dei cicli dell'Hub
pano.giro();                                      // e uno dell app reattiva, che raccoglie l allarme
// Non si guarda se la chiave C'È ADESSO: l'app reattiva la consuma subito, e
// la cancellazione torna indietro fino al server. Guardare lo stato finale
// direbbe "non è mai passato" proprio perché è arrivato. Si guarda il
// TRANSITO — chi ha scritto cosa — che è la domanda vera.
ok(passato(C.ALLARME_ATTACCO, 'HUB'), 'l Hub lo inoltra come allarme d attacco');
// L'app reattiva non si limita a riceverlo: lo CONSUMA — lo legge, lo mette
// in currentAttackData e libera il canale, perché un allarme già visto non
// deve tornare. Quindi si guarda quello che il giocatore ha davanti, non la
// chiave: cercare la chiave darebbe "non arrivato" proprio quando è arrivato.
ok(pano.g.currentAttackData != null,
   'e arriva all app reattiva, che lo consuma: il giro completo, senza che nessuno l abbia costruito a mano');
ok(server[C.COMUNICAZIONE] == null, 'il canale di comunicazione viene liberato dall Hub');

console.log('\n=== 3. L ordineId sopravvive al viaggio ===');
// È il caso che aveva fatto dire "non arriva": il campo esiste da una parte,
// viene letto dall'altra, e il pezzo in mezzo non lo portava. Qui il pezzo
// in mezzo c'è.
const arrivato = pano.g.currentAttackData;
ok(arrivato.ordineId === 'ordine-1', `l identificativo dell Ordine arriva intero: ${arrivato.ordineId}`);
ok(arrivato.attaccante === 'Alguacil (Combi Rifle)', 'e con lui il nome di chi attacca');
ok(typeof arrivato.timestamp_allarme === 'number', 'l Hub ci aggiunge il momento in cui è passato');

console.log('\n=== 4. La seconda metà porta lo STESSO identificativo ===');
nomadi.g.inviaAllarmeAro({ attaccante: 'Alguacil (Combi Rifle)', azione: 'ATTACCO BS', bersagli: [] });
hub.giro(); pano.giro();
ok(pano.g.currentAttackData.ordineId === 'ordine-1', 'stesso Ordine, stesso identificativo');
nomadi.g.currentOrder = { id: 'ordine-2', unit: { alias: 'Alguacil' } };
nomadi.g.inviaAllarmeAro({ attaccante: 'Alguacil (Combi Rifle)', azione: 'ATTACCO BS', bersagli: [] });
hub.giro(); pano.giro();
ok(pano.g.currentAttackData.ordineId === 'ordine-2', 'Ordine nuovo, identificativo nuovo');
// Controprova: senza questa coppia, un ordineId sempre uguale — o sempre
// nullo, com'era fino al 28 settembre — passerebbe la prova di sopra.

console.log('\n=== 5. La reazione torna indietro: PanOceania -> Hub ===');
pano.g.localStorage.setItem(C.ARO_PANOCEANIA, J({ reazioni: [
    { nome: 'Fusilier (Combi Rifle)', azione: 'BS_ATTACK', arma: 'Combi Rifle', bersaglio: 'Alguacil (Combi Rifle)' }] }));
ok(hub.g.localStorage.getItem(C.ARO_PANOCEANIA) != null, 'la reazione arriva all Hub');
hub.giro();
ok(hub.g.latestAroData && hub.g.latestAroData.length === 1,
   `l Hub la registra (${hub.g.latestAroData && hub.g.latestAroData.length} reazione)`);
ok(server[C.HUB_SBLOCCO] != null, 'e sblocca l attiva, che stava aspettando');
ok(nomadi.g.localStorage.getItem(C.HUB_SBLOCCO) != null, 'lo sblocco arriva all app attiva');

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
