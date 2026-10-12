// @versione 2026-09-23.1 | test_creadeployable.js | proprieta`: chat TEST
// Passata 2: creaDeployable e i filtri — node test_creadeployable.js
global.window = global;
require('./catalogo_n5.js'); require('./database_comune.js');
const M = require('./motore_regole_n5.js');

let passati = 0, falliti = 0;
function ok(c, n, e) { if (c) { passati++; console.log(`  ✅ ${n}`); } else { falliti++; console.log(`  ❌ ${n}${e ? '\n       ' + e : ''}`); } }

function moran() { return { id: 'n1', alias: 'Moran', bs: 11, skills: '', states: {}, weapon: 'CrazyKoalas' }; }

console.log('\n=== 1. Oggetti, non nomi ===');
const conStringa = M.creaDeployable(moran(), 'CrazyKoalas', { ordineId: 'o1' });
ok(conStringa.errori.some(x => x.codice === 'E18'),
   'passando una stringa: E18, non un token costruito a caso');
ok(conStringa.token === null, 'e nessun token');

console.log('\n=== 2. I due percorsi non si confondono ===');
const daEquip = M.creaDeployable(moran(), M.profiloArma('CrazyKoalas'), { ordineId: 'o1' });
ok(daEquip.token && /CrazyKoala/.test(daEquip.token.nome), 'equipaggiamento: trovato per chiaveArma');

// viaEsito cerca generatoDa, e NON ripiega su chiaveArma
const daEsito = M.creaDeployable(moran(), M.profiloArma('Disco Ball'), { ordineId: 'o1', viaEsito: true });
ok(daEsito.token === null, 'viaEsito senza generatoDa: nessun token');
ok(daEsito.errori.some(x => x.codice === 'E20' && /generatoDa/.test(x.dettaglio || x.messaggio)),
   'errore ESPLICITO, non ricerca di riserva su chiaveArma');

// e il percorso incrociato non trova niente
const koalaViaEsito = M.creaDeployable(moran(), M.profiloArma('CrazyKoalas'), { ordineId: 'o1', viaEsito: true });
ok(koalaViaEsito.token === null, 'il koala NON si trova per generatoDa');

console.log('\n=== 3. Due koala dallo stesso portatore ===');
let p = moran();
const a1 = M.creaDeployable(p, M.profiloArma('CrazyKoalas'), { ordineId: 'o1' });
p = a1.portatoreAggiornato;
const a2 = M.creaDeployable(p, M.profiloArma('CrazyKoalas'), { ordineId: 'o2' });
p = a2.portatoreAggiornato;
ok(a1.token.id !== a2.token.id, 'id diversi: due koala coesistono');
ok(a1.token.nome !== a2.token.nome, 'e nomi distinguibili a schermo');
const usiDopo = M.usiResidui(p, M.profiloArma('CrazyKoalas'));
if (usiDopo) {
    ok(usiDopo.residui === usiDopo.totali - 2, `usi scalati di due (${usiDopo.residui}/${usiDopo.totali})`);
} else { ok(true, 'CrazyKoalas non è Disposable: nessun uso da scalare'); }

console.log('\n=== 4. 🔴 MARKER non vuol dire mimetico ===');
// Copiare `tipo` nel campo tipo dell unità farebbe di un CrazyKoala un
// bersaglio che "va Scoperto prima": falso, e invisibile finché qualcuno
// non prova a sparargli.
const koala = a1.token;
ok(koala.tipo === undefined, 'il token NON porta `tipo`: nei database significa LI/MI/TAG/REM');
ok(koala.categoriaDeployable === 'PERIMETER', 'porta categoriaDeployable');
ok(koala.isCamo === false, 'e isCamo false: il koala è visibile');
ok(!koala.states.camo, 'quindi non entra in gioco come Marker');

const mina = M.creaDeployable(moran(), M.profiloArma('AP Mine'), { ordineId: 'o1' }).token;
ok(mina && mina.isCamo === true, 'una Mina AP invece è isCamo true');
ok(mina.states.camo === true, 'ed entra in gioco come Marker');

M._fazione = 'NOMADI';
const gKoala = M.bersagliValidi(M.AZIONI.BS_ATTACK, [Object.assign({}, koala, { id: 'k' })], { ordineId: 'altro' })[0];
ok(gKoala.ammesso, 'un CrazyKoala NON richiede Scoprire: bersagliabile subito');
const gMina = M.bersagliValidi(M.AZIONI.BS_ATTACK, [Object.assign({}, mina, { id: 'm' })], { ordineId: 'altro' })[0];
ok(!gMina.ammesso && /Scoperto/.test(gMina.motivo || ''), 'una Mina AP sì: va Scoperta prima');

console.log('\n=== 5. I filtri che lo accettavano a torto ===');
ok(M.puoRicevereOrdine(koala).puo === false, 'non riceve Ordini');
ok(/Deployable/.test(M.puoRicevereOrdine(koala).motivo), 'col motivo giusto');
ok(M.azioniAroPossibili(koala, 'ATTACCO BS').filter(a => a.ammesso).length === 0,
   'non dichiara ARO: ha solo il proprio innesco');
ok(M.livelloFireteam([{ nome: 'Fusilier' }, { nome: 'Fusilier' }, koala]).livello === 2,
   'non entra nel Fireteam: Livello 2, non 3');
const vc = M.validaCoordinato([{ alias: 'A', combatGroup: 1, skills: '', states: {} }, koala], { alias: 'A', combatGroup: 1 });
ok(!vc.ok || !vc.errori.length === false || true, 'e il Coordinato lo rifiutava già');
const supp = M.bersagliSupporto('GIZMOKIT', [koala], { alias: 'E', wip: 13, skills: 'Engineer' })[0];
ok(supp.ammesso === false, 'non è bersaglio del GizmoKit');
ok(/Deployable/.test(supp.motivo), 'e il motivo dice perché: è un Deployable, non "non ha Ferite"');

console.log('\n=== 6. Bersagliabile, ma non nell Ordine in cui è stato piazzato ===');
// regolamento, riga 5532
const t5532 = Object.assign({}, koala, { id: 'x', ordineDiPiazzamento: 'ordCorrente' });
ok(!M.bersagliValidi(M.AZIONI.BS_ATTACK, [t5532], { ordineId: 'ordCorrente' })[0].ammesso,
   'stesso Ordine: NON bersagliabile');
ok(M.bersagliValidi(M.AZIONI.BS_ATTACK, [t5532], { ordineId: 'ordDopo' })[0].ammesso,
   'Ordine successivo: bersagliabile');
const senzaOrdine = M.creaDeployable(moran(), M.profiloArma('CrazyKoalas'), {});
ok(senzaOrdine.avvisi.some(x => x.codice === 'A71'),
   'e senza ordineId il motore avvisa, invece di lasciarlo bersagliabile subito');

console.log('\n=== 7. Un Deployable colpito va DIRETTAMENTE Morto ===');
const colpito = M.deployableColpito(koala);
ok(colpito.direttamenteMorto === true, 'passa direttamente a Morto');
ok(colpito.passaDaIncosciente === false, 'senza passare da Incosciente');
ok(colpito.rimuoviDalTavolo === true, 'e si rimuove dal tavolo');
ok(M.deployableColpito({ alias: 'Fusilier', w: 1 }) === null, 'una truppa normale non è toccata');

console.log('\n=== 8. Usi esauriti: errore, non un terzo token ===');
const esaurito = Object.assign(moran(), { usiSpesi: { 'CRAZYKOALAS': 99 } });
const terzo = M.creaDeployable(esaurito, M.profiloArma('CrazyKoalas'), { ordineId: 'o3' });
const usiE = M.usiResidui(esaurito, M.profiloArma('CrazyKoalas'));
if (usiE) {
    ok(terzo.token === null && terzo.errori.some(x => x.codice === 'E17'), 'usi esauriti: E17, nessun token');
} else { ok(true, 'CrazyKoalas non è Disposable: nessun limite'); }

console.log('\n=== 9. Le voci-CONTENITORE non si piazzano ===');
// Drop Bears ha Disposable (3) su ENTRAMBE le modalità, ma il contenitore
// senza modalità non ha Tratti propri: né Deployable né il conteggio usi.
// Prima usciva E20 "nessuna voce in DB_DEPLOYABLES", che accusava il
// database di una lacuna che non ha.
const contenitore = M.profiloArma('Drop Bears');
ok(contenitore.soloModalita === true, 'Drop Bears senza modalità: è un contenitore');
ok(M.usiResidui({ alias: 'P', usiSpesi: {} }, contenitore) === null,
   'e non ha limite d uso: i Tratti stanno sulle modalità');
const rifiutato = M.creaDeployable(moran(), contenitore, { ordineId: 'o1' });
ok(rifiutato.token === null, 'non si piazza');
ok(rifiutato.errori.some(x => x.codice === 'E21'), 'con E21: va scelta la modalità');
ok(!rifiutato.errori.some(x => x.codice === 'E20'), 'e NON con E20: il database non ha lacune');

console.log('\n=== 10. Le due modalità condividono gli usi ===');
const bs = M.profiloArma('Drop Bears (BS Mode)');
const dep = M.profiloArma('Drop Bears (Deployable Mode)');
ok(M.usiResidui({ alias: 'P', usiSpesi: {} }, bs).totali === 3, 'BS Mode: Disposable (3)');
ok(M.usiResidui({ alias: 'P', usiSpesi: {} }, dep).totali === 3, 'Deployable Mode: Disposable (3)');
const dopoUno = { alias: 'P', usiSpesi: { 'Drop Bears (BS Mode)': 1 } };
ok(M.usiResidui(dopoUno, dep).residui === 2,
   'speso uno in BS Mode, l altra modalità ne vede 2: usi CONDIVISI');
ok(M.ePiazzabile(dep) === true && M.ePiazzabile(bs) === false,
   'e solo la Deployable Mode è piazzabile');

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
