// @versione 2026-10-27.1 | test_novita_23ott.js | proprieta`: chat TEST
// 2026-10-27.1: tx() salta i '>' dentro gli attributi (sez. 8). Da logica_aro 27.2
//    l'etichetta NASCOSTO ha l'icona, e il suo ripiego mette una <span> dentro
//    l'onerror: la vecchia regex chiudeva il tag li` e la scritta usciva sporca.
// 2026-10-26.1: sez. 14, la partenza del Burst e` a giro (DIS-05, ordine_attacco_bs
//    2026-10-26.2): il helper porta i dadi nei due versi, e una prova nuova sulla partenza.
// 2026-10-23.5: sez. 9 e 12 girate (motore 2026-10-23.8, ordine_attacco_bs 2026-10-23.4):
//    nel Coordinato il secondo tocco sostituisce il primo e l'allarme nomina un bersaglio
//    solo; l'Idle del partecipante e` A110 (nota), niente finestra ne` UI01.
// 2026-10-23.4: sez. 8-14, le correzioni del pomeriggio (motore 2026-10-23.7, motore_core
//    2026-10-23.1, ordine_attacco_bs 2026-10-23.3; logica_aro e app.html 2026-10-23.2):
//    Sorpresa da Hidden e da CAMO, Hidden in ARO, Coordinato contro UN bersaglio (E60,
//    E61), CO-03 con E49, CO-09 con una lista vecchia senza chars, CO-10 Idle di un
//    partecipante (A101; dalla .5 A110), TER-06 e TER-07 girati.
// 2026-10-23.3: sez. 3 e 4 girate (calcolatore_controller 2026-10-23.2): il punto ha la cella
//    neutra e niente righe delle salvezze; si cerca quella invece di «Azione non offensiva».
// 2026-10-23.2: sez. 2b girata (motore 2026-10-23.3, ordine_attacco_intuitivo 2026-10-23.1):
//    dopo la Schivata del Marker l'invio parte; controprova con la scelta guastata.
//    Sez. 3 e 4: la nota «Punto del tavolo…» e punto: true sul lato del punto.
// ============================================================================
//  Le otto correzioni del 23 ottobre (motore 2026-10-23.2, calcolatore_math
//  2026-10-23.1, ordine_attacco_bs 2026-10-23.1, ordine_supporto,
//  ordine_attacco_intuitivo, ordine_fuoco_speculativo 2026-10-22.1; app,
//  controller, roster_manager, logica_aro 2026-10-23.1), misurate dai tre
//  dispositivi con pagine intere fino al tabellone dell'Hub, e dal motore.
//  Copre cio` che test_elenchi_e_tabellone (INTERFACCIA, sez. 28-31) non
//  copre: i NUMERI e l'Hub.
//   1. TPL, Sagoma d'Impatto su tre Fusilier: UN tiro coi MOD del
//      Principale (8 in copertura, 11 senza), anche se la busta del
//      secondario porta un'altra gittata; la Schivata del secondario e` il
//      suo F2F contro lo stesso 8; tiroUnico. Controprove: Combi Rifle su
//      due bersagli, Sagoma Diretta su due bersagli.
//   2. INT-01: il motore accetta il Marker rivelato se eraMarker, E15 senza;
//      visibile alla dichiarazione -> E15. Dalla porta del giocatore (sez. 2b):
//      dopo la Schivata l'invio parte (corretto il 23 ottobre, motore 23.3).
//   3. SPEC-06: Pitcher, solo il PUNTO; finestra «riuscito?»; OK -> il
//      Ripetitore nasce e l'Hub lo vede; Annulla -> niente; l'ARO del
//      nemico e` un Tiro Normale suo; Grenades sul punto -> E15.
//   4. DIF-14: Smoke in ARO 13 anche con la Copertura; Assault Pistol -3.
//      Attacco BS con le Smoke: nessuna scelta, allarme sul PUNTO, scheda con
//      gittata e LoF, senza Copertura. Controprova Assault Pistol.
//   5. OSS-03: Triangulated Fire, sul tabellone 13 con i MOD ignorati;
//      l'Attacco BS normale resta 4.
//   6. SUP-02a/b: MediKit a distanza, fasce del kit 14/11/5, FUORI e LoF NO
//      -> tasto IDLE; all'Hub il valore della fascia; 🩺 BERSAGLIO della
//      fazione attiva.
//   7. Foto collegate (motore): fotoCollegateDa, SCENDI/RISALI, Escape,
//      senza scelta; filtraPerAvversario.
//  L'harness creaTavolo e` lo stesso di test_elenchi_e_tabellone.js
//  (INTERFACCIA): copiato qui perche` ogni banco basti a se stesso.
//  USO:  CARTELLA=/percorso/ node test_novita_23ott.js
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
const sagoma = (opz) => {
    const T = tavolo(T => [tr(P_(T, /^Alguacil \(Missile/), { id: 'n1', alias: 'Lancia' })],
                     T => ['p1', 'p2', 'p3'].map((id, i) => tr(T.profilo(T.pano, /^Fusilier \(Combi/), { id, alias: 'F' + (i + 1) })), 'NOMADI');
    const N = T.nomadi.g, P = T.pano.g, H = T.hub.g;
    T.apriMenu(T.nomadi, 0); N.selectAction('ATTACCO BS', false); N.startUnitAllocationLoopBS();
    N.declareAttackBS('Missile Launcher (Blast Mode)', 'Missile Launcher');
    ['p1', 'p2', 'p3'].forEach(id => N.toggleTargetSelection(id)); N.confirmMultiAro(false); T.giro();
    if (opz.schiva) { P.apriSelezioneAro(); P.toggleAroUnit('p2'); P.confermaSelezioneAro(); P.selezionaAzioneAro('DODGE'); P.salvaAroCorrente(); }
    else P.annullaAro();
    T.giro();
    N.goToModifiersBS('IDLE');
    N.setTargetRangeBS(0, 1); if (opz.copertura) N.toggleTargetCoverBS(0);
    // La busta del secondario porta un'altra gittata (32-40", +3) e nessuna
    // copertura: il calcolo deve prendere quelle del Principale.
    Object.assign(N.combatTargets[1], { rangeIndex: 4, rangeMod: 3, cover: false });
    const pagina = String(T.nomadi.el('targets-allocation-container').innerHTML);
    N.eseguiCalcoloBS(); T.giro();
    return { T, N, H, pagina, sc: H.ultimiScontri || [], t: tab(T) };
};
const successi = (t, nome) => (t.match(new RegExp(nome + ' Azione: [A-Z ]+ Successo al: (\\d+)')) || [])[1];

sezione('1. TPL: Sagoma d Impatto su tre Fusilier, UN tiro coi MOD del Principale', () => {
    const a = sagoma({ copertura: true, schiva: true });
    ok(ris(a.T) && a.sc.length === 3 && a.N.alert_.length === 0, 'premessa: l Hub risolve tre scontri, nessun alert', [a.sc.length, a.N.alert_]);
    const sec = (a.pagina.match(/class="target-card bersaglio-secondario"[\s\S]*?(?=class="target-card|$)/g) || []);
    ok(sec.length === 2 && sec.every(s => /SECONDARIO/.test(s) && !/setTargetRangeBS|toggleTargetCoverBS|LINEA DI TIRO|setTargetAmmoBS/.test(s)),
       'nella pagina: due schede SECONDARIO, senza gittata, Copertura, LoF e munizione', sec.length);
    ok(a.sc.every(s => s.tiroUnico && s.tiroUnico.gruppo === a.sc[0].tiroUnico.gruppo && s.tiroUnico.bersagli === 3),
       'i tre scontri portano tiroUnico, stesso gruppo, 3 bersagli', a.sc.map(s => s.tiroUnico));
    ok(J(a.sc.map(s => s.tiroUnico.principale)) === J([true, false, false]), 'il primo e` il Principale, gli altri no');
    ok((a.t.match(/Lancia Azione: ATTACCO BS Successo al: (\d+)/g) || []).length === 1 && successi(a.t, 'Lancia') === '8',
       'sul tabellone il tiro dell attaccante compare UNA volta: 8 (BS 11, Copertura del Principale -3)', successi(a.t, 'Lancia'));
    ok(/Questo è un bersaglio secondario[\s\S]*?Statistica Base \(BS\): 11 Bersaglio in Copertura Parziale: -3/.test(a.t) && !/Gittata: \+3/.test(a.t),
       'il secondario con la busta a 32-40" prende la gittata del Principale: nei suoi dettagli niente +3, la Copertura del Principale');
    ok(/F2 Azione: SCHIVATA Successo al: 10/.test(a.t) && /SECONDARIO · TIRO FACCIA A FACCIA/.test(a.t), 'la Schivata di F2 e` il SUO Faccia a Faccia: 10 contro lo stesso tiro');
    ok(/PRINCIPALE · TIRO NORMALE/.test(a.t) && (a.t.match(/SECONDARIO · TIRO NORMALE/g) || []).length === 1, 'F1 e F3 senza ARO: Tiri Normali');
    const b = sagoma({ copertura: false, schiva: false });
    ok(successi(b.t, 'Lancia') === '11' && (b.t.match(/Lancia Azione: ATTACCO BS Successo al:/g) || []).length === 1,
       'tolta la Copertura al Principale: 11, una volta sola, per tutti e tre', successi(b.t, 'Lancia'));
    // CONTROPROVA 1: Combi Rifle a due bersagli, due gittate diverse -> due valori, niente tiroUnico.
    const T = tavolo(T => [tr(P_(T, /^Alguacil \(Combi/), { id: 'n1', alias: 'Combi' })],
                     T => ['p1', 'p2'].map((id, i) => tr(T.profilo(T.pano, /^Fusilier \(Combi/), { id, alias: 'G' + (i + 1) })), 'NOMADI');
    const N = T.nomadi.g;
    T.apriMenu(T.nomadi, 0); N.selectAction('ATTACCO BS', false); N.startUnitAllocationLoopBS(); N.declareAttackBS('Combi Rifle');
    N.toggleTargetSelection('p1'); N.toggleTargetSelection('p2'); N.confirmMultiAro(false); T.giro(); T.pano.g.annullaAro(); T.giro();
    N.goToModifiersBS('IDLE'); N.adjustTargetBurstBS(0, -1); N.adjustTargetBurstBS(1, 1);
    N.setTargetRangeBS(0, 1); N.setTargetRangeBS(1, 3); N.toggleTargetCoverBS(0);
    const pag = String(T.nomadi.el('targets-allocation-container').innerHTML);
    N.eseguiCalcoloBS(); T.giro();
    const sc = T.hub.g.ultimiScontri || [], t = tab(T);
    ok(!/bersaglio-secondario/.test(pag) && sc.length === 2 && sc.every(s => !s.tiroUnico),
       'CONTROPROVA: Combi Rifle a due bersagli, nessun SECONDARIO e nessun tiroUnico', sc.map(s => s.tiroUnico));
    const v = (t.match(/Combi Azione: ATTACCO BS Successo al: (\d+)/g) || []).map(x => x.replace(/\D+/g, ''));
    ok(v.length === 2 && v[0] !== v[1], '  e due tiri coi MOD di ciascuno (' + v.join(', ') + ')', v);
    // CONTROPROVA 2: Sagoma Diretta (Light Flamethrower) su due bersagli: niente tiroUnico.
    const T2 = tavolo(T => [tr(P_(T, /^Grenzer \(Discover/), { id: 'n1', alias: 'Fiamma' })],
                      T => ['p1', 'p2'].map((id, i) => tr(T.profilo(T.pano, /^Fusilier \(Combi/), { id, alias: 'H' + (i + 1) })), 'NOMADI');
    const N2 = T2.nomadi.g;
    T2.apriMenu(T2.nomadi, 0); N2.selectAction('ATTACCO BS', false); N2.startUnitAllocationLoopBS();
    const lft = (String(T2.nomadi.el('weapon-buttons-container').innerHTML).match(/declareAttackBS\('(Light Flamethrower[^']*)'/) || [])[1];
    N2.declareAttackBS(lft); N2.toggleTargetSelection('p1'); N2.toggleTargetSelection('p2'); N2.confirmMultiAro(false); T2.giro(); T2.pano.g.annullaAro(); T2.giro();
    N2.goToModifiersBS('IDLE'); N2.eseguiCalcoloBS(); T2.giro();
    const sc2 = T2.hub.g.ultimiScontri || [];
    ok(!!lft && ris(T2) && sc2.length === 2 && sc2.every(s => !s.tiroUnico), 'CONTROPROVA: Sagoma Diretta (' + lft + ') su due: due scontri, nessun tiroUnico', [lft, sc2.length]);
});

// ---------------------------------------------------------------------------
const croc = (T, a) => tr(T.profilo(T.pano, /^Croc Man \(Boarding/), Object.assign({ id: 'p1', alias: 'Croc', deployState: 'CAMO', state: 'CAMO', states: { camo: true } }, a));
sezione('2. INT-01: il Marker che si rivela con la Schivata resta un bersaglio dell Intuitivo (motore)', () => {
    const T = tavolo(T => [tr(P_(T, /^Grenzer \(Discover/), { id: 'n1', alias: 'Fiamma' })],
                     T => [croc(T, { states: { camo: false }, deployState: 'NORMAL', state: 'NORMAL' }), tr(T.profilo(T.pano, /^Fusilier \(Combi/), { id: 'p2', alias: 'Vista' })], 'NOMADI');
    const N = T.nomadi.g, M = N.MotoreN5;
    const arma = Object.assign({}, M.profiloArma('Light Flamethrower'), { burst: 1 });
    const busta = (id, eraMarker) => M.creaPayload([{ attaccante: N.roster[0], azione: M.AZIONI.INTUITIVO, arma, burstDisponibile: 1, fuoriLoF: false,
        bersagli: [{ id, name: id, burst: 1, cover: false, rangeIndex: 0, rangeMod: 0, terrain: 'NESSUNO', ruolo: 'principale', eraMarker }] }], {});
    const e1 = busta('p1', true);
    ok(e1.ok === true, 'Croc Man ormai a faccia in su, ma eraMarker: la busta passa', (e1.errori || []).map(x => x.codice));
    const e2 = busta('p1', false);
    ok(e2.ok === false && e2.errori.some(x => x.codice === 'E15' && /visibile/.test(J(x))), 'CONTROPROVA: lo stesso senza eraMarker -> E15 «questo è visibile»', (e2.errori || []).map(x => x.codice));
    const e3 = busta('p2', false);
    ok(e3.ok === false && e3.errori.some(x => x.codice === 'E15'), 'CONTROPROVA: un Fusilier visibile gia` alla dichiarazione -> E15', (e3.errori || []).map(x => x.codice));
    // Il modulo segna eraMarker alla scelta (prima di confirmMultiAro).
    const T2 = tavolo(T => [tr(P_(T, /^Grenzer \(Discover/), { id: 'n1', alias: 'Fiamma' })], T => [croc(T)], 'NOMADI');
    const N2 = T2.nomadi.g; let visto = null;
    T2.apriMenu(T2.nomadi, 0); N2.selectAction('ATTACCO INTUITIVO', false);
    N2.declareIntuitivoAttack((String(T2.nomadi.el('weapon-buttons-container').innerHTML).match(/declareIntuitivoAttack\('([^']+)'/) || [])[1]);
    const conf = N2.confirmMultiAro; N2.confirmMultiAro = function () { visto = J(N2.combatTargets); return conf.apply(this, arguments); };
    N2.scegliPrincipaleIntuitivo('p1');
    ok(/"eraMarker":true/.test(visto || ''), 'il modulo segna eraMarker:true quando sceglie il Marker', visto);
});

sezione('2b. INT-01 dalla porta del giocatore: dopo la Schivata del Marker l invio parte (motore 2026-10-23.3, intuitivo 2026-10-23.1)', () => {
    // 🔴 GIRATA IL 23 OTTOBRE (2). Fino al giro di stamattina qui si misurava
    // il difetto aperto: app.html confirmMultiAro ricostruisce combatTargets
    // con campi fissi, eraMarker si perdeva e dopo la Schivata del Croc Man
    // l'invio restava bloccato (E15). Ora il modulo tiene la scelta in
    // window._sceltaIntuitivo e preparaModificatoriIntuitivo la rimette.
    // Non si pretende piu` che confirmMultiAro perda il campo: se INTERFACCIA
    // lo conserva, questa sezione resta verde lo stesso.
    const giro = (opz) => {
        opz = opz || {};
        const T = tavolo(T => [tr(P_(T, opz.morlock ? /^Morlock \(Assault Pistol\)/ : /^Grenzer \(Discover/), { id: 'n1', alias: 'Fiamma' })],
                         T => [opz.morlock ? tr(T.profilo(T.pano, /^Croc Man \(MULTI Sniper/), { id: 'p1', alias: 'Croc', deployState: 'CAMO', state: 'CAMO', states: { camo: true } }) : croc(T)], 'NOMADI');
        const N = T.nomadi.g, P = T.pano.g;
        T.apriMenu(T.nomadi, 0); N.selectAction('ATTACCO INTUITIVO', false);
        N.declareIntuitivoAttack((String(T.nomadi.el('weapon-buttons-container').innerHTML).match(/declareIntuitivoAttack\('([^']+)'/) || [])[1]);
        N.scegliPrincipaleIntuitivo('p1'); T.giro();
        if (opz.guasta) N._sceltaIntuitivo.eraMarker = false;
        P.apriSelezioneAro(); P.toggleAroUnit('p1'); P.confermaSelezioneAro(); P.selezionaAzioneAro('DODGE'); P.salvaAroCorrente(); T.giro();
        const rivelato = N.MotoreN5.rosterNemico().find(u => u.id === 'p1');
        const m = String(T.nomadi.el('second-half-buttons-container').innerHTML).match(/window\.selectAction\('([^']+)', true\)/);
        if (m) N.selectAction(m[1], true);
        const dopo = J(N.combatTargets[0]);
        N.alert_.length = 0; premi(T.nomadi, 'btn-esegui-calcolo'); T.giro();
        return { T, N, dopo, rivelato, t: tab(T) };
    };
    const a = giro();
    ok(a.rivelato && !a.N.MotoreN5.inFormaMarker(a.N.MotoreN5.statoBersaglio(a.rivelato)), 'premessa: la Schivata ha rivelato il Croc Man (non e` piu` un Marker)');
    ok(/"eraMarker":true/.test(a.dopo) && /"ruolo":"principale"/.test(a.dopo), 'nella pagina dei modificatori il bersaglio ha di nuovo eraMarker:true e ruolo principale', a.dopo);
    ok(ris(a.T) && a.N.alert_.length === 0 && /^TIRO FACCIA A FACCIA/.test(a.t) && /Fiamma Azione: ATTACCO INTUITIVO Successo al: 13/.test(a.t) && /Croc Azione: SCHIVATA Successo al: 12/.test(a.t),
       'l invio parte: Faccia a Faccia, WIP 13 contro Schivata 12', a.N.alert_.join(' ').slice(0, 90) || a.t.slice(0, 80));
    const b = giro({ morlock: true });
    ok(ris(b.T) && /Fiamma Azione: ATTACCO INTUITIVO Successo al: 14/.test(b.t) && /Croc Azione: SCHIVATA Successo al: 12/.test(b.t),
       'INT-01 come nel piano (Morlock, Chain Rifle, Croc Man Sniper): F2F 14 contro 12', b.t.slice(0, 80));
    // CONTROPROVA: e` la scelta tenuta dal modulo a far passare l invio. Con
    // eraMarker:false nella scelta, il bersaglio rivelato torna E15.
    const c = giro({ guasta: true });
    ok(!ris(c.T) && /INVIO BLOCCATO[\s\S]*Questo è visibile/.test(c.N.alert_.join(' ')),
       'CONTROPROVA: con la scelta tenuta a eraMarker:false lo stesso giro e` bloccato (E15)', c.N.alert_.join(' ').slice(0, 90));
});

// ---------------------------------------------------------------------------
sezione('3. SPEC-06: Pitcher sul PUNTO SUL TAVOLO, «riuscito?», il Ripetitore all Hub', () => {
    const giro = (risposta, aroNemico) => {
        const T = tavolo(T => [tr(P_(T, /^Pi-Well FTO/), { id: 'n1', alias: 'Lancia' })], T => [tr(T.profilo(T.pano, /^Fusilier \(Combi/), { id: 'p1', alias: 'Uno' })], 'NOMADI');
        const N = T.nomadi.g, P = T.pano.g; const domande = [];
        N.confirm = (m) => { domande.push(String(m)); return risposta; };
        T.apriMenu(T.nomadi, 0); N.selectAction('FUOCO SPECULATIVO', false);
        const on = (String(T.nomadi.el('weapon-buttons-container').innerHTML).match(/onclick="(window\.declareSpeculativoAttack\('Pitcher'\))"/) || [])[1];
        vm.runInContext(on || 'void 0', N);
        const pag = String(T.nomadi.el('enemy-target-buttons').innerHTML);
        N.toccaBersaglioSpeculativo('punto'); N.confirmMultiAro(false); T.giro();
        if (aroNemico) { P.apriSelezioneAro(); P.toggleAroUnit('p1'); P.confermaSelezioneAro(); P.selezionaAzioneAro('BS_ATTACK'); P.selezionaArmaAro('Combi Rifle'); P.selezionaBersaglioAro('Lancia'); P.salvaAroCorrente(); }
        else P.annullaAro();
        T.giro();
        const m = String(T.nomadi.el('second-half-buttons-container').innerHTML).match(/window\.selectAction\('([^']+)', true\)/);
        if (m) N.selectAction(m[1], true);
        N.alert_.length = 0; N.eseguiCalcoloSpeculativo(); T.giro();
        const hubVede = JSON.parse(T.server.global_game_state || '{"nomads":[]}').nomads.map(u => u.nome);
        return { T, N, on, pag, domande, hubVede, t: tab(T) };
    };
    const a = giro(true, false);
    ok(!!a.on && /PUNTO SUL TAVOLO/.test(a.pag) && !/toccaBersaglioSpeculativo\('p1'\)/.test(a.pag), 'col Pitcher la pagina offre SOLO il PUNTO SUL TAVOLO');
    ok(ris(a.T) && /^TIRO NORMALE/.test(a.t) && /Lancia Azione: FUOCO SPECULATIVO Successo al: 5/.test(a.t), 'sul tabellone: Tiro Normale del lanciatore (BS 11, Speculativo -6 = 5)', a.t.slice(0, 90));
    // 🔴 GIRATA IL 23 OTTOBRE (3), controller 2026-10-23.2: il lato del punto e`
    // una cella neutra e la riga delle salvezze non si disegna. Prima qui si
    // cercava «Azione non offensiva…», che stava proprio in quella riga.
    ok(/📍 PUNTO SUL TAVOLO Non è una truppa: non reagisce e non subisce danno\./.test(a.t) && !/SE COLPITO DAL/.test(a.t) && !/REATTIVO PANOCEANIA PUNTO/.test(a.t),
       'e nessun Tiro Salvezza: la cella del punto e` neutra, senza fazione e senza righe delle salvezze');
    ok(/Punto del tavolo: non e` una truppa, non reagisce e non subisce danno\./.test(a.t) && !/PUNTO SUL TAVOLO[^▶]*Nessun ARO dichiarato/.test(a.t),
       'sul lato del punto la nota «Punto del tavolo: non e` una truppa…» invece di «Nessun ARO dichiarato.» (motore 23.3)');
    const lato = (((a.T.hub.g.ultimiScontri || [])[0] || {}).reattivo || {}).dati || {};
    ok(lato.punto === true, 'e lo scontro porta punto: true sul lato del punto (reattivo.dati)', lato.punto);
    ok(a.domande.length === 1 && /Pitcher[\s\S]*RIUSCITO/.test(a.domande[0]), 'la domanda «Il tiro è RIUSCITO?» e` una finestra, una volta', a.domande.length);
    ok(a.N.roster.some(u => /Deployable Repeater/.test(u.nome)) && a.hubVede.some(n => /Deployable Repeater/.test(n)),
       'OK: il Ripetitore nasce nel roster e l Hub lo riceve (AGGIORNAMENTO)', a.hubVede);
    const b = giro(false, true);
    ok(!b.N.roster.some(u => /Deployable Repeater/.test(u.nome)) && !b.hubVede.some(n => /Deployable Repeater/.test(n)) && /tiro fallito/.test(b.N.alert_.join(' ')),
       'CONTROPROVA: Annulla -> nessun segnalino, e lo dice', b.hubVede);
    ok(/Uno Azione: ATTACCO BS Successo al: \d+/.test(b.t) && /^TIRO NORMALE/.test(b.t) && !/TIRO FACCIA A FACCIA/.test(b.t),
       'l ARO del Fusilier e` un Tiro Normale suo, non un Faccia a Faccia', b.t.slice(0, 60));
    // Le Grenades su un punto -> E15 (motore).
    const M = a.N.MotoreN5;
    const g = M.creaPayload([{ attaccante: a.N.roster[0], azione: M.AZIONI.SPECULATIVO, arma: M.profiloArma('Grenades'), burstDisponibile: 1, bersagli: [M.bersaglioPunto()] }], {});
    ok(g.ok === false && g.errori.some(x => x.codice === 'E15'), 'Grenades sul punto: E15 (non e` Targetless)', (g.errori || []).map(x => x.codice));
    const s = M.creaPayload([{ attaccante: a.N.roster[0], azione: M.AZIONI.SPECULATIVO, arma: M.profiloArma('Smoke Grenades'), burstDisponibile: 1, bersagli: [M.bersaglioPunto()] }], {});
    ok(!s.errori || !s.errori.some(x => x.codice === 'E15'), 'CONTROPROVA: Smoke Grenades sul punto, nessun E15', (s.errori || []).map(x => x.codice));
});

// ---------------------------------------------------------------------------
sezione('4. DIF-14: Smoke Grenades, Copertura e Mimetismo ignorati; Attacco BS sul PUNTO', () => {
    const aro = (arma, copertura) => {
        const T = tavolo(T => [tr(P_(T, /^Morlock \(Assault Pistol\)/), { id: 'n1', alias: 'Fumo' })], T => [tr(T.profilo(T.pano, /^Fusilier \(Combi/), { id: 'p1', alias: 'Spara' })], 'PANOCEANIA');
        const P = T.pano.g, N = T.nomadi.g;
        T.apriMenu(T.pano, 0); P.selectAction('ATTACCO BS', false); P.declareAttackBS('Combi Rifle'); P.toggleTargetSelection('n1'); P.confirmMultiAro(false); T.giro();
        N.apriSelezioneAro(); N.toggleAroUnit('n1'); N.confermaSelezioneAro(); N.selezionaAzioneAro('BS_ATTACK'); N.selezionaArmaAro(arma); N.selezionaBersaglioAro('Spara');
        const h = String(T.nomadi.el('aro-modifiers-content').innerHTML);
        if (copertura) { if (/toggleAroCover/.test(h)) N.toggleAroCover(); N.aroCurrentConfig.cover = true; }
        N.salvaAroCorrente(); T.giro();
        const m = String(T.pano.el('second-half-buttons-container').innerHTML).match(/window\.selectAction\('([^']+)', true\)/); if (m) P.selectAction(m[1], true);
        P.eseguiCalcoloBS(); T.giro();
        return { h, v: successi(tab(T), 'Fumo'), t: tab(T) };
    };
    const s0 = aro('Smoke Grenades', false), s1 = aro('Smoke Grenades', true);
    ok(s0.v === '13' && s1.v === '13', 'Morlock in ARO col Fumo: 13, anche con la Copertura segnata nella busta', [s0.v, s1.v]);
    ok(!/toggleAroCover/.test(s0.h) && /Copertura e Mimetismo non entrano nel tiro/.test(s1.t), '  nessun tasto Copertura, e nei dettagli il perche`');
    const p0 = aro('Assault Pistol', false), p1 = aro('Assault Pistol', true);
    ok(/toggleAroCover/.test(p0.h) && Number(p0.v) - Number(p1.v) === 3 && /Copertura Parziale: -3/.test(p1.t), 'CONTROPROVA: Assault Pistol, la Copertura toglie 3 (' + p0.v + ' -> ' + p1.v + ')', [p0.v, p1.v]);
    const bs = (arma) => {
        const T = tavolo(T => [tr(P_(T, /^Morlock \(Assault Pistol\)/), { id: 'n1', alias: 'Fumo' })], T => [tr(T.profilo(T.pano, /^Fusilier \(Combi/), { id: 'p1', alias: 'Spara' })], 'NOMADI');
        const N = T.nomadi.g, P = T.pano.g;
        T.apriMenu(T.nomadi, 0); N.selectAction('ATTACCO BS', false); N.startUnitAllocationLoopBS(); N.declareAttackBS(arma);
        const lista = String(T.nomadi.el('enemy-target-buttons').innerHTML);
        const allarme = Object.keys(T.server).map(k => T.server[k]).find(v => /"bersagli"/.test(v || ''));
        if (arma !== 'Smoke Grenades') { N.toggleTargetSelection('p1'); N.confirmMultiAro(false); }
        T.giro(); P.annullaAro(); T.giro(); N.goToModifiersBS('IDLE');
        const card = String(T.nomadi.el('targets-allocation-container').innerHTML);
        N.eseguiCalcoloBS(); T.giro();
        return { T, N, lista, allarme, card, t: tab(T) };
    };
    const a = bs('Smoke Grenades');
    ok(J((a.N.combatTargets[0] || {}).punto) === 'true' || /PUNTO SUL TAVOLO/.test(a.allarme || ''), 'Attacco BS con le Smoke: nessuna scelta, il bersaglio e` il punto');
    ok(/"bersagli":\["PUNTO SUL TAVOLO"\]/.test(a.allarme || ''), 'l allarme ARO parte sul PUNTO', (a.allarme || '').slice(0, 120));
    ok(/setTargetRangeBS/.test(a.card) && /LINEA DI TIRO/.test(a.card) && !/toggleTargetCoverBS/.test(a.card) && !/NO COPERTURA/.test(a.card), 'la scheda: gittata e LINEA DI TIRO, nessun tasto Copertura');
    ok(ris(a.T) && successi(a.t, 'Fumo') === '13' && /📍 PUNTO SUL TAVOLO/.test(a.t) && !/SE COLPITO DAL/.test(a.t), 'all Hub: 13 sul punto, cella neutra, nessuna salvezza', successi(a.t, 'Fumo'));
    const c = bs('Assault Pistol');
    ok(/Punto del tavolo: non e` una truppa/.test(a.t) && ((((a.T.hub.g.ultimiScontri || [])[0] || {}).reattivo || {}).dati || {}).punto === true,
       '  anche qui la nota del punto e punto: true');
    ok(!/Punto del tavolo/.test(c.t) && !(((((c.T.hub.g.ultimiScontri || [])[0] || {}).reattivo || {}).dati || {}).punto),
       'CONTROPROVA: contro il Fusilier (Assault Pistol) niente nota del punto e niente punto: true');
    ok(!c.allarme && /toggleTargetSelection\('p1'\)/.test(c.lista) && /toggleTargetCoverBS/.test(c.card) && /Spara Azione/.test(c.t),
       'CONTROPROVA: con l Assault Pistol si sceglie il Fusilier, e la scheda ha la Copertura');
});

// ---------------------------------------------------------------------------
sezione('5. OSS-03: Triangulated Fire, sul tabellone il BS nudo', () => {
    const giro = (azione) => {
        const T = tavolo(T => [tr(P_(T, /^Intruder \(HMG/), { id: 'n1', alias: 'Intr' })], T => [tr(T.profilo(T.pano, /^Zulu-Cobra \(Triangulated/), { id: 'p1', alias: 'Zc' })], 'PANOCEANIA');
        const P = T.pano.g; T.apriMenu(T.pano, 0);
        if (azione === 'TRI') { P.selectAction('TRIANGULATED FIRE', false); P.scegliArmaTriangulated('Combi Rifle'); }
        else { P.selectAction('ATTACCO BS', false); P.startUnitAllocationLoopBS(); P.declareAttackBS('Combi Rifle'); }
        P.toggleTargetSelection('n1'); P.confirmMultiAro(false); T.giro(); T.nomadi.g.annullaAro(); T.giro();
        if (azione === 'TRI') { P.setRangeOsservazione(4); P.eseguiOsservazione(); }
        else { P.goToModifiersBS('IDLE'); P.setTargetRangeBS(0, 4); P.eseguiCalcoloBS(); }
        T.giro(); return { T, t: tab(T) };
    };
    const a = giro('TRI');
    ok(ris(a.T) && /Zc Azione: TRIANGULATED FIRE Successo al: 13 \(o meno\)/.test(a.t), 'Zulu-Cobra contro Intruder a 32-40": Successo al 13 (prima 4)', successi(a.t, 'Zc'));
    ok(/MOD ignorati dal Triangulated Fire: Gittata: -6 \(-6\); Mimetismo del bersaglio: -3 \(-3\)/.test(a.t), 'con la nota dei MOD ignorati (Gittata -6, Mimetismo -3)');
    const b = giro('BS');
    ok(ris(b.T) && successi(b.t, 'Zc') === '4', 'CONTROPROVA: Attacco BS normale contro lo stesso bersaglio: 4, coi suoi MOD', successi(b.t, 'Zc'));
});

// ---------------------------------------------------------------------------
sezione('6. SUP-02a/b: MediKit a distanza, le fasce del kit e il BERSAGLIO', () => {
    const giro = (fascia, togli) => {
        const T = tavolo(T => [tr(P_(T, /^Alguacil \(Paramedic/), { id: 'n1', alias: 'Medico' }), tr(P_(T, /^Alguacil \(Combi/), { id: 'n2', alias: 'Ferito', states: { unconscious: true } })],
                         T => [tr(T.profilo(T.pano, /^Fusilier \(Combi/), { id: 'p1', alias: 'Uno' })], 'NOMADI');
        const N = T.nomadi.g, P = T.pano.g;
        T.apriMenu(T.nomadi, 0); N.selectAction('MEDICO_INGEGNERE', false);
        N.scegliStrumentoSupporto((String(T.nomadi.el('weapon-buttons-container').innerHTML).match(/scegliStrumentoSupporto\('([^']+)'\)/) || [])[1]);
        N.scegliBersaglioSupporto('n2');
        if (N.supportoInContatto !== false) N.toggleContattoSupporto();
        N.setTargetRangeSupporto(fascia); if (togli) N.toggleRequisitoSupporto(togli);
        const h = String(T.nomadi.el('targets-allocation-container').innerHTML), tasto = T.nomadi.el('btn-esegui-calcolo').innerText;
        let idle = null; N.dichiaraRequisitoFallito = (m) => { idle = m; };
        premi(T.nomadi, 'btn-esegui-calcolo'); T.giro(); P.annullaAro(); T.giro();
        return { T, h, tasto, idle, t: tab(T) };
    };
    const a = giro(0);
    ok(J((a.h.match(/<span>[^<]*<\/span>/g) || []).map(x => x.replace(/<\/?span>/g, ''))) === J(['0-8"', '8-16"', '16-24"', 'oltre']) && /onclick="window\.toggleRequisitoSupporto\('gittata'\)">FUORI/.test(a.h),
       'la barra del MediKit: 0-8 / 8-16 / 16-24 / FUORI (le fasce del kit, non dello Scoprire)');
    ok(/LINEA DI TIRO SÌ/.test(a.h), 'e il tasto della LINEA DI TIRO');
    const v = [0, 1, 2].map(i => (giro(i).t.match(/Medico Azione: MediKit: TIRO PER COLPIRE Successo al: (\d+)/) || [])[1]);
    ok(J(v) === J(['14', '11', '5']), 'all Hub il valore della fascia scelta: 14 / 11 / 5', v);
    ok(/🩺 BERSAGLIO NOMADI Ferito/.test(a.t), 'sopra il Ferito: «🩺 BERSAGLIO», della fazione attiva (NOMADI)', (a.t.match(/\S+ BERSAGLIO \S+ Ferito|REATTIVO \S+ Ferito/) || ['?'])[0]);
    const f = giro(0, 'gittata'), l = giro(0, 'lof');
    ok(f.tasto === 'IDLE' && /fuori gittata/.test(f.idle || '') && !ris(f.T), 'FUORI: il tasto e` IDLE, e premuto dichiara l Idle (non parte niente)', [f.tasto, f.idle]);
    ok(l.tasto === 'IDLE' && /Linea di Tiro/.test(l.idle || '') && !ris(l.T), 'LINEA DI TIRO NO: IDLE', [l.tasto, l.idle]);
    ok(a.tasto !== 'IDLE' && ris(a.T), 'CONTROPROVA: in fascia e con la LoF il tasto non e` IDLE e l Hub risolve', a.tasto);
});

// ---------------------------------------------------------------------------
sezione('7. Foto collegate (motore 2026-10-23.2): pilota, moto, Escape System', () => {
    const T = creaTavolo(DIR); const M = T.nomadi.g.MotoreN5;
    const prof = (re) => T.profilo(T.nomadi, re);
    const chi = (re) => J(M.fotoCollegateDa(prof(re)).map(f => f.chiave + ':' + f.nome));
    ok(chi(/^Zondnautica-A$/) === J(['pilota:Zondnaut-A', 'moto:Zondmate (REM)']), 'Zondnautica: pilota e moto', chi(/^Zondnautica-A$/));
    ok(chi(/^Anaconda \(Heavy/) === J(['pilota:Operator (Spitfire)']) && chi(/^Maximus/) === J(['pilota:Operator Maximus']), 'Anaconda e Maximus: il pilota');
    ok(chi(/^Alguacil \(Combi/) === '[]', 'CONTROPROVA: Alguacil, nessuna');
    const z = tr(prof(/^Zondnautica-A$/), { id: 'z1', alias: 'Z', imgVariant: 'zondnautica.png', fotoCollegate: { pilota: 'zondnaut.png', moto: 'zondmate.png' } });
    const s = M.smontaMoto(z);
    ok(s.unitaAggiornata.imgVariant === 'zondnaut.png' && s.nuova.imgVariant === 'zondmate.png', 'SCENDI: il pilota con la sua foto, la moto con la sua');
    const r = M.rimontaMoto(s.unitaAggiornata, [s.unitaAggiornata, s.nuova]);
    ok(r.unitaAggiornata.imgVariant === 'zondnautica.png', 'RISALI: torna la foto della montata', r.unitaAggiornata.imgVariant);
    const s2 = M.smontaMoto(r.unitaAggiornata);
    ok(s2.possibile && s2.unitaAggiornata.imgVariant === 'zondnaut.png' && s2.nuova.imgVariant === 'zondmate.png', 'e scendendo di nuovo le foto tornano (la scelta non si perde col RISALI)');
    const s0 = M.smontaMoto(tr(prof(/^Zondnautica-A$/), { id: 'z2', alias: 'Z0', imgVariant: 'zondnautica.png' }));
    ok(s0.unitaAggiornata.imgVariant === undefined && s0.nuova.imgVariant === 'zondnautica.png', 'senza scelta: pilota senza foto, la moto con quella della montata', [s0.unitaAggiornata.imgVariant, s0.nuova.imgVariant]);
    const a = tr(prof(/^Anaconda \(Heavy/), { id: 't1', alias: 'A', imgVariant: 'anaconda.png', fotoCollegate: { pilota: 'operator.png' } });
    const e = M.espelliPilota(a);
    ok(e.nuova.imgVariant === 'operator.png' && e.unitaAggiornata.imgVariant === 'anaconda.png', 'Escape System: il pilota con la sua, il TAG tiene la sua');
    ok(M.espelliPilota(tr(prof(/^Anaconda \(Heavy/), { id: 't2', alias: 'A0', imgVariant: 'anaconda.png' })).nuova.imgVariant === undefined, '  senza scelta: il pilota senza foto');
    ok(M.risaliSulTag(e.nuova, [e.unitaAggiornata, e.nuova]).unitaAggiornata.imgVariant === 'anaconda.png', '  risalito sul TAG: la foto del TAG');
    const fil = M.filtraPerAvversario([z, s.unitaAggiornata, a]);
    ok(fil.length === 3 && fil.every(u => u.fotoCollegate === undefined) && fil[0].imgVariant === 'zondnautica.png',
       'filtraPerAvversario non manda fotoCollegate (la foto in uso si`)', fil.map(u => u.fotoCollegate));
});

// ===========================================================================
//  POMERIGGIO DEL 23 OTTOBRE (motore 2026-10-23.7, motore_core 2026-10-23.1,
//  ordine_attacco_bs 2026-10-23.3; logica_aro e app.html 2026-10-23.2)
// ===========================================================================
const finto = (T) => T.nomadi.g;
const coordina = (T, indici) => { const N = T.nomadi.g; N.alert_.length = 0; N.currentGroup = 1; N.isCoordinated = true; N.selectedCoordinatedUnits = []; N.spearheadUnit = null;
    indici.forEach(i => N.selezionaUnita(i)); N.confermaCoordinato(); return N; };
const secondaMeta = (T, N) => { const m = String(T.nomadi.el('second-half-buttons-container').innerHTML).match(/window\.selectAction\('([^']+)', true\)/); if (m) N.selectAction(m[1], true); };
const conTerreni = (rN, rP, ter, attiva) => { const T = creaTavolo(DIR);
    [T.nomadi.g, T.pano.g].forEach(g => { g.activeTerrains = ter.map(id => g.DB_TERRENI.find(t => t.id === id)); });
    T.schiera(rN(T), rP(T), attiva || 'NOMADI'); return T; };

sezione('8. AR-10 e Sorpresa: da Hidden e da CAMO l Attacco a Sorpresa vale; Hidden reagisce in ARO', () => {
    // Spektr (MULTI Sniper Rifle) contro il Fusilier a 8-16"; il Fusilier risponde col Combi Rifle.
    const spektr = (stato) => (T) => [tr(P_(T, /^Spektr \(MULTI Sniper/), Object.assign({ id: 'n1', alias: 'Spek' },
        stato === 'HIDDEN' ? { deployState: 'HIDDEN', states: { hidden: true } } : stato === 'CAMO' ? { deployState: 'CAMO', states: { camo: true } } : {}))];
    const attacca = (T) => { const N = T.nomadi.g, P = T.pano.g;
        T.apriMenu(T.nomadi, 0); N.selectAction('ATTACCO BS', false);
        const fam = Object.keys(N._modiBS || {})[0]; N.declareAttackBS(N._modiBS[fam][0], fam);
        N.toggleTargetSelection('p1'); N.confirmMultiAro(false); T.giro();
        P.apriSelezioneAro(); P.toggleAroUnit('p1'); P.confermaSelezioneAro(); P.selezionaAzioneAro('BS_ATTACK'); P.selezionaArmaAro('Combi Rifle');
        P.selezionaBersaglioAro((P.currentAttackData || {}).attaccante); P.salvaAroCorrente(); T.giro();
        N.goToModifiersBS('IDLE'); N.setTargetRangeBS(0, 1); N.eseguiCalcoloBS(); T.giro();
        const t = tab(T); T.hub.g.chiudiRisoluzione(); N.tornaAlRadar(); T.giro(); return t; };
    const fus = (t) => (t.match(/Fus Azione: ATTACCO BS Successo al: (\d+)/) || [])[1];
    const fusil = (T) => [tr(T.profilo(T.pano, /^Fusilier \(Combi/), { id: 'p1', alias: 'Fus' })];
    const T = tavolo(spektr('HIDDEN'), fusil, 'NOMADI');
    const t1 = attacca(T);
    ok(fus(t1) === '6' && /Attacco a Sorpresa: -3/.test(t1), 'da Hidden: il Fusilier tira 6 = 12 +3 -6 -3, con la voce «Attacco a Sorpresa: -3»', fus(t1));
    ok(T.nomadi.g.roster[0].deployState === 'NORMAL', 'e la dichiarazione ha rivelato lo Spektr (NORMAL)', T.nomadi.g.roster[0].deployState);
    const t2 = attacca(T);
    ok(fus(t2) === '9' && !/Attacco a Sorpresa/.test(t2) && /Surprise Attack: non si applica/.test(t2), 'CONTROPROVA: nell Ordine dopo, gia` rivelato, nessuna Sorpresa: 9', fus(t2));
    const tc = attacca(tavolo(spektr('CAMO'), fusil, 'NOMADI'));
    ok(fus(tc) === '6' && /Attacco a Sorpresa: -3/.test(tc), 'da CAMO lo stesso: 6, con la voce', fus(tc));
    const tn = attacca(tavolo(spektr('NORMAL'), fusil, 'NOMADI'));
    ok(fus(tn) === '9', 'CONTROPROVA: Spektr schierato a vista, 9', fus(tn));
    // BS-28 del piano: lo stesso dal lato PanOceania, Croc Man (#6) contro Alguacil (#1).
    {
        const attaccaP = (T) => { const N = T.nomadi.g, P = T.pano.g;
            T.apriMenu(T.pano, 0); P.selectAction('ATTACCO BS', false); const fam = Object.keys(P._modiBS || {})[0]; P.declareAttackBS(P._modiBS[fam][0], fam);
            P.toggleTargetSelection('n1'); P.confirmMultiAro(false); T.giro();
            N.apriSelezioneAro(); N.toggleAroUnit('n1'); N.confermaSelezioneAro(); N.selezionaAzioneAro('BS_ATTACK'); N.selezionaArmaAro('Combi Rifle');
            N.selezionaBersaglioAro((N.currentAttackData || {}).attaccante); N.setAroRange(1); N.salvaAroCorrente(); T.giro();
            P.goToModifiersBS('IDLE'); P.setTargetRangeBS(0, 1); P.eseguiCalcoloBS(); T.giro();
            const t = tab(T); T.hub.g.chiudiRisoluzione(); P.tornaAlRadar(); T.giro(); return t; };
        const alg = (t) => (t.match(/Alg Azione: ATTACCO BS Successo al: (\d+)/) || [])[1];
        ['HIDDEN', 'CAMO'].forEach(function (st) {
            const T = tavolo(T => [tr(P_(T, /^Alguacil \(Combi/), { id: 'n1', alias: 'Alg' })],
                             T => [tr(T.profilo(T.pano, /^Croc Man \(MULTI Sniper/), Object.assign({ id: 'p6', alias: 'Croc' }, st === 'HIDDEN' ? { deployState: 'HIDDEN', states: { hidden: true } } : { deployState: 'CAMO', states: { camo: true } }))], 'PANOCEANIA');
            const t1 = attaccaP(T), t2 = attaccaP(T);
            ok(/^TIRO FACCIA A FACCIA/.test(t1) && alg(t1) === '5' && /Attacco a Sorpresa: -3/.test(t1) && /Croc Azione: ATTACCO BS Successo al: 12 \(o meno\) Dadi da lanciare: 2/.test(t1) && alg(t2) === '8' && !/Attacco a Sorpresa/.test(t2),
               'BS-28, Croc Man da ' + st + ' sull Alguacil a 8-16": F2F, Croc 12 B2, Alguacil 5 (11 +3 -6 -3); nell Ordine dopo 8', [alg(t1), alg(t2)]);
        });
    }
    // In ARO: chi e` in Hidden Deployment reagisce e si rivela; la Riserva resta fuori.
    const A = tavolo(T => [tr(P_(T, /^Alguacil \(Combi/), { id: 'n1', alias: 'Alg' })],
                     T => [tr(T.profilo(T.pano, /^Orc \(Hacker, Hacking Device/), { id: 'p4', alias: 'Orc' }),
                           tr(T.profilo(T.pano, /^Croc Man \(MULTI Sniper/), { id: 'p6', alias: 'Croc', deployState: 'HIDDEN', states: { hidden: true } }),
                           tr(T.profilo(T.pano, /^Fusilier \(Missile/), { id: 'p2', alias: 'Ris', deployState: 'RESERVE', states: { reserve: true } })], 'NOMADI');
    const N = A.nomadi.g, P = A.pano.g;
    ok(J(N.MotoreN5.rosterNemico().map(u => u.alias)) === '["Orc"]', 'premessa: l attivo vede solo l Orc (Croc nascosto, Fusilier in Riserva)');
    A.apriMenu(A.nomadi, 0); N.selectAction('ATTACCO BS', false); N.declareAttackBS('Combi Rifle'); N.toggleTargetSelection('p4'); N.confirmMultiAro(false); A.giro();
    P.apriSelezioneAro();
    const lista = tx(A.pano.el('aro-selection-list').innerHTML);
    ok(/Croc Man 👁️ NASCOSTO: reagendo si rivela/.test(lista) && !/Ris\b|Fusilier/.test(lista), 'fra chi reagisce c e il Croc Man con «NASCOSTO: reagendo si rivela»; il Fusilier in Riserva no', lista.slice(0, 120));
    P.toggleAroUnit('p6'); P.confermaSelezioneAro(); P.selezionaAzioneAro('BS_ATTACK'); P.selezionaArmaAro('MULTI Sniper Rifle (AP Mode)'); P.selezionaBersaglioAro('Alg'); P.setAroRange(1); P.salvaAroCorrente(); A.giro();
    ok(P.roster.find(u => u.id === 'p6').deployState === 'NORMAL' && (A.hub.g.gameState.panoceania.find(u => u.id === 'p6') || {}).deployState === 'NORMAL', 'reagendo torna NORMAL, e l Hub lo vede (AGGIORNAMENTO)');
    N.goToModifiersBS('IDLE'); N.setTargetRangeBS(0, 1); N.eseguiCalcoloBS(); A.giro();
    const ta = tab(A);
    ok(ris(A) && /Alg Azione: ATTACCO BS Successo al: 14/.test(ta) && /Croc Azione: ATTACCO BS Successo al: 12/.test(ta) && /Croc reagisce senza essere bersaglio dell'attacco: il suo è un Tiro Normale a sé/.test(ta),
       'sul tabellone: l Alguacil 14 sull Orc, il Croc Man 12 sull Alguacil, Tiro Normale a se`', ta.slice(0, 100));
});

sezione('9. CO-01: Ordine Coordinato contro UN solo bersaglio (E60, E61)', () => {
    const T = tavolo(T => [tr(P_(T, /^Alguacil \(HMG/), { id: 'n2', alias: 'Punta' }), tr(P_(T, /^Alguacil \(Combi/), { id: 'n1', alias: 'Greg' })],
                     T => [tr(T.profilo(T.pano, /^Fusilier \(Combi/), { id: 'p1', alias: 'Fus' }), tr(T.profilo(T.pano, /^Orc \(Hacker, Hacking Device/), { id: 'p4', alias: 'Orc' })], 'NOMADI');
    const N = coordina(T, [0, 1]), P = T.pano.g, M = N.MotoreN5;
    N.selectAction('ATTACCO BS', false); N.declareAttackBS('Heavy Machine Gun');
    // 🔴 GIRATA IL 23 OTTOBRE (sera), ordine_attacco_bs 2026-10-23.4: nel
    // Coordinato il secondo tocco SOSTITUISCE il primo, gia` nella scelta.
    // Prima restava il primo, tagliato dopo l'allarme (che nominava tutti e due).
    N.toggleTargetSelection('p1'); N.toggleTargetSelection('p4');
    ok(J((N.pendingTargets || []).map(t => t.id)) === '["p4"]', 'la Punta tocca Fusilier, poi Orc: nella scelta resta SOLO l Orc', (N.pendingTargets || []).map(t => t.id));
    N.toggleTargetSelection('p4');
    ok((N.pendingTargets || []).length === 0, 'ritoccato l Orc, la scelta si svuota');
    N.toggleTargetSelection('p1'); N.toggleTargetSelection('p4');
    N.confirmMultiAro(false); T.giro();
    const allarme = J((P.currentAttackData || {}).bersagli);
    ok(allarme === '["Orc"]', 'l allarme ARO nomina solo l Orc', allarme);
    P.annullaAro(); T.giro(); secondaMeta(T, N);
    ok(J(N.combatTargets.map(t => t.name)) === '["Orc"]' && !N.alert_.some(a => /STESSO UNICO bersaglio/.test(a)), 'nei modificatori c e l Orc, e l avviso del taglio non scatta', N.alert_.map(a => a.slice(0, 60)));
    N.alert_.length = 0; N.eseguiCalcoloBS(); N.declareAttackBS('Combi Rifle');
    ok(J(N.combatTargets.map(t => t.name)) === '["Orc"]' && T.nomadi.el('step-modifiers').style.display === 'flex', 'il gregario non sceglie: e` gia` sull Orc, nella pagina dei modificatori');
    N.eseguiCalcoloBS(); T.giro();
    const t = tab(T);
    ok(ris(T) && N.alert_.length === 0 && /Punta Azione: ATTACCO BS Successo al: 8 \(o meno\) Dadi da lanciare: 2/.test(t) && /Greg Azione: ATTACCO BS Successo al: 14 \(o meno\) Dadi da lanciare: 1/.test(t) && !/REATTIVO PANOCEANIA Fus/.test(t),
       'sul tabellone: Punta B2 (8) e gregario B1 (14), tutti e due sull Orc; il Fusilier non c e', t.slice(0, 90));
    // CONTROPROVE della scelta: Ordine singolo, due bersagli; Coordinato con la Sagoma d'Impatto, i secondari si aggiungono.
    {
        const S = tavolo(T => [tr(P_(T, /^Alguacil \(HMG/), { id: 'n2', alias: 'Solo' })],
                         T => [tr(T.profilo(T.pano, /^Fusilier \(Combi/), { id: 'p1', alias: 'Fus' }), tr(T.profilo(T.pano, /^Orc \(Hacker, Hacking Device/), { id: 'p4', alias: 'Orc' })], 'NOMADI');
        const NS = S.nomadi.g; S.apriMenu(S.nomadi, 0); NS.selectAction('ATTACCO BS', false); NS.declareAttackBS('Heavy Machine Gun');
        NS.toggleTargetSelection('p1'); NS.toggleTargetSelection('p4');
        ok(J(NS.pendingTargets.map(t => t.id)) === '["p1","p4"]', 'CONTROPROVA: nell Ordine singolo i due tocchi danno due bersagli', NS.pendingTargets.map(t => t.id));
        const K = tavolo(T => [tr(P_(T, /^Alguacil \(Missile/), { id: 'n3', alias: 'Razzo' }), tr(P_(T, /^Alguacil \(Combi/), { id: 'n1', alias: 'Greg' })],
                         T => [tr(T.profilo(T.pano, /^Fusilier \(Combi/), { id: 'p1', alias: 'Fus' }), tr(T.profilo(T.pano, /^Orc \(Hacker, Hacking Device/), { id: 'p4', alias: 'Orc' })], 'NOMADI');
        const NK = coordina(K, [0, 1]); NK.selectAction('ATTACCO BS', false);
        const fk = Object.keys(NK._modiBS || {})[0]; NK.declareAttackBS(NK._modiBS[fk].find(x => /Blast/.test(x)), fk);
        NK.toggleTargetSelection('p1'); NK.toggleTargetSelection('p4');
        ok(J(NK.pendingTargets.map(t => t.id)) === '["p1","p4"]', 'CONTROPROVA: Coordinato con la Sagoma d Impatto, il secondario si aggiunge', NK.pendingTargets.map(t => t.id));
    }
    // La porta d'invio.
    const al = N.roster.find(u => u.id === 'n1'), hm = N.roster.find(u => u.id === 'n2');
    const fs_ = M.rosterNemico().find(u => u.id === 'p1'), orc = M.rosterNemico().find(u => u.id === 'p4');
    const b = (u) => ({ id: u.id, name: u.alias, burst: 1, cover: false, rangeIndex: 0, rangeMod: 0, terrain: 'NESSUNO' });
    const pay = (b1, b2, coord) => M.creaPayload([{ attaccante: hm, azione: M.AZIONI.BS_ATTACK, arma: M.profiloArma('Heavy Machine Gun'), burstDisponibile: 2, bersagli: b1 },
        { attaccante: al, azione: M.AZIONI.BS_ATTACK, arma: M.profiloArma('Combi Rifle'), burstDisponibile: 1, bersagli: b2 }], { isCoordinated: coord !== false });
    const cod = (r) => (r.errori || []).map(e => e.codice);
    ok(J(cod(pay([b(fs_)], [b(orc)]))) === '["E61"]', 'in console: due partecipanti su bersagli diversi -> E61', cod(pay([b(fs_)], [b(orc)])));
    ok(J(cod(pay([b(fs_), b(orc)], [b(fs_)]))) === '["E60"]', 'una truppa con due bersagli -> E60', cod(pay([b(fs_), b(orc)], [b(fs_)])));
    ok(pay([b(fs_)], [b(fs_)]).ok === true, 'CONTROPROVA: tutti sul Fusilier, la busta passa');
    ok(pay([b(fs_), b(orc)], [b(orc)], false).ok === true, 'CONTROPROVA: fuori dal Coordinato due bersagli restano leciti');
    const ml = M.creaPayload([{ attaccante: Object.assign({}, hm, { weapon: 'Missile Launcher' }), azione: M.AZIONI.BS_ATTACK, arma: M.profiloArma('Missile Launcher (Blast Mode)'), burstDisponibile: 1,
        bersagli: [Object.assign(b(fs_), { ruolo: 'principale' }), Object.assign(b(orc), { ruolo: 'secondario' })] }, { attaccante: al, azione: M.AZIONI.BS_ATTACK, arma: M.profiloArma('Combi Rifle'), burstDisponibile: 1, bersagli: [b(fs_)] }], { isCoordinated: true });
    ok(!cod(ml).some(c => c === 'E60' || c === 'E61'), 'CONTROPROVA: con una Sagoma d Impatto il secondario sotto l area resta ammesso', cod(ml));
});

sezione('10. CO-03: un membro di un Fireteam non partecipa a un Coordinato (E49)', () => {
    const ft = (id, alias, re, lead) => (T) => tr(P_(T, re), { id, alias, states: { fireteam: 'A', isFireteamLeader: !!lead } });
    const T = tavolo(T => [ft('n1', 'Uno', /^Alguacil \(Combi/, true)(T), tr(P_(T, /^Alguacil \(HMG/), { id: 'n2', alias: 'Due' }),
                           ft('n3', 'Tre', /^Alguacil \(Missile/)(T), ft('n4', 'Quattro', /^Alguacil \(Forward/)(T), ft('n5', 'Cinque', /^Alguacil \(Paramedic/)(T)],
                     T => [tr(T.profilo(T.pano, /^Fusilier \(Combi/), { id: 'p1', alias: 'Fus' })], 'NOMADI');
    const N = coordina(T, [1, 0]);
    ok(N.alert_.some(a => /ORDINE COORDINATO NON VALIDO[\s\S]*Uno: fa parte del Fireteam A, non partecipa a un Ordine Coordinato/.test(a)), 'Coordinato con #2 Punta e #1 Leader del Fireteam: rifiutato, col motivo dell E49', N.alert_.map(a => a.slice(0, 90)));
    ok(!/selectAction\(/.test(String(T.nomadi.el('action-list-container').innerHTML)), 'e il menu degli Ordini non si apre');
    N.roster[0].states = {};
    coordina(T, [1, 0]);
    ok(N.alert_.length === 0, 'CONTROPROVA: tolto il #1 dal Fireteam, il Coordinato parte');
    N.selectAction('ATTACCO BS', false); N.declareAttackBS('Heavy Machine Gun'); N.toggleTargetSelection('p1'); N.confirmMultiAro(false); T.giro(); T.pano.g.annullaAro(); T.giro(); secondaMeta(T, N);
    N.eseguiCalcoloBS(); N.declareAttackBS('Combi Rifle');
    ok(N.totalBurst === 1 && (N.burstDettaglio.voci || []).some(v => /Gregario in Ordine Coordinato: Burst 1/.test(v.motivo)), 'e il #1 gregario ha Burst 1', N.totalBurst);
    N.eseguiCalcoloBS(); T.giro();
    ok(ris(T) && /Uno Azione: ATTACCO BS Successo al: 14 \(o meno\) Dadi da lanciare: 1/.test(tab(T)), 'sul tabellone: 14, un dado');
});

sezione('11. CO-09: una lista salvata senza chars, Regolari e Irregolari (E44)', () => {
    const vecchio = (p) => { const c = JSON.parse(J(p)); delete c.chars; return c; };
    const prova = (re1, re2) => { const T = tavolo(T => [tr(vecchio(P_(T, re1)), { id: 'n1', alias: 'A' }), tr(vecchio(P_(T, re2)), { id: 'n2', alias: 'B' })],
        T => [tr(T.profilo(T.pano, /^Fusilier \(Combi/), { id: 'p1', alias: 'Fus' })], 'NOMADI');
        const N = coordina(T, [0, 1]); return { N, chars: N.roster.some(u => 'chars' in u) }; };
    const a = prova(/^Morlock \(Assault/, /^Mobile Brigada \(HMG/);
    ok(!a.chars && a.N.alert_.some(a_ => /Addestramento diverso: Regolari e Irregolari/.test(a_)), 'Morlock + Mobile Brigada da una lista senza chars: E44 (prima passava)', a.N.alert_.map(x => x.slice(0, 80)));
    const b = prova(/^Morlock \(Assault/, /^Morlock \(Kobra/);
    ok(!b.chars && b.N.alert_.length === 0, 'CONTROPROVA: due Morlock (due Irregolari) passano', b.N.alert_);
});

sezione('12. CO-10: l Idle di un solo partecipante; il bersaglio senza requisito nell Ordine singolo', () => {
    const T = tavolo(T => [tr(P_(T, /^Alguacil \(Missile/), { id: 'n3', alias: 'Razzo' }), tr(P_(T, /^Alguacil \(Combi/), { id: 'n1', alias: 'Greg' })],
                     T => [tr(T.profilo(T.pano, /^Fusilier \(Combi/), { id: 'p1', alias: 'Fus' })], 'NOMADI');
    const N = coordina(T, [0, 1]), P = T.pano.g;
    N.selectAction('ATTACCO BS', false); const fam = Object.keys(N._modiBS || {})[0]; N.declareAttackBS(N._modiBS[fam].find(x => /Hit/.test(x)), fam);
    N.toggleTargetSelection('p1'); N.confirmMultiAro(false); T.giro(); P.annullaAro(); T.giro(); secondaMeta(T, N);
    const bande = (String(T.nomadi.el('targets-allocation-container').innerHTML).match(/<span>[^<]*<\/span>/g) || []).map(x => x.replace(/<\/?span>/g, ''));
    N.setTargetRangeBS(0, bande.indexOf('48-56"'));
    ok(bande.indexOf('48-56"') >= 0 && T.nomadi.el('btn-esegui-calcolo').innerText === 'ESEGUI CALCOLO', 'la Punta (Missile Launcher) a 48-56": in gittata, ESEGUI CALCOLO');
    N.eseguiCalcoloBS(); N.declareAttackBS('Combi Rifle'); N.toggleFuoriGittataBS(0);
    const tasto = T.nomadi.el('btn-esegui-calcolo');
    ok(tasto.innerText === 'IDLE (SOLO QUESTA TRUPPA)', 'il gregario (Combi Rifle, fino a 48") FUORI: il tasto dice «IDLE (SOLO QUESTA TRUPPA)»', tasto.innerText);
    const dom = []; N.confirm = (m) => { dom.push(String(m)); return true; };
    const s = spia(N); N.alert_.length = 0; tasto.onclick(); T.giro();
    ok(s.n === 1 && J(s.p.map(x => x.b)) === '[[1],[0]]', 'parte UNA busta: la Punta con 1 dado, il gregario a Burst 0', s.p && s.p.map(x => x.b));
    const t = tab(T);
    ok(ris(T) && /Razzo Azione: ATTACCO BS Successo al: 8 \(o meno\) Dadi da lanciare: 1/.test(t), 'sul tabellone il tiro della Punta: 8 (11 -3)', t.slice(0, 120));
    ok(/IDLE \(REQUISITO FALLITO\) ▶ ATTIVO NOMADI Greg Azione: ATTACCO BS IDLE/.test(t) && /Greg: requisito non soddisfatto contro Fus \(fallimento automatico: fuori gittata\)/.test(t), 'e l IDLE (REQUISITO FALLITO) del gregario, col motivo');
    // 🔴 GIRATA IL 23 OTTOBRE (sera), motore 2026-10-23.8: l'avviso dell'Idle
    // del partecipante e` A110, gravita` 'nota': niente finestra «Prima di
    // calcolare…». Prima era A101 con gravita` 'azione', e Annulla fermava tutto.
    ok(dom.length === 0, 'nessuna finestra «Prima di calcolare…» (A110 e` una nota)', dom.map(x => x.slice(0, 60)));
    ok(N.MotoreN5.gravitaAvviso('A110') === 'nota' && N.MotoreN5.gravitaAvviso('A101') === 'azione', 'gravita`: A110 nota, A101 (programma da piu` dispositivi) resta azione',
       [N.MotoreN5.gravitaAvviso('A110'), N.MotoreN5.gravitaAvviso('A101')]);
    // Anche se il dispositivo rispondesse Annulla a una finestra, la finestra non c'e`: l'Ordine parte.
    {
        const T2 = tavolo(T => [tr(P_(T, /^Alguacil \(Missile/), { id: 'n3', alias: 'Razzo' }), tr(P_(T, /^Alguacil \(Combi/), { id: 'n1', alias: 'Greg' })],
                          T => [tr(T.profilo(T.pano, /^Fusilier \(Combi/), { id: 'p1', alias: 'Fus' })], 'NOMADI');
        const N2 = coordina(T2, [0, 1]);
        N2.selectAction('ATTACCO BS', false); const f2 = Object.keys(N2._modiBS || {})[0]; N2.declareAttackBS(N2._modiBS[f2].find(x => /Hit/.test(x)), f2);
        N2.toggleTargetSelection('p1'); N2.confirmMultiAro(false); T2.giro(); T2.pano.g.annullaAro(); T2.giro(); secondaMeta(T2, N2);
        N2.eseguiCalcoloBS(); N2.declareAttackBS('Combi Rifle'); N2.toggleFuoriGittataBS(0);
        N2.confirm = () => false; T2.nomadi.el('btn-esegui-calcolo').onclick(); T2.giro();
        ok(ris(T2) && /Razzo Azione: ATTACCO BS Successo al: 8/.test(tab(T2)) && !N2.alert_.some(a => /UI01|annullato/i.test(a)), 'con confirm che direbbe Annulla l Ordine parte lo stesso: la Punta tira (niente UI01)', N2.alert_.map(x => x.slice(0, 80)));
    }
    // A110 e non E20, dalla porta d'invio.
    const M = N.MotoreN5, f = M.rosterNemico()[0];
    const g0 = (extra) => M.creaPayload([{ attaccante: N.roster[1], azione: M.AZIONI.BS_ATTACK, arma: M.profiloArma('Combi Rifle'), burstDisponibile: 1,
        bersagli: [Object.assign({ id: f.id, name: f.alias, burst: 0, cover: false, rangeIndex: 0, rangeMod: 3, terrain: 'NESSUNO' }, extra)] }], {});
    const r1 = g0({ requisitoMancante: 'fallimento automatico: fuori gittata' }), r2 = g0({});
    ok(r1.ok === true && (r1.avvisi || []).some(a => a.codice === 'A110' && a.gravita === 'nota') && !(r1.avvisi || []).some(a => a.codice === 'A101') && !(r1.errori || []).length,
       'zero dadi perche` a tutti i bersagli manca il requisito: avviso A110 (nota), non A101 ne` E20', (r1.avvisi || []).map(a => a.codice + ':' + a.gravita));
    ok(r2.ok === false && (r2.errori || []).some(e => e.codice === 'E20'), 'CONTROPROVA: zero dadi senza requisito mancante resta E20');
    // Ordine singolo: un bersaglio senza Linea di Tiro, l'altro si`.
    const S = tavolo(T => [tr(P_(T, /^Alguacil \(HMG/), { id: 'n1', alias: 'Spara' })], T => [tr(T.profilo(T.pano, /^Fusilier \(Combi/), { id: 'p1', alias: 'Uno' }), tr(T.profilo(T.pano, /^Fusilier \(Combi/), { id: 'p2', alias: 'Due' })], 'NOMADI');
    const NS = S.nomadi.g; S.apriMenu(S.nomadi, 0); NS.selectAction('ATTACCO BS', false); NS.declareAttackBS('Heavy Machine Gun');
    NS.toggleTargetSelection('p1'); NS.toggleTargetSelection('p2'); NS.confirmMultiAro(false); S.giro(); S.pano.g.annullaAro(); S.giro();
    NS.goToModifiersBS('IDLE'); while (NS.combatTargets[0].burst > 2) NS.adjustTargetBurstBS(0, -1); while (NS.combatTargets[1].burst < 2) NS.adjustTargetBurstBS(1, 1); NS.toggleLineaDiTiroBS(1);
    NS.eseguiCalcoloBS(); S.giro();
    const ts = tab(S);
    ok((S.hub.g.ultimiScontri || []).length === 2 && /Spara Azione: ATTACCO BS Successo al: \d+ \(o meno\) Dadi da lanciare: 2/.test(ts) && /IDLE \(REQUISITO FALLITO\) ▶ ATTIVO NOMADI Spara Azione: ATTACCO BS IDLE[\s\S]*REATTIVO PANOCEANIA Due/.test(ts),
       'Ordine singolo: 2 dadi su Uno, e su Due (senza LoF) uno scontro IDLE (REQUISITO FALLITO) invece del silenzio', (S.hub.g.ultimiScontri || []).length);
});

sezione('13. TER-06: il Fuoco Speculativo non ha la casella del terreno; l Attacco BS si`', () => {
    const giro = (spec) => {
        const T = conTerreni(T => [tr(P_(T, /^Marspider \(Grenades/), { id: 'n1', alias: 'Ragno' })], T => [tr(T.profilo(T.pano, /^Fusilier \(Combi/), { id: 'p1', alias: 'Fus' })], ['TER_10']);
        const N = T.nomadi.g, P = T.pano.g; T.apriMenu(T.nomadi, 0);
        if (spec) {
            N.selectAction('FUOCO SPECULATIVO', false);
            vm.runInContext((String(T.nomadi.el('weapon-buttons-container').innerHTML).match(/onclick="(window\.declareSpeculativoAttack\('Grenades[^']*'\))"/) || [])[1] || 'void 0', N);
            N.toccaBersaglioSpeculativo('p1'); N.confirmMultiAro(false); T.giro(); P.annullaAro(); T.giro(); secondaMeta(T, N);
            const h = String(T.nomadi.el('targets-allocation-container').innerHTML);
            N.eseguiCalcoloSpeculativo(); T.giro(); return { h, t: tab(T) };
        }
        N.selectAction('ATTACCO BS', false); N.declareAttackBS('Grenades(+1B)'); N.toggleTargetSelection('p1'); N.confirmMultiAro(false); T.giro(); P.annullaAro(); T.giro();
        N.goToModifiersBS('IDLE'); const h = String(T.nomadi.el('targets-allocation-container').innerHTML); const b0 = N.totalBurst;
        N.setTargetTerrenoBS(0, 'TER_10'); N.eseguiCalcoloBS(); T.giro(); return { h, b0, t: tab(T) };
    };
    const a = giro(true);
    ok(!/scelta-terreno|setTargetTerreno/.test(a.h), 'FUOCO SPECULATIVO: nella pagina della gittata la casella del terreno NON c e');
    ok(/Ragno Azione: FUOCO SPECULATIVO Successo al: 10 \(o meno\)/.test(a.t) && /Fuoco Speculativo: ignora i MOD NEGATIVI di Copertura, Mimetismo e Zone di Visibilità\./.test(a.t) && !/Bassa Visibilit/.test(a.t),
       'sul tabellone 10 (13 +3 -6), con la nota «ignora i MOD NEGATIVI…», nessuna Bassa Visibilita`');
    const b = giro(false);
    ok(/scelta-terreno/.test(b.h) && b.b0 === 2, 'ATTACCO BS con le stesse Grenades(+1B): la casella c e, Burst 2', b.b0);
    ok(/Ragno Azione: ATTACCO BS Successo al: 13 \(o meno\) Dadi da lanciare: 1/.test(b.t) && /Zona di Saturazione: -1 B\. Bassa Visibilità: -3 BS\./.test(b.t), 'nel Bosco: 13 (13 +3 -3) e un dado (Burst 2 -1)');
});

sezione('14. TER-07: la Saturazione si applica DOPO la divisione, al Burst di ogni bersaglio', () => {
    const giro = (b0, b1, t0, t1) => {
        const T = conTerreni(T => [tr(P_(T, /^Alguacil \(HMG/), { id: 'n1', alias: 'Spara' })],
                             T => [tr(T.profilo(T.pano, /^Fusilier \(Combi/), { id: 'p1', alias: 'Uno' }), tr(T.profilo(T.pano, /^Fusilier \(Missile/), { id: 'p2', alias: 'Due' })], ['TER_10', 'TER_11']);
        const N = T.nomadi.g; T.apriMenu(T.nomadi, 0); N.selectAction('ATTACCO BS', false); N.declareAttackBS('Heavy Machine Gun');
        N.toggleTargetSelection('p1'); N.toggleTargetSelection('p2'); N.confirmMultiAro(false); T.giro(); T.pano.g.annullaAro(); T.giro();
        N.goToModifiersBS('IDLE'); if (t0) N.setTargetTerrenoBS(0, t0); if (t1) N.setTargetTerrenoBS(1, t1);
        const da = N.totalBurst, partenza = N.combatTargets.map(t => t.burst);
        // 🔴 26 ottobre (DIS-05, ordine_attacco_bs 2026-10-26.2): la partenza non e`
        // piu` tutto sul primo, e` a giro (2+2). Il helper portava il Burst in un
        // verso solo e non arrivava piu` a 3+1: ora si porta nei due versi.
        const C = N.combatTargets;
        for (let k = 0; k < 12 && (C[0].burst !== b0 || C[1].burst !== b1); k++) {
            if (C[1].burst > b1) N.adjustTargetBurstBS(1, -1);
            else if (C[0].burst < b0) N.adjustTargetBurstBS(0, 1);
            else if (C[0].burst > b0) N.adjustTargetBurstBS(0, -1);
            else if (C[1].burst < b1) N.adjustTargetBurstBS(1, 1);
        }
        N.setTargetRangeBS(0, 1); N.setTargetRangeBS(1, 1); N.eseguiCalcoloBS(); T.giro();
        const sc = T.hub.g.ultimiScontri || [];
        const d = (n) => { const s = sc.find(x => J(x.reattivo || {}).indexOf(n) >= 0) || {}; return ((s.attivo || {}).dati || {}).burst; };
        return { da, partenza, b: [d('Uno'), d('Due')] };
    };
    const a = giro(2, 2, 'TER_10', 'TER_10');
    ok(J(a.partenza) === '[2,2]', 'DIS-05: 4 dadi su due bersagli partono a giro, 2+2 (era tutto sul primo)', a.partenza);
    ok(a.da === 4 && J(a.b) === '[1,1]', 'Heavy Machine Gun, i due Fusilier nel Bosco: 4 dadi da dividere, 2+2 -> 1+1', a);
    ok(J(giro(3, 1, 'TER_10', 'TER_10').b) === '[2,1]', '3+1 -> 2+1 (mai sotto 1)');
    ok(J(giro(2, 2, 'TER_10', null).b) === '[1,2]', 'CONTROPROVA: il #2 senza terreno, 2+2 -> 1+2');
    ok(J(giro(2, 2, 'TER_10,TER_11', 'TER_10,TER_11').b) === '[1,1]', 'Bosco + Giungla: 1+1, una sola Saturazione per bersaglio');
});

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
