// @versione 2026-10-06.5 | test_requisito_fallito.js | proprieta`: chat INTERFACCIA
// ============================================================================
//  Dalla chat INTERFACCIA, 5 ottobre 2026.
//
//  COSA PROVA
//  L'Idle da requisito fallito, dalla porta del giocatore: selectAction per
//  dichiarare, poi window.dichiaraRequisitoFallito (app.html), che e` il
//  pulsante. Il profilo e` quello del database, che nasce gia` Camuffato.
//
//  PERCHE` ESISTE
//  Riga 7462 del regolamento, verifica della chat REGOLE del 5 ottobre: un
//  Marker il cui requisito fallisce e` rivelato SEMPRE, qualunque Abilita`
//  fosse dichiarata. Il motore lo prova da M.convertiInIdle; nessun banco lo
//  provava dalla schermata, cioe` dal punto dove stava il difetto di action2
//  (l'Abilita` dichiarata letta da un campo che nessuno scriveva).
//
//  DI CHI E` IL CODICE PROVATO
//  dichiaraRequisitoFallito e` di INTERFACCIA; la regola e` del MOTORE.
//
//  USO:  CARTELLA=/percorso/ node test_requisito_fallito.js
// ============================================================================
// 🔴 6 ottobre (misura della chat TEST). Qui la cartella predefinita era
// '/mnt/project/' scritta in fisso: dove quel percorso non esiste il banco
// moriva all'avvio (app.html non trovato) SENZA un solo rosso e senza la riga
// di riepilogo, cioe` le sue prove sparivano dal conto invece di fallire.
// Ora, senza CARTELLA, si usa la cartella in cui sta il banco; e se li` la
// pagina non c'e` lo si DICE, con un rosso e il riepilogo.
const DIR = (process.env.CARTELLA || (__dirname + '/')).replace(/\/?$/, '/');
if (!require('fs').existsSync(DIR + 'app.html')) {
  console.log('  \u2717 app.html non trovato in ' + DIR + ' (imposta CARTELLA=/percorso/ oppure metti il banco accanto ai file)');
  console.log('\n0 passati, 1 falliti');
  process.exit(1);
}
const fs = require('fs'), vm = require('vm');
const nonCaricati = [], assenti = [];
let passati = 0, falliti = 0;
function ok(c, d, visto) {
  if (c) { passati++; console.log('  \u2713 ' + d); }
  else { falliti++; console.log('  \u2717 ' + d + (visto !== undefined ? '  [visto: ' + JSON.stringify(visto) + ']' : '')); }
}

function apri() {
  const h = fs.readFileSync(DIR + 'app.html', 'utf8');
  const g = {}; g.window = g; g.globalThis = g; g.console = { log: () => {}, warn: () => {}, error: () => {} };
  const el = {}; const finto = (id) => { if (!el[id]) el[id] = { id, innerHTML: '', style: {}, appendChild: () => {}, addEventListener: () => {}, value: '', classList: { add: () => {}, remove: () => {} }, setAttribute: () => {}, getAttribute: () => null, options: [], cloneNode() { return finto(id + '_c'); }, parentNode: { replaceChild: () => {}, insertBefore: () => {} }, querySelector: () => null }; return el[id]; };
  const locale = {};
  g.localStorage = { getItem: k => (k in locale ? locale[k] : null), setItem: (k, v) => locale[k] = v, removeItem: k => delete locale[k] };
  g.location = { search: '?fazione=nomadi', replace: () => {}, href: '' };
  let t = 'NOMADS TACTICAL TERMINAL';
  g.document = { get title() { return t; }, set title(v) { t = v; }, documentElement: { setAttribute: () => {} }, scripts: [], getElementById: finto, createElement: () => finto('n'), querySelector: () => finto('q'), querySelectorAll: () => [], addEventListener: () => {}, write: () => {} };
  g.alert = () => {}; ['scrollTo', 'addEventListener'].forEach(k => g[k] = () => {});
  g.setInterval = () => 0; g.setTimeout = (fn) => { fn && fn(); return 0; };
  g.history = { pushState: () => {}, replaceState: () => {}, back: () => {} }; g.navigator = {};
  // Le due finestre del giocatore: il motivo e la conferma. Si registra
  // cosa gli viene MOSTRATO, perche` e` li` che legge "stai per rivelarti".
  g.dialoghi = []; g.rispostaMotivo = 'fuori distanza'; g.rispostaConferma = true;
  g.prompt = () => g.rispostaMotivo;
  g.confirm = (testo) => { g.dialoghi.push(String(testo)); return g.rispostaConferma; };
  g.firebase = { initializeApp: () => {}, database: () => ({ ref: () => ({ on: () => {}, set: () => {}, remove: () => {} }) }) };
  const ctx = vm.createContext(g);
  g.cloudPronto = Promise.resolve({ confermato: true });
  [...h.matchAll(/<script(?:\s+src="([^"]+)")?\s*>([\s\S]*?)<\/script>/g)].forEach(m => {
    const s = m[1];
    if (s) { if (/^https?:/.test(s)) return; const f = DIR + s.split('?')[0]; if (!fs.existsSync(f)) { assenti.push(s); return; }
      try { vm.runInContext(fs.readFileSync(f, 'utf8'), ctx, { filename: s }); } catch (e) { nonCaricati.push(s + ': ' + e.message); } }
    else { try { vm.runInContext(m[2], ctx); } catch (e) { nonCaricati.push('script in linea: ' + e.message); } }
  });
  return g;
}

// Un giocatore, un Intruder dal database, un'Abilita` dichiarata dal menu.
function caso(azione, conferma) {
  const g = apri();
  const profilo = g.DB_NOMADI.find(u => u.id === 'intruder_hmg');
  g.roster = [{ ...profilo, id: 'u1', alias: 'Ombra', states: {}, combatGroup: 1 }];
  g.spearheadUnit = g.roster[0];
  g.selectedCoordinatedUnits = [];
  g.currentOrder = {};
  g.gameState = { nomads: g.roster, panoceania: [] };
  const prima = g.MotoreN5.statoBersaglio(g.roster[0]);
  g.selectAction(azione, false);
  const dichiarata = g.currentOrder.action || g.currentOrder.action1;
  g.rispostaConferma = (conferma !== false);
  let errore = null;
  try { g.dichiaraRequisitoFallito(); } catch (e) { errore = e; }
  return { g, prima, dichiarata, errore, dopo: g.MotoreN5.statoBersaglio(g.roster[0]), unita: g.roster[0], testo: g.dialoghi.join('\n') };
}

console.log('--- la pagina si carica ---');
const primo = caso('CAUTO');
ok(assenti.length === 0, 'nessun file citato manca dalla cartella', assenti);
ok(nonCaricati.length === 0, 'nessuno script solleva caricandosi', nonCaricati.slice(0, 3));

console.log('\n--- Movimento Cauto dichiarato, requisito fallito ---');
ok(primo.prima.camo === true, 'l\'Intruder del database parte Camuffato', primo.prima);
ok(!!primo.dichiarata, 'selectAction scrive l\'Abilita` dichiarata', primo.dichiarata);
ok(primo.errore === null, 'dichiaraRequisitoFallito non solleva', primo.errore && primo.errore.message);
ok(primo.dialoghi !== null && /rivelat/i.test(primo.testo), 'la conferma DICE che il Marker viene rivelato, prima di premere', primo.testo.slice(0, 400));
ok(primo.dopo.camo === false, 'dopo la conferma non e` piu` Camuffato (riga 7462)', primo.dopo);
ok(primo.unita.deployState === 'NORMAL', 'deployState NORMAL', primo.unita.deployState);
// NON si guarda spearheadUnit: dopo l'invio il ponte di uscita riporta al
// radar e la svuota. La prova sta nel roster, che e` cio` che resta.
ok(primo.unita.state === 'ACTIVE', 'state ACTIVE', primo.unita.state);

console.log('\n--- vale per ogni Abilita`, non solo per il Cauto ---');
['MOVIMENTO', 'ATTACCO BS'].forEach(a => {
  const c = caso(a);
  ok(!!c.dichiarata && c.errore === null && c.dopo.camo === false, a + ' fallito -> rivelata', { dichiarata: c.dichiarata, errore: c.errore && c.errore.message, dopo: c.dopo.camo });
});

console.log('\n--- controprove: il banco sa dire di no ---');
const rifiuto = caso('CAUTO', false);
ok(rifiuto.dopo.camo === true, 'se il giocatore NON conferma, resta Marker', rifiuto.dopo);
const senza = apri();
const p = senza.DB_NOMADI.find(u => u.id === 'intruder_hmg');
senza.roster = [{ ...p, id: 'u1', alias: 'Ombra', states: {}, combatGroup: 1 }];
senza.spearheadUnit = senza.roster[0]; senza.currentOrder = {};
senza.dichiaraRequisitoFallito();
ok(senza.MotoreN5.statoBersaglio(senza.roster[0]).camo === true, 'senza un\'Abilita` dichiarata non succede niente');


console.log('\n--- e dal motore: il ramo che la schermata non raggiunge ---');
// Lo stesso fatto visto da sotto. La schermata prova il percorso del
// giocatore; qui si chiede al motore, perche` la controprova che conta — un
// Cauto RIUSCITO che resta Marker — dalla schermata non si puo` fare: li` il
// requisito e` fallito per definizione.
const gm = apri();
const M = gm.MotoreN5;
const prof = gm.DB_NOMADI.find(u => u.id === 'intruder_hmg');
const camo = () => Object.assign(JSON.parse(JSON.stringify(prof)), { deployState: 'CAMO', states: { camo: true } });
['MOVIMENTO CAUTO', 'ATTACCO BS', 'MOVIMENTO', 'ABILITA NON NOTA'].forEach(az => {
  const e = M.convertiInIdle({ azione: az }, camo(), M.profiloArma('Heavy Machine Gun'), 'requisito');
  ok(e.attaccante.deployState === 'NORMAL', az + ' fallito -> rivelata (riga 7462)', e.attaccante.deployState);
});
// LA CONTROPROVA: la stessa Abilita`, ma RIUSCITA. Li` il Cauto non rivela
// (riga 13627) — e sono le due righe insieme a dire la regola: non e` il Cauto
// a rivelare, e` il FALLIMENTO del requisito.
const riuscito = M.statoDopoAbilita(camo(), 'MOVIMENTO CAUTO', {});
ok(riuscito.dopo.marker === 'CAMO' || riuscito.dopo.deployState === 'CAMO',
   'Cauto RIUSCITO: resta Marker (riga 13627)', riuscito.dopo);
// E l'altra conseguenza della stessa riga, che non dipende dall'Abilita`.
const conUsi = Object.assign(camo(), { weapon: 'Panzerfaust, Heavy Machine Gun' });
const pf = M.profiloArma('Panzerfaust');
const prima2 = M.usiResidui(conUsi, pf) && M.usiResidui(conUsi, pf).residui;
const dopo2 = M.convertiInIdle({ azione: 'MOVIMENTO CAUTO' }, conUsi, 'Panzerfaust', 'requisito').attaccante;
ok(M.usiResidui(dopo2, pf).residui === prima2 - 1,
   'e l uso Disposable si spende anche con l arma passata per NOME', [prima2, M.usiResidui(dopo2, pf).residui]);

console.log('\n' + passati + ' passati, ' + falliti + ' falliti');
process.exit(falliti ? 1 : 0);
