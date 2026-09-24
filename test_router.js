// @versione 2026-09-23.1 | test_router.js | proprieta`: chat TEST
// Test del router — node test_router.js
global.window = global;
require('./catalogo_n5.js'); require('./database_comune.js');
const M = require('./motore_regole_n5.js');

let passati = 0, falliti = 0;
function ok(c, n, e) { if (c) { passati++; console.log(`  ✅ ${n}`); } else { falliti++; console.log(`  ❌ ${n}${e ? '\n       ' + e : ''}`); } }

// Il Core carica Firebase: si estrae il solo router.
const src = require('fs').readFileSync('./motore_core.js', 'utf8');
const soloRouter = src.slice(src.indexOf('window.ROUTER_AZIONI'), src.indexOf('// --- 5.'));
let alertUltimo = null; global.alert = (m) => { alertUltimo = m; };
let erroreUltimo = null;
const errOrig = console.error; console.error = (m) => { erroreUltimo = m; };
eval(soloRouter);
console.error = errOrig;

// Il modulo Scoprire esiste davvero: si carica, così verificaRouter dà
// la diagnosi vera invece di segnalarlo come mancante.
require('./ordine_scoprire.js');
require('./ordine_supporto.js');
require('./ordine_trincerarsi.js');
require('./ordine_osservazione.js');
require('./ordine_logistica.js');
const scoprireVero = window.avviaFaseScoprire;

// moduli finti: registrano chi è stato chiamato
let chiamato = null;
['avviaFaseAttaccoBS', 'avviaFaseIntuitivo', 'avviaFaseCC', 'avviaFaseHacking',
 'avviaFaseSpeculativo', 'avviaFaseGuidato', 'avviaFaseDifesa', 'avviaFaseMovimento'
].forEach(function (f) { global[f] = (a, s) => { chiamato = { modulo: f, azione: a, secondaMeta: s }; }; });
global.avviaFaseScoprire = (a, s) => { chiamato = { modulo: 'avviaFaseScoprire', azione: a, secondaMeta: s }; };
global.avviaFaseSupporto = (a, s) => { chiamato = { modulo: 'avviaFaseSupporto', azione: a, secondaMeta: s }; };

function via(azione, secondaMeta) {
    chiamato = null; alertUltimo = null; erroreUltimo = null;
    console.error = () => {};
    window.selectAction(azione, secondaMeta || false);
    console.error = errOrig;
    return chiamato;
}

console.log('\n=== 1. IL BUG: l Attacco Intuitivo apriva il MOVIMENTO ===');
const int = via('ATTACCO INTUITIVO');
ok(int && int.modulo === 'avviaFaseIntuitivo',
   `ATTACCO INTUITIVO -> modulo Intuitivo (era ${int ? 'avviaFaseMovimento' : 'niente'})`);
ok(int.azione === 'ATTACCO INTUITIVO', 'e l azione arriva intera al modulo');
ok(via('ATTACCO INTUITIVO', true).secondaMeta === true, 'la seconda metà viene passata');

console.log('\n=== 2. Le altre azioni restano instradate ===');
[['ATTACCO BS', 'avviaFaseAttaccoBS'], ['SCOPRIRE', 'avviaFaseScoprire'], ['MEDICO_INGEGNERE', 'avviaFaseSupporto'], ['ATTACCO CC', 'avviaFaseCC'],
 ['BERSERK', 'avviaFaseCC'], ['PROTHEION', 'avviaFaseCC'],
 ['HACKING', 'avviaFaseHacking'], ['FUOCO SPECULATIVO', 'avviaFaseSpeculativo'],
 ['ATTACCO GUIDATO', 'avviaFaseGuidato'], ['SCHIVATA', 'avviaFaseDifesa'],
 ['RESET', 'avviaFaseDifesa'], ['MOVIMENTO', 'avviaFaseMovimento']
].forEach(function (c) {
    const r = via(c[0]);
    ok(r && r.modulo === c[1], `${c[0]} -> ${c[1]}`);
});
ok(via('CC_ATTACK').modulo === 'avviaFaseCC',
   'anche la forma canonica del motore, CC_ATTACK, è instradata');

console.log('\n=== 3. Le abilità senza tiro vanno al movimento ===');
['MOVIMENTO', 'CAUTO', 'SALTO', 'ARRAMPICARSI', 'IDLE', 'RICARICARE'].forEach(function (a) {
    const r = via(a);
    ok(r && r.modulo === 'avviaFaseMovimento', `${a} -> movimento`);
});

console.log('\n=== 4. L ELSE FINALE non inghiotte più tutto ===');
const ignota = via('ATTACCO LASER');
ok(ignota === null, 'un azione sconosciuta NON diventa un movimento in silenzio');
ok(alertUltimo && /non riconosciut/i.test(alertUltimo), 'e viene detto al giocatore');
const refuso = via('ATACCO BS');
ok(refuso === null, 'nemmeno un refuso passa per movimento');

console.log('\n=== 5. Modulo dichiarato ma non caricato ===');
delete global.avviaFaseIntuitivo;
const senzaModulo = via('ATTACCO INTUITIVO');
ok(senzaModulo === null && alertUltimo && /non è caricato/i.test(alertUltimo),
   'se il modulo manca si dice, non si ripiega sul movimento');
global.avviaFaseIntuitivo = (a, s) => { chiamato = { modulo: 'avviaFaseIntuitivo', azione: a, secondaMeta: s }; };

console.log('\n=== 6. Il router si controlla da solo ===');
const problemi = window.verificaRouter();
ok(Array.isArray(problemi), 'verificaRouter risponde');
console.log('   ' + problemi.join('\n   '));
ok(!problemi.some(p => /avviaFaseScoprire/.test(p)),
   'Scoprire non è più fra i mancanti: il modulo ora esiste');
ok(!problemi.some(p => /avviaFaseSupporto/.test(p)),
   'nemmeno il Supporto: TUTTI i moduli del router ora esistono');
// Restano due voci, entrambe corrette:
//  - avviaSoppressione sta dentro ordine_difesa.js, non è un modulo a sé
//  - avviaFaseScenografia è il modulo ancora DA SCRIVERE per le due azioni
//    sulla scenografia, che il router instrada già
// I residui sono solo moduli non caricati in QUESTO test, più quelli
// ancora da scrivere. Nessuna azione deve restare senza percorso.
ok(problemi.every(p => /avviaSoppressione|avviaFaseScenografia|avviaFaseDeployable|avviaFaseTrincerarsi|avviaFaseOsservazione|avviaFaseLogistica|Lista degli script/.test(p)),
   'i residui sono solo quelli noti', problemi.join(' | '));
ok(problemi.some(p => /avviaFaseDeployable/.test(p)),
   'e il router dice che il modulo deployable manca ancora: arriva con la passata 3');

console.log('\n=== 7. Nessuna azione del motore resta senza percorso ===');
const orfane = Object.values(M.AZIONI).filter(function (az) {
    const voce = window.ROUTER_AZIONI.find(v => v.test(az));
    return !voce && !M.azioneSenzaTiro(az);
});
console.log('   senza percorso: ' + (orfane.join(', ') || '(nessuna)'));
ok(orfane.length === 0,
   'ogni azione del vocabolario ha un percorso: il router e il motore combaciano',
   orfane.join(', '));

console.log('\n=== 8. L Attacco a Sorpresa non è un Ordine ===');
ok(M.AZIONI.SORPRESA === undefined,
   'tolto dal vocabolario: in N5 è un MOD, non un\'azione dichiarabile');
const nn = { alias: 'N', bs: 12, ph: 11, skills: '', states: {} };
const conSorpresa = M.modReazione(nn, { azione: 'DODGE' },
    { attaccoASorpresa: true, attacco: { attaccante: nn } });
ok(conSorpresa.valore === 8, 'ma il -3 in reazione continua ad applicarsi (PH 11 -> 8)');

console.log('\n=== 9. Un modulo che esplode NON pianta la partita ===');
// Il motore solleva di proposito sugli errori di programmazione. Al tavolo
// un'eccezione non catturata blocca la schermata a metà dichiarazione:
// protegge chi scrive il codice e ferma chi sta giocando.
global.avviaFaseAttaccoBS = function () { throw new Error('guasto simulato'); };
let esploso = false, avvisato = null;
const alertPrec = global.alert;
global.alert = function (m) { avvisato = m; };
const errPrec = console.error; console.error = function () {};
try { window.selectAction('ATTACCO BS', false); } catch (e) { esploso = true; }
console.error = errPrec; global.alert = alertPrec;

ok(!esploso, 'l eccezione non esce dal router: l app resta viva');
ok(avvisato && /NON è stato eseguito/.test(avvisato),
   'e il giocatore sa che l ordine non è passato');
ok(avvisato && /guasto simulato/.test(avvisato), 'col dettaglio, per capire cosa è successo');
ok(window.ultimaEccezione && window.ultimaEccezione.modulo === 'avviaFaseAttaccoBS',
   'e resta registrata in window.ultimaEccezione per chi dovrà indagare');

// ripristino
global.avviaFaseAttaccoBS = (a, s) => { chiamato = { modulo: 'avviaFaseAttaccoBS', azione: a, secondaMeta: s }; };
ok(via('ATTACCO BS').modulo === 'avviaFaseAttaccoBS', 'e dopo il guasto il router funziona ancora');

console.log('\n=== 10. esitoOppure non solleva mai ===');
ok(M.esitoOppure({ qualcosa: 1 }, false) === false,
   'su un oggetto senza campo di giudizio restituisce il valore indicato');
ok(M.esitoOppure(undefined, true) === true, 'e anche su undefined');
ok(M.esitoOppure(M.puoRicevereOrdine({ alias: 'X', states: {} }), false) === true,
   'ma quando il campo c è legge quello, non il predefinito');

console.log('\n=== 11. 🔴 verificaRouter legge anche la PAGINA ===');
// Rispondeva solo su ciò che era caricato in memoria, e in Node quello lo
// decide chi verifica: una domanda di cui si conosce già la risposta.
// Tre moduli scritti e instradati non erano fra gli <script src> di
// app.html, e per sei ordini l app dava "Azione non riconosciuta" mentre
// il controllo diceva "router coerente".
const fsR = require('fs');
const listaApp = (fsR.readFileSync('./app.html', 'utf8').match(/src="[^"]*\.js[^"]*"/g) || [])
    .map(x => x.replace(/src="|"/g, '').split('?')[0].split('/').pop())
    .filter(f => !/^firebase/.test(f));

// questo file non ha un DOM: se ne costruisce uno minimo per la prova
if (typeof global.document === 'undefined') global.document = {};
ok(typeof window.moduliDellaPagina === 'function', 'moduliDellaPagina esiste');

// caso 1: la pagina vera. Serve che TUTTI i moduli siano anche in memoria,
// altrimenti si misurerebbe la lacuna del test invece di quella della pagina.
['avviaFaseScenografia', 'avviaFaseDeployable', 'avviaFaseTrincerarsi',
 'avviaFaseOsservazione', 'avviaFaseLogistica', 'avviaSoppressione'
].forEach(function (f) { if (typeof global[f] !== 'function') global[f] = () => {}; });
global.document.scripts = listaApp.map(f => ({ src: '/' + f }));
const conPagina = window.verificaRouter();
ok(conPagina.length === 1 && /script della pagina/.test(conPagina[0]),
   'con app.html vera e tutti i moduli in memoria: coerente, citando la pagina',
   conPagina.join(' | '));

// caso 2: un modulo tolto dalla pagina — DEVE diventare rosso
global.document.scripts = listaApp.filter(f => f !== 'ordine_osservazione.js').map(f => ({ src: '/' + f }));
const senzaUno = window.verificaRouter();
ok(senzaUno.some(p => /ordine_osservazione\.js/.test(p) && /NON è fra gli/.test(p)),
   'togliendolo dalla pagina: segnalato, anche se la funzione è in memoria');

// caso 3: nessuna lista — NON deve dire "coerente" e basta
delete global.document.scripts;
const senzaLista = window.verificaRouter();
ok(senzaLista.some(p => /non disponibile|non verificata/.test(p)),
   'senza la lista della pagina lo DICHIARA, invece di dare per verificato ciò che non lo è');

// e la pagina vera contiene tutti i moduli
global.document.scripts = listaApp.map(f => ({ src: '/' + f }));
['ordine_osservazione.js', 'ordine_logistica.js', 'ordine_trincerarsi.js',
 'ordine_piazzamento.js', 'ordine_scenografia.js'].forEach(function (f) {
    ok(listaApp.indexOf(f) >= 0, `app.html carica ${f}`);
});

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
