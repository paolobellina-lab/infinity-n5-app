// @versione 2026-10-08.1 | test_modulo_guidato.js | proprieta`: chat TEST
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

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
