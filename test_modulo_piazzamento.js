// @versione 2026-10-26.1 | test_modulo_piazzamento.js | proprieta`: chat TEST
// .1 (26 ott): sez. 4 e 11-bis girate, DIS-06 (motore 2026-10-26.3, ordine_piazzamento
//    2026-10-26.1): la domanda e` DOPPIA, il «si`» al Marker da solo non blocca, decide
//    il nemico scoperto. Sez. 14 nuova: M.haAreaInnesco, il Repeater senza domande.
// .1 (12 ott): sezione 13 — Zero (Shock Mine) piazza tre mine, la quarta e`
//    bloccata (ordine_piazzamento 2026-10-12.1, motore 2026-10-12.6). L'uso
//    resta sull'unita` del roster via sostituisciUnita, quello VERO di
//    motore_core; il terzo non e` respinto all'invio con E17.
// Passata 3: piazzamento e innesco da ZdC — node test_modulo_piazzamento.js
// .2 (7 ott): il colore del tasto si prova contro M.COLORE_TASTO E si pretende
//    non vuoto e diverso dal giallo dell IDLE — alla .1 era una tautologia.
global.window = global;
const DIR = (process.env.CARTELLA || __dirname).replace(/\/?$/, '/');
let passati = 0, falliti = 0;
function ok(c, n, e) { if (c) { passati++; console.log(`  ✅ ${n}`); } else { falliti++; console.log(`  ❌ ${n}${e ? '\n       ' + e : ''}`); } }

const el = {};
function nodo(id) { return el[id] || (el[id] = { id, innerHTML: '', innerText: '', style: {},
    appendChild() {}, remove() {}, cloneNode() { return nodo(id + '_c'); }, parentNode: { replaceChild() {} } }); }
global.document = { title: 'NOMADS', getElementById: (i) => nodo(i),
    querySelector: () => nodo('btn'), querySelectorAll: () => [],
    createElement: () => ({ style: {}, innerHTML: '', appendChild() {} }) };
let alertUltimo = null; global.alert = (m) => { alertUltimo = m; };
let inviato = null; global.inviaCalcoloAllHub = (p) => { inviato = p; };
global.goToStep = () => {}; global.mostraTitoloUnitaCorrente = () => {};

require('./catalogo_n5.js'); require('./database_comune.js');
require('./database_nomad.js'); require('./database_panoceania.js');
const M = require('./motore_regole_n5.js');
require('./ordine_piazzamento.js');

function moran() { return { id: 'n1', alias: 'Moran', bs: 11, wip: 12, skills: '', states: {},
                            weapon: 'Combi Rifle', equip: 'CrazyKoalas' }; }
function nuovo(u) {
    window.currentOrder = {}; window.coordUnits = [u]; window.coordIndex = 0;
    // Dal 26 settembre il token piazzato va nel ROSTER, non in una lista a
    // parte: Paolo ha deciso che i Deployable stanno "a tutti gli effetti
    // nella lista delle unità". tokenPiazzati resta solo per le copie vecchie.
    window.coordPayloads = []; window.tokenPiazzati = []; window.roster = [u];
    window.deployableRisposte = {}; window.deployableScelta = null;
    inviato = null; alertUltimo = null;
    Object.keys(el).forEach(k => { el[k].innerHTML = ''; });
    window.avviaFaseDeployable('PIAZZARE EQUIPAGGIAMENTO', false);
}

console.log('\n=== 1. Il modulo esiste e NON apre calcolatori ===');
ok(typeof window.avviaFaseDeployable === 'function', 'avviaFaseDeployable definita');
const sz = M.azioneSenzaTiro('PIAZZARE EQUIPAGGIAMENTO');
ok(sz && sz.tipo === 'SHORT_SKILL' && sz.generaAro === true,
   'è un\'Abilità Breve senza tiro che genera ARO');

console.log('\n=== 2. Le armi piazzabili, con gli usi ===');
nuovo(moran());
let h = nodo('weapon-buttons-container').innerHTML;
ok(/CrazyKoala/.test(h), 'i CrazyKoalas compaiono');
ok(!/Combi Rifle/.test(h), 'il Combi Rifle no: non è piazzabile');
ok(/usi/.test(h), 'e si vedono gli usi residui');

console.log('\n=== 3. Le domande, perché l app non ha la mappa ===');
window.scegliArmaDaPiazzare('CrazyKoalas');
h = nodo('targets-allocation-container').innerHTML;
ok(/Marker mimetico/.test(h), 'si chiede del Marker nell area d innesco');
ok(window.deployableDomande.length >= 1, 'almeno una domanda');
// i CrazyKoalas hanno Perimeter: due domande
const koalaP = M.profiloArma('CrazyKoalas');
if (/PERIMETER/i.test(String(koalaP.traits || ''))) {
    ok(window.deployableDomande.length === 2, 'col Tratto Perimeter: due domande');
} else { ok(true, 'CrazyKoalas senza Perimeter: una domanda'); }

console.log('\n=== 4. DIS-06: la domanda e` DOPPIA, decide il nemico scoperto ===');
// 🔴 GIRATA IL 26 OTTOBRE (motore 2026-10-26.3, ordine_piazzamento 2026-10-26.1).
// Prima un «si`» al Marker nell'area bloccava da solo, con la frase «NEGATO,
// salvo che...»: il «salvo che» lo doveva risolvere il giocatore a memoria.
// Ora markerNellArea=si` apre una seconda domanda (riga 7572-7573), e decide
// quella: nemico valido scoperto si` -> si piazza, no -> NEGATO.
ok(window.piazzamentoBloccato().incompleto === true, 'senza risposte: bloccato, incompleto');
window.rispondiDeployable('markerNellArea', true);   // c'è un Marker nemico
let bloc = window.piazzamentoBloccato();
ok(bloc.incompleto === true, 'col Marker nell area da solo: NON bloccato, manca una risposta (' + bloc.motivo + ')');
ok(window.deployableDomande.some(d => d.id === 'nemicoScopertoNellArea'), 'e compare la seconda domanda: un nemico valido scoperto nell area?');
ok(/nemico valido/.test(nodo('targets-allocation-container').innerHTML), '  scritta nella pagina');
window.rispondiDeployable('percorsoLibero', true);
window.rispondiDeployable('nemicoScopertoNellArea', false);
bloc = window.piazzamentoBloccato();
ok(bloc.bloccato === true && !bloc.incompleto, 'nessun nemico scoperto: BLOCCATO');
ok(/NEGATO/.test(bloc.motivo) && /7572/.test(bloc.motivo), 'col motivo del regolamento (riga 7572)');
window.eseguiPiazzamento();
ok(alertUltimo && /NON è stato eseguito/.test(alertUltimo), 'e l ordine non si esegue');
ok(window.roster.length === 1, 'nessun token creato: nel roster c e solo il portatore');
// CONTROPROVA: lo stesso Marker, ma con un nemico scoperto nell area -> si piazza.
nuovo(moran()); window.scegliArmaDaPiazzare('CrazyKoalas');
window.rispondiDeployable('markerNellArea', true); window.rispondiDeployable('percorsoLibero', true);
window.rispondiDeployable('nemicoScopertoNellArea', true);
ok(window.piazzamentoBloccato().bloccato === false, 'CONTROPROVA: Marker nell area ma anche un nemico scoperto: non bloccato');
window.eseguiPiazzamento();
ok(window.roster.length === 2 && inviato !== null, '  e il gettone nasce (' + window.roster.length + ')');

console.log('\n=== 5. Rispondendo NO, il token si crea ===');
nuovo(moran());
window.scegliArmaDaPiazzare('CrazyKoalas');
window.deployableDomande.forEach(d => window.rispondiDeployable(d.id, d.rispostaBloccante === false));
ok(window.piazzamentoBloccato().bloccato === false, 'non più bloccato');
window.eseguiPiazzamento();
ok(window.roster.length === 2, `un token creato, in coda al roster (${window.roster.length})`);
const tok = window.roster[window.roster.length - 1];
ok(tok !== window.roster[0], 'e non è il portatore');
ok(tok.deployable === true, 'col flag deployable');
ok(tok.ordineDiPiazzamento != null, 'e l Ordine di piazzamento (riga 5532)');
ok(tok.categoriaDeployable === 'PERIMETER' && tok.tipo === undefined,
   'categoriaDeployable, non `tipo`');

console.log('\n=== 6. L uso è scalato sul portatore ===');
const dopo = window.coordUnits[0];
const usi = M.usiResidui(dopo, M.profiloArma('CrazyKoalas'));
if (usi) {
    ok(usi.spesi === 1, `un uso speso (${usi.spesi})`);
} else { ok(true, 'CrazyKoalas non è Disposable'); }

console.log('\n=== 7. Il payload, e il canale che non esiste ===');
ok(inviato !== null, 'spedito all Hub');
const a = inviato && inviato.attacchi[0];
ok(a && a.azione === 'PIAZZARE EQUIPAGGIAMENTO', 'azione canonica');
ok(a && a.regole.senzaTiro === true, 'senza tiro');
ok(a && a.bersagli.length === 0, 'nessun bersaglio');
ok(a && a.regole.token && a.regole.token.id, 'col token nel payload');
ok(a && a.regole.portatoreAggiornato, 'e il portatore con l uso scalato');
// 🔴 GIRATA IL 7 OTTOBRE. L'avviso "il token NON è stato spedito
// all'avversario" è stato TOLTO dalla schermata: il token ora parte col
// roster, nel giro di AGGIORNAMENTO. L'avviso descriveva un buco che non
// c'è più, e un avviso che mente è peggio di nessun avviso.
const esito = nodo('calc-result').innerHTML;
ok(!/NON è stato spedito/.test(esito),
   'l avviso sul canale inesistente è sparito: il token viaggia col roster');
// Ma la schermata deve ancora dire le due cose che al tavolo contano: che il
// gettone è visibile e bersagliabile dal PROSSIMO Ordine, e che in QUESTO
// il nemico può reagire solo contro chi lo ha piazzato. Senza queste due,
// "l avviso è sparito" si confonderebbe con "la schermata non dice niente".
ok(/bersagliabile dal prossimo Ordine/.test(esito),
   'la schermata dice che il gettone è bersagliabile dal prossimo Ordine');
ok(/reagire solo contro chi lo ha piazzato/.test(esito),
   'e che in questo Ordine il nemico reagisce solo contro chi lo ha piazzato');
ok(/PIAZZATO/.test(esito), 'e nomina il gettone piazzato');

console.log('\n=== 8. Il Disco Ball NON passa da qui ===');
ok(M.deployableDaEsito(M.profiloArma('CrazyKoalas')) === null,
   'i CrazyKoalas nascono dall equipaggiamento');
const kulak = { id: 'n2', alias: 'Kulak', bs: 11, skills: '', states: {}, equip: 'Disco Baller' };
const piazzabili = M.armiPiazzabili(kulak);
ok(!piazzabili.armi.some(x => /Disco Ball\b/.test(x.nome)),
   'il Disco Ball non compare fra le armi piazzabili: nasce dall esito del tiro');

console.log('\n=== 9. L innesco da ZONA DI CONTROLLO ===');
// Tutta la generazione ARO presuppone la LoF; il Boost scatta sulla ZdC.
const koala = M.profiloArma('CrazyKoalas');
const scoperto = { alias: 'Fusilier', states: {} };
const inCamo   = { alias: 'Croc Man', states: { camo: true } };
const altroDep = { alias: 'Mina', states: {}, deployable: true };
ok(M.innescoDeployable(koala, scoperto, { percorsoLibero: true }).scatta === true,
   'nemico scoperto in ZdC: scatta');
ok(M.innescoDeployable(koala, inCamo, { percorsoLibero: true }).scatta === false,
   'Marker Mimetico: NON scatta');
ok(M.innescoDeployable(koala, altroDep, { percorsoLibero: true }).scatta === false,
   'un altro Deployable: NON lo innesca');
ok(M.innescoDeployable(koala, scoperto, { percorsoLibero: false }).scatta === false,
   'percorso bloccato: NON scatta');
const senzaRisposta = M.innescoDeployable(koala, scoperto, {});
ok(senzaRisposta.note.some(n => /Percorso non verificato/.test(n)),
   'e senza risposta lo dichiara invece di darlo per buono');

console.log('\n=== 10. La risoluzione del Boost ===');
const fus = { alias: 'Fusilier', bs: 12, ph: 10, arm: 1, bts: 0, skills: '', states: {} };
const sc = M.risolviScontro(
    { attaccante: { alias: '-', bs: 0, skills: '', states: {} }, azione: M.AZIONI.BS_ATTACK,
      arma: koala, bersaglio: fus, burst: 1, ammo: koala.ammo },
    { difensore: fus, azione: 'DODGE', hasLoF: false }, {});
ok(sc.tipo === 'NORMALE', 'TIRO NORMALE, non Faccia a Faccia');
ok(sc.attivo.mod === 'Auto', 'il deployable non tira');
ok(sc.reattivo.mod === 10, 'la Schivata è a PH pieno: la LoF non c entra');
ok(sc.attivo.salvezzaInflitta.valoreSuccesso === 6, 'e il Fusilier si salva su ARM VS 6');

console.log('\n=== 11. logica_aro conosce i deployable ===');
// Queste tre sono ricerche di testo nel sorgente: dicono che il file CHIAMA
// quelle funzioni, non che l'ARO funzioni. Il comportamento vero lo misura
// test_aro_filtro_repeater.js, che logica_aro.js lo carica per davvero.
// Si pretende la forma dell'assegnazione, non la parola: "attivaDeployable"
// comparirebbe anche solo in un commento.
const src = require('fs').readFileSync(DIR + 'logica_aro.js', 'utf8');
ok(/innescoDeployable\s*\(/.test(src), 'logica_aro chiama innescoDeployable');
ok(/(window|G)\.attivaDeployable\s*=\s*function/.test(src),
   'e il gestore della risposta è DEFINITO, non solo nominato');
ok(/ordineDiPiazzamento/.test(src), 'e legge l Ordine di piazzamento (riga 5532)');
// 🔴 TOLTA il 6 ottobre: qui c'era
//     ok(typeof window.attivaDeployable === 'undefined' || true, ...)
// che con "|| true" era verde sempre. Una prova che non può fallire non è
// una prova: è una riga che fa salire il totale. Sostituita da quella sopra.

console.log('\n=== 11-bis. I TRE STATI DEL TASTO, e il colore della risposta ===');
// Nuovo il 7 ottobre (richiesta di Paolo, A-07). Prima il terzo stato
// diceva "PIAZZAMENTO NON CONSENTITO" e non portava da nessuna parte: per
// fare l'Idle serviva un secondo tasto giallo fisso sotto, che adesso non
// c'è più. Un tasto che nomina un divieto senza offrire la via d'uscita è
// la stessa famiglia di difetti: dice e non fa.
// Il tasto vive su btn-esegui-calcolo, che il modulo CLONA per ripulire
// l'onclick; nel finto DOM di questo banco il clone si chiama
// 'btn-esegui-calcolo_c', e va letto lì — sull'originale resta l'etichetta
// vecchia, e una prova che guarda l'originale è verde per sbaglio.
function tastoPiazza() { const n = el['btn-esegui-calcolo_c'] || {};
    return { testo: n.innerText, sfondo: (n.style || {}).background, onclick: n.onclick }; }
function pronta(u, risposteBloccanti) {
    window.currentOrder = { unit: u }; window.coordUnits = [u]; window.coordIndex = 0;
    window.coordPayloads = []; window.tokenPiazzati = []; window.roster = [u];
    window.deployableRisposte = {}; window.deployableScelta = null;
    inviato = null; alertUltimo = null;
    Object.keys(el).forEach(k => { el[k].innerHTML = ''; });
    window.avviaFaseDeployable('PIAZZARE EQUIPAGGIAMENTO', false);
    window.scegliArmaDaPiazzare('CrazyKoalas');
    if (risposteBloccanti !== undefined) {
        window.deployableDomande.forEach(d => window.rispondiDeployable(d.id, d.rispostaBloccante === risposteBloccanti));
    }
    return window.deployableDomande;
}

// STATO 1: manca una risposta.
const dom = pronta(moran());
window.aggiornaPulsantePiazza();
ok(tastoPiazza().testo === 'RISPONDI ALLE DOMANDE',
   `nessuna risposta: il tasto dice RISPONDI ALLE DOMANDE (${tastoPiazza().testo})`);
window.rispondiDeployable(dom[0].id, dom[0].rispostaBloccante === false);
ok(tastoPiazza().testo === 'RISPONDI ALLE DOMANDE',
   `e con UNA risposta su due lo dice ancora (${tastoPiazza().testo})`);
// STATO 2: tutte libere.
window.rispondiDeployable(dom[1].id, dom[1].rispostaBloccante === false);
ok(tastoPiazza().testo === 'PIAZZA',
   `tutte le risposte libere: il tasto dice PIAZZA (${tastoPiazza().testo})`);
// GIRATA sul motore 2026-10-07.11: lo sfondo del tasto valido non e` piu`
// vuoto. I due colori stanno nel motore (M.COLORE_TASTO): valido
// 'var(--nomad-orange)', idle '#ffcc00'. Scrivendo '' il tasto perdeva
// l'arancione della pagina e Paolo al tavolo lo vedeva cambiare colore.
// Si legge dal motore, non a mano: se Paolo cambia l'arancione, questa prova
// non diventa rossa per un motivo che non c'entra col requisito.
// 🔴 Non basta confrontare col valore che il motore dichiara: sarebbe una
// TAUTOLOGIA — i due lati si muovono insieme e la prova non puo` fallire.
// Visto il 7 ottobre rompendo COLORE_TASTO.valido a '' e vedendo il banco
// restare verde. Quindi si pretendono tre cose: che il tasto porti quel
// colore, che quel colore NON sia vuoto (era il difetto di prima) e che sia
// DIVERSO dal giallo dell'IDLE (altrimenti i due stati non si distinguono a
// vista). Cosi` la prova resiste a un cambio di arancione ma non al difetto.
ok(!!M.COLORE_TASTO.valido && M.COLORE_TASTO.valido !== M.COLORE_TASTO.idle,
   `il colore valido c è e non è il giallo dell IDLE (${JSON.stringify(M.COLORE_TASTO)})`);
ok(tastoPiazza().sfondo === M.COLORE_TASTO.valido,
   `e il tasto lo porta (${tastoPiazza().sfondo})`);
// STATO 3: una risposta blocca -> IDLE, giallo, e porta all Idle vero.
// 🔴 GIRATA IL 26 OTTOBRE: a bloccare e` la seconda domanda (nessun nemico
// scoperto), non piu` il «si`» al Marker da solo.
pronta(moran());
window.rispondiDeployable('markerNellArea', true); window.rispondiDeployable('percorsoLibero', true);
ok(tastoPiazza().testo === 'RISPONDI ALLE DOMANDE',
   `il «sì» al Marker da solo non fa IDLE: chiede la seconda (${tastoPiazza().testo})`);
window.rispondiDeployable('nemicoScopertoNellArea', false);
ok(tastoPiazza().testo === 'IDLE',
   `una risposta che blocca: il tasto diventa IDLE, non un divieto muto (${tastoPiazza().testo})`);
ok(tastoPiazza().sfondo === '#ffcc00',
   `ed è giallo (${tastoPiazza().sfondo})`);
// Chi decide che una risposta blocca è il MOTORE, non il modulo.
const giudizio = M.valutaDomanda(window.deployableDomande.find(d => d.id === 'nemicoScopertoNellArea'), false);
ok(giudizio.esito === 'BLOCCATA' && giudizio.puoProcedere === false,
   `e lo decide M.valutaDomanda, non la schermata (${giudizio.esito})`);
const libera = M.valutaDomanda(window.deployableDomande.find(d => d.id === 'markerNellArea'), true);
ok(libera.esito === 'LIBERA' && libera.puoProcedere === true,
   `CONTROPROVA: per M.valutaDomanda il «sì» al Marker da solo è LIBERA (${libera.esito})`);
let motivoIdle = null;
const salvaDRF = window.dichiaraRequisitoFallito;
window.dichiaraRequisitoFallito = (m) => { motivoIdle = m; return true; };
tastoPiazza().onclick();
ok(motivoIdle !== null, 'cliccandolo chiama window.dichiaraRequisitoFallito');
ok(/NEGATO/.test(String(motivoIdle)) && /7572/.test(String(motivoIdle)),
   `col motivo scritto dal motore, non inventato dal modulo (${String(motivoIdle).slice(0, 60)}…)`);
ok(inviato === null, 'e NON spedisce la busta del piazzamento: il gettone non si piazza');
window.dichiaraRequisitoFallito = salvaDRF;

console.log('\n=== 12. D-03: l allarme parte ALL INGRESSO, non al PIAZZA ===');
// GIRATA IL 7 OTTOBRE, e il cambio è di sostanza, non di dettaglio.
// Place Deployable è una SHORT SKILL: è SEMPRE la seconda metà dell'Ordine
// (riga 7550; combinazioni alle righe 1047-1054). Le tre forme ammesse sono
// MOVIMENTO + PIAZZARE, SCOPRIRE + PIAZZARE, IDLE + PIAZZARE.
// Quindi chi "piazza e basta" ha dichiarato IDLE + PIAZZARE, e l'ARO si
// dichiara subito dopo la PRIMA Abilità (righe 1088-1090): l'allarme parte
// all'INGRESSO nella schermata, con azione IDLE, PRIMA delle domande —
// così l'avversario sceglie l'ARO mentre il giocatore risponde.
// Fino al 6 ottobre questo banco pretendeva il contrario: un allarme col
// nome 'PIAZZARE EQUIPAGGIAMENTO' spedito AL PIAZZA, insieme alla busta.
// Era sbagliato due volte — nel momento e nel nome — e al tavolo l'Hub
// chiudeva il calcolo mentre il reattivo scegliendo ancora l'ARO
// (segnalato da Paolo il 6 ottobre).
let allarmi = [];
global.inviaAllarmeAro = (p) => { allarmi.push(p); };

// L'unità va messa in currentOrder.unit come fa l'app: M.allarmeOrdine
// legge ctx.unita da lì, e senza quella il nome dell'attaccante esce
// stringa vuota — un allarme anonimo che a leggerlo sembra sano.
function nuovoConUnita(u, secondaMeta) {
    window.currentOrder = {}; window.coordUnits = [u]; window.coordIndex = 0;
    window.coordPayloads = []; window.tokenPiazzati = []; window.roster = [u];
    window.deployableRisposte = {}; window.deployableScelta = null;
    inviato = null; alertUltimo = null; allarmi = [];
    Object.keys(el).forEach(k => { el[k].innerHTML = ''; });
    window.currentOrder.unit = u;
    window.avviaFaseDeployable('PIAZZARE EQUIPAGGIAMENTO', !!secondaMeta);
}

nuovoConUnita(moran(), false);
ok(allarmi.length === 1,
   `dichiarato per primo: l allarme parte ALL INGRESSO, una volta sola (${allarmi.length})`);
const al = allarmi[0] || {};
ok(al.azione === 'IDLE',
   `e l azione dichiarata è IDLE, non PIAZZARE: è la prima metà (${al.azione})`);
ok(al.azionePrimaMeta === 'IDLE',
   `con azionePrimaMeta coerente (${al.azionePrimaMeta})`);
ok(al.attaccante === 'Moran' && Array.isArray(al.bersagli) && al.bersagli.length === 0,
   `col nome di chi la dichiara e nessun bersaglio (${al.attaccante}, ${(al.bersagli || []).length} bersagli)`);
ok(window.currentOrder.aroDaIdleImplicito === true,
   'e il modulo si ricorda che l ARO è atteso (aroDaIdleImplicito)');
// E la schermata lo DICE al giocatore, perché "l Ordine finisce qui" è la
// cosa che al tavolo si sbaglia.
ok(/IDLE \+ PIAZZARE/.test(nodo('weapon-buttons-container').innerHTML),
   'la schermata avvisa che dichiarata per prima vale IDLE + PIAZZARE');

// AL PIAZZA: solo la busta, MAI un secondo allarme. Prima partivano
// insieme, ed è il difetto che Paolo ha visto al tavolo.
window.scegliArmaDaPiazzare('CrazyKoalas');
window.deployableDomande.forEach(d => window.rispondiDeployable(d.id, d.rispostaBloccante === false));
ok(allarmi.length === 1,
   `rispondere alle domande NON manda altri allarmi (${allarmi.length})`);
window.eseguiPiazzamento();
ok(allarmi.length === 1,
   `e al PIAZZA non parte nessun allarme: resta quello dell ingresso (${allarmi.length})`);
ok(inviato !== null, 'al PIAZZA parte la busta');
ok(inviato && inviato.aroAtteso === true,
   `che dice all Hub di aspettare l ARO (aroAtteso ${inviato && inviato.aroAtteso})`);

// CONTROPROVA DEL MOMENTO: in SECONDA metà l'allarme l'ha già mandato la
// prima Abilità (il Movimento, lo Scoprire), quindi qui NON parte nulla —
// solo la busta, e senza aroAtteso. Senza questa prova, "un allarme
// all ingresso" non si distingue da "un allarme sempre".
nuovoConUnita(moran(), true);
ok(allarmi.length === 0,
   `in seconda metà NESSUN allarme all ingresso: l ha mandato la prima Abilità (${allarmi.length})`);
ok(window.currentOrder.aroDaIdleImplicito === false,
   'e nessun ARO da Idle implicito');
ok(!/IDLE \+ PIAZZARE/.test(nodo('weapon-buttons-container').innerHTML),
   'e la schermata non parla di IDLE + PIAZZARE: non è quel caso');
window.scegliArmaDaPiazzare('CrazyKoalas');
window.deployableDomande.forEach(d => window.rispondiDeployable(d.id, d.rispostaBloccante === false));
window.eseguiPiazzamento();
ok(allarmi.length === 0,
   `in seconda metà non parte nessun allarme, in nessun momento (${allarmi.length})`);
ok(inviato !== null && inviato.aroAtteso === false,
   `ma la busta parte, con aroAtteso false (${inviato && inviato.aroAtteso})`);

// CONTROPROVA 1 — aroAtteso non è inchiodato a true: un'azione che NON
// genera ARO non lo alza. Senza, "true" non distingue "letto" da "scritto".
// L'unica azione del vocabolario che non genera ARO e` ALLERTA (misurato il
// 6 ottobre su tutto l'elenco: Trincerarsi, Rientro in CAMO e Cybermask lo
// generano, al contrario di quanto avevo supposto scrivendo questa prova).
const senzaAro = M.allarmeOrdine('ALLERTA', { unita: moran(), coordUnits: [moran()] });
ok(senzaAro.aro && senzaAro.aro.genera === false && senzaAro.payload === null,
   `Allerta non genera ARO e non ha allarme (genera ${senzaAro.aro && senzaAro.aro.genera})`);
// CONTROPROVA 2 — il piazzamento BLOCCATO non alza l allarme: l'ordine non
// è stato dichiarato, e avvisare l'avversario di un ordine che non c'è è
// peggio che tacere.
nuovo(moran());
window.scegliArmaDaPiazzare('CrazyKoalas');
window.rispondiDeployable('markerNellArea', true);
allarmi = [];
window.eseguiPiazzamento();
ok(allarmi.length === 0, `piazzamento bloccato: nessun allarme (${allarmi.length})`);

// La nota sulla schermata parla del TOKEN, non dell ARO: sono due canali
// diversi, e leggerla come "non è partito nulla" sarebbe un errore.
ok(/NON è stato spedito/.test(nodo('calc-result').innerHTML) === false ||
   /token NON è stato spedito/.test(nodo('calc-result').innerHTML),
   'la nota in schermata riguarda il token, non l allarme ARO');


console.log('\n=== 13. Zero (Shock Mine): tre mine, la quarta bloccata ===');
// Difetto vecchio, chiuso il 12 ottobre (MOTORE): la pagina chiamava
// window.aggiornaUnitaRoster, che non esiste. L'uso scalato restava in
// coordUnits e moriva con l'ordine, e la quarta mina si piazzava come la
// prima. Inoltre il terzo e ultimo uso era respinto all'invio con E17.
// sostituisciUnita qui e` quello VERO, preso da motore_core.js.
{
    const core = require('fs').readFileSync(DIR + 'motore_core.js', 'utf8');
    const i = core.indexOf('window.sostituisciUnita = function'), j = core.indexOf('\n};\n', i);
    ok(i >= 0 && j > i, 'sostituisciUnita si trova in motore_core.js');
    if (i >= 0 && j > i) eval(core.slice(i, j + 3));
    window.MotoreN5 = window.MotoreN5 || M;
    const zitto = (fn) => { const lg = console.log, lw = console.warn; console.log = () => {}; console.warn = () => {}; try { return fn(); } finally { console.log = lg; console.warn = lw; } };
    const zv = (window.DB_NOMADI || []).find(u => u.nome === 'Zero (Combi Rifle)');
    const zero = Object.assign(JSON.parse(JSON.stringify(zv)), { id: 'z1', alias: 'Zero', states: {}, deployState: 'NORMAL', state: 'ACTIVE', combatGroup: 1 });
    ok(/Shock Mine/.test(zero.weapon) && M.usiResidui(zero, M.profiloArma('Shock Mine')).totali === 3, 'premessa: Zero (Combi Rifle) porta la Shock Mine, Disposable (3)');
    window.roster = [zero];
    const grezze = [], spediti = [];
    function piazzaUna() {
        window.currentOrder = {}; window.coordUnits = [window.roster[0]]; window.coordIndex = 0;
        window.coordPayloads = []; window.tokenPiazzati = []; window.deployableRisposte = {}; window.deployableScelta = null;
        inviato = null; alertUltimo = null;
        zitto(() => {
            window.avviaFaseDeployable('PIAZZARE EQUIPAGGIAMENTO', false);
            window.scegliArmaDaPiazzare('Shock Mine');
            (window.deployableDomande || []).forEach(d => window.rispondiDeployable(d.id, d.rispostaBloccante === false));
            window.eseguiPiazzamento();
        });
        grezze.push(window.coordPayloads[window.coordPayloads.length - 1] || null); spediti.push(inviato);
    }
    piazzaUna(); piazzaUna(); piazzaUna();
    const usi = () => ((window.roster[0].usiSpesi || {})['SHOCK MINE']);
    const token = () => window.roster.filter(u => u.deployable === true).length;
    ok(spediti.every(x => x !== null) && usi() === 3 && token() === 3,
       `tre mine piazzate: tre buste spedite, 3 usi sull unita\` del roster, 3 segnalini (${spediti.filter(Boolean).length}, ${usi()}, ${token()})`);
    ok(grezze[2] && grezze[2].regole && grezze[2].regole.usoGiaScalato === true && !(M.creaAttacco(grezze[2]).errori || []).some(e => e.codice === 'E17'),
       'la terza busta (3 usi su 3, usoGiaScalato) non e` respinta con E17');
    piazzaUna();
    ok(spediti[3] === null && token() === 3 && usi() === 3 && alertUltimo,
       `la quarta e\` bloccata: niente spedito, segnalini e usi restano 3 (${String(alertUltimo).slice(0, 70)})`);
    // Controprova: senza sostituisciUnita l'uso non arriva al roster. E` il
    // difetto di prima, rifatto a mano: la prova di sopra non e` una tautologia.
    const vera = window.sostituisciUnita; window.sostituisciUnita = undefined;
    const z2 = Object.assign(JSON.parse(JSON.stringify(zv)), { id: 'z2', alias: 'Zero2', states: {}, deployState: 'NORMAL', state: 'ACTIVE' });
    window.roster = [z2]; piazzaUna();
    ok(!((window.roster[0].usiSpesi || {})['SHOCK MINE']), 'CONTROPROVA: senza sostituisciUnita l uso NON arriva al roster');
    window.sostituisciUnita = vera;
}

console.log('\n=== 14. DEP-08/09: niente domande per chi non ha area d innesco (M.haAreaInnesco) ===');
// Nuova il 26 ottobre (motore 2026-10-26.3, ordine_piazzamento 2026-10-26.1).
// Il divieto del Marker CAMO e` delle sole Deployable Weapon con un'Area
// d'Innesco (riga 7572; REGOLE, DEP-08). Il Repeater, il FastPanda
// (Indiscriminate, riga 15041), la Deployable Cover e la Disco Ball
// (Targetless, DEP-09) si piazzano senza domande; le mine, il WildParrot, il
// Drop Bear e le Perimeter (CrazyKoala, MadTraps: la ZdC) le tengono.
ok(typeof M.haAreaInnesco === 'function', 'premessa: il motore ha M.haAreaInnesco');
if (typeof M.haAreaInnesco === 'function') {
    const senza = ['Deployable Repeater', 'FastPanda', 'Deployable Cover (Cutting Foam)', 'Deployable Cover (Vitroferro)', 'Disco Ball'];
    const con = ['Shock Mine', 'AP Mine', 'PARA Mine', 'WildParrot', 'Drop Bears (Deployable Mode)', 'CrazyKoalas', 'Madtraps'];
    const vs = senza.filter(a => M.profiloArma(a) && M.haAreaInnesco(M.profiloArma(a)) === false);
    ok(vs.length === senza.length, `senza area d innesco: ${senza.join(', ')} (${vs.length}/${senza.length})`);
    const vc = con.filter(a => M.profiloArma(a) && M.haAreaInnesco(M.profiloArma(a)) === true);
    ok(vc.length === con.length, `con l area: ${con.join(', ')} (${vc.length}/${con.length})`);
    // Dalla porta del giocatore: il Repeater si sceglie e il tasto dice subito PIAZZA.
    const rep = { id: 'n3', alias: 'Rep', bs: 11, wip: 12, skills: '', states: {}, weapon: 'Submachine Gun', equip: 'Deployable Repeater' };
    nuovo(rep);
    const arg = (nodo('weapon-buttons-container').innerHTML.match(/scegliArmaDaPiazzare\('([^']+)'/) || [])[1];
    ok(arg === 'Deployable Repeater', `il Repeater ha il suo bottone (${arg})`);
    window.scegliArmaDaPiazzare(arg);
    ok(window.deployableDomande.length === 0, `nessuna domanda (${window.deployableDomande.length})`);
    ok(window.piazzamentoBloccato().bloccato === false && tastoPiazza().testo === 'PIAZZA',
       `e il tasto dice PIAZZA senza rispondere a niente (${tastoPiazza().testo})`);
    window.eseguiPiazzamento();
    ok(window.roster.length === 2 && inviato !== null, `il Repeater nasce (${window.roster.length})`);
    // CONTROPROVA: il CrazyKoala dello stesso giro le domande le ha ancora.
    nuovo(moran()); window.scegliArmaDaPiazzare('CrazyKoalas');
    ok(window.deployableDomande.length === 2 && window.piazzamentoBloccato().incompleto === true,
       `CONTROPROVA: il CrazyKoala chiede ancora (${window.deployableDomande.map(d => d.id).join(', ')})`);
}

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
