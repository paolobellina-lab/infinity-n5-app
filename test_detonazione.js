// @versione 2026-09-29.1 | test_detonazione.js | proprieta`: chat TEST
// ================================================================
// La detonazione di un Deployable e la Schivata di chi l'ha innescato.
// Si entra dall'ADATTATORE, non da M.risolviPayload: chiamando il motore
// direttamente il difetto di azioniDichiarate NON si vedeva, perché la
// busta arrivava già nella forma giusta. È la stessa lezione dei banchi
// sulle schermate — entrare dalla porta che usa il giocatore, non da
// quella più comoda, che è comoda proprio perché il dato lì è già pulito.
//
// E la busta di prova viene CATTURATA dal modulo di movimento dove si può:
// scritta a mano conteneva quello che credevo contenesse, e il campo
// mancante (chi fosse l'attiva) non si vedeva da nessuna delle due parti.
// ================================================================
let passati = 0, falliti = 0;
const ok = (c, m) => { if (c) { passati++; console.log('  ✅ ' + m); } else { falliti++; console.log('  ❌ ' + m); } };
const J = JSON.stringify;

global.window = global;
require('./catalogo_n5.js'); require('./database_comune.js');
require('./database_nomad.js'); require('./database_panoceania.js');
const M = require('./motore_regole_n5.js');
require('./calcolatore_math.js');

const T = [].concat(window.DB_NOMADI, window.DB_PANOCEANIA);
const U = (re, s) => Object.assign(JSON.parse(J(T.find(x => re.test(x.nome)))), { states: s || {} });
const alg = U(/^Alguacil \(Combi/), fus = U(/^Fusilier \(Combi/), zero = U(/^Zero \(E\/M Mine/);
window.gameState = { activeFaction: 'NOMADI', nomads: [alg, zero], panoceania: [fus] };

const token = (arma) => M.creaDeployable(zero, M.profiloArma(arma), { ordineId: 'o1' }).token;
const reazioneDi = (arma, bersaglio) => {
    const t = token(arma);
    return [{ nome: t.nome, azione: 'DETONAZIONE', arma: arma, bersaglio: (bersaglio || alg).nome, difensore: t }];
};
const sinistra = (busta, reazioni) => (window.generaRisoluzioneDaDati(busta, reazioni) || [])[0];

console.log('\n=== 1. La Schivata dichiarata, per le due strade ===');
// Il modulo Difesa la spedisce dentro `attacchi`; il modulo Movimento la
// dichiara in `azioniDichiarate` quando l'Ordine non ha tiri. Le due strade
// devono finire allo stesso posto — e provandone UNA sola, la seconda si
// sarebbe persa: è quello che è successo fino al 28 settembre.
const conDichiarate = sinistra(
    { attacchi: [], attivo: alg.nome, azioniDichiarate: ['MOVIMENTO', 'SCHIVATA'] }, reazioneDi('Shock Mine'));
ok(conDichiarate && /SCHIVATA/.test(conDichiarate.attivo.azione),
   `azioniDichiarate senza attacchi: ${conDichiarate && conDichiarate.attivo.azione} ${conDichiarate && conDichiarate.attivo.mod}`);
const conAttacco = sinistra(
    { attacchi: [{ attaccante: alg.nome, azione: 'SCHIVATA' }], attivo: alg.nome }, reazioneDi('Shock Mine'));
ok(conAttacco && /SCHIVATA/.test(conAttacco.attivo.azione),
   `la Schivata dentro attacchi: ${conAttacco && conAttacco.attivo.azione}`);
// Controprova: chi non l'ha dichiarata non la riceve. Senza, "SCHIVATA"
// potrebbe voler dire "il motore la presume sempre".
const senza = sinistra(
    { attacchi: [], attivo: alg.nome, azioniDichiarate: ['MOVIMENTO', 'MOVIMENTO'] }, reazioneDi('Shock Mine'));
ok(senza && /NESSUNA SCHIVATA/.test(senza.attivo.azione),
   `due movimenti: ${senza && senza.attivo.azione} — non si presume niente`);

console.log('\n=== 2. Il -3 viene dalla Sagoma, non dal deployable ===');
// Correzione di REGOLE del 28 settembre. I tre numeri insieme dicono DA DOVE
// viene il MOD: con la sola mina, un -3 dato a tutti i deployable sarebbe
// passato inosservato.
const schivataContro = (arma) => {
    const s = sinistra({ attacchi: [], attivo: alg.nome, azioniDichiarate: ['MOVIMENTO', 'SCHIVATA'] }, reazioneDi(arma));
    return s && s.attivo.mod;
};
ok(schivataContro('Shock Mine') === 7, `contro la mina (Sagoma): PH 10 -3 = ${schivataContro('Shock Mine')}`);
ok(schivataContro('CrazyKoalas') === 10, `contro il Koala: PH pieno = ${schivataContro('CrazyKoalas')}`);
const mad = M.profiloArma('MadTraps') ? schivataContro('MadTraps') : null;
ok(mad === null || mad === 10, `contro le MadTraps: PH pieno = ${mad}`);

console.log('\n=== 3. La munizione e la salvezza sono quelle del deployable ===');
// Nella vista del tabellone la salvezza è il testo che il giocatore legge:
// si guarda quello, non un campo interno, perché è quello che finisce sullo
// schermo. Un campo giusto e un testo sbagliato al tavolo sono la stessa cosa.
const testoSalvezza = (arma) => {
    const s = sinistra({ attacchi: [], attivo: alg.nome, azioniDichiarate: ['MOVIMENTO', 'SCHIVATA'] }, reazioneDi(arma));
    return String((s && s.attivo.salvezza) || '').replace(/<[^>]*>/g, ' ');
};
const tMina = testoSalvezza('Shock Mine'), tKoala = testoSalvezza('CrazyKoalas');
ok(/SHOCK/i.test(tMina), `la mina Shock impone una salvezza con la sua munizione (${tMina.trim().slice(0, 40)})`);
ok(/\d/.test(tMina), 'e con un numero da superare');
ok(tKoala !== tMina, 'il Koala ne impone una diversa: le note del deployable non sono generiche');

console.log('\n=== 4. Il token esce dal tavolo dopo l innesco ===');
const t = token('Shock Mine');
const esito = M.tokenDaRimuovere(t, 'INNESCO');
ok(esito.rimuovi === true, `mina innescata: si toglie (${J(esito.motivo || '')})`);
const koala = M.creaDeployable(zero, M.profiloArma('CrazyKoalas'), { ordineId: 'o1' }).token;
ok(M.tokenDaRimuovere(koala, 'INNESCO').rimuovi === true, 'il Koala innescato: si toglie');
ok(M.tokenDaRimuovere(t, 'FASE_STATI').rimuovi !== true,
   'controprova: alla Fase Stati NON si toglie — si toglie la Sagoma, non il token');

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
