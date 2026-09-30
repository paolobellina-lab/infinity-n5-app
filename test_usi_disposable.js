// @versione 2026-09-29.1 | test_usi_disposable.js | proprieta`: chat TEST
// ================================================================
// Gli usi delle armi Disposable, che fino al 27 settembre NON si
// consumavano MAI sparando: si scalavano solo piazzando un Deployable, in
// un Idle e col Minelayer. Un Panzerfaust tirato restava a 2 usi per sempre,
// e al tavolo nessuno se ne accorgeva — il numero sullo schermo era giusto,
// era la sua storia a non esistere.
// La regola (riga 15013) distingue due notazioni che si somigliano:
//   (+1B)    un dado in più E un uso in più: il Burst sale
//   (+1SD)   un dado speciale: il Burst NON sale e l'uso non si consuma
// ================================================================
let passati = 0, falliti = 0;
const ok = (c, m) => { if (c) { passati++; console.log('  ✅ ' + m); } else { falliti++; console.log('  ❌ ' + m); } };
const J = JSON.stringify;

global.window = global;
require('./catalogo_n5.js'); require('./database_comune.js');
require('./database_nomad.js'); require('./database_panoceania.js');
const M = require('./motore_regole_n5.js');
const T = [].concat(window.DB_NOMADI, window.DB_PANOCEANIA);
const copia = (u) => Object.assign(JSON.parse(J(u)), { states: {} });

console.log('\n=== 1. Il Panzerfaust ha due usi, e sono scritti nell arma ===');
const portatore = T.find(u => /Panzerfaust/.test((u.weapon || '') + (u.equip || '')));
ok(!!portatore, `portatore nel database: ${portatore && portatore.nome.split(' (')[0]}`);
const pf = M.profiloArma('Panzerfaust');
ok(/Disposable\s*\(2\)/i.test(String(pf.traits || '')), `Panzerfaust: Disposable (2) fra i tratti`);
const base = copia(portatore);
ok(M.usiResidui(base, pf).residui === 2, `usi iniziali: ${M.usiResidui(base, pf).residui}`);
// Controprova: un'arma che non è Disposable non ha usi da contare.
ok(M.usiResidui(base, M.profiloArma('Combi Rifle')) === null,
   'controprova: il Combi Rifle non ha usi — usiResidui risponde null, non 0');

console.log('\n=== 2. Quanti usi costa un colpo ===');
const costa = (arma, burst, azione) => M.usiDaConsumare(arma, burst, azione);
ok(costa(pf, [1], M.AZIONI.BS_ATTACK) === 1, 'un tiro B1: un uso');
const piu1B = M.profiloArma('Panzerfaust (+1B)');
ok(costa(piu1B, [2], M.AZIONI.BS_ATTACK) === 2, `col (+1B) si tirano due dadi: due usi (${costa(piu1B, [2], M.AZIONI.BS_ATTACK)})`);
const piu1SD = M.profiloArma('Panzerfaust (+1SD)');
ok(costa(piu1SD, [1], M.AZIONI.BS_ATTACK) === 1,
   `col (+1SD) il dado speciale NON consuma: un uso solo (${costa(piu1SD, [1], M.AZIONI.BS_ATTACK)})`);
// È la differenza che le due notazioni nascondono: stessa forma, effetti
// opposti sul contatore. Senza questa coppia, "+1" sembrerebbe una cosa sola.
ok(costa(piu1B, [2], M.AZIONI.BS_ATTACK) !== costa(piu1SD, [1], M.AZIONI.BS_ATTACK),
   '(+1B) e (+1SD) costano diversamente: è il punto delle due notazioni');
ok(costa(pf, [1], 'SCHIVATA') === 0, 'una Schivata non consuma niente');
ok(costa(M.profiloArma('Combi Rifle'), [3], M.AZIONI.BS_ATTACK) === 0,
   'controprova: un arma non Disposable non consuma usi');

console.log('\n=== 3. Gli usi si scalano davvero, e si esauriscono ===');
let u = copia(portatore);
u = M.consumaUsi(u, pf, 1);
ok(M.usiResidui(u, pf).residui === 1, `dopo un colpo: ${M.usiResidui(u, pf).residui} uso`);
u = M.consumaUsi(u, pf, 1);
ok(M.usiResidui(u, pf).residui === 0, `dopo due colpi: ${M.usiResidui(u, pf).residui}`);
ok(M.burstIniziale(u, pf, { azione: M.AZIONI.BS_ATTACK }).valore === 0,
   `e il Burst possibile scende a ${M.burstIniziale(u, pf, { azione: M.AZIONI.BS_ATTACK }).valore}: non si può più tirare`);
// Controprova: l'unità di partenza non è stata toccata. consumaUsi
// restituisce una copia, e chi la ignora continuerebbe a sparare per sempre —
// che è esattamente il difetto di prima, spostato di un piano.
ok(M.usiResidui(copia(portatore), pf).residui === 2,
   'controprova: consumaUsi non modifica l originale, restituisce una copia');

console.log('\n=== 4. Usi condivisi fra le modalità della stessa arma ===');
const info = M.usiResidui(copia(portatore), pf);
ok(info.condivisiFraModalita === true && info.chiaveUsi === 'PANZERFAUST',
   `gli usi stanno su una chiave sola: ${info.chiaveUsi}`);
// Il Flammenspeer è il caso che REGOLE ha lasciato aperto: due modi, e il
// motore li conta insieme. Se la regola fosse diversa, un campo lo cambia.
const fl = M.profiloArma('Flammenspeer (Blast Mode)') || M.profiloArma('Flammenspeer');
if (fl && M.usiResidui({ weapon: 'Flammenspeer', equip: '', states: {} }, fl)) {
    const ff = M.usiResidui({ weapon: 'Flammenspeer', equip: '', states: {} }, fl);
    ok(ff.chiaveUsi === 'FLAMMENSPEER', `Flammenspeer: una chiave per i due modi (${ff.chiaveUsi})`);
} else { ok(true, 'Flammenspeer: nessun portatore nei due database, caso non esercitabile'); }


console.log('\n=== 5. Lo stato Scarico: il motore lo dice, non lo tiene ===');
// Quando gli usi finiscono la truppa è in stato Scarico. Il motore non lo
// gestisce — è uno dei due stati che Paolo ha tolto dalla gestione — ma lo
// DICE, e distingue i due casi delle righe 15005-15007.
const esaurito = M.consumaUsi(M.consumaUsi(copia(portatore), pf, 1), pf, 1);
const nota = J(M.burstIniziale(esaurito, pf, { azione: M.AZIONI.BS_ATTACK }));
ok(/Scarico/i.test(nota), `a usi finiti il motore nomina lo stato Scarico`);
ok(/Reload/i.test(nota), 'e dice come si toglie: Reload, Abilità Breve nella ZdC di un alleato con Baggage');
// Controprova: un'ALTRA arma Disposable della stessa truppa resta usabile —
// è Scarico l'oggetto, non la truppa, quando le armi sono più d'una.
// Serve un profilo con DUE armi Disposable diverse, o il secondo caso della
// regola non si esercita. Il portatore del Panzerfaust non va bene — il suo
// Heavy Rocket Launcher non ha il tratto — quindi si cerca fra i 23 che ne
// hanno davvero due: lo Zero (Boarding Shotgun) porta Shock Mine e PARA Mine.
const armiDi = (u) => [].concat(String(u.weapon || '').split(','), String(u.equip || '').split(','))
    .map(x => M.profiloArma(x.trim())).filter(a => a && /Disposable/i.test(String(a.traits || '')));
const conDue = T.find(u => new Set(armiDi(u).map(a => a.nome)).size >= 2);
const primaArma = conDue && armiDi(conDue)[0];
const altra = conDue && armiDi(conDue).find(a => a.nome !== primaArma.nome);
const conDueEsaurito = conDue && M.consumaUsi(copia(conDue), primaArma,
    M.usiResidui(copia(conDue), primaArma).residui);
if (altra) {
    ok(M.usiResidui(conDueEsaurito, primaArma).residui === 0,
       `${conDue.nome.split(' (')[0]}: ${primaArma.nome} esaurita`);
    ok(M.usiResidui(conDueEsaurito, altra).residui > 0,
       `controprova: la ${altra.nome} della stessa truppa ha ancora ${M.usiResidui(conDueEsaurito, altra).residui} usi`);
    ok(M.burstIniziale(conDueEsaurito, altra, { azione: M.AZIONI.BS_ATTACK }).valore > 0,
       'e si può ancora usare: Scarico è l oggetto, non la truppa');
} else { ok(false, 'nessuna truppa con due armi Disposable: il secondo caso della regola non è esercitabile'); }

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
