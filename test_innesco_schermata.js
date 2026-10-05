// @versione 2026-10-05.1 | test_innesco_schermata.js | proprieta`: chat TEST
// ============================================================================
//  Dalla chat INTERFACCIA, 5 ottobre 2026.
//
//  COSA PROVA
//  L'innesco di una mina e di un koala DALLA SCHERMATA del reattivo: le
//  domande che compaiono, e cosa succede toccando SI` o NO. Il giro e` quello
//  vero — l'attivo dichiara con selectAction, l'Hub inoltra, il reattivo
//  riceve e apre la selezione ARO — e i segnalini li crea M.creaDeployable,
//  come fa roster_manager.
//
//  PERCHE` ESISTE
//  5 ottobre, due difetti nello stesso punto, nessuno coperto:
//   - koala: la domanda a schermo si chiama dentroZdC, il motore leggeva solo
//     percorsoLibero. Rispondere NO lo faceva DETONARE.
//   - mina: "non risposto" era "=== undefined", nel motore e in logica_aro.
//     Con tre null la mina scattava.
//  Piu` tre difetti di logica_aro corretti lo stesso giorno: il catch che
//  nascondeva un errore del motore, null letto come "non si attiva", e il
//  riquadro che restava muto quando le domande finivano senza un verdetto.
//
//  DI CHI E` IL CODICE PROVATO
//  Le schermate sono di INTERFACCIA (logica_aro.js), il verdetto del MOTORE
//  (M.innescoDeployable).
//
//  USO:  CARTELLA=/percorso/ node test_innesco_schermata.js
// ============================================================================
const DIR = (process.env.CARTELLA || '/mnt/project/').replace(/\/?$/, '/');
const fs = require('fs'), vm = require('vm');
const nonCaricati = [], assenti = [];
let passati = 0, falliti = 0;
function ok(c, d, visto) {
  if (c) { passati++; console.log('  \u2713 ' + d); }
  else { falliti++; console.log('  \u2717 ' + d + (visto !== undefined ? '  [visto: ' + JSON.stringify(visto) + ']' : '')); }
}

const server = {};
function carica(file, g, salta) {
  const h = fs.readFileSync(DIR + file, 'utf8');
  const ctx = vm.createContext(g);
  [...h.matchAll(/<script(?:\s+src="([^"]+)")?\s*>([\s\S]*?)<\/script>/g)].forEach(m => {
    const s = m[1];
    if (s) { if (/^https?:/.test(s)) return; const nome = s.split('?')[0]; if (salta && salta.includes(nome)) return;
      const f = DIR + nome; if (!fs.existsSync(f)) { assenti.push(nome); return; }
      try { vm.runInContext(fs.readFileSync(f, 'utf8'), ctx, { filename: nome }); } catch (e) { nonCaricati.push(nome + ': ' + e.message); } }
    else { try { vm.runInContext(m[2], ctx); } catch (e) { nonCaricati.push('script in linea: ' + e.message); } }
  });
}
function dispositivo(titolo, fazione) {
  const g = {}; g.window = g; g.globalThis = g; g.errori = [];
  g.console = { log: () => {}, warn: () => {}, error: (...a) => g.errori.push(a.map(String).join(' ')) };
  const el = {}; const finto = (id) => { if (!el[id]) el[id] = { id, innerHTML: '', style: {}, appendChild: () => {}, addEventListener: () => {}, value: '', classList: { add: () => {}, remove: () => {} }, setAttribute: () => {}, getAttribute: () => null, options: [], cloneNode() { return finto(id + '_c'); }, parentNode: { replaceChild: () => {}, insertBefore: () => {} }, querySelector: () => null }; return el[id]; };
  const locale = {};
  g.localStorage = { getItem: k => (k in locale ? locale[k] : null), setItem: (k, v) => locale[k] = v, removeItem: k => delete locale[k] };
  g.location = { search: fazione ? '?fazione=' + fazione : '', replace: () => {}, href: '' };
  let t = titolo;
  g.document = { get title() { return t; }, set title(v) { t = v; }, documentElement: { setAttribute: () => {} }, scripts: [], getElementById: finto, createElement: () => finto('n'), querySelector: () => finto('q'), querySelectorAll: () => [], addEventListener: () => {}, write: () => {} };
  g.alert = () => {}; ['scrollTo', 'addEventListener'].forEach(k => g[k] = () => {});
  let tick = null; g.setInterval = (fn) => { tick = fn; return 0; }; g.setTimeout = (fn) => { fn && fn(); return 0; };
  g.history = { pushState: () => {}, replaceState: () => {}, back: () => {} }; g.navigator = {}; g.prompt = () => null; g.confirm = () => true;
  g.firebase = { initializeApp: () => {}, database: () => ({ ref: (k) => { const nome = String(k).split('/').pop();
    return { on: () => {}, set: (v) => { server[nome] = (typeof v === 'string') ? v : JSON.stringify(v); }, remove: () => { delete server[nome]; } }; } }) };
  g.cloudPronto = Promise.resolve({ confermato: true }); g.riprovaCloud = () => Promise.resolve({ confermato: true });
  return { g, el: finto, locale, tick: () => tick && tick() };
}

// Il tavolo: PanOceania attiva, Nomadi reattivi con una mina e un koala.
function tavolo() {
  Object.keys(server).forEach(k => delete server[k]);
  const att = dispositivo('PANOCEANIA TACTICAL TERMINAL', 'panoceania'); carica('app.html', att.g);
  const reat = dispositivo('NOMADS TACTICAL TERMINAL', 'nomadi'); carica('app.html', reat.g);
  const hub = dispositivo('HUB', null); carica('calcolatore_hub.html', hub.g, ['calcolatore_cloud.js']);
  reat.g.isReactiveMode = true; hub.g.hubPronto = true;

  const fus = att.g.DB_PANOCEANIA.find(u => /^Fusilier \(Combi/.test(u.nome));
  att.g.roster = [{ ...fus, id: 'p1', alias: 'Fusilier', states: {}, combatGroup: 1 }];
  att.g.spearheadUnit = att.g.roster[0]; att.g.selectedCoordinatedUnits = []; att.g.currentOrder = {};
  att.g.gameState = { nomads: [], panoceania: att.g.roster };

  const M = reat.g.MotoreN5;
  const zero = { ...reat.g.DB_NOMADI.find(u => /^Zero \(E\/M Mine/.test(u.nome)), id: 'n1', alias: 'Zero', states: {} };
  const crea = (arma, id) => { const t = M.creaDeployable(zero, M.profiloArma(arma), { ordineId: 'schieramento_1', viaEsito: false }).token; t.id = id; return t; };
  const mina = crea('Shock Mine', 'mina1'), koala = crea('CrazyKoalas', 'koala1');
  reat.g.roster = [zero, mina, koala];
  reat.g.gameState = { nomads: reat.g.roster, panoceania: [] };

  att.g.selectAction('MOVIMENTO', false);
  const passa = (d, ritorno) => { Object.keys(server).forEach(k => d.locale[k] = server[k]); d.tick(); if (ritorno) Object.keys(d.locale).forEach(k => { server[k] = d.locale[k]; }); };
  passa(hub, true); passa(reat, false);
  reat.g.apriSelezioneAro();
  const html = () => reat.el('aro-selection-list').innerHTML + reat.el('dom-mina1').innerHTML + reat.el('dom-koala1').innerHTML + reat.el('dep-mina1').innerHTML + reat.el('dep-koala1').innerHTML;
  const detonati = () => (reat.g.aroReactions || []).filter(r => r.azione === 'DETONAZIONE').map(r => r.nome);
  return { g: reat.g, M, el: reat.el, html, detonati, mina, koala };
}

console.log('--- il giro arriva fino alla schermata ---');
let t = tavolo();
ok(assenti.length === 0 && nonCaricati.length === 0, 'tutte le pagine si caricano', assenti.concat(nonCaricati).slice(0, 3));
ok(!!t.g.currentAttackData, 'il reattivo ha ricevuto l\'Ordine dall\'Hub');
const elenco = (t.g.deployableInnescabili || []).map(x => x.unita.id);
ok(elenco.includes('mina1') && elenco.includes('koala1'), 'mina e koala compaiono fra gli innescabili', elenco);
const domKoala = ((t.g.deployableInnescabili || []).find(x => x.unita.id === 'koala1') || {}).domande || [];
ok(domKoala.length === 1, 'il koala ha UNA domanda', domKoala.map(d => d.id));
const idKoala = (domKoala[0] || {}).id;
ok(t.el('aro-selection-list').innerHTML.includes("rispondiInnesco('koala1', '" + idKoala + "', false)"), 'e il pulsante NO chiama rispondiInnesco con l\'id della domanda', idKoala);

console.log('\n--- KOALA: il giocatore tocca NO ---');
t.g.rispondiInnesco('koala1', idKoala, false);
ok(t.detonati().length === 0, 'NON detona (prima del 5 ottobre detonava)', t.detonati());
ok(/non si attiva/.test(t.el('dep-koala1').innerHTML), 'e il riquadro dice che non si attiva', t.el('dep-koala1').innerHTML.slice(0, 160));

console.log('\n--- KOALA: il giocatore tocca SI` ---');
t = tavolo();
t.g.rispondiInnesco('koala1', idKoala, true);
ok(t.detonati().length === 1, 'detona, una volta sola', t.detonati());
ok(/DETONA/.test(t.el('dep-koala1').innerHTML), 'e il riquadro lo dice');

console.log('\n--- MINA: tre domande, una alla volta ---');
t = tavolo();
const domMina = t.g.deployableInnescabili.find(x => x.unita.id === 'mina1').domande.map(d => d.id);
ok(domMina.length === 3, 'la mina ha tre domande', domMina);
t.g.rispondiInnesco('mina1', 'nelTriggerArea', true);
ok(t.detonati().length === 0, 'dopo la prima risposta non detona ancora');
ok(t.el('dom-mina1').innerHTML.includes("'soloSchivataOGuts'"), 'e compare la seconda domanda', t.el('dom-mina1').innerHTML.slice(0, 200));
t.g.rispondiInnesco('mina1', 'soloSchivataOGuts', false);
t.g.rispondiInnesco('mina1', 'alleatoSottoSagoma', false);
ok(t.detonati().length === 1, 'con le tre risposte buone detona', t.detonati());

t = tavolo();
t.g.rispondiInnesco('mina1', 'nelTriggerArea', false);
ok(t.detonati().length === 0 && /non si attiva/.test(t.el('dep-mina1').innerHTML), 'fuori dalla Trigger Area: chiude subito, senza altre domande');

console.log('\n--- null e stringa vuota NON sono risposte ---');
[null, ''].forEach(v => {
  t = tavolo();
  t.g.risposteInnesco.mina1 = { nelTriggerArea: v, soloSchivataOGuts: v, alleatoSottoSagoma: v };
  t.g.attivaDeployable('mina1');
  ok(t.detonati().length === 0, 'mina con tre ' + JSON.stringify(v) + ': non detona', t.detonati());
  ok(!/non si attiva/.test(t.el('dep-mina1').innerHTML), '  e NON viene scritto "non si attiva": non e` un no');
  ok(t.el('dom-mina1').innerHTML.includes("'nelTriggerArea'"), '  la prima domanda torna aperta', t.el('dom-mina1').innerHTML.slice(0, 160));
  t = tavolo();
  t.g.risposteInnesco.koala1 = { [idKoala]: v };
  t.g.attivaDeployable('koala1');
  ok(t.detonati().length === 0 && !/non si attiva/.test(t.el('dep-koala1').innerHTML), 'koala con ' + JSON.stringify(v) + ': ne` detona ne` "non si attiva"', t.detonati());
});

console.log('\n--- quando il motore non decide o solleva, si DICE ---');
t = tavolo();
const vero = t.M.innescoDeployable;
t.M.innescoDeployable = () => ({ scatta: null, motivo: 'manca un dato che la schermata non chiede' });
t.g.rispondiInnesco('koala1', idKoala, true);
ok(t.detonati().length === 0 && /NON DECISO/.test(t.el('dom-koala1').innerHTML) && /manca un dato/.test(t.el('dom-koala1').innerHTML),
   'domande finite ma verdetto null: compare NON DECISO col motivo', t.el('dom-koala1').innerHTML.slice(-200));
t.M.innescoDeployable = () => { throw new Error('guasto di prova'); };
t.g.rispondiInnesco('koala1', idKoala, true);
ok(/guasto di prova/.test(t.el('dom-koala1').innerHTML), 'il motore solleva: il messaggio arriva a schermo', t.el('dom-koala1').innerHTML.slice(-200));
ok(t.g.errori.some(e => /innescoDeployable ha sollevato/.test(e)), 'e in console');
ok(t.detonati().length === 0, 'e niente detona');
t.M.innescoDeployable = vero;

console.log('\n' + passati + ' passati, ' + falliti + ' falliti');
process.exit(falliti ? 1 : 0);
