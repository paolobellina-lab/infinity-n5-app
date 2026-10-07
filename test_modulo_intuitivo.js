// @versione 2026-10-07.2 | test_modulo_intuitivo.js | proprieta`: chat TEST
// Test end-to-end del modulo Intuitivo — node test_modulo_intuitivo.js
// .2 (7 ott): il colore del tasto si prova contro M.COLORE_TASTO E si pretende
//    non vuoto e diverso dal giallo dell IDLE — alla .1 era una tautologia.
//
// AGGIORNATO IL 6 OTTOBRE, regola dalla chat REGOLE: l'Attacco Intuitivo
// contro un Marker Impersonation e` VIETATO, ne` IMP-1 ne` IMP-2 (riga
// 14210). Contro un Marker CAMO resta valido. Prima questo banco pretendeva
// "i 2 Marker" e sei prove cadevano: il motore aveva ragione, il banco no.
//
// Le due esclusioni sono DIVERSE e vanno distinte, altrimenti un bersaglio
// escluso per il motivo sbagliato passa per escluso bene:
//   - Speculo (Impersonation): vietato SEMPRE, anche dichiarando la Zona di
//     Visibilita` Zero. E` la controprova che il divieto non e` un effetto
//     collaterale della LoF.
//   - Fusilier (in piena vista): vietato per la LoF, e la Zona di
//     Visibilita` Zero lo RIAMMETTE. E` la controprova che il filtro guarda
//     davvero la LoF e non rifiuta tutto per abitudine.
// La schermata offre solo i bottoni legali; il divieto vero sta all'invio.
// Si provano entrambi i lati: scegliPrincipaleIntuitivo() accetta qualunque
// id nemico, quindi un filtro di sola schermata non basterebbe a chiamarlo
// regola.
global.window = global;

let passati = 0, falliti = 0;
function ok(c, n, e) { if (c) { passati++; console.log(`  ✅ ${n}`); } else { falliti++; console.log(`  ❌ ${n}${e ? '\n       ' + e : ''}`); } }

const el = {};
function nodo(id) {
    return el[id] || (el[id] = { id, innerHTML: '', innerText: '', style: {},
        appendChild() {}, remove() {}, cloneNode() { return nodo(id + '_c'); },
        parentNode: { replaceChild() {} } });
}
global.document = { title: 'NOMADS', getElementById: (i) => nodo(i),
    querySelector: () => nodo('btn'), querySelectorAll: () => [],
    createElement: () => ({ style: {}, innerHTML: '', appendChild() {} }) };
let alertUltimo = null; global.alert = (m) => { alertUltimo = m; };
let inviato = null; global.inviaCalcoloAllHub = (p) => { inviato = p; };
global.goToStep = (s) => { global.ultimoStep = s; };
global.confirmMultiAro = () => {};

require('./catalogo_n5.js'); require('./database_comune.js');
const M = require('./motore_regole_n5.js');
require('./ordine_attacco_intuitivo.js');

const lanciafiamme = { id: 'n1', alias: 'Moran', wip: 13, weapon: 'Light Flamethrower, Combi Rifle', states: {} };
const senzaSagoma  = { id: 'n2', alias: 'Alguacil', wip: 12, weapon: 'Combi Rifle, Pistol', states: {} };

M._fazione = 'NOMADI';
M._rosterProprio = [lanciafiamme, senzaSagoma];
M._rosterNemico = [
    { id: 'p1', alias: 'Croc Man', tipo: 'LI', deployState: 'CAMO', states: { camo: true } },
    { id: 'p2', alias: 'Speculo', tipo: 'LI', deployState: 'IMP', states: { impersonation: true } },
    { id: 'p3', alias: 'Fusilier', tipo: 'LI', states: {} },
    { id: 'p4', alias: 'Orc Morto', tipo: 'HI', state: 'DEAD', states: {} }
];

function nuovo(u) {
    window.currentOrder = {}; window.coordUnits = [u]; window.coordIndex = 0;
    window.coordPayloads = []; window.combatTargets = []; window.coordMode = false;
    window.intuitivoFuoriLoF = false; inviato = null; alertUltimo = null;
}

console.log('\n=== 1. Selezione arma: il limite del database è dichiarato ===');
nuovo(lanciafiamme);
window.avviaFaseIntuitivo('ATTACCO INTUITIVO', false);
let h = nodo('weapon-buttons-container').innerHTML;
ok(h.includes('Light Flamethrower'), 'lanciafiamme offerto');
ok(!h.includes('>Combi Rifle<'), 'Combi Rifle non offerto');
ok(!h.includes('dedotto'),
   'nessun avviso sui Tratti: ora vengono dal database, non dedotti');
ok(h.includes('Burst 1'), 'Burst 1 indicato già sul bottone');

nuovo(senzaSagoma);
window.startUnitIntuitivoLoop();
ok(nodo('weapon-buttons-container').innerHTML.includes('Nessuna arma utilizzabile'),
   'unità senza Sagome: nessuna arma offerta');

console.log('\n=== 2. Il bersaglio dev essere Marker CAMO, o fuori LoF ===');
nuovo(lanciafiamme);
window.currentOrder.weapon = 'Light Flamethrower';
window.setupTargetSelectionIntuitivo();
const nomiOfferti = () => window.validTargets.map(u => u.alias).sort().join(', ');
ok(window.validTargets.length === 1,
   `con LoF: solo il Marker CAMO (offerti ${window.validTargets.length}: ${nomiOfferti()})`);
// Il "every" di prima passava anche con un solo elemento: l'etichetta diceva
// due nomi e la prova ne controllava uno. Qui si nomina chi c'e`.
ok(nomiOfferti() === 'Croc Man', `l unico offerto è il Croc Man (${nomiOfferti()})`);

const scarto = (n) => (window.targetsScartati.find(t => t.nome === n) || {}).motivo || '';
ok(/Impersonation/.test(scarto('Speculo')) && /14210/.test(scarto('Speculo')),
   `Speculo escluso PERCHÉ Impersonation, con la riga citata (${scarto('Speculo').slice(0, 70)}…)`);
ok(/Marker o fuori LoF|Zona di Visibilit/.test(scarto('Fusilier')) &&
   !/Impersonation/.test(scarto('Fusilier')),
   'il Fusilier è escluso per la LoF, NON per l Impersonation: due motivi distinti');
console.log('   ' + window.targetsScartati.map(t => `${t.nome}: ${t.motivo.slice(0, 55)}…`).join('\n   '));

window.toggleIntuitivoFuoriLoF();
ok(window.validTargets.length === 2 && /Fusilier/.test(nomiOfferti()),
   `dichiarando la Zona di Visibilità Zero il Fusilier rientra (offerti ${window.validTargets.length}: ${nomiOfferti()})`);
// CONTROPROVA del divieto: la Zona di Visibilita` Zero riammette il Fusilier
// ma NON il Marker Impersonation. Senza questa prova, "Speculo escluso"
// potrebbe essere solo un effetto della LoF.
ok(!/Speculo/.test(nomiOfferti()) && /Impersonation/.test(scarto('Speculo')),
   'ma il Marker Impersonation resta vietato anche fuori LoF (riga 14210)');

console.log('\n=== 3. ERRORE CORRETTO: un solo Bersaglio Principale ===');
nuovo(lanciafiamme);
window.currentOrder.weapon = 'Light Flamethrower';
window.setupTargetSelectionIntuitivo();
window.toggleIntuitivoFuoriLoF();   // servono due bersagli legali per provare la sostituzione
window.scegliPrincipaleIntuitivo('p1');
ok(window.combatTargets.length === 1 && window.combatTargets[0].name === 'Croc Man', 'primo scelto');
window.scegliPrincipaleIntuitivo('p3');
ok(window.combatTargets.length === 1 && window.combatTargets[0].name === 'Fusilier',
   'il secondo SOSTITUISCE il primo, non si accumula');

console.log('\n=== 4. ERRORE CORRETTO: il tiro è nudo ===');
window.preparaModificatoriIntuitivo();
h = nodo('targets-allocation-container').innerHTML;
ok(!h.includes('range-seg') && !h.includes('range-bar'),
   'nessun selettore di gittata (prima l Intuitivo non ne aveva, ma lo Speculativo sì per confronto)');
ok(!h.includes('COPERTURA'), 'nessun interruttore Copertura');
ok(h.includes('NESSUN MOD') || h.includes('non modificato'),
   'la schermata dice che NESSUN MOD si applica, non solo Mimetismo e Copertura');
ok(h.includes('WIP 13'), 'mostra il WIP dell unità');

console.log('\n=== 5. Regole Sagoma ereditate ===');
const regole = M.regoleIntuitivo(M.profiloArma('Light Flamethrower'));
ok(regole.reazione === 'FACCIA_A_FACCIA',
   'reazione F2F anche con Sagoma DIRETTA (l Intuitivo richiede un tiro)');
ok(M.regoleTemplate(M.profiloArma('Light Flamethrower')).reazione === 'TIRO_NORMALE',
   'lo stesso lanciafiamme in un BS normale darebbe invece un Tiro Normale');
ok(regole.criticoSoloSulPrincipale, 'Critico solo sul Principale');
ok(regole.coperturaAnnullaSalvezza, 'niente +3 al Tiro Salvezza per Copertura');
ok(regole.contaComeBsAttack && regole.plusUnSD === false,
   'conta come BS Attack per i MOD, ma niente +1 SD (è una Long Skill)');
ok(h.includes('Faccia a Faccia') && h.includes('Critico'), 'le regole sono spiegate a schermo');

console.log('\n=== 6. Invio: il Marker CAMO passa ===');
// Il caso che DEVE arrivare in fondo. Se cadesse questo, il divieto
// sull'Impersonation si sarebbe mangiato anche il CAMO.
nuovo(lanciafiamme);
window.currentOrder.weapon = 'Light Flamethrower';
window.setupTargetSelectionIntuitivo();
window.scegliPrincipaleIntuitivo('p1');       // Marker CAMO, in LoF
window.preparaModificatoriIntuitivo();
window.eseguiCalcoloIntuitivo();
ok(inviato !== null, 'attacco sul Marker CAMO spedito');
ok(inviato && inviato.attacchi[0].arma.burst === 1, 'Burst forzato a 1 nel payload');
ok(inviato && inviato.attacchi[0].azione === M.AZIONI.INTUITIVO, 'azione dal vocabolario canonico');
ok(inviato && inviato.attacchi[0].bersagli.length === 1, 'un solo bersaglio nel payload');

console.log('\n=== 7. Invio: i due rifiuti, ciascuno col suo motivo ===');
nuovo(lanciafiamme);
window.currentOrder.weapon = 'Light Flamethrower';
window.combatTargets = [];
window.preparaModificatoriIntuitivo();
ok(alertUltimo && alertUltimo.includes('Nessun Bersaglio Principale'),
   'senza bersaglio: si ferma e lo dice (nessun fantasma inventato)');

// Il Marker Impersonation: scegliPrincipaleIntuitivo lo accetta (la schermata
// non gli dava il bottone, ma la funzione non controlla), quindi il NO deve
// venire dall'invio, con la riga di regolamento in chiaro.
nuovo(lanciafiamme);
window.currentOrder.weapon = 'Light Flamethrower';
window.combatTargets = [{ id: 'p2', name: 'Speculo', burst: 1 }];
window.eseguiCalcoloIntuitivo();
ok(inviato === null, 'Intuitivo su Marker Impersonation: BLOCCATO all invio');
ok(String(alertUltimo).includes('Impersonation') && String(alertUltimo).includes('14210'),
   'e l avviso dice Impersonation e cita la riga 14210');

nuovo(lanciafiamme);
window.currentOrder.weapon = 'Light Flamethrower';
window.combatTargets = [{ id: 'p3', name: 'Fusilier', burst: 1 }];
window.eseguiCalcoloIntuitivo();
ok(inviato === null, 'Intuitivo su bersaglio in piena vista: BLOCCATO all invio');
ok(!String(alertUltimo).includes('Impersonation'),
   'col motivo della LoF, non quello dell Impersonation');
console.log('   ' + String(alertUltimo).split('\n').filter(Boolean)[2]);

// ==================================================================
// REQUISITI DICHIARATI AL TAVOLO — Attacco Intuitivo (lof + sagoma)
//   Nuovo il 7 ottobre. MOTORE ha misurato dalla pagina BS, CC, Hacking e
//   Scoprire; Intuitivo, Speculativo, Guidato e Forward Observer NO.
//   Questi quattro li misuro io, perche` un requisito che il tasto non
//   legge e` un Idle che il giocatore non puo` dichiarare.
//   Il tasto vive su btn-esegui-calcolo e la schermata lo CLONA: nel finto
//   DOM il clone e` 'btn-esegui-calcolo_c', e una prova che guarda
//   l'originale e` verde per sbaglio.
//   🔴 Le chiavi NON sono i nomi dei campi: 'sagoma' legge `fuoriSagoma` a
//   polarita` invertita. Si passa dal motore (M.invertiRequisito) invece di
//   scrivere i campi a mano, cosi` il banco non puo` sbagliare la chiave.
// ==================================================================
console.log('\n=== REQUISITI AL TAVOLO: lof + sagoma ===');
const tastoI = () => el['btn-esegui-calcolo_c'] || {};
function pronto() {
    nuovo(lanciafiamme);
    window.currentOrder.weapon = 'Light Flamethrower';
    window.combatTargets = [{ id: 'p3', name: 'Fusilier', burst: 1, rangeIndex: 0,
                              lof: true, fuoriSagoma: false }];
    window.preparaModificatoriIntuitivo();
}
pronto();
ok(tastoI().innerText === 'LANCIA ATTACCO INTUITIVO',
   `requisiti a posto: il tasto porta l etichetta dell azione (${tastoI().innerText})`);
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
ok(tastoI().style && tastoI().style.background === M.COLORE_TASTO.valido,
   `e il tasto lo porta (${tastoI().style && tastoI().style.background})`);
// Una chiave alla volta, girata dal motore.
for (const chiave of ['lof', 'sagoma']) {
    pronto();
    M.invertiRequisito(window.combatTargets[0], chiave);
    window.preparaModificatoriIntuitivo();
    ok(tastoI().innerText === 'IDLE',
       `requisito "${chiave}" dichiarato mancante: il tasto diventa IDLE (${tastoI().innerText})`);
    ok(tastoI().style && tastoI().style.background === '#ffcc00',
       `ed è giallo (${tastoI().style && tastoI().style.background})`);
}
// L Intuitivo ha UN bersaglio solo, quindi "uno manca" e "tutti mancano"
// coincidono: va detto, perche` sulle schermate a piu` bersagli non e` cosi`.
ok(window.combatTargets.length === 1,
   'l Intuitivo ha un bersaglio solo: qui "uno manca" è "tutti mancano"');
// E il tasto PORTA all Idle vero, col motivo del motore, e NON esegue.
pronto();
M.invertiRequisito(window.combatTargets[0], 'lof');
window.preparaModificatoriIntuitivo();
let motivoI = null; inviato = null;
const salvaI = window.dichiaraRequisitoFallito;
window.dichiaraRequisitoFallito = (m) => { motivoI = m; return true; };
tastoI().onclick();
ok(motivoI !== null, 'cliccandolo chiama window.dichiaraRequisitoFallito');
ok(/Linea di Tiro/.test(String(motivoI)),
   `col motivo scritto dal motore (${String(motivoI).slice(0, 55)}…)`);
ok(inviato === null, 'e NON spedisce la busta: l Idle sostituisce l attacco');
window.dichiaraRequisitoFallito = salvaI;
// CONTROPROVA: col requisito a posto il tasto prende l altra strada — NON
// chiama l Idle. Si guarda questo e non "la busta parte", perche` l invio
// puo` essere bloccato da altro (un bersaglio non valido per l Intuitivo,
// che e` un controllo diverso): una prova sull invio sarebbe rossa per un
// motivo che non c entra coi requisiti. Visto il 7 ottobre.
pronto();
motivoI = null;
window.dichiaraRequisitoFallito = (m) => { motivoI = m; return true; };
tastoI().onclick();
ok(motivoI === null,
   'CONTROPROVA: col requisito a posto il tasto NON chiama l Idle — prende l altra strada');
window.dichiaraRequisitoFallito = salvaI;
// E l interruttore della schermata passa dal motore, non riscrive il campo.
ok(typeof window.toggleRequisitoIntuitivo === 'function',
   'la schermata ha l interruttore toggleRequisitoIntuitivo');
pronto();
window.toggleRequisitoIntuitivo(0, 'sagoma');
ok(window.combatTargets[0].fuoriSagoma === true,
   `e girandolo il campo giusto cambia: fuoriSagoma (${window.combatTargets[0].fuoriSagoma})`);
ok(tastoI().innerText === 'IDLE',
   'e il tasto si aggiorna da solo, senza rifare la schermata a mano');

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
