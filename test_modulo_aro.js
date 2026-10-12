// @versione 2026-09-23.1 | test_modulo_aro.js | proprieta`: chat TEST
// Test end-to-end del turno reattivo — node test_modulo_aro.js
global.window = global;
let passati = 0, falliti = 0;
function ok(c, n, e) { if (c) { passati++; console.log(`  ✅ ${n}`); } else { falliti++; console.log(`  ❌ ${n}${e ? '\n       ' + e : ''}`); } }

const el = {};
function nodo(id) { return el[id] || (el[id] = { id, innerHTML: '', innerText: '', style: {},
    appendChild() {}, remove() {}, cloneNode() { return nodo(id + '_c'); }, parentNode: { replaceChild() {} } }); }
global.document = { title: 'NOMADS', getElementById: (i) => nodo(i), querySelector: () => nodo('btn'),
    querySelectorAll: () => [], createElement: () => ({ style: {}, innerHTML: '', appendChild() {} }) };
global.alert = () => {}; global.confirm = () => true;
global.scrollTo = () => {};
let rispostaAro = null; global.inviaRispostaAro = (p) => { rispostaAro = p; };

require('./catalogo_n5.js'); require('./database_comune.js');
const M = require('./motore_regole_n5.js');
require('./logica_aro.js');

const alguacil = { id: 'n1', alias: 'Alguacil', bs: 11, ph: 10, wip: 12,
                   weapon: 'Combi Rifle, Knife', skills: '', states: {} };
const sniper   = { id: 'n2', alias: 'Cecchino', bs: 12, ph: 10, wip: 12,
                   weapon: 'MULTI Sniper Rifle', skills: '', states: {} };
const soppress = { id: 'n3', alias: 'Mitragliere', bs: 11, ph: 10, wip: 12,
                   weapon: 'Heavy Machine Gun', skills: '', states: { suppressive: true } };
const hacker   = { id: 'n4', alias: 'Interventor', bs: 11, ph: 10, wip: 14,
                   weapon: 'Pistol', skills: 'Hacker, Hacking Device', states: {} };
const killer   = { id: 'n5', alias: 'Assassino', bs: 11, ph: 11, wip: 13,
                   weapon: 'Pistol', skills: 'Hacker, Killer Hacking Device', states: {} };
const ko       = { id: 'n6', alias: 'Caduto', state: 'UNCONSCIOUS', states: { unconscious: true } };

global.roster = [alguacil, sniper, soppress, hacker, killer, ko];
M._fazione = 'NOMADI';
M._rosterProprio = global.roster;
M._rosterNemico = [{ id: 'p1', alias: 'Fusilier', tipo: 'LI', states: {} }];

function nuovo(attacco) {
    window.currentAttackData = attacco || { attaccanti: ['Fusilier'], azione: 'ATTACCO BS' };
    window.selectedAroUnits = []; window.currentAroIndex = 0;
    window.aroReactions = []; window.aroCurrentConfig = {}; window.aroSfMode = false;
    rispostaAro = null;
}

console.log('\n=== 1. IL CRASH: Schivata e Reset senza arma ===');
nuovo();
window.selectedAroUnits = ['n1'];
window.avviaCicloAroUnita();
let crash = null;
try { window.selezionaAzioneAro('DODGE'); } catch (e) { crash = e; }
ok(crash === null, 'Schivata senza arma: nessun crash', crash && crash.message);
ok(nodo('aro-modifiers-content').innerHTML.includes('PH 10'), 'e mostra il valore di Schivata calcolato');

crash = null;
window.avviaCicloAroUnita();
try { window.selezionaAzioneAro('RESET'); } catch (e) { crash = e; }
ok(crash === null, 'Reset senza arma: nessun crash', crash && crash.message);
ok(nodo('aro-modifiers-content').innerHTML.includes('WIP 12'), 'e mostra il valore di Reset');

console.log('\n=== 2. MOD calcolati (prima erano solo interruttori) ===');
window.avviaCicloAroUnita();
window.selezionaAzioneAro('DODGE');
ok(window.aroCurrentConfig.valoreSuccesso === 10, 'con LoF: PH 10');
window.toggleAroLoF();
ok(window.aroCurrentConfig.valoreSuccesso === 7, 'senza LoF: PH 7, calcolato non solo segnalato');

console.log('\n=== 3. Vocabolario ARO tradotto dal motore ===');
ok(M.aroAdAzione('DODGE') === M.AZIONI.SCHIVATA, 'DODGE -> SCHIVATA');
ok(M.aroAdAzione('BS_ATTACK') === M.AZIONI.BS_ATTACK, 'BS_ATTACK -> ATTACCO BS');
ok(M.azioneAdAro(M.AZIONI.SCHIVATA) === 'DODGE', 'e nel senso inverso');

console.log('\n=== 4. Filtro azioni ARO ===');
let poss = M.azioniAroPossibili(alguacil, 'HACKING');
ok(!poss.find(a => a.id === 'DODGE').ammesso, 'contro un Attacco Comms la Schivata non serve');
ok(poss.find(a => a.id === 'RESET').ammesso, 'ma il Reset sì');
poss = M.azioniAroPossibili(alguacil, 'ATTACCO BS');
ok(poss.find(a => a.id === 'DODGE').ammesso, 'contro un BS: Schivata sì');
ok(!poss.find(a => a.id === 'RESET').ammesso, 'Reset no');
ok(!M.azioniAroPossibili(alguacil, null).find(a => a.id === 'HACKING').ammesso,
   'un non-hacker non ha l ARO di Hacking');
ok(M.azioniAroPossibili(ko, null).every(a => !a.ammesso), 'un Incosciente non dichiara ARO');

console.log('\n=== 5. LA SOPPRESSIONE, che in ARO non esisteva ===');
nuovo();
window.selectedAroUnits = ['n3'];
window.avviaCicloAroUnita();
window.selezionaAzioneAro('BS_ATTACK');
let h = nodo('aro-weapon-list').innerHTML;
ok(h.includes('SF Mode') || h.includes('SOPPRESSIONE'), 'la schermata segnala il profilo SF Mode');
ok(h.includes('Heavy Machine Gun (SF Mode)'), 'l arma è offerta in SF Mode');
ok(h.includes('B3'), 'con Burst 3');

window.selezionaArmaAro('Heavy Machine Gun (SF Mode)');
window.selezionaBersaglioAro('Fusilier');
ok(window.aroCurrentConfig.burst === 3, 'il Burst in ARO è 3, non 1');
ok(nodo('aro-modifiers-content').innerHTML.includes('bersaglio solo'),
   'e il vincolo "tutto su un bersaglio solo" è mostrato');

nuovo();
window.selectedAroUnits = ['n1'];
window.avviaCicloAroUnita();
window.selezionaAzioneAro('BS_ATTACK');
window.selezionaArmaAro('Combi Rifle');
window.selezionaBersaglioAro('Fusilier');
ok(window.aroCurrentConfig.burst === 1, 'senza Soppressione il Burst in ARO resta 1');

console.log('\n=== 6. Espansione armi dal database (quinta copia eliminata) ===');
nuovo();
window.selectedAroUnits = ['n2'];
window.avviaCicloAroUnita();
window.selezionaAzioneAro('BS_ATTACK');
h = nodo('aro-weapon-list').innerHTML;
const modi = (h.match(/MULTI Sniper Rifle \(/g) || []).length;
ok(modi >= 3, `MULTI Sniper espansa nelle sue modalità (${modi})`);
ok(h.includes('Knife') === false, 'il coltello non è offerto per un ARO a distanza');

console.log('\n=== 7. Hacking ARO: programmi per dispositivo ===');
nuovo({ attaccanti: ['Fusilier'], azione: 'ATTACCO BS' });
window.selectedAroUnits = ['n4'];
window.avviaCicloAroUnita();
window.selezionaAzioneAro('HACKING');
h = nodo('aro-weapon-list').innerHTML;
ok(h.includes('CARBONITE') && h.includes('SPOTLIGHT'), 'Hacking Device: i suoi programmi');
ok(!h.includes('TRINITY'), 'niente Trinity (prima ne mostrava 3 fissi uguali per tutti)');

nuovo();
window.selectedAroUnits = ['n5'];
window.avviaCicloAroUnita();
window.selezionaAzioneAro('HACKING');
h = nodo('aro-weapon-list').innerHTML;
ok(h.includes('TRINITY') && !h.includes('CARBONITE'), 'Killer Hacking Device: solo Trinity');

console.log('\n=== 8. Munizioni: "E/M" non si spezza più ===');
ok(M.opzioniMunizioni('E/M').length === 1, '"E/M" resta intera');
ok(M.opzioniMunizioni('N/A').length === 1, '"N/A" resta intera');

console.log('\n=== 9. Invio ===');
nuovo();
window.selectedAroUnits = ['n1'];
window.avviaCicloAroUnita();
window.selezionaAzioneAro('DODGE');
window.salvaAroCorrente();
ok(rispostaAro !== null, 'risposta ARO spedita');
const r = rispostaAro && rispostaAro.reazioni[0];
ok(r && r.azione === 'DODGE', 'vocabolario ARO conservato per l Hub');
ok(r && r.azioneAttiva === M.AZIONI.SCHIVATA, 'con la traduzione affiancata');
ok(r && r.valoreSuccesso === 10, 'e il valore calcolato');
ok(rispostaAro.motoreVersione, 'la versione del motore è tracciata nel payload');

console.log('\n=== 10. Il ponte è chiuso ===');
ok(typeof window.getWeaponProfile === 'undefined',
   'window.getWeaponProfile non esiste più: nessuno la installa');

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
