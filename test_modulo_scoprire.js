// @versione 2026-09-23.1 | test_modulo_scoprire.js | proprieta`: chat TEST
// Test end-to-end di Scoprire — node test_modulo_scoprire.js
global.window = global;
let passati = 0, falliti = 0;
function ok(c, n, e) { if (c) { passati++; console.log(`  ✅ ${n}`); } else { falliti++; console.log(`  ❌ ${n}${e ? '\n       ' + e : ''}`); } }

const el = {};
function nodo(id) { return el[id] || (el[id] = { id, innerHTML: '', innerText: '', style: {},
    appendChild() {}, remove() {}, cloneNode() { return nodo(id + '_c'); }, parentNode: { replaceChild() {} } }); }
global.document = { title: 'NOMADS', getElementById: (i) => nodo(i), querySelector: () => nodo('btn'),
    querySelectorAll: () => [], createElement: () => ({ style: {}, innerHTML: '', appendChild() {} }) };
let alertUltimo = null; global.alert = (m) => { alertUltimo = m; };
let inviato = null; global.inviaCalcoloAllHub = (p) => { inviato = p; };
global.goToStep = () => {}; global.confirmMultiAro = () => {};

require('./catalogo_n5.js'); require('./database_comune.js');
const M = require('./motore_regole_n5.js');
require('./ordine_scoprire.js');

const alg    = { id: 'n1', alias: 'Alguacil', wip: 12, bs: 11, skills: '', states: {} };
const sensor = { id: 'n2', alias: 'Sensore',  wip: 13, bs: 11, skills: 'Sensor', states: {} };
const msv2   = { id: 'n3', alias: 'Occhio',   wip: 12, bs: 12, skills: 'Multispectral Visor L2', states: {} };
const esperto= { id: 'n4', alias: 'Esperto',  wip: 13, bs: 11, skills: 'Discover (+3)', states: {} };

M._fazione = 'NOMADI';
M._rosterProprio = [alg, sensor, msv2, esperto];
M._rosterNemico = [
    { id: 'p1', alias: 'Croc Man', tipo: 'LI', deployState: 'CAMO', skills: 'Mimetism (-6)', states: { camo: true } },
    { id: 'p2', alias: 'Speculo',  tipo: 'LI', deployState: 'IMP',  skills: '', states: { impersonation: true } },
    { id: 'p3', alias: 'Fusilier', tipo: 'LI', skills: '', states: {} },
    { id: 'p4', alias: 'Morto',    tipo: 'LI', state: 'DEAD', states: {} }
];

function nuovo(u) {
    window.currentOrder = {}; window.coordUnits = [u]; window.coordIndex = 0;
    window.coordPayloads = []; window.combatTargets = []; window.coordMode = false;
    inviato = null; alertUltimo = null;
}

console.log('\n=== 1. Il modulo esiste e il router lo trova ===');
ok(typeof window.avviaFaseScoprire === 'function', 'avviaFaseScoprire definita (prima mancava del tutto)');

console.log('\n=== 2. Solo i Marker si Scoprono ===');
nuovo(alg);
window.avviaFaseScoprire('SCOPRIRE', false);
ok(window.validTargets.length === 2, `2 Marker validi (trovati ${window.validTargets.length})`);
ok(window.validTargets.every(u => u.states.camo || u.states.impersonation), 'sono il CAMO e l IMP');
ok(window.targetsScartati.some(t => t.nome === 'Fusilier'),
   'un nemico visibile è escluso: non c è niente da scoprire');
ok(window.targetsScartati.some(t => t.nome === 'Morto'), 'e il morto pure');

console.log('\n=== 3. NON è un tiro nudo: prende i MOD del BS Attack ===');
const camo = M._rosterNemico[0];
const senza = M.regoleScoprire(alg, camo, { rangeIndex: 0 });
ok(senza.voci.some(v => v.fonte === 'mimetismo'),
   'il Mimetismo del bersaglio si applica (l Intuitivo invece ignora tutto)');
const conCop = M.regoleScoprire(alg, camo, { rangeIndex: 0, cover: true });
ok(conCop.valore === senza.valore - 3, 'e anche la Copertura');
ok(M.regoleScoprire(alg, camo, { rangeIndex: 4 }).voci.some(v => v.fonte === 'gittata'),
   'e la gittata');

console.log('\n=== 4. Scoprire ha gittate PROPRIE ===');
const arma = M.armaScoprire();
ok(arma.bands.length === 12, 'la riga SCOPRIRE del Weapon Chart, 12 bande');
ok(arma.bands.slice(0, 4).map(b => b.mod).join() === '3,0,0,0',
   'e non sono quelle di un fucile: +3 / 0 / 0 / 0');

console.log('\n=== 5. Sensor e Multispectral Visor ===');
const conSensor = M.regoleScoprire(sensor, camo, { rangeIndex: 0 });
ok(conSensor.voci.some(v => v.fonte === 'sensor' && v.valore === 6),
   'Sensor: +6 WIP contro un Marker Mimetico');
const conMsv = M.regoleScoprire(msv2, camo, { rangeIndex: 0 });
ok(conMsv.automatico === true && conMsv.valore === null,
   'Multispectral Visor L2: SUCCESSO AUTOMATICO, non si tira');
const imp = M._rosterNemico[1];
ok(M.regoleScoprire(msv2, imp, { rangeIndex: 0 }).automatico !== true,
   'ma solo contro il Mimetizzato: su un Impersonation si tira');

console.log('\n=== 6. Discover (+3) di profilo ===');
const conNot = M.regoleScoprire(esperto, camo, { rangeIndex: 0 });
ok(conNot.voci.some(v => v.motivo.includes('Discover (+3)')), 'la notazione di profilo si applica');

console.log('\n=== 7. Il Fireteam dà +3, non il +1 BS ===');
function ft(n) { return n.map((x, i) => ({ nome: x, alias: x + i, wip: 12 })); }
const conFT = M.regoleScoprire(alg, camo,
    { rangeIndex: 0, fireteam: ft(['Fusilier', 'Fusilier', 'Fusilier', 'Fusilier']) });
const vociFT = conFT.voci.filter(v => v.fonte === 'fireteam');
ok(vociFT.length === 1 && vociFT[0].valore === 3,
   'Fireteam di Livello 4: +3 Discover, non +1 BS (FAQ 0.0.0)');

console.log('\n=== 8. Schermata ===');
nuovo(alg);
window.setupTargetSelectionScoprire();
window.scegliBersaglioScoprire('p1');
window.preparaModificatoriScoprire();
let h = nodo('targets-allocation-container').innerHTML;
ok(h.includes('WIP 12'), 'mostra il WIP di partenza');
ok(h.includes('range-seg'), 'e il selettore di gittata');
ok(h.includes('COPERTURA') || h.includes('SCOPERTO'), 'e l interruttore Copertura');
ok(window.combatTargets.length === 1, 'un solo bersaglio: non si Scopre due volte nello stesso Ordine');

nuovo(msv2);
window.setupTargetSelectionScoprire();
window.scegliBersaglioScoprire('p1');
window.preparaModificatoriScoprire();
ok(nodo('targets-allocation-container').innerHTML.includes('SUCCESSO AUTOMATICO'),
   'col visore la schermata dice che non si tira');

console.log('\n=== 9. Invio ===');
nuovo(alg);
window.setupTargetSelectionScoprire();
window.scegliBersaglioScoprire('p1');
window.preparaModificatoriScoprire();
window.eseguiCalcoloScoprire();
ok(inviato !== null, 'spedito');
const a = inviato && inviato.attacchi[0];
ok(a && a.azione === M.AZIONI.SCOPRIRE, 'azione canonica');
ok(a && a.regole.attributo === 'WIP', 'l Hub sa che si tira su WIP');
ok(a && a.regole.nonOffensivo === true, 'e che non infligge danno');
ok(a && typeof a.regole.valoreSuccesso === 'number', 'col Valore di Successo calcolato');

nuovo(alg);
window.combatTargets = [];
window.preparaModificatoriScoprire();
ok(alertUltimo && /Nessun Marker/.test(alertUltimo), 'senza bersaglio: si ferma e lo dice');

console.log('\n=== 10. Il router lo instrada ===');
const src = require('fs').readFileSync('./motore_core.js', 'utf8');
ok(/avviaFaseScoprire/.test(src), 'il router chiama avviaFaseScoprire');

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
