// @versione 2026-10-20.4 | test_novita_20ott.js | proprieta`: chat TEST
// ============================================================================
//  Le novita` del giro del 20 ottobre (motore e catalogo 2026-10-20.2,
//  logica_stati e ordine_movimento 2026-10-20.1; database Nomadi/PanOceania 2026-10-20.1;
//  app, roster_manager, controller 2026-10-20.1), viste dal MOTORE da solo e
//  dai tre dispositivi (app Nomadi, app PanOceania, Hub) con pagine intere.
//  Copre cio` che test_elenchi_e_tabellone (INTERFACCIA, sez. 25d e 26) non
//  copre:
//   1. Database: coppie di profili, smonta, espelle, secondari, righe
//      sceglibili, "(Escape System -3)" — nei due versi.
//   2. Secondo profilo a senso unico (Puppetbot Red Fury, piano #17) dalla
//      pagina degli stati: BS 11, ARM 0, soprannome/ferite/stati uguali; poi
//      il pulsante non c'e` piu`; l'Hub riceve l'AGGIORNAMENTO.
//   3. Transmutation (WIP), Switcher: PASSA (CC 23), TORNA a mano, e al
//      cambio turno torna da solo (CC 15) con l'AGGIORNAMENTO all'Hub.
//      Controprova: il Puppetbot Battle Ravaged non torna.
//   4. Moto: Moto Isolata / Immobilizzata / Morta -> RISALI negato.
//   5. Escape System: RISALI col TAG ferito tiene le ferite; TAG Morto ->
//      negato; secondo Escape negato.
//   6. Marker numerati PER SEGNALINO (motore 2026-10-20.2): serie CAMO,
//      CAMO-3, CAMO-6, IMP-1, IMP-2; chi si rivela libera il numero; da IMP-1
//      a IMP-2 cambia serie; l'undicesimo ha il numero ma non l'immagine.
//   7. MOVIMENTO.senzaTiro: le tre voci di trasporto.
//   8. ARO: l'arma col valore di profilo tiene il nome ("DA CC Weapon(PS=5)").
//   9. Fumo in ARO (Paolo): Morlock con Smoke Grenades contro l'ATTACCO BS
//      di un Fusilier -> Faccia a Faccia PH contro BS, nessuna salvezza per
//      il Fusilier; con un MSV i tiri non sono opposti. Misurato fino al
//      tabellone dell'Hub.
//  10. I due difetti del cap. 31 corretti (motore 20.3, ordine_movimento 20.2,
//      controller 20.2): Sagoma Diretta del reattivo = Tiro Normale e COLPO
//      AUTOMATICO sul tabellone; seconda meta` filtrata; munizione della
//      reazione dall arma; nota del Fumo; M.nomeAzione.
//  11. Motore 2026-10-20.4: la Schivata dell'attiva contro un koala o una mina
//      (e il Reset contro una Cybermine) sta DENTRO lo scontro della
//      detonazione: uno scontro, non due. Il koala fino al tabellone dell'Hub;
//      mina, Cybermine e controprove dall'adattatore (generaRisoluzioneDaDati).
//      11c (motore 2026-10-20.5): nello scontro unito i dettagli della difesa
//      ripartono da «Statistica Base (PH): 10» / «(WIP): 12».
//  L'harness creaTavolo e` lo stesso di test_elenchi_e_tabellone.js
//  (INTERFACCIA): copiato qui perche` ogni banco basti a se stesso.
//  USO:  CARTELLA=/percorso/ node test_novita_20ott.js
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

const vmTocco = (d, codice) => vm.runInContext(codice, d.g);

// Un tavolo vuoto basta per il motore e il database come li vede l'app.
const T0 = creaTavolo(DIR); const G0 = T0.nomadi.g, M = G0.MotoreN5;
const DBN = G0.DB_NOMADI || [], DBP = G0.DB_PANOCEANIA || [], TUTTI = DBN.concat(DBP);
const perId = (id) => TUTTI.find(p => p.id === id);
const unita = (id, altro) => Object.assign(JSON.parse(J(perId(id))), { states: {}, deployState: 'NORMAL', state: 'ACTIVE', combatGroup: 1 }, altro || {});

sezione('1. Database del 20 ottobre: coppie, smonta, espelle, secondari (nei due versi)', () => {
    ok(DBN.length === 377 && DBP.length === 368, 'premessa: 377 + 368 = 745 profili', [DBN.length, DBP.length]);
    const conta = (db, k) => db.filter(p => p[k]).length;
    ok(conta(DBN, 'profiloTrasformato') + conta(DBP, 'profiloTrasformato') === 35, 'profiloTrasformato su 35 profili', [conta(DBN, 'profiloTrasformato'), conta(DBP, 'profiloTrasformato')]);
    ok(J(TUTTI.filter(p => p.smonta).map(p => p.id).sort()) === J(['zondnautica_a', 'zondnautica_b', 'zondnautica_c']), 'smonta: solo Zondnautica-A/B/C', TUTTI.filter(p => p.smonta).map(p => p.id));
    const esp = TUTTI.filter(p => p.espelle);
    ok(esp.length === 7 && esp.every(p => /^(Anaconda|Maximus)/.test(p.nome)), 'espelle: 7 TAG, tutti Anaconda o Maximus', esp.map(p => p.nome));
    ok(conta(DBN, 'profiloSecondario') === 26 && conta(DBP, 'profiloSecondario') === 18, 'profiloSecondario: Nomadi 26, PanOceania 18', [conta(DBN, 'profiloSecondario'), conta(DBP, 'profiloSecondario')]);
    ok(DBN.filter(p => !p.profiloSecondario).length === 351 && DBP.filter(p => !p.profiloSecondario).length === 350, 'righe sceglibili: Nomadi 351, PanOceania 350');
    // Verso 1: ogni rimando punta a un profilo esistente, secondario, della stessa fazione.
    const rimandi = [];
    [[DBN, 'N'], [DBP, 'P']].forEach(([db, f]) => db.forEach(p => {
        if (p.profiloTrasformato) rimandi.push([p.id, p.profiloTrasformato, db]);
        if (p.smonta) { rimandi.push([p.id, p.smonta.pilota, db]); rimandi.push([p.id, p.smonta.periferico, db]); }
        if (p.espelle) rimandi.push([p.id, p.espelle.pilota, db]);
    }));
    const rotti = rimandi.filter(([da, a, db]) => { const q = db.find(x => x.id === a); return !q || !q.profiloSecondario; });
    ok(rimandi.length === 35 + 6 + 7 && rotti.length === 0, 'ogni rimando (' + rimandi.length + ') trova un profilo SECONDARIO della stessa fazione', rotti.map(r => r[0] + '->' + r[1]));
    // Verso 2: ogni secondario e` raggiunto da almeno un rimando (nessun orfano).
    const raggiunti = new Set(rimandi.map(r => r[1]));
    const orfani = TUTTI.filter(p => p.profiloSecondario && !raggiunti.has(p.id));
    ok(orfani.length === 0, 'CONTROPROVA: nessun profilo secondario orfano (nessuno lo raggiunge)', orfani.map(p => p.id));
    // Nessun profilo e` insieme sceglibile-con-rimando e secondario (catene).
    ok(TUTTI.filter(p => p.profiloSecondario && (p.profiloTrasformato || p.smonta || p.espelle)).length === 0, 'un profilo secondario non rimanda a un terzo profilo');
    const testo = J(TUTTI);
    ok(!/Escape System -3 \)/.test(testo) && (testo.match(/Escape System -3\)/g) || []).length === 3, '"(Escape System -3 )" normalizzato: 3 volte "(Escape System -3)", nessuna con lo spazio');
});


// --- pagina degli stati: i tasti di profilo -------------------------------
const pagStati = (d, i) => { d.g.apriPaginaStati(i); return String(d.el('states-content').innerHTML); };
const tasto = (h, fn) => (h.match(new RegExp('onclick="(window\\.' + fn + '\\(\\))"')) || [])[1];
const hubN = (T, id) => (T.hub.g.gameState.nomads || []).find(u => u.id === id);

sezione('2. Secondo profilo a senso unico: Puppetbot (Red Fury), piano #17', () => {
    const T = tavolo(T => [tr(P_(T, /^Puppetbot \(Red Fury\)$/), { id: 'n1', alias: 'Pupo', imgVariant: 'puppetbot_1.png', states: { targeted: true } }),
                           tr(P_(T, /^Alguacil \(Combi/), { id: 'n2', alias: 'Testimone' })],
                     T => [tr(P_(T, /^Fusilier \(Combi/), { id: 'p1', alias: 'Due' })], 'NOMADI');
    const N = T.nomadi.g;
    ok(N.roster[0].bs === 12 && N.roster[0].arm === 1, 'premessa: primo profilo BS 12, ARM 1', [N.roster[0].bs, N.roster[0].arm]);
    const h = pagStati(T.nomadi, 0);
    const t = tasto(h, 'cambiaProfiloDaStati');
    ok(!!t && /PASSA AL PROFILO: Puppetbot \(Red Fury\) - Battle Ravaged/.test(tx(h)), 'nella pagina degli stati: PASSA AL PROFILO: Puppetbot (Red Fury) - Battle Ravaged', tx(h).match(/PASSA AL PROFILO[^.]*/));
    ok(!/TIRO RIUSCITO/.test(tx(h)) && !tasto(h, 'tornaPrimoProfiloDaStati'), 'non e` una (WIP): niente "TIRO RIUSCITO", niente TORNA');
    ok(!tasto(pagStati(T.nomadi, 1), 'cambiaProfiloDaStati'), 'CONTROPROVA: l Alguacil non ha il tasto');
    pagStati(T.nomadi, 0); vmTocco(T.nomadi, t); T.giro();
    const u = N.roster.find(x => x.id === 'n1');
    ok(u.nome === 'Puppetbot (Red Fury) - Battle Ravaged' && u.bs === 11 && u.arm === 0, 'toccato: Battle Ravaged, BS 11, ARM 0', [u.nome, u.bs, u.arm]);
    ok(u.alias === 'Pupo' && u.states.targeted === true && u.combatGroup === 1 && u.imgVariant === 'puppetbot_1.png' && u.str === 2,
       'soprannome, Stati (Bersagliato), Gruppo, foto e STR restano', [u.alias, u.states.targeted, u.combatGroup, u.imgVariant, u.str]);
    ok(N.alert_.length === 0 && N.errori.length === 0, 'nessun alert, nessun errore', N.alert_.concat(N.errori));
    const hu = hubN(T, 'n1');
    ok(hu && hu.bs === 11 && hu.arm === 0, 'l Hub riceve l AGGIORNAMENTO: BS 11, ARM 0', hu && [hu.bs, hu.arm, hu.nome]);
    const h2 = pagStati(T.nomadi, N.roster.indexOf(u));
    ok(!tasto(h2, 'cambiaProfiloDaStati') && !tasto(h2, 'tornaPrimoProfiloDaStati') && /Secondo profilo in uso/.test(tx(h2)), 'riaperta la pagina: il pulsante non c e` piu`, resta la scritta "Secondo profilo in uso"');
    ok(M.trasforma(u).possibile === false, 'CONTROPROVA dal motore: una seconda trasformazione e` negata');
});

sezione('3. Transmutation (WIP): Switcher, a mano e al cambio turno', () => {
    const T = tavolo(T => [tr(P_(T, /^Switcher$/), { id: 'n1', alias: 'Cambia' }),
                           tr(P_(T, /^Puppetbot \(Red Fury\)$/), { id: 'n2', alias: 'Pupo' })],
                     T => [tr(P_(T, /^Fusilier \(Combi/), { id: 'p1', alias: 'Due' })], 'NOMADI');
    const N = T.nomadi.g;
    const sw = () => N.roster.find(x => x.id === 'n1');
    ok(sw().cc === 15 && /Transmutation \(WIP/i.test(sw().skills || ''), 'premessa: Switcher, CC 15, Transmutation (WIP)', [sw().cc, (String(sw().skills).match(/Transmutation[^,]*/) || [])[0]]);
    let h = pagStati(T.nomadi, 0);
    ok(/TIRO RIUSCITO: PASSA AL PROFILO: Switcher - Enhanced Profile/.test(tx(h)) && /WIP 13/.test(tx(h)), 'il tasto dice TIRO RIUSCITO e il tiro (WIP 13)', (tx(h).match(/TIRO RIUSCITO[^.]*\.[^.]*/) || [])[0]);
    vmTocco(T.nomadi, tasto(h, 'cambiaProfiloDaStati')); T.giro();
    ok(sw().nome === 'Switcher - Enhanced Profile' && sw().cc === 23 && sw().alias === 'Cambia', 'PASSA: Enhanced Profile, CC 23, soprannome uguale', [sw().nome, sw().cc]);
    ok((hubN(T, 'n1') || {}).cc === 23, 'l Hub vede CC 23');
    h = pagStati(T.nomadi, 0);
    ok(!!tasto(h, 'tornaPrimoProfiloDaStati') && !tasto(h, 'cambiaProfiloDaStati'), 'riaperta: c e` TORNA AL PRIMO PROFILO, non PASSA');
    vmTocco(T.nomadi, tasto(h, 'tornaPrimoProfiloDaStati')); T.giro();
    ok(sw().nome === 'Switcher' && sw().cc === 15 && !sw().trasformato, 'TORNA a mano: Switcher, CC 15', [sw().nome, sw().cc]);
    ok((hubN(T, 'n1') || {}).cc === 15, 'l Hub vede CC 15');
    // Di nuovo Enhanced, e il Puppetbot Battle Ravaged; poi il cambio turno.
    vmTocco(T.nomadi, tasto(pagStati(T.nomadi, 0), 'cambiaProfiloDaStati')); T.giro();
    vmTocco(T.nomadi, tasto(pagStati(T.nomadi, 1), 'cambiaProfiloDaStati')); T.giro();
    ok(sw().cc === 23 && N.roster[1].bs === 11, 'premessa: Switcher Enhanced (CC 23), Puppetbot Battle Ravaged (BS 11)');
    const prima = T.hub.g.gameState.activeFaction;
    T.hub.g.toggleTurn(); T.giro();
    ok(T.hub.g.gameState.activeFaction !== prima, 'il turno passa (' + prima + ' -> ' + T.hub.g.gameState.activeFaction + ')');
    ok(sw().nome === 'Switcher' && sw().cc === 15, 'al cambio turno lo Switcher torna da solo al primo profilo: CC 15', [sw().nome, sw().cc]);
    ok((hubN(T, 'n1') || {}).cc === 15, 'e l Hub lo sa (AGGIORNAMENTO): CC 15', (hubN(T, 'n1') || {}).cc);
    ok(N.roster[1].nome === 'Puppetbot (Red Fury) - Battle Ravaged' && N.roster[1].bs === 11 && (hubN(T, 'n2') || {}).bs === 11, 'CONTROPROVA: il Puppetbot Battle Ravaged NON torna (BS 11, anche all Hub)');
    // Un secondo cambio turno, con lo Switcher gia` al primo profilo: niente cambia.
    T.hub.g.toggleTurn(); T.giro();
    ok(sw().cc === 15 && N.roster[1].bs === 11, 'CONTROPROVA: un altro cambio turno non tocca niente');
    ok(N.errori.length === 0 && T.hub.g.errori.length === 0, 'nessun errore nelle pagine', N.errori.concat(T.hub.g.errori).slice(0, 2));
});

sezione('4. Moto: chi non puo` risalire', () => {
    const smo = M.smontaMoto(unita('zondnautica_a', { id: 'z1', alias: 'Zeta' }));
    ok(smo.possibile && smo.unitaAggiornata.nome === 'Zondnaut-A' && smo.nuova.id === 'z1_moto' && /Zondmate/.test(smo.nuova.nome) && smo.nuova.str === 1,
       'premessa: smontata, Zondnaut-A e la moto Zondmate (STR 1)', [smo.unitaAggiornata.nome, smo.nuova.id, smo.nuova.nome, smo.nuova.str]);
    const pil = smo.unitaAggiornata;
    const prova = (stati, extra) => M.rimontaMoto(pil, [pil, Object.assign(JSON.parse(J(smo.nuova)), { states: stati }, extra || {})]);
    ok(prova({}).possibile === true, 'CONTROPROVA: moto sana -> si risale');
    ok(prova({ isolated: true }).possibile === false, 'moto Isolata -> RISALI negato', prova({ isolated: true }).motivo);
    ok(prova({ immobilizedA: true }).possibile === false && prova({ immobilizedB: true }).possibile === false, 'moto Immobilizzata (A o B) -> negato');
    ok(prova({}, { state: 'DEAD' }).possibile === false, 'moto Morta -> negato');
    ok(M.rimontaMoto(pil, [pil]).possibile === false, 'moto non piu` sul tavolo -> negato');
    ok(M.smontaMoto(pil).possibile === false, 'il pilota a piedi non smonta una seconda volta');
    const ri = M.rimontaMoto(pil, [pil, smo.nuova]);
    ok(ri.possibile && ri.unitaAggiornata.nome === 'Zondnautica-A' && ri.rimuovi === 'z1_moto' && ri.unitaAggiornata.alias === 'Zeta', 'risalito: Zondnautica-A, la moto si toglie, il soprannome resta');
    ok(M.trasportoPossibile(unita('zondnautica_a'), 'SCENDI DALLA MOTO').puo === true && M.trasportoPossibile(unita('alguacil_combi') || unita(DBN.find(p => /^Alguacil/.test(p.nome)).id), 'SCENDI DALLA MOTO').puo === false,
       'trasportoPossibile: SCENDI si alla Zondnautica, no a un Alguacil');
});

sezione('5. Escape System: ferite, TAG Morto, secondo Escape', () => {
    const tag = unita('anaconda_heavy_machine_gun', { id: 't1', alias: 'Ana', states: { unconscious: false }, w: 3, ferite: 2, woundsTaken: 2 });
    const e = M.espelliPilota(tag);
    ok(e.possibile && e.unitaAggiornata.states.tagVuoto === true && e.nuova.id === 't1_pilota' && e.nuova.tagDi === 't1' && e.nuova.combatGroup === tag.combatGroup,
       'premessa: TAG vuoto, pilota t1_pilota nello stesso Gruppo');
    ok(e.nuova.nome === 'Operator (Spitfire)', 'il pilota dell Anaconda (HMG) Nomadi si chiama "Operator (Spitfire)" nel database', e.nuova.nome);
    ok(M.puoEspellere(e.unitaAggiornata).puo === false, 'un TAG gia` vuoto non espelle una seconda volta');
    ok(M.puoEspellere(unita(DBN.find(p => /^Alguacil/.test(p.nome)).id)).puo === false, 'CONTROPROVA: un Alguacil non ha Escape System');
    const vuoto = e.unitaAggiornata;
    const r = M.risaliSulTag(e.nuova, [vuoto, e.nuova]);
    ok(r.possibile && !r.unitaAggiornata.states.tagVuoto && r.rimuovi === 't1_pilota', 'risalito: il TAG non e` piu` vuoto, il pilota esce');
    ok(r.unitaAggiornata.ferite === 2 && r.unitaAggiornata.woundsTaken === 2 && r.unitaAggiornata.w === 3, 'il TAG tiene le ferite che aveva (campi intatti)', [r.unitaAggiornata.ferite, r.unitaAggiornata.woundsTaken, r.unitaAggiornata.w]);
    ok(M.risaliSulTag(e.nuova, [Object.assign({}, vuoto, { state: 'DEAD' }), e.nuova]).possibile === false, 'TAG Morto -> RISALI negato');
    ok(M.risaliSulTag(e.nuova, [e.nuova]).possibile === false, 'TAG non piu` sul tavolo -> negato');
    ok(M.risaliSulTag(unita(DBN.find(p => /^Alguacil/.test(p.nome)).id), [vuoto]).possibile === false, 'CONTROPROVA: chi non e` uscito da un TAG non risale');
});

sezione('6. Marker numerati PER SEGNALINO (motore 2026-10-20.2): CAMO / CAMO-3 / CAMO-6, IMP-1 / IMP-2', () => {
    // Il tipo di segnalino lo decide il motore: il Mimetismo del profilo per i
    // CAMO, il livello per gli IMP. Profili scelti dal database per Mimetismo.
    const mim = (p) => (String(p.skills).match(/Mimetism \((-\d)\)/) || [])[1] || '';
    const conCamo = DBN.filter(p => /Camouflage/.test(p.skills) && !p.profiloSecondario);
    const pS = conCamo.find(p => !mim(p)), p3 = conCamo.find(p => mim(p) === '-3'), p6 = conCamo.find(p => mim(p) === '-6');
    ok(!!(pS && p3 && p6), 'premessa: un profilo con Camouflage senza Mimetismo, uno col -3, uno col -6', [pS && pS.nome, p3 && p3.nome, p6 && p6.nome]);
    const mk = (p, id, dep, st) => Object.assign(JSON.parse(J(p)), { id, alias: id, deployState: dep, states: st, state: 'ACTIVE' });
    const camo = (p, id) => mk(p, id, 'CAMO', { camo: true });
    const imp = (id, liv) => mk(pS, id, 'IMP_' + liv, { impersonation: true });
    // Il caso del piano: un CAMO semplice, un CAMO-3, un CAMO-6 e due IMP-1.
    const r = [camo(pS, 'a'), camo(p3, 'b'), camo(p6, 'c'), imp('i1', 1), imp('i2', 1)];
    M.numeraMarker(r);
    ok(J(r.map(u => u.tipoNumeroMarker + ' ' + u.numeroMarker)) === J(['CAMO 1', 'CAMO-3 1', 'CAMO-6 1', 'IMP-1 1', 'IMP-1 2']),
       'CAMO 1, CAMO-3 1, CAMO-6 1, IMP-1 1, IMP-1 2: ogni segnalino ha la sua serie', r.map(u => u.tipoNumeroMarker + ' ' + u.numeroMarker));
    ok(J(r.map(u => M.etichettaMarker(u))) === J(['CAMO 1', 'CAMO-3 1', 'CAMO-6 1', 'IMP-1 1', 'IMP-1 2']), 'l etichetta nella propria app: «CAMO-3 1», «IMP-1 2»...');
    // All'avversario: nome del segnalino, aliasExtra, numero; e l'immagine della sua serie.
    const fuori = M.filtraPerAvversario(r);
    ok(J(fuori.map(u => u.alias)) === J(['SEGNALINO MIMETICO 1', 'SEGNALINO MIMETICO (-3) 1', 'SEGNALINO MIMETICO (-6) 1', 'PERSONAGGIO SCONOSCIUTO (IMP-1) 1', 'PERSONAGGIO SCONOSCIUTO (IMP-1) 2']),
       'all avversario: «SEGNALINO MIMETICO 1», «... (-3) 1», «... (-6) 1», «PERSONAGGIO SCONOSCIUTO (IMP-1) 1 / 2»', fuori.map(u => u.alias));
    ok(J(fuori.map(u => u.immagineMarker)) === J(['img/camo_1.png', 'img/camo-3_1.png', 'img/camo-6_1.png', 'img/imp-1_1.png', 'img/imp-1_2.png']),
       'e l immagine della sua serie', fuori.map(u => u.immagineMarker));
    const busta = J(fuori);
    const svelati = [pS.nome, p3.nome, p6.nome].filter(n => busta.indexOf(n) >= 0).concat(fuori.filter(u => /^[abc]$|^i\d$/.test(u.alias)).map(u => u.alias));
    ok(svelati.length === 0 && fuori.every(u => u.nome === 'MARKER'), 'CONTROPROVA: nel filtrato non c e ne il nome del profilo ne il soprannome (nome = "MARKER")', svelati);
    // Da IMP-1 a IMP-2: prende un numero nella serie IMP-2, gli altri tengono il loro.
    r[4].deployState = 'IMP_2'; M.numeraMarker(r);
    ok(r[4].tipoNumeroMarker === 'IMP-2' && r[4].numeroMarker === 1 && r[3].numeroMarker === 1 && r[0].numeroMarker === 1 && r[1].numeroMarker === 1,
       'i2 passa a IMP-2: IMP-2 1; gli altri tengono il loro', r.map(u => u.id + ':' + u.tipoNumeroMarker + u.numeroMarker));
    const ni = imp('i3', 1); r.push(ni); M.numeraMarker(r);
    ok(ni.numeroMarker === 2, 'un nuovo IMP-1 prende il 2 lasciato libero da i2', ni.numeroMarker);
    // Chi si rivela libera il numero; il prossimo della STESSA serie lo prende.
    r[1].deployState = 'NORMAL'; r[1].states = {}; M.numeraMarker(r);
    ok(r[1].numeroMarker === undefined && M.etichettaMarker(r[1]) === null, 'il CAMO-3 rivelato perde numero ed etichetta');
    const altro3 = camo(p3, 'd'), altroS = camo(pS, 'e'); r.push(altro3, altroS); M.numeraMarker(r);
    ok(altro3.tipoNumeroMarker === 'CAMO-3' && altro3.numeroMarker === 1 && altroS.tipoNumeroMarker === 'CAMO' && altroS.numeroMarker === 2,
       'il prossimo CAMO-3 prende CAMO-3 1 (liberato); un CAMO semplice prende CAMO 2 (la sua serie)', [altro3.tipoNumeroMarker + altro3.numeroMarker, altroS.tipoNumeroMarker + altroS.numeroMarker]);
    r[0].state = 'DEAD'; M.numeraMarker(r);
    ok(r[0].numeroMarker === undefined && altroS.numeroMarker === 2, 'un Marker Morto esce dal conto, gli altri restano');
    // Oltre le 10 immagini: il numero c'e`, l'immagine no; per ogni serie.
    const undici = Array.from({ length: 11 }, (_, i) => camo(p6, 'm' + i)); M.numeraMarker(undici);
    ok(undici[10].numeroMarker === 11 && M.etichettaMarker(undici[10]) === 'CAMO-6 11', 'l undicesimo CAMO-6 e` CAMO-6 11');
    ok(M.immagineMarker('CAMO-6', 10) === 'img/camo-6_10.png' && M.immagineMarker('CAMO-6', 11) === null && M.immagineMarker('CAMO-3', 2) === 'img/camo-3_2.png' && M.immagineMarker('IMP-2', 1) === 'img/imp-2_1.png',
       'immagini: camo-6_10 si, camo-6_11 no, camo-3_2 e imp-2_1 si');
    ok(M.immagineMarker('IMP', 1) === null, 'CONTROPROVA: la vecchia serie "IMP" (img/imp_1.png) non esiste piu`', M.immagineMarker('IMP', 1));
    const dop = [camo(pS, 'x'), camo(pS, 'y')]; dop.forEach(u => { u.numeroMarker = 1; u.tipoNumeroMarker = 'CAMO'; }); M.numeraMarker(dop);
    ok(J(dop.map(u => u.numeroMarker)) === '[1,2]', 'due CAMO col numero 1 (copie vecchie): il secondo diventa 2', dop.map(u => u.numeroMarker));
    // Una copia vecchia con tipoNumeroMarker 'IMP' (prima del 20.2) si rinumera nella serie giusta.
    const vecchio = imp('v', 2); vecchio.tipoNumeroMarker = 'IMP'; vecchio.numeroMarker = 1; M.numeraMarker([vecchio]);
    ok(vecchio.tipoNumeroMarker === 'IMP-2' && vecchio.numeroMarker === 1, 'una copia vecchia con tipo "IMP" passa alla serie IMP-2', [vecchio.tipoNumeroMarker, vecchio.numeroMarker]);
});

sezione('7. MOVIMENTO.senzaTiro: le tre voci di trasporto', () => {
    const st = ((G0.CATALOGO_N5 || {}).MOVIMENTO || {}).senzaTiro || {};
    const tre = ['SCENDI DALLA MOTO', 'RISALI SULLA MOTO', 'RISALI SUL TAG'];
    ok(Object.keys(st).length === 17, '17 voci senza tiro (14 + 3)', Object.keys(st).length);
    ok(tre.every(v => st[v] && st[v].trasporto === true && st[v].tipo === 'BASIC_SHORT' && st[v].generaAro === true),
       'le tre voci ci sono: Abilita` Breve, generano ARO, trasporto', tre.map(v => st[v] && [st[v].tipo, st[v].generaAro, st[v].trasporto]));
    ok(Object.keys(st).filter(k => st[k].trasporto).sort().join('|') === tre.slice().sort().join('|'), 'CONTROPROVA: solo quelle tre sono di trasporto');
    ok(J(M.AZIONI_TRASPORTO) === J(tre), 'M.AZIONI_TRASPORTO: le stesse tre, nello stesso ordine');
    ok(tre.every(v => (M.azioneSenzaTiro(v) || {}).id === v), 'M.azioneSenzaTiro le riconosce tutte e tre');
});

sezione('8. ARO: l arma col valore di profilo tiene il nome', () => {
    const per = unita(TUTTI.find(p => /^Perseus \(MULTI Rifle\)/.test(p.nome)).id);
    const cc = M.armiARO(per, 'CC_ATTACK'); const nomi = (cc.armi || cc).map(a => a.nome || a);
    ok(J(nomi) === J(['DA CC Weapon(PS=5)']), 'Perseus (MULTI Rifle): in ARO CC "DA CC Weapon(PS=5)", col valore', nomi);
    // Su tutti i profili: ogni arma CC del profilo col (PS=n) esce in ARO col suo nome intero, e nessuna perde il valore.
    const male = []; let quanti = 0;
    TUTTI.filter(p => !p.profiloSecondario).forEach(p => {
        const voci = ((p.weapon || '') + ',' + (p.equip || '')).split(',').map(s => s.trim()).filter(s => /CC Weapon\s*\(PS=\d+\)/.test(s));
        if (!voci.length) return;
        quanti++;
        const a = M.armiARO(Object.assign(JSON.parse(J(p)), { states: {}, state: 'ACTIVE' }), 'CC_ATTACK');
        const n = (a.armi || a).map(x => x.nome || x);
        voci.forEach(v => { if (n.indexOf(v) < 0) male.push(p.nome + ': ' + v + ' -> ' + J(n)); });
        n.forEach(x => { if (/CC Weapon\s*$/.test(x) && voci.some(v => v.replace(/\s*\(PS=\d+\)/, '') === x)) male.push(p.nome + ': ' + x + ' senza valore'); });
    });
    ok(male.length === 0, 'su tutti i profili sceglibili con un CC Weapon (PS=n) (' + quanti + '): nessuna arma perde il valore in ARO', male.slice(0, 5));
});
sezione('9. Fumo in ARO (Paolo): Morlock con Smoke Grenades contro l ATTACCO BS di un Fusilier', () => {
    const giro = (equipExtra, armaAro) => {
        const T = tavolo(T => [tr(P_(T, /^Morlock \(Assault Pistol\)/), { id: 'n1', alias: 'Fumo' })],
                         T => [tr(P_(T, /^Fusilier \(Combi/), { id: 'p1', alias: 'Spara', equip: (P_(T, /^Fusilier \(Combi/).equip || '') + (equipExtra || '') })], 'PANOCEANIA');
        const P = T.pano.g, N = T.nomadi.g;
        T.apriMenu(T.pano, 0); P.selectAction('ATTACCO BS', false); P.declareAttackBS('Combi Rifle');
        P.toggleTargetSelection('n1'); P.confirmMultiAro(false); T.giro();
        N.apriSelezioneAro(); N.toggleAroUnit('n1'); N.confermaSelezioneAro();
        N.selezionaAzioneAro('BS_ATTACK');
        const armi = String(T.nomadi.el('aro-weapon-list').innerHTML);
        N.selezionaArmaAro(armaAro || 'Smoke Grenades'); N.selezionaBersaglioAro('Spara');
        const cfg = JSON.parse(J(N.aroCurrentConfig));
        N.salvaAroCorrente(); T.giro();
        // L'attivo chiude l'Ordine: la seconda meta` offerta (o il calcolo diretto).
        const m = String(T.pano.el('second-half-buttons-container').innerHTML).match(/window\.selectAction\('([^']+)', true\)/);
        if (m) P.selectAction(m[1], true);
        P.eseguiCalcoloBS(); T.giro();
        return { T, P, N, armi, cfg, t: tab(T) };
    };
    const a = giro('');
    ok(/selezionaArmaAro\('Smoke Grenades'/.test(a.armi), 'premessa: in ARO BS il Morlock (#13) ha le Smoke Grenades fra le armi');
    ok(a.cfg.ammo === 'SMOKE' && a.cfg.arma === 'Smoke Grenades', 'la reazione porta arma Smoke Grenades e munizione SMOKE', [a.cfg.arma, a.cfg.ammo]);
    ok(ris(a.T) && a.N.alert_.length === 0 && a.P.alert_.length === 0, 'l Hub risolve, nessun alert');
    ok(/^TIRO FACCIA A FACCIA/.test(a.t), 'sul tabellone: TIRO FACCIA A FACCIA', a.t.slice(0, 60));
    ok(/Fumo Azione: ATTACCO BS Successo al: 13 \(o meno\) Dadi da lanciare: 1/.test(a.t), 'il Morlock tira su PH 13, 1 dado (BS Weapon (PH))', (a.t.match(/Fumo Azione[^▶]*/) || [])[0]);
    ok(/Spara Azione: ATTACCO BS Successo al: 15 \(o meno\) Dadi da lanciare: 3/.test(a.t), 'il Fusilier tira su BS 15, 3 dadi');
    ok(/SE COLPITO DAL NEMICO: Nessun Tiro Salvezza: azione non offensiva/.test(a.t), 'il Fumo non infligge salvezza al Fusilier');
    ok(/SE COLPITO DALL'ATTACCANTE: Munizione: N Tira 1 Dado su ARM/.test(a.t), 'il Morlock, se perde, fa la sua salvezza su ARM');
    // Con un Multispectral Visor il Fusilier vede attraverso il Fumo: niente F2F (righe 5810-5812, 10979, 10990).
    [', Multispectral Visor L1', ', Multispectral Visor L2'].forEach(m => {
        const b = giro(m);
        ok(/^TIRO NORMALE/.test(b.t) && !/TIRO FACCIA A FACCIA/.test(b.t), 'Fusilier con' + m.slice(1) + ': due Tiri Normali, il Fumo non si oppone', b.t.slice(0, 60));
        ok(/Fumo Azione: ATTACCO BS Successo al: 13/.test(b.t) && /Spara Azione: ATTACCO BS Successo al: 15/.test(b.t), '  e ognuno tira il suo (PH 13, BS 15)');
    });
    // CONTROPROVA: un'arma che non e` Fumo (Assault Pistol) resta Faccia a Faccia anche contro l'MSV.
    const c = giro(', Multispectral Visor L1', 'Assault Pistol');
    ok(/^TIRO FACCIA A FACCIA/.test(c.t) && /SE COLPITO DAL NEMICO: Munizione/.test(c.t), 'CONTROPROVA: con l Assault Pistol contro l MSV resta Faccia a Faccia, e c e la salvezza', c.t.slice(0, 60));
});
sezione('10. I due difetti del cap. 31 corretti (motore 2026-10-20.3, ordine_movimento 2026-10-20.2, controller 2026-10-20.2)', () => {
    // --- 10a. Sagoma Diretta del REATTIVO (righe 3657-3661) ---------------
    const giroAro = (armaAro) => {
        const T = tavolo(T => [tr(P_(T, /^Morlock \(Assault Pistol\)/), { id: 'n1', alias: 'Morl' })],
                         T => [tr(P_(T, /^Fusilier \(Combi/), { id: 'p1', alias: 'Spara' })], 'PANOCEANIA');
        const P = T.pano.g, N = T.nomadi.g;
        T.apriMenu(T.pano, 0); P.selectAction('ATTACCO BS', false); P.declareAttackBS('Combi Rifle');
        P.toggleTargetSelection('n1'); P.confirmMultiAro(false); T.giro();
        N.apriSelezioneAro(); N.toggleAroUnit('n1'); N.confermaSelezioneAro(); N.selezionaAzioneAro('BS_ATTACK');
        N.selezionaArmaAro(armaAro); N.selezionaBersaglioAro('Spara'); N.salvaAroCorrente(); T.giro();
        const m = String(T.pano.el('second-half-buttons-container').innerHTML).match(/window\.selectAction\('([^']+)', true\)/);
        if (m) P.selectAction(m[1], true);
        P.eseguiCalcoloBS(); T.giro();
        return { T, t: tab(T) };
    };
    const a = giroAro('Chain Rifle');
    // Un Tiro Normale ha due blocchi: la cella del Morlock che conta e` quella in cui agisce.
    const cellaR = (a.t.match(/REATTIVO NOMADI Morl Azione: (?!Nessuna reazione).*?(?=▶|🛡️ SE COLPITO)/) || [''])[0];
    ok(ris(a.T) && /^TIRO NORMALE/.test(a.t), 'Morlock (#13) col Chain Rifle in ARO contro l ATTACCO BS del Fusilier: TIRO NORMALE', a.t.slice(0, 50));
    ok(/COLPO AUTOMATICO/.test(cellaR) && !/Successo al/.test(cellaR) && !/Valore di Successo non fornito/.test(a.t), 'il Morlock: COLPO AUTOMATICO, nessun «Valore di Successo non fornito»', cellaR.slice(0, 120));
    ok(/Spara Azione: ATTACCO BS Successo al: 15 \(o meno\) Dadi da lanciare: 3/.test(a.t), 'il Fusilier tira: 15, 3 dadi');
    ok((a.t.match(/Munizione: N Tira 1 Dado su ARM/g) || []).length === 2, 'tutti e due infliggono la salvezza (due blocchi ARM)', (a.t.match(/SE COLPITO[^:]*:[^🛡▶]*/g) || []).map(x => x.slice(0, 60)));
    ok(/Sagoma Diretta del reattivo/.test(a.t), 'con la nota «Sagoma Diretta del reattivo…»');
    const b = giroAro('Assault Pistol');
    ok(/^TIRO FACCIA A FACCIA/.test(b.t) && !/COLPO AUTOMATICO/.test(b.t), 'CONTROPROVA: con l Assault Pistol resta Faccia a Faccia', b.t.slice(0, 50));
    // Dal motore: l'Intuitivo contro una Sagoma Diretta in ARO e` anch'esso un Tiro Normale;
    // la Schivata contro la Sagoma dell'attivo non cambia.
    const mor = unita(TUTTI.find(p => /^Morlock \(Assault Pistol\)/.test(p.nome)).id, { alias: 'Morl' });
    const fus = unita(TUTTI.find(p => /^Fusilier \(Combi/.test(p.nome)).id, { alias: 'Fus' });
    const chain = M.profiloArma('Chain Rifle');
    const si = M.risolviScontro({ attaccante: mor, azione: M.AZIONI.INTUITIVO, arma: chain, bersaglio: fus, burst: 1 }, { difensore: fus, azione: 'BS_ATTACK', arma: chain, bersaglio: mor }, {});
    ok(si.tipo === 'NORMALE' && si.reattivo.automatico === true && typeof si.attivo.mod === 'number', 'Intuitivo contro un Chain Rifle in ARO: Tiro Normale, il reattivo automatico, l Intuitivo tira', [si.tipo, si.attivo.mod, si.reattivo.mod]);
    const sd = M.risolviScontro({ attaccante: mor, azione: M.AZIONI.BS_ATTACK, arma: chain, bersaglio: fus, burst: 1 }, { difensore: fus, azione: 'DODGE', hasLoF: true }, {});
    ok(sd.tipo === 'NORMALE' && sd.attivo.mod === 'Auto' && sd.reattivo.mod === 10, 'CONTROPROVA: la Schivata contro la Sagoma dell attivo resta PH 10, attivo Auto', [sd.tipo, sd.attivo.mod, sd.reattivo.mod]);

    // --- 10b. La seconda meta` filtra con puoFareAzione --------------------
    const TRE = ['SCENDI DALLA MOTO', 'RISALI SULLA MOTO', 'RISALI SUL TAG'];
    const seconda = (T) => (String(T.nomadi.el('second-half-buttons-container').innerHTML).match(/selectAction\('[^']+', true\)/g) || []).map(x => x.match(/'([^']+)'/)[1]);
    {
        const T = tavolo(T => [tr(P_(T, /^Alguacil \(Combi/), { id: 'n1' }), tr(P_(T, /^Intruder \(HMG/), { id: 'n2' })], T => [tr(P_(T, /^Fusilier \(Combi/), { id: 'p1' })], 'NOMADI');
        const N = T.nomadi.g;
        [0, 1].forEach(i => {
            T.apriMenu(T.nomadi, i); N.selectAction('MOVIMENTO', false); T.giro();
            const s = seconda(T);
            ok(s.length > 0 && TRE.every(x => s.indexOf(x) < 0), (i ? 'Intruder' : 'Alguacil') + ' dopo un MOVIMENTO: nessuna voce di trasporto nella seconda meta`', s.filter(x => TRE.indexOf(x) >= 0));
            ok(s.indexOf('HACKING') < 0 && s.indexOf('ATTACCO BS') >= 0, '  e niente HACKING (non e` un Hacker), ATTACCO BS si`', s);
            N.tornaAlRadar(); T.giro();
        });
    }
    {
        const T = tavolo(T => [tr(P_(T, /^Zondnautica-A$/), { id: 'n1', alias: 'Moto' })], T => [tr(P_(T, /^Fusilier \(Combi/), { id: 'p1' })], 'NOMADI');
        const N = T.nomadi.g;
        T.apriMenu(T.nomadi, 0); N.selectAction('SCENDI DALLA MOTO', false); T.giro();
        const s = seconda(T);
        ok(s.indexOf('RISALI SULLA MOTO') >= 0 && s.indexOf('SCENDI DALLA MOTO') < 0 && s.indexOf('RISALI SUL TAG') < 0, 'dopo SCENDI, il pilota a piedi: RISALI SULLA MOTO si`, SCENDI e RISALI SUL TAG no', s.filter(x => TRE.indexOf(x) >= 0));
    }

    // --- 10c. Osservazioni: munizione della reazione, nota del Fumo, nomeAzione ---
    const fm = Object.assign({}, fus, { equip: (fus.equip || '') + ', Multispectral Visor L1' });
    const smoke = M.profiloArma('Smoke Grenades');
    const sf = M.risolviScontro({ attaccante: fm, azione: M.AZIONI.BS_ATTACK, arma: M.profiloArma('Combi Rifle'), bersaglio: mor, burst: 3, rangeIndex: 0 },
                               { difensore: mor, azione: 'BS_ATTACK', arma: smoke, bersaglio: fm }, {});
    ok(sf.tipo === 'NORMALE', 'Fumo senza reazione.ammo contro un MSV: Tiro Normale (la munizione si prende dall arma)', sf.tipo);
    const nf = J(sf.note || []) + J(sf.motivoConfronto || '');
    ok(/chi ha il visore vede attraverso il Fumo, quindi i due tiri non si oppongono/.test(nf) && !/Eclipse blocca/.test(nf), 'la nota nuova del Fumo, senza quella dell Eclipse', nf.slice(0, 200));
    ok(M.nomeAzione('CC_ATTACK') === 'ATTACCO CC' && M.nomeAzione('BS_ATTACK') === 'ATTACCO BS' && M.nomeAzione('DODGE') === 'SCHIVATA', 'M.nomeAzione: CC_ATTACK -> ATTACCO CC, BS_ATTACK -> ATTACCO BS, DODGE -> SCHIVATA');
    ok(M.nomeAzione('PIPPO') === 'PIPPO', 'CONTROPROVA: un id sconosciuto resta com e`');
});
sezione('11. Motore 2026-10-20.4: la Schivata contro un koala o una mina sta nello scontro della detonazione', () => {
    // --- 11a. Il CrazyKoala, dalle tre pagine fino al tabellone -------------
    const T = tavolo(T => [tr(P_(T, /^Taskmaster \(Red Fury/), { id: 'n1', alias: 'Task' })], T => [tr(P_(T, /^Fusilier \(Combi/), { id: 'p1', alias: 'Uno' })], 'NOMADI');
    const N = T.nomadi.g, P = T.pano.g;
    T.apriMenu(T.nomadi, 0); N.selectAction('PIAZZARE EQUIPAGGIAMENTO', false); N.scegliArmaDaPiazzare('Crazykoala');
    (N.deployableDomande || []).forEach(d => N.rispondiDeployable(d.id, d.id !== 'markerNellArea'));
    N.eseguiPiazzamento(); T.giro(); P.annullaAro(); T.giro(); T.hub.g.chiudiRisoluzione(); N.tornaAlRadar(); T.giro();
    T.hub.g.toggleTurn(); T.giro();
    T.apriMenu(T.pano, 0); P.selectAction('MOVIMENTO', false); T.giro();
    const k = N.roster.find(u => u.deployable);
    ok(!!k, 'premessa: il CrazyKoala e` sul tavolo');
    N.apriSelezioneAro(); N.apriDetonazione(k.id);
    vmTocco(T.nomadi, (String(T.nomadi.el('aro-action-list').innerHTML).match(/onclick="([^"]*)"/) || [])[1]);
    const idZdC = (N.MotoreN5.domandeDeployable('ATTIVAZIONE')[0] || {}).id;
    vmTocco(T.nomadi, "window.rispondiInnesco('" + k.id + "', '" + idZdC + "', true)");
    N.apriSelezioneAro(); N.confermaSelezioneAro(); T.giro();
    P.selectAction('SCHIVATA', true); T.giro(); P.eseguiCalcoloDifesa(); T.giro();
    const t = tab(T);
    ok(ris(T) && P.alert_.length === 0 && N.alert_.length === 0, 'l Hub risolve, nessun alert');
    ok((t.match(/Azione: SCHIVATA/g) || []).length === 1 && !/TIRO DI SUPPORTO \/ DIFESA/.test(t), 'UNO scontro: la Schivata non resta come «TIRO DI SUPPORTO / DIFESA» a parte', t.slice(0, 80));
    ok(/^CrazyKoala #\d+ detona su Uno/.test(t) && /CrazyKoala #\d+ Azione: DETONAZIONE Nessun dado/.test(t), 'lo scontro e` la detonazione: «CrazyKoala #1 detona su Uno», DETONAZIONE, Nessun dado');
    ok(/Uno Azione: SCHIVATA \(Tiro Normale\) Successo al: 10 \(o meno\) Dadi da lanciare: 1/.test(t), 'dentro, la Schivata del Fusilier: PH 10, 1 dado (il koala non e` una Sagoma: niente -3)');
    ok(/SE COLPITO DAL NEMICO: Munizione: SHOCK Tira 1 Dado su ARM \. 6 o MENO/.test(t), 'e la salvezza del koala: SHOCK, ARM 6');
    ok(/MOSTRA DETTAGLI CALCOLI - Statistica Base \(PH\): 10/.test(t), '11c. nei dettagli sul tabellone: «Statistica Base (PH): 10» (motore 20.5)', (t.match(/MOSTRA DETTAGLI CALCOLI.{0,60}/) || [])[0]);

    // --- 11b. Mina, Cybermine e controprove, dall'adattatore ----------------
    const ctx = vm.createContext({ console: { log() {}, warn() {}, error() {} } }); ctx.window = ctx;
    ['catalogo_n5.js', 'database_comune.js', 'database_nomad.js', 'database_panoceania.js', 'motore_regole_n5.js', 'calcolatore_math.js']
        .forEach(f => vm.runInContext(fs.readFileSync(DIR + f, 'utf8'), ctx, { filename: f }));
    const Mx = ctx.MotoreN5, TT = [].concat(ctx.DB_NOMADI, ctx.DB_PANOCEANIA);
    const U = (re) => Object.assign(JSON.parse(J(TT.find(x => re.test(x.nome)))), { states: {} });
    const alg = U(/^Alguacil \(Combi/), orc = U(/^Orc \(Hacker/), fus = U(/^Fusilier \(Combi/), zero = U(/^Zero \(E\/M Mine/), kul = U(/^Kulak/);
    ctx.gameState = { activeFaction: 'NOMADI', nomads: [alg, zero, kul], panoceania: [orc, fus] };
    const det = (chi, arma, b) => { const tk = Mx.creaDeployable(chi, Mx.profiloArma(arma), { ordineId: 'o1' }).token; return [{ nome: tk.nome, azione: 'DETONAZIONE', arma, bersaglio: b.nome, difensore: tk }]; };
    const gen = (busta, r) => ctx.generaRisoluzioneDaDati(busta, r) || [];
    const vedi = (s) => s.map(x => [x.titolo, x.attivo && x.attivo.azione, x.attivo && x.attivo.mod]);
    const difende = (u, az) => ({ attacchi: [{ attaccante: u.nome, azione: az }], attivo: u.nome });
    const ko = gen(difende(alg, 'SCHIVATA'), det(zero, 'CrazyKoalas', alg));
    ok(ko.length === 1 && /detona/.test(ko[0].titolo) && ko[0].attivo.azione === 'SCHIVATA (Tiro Normale)' && ko[0].attivo.mod === 10, 'koala: uno scontro, SCHIVATA (Tiro Normale) 10', vedi(ko));
    const mi = gen(difende(alg, 'SCHIVATA'), det(zero, 'Shock Mine', alg));
    ok(mi.length === 1 && /detona/.test(mi[0].titolo) && mi[0].attivo.mod === 7, 'mina: uno scontro, SCHIVATA 7 (PH 10 -3 della Sagoma)', vedi(mi));
    const cy = gen(difende(orc, 'RESET'), det(kul, 'Cybermine', orc));
    ok(cy.length === 1 && /detona/.test(cy[0].titolo) && cy[0].attivo.azione === 'RESET (Tiro Normale)' && cy[0].attivo.mod === 9, 'Cybermine: uno scontro, RESET (Tiro Normale) 9 (WIP 12 -3, riga 6240)', vedi(cy));
    const so = gen(difende(alg, 'SCHIVATA'), []);
    ok(so.length === 1 && so[0].titolo === 'TIRO DI SUPPORTO / DIFESA' && so[0].attivo.mod === 10, 'CONTROPROVA: la Schivata senza reazioni resta «TIRO DI SUPPORTO / DIFESA», PH 10', vedi(so));
    const bs = gen(difende(alg, 'SCHIVATA'), [{ nome: fus.nome, azione: 'BS_ATTACK', arma: 'Combi Rifle', bersaglio: alg.nome, rangeIndex: 1 }]);
    ok(bs.length === 1 && bs[0].titolo === 'TIRO FACCIA A FACCIA' && bs[0].attivo.mod === 10 && bs[0].reattivo.mod === 15, 'CONTROPROVA: la Schivata contro un ARO BS e` un solo Faccia a Faccia (10 contro 15)', vedi(bs));
    // --- 11c. I dettagli della difesa partono dalla Statistica Base (motore 20.5) ---
    const det_ = (s) => String((s[0] || {}).attivo && s[0].attivo.dettagliMod || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    ok(/^Statistica Base \(PH\): 10$/.test(det_(ko)), '11c. koala: dettagli «Statistica Base (PH): 10», nient altro (PH 10, mod 10)', det_(ko));
    ok(/^Statistica Base \(PH\): 10 .*Schivata contro la Sagoma di un Deployable: -3/.test(det_(mi)), '11c. mina: «Statistica Base (PH): 10» e poi la riga del -3 della Sagoma (mod 7)', det_(mi));
    ok(/^Statistica Base \(WIP\): 12 .*Reset contro la Cybermine: -3 WIP/.test(det_(cy)), '11c. Cybermine: «Statistica Base (WIP): 12» e poi la riga del -3 (mod 9)', det_(cy));
    ok(/^Statistica Base \(PH\): 10$/.test(det_(so)), 'CONTROPROVA: la Schivata senza reazioni aveva gia` «Statistica Base (PH): 10», e la tiene', det_(so));
    const dc = gen({ attacchi: [], attivo: alg.nome, azioniDichiarate: ['MOVIMENTO', 'SCHIVATA'] }, det(zero, 'Shock Mine', alg));
    ok(dc.length === 1 && dc[0].attivo.mod === 7, 'CONTROPROVA: la Schivata dichiarata dal Movimento (azioniDichiarate) era gia` uno scontro, e resta tale', vedi(dc));
});
console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
