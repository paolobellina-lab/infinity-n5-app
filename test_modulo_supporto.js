// @versione 2026-09-23.1 | test_modulo_supporto.js | proprieta`: chat TEST
// Test end-to-end del Supporto — node test_modulo_supporto.js
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
global.goToStep = () => {};

require('./catalogo_n5.js'); require('./database_comune.js');
const M = require('./motore_regole_n5.js');
require('./ordine_supporto.js');

const doc  = { id: 'n1', alias: 'Dottore',    wip: 14, bs: 11, w: 1, skills: 'Doctor', states: {} };
const eng  = { id: 'n2', alias: 'Ingegnere',  wip: 13, bs: 11, w: 1, skills: 'Engineer', states: {} };
const med  = { id: 'n3', alias: 'Paramedico', wip: 12, bs: 11, w: 1, skills: 'MediKit', states: {} };
const giz  = { id: 'n4', alias: 'Meccanico',  wip: 12, bs: 11, w: 1, skills: 'GizmoKit', states: {} };
const nulla= { id: 'n5', alias: 'Fante',      wip: 12, bs: 11, w: 1, skills: '', states: {} };

const feritoVita = { id: 'a1', alias: 'Ferito', w: 1, s: 2, ph: 10, skills: '', states: { unconscious: true } };
// `str` è la STR, `s` è la Silhouette. Questi dati di prova usavano `s`
// come STR — lo stesso errore che il motore aveva nel filtro, e per questo
// il test passava su un motore sbagliato.
const remSTR     = { id: 'a2', alias: 'Fugazi', str: 1, s: 1, ph: 8,  skills: '', states: { unconscious: true } };
const remImm     = { id: 'a3', alias: 'Bloccato', str: 1, s: 1, ph: 8, skills: '', states: { immobilizedB: true } };
const sano       = { id: 'a4', alias: 'Sano',   w: 1, s: 2, ph: 10, skills: '', states: {} };
const conPH      = { id: 'a5', alias: 'Duro',   w: 1, s: 2, ph: 9,  skills: 'MediKit (PH=12)', states: { unconscious: true } };

M._fazione = 'NOMADI';
M._rosterProprio = [doc, eng, med, giz, nulla, feritoVita, remSTR, remImm, sano, conPH];
M._rosterNemico = [{ id: 'p1', alias: 'Fusilier', states: {} }];

function nuovo(u) {
    window.currentOrder = {}; window.coordUnits = [u]; window.coordIndex = 0;
    window.coordPayloads = []; window.combatTargets = []; window.coordMode = false;
    window.supportoStrumento = null; window.supportoInContatto = true;
    inviato = null; alertUltimo = null;
}

console.log('\n=== 1. Il modulo esiste ===');
ok(typeof window.avviaFaseSupporto === 'function', 'avviaFaseSupporto definita (era l ultimo modulo mancante)');

console.log('\n=== 2. Quali strumenti ha l unità ===');
ok(M.strumentiSupporto(doc).length === 1 && M.strumentiSupporto(doc)[0].id === 'DOTTORE', 'Dottore');
ok(M.strumentiSupporto(nulla).length === 0, 'chi non ne ha, non ne ha');
nuovo(nulla);
window.avviaFaseSupporto('MEDICO_INGEGNERE', false);
ok(nodo('weapon-buttons-container').innerHTML.includes('non ha Dottore'),
   'e la schermata lo dice invece di offrire un tiro impossibile');

console.log('\n=== 3. CHI TIRA cambia, ed è la cosa più facile da sbagliare ===');
const eDoc = M.regoleSupporto(doc, feritoVita, 'DOTTORE', { inContatto: true });
ok(eDoc.chiTira === 'UTENTE' && eDoc.attributo === 'WIP' && eDoc.valore === 14,
   'Dottore: tira l UTENTE, su WIP 14');
const eMed = M.regoleSupporto(med, feritoVita, 'MEDIKIT', { inContatto: true });
ok(eMed.chiTira === 'BERSAGLIO' && eMed.attributo === 'PH' && eMed.valore === 10,
   'MediKit: tira il BERSAGLIO, su PH 10');
ok(eMed.nomeChiTira === 'Ferito', 'e il nome di chi tira è quello del bersaglio');
ok(eDoc.nomeChiTira === 'Dottore', 'mentre col Dottore è l utente');

console.log('\n=== 4. Il fallimento non è uguale ===');
ok(M.regoleSupporto(doc, feritoVita, 'DOTTORE', {}).fallimentoLetale === true,
   'Dottore: fallire uccide il bersaglio');
ok(M.regoleSupporto(med, feritoVita, 'MEDIKIT', {}).fallimentoLetale === true,
   'MediKit: idem');
ok(M.regoleSupporto(eng, remSTR, 'INGEGNERE', {}).fallimentoLetale === false,
   'Ingegnere: fallire dà 1 Ferita, non la morte');
ok(M.regoleSupporto(giz, remSTR, 'GIZMOKIT', {}).fallimentoLetale === false, 'GizmoKit: idem');

console.log('\n=== 5. VITA e STR: strumenti diversi ===');
function amm(str, ber) {
    const g = M.bersagliSupporto(str, M._rosterProprio).find(x => x.unita.id === ber.id);
    return g && g.ammesso;
}
ok(amm('DOTTORE', feritoVita), 'Dottore su chi ha VITA: sì');
ok(!amm('DOTTORE', remSTR), 'Dottore su chi ha STR: no, serve un Ingegnere');
ok(amm('INGEGNERE', remSTR), 'Ingegnere su chi ha STR: sì');
ok(!amm('INGEGNERE', feritoVita), 'Ingegnere su chi ha VITA: no');
ok(!amm('DOTTORE', sano), 'e su chi sta bene: no');
ok(amm('INGEGNERE', remImm), 'ma l Ingegnere annulla anche l Immobilizzato-B');

console.log('\n=== 6. Il bersaglio è un ALLEATO ===');
nuovo(doc);
window.scegliStrumentoSupporto('DOTTORE');
ok(window.validTargets.length >= 1, 'ci sono alleati soccorribili');
ok(window.validTargets.every(u => M._rosterProprio.indexOf(u) >= 0),
   'tutti dal roster PROPRIO, non da quello nemico');
ok(!window.validTargets.some(u => u.id === 'p1'), 'nessun nemico fra i bersagli');

console.log('\n=== 7. "MediKit (PH=12)" sul bersaglio ===');
const ePH = M.regoleSupporto(med, conPH, 'MEDIKIT', { inContatto: true });
ok(ePH.valore === 12, `il bersaglio usa il PH del proprio profilo, 12 e non 9 (ottenuto ${ePH.valore})`);

console.log('\n=== 8. A distanza serve colpire prima ===');
const contatto = M.regoleSupporto(med, feritoVita, 'MEDIKIT', { inContatto: true });
ok(contatto.tiroPerColpire === null, 'in contatto: nessun tiro per colpire');
const distanza = M.regoleSupporto(med, feritoVita, 'MEDIKIT', { inContatto: false, rangeIndex: 0 });
ok(distanza.tiroPerColpire && distanza.tiroPerColpire.attributo === 'BS',
   'a distanza: prima un BS Attack, poi il bersaglio tira il PH');
const distDoc = M.regoleSupporto(doc, feritoVita, 'DOTTORE', { inContatto: false });
ok(distDoc.tiroPerColpire === null, 'ma il Dottore la modalità a distanza non ce l ha');

console.log('\n=== 9. Schermata ===');
nuovo(doc);
window.scegliStrumentoSupporto('DOTTORE');
window.scegliBersaglioSupporto('a1');
let h = nodo('targets-allocation-container').innerHTML;
ok(h.includes('TIRI TU'), 'col Dottore la schermata dice che tiri tu');
ok(h.includes('WIP 14'), 'e mostra il WIP');
ok(h.includes('MUORE'), 'e avverte che fallire uccide il bersaglio');

nuovo(med);
window.scegliStrumentoSupporto('MEDIKIT');
window.scegliBersaglioSupporto('a1');
h = nodo('targets-allocation-container').innerHTML;
ok(h.includes('TIRA IL BERSAGLIO'), 'col MediKit dice che tira il bersaglio');
ok(h.includes('PH 10'), 'e mostra il suo PH');

nuovo(eng);
window.scegliStrumentoSupporto('INGEGNERE');
window.scegliBersaglioSupporto('a2');
ok(nodo('targets-allocation-container').innerHTML.includes('1 Ferita'),
   'con l Ingegnere l avvertimento è più mite: 1 Ferita');

console.log('\n=== 10. Invio ===');
nuovo(doc);
window.scegliStrumentoSupporto('DOTTORE');
window.scegliBersaglioSupporto('a1');
window.eseguiCalcoloSupporto();
ok(inviato !== null, 'spedito');
let a = inviato && inviato.attacchi[0];
ok(a && a.azione === M.AZIONI.SUPPORTO_WIP, 'Dottore -> SUPPORTO_WIP');
ok(a && a.regole.chiTira === 'UTENTE' && a.regole.attributo === 'WIP', 'l Hub sa chi tira e su cosa');
ok(a && a.regole.fallimentoLetale === true, 'e che fallire è letale');
ok(a && a.regole.nonOffensivo === true, 'e che non è un attacco');

nuovo(med);
window.scegliStrumentoSupporto('MEDIKIT');
window.scegliBersaglioSupporto('a1');
window.eseguiCalcoloSupporto();
a = inviato && inviato.attacchi[0];
ok(a && a.azione === M.AZIONI.SUPPORTO_BS, 'MediKit -> SUPPORTO_BS: tira il bersaglio');
ok(a && a.regole.attributo === 'PH', 'su PH');

nuovo(doc);
window.combatTargets = [];
window.preparaModificatoriSupporto();
ok(alertUltimo && /Nessun alleato/.test(alertUltimo), 'senza bersaglio: si ferma e lo dice');

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
