// @versione 2026-10-06.2 | test_ordini_senza_tiro.js | proprieta`: chat MOTORE
// ============================================================================
//  ORDINI SENZA BERSAGLIO IN M.risolviPayload, E L'ADATTATORE.
//
//  Punti 21 e 22 dell'elenco di MOTORE del 6 ottobre.
//
//  DUE FAMIGLIE, e la differenza e` tutta nel campo `senzaTiro` della busta:
//   - CHI TIRA (Ingresso in campo, Supporto, Speedball): il tabellone mostra
//     un Tiro Normale. attivo.mod e` il valoreSuccesso della busta, la base
//     e` valorizzata, burst 1, senzaTiro false.
//   - CHI NON TIRA (Trincerarsi, Rientrare in CAMO, Cybermask): titolo
//     'ABILITA` SENZA TIRO', burst 0, mod null. Fino al 5 ottobre uscivano
//     con burst 1 — "un dado" per un Ordine che non tira — e le loro note si
//     perdevano per strada.
//
//  L'ADATTATORE (calcolatore_math.js) e` l'ultimo passaggio prima degli
//  occhi del giocatore: quello che il motore calcola e lui non copia non
//  esiste per chi gioca. rendiVoci non e` esportata, percio` si guarda il
//  suo risultato dove finisce davvero, in `dettagliMod`.
//
//  USO:  node test_ordini_senza_tiro.js  |  CARTELLA=/percorso/ node ...
// ============================================================================
const DIR = (process.env.CARTELLA || (__dirname + '/')).replace(/\/?$/, '/');
global.window = global;

let passati = 0, falliti = 0;
const J = JSON.stringify;
function ok(c, d, visto) {
    if (c) { passati++; console.log('  ✓ ' + d); }
    else { falliti++; console.log('  ✗ ' + d + (visto !== undefined ? '  [visto: ' + J(visto) + ']' : '')); }
}

require(DIR + 'catalogo_n5.js'); require(DIR + 'database_comune.js');
require(DIR + 'database_nomad.js'); require(DIR + 'database_panoceania.js');
const M = require(DIR + 'motore_regole_n5.js');

const TUTTI = [].concat(window.DB_NOMADI || [], window.DB_PANOCEANIA || []);
const pulita = (u) => Object.assign(JSON.parse(J(u)), { states: {}, deployState: 'NORMAL', state: 'ACTIVE' });
const hellcat = pulita(TUTTI.find(u => /^Hellcat \(Hacker\)/.test(u.nome)) || TUTTI.find(u => /^Hellcat/.test(u.nome)));
const alg = pulita(TUTTI.find(u => /^Alguacil \(Combi Rifle\)/.test(u.nome)));

console.log('\n=== 0. I profili ===');
ok(!!hellcat && !!alg, `Hellcat e Alguacil (${hellcat && hellcat.nome})`);
ok((parseInt(hellcat.ph, 10) || 0) === 12, `il Hellcat ha PH 12 (${hellcat.ph})`);

// Una busta come la costruiscono i moduli: ordine_supporto.js e
// ordine_trincerarsi.js mettono esattamente questi campi.
const bustaCheTira = (azione, unita, regole) => ({ attacchi: [{
    attaccante: unita, azione: azione,
    arma: { nome: 'Strumento', burst: 1, ammo: null, ammoOpzioni: [], bands: [],
            isTemplate: false, isCC: false, isDifesa: true, notazioni: [] },
    bersagli: [], burstDisponibile: 1,
    regole: Object.assign({ senzaTiro: false }, regole || {})
}] });
const bustaSenzaTiro = (azione, unita, note) => ({ attacchi: [{
    attaccante: unita, azione: azione, arma: null, bersagli: [], burstDisponibile: 0,
    regole: { senzaTiro: true, isLongSkill: true, note: note || [] }
}] });
const unoScontro = (busta) => {
    const sc = M.risolviPayload(busta, [], { trovaUnita: (n, id) => [hellcat, alg].find(u => u.id === id || M.nomeUnita(u) === n) });
    return (sc || [])[0] || null;
};

console.log('\n=== 1. Punto 21: chi TIRA — Ingresso in campo, Supporto, Speedball ===');
[[M.AZIONI.INGRESSO, 'Ingresso in campo', 'PH', 12],
 [M.AZIONI.SUPPORTO_WIP, 'Supporto', 'WIP', 13],
 [M.AZIONI.SPEEDBALL, 'Speedball', 'PH', 12]].forEach(function (riga) {
    const azione = riga[0], etichetta = riga[1], attributo = riga[2], valore = riga[3];
    const s = unoScontro(bustaCheTira(azione, hellcat, {
        attributo: attributo, valoreSuccesso: valore, base: valore, mod: 0,
        voci: [{ fonte: 'base', valore: valore, motivo: attributo + ' del Hellcat: ' + valore }]
    }));
    ok(!!s, `${etichetta}: lo scontro viene prodotto`);
    ok(s && s.attivo.mod === valore, `  attivo.mod e il valoreSuccesso della busta: ${valore} (${s && s.attivo.mod})`);
    ok(s && s.attivo.base === valore, `  e la base e valorizzata: ${valore} (${s && s.attivo.base})`);
    ok(s && s.attivo.burst === 1, `  burst 1 (${s && s.attivo.burst})`);
    ok(s && s.attivo.senzaTiro === false, `  senzaTiro false (${s && s.attivo.senzaTiro})`);
    ok(s && s.titolo === 'TIRO DI SUPPORTO / DIFESA',
       `  titolo "TIRO DI SUPPORTO / DIFESA" (${s && s.titolo})`);
});

console.log('\n=== 2. Punto 21: chi NON tira — Trincerarsi, Rientro in CAMO, Cybermask ===');
[[M.AZIONI.TRINCERARSI, 'Trincerarsi'],
 [M.AZIONI.RIENTRO_CAMO, 'Rientrare in CAMO'],
 [M.AZIONI.CYBERMASK, 'Cybermask']].forEach(function (riga) {
    const azione = riga[0], etichetta = riga[1];
    const s = unoScontro(bustaSenzaTiro(azione, hellcat, ['Nota di prova dell Ordine.']));
    ok(!!s, `${etichetta}: lo scontro viene prodotto`);
    ok(s && s.attivo.senzaTiro === true, `  senzaTiro true (${s && s.attivo.senzaTiro})`);
    ok(s && s.attivo.burst === 0, `  burst 0: chi non tira non ha dadi (${s && s.attivo.burst})`);
    ok(s && s.attivo.mod === null, `  mod null (${s && s.attivo.mod})`);
    ok(s && s.titolo === 'ABILITÀ SENZA TIRO', `  titolo "ABILITÀ SENZA TIRO" (${s && s.titolo})`);
    // La nota della busta arriva fino al tabellone: dal 5 ottobre.
    ok(s && (s.attivo.note || []).some(n => /Nota di prova/.test(n)),
       `  e la nota della busta arriva al tabellone (${J((s && s.attivo.note) || [])})`);
});

console.log('\n=== 3. Chi decide se si tira: la SPECIFICA dell azione ===');
// MISURATO IL 6 OTTOBRE, ed e` il contrario di quello che avevo supposto
// scrivendo questa prova. Non decide il campo `senzaTiro` della busta:
// decide M.SPEC[azione].tiro, la specifica dell'azione nel motore (righe
// 149-152: Trincerarsi, Rientrare in CAMO, Cybermask hanno tiro: false).
// La busta NON puo` scavalcarla, ed e` la garanzia piu` forte: un modulo
// che si sbagliasse a riempire `senzaTiro` non riuscirebbe a far tirare un
// Ordine che non tira, ne` a zittire un Ordine che tira.
ok(M.SPEC[M.AZIONI.TRINCERARSI] && M.SPEC[M.AZIONI.TRINCERARSI].tiro === false,
   `la specifica di Trincerarsi dice tiro: false (${M.SPEC[M.AZIONI.TRINCERARSI] && M.SPEC[M.AZIONI.TRINCERARSI].tiro})`);
ok(M.SPEC[M.AZIONI.RIENTRO_CAMO] && M.SPEC[M.AZIONI.RIENTRO_CAMO].tiro === false,
   'e quella di Rientrare in CAMO pure');
ok(!(M.SPEC[M.AZIONI.SUPPORTO_WIP] && M.SPEC[M.AZIONI.SUPPORTO_WIP].tiro === false),
   'mentre il Supporto non ha tiro: false');
// La prova: busta che dichiara il contrario, e vince la specifica.
const trincerarsiCheVorrebbeTirare = unoScontro(bustaCheTira(M.AZIONI.TRINCERARSI, hellcat, {
    attributo: 'PH', valoreSuccesso: 12, base: 12, mod: 0, voci: []
}));
ok(trincerarsiCheVorrebbeTirare && trincerarsiCheVorrebbeTirare.attivo.burst === 0 &&
   trincerarsiCheVorrebbeTirare.attivo.senzaTiro === true,
   `una busta che dichiara senzaTiro false NON fa tirare Trincerarsi (burst ${trincerarsiCheVorrebbeTirare && trincerarsiCheVorrebbeTirare.attivo.burst})`);
const supportoCheVorrebbeTacere = unoScontro(bustaSenzaTiro(M.AZIONI.SUPPORTO_WIP, hellcat, []));
ok(supportoCheVorrebbeTacere && supportoCheVorrebbeTacere.attivo.burst === 1,
   `e una busta con senzaTiro true non zittisce il Supporto (burst ${supportoCheVorrebbeTacere && supportoCheVorrebbeTacere.attivo.burst})`);

// Il punto 22 (l'adattatore) sta in test_adattatore.js, sezione 7: li` c'e`
// gia` l'intelaiatura giusta — window.gameState con i due roster — e
// generaRisoluzioneDaDati prende la BUSTA, non gli scontri gia` risolti.
// Scoperto il 6 ottobre passandogli un array di scontri: restituisce un
// array vuoto, senza un errore. Un adattatore che risponde "niente" a un
// ingresso della forma sbagliata e` comodo per chi lo chiama e pessimo per
// chi lo prova: la prova sarebbe rimasta verde su zero scontri se non
// avesse preteso i campi.

console.log('\n=== 5. Sagoma su più bersagli: PRINCIPALE e SECONDARIO ===');
// Campo nuovo di M.risolviPayload (motore .13), e Paolo l'ha visto sul giro a
// tre dispositivi: Digger con Grenades su due Fusilier, 'PRINCIPALE' sul
// primo scontro e 'SECONDARIO' sul secondo. Serve a chi disegna il tabellone
// per dire che UN SOLO tiro vale per tutti.
// NOTA: il controller oggi NON legge il campo — i due scontri sul tabellone
// si distinguono dalla nota. Il campo c'è e viaggia; chi lo usa è
// INTERFACCIA quando vorrà.
const TUTTI5 = [].concat(window.DB_NOMADI || [], window.DB_PANOCEANIA || []);
const digger = TUTTI5.find(u => /^Digger/.test(u.nome));
const fusBase = (window.DB_PANOCEANIA || []).find(u => /^Fusilier \(Combi Rifle\)/.test(u.nome));
ok(!!digger && !!fusBase, `Digger e Fusilier nel database (${digger && digger.nome})`);
const granate = M.profiloArma('Grenades');
ok(!!granate && granate.isTemplate === true, `le Grenades sono un'arma a Sagoma (${granate && granate.isTemplate})`);
const dig = Object.assign(JSON.parse(J(digger)), { id: 'd1', states: {} });
const f1 = Object.assign(JSON.parse(J(fusBase)), { id: 'f1', alias: 'Fusilier Uno', states: {} });
const f2 = Object.assign(JSON.parse(J(fusBase)), { id: 'f2', alias: 'Fusilier Due', states: {} });
const sagoma = (ruoli) => M.risolviPayload({ attacchi: [{
        attaccante: dig, azione: M.AZIONI.SPECULATIVO, arma: granate,
        bersagli: [{ id: 'f1', name: 'Fusilier Uno', burst: 1, rangeIndex: 1, rangeMod: 0, ruolo: ruoli[0] },
                   { id: 'f2', name: 'Fusilier Due', burst: 1, rangeIndex: 1, rangeMod: 0, ruolo: ruoli[1] }],
        regole: { attributo: 'PH' } }] }, [],
    { trovaUnita: (n, id) => [dig, f1, f2].find(u => u.id === id || M.nomeUnita(u) === n) });
const conRuoli = sagoma(['principale', 'secondario']);
ok(conRuoli.length === 2, `due bersagli, due scontri (${conRuoli.length})`);
ok(conRuoli[0] && conRuoli[0].bersaglioDiSagoma === 'PRINCIPALE',
   `il primo è PRINCIPALE (${conRuoli[0] && conRuoli[0].bersaglioDiSagoma})`);
ok(conRuoli[1] && conRuoli[1].bersaglioDiSagoma === 'SECONDARIO',
   `il secondo è SECONDARIO (${conRuoli[1] && conRuoli[1].bersaglioDiSagoma})`);
const noteSagoma = [].concat((conRuoli[0] || {}).note || []).join(' | ');
ok(/UN SOLO tiro vale per tutti i 2 bersagli/.test(noteSagoma),
   `e la nota dice che un solo tiro vale per tutti e due (${noteSagoma.slice(0, 70)})`);
// Il ripiego dichiarato: senza il campo `ruolo`, il PRIMO è il Principale.
const senzaRuoli = sagoma([undefined, undefined]);
ok(senzaRuoli[0] && senzaRuoli[0].bersaglioDiSagoma === 'PRINCIPALE' &&
   senzaRuoli[1] && senzaRuoli[1].bersaglioDiSagoma === 'SECONDARIO',
   `senza ruoli dichiarati il primo è il Principale (${J(senzaRuoli.map(s => s.bersaglioDiSagoma))})`);
// CONTROPROVA: con UN bersaglio solo il campo non compare. Altrimenti
// "PRINCIPALE" non distingue "lo ha deciso" da "lo scrive sempre".
const unoSolo = M.risolviPayload({ attacchi: [{
        attaccante: dig, azione: M.AZIONI.SPECULATIVO, arma: granate,
        bersagli: [{ id: 'f1', name: 'Fusilier Uno', burst: 1, rangeIndex: 1, rangeMod: 0 }],
        regole: { attributo: 'PH' } }] }, [],
    { trovaUnita: (n, id) => [dig, f1].find(u => u.id === id || M.nomeUnita(u) === n) });
ok(unoSolo.length === 1 && !unoSolo[0].bersaglioDiSagoma,
   `con un bersaglio solo il campo non c'è (${J(unoSolo[0] && unoSolo[0].bersaglioDiSagoma)})`);

console.log('\n=== 6. Abilità senza tiro: l Idle da requisito fallito ha un titolo suo ===');
// Campo nuovo (motore .13): `regole.idle` distingue "ha scelto di non tirare"
// da "non ha potuto". Due titoli diversi, perche` sul tabellone sono due
// cose diverse.
const senzaTiroIdle = (azione, idle) => M.risolviPayload({ attacchi: [{
        attaccante: hellcat, azione: azione, arma: null, bersagli: [], burstDisponibile: 0,
        regole: { senzaTiro: true, isLongSkill: true, idle: idle, note: [] } }] }, [],
    { trovaUnita: () => hellcat })[0] || {};
[[M.AZIONI.CYBERMASK, 'Cybermask'], [M.AZIONI.RIENTRO_CAMO, 'Rientrare in CAMO'],
 [M.AZIONI.TRINCERARSI, 'Trincerarsi']].forEach(function (riga) {
    const s = senzaTiroIdle(riga[0], true);
    ok(s.titolo === 'IDLE (REQUISITO FALLITO)', `${riga[1]} con idle: titolo IDLE (REQUISITO FALLITO) (${s.titolo})`);
    ok(s.attivo && s.attivo.requisitoFallito === true, `  requisitoFallito true (${s.attivo && s.attivo.requisitoFallito})`);
    ok(s.attivo && s.attivo.senzaTiro === true && s.attivo.burst === 0,
       `  senza tiro e burst 0 (${s.attivo && s.attivo.senzaTiro}, ${s.attivo && s.attivo.burst})`);
});
// CONTROPROVA: con idle false il titolo è l'altro, e il requisito non è
// fallito. Senza, i tre verdi non distinguono "legge il campo" da "scrive
// sempre IDLE".
const nonIdle = senzaTiroIdle(M.AZIONI.CYBERMASK, false);
ok(nonIdle.titolo === 'ABILITÀ SENZA TIRO', `con idle false: ABILITÀ SENZA TIRO (${nonIdle.titolo})`);
ok(nonIdle.attivo && nonIdle.attivo.requisitoFallito === false,
   `e requisitoFallito false (${nonIdle.attivo && nonIdle.attivo.requisitoFallito})`);

console.log('\n=== 7. Lo Scoprire che riesce da solo, e la FORMA DELLA CHIAMATA ===');
// Il 6 ottobre questo valore sembrava irriproducibile: con la mia busta
// usciva 'TIRO NORMALE', burst 1, mod -6. MOTORE ha riprodotto il sintomo e
// ha trovato la causa, che non era nel motore: l'attaccante passato come
// NOME e nessun ctx.trovaUnita. Il motore calcolava su un'unita` vuota —
// niente WIP, niente visore — e dava un numero plausibile in silenzio.
// Quindi questa sezione prova DUE cose insieme: il valore giusto, e che la
// forma sbagliata della chiamata non passi piu` inosservata (sezione 8).
const intrHMG = TUTTI5.find(u => /^Intruder \(HMG\)/.test(u.nome));
const crocMan = (window.DB_PANOCEANIA || []).find(u => /^Croc Man \(MULTI Sniper/.test(u.nome));
ok(!!intrHMG && !!crocMan, `Intruder (HMG) e Croc Man (MULTI Sniper Rifle) nel database`);
// L'MSV L2 dell'Intruder sta in `equip`, non in `skills`: cercarlo solo
// nelle skill dice "non ce l ha" (sbaglio mio del 6 ottobre, corretto).
ok(/Multispectral Visor L2/i.test(String(intrHMG.skills) + ' ' + String(intrHMG.equip)),
   'l Intruder ha il Multispectral Visor L2 (nel campo equip)');
const scopritore = Object.assign(JSON.parse(J(intrHMG)), { id: 'sc1', states: {}, deployState: 'NORMAL', state: 'ACTIVE' });
// Il Croc Man "come nasce": deployState 'CAMO' e nessun `states`. Basta
// cosi`, non serve states.camo (dichiarato da MOTORE, verificato qui).
const markerCamo = Object.assign(JSON.parse(J(crocMan)), { id: 'sc2' });
const trovaScoprire = (n, id) => [scopritore, markerCamo].find(u => u.id === id || M.nomeUnita(u) === n);
const scoprire = (attaccante, voceBersaglio, ctx) => M.risolviPayload({ attacchi: [{
        attaccante: attaccante, azione: M.AZIONI.SCOPRIRE, arma: null,
        bersagli: [voceBersaglio], regole: { nonOffensivo: true } }] }, [], ctx || {})[0] || {};
const voceMarker = { id: 'sc2', name: M.nomeUnita(markerCamo), burst: 1 };
const voceMarkerIntera = Object.assign({}, markerCamo, { burst: 1, name: M.nomeUnita(markerCamo) });

const autoOgg = scoprire(scopritore, voceMarker, { trovaUnita: trovaScoprire });
ok(autoOgg.titolo === 'SUCCESSO AUTOMATICO', `attaccante oggetto + trovaUnita: SUCCESSO AUTOMATICO (${autoOgg.titolo})`);
ok(autoOgg.attivo && autoOgg.attivo.burst === 0, `  burst 0: non si tira (${autoOgg.attivo && autoOgg.attivo.burst})`);
ok(autoOgg.attivo && autoOgg.attivo.mod === 'Auto', `  mod "Auto" (${J(autoOgg.attivo && autoOgg.attivo.mod)})`);
ok(autoOgg.attivo && autoOgg.attivo.successoAutomatico === true,
   `  successoAutomatico true (${autoOgg.attivo && autoOgg.attivo.successoAutomatico})`);
// Nessun campo `automatico` nella busta: lo decide il motore dal visore di
// chi scopre e dallo stato del bersaglio.
const autoNome = scoprire(M.nomeUnita(scopritore), voceMarker, { trovaUnita: trovaScoprire });
ok(autoNome.titolo === 'SUCCESSO AUTOMATICO',
   `attaccante per nome, ma risolto da trovaUnita: uguale (${autoNome.titolo})`);
const autoSenzaCtx = scoprire(scopritore, voceMarkerIntera, {});
ok(autoSenzaCtx.titolo === 'SUCCESSO AUTOMATICO',
   `oggetto e bersaglio intero, senza trovaUnita: uguale (${autoSenzaCtx.titolo})`);
// CONTROPROVA: lo stesso Croc Man RIVELATO si scopre con un tiro normale.
// Senza, "SUCCESSO AUTOMATICO" non distingue "il visore batte il CAMO" da
// "lo Scoprire riesce sempre".
const rivelato7 = Object.assign(JSON.parse(J(crocMan)), { id: 'sc2', deployState: 'NORMAL', state: 'ACTIVE', states: { camo: false } });
const suRivelato = M.risolviPayload({ attacchi: [{
        attaccante: scopritore, azione: M.AZIONI.SCOPRIRE, arma: null,
        bersagli: [{ id: 'sc2', name: M.nomeUnita(rivelato7), burst: 1 }], regole: { nonOffensivo: true } }] }, [],
    { trovaUnita: (n, id) => [scopritore, rivelato7].find(u => u.id === id || M.nomeUnita(u) === n) })[0] || {};
ok(suRivelato.titolo === 'TIRO NORMALE' && suRivelato.attivo.burst === 1,
   `su un Modello rivelato: TIRO NORMALE, burst 1, mod ${J(suRivelato.attivo.mod)}`);

console.log('\n=== 8. L attaccante non risolto ora LO DICE (motore .14) ===');
// Il difetto vero che il mio sintomo nascondeva: un attaccante passato per
// nome e non risolvibile dava un numero plausibile senza un fiato. E` la
// famiglia che inseguiamo — un dato mancante travestito da dato valido.
// Il calcolo NON cambia: cambia che adesso si sa.
const nonRisolto = scoprire('Nome Inventato', voceMarkerIntera, {});
ok(nonRisolto.attaccanteNonRisolto === true,
   `attaccante per nome e senza trovaUnita: attaccanteNonRisolto true (${nonRisolto.attaccanteNonRisolto})`);
ok((nonRisolto.avvisi || []).length === 1, `e un avviso, uno solo (${(nonRisolto.avvisi || []).length})`);
const testoAvviso = (nonRisolto.avvisi || []).map(a => String(a.messaggio || a)).join(' | ');
ok(/non trovato/.test(testoAvviso) && /non e` affidabile|non è affidabile/.test(testoAvviso),
   `col testo che dice che il risultato non è affidabile (${testoAvviso.slice(0, 80)}…)`);
ok((nonRisolto.note || []).some(n => /non trovato/.test(String(n))),
   'e lo stesso testo arriva anche nelle note, dove il tabellone lo legge');
// E il calcolo resta quello: il campo avvisa, non corregge.
ok(nonRisolto.titolo === 'TIRO NORMALE' && nonRisolto.attivo.burst === 1,
   `il calcolo non cambia: TIRO NORMALE, burst 1, mod ${J(nonRisolto.attivo.mod)}`);
// CONTROPROVA: con l attaccante risolto il campo è ASSENTE e gli avvisi 0.
// Senza, "true" non distingue "lo ha capito" da "lo scrive sempre".
ok(autoOgg.attaccanteNonRisolto === undefined,
   `con l attaccante risolto il campo non c è (${J(autoOgg.attaccanteNonRisolto)})`);
ok((autoOgg.avvisi || []).length === 0, `e nessun avviso (${(autoOgg.avvisi || []).length})`);

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
