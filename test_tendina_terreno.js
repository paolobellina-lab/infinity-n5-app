// @versione 2026-10-05.2 | test_tendina_terreno.js | proprieta`: chat TEST
// Terreno, Fumo ed Eclipse in una tendina sola — CARTELLA=/percorso/ node test_tendina_terreno.js
// Il codice provato e` quello VERO: il blocco si ritaglia da app.html, non
// si ricopia qui. Si entra dalla porta del giocatore (selezionaAzioneAro).
const fs = require('fs'), path = require('path');
const DIR = process.env.CARTELLA || (__dirname + '/');
global.window = global;
let passati = 0, falliti = 0;
function ok(c, n, e) { if (c) { passati++; console.log(`  ✅ ${n}`); } else { falliti++; console.log(`  ❌ ${n}${e ? '\n       ' + e : ''}`); } }

const el = {};
function nodo(id) { return el[id] || (el[id] = { id, innerHTML: '', innerText: '', style: {},
    appendChild() {}, remove() {}, cloneNode() { return nodo(id + '_c'); }, parentNode: { replaceChild() {} } }); }
global.document = { title: 'NOMADS', getElementById: (i) => nodo(i), querySelector: () => nodo('btn'),
    querySelectorAll: () => [], createElement: () => ({ style: {}, innerHTML: '', appendChild() {} }) };
global.alert = () => {}; global.confirm = () => true; global.scrollTo = () => {};
let risposta = null; global.inviaRispostaAro = (p) => { risposta = p; };

require(path.resolve(DIR, 'catalogo_n5.js')); require(path.resolve(DIR, 'database_comune.js'));
const M = require(path.resolve(DIR, 'motore_regole_n5.js'));
require(path.resolve(DIR, 'logica_aro.js'));

const h = fs.readFileSync(path.resolve(DIR, 'app.html'), 'utf8');
function ritaglia(da, a) {
    const i = h.indexOf(da), j = h.indexOf(a, i);
    if (i < 0 || j < 0) throw new Error('ritaglio non trovato: ' + da);
    return h.slice(i, j);
}

console.log('\n=== 0. Controprova: senza app.html il ripiego si dichiara ===');
const tiratore = { id: 'n1', alias: 'Alguacil', bs: 11, ph: 10, wip: 12, weapon: 'Combi Rifle, Knife', skills: '', states: {} };
global.roster = [tiratore]; M._fazione = 'NOMADI'; M._rosterProprio = global.roster;
M._rosterNemico = [{ id: 'p1', alias: 'Fusilier', tipo: 'LI', states: {} }];
function nuovo() {
    window.currentAttackData = { attaccanti: ['Fusilier'], azione: 'ATTACCO BS' };
    window.selectedAroUnits = ['n1']; window.currentAroIndex = 0;
    window.aroReactions = []; window.aroCurrentConfig = {}; window.aroSfMode = false; risposta = null;
    window.avviaCicloAroUnita(); window.selezionaAzioneAro('BS_ATTACK');
    window.selezionaArmaAro('Combi Rifle'); window.selezionaBersaglioAro('Fusilier');
}
const errori = []; const veroErr = console.error; console.error = (...a) => errori.push(a.join(' '));
nuovo();
console.error = veroErr;
ok(errori.some(e => e.includes('sceltaTerreno manca')), 'senza la tendina condivisa lo scrive in console');
ok(!nodo('aro-modifiers-content').innerHTML.includes('+FUMO'), 'e in quel caso il Fumo NON c\'e` (il banco sa dire di no)');

console.log('\n=== 1. La tendina vera, ritagliata da app.html ===');
eval(ritaglia('window.chiamataConValore = (comando', 'window.coperturePresenti'));
eval(ritaglia('window.ZONE_VISIBILITA = [', 'window.separaTerrenoEZona = (valore)'));
eval(ritaglia('window.separaTerrenoEZona = (valore)', '// ==========================================\n        // 🛡️  DA QUALE COPERTURA'));
window.activeTerrains = [];
nuovo();
let html = nodo('aro-modifiers-content').innerHTML;
ok((html.match(/<select/g) || []).length === (html.includes('setAroAmmo') ? 2 : 1), 'una sola tendina per terreno e zone');
ok(!html.includes('setAroZona'), 'la tendina separata della zona non c\'e` piu`');
ok(typeof window.sceltaZona === 'undefined' && typeof window.setAroZona === 'undefined', 'e nemmeno i due comandi vecchi: sceltaZona e setAroZona');
ok(!/window\.sceltaZona\s*=/.test(h), 'app.html non definisce piu` sceltaZona');
ok(html.includes('value="NESSUNO+FUMO"') && html.includes('value="NESSUNO+ECLIPSE"'), 'Fumo ed Eclipse ci sono anche senza terreni dichiarati');

console.log('\n=== 2. Con un terreno sul tavolo ===');
window.activeTerrains = [window.DB_TERRENI.find(t => t.id === 'TER_10')];
nuovo(); html = nodo('aro-modifiers-content').innerHTML;
ok(html.includes('value="TER_10"') && html.includes('value="TER_10+FUMO"') && html.includes('value="TER_10+ECLIPSE"'), 'Bosco, Bosco + Fumo, Bosco + Eclipse');

console.log('\n=== 3. La scelta arriva nei due campi della busta ===');
window.setAroTerreno('TER_10+FUMO');
ok(window.aroCurrentConfig.terrain === 'TER_10' && window.aroCurrentConfig.zona === 'FUMO', 'TER_10+FUMO -> terrain TER_10, zona FUMO');
ok(nodo('aro-modifiers-content').innerHTML.includes('value="TER_10+FUMO" selected'), 'e la voce resta selezionata dopo il ridisegno');
window.setAroTerreno('NESSUNO+ECLIPSE');
ok(window.aroCurrentConfig.terrain === 'NESSUNO' && window.aroCurrentConfig.zona === 'ECLIPSE', 'NESSUNO+ECLIPSE -> terrain NESSUNO, zona ECLIPSE');
window.setAroTerreno('TER_10');
ok(window.aroCurrentConfig.terrain === 'TER_10' && window.aroCurrentConfig.zona === null, 'solo terreno -> zona null, non stringa vuota');
window.setAroTerreno('NESSUNO');
ok(window.aroCurrentConfig.terrain === 'NESSUNO' && window.aroCurrentConfig.zona === null, 'nessuno -> NESSUNO e null');
window.setAroTerreno('TER_10+ECLIPSE');
global.inviaAro = global.inviaAro || function () {};
const inviaVero = window.inviaAro; window.inviaAro = function () {};
window.salvaAroCorrente();
window.inviaAro = inviaVero;
const r = window.aroReactions[window.aroReactions.length - 1] || {};
ok(r.terrain === 'TER_10' && r.zona === 'ECLIPSE', 'e la reazione confermata li porta tutti e due', JSON.stringify({ terrain: r.terrain, zona: r.zona }));

console.log('\n──────────────');
console.log(`${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
