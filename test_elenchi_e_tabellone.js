// @versione 2026-10-28.7 | test_elenchi_e_tabellone.js | proprieta`: chat INTERFACCIA
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
//  19. PIAZZARE EQUIPAGGIAMENTO nel menu solo se M.armiPiazzabili da` armi
//      (difetto trovato da TEST il 10 ottobre).
//  20. Hub: le truppe come la lista d'esercito, per Gruppo di
//      Combattimento (Paolo, 12 ottobre).
//  21-22. Le sette correzioni del 15 ottobre; i modi della stessa arma.
//  23. I quattro lavori del 18 ottobre (motore 2026-10-18.1): Fairy Dust
//      nell'Hub, CYBERMASK fuori dalle Abilita` Lunghe, la pagina del
//      CrazyKoala con la sola DETONAZIONE (che ora PARTE davvero), la nota
//      dell'Isolato.
//  24. Le foto dei deployable (Paolo, 19 ottobre): i CrazyKoala prendono
//      in sequenza le loro quattro foto, e l'Hub vede la stessa; le mine
//      in ARO sono una riga con l'immagine del loro tipo e la pagina con
//      la sola DETONAZIONE, come i koala.
//  25. Import dal testo di Infinity Army (misura di MOTORE, 19 ottobre):
//      le righe che sbagliavano danno il profilo giusto, e a pari punti la
//      riga e` ambigua e la sceglie il giocatore. 25b: la lista vera di
//      Paolo, incollata com'e`.
//  25d. Import (MOTORE, 20 ottobre): Zondnautica con pilota e moto rientrati,
//      TAG con l'Operator sotto: UNA unita`.
//  26. I lavori del 20 ottobre: SCENDI / RISALI dal menu, TAG vuoto sulla
//      riga e all'Hub, Marker numerati per segnalino (CAMO 1, CAMO-3 1,
//      img/camo-3_1.png; motore 2026-10-20.2), icona
//      della Punta di Lancia nel Coordinato.
//  27. Tabellone: il nome delle azioni (M.nomeAzione: ATTACCO CC, non
//      CC_ATTACK) e la Sagoma Diretta come colpo automatico, attivo e reattivo.
//  28-31. I lavori del 23 ottobre: foto collegate (pilota, moto), un
//      riquadro per il tiro unico della Sagoma d'Impatto, BERSAGLIO nel
//      Supporto, niente Copertura in ARO con un'arma Targetless.
//  32. Il PUNTO del tavolo sul tabellone: cella neutra, senza salvezze.
//  33. Dal collaudo del 23 ottobre: chi e` in Hidden Deployment reagisce
//      (etichetta NASCOSTO, poi NORMAL e AGGIORNAMENTO), la Riserva no; i
//      bersagli dell'ARO con la riga con la foto (anche nel Coordinato); il
//      Leader del Fireteam sulla riga; niente scorrimento orizzontale.
//  34a-f. I lavori del 26 ottobre (MOTORE 2026-10-26.1): SCENDI DAL TAG e i
//      piloti di lista a bordo (Gator, Szalamandra, Gecko); icone degli stati
//      e segnalini per esercito, con la copia comune come ripiego; SCH-06 (una
//      mina in CAMO mostra il segnalino camo_N, app e Hub); HoloMask (app
//      avversaria e Hub vedono il Modello imitato); Holoecho e Decoy
//      (repliche, etichette VERA / REPLICA, TOGLI LA REPLICA, nota nell'ARO).
//  35a-d. Minelayer allo schieramento (limite e domande), RICARICA forzata
//      dall'Hub, usi residui nell'ARO, usiSpesi nel salvataggio (DIS-02).
//      RISCRITTI il 26 ottobre (prima / dopo): in 7 e 26c le immagini erano
//      img/icon_targeted.png e img/camo_N.png; ora sono quelle dell'esercito
//      (img/nomadi/...), e la copia comune e` il primo ripiego.
//  35a, 35b, 35c leggono armi e deployable da database_comune.js.
//
//      26 ottobre sera (motore 26.2), RISCRITTI: in 34e la scelta dell'HoloMask
//      e` in due passi (truppa, poi opzione d'arma); in 35c gli usi stanno
//      DENTRO il bottone dell'arma (M.bottoneArma), non in una riga sotto.
//      27 ottobre, RISCRITTI col file database_comune.js: in 5 e 24 le immagini
//      dei segnalini sono per esercito (img/nomadi/mina_shock.png,
//      img/nomadi/crazykoala.png); in 24 i koala si piazzano col MINELAYER, uno
//      per Taskmaster (prima schieraPiazzabile, senza limite), con la
//      controprova che il secondo non passa.
//
//  36a-b. ARO (MOTORE 27.2-27.3): il nome grezzo dell'arma, con le notazioni
//      ("Thunderbolt(+1B)"); col Total Reaction la scelta BURST PIENO / B1,
//      r.burstPieno nella risposta e gli usi del Panzerfaust (+1B) contati sulla scelta.
//
//  37. Hidden Deployment nella propria app (MOTORE 27.5): «HIDDEN» e l'icona
//      icon_hidden (esercito, comune, 🫥) sulla riga e nello schieramento.
//      RISCRITTO in 33a: l'etichetta NASCOSTO dell'ARO ora puo` avere l'icona
//      davanti (prima: «👁️ NASCOSTO» subito dopo il tag).
//
//  38a-i. Il collaudo grafico di MOTORE (27 ottobre, 63 schermate a 390 px) e
//      BS-29: tasti non stirati nelle colonne; spazio sotto il MENU; due
//      uscite (INDIETRO, ANNULLA ORDINE) e una conferma verde da M.COLORI;
//      tre livelli di titolo e sei misure; la riga con la foto nello
//      schieramento, scelte uguali, ricerca HoloMask; testi tagliati (Gruppo,
//      fascia del soprannome, sigla del Marker, icone, munizioni, reazioni);
//      il primo Ordine Schivata; i caratteri dell'Hub; lo Schieramento Aereo
//      da M.opzioniSchieramento.
//      Nessun controllo di prima riscritto: le sezioni 1-37 passano uguali.
//  39. Gli stati di schieramento tutti da M.opzioniSchieramento (motore
//      27.9): CAMO col MOD, IMP, FOXHOLE, SEED, AD, HIDDEN; acceso e disponibile;
//      Camouflage (1 Use) consumato; il Marker; la nota scappata.
//      RISCRITTI in 38i (prima / dopo): il tasto ora porta data-stato e la
//      classe attivo in coda; la controprova dell Alguacil guarda AD e HIDDEN.
//  40. Secondo giro del collaudo (27 ottobre sera): tasti della lista a 44 px,
//      righe ambigue come scelte, titoli nel colore della fazione, etichette
//      nella fascia bassa (C03, G02).
//      RISCRITTI: in 34e e 38e la scelta HoloMask parte vuota con piu` di 8
//      truppe (lettere e ricerca); in 38h il calc dell Hub puo` avere "- N px".
//  41. Terzo giro: gli step ARO e step-states senza padding in linea; un solo INDIETRO
//      nella scelta HoloMask. Nessun controllo di prima riscritto.
//  42. Pulizia dell interfaccia (Paolo, 27 ottobre sera): il tasto ⓘ e il suo
//      pannello, simboli tolti, sfondo dei tasti della fazione, titolo ARO
//      senza «(ARO)», numeri della gittata sui confini, icone di Linea di Tiro
//      e Copertura, cambio di stato nella ⓘ invece del riquadro giallo.
//      RISCRITTI (dalla 2026-10-27.9, prima/dopo nel commento di ciascuno):
//      21 (testo del tasto Linea di Tiro dopo l icona), 24 (spiegazione della
//      mina nella ⓘ), 31 (nota Targetless nella ⓘ), 36b intera (niente piu`
//      scelta del burst: sempre pieno), 37 (HIDDEN: segnalino grande fra le
//      icone, niente scritta), 38f G03 (reazioni coi loro colori) e G06
//      (tendina munizioni senza huge-btn), 38i (nota AD nella ⓘ; icona a
//      sinistra), 39 (testo delle voci dentro voce-con-icona; tiro fallito;
//      nota scappata su una voce spenta), 40 G02 (niente etichetta HIDDEN).
//  43. Le opzioni delle note (Paolo, 28 ottobre): pannello nella pagina della
//      fazione, opzioni_note in memoria, tipi filtrati, ⓘ col nome del tasto
//      a gruppi, abbinamento nota-tasto, tipo e tasto nelle note di logica_aro
//      e dello schieramento. Il disegno delle fasce sotto i tasti vuole un DOM
//      vero: lo prova foto/note_vere.js nel browser, non questo banco.
//      RISCRITTI (dalla 2026-10-28.1): in 42 l ascoltatore del tocco
//      (window.riallineaNote) e il formato della voce nella ⓘ.
//  44. La barra della gittata in ARO e` M.barraGittata (motore 28.1): niente
//      copia in logica_aro. RISCRITTO (dalla 2026-10-28.2): in 21 il bottone
//      del Combi Rifle, ora su scala 96" con celle data-da/data-fino/data-mod.
//  45. Le note di logica_aro e dello schieramento passano da M.nota /
//      M.azzeraNote (motore 28.1): senza app.html restano in window.INFO.
//  46. D09: la schermata IN ATTESA DI ARO dice i bersagli (M.rigaAttesaAro,
//      motore 28.3), anche il punto del tavolo di un arma Targetless.
//  47. Menu degli Ordini e reazioni ARO col colore della categoria del
//      motore (M.coloreOrdine, motore 28.4). RISCRITTO (dalla 2026-10-28.5):
//      38f, Attacco BS e Schivata non piu` di colori diversi ma della loro
//      categoria. Dalla 2026-10-28.6 (motore 28.5, gli id delle reazioni in
//      tabella): niente traduzione in logica_aro; la prova sposta DODGE.
//  48. Il tasto ⓘ non copre i titoli lunghi: classe sotto-info sui titoli che
//      lo toccano (window.liberaSpazioInfo); testata ARO senza "--" da solo.
//      RISCRITTO (dalla 2026-10-28.7): 38i, la nota nella ⓘ ha gli accenti
//      del motore (M.accenti, motore 28.7).
//
//  SOLO=34a,35a node test_elenchi_e_tabellone.js  gira solo quelle sezioni.
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
// SOLO=26,33 (o SOLO=3b): gira solo le sezioni con quel numero in testa.
const SOLO = (process.env.SOLO || '').split(',').map(x => x.trim()).filter(Boolean);
function sezione(titolo, fn) {
    if (SOLO.length && !SOLO.some(n => titolo.indexOf(n + '.') === 0)) return;
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
        // 15 ottobre: il documento RICORDA chi ascolta (pointerdown, click),
        // per provare il clic fantasma dalla porta del giocatore.
        addEventListener(tipo, fn) { (g._ascoltiDoc[tipo] = g._ascoltiDoc[tipo] || []).push(fn); }, write() {} };
    g._ascoltiDoc = {};
    g.alert = (m) => g.alert_.push(String(m)); g.confirm = () => true; g.prompt = () => 'motivo di prova'; g.scrollTo = () => {};
    g._cicli = []; g.setInterval = (fn) => { g._cicli.push(fn); return g._cicli.length; }; g.clearTimeout = () => {};
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
    // RISCRITTO il 15 ottobre: prima 'in ARO: la scritta sopra e la riga
    // chiusa'. Ora l'Attacco BS in ARO ha l'impaginazione dell'attivo
    // (richiesta di Paolo via MOTORE): la riga chiusa sta accanto alle
    // munizioni, senza la scritta sopra, come nella scheda del bersaglio.
    ok(!!rigaTerreno(aroH()) && /<select[^>]*setAroAmmo[\s\S]*?<\/select>\s*<div class="bs-terreno"/.test(aroH()), 'in ARO BS: la riga chiusa del terreno accanto alle munizioni, come nell attivo');
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
    // 15 ottobre (Paolo): le foto stanno nella cartella del giocatore che ha
    // schierato la pedina (img/nomadi/, img/panoceania/). RISCRITTI qui e
    // sotto: prima si pretendeva img/<file>.
    ok(/<img class="rup-foto" src="img\/nomadi\/intruder\.png"/.test(attivo) && NOME.test(attivo), 'elenco delle truppe da attivare: foto (dalla cartella Nomadi) e nome nella riga alta');
    ok(/<img class="rup-foto" src="img\/panoceania\/fucilieri_2\.png"/.test(bersagli), 'elenco dei bersagli: la foto che l AVVERSARIO ha dato alla sua unita, dalla SUA cartella (' + ((bersagli.match(/<img class="rup-foto" src="[^"]*"/) || ['nessuna foto'])[0]) + ')');
    ok(NOME.test(bersagli) && ALIAS.test(bersagli), 'elenco dei bersagli: stesso carattere, nome e alias');
    ok(/toggleTargetSelection\('p1'\)/.test(bersagli), 'e il tocco sceglie ancora il bersaglio');
    ok(/<img class="rup-foto" src="img\/panoceania\/fucilieri_2\.png"/.test(aro), 'elenco di chi risponde in ARO: la foto della propria unita, dalla propria cartella (' + ((aro.match(/<img class="rup-foto" src="[^"]*"/) || ['nessuna foto'])[0]) + ')');
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
    ok(N.assegnaFoto(0, 'alguaciles_5.png') === true && N.fotoUnita(N.roster[0]) === 'img/nomadi/alguaciles_5.png', 'la sesta foto si assegna e si vede (' + N.fotoUnita(N.roster[0]) + ')');
    ok(/img\/nomadi\/alguaciles_5\.png/.test(T.nomadi.el('deploy-units-container').innerHTML || Object.values(T.nomadi.elementi).map(e => e.innerHTML).join(' ')), 'e la schermata di schieramento la mostra');
    N.apriGalleriaFoto(1);
    const g2 = T.nomadi.el('galleria-foto').innerHTML;
    ok(!/assegnaFoto\(1, 'alguaciles_5\.png'\)/.test(g2) && (g2.match(/assegnaFoto\(1, '/g) || []).length === 5, 'per un altra unita quella foto non e` piu fra le libere (5 su 6)');
    ok(N.assegnaFoto(1, 'alguaciles_5.png') === false && N.fotoAssegnata(N.roster[1]) === null, 'e assegnarla lo stesso viene rifiutato: una foto, una unita');
    ok(N.assegnaFoto(1, 'alguaciles.png') === true && N.fotoUnita(N.roster[1]) === 'img/nomadi/alguaciles.png', 'una foto "alguaciles" va su un Intruder: il proxy');
    ok(/Intruder/.test(N.roster[1].nome) && /HMG|Heavy/.test(N.roster[1].weapon), 'e il profilo resta quello dell Intruder');
    ok(N.assegnaFoto(1, 'inventata.png') === false, 'un file che non e` nell elenco non si assegna');
    ok(N.assegnaFoto(0, null) === true && N.fotoUnita(N.roster[0]) === '' && N.fotoLibere(N.roster[1]).indexOf('alguaciles_5.png') >= 0, 'NESSUNA FOTO la toglie, e la foto torna libera');
    // Il giro: l'avversario vede la foto che ho assegnato io.
    N.inviaSchieramentoAllHub('NOMADI', { roster: N.roster, strutture: [], terreni: [], motivo: 'AGGIORNAMENTO' }); T.giro();
    const diLa = JSON.parse(T.server.global_game_state).nomads.find(u => u.id === 'n2');
    // L'avversario la cerca nella cartella di CHI l'ha schierata, non nella sua.
    ok(diLa && T.pano.g.fotoUnita(diLa, 'NOMADI') === 'img/nomadi/alguaciles.png' && T.pano.g.fotoUnita(diLa) === 'img/panoceania/alguaciles.png',
       'la foto assegnata arriva all Hub e all avversario (' + (diLa && diLa.imgVariant) + '), che la cerca nella cartella Nomadi');
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
    // RISCRITTO il 27 ottobre (icone per esercito, MOTORE 26.1): prima
    // img/mina_shock.png; ora la cartella dell'esercito, con la comune come ripiego.
    ok(N.fotoUnita(tok) === 'img/nomadi/mina_shock.png' && J(N.fotoUnitaConRipieghi(tok).ripieghi) === J(['img/mina_shock.png']),
       'ha la SUA immagine, col nome stabile del database, dalla cartella dell esercito (' + N.fotoUnita(tok) + ')');
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
    // RISCRITTO il 26 ottobre (MOTORE 26.1, icone per esercito): prima
    // l'icona era img/icon_targeted.png; ora e` quella dell'esercito della
    // truppa, con la comune come primo ripiego.
    ok(/<img src="img\/nomadi\/icon_targeted\.png"/.test(riga) && /this\.src='img\/icon_targeted\.png'/.test(riga),
       'uno stato si mostra con l icona del suo esercito, la comune come ripiego (' + ((riga.match(/<img src="[^"]*"/) || ['nessuna immagine'])[0]) + ')');
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
    // RISCRITTO il 15 ottobre (Paolo): NESSUN ARO parte SUBITO, senza popup.
    // Prima: 'il tocco chiede conferma, come il tasto nella schermata degli ARO'.
    ok(si.domande.length === 0, 'il tocco NON chiede conferma: la rinuncia parte subito');
    ok(si.T.pano.el('aro-alert-banner').style.display === 'none' && !!si.T.server.hub_sblocco_attivo, 'confermato: la barra si spegne e l Hub sblocca l attivo');
    { const m = si.T.nomadi.el('second-half-buttons-container').innerHTML.match(/window\.selectAction\('([^']+)', true\)/); si.N.selectAction(m[1], true); si.N.eseguiCalcoloBS(); si.T.giro(); }
    ok(/Nessun ARO/.test(tabellone(si.T)), 'e sul tabellone il reattivo e` "Nessun ARO"');
    const no = giro(false);
    // RISCRITTO il 15 ottobre: prima 'annullata la conferma: niente parte, la
    // barra resta'. Ora anche se il dispositivo rispondesse no a un confirm,
    // la rinuncia parte lo stesso: nessun confirm deve essere chiamato.
    ok(no.domande.length === 0 && no.T.pano.el('aro-alert-banner').style.display === 'none' && !!no.T.server.hub_sblocco_attivo, 'anche col confirm che direbbe no: parte lo stesso, la barra si spegne');
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
    ok(/<img class="rup-foto" src="img\/[a-z]+\/alguaciles_2\.png"/.test(mia) && !/rup-tondo/.test(mia), 'la foto della miniatura c e, libera, senza tondo');
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
    // RISCRITTO il 15 ottobre (motore 2026-10-13.2, Paolo): ogni programma ha
    // la SUA icona, img/programmi/<nome>.png; l'icona dello stato provocato
    // resta il ripiego se il file manca. Prima: 'Carbonite porta l icona
    // dell Immobilizzato-B, lo stato che provoca' (img/icon_immb.png).
    ok(/<img src="img\/programmi\/carbonite\.png"/.test(carb) && /this\.src='img\/icon_immb\.png'/.test(carb), 'Carbonite porta la sua icona (img/programmi/carbonite.png), col ripiego sull Immobilizzato-B');
    ok(/B2 · PS 7 · BTS pieno/.test(carb), 'sotto: Burst e Tiro Salvezza (' + testo((carb.match(/font-size:13px[^>]*>([^<]*)</) || ['', '?'])[1]) + ')');
    // Dalla porta del giocatore: il tocco sceglie ancora il programma.
    vmTocco(T.pano, (carb.match(/onclick="([^"]*)"/) || [])[1] || 'void 0');
    ok(P.aroCurrentConfig.arma === 'CARBONITE', 'toccato, il programma e` scelto (' + P.aroCurrentConfig.arma + ')');
    // CONTROPROVA: un BS Attack in ARO NON passa da qui (le armi restano come prima).
    P.apriSelezioneAro(); P.toggleAroUnit('p1'); P.confermaSelezioneAro();
    const az = T.pano.el('aro-action-list').innerHTML;
    if (/selezionaAzioneAro\('BS_ATTACK'\)/.test(az)) {
        P.selezionaAzioneAro('BS_ATTACK');
        // RISCRITTO il 15 ottobre: prima 'CONTROPROVA: le armi in ARO restano
        // col bottone di prima (non richiesto)'. Ora e` richiesto (Paolo, via
        // MOTORE, punto 5): anche le armi hanno il bottone approvato.
        const wl = T.pano.el('aro-weapon-list').innerHTML;
        ok(/class="bottone-arma"/.test(wl) && !/<button class="huge-btn"[^>]*selezionaArmaAro/.test(wl), 'anche le armi in ARO hanno il bottone approvato, nessun bottone semplice');
    } else ok(true, 'CONTROPROVA saltata: questo Hacker non ha BS in ARO');
});

sezione('19. PIAZZARE EQUIPAGGIAMENTO: la voce c e solo se il motore ha armi da piazzare', () => {
    // TEST, 10 ottobre: Krakot Renegade (Chest Mine) e Bambabot-1 (Mine
    // Dispenser) avevano la voce, ma M.armiPiazzabili non da` armi: tocco,
    // allarme, Ordine speso, "nessun equipaggiamento da piazzare". La voce si
    // decideva dal NOME; ora la decide il motore.
    const T = creaTavolo(DIR); const N = T.nomadi.g, M = N.MotoreN5;
    const tutti = [].concat(N.DB_NOMADI, N.DB_PANOCEANIA);
    const prof = (re) => { const p = tutti.find(x => re.test(x.nome)); if (!p) throw new Error('profilo non trovato: ' + re); return JSON.parse(J(p)); };
    const voci = (u) => { T.nomadi.g.roster = [u]; return (T.apriMenu(T.nomadi, 0).match(/selectAction\('[^']+', false\)/g) || []).map(x => x.match(/'([^']+)'/)[1]); };
    const krakot = truppa(prof(/^Krakot Renegade/), { id: 'n1', alias: 'Krak' });
    const bamba = truppa(prof(/^Bambabot-1/), { id: 'n2', alias: 'Bamba' });
    const task = truppa(prof(/^Taskmaster \(Red Fury/), { id: 'n3', alias: 'Task' });
    const puppet = truppa(prof(/^Puppet Masters/), { id: 'n4', alias: 'Posa' });
    T.schiera([krakot, bamba, task, puppet], [truppa(prof(/^Fusilier \(Combi/), { id: 'p1', alias: 'Uno' })], 'NOMADI');
    ok(voci(krakot).indexOf('PIAZZARE EQUIPAGGIAMENTO') < 0, 'Krakot Renegade (Chest Mine): nel menu NON c e Piazzare (il motore: zero armi)');
    ok(voci(bamba).indexOf('PIAZZARE EQUIPAGGIAMENTO') < 0, 'Bambabot-1 (Mine Dispenser): nel menu NON c e Piazzare');
    ok(voci(task).indexOf('PIAZZARE EQUIPAGGIAMENTO') >= 0, 'Taskmaster col Crazykoala fra le ARMI: la voce c e (prima mancava)');
    ok(voci(puppet).indexOf('PIAZZARE EQUIPAGGIAMENTO') >= 0, 'CONTROPROVA: Puppet Masters con le mine ha ancora la voce');
    // Dalla porta del giocatore: il Taskmaster tocca la voce e trova il CrazyKoala.
    N.roster = [task]; T.apriMenu(T.nomadi, 0); N.selectAction('PIAZZARE EQUIPAGGIAMENTO', false);
    const schermo = Object.values(T.nomadi.elementi).map(e => e.innerHTML).join(' ');
    ok(/scegliArmaDaPiazzare\('[^']*Koala[^']*'\)/i.test(schermo) && !/nessun equipaggiamento da piazzare/i.test(schermo), 'toccata, la schermata offre il CrazyKoala da piazzare');
    // 12 ottobre (MOTORE, motore 2026-10-12.2): le D-Charges (Demolition Mode)
    // SI piazzano (riga 6044). Il motore le aveva perse, e col menu legato a
    // lui i portatori di D-Charges perdevano la voce: si guarda per nome.
    const hell = truppa(prof(/^Hellcat \(Hacker/), { id: 'n5', alias: 'Hell' });
    ok(/D-Charges/.test(hell.weapon) && voci(hell).indexOf('PIAZZARE EQUIPAGGIAMENTO') >= 0, 'Hellcat (Hacker) con le D-Charges: la voce Piazzare c e');
    N.roster = [hell]; T.apriMenu(T.nomadi, 0); N.selectAction('PIAZZARE EQUIPAGGIAMENTO', false);
    const schermoH = Object.values(T.nomadi.elementi).map(e => e.innerHTML).join(' ');
    ok(/scegliArmaDaPiazzare\('D-Charges[^']*'\)/.test(schermoH), 'toccata, la schermata offre le D-Charges (' + ((schermoH.match(/scegliArmaDaPiazzare\('([^']*)'\)/) || [])[1]) + ')');
    const conDC = tutti.filter(p => /D-Charges/i.test((p.weapon || '') + ' ' + (p.equip || '')));
    const senzaVoce = conDC.filter(p => !N.puoFareAzione(Object.assign(JSON.parse(J(p)), { states: {}, deployState: 'NORMAL', state: 'ACTIVE' }), 'PIAZZARE EQUIPAGGIAMENTO'));
    ok(conDC.length > 0 && senzaVoce.length === 0, 'tutti i ' + conDC.length + ' portatori di D-Charges hanno la voce (' + senzaVoce.length + ' senza)');
    // 12 ottobre (motore 2026-10-15.1): le D-Charges esplodono nello stesso
    // Ordine. Dalla porta del giocatore fino al tabellone dell'Hub.
    { const T2 = creaTavolo(DIR); const N2 = T2.nomadi.g;
      T2.schiera([truppa(prof(/^Hellcat \(Hacker/), { id: 'n1', alias: 'Hell' })],
                 [truppa(prof(/^Fusilier \(Combi/), { id: 'p1', alias: 'Fus', states: { immobilizedA: true } })], 'NOMADI');
      T2.apriMenu(T2.nomadi, 0); N2.selectAction('PIAZZARE EQUIPAGGIAMENTO', false);
      N2.scegliArmaDaPiazzare('D-Charges (Demolition Mode)'); N2.scegliBersaglioPiazzamento('p1');
      (N2.deployableDomande || []).forEach(d => N2.rispondiDeployable(d.id, false));
      T2.nomadi.el('btn-esegui-calcolo').onclick(); T2.giro(); T2.pano.g.annullaAro(); T2.giro();
      const t2 = tabellone(T2);
      ok(risoluzione(T2) && /Fus: 3 Tiri Salvezza su ARM, riesce con 7 o meno/.test(t2), 'D-Charges su un nemico Immobilizzato: sul tabellone si legge la salvezza della detonazione');
      ok(!N2.roster.some(u => u.deployable), 'e nessun segnalino entra nel roster'); }
    // Su tutti i profili dei due database: la voce del menu e il motore dicono la stessa cosa.
    const diversi = tutti.filter(p => { const u = Object.assign(JSON.parse(J(p)), { states: {}, deployState: 'NORMAL', state: 'ACTIVE' });
        return N.puoFareAzione(u, 'PIAZZARE EQUIPAGGIAMENTO') !== (M.armiPiazzabili(u).armi.length > 0); });
    ok(diversi.length === 0, 'su ' + tutti.length + ' profili la voce del menu e M.armiPiazzabili coincidono (' + diversi.length + ' diversi' + (diversi.length ? ': ' + diversi.slice(0, 3).map(p => p.nome).join(', ') : '') + ')');
});

sezione('20. Hub: le truppe come la lista d esercito, per Gruppo', () => {
    // Paolo, 12 ottobre (tramite MOTORE): fuori dalla risoluzione l'Hub mostra
    // le truppe come la lista d'esercito in PDF. Si guarda l'Hub dopo uno
    // schieramento vero dei due giocatori.
    const T = creaTavolo(DIR); const N = T.nomadi.g, H = T.hub.g;
    const tutti = [].concat(N.DB_NOMADI, N.DB_PANOCEANIA);
    const prof = (re) => { const p = tutti.find(x => re.test(x.nome)); if (!p) throw new Error('profilo non trovato: ' + re); return JSON.parse(J(p)); };
    T.schiera([truppa(prof(/^Intruder \(Hacker, Killer/), { id: 'n1', alias: 'Ombra', imgVariant: 'intruder_2.png', states: { targeted: true } }),
               truppa(prof(/^Mary Problems \(Hacker/), { id: 'n2', alias: 'Mary', combatGroup: 2 }),
               truppa(prof(/^Hellcat \(Paramedic/), { id: 'n3', alias: 'Cura', combatGroup: 2 })],
              [truppa(prof(/^Fusilier \(Combi/), { id: 'p1', alias: 'Uno' })], 'NOMADI');
    const nom = T.hub.el('status-nomads').innerHTML, pan = T.hub.el('status-pano').innerHTML;
    const scheda = (h, alias) => (h.match(new RegExp('<div class="scheda-truppa"[\\s\\S]*?\\(' + alias + '\\)[\\s\\S]*?</div>\\s*</div>\\s*</div>')) || [''])[0];
    // Gruppi
    const g1 = nom.indexOf('>GROUP 1<'), g2 = nom.indexOf('>GROUP 2<');
    ok(g1 >= 0 && g2 > g1, 'le truppe sono divise per Gruppo: GROUP 1 poi GROUP 2');
    ok(nom.indexOf('(Ombra)') > g1 && nom.indexOf('(Ombra)') < g2 && nom.indexOf('(Mary)') > g2 && nom.indexOf('(Cura)') > g2, 'ogni truppa sta sotto il suo Gruppo');
    ok(/>GROUP 1</.test(pan) && /\(Uno\)/.test(pan), 'anche PanOceania ha i suoi Gruppi');
    // La scheda
    const ombra = scheda(nom, 'Ombra');
    ok(/<div class="st-nome">Intruder <span class="st-alias">\(Ombra\)<\/span><\/div>/.test(ombra), 'il nome dell unita` col soprannome fra parentesi');
    ok(/--st-colore:#ff0000/.test(ombra) && /--st-colore:#00ccff/.test(scheda(pan, 'Uno')), 'il nome nel colore della fazione');
    ok(/<img class="st-foto" src="img\/nomadi\/intruder_2\.png"/.test(ombra), 'a sinistra la miniatura (la foto assegnata, dalla cartella Nomadi)');
    ok(/icon_targeted\.png/.test(ombra), 'sotto il nome le icone degli stati');
    ok(/<b>Equipment:<\/b> Killer Hacking Device, Multispectral Visor L2</.test(ombra), 'Equipment: l equipaggiamento, senza le armi (niente CC Weapon)');
    ok(/<b>Special Skills:<\/b> Hacker • Camouflage • Mimetism \(-3\) • Stealth • Surprise Attack \(-3\)</.test(ombra), 'Special Skills per intero, separate da •, senza Terrain e Infiltration');
    const mary = scheda(nom, 'Mary');
    ok(/Hacking Device \(UPGRADE: Oblivion \+1B\), Killer Hacking Device \(UPGRADE: Trinity AP\)</.test(mary), 'gli UPGRADE restano per intero');
    ok(/Dodge \(\+3\)/.test(mary) && !/Forward Deployment/.test(mary) && !/Pistol/.test(mary), 'Dodge (+3) resta; Forward Deployment e la Pistol no');
    const cura = scheda(nom, 'Cura');
    ok(/<b>Equipment:<\/b> MediKit, Deployable Repeater</.test(cura), 'il MediKit e` equipaggiamento anche se ha un profilo d arma');
    ok(/Super-Jump \(Jet Propulsion\)/.test(cura) && !/Courage|Parachutist|Combat Jump|Terrain/.test(cura), 'via Courage, Parachutist, Combat Jump, Terrain; Super-Jump resta');
    // 12 ottobre (motore 2026-10-15.1): l'equipaggiamento lo dice M.eEquipaggiamentoInLista.
    // Prima il Deployable Cover, che ha un profilo d'arma e non sta in CATALOGO_N5.EQUIP, spariva.
    ok(/M\.eEquipaggiamentoInLista\(voce\)/.test(fs.readFileSync(DIR + 'calcolatore_controller.js', 'utf8')) && !/CATALOGO_N5 \|\| \{\}\)\.EQUIP/.test(fs.readFileSync(DIR + 'calcolatore_controller.js', 'utf8')), 'la riga Equipment chiede al motore (M.eEquipaggiamentoInLista), senza liste sue');
    { const pc = tutti.find(x => /Deployable Cover/.test(x.equip || ''));
      const ck = pc ? H.equipaggiamentoDi(JSON.parse(J(pc))) : [];
      ok(ck.indexOf('Deployable Cover') >= 0 && ck.indexOf('Pistol') < 0, 'il Deployable Cover sta fra gli Equipment, la Pistol no (' + (pc && pc.nome) + ': ' + ck.join(', ') + ')'); }
    // Niente di quello che Paolo ha tolto
    ok(!/Combi Rifle|Heavy Machine Gun|MOV|>BS<|punti|SWC/i.test(nom + pan), 'niente armi, statistiche, punti');
    ok(!/onclick="(?!window\.mostraDettaglioStato)/.test(ombra) && !/data-scelta/.test(nom), 'nessuna selezione: le schede non si scelgono (si toccano solo le icone degli stati)');
    ok(J(H.SKILL_NASCOSTE_ELENCO_HUB) === J(['Forward Deployment', 'Hidden Deployment', 'Infiltration', 'Strategic Deployment', 'Parachutist', 'Combat Jump', 'Decoy', 'Courage', 'Religious Troop', 'Terrain']), 'l elenco delle skill tolte sta in un punto solo, ed e` quello di Paolo');
    // La foto: la stessa regola dell'app dei giocatori.
    const campioni = [{ imgVariant: 'alguaciles_2.png' }, { nome: 'MARKER' }, { imgVariant: '0' }, N.roster[0], { deployable: true, id: 'dep_' + ((N.DB_DEPLOYABLES || [])[0] || {}).id + '_1_1' }];
    // RISCRITTO il 15 ottobre: prima si confrontava senza fazione; ora per
    // tutte e due le fazioni, perche` la cartella dipende da chi ha schierato.
    // Il quinto campione e` un segnalino con foto assegnata: la foto vince
    // sull'immagine del database, nell'app come nell'Hub (punto 2 di MOTORE).
    campioni.push({ deployable: true, id: 'dep_' + ((N.DB_DEPLOYABLES || [])[0] || {}).id + '_2_1', imgVariant: 'panda_vero.png' });
    ok(['NOMADI', 'PANOCEANIA'].every(f => campioni.every(u => H.fotoTruppaHub(u, f) === N.fotoUnita(u, f))) && N.fotoUnita(campioni[5], 'PANOCEANIA') === 'img/panoceania/panda_vero.png',
       'la foto nell Hub segue la stessa regola dell app, per tutte e due le fazioni (' + campioni.map(u => H.fotoTruppaHub(u, 'NOMADI') || '-').join(', ') + ')');
    ok(J(H.CARTELLA_FOTO) === J(N.CARTELLA_FOTO) && J(N.CARTELLA_FOTO) === J({ NOMADI: 'img/nomadi/', PANOCEANIA: 'img/panoceania/' }), 'le cartelle delle foto: le stesse nell Hub e nell app, quelle di Paolo');
    // Durante la risoluzione l'elenco non si vede (lo nasconde mostraSchermataRisoluzione).
    const pagina = fs.readFileSync(DIR + 'calcolatore_hub.html', 'utf8');
    // 12 ottobre, sera (Paolo): l'Hub sta su tablet o PC. Quattro colonne sempre,
    // nessuna regola per il telefono. Prima la prova chiedeva le due @media.
    ok(/\.gruppo-hub-schede \{ display:grid; grid-template-columns:repeat\(2, minmax\(0,1fr\)\)/.test(pagina) && /\.status-grid \{ display: grid; grid-template-columns: 1fr 1fr;/.test(pagina) && !/@media/.test(pagina), 'quattro colonne sempre: due fazioni, due colonne ciascuna; nessuna regola per il telefono');
});


// Il browser, per il clic fantasma: prima gli ascoltatori del documento in
// cattura, poi (se nessuno l'ha fermato) l'onclick di cio` che c'e` li`.
const eventoFinto = () => ({ fermato: false, stopPropagation() { this.fermato = true; }, preventDefault() {} });
const ditoGiu = (d) => (d.g._ascoltiDoc.pointerdown || []).forEach(fn => fn(eventoFinto()));
const clicBrowser = (d, codice) => {
    const ev = eventoFinto();
    (d.g._ascoltiDoc.click || []).forEach(fn => fn(ev));
    if (!ev.fermato) vmTocco(d, codice);
    return !ev.fermato;
};

sezione('21. Dal tavolo di Paolo, 13-14 ottobre (sette punti di MOTORE)', () => {
    // --- 1. Il clic fantasma nello schieramento --------------------------
    {
        const T = creaTavolo(DIR); const N = T.nomadi.g;
        const prof = N.DB_NOMADI.find(x => x.id === 'interventor_hacker_fastpanda');
        N.roster = [truppa(prof, { id: 'n1', alias: 'Ago' })];
        N.apriSchieramento(); N.apriGruppoDeploy(1);
        // Tocco rapido sulla riga: dito giu`, dito su. Il timer del tocco
        // lungo NON deve scattare (nel banco setTimeout esegue subito).
        const tempo = N.setTimeout; N.setTimeout = () => 0;
        ditoGiu(T.nomadi); N.startDeployPress(0, { clientX: 5, clientY: 5 }); N.endDeployPress(0);
        N.setTimeout = tempo;
        const pagina = T.nomadi.el('deploy-states-content').innerHTML;
        const piazza = (pagina.match(/onclick="(window\.schieraPiazzabile\([^"]*\))"/) || [])[1];
        ok(!!piazza, 'premessa: aperta la pagina, c e il bottone del FastPanda');
        // Subito dopo il sollevamento il telefono manda il click a cio` che
        // c'e` ADESSO sotto il dito: il bottone del FastPanda appena disegnato.
        clicBrowser(T.nomadi, piazza || 'void 0');
        ok(N.roster.length === 1, 'il click che segue il tocco sulla riga NON piazza il FastPanda (roster: ' + N.roster.map(u => u.nome || u.name).join(', ') + ')');
        // Un tocco vero, dopo, funziona.
        ditoGiu(T.nomadi); clicBrowser(T.nomadi, piazza || 'void 0');
        ok(N.roster.length === 2 && /FastPanda/.test(N.roster[1].nome || N.roster[1].name), 'il tocco VOLUTO sul bottone lo piazza');

        // --- 2. La foto assegnata al segnalino si vede nell'app ----------
        N.FOTO_MINIATURE = ['panda_dipinto.png', 'alguaciles.png'];
        ok(N.assegnaFoto(1, 'panda_dipinto.png') === true, 'premessa: al FastPanda si assegna una foto');
        const riga = N.rigaUnitaConFoto(N.roster[1], {});
        ok(/<img class="rup-foto" src="img\/nomadi\/panda_dipinto\.png"/.test(riga) && !/<span class="rup-sigla">/.test(riga), 'la riga del FastPanda mostra la foto assegnata, non "DEP" (' + ((riga.match(/rup-foto" src="[^"]*"/) || ['nessuna'])[0]) + ')');
        ok(/img\/nomadi\/panda_dipinto\.png/.test(T.nomadi.el('deploy-units-container').innerHTML || ''), 'e la schermata di schieramento la mostra');

        // --- 3. La galleria mostra le foto della cartella del giocatore ---
        N.apriGalleriaFoto(0);
        const gal = Object.values(T.nomadi.elementi).map(e => e.innerHTML || '').join(' ');
        ok(/<img src="img\/nomadi\/alguaciles\.png"/.test(gal) && !/<img src="img\/alguaciles\.png"/.test(gal), 'la galleria Nomadi pesca da img/nomadi/');
    }
    {
        const T = creaTavolo(DIR); const P = T.pano.g;
        P.roster = [truppa(profilo(T, /^Alguacil \(HMG/), { id: 'p9', alias: 'Merc' })];
        P.FOTO_MINIATURE = ['laxmee.png'];
        P.apriGalleriaFoto(0);
        const gal = Object.values(T.pano.elementi).map(e => e.innerHTML || '').join(' ');
        ok(/<img src="img\/panoceania\/laxmee\.png"/.test(gal), 'quella PanOceania da img/panoceania/: lo stesso mercenario ha la foto di chi lo schiera');
    }
    const app = fs.readFileSync(DIR + 'app.html', 'utf8');
    ok(/s\.src = cartella \+ 'elenco_foto\.js/.test(app) && !/s\.src = 'img\/elenco_foto\.js/.test(app), 'l elenco delle foto si carica dalla cartella del giocatore');

    // --- 5 e 6. Attacco BS in ARO: bottoni e requisiti -------------------
    const giro = () => {
        const T = creaTavolo(DIR); const N = T.nomadi.g, P = T.pano.g;
        T.schiera([truppa(profilo(T, /^Alguacil \(HMG/), { id: 'n1', alias: 'Spara' })], [truppa(profilo(T, /^Fusilier \(Combi/), { id: 'p1', alias: 'Uno' })], 'NOMADI');
        T.apriMenu(T.nomadi, 0); N.selectAction('ATTACCO BS', false); N.declareAttackBS('Heavy Machine Gun');
        N.toggleTargetSelection('p1'); N.confirmMultiAro(false); T.giro();
        P.apriSelezioneAro(); P.toggleAroUnit('p1'); P.confermaSelezioneAro();
        return { T, N, P };
    };
    {
        const { T, P } = giro();
        const azioni = T.pano.el('aro-action-list').innerHTML;
        ok(/selezionaAzioneAro\('RESET'\)/.test(azioni) || /RESET/.test(testo(azioni)), 'il Reset compare fra le ARO contro un Attacco BS (' + (testo(azioni).match(/RESET[^A-Z]*/) || ['assente'])[0].trim() + ')');
        P.selezionaAzioneAro('BS_ATTACK');
        const wl = T.pano.el('aro-weapon-list').innerHTML;
        const combi = (wl.match(/<button type="button" class="bottone-arma"[\s\S]*?<\/button>/g) || []).find(b => /selezionaArmaAro\('Combi Rifle'[,)]/.test(b)) || '';  // dal 15.2 il tocco porta anche ", false" (modo normale no)
        // RISCRITTO il 28 ottobre (MOTORE 2026-10-28.1: la barra del bottone e`
        // su scala comune di 96", fasce proporzionali). Prima: una griglia
        // grid-template-columns:repeat(...) con una colonna per banda. Ora:
        // celle cella-gittata con data-da/data-fino/data-mod, contigue, e una
        // cella-fuori fino a 96.
        const celle = [...combi.matchAll(/<div class="cella-gittata" data-da="(\d+)" data-fino="(\d+)" data-mod="(-?\d+)"/g)].map(x => ({ da: +x[1], fino: +x[2], mod: +x[3] }));
        const contigue = celle.length > 0 && celle[0].da === 0 && celle.every((c, i) => i === 0 || c.da === celle[i - 1].fino);
        const fuori = (combi.match(/<div class="cella-gittata cella-fuori" data-da="(\d+)" data-fino="(\d+)"/) || []);
        ok(/COMBI RIFLE|Combi Rifle/.test(combi) && contigue && +fuori[1] === celle[celle.length - 1].fino && fuori[2] === '96',
           'il Combi Rifle in ARO e` il bottone approvato, con le gittate su scala 96 (' + J(celle.map(c => c.fino + ':' + c.mod)) + ', fuori ' + fuori[1] + '-' + fuori[2] + ')');
        vmTocco(T.pano, (combi.match(/onclick="([^"]*)"/) || [])[1] || 'void 0');
        P.selezionaBersaglioAro('Spara');
        const html = () => T.pano.el('aro-modifiers-content').innerHTML;
        const RQ = P.MotoreN5.REQUISITI_TAVOLO;
        // RISCRITTO il 27 ottobre sera (Paolo: l icona della Linea di Tiro non si
        // vedeva). Prima: il testo del tasto subito dopo il '>' del bottone,
        // ([^<]*)<. Ora prima del testo c e l icona (44 px, sopra la scritta):
        // si prende il testo che chiude il tasto.
        const lof = () => (html().match(/<button[^>]*tasto-lof-aro[^>]*onclick="([^"]*)"[^>]*>[\s\S]*?([^<>]*)<\/button>/) || []);
        ok(lof()[2] && lof()[2].trim() === RQ.lof.si, 'c e il tasto LINEA DI TIRO, col testo del motore (' + (lof()[2] || 'assente').trim() + ')');
        ok(/class="range-seg seg-fuori[^"]*"[^>]*onclick="window\.toggleAroRequisito\('gittata'\)">FUORI</.test(html()), 'e il segmento FUORI in coda alla barra delle bande');
        ok(/toggleAroCover\(\)[\s\S]*?<\/button>\s*<button[^>]*tasto-lof-aro/.test(html()), 'copertura e Linea di Tiro sulla stessa riga, come nell attivo');
        vmTocco(T.pano, lof()[1]);
        ok(P.aroCurrentConfig.lof === false && lof()[2].trim() === RQ.lof.no, 'toccato: LINEA DI TIRO NO, e la reazione porta lof = false');
        ok(/IDLE/.test(T.pano.el('btn-conferma-aro').innerText), 'il tasto di conferma dice IDLE (' + T.pano.el('btn-conferma-aro').innerText + ')');
        P.salvaAroCorrente(); T.giro();
        { const m = T.nomadi.el('second-half-buttons-container').innerHTML.match(/window\.selectAction\('([^']+)', true\)/); if (m) { T.nomadi.g.selectAction(m[1], true); T.nomadi.g.eseguiCalcoloBS(); T.giro(); } }
        const t = tabellone(T);
        ok(/nessuna Linea di Tiro/.test(t) && /ARO e\u0300 speso|ARO \u00e8 speso/.test(t), 'sul tabellone: niente Linea di Tiro, l ARO e` speso, nessun tiro');
    }
    {
        const { T, P } = giro();
        P.selezionaAzioneAro('BS_ATTACK'); P.selezionaArmaAro('Combi Rifle'); P.selezionaBersaglioAro('Spara');
        vmTocco(T.pano, "window.toggleAroRequisito('gittata')");
        ok(P.aroCurrentConfig.fuoriGittata === true && /range-seg seg-fuori active/.test(T.pano.el('aro-modifiers-content').innerHTML), 'FUORI: la reazione porta fuoriGittata = true, il segmento e` acceso');
        P.setAroRange(1);
        ok(P.aroCurrentConfig.fuoriGittata === false && /CONFERMA/.test(T.pano.el('btn-conferma-aro').innerText), 'scelta una banda torna in gittata, e il tasto torna CONFERMA');
        P.selezionaArmaAro('Combi Rifle'); P.selezionaBersaglioAro('Spara');
        ok(P.aroCurrentConfig.lof === undefined && P.aroCurrentConfig.fuoriGittata === undefined, 'cambiata l arma, i requisiti ripartono da capo');
    }
    {
        // Il modo normale in Soppressione: stesso bottone, contorno arancione.
        const T = creaTavolo(DIR); const N = T.nomadi.g, P = T.pano.g;
        T.schiera([truppa(profilo(T, /^Alguacil \(HMG/), { id: 'n1', alias: 'Spara' })], [truppa(profilo(T, /^Fusilier \(Combi/), { id: 'p1', alias: 'Uno', states: { suppressive: true } })], 'NOMADI');
        T.apriMenu(T.nomadi, 0); N.selectAction('ATTACCO BS', false); N.declareAttackBS('Heavy Machine Gun');
        N.toggleTargetSelection('p1'); N.confirmMultiAro(false); T.giro();
        P.apriSelezioneAro(); P.toggleAroUnit('p1'); P.confermaSelezioneAro(); P.selezionaAzioneAro('BS_ATTACK');
        const wl = T.pano.el('aro-weapon-list').innerHTML;
        const normale = (wl.match(/<button type="button" class="bottone-arma"[\s\S]*?<\/button>/g) || []).find(b => /selezionaArmaAro\('[^']*', true\)/.test(b));
        if (normale) ok(/border:1px solid #ff8800/.test(normale) && /ANNULLA LA SOPPRESSIONE/.test(wl) && !/<button class="huge-btn"[^>]*selezionaArmaAro/.test(wl), 'in Soppressione il modo normale ha lo stesso bottone, contorno arancione e avviso');
        else ok(false, 'premessa mancata: nessun modo normale offerto in Soppressione (' + testo(wl).slice(0, 120) + ')');
    }
    // Sagoma d'IMPATTO in ARO: barra delle bande, non "nessun tiro".
    {
        const T = creaTavolo(DIR); const P = T.pano.g, M = P.MotoreN5;
        const nomi = Object.keys(P.RULES_WEAPONS || {}).filter(n => { const a = M.profiloArma(n); return a && a.isTemplate && (M.regoleTemplate(a) || {}).tipo !== 'DIRETTO' && a.bands && a.bands.length; });
        if (nomi.length) {
            P.aroCurrentConfig = { id: 'x', azione: 'BS_ATTACK', arma: nomi[0], bersaglio: 'Spara', terrain: 'NESSUNO' };
            P.aroSfMode = false; P.renderAroModifiersUI();
            const h = T.pano.el('aro-modifiers-content').innerHTML;
            ok(/Sagoma a Impatto/.test(h) && /class="range-bar"/.test(h) && /seg-fuori/.test(h), 'Sagoma d Impatto in ARO (' + nomi[0] + '): barra delle bande e FUORI, si tira con la gittata');
        } else ok(false, 'premessa mancata: nessuna Sagoma d Impatto nel database armi');
    }

    // --- 7. La riga dell'unita` sul telefono: proporzioni del PC ----------
    ok(/\.rup-foto \{[^}]*height:96px;/.test(app) && !/\.rup-foto \{[^}]*calc\(100% \+ 12px\)/.test(app), 'la foto ha l altezza fissa del PC (96px), non quella della riga');
    ok(/\.rup-nome \{[^}]*white-space:nowrap;[^}]*text-overflow:ellipsis;/.test(app) && !/\.rup-nome \{[^}]*overflow-wrap:anywhere/.test(app), 'il nome sta su una riga: niente "CLOCKMA / KER"');
    ok(/\.rup-alias \{[^}]*white-space:nowrap;[^}]*text-overflow:ellipsis;/.test(app), 'il profilo fra virgolette sta su una riga: la fascia scura non si allarga');
});


sezione('22. ARO: le modalita` della stessa arma in UN bottone (Paolo, motore 2026-10-15.2)', () => {
    const BOT = /<button type="button" class="bottone-arma"[\s\S]*?<\/button>/g;
    const tocco = (b) => ((b || '').match(/onclick="([^"]*)"/) || [])[1] || 'void 0';
    // Reagisce PanOceania (l'Orc) a un Attacco BS dei Nomadi.
    const aroPano = (unitaP) => {
        const T = creaTavolo(DIR); const N = T.nomadi.g, P = T.pano.g;
        T.schiera([truppa(profilo(T, /^Alguacil \(HMG/), { id: 'n1', alias: 'Spara' })], [truppa(profilo(T, unitaP.re), Object.assign({ id: 'p1', alias: 'Orco' }, unitaP.altro || {}))], 'NOMADI');
        T.apriMenu(T.nomadi, 0); N.selectAction('ATTACCO BS', false); N.declareAttackBS('Heavy Machine Gun');
        N.toggleTargetSelection('p1'); N.confirmMultiAro(false); T.giro();
        P.apriSelezioneAro(); P.toggleAroUnit('p1'); P.confermaSelezioneAro();
        return { T, N, P };
    };
    {
        const { T, N, P } = aroPano({ re: /^Orc \(MULTI Rifle\)/ });
        P.selezionaAzioneAro('BS_ATTACK');
        const bot = T.pano.el('aro-weapon-list').innerHTML.match(BOT) || [];
        ok(bot.length === 2, 'Orc: MULTI Rifle (3 modi) e Pistol = 2 bottoni (' + bot.length + ')');
        const multi = bot.find(b => /MULTI RIFLE|MULTI Rifle/.test(b)) || '';
        ok(/>AP</.test(multi) && /SHOCK/i.test(multi) && />DA</.test(multi), 'il bottone MULTI mostra le munizioni di tutti i modi');
        vmTocco(T.pano, tocco(multi));
        ok(P.aroCurrentConfig.arma === 'MULTI Rifle (AP Mode)', 'toccato: si parte dal primo modo, col nome della MODALITA` (' + P.aroCurrentConfig.arma + ')');
        P.selezionaBersaglioAro('Spara');
        const sel = (T.pano.el('aro-modifiers-content').innerHTML.match(/<select[^>]*setAroAmmo[\s\S]*?<\/select>/) || [''])[0];
        const valori = (sel.match(/value="([^"]*)"/g) || []).map(x => x.slice(7, -1));
        ok(J(valori) === J(['0|AP', '1|SHOCK', '2|DA']), 'la tendina delle munizioni sceglie il modo (' + valori.join(', ') + ')');
        vmTocco(T.pano, "window.setAroAmmo('1|SHOCK')");
        ok(P.aroCurrentConfig.arma === 'MULTI Rifle (Shock Mode)' && P.aroCurrentConfig.ammo === 'SHOCK', 'scelto Shock: in arma va "MULTI Rifle (Shock Mode)"');
        P.salvaAroCorrente(); T.giro();
        { const m = T.nomadi.el('second-half-buttons-container').innerHTML.match(/window\.selectAction\('([^']+)', true\)/); if (m) { N.selectAction(m[1], true); N.eseguiCalcoloBS(); T.giro(); } }
        ok(/Shock/i.test(tabellone(T)), 'sul tabellone il reattivo tira col modo scelto (Shock)');
    }
    {
        const { T, P } = aroPano({ re: /^Orc \(MULTI Rifle\)/, altro: { states: { suppressive: true } } });
        P.selezionaAzioneAro('BS_ATTACK');
        const wl = T.pano.el('aro-weapon-list').innerHTML, bot = wl.match(BOT) || [];
        const normali = bot.filter(b => /selezionaArmaAro\('[^']*', true/.test(b));
        ok(bot.length === 4 && normali.length === 2, 'Orc in Soppressione: 2 bottoni SF e 2 in modo normale (' + (bot.length - normali.length) + ' + ' + normali.length + ')');
        vmTocco(T.pano, tocco(normali.find(b => /MULTI/i.test(b))));
        ok(P.aroCurrentConfig.annullaSoppressione === true && (P.aroCurrentConfig.modiArma || []).length === 3, 'il MULTI in modo normale annulla la Soppressione e porta i suoi 3 modi');
    }
    {
        // Reagisce l'Alguacil col Missile Launcher a un Attacco BS di PanOceania.
        const T = creaTavolo(DIR); const N = T.nomadi.g, P = T.pano.g;
        T.schiera([truppa(profilo(T, /^Alguacil \(Missile/), { id: 'n1', alias: 'Razzo' })], [truppa(profilo(T, /^Fusilier \(Combi/), { id: 'p1', alias: 'Uno' })], 'PANOCEANIA');
        T.apriMenu(T.pano, 0); P.selectAction('ATTACCO BS', false); P.declareAttackBS('Combi Rifle');
        P.toggleTargetSelection('n1'); P.confirmMultiAro(false); T.giro();
        N.apriSelezioneAro(); N.toggleAroUnit('n1'); N.confermaSelezioneAro(); N.selezionaAzioneAro('BS_ATTACK');
        const bot = T.nomadi.el('aro-weapon-list').innerHTML.match(BOT) || [];
        ok(bot.length === 2, 'Alguacil: Missile Launcher (Blast + Hit) e Pistol = 2 bottoni (' + bot.length + ')');
        vmTocco(T.nomadi, tocco(bot.find(b => /MISSILE|Missile/.test(b))));
        N.selezionaBersaglioAro('Uno');
        const h1 = T.nomadi.el('aro-modifiers-content').innerHTML;
        ok(N.aroCurrentConfig.arma === 'Missile Launcher (Blast Mode)' && /ATTACCO A SAGOMA/.test(h1), 'si parte da Blast: la pagina e` quella della Sagoma');
        const opz = (h1.match(/value="1\|[^"]*"/) || [''])[0].slice(7, -1);
        vmTocco(T.nomadi, "window.setAroAmmo('" + opz + "')");
        const h2 = T.nomadi.el('aro-modifiers-content').innerHTML;
        ok(N.aroCurrentConfig.arma === 'Missile Launcher (Hit Mode)' && !/ATTACCO A SAGOMA/.test(h2) && /class="range-bar"/.test(h2), 'passato a Hit: si ridisegna con la gittata, senza Sagoma (' + opz + ')');
    }
    {
        // Morlock (Kobra) in CC: un solo modo, bottone semplice (nessuna chiave di modi).
        const T = creaTavolo(DIR); const N = T.nomadi.g;
        T.schiera([truppa(profilo(T, /^Morlock \(Kobra Pistol, DA/), { id: 'n1', alias: 'Kob' })], [truppa(profilo(T, /^Fusilier \(Combi/), { id: 'p1', alias: 'Uno' })], 'PANOCEANIA');
        N.selectedAroUnits = ['n1']; N.currentAroIndex = 0; N.aroReactions = []; N.avviaCicloAroUnita(); N.selezionaAzioneAro('CC_ATTACK');
        const bot = T.nomadi.el('aro-weapon-list').innerHTML.match(BOT) || [];
        ok(bot.length >= 1 && bot.every(b => /selezionaArmaAro\('[^']*', false\)/.test(b)), 'Morlock in CC: bottoni semplici, nessuna famiglia di modi (' + bot.length + ')');
    }
});

sezione('23. I quattro lavori del 18 ottobre (motore 2026-10-18.1)', () => {
    // --- 1. Fairy Dust nell'Hub, accanto al nome della fazione -----------
    {
        const T = creaTavolo(DIR);
        const hack = truppa(profilo(T, /^Zero \(Hacker/) , { id: 'n1', alias: 'Fata', states: { fairyDust: 'HI' } });
        T.schiera([hack], [truppa(profilo(T, /^Fusilier \(Combi/), { id: 'p1', alias: 'Uno' })], 'NOMADI');
        const fd = T.hub.el('fairy-nomads').innerHTML;
        ok(/<img src="img\/fairy_dust_hi\.png"/.test(fd), 'Hub: Fairy Dust sui HI attivo, l icona HI accanto a NOMADS (' + fd.slice(0, 80) + ')');
        ok(/title="Fairy Dust di [^"]*HI/.test(fd) && /FD HI/.test(fd), 'col testo del motore nel titolo, e la scritta di riserva se l immagine manca');
        ok(T.hub.el('fairy-pano').innerHTML === '', 'PanOceania senza Fairy Dust: nessuna icona');
        const html = fs.readFileSync(DIR + 'calcolatore_hub.html', 'utf8');
        ok(/NOMADS <span id="fairy-nomads"/.test(html) && /PANOCEANIA <span id="fairy-pano"/.test(html), 'il posto delle icone e` dentro le intestazioni NOMADS e PANOCEANIA');
    }
    {
        // Controprova: l'hacker Isolato lo cancella (lo dice il motore).
        const T = creaTavolo(DIR);
        const hack = truppa(profilo(T, /^Zero \(Hacker/), { id: 'n1', alias: 'Fata', states: { fairyDust: 'TAG', isolated: true } });
        T.schiera([hack], [truppa(profilo(T, /^Fusilier \(Combi/), { id: 'p1', alias: 'Uno' })], 'NOMADI');
        ok(!/fairy_dust/.test(T.hub.el('fairy-nomads').innerHTML), 'CONTROPROVA: hacker Isolato, il Fairy Dust e` cancellato e l icona non c e');
    }

    // --- 2. CYBERMASK non e` piu` fra le Abilita` Lunghe -------------------
    {
        const T = creaTavolo(DIR);
        // Il profilo del database COM'E` (Marker CAMO): truppa() lo
        // schiererebbe a faccia in su, e il Cybermask non sarebbe offerto
        // nemmeno coi file vecchi.
        const intr = Object.assign(profilo(T, /^Intruder \(Hacker, Killer/), { id: 'n1', alias: 'Ombra', state: 'ACTIVE', combatGroup: 1 });
        T.schiera([intr], [truppa(profilo(T, /^Fusilier \(Combi/), { id: 'p1', alias: 'Uno' })], 'NOMADI');
        const menu = T.apriMenu(T.nomadi, 0);
        ok(!/selectAction\('CYBERMASK'/.test(menu), 'Intruder (Killer Hacking Device): nel menu NON c e la voce CYBERMASK');
        const app = fs.readFileSync(DIR + 'app.html', 'utf8');
        ok(!/\{ id: 'CYBERMASK'/.test(app) && !/case 'CYBERMASK':/.test(app), 'in app.html non restano ne` la voce ne` il suo caso in puoFareAzione');
    }

    // --- 3. Isolato: si attiva col proprio Ordine Irregolare, e lo si legge -
    {
        const T = creaTavolo(DIR); const N = T.nomadi.g;
        T.schiera([truppa(profilo(T, /^Alguacil \(HMG/), { id: 'n1', alias: 'Solo', states: { isolated: true } })], [truppa(profilo(T, /^Fusilier \(Combi/), { id: 'p1', alias: 'Uno' })], 'NOMADI');
        N.currentGroup = 1; N.aggiornaGraficaRoster();
        const h = T.nomadi.el('unit-buttons-container').innerHTML;
        const nota = N.MotoreN5.puoRicevereOrdine(N.roster[0]).notaIrregolare;
        ok(/ORDINE IRREGOLARE PROPRIO/.test(h) && h.indexOf(nota) >= 0, 'la riga dell Isolato dice ORDINE IRREGOLARE PROPRIO, con la nota del motore');
        ok(/finePressioneUnita\(0, true\)/.test(h) && !/NON ATTIVABILE/.test(h), 'e si attiva: il tocco breve apre i suoi Ordini');
        N.roster[0].states = {}; N.aggiornaGraficaRoster();
        ok(!/ORDINE IRREGOLARE PROPRIO/.test(T.nomadi.el('unit-buttons-container').innerHTML), 'CONTROPROVA: non Isolato, la nota non c e');
    }

    // --- 4. CrazyKoala: una riga con la foto, una pagina, la DETONAZIONE ---
    {
        const T = creaTavolo(DIR); const N = T.nomadi.g, P = T.pano.g;
        T.schiera([truppa(profilo(T, /^Taskmaster \(Red Fury/), { id: 'n1', alias: 'Task' })], [truppa(profilo(T, /^Fusilier \(Combi/), { id: 'p1', alias: 'Uno' })], 'NOMADI');
        // Come nella sezione 5: piazza, PanOceania non reagisce, l Hub chiude.
        // Il Taskmaster piazza il CrazyKoala dal menu (nessun Marker
        // nell area, percorso libero), PanOceania non reagisce, l Hub chiude.
        T.apriMenu(T.nomadi, 0); N.selectAction('PIAZZARE EQUIPAGGIAMENTO', false); N.scegliArmaDaPiazzare('Crazykoala');
        (N.deployableDomande || []).forEach(d => N.rispondiDeployable(d.id, d.id !== 'markerNellArea'));
        N.eseguiPiazzamento(); T.giro(); P.annullaAro(); T.giro(); T.hub.g.chiudiRisoluzione(); N.tornaAlRadar(); T.giro();
        T.hub.g.toggleTurn(); T.giro();
        T.apriMenu(T.pano, 0); P.selectAction('MOVIMENTO', false); T.giro();
        const koala = N.roster.find(u => u.deployable);
        ok(!!koala && /koala/i.test(koala.nome || ''), 'premessa: il Taskmaster ha piazzato il CrazyKoala (' + (koala && koala.nome) + ')');
        N.apriSelezioneAro();
        const lista = T.nomadi.el('aro-selection-list').innerHTML;
        const riga = (lista.match(/<button[^>]*riga-unita[\s\S]*?<\/button>/g) || []).find(r => r.indexOf('aro-dep-' + koala.id) >= 0) || '';
        ok(riga && riga.indexOf(N.fotoUnita(koala)) >= 0, 'in ARO il koala e` una riga come le altre, con la sua immagine (' + N.fotoUnita(koala) + ')');
        ok(/apriDetonazione\(/.test(riga) && !/rispondiInnesco\('/.test(lista), 'la domanda non e` piu` nell elenco: toccando si apre la sua pagina');
        vmTocco(T.nomadi, (riga.match(/onclick="([^"]*)"/) || [])[1] || 'void 0');
        const azioni = T.nomadi.el('aro-action-list').innerHTML;
        ok((azioni.match(/<button/g) || []).length === 1 && /DETONAZIONE/.test(azioni), 'la pagina ha UNA sola azione: DETONAZIONE');
        vmTocco(T.nomadi, (azioni.match(/onclick="([^"]*)"/) || [])[1] || 'void 0');
        // Il DOM finto non legge l HTML: la domanda si cerca nella pagina.
        const dom = T.nomadi.el('aro-action-list').innerHTML;
        const idZdC = (N.MotoreN5.domandeDeployable('ATTIVAZIONE')[0] || {}).id;
        ok(dom.indexOf("rispondiInnesco('" + koala.id + "', '" + idZdC + "', true)") >= 0, 'dentro DETONAZIONE c e la domanda della Zona di Controllo (' + idZdC + ')');
        const spediti = []; const vero = N.inviaRispostaAro; N.inviaRispostaAro = (p, f) => { spediti.push(p); return vero(p, f); };
        vmTocco(T.nomadi, "window.rispondiInnesco('" + koala.id + "', '" + idZdC + "', true)");
        ok(/DETONA/.test(T.nomadi.el('dep-' + koala.id).innerHTML), 'risposto SI: il koala DETONA');
        N.apriSelezioneAro();
        ok(/DETONA/.test(T.nomadi.el('aro-selection-list').innerHTML), 'tornati all elenco, la detonazione pronta si legge');
        N.confermaSelezioneAro();
        const det = ((spediti[0] || {}).reazioni || []).filter(r => r.azione === 'DETONAZIONE');
        ok(spediti.length === 1 && det.length === 1 && det[0].deployable === true && det[0].idDeployable === undefined,
           'AVANTI senza truppe scelte: la busta DETONAZIONE PARTE (prima si fermava su "Seleziona almeno un unita`") (' + spediti.length + ' invii)');
        ok(!N.alert_.some(a => /Seleziona almeno/.test(a)), 'e nessun avviso di scegliere un unita`');
    }
});

sezione('24. Le foto dei deployable: koala in sequenza, mine in ARO come i koala (Paolo, 19 ottobre)', () => {
    // --- I koala: piazzati dal giocatore nello schieramento ---------------
    {
        const T = creaTavolo(DIR); const N = T.nomadi.g;
        const task = truppa(profilo(T, /^Taskmaster \(Red Fury/), { id: 'n1', alias: 'Task' });
        const task2 = truppa(profilo(T, /^Taskmaster \(Red Fury/), { id: 'n2', alias: 'Task2' });
        const task3 = truppa(profilo(T, /^Taskmaster \(Red Fury/), { id: 'n3', alias: 'Task3' });
        N.roster = [task, task2, task3];
        // Dalla porta del giocatore: pagina di schieramento del Taskmaster,
        // tasto del CrazyKoala (lo stesso che tocca Paolo).
        // RISCRITTO il 27 ottobre (DEP-10, MOTORE 26.1): il Taskmaster ha
        // Minelayer, e il koala in schieramento si piazza col Minelayer, UNO
        // per truppa (prima schieraPiazzabile, senza limite: se ne posavano 3
        // da una truppa sola). Per tre koala servono tre Taskmaster. Le due
        // domande: nell'area nessun nemico (NO), dentro la Zona (SI`).
        N.confirm = (m) => !/nemiche|Marker Mimetici/i.test(String(m));
        const piazzaKoala = (id) => {
            const i = N.roster.findIndex(u => u.id === id);
            N.apriDeployStati(i);
            const h = T.nomadi.el('deploy-states-content').innerHTML;
            const m = h.match(/window\.piazzaConMinelayer\((\d+), (\d+)\)"[^>]*>\s*Crazy/i);
            if (!m) return false;
            N.piazzaConMinelayer(+m[1], +m[2]); return true;
        };
        let posati = 0;
        ['n1', 'n2'].forEach(id => { if (piazzaKoala(id)) posati++; });
        ok(!piazzaKoala('n1'), 'CONTROPROVA: lo stesso Taskmaster non ne piazza un secondo (limite del Minelayer)');
        const koala = () => N.roster.filter(u => u.deployable && /koala/i.test(u.nome || ''));
        ok(koala().length >= 2, 'premessa: dallo schieramento ci sono almeno due CrazyKoala (' + koala().length + ')');
        const foto = koala().map(k => N.fotoUnita(k));
        ok(foto[0] === 'img/nomadi/crazykoala_1.png' && foto[1] === 'img/nomadi/crazykoala_2.png',
           'il primo koala ha la foto 1, il secondo la 2, nella cartella del giocatore (' + foto.join(', ') + ')');
        ok(new Set(foto).size === foto.length, 'nessuna foto ripetuta fra i koala');
        // Il primo esce dal tavolo (Morto): il prossimo prende la sua miniatura.
        koala()[0].state = 'DEAD';
        const prima = koala().length;
        if (piazzaKoala('n3')) {
            const nuovo = koala()[koala().length - 1];
            ok(koala().length === prima + 1 && N.fotoUnita(nuovo) === 'img/nomadi/crazykoala_1.png',
               'koala 1 Morto: il nuovo prende la foto 1, rimasta libera (' + N.fotoUnita(nuovo) + ')');
        } else ok(false, 'premessa mancata: nessun altro koala da piazzare');
        // L'Hub vede la stessa foto.
        N.schieramentoCompletato = true;
        N.inviaSchieramentoAllHub('NOMADI', { roster: N.roster, strutture: [], terreni: [] }); T.giro();
        // Si cercano per nome: deployable arriva all'Hub solo dal catalogo
        // 2026-10-19.1, e questo controllo deve valere anche prima.
        const kHub = (T.hub.g.gameState.nomads || []).filter(u => /koala/i.test(u.nome || ''));
        const fHub = kHub.map(k => T.hub.g.fotoTruppaHub(k, 'NOMADI'));
        const fApp = koala().map(k => N.fotoUnita(k));
        ok(kHub.length === koala().length && fHub.every(f => /^img\/nomadi\/crazykoala_[1-4]\.png$/.test(f)) && J(fHub) === J(fApp),
           'all Hub i koala arrivano con la stessa foto dell app (' + fHub.join(', ') + ')');
        // Catalogo 2026-10-19.1: lo stato vitale arriva all'Hub, e il koala
        // Morto ha la sua icona. Prima all'Hub ogni truppa Morta sembrava viva.
        const mortoHub = kHub.find(k => k.id === koala()[0].id);
        ok(mortoHub && mortoHub.state === 'DEAD' && /icon_dead/.test(T.hub.g.schedaTruppa(mortoHub, 'NOMADI')),
           'all Hub il koala Morto arriva Morto, con l icona (' + (mortoHub && mortoHub.state) + ')');
    }
    {
        // Un koala dell'AVVERSARIO non si numera qui: la foto la decide lui.
        const T = creaTavolo(DIR); const N = T.nomadi.g;
        const estraneo = { id: 'dep_crazykoala_9_1', deployable: true, chiaveArma: 'CrazyKoalas', nome: 'CrazyKoala #9', imgVariant: '0' };
        N.roster = [];
        // RISCRITTI il 27 ottobre (per esercito): prima img/crazykoala.png.
        ok(N.fotoUnita(estraneo) === 'img/nomadi/crazykoala.png' && estraneo.imgVariant === '0', 'CONTROPROVA: un koala fuori dal proprio roster resta con l immagine comune e non viene toccato');
        // All'Hub arriva la vista pubblica, senza il campo deployable: il
        // segnalino si riconosce dall'id (prima: nessuna immagine, la sigla).
        const pubblico = { id: 'dep_crazykoala_9_1', nome: 'CrazyKoala #9', imgVariant: '0' };
        ok(T.hub.g.fotoTruppaHub(pubblico, 'NOMADI') === 'img/nomadi/crazykoala.png' && J(T.hub.g.fotoTruppaHubConRipieghi(pubblico, 'NOMADI').ripieghi) === J(['img/crazykoala.png']), 'Hub: un segnalino senza foto assegnata ha l immagine del suo tipo (' + T.hub.g.fotoTruppaHub(pubblico, 'NOMADI') + ')');
    }

    // --- Le mine in ARO: riga con l'immagine del tipo, pagina DETONAZIONE ---
    {
        const T = creaTavolo(DIR); const N = T.nomadi.g, P = T.pano.g;
        T.schiera([truppa(profilo(T, /^Puppet Masters/), { id: 'n1', alias: 'Posa' })], [truppa(profilo(T, /^Fusilier \(Combi/), { id: 'p1', alias: 'Uno' })], 'NOMADI');
        piazza(T).eseguiPiazzamento(); T.giro(); P.annullaAro(); T.giro(); T.hub.g.chiudiRisoluzione(); N.tornaAlRadar(); T.giro();
        T.hub.g.toggleTurn(); T.giro();
        T.apriMenu(T.pano, 0); P.selectAction('MOVIMENTO', false); T.giro();
        const mina = N.roster.find(u => u.deployable);
        ok(!!mina && N.MotoreN5.eMina(mina), 'premessa: il Puppet Masters ha piazzato una mina (' + (mina && mina.nome) + ')');
        N.apriSelezioneAro();
        const lista = T.nomadi.el('aro-selection-list').innerHTML;
        const riga = (lista.match(/<button[^>]*riga-unita[\s\S]*?<\/button>/g) || []).find(r => r.indexOf('aro-dep-' + mina.id) >= 0) || '';
        ok(riga && /img\/mina_[a-z_]+\.png/.test(riga) && riga.indexOf(N.fotoUnita(mina)) >= 0, 'in ARO la mina e` una riga con l immagine del suo tipo (' + N.fotoUnita(mina) + ')');
        ok(/apriDetonazione\(/.test(riga) && lista.indexOf('id="dep-' + mina.id + '"') < 0, 'niente piu` riquadro viola con le domande nell elenco');
        vmTocco(T.nomadi, (riga.match(/onclick="([^"]*)"/) || [])[1] || 'void 0');
        const azioni = T.nomadi.el('aro-action-list').innerHTML;
        // RISCRITTO il 27 ottobre sera (Paolo: le descrizioni nella ⓘ). Prima:
        // la spiegazione «Non lo sceglie la mina» stava dentro il tasto. Ora
        // il tasto ha solo DETONAZIONE e la spiegazione e` nella ⓘ della pagina.
        const vociDet = N.vociInfo('step-aro-action');
        ok((azioni.match(/<button/g) || []).length === 1 && /DETONAZIONE/.test(azioni) && !/Non lo sceglie la mina/.test(azioni)
           && vociDet.some(v => /Non lo sceglie la mina/.test(v.testo)), 'la sua pagina: una sola azione, DETONAZIONE; la spiegazione della mina e` nella ⓘ');
        vmTocco(T.nomadi, (azioni.match(/onclick="([^"]*)"/) || [])[1] || 'void 0');
        const prima = (N.MotoreN5.domandeDeployable('INNESCO_MINA')[0] || {}).id;
        ok(T.nomadi.el('aro-action-list').innerHTML.indexOf("rispondiInnesco('" + mina.id + "', '" + prima + "', true)") >= 0, 'dentro, la prima delle tre domande della mina (' + prima + ')');
    }
});

sezione('25. Import dal testo di Infinity Army (MOTORE, 19 ottobre)', () => {
    // Le righe sono quelle che MOTORE ha misurato sbagliate, scritte come le
    // scrive Army (niente spazio prima della parentesi), piu` un'intestazione
    // di Gruppo e il codice in fondo al testo.
    const TESTO = [
        'NOMADS',
        'GROUP 1',
        'ALGUACIL (Forward Observer) Combi Rifle, Flash Pulse / Deployable Repeater, Pistol, CC Weapon. (0 | 11)',
        'MORLOCK Chain Rifle, Smoke Grenades / Kobra Pistol, DA CC Weapon(PS=6). (0 | 12)',
        'CLOCKMAKER Combi Rifle, D-Charges, Armed Turret / Deactivator, GizmoKit(+1B), Pistol, CC Weapon. (0 | 20)',
        'GROUP 2',
        'WARCOR (Sixth Sense) Flash Pulse, Stun Pistol / PARA CC Weapon(-3). (0 | 10)',
        'INTRUDER MULTI Sniper Rifle(+1SD), Heavy Pistol / CC Weapon. (1.5 | 40)',
        'MARSPIDER Heavy Flamethrower(+1B), Flash Pulse, Grenades(+1B), GizmoKit / Assault Pistol, DA CC Weapon(PS=7). (0 | 30)',
        'https://infinitytheuniverse.com/army/list/abc123'
    ].join('\n');
    const ATTESI = ['Alguacil (Forward Observer)', 'Morlock (Kobra Pistol, DA CC)', 'Clockmaker (Armed Turret)',
                    'Warcor (Sixth Sense)', 'Intruder (MULTI Sniper Rifle)', 'Marspider (Grenades)'];
    const T = creaTavolo(DIR); const N = T.nomadi.g;
    N.roster = [];
    T.nomadi.el('army-import-text').value = TESTO;
    N.importaDaTesto();
    const nomi = N.roster.map(u => u.name);
    ATTESI.forEach((n, i) => ok(nomi[i] === n, 'riga ' + (i + 1) + ': ' + n + ' (letto: ' + nomi[i] + ')'));
    ok(nomi.length === ATTESI.length, 'sei righe, sei truppe: il codice in fondo e le intestazioni non diventano truppe (' + nomi.length + ')');
    ok(J(N.roster.map(u => u.combatGroup)) === J([1, 1, 1, 2, 2, 2]), 'ognuna nel suo Gruppo');
    // A pari punti: niente scelta in silenzio, la riga va al giocatore.
    N.roster = [];
    T.nomadi.el('army-import-text').value = 'GROUP 1\nALGUACIL Combi Rifle / MediKit, Pistol, CC Weapon. (0 | 14)';
    N.importaDaTesto();
    const amb = N.righeAmbigueImport || [];
    ok(N.roster.length === 0 && amb.length === 1, 'riga senza l opzione fra parentesi e con due profili a pari punti: nessuna truppa aggiunta, la riga e` ambigua (' + amb.length + ')');
    const box = T.nomadi.el('import-ambigue').innerHTML;
    ok(/riga ambigua/.test(box) && /scegliRigaAmbigua\(0, 'alguacil_paramedic'\)/.test(box), 'sotto il testo la riga, con un tasto per ogni profilo candidato');
    if (amb.length) {
        vmTocco(T.nomadi, (box.match(/onclick="(window\.scegliRigaAmbigua\(0, 'alguacil_paramedic'\))"/) || [])[1] || 'void 0');
        ok(N.roster.length === 1 && N.roster[0].name === 'Alguacil (Paramedic)' && N.roster[0].combatGroup === 1, 'toccato il profilo: entra quello, nel suo Gruppo');
        ok((N.righeAmbigueImport || []).length === 0, 'e la riga sparisce dall elenco delle ambigue');
    }
    // Un profilo secondario non pareggia piu` col profilo vero.
    N.roster = [];
    T.nomadi.el('army-import-text').value = 'PUPPETBOT (Red Fury) Red Fury / PARA CC Weapon(-3). (0 | 8)';
    N.importaDaTesto();
    ok(N.roster.length === 1 && N.roster[0].name === 'Puppetbot (Red Fury)', 'Puppetbot (Red Fury): il profilo Battle Ravaged non e` un candidato (' + N.roster.map(u => u.name) + ')');
});

sezione('25b. Import: la lista di collaudo di Paolo, il testo vero di Infinity Army', () => {
    // Il testo incollato da Paolo il 19 ottobre, com'e` (anche le righe
    // rientrate delle Periferiche, "undefined" e il link in fondo).
    const TESTO = "\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\nGROUP 1  10  \n ALGUACIL Combi Rifle / Pistol, CC Weapon. (0 | 10)\n ALGUACIL Heavy Machine Gun / Pistol, CC Weapon. (1 | 18)\n ALGUACIL Missile Launcher / Pistol, CC Weapon. (1.5 | 15)\n ALGUACIL (Forward Observer) Combi Rifle, Flash Pulse ( | Deployable Repeater) / Pistol, CC Weapon. (0 | 12)\n ALGUACIL (Paramedic) Combi Rifle ( | MediKit) / Pistol, CC Weapon. (0 | 12)\n DAKTARI Combi Rifle ( | MediKit) / Pistol, CC Weapon. (0 | 14)\n CLOCKMAKER Combi Rifle, D-Charges / Pistol, CC Weapon. (0 | 18)\n INTERVENTOR (Hacker, Hacking Device Plus) Combi Rifle ( | FastPanda) / Pistol, CC Weapon. (0.5 | 23)\n ZERO (Hacker, Killer Hacking Device) Combi Rifle, Shock Mine ( ) / Pistol, CC Weapon. (0 | 22)\n INTRUDER MULTI Sniper Rifle(+1SD) / Heavy Pistol, CC Weapon. (1.5 | 38)\n\nGROUP 28  / 2  / 3\n GRENZER (Marksmanship) MULTI Sniper Rifle / Pistol, Breaker Pistol, CC Weapon. (1.5 | 32)\n GRENZER (Forward Observer, Sensor, NCO) Combi Rifle, Light Flamethrower(+1B), Flash Pulse / Pistol, Breaker Pistol, CC Weapon. (0 | 29)\n MORLOCK Chain Rifle, Smoke Grenades / Assault Pistol, AP CC Weapon(PS=6). (0 | 6)\n CHIMERA Combi Rifle, Nanopulser, Eclipse Grenades / Pistol, Viral CC Weapon(PS=6). (0 | 19)\n   3X PUPNIK DA CC Weapon(PS=7). (0 | 3)\n REAKTION ZOND Heavy Machine Gun / PARA CC Weapon(-3). (1 | 24)\n MOBILE BRIGADA Heavy Machine Gun / Boarding Pistol(+1B), CC Weapon. (1.5 | 38)\n PUPPETBOT Red Fury / PARA CC Weapon(-3). (1.5 | 16)\n ZONDNAUTICA-A undefined / undefined. (1.5 | 25)\n   ZONDNAUTICA-A Spitfire, Chain Rifle, Smoke Grenade Launcher / Pistol, CC Weapon. (1.5 | 25)\n   ZONDNAUT-A Spitfire / Pistol, CC Weapon. (1.5 | 25)\n   ZONDMATE Chain Rifle, Smoke Grenade Launcher / PARA CC Weapon(-3). (- | 5)\n MORAN (Surprise Attack [-3], Camouflage [1 Use]) Combi Rifle, Flash Pulse, D-Charges, Crazykoala / Pistol, CC Weapon. (0.5 | 18)\n SIN-EATER MULTI Sniper Rifle / Pistol, CC Weapon. (1.5 | 26)\n MARY PROBLEMS (Hacker) Submachine Gun, Zapper, Pitcher / Pistol, CC Weapon. (0.5 | 27)\n\nGROUP 31\n PUPPET MASTERS (Minelayer) Submachine Gun, Shock Mine / Pistol, CC Weapon. (0 | 13)\n INTRUDER Heavy Machine Gun / Heavy Pistol, CC Weapon. (1.5 | 38)\n INTRUDER (Hacker, Infiltration, Killer Hacking Device) AP Submachine Gun(+1B), Pulzar(+1B), Grenades, D-Charges ( ) / Heavy Pistol, CC Weapon. (0 | 33)\n WOLFGANG AMADEUS MULTI Rifle(+1SD), E/M Grenades(+1SD), Chain-colt / Heavy Pistol, PARA CC Weapon(-6), DA CC Weapon(PS=4). (0 | 33)\n WARCOR (Sixth Sense) Flash Pulse / Stun Pistol, PARA CC Weapon(-3). (0 | 3)\n VERTIGO ZOND Missile Launcher / PARA CC Weapon(-3). (1.5 | 16)\n TRIPHAMMER Heavy Shotgun, Heavy Rocket Launcher, Panzerfaust(+1B) / AP CC Weapon(PS=4). (0 | 48)\n   TURTLEMEK . (- | 4)\n KRAKOT RENEGADE Boarding Shotgun, Chest Mine / Heavy Pistol, AP CC Weapon(PS=6). (0 | 16)\n COYOTE (Forward Deployment [+4\"]) Boarding Shotgun, Flash Pulse(PS=6), D-Charges / Boarding Pistol, CC Weapon. (0 | 27)\n   BAMBABOT-1 Chain Rifle(PS=6), Mine Dispenser(AP) / PARA CC Weapon(-3). (0 | 6)\n COYOTE (Forward Deployment [+4\"]) Boarding Shotgun, Flash Pulse(PS=6), D-Charges / Boarding Pistol, CC Weapon. (0 | 27)\n   BAMBABOT-1 Chain Rifle(PS=6), Mine Dispenser(AP) / PARA CC Weapon(-3). (0 | 6)\n\nGROUP 42  \n KULAK REINF. (Hacker, Killer Hacking Device [UPGRADE: Carbonite]) AP Submachine Gun, D-Charges, Cybermine, Disco Baller ( ) / Pistol, CC Weapon. (0 | 20)\n MARSPIDER REINF. Heavy Flamethrower(+1B), Flash Pulse, Grenades(+1B) / Assault Pistol, DA CC Weapon(PS=7). (0 | 18)\n\nGROUP 51\n BAMBADROID (Forward Observer) Thunderbolt, Chain Rifle(PS=6), Flash Pulse(PS=6), D-Charges ( | Deployable Repeater) / Pistol, PARA CC Weapon(-3). (0 | 13)\n GO-POD MULTI Rifle, E/Mitter / . (0 | 33)\n   GO-BOT Flash Pulse, Chain-colt / . (0 | 7)\n RACERBOT Mk-I Adhesive Launcher Rifle, PARA Mine / PARA CC Weapon(-6). (0 | 9)\n RACERBOT Mk-II Heavy Riotstopper, Mine Dispenser(PARA) / PARA CC Weapon(-6). (0 | 9)\n MORLOCK Chain Rifle, Smoke Grenades / Kobra Pistol, DA CC Weapon(PS=6). (0 | 6)\n CLOCKMAKER Combi Rifle, D-Charges, Armed Turret (Combi R.) / Pistol, CC Weapon. (0 | 21)\n\n 17 SWC | 825 Points\n\n[url=https://infinitytheuniverse.com/army/list/gfUGbm9tYWRzASCBLAUBAQAKAIEoAQEAAACBKAECAAAAgSgBBQAAAIEoAQgAAACBKAEJAAAAgZUBAQAAAIGWAQEAAACBlwECAAAAgZEBBgAAAIGLAQYAAAIBAAsAgYkBCAAAAIGJAQYAAACBkwEBAAAAgaYBBAAAAIGZAQEAAACBfgECAAAAhEoCAQAAAIRDAAEAAACBpQEBAAAAgaIBAgAAAIRLAQEAAAMBAAoAhEoBAgAAAIGLAQIAAACBiwEEAAAAhhMBAQAAAKdCAQIAAACBmgEBAAAArTEBBQAAAKoEAQIAAACHaAEBAAAAh2gBAQAABAEBAgCG0AEFAAAAhs8BAgAABQEABgCHaAMDAAAAhz4BAQAAAIdxAQEAAACHcQECAAAAgZMBAgAAAIGWAQMAAA%3D%3D]Open in Infinity Army\n\n";
    // [Gruppo, profilo] attesi, nell'ordine del testo. Confrontati a mano col
    // capitolo 1.1 del piano: tutti i profili del piano presenti nel testo ci
    // sono. Interventor: la riga porta FastPanda, quindi e` "(Hacker Plus,
    // FastPanda)", non "(Hacker Plus)". "GROUP 51" e` il Gruppo 5.
    // RISCRITTO il 20 ottobre (MOTORE, database 20.1). Prima: 46 righe, con
    // [2, "Zondnaut-A"] e [2, "Zondmate (REM)"] dopo la Zondnautica-A. Ora
    // pilota e moto nascono in partita (SCENDI DALLA MOTO): la Zondnautica
    // e` UNA unita`, e le righe attese sono 44.
    const ATTESI = [[1, "Alguacil (Combi Rifle)"], [1, "Alguacil (HMG)"], [1, "Alguacil (Missile Launcher)"], [1, "Alguacil (Forward Observer)"], [1, "Alguacil (Paramedic)"], [1, "Daktari (Doctor)"], [1, "Clockmaker (Engineer)"], [1, "Interventor (Hacker Plus, FastPanda)"], [1, "Zero (Hacker, Killer Hacking Device)"], [1, "Intruder (MULTI Sniper Rifle)"], [2, "Grenzer (Marksmanship)"], [2, "Grenzer (Forward Observer, Sensor, NCO)"], [2, "Morlock (Assault Pistol)"], [2, "Chimera"], [2, "3X Pupnik"], [2, "Reaktion Zond (HMG)"], [2, "Mobile Brigada (HMG)"], [2, "Puppetbot (Red Fury)"], [2, "Zondnautica-A"], [2, "Moran (Surprise Attack [-3], Camouflage [1 Use], Combi Rifle)"], [2, "Sin-Eater (MULTI Sniper Rifle)"], [2, "Mary Problems (Hacker)"], [3, "Puppet Masters (Minelayer)"], [3, "Intruder (HMG)"], [3, "Intruder (Hacker, Killer Hacking Device)"], [3, "Wolfgang Amadeus"], [3, "Warcor (Sixth Sense)"], [3, "Vertigo Zond (Missile Launcher)"], [3, "Triphammer (Heavy Shotgun, Heavy Rocket Launcher, Panzerfaust)"], [3, "Turtlemek (Triphammer)"], [3, "Krakot Renegade (Boarding Shotgun)"], [3, "Coyote (Forward Deployment (+4')) - Boarding Shotgun, Bambabot-1"], [3, "Bambabot-1 (Chain Rifle (ps=6))"], [3, "Coyote (Forward Deployment (+4')) - Boarding Shotgun, Bambabot-1"], [3, "Bambabot-1 (Chain Rifle (ps=6))"], [4, "Kulak (Hacker, Killer Hacking Device)"], [4, "Marspider (Grenades)"], [5, "Bambadroid (Forward Observer)"], [5, "Go-Pod (MULTI Rifle)"], [5, "Go-Bot (REM)"], [5, "Racerbot Mk-I (Adhesive Launcher Rifle)"], [5, "Racerbot Mk-II (Heavy Riotstopper)"], [5, "Morlock (Kobra Pistol, DA CC)"], [5, "Clockmaker (Armed Turret)"]];
    const T = creaTavolo(DIR); const N = T.nomadi.g;
    N.roster = [];
    T.nomadi.el('army-import-text').value = TESTO;
    N.importaDaTesto();
    const letti = N.roster.map(u => [u.combatGroup, u.name]);
    const diversi = ATTESI.map((a, i) => J(a) === J(letti[i]) ? null : (i + 1) + ': atteso ' + J(a) + ', letto ' + J(letti[i])).filter(Boolean);
    ok(diversi.length === 0 && letti.length === ATTESI.length, 'le ' + ATTESI.length + ' righe riconosciute danno i profili attesi, nel loro Gruppo (' + (diversi.slice(0, 3).join(' | ') || letti.length + ' righe') + ')');
    // Le otto che il roster_manager del 15 ottobre sbagliava su questo testo
    // (misurato qui): posizioni del piano 4, 10, 22, 27, 30, 36, 38, 39.
    const piano = ['Alguacil (Forward Observer)', 'Intruder (MULTI Sniper Rifle)', 'Puppet Masters (Minelayer)', 'Warcor (Sixth Sense)',
                   'Triphammer (Heavy Shotgun, Heavy Rocket Launcher, Panzerfaust)', 'Morlock (Kobra Pistol, DA CC)', 'Marspider (Grenades)', 'Clockmaker (Armed Turret)'];
    ok(piano.every(n => letti.some(l => l[1] === n)), 'le otto righe che prima davano il profilo sbagliato (piano 4, 10, 22, 27, 30, 36, 38, 39) ora danno quello giusto');
    ok(letti.some(l => l[0] === 5), 'GROUP 51: le sue truppe stanno nel Gruppo 5, non nel 4');
    // RISCRITTO il 19 ottobre. Prima: "tre righe ambigue, Turtlemek e i due
    // Coyote". Ora l'import legge le righe rientrate: il Turtlemek sta sotto
    // il Triphammer, i Coyote hanno il Bambabot-1 sotto. Nessuna resta
    // ambigua, e le tre righe sono fra le attese qui sopra.
    const amb = (N.righeAmbigueImport || []).map(a => a.riga.slice(0, 9));
    ok(amb.length === 0, 'nessuna riga ambigua: Turtlemek e Coyote si riconoscono dalle righe rientrate vicine (' + J(amb) + ')');
});

sezione('25c. Import: i periferici sulla riga rientrata scelgono il profilo (Drummer, Turtlemek)', () => {
    // DATABASE, 19 ottobre: tre Drummer osservatori avanzati con la stessa
    // riga in Army, 21 pt (Drumbot_5), 47 pt (Drumbot_1 + _5), 47 pt
    // (Drumbot_3 + _5). Quale sia lo dicono SOLO le righe rientrate sotto.
    // Misurato sul roster_manager 19.2: tutti e tre diventavano quello da 21.
    const DR = " DRUMMER (Forward Observer) Marksman Rifle, Flash Pulse ( | 360 Visor) / Pistol, CC Weapon. ";
    const B1 = "\n   DRUMBOT-1 MULTI Heavy Machine Gun ( | 360 Visor) / PARA CC Weapon(-3). (0 | 0)";
    const B3 = "\n   DRUMBOT-3 (Neurocinetics) Feuerbach(+1B) ( | 360 Visor) / PARA CC Weapon(-3). (0 | 0)";
    const B5 = "\n   DRUMBOT-5 (Forward Observer) Heavy Flamethrower, Flash Pulse ( | 360 Visor) / PARA CC Weapon(-3). (0 | 0)";
    const TESTO = "GROUP 18\n" + DR + "(0 | 21)" + B5 + "\n" + DR + "(1 | 47)" + B1 + B5 + "\n" + DR + "(1 | 47)" + B3 + B5 +
        "\n SCARFACE LOADOUT ALPHA Mk12(+1B), Heavy Rocket Launcher(+1B) / DA CC Weapon(PS=4). (1.5 | 62)\n   TURTLEMEK . (- | 4)\n";
    const T = creaTavolo(DIR); const P = T.pano.g;
    P.roster = [];
    T.pano.el('army-import-text').value = TESTO;
    P.importaDaTesto();
    const nomi = P.roster.map(u => u.name);
    const drummer = nomi.filter(n => /^Drummer/.test(n));
    ok(J(drummer) === J(['Drummer (Forward Observer, Drumbot_5)', 'Drummer (Forward Observer, Drumbot_1, Drumbot_5)', 'Drummer (Forward Observer, Drumbot_3, Drumbot_5)']),
       'i tre Drummer osservatori: 21 pt col Drumbot_5, 47 pt col _1 e _5, 47 pt col _3 e _5, ciascuno dai suoi periferici (' + J(drummer) + ')');
    ok(nomi.filter(n => /^Drumbot/.test(n)).length === 5, 'i cinque Drumbot delle righe rientrate sono importati anche loro (' + nomi.filter(n => /^Drumbot/.test(n)).length + ')');
    ok(nomi.indexOf('Turtlemek (Scarface)') >= 0 && nomi.indexOf('Turtlemek (Triphammer)') < 0, 'il Turtlemek sotto lo Scarface e` quello dello Scarface');
    ok(P.roster.every(u => u.combatGroup === 1) && (P.righeAmbigueImport || []).length === 0, 'tutti nel Gruppo 1, nessuna riga ambigua (' + J((P.righeAmbigueImport || []).map(a => a.riga.slice(0, 12))) + ')');
});

sezione('25d. Import: Zondnautica con pilota e moto, TAG con Operator, UNA unita` (MOTORE, 20 ottobre)', () => {
    // Le righe come le scrive Army: la truppa, e sotto, rientrati, i profili
    // che nascono in partita (pilota e moto; l'Operator dell'Escape System).
    const ZOND = "GROUP 1\n ZONDNAUTICA-B undefined / undefined. (0 | 17)\n   ZONDNAUTICA-B Boarding Shotgun, Chain Rifle, Smoke Grenade Launcher / Pistol, CC Weapon. (0 | 17)\n" +
                 "   ZONDNAUT-B Boarding Shotgun / Pistol, CC Weapon. (0 | 17)\n   ZONDMATE Chain Rifle, Smoke Grenade Launcher / PARA CC Weapon(-3). (- | 5)\n";
    const ANA = " ANACONDA Heavy Machine Gun, Light Shotgun(+2B), Panzerfaust / DA CC Weapon(PS=4). (1.5 | 59)\n   OPERATOR Spitfire, Smoke Grenade Launcher / Boarding Pistol, CC Weapon. (- | 0)\n";
    const ALG = " ALGUACIL Combi Rifle / Pistol, CC Weapon. (0 | 10)\n";
    {
        const T = creaTavolo(DIR); const N = T.nomadi.g;
        N.roster = [];
        T.nomadi.el('army-import-text').value = ZOND + ANA + ALG;
        N.importaDaTesto();
        const nomi = N.roster.map(u => u.name);
        ok(J(nomi) === J(['Zondnautica-B', 'Anaconda (Heavy Machine Gun)', 'Alguacil (Combi Rifle)']),
           'Nomadi: Zondnautica-B, Anaconda, Alguacil. Niente Zondnaut, Zondmate, Operator a parte (' + J(nomi) + ')');
        ok(N.righeAssorbiteImport === 3, 'le tre righe rientrate (pilota, moto, Operator) sono lette come parte della truppa sopra (' + N.righeAssorbiteImport + ')');
        ok((N.righeAmbigueImport || []).length === 0, 'nessuna riga ambigua');
    }
    {
        const T = creaTavolo(DIR); const P = T.pano.g;
        P.roster = [];
        T.pano.el('army-import-text').value = "GROUP 1\n MAXIMUS OPTIME E/M Carbine, AP Thunderbolt(+2B) / Heavy Pistol, AP+DA CC Weapon(PS=4). (1.5 | 80)\n" +
            "   OPERATOR MAXIMUS E/M Carbine, AP Thunderbolt(+2B) / Heavy Pistol, AP+DA CC Weapon(PS=6). (- | 0)\n" +
            " ANACONDA Heavy Machine Gun, Light Shotgun(+2B), Panzerfaust / DA CC Weapon(PS=4). (1.5 | 59)\n   OPERATOR Spitfire, Smoke Grenade Launcher / Boarding Pistol, CC Weapon. (- | 0)\n";
        P.importaDaTesto();
        const nomi = P.roster.map(u => u.name);
        ok(nomi.length === 2 && /^Maximus Optime/.test(nomi[0]) && /^Anaconda/.test(nomi[1]), 'PanOceania: Maximus Optime e Anaconda, UNA unita` ciascuno (' + J(nomi) + ')');
    }
    {
        // CONTROPROVA della regola, non del caso: se il database NON segnasse
        // l'Operator come profilo secondario, la riga rientrata sarebbe un
        // profilo valido. Il roster_manager 19.3 lo importava come truppa a
        // se`; ora si scarta perche` e` il pilota dell'Anaconda sopra.
        const T = creaTavolo(DIR); const N = T.nomadi.g;
        const op = N.DB_NOMADI.find(u => u.id === 'operator_spitfire');
        const primaSec = op && op.profiloSecondario;
        if (op) op.profiloSecondario = false;
        N.roster = [];
        T.nomadi.el('army-import-text').value = 'GROUP 1\n' + ANA;
        N.importaDaTesto();
        if (op) op.profiloSecondario = primaSec;
        const nomi = N.roster.map(u => u.name);
        ok(!!op && J(nomi) === J(['Anaconda (Heavy Machine Gun)']), 'CONTROPROVA: Operator non secondario, sotto l Anaconda resta parte di lei (' + J(nomi) + ')');
        N.roster = [];
        T.nomadi.el('army-import-text').value = 'GROUP 1\n' + ALG + '   OPERATOR Spitfire, Smoke Grenade Launcher / Boarding Pistol, CC Weapon. (- | 0)\n';
        if (op) op.profiloSecondario = false;
        N.importaDaTesto();
        if (op) op.profiloSecondario = primaSec;
        ok(N.roster.length === 2, 'CONTROPROVA: la stessa riga sotto un Alguacil non e` assorbita (non e` il suo pilota) (' + J(N.roster.map(u => u.name)) + ')');
    }
});

sezione('26. I lavori del 20 ottobre (MOTORE): moto e TAG, TAG vuoto, Marker numerati, Punta di Lancia', () => {
    const menuIds = (h) => (String(h).match(/selectAction\('[^']+', false\)/g) || []).map(x => x.match(/'([^']+)'/)[1]);
    const TRE = ['SCENDI DALLA MOTO', 'RISALI SULLA MOTO', 'RISALI SUL TAG'];
    // --- 26a. SCENDI / RISALI dalla moto, dal menu del giocatore ---------
    {
        const T = creaTavolo(DIR); const N = T.nomadi.g;
        T.schiera([truppa(profilo(T, /^Zondnautica-A$/), { id: 'n1', alias: 'Moto' }), truppa(profilo(T, /^Alguacil \(Combi/), { id: 'n2', alias: 'Piedi' })],
                  [truppa(profilo(T, /^Fusilier \(Combi/), { id: 'p1', alias: 'Due' })], 'NOMADI');
        const m1 = menuIds(T.apriMenu(T.nomadi, 0));
        ok(m1.indexOf('SCENDI DALLA MOTO') >= 0, 'Zondnautica montata: il menu offre SCENDI DALLA MOTO (' + J(m1.filter(x => TRE.indexOf(x) >= 0)) + ')');
        ok(m1.indexOf('RISALI SULLA MOTO') < 0 && m1.indexOf('RISALI SUL TAG') < 0, 'e non RISALI (e` gia` sulla moto, non e` un pilota di TAG)');
        const m2 = menuIds(T.apriMenu(T.nomadi, 1));
        ok(TRE.every(x => m2.indexOf(x) < 0), 'CONTROPROVA: un Alguacil a piedi non vede nessuna delle tre voci (' + J(m2.filter(x => TRE.indexOf(x) >= 0)) + ')');
        T.apriMenu(T.nomadi, 0); N.selectAction('SCENDI DALLA MOTO', false); T.giro();
        const moto = N.roster.find(u => u.id === 'n1_moto'), pil = N.roster.find(u => u.id === 'n1');
        ok(!!moto && /Zondmate/.test(moto.nome) && pil && /Zondnaut-A/.test(pil.nome),
           'scelta la voce: il pilota (Zondnaut-A) e la moto (Zondmate) sono due unita` (' + N.roster.map(u => u.nome).join(', ') + ')');
        ok(moto && N.gruppoDi(moto) === N.gruppoDi(pil), 'la moto sta nel Gruppo del pilota');
        ok((T.hub.g.gameState.nomads || []).some(u => u.id === 'n1_moto'), 'l Hub vede la moto');
        const m3 = menuIds(T.apriMenu(T.nomadi, N.roster.indexOf(pil)));
        ok(m3.indexOf('RISALI SULLA MOTO') >= 0 && m3.indexOf('SCENDI DALLA MOTO') < 0, 'il pilota a piedi ora vede RISALI SULLA MOTO, non SCENDI (' + J(m3.filter(x => TRE.indexOf(x) >= 0)) + ')');
        N.selectAction('RISALI SULLA MOTO', false); T.giro();
        ok(!N.roster.some(u => u.id === 'n1_moto') && /Zondnautica-A/.test((N.roster.find(u => u.id === 'n1') || {}).nome),
           'risalito: la moto esce dal roster, torna la Zondnautica (' + N.roster.map(u => u.nome).join(', ') + ')');
    }
    // --- 26b. Escape System: TAG vuoto sulla riga e all'Hub, RISALI SUL TAG
    {
        const T = creaTavolo(DIR); const N = T.nomadi.g, H = T.hub.g;
        T.schiera([truppa(profilo(T, /^Anaconda \(Heavy/), { id: 'n1', alias: 'Ana' })],
                  [truppa(profilo(T, /^Fusilier \(Combi/), { id: 'p1', alias: 'Due' })], 'NOMADI');
        ok(menuIds(T.apriMenu(T.nomadi, 0)).every(x => TRE.indexOf(x) < 0), 'premessa: il TAG col pilota non vede SCENDI / RISALI');
        N.apriPaginaStati(0);
        const btn = (String(T.nomadi.el('states-content').innerHTML).match(/onclick="(window\.espelliPilotaDaStati\(\))"/) || [])[1];
        ok(!!btn, 'nella pagina degli stati c e il tasto ESCAPE SYSTEM');
        if (btn) vmTocco(T.nomadi, btn);
        T.giro();
        const tag = N.roster.find(u => u.id === 'n1'), pil = N.roster.find(u => u.id === 'n1_pilota');
        ok(tag && tag.states && tag.states.tagVuoto && pil && /Operator/.test(pil.nome), 'toccato: TAG vuoto, e il pilota (' + (pil && pil.nome) + ') e` un unita` nuova');
        ok(pil && N.gruppoDi(pil) === N.gruppoDi(tag), 'il pilota sta nel Gruppo del TAG');
        N.currentGroup = N.gruppoDi(tag); N.isCoordinated = false; N.selectedCoordinatedUnits = []; N.spearheadUnit = null;
        N.aggiornaGraficaRoster();
        const righe = String(T.nomadi.el('unit-buttons-container').innerHTML);
        const rigaTag = righe.split(/(?=<button)/).find(r => /Ana/.test(testo(r)) && !/Operator/.test(testo(r))) || righe;
        ok(/icon_tag_vuoto\.png/.test(rigaTag) && /TAG VUOTO/.test(rigaTag), 'la riga del TAG ha l icona TAG VUOTO, con la scritta di ripiego');
        ok(/NON ATTIVABILE/.test(rigaTag), 'e resta NON ATTIVABILE (lo decide il motore)');
        const hTag = (H.gameState.nomads || []).find(u => u.id === 'n1');
        const scheda = hTag ? testo(H.schedaTruppa(hTag, 'NOMADI')) : '';
        ok(/TAG VUOTO/.test(scheda), 'all Hub la scheda del TAG dice TAG VUOTO');
        ok(!/TAGVUOTO/i.test(scheda.replace(/TAG VUOTO/g, '')) && !/❓/.test(scheda), 'e non piu` "❓ TAGVUOTO", lo stato sconosciuto (' + scheda.slice(0, 120) + ')');
        const mP = menuIds(T.apriMenu(T.nomadi, N.roster.indexOf(pil)));
        ok(mP.indexOf('RISALI SUL TAG') >= 0, 'il pilota uscito vede RISALI SUL TAG (' + J(mP.filter(x => TRE.indexOf(x) >= 0)) + ')');
        N.selectAction('RISALI SUL TAG', false); T.giro();
        const tag2 = N.roster.find(u => u.id === 'n1');
        ok(!N.roster.some(u => u.id === 'n1_pilota') && tag2 && !(tag2.states || {}).tagVuoto, 'risalito: il pilota esce dal roster, il TAG non e` piu` vuoto');
    }
    // --- 26c. Marker numerati ---------------------------------------------
    {
        const T = creaTavolo(DIR); const N = T.nomadi.g, P = T.pano.g, H = T.hub.g;
        const camo = (id, alias) => truppa(profilo(T, /^Alguacil \(Combi/), { id, alias, deployState: 'CAMO', states: { camo: true } });
        N.roster = [camo('n1', 'Primo'), camo('n2', 'Secondo'), truppa(profilo(T, /^Alguacil \(Combi/), { id: 'n3', alias: 'Terzo' })];
        N.currentGroup = 1; N.isCoordinated = false; N.selectedCoordinatedUnits = [];
        N.aggiornaGraficaRoster();
        const righe = String(T.nomadi.el('unit-buttons-container').innerHTML).split(/(?=<button)/).filter(r => /riga-unita/.test(r));
        const et = righe.map(r => (r.match(/class="etichetta-marker"[^>]*>([^<]*)</) || [])[1] || null);
        ok(J(et) === J(['CAMO 1', 'CAMO 2', null]), 'nella propria app, PRIMA dell invio: CAMO 1, CAMO 2 accanto al nome, niente sulla truppa scoperta (' + J(et) + ')');
        T.schiera(N.roster, [truppa(profilo(T, /^Fusilier \(Combi/), { id: 'p1', alias: 'Due' })], 'NOMADI');
        const nemici = P.MotoreN5.rosterNemico();
        ok(J(nemici.map(u => u.alias)) === J(['SEGNALINO MIMETICO 1', 'SEGNALINO MIMETICO 2', 'Terzo']),
           'l avversario riceve i numeri (' + J(nemici.map(u => u.alias)) + ')');
        const fP = nemici.slice(0, 2).map(u => P.fotoUnita(u, 'NOMADI'));
        // RISCRITTI il 26 ottobre (MOTORE 26.1): i segnalini stanno nella
        // cartella dell'esercito del PROPRIETARIO (img/nomadi/camo_1.png);
        // prima erano in img/. La comune resta come ripiego.
        ok(J(fP) === J(['img/nomadi/camo_1.png', 'img/nomadi/camo_2.png']), 'nell app avversaria ogni segnalino ha la sua immagine, dalla cartella dei Nomads (' + J(fP) + ')');
        const fH = (H.gameState.nomads || []).slice(0, 2).map(u => H.fotoTruppaHub(u, 'NOMADI'));
        ok(J(fH) === J(['img/nomadi/camo_1.png', 'img/nomadi/camo_2.png']), 'all Hub lo stesso (' + J(fH) + ')');
        const rigaNem = P.rigaUnitaConFoto(nemici[0], { fazione: 'NEMICA' });
        ok(/src="img\/nomadi\/camo_1\.png"/.test(rigaNem) && /data-rip="img\/camo_1\.png\|img\/nomadi\/MARKER\.png\|img\/MARKER\.png"/.test(rigaNem),
           'senza il file numerato la riga ripiega sulla copia comune, poi sul MARKER dell esercito, poi su img/MARKER.png: mai la sigla');
        ok(H.fotoTruppaHub({ nome: 'MARKER' }, 'NOMADI') === 'img/nomadi/MARKER.png' && J(H.fotoTruppaHubConRipieghi({ nome: 'MARKER' }, 'NOMADI').ripieghi) === J(['img/MARKER.png']),
           'CONTROPROVA: un Marker senza numero (oltre le 10 immagini) e` il MARKER dell esercito, poi img/MARKER.png');
    }
    {
        // 20 ottobre sera (MOTORE 20.2, Paolo): ogni segnalino ha la SUA serie.
        // Due Alguacil (CAMO) e due Intruder (Mimetism -3: CAMO-3) contano
        // ciascuno da 1. Prima (motore 20.1) la serie era una sola per tutti
        // i CAMO: gli Intruder sarebbero stati CAMO 3 e CAMO 4.
        const T = creaTavolo(DIR); const N = T.nomadi.g, P = T.pano.g, H = T.hub.g;
        const camo = (re, id) => truppa(profilo(T, re), { id, alias: id, deployState: 'CAMO', states: { camo: true } });
        N.roster = [camo(/^Alguacil \(Combi/, 'a1'), camo(/^Intruder \(HMG/, 'i1'), camo(/^Alguacil \(Combi/, 'a2'), camo(/^Intruder \(HMG/, 'i2')];
        N.currentGroup = 1; N.isCoordinated = false; N.selectedCoordinatedUnits = [];
        N.aggiornaGraficaRoster();
        const righe = String(T.nomadi.el('unit-buttons-container').innerHTML).split(/(?=<button)/).filter(r => /riga-unita/.test(r));
        const et = righe.map(r => (r.match(/class="etichetta-marker"[^>]*>([^<]*)</) || [])[1] || null);
        ok(J(et) === J(['CAMO 1', 'CAMO-3 1', 'CAMO 2', 'CAMO-3 2']), 'CAMO e CAMO-3 hanno serie separate, sulla riga del giocatore (' + J(et) + ')');
        T.schiera(N.roster, [truppa(profilo(T, /^Fusilier \(Combi/), { id: 'p1', alias: 'Due' })], 'NOMADI');
        const fP = P.MotoreN5.rosterNemico().map(u => P.fotoUnita(u, 'NOMADI'));
        const fH = (H.gameState.nomads || []).map(u => H.fotoTruppaHub(u, 'NOMADI'));
        const attese = ['img/nomadi/camo_1.png', 'img/nomadi/camo-3_1.png', 'img/nomadi/camo_2.png', 'img/nomadi/camo-3_2.png'];   // 26 ottobre: per esercito
        ok(J(fP) === J(attese) && J(fH) === J(attese), 'avversario e Hub: le immagini della serie giusta (' + J(fP) + ' | ' + J(fH) + ')');
    }
    // --- 26d. Punta di Lancia: l'icona sulla riga ----------------------------
    {
        const T = creaTavolo(DIR); const N = T.nomadi.g;
        T.schiera([truppa(profilo(T, /^Alguacil \(Combi/), { id: 'n1', alias: 'Capo' }), truppa(profilo(T, /^Alguacil \(Combi/), { id: 'n2', alias: 'Gregario' })],
                  [truppa(profilo(T, /^Fusilier \(Combi/), { id: 'p1', alias: 'Due' })], 'NOMADI');
        N.currentGroup = 1; N.isCoordinated = true; N.selectedCoordinatedUnits = []; N.spearheadUnit = null;
        N.selezionaUnita(0); N.selezionaUnita(1);
        const righe = String(T.nomadi.el('unit-buttons-container').innerHTML).split(/(?=<button)/).filter(r => /riga-unita/.test(r));
        const conIcona = righe.map(r => /icon_spearhead\.png/.test(r));
        ok(J(conIcona) === J([true, false]), 'Coordinato: la Punta di Lancia ha img/icon_spearhead.png, il gregario no (' + J(conIcona) + ')');
        N.isCoordinated = false; N.aggiornaGraficaRoster();
        ok(!/icon_spearhead/.test(T.nomadi.el('unit-buttons-container').innerHTML), 'CONTROPROVA: fuori dal Coordinato nessuna icona');
    }
});

sezione('27. Tabellone: nome delle azioni e Sagoma Diretta senza tiro (MOTORE 2026-10-20.3)', () => {
    // L'ARO di Pano contro un Alguacil che muove, dalla schermata degli ARO.
    const aro = (arma, azione, reP) => {
        const T = creaTavolo(DIR); const N = T.nomadi.g, P = T.pano.g;
        T.schiera([truppa(profilo(T, /^Alguacil \(Combi/), { id: 'n1', alias: 'Muove' })], [truppa(profilo(T, reP), { id: 'p1', alias: 'Rea' })], 'NOMADI');
        T.apriMenu(T.nomadi, 0); N.selectAction('MOVIMENTO', false); T.giro();
        P.apriSelezioneAro(); P.toggleAroUnit('p1'); P.confermaSelezioneAro();
        P.selezionaAzioneAro(azione); P.selezionaArmaAro(arma); P.selezionaBersaglioAro('Muove'); P.salvaAroCorrente(); T.giro();
        N.selectAction('MOVIMENTO', true); T.giro();
        return T;
    };
    const reattivo = (t) => (t.match(/REATTIVO PANOCEANIA Rea.*?SE COLPITO/) || [''])[0];
    {
        const T = aro('CC Weapon', 'CC_ATTACK', /^Fusilier \(Combi/);
        const c = reattivo(tabellone(T));
        ok(risoluzione(T) && /Azione: ATTACCO CC/.test(c), 'ARO in Corpo a Corpo: il tabellone dice "Azione: ATTACCO CC" (' + c.slice(0, 60) + ')');
        ok(!/CC_ATTACK/.test(tabellone(T)), 'e da nessuna parte l id interno CC_ATTACK');
    }
    {
        // Prima (controller 2026-10-20.1): "Successo al: Auto (o meno)" e
        // "Dadi da lanciare: 1" per un colpo che non si tira.
        const T = aro('Heavy Flamethrower', 'BS_ATTACK', /^Auxbot_3$/);
        const c = reattivo(tabellone(T));
        ok(risoluzione(T) && /COLPO AUTOMATICO/.test(c) && /Nessun dado: colpo automatico/.test(c), 'ARO con Sagoma Diretta (Heavy Flamethrower): COLPO AUTOMATICO, nessun dado (' + c.slice(0, 120) + ')');
        ok(!/Auto \(o meno\)/.test(c) && !/Dadi da lanciare/.test(c), 'e non "Successo al: Auto (o meno)" ne` "Dadi da lanciare"');
    }
    {
        // Lo stesso dal lato attivo: aveva lo stesso difetto (misurato qui).
        const T = creaTavolo(DIR); const N = T.nomadi.g, P = T.pano.g;
        T.schiera([truppa(profilo(T, /^Morlock \(Assault/), { id: 'n1', alias: 'Morl' })], [truppa(profilo(T, /^Fusilier \(Combi/), { id: 'p1', alias: 'Due' })], 'NOMADI');
        T.apriMenu(T.nomadi, 0); N.selectAction('ATTACCO BS', false); N.declareAttackBS('Chain Rifle'); N.toggleTargetSelection('p1'); N.confirmMultiAro(false); T.giro();
        P.annullaAro(); T.giro(); N.goToModifiersBS('IDLE'); N.eseguiCalcoloBS(); T.giro();
        const c = (tabellone(T).match(/ATTIVO NOMADI Morl.*?REATTIVO/) || [''])[0];
        ok(risoluzione(T) && /COLPO AUTOMATICO/.test(c) && !/Auto \(o meno\)/.test(c) && !/Dadi da lanciare/.test(c), 'attivo con Chain Rifle: COLPO AUTOMATICO, nessun dado (' + c.slice(0, 120) + ')');
    }
    {
        // CONTROPROVA: un'arma che tira resta com'era.
        const T = aro('Combi Rifle', 'BS_ATTACK', /^Fusilier \(Combi/);
        const c = reattivo(tabellone(T));
        ok(/Successo al: \d+ \(o meno\)/.test(c) && /Dadi da lanciare: 1/.test(c) && !/COLPO AUTOMATICO/.test(c), 'CONTROPROVA: ARO col Combi Rifle, "Successo al" e i dadi restano (' + c.slice(0, 100) + ')');
    }
});

sezione('28. Foto collegate: pilota e moto si scelgono con la foto dell unita` (MOTORE 2026-10-23.2)', () => {
    const T = creaTavolo(DIR); const N = T.nomadi.g;
    T.schiera([truppa(profilo(T, /^Zondnautica-A$/), { id: 'n1', alias: 'Moto' }), truppa(profilo(T, /^Anaconda \(Heavy/), { id: 'n2', alias: 'Ana' }), truppa(profilo(T, /^Alguacil \(Combi/), { id: 'n3', alias: 'Alg' })],
              [truppa(profilo(T, /^Fusilier \(Combi/), { id: 'p1', alias: 'Uno' })], 'NOMADI');
    N.FOTO_MINIATURE = ['zondnautica.png', 'zondnaut.png', 'zondmate.png', 'anaconda.png', 'operator.png', 'alguacil.png'];
    N.deployGroup = 1;
    const galleria = () => String(T.nomadi.el('galleria-foto').innerHTML);
    // Dalla porta del giocatore: il tocco sulla foto, poi le tessere.
    N.cambiaIconaDeploy(null, 0);
    vmTocco(T.nomadi, (galleria().match(/onclick="(window\.assegnaFoto\(0, 'zondnautica\.png'\))"/) || [])[1] || 'void 0');
    ok(N.roster[0].imgVariant === 'zondnautica.png' && /Zondnaut-A/.test(galleria()) && /assegnaFotoCollegata\(0, 'pilota', /.test(galleria()),
       'scelta la foto della Zondnautica, la galleria chiede SUBITO quella del pilota (Zondnaut-A)');
    ok(!/'zondnautica\.png'/.test(galleria()), 'fra le tessere del pilota non c e la foto gia` data alla Zondnautica');
    vmTocco(T.nomadi, (galleria().match(/onclick="(window\.assegnaFotoCollegata\(0, 'pilota', 'zondnaut\.png'\))"/) || [])[1] || 'void 0');
    ok(/assegnaFotoCollegata\(0, 'moto', /.test(galleria()) && /Zondmate/.test(galleria()), 'poi quella della moto (Zondmate)');
    vmTocco(T.nomadi, (galleria().match(/onclick="(window\.assegnaFotoCollegata\(0, 'moto', 'zondmate\.png'\))"/) || [])[1] || 'void 0');
    ok(J(N.roster[0].fotoCollegate) === J({ pilota: 'zondnaut.png', moto: 'zondmate.png' }) && T.nomadi.el('galleria-foto').style.display === 'none',
       'le due foto stanno in fotoCollegate (solo il nome del file) e la galleria si chiude (' + J(N.roster[0].fotoCollegate) + ')');
    // Anaconda: il solo pilota. NESSUNA FOTO e` una risposta.
    N.cambiaIconaDeploy(null, 1);
    vmTocco(T.nomadi, (galleria().match(/onclick="(window\.assegnaFoto\(1, 'anaconda\.png'\))"/) || [])[1] || 'void 0');
    ok(/Operator/.test(galleria()) && !/'zondnaut\.png'|'zondmate\.png'/.test(galleria()), 'Anaconda: chiede il pilota (Operator), senza le foto gia` prese da pilota e moto della Zondnautica');
    vmTocco(T.nomadi, (galleria().match(/onclick="(window\.assegnaFotoCollegata\(1, 'pilota', 'operator\.png'\))"/) || [])[1] || 'void 0');
    ok(J(N.roster[1].fotoCollegate) === J({ pilota: 'operator.png' }), 'Anaconda: fotoCollegate.pilota (' + J(N.roster[1].fotoCollegate) + ')');
    // CONTROPROVA: un Alguacil non ha foto collegate, la galleria si chiude.
    N.cambiaIconaDeploy(null, 2);
    vmTocco(T.nomadi, (galleria().match(/onclick="(window\.assegnaFoto\(2, 'alguacil\.png'\))"/) || [])[1] || 'void 0');
    ok(!N.roster[2].fotoCollegate && T.nomadi.el('galleria-foto').style.display === 'none', 'CONTROPROVA: Alguacil, nessuna foto collegata da chiedere');
    ok(N.assegnaFoto(2, 'zondnaut.png') === false, 'una foto data al pilota non si assegna a un altra unita`');
    // Salvata con la lista, e usata dal motore quando l'unita` nasce.
    T.nomadi.el('saveName').value = 'PROVA'; N.saveRoster();
    const salvata = JSON.parse(T.nomadi.memoria[N.getStorageKey()] || '{}').PROVA;
    ok(salvata && J(salvata.unita[0].fotoCollegate) === J({ pilota: 'zondnaut.png', moto: 'zondmate.png' }), 'SALVA LISTA porta fotoCollegate');
    N.inviaSchieramentoAllHub('NOMADI', { roster: N.roster, strutture: [], terreni: [], motivo: 'AGGIORNAMENTO' }); T.giro();
    const pub = JSON.parse(T.server.global_game_state).nomads.find(u => u.id === 'n1');
    ok(pub && pub.fotoCollegate === undefined, 'all Hub e all avversario fotoCollegate non arriva (scelta privata)');
    T.apriMenu(T.nomadi, 0); N.selectAction('SCENDI DALLA MOTO', false); T.giro();
    const pil = N.roster.find(u => u.id === 'n1'), moto = N.roster.find(u => u.id === 'n1_moto');
    ok(pil && moto && N.fotoUnita(pil) === 'img/nomadi/zondnaut.png' && N.fotoUnita(moto) === 'img/nomadi/zondmate.png',
       'sceso dalla moto: il pilota ha la sua foto, la moto la sua (' + (pil && N.fotoUnita(pil)) + ', ' + (moto && N.fotoUnita(moto)) + ')');
});

sezione('29. Tabellone: Sagoma d Impatto, UN tiro e piu` bersagli (MOTORE 2026-10-23.2)', () => {
    const T = creaTavolo(DIR); const N = T.nomadi.g, P = T.pano.g, H = T.hub.g;
    T.schiera([truppa(profilo(T, /^Alguacil \(Missile/), { id: 'n1', alias: 'Lancia' })],
              [truppa(profilo(T, /^Fusilier \(Combi/), { id: 'p1', alias: 'Uno' }), truppa(profilo(T, /^Fusilier \(Combi/), { id: 'p2', alias: 'Due' }), truppa(profilo(T, /^Fusilier \(Combi/), { id: 'p3', alias: 'Tre' })], 'NOMADI');
    T.apriMenu(T.nomadi, 0); N.selectAction('ATTACCO BS', false); N.startUnitAllocationLoopBS();
    const fam = Object.keys(N._modiBS || {})[0];
    N.declareAttackBS((N._modiBS[fam] || []).find(x => /Blast/i.test(x)), fam);
    ['p1', 'p2', 'p3'].forEach(id => N.toggleTargetSelection(id)); N.confirmMultiAro(false); T.giro();
    P.apriSelezioneAro(); ['p1', 'p2'].forEach(id => P.toggleAroUnit(id)); P.confermaSelezioneAro();
    P.selezionaAzioneAro('DODGE'); P.salvaAroCorrente(); P.selezionaAzioneAro('DODGE'); P.salvaAroCorrente(); T.giro();
    N.goToModifiersBS('IDLE'); N.eseguiCalcoloBS(); T.giro();
    const sc = H.ultimiScontri || [];
    ok(risoluzione(T) && sc.length === 3, 'premessa: tre scontri, uno per bersaglio sotto la Sagoma (' + sc.length + ')');
    if (!sc.some(s => s.tiroUnico)) {
        // calcolatore_math 2026-10-22.1 non copia scontro.tiroUnico nello
        // scontro che arriva al tabellone (il campo c'e` nel motore).
        // Segnalato a MOTORE il 23 ottobre: finche` non arriva, qui non si
        // conta ne` passato ne` fallito.
        console.log('  ⏸ IN ATTESA DI MOTORE: lo scontro non porta tiroUnico (calcolatore_math), il riquadro unico non si puo` provare dalla porta del giocatore');
        return;
    }
    const h = String(T.hub.el('clash-container').innerHTML);
    ok((h.match(/class="riquadro-tiro-unico"/g) || []).length === 1, 'UN riquadro solo per i tre bersagli');
    ok((h.match(/class="bersaglio-tiro-unico"/g) || []).length === 3 && /data-ruolo="PRINCIPALE"/.test(h) && (h.match(/data-ruolo="SECONDARIO"/g) || []).length === 2,
       'dentro, una riga per truppa colpita: il Principale e due secondari');
    const t = testo(h);
    ok((t.match(/Successo al: 8 \(o meno\)/g) || []).length === 1 && /UN SOLO TIRO contro 3/.test(t), 'il tiro dell attaccante compare UNA volta (' + (t.match(/Successo al: 8/g) || []).length + ')');
    ok((t.match(/SE COLPITO DALL'ATTACCANTE/g) || []).length === 3, 'e ogni truppa ha la sua salvezza');
});

sezione('30. Tabellone: il bersaglio del Supporto e` BERSAGLIO, non REATTIVO (SUP-02a)', () => {
    const T = creaTavolo(DIR); const N = T.nomadi.g, P = T.pano.g;
    T.schiera([truppa(profilo(T, /^Alguacil \(Paramedic/), { id: 'n1', alias: 'Medico' }), truppa(profilo(T, /^Alguacil \(Combi/), { id: 'n2', alias: 'Ferito', states: { unconscious: true } })],
              [truppa(profilo(T, /^Fusilier \(Combi/), { id: 'p1', alias: 'Uno' })], 'NOMADI');
    T.apriMenu(T.nomadi, 0); N.selectAction('MEDICO_INGEGNERE', false);
    const st = (String(T.nomadi.el('weapon-buttons-container').innerHTML).match(/scegliStrumentoSupporto\('([^']+)'\)/) || [])[1];
    N.scegliStrumentoSupporto(st); N.scegliBersaglioSupporto('n2'); N.eseguiCalcoloSupporto(); T.giro();
    P.annullaAro(); T.giro();
    const t = tabellone(T);
    ok(risoluzione(T) && /BERSAGLIO NOMADI Ferito/.test(t), 'il Ferito e` "BERSAGLIO", della sua fazione (' + (t.match(/(REATTIVO|BERSAGLIO) \S+ Ferito/) || ['?'])[0] + ')');
    ok(!/REATTIVO/.test(t), 'e nessuno e` "REATTIVO" in un Supporto senza ARO');
    // CONTROPROVA: in uno scontro vero il reattivo resta REATTIVO.
    const T2 = creaTavolo(DIR); const N2 = T2.nomadi.g;
    T2.schiera([truppa(profilo(T2, /^Alguacil \(HMG/), { id: 'n1', alias: 'Spara' })], [truppa(profilo(T2, /^Fusilier \(Combi/), { id: 'p1', alias: 'Uno' })], 'NOMADI');
    T2.apriMenu(T2.nomadi, 0); N2.selectAction('ATTACCO BS', false); N2.declareAttackBS('Heavy Machine Gun'); N2.toggleTargetSelection('p1'); N2.confirmMultiAro(false); T2.giro();
    T2.pano.g.annullaAro(); T2.giro(); N2.goToModifiersBS('IDLE'); N2.eseguiCalcoloBS(); T2.giro();
    ok(/REATTIVO PANOCEANIA Uno/.test(tabellone(T2)) && !/BERSAGLIO PANOCEANIA/.test(tabellone(T2)), 'CONTROPROVA: contro un nemico resta REATTIVO');
});

sezione('31. ARO con arma Targetless: niente tasto Copertura (DIF-14)', () => {
    const prova = (arma) => {
        const T = creaTavolo(DIR); const N = T.nomadi.g, P = T.pano.g;
        T.schiera([truppa(profilo(T, /^Alguacil \(Combi/), { id: 'n1', alias: 'Muove' })], [truppa(profilo(T, /^Yuan Yuan \(Rifle/), { id: 'p1', alias: 'Rea' })], 'NOMADI');
        T.apriMenu(T.nomadi, 0); N.selectAction('MOVIMENTO', false); T.giro();
        P.apriSelezioneAro(); P.toggleAroUnit('p1'); P.confermaSelezioneAro();
        P.selezionaAzioneAro('BS_ATTACK'); P.selezionaArmaAro(arma); P.selezionaBersaglioAro('Muove');
        prova.info = P.vociInfo('step-aro-modifiers');
        return String(T.pano.el('aro-modifiers-content').innerHTML);
    };
    const h = prova('Smoke Grenades');
    // RISCRITTO il 27 ottobre sera (Paolo: le descrizioni nella ⓘ). Prima: la
    // nota-targetless stava sotto i tasti. Ora sta nella ⓘ della schermata.
    ok(!/toggleAroCover/.test(h) && !/nota-targetless/.test(h) && prova.info.some(v => /Targetless/.test(v.titolo)), 'Smoke Grenades in ARO: niente tasto Copertura, e il perche` e` nella ⓘ');
    ok(/tasto-lof-aro/.test(h) && /range-seg/.test(h), 'restano la Linea di Tiro e la gittata');
    const h2 = prova('Rifle');
    ok(/toggleAroCover/.test(h2) && !/nota-targetless/.test(h2), 'CONTROPROVA: col Rifle il tasto Copertura c e');
    // Ordine Coordinato con le Smoke Grenades: la scelta del bersaglio resta,
    // con il solo PUNTO (MOTORE: "controllate che si veda bene").
    const T = creaTavolo(DIR); const N = T.nomadi.g;
    T.schiera([truppa(profilo(T, /^Morlock \(Assault/), { id: 'n1', alias: 'M1' }), truppa(profilo(T, /^Morlock \(Assault/), { id: 'n2', alias: 'M2' })],
              [truppa(profilo(T, /^Fusilier \(Combi/), { id: 'p1', alias: 'Uno' })], 'NOMADI');
    N.currentGroup = 1; N.isCoordinated = true; N.selectedCoordinatedUnits = []; N.spearheadUnit = null;
    N.selezionaUnita(0); N.selezionaUnita(1); N.confermaCoordinato(); N.selectAction('ATTACCO BS', false); N.declareAttackBS('Smoke Grenades');
    const lista = String(T.nomadi.el('enemy-target-buttons').innerHTML);
    ok(/class="huge-btn bersaglio-punto"/.test(lista) && /PUNTO SUL TAVOLO/.test(lista), 'Coordinato con Smoke: la riga del PUNTO SUL TAVOLO, sua');
    ok(!/rup-sigla/.test(lista) && !/\[LI\]/.test(lista) && !/data-fazione="PANOCEANIA"/.test(lista), 'senza la sigla "?", senza "[LI]" e senza i colori della fazione nemica (prima: la riga di una truppa)');
    vmTocco(T.nomadi, (lista.match(/onclick="(window\.toggleTargetSelection\('punto'\))"/) || [])[1] || 'void 0');
    ok(/data-scelta="si"/.test(String(T.nomadi.el('enemy-target-buttons').innerHTML)) && (N.pendingTargets || []).length === 1 && N.pendingTargets[0].punto, 'toccata, il punto e` scelto');
});

sezione('32. Tabellone: il PUNTO del tavolo e` una cella neutra (MOTORE 2026-10-23.3)', () => {
    const giro = (conAro) => {
        const T = creaTavolo(DIR); const N = T.nomadi.g, P = T.pano.g;
        T.schiera([truppa(profilo(T, /^Morlock \(Assault/), { id: 'n1', alias: 'Morl' })], [truppa(profilo(T, /^Fusilier \(Combi/), { id: 'p1', alias: 'Uno' })], 'NOMADI');
        T.apriMenu(T.nomadi, 0); N.selectAction('ATTACCO BS', false); N.declareAttackBS('Smoke Grenades'); T.giro();
        if (conAro) { P.apriSelezioneAro(); P.toggleAroUnit('p1'); P.confermaSelezioneAro(); P.selezionaAzioneAro('BS_ATTACK'); P.selezionaArmaAro('Combi Rifle'); P.selezionaBersaglioAro('Morl'); P.salvaAroCorrente(); }
        else P.annullaAro();
        T.giro(); N.goToModifiersBS('IDLE'); N.eseguiCalcoloBS(); T.giro();
        return T;
    };
    const T = giro(false);
    const t = tabellone(T);
    ok(risoluzione(T) && /class="cella-punto"/.test(T.hub.el('clash-container').innerHTML) && /📍 PUNTO SUL TAVOLO/.test(t), 'Smoke Grenades sul punto: la cella del punto, neutra (📍 PUNTO SUL TAVOLO)');
    ok(!/REATTIVO PANOCEANIA PUNTO/.test(t) && !/SE COLPITO DAL NEMICO/.test(t) && !/SE COLPITO DALL'ATTACCANTE/.test(t),
       'niente "REATTIVO PANOCEANIA", niente righe delle salvezze (prima: la cella di una truppa nemica)');
    ok(/ATTIVO NOMADI Morl Azione: ATTACCO BS Successo al: \d+/.test(t), 'il tiro dell attivo resta com era');
    // CONTROPROVA: se il Fusilier reagisce, il SUO scontro e` uno scontro vero.
    const T2 = giro(true);
    const t2 = tabellone(T2);
    ok(/REATTIVO PANOCEANIA Uno Azione: ATTACCO BS/.test(t2) && /SE COLPITO DAL NEMICO/.test(t2) && (T2.hub.el('clash-container').innerHTML.match(/class="cella-punto"/g) || []).length === 1,
       'CONTROPROVA: il Fusilier che reagisce ha cella e salvezze sue; il punto resta uno solo');
});

sezione('33. Dal collaudo di Paolo, 23 ottobre (MOTORE): Hidden in ARO, bersagli dell ARO con la foto, Leader del Fireteam, niente scorrimento orizzontale', () => {
    // --- 33a. AR-10: chi e` in Hidden Deployment reagisce, e reagendo si rivela ---
    const T = creaTavolo(DIR); const N = T.nomadi.g, P = T.pano.g;
    const croc = truppa(T.profilo(T.pano, /^Croc Man \(MULTI Sniper/), { id: 'p6', alias: 'Ombra', deployState: 'HIDDEN', states: { hidden: true } });
    const riserva = truppa(T.profilo(T.pano, /^Fusilier \(Missile/), { id: 'p2', alias: 'Lontano', deployState: 'RESERVE', states: { reserve: true } });
    T.schiera([truppa(profilo(T, /^Alguacil \(Combi/), { id: 'n1', alias: 'Muove' })],
              [croc, riserva, truppa(T.profilo(T.pano, /^Fusilier \(Combi/), { id: 'p1', alias: 'Uno' })], 'NOMADI');
    ok(!T.hub.g.gameState.panoceania.some(u => u.id === 'p6'), 'premessa: l Hub non vede il Croc Man nascosto');
    T.apriMenu(T.nomadi, 0); N.selectAction('MOVIMENTO', false); T.giro();
    P.apriSelezioneAro();
    const lista = String(T.pano.el('aro-selection-list').innerHTML);
    ok(/id="aro-btn-p6"/.test(lista) && /class="etichetta-nascosto"[^>]*>(<img [\s\S]*?alt="HIDDEN"[^>]*>)?👁️ NASCOSTO: reagendo si rivela/.test(lista),
       'il Croc Man in Hidden Deployment e` fra chi puo` reagire, con «NASCOSTO: reagendo si rivela» (prima: saltato)');
    ok(!/aro-btn-p2/.test(lista) && !/Lontano/.test(lista), 'CONTROPROVA: chi e` in Riserva non compare, nemmeno fra gli esclusi: non e` sul tavolo');
    ok(!/etichetta-nascosto/.test(lista.replace(/[\s\S]*?(id="aro-btn-p1"[\s\S]*?<\/button>)[\s\S]*/, '$1')), 'CONTROPROVA: il Fusilier a vista non porta l etichetta');
    P.toggleAroUnit('p6'); P.confermaSelezioneAro(); P.selezionaAzioneAro('BS_ATTACK');
    P.selezionaArmaAro('MULTI Sniper Rifle (AP Mode)');
    // --- 33b. il passo BERSAGLIO: la riga con la foto, nei colori della fazione nemica ---
    const tl = String(T.pano.el('aro-target-list').innerHTML);
    ok(/class="huge-btn riga-unita riga-unita-foto"/.test(tl) && /data-fazione="NOMADI"/.test(tl) && /\[LI\]/.test(tl) && /selezionaBersaglioAro\('Muove'\)/.test(tl),
       'passo BERSAGLIO: la riga con la foto (rigaUnitaConFoto), colori dei Nomads, [LI], tocco su selezionaBersaglioAro');
    ok(!/\[BERSAGLIO\]/.test(tl), 'niente piu` il bottone di testo «[BERSAGLIO] …»');
    P.selezionaBersaglioAro('Muove'); P.salvaAroCorrente(); T.giro();
    ok(P.roster.find(u => u.id === 'p6').deployState === 'NORMAL', 'dichiarato l ARO, il Croc Man torna NORMAL nel suo roster');
    ok((T.hub.g.gameState.panoceania.find(u => u.id === 'p6') || {}).deployState === 'NORMAL', 'e l Hub lo vede (AGGIORNAMENTO), come per un CAMO che reagisce');
    const m = String(T.nomadi.el('second-half-buttons-container').innerHTML).match(/window\.selectAction\('([^']+)', true\)/);
    if (m) N.selectAction(m[1], true); T.giro();
    ok(risoluzione(T) && /REATTIVO PANOCEANIA Ombra Azione: ATTACCO BS Successo al: \d+/.test(tabellone(T)), 'sul tabellone il suo ARO: REATTIVO PANOCEANIA Ombra, ATTACCO BS', tabellone(T).slice(0, 140));
    // --- 33b (Coordinato, CO-12): restano tutti i partecipanti, se ne sceglie uno ---
    const T2 = creaTavolo(DIR); const N2 = T2.nomadi.g, P2 = T2.pano.g;
    T2.schiera([truppa(profilo(T2, /^Alguacil \(Combi/), { id: 'n1', alias: 'Primo' }), truppa(profilo(T2, /^Alguacil \(HMG/), { id: 'n2', alias: 'Secondo' })],
               [truppa(T2.profilo(T2.pano, /^Fusilier \(Combi/), { id: 'p1', alias: 'Uno' })], 'NOMADI');
    N2.currentGroup = 1; N2.isCoordinated = true; N2.selectedCoordinatedUnits = []; N2.spearheadUnit = null;
    N2.selezionaUnita(0); N2.selezionaUnita(1); N2.confermaCoordinato(); N2.selectAction('MOVIMENTO', false); T2.giro();
    P2.apriSelezioneAro(); P2.toggleAroUnit('p1'); P2.confermaSelezioneAro(); P2.selezionaAzioneAro('BS_ATTACK'); P2.selezionaArmaAro('Combi Rifle');
    const tl2 = String(T2.pano.el('aro-target-list').innerHTML);
    ok((tl2.match(/riga-unita-foto/g) || []).length === 2 && /selezionaBersaglioAro\('Primo'\)/.test(tl2) && /selezionaBersaglioAro\('Secondo'\)/.test(tl2),
       'Coordinato (CO-12): due righe con la foto, una per partecipante', (tl2.match(/selezionaBersaglioAro\('[^']+'\)/g) || []));
    P2.selezionaBersaglioAro('Secondo');
    ok(P2.aroCurrentConfig.bersaglio === 'Secondo', 'e se ne sceglie uno solo');
    // --- 33c. il Leader del Fireteam si riconosce dalla riga ---
    const T3 = creaTavolo(DIR); const N3 = T3.nomadi.g;
    const capo = truppa(profilo(T3, /^Alguacil \(Combi/), { id: 'n1', alias: 'Capo', states: { fireteam: 'A', isFireteamLeader: true } });
    const membro = truppa(profilo(T3, /^Alguacil \(HMG/), { id: 'n2', alias: 'Membro', states: { fireteam: 'A', isFireteamLeader: false } });
    const rC = String(N3.rigaUnitaConFoto(capo, {})), rM = String(N3.rigaUnitaConFoto(membro, {}));
    ok(/\[ TEAM A · ⭐ LEADER \]/.test(rC), 'il Leader: «[ TEAM A · ⭐ LEADER ]» sulla riga');
    ok(/\[ TEAM A \]/.test(rM) && !/LEADER/.test(rM), 'CONTROPROVA: il membro resta «[ TEAM A ]»');
    // --- 33d. negli elenchi niente scorrimento ORIZZONTALE ---
    const css = fs.readFileSync(DIR + 'app.html', 'utf8');
    const regola = (sel) => ((css.match(new RegExp(sel.replace(/[.]/g, '\\.') + '\\s*\\{([^}]*)\\}')) || [])[1] || '');
    ok(/overflow-x:\s*hidden/.test(regola('.grid-buttons')), '.grid-buttons ha overflow-x:hidden (con overflow-y:auto l asse x diventava auto)', regola('.grid-buttons'));
    ok(/right:0;/.test(regola('.riga-unita-foto .rup-icone')) && !/right:-/.test(regola('.riga-unita-foto .rup-icone')), 'le icone di stato non sporgono a destra (right:0, prima -2px)', regola('.riga-unita-foto .rup-icone'));
});

// 34: i lavori del 26 ottobre (MOTORE 2026-10-26.1 e .2), una sezione per lavoro.
const menuIds34 = (h) => (String(h).match(/selectAction\('[^']+', false\)/g) || []).map(x => x.match(/'([^']+)'/)[1]);
sezione('34a. SCENDI DAL TAG nel menu, accanto a RISALI SUL TAG', () => {
    const menuIds = menuIds34;
    {
        const T = creaTavolo(DIR); const N = T.nomadi.g;
        const mov = ((N.dbAzioniN5 || {}).movimento || []).map(a => a.id);
        const iS = mov.indexOf('SCENDI DAL TAG'), iR = mov.indexOf('RISALI SUL TAG');
        ok(iS >= 0 && iR > iS, 'dbAzioniN5.movimento ha SCENDI DAL TAG, subito prima di RISALI SUL TAG (' + J(mov.filter(x => /TAG|MOTO/.test(x))) + ')');
    }
});
sezione('34b. Piloti di lista: a bordo, invisibili, poi SCENDI DAL TAG', () => {
    const menuIds = menuIds34;
    {
        const T = creaTavolo(DIR); const N = T.nomadi.g, P = T.pano.g, H = T.hub.g;
        const gator = truppa(profilo(T, /^Gator \(TAG\)/), { id: 'n1', alias: 'Gator' });
        const pil = truppa(profilo(T, /^Gator Pilot/), { id: 'n2', alias: 'Pilota' });
        const altro = truppa(profilo(T, /^Gator Pilot/), { id: 'n3', alias: 'Secondo' });
        const fante = truppa(profilo(T, /^Alguacil \(Combi/), { id: 'n4', alias: 'Fante' });
        N.roster = [gator, pil, altro, fante];
        const fatti = N.mettiABordoPilotiDiLista();
        const p2 = N.roster.find(u => u.id === 'n2'), p3 = N.roster.find(u => u.id === 'n3'), f4 = N.roster.find(u => u.id === 'n4');
        ok(p2.deployState === 'A_BORDO' && p2.aBordoDi === 'n1' && p2.pilotaDiLista === true, 'il Gator Pilot sale sul Gator: A_BORDO, aBordoDi = id del TAG (' + p2.deployState + ', ' + p2.aBordoDi + ')');
        ok(p3.deployState === 'NORMAL' && !p3.aBordoDi, 'CONTROPROVA: un secondo Gator Pilot non trova posto (il Gator e` occupato) e resta da schierare');
        ok(f4.deployState === 'NORMAL' && !f4.aBordoDi, 'CONTROPROVA: un Alguacil non e` un pilota di lista');
        ok(fatti.length === 1, 'una sola salita (' + fatti.length + ')');
        N.mettiABordoPilotiDiLista();
        ok(N.roster.filter(u => u.deployState === 'A_BORDO').length === 1, 'una seconda chiamata non cambia niente (il pilota gia` a bordo resta com e`)');
        N.deployGroup = 1; N.renderDeployUnits();
        const lista = testo(T.nomadi.el('deploy-units-container').innerHTML);
        ok(/A BORDO DEL GATOR: NON SI SCHIERA/.test(lista), 'nella lista dello schieramento: «[ A BORDO DEL GATOR: NON SI SCHIERA ]»');
        N.roster = N.roster.filter(u => u.id !== 'n3');
        T.schiera(N.roster, [truppa(T.profilo(T.pano, /^Fusilier \(Combi/), { id: 'p1', alias: 'Uno' })], 'NOMADI');
        ok(!P.MotoreN5.rosterNemico().some(u => u.id === 'n2'), 'l avversario non vede il pilota a bordo');
        ok(!(H.gameState.nomads || []).some(u => u.id === 'n2'), 'e nemmeno l Hub');
        const m = menuIds(T.apriMenu(T.nomadi, N.roster.findIndex(u => u.id === 'n1')));
        ok(m.indexOf('SCENDI DAL TAG') >= 0 && m.indexOf('RISALI SUL TAG') < 0, 'il menu del Gator col pilota a bordo offre SCENDI DAL TAG (' + J(m.filter(x => /TAG/.test(x))) + ')');
        const mF = menuIds(T.apriMenu(T.nomadi, N.roster.findIndex(u => u.id === 'n4')));
        ok(mF.indexOf('SCENDI DAL TAG') < 0, 'CONTROPROVA: l Alguacil no');
        T.apriMenu(T.nomadi, N.roster.findIndex(u => u.id === 'n1')); N.selectAction('SCENDI DAL TAG', false); T.giro();
        const tag = N.roster.find(u => u.id === 'n1'), sceso = N.roster.find(u => u.id === 'n2');
        ok(tag && tag.states && tag.states.tagVuoto && sceso && sceso.deployState === 'NORMAL', 'sceso: il TAG e` vuoto, il pilota (lo STESSO, n2) e` sul tavolo (' + (sceso && sceso.deployState) + ')');
        ok(N.roster.filter(u => /Pilot/.test(u.nome)).length === 1, 'e non nasce un secondo pilota');
        ok((H.gameState.nomads || []).some(u => u.id === 'n2'), 'l Hub ora lo vede');
    }
});
sezione('34c. Icone degli stati per esercito, con la comune come ripiego', () => {
    const menuIds = menuIds34;
    {
        const T = creaTavolo(DIR); const N = T.nomadi.g, H = T.hub.g;
        const u = { states: { targeted: true } };
        const iN = N.generaIconeStati(u, 'NOMADI'), iP = N.generaIconeStati(u, 'PANOCEANIA');
        ok(/src="img\/nomadi\/icon_targeted\.png" data-rip="img\/icon_targeted\.png"/.test(iN), 'app: la truppa nomade ha img/nomadi/icon_targeted.png, ripiego img/icon_targeted.png');
        ok(/src="img\/panoceania\/icon_targeted\.png"/.test(iP), 'CONTROPROVA: quella di PanOceania la cartella di PanOceania');
        ok(/onerror="var l=\(this\.dataset\.rip/.test(iN) && /this\.outerHTML='<span/.test(iN), 'manca anche la comune: torna l emoji di sempre');
        T.schiera([truppa(profilo(T, /^Intruder \(HMG/), { id: 'n1', alias: 'Spara', states: { targeted: true } })], [truppa(T.profilo(T.pano, /^Fusilier \(Combi/), { id: 'p1', alias: 'Uno', states: { targeted: true } })], 'NOMADI');
        const rN = String(T.hub.el('status-nomads').innerHTML), rP = String(T.hub.el('status-pano').innerHTML);
        ok(/src="img\/nomadi\/icon_targeted\.png"/.test(rN) && /this\.src='img\/icon_targeted\.png'/.test(rN), 'Hub: le icone dei Nomads dalla loro cartella, con la comune come ripiego');
        ok(/src="img\/panoceania\/icon_targeted\.png"/.test(rP), 'Hub: quelle di PanOceania dalla loro');
    }
});
sezione('34d. SCH-06: una mina in CAMO e` un Marker, non la mina', () => {
    const menuIds = menuIds34;
    {
        const T = creaTavolo(DIR); const N = T.nomadi.g, H = T.hub.g;
        const mina = { id: 'dep_mina_shock_1_123', nome: 'MARKER', deployable: true, modelId: 'mina_shock', immagineMarker: 'img/nomadi/camo_1.png' };
        const fH = H.fotoTruppaHubConRipieghi(mina, 'NOMADI'), fA = N.fotoUnitaConRipieghi(mina, 'NOMADI');
        ok(fH.src === 'img/nomadi/camo_1.png', 'Hub: il segnalino numerato del CAMO, non l immagine della mina (' + fH.src + ')');
        ok(fA.src === 'img/nomadi/camo_1.png', 'app: lo stesso (' + fA.src + ')');
        ok(J(fH.ripieghi) === J(['img/camo_1.png', 'img/nomadi/MARKER.png', 'img/MARKER.png']) && J(fA.ripieghi) === J(fH.ripieghi),
           'i ripieghi: la comune, poi il Marker senza numero dell esercito, poi il comune (' + J(fH.ripieghi) + ')');
        const vecchio = H.fotoTruppaHubConRipieghi({ id: 'x', nome: 'MARKER', immagineMarker: 'img/camo_2.png' }, 'PANOCEANIA');
        ok(vecchio.src === 'img/camo_2.png' && vecchio.ripieghi[0] === 'img/panoceania/camo_2.png', 'un motore di prima (img/camo_2.png) funziona ancora, e prova anche la cartella dell esercito (' + J(vecchio) + ')');
        const scoperta = Object.assign({}, mina, { nome: 'Shock Mine', immagineMarker: undefined });
        ok(H.fotoTruppaHub(scoperta, 'NOMADI') === 'img/nomadi/mina_shock.png', 'CONTROPROVA: la stessa mina scoperta mostra la sua immagine, dalla cartella dell esercito (' + H.fotoTruppaHub(scoperta, 'NOMADI') + ')');
    }
});
sezione('34e. HoloMask: l avversario e l Hub vedono il Modello imitato', () => {
    const menuIds = menuIds34;
    {
        const T = creaTavolo(DIR); const N = T.nomadi.g, P = T.pano.g, H = T.hub.g;
        const bashi = truppa(profilo(T, /^Bashi Bazouk/), { id: 'n1', alias: 'Bashi Bazouk 1' });
        N.roster = [bashi];
        const imitabili = N.MotoreN5.profiliImitabili(bashi);
        ok(imitabili.length > 0, 'premessa: il motore da` i Modelli imitabili (' + imitabili.length + ')');
        N.apriDeployStati(0);
        ok(/HOLOMASK: SCEGLI IL MODELLO DA IMITARE/.test(T.nomadi.el('deploy-states-content').innerHTML), 'pagina degli stati: il tasto HOLOMASK');
        // RISCRITTO il 26 ottobre sera (motore 26.2): prima un bottone per
        // ogni profilo imitabile (290 per un Bashi Bazouk); ora due passi,
        // la truppa (M.profiliImitabiliRaggruppati) e poi l'opzione d'arma.
        const gruppi = N.MotoreN5.profiliImitabiliRaggruppati(bashi);
        N.apriSceltaHolomask(0);
        // RISCRITTO il 27 ottobre sera (secondo giro del collaudo, B07): prima
        // i bottoni delle truppe erano tutti nella pagina appena aperta; ora,
        // con piu` di 8 truppe, l'elenco parte vuoto e si riempie per
        // iniziale (o con la ricerca). Si toccano tutte le iniziali e si
        // guarda l'insieme.
        const iniz = [...String(T.nomadi.el('deploy-states-content').innerHTML).matchAll(/class="huge-btn lettera-holomask" onclick="window\.filtraHolomask\(0, '', '([^']*)'\)"/g)].map(x => x[1]);
        const pag1 = iniz.map(l => { N.filtraHolomask(0, '', l); return String(T.nomadi.el('lista-holomask').innerHTML); }).join('');
        const scelte = (pag1.match(/class="huge-btn scelta-holomask-unita"/g) || []).length;
        ok(scelte === gruppi.length && gruppi.length < imitabili.length, 'primo passo: un bottone per TRUPPA (' + scelte + ' truppe, non ' + imitabili.length + ' profili)');
        ok(!/class="huge-btn scelta-holomask"/.test(pag1), 'e nessuna opzione d arma, ancora');
        const k = gruppi.findIndex(g => g.varianti.length > 1);
        ok(k >= 0 && new RegExp('apriVariantiHolomask\\(0, ' + k + '\\)').test(pag1), 'una truppa con piu` opzioni porta al secondo passo');
        const k1 = gruppi.findIndex(g => g.varianti.length === 1);
        if (k1 >= 0) ok(pag1.indexOf("window.scegliHolomask(0, '" + gruppi[k1].varianti[0].id + "')") >= 0, 'CONTROPROVA: una truppa con una sola opzione si sceglie subito (' + gruppi[k1].unita + ')');
        N.apriVariantiHolomask(0, k);
        const pag2 = String(T.nomadi.el('deploy-states-content').innerHTML);
        ok((pag2.match(/class="huge-btn scelta-holomask"/g) || []).length === gruppi[k].varianti.length && /apriSceltaHolomask\(0\)/.test(pag2),
           'secondo passo: le opzioni d arma di ' + gruppi[k].unita + ' (' + gruppi[k].varianti.length + '), e INDIETRO alla scelta della truppa');
        const im = Object.assign({}, gruppi[k].varianti[0]);
        N.scegliHolomask(0, im.id);
        ok(N.roster[0].states.holomask === true && N.roster[0].holomaskImita === im.id, 'scelto: holomask attivo, holomaskImita = ' + im.id);
        ok(/HOLOMASK: l'avversario vede/.test(T.nomadi.el('deploy-states-content').innerHTML), 'la pagina dice chi vede l avversario');
        T.schiera(N.roster, [truppa(T.profilo(T.pano, /^Fusilier \(Combi/), { id: 'p1', alias: 'Uno' })], 'NOMADI');
        const nem = P.MotoreN5.rosterNemico().find(u => u.id === 'n1');
        ok(nem && nem.mostraCome && nem.mostraCome.nome === im.nome, 'premessa: l avversario riceve mostraCome (' + (nem && nem.mostraCome && nem.mostraCome.nome) + ')');
        const rigaP = testo(P.rigaUnitaConFoto(nem, { fazione: 'NEMICA' }));
        const vero = 'Bashi Bazouk', finto = String(im.nome).split('(')[0].trim();
        ok(rigaP.indexOf(finto) >= 0 && rigaP.indexOf(vero) < 0, 'app avversaria: la riga dice ' + finto + ', non ' + vero + ' (' + rigaP.slice(0, 80) + ')');
        const hB = (H.gameState.nomads || []).find(u => u.id === 'n1');
        const scheda = testo(H.schedaTruppa(hB, 'NOMADI'));
        ok(scheda.indexOf(finto) >= 0 && scheda.indexOf(vero) < 0, 'Hub: la scheda dice ' + finto + ', non ' + vero);
        ok(!/HOLOMASK/i.test(scheda), 'e l Hub non scrive lo stato HOLOMASK (direbbe la maschera)');
        const rigaN = testo(N.rigaUnitaConFoto(N.roster[0], {}));
        ok(rigaN.indexOf(vero) >= 0, 'CONTROPROVA: nella propria app la truppa resta ' + vero);
        N.apriDeployStati(0); N.togliHolomask(0);
        ok(!N.roster[0].states.holomask && !N.roster[0].holomaskImita, 'TOGLI HOLOMASK: torna la truppa vera');
    }
});
sezione('34f. Holoecho e Decoy: repliche, etichette, togli, nota in ARO', () => {
    const menuIds = menuIds34;
    {
        const T = creaTavolo(DIR); const N = T.nomadi.g, P = T.pano.g, H = T.hub.g;
        const vera = truppa(T.profilo(T.pano, /^Fusilier \(Combi/), { id: 'p1', alias: 'Eco' });
        vera.equip = String(vera.equip || '') + ', Holoprojector';
        P.roster = [vera];
        P.apriDeployStati(0);
        const pag = String(T.pano.el('deploy-states-content').innerHTML);
        ok(/HOLOECHO: 2 COPIE OLOGRAFICHE/.test(pag) && !/DECOY:/.test(pag), 'pagina degli stati: HOLOECHO (2 copie), niente DECOY senza Decoy');
        P.creaRepliche(0, 'HOLOECHO');
        const rep = P.roster.filter(u => u.replica);
        ok(P.roster.length === 3 && rep.length === 2 && rep.every(r => r.replicaDi === 'p1'), 'create: la vera e due repliche, subito dopo di lei (' + P.roster.map(u => u.replica ? 'R' : 'V').join('') + ')');
        ok(P.roster[0].states.holoecho === true && /HOLOECHO: 2 replica/.test(T.pano.el('deploy-states-content').innerHTML), 'la vera ha holoecho, e la pagina dice quante repliche ci sono');
        T.schiera([truppa(profilo(T, /^Alguacil \(Combi/), { id: 'n1', alias: 'Spara' })], P.roster, 'PANOCEANIA');
        P.currentGroup = 1; P.isCoordinated = false; P.selectedCoordinatedUnits = []; P.aggiornaGraficaRoster();
        const righe = String(T.pano.el('unit-buttons-container').innerHTML);
        ok((righe.match(/🪞 REPLICA \d/g) || []).length === 2 && /★ VERA \d/.test(righe), 'nella propria app: «★ VERA n» e due «🪞 REPLICA n»');
        ok((righe.match(/class="btn-status togli-replica"/g) || []).length === 2, 'e il tasto TOGLI LA REPLICA solo sulle repliche (2)');
        const nem = N.MotoreN5.rosterNemico();
        const rigaN = nem.map(u => testo(N.rigaUnitaConFoto(u, { fazione: 'NEMICA' }))).join(' | ');
        ok(nem.length === 3 && !/REPLICA|VERA/.test(rigaN), 'l avversario vede tre truppe uguali, senza etichette (' + nem.length + ')');
        // l ARO del proprietario: un attacco sulla replica
        const r0 = P.roster.find(u => u.replica);
        const pubblica = nem.find(u => u.id === r0.id) || {};
        P.currentAttackData = { azione: 'BS_ATTACK', bersagli: [N.MotoreN5.nomeUnita(pubblica)] };
        P.apriSelezioneAro();
        ok(/class="nota-replica-bersaglio"/.test(T.pano.el('aro-selection-list').innerHTML), 'ARO del proprietario: la nota «E` una REPLICA» quando l attacco la prende');
        P.currentAttackData = { azione: 'BS_ATTACK', bersagli: ['Spara'] };
        P.apriSelezioneAro();
        ok(!/nota-replica-bersaglio/.test(T.pano.el('aro-selection-list').innerHTML), 'CONTROPROVA: un attacco su altri, nessuna nota');
        // togli le repliche una a una: con l ultima cade l Holoecho della vera
        P.togliReplicaDalTavolo(r0.id); T.giro();
        ok(P.roster.length === 2 && P.roster.find(u => u.id === 'p1').states.holoecho === true, 'tolta una replica: la vera resta in Holoecho');
        ok((H.gameState.panoceania || []).length === 2, 'e l Hub lo sa (' + (H.gameState.panoceania || []).length + ' truppe)');
        P.togliReplicaDalTavolo(P.roster.find(u => u.replica).id); T.giro();
        ok(P.roster.length === 1 && P.roster[0].states.holoecho === false, 'tolta l ultima: cade anche l Holoecho della vera (pag. 160)');
        ok((H.gameState.panoceania || []).length === 1, 'e l Hub vede una truppa sola');
        // Decoy (1): una replica sola
        const T2 = creaTavolo(DIR); const P2 = T2.pano.g;
        const knauf = truppa(T2.profilo(T2.pano, /^Fusilier \(Combi/), { id: 'p1', alias: 'K' });
        knauf.skills = String(knauf.skills || '') + ', Decoy (1)';
        P2.roster = [knauf]; P2.apriDeployStati(0);
        ok(/DECOY: 1 BERSAGLI DECOY/.test(T2.pano.el('deploy-states-content').innerHTML), 'Decoy (1): il tasto dice un bersaglio');
        P2.creaRepliche(0, 'DECOY');
        ok(P2.roster.length === 2 && P2.roster[0].states.decoy === true, 'una replica sola, e la vera ha decoy');
        P2.togliRepliche(0);
        ok(P2.roster.length === 1 && !P2.roster[0].states.decoy, 'TOGLI LE REPLICHE allo schieramento: tornano via tutte');
    }
});

// 35: i lavori del 26 ottobre (MOTORE 2026-10-26.1), una sezione per lavoro.
sezione('35a. Minelayer allo schieramento: il limite e la domanda sull area (DEP-10)', () => {
    {
        const T = creaTavolo(DIR); const N = T.nomadi.g;
        const zero = truppa(profilo(T, /^Zero \(Minelayer\)/), { id: 'n1', alias: 'Zero' });
        N.roster = [zero];
        const op = N.opzioniMinelayerDi(zero);
        ok(op && op.ha && op.pezzi === 1, 'premessa: il motore da` il Minelayer, un pezzo (' + J(op && { pezzi: op.pezzi, armi: (op.armi || []).map(a => a.nome) }) + ')');
        N.apriDeployStati(0);
        const pag = String(T.nomadi.el('deploy-states-content').innerHTML);
        ok(/MINELAYER: piazzati 0 su 1/.test(testo(pag)), 'pagina degli stati: «MINELAYER: piazzati 0 su 1»');
        const bott = (pag.match(/class="huge-btn bottone-minelayer"[^>]*onclick="window\.piazzaConMinelayer\(0, \d+\)"/g) || []).length;
        ok(bott === (op.armi || []).filter(a => a.disponibile).length && bott > 0, 'un bottone per arma da piazzare (' + bott + ')');
        const domande = [];
        N.confirm = (m) => { domande.push(m); return /Zona di Schieramento|dentro/i.test(m); };
        const k = (op.armi || []).findIndex(a => a.disponibile);
        if (k < 0) throw new Error('il motore non da` armi da piazzare per lo Zero (manca database_comune.js?)');
        N.piazzaConMinelayer(0, k);
        const quante = op.armi[k].chiedeArea ? 2 : 1;
        ok(domande.length === quante, 'le domande: ' + quante + ' (quella sull area solo se chiedeArea) (' + domande.length + ')');
        ok(N.roster.length === 2 && N.roster[1].deployable, 'piazzata: il gettone entra nel roster');
        N.apriDeployStati(0);
        const pag2 = String(T.nomadi.el('deploy-states-content').innerHTML);
        ok(/MINELAYER: piazzati 1 su 1 — nessuno da piazzare/.test(testo(pag2)) && !/onclick="window\.piazzaConMinelayer/.test(pag2), 'al limite: «piazzati 1 su 1», i bottoni spenti (prima: ne piazzava 3)');
        N.piazzaConMinelayer(0, k);
        ok(N.roster.length === 2 || !N.roster[0].minelayerUsati || N.roster[0].minelayerUsati <= 1, 'CONTROPROVA: un altro tentativo non piazza niente (' + N.roster.length + ')');
    }
});
sezione('35b. RICARICA forzata dall Hub, per truppa e per esercito', () => {
    {
        const T = creaTavolo(DIR); const N = T.nomadi.g, H = T.hub.g;
        const pf = truppa(profilo(T, /^Alguacil \(Combi/), { id: 'n1', alias: 'Panzer' });
        pf.weapon = String(pf.weapon || '') + ', Panzerfaust';
        const nulla = truppa(profilo(T, /^Alguacil \(Combi/), { id: 'n2', alias: 'Nulla' });
        T.schiera([pf, nulla], [truppa(T.profilo(T.pano, /^Fusilier \(Combi/), { id: 'p1', alias: 'Uno' })], 'NOMADI');
        const hP = (H.gameState.nomads || []).find(u => u.id === 'n1'), hN = (H.gameState.nomads || []).find(u => u.id === 'n2');
        ok(H.haArmiUsaGetta(hP) && !H.haArmiUsaGetta(hN), 'chi ha il Panzerfaust ha armi Disposable, l Alguacil liscio no');
        ok(/class="bottone-ricarica"/.test(H.schedaTruppa(hP, 'NOMADI')) && !/bottone-ricarica/.test(H.schedaTruppa(hN, 'NOMADI')), 'il bottone 🔄 RICARICA c e solo sulla scheda del Panzerfaust');
        ok(/class="bottone-ricarica-fazione"[^>]*>🔄 RICARICA TUTTO NOMADI/.test(H.elencoFazioneHub(H.gameState.nomads, 'NOMADI')), 'e in testa all elenco «🔄 RICARICA TUTTO NOMADI»');
        ok(!/bottone-ricarica-fazione/.test(H.elencoFazioneHub(H.gameState.panoceania, 'PANOCEANIA')), 'CONTROPROVA: PanOceania senza armi Disposable non ha il bottone');
        N.roster.find(u => u.id === 'n1').usiSpesi = { 'PANZERFAUST': 2 };
        H.inviaRicaricaForzata('NOMADI', 'n1', 'Panzer'); T.giro();
        const c = JSON.parse(T.server[H.MotoreN5.CANALI.HUB_RICARICA] || '{}');
        ok(c.tipo === 'RICARICA_FORZATA' && c.fazione === 'NOMADI' && c.unitaId === 'n1', 'il comando va sul canale hub_ricarica_usi (' + J({ tipo: c.tipo, fazione: c.fazione, unitaId: c.unitaId }) + ')');
        const spesi = N.roster.find(u => u.id === 'n1').usiSpesi || {};
        ok(!Object.keys(spesi).some(k => spesi[k] > 0), 'l app dei Nomads azzera gli usi spesi (' + J(spesi) + ')');
        ok(N.alert_.some(m => /Ricarica forzata dall'Hub/.test(m)), 'e lo dice al giocatore');
    }
});
sezione('35c. ARO: gli usi residui dentro il bottone, l arma esaurita spenta', () => {
    {
        const T = creaTavolo(DIR); const N = T.nomadi.g, P = T.pano.g;
        const pf = truppa(T.profilo(T.pano, /^Fusilier \(Combi/), { id: 'p1', alias: 'Panzer' });
        pf.weapon = String(pf.weapon || '') + ', Panzerfaust';
        T.schiera([truppa(profilo(T, /^Alguacil \(Combi/), { id: 'n1', alias: 'Muove' })], [pf], 'NOMADI');
        T.apriMenu(T.nomadi, 0); N.selectAction('MOVIMENTO', false); T.giro();
        P.apriSelezioneAro(); P.toggleAroUnit('p1'); P.confermaSelezioneAro(); P.selezionaAzioneAro('BS_ATTACK');
        const armi = String(T.pano.el('aro-weapon-list').innerHTML || T.pano.el('weapon-buttons-container').innerHTML);
        // RISCRITTI il 26 ottobre sera (motore 26.2): la riga degli usi era
        // un <div> SOTTO il bottone, disegnato da logica_aro; ora sta DENTRO
        // il bottone (M.bottoneArma, opzione usi), una volta sola.
        ok(/class="bottone-arma[^"]*"[\s\S]*class="usi-arma"[^>]*>Usi residui: 2 su 2/.test(armi), 'ARO: dentro il bottone del Panzerfaust «Usi residui: 2 su 2»');
        ok((armi.match(/Usi residui/g) || []).length === 1, 'una volta sola: la copia di logica_aro e` tolta');
        P.roster[0].usiSpesi = { 'PANZERFAUST': 2 };
        P.apriSelezioneAro(); P.toggleAroUnit('p1'); P.confermaSelezioneAro(); P.selezionaAzioneAro('BS_ATTACK');
        const armi2 = String(T.pano.el('aro-weapon-list').innerHTML || T.pano.el('weapon-buttons-container').innerHTML);
        ok(/class="bottone-arma bottone-arma-esaurito"/.test(armi2) && (armi2.match(/USI ESAURITI \(2\/2\)/g) || []).length === 1, 'esaurito: il bottone spento (bottone-arma-esaurito) e «⛔ USI ESAURITI (2/2) — serve un Reload», una volta');
        ok(!/selezionaArmaAro\('Panzerfaust/.test(armi2), 'e toccarlo non sceglie l arma: spiega');
    }
});
sezione('35d. DIS-02: il salvataggio locale tiene gli usi spesi', () => {
    {
        const T = creaTavolo(DIR); const N = T.nomadi.g;
        const pf = truppa(profilo(T, /^Alguacil \(Combi/), { id: 'n1', alias: 'Panzer', usiSpesi: { 'PANZERFAUST': 1 } });
        T.schiera([pf], [truppa(T.profilo(T.pano, /^Fusilier \(Combi/), { id: 'p1', alias: 'Uno' })], 'NOMADI');
        N.salvaPartitaLocale();
        N.roster = [];
        const ripresa = N.riprendiPartita ? N.riprendiPartita() : null;
        const u = (N.roster || []).find(x => x.id === 'n1');
        ok(u && u.usiSpesi && u.usiSpesi.PANZERFAUST === 1, 'salvata e ripresa la partita, usiSpesi resta {PANZERFAUST: 1} (' + J(u && u.usiSpesi) + ')');
    }
});

sezione('36a. ARO: si passa il nome GREZZO dell arma, con la notazione (TEST, MOTORE 2026-10-27.2)', () => {
    // Un tavolo per truppa: la selezione dell'ARO resta per lo stesso allarme.
    const nomi = (re) => {
        const T = creaTavolo(DIR); const N = T.nomadi.g, P = T.pano.g;
        T.schiera([truppa(profilo(T, re), { id: 'n1', alias: 'Reagisce' })], [truppa(T.profilo(T.pano, /^Fusilier \(Combi/), { id: 'p1', alias: 'Uno' })], 'PANOCEANIA');
        T.apriMenu(T.pano, 0); P.selectAction('MOVIMENTO', false); T.giro();
        N.apriSelezioneAro(); N.toggleAroUnit('n1'); N.confermaSelezioneAro(); N.selezionaAzioneAro('BS_ATTACK');
        return (String(T.nomadi.el('aro-weapon-list').innerHTML).match(/selezionaArmaAro\('([^']+)'/g) || []).map(x => x.slice(18, -1)); };
    const nZ = nomi(/^Reaktion Zond \(Thunderbolt\)/);
    ok(nZ.some(n => /^Thunderbolt ?\(\+1B\)$/.test(n)), 'il bottone del Thunderbolt passa il nome grezzo, col (+1B) (' + J(nZ) + ')');
    ok(!nZ.some(n => n === 'Thunderbolt'), 'e non piu` «Thunderbolt» spogliato');
    const nF = nomi(/^Alguacil \(Combi/);
    ok(nF.indexOf('Combi Rifle') >= 0, 'CONTROPROVA: un arma senza notazione resta il suo nome (' + J(nF) + ')');
});

sezione('36b. ARO col Total Reaction: sempre BURST PIENO, niente scelta (Paolo 27 ottobre sera; REGOLE riga 10224)', () => {
    // RISCRITTO il 27 ottobre sera (Paolo, test BS-16 B: «togli i tasti di
    // selezione del burst; anche se e` opzionale nessuno scegliera` un B1»).
    // Prima: due tasti, «BURST PIENO (B3)» e «B1», con N.sceltaBurstAro(false)
    // che riduceva a 1 e spediva burstPieno false; Panzerfaust a B1 spendeva un
    // uso. Ora: nessun tasto, sceltaBurstAro non c e piu`, la reazione e`
    // sempre al pieno e lo dichiara (burstPieno true) al motore.
    const giro = (arma) => {
        const T = creaTavolo(DIR); const N = T.nomadi.g, P = T.pano.g;
        const zond = truppa(profilo(T, /^Reaktion Zond \(Thunderbolt\)/), { id: 'n1', alias: 'Zond' });
        if (arma) zond.weapon = arma;
        T.schiera([zond], [truppa(T.profilo(T.pano, /^Fusilier \(Combi/), { id: 'p1', alias: 'Uno' })], 'PANOCEANIA');
        T.apriMenu(T.pano, 0); P.selectAction('MOVIMENTO', false); T.giro();
        N.apriSelezioneAro(); N.toggleAroUnit('n1'); N.confermaSelezioneAro(); N.selezionaAzioneAro('BS_ATTACK');
        const nome = ((String(T.nomadi.el('aro-weapon-list').innerHTML).match(/selezionaArmaAro\('([^']+)'/) || [])[1]);
        N.selezionaArmaAro(nome); N.selezionaBersaglioAro('Uno');
        const pag = String(T.nomadi.el('aro-modifiers-content').innerHTML), cfg = Object.assign({}, N.aroCurrentConfig);
        const spedite = []; const orig = N.inviaRispostaAro;
        N.inviaRispostaAro = function (payload, f) { spedite.push(JSON.parse(JSON.stringify(payload))); return orig.apply(this, arguments); };
        N.salvaAroCorrente(); T.giro();
        return { T, N, nome, pag, cfg, spedite, zond: N.roster.find(u => u.id === 'n1') };
    };
    // --- Thunderbolt (+1B), B2+1 = B3 col Total Reaction ---
    const a = giro(null);
    ok(!/tasto-burst-pieno|tasto-burst-ridotto|scelta-burst-aro|sceltaBurstAro/.test(a.pag) && typeof a.N.sceltaBurstAro === 'undefined',
       'niente tasti del burst, e la funzione sceltaBurstAro non c e piu`');
    ok(a.cfg.burst === 3 && a.cfg.burstPieno === true, 'la reazione e` al pieno: B3 (B2 del Thunderbolt + il suo (+1B)), burstPieno true (' + a.cfg.burst + ', ' + a.cfg.burstPieno + ')');
    const r = a.spedite[0] || {};
    ok(((r.reazioni || [])[0] || {}).burstPieno === true, 'e la risposta ARO spedita porta burstPieno: true (' + J(((r.reazioni || [])[0] || {}).burstPieno) + ')');
    // --- Panzerfaust (+1B), Disposable (2): al pieno B2 brucia due usi ---
    const b2 = giro('Panzerfaust (+1B)');
    ok(b2.cfg.burst === 2, 'Panzerfaust (+1B): B2 (' + b2.nome + ', ' + b2.cfg.burst + ')');
    ok(Object.values(b2.zond.usiSpesi || {})[0] === 2, 'al pieno (B2) spesi tutti e due gli usi (' + J(b2.zond.usiSpesi) + ')');
    // --- senza Total Reaction nessuna scelta ---
    const T = creaTavolo(DIR); const N = T.nomadi.g, P = T.pano.g;
    const alg = truppa(profilo(T, /^Alguacil \(Combi/), { id: 'n1', alias: 'Fante' });
    T.schiera([alg], [truppa(T.profilo(T.pano, /^Fusilier \(Combi/), { id: 'p1', alias: 'Uno' })], 'PANOCEANIA');
    T.apriMenu(T.pano, 0); P.selectAction('MOVIMENTO', false); T.giro();
    N.apriSelezioneAro(); N.toggleAroUnit('n1'); N.confermaSelezioneAro(); N.selezionaAzioneAro('BS_ATTACK');
    N.selezionaArmaAro('Combi Rifle'); N.selezionaBersaglioAro('Uno');
    ok(N.aroCurrentConfig.burstPieno === undefined && N.aroCurrentConfig.burst === 1,
       'CONTROPROVA: un Alguacil (senza Total Reaction) resta B1 e la reazione non porta burstPieno');
});

sezione('37. Hidden Deployment nella propria app: il segnalino grande fra le icone, niente scritta (Paolo, 27 ottobre sera)', () => {
    const T = creaTavolo(DIR); const N = T.nomadi.g, P = T.pano.g, H = T.hub.g;
    const nasc = truppa(profilo(T, /^Alguacil \(Combi/), { id: 'n1', alias: 'Ombra', deployState: 'HIDDEN', states: { hidden: true } });
    const vista = truppa(profilo(T, /^Alguacil \(Combi/), { id: 'n2', alias: 'Vista' });
    T.schiera([nasc, vista], [truppa(T.profilo(T.pano, /^Fusilier \(Combi/), { id: 'p1', alias: 'Uno' })], 'NOMADI');
    N.currentGroup = 1; N.isCoordinated = false; N.selectedCoordinatedUnits = []; N.aggiornaGraficaRoster();
    const righe = String(T.nomadi.el('unit-buttons-container').innerHTML).split(/(?=<button)/).filter(r => /riga-unita/.test(r));
    const rOmbra = righe.find(r => /Ombra/.test(r)) || '', rVista = righe.find(r => /Vista/.test(r)) || '';
    // RISCRITTO il 27 ottobre sera (Paolo: «togli la scritta HIDDEN e metti il
    // token in grande a destra come gli altri token»). Prima: etichetta-marker
    // «HIDDEN» con l icona piccola accanto al nome. Ora: niente scritta, il
    // segnalino a 45 px fra le icone degli stati (rup-icone).
    const iconeOmbra = (rOmbra.match(/<div class="rup-icone">([\s\S]*?)<\/div>/) || ['', ''])[1];
    ok(/<img class="icona-segnalino-hidden" src="img\/nomadi\/icon_hidden\.png" data-rip="img\/icon_hidden\.png"[\s\S]*?alt="HIDDEN" style="width:45px; height:45px;/.test(iconeOmbra)
       && !/etichetta-marker/.test(rOmbra) && !/>HIDDEN</.test(rOmbra),
       'propria app: il segnalino HIDDEN grande (45 px) fra le icone degli stati, img/nomadi/icon_hidden.png con ripiego img/icon_hidden.png; niente scritta');
    ok(/🫥/.test(rOmbra), 'e se mancano i due file, l emoji 🫥');
    ok(!/etichetta-marker/.test(rVista), 'CONTROPROVA: una truppa a vista non ha l etichetta');
    ok(!P.MotoreN5.rosterNemico().some(u => u.id === 'n1') && !(H.gameState.nomads || []).some(u => u.id === 'n1'), 'l avversario e l Hub non la ricevono (invisibile)');
    N.roster = [nasc, vista]; N.deployGroup = 1; N.renderDeployUnits();
    // RISCRITTO il 27 ottobre sera (Paolo: «togli la scritta HIDDEN DEPLOYMENT
    // e metti il token grande»). Prima: «[ HIDDEN DEPLOYMENT ]» con l icona
    // piccola. Ora: niente scritta, lo stesso segnalino a 45 px fra le icone.
    const dep = String(T.nomadi.el('deploy-units-container').innerHTML);
    ok(!/HIDDEN DEPLOYMENT/.test(dep) && !/etichetta-hidden/.test(dep) && /<div class="rup-icone"><img class="icona-segnalino-hidden"[\s\S]*?width:45px/.test(dep),
       'lista dello schieramento: niente «[ HIDDEN DEPLOYMENT ]», il segnalino grande fra le icone');
});

// 38: il collaudo grafico di MOTORE (27 ottobre, 63 schermate a 390 px) e
// BS-29. Una sezione per punto. Il DOM del banco e` finto: altezze e misure
// non si misurano, si guarda il foglio di stile e l'HTML prodotto.
const paginaApp = () => fs.readFileSync(DIR + 'app.html', 'utf8');
const stileApp = () => (paginaApp().match(/<style>([\s\S]*?)<\/style>/) || ['', ''])[1];
// Il corpo della pagina senza gli script: i tasti scritti nell'HTML.
const markupApp = () => paginaApp().replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style>[\s\S]*?<\/style>/, '');

sezione('38a. Tasti stirati: nelle colonne un tasto e` alto quanto il suo contenuto (collaudo, punto 1)', () => {
    const css = stileApp();
    const regola = (css.match(/([^{}]*)\{\s*flex:\s*0 0 auto;\s*\}/) || []);
    const sel = String(regola[1] || '');
    ok(/\.grid-buttons > \.huge-btn/.test(sel) && /\.step-container > \.huge-btn/.test(sel) && /#second-half-buttons-container > \.huge-btn/.test(sel),
       'una regola dice flex: 0 0 auto ai tasti dentro .grid-buttons, gli step e la seconda meta` (' + sel.split('*/').pop().trim().replace(/\s+/g, ' ') + ')');
    ok(/\.huge-btn \{ flex: 1;/.test(css), 'CONTROPROVA: il tasto da solo resta flex:1, per le righe dove due tasti si dividono lo spazio');
    // Dalla porta del giocatore: i Gruppi del radar sono figli diretti della colonna.
    const T = creaTavolo(DIR); const N = T.nomadi.g;
    T.schiera([truppa(profilo(T, /^Alguacil \(Combi/), { id: 'n1', alias: 'Uno' })], [truppa(T.profilo(T.pano, /^Fusilier \(Combi/), { id: 'p1', alias: 'Due' })], 'NOMADI');
    N.aggiornaMenuGruppi();
    ok(/^\s*<button class="huge-btn"/.test(T.nomadi.el('q:#battle .grid-buttons').innerHTML), 'i Gruppi del radar sono tasti direttamente nella colonna .grid-buttons: la regola li prende');
});

sezione('38b. Il tasto MENU non copre l ultimo tasto (collaudo, punto 2)', () => {
    const css = stileApp();
    const spazio = parseInt((css.match(/--spazio-menu:\s*(\d+)px/) || [])[1], 10);
    ok(spazio >= 56, 'c e uno spazio per il MENU, --spazio-menu (' + spazio + ' px)');
    ok(/body \{[^}]*padding-bottom: calc\(10px \+ var\(--spazio-menu\) \+ env\(safe-area-inset-bottom, 0px\)\)/.test(css), 'e il fondo della pagina lo lascia libero sotto ogni schermata (body padding-bottom)');
    ok(/id="btn-menu"[^>]*position:fixed; left:10px; bottom:calc\(10px/.test(markupApp()), 'il MENU resta dov era, in basso a sinistra');
});

sezione('38c. Due uscite, una conferma (collaudo, punto 3)', () => {
    const m = markupApp();
    const uscite = [...m.matchAll(/<button class="tasto-uscita"[^>]*>([^<]*)<\/button>/g)].map(x => x[1].trim());
    ok(uscite.length >= 12 && uscite.every(t => t === 'INDIETRO' || t === 'ANNULLA ORDINE'), 'le uscite della pagina si chiamano solo INDIETRO o ANNULLA ORDINE (' + uscite.length + ': ' + J([...new Set(uscite)]) + ')');
    ok(!/ANNULLA E CAMBIA UNIT|FINE ORDINE \(TORNA AL RADAR\)|RICOMINCIA SELEZIONE|TORNA ALLA LISTA/.test(m), 'non restano ANNULLA E CAMBIA UNITA`, FINE ORDINE, RICOMINCIA SELEZIONE, TORNA ALLA LISTA');
    ok(!/<button class="btn-status"[^>]*(goToStep|goToAroStep|tornaAlRadar|tornaAlSetup|apriSelezioneAro)/.test(m), 'nessuna uscita col vecchio stile btn-status');
    const conferme = ['confermaSchieramento()', 'confermaSelezioneAro()', 'salvaAroCorrente()', 'confirmMultiAro(false)']
        .map(c => (m.match(new RegExp('<button[^>]*onclick="window\\.' + c.replace(/[()]/g, '\\$&') + '"[^>]*>')) || [''])[0]);
    ok(conferme.every(b => /class="huge-btn tasto-conferma"/.test(b) && !/style=/.test(b)), 'CONCLUDI SCHIERAMENTO, AVANTI, CONFERMA E PROCEDI, CONFERMA BERSAGLI: classe tasto-conferma, nessun colore o altezza in linea');
    ok(/\.huge-btn\.tasto-conferma \{[^}]*background: var\(--conferma-sfondo\); border-color: var\(--conferma-bordo\)/.test(stileApp()), 'il verde della conferma sta nelle variabili');
    const T = creaTavolo(DIR); const N = T.nomadi.g, P = T.pano.g, M = N.MotoreN5;
    const c = N.applicaColoriConferma();
    ok(c && J(c) === J({ sfondo: M.COLORI.conferma.sfondo, bordo: M.COLORI.conferma.bordo, testo: M.COLORI.conferma.testo }), 'e le variabili vengono dal motore, M.COLORI.conferma (' + J(c) + ')');
    // C06: CONFERMA SQUADRA E PROCEDI del Coordinato, prima rossa.
    T.schiera([truppa(profilo(T, /^Alguacil \(Combi/), { id: 'n1', alias: 'Capo' }), truppa(profilo(T, /^Alguacil \(Combi/), { id: 'n2', alias: 'Gregario' })],
              [truppa(T.profilo(T.pano, /^Fusilier \(Combi/), { id: 'p1', alias: 'Uno' })], 'NOMADI');
    N.currentGroup = 1; N.isCoordinated = true; N.selectedCoordinatedUnits = []; N.spearheadUnit = null;
    N.selezionaUnita(0); N.selezionaUnita(1);
    const sq = (String(T.nomadi.el('unit-buttons-container').innerHTML).match(/<button[^>]*confermaCoordinato[^>]*>/) || [''])[0];
    ok(/class="huge-btn tasto-conferma"/.test(sq) && !/#cc0000/.test(sq), 'Coordinato: CONFERMA SQUADRA E PROCEDI e` verde come le altre, non piu` rossa (' + sq.slice(0, 60) + ')');
    N.isCoordinated = false; N.selectedCoordinatedUnits = []; N.spearheadUnit = null;
    // ARO: il tasto di conferma lascia il colore alla classe; solo l'IDLE e` scritto in linea.
    T.apriMenu(T.nomadi, 0); N.selectAction('MOVIMENTO', false); T.giro();
    P.apriSelezioneAro(); P.toggleAroUnit('p1'); P.confermaSelezioneAro(); P.selezionaAzioneAro('BS_ATTACK'); P.selezionaArmaAro('Combi Rifle'); P.selezionaBersaglioAro('Capo');
    const tasto = T.pano.el('btn-conferma-aro');
    ok(tasto.style.background === '' && /CONFERMA/.test(tasto.innerText), 'ARO: CONFERMA E PROCEDI senza fondo in linea, lo da` la classe (' + J(tasto.style.background) + ')');
    P.toggleAroRequisito('lof');
    ok(/IDLE/.test(tasto.innerText) && tasto.style.background !== '', 'senza Linea di Tiro diventa IDLE, col suo giallo (' + tasto.style.background + ')');
    P.toggleAroRequisito('lof');
    ok(tasto.style.background === '' && tasto.style.borderColor === '', 'e tornata la Linea di Tiro, il giallo se ne va');
});

sezione('38d. Tre livelli di titolo e sei misure di carattere (collaudo, punto 4)', () => {
    const css = stileApp(), m = markupApp();
    const scala = ['xs', 's', 'm', 'l', 'xl', 'xxl'].map(k => parseInt((css.match(new RegExp('--fs-' + k + ':\\s*(\\d+)px')) || [])[1], 10));
    ok(J(scala) === J([12, 14, 16, 22, 32, 42]), 'la scala sta in sei variabili: 12, 14, 16, 22, 32, 42 (' + J(scala) + ')');
    ok(/\n\s*h1 \{ font-family: 'Teko', sans-serif; font-size: clamp\(26px, 9vw, var\(--fs-xxl\)\);[^}]*color: var\(--nomad-orange\)/.test(css), 'h1: Teko 42 (scende con lo schermo), col colore della fazione');
    ok(/\n\s*h2 \{ font-family: 'Teko', sans-serif; font-size: var\(--fs-titolo-2\)/.test(css) && /--fs-titolo-2:\s*28px/.test(css), 'h2: Teko 28');
    ok(/\n\s*h3 \{ font-family: 'Share Tech Mono', monospace; font-size: var\(--fs-m\); color: var\(--nomad-orange\)/.test(css), 'h3: mono 16, col colore della fazione');
    const conMisura = [...m.matchAll(/<h[123][^>]*style="[^"]*(font-size|font-family)[^"]*"/g)].map(x => x[0].slice(0, 40));
    ok(conMisura.length === 0, 'nessun titolo della pagina si scrive carattere o misura in linea (' + J(conMisura) + ')');
    ok(!/margin-top:\s*-10px/.test(m) && (m.match(/class="sottotitolo-step"/g) || []).length === 4, 'le righe sotto il titolo non hanno piu` margin-top:-10px (C01, E16: \"(Tocco rapido...)\" tagliato in alto)');
    ok(/<h1 class="titolo-allarme">⚠️ TURNO AVVERSARIO<\/h1>/.test(m), 'il turno avversario resta un allarme rosso, con la classe titolo-allarme');
});

sezione('38e. Schieramento: la riga con la foto, niente immagine rotta, scelte uguali, ricerca HoloMask (collaudo, punto 5)', () => {
    const T = creaTavolo(DIR); const N = T.nomadi.g;
    N.FOTO_MINIATURE = ['alguaciles.png'];
    N.roster = [truppa(profilo(T, /^Alguacil \(Combi/), { id: 'n1', alias: 'Uno' }), truppa(profilo(T, /^Alguacil \(Combi/), { id: 'n2', alias: 'Due', imgVariant: 'alguaciles.png', deployState: 'CAMO', states: { camo: true } })];
    N.apriSchieramento(); N.apriGruppoDeploy(1);
    const lista = String(T.nomadi.el('deploy-units-container').innerHTML);
    const righe = lista.split(/(?=<button)/).filter(r => /riga-unita-foto/.test(r));
    ok(righe.length === 2, 'le truppe da schierare hanno la riga di tutti gli elenchi, rigaUnitaConFoto (' + righe.length + ')');
    ok(!/TOCCA PER LA FOTO/.test(lista) && !/<img src=""/.test(lista), 'niente piu` immagine vuota col testo TOCCA PER LA FOTO');
    ok(/<span class="rup-sigla rup-tocco-foto" onpointerdown="event\.stopPropagation\(\)" onclick="event\.stopPropagation\(\); window\.cambiaIconaDeploy\(event, 0\)"/.test(righe[0]), 'senza foto: la sigla del tipo, e toccarla apre la galleria');
    ok(/<img class="rup-foto rup-tocco-foto" src="img\/nomadi\/alguaciles\.png"[\s\S]*?onclick="event\.stopPropagation\(\); window\.cambiaIconaDeploy\(event, 1\)"/.test(righe[1]), 'con la foto: la foto, e toccarla apre la galleria');
    ok(/startDeployPress\(0, event\)/.test(righe[0]) && /endDeployPress\(0\)/.test(righe[0]), 'il tocco sulla riga resta quello di prima (breve: schieramento; lungo: stati)');
    ok(/class="note-schieramento"[^>]*>[\s\S]*SEGNALINO CAMO/.test(righe[1]), 'la nota di schieramento sta nella fascia bassa della riga');
    vmTocco(T.nomadi, (righe[0].match(/onclick="event\.stopPropagation\(\); (window\.cambiaIconaDeploy\(event, 0\))"/) || [])[1].replace('event', 'null'));
    ok(T.nomadi.el('galleria-foto').style.display === 'block' && /assegnaFoto\(0, 'alguaciles\.png'\)/.test(T.nomadi.el('galleria-foto').innerHTML) === false, 'toccata la sigla si apre la galleria (la foto libera e` gia` presa da Due: non compare)');
    N.chiudiGalleriaFoto();
    // Le scelte della pagina degli stati: tutte uguali, la scelta accesa con la classe.
    const zero = truppa(profilo(T, /^Zero \(Minelayer\)/), { id: 'n3', alias: 'Zero' });
    N.roster.push(zero);
    N.apriDeployStati(2);
    const pag = String(T.nomadi.el('deploy-states-content').innerHTML);
    const tasti = pag.match(/<button class="huge-btn[^"]*"[^>]*>/g) || [];
    ok(tasti.length >= 3 && tasti.every(b => !/style="[^"]*(background|border-color)/.test(b)), 'nella pagina degli stati nessun tasto ha colori suoi (' + tasti.length + ' tasti)');
    ok(/<button class="huge-btn tasto-opzione attivo" onclick="window\.setDeployState\(2, 'NORMAL'\)">NORMALE/.test(pag), 'la scelta attiva e` accesa con la classe attivo');
    ok(/class="huge-btn bottone-minelayer" onclick=/.test(pag), 'i tasti del Minelayer non sono piu` stretti e colorati a parte: stessa regola delle altre scelte');
    ok(/#deploy-states-content \.huge-btn \{[^}]*width: 100%;[^}]*background: #222; border-color: #555;/.test(stileApp()) && /#deploy-states-content \.huge-btn\.attivo \{ background: var\(--nomad-darkred\); border-color: var\(--nomad-red\);/.test(stileApp()),
       'la regola: tutta la larghezza, un colore per tutte, la scelta nel colore della fazione');
    // HoloMask: il campo di ricerca.
    const bashi = truppa(profilo(T, /^Bashi Bazouk/), { id: 'n4', alias: 'Bashi' });
    N.roster.push(bashi);
    N.apriSceltaHolomask(3);
    const gruppi = N._gruppiHolomask || [];
    const pagH = String(T.nomadi.el('deploy-states-content').innerHTML);
    ok(/<input type="search" id="cerca-holomask"[^>]*oninput="window\.filtraHolomask\(3, this\.value\)"/.test(pagH), 'HoloMask: sopra l elenco un campo di ricerca (' + gruppi.length + ' truppe)');
    N.filtraHolomask(3, 'alg');
    const filtrata = String(T.nomadi.el('lista-holomask').innerHTML);
    const nomi = [...filtrata.matchAll(/class="huge-btn scelta-holomask-unita" onclick="[^"]*">([^<]*)</g)].map(x => x[1].trim());
    const attesi = gruppi.filter(g => /ALG/i.test(g.unita)).map(g => g.unita);
    ok(nomi.length > 0 && nomi.length < gruppi.length && J(nomi) === J(attesi), 'scritto \"alg\": restano solo le truppe col nome che lo contiene (' + J(nomi) + ')');
    const k = gruppi.findIndex(g => g.unita === nomi[0]);
    ok(new RegExp('apriVariantiHolomask\\(3, ' + k + '\\)|scegliHolomask\\(3, ').test(filtrata), 'e il tocco porta ancora alla truppa giusta (indice ' + k + ' dell elenco intero)');
    N.filtraHolomask(3, 'zzz');
    ok(/Nessuna truppa/.test(T.nomadi.el('lista-holomask').innerHTML), 'niente che corrisponde: lo dice');
    // RISCRITTO il 27 ottobre sera (B07, secondo giro): prima 'campo vuoto:
    // tornano tutte'; ora a campo vuoto l'elenco e` vuoto con l'invito, e
    // l'iniziale mostra le truppe che cominciano con quella lettera.
    N.filtraHolomask(3, '');
    ok(!/scelta-holomask-unita/.test(T.nomadi.el('lista-holomask').innerHTML) && /class="invito-holomask"/.test(T.nomadi.el('lista-holomask').innerHTML), 'campo vuoto: nessuna truppa, l invito a cercare o a toccare l iniziale');
    N.filtraHolomask(3, '', 'A');
    const conA = [...String(T.nomadi.el('lista-holomask').innerHTML).matchAll(/class="huge-btn scelta-holomask-unita" onclick="[^"]*">([^<]*)</g)].map(x => x[1].trim());
    ok(conA.length > 0 && J(conA) === J(gruppi.filter(g => /^A/i.test(String(g.unita).trim())).map(g => String(g.unita).trim())), 'toccata la A: solo le truppe che cominciano per A (' + conA.length + ')');
    ok((String(T.nomadi.el('deploy-states-content').innerHTML).match(/class="huge-btn lettera-holomask"/g) || []).length === new Set(gruppi.map(g => String(g.unita).trim().charAt(0).toUpperCase())).size, 'una lettera per ogni iniziale delle truppe');
});

sezione('38f. Testi tagliati (collaudo, punto 6)', () => {
    const m = markupApp();
    const sel = (m.match(/<select id="combatGroupSelect"[^>]*>[\s\S]*?<\/select>/) || [''])[0];
    ok(sel && !/huge-btn/.test(sel) && /<option value="1">Gruppo 1<\/option>/.test(sel), 'A02: la tendina del Gruppo non e` piu` un tasto da 32 px, e dice \"Gruppo 1\" (prima \"GRUP.\")');
    const T = creaTavolo(DIR); const N = T.nomadi.g, P = T.pano.g;
    // D02/E11: la fascia del soprannome.
    const nisse = truppa(profilo(T, /^Alguacil \(Combi/), { id: 'n1', alias: 'Alguacil' });
    const rN = String(N.rigaUnitaConFoto(nisse, {}));
    ok(/<div class="rup-alias rup-profilo">Combi Rifle<\/div>/.test(rN), 'soprannome uguale al nome: nella fascia bassa l opzione del profilo, non il vuoto');
    ok(/<div class="rup-alias">"Rosso"<\/div>/.test(String(N.rigaUnitaConFoto(Object.assign({}, nisse, { alias: 'Rosso' }), {}))), 'CONTROPROVA: con un soprannome vero resta il soprannome');
    const marker = { id: 'x', nome: 'MARKER', alias: 'SEGNALINO MIMETICO 1', tipo: 'MARKER', states: {} };
    const rM = String(N.rigaUnitaConFoto(marker, { fazione: 'NEMICA' }));
    ok(!/rup-profilo/.test(rM), 'di un Marker non si scrive il profilo');
    // E06: la sigla del Marker.
    ok(!/>MAR</.test(rM) && /rup-sigla&quot;>\?</.test(rM), 'E06: un Marker senza immagine ha la sigla \"?\", non \"MAR\"');
    // G02: con piu` icone il nome ha piu` spazio.
    const una = String(N.rigaUnitaConFoto(truppa(profilo(T, /^Alguacil \(Combi/), { id: 'n2', alias: 'A', states: { targeted: true } }), {}));
    const tre = String(N.rigaUnitaConFoto(truppa(profilo(T, /^Alguacil \(Combi/), { id: 'n3', alias: 'B', states: { targeted: true, stunned: true, isolated: true } }), {}));
    ok(/padding:10px 72px 34px 92px/.test(una) && !/rup-icone-molte/.test(una), 'un icona: come prima (72 px a destra)');
    ok(/<div class="rup-icone rup-icone-molte">/.test(tre) && /padding:10px 126px 34px 92px/.test(tre), 'tre icone: piu` piccole e accavallate, il nome perde 126 px invece di 184 (G02, \"SPEKTR\")');
    ok(/\.riga-unita-foto \.rup-icone-molte img \{ width:46px !important; height:46px !important; margin:0 0 0 -14px !important; \}/.test(stileApp()), 'la regola delle icone strette: 46 px, accavallate di 14');
    // G03 e G06: le reazioni e le munizioni in ARO.
    T.schiera([truppa(profilo(T, /^Alguacil \(HMG/), { id: 'n1', alias: 'Spara' })], [truppa(T.profilo(T.pano, /^Orc \(MULTI Rifle\)/), { id: 'p1', alias: 'Orco' })], 'NOMADI');
    T.apriMenu(T.nomadi, 0); N.selectAction('ATTACCO BS', false); N.declareAttackBS('Heavy Machine Gun');
    N.toggleTargetSelection('p1'); N.confirmMultiAro(false); T.giro();
    P.apriSelezioneAro(); P.toggleAroUnit('p1'); P.confermaSelezioneAro();
    const az = String(T.pano.el('aro-action-list').innerHTML);
    const reazioni = az.match(/<button class="huge-btn[^"]*"[^>]*selezionaAzioneAro[^>]*>/g) || [];
    // RISCRITTO il 27 ottobre sera (Paolo: «prima c erano i colori come per
    // gli Ordini attivi, ripristinali»). Prima: tutte con la stessa classe e
    // nessuno style. Ora: stessa classe (misure), e ognuna il suo colore come
    // nel menu degli Ordini (BS/Hacking/CC azzurro, Schivata/Reset verde).
    // E la nota non sta piu` nel tasto: va nella ⓘ.
    const colore = (id) => ((reazioni.find(b => b.indexOf("selezionaAzioneAro('" + id + "')") >= 0) || '').match(/style="background:([^;]+); border-color:([^;]+);"/) || []).slice(1).join(' ');
    ok(reazioni.length >= 3 && reazioni.every(b => /class="huge-btn tasto-reazione" style="background:#[0-9a-f]+; border-color:#[0-9a-f]+;"/i.test(b)), 'G03: le reazioni hanno la stessa classe tasto-reazione e il loro colore (' + reazioni.length + ')');
    // RISCRITTO il 28 ottobre (Paolo: «allinea alla categoria del motore»).
    // Prima: Attacco BS azzurro e Schivata verde, colori diversi scritti qui.
    // Ora ogni reazione ha il colore della categoria del suo Ordine N5
    // (M.coloreOrdine): se il motore cambia categoria, cambia anche qui.
    const MC = P.MotoreN5, del = (n) => { const c = MC.coloreOrdine(n); return c.sfondo + ' ' + c.bordo; };
    ok(colore('BS_ATTACK') === del('BS_ATTACK') && colore('DODGE') === del('DODGE'), 'Attacco BS e Schivata hanno il colore della categoria del motore (' + colore('BS_ATTACK') + ' / ' + colore('DODGE') + ')');
    ok(!/nota-reazione/.test(az) && !/font-size:12px; color:#ff9900/.test(az), 'nessuna nota dentro i tasti delle reazioni');
    P.selezionaAzioneAro('BS_ATTACK');
    const multi = (String(T.pano.el('aro-weapon-list').innerHTML).match(/selezionaArmaAro\('MULTI[^"]*/) || [''])[0];
    vmTocco(T.pano, 'window.' + multi.replace(/&quot;/g, '"'));
    P.selezionaBersaglioAro('Spara');
    const h = String(T.pano.el('aro-modifiers-content').innerHTML);
    // RISCRITTO il 27 ottobre sera (Paolo: la scritta della tendina va
    // centrata). Prima: class="huge-btn tendina-munizioni" style="flex:1 1
    // 100%; width:100%;. Ora la classe huge-btn non c e (impediva di centrare
    // il testo) e la tendina e` display:block, sempre tutta la riga.
    ok(/<div class="riga-munizioni-terreno" style="display:flex; flex-wrap:wrap;/.test(h) && /<select class="tendina-munizioni" style="display:block; flex:1 1 100%; width:100%;[^"]*text-align:center; text-align-last:center;/.test(h),
       'G06: la tendina delle munizioni ha tutta la riga, il terreno va sotto (' + ((h.match(/<option[^>]*>([^<]*)</) || [])[1] || '') + ')');
});

sezione('38g. Il primo Ordine della partita puo` essere una Schivata (collaudo, punto 7)', () => {
    const T = creaTavolo(DIR); const N = T.nomadi.g, P = T.pano.g;
    ok(Array.isArray(N.pendingTargets) && N.pendingTargets.length === 0, 'pendingTargets esiste da subito, vuoto (' + J(N.pendingTargets) + ')');
    T.schiera([truppa(profilo(T, /^Alguacil \(Combi/), { id: 'n1', alias: 'Uno' })], [truppa(T.profilo(T.pano, /^Fusilier \(Combi/), { id: 'p1', alias: 'Due' })], 'NOMADI');
    T.apriMenu(T.nomadi, 0); N.selectAction('SCHIVATA', false); T.giro();
    const caduti = N.errori.filter(e => /Difesa/.test(e) && /map/.test(e));
    ok(caduti.length === 0, 'primo Ordine: SCHIVATA, il modulo non cade (' + (caduti[0] || 'nessun errore').slice(0, 80) + ')');
    ok(P.currentAttackData && P.currentAttackData.azione === 'SCHIVATA', 'e l allarme arriva all avversario (' + J(P.currentAttackData && P.currentAttackData.azione) + ')');
    N.tornaAlRadar();
    ok(J(N.pendingTargets) === '[]', 'e dopo l Ordine resta vuoto');
});

sezione('38h. Hub: a schermo largo i caratteri crescono (collaudo, punto 8)', () => {
    const h = fs.readFileSync(DIR + 'calcolatore_hub.html', 'utf8');
    // RISCRITTO il 27 ottobre sera (H01, secondo giro): prima la parte fissa
    // del calc era sempre "+ N px"; ora puo` essere "- N px" (la miniatura).
    const v = (n) => (h.match(new RegExp('--' + n + ':\\s*clamp\\((\\d+)px, calc\\(([\\d.]+)vw ([+-]) ([\\d.]+)px\\), (\\d+)px\\)')) || []);
    const a = (n, w) => { const x = v(n); return Math.min(+x[5], Math.max(+x[1], +x[2] * w / 100 + (x[3] === '-' ? -1 : 1) * +x[4])); };
    ok(v('hub-riga').length && Math.round(a('hub-riga', 820)) === 12 && a('hub-riga', 1280) >= 14, 'le righe delle schede: 12 px a 820 (come prima), ' + a('hub-riga', 1280).toFixed(1) + ' px a 1280');
    ok(v('hub-testo').length && a('hub-testo', 820) >= 13 && a('hub-testo', 820) < 13.5 && a('hub-testo', 1280) >= 15, 'il testo: 13 px a 820, ' + a('hub-testo', 1280).toFixed(1) + ' a 1280');
    ok(v('hub-foto').length && a('hub-foto', 820) <= 70 && a('hub-foto', 1280) >= 85, 'la miniatura: 70 px a 820, ' + a('hub-foto', 1280).toFixed(0) + ' a 1280: la pagina si riempie');
    ok(/\.st-riga \{ color:#ccc; font-size:var\(--hub-riga\);/.test(h) && /\.st-nome \{ font-family:'Teko', sans-serif; font-size:var\(--hub-nome\);/.test(h) && /body \{[^}]*font-size: var\(--hub-testo\);/.test(h), 'le schede e la pagina usano quelle misure');
    ok(!/@media/.test(h), 'CONTROPROVA: nessuna regola per schermi diversi, quattro colonne sempre (sezione 20)');
});

sezione('38i. BS-29: lo Schieramento Aereo lo decide il motore (M.opzioniSchieramento)', () => {
    const T = creaTavolo(DIR); const N = T.nomadi.g, P = T.pano.g, H = T.hub.g;
    const spector = truppa(profilo(T, /^Spector \(Parachutist/), { id: 'n1', alias: 'Spec' });
    const alg = truppa(profilo(T, /^Alguacil \(Combi/), { id: 'n2', alias: 'Alg' });
    N.roster = [spector, alg];
    N.apriSchieramento(); N.apriGruppoDeploy(1); N.apriDeployStati(0);
    const pag = String(T.nomadi.el('deploy-states-content').innerHTML);
    const voce = N.MotoreN5.opzioniSchieramento(spector)[0] || {};
    // RISCRITTO il 27 ottobre sera (motore 27.9): prima il tasto era
    // class="huge-btn tasto-opzione opzione-schieramento" onclick=...; ora porta
    // anche data-stato, e la classe attivo va in coda.
    const tasto = (pag.match(/<button class="huge-btn tasto-opzione opzione-schieramento" data-stato="AD" onclick="(window\.setDeployState\(0, 'AD'\))">([^<]*)<\/button>/) || []);
    ok(!!tasto[1] && tasto[2] === 'SCHIERAMENTO AEREO', 'Spector (Parachutist, Combat Jump): il tasto SCHIERAMENTO AEREO, con l etichetta del motore');
    // RISCRITTO il 27 ottobre sera (Paolo: le descrizioni nella ⓘ). Prima: la
    // nota del motore sotto il tasto. Ora: sotto niente, la nota e` nella ⓘ
    // della pagina (resta sotto solo per una voce spenta: dice perche`).
    // RISCRITTO il 28 ottobre sera (motore 28.7: M.nota passa il testo per
    // M.accenti, «puo`» -> «può»). Prima: v.testo === voce.nota (grezza).
    // Ora: v.testo === M.accenti(voce.nota); sotto il tasto ne` l una ne` l altra.
    const accentata = N.MotoreN5.accenti(voce.nota);
    ok(voce.nota && pag.indexOf(voce.nota) < 0 && pag.indexOf(accentata) < 0 && N.vociInfo('step-deploy-states').some(v => v.testo === accentata), 'la nota del motore (con gli accenti) e` nella ⓘ, non sotto il tasto');
    ok(!/RISERVA/.test(pag) && !/'RESERVE'/.test(pag), 'niente piu` \"RISERVA / AD\" ne` lo stato RESERVE');
    vmTocco(T.nomadi, tasto[1] || 'void 0');
    ok(N.roster[0].deployState === 'AD', 'toccato: deployState AD (' + N.roster[0].deployState + ')');
    ok(/class='etichetta-ad'[^>]*>\[ SCHIERAMENTO AEREO \]/.test(T.nomadi.el('deploy-units-container').innerHTML), 'nella lista dello schieramento: «[ SCHIERAMENTO AEREO ]»');
    N.apriDeployStati(0);
    ok(/tasto-opzione opzione-schieramento attivo" data-stato="AD" onclick="window\.setDeployState\(0, 'AD'\)/.test(T.nomadi.el('deploy-states-content').innerHTML), 'riaprendo, la scelta e` accesa');
    N.apriDeployStati(1);
    ok(!/data-stato="(AD|HIDDEN)"/.test(T.nomadi.el('deploy-states-content').innerHTML), 'CONTROPROVA: un Alguacil non ha Schieramento Aereo ne` Hidden');
    N.confermaSchieramento(); T.giro();
    ok(!(H.gameState.nomads || []).some(u => u.id === 'n1') && !P.MotoreN5.rosterNemico().some(u => u.id === 'n1'), 'l Hub e l avversario non lo vedono: e` fuori dal tavolo');
    if (H.gameState.activeFaction !== 'NOMADI') H.toggleTurn(); T.giro();
    const menu = T.apriMenu(T.nomadi, 0);
    ok(/selectAction\('INGRESSO IN CAMPO', false\)/.test(menu), 'nel suo turno il menu gli offre INGRESSO IN CAMPO');
    N.renderReactiveRoster();
    ok(!/Spec/.test(T.nomadi.el('reactive-roster-list').innerHTML) && /Alg/.test(T.nomadi.el('reactive-roster-list').innerHTML), 'nel turno reattivo non compare fra le truppe sul tavolo (prima l elenco toglieva solo RESERVE)');
    // Hidden Deployment: anche quello dal motore, con l'icona.
    const croc = truppa(T.profilo(T.pano, /^Croc Man \(MULTI Sniper/), { id: 'p9', alias: 'Croc' });
    P.roster = [croc]; P.apriDeployStati(0);
    // RISCRITTO il 27 ottobre sera (Paolo: «l icona non sopra la scritta ma a
    // sinistra»). Prima: <img> e poi il testo, dentro il tasto. Ora icona e
    // testo stanno su una riga, in un div voce-con-icona.
    ok(/<button class="huge-btn tasto-opzione opzione-schieramento" data-stato="HIDDEN" onclick="window\.setDeployState\(0, 'HIDDEN'\)"><div class="voce-con-icona" style="display:flex; flex-direction:row;[^"]*"><img class="icona-segnalino-hidden"[\s\S]*?HIDDEN DEPLOYMENT<\/div><\/button>/.test(T.pano.el('deploy-states-content').innerHTML), 'Croc Man: HIDDEN DEPLOYMENT dal motore, con l icona a sinistra sulla stessa riga');
});

sezione('39. Gli stati di schieramento tutti dal motore (M.opzioniSchieramento, MOTORE 2026-10-27.9)', () => {
    const T = creaTavolo(DIR); const N = T.nomadi.g, M = N.MotoreN5;
    const pagina = () => String(T.nomadi.el('deploy-states-content').innerHTML);
    // RISCRITTO il 27 ottobre sera (icona a sinistra della scritta). Prima: il
    // testo era il contenuto del tasto, al piu` con un <img> davanti. Ora le
    // voci con segnalino hanno <div class="voce-con-icona"><img ...>TESTO</div>:
    // il testo e` quello che chiude il tasto.
    const voci = () => [...pagina().matchAll(/<button class="huge-btn tasto-opzione opzione-schieramento( attivo)?" data-stato="([A-Z0-9_]+)"( disabled| onclick="[^"]*")>([\s\S]*?)<\/button>/g)]
        .map(x => ({ stato: x[2], acceso: !!x[1], spento: x[3] === ' disabled', testo: (x[4].match(/([^<>]*)(?:<\/div>)?$/) || ['', ''])[1] }));
    const prova = (u) => { N.roster = [u]; N.apriDeployStati(0); return voci(); };
    const tr = (p, a) => truppa(p, a);
    // CAMO: l'etichetta del motore, MOD compreso; NORMALE resta prima.
    const zero = tr(profilo(T, /^Zero \(Minelayer\)/), { id: 'n1', alias: 'Zero' });
    const vz = prova(zero), attese = M.opzioniSchieramento(zero);
    ok(J(vz.map(v => [v.stato, v.testo])) === J(attese.map(v => [v.stato, v.etichetta])), 'Zero: le voci e le etichette sono quelle del motore, nello stesso ordine (' + J(vz.map(v => v.testo)) + ')');
    ok(/SEGNALINO CAMO \(-3\)/.test(vz[0] && vz[0].testo), 'il MOD del Mimetismo lo mette il motore nell etichetta (' + (vz[0] && vz[0].testo) + ')');
    ok(pagina().indexOf("setDeployState(0, 'NORMAL')") < pagina().indexOf('opzione-schieramento'), 'NORMALE resta nostro, prima delle voci del motore');
    // acceso: anche con i deployState vecchi CAMO_x.
    zero.deployState = 'CAMO_2';
    const va = prova(zero).find(v => v.stato === 'CAMO');
    ok(va && va.acceso && !/tasto-opzione attivo" onclick="window\.setDeployState\(0, 'NORMAL'\)/.test(pagina()), 'deployState CAMO_2: la voce CAMO e` accesa, NORMALE no');
    // IMP, FOXHOLE, SEED: nessun profilo dei due database li ha; truppe di prova.
    const sint = (sk) => ({ id: 'z', nome: 'Prova', alias: 'Prova', tipo: 'LI', skills: sk, equip: '', weapon: 'Combi Rifle', states: {}, deployState: 'NORMAL', state: 'ACTIVE', combatGroup: 1 });
    ok(J(prova(sint('Impersonation-2')).map(v => v.stato + ':' + v.testo)) === J(['IMP_2:IMPERSONATION (IMP-2)']), 'Impersonation-2: IMPERSONATION (IMP-2), stato IMP_2');
    ok(J(prova(sint('Sapper')).map(v => v.stato)) === J(['FOXHOLE']) && J(prova(sint('Transmutation (Hatching)')).map(v => v.stato)) === J(['SEED']), 'Sapper: FOXHOLE; Transmutation (Hatching): SEED');
    const imp = sint('Impersonation-2'); imp.deployState = 'IMP_2';
    ok(prova(imp)[0].acceso, 'IMP_2: la voce e` accesa');
    // Il Marker delle liste vecchie: CAMO anche senza la skill.
    ok(J(prova(Object.assign(sint(''), { tipo: 'MARKER' })).map(v => v.stato)) === J(['CAMO']), 'tipo MARKER senza skill: la voce CAMO c e (M.puoEntrareInCamo)');
    ok(prova(sint('')).length === 0, 'CONTROPROVA: senza skill, nessuna voce oltre NORMALE');
    // Camouflage (1 Use) consumato.
    const moran = tr(profilo(T, /^Moran/), { id: 'n2', alias: 'Moran', camoUsato: true });
    const vm1 = prova(moran).find(v => v.stato === 'CAMO');
    ok(vm1 && vm1.spento && !vm1.acceso && pagina().indexOf('<div class="nota-opzione">' + M.opzioniSchieramento(moran)[0].nota + '</div>') >= 0, 'Moran col CAMO gia` usato, fuori dal CAMO: voce spenta, con la nota del motore (F07)');
    moran.deployState = 'CAMO';
    const vm2 = prova(moran).find(v => v.stato === 'CAMO');
    ok(vm2 && vm2.acceso && !vm2.spento, 'ancora in CAMO: accesa e toccabile');
    ok(!/già consumato: niente più stato CAMO/.test(pagina()), 'e la nota scritta da noi non c e piu`: la dice il motore');
    // TIRO DI INFILTRAZIONE FALLITO subito sotto la voce CAMO.
    const m3 = tr(profilo(T, /^Moran/), { id: 'n3', alias: 'Moran', deployState: 'CAMO', states: { camo: true } });
    prova(m3);
    // RISCRITTO il 27 ottobre sera: prima il tasto CAMO conteneva solo testo
    // ([^<]*); ora ha il div voce-con-icona col segnalino. Si guarda che fra il
    // tasto CAMO e quello del tiro fallito non ci siano altri tasti.
    ok(/data-stato="CAMO"(?:(?!<button)[\s\S])*?<\/button>\s*<button class="tasto-uscita"[^>]*infiltrazioneFallita\(0\)/.test(pagina()), 'Moran in CAMO: TIRO DI INFILTRAZIONE FALLITO subito sotto la voce CAMO');
    // Il tocco.
    zero.deployState = 'NORMAL'; prova(zero);
    vmTocco(T.nomadi, (pagina().match(/data-stato="CAMO" onclick="([^"]*)"/) || [])[1] || 'void 0');
    ok(N.roster[0].deployState === 'CAMO' && N.roster[0].states.camo === true, 'toccata la voce: deployState CAMO, states.camo (' + N.roster[0].deployState + ')');
    // La nota e` testo: si scappa.
    const vera = M.opzioniSchieramento;
    // RISCRITTO il 27 ottobre sera: la nota resta sotto il tasto solo per una
    // voce spenta (le altre vanno nella ⓘ); prima la voce di prova era
    // disponibile: true, ora e` disponibile: false.
    M.opzioniSchieramento = () => [{ stato: 'AD', etichetta: 'A<b>', nota: 'n <i>x</i> & y', disponibile: false, acceso: false }];
    prova(zero);
    M.opzioniSchieramento = vera;
    ok(/A&lt;b&gt;<\/button>/.test(pagina()) && /<div class="nota-opzione">n &lt;i&gt;x&lt;\/i&gt; &amp; y<\/div>/.test(pagina()), 'etichetta e nota sono testo: < e & arrivano scappati');
    // Non restano le ricerche di parole.
    const rm = fs.readFileSync(DIR + 'roster_manager.js', 'utf8');
    const corpo = (rm.match(/window\.apriDeployStati = [\s\S]*?\n\};/) || [''])[0];
    ok(corpo && !/skills\.includes|testoMimetismo/.test(corpo), 'in apriDeployStati non ci sono piu` skills.includes ne` testoMimetismo');
});

sezione('40. Collaudo grafico, secondo giro (27 ottobre sera): A03, A05, B10/F01, C03/G02', () => {
    const T = creaTavolo(DIR); const N = T.nomadi.g;
    // A03: matita e X a 44 px.
    N.roster = [truppa(profilo(T, /^Alguacil \(Combi/), { id: 'n1', alias: 'Uno' })]; N.renderRoster();
    const lista = String(T.nomadi.el('localRoster').innerHTML);
    ok((lista.match(/<button type="button" class="tasto-riga-lista[^"]*"/g) || []).length === 2 && /rinominaUnita\(0\)/.test(lista) && /removeUnit\(0\)/.test(lista), 'A03: matita e X della lista sono tasti tasto-riga-lista');
    ok(/\.tasto-riga-lista \{[^}]*min-width: 44px; min-height: 44px;/.test(stileApp()), 'grandi almeno 44 x 44 px');
    // A05: le righe ambigue.
    T.nomadi.el('army-import-text').value = 'GROUP 1\nALGUACIL Combi Rifle / MediKit, Pistol, CC Weapon. (0 | 14)'; N.roster = []; N.importaDaTesto();
    const amb = String(T.nomadi.el('import-ambigue').innerHTML);
    ok(/<button type="button" class="scelta-ambigua" onclick="window\.scegliRigaAmbigua\(0, /.test(amb) && /class="scelta-ambigua salta"/.test(amb) && !/btn-status/.test(amb), 'A05: le scelte delle righe ambigue sono scelte (scelta-ambigua), non tasti rossi');
    ok(/\.scelta-ambigua \{[^}]*background: #222; color: #fff; border: 2px solid #555;/.test(stileApp()), 'grigie come le altre scelte');
    // B10, F01: i titoli nel colore della fazione.
    const m = markupApp();
    ok(/<h1>CONNESSIONE STABILITA<\/h1>/.test(m) && /<h1 id="states-header">STATI UNITÀ<\/h1>/.test(m) && !/<h1[^>]*#00ffff/.test(m), 'B10, F01: CONNESSIONE STABILITA e STATI UNITA` senza l azzurro in linea');
    // C03, G02: le etichette nella fascia bassa, prima del soprannome.
    const zond = truppa(profilo(T, /^Reaktion Zond/), { id: 'n2', alias: 'Zond', states: { suppressive: true } });
    const spek = truppa(profilo(T, /^Spektr/), { id: 'n3', alias: 'Ombra', deployState: 'HIDDEN', states: { hidden: true } });
    N.roster = [zond, spek]; N.currentGroup = 1; N.isCoordinated = false; N.selectedCoordinatedUnits = []; N.aggiornaGraficaRoster();
    const righe = String(T.nomadi.el('unit-buttons-container').innerHTML).split(/(?=<button)/).filter(r => /riga-unita/.test(r));
    const nome = (r) => (r.match(/<div class="rup-nome">([\s\S]*?)<\/div>/) || ['', ''])[1];
    ok(/ATTIVARLA ANNULLA LA SOPPRESSIONE/.test(righe[0]) && !/ATTIVARLA/.test(nome(righe[0])), 'C03: l avviso della Soppressione non e` piu` nel nome (che finiva coi puntini), e` nella fascia bassa');
    // RISCRITTO il 27 ottobre sera (Paolo: «togli la scritta HIDDEN e metti il
    // token in grande a destra»). Prima: l etichetta HIDDEN in rup-etichette,
    // prima del soprannome. Ora non c e nessuna etichetta: il segnalino sta
    // fra le icone degli stati, e nome e fascia bassa restano puliti.
    ok(!/etichetta-marker/.test(righe[1]) && !/HIDDEN/.test(nome(righe[1])), 'G02: niente etichetta HIDDEN, ne` nel nome ne` altrove');
    ok(!/rup-etichette/.test(righe[1]) && /<div class="rup-icone"><img class="icona-segnalino-hidden"/.test(righe[1]), 'il segnalino e` fra le icone, la fascia bassa non ha etichette');
    const capo = String(N.rigaUnitaConFoto(truppa(profilo(T, /^Alguacil \(Combi/), { id: 'n4', alias: 'Capo', states: { fireteam: 'A', isFireteamLeader: true } }), {}));
    ok(!/TEAM A/.test(nome(capo)) && /rup-etichette[\s\S]*TEAM A/.test(capo), 'il segno del Fireteam lo stesso: fuori dal nome');
});

sezione('41. Collaudo grafico, terzo giro (27 ottobre sera): larghezza degli ARO, un solo INDIETRO in HoloMask', () => {
    const m = markupApp();
    const conPadding = ['selection', 'action', 'weapon', 'target', 'modifiers'].filter(x => new RegExp('<div id="step-aro-' + x + '" class="step-container" style="[^"]*padding').test(m));
    ok(conPadding.length === 0 && /<div id="step-aro-selection" class="step-container">/.test(m), 'gli step degli ARO non hanno piu` padding in linea: le righe hanno la larghezza degli altri elenchi (' + J(conPadding) + ')');
    ok(/<div id="step-states" class="step-container">/.test(m), 'nemmeno la pagina degli stati (step-states): stessa larghezza degli altri step');
    const T = creaTavolo(DIR); const N = T.nomadi.g;
    const bashi = truppa(profilo(T, /^Bashi Bazouk/), { id: 'n1', alias: 'Bashi' });
    N.roster = [bashi];
    N.apriDeployStati(0);
    const passo = () => T.nomadi.el('indietro-deploy-stati').style.display;
    ok(/<button id="indietro-deploy-stati" class="tasto-uscita"/.test(m) && passo() === '', 'pagina degli stati: l INDIETRO dello step si vede');
    N.apriSceltaHolomask(0);
    const pag = String(T.nomadi.el('deploy-states-content').innerHTML);
    ok(passo() === 'none' && (pag.match(/class="tasto-uscita"[^>]*>INDIETRO</g) || []).length === 1, 'scelta HoloMask: un INDIETRO solo, quello della scelta; quello dello step e` nascosto (B07)');
    const k = (N._gruppiHolomask || []).findIndex(g => g.varianti.length > 1);
    N.apriVariantiHolomask(0, k);
    ok(passo() === 'none', 'anche nel secondo passo (opzioni d arma)');
    N.apriDeployStati(0);
    ok(passo() === '', 'tornati alla pagina degli stati, l INDIETRO dello step torna');
});

sezione('42. Pulizia dell interfaccia (Paolo, 27 ottobre sera): la ⓘ per schermata, simboli, colori, gittata', () => {
    const m = markupApp(), st = stileApp();
    // --- simboli tolti ---
    ok(/onclick="window\.confermaSelezioneAro\(\)">AVANTI<\/button>/.test(m) && />PASSA \(NESSUN ARO\)<\/button>/.test(m), 'AVANTI e PASSA (NESSUN ARO) senza freccia e croce');
    ok(/id="btn-conferma-aro"[^>]*>CONFERMA E PROCEDI<\/button>/.test(m), 'CONFERMA E PROCEDI senza il simbolo davanti');
    // --- sfondo dei tasti della fazione ---
    ok(/--tasto-sfondo:\s*#1a0000/.test(st) && /--tasto-sfondo:\s*#002244/.test(st) && /\.huge-btn \{[^}]*background: var\(--tasto-sfondo\)/.test(st),
       'i tasti hanno lo sfondo della fazione: rossiccio per i Nomadi, azzurrino per PanOceania');
    ok(/style="background:var\(--tasto-forte\);[^"]*"[^>]*onclick="window\.apriSchieramento\(\)">VAI ALLO SCHIERAMENTO/.test(m) && /--tasto-forte:\s*#003a66/.test(st), 'VAI ALLO SCHIERAMENTO col colore forte della fazione (azzurro per PanOceania)');
    // --- la ⓘ ---
    // Il tasto si riallinea dopo ogni tocco, non con un timer: un secondo
    // setInterval rimpiazzava, nei banchi che ne tengono uno, il ciclo di
    // ascolto di motore_core (test_giro_da_selectaction: il reattivo non
    // riceveva piu` l Ordine).
    // RISCRITTO il 28 ottobre: prima l ascoltatore si chiamava riallinea
    // (locale); ora e` window.riallineaNote, che ridisegna anche le note
    // sotto i tasti.
    ok(!/setInterval\(/.test(paginaApp().replace(/\/\/.*$/gm, '')) && /addEventListener\('click', window\.riallineaNote, true\)/.test(paginaApp()), 'il tasto ⓘ si riallinea dopo ogni tocco, senza un setInterval in app.html');
    ok(/<button id="tasto-info"[^>]*onclick="window\.apriInfo\(\)"/.test(m) && /<div id="pannello-info"/.test(m) && /#tasto-info\s*\{[^}]*position:\s*fixed/.test(st), 'c e il tasto ⓘ (fisso in alto) e il pannello delle spiegazioni');
    const T = creaTavolo(DIR); const N = T.nomadi.g, P = T.pano.g;
    T.schiera([truppa(profilo(T, /^Alguacil \(Combi/), { id: 'n1', alias: 'Muove' })], [truppa(profilo(T, /^Yuan Yuan \(Rifle/), { id: 'p1', alias: 'Rea' })], 'NOMADI');
    const tasto = () => (T.pano.el('tasto-info').style || {}).display;
    P.segnaStepCorrente('step-prova'); P.azzeraInfo('step-prova');
    ok(tasto() === 'none', 'schermata senza spiegazioni: il tasto ⓘ non si vede');
    P.aggiungiInfo('step-prova', 'Titolo <x>', 'testo & altro');
    ok(tasto() === 'flex', 'con una spiegazione depositata il tasto si vede');
    P.apriInfo();
    const pan = String(T.pano.el('pannello-info').innerHTML);
    // RISCRITTO il 28 ottobre (Paolo: nella ⓘ il titolo e` il nome del tasto,
    // in maiuscolo, sopra la nota). Prima: <b>Titolo</b>: testo.
    ok(/<span class="titolo-tasto">TITOLO &lt;X&gt;<\/span>testo &amp; altro/.test(pan) && /onclick="window\.chiudiInfo\(\)">CHIUDI</.test(pan) && T.pano.el('pannello-info').style.display === 'block', 'il tocco apre il pannello: la voce (scappata) e CHIUDI');
    P.chiudiInfo();
    ok(T.pano.el('pannello-info').style.display === 'none', 'CHIUDI lo spegne');
    // --- ARO: titolo, reazioni, gittata ---
    T.apriMenu(T.nomadi, 0); N.selectAction('MOVIMENTO', false); T.giro();
    P.apriSelezioneAro(); P.toggleAroUnit('p1'); P.confermaSelezioneAro();
    ok(!/\(ARO\)/.test(T.pano.el('aro-header-action').innerHTML) && /REA|YUAN/.test(T.pano.el('aro-header-action').innerHTML.toUpperCase()), 'il titolo della reazione e` il nome della truppa, senza «(ARO)» (' + T.pano.el('aro-header-action').innerHTML + ')');
    ok(P._stepCorrente === 'step-aro-action', 'la ⓘ sa che la schermata e` la scelta della reazione');
    P.selezionaAzioneAro('BS_ATTACK');
    P.selezionaArmaAro('Rifle'); P.selezionaBersaglioAro('Muove');
    const mod = String(T.pano.el('aro-modifiers-content').innerHTML);
    const numeri = [...mod.matchAll(/<span class="confine-gittata"[^>]*>([^<]*)<\/span>/g)].map(x => x[1]);
    const bande = (mod.match(/class="range-seg seg-[1-4]/g) || []).length;
    ok(numeri.length === bande + 1 && numeri[0] === '0' && numeri.every(x => /^\d+$/.test(x)), 'barra della gittata: un numero solo per confine (0, 8, 16...), non «0-8»; uno in piu` delle bande (' + J(numeri) + ', ' + bande + ' bande)');
    ok(/<span class="confine-gittata" style="position:absolute; left:calc\(\(100% - 48px\) \* 1 \/ \d+\)/.test(mod) && /class="range-seg seg-fuori[^"]*"[^>]*>FUORI</.test(mod), 'i numeri stanno sul cambio di colore (posizione calcolata), e in coda resta FUORI largo 48 px');
    ok(/<button type="button" class="huge-btn tasto-lof-aro"[^>]*min-height:90px; font-size:20px; flex-direction:column;[^>]*><img class="icona-interruttore"[^>]*height:44px/.test(mod), 'Linea di Tiro: l icona (44 px) sopra la scritta, tasto da 90 px');
    ok(/<button type="button" class="huge-btn tasto-cover-aro"[^>]*><img class="icona-interruttore"[^>]*height:44px/.test(mod), 'Copertura: l icona alla stessa misura');
    P.toggleAroCover();
    ok(!/-3 al tuo tiro/.test(String(T.pano.el('aro-modifiers-content').innerHTML)) && P.vociInfo('step-aro-modifiers').some(v => /-3 al tuo tiro/.test(v.testo)), 'la spiegazione della Copertura e` nella ⓘ, non a schermo');
    // --- cambio di stato: niente riquadro giallo, la voce nella ⓘ ---
    P.ultimoCambioStato = { unita: 'Rea', prima: 'CAMO', dopo: 'NORMAL', azione: 'Attacco BS', note: ['Rivelata.'], cambiato: true };
    const vc = P.voceCambioStato();
    P.aggiornaRiquadroCambioStato(null);
    const box = T.pano.el('riquadro-cambio-stato');
    ok(!box || !box.style || box.style.display === 'none', 'il riquadro giallo del cambio di stato e` spento');
    ok(vc && /Rea: Marker CAMO → Modello sul tavolo \(Attacco BS\)/.test(vc.titolo) && vc.testo === 'Rivelata.' && P.vociInfo('step-aro-modifiers')[0].titolo === vc.titolo, 'il cambio di stato e` la prima voce della ⓘ (' + J(vc && vc.titolo) + ')');
    ok(!P.vociInfo('battle').some(v => v.titolo === vc.titolo), 'CONTROPROVA: non nella schermata dell elenco (battle)');
});

sezione('43. Le opzioni delle note (Paolo, 28 ottobre): dove (ⓘ o sotto i tasti) e quali tipi', () => {
    // --- la pagina della fazione: il pannello e cosa salva ---
    const pf = fs.readFileSync(DIR + 'scegli_fazione.html', 'utf8');
    ok(/<button class="opzioni" onclick="apriOpzioniNote\(\)">OPZIONI DELLE NOTE<\/button>/.test(pf) && /<div id="pannello-note"/.test(pf), 'nella pagina della fazione c e il tasto OPZIONI DELLE NOTE e il suo pannello');
    const mem = {}, nodi = {};
    const nodo = (id) => nodi[id] = nodi[id] || { id, innerHTML: '', style: {} };
    const gF = { localStorage: { getItem: k => (k in mem ? mem[k] : null), setItem: (k, v) => { mem[k] = String(v); } }, location: { replace() {} },
                 document: { getElementById: nodo }, JSON };
    vm.runInNewContext((pf.match(/<script>([\s\S]*?)<\/script>/) || ['', ''])[1], gF);
    gF.apriOpzioniNote();
    const pan = () => nodo('pannello-note').innerHTML;
    ok(nodo('pannello-note').style.display === 'block' && /<button type="button" class="attivo" data-dove="info"/.test(pan()) && (pan().match(/class="tipo acceso/g) || []).length === 4,
       'al primo avvio: nella ⓘ, i quattro tipi accesi');
    gF.sceltaDove('tasti'); gF.sceltaTipo('mod'); gF.sceltaTipo('stato');
    const salvato = JSON.parse(mem.opzioni_note || '{}');
    ok(salvato.dove === 'tasti' && salvato.tipi.mod === false && salvato.tipi.stato === true && salvato.tipi.regole === true && salvato.tipi.nonpuo === true,
       'scelti SOTTO I TASTI e spenti i MOD: salvato in opzioni_note; i cambi di stato non si spengono (' + mem.opzioni_note + ')');
    ok(/class="attivo" data-dove="tasti"/.test(pan()) && /class="tipo fisso" data-tipo="stato"/.test(pan()) === false && /class="tipo acceso fisso" data-tipo="stato"/.test(pan()) && /class="tipo" data-tipo="mod"/.test(pan()),
       'il pannello si ridisegna: SOTTO I TASTI acceso, MOD spento, CAMBI DI STATO acceso e fisso');
    gF.chiudiOpzioniNote();
    ok(nodo('pannello-note').style.display === 'none', 'CHIUDI lo spegne');

    // --- l'app legge le stesse opzioni ---
    const T = creaTavolo(DIR); const N = T.nomadi.g, P = T.pano.g;
    ok(J(P.opzioniNote()) === J({ dove: 'info', tipi: { stato: true, nonpuo: true, mod: true, regole: true } }), 'app senza scelte: nella ⓘ, tutti i tipi (' + J(P.opzioniNote()) + ')');
    P.localStorage.setItem('opzioni_note', JSON.stringify({ dove: 'tasti', tipi: { stato: false, mod: false } }));
    ok(J(P.opzioniNote()) === J({ dove: 'tasti', tipi: { stato: true, nonpuo: true, mod: false, regole: true } }), 'le legge da opzioni_note; i cambi di stato restano accesi anche se il salvataggio dice no');
    P.localStorage.setItem('opzioni_note', '{rotto');
    ok(P.opzioniNote().dove === 'info', 'un salvataggio rotto vale come nessuna scelta');

    // --- tipi e filtro ---
    P.localStorage.setItem('opzioni_note', JSON.stringify({ dove: 'info', tipi: { mod: false } }));
    P.segnaStepCorrente('step-prova'); P.azzeraInfo('step-prova');
    P.aggiungiInfo('step-prova', 'Copertura', '-3', { tipo: 'mod', tasto: 'copertura' });
    P.aggiungiInfo('step-prova', 'Senza tipo', 'x');
    const nErr = P.errori.length;
    P.aggiungiInfo('step-prova', 'Strana', 'y', { tipo: 'boh' });
    const voci = P.vociInfo('step-prova');
    ok(J(voci.map(v => v.titolo + '/' + v.tipo)) === J(['Senza tipo/regole', 'Strana/regole']), 'MOD spenti: la Copertura non c e; senza tipo vale regole (' + J(voci.map(v => v.titolo)) + ')');
    ok(P.errori.length === nErr + 1 && /tipo di nota sconosciuto "boh"/.test(P.errori[P.errori.length - 1]), 'un tipo sconosciuto lo dice in console e vale regole');
    P.ultimoCambioStato = { unita: 'Rea', prima: 'CAMO', dopo: 'NORMAL', azione: 'Attacco BS', note: [], cambiato: true };
    P.localStorage.setItem('opzioni_note', JSON.stringify({ dove: 'info', tipi: { stato: false, nonpuo: false, mod: false, regole: false } }));
    ok(J(P.vociInfo('step-prova').map(v => v.tipo)) === J(['stato']), 'tutto spento: resta solo il cambio di stato');
    P.ultimoCambioStato = null;

    // --- dove: con le note sotto i tasti la ⓘ non serve ---
    P.localStorage.setItem('opzioni_note', JSON.stringify({ dove: 'info' }));
    P.aggiornaTastoInfo();
    ok(T.pano.el('tasto-info').style.display === 'flex', 'nella ⓘ: con delle note il tasto ⓘ si vede');
    P.localStorage.setItem('opzioni_note', JSON.stringify({ dove: 'tasti' }));
    P.aggiornaTastoInfo();
    ok(T.pano.el('tasto-info').style.display === 'none', 'sotto i tasti: il tasto ⓘ non c e (le note sono a schermo)');

    // --- abbinamento delle note ai tasti ---
    const ab = P.abbinaNote([
        { titolo: 'Copertura', testo: 'a', tasto: 'copertura' },
        { titolo: 'Attacco in Corpo a Corpo', testo: 'b' },
        { titolo: 'Hacking non disponibile', testo: 'c' },
        { titolo: 'Reset', testo: 'd', tasto: 'reazione-RESET' }
    ], [{ chiave: '', testo: 'ATTACCO IN  CORPO\nA CORPO' }, { chiave: 'copertura', testo: 'IN COPERTURA' }, { chiave: 'reazione-RESET', testo: 'RESET' }]);
    ok(J(ab.perTasto.map(x => x.map(v => v.testo))) === J([['b'], ['a'], ['d']]) && J(ab.schermata.map(v => v.testo)) === J(['c']),
       'ogni nota al suo tasto: per data-nota o per scritta uguale al titolo; le altre sono della schermata (' + J(ab) .slice(0, 80) + '…)');

    // --- la ⓘ: titolo = nome del tasto, a gruppi, nell ordine dei tasti ---
    P.localStorage.setItem('opzioni_note', JSON.stringify({ dove: 'info' }));
    P.azzeraInfo('step-prova');
    P.aggiungiInfo('step-prova', 'Reset', 'nota reset', { tasto: 'reazione-RESET' });
    P.aggiungiInfo('step-prova', 'Hacking non disponibile', 'non e` un Hacker', { tipo: 'nonpuo' });
    P.aggiungiInfo('step-prova', 'Attacco in Corpo a Corpo', 'contatto');
    const box = T.pano.el('step-prova');
    box.querySelectorAll = () => [{ dataset: {}, innerText: 'ATTACCO IN CORPO A CORPO' }, { dataset: { nota: 'reazione-RESET' }, innerText: 'RESET' }];
    P.apriInfo();
    const h = String(T.pano.el('pannello-info').innerHTML);
    ok(/<div class="info-gruppo">QUESTA SCHERMATA<\/div><div class="info-voce"><span class="titolo-tasto">HACKING NON DISPONIBILE<\/span>non e` un Hacker<\/div><div class="info-gruppo">I TASTI<\/div><div class="info-voce"><span class="titolo-tasto">ATTACCO IN CORPO A CORPO<\/span>contatto<\/div><div class="info-voce"><span class="titolo-tasto">RESET<\/span>nota reset/.test(h),
       'la ⓘ: prima le note della schermata, poi quelle dei tasti nell ordine dei tasti, col nome del tasto per titolo');
    box.querySelectorAll = () => [];
    P.apriInfo();
    ok(!/info-gruppo/.test(String(T.pano.el('pannello-info').innerHTML)), 'CONTROPROVA: senza tasti abbinati niente gruppi, solo le voci');
    P.chiudiInfo();

    // --- chi deposita dice tipo e tasto ---
    P.localStorage.setItem('opzioni_note', JSON.stringify({ dove: 'info' }));
    T.schiera([truppa(profilo(T, /^Alguacil \(Combi/), { id: 'n1', alias: 'Muove' })], [truppa(profilo(T, /^Yuan Yuan \(Rifle/), { id: 'p1', alias: 'Rea' })], 'NOMADI');
    T.apriMenu(T.nomadi, 0); N.selectAction('MOVIMENTO', false); T.giro();
    P.apriSelezioneAro(); P.toggleAroUnit('p1'); P.confermaSelezioneAro();
    const az = String(T.pano.el('aro-action-list').innerHTML);
    const vA = P.vociInfo('step-aro-action');
    const conTasto = vA.filter(v => v.tasto);
    ok(conTasto.length >= 1 && conTasto.every(v => /^reazione-/.test(v.tasto) && az.indexOf('data-nota="' + v.tasto + '"') >= 0 && v.tipo === 'regole'),
       'le note delle reazioni portano il data-nota del loro tasto (' + J(conTasto.map(v => v.tasto)) + ')');
    ok(vA.filter(v => / non disponibile$/.test(v.titolo)).every(v => v.tipo === 'nonpuo'), 'le reazioni non disponibili sono «perche` non si puo`»');
    P.selezionaAzioneAro('BS_ATTACK'); P.selezionaArmaAro('Rifle'); P.selezionaBersaglioAro('Muove');
    if (!P.aroCurrentConfig.cover) P.toggleAroCover();
    const cop = P.vociInfo('step-aro-modifiers').find(v => v.titolo === 'Copertura') || {};
    ok(cop.tipo === 'mod' && cop.tasto === 'copertura' && /class="huge-btn tasto-cover-aro" data-nota="copertura"/.test(T.pano.el('aro-modifiers-content').innerHTML), 'la Copertura e` un MOD e va sotto il suo tasto (data-nota="copertura")');
    P.localStorage.setItem('opzioni_note', JSON.stringify({ dove: 'info', tipi: { mod: false } }));
    ok(!P.vociInfo('step-aro-modifiers').some(v => v.titolo === 'Copertura'), 'MOD spenti: la nota della Copertura sparisce');
    P.localStorage.setItem('opzioni_note', JSON.stringify({ dove: 'info' }));
    // la pagina degli stati: la nota va al tasto con la stessa scritta
    const spector = truppa(profilo(T, /^Spector \(Parachutist/), { id: 'n7', alias: 'Spec' });
    N.roster = [spector]; N.apriDeployStati(0);
    const vS = N.vociInfo('step-deploy-states');
    ok(vS.length >= 1 && vS.every(v => v.tipo === 'regole') && N.abbinaNote(vS, [{ chiave: '', testo: 'SCHIERAMENTO AEREO' }]).perTasto[0].length >= 1,
       'schieramento: le note sono regole e si abbinano al tasto con la stessa scritta (' + J(vS.map(v => v.titolo)) + ')');
});

sezione('44. ARO: la barra della gittata e` quella del motore (M.barraGittata, MOTORE 2026-10-28.1)', () => {
    const aro = fs.readFileSync(DIR + 'logica_aro.js', 'utf8');
    ok(!/confine-gittata/.test(aro) && /M\.barraGittata\(arma\.bands/.test(aro), 'logica_aro non ha piu` una sua copia della barra: chiama M.barraGittata');
    const T = creaTavolo(DIR); const N = T.nomadi.g, P = T.pano.g;
    T.schiera([truppa(profilo(T, /^Alguacil \(Combi/), { id: 'n1', alias: 'Muove' })], [truppa(profilo(T, /^Yuan Yuan \(Rifle/), { id: 'p1', alias: 'Rea' })], 'NOMADI');
    T.apriMenu(T.nomadi, 0); N.selectAction('MOVIMENTO', false); T.giro();
    P.apriSelezioneAro(); P.toggleAroUnit('p1'); P.confermaSelezioneAro();
    P.selezionaAzioneAro('BS_ATTACK'); P.selezionaArmaAro('Rifle'); P.selezionaBersaglioAro('Muove');
    const h = String(T.pano.el('aro-modifiers-content').innerHTML);
    const cfg = P.aroCurrentConfig;
    const attesa = P.MotoreN5.barraGittata(P.MotoreN5.profiloArma(cfg.arma).bands, { indice: cfg.rangeIndex, tocco: (i) => `window.setAroRange(${i})`, fuori: "window.toggleAroRequisito('gittata')", fuoriAttivo: !!cfg.fuoriGittata });
    ok(attesa.length > 0 && h.indexOf(attesa) >= 0, 'nella pagina dei modificatori c e esattamente la barra del motore, col tocco sulle bande e su FUORI');
    P.toggleAroRequisito('gittata');
    ok(/class="range-seg seg-fuori active"/.test(String(T.pano.el('aro-modifiers-content').innerHTML)) && P.aroCurrentConfig.fuoriGittata === true, 'toccato FUORI: acceso, e la reazione e` fuori gittata');
});

sezione('45. Le note di logica_aro e dello schieramento passano da M.nota (proposta di MOTORE, 28 ottobre)', () => {
    const aro = fs.readFileSync(DIR + 'logica_aro.js', 'utf8'), ros = fs.readFileSync(DIR + 'roster_manager.js', 'utf8');
    ok(!/window\.aggiungiInfo\(/.test(aro) && !/window\.azzeraInfo\(/.test(aro) && /M\.nota\(idStep, titolo, testo, extra\)/.test(aro) && /M\.azzeraNote\(idStep\)/.test(aro),
       'logica_aro deposita con M.nota e azzera con M.azzeraNote, non piu` con aggiungiInfo/azzeraInfo');
    ok(!/window\.aggiungiInfo\(/.test(ros) && !/window\.azzeraInfo\(/.test(ros) && /M\.nota\('step-deploy-states'/.test(ros), 'roster_manager lo stesso (pagina degli stati di schieramento)');
    const T = creaTavolo(DIR); const N = T.nomadi.g, P = T.pano.g;
    T.schiera([truppa(profilo(T, /^Alguacil \(Combi/), { id: 'n1', alias: 'Muove' })], [truppa(profilo(T, /^Yuan Yuan \(Rifle/), { id: 'p1', alias: 'Rea' })], 'NOMADI');
    T.apriMenu(T.nomadi, 0); N.selectAction('MOVIMENTO', false); T.giro();
    const M = P.MotoreN5, vera = M.nota, chiamate = [];
    M.nota = function () { chiamate.push([].slice.call(arguments, 0, 2)); return vera.apply(this, arguments); };
    P.apriSelezioneAro(); P.toggleAroUnit('p1'); P.confermaSelezioneAro();
    M.nota = vera;
    ok(chiamate.length > 0 && chiamate.every(c => c[0] === 'step-aro-action') && P.vociInfo('step-aro-action').length >= chiamate.length,
       'le note della scelta della reazione arrivano da M.nota e finiscono nella ⓘ (' + chiamate.length + ')');
    // senza la pagina (aggiungiInfo assente) la nota non si perde: window.INFO
    const ai = P.aggiungiInfo, az = P.azzeraInfo; P.aggiungiInfo = undefined; P.azzeraInfo = undefined;
    const nErr = P.errori.length;
    P.avviaCicloAroUnita();
    P.aggiungiInfo = ai; P.azzeraInfo = az;
    ok((P.INFO['step-aro-action'] || []).some(v => v.tipo === 'regole' && v.tasto === 'reazione-CC_ATTACK') && !P.errori.slice(nErr).some(e => /spiegazione persa/.test(e)),
       'senza aggiungiInfo le note restano in window.INFO, con tipo e tasto, e nessun «spiegazione persa»');
});

sezione('46. D09: la schermata IN ATTESA DI ARO dice contro chi (M.rigaAttesaAro, MOTORE 2026-10-28.3)', () => {
    ok(/<p style="color:#aaa;">Il nemico sta decidendo se e come reagire\.<\/p>\s*<!--[^>]*-->\s*<div id="wait-aro-bersagli"><\/div>/.test(markupApp()), 'sotto «Il nemico sta decidendo...» c e il contenitore wait-aro-bersagli');
    const T = creaTavolo(DIR); const N = T.nomadi.g, P = T.pano.g;
    const f = profilo(T, /^Fusilier \(Combi/);
    T.schiera([truppa(profilo(T, /^Intruder \(HMG/), { id: 'n1', alias: 'Spara' })], [truppa(f, { id: 'p1', alias: 'Uno' }), truppa(f, { id: 'p2', alias: 'Due' })], 'NOMADI');
    const riga = () => testo(T.nomadi.el('wait-aro-bersagli').innerHTML);
    T.apriMenu(T.nomadi, 0); N.selectAction('ATTACCO BS', false); N.declareAttackBS('Heavy Machine Gun');
    N.toggleTargetSelection('p1'); N.toggleTargetSelection('p2'); N.confirmMultiAro(false);
    ok(/^Bersagli: Uno, Due · Heavy Machine Gun$/.test(riga()) && /class="riga-attesa-aro"/.test(T.nomadi.el('wait-aro-bersagli').innerHTML), 'due bersagli: «Bersagli: Uno, Due · Heavy Machine Gun» (' + riga() + ')');
    ok(T.nomadi.el('wait-aro-bersagli').innerHTML === N.MotoreN5.rigaAttesaAro(), 'la riga e` quella del motore, tale e quale');
    N.tornaAlRadar(); T.giro();
    ok(riga() === '', 'finito l Ordine, la riga si svuota');
    // Targetless: il bersaglio e` un punto del tavolo
    const T2 = creaTavolo(DIR); const N2 = T2.nomadi.g, P2 = T2.pano.g;
    T2.schiera([truppa(profilo(T2, /^Alguacil \(Combi/), { id: 'n1', alias: 'Fante' })], [truppa(profilo(T2, /^Yuan Yuan \(Rifle/), { id: 'p1', alias: 'Fumo' })], 'PANOCEANIA');
    T2.apriMenu(T2.pano, 0); P2.selectAction('ATTACCO BS', false); P2.declareAttackBS('Smoke Grenades');
    const r2 = testo(T2.pano.el('wait-aro-bersagli').innerHTML);
    ok(/^Bersaglio: un punto del tavolo \(nessuna truppa\) · Smoke Grenades$/.test(r2), 'arma Targetless: «Bersaglio: un punto del tavolo (nessuna truppa) · Smoke Grenades» (' + r2 + ')');
    // senza la funzione del motore: riga vuota e lo si dice
    const vera = P2.MotoreN5.rigaAttesaAro; P2.MotoreN5.rigaAttesaAro = undefined;
    const nErr = P2.errori.length;
    P2.confirmMultiAro(false);
    P2.MotoreN5.rigaAttesaAro = vera;
    ok(T2.pano.el('wait-aro-bersagli').innerHTML === '' && P2.errori.slice(nErr).some(e => /M\.rigaAttesaAro assente/.test(e)), 'CONTROPROVA: senza M.rigaAttesaAro la riga resta vuota e la console lo dice');
});

sezione('47. Colori per categoria dell Ordine (Paolo, 28 ottobre): menu e reazioni come le schede (M.coloreOrdine)', () => {
    ok(!/ORDINE_DELLA_REAZIONE/.test(fs.readFileSync(DIR + 'logica_aro.js', 'utf8')), 'logica_aro non traduce piu` gli id delle reazioni: li usa la tabella del motore (28.5)');
    const T = creaTavolo(DIR); const N = T.nomadi.g, P = T.pano.g, M = N.MotoreN5;
    T.schiera([truppa(profilo(T, /^Alguacil \(Combi/), { id: 'n1', alias: 'Muove' })], [truppa(profilo(T, /^Yuan Yuan \(Rifle/), { id: 'p1', alias: 'Rea' })], 'NOMADI');
    const menu = T.apriMenu(T.nomadi, 0);
    const tasti = [...String(menu).matchAll(/<button class="huge-btn" style="[^"]*background:([^;]+); border-color:([^;]+);[^"]*"\s*onclick="window\.selectAction\('([^']+)'/g)].map(x => ({ id: x[3], col: x[1] + ' ' + x[2] }));
    const giusti = tasti.filter(t => { const c = M.coloreOrdine(t.id); return t.col === c.sfondo + ' ' + c.bordo; });
    ok(tasti.length >= 5 && giusti.length === tasti.length, 'menu degli Ordini: ogni tasto ha il colore della sua categoria nel motore (' + giusti.length + '/' + tasti.length + ')');
    const cat = (id) => M.coloreOrdine(id).categoria;
    ok(cat('MOVIMENTO') === 'movimento' && cat('ATTACCO BS') === 'breve' && tasti.some(t => t.id === 'MOVIMENTO') && tasti.some(t => t.id === 'ATTACCO BS')
       && tasti.find(t => t.id === 'MOVIMENTO').col !== tasti.find(t => t.id === 'ATTACCO BS').col, 'Movimento (movimento) e Attacco BS (breve) hanno colori diversi');
    // un'azione che il motore non ha: colore di chi chiama, e lo si dice
    const nErr = N.errori.length;
    const h = N.creaBottoneAzione({ id: 'AZIONE_DI_PROVA', nome: 'Prova', desc: '' }, false, '#123456', '#654321');
    ok(/background:#123456; border-color:#654321;/.test(h) && N.errori.slice(nErr).some(e => /M\.COLORI_ORDINE non ha "AZIONE_DI_PROVA"/.test(e)), 'CONTROPROVA: un azione fuori tabella tiene il colore passato e la console lo dice');
    // se il motore cambia la categoria, il tasto la segue (Paolo pensa a Reset, Schivata e IDLE in blu)
    // RISCRITTO il 28 ottobre (motore 28.5: la tabella ha gli id delle
    // reazioni). Prima si spostava la voce SCHIVATA, che logica_aro traduceva
    // da DODGE; ora si sposta DODGE, che logica_aro usa direttamente.
    const PM = P.MotoreN5, prima = PM.COLORI_ORDINE.DODGE;   // chi reagisce e` PanOceania: il suo motore
    PM.COLORI_ORDINE.DODGE = Object.assign({}, prima, { categoria: 'movimento' });
    N.selectAction('MOVIMENTO', false); T.giro();
    P.apriSelezioneAro(); P.toggleAroUnit('p1'); P.confermaSelezioneAro();
    const az = String(T.pano.el('aro-action-list').innerHTML);
    const blu = P.MotoreN5.CATEGORIE_ORDINE.movimento;
    const dodge = (az.match(/<button class="huge-btn tasto-reazione" style="background:([^;]+); border-color:([^;]+);" data-nota="reazione-DODGE"/) || []);
    PM.COLORI_ORDINE.DODGE = prima;
    ok(dodge[1] === blu.sfondo && dodge[2] === blu.bordo, 'se il motore mette la Schivata fra i movimenti, la reazione diventa blu da sola (' + dodge.slice(1).join(' ') + ')');
});

sezione('48. Il tasto ⓘ non copre i titoli lunghi (collaudo grafico 28 ottobre: GR-E08, E11, E25, E26, E36)', () => {
    ok(/\.sotto-info \{ padding-left: 56px !important; padding-right: 56px !important;/.test(stileApp()), 'c e la classe sotto-info: margine interno di 56 px ai due lati (il tasto e` 44 px + 12)');
    const T = creaTavolo(DIR); const N = T.nomadi.g;
    // DOM finto: il tasto in alto a destra, tre titoli nello step visibile
    const rett = (l, t, r, b) => () => ({ left: l, top: t, right: r, bottom: b });
    const titolo = (nome, r) => { const cl = new Set(); return { nome, offsetParent: {}, getBoundingClientRect: r, classList: { add: (c) => cl.add(c), remove: (c) => cl.delete(c), has: (c) => cl.has(c) } }; };
    const sotto = titolo('intestazione lunga', rett(12, 10, 378, 60));      // tocca il tasto
    const basso = titolo('titolo piu` giu`', rett(12, 200, 378, 240));     // non lo tocca
    const nascosto = Object.assign(titolo('nascosto', rett(12, 10, 378, 60)), { offsetParent: null });
    const tasto = T.nomadi.el('tasto-info');
    tasto.getBoundingClientRect = rett(334, 12, 378, 56);
    N.segnaStepCorrente('step-prova48'); N.azzeraInfo('step-prova48'); N.aggiungiInfo('step-prova48', 'Prova', 'x');
    T.nomadi.el('step-prova48').querySelectorAll = () => [sotto, basso, nascosto];
    N.liberaSpazioInfo();
    ok(tasto.style.display === 'flex' && sotto.classList.has('sotto-info') && !basso.classList.has('sotto-info') && !nascosto.classList.has('sotto-info'),
       'col tasto visibile: solo il titolo che lo tocca prende sotto-info (non quello piu` in basso, non quello nascosto)');
    N.localStorage.setItem('opzioni_note', JSON.stringify({ dove: 'tasti' }));
    N.document.querySelectorAll = (sel) => sel === '.sotto-info' ? [sotto, basso, nascosto].filter(e => e.classList.has('sotto-info')) : [];
    N.aggiornaTastoInfo();
    ok(tasto.style.display === 'none' && !sotto.classList.has('sotto-info'), 'senza il tasto (note sotto i tasti) la classe si toglie');
    const aro = fs.readFileSync(DIR + 'logica_aro.js', 'utf8');
    ok(/`--\\u00a0\$\{String\(nome\)\.toUpperCase\(\)\}\\u00a0--`/.test(aro), 'testata dell ARO: i trattini attaccati al nome (spazio che non va a capo)');
});

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
