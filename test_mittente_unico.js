// @versione 2026-09-25.1 | test_mittente_unico.js | proprieta`: chat TEST
// ================================================================
// Un posto solo che scrive i canali di setup.
// Il controllo che MOTORE ha chiesto, con le due avvertenze che ha dato:
//   - cercare anche le scritture per VARIABILE: il sesto produttore, in
//     ordine_difesa, non nominava il canale — passava dal mittente, che
//     allora spediva qualunque cosa ricevesse;
//   - cercare i nomi con ENTRAMBI gli apici: il residuo di inviaRispostaAro
//     era sfuggito perché la ricerca guardava solo quelli singoli, e lì
//     erano doppi. Il "38 -> 0" di allora era 40 -> 2.
// Il banco legge i sorgenti: è l'unico modo di dire "nessun altro punto",
// che eseguendo non si dimostra.
// ================================================================
let passati = 0, falliti = 0;
const ok = (c, m) => { if (c) { passati++; console.log('  ✅ ' + m); } else { falliti++; console.log('  ❌ ' + m); } };
const J = JSON.stringify, fs = require('fs'), path = require('path');
const DIR = (process.env.CARTELLA || __dirname).replace(/\/?$/, '/');

global.window = global;
require(DIR + 'catalogo_n5.js'); require(DIR + 'database_comune.js');
const M = require(DIR + 'motore_regole_n5.js');

const FILE = fs.readdirSync(DIR).filter(f => /\.js$/.test(f) && !/^test_|^banco_|ORIGINALE/.test(f));
const testo = (f) => fs.readFileSync(DIR + f, 'utf8');
const righe = (f) => testo(f).split('\n');
const SETUP = [M.CANALI.SETUP_NOMADI, M.CANALI.SETUP_PANOCEANIA];

console.log('\n=== 1. I nomi dei canali, con tutti e due gli apici ===');
const aMano = [];
// Il catalogo dei canali è l'unico posto dove i nomi DEVONO stare scritti:
// è la dichiarazione, non un uso. Escluderlo per nome, e non per contenuto,
// tiene il controllo onesto — se un domani qualcuno scrivesse un canale
// dentro il motore, questa prova lo vedrebbe.
const DICHIARAZIONE = 'motore_regole_n5.js';
FILE.forEach(f => righe(f).forEach((r, i) => {
    if (f === DICHIARAZIONE && /^\s*[A-Z_]+:\s*['"]/.test(r)) return;   // la riga della costante
    if (/^\s*(\/\/|\*)/.test(r)) return;                       // i commenti li citano, ed è giusto
    SETUP.forEach(c => {
        // Sia 'canale_setup_x' sia "canale_setup_x": la ricerca di MOTORE
        // guardava solo i primi, e un residuo era sopravvissuto.
        if (new RegExp(`['"\`]${c}['"\`]`).test(r)) aMano.push(`${f}:${i + 1}`);
    });
}));
ok(aMano.length === 0, `nessun file nomina un canale di setup a mano (${J(aMano)})`);
// Controprova: la ricerca sa trovare. Se questa cade, lo zero sopra non vale.
ok(new RegExp(`['"\`]${SETUP[0]}['"\`]`).test(`localStorage.setItem("${SETUP[0]}", x)`),
   'controprova: la ricerca trova sia gli apici doppi');
ok(new RegExp(`['"\`]${SETUP[0]}['"\`]`).test(`localStorage.setItem('${SETUP[0]}', x)`),
   'e quelli singoli');

console.log('\n=== 2. Chi scrive i canali, anche per variabile ===');
// Ogni setItem/ref().set con una chiave che NON è una costante letterale è un
// candidato: è la forma che il sesto produttore aveva.
const scrittori = [];
FILE.forEach(f => righe(f).forEach((r, i) => {
    if (/^\s*(\/\/|\*)/.test(r)) return;
    const m = r.match(/localStorage\.setItem\(\s*([^,]+),/);
    if (!m) return;
    const chiave = m[1].trim();
    const setupPerNome = SETUP.some(c => chiave.indexOf(c) >= 0);
    const perVariabile = /canaleSetup|CANALI\.SETUP|fazione/.test(chiave);
    if (setupPerNome || perVariabile) scrittori.push(`${f}:${i + 1} ${chiave.slice(0, 40)}`);
}));
ok(scrittori.length === 1, `un solo punto scrive i canali di setup (${J(scrittori)})`);
ok(scrittori.length === 1 && /motore_core\.js/.test(scrittori[0]),
   'ed è motore_core, dentro inviaSchieramentoAllHub');

console.log('\n=== 3. E i produttori passano dal mittente ===');
const chiamano = FILE.filter(f => /inviaSchieramentoAllHub\s*\(/.test(testo(f)) && !/^motore_core/.test(f));
ok(chiamano.length >= 3, `chi spedisce lo schieramento chiama il mittente: ${J(chiamano)}`);
// Nessuno di loro deve anche scrivere per conto proprio.
const doppiogioco = chiamano.filter(f => SETUP.some(c => new RegExp(`['"\`]${c}['"\`]`).test(testo(f))));
ok(doppiogioco.length === 0, `e nessuno di loro nomina il canale per conto suo (${J(doppiogioco)})`);

console.log('\n=== 4. La firma del mittente è una sola ===');
// Due firme diverse sarebbero due modi di chiamarlo, cioè due contratti: la
// vecchia (busta, fazione) va rifiutata, e infatti il motore la rifiuta —
// ma i chiamanti devono usare quella nuova.
const sbagliati = chiamano.filter(f => /inviaSchieramentoAllHub\(\s*\{/.test(testo(f)));
ok(sbagliati.length === 0, `nessuno usa la firma vecchia (busta, fazione) (${J(sbagliati)})`);

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
