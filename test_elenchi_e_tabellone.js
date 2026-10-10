// @versione 2026-10-09.7 | test_elenchi_e_tabellone.js | proprieta`: chat INTERFACCIA
// ============================================================================
//  Dalla chat INTERFACCIA, 7 ottobre 2026. Le correzioni di Paolo dal
//  collaudo al tavolo, viste dai tre dispositivi (app Nomadi, app
//  PanOceania, Hub) con le pagine INTERE e un server finto in mezzo.
//
//  COSA PROVA
//   1. step-modifiers: niente tasto giallo "REQUISITO NON SODDISFATTO",
//      e il riquadro dell'esito vuoto non resta acceso (la "barra verde").
//   2. Terreni a scelta multipla (Paolo, 9 ottobre): una riga chiusa che
//      apre le caselle dei terreni del tavolo piu` Fumo ed Eclipse; OK
//      applica, ANNULLA no; nella busta `terrain` e` un ELENCO e `zona`
//      resta a parte.
//      Fino alla 2026-10-08.2 questa sezione provava la tendina unica: era
//      la regola di prima, e cambiarla e` la richiesta, non un difetto.
//   3. Foto e carattere uguali nei tre elenchi: truppe da attivare, chi
//      risponde in ARO, bersagli (window.rigaUnitaConFoto).
//  3b. Le foto: una per miniatura, assegnata nello schieramento, senza
//      doppioni e senza numero fisso; il proxy; il Marker non la rivela.
//   4. Gli elenchi seguono i Gruppi di Combattimento.
//   5. Un segnalino piazzato e` una pedina: la sua immagine, niente
//      tratteggio, niente "TOGLI DAL TAVOLO"; Morto, non detona piu`.
//   6. Hub: i lati sono quelli dove siedono i giocatori (INVERTI LATI),
//      non quelli di chi e` attivo; i colori sono della fazione.
//   7. Hub: gli stati hanno l'icona; il turno ripreso si legge giusto.
//   8. Hub: le reazioni di un Ordine non valgono per l'Ordine dopo.
//   9. Hub: i dadi persi del Burst diviso e il colpo annullato si leggono.
//  10. Dopo uno Scoprire la seconda meta` offre l'Attacco BS.
//  11. Un Marker che dichiara un ARO si rivela (righe 13634-13637).
//  12. Scoprire + Attacco BS, la manovra intera fino al tabellone.
//
//  13. Scoprire + Attacco BS quando reagisce il Marker stesso:
//      "SCOPRIRE: NON SI TIRA" e Faccia a Faccia (motore dalla 2026-10-07.7).
//  14. Dopo lo Scoprire: Piazzare in Ordine singolo, Attacco BS anche in
//      Ordine Coordinato; la nota di uno scontro senza tiro si legge.
//  15. Senza allarme l'Hub non aspetta (Movimento Cauto fuori da LoF e
//      ZdC); controprova: con l'allarme aspetta.
//  16. Il tasto NESSUN ARO sulla barra dell'avviso (Paolo, 9 ottobre).
//  17. La riga dell'unita` nuova, dentro app.html (approvata da Paolo il
//      9 ottobre): elenco proprio, Coordinato, bersagli, ARO.
//  18. I programmi di hacking in ARO col bottone dell'arma del motore:
//      contorno azzurro e icona dello stato che provocano.
//
//  NON PROVA: l'aspetto vero nel browser (altezze, colori, immagini che
//  esistono o no). Il DOM qui e` finto: si guarda l'HTML prodotto.
//
//  USO:  node test_elenchi_e_tabellone.js  |  CARTELLA=/percorso/ node ...
// ============================================================================
const DIR = (process.env.CARTELLA || (__dirname + '/')).replace(/\/?$/, '/');
const fs = require('fs'), vm = require('vm');

let passati = 0, falliti = 0;
const J = JSON.stringify;
function ok(c, d) {
    if (c) { passati++; console.log('  ✓ ' + d); }
    else { falliti++; console.log('  ✗ ' + d); }
}
if (!fs.existsSync(DIR + 'app.html')) {
    console.log('  ✗ app.html non trovato in ' + DIR + ' (imposta CARTELLA=/percorso/)');
    console.log('\n0 passati, 1 falliti');
    process.exit(1);
}
// Una sezione che cade non deve portarsi via le altre: conta come fallita.
function sezione(titolo, fn) {
    console.log('\n=== ' + titolo + ' ===');
    try { fn(); } catch (e) { falliti++; console.log('  ✗ la sezione e` caduta: ' + e.message + ' ' + ((e.stack || '').split('\n')[1] || '').trim()); }
}
const testo = (h) => String(h).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

// --- i tre dispositivi: pagine intere, DOM finto, server finto in mezzo ---
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

const profilo = (T, re) => T.profilo(T.nomadi, re);
const truppa = (p, altro) => Object.assign(JSON.parse(J(p)), { states: {}, deployState: 'NORMAL', state: 'ACTIVE', combatGroup: 1 }, altro);
const aroDi = (T, id, bersaglio) => { const P = T.pano.g; P.apriSelezioneAro(); P.toggleAroUnit(id); P.confermaSelezioneAro();
    P.selezionaAzioneAro('BS_ATTACK'); P.selezionaArmaAro('Combi Rifle'); P.selezionaBersaglioAro(bersaglio); P.salvaAroCorrente(); };
const piazza = (T) => { const N = T.nomadi.g; T.apriMenu(T.nomadi, 0); N.selectAction('PIAZZARE EQUIPAGGIAMENTO', false);
    const m = Object.values(T.nomadi.elementi).map(e => e.innerHTML).join(' ').match(/scegliArmaDaPiazzare\('([^']+)'\)/);
    if (!m) throw new Error('nessuna arma piazzabile a schermo');
    N.scegliArmaDaPiazzare(m[1]); (N.deployableDomande || []).forEach(d => N.rispondiDeployable(d.id, false)); return N; };
const risoluzione = (T) => T.hub.el('step-resolution').style.display === 'block';
const tabellone = (T) => testo(T.hub.el('clash-container').innerHTML);
// Un tocco vero: l'onclick scritto nell'HTML, eseguito nella pagina.
const vmTocco = (d, codice) => vm.runInContext(codice, d.g);
// La scelta del terreno: la riga chiusa (il suo onclick e il testo) e le
// caselle del riquadro che apre (voce, spuntata, onclick).
const rigaTerreno = (h) => { const m = String(h).match(/<button[^>]*class="huge-btn scelta-terreno"[^>]*onclick="([^"]*)">\s*<span[^>]*>([\s\S]*?)<\/span>/); return m ? { clic: m[1], testo: testo(m[2]) } : null; };
const caselle = (d) => [...String(d.el('pannello-terreno').innerHTML).matchAll(/class="voce-terreno" data-voce="([^"]*)" aria-pressed="([^"]*)" onclick="([^"]*)"/g)]
    .map(x => ({ voce: x[1], acceso: x[2] === 'true', clic: x[3] }));
const TERRENI_PROVA = ['TER_10', 'TER_11', 'TER_15'];

// ---------------------------------------------------------------------------
sezione('1. step-modifiers: un tasto solo, e niente riquadro vuoto acceso', () => {
    const pagina = fs.readFileSync(DIR + 'app.html', 'utf8');
    const blocco = (pagina.match(/<div id="step-modifiers"[\s\S]*?<div id="calc-result"><\/div>/) || [''])[0];
    ok(blocco.length > 0, 'la schermata step-modifiers c e, con il riquadro dell esito');
    ok(!/<button[^>]*dichiaraRequisitoFallito\(\)/.test(blocco), 'non c e piu il tasto fisso che chiama dichiaraRequisitoFallito()');
    ok((blocco.match(/<button/g) || []).length === 1 && /id="btn-esegui-calcolo"/.test(blocco),
       'prima del riquadro dell esito c e UN tasto solo, quello principale (' + (blocco.match(/<button/g) || []).length + ')');
    ok(/#calc-result:empty\s*\{[^}]*display:\s*none/.test(pagina), 'il riquadro dell esito, vuoto, non si vede (regola :empty)');
    // Dalla porta del giocatore: un Ordine che accende il riquadro, poi il ritorno al radar.
    const T = creaTavolo(DIR); const N = T.nomadi.g;
    T.schiera([truppa(profilo(T, /^Alguacil \(Combi/), { id: 'n1', alias: 'Uno' })], [truppa(profilo(T, /^Fusilier \(Combi/), { id: 'p1', alias: 'Due' })], 'NOMADI');
    T.apriMenu(T.nomadi, 0); N.selectAction('IDLE', false); T.giro();
    T.nomadi.el('calc-result').style.display = 'block'; T.nomadi.el('calc-result').innerHTML = 'esito';
    N.tornaAlRadar();
    ok(T.nomadi.el('calc-result').innerHTML === '' && T.nomadi.el('calc-result').style.display === 'none',
       'chiuso l Ordine il riquadro e` vuoto E spento (display: ' + T.nomadi.el('calc-result').style.display + ')');
});

sezione('2. Terreni a scelta multipla: riga chiusa, caselle, OK', () => {
    const T = creaTavolo(DIR); const N = T.nomadi.g, P = T.pano.g;
    [N, P].forEach(g => { g.activeTerrains = TERRENI_PROVA.map(id => g.DB_TERRENI.find(t => t.id === id)); });
    T.schiera([truppa(profilo(T, /^Alguacil \(HMG/), { id: 'n1', alias: 'Spara' })], [truppa(profilo(T, /^Fusilier \(Combi/), { id: 'p1', alias: 'Uno' })], 'NOMADI');
    const chiusa = N.sceltaTerreno('NESSUNO', null, 'window.setTargetTerrenoBS', 0);
    ok(!/<select/.test(chiusa) && (chiusa.match(/<button/g) || []).length === 1, 'chiusa e` UNA riga sola, non una tendina');
    ok(rigaTerreno(chiusa) && rigaTerreno(chiusa).testo === 'Terreno: nessuno', 'e dice cosa c e: ' + J(rigaTerreno(chiusa) && rigaTerreno(chiusa).testo));
    ok(rigaTerreno(N.sceltaTerreno(['TER_10', 'TER_15'], 'FUMO', 'window.setTargetTerrenoBS', 0)).testo === 'Terreno: Bosco + Tempesta + Fumo', 'con piu voci le elenca tutte');
    // I valori composti di prima si leggono ancora; quelli nuovi sono elenchi.
    const sep = (x) => J(N.separaTerrenoEZona(x));
    ok(sep('TER_10+FUMO') === J({ terrain: ['TER_10'], zona: 'FUMO' }), 'un vecchio valore composto si legge ancora (' + sep('TER_10+FUMO') + ')');
    ok(sep('TER_10,TER_11') === J({ terrain: ['TER_10', 'TER_11'], zona: null }), 'due terreni: un elenco, zona null');
    ok(sep('NESSUNO') === J({ terrain: 'NESSUNO', zona: null }) && sep('NESSUNO+ECLIPSE') === J({ terrain: 'NESSUNO', zona: 'ECLIPSE' }), 'niente terreno: NESSUNO, come prima');
    ok(sep('TER_10+FUMO+ECLIPSE') === J({ terrain: ['TER_10'], zona: 'ECLIPSE' }), 'Fumo ed Eclipse insieme: vale l Eclipse');
    // Dalla porta del giocatore, in ARO.
    T.apriMenu(T.nomadi, 0); N.selectAction('ATTACCO BS', false); N.declareAttackBS('Heavy Machine Gun');
    N.toggleTargetSelection('p1'); N.confirmMultiAro(false); T.giro();
    P.apriSelezioneAro(); P.toggleAroUnit('p1'); P.confermaSelezioneAro(); P.selezionaAzioneAro('BS_ATTACK'); P.selezionaArmaAro('Combi Rifle');
    P.selezionaBersaglioAro('Spara');
    const aroH = () => T.pano.el('aro-modifiers-content').innerHTML;
    ok(/sulla linea di tiro/.test(testo(aroH())) && !!rigaTerreno(aroH()), 'in ARO: la scritta sopra e la riga chiusa');
    vmTocco(T.pano, rigaTerreno(aroH()).clic);
    ok(J(caselle(T.pano).map(x => x.voce)) === J(TERRENI_PROVA.concat(['FUMO', 'ECLIPSE'])), 'il tocco apre le caselle: i terreni del tavolo, Fumo ed Eclipse (' + caselle(T.pano).map(x => x.voce).join(',') + ')');
    vmTocco(T.pano, caselle(T.pano).find(x => x.voce === 'TER_10').clic);
    vmTocco(T.pano, caselle(T.pano).find(x => x.voce === 'TER_15').clic);
    ok(P.aroCurrentConfig.terrain === undefined || P.aroCurrentConfig.terrain === 'NESSUNO', 'finche` non si tocca OK il campo non cambia (' + J(P.aroCurrentConfig.terrain) + ')');
    vmTocco(T.pano, 'window.confermaSceltaTerreno()');
    ok(J(P.aroCurrentConfig.terrain) === J(['TER_10', 'TER_15']), 'OK: Bosco e Tempesta insieme nel campo (' + J(P.aroCurrentConfig.terrain) + ')');
    ok(T.pano.el('pannello-terreno').style.display === 'none', 'e il riquadro si chiude');
    P.salvaAroCorrente(); P.inviaAro(); T.giro();
    { const m = T.nomadi.el('second-half-buttons-container').innerHTML.match(/window\.selectAction\('([^']+)', true\)/); N.selectAction(m[1], true); }
    // Dalla porta del giocatore, sulla scheda del bersaglio.
    const H = () => T.nomadi.el('targets-allocation-container').innerHTML;
    const apri = () => vmTocco(T.nomadi, rigaTerreno(H()).clic);
    const tocca = (voce) => vmTocco(T.nomadi, caselle(T.nomadi).find(x => x.voce === voce).clic);
    const okk = () => vmTocco(T.nomadi, 'window.confermaSceltaTerreno()');
    const tgt = () => J({ terrain: N.combatTargets[0].terrain, zona: N.combatTargets[0].zona || null });
    ok(/class="bs-terreno"/.test(H()) && !!rigaTerreno(H()), 'sulla scheda del bersaglio c e la riga chiusa, accanto alle munizioni');
    apri(); tocca('TER_10'); tocca('TER_11'); okk();
    ok(tgt() === J({ terrain: ['TER_10', 'TER_11'], zona: null }), 'Bosco poi Giungla, OK: tutti e due nel campo (' + tgt() + ')');
    ok(rigaTerreno(H()).testo === 'Terreno: Bosco + Giungla', 'e la riga chiusa lo dice (' + rigaTerreno(H()).testo + ')');
    apri();
    ok(J(caselle(T.nomadi).filter(x => x.acceso).map(x => x.voce)) === J(['TER_10', 'TER_11']), 'riaprendo, le caselle spuntate sono quelle scelte');
    tocca('TER_10'); vmTocco(T.nomadi, 'window.chiudiSceltaTerreno()');
    ok(tgt() === J({ terrain: ['TER_10', 'TER_11'], zona: null }), 'ANNULLA: la casella tolta non conta, il campo resta com era');
    apri(); tocca('TER_10'); okk();
    ok(tgt() === J({ terrain: ['TER_11'], zona: null }), 'un secondo tocco su Bosco e OK lo tolgono (' + tgt() + ')');
    apri(); tocca('FUMO'); tocca('ECLIPSE');
    ok(!caselle(T.nomadi).find(x => x.voce === 'FUMO').acceso && caselle(T.nomadi).find(x => x.voce === 'ECLIPSE').acceso, 'Fumo poi Eclipse: resta spuntata solo l Eclipse');
    okk();
    ok(tgt() === J({ terrain: ['TER_11'], zona: 'ECLIPSE' }), 'e nel campo zona c e l Eclipse (' + tgt() + ')');
    apri(); tocca('TER_11'); tocca('ECLIPSE'); okk();
    ok(tgt() === J({ terrain: 'NESSUNO', zona: null }), 'tolte tutte: niente sulla linea di tiro (' + tgt() + ')');
    apri(); tocca('TER_10'); tocca('TER_11'); okk();
    let busta = null; { const M5 = N.MotoreN5, o = M5.inviaCalcolo; M5.inviaCalcolo = function (pl) { busta = pl[0].bersagli[0]; return o.apply(this, arguments); }; }
    N.eseguiCalcoloBS(); T.giro();
    ok(busta && J(busta.terrain) === J(['TER_10', 'TER_11']), 'nella busta parte l elenco dei due terreni (' + J(busta && busta.terrain) + ')');
    const t = tabellone(T);
    ok(/Pessima Visibilit/.test(t) && /Dadi da lanciare: 3/.test(t), 'e il tabellone li combina: Pessima Visibilita e un dado in meno per la Saturazione');
});

sezione('3. Foto e carattere uguali nei tre elenchi', () => {
    const T = creaTavolo(DIR); const N = T.nomadi.g, P = T.pano.g;
    T.schiera([truppa(profilo(T, /^Intruder \(HMG/), { id: 'n1', alias: 'Spara' })],
              [truppa(profilo(T, /^Fusilier \(Combi/), { id: 'p1', alias: 'Uno', imgVariant: 'fucilieri_2.png' })], 'NOMADI');
    N.roster[0].imgVariant = 'intruder.png';
    N.currentGroup = 1; N.aggiornaGraficaRoster();
    const attivo = T.nomadi.el('unit-buttons-container').innerHTML;
    T.apriMenu(T.nomadi, 0); N.selectAction('ATTACCO BS', false); N.declareAttackBS('Heavy Machine Gun');
    const bersagli = T.nomadi.el('enemy-target-buttons').innerHTML;
    N.toggleTargetSelection('p1'); N.confirmMultiAro(false); T.giro();
    P.apriSelezioneAro();
    const aro = T.pano.el('aro-selection-list').innerHTML;
    // 9 ottobre: la riga e` quella nuova (nome nella riga alta, soprannome
    // nella bassa); "stesso carattere" vuol dire stesse classi in tutti e tre.
    const NOME = /<div class="rup-nome">/, ALIAS = /<div class="rup-alias">/;
    ok(/<img class="rup-foto" src="img\/intruder\.png"/.test(attivo) && NOME.test(attivo), 'elenco delle truppe da attivare: foto e nome nella riga alta');
    ok(/<img class="rup-foto" src="img\/fucilieri_2\.png"/.test(bersagli), 'elenco dei bersagli: la foto che l AVVERSARIO ha dato alla sua unita (' + ((bersagli.match(/<img class="rup-foto" src="[^"]*"/) || ['nessuna foto'])[0]) + ')');
    ok(NOME.test(bersagli) && ALIAS.test(bersagli), 'elenco dei bersagli: stesso carattere, nome e alias');
    ok(/toggleTargetSelection\('p1'\)/.test(bersagli), 'e il tocco sceglie ancora il bersaglio');
    ok(/<img class="rup-foto" src="img\/fucilieri_2\.png"/.test(aro), 'elenco di chi risponde in ARO: la foto della propria unita (' + ((aro.match(/<img class="rup-foto" src="[^"]*"/) || ['nessuna foto'])[0]) + ')');
    ok(NOME.test(aro) && ALIAS.test(aro) && /id="aro-btn-p1"/.test(aro), 'elenco ARO: stesso carattere, e il pulsante ha ancora il suo id');
    P.toggleAroUnit('p1');
    ok(J(P.selectedAroUnits) === J(['p1']), 'e il tocco sceglie ancora chi reagisce');
    // Un Marker: il motore non manda la foto della miniatura all'avversario.
    N.roster[0].deployState = 'CAMO'; N.roster[0].states = { camo: true };
    N.inviaSchieramentoAllHub('NOMADI', { roster: N.roster, strutture: [], terreni: [], motivo: 'AGGIORNAMENTO' }); T.giro();
    const visto = J(T.pano.g.enemyRoster || JSON.parse(T.server.global_game_state).nomads);
    ok(!/intruder\.png/.test(visto), 'di un Marker la foto della miniatura NON arriva all avversario');
    // Il colore della fazione del bersaglio (Paolo, 7 ottobre).
    // 9 ottobre: i colori stanno nelle variabili --rup-* della riga nuova.
    const rigaB = (h) => (h.match(/<button[^>]*riga-unita[^>]*>/) || [''])[0];
    ok(/data-fazione="PANOCEANIA"/.test(rigaB(bersagli)) && /--rup-a-n:#005f94/.test(rigaB(bersagli)), 'il Nomade vede i bersagli di PanOceania in BLU (' + ((rigaB(bersagli).match(/--rup-a-n:[^;]*/) || ['?'])[0]) + ')');
    N.pendingTargets = [N.validTargets[0]]; N.renderTargetButtons();
    const sceltoB = rigaB(T.nomadi.el('enemy-target-buttons').innerHTML);
    ok(/data-scelta="si"/.test(sceltoB) && /--rup-a-s:#168fcf/.test(sceltoB) && !/#a80000|#e02424/.test(sceltoB), 'scelto, resta blu piu` acceso: non diventa rosso');
    P.validTargets = [N.roster[0]]; P.pendingTargets = []; P.renderTargetButtons();
    ok(/data-fazione="NOMADI"/.test(rigaB(T.pano.el('enemy-target-buttons').innerHTML)) && /--rup-a-n:#a80000/.test(rigaB(T.pano.el('enemy-target-buttons').innerHTML)), 'e chi gioca PanOceania vede i bersagli nomadi in ROSSO');
    const r = N.rigaUnitaConFoto(N.roster[0], { attributi: 'onclick="window.prova()"', id: 'riga-x', dopoNome: ' [X]', sotto: '<i>sotto</i>' });
    ok(/^\s*<button [^>]*id="riga-x"/.test(r) && /onclick="window\.prova\(\)"/.test(r) && /\[X\]/.test(r) && /<i>sotto<\/i>/.test(r) && /<\/button>\s*$/.test(r),
       'rigaUnitaConFoto(unita, opzioni): un <button> con id, gestori, coda al nome e riga sotto');
});

sezione('3b. Le foto: una per miniatura, assegnata nello schieramento', () => {
    const T = creaTavolo(DIR); const N = T.nomadi.g;
    const al = profilo(T, /^Alguacil \(Combi/);
    T.schiera([truppa(al, { id: 'n1', alias: 'Vero' }), truppa(profilo(T, /^Intruder \(HMG/), { id: 'n2', alias: 'Proxy' })], [truppa(profilo(T, /^Fusilier \(Combi/), { id: 'p1', alias: 'Uno' })], 'NOMADI');
    // Senza elenco: lo si dice, niente galleria finta.
    N.FOTO_MINIATURE = undefined; N.apriGalleriaFoto(0);
    ok(/elenco_foto\.js/.test(T.nomadi.el('galleria-foto').innerHTML) && !/assegnaFoto\(0, '/.test(T.nomadi.el('galleria-foto').innerHTML), 'senza img/elenco_foto.js la galleria dice che manca e come si genera');
    N.FOTO_MINIATURE = ['alguaciles.png', 'alguaciles_1.png', 'alguaciles_2.png', 'alguaciles_3.png', 'alguaciles_4.png', 'alguaciles_5.png'];
    ok(N.fotoUnita(N.roster[0]) === '', 'un unita senza foto assegnata non ne ha una indovinata dal nome (' + J(N.fotoUnita(N.roster[0])) + ')');
    N.deployGroup = 1; N.cambiaIconaDeploy(null, 0);
    const g = T.nomadi.el('galleria-foto').innerHTML;
    ok((g.match(/assegnaFoto\(0, '/g) || []).length === 6, 'toccando la foto si apre la galleria con TUTTE le foto, non 4 (' + (g.match(/assegnaFoto\(0, '/g) || []).length + ')');
    ok(N.assegnaFoto(0, 'alguaciles_5.png') === true && N.fotoUnita(N.roster[0]) === 'img/alguaciles_5.png', 'la sesta foto si assegna e si vede (' + N.fotoUnita(N.roster[0]) + ')');
    ok(/img\/alguaciles_5\.png/.test(T.nomadi.el('deploy-units-container').innerHTML || Object.values(T.nomadi.elementi).map(e => e.innerHTML).join(' ')), 'e la schermata di schieramento la mostra');
    N.apriGalleriaFoto(1);
    const g2 = T.nomadi.el('galleria-foto').innerHTML;
    ok(!/assegnaFoto\(1, 'alguaciles_5\.png'\)/.test(g2) && (g2.match(/assegnaFoto\(1, '/g) || []).length === 5, 'per un altra unita quella foto non e` piu fra le libere (5 su 6)');
    ok(N.assegnaFoto(1, 'alguaciles_5.png') === false && N.fotoAssegnata(N.roster[1]) === null, 'e assegnarla lo stesso viene rifiutato: una foto, una unita');
    ok(N.assegnaFoto(1, 'alguaciles.png') === true && N.fotoUnita(N.roster[1]) === 'img/alguaciles.png', 'una foto "alguaciles" va su un Intruder: il proxy');
    ok(/Intruder/.test(N.roster[1].nome) && /HMG|Heavy/.test(N.roster[1].weapon), 'e il profilo resta quello dell Intruder');
    ok(N.assegnaFoto(1, 'inventata.png') === false, 'un file che non e` nell elenco non si assegna');
    ok(N.assegnaFoto(0, null) === true && N.fotoUnita(N.roster[0]) === '' && N.fotoLibere(N.roster[1]).indexOf('alguaciles_5.png') >= 0, 'NESSUNA FOTO la toglie, e la foto torna libera');
    // Il giro: l'avversario vede la foto che ho assegnato io.
    N.inviaSchieramentoAllHub('NOMADI', { roster: N.roster, strutture: [], terreni: [], motivo: 'AGGIORNAMENTO' }); T.giro();
    const diLa = JSON.parse(T.server.global_game_state).nomads.find(u => u.id === 'n2');
    ok(diLa && T.pano.g.fotoUnita(diLa) === 'img/alguaciles.png', 'la foto assegnata arriva all Hub e all avversario (' + (diLa && diLa.imgVariant) + ')');
});

sezione('4. Gli elenchi seguono i Gruppi di Combattimento', () => {
    const T = creaTavolo(DIR); const N = T.nomadi.g, P = T.pano.g;
    const f = profilo(T, /^Fusilier \(Combi/);
    T.schiera([truppa(profilo(T, /^Intruder \(HMG/), { id: 'n1', alias: 'Spara' })],
              [truppa(f, { id: 'p1', alias: 'Secondo-A', combatGroup: 2 }), truppa(f, { id: 'p2', alias: 'Primo', combatGroup: 1 }), truppa(f, { id: 'p3', alias: 'Secondo-B', combatGroup: 2 })], 'NOMADI');
    P.renderReactiveRoster();
    const lista = testo(T.pano.el('reactive-roster-list').innerHTML);
    const ordine = ['GRUPPO 1', 'Primo', 'GRUPPO 2', 'Secondo-A', 'Secondo-B'].map(x => lista.indexOf(x));
    ok(ordine.every(i => i >= 0) && J(ordine) === J(ordine.slice().sort((a, b) => a - b)),
       'turno reattivo: GRUPPO 1 con le sue truppe, poi GRUPPO 2 (' + lista.slice(0, 160) + ')');
    T.apriMenu(T.nomadi, 0); N.selectAction('MOVIMENTO', false); T.giro();
    P.apriSelezioneAro();
    const aro = testo(T.pano.el('aro-selection-list').innerHTML);
    const oAro = ['GRUPPO 1', 'Primo', 'GRUPPO 2', 'Secondo-A', 'Secondo-B'].map(x => aro.indexOf(x));
    ok(oAro.every(i => i >= 0) && J(oAro) === J(oAro.slice().sort((a, b) => a - b)), 'chi risponde in ARO: stesso ordine per Gruppi');
    // CONTROPROVA: con un Gruppo solo nessuna intestazione.
    N.renderReactiveRoster();
    ok(!/GRUPPO/.test(testo(T.nomadi.el('reactive-roster-list').innerHTML)), 'con un Gruppo solo l intestazione non c e');
});

sezione('5. Un segnalino piazzato e` una pedina', () => {
    const T = creaTavolo(DIR); const N = T.nomadi.g, P = T.pano.g;
    T.schiera([truppa(profilo(T, /^Puppet Masters/), { id: 'n1', alias: 'Posa', combatGroup: 2 })], [truppa(profilo(T, /^Fusilier \(Combi/), { id: 'p1', alias: 'Uno' })], 'NOMADI');
    piazza(T).eseguiPiazzamento(); T.giro(); aroDi(T, 'p1', 'Posa'); T.giro(); T.hub.g.chiudiRisoluzione(); N.tornaAlRadar(); T.giro();
    const tok = N.roster.find(u => u.deployable);
    ok(!!tok, 'il segnalino e` nel roster di chi l ha piazzato (' + (tok && tok.nome) + ')');
    ok(N.gruppoDi(tok) === 2, 'sta nel Gruppo di chi l ha piazzato (' + N.gruppoDi(tok) + ')');
    ok(N.fotoUnita(tok) === 'img/mina_shock.png', 'ha la SUA immagine, col nome stabile del database (' + N.fotoUnita(tok) + ')');
    N.currentGroup = 2; N.aggiornaGraficaRoster();
    const h = T.nomadi.el('unit-buttons-container').innerHTML;
    const rigaTok = (h.match(/<button[^>]*riga-unita[\s\S]*?<\/button>/g) || []).find(r => /mina_shock\.png/.test(r)) || '';
    ok(rigaTok.length > 0, 'compare nell elenco del suo Gruppo, con la sua immagine');
    ok(!/dashed/.test(rigaTok) && /opacity:1;/.test(rigaTok), 'niente bordo tratteggiato ne` mezza trasparenza');
    ok(!/NON ATTIVABILE/.test(h), 'niente scritta rossa NON ATTIVABILE');
    ok(!/TOGLI DAL TAVOLO/.test(h) && !/togliTokenDalTavolo/.test(h), 'niente tasto TOGLI DAL TAVOLO');
    ok(/finePressioneUnita\(\d+, false\)/.test(rigaTok), 'il tocco breve non gli da` Ordini (lo dice il motore)');
    ok(N.puoFareAzione(tok, 'MOVIMENTO') === false, 'e non si muove (puoFareAzione MOVIMENTO: ' + N.puoFareAzione(tok, 'MOVIMENTO') + ')');
    N.aggiornaMenuGruppi();
    ok(/\(1 Unit/.test(T.nomadi.el('q:#battle .grid-buttons').innerHTML), 'e non si conta fra le Unita` Operative del Gruppo');
    // In ARO si attiva; Morto, non piu`. Ora e` il turno di PanOceania.
    T.hub.g.toggleTurn(); T.giro();
    T.apriMenu(T.pano, 0); P.selectAction('MOVIMENTO', false); T.giro();
    N.apriSelezioneAro();
    ok((N.deployableInnescabili || []).some(x => x.unita === tok), 'in ARO il segnalino e` fra quelli che possono scattare');
    tok.state = 'DEAD'; N.apriSelezioneAro();
    ok(!(N.deployableInnescabili || []).some(x => x.unita === tok), 'passato a Morto, non viene piu offerto per detonare');
    N.currentGroup = 2; N.aggiornaGraficaRoster();
    ok(/<s>Mina Shock/.test(T.nomadi.el('unit-buttons-container').innerHTML), 'e nell elenco resta, barrato, come ogni unita` morta');
});

sezione('6. Hub: i lati sono dove siedono i giocatori', () => {
    const T = creaTavolo(DIR); const N = T.nomadi.g, P = T.pano.g, H = T.hub.g;
    T.schiera([truppa(profilo(T, /^Intruder \(HMG/), { id: 'n1', alias: 'Spara' })], [truppa(profilo(T, /^Fusilier \(Combi/), { id: 'p1', alias: 'Uno' })], 'PANOCEANIA');
    ok(H.latoDi('NOMADI') === 'SX' && H.latoDi('PANOCEANIA') === 'DX', 'all apertura i Nomads stanno a sinistra');
    // Attiva PanOceania: prima l'attivo finiva a sinistra.
    T.apriMenu(T.pano, 0); P.selectAction('ATTACCO BS', false); P.declareAttackBS('Combi Rifle');
    P.toggleTargetSelection('n1'); P.confirmMultiAro(false); T.giro();
    N.apriSelezioneAro(); N.toggleAroUnit('n1'); N.confermaSelezioneAro(); N.selezionaAzioneAro('DODGE'); N.salvaAroCorrente(); T.giro();
    P.goToModifiersBS('IDLE'); P.eseguiCalcoloBS(); T.giro();
    ok(risoluzione(T), 'premessa: lo scontro e` a schermo');
    let t = tabellone(T);
    ok(t.indexOf('NOMADI Spara') >= 0 && t.indexOf('NOMADI Spara') < t.indexOf('PANOCEANIA Uno'),
       'attiva PanOceania, Nomads seduti a sinistra: i Nomads restano a SINISTRA (' + t.slice(0, 110) + ')');
    ok(/REATTIVO NOMADI Spara/.test(t) && /ATTIVO PANOCEANIA Uno/.test(t), 'e chi e` attivo lo dice una scritta in ogni cella');
    const html = T.hub.el('clash-container').innerHTML;
    ok(/color:#ff3333; font-size:22px;">NOMADI/.test(html) && /color:#00ccff; font-size:22px;">PANOCEANIA/.test(html), 'Nomads rossi, PanOceania blu');
    H.invertiLati();
    t = tabellone(T);
    ok(H.latoDi('NOMADI') === 'DX' && t.indexOf('PANOCEANIA Uno') < t.indexOf('NOMADI Spara'), 'INVERTI LATI: lo scontro a schermo si ridisegna con PanOceania a sinistra');
    ok(T.hub.el('pannello-nomads').style.order === '2' && T.hub.el('pannello-pano').style.order === '1', 'e i due pannelli delle fazioni si scambiano di posto');
    ok(/color:#ff3333; font-size:22px;">NOMADI/.test(T.hub.el('clash-container').innerHTML), 'i colori NON si scambiano');
    ok(H.localStorage.getItem('hub_lati_invertiti') === '1' && !('hub_lati_invertiti' in T.server), 'la scelta resta su questo dispositivo e non viaggia');
    H.chiudiRisoluzione();
    ok(T.hub.el('q:.turn-controller').style.display === '', 'chiusa la risoluzione la riga in alto torna com era (non "block")');
    const pagina = fs.readFileSync(DIR + 'calcolatore_hub.html', 'utf8');
    const riga = (pagina.match(/<div class="turn-controller">[\s\S]*?\n    <\/div>/) || [''])[0];
    const pos = ['invertiLati()', 'current-active-text', 'toggleTurn()', 'resetPartita()'].map(x => riga.indexOf(x));
    ok(pos.every(i => i >= 0) && J(pos) === J(pos.slice().sort((a, b) => a - b)), 'la riga in alto, da sinistra: INVERTI LATI, turno, CAMBIO TURNO, RESET PARTITA');
});

sezione('7. Hub: icone degli stati, e il turno ripreso', () => {
    const T = creaTavolo(DIR); const H = T.hub.g;
    T.schiera([truppa(profilo(T, /^Intruder \(HMG/), { id: 'n1', alias: 'Spara', states: { targeted: true } })], [truppa(profilo(T, /^Fusilier \(Combi/), { id: 'p1', alias: 'Uno' })], 'PANOCEANIA');
    const riga = T.hub.el('status-nomads').innerHTML;
    ok(/<img src="img\/icon_targeted\.png"/.test(riga), 'uno stato si mostra con la sua icona (' + ((riga.match(/<img src="[^"]*"/) || ['nessuna immagine'])[0]) + ')');
    ok(/onerror=/.test(riga) && /<span style="display:none;">[^<]*Targeted|<span style="display:none;">[^<]*BERSAGLIATO/i.test(riga), 'e se il file manca torna la scritta: lo stato non sparisce');
    ok(/mostraDettaglioStato\('targeted'/.test(riga), 'toccandola si apre ancora il dettaglio');
    ok(JSON.parse(T.server[H.MotoreN5.CANALI.STATO_PARTITA]).activeFaction === 'PANOCEANIA',
       'il cambio turno finisce subito nello stato salvato della partita (' + JSON.parse(T.server[H.MotoreN5.CANALI.STATO_PARTITA]).activeFaction + ')');
    // Il turno ripreso dal server: la scritta in alto deve seguirlo.
    // (nel banco quello che l'Hub pubblica va al server finto e non torna
    // nella sua memoria: gliela si rimette, come fa Firebase alla riapertura)
    T.hub.el('current-active-text').innerText = 'NOMADI';
    T.hub.memoria[H.MotoreN5.CANALI.STATO_PARTITA] = T.server[H.MotoreN5.CANALI.STATO_PARTITA];
    ok(H.riprendiPartitaHub() === true && H.gameState.activeFaction === 'PANOCEANIA', 'premessa: la partita ripresa e` nel turno di PanOceania');
    ok(T.hub.el('current-active-text').innerText === 'PANOCEANIA' && T.hub.el('current-active-text').style.color === '#00ccff',
       'ripresa la partita, la scritta del turno dice PANOCEANIA, in blu (' + T.hub.el('current-active-text').innerText + ')');
});

sezione('8. Hub: le reazioni di un Ordine non valgono per l Ordine dopo', () => {
    const T = creaTavolo(DIR); const N = T.nomadi.g, H = T.hub.g;
    T.schiera([truppa(profilo(T, /^Puppet Masters/), { id: 'n1', alias: 'Posa' })], [truppa(profilo(T, /^Fusilier \(Combi/), { id: 'p1', alias: 'Uno' })], 'NOMADI');
    // Ordine 1: allarme, ARO dichiarato, e nessuno chiude il tabellone.
    T.apriMenu(T.nomadi, 0); N.selectAction('IDLE', false); T.giro(); aroDi(T, 'p1', 'Posa'); T.giro();
    ok(Array.isArray(H.latestAroData) && H.latestAroData.length === 1, 'premessa: l Hub ha in memoria le reazioni dell Ordine 1');
    N.tornaAlRadar();
    // Ordine 2: Piazzare Equipaggiamento (Idle + Piazzare): allarme all'ingresso, busta al PIAZZA.
    piazza(T); T.giro();
    ok(H.latestAroData === null, 'arrivato l allarme dell Ordine 2, le reazioni dell Ordine 1 non ci sono piu (' + J(H.latestAroData).slice(0, 40) + ')');
    N.eseguiPiazzamento(); T.giro();
    ok(!risoluzione(T), 'la busta con aroAtteso ASPETTA: niente calcolo con le reazioni vecchie');
    aroDi(T, 'p1', 'Posa'); T.giro();
    ok(risoluzione(T) && /Uno Azione: ATTACCO BS/.test(tabellone(T)), 'arrivato l ARO scelto DOPO la busta, lo scontro lo mostra (' + tabellone(T).slice(-0).match(/PANOCEANIA Uno Azione: [A-Z ]+/) + ')');
    // CONTROPROVA: dentro lo stesso Ordine le reazioni restano.
    H.chiudiRisoluzione(); N.tornaAlRadar(); T.giro();
    T.apriMenu(T.nomadi, 0); N.selectAction('MOVIMENTO', false); T.giro(); aroDi(T, 'p1', 'Posa'); T.giro();
    const tenute = J(H.latestAroData);
    T.giro();
    ok(Array.isArray(H.latestAroData) && J(H.latestAroData) === tenute, 'CONTROPROVA: finche` l Ordine e` lo stesso le reazioni restano in memoria');
});

sezione('9. Hub: dadi persi e colpo annullato', () => {
    const T = creaTavolo(DIR); const N = T.nomadi.g, P = T.pano.g;
    const f = profilo(T, /^Fusilier \(Combi/);
    T.schiera([truppa(profilo(T, /^Intruder \(HMG/), { id: 'n1', alias: 'Spara' })], [truppa(f, { id: 'p1', alias: 'Uno' }), truppa(f, { id: 'p2', alias: 'Due' })], 'NOMADI');
    T.apriMenu(T.nomadi, 0); N.selectAction('ATTACCO BS', false); N.declareAttackBS('Heavy Machine Gun');
    N.toggleTargetSelection('p1'); N.toggleTargetSelection('p2'); N.confirmMultiAro(false); T.giro();
    P.apriSelezioneAro(); P.toggleAroUnit('p1'); P.confermaSelezioneAro(); P.selezionaAzioneAro('DODGE'); P.salvaAroCorrente(); T.giro();
    N.goToModifiersBS('IDLE');
    while (N.combatTargets[0].burst > 2) N.adjustTargetBurstBS(0, -1);
    while (N.combatTargets[1].burst < 2) N.adjustTargetBurstBS(1, 1);
    N.toggleLineaDiTiroBS(1);          // Due: nessuna Linea di Tiro
    N.eseguiCalcoloBS(); T.giro();
    const t = tabellone(T);
    ok(risoluzione(T) && /Spara Azione: ATTACCO BS[^🛡]*Dadi da lanciare: 2/.test(t), 'premessa: su Uno si tirano 2 dadi dei 4');
    ok(/DADI PERSI/.test(t) && /Spara\s*→\s*Due\s*: 2 dadi NON si tirano/.test(t), 'il tabellone dice che i 2 dadi su Due non si tirano (' + ((t.match(/DADI PERSI.*?TIRO /) || ['niente'])[0]).slice(0, 110).trim() + ')');
    ok(/Linea di Tiro/.test((t.match(/DADI PERSI.*?TIRO /) || [''])[0]), 'e dice perche`, col motivo scritto dal motore');
    // CONTROPROVA: senza dadi persi il riquadro non c'e`.
    T.hub.g.chiudiRisoluzione(); N.tornaAlRadar(); T.giro();
    T.apriMenu(T.nomadi, 0); N.selectAction('ATTACCO BS', false); N.declareAttackBS('Heavy Machine Gun');
    N.toggleTargetSelection('p1'); N.confirmMultiAro(false); T.giro();
    P.apriSelezioneAro(); P.toggleAroUnit('p1'); P.confermaSelezioneAro(); P.selezionaAzioneAro('DODGE'); P.salvaAroCorrente(); T.giro();
    N.goToModifiersBS('IDLE'); N.eseguiCalcoloBS(); T.giro();
    ok(risoluzione(T) && !/DADI PERSI/.test(tabellone(T)), 'CONTROPROVA: con tutti i dadi tirati il riquadro non compare');

    // Colpo annullato: una Sagoma su un bersaglio Ingaggiato (righe 3622-3626).
    const T2 = creaTavolo(DIR); const N2 = T2.nomadi.g, P2 = T2.pano.g;
    T2.schiera([truppa(profilo(T2, /^Grenzer \(Discover/), { id: 'n1', alias: 'Fiamma' })], [truppa(f, { id: 'p1', alias: 'Uno', states: { engaged: true } })], 'NOMADI');
    T2.apriMenu(T2.nomadi, 0); N2.selectAction('ATTACCO BS', false); N2.declareAttackBS('Light Flamethrower(+1B)');
    N2.toggleTargetSelection('p1'); N2.confirmMultiAro(false); T2.giro();
    P2.apriSelezioneAro(); P2.toggleAroUnit('p1'); P2.confermaSelezioneAro(); P2.selezionaAzioneAro('DODGE'); P2.salvaAroCorrente(); T2.giro();
    N2.goToModifiersBS('IDLE'); N2.eseguiCalcoloBS(); T2.giro();
    const t2 = tabellone(T2);
    const cella = (t2.match(/ATTIVO NOMADI Fiamma.*?REATTIVO/) || [''])[0];
    ok(risoluzione(T2) && /COLPO ANNULLATO/.test(cella), 'una Sagoma su una mischia: nella cella di chi tira si legge COLPO ANNULLATO (' + cella.slice(0, 90) + ')');
    ok(/SAGOMA SU UNA MISCHIA/.test(cella), 'col motivo del motore sotto, senza aprire i dettagli');
});

sezione('10. Dopo lo Scoprire si dichiara l Attacco BS', () => {
    const T = creaTavolo(DIR); const N = T.nomadi.g;
    T.schiera([truppa(profilo(T, /^Intruder \(HMG/), { id: 'n1', alias: 'Cerca' })],
              [truppa(profilo(T, /^Fusilier \(Combi/), { id: 'p1', alias: 'Ombra', deployState: 'CAMO', states: { camo: true } })], 'NOMADI');
    const seconda = () => T.nomadi.el('second-half-buttons-container').innerHTML;
    const offerte = () => (seconda().match(/selectAction\('[^']+', true\)/g) || []).map(x => x.match(/'([^']+)'/)[1]);
    T.apriMenu(T.nomadi, 0); N.selectAction('SCOPRIRE', false); N.scegliBersaglioScoprire('p1');
    ok(offerte().indexOf('ATTACCO BS') >= 0, 'prima meta` SCOPRIRE: come seconda meta` si offre ATTACCO BS (' + J(offerte()) + ')');
    ok(offerte().indexOf('MOVIMENTO') >= 0, 'e resta il MOVIMENTO');
    ok(offerte().indexOf('HACKING') < 0 && offerte().indexOf('SCOPRIRE') < 0, 'non le Abilita` che i moduli non compongono con lo Scoprire, ne` un secondo Scoprire');
    // CONTROPROVA: chi ha sparato per primo puo` solo muovere.
    N.tornaAlRadar(); T.giro();
    N.roster[0] = Object.assign(N.roster[0], {}); T.pano.g.roster[0].deployState = 'NORMAL'; T.pano.g.roster[0].states = {};
    T.pano.g.inviaSchieramentoAllHub('PANOCEANIA', { roster: T.pano.g.roster, strutture: [], terreni: [], motivo: 'AGGIORNAMENTO' }); T.giro();
    T.apriMenu(T.nomadi, 0); N.selectAction('ATTACCO BS', false); N.declareAttackBS('Heavy Machine Gun'); N.toggleTargetSelection('p1'); N.confirmMultiAro(false);
    ok(J(offerte()) === J(['MOVIMENTO']), 'CONTROPROVA: prima meta` ATTACCO BS, come seconda solo il MOVIMENTO (' + J(offerte()) + ')');
});

sezione('11. Un Marker che dichiara un ARO si rivela, su tutti e tre i dispositivi', () => {
    const T = creaTavolo(DIR); const N = T.nomadi.g, P = T.pano.g, H = T.hub.g;
    T.schiera([truppa(profilo(T, /^Alguacil \(Combi/), { id: 'n1', alias: 'Muove' })],
              [truppa(profilo(T, /^Fusilier \(Combi/), { id: 'p1', alias: 'Ombra', deployState: 'CAMO', states: { camo: true } }),
               truppa(profilo(T, /^Fusilier \(Combi/), { id: 'p2', alias: 'Fermo', deployState: 'CAMO', states: { camo: true } })], 'NOMADI');
    ok(H.gameState.panoceania[0].nome === 'MARKER', 'premessa: per l Hub Ombra e` un MARKER, senza statistiche (bs: ' + H.gameState.panoceania[0].bs + ')');
    T.apriMenu(T.nomadi, 0); N.selectAction('MOVIMENTO', false); T.giro();
    aroDi(T, 'p1', 'Muove'); T.giro();
    ok(P.roster[0].deployState === 'NORMAL' && !P.roster[0].states.camo, 'dichiarato l Attacco BS in ARO, chi reagisce non e` piu Marker nel proprio roster (' + P.roster[0].deployState + ')');
    ok(/Fusilier/.test(H.gameState.panoceania[0].nome) && H.gameState.panoceania[0].bs === 12, 'l Hub ora vede il Modello, con le sue statistiche (' + H.gameState.panoceania[0].nome + ', BS ' + H.gameState.panoceania[0].bs + ')');
    ok(/Fusilier/.test(N.MotoreN5.rosterNemico()[0].nome), 'e anche l avversario (' + N.MotoreN5.rosterNemico()[0].nome + ')');
    ok(P.roster[1].deployState === 'CAMO' && H.gameState.panoceania[1].nome === 'MARKER', 'CONTROPROVA: il Marker che NON ha reagito resta Marker');
    N.selectAction('MOVIMENTO', true); T.giro();
    const t = tabellone(T);
    ok(risoluzione(T) && /Ombra Azione: ATTACCO BS Successo al: 15/.test(t), 'e il suo ARO si calcola sul BS vero: 12 + 3 di gittata = 15 (' + ((t.match(/Ombra Azione: ATTACCO BS [A-Za-z :]*\d*/) || ['?'])[0]) + ')');
});

sezione('12. Scoprire + Attacco BS: la manovra intera, fino al tabellone', () => {
    const T = creaTavolo(DIR); const N = T.nomadi.g;
    // Senza Multispectral Visor: lo Scoprire si tira.
    T.schiera([truppa(profilo(T, /^Intruder \(HMG/), { id: 'n1', alias: 'Cerca', equip: 'CC Weapon' })],
              [truppa(profilo(T, /^Fusilier \(Combi/), { id: 'p1', alias: 'Ombra', deployState: 'CAMO', states: { camo: true } })], 'NOMADI');
    T.apriMenu(T.nomadi, 0); N.selectAction('SCOPRIRE', false); N.scegliBersaglioScoprire('p1'); T.giro();
    N.selectAction('ATTACCO BS', true); N.declareAttackBS('Heavy Machine Gun');
    const elenco = T.nomadi.el('enemy-target-buttons').innerHTML;
    ok(/toggleTargetSelection\('p1'\)/.test(elenco) && /riga-unita/.test(elenco), 'fra i bersagli dell Attacco c e il Marker appena scelto, con la riga degli altri elenchi');
    N.toggleTargetSelection('p1'); N.confirmMultiAro(false);
    ok(/SCOPRIRE/.test(testo(T.nomadi.el('targets-allocation-container').innerHTML)) && T.nomadi.el('btn-esegui-calcolo').innerText === 'AVANTI: ATTACCO BS',
       'prima i modificatori dello Scoprire, e il tasto porta avanti (' + T.nomadi.el('btn-esegui-calcolo').innerText + ')');
    N.confermaScoprirePoiAttacco();
    ok(/dopo lo Scoprire/.test(testo(T.nomadi.el('targets-allocation-container').innerHTML)), 'poi i modificatori dell Attacco, col Marker segnato "dopo lo Scoprire"');
    N.eseguiCalcoloBS(); T.giro();
    // 8 ottobre (motore 2026-10-08.1): la busta porta aroAtteso, perche` per
    // quest'Ordine l'allarme e` partito. Qui arriva PRIMA della risposta del
    // reattivo: l'Hub aspetta. Al tavolo il reattivo risponde sempre, anche
    // col tasto PASSA (NESSUN ARO), e allora si calcola.
    ok(!risoluzione(T), 'la busta arriva prima della risposta del reattivo: l Hub ASPETTA');
    T.pano.g.annullaAro(); T.giro();
    const t = tabellone(T);
    ok(risoluzione(T) && N.alert_.length === 0, 'parte UNA busta e l Hub la risolve (alert: ' + N.alert_.length + ')');
    const iS = t.indexOf('Azione: SCOPRIRE'), iA = t.indexOf('Azione: ATTACCO BS');
    ok(iS >= 0 && iA > iS, 'sul tabellone lo Scoprire sta PRIMA dell Attacco');
    ok(/Cerca Azione: SCOPRIRE Successo al: 17/.test(t) && /Cerca Azione: ATTACCO BS Successo al: 10 \(o meno\) Dadi da lanciare: 4/.test(t), 'con i due tiri: Scoprire a 17, Attacco a 10 con 4 dadi');
    ok(/tira PRIMA questo Scoprire/.test(t), 'lo scontro dello Scoprire dice di tirarlo per primo (nota del motore, a vista)');
    ok(/si risolve SOLO SE lo Scoprire/.test(t), 'e quello dell Attacco dice che vale solo se lo Scoprire riesce');
});

sezione('13. Scoprire + Attacco BS quando reagisce il Marker stesso', () => {
    const T = creaTavolo(DIR); const N = T.nomadi.g, P = T.pano.g, H = T.hub.g;
    T.schiera([truppa(profilo(T, /^Intruder \(HMG/), { id: 'n1', alias: 'Cerca', equip: 'CC Weapon' })],
              [truppa(profilo(T, /^Fusilier \(Combi/), { id: 'p1', alias: 'Ombra', deployState: 'CAMO', states: { camo: true } })], 'NOMADI');
    let reazioniViste = null; const vero = H.generaRisoluzioneDaDati;
    H.generaRisoluzioneDaDati = function (d, r) { reazioniViste = JSON.parse(J(r || H.latestAroData || [])); return vero.apply(this, arguments); };
    T.apriMenu(T.nomadi, 0); N.selectAction('SCOPRIRE', false); N.scegliBersaglioScoprire('p1'); T.giro();
    aroDi(T, 'p1', 'Cerca'); T.giro();
    N.selectAction('ATTACCO BS', true); N.declareAttackBS('Heavy Machine Gun');
    ok(/Fusilier/.test(testo(T.nomadi.el('enemy-target-buttons').innerHTML)), 'il Marker che ha reagito ora e` offerto come Modello (' + testo(T.nomadi.el('enemy-target-buttons').innerHTML).slice(0, 40) + ')');
    N.toggleTargetSelection('p1'); N.confirmMultiAro(false); N.confermaScoprirePoiAttacco(); N.eseguiCalcoloBS(); T.giro();
    ok(N.alert_.length === 0 && risoluzione(T), 'la busta parte e l Hub la risolve (alert: ' + J(N.alert_.map(a => a.slice(0, 40))) + ')');
    const t = tabellone(T);
    ok(/SCOPRIRE: NON SI TIRA/.test(t), 'lo Scoprire esce come "SCOPRIRE: NON SI TIRA"');
    ok(/Cerca Azione: SCOPRIRE Nessun dado/.test(t), 'senza dadi per chi lo aveva dichiarato');
    ok(/TIRO FACCIA A FACCIA.*Cerca Azione: ATTACCO BS Successo al: 10 \(o meno\) Dadi da lanciare: 4.*Ombra Azione: ATTACCO BS Successo al: 12 \(o meno\) Dadi da lanciare: 1/.test(t),
       'e l Attacco e` un Faccia a Faccia col suo ARO: 10 con 4 dadi contro 12 con 1');
    ok(/si è rivelato da solo/.test(t), 'con la spiegazione del motore a vista');
    ok(reazioniViste && reazioniViste.length === 1 && reazioniViste[0].id === 'p1', 'la reazione che l Hub passa al calcolo porta l id di chi reagisce, nel campo `id` (' + (reazioniViste && reazioniViste[0] && reazioniViste[0].id) + ')');
});

sezione('14. Dopo lo Scoprire: Piazzare (Ordine singolo) e Attacco BS (anche Coordinato)', () => {
    const offerte = (T) => (T.nomadi.el('second-half-buttons-container').innerHTML.match(/selectAction\('[^']+', true\)/g) || []).map(x => x.match(/'([^']+)'/)[1]);
    // Ordine singolo: Scoprire + Piazzare, fino al tabellone.
    const T = creaTavolo(DIR); const N = T.nomadi.g;
    T.schiera([truppa(profilo(T, /^Puppet Masters/), { id: 'n1', alias: 'Posa' })],
              [truppa(profilo(T, /^Fusilier \(Combi/), { id: 'p1', alias: 'Ombra', deployState: 'CAMO', states: { camo: true } })], 'NOMADI');
    T.apriMenu(T.nomadi, 0); N.selectAction('SCOPRIRE', false); N.scegliBersaglioScoprire('p1'); T.giro();
    T.pano.g.annullaAro(); T.giro();      // il reattivo risponde PASSA (NESSUN ARO)
    ok(offerte(T).indexOf('PIAZZARE EQUIPAGGIAMENTO') >= 0 && offerte(T).indexOf('ATTACCO BS') >= 0, 'Ordine singolo, dopo SCOPRIRE: si offrono ATTACCO BS e PIAZZARE EQUIPAGGIAMENTO (' + J(offerte(T)) + ')');
    N.selectAction('PIAZZARE EQUIPAGGIAMENTO', true);
    const tasto = () => T.nomadi.el('btn-esegui-calcolo');
    ok(tasto().innerText === 'AVANTI: PIAZZA EQUIPAGGIAMENTO', 'prima i modificatori dello Scoprire (' + tasto().innerText + ')');
    tasto().onclick(); N.scegliArmaDaPiazzare('Shock Mine');
    (N.deployableDomande || []).forEach(d => N.rispondiDeployable(d.id, false));
    ok(tasto().innerText === 'PIAZZA', 'poi equipaggiamento e domande, fino a PIAZZA (' + tasto().innerText + ')');
    tasto().onclick(); T.giro();
    const t = tabellone(T);
    ok(risoluzione(T) && N.alert_.length === 0, 'parte una busta e l Hub la risolve (alert: ' + N.alert_.length + ')');
    ok(t.indexOf('Azione: SCOPRIRE') >= 0 && t.indexOf('Azione: PIAZZARE EQUIPAGGIAMENTO') > t.indexOf('Azione: SCOPRIRE'), 'sul tabellone lo Scoprire e poi il Piazzamento');
    ok(N.roster.some(u => u.deployable), 'e il segnalino e` nel roster');
    // Ordine singolo con la risposta SI: il piazzamento e` condizionato, e la nota si legge.
    const T3 = creaTavolo(DIR); const N3 = T3.nomadi.g;
    T3.schiera([truppa(profilo(T3, /^Puppet Masters/), { id: 'n1', alias: 'Posa' })],
               [truppa(profilo(T3, /^Fusilier \(Combi/), { id: 'p1', alias: 'Ombra', deployState: 'CAMO', states: { camo: true } })], 'NOMADI');
    T3.apriMenu(T3.nomadi, 0); N3.selectAction('SCOPRIRE', false); N3.scegliBersaglioScoprire('p1'); T3.giro();
    T3.pano.g.annullaAro(); T3.giro();
    N3.selectAction('PIAZZARE EQUIPAGGIAMENTO', true); T3.nomadi.el('btn-esegui-calcolo').onclick(); N3.scegliArmaDaPiazzare('Shock Mine');
    N3.rispondiDeployable(N3.deployableDomande[0].id, true);
    ok(N3.deployableDomande.length === 2, 'col Marker nell area compare la seconda domanda (' + N3.deployableDomande.length + ')');
    N3.rispondiDeployable(N3.deployableDomande[1].id, true); T3.nomadi.el('btn-esegui-calcolo').onclick(); T3.giro();
    ok(/ABILITÀ SENZA TIRO/.test(tabellone(T3)) && /PIAZZAMENTO CONDIZIONATO/.test(tabellone(T3)), 'la nota "PIAZZAMENTO CONDIZIONATO" di uno scontro senza tiro si legge a vista');
    // Ordine Coordinato: l'Attacco BS si`, il Piazzare no.
    const T2 = creaTavolo(DIR); const N2 = T2.nomadi.g; const al = profilo(T2, /^Alguacil \(Combi/);
    T2.schiera([truppa(al, { id: 'n1', alias: 'AlgA' }), truppa(al, { id: 'n2', alias: 'AlgB' })],
               [truppa(profilo(T2, /^Fusilier \(Combi/), { id: 'p1', alias: 'Ombra', deployState: 'CAMO', states: { camo: true } })], 'NOMADI');
    N2.currentOrder = {}; N2.isCoordinated = true; N2.spearheadUnit = N2.roster[0]; N2.selectedCoordinatedUnits = [N2.roster[0], N2.roster[1]];
    N2.confermaCoordinato();
    const menu = (T2.nomadi.el('action-list-container').innerHTML.match(/selectAction\('[^']+', false\)/g) || []).map(x => x.match(/'([^']+)'/)[1]);
    ok(menu.indexOf('FUOCO SPECULATIVO') < 0 && menu.indexOf('ATTACCO INTUITIVO') < 0 && menu.indexOf('SCOPRIRE') >= 0, 'in Coordinato il menu non offre Speculativo ne` Intuitivo (righe 11399-11401)');
    N2.selectAction('SCOPRIRE', false); N2.scegliBersaglioScoprire('p1'); T2.giro();
    ok(offerte(T2).indexOf('ATTACCO BS') >= 0, 'in Coordinato, dopo SCOPRIRE, si offre ATTACCO BS (' + J(offerte(T2)) + ')');
    ok(offerte(T2).indexOf('PIAZZARE EQUIPAGGIAMENTO') < 0, 'ma NON il Piazzare, che e` costruito solo per l Ordine singolo');
});

sezione('15. Senza allarme l Hub NON aspetta: Movimento Cauto fuori da LoF e ZdC', () => {
    // L'altra faccia della sezione 12 (richiesta di TEST, 8 ottobre): se la
    // busta chiedesse SEMPRE di aspettare, ogni Ordine senza ARO lascerebbe
    // l'Hub fermo ad aspettare una risposta che non arriva.
    const giro = (fuori) => {
        const T = creaTavolo(DIR); const N = T.nomadi.g;
        T.schiera([truppa(profilo(T, /^Alguacil \(Combi/), { id: 'n1', alias: 'Piano' })],
                  [truppa(profilo(T, /^Fusilier \(Combi/), { id: 'p1', alias: 'Uno' })], 'NOMADI');
        let busta = null; const vero = T.hub.g.generaRisoluzioneDaDati;
        T.hub.g.generaRisoluzioneDaDati = function (d) { busta = JSON.parse(J(d)); return vero.apply(this, arguments); };
        const dal = Object.keys(T.server).length;
        T.apriMenu(T.nomadi, 0); N.selectAction('CAUTO', false);
        const dove = ((Object.values(T.nomadi.elementi).map(e => e.innerHTML).join(' ').match(/rispondiCauto\(true, '([^']*)'\)/) || [])[1]);
        N.rispondiCauto(fuori, dove);
        const allarme = !!T.pano.g.currentAttackData || T.hub.g.ordineDelleReazioni != null;
        T.giro(); T.giro();
        return { T, N, busta, allarme: allarme || !!T.pano.g.currentAttackData, dove };
    };
    const a = giro(true);
    ok(!!a.dove, 'la domanda del Movimento Cauto e` a schermo (' + a.dove + ')');
    ok(!a.allarme, 'fuori da LoF e ZdC: nessun allarme arriva al reattivo');
    ok(a.busta && a.busta.aroAtteso !== true, 'la busta NON chiede di aspettare (aroAtteso: ' + (a.busta && a.busta.aroAtteso) + ')');
    ok(risoluzione(a.T), 'e l Hub calcola SUBITO, senza che il reattivo risponda');
    // CONTROPROVA: dentro LoF o ZdC l'allarme parte, e l'Hub aspetta.
    const b = giro(false);
    ok(b.allarme, 'CONTROPROVA, dentro LoF o ZdC: l allarme arriva al reattivo');
    ok(!risoluzione(b.T), 'e l Hub aspetta la risposta');
    b.T.pano.g.annullaAro(); b.T.giro();
    ok(risoluzione(b.T), 'finche` il reattivo non risponde (qui: PASSA)');
});

sezione('16. Il tasto NESSUN ARO sulla barra dell avviso', () => {
    const pagina = fs.readFileSync(DIR + 'app.html', 'utf8');
    const barra = (pagina.match(/<div id="aro-alert-banner"[\s\S]*?<div class="grid-buttons" id="reactive-roster-list"/) || [''])[0];
    const tasto = (barra.match(/<button[^>]*onclick="(window\.annullaAro\(\))"[^>]*>\s*NESSUN ARO\s*<\/button>/) || [])[1];
    ok(!!tasto, 'sulla barra dell avviso c e NESSUN ARO, e chiama window.annullaAro()');
    ok(/apriSelezioneAro\(\)/.test(barra), 'accanto resta GESTISCI ARO');
    const giro = (risposta) => {
        const T = creaTavolo(DIR); const N = T.nomadi.g, P = T.pano.g;
        T.schiera([truppa(profilo(T, /^Alguacil \(HMG/), { id: 'n1', alias: 'Spara' })], [truppa(profilo(T, /^Fusilier \(Combi/), { id: 'p1', alias: 'Uno' })], 'NOMADI');
        T.apriMenu(T.nomadi, 0); N.selectAction('ATTACCO BS', false); N.declareAttackBS('Heavy Machine Gun');
        N.toggleTargetSelection('p1'); N.confirmMultiAro(false); T.giro();
        const acceso = T.pano.el('aro-alert-banner').style.display === 'block';
        const domande = []; P.confirm = (m) => { domande.push(m); return risposta; };
        vmTocco(T.pano, tasto || 'void 0'); T.giro();
        return { T, N, P, acceso, domande };
    };
    const si = giro(true);
    ok(si.acceso, 'all allarme la barra si accende');
    ok(si.domande.length === 1, 'il tocco chiede conferma, come il tasto nella schermata degli ARO');
    ok(si.T.pano.el('aro-alert-banner').style.display === 'none' && !!si.T.server.hub_sblocco_attivo, 'confermato: la barra si spegne e l Hub sblocca l attivo');
    { const m = si.T.nomadi.el('second-half-buttons-container').innerHTML.match(/window\.selectAction\('([^']+)', true\)/); si.N.selectAction(m[1], true); si.N.eseguiCalcoloBS(); si.T.giro(); }
    ok(/Nessun ARO/.test(tabellone(si.T)), 'e sul tabellone il reattivo e` "Nessun ARO"');
    const no = giro(false);
    ok(no.T.pano.el('aro-alert-banner').style.display === 'block' && !no.T.server.hub_sblocco_attivo, 'annullata la conferma: niente parte, la barra resta');
});

sezione('17. La riga dell unita` nuova, dentro app.html (Paolo, 9 ottobre)', () => {
    // Approvata la prova: la riga e` in app.html e la pagina di prova non
    // serve piu`. Si guarda dalla porta del giocatore: gli elenchi veri.
    const vera = fs.readFileSync(DIR + 'app.html', 'utf8');
    ok(!/prova_estetica/.test(vera), 'app.html non carica file di prova');
    ok(/\.riga-unita-foto \.rup-foto \{/.test(vera), 'il foglio di stile della riga e` nella pagina, non iniettato');
    // Pomeriggio del 9 (Paolo): niente tondo, forma squadrata come le armi, icone grandi sopra le due righe.
    ok(!/rup-tondo/.test(vera) && !/border-radius:50%/.test((vera.match(/\.riga-unita-foto \.rup-foto \{[^}]*\}/) || [''])[0]), 'la foto non ha piu` il tondo intorno: e` un png senza sfondo');
    // Pomeriggio del 9 (Paolo, tramite MOTORE): la STESSA forma del bottone dell'arma.
    // Dalla 2026-10-09.5 la forma la DISEGNA il motore (M.formaBottone, motore
    // 2026-10-09.4), la stessa di M.bottoneArma: in app.html non ce n'e` piu`
    // una copia. Si confronta la riga vera con il bottone dell'arma vero.
    { const T0 = creaTavolo(DIR); const G0 = T0.nomadi.g, M0 = G0.MotoreN5;
      const arma = M0.bottoneArma(M0.profiloArma('Combi Rifle'), {});
      const riga = G0.rigaUnitaConFoto({ nome: 'Alguacil', alias: 'Prova', tipo: 'LI', states: {} }, {});
      ok(typeof M0.formaBottone === 'function', 'il motore ha M.formaBottone');
      ok(!/clip-path:polygon\(15px 0/.test(vera), 'app.html non ha piu` una sua copia della forma (nessun ottagono scritto nella pagina)');
      const ott = (arma.match(/clip-path:(polygon\(15px 0[^;]*\))/) || [])[1];
      ok(!!ott && riga.indexOf('clip-path:' + ott) >= 0, 'la banda del nome ha lo stesso ottagono del bottone dell arma (angoli a 15)');
      ok(/margin-right:20px; min-height:66px; padding:10px 16px 34px 92px/.test(arma) && /margin-right:20px; min-height:66px; padding:10px 16px 34px 92px/.test(riga), 'stesso margine, altezza e spazio interno della banda alta (20, 66, 10/16/34/92)');
      ok(/margin:-28px 0 0 72px; padding:6px 10px 6px 12px/.test(riga) && /border-radius:0 8px 8px 8px/.test(riga), 'la banda bassa risale di 28, rientra di 72, angoli 0 8 8 8: come l arma');
      const pieghe = (h) => (h.match(/width:15px; height:15px; background:[^;]*; clip-path:polygon/g) || []).length;
      // Misurato in Chromium: senza border-box la banda del soprannome era alta 44 invece di 30.
      // Dal motore 2026-10-09.6 il border-box lo mette M.formaBottone: qui non si ripete.
      const bassaStile = (riga.match(/<div style="position:relative; margin:-28px[^"]*"/) || [''])[0];
      ok(/box-sizing:border-box/.test(bassaStile) && /min-height:30px;/.test(bassaStile), 'la banda del soprannome conta lo spazio interno nell altezza minima (30, non 44)');
      ok((bassaStile.match(/box-sizing/g) || []).length === 1, 'il box-sizing lo dichiara solo il motore, una volta (' + (bassaStile.match(/box-sizing/g) || []).length + ')');
      ok(pieghe(riga) === 3 && pieghe(arma) === 3, 'tre pieghe negli angoli, come l arma (' + pieghe(riga) + ')'); }
    ok(/\.riga-unita-foto \.rup-icone img \{ width:64px !important; height:64px !important/.test(vera) && /\.riga-unita-foto \.rup-icone \{ position:absolute;/.test(vera), 'le icone degli stati: 64px, sopra le due righe (non piu` 30px dentro la bassa)');
    const T = creaTavolo(DIR); const N = T.nomadi.g;
    ok(T.problemi.length === 0, 'la pagina si carica senza errori (' + J(T.problemi) + ')');
    ok(N.rigaUnitaConFoto && N.rigaUnitaConFoto.originale === undefined, 'una sola riga: nessuna funzione sostituita sopra un altra');
    T.schiera([truppa(profilo(T, /^Alguacil \(HMG/), { id: 'n1', alias: 'Rosso', imgVariant: 'alguaciles_2.png' }),
               truppa(profilo(T, /^Alguacil \(HMG/), { id: 'n2', alias: 'Verde' })],
              [truppa(profilo(T, /^Fusilier \(Combi/), { id: 'p1', alias: 'Primo', states: { engaged: true } }), truppa(profilo(T, /^Fusilier \(Combi/), { id: 'p2', alias: 'Secondo' })], 'NOMADI');
    N.currentGroup = 1; N.aggiornaGraficaRoster();
    const mia = T.nomadi.el('unit-buttons-container').innerHTML;
    ok(/class="huge-btn riga-unita riga-unita-foto"/.test(mia) && /data-fazione="NOMADI" data-scelta="no"/.test(mia) && /--rup-a-n:#a80000/.test(mia), 'l elenco delle proprie truppe usa la riga nuova, nei colori dei Nomadi');
    ok(/<img class="rup-foto" src="img\/alguaciles_2\.png"/.test(mia) && !/rup-tondo/.test(mia), 'la foto della miniatura c e, libera, senza tondo');
    ok(/<span class="rup-sigla">/.test(mia), 'senza foto, al suo posto la sigla del tipo');
    ok(/<div class="rup-nome">Alguacil<\/div>/.test(mia) && /<div class="rup-alias">"Rosso"<\/div>/.test(mia), 'banda alta il nome, banda bassa il soprannome');
    ok(/<div class="rup-alias">"Rosso"<\/div>/.test(mia), 'il soprannome nella banda bassa');
    // Il Coordinato accendeva la riga con un fondo rosso fisso: ora con data-scelta.
    N.selectedCoordinatedUnits = [N.roster.find(u => u.id === 'n2')]; N.aggiornaGraficaRoster();
    const coord = T.nomadi.el('unit-buttons-container').innerHTML;
    ok(!/#440000/.test(coord), 'niente piu` fondo rosso fisso per la scelta del Coordinato');
    ok((coord.match(/data-scelta="si"/g) || []).length === 1, 'la truppa scelta per il Coordinato e` accesa, solo lei');
    ok(/style="[^"]*--rup-c-n:#ff9900;[^"]*"[^>]*data-scelta="si"/.test(coord), 'e il suo contorno e` arancio: bordo delle bande e pieghe (dice: scelta per il Coordinato)');
    N.selectedCoordinatedUnits = [];
    T.apriMenu(T.nomadi, 0); N.selectAction('ATTACCO BS', false); N.declareAttackBS('Heavy Machine Gun'); N.toggleTargetSelection('p1');
    const bers = T.nomadi.el('enemy-target-buttons').innerHTML;
    const riga = (id) => (bers.match(new RegExp('<button[^>]*data-scelta="(si|no)"[^>]*onclick="window\\.toggleTargetSelection\\(\'' + id + '\'\\)"[\\s\\S]*?</button>')) || []);
    ok(/data-fazione="PANOCEANIA"/.test(bers), 'i bersagli nei colori di PanOceania');
    ok(riga('p1')[1] === 'si' && riga('p2')[1] === 'no', 'il bersaglio scelto e` acceso, l altro no (' + riga('p1')[1] + '/' + riga('p2')[1] + ')');
    ok(/<div class="rup-icone">[\s\S]*icon_engaged/.test(riga('p1')[0] || ''), 'le icone degli stati stanno a destra, nel loro riquadro sopra le righe');
    ok(/padding:10px 72px 34px 92px/.test(riga('p1')[0] || '') && /padding:10px 16px 34px 92px/.test(riga('p2')[0] || ''), 'con un icona il nome lascia 72px a destra; senza icone nessuno spazio');
    // L'elenco degli ARO: la scelta si accende con data-scelta, non col fondo.
    const P = T.pano.g; P.selectedAroUnits = ['p2'];
    const btn = { className: 'huge-btn riga-unita riga-unita-foto', style: {}, attr: {}, setAttribute(k, v) { this.attr[k] = v; } };
    const prima = P.document.getElementById; P.document.getElementById = (id) => id === 'aro-btn-p1' ? btn : prima.call(P.document, id);
    P.toggleAroUnit('p1');
    ok(btn.attr['data-scelta'] === 'si' && btn.style.background === undefined, 'toccata in ARO: la riga si accende (data-scelta), il fondo resta quello della fazione');
    P.toggleAroUnit('p1');
    ok(btn.attr['data-scelta'] === 'no' && J(P.selectedAroUnits) === J(['p2']), 'ritoccata si spegne e torna fuori dalla scelta');
    P.document.getElementById = prima;
});

sezione('18. I programmi di hacking in ARO: il bottone dell arma, azzurro, con l icona dello stato', () => {
    // Paolo, 9 ottobre: i programmi hanno l'estetica dell'arma col contorno
    // azzurro fluo e, come immagine, l'icona dello stato che provocano. Il
    // disegno e` del motore (M.bottoneArma, motore 2026-10-09.2): qui si guarda
    // la schermata degli ARO, che e` di logica_aro.js.
    const T = creaTavolo(DIR); const N = T.nomadi.g, P = T.pano.g;
    const hacker = [].concat(P.DB_PANOCEANIA).find(u => /\bHacking Device\b/.test(u.equip || '') && /Hacker/.test(u.skills || ''));
    ok(!!hacker, 'premessa: un Hacker PanOceania col Hacking Device (' + (hacker && hacker.nome) + ')');
    T.schiera([truppa(profilo(T, /^Alguacil \(HMG/), { id: 'n1', alias: 'Spara' })], [truppa(JSON.parse(J(hacker)), { id: 'p1', alias: 'Hax' })], 'NOMADI');
    T.apriMenu(T.nomadi, 0); N.selectAction('ATTACCO BS', false); N.declareAttackBS('Heavy Machine Gun');
    N.toggleTargetSelection('p1'); N.confirmMultiAro(false); T.giro();
    P.apriSelezioneAro(); P.toggleAroUnit('p1'); P.confermaSelezioneAro(); P.selezionaAzioneAro('HACKING');
    const lista = T.pano.el('aro-weapon-list').innerHTML;
    const bottoni = lista.match(/<button type="button" class="bottone-arma"[\s\S]*?<\/button>/g) || [];
    ok(bottoni.length >= 3, 'i programmi in ARO sono bottoni dell arma (' + bottoni.length + ')');
    ok(!/<button class="huge-btn"[^>]*selezionaArmaAro/.test(lista), 'nessun programma resta col bottone semplice di prima');
    const carb = bottoni.find(b => /selezionaArmaAro\('CARBONITE'\)/.test(b)) || '';
    ok(/border:1px solid #00e5ff/.test(carb), 'contorno azzurro fluo (#00e5ff)');
    ok(/<img src="img\/icon_immb\.png"/.test(carb), 'Carbonite porta l icona dell Immobilizzato-B, lo stato che provoca');
    ok(/B2 · PS 7 · BTS pieno/.test(carb), 'sotto: Burst e Tiro Salvezza (' + testo((carb.match(/font-size:13px[^>]*>([^<]*)</) || ['', '?'])[1]) + ')');
    // Dalla porta del giocatore: il tocco sceglie ancora il programma.
    vmTocco(T.pano, (carb.match(/onclick="([^"]*)"/) || [])[1] || 'void 0');
    ok(P.aroCurrentConfig.arma === 'CARBONITE', 'toccato, il programma e` scelto (' + P.aroCurrentConfig.arma + ')');
    // CONTROPROVA: un BS Attack in ARO NON passa da qui (le armi restano come prima).
    P.apriSelezioneAro(); P.toggleAroUnit('p1'); P.confermaSelezioneAro();
    const az = T.pano.el('aro-action-list').innerHTML;
    if (/selezionaAzioneAro\('BS_ATTACK'\)/.test(az)) {
        P.selezionaAzioneAro('BS_ATTACK');
        ok(!/class="bottone-arma"/.test(T.pano.el('aro-weapon-list').innerHTML), 'CONTROPROVA: le armi in ARO restano col bottone di prima (non richiesto)');
    } else ok(true, 'CONTROPROVA saltata: questo Hacker non ha BS in ARO');
});

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
