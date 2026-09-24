// @versione 2026-09-23.1 | test_reazione.js | proprieta`: chat TEST
// ================================================================
// Il lato reattivo: chi reagisce quando l'attivo non tira, e quanti dadi
// tira chi ha Total Reaction o Neurocinetics.
//
// Nasce da due correzioni del motore 2026-09-23.3:
//   - "io muovo, tu mi spari": il blocco dei reattivi non bersagliati stava
//     DENTRO il ciclo sugli attacchi, quindi con zero attacchi non girava e
//     l'Hub stampava "NESSUN TIRO DI DADO DA EFFETTUARE" (trovato da Paolo
//     al tavolo).
//   - Neurocinetics: il Burst pieno in ARO si leggeva dal CONTENITORE
//     "MULTI Sniper Rifle", che non ha Burst proprio: null -> 1.
// ================================================================
let passati = 0, falliti = 0;
const ok = (c, m) => { if (c) { passati++; console.log('  ✅ ' + m); } else { falliti++; console.log('  ❌ ' + m); } };
const J = JSON.stringify;

global.window = global;
require('./catalogo_n5.js'); require('./database_comune.js');
require('./database_nomad.js'); require('./database_panoceania.js');
const M = require('./motore_regole_n5.js');
const U = (db, n) => Object.assign(JSON.parse(J(db.find(u => u.nome === n))), { states: {} });
const alg = U(window.DB_NOMADI, 'Alguacil (Combi Rifle)');
const fus = U(window.DB_PANOCEANIA, 'Fusilier (Combi Rifle)');
M._rosterProprio = [alg]; M._rosterNemico = [fus];
const ctx = { trovaUnita: (n) => [alg, fus].find(u => u.nome === n) || { alias: n } };
// La reazione come la manda l'app: logica_aro.js spedisce cfg, e cfg.arma
// e` il NOME dell'arma scelta, non il profilo.
const reazione = (arma) => [{ nome: 'Fusilier (Combi Rifle)', azione: 'BS_ATTACK', arma: arma,
                              rangeIndex: 1, rangeMod: 3, bersaglio: 'Alguacil (Combi Rifle)', difensore: fus }];

console.log('\n=== 1. L attivo non tira, il reattivo sì ===');
const s = M.risolviPayload({ attacchi: [], attivo: alg }, reazione('Combi Rifle'), ctx);
ok(s.length === 1, `uno scontro, non zero (${s.length})`);
ok(s[0] && s[0].tipo === 'NORMALE', `TIRO NORMALE: l attivo non oppone niente (${s[0] && s[0].tipo})`);
const chiTira = s[0] && (s[0].attivo.mod != null ? s[0].attivo : s[0].reattivo);
ok(chiTira && /Fusilier/.test(chiTira.nome) && chiTira.mod === 15 && chiTira.burst === 1,
   `il Fusilier tira a 15 con un dado (${chiTira && chiTira.nome} ${chiTira && chiTira.mod} B${chiTira && chiTira.burst})`);

console.log('\n=== 2. E il colpo fa fare un Tiro Salvezza vero ===');
// Con l'arma passata per NOME — la forma che arriva dall'app — il PS si
// perde e la salvezza esce con il solo ARM. Col profilo e` giusta: quindi
// il difetto e` nella risoluzione del nome, non nel calcolo.
const svNome = chiTira && chiTira.salvezzaInflitta;
const sProf = M.risolviPayload({ attacchi: [], attivo: alg }, reazione(M.profiloArma('Combi Rifle')), ctx);
const svProf = sProf[0] && (sProf[0].attivo.mod != null ? sProf[0].attivo : sProf[0].reattivo).salvezzaInflitta;
ok(svProf && svProf.attributo === 'ARM' && svProf.valoreSuccesso === 8,
   `con il profilo dell arma: ARM VS 8 (${svProf && svProf.valoreSuccesso})`);
ok(svNome && svNome.valoreSuccesso === svProf.valoreSuccesso,
   `con il NOME dell arma, come manda l app: stessa salvezza (nome ${svNome && svNome.valoreSuccesso}, profilo ${svProf && svProf.valoreSuccesso})`);

console.log('\n=== 3. Controprova: senza reazioni non nasce niente ===');
ok(M.risolviPayload({ attacchi: [], attivo: alg }, [], ctx).length === 0,
   'zero attacchi e zero reazioni: zero scontri');

console.log('\n=== 4. Total Reaction e Neurocinetics: il Burst pieno in ARO ===');
const casi = [
    ['Reaktion Zond (HMG)',          'Heavy Machine Gun',  4, 'Total Reaction'],
    ['Sin-Eater (Mk12)',             'Mk12',               3, 'Neurocinetics'],
    ['Sin-Eater (MULTI Sniper Rifle)', 'MULTI Sniper Rifle', 2, 'Neurocinetics, dal contenitore']
];
for (const [nome, arma, atteso, perche] of casi) {
    const u = U(window.DB_NOMADI, nome);
    const b = M.burstReattivo(u, M.profiloArma(arma), {});
    ok(b.valore === atteso, `${nome.split(' (')[0]} con ${arma}: B${atteso} in ARO — ${perche} (${b.valore})`);
}
// Il contenitore non ha Burst proprio: il valore viene dalla modalita`, e la
// nota lo dice. E` la riga che spiega il B1 di prima.
const bc = M.burstReattivo(U(window.DB_NOMADI, 'Sin-Eater (MULTI Sniper Rifle)'), M.profiloArma('MULTI Sniper Rifle'), {});
ok((bc.note || []).some(n => /modalita/i.test(n)), `la nota dice da dove viene il Burst (${J(bc.note)})`);
ok(bc.unSoloBersaglio === true, 'Neurocinetics: il Burst pieno vale contro UN bersaglio solo');
// Controprova: senza i due Tratti in ARO si tira un dado, qualunque sia l arma.
ok(M.burstReattivo(U(window.DB_NOMADI, 'Alguacil (HMG)'), M.profiloArma('Heavy Machine Gun'), {}).valore === 1,
   'controprova: un Alguacil con la stessa HMG resta a B1');

console.log('\n=== 5. E il Burst arriva allo scontro ===');
const sc = (dif, arma) => M.risolviScontro(
    { attaccante: alg, arma: M.profiloArma('Combi Rifle'), azione: M.AZIONI.BS_ATTACK, rangeIndex: 1, burst: 3, bersaglio: dif },
    { difensore: dif, azione: 'BS_ATTACK', arma: M.profiloArma(arma), rangeIndex: 1, bersaglio: alg }).reattivo.burst;
ok(sc(U(window.DB_NOMADI, 'Sin-Eater (Mk12)'), 'Mk12') === 3, 'Sin-Eater: B3 nello scontro completo');
ok(sc(U(window.DB_NOMADI, 'Reaktion Zond (HMG)'), 'Heavy Machine Gun') === 4, 'Reaktion Zond: B4');
ok(sc(fus, 'Combi Rifle') === 1, 'controprova: un Fusiliere resta a B1');

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
