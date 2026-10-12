// @versione 2026-10-08.1 | test_allarme_una_volta.js | proprieta`: chat MOTORE
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
const J = JSON.stringify;
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
    // UN OROLOGIO PILOTABILE. La coda degli allarmi misura il tempo con
    // Date.now(): senza poterlo muovere, l'attesa massima di 4000 ms non si
    // puo` provare — e infatti nessuno l'aveva provata. Qui `orologio.avanti`
    // sposta il tempo in avanti senza far aspettare il banco.
    g.__ora = Date.now();
    g.Date = function () { return new Date(g.__ora); };
    g.Date.now = () => g.__ora;
    g.Date.prototype = Date.prototype;
    g.history = { pushState: () => {} }; g.navigator = {};
    // IL TRASPORTO FINTO DEVE FARE L'ECO.
    // Il motore non scrive il canale nel localStorage: intercetta setItem e lo
    // manda al trasporto, che lo riporta indietro con l'eco e avvisa
    // M.ascoltatoriCanali. Da quell'avviso la coda capisce che l'allarme in
    // volo e` stato VISTO (motore_core.js 2026-10-06.7).
    // Senza l'eco, questo banco vedeva il canale sempre vuoto e `visto` sempre
    // false: la coda non si liberava mai e il secondo allarme non partiva —
    // un difetto del banco che sembrava un difetto della coda. Trovato il
    // 6 ottobre, misurando perche` consuma() non sbloccava niente.
    g.firebase = { initializeApp: () => {}, database: () => ({ ref: (k) => {
        const nome = String(k).split('/').pop();
        const avvisa = (dati) => {
            const asc = (g.MotoreN5 && g.MotoreN5.ascoltatoriCanali) || [];
            asc.forEach(fn => { try { fn(nome, dati); } catch (e) {} });
        };
        return {
            on: () => {},
            remove: () => { delete locale[nome]; avvisa(null); },
            set: (v) => {
                // IL REGISTRO. Si annota la scrittura con il canale e il
                // contenuto: cosi` due allarmi fanno due righe, non una riga
                // sovrascritta.
                let dato = v;
                if (typeof v === 'string') { try { dato = JSON.parse(v); } catch (e) { dato = v; } }
                registro.push({ canale: nome, dato: dato });
                // L'eco: la copia locale e l'avviso, come fa Firebase.
                locale[nome] = (typeof v === 'string') ? v : JSON.stringify(v);
                avvisa(dato);
            }
        };
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
    // Si parte sempre a tratti liberi e coda vuota: una sezione che
    // cominciasse con l'allarme di quella prima ancora in volo misurerebbe la
    // coda invece dell'Ordine.
    consuma();
    g._codaAllarmi = []; g._allarmeInVolo = null;
    registro = []; buste = [];
    g.inviaCalcoloAllHub = (p) => { buste.push(p); };
}
// CHI LEGGE. Dalla 2026-10-06.7 di motore_core.js un allarme non parte se
// quello prima non e` stato consumato su TUTTI E DUE i tratti (COMUNICAZIONE
// verso l'Hub, ALLARME_ATTACCO verso il reattivo): niente piu` allarmi che si
// coprono. Questo banco ha UNA pagina sola e nessun Hub, percio` deve fare
// lui la parte di chi legge, altrimenti dal secondo Ordine la coda non si
// svuota e il conto degli allarmi e` zero — che e` esattamente il rosso con
// cui questo banco si e` presentato sulla .7.
// Si cancellano i due canali (e` quello che fa chi li legge) e si da` un
// passo alla coda: nei banchi setTimeout esegue subito, quindi la coda non si
// risveglia da sola.
function consuma() {
    g.localStorage.removeItem(M.CANALI.COMUNICAZIONE);
    g.localStorage.removeItem(M.CANALI.ALLARME_ATTACCO);
    if (typeof g.spedisciAllarmiInCoda === 'function') g.spedisciAllarmiInCoda();
}
const inCoda = () => (g._codaAllarmi || []).length;
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
// FRA I DUE ORDINI SI CONSUMA, come fa chi legge. Dalla 2026-10-06.7 il
// secondo allarme NON parte finche` il primo e` sui canali: senza questo
// passaggio il banco misurerebbe la coda e direbbe "il secondo Ordine non
// alza l allarme", che e` falso.
consuma();
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
// 🔴 8 ottobre: aroAtteso TRUE sulla busta finale. Fino al 7 era false,
// "voluto": l allarme parte con la prima meta` e la schermata non lascia
// dichiarare la seconda finche` le reazioni non arrivano. Ma l Hub, con
// aroAtteso false, calcola SUBITO: se la busta arriva prima della risposta
// ARO (chiamata diretta, pagina ricaricata, un tasto rimasto a schermo)
// l ARO finisce in latestAroData e il tabellone non lo mostra mai (misura
// di INTERFACCIA, 8 ottobre). Ora la busta dice il fatto: per questo
// Ordine un allarme e` partito. Se le reazioni sono gia` arrivate, l Hub
// non aspetta niente (reazioniPronte).
nuovoOrdine();
g.selectAction('MOVIMENTO', false);
g.selectAction('IDLE', true);
// Niente if/else qui: con due rami, QUALE prova viene eseguita dipende dal
// comportamento, e un comportamento sbagliato puo` finire sul ramo che
// chiede meno. Si pretende il numero, e si dice quale.
ok(buste.length === 1, `una busta sola per l Ordine (${buste.length})`,
   buste.map(b => b && b.azione));
ok(buste.length === 1 && buste[0].aroAtteso === true,
   `e chiede all Hub di aspettare l ARO della prima metà: aroAtteso true (${buste.length === 1 ? buste[0].aroAtteso : 'nessuna busta'})`);
ok(allarmi().length === 1,
   `l allarme resta uno: è partito con la prima metà (${allarmi().length})`, azioni());

console.log('\n=== 7. LA CODA DEGLI ALLARMI (motore_core.js 2026-10-06.7) ===');
// Nasce dalla misura di questo banco e di quello del giro: due allarmi dentro
// la finestra di lettura (1000 ms per tratto) e il secondo COPRIVA il primo,
// che andava perso. Ora chi spedisce aspetta. Si prova il contratto intero,
// perche` una coda che non si svuota e` peggio di un allarme perso: li perde
// tutti.
nuovoOrdine();
ok(Array.isArray(g._codaAllarmi) && inCoda() === 0 && g._allarmeInVolo === null,
   `si parte con la coda vuota e nessun allarme in volo (${inCoda()})`);
ok(typeof g.spedisciAllarmiInCoda === 'function', 'window.spedisciAllarmiInCoda esiste');

// UN ALLARME SOLO: parte subito, coda 0. E` il caso di sempre, e non deve
// essere peggiorato dalla coda.
g.inviaAllarmeAro({ attaccante: 'Zero', azione: 'PROVA 1', bersagli: [] });
ok(allarmi().length === 1, `un allarme solo parte subito (${allarmi().length})`, azioni());
ok(inCoda() === 0, `e la coda resta vuota (${inCoda()})`);
ok(!!g._allarmeInVolo, 'ma resta segnato in volo: nessuno l ha ancora letto');

// DUE DI FILA CON L'HUB FERMO: sul canale solo il primo, coda 1.
g.inviaAllarmeAro({ attaccante: 'Zero', azione: 'PROVA 2', bersagli: [] });
ok(allarmi().length === 1,
   `col primo ancora sul canale, il secondo NON parte (${allarmi().length})`, azioni());
ok(inCoda() === 1, `e aspetta in coda (${inCoda()})`);
ok(azioni()[0] === 'PROVA 1', `sul canale c e ancora il PRIMO, non il secondo (${azioni()[0]})`);

// CHI LEGGE SVUOTA I TRATTI: allora parte il secondo, e in ORDINE.
consuma();
ok(allarmi().length === 2, `consumato il primo, parte il secondo (${allarmi().length})`, azioni());
ok(J(azioni()) === J(['PROVA 1', 'PROVA 2']),
   `e l ordine e quello di partenza, non invertito (${J(azioni())})`);
ok(inCoda() === 0, `coda di nuovo vuota (${inCoda()})`);

console.log('\n=== 8. L attesa massima: dopo 4000 ms il successivo parte comunque ===');
// Dichiarata da MOTORE come NON PROVATA DA NESSUNO. Si prova con l'orologio
// pilotabile: senza poter spostare il tempo servirebbero quattro secondi di
// attesa vera a ogni giro della suite, e nessuno li paga.
// La ragione della regola: se il reattivo e` spento o l'Hub e` chiuso,
// aspettare per sempre vorrebbe dire non avvisare mai piu` nessuno.
nuovoOrdine();
g.inviaAllarmeAro({ attaccante: 'Zero', azione: 'BLOCCANTE', bersagli: [] });
g.inviaAllarmeAro({ attaccante: 'Zero', azione: 'IN ATTESA', bersagli: [] });
ok(inCoda() === 1 && allarmi().length === 1,
   `col lettore fermo: uno sul canale, uno in coda (${allarmi().length}, coda ${inCoda()})`);
// Si avanza di poco: NON deve partire. Senza questa meta`, "parte dopo 4000"
// non distingue "aspetta il tempo giusto" da "parte sempre".
g.__ora += 3000;
g.spedisciAllarmiInCoda();
ok(allarmi().length === 1, `dopo 3000 ms aspetta ancora (${allarmi().length})`, azioni());
// Oltre la soglia: parte comunque, e nessuno lo ha consumato.
g.__ora += 1500;
g.spedisciAllarmiInCoda();
ok(allarmi().length === 2,
   `dopo 4500 ms parte comunque, senza che nessuno abbia letto (${allarmi().length})`, azioni());
ok(J(azioni()) === J(['BLOCCANTE', 'IN ATTESA']), `e nell ordine giusto (${J(azioni())})`);
ok(inCoda() === 0, `e la coda si e svuotata (${inCoda()})`);

console.log('\n=== 9. CONTROPROVA: la coda non e` un tappo ===');
// Il rischio di una coda e` l'opposto del difetto che chiude: che non si
// svuoti mai e gli allarmi non partano piu`. Tre Ordini di fila, consumando
// fra l'uno e l'altro come fa chi legge, devono dare TRE allarmi.
nuovoOrdine();
['UNO', 'DUE', 'TRE'].forEach(function (et) {
    g.inviaAllarmeAro({ attaccante: 'Zero', azione: et, bersagli: [] });
    consuma();
});
ok(allarmi().length === 3, `tre allarmi consumati, tre partiti (${allarmi().length})`, azioni());
ok(J(azioni()) === J(['UNO', 'DUE', 'TRE']), `in ordine (${J(azioni())})`);
ok(inCoda() === 0, `e niente resta appeso in coda (${inCoda()})`);

console.log('\n=== 10. LA GUARDIA DENTRO inviaAllarmeAro: vale per OGNI chiamante ===');
// Fino alla 2026-10-06.7 "un allarme per Ordine" lo garantiva solo il router
// (selectAction non rialza l'allarme in seconda meta`). Chi chiamava da fuori
// lo saltava: al tavolo di Paolo, il 6 ottobre, l'Idle da requisito fallito
// premuto dopo un Attacco BS gia` dichiarato mandava un SECONDO allarme e il
// reattivo si vedeva chiedere un nuovo ARO. Dalla 2026-10-07.1 la guardia sta
// in inviaAllarmeAro. Qui la si chiama DIRETTAMENTE, senza passare dal
// router: e` il percorso che le sezioni sopra non toccano. (Richiesta della
// chat TEST, 7 ottobre.)
nuovoOrdine();
g.currentOrder.id = 'ordine_guardia_A';
const esitoPrimo = g.inviaAllarmeAro({ attaccante: 'Zero', azione: 'ATTACCO BS', bersagli: [] });
consuma();
const esitoSecondo = g.inviaAllarmeAro({ attaccante: 'Zero', azione: 'IDLE', bersagli: [] });
consuma();
ok(allarmi().length === 1, `stesso Ordine, due chiamate: UN allarme solo (${allarmi().length})`, azioni());
ok(J(azioni()) === J(['ATTACCO BS']), `ed è quello della prima Abilità (${J(azioni())})`);
ok(esitoSecondo && esitoSecondo.inviato === false && esitoSecondo.ripetuto === true,
   `la seconda chiamata risponde { inviato:false, ripetuto:true } (${J(esitoSecondo)})`);
ok(!(esitoPrimo && esitoPrimo.ripetuto), `la prima no (${J(esitoPrimo)})`);
ok(allarmi()[0] && allarmi()[0].dato && allarmi()[0].dato.ordineId === 'ordine_guardia_A',
   `l allarme porta l id dell Ordine, messo da inviaAllarmeAro (${allarmi()[0] && allarmi()[0].dato && allarmi()[0].dato.ordineId})`);
ok(inCoda() === 0, `e la chiamata ripetuta non resta in coda (${inCoda()})`);
// CONTROPROVA: un Ordine diverso avvisa di nuovo. Senza, "non ripete" non si
// distingue da "non manda piu` niente".
g.currentOrder.id = 'ordine_guardia_B';
const esitoAltro = g.inviaAllarmeAro({ attaccante: 'Zero', azione: 'MOVIMENTO', bersagli: [] });
consuma();
ok(allarmi().length === 2 && !(esitoAltro && esitoAltro.ripetuto),
   `un Ordine diverso avvisa di nuovo (${allarmi().length})`, azioni());
// ...e lo stesso id scritto NEL payload, non letto da currentOrder, e` fermato.
const esitoEsplicito = g.inviaAllarmeAro({ attaccante: 'Zero', azione: 'IDLE', bersagli: [], ordineId: 'ordine_guardia_B' });
consuma();
ok(allarmi().length === 2 && esitoEsplicito && esitoEsplicito.ripetuto === true,
   `l id scritto nel payload vale come quello di currentOrder (${allarmi().length}, ${J(esitoEsplicito)})`);
// SENZA identificativo la guardia NON puo` sapere, e l'allarme parte sempre.
// E` la via che la aggira: va fissata, cosi` chi la apre lo sa.
nuovoOrdine();                         // currentOrder senza id
g.inviaAllarmeAro({ attaccante: 'Zero', azione: 'SENZA ID 1', bersagli: [] }); consuma();
g.inviaAllarmeAro({ attaccante: 'Zero', azione: 'SENZA ID 2', bersagli: [] }); consuma();
ok(allarmi().length === 2, `senza id d Ordine partono tutti e due: la guardia non può sapere (${allarmi().length})`, azioni());
ok(allarmi().every(a => a.dato && a.dato.ordineId == null), 'e nessuno dei due porta un id inventato');

console.log('\n=== 11. aroAtteso dice se per QUESTO Ordine un allarme e` partito ===');
// Si chiama creaPayload direttamente: e` li` che il campo si scrive, per
// tutti i moduli. Quattro casi, e i tre che devono dare false sono le
// controprove: senza, "true" non si distingue da "sempre true".
const M11 = g.MotoreN5;
const busta11 = (op) => { const e = M11.creaPayload([], Object.assign({ consentiVuoto: true }, op || {})); return e.payload ? e.payload.aroAtteso : 'nessuna busta'; };
g.currentOrder = { id: 'ordine_11_A' }; g._ordineAllarmato = 'ordine_11_A';
ok(busta11() === true, `allarme partito per questo Ordine, il modulo non dice niente: true (${busta11()})`);
g._ordineAllarmato = 'ordine_11_VECCHIO';
ok(busta11() === false, `l allarme è di un Ordine PRIMA: false (${busta11()})`);
ok(busta11({ aroAtteso: true }) === true, `ma se il modulo lo dice, vale quello che dice (${busta11({ aroAtteso: true })})`);
g.currentOrder = {}; g._ordineAllarmato = 'ordine_11_A';
ok(busta11() === false, `Ordine senza identificativo: non si può sapere, false come prima (${busta11()})`);
g.currentOrder = { id: 'ordine_11_C' }; g._ordineAllarmato = null;
ok(busta11() === false, `nessun allarme mai partito (Movimento Cauto fuori LoF): false (${busta11()})`);

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
