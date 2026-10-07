// @versione 2026-10-07.2 | test_modulo_speculativo.js | proprieta`: chat TEST
// Test end-to-end del modulo Speculativo — node test_modulo_speculativo.js
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
global.goToStep = () => {}; global.renderTargetButtons = () => {};

require('./catalogo_n5.js'); require('./database_comune.js');
const M = require('./motore_regole_n5.js');
require('./ordine_fuoco_speculativo.js');

const granatiere = { id: 'n1', alias: 'Granatiere', bs: 11, ph: 12, wip: 13,
                     weapon: 'Grenades, Combi Rifle', states: {} };
const missilista = { id: 'n2', alias: 'Missilista', bs: 12, ph: 10,
                     weapon: 'Missile Launcher, Heavy Rocket Launcher, Adhesive Launcher Rifle', states: {} };

M._fazione = 'NOMADI';
M._rosterProprio = [granatiere, missilista];
M._rosterNemico = [
    { id: 'p1', alias: 'Fusilier', tipo: 'LI', states: {} },
    { id: 'p2', alias: 'Croc Man', tipo: 'LI', deployState: 'CAMO', states: { camo: true } }
];

function nuovo(u) {
    window.currentOrder = {}; window.coordUnits = [u]; window.coordIndex = 0;
    window.coordPayloads = []; window.combatTargets = []; window.coordMode = false;
    inviato = null; alertUltimo = null;
}

console.log('\n=== 1. ERRORE CORRETTO: il filtro armi ===');
nuovo(missilista);
window.avviaFaseSpeculativo('FUOCO SPECULATIVO', false);
let h = nodo('weapon-buttons-container').innerHTML;
ok(h.includes('Nessuna arma col Tratto'),
   'Missile/Rocket/Adhesive Launcher: NESSUNA offerta (prima le offriva tutte per via di "LAUNCHER" nel nome)');
ok(h.includes('Missile Launcher') && h.includes('non ha il Tratto'),
   'e il motivo dell esclusione è scritto');

nuovo(granatiere);
window.startUnitSpeculativoLoop();
h = nodo('weapon-buttons-container').innerHTML;
ok(h.includes('Grenades'), 'Grenades offerta');
ok(h.includes('Combi Rifle') && h.includes('non ha il Tratto'),
   'Combi Rifle esclusa perché il database dice che non ha il Tratto Speculative Attack');

console.log('\n=== 2. ERRORE CORRETTO: le Granate tirano su PH ===');
ok(h.includes('Tira su PH'), 'sul bottone c è scritto che si tira su PH, non su BS');
const attr = M.attributoArma(M.profiloArma('Grenades'), M.AZIONI.SPECULATIVO);
ok(attr.attributo === 'PH', 'attributoArma: Grenades -> PH');
ok(M.attributoArma(M.profiloArma('Combi Rifle'), M.AZIONI.SPECULATIVO).attributo === 'BS',
   'un fucile resta su BS');

console.log('\n=== 3. I MOD: -6 fisso PIÙ la gittata ===');
const g = M.profiloArma('Grenades');
console.log('   bande Grenades: ' + g.bands.map(b => `${b.mod > 0 ? '+' : ''}${b.mod} (${b.label})`).join('  '));
const vicino = M.regoleSpeculativo(g, { rangeIndex: 0 });
ok(vicino.modTotale === -3, `a 0-8": -6 +3 = -3 (ottenuto ${vicino.modTotale})`);
const lontano = M.regoleSpeculativo(g, { rangeIndex: 1 });
ok(lontano.modTotale === -9, `a 8-16": -6 -3 = -9 (ottenuto ${lontano.modTotale})`);
ok(g.bands.length === 2, 'le Granate hanno due bande sole: oltre 16" sono fuori gittata');
ok(vicino.voci.length === 2, 'il dettaglio distingue le due voci');

console.log('\n=== 4. La differenza con l Attacco Intuitivo ===');
const intuitivo = M.regoleIntuitivo(M.profiloArma('Light Flamethrower'));
ok(intuitivo.modAmmessi.length === 0, 'Intuitivo: NESSUN MOD, gittata compresa');
ok(vicino.modGittata === 3, 'Speculativo: la gittata SI applica');
ok(vicino.ignoraMimetismo && vicino.ignoraCopertura, 'Speculativo: ignora Mimetismo e Copertura');
ok(vicino.richiedeLoF === false, 'Speculativo: non richiede LoF');

console.log('\n=== 5. Schermata modificatori ===');
nuovo(granatiere);
window.currentOrder.weapon = 'Grenades';
window.combatTargets = [{ id: 'p1', name: 'Fusilier', burst: 3, cover: true }];
window.preparaModificatoriSpeculativo();
h = nodo('targets-allocation-container').innerHTML;
ok(h.includes('TIRO SU PH 12'), 'mostra PH 12, non BS 11');
ok(h.includes('range-seg'), 'il selettore di gittata c è (a differenza dell Intuitivo)');
ok(!h.includes('IN COPERTURA'), 'nessun interruttore Copertura: è ignorata per regola');
ok(h.includes('MOD totale'), 'mostra il MOD totale scomposto');
ok(window.combatTargets[0].burst === 1, 'Burst forzato a 1');
ok(window.combatTargets[0].cover === false, 'la copertura del bersaglio è azzerata');

window.setTargetRangeSpeculativo(1);
ok(window.combatTargets[0].rangeMod === -3, 'cambio banda: MOD aggiornato dall arma');

console.log('\n=== 6. Bersagli: il Marker NON può essere Bersaglio Principale ===');
// CAMBIATO IL 6 OTTOBRE (chat REGOLE): fino alla 2026-10-06.2 il Marker CAMO
// passava come principale e questo banco lo pretendeva. Non e` vero: righe
// 13609-13610 per il CAMO, 14207-14208 per l'Impersonation. Lo Speculativo
// ignora la LoF, che e` un'altra cosa dall'essere un Marker.
nuovo(granatiere);
window.currentOrder.weapon = 'Grenades';
window.setupTargetSelectionSpeculativo();
const offerti = window.validTargets.map(u => u.alias).sort().join(', ');
ok(window.validTargets.length === 1 && offerti === 'Fusilier',
   `come principale resta solo il Modello (offerti ${window.validTargets.length}: ${offerti})`);
const motivoCroc = (window.targetsScartati.find(t => t.nome === 'Croc Man') || {}).motivo || '';
ok(/Bersaglio Principale/.test(motivoCroc) && /13609/.test(motivoCroc),
   `il Croc Man è escluso come PRINCIPALE, con le righe citate (${motivoCroc.slice(0, 60)}…)`);

// CONTROPROVA, due volte. Senza queste due prove "Croc Man escluso" non
// distingue "non puo` essere principale" da "non e` bersagliabile affatto":
// sotto la Sagoma il Marker si prende eccome (righe 3914-3919).
const croc = M.rosterNemico().find(u => u.id === 'p2');
const speculo = { id: 'p9', alias: 'Speculo', tipo: 'LI', deployState: 'IMP', states: { imp: true } };
// Il motivo si legge con String(): quando il bersaglio e` ammesso il campo
// e` null, e un .slice() su null farebbe CADERE il banco invece di farlo
// diventare rosso — cioe` porterebbe via le prove che restano. Visto il
// 6 ottobre provando a rompere il motore di proposito.
const comePrincipale = (b) => M.bersagliValidi(M.AZIONI.SPECULATIVO, [b], { attaccante: granatiere })[0];
const comeSecondario = (b) => M.bersagliValidi(M.AZIONI.SPECULATIVO, [b], { attaccante: granatiere, ruolo: 'secondario' })[0];
const perche = (g) => String((g && g.motivo) || '');
ok(comeSecondario(croc).ammesso,
   'lo stesso Marker CAMO è ammesso con ruolo secondario: è preso dalla Sagoma');
ok(!comePrincipale(speculo).ammesso && /1420[78]/.test(perche(comePrincipale(speculo))),
   `anche il Marker Impersonation è fuori come principale (${perche(comePrincipale(speculo)).slice(0, 55)}…)`);
// 🔴 GIRATA IL 7 OTTOBRE (chat REGOLE, righe 14283-14289). Fino al motore
// 2026-10-06.16 questa prova pretendeva che il Marker Impersonation
// rientrasse come secondario, "perche` l esclusione e` sul ruolo, non sul
// bersaglio". NON e` vero: un Marker Impersonation sotto la Sagoma conta
// come ALLEATO, e un alleato nell area ANNULLA il colpo — anche se il
// Bersaglio Principale e` un altro. Quindi non e` "ammesso come
// secondario": e` un motivo per non tirare affatto.
// Il CAMO resta ammesso (prova sopra): i due Marker si comportano in modo
// opposto sotto la Sagoma, ed e` esattamente la differenza che va fissata.
const secSpeculo = comeSecondario(speculo);
ok(secSpeculo.ammesso === false,
   'il Marker Impersonation NON è ammesso nemmeno come secondario (conta come alleato)');
ok(secSpeculo.annullaIlColpo === true,
   'e porta annullaIlColpo: true — non è un bersaglio in meno, è il colpo che si annulla');
ok(/ANNULLA il colpo/.test(perche(secSpeculo)) && /alleato/.test(perche(secSpeculo)),
   `col motivo che lo spiega al giocatore (${perche(secSpeculo).slice(0, 65)}…)`);
ok(/1428[3-9]/.test(perche(secSpeculo)),
   `e la riga del regolamento citata (${(/1428[3-9]/.exec(perche(secSpeculo)) || ['nessuna'])[0]})`);
// CONTROPROVA, due volte: annullaIlColpo NON è un campo sempre acceso, e
// il CAMO non lo porta. Senza queste, "true" non si distingue da "sempre".
ok(comeSecondario(croc).annullaIlColpo === undefined,
   'CONTROPROVA: il Marker CAMO come secondario NON annulla il colpo');
ok(comeSecondario(M.rosterNemico().find(u => u.id === 'p1') || { id: 'p1', alias: 'Fusilier', tipo: 'LI', states: {} })
       .annullaIlColpo === undefined,
   'e nemmeno un Modello scoperto: il campo compare solo dove serve');

console.log('\n=== 7. Invio ===');
nuovo(granatiere);
window.currentOrder.weapon = 'Grenades';
window.combatTargets = [{ id: 'p1', name: 'Fusilier', burst: 1 }];
window.preparaModificatoriSpeculativo();
window.eseguiCalcoloSpeculativo();
ok(inviato !== null, 'spedito');
const a = inviato && inviato.attacchi[0];
ok(a && a.azione === M.AZIONI.SPECULATIVO, 'azione canonica');
ok(a && a.regole.attributo === 'PH', 'il payload dice all Hub di usare il PH');
ok(a && a.regole.ignoraCopertura && a.regole.ignoraMimetismo,
   'il payload esplicita cosa ignorare (prima c era solo il flag isSpeculative)');
ok(a && a.regole.modTotale === -3, 'MOD totale nel payload');
ok(a && a.arma.burst === 1, 'Burst 1');

nuovo(granatiere);
window.currentOrder.weapon = 'Grenades';
window.combatTargets = [{ id: 'generic1', name: 'Bersaglio Primario', burst: 1, rangeIndex: 0, rangeMod: 3 }];
window.eseguiCalcoloSpeculativo();
ok(inviato === null, 'bersaglio fantasma: bloccato');

// ==================================================================
// 8. I BERSAGLI SECONDARI SOTTO LA SAGOMA
//    Aggiunto il 6 ottobre. Fino alla 2026-10-06.4 la schermata teneva
//    UN SOLO bersaglio: il motore ammetteva il secondario (ruolo
//    'secondario') e non c'era modo di dichiararlo. Al tavolo Paolo
//    tirava una granata in mezzo a tre nemici e il tabellone ne
//    mostrava uno: la famiglia di difetti di sempre — qualcosa che il
//    motore produce e che non arriva a chi legge.
//    Valori dichiarati da MOTORE e riprodotti qui.
// ==================================================================
console.log('\n=== 8. ANCHE SOTTO LA SAGOMA: i bersagli secondari ===');

// Terzo nemico: serve per provare che il riquadro ne elenca PIÙ di uno
// e che il ritocco toglie il giusto. Il roster si cambia qui, dopo la
// sezione 6, che pretende i due di partenza.
// Il Croc Man qui ha il Mimetismo DAVVERO (-3 scritto nelle skill). Nella
// sezione 6 è un oggetto nudo: con quello, la prova "nessuna voce di
// Mimetismo sul Marker" passerebbe perché il Mimetismo non c'è, non
// perché lo Speculativo lo ignora. Visto il 6 ottobre spegnendo
// ignoraMimetismo nel motore: il banco restava verde.
const orc = { id: 'p3', alias: 'Orc', tipo: 'HI', states: {} };
const crocMimetico = { id: 'p2', alias: 'Croc Man', tipo: 'LI', deployState: 'CAMO',
                       states: { camo: true }, skills: 'Mimetism (-3), Camouflage' };
const lanciatore = { id: 'n3', alias: 'Lanciatore', bs: 11, ph: 11, wip: 13,
                     weapon: 'Pitcher', states: {} };
M._rosterProprio = [granatiere, missilista, lanciatore];
M._rosterNemico = [
    { id: 'p1', alias: 'Fusilier', tipo: 'LI', states: {} },
    crocMimetico,
    orc
];

function sagomaPronta() {
    nuovo(granatiere);
    window.currentOrder.weapon = 'Grenades';
    window.combatTargets = [{ id: 'p1', name: 'Fusilier', burst: 3, cover: true }];
    window.preparaModificatoriSpeculativo();
}

console.log('\n--- 8a. il riquadro c è, e dice chi ---');
sagomaPronta();
let riq = window.htmlSecondariSpeculativo();
ok(riq.includes('ANCHE SOTTO LA SAGOMA'),
   'Arma a Sagoma Circolare: il riquadro ANCHE SOTTO LA SAGOMA esiste');
ok(riq.includes('Croc Man') && riq.includes('Orc'),
   'elenca entrambi gli altri nemici (Croc Man e Orc)');
ok(!riq.includes('Fusilier'),
   'il Bersaglio Principale NON è fra i candidati: è già sotto la Sagoma');
ok(riq.includes('toggleSecondarioSpeculativo'),
   'ogni bottone chiama window.toggleSecondarioSpeculativo');
ok(nodo('targets-allocation-container').innerHTML.includes('ANCHE SOTTO LA SAGOMA'),
   'e il riquadro arriva a schermo: preparaModificatoriSpeculativo lo stampa');
// Il Marker fra i candidati: l altra metà della sezione 6. Là il Croc
// Man è escluso come PRINCIPALE; qui deve comparire come secondario.
ok(/☐ .*Croc Man/.test(riq),
   'il Marker CAMO compare fra i secondari (escluso come principale, ammesso sotto la Sagoma)');

console.log('\n--- 8b. CONTROPROVA: senza Sagoma Circolare, nessun riquadro ---');
// Il Pitcher ha il Tratto Speculative Attack ma NON una Sagoma: se il
// riquadro sparisse per il motivo sbagliato (arma non speculativa,
// roster vuoto) questa prova non lo distinguerebbe dalla 8a. Perciò si
// fissa anche il Tratto.
const pitcher = M.profiloArma('Pitcher');
ok(/Speculative Attack/.test(String(pitcher && pitcher.traits)),
   'il Pitcher È un arma da Fuoco Speculativo (il Tratto c è)');
ok(M.regoleTemplate(pitcher) === null,
   'ma non ha una Sagoma: regoleTemplate -> null');
nuovo(lanciatore);
window.currentOrder.weapon = 'Pitcher';
window.combatTargets = [{ id: 'p1', name: 'Fusilier', burst: 1, rangeIndex: 0, rangeMod: 0 }];
ok(window.htmlSecondariSpeculativo() === '',
   'niente riquadro per il Pitcher: la Sagoma è il requisito, non lo Speculativo');
window.toggleSecondarioSpeculativo('p2');
ok(window.combatTargets.length === 1,
   'e nemmeno chiamando il toggle a mano si aggiunge un secondario');

console.log('\n--- 8c. il tocco: entra con il dado e la gittata del Principale ---');
sagomaPronta();
const primo = window.combatTargets[0];
ok(primo.rangeMod === 3 && primo.ammo === 'N',
   `il Principale parte a +3 di gittata, munizione N (gittata ${primo.rangeMod}, mun ${primo.ammo})`);
window.toggleSecondarioSpeculativo('p2');
ok(window.combatTargets.length === 2, 'toccato il Croc Man: due bersagli');
const sec = window.combatTargets[1];
ok(sec.ruolo === 'secondario', `il nuovo entra con ruolo secondario (${sec.ruolo})`);
ok(window.combatTargets[0].ruolo === 'principale',
   `e il primo viene marcato principale (${window.combatTargets[0].ruolo})`);
ok(sec.burst === 1, `Burst 1 sul secondario (${sec.burst})`);
ok(sec.rangeIndex === primo.rangeIndex && sec.rangeMod === primo.rangeMod && sec.ammo === primo.ammo,
   `gittata e munizione copiate dal Principale (${sec.rangeMod}, ${sec.ammo}): la Sagoma è una sola`);
ok(sec.cover === false, 'nessuna copertura sul secondario: la Sagoma la annulla');
window.toggleSecondarioSpeculativo('p3');
ok(window.combatTargets.length === 3 &&
   window.combatTargets.map(t => t.id).join(',') === 'p1,p2,p3',
   `tre bersagli, il Principale sempre in testa (${window.combatTargets.map(t => t.id).join(',')})`);

console.log('\n--- 8d. il ritocco toglie, e toglie quello giusto ---');
window.toggleSecondarioSpeculativo('p2');
ok(window.combatTargets.map(t => t.id).join(',') === 'p1,p3',
   `ritoccato il Croc Man: esce lui, l Orc resta (${window.combatTargets.map(t => t.id).join(',')})`);
// CONTROPROVA. "Non si aggiunge" deve distinguersi da "il toggle non
// funziona": nella stessa sequenza un id ammesso entra eccome.
window.toggleSecondarioSpeculativo('p9999');
ok(window.combatTargets.map(t => t.id).join(',') === 'p1,p3',
   'un id che non è fra i candidati non aggiunge nulla');
window.toggleSecondarioSpeculativo('p1');
ok(window.combatTargets.map(t => t.id).join(',') === 'p1,p3',
   'e il Principale non può diventare secondario di sé stesso: il suo id non fa niente');
window.toggleSecondarioSpeculativo('p2');
ok(window.combatTargets.map(t => t.id).join(',') === 'p1,p3,p2',
   'CONTROPROVA: nella stessa sequenza un id ammesso rientra — il toggle funziona');

console.log('\n--- 8e. la gittata si cambia per tutti insieme ---');
window.setTargetRangeSpeculativo(1);
const gittate = window.combatTargets.map(t => `${t.rangeIndex}/${t.rangeMod}`).join(' ');
ok(window.combatTargets.every(t => t.rangeIndex === 1 && t.rangeMod === -3),
   `setTargetRangeSpeculativo(1): -3 su tutti e tre (${gittate})`);
ok(window.combatTargets.length === 3,
   'e i tre bersagli ci sono ancora: la prova sopra non passa a vuoto su una lista corta');
window.setTargetRangeSpeculativo(0);
ok(window.combatTargets.every(t => t.rangeMod === 3),
   'CONTROPROVA: tornando alla prima banda risalgono tutti a +3');

console.log('\n--- 8f. la busta: un tiro, tre bersagli ---');
sagomaPronta();
window.toggleSecondarioSpeculativo('p2');
window.toggleSecondarioSpeculativo('p3');
window.eseguiCalcoloSpeculativo();
ok(inviato !== null, 'spedito');
ok(inviato && inviato.attacchi.length === 1,
   `UN SOLO attacco nella busta (${inviato && inviato.attacchi.length}): il tiro è uno`);
const bers = (inviato && inviato.attacchi[0].bersagli) || [];
ok(bers.length === 3, `tre bersagli dentro quell attacco (${bers.length})`);
ok(bers.map(b => b.ruolo).join(',') === 'principale,secondario,secondario',
   `i ruoli viaggiano nella busta (${bers.map(b => b.ruolo).join(',')})`);
ok(bers.every(b => b.burst === 1 && b.rangeMod === 3),
   'tutti e tre col Burst 1 e la stessa gittata');

console.log('\n--- 8g. l Hub li risolve: tre scontri, un MOD solo ---');
// Valori dichiarati da MOTORE: Intruder (qui il Granatiere) con
// Grenades, Principale un Fusilier, secondari il Croc Man in CAMO e un
// Orc -> tre scontri, STESSO MOD per tutti (nessun Mimetismo sul
// Marker: lo Speculativo lo ignora), ciascuno con la sua salvezza, e
// sul Marker la nota che il CAMO cade (riga 13638).
const tuttiInCampo = [granatiere].concat(M.rosterNemico());
const trovaUnita = (n) => tuttiInCampo.find(u =>
    M.nomeUnita(u).toUpperCase() === String(M.nomeUnita(n) || n).toUpperCase()) || null;
const scontri = M.risolviPayload(inviato, [], { trovaUnita }) || [];
ok(scontri.length === 3, `tre scontri sul tabellone (${scontri.length})`);
ok(scontri.map(s => s.bersaglioDiSagoma).join(',') === 'PRINCIPALE,SECONDARIO,SECONDARIO',
   `il campo bersaglioDiSagoma distingue i ruoli (${scontri.map(s => s.bersaglioDiSagoma).join(',')})`);
ok(scontri.map(s => (s.reattivo || {}).nome).join(',') === 'Fusilier,Croc Man,Orc',
   `e ogni scontro ha il suo bersaglio (${scontri.map(s => (s.reattivo || {}).nome).join(',')})`);
const mods = scontri.map(s => (s.attivo || {}).mod);
ok(mods.length === 3 && mods.every(m => m === 9),
   `MOD identico sui tre: PH 12 -6 +3 = 9 (ottenuti ${mods.join(', ')})`);
// CONTROPROVA sul MOD: "uguale per tutti" non deve essere "il MOD non
// si calcola". Si fissano le due voci che lo compongono, e l assenza
// del Mimetismo del Marker.
const vociSec = ((scontri[1] || {}).attivo || {}).voci || [];
ok(vociSec.some(v => v.fonte === 'speculativo' && v.valore === -6) &&
   vociSec.some(v => v.fonte === 'gittata' && v.valore === 3),
   'il MOD del secondario è scomposto nelle sue due voci: -6 fisso e +3 di gittata');
ok(!vociSec.some(v => /mimetismo/i.test(String(v.fonte) + String(v.motivo))),
   'nessuna voce di Mimetismo sul Marker: lo Speculativo lo ignora per regola');
// CONTROPROVA del Mimetismo. Senza questa, "nessuna voce" non distingue
// "ignorato" da "non c era": lo stesso Croc Man, con un fucile normale,
// il -3 lo prende eccome.
// ATTENZIONE ALLA FIRMA: modAttacco(attaccante, difensore, arma, AZIONE, ctx)
// — l azione è il QUARTO argomento, non una chiave di ctx. Passandola
// dentro ctx il motore non la vede e scende nel ramo generale: il 6
// ottobre ho creduto per mezz ora di aver trovato un difetto del motore,
// ed era la mia chiamata. Stessa trappola del Tiro di Scoperta.
const bsSulCroc = M.modAttacco(granatiere, crocMimetico,
    M.profiloArma('Combi Rifle'), M.AZIONI.BS_ATTACK, { rangeIndex: 0 });
ok(bsSulCroc.voci.some(v => v.fonte === 'mimetismo' && v.valore === -3),
   `questo Croc Man HA il Mimetismo: con un Combi Rifle in ATTACCO BS è -3 (mod totale ${bsSulCroc.mod})`);
const specSulCroc = M.modAttacco(granatiere, crocMimetico,
    M.profiloArma('Grenades'), M.AZIONI.SPECULATIVO, { rangeIndex: 0 });
ok(!specSulCroc.voci.some(v => v.fonte === 'mimetismo'),
   `e sullo stesso bersaglio, in FUOCO SPECULATIVO, quella voce non c è (mod ${specSulCroc.mod}: +3 gittata -6 fisso)`);

ok(scontri.every(s => ((s.reattivo || {}).salvezzaSubita || {}).valoreSuccesso === 7),
   'ciascuno tira la SUA salvezza: ARM 0 contro PS 7 su tutti e tre');
// La nota del Marker: deve stare sullo scontro del Croc Man e SOLO lì.
const notaMarker = (s) => String((((s || {}).reattivo || {}).salvezzaSubita || {}).noteMarker || '');
ok(/13638/.test(notaMarker(scontri[1])) && /CAMO/.test(notaMarker(scontri[1])),
   `sul Marker la nota che il CAMO cade comunque, con la riga citata (${notaMarker(scontri[1]).slice(0, 70)}…)`);
ok((((scontri[1].reattivo || {}).salvezzaSubita || {}).cancellaMarker) === true,
   'e il campo cancellaMarker dice all app di sostituire il Marker col Modello');
ok(!(((scontri[0].reattivo || {}).salvezzaSubita || {}).cancellaMarker) &&
   !(((scontri[2].reattivo || {}).salvezzaSubita || {}).cancellaMarker),
   'CONTROPROVA: sul Fusilier e sull Orc cancellaMarker NON c è — non è un campo sempre acceso');

console.log('\n--- 8h. il ruolo lo decide la busta, non la posizione ---');
// L app mette sempre il Principale in testa, e allora "primo = principale"
// e "ruolo = principale" dicono la stessa cosa: una busta in ordine non
// distingue le due letture. Qui il ruolo va CONTRO la posizione.
const bustaRovescia = JSON.parse(JSON.stringify(inviato));
bustaRovescia.attacchi[0].bersagli = [
    Object.assign({}, bers[1], { ruolo: 'secondario' }),
    Object.assign({}, bers[0], { ruolo: 'principale' }),
    Object.assign({}, bers[2], { ruolo: 'secondario' })
];
const rovesci = M.risolviPayload(bustaRovescia, [], { trovaUnita }) || [];
ok(rovesci.length === 3, `tre scontri anche sulla busta rovescia (${rovesci.length})`);
ok(rovesci.map(s => s.bersaglioDiSagoma).join(',') === 'SECONDARIO,PRINCIPALE,SECONDARIO',
   `il motore legge bersaglio.ruolo, non l indice: il Principale è il SECONDO (${rovesci.map(s => s.bersaglioDiSagoma).join(',')})`);
ok(rovesci[1].reattivo.nome === 'Fusilier' && rovesci[0].reattivo.nome === 'Croc Man',
   'e i bersagli seguono l ordine della busta: il Fusilier resta il Principale pur essendo secondo');

// ==================================================================
// REQUISITI DICHIARATI AL TAVOLO — Fuoco Speculativo (gittata, sul Principale)
//   Nuovo il 7 ottobre. MOTORE ha misurato dalla pagina BS, CC, Hacking e
//   Scoprire; lo Speculativo NO. Il tasto vive su btn-esegui-calcolo e la
//   schermata lo CLONA: nel finto DOM il clone e` 'btn-esegui-calcolo_c'.
//   🔴 'gittata' legge `fuoriGittata` a polarita` INVERTITA (manca se true):
//   si gira dal motore, M.invertiRequisito, non scrivendo il campo a mano.
// ==================================================================
console.log('\n=== 9. REQUISITI AL TAVOLO: gittata sul Principale ===');
const tastoS = () => el['btn-esegui-calcolo_c'] || {};
function prontoS() {
    nuovo(granatiere);
    window.currentOrder.weapon = 'Grenades';
    window.combatTargets = [{ id: 'p1', name: 'Fusilier', burst: 3, cover: true, fuoriGittata: false }];
    window.preparaModificatoriSpeculativo();
}
prontoS();
ok(/^(LANCIA|ESEGUI|TIRA)/.test(String(tastoS().innerText)),
   `gittata dichiarata: il tasto porta l etichetta dell azione (${tastoS().innerText})`);
const etichettaSana = String(tastoS().innerText);
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
ok(tastoS().style && tastoS().style.background === M.COLORE_TASTO.valido,
   `e il tasto lo porta (${tastoS().style && tastoS().style.background})`);
prontoS();
M.invertiRequisito(window.combatTargets[0], 'gittata');
window.preparaModificatoriSpeculativo();
ok(tastoS().innerText === 'IDLE',
   `Principale fuori gittata: il tasto diventa IDLE (${tastoS().innerText})`);
ok(tastoS().style && tastoS().style.background === '#ffcc00',
   `ed è giallo (${tastoS().style && tastoS().style.background})`);
ok(etichettaSana !== 'IDLE',
   `e i due stati si distinguono (${etichettaSana} / IDLE)`);
// 🔴 I SECONDARI NON CONTANO: il requisito si guarda sul solo Principale,
// perche` la Sagoma e` una e la gittata si misura al centro. Si gira il
// SECONDARIO da solo: se il motore guardasse tutta la lista, due bersagli
// di cui uno fuori gittata non sarebbero "tutti" e l Idle non partirebbe
// comunque — la prova sarebbe verde per il motivo sbagliato.
prontoS();
window.toggleSecondarioSpeculativo('p2');
// Si legge con un lettore che non cade: se il secondario non entrasse, un
// accesso diretto a combatTargets[1] ucciderebbe il banco invece di farlo
// diventare rosso — e porterebbe via le prove che restano. Visto il 7
// ottobre scrivendo proprio questa sezione.
const secReq = () => window.combatTargets[1] || {};
const priReq = () => window.combatTargets[0] || {};
ok(window.combatTargets.length === 2,
   `premessa: due bersagli, Principale e secondario (${window.combatTargets.length}: ${window.combatTargets.map(x => x.id).join(',')})`);
M.invertiRequisito(secReq(), 'gittata');
// Si ridisegna con renderSpeculativo, NON con preparaModificatoriSpeculativo:
// `prepara` e` l'INGRESSO nella schermata e rifa` la lista dei bersagli da
// zero, buttando via i secondari. Il tasto lo scrive `render`, che e` anche
// quello che chiama il toggle — quindi e` il percorso vero dell'app.
// Chiamando `prepara` due volte il secondario spariva e il banco CADEVA
// invece di diventare rosso. Visto il 7 ottobre.
window.renderSpeculativo();
ok(secReq().fuoriGittata === true && priReq().fuoriGittata === false,
   `il secondario è fuori gittata, il Principale no (${JSON.stringify([priReq().fuoriGittata, secReq().fuoriGittata])})`);
ok(tastoS().innerText !== 'IDLE',
   `solo il secondario fuori gittata: si tira comunque (${tastoS().innerText})`);
// E il tasto IDLE porta all Idle vero, col motivo del motore.
prontoS();
M.invertiRequisito(window.combatTargets[0], 'gittata');
window.preparaModificatoriSpeculativo();
let motivoS = null;
const salvaS = window.dichiaraRequisitoFallito;
window.dichiaraRequisitoFallito = (m) => { motivoS = m; return true; };
tastoS().onclick();
ok(motivoS !== null && /fuori gittata/.test(String(motivoS)),
   `cliccandolo chiama l Idle col motivo del motore (${String(motivoS).slice(0, 50)}…)`);
// CONTROPROVA: a gittata dichiarata NON chiama l Idle.
prontoS();
motivoS = null;
tastoS().onclick();
ok(motivoS === null, 'CONTROPROVA: col requisito a posto il tasto NON chiama l Idle');
window.dichiaraRequisitoFallito = salvaS;

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
