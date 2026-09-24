// @versione 2026-09-23.1 | test_giro_ritorno.js | proprieta`: chat TEST
// Il giro di ritorno del nome arma — node test_giro_ritorno.js
global.window = global;
let passati = 0, falliti = 0;
function ok(c, n, e) { if (c) { passati++; console.log(`  ✅ ${n}`); } else { falliti++; console.log(`  ❌ ${n}${e ? '\n       ' + e : ''}`); } }

const el = {};
function nodo(id) { return el[id] || (el[id] = { id, innerHTML: '', innerText: '', style: {},
    appendChild() {}, remove() {}, cloneNode() { return nodo(id + '_c'); }, parentNode: { replaceChild() {} } }); }
global.document = { title: 'NOMADS', getElementById: (i) => nodo(i),
    querySelector: () => nodo('btn'), querySelectorAll: () => [],
    createElement: () => ({ style: {}, innerHTML: '', appendChild() {} }) };
global.alert = () => {}; global.goToStep = () => {}; global.confirmMultiAro = () => {};
global.mostraTitoloUnitaCorrente = () => {}; global.puoFareAzione = () => true;
global.inviaCalcoloAllHub = () => {};

require('./catalogo_n5.js'); require('./database_comune.js');
require('./database_nomad.js'); require('./database_panoceania.js');
const M = require('./motore_regole_n5.js');
require('./ordine_attacco_cc.js');

const morlock = window.DB_NOMADI.find(u => /Morlock/.test(u.nome || ''));
const fus = { alias: 'Fusilier', arm: 1, bts: 0, ph: 10 };

console.log('\n=== 1. Il nome grezzo sopravvive a variantiArma ===');
const arme = M.armiCC(morlock);
const ap = arme.find(a => /AP CC/.test(a.nome));
ok(ap.nome === 'AP CC Weapon', 'nome: spogliato, per il database');
ok(ap.nomeRichiesto === 'AP CC Weapon(PS=6)', 'nomeRichiesto: GREZZO, con la notazione');
ok(ap.dam === 6, 'e il PS del profilo è già applicato');

console.log('\n=== 2. Il giro di ritorno è reversibile ===');
// Il modulo salva una stringa e poi la ririsolve: se la stringa è spogliata,
// la notazione non torna più.
ok(M.profiloArma(ap.nomeRichiesto).dam === 6,
   'ririsolvendo il nomeRichiesto: PS 6');
ok(M.profiloArma(ap.nome).dam === 8,
   'ririsolvendo il nome spogliato: PS 8 — ed è la causa del difetto');

console.log('\n=== 3. Il modulo passa il nome grezzo al bottone ===');
window.currentOrder = {}; window.coordUnits = [morlock]; window.coordIndex = 0;
window.coordPayloads = []; window.combatTargets = []; window.pendingTargets = [];
M._fazione = 'NOMADI'; M._rosterProprio = [morlock];
M._rosterNemico = [{ id: 'p1', alias: 'Fusilier', tipo: 'LI', arm: 1, bts: 0, ph: 10, skills: '', states: { engaged: true } }];
window.avviaFaseCC('ATTACCO CC', false);
const html = nodo('weapon-buttons-container').innerHTML;
ok(/AP CC Weapon\(PS=6\)/.test(html),
   'il bottone porta "AP CC Weapon(PS=6)", non il nome spogliato');

console.log('\n=== 4. Dal click al Tiro Salvezza ===');
window.declareCCAttack('AP CC Weapon(PS=6)');
ok(window.currentOrder.weapon === 'AP CC Weapon(PS=6)',
   'currentOrder.weapon conserva la notazione');
const riletta = M.profiloArma(window.currentOrder.weapon);
ok(riletta.dam === 6, 'il modulo la ririsolve a PS 6');
ok(M.tiroSalvezza(fus, { arma: riletta }).valoreSuccesso === 7,
   'Tiro Salvezza ARM VS 7 — al tavolo, non solo nel motore');

console.log('\n=== 5. Tutti e cinque i moduli passano il nome grezzo ===');
const fs = require('fs');
['ordine_attacco_bs.js','ordine_attacco_cc.js','ordine_attacco_guidato.js',
 'ordine_attacco_intuitivo.js','ordine_fuoco_speculativo.js'].forEach(function (f) {
    const t = fs.readFileSync('./' + f, 'utf8');
    ok(/nomeRichiesto \|\| /.test(t), f + ': usa nomeRichiesto');
    ok(!/const nomeEsc = [a-z]+\.nome\.replace/.test(t), f + ': non usa più il nome spogliato');
});

console.log('\n=== 6. Le altre notazioni, non solo il PS ===');
// 227 notazioni d'arma passano da qui: il contratto vale per tutte.
[['Combi Rifle(+1B)', 'BURST'], ['Combi Rifle(SR-1)', 'SALVEZZA'],
 ['MediKit (PH=12)', 'SOSTITUZIONE']].forEach(function (c) {
    const p = M.profiloArma(c[0]);
    ok(p.notazioni.length > 0 && M.parseNotazione(p.notazioni[0]).tipo === c[1],
       `"${c[0]}": notazione agganciata come ${c[1]}`);
});
const conBurst = M.variantiArma('Combi Rifle(+1B)')[0];
ok(conBurst && conBurst.nomeRichiesto === 'Combi Rifle(+1B)',
   'e variantiArma conserva il grezzo anche per il (+1B)');

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
