// @versione 2026-10-28.1 | test_novita_26ott.js | proprieta`: chat TEST
// 2026-10-28.1: motore 2026-10-28.1 e INTERFACCIA 28.1-28.2. RISCRITTE: E (la
//    Shock Mine esclusa sta nella ⓘ, vociInfo('step-weapon'), tipo nonpuo); O2
//    intera (niente piu` scelta BURST PIENO / B1: sceltaBurstAro tolta, sempre
//    al pieno, le voci del Burst nella ⓘ; via le prove del B1, da 13 a 10); P2 e
//    P3 (l HIDDEN non ha etichetta: il segnalino a 45 px fra le icone degli
//    stati); Q2 (la nota HIDDEN nella ⓘ; il tasto CAMO col div voce-con-icona).
// 2026-10-27.6 (motore 2026-10-27.9, roster_manager 2026-10-27.3): nuove Q
//   (M.opzioniSchieramento: i casi di MOTORE, Spektr [CAMO, HIDDEN], il Marker
//   senza skill, CAMO_1 acceso, Heckler F07, l'ordine delle sei voci, i 745
//   profili, mai acceso e spento insieme), Q2 (la pagina vera: Croc Man, il
//   tocco, Spector in AD fuori dall'Hub, il CAMO che arriva come segnalino, il
//   Moran col tiro d'Infiltrazione fallito e la voce spenta con F07) e Q3
//   (SCH-09 del piano, rev 48). Rotte sui file del giro 12: 9 rossi su 48;
//   col solo roster_manager di prima e il motore 27.9: 7 rossi.
// 2026-10-27.5 (motore 2026-10-27.5, catalogo 2026-10-27.1; app.html 2026-10-27.1):
//   nuove P (M.etichettaMarker «HIDDEN», M.segnalinoSenzaNumero per esercito,
//   nessun numero; controprove: NORMAL null, CAMO numerato invariato, l'HIDDEN
//   fuori da M.rosterPubblico), P2 (la riga nella propria app con l'icona e i
//   ripieghi, l'avversario, l'Hub e il server senza traccia; rivelato, sparisce)
//   e P3 (SCH-01 del piano, rev 47). Rotte sui file del giro 11: 14 rossi su 30.
//   tx() salta i '>' dentro gli attributi: il ripiego dell'icona mette una
//   <span> nell'onerror, e la vecchia regex tagliava li`.
// 2026-10-27.4 (motore 2026-10-27.4): GIRATO il DIFETTO APERTO di O e O2. Il
//   tetto degli usi vale anche per la scelta: a un uso pienoDisponibile 1 e
//   opzionale false, e la pagina dell'ARO non offre i due tasti; a zero usi
//   pienoDisponibile 0. Nessun difetto aperto in questo banco.
// 2026-10-27.3 (motore 2026-10-27.3, motore_core 2026-10-27.1, logica_aro
//   2026-10-27.1; REGOLE 27 ottobre): GIRATO il «DA CHIARIRE» di O: col Total
//   Reaction il (+1B) dell'arma vale in ARO, Panzerfaust (+1B) B2, e il pieno
//   e` opzionale. Nuova O2: l'«Atteso» al tavolo sulla pagina ARO vera
//   (BURST PIENO (B2) / B1, usi spesi 2 o 1, r.burstPieno, Hub; un uso; zero;
//   Reaktion Zond (Thunderbolt) B3; Fusilier senza Total Reaction B1).
//   DIFETTO APERTO nuovo, misurato com'e`: a UN uso residuo la scelta
//   «BURST PIENO (B2)» / «B1» c'e` lo stesso (pienoDisponibile 2,
//   opzionale), ma vale B1 in tutti e due i casi.
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
    // RISCRITTO il 28 ottobre (motore 2026-10-28.1): le escluse stanno nella ⓘ
    // (vociInfo('step-weapon'), titolo «<nome> non utilizzabile…», tipo
    // 'nonpuo', testo = motivo). Prima: la riga delle scartate a schermo.
    { const vs = N.vociInfo('step-weapon'), sm = vs.find(v => /^Shock Mine non utilizzabile/.test(v.titolo));
      ok(!!sm && sm.tipo === 'nonpuo' && sm.testo === 'si piazza con PIAZZARE EQUIPAGGIAMENTO, non si spara' && !/PIAZZARE EQUIPAGGIAMENTO, non si spara/.test(tx(w)),
         'ed e` fra le escluse della ⓘ, col motivo «si piazza con PIAZZARE EQUIPAGGIAMENTO, non si spara»', vs.map(v => v.titolo + ': ' + v.testo)); }
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
    // 🔴 GIRATA IL 27 OTTOBRE (REGOLE, motore 2026-10-27.3): col Total Reaction
    // il (+1B) dell ARMA vale anche in ARO (righe 10227-10228). Fino alla 27.2
    // il Panzerfaust (+1B) restava B1 («DA CHIARIRE»).
    const p1b = M.profiloArma('Panzerfaust (+1B)');
    const pieno = br(sal, p1b);
    ok(pieno.valore === 2 && pieno.voci.some(v => /^Panzerfaust \(\+1B\): \+1 Burst anche in ARO \(Total Reaction, righe 10227-10228\)$/.test(v.motivo)),
       'Total Reaction col Panzerfaust (+1B), usi pieni: B2, con la voce «Panzerfaust (+1B): +1 Burst anche in ARO (Total Reaction, righe 10227-10228)»', [pieno.valore, pieno.voci.map(v => v.motivo)]);
    ok(pieno.opzionale === true && pieno.pienoDisponibile === 2, '  il pieno e` opzionale: pienoDisponibile 2', [pieno.opzionale, pieno.pienoDisponibile]);
    const rid = M.burstReattivo(sal, p1b, { burstPieno: false });
    ok(rid.valore === 1 && rid.voci.some(v => /Total Reaction: scelto il Burst ridotto \(B1\) invece del pieno \(B2\)/.test(v.motivo)), '  burstPieno:false: B1, «scelto il Burst ridotto (B1) invece del pieno (B2)»', rid.voci.map(v => v.motivo));
    const pu1 = br(Object.assign({}, sal, { usiSpesi: { PANZERFAUST: 1 } }), p1b);
    ok(pu1.valore === 1 && pu1.note.some(n => /Burst limitato agli usi residui: 1 su 2/.test(n)), '  a un uso residuo: B1, «Burst limitato agli usi residui: 1 su 2»', [pu1.valore, pu1.note]);
    const pu0 = br(Object.assign({}, sal, { usiSpesi: { PANZERFAUST: 2 } }), p1b);
    ok(pu0.valore === 0 && pu0.note.some(n => /Panzerfaust: usi esauriti — la truppa è in stato Scarico/.test(n)), '  a zero usi: B0, con la nota dello Scarico', [pu0.valore, pu0.note.map(n => n.slice(0, 40))]);
    ok(M.usiDaConsumare(p1b, [2], 'BS_ATTACK') === 2 && M.usiDaConsumare(p1b, [1], 'BS_ATTACK') === 1, '  gli usi si contano sul Burst tirato: B2 = 2, B1 = 1');
    // 🔴 GIRATA IL 27 OTTOBRE (motore 2026-10-27.4): il tetto degli usi vale
    // anche per la scelta. Fino alla 27.3 a un uso pienoDisponibile restava 2 e
    // opzionale true, e la pagina offriva «BURST PIENO (B2)» che dava B1.
    ok(pu1.opzionale === false && pu1.pienoDisponibile === 1,
       'a un uso residuo pienoDisponibile 1 e opzionale false: nessuna scelta', [pu1.opzionale, pu1.pienoDisponibile]);
    ok(pu0.opzionale === false && pu0.pienoDisponibile === 0, '  a zero usi pienoDisponibile 0, opzionale false', [pu0.opzionale, pu0.pienoDisponibile]);
    ok(pieno.opzionale === true && br(Object.assign({}, sal, { usiSpesi: { PANZERFAUST: 1 } }), M.profiloArma('Combi Rifle(+1B)')).opzionale === true,
       'CONTROPROVA: a usi pieni la scelta resta, e un arma non Disposable (Combi (+1B)) con usiSpesi a caso resta opzionale');
    ok(br(sal, M.profiloArma('Combi Rifle(+1B)')).valore === 4, 'CONTROPROVA: Combi Rifle (+1B) col Total Reaction: B4');
    ok(br(Object.assign({}, sal, { skills: sal.skills + ', BS Attack (+1B)' }), M.profiloArma('Combi Rifle')).valore === 3, 'CONTROPROVA: Combi Rifle con l abilita` «BS Attack (+1B)»: B3, l abilita` in ARO non vale');
    ok(br(fus, M.profiloArma('Combi Rifle(+1B)')).valore === 1, 'CONTROPROVA: Fusilier senza Total Reaction, Combi Rifle (+1B): B1');
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

sezione('O2. Atteso al tavolo: Total Reaction col (+1B) sulla pagina ARO (sempre BURST PIENO)', () => {
    // RISCRITTA il 28 ottobre (logica_aro 2026-10-28.2, INTERFACCIA; Paolo il 27
    // sera, BS-16 B: «togli i tasti di selezione del burst»). Prima: due tasti,
    // «BURST PIENO (B2)» e «B1», con N.sceltaBurstAro(false) che riduceva a B1 e
    // spendeva un uso solo. Ora: nessun tasto, sceltaBurstAro non c e` piu`, e
    // la reazione e` sempre al pieno (burstPieno true). Le voci del Burst («+1
    // Burst anche in ARO», «limitato agli usi residui») stanno nella ⓘ.
    // Salyut (Total Reaction): un Panzerfaust (+1B) aggiunto al profilo (nessun
    // profilo vero li ha insieme). Reaktion Zond (Thunderbolt) e` il profilo vero.
    const giro = (arma, spesi, unitaRe) => {
        const T = creaTavolo(DIR); const N = T.nomadi.g, P = T.pano.g, H = T.hub.g;
        const r = tr(P_(T, unitaRe || /^Salyut \(Total Reaction, Repeater\)/), { id: 'n1', alias: 'Reag' });
        if (spesi) r.usiSpesi = spesi;
        if (!/^=/.test(arma)) r.weapon = String(r.weapon || '') + ', ' + arma;
        arma = arma.replace(/^=/, '');
        T.schiera([r], [FUS(T, 'p1', { alias: 'Spara' })], 'PANOCEANIA');
        const viste = []; const orh = T.hub.riceve;
        T.hub.riceve = (k, v) => { if (k === H.MotoreN5.CANALI.ARO_NOMADI && v) { const o = JSON.parse(v); (o.reazioni || []).forEach(x => viste.push({ u: x.usiSpesi, bp: x.burstPieno })); } return orh(k, v); };
        T.apriMenu(T.pano, 0); P.selectAction('ATTACCO BS', false); P.startUnitAllocationLoopBS(); P.declareAttackBS('Combi Rifle'); P.toggleTargetSelection('n1'); P.confirmMultiAro(false); T.giro();
        N.apriSelezioneAro(); N.toggleAroUnit('n1'); N.confermaSelezioneAro(); N.selezionaAzioneAro('BS_ATTACK');
        const nome = arma.replace(/\s*\(\+1B\)/, '').replace(/[()+]/g, '\\$&');
        const bt = bottoni(String(T.nomadi.el('aro-weapon-list').innerHTML)).find(b => new RegExp(nome).test(b)) || '';
        const oc = onclickDi(bt).replace(/&quot;/g, '"');
        const al0 = N.alert_.length;
        if (oc) vm.runInContext(oc, vm.createContext(N));
        N.selezionaBersaglioAro('Spara');
        const m1 = String(T.nomadi.el('aro-modifiers-content').innerHTML);
        const info = N.vociInfo('step-aro-modifiers').filter(v => v.titolo === 'Burst').map(v => v.testo).join(' | ');
        const cfg = JSON.parse(J(N.aroCurrentConfig));
        N.salvaAroCorrente(); T.giro();
        P.goToModifiersBS('IDLE'); P.eseguiCalcoloBS(); T.giro();
        const sc = (H.ultimiScontri || [])[0] || {};
        return { T, N, bt, oc, al: N.alert_.slice(al0), m1, info, tasti: /tasto-burst-pieno|tasto-burst-ridotto|scelta-burst-aro|sceltaBurstAro/.test(m1),
                 cfg, viste, burst: sc.reattivo && sc.reattivo.burst, usi: J(N.roster[0].usiSpesi || {}), t: tab(T) };
    };
    const a = giro('Panzerfaust (+1B)', null);
    ok(onclickDi(a.bt) === "window.selezionaArmaAro('Panzerfaust (+1B)', false)" && classe(a.bt) === 'bottone-arma',
       'nella lista dell ARO il bottone porta il nome grezzo: selezionaArmaAro(\'Panzerfaust (+1B)\', false)', onclickDi(a.bt));
    ok(!a.tasti && typeof a.N.sceltaBurstAro === 'undefined', 'dopo la scelta dell arma nessun tasto del Burst, e sceltaBurstAro non c e` piu`');
    ok(/Panzerfaust \(\+1B\): \+1 Burst anche in ARO \(Total Reaction, righe 10227-10228\)/.test(a.info) && !/\+1 Burst anche in ARO/.test(tx(a.m1)),
       '  e la voce «Panzerfaust (+1B): +1 Burst anche in ARO (Total Reaction…)» sta nella ⓘ («Burst»), non a schermo', a.info);
    ok(ris(a.T) && a.cfg.burst === 2 && a.cfg.burstPieno === true && a.viste[0].bp === true && a.burst === 2 && /Reag Azione: ATTACCO BS Successo al: \d+ \(o meno\) Dadi da lanciare: 2/.test(a.t),
       'sempre BURST PIENO: cfg B2 e burstPieno true, la risposta porta burstPieno:true, all Hub B2, sul tabellone «Dadi da lanciare: 2»', [a.cfg.burst, a.cfg.burstPieno, a.viste, a.burst, (a.t.match(/Reag Azione.{0,60}/) || [])[0]]);
    ok(a.usi === '{"PANZERFAUST":2}', '  e gli usi spesi dopo l ARO: {PANZERFAUST: 2}', a.usi);
    const c = giro('Panzerfaust (+1B)', { PANZERFAUST: 1 });
    ok(ris(c.T) && c.cfg.burst === 1 && c.burst === 1 && /Burst limitato agli usi residui: 1 su 2/.test(c.info) && c.usi === '{"PANZERFAUST":2}',
       'a un uso residuo: B1 sulla pagina e all Hub, «Burst limitato agli usi residui: 1 su 2» nella ⓘ, poi {PANZERFAUST: 2}', [c.cfg.burst, c.burst, c.info, c.usi]);
    ok(!c.tasti && c.viste[0].bp === undefined,
       'a un uso residuo nessun tasto del Burst, e la risposta non porta burstPieno', [c.tasti, c.viste]);
    const z = giro('Panzerfaust (+1B)', { PANZERFAUST: 2 });
    ok(classe(z.bt) === 'bottone-arma bottone-arma-esaurito' && z.al.some(m => /Panzerfaust: usi esauriti — la truppa è in stato Scarico\. Si toglie con Reload/.test(m)) && !z.tasti,
       'a zero usi: il bottone e` spento e al tocco dice «Panzerfaust: usi esauriti — … Scarico. Si toglie con Reload…»; niente tasti del Burst', [classe(z.bt), z.al.map(m => m.slice(0, 40))]);
    const tb = giro('=Thunderbolt(+1B)', null, /^Reaktion Zond \(Thunderbolt\)$/);
    ok(ris(tb.T) && !tb.tasti && tb.cfg.burstPieno === true && tb.burst === 3 && /Dadi da lanciare: 3/.test(tb.t),
       'il profilo vero, Reaktion Zond (Thunderbolt): sempre al pieno, all Hub B3', [tb.cfg.burstPieno, tb.burst]);
    const f = giro('Panzerfaust (+1B)', null, /^Fusilier \(Combi/);
    ok(ris(f.T) && !f.tasti && f.cfg.burst === 1 && f.cfg.burstPieno === undefined && f.burst === 1 && f.usi === '{"PANZERFAUST":1}',
       'CONTROPROVA: un Fusilier senza Total Reaction col Panzerfaust (+1B): B1, niente burstPieno, un uso', [f.cfg.burstPieno, f.burst, f.usi]);
});
// ---------------------------------------------------------------------------
//  27 ottobre, sera (motore 2026-10-27.5, catalogo 2026-10-27.1; app.html
//  2026-10-27.1): l'Hidden Deployment nella PROPRIA app, etichetta e icona.
// ---------------------------------------------------------------------------
sezione('P. Hidden Deployment: «HIDDEN» e l icona nella propria app (motore)', () => {
    const T = creaTavolo(DIR); const M = T.nomadi.g.MotoreN5;
    const spe = (a) => tr(P_(T, /^Spektr \(MULTI Sniper/), Object.assign({ id: 'n1', alias: 'Ombra' }, a || {}));
    ok(typeof M.segnalinoSenzaNumero === 'function', 'premessa: il motore ha M.segnalinoSenzaNumero');
    ok(M.etichettaMarker({ deployState: 'HIDDEN' }) === 'HIDDEN', 'M.etichettaMarker({ deployState: HIDDEN }) = «HIDDEN»', M.etichettaMarker({ deployState: 'HIDDEN' }));
    const nas = spe({ deployState: 'HIDDEN', states: { hidden: true } });
    ok(M.etichettaMarker(nas) === 'HIDDEN', 'lo stesso su uno Spektr vero del database, in HIDDEN', M.etichettaMarker(nas));
    const sn = (typeof M.segnalinoSenzaNumero === 'function' ? M.segnalinoSenzaNumero : () => null)(nas, 'NOMADI') || {};
    ok(sn.immagine === 'img/nomadi/icon_hidden.png' && sn.immagineComune === 'img/icon_hidden.png' && sn.tipo === 'HIDDEN' && sn.etichetta === 'HIDDEN',
       'M.segnalinoSenzaNumero(u, NOMADI): img/nomadi/icon_hidden.png, la comune img/icon_hidden.png, tipo ed etichetta HIDDEN', sn);
    const snP = (typeof M.segnalinoSenzaNumero === 'function' ? M.segnalinoSenzaNumero : () => null)(nas, 'PANOCEANIA') || {};
    ok(snP.immagine === 'img/panoceania/icon_hidden.png', '  con PANOCEANIA la cartella di PanOceania', snP.immagine);
    const C = ((T.nomadi.g.CATALOGO_N5 || {}).SCHIERAMENTO || {}).segnaliniSenzaNumero || {};
    ok(J(Object.keys(C)) === '["HIDDEN"]' && (C.HIDDEN || {}).file === 'img/icon_hidden.png', 'nel catalogo: segnaliniSenzaNumero ha il solo HIDDEN, file img/icon_hidden.png', C);
    M.numeraMarker([nas]);
    ok(nas.numeroMarker === undefined && nas.tipoNumeroMarker === undefined, 'e l HIDDEN non prende un numero: non c e niente da distinguere al tavolo', [nas.numeroMarker, nas.tipoNumeroMarker]);
    // CONTROPROVE
    const vis = spe();
    ok(M.etichettaMarker(vis) === null && (typeof M.segnalinoSenzaNumero !== 'function' || M.segnalinoSenzaNumero(vis, 'NOMADI') === null), 'CONTROPROVA: lo Spektr a vista (NORMAL): etichetta null, nessun segnalino');
    const cam = spe({ id: 'n2', deployState: 'CAMO', states: { camo: true } }); M.numeraMarker([cam]);
    ok(M.etichettaMarker(cam) === 'CAMO-6 1' && (typeof M.segnalinoSenzaNumero !== 'function' || M.segnalinoSenzaNumero(cam, 'NOMADI') === null), 'CONTROPROVA: lo stesso Spektr in CAMO ha ancora il numero, «CAMO-6 1», e nessun segnalino senza numero', M.etichettaMarker(cam));
    const croc = tr(T.profilo(T.pano, /^Croc Man \(Boarding/), { id: 'p9', deployState: 'CAMO', states: { camo: true } });
    ok(M.etichettaMarker({ deployState: 'CAMO', states: { camo: true }, tipoNumeroMarker: 'CAMO', numeroMarker: 1, skills: 'Camouflage' }) === 'CAMO 1', 'CONTROPROVA: un CAMO numerato senza Mimetismo resta «CAMO 1»');
    ok(!/HIDDEN/.test(String(M.etichettaMarker(croc))), '  e un Croc Man in CAMO non dice HIDDEN', M.etichettaMarker(croc));
    const pub = M.rosterPubblico([nas, vis]);
    ok(pub.length === 1 && pub[0].id === 'n1' && !/HIDDEN|icon_hidden/.test(J(pub)), 'CONTROPROVA: M.rosterPubblico([HIDDEN, a vista]) ha la sola truppa a vista, e nessuna traccia di HIDDEN', pub.map(u => u.id + ':' + u.deployState));
    ok(J(M.rosterPubblico([nas])) === '[]', '  il solo HIDDEN: roster pubblico vuoto');
    const solo = { deployState: 'NORMAL', states: { hidden: true } };
    ok(M.etichettaMarker(solo) === null, 'misura: il nascondimento solo negli stati (deployState NORMAL) non porta l etichetta, e` deployState a deciderla', M.etichettaMarker(solo));
});

sezione('P2. Hidden Deployment al tavolo: la riga nella propria app, l Hub e l avversario non la vedono', () => {
    const T = tavolo(T => [tr(P_(T, /^Spektr \(MULTI Sniper/), { id: 'n1', alias: 'Ombra', deployState: 'HIDDEN', states: { hidden: true } }),
                           tr(P_(T, /^Alguacil \(Combi/), { id: 'n2', alias: 'Vista' })],
                     T => [tr(T.profilo(T.pano, /^Croc Man \(MULTI Sniper/), { id: 'p6', alias: 'Coccodrillo', deployState: 'HIDDEN', states: { hidden: true } }),
                           FUS(T, 'p1')], 'NOMADI');
    const N = T.nomadi.g, P = T.pano.g, H = T.hub.g;
    const righe = (d) => { d.g.currentGroup = 1; d.g.aggiornaGraficaRoster(); return String(d.el('unit-buttons-container').innerHTML); };
    // RISCRITTE il 28 ottobre (app.html e roster_manager 2026-10-28.1,
    // INTERFACCIA; Paolo il 27 sera: «togli la scritta HIDDEN e metti il token
    // in grande a destra come gli altri»). Prima: una etichetta-marker «HIDDEN»
    // con l icona piccola, fra il nome e il soprannome. Ora: nessuna scritta,
    // il segnalino a 45 px fra le icone degli stati (rup-icone).
    const hN = righe(T.nomadi);
    const righeDi = (h) => String(h).split(/(?=<button)/).filter(r => /riga-unita/.test(r));
    const iconeDi = (r) => (String(r).match(/<div class="rup-icone[^"]*">([\s\S]*?)<\/div>/) || ['', ''])[1];
    const rN = righeDi(hN), rSpk = rN.find(r => /Spektr/.test(r)) || '', rAlg = rN.find(r => /Alguacil/.test(r)) || '';
    ok(!/etichetta-marker/.test(hN) && !/>HIDDEN</.test(hN) && !/HIDDEN/.test(tx(hN)), 'nell app dei Nomads: nessuna etichetta, nessuna scritta HIDDEN', tx(hN).slice(0, 120));
    ok(/<img class="icona-segnalino-hidden" src="img\/nomadi\/icon_hidden\.png"[\s\S]*?alt="HIDDEN" style="width:45px; height:45px;/.test(iconeDi(rSpk)),
       '  il segnalino della cartella dei Nomads, 45 px, fra le icone degli stati della riga dello Spektr', iconeDi(rSpk).slice(0, 160));
    ok(/data-rip="img\/icon_hidden\.png"/.test(iconeDi(rSpk)) && /🫥/.test(iconeDi(rSpk)), '  e i ripieghi: la copia comune img/icon_hidden.png, poi l emoji 🫥', iconeDi(rSpk).slice(0, 260));
    ok(!/icona-segnalino-hidden/.test(rAlg) && rN.indexOf(rSpk) < rN.indexOf(rAlg), 'sulla riga dello Spektr, non su quella dell Alguacil (che viene dopo)', rN.map(r => tx(r).slice(0, 30)));
    const hP = righe(T.pano);
    ok(/<img class="icona-segnalino-hidden" src="img\/panoceania\/icon_hidden\.png"/.test(hP) && !/etichetta-marker/.test(hP),
       'nell app di PanOceania il suo Croc Man nascosto: il segnalino dalla cartella di PanOceania, nessuna etichetta', (hP.match(/icona-segnalino-hidden" src="[^"]+"/) || [])[0]);
    // L'avversario e l'Hub.
    const nem = P.MotoreN5.rosterNemico();
    ok(J(nem.map(u => u.id)) === '["n2"]' && !/Ombra|Spektr|HIDDEN/.test(J(nem)), 'l app di PanOceania vede il solo Alguacil: dello Spektr nessuna traccia', nem.map(u => u.id));
    const hub = (H.gameState.nomads || []);
    ok(J(hub.map(u => u.id)) === '["n2"]' && !(H.gameState.panoceania || []).some(u => u.id === 'p6'), 'l Hub non riceve ne lo Spektr ne il Croc Man nascosti', [hub.map(u => u.id), (H.gameState.panoceania || []).map(u => u.id)]);
    const sporco = Object.keys(T.server).filter(k => /Ombra|Coccodrillo|icon_hidden/.test(String(T.server[k])));
    ok(sporco.length === 0, 'e su nessun canale del server compaiono il soprannome o l icona dell HIDDEN', sporco);
    const htmlHub = Object.keys(T.hub.elementi).map(k => T.hub.elementi[k].innerHTML).join(' ');
    ok(!/Ombra|Coccodrillo|icon_hidden/.test(htmlHub), 'e nelle pagine dell Hub nemmeno');
    const htmlP = Object.keys(T.pano.elementi).map(k => T.pano.elementi[k].innerHTML).join(' ');
    ok(!/Ombra|icona-segnalino-hidden" src="img\/nomadi/.test(htmlP), 'e nelle pagine di PanOceania lo Spektr non c e');
    // CONTROPROVA: rivelato, l'etichetta sparisce e l'Hub lo vede.
    const u = N.roster.find(x => x.id === 'n1'); u.deployState = 'NORMAL'; u.states = {};
    N.inviaSchieramentoAllHub('NOMADI', { roster: N.roster, strutture: [], terreni: [], motivo: 'AGGIORNAMENTO' }); T.giro();
    const hN2 = righe(T.nomadi);
    ok(!/etichetta-marker/.test(hN2) && !/icona-segnalino-hidden/.test(hN2) && /Ombra/.test(tx(hN2)), 'CONTROPROVA: lo Spektr rivelato (NORMAL): nessuna etichetta, nessuna icona', tx(hN2).slice(0, 120));
    ok((H.gameState.nomads || []).some(x => x.id === 'n1') && P.MotoreN5.rosterNemico().some(x => x.id === 'n1'), '  e l Hub e PanOceania lo ricevono');
});
sezione('P3. SCH-01 del piano (rev 47): l Atteso sulle due app', () => {
    const T = tavolo(T => [tr(P_(T, /^Alguacil \(Combi/), { id: 'n1', alias: 'Alg' })],
                     T => [tr(T.profilo(T.pano, /^Croc Man \(MULTI Sniper/), { id: 'p6', alias: 'Croc', deployState: 'HIDDEN', states: { hidden: true } }),
                           FUS(T, 'p1', { alias: 'Fus' }),
                           tr(T.profilo(T.pano, /^Zulu-Cobra \(Triangulated Fire, Sensor\)/), { id: 'p10', alias: 'Zulu', deployState: 'CAMO', states: { camo: true } }),
                           tr(T.profilo(T.pano, /^Fusilier \(Missile/), { id: 'p2', alias: 'Ris', deployState: 'RESERVE', states: { reserve: true } })], 'NOMADI');
    const P = T.pano.g; P.currentGroup = 1; P.aggiornaGraficaRoster();
    const h = String(T.pano.el('unit-buttons-container').innerHTML);
    // RISCRITTE il 28 ottobre (INTERFACCIA 28.1): l HIDDEN non ha piu` etichetta;
    // il suo segnalino sta fra le icone degli stati della riga del Croc Man.
    const etich = (h.match(/<span class="etichetta-marker"[^>]*>(?:<(?:[^>"']|"[^"]*"|'[^']*')*>)*[^<]*<\/span>/g) || []).map(e => tx(e));
    ok(J(etich) === '["CAMO-3 1"]', 'app di PanOceania: una sola etichetta, «CAMO-3 1» (Zulu-Cobra); il Croc Man in HIDDEN non ne ha', etich);
    ok((h.match(/icona-segnalino-hidden" src="img\/panoceania\/icon_hidden\.png"/g) || []).length === 1, '  una sola icona HIDDEN, dalla cartella di PanOceania');
    const rC = String(h).split(/(?=<button)/).find(r => /riga-unita/.test(r) && /Croc Man/.test(r)) || '';
    ok(/<div class="rup-icone[^"]*"><img class="icona-segnalino-hidden"/.test(rC) && !/HIDDEN/.test(tx(rC)), '  fra le icone degli stati della riga del Croc Man, senza scritta', tx(rC).slice(0, 80));
    const nem = T.nomadi.g.MotoreN5.rosterNemico();
    ok(!nem.some(u => u.id === 'p6') && !/Croc|HIDDEN|icon_hidden/.test(J(nem)) && !(T.hub.g.gameState.panoceania || []).some(u => u.id === 'p6'),
       'l app nomade e l Hub: il Croc Man non c e, e nemmeno la sua etichetta', nem.map(u => u.id));
});

// ---------------------------------------------------------------------------
// Q: M.opzioniSchieramento esteso (MOTORE 2026-10-27.9). Le voci oltre NORMALE.
const opz = (M, u) => M.opzioniSchieramento(u).map(v => v.stato);
// Le scelte di stato della pagina dello schieramento: NORMALE e le voci del
// motore (data-stato). I tasti dei piazzabili, sotto, non sono stati.
const vociStato = (d) => [...String(d.el('deploy-states-content').innerHTML).matchAll(/<button class="huge-btn tasto-opzione( opzione-schieramento)?( attivo)?"(?: data-stato="([A-Z0-9_]+)")?( disabled)?(?: onclick="([^"]*)")?>([\s\S]*?)<\/button>/g)]
    .map(x => ({ stato: x[3] || 'NORMAL', acceso: !!x[2], spento: !!x[4], clic: x[5] || '', testo: tx(x[6]), html: x[6] }))
    .filter(v => v.stato !== 'NORMAL' || /setDeployState\(\d+, 'NORMAL'\)/.test(v.clic));
sezione('Q. M.opzioniSchieramento: tutte le scelte oltre NORMALE, decise dal motore', () => {
    const T = creaTavolo(DIR); const M = T.nomadi.g.MotoreN5;
    ok(typeof M.opzioniSchieramento === 'function', 'premessa: il motore ha M.opzioniSchieramento');
    const tutti = [].concat(T.nomadi.g.DB_NOMADI, T.nomadi.g.DB_PANOCEANIA);
    const pr = (re) => tr(T.profilo(T.nomadi, re), { id: 'x' });
    // I casi di MOTORE, uno per uno.
    [[/^Spector \(Parachutist, Combat Jump\)/, '["AD"]'], [/^Bashi Bazouk/, '["AD"]'], [/^Hellcat/, '["AD"]'],
     [/^Spektr \(MULTI Sniper/, '["CAMO","HIDDEN"]'], [/^Croc Man \(MULTI Sniper/, '["CAMO","HIDDEN"]'],
     [/^Moran \(Surprise Attack/, '["CAMO"]'], [/^Intruder \(HMG/, '["CAMO"]'], [/^Alguacil \(Combi/, '[]']].forEach(function (c) {
        const u = pr(c[0]);
        ok(J(opz(M, u)) === c[1], u.nome + ': ' + c[1], opz(M, u));
    });
    const spec = M.opzioniSchieramento(pr(/^Spector \(Parachutist, Combat Jump\)/))[0] || {};
    ok(spec.etichetta === 'SCHIERAMENTO AEREO' && spec.disponibile === true && spec.acceso === false && /INGRESSO IN CAMPO/.test(spec.nota) && !/[<>]/.test(spec.nota),
       'Spector: «SCHIERAMENTO AEREO», disponibile, spento, la nota dice INGRESSO IN CAMPO ed e` testo semplice', spec);
    ok(J(Object.keys(spec).sort()) === J(['acceso', 'disponibile', 'etichetta', 'nota', 'stato']), '  ogni voce ha i cinque campi: stato, etichetta, nota, disponibile, acceso', Object.keys(spec));
    const spk = M.opzioniSchieramento(pr(/^Spektr \(MULTI Sniper/));
    ok(J(spk.map(v => v.etichetta)) === J(['SEGNALINO CAMO (-6)', 'HIDDEN DEPLOYMENT']), 'Spektr: «SEGNALINO CAMO (-6)» e «HIDDEN DEPLOYMENT», in quest ordine (correzione di MOTORE: prima [HIDDEN] solo)', spk.map(v => v.etichetta));
    ok(M.opzioniSchieramento(pr(/^Moran \(Surprise Attack/))[0].etichetta === 'SEGNALINO CAMO (-3)', 'Moran: il MOD del Mimetismo nell etichetta, «SEGNALINO CAMO (-3)»');
    const mk = M.opzioniSchieramento({ tipo: 'MARKER', skills: '' });
    ok(J(mk.map(v => [v.stato, v.etichetta, v.disponibile])) === J([['CAMO', 'SEGNALINO CAMO', true]]), 'il Marker delle liste vecchie (tipo MARKER, senza skill): [CAMO], «SEGNALINO CAMO», senza MOD', mk);
    // acceso, anche coi deployState vecchi.
    const croc = Object.assign(pr(/^Croc Man \(MULTI Sniper/), { deployState: 'CAMO_1' });
    const vc = M.opzioniSchieramento(croc);
    ok(vc[0].stato === 'CAMO' && vc[0].etichetta === 'SEGNALINO CAMO (-6)' && vc[0].acceso === true && vc[1].stato === 'HIDDEN' && vc[1].acceso === false && vc[1].disponibile === true,
       'Croc Man con deployState CAMO_1: CAMO «SEGNALINO CAMO (-6)» acceso, HIDDEN spento e disponibile', vc.map(v => [v.stato, v.acceso, v.disponibile]));
    croc.deployState = 'HIDDEN';
    ok(J(M.opzioniSchieramento(croc).map(v => v.acceso)) === '[false,true]', '  e in HIDDEN il contrario: CAMO spento, HIDDEN acceso');
    // Camouflage (1 Use) consumato: F07.
    const hk = Object.assign(pr(/^Heckler \(Boarding/), { camoUsato: true });
    const h1 = M.opzioniSchieramento(hk)[0] || {};
    ok(h1.stato === 'CAMO' && h1.disponibile === false && h1.acceso === false && /F07/.test(h1.nota) && !/[<>]/.test(h1.nota), 'Heckler (Camouflage 1 Use) col CAMO gia` usato, NORMAL: CAMO non disponibile, spento, la nota cita F07', h1);
    hk.deployState = 'CAMO';
    const h2 = M.opzioniSchieramento(hk)[0] || {};
    ok(h2.disponibile === true && h2.acceso === true && h2.nota === '', '  lo stesso in CAMO: disponibile e acceso, nota vuota («una voce accesa non e` mai spenta»)', h2);
    ok(M.opzioniSchieramento(Object.assign(pr(/^Heckler \(Boarding/), { camoUsato: false }))[0].disponibile === true, 'CONTROPROVA: lo Heckler col CAMO ancora da usare: disponibile');
    // L'ordine delle sei voci su una truppa di prova che le ha tutte.
    const tutte = { tipo: 'LI', skills: 'Camouflage, Impersonation-2, Sapper, Transmutation (Hatching), Parachutist, Hidden Deployment', equip: '', states: {}, deployState: 'NORMAL' };
    ok(J(opz(M, tutte)) === J(['CAMO', 'IMP_2', 'FOXHOLE', 'SEED', 'AD', 'HIDDEN']), 'l ordine: CAMO, IMP, FOXHOLE, SEED, AD, HIDDEN', opz(M, tutte));
    ok(J(opz(M, { skills: 'Impersonation-1' })) === '["IMP_1"]' && J(opz(M, { skills: 'Impersonation-2' })) === '["IMP_2"]', 'Impersonation-1 da` IMP_1, Impersonation-2 IMP_2');
    ok(M.opzioniSchieramento(Object.assign({}, tutte, { deployState: 'IMP_2' })).filter(v => v.acceso).map(v => v.stato).join() === 'IMP_2', 'deployState IMP_2: accesa la sola voce IMP');
    // Su tutti i profili dei due database.
    const schedeOk = [], diverse = [], accesoSpento = [];
    const deps = ['NORMAL', 'CAMO', 'CAMO_3', 'AD', 'HIDDEN'];
    tutti.forEach(function (p) {
        const s = (String(p.skills || '') + ',' + String(p.equip || '')).toUpperCase();
        const att = [];
        if (/CAMOUFLAGE/.test(s) || p.tipo === 'MARKER') att.push('CAMO');
        if (/PARACHUTIST|COMBAT JUMP|AIRBORNE DEPLOYMENT|AD:/.test(s)) att.push('AD');
        if (/HIDDEN DEPLOYMENT/.test(s)) att.push('HIDDEN');
        const u = tr(p, { id: 'x' });
        if (J(opz(M, u)) !== J(att)) diverse.push(p.nome);
        deps.forEach(function (d) {
            M.opzioniSchieramento(Object.assign({}, u, { deployState: d, camoUsato: true })).forEach(function (v) {
                if (v.acceso && !v.disponibile) accesoSpento.push(p.nome + ' ' + d);
                const giusto = (v.stato === 'CAMO') ? d.indexOf('CAMO') === 0 : d === v.stato;
                if (v.acceso !== giusto || typeof v.nota !== 'string' || /[<>]/.test(v.nota)) schedeOk.push(p.nome + ' ' + d + ' ' + v.stato);
            });
        });
    });
    ok(tutti.length > 700 && diverse.length === 0, 'su ' + tutti.length + ' profili: la voce c e esattamente per chi ha Camouflage (o e` MARKER), Parachutist / Combat Jump / AD, Hidden Deployment (' + diverse.length + ' diversi)', diverse.slice(0, 5));
    ok(accesoSpento.length === 0, '  con camoUsato e cinque deployState: nessuna voce accesa e spenta insieme', accesoSpento.slice(0, 5));
    ok(schedeOk.length === 0, '  acceso solo sullo stato attuale (CAMO anche per CAMO_x), la nota sempre testo semplice', schedeOk.slice(0, 5));
    // Misura: niente unita`.
    let vuota; try { vuota = J(M.opzioniSchieramento(null)); } catch (e) { vuota = 'eccezione: ' + e.message; }
    ok(vuota === '[]', 'misura: M.opzioniSchieramento(null) = []', vuota);
});

sezione('Q2. Gli stati di schieramento sulla pagina vera, fino all Hub (roster_manager 27.3)', () => {
    const T = creaTavolo(DIR); const N = T.nomadi.g, P = T.pano.g, H = T.hub.g;
    const voci = vociStato;
    const apri = (d, i) => { d.g.apriSchieramento(); d.g.apriGruppoDeploy(1); d.g.apriDeployStati(i); return voci(d); };
    // PanOceania: il Croc Man (#6 del piano) e un Fusilier.
    P.roster = [tr(T.profilo(T.pano, /^Croc Man \(MULTI Sniper/), { id: 'p6', alias: 'Croc' }), FUS(T, 'p1')];
    N.roster = [tr(P_(T, /^Spector \(Parachutist, Combat Jump\)/), { id: 'n29', alias: 'Spec' }), tr(P_(T, /^Alguacil \(Combi/), { id: 'n1', alias: 'Alg' })];
    let v = apri(T.pano, 0);
    ok(J(v.map(x => x.stato)) === J(['NORMAL', 'CAMO', 'HIDDEN']) && J(v.map(x => x.testo)) === J(['NORMALE', 'SEGNALINO CAMO (-6)', 'HIDDEN DEPLOYMENT']),
       'Croc Man: NORMALE, SEGNALINO CAMO (-6), HIDDEN DEPLOYMENT, in quest ordine', v.map(x => x.testo));
    ok(v[0].acceso && !v[1].acceso && !v[2].acceso, '  NORMALE acceso (lo stato attuale), le altre no');
    ok(/<img class="icona-segnalino-hidden" [^>]*src="img\/panoceania\/icon_hidden\.png"/.test(v[2].html), '  HIDDEN con l icona della cartella di PanOceania', v[2].html.slice(0, 120));
    const notaH = (P.MotoreN5.opzioniSchieramento(P.roster[0]).find(x => x.stato === 'HIDDEN') || {}).nota;
    // RISCRITTO il 28 ottobre (roster_manager 2026-10-28.1, INTERFACCIA): la nota di
    // una voce accesa va nella ⓘ della pagina, non sotto il tasto (resta sotto solo
    // per una voce spenta). Prima: <div class="nota-opzione"> sotto HIDDEN.
    ok(!!notaH && P.vociInfo('step-deploy-states').some(x => x.testo === notaH && x.titolo === 'HIDDEN DEPLOYMENT') && String(T.pano.el('deploy-states-content').innerHTML).indexOf(notaH) < 0,
       '  la nota del motore sta nella ⓘ (titolo HIDDEN DEPLOYMENT, il suo tasto), non sotto il tasto');
    // Il tocco vero su CAMO, poi la riapertura.
    vm.runInContext(v[1].clic, T.pano.g);
    ok(P.roster[0].deployState === 'CAMO' && P.roster[0].states.camo === true, 'toccato SEGNALINO CAMO (-6): deployState CAMO, states.camo', [P.roster[0].deployState, P.roster[0].states]);
    v = apri(T.pano, 0);
    ok(J(v.map(x => x.acceso)) === '[false,true,false]', '  riaperta la pagina: accesa la voce CAMO, NORMALE no', v.map(x => x.acceso));
    // I Nomadi: lo Spector in Schieramento Aereo, l'Alguacil solo NORMALE.
    let w = apri(T.nomadi, 0);
    ok(J(w.map(x => x.testo)) === J(['NORMALE', 'SCHIERAMENTO AEREO']), 'Spector: NORMALE e SCHIERAMENTO AEREO', w.map(x => x.testo));
    vm.runInContext(w[1].clic, T.nomadi.g);
    ok(N.roster[0].deployState === 'AD', '  toccato: deployState AD', N.roster[0].deployState);
    ok(J(apri(T.nomadi, 1).map(x => x.stato)) === '["NORMAL"]', 'CONTROPROVA: l Alguacil ha solo NORMALE');
    // Conferma dei due schieramenti, e cosa arriva all'Hub e all'avversario.
    P.confermaSchieramento(); N.confermaSchieramento(); T.giro();
    const hN = (H.gameState.nomads || []).map(u => u.id), hP = (H.gameState.panoceania || []);
    ok(J(hN) === '["n1"]' && !P.MotoreN5.rosterNemico().some(u => u.id === 'n29'), 'all Hub e a PanOceania lo Spector non arriva (fuori dal tavolo), l Alguacil si`', hN);
    const crocHub = hP.find(u => u.id === 'p6') || {};
    ok(crocHub.nome === 'MARKER' && !/Croc Man|MULTI Sniper/.test(J(crocHub)), 'il Croc Man in CAMO arriva all Hub come MARKER, senza nome ne` armi', [crocHub.nome, crocHub.alias]);
    const visto = N.MotoreN5.rosterNemico().find(u => u.id === 'p6') || {};
    ok(/SEGNALINO MIMETICO \(-6\) 1/.test(String(visto.alias)) && !/Croc/.test(J(visto)), '  e l app dei Nomadi lo vede «SEGNALINO MIMETICO (-6) 1»', visto.alias);
    // Il Moran: tiro di Infiltrazione fallito, poi fuori dal CAMO.
    const T2 = creaTavolo(DIR); const N2 = T2.nomadi.g;
    N2.roster = [tr(P_(T2, /^Moran \(Surprise Attack/), { id: 'n19', alias: 'Moran', deployState: 'CAMO', states: { camo: true } })];
    N2.confirm = () => true;
    N2.apriSchieramento(); N2.apriGruppoDeploy(1); N2.apriDeployStati(0);
    const pagM = String(T2.nomadi.el('deploy-states-content').innerHTML);
    // RISCRITTO il 28 ottobre: il tasto CAMO ha dentro il div voce-con-icona col
    // segnalino (prima solo testo, [^<]*). Si guarda che fra il tasto CAMO e
    // quello del tiro fallito non ci siano altri tasti.
    const tiro = (pagM.match(/data-stato="CAMO"(?:(?!<button)[\s\S])*?<\/button>\s*<button class="tasto-uscita"[^>]*onclick="(window\.infiltrazioneFallita\(0\))"/) || [])[1];
    ok(!!tiro, 'Moran in CAMO: sotto la voce CAMO il tasto TIRO DI INFILTRAZIONE FALLITO');
    if (tiro) vm.runInContext(tiro, T2.nomadi.g);
    ok(N2.roster[0].camoUsato === true && N2.roster[0].deployState === 'CAMO', '  toccato e confermato: camoUsato, e la truppa resta in CAMO', [N2.roster[0].camoUsato, N2.roster[0].deployState]);
    let m = voci(T2.nomadi);
    const camoM = m.find(x => x.stato === 'CAMO') || {};
    ok(camoM.acceso && !camoM.spento && !/infiltrazioneFallita/.test(String(T2.nomadi.el('deploy-states-content').innerHTML)), '  la voce CAMO resta accesa e toccabile, il tasto del tiro non c e piu`', camoM);
    vm.runInContext((m.find(x => x.stato === 'NORMAL') || {}).clic || 'void 0', T2.nomadi.g);
    N2.apriDeployStati(0); m = voci(T2.nomadi);
    const camoM2 = m.find(x => x.stato === 'CAMO') || {};
    const notaF07 = (N2.MotoreN5.opzioniSchieramento(N2.roster[0])[0] || {}).nota;
    ok(N2.roster[0].deployState === 'NORMAL' && camoM2.spento && !camoM2.acceso && !camoM2.clic && /F07/.test(notaF07) &&
       String(T2.nomadi.el('deploy-states-content').innerHTML).indexOf('<div class="nota-opzione">' + notaF07 + '</div>') >= 0,
       'tornato NORMALE: la voce CAMO e` spenta (disabled, nessun tocco), con la nota F07 del motore', camoM2);
});

sezione('Q3. SCH-09 del piano (rev 48): l Atteso', () => {
    const T = creaTavolo(DIR); const N = T.nomadi.g, P = T.pano.g;
    const testi = (d, i) => { d.g.apriSchieramento(); d.g.apriGruppoDeploy(1); d.g.apriDeployStati(i); return vociStato(d).map(v => v.testo); };
    P.roster = [tr(T.profilo(T.pano, /^Croc Man \(MULTI Sniper/), { id: 'p6' })];
    N.roster = [tr(P_(T, /^Alguacil \(Combi/), { id: 'n1' }), tr(P_(T, /^Zero \(Hacker, Killer/), { id: 'n9' })];
    ['Spector (Parachutist, Combat Jump)', 'Moran (Surprise Attack [-3], Camouflage [1 Use], Combi Rifle)'].forEach(n => N.roster.push(tr(P_(T, new RegExp('^' + n.replace(/[()[\]]/g, '\\$&') + '$')), { id: n })));
    ok(J(testi(T.pano, 0)) === J(['NORMALE', 'SEGNALINO CAMO (-6)', 'HIDDEN DEPLOYMENT']), 'Croc Man (#6): NORMALE, SEGNALINO CAMO (-6), HIDDEN DEPLOYMENT', testi(T.pano, 0));
    ok(J(testi(T.nomadi, 0)) === '["NORMALE"]', 'Alguacil (#1): solo NORMALE', testi(T.nomadi, 0));
    ok(J(testi(T.nomadi, 1)) === J(['NORMALE', 'SEGNALINO CAMO (-3)']), 'Zero (#9): NORMALE, SEGNALINO CAMO (-3)', testi(T.nomadi, 1));
    ok(J(testi(T.nomadi, 2)) === J(['NORMALE', 'SCHIERAMENTO AEREO']), 'Spector (#29): NORMALE, SCHIERAMENTO AEREO', testi(T.nomadi, 2));
    ok(J(testi(T.nomadi, 3)) === J(['NORMALE', 'SEGNALINO CAMO (-3)']), 'Moran (#19): NORMALE, SEGNALINO CAMO (-3)', testi(T.nomadi, 3));
    ok(!/RISERVA/.test(String(T.nomadi.el('deploy-states-content').innerHTML)), '  e da nessuna parte la vecchia «RISERVA / AD»');
});
console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
