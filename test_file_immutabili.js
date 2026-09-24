// @versione 2026-09-21.1 | test_file_immutabili.js | proprieta`: chat TEST
// ================================================================
// I file che nessuno deve toccare: calcolatore_math_ORIGINALE.js (il vecchio
// Hub, termine di paragone del banco) e REGOLE_N5_v5_1_1.txt (la fonte).
// Motore 2026-09-21.26: M.fileAttesi include sempre M.FILE_IMMUTABILI, e
// verificaSorgenti segnala un'impronta cambiata. Prima il controllo c'era
// ma non partiva da solo.
// Il test lo prova come conta: rompendo davvero il file, in una cartella a
// parte, e guardando che la verifica di default se ne accorga.
// ================================================================
let passati = 0, falliti = 0;
const ok = (c, m) => { if (c) { passati++; console.log('  ✅ ' + m); } else { falliti++; console.log('  ❌ ' + m); } };
const fs = require('fs'), path = require('path'), os = require('os');

global.window = global;
require('./catalogo_n5.js'); require('./database_comune.js');
const M = require('./motore_regole_n5.js');
const IMM = M.FILE_IMMUTABILI || {};
const nomi = Object.keys(IMM);

console.log('\n=== 1. I file immutabili sono fra quelli attesi ===');
ok(nomi.length >= 2, `FILE_IMMUTABILI dichiara ${nomi.length} file`);
ok(nomi.includes('REGOLE_N5_v5_1_1.txt') && nomi.includes('calcolatore_math_ORIGINALE.js'),
   'fra cui il regolamento e il vecchio Hub');
const attesi = M.fileAttesi();
ok(nomi.every(n => attesi.includes(n)), 'fileAttesi() li include tutti — relazione, non elenco');
ok(M.FILE_ATTESI.length === attesi.length, 'M.FILE_ATTESI e` lo stesso insieme (getter)');

console.log('\n=== 2. Le impronte dichiarate sono quelle dei file veri ===');
for (const n of nomi) {
    const vera = fs.existsSync(n) ? M.impronta(fs.readFileSync(n, 'utf8')) : null;
    ok(vera === IMM[n], `${n}: impronta dichiarata ${IMM[n]}, sul disco ${vera}`);
}

// Esegue verificaSorgenti in una cartella preparata apposta e restituisce
// i problemi che riguardano i file immutabili.
function verificaIn(prepara) {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'immutabili-'));
    for (const n of nomi) if (fs.existsSync(n)) fs.copyFileSync(n, path.join(dir, n));
    prepara(dir);
    const qui = process.cwd();
    process.chdir(dir);
    const log = console.log; console.log = () => {};          // verificaSorgenti e` loquace
    const fine = () => { process.chdir(qui); console.log = log; };
    return M.verificaSorgenti(nomi).then(r => { fine(); return r; }, e => { fine(); throw e; });
}
const problemi = (r) => ((r && (r.problemi || r)) || []).filter(p => typeof p === 'string');

(async () => {
    console.log('\n=== 3. Integri: nessun allarme ===');
    const integro = problemi(await verificaIn(() => {}));
    ok(!integro.some(p => /IMMUTABILE/.test(p)), `nessun "IMMUTABILE" sui file integri (${integro.length} problemi)`);

    console.log('\n=== 4. Rotto apposta: un carattere in piu` nel regolamento ===');
    const rotto = problemi(await verificaIn(dir => fs.appendFileSync(path.join(dir, 'REGOLE_N5_v5_1_1.txt'), ' ')));
    ok(rotto.some(p => /REGOLE_N5_v5_1_1\.txt/.test(p) && /IMMUTABILE/.test(p)),
       'la verifica segnala il regolamento modificato');
    ok(!rotto.some(p => /calcolatore_math_ORIGINALE/.test(p)),
       'controprova: il vecchio Hub, intatto, non viene segnalato');

    console.log('\n=== 5. Assente: dev\'essere un problema, non un silenzio ===');
    const assente = problemi(await verificaIn(dir => { const f = path.join(dir, 'REGOLE_N5_v5_1_1.txt'); if (fs.existsSync(f)) fs.unlinkSync(f); }));
    ok(assente.some(p => /REGOLE_N5_v5_1_1\.txt/.test(p)), 'il regolamento mancante e` segnalato');

    console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
    process.exit(falliti ? 1 : 0);
})().catch(e => { console.log('  ❌ eccezione: ' + e.message); process.exit(1); });
