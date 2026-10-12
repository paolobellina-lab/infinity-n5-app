// @versione 2026-10-06.5 | test_voce_rientro_camo.js | proprieta`: chat INTERFACCIA
// ============================================================================
//  Dalla chat INTERFACCIA, 5 ottobre 2026.
//
//  COSA PROVA
//  La voce "RIENTRARE IN CAMO" nel menu degli Ordini: a chi viene
//  offerta, a chi no, e che toccandola si arriva in fondo. Si entra da
//  procediAlleAzioni (il menu), poi selectAction (il tocco sulla voce).
//  La truppa rivelata NON e` costruita a mano: e` l'Intruder del database,
//  che nasce Camuffato, rivelato dal percorso vero (requisito fallito).
//
//  PERCHE` ESISTE
//  Tre righe di app.html (lo script, la voce, la disponibilita`) senza le
//  quali il modulo del MOTORE esiste ma non si puo` raggiungere. La
//  disponibilita` chiede a M.puoRientrareInCamo: il banco fissa che la voce
//  NON compaia a chi e` gia` Marker o ha speso l'uso unico, cioe` i casi che
//  una lettura delle skill a mano sbaglierebbe.
//
//  NON PROVA la regola del rientro (domande, Frenzy, Impetuous, allarme):
//  quella e` del MOTORE e dei suoi banchi.
//
//  USO:  CARTELLA=/percorso/ node test_voce_rientro_camo.js
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
const pagina = fs.readFileSync(DIR + 'app.html', 'utf8');

function apri() {
  const g = {}; g.window = g; g.globalThis = g; g.console = { log: () => {}, warn: () => {}, error: () => {} };
  const el = {}; const finto = (id) => { if (!el[id]) el[id] = { id, innerHTML: '', innerText: '', style: {}, disabled: false, appendChild: () => {}, addEventListener: () => {}, value: '', classList: { add: () => {}, remove: () => {} }, setAttribute: () => {}, getAttribute: () => null, options: [], cloneNode() { return finto(id + '_c'); }, parentNode: { replaceChild: () => {}, insertBefore: () => {} }, querySelector: () => null }; return el[id]; };
  const locale = {};
  g.localStorage = { getItem: k => (k in locale ? locale[k] : null), setItem: (k, v) => locale[k] = v, removeItem: k => delete locale[k] };
  g.location = { search: '?fazione=nomadi', replace: () => {}, href: '' };
  let t = 'NOMADS TACTICAL TERMINAL';
  g.document = { get title() { return t; }, set title(v) { t = v; }, documentElement: { setAttribute: () => {} }, scripts: [], getElementById: finto, createElement: () => finto('n'), querySelector: () => finto('q'), querySelectorAll: () => [], addEventListener: () => {}, write: () => {} };
  g.alert = () => {}; ['scrollTo', 'addEventListener'].forEach(k => g[k] = () => {});
  g.setInterval = () => 0; g.setTimeout = (fn) => { fn && fn(); return 0; };
  g.history = { pushState: () => {}, replaceState: () => {}, back: () => {} }; g.navigator = {};
  g.prompt = () => 'fuori distanza'; g.confirm = () => true;
  g.firebase = { initializeApp: () => {}, database: () => ({ ref: () => ({ on: () => {}, set: () => {}, remove: () => {} }) }) };
  const ctx = vm.createContext(g);
  g.cloudPronto = Promise.resolve({ confermato: true });
  [...pagina.matchAll(/<script(?:\s+src="([^"]+)")?\s*>([\s\S]*?)<\/script>/g)].forEach(m => {
    const s = m[1];
    if (s) { if (/^https?:/.test(s)) return; const f = DIR + s.split('?')[0]; if (!fs.existsSync(f)) { assenti.push(s); return; }
      try { vm.runInContext(fs.readFileSync(f, 'utf8'), ctx, { filename: s }); } catch (e) { nonCaricati.push(s + ': ' + e.message); } }
    else { try { vm.runInContext(m[2], ctx); } catch (e) { nonCaricati.push('script in linea: ' + e.message); } }
  });
  g.el = finto;
  return g;
}
function conUnita(re, modifica) {
  const g = apri();
  const p = g.DB_NOMADI.find(u => re.test(u.nome));
  if (!p) throw new Error('profilo non trovato nel database: ' + re);
  g.roster = [{ ...p, id: 'u1', alias: 'Ombra', states: {}, combatGroup: 1 }];
  g.gameState = { nomads: g.roster, panoceania: [] };
  if (modifica) modifica(g);
  g.spearheadUnit = g.roster[0]; g.selectedCoordinatedUnits = []; g.currentOrder = {};
  return g;
}
// Rivelare dal percorso vero: Movimento dichiarato, requisito fallito.
function rivela(g) {
  g.spearheadUnit = g.roster[0]; g.selectedCoordinatedUnits = []; g.currentOrder = {};
  g.procediAlleAzioni(); g.selectAction('MOVIMENTO', false); g.dichiaraRequisitoFallito();
}
const VOCE = "selectAction('RIENTRARE IN CAMO', false)";
function menu(g) {
  g.spearheadUnit = g.roster[0]; g.selectedCoordinatedUnits = []; g.currentOrder = {};
  g.procediAlleAzioni();
  return g.el('action-list-container').innerHTML;
}

console.log('--- la pagina ---');
let g = conUnita(/^Intruder \(HMG/, rivela);
ok(assenti.length === 0 && nonCaricati.length === 0, 'tutti gli script si caricano', assenti.concat(nonCaricati).slice(0, 3));
ok(/<script src="ordine_rientro_camo\.js"><\/script>/.test(pagina), 'app.html dichiara ordine_rientro_camo.js');
ok(typeof g.avviaFaseRientroCamo === 'function', 'e il modulo e` in memoria');
ok(g.ordineInstradabile('RIENTRARE IN CAMO') === true, 'il router sa dove mandarla');

console.log('\n--- a chi viene offerta ---');
ok(g.MotoreN5.statoBersaglio(g.roster[0]).camo === false, 'premessa: l\'Intruder e` stato rivelato dal percorso vero', g.MotoreN5.statoBersaglio(g.roster[0]));
ok(menu(g).includes(VOCE), 'Intruder rivelato: la voce c\'e`');

console.log('\n--- a chi NO ---');
ok(!menu(conUnita(/^Intruder \(HMG/)).includes(VOCE), 'Intruder ancora Marker: niente voce (e` gia` Camuffato)');
ok(!menu(conUnita(/^Alguacil \(Combi/)).includes(VOCE), 'Alguacil, senza Camouflage: niente voce');
let h = conUnita(/^Intruder \(HMG/, rivela); h.roster[0].states.engaged = true;
ok(!menu(h).includes(VOCE), 'Intruder rivelato ma Ingaggiato: niente voce');

console.log('\n--- toccando la voce si arriva in fondo ---');
menu(g);
g.selectAction('RIENTRARE IN CAMO', false);
ok(g.currentOrder.action === 'RIENTRARE IN CAMO', 'la dichiarazione e` scritta nell\'Ordine', g.currentOrder.action);
ok(/rispondiRientroCamo\('fuoriDallaLoF'/.test(g.el('targets-allocation-container').innerHTML), 'e la domanda sulla LoF e` a schermo', g.el('targets-allocation-container').innerHTML.slice(0, 200));
g.rispondiRientroCamo('fuoriDallaLoF', true);
g.eseguiRientroCamo();
ok(g.MotoreN5.statoBersaglio(g.roster[0]).camo === true, 'SI` ed ESEGUI: nel roster e` di nuovo Marker', g.MotoreN5.statoBersaglio(g.roster[0]));

h = conUnita(/^Intruder \(HMG/, rivela); menu(h);
h.selectAction('RIENTRARE IN CAMO', false);
h.rispondiRientroCamo('fuoriDallaLoF', false);
h.eseguiRientroCamo();
ok(h.MotoreN5.statoBersaglio(h.roster[0]).camo === false, 'NO: resta Modello');

console.log('\n--- uso unico ---');
let k = conUnita(/^Heckler/, rivela);
const tipo = k.MotoreN5.puoRientrareInCamo(k.roster[0], { inAro: false });
ok(tipo.unUso === true, 'premessa: l\'Heckler del database ha Camouflage (1 Use)', { unUso: tipo.unUso, puo: tipo.puo, motivo: tipo.motivo });
if (tipo.puo) {
  ok(menu(k).includes(VOCE), 'Heckler rivelato, uso ancora disponibile: la voce c\'e`');
  k.selectAction('RIENTRARE IN CAMO', false); k.rispondiRientroCamo('fuoriDallaLoF', true); k.eseguiRientroCamo();
  rivela(k);
  ok(!menu(k).includes(VOCE), 'rientrato una volta e rivelato di nuovo: la voce NON c\'e` piu`', k.MotoreN5.puoRientrareInCamo(k.roster[0], { inAro: false }).motivo);
} else {
  ok(!menu(k).includes(VOCE), 'Heckler con l\'uso gia` speso: niente voce', tipo.motivo);
}

console.log('\n' + passati + ' passati, ' + falliti + ' falliti');
process.exit(falliti ? 1 : 0);
