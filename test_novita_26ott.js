// @versione 2026-10-27.2 | test_novita_26ott.js | proprieta`: chat TEST
// 2026-10-27.2 (motore 2026-10-27.2): GIRATE J1b (il <n> delle repliche e`
//   0..999 come la lista: la vera non e` piu` l'unica a tre cifre) e O (la
//   nota dello Scarico arriva allo scontro e al tabellone). Nessun difetto
//   aperto in questo banco.
// 2026-10-27.1 (motore 2026-10-27.1, ordine_attacco_bs 2026-10-27.1): GIRATE
//   I3 (SG-10: il secondario dice «un Critico conta come successo normale») e
//   J1 (le repliche hanno l'id della stessa forma, la vera non e` sempre la
//   prima). Nuove M (DEP-09: Disco Baller nell'ATTACCO BS, «riuscito?», la
//   Disco Ball e la nota di Eclipse sul tabellone; la nota anche col Pitcher
//   dello Speculativo), N (icone fra eserciti) e O (il tetto sugli usi in ARO:
//   M.burstReattivo e l'Hub). DIFETTI APERTI nuovi, misurati come sono:
//   - J1b: il <n> delle repliche va da 0 a 99, quello di lista da 0 a 999:
//     quando la vera ha <n> >= 100 e` la sola, e si riconosce;
//   - O: all'Hub il Burst 0 c'e` ma la nota dello Scarico no.
// ============================================================================
//  La consegna del 26 ottobre (motore 2026-10-26.3, catalogo, motore_core,
//  ordine_movimento, ordine_piazzamento, ordine_difesa, logica_stati,
//  ordine_fuoco_speculativo, ordine_attacco_intuitivo 2026-10-26.1;
//  calcolatore_math, ordine_attacco_bs 2026-10-26.2; INTERFACCIA 26.1/26.2),
//  misurata dai tre dispositivi con pagine intere fino al tabellone dell'Hub,
//  e dal motore dove la pagina non arriva.
//   A. DIS-02 usi Disposable: Triphammer col Panzerfaust (+1B) su tre Ordini;
//      la busta e la risposta ARO portano gli usi, l'Hub calcola con quelli;
//      M.bottoneArma uguale in BS, ARO, Speculativo (Pitcher) e Intuitivo
//      (Chest Mines del Krakot); Reload col Baggage; ricarica dall'Hub.
//   B. E62: Spector in Schieramento Aereo che attacca senza INGRESSO IN CAMPO.
//   C. SP-07: Coordinato SCOPRIRE + ATTACCO BS a tre, sei scontri.
//   D. DIS-05: il Dado Speciale di Wolfgang Amadeus in CC.
//   E. Le mine non si sparano (Spektr, Shock Mine).
//   F. DEP-11: il Deactivator vede i segnalini del roster nemico, mai i Marker.
//   G. DEP-10: Minelayer, la domanda sull'area solo per chi ha l'area (E54).
//   H. Trasporto: SCENDI DAL TAG (Anaconda), pilota di lista (Gator),
//      M.tagDelPilota.
//   I. Sagome: SG-09 (Chain-colt a lettere), TPL-11, SG-10.
//   J. Repliche (Holoprojector, Decoy) e HoloMask.
//   K. Icone per esercito.   L. SCH-06: la mina in CAMO e` un CAMO semplice.
//   M. DEP-09 Disco Baller.   N. Icone fra eserciti.   O. Tetto usi in ARO.
//   (J1b e O girate il 27 ottobre, 27.2.)
//  I due difetti aperti del 26 (SG-10 sul tabellone, J1) sono chiusi dalla
//  27.1 e girati; i nuovi stanno in testa al file.
//  L'harness creaTavolo e` lo stesso di test_elenchi_e_tabellone.js
//  (INTERFACCIA): copiato qui perche` ogni banco basti a se stesso.
//  USO:  CARTELLA=/percorso/ node test_novita_26ott.js
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


const premi = (d, id) => { const b = d.el(id); return typeof b.onclick === 'function' ? b.onclick() : undefined; };

// ---------------------------------------------------------------------------
const TRIP = /^Triphammer \(Heavy Shotgun, Heavy Rocket Launcher, Panzerfaust/;
const FUS = (T, id, a) => tr(T.profilo(T.pano, /^Fusilier \(Combi/), Object.assign({ id, alias: id === 'p1' ? 'F1' : id }, a || {}));
const bottoni = (h) => (String(h).match(/<button[^>]*class="bottone-arma[\s\S]*?<\/button>/g) || []);
const diArma = (h, re) => bottoni(h).find(b => re.test(b)) || '';
const classe = (b) => (b.match(/class="([^"]*)"/) || [])[1];
const onclickDi = (b) => (b.match(/onclick="([^"]*)"/) || [])[1] || '';
const passo = (T) => Object.keys(T.nomadi.elementi).filter(k => /^step-/.test(k) && T.nomadi.elementi[k].style.display && T.nomadi.elementi[k].style.display !== 'none');

sezione('A1. DIS-02: Triphammer col Panzerfaust (+1B), tre Ordini', () => {
    const T = tavolo(T => [tr(P_(T, TRIP), { id: 'n1', alias: 'Tri' })], T => [FUS(T, 'p1')], 'NOMADI');
    const N = T.nomadi.g, H = T.hub.g, M = N.MotoreN5;
    const buste = []; const orh = T.hub.riceve;
    T.hub.riceve = (k, v) => { if (k === M.CANALI.HUB_CALCOLO && v) buste.push(JSON.parse(v)); return orh(k, v); };
    const spieH = []; const rs = H.MotoreN5.risolviScontro;
    H.MotoreN5.risolviScontro = function (a) { spieH.push(J((a && a.attaccante && a.attaccante.usiSpesi) || null)); return rs.apply(this, arguments); };
    const ordine = () => {
        T.apriMenu(T.nomadi, 0); N.selectAction('ATTACCO BS', false); N.startUnitAllocationLoopBS();
        const w = String(T.nomadi.el('weapon-buttons-container').innerHTML);
        return { w, b: diArma(w, /Panzerfaust/) };
    };
    const spara = (o) => {
        const arg = (onclickDi(o.b).match(/declareAttackBS\('(Panzerfaust[^']*)'\)/) || [])[1];
        const s = spia(N); N.alert_.length = 0;
        N.declareAttackBS(arg); N.toggleTargetSelection('p1'); N.confirmMultiAro(false); T.giro(); T.pano.g.annullaAro(); T.giro();
        N.goToModifiersBS('IDLE'); N.eseguiCalcoloBS(); T.giro();
        const t = tab(T); try { H.chiudiRisoluzione(); } catch (e) {} if (N.tornaAlRadar) N.tornaAlRadar(); T.giro();
        return { s, t, arg };
    };
    const o1 = ordine();
    ok(/Usi residui: 2 su 2/.test(tx(o1.b)) && classe(o1.b) === 'bottone-arma', '1o Ordine: il bottone del Panzerfaust dice «Usi residui: 2 su 2»', tx(o1.b).slice(-40));
    const r1 = spara(o1);
    ok(r1.arg === 'Panzerfaust (+1B)' && J(r1.s.p && r1.s.p[0].b) === '[2]', 'il primo colpo e` B2 (Panzerfaust (+1B))', [r1.arg, r1.s.p && r1.s.p[0].b]);
    ok(J(N.roster[0].usiSpesi) === '{"PANZERFAUST":2}', 'e spende 2 usi: {PANZERFAUST: 2}', N.roster[0].usiSpesi);
    ok(/Tri Azione: ATTACCO BS Successo al: \d+ \(o meno\) Dadi da lanciare: 2/.test(r1.t), 'sul tabellone 2 dadi');
    ok(buste.length === 1 && buste[0].attacchi && buste[0].attacchi[0].usiSpesiAttaccante === undefined, 'la busta del primo colpo non porta usi: prima del colpo non ne erano spesi', buste[0] && buste[0].attacchi[0].usiSpesiAttaccante);
    const o2 = ordine();
    ok(classe(o2.b) === 'bottone-arma bottone-arma-esaurito' && /USI ESAURITI \(2\/2\)/.test(tx(o2.b)) && !/declareAttackBS\('Panzerfaust/.test(o2.b),
       '2o Ordine: «USI ESAURITI (2/2)», classe bottone-arma-esaurito, e il tocco non dichiara l arma', [classe(o2.b), onclickDi(o2.b).slice(0, 60)]);
    N.alert_.length = 0; const prima = N.currentOrder.weapon;
    N.declareAttackBS('Panzerfaust (+1B)');
    ok(N.alert_.some(a => /Panzerfaust: usi esauriti/.test(a)) && N.currentOrder.weapon === prima, 'declareAttackBS chiamato a mano si ferma, col messaggio dello Scarico', N.alert_.map(a => a.slice(0, 50)));
    const o3 = ordine();
    ok(classe(o3.b) === 'bottone-arma bottone-arma-esaurito', '3o Ordine: ancora esaurito (nessun Reload in mezzo)');
    // La busta porta gli usi spesi PRIMA del colpo, e l Hub calcola con quelli.
    const giro2 = (togli) => {
        const T = tavolo(T => [tr(P_(T, TRIP), { id: 'n1', alias: 'Tri', usiSpesi: { PANZERFAUST: 1 } })], T => [FUS(T, 'p1')], 'NOMADI');
        const N = T.nomadi.g, H = T.hub.g, M = N.MotoreN5; const visti = [];
        const orh = T.hub.riceve;
        T.hub.riceve = (k, v) => { if (k === M.CANALI.HUB_CALCOLO && v) { const o = JSON.parse(v); if (togli) (o.attacchi || []).forEach(a => delete a.usiSpesiAttaccante); visti.push(o); v = J(o); } return orh(k, v); };
        const spie = []; const rs = H.MotoreN5.risolviScontro;
        H.MotoreN5.risolviScontro = function (a) { spie.push(J((a && a.attaccante && a.attaccante.usiSpesi) || null)); return rs.apply(this, arguments); };
        T.apriMenu(T.nomadi, 0); N.selectAction('ATTACCO BS', false); N.startUnitAllocationLoopBS();
        const b = diArma(T.nomadi.el('weapon-buttons-container').innerHTML, /Panzerfaust/);
        N.declareAttackBS('Panzerfaust (+1B)'); N.toggleTargetSelection('p1'); N.confirmMultiAro(false); T.giro(); T.pano.g.annullaAro(); T.giro();
        N.goToModifiersBS('IDLE'); N.eseguiCalcoloBS(); T.giro();
        return { b, visti, spie, usi: N.roster[0].usiSpesi, t: tab(T), ris: ris(T) };
    };
    const a = giro2(false);
    ok(/Usi residui: 1 su 2/.test(tx(a.b)), 'con un uso gia` speso il bottone dice «Usi residui: 1 su 2»');
    ok(a.visti.length === 1 && J(a.visti[0].attacchi[0].usiSpesiAttaccante) === '{"PANZERFAUST":1}', 'la busta porta attacco.usiSpesiAttaccante = {PANZERFAUST: 1}, gli usi di PRIMA del colpo', a.visti[0] && a.visti[0].attacchi[0].usiSpesiAttaccante);
    ok(a.ris && a.spie.length === 1 && a.spie[0] === '{"PANZERFAUST":1}', 'all Hub risolviScontro riceve l attaccante con quegli usi', a.spie);
    ok(/Dadi da lanciare: 1/.test(a.t) && J(a.usi) === '{"PANZERFAUST":2}', 'B1 (ne restava uno), e dopo il colpo gli usi sono 2 su 2', a.usi);
    const b = giro2(true);
    ok(b.ris && b.spie[0] === 'null', 'CONTROPROVA: tolto usiSpesiAttaccante dalla busta, all Hub l attaccante arriva senza usi (la copia dell Hub non li ha)', b.spie);
});

sezione('A1b. DIS-02 in ARO: la risposta porta r.usiSpesi, l Hub li usa', () => {
    const giro = (usi) => {
        const T = creaTavolo(DIR); const N = T.nomadi.g, P = T.pano.g, H = T.hub.g;
        const pf = FUS(T, 'p1', { alias: 'Panzer', usiSpesi: usi }); pf.weapon = String(pf.weapon || '') + ', Panzerfaust';
        T.schiera([tr(P_(T, /^Alguacil \(Combi/), { id: 'n1', alias: 'Spara' })], [pf], 'NOMADI');
        const risposte = []; const orh = T.hub.riceve;
        T.hub.riceve = (k, v) => { if (k === H.MotoreN5.CANALI.ARO_PANOCEANIA && v) risposte.push(JSON.parse(v)); return orh(k, v); };
        const spie = []; const rs = H.MotoreN5.risolviScontro;
        H.MotoreN5.risolviScontro = function (a, r) { spie.push(J((r && r.difensore && r.difensore.usiSpesi) || null)); return rs.apply(this, arguments); };
        T.apriMenu(T.nomadi, 0); N.selectAction('ATTACCO BS', false); N.startUnitAllocationLoopBS(); N.declareAttackBS('Combi Rifle');
        N.toggleTargetSelection('p1'); N.confirmMultiAro(false); T.giro();
        P.apriSelezioneAro(); P.toggleAroUnit('p1'); P.confermaSelezioneAro(); P.selezionaAzioneAro('BS_ATTACK');
        const armi = String(T.pano.el('aro-weapon-list').innerHTML || T.pano.el('weapon-buttons-container').innerHTML);
        const sel = (armi.match(/selezionaArmaAro\('(Panzerfaust[^']*)'/) || [])[1];
        P.selezionaArmaAro(sel); P.salvaAroCorrente(); T.giro();
        N.goToModifiersBS('IDLE'); N.eseguiCalcoloBS(); T.giro();
        const r = (risposte.find(x => (x.reazioni || []).length) || {}).reazioni || [];
        return { sel, r, spie, usiDopo: P.roster[0].usiSpesi, ris: ris(T) };
    };
    const a = giro({ PANZERFAUST: 1 });
    ok(a.sel && a.r.length === 1 && J(a.r[0].usiSpesi) === '{"PANZERFAUST":1}', 'la risposta ARO col Panzerfaust porta r.usiSpesi = {PANZERFAUST: 1}, quelli di prima del colpo', a.r.map(x => x.usiSpesi));
    ok(J(a.usiDopo) === '{"PANZERFAUST":2}', 'e nell app di PanOceania l uso e` speso: 2 su 2', a.usiDopo);
    ok(a.ris && a.spie.indexOf('{"PANZERFAUST":1}') >= 0, 'all Hub risolviScontro riceve il reattivo con quegli usi', a.spie);
    const b = giro(undefined);
    ok(b.r.length === 1 && b.r[0].usiSpesi === undefined, 'CONTROPROVA: senza usi spesi la risposta non porta il campo', b.r.map(x => x.usiSpesi));
});

sezione('A2. M.bottoneArma: la riga degli usi DENTRO il bottone, uguale nei quattro moduli', () => {
    const pagina = (re, azione, usi) => {
        const T = tavolo(T => [tr(P_(T, re), { id: 'n1', alias: 'Chi', usiSpesi: usi || {} })], T => [FUS(T, 'p1')], 'NOMADI');
        const N = T.nomadi.g; T.apriMenu(T.nomadi, 0); N.selectAction(azione, false); if (azione === 'ATTACCO BS') N.startUnitAllocationLoopBS();
        return { T, N, w: String(T.nomadi.el('weapon-buttons-container').innerHTML) };
    };
    const casi = [
        ['ATTACCO BS', TRIP, /Panzerfaust/, 'Usi residui: 2 su 2', { PANZERFAUST: 2 }, 'declareAttackBS', 'Panzerfaust (+1B)'],
        ['FUOCO SPECULATIVO', /^Tsyklon \(Spitfire/, /Pitcher/, 'Usi residui: 2 su 2', { PITCHER: 2 }, 'declareSpeculativoAttack', 'Pitcher'],
        ['ATTACCO INTUITIVO', /^Krakot Renegade \(BS Attack \(\+1B\)\)/, /Chest Mines/, 'Usi residui: 2 su 2', { 'CHEST MINES': 2 }, 'declareIntuitivoAttack', 'Chest Mines (BS Mode)']
    ];
    casi.forEach(function (c) {
        const p = pagina(c[1], c[0]); const b = diArma(p.w, c[2]);
        ok(b && /class="usi-arma"/.test(b) && tx(b).indexOf(c[3]) >= 0 && (p.w.match(/Usi residui/g) || []).length === 1,
           c[0] + ': «' + c[3] + '» dentro il bottone, una volta sola nella pagina', [tx(b).slice(-30), (p.w.match(/Usi residui/g) || []).length]);
        const e = pagina(c[1], c[0], c[4]); const be = diArma(e.w, c[2]);
        ok(classe(be) === 'bottone-arma bottone-arma-esaurito' && /USI ESAURITI \(2\/2\)/.test(tx(be)) && /messaggioScarico/.test(onclickDi(be)) && onclickDi(be).indexOf(c[5]) < 0,
           c[0] + ' con gli usi finiti: bottone spento, il tocco chiama messaggioScarico e non ' + c[5], onclickDi(be).slice(0, 70));
        e.N.alert_.length = 0; const html0 = String(e.T.nomadi.el('targets-allocation-container').innerHTML);
        e.N[c[5]](c[6]);
        ok(e.N.alert_.some(a => /usi esauriti/.test(a)) && String(e.T.nomadi.el('targets-allocation-container').innerHTML) === html0,
           '  ' + c[5] + ' chiamato a mano si ferma: messaggio dello Scarico, nessuna pagina dei bersagli', e.N.alert_.map(a => a.slice(0, 50)));
    });
    // L ARO: lo stesso bottone (INTERFACCIA lo misura in 35c; qui si confronta con la pagina BS).
    const T = creaTavolo(DIR); const N = T.nomadi.g, P = T.pano.g;
    const pf = FUS(T, 'p1', { alias: 'Panzer' }); pf.weapon = String(pf.weapon || '') + ', Panzerfaust';
    T.schiera([tr(P_(T, /^Alguacil \(Combi/), { id: 'n1', alias: 'Muove' })], [pf], 'NOMADI');
    T.apriMenu(T.nomadi, 0); N.selectAction('MOVIMENTO', false); T.giro();
    P.apriSelezioneAro(); P.toggleAroUnit('p1'); P.confermaSelezioneAro(); P.selezionaAzioneAro('BS_ATTACK');
    const aro = diArma(String(T.pano.el('aro-weapon-list').innerHTML || T.pano.el('weapon-buttons-container').innerHTML), /Panzerfaust/);
    const bs = diArma(pagina(TRIP, 'ATTACCO BS').w, /Panzerfaust/);
    const riga = (b) => (b.match(/<[^>]*class="usi-arma"[^>]*>[^<]*/) || [''])[0];
    ok(riga(aro) && riga(aro) === riga(bs), 'ARO e Attacco BS: la riga degli usi e` la stessa, carattere per carattere', [riga(aro), riga(bs)]);
});

sezione('A3. Reload col Baggage (RICARICARE)', () => {
    const giro = (opz) => {
        const T = tavolo(T => [tr(P_(T, TRIP), { id: 'n1', alias: 'Tri', usiSpesi: { PANZERFAUST: 2 } })]
                              .concat(opz.bag ? [tr(P_(T, /^Salyut \(Deactivator, Repeater\)/), Object.assign({ id: 'n2', alias: 'Bag' }, opz.bagStato || {}))] : []),
                         T => [FUS(T, 'p1')], 'NOMADI');
        const N = T.nomadi.g; const menu = T.apriMenu(T.nomadi, 0);
        N.confirm = () => opz.si; N.alert_.length = 0;
        N.selectAction('RICARICARE', false); T.giro();
        return { N, menu };
    };
    const a = giro({ bag: true, si: true });
    ok(/selectAction\('RICARICARE'/.test(a.menu), 'il menu offre RICARICARE');
    ok(J(a.N.roster[0].usiSpesi) === '{}' && a.N.alert_.some(m => /ricarica: Panzerfaust \(\+2\)/.test(m)), 'alleato con Baggage sul tavolo, «sì»: usi pieni, «Panzerfaust (+2)»', [a.N.roster[0].usiSpesi, a.N.alert_.map(m => m.slice(0, 50))]);
    const b = giro({ bag: true, si: false });
    ok(J(b.N.roster[0].usiSpesi) === '{"PANZERFAUST":2}' && b.N.currentOrder.ricaricaFallita === true && b.N.alert_.some(m => /Requisito fallito: .* fa IDLE/.test(m)),
       '«no»: Requisito fallito, IDLE (ricaricaFallita), gli usi restano spesi', [b.N.roster[0].usiSpesi, b.N.currentOrder.ricaricaFallita]);
    const c = giro({ bag: false, si: true });
    ok(J(c.N.roster[0].usiSpesi) === '{"PANZERFAUST":2}' && c.N.alert_.some(m => /Nessun alleato con Baggage/.test(m)), 'senza un alleato con Baggage: vietato, prima della domanda', c.N.alert_.map(m => m.slice(0, 60)));
    const d = giro({ bag: true, si: true, bagStato: { state: 'UNCONSCIOUS', states: { unconscious: true } } });
    ok(J(d.N.roster[0].usiSpesi) === '{"PANZERFAUST":2}' && d.N.alert_.some(m => /Nessun alleato con Baggage/.test(m)), 'CONTROPROVA: il Baggage c e ma Incosciente (Stato Nullo): vietato lo stesso', d.N.alert_.map(m => m.slice(0, 60)));
});

sezione('A4. Ricarica forzata dall Hub: una volta, solo la propria fazione, null = tutti', () => {
    const T = creaTavolo(DIR); const N = T.nomadi.g, P = T.pano.g, H = T.hub.g, M = N.MotoreN5;
    const pf = (id) => { const u = tr(P_(T, /^Alguacil \(Combi/), { id, alias: id }); u.weapon = String(u.weapon || '') + ', Panzerfaust'; return u; };
    const pp = FUS(T, 'p1', { alias: 'Panzer' }); pp.weapon = String(pp.weapon || '') + ', Panzerfaust';
    T.schiera([pf('n1'), pf('n2')], [pp], 'NOMADI');
    const usi = (d, id) => J((d.roster.find(u => u.id === id) || {}).usiSpesi || {});
    const spendi = () => { N.roster.forEach(u => { u.usiSpesi = { PANZERFAUST: 2 }; }); P.roster[0].usiSpesi = { PANZERFAUST: 1 }; };
    spendi();
    const c1 = M.comandoRicarica('NOMADI', 'n1');
    ok(J(Object.keys(JSON.parse(c1)).sort()) === J(['fazione', 'id', 'quando', 'tipo', 'unitaId']) && JSON.parse(c1).unitaId === 'n1', 'M.comandoRicarica: tipo, fazione, unitaId, id, quando', c1);
    T.nomadi.riceve(M.CANALI.HUB_RICARICA, c1); T.pano.riceve(M.CANALI.HUB_RICARICA, c1);
    ok(usi(N, 'n1') === '{}' && usi(N, 'n2') === '{"PANZERFAUST":2}', 'per truppa: n1 ricaricata, n2 no', [usi(N, 'n1'), usi(N, 'n2')]);
    ok(usi(P, 'p1') === '{"PANZERFAUST":1}', 'il comando dei Nomads non tocca PanOceania', usi(P, 'p1'));
    N.roster[0].usiSpesi = { PANZERFAUST: 2 }; N.alert_.length = 0;
    T.nomadi.riceve(M.CANALI.HUB_RICARICA, c1);
    ok(usi(N, 'n1') === '{"PANZERFAUST":2}' && N.alert_.length === 0, 'lo STESSO comando rimandato: niente (applicato una volta sola)', usi(N, 'n1'));
    const fatti = N.applicaRicaricaDaHub(c1);
    ok(J(fatti) === '[]', '  anche chiamato a mano: applicaRicaricaDaHub lo riconosce e non rifa`', fatti);
    H.inviaRicaricaForzata('NOMADI', null, 'tutti'); T.giro();
    ok(usi(N, 'n1') === '{}' && usi(N, 'n2') === '{}' && usi(P, 'p1') === '{"PANZERFAUST":1}', 'dall Hub con unitaId null: tutta la fazione dei Nomads, PanOceania no', [usi(N, 'n1'), usi(N, 'n2'), usi(P, 'p1')]);
    const c3 = M.comandoRicarica('PANOCEANIA', null); T.pano.riceve(M.CANALI.HUB_RICARICA, c3); T.nomadi.riceve(M.CANALI.HUB_RICARICA, c3);
    ok(usi(P, 'p1') === '{}', 'e quello per PanOceania arriva a PanOceania', usi(P, 'p1'));
});

sezione('B. E62: Spector in Schieramento Aereo, Attacco BS senza INGRESSO IN CAMPO', () => {
    const giro = (dep) => {
        const T = tavolo(T => [tr(P_(T, /^Spector \(Parachutist, Combat Jump\)/), { id: 'n1', alias: 'Spec', deployState: dep })], T => [FUS(T, 'p1')], 'NOMADI');
        const N = T.nomadi.g; const menu = T.apriMenu(T.nomadi, 0);
        N.selectAction('ATTACCO BS', false); N.startUnitAllocationLoopBS();
        const arg = (String(T.nomadi.el('weapon-buttons-container').innerHTML).match(/declareAttackBS\('([^']+)'\)/) || [])[1];
        N.declareAttackBS(arg); N.toggleTargetSelection('p1'); N.confirmMultiAro(false); T.giro(); T.pano.g.annullaAro(); T.giro();
        N.goToModifiersBS('IDLE'); N.alert_.length = 0; N.eseguiCalcoloBS(); T.giro();
        const M = N.MotoreN5;
        const diretto = M.creaPayload([{ attaccante: N.roster[0], azione: M.AZIONI.BS_ATTACK, arma: Object.assign({}, M.profiloArma('Boarding Shotgun'), { burst: 1 }), burstDisponibile: 1,
            bersagli: [{ id: 'p1', name: 'F1', burst: 1, cover: false, rangeIndex: 0, rangeMod: 0, terrain: 'NESSUNO' }] }], {});
        const ingresso = M.creaPayload([{ attaccante: N.roster[0], azione: M.AZIONI.INGRESSO, bersagli: [] }], {});
        return { T, N, menu, diretto, ingresso };
    };
    const a = giro('AD');
    ok(/INGRESSO IN CAMPO/.test(a.menu), 'in AD il menu offre INGRESSO IN CAMPO');
    ok(!ris(a.T) && a.N.alert_.some(m => /INVIO BLOCCATO/.test(m) && /non è ancora sul tavolo \(Schieramento Aereo\)/.test(m) && /INGRESSO IN CAMPO/.test(m)),
       'l Attacco BS si blocca all invio: «non è ancora sul tavolo (Schieramento Aereo)», «Prima dichiara INGRESSO IN CAMPO»', a.N.alert_.map(m => m.slice(0, 80)));
    ok(a.diretto.ok === false && a.diretto.errori.some(e => e.codice === 'E62'), 'il motore lo respinge con E62', (a.diretto.errori || []).map(e => e.codice));
    ok(a.ingresso.ok === true, 'CONTROPROVA: l INGRESSO IN CAMPO della stessa truppa passa', (a.ingresso.errori || []).map(e => e.codice));
    const b = giro('NORMAL');
    ok(ris(b.T) && b.N.alert_.length === 0 && b.diretto.ok === true, 'CONTROPROVA: lo Spector gia` sul tavolo attacca, e l Hub risolve', b.N.alert_);
});

sezione('C. SP-07: Coordinato SCOPRIRE + ATTACCO BS a tre, ognuno col SUO Scoprire', () => {
    const T = tavolo(T => ['n1', 'n2', 'n3'].map((id, i) => tr(P_(T, /^Alguacil \(Combi/), { id, alias: 'A' + (i + 1) })),
                     T => [tr(T.profilo(T.pano, /^Croc Man \(Boarding/), { id: 'p1', alias: 'Croc', deployState: 'CAMO', state: 'CAMO', states: { camo: true } })], 'NOMADI');
    const N = T.nomadi.g, P = T.pano.g, H = T.hub.g;
    N.alert_.length = 0; N.currentGroup = 1; N.isCoordinated = true; N.selectedCoordinatedUnits = []; N.spearheadUnit = null;
    [0, 1, 2].forEach(i => N.selezionaUnita(i)); N.confermaCoordinato();
    let pagine = 0; const pm = N.preparaModificatoriScoprire; N.preparaModificatoriScoprire = function () { pagine++; return pm.apply(this, arguments); };
    const s = spia(N);
    N.selectAction('SCOPRIRE', false); N.scegliBersaglioScoprire('p1');
    N.selectAction('ATTACCO BS', true); N.declareAttackBS('Combi Rifle'); N.toggleTargetSelection('p1'); N.confirmMultiAro(false); T.giro(); P.annullaAro(); T.giro();
    const gittate = [0, 1, 4], viste = [];
    gittate.forEach(function (g, k) {
        viste.push(/setRangeScoprire/.test(String(T.nomadi.el('targets-allocation-container').innerHTML)));
        N.setRangeScoprire(g); N.confermaScoprirePoiAttacco(); N.eseguiCalcoloBS(); T.giro();
        if (k < 2) N.declareAttackBS('Combi Rifle');
    });
    ok(pagine === 3 && viste.every(Boolean), 'tre pagine dello Scoprire, una per partecipante (prima solo la Punta)', [pagine, viste]);
    ok(s.n === 1 && s.p.length === 6 && J(s.p.map(x => x.az)) === J(['SCOPRIRE', 'ATTACCO BS', 'SCOPRIRE', 'ATTACCO BS', 'SCOPRIRE', 'ATTACCO BS']),
       'una busta da 6 voci: SCOPRIRE e ATTACCO BS per ognuno', s.p && s.p.map(x => x.az));
    const sc = H.ultimiScontri || [];
    const sco = sc.filter(x => x.attivo && x.attivo.azione === 'SCOPRIRE').map(x => x.attivo.nome + ' ' + x.attivo.mod);
    ok(ris(T) && sc.length === 6, 'l Hub calcola sei scontri', sc.length);
    ok(J(sco) === J(['A1 10', 'A2 7', 'A3 4']), 'ogni Scoprire con la SUA gittata: 0-8" +3 (10), 8-16" 0 (7), 32-40" -3 (4)', sco);
});

sezione('D. DIS-05: il Dado Speciale nel CC di Wolfgang Amadeus (Martial Arts L3)', () => {
    const giro = (re) => {
        const T = tavolo(T => [tr(P_(T, re), { id: 'n1', alias: 'Wolf' })], T => [FUS(T, 'p1')], 'NOMADI');
        const N = T.nomadi.g; T.apriMenu(T.nomadi, 0); N.selectAction('ATTACCO CC', false);
        const a = (String(T.nomadi.el('weapon-buttons-container').innerHTML).match(/declareCCAttack\('([^']+)'\)/) || [])[1];
        N.declareCCAttack(a); N.toggleTargetSelection('p1'); N.confirmMultiAro(false); T.giro(); T.pano.g.annullaAro(); T.giro();
        if (N.preparaModificatoriCC) N.preparaModificatoriCC();
        N.alert_.length = 0; N.eseguiCalcoloCC(); T.giro();
        return { T, t: tab(T), a };
    };
    const a = giro(/^Wolfgang Amadeus$/);
    ok(ris(a.T) && /Dado Speciale \(\+1 SD\): su QUESTO bersaglio tira 1 dado in più, poi scartane 1\./.test(a.t), 'nello scontro la nota «Dado Speciale (+1 SD): su QUESTO bersaglio tira 1 dado in più, poi scartane 1»', (a.t.match(/Dado Speciale[^.]*\./g) || []));
    const b = giro(/^Alguacil \(Combi/);
    ok(ris(b.T) && !/Dado Speciale/.test(b.t), 'CONTROPROVA: il CC di un Alguacil senza Martial Arts, nessun Dado Speciale');
});

sezione('E. Le mine non si sparano: Spektr con la Shock Mine nell Attacco BS', () => {
    const T = tavolo(T => [tr(P_(T, /^Spektr \(MULTI Sniper Rifle\)/), { id: 'n1', alias: 'Spk' })], T => [FUS(T, 'p1')], 'NOMADI');
    const N = T.nomadi.g; T.apriMenu(T.nomadi, 0); N.selectAction('ATTACCO BS', false); N.startUnitAllocationLoopBS();
    const w = String(T.nomadi.el('weapon-buttons-container').innerHTML);
    ok(!/declareAttackBS\('Shock Mine/.test(w) && !diArma(w, /Shock Mine/), 'la Shock Mine non ha un bottone nell Attacco BS');
    ok(/Shock Mine \(si piazza con PIAZZARE EQUIPAGGIAMENTO, non si spara\)/.test(tx(w)), 'ed e` fra le scartate, col motivo «si piazza con PIAZZARE EQUIPAGGIAMENTO, non si spara»', (tx(w).match(/.{0,20}PIAZZARE EQUIPAGGIAMENTO.{0,20}/) || [])[0]);
    ok(/declareAttackBS\('Silenced Pistol'/.test(w), 'CONTROPROVA: la Silenced Pistol dello stesso Spektr si spara');
    const T2 = tavolo(T => [tr(P_(T, /^Spektr \(MULTI Sniper Rifle\)/), { id: 'n1', alias: 'Spk' })], T => [FUS(T, 'p1')], 'NOMADI');
    T2.apriMenu(T2.nomadi, 0); T2.nomadi.g.selectAction('PIAZZARE EQUIPAGGIAMENTO', false);
    ok(/scegliArmaDaPiazzare\('Shock Mine'/.test(String(T2.nomadi.el('weapon-buttons-container').innerHTML)), 'CONTROPROVA: con PIAZZARE EQUIPAGGIAMENTO la Shock Mine c e');
});

sezione('F. DEP-11: il Deactivator vede i segnalini del roster nemico, mai i Marker', () => {
    const T = creaTavolo(DIR); const N = T.nomadi.g, P = T.pano.g, MP = P.MotoreN5;
    const fus = FUS(T, 'p1', { alias: 'Fus', equip: 'FastPanda, CrazyKoalas, Armed Turret (Combi Rifle)', weapon: 'Combi Rifle, Shock Mine' });
    const tok = (a) => MP.creaDeployable(fus, MP.profiloArma(a), { ordineId: 'X' }).token;
    const rep = tok('FastPanda'), koa = tok('CrazyKoalas'), tur = tok('Armed Turret'), camo = tok('Shock Mine'), scoperta = tok('Shock Mine');
    Object.assign(scoperta, { deployState: 'NORMAL', state: 'ACTIVE', states: {} });
    T.schiera([tr(P_(T, /^Salyut \(Deactivator, Repeater\)/), { id: 'n1', alias: 'Sal' })], [fus, rep, koa, tur, camo, scoperta], 'NOMADI');
    const g = N.MotoreN5.bersagliDeactivator(N.roster[0]).bersagli;
    const ammessi = g.filter(x => x.ammesso).map(x => x.unita.id);
    ok(J(ammessi.slice().sort()) === J([rep.id, koa.id, tur.id, scoperta.id].sort()), 'ammessi: Repeater (FastPanda), Koala, torretta e la mina gia` scoperta', g.map(x => x.nome + (x.ammesso ? '' : ' (no)')));
    ok(ammessi.indexOf(camo.id) < 0 && ammessi.indexOf('p1') < 0, 'CONTROPROVA: la mina ancora in CAMO (un Marker per l avversario) e il Fusilier no');
    const pub = N.MotoreN5.rosterNemico().find(u => u.id === camo.id) || {};
    ok(pub.nome === 'MARKER' && pub.deployable === undefined, '  la mina in CAMO arriva come MARKER, senza deployable: il Deactivator non la vede', [pub.nome, pub.deployable]);
    const menu = T.apriMenu(T.nomadi, 0);
    ok(/selectAction\('DEACTIVATOR'/.test(menu), 'il Salyut ha DEACTIVATOR nel menu');
});

sezione('G. DEP-10: Minelayer, la domanda sull area solo per chi ha l area (E54)', () => {
    const T = creaTavolo(DIR); const M = T.nomadi.g.MotoreN5;
    const zero = tr(P_(T, /^Zero \(Minelayer\)/), { id: 'n1', alias: 'Zero' });
    const oz = M.opzioniMinelayer(zero);
    ok(oz.ha && oz.pezzi === 1 && J(oz.armi.map(a => [a.nome, a.chiedeArea])) === J([['Shock Mine', true], ['PARA Mine', true]]), 'Zero: Shock Mine e PARA Mine, tutte e due con chiedeArea', oz.armi.map(a => [a.nome, a.chiedeArea]));
    const task = tr(P_(T, /^Taskmaster \(Red Fury/), { id: 'n2' });
    ok(J(M.opzioniMinelayer(task).armi.map(a => [a.nome, a.chiedeArea])) === J([['CrazyKoalas', true]]), 'Taskmaster: CrazyKoalas, Perimeter: l area e` la ZdC, chiedeArea');
    const rep = Object.assign({}, zero, { id: 'n3', weapon: 'Boarding Shotgun', equip: 'Deployable Cover' });
    const or = M.opzioniMinelayer(rep);
    ok(or.armi.length >= 1 && or.armi.every(a => a.chiedeArea === false), 'un Minelayer con la Deployable Cover (nessuna area d innesco): chiedeArea false', or.armi.map(a => [a.nome, a.chiedeArea]));
    const senzaRisposta = M.piazzaConMinelayer(rep, or.armi[0] && or.armi[0].nome, { dentroZona: true });
    ok(!(senzaRisposta.errori || []).some(e => e.codice === 'E54') && !!senzaRisposta.token, '  e senza risposta sull area si piazza: niente E54', (senzaRisposta.errori || []).map(e => e.codice));
    const mina = M.piazzaConMinelayer(zero, 'Shock Mine', { dentroZona: true });
    ok((mina.errori || []).some(e => e.codice === 'E54') && !mina.token, 'CONTROPROVA: la Shock Mine senza risposta sull area: E54', (mina.errori || []).map(e => e.codice));
    const minaOk = M.piazzaConMinelayer(zero, 'Shock Mine', { nemiciNellArea: false, dentroZona: true });
    ok(!!minaOk.token && !(minaOk.errori || []).length, '  e con «nessun nemico nell area» si piazza');
});

sezione('H1. SCENDI DAL TAG: Anaconda, il pilota nasce, niente Eclipse', () => {
    const T = tavolo(T => [tr(P_(T, /^Anaconda \(Heavy Machine Gun\)/), { id: 'n1', alias: 'Ana' })], T => [FUS(T, 'p1')], 'NOMADI');
    const N = T.nomadi.g;
    const menu = T.apriMenu(T.nomadi, 0);
    ok(/selectAction\('SCENDI DAL TAG'/.test(menu), 'il menu dell Anaconda offre SCENDI DAL TAG');
    N.alert_.length = 0; N.selectAction('SCENDI DAL TAG', false); T.giro();
    const pil = N.roster.find(u => u.id !== 'n1');
    ok(N.roster.length === 2 && pil && pil.tagDi === 'n1' && pil.deployState === 'NORMAL', 'nasce il pilota, legato al TAG (tagDi), sul tavolo', N.roster.map(u => [u.id, u.nome, u.deployState]));
    ok(N.roster[0].states.tagVuoto === true, 'il TAG resta vuoto (tagVuoto)');
    ok(!/Eclipse/i.test(N.alert_.join(' ')) && N.alert_.some(m => /Il pilota scende/.test(m)), 'niente Sagoma di Eclipse: «Il pilota scende…» (regola della casa)', N.alert_.map(m => m.slice(0, 60)));
    N.alert_.length = 0; const m2 = T.apriMenu(T.nomadi, 0);
    ok(!/SCENDI DAL TAG/.test(m2), 'il TAG vuoto non offre piu` SCENDI DAL TAG');
    N.selectAction('SCENDI DAL TAG', false);
    ok(N.roster.length === 2 && N.alert_.some(m => /gia` uscito/.test(m)), '  e chiamato a mano: «Il pilota e` gia` uscito», nessun secondo pilota', N.alert_);
    const ip = N.roster.indexOf(pil); N.alert_.length = 0;
    ok(/selectAction\('RISALI SUL TAG'/.test(T.apriMenu(T.nomadi, ip)), 'il pilota ha RISALI SUL TAG');
    N.selectAction('RISALI SUL TAG', false); T.giro();
    ok(N.roster.length === 1 && !N.roster[0].states.tagVuoto, 'risalito: il pilota sparisce, il TAG torna attivo', N.roster.map(u => [u.id, J(u.states || {}).slice(0, 30)]));
});

sezione('H2. Pilota di lista (Gator): a bordo, invisibile, scende LUI e risale', () => {
    const T = creaTavolo(DIR); const N = T.nomadi.g, M = N.MotoreN5;
    const g1 = tr(P_(T, /^Gator \(TAG\)/), { id: 'n1', alias: 'Gator1' }), pl = tr(P_(T, /^Gator Pilot/), { id: 'n2', alias: 'Pil' });
    const bordo = M.mettiABordo(pl, M.tagDelPilota(pl, [g1, pl]));
    ok(bordo.deployState === 'A_BORDO' && bordo.aBordoDi === 'n1' && bordo.pilotaDiLista === true, 'M.mettiABordo: A_BORDO, aBordoDi = il Gator', [bordo.deployState, bordo.aBordoDi]);
    T.schiera([g1, bordo], [FUS(T, 'p1')], 'NOMADI');
    const vede = () => T.pano.g.MotoreN5.rosterNemico().map(u => u.id);
    ok(J(vede()) === '["n1"]' && J((T.hub.g.gameState.nomads || []).map(u => u.id)) === '["n1"]', 'l avversario e l Hub vedono solo il Gator', vede());
    const po = M.puoRicevereOrdine(N.roster[1]);
    ok(po.puo === false && /a bordo del TAG/.test(po.motivo), 'il pilota a bordo non riceve Ordini («È a bordo del TAG: prima SCENDI DAL TAG»)', po.motivo);
    T.apriMenu(T.nomadi, 0); N.selectAction('SCENDI DAL TAG', false); T.giro();
    ok(N.roster.length === 2 && N.roster[1].id === 'n2' && N.roster[1].deployState === 'NORMAL' && N.roster[1].tagDi === 'n1', 'SCENDI DAL TAG: scende LUI (n2), nessun pilota nuovo', N.roster.map(u => [u.id, u.deployState]));
    ok(J(vede()) === '["n1","n2"]', '  e ora l avversario lo vede', vede());
    T.apriMenu(T.nomadi, 1); N.selectAction('RISALI SUL TAG', false); T.giro();
    ok(N.roster.length === 2 && N.roster[1].deployState === 'A_BORDO' && N.roster[1].aBordoDi === 'n1' && !N.roster[0].states.tagVuoto, 'RISALI SUL TAG: torna A_BORDO e resta nel roster (non sparisce come un pilota espulso)', N.roster.map(u => [u.id, u.deployState]));
    ok(J(vede()) === '["n1"]', '  e torna invisibile', vede());
});

sezione('H3. M.tagDelPilota: lo stesso Gruppo, il TAG libero, mai una replica', () => {
    const T = creaTavolo(DIR); const M = T.nomadi.g.MotoreN5;
    const g = (id, cg) => tr(P_(T, /^Gator \(TAG\)/), { id, combatGroup: cg }), p = (id, cg) => tr(P_(T, /^Gator Pilot/), { id, combatGroup: cg });
    const g1 = g('g1', 1), g2 = g('g2', 2), pl1 = p('q1', 1), pl2 = p('q2', 2);
    ok((M.tagDelPilota(pl2, [g1, g2, pl2]) || {}).id === 'g2', 'Gator Pilot del Gruppo 2 -> il Gator del Gruppo 2');
    const occupato = M.mettiABordo(pl1, g1);
    ok((M.tagDelPilota(p('q3', 1), [g1, g2, occupato]) || {}).id === 'g2', 'con due Gator e il primo occupato, il secondo pilota va sul TAG libero (anche d un altro Gruppo)');
    ok(M.tagDelPilota(p('q4', 1), [g1, occupato]) === null, 'un solo Gator, gia` occupato: null');
    const rep = Object.assign({}, g1, { id: 'g1_rep', replica: true });
    ok(M.tagDelPilota(pl1, [rep, pl1]) === null && (M.tagDelPilota(pl1, [rep, g1, pl1]) || {}).id === 'g1', 'mai una replica: con la sola replica null, con replica e vero il vero');
    ok(M.tagDelPilota(tr(P_(T, /^Alguacil \(Combi/), { id: 'x' }), [g1]) === null, 'CONTROPROVA: chi non e` un Pilot non ha TAG');
});

// ---------------------------------------------------------------------------
const CHAIN = /^Triphammer \(AP Spitfire, Chain-colt\)$/, FLAM = /^Triphammer \(AP Spitfire, Heavy Flamethrower\)$/;
const sagome = (re, armaRe, n, opz) => {
    opz = opz || {};
    const ids = ['p1', 'p2', 'p3'].slice(0, n);
    const T = tavolo(T => [tr(P_(T, re), { id: 'n1', alias: 'Tri' })],
                     T => ids.map((id, i) => FUS(T, id, Object.assign({ alias: 'F' + (i + 1) }, (i === 0 && opz.mischia) ? { states: { engaged: true } } : {}))), 'NOMADI');
    const N = T.nomadi.g, H = T.hub.g; T.apriMenu(T.nomadi, 0); N.selectAction('ATTACCO BS', false); N.startUnitAllocationLoopBS();
    const arg = (String(T.nomadi.el('weapon-buttons-container').innerHTML).match(new RegExp("declareAttackBS\\('(" + armaRe + "[^']*)'\\)")) || [])[1];
    N.declareAttackBS(arg); ids.forEach(id => N.toggleTargetSelection(id)); N.confirmMultiAro(false); T.giro(); T.pano.g.annullaAro(); T.giro();
    N.goToModifiersBS('IDLE');
    const partenza = N.combatTargets.map(t => t.sagome);
    if (opz.prep) opz.prep(N);
    const pag = String(T.nomadi.el('targets-allocation-container').innerHTML);
    const schede = (pag.match(/<div class="target-card[\s\S]*?(?=<div class="target-card|$)/g) || []);
    N.alert_.length = 0; N.eseguiCalcoloBS(); T.giro();
    const sc = H.ultimiScontri || [];
    return { T, N, arg, tb: N.totalBurst, partenza, pag, domande: schede.map(c => /prende anche un/.test(c)), sc, per: (nome) => sc.find(s => s.reattivo && s.reattivo.nome === nome) || {} };
};

sezione('I1. SG-09: Chain-colt (+1B), due Sagome a lettere su tre Fusilier', () => {
    const a = sagome(CHAIN, 'Chain-colt', 3, { mischia: true, prep: (N) => N.toggleSagomaBS(1, 'A') });
    ok(a.arg === 'Chain-colt (+1B)' && a.tb === 2, 'Chain-colt (+1B): due Sagome, A e B', [a.arg, a.tb]);
    ok(J(a.partenza) === J([['A'], ['B'], ['A']]), 'partenza con piu` bersagli: le lettere a giro, A, B, A', a.partenza);
    ok(/Sagoma A<\/b>: F1, F2, F3/.test(a.pag) && /Sagoma B<\/b>: F2/.test(a.pag), 'la pagina dice chi sta sotto ogni Sagoma: A su F1, F2, F3; B su F2');
    ok(ris(a.T) && a.sc.length === 3, 'l Hub risolve tre scontri');
    ok(a.per('F1').tipo === 'NESSUNO' && a.per('F3').tipo === 'NESSUNO', 'F1 (in mischia con un tuo alleato, sotto A) e F3 (solo A): colpo annullato', [a.per('F1').tipo, a.per('F3').tipo]);
    const f2 = J(a.per('F2'));
    ok(a.per('F2').tipo === 'NORMALE' && /Sagome A \(annullata: prende F1 con un tuo alleato\)\. Restano B: 1 Tiro\/i Salvezza/.test(f2),
       'F2 (A e B): colpito da B, 1 Tiro Salvezza, e la nota per lettera «Sagome A (annullata…). Restano B»', (f2.match(/Sagome A[^"]{0,90}/) || [])[0]);
    ok(/stesso colpo che prende anche Sagoma A \(F1\)/.test(J(a.per('F3'))), 'F3 dice perche`: lo stesso colpo che prende anche Sagoma A (F1)');
    const b = sagome(CHAIN, 'Chain-colt', 1);
    ok(J(b.partenza) === J([['A', 'B']]), 'partenza con un bersaglio solo: tutte e due le lettere', b.partenza);
    const c = sagome(CHAIN, 'Chain-colt', 3, { prep: (N) => N.toggleSagomaBS(1, 'B') });
    ok(!ris(c.T) && c.N.alert_.some(m => /F2: nessuna Sagoma accesa/.test(m)), 'un bersaglio senza lettere blocca l invio: «F2: nessuna Sagoma accesa»', c.N.alert_.map(m => m.slice(0, 60)));
    const d = sagome(CHAIN, 'Chain-colt', 3, { prep: (N) => N.toggleSagomaBS(1, 'A') });
    ok(ris(d.T) && d.sc.every(s => s.tipo === 'NORMALE'), 'CONTROPROVA: le stesse lettere senza la mischia, nessuno annullato', d.sc.map(s => s.tipo));
});

sezione('I2. TPL-11: la domanda «alleato sotto la Sagoma» con una Sagoma e con due', () => {
    const a = sagome(FLAM, 'Heavy Flamethrower', 2);
    ok(a.tb === 1 && J(a.domande) === '[true,false]', 'una Sagoma (Heavy Flamethrower): la domanda solo sul Principale', a.domande);
    const b = sagome(FLAM, 'Heavy Flamethrower', 2, { prep: (N) => N.setAlleatiInMischiaBS(0, true) });
    ok(ris(b.T) && b.sc.length === 2 && b.sc.every(s => s.tipo === 'NESSUNO'), '  e la risposta vale per tutti: «sì» sul Principale annulla anche il secondo', b.sc.map(s => s.tipo));
    ok(a.sc.every(s => s.tipo === 'NORMALE'), '  CONTROPROVA: con «no» tutti e due colpiti', a.sc.map(s => s.tipo));
    const c = sagome(CHAIN, 'Chain-colt', 2);
    ok(c.tb === 2 && J(c.domande) === '[true,true]', 'due Sagome a lettere (Chain-colt): la domanda resta su ogni bersaglio', c.domande);
});

sezione('I3. SG-10: il secondario di una Sagoma d Impatto non ha il Critico', () => {
    const T = tavolo(T => [tr(P_(T, /^Alguacil \(Missile/), { id: 'n1', alias: 'Lancia' })], T => ['p1', 'p2', 'p3'].map((id, i) => FUS(T, id, { alias: 'F' + (i + 1) })), 'NOMADI');
    const N = T.nomadi.g, H = T.hub.g; let grezzo = null; const o = H.MotoreN5.risolviPayload;
    H.MotoreN5.risolviPayload = function () { grezzo = o.apply(this, arguments); return grezzo; };
    T.apriMenu(T.nomadi, 0); N.selectAction('ATTACCO BS', false); N.startUnitAllocationLoopBS();
    N.declareAttackBS('Missile Launcher (Blast Mode)', 'Missile Launcher'); ['p1', 'p2', 'p3'].forEach(id => N.toggleTargetSelection(id)); N.confirmMultiAro(false); T.giro(); T.pano.g.annullaAro(); T.giro();
    N.goToModifiersBS('IDLE'); N.setTargetRangeBS(0, 1); N.eseguiCalcoloBS(); T.giro();
    const g = Array.isArray(grezzo) ? grezzo : [];
    const sc = (k) => (g[k] && g[k].attivo && g[k].attivo.salvezzaInflitta) || {};
    ok(ris(T) && g.length === 3 && J(g.map(s => s.bersaglioDiSagoma)) === J(['PRINCIPALE', 'SECONDARIO', 'SECONDARIO']), 'premessa: tre scontri, un Principale e due secondari', g.map(s => s.bersaglioDiSagoma));
    ok(!sc(0).senzaCritico && /un Critico conta come successo normale/.test(String(sc(1).senzaCritico)) && /un Critico conta come successo normale/.test(String(sc(2).senzaCritico)),
       'il motore: salvezzaInflitta.senzaCritico sui due secondari, non sul Principale', [sc(0).senzaCritico, sc(1).senzaCritico && sc(1).senzaCritico.slice(0, 30)]);
    const html = H.ultimiScontri || [];
    const riquadro = (k) => String((html[k] && html[k].reattivo && html[k].reattivo.salvezza) || '');
    ok(/un Critico aggiunge 1 Tiro Salvezza/.test(riquadro(0)), 'sul tabellone, sotto il Principale: «un Critico aggiunge 1 Tiro Salvezza» (resta)');
    // 🔴 GIRATA IL 27 OTTOBRE (motore 2026-10-27.1): senzaCritico c e` anche
    // su reattivo.salvezzaSubita, quella che il tabellone disegna sotto il
    // bersaglio (calcolatore_math, riga 302). Fino alla 26.3 sotto i
    // secondari restava «un Critico aggiunge 1 Tiro Salvezza».
    const sub = (k) => (g[k] && g[k].reattivo && g[k].reattivo.salvezzaSubita) || {};
    ok(!sub(0).senzaCritico && /un Critico conta come successo normale/.test(String(sub(1).senzaCritico)) && /un Critico conta come successo normale/.test(String(sub(2).senzaCritico)),
       'il motore: reattivo.salvezzaSubita.senzaCritico sui due secondari, non sul Principale', [sub(0).senzaCritico, String(sub(1).senzaCritico).slice(0, 30)]);
    ok([1, 2].every(k => /Bersaglio secondario: un Critico conta come successo normale, niente Tiro Salvezza extra/.test(riquadro(k)) && !/un Critico aggiunge/.test(riquadro(k))),
       'sotto i secondari il tabellone dice «Bersaglio secondario: un Critico conta come successo normale…», mai «un Critico aggiunge»', tx(riquadro(1)).slice(-110));
    ok(!/conta come successo normale/.test(riquadro(0)), '  CONTROPROVA: sotto il Principale la nota del secondario non c e`');
});

sezione('J1. Holoprojector: due copie identiche, la copia non riceve Ordini', () => {
    const T = creaTavolo(DIR); const N = T.nomadi.g, M = N.MotoreN5;
    const bashi = tr(P_(T, /^Bashi Bazouk \(BS Attack \(AP\)\)/), { id: 'u_1793050000000_123', alias: 'Bashi' });
    T.schiera([bashi], [FUS(T, 'p1')], 'NOMADI');
    N.creaRepliche(0, 'HOLOECHO');
    ok(N.roster.length === 3 && N.roster.filter(u => u.replica && u.replicaDi === bashi.id).length === 2, 'dallo schieramento: la vera e due repliche (replicaDi la vera)', N.roster.map(u => [u.id, !!u.replica]));
    ok(J(N.roster.map(u => u.numeroReplica).sort()) === '[1,2,3]', 'numeri 1, 2 e 3, uno a testa', N.roster.map(u => u.numeroReplica));
    N.inviaSchieramentoAllHub('NOMADI', { roster: N.roster, strutture: [], terreni: [] }); T.giro();
    const pub = T.pano.g.MotoreN5.rosterNemico();
    const ugual = new Set(pub.map(u => { const c = Object.assign({}, u); delete c.id; delete c.numeroReplica; delete c.alias; return J(c); })).size;
    ok(pub.length === 3 && ugual === 1 && pub.every(u => !('replica' in u) && !('replicaDi' in u) && !('gruppoRepliche' in u) && !('tipoRepliche' in u)),
       'all avversario: tre profili identici (tolti id e numero), senza replica, replicaDi, gruppoRepliche, tipoRepliche', [ugual, Object.keys(pub[1] || {}).filter(k => /repl/i.test(k))]);
    ok(pub.every(u => /^COPIA OLOGRAFICA [123]$/.test(u.alias)), '  tutte «COPIA OLOGRAFICA n»', pub.map(u => u.alias));
    // 🔴 GIRATA IL 27 OTTOBRE (motore 2026-10-27.1): con un id di lista
    // (u_<numero>_<n>, roster_manager) le repliche hanno la stessa forma e lo
    // stesso <numero>; vera e repliche escono in ordine di numeroReplica.
    // Fino alla 26.3 la vera era u_…_… e prima, le repliche u<base36>.
    ok(pub.every(u => /^u_1793050000000_\d+$/.test(u.id)) && new Set(pub.map(u => u.id)).size === 3,
       'all avversario tre id della stessa forma, u_1793050000000_<n>, tutti diversi', pub.map(u => u.id));
    const perNumero = N.roster.slice().sort((a, b) => a.numeroReplica - b.numeroReplica).map(u => u.id);
    ok(J(pub.map(u => u.id)) === J(perNumero), '  e nell ordine del numero (dato a caso), non con la vera prima', [pub.map(u => u.id), perNumero]);
    const rep = N.roster.find(u => u.replica);
    const po = M.puoRicevereOrdine(rep);
    ok(po.puo === false && /copia olografica/i.test(po.motivo) && M.puoRicevereOrdine(N.roster[0]).puo === true, 'la copia non riceve Ordini; la vera si`', po.motivo);
    ok(/E` una REPLICA/.test(String(M.notaReplicaBersaglio(rep))) && M.notaReplicaBersaglio(N.roster[0]) === null, 'M.notaReplicaBersaglio: la nota solo sulla replica');
});

sezione('J2-J3. M.togliReplica, la vera che si rivela, Decoy (1) e Decoy (2)', () => {
    const T = creaTavolo(DIR); const N = T.nomadi.g, M = N.MotoreN5;
    const bashi = tr(P_(T, /^Bashi Bazouk \(BS Attack \(AP\)\)/), { id: 'n1', alias: 'Bashi' });
    const e = M.creaRepliche(bashi, 'HOLOECHO'); const ros = [e.unitaAggiornata].concat(e.repliche);
    const t1 = M.togliReplica(ros, e.repliche[0].id);
    ok(ros.length === 2 && t1.veraAggiornata === null, 'tolta una copia: la vera resta in Holoecho');
    const t2 = M.togliReplica(ros, e.repliche[1].id);
    ok(ros.length === 1 && t2.veraAggiornata && t2.veraAggiornata.states.holoecho === false && t2.note.some(n => /cade anche l’Holoecho/.test(n)), 'tolta l ultima: cade l Holoecho della vera (pag. 160)', t2.note);
    ok(M.togliReplica(ros, 'n1').tolta === null, 'CONTROPROVA: la vera non si toglie come una replica');
    const e2 = M.creaRepliche(bashi, 'HOLOECHO'); N.roster = [e2.unitaAggiornata].concat(e2.repliche);
    N.sostituisciUnita(N.roster[0], Object.assign({}, N.roster[0], { states: Object.assign({}, N.roster[0].states, { holoecho: false }) }), 'RIVELA');
    ok(N.roster.length === 1 && N.roster[0].id === 'n1', 'la vera si rivela (sostituisciUnita senza holoecho): le repliche escono dal roster', N.roster.map(u => u.id));
    const knauf = tr(P_(T, /^Knauf \(Surprise Attack \(-3\), Decoy \(1\)\)/), { id: 'n2' }), blade = tr(P_(T, /^Blade \(Engineer, Forward Deployment \[\+8"\], Decoy \[2\]\)/), { id: 'n3' });
    ok(M.creaRepliche(knauf, 'DECOY').repliche.length === 1 && M.creaRepliche(blade, 'DECOY').repliche.length === 2, 'Decoy (1): una replica; Decoy [2]: due');
    ok(M.creaRepliche(tr(P_(T, /^Alguacil \(Combi/), { id: 'x' }), 'DECOY').possibile === false, 'CONTROPROVA: senza Decoy nessuna replica');
});

sezione('J4. HoloMask: solo la stessa Silhouette, raggruppate per Unita`', () => {
    const T = creaTavolo(DIR); const M = T.nomadi.g.MotoreN5;
    const bashi = tr(P_(T, /^Bashi Bazouk \(BS Attack \(AP\)\)/), { id: 'n1' });
    const im = M.profiliImitabili(bashi), rg = M.profiliImitabiliRaggruppati(bashi);
    ok(im.length > 0 && im.every(p => String(p.s) === String(bashi.s)), 'M.profiliImitabili: solo Silhouette ' + bashi.s + ' (' + im.length + ' voci)');
    ok(rg.length >= 95 && rg.length <= 115 && rg.reduce((s, g) => s + g.varianti.length, 0) === im.length, 'M.profiliImitabiliRaggruppati: circa 105 truppe (' + rg.length + '), con dentro tutte le ' + im.length + ' varianti');
    ok(rg.every(g => g.varianti.every(v => String(v.nome).replace(/\s*\(.*$/, '').trim() === g.unita)), '  ogni variante sta sotto la sua Unita`');
    const altraS = T.nomadi.g.DB_NOMADI.find(p => String(p.s) !== String(bashi.s) && !p.deployable);
    ok(M.applicaHolomask(bashi, altraS.id).possibile === false, 'CONTROPROVA: imitare una Silhouette diversa non si puo` (' + altraS.nome + ', S ' + altraS.s + ')');
});

sezione('J5. Tabellone: Attacco BS su una truppa in HoloMask, nessuna traccia del nome vero', () => {
    const giro = (maschera) => {
        const T = creaTavolo(DIR); const N = T.nomadi.g, P = T.pano.g, M = N.MotoreN5;
        const bashi = tr(P_(T, /^Bashi Bazouk \(BS Attack \(AP\)\)/), { id: 'n1', alias: 'Bashi' });
        const alg = N.DB_NOMADI.find(u => /^Alguacil \(Combi/.test(u.nome));
        const u = maschera ? M.applicaHolomask(bashi, alg.id).unitaAggiornata : bashi;
        T.schiera([u], [FUS(T, 'p1')], 'PANOCEANIA');
        T.apriMenu(T.pano, 0); P.selectAction('ATTACCO BS', false); P.startUnitAllocationLoopBS(); P.declareAttackBS('Combi Rifle'); P.toggleTargetSelection('n1'); P.confirmMultiAro(false); T.giro();
        N.apriSelezioneAro(); N.toggleAroUnit('n1'); N.confermaSelezioneAro(); N.selezionaAzioneAro('DODGE'); N.salvaAroCorrente(); T.giro();
        P.goToModifiersBS('IDLE'); P.eseguiCalcoloBS(); T.giro();
        return { T, h: String(T.hub.el('clash-container').innerHTML), t: tab(T) };
    };
    const a = giro(true);
    ok(ris(a.T) && !/Bashi/i.test(a.h) && /Alguacil \(Combi Rifle\) Azione: SCHIVATA/.test(a.t), 'nel risultato dell Hub il nome imitato (Alguacil) e nessuna traccia di «Bashi», nemmeno nell HTML', (a.t.match(/REATTIVO NOMADI [^:]*/) || [])[0]);
    ok(/ARM 2 \+/.test(a.t), '  ma si gioca col profilo VERO: la salvezza e` su ARM 2 del Bashi (l Alguacil ha ARM 1)', (a.t.match(/\(ARM \d[^)]*\)/) || [])[0]);
    const b = giro(false);
    ok(/Bashi/.test(b.t) && !/Alguacil/.test(b.t), 'CONTROPROVA: senza HoloMask il tabellone dice Bashi');
    // L Hub trova chi reagisce prima per id: due reattivi con lo stesso soprannome.
    const T = creaTavolo(DIR); const N = T.nomadi.g, P = T.pano.g;
    T.schiera([tr(P_(T, /^Alguacil \(Combi/), { id: 'n1', alias: 'Spara' })], [FUS(T, 'p1', { alias: 'Gemello' }), tr(T.profilo(T.pano, /^Orc \(Hacker, Hacking Device/), { id: 'p2', alias: 'Gemello' })], 'NOMADI');
    T.apriMenu(T.nomadi, 0); N.selectAction('ATTACCO BS', false); N.startUnitAllocationLoopBS(); N.declareAttackBS('Combi Rifle'); N.toggleTargetSelection('p2'); N.confirmMultiAro(false); T.giro();
    P.apriSelezioneAro(); P.toggleAroUnit('p2'); P.confermaSelezioneAro(); P.selezionaAzioneAro('DODGE'); P.salvaAroCorrente(); T.giro();
    N.goToModifiersBS('IDLE'); N.eseguiCalcoloBS(); T.giro();
    const orc = P.roster.find(u => u.id === 'p2'), fus = P.roster.find(u => u.id === 'p1');
    const sch = (tab(T).match(/Gemello Azione: SCHIVATA Successo al: (\d+)/) || [])[1];
    ok(ris(T) && orc.ph !== fus.ph && String(sch) === String(orc.ph), 'due reattivi «Gemello»: la Schivata e` quella dell Orc (PH ' + orc.ph + '), non del Fusilier (PH ' + fus.ph + '): l Hub cerca per id', sch);
});

sezione('J6. Editor degli stati: Holoecho e HoloMask in due caselle', () => {
    const T = creaTavolo(DIR); const N = T.nomadi.g;
    const bashi = tr(P_(T, /^Bashi Bazouk \(BS Attack \(AP\)\)/), { id: 'n1', alias: 'Bashi' });
    ok(/Holomask/.test(bashi.equip) && /Holoprojector/.test(bashi.equip) && !/Holo/i.test(bashi.skills), 'premessa: il Bashi ha Holoprojector e Holomask fra gli equipaggiamenti, non fra le abilita`');
    N.roster = [bashi]; N.apriPaginaStati(0); const h = String(T.nomadi.el('states-content').innerHTML);
    ok(/id="st-holoecho"/.test(h) && /id="st-holomask"/.test(h), 'due caselle: st-holoecho e st-holomask, lette dall equip');
    T.nomadi.el('st-holoecho').checked = true; T.nomadi.el('st-holomask').checked = false; N.salvaStatiUnita();
    ok(N.roster[0].states.holoecho === true && !N.roster[0].states.holomask, 'salvare in Holoecho non accende l HoloMask');
    ok(N.roster.length === 3 && N.roster.filter(u => u.replica).length === 2, 'acceso in partita, l Holoecho crea due copie', N.roster.length);
    N.apriPaginaStati(0); T.nomadi.el('st-holoecho').checked = false; T.nomadi.el('st-holomask').checked = false; N.salvaStatiUnita();
    ok(N.roster.length === 1 && N.roster[0].states.holoecho === false, 'spento l Holoecho: le repliche escono dal roster', N.roster.length);
    N.roster[0].states.holomask = true; N.roster[0].holomaskImita = 'alguacil_combi';
    N.apriPaginaStati(0); T.nomadi.el('st-holoecho').checked = false; T.nomadi.el('st-holomask').checked = false; N.salvaStatiUnita();
    ok(N.roster[0].states.holomask === false && N.roster[0].holomaskImita === undefined, 'spenta l HoloMask: via anche holomaskImita');
    const soloHp = Object.assign(JSON.parse(J(bashi)), { id: 'n9', skills: 'Courage', equip: 'Holoprojector' });
    N.roster = [soloHp]; N.apriPaginaStati(0); const h2 = String(T.nomadi.el('states-content').innerHTML);
    ok(/st-holoecho/.test(h2) && !/st-holomask/.test(h2), 'CONTROPROVA: col solo Holoprojector, la sola casella dell Holoecho');
    const alg = tr(P_(T, /^Alguacil \(Combi/), { id: 'n8' }); N.roster = [alg]; N.apriPaginaStati(0);
    ok(!/st-holoecho|st-holomask/.test(String(T.nomadi.el('states-content').innerHTML)), 'CONTROPROVA: un Alguacil non ha nessuna delle due');
});

sezione('K. Icone per esercito: prima la cartella dell esercito, poi la comune, poi l emoji', () => {
    const T = creaTavolo(DIR); const N = T.nomadi.g, P = T.pano.g, H = T.hub.g, M = N.MotoreN5;
    const h = N.iconeDellEsercito('<img src="img/icon_camo.png" class="state-icon" onerror="this.outerHTML=\'<span>🦎</span>\'">');
    ok(/src="img\/nomadi\/icon_camo\.png" data-comune="img\/icon_camo\.png"/.test(h) && /this\.src=this\.dataset\.comune;return;\}this\.outerHTML=/.test(h),
       'app dei Nomads: src dalla cartella nomadi, data-comune la copia comune, e dopo l emoji di prima', h.slice(0, 120));
    ok(/src="img\/panoceania\/icon_camo\.png"/.test(P.iconeDellEsercito('<img src="img/icon_camo.png" onerror="x">')), 'app di PanOceania: dalla cartella panoceania');
    ok(N.iconeDellEsercito('<img src="img/nomadi/x.png" onerror="z">') === '<img src="img/nomadi/x.png" onerror="z">', 'un percorso gia` in una cartella non si tocca');
    ok(M.iconaDellaFazione('img/icon_camo.png', 'NOMADI') === 'img/nomadi/icon_camo.png' && M.iconaDellaFazione('img/icon_camo.png') === 'img/icon_camo.png', 'M.iconaDellaFazione: con la fazione la sua cartella, senza la comune');
    ok(H.iconaHubDellaFazione('img/icon_camo.png', 'PANOCEANIA') === 'img/panoceania/icon_camo.png' && H.iconaHubDellaFazione('img/icon_camo.png', null) === 'img/icon_camo.png', 'Hub: per fazione la sua cartella; senza fazione (scenografia) la comune');
    ok(N.imgDellaFazione('img/icon_camo.png', 'PANOCEANIA') === 'img/panoceania/icon_camo.png', 'app: accanto alle truppe avversarie le immagini del LORO esercito');
});

sezione('L. SCH-06: una mina piazzata in CAMO e` un CAMO senza mimetismo', () => {
    const T = creaTavolo(DIR); const N = T.nomadi.g, M = N.MotoreN5, H = T.hub.g;
    const zero = tr(P_(T, /^Zero \(Minelayer\)/), { id: 'n1', alias: 'Zero' });
    const r = M.piazzaConMinelayer(zero, 'Shock Mine', { nemiciNellArea: false, dentroZona: true });
    T.schiera([r.portatoreAggiornato, r.token], [FUS(T, 'p1')], 'NOMADI');
    const mia = N.roster.find(u => u.deployable);
    ok(mia && mia.states.camo === true && mia.tipoNumeroMarker === 'CAMO' && M.etichettaMarker(mia) === 'CAMO 1', 'nella propria app: CAMO 1 (non CAMO-3)', mia && [mia.tipoNumeroMarker, M.etichettaMarker(mia)]);
    const pub = T.pano.g.MotoreN5.rosterNemico().find(u => u.id === mia.id) || {};
    ok(pub.nome === 'MARKER' && pub.alias === 'SEGNALINO MIMETICO 1' && pub.mimetismo === 0 && pub.immagineMarker === 'img/nomadi/camo_1.png', 'all avversario: SEGNALINO MIMETICO 1, mimetismo 0, segnalino camo_1 dei Nomads', [pub.alias, pub.mimetismo, pub.immagineMarker]);
    const hm = (H.gameState.nomads || []).find(u => u.id === mia.id);
    ok(H.fotoTruppaHubConRipieghi(hm, 'NOMADI').src === 'img/nomadi/camo_1.png', 'all Hub lo stesso segnalino, non l immagine della mina');
    const croc = tr(T.profilo(T.pano, /^Croc Man \(Boarding/), { id: 'p9', deployState: 'CAMO', state: 'CAMO', states: { camo: true } });
    M.numeraMarker([croc]);
    ok(croc.tipoNumeroMarker !== 'CAMO', 'CONTROPROVA: un Croc Man in CAMO ha la serie del suo Mimetismo (' + croc.tipoNumeroMarker + ')');
});
// ---------------------------------------------------------------------------
//  27 ottobre (motore 2026-10-27.1, ordine_attacco_bs 2026-10-27.1)
// ---------------------------------------------------------------------------
sezione('J1b. Repliche su 200 giri: la vera non e` sempre prima, ma il suo <n> la tradisce', () => {
    const T = creaTavolo(DIR); const M = T.nomadi.g.MotoreN5;
    const b0 = tr(P_(T, /^Bashi Bazouk \(BS Attack \(AP\)\)/), {});
    let primo = 0, forma = 0, rivela = 0, maxRep = 0, treCifre = 0, repliche = 0; const GIRI = 200;
    for (let i = 0; i < GIRI; i++) {
        // l id di lista come lo fa roster_manager (righe 404 e 557): u_<Date.now()>_<0..999>
        const id = 'u_1793050000000_' + Math.floor(Math.random() * 1000);
        const u = Object.assign({}, b0, { id });
        const e = M.creaRepliche(u, 'HOLOECHO', { roster: [u] });
        const pub = M.rosterPubblico([e.unitaAggiornata].concat(e.repliche));
        const iv = pub.findIndex(x => x.id === id);
        if (iv === 0) primo++;
        if (pub.length === 3 && pub.every(x => /^u_1793050000000_\d+$/.test(x.id))) forma++;
        const n = pub.map(x => +String(x.id).split('_')[2]);
        if (n[iv] >= 100 && n.filter(v => v >= 100).length === 1) rivela++;
        e.repliche.forEach(r => { const k = +String(r.id).split('_')[2]; maxRep = Math.max(maxRep, k); repliche++; if (k >= 100) treCifre++; });
    }
    ok(forma === GIRI, 'in tutti i ' + GIRI + ' giri tre id della stessa forma u_<numero>_<n>', forma);
    ok(primo >= 35 && primo <= 100, 'la vera e` prima ' + primo + ' volte su ' + GIRI + ' (a caso: circa una su tre)', primo);
    const n1 = M.creaRepliche(Object.assign({}, b0, { id: 'n1' }), 'HOLOECHO').repliche.map(r => r.id);
    ok(n1.length === 2 && n1.every(x => /^u[0-9a-z]+$/.test(x) && !/_/.test(x)), 'CONTROPROVA: con un id di forma diversa (n1) le repliche restano opache', n1);
    // 🔴 GIRATA IL 27 OTTOBRE (motore 2026-10-27.2): il <n> delle repliche e`
    // 0..999, lo stesso intervallo di roster_manager (righe 404 e 557). Fino
    // alla 27.1 era 0..99, e la vera a tre cifre era l unica in ~177 giri su 200.
    ok(maxRep >= 100 && treCifre >= repliche * 0.8 && treCifre <= repliche * 0.97,
       'le repliche hanno <n> a tre cifre in proporzione (' + treCifre + ' su ' + repliche + ', atteso circa 9 su 10)', [maxRep, treCifre, repliche]);
    ok(rivela <= 15, 'la vera e` l unica a tre cifre solo in ' + rivela + ' giri su ' + GIRI + ' (a caso: circa 2)', rivela);
});

const discoBaller = (si, armaRe) => {
    const T = tavolo(T => [tr(P_(T, /^Kulak \(Hacker, Killer Hacking Device\)/), { id: 'n1', alias: 'Kul' })], T => [FUS(T, 'p1')], 'NOMADI');
    const N = T.nomadi.g, H = T.hub.g; const domande = [];
    N.confirm = (m) => { domande.push(String(m)); return si; };
    T.apriMenu(T.nomadi, 0); N.selectAction('ATTACCO BS', false); N.startUnitAllocationLoopBS();
    const w = String(T.nomadi.el('weapon-buttons-container').innerHTML);
    const arg = (w.match(new RegExp("declareAttackBS\\('(" + armaRe + "[^']*)'\\)")) || [])[1];
    N.declareAttackBS(arg); T.giro();
    if (!/Disco/.test(String(arg))) { N.toggleTargetSelection('p1'); N.confirmMultiAro(false); T.giro(); }
    T.pano.g.annullaAro(); T.giro();
    N.goToModifiersBS('IDLE'); N.alert_.length = 0; N.eseguiCalcoloBS(); T.giro();
    const disco = N.roster.filter(u => u.nascitaDaLancio === 'DISCO_BALL');
    return { T, N, w, arg, domande, t: tab(T), disco, al: N.alert_.slice(), hub: (H.gameState.nomads || []).map(u => u.nome) };
};
sezione('M. DEP-09: Disco Baller nell ATTACCO BS, «riuscito?», la Disco Ball e Eclipse', () => {
    const a = discoBaller(true, 'Disco Baller');
    ok(a.arg === 'Disco Baller' && /Usi residui: 2 su 2/.test(tx(diArma(a.w, /Disco Baller/))), 'il Disco Baller e` fra le armi dell ATTACCO BS, «Usi residui: 2 su 2»', tx(diArma(a.w, /Disco Baller/)).slice(-30));
    ok(ris(a.T) && /^TIRO NORMALE/.test(a.t) && /Kul Azione: ATTACCO BS Successo al: 13/.test(a.t), 'sul tabellone TIRO NORMALE del Kulak a 13', a.t.slice(0, 80));
    ok(a.domande.length === 1 && /Disco Baller: tira al tavolo\.[\s\S]*Il tiro è RIUSCITO\?/.test(a.domande[0]), 'dopo l invio una finestra: «Disco Baller: tira al tavolo. Il tiro è RIUSCITO?»', a.domande.map(d => d.slice(0, 50)));
    ok(a.disco.length === 1 && /^Disco Ball/.test(a.disco[0].nome) && a.al.some(m => /Disco Baller: segnalino piazzato\./.test(m)), 'OK: nasce la Disco Ball nel roster (nascitaDaLancio DISCO_BALL), «segnalino piazzato»', [a.disco.map(u => u.nome), a.al.map(m => m.slice(0, 40))]);
    ok(a.hub.some(n => /^Disco Ball/.test(n)), '  e l Hub la riceve (AGGIORNAMENTO)', a.hub);
    ok(/Se il tiro RIESCE nasce il segnalino \(Disco Ball\) dove e` caduto il colpo\./.test(a.t) && /Sagoma Circolare di munizione ECLIPSE, centrata sul segnalino/.test(a.t),
       'sul tabellone: «Se il tiro RIESCE nasce il segnalino (Disco Ball)…» con la Sagoma Circolare di ECLIPSE', (a.t.match(/Se il tiro RIESCE.{0,140}/) || [])[0]);
    const b = discoBaller(false, 'Disco Baller');
    ok(b.domande.length === 1 && b.disco.length === 0 && !b.hub.some(n => /Disco/.test(n)) && b.al.some(m => /Disco Baller: tiro fallito, nessun segnalino/.test(m)),
       'Annulla: nessun segnalino, né nel roster né all Hub, e lo dice', [b.disco.length, b.al.map(m => m.slice(0, 50))]);
    ok(/Se il tiro RIESCE nasce il segnalino \(Disco Ball\)/.test(b.t), '  la nota sul tabellone c e` lo stesso: il tabellone non sa ancora com e` andata');
    const c = discoBaller(true, 'AP Submachine Gun');
    ok(ris(c.T) && c.domande.length === 0 && c.disco.length === 0 && !/Se il tiro RIESCE/.test(c.t), 'CONTROPROVA: lo stesso Kulak con l AP Submachine Gun, nessuna finestra e nessuna nota', [c.arg, c.domande.length]);
    // La nota viene dal motore, per ogni lancio con segnalino e da qualunque modulo: il Pitcher dello Speculativo.
    const T = tavolo(T => [tr(P_(T, /^Pi-Well FTO/), { id: 'n1', alias: 'Lancia' })], T => [FUS(T, 'p1')], 'NOMADI');
    const N = T.nomadi.g; N.confirm = () => true;
    T.apriMenu(T.nomadi, 0); N.selectAction('FUOCO SPECULATIVO', false); N.declareSpeculativoAttack('Pitcher');
    N.toccaBersaglioSpeculativo('punto'); N.confirmMultiAro(false); T.giro(); T.pano.g.annullaAro(); T.giro();
    const m = String(T.nomadi.el('second-half-buttons-container').innerHTML).match(/window\.selectAction\('([^']+)', true\)/);
    if (m) N.selectAction(m[1], true);
    N.eseguiCalcoloSpeculativo(); T.giro();
    ok(ris(T) && /Se il tiro RIESCE nasce il segnalino \(Pitcher\) dove e` caduto il colpo\. Deployable Repeater/.test(tab(T)), 'col Pitcher del FUOCO SPECULATIVO la stessa nota: «Se il tiro RIESCE nasce il segnalino (Pitcher)… Deployable Repeater»', (tab(T).match(/Se il tiro RIESCE.{0,80}/) || [])[0]);
});

sezione('N. M.iconaDellaFazione: un percorso dell altro esercito cambia cartella', () => {
    const M = creaTavolo(DIR).nomadi.g.MotoreN5;
    ok(M.iconaDellaFazione('img/nomadi/x.png', 'PANOCEANIA') === 'img/panoceania/x.png', 'img/nomadi/x.png con PANOCEANIA: img/panoceania/x.png (prima img/panoceania/nomadi/x.png)', M.iconaDellaFazione('img/nomadi/x.png', 'PANOCEANIA'));
    ok(M.iconaDellaFazione('img/panoceania/x.png', 'NOMADI') === 'img/nomadi/x.png', '  e al contrario: img/panoceania/x.png con NOMADI, img/nomadi/x.png');
    ok(M.iconaDellaFazione('img/nomadi/x.png', 'NOMADI') === 'img/nomadi/x.png' && M.iconaDellaFazione('img/nomadi/x.png') === 'img/nomadi/x.png', 'CONTROPROVA: nella sua cartella, o senza fazione, resta com e`');
    ok(M.iconaDellaFazione('img/x.png', 'PANOCEANIA') === 'img/panoceania/x.png', 'CONTROPROVA: dalla cartella comune si entra in quella dell esercito');
});

sezione('O. Il tetto sugli usi residui vale anche in ARO (M.burstReattivo, Hub)', () => {
    const T0 = creaTavolo(DIR); const M = T0.nomadi.g.MotoreN5;
    const fus = FUS(T0, 'p1'), pf = M.profiloArma('Panzerfaust');
    const br = (u, a) => M.burstReattivo(u, a, {});
    const zero = br(Object.assign({}, fus, { usiSpesi: { PANZERFAUST: 2 } }), pf);
    ok(zero.valore === 0 && zero.note.some(n => /Panzerfaust: usi esauriti — la truppa è in stato Scarico/.test(n)), 'Panzerfaust con usiSpesi {PANZERFAUST: 2}: Burst 0, con la nota dello Scarico', [zero.valore, zero.note.map(n => n.slice(0, 40))]);
    const uno = br(Object.assign({}, fus, { usiSpesi: { PANZERFAUST: 1 } }), pf);
    ok(uno.valore === 1 && !uno.note.length, '  con un uso residuo: B1, nessuna nota (il tetto non toglie niente)', [uno.valore, uno.note]);
    const sal = tr(P_(T0, /^Salyut \(Total Reaction, Repeater\)/), { id: 'n1' });
    // Total Reaction: il Burst pieno. Un Panzerfaust a B2 (prova di banco) mostra il tetto.
    const pf2 = Object.assign({}, pf, { burst: 2 });
    ok(br(sal, pf2).valore === 2, 'premessa: Total Reaction con un Panzerfaust a B2 e usi pieni, B2 in ARO', br(sal, pf2).valore);
    const t1 = br(Object.assign({}, sal, { usiSpesi: { PANZERFAUST: 1 } }), pf2);
    ok(t1.valore === 1 && t1.voci.some(v => v.fonte === 'usi' && /Burst limitato agli usi residui: 1 su 2/.test(v.motivo)), 'Total Reaction, un uso residuo: B1, «Burst limitato agli usi residui: 1 su 2»', [t1.valore, t1.voci.map(v => v.motivo)]);
    ok(br(Object.assign({}, sal, { usiSpesi: { PANZERFAUST: 1 } }), M.profiloArma('Combi Rifle')).valore === 3, 'CONTROPROVA: lo stesso Salyut col Combi Rifle (non Disposable) resta B3');
    // DA CHIARIRE (REGOLE): col Panzerfaust (+1B) vero il B2 in ARO non c e` mai.
    const p1b = M.profiloArma('Panzerfaust (+1B)');
    ok(br(sal, p1b).valore === 1 && br(Object.assign({}, sal, { usiSpesi: { PANZERFAUST: 1 } }), p1b).valore === 1,
       'DA CHIARIRE: Total Reaction col Panzerfaust (+1B), B1 sia a usi pieni sia a un uso: il (+1B) in ARO non entra, e «B1 invece di B2» non si vede', [br(sal, p1b).valore, br(sal, p1b).voci.map(v => v.motivo)]);
    // All Hub: il reattivo Scarico, con e senza r.usiSpesi nella risposta.
    const hub = (togli) => {
        const T = creaTavolo(DIR); const N = T.nomadi.g, P = T.pano.g, H = T.hub.g;
        const r = tr(P_(T, /^Alguacil \(Combi/), { id: 'n1', alias: 'Reag', usiSpesi: { PANZERFAUST: 2 } }); r.weapon = String(r.weapon || '') + ', Panzerfaust';
        T.schiera([r], [FUS(T, 'p1', { alias: 'Spara' })], 'PANOCEANIA');
        const orh = T.hub.riceve; const viste = [];
        T.hub.riceve = (k, v) => { if (k === H.MotoreN5.CANALI.ARO_NOMADI && v) { const o = JSON.parse(v); (o.reazioni || []).forEach(x => { viste.push(J(x.usiSpesi)); if (togli) delete x.usiSpesi; }); v = J(o); } return orh(k, v); };
        T.apriMenu(T.pano, 0); P.selectAction('ATTACCO BS', false); P.startUnitAllocationLoopBS(); P.declareAttackBS('Combi Rifle'); P.toggleTargetSelection('n1'); P.confirmMultiAro(false); T.giro();
        N.apriSelezioneAro(); N.toggleAroUnit('n1'); N.confermaSelezioneAro(); N.selezionaAzioneAro('BS_ATTACK');
        const bt = diArma(String(T.nomadi.el('aro-weapon-list').innerHTML || T.nomadi.el('weapon-buttons-container').innerHTML), /Panzerfaust/);
        // il bottone e` spento: l arma si sceglie a mano, come farebbe una pagina vecchia
        N.selezionaArmaAro('Panzerfaust'); N.salvaAroCorrente(); T.giro();
        P.goToModifiersBS('IDLE'); P.eseguiCalcoloBS(); T.giro();
        const sc = (H.ultimiScontri || [])[0] || {};
        return { T, bt, viste, burst: sc.reattivo && sc.reattivo.burst, t: tab(T) };
    };
    const a = hub(false);
    ok(classe(a.bt) === 'bottone-arma bottone-arma-esaurito', 'premessa: nell ARO il bottone del Panzerfaust e` spento («USI ESAURITI (2/2)»)');
    ok(ris(a.T) && a.viste[0] === '{"PANZERFAUST":2}' && a.burst === 0 && /Reag Azione: ATTACCO BS Nessun dado/.test(a.t) && /^TIRO NORMALE/.test(a.t),
       'scelto a mano: la risposta porta {PANZERFAUST: 2}, all Hub il reattivo ha Burst 0 («Nessun dado») e lo scontro e` un Tiro Normale', [a.viste, a.burst, a.t.slice(0, 70)]);
    const b = hub(true);
    ok(ris(b.T) && b.burst === 1 && /RISOLUZIONE NOMADI/.test(b.t), 'CONTROPROVA: tolto r.usiSpesi dalla risposta, il Burst torna pieno (B1) e il reattivo tira: il campo serve', [b.burst, b.t.slice(0, 50)]);
    // 🔴 GIRATA IL 27 OTTOBRE (motore 2026-10-27.2): modReazione copia anche
    // burst.note. Fino alla 27.1 restava solo «Nessun dado», senza il perche`.
    const notaS = /Panzerfaust: usi esauriti — la truppa è in stato Scarico\. Si toglie con Reload/;
    ok(notaS.test(a.t) && notaS.test(J(a.T.hub.g.ultimiScontri || [])),
       'sul tabellone e in ultimiScontri la nota «Panzerfaust: usi esauriti — … Si toglie con Reload…»', (a.t.match(/Panzerfaust: usi esauriti.{0,40}/) || [])[0]);
    ok(!/usi esauriti/.test(b.t), '  CONTROPROVA: tolto r.usiSpesi, la nota non c e` (il reattivo tira B1)');
});
console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
