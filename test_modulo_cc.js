// @versione 2026-09-23.1 | test_modulo_cc.js | proprieta`: chat TEST
// Test end-to-end del modulo CC — node test_modulo_cc.js
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
require('./ordine_attacco_cc.js');

const maestro  = { id: 'n1', alias: 'Maestro',  cc: 23, weapon: 'CC Weapon, Combi Rifle', skills: 'Martial Arts L3' };
const nbw      = { id: 'n2', alias: 'Belva',    cc: 21, weapon: 'CC Weapon', skills: 'Natural Born Warrior' };
const confuso  = { id: 'n3', alias: 'Confuso',  cc: 15, weapon: 'CC Weapon', skills: 'BS Attack (+1B)' };
const bruto    = { id: 'n4', alias: 'Bruto',    cc: 18, weapon: 'CC Weapon', skills: 'CC Attack (+1B)' };

M._fazione = 'NOMADI';
M._rosterProprio = [maestro, nbw, confuso, bruto];
M._rosterNemico = [
    { id: 'p1', alias: 'Allievo',  tipo: 'LI', cc: 21, skills: 'Martial Arts L1', states: {} },
    { id: 'p2', alias: 'Caduto',   tipo: 'LI', cc: 13, state: 'UNCONSCIOUS', states: { unconscious: true } },
    { id: 'p3', alias: 'Tenace',   tipo: 'LI', cc: 13, skills: 'Dogged', state: 'UNCONSCIOUS', states: { unconscious: true } },
    { id: 'p4', alias: 'Sleale',   tipo: 'LI', cc: 20, skills: 'CC Attack (-3)', states: {} },
    { id: 'p5', alias: 'Croc Man', tipo: 'LI', deployState: 'CAMO', states: { camo: true } }
];
const arma = M.profiloArma('CC Weapon');

function nuovo(u) {
    window.currentOrder = {}; window.coordUnits = [u]; window.coordIndex = 0;
    window.coordPayloads = []; window.combatTargets = []; window.coordMode = false;
    window.ccAlleatiIngaggiati = 0; inviato = null; alertUltimo = null;
}

console.log('\n=== 1. L esempio ufficiale della wiki: MA L3 vs MA L1 ===');
const e1 = M.modCC(maestro, M._rosterNemico[0], arma, { inF2F: true });
ok(e1.valore === 23, `SV = 23 (23 +3 -3) — ottenuto ${e1.valore}`);
const e1r = M.modCC(M._rosterNemico[0], maestro, arma, { inF2F: true });
ok(e1r.valore === 18, `reattivo: SV = 18 (21 -3) — ottenuto ${e1r.valore}`);
const b1 = M.burstCC(maestro, arma, {});
ok(b1.valore === 1 && b1.sd === 1, 'MA L3: Burst 1 + 1 dado SD (il SD non aumenta il Burst)');

console.log('\n=== 2. Tabella Martial Arts completa ===');
[[1, 0, 0, 0], [2, 3, 0, 0], [3, 3, 0, 1], [4, 3, 1, 0], [5, 3, 1, 1]].forEach(function (r) {
    const u = { cc: 20, weapon: 'CC Weapon', skills: `Martial Arts L${r[0]}` };
    const mo = M.modCC(u, { cc: 20 }, arma, { inF2F: true });
    const bu = M.burstCC(u, arma, {});
    ok(mo.mod === r[1] && (bu.valore - 1) === r[2] && bu.sd === r[3],
       `L${r[0]}: attacco ${r[1] >= 0 ? '+' : ''}${r[1]}, burst +${r[2]}, SD ${r[3]}`,
       `ottenuto mod=${mo.mod} burst=+${bu.valore - 1} sd=${bu.sd}`);
});

console.log('\n=== 3. Natural Born Warrior ===');
const senzaNbw = M.modCC({ cc: 21, weapon: 'CC Weapon', skills: '' }, M._rosterNemico[0], arma, { inF2F: true });
ok(senzaNbw.valore === 18, 'senza NBW: 21 -3 = 18');
const conNbw = M.modCC(nbw, M._rosterNemico[0], arma, { inF2F: true });
ok(conNbw.valore === 21 && conNbw.note.some(n => n.includes('Natural Born Warrior')),
   'con NBW: il -3 delle MA nemiche è annullato');

console.log('\n=== 4. ERRORE CORRETTO: il (+1B) letto alla cieca ===');
const bConfuso = M.burstCC(confuso, arma, {});
ok(bConfuso.valore === 1, 'un "BS Attack (+1B)" NON dà dadi in mischia (prima li dava)');
const bBruto = M.burstCC(bruto, arma, {});
ok(bBruto.valore === 2, 'un "CC Attack (+1B)" invece sì');
const bAro = M.burstCC(bruto, arma, { inARO: true });
ok(bAro.valore === 1, 'e solo in Turno Attivo: in ARO no');

console.log('\n=== 5. Close Combat with Multiple Troopers (il Gang-Up) ===');
ok(M.burstCC(nbw, arma, { alleatiIngaggiati: 2 }).valore === 3, '2 alleati nella mischia: +2B');
ok(M.burstCC(maestro, arma, { alleatiIngaggiati: 9 }).valore === 6, 'il massimo di Burst 6 tiene');

console.log('\n=== 6. Colpo di Grazia ===');
const g1 = M.colpoDiGrazia(M._rosterNemico[1]);
ok(g1.applicabile && g1.senzaSalvezza, 'contro un Incosciente: Morto automatico, nessun Tiro Salvezza');
const g2 = M.colpoDiGrazia(M._rosterNemico[2]);
ok(!g2.applicabile && g2.bloccatoDaSkill, 'contro un Incosciente con Dogged: NON applicabile');
ok(!M.colpoDiGrazia(M._rosterNemico[0]).applicabile, 'contro un nemico in piedi: non si applica');

console.log('\n=== 7. Le notazioni negative del nemico valgono nel F2F ===');
const vsSleale = M.modCC(nbw, M._rosterNemico[3], arma, { inF2F: true });
// 🔴 Qui chi tira è un NATURAL BORN WARRIOR: ignora il CC Attack (-3) del
// nemico nel F2F di CC (righe 9270-9282, l'esempio lo nomina). Il test
// asseriva che lo subisse — il difetto segnalato dalla chat REGOLE.
ok(vsSleale.valore === 21, `NBW contro "CC Attack (-3)": lo ignora, resta 21 (ottenuto ${vsSleale.valore})`);
ok(vsSleale.note.some(n => /Natural Born Warrior/.test(n)), 'e la nota dice perché');
const vsSlealeNormale = M.modCC(nbw, M._rosterNemico[3], arma, { inF2F: false });
ok(vsSlealeNormale.valore === 21, 'in un Tiro Normale invece no');

console.log('\n=== 8. Schermata ===');
nuovo(maestro);
window.avviaFaseCC('ATTACCO CC', false);
let h = nodo('weapon-buttons-container').innerHTML;
ok(h.includes('Martial Arts L3'), 'il livello di Arti Marziali è mostrato');
ok(h.includes('CC Weapon') && !h.includes('>Combi Rifle<'), 'solo armi CC offerte');

window.currentOrder.weapon = 'CC Weapon';
window.combatTargets = [{ id: 'p1', name: 'Allievo', burst: 0 }];
window.preparaModificatoriCC();
h = nodo('targets-allocation-container').innerHTML;
ok(h.includes('Valore di Successo') && h.includes('>23<'),
   'il Valore di Successo calcolato è a schermo (prima diceva "calcola a mente")');
ok(h.includes('Martial Arts L1 del nemico'), 'il -3 nemico è spiegato voce per voce');
ok(h.includes('+1 SD'), 'il dado SD è segnalato');
ok(h.includes('Multiple Troopers'), 'il selettore alleati c è');
ok(!h.includes('range-seg') && !h.includes('COPERTURA'), 'niente gittata né copertura in CC');

nuovo(maestro);
window.currentOrder.weapon = 'CC Weapon';
window.combatTargets = [{ id: 'p2', name: 'Caduto', burst: 0 }];
window.preparaModificatoriCC();
ok(nodo('targets-allocation-container').innerHTML.includes('COLPO DI GRAZIA'),
   'contro un Incosciente la schermata mostra il Colpo di Grazia');

console.log('\n=== 9. Invio ===');
nuovo(maestro);
window.currentOrder.weapon = 'CC Weapon';
window.combatTargets = [{ id: 'p1', name: 'Allievo', burst: 0 }];
window.preparaModificatoriCC();
window.eseguiCalcoloCC();
ok(inviato !== null, 'spedito');
const a = inviato && inviato.attacchi[0];
ok(a && a.azione === M.AZIONI.CC_ATTACK, 'azione canonica');
ok(a && a.regole.martialArts === 3, 'il livello MA è nel payload');
ok(a && a.regole.perBersaglio[0].valoreSuccesso === 23, 'il Valore di Successo calcolato è nel payload');
ok(a && a.regole.ignoraGittata && a.regole.ignoraCopertura, 'il payload dice all Hub di ignorare gittata e copertura');

nuovo(maestro);
window.currentOrder.weapon = 'CC Weapon';
window.combatTargets = [{ id: 'generic1', name: 'Bersaglio Primario', burst: 1 }];
window.totalBurst = 1;
window.eseguiCalcoloCC();
ok(inviato === null, 'bersaglio fantasma: bloccato');

console.log('\n=== 10. Marker in CC ===');
nuovo(maestro);
window.currentOrder.weapon = 'CC Weapon';
window.setupTargetSelectionCC();
ok(!window.validTargets.some(u => u.id === 'p5'),
   'un Marker CAMO non è ingaggiabile: non ci si va a contatto base-base');
ok(window.validTargets.some(u => u.id === 'p2'), 'un Incosciente sì');

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
