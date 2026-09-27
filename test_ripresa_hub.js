// @versione 2026-09-26.1 | test_ripresa_hub.js | proprieta`: chat TEST
// ================================================================
// L'Hub che riapre a metà partita. La trappola che questo banco chiude:
// il primo broadcastState a stato vuoto cancellava la partita su Firebase
// PER ENTRAMBI, e bastava riaprire la pagina. Ora finché cloudPronto non si
// risolve hubPronto resta falso e broadcastState rifiuta di trasmettere.
//
// Il TRASPORTO È QUELLO VERO: si carica calcolatore_cloud.js con un Firebase
// finto che consegna i canali quando diciamo noi (suggerimento di MOTORE).
// Così cloudPronto si prova com'è, non come lo simuliamo — lo stesso motivo
// per cui il banco delle pagine usa un processo per pagina.
// L'ordine conta: firebase finto, poi il cloud, poi il controller. Sostituire
// cloudPronto DOPO il caricamento non serve a niente, perché il controller lo
// aspetta appena parte: è il falso rosso in cui è incappata INTERFACCIA.
// ================================================================
let passati = 0, falliti = 0;
const ok = (c, m) => { if (c) { passati++; console.log('  ✅ ' + m); } else { falliti++; console.log('  ❌ ' + m); } };
const J = JSON.stringify;
const attendi = (ms) => new Promise(r => setTimeout(r, ms));

// Un Hub finto, ricostruito da zero a ogni caso: il controller si carica una
// volta sola per processo, quindi ogni caso gira in un modulo pulito.
function apriHub(opzioni) {
    opzioni = opzioni || {};
    const sulCloud = Object.assign({}, opzioni.cloud || {});   // quello che il server ha
    const locale = {};                                          // la copia sul dispositivo
    const scritte = [];                                         // cosa l'Hub manda al server
    const ascolti = {};
    window.hubPronto = false; window.gameState = undefined;
    global.localStorage = {
        getItem: k => (k in locale ? locale[k] : null),
        setItem: (k, v) => { locale[k] = String(v); },
        removeItem: k => { delete locale[k]; }
    };
    const el = () => ({ innerHTML: '', style: {}, value: '', appendChild(){}, addEventListener(){}, classList: { add(){}, remove(){} } });
    global.document = { title: 'HUB', getElementById: () => el(), querySelector: () => el(),
        querySelectorAll: () => [], createElement: () => el(), addEventListener(){}, body: el() };
    global.alert = () => {}; global.confirm = () => opzioni.conferma !== false;
    global.setInterval = () => 0; global.addEventListener = () => {}; global.dispatchEvent = () => {};
    global.Event = function (t) { this.type = t; };
    // Firebase finto: registra gli ascoltatori e annota le scritture.
    global.firebase = { initializeApp: () => ({}), database: () => ({ ref: (k) => ({
        on: (evento, f) => { ascolti[k] = f; },
        set: (v) => { scritte.push(k); sulCloud[k] = String(v); },
        update: () => {}, remove: () => { scritte.push('-' + k); delete sulCloud[k]; },
        once: () => Promise.resolve({ val: () => sulCloud[k] || null }) }) }) };
    delete require.cache[require.resolve('./calcolatore_cloud.js')];
    delete require.cache[require.resolve('./calcolatore_math.js')];
    delete require.cache[require.resolve('./calcolatore_controller.js')];
    require('./calcolatore_cloud.js');
    require('./calcolatore_math.js');
    require('./calcolatore_controller.js');
    // consegna(canali): il server risponde per quei canali. Con tutti e 11 la
    // prima lettura si conclude e cloudPronto si risolve.
    const consegna = (elenco) => (elenco || Object.keys(ascolti)).forEach(k => {
        if (ascolti[k]) ascolti[k]({ val: () => (k in sulCloud ? sulCloud[k] : null) });
    });
    return { sulCloud, locale, scritte, ascolti, consegna };
}

global.window = global;
for (const f of ['catalogo_n5', 'database_comune', 'database_nomad', 'database_panoceania', 'motore_regole_n5']) require('./' + f + '.js');

const CANALE = 'global_game_state';
const partita = (ferite) => J({
    nomads: [{ id: 'n1', alias: 'Alguacil', states: { wounds: ferite || 0 } }],
    panoceania: [{ id: 'p1', alias: 'Fusilier', states: {} }],
    activeFaction: 'PANOCEANIA',
    scenario: { nomads: { strutture: [], terreni: [] }, panoceania: { strutture: [], terreni: [] } }
});

(async () => {
console.log('\n=== 1. Prima che il server risponda, l Hub non trasmette ===');
let h = apriHub({ cloud: { [CANALE]: partita(1) } });
await attendi(20);
ok(window.hubPronto === false, 'finché la prima lettura non è conclusa, hubPronto è falso');
ok(typeof window.cloudPronto.then === 'function', 'e cloudPronto è la Promise del trasporto vero');
h.scritte.length = 0;
window.broadcastState();
ok(h.scritte.length === 0, `broadcastState non scrive niente sul server (${J(h.scritte)})`);
ok(h.sulCloud[CANALE] === partita(1), 'e la partita sul server è intatta: non sovrascritta a vuoto');

console.log('\n=== 2. Il server risponde: la partita si riprende da sola ===');
h.consegna();                       // tutti e 11 i canali rispondono
await attendi(30);
ok(window.hubPronto === true, 'hubPronto diventa vero');
ok(window.gameState && window.gameState.nomads.length === 1 && window.gameState.panoceania.length === 1,
   'il roster di ENTRAMBE le fazioni è tornato');
ok(window.gameState.activeFaction === 'PANOCEANIA', `con la fazione attiva del server (${window.gameState.activeFaction})`);
ok(window.gameState.nomads[0].states.wounds === 1, 'e la ferita, che l Hub non ricalcola mai: la copia');
h.scritte.length = 0;
window.broadcastState();
ok(h.scritte.includes(CANALE), `ora invece trasmette (${J(h.scritte)})`);

console.log('\n=== 3. Un canale che non risponde: avvisa, non parte ===');
h = apriHub({ cloud: { [CANALE]: partita(2) } });
const tutti = Object.keys(h.ascolti);
h.consegna(tutti.slice(0, tutti.length - 1));      // ne manca uno solo
await attendi(30);
ok(tutti.length > 5, `il trasporto ascolta ${tutti.length} canali`);
ok(window.statoCloud().confermato === false && window.statoCloud().mancanti.length === 1,
   `manca un canale e il trasporto lo nomina (${J(window.statoCloud().mancanti)})`);
ok(window.hubPronto === false, 'hubPronto resta falso per un canale solo');
h.scritte.length = 0;
window.broadcastState();
ok(h.scritte.length === 0, 'e l Hub continua a non trasmettere');
ok(h.sulCloud[CANALE] === partita(2), 'la partita sul server resta quella di prima');
// E quando arriva anche l'ultimo, si apre senza bisogno della riprova.
h.consegna();
await attendi(30);
ok(window.hubPronto === true, 'appena arriva l ultimo canale, l Hub apre');
ok(window.gameState.nomads[0].states.wounds === 2, 'con la partita giusta, non quella del caso precedente');

console.log('\n=== 4. Nessuna partita sul server: pronto lo stesso ===');
// Controprova del caso 2: se riprendesse sempre, il "riprende" sopra non
// distinguerebbe la ripresa dall apertura normale.
h = apriHub({ cloud: {} });
h.consegna();
await attendi(30);
ok(window.hubPronto === true, 'senza partita sul server l Hub apre comunque');
ok(window.riprendiPartitaHub() === false, 'e riprendiPartitaHub dice di no invece di inventare un tavolo');


console.log('\n=== 5. La busta senza tiri arriva PRIMA degli ARO ===');
// 🔴 A-03 al tavolo: Movimento Cauto, risposta "dentro". L'ordine non ha
// seconda metà, quindi il modulo manda allarme e busta nello stesso passo.
// L'Hub riceve la busta con latestAroData ancora null, stampa "NESSUN TIRO DI
// DADO DA EFFETTUARE" e CANCELLA la busta (controller riga 266). Quando poi
// arriva l'ARO, non c'è più niente da ricalcolare: il giocatore sceglie la
// reazione e non succede nulla.
// La prova segue quell'ordine, che è quello vero.
h = apriHub({ cloud: {} });
h.consegna();
await attendi(20);
window.gameState = { activeFaction: 'NOMADI',
    nomads: [{ id: 'n1', nome: 'Alguacil (Combi Rifle)', alias: 'Alguacil', bs: 11, arm: 1, states: {} }],
    panoceania: [{ id: 'p1', nome: 'Fusilier (Combi Rifle)', alias: 'Fusilier', bs: 12, arm: 1, states: {} }] };
window.latestAroData = null;
let mostrati = null;
window.mostraSchermataRisoluzione = (s) => { mostrati = s; };
// 1) la busta di un ordine senza tiri
window.gestisciBusta
    ? window.gestisciBusta({ attacchi: [], attivo: 'Alguacil (Combi Rifle)' })
    : (window.mostraSchermataRisoluzione(window.generaRisoluzioneDaDati({ attacchi: [], attivo: 'Alguacil (Combi Rifle)' })));
ok(mostrati && mostrati.length === 0, `prima dell ARO non c è niente da tirare (${mostrati && mostrati.length})`);
// 2) poi arriva l'ARO: qualcosa deve ricalcolare
window.latestAroData = [{ nome: 'Fusilier (Combi Rifle)', azione: 'BS_ATTACK', arma: 'Combi Rifle',
    rangeIndex: 1, rangeMod: 3, bersaglio: 'Alguacil (Combi Rifle)' }];
mostrati = null;
if (typeof window.ricalcolaConAro === 'function') window.ricalcolaConAro();
ok(mostrati && mostrati.length === 1,
   `quando l ARO arriva, lo scontro compare (${mostrati ? mostrati.length : 'nessun ricalcolo'})`);
ok(mostrati && mostrati[0] && (mostrati[0].attivo.mod === 15 || (mostrati[0].reattivo || {}).mod === 15),
   'e il reattivo tira a 15');

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
})();
