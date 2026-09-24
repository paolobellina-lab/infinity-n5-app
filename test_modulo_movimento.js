// @versione 2026-09-23.1 | test_modulo_movimento.js | proprieta`: chat TEST
// Test end-to-end del modulo Movimento — node test_modulo_movimento.js
global.window = global;
let passati = 0, falliti = 0;
function ok(c, n, e) { if (c) { passati++; console.log(`  ✅ ${n}`); } else { falliti++; console.log(`  ❌ ${n}${e ? '\n       ' + e : ''}`); } }

const el = {};
function nodo(id) { return el[id] || (el[id] = { id, innerHTML: '', innerText: '', style: {},
    appendChild() {}, remove() {}, cloneNode() { return nodo(id + '_c'); }, parentNode: { replaceChild() {} } }); }
global.document = { title: 'NOMADS', getElementById: (i) => nodo(i), querySelector: () => nodo('btn'),
    querySelectorAll: () => [], createElement: () => ({ style: {}, innerHTML: '', appendChild() {} }) };
let alertUltimo = null; global.alert = (m) => { alertUltimo = m; };
let inviato = null, buste = 0; global.inviaCalcoloAllHub = (p) => { inviato = p; buste++; };
let allarme = null; global.inviaAllarmeAro = (p) => { allarme = p; };
let instradato = null; global.selectAction = (a, s) => { instradato = { azione: a, secondaMeta: s }; };

require('./catalogo_n5.js'); require('./database_comune.js');
const M = require('./motore_regole_n5.js');
require('./ordine_movimento.js');

const alguacil = { id: 'n1', alias: 'Alguacil', weapon: 'Combi Rifle', states: {} };
M._fazione = 'NOMADI';
M._rosterProprio = [alguacil];
M._rosterNemico = [{ id: 'p1', alias: 'Fusilier', tipo: 'LI', states: {} }];

function nuovo() {
    window.currentOrder = { unit: alguacil };
    window.coordUnits = [alguacil]; window.coordIndex = 0; window.coordPayloads = [];
    window.combatTargets = []; window.pendingTargets = []; window.coordMode = false;
    window.cautoFuoriLoF = false;
    inviato = null; buste = 0; allarme = null; instradato = null; alertUltimo = null;
}

console.log('\n=== 1. ERRORE CORRETTO: Arrampicarsi mancava dalla lista ===');
ok(M.azioneSenzaTiro('ARRAMPICARSI') !== null,
   'ARRAMPICARSI è riconosciuta come azione senza tiro (prima no)');
ok(M.azioneSenzaTiro('ARRAMPICARSI').tipo === 'LONG_SKILL', 'ed è un Abilità Lunga');
ok(M.azioneDaRisolvere('ARRAMPICARSI', 'ARRAMPICARSI') === null,
   'Arrampicarsi + Arrampicarsi: nessun calcolo da fare');

nuovo();
window.avviaFaseMovimento('ARRAMPICARSI', false);
ok(instradato === null, 'non viene instradata a un modulo che non esiste (prima: giro infinito)');
ok(nodo('calc-result').innerHTML.includes('CLIMB'), 'ordine chiuso con il nome corretto dell abilità');

console.log('\n=== 2. Altre azioni senza tiro riconosciute ===');
['MOVIMENTO', 'CAUTO', 'SALTO', 'IDLE', 'RICARICARE', 'ALLERTA', 'GUARDA_FUORI', 'PIAZZARE EQUIPAGGIAMENTO']
    .forEach(a => { if (!M.azioneSenzaTiro(a)) { falliti++; console.log(`  ❌ ${a} non riconosciuta`); } });
ok(true, 'tutte e 8 le abilità senza tiro sono a catalogo');
ok(M.azioneSenzaTiro('ATTACCO BS') === null, 'un attacco NON è fra le azioni senza tiro');

console.log('\n=== 3. Instradamento ===');
ok(M.azioneDaRisolvere('MOVIMENTO', 'ATTACCO BS') === 'ATTACCO BS', 'Movimento + BS: instrada il BS');
ok(M.azioneDaRisolvere('ATTACCO CC', 'MOVIMENTO') === 'ATTACCO CC', 'anche se l attacco è la prima metà');
ok(M.azioneDaRisolvere('MOVIMENTO', 'MOVIMENTO') === null, 'Movimento + Movimento: niente da risolvere');
ok(M.azioneDaRisolvere('SALTO', 'IDLE') === null, 'Salto + Idle: niente da risolvere');

nuovo();
window.currentOrder.action1 = 'MOVIMENTO';
window.avviaFaseMovimento('HACKING', true);
ok(instradato && instradato.azione === 'HACKING' && instradato.secondaMeta === true,
   'seconda metà instradata al modulo Hacking');

console.log('\n=== 4. Ordine di puro movimento ===');
nuovo();
window.currentOrder.action1 = 'MOVIMENTO';
window.avviaFaseMovimento('MOVIMENTO', true);
ok(inviato !== null, 'la busta vuota viene comunque spedita all Hub');
ok(inviato && inviato.attacchi.length === 0, 'con zero attacchi');
ok(instradato === null, 'nessun instradamento');
ok(nodo('calc-result').innerHTML.includes('REGISTRATO'), 'schermata di chiusura mostrata');

console.log('\n=== 5. ERRORE CORRETTO: il Movimento Cauto e gli ARO ===');
const dentro = M.generaAro('CAUTO', { fuoriLoFeZdC: false });
ok(dentro.genera === true, 'Cauto che inizia o finisce dentro LoF/ZdC: ARO come al solito');
const fuori = M.generaAro('CAUTO', { fuoriLoFeZdC: true });
ok(fuori.genera === false, 'Cauto fuori da LoF e ZdC di tutti i nemici: NESSUN ARO');
ok(fuori.motivo.includes('ZdC') || fuori.motivo.includes('LoF'), 'e la regola è citata');

// Flusso nuovo (ordine_movimento 2026-09-23.2): la domanda viene PRIMA, e
// finché non si risponde non parte niente — né allarme né busta all'Hub.
// La versione vecchia asseriva il contrario ("allarme inviato, prudente"),
// che era proprio il difetto: l'ARO partiva sempre come "dentro" e
// l'interruttore compariva dopo, quando non cambiava più nulla.
nuovo();
window.avviaFaseMovimento('CAUTO', false);
ok(allarme === null && buste === 0, `prima della risposta: nessun allarme e nessuna busta (${buste})`);
ok(nodo('targets-allocation-container').innerHTML.includes('CAUTO') ||
   nodo('calc-result').innerHTML.includes('CAUTO'), 'e la domanda è a schermo');

nuovo();
window.avviaFaseMovimento('CAUTO', false);
window.rispondiCauto(true, 'chiudi');
// Fuori da LoF e ZdC l'ARO non si genera proprio: l'allarme non parte, ma la
// busta all'Hub sì — l'ordine è finito e l'Hub deve saperlo.
ok(allarme === null, 'rispondendo FUORI: nessun allarme spedito');
ok(buste === 1, `e una sola busta all Hub (${buste})`);

nuovo();
window.avviaFaseMovimento('CAUTO', false);
window.rispondiCauto(false, 'chiudi');
ok(allarme !== null, 'rispondendo DENTRO: allarme spedito, come per un movimento qualunque');
ok(buste === 1, `e una busta sola anche qui (${buste})`);
ok(nodo('calc-result').innerHTML.includes('REGISTRATO'),
   'e l ordine si chiude: il Cauto è un Ordine Intero, non ha seconda metà');

// Controprova: un MOVIMENTO normale non chiede niente e parte subito.
nuovo();
window.avviaFaseMovimento('MOVIMENTO', false);
// Il MOVIMENTO come prima metà manda l'allarme e basta: la busta parte alla
// chiusura dell'ordine, non qui. Quello che conta è che non faccia domande.
ok(allarme !== null, 'controprova: il MOVIMENTO normale manda l allarme senza chiedere niente');
ok(!(nodo('targets-allocation-container').innerHTML + nodo('calc-result').innerHTML).includes('LoF E ZdC'),
   'e non mostra la domanda del Cauto');
// E la domanda non deve restare in giro dopo la risposta: ogni ordine riparte
// da capo (null = non chiesto), altrimenti il secondo Cauto erediterebbe la
// risposta del primo.
nuovo();
window.avviaFaseMovimento('CAUTO', false);
ok(window.cautoFuoriLoF === null || window.cautoFuoriLoF === undefined,
   `ogni ordine riparte senza risposta (${window.cautoFuoriLoF})`);

console.log('\n=== 6. Chi genera ARO ===');
// 🔴 L IDLE GENERA ARO. Il test asseriva il contrario, e col catalogo
// sbagliato passava: "A Trooper that declares Idle performs no action.
// As such, its declaration just activates the Trooper, potentially
// generating AROs." (regolamento, p.80)
// Conta perché l Idle è ciò che si dichiara quando non si soddisfano i
// requisiti di un Abilità: chi falliva un requisito non generava l ARO
// che spetta all avversario.
ok(M.generaAro('IDLE').genera === true, 'Idle: ARO sì, la dichiarazione attiva la truppa');
ok(M.generaAro('ALLERTA').genera === false, 'Allerta: nessun ARO');
ok(M.generaAro('MOVIMENTO').genera === true, 'Movimento normale: ARO sì');
ok(M.generaAro('ATTACCO BS').genera === true, 'un attacco: ARO sì');

console.log('\n=== 7. ERRORE CORRETTO: l azione nell allarme ARO ===');
nuovo();
window.currentOrder.action1 = 'MOVIMENTO';
window.currentOrder.action = 'ATTACCO BS';
window.preparaSecondaMeta('MOVIMENTO');
ok(allarme && allarme.azione === 'ATTACCO BS',
   'l avversario vede l ATTACCO, non solo "MOVIMENTO" (prima vedeva act1)');
ok(allarme && allarme.azionePrimaMeta === 'MOVIMENTO', 'ma la prima metà resta indicata');

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
