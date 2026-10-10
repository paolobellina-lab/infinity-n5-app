// @versione 2026-10-09.3 | test_modulo_guidato.js | proprieta`: chat TEST
// .3 (9 ott, sera): motore 2026-10-09.6. Senza la Skill `armiGuidate().armi` e`
//    VUOTA e le armi che qualificherebbero stanno in `escluse` col motivo
//    'manca la Skill'. Tre prove della .2 cercavano i tre profili con
//    `armi.length > 0` e sono diventate rosse, come dovevano: ora li
//    riconoscono dal motivo dell esclusione. Tre prove nuove: armi vuota per
//    loro, armi vuota per TUTTI i profili senza la Skill, e la controprova su
//    chi la Skill ce l ha. Da 71 a 74 prove.
// .2 (9 ott, sera): MOTORE ha corretto `M.haGuidato` (motore 2026-10-09.5: si
//    legge solo la Skill, tonde o quadre) e il modulo (ordine_attacco_guidato
//    2026-10-09.2: con A95 nessun bottone d arma). Sezione 12 riscritta: le
//    prove inchiodate sul difetto sono cancellate, al loro posto la regola
//    giusta con insiemi nominati e la controprova dei 25 portatori di ECM.
//    Sezione 13 NUOVA: senza la Skill nessun bottone declareGuidatoAttack —
//    prima nessun banco contava i bottoni.
// .1 (9 ott, sera): sezione 12 — chi puo` davvero dichiarare un Guidato.
//    `M.haGuidato` cerca la sottostringa 'GUIDED' in skills + equip e prende
//    per buono l'`ECM (Guided -6)`, che e` la DIFESA contro i Guidati: 27
//    profili risultano capaci, 2 lo sono. Difetto aperto, segnalato a MOTORE.
//    Inchiodato per caratterizzazione (non con 25 nomi) e rotto in tre modi
//    in rompi_gui.sh: haGuidato corretto -> 25 va a 0 e la sezione chiede di
//    essere cancellata; un TAG nuovo con lo stesso ECM -> 26; il Vertigo Zond
//    che perde la Skill -> 1, con la nota che GUI-01/03/05 cambiano soggetto.
// Test end-to-end del modulo Guidato — node test_modulo_guidato.js
// .2 (7 ott): il colore del tasto si prova contro M.COLORE_TASTO E si pretende
//    non vuoto e diverso dal giallo dell IDLE — alla .1 era una tautologia.
global.window = global;
let passati = 0, falliti = 0;
function ok(c, n, e) { if (c) { passati++; console.log(`  ✅ ${n}`); } else { falliti++; console.log(`  ❌ ${n}${e ? '\n       ' + e : ''}`); } }

const el = {};
function nodo(id) { return el[id] || (el[id] = { id, innerHTML: '', innerText: '', style: {},
    appendChild() {}, remove() {}, cloneNode() { return nodo(id + '_c'); }, parentNode: { replaceChild() {} } }); }
global.document = { title: 'NOMADS', getElementById: (i) => nodo(i), querySelector: () => nodo('btn'),
    querySelectorAll: () => [], createElement: () => ({ style: {}, innerHTML: '', appendChild() {} }) };
let alertUltimo = null; global.alert = (m) => { alertUltimo = m; };
let inviato = null; global.inviaCalcoloAllHub = (p) => { inviato = p; };
global.goToStep = () => {}; global.confirmMultiAro = () => {};

require('./catalogo_n5.js'); require('./database_comune.js');
const M = require('./motore_regole_n5.js');
require('./ordine_attacco_guidato.js');

const rem     = { id: 'n1', alias: 'Missile REM', bs: 12, weapon: 'Missile Launcher, Light Shotgun', skills: 'BS Attack (Guided)' };
const senzaSk = { id: 'n2', alias: 'Tuttofare',   bs: 11, weapon: 'Missile Launcher', skills: '' };

M._fazione = 'NOMADI';
M._rosterProprio = [rem, senzaSk];
M._rosterNemico = [
    { id: 'p1', alias: 'Designato', tipo: 'TAG', states: { targeted: true } },
    { id: 'p2', alias: 'Vicino',    tipo: 'LI',  states: {} },
    { id: 'p3', alias: 'Altro',     tipo: 'LI',  states: {} },
    { id: 'p4', alias: 'Croc Man',  tipo: 'LI',  deployState: 'CAMO', states: { camo: true } }
];

function nuovo(u) {
    window.currentOrder = {}; window.coordUnits = [u]; window.coordIndex = 0;
    window.coordPayloads = []; window.combatTargets = []; window.coordMode = false;
    window.primaryGuidedTarget = null; window.secondaryGuidedTargets = [];
    inviato = null; alertUltimo = null;
}

console.log('\n=== 1. ERRORE CORRETTO: l arma non è più inventata ===');
nuovo(rem);
window.avviaFaseGuidato('ATTACCO GUIDATO', false);
let h = nodo('weapon-buttons-container').innerHTML;
ok(!h.includes('Smart Missile'), 'niente "Smart Missile (Guided)", che nel database non esiste');
ok(h.includes('Missile Launcher (Blast'), 'offre le Blast Mode reali dell arma');
ok(h.includes('Missile Launcher (Hit Mode)') && h.includes('Impact Template'),
   'la Hit Mode è esclusa col motivo: non ha il Tratto Impact Template');
ok(h.includes('Impact Template'), 'la motivazione dell esclusione cita il Tratto richiesto');

console.log('\n=== 2. ERRORE CORRETTO: la Skill è un requisito ===');
nuovo(senzaSk);
window.startUnitGuidatoLoop();
h = nodo('weapon-buttons-container').innerHTML;
ok(h.includes('non ha "BS Attack (Guided)"'), 'senza la Skill: avviso a schermo');

console.log('\n=== 3. Primario Bersagliato, secondari no ===');
nuovo(rem);
window.currentOrder.weapon = 'Missile Launcher (Blast Mode)';
window.renderSelezioneBersagliGuidato();
h = nodo('enemy-target-buttons').innerHTML;
ok(nodo('primary-guided-container').innerHTML.includes('Designato'), 'il Bersagliato è offerto come Primario');
ok(!nodo('primary-guided-container').innerHTML.includes('Vicino'), 'un non-Bersagliato NON è offerto come Primario');
ok(nodo('secondary-guided-container').innerHTML.includes('Vicino'), 'ma sì come Secondario');
ok(!nodo('secondary-guided-container').innerHTML.includes('Croc Man'), 'il Marker resta escluso');

window.confermaBersagliSagomaGuidato();
ok(alertUltimo && alertUltimo.includes('Bersaglio Primario'), 'senza Primario: bloccato');

window.togglePrimaryGuided('p1');
window.toggleSecondaryGuided('p2');
window.confermaBersagliSagomaGuidato();
ok(window.pendingTargets.length === 2 && window.pendingTargets[0].id === 'p1',
   'confermati: Primario in testa, poi i secondari');

console.log('\n=== 4. ERRORE CORRETTO: la gittata non viene più buttata via ===');
window.combatTargets = [
    { id: 'p1', name: 'Designato', burst: 0 },
    { id: 'p2', name: 'Vicino', burst: 0 }
];
window.preparaModificatoriGuidati();
const arma = M.profiloArma('Missile Launcher (Blast Mode)');
ok(window.combatTargets[0].rangeMod === arma.bands[0].mod,
   `banda iniziale reale (${window.combatTargets[0].rangeMod}), non 0 fittizio`);
window.setTargetRangeGuidato(3);
ok(window.combatTargets[0].rangeMod === 3 && window.combatTargets[1].rangeMod === 3,
   'la gittata del Primario si applica anche ai secondari: la Sagoma è una sola');

console.log('\n=== 5. MOD: gittata + Bersagliato, niente mimetismo né copertura ===');
const r = M.regoleGuidato(arma, { rangeIndex: 3 });
ok(r.modGittata === 3 && r.bonusBersagliato === 3 && r.modTotale === 6,
   'banda 3 (24-32") +3 e Bersagliato +3 = +6', `ottenuto ${r.modTotale}`);
ok(arma.bands.length === 12, 'il Missile Launcher ha 12 bande fino a 96"');
ok(r.ignoraMimetismo && r.ignoraCopertura, 'Mimetismo e Copertura ignorati');
ok(r.richiedeLoF === false, 'non richiede LoF');
ok(r.coperturaAnnullaSalvezza, 'chi è colpito dalla Sagoma non ha il +3 al Tiro Salvezza');
ok(r.soloPrimarioInF2F && r.criticoSoloSulPrincipale, 'solo il Primario fa il F2F; Critico solo su di lui');

console.log('\n=== 6. Burst dall arma, non scritto a mano ===');
ok(r.burst === arma.burst, `Burst ${r.burst} dalla Blast Mode`);
// 🔴 GIRATA L 8 OTTOBRE (motore dalla .08.9). Questa prova pretendeva
// `combatTargets[1].burst === 0`, ed era il modo SBAGLIATO di dire una
// cosa giusta. Con Burst 0 risolviPayload saltava il secondario, che non
// arrivava al tabellone (difetto misurato da INTERFACCIA): la prova
// fissava proprio il campo che lo faceva sparire.
//
// Ora ogni bersaglio della Sagoma porta il Burst DEL COLPO, come nello
// Speculativo, e "solo il Primario tira" si dice dove va detto: nel
// confronto (soloPrimarioInF2F, criticoSoloSulPrincipale) e negli usi
// (creaAttacco conta il MASSIMO, non la somma: un colpo, un uso).
//
// Le tre prove qui sotto sono quella vecchia rifatta: il Burst, l ARRIVO
// del secondario, e il conto degli usi. La seconda e` la cosa che il
// difetto rompeva, e prima nessuno la guardava.
ok(window.combatTargets[0].burst === arma.burst && window.combatTargets[1].burst === arma.burst,
   `ogni bersaglio della Sagoma porta il Burst del colpo, non 0 (${window.combatTargets[0].burst} / ${window.combatTargets[1].burst})`);
ok(window.combatTargets[1].burst > 0,
   `e quello del secondario NON e` + ` zero: con zero risolviPayload lo saltava e non arrivava al tabellone (${window.combatTargets[1].burst})`);

console.log('\n=== 7. Schermata ===');
h = nodo('targets-allocation-container').innerHTML;
ok(h.includes('MOD totale'), 'il MOD totale è scomposto a schermo');
ok(h.includes('linea retta'), 'la regola della misura in linea retta è scritta');
ok(h.includes('Schivata a PH-3') && h.includes('Reset a WIP-3'), 'la reazione del bersaglio è indicata');
ok(h.includes('successo normale'), 'sui secondari il Critico vale come successo normale');

console.log('\n=== 8. Invio ===');
window.eseguiCalcoloGuidato();
ok(inviato !== null, 'spedito');
const a = inviato && inviato.attacchi[0];
ok(a && a.azione === M.AZIONI.GUIDATO, 'azione canonica');
ok(a && a.arma.nome === 'Missile Launcher (Blast Mode)', 'l arma nel payload è quella vera');
ok(a && a.bersagli[0].rangeMod === 3, 'la gittata scelta arriva all Hub');
ok(a && a.regole.modTotale === 6, 'MOD totale nel payload');

nuovo(rem);
window.currentOrder.weapon = 'Missile Launcher (Blast Mode)';
window.combatTargets = [{ id: 'p2', name: 'Vicino', burst: 1, rangeIndex: 0, rangeMod: -3 }];
window.eseguiCalcoloGuidato();
ok(inviato === null, 'Primario non Bersagliato: invio bloccato');

// ==================================================================
// REQUISITI DICHIARATI AL TAVOLO — Attacco Guidato (gittata, sul Principale)
//   Nuovo il 7 ottobre. MOTORE ha misurato dalla pagina BS, CC, Hacking e
//   Scoprire; il Guidato NO. Il tasto vive su btn-esegui-calcolo e la
//   schermata lo CLONA: nel finto DOM il clone e` 'btn-esegui-calcolo_c'.
//   🔴 La chiave 'gittata' legge il campo `fuoriGittata` a POLARITA`
//   INVERTITA (manca se true). Si gira dal motore, M.invertiRequisito, cosi`
//   il banco non puo` sbagliare il nome del campo.
//   E il requisito si guarda sul SOLO Bersaglio Principale: la Sagoma e` una.
// ==================================================================
console.log('\n=== REQUISITI AL TAVOLO: gittata sul Principale ===');
const tastoG = () => el['btn-esegui-calcolo_c'] || {};
function prontoG() {
    nuovo(rem);
    window.combatTargets = [
        { id: 'p1', name: 'Designato', burst: 0, fuoriGittata: false },
        { id: 'p2', name: 'Vicino', burst: 0, fuoriGittata: false }
    ];
    window.preparaModificatoriGuidati();
}
prontoG();
ok(tastoG().innerText === 'LANCIA MISSILI',
   `gittata dichiarata: il tasto porta l etichetta dell azione (${tastoG().innerText})`);
// GIRATA sul motore 2026-10-07.11: il tasto valido non ha piu` lo sfondo
// vuoto. Scrivendo '' il motore toglieva al tasto l'arancione della pagina,
// e Paolo al tavolo lo vedeva cambiare colore. Ora i due colori stanno nel
// motore, M.COLORE_TASTO: valido 'var(--nomad-orange)', idle '#ffcc00'.
// Si legge dal motore invece di scrivere la stringa a mano, cosi` se Paolo
// cambia l'arancione della pagina questa prova non diventa rossa per un
// motivo che non c'entra col requisito.
// 🔴 Non basta confrontare col valore che il motore dichiara: sarebbe una
// TAUTOLOGIA — i due lati si muovono insieme e la prova non puo` fallire.
// Visto il 7 ottobre rompendo COLORE_TASTO.valido a '' e vedendo il banco
// restare verde. Quindi si pretendono tre cose: che il tasto porti quel
// colore, che quel colore NON sia vuoto (era il difetto di prima) e che sia
// DIVERSO dal giallo dell'IDLE (altrimenti i due stati non si distinguono a
// vista). Cosi` la prova resiste a un cambio di arancione ma non al difetto.
ok(!!M.COLORE_TASTO.valido && M.COLORE_TASTO.valido !== M.COLORE_TASTO.idle,
   `il colore valido c è e non è il giallo dell IDLE (${JSON.stringify(M.COLORE_TASTO)})`);
ok(tastoG().style && tastoG().style.background === M.COLORE_TASTO.valido,
   `e il tasto lo porta (${tastoG().style && tastoG().style.background})`);
prontoG();
M.invertiRequisito(window.combatTargets[0], 'gittata');
window.preparaModificatoriGuidati();
ok(tastoG().innerText === 'IDLE',
   `Principale fuori gittata: il tasto diventa IDLE (${tastoG().innerText})`);
ok(tastoG().style && tastoG().style.background === '#ffcc00',
   `ed è giallo (${tastoG().style && tastoG().style.background})`);
// 🔴 LA PROVA CHE CONTA: il requisito si guarda sul PRINCIPALE, non sui
// secondari. Un secondario fuori gittata non blocca il lancio — e se il
// motore guardasse tutta la lista, due bersagli di cui uno fuori gittata
// NON sarebbero "tutti", quindi niente Idle: la prova sembrerebbe giusta
// per il motivo sbagliato. Per questo si gira il SECONDARIO da solo.
prontoG();
M.invertiRequisito(window.combatTargets[1], 'gittata');
window.preparaModificatoriGuidati();
ok(window.combatTargets[1].fuoriGittata === true, 'premessa: il secondario è fuori gittata');
ok(window.combatTargets[0].fuoriGittata === false, 'e il Principale no');
ok(tastoG().innerText === 'LANCIA MISSILI',
   `solo il secondario fuori gittata: si lancia comunque (${tastoG().innerText})`);
// E il tasto IDLE porta all Idle vero, col motivo del motore.
prontoG();
M.invertiRequisito(window.combatTargets[0], 'gittata');
window.preparaModificatoriGuidati();
let motivoG = null;
const salvaG = window.dichiaraRequisitoFallito;
window.dichiaraRequisitoFallito = (m) => { motivoG = m; return true; };
tastoG().onclick();
ok(motivoG !== null && /fuori gittata/.test(String(motivoG)),
   `cliccandolo chiama l Idle col motivo del motore (${String(motivoG).slice(0, 50)}…)`);
// CONTROPROVA: a gittata dichiarata il tasto NON chiama l Idle.
prontoG();
motivoG = null;
tastoG().onclick();
ok(motivoG === null,
   'CONTROPROVA: col requisito a posto il tasto NON chiama l Idle');
window.dichiaraRequisitoFallito = salvaG;
// E l interruttore della schermata gira il campo giusto.
ok(typeof window.toggleRequisitoGuidato === 'function',
   'la schermata ha l interruttore toggleRequisitoGuidato');
prontoG();
window.toggleRequisitoGuidato(0, 'gittata');
ok(window.combatTargets[0].fuoriGittata === true,
   `e gira fuoriGittata, non un campo chiamato "gittata" (${JSON.stringify(window.combatTargets[0].gittata)} / ${window.combatTargets[0].fuoriGittata})`);
ok(tastoG().innerText === 'IDLE', 'e il tasto si aggiorna da solo');

// ==================================================================
// 11. IL SECONDARIO DELLA SAGOMA ARRIVA AL TABELLONE, E I DADI SI
//     CONTANO UNA VOLTA SOLA (motore dalla .08.9)
//
//   Sta in fondo e non dentro la sezione 6 perche` chiama il motore con
//   un tavolo suo: messo in mezzo, sporcava lo stato del modulo e
//   faceva cadere la sezione 8 (l invio). Misurato: cinque prove
//   diventavano rosse senza che il motore avesse niente di sbagliato.
// ==================================================================
console.log('\n=== 11. Il secondario della Sagoma arriva, e i dadi si contano una volta ===');
// Il secondario arriva davvero allo scontro. Senza questa, "il Burst non
// e` zero" resta una prova sul campo, non sul fatto che il giocatore
// legga il secondario sul tabellone.
const inCampoG = [
    { id: 'att', alias: 'Lanciatore', bs: 12, wip: 13, ph: 10, arm: 1, bts: 0, states: {}, weapon: 'Missile Launcher' },
    { id: 'p1', alias: 'Designato', tipo: 'LI', arm: 1, bts: 0, ph: 10, states: { targeted: true } },
    { id: 'p2', alias: 'Vicino', tipo: 'LI', arm: 1, bts: 0, ph: 10, states: {} }
];
const trovaG = (n, id) => inCampoG.find(u =>
    (id && String(u.id) === String(id)) ||
    M.nomeUnita(u).toUpperCase() === String(M.nomeUnita(n) || n).toUpperCase()) || null;
const bustaG = { attacchi: [{
    attaccante: 'Lanciatore', attaccanteId: 'att', azione: M.AZIONI.BS_ATTACK, arma: arma,
    bersagli: [
        { id: 'p1', name: 'Designato', burst: arma.burst, rangeIndex: 3, rangeMod: 3, principale: true },
        { id: 'p2', name: 'Vicino', burst: arma.burst, rangeIndex: 3, rangeMod: 3 }
    ]
}] };
// 🔴 UN BANCO CHE MUORE NON E` UN BANCO ROSSO. Rompendo il motore mi e`
// uscita un eccezione dentro risolviPayload: il banco e` morto senza
// stampare la riga di riepilogo, e di quale prova fosse non si sapeva
// niente. Qui l eccezione diventa una prova rossa che la nomina.
let scG = [], cadutaG = null;
try { scG = M.risolviPayload(bustaG, [], { trovaUnita: trovaG }) || []; }
catch (e) { cadutaG = e; }
ok(cadutaG === null,
   `risolviPayload non lancia sulla busta della Sagoma${cadutaG ? ': ' + cadutaG.message + ' — ' + ((cadutaG.stack || '').split('\n')[1] || '').trim() : ''}`);
ok(scG.length === 2,
   `i DUE bersagli della Sagoma arrivano al tabellone, primario e secondario (${scG.length} scontri)`);
ok(scG.some(s => /Vicino/.test(String(((s || {}).reattivo || {}).nome || ''))),
   `e il secondario si legge col suo nome (${scG.map(s => ((s || {}).reattivo || {}).nome).join(', ')})`);
// I DADI: un colpo, un uso. Due bersagli con il Burst del colpo ciascuno
// non fanno due dadi da trovare. E` il punto esatto in cui "il Burst sta
// su OGNI bersaglio" potrebbe far contare doppio: creaAttacco per le
// Sagome prende il MASSIMO (riga 544), non la somma (riga 545), e senza
// quello uscirebbe E21 "Assegnati 2 dadi ma ne hai solo 1".
M._rosterProprio = [inCampoG[0]]; M._rosterNemico = [inCampoG[1], inCampoG[2]];
const codiciDi = (e) => ((e || {}).errori || []).map(x => String((x && x.codice) || x));
const attG = M.creaAttacco({ attaccante: inCampoG[0], azione: M.AZIONI.BS_ATTACK, arma: arma,
    bersagli: bustaG.attacchi[0].bersagli });
ok(codiciDi(attG).indexOf('E21') < 0,
   `due bersagli col Burst del colpo NON fanno due dadi: niente E21 (${JSON.stringify(codiciDi(attG))})`);
ok(attG.ok === true,
   `e l attacco a Sagoma passa la validazione (ok: ${attG.ok}, errori ${JSON.stringify(codiciDi(attG))})`);
// CONTROPROVA: la stessa forma con un arma SENZA Sagoma deve sommare, e
// con due dadi chiesti su un Burst da 1 l errore DEVE uscire. Senza
// questa, "niente E21" non distingue "conta il massimo" da "non controlla
// piu` niente".
const pistola = M.profiloArma('Pistol') || M.profiloArma('Combi Rifle');
const attNoSag = M.creaAttacco({ attaccante: inCampoG[0], azione: M.AZIONI.BS_ATTACK, arma: pistola,
    bersagli: [{ id: 'p1', name: 'Designato', burst: pistola.burst, rangeIndex: 0 },
               { id: 'p2', name: 'Vicino', burst: pistola.burst, rangeIndex: 0 }] });
ok(!!pistola && pistola.isTemplate !== true,
   `premessa della controprova: ${pistola && pistola.nome} non e` + ` un arma a Sagoma (isTemplate: ${pistola && pistola.isTemplate})`);
ok(codiciDi(attNoSag).indexOf('E21') >= 0,
   `CONTROPROVA: senza Sagoma i dadi si SOMMANO, e ${pistola.burst}+${pistola.burst} oltre ${pistola.burst} da` + ` E21 (${JSON.stringify(codiciDi(attNoSag))})`);
M._rosterProprio = null; M._rosterNemico = null;


console.log('\n=== 12. Chi puo` davvero dichiarare un Attacco Guidato ===');
// CORRETTO DA MOTORE IL 9 OTTOBRE SERA (motore 2026-10-09.5).
// Fino alla .09.4 `M.haGuidato` cercava la SOTTOSTRINGA 'GUIDED' in skills +
// equip e prendeva per buono `ECM (Guided -6)`, che e` la DIFESA contro i
// Guidati: 27 profili capaci dove erano 2. La sezione inchiodava quel
// comportamento (25 falsi positivi, 3 con l'ordine concesso) ed e` diventata
// rossa col motore corretto, come doveva. Le prove inchiodate sono cancellate;
// queste dicono la regola giusta.
// I due database di fazione servono solo a questa sezione e alla 13: si
// caricano qui. Col guardiano, perche` un banco che muore all'avvio perde le
// sue prove in silenzio invece di fallire (lezione del 6 ottobre).
try { require('./database_nomad.js'); require('./database_panoceania.js'); } catch (e) { /* detto sotto */ }
const TUTTI_G = [].concat(window.DB_NOMADI || [], window.DB_PANOCEANIA || []);
ok(TUTTI_G.length > 700,
   `i due database di fazione si caricano: ${TUTTI_G.length} profili`,
   'senza di loro le prove qui sotto non guardano niente');
const pulito = (u) => Object.assign({}, u, { states: {} });
const due = (trovati, attesi) => {
    const t = trovati.slice().sort(), a = attesi.slice().sort();
    return { comparsi: t.filter(n => a.indexOf(n) < 0), spariti: a.filter(n => t.indexOf(n) < 0) };
};

// Insieme NOMINATO, nei due versi: un conteggio "sono 2" resterebbe verde se
// un profilo ne sostituisse un altro.
const GUIDATI_ATTESI = ['Clipper Dronbot (BS Attack [Guided])', 'Vertigo Zond (Missile Launcher)'];
const dGuid = due(TUTTI_G.filter(u => M.haGuidato(pulito(u))).map(u => u.nome), GUIDATI_ATTESI);
ok(dGuid.comparsi.length === 0 && dGuid.spariti.length === 0,
   `haGuidato e vero per i ${GUIDATI_ATTESI.length} profili con la Skill, e solo per loro`,
   `comparsi: ${JSON.stringify(dGuid.comparsi)} — spariti: ${JSON.stringify(dGuid.spariti)} — se cambiano, GUI-01/03/05 del piano cambiano soggetto`);

// CONTROPROVA: "nessun falso positivo" vale solo se i portatori di ECM (Guided)
// ci sono ancora e sono stati guardati. Se questo numero crolla a 0 la prova
// sopra resta verde per il motivo sbagliato.
const conEcmGuid = TUTTI_G.filter(u => /ECM\s*[\(\[]\s*Guided/i.test(String(u.equip || '')));
ok(conEcmGuid.length === 25,
   `controprova: i portatori di ECM (Guided -6) esaminati sono 25 (${conEcmGuid.length})`,
   'se cambia il numero va rimisurato a mano; a 0 la prova sopra non guarda piu niente');
const ecmCreduti = conEcmGuid.filter(u => M.haGuidato(pulito(u))).map(u => u.nome);
ok(ecmCreduti.length === 0,
   'e per nessuno di loro l ECM difensivo viene letto come la Skill',
   `creduti capaci: ${JSON.stringify(ecmCreduti)}`);

// I TRE che facevano danno: hanno anche un'arma che qualifica. Dal motore
// .09.6 `armiGuidate` NON la restituisce piu` in `armi`: la mette in `escluse`
// col motivo 'manca la Skill', cosi` chi legge `.armi` senza guardare `.avvisi`
// non puo` saltare il rifiuto. Li si riconosce da quel motivo.
const CON_ARMA = ['Scarface Loadout Alpha', 'Scarface Loadout Alpha (Mk12 (+1B))',
                  'Squalo Mk-II (Heavy Machine Gun, Grenade Launcher)'];
const MANCA_SKILL = /manca la Skill/;
const esclusePerSkill = (u) => (M.armiGuidate(pulito(u)).escluse || []).filter(x => MANCA_SKILL.test(String(x.motivo)));
const conArma = conEcmGuid.filter(u => esclusePerSkill(u).length > 0);
const dArma = due(conArma.map(u => u.nome), CON_ARMA);
ok(dArma.comparsi.length === 0 && dArma.spariti.length === 0,
   `fra loro, quelli con un arma esclusa perche manca la Skill sono i ${CON_ARMA.length} nominati, nei due versi`,
   `comparsi: ${JSON.stringify(dArma.comparsi)} — spariti: ${JSON.stringify(dArma.spariti)}`);
const codiciAvviso = (u) => (M.armiGuidate(pulito(u)).avvisi || []).map(a => String(a.codice));
const senzaA95 = conArma.filter(u => codiciAvviso(u).indexOf('A95') < 0).map(u => u.nome);
ok(conArma.length > 0 && senzaA95.length === 0,
   'e a tutti armiGuidate da l avviso A95: l arma c e, la Skill no',
   `senza A95: ${JSON.stringify(senzaA95)}`);
const conArmi = conArma.filter(u => (M.armiGuidate(pulito(u)).armi || []).length > 0).map(u => u.nome);
ok(conArma.length > 0 && conArmi.length === 0,
   'e per loro la lista `armi` e VUOTA: l arma che qualificherebbe sta solo fra le escluse',
   `con armi: ${JSON.stringify(conArmi)}`);
// Su TUTTI i profili, non solo sui tre: senza la Skill nessuna arma in `armi`.
const senzaSkillG = TUTTI_G.filter(u => !M.haGuidato(pulito(u)));
const senzaSkillConArmi = senzaSkillG.filter(u => (M.armiGuidate(pulito(u)).armi || []).length > 0).map(u => u.nome);
ok(senzaSkillG.length > 700 && senzaSkillConArmi.length === 0,
   `nessuno dei ${senzaSkillG.length} profili senza la Skill riceve un arma in armi`,
   `con armi: ${JSON.stringify(senzaSkillConArmi.slice(0, 5))} (${senzaSkillConArmi.length})`);
// CONTROPROVA: lo zero vale solo se a chi ha la Skill le armi arrivano, e
// nessuna gli viene esclusa per quel motivo.
const conSkillG = TUTTI_G.filter(u => M.haGuidato(pulito(u)));
ok(conSkillG.length === GUIDATI_ATTESI.length && conSkillG.every(u => (M.armiGuidate(pulito(u)).armi || []).length >= 1 && esclusePerSkill(u).length === 0),
   'CONTROPROVA: chi ha la Skill riceve almeno un arma, e nessuna esclusa perche manca la Skill',
   `${JSON.stringify(conSkillG.map(u => u.nome + ': ' + (M.armiGuidate(pulito(u)).armi || []).length + ' armi, ' + esclusePerSkill(u).length + ' escluse per Skill'))}`);
const vertigoG = TUTTI_G.find(u => u.nome === 'Vertigo Zond (Missile Launcher)');
ok(!!vertigoG && codiciAvviso(vertigoG).length === 0,
   `CONTROPROVA: chi ha la Skill non riceve nessun avviso (${JSON.stringify(vertigoG ? codiciAvviso(vertigoG) : 'profilo assente')})`);

// La forma della Skill, su soggetti costruiti a mano: tonde, quadre, e l'ECM
// accanto alla Skill vera che non deve toglierla.
const finto = (skills, equip) => ({ id: 'f', alias: 'Finto', bs: 12, weapon: 'Missile Launcher', skills: skills, equip: equip || '', states: {} });
ok(M.haGuidato(finto('BS Attack (Guided)')) === true, 'Skill con le tonde: vero');
ok(M.haGuidato(finto('BS Attack [Guided]')) === true, 'Skill con le quadre: vero');
ok(M.haGuidato(finto('BS Attack [Guided]', 'ECM (Guided -6)')) === true, 'Skill piu ECM: vero, l ECM non la toglie');
ok(M.haGuidato(finto('', 'ECM (Guided -6)')) === false, 'solo ECM (Guided -6): falso');
ok(M.haGuidato(finto('BS Attack (SR-1), Courage')) === false, 'un altro BS Attack (…) non basta: falso');


console.log('\n=== 13. Senza la Skill nessun bottone d arma (dalla porta del giocatore) ===');
// SCOPERTO il 9 ottobre sera, trovato da MOTORE verificando la sezione 12:
// fino al modulo 2026-10-09.1 con A95 la schermata scriveva l'avviso e poi
// disegnava LO STESSO i bottoni delle armi qualificanti. Il giocatore poteva
// toccare l'arma e dichiarare. Nessun banco contava i bottoni: la sezione 2
// guarda solo che l'avviso ci sia.
// Si conta `declareGuidatoAttack` nell'HTML della schermata, cioe` quello che
// il giocatore puo` toccare.
const schermataG = (u) => { nuovo(u); nodo('weapon-buttons-container').innerHTML = ''; window.startUnitGuidatoLoop(); return nodo('weapon-buttons-container').innerHTML; };
const bottoniG = (html) => (html.match(/declareGuidatoAttack\(/g) || []).length;
const avvisoG = (html) => html.includes('non ha "BS Attack (Guided)"');

let hG = schermataG(finto('', 'ECM (Guided -6)'));
ok(avvisoG(hG) && bottoniG(hG) === 0,
   `solo ECM, con un Missile Launcher in mano: avviso e 0 bottoni (avviso ${avvisoG(hG)}, bottoni ${bottoniG(hG)})`);
ok(hG.includes('Non utilizzabili per il Guidato'), 'e l elenco delle escluse resta a schermo');
hG = schermataG(finto('', ''));
ok(avvisoG(hG) && bottoniG(hG) === 0,
   `niente Skill e niente ECM: avviso e 0 bottoni (avviso ${avvisoG(hG)}, bottoni ${bottoniG(hG)})`);
// CONTROPROVA: lo zero vale solo se con la Skill il bottone si conta davvero.
hG = schermataG(finto('BS Attack (Guided)'));
ok(!avvisoG(hG) && bottoniG(hG) === 1,
   `CONTROPROVA: con la Skill il bottone c e ed e uno, senza avviso (avviso ${avvisoG(hG)}, bottoni ${bottoniG(hG)})`);
hG = schermataG(finto('BS Attack [Guided]', 'ECM (Guided -6)'));
ok(!avvisoG(hG) && bottoniG(hG) === 1,
   `Skill con le quadre piu ECM: bottone, nessun avviso (avviso ${avvisoG(hG)}, bottoni ${bottoniG(hG)})`);
// E sui profili VERI del database: i tre che l'arma ce l'hanno.
const ancoraBottoni = conArma.filter(u => { const x = schermataG(pulito(u)); return bottoniG(x) > 0 || !avvisoG(x); }).map(u => u.nome);
ok(conArma.length === CON_ARMA.length && ancoraBottoni.length === 0,
   `i ${CON_ARMA.length} profili veri con ECM e arma che qualifica: avviso e 0 bottoni per tutti`,
   `con bottoni o senza avviso: ${JSON.stringify(ancoraBottoni)}`);
hG = vertigoG ? schermataG(pulito(vertigoG)) : '';
ok(!avvisoG(hG) && bottoniG(hG) === 1,
   `e il Vertigo Zond vero ha il suo bottone (avviso ${avvisoG(hG)}, bottoni ${bottoniG(hG)})`);


console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
