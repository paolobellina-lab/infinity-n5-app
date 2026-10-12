// @versione 2026-09-25.1 | test_allarme.js | proprieta`: chat TEST
// ================================================================
// La prima lettura dal cloud e la ripresa di una partita.
// Motore 2026-09-25.1: M.creaAttesaCloud dà le tre funzioni che l'app e
// l'Hub espongono con gli stessi nomi — cloudPronto, riprovaCloud,
// statoCloud — e motore_core dà window.riprendiDaStato.
//
// Il test sulla scadenza ASPETTA davvero: MOTORE ha tolto un unref() sul
// timer, che in Node faceva uscire il processo prima della scadenza e
// chiudeva il test senza asserire niente — un verde falso.
// ================================================================
let passati = 0, falliti = 0;
const ok = (c, m) => { if (c) { passati++; console.log('  ✅ ' + m); } else { falliti++; console.log('  ❌ ' + m); } };
const J = JSON.stringify;

global.window = global;
require('./catalogo_n5.js'); require('./database_comune.js');
const M = require('./motore_regole_n5.js');

(async () => {
console.log('\n=== 1. Confermato quando tutti i canali hanno risposto ===');
const canali = ['uno', 'due', 'tre'];
const a = M.creaAttesaCloud(canali, { tempoMassimo: 2000 });
ok(a.stato().confermato === false && a.stato().mancanti.length === 3, 'appena creato: nessun canale ricevuto');
a.segna('uno'); a.segna('due');
ok(a.stato().ricevuti === 2 && J(a.stato().mancanti) === J(['tre']), 'due su tre: il mancante è nominato');
a.segna('tre');
const esito = await a.pronto;
ok(esito.confermato === true && esito.mancanti.length === 0, `confermato, ${esito.ricevuti} canali in ${esito.ms} ms`);
ok(typeof esito.ms === 'number', 'e dice quanto ha aspettato');

console.log('\n=== 2. Un canale che risponde null è comunque arrivato ===');
// "Arrivato" vuol dire copia locale PRONTA, non valore diverso da null: un
// canale vuoto sul cloud è una risposta, e aspettarlo per sempre sarebbe
// il difetto.
const b = M.creaAttesaCloud(['vuoto'], { tempoMassimo: 2000 });
b.segna('vuoto');
const eb = await b.pronto;
ok(eb.confermato === true, 'canale segnato con valore nullo: confermato lo stesso');

console.log('\n=== 3. Scadenza: non si rifiuta mai, e dice chi manca ===');
const inizio = Date.now();
const c = M.creaAttesaCloud(['c1', 'c2'], { tempoMassimo: 120 });
c.segna('c1');
let rifiutata = false;
const ec = await c.pronto.catch(() => { rifiutata = true; return null; });
ok(!rifiutata, 'la Promise non si rifiuta mai');
ok(ec && ec.confermato === false && J(ec.mancanti) === J(['c2']), `scaduta: manca c2 (${J(ec && ec.mancanti)})`);
ok(ec.motivo === 'tempo scaduto', `col motivo (${ec.motivo})`);
ok(Date.now() - inizio >= 110, `e ha aspettato davvero (${Date.now() - inizio} ms, non un'uscita anticipata)`);

console.log('\n=== 4. La riprova si chiude appena arriva l ultimo ===');
const d = M.creaAttesaCloud(['x', 'y'], { tempoMassimo: 100 });
await d.pronto;                       // scade: y non è mai arrivato
ok(d.stato().confermato === false, 'dopo la scadenza lo stato resta non confermato');
const seconda = d.riprova({ tempoMassimo: 3000 });
d.segna('x'); d.segna('y');
const ed = await seconda;
ok(ed.confermato === true, 'la riprova si chiude appena arrivano i valori, senza aspettare la scadenza');
ok(ed.ms < 3000, `e non ha aspettato i 3 secondi (${ed.ms} ms)`);
// Controprova: una riprova senza nuovi valori scade come la prima.
const e2 = M.creaAttesaCloud(['z'], { tempoMassimo: 80 });
const terza = await e2.riprova({ tempoMassimo: 80 });
ok(terza.confermato === false && J(terza.mancanti) === J(['z']), 'controprova: senza valori, la riprova scade');


console.log('\n=== 5. Riprendere una partita senza cancellare l ordine a metà ===');
// motore_core: nel ramo del REATTIVO applicaCambioTurno toglie l'allarme ARO,
// e col localStorage intercettato lo toglie anche da Firebase — per ENTRAMBI.
// riprendiDaStato applica il turno del cloud SENZA quella cancellazione.
const memoria = {};
global.localStorage = { getItem: k => (k in memoria ? memoria[k] : null),
    setItem: (k, v) => { memoria[k] = String(v); }, removeItem: k => { delete memoria[k]; } };
global.document = { title: 'NOMADS', getElementById: () => ({ style: {}, innerHTML: '', appendChild(){}, addEventListener(){} }),
    querySelectorAll: () => [], createElement: () => ({ style: {} }), addEventListener(){}, body: { appendChild(){} } };
global.alert = () => {}; global.setInterval = () => 0;
global.addEventListener = () => {};   // motore_core registra gli ascoltatori globali
global.firebase = { initializeApp: () => ({}), database: () => ({ ref: () => ({ on(){}, set(){}, update(){}, remove(){},
    once: () => Promise.resolve({ val: () => null }) }) }) };
let coreCaricato = true;
try { require('./motore_core.js'); } catch (e) { coreCaricato = false; ok(false, 'motore_core non si carica: ' + e.message); }
ok(coreCaricato && typeof window.riprendiDaStato === 'function', 'motore_core espone riprendiDaStato');
const C = M.CANALI;
const prepara = () => { Object.keys(memoria).forEach(k => delete memoria[k]);
    // `attivo` è la chiave che applicaCambioTurno legge; PANOCEANIA significa
    // che questa app (NOMADS) è la reattiva — il ramo in cui l'allarme si
    // cancellerebbe.
    memoria[C.HUB_TURNO] = J({ attivo: 'PANOCEANIA', turno: 2 });
    memoria[C.ARO_NOMADI] = J({ stato: 'ARO_PENDING' });
    // È ALLARME_ATTACCO il canale che il cambio turno cancella (motore_core,
    // riga 140): con il localStorage intercettato la cancellazione arriva a
    // Firebase e quindi anche all'altro giocatore.
    memoria[C.ALLARME_ATTACCO] = J({ attaccante: 'Alguacil' }); };

prepara();
const r = window.riprendiDaStato();
ok(r.ripresa === true, `ripresa: ${r.ripresa}`);
ok(r.turno && r.turno.attivo === 'PANOCEANIA', `col turno del cloud (${J(r.turno)})`);
ok(r.ordineAMeta && r.ordineAMeta[C.ARO_NOMADI], 'e l ordine a metà è restituito, non perso');
ok(memoria[C.ALLARME_ATTACCO] != null, 'l allarme d attacco è ANCORA sul cloud dopo la ripresa');
ok(r.ordineAMeta[C.ALLARME_ATTACCO] && r.ordineAMeta[C.ARO_NOMADI],
   `e l ordine a metà li elenca entrambi (${Object.keys(r.ordineAMeta).length} canali)`);

// Controprova: il cambio turno normale lo toglie. Senza, il "resta" sopra
// non distinguerebbe la ripresa da un percorso che non cancella mai.
prepara();
window.applicaCambioTurno(memoria[C.HUB_TURNO]);
ok(memoria[C.ALLARME_ATTACCO] == null, 'controprova: il cambio turno normale toglie l allarme d attacco');

// E senza turno sul cloud non si inventa una partita.
Object.keys(memoria).forEach(k => delete memoria[k]);
const vuoto = window.riprendiDaStato();
ok(vuoto.ripresa === false && /turno/i.test(vuoto.motivo || ''), `senza turno: ripresa false, col motivo (${vuoto.motivo})`);

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
})();
