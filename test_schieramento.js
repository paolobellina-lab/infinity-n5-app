// @versione 2026-09-23.1 | test_schieramento.js | proprieta`: chat TEST
// Test del filtro anti-spoiler — node test_schieramento.js
global.window = global;
require('./catalogo_n5.js'); require('./database_comune.js');
require('./database_nomad.js'); require('./database_panoceania.js');
const M = require('./motore_regole_n5.js');
require('./fase_schieramento.js');

let passati = 0, falliti = 0;
function ok(c, n, e) { if (c) { passati++; console.log(`  ✅ ${n}`); } else { falliti++; console.log(`  ❌ ${n}${e ? '\n       ' + e : ''}`); } }

const croc = { id: 'n1', nome: 'Croc Man (Sniper Rifle)', alias: 'Croc', tipo: 'LI',
    deployState: 'CAMO_0', cc: 15, bs: 12, ph: 11, wip: 13, arm: 1, bts: 3, w: 1,
    weapon: 'MULTI Sniper Rifle, Pistol', skills: 'Mimetism (-6), Infiltration, Booty',
    equip: 'Multispectral Visor L1', states: {} };
const con = (extra) => Object.assign({}, croc, extra);

console.log('\n=== 1. LA FUGA: di un Marker non deve trapelare nulla ===');
const marker = M.filtraPerAvversario(croc);
['cc', 'bs', 'ph', 'wip', 'arm', 'bts', 'w', 'weapon', 'skills', 'equip'].forEach(function (k) {
    ok(marker[k] === undefined, `${k}: NON spedito (prima arrivava all avversario)`);
});
ok(marker.nome === 'MARKER' && marker.alias === 'SEGNALINO MIMETICO',
   'nemmeno il nome dell Unità: solo l etichetta del segnalino');
ok(marker.id === 'n1' && marker.tipo === 'MARKER', 'restano id e tipo: servono a disegnarlo');

const imp = M.filtraPerAvversario(con({ deployState: 'IMP_1' }));
ok(imp.alias === 'PERSONAGGIO SCONOSCIUTO' && imp.weapon === undefined,
   'Impersonation: stesso trattamento');

console.log('\n=== 2. Il filtro è per ELENCO, non per sottrazione ===');
// un campo nuovo, che il filtro vecchio avrebbe lasciato passare
const conCampoNuovo = M.filtraPerAvversario(con({ segretoDelGiocatore: 'piano di battaglia' }));
ok(conCampoNuovo.segretoDelGiocatore === undefined,
   'un campo aggiunto in futuro non passa: è la differenza fra elenco e sottrazione');

console.log('\n=== 3. Chi non è sul tavolo non esiste ===');
['HIDDEN', 'RESERVE', 'AD'].forEach(function (d) {
    ok(M.filtraPerAvversario(con({ deployState: d })) === null,
       `${d}: non spedito affatto`);
});
ok(M.filtraPerAvversario(con({ deployState: 'NORMAL', states: { hidden: true } })) === null,
   'anche se il nascondimento è negli stati');

console.log('\n=== 4. Chi è a faccia in su si vede tutto ===');
const v = M.filtraPerAvversario(con({ deployState: 'NORMAL' }));
ok(v.nome === 'Croc Man (Sniper Rifle)' && v.weapon && v.skills && v.bs === 12,
   'truppa visibile: profilo completo, com è giusto');

console.log('\n=== 5. Casi particolari ===');
const holo = M.filtraPerAvversario(con({ deployState: 'NORMAL', states: { holoecho: true } }));
ok(holo.alias === 'COPIA OLOGRAFICA', 'Holoecho: etichettato, ma visibile come modello');
const decoy = M.filtraPerAvversario(con({ deployState: 'NORMAL', states: { decoy: true } }));
ok(decoy.alias === 'BERSAGLIO DECOY', 'Decoy: idem');

const mask = M.filtraPerAvversario(con({ deployState: 'HOLOMASK', fakeName: 'Fusilier' }));
ok(mask.nome === 'Fusilier' && mask.weapon === 'Sconosciuta',
   'HoloMask: nome finto e armi nascoste');

const seed = M.filtraPerAvversario(con({ deployState: 'SEED' }));
ok(seed.alias === 'SEED-EMBRYO' && seed.weapon === undefined, 'Seed-Embryo: solo il segnalino');

const fox = M.filtraPerAvversario(con({ deployState: 'FOXHOLE' }));
ok(fox.states.foxhole === true && fox.weapon, 'Foxhole: pubblico, profilo visibile');

console.log('\n=== 6. Roster intero ===');
const roster = [croc, con({ id: 'n2', deployState: 'NORMAL' }), con({ id: 'n3', deployState: 'HIDDEN' })];
const pub = M.rosterPubblico(roster);
ok(pub.length === 2, 'il nascosto sparisce dal roster pubblico');
ok(pub.every(u => u.id), 'gli altri due ci sono');

console.log('\n=== 7. Promemoria post-schieramento ===');
// Fonte: REGOLE_N5_v5_1_1.txt, voce INFILTRATION, "INFILTRATION ROLL":
//   "An Infiltration Roll is required to infiltrate into the enemy's half of
//    the table. This is a Normal Roll with PH-3."
//   e sul fallimento: "the user loses the option to deploy in a Marker State
//    or Hidden Deployment State" — quindi il tiro lo fa ANCHE chi si schiera
//    come Marker. La prima versione di questa sezione asseriva il contrario
//    ("nessun promemoria se non è schierato in modo normale"): era il test a
//    sbagliare, e con il motore 2026-09-21.21 e` diventato rosso.
const conInfiltrazione = (stato) => M.promemoriaSchieramento([con({ deployState: stato })])
    .some(p => p.skill === 'INFILTRATION');

const pro = M.promemoriaSchieramento([con({ deployState: 'NORMAL' })]);
ok(pro.some(p => p.skill === 'BOOTY'), 'Booty: promemoria generato');
ok(conInfiltrazione('NORMAL'), 'Infiltration schierato come Modello: promemoria');
ok(conInfiltrazione('CAMO'),   'Infiltration schierato come Marker CAMO: promemoria (anche il Marker tira)');
ok(conInfiltrazione('IMP'),    'Infiltration schierato in Impersonation: promemoria');

// Controprova 1: chi non e` ancora sul tavolo non tira niente.
ok(!conInfiltrazione('RESERVE'), 'in Riserva: nessun promemoria, non e` ancora sul tavolo');

// Controprova 2: senza l'abilita` il promemoria non deve comparire, altrimenti
// i tre "si`" qui sopra non dimostrerebbero nulla.
const fus = Object.assign(JSON.parse(JSON.stringify(
    window.DB_PANOCEANIA.find(u => u.nome === 'Fusilier (Combi Rifle)'))), { deployState: 'NORMAL', states: {} });
ok(!/Infiltration/i.test(fus.skills || ''), 'controprova: il Fusilier non ha Infiltration nel database');
ok(!M.promemoriaSchieramento([fus]).some(p => p.skill === 'INFILTRATION'),
   'controprova: senza Infiltration nessun promemoria di infiltrazione');

// Il testo deve nominare il PH fra parentesi del profilo, oltre al PH-3.
const testoInf = (pro.find(p => p.skill === 'INFILTRATION') || {});
const t = String(testoInf.testo || testoInf.messaggio || '');
ok(/PH-3/.test(t) && /parentesi/i.test(t), 'il testo cita PH-3 e il PH fra parentesi del profilo');

// Il promemoria fa il conto (motore 2026-09-21.27): PH-3 del profilo, o il PH
// fra parentesi se il profilo lo dichiara. Lo Zero si legge dal database; la
// variante fra parentesi non esiste in nessun profilo dei due database, quindi
// si costruisce sullo stesso Zero cambiando solo la notazione.
const zeroDb = window.DB_NOMADI.find(u => u.nome === 'Zero (Combi Rifle)');
const testoInfDi = (u) => { const q = M.promemoriaSchieramento([Object.assign(JSON.parse(JSON.stringify(u)), { deployState: 'NORMAL', states: {} })])
                                     .find(p => p.skill === 'INFILTRATION') || {}; return String(q.testo || q.messaggio || ''); };
ok(zeroDb && zeroDb.ph === 12 && /\bInfiltration\b(?!\s*\()/.test(zeroDb.skills), 'lo Zero nel database: PH 12, Infiltration senza parentesi');
ok(/Tiro a 9\b/.test(testoInfDi(zeroDb)), `Zero: "Tiro a 9" (${testoInfDi(zeroDb).match(/Tiro a[^.]*/) || 'nessun conto'})`);
const zeroPH11 = Object.assign({}, zeroDb, { skills: zeroDb.skills.replace(/\bInfiltration\b/, 'Infiltration (PH=11)') });
ok(/Tiro a 11\b/.test(testoInfDi(zeroPH11)), `Infiltration (PH=11): "Tiro a 11", il valore fra parentesi sostituisce PH-3`);
// Controprova: il numero segue il PH del profilo, non e` scritto fisso.
const zeroPH14 = Object.assign({}, zeroDb, { ph: 14 });
ok(/Tiro a 11\b/.test(testoInfDi(zeroPH14)) && !/Tiro a 9\b/.test(testoInfDi(zeroPH14)),
   'controprova: lo stesso Zero con PH 14 tira a 11, non a 9');

// Hidden Deployment — risolto dalla fonte. REGOLE_N5_v5_1_1.txt riga 13896,
// voce HIDDEN DEPLOYMENT: "Although the Trooper in Hidden Deployment is not
// considered to be on the table, if the Trooper has the Infiltration Special
// Skill and makes an Infiltration Roll, the Roll must be made once their
// position is written down." Il nascosto che si infiltra tira: promemoria si`.
// (La prima versione asseriva il contrario, marcata DA VERIFICARE; il motore
// 2026-09-21.25 ha applicato la riga e il test e` diventato rosso.)
ok(conInfiltrazione('HIDDEN'),
   'HIDDEN: promemoria — il nascosto con Infiltration tira alla scrittura della posizione (riga 13896)');

console.log('\n=== 8. Il modulo usa il motore ===');
const payload = window.faseSchieramento.preparaPayloadHub([croc], [], []);
ok(payload.roster[0].weapon === undefined, 'il payload verso l Hub è filtrato');
ok(payload.rosterPrivato[0].weapon, 'ma il roster privato resta completo');
ok(window.faseSchieramento.validaSchieramento([con({ deployState: 'NORMAL' })]).length >= 2,
   'i promemoria passano dal motore');

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
