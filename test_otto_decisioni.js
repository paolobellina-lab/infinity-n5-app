// @versione 2026-09-23.1 | test_otto_decisioni.js | proprieta`: chat TEST
// Le otto decisioni — node test_otto_decisioni.js
global.window = global;
global.document = { title: 'NOMADS TACTICAL TERMINAL' };
require('./catalogo_n5.js'); require('./database_comune.js');
require('./database_nomad.js'); require('./database_panoceania.js');
const M = require('./motore_regole_n5.js');

let passati = 0, falliti = 0;
function ok(c, n, e) { if (c) { passati++; console.log(`  ✅ ${n}`); } else { falliti++; console.log(`  ❌ ${n}${e ? '\n       ' + e : ''}`); } }

const alg = { alias: 'Alguacil', bs: 11, skills: '', states: {} };
const combi = M.profiloArma('Combi Rifle');

console.log('\n=== 1+2. NO COVER e LIMITED COVER non sono la stessa cosa ===');
// No Cover: "do not benefit from Partial Cover MODs" — plurale, cadono entrambi.
// Limited Cover: "do not apply the -3 BS MOD" — solo quello.
function prova(skill) {
    const b = { alias: 'B', arm: 1, bts: 0, skills: skill, states: {} };
    return { tiro: M.modAttacco(alg, b, combi, M.AZIONI.BS_ATTACK, { rangeIndex: 0, cover: true }).valore,
             salv: M.tiroSalvezza(b, { arma: combi, cover: true }).valoreSuccesso };
}
const normale = prova(''), noCover = prova('No Cover'), limited = prova('Limited Cover');
ok(normale.tiro === 11 && normale.salv === 11, 'senza skill: tiro 11, salvezza 11');
ok(noCover.tiro === 14, 'No Cover: il -3 al tiro cade (14)');
ok(noCover.salv === 8, 'No Cover: ANCHE il +3 ARM cade (8)');
ok(limited.tiro === 14, 'Limited Cover: il -3 al tiro cade (14)');
ok(limited.salv === 11, 'Limited Cover: il +3 ARM RESTA (11) — è la differenza');
ok(noCover.salv !== limited.salv, 'e le due skill danno risultati diversi, come devono');

// con entrambe vince la più severa
const doppia = prova('No Cover, Limited Cover');
ok(doppia.salv === 8, 'con entrambe vince No Cover');

console.log('\n=== 3. COMBAT INSTINCT ignora l Attacco a Sorpresa ===');
const spektr = { alias: 'Spektr', bs: 12, skills: 'Surprise Attack (-3)', states: { camo: true } };
function reaz(skill) {
    return M.modReazione({ alias: 'D', bs: 12, ph: 11, skills: skill, states: {} },
        { azione: 'DODGE' }, { attacco: { attaccante: spektr } }).valore;
}
ok(reaz('') === 8, 'senza: PH 11 -3 = 8');
ok(reaz('Combat Instinct') === 11, 'con Combat Instinct: PH pieno, il -3 non si applica');
ok(window.CATALOGO_N5.STEALTH_INEFFICACE.skill.indexOf('Combat Instinct') >= 0,
   'e lo Stealth non è efficace contro di lui');

console.log('\n=== 4. NEUROCINETICS: Burst 1 in attivo su TUTTE le armi BS ===');
const sin = { alias: 'Sin-Eater', bs: 12, skills: 'Neurocinetics, Total Reaction', states: {} };
const hmg = M.profiloArma('Heavy Machine Gun');
ok(M.burstIniziale(sin, hmg, { azione: M.AZIONI.BS_ATTACK }).valore === 1,
   'HMG B4 -> B1 in Turno Attivo');
// 🔴 la clausola che mancava: i MOD al Burst valgono SOLO in reattivo
ok(M.burstIniziale(sin, hmg, { azione: M.AZIONI.BS_ATTACK, livelloFireteam: 4 }).valore === 1,
   'e un Fireteam di Livello 4 NON alza il Burst in attivo');
// 🔴 Qui c'era === 3: il valore era stato preso dal MOTORE, che dava un 3
// fisso, invece che dalla regola. Neurocinetics dà il Burst PIENO dell'arma
// in ARO contro un bersaglio: HMG B4 -> 4 (righe 10221-10228, MAPPA blocco 2).
ok(M.burstReattivo(sin, hmg, {}).valore === 4, 'in Reattivo il Burst è pieno: HMG B4 -> 4');
ok(M.burstReattivo(sin, hmg, {}).unSoloBersaglio === true, 'e Neurocinetics lo vuole contro un solo bersaglio');
const conCC = { alias: 'X', bs: 12, cc: 15, skills: 'Neurocinetics', states: {} };
ok(M.burstCC(conCC, M.profiloArma('CC Weapon'), {}).valore !== 0,
   'e le armi da CC non sono toccate: la regola parla di armi BS');

console.log('\n=== 5. SIXTH SENSE: NESSUN MOD negativo, tre eccezioni ===');
function schivata(skill, stati, lof) {
    return M.modSchivata({ alias: 'S', ph: 11, wip: 12, skills: skill, states: stati || {} },
        { haLoFVersoAttaccante: lof }).valore;
}
ok(schivata('', {}, false) === 8, 'senza: -3 per assenza di LoF');
ok(schivata('Sixth Sense', {}, false) === 11, 'con Sesto Senso: nessun -3');
ok(schivata('Sixth Sense', { suppressive: true }, false) === 11,
   'e ignora anche la Soppressione: la regola è più larga di "niente -3 senza LoF"');

// le tre eccezioni RESTANO
ok(schivata('Sixth Sense', { immobilizedA: true }, true) === 5,
   'eccezione IMM-A: il -6 PH resta (5)');
ok(M.modReset({ alias: 'R', wip: 12, skills: 'Sixth Sense', states: { immobilizedB: true } }, {}).valore === 9,
   'eccezione IMM-B: il -3 WIP resta (9)');
ok(M.modReset({ alias: 'R', wip: 12, skills: 'Sixth Sense', states: { isolated: true } }, {}).valore === 3,
   'eccezione Isolato: il -9 WIP resta (3)');

console.log('\n=== 6. HIDDEN DEPLOYMENT: non è sul tavolo ===');
M._fazione = 'NOMADI';
const nascosto = { id: 'x', alias: 'Spia', tipo: 'LI', arm: 1, skills: 'Hidden Deployment', states: { hidden: true } };
const rivelato = Object.assign({}, nascosto, { states: {} });
const gN = M.bersagliValidi(M.AZIONI.BS_ATTACK, [nascosto], {})[0];
ok(!gN.ammesso, 'nascosto: non bersagliabile');
ok(/non è sul tavolo/.test(gN.motivo), 'col motivo del regolamento, non per effetto collaterale');
ok(M.bersagliValidi(M.AZIONI.BS_ATTACK, [rivelato], {})[0].ammesso,
   'rivelato: bersagliabile — cambia lo STATO, non il roster');

// 🔴 una Sagoma non sceglie un bersaglio: serve un controllo a parte
ok(M.colpitoDaSagoma(nascosto).colpito === false, 'le Sagome NON lo colpiscono');
ok(/Sagome non lo colpiscono/.test(M.colpitoDaSagoma(nascosto).motivo), 'col motivo');
ok(M.colpitoDaSagoma(rivelato).colpito === true, 'una volta rivelato, sì');
const sotto = M.bersagliSottoSagoma([nascosto, rivelato]);
ok(sotto.filter(x => x.colpito).length === 1, 'sotto una Sagoma: uno solo colpito su due');

console.log('\n=== 7. CLIMBING PLUS: mezzo ordine invece di uno ===');
ok(M.tipoScalata({ alias: 'X', skills: '' }).tipo === 'LONG_SKILL', 'senza: Ordine Intero');
ok(M.tipoScalata({ alias: 'X', skills: 'Climbing Plus' }).tipo === 'SHORT_SKILL', 'con: Abilità Breve');
ok(M.tipoScalata({ alias: 'X', skills: 'Climbing Plus' }).climbingPlus === true, 'e lo dichiara');

console.log('\n=== 8. Lo Stealth non ferma un Deployable ===');
const SI = window.CATALOGO_N5.STEALTH_INEFFICACE;
ok(SI.controDeployable === true, 'lo Stealth non impedisce a un Deployable di scattare');
ok(SI.skill.indexOf('Sixth Sense') >= 0, 'né funziona contro il Sesto Senso');

console.log('\n=== 9. Il Foxhole non è più DA VERIFICARE ===');
const F = window.CATALOGO_N5.TRINCERARSI.statoFoxhole;
ok(/p\.158/.test(F.fonte) && /regolamento/.test(F.fonte),
   'la fonte è il regolamento, non il vecchio codice');
ok(/Silhouette 3/.test(F.silhouette), 'Silhouette 3 o il proprio se più alto');
ok(/360/.test(F.copertura), 'Copertura Parziale in arco 360°');
ok(F.concede.indexOf('Mimetism (-3)') >= 0 && F.concede.indexOf('Courage') >= 0,
   'concede Mimetism (-3) e Courage');
ok(/Schivata riuscita/.test(F.bloccaMovimento),
   'e blocca OGNI movimento, compreso quello di una Schivata riuscita');

console.log('\n=== 10. I conteggi sui profili ===');
const db = [].concat(window.DB_NOMADI, window.DB_PANOCEANIA);
function conta(k) { return db.filter(u => new RegExp(k, 'i').test((u.skills || '') + ' ' + (u.equip || ''))).length; }
[['No Cover', 22], ['Limited Cover', 18], ['Combat Instinct', 20], ['Neurocinetics', 13],
 ['Hidden Deployment', 26], ['Climbing Plus', 41], ['Minelayer', 21]
].forEach(function (c) {
    ok(conta(c[0]) === c[1], `${c[0]}: ${c[1]} profili (trovati ${conta(c[0])})`);
});

console.log('\n=== 11. Le citazioni verificate sulla FONTE COMPLETA ===');
// Il PDF integrale è ora estraibile: 24.553 righe, contro le 8.545 di PARTE_1.
const fs = require('fs');
let testo = null;
// Il testo delle regole nel progetto: REGOLE_N5_v5_1_1.txt, 17.029 righe.
try { testo = fs.readFileSync('./REGOLE_N5_v5_1_1.txt', 'utf8'); }
catch (e) { try { testo = fs.readFileSync('./regole.txt', 'utf8'); } catch (e2) { testo = null; } }
if (testo) {
    [['do not benefit from Partial Cover', 'No Cover'],
     ['do not apply the -3 BS MOD', 'Limited Cover'],
     ['ignores Surprise Attack MODs', 'Combat Instinct'],
     ['Any MOD to B only applies in the Reactive Turn', 'Neurocinetics'],
     ['no negative MODs are applied', 'Sixth Sense'],
     ['not to be on the game table', 'Hidden Deployment'],
     ['no enemy Troopers or Camouflage Markers inside the', 'Minelayer'],
     ['including movement granted by a successful Dodge Roll', 'Foxhole']
    ].forEach(function (c) {
        ok(testo.indexOf(c[0]) >= 0, `${c[1]}: citazione presente nella fonte completa`);
    });
} else {
    ok(true, 'fonte completa non presente in questo ambiente: citazioni non riverificate');
}

console.log('\n=== 12. Minelayer: i due requisiti ===');
const ML = window.CATALOGO_N5.MINELAYER;
ok(ML.requisiti.length === 2, 'due requisiti, non uno');
ok(/Area d'Innesco/.test(ML.requisiti[0]), 'il primo: niente nemici nell Area d Innesco');
ok(/Zona di Schieramento|area in cui/.test(ML.requisiti[1]), 'il secondo: dentro la propria area di schieramento');
ok(ML.domande.length === 2, 'e due domande, perché l app non ha la mappa');
// Motore 2026-09-22.1: il Minelayer e` collegato. Il test prima asseriva
// `daFare` — lo stato di allora; ora asserisce lo stato vero, e che non
// resti anche l'annotazione vecchia (due verita` sullo stesso punto).
ok(ML.collegato === true, 'il Minelayer e` collegato (collegato: true)');
ok(!ML.daFare, 'e non porta piu` l annotazione daFare');
ok(typeof M.opzioniMinelayer === 'function' && typeof M.piazzaConMinelayer === 'function',
   'con le funzioni che lo fanno davvero');

console.log('\n=== 13. Foxhole: i dettagli dalla fonte ===');
const F2 = window.CATALOGO_N5.TRINCERARSI.statoFoxhole;
ok(/Schivata/.test(F2.cancellazioneSuSchivata || ''),
   'si annulla anche all inizio di un movimento di Schivata');
ok(/TUTTI i vantaggi/.test(F2.perdeTutto || ''), 'e annullandolo si perde tutto');
ok(/fonte completa/.test(F2.fonte), 'fonte: il regolamento completo');

console.log('\n=== 14. 🔴 L IDLE GENERA ARO ===');
// Il catalogo diceva generaAro: false, ed era l unica azione di movimento
// a non generarne. L Idle è ciò che si dichiara quando NON si soddisfano i
// requisiti di un Abilità, quindi chi falliva un requisito non generava
// l ARO che spetta all avversario.
ok(M.azioneSenzaTiro('IDLE').generaAro === true, 'IDLE genera ARO');
const senzaAro = Object.keys(window.CATALOGO_N5.MOVIMENTO.senzaTiro)
    .filter(k => !window.CATALOGO_N5.MOVIMENTO.senzaTiro[k].generaAro);
ok(senzaAro.indexOf('IDLE') < 0, 'e non è più fra quelle che non ne generano');

console.log('\n=== 15. L Idle da requisito fallito porta conseguenze ===');
// "non hai fatto niente" suggerisce che non sia successo niente: non è vero.
const scelto = M.regoleIdle({});
const fallito = M.regoleIdle({ daRequisitoFallito: true });
ok(scelto.generaAro === true && fallito.generaAro === true, 'entrambi generano ARO');
ok(scelto.spendeDisposable === false, 'un Idle SCELTO non spende Disposable');
ok(fallito.spendeDisposable === true, 'uno da requisito fallito SÌ');
ok(fallito.rivelaMarker === true, 'e rivela la truppa in forma di Marker');
ok(fallito.note.some(n => /Disposable/.test(n)) && fallito.note.some(n => /Marker/.test(n)),
   'con entrambe le note');

const inCamo = { alias: 'Moran', skills: '', states: { camo: true }, usiSpesi: {} };
const cons = M.conseguenzeIdle(inCamo, M.profiloArma('CrazyKoalas'));
ok(cons.rivelata === true, 'conseguenzeIdle: la truppa in Camo viene rivelata');
ok(cons.note.some(n => /uso Disposable/.test(n)), 'e l uso è speso comunque');

console.log('\n=== 16. Trincerarsi senza spazio: è un Idle vero ===');
const sap = { alias: 'Zappatore', skills: 'Sapper', states: {} };
const tri = M.risolviTrincerarsi(sap, false);
ok(tri.idle === true, 'esegue un Idle');
ok(tri.generaAro === true, 'che GENERA ARO — prima il nemico non reagiva');
ok(tri.note.some(n => /Ordine è comunque speso/.test(n)), 'e l Ordine è speso');

console.log('\n=== 17. CHI APPLICA le conseguenze dell Idle ===');
// Stessa risposta di creaDeployable: il motore calcola l unità AGGIORNATA,
// l app la sostituisce. Così "rivelata e sostituita col Modello" vive in un
// posto solo, e l interfaccia non deve sapere che rivelare significa toccare
// deployState, state E states.camo insieme.
const inCamo2 = { id: 'n1', alias: 'Moran', deployState: 'CAMO_1', state: 'CAMO',
                  skills: '', states: { camo: true }, usiSpesi: {} };
const koala2 = M.profiloArma('CrazyKoalas');
const app = M.applicaIdle(inCamo2, koala2, {});

ok(app.unitaAggiornata.deployState === 'NORMAL', 'deployState -> NORMAL');
ok(app.unitaAggiornata.state === 'ACTIVE', 'state -> ACTIVE');
ok(app.unitaAggiornata.states.camo === false, 'states.camo -> false');
ok(app.mutazioni.length === 3, 'tre mutazioni: rivelare tocca TRE campi, non uno');
ok(inCamo2.deployState === 'CAMO_1', 'e l originale non è toccato: l app decide quando sostituire');

const chiave = Object.keys(app.unitaAggiornata.usiSpesi)[0];
ok(app.unitaAggiornata.usiSpesi[chiave] === 1, 'e un uso Disposable è scalato');

// un Idle SCELTO non applica niente
const pulito2 = { alias: 'X', skills: '', states: {}, usiSpesi: {} };
ok(M.applicaIdle(pulito2, null, {}).daApplicare === false,
   'un Idle scelto: nulla da applicare');

console.log('\n=== 18. Un ordine già dichiarato che diventa Idle ===');
// 🔴 NON è un annullamento: l ARO resta, le conseguenze si applicano,
// l Ordine è speso. Un "annulla" farebbe credere che si torni indietro.
const conv = M.convertiInIdle({ azione: 'TRINCERARSI' }, inCamo2, koala2, 'Spazio insufficiente.');
ok(conv.azione === 'IDLE', 'diventa un Idle');
ok(conv.regole.convertitoDa === 'TRINCERARSI', 'e dice da cosa: "convertitoDa", non "annullato"');
ok(conv.regole.ordineSpeso === true, 'l Ordine resta speso');
ok(conv.regole.generaAro === true, 'e genera comunque ARO');
ok(conv.regole.daRequisitoFallito === true, 'marcato come nato da requisito fallito');
ok(conv.bersagli.length === 0 && conv.burstDisponibile === 0, 'nessun bersaglio, nessun dado');
ok(conv.regole.mutazioni.length === 3, 'con le mutazioni da applicare');
ok(conv.regole.unitaAggiornata, 'e l unità già aggiornata, pronta da sostituire');
ok(/Spazio insufficiente/.test(conv.regole.motivo), 'col motivo che il giocatore ha dato');

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
