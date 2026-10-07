// @versione 2026-10-07.2 | test_scoprire_attacco.js | proprieta`: chat TEST
// SCOPRIRE + ATTACCO BS: i tre campi nuovi — node test_scoprire_attacco.js
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

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
