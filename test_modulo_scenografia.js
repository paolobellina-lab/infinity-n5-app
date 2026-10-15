// @versione 2026-09-22.1 | test_modulo_scenografia.js | proprieta`: chat TEST
// Test end-to-end del modulo scenografia — node test_modulo_scenografia.js
global.window = global;
let passati = 0, falliti = 0;
function ok(c, n, e) { if (c) { passati++; console.log(`  ✅ ${n}`); } else { falliti++; console.log(`  ❌ ${n}${e ? '\n       ' + e : ''}`); } }

const el = {};
function nodo(id) { return el[id] || (el[id] = { id, innerHTML: '', innerText: '', style: {},
    appendChild() {}, remove() {}, cloneNode() { return nodo(id + '_c'); }, parentNode: { replaceChild() {} } }); }
global.document = { title: 'NOMADS', getElementById: (i) => nodo(i),
    querySelector: () => nodo('btn'), querySelectorAll: () => [],
    createElement: () => ({ style: {}, innerHTML: '', appendChild() {} }) };
let alertUltimo = null; global.alert = (m) => { alertUltimo = m; };
let inviato = null; global.inviaCalcoloAllHub = (p) => { inviato = p; };
global.goToStep = () => {}; global.mostraTitoloUnitaCorrente = () => {};

require('./catalogo_n5.js'); require('./database_comune.js');
const M = require('./motore_regole_n5.js');
require('./ordine_scenografia.js');

// Scenografia vera soltanto: la torretta non e` scenografia (decisione di
// Paolo; chat REGOLE righe 6483-6510). La torretta nemica entra come
// Deployable dell'avversario, presa da DB_DEPLOYABLES: cosi` il test regge
// prima e dopo che DATABASE la toglie da DB_STRUTTURE.
const torrettaNemica = Object.assign({}, window.DB_DEPLOYABLES.find(d => d.id === 'armed_turret'),
    { id: 'tor', states: {} });
const strutture = window.DB_STRUTTURE.filter(s => String(s.tipo).toUpperCase() !== 'TORRETTA').map((s, i) =>
    Object.assign({}, s, { id: 'sc' + i, alias: s.nome, state: 'ACTIVE', neutrale: true }));
M._statoGioco = { scenario: {
    nomads:     { strutture: [], terreni: [], deployables: [{ id: 'mia', nome: 'Mina AP', arm: 0, str: 1, states: {} }] },
    panoceania: { strutture: strutture, terreni: [], deployables: [
        { id: 'sua1', nome: 'Mina Shock', arm: 0, str: 1, states: {} },
        { id: 'camo', nome: 'Mina E/M', arm: 0, str: 1, states: { camo: true } },
        { id: 'rip',  nome: 'Deployable Repeater', arm: 0, str: 1, states: {} },
        torrettaNemica] }
} };
M._fazione = 'NOMADI';
const zero = { id: 'n1', alias: 'Zero', wip: 13, skills: 'Deactivator', states: {} };
const disco = { id: 'n2', alias: 'Discone', wip: 12, skills: 'Deactivator, Disco Baller', states: {} };
M._rosterProprio = [zero, disco];

function nuovo(u, azione) {
    window.currentOrder = {}; window.coordUnits = [u]; window.coordIndex = 0;
    window.coordPayloads = []; window.combatTargets = []; window.pendingTargets = [];
    window.scenografiaDiscoBall = false; window.coordMode = false;
    inviato = null; alertUltimo = null;
    Object.keys(el).forEach(k => { el[k].innerHTML = ''; });
    window.avviaFaseScenografia(azione, false);
}

console.log('\n=== 1. Il modulo esiste: il router non trova più il vuoto ===');
ok(typeof window.avviaFaseScenografia === 'function', 'avviaFaseScenografia definita');

console.log('\n=== 2. INTERAGIRE: solo gli Objective, e sono NEUTRI ===');
nuovo(zero, 'INTERAGIRE OBIETTIVO');
ok(window.validTargets.length === 3, `tre Objective (${window.validTargets.length})`);
ok(window.validTargets.every(u => M.eScenografia(u)), 'tutti elementi scenici');
ok(window.targetsScartati.some(t => /Porta Blindata/.test(t.nome)),
   'una porta non è un Objective: esclusa col motivo');
let h = nodo('enemy-target-buttons').innerHTML;
ok(/contatto di Silhouette/.test(h), 'e la schermata ricorda che serve il contatto');

console.log('\n=== 3. DEACTIVATOR: solo i dispositivi NEMICI ===');
nuovo(zero, 'DEACTIVATOR');
const nomi = window.validTargets.map(u => u.nome || u.alias);
ok(nomi.includes('Mina Shock'), 'la mina nemica scoperta: bersagliabile');
ok(nomi.includes('Deployable Repeater'), 'il ripetitore nemico: bersagliabile');
ok(!nomi.includes('Mina AP'), 'la MIA mina: non bersagliabile');
ok(window.targetsScartati.some(t => /Mina AP/.test(t.nome) && /tuo dispositivo/.test(t.motivo)),
   'e il motivo lo dice');
ok(!nomi.includes('Mina E/M'), 'la mina nemica MIMETIZZATA: non bersagliabile');
ok(window.targetsScartati.some(t => /Mina E\/M/.test(t.nome) && /Marker Mimetici/.test(t.motivo)),
   'col motivo giusto: va Scoperta prima');
ok(nomi.includes('Armed Turret'), 'e la torretta nemica, che è Deployable');
h = nodo('enemy-target-buttons').innerHTML;
ok(/Linea di Tiro non serve/.test(h), 'la schermata dice che basta la ZdC');

console.log('\n=== 4. Le due azioni hanno tiri diversi ===');
nuovo(zero, 'DEACTIVATOR');
window.scegliBersaglioScenografia('rip');
h = nodo('targets-allocation-container').innerHTML;
ok(/range-seg/.test(h), 'DEACTIVATOR: ha il selettore di gittata');
ok(window.scenografiaEsito.valore === 19, `WIP 13 +6 a 0-8" = 19 (ottenuto ${window.scenografiaEsito.valore})`);

nuovo(zero, 'INTERAGIRE OBIETTIVO');
window.scegliBersaglioScenografia('sc1');
h = nodo('targets-allocation-container').innerHTML;
ok(!/range-seg/.test(h), 'INTERAGIRE: nessuna gittata');
ok(window.scenografiaEsito.valore === 13, 'e il tiro è il WIP nudo');
ok(window.scenografiaEsito.note.some(n => /Regola di Scenario/.test(n)),
   'con la nota che il tiro lo detta lo Scenario, non il calcolatore');

console.log('\n=== 5. Le gittate del Deactivator ===');
nuovo(zero, 'DEACTIVATOR');
window.scegliBersaglioScenografia('rip');
[[0, 19], [1, 16], [2, 7]].forEach(function (c) {
    window.setRangeScenografia(c[0]);
    ok(window.scenografiaEsito.valore === c[1],
       `banda ${c[0]}: ${c[1]} (ottenuto ${window.scenografiaEsito.valore})`);
});

console.log('\n=== 6. Disco Baller: solo a chi ce l ha ===');
nuovo(zero, 'DEACTIVATOR');
window.scegliBersaglioScenografia('rip');
ok(!/DISCO BALL/.test(nodo('targets-allocation-container').innerHTML),
   'Zero non ha Disco Baller: nessun interruttore');
nuovo(disco, 'DEACTIVATOR');
window.scegliBersaglioScenografia('rip');
ok(/DISCO BALL/.test(nodo('targets-allocation-container').innerHTML),
   'Discone sì: l interruttore c è');
const prima = window.scenografiaEsito.valore;
window.toggleDiscoBall();
ok(window.scenografiaEsito.valore === prima + 3, 'e dà +3 al WIP');

console.log('\n=== 7. Invio ===');
nuovo(zero, 'DEACTIVATOR');
window.scegliBersaglioScenografia('rip');
window.eseguiCalcoloScenografia();
ok(inviato !== null, 'spedito');
let a = inviato && inviato.attacchi[0];
ok(a && a.azione === 'DEACTIVATOR', 'azione canonica');
ok(a && a.regole.attributo === 'WIP' && a.regole.nonOffensivo === true,
   'l Hub sa che è un tiro WIP non offensivo');
ok(a && a.regole.valoreSuccesso === 19, 'col valore calcolato');

nuovo(zero, 'INTERAGIRE OBIETTIVO');
window.scegliBersaglioScenografia('sc1');
window.eseguiCalcoloScenografia();
a = inviato && inviato.attacchi[0];
ok(a && a.azione === 'INTERAGIRE OBIETTIVO', 'e per l interazione idem');

console.log('\n=== 8. Senza bersaglio si ferma ===');
nuovo(zero, 'DEACTIVATOR');
window.combatTargets = [];
window.preparaModificatoriScenografia();
ok(alertUltimo && /Nessun bersaglio/.test(alertUltimo), 'si ferma e lo dice');

console.log('\n=== 9. Il router lo instrada, e non è più fra i mancanti ===');
const core = require('fs').readFileSync('./motore_core.js', 'utf8');
ok(/avviaFaseScenografia/.test(core), 'il router lo chiama');
ok(/INTERAGIRE OBIETTIVO/.test(core) && /DEACTIVATOR/.test(core), 'per entrambe le azioni');

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
