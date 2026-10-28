// @versione 2026-10-28.1 | test_novita_28ott.js | proprieta`: chat TEST
// ============================================================================
//  LA CONSEGNA DI MOTORE DEL 28 OTTOBRE (motore 2026-10-28.1) — node test_novita_28ott.js
//  ---------------------------------------------------------------------------
//  Prove nuove della chat TEST, ognuna con la sua controprova:
//   R1. Intestazioni degli Ordini senza icone (M.intestazioneOrdine,
//       M.senzaIconaIniziale), sulle pagine intere.
//   R2. Le note (ⓘ) sono dell'Ordine: un Ordine nuovo azzera step-weapon,
//       step-wait-aro e step-modifiers (motore_core, selectAction); la seconda
//       meta` no. E i tipi spenti nelle opzioni delle note le nascondono.
//   R3. Il bottone dell'arma su scala comune di 96": su tutte le armi con
//       bande, celle contigue da 0 come M.gittateRaggruppate, larghezza
//       proporzionale, cella-fuori fino a 96.
//   R4. M.barraGittata: un .range-seg per banda (indice = banda), FUORI in
//       coda, n+1 confini; su tutte le armi con bande.
//   R5. M.nota / M.azzeraNote senza app.html (window.INFO) e con app.html
//       (window.aggiungiInfo).
//   R6. BS-31 del piano (revisione 49), l'Atteso sulla pagina intera.
//   R7. BS-16 e BS-16b (revisione 49): sempre al pieno, la voce Burst nella ⓘ.
//  L'harness creaTavolo e` quello di test_novita_26ott.js (copiato: ogni banco
//  basta a se stesso).
//  USO:  CARTELLA=/percorso/ node test_novita_28ott.js
// ============================================================================
const fs=require("fs"),vm=require("vm");const J=JSON.stringify;
function creaTavolo(DIR, opz) {
  opz = opz || {};
  DIR = DIR.replace(/\/?$/, '/');
  const server = {}, dispositivi = [], problemi = [];
  function recapita(da, chiave, valore) {
    if (valore === null) delete server[chiave]; else server[chiave] = valore;
    dispositivi.forEach(d => { if (d !== da) d.riceve(chiave, valore); });
  }
  function avvia(nome, titolo, pagina, ricerca) {
    const memoria = {}, el = {}, ascolti = {}, storage = [];
    const g = { errori: [], avvisi: [], alert_: [] };
    g.console = { log: () => {}, warn: (...a) => g.avvisi.push(a.map(String).join(' ')), error: (...a) => g.errori.push(a.map(x => (x && x.stack) || String(x)).join(' ')) };
    g.window = g; g.globalThis = g;
    const finto = (id) => { if (!el[id]) el[id] = { id, innerHTML: '', innerText: '', style: {}, value: '', checked: false, disabled: false, options: [],
        appendChild() {}, addEventListener() {}, remove() {}, setAttribute() {}, getAttribute() { return null; }, scrollTop: 0, scrollHeight: 0,
        classList: { add() {}, remove() {}, toggle() {} }, cloneNode() { return this; }, parentNode: { replaceChild() {}, insertBefore() {} },
        querySelector() { return null; }, querySelectorAll() { return []; } }; return el[id]; };
    let t = titolo;
    g.document = { get title() { return t; }, set title(v) { t = v; }, documentElement: { setAttribute() {} }, scripts: [], body: finto('body'),
        getElementById: finto, createElement: () => finto('nuovo_' + Math.random()), querySelector: (s) => finto('q:' + s), querySelectorAll: () => [],
        addEventListener() {}, write() {} };
    g.alert = (m) => g.alert_.push(String(m)); g.confirm = () => true; g.prompt = () => 'motivo di prova'; g.scrollTo = () => {};
    g._cicli = []; g.setInterval = (fn) => { g._cicli.push(fn); return g._cicli.length; };
    g.setTimeout = (fn) => { try { fn && fn(); } catch (e) { g.errori.push('setTimeout: ' + e.stack); } return 0; };
    g.addEventListener = (tipo, fn) => { if (tipo === 'storage') storage.push(fn); };
    g.Event = function (tipo) { this.type = tipo; };
    g.dispatchEvent = (ev) => storage.forEach(fn => fn(ev));
    g.history = { pushState() {}, replaceState() {}, back() {} }; g.navigator = {};
    g.location = { search: ricerca || '', replace() {}, href: '', reload() {} };
    g.localStorage = { getItem: k => (k in memoria ? memoria[k] : null), setItem: (k, v) => { memoria[k] = String(v); }, removeItem: k => { delete memoria[k]; } };
    const d = { nome, g, memoria, el: finto, elementi: el };
    d.riceve = (k, v) => {
      if (ascolti[k]) ascolti[k]({ val: () => v });
      else { if (v === null) delete memoria[k]; else memoria[k] = v; storage.forEach(fn => fn({ key: k, newValue: v })); }
    };
    g.firebase = { initializeApp: () => ({}), database: () => ({ ref: (k) => ({
        on: (ev, fn) => { ascolti[k] = fn; }, set: (v) => recapita(d, k, String(v)), update() {}, remove: () => recapita(d, k, null),
        once: () => Promise.resolve({ val: () => (k in server ? server[k] : null) }) }) }) };
    const ctx = vm.createContext(g);
    const h = fs.readFileSync(DIR + pagina, 'utf8');
    [...h.matchAll(/<script(?:\s+src="([^"]+)")?\s*>([\s\S]*?)<\/script>/g)].forEach(m => {
      const s = m[1];
      if (s) { if (/^https?:/.test(s)) return; const f = s.split('?')[0]; g.document.scripts.push({ src: f });
        if (!fs.existsSync(DIR + f)) { problemi.push(nome + ': manca ' + f); return; }
        try { vm.runInContext(fs.readFileSync(DIR + f, 'utf8'), ctx, { filename: f }); } catch (e) { problemi.push(nome + ': ' + f + ': ' + e.message); } }
      else { try { vm.runInContext(m[2], ctx, { filename: pagina + ':inline' }); } catch (e) { problemi.push(nome + ': inline: ' + e.message); } }
    });
    d.giro = () => g._cicli.forEach(fn => fn());
    dispositivi.push(d);
    return d;
  }
  const pagina = opz.pagina || 'app.html';
  const nomadi = avvia('NOMADI', 'NOMADS', pagina, '?fazione=nomadi');
  const pano = avvia('PANOCEANIA', 'PANOCEANIA', pagina, '?fazione=panoceania');
  const hub = avvia('HUB', 'HUB', 'calcolatore_hub.html', '');
  hub.g.hubPronto = true;
  const T = { server, nomadi, pano, hub, problemi };
  T.giro = (n) => { for (let i = 0; i < (n || 3); i++) { hub.giro(); nomadi.giro(); pano.giro(); } };
  // Schiera: i roster partono verso l'Hub dal mittente vero.
  T.schiera = (rN, rP, attiva) => {
    nomadi.g.roster = rN; pano.g.roster = rP;
    [nomadi, pano].forEach(d => { d.g.activeStructures = d.g.activeStructures || []; d.g.activeTerrains = d.g.activeTerrains || []; d.g.schieramentoCompletato = true; });
    nomadi.g.inviaSchieramentoAllHub('NOMADI', { roster: rN, strutture: [], terreni: nomadi.g.activeTerrains });
    pano.g.inviaSchieramentoAllHub('PANOCEANIA', { roster: rP, strutture: [], terreni: pano.g.activeTerrains });
    T.giro();
    if ((attiva || 'NOMADI') !== hub.g.gameState.activeFaction) hub.g.toggleTurn();
    else hub.g.localStorage.setItem(hub.g.MotoreN5.CANALI.HUB_TURNO, JSON.stringify({ attivo: hub.g.gameState.activeFaction }));
    T.giro();
  };
  T.profilo = (d, re) => { const tutti = [].concat(d.g.DB_NOMADI, d.g.DB_PANOCEANIA); const p = tutti.find(u => re.test(u.nome)); if (!p) throw new Error('profilo non trovato: ' + re); return JSON.parse(JSON.stringify(p)); };
  // Il giocatore sceglie l'unita` e apre il menu degli Ordini.
  T.apriMenu = (d, indice) => { const g = d.g; g.currentOrder = {}; g.spearheadUnit = g.roster[indice || 0]; g.selectedCoordinatedUnits = []; g.isCoordinated = false; g.procediAlleAzioni(); return d.el('action-list-container').innerHTML; };
  return T;
}



// ---------------------------------------------------------------------------
const DIR = (process.env.CARTELLA || __dirname).replace(/\/?$/, '/');
let passati = 0, falliti = 0;
function ok(c, d, visto) {
    if (c) { passati++; console.log('  ✓ ' + d); }
    else { falliti++; console.log('  ✗ ' + d + (visto !== undefined ? '  [visto: ' + JSON.stringify(visto) + ']' : '')); }
}
function sezione(titolo, fn) {
    console.log('\n=== ' + titolo + ' ===');
    try { fn(); } catch (e) { falliti++; console.log('  ✗ la sezione e` caduta: ' + e.message + ' ' + ((e.stack || '').split('\n')[1] || '').trim()); }
}
const tx = (h) => String(h).replace(/<(?:[^>"']|"[^"]*"|'[^']*')*>/g, ' ').replace(/\s+/g, ' ').trim();
const tr = (p, a) => Object.assign(JSON.parse(J(p)), { states: {}, deployState: 'NORMAL', state: 'ACTIVE', combatGroup: 1 }, a);
const ris = (T) => T.hub.el('step-resolution').style.display === 'block';
const tab = (T) => tx(T.hub.el('clash-container').innerHTML);
// La busta che parte verso l'Hub: azione, Burst, regole e opzioni (aroAtteso).
const spia = (g) => { const s = { n: 0, op: {}, p: null }; const M = g.MotoreN5, o = M.inviaCalcolo;
    M.inviaCalcolo = function (p, op) { s.n++; s.p = p.map(x => ({ az: x.azione, bd: x.burstDisponibile, b: (x.bersagli || []).map(b => b.burst), reg: x.regole })); s.op = op || {}; return o.apply(this, arguments); }; return s; };
const tavolo = (rN, rP, attiva) => { const T = creaTavolo(DIR); T.schiera(rN(T), rP(T), attiva); return T; };
const P_ = (T, re) => T.profilo(T.nomadi, re);


const premi = (d, id) => { const b = d.el(id); return typeof b.onclick === 'function' ? b.onclick() : undefined; };

// ---------------------------------------------------------------------------
const TRIP = /^Triphammer \(Heavy Shotgun, Heavy Rocket Launcher, Panzerfaust/;
const FUS = (T, id, a) => tr(T.profilo(T.pano, /^Fusilier \(Combi/), Object.assign({ id, alias: id === 'p1' ? 'F1' : id }, a || {}));
const bottoni = (h) => (String(h).match(/<button[^>]*class="bottone-arma[\s\S]*?<\/button>/g) || []);
const diArma = (h, re) => bottoni(h).find(b => re.test(b)) || '';
const classe = (b) => (b.match(/class="([^"]*)"/) || [])[1];
const onclickDi = (b) => (b.match(/onclick="([^"]*)"/) || [])[1] || '';
const passo = (T) => Object.keys(T.nomadi.elementi).filter(k => /^step-/.test(k) && T.nomadi.elementi[k].style.display && T.nomadi.elementi[k].style.display !== 'none');

// ---------------------------------------------------------------------------
// Un motore da solo, senza pagina, in un contesto suo (per R3-R5).
const motoreSolo = (conPagina) => {
    const g = { console: { log() {}, warn() {}, error() {} } }; g.window = g; g.globalThis = g;
    g.document = { title: 'NOMADS', addEventListener() {}, querySelectorAll: () => [], getElementById: () => null };
    g.localStorage = { getItem: () => null, setItem() {}, removeItem() {} }; g.setInterval = () => 0; g.setTimeout = () => 0; g.addEventListener = () => {};
    if (conPagina) { g._chiamate = []; g.aggiungiInfo = (...a) => g._chiamate.push(['aggiungi'].concat(a)); g.azzeraInfo = (s) => g._chiamate.push(['azzera', s]); }
    const c = vm.createContext(g);
    ['catalogo_n5.js', 'database_comune.js', 'motore_regole_n5.js'].forEach(f => vm.runInContext(fs.readFileSync(DIR + f, 'utf8'), c, { filename: f }));
    return g;
};
const titoliOrdine = (d) => Object.keys(d.elementi).map(k => String(d.elementi[k].innerHTML || ''))
    .join(' ').match(/<div class="intestazione-ordine"[^>]*>\s*<b[^>]*>[^<]*<\/b>/g) || [];

sezione('R1. Intestazioni degli Ordini senza icone (MOTORE 2026-10-28.1)', () => {
    const T = tavolo(T => [tr(P_(T, /^Alguacil \(Combi/), { id: 'n1', alias: 'Alg' }), tr(P_(T, /^Zero \(Hacker/), { id: 'n2', alias: 'Zero' }),
                           tr(P_(T, /^Alguacil \(Paramedic/), { id: 'n3', alias: 'Med' }), tr(P_(T, /^Puppet Masters/), { id: 'n4', alias: 'Posa' }),
                           tr(P_(T, /^Alguacil \(Combi/), { id: 'n5', alias: 'Ferito', states: { unconscious: true } })],
                     T => [FUS(T, 'p1'), tr(T.profilo(T.pano, /^Fusilier \(Combi/), { id: 'p2', alias: 'Ombra', deployState: 'CAMO', states: { camo: true } })], 'NOMADI');
    const N = T.nomadi.g, M = N.MotoreN5;
    const visti = [];
    [[0, 'ATTACCO BS'], [1, 'HACKING'], [2, 'MEDICO_INGEGNERE'], [0, 'ATTACCO CC'], [3, 'PIAZZARE EQUIPAGGIAMENTO'], [0, 'SCOPRIRE'], [0, 'SCHIVATA']].forEach(([i, az]) => {
        Object.keys(T.nomadi.elementi).forEach(k => { T.nomadi.elementi[k].innerHTML = ''; });
        T.apriMenu(T.nomadi, i); N.selectAction(az, false);
        titoliOrdine(T.nomadi).forEach(h => visti.push({ az, t: tx(h) }));
        N.tornaAlRadar(); T.giro();
    });
    const testi = [...new Set(visti.map(v => v.t))];
    const conIcona = testi.filter(t => M.senzaIconaIniziale(t) !== t || /^[^A-Za-z0-9À-ÿ]/.test(t));
    ok(testi.length >= 4 && conIcona.length === 0, 'su sette Ordini, nessuna intestazione comincia con un icona (' + testi.length + ' intestazioni)', { testi, conIcona });
    ok(['ATTACCO BS', 'INFOGUERRA', 'SUPPORTO'].every(t => testi.indexOf(t) >= 0), '  e le intestazioni ci sono: ATTACCO BS, INFOGUERRA, SUPPORTO', testi);
    // CONTROPROVA: la regola sta nel motore, anche se un modulo l icona la passa.
    const h = M.intestazioneOrdine({ titolo: '🎯 ATTACCO BS', nota: 'n' });
    ok(tx(h).indexOf('ATTACCO BS') === 0 && !/🎯/.test(h), 'CONTROPROVA: M.intestazioneOrdine({ titolo: «🎯 ATTACCO BS» }) scrive «ATTACCO BS»', tx(h));
    ok(M.senzaIconaIniziale('IDLE ⚠️') === 'IDLE ⚠️' && M.senzaIconaIniziale('⚠️ IDLE') === 'IDLE' && M.senzaIconaIniziale('🩺 SUPPORTO') === 'SUPPORTO',
       '  e toglie solo le icone IN TESTA: «IDLE ⚠️» resta, «⚠️ IDLE» e «🩺 SUPPORTO» si puliscono');
});

sezione('R2. Le note (ⓘ) sono dell Ordine: un Ordine nuovo le azzera, la seconda meta` no', () => {
    const T = tavolo(T => [tr(P_(T, /^Alguacil \(Combi/), { id: 'n1', alias: 'Alg' }), tr(P_(T, /^Clockmaker \(Engineer\)/), { id: 'n2', alias: 'Clock' })],
                     T => [FUS(T, 'p1')], 'NOMADI');
    const N = T.nomadi.g;
    const gizmo = () => N.vociInfo('step-weapon').filter(v => /^GizmoKit non utilizzabile/.test(v.titolo));
    T.apriMenu(T.nomadi, 1); N.selectAction('ATTACCO BS', false);
    const g1 = gizmo();
    ok(g1.length === 1 && g1[0].tipo === 'nonpuo' && /SUPPORTO/.test(g1[0].testo), 'Ordine 1, Clockmaker in ATTACCO BS: nella ⓘ «GizmoKit non utilizzabile» (nonpuo)', N.vociInfo('step-weapon').map(v => v.titolo));
    // I tipi spenti nelle opzioni delle note (scegli_fazione.html) le nascondono.
    N.localStorage.setItem('opzioni_note', J({ dove: 'info', tipi: { nonpuo: false } }));
    ok(gizmo().length === 0 && (N.INFO['step-weapon'] || []).some(v => /^GizmoKit/.test(v.titolo)), '  con «PERCHÉ NON SI PUÒ» spento la voce non si mostra (ma resta depositata)');
    N.localStorage.setItem('opzioni_note', J({ dove: 'info', tipi: { nonpuo: true } }));
    ok(gizmo().length === 1, '  CONTROPROVA: riacceso, torna');
    // La seconda meta` dello stesso Ordine non azzera.
    N.currentOrder.isSecondHalf = true; N.selectAction('MOVIMENTO', true);
    ok(gizmo().length === 1, 'CONTROPROVA: la seconda meta` (MOVIMENTO) dello stesso Ordine non tocca le note', N.vociInfo('step-weapon').map(v => v.titolo));
    N.tornaAlRadar(); T.giro();
    // Un Ordine nuovo, con un modulo che non ne deposita.
    T.apriMenu(T.nomadi, 0); N.selectAction('MOVIMENTO', false);
    ok(N.vociInfo('step-weapon').length === 0 && (N.INFO['step-weapon'] || []).length === 0 && (N.INFO['step-modifiers'] || []).length === 0 && (N.INFO['step-wait-aro'] || []).length === 0,
       'Ordine 2 (Alguacil, MOVIMENTO): step-weapon, step-modifiers e step-wait-aro sono vuoti, niente note dell Ordine di prima', [N.INFO['step-weapon'], N.INFO['step-modifiers']]);
});

sezione('R3. Il bottone dell arma su scala comune di 96" (tutte le armi con bande)', () => {
    const g = motoreSolo(false), M = g.MotoreN5;
    const nomi = Object.keys(g.RULES_WEAPONS || {}).filter(n => { const p = M.profiloArma(n); return p && !p.nonTrovata && p.bands && p.bands.length && p.bands.every(b => typeof b.a === 'number' && /^\d+-\d+"$/.test(b.label)); });
    const storte = [];
    nomi.forEach(n => {
        const p = M.profiloArma(n), h = M.bottoneArma(p, {});
        const cs = [...h.matchAll(/<div class="cella-gittata" data-da="(\d+)" data-fino="(\d+)" data-mod="(-?\d+)" style="flex:0 0 ([\d.]+)%/g)].map(x => ({ da: +x[1], fino: +x[2], mod: +x[3], w: +x[4] }));
        const fu = h.match(/<div class="cella-gittata cella-fuori" data-da="(\d+)" data-fino="(\d+)"/);
        const gr = M.gittateRaggruppate(p.bands);
        const fine = cs.length ? cs[cs.length - 1].fino : 0;
        const bene = cs.length === gr.length && cs.every((c, i) => c.fino === gr[i].fino && c.mod === gr[i].mod && c.da === (i ? cs[i - 1].fino : 0) && Math.abs(c.w - (c.fino - c.da) / 0.96) < 0.05)
            && (fine < 96 ? (!!fu && +fu[1] === fine && +fu[2] === 96) : !fu) && !/data-mod/.test((h.match(/cella-fuori[^>]*>/) || [''])[0]);
        if (!bene) storte.push({ n, cs, gr, fu: fu && fu.slice(1) });
    });
    ok(nomi.length > 100 && storte.length === 0, 'su ' + nomi.length + ' armi: celle contigue da 0 = M.gittateRaggruppate, larghezza (fino - da) / 96, FUORI fino a 96 senza data-mod', storte.slice(0, 3));
    // Le Sagome Dirette hanno una banda finta («Sagoma LargeTeardrop»): fuori dal giro.
    // CONTROPROVA: senza bande nessuna cella.
    ['Light Flamethrower', 'Monofilament CC Weapon'].forEach(n => ok(!/cella-gittata/.test(M.bottoneArma(M.profiloArma(n), {})), 'CONTROPROVA: ' + n + ', nessuna cella della gittata'));
});

sezione('R4. M.barraGittata: un segmento per banda, FUORI in coda, n+1 confini (tutte le armi)', () => {
    const g = motoreSolo(false), M = g.MotoreN5;
    const nomi = Object.keys(g.RULES_WEAPONS || {}).filter(n => { const p = M.profiloArma(n); return p && !p.nonTrovata && p.bands && p.bands.length && p.bands.every(b => typeof b.a === 'number' && /^\d+-\d+"$/.test(b.label)); });
    const storte = [];
    nomi.forEach(n => {
        const b = M.profiloArma(n).bands, k = b.length - 1;
        const h = M.barraGittata(b, { indice: k, tocco: (i) => `t(${i})`, fuori: 'F()', fuoriAttivo: false });
        const segs = [...h.matchAll(/<div class="range-seg (seg-[a-z0-9]+) ?(active)?"[^>]*onclick="([^"]*)">([^<]*)</g)].map(x => ({ c: x[1], a: !!x[2], on: x[3], t: x[4] }));
        const conf = [...h.matchAll(/<span class="confine-gittata"[^>]*>([^<]*)<\/span>/g)].map(x => x[1]);
        const bande = segs.slice(0, -1), f = segs[segs.length - 1] || {};
        const bene = bande.length === b.length && bande.every((s, i) => s.on === `t(${i})` && s.a === (i === k) && s.t === (b[i].mod > 0 ? '+' : '') + b[i].mod)
            && f.c === 'seg-fuori' && f.on === 'F()' && !f.a && f.t === 'FUORI'
            && J(conf) === J(['0'].concat(b.map(x => String(x.a))));
        if (!bene) storte.push({ n, segs, conf });
    });
    ok(nomi.length > 100 && storte.length === 0, 'su ' + nomi.length + ' armi: un .range-seg per banda col suo tocco e il suo MOD, la banda scelta accesa, FUORI in coda, confini 0 e la fine di ogni banda', storte.slice(0, 2));
    const b = M.profiloArma('Combi Rifle').bands;
    const conFuori = M.barraGittata(b, { indice: 0, tocco: (i) => `t(${i})`, fuori: 'F()', fuoriAttivo: true });
    ok(/class="range-seg seg-fuori active"/.test(conFuori) && !/class="range-seg seg-\d active"/.test(conFuori), 'fuoriAttivo: acceso FUORI («range-seg seg-fuori active»), nessuna banda');
    ok(!/seg-fuori/.test(M.barraGittata(b, { indice: 0, tocco: (i) => `t(${i})`, fuori: '' })), 'CONTROPROVA: senza il tocco di FUORI il segmento FUORI non c e`');
    ok(M.barraGittata([], {}) === '' && M.barraGittata(null, {}) === '', 'CONTROPROVA: senza bande, stringa vuota');
});

sezione('R5. M.nota e M.azzeraNote: senza app.html in window.INFO, con app.html a window.aggiungiInfo', () => {
    const g = motoreSolo(false), M = g.MotoreN5;
    M.nota('s', '<b>Tit</b>olo', 'riga<br>due', { tipo: 'boh', tasto: 7 });
    ok(J(g.INFO.s) === J([{ titolo: 'Titolo', testo: 'riga due', tipo: 'regole', tasto: '7' }]), 'senza pagina: la voce in window.INFO[idStep], HTML tolto, un tipo sconosciuto vale regole, tasto come testo', g.INFO.s);
    M.nota('s', 'Copertura', '-3', { tipo: 'mod' }); M.nota('s', '', ''); M.nota('', 'X', 'Y');
    ok(g.INFO.s.length === 2 && g.INFO.s[1].tipo === 'mod' && !('' in g.INFO), '  un tipo noto resta; titolo e testo vuoti, o senza idStep, non depositano niente', g.INFO.s.map(v => v.titolo));
    M.azzeraNote('s');
    ok(J(g.INFO.s) === '[]', '  M.azzeraNote svuota la schermata');
    const p = motoreSolo(true), Mp = p.MotoreN5;
    Mp.nota('step-x', 'A', 'b', { tipo: 'nonpuo', tasto: 'k' }); Mp.azzeraNote('step-x');
    ok(J(p._chiamate) === J([['aggiungi', 'step-x', 'A', 'b', { tipo: 'nonpuo', tasto: 'k' }], ['azzera', 'step-x']]) && !p.INFO, 'con la pagina: passa da window.aggiungiInfo e window.azzeraInfo, e window.INFO non nasce', p._chiamate);
});

sezione('R6. BS-31 del piano (rev 49): l Atteso sulla pagina intera', () => {
    const T = tavolo(T => [tr(P_(T, /^Clockmaker \(Engineer\)/), { id: 'n7', alias: 'Clock' }), tr(P_(T, /^Alguacil \(Combi/), { id: 'n1', alias: 'Alg' })],
                     T => [FUS(T, 'p1')], 'NOMADI');
    const N = T.nomadi.g;
    T.apriMenu(T.nomadi, 0); N.selectAction('ATTACCO BS', false);
    const w = String(T.nomadi.el('weapon-buttons-container').innerHTML);
    ok(/<div class="intestazione-ordine"[^>]*>\s*<b[^>]*>ATTACCO BS<\/b>/.test(w), 'intestazione «ATTACCO BS», senza icona', (w.match(/intestazione-ordine[\s\S]{0,160}/) || [''])[0]);
    const combi = bottoni(w).find(b => /declareAttackBS\('Combi Rifle'/.test(b)) || '';
    const celle = [...combi.matchAll(/<div class="cella-gittata" data-da="(\d+)" data-fino="(\d+)" data-mod="(-?\d+)" style="flex:0 0 ([\d.]+)%/g)].map(x => [+x[1], +x[2], +x[3], Math.round(+x[4])]);
    ok(J(celle) === J([[0, 16, 3, 17], [16, 32, -3, 17], [32, 48, -6, 17]]) && /cella-fuori" data-da="48" data-fino="96"/.test(combi),
       'il bottone del Combi: 0-16 +3, 16-32 -3, 32-48 -6, un sesto della scala ciascuna, poi fuori fino a 96', celle);
    N.apriInfo();
    const pan = tx(T.nomadi.el('pannello-info').innerHTML);
    ok(/GIZMOKIT NON UTILIZZABILE si usa solo con la sua azione \(SUPPORTO\)/.test(pan) && /DEACTIVATOR NON UTILIZZABILE si usa solo con la sua azione \(DEACTIVATOR\)/.test(pan) && !bottoni(w).some(b => /GizmoKit|Deactivator/.test(b)),
       'GizmoKit e Deactivator non sono fra le armi: nella ⓘ, col motivo', pan.slice(0, 200));
    N.chiudiInfo();
    // ANNULLA ORDINE, e l Ordine nuovo lo dichiara l Alguacil.
    N.tornaAlRadar(); T.giro();
    T.apriMenu(T.nomadi, 1); N.selectAction('ATTACCO BS', false);
    ok(!N.vociInfo('step-weapon').some(v => /GizmoKit|Deactivator/.test(v.titolo)), 'Ordine nuovo con l Alguacil: nella ⓘ delle armi niente del GizmoKit', N.vociInfo('step-weapon').map(v => v.titolo));
    N.declareAttackBS('Combi Rifle'); N.toggleTargetSelection('p1'); N.confirmMultiAro(false); T.giro(); T.pano.g.annullaAro(); T.giro();
    N.goToModifiersBS('IDLE');
    const h = () => String(T.nomadi.el('targets-allocation-container').innerHTML);
    const segs = [...h().matchAll(/class="range-seg (seg-[a-z0-9]+)[^"]*"[^>]*>([^<]*)</g)].map(x => x[2]);
    const conf = [...h().matchAll(/<span class="confine-gittata"[^>]*>([^<]*)<\/span>/g)].map(x => x[1]);
    ok(J(segs) === J(['+3', '+3', '-3', '-3', '-6', '-6', 'FUORI']) && J(conf) === J(['0', '8', '16', '24', '32', '40', '48']),
       'la barra della scheda: sei caselle e FUORI, confini 0 8 16 24 32 40 48', { segs, conf });
    N.setTargetRangeBS(0, 2); N.eseguiCalcoloBS(); T.giro();
    ok(ris(T) && /Alg Azione: ATTACCO BS Successo al: 8 \(o meno\)/.test(tab(T)), 'terza casella (16-24"): sul tabellone 8 (11 -3)', (tab(T).match(/Alg Azione.{0,60}/) || [])[0]);
});

sezione('R7. BS-16 e BS-16b del piano (rev 49): Total Reaction sempre al pieno, la voce Burst nella ⓘ', () => {
    const giro = (attivaN, reaRe, faz, arma) => {
        const T = creaTavolo(DIR); const N = T.nomadi.g, P = T.pano.g;
        const alg = tr(T.profilo(T.nomadi, /^Alguacil \(Combi/), { id: 'n1', alias: 'Alg' }), fus = FUS(T, 'p1', { alias: 'Fus' });
        const rea = tr(T.profilo(faz === 'P' ? T.pano : T.nomadi, reaRe), { id: faz === 'P' ? 'p9' : 'n47', alias: 'Rea' });
        if (faz === 'P') T.schiera([alg], [rea], 'NOMADI'); else T.schiera([rea], [fus], 'PANOCEANIA');
        const A = faz === 'P' ? T.nomadi : T.pano, R = faz === 'P' ? T.pano : T.nomadi, Ag = A.g, Rg = R.g;
        T.apriMenu(A, 0); Ag.selectAction('MOVIMENTO', false); T.giro();
        Rg.apriSelezioneAro(); Rg.toggleAroUnit(rea.id); Rg.confermaSelezioneAro(); Rg.selezionaAzioneAro('BS_ATTACK');
        const bt = bottoni(String(R.el('aro-weapon-list').innerHTML)).find(b => b.indexOf("selezionaArmaAro('" + arma) >= 0) || '';
        vm.runInContext(onclickDi(bt).replace(/&quot;/g, '"') || 'void 0', vm.createContext(Rg));
        Rg.selezionaBersaglioAro(faz === 'P' ? 'Alg' : 'Fus');
        const m = String(R.el('aro-modifiers-content').innerHTML);
        const burst = Rg.vociInfo('step-aro-modifiers').filter(v => v.titolo === 'Burst').map(v => v.testo);
        const cfg = JSON.parse(J(Rg.aroCurrentConfig));
        Rg.salvaAroCorrente(); T.giro(); Ag.selectAction('MOVIMENTO', true); T.giro();
        return { m, burst, cfg, t: tab(T), T };
    };
    const a = giro(true, /^Sierra Dronbot \(Heavy Machine Gun\)/, 'P', 'Heavy Machine Gun');
    ok(!/tasto-burst|sceltaBurstAro/.test(a.m) && a.cfg.burst === 4 && a.cfg.burstPieno === true && J(a.burst) === J(['In Turno Reattivo il Burst è 1 · Total Reaction: Burst pieno dell\'arma in ARO (B4)']),
       'BS-16, Sierra Dronbot (HMG): nessun tasto del Burst, B4, nella ⓘ «In Turno Reattivo il Burst è 1 · Total Reaction: Burst pieno dell arma in ARO (B4)»', [a.cfg.burst, a.burst]);
    ok(ris(a.T) && /Rea Azione: ATTACCO BS Successo al: \d+ \(o meno\) Dadi da lanciare: 4/.test(a.t), '  sul tabellone 4 dadi', (a.t.match(/Rea Azione.{0,70}/) || [])[0]);
    const b = giro(true, /^Reaktion Zond \(Thunderbolt\)$/, 'N', 'Thunderbolt');
    ok(!/tasto-burst|sceltaBurstAro/.test(b.m) && b.cfg.burst === 3 && b.burst.length === 1 && /^In Turno Reattivo il Burst è 1 · Total Reaction: Burst pieno dell'arma in ARO \(B2\) · Thunderbolt ?\(\+1B\): \+1 Burst anche in ARO \(Total Reaction, righe 10227-10228\)$/.test(b.burst[0]),
       'BS-16b, Reaktion Zond (Thunderbolt): B3, nella ⓘ le tre voci del Burst in una riga', [b.cfg.burst, b.burst]);
    ok(ris(b.T) && /Rea Azione: ATTACCO BS Successo al: \d+ \(o meno\) Dadi da lanciare: 3/.test(b.t), '  sul tabellone 3 dadi', (b.t.match(/Rea Azione.{0,70}/) || [])[0]);
    // CONTROPROVA: senza Total Reaction una voce sola non va nella ⓘ (serve piu` di una voce).
    const c = giro(true, /^Fusilier \(Combi/, 'P', 'Combi Rifle');
    ok(c.cfg.burst === 1 && c.burst.length === 0 && c.cfg.burstPieno === undefined, 'CONTROPROVA: un Fusilier senza Total Reaction, B1 e nessuna voce Burst nella ⓘ', [c.cfg.burst, c.burst]);
});

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
