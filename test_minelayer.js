// @versione 2026-09-22.1 | test_minelayer.js | proprieta`: chat TEST
// ================================================================
// Minelayer: piazzare un Deployable in fase di schieramento.
// Fonte: REGOLE_N5_v5_1_1.txt, voce MINELAYER (p.100) — due requisiti:
//   nessun nemico ne` Marker Mimetico nell'Area d'Innesco (o nella ZdC per
//   le Perimeter), e il punto dentro l'area in cui il Minelayer puo`
//   schierarsi. L'app non ha la mappa: i requisiti li conferma il giocatore.
// Motore 2026-09-22.1: M.opzioniMinelayer, M.piazzaConMinelayer,
// M.minelayerTiroFallito, window.faseSchieramento.minelayer.
// I profili si leggono dal database.
// ================================================================
let passati = 0, falliti = 0;
const ok = (c, m) => { if (c) { passati++; console.log('  ✅ ' + m); } else { falliti++; console.log('  ❌ ' + m); } };
const J = JSON.stringify;

global.window = global;
global.document = { title: 'NOMADS', getElementById: () => ({ style: {}, innerHTML: '' }), querySelectorAll: () => [], addEventListener(){} };
require('./catalogo_n5.js'); require('./database_comune.js');
require('./database_nomad.js'); require('./database_panoceania.js');
const M = require('./motore_regole_n5.js');
try { require('./fase_schieramento.js'); } catch (e) { /* verificato sotto */ }

const TUTTI = [...window.DB_NOMADI, ...window.DB_PANOCEANIA];
const profilo = (n) => { const u = TUTTI.find(x => x.nome === n); if (!u) throw new Error('assente: ' + n);
                         return Object.assign(JSON.parse(J(u)), { states: {} }); };
const SI = { nemiciNellArea: false, dentroZona: true };

console.log('\n=== 0. I profili hanno quello che il test presuppone ===');
const spektr = profilo('Spektr (Minelayer)'), firefly = profilo('Firefly (Minelayer)');
ok(/\bMinelayer\b/.test(spektr.skills) && /\bMinelayer\b/.test(firefly.skills), 'Spektr e Firefly: Minelayer nel database');
const fus = profilo('Fusilier (Combi Rifle)');
ok(!/Minelayer/.test(fus.skills || ''), 'controprova: il Fusilier non ha Minelayer');

console.log('\n=== 1. opzioniMinelayer ===');
const oS = M.opzioniMinelayer(spektr), oF = M.opzioniMinelayer(firefly);
const nomi = (o) => o.armi.map(a => a.nome).sort();
ok(J(nomi(oS)) === J(['E/M Mine', 'Shock Mine']), `Spektr: E/M Mine e Shock Mine (${J(nomi(oS))})`);
ok(J(nomi(oF)) === J(['AP Mine', 'Armed Turret']), `Firefly: AP Mine e Armed Turret (${J(nomi(oF))})`);
// La torretta e` un'arma "contenitore": per alias "Armed Turret (X)" diventa X,
// che non e` Deployable. Va riconosciuta dal nome prima dell'alias.
ok(oF.armi.some(a => a.nome === 'Armed Turret'), 'la torretta del Firefly e` riconosciuta, non persa dietro l alias');
ok(oS.pezzi === 1 && oS.restanti === 1, 'un pezzo, uno da piazzare');
ok(oS.domande.length === 2 && oS.requisiti.length === 2, 'con le due domande e i due requisiti');
ok(M.opzioniMinelayer(fus).ha === false, 'controprova: senza Minelayer, nessuna opzione');

console.log('\n=== 2. piazzaConMinelayer: i requisiti si confermano, o non si piazza ===');
const codici = (r) => (r.errori || []).map(e => e.codice).sort();
ok(J(codici(M.piazzaConMinelayer(spektr, 'E/M Mine', {}))) === J(['E54', 'E55']), 'senza conferme: E54 ed E55');
ok(J(codici(M.piazzaConMinelayer(spektr, 'E/M Mine', { dentroZona: true }))) === J(['E54']),
   'nemici nell area non negati: solo E54');
ok(J(codici(M.piazzaConMinelayer(spektr, 'E/M Mine', { nemiciNellArea: false }))) === J(['E55']),
   'fuori zona non negato: solo E55');
ok(M.piazzaConMinelayer(spektr, 'E/M Mine', { nemiciNellArea: true, dentroZona: true }).token === null,
   'un nemico nell area (risposta vera): niente token');

const r = M.piazzaConMinelayer(spektr, 'E/M Mine', SI);
ok(r.token && r.errori.length === 0, `requisiti confermati: token ${r.token && r.token.nome}`);
ok(r.token && r.token.schieratoDaMinelayer === true, 'marcato come schierato dal Minelayer');
ok(r.portatoreAggiornato.minelayerUsati === 1, 'il pezzo e` speso sul portatore aggiornato');
ok(!spektr.minelayerUsati, 'e il portatore passato non e` toccato');
ok(J(codici(M.piazzaConMinelayer(r.portatoreAggiornato, 'Shock Mine', SI))) === J(['E51']),
   'secondo pezzo oltre il limite: E51');

ok(codici(M.piazzaConMinelayer(spektr, 'Combi Rifle', SI)).includes('E52'), 'arma non Deployable: E52');
ok(codici(M.piazzaConMinelayer(fus, 'AP Mine', SI)).includes('E50'), 'truppa senza Minelayer: E50');

console.log('\n=== 3. Cosa vede l avversario ===');
const mina = r.token;
const torretta = M.piazzaConMinelayer(firefly, 'Armed Turret', SI).token;
const pub = (t) => M.rosterPubblico([t])[0] || {};
ok(mina && mina.isCamo === true && M.nomeUnita(pub(mina)) === 'SEGNALINO MIMETICO' && pub(mina).tipo === 'MARKER',
   'la mina arriva come segnalino mimetico');
ok(torretta && torretta.isCamo === false && pub(torretta).tipo !== 'MARKER' && /Armed Turret/.test(M.nomeUnita(pub(torretta))),
   `la torretta arriva a vista (${M.nomeUnita(pub(torretta))})`);

console.log('\n=== 4. Tiro di Schieramento Superiore fallito ===');
const f = M.minelayerTiroFallito(spektr, 'E/M Mine');
ok(f.portatoreAggiornato.usiSpesi && f.portatoreAggiornato.usiSpesi['E/M Mine'] === 1, 'Disposable: un uso scalato');
ok(/perde E\/M Mine/.test(f.nota) && /uso scalato/.test(f.nota), 'e la nota lo dice');
ok(!spektr.usiSpesi, 'il portatore passato non e` toccato');

console.log('\n=== 5. La fase di schieramento li espone ===');
const FS = (window.faseSchieramento || {}).minelayer || {};
ok(['opzioni', 'piazza', 'tiroFallito'].every(k => typeof FS[k] === 'function'),
   `faseSchieramento.minelayer: opzioni, piazza, tiroFallito (${J(Object.keys(FS))})`);
// Il contratto della fase: lavora per id sul window.roster, e sostituisce
// la truppa col portatore aggiornato E aggiunge il token al roster — che
// preparaPayloadHub pubblica: cosi` la mina arriva all'avversario col resto
// dello schieramento, senza un canale nuovo.
window.roster = [Object.assign({}, spektr, { id: 'sp1' }), Object.assign({}, firefly, { id: 'ff1' })];
ok(J(FS.opzioni('sp1')) === J(M.opzioniMinelayer(window.roster[0])), 'opzioni(id): delega al motore, stesso risultato');
ok(FS.opzioni('nessuno') === null, 'id inesistente: null, non un errore');
const lungPrima = window.roster.length;
const fp = FS.piazza('sp1', 'E/M Mine', SI);
ok(fp && fp.token && window.roster.length === lungPrima + 1 && window.roster[lungPrima] === fp.token,
   'piazza(id): il token entra nel roster, in coda');
ok(window.roster[0].minelayerUsati === 1, 'e la truppa nel roster e` il portatore aggiornato');
const lungDopo = window.roster.length;
ok(FS.piazza('sp1', 'Shock Mine', SI).token === null && window.roster.length === lungDopo,
   'secondo pezzo rifiutato: il roster non cambia');
FS.tiroFallito('ff1', 'AP Mine');
ok(window.roster[1].usiSpesi && window.roster[1].usiSpesi['AP Mine'] === 1, 'tiroFallito(id): l uso scalato sta nel roster');

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
