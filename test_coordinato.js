// @versione 2026-10-12.3 | test_coordinato.js | proprieta`: chat TEST
// 2026-10-12.3: sezione "chi non partecipa" (motore 2026-10-12.8, righe 9531,
//    11384, 13806-13807, 13907): E47 Periferica nei due versi su 761
//    profili (chars o skill "Peripheral (...)"), E48 Decoy, E49 Fireteam,
//    E42 Isolato, la nota del Dispiegamento Nascosto.
// 2026-10-12.2: la sezione E44 cambia verso (motore 2026-10-12.6). Il
//    difetto e` chiuso: l'addestramento si legge anche da `chars`. Ora si
//    prova la regola (righe 11360-11361): misto Regolari + Irregolari
//    bloccato per 82 Irregolari su 82, Irregolari fra loro ammessi; e
//    Inspiring Leadership (righe 8817-8836) con Joan of Arc (Lieutenant),
//    Incosciente, in Riserva, senza la Skill Lieutenant, partecipante; e il
//    collegamento di ordine_coordinato.js, che passa window.roster.
// 2026-10-12.1: sezione E44 sui profili veri. La prova della sezione 3
//    scriveva `skills: 'Irregular'` a mano; il database lo scrive in `chars`
//    (82 profili, 41 + 41). Con un profilo vero E44 non esce: difetto aperto,
//    inchiodato qui con l'insieme nominato, segnalato a MOTORE il 12 ottobre.
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


console.log('\n=== E44 sui profili veri (motore 2026-10-12.6, righe 11360-11361) ===');
// Fino al motore 2026-10-12.2 l'addestramento si leggeva solo da skills +
// equip, e `Irregular` sta in `chars`: E44 non scattava su nessun profilo
// vero (82 su 82). Paolo, 12 ottobre: E44 resta nell'app. MOTORE l'ha
// corretto (M.haCaratteristica). Questa sezione inchiodava il difetto e ora
// prova la regola: "Only Troopers with the same Training (Regular/Irregular)
// and in the same Combat Group can participate".
global.document = global.document || { title: 'NOMADS', getElementById: () => ({ style: {}, innerHTML: '' }), querySelectorAll: () => [], addEventListener(){} };
{ const lg = console.log; console.log = () => {}; require('./database_nomad.js'); require('./database_panoceania.js'); console.log = lg; }
const DBN = window.DB_NOMADI || [], DBP = window.DB_PANOCEANIA || [];
const DBT = [...DBN, ...DBP];
const voci = (p) => String(p.chars || '').split(',').map(x => x.trim());
const irr = DBT.filter(p => voci(p).indexOf('Irregular') >= 0);
const irrN = DBN.filter(p => voci(p).indexOf('Irregular') >= 0).length;
ok(irr.length === 82 && irrN === 41, `premessa: Irregular e\` in chars di ${irr.length} profili (Nomadi ${irrN}) — se 82 cambia, e\` cambiato il database: rimisura`);
const inSkills = DBT.filter(p => /Irregular/i.test(String(p.skills || '') + ',' + String(p.equip || '')));
ok(inSkills.length === 0, `e in skills/equip non c'e\` su nessun profilo (${inSkills.length}): la prova della sezione 3 costruisce un dato che il database non ha`);
const vero = (n, id, extra) => { const p = DBT.find(x => x.nome === n); if (!p) throw new Error('assente: ' + n);
    return Object.assign(JSON.parse(JSON.stringify(p)), { id, alias: id, combatGroup: 1, states: {}, deployState: 'NORMAL', state: 'ACTIVE' }, extra || {}); };
const morlock = vero('Morlock (Kobra Pistol, DA CC)', 'mo'), morlock2 = vero('Morlock (Assault Pistol)', 'mo2');
const algA = vero('Alguacil (Combi Rifle)', 'a1'), algB = vero('Alguacil (Combi Rifle)', 'a2');
ok(voci(morlock).indexOf('Irregular') >= 0 && voci(morlock2).indexOf('Irregular') >= 0 && voci(algA).indexOf('Regular') >= 0,
   'premessa: i due Morlock sono Irregular, l Alguacil e` Regular');
const codici = (r) => r.errori.map(e => e.codice);
const conE44 = (r) => codici(r).indexOf('E44') >= 0;

// Il misto: tutti gli 82 Irregolari veri, ognuno con l'Alguacil. Insieme
// NOMINATO di chi NON da` E44: deve essere vuoto.
const senzaE44 = irr.filter(p => !conE44(M.validaCoordinato([vero(p.nome, 'x'), algA], algA))).map(p => p.nome);
ok(senzaE44.length === 0, `misto Regolare + Irregolare: E44 per tutti gli ${irr.length} Irregolari veri (senza: ${senzaE44.length})`,
   JSON.stringify(senzaE44.slice(0, 5)));
const mA = M.validaCoordinato([morlock, algA], algA);
ok(conE44(mA) && !mA.ok, `Morlock #36 + Alguacil #1: rifiutato con E44 (${JSON.stringify(codici(mA))})`);
// Irregolari fra loro: ammessi. Ogni Irregolare vero col Morlock (Assault
// Pistol): nessuno deve dare E44.
const irrConE44 = irr.filter(p => conE44(M.validaCoordinato([vero(p.nome, 'x'), morlock2], morlock2))).map(p => p.nome);
ok(irrConE44.length === 0, `Irregolari fra loro: nessun E44 per gli ${irr.length} Irregolari col Morlock (con E44: ${irrConE44.length})`,
   JSON.stringify(irrConE44.slice(0, 5)));
const mm = M.validaCoordinato([morlock, morlock2], morlock);
ok(mm.ok && codici(mm).length === 0, `Morlock + Morlock: valido, nessun errore (${JSON.stringify(codici(mm))})`);
ok(!conE44(M.validaCoordinato([algA, algB], algA)), 'CONTROPROVA: Alguacil + Alguacil, nessun E44');
// La sezione 3 scriveva Irregular nelle skills: anche quella strada resta.
const morlockSk = Object.assign(JSON.parse(JSON.stringify(algB)), { skills: algB.skills + ', Irregular' });
ok(conE44(M.validaCoordinato([morlockSk, algA], algA)), 'Irregular scritto nelle skills (sezione 3) da` ancora E44: si leggono tutti e due i campi');

console.log('\n=== Inspiring Leadership (righe 8817-8836) ===');
// Con un Luogotenente che ha Inspiring Leadership, sul tavolo e non in uno
// Stato Null, tutte le truppe che danno Ordini hanno Training Regolare
// (8830-8831): E44 non scatta e compare una nota. Se partecipa, il costo e`
// solo il suo Ordine Speciale (8834-8836). Nel database la Skill c'e` solo in
// PanOceania, su Joan of Arc.
const conIL = DBT.filter(p => /Inspiring Leadership/i.test(String(p.skills || '')));
ok(conIL.length > 0 && conIL.every(p => /^Joan /i.test(p.nome) && DBP.indexOf(p) >= 0),
   `premessa: Inspiring Leadership su ${conIL.length} profili, tutti Joan of Arc, tutti PanOceania`);
const joan = vero('Joan of Arc (Lieutenant)', 'joan'), helot = vero('Helot Militiaman (Surprise Attack [-3], Camouflage, Shock Marksman Rifle)', 'he'),
      fus = vero('Fusilier (Combi Rifle)', 'fu');
ok(voci(helot).indexOf('Irregular') >= 0 && voci(fus).indexOf('Regular') >= 0 && /Lieutenant/.test(joan.skills),
   'premessa: Helot Irregular, Fusilier Regular, Joan (Lieutenant) ha la Skill Lieutenant');
const notaIL = (r) => r.note.some(n => /Inspiring Leadership/.test(n) && /Regolare/.test(n));
const notaCosto = (r) => r.note.some(n => /Ordine Speciale del Luogotenente/.test(n));
const conJoan = M.validaCoordinato([helot, fus], fus, { rosterAlleato: [joan, helot, fus] });
ok(!conE44(conJoan) && notaIL(conJoan), `Helot + Fusilier, Joan nel roster: nessun E44, e la nota (${JSON.stringify(codici(conJoan))})`);
ok(!notaCosto(conJoan), 'Joan non partecipa: nessuna nota sul costo');
ok(conE44(M.validaCoordinato([helot, fus], fus, { rosterAlleato: [helot, fus] })), 'CONTROPROVA: senza Joan nel roster, E44');
ok(conE44(M.validaCoordinato([helot, fus], fus)), 'CONTROPROVA: senza rosterAlleato, E44 (il motore non puo` sapere)');
const joanKO = vero('Joan of Arc (Lieutenant)', 'joan', { states: { unconscious: true } });
ok(M.eNullo(joanKO), 'premessa: Joan Incosciente e` in uno Stato Null');
ok(conE44(M.validaCoordinato([helot, fus], fus, { rosterAlleato: [joanKO, helot, fus] })), 'Joan Incosciente: E44 torna');
ok(conE44(M.validaCoordinato([helot, fus], fus, { rosterAlleato: [vero('Joan of Arc (Lieutenant)', 'joan', { deployState: 'RESERVE' }), helot, fus] })),
   'Joan in Riserva (non sul tavolo): E44 torna');
ok(conE44(M.validaCoordinato([helot, fus], fus, { rosterAlleato: [vero('Joan of Arc', 'joan'), helot, fus] })),
   'Joan of Arc SENZA la Skill Lieutenant: E44 — conta solo il Luogotenente');
const joanDentro = M.validaCoordinato([joan, helot], joan, { rosterAlleato: [joan, helot, fus] });
ok(!conE44(joanDentro) && notaIL(joanDentro) && notaCosto(joanDentro),
   `Joan partecipa con l Helot: nessun E44, nota Inspiring Leadership e nota sul costo (${JSON.stringify(codici(joanDentro))})`);
const dueReg = M.validaCoordinato([fus, joan], fus, { rosterAlleato: [joan, fus] });
ok(!notaIL(dueReg), 'Joan nel roster ma truppe tutte Regolari: la nota sul Training non serve e non compare');

console.log('\n=== La pagina passa il roster (ordine_coordinato.js 2026-10-12.1) ===');
{
    const vm = require('vm'), fs = require('fs');
    const avvisi = []; let procede = 0;
    const g = { MotoreN5: M, console: { log() {}, warn() {}, error() {} }, alert: (m) => { avvisi.push(String(m)); },
        document: { getElementById: () => ({ style: {}, innerHTML: '', classList: { add() {}, remove() {} } }), querySelectorAll: () => [] },
        setTimeout: () => 0, clearTimeout() {} };
    g.window = g;
    vm.createContext(g);
    vm.runInContext(fs.readFileSync(__dirname + '/ordine_coordinato.js', 'utf8'), g, { filename: 'ordine_coordinato.js' });
    g.procediAlleAzioni = () => { procede++; };
    const prova = (roster) => { avvisi.length = 0; procede = 0; g.roster = roster;
        g.selectedCoordinatedUnits = [helot, fus]; g.spearheadUnit = fus; g.confermaCoordinato(); return { avvisi: avvisi.slice(), procede }; };
    const r1 = prova([joan, helot, fus]);
    ok(r1.procede === 1 && r1.avvisi.length === 0, `con Joan nel window.roster: il Coordinato procede, nessun avviso (${JSON.stringify(r1)})`);
    const r2 = prova([helot, fus]);
    ok(r2.procede === 0 && r2.avvisi.some(a => /Addestramento diverso/.test(a)), 'CONTROPROVA: senza Joan, la pagina rifiuta con il messaggio di E44');
}


console.log('\n=== Chi non partecipa a un Coordinato (motore 2026-10-12.8) ===');
// E47: le Periferiche (righe 9531 e 11384). Il motore le riconosce da `chars`
// ("Peripheral") o dalla skill "Peripheral (...)". Insieme dei profili che
// danno E47, coordinati con l'Alguacil, contro l'insieme di chi porta una
// delle due scritte: nei due versi, su tutti i profili.
const ePer = (p) => voci(p).indexOf('Peripheral') >= 0 || /Peripheral\s*\(/i.test(String(p.skills || ''));
const conE47 = (r) => codici(r).indexOf('E47') >= 0;
const attesiE47 = new Set(DBT.filter(ePer).map(p => p.id));
const vistiE47 = new Set(DBT.filter(p => conE47(M.validaCoordinato([vero(p.nome, 'x'), algA], algA))).map(p => p.id));
const soloVisti = [...vistiE47].filter(x => !attesiE47.has(x)), soloAttesi = [...attesiE47].filter(x => !vistiE47.has(x));
ok(attesiE47.size === 42 && soloVisti.length === 0 && soloAttesi.length === 0,
   `E47: le ${attesiE47.size} Periferiche, e solo loro, su ${DBT.length} profili (comparse ${soloVisti.length}, sparite ${soloAttesi.length}) — se 42 cambia, rimisura`,
   JSON.stringify({ soloVisti: soloVisti.slice(0, 5), soloAttesi: soloAttesi.slice(0, 5) }));
// Il caso di MOTORE: un Puppetbot "Battle Ravaged" non ha `chars`, ha solo la skill.
const pbBR = DBT.find(p => /^Puppetbot/.test(p.nome) && / - Battle Ravaged/.test(p.nome));
ok(pbBR && !pbBR.chars && /Peripheral \(Control\)/.test(pbBR.skills) && conE47(M.validaCoordinato([vero(pbBR.nome, 'pb'), algA], algA)),
   `${pbBR && pbBR.nome}: senza chars, con la sola skill Peripheral (Control): E47`);
const pm = DBT.find(p => p.nome === 'Puppet Masters');
ok(pm && !conE47(M.validaCoordinato([vero(pm.nome, 'pm'), algA], algA)), 'CONTROPROVA: i Puppet Masters (chi controlla) non danno E47');
const errDi = (extra) => codici(M.validaCoordinato([vero('Alguacil (Combi Rifle)', 'a9', extra), algA], algA));
ok(errDi({ states: { decoy: true } }).indexOf('E48') >= 0, 'E48: un Alguacil in stato Decoy');
ok(errDi({ states: { fireteam: 'A' } }).indexOf('E49') >= 0, 'E49: un Alguacil membro del Fireteam A');
ok(errDi({ states: { fireteam: '' } }).indexOf('E49') < 0 && errDi({ states: { fireteam: '   ' } }).indexOf('E49') < 0,
   'CONTROPROVA: il campo fireteam vuoto (o di soli spazi) non da` E49');
ok(errDi({ states: { isolated: true } }).indexOf('E42') >= 0, 'Isolato: resta bloccato con E42');
const hid = M.validaCoordinato([vero('Alguacil (Combi Rifle)', 'a9', { deployState: 'HIDDEN' }), algA], algA);
ok(hid.ok && hid.note.some(n => /Dispiegamento Nascosto/.test(n) && /perde il proprio Ordine/.test(n)),
   `Dispiegamento Nascosto: nessun blocco, solo la nota (${JSON.stringify(codici(hid))})`);
const pulito = M.validaCoordinato([vero('Alguacil (Combi Rifle)', 'a9'), algA], algA);
ok(pulito.ok && !pulito.note.some(n => /Dispiegamento Nascosto/.test(n)), 'CONTROPROVA: due Alguacil normali, nessun errore e nessuna nota');

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
