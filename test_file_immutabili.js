// @versione 2026-10-10.1 | test_file_immutabili.js | proprieta`: chat TEST
// 2026-10-10.1: inchiodato cosa vuol dire `letti` nel ritorno di
//    verificaSorgenti (risposta di MOTORE, 10 ottobre): vuol dire CHIESTI, non
//    letti davvero. Un file che manca ci sta dentro, sia fuori per scelta sia
//    "non leggibile": se ne uscisse finirebbe anche in `nonLetti` e sarebbe
//    contato due volte. I file letti davvero sono quelli di `sorgenti`, con
//    l impronta. Tre prove nuove nella sezione 5: da 13 a 16.
//    ATTENZIONE, pagata scrivendole: `sorgenti` nel ritorno NON e` una copia,
//    e` la tabella viva del motore. Una seconda chiamata la cambia anche nel
//    risultato della prima: i campi si fotografano SUBITO dopo ogni chiamata.
// 2026-10-09.2: motore 2026-10-09.6, M.FONTI_FUORI_PROGETTO. Il regolamento che
//    MANCA non e` piu` un problema per verificaSorgenti: va nel campo
//    `fontiAssenti`. La sezione 5 pretendeva il contrario ed e` diventata rossa,
//    come doveva. Riscritta: assente = nessun problema + nominato in
//    fontiAssenti; controprova col vecchio Hub, che se manca RESTA un problema
//    e in fontiAssenti non ci va. Da 10 a 13 prove.
// 2026-10-09.1: REGOLE_N5_v5_1_1.txt non e` piu` nel Project. Senza il file le
//    tre prove che lo leggono (impronta, e le due del 'rotto apposta') sono NON
//    ESEGUITE: vedi il blocco FONTI FUORI DAL PROJECT. Il vecchio Hub invece
//    DEVE esserci: se manca resta un rosso. Con il regolamento in cartella il
//    banco e` quello di prima: 10 passati.
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
// ---------------------------------------------------------------------------
// FONTI FUORI DAL PROJECT — convenzione del 9 ottobre sera (chat TEST).
// I file della fonte (REGOLE_N5_v5_1_1.txt) non stanno piu` nel Project: Paolo
// li allega quando servono. Senza di loro le prove che li leggono non sono
// ROSSE (un rosso che e` lo stato normale smette di essere letto) e non sono
// VERDI (una prova che passa senza guardare niente e` peggio): sono NON
// ESEGUITE, contate a parte e nominate, una riga per prova e nel riepilogo:
//     N passati, 0 falliti, K non eseguite (fonte assente: ...)
// Tre guardie perche` "non eseguita" non diventi un posto dove nascondersi:
//  - vale SOLO per i file nominati qui, e solo se il file NON C'E`. Un file
//    presente ma illeggibile, o un altro file che manca, resta un rosso;
//  - eseguite + non eseguite deve fare PROVE_ATTESE: una prova che sparisce
//    senza essere dichiarata e` un rosso;
//  - con la fonte in cartella la riga di riepilogo e` quella di sempre.
let nonEseguite = 0; const fontiAssenti = [];
const fonteAssente = (file) => {
    const nome = String(file).split('/').pop();
    const manca = !require('fs').existsSync(file);
    if (manca && fontiAssenti.indexOf(nome) < 0) fontiAssenti.push(nome);
    return manca;
};
const nonEseguita = (m, n) => { nonEseguite += (n || 1); console.log('  ⏸ NON ESEGUITA (fonte assente: ' + fontiAssenti.join(', ') + '): ' + m); };
const rigaFinale = (attese) => {
    const viste = passati + falliti + nonEseguite;
    if (viste !== attese) { falliti++; console.log('  ❌ prove eseguite + non eseguite: ' + viste + ', attese ' + attese + ' — una prova e` sparita o ne e` nata una: se e` voluto, aggiorna PROVE_ATTESE'); }
    console.log('\n──────────────\n' + passati + ' passati, ' + falliti + ' falliti' +
        (nonEseguite ? ', ' + nonEseguite + ' non eseguite (fonte assente: ' + fontiAssenti.join(', ') + ')' : '') + '\n');
};
// ---------------------------------------------------------------------------
const PROVE_ATTESE = 16;
const REGOLAMENTO = 'REGOLE_N5_v5_1_1.txt';

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
    if (n === REGOLAMENTO && fonteAssente(n)) { nonEseguita(`${n}: impronta dichiarata ${IMM[n]}, da confrontare col file`); continue; }
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
    if (fontiAssenti.length) {
        // Senza il file, appendFileSync ne CREEREBBE uno di un carattere: la
        // verifica lo direbbe modificato, e la prova passerebbe su un falso.
        nonEseguita('la verifica segnala il regolamento modificato');
        nonEseguita('controprova: il vecchio Hub, intatto, non viene segnalato');
    } else {
    const rotto = problemi(await verificaIn(dir => fs.appendFileSync(path.join(dir, 'REGOLE_N5_v5_1_1.txt'), ' ')));
    ok(rotto.some(p => /REGOLE_N5_v5_1_1\.txt/.test(p) && /IMMUTABILE/.test(p)),
       'la verifica segnala il regolamento modificato');
    ok(!rotto.some(p => /calcolatore_math_ORIGINALE/.test(p)),
       'controprova: il vecchio Hub, intatto, non viene segnalato');
    }

    console.log('\n=== 5. Assente: il regolamento e` fuori per scelta, il vecchio Hub no ===');
    // Fino al motore .09.5 il regolamento che manca era un problema. Dal .09.6
    // sta in M.FONTI_FUORI_PROGETTO: assente non e` un problema, ma va DETTO
    // nel campo fontiAssenti — altrimenti 'nessun problema' non distingue
    // 'verificato' da 'non c era'. Questa sezione gira anche senza il file in
    // cartella: la cartella di prova la prepara lei.
    const togli = (n) => (dir) => { const f = path.join(dir, n); if (fs.existsSync(f)) fs.unlinkSync(f); };
    // In che stato sta un file nel ritorno: i quattro campi insieme. Si
    // FOTOGRAFA subito: `sorgenti` e` la tabella viva del motore, e la
    // chiamata dopo la riscrive anche dentro questo risultato. (La prima
    // stesura leggeva rAss dopo aver chiamato rHub: vedeva lo stato di rHub.)
    const HUB = 'calcolatore_math_ORIGINALE.js', J = JSON.stringify;
    const dove = (r, n) => ({ letti: (r.letti || []).indexOf(n) >= 0, sorgenti: !!(r.sorgenti && r.sorgenti[n]),
                              nonLetti: (r.nonLetti || []).indexOf(n) >= 0, fontiAssenti: (r.fontiAssenti || []).indexOf(n) >= 0 });
    const rAss = await verificaIn(togli(REGOLAMENTO));
    const fotoAssReg = dove(rAss, REGOLAMENTO), fotoAssHub = dove(rAss, HUB);
    const improntaHubLetta = (rAss.sorgenti && rAss.sorgenti[HUB] && rAss.sorgenti[HUB].impronta) || null;
    ok(!problemi(rAss).some(p => /REGOLE_N5_v5_1_1\.txt/.test(p)),
       `il regolamento che manca NON e` + ` un problema (${problemi(rAss).length} problemi)`);
    ok(Array.isArray(rAss.fontiAssenti) && rAss.fontiAssenti.length === 1 && rAss.fontiAssenti[0] === REGOLAMENTO,
       `ma e` + ` nominato in fontiAssenti (${JSON.stringify(rAss.fontiAssenti)})`);
    // CONTROPROVA: 'assente non e` un problema' vale SOLO per le fonti fuori
    // dal progetto. Un altro immutabile che manca deve restare un problema.
    const rHub = await verificaIn(togli(HUB));
    const fotoHub = dove(rHub, HUB);
    ok(problemi(rHub).some(p => p.indexOf(HUB) >= 0),
       `CONTROPROVA: il vecchio Hub che manca RESTA un problema (${JSON.stringify(problemi(rHub).filter(p => p.indexOf(HUB) >= 0)).slice(0, 90)})`);
    ok(Array.isArray(rHub.fontiAssenti) && rHub.fontiAssenti.indexOf(HUB) < 0,
       `e in fontiAssenti non ci va (${JSON.stringify(rHub.fontiAssenti)})`);

    // COSA VUOL DIRE `letti` (MOTORE, 10 ottobre): CHIESTI, non letti davvero.
    // Sondando il 9 ottobre sembrava un difetto: il regolamento che non c e`
    // stava fra i `letti`. Non lo e`: `nonLetti` e` attesi MENO letti, quindi
    // togliendolo da `letti` lo stesso file sarebbe contato due volte, una come
    // assente e una come non verificato. Chi vuole i file letti davvero guarda
    // `sorgenti`.
    ok(J(fotoAssReg) === J({ letti: true, sorgenti: false, nonLetti: false, fontiAssenti: true }),
       `regolamento assente: in letti (chiesto), NON in sorgenti, NON in nonLetti, in fontiAssenti — ${J(fotoAssReg)}`);
    ok(J(fotoHub) === J({ letti: true, sorgenti: false, nonLetti: false, fontiAssenti: false }),
       `vecchio Hub assente: in letti (chiesto), NON in sorgenti, NON in nonLetti, NON in fontiAssenti — ${J(fotoHub)}`);
    // CONTROPROVA: `sorgenti: false` vale solo se un file letto davvero ci sta,
    // con la sua impronta. Nella stessa cartella dove mancava il regolamento
    // il vecchio Hub c era.
    ok(J(fotoAssHub) === J({ letti: true, sorgenti: true, nonLetti: false, fontiAssenti: false }) && improntaHubLetta === IMM[HUB],
       `CONTROPROVA: il file che c e sta in letti E in sorgenti, con la sua impronta (${improntaHubLetta})`);

    rigaFinale(PROVE_ATTESE);
    process.exit(falliti ? 1 : 0);
})().catch(e => { console.log('  ❌ eccezione: ' + e.message); process.exit(1); });
