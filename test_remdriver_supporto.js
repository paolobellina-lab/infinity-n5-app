// @versione 2026-09-29.3 | test_remdriver_supporto.js | proprieta`: chat TEST
// ================================================================
// Tre cose del 27-28 settembre che cambiano numeri al tavolo:
//   - il RemDriver, che passa i valori del pilota al REM;
//   - la Tech-Recovery dell'Ingegnere;
//   - il ReRoll nella forma N5.2, col WIP scritto nel profilo.
// ================================================================
let passati = 0, falliti = 0;
const ok = (c, m) => { if (c) { passati++; console.log('  ✅ ' + m); } else { falliti++; console.log('  ❌ ' + m); } };
const J = JSON.stringify;

global.window = global;
require('./catalogo_n5.js'); require('./database_comune.js');
require('./database_nomad.js'); require('./database_panoceania.js');
const M = require('./motore_regole_n5.js');
const T = [].concat(window.DB_NOMADI, window.DB_PANOCEANIA);
const U = (re, s) => { const u = T.find(x => re.test(x.nome)); return u ? Object.assign(JSON.parse(J(u)), { states: s || {} }) : null; };

console.log('\n=== 1. RemDriver: il REM prende i valori del pilota ===');
const pilota = U(/^Pilot-X Team/);
const rem = U(/^Zondmate/);
ok(!!pilota && /RemDriver/i.test(pilota.skills || ''), `pilota nel database: ${pilota && pilota.nome}`);
ok(rem && rem.bs === 10 && rem.ph === 10 && rem.bts === 3,
   `Zondmate di suo: BS ${rem.bs}, PH ${rem.ph}, BTS ${rem.bts}`);
// La firma è applicaRemDriver(REM, utente): prima chi riceve, poi chi guida.
// Invertendoli la funzione risponde comunque — con un REM che non cambia —
// ed è il genere di errore che un banco scritto di fretta non vede.
const esito = M.applicaRemDriver(JSON.parse(J(rem)), pilota);
ok(esito.ok === true, `assegnato (${J(esito.motivo || '')})`);
const guidato = esito.rem;
ok(guidato.bs === 13 && guidato.ph === 13 && guidato.bts === 6,
   `col RemDriver: BS ${guidato.bs}, PH ${guidato.ph}, BTS ${guidato.bts}`);
// I valori originali restano: servono per tornare indietro quando il pilota
// cade, e senza di loro il REM resterebbe potenziato per tutta la partita.
ok(M.togliRemDriver(JSON.parse(J(guidato))).bs === 10,
   'e gli originali si conservano: togliendo il segnalino torna a BS 10');

console.log('\n=== 2. Due rifiuti, che sono la parte che protegge il tavolo ===');
const gia = M.applicaRemDriver(JSON.parse(J(guidato)), pilota);
ok(gia.ok === false, `un secondo segnalino sullo stesso REM: rifiutato (${J(gia.motivo || '')})`);
const leggero = U(/^Alguacil \(Combi/);
ok(M.applicaRemDriver(leggero, pilota).ok === false, 'su un Leggero: rifiutato — il RemDriver guida REM, non truppe');
// 🔴 E il terzo rifiuto, che oggi manca: lo STESSO pilota su un SECONDO REM.
// Segnalato da INTERFACCIA il 29 settembre. Dalla loro parte non è
// raggiungibile — dopo la prima assegnazione i pulsanti spariscono — ma è una
// regola che vive nell'interfaccia invece che nel motore, ed è esattamente la
// cosa che ci siamo detti di non fare: un secondo schermo, o un ordine di
// clic diverso, e la regola non c'è più.
// "Un pilota, un segnalino" è un fatto SUL PILOTA, quindi va letto dal pilota
// aggiornato: applicaRemDriver è pura — restituisce REM e pilota nuovi e non
// tocca quelli che riceve, come consumaUsi. Chiamandola due volte col pilota
// di PRIMA si chiede a un oggetto che non sa ancora niente, ed è l'errore che
// avevo fatto io: il mio rosso diceva "manca la regola" e mancava la catena.
const remA = Object.assign(JSON.parse(J(rem)), { id: 'rem_a' });
const remB = Object.assign(JSON.parse(J(rem)), { id: 'rem_b' });
const primo = M.applicaRemDriver(remA, pilota);
ok(primo.ok === true, 'un pilota assegna il suo segnalino a un REM');
ok(primo.pilota && primo.pilota.remDriverSu === 'rem_a',
   `e il pilota restituito se lo segna (${J(primo.pilota && primo.pilota.remDriverSu)})`);
const secondo = M.applicaRemDriver(remB, primo.pilota);
ok(secondo.ok === false,
   `a un SECONDO REM no: un segnalino per pilota (${J(secondo.motivo || 'accettato')})`);
// Controprova, e dice un limite invece di nasconderlo: col pilota VECCHIO la
// funzione accetta, perché non ha nessuna informazione su cui rifiutare. È
// onesto che sia così — ma chi la chiama deve concatenare, o passare il
// roster, altrimenti la regola non c'è.
ok(M.applicaRemDriver(remB, pilota).ok === true,
   'col pilota non aggiornato accetta: la regola vive nella catena, non nella singola chiamata');

// Controprova: senza i due rifiuti, "assegnato" sopra non distinguerebbe una
// regola applicata da una funzione che dice sempre di sì.
ok(M.applicaRemDriver(JSON.parse(J(rem)), pilota).ok === true,
   'controprova: su un REM libero l assegnazione riesce ancora');
// E il segnalione resta scritto sul REM: è da lì che si riconosce chi lo guida.
ok(guidato.remDriver && guidato.remDriver.utenteId === pilota.id,
   `il segnalino porta l id del pilota (${guidato.remDriver && guidato.remDriver.utenteId})`);

console.log('\n=== 3. Il pilota che cade porta via il potenziamento ===');
const pilotaNull = Object.assign(JSON.parse(J(pilota)), { states: { unconscious: true } });
// remDriverDaTogliere legge il ROSTER, non due unità: cerca i REM il cui
// pilota è in uno stato Null. Va chiamata come la chiama l'app.
const rosterNull = [pilotaNull, guidato];
ok(M.remDriverDaTogliere(rosterNull).length === 1,
   `pilota Incosciente: un segnalino da togliere (${M.remDriverDaTogliere(rosterNull).length})`);
ok(M.remDriverDaTogliere([pilota, guidato]).length === 0,
   'controprova: pilota sano, nessun segnalino da togliere');
// E un roster senza REM guidati non produce niente, altrimenti lo zero sopra
// non distinguerebbe "il pilota sta bene" da "non sto guardando".
ok(M.remDriverDaTogliere([pilotaNull, JSON.parse(J(rem))]).length === 0,
   'e un REM senza segnalino non risulta mai da togliere');

console.log('\n=== 4. Tech-Recovery: cancella gli stati dell Ingegnere, mai l Incosciente ===');
// techRecovery si chiede al BERSAGLIO: è lui che deve avere la skill, perché
// la Tech-Recovery è la riparazione di se stessi (un REM che si ripara).
const conSkill = T.find(u => /Tech-?Recovery/i.test(u.skills || ''));
ok(!!conSkill, `profilo con Tech-Recovery: ${conSkill && conSkill.nome}`);
const conStati = (st) => Object.assign(JSON.parse(J(conSkill)), { states: st });
const due = M.techRecovery(conStati({ immobilizedA: true, targeted: true }));
ok(due.applicabile !== false, `su IMM-A + Bersagliato: applicabile, tiro ${due.tiro && due.tiro.valore} su ${due.tiro && due.tiro.attributo}`);
ok((due.cancella || []).length >= 1, `cancella gli stati dell Ingegnere (${J(due.cancella)})`);
ok(!(due.cancella || []).some(x => /incosciente/i.test(x.id || x)),
   `e mai l Incosciente, che non è dell Ingegnere (${J((due.cancella || []).map(x => x.id || x))})`);
const solo = M.techRecovery(conStati({ unconscious: true }));
ok(solo.applicabile === false, `su un Incosciente soltanto: non applicabile (${J(solo.motivo || '')})`);
// Controprova: chi non ha la skill non la può usare, per quanti stati abbia.
ok(M.techRecovery(Object.assign(JSON.parse(J(U(/^Alguacil \(Combi/))), { states: { immobilizedA: true } })).applicabile === false,
   'controprova: un Alguacil con IMM-A non ha la Tech-Recovery');

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
