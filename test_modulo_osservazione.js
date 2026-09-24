// @versione 2026-09-23.1 | test_modulo_osservazione.js | proprieta`: chat TEST
// Le tre skill di osservazione — node test_modulo_osservazione.js
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
require('./ordine_osservazione.js');

const fo  = { id: 'n1', alias: 'Osservatore', wip: 13, bs: 11, skills: 'Forward Observer', states: {} };
const sen = { id: 'n2', alias: 'Sensore',     wip: 13, bs: 11, skills: 'Sensor', states: {} };
const tri = { id: 'n3', alias: 'Zond',        wip: 12, bs: 12, skills: 'Triangulated Fire', states: {} };
const nudo= { id: 'n4', alias: 'Fante',       wip: 12, bs: 11, skills: '', states: {} };
const croc = { id: 'p1', alias: 'Croc Man', tipo: 'LI', arm: 1, bts: 0, skills: 'Mimetism (-6)', states: { camo: true } };
const fus  = { id: 'p2', alias: 'Fusilier', tipo: 'LI', arm: 1, bts: 0, skills: '', states: {} };
M._fazione = 'NOMADI';
M._rosterProprio = [fo, sen, tri, nudo];
M._rosterNemico = [croc, fus];

console.log('\n=== 1. Tre azioni, tre contratti DIVERSI ===');
const S = M.SPEC;
ok(S['FORWARD OBSERVER'].attributo === 'WIP' && S['FORWARD OBSERVER'].bersagli === 'obbligatori',
   'Forward Observer: WIP, bersaglio obbligatorio');
ok(S['SENSOR'].attributo === 'WIP' && S['SENSOR'].bersagli === 'nessuno',
   'Sensor: WIP, NESSUN bersaglio da designare');
ok(S['TRIANGULATED FIRE'].attributo === 'BS' && S['TRIANGULATED FIRE'].arma === 'obbligatoria',
   'Triangulated Fire: BS, arma obbligatoria');
ok(M.autotest().join() === 'contratto coerente', 'e il contratto resta coerente');

console.log('\n=== 2. Ognuna vuole la propria skill ===');
ok(M.regoleForwardObserver(nudo, fus, {}).valido === false, 'senza Forward Observer: no');
ok(M.regoleSensor(nudo, []).valido === false, 'senza Sensor: no');
ok(M.regoleTriangulated(nudo, fus, M.profiloArma('Combi Rifle'), {}).valido === false,
   'senza Triangulated Fire: no');

console.log('\n=== 3. FORWARD OBSERVER: nessun danno, uno STATO ===');
const e1 = M.regoleForwardObserver(fo, fus, { rangeIndex: 0 });
ok(e1.valido && e1.attributo === 'WIP', 'tira su WIP, per il Tratto BS Weapon (WIP)');
// Dal 24 settembre lo stato inflitto e` la CHIAVE del flag ('targeted'), non
// il nome leggibile: dopo l'unificazione dei vocabolari chi lo riceve lo
// scrive dritto in states, senza tradurre.
ok(e1.statoInflitto === 'targeted', `impone lo Stato Bersagliato, con la chiave del flag (${e1.statoInflitto})`);
ok((window.CATALOGO_N5.STATI || {})[e1.statoInflitto], 'e la chiave esiste nel catalogo degli stati');
ok(e1.salvezzaInflitta.offensivo === false,
   'e NON infligge un Tiro Salvezza: chi ne calcolasse uno sbaglierebbe');
ok(e1.note.some(n => /Token TARGETED/i.test(n)), 'la nota ricorda il Token');
ok(M.profiloArma('Forward Observer').burst === 2, 'l arma ha B2, dal Weapon Chart');

console.log('\n=== 4. SENSOR: nessuna LoF, nessun bersaglio, un tiro per TUTTI ===');
const e2 = M.regoleSensor(sen, [croc, fus]);
ok(e2.valido && e2.valore === 19, `WIP 13 +6 = 19 (ottenuto ${e2.valore})`);
ok(e2.senzaLoF === true && e2.senzaBersaglio === true, 'senza LoF e senza bersaglio designato');
ok(e2.scopreTutti === true, 'un tiro solo li Scopre tutti');
ok(e2.bersagli.length === 1 && /Croc/.test(e2.bersagli[0].nome), 'il Croc Man mimetizzato: scoperto');
ok(e2.esclusi.some(x => /Fusilier/.test(x.nome)), 'il Fusilier no: non è Nascosto né Marker');

// 🔴 i MOD esclusi per nome dal regolamento
ok(!e2.voci.some(v => v.fonte === 'gittata'), 'NESSUN MOD di gittata');
ok(!e2.voci.some(v => v.fonte === 'mimetismo'),
   'e NESSUN Mimetismo: applicarlo avrebbe dato il -6 del TO Camo, cioè ciò che serve scoprire');
ok(e2.note.some(n => /Mimetismo/.test(n)), 'e la nota lo dichiara');

const vuoto = M.regoleSensor(sen, [fus]);
ok(vuoto.avvisi.some(a => a.codice === 'A73'), 'senza nulla da Scoprire: avviso, non silenzio');

console.log('\n=== 5. TRIANGULATED FIRE: nessun MOD, tranne quelli al Burst ===');
const combi = M.profiloArma('Combi Rifle');
const e3 = M.regoleTriangulated(tri, croc, combi, { rangeIndex: 4, cover: true });
ok(e3.valido && e3.valore === 12, `il BS nudo: 12 (ottenuto ${e3.valore})`);
ok(e3.valoreConMod === 0, `senza l Abilità sarebbe 0 (ottenuto ${e3.valoreConMod})`);
ok(e3.modIgnorati.length >= 3, 'e mostra quali MOD ha ignorato, invece di nasconderli');
ok(e3.modIgnorati.some(v => v.fonte === 'mimetismo'), 'compreso il Mimetismo -6');
ok(e3.modIgnorati.some(v => v.fonte === 'copertura'), 'e la Copertura');
ok(e3.mod === 0, 'il MOD totale è zero');

// il limite della Gittata Massima resta
const oltre = M.regoleTriangulated(tri, croc, combi, { rangeIndex: 99 });
ok(oltre.oltreGittata === true, 'oltre la Gittata Massima: segnalato');
ok(oltre.avvisi.some(a => a.codice === 'A74'), 'con A74');
ok(/Gittata Massima/i.test(oltre.note.join(' ')), 'e la nota cita la regola');

console.log('\n=== 6. Il modulo si dirama subito ===');
function nuovo(u, azione) {
    window.currentOrder = {}; window.coordUnits = [u]; window.coordIndex = 0;
    window.coordPayloads = []; window.combatTargets = []; window.pendingTargets = [];
    window.osservazioneArma = null;
    inviato = null; alertUltimo = null;
    Object.keys(el).forEach(k => { el[k].innerHTML = ''; });
    window.avviaFaseOsservazione(azione, false);
}
ok(typeof window.avviaFaseOsservazione === 'function', 'avviaFaseOsservazione definita');

nuovo(sen, 'SENSOR');
ok(nodo('targets-allocation-container').innerHTML.length > 0,
   'il Sensor salta la scelta bersagli e va dritto al tiro');
ok(/Scopre TUTTI/i.test(nodo('targets-allocation-container').innerHTML), 'e mostra chi scopre');

nuovo(tri, 'TRIANGULATED FIRE');
ok(nodo('weapon-buttons-container').innerHTML.length > 0, 'il Triangulated chiede prima l arma');

nuovo(fo, 'FORWARD OBSERVER');
ok(nodo('enemy-target-buttons').innerHTML.length > 0, 'il Forward Observer va ai bersagli');

console.log('\n=== 7. Invio ===');
nuovo(sen, 'SENSOR');
window.eseguiOsservazione();
ok(inviato !== null, 'Sensor: spedito');
let a = inviato && inviato.attacchi[0];
ok(a && a.bersagli.length === 0, 'senza bersagli');
ok(a && a.regole.scopreTutti === true && a.regole.scoperti.length === 1, 'con l elenco degli scoperti');

nuovo(fo, 'FORWARD OBSERVER');
window.scegliBersaglioOsservazione('p2');
window.eseguiOsservazione();
a = inviato && inviato.attacchi[0];
ok(a && a.regole.statoInflitto === 'targeted', 'Forward Observer: lo Stato nel payload');
ok(a && a.regole.nonOffensivo === true, 'e l Hub sa che non infligge danno');

console.log('\n=== 8. Il router e il regolamento ===');
const core = require('fs').readFileSync('./motore_core.js', 'utf8');
ok(/avviaFaseOsservazione/.test(core), 'il router instrada le tre azioni');
const O = window.CATALOGO_N5.OSSERVAZIONE;
ok(O['FORWARD OBSERVER'].riga === 6190 && O['SENSOR'].riga === 7432 && O['TRIANGULATED FIRE'].riga === 7854,
   'tutte e tre con fonte e riga del regolamento');

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
