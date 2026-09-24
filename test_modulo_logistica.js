// @versione 2026-09-23.1 | test_modulo_logistica.js | proprieta`: chat TEST
// Ingresso in campo e Speedball — node test_modulo_logistica.js
global.window = global;
global.document = { title: 'NOMADS TACTICAL TERMINAL' };
let passati = 0, falliti = 0;
function ok(c, n, e) { if (c) { passati++; console.log(`  ✅ ${n}`); } else { falliti++; console.log(`  ❌ ${n}${e ? '\n       ' + e : ''}`); } }

const el = {};
function nodo(id) { return el[id] || (el[id] = { id, innerHTML: '', innerText: '', style: {},
    appendChild() {}, remove() {}, cloneNode() { return nodo(id + '_c'); }, parentNode: { replaceChild() {} } }); }
global.document.getElementById = (i) => nodo(i);
global.document.querySelector = () => nodo('btn');
global.document.querySelectorAll = () => [];
let alertUltimo = null; global.alert = (m) => { alertUltimo = m; };
let inviato = null; global.inviaCalcoloAllHub = (p) => { inviato = p; };
global.goToStep = () => {}; global.mostraTitoloUnitaCorrente = () => {};

require('./catalogo_n5.js'); require('./database_comune.js');
const M = require('./motore_regole_n5.js');
require('./ordine_logistica.js');

const ad   = { id: 'n1', alias: 'Airborne', ph: 12, skills: 'Combat Jump', states: {} };
const adPH = { id: 'n2', alias: 'Preciso',  ph: 11, skills: 'Combat Jump (PH=10)', states: {} };
const nudo = { id: 'n3', alias: 'Fante',    ph: 11, skills: '', states: {} };
const debole = { id: 'n4', alias: 'Debole', ph: 8, skills: '', states: {} };

function nuovo(u, azione) {
    window.currentOrder = {}; window.coordUnits = [u]; window.coordIndex = 0;
    window.coordPayloads = []; window.logisticaRisposta = undefined;
    window.speedballTiro = null; window.speedballScelto = null;
    inviato = null; alertUltimo = null;
    Object.keys(el).forEach(k => { el[k].innerHTML = ''; });
    window.avviaFaseLogistica(azione, false);
}

console.log('\n=== 1. Le due azioni nel contratto ===');
ok(M.SPEC['INGRESSO IN CAMPO'].attributo === 'PH', 'Ingresso: tiro PH');
ok(M.SPEC['REQUEST SPEEDBALL'].attributo === 'PH', 'Speedball: tiro PH');
ok(M.SPEC['INGRESSO IN CAMPO'].bersagli === 'nessuno' && M.SPEC['REQUEST SPEEDBALL'].bersagli === 'nessuno',
   'nessun bersaglio per entrambe');
ok(M.autotest().join() === 'contratto coerente', 'e il contratto resta coerente');

console.log('\n=== 2. INGRESSO IN CAMPO: serve una skill aerea ===');
ok(M.regoleIngressoInCampo(ad, {}).valido === true, 'Combat Jump: sì');
ok(M.regoleIngressoInCampo(nudo, {}).valido === false, 'senza: no');
ok(/Schieramento Aereo/i.test(M.regoleIngressoInCampo(nudo, {}).motivo), 'col motivo giusto');
ok(M.regoleIngressoInCampo(ad, {}).valore === 12, 'tira sul proprio PH: 12');
ok(M.regoleIngressoInCampo(adPH, {}).valore === 10,
   '"Combat Jump (PH=10)" sostituisce il PH di profilo: 10, non 11');

console.log('\n=== 3. 🔴 Fallire NON significa "non entri" ===');
// Un "non puoi entrare" farebbe credere che l Ordine sia sprecato: non lo è.
const e1 = M.regoleIngressoInCampo(ad, {});
ok(e1.seFallisce.entra === true, 'fallendo, la truppa ENTRA lo stesso');
ok(/Zona di Schieramento/i.test(e1.seFallisce.dove), 'nella propria Zona di Schieramento');
ok(/bordo/i.test(e1.seFallisce.dove), 'a contatto col bordo del tavolo');
ok(/Marker|Decoy/i.test(e1.seFallisce.perdeMarker), 'e perde Marker e Decoy');
ok(/Deployable/i.test(e1.seFallisce.deployableRimossi), 'e i Deployable vengono rimossi');

console.log('\n=== 4. La restrizione vale in ogni caso ===');
ok(e1.note.some(n => /Copertura Parziale/i.test(n)),
   'durante l Ordine non si beneficia della Copertura Parziale');
ok(e1.divieti.length === 5, 'cinque divieti sul punto di atterraggio');
ok(e1.domanda && /divieti/i.test(e1.domanda), 'e una domanda, perché l app non ha la mappa');

console.log('\n=== 5. 🔴 SPEEDBALL: PH FISSO 14, non quello della truppa ===');
const s1 = M.regoleSpeedball(debole, {});
ok(s1.valore === 14, `PH 14 anche per chi ha PH 8 (ottenuto ${s1.valore})`);
ok(s1.phFisso === true, 'ed è dichiarato fisso');
ok(s1.nonEUnOrdine === true, 'e NON è un Ordine: è un Abilità Automatica');
ok(s1.tipo === 'AUTOMATIC_SKILL', 'col tipo giusto');
ok(s1.token === 2, 'servono due Token');

console.log('\n=== 6. La Speedball Chart ===');
[[1, 'VITAPACK'], [3, 'VITAPACK'], [4, 'AUTOREPAIRS'], [6, 'AUTOREPAIRS'],
 [7, 'SWITCH ON'], [10, 'SWITCH ON'], [11, 'JETPACK (S:2)'], [13, 'JETPACK (S:2)'],
 [14, 'OVERKILL'], [16, 'OVERKILL'], [17, 'NANOSHIELD'], [20, 'NANOSHIELD']
].forEach(function (c) {
    ok(M.oggettoSpeedball(c[0]).oggetto === c[1], `tiro ${c[0]} -> ${c[1]}`);
});
ok(M.oggettoSpeedball(21).oggetto === null && M.oggettoSpeedball(21).avviso,
   'tiro 21: fuori Chart, e lo dice');
ok(M.oggettoSpeedball(0).oggetto === null, 'e anche lo 0');
ok(M.oggettoSpeedball('abc').avviso.codice === 'A75', 'un valore non numerico: A75');

console.log('\n=== 7. Primo scelto, secondo tirato ===');
const S = window.CATALOGO_N5.SPEEDBALL;
ok(/SCEGLIE/i.test(S.primoToken), 'il primo Token si SCEGLIE');
ok(/TIRA/i.test(S.secondoToken), 'il secondo si TIRA');
ok(Object.keys(S.oggetti).length === 6, 'sei oggetti a catalogo');
ok(/non sono bersaglio dei Deactivator/i.test(S.noDeactivator),
   'e i Token non sono bersaglio dei Deactivator');

console.log('\n=== 8. Le schermate ===');
nuovo(ad, 'INGRESSO IN CAMPO');
let h = nodo('targets-allocation-container').innerHTML;
ok(/PH/.test(h) && /12/.test(h), 'Ingresso: mostra il PH');
ok(/SE IL TIRO FALLISCE/.test(h), 'e cosa succede fallendo, PRIMA di tirare');
ok(/l'Ordine non è sprecato/i.test(h), 'dicendo che l Ordine non è sprecato');

nuovo(nudo, 'INGRESSO IN CAMPO');
ok(/NON DISPONIBILE/.test(nodo('targets-allocation-container').innerHTML),
   'senza skill aerea lo dice subito');

nuovo(debole, 'REQUEST SPEEDBALL');
h = nodo('targets-allocation-container').innerHTML;
ok(/14/.test(h) && /fisso/.test(h), 'Speedball: PH 14 marcato come fisso');
ok(/PRIMO TOKEN/.test(h) && /SECONDO TOKEN/.test(h), 'i due Token distinti');
ok(/VITAPACK/.test(h) && /NANOSHIELD/.test(h), 'con la Chart completa');

console.log('\n=== 9. Invio ===');
nuovo(ad, 'INGRESSO IN CAMPO');
window.eseguiLogistica();
ok(alertUltimo && /Conferma/.test(alertUltimo), 'Ingresso senza conferma: si ferma');
window.rispondiLogistica(true);
window.eseguiLogistica();
ok(inviato !== null, 'con la conferma: spedito');
let a = inviato && inviato.attacchi[0];
ok(a && a.regole.senzaCoperturaParziale === true, 'e l Hub sa della restrizione sulla Copertura');
ok(a && a.regole.seFallisce, 'e cosa fare se il tiro fallisce');

nuovo(debole, 'REQUEST SPEEDBALL');
window.eseguiLogistica();
ok(alertUltimo && /Scegli l'oggetto/.test(alertUltimo), 'Speedball incompleto: si ferma');
window.scegliSpeedball('NANOSHIELD');
window.tiraSpeedball(5);
window.eseguiLogistica();
a = inviato && inviato.attacchi[0];
ok(a && a.regole.token.length === 2, 'due Token nel payload');
ok(a && a.regole.token[0].oggetto === 'NANOSHIELD' && a.regole.token[0].origine === 'scelto',
   'il primo: scelto');
ok(a && a.regole.token[1].oggetto === 'AUTOREPAIRS' && a.regole.token[1].origine === 'tirato',
   'il secondo: tirato, e il 5 dà AUTOREPAIRS');
ok(a && a.regole.nonEUnOrdine === true, 'e l Hub sa che non è un Ordine');

console.log('\n=== 10. Il router e il regolamento ===');
const core = require('fs').readFileSync('./motore_core.js', 'utf8');
ok(/avviaFaseLogistica/.test(core), 'il router instrada entrambe');
ok(window.CATALOGO_N5.INGRESSO_IN_CAMPO.riga === 5941, 'Ingresso: riga 5941');
ok(window.CATALOGO_N5.SPEEDBALL.riga === 5610, 'Speedball: riga 5610');

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
