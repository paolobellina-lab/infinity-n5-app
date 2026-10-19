// @versione 2026-10-19.1 | test_voce_cybermask.js | proprieta`: chat INTERFACCIA
// ============================================================================
//  Dalla chat INTERFACCIA, 6 ottobre 2026.
//
//  COSA PROVA
//  1. Il CYBERMASK dalla porta del giocatore: menu degli Ordini -> HACKING
//     -> il suo bottone nella schermata Hacking. A chi e` offerto (anche a
//     un Marker CAMO), a chi no, e che toccandolo parte un Ordine intero.
//     Si entra da procediAlleAzioni (il menu) e selectAction (il tocco).
//     I profili sono quelli del database.
//     19 ottobre (Paolo, via MOTORE e TEST): fino alla 2026-10-06.5 questo
//     banco cercava la voce CYBERMASK fra le Abilita` Lunghe di app.html, e
//     toccandola l'Hacker finiva in IMP-2 da solo. La voce e` stata tolta il
//     18 ottobre: Cybermask e White Noise si dichiarano dalla schermata
//     Hacking (ordine_hacking.js), e lo stato IMP-2 lo mette il giocatore
//     dall'editor degli stati. Prima/dopo dei controlli riscritti:
//       "la voce c'e`" (menu)        -> "nel menu NON c'e`" + "dalla
//                                       schermata Hacking il bottone c'e`"
//       "il router sa dove mandarla" -> tolto: la voce non esiste piu`
//       "a chi NO" (menu)            -> "a chi NO" (schermata Hacking;
//                                       l'Isolato non vede nemmeno HACKING)
//       "toccando si arriva in IMP-2"-> "toccando parte l'Ordine intero,
//                                       con l'allarme ARO"; come seconda
//                                       meta` non si dichiara
//       "l'IMP si vede"              -> resta, con l'IMP-2 messo come lo
//                                       mette l'editor (deployState IMP_2)
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

// La schermata Hacking dell'unita` di testa, entrando dal menu come il giocatore.
const VOCE_HACK = "selectAction('HACKING', false)";
function schermataHacking(x) {
  if (!menu(x).includes(VOCE_HACK)) return null;
  x.selectAction('HACKING', false);
  return x.el('weapon-buttons-container').innerHTML;
}
const TASTO = (nome) => "dichiaraProgrammaSenzaTiro('" + nome + "')";

console.log('\n--- a chi viene offerto ---');
ok(g.MotoreN5.statoBersaglio(g.roster[0]).camo === true, 'premessa: l\'Intruder Hacker del database e` Marker CAMO', g.MotoreN5.statoBersaglio(g.roster[0]));
ok(!menu(g).includes(VOCE), 'il menu degli Ordini NON ha piu` la voce CYBERMASK fra le Abilita` Lunghe');
let hk = schermataHacking(g);
ok(hk !== null && hk.includes(TASTO('CYBERMASK')), 'Intruder (Killer Hacking Device) da Marker CAMO: HACKING, e nella schermata il bottone CYBERMASK', (hk || '').slice(0, 160));
ok(/class="bottone-arma"/.test((hk || '').split(TASTO('CYBERMASK'))[0].slice(-3000)), 'il bottone e` quello del motore (M.bottoneArma)');

console.log('\n--- a chi NO ---');
ok(schermataHacking(conUnita(/^Alguacil \(Combi/)) === null, 'Alguacil, non Hacker: niente HACKING, quindi niente Cybermask');
const hell = schermataHacking(conUnita(/^Hellcat \(Hacker\)/));
ok(hell !== null && !hell.includes(TASTO('CYBERMASK')), 'Hellcat con Hacking Device normale (senza il programma): HACKING si`, Cybermask no');
let iso = conUnita(/^Intruder \(Hacker, Killer/); iso.roster[0].states.isolated = true;
ok(schermataHacking(iso) === null, 'Intruder Hacker Isolato: niente HACKING, quindi niente Cybermask');
const plus = schermataHacking(conUnita(/^Interventor \(Hacker Plus\)/));
ok(plus !== null && plus.includes(TASTO('CYBERMASK')) && plus.includes(TASTO('WHITE NOISE')), 'Interventor (Hacking Device Plus): Cybermask E White Noise nella schermata Hacking');

console.log('\n--- toccandolo parte un Ordine intero ---');
const allarmi = [], buste = [];
g.inviaAllarmeAro = (p) => allarmi.push(p);
const veroInvio = g.MotoreN5.inviaCalcolo; g.MotoreN5.inviaCalcolo = (pl, op) => { buste.push({ pl, op }); return true; };
vm.runInContext("window." + TASTO('CYBERMASK'), g);
ok(g.currentOrder.action === 'CYBERMASK' && g.currentOrder.isLongSkill === true, 'la dichiarazione e` nell\'Ordine, come Abilita` Lunga', { action: g.currentOrder.action, lunga: g.currentOrder.isLongSkill });
ok(allarmi.length === 1 && buste.length === 1 && buste[0].op.aroAtteso === true, 'parte l\'allarme ARO e la busta aspetta le reazioni', { allarmi: allarmi.length, buste: buste.length });
ok(/CYBERMASK DICHIARATO/.test(g.el('calc-result').innerHTML), 'a schermo: CYBERMASK DICHIARATO');
g.MotoreN5.inviaCalcolo = veroInvio;
// Come seconda meta` non si dichiara: e` un'Abilita` Lunga.
let sec = conUnita(/^Intruder \(Hacker, Killer/); menu(sec);
sec.currentOrder.isSecondHalf = true; sec.startUnitHackingLoop();
const hs = sec.el('weapon-buttons-container').innerHTML;
ok(!hs.includes(TASTO('CYBERMASK')) && /CYBERMASK/.test(hs), 'come seconda meta` il bottone c\'e` ma non dichiara (avviso: solo Ordine intero)');

console.log('\n--- l\'IMP si vede ---');
ok(!/IMP-2/.test(g.generaIconeStati(g.roster[0])), 'premessa: prima l\'elenco NON dice IMP-2');
// Lo stato lo mette il giocatore dall'editor: deployState IMP_2.
g.roster[0].deployState = 'IMP_2'; g.roster[0].states.impersonation = true; g.roster[0].states.camo = false;
ok(g.MotoreN5.livelloImpersonation(g.roster[0]) === 2, 'messo IMP-2 come lo mette l\'editor: il motore lo legge', { deploy: g.roster[0].deployState });
ok(/IMP-2/.test(g.generaIconeStati(g.roster[0])), 'e l\'elenco delle truppe lo mostra: IMP-2', g.generaIconeStati(g.roster[0]).slice(-200));

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
