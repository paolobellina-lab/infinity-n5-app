// @versione 2026-10-06.1 | test_modulo_hacking.js | proprieta`: chat TEST
// Test end-to-end del modulo Hacking — node test_modulo_hacking.js
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
require('./ordine_hacking.js');

const interventor = { id: 'n1', alias: 'Interventor', wip: 14, skills: 'Hacker, Hacking Device' };
const killer      = { id: 'n2', alias: 'Assassino',   wip: 13, skills: 'Hacker, Killer Hacking Device' };
const plus        = { id: 'n3', alias: 'Interventor+', wip: 14, skills: 'Hacker, Hacking Device Plus' };
const evo         = { id: 'n4', alias: 'EVO Bot',     wip: 13, skills: 'Hacker, EVO Hacking Device' };

M._fazione = 'NOMADI';
M._rosterProprio = [interventor, killer, plus, evo];
M._rosterNemico = [
    { id: 'p1', alias: 'Fusilier',  tipo: 'LI',  states: {} },
    { id: 'p2', alias: 'Squalo',    tipo: 'TAG', bts: 6, states: {} },
    { id: 'p3', alias: 'Hacker Pano', tipo: 'LI', bts: 3, skills: 'Hacker, Hacking Device', states: {} },
    { id: 'p4', alias: 'Fugazi',    tipo: 'REM', bts: 0, states: {} },
    { id: 'p5', alias: 'Designato', tipo: 'REM', bts: 0, states: { targeted: true } },
    { id: 'p6', alias: 'Protetto',  tipo: 'TAG', bts: 6, skills: 'TinBot: Firewall (-6)', states: {} },
    { id: 'p7', alias: 'Croc Man',  tipo: 'LI',  deployState: 'CAMO', states: { camo: true } }
];

function nuovo(u) {
    window.currentOrder = {}; window.coordUnits = [u]; window.coordIndex = 0;
    window.coordPayloads = []; window.combatTargets = []; window.coordMode = false;
    inviato = null; alertUltimo = null;
}

console.log('\n=== 1. L ERRORE PRINCIPALE: i programmi dipendono dal dispositivo ===');
nuovo(interventor);
window.avviaFaseHacking('HACKING', false);
let h = nodo('weapon-buttons-container').innerHTML;
ok(h.includes('CARBONITE') && h.includes('OBLIVION') && h.includes('SPOTLIGHT') && h.includes('TOTAL CONTROL'),
   'Hacking Device: i suoi quattro programmi');
ok(!h.includes('>TRINITY<') && !/onclick="window.declareHackingAttack\('TRINITY'\)/.test(h),
   'Hacking Device: NIENTE Trinity (prima la offriva a tutti)');

nuovo(killer);
window.startUnitHackingLoop();
h = nodo('weapon-buttons-container').innerHTML;
ok(h.includes('TRINITY'), 'Killer Hacking Device: Trinity sì');
ok(!h.includes('CARBONITE'), 'Killer Hacking Device: niente Carbonite');
ok(h.includes('CYBERMASK'), 'e Cybermask è elencata fra i non-attacco');

nuovo(plus);
window.startUnitHackingLoop();
h = nodo('weapon-buttons-container').innerHTML;
ok(h.includes('WHITE NOISE'), 'Hacking Device Plus: White Noise riconosciuta (prima non esisteva)');

nuovo(evo);
window.startUnitHackingLoop();
h = nodo('weapon-buttons-container').innerHTML;
ok(h.includes('Nessun programma d\'attacco'), 'EVO: nessun programma d attacco');
ok(h.includes('ENHANCED REACTION'), 'ma i suoi Supportware sono elencati');

console.log('\n=== 2. Dati dei programmi ===');
const carb = M.armaDaProgramma('CARBONITE');
ok(carb.burst === 2 && carb.ps === 7 && carb.dimezzaBTS === false && carb.effetto === 'IMM-B',
   'Carbonite: B2, PS7, BTS pieno, IMM-B');
const spot = M.armaDaProgramma('SPOTLIGHT');
ok(spot.ps === 5 && spot.dimezzaBTS === true, 'Spotlight: PS5, BTS dimezzato');
const obl = M.armaDaProgramma('OBLIVION');
ok(obl.ps === 4 && obl.dimezzaBTS === true && obl.effetto === 'ISOLATO', 'Oblivion: PS4, BTS dimezzato, Isolato');
ok(M.risolviMunizione(carb.ammo).salvezze === 2, 'Carbonite usa DA: due Tiri Salvezza');
ok(M.risolviMunizione(spot.ammo).dimezza === true, 'Spotlight usa AP: attributo dimezzato');

console.log('\n=== 3. Filtro bersagli per programma ===');
nuovo(interventor);
window.currentOrder.weapon = 'SPOTLIGHT';
window.setupTargetSelectionHacking();
ok(window.validTargets.length === 6, `Spotlight colpisce chiunque tranne il Marker (${window.validTargets.length} validi)`);
ok(!window.validTargets.some(u => u.id === 'p7'), 'il Marker CAMO è escluso: solo Modelli sono bersagliabili');

window.currentOrder.weapon = 'CARBONITE';
window.setupTargetSelectionHacking();
ok(!window.validTargets.some(u => u.id === 'p1'), 'Carbonite: il Fusilier LI non è hackerabile');
ok(window.validTargets.some(u => u.id === 'p2'), 'ma il TAG sì');

window.currentOrder.weapon = 'TOTAL CONTROL';
window.setupTargetSelectionHacking();
ok(window.validTargets.every(u => u.tipo === 'TAG'), 'Total Control: solo TAG');

nuovo(killer);
window.currentOrder.weapon = 'TRINITY';
window.setupTargetSelectionHacking();
ok(window.validTargets.length === 1 && window.validTargets[0].id === 'p3', 'Trinity: solo Hacker nemici');

console.log('\n=== 4. MOD calcolati (prima la schermata non ne mostrava) ===');
const m1 = M.modHacking(interventor, M._rosterNemico[3], carb, {});
ok(m1.valore === 14 && m1.mod === 0, 'bersaglio normale: WIP 14 secco');
const m2 = M.modHacking(interventor, M._rosterNemico[4], carb, {});
ok(m2.valore === 17 && m2.voci.some(v => v.fonte === 'bersagliato'),
   'bersaglio Bersagliato: +3 WIP anche per gli attacchi Comms');
ok(M.valoreFirewall(M._rosterNemico[5]) === -6,
   'Firewall (-6): letto il valore vero, non un -3 fisso');
const m3 = M.modHacking(interventor, M._rosterNemico[5], carb, { firewallNemico: -6 });
ok(m3.valore === 8 && m3.note.some(n => n.includes('+3 BTS')),
   'Firewall -6: WIP 8, con nota sul +3 BTS alla salvezza del bersaglio');

console.log('\n=== 5. Schermata modificatori ===');
nuovo(interventor);
window.currentOrder.weapon = 'CARBONITE';
window.combatTargets = [{ id: 'p2', name: 'Squalo', burst: 0 }];
window.preparaModificatoriHacking();
h = nodo('targets-allocation-container').innerHTML;
ok(window.totalBurst === 2, 'Burst 2 dal programma, non dal database armi');
ok(h.includes('Valore di Successo'), 'il Valore di Successo è a schermo');
ok(h.includes('IMM-B'), 'l effetto del programma è mostrato');
ok(h.includes('PS 7') && h.includes('BTS pieno'), 'PS e trattamento del BTS mostrati');
ok(!h.includes('range-seg') && !h.includes('COPERTURA'), 'niente gittata né copertura');

console.log('\n=== 6. Invio ===');
window.eseguiCalcoloHacking();
ok(inviato !== null, 'spedito');
const a = inviato && inviato.attacchi[0];
ok(a && a.azione === M.AZIONI.HACKING, 'azione canonica');
ok(a && a.programma === 'CARBONITE', 'il programma è nel payload');
ok(a && a.regole.ps === 7 && a.regole.dimezzaBTS === false, 'PS e BTS nel payload');
ok(a && a.regole.perBersaglio[0].valoreSuccesso === 14, 'Valore di Successo calcolato nel payload');

nuovo(interventor);
window.currentOrder.weapon = 'CARBONITE';
window.combatTargets = [{ id: 'generic1', name: 'Bersaglio Primario', burst: 2 }];
window.totalBurst = 2;
window.eseguiCalcoloHacking();
ok(inviato === null, 'bersaglio fantasma: bloccato');

console.log('\n=== 7. Trinity: dati ora verificati sulla wiki ===');
nuovo(killer);
window.startUnitHackingLoop();
ok(!nodo('weapon-buttons-container').innerHTML.includes('non verificati'),
   'nessun avviso: i dati di Trinity sono confermati');
const tri = M.armaDaProgramma('TRINITY');
ok(tri.burst === 3 && tri.ps === 6 && tri.dimezzaBTS === false,
   'Trinity: B3, PS6, BTS pieno');
ok(M.modHacking(killer, M._rosterNemico[2], tri, {}).valore === killer.wip + 3,
   'e il +3 WIP del programma si applica');
const tot = M.armaDaProgramma('TOTAL CONTROL');
ok(tot.burst === 1 && tot.ps === 4 && tot.effetto === 'POSSEDUTO',
   'Total Control: B1, PS4, Posseduto');
ok(M.risolviMunizione(tot.ammo).salvezze === 2, 'e due Tiri Salvezza (munizione DA)');


console.log('\n=== 8. Due dispositivi sulla stessa truppa ===');
// Mary Problems e` l'unico profilo dei due database con due dispositivi, e
// fino al 23 settembre il dato era sbagliato: un solo Killer Hacking Device
// con dentro gli upgrade di entrambi. Corretto quello, e` venuto fuori che il
// motore ne leggeva comunque uno solo — il filtro scartava il nome piu` corto
// perche` contenuto nel piu` lungo.
require('./database_nomad.js'); require('./database_panoceania.js');
const TUTTI = [...(window.DB_NOMADI || []), ...(window.DB_PANOCEANIA || [])];
const mary = TUTTI.find(u => /^Mary Problems/.test(u.nome));
ok(!!mary && /Killer Hacking Device/.test(mary.equip || '') && /(^|,)\s*Hacking Device/.test(mary.equip || ''),
   'Mary Problems porta entrambi i dispositivi nel database');
const disp = M.dispositiviHacking(mary);
ok(disp.length === 2, 'e il motore li vede entrambi (' + JSON.stringify(disp) + ')');
const nomiProg = M.programmiAttacco(mary).programmi.map(p => p.nome).sort();
for (const atteso of ['TRINITY', 'CARBONITE', 'OBLIVION', 'SPOTLIGHT', 'TOTAL CONTROL']) {
    ok(nomiProg.indexOf(atteso) >= 0, `fra i programmi d attacco c'è ${atteso}`);
}
// Controprova: chi ha il solo Killer non ottiene i programmi del normale.
const zero = TUTTI.find(u => /Killer Hacking Device/.test(u.equip || '') && !/(^|,)\s*Hacking Device/.test(u.equip || ''));
const soloKhd = M.programmiAttacco(zero).programmi.map(p => p.nome);
ok(soloKhd.indexOf('CARBONITE') < 0 && soloKhd.indexOf('TRINITY') >= 0,
   `controprova: ${zero.nome.split(' (')[0]}, solo Killer: Trinity sì, Carbonite no`);
// Controprova sul filtro: "Killer Hacking Device" da solo non deve contare
// anche come "Hacking Device" — era la ragione per cui il filtro scartava.
ok(M.dispositiviHacking(zero).length === 1, 'e un Killer da solo resta UN dispositivo, non due');


console.log('\n=== 9. La seconda metà non torna alla scelta del programma ===');
// 🔴 Trovato da Paolo al tavolo il 29 settembre: scegli il programma,
// confermi i bersagli, e l'app ti riporta a scegliere il programma — un
// anello. La causa stava nel motore: riprendiOrdine cercava "l'arma" della
// prima metà con profiloArma, cioè CARBONITE nel database delle armi, dove
// i programmi non stanno. Ora si risolve con armaDaProgrammaDi.
// La prova passa dal MODULO, non dal motore: è lì che il giocatore gira in
// tondo, e chiamando riprendiOrdine da solo l'anello non si vede.
const passi = [];
const goVero = window.goToStep, inviaVero = window.inviaCalcoloAllHub;
window.goToStep = (n) => passi.push(n);
window.inviaCalcoloAllHub = () => passi.push('BUSTA');
window.renderTargetButtons = window.renderTargetButtons || (() => {});
const hacker = Object.assign(JSON.parse(JSON.stringify(TUTTI.find(u => /^Interventor \(Hacker/.test(u.nome)))), { states: {} });
const vittima = Object.assign(JSON.parse(JSON.stringify(TUTTI.find(u => /^Orc \(Heavy Machine/.test(u.nome)))), { states: {} });
M._rosterProprio = [hacker]; M._rosterNemico = [vittima];
window.coordUnits = [hacker]; window.coordIndex = 0;
window.combatTargets = [{ id: vittima.id, name: vittima.nome, skills: '', rangeIndex: 0, rangeMod: 0, burst: 0, cover: false, terrain: 'NESSUNO' }];
window.currentOrder = { unit: hacker, action: 'HACKING', action1: 'HACKING', weapon: 'CARBONITE', isSecondHalf: true };
passi.length = 0;
try { window.avviaFaseHacking('HACKING', true); } catch (e) { passi.push('ECCEZIONE: ' + e.message); }
ok(passi.indexOf('step-weapon') < 0, `la seconda metà NON torna a step-weapon (${JSON.stringify(passi)})`);
ok(passi.indexOf('step-modifiers') >= 0, 'e prosegue verso i modificatori');
// Controprova: un programma che questa unità NON ha deve essere rifiutato —
// altrimenti "prosegue sempre" sarebbe indistinguibile da "prosegue bene".
const esito = M.riprendiOrdine('HACKING', { isSecondHalf: true, unita: hacker,
    arma: 'PROGRAMMA INVENTATO', bersagli: window.combatTargets, azionePrimaMeta: 'HACKING' });
ok(esito.ok === false || /non è fra quelli|non riconosciut/i.test(String(esito.motivo || '')),
   `un programma che l unità non ha viene rifiutato (${JSON.stringify(esito.motivo || esito.ok)})`);
window.goToStep = goVero; window.inviaCalcoloAllHub = inviaVero;

console.log('\n=== 10. Punto 14: il pulsante del Repeater nemico ===');
// Richiesto da MOTORE il 6 ottobre. Il pulsante tocca UN campo di UN
// bersaglio, nasce false, e quel campo deve arrivare fino in busta e in
// regole.perBersaglio: un interruttore che cambia la schermata e non arriva
// all'Hub e` la stessa cosa di un interruttore che non c'e`.
// I conti del Firewall stanno in test_hacking_firewall.js; qui si guarda
// solo che il valore viaggi.
const buste10 = [];
const goTeniamo = window.goToStep, inviaTeniamo = window.inviaCalcoloAllHub;
window.goToStep = () => {}; window.inviaCalcoloAllHub = (p) => buste10.push(p);
const att10 = Object.assign(JSON.parse(JSON.stringify(TUTTI.find(u => /^Interventor \(Hacker/.test(u.nome)))), { states: {} });
// Due bersagli: con uno solo non si distingue "cambia quello giusto" da
// "cambia tutto". Il bersaglio di CARBONITE dev'essere legale, percio` sono
// due unita` con un Dispositivo di Hacking.
// I bersagli vanno RIVELATI: diversi profili Hacker nascono deployState
// 'CAMO' nel database, e contro un Marker l'Attacco Comms non si dichiara —
// l'app rifiuta, giustamente, e la busta non parte. E` la terza volta che
// questo schema fa cadere uno scenario (BS-06, il Croc Man dello Speculativo,
// e qui): se un profilo serve come bersaglio, va messo in forma di Modello.
const bersagli10 = TUTTI.filter(u => M.eHacker(u) && !/^Interventor/.test(u.nome)).slice(0, 2)
    .map(u => Object.assign(JSON.parse(JSON.stringify(u)),
        { states: { camo: false, imp: false, hidden: false }, deployState: 'NORMAL', state: 'ACTIVE' }));
ok(bersagli10.length === 2, `due bersagli Hacker per la prova (${bersagli10.length})`);
M._rosterProprio = [att10]; M._rosterNemico = bersagli10;
window.coordUnits = [att10]; window.coordIndex = 0; window.coordPayloads = [];
window.currentOrder = { unit: att10, action: 'HACKING', action1: 'HACKING', weapon: 'CARBONITE' };
// Un dado per bersaglio: con burst 0 su tutti il motore rifiuta l'invio
// ("Nessun dado assegnato"), e la busta non arriverebbe mai.
window.combatTargets = bersagli10.map(u => ({ id: u.id, name: u.nome, skills: '',
    rangeIndex: 0, rangeMod: 0, burst: 1, cover: false, terrain: 'NESSUNO' }));

ok(typeof window.toggleRepeaterNemicoHacking === 'function',
   'window.toggleRepeaterNemicoHacking esiste');
ok(window.combatTargets.every(t => !t.repeaterNemico),
   `nasce false su tutti i bersagli (${JSON.stringify(window.combatTargets.map(t => !!t.repeaterNemico))})`);
const primaDi = JSON.parse(JSON.stringify(window.combatTargets));
window.toggleRepeaterNemicoHacking(0);
ok(window.combatTargets[0].repeaterNemico === true,
   `premuto su 0: il bersaglio 0 diventa true (${window.combatTargets[0].repeaterNemico})`);
ok(window.combatTargets[1].repeaterNemico !== true,
   `e il bersaglio 1 NON viene toccato (${window.combatTargets[1].repeaterNemico})`);
// CONTROPROVA sul "solo quel campo": tutto il resto del bersaglio 0 e`
// identico a prima. Senza, "true" non distingue "ha acceso il campo" da
// "ha riscritto il bersaglio".
const soloQuelCampo = Object.keys(primaDi[0]).every(k =>
    k === 'repeaterNemico' || JSON.stringify(primaDi[0][k]) === JSON.stringify(window.combatTargets[0][k]));
ok(soloQuelCampo, 'e del bersaglio 0 non cambia nient altro');
window.toggleRepeaterNemicoHacking(0);
ok(window.combatTargets[0].repeaterNemico === false,
   `premuto di nuovo: torna false (${window.combatTargets[0].repeaterNemico})`);

// Il viaggio: accendo il bersaglio 1 e spedisco.
window.toggleRepeaterNemicoHacking(1);
buste10.length = 0; window.coordPayloads = [];
try { window.eseguiCalcoloHacking(); } catch (e) { ok(false, 'eseguiCalcoloHacking non cade', e.message); }
const busta10 = buste10[0] || (window.coordPayloads[0] ? { attacchi: window.coordPayloads } : null);
ok(!!busta10, `la busta e stata prodotta (${buste10.length} spedite, ${window.coordPayloads.length} in coda)`);
const att = busta10 && (busta10.attacchi ? busta10.attacchi[0] : busta10);
const perB = att && att.regole && att.regole.perBersaglio;
ok(Array.isArray(perB) && perB.length === 2,
   `regole.perBersaglio ha una riga per bersaglio (${Array.isArray(perB) ? perB.length : typeof perB})`);
ok(perB && perB[0].repeaterNemico === false && perB[1].repeaterNemico === true,
   `e porta il valore giusto per ciascuno (${JSON.stringify(perB && perB.map(x => x.repeaterNemico))})`);
ok(att && Array.isArray(att.bersagli) && att.bersagli[1] && att.bersagli[1].repeaterNemico === true,
   `e il campo viaggia anche nei bersagli della busta (${JSON.stringify(att && att.bersagli && att.bersagli.map(b => b.repeaterNemico))})`);
window.goToStep = goTeniamo; window.inviaCalcoloAllHub = inviaTeniamo;

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
