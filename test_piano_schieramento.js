// @versione 2026-10-19.2 | test_piano_schieramento.js | proprieta`: chat TEST
// 2026-10-19.2: REV_MINIMA = 32 (OSS-01 e OSS-03: la scheda del bersaglio di
//    Forward Observer e Triangulated Fire). Le prove restano 290.
// 2026-10-19.1: REV_MINIMA = 31. Le prove passano da 284 a 290 (SUP-02a/b, SUP-04a/b,
//    ST-16a/b, ST-21, DET-07, DET-08): i codici accettano una lettera minuscola finale.
// 2026-10-16.2: database 379 + 368 = 747.
// 2026-10-16.1: database 383 + 375 = 758 (cancellati tre doppioni PanOceania).
// 2026-10-15.1: adottata la revisione 30 (riscritta da MOTORE per Paolo, 284
//    prove). REV_MINIMA = 30; roster 39 Nomadi + 16 PanOceania = 55 (nuovi
//    Marspider #38, Clockmaker Armed Turret #39, Laxmee #16 Pano); il numero
//    delle prove incompiute non e` piu` in grassetto ("Prove con un campo da
//    completare: 0 prove su 284"); i conteggi Cube e Irregular non sono piu`
//    dichiarati: se il piano li dichiara devono tornare, altrimenti resta la
//    controprova sul campo chars.
// 2026-10-12.4: REV_MINIMA = 29.
// 2026-10-12.3: REV_MINIMA = 28. Il database passa a 383 + 378 = 761 profili
//    (database .12.3: cancellati evader_multi_tb, triggermen_multi,
//    hannibal_cmd, hannibal_strategic); il Cube scende a 526.
// 2026-10-12.2: REV_MINIMA = 27. Le prove passano da 297 a 299 (DET-06 e
//    DIS-06); i cinque punti del numero li controlla gia` questo banco.
// 2026-10-12.1: REV_MINIMA = 26. Due conteggi che il piano dichiarava "0 su
//    765" (Cube, Irregular) erano cercati nelle skill: stanno in `chars`. Ora
//    il piano dichiara 530 e 82, e questo banco li ricalcola dal database.
// 2026-10-10.1: REV_MINIMA = 25. Il roster di collaudo passa da 43 a 52 righe
//    (37 Nomadi, 15 PanOceania): nove voci AGGIUNTE, per nove prove che
//    nominavano una truppa non schierata (LOG-02, DIS-02 due volte, DET-04 due
//    volte, MU-07, MU-08, MU-10, MU-21, MU-23). Le prove restano 297.
// .8 (9 ott, sera): REV_MINIMA = 24 — il blocco DC va a ZERO. Il numero delle
//    prove incompiute sta ora in grassetto nel titolo ("**0 prove su 297**") e
//    il gruppo della regex accetta UNA cifra: con \d{2,4} lo zero non sarebbe
//    stato letto e la prova sarebbe passata per assenza di numero.
// .7 (9 ott, sera): il roster di collaudo passa da 40 a 43 righe (28 Nomadi,
//    15 PanOceania). REV_MINIMA = 23.
// .6 (9 ott, sera): REV_MINIMA = 22 — il piano completa FT e GUI (7 prove),
//    trova il difetto del +1 SD del Fireteam e corregge GUI-01/03/05; restano 25.
// .5 (9 ott, sera): REV_MINIMA = 21 — il piano completa CC e SUP (12 prove),
//    trova il difetto SUP-05 e corregge CC-02; restano 32 prove da completare.
// .4 (9 ott, pomeriggio): REV_MINIMA = 20 — il piano completa BS, HK e TER
//    (24 prove) e corregge TER-04; restano 44 prove da completare.
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
ok(DB.NOMADI.length === 379 && DB.PANOCEANIA.length === 368,   // 747 dal database 2026-10-16.2: tolte 11 righe doppie (4 Nomadi, 7 PanOceania)
     // 758 dal database 2026-10-16.1: cancellati anche fusilier_lt2, orc_lieutenant, orc_lieutenant_2
     // 761 dal database .12.3
  
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
const REV_MINIMA = 32;
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
// 19 ottobre: un codice puo` finire con una lettera minuscola (SUP-02a, SUP-02b).
const codici = (testoPiano.match(/^\*\*([A-Z]+-\d+[a-z]?) —/gm) || []).map(x => x.slice(2).replace(/ —$/, ''));
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
    ['blocco DC',      /campo da completare:\s*\**\d{1,4} prove su (\d{3,4})/]
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
const blocchi = testoPiano.split(/(?=^\*\*[A-Z]+-\d+[a-z]? —)/m).slice(1);
const incompiute = blocchi.filter(b => /DA COMPLETARE/.test(b)).length;
// 9 ottobre sera: il blocco DC e` arrivato a ZERO, e il numero sta in grassetto
// nel titolo ("**0 prove su 297**"). Il gruppo accetta UNA cifra: con \d{2,4}
// lo zero non sarebbe stato letto e la prova sarebbe diventata "undefined" —
// cioe` verde per assenza di numero invece che per numero giusto.
const dcDichiarate = (/campo da completare:\s*\**(\d{1,4}) prove su \d{3,4}/.exec(testoPiano) || [])[1];
ok(blocchi.length === prove,
   `le prove si separano una per una (${blocchi.length} blocchi per ${prove} prove)`);
ok(dcDichiarate !== undefined && parseInt(dcDichiarate, 10) === incompiute,
   `il blocco DC dichiara ${dcDichiarate} prove con un campo da completare, contate ${incompiute}`);
// 9 ottobre sera: il roster passa da 40 a 43. Le tre voci nuove (Nomadi
// 26-28) sono state AGGIUNTE, non sostituite, per una ragione misurata: ogni
// voce delle 40 era nominata da almeno una prova, e cinque da una sola —
// sostituirne una avrebbe tolto il soggetto a quella prova. Aggiungere non
// costa nessuna prova; costa solo questi due numeri.
// 10 ottobre: da 43 a 52, sempre aggiungendo (vedi la nota in testa).
ok(perFazione.NOMADI === 39 && perFazione.PANOCEANIA === 16,
   `righe lette per fazione: 39 Nomadi e 16 PanOceania (${JSON.stringify(perFazione)})`);
ok(voci.length === 55, `righe di schieramento lette dal piano: 55 (${voci.length})`);
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


// LE CARATTERISTICHE SI CERCANO IN `chars`. Fino alla revisione 25 il piano
// diceva "Cube: 0 su 765" e "IRREGULAR: 0 su 765", e li aveva cercati nelle
// skill. Qui i due numeri che il piano dichiara ora si ricalcolano dal
// database, voce per voce: se il piano o il database cambiano, si vede.
{
    const tutti = [...DB.NOMADI, ...DB.PANOCEANIA];
    const voce = (v) => tutti.filter(p => String(p.chars || '').split(',').map(x => x.trim()).indexOf(v) >= 0).length;
    const cube = voce('Cube'), irr = voce('Irregular');
    const dichCube = (/`Cube` su \*\*(\d+)\*\* profili/.exec(testoPiano) || [])[1];
    const dichIrr = (/`Irregular` su \*\*(\d+)\*\* profili/.exec(testoPiano) || [])[1];
    // Dalla revisione 30 il piano non dichiara piu` questi conteggi: se li
    // dichiara, devono tornare col database.
    ok(dichCube === undefined || parseInt(dichCube, 10) === cube,
       `il piano dichiara Cube su ${dichCube} profili, il database (campo chars, voce esatta) ne ha ${cube}`);
    ok(dichIrr === undefined || parseInt(dichIrr, 10) === irr,
       `il piano dichiara Irregular su ${dichIrr} profili, il database ne ha ${irr}`);
    // Controprova: nelle skill non c'e` nessuno dei due. E` il campo dove
    // li cercavo, e il motivo dello zero sbagliato.
    const inSkill = tutti.filter(p => /\bCube\b|Irregular/.test(String(p.skills || ''))).length;
    ok(inSkill === 0 && cube > 0 && irr > 0, `CONTROPROVA: nelle skill nessuno dei due (${inSkill}); in chars ci sono`);
}

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
