// @versione 2026-10-06.1 | test_sostituzione_unita.js | proprieta`: chat INTERFACCIA
// ============================================================================
//  Dalla chat INTERFACCIA, 6 ottobre 2026.
//
//  COSA PROVA
//  I quattro punti in cui l'interfaccia sostituiva un'unita` nel roster a
//  mano, ora passati a window.sostituisciUnita (motore_core.js):
//   1. Idle da requisito fallito (app.html)            -> l'Hub VIENE avvisato
//   2. Soppressione annullata in ARO (logica_aro.js)   -> l'Hub VIENE avvisato
//   3. Infiltrazione fallita (roster_manager.js)       -> in schieramento: NO
//   4. Deployable piazzato in schieramento (idem)      -> in schieramento: NO
//  Si entra dai comandi dei pulsanti; i profili sono del database. L'invio
//  all'Hub si conta sul mittente unico, window.inviaSchieramentoAllHub.
//
//  PERCHE` ESISTE
//  Il punto 1 chiamava window.sincronizzaStatiConHub, che non esiste in
//  nessun file: un Marker rivelato dall'Idle restava Marker per l'Hub. Il
//  punto 2 non avvisava affatto.
//
//  USO:  CARTELLA=/percorso/ node test_sostituzione_unita.js
// ============================================================================
const fs = require('fs'), vm = require('vm');
const nonCaricati = [], assenti = [];
let passati = 0, falliti = 0;
function ok(c, d, visto) {
  if (c) { passati++; console.log('  \u2713 ' + d); }
  else { falliti++; console.log('  \u2717 ' + d + (visto !== undefined ? '  [visto: ' + JSON.stringify(visto) + ']' : '')); }
}
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
const pagina = fs.readFileSync(DIR + 'app.html', 'utf8');

function apri() {
  const g = {}; g.window = g; g.globalThis = g; g.console = { log: () => {}, warn: () => {}, error: () => {} };
  const el = {}; const finto = (id) => { if (!el[id]) el[id] = { id, innerHTML: '', innerText: '', style: {}, disabled: false, appendChild: () => {}, addEventListener: () => {}, value: '', classList: { add: () => {}, remove: () => {} }, setAttribute: () => {}, getAttribute: () => null, options: [], cloneNode() { return finto(id + '_c'); }, parentNode: { replaceChild: () => {}, insertBefore: () => {} }, querySelector: () => null }; return el[id]; };
  const locale = {};
  g.localStorage = { getItem: k => (k in locale ? locale[k] : null), setItem: (k, v) => locale[k] = v, removeItem: k => delete locale[k] };
  g.location = { search: '?fazione=nomadi', replace: () => {}, href: '' };
  let t = 'NOMADS TACTICAL TERMINAL';
  g.document = { get title() { return t; }, set title(v) { t = v; }, documentElement: { setAttribute: () => {} }, scripts: [], getElementById: finto, createElement: () => finto('n'), querySelector: () => finto('q'), querySelectorAll: () => [], addEventListener: () => {}, write: () => {} };
  g.alert = (t) => { if (g.avvisi) g.avvisi.push(String(t)); }; ['scrollTo', 'addEventListener'].forEach(k => g[k] = () => {});
  g.setInterval = () => 0; g.setTimeout = (fn) => { fn && fn(); return 0; };
  g.history = { pushState: () => {}, replaceState: () => {}, back: () => {} }; g.navigator = {};
  g.prompt = () => 'fuori distanza'; g.domande = []; g.avvisi = []; g.rispostaConferma = true; g.confirm = (t) => { g.domande.push(String(t)); return g.rispostaConferma; };
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
function pagina2(re, modifica) {
  const g = apri(); const M = g.MotoreN5;
  const p = g.DB_NOMADI.find(u => re.test(u.nome));
  if (!p) throw new Error('profilo non trovato: ' + re);
  g.roster = [Object.assign({}, p, { id: 'u1', alias: 'Prova', states: {}, combatGroup: 1 })];
  g.gameState = { nomads: g.roster, panoceania: [{ id: 'p0', alias: 'Nemico', tipo: 'LI', states: {} }] };
  M._statoGioco = g.gameState;
  if (modifica) modifica(g.roster[0]);
  g.invii = [];
  const vero = g.inviaSchieramentoAllHub;
  g.inviaSchieramentoAllHub = (f, d) => { g.invii.push((d && d.motivo) || 'SCHIERAMENTO'); return vero ? vero(f, d) : { inviato: true }; };
  return g;
}

console.log('--- la pagina ---');
let g = pagina2(/^Intruder \(HMG/);
ok(assenti.length === 0 && nonCaricati.length === 0, 'tutti gli script si caricano', assenti.concat(nonCaricati).slice(0, 3));
ok(typeof g.sostituisciUnita === 'function', 'window.sostituisciUnita c\'e`');
ok(typeof g.sincronizzaStatiConHub === 'undefined', 'premessa: window.sincronizzaStatiConHub NON esiste (era chiamata a vuoto)');

console.log('\n--- 1. Idle da requisito fallito: l\'Hub lo sa ---');
g.spearheadUnit = g.roster[0]; g.selectedCoordinatedUnits = []; g.currentOrder = {};
g.procediAlleAzioni(); g.selectAction('MOVIMENTO', false);
const stessa = g.roster[0];
ok(g.MotoreN5.statoBersaglio(stessa).camo === true, 'premessa: dopo aver dichiarato MOVIMENTO e` ancora Marker CAMO');
g.invii.length = 0;
g.dichiaraRequisitoFallito();
ok(g.MotoreN5.statoBersaglio(g.roster[0]).camo === false, 'l\'Idle la rivela nel roster');
ok(g.invii.includes('AGGIORNAMENTO'), 'e parte un AGGIORNAMENTO all\'Hub', g.invii);
ok(g.roster[0] === stessa, 'l\'unita` del roster e` lo stesso oggetto di prima, aggiornato (non una copia nuova)');

console.log('\n--- 2. Soppressione annullata in ARO: l\'Hub lo sa ---');
g = pagina2(/^Alguacil \(Combi/, (u) => { u.states.suppressive = true; u.suppressiveWeapon = 'Combi Rifle'; });
g.currentAttackData = { attaccanti: ['Nemico'], azione: 'ATTACCO BS' };
g.selectedAroUnits = ['u1']; g.currentAroIndex = 0; g.aroReactions = []; g.aroSfMode = false;
g.avviaCicloAroUnita(); g.selezionaAzioneAro('BS_ATTACK');
const m = g.el('aro-weapon-list').innerHTML.match(/selezionaArmaAro\('([^']+)', true\)/);
ok(!!m, 'premessa: in Soppressione la schermata offre l\'arma in MODO NORMALE', g.el('aro-weapon-list').innerHTML.replace(/<[^>]+>/g, ' ').slice(0, 200));
if (m) {
  g.invii.length = 0;
  g.selezionaArmaAro(m[1], true);
  ok(g.MotoreN5.statoBersaglio(g.roster[0]).suppressive !== true && !(g.roster[0].states || {}).suppressive, 'scelto il modo normale: nel roster non e` piu` in Soppressione', g.roster[0].states);
  ok(g.invii.includes('AGGIORNAMENTO'), 'e parte un AGGIORNAMENTO all\'Hub', g.invii);
}

console.log('\n--- 3. Infiltrazione fallita, in schieramento: NIENTE invio ---');
g = pagina2(/^Heckler/);
ok(g.MotoreN5.camoUnUso(g.roster[0]) === true, 'premessa: l\'Heckler del database ha Camouflage (1 Use)');
const heck = g.roster[0]; g.invii.length = 0;
g.infiltrazioneFallita(0);
ok(g.roster[0].camoUsato === true, 'l\'uso del CAMO e` segnato nel roster', g.roster[0].camoUsato);
ok(g.roster[0] === heck, 'sullo stesso oggetto');
ok(g.invii.length === 0, 'e all\'Hub NON parte niente (prima della conferma dello schieramento)', g.invii);

console.log('\n--- 4. Deployable piazzato in schieramento: NIENTE invio ---');
g = pagina2(/^Puppet Masters \(Minelayer\)/);
const html = g.bottoniDeployables(0);
ok(/schieraPiazzabile\(0, 0\)/.test(html), 'premessa: il Minelayer del database ha qualcosa da piazzare', String(html).replace(/<[^>]+>/g, ' ').slice(0, 200));
const port = g.roster[0], primaUsi = JSON.stringify(port.usiSpesi || null); g.invii.length = 0;
g.schieraPiazzabile(0, 0);
ok(g.roster.length === 2 && g.roster[1].deployable === true, 'il gettone entra nel roster', g.roster.map(x => x.nome || x.alias));
ok(g.roster[0] === port && JSON.stringify(port.usiSpesi || null) !== primaUsi, 'e il portatore ha l\'uso scalato, sullo stesso oggetto', { prima: primaUsi, dopo: port.usiSpesi });
ok(g.invii.length === 0, 'e all\'Hub NON parte niente', g.invii);

console.log('\n' + passati + ' passati, ' + falliti + ' falliti');
process.exit(falliti ? 1 : 0);
