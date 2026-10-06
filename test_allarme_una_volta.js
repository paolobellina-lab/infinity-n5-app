// @versione 2026-10-06.1 | test_allarme_una_volta.js | proprieta`: chat MOTORE
// ============================================================================
//  UN ALLARME PER ORDINE, ALLA PRIMA ABILITA`.
//
//  COSA PROVA
//  Il secondo caso di A-13 nel piano di collaudo: l'IDLE che "passava al
//  calcolatore senza generare ARO". Misurato da MOTORE il 6 ottobre sulla
//  pagina intera e riprodotto qui, perche` un difetto chiuso senza un banco
//  si riapre da solo alla prossima riscrittura.
//    - IDLE da solo                 -> 1 allarme, azione 'IDLE';
//    - MOVIMENTO poi IDLE (2a meta`) -> 1 allarme, azione 'MOVIMENTO';
//    - IDLE poi IDLE                 -> 1 allarme, azione 'IDLE'.
//  L'allarme parte UNA VOLTA PER ORDINE, alla prima Abilita`. La seconda
//  meta` non lo rialza: l'avversario e` stato avvisato quando l'Ordine e`
//  stato dichiarato, ed e` quello il momento in cui ha diritto all'ARO.
//
//  DI CHI E` IL CODICE PROVATO
//  selectAction e inviaAllarmeOrdine stanno in motore_core.js (MOTORE); la
//  voce IDLE del menu e il pulsante del requisito fallito stanno in app.html
//  (INTERFACCIA). La regola misurata qui — quante volte parte l'allarme e con
//  quale azione — e` del router, quindi il banco e` di MOTORE.
//
//  COME CONTA
//  Non si legge lo stato finale del canale: `set` SOVRASCRIVE, e due allarmi
//  lasciano la stessa traccia di uno. Si registra OGNI scrittura in un
//  registro, con l'azione che portava. E` la lezione di test_giro_ritorno.js:
//  chi guarda solo il risultato finale non puo` distinguere "una volta" da
//  "due volte, e la seconda ha coperto la prima".
//
//  USO:  node test_allarme_una_volta.js   (legge la propria cartella)
//        CARTELLA=/percorso/ node test_allarme_una_volta.js
// ============================================================================
const DIR = (process.env.CARTELLA || (__dirname + '/')).replace(/\/?$/, '/');
const fs = require('fs'), vm = require('vm');

let passati = 0, falliti = 0;
function ok(c, d, visto) {
    if (c) { passati++; console.log('  ✓ ' + d); }
    else { falliti++; console.log('  ✗ ' + d + (visto !== undefined ? '  [visto: ' + JSON.stringify(visto) + ']' : '')); }
}
// Una pagina che non c'e` non si salta in silenzio: si dice, con un rosso e
// il riepilogo. Un banco che muore all'avvio porta via le sue prove senza
// farle fallire, ed e` il difetto che il 6 ottobre ne ha azzittiti nove.
if (!fs.existsSync(DIR + 'app.html')) {
    console.log('  ✗ app.html non trovato in ' + DIR + ' (imposta CARTELLA=/percorso/)');
    console.log('\n0 passati, 1 falliti');
    process.exit(1);
}

// ---------------------------------------------------------------------------
// La pagina del giocatore attivo, con un canale che REGISTRA.
// ---------------------------------------------------------------------------
const nonCaricati = [], assenti = [];
let registro = [];                     // ogni scrittura sul canale dell'allarme
let buste = [];                        // ogni busta di calcolo spedita all'Hub

function apri() {
    const h = fs.readFileSync(DIR + 'app.html', 'utf8');
    const g = {}; g.window = g; g.globalThis = g;
    g.console = { log: () => {}, warn: () => {}, error: () => {} };
    const el = {};
    const finto = (id) => {
        if (!el[id]) el[id] = { id, innerHTML: '', innerText: '', style: {}, value: '',
            appendChild: () => {}, addEventListener: () => {}, remove: () => {},
            classList: { add: () => {}, remove: () => {}, contains: () => false },
            setAttribute: () => {}, getAttribute: () => null, options: [],
            cloneNode() { return finto(id + '_c'); },
            parentNode: { replaceChild: () => {} }, querySelector: () => null };
        return el[id];
    };
    const locale = {};
    g.localStorage = { getItem: k => (k in locale ? locale[k] : null),
                       setItem: (k, v) => locale[k] = v, removeItem: k => delete locale[k] };
    g.location = { search: '?fazione=nomadi', replace: () => {}, href: '' };
    let titolo = 'NOMADS TACTICAL TERMINAL';
    g.document = { get title() { return titolo; }, set title(v) { titolo = v; },
        documentElement: { setAttribute: () => {} }, scripts: [], readyState: 'complete',
        getElementById: finto, createElement: () => finto('n'),
        querySelector: () => finto('q'), querySelectorAll: () => [],
        addEventListener: () => {}, write: () => {} };
    g.alert = (m) => { g.ultimoAlert = m; };
    g.confirm = () => false;             // il Foxhole non si cancella: nessuna domanda da qui
    g.prompt = () => null;
    ['scrollTo', 'addEventListener'].forEach(k => g[k] = () => {});
    g.setInterval = () => 0; g.setTimeout = (fn) => { fn && fn(); return 0; };
    g.history = { pushState: () => {} }; g.navigator = {};
    g.firebase = { initializeApp: () => {}, database: () => ({ ref: (k) => {
        const nome = String(k).split('/').pop();
        return { on: () => {}, remove: () => {}, set: (v) => {
            // IL REGISTRO. Si annota la scrittura con il canale e il contenuto:
            // cosi` due allarmi fanno due righe, non una riga sovrascritta.
            let dato = v;
            if (typeof v === 'string') { try { dato = JSON.parse(v); } catch (e) { dato = v; } }
            registro.push({ canale: nome, dato: dato });
        } };
    } }) };
    const ctx = vm.createContext(g);
    g.cloudPronto = Promise.resolve({ confermato: true });
    [...h.matchAll(/<script(?:\s+src="([^"]+)")?\s*>([\s\S]*?)<\/script>/g)].forEach(m => {
        const s = m[1];
        if (s) {
            if (/^https?:/.test(s)) return;
            const f = DIR + s.split('?')[0];
            if (!fs.existsSync(f)) { assenti.push(s); return; }
            try { vm.runInContext(fs.readFileSync(f, 'utf8'), ctx, { filename: s }); }
            catch (e) { nonCaricati.push(s + ': ' + e.message); }
        } else {
            try { vm.runInContext(m[2], ctx); } catch (e) { nonCaricati.push('script in linea: ' + e.message); }
        }
    });
    return { g, el };
}

const app = apri();
const g = app.g;
const M = g.MotoreN5;

console.log('\n=== 0. La pagina si carica per intero ===');
ok(nonCaricati.length === 0, `nessuno script cade al caricamento (${nonCaricati.length})`, nonCaricati);
ok(assenti.length === 0, `nessuno script dichiarato manca dalla cartella (${assenti.length})`, assenti);
ok(!!M && typeof g.selectAction === 'function', 'il motore e il router ci sono');

// Il canale dell'allarme si chiede al motore: scriverlo a mano qui sarebbe una
// SECONDA copia di M.CANALI, e una copia sbagliata darebbe "zero allarmi"
// facendo passare un difetto per un successo. (Succedeva il 29 settembre.)
const CANALE_ALLARME = M.CANALI.COMUNICAZIONE;
ok(typeof CANALE_ALLARME === 'string' && CANALE_ALLARME.length > 0,
   `il canale dell allarme viene dal motore: ${CANALE_ALLARME}`);

const alg = (g.DB_NOMADI || []).find(u => /^Alguacil \(Combi/.test(u.nome));
ok(!!alg, 'l Alguacil (Combi Rifle) esiste nel database', alg && alg.nome);

// ---------------------------------------------------------------------------
// Un Ordine pulito, e il conto degli allarmi che ha prodotto.
// ---------------------------------------------------------------------------
function nuovoOrdine() {
    g.roster = [Object.assign(JSON.parse(JSON.stringify(alg)),
        { id: 'u1', alias: 'Zero', states: {}, combatGroup: 1, deployState: 'NORMAL', state: 'ACTIVE' })];
    g.gameState = { nomads: g.roster, panoceania: [] };
    g.spearheadUnit = g.roster[0];
    g.selectedCoordinatedUnits = [];
    g.coordMode = false; g.coordIndex = 0; g.coordUnits = [g.roster[0]];
    g.coordPayloads = []; g.combatTargets = []; g.pendingTargets = [];
    g.currentOrder = { unit: g.roster[0] };
    registro = []; buste = [];
    g.inviaCalcoloAllHub = (p) => { buste.push(p); };
}
const allarmi = () => registro.filter(r => r.canale === CANALE_ALLARME);
const azioni = () => allarmi().map(a => (a.dato && a.dato.azione) || '(senza azione)');

console.log('\n=== 1. IDLE da solo: un allarme, azione IDLE ===');
nuovoOrdine();
g.selectAction('IDLE', false);
ok(allarmi().length === 1, `un allarme solo (${allarmi().length})`, azioni());
ok(azioni()[0] === 'IDLE', `e l azione dichiarata è IDLE (${azioni()[0]})`, azioni());

console.log('\n=== 2. MOVIMENTO poi IDLE come seconda meta`: un allarme, azione MOVIMENTO ===');
nuovoOrdine();
g.selectAction('MOVIMENTO', false);
const dopoPrimaMeta = allarmi().length;
const idOrdine = g.currentOrder.id;
g.selectAction('IDLE', true);
ok(dopoPrimaMeta === 1, `la prima metà alza l allarme (${dopoPrimaMeta})`);
ok(allarmi().length === 1, `e la seconda metà NON lo rialza (${allarmi().length})`, azioni());
ok(azioni()[0] === 'MOVIMENTO',
   `l azione dell allarme è quella della prima metà: MOVIMENTO (${azioni()[0]})`);
ok(g.currentOrder.id === idOrdine,
   'e la seconda metà conserva l identificativo dell Ordine', g.currentOrder.id);

console.log('\n=== 3. IDLE poi IDLE: un allarme, azione IDLE ===');
nuovoOrdine();
g.selectAction('IDLE', false);
g.selectAction('IDLE', true);
ok(allarmi().length === 1, `un allarme solo (${allarmi().length})`, azioni());
ok(azioni()[0] === 'IDLE', `azione IDLE (${azioni()[0]})`, azioni());

console.log('\n=== 4. CONTROPROVA: un Ordine NUOVO alza un allarme NUOVO ===');
// Senza questa prova, i conteggi "1" di sopra non distinguono "una volta per
// Ordine" da "una volta e mai piu`" — cioe` da un allarme che si e` rotto
// dopo il primo. Due Ordini di fila devono fare DUE allarmi, con DUE
// identificativi diversi.
nuovoOrdine();
g.selectAction('IDLE', false);
const primo = g.currentOrder.id;
const dopoUno = allarmi().length;
g.currentOrder = { unit: g.roster[0] };     // il giocatore dichiara un altro Ordine
g.selectAction('IDLE', false);
const secondo = g.currentOrder.id;
ok(dopoUno === 1 && allarmi().length === 2,
   `due Ordini, due allarmi (${dopoUno} -> ${allarmi().length})`, azioni());
ok(!!primo && !!secondo && primo !== secondo,
   'e i due Ordini hanno identificativi diversi', { primo: primo, secondo: secondo });

console.log('\n=== 5. CONTROPROVA: un Ordine senza ARO non alza nulla ===');
// ALLERTA e` la sola azione del vocabolario che non genera ARO (misurato il
// 6 ottobre su tutto l elenco). Se alzasse l allarme, il conto "1" delle
// prove di sopra sarebbe un caso, non una regola.
ok(M.generaAro('ALLERTA', {}).genera === false,
   'il motore dice che ALLERTA non genera ARO', M.generaAro('ALLERTA', {}).genera);
ok(M.allarmeOrdine('ALLERTA', { unita: g.roster[0], coordUnits: [g.roster[0]] }).payload === null,
   'e quindi non c è nessuna busta d allarme da spedire');

console.log('\n=== 6. La busta di chiusura di un Ordine in due meta` ===');
// aroAtteso false sulla busta finale e` VOLUTO (dichiarato da MOTORE il 6
// ottobre): l allarme e` partito con la prima meta`, e la schermata non
// lascia dichiarare la seconda finche` le reazioni non sono arrivate. Si
// scrive qui perche` un `false` senza una ragione accanto, al prossimo giro,
// sembra un difetto e qualcuno lo "corregge".
nuovoOrdine();
g.selectAction('MOVIMENTO', false);
g.selectAction('IDLE', true);
// Niente if/else qui: con due rami, QUALE prova viene eseguita dipende dal
// comportamento, e un comportamento sbagliato puo` finire sul ramo che
// chiede meno. Si pretende il numero, e si dice quale.
ok(buste.length === 1, `una busta sola per l Ordine (${buste.length})`,
   buste.map(b => b && b.azione));
ok(buste.length === 1 && buste[0].aroAtteso === false,
   `e non chiede di aspettare l ARO: aroAtteso false, voluto (${buste.length === 1 ? buste[0].aroAtteso : 'nessuna busta'})`);
ok(allarmi().length === 1,
   `l allarme resta uno: è partito con la prima metà (${allarmi().length})`, azioni());

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
