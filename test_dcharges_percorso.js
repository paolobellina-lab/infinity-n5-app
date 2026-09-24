// @versione 2026-09-23.1 | test_dcharges_percorso.js | proprieta`: chat TEST
// D-Charges: il filtro agisce PASSANDO DAL MODULO — node test_dcharges_percorso.js
// Il test precedente chiamava la funzione isolata ed era verde anche con la
// funzione scollegata dall'app. Questo passa dal modulo di piazzamento.
global.window = global;
let passati = 0, falliti = 0;
function ok(c, n, e) { if (c) { passati++; console.log(`  ✅ ${n}`); } else { falliti++; console.log(`  ❌ ${n}${e ? '\n       ' + e : ''}`); } }
const el = {};
function nodo(id) { return el[id] || (el[id] = { id, innerHTML: '', style: {}, appendChild() {}, remove() {},
    cloneNode() { return nodo(id + '_c'); }, parentNode: { replaceChild() {} } }); }
global.document = { title: 'NOMADS TACTICAL TERMINAL', getElementById: i => nodo(i),
    querySelector: () => nodo('btn'), querySelectorAll: () => [], createElement: () => nodo('tmp') };
let ultimoAlert = null; global.alert = m => { ultimoAlert = m; };
global.goToStep = () => {}; global.mostraTitoloUnitaCorrente = () => {}; global.inviaCalcoloAllHub = () => {};
require('./catalogo_n5.js'); require('./database_comune.js');
const M = require('./motore_regole_n5.js');
require('./ordine_piazzamento.js');

const dc = M.profiloArma('D-Charges (Demolition Mode)');
const v = window.RULES_WEAPONS['D-Charges (Demolition Mode)'];
ok(Array.isArray(v.bersagliAmmessi), 'il database dichiara i bersagli ammessi delle D-Charges');

console.log('\n=== 1. Il modulo offre le D-Charges ===');
// Non hanno il Tratto Deployable, ma "Are placed using the Place Deployable
// Short Skill" (riga 6044): prima il modulo non le offriva.
ok(M.ePiazzabile(dc) === true, 'la Demolition Mode è piazzabile');
const portatore = { id: 'n1', alias: 'Geniere', skills: '', states: {}, weapon: 'D-Charges', equip: '' };
M._fazione = 'NOMADI';
M._rosterNemico = [
    { id: 'sano', alias: 'Fusilier sano', tipo: 'LI', states: {} },
    { id: 'imm',  alias: 'Fusilier IMM-A', tipo: 'LI', states: { immobilizedA: true } },
    { id: 'pos',  alias: 'TAG posseduto e IMM-A', tipo: 'TAG', states: { immobilizedA: true, possessed: true } }
];
window.currentOrder = {}; window.coordUnits = [portatore]; window.coordIndex = 0; window.coordPayloads = [];
// Si parte dall'AVVIO della fase, come fa l'app: saltarlo lasciava
// deployableRisposte non inizializzato e il test andava in crash.
window.avviaFaseDeployable('PIAZZARE EQUIPAGGIAMENTO', false);

console.log('\n=== 2. Scegliendo l arma, il modulo chiede SU COSA ===');
window.scegliArmaDaPiazzare('D-Charges (Demolition Mode)');
const g = window.bersagliPiazzamento || [];
ok(g.length === 3, `tre candidati valutati dal modulo (${g.length})`);
const per = id => g.find(x => x.unita.id === id);
ok(per('sano') && per('sano').ammesso === false, 'un nemico SANO: rifiutato dal modulo');
ok(per('imm') && per('imm').ammesso === true, 'un nemico Immobilizzato: ammesso');
ok(per('pos') && per('pos').ammesso === false, 'Immobilizzato ma Posseduto: rifiutato, l esclusione vince');
ok(/Non ammessi/.test(nodo('enemy-target-buttons').innerHTML), 'e la schermata mostra i rifiutati col motivo');

console.log('\n=== 3. Il click su un bersaglio rifiutato non passa ===');
window.scegliBersaglioPiazzamento('sano');
ok(ultimoAlert && /non ammesso/.test(ultimoAlert), 'scegliere il nemico sano: bloccato');
ok(!window.deployableBersaglio, 'e nessun bersaglio registrato');
window.scegliBersaglioPiazzamento('imm');
ok(window.deployableBersaglio && window.deployableBersaglio.id === 'imm', 'il nemico Immobilizzato: registrato');

console.log('\n=== 4. 🔴 La prova che il test guarda il modulo: scollego la funzione ===');
const vera = M.bersaglioAmmessoDaArma;
M.bersaglioAmmessoDaArma = function () { return { dichiarato: false, ammesso: true }; };
window.scegliArmaDaPiazzare('D-Charges (Demolition Mode)');
const scollegato = (window.bersagliPiazzamento || []).find(x => x.unita.id === 'sano');
ok(scollegato && scollegato.ammesso === true,
   'con la funzione scollegata il nemico sano PASSA: quindi il modulo la usa davvero');
M.bersaglioAmmessoDaArma = vera;

console.log('\n=== 5. vietatoInAro: le D-Charges non compaiono fra le armi ARO ===');
ok(v.vietatoInAro === true, 'il database lo dichiara');
const aro = M.armiARO({ alias: 'X', skills: '', states: {}, weapon: 'D-Charges' }, 'BS_ATTACK');
const armiAro = (aro.armi || aro || []).map(a => a.nome);
ok(armiAro.indexOf('D-Charges (Demolition Mode)') < 0, 'la Demolition Mode non è offerta in ARO');

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
