// @versione 2026-09-23.1 | test_file_intestazioni.js | proprieta`: chat TEST
// ================================================================
// Ogni banco deve potersi citare. Il 23 settembre INTERFACCIA ha contato che
// solo 12 dei 57 test avevano l'intestazione @versione: quando una chat
// scrive "il banco X dà verde" e un'altra ne ha una versione diversa, non c'è
// modo di accorgersene — è già successo tre volte in una settimana con i file
// normali. Questo banco tiene chiusa la convenzione: prima riga
//   // @versione AAAA-MM-GG.N | nomefile.js | proprieta`: chat TEST
// ================================================================
let passati = 0, falliti = 0;
const ok = (c, m) => { if (c) { passati++; console.log('  ✅ ' + m); } else { falliti++; console.log('  ❌ ' + m); } };
const fs = require('fs'), path = require('path');
const cartella = (process.env.CARTELLA || __dirname).replace(/\/?$/, '/');
const file = fs.readdirSync(cartella).filter(f => /^test_.*\.js$/.test(f)).sort();

console.log('\n=== 1. Tutti i banchi hanno l intestazione ===');
const riga = (f) => (fs.readFileSync(cartella + f, 'utf8').split('\n')[0] || '').trim();
const RE = /^\/\/ @versione (\d{4}-\d{2}-\d{2}\.\d+) \| ([^|]+) \| proprieta`: chat (\w+)$/;
const senza = file.filter(f => !RE.test(riga(f)));
ok(file.length > 0, `banchi trovati: ${file.length}`);
ok(senza.length === 0, `tutti con intestazione in prima riga (senza: ${senza.length}${senza.length ? ' — ' + senza.slice(0, 5).join(', ') : ''})`);

console.log('\n=== 2. L intestazione nomina il file giusto ===');
// Un'intestazione copiata da un altro file e` peggio di nessuna: dice il nome
// sbagliato e il controllo incrociato cita il file sbagliato.
const sbagliati = file.filter(f => { const m = riga(f).match(RE); return m && m[2].trim() !== f; });
ok(sbagliati.length === 0, 'il nome nell intestazione è quello del file (sbagliati: ' + sbagliati.length +
   (sbagliati.length ? ' — ' + sbagliati.slice(0, 5).join(', ') : '') + ')');

console.log('\n=== 3. E dichiara il proprietario ===');
const altri = file.filter(f => { const m = riga(f).match(RE); return m && m[3] !== 'TEST'; });
ok(altri.length === 0, `i banchi appartengono alla chat TEST (altri: ${altri.length}${altri.length ? ' — ' + altri.join(', ') : ''})`);

console.log('\n=== 4. Controprova: il controllo sa dire di no ===');
// Senza questa, un elenco vuoto non distingue "tutto a posto" da "non sto
// guardando niente".
ok(!RE.test('// niente intestazione'), 'una riga qualunque non passa per intestazione');
ok(!RE.test('// @versione 2026-09-23.1 | altro.js | proprieta`: chat TEST'.replace('@versione', '@version')),
   'una parola sbagliata nella chiave non passa');
ok(RE.test('// @versione 2026-09-23.1 | test_x.js | proprieta`: chat TEST'), 'e una riga giusta passa');

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
