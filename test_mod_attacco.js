// @versione 2026-09-23.1 | test_mod_attacco.js | proprieta`: chat TEST
// Test di modAttacco — node test_mod_attacco.js
global.window = global;
require('./catalogo_n5.js'); require('./database_comune.js');
const M = require('./motore_regole_n5.js');

let passati = 0, falliti = 0;
function ok(c, n, e) { if (c) { passati++; console.log(`  ✅ ${n}`); } else { falliti++; console.log(`  ❌ ${n}${e ? '\n       ' + e : ''}`); } }

const base     = { alias: 'Alguacil', bs: 11, cc: 13, ph: 10, wip: 12, skills: '', states: {} };
const msv1     = { alias: 'Lince',    bs: 12, cc: 13, ph: 10, wip: 12, skills: 'Multispectral Visor L1', states: {} };
const msv2     = { alias: 'Occhio',   bs: 12, cc: 13, ph: 10, wip: 12, skills: 'Multispectral Visor L2', states: {} };
const tiratore = { alias: 'Tiratore', bs: 13, cc: 13, ph: 10, wip: 12, skills: 'Marksmanship', states: {} };
const xvisor   = { alias: 'Visore',   bs: 12, cc: 13, ph: 10, wip: 12, skills: 'X-Visor', states: {} };

const nudo   = { alias: 'Fusilier', bs: 12, ph: 10, wip: 13, arm: 1, bts: 0, skills: '', states: {} };
const camo   = { alias: 'CamoMan',  bs: 12, ph: 10, wip: 13, arm: 1, bts: 0, skills: 'Mimetism (-3)', states: {} };
const camoTO = { alias: 'CamoTO',   bs: 12, ph: 10, wip: 13, arm: 1, bts: 0, skills: 'Mimetism (-6)', states: {} };

const combi = M.profiloArma('Combi Rifle');
const gren  = M.profiloArma('Grenades');
const chain = M.profiloArma('Chain Rifle');

function m(att, dif, arma, azione, ctx) { return M.modAttacco(att, dif, arma, azione || M.AZIONI.BS_ATTACK, ctx || {}); }

console.log('\n=== 1. Base e gittata ===');
ok(m(base, nudo, combi).valore === 11, 'senza MOD: BS 11');
ok(m(base, nudo, combi, null, { rangeIndex: 0 }).valore === 14, 'banda 0-8": +3');
ok(m(base, nudo, combi, null, { rangeIndex: 2 }).valore === 8, 'banda 16-24": -3');

console.log('\n=== 2. Copertura ===');
ok(m(base, nudo, combi, null, { cover: true }).valore === 8, 'bersaglio in Copertura: -3');
const mk = m(tiratore, nudo, combi, null, { cover: true });
ok(mk.valore === 13 && mk.note.some(n => n.includes('Marksmanship')), 'Marksmanship ignora il -3 di Copertura');

console.log('\n=== 3. IL BUG DELL HUB: i Multispectral Visor ===');
ok(m(base, camo, combi).valore === 8, 'senza visore: Mimetismo -3');
ok(m(base, camoTO, combi).valore === 5, 'contro Mimetism (-6): -6');
const conMsv2 = m(msv2, camo, combi);
ok(conMsv2.valore === 12 && conMsv2.note.some(n => n.includes('non si applica')),
   'MSV L2 annulla il Mimetismo (l Hub cerca la sigla "MSV" e non lo riconosceva)');
ok(m(msv2, camoTO, combi).valore === 12, 'MSV L2 annulla anche il -6');
ok(m(msv1, camo, combi).valore === 12, 'MSV L1 annulla un Mimetismo -3');
const l1su6 = m(msv1, camoTO, combi);
ok(l1su6.valore === 9 && l1su6.voci.some(v => v.fonte === 'mimetismo'),
   'MSV L1 riduce un -6 a -3, non lo annulla');

console.log('\n=== 4. X-Visor ===');
const xv = m(xvisor, nudo, combi, null, { rangeIndex: 2 });
ok(xv.valore === 12, 'X-Visor riduce il malus di gittata da -3 a 0');
ok(xv.voci.length === 0 && xv.note.some(n => n.includes('X-Visor')),
   'annullato del tutto: nessuna voce a zero, la spiegazione sta nelle note');
const xv6 = m(xvisor, nudo, M.profiloArma('Tactical Bow'), null, { rangeIndex: 2 });
ok(xv6.voci.some(v => v.motivo.includes('X-Visor')),
   'con un malus -6 l X-Visor lo riduce a -3 e compare fra le voci');
ok(m(xvisor, nudo, combi, null, { rangeIndex: 0 }).valore === 15,
   'ma non tocca un bonus di gittata');

console.log('\n=== 5. Le Granate tirano su PH ===');
const g = m(base, nudo, gren, M.AZIONI.SPECULATIVO, { rangeIndex: 0 });
ok(g.attributo === 'PH', 'Grenades: attributo PH dal Tratto, non BS');
ok(g.base === 10, 'usa il PH 10, non il BS 11');

console.log('\n=== 6. Stati ===');
ok(m(base, Object.assign({}, nudo, { states: { targeted: true } }), combi).valore === 14,
   'bersaglio Bersagliato: +3');
const sopp = { alias: 'S', bs: 12, ph: 10, arm: 1, skills: '', states: { suppressive: true } };
ok(m(base, sopp, combi).valore === 8, 'bersaglio in Soppressione: -3');
ok(m(base, sopp, combi, null, { distanzaPollici: 30 }).valore === 11,
   'ma oltre le 24" il -3 NON si applica (l Hub lo applicava sempre)');
ok(m(base, sopp, combi, null, { distanzaPollici: 12 }).valore === 8, 'entro le 24" sì');
ok(m(Object.assign({}, base, { states: { stunned: true } }), nudo, combi).valore === 8,
   'attaccante Stordito: -3');

console.log('\n=== 7. Sparare dentro una mischia ===');
ok(m(base, nudo, combi, null, { inMischia: true }).valore === 5, 'tiro in mischia: -6');
ok(m(base, nudo, combi, null, { reazione: { azione: 'CC_ATTACK' } }).valore === 5,
   'anche se dedotto dalla reazione in CC');

console.log('\n=== 8. Attacco Intuitivo: tiro NUDO ===');
const int1 = M.modAttacco(base, camoTO, chain, M.AZIONI.INTUITIVO, { cover: true, rangeIndex: 2 });
ok(int1.mod === 0 && int1.voci.length === 0, 'nessun MOD: né gittata, né copertura, né mimetismo');
ok(int1.valore === base.wip, 'tira sul WIP pieno');

console.log('\n=== 9. Sagoma Diretta: colpo automatico ===');
const dir = m(base, camoTO, chain, M.AZIONI.BS_ATTACK, { cover: true });
ok(dir.automatico === true && dir.valore === null, 'nessun tiro per colpire');
const imp = m(base, nudo, M.profiloArma('Missile Launcher (Blast Mode)'), M.AZIONI.BS_ATTACK, { rangeIndex: 0 });
ok(imp.automatico !== true && typeof imp.valore === 'number', 'ma una Sagoma a Impatto il tiro lo richiede');

console.log('\n=== 10. Limiti ===');
const estremo = m(base, camoTO, combi, null, { cover: true, rangeIndex: 2, inMischia: true });
ok(estremo.voci.some(v => v.fonte === 'limite'), 'MOD oltre -12: il limite scatta');
ok(estremo.mod === -12, 'MOD fermato a -12');
ok(estremo.impossibile === true, 'Valore di Successo sotto 1: fallimento automatico');
ok(estremo.valore < 1, 'e il valore NON viene portato a 1: sarebbe un tiro regalato');

console.log('\n=== 11. Ogni voce ha una spiegazione ===');
const det = m(msv1, camoTO, combi, null, { cover: true, rangeIndex: 2 });
ok(det.voci.every(v => v.motivo && v.fonte), 'tutte le voci hanno fonte e motivo');
console.log('   ' + det.voci.map(v => `${v.valore > 0 ? '+' : ''}${v.valore} ${v.fonte}`).join(', ') + ` → ${det.valore}`);

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
