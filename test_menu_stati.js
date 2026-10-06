// @versione 2026-10-06.2 | test_menu_stati.js | proprieta`: chat INTERFACCIA
// ============================================================================
//  Dalla chat INTERFACCIA, 6 ottobre 2026.
//
//  COSA PROVA
//  Il menu degli Ordini (procediAlleAzioni) per una truppa con uno stato
//  addosso offre le voci che permette M.azionePermessaDaStati, Idle compreso.
//  Prima puoFareAzione (app.html) aveva sei liste sue e l'Idle sempre
//  offerto: negava MOVIMENTO, CAUTO e SALTO al Trincerato e offriva l'Idle a
//  IMM-A e IMM-B. I tre casi hanno ciascuno il suo verso.
//  Poi: toccando MOVIMENTO da Trincerato arriva la domanda del router sulla
//  cancellazione del Foxhole (prima la voce era nascosta: non arrivava mai).
//
//  NON PROVA quali azioni permette ogni stato: quella e` la regola, sta nel
//  catalogo e nei banchi del MOTORE. Qui si guarda che il menu la segua.
//
//  USO:  CARTELLA=/percorso/ node test_menu_stati.js
// ============================================================================
const DIR = (process.env.CARTELLA || '/mnt/project/').replace(/\/?$/, '/');
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
function con(stati) {
  const g = apri();
  const p = g.DB_NOMADI.find(u => /^Alguacil \(Combi/.test(u.nome));
  g.roster = [{ ...p, id: 'u1', alias: 'Prova', states: stati || {}, combatGroup: 1 }];
  g.gameState = { nomads: g.roster, panoceania: [] };
  g.spearheadUnit = g.roster[0]; g.selectedCoordinatedUnits = []; g.currentOrder = {};
  g.procediAlleAzioni();
  g.voci = (g.el('action-list-container').innerHTML.match(/selectAction\('([^']+)', false\)/g) || []).map(s => s.replace(/.*\('|', false\)/g, ''));
  return g;
}
console.log('--- la pagina ---');
const base = con();
ok(assenti.length === 0 && nonCaricati.length === 0, 'tutti gli script si caricano', assenti.concat(nonCaricati).slice(0, 3));
ok(base.voci.includes('MOVIMENTO') && base.voci.includes('IDLE') && base.voci.includes('ATTACCO BS'), 'senza stati il menu ha Movimento, Idle e Attacco BS', base.voci);

console.log('\n--- ogni voce offerta e` permessa dal motore, e nessuna voce permessa sparisce ---');
const STATI = { engaged: 'Ingaggiato', retreat: 'Ritirata!', foxhole: 'Trincerato', immobilizedA: 'IMM-A', immobilizedB: 'IMM-B', stunned: 'Stordito', targeted: 'Bersagliato' };
Object.keys(STATI).forEach(st => {
  const g = con({ [st]: true }); const M = g.MotoreN5; const u = g.roster[0];
  const vietateOfferte = g.voci.filter(a => M.azionePermessaDaStati(u, a).permessa !== true);
  // "sparite": voci che il menu senza stati offriva, che il motore permette anche con lo stato, e che ora mancano
  const sparite = base.voci.filter(a => M.azionePermessaDaStati(u, a).permessa === true && !g.voci.includes(a));
  ok(vietateOfferte.length === 0, STATI[st] + ': nessuna voce vietata nel menu', vietateOfferte);
  ok(sparite.length === 0, STATI[st] + ': nessuna voce permessa manca [' + g.voci.join(', ') + ']', sparite);
});

console.log('\n--- i tre casi che erano sbagliati ---');
let f = con({ foxhole: true });
ok(['MOVIMENTO', 'CAUTO', 'SALTO'].every(a => f.voci.includes(a)), 'Trincerato: MOVIMENTO, CAUTO e SALTO si possono dichiarare (righe 13863-13867)', f.voci);
ok(!con({ immobilizedA: true }).voci.includes('IDLE'), 'IMM-A: l\'Idle NON e` una voce di menu (riga 14130)');
ok(!con({ immobilizedB: true }).voci.includes('IDLE'), 'IMM-B: l\'Idle NON e` una voce di menu (riga 14176)');
ok(con({ engaged: true }).voci.includes('IDLE') && con({ retreat: true }).voci.includes('IDLE'), 'Ingaggiato e Ritirata!: l\'Idle c\'e`');
ok(!con({ retreat: true }).voci.includes('SALTO'), 'Ritirata!: niente SALTO');

console.log('\n--- da Trincerato, toccando MOVIMENTO arriva la domanda del router ---');
f = con({ foxhole: true }); f.rispostaConferma = true; f.domande.length = 0;
f.selectAction('MOVIMENTO', false);
ok(f.domande.some(t => /Foxhole/i.test(t)), 'la domanda sulla cancellazione del Foxhole viene fatta', f.domande);
ok(f.currentOrder.foxholeCancellato === true, 'OK -> currentOrder.foxholeCancellato true', f.currentOrder.foxholeCancellato);
ok(f.MotoreN5.statoBersaglio(f.roster[0]).foxhole !== true, 'e nel roster non e` piu` Trincerato', f.roster[0].states);
f = con({ foxhole: true }); f.rispostaConferma = false; f.avvisi.length = 0;
f.selectAction('MOVIMENTO', false);
ok(f.currentOrder.foxholeCancellato === false && f.MotoreN5.statoBersaglio(f.roster[0]).foxhole === true, 'Annulla -> foxholeCancellato false, resta Trincerato', { c: f.currentOrder.foxholeCancellato, st: f.roster[0].states });
ok(f.avvisi.some(t => /Foxhole/i.test(t)), 'e gli viene detto che non si muove', f.avvisi);
const n = con(); n.domande.length = 0; n.selectAction('MOVIMENTO', false);
ok(!n.domande.some(t => /Foxhole/i.test(t)) && !('foxholeCancellato' in n.currentOrder), 'controprova: chi non e` Trincerato non riceve la domanda');

console.log('\n' + passati + ' passati, ' + falliti + ' falliti');
process.exit(falliti ? 1 : 0);
