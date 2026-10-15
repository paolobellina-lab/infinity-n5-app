// @versione 2026-10-15.2 | test_modulo_aro.js | proprieta`: chat TEST
// 2026-10-15.2: sezione 6 girata (motore 2026-10-15.2, logica_aro 2026-10-15.2,
//    Paolo): in ARO le modalita` della stessa arma sono UN bottone; i modi in
//    window._modiAro['A:<famiglia>'], la scelta nella tendina delle munizioni
//    ("indice|munizione"), il cambio con setAroAmmo. Sezione 11: M.raggruppaModiArma
//    sui profili veri (Orc Hacker, Alguacil Missile Launcher, Morlock in CC, vuota).
// 2026-10-15.1: due prove girate (motore 2026-10-13.2, logica_aro 2026-10-15.1).
//    Reset contro un Attacco BS: ora AMMESSO, con la nota dei due Tiri Normali
//    (prima "Reset no"). La lista delle armi ARO non mostra piu` il Burst:
//    il bottone approvato da Paolo non lo porta, il 3 si legge dopo la scelta.
// Test end-to-end del turno reattivo — node test_modulo_aro.js
global.window = global;
let passati = 0, falliti = 0;
function ok(c, n, e) { if (c) { passati++; console.log(`  ✅ ${n}`); } else { falliti++; console.log(`  ❌ ${n}${e ? '\n       ' + e : ''}`); } }

const el = {};
function nodo(id) { return el[id] || (el[id] = { id, innerHTML: '', innerText: '', style: {},
    appendChild() {}, remove() {}, cloneNode() { return nodo(id + '_c'); }, parentNode: { replaceChild() {} } }); }
global.document = { title: 'NOMADS', getElementById: (i) => nodo(i), querySelector: () => nodo('btn'),
    querySelectorAll: () => [], createElement: () => ({ style: {}, innerHTML: '', appendChild() {} }) };
global.alert = () => {}; global.confirm = () => true;
global.scrollTo = () => {};
let rispostaAro = null; global.inviaRispostaAro = (p) => { rispostaAro = p; };

require('./catalogo_n5.js'); require('./database_comune.js');
const M = require('./motore_regole_n5.js');
require('./logica_aro.js');

const alguacil = { id: 'n1', alias: 'Alguacil', bs: 11, ph: 10, wip: 12,
                   weapon: 'Combi Rifle, Knife', skills: '', states: {} };
const sniper   = { id: 'n2', alias: 'Cecchino', bs: 12, ph: 10, wip: 12,
                   weapon: 'MULTI Sniper Rifle', skills: '', states: {} };
const soppress = { id: 'n3', alias: 'Mitragliere', bs: 11, ph: 10, wip: 12,
                   weapon: 'Heavy Machine Gun', skills: '', states: { suppressive: true } };
const hacker   = { id: 'n4', alias: 'Interventor', bs: 11, ph: 10, wip: 14,
                   weapon: 'Pistol', skills: 'Hacker, Hacking Device', states: {} };
const killer   = { id: 'n5', alias: 'Assassino', bs: 11, ph: 11, wip: 13,
                   weapon: 'Pistol', skills: 'Hacker, Killer Hacking Device', states: {} };
const ko       = { id: 'n6', alias: 'Caduto', state: 'UNCONSCIOUS', states: { unconscious: true } };

global.roster = [alguacil, sniper, soppress, hacker, killer, ko];
M._fazione = 'NOMADI';
M._rosterProprio = global.roster;
M._rosterNemico = [{ id: 'p1', alias: 'Fusilier', tipo: 'LI', states: {} }];

function nuovo(attacco) {
    window.currentAttackData = attacco || { attaccanti: ['Fusilier'], azione: 'ATTACCO BS' };
    window.selectedAroUnits = []; window.currentAroIndex = 0;
    window.aroReactions = []; window.aroCurrentConfig = {}; window.aroSfMode = false;
    rispostaAro = null;
}

console.log('\n=== 1. IL CRASH: Schivata e Reset senza arma ===');
nuovo();
window.selectedAroUnits = ['n1'];
window.avviaCicloAroUnita();
let crash = null;
try { window.selezionaAzioneAro('DODGE'); } catch (e) { crash = e; }
ok(crash === null, 'Schivata senza arma: nessun crash', crash && crash.message);
ok(nodo('aro-modifiers-content').innerHTML.includes('PH 10'), 'e mostra il valore di Schivata calcolato');

crash = null;
window.avviaCicloAroUnita();
try { window.selezionaAzioneAro('RESET'); } catch (e) { crash = e; }
ok(crash === null, 'Reset senza arma: nessun crash', crash && crash.message);
ok(nodo('aro-modifiers-content').innerHTML.includes('WIP 12'), 'e mostra il valore di Reset');

console.log('\n=== 2. MOD calcolati (prima erano solo interruttori) ===');
window.avviaCicloAroUnita();
window.selezionaAzioneAro('DODGE');
ok(window.aroCurrentConfig.valoreSuccesso === 10, 'con LoF: PH 10');
window.toggleAroLoF();
ok(window.aroCurrentConfig.valoreSuccesso === 7, 'senza LoF: PH 7, calcolato non solo segnalato');

console.log('\n=== 3. Vocabolario ARO tradotto dal motore ===');
ok(M.aroAdAzione('DODGE') === M.AZIONI.SCHIVATA, 'DODGE -> SCHIVATA');
ok(M.aroAdAzione('BS_ATTACK') === M.AZIONI.BS_ATTACK, 'BS_ATTACK -> ATTACCO BS');
ok(M.azioneAdAro(M.AZIONI.SCHIVATA) === 'DODGE', 'e nel senso inverso');

console.log('\n=== 4. Filtro azioni ARO ===');
let poss = M.azioniAroPossibili(alguacil, 'HACKING');
ok(!poss.find(a => a.id === 'DODGE').ammesso, 'contro un Attacco Comms la Schivata non serve');
ok(poss.find(a => a.id === 'RESET').ammesso, 'ma il Reset sì');
poss = M.azioniAroPossibili(alguacil, 'ATTACCO BS');
ok(poss.find(a => a.id === 'DODGE').ammesso, 'contro un BS: Schivata sì');
// Girata il 15 ottobre: il Reset contro un BS e` ammesso. Non si oppone:
// due Tiri Normali, e serve solo a cancellare gli stati che il Reset cancella.
const resetBS = poss.find(a => a.id === 'RESET');
ok(resetBS.ammesso && resetBS.note.some(n => /non si oppone/.test(n) && /due Tiri Normali/.test(n)),
   'contro un BS: Reset ammesso, con la nota "non si oppone: due Tiri Normali"', JSON.stringify(resetBS));
// Controprova: contro un Attacco Comms il Reset si oppone, quindi la nota non c'e`.
ok(M.azioniAroPossibili(alguacil, 'HACKING').find(a => a.id === 'RESET').note.length === 0,
   'CONTROPROVA: contro un Hacking il Reset si oppone, e la nota dei Tiri Normali non compare');
ok(!M.azioniAroPossibili(alguacil, null).find(a => a.id === 'HACKING').ammesso,
   'un non-hacker non ha l ARO di Hacking');
ok(M.azioniAroPossibili(ko, null).every(a => !a.ammesso), 'un Incosciente non dichiara ARO');

console.log('\n=== 5. LA SOPPRESSIONE, che in ARO non esisteva ===');
nuovo();
window.selectedAroUnits = ['n3'];
window.avviaCicloAroUnita();
window.selezionaAzioneAro('BS_ATTACK');
let h = nodo('aro-weapon-list').innerHTML;
ok(h.includes('SF Mode') || h.includes('SOPPRESSIONE'), 'la schermata segnala il profilo SF Mode');
ok(h.includes('Heavy Machine Gun (SF Mode)'), 'l arma è offerta in SF Mode');
// Girata il 15 ottobre (INTERFACCIA): il bottone approvato da Paolo non
// mostra il Burst. Il 3 compare dopo la scelta: lo prova aroCurrentConfig.burst
// qui sotto, che e` il numero che arriva al tavolo.
ok(!/\bB3\b/.test(h) && !/\bB1\b/.test(h), 'il bottone dell arma non mostra il Burst (ne` B3 ne` B1)');

window.selezionaArmaAro('Heavy Machine Gun (SF Mode)');
window.selezionaBersaglioAro('Fusilier');
ok(window.aroCurrentConfig.burst === 3, 'il Burst in ARO è 3, non 1');
ok(nodo('aro-modifiers-content').innerHTML.includes('bersaglio solo'),
   'e il vincolo "tutto su un bersaglio solo" è mostrato');

nuovo();
window.selectedAroUnits = ['n1'];
window.avviaCicloAroUnita();
window.selezionaAzioneAro('BS_ATTACK');
window.selezionaArmaAro('Combi Rifle');
window.selezionaBersaglioAro('Fusilier');
ok(window.aroCurrentConfig.burst === 1, 'senza Soppressione il Burst in ARO resta 1');

console.log('\n=== 6. Espansione armi dal database (quinta copia eliminata) ===');
nuovo();
window.selectedAroUnits = ['n2'];
window.avviaCicloAroUnita();
window.selezionaAzioneAro('BS_ATTACK');
h = nodo('aro-weapon-list').innerHTML;
// 🔴 GIRATA IL 15 OTTOBRE SERA: un bottone per arma anche in ARO.
const clicAro = [...h.matchAll(/onclick="([^"]+)"/g)].map(x => x[1]);
const chiaveS = 'A:MULTI Sniper Rifle';
ok(clicAro.length === 1 && clicAro[0] === `window.selezionaArmaAro('MULTI Sniper Rifle (AP Mode)', false, '${chiaveS}')`,
   `MULTI Sniper Rifle in ARO: un bottone solo, con la chiave delle modalita\` (${clicAro.length})`, JSON.stringify(clicAro));
const modiAttesiAro = M.variantiArma('MULTI Sniper Rifle').map(v => v.nomeRichiesto || v.nome);
const modiVistiAro = ((window._modiAro || {})[chiaveS]) || [];
ok(modiAttesiAro.length === 3 && JSON.stringify(modiVistiAro) === JSON.stringify(modiAttesiAro),
   `window._modiAro['${chiaveS}'] sono le tre modalita\` del motore (${modiVistiAro.length})`, JSON.stringify(modiVistiAro));
window.selezionaArmaAro(modiVistiAro[0] || 'MULTI Sniper Rifle (AP Mode)', false, chiaveS);
window.selezionaBersaglioAro('Fusilier');
const vociAro = [...nodo('aro-modifiers-content').innerHTML.matchAll(/<option value="(\d+\|[^"]+)"[^>]*>([^<]+)</g)].map(x => x[1] + ' => ' + x[2].trim());
ok(JSON.stringify(vociAro) === JSON.stringify(['0|AP => Munizioni: AP · B1', '1|SHOCK => Munizioni: SHOCK · B1', '2|DA => Munizioni: DA · B1']),
   'dopo il tocco, la tendina ha una voce per modalita` ("indice|munizione", B1 in ARO)', JSON.stringify(vociAro));
if (typeof window.setAroAmmo === 'function') window.setAroAmmo('2|DA');
ok(window.aroCurrentConfig.arma === 'MULTI Sniper Rifle (Anti-Materiel Mode)' && window.aroCurrentConfig.ammo === 'DA',
   `setAroAmmo('2|DA'): l arma diventa la Anti-Materiel Mode, munizione DA (${window.aroCurrentConfig.arma}, ${window.aroCurrentConfig.ammo})`);
// Controprova: l'arma a un solo modo non ha chiave ne` indici.
nuovo();
window.selectedAroUnits = ['n1'];
window.avviaCicloAroUnita();
window.selezionaAzioneAro('BS_ATTACK');
ok(/selezionaArmaAro\('Combi Rifle'[^)]*\)/.test(nodo('aro-weapon-list').innerHTML) && !/'A:Combi Rifle'/.test(nodo('aro-weapon-list').innerHTML),
   'CONTROPROVA: il Combi Rifle ha il suo bottone, senza chiave di modalita`');
nuovo();
window.selectedAroUnits = ['n2'];
window.avviaCicloAroUnita();
window.selezionaAzioneAro('BS_ATTACK');
h = nodo('aro-weapon-list').innerHTML;
ok(h.includes('Knife') === false, 'il coltello non è offerto per un ARO a distanza');

console.log('\n=== 7. Hacking ARO: programmi per dispositivo ===');
nuovo({ attaccanti: ['Fusilier'], azione: 'ATTACCO BS' });
window.selectedAroUnits = ['n4'];
window.avviaCicloAroUnita();
window.selezionaAzioneAro('HACKING');
h = nodo('aro-weapon-list').innerHTML;
ok(h.includes('CARBONITE') && h.includes('SPOTLIGHT'), 'Hacking Device: i suoi programmi');
ok(!h.includes('TRINITY'), 'niente Trinity (prima ne mostrava 3 fissi uguali per tutti)');

nuovo();
window.selectedAroUnits = ['n5'];
window.avviaCicloAroUnita();
window.selezionaAzioneAro('HACKING');
h = nodo('aro-weapon-list').innerHTML;
ok(h.includes('TRINITY') && !h.includes('CARBONITE'), 'Killer Hacking Device: solo Trinity');

console.log('\n=== 8. Munizioni: "E/M" non si spezza più ===');
ok(M.opzioniMunizioni('E/M').length === 1, '"E/M" resta intera');
ok(M.opzioniMunizioni('N/A').length === 1, '"N/A" resta intera');

console.log('\n=== 9. Invio ===');
nuovo();
window.selectedAroUnits = ['n1'];
window.avviaCicloAroUnita();
window.selezionaAzioneAro('DODGE');
window.salvaAroCorrente();
ok(rispostaAro !== null, 'risposta ARO spedita');
const r = rispostaAro && rispostaAro.reazioni[0];
ok(r && r.azione === 'DODGE', 'vocabolario ARO conservato per l Hub');
ok(r && r.azioneAttiva === M.AZIONI.SCHIVATA, 'con la traduzione affiancata');
ok(r && r.valoreSuccesso === 10, 'e il valore calcolato');
ok(rispostaAro.motoreVersione, 'la versione del motore è tracciata nel payload');

console.log('\n=== 10. Il ponte è chiuso ===');
ok(typeof window.getWeaponProfile === 'undefined',
   'window.getWeaponProfile non esiste più: nessuno la installa');


console.log('\n=== 11. M.raggruppaModiArma sui profili veri (motore 2026-10-15.2) ===');
{
    const lg = console.log, lw = console.warn; console.log = () => {}; console.warn = () => {};
    try { require('./database_nomad.js'); require('./database_panoceania.js'); } catch (e) { /* detto sotto */ }
    console.log = lg; console.warn = lw;
    const TUTTI9 = [...(window.DB_NOMADI || []), ...(window.DB_PANOCEANIA || [])];
    const vero9 = (n) => { const p = TUTTI9.find(u => u.nome === n); return p ? Object.assign(JSON.parse(JSON.stringify(p)), { states: {}, deployState: 'NORMAL', state: 'ACTIVE' }) : null; };
    const ragg = (n, az) => { const u = vero9(n); if (!u || typeof M.raggruppaModiArma !== 'function') return null;
        const e = M.armiARO(u, az); return M.raggruppaModiArma(e.armi || e).map(x => [x.famiglia, x.modi.map(m => m.nome), x.vista && x.vista.ammoOpzioni]); };
    ok(typeof M.raggruppaModiArma === 'function', 'il motore espone raggruppaModiArma');
    const orc = ragg('Orc (Hacker, Hacking Device)', 'BS_ATTACK');
    ok(JSON.stringify(orc) === JSON.stringify([['MULTI Rifle', ['MULTI Rifle (AP Mode)', 'MULTI Rifle (Shock Mode)', 'MULTI Rifle (Anti-Materiel Mode)'], ['AP', 'SHOCK', 'DA']], [null, ['Pistol'], ['N']]]),
       'Orc (Hacker): due voci, MULTI Rifle con tre modi e munizioni AP/SHOCK/DA, poi la Pistol semplice', JSON.stringify(orc));
    const alg = ragg('Alguacil (Missile Launcher)', 'BS_ATTACK');
    ok(alg && alg[0][0] === 'Missile Launcher' && JSON.stringify(alg[0][1]) === JSON.stringify(['Missile Launcher (Blast Mode)', 'Missile Launcher (Hit Mode)']),
       'Alguacil (Missile Launcher): una voce con Blast e Hit (Sagoma e gittata insieme)', JSON.stringify(alg));
    const mor = ragg('Morlock (Kobra Pistol, DA CC)', 'CC_ATTACK');
    ok(mor && mor.length > 0 && mor.every(x => x[0] === null && x[1].length === 1), 'CONTROPROVA: Morlock in CC, tutte voci semplici (famiglia null)', JSON.stringify(mor));
    ok(typeof M.raggruppaModiArma === 'function' && JSON.stringify(M.raggruppaModiArma([])) === '[]' && JSON.stringify(M.raggruppaModiArma(null)) === '[]',
       'lista vuota o null: nessuna voce');
}

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
