// @versione 2026-10-07.1 | test_giro_aggiornamento.js | proprieta`: chat INTERFACCIA
// ============================================================================
//  IL GIRO DELL'AGGIORNAMENTO: app attiva -> Hub -> app avversaria.
//
//  Chiesto da MOTORE e deciso da Paolo il 6 ottobre. INTERFACCIA aveva
//  misurato questi valori a mano, col giro a tre dispositivi veri, e li
//  aveva dichiarati NON coperti da nessun banco: test_sostituzione_unita.js
//  conta la CHIAMATA a window.inviaSchieramentoAllHub, non l'arrivo.
//  La differenza non e` accademica — e` il difetto che INTERFACCIA ha chiuso
//  il 6 ottobre: il roster di chi agiva cambiava, e Hub e avversario
//  restavano allo stato vecchio. Una chiamata partita e un dato arrivato
//  sono due fatti diversi, e solo il secondo e` quello che il giocatore
//  vede dall'altra parte del tavolo.
//
//  TRE CONTESTI, come i tre dispositivi: app NOMADI, Hub, app PANOCEANIA.
//  Ognuno con il suo localStorage; in mezzo un finto Firebase che REGISTRA
//  (il `transito`). Si guarda chi ha scritto cosa, non lo stato finale: le
//  app consumano i canali e la cancellazione torna indietro, percio` lo
//  stato finale direbbe "non e` mai passato" proprio perche` e` arrivato.
//  Intelaiatura presa da test_giro_ritorno.js, che questo giro lo fa gia`
//  per l'allarme; qui si carica l'INTERA pagina di ogni dispositivo, perche`
//  dichiaraRequisitoFallito sta in app.html e selezionaArmaAro in
//  logica_aro.js, non nel motore.
//
//  IL GIRO VERO, per chi legge: ogni app scrive il proprio roster su
//  canale_setup_<fazione>; l'Hub li legge entrambi, costruisce gameState e
//  lo ripubblica su global_game_state; ogni app rilegge quello per sapere
//  che cosa ha davanti. Tre passaggi, e basta che se ne rompa uno perche`
//  l'avversario veda una truppa che non c'e` piu`.
//
//  USO:  node test_giro_aggiornamento.js  |  CARTELLA=/percorso/ node ...
// ============================================================================
const DIR = (process.env.CARTELLA || (__dirname + '/')).replace(/\/?$/, '/');
const fs = require('fs'), vm = require('vm');

let passati = 0, falliti = 0;
const J = JSON.stringify;
function ok(c, d, visto) {
    if (c) { passati++; console.log('  ✓ ' + d); }
    else { falliti++; console.log('  ✗ ' + d + (visto !== undefined ? '  [visto: ' + J(visto) + ']' : '')); }
}
if (!fs.existsSync(DIR + 'app.html')) {
    console.log('  ✗ app.html non trovato in ' + DIR + ' (imposta CARTELLA=/percorso/)');
    console.log('\n0 passati, 1 falliti');
    process.exit(1);
}

// --- il server in mezzo, e il registro di cosa passa ---
const server = {};
const dispositivi = [];
const transito = [];
function recapita(da, chiave, valore) {
    if (valore === null) delete server[chiave]; else server[chiave] = valore;
    // Si registra anche il VALORE scritto. Rileggere il canale dopo darebbe
    // l'ULTIMO messaggio passato da li`, non quello che si sta cercando: in
    // un Ordine in due meta` sullo stesso canale passano due allarmi, e il
    // secondo copre il primo. (Stessa lezione di test_giro_ritorno.js.)
    transito.push({ da: da.nome, chiave: chiave, vuoto: valore === null,
                    valore: valore, quando: transito.length });
    dispositivi.forEach(d => { if (d !== da) d.riceve(chiave, valore); });
}
const scrittoDa = (chiave, da, dal) => transito.some(t =>
    t.chiave === chiave && !t.vuoto && (!da || t.da === da) && (dal == null || t.quando >= dal));

const nonCaricati = [], assenti = [];

function avvia(nome, titolo, pagina, fazione) {
    const memoria = {};
    const g = { console: { log: () => {}, warn: () => {}, error: () => {} } };
    g.window = g; g.globalThis = g;
    const nodi = {};
    const nodo = (id) => {
        if (!nodi[id]) nodi[id] = { id: id, innerHTML: '', innerText: '', value: '', checked: false,
            style: {}, options: [], dataset: {},
            appendChild() {}, removeChild() {}, remove() {}, addEventListener() {},
            setAttribute() {}, getAttribute() { return null; },
            classList: { add() {}, remove() {}, contains() { return false; }, toggle() {} },
            cloneNode() { return nodo(id + '_c'); },
            parentNode: { replaceChild() {}, insertBefore() {}, removeChild() {} },
            querySelector() { return null; }, querySelectorAll() { return []; } };
        return nodi[id];
    };
    let titoloVivo = titolo;
    g.document = {
        get title() { return titoloVivo; }, set title(v) { titoloVivo = v; },
        getElementById: nodo, createElement: () => nodo('nuovo'),
        querySelector: () => nodo('q'), querySelectorAll: () => [],
        addEventListener() {}, write() {}, body: nodo('body'),
        documentElement: { setAttribute() {} }, scripts: [], readyState: 'complete'
    };
    g.alert = (m) => { g.ultimoAlert = m; };
    g.confirm = () => true;
    // Il prompt risponde una STRINGA, non null: dichiaraRequisitoFallito
    // chiede il motivo con prompt() e, su null (cioe` "Annulla"), esce
    // subito senza fare niente. Con `() => null` la prova misurava un
    // giocatore che preme Annulla, non uno che dichiara l'Idle — e usciva
    // "l AGGIORNAMENTO non parte" sul codice che funziona.
    g.prompt = () => 'motivo di prova';
    g.scrollTo = () => {};
    g._cicli = [];
    g.setInterval = (fn) => { g._cicli.push(fn); return g._cicli.length; };
    g.setTimeout = (fn) => { if (typeof fn === 'function') fn(); return 0; };
    g.clearInterval = () => {}; g.clearTimeout = () => {};
    g._storage = null;
    g.addEventListener = (tipo, fn) => { if (tipo === 'storage') g._storage = fn; };
    g.history = { pushState() {}, replaceState() {} };
    g.navigator = {};
    g.Event = function (tipo) { this.type = tipo; };
    g.dispatchEvent = (ev) => { if (g._storage) g._storage(ev); };
    g.location = { search: fazione ? ('?fazione=' + fazione) : '', replace() {}, href: '' };
    g.localStorage = {
        getItem: k => (k in memoria ? memoria[k] : null),
        setItem: (k, v) => { memoria[k] = String(v); },
        removeItem: k => { delete memoria[k]; }
    };
    const ascolti = {};
    const dispositivo = { nome: nome, g: g, memoria: memoria };
    dispositivo.riceve = (k, v) => {
        if (ascolti[k]) { ascolti[k]({ val: () => v }); return; }
        if (v === null) delete memoria[k]; else memoria[k] = v;
        if (g._storage) g._storage({ key: k, newValue: v });
    };
    g.firebase = { initializeApp: () => ({}), database: () => ({ ref: (k) => {
        const nomeCanale = String(k).split('/').pop();
        return {
            on: (evento, fn) => { ascolti[nomeCanale] = fn; },
            set: (v) => recapita(dispositivo, nomeCanale, (typeof v === 'string') ? v : J(v)),
            update: () => {},
            remove: () => recapita(dispositivo, nomeCanale, null),
            once: () => Promise.resolve({ val: () => (nomeCanale in server ? server[nomeCanale] : null) })
        };
    } }) };
    g.cloudPronto = Promise.resolve({ confermato: true });
    const ctx = vm.createContext(g);
    const html = fs.readFileSync(DIR + pagina, 'utf8');
    [...html.matchAll(/<script(?:\s+src="([^"]+)")?\s*>([\s\S]*?)<\/script>/g)].forEach(m => {
        const src = m[1];
        if (src) {
            if (/^https?:/.test(src)) return;
            const f = DIR + src.split('?')[0];
            if (!fs.existsSync(f)) { assenti.push(nome + ': ' + src); return; }
            try { vm.runInContext(fs.readFileSync(f, 'utf8'), ctx, { filename: src }); }
            catch (e) { nonCaricati.push(nome + ' / ' + src + ': ' + e.message); }
        } else {
            try { vm.runInContext(m[2], ctx); } catch (e) { nonCaricati.push(nome + ' / script in linea: ' + e.message); }
        }
    });
    dispositivo.giro = () => g._cicli.forEach(fn => { try { fn(); } catch (e) { g.ultimaEccezione = e; } });
    dispositivi.push(dispositivo);
    return dispositivo;
}

const nomadi = avvia('app NOMADI', 'NOMADS TACTICAL TERMINAL', 'app.html', 'nomadi');
const pano   = avvia('app PANOCEANIA', 'PANOCEANIA TACTICAL TERMINAL', 'app.html', 'panoceania');
const hub    = avvia('HUB', 'HUB CENTRALE - REGISTA N5', 'calcolatore_hub.html', null);
hub.g.hubPronto = true;
pano.g.isReactiveMode = true;

const M = nomadi.g.MotoreN5;
const C = M.CANALI;
// Un giro completo del tavolo: l'Hub elabora, poi le due app rileggono.
const giroTavolo = () => { hub.giro(); nomadi.giro(); pano.giro(); hub.giro(); nomadi.giro(); pano.giro(); };

console.log('\n=== 0. I tre dispositivi partono, separati e interi ===');
ok(nonCaricati.length === 0, `nessuno script cade al caricamento (${nonCaricati.length})`, nonCaricati);
ok(assenti.length === 0, `nessuno script dichiarato manca (${assenti.length})`, assenti);
ok(!!nomadi.g.MotoreN5 && !!pano.g.MotoreN5 && !!hub.g.MotoreN5, 'tre contesti, tre copie del motore');
ok(nomadi.g.localStorage !== pano.g.localStorage, 'e tre memorie distinte');
nomadi.g.localStorage.setItem('prova_locale', 'x');
ok(pano.g.localStorage.getItem('prova_locale') === null,
   'una chiave che non e un canale resta sul dispositivo');
ok(typeof nomadi.g.sostituisciUnita === 'function' && typeof nomadi.g.dichiaraRequisitoFallito === 'function',
   'l app attiva ha sostituisciUnita e dichiaraRequisitoFallito');
ok(typeof pano.g.selezionaArmaAro === 'function', 'e l app reattiva ha selezionaArmaAro');

// --- utilita` per guardare con gli occhi degli altri due dispositivi ---
function rosterVistoDaHub(fazione) {
    const s = hub.g.gameState || {};
    return (fazione === 'NOMADI' ? s.nomads : s.panoceania) || [];
}
function rosterNemicoVistoDa(disp) {
    const grezzo = disp.g.localStorage.getItem(C.STATO_PARTITA);
    if (!grezzo) return [];
    let s = null; try { s = JSON.parse(grezzo); } catch (e) { return []; }
    const miaFazione = disp.g.MotoreN5.fazionePropria();
    return ((miaFazione === 'NOMADI' ? s.panoceania : s.nomads) || []);
}
// Si cerca per ID. M.filtraPerAvversario RISCRIVE il nome in "MARKER" e
// l'alias in "SEGNALINO MIMETICO" per chi e` in forma di Marker: cercare per
// nome non trova la truppa proprio nel caso che interessa, e la prova
// direbbe "non arrivata" quando e` arrivata travestita, come deve.
// L'id sopravvive al filtro ed e` la chiave stabile.
const trovaIn = (lista, id) => (lista || []).find(u => u && String(u.id) === String(id));
const comeSiVede = (u) => u ? { nome: String(u.nome || u.name || ''), alias: String(u.alias || ''),
                                deployState: String(u.deployState || 'NORMAL'),
                                camo: !!(u.states || {}).camo,
                                suppressive: !!(u.states || {}).suppressive } : null;

console.log('\n=== 1. Lo schieramento fa il giro, e il Marker si vede MARKER ===');
const TUTTI = [].concat(nomadi.g.DB_NOMADI || [], nomadi.g.DB_PANOCEANIA || []);
const intruderHMG = Object.assign(JSON.parse(J(TUTTI.find(u => /^Intruder \(Heavy Machine Gun\)/.test(u.nome)) ||
                                              TUTTI.find(u => /^Intruder \(HMG\)/.test(u.nome)) ||
                                              TUTTI.find(u => /^Intruder/.test(u.nome)))),
    { id: 'n-intruder', deployState: 'CAMO', state: 'CAMO', states: { camo: true }, combatGroup: 1 });
const fusiliere = Object.assign(JSON.parse(J((pano.g.DB_PANOCEANIA || []).find(u => /^Fusilier \(Combi Rifle\)/.test(u.nome)))),
    { id: 'p-fusilier', deployState: 'NORMAL', state: 'ACTIVE', states: {}, combatGroup: 1 });

nomadi.g.roster = [intruderHMG];
nomadi.g.activeStructures = []; nomadi.g.activeTerrains = [];
pano.g.roster = [fusiliere];
pano.g.activeStructures = []; pano.g.activeTerrains = [];
nomadi.g.inviaSchieramentoAllHub('NOMADI', { roster: nomadi.g.roster, strutture: [], terreni: [], motivo: 'SCHIERAMENTO' });
pano.g.inviaSchieramentoAllHub('PANOCEANIA', { roster: pano.g.roster, strutture: [], terreni: [], motivo: 'SCHIERAMENTO' });
ok(scrittoDa(C.SETUP_NOMADI, 'app NOMADI'), 'l app Nomadi scrive sul suo canale di setup');
ok(scrittoDa(C.SETUP_PANOCEANIA, 'app PANOCEANIA'), 'e l app PanOceania sul suo');
giroTavolo();
ok(scrittoDa(C.STATO_PARTITA, 'HUB'), 'l Hub ripubblica lo stato della partita');

const hubPrima = comeSiVede(trovaIn(rosterVistoDaHub('NOMADI'), 'n-intruder'));
const nemicoPrima = comeSiVede(trovaIn(rosterNemicoVistoDa(pano), 'n-intruder'));
ok(!!hubPrima, `l Hub vede la truppa nomade (${J(hubPrima)})`);
ok(!!nemicoPrima, `e l avversario la vede (${J(nemicoPrima)})`);
ok(hubPrima && hubPrima.nome === 'MARKER' && !/Intruder/i.test(hubPrima.alias),
   `per l Hub e un MARKER, e il nome vero non si vede (${J(hubPrima)})`);
ok(nemicoPrima && nemicoPrima.nome === 'MARKER' && !/Intruder/i.test(nemicoPrima.alias),
   `e per l avversario anche (${J(nemicoPrima)})`);
ok(hubPrima && hubPrima.deployState.toUpperCase() === 'CAMO',
   `col deployState CAMO (${hubPrima && hubPrima.deployState})`);

console.log('\n=== 2. Caso (a): l Idle da requisito fallito RIVELA, e si vede di la ===');
const dalQui = transito.length;
// spearheadUnit: dichiaraRequisitoFallito prende l'unita` da li` (app.html
// riga 1800), non da currentOrder.unit. Senza, esce subito.
nomadi.g.spearheadUnit = nomadi.g.roster[0];
nomadi.g.currentOrder = { unit: nomadi.g.roster[0] };
nomadi.g.coordUnits = [nomadi.g.roster[0]]; nomadi.g.coordIndex = 0;
nomadi.g.coordPayloads = []; nomadi.g.combatTargets = []; nomadi.g.pendingTargets = [];
if (typeof nomadi.g.procediAlleAzioni === 'function') nomadi.g.procediAlleAzioni();
nomadi.g.selectAction('MOVIMENTO', false);
// Un giro del tavolo fra la dichiarazione e l'Idle, come al tavolo, dove
// l'Hub gira di continuo.
giroTavolo();
// 7 ottobre: l'Idle si dichiara dal tasto principale, e il modulo passa il
// MOTIVO gia` scritto. La finestra "Quale requisito non e` soddisfatto?"
// non deve aprirsi: si conta quante volte la pagina la chiede.
let domandeFatte = 0;
const promptVero = nomadi.g.prompt;
nomadi.g.prompt = function () { domandeFatte++; return 'scritto a mano'; };
let busteCalcolo = [];
const inviaVero = nomadi.g.inviaCalcoloAllHub;
nomadi.g.inviaCalcoloAllHub = function (b) { busteCalcolo.push(JSON.parse(J(b))); return inviaVero.apply(this, arguments); };
nomadi.g.dichiaraRequisitoFallito('Nessuna Linea di Tiro (motivo del modulo)');
nomadi.g.prompt = promptVero; nomadi.g.inviaCalcoloAllHub = inviaVero;
ok(domandeFatte === 0, `col motivo gia scritto la pagina NON chiede "quale requisito?" (domande: ${domandeFatte})`);
ok(busteCalcolo.length === 1 && /motivo del modulo/.test(J(busteCalcolo[0])) && !/scritto a mano/.test(J(busteCalcolo[0])),
   `e nella busta resta il motivo del modulo, non uno scritto a mano (${(J(busteCalcolo[0] || {}).match(/"motivo":"[^"]*"/) || ['nessun motivo'])[0]})`);
ok(scrittoDa(C.SETUP_NOMADI, 'app NOMADI', dalQui),
   'l app attiva rimanda il proprio roster: parte l AGGIORNAMENTO');
giroTavolo();
const hubDopo = comeSiVede(trovaIn(rosterVistoDaHub('NOMADI'), 'n-intruder'));
const nemicoDopo = comeSiVede(trovaIn(rosterNemicoVistoDa(pano), 'n-intruder'));
ok(hubDopo && /Intruder/i.test(hubDopo.nome),
   `ora l Hub vede "Intruder", non MARKER (${hubDopo && hubDopo.nome})`);
ok(hubDopo && hubDopo.deployState.toUpperCase() === 'NORMAL',
   `col deployState NORMAL (${hubDopo && hubDopo.deployState})`);
ok(hubDopo && hubDopo.camo === false, `e camo false (${hubDopo && hubDopo.camo})`);
ok(nemicoDopo && /Intruder/i.test(nemicoDopo.nome) &&
   nemicoDopo.deployState.toUpperCase() === 'NORMAL' && nemicoDopo.camo === false,
   `e l avversario vede la stessa cosa (${J(nemicoDopo)})`);
// 🔴 UN ALLARME PER ORDINE (motore_core.js 2026-10-07.1, regola alle righe
// 1097-1101 e 1196-1217). Fino al 6 ottobre qui si aspettavano DUE allarmi,
// il MOVIMENTO della prima meta` e l'IDLE del requisito fallito: era il
// difetto visto da Paolo al tavolo, il reattivo si vedeva chiedere un
// secondo ARO per lo stesso Ordine. L'Ordine ha gia` avvisato l'avversario
// col MOVIMENTO: l'Idle da requisito fallito non rialza l'allarme.
// CHI ha scritto COSA, tratto per tratto: l'app attiva scrive sul canale
// verso l'Hub, l'Hub inoltra sul canale dell'allarme.
const tratto = (da, chiave) => transito.filter(t => t.quando >= dalQui && !t.vuoto && t.da === da && t.chiave === chiave)
    .map(t => { try { return String(JSON.parse(t.valore).azione || '').toUpperCase(); } catch (e) { return '?'; } });
const dallApp = tratto('app NOMADI', C.COMUNICAZIONE), dallHub = tratto('HUB', C.ALLARME_ATTACCO);
ok(J(dallApp) === J(['MOVIMENTO']), `l app attiva spedisce all Hub UN allarme solo, il MOVIMENTO (${J(dallApp)})`);
ok(J(dallHub) === J(['MOVIMENTO']), `e l Hub ne inoltra al reattivo UNO solo (${J(dallHub)})`);
ok(dallApp.indexOf('IDLE') < 0 && dallHub.indexOf('IDLE') < 0,
   `l Idle da requisito fallito NON manda un secondo allarme (${J(dallApp)} / ${J(dallHub)})`);
// L'Ordine pero` si chiude: la busta dell'Idle parte lo stesso.
ok(scrittoDa(C.HUB_CALCOLO, 'app NOMADI', dalQui), 'e la busta dell Idle parte comunque verso l Hub');

console.log('\n=== 3. CONTROPROVA: senza invio il cambio NON arriva ===');
// senzaInvio true aggiorna il roster di chi agisce e NON spedisce. Senza
// questa prova, "l avversario vede il cambio" non distingue "il tubo
// funziona" da "il tubo e` sempre pieno": e` il difetto che INTERFACCIA ha
// chiuso il 6 ottobre, visto dalla parte di chi guarda.
const primaDellaControprova = transito.length;
const unita3 = nomadi.g.roster[0];
const esito3 = nomadi.g.sostituisciUnita(unita3,
    { states: Object.assign({}, unita3.states, { suppressive: true }) },
    'prova senza invio', { senzaInvio: true });
ok(esito3 === false, `sostituisciUnita con senzaInvio restituisce false (${esito3})`);
ok(!!(nomadi.g.roster[0].states || {}).suppressive,
   'il roster di chi agisce e aggiornato');
ok(!scrittoDa(C.SETUP_NOMADI, 'app NOMADI', primaDellaControprova),
   'ma NIENTE e partito verso l Hub');
giroTavolo();
const hubControprova = comeSiVede(trovaIn(rosterVistoDaHub('NOMADI'), 'n-intruder'));
ok(hubControprova && hubControprova.suppressive === false,
   `e l Hub resta allo stato vecchio (suppressive ${hubControprova && hubControprova.suppressive})`);
// E con l invio il medesimo cambio arriva: la differenza e` solo l invio.
const primaDellInvio = transito.length;
const esito3b = nomadi.g.sostituisciUnita(nomadi.g.roster[0],
    { states: Object.assign({}, nomadi.g.roster[0].states, { suppressive: true }) }, 'prova con invio');
ok(esito3b === true, `senza senzaInvio restituisce true (${esito3b})`);
ok(scrittoDa(C.SETUP_NOMADI, 'app NOMADI', primaDellInvio), 'e stavolta parte');
giroTavolo();
const hubConInvio = comeSiVede(trovaIn(rosterVistoDaHub('NOMADI'), 'n-intruder'));
ok(hubConInvio && hubConInvio.suppressive === true,
   `e l Hub lo vede (suppressive ${hubConInvio && hubConInvio.suppressive})`);

console.log('\n=== 4. Caso (b): la Soppressione annullata in ARO si vede di la ===');
// Ora tocca all'altro verso: chi agisce e` il Fusilier, e l Alguacil in
// Soppressione reagisce. Lo stato dev'essere tolto su tutti e tre.
const alguacil = Object.assign(JSON.parse(J((nomadi.g.DB_NOMADI || []).find(u => /^Alguacil \(Combi Rifle\)/.test(u.nome)))),
    { id: 'n-alguacil', deployState: 'NORMAL', state: 'ACTIVE',
      states: { suppressive: true }, combatGroup: 1 });
nomadi.g.roster = [alguacil];
nomadi.g.inviaSchieramentoAllHub('NOMADI', { roster: nomadi.g.roster, strutture: [], terreni: [], motivo: 'SCHIERAMENTO' });
giroTavolo();
const algHubPrima = comeSiVede(trovaIn(rosterVistoDaHub('NOMADI'), 'n-alguacil'));
const algNemicoPrima = comeSiVede(trovaIn(rosterNemicoVistoDa(pano), 'n-alguacil'));
ok(algHubPrima && algHubPrima.suppressive === true,
   `l Hub vede l Alguacil in Soppressione (${algHubPrima && algHubPrima.suppressive})`);
ok(algNemicoPrima && algNemicoPrima.suppressive === true,
   `e l avversario anche (${algNemicoPrima && algNemicoPrima.suppressive})`);

// Il Fusilier (PanOceania) dichiara l'Attacco BS; l Alguacil reagisce in ARO.
// Qui l app che REAGISCE e` quella nomade: si scambiano i ruoli.
const dalQui4 = transito.length;
nomadi.g.isReactiveMode = true;
nomadi.g.currentAttackData = { attaccante: fusiliere.nome, attaccanti: [fusiliere.nome],
                               azione: 'ATTACCO BS', bersagli: [alguacil.nome] };
// selezionaArmaAro NON guarda selectedAroUnit: prende l'id da
// window.aroCurrentConfig.id (logica_aro.js riga 656). Riempirlo male
// significa non trovare l'unita` nel roster e non cambiare nulla, senza un
// errore — e la prova direbbe "lo stato non viene tolto".
nomadi.g.aroCurrentConfig = { id: 'n-alguacil', arma: null };
nomadi.g.currentOrder = { unit: nomadi.g.roster[0] };
let sceso = null;
try { sceso = nomadi.g.selezionaArmaAro('Combi Rifle', true); }
catch (e) { ok(false, 'selezionaArmaAro non cade', e.message); }
ok(!(nomadi.g.roster[0].states || {}).suppressive,
   `lo stato e stato tolto a chi reagisce (${J((nomadi.g.roster[0].states || {}).suppressive)})`);
ok(scrittoDa(C.SETUP_NOMADI, 'app NOMADI', dalQui4),
   'e parte l AGGIORNAMENTO verso l Hub');
giroTavolo();
const algHubDopo = comeSiVede(trovaIn(rosterVistoDaHub('NOMADI'), 'n-alguacil'));
const algNemicoDopo = comeSiVede(trovaIn(rosterNemicoVistoDa(pano), 'n-alguacil'));
ok(algHubDopo && algHubDopo.suppressive === false,
   `l Hub non lo vede piu in Soppressione (${algHubDopo && algHubDopo.suppressive})`);
ok(algNemicoDopo && algNemicoDopo.suppressive === false,
   `e nemmeno l avversario (${algNemicoDopo && algNemicoDopo.suppressive})`);

console.log('\n=== 5. Il giro e` passato dall Hub, non da una scorciatoia ===');
// Le due app non si parlano: se l Hub non ripubblicasse, l avversario non
// vedrebbe niente. Questa prova dice che il dato e` passato per il mezzo,
// cioe` che il giro misurato e` quello vero e non una coincidenza.
ok(transito.some(t => t.chiave === C.STATO_PARTITA && t.da === 'HUB'),
   'lo stato della partita lo scrive l Hub');
ok(!transito.some(t => t.chiave === C.STATO_PARTITA && t.da !== 'HUB'),
   'e nessun altro lo scrive');
ok(!transito.some(t => t.chiave === C.SETUP_NOMADI && t.da === 'app PANOCEANIA'),
   'nessuna app scrive sul canale di setup dell altra');

console.log('\n=== 6. I DUE TRATTI dell allarme, uno per volta: NIENTE si perde ===');
// I cicli di lettura sono due e in serie (Hub: calcolatore_controller.js;
// app reattiva: motore_core.js; entrambi a 1000 ms), e ogni tratto tiene UN
// valore: "l'ultima scrittura vince". Un allarme poteva perdersi in due
// punti:
//   (a) due scritture dell'app entro un giro dell'Hub
//   (b) due inoltri dell'Hub entro un giro dell'app reattiva
// Fino a motore_core.js 2026-10-06.6 si perdevano tutti e due: questa
// sezione, nella versione .4 del banco, fissava la perdita di (b) come
// LIMITE NOTO (il reattivo mostrava solo ["IDLE"]). Dalla 2026-10-06.7 chi
// spedisce tiene una CODA: un allarme parte solo quando quello prima e`
// stato consumato su tutti e due i tratti. Il limite non c'e` piu`, e le
// prove dicono il contrario di prima: arrivano entrambi, in ordine.
// Qui i giri si danno a mano, un dispositivo per volta. Gli allarmi li
// costruisce il motore (window.inviaAllarmeOrdine -> M.allarmeOrdine).
// NOTA PER CHI SCRIVE PROVE: nel banco setTimeout esegue subito, quindi la
// coda non si risveglia da sola ogni 200 ms come nel browser: dopo che il
// reattivo ha consumato, la si sveglia con window.spedisciAllarmiInCoda().
const mostrati = [];
const bannerVero = pano.g.mostraBannerAllarme;
pano.g.mostraBannerAllarme = function () {
    mostrati.push(String((pano.g.currentAttackData || {}).azione || '').toUpperCase());
    return (typeof bannerVero === 'function') ? bannerVero.apply(this, arguments) : undefined;
};
pano.g.isReactiveMode = true;
const spedisci = (azione) => nomadi.g.inviaAllarmeOrdine(azione, { unita: nomadi.g.roster[0] });
const azioniDi = (da, chiave, dal) => transito.filter(x => x.quando >= dal && !x.vuoto && x.da === da && x.chiave === chiave)
    .map(x => { try { return String(JSON.parse(x.valore).azione || '').toUpperCase(); } catch (e) { return '?'; } });
const inCoda = () => (nomadi.g._codaAllarmi || []).length;
ok(typeof nomadi.g.spedisciAllarmiInCoda === 'function' && Array.isArray(nomadi.g._codaAllarmi),
   'premessa: l app ha la coda degli allarmi (motore_core.js dalla 2026-10-06.7)');

// --- un allarme solo: parte subito, come sempre ---
// (7 ottobre: i due casi sotto ora usano due ORDINI diversi, perche` lo
// stesso Ordine non manda piu` due allarmi.)
nomadi.g.currentOrder = { unit: nomadi.g.roster[0], id: 'ordine_prova_tratti_0' };
let dal6 = transito.length; mostrati.length = 0;
spedisci('MOVIMENTO');
ok(J(azioniDi('app NOMADI', C.COMUNICAZIONE, dal6)) === J(['MOVIMENTO']) && inCoda() === 0,
   `un allarme solo parte subito, niente in coda (${J(azioniDi('app NOMADI', C.COMUNICAZIONE, dal6))}, coda ${inCoda()})`);
hub.giro(); pano.giro(); nomadi.g.spedisciAllarmiInCoda();
ok(J(mostrati) === J(['MOVIMENTO']), `e il reattivo lo mostra (${J(mostrati)})`);

// --- lo STESSO Ordine non avvisa due volte ---
// Dal 7 ottobre il secondo allarme dello stesso Ordine non entra nemmeno in
// coda: inviaAllarmeAro risponde { inviato:false, ripetuto:true }.
nomadi.g.currentOrder = { unit: nomadi.g.roster[0], id: 'ordine_prova_tratti_ripetuto' };
dal6 = transito.length; mostrati.length = 0;
spedisci('MOVIMENTO'); spedisci('IDLE');
ok(J(azioniDi('app NOMADI', C.COMUNICAZIONE, dal6)) === J(['MOVIMENTO']) && inCoda() === 0,
   `stesso Ordine: il secondo allarme non parte e non resta in coda (${J(azioniDi('app NOMADI', C.COMUNICAZIONE, dal6))}, coda ${inCoda()})`);
const ripetuto = nomadi.g.inviaAllarmeAro({ azione: 'IDLE', attaccante: 'x', ordineId: 'ordine_prova_tratti_ripetuto' });
ok(ripetuto && ripetuto.inviato === false && ripetuto.ripetuto === true, `e chi lo chiede lo viene a sapere (${J(ripetuto)})`);
hub.giro(); pano.giro(); nomadi.g.spedisciAllarmiInCoda(); hub.giro(); pano.giro();
ok(J(mostrati) === J(['MOVIMENTO']), `il reattivo vede UN allarme (${J(mostrati)})`);

// La coda serve ancora per due Ordini DIVERSI dichiarati uno dopo l'altro
// (la fine di un Ordine e l'inizio del successivo dentro lo stesso giro di
// lettura): il secondo non deve coprire il primo. Stesse prove del 6
// ottobre, con due Ordini al posto di due allarmi dello stesso Ordine.
const spedisciOrdine = (id, azione) => { nomadi.g.currentOrder = { unit: nomadi.g.roster[0], id: id }; spedisci(azione); };

// --- caso (a): due Ordini di fila, l'Hub non ha ancora girato ---
dal6 = transito.length; mostrati.length = 0;
spedisciOrdine('ordine_prova_tratti_a1', 'MOVIMENTO'); spedisciOrdine('ordine_prova_tratti_a2', 'IDLE');
ok(J(azioniDi('app NOMADI', C.COMUNICAZIONE, dal6)) === J(['MOVIMENTO']),
   `(a) sul canale verso l Hub c e solo il primo: il secondo NON lo copre (${J(azioniDi('app NOMADI', C.COMUNICAZIONE, dal6))})`);
ok(inCoda() === 1, `(a) e il secondo aspetta in coda (${inCoda()})`);
hub.giro();
ok(J(azioniDi('HUB', C.ALLARME_ATTACCO, dal6)) === J(['MOVIMENTO']), `(a) l Hub inoltra il primo (${J(azioniDi('HUB', C.ALLARME_ATTACCO, dal6))})`);

// --- caso (b): l'Hub gira ancora, il reattivo NON ha ancora letto ---
nomadi.g.spedisciAllarmiInCoda(); hub.giro();
ok(J(azioniDi('HUB', C.ALLARME_ATTACCO, dal6)) === J(['MOVIMENTO']) && inCoda() === 1,
   `(b) finche il reattivo non ha letto il primo, il secondo resta in coda e l Hub non lo inoltra (${J(azioniDi('HUB', C.ALLARME_ATTACCO, dal6))}, coda ${inCoda()})`);
pano.giro();
ok(J(mostrati) === J(['MOVIMENTO']), `il reattivo legge e mostra il primo (${J(mostrati)})`);
nomadi.g.spedisciAllarmiInCoda();
ok(inCoda() === 0 && J(azioniDi('app NOMADI', C.COMUNICAZIONE, dal6)) === J(['MOVIMENTO', 'IDLE']),
   `consumato il primo, il secondo parte (${J(azioniDi('app NOMADI', C.COMUNICAZIONE, dal6))}, coda ${inCoda()})`);
hub.giro(); pano.giro();
ok(J(azioniDi('HUB', C.ALLARME_ATTACCO, dal6)) === J(['MOVIMENTO', 'IDLE']), `l Hub inoltra anche il secondo (${J(azioniDi('HUB', C.ALLARME_ATTACCO, dal6))})`);
ok(J(mostrati) === J(['MOVIMENTO', 'IDLE']), `e il reattivo li ha mostrati TUTTI E DUE, in ordine (${J(mostrati)})`);
pano.g.mostraBannerAllarme = bannerVero;
// NON PROVATO QUI: l'attesa massima di 4000 ms (se nessuno consuma, il
// successivo parte comunque). Il banco non governa l'orologio.

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
