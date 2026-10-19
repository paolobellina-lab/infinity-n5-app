// @versione 2026-10-19.1 | test_scheda_osservazione.js | proprieta`: chat TEST
// ============================================================================
//  La scheda del bersaglio di Forward Observer e Triangulated Fire
//  (ordine_osservazione.js 2026-10-19.1, Paolo via MOTORE, 19 ottobre).
//  Le pagine INTERE dei tre dispositivi, entrando come il giocatore.
//   1. FO: <div class="target-card"> prima del riquadro del tiro, con nome,
//      Burst 2, barra delle gittate col FUORI, COPERTURA e LINEA DI TIRO;
//      un solo tasto della Linea di Tiro (tolta la riga dei requisiti).
//   2. FO: COPERTURA toglie 3, nella busta e sul tabellone (era un difetto:
//      prima non si poteva dichiarare).
//   3. FO: LINEA DI TIRO NO -> IDLE, nessuna busta.
//   4. Triangulated: la scheda senza tasto Copertura; cover resta false
//      (riga 10340); Burst 1 invariato.
//   4b. OSS-03 come nel piano (Zulu-Cobra contro Intruder HMG a 32-40"):
//      MOD barrati Gittata -6 e Mimetismo -3, sarebbe 4.
//   5. Il Sensor non ha bersaglio: niente scheda.
//  Piano: OSS-01, OSS-03 (rev 32).
//  L'harness creaTavolo e` lo stesso di test_elenchi_e_tabellone.js
//  (INTERFACCIA): copiato qui perche` ogni banco basti a se stesso.
//  USO:  CARTELLA=/percorso/ node test_scheda_osservazione.js
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
const tx = (h) => String(h).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const tr = (p, a) => Object.assign(JSON.parse(J(p)), { states: {}, deployState: 'NORMAL', state: 'ACTIVE', combatGroup: 1 }, a);
const ris = (T) => T.hub.el('step-resolution').style.display === 'block';
const tab = (T) => tx(T.hub.el('clash-container').innerHTML);
// La busta che parte verso l'Hub: azione, Burst, regole e opzioni (aroAtteso).
const spia = (g) => { const s = { n: 0, op: {}, p: null }; const M = g.MotoreN5, o = M.inviaCalcolo;
    M.inviaCalcolo = function (p, op) { s.n++; s.p = p.map(x => ({ az: x.azione, bd: x.burstDisponibile, b: (x.bersagli || []).map(b => b.burst), reg: x.regole })); s.op = op || {}; return o.apply(this, arguments); }; return s; };
const tavolo = (rN, rP, attiva) => { const T = creaTavolo(DIR); T.schiera(rN(T), rP(T), attiva); return T; };
const P_ = (T, re) => T.profilo(T.nomadi, re);


// Fino alla seconda meta` del Forward Observer (Grenzer contro Fusilier), come il giocatore.
function apriFO() {
    const T = tavolo(T => [tr(P_(T, /^Grenzer \(Forward Observer, Sensor/), { id: 'n1', alias: 'Fo' })], T => [tr(P_(T, /^Fusilier \(Combi/), { id: 'p1', alias: 'Due' })], 'NOMADI');
    const N = T.nomadi.g;
    T.apriMenu(T.nomadi, 0); N.selectAction('FORWARD OBSERVER', false); N.toggleTargetSelection('p1'); N.confirmMultiAro(false); T.giro();
    T.pano.g.annullaAro(); T.giro();
    const m = T.nomadi.el('second-half-buttons-container').innerHTML.match(/selectAction\('([^']+)', true\)/);
    if (m) N.selectAction(m[1], true);
    return T;
}
// Fino al tiro del Triangulated Fire (Stempler Zond contro Fusilier).
function apriTri() {
    const T = tavolo(T => [tr(P_(T, /^Stempler Zond$/), { id: 'n1', alias: 'Zn' })], T => [tr(P_(T, /^Fusilier \(Combi/), { id: 'p1', alias: 'Due' })], 'NOMADI');
    const N = T.nomadi.g; T.apriMenu(T.nomadi, 0); N.selectAction('TRIANGULATED FIRE', false);
    const arma = (T.nomadi.el('weapon-buttons-container').innerHTML.match(/scegliArmaTriangulated\('([^']+)'\)/) || [])[1];
    N.scegliArmaTriangulated(arma); N.toggleTargetSelection('p1'); N.confirmMultiAro(false); T.giro();
    T.pano.g.annullaAro(); T.giro();
    return T;
}
const schermo = (T) => T.nomadi.el('targets-allocation-container').innerHTML;
const tasto = (T) => T.nomadi.el('btn-esegui-calcolo').innerText || '';
// La scheda: dal <div class="target-card"> al riquadro del tiro.
const scheda = (h) => { const i = h.indexOf('class="target-card"'), j = h.indexOf('background:#0d2018'); return (i >= 0 && j > i) ? h.slice(i, j) : ''; };
const conta = (h, s) => h.split(s).length - 1;
const LOF = "window.toggleRequisitoOsservazione(0, 'lof')", COP = 'window.toggleCoperturaOsservazione()';
const toggle = (g, nome) => (typeof g[nome] === 'function' ? g[nome] : () => {});

sezione('1. Forward Observer: la scheda del bersaglio come nell Attacco BS (OSS-01)', () => {
    const T = apriFO(), N = T.nomadi.g, h = schermo(T), c = scheda(h);
    ok(!!c, 'c e` la scheda target-card, prima del riquadro del tiro', h.slice(0, 200));
    ok(/>Due</.test(c) && /class="burst-ctrl"[\s\S]*Burst <b[^>]*>2</.test(c), 'nella scheda: nome del bersaglio e Burst 2');
    ok(/class="range-bar"/.test(c) && /toggleFuoriGittataOsservazione\(\)">FUORI</.test(c), 'nella scheda: la barra delle gittate col FUORI in coda');
    ok(c.includes(COP) && /NO COPERTURA/.test(c), 'nella scheda: il tasto COPERTURA (NO COPERTURA)');
    ok(c.includes(LOF) && /LINEA DI TIRO SÌ/.test(c), 'nella scheda: il tasto LINEA DI TIRO (SÌ)');
    ok(c.indexOf(COP) < c.indexOf(LOF), 'COPERTURA prima di LINEA DI TIRO, come nell Attacco BS');
    ok(conta(h, LOF) === 1 && conta(c, LOF) === 1 && !/type="button"[^>]*toggleRequisitoOsservazione/.test(h), 'un solo tasto della Linea di Tiro, quello della scheda: tolta la riga dei requisiti (M.rigaRequisiti)', { pagina: conta(h, LOF), scheda: conta(c, LOF) });
    ok(/ESEGUI TIRO/.test(tasto(T)), 'premessa: con la Linea di Tiro il tasto e` ESEGUI TIRO', tasto(T));
});

sezione('2. Forward Observer: la Copertura si dichiara e toglie 3 (OSS-01)', () => {
    const T = apriFO(), N = T.nomadi.g;
    const prima = N.osservazioneEsito.valore;
    ok(!N.osservazioneEsito.voci.some(v => v.fonte === 'copertura'), 'CONTROPROVA: senza Copertura nessuna voce di Copertura', N.osservazioneEsito.voci);
    toggle(N, 'toggleCoperturaOsservazione')();
    const dopo = N.osservazioneEsito.valore;
    ok(N.combatTargets[0].cover === true && /IN COPERTURA/.test(scheda(schermo(T))), 'toccato COPERTURA: il bersaglio e` in Copertura e il tasto dice IN COPERTURA');
    ok(dopo === prima - 3, 'il tiro scende di 3', { prima, dopo });
    ok(N.osservazioneEsito.voci.some(v => v.fonte === 'copertura' && v.valore === -3), 'e fra i MOD c e` la Copertura -3', N.osservazioneEsito.voci);
    const s = spia(N); N.eseguiOsservazione(); T.giro();
    ok(!!s.p && s.p[0].reg.valoreSuccesso === dopo && s.p[0].b.length === 1, 'nella busta: il valore con la Copertura', s.p && s.p[0] && s.p[0].reg.valoreSuccesso);
    ok(ris(T) && new RegExp('FORWARD OBSERVER Successo al: ' + dopo + ' ').test(tab(T)), 'e sul tabellone', tab(T).slice(0, 120));
    // Ritoccato: torna com'era.
    const T2 = apriFO(), N2 = T2.nomadi.g, p2 = N2.osservazioneEsito.valore;
    toggle(N2, 'toggleCoperturaOsservazione')(); toggle(N2, 'toggleCoperturaOsservazione')();
    ok(N2.osservazioneEsito.valore === p2 && N2.combatTargets[0].cover === false, 'CONTROPROVA: toccato due volte, torna senza Copertura', N2.osservazioneEsito.valore);
});

sezione('3. Forward Observer: LINEA DI TIRO NO -> IDLE (OSS-01)', () => {
    const T = apriFO(), N = T.nomadi.g;
    N.toggleRequisitoOsservazione(0, 'lof');
    ok(/LINEA DI TIRO NO/.test(scheda(schermo(T))) && /IDLE/.test(tasto(T)), 'Linea di Tiro NO: il tasto della scheda lo dice e ESEGUI diventa IDLE', tasto(T));
    const s = spia(N); N.eseguiOsservazione(); T.giro();
    ok(s.n === 0, 'e nessuna busta del Forward Observer', s.n);
    const T2 = apriFO(), N2 = T2.nomadi.g;
    N2.toggleRequisitoOsservazione(0, 'lof'); N2.toggleRequisitoOsservazione(0, 'lof');
    ok(!N2.MotoreN5.requisitoManca(N2.combatTargets[0], 'lof') && /ESEGUI TIRO/.test(tasto(T2)), 'CONTROPROVA: ritoccato, la Linea di Tiro torna e il tasto e` ESEGUI TIRO', tasto(T2));
});

sezione('4. Triangulated Fire: la scheda senza tasto Copertura (OSS-03)', () => {
    const T = apriTri(), N = T.nomadi.g, h = schermo(T), c = scheda(h);
    ok(!!c && /TRIANGULATED FIRE/.test(h), 'c e` la scheda target-card, prima del riquadro del tiro', h.slice(0, 200));
    ok(/>Due</.test(c) && /class="burst-ctrl"[\s\S]*Burst <b[^>]*>1</.test(c), 'nella scheda: nome del bersaglio e Burst 1');
    ok(/class="range-bar"/.test(c) && /toggleFuoriGittataOsservazione\(\)">FUORI</.test(c), 'nella scheda: la barra delle gittate col FUORI in coda');
    ok(conta(h, LOF) === 1 && conta(c, LOF) === 1 && !/type="button"[^>]*toggleRequisitoOsservazione/.test(h), 'un solo tasto LINEA DI TIRO, quello della scheda: tolta la riga dei requisiti', { pagina: conta(h, LOF), scheda: conta(c, LOF) });
    ok(!h.includes(COP) && !/COPERTURA</.test(c), 'NESSUN tasto COPERTURA: il Triangulated la ignora (riga 10340)');
    // Anche se il bersaglio arrivasse in Copertura, non conta.
    const prima = N.osservazioneEsito.valore;
    N.combatTargets[0].cover = true; N.renderOsservazione();
    ok(N.combatTargets[0].cover === false && N.osservazioneEsito.valore === prima, 'un bersaglio arrivato in Copertura torna cover false, e il tiro non cambia', { cover: N.combatTargets[0].cover, v: N.osservazioneEsito.valore });
    N.toggleRequisitoOsservazione(0, 'lof');
    ok(/IDLE/.test(tasto(T)), 'Linea di Tiro NO: IDLE anche qui', tasto(T));
    N.toggleRequisitoOsservazione(0, 'lof');
    const s = spia(N); N.eseguiOsservazione(); T.giro();
    ok(!!s.p && s.p[0].az === 'TRIANGULATED FIRE' && s.p[0].bd === 1 && J(s.p[0].b) === '[1]', 'CONTROPROVA: con la Linea di Tiro parte la busta, Burst 1 invariato', s.p && s.p[0] && { az: s.p[0].az, bd: s.p[0].bd, b: s.p[0].b });
});

sezione('4b. OSS-03 come nel piano: Zulu-Cobra contro Intruder HMG a 32-40"', () => {
    const T = tavolo(T => [tr(T.profilo(T.nomadi, /^Intruder \(HMG/), { id: 'n1', alias: 'Intr' })], T => [tr(T.profilo(T.pano, /^Zulu-Cobra \(Triangulated/), { id: 'p1', alias: 'Zc' })], 'PANOCEANIA');
    const P = T.pano.g, M = P.MotoreN5;
    T.apriMenu(T.pano, 0); P.selectAction('TRIANGULATED FIRE', false);
    const armi = [...T.pano.el('weapon-buttons-container').innerHTML.matchAll(/scegliArmaTriangulated\('([^']+)'\)/g)].map(m => m[1]);
    ok(J(armi) === J(['Combi Rifle', 'Jammer', 'Assault Pistol']), 'un bottone per arma: Combi Rifle, Jammer, Assault Pistol', armi);
    P.scegliArmaTriangulated('Combi Rifle'); P.toggleTargetSelection('n1'); P.confirmMultiAro(false); T.giro(); T.nomadi.g.annullaAro(); T.giro();
    P.setRangeOsservazione(4);
    const e = P.osservazioneEsito, h = T.pano.el('targets-allocation-container').innerHTML;
    ok(/class="target-card"/.test(h) && !h.includes(COP), 'la scheda c e`, il tasto Copertura no');
    ok(e.attributo === 'BS' && e.valore === 13, 'il tiro e` su BS 13 pieno', { a: e.attributo, v: e.valore });
    ok(J(e.modIgnorati.map(v => v.motivo)) === J(['Gittata: -6', 'Mimetismo del bersaglio: -3']) && e.valoreConMod === 4,
       'MOD barrati: Gittata -6 e Mimetismo -3; senza l Abilita` il tiro sarebbe 4', { ign: e.modIgnorati.map(v => v.motivo), con: e.valoreConMod });
    ok(/text-decoration:line-through;">Gittata: -6/.test(h) && /text-decoration:line-through;">Mimetismo del bersaglio: -3/.test(h) && /sarebbe 4\./.test(h), 'e a schermo, barrati');
    const e2 = M.regoleTriangulated(P.coordUnits[0], P.pendingTargets[0], M.profiloArma('Combi Rifle'), { rangeIndex: 4, cover: true });
    ok(e2.valore === 13 && e2.valoreConMod === 1 && e2.modIgnorati.some(v => v.fonte === 'copertura'), 'CONTROPROVA (motore): con cover true il tiro resta 13, e la Copertura sarebbe stata un MOD barrato (sarebbe 1)', { v: e2.valore, con: e2.valoreConMod });
    T.apriMenu(T.nomadi, 0);
    ok(!T.nomadi.el('action-list-container').innerHTML.includes("selectAction('TRIANGULATED FIRE'"), 'CONTROPROVA: l Intruder non ha la voce TRIANGULATED FIRE');
});

sezione('5. Il Sensor resta senza scheda', () => {
    const T = tavolo(T => [tr(P_(T, /^Grenzer \(Forward Observer, Sensor/), { id: 'n1', alias: 'Sens' })],
                     T => [tr(P_(T, /^Fusilier \(Combi/), { id: 'p1', alias: 'Due', deployState: 'CAMO', states: { camo: true } })], 'NOMADI');
    const N = T.nomadi.g; T.apriMenu(T.nomadi, 0); N.selectAction('SENSOR', false);
    const h = schermo(T);
    ok(/SENSOR/.test(h) && !/class="target-card"/.test(h) && !h.includes(LOF), 'Sensor: niente scheda e niente Linea di Tiro', h.slice(0, 160));
    ok(/ESEGUI TIRO/.test(tasto(T)), 'e il tasto e` ESEGUI TIRO', tasto(T));
});

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
