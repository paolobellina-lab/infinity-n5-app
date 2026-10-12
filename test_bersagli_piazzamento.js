// @versione 2026-09-21.1 | test_bersagli_piazzamento.js | proprieta`: chat TEST
// ================================================================
// M.bersagliDaPiazzamento(arma, opzioni): i bersagli di un'arma che si piazza
// A CONTATTO, filtrati dai campi che l'arma dichiara. Oggi l'unica e` la
// D-Charges (Demolition Mode): STRUTTURA, EDIFICIO, NEMICO_IMMOBILIZZATO,
// NEMICO_NULL. Prima di questo file nessun test la chiamava.
// I nemici si leggono dal database; gli stati li imposta il test.
// La scenografia NON e` coperta qui: gli elementi nascono dallo scenario di
// partita e il test non ne conosce la forma reale — inventarla vorrebbe dire
// verificare un oggetto costruito per passare.
// ================================================================
let passati = 0, falliti = 0;
const ok = (c, m) => { if (c) { passati++; console.log('  ✅ ' + m); } else { falliti++; console.log('  ❌ ' + m); } };

global.window = global;
require('./catalogo_n5.js'); require('./database_comune.js');
require('./database_nomad.js'); require('./database_panoceania.js');
const M = require('./motore_regole_n5.js');

const fus = (stati) => Object.assign(JSON.parse(JSON.stringify(
    window.DB_PANOCEANIA.find(u => u.nome === 'Fusilier (Combi Rifle)'))), { states: stati || {} });
const dc = M.profiloArma('D-Charges (Demolition Mode)');
const esito = (u) => M.bersagliDaPiazzamento(dc, { candidati: [u] })[0];

console.log('\n=== 1. La D-Charges dichiara i suoi bersagli ===');
ok(!dc.nonTrovata && dc.risoluzione === 'CONTATTO_STRUTTURA', 'D-Charges (Demolition Mode) risolve a contatto');
const normale = esito(fus());
ok(normale.dichiarato === true, 'il filtro viene dai campi dichiarati dall\'arma');

console.log('\n=== 2. Nemici ===');
ok(normale.ammesso === false && /STRUTTURA/.test(normale.motivo || ''),
   'Fusilier in piedi: rifiutato, col motivo che elenca cosa si può colpire');
ok(esito(fus({ immobilizedA: true })).ammesso === true, 'Fusilier IMM-A: ammesso (NEMICO_IMMOBILIZZATO)');
ok(esito(fus({ immobilizedB: true })).ammesso === true, 'Fusilier IMM-B: ammesso (NEMICO_IMMOBILIZZATO)');
ok(esito(fus({ unconscious: true })).ammesso === true, 'Fusilier Incosciente: ammesso (NEMICO_NULL)');
// Controprova: uno stato che non e` ne` Immobilizzato ne` Null non apre la porta.
ok(esito(fus({ targeted: true, suppressive: true })).ammesso === false,
   'controprova — Bersagliato e in Soppressione: rifiutato, non sono né IMM né Null');

console.log('\n=== 3. Senza candidati usa il roster nemico ===');
M._rosterNemico = [fus(), fus({ unconscious: true })];
const def = M.bersagliDaPiazzamento(dc, {});
ok(def.length >= 2, `restituisce una voce per ogni nemico schierato (${def.length})`);
ok(def.filter(r => r.ammesso).length === 1, 'e ammette solo quello Incosciente');

console.log('\n=== 4. Un\'arma che non dichiara niente non filtra ===');
// Controprova sul filtro: se il Combi Rifle fosse filtrato come la D-Charges,
// la sezione 2 non dimostrerebbe che il filtro viene dall'arma.
const combi = M.bersagliDaPiazzamento(M.profiloArma('Combi Rifle'), { candidati: [fus()] })[0];
ok(combi.ammesso === true && combi.dichiarato !== true, 'Combi Rifle: nessun campo dichiarato, Fusilier ammesso');

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
