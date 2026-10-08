// @versione 2026-10-08.2 | test_scoprire_attacco.js | proprieta`: chat TEST
// SCOPRIRE + ATTACCO BS: i tre campi nuovi — node test_scoprire_attacco.js
// .2 dell 8 ott: sezioni 10 (M.nonPiuMarker e M.scoprireSuperatoInPagina, con
//    l accordo fra schermata e scontro) e 11 (i due casi che erano aperti:
//    Coordinato a quattro, Scoprire + Piazzare col Marker che reagisce).
// .1 dell 8 ott: sezioni 7 (condizionatoDaScoprire, scoprirePoiPiazzare) e
//    8 (aroAtteso sulla busta vera di una seconda meta`).
// .2 (7 ott): sezione 0 girata su burstNonScritto (assente non e` zero) e
//    i bersagli si riconoscono per identita` OPPURE per id.
//
// Contratto dichiarato da MOTORE il 7 ottobre (motore 2026-10-07.9,
// righe 6817-6829 della sua numerazione). I tre campi nascono in
// M.risolviPayload quando la busta ha una voce SCOPRIRE con
// regole.poiAttacco true seguita da un ATTACCO BS:
//   scoprirePoiAttacco  sullo scontro dello Scoprire, SEMPRE
//   scoprireSuperato    sullo stesso, quando il Marker ha dichiarato un ARO
//                       oppure non e` piu` in forma di Marker
//   dopoScoprire        sullo scontro dell'Attacco, se il bersaglio della
//                       busta lo porta
// MOTORE li aveva misurati dalla pagina e sui tre dispositivi; restavano
// NON misurati il Marker che risponde con una SCHIVATA e
// l'Impersonation-2. Sono le sezioni 6 e 7.
//
// 🔴 TRE TRAPPOLE DI DATO, trovate scrivendo questo banco. Tutte e tre
// della stessa famiglia: un valore plausibile che fa sparire in silenzio
// quello che si stava provando.
//   1. (CHIUSA dal motore 2026-10-07.10, sezione 0.) Il bersaglio della voce
//      SCOPRIRE senza `burst` faceva sparire lo scontro: zero scontri,
//      nessun errore, l'azione non arrivava al tabellone. Ora lo scontro si
//      produce col Burst dell'arma e lo dichiara (burstNonScritto, un
//      avviso, una nota). Resta vero che burst 0 SCRITTO non produce lo
//      scontro: assente e zero sono due cose diverse.
//   2. Il livello dell'Impersonation viene da `deployState`, che deve
//      essere 'IMP-2'. Scrivendo deployState 'IMP' con
//      states.impersonation true, M.livelloImpersonation risponde NULL e
//      il cancello dell'Attacco rifiuta il Marker — sembra un difetto del
//      motore, ed e` il dato.
//   3. L'opzione di M.bersagliValidi si chiama `scoprireGiaDichiarato`,
//      non `regole`. Passando { regole: { poiAttacco: true } } non viene
//      letta e la voce SCOPRIRE su un bersaglio gia` rivelato risulta
//      rifiutata.

const CARTELLA = process.env.CARTELLA || __dirname;
const path = require('path');
global.window = global;
let passati = 0, falliti = 0;
function ok(c, n, e) {
    if (c) { passati++; console.log(`  ✅ ${n}`); }
    else { falliti++; console.log(`  ❌ ${n}${e !== undefined ? '\n       [visto: ' + JSON.stringify(e) + ']' : ''}`); }
}
const P = (f) => path.join(CARTELLA, f);
require(P('catalogo_n5.js'));
require(P('database_comune.js'));
const M = require(P('motore_regole_n5.js'));

// ------------------------------------------------------------------
// Il campo da gioco
// ------------------------------------------------------------------
const zero = { id: 'a1', alias: 'Zero', bs: 11, wip: 12, arm: 1, bts: 0, states: {}, weapon: 'Combi Rifle' };
const zeroMsv = { id: 'a2', alias: 'Zero MSV', bs: 11, wip: 13, arm: 1, bts: 0, states: {},
                  equip: 'Multispectral Visor L2', weapon: 'Combi Rifle' };
const spektr = { id: 'm1', alias: 'Spektr', tipo: 'LI', arm: 1, bts: 0, ph: 11,
                 deployState: 'CAMO', states: { camo: true }, skills: 'Camouflage' };
// 🔴 'IMP-2', non 'IMP': vedi la trappola 2 in testa al file.
const speculo = { id: 'm2', alias: 'Speculo', tipo: 'LI', arm: 1, bts: 0, ph: 11,
                  deployState: 'IMP-2', states: { impersonation: true } };
const fusilier = { id: 'p9', alias: 'Fusilier', tipo: 'LI', arm: 1, bts: 0, ph: 10, states: {} };
const combi = M.profiloArma('Combi Rifle');
const inCampo = [zero, zeroMsv, spektr, speculo, fusilier];
const trovaUnita = (n, id) => inCampo.find(u =>
    (id && String(u.id) === String(id)) ||
    M.nomeUnita(u).toUpperCase() === String(M.nomeUnita(n) || n).toUpperCase()) || null;

// La busta che la schermata manda: una voce SCOPRIRE con poiAttacco, poi
// l'ATTACCO BS col `scoprendo` e il bersaglio col `dopoScoprire`.
function bustaCombinata(att, marker, bersaglioAttacco, opz) {
    opz = opz || {};
    const b = { attacchi: [] };
    if (!opz.senzaVoceScoprire) {
        b.attacchi.push({
            attaccante: M.nomeUnita(att), attaccanteId: att.id,
            azione: M.AZIONI.SCOPRIRE, regole: { poiAttacco: true },
            // 🔴 burst: senza questo lo scontro non esiste (trappola 1).
            bersagli: [{ id: marker.id, name: M.nomeUnita(marker), burst: 1, rangeIndex: 0 }]
        });
    }
    const bers = { id: bersaglioAttacco.id, name: M.nomeUnita(bersaglioAttacco), burst: 3,
                   rangeIndex: 0, rangeMod: 3, cover: false, ammo: 'N' };
    if (opz.senzaDopoScoprire !== true) bers.dopoScoprire = true;
    if (opz.nonScoperto) bers.nonScoperto = true;
    b.attacchi.push({ attaccante: M.nomeUnita(att), attaccanteId: att.id,
                      azione: M.AZIONI.BS_ATTACK, arma: combi, scoprendo: marker.id, bersagli: [bers] });
    return b;
}
const risolvi = (b, reaz) => M.risolviPayload(b, reaz || [], { trovaUnita: trovaUnita }) || [];
// Letture che non cadono: se uno scontro mancasse, un accesso diretto
// ucciderebbe il banco invece di farlo diventare rosso.
const sc = (lista, i) => lista[i] || {};
const att = (s) => (s || {}).attivo || {};
const rea = (s) => (s || {}).reattivo || {};
const noteDi = (s) => ((s || {}).note || []).join(' | ').normalize('NFC');
const aroBs = (m) => [{ id: m.id, nome: M.nomeUnita(m), difensore: m, azione: 'BS_ATTACK',
                        arma: combi, burst: 1, rangeIndex: 0 }];
const aroSchivata = (m) => [{ id: m.id, nome: M.nomeUnita(m), difensore: m, azione: 'DODGE', burst: 1 }];

// ==================================================================
// 0. LA TRAPPOLA DEL BURST, fissata per prima
//   Non e` un capriccio: senza `burst` sul bersaglio dello Scoprire la
//   busta produce UN SOLO scontro invece di due, e lo Scoprire non arriva
//   mai al tabellone. Ho perso mezz'ora a credere che il motore non
//   producesse i campi nuovi. Se domani il motore smette di pretenderlo,
//   questa prova diventa rossa e si viene a sapere.
// ==================================================================
console.log('\n=== 0. Burst non scritto: lo scontro si produce, e lo DICE ===');
// GIRATA sul motore 2026-10-07.10. Il 7 ottobre avevo segnalato che un
// bersaglio senza `burst` faceva sparire lo scontro: zero scontri, nessun
// errore, e l'azione non arrivava al tabellone. Era la famiglia di difetti
// che inseguiamo — qualcosa prodotto che non raggiunge il suo lettore — e
// MOTORE l'ha chiusa: ora lo scontro si produce col Burst DELL'ARMA, e lo
// dichiara con un campo, un avviso e una nota.
// Resta la distinzione che conta: **burst 0 SCRITTO** vuol dire "a questo
// bersaglio non sono assegnati dadi", e quello scontro non si produce. Non
// scrivere il campo e scrivere zero sono due cose diverse — "assente non è
// vuoto", come per il Firewall e per gli alleati nella mischia.
const voceScoprire = (bers) => ({ attacchi: [{ attaccante: 'Zero', attaccanteId: 'a1',
    azione: M.AZIONI.SCOPRIRE, regole: { poiAttacco: true }, bersagli: [bers] }] });
for (const [et, bers] of [['non scritto', { id: 'm1', name: 'Spektr', rangeIndex: 0 }],
                          ['undefined', { id: 'm1', name: 'Spektr', burst: undefined, rangeIndex: 0 }],
                          ['null', { id: 'm1', name: 'Spektr', burst: null, rangeIndex: 0 }]]) {
    const lista = risolvi(voceScoprire(bers));
    ok(lista.length === 1, `burst ${et}: lo scontro si produce (${lista.length})`);
    ok(sc(lista, 0).burstNonScritto === true,
       `e lo scontro lo dichiara: burstNonScritto true (${JSON.stringify(sc(lista, 0).burstNonScritto)})`);
    ok(att(sc(lista, 0)).burst === 1,
       `calcolato col Burst dell arma, che per lo Scoprire è 1 (${att(sc(lista, 0)).burst})`);
}
// L'avviso e la nota: il campo da solo non si legge al tavolo.
const senzaB = risolvi(voceScoprire({ id: 'm1', name: 'Spektr', rangeIndex: 0 }));
const avvB = ((sc(senzaB, 0).avvisi || []).map(a => String(a.testo || a.messaggio || a)).join(' | ')).normalize('NFC');
ok(/Burst non scritto/.test(avvB) && /Spektr/.test(avvB),
   `un avviso che nomina il bersaglio (${avvB.slice(0, 60)}…)`);
ok(/Burst non scritto/.test(noteDi(sc(senzaB, 0))),
   'e la stessa cosa nelle note, dove il tabellone la legge');
ok((sc(senzaB, 0).avvisi || []).length === 1,
   `un avviso solo, non un diluvio (${(sc(senzaB, 0).avvisi || []).length})`);

// 🔴 LA DISTINZIONE: burst 0 SCRITTO non produce lo scontro.
const zeroScritto = risolvi(voceScoprire({ id: 'm1', name: 'Spektr', burst: 0, rangeIndex: 0 }));
ok(zeroScritto.length === 0,
   `burst 0 SCRITTO: nessuno scontro, perché a quel bersaglio non sono assegnati dadi (${zeroScritto.length})`);

// CONTROPROVA: col burst scritto per bene nessuna bandiera e nessun avviso.
// Senza questa, "burstNonScritto true" non si distingue da un campo sempre acceso.
const conBurst = risolvi(voceScoprire({ id: 'm1', name: 'Spektr', burst: 1, rangeIndex: 0 }));
ok(conBurst.length === 1 && sc(conBurst, 0).burstNonScritto === undefined,
   `CONTROPROVA: col burst scritto il campo NON c è (${JSON.stringify(sc(conBurst, 0).burstNonScritto)})`);
ok((sc(conBurst, 0).avvisi || []).length === 0,
   `e nessun avviso (${(sc(conBurst, 0).avvisi || []).length})`);
ok(sc(conBurst, 0).scoprirePoiAttacco === true,
   'e lo scontro porta scoprirePoiAttacco, come deve');

// ==================================================================
// 1. NESSUN ARO: due scontri, lo Scoprire si tira
// ==================================================================
console.log('\n=== 1. Nessun ARO: tira PRIMA lo Scoprire ===');
const c1 = risolvi(bustaCombinata(zero, spektr, spektr));
ok(c1.length === 2, `due scontri, Scoprire poi Attacco (${c1.length})`);
ok(att(sc(c1, 0)).azione === M.AZIONI.SCOPRIRE && att(sc(c1, 1)).azione === 'ATTACCO BS',
   `in quest ordine: ${att(sc(c1, 0)).azione} poi ${att(sc(c1, 1)).azione}`);
ok(sc(c1, 0).scoprirePoiAttacco === true, 'il primo porta scoprirePoiAttacco');
ok(sc(c1, 0).scoprireSuperato === undefined,
   `e NON scoprireSuperato: il Marker non ha reagito (${JSON.stringify(sc(c1, 0).scoprireSuperato)})`);
ok(sc(c1, 1).dopoScoprire === true, 'il secondo porta dopoScoprire');
ok(sc(c1, 1).scoprirePoiAttacco === undefined,
   'e NON scoprirePoiAttacco: i due campi stanno su scontri diversi');
// Lo Scoprire si TIRA: titolo, valore e dado veri.
ok(sc(c1, 0).titolo === 'TIRO NORMALE', `lo Scoprire è un tiro normale (${sc(c1, 0).titolo})`);
ok(att(sc(c1, 0)).mod === 15, `WIP 12 +3 di gittata = 15 (${JSON.stringify(att(sc(c1, 0)).mod)})`);
ok(att(sc(c1, 0)).burst === 1, `un dado (${att(sc(c1, 0)).burst})`);
ok((att(sc(c1, 0)).voci || []).length > 0,
   `e le voci del MOD ci sono: c è un tiro da spiegare (${(att(sc(c1, 0)).voci || []).length})`);
// Le note: la sequenza al tavolo, e il prezzo di sbagliarla.
ok(/tira PRIMA questo Scoprire/.test(noteDi(sc(c1, 0))),
   'la nota dice di tirare PRIMA lo Scoprire');
ok(/quell.Attacco è perso/.test(noteDi(sc(c1, 0))) && /non potrai ritentare/.test(noteDi(sc(c1, 0))),
   'e dice cosa si perde se fallisce: l Attacco, l Ordine, e il diritto di ritentare');
ok(/SOLO SE lo Scoprire contro Spektr è riuscito/.test(noteDi(sc(c1, 1))),
   `e sull Attacco la condizione (${noteDi(sc(c1, 1)).slice(0, 60)}…)`);

// ==================================================================
// 2. IL MARKER REAGISCE: lo Scoprire NON si tira
// ==================================================================
console.log('\n=== 2. Il Marker dichiara un ARO: NON SI TIRA ===');
const c2 = risolvi(bustaCombinata(zero, spektr, spektr), aroBs(spektr));
ok(c2.length === 2, `due scontri (${c2.length})`);
ok(sc(c2, 0).titolo === 'SCOPRIRE: NON SI TIRA',
   `il titolo lo dice (${sc(c2, 0).titolo})`);
ok(sc(c2, 0).scoprireSuperato === true, 'scoprireSuperato: true');
ok(sc(c2, 0).scoprirePoiAttacco === true, 'e scoprirePoiAttacco resta: i due campi convivono');
// 🔴 NON RESTA IL NUMERO. Il valore e le voci del MOD descrivevano un
// tiro che non c'e`: al tavolo si tirava.
ok(att(sc(c2, 0)).burst === 0, `Burst 0 (${att(sc(c2, 0)).burst})`);
ok(att(sc(c2, 0)).nonSiTira === true, 'nonSiTira: true');
ok(att(sc(c2, 0)).mod === 'Non si tira',
   `e al posto del numero c è la frase (${JSON.stringify(att(sc(c2, 0)).mod)})`);
ok((att(sc(c2, 0)).voci || []).length === 0,
   `nessuna voce del MOD: non c è niente da scomporre (${(att(sc(c2, 0)).voci || []).length})`);
ok((att(sc(c2, 0)).note || []).length === 0,
   `e nessuna nota generica sul tiro (${(att(sc(c2, 0)).note || []).length})`);
ok(/Spektr/.test(noteDi(sc(c2, 0))) && /si è rivelato da solo/.test(noteDi(sc(c2, 0))),
   `la nota dello scontro nomina chi si è rivelato (${noteDi(sc(c2, 0)).slice(0, 55)}…)`);
// LA REAZIONE NON VIENE CONSUMATA dallo Scoprire: va all'Attacco.
ok(rea(sc(c2, 0)).azione === 'Nessun ARO',
   `lo Scoprire NON si prende la reazione (${rea(sc(c2, 0)).azione})`);
ok(rea(sc(c2, 1)).azione === 'BS_ATTACK',
   `è l Attacco che se la trova davanti (${rea(sc(c2, 1)).azione})`);
ok(/è già rivelato/.test(noteDi(sc(c2, 1))),
   'e la nota dell Attacco dice che non deve aspettare altro');

// ==================================================================
// 3. SCOPRIRE AUTOMATICO: un'altra strada, e un altro campo
// ==================================================================
console.log('\n=== 3. Scoprire automatico (MSV L2): riesce da solo ===');
const c3 = risolvi(bustaCombinata(zeroMsv, spektr, spektr));
ok(c3.length === 2, `due scontri (${c3.length})`);
ok(sc(c3, 0).titolo === 'SUCCESSO AUTOMATICO',
   `il titolo è SUCCESSO AUTOMATICO, non NON SI TIRA (${sc(c3, 0).titolo})`);
ok(att(sc(c3, 0)).successoAutomatico === true, 'successoAutomatico: true');
// 🔴 LA DIFFERENZA CHE CONTA: `scoprireSuperato` NON si alza. Sono due
// ragioni diverse per non tirare — "si è rivelato lui" e "ci riesco da
// solo" — e il tabellone le distingue. Senza questa prova i due casi
// sarebbero indistinguibili.
ok(sc(c3, 0).scoprireSuperato === undefined,
   `ma scoprireSuperato NON si alza: non è il Marker a essersi rivelato (${JSON.stringify(sc(c3, 0).scoprireSuperato)})`);
ok(sc(c3, 0).scoprirePoiAttacco === true, 'scoprirePoiAttacco sì');
ok(att(sc(c3, 0)).mod === 'Auto' && att(sc(c3, 0)).burst === 0,
   `mod "Auto" e Burst 0 (${JSON.stringify(att(sc(c3, 0)).mod)}, ${att(sc(c3, 0)).burst})`);
ok(/riesce da solo, senza tiro/.test(noteDi(sc(c3, 0))),
   'la nota dice che riesce da solo');
ok(/è già rivelato/.test(noteDi(sc(c3, 1))),
   'e l Attacco si risolve senza aspettare: lo Scoprire è già andato');
// CONTROPROVA: lo stesso MSV L2 su un bersaglio NON in forma di Marker
// non ha niente da scoprire, quindi non e` questo caso.
ok(M.regoleScoprire(zeroMsv, spektr, {}).automatico === true &&
   M.regoleScoprire(zero, spektr, {}).automatico === false,
   'CONTROPROVA: è il visore a renderlo automatico, non la combinazione');

// ==================================================================
// 4. L'ATTACCO SU UN ALTRO BERSAGLIO
//   Si scopre il Marker e si spara a qualcun altro: l'Attacco non porta
//   dopoScoprire, e l'ARO del Marker esce a parte.
// ==================================================================
console.log('\n=== 4. Attacco su un ALTRO bersaglio ===');
const c4 = risolvi(bustaCombinata(zero, spektr, fusilier, { senzaDopoScoprire: true }), aroBs(spektr));
ok(c4.length === 3, `tre scontri: Scoprire, Attacco, e l ARO del Marker a sé (${c4.length})`);
ok(sc(c4, 0).scoprirePoiAttacco === true && sc(c4, 0).scoprireSuperato === true,
   'lo Scoprire non si tira: il Marker ha reagito');
ok(rea(sc(c4, 1)).nome === 'Fusilier',
   `il secondo scontro è contro l altro bersaglio (${rea(sc(c4, 1)).nome})`);
ok(sc(c4, 1).dopoScoprire === undefined,
   `e NON porta dopoScoprire: il bersaglio della busta non lo portava (${JSON.stringify(sc(c4, 1).dopoScoprire)})`);
ok(!/SOLO SE lo Scoprire/.test(noteDi(sc(c4, 1))) && !/è già rivelato/.test(noteDi(sc(c4, 1))),
   'né le note della catena: questo Attacco non c entra con lo Scoprire');
ok(att(sc(c4, 2)).nome === 'Spektr',
   `il terzo è il Marker che tira (${att(sc(c4, 2)).nome})`);
ok(/reagisce senza essere bersaglio/.test(noteDi(sc(c4, 2))),
   'con la nota che è un Tiro Normale a sé');

// ==================================================================
// 5. SCOPRIRE SENZA LINEA DI TIRO
//   La schermata non manda la voce SCOPRIRE, e il Marker arriva col
//   campo nonScoperto: i dadi su di lui sono persi.
// ==================================================================
console.log('\n=== 5. Senza Linea di Tiro: nessuna voce SCOPRIRE ===');
const c5 = risolvi(bustaCombinata(zero, spektr, spektr, { senzaVoceScoprire: true, nonScoperto: true }));
ok(c5.length === 1, `un solo scontro: la voce SCOPRIRE non c è (${c5.length})`);
ok(sc(c5, 0).scoprirePoiAttacco === undefined,
   'e nessuno porta scoprirePoiAttacco: senza la voce, nessuna catena');
ok(sc(c5, 0).dopoScoprire === true,
   'ma il bersaglio porta ancora dopoScoprire: l Attacco era dichiarato');
// E il requisito 'scoperto' fa il suo lavoro: dadi persi, e se e` il solo
// bersaglio l'Ordine diventa un Idle.
const reqSc = M.requisitiDichiarati(
    [{ id: 'm1', name: 'Spektr', burst: 3, lof: true, fuoriGittata: false, nonScoperto: true }],
    ['lof', 'gittata', 'scoperto']);
ok(reqSc.mancanti.length === 1 && /Marker resta Marker/.test(reqSc.motivo),
   `il requisito "scoperto" lo segnala (${reqSc.motivo.slice(0, 60)}…)`);
ok(reqSc.idle === true, 'ed essendo il solo bersaglio, l Ordine è un Idle');
// 🔴 ACCOPPIA PER IDENTITA` DELL'OGGETTO, non per id: M.bersagliConRequisiti
// cerca `x.bersaglio === t`. Passandogli una COPIA con gli stessi campi
// restituisce i bersagli INVARIATI, senza protestare — i dadi persi
// spariscono e il tabellone mostra un Burst pieno su un bersaglio che non
// si puo` colpire. Quindi la lista va passata la STESSA a entrambe le
// chiamate. Visto il 7 ottobre scrivendo questa prova.
const listaSc = [{ id: 'm1', name: 'Spektr', burst: 3, lof: true, fuoriGittata: false, nonScoperto: true }];
const reqStessa = M.requisitiDichiarati(listaSc, ['lof', 'gittata', 'scoperto']);
const conReqSc = M.bersagliConRequisiti(listaSc, reqStessa);
ok(conReqSc[0].burst === 0 && conReqSc[0].dadiPersi === 3,
   `e i tre dadi sul Marker sono persi (burst ${conReqSc[0].burst}, persi ${conReqSc[0].dadiPersi})`);
ok(/Marker resta Marker/.test(String(conReqSc[0].requisitoMancante)),
   `col motivo accanto al bersaglio (${String(conReqSc[0].requisitoMancante).slice(0, 50)}…)`);
// GIRATA sul motore 2026-10-07.10. Il 7 ottobre avevo segnalato che
// M.bersagliConRequisiti accoppiava i bersagli per IDENTITA` dell'oggetto
// (`x.bersaglio === t`): passandogli una copia coi medesimi campi
// restituiva tutto invariato, i dadi persi sparivano e il tabellone
// mostrava un Burst pieno su un bersaglio che non si puo` colpire.
// Chiuso: ora riconosce il bersaglio per identita` OPPURE per id.
const copia = [Object.assign({}, listaSc[0])];
const suCopia = M.bersagliConRequisiti(copia, reqStessa);
ok(suCopia[0].burst === 0 && suCopia[0].dadiPersi === 3,
   `su una COPIA con lo stesso id i dadi persi restano persi (burst ${suCopia[0].burst}, persi ${suCopia[0].dadiPersi})`);
ok(/Marker resta Marker/.test(String(suCopia[0].requisitoMancante)),
   'col motivo accanto, come sull oggetto originale');
// CONTROPROVA: un id DIVERSO non viene accoppiato. Senza questa, "riconosce
// per id" non si distingue da "applica a tutti quelli che gli passi".
const altroId = [Object.assign({}, listaSc[0], { id: 'UN-ALTRO-ID' })];
const suAltro = M.bersagliConRequisiti(altroId, reqStessa);
ok(suAltro[0].burst === 3 && suAltro[0].dadiPersi === undefined,
   `CONTROPROVA: con un id diverso non applica nulla (burst ${suAltro[0].burst})`);
// CONTROPROVA: lo stesso bersaglio SENZA nonScoperto non perde niente.
const reqOk = M.requisitiDichiarati(
    [{ id: 'm1', name: 'Spektr', burst: 3, lof: true, fuoriGittata: false }], ['lof', 'gittata', 'scoperto']);
ok(reqOk.mancanti.length === 0 && reqOk.idle === false,
   'CONTROPROVA: senza nonScoperto nessuna mancanza e nessun Idle');

// ==================================================================
// 6. IL MARKER CHE RISPONDE CON UNA SCHIVATA
//   Non misurato da nessuno, e non e` un dettaglio: una Schivata e` una
//   reazione come un attacco, quindi il Marker si rivela ugualmente — ma
//   l'Attacco diventa un FACCIA A FACCIA, non un Tiro Normale.
// ==================================================================
console.log('\n=== 6. Il Marker risponde con una SCHIVATA ===');
const c6 = risolvi(bustaCombinata(zero, spektr, spektr), aroSchivata(spektr));
ok(c6.length === 2, `due scontri (${c6.length})`);
ok(sc(c6, 0).titolo === 'SCOPRIRE: NON SI TIRA' && sc(c6, 0).scoprireSuperato === true,
   'una Schivata vale come reazione: lo Scoprire non si tira');
ok(att(sc(c6, 0)).burst === 0 && att(sc(c6, 0)).mod === 'Non si tira',
   'e lo scontro dello Scoprire è vuoto come con un attacco');
// LA DIFFERENZA con la sezione 2: lì il Marker sparava a un altro e i due
// tiri erano indipendenti; qui schiva PROPRIO questo Attacco.
ok(sc(c6, 1).titolo === 'TIRO FACCIA A FACCIA',
   `l Attacco diventa un FACCIA A FACCIA (${sc(c6, 1).titolo})`);
ok(String(rea(sc(c6, 1)).azione) === 'DODGE',
   `con la Schivata dall altra parte (${rea(sc(c6, 1)).azione})`);
ok(sc(c6, 1).dopoScoprire === true, 'e dopoScoprire c è ancora');
// CONTROPROVA: con l ARO di attacco su un altro bersaglio (sezione 2) il
// titolo era TIRO NORMALE. Le due reazioni portano a scontri diversi, e
// senza questo confronto "FACCIA A FACCIA" non si distingue da un titolo
// che il motore mette sempre.
ok(sc(c2, 1).titolo === 'TIRO NORMALE' && sc(c6, 1).titolo === 'TIRO FACCIA A FACCIA',
   `CONTROPROVA: lo stesso Attacco è NORMALE con un ARO altrove, FACCIA A FACCIA con una Schivata (${sc(c2, 1).titolo} / ${sc(c6, 1).titolo})`);

// ==================================================================
// 7. IMPERSONATION-2
//   Non misurato da nessuno. L'IMP-2 si comporta come il CAMO: lo
//   Scoprire riuscito lo porta a Modello, quindi l'Attacco della seconda
//   meta` e` ammesso. L'IMP-1 NO: uno Scoprire riuscito lo porta a IMP-2,
//   non a Modello (righe 14207, 14227-14229).
// ==================================================================
console.log('\n=== 7. Impersonation-2 ===');
// Premessa sul dato, perche` e` la trappola 2: senza 'IMP-2' nel
// deployState il livello e` NULL e tutto il resto crolla in silenzio.
ok(M.statoBersaglio(speculo).impLivello === 2,
   `premessa: deployState 'IMP-2' dà impLivello 2 (${JSON.stringify(M.statoBersaglio(speculo).impLivello)})`);
ok(M.statoBersaglio({ id: 'x', deployState: 'IMP', states: { impersonation: true } }).impLivello === null,
   "🔴 e deployState 'IMP' senza livello dà NULL: il livello sta nel deployState, non in un campo a parte");

const c7 = risolvi(bustaCombinata(zero, speculo, speculo));
ok(c7.length === 2, `nessun ARO: due scontri come col CAMO (${c7.length})`);
ok(sc(c7, 0).scoprirePoiAttacco === true && sc(c7, 0).titolo === 'TIRO NORMALE',
   'lo Scoprire si tira');
ok(sc(c7, 1).dopoScoprire === true && /SOLO SE lo Scoprire contro Speculo/.test(noteDi(sc(c7, 1))),
   'e l Attacco aspetta, col nome giusto nella nota');
const c7b = risolvi(bustaCombinata(zero, speculo, speculo), aroSchivata(speculo));
ok(sc(c7b, 0).scoprireSuperato === true && sc(c7b, 1).titolo === 'TIRO FACCIA A FACCIA',
   'e se reagisce si comporta come il CAMO: NON SI TIRA più Faccia a Faccia');

console.log('\n--- il cancello d invio: chi è ammesso come bersaglio dell Attacco ---');
// Il Marker si attacca SOLO se la voce porta `scoprendo` col suo id. E`
// l'unico caso in cui un Marker e` bersaglio di un Attacco BS.
const gate = (bers, scoprendo) => M.bersagliValidi(M.AZIONI.BS_ATTACK, [bers],
    scoprendo === undefined ? { attaccante: zero } : { attaccante: zero, scoprendo: scoprendo })[0];
ok(gate(spektr, 'm1').ammesso === true && gate(spektr, 'm1').dopoScoprire === true,
   'CAMO con scoprendo = suo id: ammesso, e il giudizio porta dopoScoprire');
ok(gate(speculo, 'm2').ammesso === true && gate(speculo, 'm2').dopoScoprire === true,
   'IMP-2 con scoprendo = suo id: ammesso anche lui');
// Tre controprove, perche` "ammesso" deve distinguersi da tre cose.
ok(gate(spektr, undefined).ammesso === false &&
   /va Scoperto prima/.test(String(gate(spektr, undefined).motivo)),
   'CONTROPROVA 1: senza scoprendo il CAMO torna a essere non attaccabile');
ok(gate(spektr, 'm2').ammesso === false,
   'CONTROPROVA 2: con lo scoprendo di un ALTRO Marker, no: l id deve essere il suo');
const imp1 = { id: 'm4', alias: 'Speculo-1', tipo: 'LI', deployState: 'IMP-1', states: { impersonation: true } };
ok(M.statoBersaglio(imp1).impLivello === 1, 'premessa: l IMP-1 ha livello 1');
ok(gate(imp1, 'm4').ammesso === false,
   'CONTROPROVA 3: l IMP-1 NON è ammesso — uno Scoprire riuscito lo porta a IMP-2, non a Modello');

console.log('\n--- e la voce SCOPRIRE resta valida su chi si è già rivelato ---');
// FIRMA: l'opzione si chiama `scoprireGiaDichiarato`, non `regole`
// (trappola 3). Serve perche` fra la dichiarazione e l'arrivo della busta
// il Marker puo` essersi rivelato: la voce non va rifiutata a posteriori.
const giaRivelato = { id: 'm1', alias: 'Spektr', tipo: 'LI', deployState: 'NORMAL', states: {} };
const senzaFlag = M.bersagliValidi(M.AZIONI.SCOPRIRE, [giaRivelato], { attaccante: zero })[0];
ok(senzaFlag.ammesso === false && /niente da Scoprire/.test(String(senzaFlag.motivo)),
   `senza il flag, Scoprire su un Modello è rifiutato (${String(senzaFlag.motivo).slice(0, 50)}…)`);
const conFlag = M.bersagliValidi(M.AZIONI.SCOPRIRE, [giaRivelato],
    { attaccante: zero, scoprireGiaDichiarato: true })[0];
ok(conFlag.ammesso === true,
   'con scoprireGiaDichiarato: true la voce resta valida — si era rivelato dopo la dichiarazione');
// CONTROPROVA: su un Marker vero il flag non serve, ed è ammesso comunque.
ok(M.bersagliValidi(M.AZIONI.SCOPRIRE, [spektr], { attaccante: zero })[0].ammesso === true,
   'CONTROPROVA: su un Marker vero è ammesso anche senza il flag');

// ==================================================================
// 7. SCOPRIRE + PIAZZARE: i due campi nuovi dell adattatore .4
//    (MOTORE, 8 ottobre: condizionatoDaScoprire e scoprirePoiPiazzare)
//
//   FIRMA, che la consegna non nomina e che ho dovuto tracciare: la voce
//   SCOPRIRE di un Ordine Scoprire + Piazzare porta
//   `regole.giaDichiarato`, NON `regole.poiAttacco`. Il motore entra nel
//   ramo solo se scoprireCombinato e` vero (riga 6552: poiAttacco OPPURE
//   giaDichiarato) e scoprirePoiAttacco e` falso (riga 6553): l unica via
//   e` giaDichiarato. Con poiAttacco si finisce nel ramo dell Attacco e
//   `scoprirePoiPiazzare` non si accende mai. Lo manda
//   ordine_piazzamento.js .7 alla riga 81.
//
//   Il piazzamento e` condizionato SOLO col Marker nell area d innesco
//   (ordine_piazzamento.js riga 364): quello e` il caso in cui il
//   segnalino resta sul tavolo solo se lo Scoprire e` riuscito.
// ==================================================================
console.log('\n=== 7. Scoprire + Piazzare: condizionatoDaScoprire e scoprirePoiPiazzare ===');
const J = JSON.stringify;
const NOTA_COND = 'PIAZZAMENTO CONDIZIONATO: il segnalino resta SOLO SE lo Scoprire e\` riuscito.';
function bustaPiazzare(opz) {
    opz = opz || {};
    const b = { attacchi: [] };
    b.attacchi.push({
        attaccante: M.nomeUnita(zero), attaccanteId: zero.id, azione: M.AZIONI.SCOPRIRE,
        regole: opz.conPoiAttacco ? { poiAttacco: true } : { giaDichiarato: true },
        bersagli: [{ id: spektr.id, name: M.nomeUnita(spektr), burst: 1, rangeIndex: 0 }]
    });
    b.attacchi.push({
        attaccante: M.nomeUnita(zero), attaccanteId: zero.id, azione: M.AZIONI.PIAZZA_DEPLOYABLE,
        regole: Object.assign({ senzaTiro: true },
            opz.senzaCondizione ? {} : { condizionatoDaScoprire: true, noteScontro: [NOTA_COND] }),
        bersagli: []
    });
    return b;
}
const pz = risolvi(bustaPiazzare());
ok(pz.length === 2, `la busta produce due scontri: lo Scoprire e il Piazzamento (${pz.length})`);
ok(att(sc(pz, 0)).azione === M.AZIONI.SCOPRIRE &&
   att(sc(pz, 1)).azione === M.AZIONI.PIAZZA_DEPLOYABLE,
   `e nell ordine giusto: prima lo Scoprire, poi il Piazzamento (${att(sc(pz, 0)).azione} / ${att(sc(pz, 1)).azione})`);
ok(sc(pz, 1).condizionatoDaScoprire === true,
   `lo scontro del Piazzamento porta condizionatoDaScoprire (${sc(pz, 1).condizionatoDaScoprire})`);
ok(/PIAZZAMENTO CONDIZIONATO/.test(noteDi(sc(pz, 1))),
   `con la nota A VISTA, in note e non nei dettagli chiusi (${noteDi(sc(pz, 1)).slice(0, 60)})`);
ok(sc(pz, 0).scoprirePoiPiazzare === true,
   `lo scontro dello Scoprire porta scoprirePoiPiazzare (${sc(pz, 0).scoprirePoiPiazzare})`);
ok(/SCOPRIRE \+ PIAZZARE: tira PRIMA questo Scoprire/.test(noteDi(sc(pz, 0))),
   `e dice di tirarlo per primo, col testo del motore (${noteDi(sc(pz, 0)).slice(0, 60)})`);
ok(/se fallisce, il segnalino non si piazza/i.test(noteDi(sc(pz, 0))),
   'e dice cosa succede se fallisce: il segnalino non si piazza');

// CONTROPROVA 1: senza la condizione nelle regole nessuno dei due campi
// compare. E non compare come `false`: ASSENTE NON E` FALSO, altrimenti il
// tabellone non distingue "non condizionato" da "non chiesto".
const pzLibero = risolvi(bustaPiazzare({ senzaCondizione: true }));
ok(sc(pzLibero, 1).condizionatoDaScoprire === undefined,
   `CONTROPROVA: piazzamento non condizionato, il campo non c e` + ` — e non e\` false (${J(sc(pzLibero, 1).condizionatoDaScoprire)})`);
ok(sc(pzLibero, 0).scoprirePoiPiazzare === undefined,
   `e nemmeno sullo Scoprire (${J(sc(pzLibero, 0).scoprirePoiPiazzare)})`);
ok(!/PIAZZAMENTO CONDIZIONATO|tira PRIMA questo Scoprire/.test(noteDi(sc(pzLibero, 0)) + noteDi(sc(pzLibero, 1))),
   'e nessuna delle due note compare');

// CONTROPROVA 2: con `poiAttacco` al posto di `giaDichiarato` si e` nell
// Ordine Scoprire + Attacco: scoprirePoiPiazzare NON si accende, e si
// accende scoprirePoiAttacco. Senza questa, le due prove sopra non
// distinguono i due Ordini — passerebbero per il campo sbagliato.
const pzAttacco = risolvi(bustaPiazzare({ conPoiAttacco: true }));
ok(sc(pzAttacco, 0).scoprirePoiPiazzare === undefined && sc(pzAttacco, 0).scoprirePoiAttacco === true,
   `CONTROPROVA: con poiAttacco e` + ` l Ordine Scoprire + Attacco (poiPiazzare: ${J(sc(pzAttacco, 0).scoprirePoiPiazzare)}, poiAttacco: ${J(sc(pzAttacco, 0).scoprirePoiAttacco)})`);
ok(!/SCOPRIRE \+ PIAZZARE/.test(noteDi(sc(pzAttacco, 0))),
   'e la nota del piazzamento non compare su un Ordine che piazza niente');

// ==================================================================
// 8. aroAtteso attraverso creaPayload, nella forma che manda la schermata
//    (MOTORE, 8 ottobre). Il banco di MOTORE prova la funzione con una
//    busta vuota; qui si prova la busta VERA di una seconda meta`, che e`
//    il caso che ha fatto rovesciare la decisione del 6 ottobre.
//    Senza questo, "la funzione e` giusta" e "la busta che parte e`
//    giusta" non sono la stessa prova.
// ==================================================================
console.log('\n=== 8. aroAtteso sulla busta vera di una seconda meta` ===');
const vociSeconda = [{
    attaccante: M.nomeUnita(zero), attaccanteId: zero.id, azione: M.AZIONI.BS_ATTACK,
    arma: combi, bersagli: [{ id: fusilier.id, name: M.nomeUnita(fusilier), burst: 3, rangeIndex: 0 }]
}];
const bustaDi = (ordine, allarmato, opz) => {
    window.currentOrder = ordine; window._ordineAllarmato = allarmato;
    const e = M.creaPayload(vociSeconda, opz || {});
    return e && e.payload ? e.payload : {};
};
ok(bustaDi({ id: 'ord_A' }, 'ord_A').aroAtteso === true,
   `allarme partito per QUESTO Ordine: la busta dell Attacco porta aroAtteso true (${bustaDi({ id: 'ord_A' }, 'ord_A').aroAtteso})`);
ok(bustaDi({ id: 'ord_B' }, 'ord_A').aroAtteso === false,
   `CONTROPROVA: l allarme era di un Ordine PRIMA, false (${bustaDi({ id: 'ord_B' }, 'ord_A').aroAtteso})`);
ok(bustaDi({}, 'ord_A').aroAtteso === false,
   `CONTROPROVA: Ordine senza identificativo, false come prima (${bustaDi({}, 'ord_A').aroAtteso})`);
ok(bustaDi({ id: 'ord_C' }, null).aroAtteso === false,
   `CONTROPROVA: nessun allarme mai partito, false (${bustaDi({ id: 'ord_C' }, null).aroAtteso})`);
ok(bustaDi({ id: 'ord_D' }, 'ord_A', { aroAtteso: true }).aroAtteso === true,
   'e un aroAtteso true scritto dal modulo resta valido, qualunque sia l allarme');
// La busta porta gli attacchi veri: se li perdesse, le quattro prove sopra
// sarebbero sulla busta vuota del banco di MOTORE, non su questa.
ok((bustaDi({ id: 'ord_E' }, 'ord_E').attacchi || []).length === 1,
   `e la busta misurata porta davvero l Attacco, non e` + ` vuota (${(bustaDi({ id: 'ord_E' }, 'ord_E').attacchi || []).length} attacchi)`);
window.currentOrder = null; window._ordineAllarmato = null;

// ==================================================================
// 9. IL LIMITE E31 CONTA LE TRUPPE, NON LE VOCI
//    (MOTORE, 8 ottobre, punto 3. Riga 655 del motore.)
//
//   In SCOPRIRE + ATTACCO ogni partecipante porta DUE voci: lo Scoprire e
//   l Attacco. Contando le voci, tre partecipanti "erano" sei e l invio si
//   bloccava con E31. Nessun banco nominava E31 prima di questa sezione:
//   il limite si poteva rompere in entrambi i versi senza che niente
//   diventasse rosso.
//
//   I due versi contano:
//   - troppo severo: tre partecipanti (sei voci) rifiutati -> al tavolo
//     l Ordine non parte e il giocatore non sa perche`;
//   - troppo largo: cinque partecipanti accettati -> si gioca un Ordine
//     che il regolamento non permette.
// ==================================================================
console.log('\n=== 9. Il limite E31 del Coordinato conta le truppe, non le voci ===');
const unitaCoord = (n) => Array.from({ length: n }, (_, i) =>
    ({ id: 'c' + i, alias: 'Alg' + i, bs: 11, wip: 12, ph: 10, arm: 1, bts: 0, states: {}, weapon: 'Combi Rifle' }));
// Ogni partecipante porta due voci: lo Scoprire sul Marker e l Attacco.
function bustaCoord(n, opz) {
    opz = opz || {};
    const voci = [];
    unitaCoord(n).forEach(u => {
        voci.push({ attaccante: u, attaccanteId: u.id, azione: M.AZIONI.SCOPRIRE,
                    regole: { poiAttacco: true },
                    bersagli: [{ id: spektr.id, name: M.nomeUnita(spektr), burst: 1, rangeIndex: 0 }] });
        if (!opz.unaVoceSola) {
            voci.push({ attaccante: u, attaccanteId: u.id, azione: M.AZIONI.BS_ATTACK, arma: combi,
                        scoprendo: spektr.id,
                        bersagli: [{ id: spektr.id, name: M.nomeUnita(spektr), burst: 1, rangeIndex: 0, dopoScoprire: true }] });
        }
    });
    window.currentOrder = { id: 'coord_' + n }; window._ordineAllarmato = null;
    // Senza un tavolo schierato la busta esce piena di E05 ("nessuna unita`
    // nemica"), e le prove sotto leggerebbero E31 dentro un rumore che non
    // c entra: con il tavolo, l elenco degli errori e` vuoto oppure e` solo
    // E31, e si vede a occhio quale dei due. Si usano gli appigli dichiarati
    // dal motore (M._rosterProprio / M._rosterNemico, righe 185 e 196),
    // non il gameState, che qui dentro il motore non legge.
    M._rosterProprio = unitaCoord(n); M._rosterNemico = [spektr];
    return M.creaPayload(voci, { isCoordinated: true });
}
const erroriDi = (e) => (e && Array.isArray(e.errori) ? e.errori : []).map(x => String((x && x.codice) || x));
const e31Di = (e) => erroriDi(e).filter(c => /E31/.test(c)).length;
const msgE31 = (e) => String((((e || {}).errori) || []).map(x => (x && x.messaggio) || '').join(' ')).normalize('NFC');

const coord3 = bustaCoord(3);
ok((coord3.payload ? coord3.payload.attacchi : []).length === 6,
   `tre partecipanti con Scoprire + Attacco fanno SEI voci (${(coord3.payload ? coord3.payload.attacchi : []).length})`);
ok(e31Di(coord3) === 0,
   `e NON scatta E31: il limite conta le tre truppe, non le sei voci (errori: ${J(erroriDi(coord3))})`);
const coord4 = bustaCoord(4);
ok(e31Di(coord4) === 0,
   `quattro partecipanti (otto voci) restano ammessi: quattro e` + ` il massimo (errori: ${J(erroriDi(coord4))})`);
// CONTROPROVA: alla quinta truppa E31 scatta. Senza questa, "non scatta
// mai" e "conta le truppe" sono la stessa riga verde.
const coord5 = bustaCoord(5);
ok(e31Di(coord5) === 1,
   `CONTROPROVA: alla QUINTA truppa E31 scatta (errori: ${J(erroriDi(coord5))})`);
// 🔴 .normalize('NFC') in msgE31: il motore scrive "unità" con l accento
// DECOMPOSTO (a + U+0300) e un /unità/ crudo non lo trova (trappola nota).
ok(/5 unità/.test(msgE31(coord5)),
   `e il messaggio conta 5 unita\`, non 10 voci (${(/Coordinato con [^.]*/.exec(msgE31(coord5)) || ['nessun messaggio'])[0]})`);
// CONTROPROVA: con UNA voce per truppa il limite si comporta uguale, cosi`
// la prova sopra non passa per il numero di voci per caso.
ok(e31Di(bustaCoord(4, { unaVoceSola: true })) === 0 && e31Di(bustaCoord(5, { unaVoceSola: true })) === 1,
   'CONTROPROVA: con una voce per truppa la soglia e` la stessa, quattro sì e cinque no');
window.currentOrder = null; window._ordineAllarmato = null;
M._rosterProprio = null; M._rosterNemico = null;

// ==================================================================
// 10. LE DUE FUNZIONI NUOVE DEL MOTORE (MOTORE, 8 ottobre, motore .08.2)
//     M.nonPiuMarker(dif)
//     M.scoprireSuperatoInPagina(dif, {poiAttacco}) -> {superato, testo}
//
//   Nascono perche` la schermata dello Scoprire della seconda meta`
//   mostrava "WIP 14 -> 17", gittata e copertura per un tiro che il
//   tabellone poi annullava. Erano state misurate con due sonde e MAI
//   messe in un banco: le prove qui sotto sono la rete.
//
//   PERCHE` CONTA CHE SIANO UNA SOLA: la stessa domanda la fanno la
//   schermata (riga 8901) e lo scontro (riga 6559), con la stessa
//   funzione. Se le due risposte potessero divergere, la schermata
//   direbbe "si tira" e il tabellone "NON SI TIRA" — la famiglia di
//   difetti di sempre, vista da due letture dello stesso fatto. L ultima
//   prova della sezione pretende che vadano d accordo.
// ==================================================================
console.log('\n=== 10. M.nonPiuMarker e M.scoprireSuperatoInPagina ===');
const modello = { id: 'r1', alias: 'Fusilier', tipo: 'LI', arm: 1, bts: 0, ph: 10,
                  deployState: 'NORMAL', states: {} };
ok(M.nonPiuMarker(modello) === true,
   `un Modello normale NON e` + ` piu` + ` un Marker: true (${M.nonPiuMarker(modello)})`);
ok(M.nonPiuMarker(spektr) === false,
   `un CAMO lo e` + ` ancora: false (${M.nonPiuMarker(spektr)})`);
ok(M.nonPiuMarker(speculo) === false,
   `e un IMP-2 anche: false (${M.nonPiuMarker(speculo)})`);
ok(M.nonPiuMarker({ id: 'h1', alias: 'Zero', deployState: 'HIDDEN', states: {} }) === false,
   'e un Hidden Deployment anche');
// I TRE CASI CHE NON SONO "NON PIU` MARKER" MA UN ALTRO FATTO. Senza
// questi, una funzione che rispondesse `true` a tutto quello che non e`
// CAMO passerebbe le tre prove sopra.
ok(M.nonPiuMarker(null) === false && M.nonPiuMarker(undefined) === false,
   `un bersaglio assente non e` + ` "non piu` + ` Marker": false, non true (${M.nonPiuMarker(null)} / ${M.nonPiuMarker(undefined)})`);
ok(M.nonPiuMarker('Fusilier') === false,
   `e nemmeno il solo NOME, che non e` + ` un oggetto (${M.nonPiuMarker('Fusilier')})`);
const fantasma = { id: 'f1', alias: 'Fantasma', deployState: 'NORMAL', states: {}, nonRisolto: true };
ok(M.nonPiuMarker(fantasma) === false,
   `e un bersaglio nonRisolto nemmeno, benche` + ` per il resto sia un Modello: lo dicono altri campi (${M.nonPiuMarker(fantasma)})`);

console.log('\n--- la schermata: due Ordini, due code diverse ---');
const pagBS = M.scoprireSuperatoInPagina(modello, { poiAttacco: true });
const pagPZ = M.scoprireSuperatoInPagina(modello, {});
ok(pagBS.superato === true && pagPZ.superato === true, 'col Modello la schermata dice superato in entrambi gli Ordini');
ok(/^Fusilier non è più un Marker: si è rivelato da solo \(ha dichiarato un ARO\)\. Lo Scoprire non si tira/
      .test(String(pagBS.testo).normalize('NFC')),
   `il testo nomina l unita` + ` e dice perche` + ` (${String(pagBS.testo).slice(0, 62)}…)`);
ok(/; si passa direttamente all'Attacco\.$/.test(String(pagBS.testo).normalize('NFC')),
   `in SCOPRIRE + ATTACCO finisce con "si passa direttamente all Attacco" (${String(pagBS.testo).slice(-42)})`);
ok(/; l'Ordine prosegue\.$/.test(String(pagPZ.testo).normalize('NFC')),
   `in SCOPRIRE + PIAZZARE finisce con "l Ordine prosegue" (${String(pagPZ.testo).slice(-26)})`);
ok(pagBS.testo !== pagPZ.testo,
   'e le due code sono DAVVERO diverse: un testo solo per due Ordini sarebbe sbagliato in uno dei due');
// Col Marker ancora Marker: superato false, e `testo` NULL. Assente non e`
// vuoto: una stringa vuota la schermata la stamperebbe come riquadro cieco.
const pagCamo = M.scoprireSuperatoInPagina(spektr, { poiAttacco: true });
ok(pagCamo.superato === false && pagCamo.testo === null,
   `CONTROPROVA: col Marker ancora Marker superato false e testo NULL, non '' (${J(pagCamo)})`);
// Chiamata senza il secondo argomento: non deve cadere, e vale il Piazzare.
ok(M.scoprireSuperatoInPagina(modello).superato === true &&
   /; l'Ordine prosegue\.$/.test(String(M.scoprireSuperatoInPagina(modello).testo).normalize('NFC')),
   'senza opzioni non cade, e la coda e` quella dell Ordine che prosegue');
ok(/^Il bersaglio non è più un Marker/.test(String(M.scoprireSuperatoInPagina({ deployState: 'NORMAL', states: {} }, {}).testo).normalize('NFC')),
   'e senza nome scrive "Il bersaglio", non una stringa vuota');

console.log('\n--- e la schermata e lo scontro rispondono la stessa cosa ---');
// UN FATTO, UNA RISPOSTA. Si confronta la decisione della pagina con quella
// dello scontro sugli stessi bersagli: devono coincidere caso per caso.
// Qui sta la prova che vale: i testi possono essere scritti diversi, la
// DECISIONE no.
const casiAccordo = [['Modello', modello], ['CAMO', spektr], ['IMP-2', speculo]];
const disaccordi = casiAccordo.filter(([nome, dif]) => {
    const pagina = M.scoprireSuperatoInPagina(dif, { poiAttacco: true }).superato;
    const inCampoPrima = inCampo.slice();
    inCampo.length = 0; inCampo.push(zero, dif);
    const lista = risolvi(bustaCombinata(zero, dif, dif));
    inCampo.length = 0; inCampoPrima.forEach(u => inCampo.push(u));
    const scontro = !!sc(lista, 0).scoprireSuperato;
    return pagina !== scontro;
});
ok(disaccordi.length === 0,
   `schermata e scontro d accordo su tutti e ${casiAccordo.length} i casi${disaccordi.length ? ' — in disaccordo: ' + disaccordi.map(x => x[0]).join(', ') : ''}`);
// CONTROPROVA della lettura: se lo scontro non si producesse, `scoprireSuperato`
// sarebbe undefined per tutti e il confronto direbbe "d accordo" a vuoto.
inCampo.length = 0; inCampo.push(zero, modello);
const accordoModello = risolvi(bustaCombinata(zero, modello, modello));
inCampo.length = 0; [zero, zeroMsv, spektr, speculo, fusilier].forEach(u => inCampo.push(u));
ok(accordoModello.length >= 1 && sc(accordoModello, 0).scoprireSuperato === true,
   `CONTROPROVA: sul Modello lo scontro si produce davvero e dice scoprireSuperato (${accordoModello.length} scontri, ${sc(accordoModello, 0).scoprireSuperato})`);
ok(sc(accordoModello, 0).titolo === 'SCOPRIRE: NON SI TIRA',
   `e il titolo dello scontro e` + ` quello che il giocatore legge (${sc(accordoModello, 0).titolo})`);

// ==================================================================
// 11. I DUE CASI CHE ERANO "APERTI" (MOTORE, 8 ottobre, punto 4)
//     INTERFACCIA li ha misurati con le sonde sui tre dispositivi, ma in
//     un banco non c erano. Una sonda si lancia una volta; un banco
//     rimisura a ogni giro. Qui stanno al livello del motore.
// ==================================================================
console.log('\n=== 11a. Coordinato con QUATTRO partecipanti, Scoprire + Attacco ===');
const squadra4 = [0, 1, 2, 3].map(i =>
    ({ id: 'q' + i, alias: 'Alg' + i, bs: 11, wip: 12, ph: 10, arm: 1, bts: 0, states: {}, weapon: 'Combi Rifle' }));
// Burst: 2 alla Punta di Lancia, 1 ai gregari (lo decide la schermata; qui
// si pretende che la busta lo porti fino allo scontro senza perderlo).
function busta4(n) {
    const voci = [];
    squadra4.slice(0, n).forEach((x, i) => {
        voci.push({ attaccante: x, attaccanteId: x.id, azione: M.AZIONI.SCOPRIRE, regole: { poiAttacco: true },
                    bersagli: [{ id: spektr.id, name: M.nomeUnita(spektr), burst: 1, rangeIndex: 0 }] });
        voci.push({ attaccante: x, attaccanteId: x.id, azione: M.AZIONI.BS_ATTACK, arma: combi, scoprendo: spektr.id,
                    bersagli: [{ id: spektr.id, name: M.nomeUnita(spektr), burst: (i === 0 ? 2 : 1),
                                 rangeIndex: 0, rangeMod: 3, dopoScoprire: true }] });
    });
    window.currentOrder = { id: 'co' + n }; window._ordineAllarmato = null;
    M._rosterProprio = squadra4.slice(0, n); M._rosterNemico = [spektr];
    return M.creaPayload(voci, { isCoordinated: true });
}
const b4 = busta4(4);
const inCampo4 = squadra4.concat([spektr]);
const trova4 = (n, id) => inCampo4.find(u =>
    (id && String(u.id) === String(id)) ||
    M.nomeUnita(u).toUpperCase() === String(M.nomeUnita(n) || n).toUpperCase()) || null;
ok(erroriDi(b4).length === 0,
   `quattro partecipanti: la busta parte senza errori (${J(erroriDi(b4))})`);
ok(((b4.payload || {}).attacchi || []).length === 8,
   `con OTTO voci, due per partecipante (${((b4.payload || {}).attacchi || []).length})`);
const sc4 = M.risolviPayload(b4.payload, [], { trovaUnita: trova4 }) || [];
ok(sc4.length === 8, `e produce OTTO scontri, uno per voce (${sc4.length})`);
const bsDi = sc4.filter(s => att(s).azione === M.AZIONI.BS_ATTACK).map(s => att(s).burst);
ok(J(bsDi) === J([2, 1, 1, 1]),
   `Burst 2 alla Punta di Lancia e 1 ai tre gregari, fino allo scontro (${J(bsDi)})`);
const scopDi = sc4.filter(s => att(s).azione === M.AZIONI.SCOPRIRE);
ok(scopDi.length === 4 && scopDi.every(s => s.scoprirePoiAttacco === true),
   `e i quattro Scoprire portano tutti scoprirePoiAttacco (${scopDi.length} Scoprire)`);
// CONTROPROVA: se la busta perdesse un partecipante, le prove sopra
// leggerebbero quattro scontri invece di otto e lo direbbero. Si misura la
// soglia dal basso per essere sicuri che il numero non sia fisso.
const sc2 = M.risolviPayload(busta4(2).payload, [], { trovaUnita: trova4 }) || [];
ok(sc2.length === 4,
   `CONTROPROVA: con DUE partecipanti gli scontri sono quattro, non otto (${sc2.length})`);

console.log('\n=== 11b. Scoprire + Piazzare quando reagisce il Marker stesso ===');
const bpm = bustaPiazzare();
const scPm = risolvi(bpm, aroBs(spektr));
ok(scPm.length === 3,
   `tre scontri: lo Scoprire, il Piazzamento e l ARO del Marker a se` + ` (${scPm.length})`);
const sScop = scPm.find(s => att(s).azione === M.AZIONI.SCOPRIRE) || {};
const sPiaz = scPm.find(s => att(s).azione === M.AZIONI.PIAZZA_DEPLOYABLE) || {};
const sAro = scPm.find(s => att(s).azione === M.AZIONI.BS_ATTACK) || {};
ok(sScop.titolo === 'SCOPRIRE: NON SI TIRA' && sScop.scoprireSuperato === true,
   `lo Scoprire non si tira, e lo dice il titolo (${sScop.titolo}, scoprireSuperato ${sScop.scoprireSuperato})`);
ok(/si è rivelato da solo/.test(noteDi(sScop)),
   `con la spiegazione a vista (${noteDi(sScop).slice(0, 56)})`);
ok(sPiaz.condizionatoDaScoprire === true && /PIAZZAMENTO CONDIZIONATO/.test(noteDi(sPiaz)),
   `il piazzamento resta condizionato anche cosi` + ` (${sPiaz.condizionatoDaScoprire})`);
ok(sAro.titolo === 'TIRO NORMALE' && /Spektr/.test(String(att(sAro).nome || '')),
   `e l ARO del Marker e` + ` un Tiro Normale a se` + `, non un Faccia a Faccia (${sAro.titolo}, ${att(sAro).nome})`);
// LE DUE NOTE SONO ALTERNATIVE. Se il Marker si e` rivelato non c e` niente
// da tirare per primo: la nota "tira PRIMA questo Scoprire" NON deve
// comparire, e `scoprirePoiPiazzare` nemmeno. Senza questa prova il
// giocatore leggerebbe due istruzioni che si contraddicono.
ok(!/tira PRIMA questo Scoprire/.test(noteDi(sScop)),
   'e la nota "tira PRIMA questo Scoprire" NON compare: non c e` piu` niente da tirare');
ok(sScop.scoprirePoiPiazzare === undefined,
   `nemmeno il campo scoprirePoiPiazzare (${J(sScop.scoprirePoiPiazzare)})`);
// CONTROPROVA: col Marker che NON reagisce torna la nota "tira PRIMA" e
// sparisce "si è rivelato da solo". Senza, le due prove sopra non
// distinguono "alternative" da "mai scritte".
const scPmNo = risolvi(bustaPiazzare(), []);
const sScopNo = scPmNo.find(s => att(s).azione === M.AZIONI.SCOPRIRE) || {};
ok(/tira PRIMA questo Scoprire/.test(noteDi(sScopNo)) && sScopNo.scoprirePoiPiazzare === true,
   'CONTROPROVA: senza ARO del Marker torna "tira PRIMA" e il campo si accende');
ok(!/si è rivelato da solo/.test(noteDi(sScopNo)) && sScopNo.scoprireSuperato !== true,
   `e la nota del Marker rivelato NON c e` + ` (scoprireSuperato: ${J(sScopNo.scoprireSuperato)})`);
window.currentOrder = null; window._ordineAllarmato = null;
M._rosterProprio = null; M._rosterNemico = null;

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
