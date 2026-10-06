// @versione 2026-10-06.3 | test_riquadro_cambio_stato.js | proprieta`: chat INTERFACCIA
// ============================================================================
//  Dalla chat INTERFACCIA, 6 ottobre 2026 (richiesta di Paolo).
//
//  COSA PROVA
//  Il riquadro che dice al giocatore attivo che la sua dichiarazione ha
//  cambiato lo stato della truppa (Marker rivelato, Foxhole cancellato), e
//  che resta a schermo per tutto l'Ordine. Si entra dal menu
//  (procediAlleAzioni) e dal tocco (selectAction); i profili sono del
//  database. Prima il cambio avveniva in silenzio.
//
//  NON PROVA quando uno stato cambia: e` M.statoDopoAbilita, del MOTORE.
//
//  USO:  CARTELLA=/percorso/ node test_riquadro_cambio_stato.js
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
function con(re, stati) {
  const g = apri();
  const p = g.DB_NOMADI.find(u => re.test(u.nome));
  g.roster = [{ ...p, id: 'u1', alias: 'Ombra', states: stati || {}, combatGroup: 1 }];
  g.gameState = { nomads: g.roster, panoceania: [] };
  g.menu = () => { g.spearheadUnit = g.roster[0]; g.selectedCoordinatedUnits = []; g.currentOrder = {}; g.procediAlleAzioni(); };
  g.box = () => { const b = g.el('riquadro-cambio-stato'); return (b.style.display === 'none') ? '' : String(b.innerHTML || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(); };
  g.menu();
  return g;
}
console.log('--- la pagina ---');
let g = con(/^Intruder \(HMG/);
ok(assenti.length === 0 && nonCaricati.length === 0, 'tutti gli script si caricano', assenti.concat(nonCaricati).slice(0, 3));
ok(g.MotoreN5.statoBersaglio(g.roster[0]).camo === true, 'premessa: l\'Intruder del database e` Marker CAMO');
ok(g.box() === '', 'a menu aperto, prima di dichiarare: nessun riquadro', g.box());

console.log('\n--- un Marker CAMO dichiara Attacco BS ---');
g.selectAction('ATTACCO BS', false);
ok(g.MotoreN5.statoBersaglio(g.roster[0]).camo === false, 'premessa: il router lo ha rivelato');
ok(/Ombra/.test(g.box()) && /Marker CAMO/.test(g.box()) && /Modello sul tavolo/.test(g.box()) && /ATTACCO BS/.test(g.box()), 'il riquadro dice chi, da cosa a cosa, e per quale Abilita`', g.box());
const note = (g.ultimoCambioStato.note || []).filter(Boolean);
ok(note.every(n => g.el('riquadro-cambio-stato').innerHTML.includes(n)), 'con le note del motore, testo per testo (' + note.length + ')', note);

console.log('\n--- resta a schermo durante l\'Ordine ---');
g.goToStep('step-weapon');
ok(/Marker CAMO/.test(g.box()), 'passando a un\'altra schermata dello stesso Ordine c\'e` ancora');
g.goToStep('step-second-half');
ok(/Marker CAMO/.test(g.box()), 'e anche alla seconda meta`');

console.log('\n--- e sparisce a Ordine finito ---');
g.tornaAlRadar();
ok(g.box() === '', 'tornando al radar non c\'e` piu`', g.box());
g.menu();
ok(g.box() === '', 'e all\'Ordine dopo, stessa truppa: il cambio vecchio NON ricompare', g.box());
g.selectAction('ATTACCO BS', false);
ok(g.box() === '', 'nemmeno dichiarando di nuovo Attacco BS (ora e` un Modello: niente cambia)', g.box());

console.log('\n--- chi non cambia stato non vede niente ---');
let a = con(/^Alguacil \(Combi/); a.selectAction('ATTACCO BS', false);
ok(a.box() === '', 'Alguacil, Attacco BS: nessun riquadro', a.box());
let c = con(/^Intruder \(HMG/); c.selectAction('CAUTO', false);
ok(c.MotoreN5.statoBersaglio(c.roster[0]).camo === true && c.box() === '', 'Marker CAMO in Movimento Cauto: resta Marker, nessun riquadro', c.box());

console.log('\n--- Foxhole cancellato ---');
let f = con(/^Alguacil \(Combi/, { foxhole: true }); f.rispostaConferma = true;
f.selectAction('MOVIMENTO', false); f.goToStep('step-second-half');
ok(/Foxhole/.test(f.box()) && /Modello sul tavolo/.test(f.box()), 'OK alla domanda: il riquadro dice Foxhole -> Modello, con le note', f.box().slice(0, 300));
f = con(/^Alguacil \(Combi/, { foxhole: true }); f.rispostaConferma = false;
f.selectAction('MOVIMENTO', false); f.goToStep('step-second-half');
ok(f.box() === '', 'Annulla: lo stato non cambia, nessun riquadro', f.box());

console.log('\n' + passati + ' passati, ' + falliti + ' falliti');
process.exit(falliti ? 1 : 0);
