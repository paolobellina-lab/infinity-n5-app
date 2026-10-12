// @versione 2026-10-09.1 | test_terreni_combinati.js | proprieta`: chat TEST
// ============================================================================
//  TERRENI COMBINATI — M.esitoTerreni   node test_terreni_combinati.js
//  ---------------------------------------------------------------------------
//  Dal 9 ottobre la tendina del terreno e` a scelta MULTIPLA (richiesta di
//  Paolo): sulla stessa linea di tiro ci possono stare Bosco e Giungla, o un
//  Bosco sotto la Tempesta. Il campo `terrain` della busta e` diventato un
//  ELENCO, e a combinarli e` M.esitoTerreni. Era scoperta.
//
//  LE TRE REGOLE CHE SI PROVANO QUI, e che e` facile sbagliare al contrario:
//   - la Zona di Saturazione NON si cumula: tre zone danno -1 B, non -3;
//   - la Visibilita` non si somma: vince la PIU` RESTRITTIVA;
//   - la Tempesta non e` una zona, ALZA DI UNO quella che c e` (e se non ce
//     n'e` nessuna, ne crea una Bassa).
//
//  E IL CASO CHE HA CORRETTO IL PIANO (TER-04, revisione 20): il Rumore
//  Bianco blocca la Linea di Tiro per TUTTI E TRE i livelli di Multispectral
//  Visor, mentre la Visibilita` Zero li lascia passare (L1 con -6, L2 e L3
//  senza MOD). Si somigliano e si comportano al contrario: il piano aveva
//  copiato lo schema della Foresta sul Rumore Bianco, ed era sbagliato.
//
//  METODO: ogni atteso di questo banco e` stato MISURATO col motore
//  2026-10-09.4, non dedotto dal regolamento. Dove la misura ha smentito
//  quello che mi aspettavo, c e` scritto.
//
//  🔴 REGOLA DI ROTTURA, corretta il 9 ottobre pomeriggio. Finora dicevo:
//  "ogni rottura si conferma con `cmp` prima di concludere". NON BASTA. Qui
//  due rotture di fila hanno cambiato il file — `cmp` diceva "diversi" — e
//  NON hanno cambiato il comportamento: una leggeva un elenco di id cercandoci
//  dentro il nome di un tratto, l'altra un nome di variabile che in quell
//  ambito non esiste. Il banco restava verde e io avrei concluso che la prova
//  non morde. La regola giusta e` in due passi:
//     1. `cmp` dice che il file e` cambiato;
//     2. una MISURA dice che il risultato e` cambiato.
//  Solo dopo il secondo passo un verde significa qualcosa.
// ============================================================================
global.window = global;
const DIR = (process.env.CARTELLA || __dirname).replace(/\/?$/, '/');

let passati = 0, falliti = 0;
const J = JSON.stringify;
function ok(c, n, e) { if (c) { passati++; console.log(`  ✅ ${n}`); } else { falliti++; console.log(`  ❌ ${n}${e ? '\n       ' + e : ''}`); } }
function sezione(titolo, fn) {
    console.log('\n=== ' + titolo + ' ===');
    try { fn(); } catch (e) { falliti++; console.log('  ❌ la sezione e` caduta: ' + e.message + ' ' + ((e.stack || '').split('\n')[1] || '').trim()); }
}

require(DIR + 'catalogo_n5.js');
require(DIR + 'database_comune.js');
const M = require(DIR + 'motore_regole_n5.js');

const TER = window.DB_TERRENI || [];
const nome = (id) => (TER.find(t => t.id === id) || {}).nome || id;
const etichetta = (ids) => ids.map(nome).join(' + ');

// 🔴 SI GUARDA TUTTO IL RISULTATO, NON IL CAMPO CHE MI ASPETTO.
// Tre volte in una giornata una mia sonda e` stata cieca a un campo: le celle
// della gittata, la scritta "+ SAGOMA CIRCOLARE", e l'avviso di un id di
// terreno sbagliato — che c'era, e io guardavo solo `note`. Quindi il
// confronto e` sull'OGGETTO INTERO, e l'atteso elenca tutti i campi: un campo
// nuovo del motore fa diventare rossa questa prova invece di passare inosservato.
const CAMPI = ['modBS', 'modB', 'lofBloccata'];
function esito(ids, opz) { return M.esitoTerreni(ids, opz || {}); }
function provaEsito(ids, opz, atteso, etic) {
    const r = esito(ids, opz);
    const letto = {}; CAMPI.forEach(k => { letto[k] = r[k]; });
    const uguale = J(letto) === J(atteso);
    // Un campo nuovo o scomparso nel risultato: lo si dice invece di ignorarlo.
    const campiVisti = Object.keys(r).sort();
    const campiAttesi = ['avvisi', 'lofBloccata', 'modB', 'modBS', 'note'];
    const nuovi = campiVisti.filter(k => campiAttesi.indexOf(k) < 0);
    ok(uguale && nuovi.length === 0,
       `${etic || etichetta(ids)}: ${J(atteso)}`,
       (uguale ? '' : `letto ${J(letto)}\n       note del motore: ${r.note}`) +
       (nuovi.length ? `\n       CAMPI NUOVI nel risultato, non provati: ${nuovi.join(', ')}` : ''));
    return r;
}

// ---------------------------------------------------------------------------
sezione('0. La funzione, e le chiavi che dichiara da sola', () => {
    ok(typeof M.esitoTerreni === 'function', 'M.esitoTerreni c e');
    ok(TER.length === 18, `i terreni a catalogo sono 18 (${TER.length})`);
    // 🔴 La funzione DICE da sola quali opzioni accetta, se le dai una chiave
    // che non conosce. E` il motivo per cui questo banco non indovina i nomi:
    // glieli ho chiesti. (Il 9 ottobre avevo scritto `msvL2` e la funzione mi
    // ha corretto.)
    const vere = console.warn; const detto = [];
    console.warn = (...a) => detto.push(a.join(' '));
    try { M.esitoTerreni(['TER_10'], { msvL2: true }); } finally { console.warn = vere; }
    ok(detto.length === 1 && /chiavi sconosciute/.test(detto[0]),
       'una chiave sconosciuta nelle opzioni viene detta, non ignorata in silenzio');
    ok(/\["msv1","msv2","msv3","marksmanship","bersaglio"\]/.test(detto[0] || ''),
       `e il messaggio elenca le cinque chiavi vere: ${J((/attese (\[[^\]]*\])/.exec(detto[0] || '') || [])[1])}`);
    // 📋 DIFETTO PICCOLO, SEGNALATO A MOTORE IL 9 OTTOBRE. Il refuso in una
    // CHIAVE finisce in console.warn e NON in `avvisi`, quindi al tavolo non
    // si vede: l'app mostra gli avvisi, non la console di Chrome. Il refuso in
    // un ID DI TERRENO invece finisce in `avvisi` (sezione 5) ed e` visibile.
    // Due refusi, due destini. Qui si INCHIODA il comportamento di oggi: il
    // giorno che MOTORE lo pareggia, questa prova diventa rossa e lo dice.
    ok(J(M.esitoTerreni(['TER_10'], { msvL2: true }).avvisi) === J([]),
       'ma NON entra in `avvisi`, quindi al tavolo non si legge (difetto aperto, inchiodato qui)');
});

// ---------------------------------------------------------------------------
sezione('1. La Zona di Saturazione non si cumula: una, e basta', () => {
    // Palude, Terreno Roccioso e Alta Montagna sono tre Zone di Saturazione.
    // Sommandole il Burst scenderebbe di 3, e un HMG in un bosco paludoso
    // tirerebbe un dado invece di quattro.
    provaEsito(['TER_03'], {}, { modBS: 0, modB: -1, lofBloccata: false });
    provaEsito(['TER_03', 'TER_04'], {}, { modBS: 0, modB: -1, lofBloccata: false });
    // 🔴 L'atteso qui NON e` modBS 0: l'Alta Montagna porta anche la Bassa
    // Visibilita`, quindi -3. Me ne sono accorto misurando: avevo scritto 0.
    provaEsito(['TER_03', 'TER_04', 'TER_09'], {}, { modBS: -3, modB: -1, lofBloccata: false });
    const tre = esito(['TER_03', 'TER_04', 'TER_09'], {});
    ok(/una sola, non si cumula/.test(tre.note),
       'e la nota lo dice al giocatore: "una sola, non si cumula"');
    ok(tre.modB === -1, `il Burst scende di UNO con tre zone, non di tre (${tre.modB})`);
});

// ---------------------------------------------------------------------------
sezione('2. La Visibilita` non si somma: vince la piu` restrittiva', () => {
    provaEsito(['TER_08'], {}, { modBS: -3, modB: 0, lofBloccata: false }, 'Media Montagna (Bassa)');
    provaEsito(['TER_11'], {}, { modBS: -6, modB: -1, lofBloccata: false }, 'Giungla (Pessima)');
    // Bosco (Bassa, -3) + Giungla (Pessima, -6): vince la Pessima. Sommate
    // darebbero -9, che non esiste in N5.
    const due = provaEsito(['TER_10', 'TER_11'], {}, { modBS: -6, modB: -1, lofBloccata: false });
    ok(/la piu restrittiva/.test(due.note), 'e la nota dice che ha scelto la piu` restrittiva');
    // La nota NOMINA tutte le candidate: serve al giocatore per controllare che
    // l'app abbia capito quali zone ci sono.
    ok(/Bassa Visibilità \(Bosco\)/.test(due.note) && /Pessima Visibilità \(Giungla\)/.test(due.note),
       'nominandole tutte e due, con il terreno di provenienza');
    // Tre zone, due livelli diversi: vince sempre una sola.
    provaEsito(['TER_08', 'TER_10', 'TER_11'], {}, { modBS: -6, modB: -1, lofBloccata: false });
});

// ---------------------------------------------------------------------------
sezione('3. La Tempesta ALZA DI UNO la zona che c e`', () => {
    // La Tempesta non ha un MOD suo: ha il tratto "Peggiora Visibilità di 1".
    // Da sola crea una Bassa; su una Bassa fa una Pessima; su una Pessima fa
    // una Zero, che blocca la LoF. E` il caso in cui il terreno TOGLIE il tiro
    // invece di peggiorarlo, e il MOD torna a 0 perche` non c e` piu` un tiro.
    provaEsito(['TER_15'], {}, { modBS: -3, modB: 0, lofBloccata: false }, 'solo Tempesta');
    provaEsito(['TER_08', 'TER_15'], {}, { modBS: -6, modB: 0, lofBloccata: false }, 'Media Montagna + Tempesta');
    provaEsito(['TER_10', 'TER_15'], {}, { modBS: -6, modB: -1, lofBloccata: false }, 'Bosco + Tempesta');
    // 🔴 Giungla + Tempesta: Pessima alzata di uno = Zero. NESSUNA LoF, e
    // modBS torna 0. Chi leggesse solo modBS penserebbe "nessun malus".
    const zero = provaEsito(['TER_11', 'TER_15'], {}, { modBS: 0, modB: -1, lofBloccata: true }, 'Giungla + Tempesta');
    ok(/NESSUNA LoF/.test(zero.note),
       'e con la LoF bloccata il modBS 0 NON vuol dire "nessun malus": la nota lo spiega');
    ok(/alzata di un livello dalla Tempesta/.test(zero.note), 'dicendo da dove viene il livello in piu`');
    // Sulla Visibilita` Zero la Tempesta non alza oltre: non esiste un quarto
    // livello. Senza questo si potrebbe uscire dalla scala.
    const max = provaEsito(['TER_13', 'TER_15'], {}, { modBS: 0, modB: -1, lofBloccata: true }, 'Foresta Primordiale + Tempesta');
    ok(/gia` al massimo|già al massimo/.test(max.note), 'e sulla Zero la Tempesta si ferma: "gia` al massimo"');
    // CONTROPROVA: la Tempesta DA SOLA non blocca niente e non tocca il Burst.
    const sola = esito(['TER_15'], {});
    ok(sola.lofBloccata === false && sola.modB === 0,
       'CONTROPROVA: la Tempesta da sola non blocca la LoF e non tocca il Burst');
});

// ---------------------------------------------------------------------------
sezione('4. TER-04: il Rumore Bianco e la Visibilita` Zero si comportano AL CONTRARIO', () => {
    // 🔴 QUESTO E` IL CASO CHE HA CORRETTO IL PIANO (revisione 20). I due si
    // somigliano — entrambi "non si vede" — e fanno l'opposto davanti a un
    // Multispectral Visor:
    //   Visibilita` Zero  il visore SERVE: L1 passa con -6, L2 e L3 senza MOD
    //   Rumore Bianco     il visore NON serve: blocca proprio CHI LO HA
    // Il piano, fino alla revisione 19, aveva copiato lo schema della Foresta
    // sul Rumore Bianco e dichiarava che L2 e L3 passavano. Misurato: no.
    console.log('   --- Rumore Bianco (Sala Generatori): blocca TUTTI E TRE i livelli ---');
    provaEsito(['TER_17'], {}, { modBS: 0, modB: -1, lofBloccata: false }, 'senza visore: nessun effetto');
    ['msv1', 'msv2', 'msv3'].forEach(liv => {
        provaEsito(['TER_17'], { [liv]: true }, { modBS: 0, modB: -1, lofBloccata: true }, `con ${liv.toUpperCase()}: LoF BLOCCATA`);
    });
    const rb = esito(['TER_17'], {});
    ok(/serve MSV o Marksmanship/.test(rb.note),
       'senza visore la nota spiega che il Rumore Bianco non fa niente: colpisce chi ce l ha');
    // Anche la Marksmanship, non solo il visore.
    provaEsito(['TER_17'], { marksmanship: true }, { modBS: 0, modB: -1, lofBloccata: true }, 'con Marksmanship: LoF BLOCCATA');
    ok(/Marksmanship/.test(esito(['TER_17'], { marksmanship: true }).note), 'e la nota nomina la Marksmanship');

    console.log('   --- Visibilita` Zero (Foresta Primordiale): il visore SERVE ---');
    provaEsito(['TER_13'], {}, { modBS: 0, modB: -1, lofBloccata: true }, 'senza visore: LoF bloccata');
    provaEsito(['TER_13'], { msv1: true }, { modBS: -6, modB: -1, lofBloccata: false }, 'con MSV1: passa con -6');
    provaEsito(['TER_13'], { msv2: true }, { modBS: 0, modB: -1, lofBloccata: false }, 'con MSV2: passa senza MOD');
    provaEsito(['TER_13'], { msv3: true }, { modBS: 0, modB: -1, lofBloccata: false }, 'con MSV3: passa senza MOD');

    // 🔴 LA PROVA CHE VALE: i due casi messi uno accanto all'altro. Con un
    // MSV2 la Foresta si attraversa e il Rumore Bianco no. Se qualcuno
    // "uniformasse" i due rami, una di queste due righe diventerebbe rossa.
    const foresta = esito(['TER_13'], { msv2: true });
    const rumore = esito(['TER_17'], { msv2: true });
    ok(foresta.lofBloccata === false && rumore.lofBloccata === true,
       `con lo STESSO MSV2: la Foresta si attraversa (lof ${foresta.lofBloccata}) e il Rumore Bianco no (lof ${rumore.lofBloccata})`);
    // 📋 DIFETTO PICCOLO, SEGNALATO A MOTORE: con un MSV3 la nota dice
    // "MSV2 permette LoF senza MOD". Il calcolo e` giusto, il nome del livello
    // no: chi legge puo` pensare che il suo L3 non sia stato visto.
    ok(/MSV2 permette LoF/.test(esito(['TER_13'], { msv3: true }).note),
       'e con un MSV3 la nota dice ancora "MSV2": il conto e` giusto, il nome del livello no (difetto aperto)');
});

// ---------------------------------------------------------------------------
sezione('5. Il Fumo e l Eclipse non sono terreni: la Saturazione resta', () => {
    // Fumo ed Eclipse viaggiano nel campo `zona`, MAI fra i terreni: messi in
    // `terrain` conterebbero due volte (lo dice il commento di app.html, e
    // l'ha misurato DATABASE). Qui si prova che una Giungla sotto il Fumo
    // tiene la sua Zona di Saturazione: il -1 B non viene dalla visibilita`
    // ma dal terreno, e sono due cose diverse che si sommano fra loro.
    const giungla = esito(['TER_11'], {});
    ok(giungla.modB === -1, `la Giungla da sola toglie un dado (${giungla.modB})`);
    // La zona non entra in esitoTerreni: si passa l'elenco dei soli terreni.
    // Quindi il -1 B resta qualunque cosa ci sia sopra, ed e` giusto cosi`.
    const separa = window.separaTerrenoEZona;
    if (typeof separa === 'function') {
        const s = separa('TER_11+FUMO');
        ok(J(s.terrain) === J(['TER_11']) && s.zona === 'FUMO',
           `"TER_11+FUMO" si separa in terreno e zona (${J(s)})`);
        ok(esito(s.terrain, {}).modB === -1,
           'e il terreno che resta tiene la sua Zona di Saturazione: il Fumo non la cancella');
    } else {
        // app.html non e` caricato in questo banco: lo si dice invece di saltare muti.
        ok(true, 'window.separaTerrenoEZona non c e in questo banco (sta in app.html): la separazione la prova test_elenchi_e_tabellone.js');
    }
    // Un id che non esiste: NON passa in silenzio, finisce in `avvisi`.
    // 🔴 L'avevo dato per silenzioso e stavo per segnalarlo: la mia sonda
    // guardava solo `note`. L'avviso c e`, ed e` questo che lo prova.
    const ignoto = esito(['TER_99'], {});
    ok(J({ modBS: ignoto.modBS, modB: ignoto.modB, lofBloccata: ignoto.lofBloccata }) === J({ modBS: 0, modB: 0, lofBloccata: false }),
       'un id di terreno che non esiste non applica nessun MOD');
    ok((ignoto.avvisi || []).length === 1 && /TER_99/.test(ignoto.avvisi[0]),
       `e lo DICE, nominando l id: ${J((ignoto.avvisi || [])[0])}`);
    ok(/controlla l'id/.test((ignoto.avvisi || [])[0] || ''), 'suggerendo di controllare il refuso');
    // Un id buono e uno sbagliato insieme: il buono si applica, il cattivo si dice.
    const misto = esito(['TER_11', 'TER_99'], {});
    ok(misto.modBS === -6 && (misto.avvisi || []).length === 1,
       `e con un id buono e uno sbagliato: il buono vale (-6) e il cattivo si dice (${misto.modBS}, ${(misto.avvisi || []).length} avvisi)`);
});

// ---------------------------------------------------------------------------
sezione('6. Niente terreni: zero e silenzio, senza inventare', () => {
    // Nessun terreno NON e` "un terreno che non fa niente": e` l'assenza. Qui
    // si pretende che non compaia nessuna nota e nessun avviso, perche` una
    // nota a vuoto sulla scheda del bersaglio farebbe cercare un terreno che
    // non c e`.
    [[[], 'elenco vuoto'], [['NESSUNO'], '"NESSUNO"'], [null, 'null'], [undefined, 'undefined']]
      .forEach(([ids, come]) => {
        const r = esito(ids, {});
        ok(r.modBS === 0 && r.modB === 0 && r.lofBloccata === false && !r.note && (r.avvisi || []).length === 0,
           `${come}: nessun MOD, nessuna nota, nessun avviso`,
           `letto ${J({ modBS: r.modBS, modB: r.modB, lofBloccata: r.lofBloccata, note: r.note, avvisi: r.avvisi })}`);
      });
    // 'NESSUNO' non e` un id sconosciuto: e` il valore che la tendina manda
    // quando non e` stato scelto niente. Non deve produrre l'avviso del refuso.
    ok((esito(['NESSUNO'], {}).avvisi || []).length === 0,
       '"NESSUNO" non viene preso per un id sbagliato: e` il valore della tendina vuota');
});

// ---------------------------------------------------------------------------
sezione('7. Tutti i 18 terreni del catalogo, uno per uno', () => {
    // Un giro completo: ogni terreno dichiarato produce quello che i suoi
    // tratti dicono. Non si scrivono i numeri a mano — si leggono i TRATTI dal
    // catalogo e si controlla la coerenza. Cosi` un terreno nuovo entra nel
    // banco da solo, e un tratto scritto male si vede.
    const ATTESO_VIS = { 'Bassa Visibilità': -3, 'Pessima Visibilità': -6, 'Visibilità Zero': 0 };
    const fuori = [];
    TER.forEach(t => {
        const tr = t.tratti || [];
        const r = esito([t.id], {});
        const vis = tr.find(x => ATTESO_VIS[x] !== undefined);
        const sat = tr.indexOf('Zona di Saturazione') >= 0;
        const zero = tr.indexOf('Visibilità Zero') >= 0;
        const rb = tr.indexOf('Rumore Bianco') >= 0;
        const peggiora = tr.indexOf('Peggiora Visibilità di 1') >= 0;
        if (sat && r.modB !== -1) fuori.push(`${t.nome}: ha Zona di Saturazione ma modB = ${r.modB}`);
        if (!sat && r.modB !== 0) fuori.push(`${t.nome}: NON ha Zona di Saturazione ma modB = ${r.modB}`);
        if (zero && r.lofBloccata !== true) fuori.push(`${t.nome}: ha Visibilità Zero ma non blocca la LoF`);
        if (vis && !zero && !peggiora && r.modBS !== ATTESO_VIS[vis]) fuori.push(`${t.nome}: ${vis} dovrebbe dare ${ATTESO_VIS[vis]}, dato ${r.modBS}`);
        if (!vis && !rb && !peggiora && r.modBS !== 0) fuori.push(`${t.nome}: nessun tratto di visibilità ma modBS = ${r.modBS}`);
        // Il Rumore Bianco, senza visore, non deve fare niente.
        if (rb && !vis && (r.modBS !== 0 || r.lofBloccata !== false)) fuori.push(`${t.nome}: Rumore Bianco senza visore dovrebbe essere inerte`);
    });
    ok(fuori.length === 0,
       `tutti e ${TER.length} i terreni fanno quello che i loro tratti dichiarano`,
       fuori.join('\n       '));
    // E ogni terreno con Rumore Bianco blocca chi ha un visore, qualunque livello.
    const rbFuori = [];
    TER.filter(t => (t.tratti || []).indexOf('Rumore Bianco') >= 0).forEach(t => {
        ['msv1', 'msv2', 'msv3', 'marksmanship'].forEach(k => {
            const r = esito([t.id], { [k]: true });
            if (r.lofBloccata !== true) rbFuori.push(`${t.nome} + ${k}: la LoF NON e` + ` bloccata`);
        });
    });
    const quantiRB = TER.filter(t => (t.tratti || []).indexOf('Rumore Bianco') >= 0).length;
    ok(quantiRB === 2 && rbFuori.length === 0,
       `e i ${quantiRB} terreni col Rumore Bianco bloccano visore e Marksmanship, tutti i livelli`,
       rbFuori.join('\n       '));
});

// ---------------------------------------------------------------------------
sezione('8. 🔴 DUE IMPLEMENTAZIONI DELLA STESSA REGOLA, E NON DANNO LO STESSO ESITO', () => {
    // Misurato il 9 ottobre pomeriggio, cercando dove rompere per provare le
    // sezioni qui sopra. M.esitoTerreni ha DUE strade:
    //
    //   se G.applicaModTerreno.accettaElenco e` vero  -> passa l ELENCO INTERO
    //       a DATABASE e torna la sua risposta. E` la strada che si usa oggi,
    //       ed e` quella che alza il livello con la Tempesta.
    //   altrimenti -> il motore combina da solo i risultati uno per uno
    //       (il ramo `parziali`), e quel ramo NON alza il livello: mette un
    //       avviso che dice "aggiusta il MOD al tavolo".
    //
    // I due NON danno lo stesso esito, e non su un dettaglio:
    //   Giungla + Tempesta, strada viva      -> NESSUNA LoF
    //   Giungla + Tempesta, ramo di scorta   -> -6 BS e LoF LIBERA
    // Cioe` il ramo di scorta concede un tiro che la regola vieta.
    //
    // Oggi non si usa, quindi non e` un difetto in atto. Ma e` un difetto che
    // ASPETTA: basta che DATABASE consegni applicaModTerreno senza quella
    // proprieta` — una riga — e l app torna al comportamento vecchio senza che
    // niente si rompa e senza che nessuno se ne accorga. Questa prova e` il
    // guardiano di quella riga.
    const f = window.applicaModTerreno;
    ok(typeof f === 'function', 'DATABASE consegna applicaModTerreno');
    ok(f && f.accettaElenco === true,
       'e la marca `accettaElenco`: e` lei a combinare l elenco, ed e` la sola che alza il livello con la Tempesta',
       'SENZA questa marca il motore ripiega sul suo ramo, che NON alza il livello: Giungla + Tempesta tornerebbe -6 BS con la LoF LIBERA invece di NESSUNA LoF. Un tiro che la regola vieta.');

    // La controprova, misurata: si spegne la marca e si guarda il ramo di
    // scorta. Si rimette subito, e si pretende che sia tornata — altrimenti
    // tutte le prove dopo questa girerebbero sulla strada sbagliata.
    if (f && f.accettaElenco === true) {
        let scorta = null;
        try { f.accettaElenco = false; scorta = esito(['TER_11', 'TER_15'], {}); }
        finally { f.accettaElenco = true; }
        ok(scorta && scorta.lofBloccata === false && scorta.modBS === -6,
           `CONTROPROVA: col ramo di scorta Giungla + Tempesta da` + ` ${J({ modBS: scorta.modBS, lofBloccata: scorta.lofBloccata })} — concede il tiro`,
           `letto ${J({ modBS: scorta && scorta.modBS, lofBloccata: scorta && scorta.lofBloccata })}: se oggi coincidono, i due rami sono stati pareggiati e questa prova va riscritta`);
        ok(scorta && (scorta.avvisi || []).some(a => /ALZA DI UN LIVELLO/.test(a)),
           'e lo dice in un avviso, chiedendo di aggiustare a mano');
        ok(f.accettaElenco === true, 'e la marca e` stata rimessa: le altre prove girano sulla strada vera');
        const vero = esito(['TER_11', 'TER_15'], {});
        ok(vero.lofBloccata === true, 'verificato: sulla strada vera la LoF e` di nuovo bloccata');
    }
});

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
