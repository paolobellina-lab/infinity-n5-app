// @versione 2026-10-28.1 | test_modulo_hacking.js | proprieta`: chat TEST
// 2026-10-28.1: motore 2026-10-28.1. RISCRITTA la prova dei Supportware
//    dell EVO: stanno nella ⓘ (window.INFO['step-weapon'], «<nome>: non
//    gestito da questa schermata», tipo 'nonpuo'). Nessuna prova in piu`.
// 2026-10-12.3: la prova del difetto di testo cambia verso (motore 2026-10-12.9,
//    catalogo 2026-10-12.2): la nota "uno solo" nomina le fonti VERE coi loro
//    valori. Quattro casi nominati, e la controprova con una fonte sola.
// 2026-10-12.2: sezione 12 — FAIRY DUST (motore 2026-10-12.8, ordine_hacking
//    2026-10-12.1, righe 5192-5209): chi ha il programma, nei due versi; il
//    bottone dalla pagina, E58, l'Abilita` Lunga; la busta, l'allarme e lo
//    stato sull'hacker del roster; il Firewall che non si somma (proprio,
//    Repeater), l'ECM che si somma, il -3/+3 nello scontro; l'hacker Isolato
//    o Incosciente. Sezione 13: l'editor degli stati (logica_stati
//    2026-10-12.1). (Il difetto della nota "due Firewall", inchiodato in .2,
//    e` chiuso in .3.)
// 2026-10-12.1: sezione 11 — Non Hackable (motore 2026-10-12.2): i sei
//    programmi su REM e TAG sintetici, l eccezione dell Hacker, la controprova
//    senza la caratteristica, il filtro dei bersagli, e i 24 profili veri.
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
// 28 ottobre (motore 2026-10-28.1): le spiegazioni e le escluse stanno nella ⓘ
// della schermata; senza app.html il motore le deposita in window.INFO[idStep].
const noteDi = (st) => ((global.window && global.window.INFO) || {})[st] || [];

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
// RISCRITTO il 28 ottobre: prima h.includes('ENHANCED REACTION').
ok(noteDi('step-weapon').some(v => v.titolo === 'ENHANCED REACTION: non gestito da questa schermata' && v.tipo === 'nonpuo') && !h.includes('ENHANCED REACTION'),
   'ma i suoi Supportware sono elencati (nella ⓘ: «ENHANCED REACTION: non gestito da questa schermata»)');

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


console.log('\n=== 11. Non Hackable (motore 2026-10-12.2, righe 9404-9419) ===');
// Guardia: con un motore senza queste funzioni il banco dice "fallito" e
// arriva alla riga di riepilogo, invece di schiantarsi.
const mancantiNH = ['haNonHackable', 'nonHackableBlocca'].filter(f => typeof M[f] !== 'function');
ok(mancantiNH.length === 0, 'il motore espone haNonHackable e nonHackableBlocca', `mancano: ${JSON.stringify(mancantiNH)}`);
const haNH = (u) => (typeof M.haNonHackable === 'function' ? M.haNonHackable(u) : undefined);
const bloccaNH = (u, p) => (typeof M.nonHackableBlocca === 'function' ? M.nonHackableBlocca(u, p) : undefined);
// La Special Skill vieta SOLO i requisiti per Tipo di Truppa: Carbonite e
// Oblivion vietati salvo bersaglio Hacker; Total Control vietato sempre;
// Trinity, Spotlight e Controlled Jump ammessi. Nel database i 24 Non
// Hackable sono tutti MI o LI, quindi oggi nessun esito cambia: i casi REM e
// TAG si costruiscono a mano, con la caratteristica nel campo `chars` come la
// scrive la fonte ("Cube, Regular, Not Impetuous, Non Hackable").
const sinteticoNH = (tipo, nh, hacker) => ({ id: 'nh-' + tipo, alias: 'Sintetico ' + tipo, nome: 'Sintetico ' + tipo, tipo: tipo,
    skills: hacker ? 'Hacker' : '', chars: nh ? 'Regular, Non Hackable' : 'Regular', equip: hacker ? 'Hacking Device' : '',
    arm: 3, bts: 3, wip: 12, states: {}, deployState: 'NORMAL', state: 'ACTIVE' });
const PROGRAMMI_NH = { 'CARBONITE': true, 'OBLIVION': true, 'TOTAL CONTROL': true, 'TRINITY': false, 'SPOTLIGHT': false, 'CONTROLLED JUMP': false };
['REM', 'TAG'].forEach(function (tipo) {
    const u = sinteticoNH(tipo, true, false);
    ok(haNH(u) === true, `premessa: il ${tipo} sintetico e\` Non Hackable (dal campo chars)`);
    const sbagli = Object.keys(PROGRAMMI_NH).filter(p => (bloccaNH(u, p) !== null) !== PROGRAMMI_NH[p]);
    ok(sbagli.length === 0,
       `${tipo} Non Hackable: Carbonite, Oblivion e Total Control vietati; Trinity, Spotlight e Controlled Jump ammessi`,
       `programmi col verdetto sbagliato: ${JSON.stringify(sbagli.map(p => p + ' -> ' + bloccaNH(u, p)))}`);
});
// L eccezione: se il bersaglio e` un Hacker, Carbonite e Oblivion tornano
// ammessi (il requisito lo raggiunge come Hacker, non per Tipo). Total
// Control no: chiede un TAG.
const remHackerNH = sinteticoNH('REM', true, true);
ok(bloccaNH(remHackerNH, 'CARBONITE') === null && bloccaNH(remHackerNH, 'OBLIVION') === null,
   'REM Non Hackable ma Hacker: Carbonite e Oblivion ammessi');
ok(/Total Control/.test(bloccaNH(remHackerNH, 'TOTAL CONTROL') || ''),
   `e Total Control vietato lo stesso, col motivo (${bloccaNH(remHackerNH, 'TOTAL CONTROL')})`);
// CONTROPROVA: lo stesso REM senza la caratteristica non e` bloccato da
// niente. Senza questa, "vietato" non distingue la regola da un motore che
// vieta tutto.
const remLibero = sinteticoNH('REM', false, false);
ok(haNH(remLibero) === false && Object.keys(PROGRAMMI_NH).every(p => bloccaNH(remLibero, p) === null),
   'CONTROPROVA: lo stesso REM senza Non Hackable non e` bloccato per nessun programma');
// Dalla porta del filtro dei bersagli, che e` quello che il giocatore vede.
const bvNH = (u, prog) => (M.bersagliValidi(M.AZIONI.HACKING, [u], { programma: prog, attaccante: hacker }) || [])[0] || {};
ok(bvNH(sinteticoNH('REM', true, false), 'CARBONITE').ammesso === false && /Non Hackable/.test(bvNH(sinteticoNH('REM', true, false), 'CARBONITE').motivo || ''),
   `nel filtro dei bersagli: Carbonite su un REM Non Hackable e\` rifiutato col motivo (${bvNH(sinteticoNH('REM', true, false), 'CARBONITE').motivo})`);
ok(bvNH(remLibero, 'CARBONITE').ammesso === true,
   `CONTROPROVA: lo stesso REM senza la caratteristica e\` un bersaglio ammesso (${bvNH(remLibero, 'CARBONITE').motivo || 'ammesso'})`);
// I DATI: i Non Hackable veri sono 24 e tutti MI o LI. Il giorno che entra un
// REM o un TAG Non Hackable, i casi qui sopra diventano casi veri del tavolo.
let tuttiNH = [];
try { require('./database_nomad.js'); require('./database_panoceania.js'); } catch (e) { /* detto sotto */ }
tuttiNH = [].concat(window.DB_NOMADI || [], window.DB_PANOCEANIA || []).filter(p => haNH(p));
const tipiNH = [...new Set(tuttiNH.map(p => p.tipo))].sort();
ok(tuttiNH.length === 24 && JSON.stringify(tipiNH) === JSON.stringify(['LI', 'MI']),
   `nel database i Non Hackable sono 24, tutti LI o MI (${tuttiNH.length}, ${JSON.stringify(tipiNH)})`,
   'se cambia, un REM o un TAG Non Hackable e` entrato nei dati: i casi sintetici sopra diventano veri');


console.log('\n=== 12. FAIRY DUST (motore 2026-10-12.8, righe 5192-5209) ===');
// Guardie: con file vecchi il banco dice "fallito" e arriva al riepilogo.
const pag = (nome, ...a) => (typeof window[nome] === 'function' ? window[nome](...a) : undefined);
ok(['mostraFairyDust', 'eseguiFairyDust'].every(n => typeof window[n] === 'function'), 'la pagina espone mostraFairyDust ed eseguiFairyDust');
ok(['dichiaraFairyDust', 'fairyDustSu', 'firewallApplicato'].every(n => typeof M[n] === 'function'), 'il motore espone dichiaraFairyDust, fairyDustSu e firewallApplicato');
// Senza dichiaraFairyDust lo stato si scrive a mano: le prove sul Firewall
// misurano lo stesso il motore, invece di fermarsi.
const dichFD = (u, t) => (typeof M.dichiaraFairyDust === 'function' ? M.dichiaraFairyDust(u, t)
    : { unitaAggiornata: Object.assign({}, u, { states: Object.assign({}, u.states || {}, { fairyDust: String(t).toUpperCase() }) }), errori: [] });
{ const lg = console.log, lw = console.warn; console.log = () => {}; console.warn = () => {};
  require('./database_nomad.js'); require('./database_panoceania.js'); console.log = lg; console.warn = lw; }
const zitto = (fn) => { const lg = console.log, lw = console.warn; console.log = () => {}; console.warn = () => {}; try { return fn(); } finally { console.log = lg; console.warn = lw; } };
const DBN = window.DB_NOMADI || [], DBP = window.DB_PANOCEANIA || [];
const veroFD = (A, n, id, x) => { const p = A.find(u => u.nome === n); if (!p) throw new Error('assente: ' + n);
    return Object.assign(JSON.parse(JSON.stringify(p)), { id, alias: id, combatGroup: 1, states: {}, deployState: 'NORMAL', state: 'ACTIVE' }, x || {}); };
// Chi ha il programma: insieme NOMINATO per famiglia e fazione, nei due versi.
const famiglia = (u) => u.nome.split(' (')[0] + (DBN.indexOf(u) >= 0 ? ' / N' : ' / P');
const conFD = [...new Set([...DBN, ...DBP].filter(u => M.haProgramma(u, 'FAIRY DUST')).map(famiglia))].sort();
const ATTESI_FD = ['Laxmee / N', 'Laxmee / P', 'Mulebot / P', 'Salyut / N'];
ok(JSON.stringify(conFD) === JSON.stringify(ATTESI_FD), `chi ha il Fairy Dust: ${JSON.stringify(conFD)} — EVO Hacking Device, o UPGRADE: Fairy Dust`);
const jazz = DBN.concat(DBP).filter(u => /^Jazz/.test(u.nome));
ok(jazz.length > 0 && jazz.every(u => /Hacking Device Plus/.test(u.equip) && !M.haProgramma(u, 'FAIRY DUST')), 'CONTROPROVA: il Jazz ha un Hacking Device Plus senza UPGRADE, e non ce l ha');

// --- dalla pagina ---
{
    const core = require('fs').readFileSync(__dirname + '/motore_core.js', 'utf8');
    const i = core.indexOf('window.sostituisciUnita = function'), j = core.indexOf('\n};\n', i);
    ok(i >= 0 && j > i, 'sostituisciUnita (vero) si trova in motore_core.js');
    if (i >= 0 && j > i) eval(core.slice(i, j + 3));
    window.MotoreN5 = window.MotoreN5 || M;
}
let allarme = null; window.inviaAllarmeAro = (p) => { allarme = p; };
const salyut = veroFD(DBN, 'Salyut (EVO Hacking Device)', 'sal');
window.roster = [salyut];
// Il contratto cerca l'attaccante nel roster schierato (E03): qui e` la
// Salyut, non gli hacker finti delle prime sezioni.
const rosterProprioPrima = M._rosterProprio; M._rosterProprio = window.roster;
nuovo(window.roster[0]); allarme = null;
zitto(() => window.startUnitHackingLoop());
let hf = nodo('weapon-buttons-container').innerHTML;
ok(/FAIRY DUST/.test(hf) && /window\.mostraFairyDust\(\)/.test(hf), 'Salyut: il bottone FAIRY DUST c e`, e apre la scelta del tipo');
const nonGestiti = (hf.split('non gestiti da questa schermata')[1] || '');
ok(!/FAIRY DUST/.test(nonGestiti), 'e il Fairy Dust non e` piu` fra i programmi "non gestiti"');
const jz = veroFD(DBN.concat(DBP), jazz[0].nome, 'jz');
nuovo(jz); zitto(() => window.startUnitHackingLoop());
ok(!/FAIRY DUST/.test(nodo('weapon-buttons-container').innerHTML), 'CONTROPROVA: il Jazz non vede il bottone');
nuovo(window.roster[0]); window.currentOrder.isSecondHalf = true; zitto(() => window.startUnitHackingLoop());
hf = nodo('weapon-buttons-container').innerHTML;
ok(/FAIRY DUST/.test(hf) && !/window\.mostraFairyDust\(\)/.test(hf) && /Abilit/.test(hf), 'come seconda meta` dell Ordine: bottone bloccato, col motivo (Abilita` Lunga)');
nuovo(window.roster[0]); zitto(() => pag('mostraFairyDust'));
const tipiVisti = [...nodo('weapon-buttons-container').innerHTML.matchAll(/eseguiFairyDust\('([A-Z]+)'\)/g)].map(m => m[1]);
ok(JSON.stringify(tipiVisti) === JSON.stringify(['HI', 'REM', 'TAG', 'VH']), `la scelta del tipo: HI, REM, TAG, VH (${JSON.stringify(tipiVisti)})`);
zitto(() => pag('eseguiFairyDust', 'LI'));
ok(inviato === null && /non ammesso/.test(String(alertUltimo)) && !(window.roster[0].states || {}).fairyDust, `LI: rifiutato (${String(alertUltimo).slice(0, 60)}), niente spedito, nessuno stato`);
ok(typeof M.dichiaraFairyDust === 'function' && M.dichiaraFairyDust(salyut, 'LI').errori.some(e => e.codice === 'E58'), 'e il motore lo dice con E58');
nuovo(window.roster[0]); allarme = null;
zitto(() => pag('eseguiFairyDust', 'HI'));
const bfd = inviato && inviato.attacchi && inviato.attacchi[0];
ok(bfd && bfd.azione === 'FAIRY DUST' && bfd.regole.senzaTiro === true && bfd.regole.fairyDust === 'HI', `HI: la busta parte con azione FAIRY DUST, senza tiro (${bfd && bfd.azione})`);
ok(allarme !== null, 'e parte l allarme ARO');
ok((window.roster[0].states || {}).fairyDust === 'HI', `lo stato e\` sull hacker del roster: states.fairyDust = ${JSON.stringify((window.roster[0].states || {}).fairyDust)}`);
M._rosterProprio = rosterProprioPrima;

// --- il Firewall: nella lista dell'hacker, letto anche dall'altra app ---
const laxFD = dichFD(veroFD(DBP, 'Laxmee (Hacker)', 'lax'), 'HI').unitaAggiornata;
const orc = veroFD(DBP, 'Orc (MULTI Rifle)', 'orc'), fusL = veroFD(DBP, 'Fusilier (Combi Rifle)', 'fus'), tk = veroFD(DBP, 'Teutonic Knight (TinBot: Firewall)', 'tk');
const interv = veroFD(DBN, 'Interventor (Hacker Plus)', 'int');
ok(orc.tipo === 'HI' && M.valoreFirewall(orc) === 0 && fusL.tipo === 'LI' && tk.tipo === 'HI' && M.valoreFirewall(tk) === -3,
   'premessa: Orc HI senza Firewall, Fusilier LI, Teutonic Knight HI con TinBot (-3)');
const rosterPrima = M._rosterNemico;
M._rosterNemico = [laxFD, orc, fusL, tk];
const fwO = M.firewallApplicato(orc, {});
ok(fwO.valore === -3 && fwO.fonte === 'FAIRY_DUST', `Orc (HI) nella lista della Laxmee: Firewall -3, fonte FAIRY_DUST (${fwO.valore}, ${fwO.fonte})`);
ok(M.firewallApplicato(fusL, {}).valore === 0, 'CONTROPROVA: il Fusilier (LI) non lo riceve');
ok(M.firewallApplicato(orc, { proprio: -6 }).valore === -6, 'con un Firewall (-6) proprio: -6, non -9');
const fwR = M.firewallApplicato(orc, { repeaterNemico: true });
ok(fwR.valore === -3 && fwR.sceltaDelBersaglio === true, 'col Repeater nemico: -3, non -6, e la scelta e` del giocatore del bersaglio');
const fwT = M.firewallApplicato(tk, {});
ok(fwT.valore === -3 && fwT.sceltaDelBersaglio === true, 'Teutonic Knight: TinBot -3 e Fairy Dust -3 valgono -3, una fonte sola');
const orcEcm = Object.assign({}, orc, { equip: orc.equip + ', ECM (Hacking -3)' });
M._rosterNemico = [laxFD, orcEcm];
const carbFD = M.armaDaProgramma('CARBONITE');
const mE = M.modHacking(interv, orcEcm, carbFD, {});
ok(mE.voci.some(v => v.fonte === 'firewall' && v.valore === -3) && mE.voci.some(v => v.fonte === 'ecm' && v.valore === -3),
   `l ECM invece si somma: firewall -3 e ecm -3 (${JSON.stringify(mE.voci.map(v => [v.fonte, v.valore]))})`);
// nello scontro: -3 al WIP dell'attaccante, +3 al BTS del bersaglio
const scontro = (rost) => { M._rosterNemico = rost; return M.risolviScontro({ attaccante: interv, bersaglio: orc, azione: M.AZIONI.HACKING, arma: carbFD, burst: 2 }, null, {}); };
const sSi = scontro([laxFD, orc]), sNo = scontro([orc]);
const vSalv = (s) => s.attivo && s.attivo.salvezzaInflitta;
ok(sSi.attivo.mod === sNo.attivo.mod - 3, `nello scontro il tiro dell Interventor scende di 3 (${sNo.attivo.mod} -> ${sSi.attivo.mod})`);
ok(vSalv(sSi).valoreSuccesso === vSalv(sNo).valoreSuccesso + 3 && vSalv(sSi).voci.some(v => v.fonte === 'firewall' && v.valore === 3),
   `e la salvezza dell Orc sale di 3 BTS (${vSalv(sNo).valoreSuccesso} -> ${vSalv(sSi).valoreSuccesso})`);
// hacker Isolato o Incosciente: niente -3, e la nota lo dice
for (const [st, nome] of [[{ isolated: true }, 'Isolata'], [{ unconscious: true }, 'Incosciente']]) {
    const laxKO = Object.assign({}, laxFD, { states: Object.assign({}, laxFD.states, st) });
    M._rosterNemico = [laxKO, orc];
    const mk = M.modHacking(interv, orc, carbFD, {});
    ok(!mk.voci.some(v => v.fonte === 'firewall') && mk.note.some(n => /Fairy Dust/.test(n) && /cancellato/.test(n)),
       `Laxmee ${nome}: niente -3, e la nota dice che il Fairy Dust e\` cancellato`);
}
// La nota "uno solo" con le fonti VERE (motore 2026-10-12.9, catalogo
// REPEATER_NEMICO.unSoloFirewallModello). Fino al motore 2026-10-12.8 era un
// testo fisso, "il suo e quello del Repeater nemico", anche sul Teutonic
// Knight dove le fonti sono il TinBot e il Fairy Dust: difetto trovato da
// questo banco il 12 ottobre sera, chiuso lo stesso giorno.
const notaFw = (u, c) => M.firewallApplicato(u, c).note.join(' ');
M._rosterNemico = [laxFD, tk, orc];
const nTF = notaFw(tk, {});
ok(/due Firewall \(il suo \(-3\) e il Fairy Dust di lax \(-3\)\)/.test(nTF) && !/Repeater/.test(nTF),
   'TinBot + Fairy Dust: "il suo (-3) e il Fairy Dust di lax (-3)", e il Repeater non e` nominato', nTF);
const nRF = notaFw(orc, { repeaterNemico: true });
ok(/due Firewall \(quello del Repeater nemico \(-3\) e il Fairy Dust di lax \(-3\)\)/.test(nRF),
   'Repeater + Fairy Dust: "quello del Repeater nemico (-3) e il Fairy Dust di lax (-3)"', nRF);
const n3 = notaFw(tk, { repeaterNemico: true });
ok(/3 Firewall \(il suo \(-3\), quello del Repeater nemico \(-3\) e il Fairy Dust di lax \(-3\)\)/.test(n3),
   'tre fonti: "3 Firewall (il suo (-3), quello del Repeater nemico (-3) e il Fairy Dust di lax (-3))"', n3);
M._rosterNemico = [orc];
const nPR = notaFw(orc, { proprio: -6, repeaterNemico: true });
ok(/due Firewall \(il suo \(-6\) e quello del Repeater nemico \(-3\)\)/.test(nPR) && M.firewallApplicato(orc, { proprio: -6, repeaterNemico: true }).valore === -6,
   'il caso vecchio, proprio (-6) + Repeater: -6, e la nota "il suo (-6) e quello del Repeater nemico (-3)"', nPR);
M._rosterNemico = [laxFD, orc];
ok(notaFw(orc, {}) === '' && M.firewallApplicato(orc, {}).sceltaDelBersaglio === false,
   'CONTROPROVA: una fonte sola (il Fairy Dust), nessuna nota "uno solo" e nessuna scelta');
M._rosterNemico = rosterPrima;


console.log('\n=== 13. FAIRY DUST nell editor degli stati (logica_stati 2026-10-12.1) ===');
// Lo si toglie a mano con una casella; cade da solo se l'hacker viene salvato
// Isolato, Incosciente o Morto (righe 4735-4738), e non torna se si riprende.
// L'editor e` l'unico posto che mette quegli stati: misurato il 12 ottobre,
// nessun altro file scrive isolated, unconscious o dead.
global.localStorage = global.localStorage || { getItem: () => null, setItem() {}, removeItem() {} };
['aggiornaGraficaRoster', 'tornaAlRadar', 'inviaSchieramentoAllHub', 'renderReactiveRoster', 'apriSelezioneTruppe']
    .forEach(f => { if (typeof window[f] !== 'function') window[f] = () => {}; });
zitto(() => require('./logica_stati.js'));
ok(typeof window.apriPaginaStati === 'function' && typeof window.salvaStatiUnita === 'function', 'logica_stati: apriPaginaStati e salvaStatiUnita');
const CASELLE = ['st-dead', 'st-unc', 'st-engaged', 'st-imma', 'st-immb', 'st-iso', 'st-fairydust'];
function editor(hacker, spunte) {
    window.roster = [hacker, orc];
    Object.keys(el).forEach(k => { el[k].innerHTML = ''; });
    zitto(() => window.apriPaginaStati(0));
    const html = Object.values(el).map(e => e.innerHTML).join(' ');
    CASELLE.forEach(id => { nodo(id).checked = false; });
    if (/st-fairydust/.test(html)) nodo('st-fairydust').checked = true;   // come la disegna la pagina: spuntata
    Object.keys(spunte).forEach(id => { nodo(id).checked = spunte[id]; });
    zitto(() => window.salvaStatiUnita());
    return { html, states: window.roster[0].states };
}
const laxE = () => veroFD(DBP, 'Laxmee (Hacker)', 'lax', { states: { fairyDust: 'HI' } });
const r0 = editor(laxE(), {});
ok(/st-fairydust/.test(r0.html) && /Fairy Dust attivo sui <b>HI<\/b>/.test(r0.html), 'l editor mostra la casella "Fairy Dust attivo sui HI"');
ok(r0.states.fairyDust === 'HI', 'salvando con la casella spuntata e l hacker sano, il Fairy Dust resta');
const sinza = editor(laxE(), { 'st-fairydust': false });
ok(!sinza.states.fairyDust, 'togliendo la spunta, il Fairy Dust si cancella a mano');
for (const [id, nome] of [['st-iso', 'Isolata'], ['st-unc', 'Incosciente'], ['st-dead', 'Morta']]) {
    const r = editor(laxE(), { [id]: true });
    ok(!r.states.fairyDust, `salvata ${nome}: il Fairy Dust si cancella da solo`);
}
// Si riprende: tolto l'Isolato, il Fairy Dust non torna.
const ripresa = editor(laxE(), { 'st-iso': true });
const laxRipresa = Object.assign({}, window.roster[0]);
const r2 = editor(laxRipresa, { 'st-iso': false });
M._rosterNemico = [window.roster[0], orc];
ok(!r2.states.fairyDust && !r2.states.isolated && M.firewallApplicato(orc, {}).valore === 0,
   'ripresa dall Isolato: il Fairy Dust non torna, e l Orc non ha piu` il -3');
const senza = editor(veroFD(DBP, 'Laxmee (Hacker)', 'lax'), {});
ok(!/st-fairydust/.test(senza.html), 'CONTROPROVA: un hacker senza Fairy Dust attivo non ha la casella');
M._rosterNemico = rosterPrima;

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
