// @versione 2026-10-09.1 | test_modulo_osservazione.js | proprieta`: chat TEST
// .1 (9 ott, sera): sezione 5 — la PORTA D'INGRESSO del Triangulated Fire.
//    Chiedendo il numero a `M.modAttacco` con l'azione TRIANGULATED si legge
//    1 invece di 13, e per qualche minuto ho creduto a un difetto grosso. Non
//    lo era: la regola sta in `M.regoleTriangulated`, e modAttacco e` chiamato
//    di proposito con BS_ATTACK solo per sapere quali MOD mostrare barrati.
//    Ora la differenza e` inchiodata, insieme al soggetto VERO di OSS-03
//    (Zulu-Cobra del database, BS 13, e i tre MOD barrati nominati).
//    Rotture in rompi_oss.sh: regoleTriangulated che applica i MOD; il flag
//    `ignoraTuttiIMod` via dal catalogo; il BS del Zulu-Cobra cambiato.
// Le tre skill di osservazione — node test_modulo_osservazione.js
// .2 (7 ott): il colore del tasto si prova contro M.COLORE_TASTO E si pretende
//    non vuoto e diverso dal giallo dell IDLE — alla .1 era una tautologia.
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
// PanOceania serve alla sezione 5 per il soggetto vero di OSS-03. Col
// guardiano: un banco che muore all'avvio perde le sue prove in silenzio.
try { require('./database_panoceania.js'); } catch (e) { /* detto nella sezione 5 */ }
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

// ------------------------------------------------------------------
// LA PORTA D'INGRESSO, e perche` sta scritta in una prova.
// Il 9 ottobre sera ho chiesto il numero a `M.modAttacco` passandogli
// l'azione 'TRIANGULATED FIRE', ho letto 1 invece di 13 e ho creduto per
// qualche minuto di avere trovato un difetto grosso. Non lo era: la regola
// sta in `M.regoleTriangulated`, e `modAttacco` viene chiamato di proposito
// con BS_ATTACK, solo per sapere quali MOD mostrare barrati. `M.SPEC` non
// porta `ignoraTuttiIMod` perche` non e` lui a doverlo leggere.
// La prova inchioda la differenza: se un domani qualcuno "aggiusta"
// modAttacco per rispondere anche a questa azione, le due righe lo dicono
// e si decide da che parte sta la regola — invece di scoprirlo al tavolo.
const nudoBS = M.modAttacco(tri, croc, combi, M.AZIONI.TRIANGULATED, { rangeIndex: 4, cover: true });
ok(nudoBS.valore === e3.valoreConMod,
   `modAttacco con l azione TRIANGULATED da` + ` il tiro CON i MOD (${nudoBS.valore}), non il BS nudo: non e` + ` lui a conoscere la regola`,
   `modAttacco: ${nudoBS.valore} — regoleTriangulated: ${e3.valore}. Se diventano uguali, la regola e in due posti.`);
ok(e3.valore !== e3.valoreConMod,
   `e i due numeri sono davvero diversi (${e3.valore} contro ${e3.valoreConMod}): la prova di sopra non e` + ` una tautologia`);
ok(((window.CATALOGO_N5.OSSERVAZIONE || {})['TRIANGULATED FIRE'] || {}).ignoraTuttiIMod === true,
   'il flag `ignoraTuttiIMod` sta nel catalogo, dove regoleTriangulated lo legge',
   'se sparisce dal catalogo, regoleTriangulated resta giusto per caso e nessuno sa piu` perche`');

// E con una truppa VERA del roster di collaudo, non costruita a mano: e` il
// soggetto che OSS-03 del piano nomina, e i suoi numeri stanno scritti la`.
const zuluV = (window.DB_PANOCEANIA || []).find(u => u.nome === 'Zulu-Cobra (Triangulated Fire, Sensor)');
const crocV = (window.DB_PANOCEANIA || []).find(u => u.nome === 'Croc Man (MULTI Sniper Rifle)');
if (zuluV && crocV) {
    const r = M.regoleTriangulated(Object.assign({}, zuluV, { states: {} }),
                                   Object.assign({}, crocV, { states: {} }), combi, { rangeIndex: 2, cover: true });
    ok(r.valido && r.valore === 13 && r.mod === 0,
       `Zulu-Cobra (Triangulated Fire, Sensor) del database: BS 13 pieno (${r.valore}, mod ${r.mod})`,
       'e` il numero che OSS-03 del piano dichiara: se cambia, cambia il piano');
    ok(r.valoreConMod === 1,
       `e senza l Abilita` + ` sarebbe 1: dodici punti di differenza (${r.valoreConMod})`);
    const fonti = (r.modIgnorati || []).map(v => v.fonte).sort();
    ok(JSON.stringify(fonti) === JSON.stringify(['copertura', 'gittata', 'mimetismo']),
       'e i MOD barrati sono esattamente tre, nominati: gittata, copertura, mimetismo',
       `trovati: ${JSON.stringify(fonti)}`);
} else {
    ok(false, 'i profili PanOceania del roster non si caricano: Zulu-Cobra e Croc Man non trovati',
       'senza di loro le tre prove di sopra non guardano niente');
}

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

// ==================================================================
// REQUISITI DICHIARATI AL TAVOLO — Forward Observer (lof + gittata)
//   Nuovo il 7 ottobre. MOTORE ha misurato dalla pagina BS, CC, Hacking e
//   Scoprire; il Forward Observer NO. Il tasto vive su btn-esegui-calcolo
//   e la schermata lo CLONA: nel finto DOM il clone e`
//   'btn-esegui-calcolo_c', e una prova che guarda l'originale e` verde per
//   sbaglio.
//   🔴 'gittata' legge `fuoriGittata` a polarita` INVERTITA: si gira dal
//   motore (M.invertiRequisito), non scrivendo i campi a mano.
// ==================================================================
console.log('\n=== REQUISITI AL TAVOLO: Forward Observer (lof + gittata) ===');
const tastoO = () => el['btn-esegui-calcolo_c'] || {};
function prontoFO() {
    nuovo(fo, 'FORWARD OBSERVER');
    window.scegliBersaglioOsservazione('p2');
    return window.combatTargets[0];
}
const t0 = prontoFO();
ok(t0 !== undefined, 'il bersaglio scelto entra in combatTargets');
ok(tastoO().innerText === 'ESEGUI TIRO',
   `requisiti a posto: il tasto porta l etichetta dell azione (${tastoO().innerText})`);
// GIRATA sul motore 2026-10-07.11: il tasto valido non ha piu` lo sfondo
// vuoto. Scrivendo '' il motore toglieva al tasto l'arancione della pagina,
// e Paolo al tavolo lo vedeva cambiare colore. Ora i due colori stanno nel
// motore, M.COLORE_TASTO: valido 'var(--nomad-orange)', idle '#ffcc00'.
// Si legge dal motore invece di scrivere la stringa a mano, cosi` se Paolo
// cambia l'arancione della pagina questa prova non diventa rossa per un
// motivo che non c'entra col requisito.
// 🔴 Non basta confrontare col valore che il motore dichiara: sarebbe una
// TAUTOLOGIA — i due lati si muovono insieme e la prova non puo` fallire.
// Visto il 7 ottobre rompendo COLORE_TASTO.valido a '' e vedendo il banco
// restare verde. Quindi si pretendono tre cose: che il tasto porti quel
// colore, che quel colore NON sia vuoto (era il difetto di prima) e che sia
// DIVERSO dal giallo dell'IDLE (altrimenti i due stati non si distinguono a
// vista). Cosi` la prova resiste a un cambio di arancione ma non al difetto.
ok(!!M.COLORE_TASTO.valido && M.COLORE_TASTO.valido !== M.COLORE_TASTO.idle,
   `il colore valido c è e non è il giallo dell IDLE (${JSON.stringify(M.COLORE_TASTO)})`);
ok(tastoO().style && tastoO().style.background === M.COLORE_TASTO.valido,
   `e il tasto lo porta (${tastoO().style && tastoO().style.background})`);
for (const chiave of ['lof', 'gittata']) {
    prontoFO();
    window.toggleRequisitoOsservazione(0, chiave);
    ok(tastoO().innerText === 'IDLE',
       `requisito "${chiave}" dichiarato mancante: il tasto diventa IDLE (${tastoO().innerText})`);
    ok(tastoO().style && tastoO().style.background === '#ffcc00',
       `ed è giallo (${tastoO().style && tastoO().style.background})`);
}
// L interruttore gira il campo del CATALOGO, non il nome della chiave.
prontoFO();
window.toggleRequisitoOsservazione(0, 'gittata');
ok(window.combatTargets[0].fuoriGittata === true,
   `e gira fuoriGittata, non un campo chiamato "gittata" (${window.combatTargets[0].fuoriGittata})`);
// Il tasto IDLE porta all Idle vero, col motivo del motore.
prontoFO();
window.toggleRequisitoOsservazione(0, 'lof');
let motivoO = null;
const salvaO = window.dichiaraRequisitoFallito;
window.dichiaraRequisitoFallito = (m) => { motivoO = m; return true; };
tastoO().onclick();
ok(motivoO !== null && /Linea di Tiro/.test(String(motivoO)),
   `cliccandolo chiama l Idle col motivo del motore (${String(motivoO).slice(0, 50)}…)`);
// CONTROPROVA: coi requisiti a posto NON chiama l Idle.
prontoFO();
motivoO = null;
tastoO().onclick();
ok(motivoO === null, 'CONTROPROVA: coi requisiti a posto il tasto NON chiama l Idle');
window.dichiaraRequisitoFallito = salvaO;

// 🔴 IL SENSOR NON DESIGNA BERSAGLI, quindi non ha requisiti da dichiarare:
// requisitiOsservazione gli passa una lista VUOTA. Il suo tasto non deve
// mai diventare IDLE — e quello che glielo impedisce e` che zero bersagli
// NON contano come "tutti mancano" (M.requisitiDichiarati([]) -> idle
// false). Due zeri non fanno una regola, e qui si vede perche` la
// distinzione serviva.
nuovo(sen, 'SENSOR');
const reqSensor = window.requisitiOsservazione();
ok(reqSensor && reqSensor.mancanti.length === 0 && reqSensor.idle === false,
   `il Sensor non ha requisiti: zero mancanti, nessun Idle (${JSON.stringify({ m: (reqSensor || {}).mancanti && reqSensor.mancanti.length, i: (reqSensor || {}).idle })})`);
ok(tastoO().innerText === 'ESEGUI TIRO',
   `e il suo tasto resta quello dell azione (${tastoO().innerText})`);
// CONTROPROVA: il Forward Observer, che i bersagli li designa, ne ha uno.
prontoFO();
const reqFO = window.requisitiOsservazione();
ok(reqFO && reqFO.mancanti.length === 0,
   'CONTROPROVA: il Forward Observer guarda il suo bersaglio — la lista non è vuota per tutti');
window.toggleRequisitoOsservazione(0, 'lof');
ok(window.requisitiOsservazione().idle === true,
   'e infatti togliendogli la LoF diventa un Idle: la differenza è il bersaglio, non l azione');

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
