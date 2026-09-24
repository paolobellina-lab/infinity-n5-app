// @versione 2026-09-23.1 | test_modulo_intuitivo.js | proprieta`: chat TEST
// Test end-to-end del modulo Intuitivo — node test_modulo_intuitivo.js
global.window = global;

let passati = 0, falliti = 0;
function ok(c, n, e) { if (c) { passati++; console.log(`  ✅ ${n}`); } else { falliti++; console.log(`  ❌ ${n}${e ? '\n       ' + e : ''}`); } }

const el = {};
function nodo(id) {
    return el[id] || (el[id] = { id, innerHTML: '', innerText: '', style: {},
        appendChild() {}, remove() {}, cloneNode() { return nodo(id + '_c'); },
        parentNode: { replaceChild() {} } });
}
global.document = { title: 'NOMADS', getElementById: (i) => nodo(i),
    querySelector: () => nodo('btn'), querySelectorAll: () => [],
    createElement: () => ({ style: {}, innerHTML: '', appendChild() {} }) };
let alertUltimo = null; global.alert = (m) => { alertUltimo = m; };
let inviato = null; global.inviaCalcoloAllHub = (p) => { inviato = p; };
global.goToStep = (s) => { global.ultimoStep = s; };
global.confirmMultiAro = () => {};

require('./catalogo_n5.js'); require('./database_comune.js');
const M = require('./motore_regole_n5.js');
require('./ordine_attacco_intuitivo.js');

const lanciafiamme = { id: 'n1', alias: 'Moran', wip: 13, weapon: 'Light Flamethrower, Combi Rifle', states: {} };
const senzaSagoma  = { id: 'n2', alias: 'Alguacil', wip: 12, weapon: 'Combi Rifle, Pistol', states: {} };

M._fazione = 'NOMADI';
M._rosterProprio = [lanciafiamme, senzaSagoma];
M._rosterNemico = [
    { id: 'p1', alias: 'Croc Man', tipo: 'LI', deployState: 'CAMO', states: { camo: true } },
    { id: 'p2', alias: 'Speculo', tipo: 'LI', deployState: 'IMP', states: { impersonation: true } },
    { id: 'p3', alias: 'Fusilier', tipo: 'LI', states: {} },
    { id: 'p4', alias: 'Orc Morto', tipo: 'HI', state: 'DEAD', states: {} }
];

function nuovo(u) {
    window.currentOrder = {}; window.coordUnits = [u]; window.coordIndex = 0;
    window.coordPayloads = []; window.combatTargets = []; window.coordMode = false;
    window.intuitivoFuoriLoF = false; inviato = null; alertUltimo = null;
}

console.log('\n=== 1. Selezione arma: il limite del database è dichiarato ===');
nuovo(lanciafiamme);
window.avviaFaseIntuitivo('ATTACCO INTUITIVO', false);
let h = nodo('weapon-buttons-container').innerHTML;
ok(h.includes('Light Flamethrower'), 'lanciafiamme offerto');
ok(!h.includes('>Combi Rifle<'), 'Combi Rifle non offerto');
ok(!h.includes('dedotto'),
   'nessun avviso sui Tratti: ora vengono dal database, non dedotti');
ok(h.includes('Burst 1'), 'Burst 1 indicato già sul bottone');

nuovo(senzaSagoma);
window.startUnitIntuitivoLoop();
ok(nodo('weapon-buttons-container').innerHTML.includes('Nessuna arma utilizzabile'),
   'unità senza Sagome: nessuna arma offerta');

console.log('\n=== 2. ERRORE CORRETTO: il bersaglio dev essere Marker o fuori LoF ===');
nuovo(lanciafiamme);
window.currentOrder.weapon = 'Light Flamethrower';
window.setupTargetSelectionIntuitivo();
ok(window.validTargets.length === 2, `con LoF: solo i 2 Marker (trovati ${window.validTargets.length})`);
ok(window.validTargets.every(u => u.states.camo || u.states.impersonation), 'sono Croc Man e Speculo');
ok(window.targetsScartati.some(t => t.nome === 'Fusilier'),
   'il Fusilier in piena vista è escluso (prima era ammesso: non era legale)');
console.log('   ' + window.targetsScartati.map(t => `${t.nome}: ${t.motivo.slice(0, 55)}…`).join('\n   '));

window.toggleIntuitivoFuoriLoF();
ok(window.validTargets.length === 3,
   'dichiarando la Zona di Visibilità Zero: anche il Fusilier diventa bersagliabile');

console.log('\n=== 3. ERRORE CORRETTO: un solo Bersaglio Principale ===');
nuovo(lanciafiamme);
window.currentOrder.weapon = 'Light Flamethrower';
window.setupTargetSelectionIntuitivo();
window.scegliPrincipaleIntuitivo('p1');
ok(window.combatTargets.length === 1 && window.combatTargets[0].name === 'Croc Man', 'primo scelto');
window.scegliPrincipaleIntuitivo('p2');
ok(window.combatTargets.length === 1 && window.combatTargets[0].name === 'Speculo',
   'il secondo SOSTITUISCE il primo, non si accumula');

console.log('\n=== 4. ERRORE CORRETTO: il tiro è nudo ===');
window.preparaModificatoriIntuitivo();
h = nodo('targets-allocation-container').innerHTML;
ok(!h.includes('range-seg') && !h.includes('range-bar'),
   'nessun selettore di gittata (prima l Intuitivo non ne aveva, ma lo Speculativo sì per confronto)');
ok(!h.includes('COPERTURA'), 'nessun interruttore Copertura');
ok(h.includes('NESSUN MOD') || h.includes('non modificato'),
   'la schermata dice che NESSUN MOD si applica, non solo Mimetismo e Copertura');
ok(h.includes('WIP 13'), 'mostra il WIP dell unità');

console.log('\n=== 5. Regole Sagoma ereditate ===');
const regole = M.regoleIntuitivo(M.profiloArma('Light Flamethrower'));
ok(regole.reazione === 'FACCIA_A_FACCIA',
   'reazione F2F anche con Sagoma DIRETTA (l Intuitivo richiede un tiro)');
ok(M.regoleTemplate(M.profiloArma('Light Flamethrower')).reazione === 'TIRO_NORMALE',
   'lo stesso lanciafiamme in un BS normale darebbe invece un Tiro Normale');
ok(regole.criticoSoloSulPrincipale, 'Critico solo sul Principale');
ok(regole.coperturaAnnullaSalvezza, 'niente +3 al Tiro Salvezza per Copertura');
ok(regole.contaComeBsAttack && regole.plusUnSD === false,
   'conta come BS Attack per i MOD, ma niente +1 SD (è una Long Skill)');
ok(h.includes('Faccia a Faccia') && h.includes('Critico'), 'le regole sono spiegate a schermo');

console.log('\n=== 6. Invio ===');
window.eseguiCalcoloIntuitivo();
ok(inviato !== null, 'attacco valido spedito');
ok(inviato && inviato.attacchi[0].arma.burst === 1, 'Burst forzato a 1 nel payload');
ok(inviato && inviato.attacchi[0].azione === M.AZIONI.INTUITIVO, 'azione dal vocabolario canonico');
ok(inviato && inviato.attacchi[0].bersagli.length === 1, 'un solo bersaglio nel payload');

nuovo(lanciafiamme);
window.currentOrder.weapon = 'Light Flamethrower';
window.combatTargets = [];
window.preparaModificatoriIntuitivo();
ok(alertUltimo && alertUltimo.includes('Nessun Bersaglio Principale'),
   'senza bersaglio: si ferma e lo dice (nessun fantasma inventato)');

nuovo(lanciafiamme);
window.currentOrder.weapon = 'Light Flamethrower';
window.combatTargets = [{ id: 'p3', name: 'Fusilier', burst: 1 }];
window.eseguiCalcoloIntuitivo();
ok(inviato === null, 'Intuitivo su bersaglio in piena vista: BLOCCATO all invio');
console.log('   ' + String(alertUltimo).split('\n').filter(Boolean)[2]);

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
