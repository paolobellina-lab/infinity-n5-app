// @versione 2026-09-23.1 | test_modulo_guidato.js | proprieta`: chat TEST
// Test end-to-end del modulo Guidato — node test_modulo_guidato.js
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
global.goToStep = () => {}; global.confirmMultiAro = () => {};

require('./catalogo_n5.js'); require('./database_comune.js');
const M = require('./motore_regole_n5.js');
require('./ordine_attacco_guidato.js');

const rem     = { id: 'n1', alias: 'Missile REM', bs: 12, weapon: 'Missile Launcher, Light Shotgun', skills: 'BS Attack (Guided)' };
const senzaSk = { id: 'n2', alias: 'Tuttofare',   bs: 11, weapon: 'Missile Launcher', skills: '' };

M._fazione = 'NOMADI';
M._rosterProprio = [rem, senzaSk];
M._rosterNemico = [
    { id: 'p1', alias: 'Designato', tipo: 'TAG', states: { targeted: true } },
    { id: 'p2', alias: 'Vicino',    tipo: 'LI',  states: {} },
    { id: 'p3', alias: 'Altro',     tipo: 'LI',  states: {} },
    { id: 'p4', alias: 'Croc Man',  tipo: 'LI',  deployState: 'CAMO', states: { camo: true } }
];

function nuovo(u) {
    window.currentOrder = {}; window.coordUnits = [u]; window.coordIndex = 0;
    window.coordPayloads = []; window.combatTargets = []; window.coordMode = false;
    window.primaryGuidedTarget = null; window.secondaryGuidedTargets = [];
    inviato = null; alertUltimo = null;
}

console.log('\n=== 1. ERRORE CORRETTO: l arma non è più inventata ===');
nuovo(rem);
window.avviaFaseGuidato('ATTACCO GUIDATO', false);
let h = nodo('weapon-buttons-container').innerHTML;
ok(!h.includes('Smart Missile'), 'niente "Smart Missile (Guided)", che nel database non esiste');
ok(h.includes('Missile Launcher (Blast'), 'offre le Blast Mode reali dell arma');
ok(h.includes('Missile Launcher (Hit Mode)') && h.includes('Impact Template'),
   'la Hit Mode è esclusa col motivo: non ha il Tratto Impact Template');
ok(h.includes('Impact Template'), 'la motivazione dell esclusione cita il Tratto richiesto');

console.log('\n=== 2. ERRORE CORRETTO: la Skill è un requisito ===');
nuovo(senzaSk);
window.startUnitGuidatoLoop();
h = nodo('weapon-buttons-container').innerHTML;
ok(h.includes('non ha "BS Attack (Guided)"'), 'senza la Skill: avviso a schermo');

console.log('\n=== 3. Primario Bersagliato, secondari no ===');
nuovo(rem);
window.currentOrder.weapon = 'Missile Launcher (Blast Mode)';
window.renderSelezioneBersagliGuidato();
h = nodo('enemy-target-buttons').innerHTML;
ok(nodo('primary-guided-container').innerHTML.includes('Designato'), 'il Bersagliato è offerto come Primario');
ok(!nodo('primary-guided-container').innerHTML.includes('Vicino'), 'un non-Bersagliato NON è offerto come Primario');
ok(nodo('secondary-guided-container').innerHTML.includes('Vicino'), 'ma sì come Secondario');
ok(!nodo('secondary-guided-container').innerHTML.includes('Croc Man'), 'il Marker resta escluso');

window.confermaBersagliSagomaGuidato();
ok(alertUltimo && alertUltimo.includes('Bersaglio Primario'), 'senza Primario: bloccato');

window.togglePrimaryGuided('p1');
window.toggleSecondaryGuided('p2');
window.confermaBersagliSagomaGuidato();
ok(window.pendingTargets.length === 2 && window.pendingTargets[0].id === 'p1',
   'confermati: Primario in testa, poi i secondari');

console.log('\n=== 4. ERRORE CORRETTO: la gittata non viene più buttata via ===');
window.combatTargets = [
    { id: 'p1', name: 'Designato', burst: 0 },
    { id: 'p2', name: 'Vicino', burst: 0 }
];
window.preparaModificatoriGuidati();
const arma = M.profiloArma('Missile Launcher (Blast Mode)');
ok(window.combatTargets[0].rangeMod === arma.bands[0].mod,
   `banda iniziale reale (${window.combatTargets[0].rangeMod}), non 0 fittizio`);
window.setTargetRangeGuidato(3);
ok(window.combatTargets[0].rangeMod === 3 && window.combatTargets[1].rangeMod === 3,
   'la gittata del Primario si applica anche ai secondari: la Sagoma è una sola');

console.log('\n=== 5. MOD: gittata + Bersagliato, niente mimetismo né copertura ===');
const r = M.regoleGuidato(arma, { rangeIndex: 3 });
ok(r.modGittata === 3 && r.bonusBersagliato === 3 && r.modTotale === 6,
   'banda 3 (24-32") +3 e Bersagliato +3 = +6', `ottenuto ${r.modTotale}`);
ok(arma.bands.length === 12, 'il Missile Launcher ha 12 bande fino a 96"');
ok(r.ignoraMimetismo && r.ignoraCopertura, 'Mimetismo e Copertura ignorati');
ok(r.richiedeLoF === false, 'non richiede LoF');
ok(r.coperturaAnnullaSalvezza, 'chi è colpito dalla Sagoma non ha il +3 al Tiro Salvezza');
ok(r.soloPrimarioInF2F && r.criticoSoloSulPrincipale, 'solo il Primario fa il F2F; Critico solo su di lui');

console.log('\n=== 6. Burst dall arma, non scritto a mano ===');
ok(r.burst === arma.burst, `Burst ${r.burst} dalla Blast Mode`);
ok(window.combatTargets[0].burst === arma.burst && window.combatTargets[1].burst === 0,
   'i dadi vanno al Primario; i secondari non tirano');

console.log('\n=== 7. Schermata ===');
h = nodo('targets-allocation-container').innerHTML;
ok(h.includes('MOD totale'), 'il MOD totale è scomposto a schermo');
ok(h.includes('linea retta'), 'la regola della misura in linea retta è scritta');
ok(h.includes('Schivata a PH-3') && h.includes('Reset a WIP-3'), 'la reazione del bersaglio è indicata');
ok(h.includes('successo normale'), 'sui secondari il Critico vale come successo normale');

console.log('\n=== 8. Invio ===');
window.eseguiCalcoloGuidato();
ok(inviato !== null, 'spedito');
const a = inviato && inviato.attacchi[0];
ok(a && a.azione === M.AZIONI.GUIDATO, 'azione canonica');
ok(a && a.arma.nome === 'Missile Launcher (Blast Mode)', 'l arma nel payload è quella vera');
ok(a && a.bersagli[0].rangeMod === 3, 'la gittata scelta arriva all Hub');
ok(a && a.regole.modTotale === 6, 'MOD totale nel payload');

nuovo(rem);
window.currentOrder.weapon = 'Missile Launcher (Blast Mode)';
window.combatTargets = [{ id: 'p2', name: 'Vicino', burst: 1, rangeIndex: 0, rangeMod: -3 }];
window.eseguiCalcoloGuidato();
ok(inviato === null, 'Primario non Bersagliato: invio bloccato');

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
