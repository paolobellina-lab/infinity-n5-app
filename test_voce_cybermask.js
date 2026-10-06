// @versione 2026-10-06.5 | test_voce_cybermask.js | proprieta`: chat INTERFACCIA
// ============================================================================
//  Dalla chat INTERFACCIA, 6 ottobre 2026.
//
//  COSA PROVA
//  1. La voce CYBERMASK nel menu degli Ordini: a chi e` offerta (anche a un
//     Marker CAMO), a chi no, e che toccandola l'Hacker finisce in IMP-2.
//     Si entra da procediAlleAzioni (il menu) e selectAction (il tocco).
//     I profili sono quelli del database.
//  2. Che l'IMP si VEDA nell'elenco delle truppe (generaIconeStati).
//  3. Che la versione registrata in fondo ai tre file di INTERFACCIA sia la
//     stessa scritta in testa: erano rimaste indietro di giorni.
//
//  NON PROVA la regola del Cybermask (domanda sulla LoF, allarme, caduta
//  dell'IMP): e` del MOTORE e dei suoi banchi.
//
//  USO:  CARTELLA=/percorso/ node test_voce_cybermask.js
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
const VOCE = "selectAction('CYBERMASK', false)";
function menu(g) {
  g.spearheadUnit = g.roster[0]; g.selectedCoordinatedUnits = []; g.currentOrder = {};
  g.procediAlleAzioni();
  return g.el('action-list-container').innerHTML;
}

console.log('--- la pagina ---');
let g = conUnita(/^Intruder \(Hacker, Killer/);
ok(assenti.length === 0 && nonCaricati.length === 0, 'tutti gli script si caricano', assenti.concat(nonCaricati).slice(0, 3));
ok(g.ordineInstradabile('CYBERMASK') === true, 'il router sa dove mandare CYBERMASK');

console.log('\n--- a chi viene offerta ---');
ok(g.MotoreN5.statoBersaglio(g.roster[0]).camo === true, 'premessa: l\'Intruder Hacker del database e` Marker CAMO', g.MotoreN5.statoBersaglio(g.roster[0]));
ok(menu(g).includes(VOCE), 'Intruder (Killer Hacking Device) da Marker CAMO: la voce c\'e`');

console.log('\n--- a chi NO ---');
ok(!menu(conUnita(/^Alguacil \(Combi/)).includes(VOCE), 'Alguacil, non Hacker: niente voce');
ok(!menu(conUnita(/^Hellcat \(Hacker\)/)).includes(VOCE), 'Hellcat con Hacking Device normale (senza il programma): niente voce');
let iso = conUnita(/^Intruder \(Hacker, Killer/); iso.roster[0].states.isolated = true;
ok(!menu(iso).includes(VOCE), 'Intruder Hacker Isolato: niente voce');

console.log('\n--- toccando la voce si arriva in IMP-2 ---');
menu(g);
g.selectAction('CYBERMASK', false);
ok(g.currentOrder.action === 'CYBERMASK', 'la dichiarazione e` scritta nell\'Ordine', g.currentOrder.action);
const schermo = g.el('targets-allocation-container').innerHTML;
const dom = (schermo.match(/rispondiRientroCamo\('([^']+)', true\)/) || [])[1];
ok(!!dom, 'la domanda sulla LoF e` a schermo', schermo.slice(0, 200));
ok(!/IMP-2/.test(g.generaIconeStati(g.roster[0])), 'premessa: prima di eseguire l\'elenco NON dice IMP-2');
g.rispondiRientroCamo(dom, true);
g.eseguiRientroCamo();
ok(g.MotoreN5.livelloImpersonation(g.roster[0]) === 2, 'SI` ed ESEGUI: nel roster e` in IMP-2', { deploy: g.roster[0].deployState, state: g.roster[0].state });
ok(/IMP-2/.test(g.generaIconeStati(g.roster[0])), 'e l\'elenco delle truppe lo mostra: IMP-2', g.generaIconeStati(g.roster[0]).slice(-200));
ok(!menu(g).includes(VOCE), 'gia` in Impersonation: la voce non c\'e` piu`');

console.log('\n--- il nome della voce del rientro ---');
let riv = conUnita(/^Intruder \(HMG/, (x) => { x.spearheadUnit = x.roster[0]; x.selectedCoordinatedUnits = []; x.currentOrder = {}; x.procediAlleAzioni(); x.selectAction('MOVIMENTO', false); x.dichiaraRequisitoFallito(); });
const m2 = menu(riv);
ok(m2.includes("selectAction('RIENTRARE IN CAMO', false)") && !/RIENTRARE IN CAMUFFATO/.test(m2), 'la voce si chiama RIENTRARE IN CAMO, come id e catalogo');

console.log('\n--- testa e registrazione dicono la stessa versione ---');
['app.html', 'logica_aro.js', 'calcolatore_controller.js'].forEach(f => {
  const t = fs.readFileSync(DIR + f, 'utf8');
  const testa = (t.match(/@versione (\S+) \| /) || [])[1];
  const reg = (t.match(new RegExp("file: '" + f.replace('.', '\\.') + "', versione: '([^']+)'")) || [])[1];
  ok(!!testa && testa === reg, f + ': ' + testa + ' in testa, ' + reg + ' registrata');
});
ok((g.MotoreN5._versioni['app.html'] || {}).versione === (pagina.match(/@versione (\S+) \| /) || [])[1], 'e il motore, a pagina caricata, conosce quella di app.html', g.MotoreN5._versioni['app.html']);

console.log('\n' + passati + ' passati, ' + falliti + ' falliti');
process.exit(falliti ? 1 : 0);
