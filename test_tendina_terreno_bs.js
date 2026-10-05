// @versione 2026-10-05.1 | test_tendina_terreno_bs.js | proprieta`: chat MOTORE
// ============================================================================
//  LA TENDINA UNICA DI TERRENO E ZONA NELL'ATTACCO BS.
//
//  COSA PROVA
//  window.tendinaTerrenoBS e window.setTargetTerrenoBS, in
//  ordine_attacco_bs.js 2026-10-05.1 — codice della chat MOTORE, provato
//  attraverso le schermate dell'interfaccia. Il lato ARO della stessa tendina
//  sta in test_tendina_terreno.js e qui non si rifa`.
//
//  PERCHE` ESISTE
//  Togliendo i due comandi vecchi — setTargetZonaBS e setTargetTerrainBS —
//  non e` diventato rosso niente: nessun banco li esercitava. "Offrire non e`
//  provare" vale anche per una tendina.
//
//  DA DOVE SI ENTRA
//  Dalla porta del giocatore: app.html intera in un contesto vm, poi
//  selectAction('ATTACCO BS', false). L'identificativo e` con lo SPAZIO:
//  'ATTACCO_BS' e 'BS_ATTACK' non sollevano e non scrivono currentOrder.action
//  — e un banco che li usasse proverebbe il nulla restando verde.
//  L'imbracatura e` quella di test_requisito_fallito.js, copiata e non
//  ricostruita.
//
//  USO:  CARTELLA=/percorso/ node test_tendina_terreno_bs.js
// ============================================================================
const DIR = (process.env.CARTELLA || '/mnt/project/').replace(/\/?$/, '/');
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


// Un Intruder del database, un terreno dichiarato, un bersaglio scelto dal
// percorso vero. Il bersaglio NON si scrive a mano in combatTargets: lo si fa
// arrivare dalla conferma, perche` e` la forma che il modulo produce davvero.
function scena() {
  const g = apri();
  const mio = g.DB_NOMADI.find(u => u.id === 'intruder_hmg');
  const suo = g.DB_PANOCEANIA.find(u => /^Fusilier \(Combi/.test(u.nome));
  g.roster = [{ ...mio, id: 'u1', alias: 'Ombra', states: {}, combatGroup: 1 }];
  g.gameState = { nomads: g.roster, panoceania: [{ ...suo, id: 'e1', alias: 'Fus', states: {} }] };
  g.spearheadUnit = g.roster[0];
  g.selectedCoordinatedUnits = [];
  g.currentOrder = {};
  // Un terreno dichiarato sul tavolo: senza, la tendina avrebbe solo le zone.
  const ter = (g.DB_TERRENI || []).find(t => t.id === 'TER_10') || (g.DB_TERRENI || [])[9];
  g.activeTerrains = ter ? [ter] : [];
  g.selectAction('ATTACCO BS', false);
  return { g, ter };
}

console.log('--- la pagina si carica ---');
const s = scena();
ok(assenti.length === 0, 'nessun file citato manca dalla cartella', assenti);
ok(nonCaricati.length === 0, 'nessuno script solleva caricandosi', nonCaricati.slice(0, 3));
ok(!!s.g.currentOrder.action, 'selectAction scrive l\'Abilita` dichiarata', s.g.currentOrder.action);
ok(!!s.ter, 'un terreno dichiarato sul tavolo', s.ter && s.ter.id);

console.log('\n--- la scheda del bersaglio ha UNA tendina sola ---');
const g = s.g;
g.combatTargets = [{ id: 'e1', name: 'Fusilier (Combi Rifle)', burst: 1, rangeIndex: 1, rangeMod: 3,
                     cover: false, terrain: 'NESSUNO', zona: null, ammo: 'N' }];
g.totalBurst = 3;
let html = '';
try { html = String(g.tendinaTerrenoBS(g.combatTargets[0], 0) || ''); } catch (e) { html = 'ECCEZIONE: ' + e.message; }
ok(!/ECCEZIONE/.test(html), 'tendinaTerrenoBS non solleva', html.slice(0, 80));
ok((html.match(/<select/g) || []).length === 1, 'una select sola, non due', (html.match(/<select/g) || []).length);
ok(/setTargetTerrenoBS/.test(html), 'e il suo comando e` setTargetTerrenoBS');
const voci = [...html.matchAll(/value="([^"]*)"/g)].map(m => m[1]);
['TER_10', 'TER_10+FUMO', 'TER_10+ECLIPSE', 'NESSUNO+FUMO', 'NESSUNO+ECLIPSE'].forEach(v => {
  ok(voci.indexOf(v) >= 0, 'fra le voci c\'e` ' + v, voci);
});

console.log('\n--- il valore composto si separa in due campi ---');
// E` il punto del contratto: la tendina compone, separaTerrenoEZona separa, e
// chi riceve non legge la stringa a mano.
g.setTargetTerrenoBS(0, 'TER_10+FUMO');
ok(g.combatTargets[0].terrain === 'TER_10', 'terrain TER_10', g.combatTargets[0].terrain);
ok(g.combatTargets[0].zona === 'FUMO', 'zona FUMO', g.combatTargets[0].zona);
g.setTargetTerrenoBS(0, 'TER_10');
ok(g.combatTargets[0].zona === null, 'senza zona il campo e` null, non la stringa vuota', g.combatTargets[0].zona);
g.setTargetTerrenoBS(0, 'NESSUNO+ECLIPSE');
ok(g.combatTargets[0].terrain === 'NESSUNO' && g.combatTargets[0].zona === 'ECLIPSE',
   'zona senza terreno: NESSUNO + ECLIPSE', [g.combatTargets[0].terrain, g.combatTargets[0].zona]);

console.log('\n--- la scelta resta selezionata dopo il ridisegno ---');
g.setTargetTerrenoBS(0, 'TER_10+FUMO');
const dopo = String(g.tendinaTerrenoBS(g.combatTargets[0], 0) || '');
ok(/value="TER_10\+FUMO"[^>]*selected/.test(dopo) || /selected[^>]*value="TER_10\+FUMO"/.test(dopo),
   'la voce scelta e` selected al ridisegno',
   (dopo.match(/<option[^>]*selected[^>]*>/) || [''])[0]);

console.log('\n--- i due comandi vecchi non esistono piu` ---');
ok(typeof g.setTargetZonaBS !== 'function', 'setTargetZonaBS tolto', typeof g.setTargetZonaBS);
ok(typeof g.setTargetTerrainBS !== 'function', 'setTargetTerrainBS tolto', typeof g.setTargetTerrainBS);

console.log('\n--- e tutti e due i campi arrivano nella busta ---');
// La busta non si ricostruisce: la produce il modulo, come in partita.
// Si intercetta M.inviaCalcolo, la porta unica verso l'Hub: il suo argomento
// e` quello che il MODULO ha composto. Guardare solo la busta spedita non
// basterebbe — se la validazione blocca l'invio per un motivo che non c'entra
// con la tendina, il banco direbbe "la zona non arriva" mentre il modulo
// l'aveva messa.
let composto = null, busta = null;
const inviaVero = g.MotoreN5.inviaCalcolo;
// Si COPIA, non si tiene il riferimento: se l'invio viene rifiutato il modulo
// svuota coordPayloads, e una spia che tenesse l'array direbbe "non ha
// composto niente" proprio mentre lo stava guardando. Ci sono cascato.
g.MotoreN5.inviaCalcolo = function (payloads, opz) {
  composto = JSON.parse(JSON.stringify(payloads || []));
  return inviaVero.call(this, payloads, opz);
};
g.inviaCalcoloAllHub = (p) => { busta = p; };
g.setTargetTerrenoBS(0, 'TER_10+FUMO');
g.combatTargets[0].burst = 3;
// Il calcolo legge coordUnits/coordIndex e l'arma dell'Ordine: sono i campi
// che la schermata della scelta arma avrebbe riempito. Si mettono qui perche`
// il percorso di scelta dell'arma non e` quello in prova.
g.coordUnits = [g.roster[0]]; g.coordIndex = 0; g.coordPayloads = []; g.coordMode = false;
g.currentOrder.unit = g.roster[0];
g.currentOrder.weapon = 'Heavy Machine Gun';
g.totalBurst = 3;
try { g.eseguiCalcoloBS(); } catch (e) { /* conta quello che ha composto */ }
// La busta la costruisce M.inviaCalcolo dai coordPayloads: si guarda quella se
// e` partita, altrimenti il payload che il modulo ha appena composto — in
// entrambi i casi e` roba prodotta dal modulo, non scritta qui.
const fonte = (busta && busta.attacchi) ? busta.attacchi[0] : (composto || [])[0];
const bers = fonte && fonte.bersagli && fonte.bersagli[0];
ok(!!bers, 'il modulo compone l attacco col suo bersaglio', fonte && Object.keys(fonte || {}));
ok(bers && bers.terrain === 'TER_10', 'e porta il terreno', bers && bers.terrain);
ok(bers && bers.zona === 'FUMO', 'e la zona, che e` il campo nuovo', bers && bers.zona);

console.log('\n\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500');
console.log(passati + ' passati, ' + falliti + ' falliti');
process.exit(falliti ? 1 : 0);
