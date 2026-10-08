// @versione 2026-10-08.3 | test_piano_schieramento.js | proprieta`: chat TEST
// ============================================================================
//  LE UNITA` CHE IL PIANO CHIEDE DI SCHIERARE ESISTONO DAVVERO?
//
//  Nasce il 6 ottobre da una segnalazione di Paolo: il piano gli chiedeva di
//  schierare un "Kulak" fra i PanOceania, e nella sua app quel profilo non
//  c'era — perche` il Kulak e` NOMADE. Una prova che chiede una truppa
//  inesistente non e` difficile: e` impossibile, e chi la esegue perde tempo
//  a cercare un difetto nell'app.
//
//  Controllati tutti e 35 i profili delle due tabelle: quattro erano
//  sbagliati, e tre dello stesso tipo — il nome della FAMIGLIA dove serviva
//  il PROFILO. "Zondmate" non esiste, esiste "Zondmate (REM)"; "Machinist"
//  non esiste, esiste "Machinist (Combi Rifle)". Il quarto, "Puppetbot
//  (Minelayer)", non esiste affatto: mescolava le skill di due truppe
//  diverse.
//
//  E` la famiglia di difetti che inseguiamo da sempre, vista da un lato
//  nuovo: un dato scritto a mano che nessuno confronta con la realta`. Il
//  database ha 765 profili e cambia; un piano che li nomina a memoria
//  invecchia in silenzio. Questo banco e` il confronto che mancava.
//
//  COSA PRETENDE: ogni riga delle due tabelle di schieramento nomina un
//  profilo che esiste ESATTAMENTE, col suo nome intero, nel database della
//  fazione sotto cui e` scritto. Non la famiglia: il profilo.
//
//  USO:  node test_piano_schieramento.js  |  CARTELLA=/percorso/ node ...
// ============================================================================
const DIR = (process.env.CARTELLA || (__dirname + '/')).replace(/\/?$/, '/');
global.window = global;
const fs = require('fs');

let passati = 0, falliti = 0;
const J = JSON.stringify;
function ok(c, d, visto) {
    if (c) { passati++; console.log('  ✓ ' + d); }
    else { falliti++; console.log('  ✗ ' + d + (visto !== undefined ? '  [visto: ' + J(visto) + ']' : '')); }
}
const PIANO = DIR + 'PIANO_COLLAUDO_N5.md';
if (!fs.existsSync(PIANO)) {
    console.log('  ✗ PIANO_COLLAUDO_N5.md non trovato in ' + DIR + ' (imposta CARTELLA=/percorso/)');
    console.log('\n0 passati, 1 falliti');
    process.exit(1);
}

require(DIR + 'catalogo_n5.js'); require(DIR + 'database_comune.js');
require(DIR + 'database_nomad.js'); require(DIR + 'database_panoceania.js');

const DB = { NOMADI: window.DB_NOMADI || [], PANOCEANIA: window.DB_PANOCEANIA || [] };

// --- lettura delle due tabelle dal piano ---
// Si riconoscono dal titolo in grassetto della fazione e si chiudono al
// titolo di sezione successivo. Il formato e` quello del piano:
//   | 7 | Clockmaker (Engineer) | ingegnere, GizmoKit |
function leggiTabelle(testo) {
    let fazione = null; const voci = [];
    testo.split('\n').forEach(function (r, i) {
        const t = r.trim();
        // Il titolo della fazione puo` avere del testo dopo ("**Nomadi** —
        // Sessione A i primi dieci…"): si ancora all'inizio e non alla fine.
        // Pretendendo la riga intera si leggeva UNA tabella sola, 14 righe su
        // 35, e le prove di sotto passavano sulla meta` che restava. Trovato
        // dalla controprova della sezione 0, il 6 ottobre.
        if (/^\*\*Nomadi\*\*/.test(t)) { fazione = 'NOMADI'; return; }
        if (/^\*\*PanOceania\*\*/.test(t)) { fazione = 'PANOCEANIA'; return; }
        if (/^#{1,3}\s/.test(t)) { fazione = null; return; }
        const m = t.match(/^\|\s*(\d+)\s*\|\s*(.+?)\s*\|/);
        if (fazione && m) voci.push({ fazione: fazione, n: +m[1], grezzo: m[2], riga: i + 1 });
    });
    return voci;
}
// Il piano scrive i nomi in grassetto quando li vuole evidenziare: gli
// asterischi non fanno parte del nome.
const pulisci = (s) => String(s).replace(/\*\*/g, '').replace(/`/g, '').trim();
const esisteEsatto = (fazione, nome) => DB[fazione].some(u => u.nome === nome);
const esisteFamiglia = (fazione, nome) => {
    const fam = nome.split(' (')[0];
    return DB[fazione].some(u => u.nome.split(' (')[0] === fam);
};
const altraFazione = (f) => f === 'NOMADI' ? 'PANOCEANIA' : 'NOMADI';

const voci = leggiTabelle(fs.readFileSync(PIANO, 'utf8'));

console.log('\n=== 0. Le due tabelle si leggono ===');
ok(DB.NOMADI.length === 385 && DB.PANOCEANIA.length === 380,
   `database: ${DB.NOMADI.length} profili nomadi e ${DB.PANOCEANIA.length} panoceani`);
// 🔴 IL NUMERO ESATTO, non un ">= 30". Il 6 ottobre il parser leggeva 14
// righe su 35 (pretendeva ^\*\*Nomadi\*\*$ e il piano ha del testo in coda)
// e un controllo lasco non se ne accorgeva: 14 >= 30 era falso per caso, ma
// con una tabella piu` lunga sarebbe stato vero e il buco invisibile.
// Se il piano cresce, questa prova diventa rossa e il numero va aggiornato:
// e` il comportamento che voglio — un rosso che dice "aggiorna", non un
// verde che nasconde righe non lette.
const perFazione = voci.reduce(function (m, v) { m[v.fazione] = (m[v.fazione] || 0) + 1; return m; }, {});
// 🔴 QUESTI NUMERI VALGONO DALLA REVISIONE 12 DEL PIANO. Prima erano 24
// Nomadi e 39 righe: la 25esima e` l'Intruder (Hacker, Killer Hacking
// Device), aggiunto perche` il blocco F chiede le Grenades e nessun altro
// del roster le porta. Se questa prova e` rossa con 24/39, il piano che hai
// e` di una revisione precedente: NON e` un difetto, e` un disallineamento.
// (Il 7 ottobre ho cambiato questi numeri senza alzare la versione del
// banco, e due chat hanno letto due contenuti diversi sotto la stessa
// 2026-10-07.1. Da qui la .2.)
const REV_MINIMA = 16;
const testoPiano = fs.readFileSync(PIANO, 'utf8');
const revisione = (/revisione\s+(\d+)/.exec(testoPiano) || [])[1];
ok(revisione !== undefined && parseInt(revisione, 10) >= REV_MINIMA,
   `il piano e` + ` alla revisione ${revisione} e questo banco pretende almeno la ${REV_MINIMA}`);

// IL PIANO DEVE DIRE IL VERO SU SE STESSO.
// L 8 ottobre ho aggiunto nove prove e ho dovuto cambiare a mano il numero
// in CINQUE punti del testo. Dimenticarne uno non rompe niente e non si
// vede: il piano dichiara 275 prove e ne contiene 284, e chi lo esegue si
// fida del numero sbagliato. E` la stessa famiglia dell impronta vecchia
// citata dopo una modifica. Qui il numero dichiarato si confronta con
// quello CONTATO, e ogni punto del testo che lo nomina deve concordare.
const prove = (testoPiano.match(/^- \*\*Atteso:\*\*/gm) || []).length;
// `— ` dopo il codice: una prova si apre con "**SCO-01 — titolo**". Senza
// questo si prende anche "**SCO-01…SCO-05**" del changelog, che e` un
// riferimento, non una prova, e il controllo dei doppioni va rosso a torto.
const codici = (testoPiano.match(/^\*\*([A-Z]+-\d+) —/gm) || []).map(x => x.slice(2).replace(/ —$/, ''));
ok(prove > 0, `le prove si contano nel testo del piano (${prove} righe "Atteso")`);
ok(codici.length === prove,
   `e ogni prova ha il suo codice in testa, uno per una (${codici.length} codici per ${prove} prove)`);
const doppi = codici.filter((c, i) => codici.indexOf(c) !== i);
ok(doppi.length === 0,
   `nessun codice usato due volte${doppi.length ? ': ' + doppi.join(', ') : ''}`);
// I punti in cui il piano dichiara il PROPRIO numero di prove. Si nominano
// uno per uno: un "135 prove" che parla del blocco DC o un "3946 prove" che
// parla della suite non sono questo numero, e una regex larga li prendeva
// per sbaglio. Ogni voce e` [etichetta, regex con un gruppo].
const PUNTI = [
    ['intestazione',   /\*\*(\d{3,4}) prove, tutte nello stesso/],
    ['sezione 0',      /tutte e (\d{3,4}), nelle stesse/],
    ['convenzioni',    /stessa riga (\d{3,4}) volte/],
    ['codici univoci', /alla revisione \d+ sono (\d{3,4})/],
    ['blocco DC',      /prove su (\d{3,4})\n/]
];
const letti = PUNTI.map(([nome, re_]) => {
    const m = re_.exec(testoPiano);
    return { nome: nome, n: m ? parseInt(m[1], 10) : null };
});
ok(letti.every(x => x.n !== null),
   `i ${PUNTI.length} punti che dichiarano il numero di prove si trovano tutti (${J(letti.filter(x => x.n === null).map(x => x.nome))} mancanti)`);
const fuori = letti.filter(x => x.n !== null && x.n !== prove);
ok(fuori.length === 0,
   `e ognuno dichiara ${prove}, il numero contato${fuori.length ? ' — sbagliati: ' + fuori.map(x => x.nome + '=' + x.n).join(', ') : ''}`);
// E il numero delle prove incomplete, che il blocco DC dichiara: contato
// sulle prove vere, non ripreso dalla volta prima. Il 7 ottobre il piano
// diceva "135 prove su 277" e nessuno dei due numeri era giusto.
const blocchi = testoPiano.split(/(?=^\*\*[A-Z]+-\d+ —)/m).slice(1);
const incompiute = blocchi.filter(b => /DA COMPLETARE/.test(b)).length;
const dcDichiarate = (/(\d{2,4}) prove su \d{3,4}\n/.exec(testoPiano) || [])[1];
ok(blocchi.length === prove,
   `le prove si separano una per una (${blocchi.length} blocchi per ${prove} prove)`);
ok(dcDichiarate !== undefined && parseInt(dcDichiarate, 10) === incompiute,
   `il blocco DC dichiara ${dcDichiarate} prove con un campo da completare, contate ${incompiute}`);
ok(perFazione.NOMADI === 25 && perFazione.PANOCEANIA === 15,
   `righe lette per fazione: 25 Nomadi e 15 PanOceania (${JSON.stringify(perFazione)})`);
ok(voci.length === 40, `righe di schieramento lette dal piano: 40 (${voci.length})`);
ok(voci.some(v => v.fazione === 'NOMADI') && voci.some(v => v.fazione === 'PANOCEANIA'),
   'e vengono da entrambe le tabelle');
// CONTROPROVA della lettura: se il formato della tabella cambiasse, qui si
// leggerebbero zero righe e tutte le prove di sotto passerebbero A VUOTO.
// Si pretende quindi che almeno una riga nominata a mano sia stata trovata.
ok(voci.some(v => /Alguacil \(Combi Rifle\)/.test(pulisci(v.grezzo))),
   'e fra le righe lette c e l Alguacil (Combi Rifle): la lettura funziona');

console.log('\n=== 1. Ogni profilo chiesto dal piano esiste nel suo database ===');
const sbagliati = [];
voci.forEach(function (v) {
    const nome = pulisci(v.grezzo);
    if (esisteEsatto(v.fazione, nome)) return;
    sbagliati.push({
        riga: v.riga, fazione: v.fazione, nome: nome,
        motivo: esisteEsatto(altraFazione(v.fazione), nome) ? 'esiste, ma nell ALTRA fazione'
              : esisteFamiglia(v.fazione, nome) ? 'famiglia giusta, profilo inesistente (manca la parentesi?)'
              : esisteFamiglia(altraFazione(v.fazione), nome) ? 'la famiglia e` dell ALTRA fazione'
              : 'nessun profilo con questo nome in nessuna delle due'
    });
});
ok(sbagliati.length === 0,
   `profili inesistenti o nella fazione sbagliata: ${sbagliati.length}`,
   sbagliati.map(s => `riga ${s.riga} [${s.fazione}] "${s.nome}": ${s.motivo}`));
if (sbagliati.length) sbagliati.forEach(s =>
    console.log(`        riga ${s.riga} [${s.fazione}] "${s.nome}" — ${s.motivo}`));

console.log('\n=== 2. E il nome e` quello INTERO, non la famiglia ===');
// Un nome di famiglia nel piano ("Machinist") lascia a chi esegue la scelta
// del profilo, e i numeri attesi valgono per UN profilo solo. Questa prova
// e` separata dalla prima perche` dice una cosa diversa: non "non esiste",
// ma "non basta".
const soloFamiglia = voci.map(v => ({ v: v, nome: pulisci(v.grezzo) }))
    .filter(x => !esisteEsatto(x.v.fazione, x.nome) && esisteFamiglia(x.v.fazione, x.nome));
ok(soloFamiglia.length === 0,
   `righe che nominano la famiglia invece del profilo: ${soloFamiglia.length}`,
   soloFamiglia.map(x => `riga ${x.v.riga}: "${x.nome}"`));

console.log('\n=== 3. CONTROPROVA: il controllo sa accorgersene ===');
// Senza, "zero sbagliati" non distingue "il piano e` a posto" da "non sto
// guardando". Si costruiscono le tre forme del difetto trovato il 6 ottobre
// e si pretende che ciascuna venga vista.
const finte = [
    { fazione: 'PANOCEANIA', nome: 'Kulak (Hacker, Killer Hacking Device)', cosa: 'profilo vero, fazione sbagliata' },
    { fazione: 'NOMADI', nome: 'Zondmate', cosa: 'famiglia invece del profilo' },
    { fazione: 'NOMADI', nome: 'Puppetbot (Minelayer)', cosa: 'profilo che non esiste' },
    { fazione: 'PANOCEANIA', nome: 'Truppa Inventata (Fucile)', cosa: 'nome inventato' }
];
finte.forEach(function (f) {
    ok(!esisteEsatto(f.fazione, f.nome),
       `${f.cosa}: "${f.nome}" fra i ${f.fazione} viene rifiutato`);
});
// E il verso opposto: un profilo giusto passa. Un controllo che rifiuta
// tutto darebbe gli stessi quattro verdi di sopra.
ok(esisteEsatto('NOMADI', 'Alguacil (Combi Rifle)'),
   'mentre un profilo giusto passa: Alguacil (Combi Rifle) fra i NOMADI');
ok(esisteEsatto('PANOCEANIA', 'Fusilier (Combi Rifle)'),
   'e Fusilier (Combi Rifle) fra i PANOCEANIA');
ok(esisteEsatto('NOMADI', 'Zondmate (REM)') && esisteEsatto('PANOCEANIA', 'Machinist (Combi Rifle)'),
   'e i due nomi interi che correggono il piano esistono');

console.log('\n=== 4. Le unita` nominate nel CORPO del piano ===');
// Oltre alle tabelle, il piano nomina truppe nelle singole prove. Qui non si
// pretende il profilo intero — nel testo "Alguacil" per esteso sarebbe
// illeggibile — ma che la FAMIGLIA esista, e nella fazione giusta quando il
// piano la dichiara accanto al nome.
const testo = fs.readFileSync(PIANO, 'utf8');
const famiglie = {};
['NOMADI', 'PANOCEANIA'].forEach(f => DB[f].forEach(u => {
    const fam = u.nome.split(' (')[0];
    (famiglie[fam] = famiglie[fam] || { NOMADI: 0, PANOCEANIA: 0 })[f]++;
}));
// Le dichiarazioni esplicite: "<Nome>, PanOceania" oppure "<Nome> (PanOceania)"
const dichiarazioni = [];
[...testo.matchAll(/\*?\*?([A-Z][A-Za-z.\- ]{2,28}?)\*?\*?(?:\s*\([^)]*\))?\*?\*?,?\s*\(?(PanOceania|Nomadi)\)?/g)].forEach(m => {
    const fam = m[1].trim().replace(/\s+$/, '');
    const dichiarata = /PanOceania/i.test(m[2]) ? 'PANOCEANIA' : 'NOMADI';
    if (famiglie[fam]) dichiarazioni.push({ fam: fam, dichiarata: dichiarata });
});
const bugie = dichiarazioni.filter(d => famiglie[d.fam][d.dichiarata] === 0);
ok(dichiarazioni.length > 0, `dichiarazioni di fazione trovate nel testo: ${dichiarazioni.length}`);
ok(bugie.length === 0,
   `nessuna truppa dichiarata nella fazione sbagliata (${bugie.length})`,
   bugie.map(b => `"${b.fam}" dichiarata ${b.dichiarata}`));

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
