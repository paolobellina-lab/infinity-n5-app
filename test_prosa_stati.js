// @versione 2026-09-24.1 | test_prosa_stati.js | proprieta`: chat TEST
// ================================================================
// La prosa mostrata al giocatore e il vocabolario degli stati devono dire
// le stesse cose. Famiglia proposta da INTERFACCIA il 23 settembre, dopo il
// ritiro del Prono: quando un nome esce dal vocabolario, i testi che lo
// citano restano — come un campo che nessuno riempie, ma in prosa.
//
// Due direzioni, e servono entrambe:
//   1. un nome citato nei TESTI che il vocabolario non ha
//   2. un flag che la PAGINA STATI sa impostare e che il motore non sa nominare
// La seconda ha trovato lo Stato Scarico: casella st-unload nella pagina,
// icona icon_unloaded.png, e statiAttivi che restituisce lista vuota.
// ================================================================
let passati = 0, falliti = 0;
const ok = (c, m) => { if (c) { passati++; console.log('  ✅ ' + m); } else { falliti++; console.log('  ❌ ' + m); } };
const J = JSON.stringify, fs = require('fs');

global.window = global;
require('./catalogo_n5.js'); require('./database_comune.js');
const M = require('./motore_regole_n5.js');

// Il vocabolario: QUATTRO elenchi veri, non una lista scritta qui.
// Il quarto — le categorie — serve perche` "Stato Nullo" e` una categoria e
// non uno stato: senza, risultava sconosciuto (osservazione di INTERFACCIA,
// che con un elenco a mano aveva nove falsi allarmi). Quando MOTORE unifica
// i due vocabolari, questa raccolta si accorcia da sola.
const noti = new Set();
Object.values(M.NOMI_STATI || {}).forEach(v => noti.add(String(v.nome || v).toUpperCase()));
Object.entries(window.CATALOGO_N5.STATI || {}).forEach(([k, v]) => {
    noti.add(k.toUpperCase()); if (v && v.nome) noti.add(String(v.nome).toUpperCase());
});
Object.entries(window.CATALOGO_N5.STATI_NON_GESTITI || {}).forEach(([k, v]) => {
    noti.add(k.toUpperCase()); if (v && v.nome) noti.add(String(v.nome).toUpperCase());
});
(window.CATALOGO_N5.CATEGORIE_STATI || []).forEach(c => noti.add(String(c).toUpperCase()));
// "Impersonation-1" e "IMM-A" sono LIVELLI dello stesso stato: il suffisso va
// via prima del confronto, altrimenti ogni livello nuovo e` un falso allarme.
const base = (n) => String(n).toUpperCase().replace(/-(\d+)$/, '').trim();

// Parole che nella prosa seguono "Stato/Stati" senza essere nomi di stato:
// categorie (Nullo, Nulli, Null), pezzi di nomi composti (Fuoco di
// Soppressione), e la forma Marker. Tenerle fuori a mano e` necessario, ma
// va dichiarato: un elenco che cresce senza motivo nasconde i casi veri.
// Restano fuori solo le parole che non sono nomi di stato in nessun senso:
// "Nulli" e "Null" (plurale e forma inglese della categoria) e "Fuoco",
// "Marker" (pezzi di nomi composti spezzati dalla lettura).
const NON_STATI = ['NULLI', 'NULL', 'FUORI', 'FUOCO', 'MARKER'];
// Dichiarati fuori dall'app: dal 23 settembre l'elenco sta nel CATALOGO
// (CATALOGO_N5.STATI_NON_GESTITI), non qui. Prima era una lista nel test,
// e nessuno doveva ricordarsi di tenerla allineata al catalogo.
const NON_GESTITI = Object.keys(window.CATALOGO_N5.STATI_NON_GESTITI || {}).map(k => k.toUpperCase());
// Scarico non e` ancora dichiarato: resta un'eccezione del test finche` MOTORE
// non decide se dargli un nome o togliere la casella. Dichiararla qui, e non
// dentro la condizione, la rende visibile.
// La lista delle eccezioni nel test non c'e` piu`: dal 23 settembre sia il
// Prono sia lo Scarico sono dichiarati nel catalogo. Chi ne aggiunge un
// terzo lo dichiara la`, e questo banco lo legge senza modifiche.
const IN_ATTESA = [];

console.log('\n=== 1. I nomi citati nei testi ===');
const testo = ['catalogo_n5.js', 'motore_regole_n5.js'].map(f => fs.readFileSync(f, 'utf8')).join('\n');
const citati = {};
let m; const re = /Stat[oi]\s+([A-Z][A-Za-zÀ-ú]+(?:-[AB])?)/g;
while ((m = re.exec(testo))) citati[m[1].toUpperCase()] = (citati[m[1].toUpperCase()] || 0) + 1;
ok(Object.keys(citati).length > 5, `nomi citati nella prosa: ${Object.keys(citati).length}`);
// La dichiarazione deve esistere ed essere leggibile: senza, il controllo
// tornerebbe a fidarsi di una lista scritta nel test.
ok(NON_GESTITI.length > 0, `CATALOGO_N5.STATI_NON_GESTITI dichiara ${NON_GESTITI.length} stato/i: ${J(NON_GESTITI)}`);
const prono = Object.values(window.CATALOGO_N5.STATI_NON_GESTITI || {})[0] || {};
ok(prono.regolamento && prono.perche && prono.promemoria,
   'e per ognuno dice dove sta nel regolamento, perché l app non lo tiene, e cosa ricordare al giocatore');
const fuori = Object.keys(citati)
    .map(base)
    .filter(n => !NON_STATI.includes(n))
    .filter(n => !noti.has(n));
const inattesi = fuori.filter(n => !NON_GESTITI.includes(n) && !IN_ATTESA.includes(n));
ok(inattesi.length === 0,
   'ogni nome citato è nel vocabolario, o è dichiarato non gestito (fuori: ' + J(inattesi) + ')');
// Un nome solo per lo stato del Marker (decisione di Paolo, 23 settembre:
// "CAMO" ovunque). Prima erano due — "Mimetizzato" sul tabellone e
// "Camuffato" nelle note — e il primo si confondeva anche con la skill
// Mimetismo, che e` un'altra cosa. La prova guarda i due nomi vecchi: se uno
// rientra nella prosa, torna rossa.
const nomiVecchi = ['CAMUFFATO', 'MIMETIZZATO'];
const rientrati = Object.keys(citati).map(base).filter(n => nomiVecchi.includes(n));
ok(rientrati.length === 0, `un nome solo per il Marker: i vecchi non rientrano (${J(rientrati)})`);
ok(String((M.NOMI_STATI.camo || {}).nome).toUpperCase() === 'CAMO',
   `e il vocabolario dice CAMO (${(M.NOMI_STATI.camo || {}).nome})`);
// Controprova: la skill Mimetismo esiste e NON e` stata toccata — era il
// nome con cui lo stato si confondeva.
ok(/Mimetism/i.test(J(window.CATALOGO_N5.SKILL || {})), 'controprova: la skill Mimetismo c e ancora, ed e un altra cosa');

console.log('\n=== 2. I flag impostabili e i nomi che il motore sa dire ===');
const sorgenteStati = fs.readFileSync('logica_stati.js', 'utf8');
const flag = [...new Set([...sorgenteStati.matchAll(/s\.([a-zA-Z]+) \? .checked/g)].map(x => x[1]))];
ok(flag.length > 10, `flag che la pagina stati sa impostare: ${flag.length}`);
const senzaNome = flag.filter(f => M.statiAttivi({ states: { [f]: true } }).length === 0);
ok(senzaNome.length === 0 || senzaNome.every(f => NON_GESTITI.includes(String(f).toUpperCase())),
   `nessun flag impostabile resta senza nome, tranne i dichiarati (senza nome: ${J(senzaNome)})`);
// Scarico: deciso il 23 settembre — casella via, come il Prono, perche` non
// da` MOD (lo Unloaded State impedisce di usare l'arma esaurita, e gli usi
// Disposable il motore li conta gia`). Ora la pagina non lo imposta piu`.
ok(!flag.includes('unloaded'), 'la casella dello Scarico non c\'è più fra i flag impostabili');
ok(Object.values(window.CATALOGO_N5.STATI_NON_GESTITI || {}).some(v => /Scarico/i.test(v.nome || '')),
   'ed è dichiarato fra gli stati non gestiti, accanto al Prono');

console.log('\n=== 3. Controprova: il controllo sa dire di no ===');
// Senza, un elenco vuoto non distingue "tutto a posto" da "non sto guardando".
const finti = {};
let m2; const re2 = /Stat[oi]\s+([A-Z][A-Za-zÀ-ú]+)/g;
const prosaFinta = 'Lo Stato Inventato annulla lo Stato Bersagliato.';
while ((m2 = re2.exec(prosaFinta))) finti[m2[1].toUpperCase()] = 1;
ok(Object.keys(finti).includes('INVENTATO') && Object.keys(finti).includes('BERSAGLIATO'),
   'il lettore trova i nomi dentro una prosa di prova');
ok(!noti.has('INVENTATO') && noti.has('BERSAGLIATO'),
   'e distingue quello che il vocabolario non ha da quello che ha');


console.log('\n=== 4. Un vocabolario solo ===');
// Il 24 settembre MOTORE ha unificato: CATALOGO_N5.STATI ha ora le stesse
// chiavi di M.NOMI_STATI, Marker e Foxhole compresi. Le due prove che
// fissavano la divergenza sono diventate rosse, ed era il segnale giusto.
const perFlag = Object.keys(window.CATALOGO_N5.STATI || {});
const perNome = Object.keys(M.NOMI_STATI || {});
ok(perFlag.length === perNome.length, `stesso numero di voci: catalogo ${perFlag.length}, NOMI_STATI ${perNome.length}`);
const soloCat = perFlag.filter(k => !perNome.includes(k));
const soloNomi = perNome.filter(k => !perFlag.includes(k));
ok(soloCat.length === 0 && soloNomi.length === 0,
   `nessuno stato sta da una parte sola (catalogo ${J(soloCat)}, NOMI_STATI ${J(soloNomi)})`);
ok(['camo', 'imp', 'holoecho', 'holomask', 'decoy', 'hidden', 'foxhole'].every(k => perFlag.includes(k)),
   'i sei Marker e il Foxhole sono nel catalogo, dove prima non c erano');
const senzaLeggibile = Object.entries(window.CATALOGO_N5.STATI || {}).filter(([, v]) => !(v && v.nome));
ok(senzaLeggibile.length === 0, `ogni stato ha un nome leggibile (senza: ${senzaLeggibile.length})`);

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
