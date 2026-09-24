// @versione 2026-09-23.1 | test_motore.js | proprieta`: chat TEST
// Test del contratto — eseguire con: node test_motore.js
global.window = global;
require('./catalogo_n5.js');
const M = require('./motore_regole_n5.js');

// --- Tavolo finto ---
M._fazione = 'NOMADI';
M._rosterProprio = [
    { id: 'n1', alias: 'Alguacil Ana', nome: 'Alguacil', bs: 11, ph: 10, wip: 12 },
    { id: 'n2', alias: 'Zero Bruno', nome: 'Zero', bs: 11, ph: 11, wip: 13 }
];
M._rosterNemico = [
    { id: 'p1', alias: 'Fusilier Carlo', nome: 'Fusilier', arm: 1, bts: 0, ph: 10, states: {} },
    { id: 'p2', alias: 'Bolt Dario', nome: 'Bolt', arm: 3, bts: 3, ph: 10, states: { targeted: true } }
];

// Profilo Combi Rifle come lo produce oggi getWeaponProfile()
const combi = { burst: 3, dam: 7, ammo: 'N', isTemplate: false, isCC: false,
    bands: [{ mod: 3, label: 'Max 16"' }, { mod: -3, label: 'Max 32"' }, { mod: -6, label: 'Max 48"' }] };

let passati = 0, falliti = 0;
function caso(nome, input, attesoOk, codiciAttesi) {
    const e = M.creaAttacco(input);
    const codici = e.errori.map(x => x.codice).sort();
    const okTipo = (e.ok === attesoOk);
    const okCodici = !codiciAttesi || JSON.stringify(codici) === JSON.stringify(codiciAttesi.sort());
    if (okTipo && okCodici) { passati++; console.log(`  ✅ ${nome}`); }
    else {
        falliti++;
        console.log(`  ❌ ${nome}\n       atteso ok=${attesoOk} codici=${JSON.stringify(codiciAttesi)}`);
        console.log(`       ottenuto ok=${e.ok} codici=${JSON.stringify(codici)}`);
        e.errori.forEach(x => console.log(`         - ${x.codice}: ${x.messaggio}`));
    }
    return e;
}

console.log('\n=== 1. Attacco BS valido ===');
caso('Alguacil spara al Fusilier a 20" (banda -3), 3 dadi', {
    attaccante: M._rosterProprio[0], azione: M.AZIONI.BS_ATTACK, arma: combi,
    bersagli: [{ id: 'p1', name: 'Fusilier Carlo', burst: 3, rangeIndex: 1, rangeMod: -3, cover: false }]
}, true, []);

console.log('\n=== 2. LA SEGNALAZIONE #5 — bersaglio fantasma ===');
caso('Payload con il placeholder "Bersaglio Primario"', {
    attaccante: M._rosterProprio[0], azione: M.AZIONI.BS_ATTACK, arma: combi,
    bersagli: [{ id: 'generic1', name: 'Bersaglio Primario', burst: 3, rangeIndex: 0, rangeMod: 3, cover: false }]
}, false, ['E06']);

caso('Bersaglio con nome plausibile ma non schierato', {
    attaccante: M._rosterProprio[0], azione: M.AZIONI.BS_ATTACK, arma: combi,
    bersagli: [{ id: 'p9', name: 'Nisse Fantasma', burst: 3, rangeIndex: 0, rangeMod: 3 }]
}, false, ['E06']);

console.log('\n=== 3. Gittata non scelta (il caso "esce sempre zero") ===');
caso('Nessun rangeIndex impostato', {
    attaccante: M._rosterProprio[0], azione: M.AZIONI.BS_ATTACK, arma: combi,
    bersagli: [{ id: 'p1', name: 'Fusilier Carlo', burst: 3 }]
}, false, ['E13']);

const disallineato = M.creaAttacco({
    attaccante: M._rosterProprio[0], azione: M.AZIONI.BS_ATTACK, arma: combi,
    bersagli: [{ id: 'p1', name: 'Fusilier Carlo', burst: 3, rangeIndex: 2, rangeMod: 0 }]
});
console.log(disallineato.ok && disallineato.bersagli !== undefined ? '' : '');
if (disallineato.ok && disallineato.avvisi.some(a => a.codice === 'A13') &&
    disallineato.attacco.bersagli[0].rangeMod === -6) {
    passati++; console.log('  ✅ rangeMod=0 con banda 2 → riallineato a -6 con avviso');
} else { falliti++; console.log('  ❌ riallineamento gittata non avvenuto'); }

console.log('\n=== 4. Burst ===');
caso('Zero dadi assegnati', {
    attaccante: M._rosterProprio[0], azione: M.AZIONI.BS_ATTACK, arma: combi,
    bersagli: [{ id: 'p1', name: 'Fusilier Carlo', burst: 0, rangeIndex: 0, rangeMod: 3 }]
}, false, ['E20']);

caso('Più dadi del Burst dell arma', {
    attaccante: M._rosterProprio[0], azione: M.AZIONI.BS_ATTACK, arma: combi,
    bersagli: [{ id: 'p1', name: 'Fusilier Carlo', burst: 5, rangeIndex: 0, rangeMod: 3 }]
}, false, ['E21']);

const gregario = M.creaAttacco({
    attaccante: M._rosterProprio[1], azione: M.AZIONI.BS_ATTACK, arma: combi,
    burstDisponibile: 1,
    bersagli: [{ id: 'p1', name: 'Fusilier Carlo', burst: 1, rangeIndex: 0, rangeMod: 3 }]
});
if (gregario.ok) { passati++; console.log('  ✅ gregario coordinato a Burst 1 accettato'); }
else { falliti++; console.log('  ❌ gregario coordinato rifiutato'); }

console.log('\n=== 5. Attacco Guidato ===');
caso('Primario NON Bersagliato', {
    attaccante: M._rosterProprio[0], azione: M.AZIONI.GUIDATO,
    arma: { burst: 1, ammo: 'EXP', isTemplate: true, bands: [{ mod: 0, label: 'Guidato' }] },
    bersagli: [{ id: 'p1', name: 'Fusilier Carlo', burst: 1 }]
}, false, ['E15']);

caso('Primario Bersagliato', {
    attaccante: M._rosterProprio[0], azione: M.AZIONI.GUIDATO,
    arma: { burst: 1, ammo: 'EXP', isTemplate: true, bands: [{ mod: 0, label: 'Guidato' }] },
    bersagli: [{ id: 'p2', name: 'Bolt Dario', burst: 1 }]
}, true, []);

console.log('\n=== 6. Azioni difensive (segnaposto legittimo) ===');
const dif = M.creaAttacco({ attaccante: M._rosterProprio[0], azione: M.AZIONI.SCHIVATA, bersagli: [] });
if (dif.ok && dif.attacco.bersagli.length === 1 && dif.attacco.bersagli[0].id === 'all') {
    passati++; console.log('  ✅ Schivata senza bersagli → segnaposto "all" generato');
} else { falliti++; console.log('  ❌ Schivata: segnaposto non gestito'); }

console.log('\n=== 7. Errori di contratto ===');
caso('Azione inventata', { attaccante: M._rosterProprio[0], azione: 'ATTACCO LASER', bersagli: [] }, false, ['E01']);
caso('Attaccante non nel roster', {
    attaccante: 'Trooper Inesistente', azione: M.AZIONI.BS_ATTACK, arma: combi,
    bersagli: [{ id: 'p1', name: 'Fusilier Carlo', burst: 1, rangeIndex: 0, rangeMod: 3 }]
}, false, ['E03']);
caso('Arma non trovata nel database', {
    attaccante: M._rosterProprio[0], azione: M.AZIONI.BS_ATTACK,
    arma: { nonTrovata: true, nomeRichiesto: 'Combi Rifel', burst: 1, bands: [{ mod: 0, label: 'Auto' }] },
    bersagli: [{ id: 'p1', name: 'Fusilier Carlo', burst: 1, rangeIndex: 0, rangeMod: 0 }]
}, false, ['E08']);
caso('Stesso bersaglio due volte', {
    attaccante: M._rosterProprio[0], azione: M.AZIONI.BS_ATTACK, arma: combi,
    bersagli: [{ id: 'p1', name: 'Fusilier Carlo', burst: 1, rangeIndex: 0, rangeMod: 3 },
               { id: 'p1', name: 'Fusilier Carlo', burst: 2, rangeIndex: 0, rangeMod: 3 }]
}, false, ['E12']);

console.log('\n=== 8. Busta completa e blocco dell invio ===');
let spedito = null;
global.inviaCalcoloAllHub = (p) => { spedito = p; };
global.alert = () => {};

const okInvio = M.inviaCalcolo([{
    attaccante: M._rosterProprio[0], azione: M.AZIONI.BS_ATTACK, arma: combi,
    bersagli: [{ id: 'p1', name: 'Fusilier Carlo', burst: 3, rangeIndex: 1, rangeMod: -3 }]
}]);
if (okInvio && spedito && spedito.attacchi.length === 1) { passati++; console.log('  ✅ payload valido spedito'); }
else { falliti++; console.log('  ❌ payload valido NON spedito'); }

spedito = null;
const koInvio = M.inviaCalcolo([{
    attaccante: M._rosterProprio[0], azione: M.AZIONI.BS_ATTACK, arma: combi,
    bersagli: [{ id: 'generic1', name: 'Bersaglio Primario', burst: 3, rangeIndex: 0, rangeMod: 3 }]
}]);
if (!koInvio && spedito === null) { passati++; console.log('  ✅ payload col fantasma BLOCCATO, niente spedito'); }
else { falliti++; console.log('  ❌ il fantasma è passato!'); }

console.log('\n=== 9. Coerenza interna ===');
console.log('  autotest:', M.autotest().join(' | '));

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
