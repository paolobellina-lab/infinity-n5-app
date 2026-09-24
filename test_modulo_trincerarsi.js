// @versione 2026-09-23.1 | test_modulo_trincerarsi.js | proprieta`: chat TEST
// TRINCERARSI (Sapper) — node test_modulo_trincerarsi.js
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
require('./ordine_trincerarsi.js');

function sapper() { return { id: 'n1', alias: 'Zappatore', bs: 11, skills: 'Sapper', states: {} }; }
function fante()  { return { id: 'n2', alias: 'Fante', bs: 11, skills: '', states: {} }; }
function nuovo(u) {
    window.currentOrder = {}; window.coordUnits = [u]; window.coordIndex = 0;
    window.coordPayloads = []; window.trinceraSpazio = undefined;
    inviato = null; alertUltimo = null;
    Object.keys(el).forEach(k => { el[k].innerHTML = ''; });
    window.avviaFaseTrincerarsi('TRINCERARSI', false);
}

console.log('\n=== 1. È un Ordine Intero senza tiro ===');
const sz = M.azioneSenzaTiro('TRINCERARSI');
ok(!!sz, 'azioneSenzaTiro lo trova');
ok(sz.tipo === 'LONG_SKILL', 'Ordine Intero, non Abilità Breve');
ok(sz.generaAro === true, 'e genera ARO');
ok(M.SPEC['TRINCERARSI'].tiro === false && M.SPEC['TRINCERARSI'].bersagli === 'nessuno',
   'nessun tiro, nessun bersaglio');
ok(M.autotest().join() === 'contratto coerente', 'e il contratto resta coerente');

console.log('\n=== 2. Serve l Abilità Sapper ===');
ok(M.puoTrincerarsi(sapper()).puo === true, 'chi ha Sapper può');
const senza = M.puoTrincerarsi(fante());
ok(senza.puo === false && /Sapper/.test(senza.motivo), 'chi non ce l ha, no, e il motivo lo dice');
ok(M.puoTrincerarsi({ alias: 'X', skills: 'Sapper', states: { foxhole: true } }).puo === false,
   'e chi è già in Foxhole non si trincera di nuovo');

console.log('\n=== 3. 🔴 Spazio insufficiente = IDLE, non "ordine annullato" ===');
// È la differenza fra "non puoi" e "puoi provare e fallire": il regolamento
// dice la seconda, e l'Ordine è speso comunque.
const ok3 = M.risolviTrincerarsi(sapper(), true);
ok(ok3.entra === true && ok3.idle === false, 'spazio sufficiente: entra in Foxhole');
ok(/Foxhole Token/.test(ok3.token), 'e si piazza il Token');

const idle = M.risolviTrincerarsi(sapper(), false);
ok(idle.entra === false && idle.idle === true, 'spazio insufficiente: IDLE');
ok(/Idle/i.test(idle.motivo), 'col motivo del regolamento');
ok(idle.note.some(n => /Ordine è comunque speso/.test(n)),
   'e il giocatore legge che l Ordine è speso lo stesso');

const senzaRisposta = M.risolviTrincerarsi(sapper(), undefined);
ok(senzaRisposta.incompleto === true, 'senza risposta: incompleto, non un esito inventato');

console.log('\n=== 4. La schermata ===');
nuovo(sapper());
let h = nodo('targets-allocation-container').innerHTML;
ok(/Silhouette/.test(h), 'si chiede dello spazio, con la parola del regolamento');
ok(!/FOXHOLE|IDLE/.test(h.toUpperCase().replace('STATO FOXHOLE?', '')), 'nessun esito prima della risposta');

window.rispondiTrincera(false);
h = nodo('targets-allocation-container').innerHTML;
ok(/IDLE/.test(h), 'rispondendo NO compare l avviso dell Idle');
ok(/comunque speso/.test(h), 'e che l Ordine è speso');

window.rispondiTrincera(true);
h = nodo('targets-allocation-container').innerHTML;
ok(/FOXHOLE/.test(h.toUpperCase()), 'rispondendo SÌ, lo Stato Foxhole');
// Gli effetti dello Stato Foxhole ora sono LETTI dalla fonte completa:
// la nota "da verificare" non deve più comparire.
ok(!/da verificare/i.test(h),
   'nessuna nota "da verificare": gli effetti sono letti dal regolamento');
ok(/Mimetism|Courage|Silhouette/i.test(h), 'e la schermata mostra gli effetti veri');

nuovo(fante());
ok(/NON DISPONIBILE/.test(nodo('targets-allocation-container').innerHTML),
   'e senza Sapper la schermata lo dice subito');

console.log('\n=== 5. Invio ===');
nuovo(sapper());
window.eseguiTrinceramento();
ok(alertUltimo && /Rispondi alla domanda/.test(alertUltimo), 'senza risposta si ferma');

nuovo(sapper());
window.rispondiTrincera(true);
window.eseguiTrinceramento();
ok(inviato !== null, 'spedito');
let a = inviato && inviato.attacchi[0];
ok(a && a.azione === 'TRINCERARSI', 'azione canonica');
ok(a && a.regole.senzaTiro === true && a.regole.isLongSkill === true, 'senza tiro, Ordine Intero');
ok(a && a.regole.entraInFoxhole === true, 'entra in Foxhole');
ok(a && a.bersagli.length === 0, 'nessun bersaglio');
ok(window.coordUnits[0].states.foxhole === true, 'e lo stato è applicato all unità');

nuovo(sapper());
window.rispondiTrincera(false);
window.eseguiTrinceramento();
a = inviato && inviato.attacchi[0];
ok(a && a.regole.idle === true && a.regole.entraInFoxhole === false,
   'con spazio insufficiente: idle true, niente Foxhole');
ok(!window.coordUnits[0].states.foxhole, 'e lo stato NON viene applicato');

console.log('\n=== 6. Il router lo instrada ===');
const core = require('fs').readFileSync('./motore_core.js', 'utf8');
ok(/avviaFaseTrincerarsi/.test(core), 'il router chiama avviaFaseTrincerarsi');
ok(/'TRINCERARSI'/.test(core), 'per l azione TRINCERARSI');

console.log('\n=== 7. Il regolamento è citato ===');
const T = window.CATALOGO_N5.TRINCERARSI;
ok(T.fonte === 'regolamento' && T.riga === 7415, 'skill: fonte e riga');
ok(/p\.158/.test(T.statoFoxhole.fonte),
   'e gli effetti dello Stato vengono da p.158 della fonte completa');
ok(T.statoFoxhole.fonte !== 'DA VERIFICARE', 'non sono più dichiarati non verificati');

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
