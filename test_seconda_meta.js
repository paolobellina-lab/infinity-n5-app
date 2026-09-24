// @versione 2026-09-23.1 | test_seconda_meta.js | proprieta`: chat TEST
// Il guasto della seconda metà — node test_seconda_meta.js
global.window = global;
let passati = 0, falliti = 0;
function ok(c, n, e) { if (c) { passati++; console.log(`  ✅ ${n}`); } else { falliti++; console.log(`  ❌ ${n}${e ? '\n       ' + e : ''}`); } }

const el = {};
function nodo(id) { return el[id] || (el[id] = { id, innerHTML: '', innerText: '', style: {},
    appendChild() {}, remove() {}, cloneNode() { return nodo(id + '_c'); }, parentNode: { replaceChild() {} } }); }
global.document = { title: 'NOMADS', getElementById: (i) => nodo(i),
    querySelector: () => nodo('primo-huge-btn'), querySelectorAll: () => [],
    createElement: () => ({ style: {}, innerHTML: '', appendChild() {} }) };
let alertUltimo = null; global.alert = (m) => { alertUltimo = m; };
global.inviaCalcoloAllHub = () => {};
global.goToStep = () => {}; global.confirmMultiAro = () => {};
global.mostraTitoloUnitaCorrente = () => {};
global.puoFareAzione = () => true;

require('./catalogo_n5.js'); require('./database_comune.js');
const M = require('./motore_regole_n5.js');
require('./ordine_attacco_cc.js');
require('./ordine_attacco_bs.js');

const alg = { id: 'n1', alias: 'Alguacil', bs: 11, cc: 13, ph: 10, wip: 12, arm: 1,
              weapon: 'Combi Rifle, Knife', skills: '', states: {} };
M._fazione = 'NOMADI';
M._rosterProprio = [alg];
M._rosterNemico = [{ id: 'p1', alias: 'Fusilier', tipo: 'LI', arm: 1, skills: '', states: {} }];

function nuovoOrdine(primaMeta) {
    window.currentOrder = { action1: primaMeta };
    window.coordUnits = [alg]; window.coordIndex = 0;
    window.coordPayloads = []; window.combatTargets = [];
    window.coordMode = false;
    alertUltimo = null;
    Object.keys(el).forEach(k => { el[k].innerHTML = ''; });
}

console.log('\n=== 1. IL CASO PIÙ COMUNE: muovi e vai in mischia ===');
nuovoOrdine('MOVIMENTO');
window.avviaFaseCC('ATTACCO CC', true);
const htmlArmi = nodo('weapon-buttons-container').innerHTML;
ok(htmlArmi.length > 0, 'la schermata dell arma VIENE costruita (prima restava vuota)');
ok(!alertUltimo || !/Nessun bersaglio/.test(alertUltimo),
   'e non arriva l alert "Nessun bersaglio confermato"');

console.log('\n=== 2. Muovi e spara ===');
nuovoOrdine('MOVIMENTO');
window.avviaFaseAttaccoBS('ATTACCO BS', true);
ok(nodo('weapon-buttons-container').innerHTML.length > 0,
   'anche il BS costruisce la schermata dell arma');
ok(!alertUltimo || !/Nessun bersaglio/.test(alertUltimo), 'nessun alert spurio');

console.log('\n=== 3. Se la prima metà ERA un attacco, si riprende ===');
nuovoOrdine('ATTACCO CC');
window.currentOrder.weapon = 'CC Weapon';
window.combatTargets = [{ id: 'p1', name: 'Fusilier', burst: 1 }];
const r = M.riprendiOrdineDaFinestra('ATTACCO CC', true);
ok(r.riprende === true, 'arma e bersagli validi: si va diretti ai modificatori', r.motivo);

// arma sconosciuta e arma sbagliata sono problemi diversi
window.currentOrder.weapon = 'Fucile Immaginario';
const ign = M.riprendiOrdineDaFinestra('ATTACCO CC', true);
ok(/non è nel database armi/.test(ign.motivo),
   'un arma sconosciuta lo dice, invece di "non è da Corpo a Corpo"');

console.log('\n=== 4. Un cambio di famiglia fa ripartire ===');
nuovoOrdine('ATTACCO BS');
window.currentOrder.weapon = 'Combi Rifle';
window.combatTargets = [{ id: 'p1', name: 'Fusilier', burst: 3 }];
const r2 = M.riprendiOrdineDaFinestra('ATTACCO CC', true);
ok(r2.riprende === false, 'un Combi Rifle non serve in mischia: si riparte');
ok(/Corpo a Corpo/.test(r2.motivo), 'e il motivo lo dice');
ok(/ATTACCO BS/.test(r2.motivo), 'e dice ANCHE che l azione è cambiata: i motivi si accumulano');

console.log('\n=== 4b. Il vocabolario misto si normalizza ===');
// SPEC ha "ATTACCO BS" accanto a "CC_ATTACK", e i moduli ricevono dal router
// la forma dell interfaccia: cercarla in SPEC non trovava nulla, e ogni
// controllo che dipende dalla SPEC veniva saltato in silenzio.
ok(M.azioneCanonica('ATTACCO CC') === 'CC_ATTACK', '"ATTACCO CC" -> CC_ATTACK');
ok(M.azioneCanonica('BS_ATTACK') === 'ATTACCO BS', '"BS_ATTACK" -> ATTACCO BS');
ok(M.azioneCanonica('DODGE') === 'SCHIVATA', '"DODGE" -> SCHIVATA');
ok(M.azioneCanonica('ATTACCO LASER') === null,
   'un azione inventata torna null invece di passare per ignota');

console.log('\n=== 5. Prima metà: si parte sempre dall inizio ===');
ok(M.riprendiOrdineDaFinestra('ATTACCO BS', false).riprende === false,
   'la prima metà non "riprende" niente');

console.log('\n=== 6. Il selettore del pulsante di calcolo ===');
const src = require('fs').readFileSync('./ordine_attacco_cc.js', 'utf8');
ok(/btn-esegui-calcolo/.test(src), 'si cerca prima l id stabile #btn-esegui-calcolo');
ok(/\|\| document\.querySelector\('#step-modifiers \.huge-btn'\)/.test(src),
   'col vecchio selettore come ripiego, per gli HTML non ancora aggiornati');

let conteggio = 0;
['ordine_attacco_bs.js','ordine_attacco_cc.js','ordine_attacco_guidato.js',
 'ordine_attacco_intuitivo.js','ordine_difesa.js','ordine_fuoco_speculativo.js',
 'ordine_hacking.js','ordine_movimento.js','ordine_scoprire.js','ordine_supporto.js'
].forEach(function (f) {
    if (/btn-esegui-calcolo/.test(require('fs').readFileSync('./' + f, 'utf8'))) conteggio++;
});
ok(conteggio === 10, `tutti e dieci i moduli corretti (${conteggio})`);

console.log('\n=== 7. Nessun modulo ramifica più sul solo isSecondHalf ===');
let grezzi = [];
['ordine_attacco_bs.js','ordine_attacco_cc.js','ordine_attacco_guidato.js',
 'ordine_attacco_intuitivo.js','ordine_fuoco_speculativo.js','ordine_hacking.js',
 'ordine_scoprire.js','ordine_supporto.js'
].forEach(function (f) {
    const t = require('fs').readFileSync('./' + f, 'utf8');
    if (/if \(!isSecondHalf\) \{/.test(t)) grezzi.push(f);
});
ok(grezzi.length === 0, 'la condizione grezza è sparita da tutti', grezzi.join(', '));

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
