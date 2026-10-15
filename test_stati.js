// @versione 2026-09-23.1 | test_stati.js | proprieta`: chat TEST
// Test di integrità Fireteam e stati — node test_stati.js
global.window = global;
require('./catalogo_n5.js'); require('./database_comune.js');
const M = require('./motore_regole_n5.js');

let passati = 0, falliti = 0;
function ok(c, n, e) { if (c) { passati++; console.log(`  ✅ ${n}`); } else { falliti++; console.log(`  ❌ ${n}${e ? '\n       ' + e : ''}`); } }
function u(st, dead) { return { alias: 'X', states: st || {}, state: dead ? 'DEAD' : 'ACTIVE', skills: '' }; }
function r(st, ev, dead) { return M.rotturaFireteam(u(st, dead), ev || {}); }

console.log('\n=== 1. LA CONTRADDIZIONE FRA I DUE FILE ===');
// fireteam.js: Soppressione sì, Immobilizzato no.  logica_stati.js: il contrario.
// Il regolamento dà ragione a fireteam.js su entrambi.
ok(r({ suppressive: true }).esce === true,
   'Fuoco di Soppressione: ESCE (logica_stati.js lo ometteva)');
ok(r({ immobilizedB: true }).esce === false,
   'Immobilizzato-B: RESTA (logica_stati.js lo faceva uscire)');
ok(r({ immobilizedA: true }).esce === false, 'Immobilizzato-A: RESTA');
ok(r({ immobilizedB: true }).note.length > 0,
   'e il motore spiega perché l Immobilizzato non rompe il Fireteam');

console.log('\n=== 2. Le cause automatiche ===');
ok(r({}).esce === false, 'unità normale: resta');
ok(r({ unconscious: true }).cause[0].causa === 'STATO_NULLO', 'Incosciente: Stato Nullo');
ok(r({}, {}, true).cause[0].causa === 'STATO_NULLO', 'Morto: Stato Nullo');
ok(r({ isolated: true }).cause[0].causa === 'ISOLATO', 'Isolato');
['camo', 'impersonation', 'holoecho', 'decoy'].forEach(function (k) {
    const st = {}; st[k] = true;
    ok(r(st).cause.some(c => c.causa === 'FORMA_MARKER'), `${k}: forma di Marker`);
});

console.log('\n=== 3. Le sei cause che NESSUNO dei due file aveva ===');
[['coerenzaRotta', 'COERENZA'], ['ordineIrregolare', 'ORDINE_IRREGOLARE'],
 ['ordineTenente', 'ORDINE_TENENTE'], ['impetuoso', 'IMPETUOSO'],
 ['cambioGruppo', 'CAMBIO_GRUPPO'], ['aroDiverso', 'ARO_DIVERSO']
].forEach(function (c) {
    const ev = {}; ev[c[0]] = true;
    const e = r({}, ev);
    ok(e.esce && e.cause.some(x => x.causa === c[1]), `${c[1].toLowerCase().replace(/_/g, ' ')}: fa uscire`);
});

console.log('\n=== 4. Ogni uscita è motivata, e dice come rientrare ===');
const e1 = r({ isolated: true });
ok(typeof e1.motivo === 'string' && e1.motivo.length > 0, 'il motivo è leggibile');
ok(/Coerenza/i.test(e1.rientro || ''), 'e la regola di rientro è allegata');

console.log('\n=== 5. Chi non può ENTRARE in un Fireteam ===');
ok(M.puoEntrareInFireteam({ alias: 'A', skills: '', states: {} }).puo === true, 'unità normale: può');
[['Infiltration', 'Infiltrazione'], ['Combat Jump', 'Schieramento Aereo'], ['Peripheral (Servant)', 'Periferica']]
    .forEach(function (c) {
        const e = M.puoEntrareInFireteam({ alias: 'A', skills: c[0], states: {} });
        ok(e.puo === false, `${c[1]}: non può entrare`);
    });
ok(M.puoEntrareInFireteam({ alias: 'A', skills: '', states: { camo: true } }).puo === false,
   'in forma di Marker: non può entrare');
ok(M.puoEntrareInFireteam({ alias: 'A', skills: '', states: { suppressive: true } }).puo === false,
   'in Fuoco di Soppressione: non può entrare');

console.log('\n=== 6. Cancellazione degli stati Marker ===');
['retreat', 'engaged', 'unconscious', 'dead'].forEach(function (k) {
    const st = { camo: true, holoecho: true, decoy: true }; st[k] = true;
    const c = M.cancellaStatiMarker(st);
    ok(c.cancellati.length === 3 && !st.camo && !st.holoecho && !st.decoy,
       `${k}: cancella gli stati Marker`);
});
// (il Prono e` uscito dagli stati il 23 settembre: qui serviva solo un flag
//  NON-Marker che deve sopravvivere, e la Soppressione lo e`.)
const intatto = M.cancellaStatiMarker({ camo: true, suppressive: true });
ok(intatto.cancellati.length === 0, 'senza Ritirata/Ingaggiato/Nulli: gli stati Marker restano');

console.log('\n=== 7. Compatibilità con i chiamanti esistenti ===');
require('./fireteam.js');
ok(window.fireteamManager.checkRottura({ unconscious: true }, false) === true,
   'checkRottura(stati, isDead): firma invariata');
ok(window.fireteamManager.checkRottura({}, true) === true, 'e riconosce il Morto');
ok(window.fireteamManager.checkRottura({ immobilizedB: true }, false) === false,
   'e ora dà la risposta giusta sull Immobilizzato');
ok(typeof window.fireteamManager.puoEntrare === 'function', 'puoEntrare aggiunta');

console.log('\n=== 8. Chi può ricevere un Ordine dal Pool ===');
function ord(st, dead) { return M.puoRicevereOrdine({ alias: 'X', states: st || {}, state: dead ? 'DEAD' : 'ACTIVE' }); }
ok(ord({}).puo === true, 'unità normale: può');
[['morto', {}, true], ['incosciente', { unconscious: true }],
 ['isolato', { isolated: true }], ['disconnesso', { disconnected: true }],
 ['posseduto', { possessed: true }], ['sepsitorizzato', { sepsitorized: true }]
].forEach(function (c) {
    const e = ord(c[1], c[2]);
    ok(e.puo === false && e.motivo, `${c[0]}: NON può, col motivo`);
});
// VERIFICATO wiki: "cannot be activated or receive Orders from their
// player's Order Pool" — frase identica su entrambe le pagine.
ok(/controllo avversario/i.test(ord({ possessed: true }).motivo),
   'Posseduto: il motivo dice che passa sotto controllo avversario');
ok(/Gruppo di Combattimento/i.test(ord({ sepsitorized: true }).motivo),
   'Sepsitorizzato: e che esce dal Gruppo di Combattimento');

const sop = ord({ suppressive: true });
ok(sop.puo === true && sop.annullaSoppressione === true,
   'in Soppressione: può, ma attivarlo annulla lo stato');
ok(typeof M.puoEssereAttivata === 'function', 'il nome storico resta come alias');

console.log('\n=== 9. Sepsitorizzato scioglie il Fireteam ===');
// Era marcato "nonUfficiale": la pagina wiki lo dice esplicitamente.
const sep = M.rotturaFireteam({ states: { sepsitorized: true } }, {});
ok(sep.esce === true && !sep.cause.some(c => c.nonUfficiale),
   'esce dal Fireteam, e non è più una deduzione');
ok(M.rotturaFireteam({ states: { possessed: true } }, {}).esce === true,
   'e così il Posseduto');

console.log('\n=== N. Categoria e nome stanno nel CATALOGO ===');
// Vivevano solo in M.NOMI_STATI dentro il motore: chi voleva raggruppare
// le etichette dipendeva da una struttura interna che non è un contratto.
const SC = window.CATALOGO_N5.STATI;
ok(Object.keys(SC).every(k => SC[k].categoria),
   `tutti gli ${Object.keys(SC).length} stati hanno una categoria`);
ok(Object.keys(SC).every(k => SC[k].nome), 'e tutti hanno un nome leggibile');
ok(Array.isArray(window.CATALOGO_N5.CATEGORIE_STATI),
   'CATEGORIE_STATI è a catalogo, con l ordine di visualizzazione');
ok(M.categorieStati()[0] === 'NULLO', 'la prima categoria è NULLO');
ok(Object.keys(SC).every(k => M.categorieStati().indexOf(SC[k].categoria) >= 0),
   'e ogni categoria usata è fra quelle dichiarate');

console.log('\n=== N+1. Gli stati raggruppati, nell ordine giusto ===');
const multi = { alias: 'X', states: { immobilizedA: true, targeted: true, engaged: true, suppressive: true } };
const gruppi = M.statiPerCategoria(multi);
ok(gruppi.length === 3, `tre categorie attive (trovate ${gruppi.length})`);
ok(gruppi[0].categoria === 'IMM', 'IMM prima');
ok(gruppi[1].categoria === 'INFOGUERRA', 'poi INFOGUERRA');
ok(gruppi[2].categoria === 'POSTURA', 'poi POSTURA');
ok(gruppi[2].stati.length === 2, 'e POSTURA ne raccoglie due');
ok(gruppi[0].stati[0].nome === 'Immobilizzato-A', 'coi nomi leggibili');
ok(M.statiPerCategoria({ alias: 'Y', states: {} }).length === 0,
   'un unità senza stati: nessun gruppo');

console.log('\n=== N+2. 🔴 Il default di gravitaAvviso è "azione" ===');
// Invertirlo sembrerebbe innocuo — gli avvisi già classificati
// continuerebbero a funzionare — ma ogni codice NUOVO sparirebbe in
// silenzio. L interfaccia si appoggia a questo contratto.
ok(M.gravitaAvviso('CODICE_MAI_VISTO') === 'azione',
   'un codice inventato dà "azione": disturba invece di nascondersi');
ok(M.gravitaAvviso('ZZ999') === 'azione', 'e vale per qualunque codice non classificato');
ok(M.gravitaAvviso('A47') === 'nota', 'mentre un codice dichiarato in AVVISI_NOTA dà "nota"');
ok(M.gravitaAvviso('A45') === 'azione', 'e uno che NON è fra le note resta "azione"');
ok(M.gravitaAvviso('') === 'azione' && M.gravitaAvviso(undefined) === 'azione',
   'anche un codice vuoto o assente: mai silenzioso per omissione');

console.log('\n=== N+3. M.ORDINE_CATEGORIE è una LETTURA, non una copia ===');
// Era undefined su M, e chi la cercava per nome si riscriveva la sequenza
// a mano — esattamente ciò che avere una fonte sola doveva evitare.
ok(Array.isArray(M.ORDINE_CATEGORIE), 'M.ORDINE_CATEGORIE esiste');
ok(JSON.stringify(M.ORDINE_CATEGORIE) === JSON.stringify(window.CATALOGO_N5.CATEGORIE_STATI),
   'e coincide col catalogo');
ok(JSON.stringify(M.ORDINE_CATEGORIE) === JSON.stringify(M.categorieStati()),
   'e con M.categorieStati()');

// 🔴 La prova che è una lettura e non una copia: se fosse un array fisso,
// aggiungere una categoria al catalogo non la cambierebbe.
window.CATALOGO_N5.CATEGORIE_STATI.push('PROVA_TEMPORANEA');
ok(M.ORDINE_CATEGORIE.indexOf('PROVA_TEMPORANEA') >= 0,
   'aggiungendo una categoria al catalogo, la vede subito: è un getter');
window.CATALOGO_N5.CATEGORIE_STATI.pop();
ok(M.ORDINE_CATEGORIE.indexOf('PROVA_TEMPORANEA') < 0, 'e togliendola, sparisce');

// e non si lascia sporcare da chi la legge
const copia = M.ORDINE_CATEGORIE;
copia.push('SPORCO');
ok(M.ORDINE_CATEGORIE.indexOf('SPORCO') < 0,
   'modificare l array restituito non tocca la fonte');

console.log('\n=== N+4. La sequenza esiste in UN posto solo ===');
// La costante interna del motore la ripeteva: identica oggi, divergente
// al primo che aggiunge una categoria da una parte sola.
const srcMotore = require('fs').readFileSync('./motore_regole_n5.js', 'utf8');
const ripetizioni = (srcMotore.match(/'NULLO',\s*'IMM',\s*'INFOGUERRA'/g) || []).length;
ok(ripetizioni <= 1,
   `la sequenza compare al massimo una volta nel motore, come ripiego (trovata ${ripetizioni} volte)`);

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
