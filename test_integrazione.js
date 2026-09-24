// @versione 2026-09-23.1 | test_integrazione.js | proprieta`: chat TEST
// ==========================================
// 🔗 TEST DI INTEGRAZIONE — node test_integrazione.js
// ------------------------------------------
// Finora ogni suite caricava solo i file che le servivano. Questo carica
// TUTTO nell'ordine in cui lo fa la pagina, e percorre un ordine intero:
//   selezione arma -> bersaglio -> modificatori -> invio -> risoluzione
// dal modulo del giocatore fino allo scontro calcolato dall'Hub.
//
// È il collaudo che nessun test unitario può fare: verifica che i pezzi
// si parlino, non che ognuno funzioni per conto suo.
// ==========================================

global.window = global;

let passati = 0, falliti = 0;
function ok(c, n, e) { if (c) { passati++; console.log(`  ✅ ${n}`); } else { falliti++; console.log(`  ❌ ${n}${e ? '\n       ' + e : ''}`); } }

// --- DOM finto ---
const el = {};
function nodo(id) {
    return el[id] || (el[id] = { id, innerHTML: '', innerText: '', style: {},
        appendChild() {}, remove() {}, cloneNode() { return nodo(id + '_c'); },
        parentNode: { replaceChild() {} } });
}
global.document = {
    title: 'NOMADS HUB', getElementById: (i) => nodo(i),
    querySelector: () => nodo('btn'), querySelectorAll: () => [],
    createElement: () => ({ id: '', style: { cssText: '' }, innerHTML: '', appendChild() {} })
};
let alertUltimo = null; global.alert = (m) => { alertUltimo = m; };
global.confirm = () => true;
global.scrollTo = () => {};
let canaleCalcolo = null;
global.inviaCalcoloAllHub = (p) => { canaleCalcolo = p; };
global.inviaAllarmeAro = () => {};
global.inviaSchieramentoAllHub = () => {};
global.inviaRispostaAro = () => {};
global.goToStep = () => {};
global.renderTargetButtons = () => {};
global.confirmMultiAro = () => {};
global.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };

console.log('\n=== 1. Ordine di caricamento ===');
// L'ordine è quello della pagina: catalogo e database prima, poi il motore,
// poi l'Hub, poi i moduli del giocatore.
const ordine = [
    './catalogo_n5.js',
    './database_comune.js',
    './database_panoceania.js',
    './database_nomad.js',
    './motore_regole_n5.js',
    './calcolatore_math.js',
    './fireteam.js',
    './ordine_attacco_bs.js',
    './ordine_attacco_cc.js',
    './ordine_attacco_intuitivo.js',
    './ordine_fuoco_speculativo.js',
    './ordine_attacco_guidato.js',
    './ordine_hacking.js',
    './ordine_difesa.js',
    './ordine_movimento.js',
    './logica_aro.js'
];
let caricati = 0, errori = [];
ordine.forEach(function (f) {
    try { require(f); caricati++; }
    catch (e) { errori.push(`${f}: ${e.message}`); }
});
ok(errori.length === 0, `tutti i ${ordine.length} file caricati senza errori`, errori.join('\n       '));
const M = window.MotoreN5;
ok(!!M, 'il motore è disponibile dopo il caricamento');

console.log('\n=== 2. Nessun file ridefinisce funzioni di un altro ===');
ok(typeof window.getWeaponProfile === 'undefined',
   'getWeaponProfile non esiste: il ponte è chiuso e nessuno lo reinstalla');
ok(typeof window.generaRisoluzioneDaDati === 'function', 'l Hub espone generaRisoluzioneDaDati');
ok(typeof window.calcolaSalvezza === 'function', 'e calcolaSalvezza');
// Ogni modulo registra la propria funzione di avvio: nessuna deve mancare.
[['avviaFaseAttaccoBS', 'BS'], ['avviaFaseCC', 'CC'], ['avviaFaseIntuitivo', 'Intuitivo'],
 ['avviaFaseSpeculativo', 'Speculativo'], ['avviaFaseGuidato', 'Guidato'],
 ['avviaFaseHacking', 'Hacking'], ['avviaFaseDifesa', 'Difesa'],
 ['avviaFaseMovimento', 'Movimento']].forEach(function (c) {
    ok(typeof window[c[0]] === 'function', `il modulo ${c[1]} è registrato`);
});
ok(M.autotest().join('') === 'contratto coerente', 'il contratto del motore è coerente');

console.log('\n=== 3. Un ordine intero, dal modulo allo scontro ===');
const alguacil = { id: 'n1', alias: 'Alguacil Ana', nome: 'Alguacil', tipo: 'LI',
    bs: 11, cc: 13, ph: 10, wip: 12, arm: 1, bts: 0, w: 1,
    weapon: 'Combi Rifle, Pistol', equip: 'CC Weapon', skills: '', states: {}, combatGroup: 1 };
const fusilier = { id: 'p1', alias: 'Fusilier Carlo', nome: 'Fusilier', tipo: 'LI',
    bs: 12, cc: 13, ph: 10, wip: 13, arm: 1, bts: 0, w: 1,
    weapon: 'Combi Rifle', equip: '', skills: '', states: {}, combatGroup: 1 };

window.roster = [alguacil];
M._fazione = 'NOMADI';
M._rosterProprio = [alguacil];
M._rosterNemico = [fusilier];
window.currentOrder = {};
window.coordUnits = [alguacil];
window.coordIndex = 0;
window.coordPayloads = [];
window.combatTargets = [];
window.coordMode = false;
canaleCalcolo = null;

// 3a. il modulo offre le armi
window.avviaFaseAttaccoBS('ATTACCO BS', false);
const armiHtml = nodo('weapon-buttons-container').innerHTML;
ok(armiHtml.includes('Combi Rifle'), 'il modulo offre il Combi Rifle');
ok(armiHtml.includes('+3 / +3 / -3 / -3 / -6 / -6'), 'con le bande ufficiali del Weapon Chart');

// 3b. selezione arma e bersaglio
window.declareAttackBS('Combi Rifle');
ok(window.validTargets.length === 1 && window.validTargets[0].id === 'p1',
   'il filtro bersagli trova il Fusilier');

// 3c. modificatori
window.combatTargets = [{ id: 'p1', name: 'Fusilier Carlo', burst: 0 }];
window.goToModifiersBS('ATTACCO BS');
ok(window.totalBurst === 3, 'Burst 3 dal Combi Rifle');
window.setTargetRangeBS(0, 2);
window.toggleTargetCoverBS(0);
ok(window.combatTargets[0].rangeMod === -3 && window.combatTargets[0].cover === true,
   'banda 16-24" (-3) e bersaglio in Copertura');

// 3d. invio
window.eseguiCalcoloBS();
ok(canaleCalcolo !== null, 'il payload è stato spedito');
ok(canaleCalcolo.attacchi[0].azione === M.AZIONI.BS_ATTACK, 'con l azione canonica');
ok(canaleCalcolo.attacchi[0].bersagli[0].name === 'Fusilier Carlo', 'e il bersaglio vero');

// 3e. l'Hub risolve
window.gameState = { activeFaction: 'NOMADI', nomads: [alguacil], panoceania: [fusilier] };
const scontri = window.generaRisoluzioneDaDati(canaleCalcolo,
    [{ nome: 'Fusilier Carlo', azione: 'DODGE', hasLoF: true, burst: 1 }]);
ok(scontri.length === 1, 'l Hub produce uno scontro');
const s = scontri[0];
ok(s.titolo === 'TIRO FACCIA A FACCIA', 'Faccia a Faccia contro la Schivata');
ok(s.attivo.mod === 5, `attivo: BS 11 -3 gittata -3 copertura = 5 (ottenuto ${s.attivo.mod})`);
ok(s.attivo.burst === 3, 'Burst 3');
ok(s.reattivo.mod === 10, 'Schivata a PH 10');
// L'adattatore mette l'HTML in .salvezza e i dati grezzi in .dati:
// il valore numerico sta lì dentro, non sull'oggetto attivo.
ok(s.attivo.dati.salvezzaInflitta.valoreSuccesso === 11,
   'salvezza del Fusilier: ARM 1 +3 copertura +7 PS = 11');
ok(/11 o MENO/.test(s.attivo.salvezzaInflitta),
   'e l HTML per l interfaccia dice la stessa cosa');

console.log('\n=== 4. Il blocco funziona anche a integrazione completa ===');
window.currentOrder = {}; window.coordUnits = [alguacil]; window.coordIndex = 0;
window.coordPayloads = []; canaleCalcolo = null; alertUltimo = null;
window.currentOrder.weapon = 'Combi Rifle';
window.combatTargets = [{ id: 'generic1', name: 'Bersaglio Primario', burst: 3, rangeIndex: 0, rangeMod: 3 }];
window.totalBurst = 3;
window.eseguiCalcoloBS();
ok(canaleCalcolo === null, 'il bersaglio fantasma non arriva all Hub');
ok(alertUltimo && alertUltimo.includes('INVIO BLOCCATO'), 'e il motivo è spiegato');
ok(window.coordIndex === 0 && window.coordPayloads.length === 0, 'lo stato è ripristinato');

console.log('\n=== 5. Un ordine di puro movimento ===');
window.currentOrder = { unit: alguacil }; window.coordUnits = [alguacil];
window.coordIndex = 0; window.coordPayloads = []; window.combatTargets = [];
canaleCalcolo = null;
window.currentOrder.action1 = 'MOVIMENTO';
window.avviaFaseMovimento('MOVIMENTO', true);
ok(canaleCalcolo !== null && canaleCalcolo.attacchi.length === 0,
   'la busta vuota arriva all Hub: l ordine è chiuso');
const vuoti = window.generaRisoluzioneDaDati(canaleCalcolo, []);
ok(vuoti.length === 0, 'e non produce scontri');

console.log('\n=== 6. Le difese pure ===');
window.currentOrder = { action: 'SCHIVATA' }; window.coordUnits = [alguacil];
window.coordPayloads = []; canaleCalcolo = null;
window.preparaModificatoriDifesa('SCHIVATA');
window.eseguiCalcoloDifesa();
ok(canaleCalcolo !== null, 'la Schivata pura viene spedita');
const dif = window.generaRisoluzioneDaDati(canaleCalcolo, []);
ok(dif.length === 1 && dif[0].titolo === 'TIRO DI SUPPORTO / DIFESA', 'un tiro solo, nessun confronto');
ok(dif[0].attivo.mod === 10, 'PH 10');

console.log('\n=== 7. Tutte le unità dei due database passano dall Hub ===');
const tutti = [].concat(window.DB_PANOCEANIA, window.DB_NOMADI);
const combi = M.profiloArma('Combi Rifle');
let rotte = 0, senzaArmi = 0;
tutti.slice(0, 120).forEach(function (u) {
    try {
        window.gameState = { activeFaction: 'NOMADI', nomads: [u], panoceania: [fusilier] };
        const r = window.generaRisoluzioneDaDati({ attacchi: [{
            attaccante: M.nomeUnita(u), azione: M.AZIONI.BS_ATTACK, arma: combi,
            bersagli: [{ name: 'Fusilier Carlo', burst: 1, rangeIndex: 1, rangeMod: 3, ammo: 'N', terrain: 'NESSUNO' }]
        }] }, []);
        if (!r.length) senzaArmi++;
        else if (typeof r[0].attivo.mod !== 'number' && r[0].attivo.mod !== 'Auto') rotte++;
    } catch (e) { rotte++; if (rotte < 3) console.log(`     ${M.nomeUnita(u)}: ${e.message}`); }
});
ok(rotte === 0, '120 unità risolte senza eccezioni né valori assurdi');

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
