// @versione 2026-09-23.1 | test_modulo_speculativo.js | proprieta`: chat TEST
// Test end-to-end del modulo Speculativo — node test_modulo_speculativo.js
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
global.goToStep = () => {}; global.renderTargetButtons = () => {};

require('./catalogo_n5.js'); require('./database_comune.js');
const M = require('./motore_regole_n5.js');
require('./ordine_fuoco_speculativo.js');

const granatiere = { id: 'n1', alias: 'Granatiere', bs: 11, ph: 12, wip: 13,
                     weapon: 'Grenades, Combi Rifle', states: {} };
const missilista = { id: 'n2', alias: 'Missilista', bs: 12, ph: 10,
                     weapon: 'Missile Launcher, Heavy Rocket Launcher, Adhesive Launcher Rifle', states: {} };

M._fazione = 'NOMADI';
M._rosterProprio = [granatiere, missilista];
M._rosterNemico = [
    { id: 'p1', alias: 'Fusilier', tipo: 'LI', states: {} },
    { id: 'p2', alias: 'Croc Man', tipo: 'LI', deployState: 'CAMO', states: { camo: true } }
];

function nuovo(u) {
    window.currentOrder = {}; window.coordUnits = [u]; window.coordIndex = 0;
    window.coordPayloads = []; window.combatTargets = []; window.coordMode = false;
    inviato = null; alertUltimo = null;
}

console.log('\n=== 1. ERRORE CORRETTO: il filtro armi ===');
nuovo(missilista);
window.avviaFaseSpeculativo('FUOCO SPECULATIVO', false);
let h = nodo('weapon-buttons-container').innerHTML;
ok(h.includes('Nessuna arma col Tratto'),
   'Missile/Rocket/Adhesive Launcher: NESSUNA offerta (prima le offriva tutte per via di "LAUNCHER" nel nome)');
ok(h.includes('Missile Launcher') && h.includes('non ha il Tratto'),
   'e il motivo dell esclusione è scritto');

nuovo(granatiere);
window.startUnitSpeculativoLoop();
h = nodo('weapon-buttons-container').innerHTML;
ok(h.includes('Grenades'), 'Grenades offerta');
ok(h.includes('Combi Rifle') && h.includes('non ha il Tratto'),
   'Combi Rifle esclusa perché il database dice che non ha il Tratto Speculative Attack');

console.log('\n=== 2. ERRORE CORRETTO: le Granate tirano su PH ===');
ok(h.includes('Tira su PH'), 'sul bottone c è scritto che si tira su PH, non su BS');
const attr = M.attributoArma(M.profiloArma('Grenades'), M.AZIONI.SPECULATIVO);
ok(attr.attributo === 'PH', 'attributoArma: Grenades -> PH');
ok(M.attributoArma(M.profiloArma('Combi Rifle'), M.AZIONI.SPECULATIVO).attributo === 'BS',
   'un fucile resta su BS');

console.log('\n=== 3. I MOD: -6 fisso PIÙ la gittata ===');
const g = M.profiloArma('Grenades');
console.log('   bande Grenades: ' + g.bands.map(b => `${b.mod > 0 ? '+' : ''}${b.mod} (${b.label})`).join('  '));
const vicino = M.regoleSpeculativo(g, { rangeIndex: 0 });
ok(vicino.modTotale === -3, `a 0-8": -6 +3 = -3 (ottenuto ${vicino.modTotale})`);
const lontano = M.regoleSpeculativo(g, { rangeIndex: 1 });
ok(lontano.modTotale === -9, `a 8-16": -6 -3 = -9 (ottenuto ${lontano.modTotale})`);
ok(g.bands.length === 2, 'le Granate hanno due bande sole: oltre 16" sono fuori gittata');
ok(vicino.voci.length === 2, 'il dettaglio distingue le due voci');

console.log('\n=== 4. La differenza con l Attacco Intuitivo ===');
const intuitivo = M.regoleIntuitivo(M.profiloArma('Light Flamethrower'));
ok(intuitivo.modAmmessi.length === 0, 'Intuitivo: NESSUN MOD, gittata compresa');
ok(vicino.modGittata === 3, 'Speculativo: la gittata SI applica');
ok(vicino.ignoraMimetismo && vicino.ignoraCopertura, 'Speculativo: ignora Mimetismo e Copertura');
ok(vicino.richiedeLoF === false, 'Speculativo: non richiede LoF');

console.log('\n=== 5. Schermata modificatori ===');
nuovo(granatiere);
window.currentOrder.weapon = 'Grenades';
window.combatTargets = [{ id: 'p1', name: 'Fusilier', burst: 3, cover: true }];
window.preparaModificatoriSpeculativo();
h = nodo('targets-allocation-container').innerHTML;
ok(h.includes('TIRO SU PH 12'), 'mostra PH 12, non BS 11');
ok(h.includes('range-seg'), 'il selettore di gittata c è (a differenza dell Intuitivo)');
ok(!h.includes('IN COPERTURA'), 'nessun interruttore Copertura: è ignorata per regola');
ok(h.includes('MOD totale'), 'mostra il MOD totale scomposto');
ok(window.combatTargets[0].burst === 1, 'Burst forzato a 1');
ok(window.combatTargets[0].cover === false, 'la copertura del bersaglio è azzerata');

window.setTargetRangeSpeculativo(1);
ok(window.combatTargets[0].rangeMod === -3, 'cambio banda: MOD aggiornato dall arma');

console.log('\n=== 6. Bersagli: i Marker sono validi ===');
nuovo(granatiere);
window.currentOrder.weapon = 'Grenades';
window.setupTargetSelectionSpeculativo();
ok(window.validTargets.length === 2,
   'anche il Marker CAMO è bersagliabile (lo Speculativo non richiede LoF)');

console.log('\n=== 7. Invio ===');
nuovo(granatiere);
window.currentOrder.weapon = 'Grenades';
window.combatTargets = [{ id: 'p1', name: 'Fusilier', burst: 1 }];
window.preparaModificatoriSpeculativo();
window.eseguiCalcoloSpeculativo();
ok(inviato !== null, 'spedito');
const a = inviato && inviato.attacchi[0];
ok(a && a.azione === M.AZIONI.SPECULATIVO, 'azione canonica');
ok(a && a.regole.attributo === 'PH', 'il payload dice all Hub di usare il PH');
ok(a && a.regole.ignoraCopertura && a.regole.ignoraMimetismo,
   'il payload esplicita cosa ignorare (prima c era solo il flag isSpeculative)');
ok(a && a.regole.modTotale === -3, 'MOD totale nel payload');
ok(a && a.arma.burst === 1, 'Burst 1');

nuovo(granatiere);
window.currentOrder.weapon = 'Grenades';
window.combatTargets = [{ id: 'generic1', name: 'Bersaglio Primario', burst: 1, rangeIndex: 0, rangeMod: 3 }];
window.eseguiCalcoloSpeculativo();
ok(inviato === null, 'bersaglio fantasma: bloccato');

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
