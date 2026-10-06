// @versione 2026-10-06.1 | test_collaudo_suite.js | proprieta`: chat TEST
// ================================================================
// Il banco che guarda gli altri banchi.
// Nasce dal 26 settembre: test_modulo_piazzamento.js cadeva con un
// TypeError e portava via 41 prove SENZA un solo rosso — il totale scendeva
// da 2466 a 2425 e chi leggeva "0 falliti" vedeva un progetto sano.
// È la forma peggiore della famiglia che inseguiamo: non un errore ingoiato,
// ma una prova che smette di esistere. Un rosso lo vedi; un file che tace no.
//
// Qui si esegue ogni test_*.js in un processo pulito e si pretendono tre
// cose: che esca, che stampi il riepilogo nel formato comune, e che il
// codice d'uscita concordi col numero di falliti.
// Il banco NON esegue se stesso: si escluderebbe a vicenda.
// ================================================================
let passati = 0, falliti = 0;
const ok = (c, m) => { if (c) { passati++; console.log('  ✅ ' + m); } else { falliti++; console.log('  ❌ ' + m); } };
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const DIR = (process.env.CARTELLA || __dirname).replace(/\/?$/, '/');
const IO = path.basename(__filename);

const banchi = fs.readdirSync(DIR).filter(f => /^test_.*\.js$/.test(f) && f !== IO).sort();
const RIEPILOGO = /(\d+) passati, (\d+) falliti/;

console.log('\n=== 1. Ogni banco arriva in fondo e dice come è andata ===');
const esiti = banchi.map(f => {
    // CARTELLA si passa ai figli (6 ottobre). Dieci banchi avevano
    // '/mnt/project/' scritto in fisso come cartella predefinita: appena il
    // progetto non e` montato la` muoiono all'avvio, e con loro se ne vanno
    // 205 prove senza un solo rosso. E` la ragione per cui questo banco
    // esiste: li ha trovati muti. Chi sa dove sono i file e` questo banco,
    // quindi e` lui a dirlo, invece di sperare che ogni figlio indovini.
    const r = spawnSync(process.execPath, [f],
        { cwd: DIR, encoding: 'utf8', timeout: 300000,
          env: Object.assign({}, process.env, { CARTELLA: DIR }) });
    const testo = (r.stdout || '') + (r.stderr || '');
    const m = testo.match(RIEPILOGO);
    return { f, uscita: r.status, passati: m ? +m[1] : null, falliti: m ? +m[2] : null,
             ultima: testo.trim().split('\n').slice(-1)[0] || '' };
});
ok(banchi.length > 50, `banchi eseguiti: ${banchi.length}`);
const muti = esiti.filter(e => e.passati === null);
ok(muti.length === 0,
   `tutti stampano il riepilogo (muti: ${muti.length}${muti.length ? ' — ' + muti.map(e => e.f + ' [' + e.ultima.slice(0, 60) + ']').join(' | ') : ''})`);

console.log('\n=== 2. Il codice d uscita concorda col riepilogo ===');
// Un banco che stampa "2 falliti" ed esce 0 mente a chi guarda solo l'uscita;
// uno che stampa "0 falliti" ed esce 1 fa il contrario.
const discordi = esiti.filter(e => e.falliti !== null && ((e.falliti > 0) !== (e.uscita !== 0)));
ok(discordi.length === 0,
   `nessuna discordanza fra uscita e falliti (${discordi.map(e => `${e.f}: ${e.falliti} falliti, uscita ${e.uscita}`).join(' | ') || 'nessuna'})`);

console.log('\n=== 3. Il totale è la somma, e nessun banco è vuoto ===');
const totale = esiti.reduce((a, e) => a + (e.passati || 0), 0);
const rossi = esiti.reduce((a, e) => a + (e.falliti || 0), 0);
ok(totale > 2000, `prove totali: ${totale} (rossi: ${rossi})`);
const vuoti = esiti.filter(e => e.passati === 0 && e.falliti === 0);
ok(vuoti.length === 0, `nessun banco esegue zero prove (${vuoti.map(e => e.f).join(', ') || 'nessuno'})`);

console.log('\n=== 4. Controprova: il controllo sa accorgersi di un banco muto ===');
// Senza, un elenco vuoto non distingue "tutti parlano" da "non sto
// ascoltando". Si crea un banco che cade come cadeva quello del piazzamento.
const finto = DIR + 'test__muto_di_prova.js';
fs.writeFileSync(finto, 'console.log("=== prova");\nnull.deployable;\n');
try {
    const r = spawnSync(process.execPath, [finto], { cwd: DIR, encoding: 'utf8' });
    const testo = (r.stdout || '') + (r.stderr || '');
    ok(!RIEPILOGO.test(testo), 'un banco che cade non stampa il riepilogo');
    ok(r.status !== 0, `e non esce con zero (${r.status})`);
} finally { fs.unlinkSync(finto); }

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
