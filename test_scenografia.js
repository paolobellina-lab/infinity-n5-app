// @versione 2026-09-22.1 | test_scenografia.js | proprieta`: chat TEST
// Test della scenografia bersagliabile — node test_scenografia.js
// Revisione: la torretta NON e` scenografia (decisione di Paolo; chat REGOLE,
// righe 6483-6510): e` un Deployable del proprietario, e sta in DB_DEPLOYABLES.
// Per qualche giro esiste anche in DB_STRUTTURE: il test regge in entrambi i
// casi, prima e dopo la rimozione, perche` non la prende mai da li`.
global.window = global;
require('./catalogo_n5.js'); require('./database_comune.js');
const M = require('./motore_regole_n5.js');

let passati = 0, falliti = 0;
function ok(c, n, e) { if (c) { passati++; console.log(`  ✅ ${n}`); } else { falliti++; console.log(`  ❌ ${n}${e ? '\n       ' + e : ''}`); } }

// Solo la scenografia vera: le STRUTTURE. La torretta, se c'e` ancora in
// DB_STRUTTURE, resta fuori.
const strutture = window.DB_STRUTTURE.filter(s => String(s.tipo).toUpperCase() !== 'TORRETTA').map(function (s, i) {
    return Object.assign({}, s, { id: 'sc' + i, alias: s.nome, state: 'ACTIVE', neutrale: true });
});
M._statoGioco = { scenario: {
    nomads:     { strutture: strutture.slice(0, 3), terreni: [] },
    panoceania: { strutture: strutture.slice(3),    terreni: [] }
} };
M._fazione = 'NOMADI';
const nemici = [{ id: 'p1', alias: 'Fusilier', tipo: 'LI', arm: 1, skills: '', states: {} }];
const el = (frammento) => M.scenografia().find(x => new RegExp(frammento).test(x.nome));
const amm = (frammento, azione, opz) => M.scenografiaBersagliabile(el(frammento), azione, opz || {}).ammesso;

console.log('\n=== 1. La scenografia è NEUTRA: viene da entrambe le parti ===');
// Il numero non si fissa (era "=== 6"): e` quante strutture ci sono nello
// scenario, da entrambe le parti.
ok(strutture.length > 0 && M.scenografia().length === strutture.length,
   `tutti gli elementi, da entrambe le fazioni (${M.scenografia().length} di ${strutture.length})`);
ok(M.scenografia().every(x => x.neutrale === true), 'tutti marcati neutrali');
ok(M.eScenografia({ tipo: 'STRUTTURA' }), 'si riconosce anche dal tipo STRUTTURA, non solo dal campo neutrale');
ok(!M.eScenografia({ tipo: 'TORRETTA' }), 'ma una TORRETTA no: e` un Deployable del proprietario, non scenografia');
ok(!M.eScenografia({ tipo: 'LI', alias: 'Fusilier' }), 'una truppa non è scenografia');

console.log('\n=== 2. La validità dipende dai TRATTI, non dall essere struttura ===');
ok(amm('Console', 'HACKING'), 'Console: Hackable -> bersaglio di Hacking');
ok(!amm('Console', 'ATTACCO BS'), 'ma NON di un Combi Rifle: non c è niente da abbattere');
ok(amm('Porta Blindata', 'ATTACCO BS'), 'Porta Blindata: Destructible -> si abbatte');
ok(!amm('Porta Blindata', 'HACKING'), 'ma non si viola: niente Hacking');

console.log('\n=== 3. Indestructible batte tutto il resto ===');
ok(!amm('Tech-Coffin', 'ATTACCO BS'), 'Tech-Coffin: nessun attacco');
ok(!amm('Tech-Coffin', 'HACKING'), 'nemmeno Hacking');
ok(amm('Tech-Coffin', 'INTERAGIRE OBIETTIVO'),
   'ma resta Objective: l interazione passa');

console.log('\n=== 4. Anti-Materiel Only ===');
ok(!amm('Bulkhead', 'ATTACCO BS', { arma: M.profiloArma('Combi Rifle') }),
   'Porta Bulkhead: un Combi Rifle non le fa nulla');
ok(amm('Bulkhead', 'ATTACCO BS', { arma: M.profiloArma('Missile Launcher (Blast Mode)') }),
   'un Missile Launcher, che è Anti-materiel, sì');
const respinta = M.scenografiaBersagliabile(el('Bulkhead'), 'ATTACCO BS',
    { arma: M.profiloArma('Combi Rifle') });
ok(/Anti-materiel/i.test(respinta.motivo) && /Combi Rifle/.test(respinta.motivo),
   'e il motivo nomina l arma scelta, non solo la regola');

console.log('\n=== 5. Una torretta armata si attacca come una truppa ===');
// Non piu` come scenografia: e` un Deployable nemico, e passa dai bersagli
// normali. Le azioni si chiamano con gli id del motore (M.AZIONI), non con le
// etichette del menu.
const torNemica = Object.assign({}, window.DB_DEPLOYABLES.find(d => d.id === 'armed_turret'), { states: {} });
const vale = (az) => M.bersagliValidi(az, [torNemica], { attaccante: nemici[0], arma: M.profiloArma('Combi Rifle') })[0];
ok(vale(M.AZIONI.BS_ATTACK).ammesso, 'Torretta: bersaglio di attacchi BS');
ok(vale(M.AZIONI.CC_ATTACK).ammesso, 'anche in mischia');
ok(!vale(M.AZIONI.HACKING).ammesso, 'controprova: non e` hackerabile');
ok(!M.scenografia().some(x => /Armed Turret/.test(x.nome)), 'e non compare fra la scenografia');
ok(!amm('Armed Turret', 'HACKING'), 'ma non è Hackable');
ok(M.puoRicevereOrdine(el('Armed Turret')).puo !== undefined,
   'e puoRicevereOrdine risponde comunque, senza esplodere');

console.log('\n=== 6. Repeater: estende la Zona di Hacking ===');
ok(M.ripetitoriInCampo().length === 1, 'un solo ripetitore in campo');
ok(/Antenna/.test(M.ripetitoriInCampo()[0].nome), 'è l Antenna di Trasmissione');
ok(amm('Antenna', 'HACKING'), 'ed è anche bersaglio di Hacking');

console.log('\n=== 7. I bersagli uniscono truppe e scenografia ===');
const bs = M.bersagliConScenografia(M.AZIONI.BS_ATTACK, nemici, { arma: M.profiloArma('Combi Rifle') });
const ammBS = bs.filter(g => g.ammesso);
ok(ammBS.some(g => !g.scenografia), 'c è la truppa');
// Prima erano due, torretta e porta leggera: la torretta non e` piu`
// scenografia. Il test nomina cio` che deve esserci, e cio` che non deve.
const scenAmm = ammBS.filter(g => g.scenografia).map(g => g.nome || (g.unita && g.unita.nome));
ok(scenAmm.some(n => /Porta Blindata \(Leggera\)/.test(n)), `fra la scenografia attaccabile col Combi c'è la porta leggera (${JSON.stringify(scenAmm)})`);
ok(!scenAmm.some(n => /Armed Turret/.test(n)), 'e non la torretta');
ok(bs.filter(g => !g.ammesso).every(g => g.motivo), 'e ogni esclusa porta il proprio motivo');

const hk = M.bersagliConScenografia(M.AZIONI.HACKING, nemici, {}).filter(g => g.ammesso);
ok(hk.filter(g => g.scenografia).length === 2, 'Hacking: Console e Antenna');

const inter = M.bersagliConScenografia(M.AZIONI.INTERAGIRE, nemici, {}).filter(g => g.ammesso);
ok(inter.every(g => g.scenografia), 'INTERAGIRE OBIETTIVO: solo scenografia, nessuna truppa');
ok(inter.length === 3, 'i tre Objective');

console.log('\n=== 8. Le due azioni sono nel vocabolario e nel router ===');
ok(M.AZIONI.INTERAGIRE === 'INTERAGIRE OBIETTIVO', 'INTERAGIRE OBIETTIVO nel vocabolario');
ok(M.AZIONI.DEACTIVATOR === 'DEACTIVATOR', 'DEACTIVATOR nel vocabolario');
ok(M.SPEC[M.AZIONI.INTERAGIRE].schieramento === 'scenografia', 'e puntano alla scenografia');
const core = require('fs').readFileSync('./motore_core.js', 'utf8');
ok(/INTERAGIRE OBIETTIVO/.test(core) && /DEACTIVATOR/.test(core), 'e il router le instrada');

console.log('\n=== 9. Gli elementi senza states non rompono niente ===');
const senzaStates = { id: 'x', nome: 'Console di Comando', tipo: 'STRUTTURA',
                      skills: 'Hackable, Objective', state: 'ACTIVE', neutrale: true, arm: 1, bts: 3 };
let esploso = false;
try { M.statoBersaglio(senzaStates); M.scenografiaBersagliabile(senzaStates, 'HACKING', {}); }
catch (e) { esploso = true; }
ok(!esploso, 'statoBersaglio e il filtro li gestiscono comunque');
ok(M.statoBersaglio(senzaStates).attivi.length === 0, 'e non inventano stati');

console.log('\n=== 10. LA TORRETTA: l arma viene dal PROFILO ===');
// weapon: null + armaDalProfilo: true. Chi leggeva u.weapon trovava null
// e la torretta risultava disarmata, quindi non bersagliabile.
// Letta da DB_DEPLOYABLES, dove vive la torretta: da DB_STRUTTURE uscira`.
const tor = window.DB_DEPLOYABLES.find(x => x.id === 'armed_turret');
ok(!!tor, 'la torretta si trova in DB_DEPLOYABLES, id armed_turret');
ok(tor && !tor.weapon && tor.armaDalProfilo === true,
   'non porta l arma: la dichiara il profilo');

ok(M.armaTorretta(tor, 'Armed Turret (Combi Rifle)').arma.nome === 'Combi Rifle',
   'nome completo: risolto');
const abbr = M.armaTorretta(tor, 'Armed Turret (Combi R.)');
ok(abbr.arma && abbr.arma.nome === 'Combi Rifle',
   '"Combi R." abbreviato: risolto come Combi Rifle');
ok(abbr.avvisi.some(a => a.codice === 'A63'),
   'e l abbreviazione viene dichiarata, non risolta in silenzio');
ok(M.armaTorretta(tor, 'Armed Turret (Marksman R.)').arma.nome === 'Marksman Rifle',
   'anche "Marksman R."');

const senza = M.armaTorretta(tor, 'Armed Turret');
ok(senza.arma === null && senza.avvisi.some(a => a.codice === 'A62'),
   'senza parentesi: nessuna arma inventata, e lo dice');
const ignota = M.armaTorretta(tor, 'Armed Turret (Fucile Immaginario)');
ok(ignota.arma === null && ignota.avvisi.some(a => a.codice === 'A64'),
   'arma inesistente: nessun ripiego');

console.log('\n=== 11. Ora combatte anche in mischia ===');
const mischia = M.strutturaInMischia(tor);
ok(mischia.puo === true && mischia.cc === 5, 'CC 5: cosa che prima non aveva');
ok(mischia.arma && /PARA/.test(mischia.arma.nome), 'con una PARA CC Weapon');
ok(M.armaCCStruttura(tor) !== null, 'armaCCStruttura la trova');

console.log('\n=== 12. E resta bersagliabile con weapon: null ===');
const tv = (az) => M.bersagliValidi(az, [Object.assign({}, tor, { states: {} })], { attaccante: nemici[0] })[0];
ok(tv(M.AZIONI.BS_ATTACK).ammesso, 'ATTACCO BS: passa anche senza arma nel profilo');
ok(tv(M.AZIONI.CC_ATTACK).ammesso, 'e in mischia');
ok(!tv(M.AZIONI.HACKING).ammesso, 'ma non è Hackable');

console.log('\n=== 13. Total Reaction, non Automated ===');
ok(/Total Reaction/.test(tor.skills), 'la torretta ha Total Reaction');
ok(M.burstReattivo(tor, M.profiloArma('Combi Rifle'), {}).valore === 3,
   'quindi in ARO tira a Burst 3, non a 1');

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
