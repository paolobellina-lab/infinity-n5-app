// @versione 2026-09-23.1 | test_adattatore.js | proprieta`: chat TEST
// Test dell'adattatore calcolatore_math.js — node test_adattatore.js
global.window = global;
require('./catalogo_n5.js'); require('./database_comune.js');
require('./motore_regole_n5.js');
const M = window.MotoreN5;
require('./calcolatore_math.js');

let passati = 0, falliti = 0;
function ok(c, n, e) { if (c) { passati++; console.log(`  ✅ ${n}`); } else { falliti++; console.log(`  ❌ ${n}${e ? '\n       ' + e : ''}`); } }
const testo = (h) => String(h || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

const alg = { alias: 'Alguacil', bs: 11, cc: 13, ph: 10, wip: 12, arm: 1, bts: 0, skills: '', states: {}, combatGroup: 1 };
const fus = { alias: 'Fusilier', bs: 12, cc: 13, ph: 10, wip: 13, arm: 1, bts: 0, skills: '', states: {}, combatGroup: 1 };
const tag = { alias: 'Squalo', bs: 13, cc: 18, ph: 14, wip: 13, arm: 8, bts: 6, skills: '', states: {}, combatGroup: 1 };
const combi = M.profiloArma('Combi Rifle');

function prepara(aro) {
    window.gameState = { activeFaction: 'NOMADI', nomads: [alg], panoceania: [fus, tag] };
    window.latestAroData = aro || [];
}
function risolvi(bersagli, azione, arma) {
    return window.generaRisoluzioneDaDati({ attacchi: [{
        attaccante: 'Alguacil', azione: azione || M.AZIONI.BS_ATTACK,
        arma: arma || combi, bersagli: bersagli
    }] });
}

console.log('\n=== 1. La forma d uscita è invariata ===');
prepara([{ nome: 'Fusilier', azione: 'DODGE', hasLoF: true, burst: 1 }]);
const r = risolvi([{ name: 'Fusilier', burst: 3, rangeIndex: 2, rangeMod: -3, cover: true, ammo: 'N', terrain: 'NESSUNO' }]);
ok(Array.isArray(r) && r.length === 1, 'restituisce un array di scontri');
const s = r[0];
['titolo', 'attivo', 'reattivo'].forEach(k => ok(s[k] !== undefined, `campo "${k}" presente`));
['nome', 'fazione', 'azione', 'mod', 'burst', 'dettagliMod', 'salvezza'].forEach(k =>
    ok(s.attivo[k] !== undefined, `attivo.${k} presente`));
ok(s.reattivo.fazione === 'PANOCEANIA', 'la fazione reattiva è quella giusta');

console.log('\n=== 2. I numeri sono quelli del motore ===');
ok(s.titolo === 'TIRO FACCIA A FACCIA', 'Faccia a Faccia');
ok(s.attivo.mod === 5, `BS 11 -3 gittata -3 copertura = 5 (ottenuto ${s.attivo.mod})`);
ok(s.attivo.burst === 3 && s.reattivo.burst === 1, 'Burst 3 in attivo, 1 in ARO');
ok(s.reattivo.mod === 10, 'Schivata a PH 10');

console.log('\n=== 3. L HTML si costruisce dalle voci ===');
const d = testo(s.attivo.dettagliMod);
ok(d.includes('BS): 11'), 'la statistica base è mostrata');
ok(d.includes('Gittata') && d.includes('-3'), 'la gittata compare col suo valore');
ok(d.includes('Copertura'), 'la copertura compare');
// 🔴 `salvezza` ora mostra quella che la truppa DEVE superare; quella che
// INFLIGGE al bersaglio sta in `salvezzaInflitta`. Sono due numeri diversi,
// e prima l'interfaccia mostrava sotto ciascuno il numero dell'altro.
const sv = testo(s.attivo.salvezzaInflitta);
ok(sv.includes('11 o MENO'), 'il Tiro Salvezza mostra il valore');
ok(sv.includes('ARM 4 + PS 7'), 'e la scomposizione: ARM 1 +3 copertura, PS 7');

console.log('\n=== 4. I dati grezzi restano disponibili ===');
ok(Array.isArray(s.attivo.dati.voci), 'attivo.dati.voci è l elenco delle voci');
ok(s.attivo.dati.voci.every(v => v.fonte && v.motivo), 'ogni voce ha fonte e motivo');
ok(s.attivo.dati.salvezzaInflitta.valoreSuccesso === 11, 'il valore di salvezza è nei dati');
ok(typeof s.motivoConfronto === 'string', 'il motivo del confronto è esposto');

console.log('\n=== 5. Più bersagli, più scontri ===');
prepara([]);
const multi = risolvi([
    { name: 'Fusilier', burst: 2, rangeIndex: 1, rangeMod: 3, cover: false, ammo: 'N', terrain: 'NESSUNO' },
    { name: 'Squalo',   burst: 1, rangeIndex: 1, rangeMod: 3, cover: true,  ammo: 'N', terrain: 'NESSUNO' }
]);
ok(multi.length === 2, 'due bersagli, due scontri');
ok(multi[0].attivo.burst === 2 && multi[1].attivo.burst === 1, 'i dadi sono divisi come nel payload');
ok(multi.every(x => x.titolo === 'TIRO NORMALE'), 'senza ARO: Tiri Normali');

console.log('\n=== 6. LE CORREZIONI, dal vivo ===');
prepara([]);
const sagoma = risolvi([{ name: 'Fusilier', burst: 1, cover: true, ammo: 'N', terrain: 'NESSUNO' }],
                        M.AZIONI.BS_ATTACK, M.profiloArma('Chain Rifle'));
ok(sagoma[0].attivo.mod === 'Auto', 'Sagoma Diretta: colpo automatico');
ok(testo(sagoma[0].attivo.salvezzaInflitta).includes('8 o MENO'),
   'e chi è colpito NON ha il +3 di Copertura al Tiro Salvezza');

const k1 = risolvi([{ name: 'Squalo', burst: 1, rangeIndex: 1, rangeMod: 3, ammo: 'N', terrain: 'NESSUNO' }],
                    M.AZIONI.BS_ATTACK, M.profiloArma('K1 Combi Rifle'));
ok(testo(k1[0].attivo.salvezzaInflitta).includes('ARM 0'),
   'K1: ARM azzerato dal Weapon Chart, non dedotto dal nome dell arma');

const breaker = risolvi([{ name: 'Squalo', burst: 1, rangeIndex: 1, rangeMod: 3, ammo: 'AP', terrain: 'NESSUNO' }],
                         M.AZIONI.BS_ATTACK, M.profiloArma('Breaker Combi Rifle'));
ok(testo(breaker[0].attivo.salvezzaInflitta).includes('su BTS'),
   'Breaker: salvezza su BTS malgrado la munizione AP');

console.log('\n=== 7. IL FIRETEAM, che non arrivava mai al calcolo ===');
const algFT = Object.assign({}, alg, { states: { fireteam: 'A' }, combatGroup: 1 });
const gregari = [1, 2, 3].map(i => ({ alias: 'G' + i, combatGroup: 1, states: { fireteam: 'A' }, bs: 11 }));
window.gameState = { activeFaction: 'NOMADI', nomads: [algFT].concat(gregari), panoceania: [fus] };
window.latestAroData = [];
const ft = window.generaRisoluzioneDaDati({ attacchi: [{
    attaccante: 'Alguacil', azione: M.AZIONI.BS_ATTACK, arma: combi,
    bersagli: [{ name: 'Fusilier', burst: 3, rangeIndex: 1, rangeMod: 3, ammo: 'N', terrain: 'NESSUNO' }]
}] });
ok(ft[0].attivo.mod === 15, `Fireteam da 4: BS 11 +3 gittata +1 fireteam = 15 (ottenuto ${ft[0].attivo.mod})`);
ok(testo(ft[0].attivo.dettagliMod).includes('Fireteam'), 'e il bonus è spiegato');

console.log('\n=== 8. calcolaSalvezza: firma invariata ===');
ok(testo(window.calcolaSalvezza('N', 7, 1, 0, 10, false, fus, false, '')).includes('8 o MENO'),
   'ARM 1 + PS 7 = 8');
ok(testo(window.calcolaSalvezza('N', 7, 1, 0, 10, true, fus, false, '')).includes('11 o MENO'),
   'con Copertura: 11');
const hk = testo(window.calcolaSalvezza('DA', 7, 8, 6, 14, -6, tag, true, 'CARBONITE'));
ok(hk.includes('su BTS'), 'hacking: salvezza su BTS');
ok(hk.includes('16 o MENO'), 'BTS 6 +3 Firewall +7 PS = 16');
ok(hk.includes('2 Dadi'), 'Carbonite usa DA: due dadi');

console.log('\n=== 9. Il file è molto più piccolo ===');
// Si contano le righe di CODICE, non quelle totali: il file nuovo ha molti
// più commenti dell'originale — spiegano cosa è stato tolto e perché — e
// contarli come se fossero codice misura la cosa sbagliata.
function righeCodice(f) {
    return require('fs').readFileSync(f, 'utf8').split('\n')
        .filter(function (r) {
            const t = r.trim();
            return t && !t.startsWith('//') && !t.startsWith('*') && !t.startsWith('/*');
        }).length;
}
const cod = righeCodice('./calcolatore_math.js');
const codOrig = righeCodice('./calcolatore_math_ORIGINALE.js');
ok(cod < codOrig / 2,
   `codice: ${codOrig} righe -> ${cod} (il monolite di 358 righe non c è più)`);
const src = require('fs').readFileSync('./calcolatore_math.js', 'utf8');
['VIRAL', 'NANOTECH', 'BIOWEAPON', 'ADHESIVE'].forEach(function (m) {
    ok(!new RegExp('includes\\("' + m + '"\\)').test(src), `nessun ramo morto per ${m}`);
});
ok(!src.includes('-= 99') && !src.includes('- 99'), 'nessun -99 come segnaposto');
// il nome compare solo nel commento che documenta il bug rimosso:
// si controlla il CODICE, non il file intero.
const codice = src.split('\n').filter(r => !/^\s*\/\//.test(r)).join('\n');
ok(!codice.includes('window.currentOrder'),
   'il programma di hacking non viene più da window.currentOrder (resta solo il commento che lo documenta)');

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
