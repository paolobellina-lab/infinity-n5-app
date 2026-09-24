// @versione 2026-09-23.1 | test_coordinato.js | proprieta`: chat TEST
// Test dell'Ordine Coordinato — node test_coordinato.js
global.window = global;
require('./catalogo_n5.js'); require('./database_comune.js');
const M = require('./motore_regole_n5.js');

let passati = 0, falliti = 0;
function ok(c, n, e) { if (c) { passati++; console.log(`  ✅ ${n}`); } else { falliti++; console.log(`  ❌ ${n}${e ? '\n       ' + e : ''}`); } }

const hmg = M.profiloArma('Heavy Machine Gun');   // B4
const combi = M.profiloArma('Combi Rifle');       // B3
const pistol = M.profiloArma('Pistol');           // B2
const ccw = M.profiloArma('CC Weapon');

function u(alias, extra) {
    return Object.assign({ alias: alias, bs: 11, cc: 13, ph: 10, wip: 12, arm: 1,
                           combatGroup: 1, skills: '', states: {} }, extra || {});
}
function b(unita, arma, i) {
    return M.burstIniziale(unita, arma, { azione: M.AZIONI.BS_ATTACK, coordMode: true, indiceCoord: i }).valore;
}

console.log('\n=== 1. IL BUG: la Punta di Lancia usa METÀ del Burst ===');
ok(b(u('P'), hmg, 0) === 2, `HMG B4 -> Punta B2, non B4 (ottenuto ${b(u('P'), hmg, 0)})`);
ok(b(u('P'), combi, 0) === 2, 'Combi B3 -> Punta B2 (metà arrotondata per ECCESSO)');
ok(b(u('P'), pistol, 0) === 1, 'Pistol B2 -> Punta B1');
ok(b(u('P'), M.profiloArma('Missile Launcher (Blast Mode)'), 0) === 1, 'B1 resta B1');
ok(b(u('G'), hmg, 1) === 1 && b(u('G'), combi, 1) === 1, 'i gregari scendono sempre a 1');

console.log('\n=== 2. Il Fireteam invece ha il Burst PIENO ===');
const leader = M.burstIniziale(u('L'), hmg, { azione: M.AZIONI.BS_ATTACK, membriFireteam: 5 });
ok(leader.valore === 4,
   'Leader di Fireteam con HMG: B4 pieno — i due casi non vanno confusi');

console.log('\n=== 3. Il Burst si vede da dove viene ===');
const dett = M.burstIniziale(u('P'), hmg, { azione: M.AZIONI.BS_ATTACK, coordMode: true, indiceCoord: 0 });
ok(dett.voci.some(v => v.fonte === 'coordinato' && /metà/i.test(v.motivo)),
   'la voce spiega che è metà del Burst');

console.log('\n=== 4. Corpo a Corpo: solo la Punta tira ===');
const greg = M.burstCC(u('G'), ccw, { coordMode: true, indiceCoord: 1 });
ok(greg.valore === 0 && greg.nonTira === true,
   'i gregari in mischia NON tirano affatto: solo la Punta esegue il CC Roll');
[[0, 1], [1, 2], [3, 4]].forEach(function (c) {
    const p = M.burstCC(u('P'), ccw, { coordMode: true, indiceCoord: 0, partecipantiIngaggiati: c[0] });
    ok(p.valore === c[1], `Punta con ${c[0]} alleati dell Ordine ingaggiati: B${c[1]}`);
});
const conBonus = M.burstCC(u('P'), ccw, { coordMode: true, indiceCoord: 0, partecipantiIngaggiati: 2 });
ok(conBonus.note.some(n => n.includes('PH')), 'e la nota ricorda il +PH al danno');

console.log('\n=== 5. Chi può essere attivato ===');
ok(M.puoEssereAttivata(u('X')).puo === true, 'unità normale: attivabile');
[['morto', { }, 'DEAD'], ['incosciente', { unconscious: true }],
 ['isolato', { isolated: true }], ['disconnesso', { disconnected: true }]
].forEach(function (c) {
    const unita = c[2] ? u('X', { state: 'DEAD' }) : u('X', { states: c[1] });
    const e = M.puoEssereAttivata(unita);
    ok(e.puo === false && e.motivo, `${c[0]}: non attivabile, col motivo`);
});

const sopp = u('S', { states: { suppressive: true } });
const es = M.puoEssereAttivata(sopp);
ok(es.puo === true && es.annullaSoppressione === true,
   'in Soppressione: attivabile, ma l attivazione annulla lo stato');

console.log('\n=== 6. Validazione del gruppo ===');
const g1 = u('A'), g2 = u('B'), g3 = u('C'), g4 = u('D'), g5 = u('E');
ok(M.validaCoordinato([g1, g2], g1).ok, 'due unità con Punta: valido');
ok(!M.validaCoordinato([g1, g2], null).ok, 'senza Punta di Lancia: rifiutato');
ok(!M.validaCoordinato([], null).ok, 'gruppo vuoto: rifiutato');

const cinque = M.validaCoordinato([g1, g2, g3, g4, g5], g1);
ok(!cinque.ok && cinque.errori.some(e => e.codice === 'E41'), 'cinque unità: oltre il massimo di 4');

const altroGruppo = u('F', { combatGroup: 2 });
const misti = M.validaCoordinato([g1, altroGruppo], g1);
ok(!misti.ok && misti.errori.some(e => e.codice === 'E43'), 'Gruppi di Combattimento diversi: rifiutato');

// 🔴 controllo che il modulo non faceva
const irregolare = u('I', { skills: 'Irregular' });
const addMisti = M.validaCoordinato([g1, irregolare], g1);
ok(!addMisti.ok && addMisti.errori.some(e => e.codice === 'E44'),
   'Regolare con Irregolare: rifiutato (il modulo non lo controllava)');

const conKo = M.validaCoordinato([g1, u('KO', { states: { unconscious: true } })], g1);
ok(!conKo.ok && conKo.errori.some(e => e.codice === 'E42'), 'un Incosciente nel gruppo: rifiutato');

const fuori = M.validaCoordinato([g1, g2], u('Z'));
ok(!fuori.ok && fuori.errori.some(e => e.codice === 'E46'), 'Punta non fra i selezionati: rifiutato');

console.log('\n=== 7. Le regole che l app non può far rispettare sono ricordate ===');
const v = M.validaCoordinato([g1, g2], g1);
ok(/Command Token/i.test(v.costo), 'il costo in Command Token è ricordato');
ok(/stesso singolo bersaglio/i.test(v.stessoBersaglio), 'e la regola del bersaglio unico');
ok(/STESSA/i.test(v.stessaSequenza), 'e quella della stessa sequenza di Abilità');

console.log('\n=== 8. Riepilogo dei dadi del gruppo ===');
const rie = M.burstCoordinato([u('Punta'), u('G1'), u('G2')], [hmg, combi, pistol], M.AZIONI.BS_ATTACK);
ok(rie.length === 3, 'tre unità, tre righe');
ok(rie[0].punta === true && rie[0].burst === 2, 'la Punta: B2');
ok(rie[1].burst === 1 && rie[2].burst === 1, 'i gregari: B1 ciascuno');
console.log('   ' + rie.map(r => `${r.nome} B${r.burst}${r.punta ? ' (punta)' : ''}`).join(' | '));

console.log('\n=== 9. IL LIVELLO DEL FIRETEAM non è il numero di membri ===');
function ft(nomi) { return nomi.map((n, i) => ({ nome: n, alias: n + i, bs: 11, ph: 10 })); }

ok(M.livelloFireteam(ft(['Fusilier', 'Fusilier', 'Fusilier', 'Fusilier', 'Fusilier'])).livello === 5,
   '5 Fusilier: Livello 5');
const misto = M.livelloFireteam(ft(['Fusilier', 'Bolt', 'Auxilia', 'Machinist', 'Trauma-Doc']));
ok(misto.livello === 1,
   `5 truppe di Unità DIVERSE: Livello 1, non 5 (ottenuto ${misto.livello})`);
ok(misto.membri === 5, 'i membri restano 5: livello e conteggio sono cose diverse');
ok(M.livelloFireteam(ft(['Fusilier', 'Fusilier', 'Fusilier', 'Fusilier', 'Bolt'])).livello === 4,
   '4 Fusilier + 1 Bolt: Livello 4');
ok(M.livelloFireteam(ft(['Fusilier', 'Fusilier', 'Fusilier', 'Bolt', 'Bolt'])).livello === 3,
   '3 Fusilier + 2 Bolt: Livello 3');

// le opzioni fra parentesi non cambiano l Unità
ok(M.livelloFireteam(ft(['Grenzer (Missile Launcher)', 'Grenzer (Red Fury)', 'Grenzer (Marksmanship)'])).livello === 3,
   'tre Grenzer con opzioni diverse: sempre la stessa Unità, Livello 3');

// la Fireteams Chart può dichiarare equivalenze ("Griffin (Fennec)")
const conEquiv = M.livelloFireteam(
    ft(['Fennec', 'Fennec', 'Fennec', 'Fennec', 'Griffin']), { 'GRIFFIN': 'FENNEC' });
ok(conEquiv.livello === 5, 'con le equivalenze della Fireteams Chart: 4 Fennec + 1 Griffin = Livello 5');

console.log('\n=== 10. I bonus seguono il Livello ===');
const b1 = M.bonusFireteam(ft(['Fusilier', 'Bolt', 'Auxilia', 'Machinist', 'Trauma-Doc']));
ok(b1.sd === 0 && b1.discover === 0 && b1.dodge === 0 && b1.bs === 0 && !b1.sestoSenso,
   'Livello 1: NESSUN bonus (prima ne riceveva cinque)');
ok(b1.ordineUnico === true, 'ma i membri si attivano comunque con un solo Ordine');

const b5 = M.bonusFireteam(ft(['Fusilier', 'Fusilier', 'Fusilier', 'Fusilier', 'Fusilier']));
ok(b5.sd === 1 && b5.discover === 3 && b5.dodge === 1 && b5.bs === 1 && b5.sestoSenso,
   'Livello 5: tutti e cinque i bonus');
const b3 = M.bonusFireteam(ft(['Fusilier', 'Fusilier', 'Fusilier', 'Bolt', 'Bolt']));
ok(b3.sd === 1 && b3.discover === 3 && b3.dodge === 1 && b3.bs === 0 && !b3.sestoSenso,
   'Livello 3: si ferma a Discover e Schivata');

console.log('\n=== 11. Il bonus arriva al calcolo ===');
const tiratore = { alias: 'T', bs: 11, ph: 10, skills: '', states: {} };
const bersaglio = { alias: 'B', arm: 1, skills: '', states: {} };
const combiFT = M.profiloArma('Combi Rifle');
const senza = M.modAttacco(tiratore, bersaglio, combiFT, M.AZIONI.BS_ATTACK, { rangeIndex: 1 });
const conL4 = M.modAttacco(tiratore, bersaglio, combiFT, M.AZIONI.BS_ATTACK,
    { rangeIndex: 1, fireteam: ft(['Fusilier', 'Fusilier', 'Fusilier', 'Fusilier']) });
ok(conL4.valore === senza.valore + 1, 'Fireteam di Livello 4: +1 BS');
const conL1 = M.modAttacco(tiratore, bersaglio, combiFT, M.AZIONI.BS_ATTACK,
    { rangeIndex: 1, fireteam: ft(['Fusilier', 'Bolt', 'Auxilia', 'Machinist']) });
ok(conL1.valore === senza.valore, '4 truppe di Unità diverse: Livello 1, nessun +1 BS');

// e la Schivata
const sd3 = M.modSchivata(tiratore, { haLoFVersoAttaccante: true, fireteam: ft(['Fusilier', 'Fusilier', 'Fusilier']) });
ok(sd3.valore === 11, 'Livello 3: +1 alla Schivata');
const sd1 = M.modSchivata(tiratore, { haLoFVersoAttaccante: true, fireteam: ft(['Fusilier', 'Bolt', 'Auxilia']) });
ok(sd1.valore === 10, 'Livello 1: nessun bonus alla Schivata');

console.log('\n=== 12. Chi passa ancora il conteggio viene avvisato ===');
const vecchioModo = M.modAttacco(tiratore, bersaglio, combiFT, M.AZIONI.BS_ATTACK,
    { rangeIndex: 1, membriFireteam: 5 });
ok(vecchioModo.avvisi.some(a => a.codice === 'A99'),
   'passando il numero di membri il motore avvisa che è il valore sbagliato');

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
