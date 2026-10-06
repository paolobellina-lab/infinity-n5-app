// @versione 2026-10-06.1 | test_ordini_senza_tiro.js | proprieta`: chat MOTORE
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

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
