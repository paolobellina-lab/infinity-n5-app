// @versione 2026-09-23.1 | test_modulo_hacking.js | proprieta`: chat TEST
// Test end-to-end del modulo Hacking — node test_modulo_hacking.js
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
require('./ordine_hacking.js');

const interventor = { id: 'n1', alias: 'Interventor', wip: 14, skills: 'Hacker, Hacking Device' };
const killer      = { id: 'n2', alias: 'Assassino',   wip: 13, skills: 'Hacker, Killer Hacking Device' };
const plus        = { id: 'n3', alias: 'Interventor+', wip: 14, skills: 'Hacker, Hacking Device Plus' };
const evo         = { id: 'n4', alias: 'EVO Bot',     wip: 13, skills: 'Hacker, EVO Hacking Device' };

M._fazione = 'NOMADI';
M._rosterProprio = [interventor, killer, plus, evo];
M._rosterNemico = [
    { id: 'p1', alias: 'Fusilier',  tipo: 'LI',  states: {} },
    { id: 'p2', alias: 'Squalo',    tipo: 'TAG', bts: 6, states: {} },
    { id: 'p3', alias: 'Hacker Pano', tipo: 'LI', bts: 3, skills: 'Hacker, Hacking Device', states: {} },
    { id: 'p4', alias: 'Fugazi',    tipo: 'REM', bts: 0, states: {} },
    { id: 'p5', alias: 'Designato', tipo: 'REM', bts: 0, states: { targeted: true } },
    { id: 'p6', alias: 'Protetto',  tipo: 'TAG', bts: 6, skills: 'TinBot: Firewall (-6)', states: {} },
    { id: 'p7', alias: 'Croc Man',  tipo: 'LI',  deployState: 'CAMO', states: { camo: true } }
];

function nuovo(u) {
    window.currentOrder = {}; window.coordUnits = [u]; window.coordIndex = 0;
    window.coordPayloads = []; window.combatTargets = []; window.coordMode = false;
    inviato = null; alertUltimo = null;
}

console.log('\n=== 1. L ERRORE PRINCIPALE: i programmi dipendono dal dispositivo ===');
nuovo(interventor);
window.avviaFaseHacking('HACKING', false);
let h = nodo('weapon-buttons-container').innerHTML;
ok(h.includes('CARBONITE') && h.includes('OBLIVION') && h.includes('SPOTLIGHT') && h.includes('TOTAL CONTROL'),
   'Hacking Device: i suoi quattro programmi');
ok(!h.includes('>TRINITY<') && !/onclick="window.declareHackingAttack\('TRINITY'\)/.test(h),
   'Hacking Device: NIENTE Trinity (prima la offriva a tutti)');

nuovo(killer);
window.startUnitHackingLoop();
h = nodo('weapon-buttons-container').innerHTML;
ok(h.includes('TRINITY'), 'Killer Hacking Device: Trinity sì');
ok(!h.includes('CARBONITE'), 'Killer Hacking Device: niente Carbonite');
ok(h.includes('CYBERMASK'), 'e Cybermask è elencata fra i non-attacco');

nuovo(plus);
window.startUnitHackingLoop();
h = nodo('weapon-buttons-container').innerHTML;
ok(h.includes('WHITE NOISE'), 'Hacking Device Plus: White Noise riconosciuta (prima non esisteva)');

nuovo(evo);
window.startUnitHackingLoop();
h = nodo('weapon-buttons-container').innerHTML;
ok(h.includes('Nessun programma d\'attacco'), 'EVO: nessun programma d attacco');
ok(h.includes('ENHANCED REACTION'), 'ma i suoi Supportware sono elencati');

console.log('\n=== 2. Dati dei programmi ===');
const carb = M.armaDaProgramma('CARBONITE');
ok(carb.burst === 2 && carb.ps === 7 && carb.dimezzaBTS === false && carb.effetto === 'IMM-B',
   'Carbonite: B2, PS7, BTS pieno, IMM-B');
const spot = M.armaDaProgramma('SPOTLIGHT');
ok(spot.ps === 5 && spot.dimezzaBTS === true, 'Spotlight: PS5, BTS dimezzato');
const obl = M.armaDaProgramma('OBLIVION');
ok(obl.ps === 4 && obl.dimezzaBTS === true && obl.effetto === 'ISOLATO', 'Oblivion: PS4, BTS dimezzato, Isolato');
ok(M.risolviMunizione(carb.ammo).salvezze === 2, 'Carbonite usa DA: due Tiri Salvezza');
ok(M.risolviMunizione(spot.ammo).dimezza === true, 'Spotlight usa AP: attributo dimezzato');

console.log('\n=== 3. Filtro bersagli per programma ===');
nuovo(interventor);
window.currentOrder.weapon = 'SPOTLIGHT';
window.setupTargetSelectionHacking();
ok(window.validTargets.length === 6, `Spotlight colpisce chiunque tranne il Marker (${window.validTargets.length} validi)`);
ok(!window.validTargets.some(u => u.id === 'p7'), 'il Marker CAMO è escluso: solo Modelli sono bersagliabili');

window.currentOrder.weapon = 'CARBONITE';
window.setupTargetSelectionHacking();
ok(!window.validTargets.some(u => u.id === 'p1'), 'Carbonite: il Fusilier LI non è hackerabile');
ok(window.validTargets.some(u => u.id === 'p2'), 'ma il TAG sì');

window.currentOrder.weapon = 'TOTAL CONTROL';
window.setupTargetSelectionHacking();
ok(window.validTargets.every(u => u.tipo === 'TAG'), 'Total Control: solo TAG');

nuovo(killer);
window.currentOrder.weapon = 'TRINITY';
window.setupTargetSelectionHacking();
ok(window.validTargets.length === 1 && window.validTargets[0].id === 'p3', 'Trinity: solo Hacker nemici');

console.log('\n=== 4. MOD calcolati (prima la schermata non ne mostrava) ===');
const m1 = M.modHacking(interventor, M._rosterNemico[3], carb, {});
ok(m1.valore === 14 && m1.mod === 0, 'bersaglio normale: WIP 14 secco');
const m2 = M.modHacking(interventor, M._rosterNemico[4], carb, {});
ok(m2.valore === 17 && m2.voci.some(v => v.fonte === 'bersagliato'),
   'bersaglio Bersagliato: +3 WIP anche per gli attacchi Comms');
ok(M.valoreFirewall(M._rosterNemico[5]) === -6,
   'Firewall (-6): letto il valore vero, non un -3 fisso');
const m3 = M.modHacking(interventor, M._rosterNemico[5], carb, { firewallNemico: -6 });
ok(m3.valore === 8 && m3.note.some(n => n.includes('+3 BTS')),
   'Firewall -6: WIP 8, con nota sul +3 BTS alla salvezza del bersaglio');

console.log('\n=== 5. Schermata modificatori ===');
nuovo(interventor);
window.currentOrder.weapon = 'CARBONITE';
window.combatTargets = [{ id: 'p2', name: 'Squalo', burst: 0 }];
window.preparaModificatoriHacking();
h = nodo('targets-allocation-container').innerHTML;
ok(window.totalBurst === 2, 'Burst 2 dal programma, non dal database armi');
ok(h.includes('Valore di Successo'), 'il Valore di Successo è a schermo');
ok(h.includes('IMM-B'), 'l effetto del programma è mostrato');
ok(h.includes('PS 7') && h.includes('BTS pieno'), 'PS e trattamento del BTS mostrati');
ok(!h.includes('range-seg') && !h.includes('COPERTURA'), 'niente gittata né copertura');

console.log('\n=== 6. Invio ===');
window.eseguiCalcoloHacking();
ok(inviato !== null, 'spedito');
const a = inviato && inviato.attacchi[0];
ok(a && a.azione === M.AZIONI.HACKING, 'azione canonica');
ok(a && a.programma === 'CARBONITE', 'il programma è nel payload');
ok(a && a.regole.ps === 7 && a.regole.dimezzaBTS === false, 'PS e BTS nel payload');
ok(a && a.regole.perBersaglio[0].valoreSuccesso === 14, 'Valore di Successo calcolato nel payload');

nuovo(interventor);
window.currentOrder.weapon = 'CARBONITE';
window.combatTargets = [{ id: 'generic1', name: 'Bersaglio Primario', burst: 2 }];
window.totalBurst = 2;
window.eseguiCalcoloHacking();
ok(inviato === null, 'bersaglio fantasma: bloccato');

console.log('\n=== 7. Trinity: dati ora verificati sulla wiki ===');
nuovo(killer);
window.startUnitHackingLoop();
ok(!nodo('weapon-buttons-container').innerHTML.includes('non verificati'),
   'nessun avviso: i dati di Trinity sono confermati');
const tri = M.armaDaProgramma('TRINITY');
ok(tri.burst === 3 && tri.ps === 6 && tri.dimezzaBTS === false,
   'Trinity: B3, PS6, BTS pieno');
ok(M.modHacking(killer, M._rosterNemico[2], tri, {}).valore === killer.wip + 3,
   'e il +3 WIP del programma si applica');
const tot = M.armaDaProgramma('TOTAL CONTROL');
ok(tot.burst === 1 && tot.ps === 4 && tot.effetto === 'POSSEDUTO',
   'Total Control: B1, PS4, Posseduto');
ok(M.risolviMunizione(tot.ammo).salvezze === 2, 'e due Tiri Salvezza (munizione DA)');


console.log('\n=== 8. Due dispositivi sulla stessa truppa ===');
// Mary Problems e` l'unico profilo dei due database con due dispositivi, e
// fino al 23 settembre il dato era sbagliato: un solo Killer Hacking Device
// con dentro gli upgrade di entrambi. Corretto quello, e` venuto fuori che il
// motore ne leggeva comunque uno solo — il filtro scartava il nome piu` corto
// perche` contenuto nel piu` lungo.
require('./database_nomad.js'); require('./database_panoceania.js');
const TUTTI = [...(window.DB_NOMADI || []), ...(window.DB_PANOCEANIA || [])];
const mary = TUTTI.find(u => /^Mary Problems/.test(u.nome));
ok(!!mary && /Killer Hacking Device/.test(mary.equip || '') && /(^|,)\s*Hacking Device/.test(mary.equip || ''),
   'Mary Problems porta entrambi i dispositivi nel database');
const disp = M.dispositiviHacking(mary);
ok(disp.length === 2, 'e il motore li vede entrambi (' + JSON.stringify(disp) + ')');
const nomiProg = M.programmiAttacco(mary).programmi.map(p => p.nome).sort();
for (const atteso of ['TRINITY', 'CARBONITE', 'OBLIVION', 'SPOTLIGHT', 'TOTAL CONTROL']) {
    ok(nomiProg.indexOf(atteso) >= 0, `fra i programmi d attacco c'è ${atteso}`);
}
// Controprova: chi ha il solo Killer non ottiene i programmi del normale.
const zero = TUTTI.find(u => /Killer Hacking Device/.test(u.equip || '') && !/(^|,)\s*Hacking Device/.test(u.equip || ''));
const soloKhd = M.programmiAttacco(zero).programmi.map(p => p.nome);
ok(soloKhd.indexOf('CARBONITE') < 0 && soloKhd.indexOf('TRINITY') >= 0,
   `controprova: ${zero.nome.split(' (')[0]}, solo Killer: Trinity sì, Carbonite no`);
// Controprova sul filtro: "Killer Hacking Device" da solo non deve contare
// anche come "Hacking Device" — era la ragione per cui il filtro scartava.
ok(M.dispositiviHacking(zero).length === 1, 'e un Killer da solo resta UN dispositivo, non due');

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
