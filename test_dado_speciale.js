// @versione 2026-09-29.1 | test_dado_speciale.js | proprieta`: chat TEST
// ================================================================
// Il dado speciale (+1SD): un dado in più da tirare e poi scartare, che NON
// aumenta il Burst e non consuma usi.
// Il motore lo calcolava da giorni, ma non arrivava allo scontro: al tavolo
// nessuno sapeva di tirarlo. È la forma della settimana — un valore giusto
// che non raggiunge chi lo deve usare — e per questo le prove guardano DOVE
// finisce, non solo quanto vale.
// Con il Burst diviso fra più bersagli il dado va a UNO solo (wiki, Skills
// and Equipment Module): quello marcato, altrimenti il primo con dadi.
// ================================================================
let passati = 0, falliti = 0;
const ok = (c, m) => { if (c) { passati++; console.log('  ✅ ' + m); } else { falliti++; console.log('  ❌ ' + m); } };
const J = JSON.stringify;

global.window = global;
require('./catalogo_n5.js'); require('./database_comune.js');
require('./database_nomad.js'); require('./database_panoceania.js');
const M = require('./motore_regole_n5.js');
const T = [].concat(window.DB_NOMADI, window.DB_PANOCEANIA);
const U = (re) => Object.assign(JSON.parse(J(T.find(x => re.test(x.nome)))), { states: {} });

const trig = U(/^Triggermen \(BS Attack \[\+1B\], MULTI Sniper/);
const fus = U(/^Fusilier \(Combi/), orc = U(/^Orc \(Heavy Machine/);
const arma = M.profiloArma('Combi Rifle');
M._rosterProprio = [trig]; M._rosterNemico = [fus, orc];
const ctx = { trovaUnita: (n, id) => [trig, fus, orc].find(u => u.id === id || u.nome === M.nomeUnita(n) || u.nome === n) || null };

console.log('\n=== 1. Da dove viene il dado ===');
ok(/BS Attack \(\+1SD\)/.test(trig.skills || ''), 'i Triggermen hanno BS Attack (+1SD) nel profilo');
ok(M.dadiSpeciali(trig, arma, { azione: M.AZIONI.BS_ATTACK }) === 1,
   `un dado speciale in Attacco BS (${M.dadiSpeciali(trig, arma, { azione: M.AZIONI.BS_ATTACK })})`);
ok(M.dadiSpeciali(trig, arma, { azione: M.AZIONI.CC_ATTACK }) === 0,
   'e nessuno in mischia: la notazione dice BS Attack, e vale solo per quella');
ok(M.dadiSpeciali(U(/^Alguacil \(Combi/), arma, { azione: M.AZIONI.BS_ATTACK }) === 0,
   'controprova: un Alguacil non ne ha');

console.log('\n=== 2. Non aumenta il Burst ===');
// È la differenza con (+1B), e si vede solo affiancandole: stessa forma
// "+1", effetti diversi.
const burst = M.burstIniziale(trig, arma, { azione: M.AZIONI.BS_ATTACK }).valore;
ok(burst === arma.burst, `il Burst resta quello dell arma: ${burst} contro ${arma.burst}`);

console.log('\n=== 3. Arriva allo scontro, e a UNO solo ===');
const attacco = (bersagli) => {
    const a = M.creaAttacco({ azione: M.AZIONI.BS_ATTACK, attaccante: trig, arma: arma, bersagli: bersagli });
    if (!a.ok) return { errori: (a.errori || []).map(e => e.codice) };
    return M.risolviPayload(M.creaPayload([a.attacco], {}).payload, [], ctx);
};
const uno = attacco([{ nome: fus.nome, burst: 3, rangeIndex: 1, rangeMod: 3 }]);
ok(uno.length === 1 && uno[0].attivo.sd === 1, `un bersaglio solo: il dado è nel suo scontro (sd ${uno[0] && uno[0].attivo.sd})`);
const due = attacco([{ nome: fus.nome, burst: 2, rangeIndex: 1, rangeMod: 3 },
                     { nome: orc.nome, burst: 1, rangeIndex: 1, rangeMod: 3 }]);
const conSd = due.filter(s => s.attivo.sd > 0);
ok(due.length === 2, `due bersagli, due scontri (${due.length})`);
ok(conSd.length === 1, `e il dado speciale sta in UNO solo (${conSd.length})`);
ok(conSd[0] && /Fusilier/.test(conSd[0].reattivo.nome),
   `nel primo con dadi assegnati: ${conSd[0] && conSd[0].reattivo.nome}`);

console.log('\n=== 4. Il bersaglio marcato lo prende lui ===');
const marcato = attacco([{ nome: fus.nome, burst: 2, rangeIndex: 1, rangeMod: 3 },
                         { nome: orc.nome, burst: 1, rangeIndex: 1, rangeMod: 3, dadoSpeciale: true }]);
const suMarcato = marcato.filter(s => s.attivo.sd > 0);
ok(suMarcato.length === 1 && /Orc/.test(suMarcato[0].reattivo.nome),
   `marcando l Orc, il dado va a lui (${suMarcato[0] && suMarcato[0].reattivo.nome})`);
// Controprova: senza la marcatura tornerebbe al primo. Le due insieme dicono
// che la scelta la fa il giocatore, non l'ordine dell'elenco.
ok(/Fusilier/.test(conSd[0].reattivo.nome) && /Orc/.test(suMarcato[0].reattivo.nome),
   'senza marcatura al primo, con la marcatura al marcato');

console.log('\n=== 5. E chi tira lo legge sul tabellone ===');
// Il numero nello scontro (sd) è il dato; la frase che il giocatore legge la
// scrive l'adattatore. Si guardano tutti e due, perché è proprio fra i due
// che il dado si era perso: il motore lo calcolava e nessuno lo mostrava.
require('./calcolatore_math.js');
window.gameState = { activeFaction: 'NOMADI', nomads: [trig], panoceania: [fus, orc] };
const vista = window.generaRisoluzioneDaDati({ attivo: trig.nome, attacchi: [{
    attaccante: trig.nome, arma: arma, azione: 'ATTACCO BS',
    bersagli: [{ nome: fus.nome, burst: 3, rangeIndex: 1, rangeMod: 3 }] }] }, [])[0];
const testo = String(vista.attivo.dettagliMod || '').replace(/<[^>]*>/g, ' ');
ok(vista.attivo.sd === 1, `il dato arriva alla vista (sd ${vista.attivo.sd})`);
ok(/dado in pi/i.test(testo), `e la frase lo dice: ${testo.replace(/\s+/g, ' ').match(/[^.]*dado in pi[^.]*/i)}`);
ok(/scartan/i.test(testo), 'compreso che poi se ne scarta uno');
// Controprova: chi non ha il (+1SD) non legge quella frase — altrimenti
// sarebbe una riga fissa che compare sempre.
const senza = window.generaRisoluzioneDaDati({ attivo: fus.nome, attacchi: [{
    attaccante: fus.nome, arma: arma, azione: 'ATTACCO BS',
    bersagli: [{ nome: trig.nome, burst: 3, rangeIndex: 1, rangeMod: 3 }] }] }, [])[0];
ok(!/dado in pi/i.test(String(senza.attivo.dettagliMod || '')),
   'controprova: il Fusiliere non ha il dado speciale e non legge la frase');

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
