// @versione 2026-09-23.1 | test_modulo_bs.js | proprieta`: chat TEST
// Test end-to-end del modulo BS riscritto — node test_modulo_bs.js
// Simula il minimo DOM che il modulo tocca, così si può collaudare senza browser.
global.window = global;

let passati = 0, falliti = 0;
function ok(cond, nome, extra) {
    if (cond) { passati++; console.log(`  ✅ ${nome}`); }
    else { falliti++; console.log(`  ❌ ${nome}${extra ? '\n       ' + extra : ''}`); }
}

// --- DOM finto ---
const elementi = {};
function nodo(id) {
    return elementi[id] || (elementi[id] = {
        id, innerHTML: '', innerText: '', style: {}, children: [],
        appendChild(c) { this.children.push(c); }, remove() {},
        cloneNode() { return nodo(id + '_clone'); },
        parentNode: { replaceChild() {} }
    });
}
global.document = {
    title: 'NOMADS HUB',
    getElementById: (id) => nodo(id),
    querySelector: () => nodo('btn-calcolo'),
    querySelectorAll: () => [],
    createElement: () => ({ id: '', style: { cssText: '' }, innerHTML: '', appendChild() {} })
};
let alertUltimo = null;
global.alert = (m) => { alertUltimo = m; };
let inviato = null;
global.inviaCalcoloAllHub = (p) => { inviato = p; };
global.goToStep = (s) => { global.ultimoStep = s; };
global.renderTargetButtons = () => { global.renderChiamato = true; };

require('./catalogo_n5.js');
require('./database_comune.js');
const M = require('./motore_regole_n5.js');
require('./ordine_attacco_bs.js');

// --- tavolo ---
const alguacil = { id: 'n1', alias: 'Alguacil Ana', nome: 'Alguacil', bs: 11,
                   weapon: 'Combi Rifle, Pistol', skills: '', states: {} };
const lince    = { id: 'n2', alias: 'Occhio di Lince', bs: 12,
                   weapon: 'MULTI Sniper Rifle', skills: 'Multispectral Visor L3', states: {} };
const multiman = { id: 'n3', alias: 'Portamulti', bs: 11,
                   weapon: 'MULTI Rifle, CC Weapon', skills: 'CC Attack (+1B)', states: {} };

M._fazione = 'NOMADI';
M._rosterProprio = [alguacil, lince, multiman];
M._rosterNemico = [
    { id: 'p1', alias: 'Fusilier Carlo', tipo: 'LI', arm: 1, states: {} },
    { id: 'p2', alias: 'Bolt KO', tipo: 'LI', state: 'UNCONSCIOUS', states: { unconscious: true } },
    { id: 'p3', alias: 'Croc Man', tipo: 'LI', deployState: 'CAMO', states: { camo: true } },
    { id: 'p4', alias: 'Orc Morto', tipo: 'HI', state: 'DEAD', states: {} }
];

function nuovoOrdine(unita) {
    window.currentOrder = {};
    window.coordUnits = [unita];
    window.coordIndex = 0;
    window.coordPayloads = [];
    window.combatTargets = [];
    window.coordMode = false;
    inviato = null; alertUltimo = null;
}

console.log('\n=== 1. La dipendenza nascosta è CHIUSA ===');
ok(typeof window.getWeaponProfile === 'undefined',
   'getWeaponProfile non esiste più: il ponte è stato rimosso');
ok(M.profiloArma('Combi Rifle').nome === 'Combi Rifle',
   'il profilo arriva dal motore, non da una funzione dentro questo modulo');

console.log('\n=== 2. Selezione arma: varianti dal database, non a mano ===');
nuovoOrdine(alguacil);
window.avviaFaseAttaccoBS('ATTACCO BS', false);
let htmlArmi = nodo('weapon-buttons-container').innerHTML;
ok(htmlArmi.includes('Combi Rifle') && htmlArmi.includes('Pistol'), 'Alguacil: Combi Rifle e Pistol offerte');
ok(htmlArmi.includes('+3 / +3 / -3 / -3 / -6 / -6'),
   'le bande ufficiali del Combi sono mostrate sul bottone');

nuovoOrdine(lince);
window.startUnitAllocationLoopBS();
htmlArmi = nodo('weapon-buttons-container').innerHTML;
const modalita = (htmlArmi.match(/MULTI Sniper Rifle \(/g) || []).length;
ok(modalita >= 3, `MULTI Sniper espansa nelle sue modalità (${modalita} bottoni)`);

nuovoOrdine(multiman);
window.startUnitAllocationLoopBS();
htmlArmi = nodo('weapon-buttons-container').innerHTML;
ok(htmlArmi.includes('arma da Corpo a Corpo'),
   'la CC Weapon non è offerta, ma il motivo è scritto (non sparisce in silenzio)');

console.log('\n=== 3. Selezione bersaglio: gli esclusi restano visibili ===');
nuovoOrdine(alguacil);
window.currentOrder.weapon = 'Combi Rifle';
window.setupTargetSelectionBS();
ok(window.validTargets.length === 2, `2 bersagli validi (trovati ${window.validTargets.length})`);
ok(window.validTargets.some(u => u.alias === 'Bolt KO'),
   'l Incosciente è bersagliabile (prima questo modulo lo escludeva)');
ok(window.targetsScartati.length === 2, 'i 2 esclusi sono elencati');
console.log('   esclusi: ' + window.targetsScartati.map(t => `${t.nome} (${t.motivo.slice(0, 40)}…)`).join(' | '));

console.log('\n=== 4. Multispectral Visor L3 apre i Marker ===');
nuovoOrdine(lince);
window.currentOrder.weapon = 'MULTI Sniper Rifle (AP Mode)';
window.setupTargetSelectionBS();
ok(window.validTargets.some(u => u.alias === 'Croc Man'),
   'con MSV L3 il Marker CAMO è bersagliabile senza Scoprire');

console.log('\n=== 5. LA SEGNALAZIONE #5: niente bersaglio fantasma ===');
nuovoOrdine(alguacil);
window.currentOrder.weapon = 'Combi Rifle';
window.combatTargets = [];
window.goToModifiersBS('ATTACCO BS');
ok(alertUltimo && alertUltimo.includes('Nessun bersaglio confermato'),
   'senza bersagli il modulo si ferma e lo dice');
ok(!window.combatTargets.some(t => t.name === 'Bersaglio Primario'),
   'nessun "Bersaglio Primario" inventato');

console.log('\n=== 6. Gittata: banda iniziale esplicita ===');
nuovoOrdine(alguacil);
window.currentOrder.weapon = 'Combi Rifle';
window.combatTargets = [{ id: 'p1', name: 'Fusilier Carlo', burst: 0 }];
window.goToModifiersBS('ATTACCO BS');
ok(window.combatTargets[0].rangeMod === 3 && window.combatTargets[0].rangeIndex === 0,
   'banda 0 -> +3, indice e MOD allineati',
   `mod=${window.combatTargets[0].rangeMod} idx=${window.combatTargets[0].rangeIndex}`);
window.setTargetRangeBS(0, 5);
ok(window.combatTargets[0].rangeMod === -6 && window.combatTargets[0].rangeIndex === 5,
   'banda 5 (40-48") -> -6: indice e MOD non possono disallinearsi');
window.setTargetRangeBS(0, 2);
ok(window.combatTargets[0].rangeMod === -3,
   'banda 2 (16-24") -> -3, non più -6: col vecchio db qui il tiro sbagliava di 3');

console.log('\n=== 7. Burst ===');
ok(window.totalBurst === 3, `Combi Rifle: 3 dadi (ottenuti ${window.totalBurst})`);
ok(window.combatTargets[0].burst === 3, 'tutti i dadi sul primo bersaglio');

nuovoOrdine(multiman);
window.currentOrder.weapon = 'MULTI Rifle (AP Mode)';
window.combatTargets = [{ id: 'p1', name: 'Fusilier Carlo', burst: 0 }];
window.goToModifiersBS('ATTACCO BS');
ok(window.totalBurst === 3,
   'il "CC Attack (+1B)" NON dà un dado in più sparando (prima lo dava)',
   `ottenuto ${window.totalBurst}`);

nuovoOrdine(alguacil);
window.coordMode = true; window.coordUnits = [lince, alguacil]; window.coordIndex = 1;
window.currentOrder.weapon = 'Combi Rifle';
window.combatTargets = [{ id: 'p1', name: 'Fusilier Carlo', burst: 0 }];
window.goToModifiersBS('ATTACCO BS');
ok(window.totalBurst === 1, 'gregario in Ordine Coordinato: Burst 1');

console.log('\n=== 8. Invio: passa solo un payload valido ===');
nuovoOrdine(alguacil);
window.currentOrder.weapon = 'Combi Rifle';
window.combatTargets = [{ id: 'p1', name: 'Fusilier Carlo', burst: 0 }];
window.goToModifiersBS('ATTACCO BS');
window.eseguiCalcoloBS();
ok(inviato !== null, 'attacco valido: spedito all Hub');
ok(inviato && inviato.attacchi[0].bersagli[0].name === 'Fusilier Carlo', 'il bersaglio nel payload è quello vero');
ok(inviato && inviato.attacchi[0].azione === M.AZIONI.BS_ATTACK, 'azione dal vocabolario canonico');

nuovoOrdine(alguacil);
window.currentOrder.weapon = 'Combi Rifle';
window.combatTargets = [{ id: 'generic1', name: 'Bersaglio Primario', burst: 3, rangeIndex: 0, rangeMod: 3 }];
window.totalBurst = 3;
window.eseguiCalcoloBS();
ok(inviato === null, 'payload con fantasma: NIENTE spedito');
ok(alertUltimo && alertUltimo.includes('INVIO BLOCCATO'), 'il blocco è spiegato all utente');
ok(window.coordIndex === 0 && window.coordPayloads.length === 0,
   'lo stato è ripristinato: l ordine non è stato consumato');

console.log('\n=== 9. Burst oltre il disponibile ===');
nuovoOrdine(alguacil);
window.currentOrder.weapon = 'Combi Rifle';
window.combatTargets = [{ id: 'p1', name: 'Fusilier Carlo', burst: 0 }];
window.goToModifiersBS('ATTACCO BS');
window.combatTargets[0].burst = 5;
window.eseguiCalcoloBS();
ok(inviato === null && alertUltimo.includes('5'), '5 dadi con un Combi da 3: bloccato');

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
