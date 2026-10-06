// @versione 2026-10-06.1 | test_adattatore.js | proprieta`: chat TEST
// Test dell'adattatore calcolatore_math.js — node test_adattatore.js
global.window = global;
require('./catalogo_n5.js'); require('./database_comune.js');
require('./motore_regole_n5.js');
const M = window.MotoreN5;
require('./calcolatore_math.js');

let passati = 0, falliti = 0;
function ok(c, n, e) { if (c) { passati++; console.log(`  ✅ ${n}`); } else { falliti++; console.log(`  ❌ ${n}${e ? '\n       ' + e : ''}`); } }
const testo = (h) => String(h || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

const alg = { alias: 'Alguacil', bs: 11, cc: 13, ph: 10, wip: 12, arm: 1, bts: 0, skills: '', states: {}, combatGroup: 1 };
const fus = { alias: 'Fusilier', bs: 12, cc: 13, ph: 10, wip: 13, arm: 1, bts: 0, skills: '', states: {}, combatGroup: 1 };
const tag = { alias: 'Squalo', bs: 13, cc: 18, ph: 14, wip: 13, arm: 8, bts: 6, skills: '', states: {}, combatGroup: 1 };
const combi = M.profiloArma('Combi Rifle');

function prepara(aro) {
    window.gameState = { activeFaction: 'NOMADI', nomads: [alg], panoceania: [fus, tag] };
    window.latestAroData = aro || [];
}
function risolvi(bersagli, azione, arma) {
    return window.generaRisoluzioneDaDati({ attacchi: [{
        attaccante: 'Alguacil', azione: azione || M.AZIONI.BS_ATTACK,
        arma: arma || combi, bersagli: bersagli
    }] });
}

console.log('\n=== 1. La forma d uscita è invariata ===');
prepara([{ nome: 'Fusilier', azione: 'DODGE', hasLoF: true, burst: 1 }]);
const r = risolvi([{ name: 'Fusilier', burst: 3, rangeIndex: 2, rangeMod: -3, cover: true, ammo: 'N', terrain: 'NESSUNO' }]);
ok(Array.isArray(r) && r.length === 1, 'restituisce un array di scontri');
const s = r[0];
['titolo', 'attivo', 'reattivo'].forEach(k => ok(s[k] !== undefined, `campo "${k}" presente`));
['nome', 'fazione', 'azione', 'mod', 'burst', 'dettagliMod', 'salvezza'].forEach(k =>
    ok(s.attivo[k] !== undefined, `attivo.${k} presente`));
ok(s.reattivo.fazione === 'PANOCEANIA', 'la fazione reattiva è quella giusta');

console.log('\n=== 2. I numeri sono quelli del motore ===');
ok(s.titolo === 'TIRO FACCIA A FACCIA', 'Faccia a Faccia');
ok(s.attivo.mod === 5, `BS 11 -3 gittata -3 copertura = 5 (ottenuto ${s.attivo.mod})`);
ok(s.attivo.burst === 3 && s.reattivo.burst === 1, 'Burst 3 in attivo, 1 in ARO');
ok(s.reattivo.mod === 10, 'Schivata a PH 10');

console.log('\n=== 3. L HTML si costruisce dalle voci ===');
const d = testo(s.attivo.dettagliMod);
ok(d.includes('BS): 11'), 'la statistica base è mostrata');
ok(d.includes('Gittata') && d.includes('-3'), 'la gittata compare col suo valore');
ok(d.includes('Copertura'), 'la copertura compare');
// 🔴 `salvezza` ora mostra quella che la truppa DEVE superare; quella che
// INFLIGGE al bersaglio sta in `salvezzaInflitta`. Sono due numeri diversi,
// e prima l'interfaccia mostrava sotto ciascuno il numero dell'altro.
const sv = testo(s.attivo.salvezzaInflitta);
ok(sv.includes('11 o MENO'), 'il Tiro Salvezza mostra il valore');
ok(sv.includes('ARM 4 + PS 7'), 'e la scomposizione: ARM 1 +3 copertura, PS 7');

console.log('\n=== 4. I dati grezzi restano disponibili ===');
ok(Array.isArray(s.attivo.dati.voci), 'attivo.dati.voci è l elenco delle voci');
ok(s.attivo.dati.voci.every(v => v.fonte && v.motivo), 'ogni voce ha fonte e motivo');
ok(s.attivo.dati.salvezzaInflitta.valoreSuccesso === 11, 'il valore di salvezza è nei dati');
ok(typeof s.motivoConfronto === 'string', 'il motivo del confronto è esposto');

console.log('\n=== 5. Più bersagli, più scontri ===');
prepara([]);
const multi = risolvi([
    { name: 'Fusilier', burst: 2, rangeIndex: 1, rangeMod: 3, cover: false, ammo: 'N', terrain: 'NESSUNO' },
    { name: 'Squalo',   burst: 1, rangeIndex: 1, rangeMod: 3, cover: true,  ammo: 'N', terrain: 'NESSUNO' }
]);
ok(multi.length === 2, 'due bersagli, due scontri');
ok(multi[0].attivo.burst === 2 && multi[1].attivo.burst === 1, 'i dadi sono divisi come nel payload');
ok(multi.every(x => x.titolo === 'TIRO NORMALE'), 'senza ARO: Tiri Normali');

console.log('\n=== 6. LE CORREZIONI, dal vivo ===');
prepara([]);
const sagoma = risolvi([{ name: 'Fusilier', burst: 1, cover: true, ammo: 'N', terrain: 'NESSUNO' }],
                        M.AZIONI.BS_ATTACK, M.profiloArma('Chain Rifle'));
ok(sagoma[0].attivo.mod === 'Auto', 'Sagoma Diretta: colpo automatico');
ok(testo(sagoma[0].attivo.salvezzaInflitta).includes('8 o MENO'),
   'e chi è colpito NON ha il +3 di Copertura al Tiro Salvezza');

const k1 = risolvi([{ name: 'Squalo', burst: 1, rangeIndex: 1, rangeMod: 3, ammo: 'N', terrain: 'NESSUNO' }],
                    M.AZIONI.BS_ATTACK, M.profiloArma('K1 Combi Rifle'));
ok(testo(k1[0].attivo.salvezzaInflitta).includes('ARM 0'),
   'K1: ARM azzerato dal Weapon Chart, non dedotto dal nome dell arma');

const breaker = risolvi([{ name: 'Squalo', burst: 1, rangeIndex: 1, rangeMod: 3, ammo: 'AP', terrain: 'NESSUNO' }],
                         M.AZIONI.BS_ATTACK, M.profiloArma('Breaker Combi Rifle'));
ok(testo(breaker[0].attivo.salvezzaInflitta).includes('su BTS'),
   'Breaker: salvezza su BTS malgrado la munizione AP');

console.log('\n=== 7. IL FIRETEAM, che non arrivava mai al calcolo ===');
const algFT = Object.assign({}, alg, { states: { fireteam: 'A' }, combatGroup: 1 });
const gregari = [1, 2, 3].map(i => ({ alias: 'G' + i, combatGroup: 1, states: { fireteam: 'A' }, bs: 11 }));
window.gameState = { activeFaction: 'NOMADI', nomads: [algFT].concat(gregari), panoceania: [fus] };
window.latestAroData = [];
const ft = window.generaRisoluzioneDaDati({ attacchi: [{
    attaccante: 'Alguacil', azione: M.AZIONI.BS_ATTACK, arma: combi,
    bersagli: [{ name: 'Fusilier', burst: 3, rangeIndex: 1, rangeMod: 3, ammo: 'N', terrain: 'NESSUNO' }]
}] });
ok(ft[0].attivo.mod === 15, `Fireteam da 4: BS 11 +3 gittata +1 fireteam = 15 (ottenuto ${ft[0].attivo.mod})`);
ok(testo(ft[0].attivo.dettagliMod).includes('Fireteam'), 'e il bonus è spiegato');

console.log('\n=== 8. calcolaSalvezza: firma invariata ===');
ok(testo(window.calcolaSalvezza('N', 7, 1, 0, 10, false, fus, false, '')).includes('8 o MENO'),
   'ARM 1 + PS 7 = 8');
ok(testo(window.calcolaSalvezza('N', 7, 1, 0, 10, true, fus, false, '')).includes('11 o MENO'),
   'con Copertura: 11');
const hk = testo(window.calcolaSalvezza('DA', 7, 8, 6, 14, -6, tag, true, 'CARBONITE'));
ok(hk.includes('su BTS'), 'hacking: salvezza su BTS');
ok(hk.includes('16 o MENO'), 'BTS 6 +3 Firewall +7 PS = 16');
ok(hk.includes('2 Dadi'), 'Carbonite usa DA: due dadi');

console.log('\n=== 9. Il file è molto più piccolo ===');
// Si contano le righe di CODICE, non quelle totali: il file nuovo ha molti
// più commenti dell'originale — spiegano cosa è stato tolto e perché — e
// contarli come se fossero codice misura la cosa sbagliata.
function righeCodice(f) {
    return require('fs').readFileSync(f, 'utf8').split('\n')
        .filter(function (r) {
            const t = r.trim();
            return t && !t.startsWith('//') && !t.startsWith('*') && !t.startsWith('/*');
        }).length;
}
const cod = righeCodice('./calcolatore_math.js');
const codOrig = righeCodice('./calcolatore_math_ORIGINALE.js');
ok(cod < codOrig / 2,
   `codice: ${codOrig} righe -> ${cod} (il monolite di 358 righe non c è più)`);
const src = require('fs').readFileSync('./calcolatore_math.js', 'utf8');
['VIRAL', 'NANOTECH', 'BIOWEAPON', 'ADHESIVE'].forEach(function (m) {
    ok(!new RegExp('includes\\("' + m + '"\\)').test(src), `nessun ramo morto per ${m}`);
});
ok(!src.includes('-= 99') && !src.includes('- 99'), 'nessun -99 come segnaposto');
// il nome compare solo nel commento che documenta il bug rimosso:
// si controlla il CODICE, non il file intero.
const codice = src.split('\n').filter(r => !/^\s*\/\//.test(r)).join('\n');
ok(!codice.includes('window.currentOrder'),
   'il programma di hacking non viene più da window.currentOrder (resta solo il commento che lo documenta)');

console.log('\n=== 10. Punto 22: i campi che il motore scrive e il tabellone legge ===');
// Richiesto da MOTORE il 6 ottobre. L'adattatore e` l'ultimo passaggio
// prima degli occhi del giocatore: quello che il motore calcola e lui non
// copia non esiste per chi gioca.
// NOTA SULLA FORMA: generaRisoluzioneDaDati prende la BUSTA, non gli
// scontri gia` risolti. Passandogli un array di scontri risponde con un
// array VUOTO e nessun errore (provato il 6 ottobre) — percio` ogni prova
// qui pretende prima che lo scontro ci sia.
prepara([{ nome: 'Fusilier', azione: 'ATTACCO BS', arma: combi, hasLoF: true, burst: 3, rangeIndex: 1 }]);
// La Copertura negata da un'Abilita` dichiarata nell'Ordine. MISURATO il 6
// ottobre quali la negano: il SALTO (righe 2762-2763) e l'Ingresso in campo;
// il Movimento NO. Scrivere qui "MOVIMENTO", come avevo fatto, dava un campo
// assente e una prova rossa per lo scenario, non per il codice.
const conNegata = window.generaRisoluzioneDaDati({
    attacchi: [{ attaccante: 'Alguacil', azione: M.AZIONI.BS_ATTACK, arma: combi,
                 bersagli: [{ name: 'Fusilier', burst: 3, rangeIndex: 1, rangeMod: 0, cover: true, ammo: 'N', terrain: 'NESSUNO' }],
                 azionePrimaMeta: 'SALTO' }],
    azioniDichiarate: ['SALTO', 'ATTACCO BS']
});
ok(Array.isArray(conNegata) && conNegata.length === 1,
   `lo scontro viene prodotto (${Array.isArray(conNegata) ? conNegata.length : typeof conNegata})`);
const cn = conNegata[0] || {};
ok(!!cn.coperturaNegata,
   `coperturaNegata arriva al tabellone (${JSON.stringify(cn.coperturaNegata && cn.coperturaNegata.nome)})`);
// `riga` e` una STRINGA, non un numero: per il Salto vale '2762-2763', un
// intervallo. Pretendere un numero la faceva cadere.
ok(cn.coperturaNegata && /\d{3,}/.test(String(cn.coperturaNegata.riga)),
   `con la riga di regolamento (${cn.coperturaNegata && cn.coperturaNegata.riga})`);
// CONTROPROVA: senza il Movimento dichiarato il campo non compare. Senza di
// essa, "arriva" non distingue "copiato" da "sempre presente".
const senzaNegata = risolvi([{ name: 'Fusilier', burst: 3, rangeIndex: 1, rangeMod: 0, cover: true, ammo: 'N', terrain: 'NESSUNO' }]);
ok(!(senzaNegata[0] || {}).coperturaNegata,
   `senza l Abilita che la nega il campo non c e (${JSON.stringify((senzaNegata[0] || {}).coperturaNegata)})`);

// Lo scontro orfano: l'attiva muove, la reattiva spara. Il motore marca
// reattivoNonBersagliato, e l'adattatore scambia i lati perche` l'attiva
// resti a sinistra.
prepara([{ nome: 'Fusilier', azione: 'ATTACCO BS', arma: combi, hasLoF: true, burst: 3, rangeIndex: 1 }]);
const orfano = window.generaRisoluzioneDaDati({
    attacchi: [{ attaccante: 'Alguacil', azione: 'MOVIMENTO', arma: null, bersagli: [] }],
    azioniDichiarate: ['MOVIMENTO']
});
ok(Array.isArray(orfano) && orfano.length >= 1,
   `lo scontro orfano viene prodotto (${Array.isArray(orfano) ? orfano.length : typeof orfano})`);
const or0 = orfano[0] || {};
ok(or0.reattivoNonBersagliato === true,
   `reattivoNonBersagliato arriva (${or0.reattivoNonBersagliato})`);

console.log('\n=== 11. Punto 22: rendiVoci non ripete la riga della base ===');
// La voce con fonte 'base' dice la stessa cosa della riga "Statistica Base"
// scritta sopra: ristamparla come modificatore la fa sembrare un bonus.
const perVoci = risolvi([{ name: 'Fusilier', burst: 3, rangeIndex: 1, rangeMod: 0, cover: false, ammo: 'N', terrain: 'NESSUNO' }]);
const s8 = perVoci[0] || {};
// Una volta PER RIQUADRO: i due lati dello scontro hanno ciascuno la sua
// base, e sommare i due testi conta due volte a ragione.
const dettAttivo = String((s8.attivo || {}).dettagliMod || '');
const dettReatt = String((s8.reattivo || {}).dettagliMod || '');
const dettagli = dettAttivo + ' ' + dettReatt;
ok(/Statistica Base/.test(dettAttivo), `la riga "Statistica Base" c e (${(/Statistica Base[^<]*/.exec(dettAttivo) || [])[0]})`);
ok((dettAttivo.match(/Statistica Base/g) || []).length === 1,
   `e nel riquadro dell attivo compare una volta sola (${(dettAttivo.match(/Statistica Base/g) || []).length})`);
ok((dettReatt.match(/Statistica Base/g) || []).length <= 1,
   `e in quello del reattivo al massimo una (${(dettReatt.match(/Statistica Base/g) || []).length})`);
// Il motivo della voce 'base' non deve comparire col segno, cioe` nella
// forma dei modificatori.
// SERVE LA BUSTA GIUSTA: un Attacco BS senza modificatori non produce
// NESSUNA voce, percio` nemmeno una di fonte 'base', e la prova passerebbe
// a vuoto (verificato il 6 ottobre: con la lista vuota un .every() e` vero
// qualunque cosa faccia rendiVoci, e la rottura non si vedeva).
// Le voci con fonte 'base' le fornisce il modulo del Supporto.
const bustaSupporto = {
    attacchi: [{ attaccante: 'Alguacil', azione: M.AZIONI.SUPPORTO_WIP,
        arma: { nome: 'MediKit', burst: 1, ammo: null, ammoOpzioni: [], bands: [],
                isTemplate: false, isCC: false, isDifesa: true, notazioni: [] },
        bersagli: [], burstDisponibile: 1,
        regole: { senzaTiro: false, attributo: 'WIP', valoreSuccesso: 12, base: 12, mod: 0,
                  voci: [{ fonte: 'base', valore: 12, motivo: 'WIP dell Alguacil: 12' }] } }]
};
window.latestAroData = [];
const sup = window.generaRisoluzioneDaDati(bustaSupporto) || [];
ok(sup.length === 1, `la busta del Supporto produce uno scontro (${sup.length})`);
const vociBase = (((sup[0] || {}).attivo || {}).dati || {}).voci || [];
ok(vociBase.some(v => v && v.fonte === 'base'),
   `e porta una voce di fonte "base" (${JSON.stringify(vociBase.map(v => v.fonte))})`);
const dettSup = String(((sup[0] || {}).attivo || {}).dettagliMod || '');
ok(/Statistica Base/.test(dettSup), `la riga della Statistica Base c e (${(/Statistica Base[^<]*/.exec(dettSup) || [])[0]})`);
const motivoBase = String((vociBase.find(v => v.fonte === 'base') || {}).motivo || '');
ok(motivoBase.length > 0 && dettSup.indexOf(motivoBase) < 0,
   `e il motivo della voce base NON viene ristampato ("${motivoBase}")`);

console.log('\n=== 12. Punto 22: requisito fallito e valore sotto 1 si leggono diversi ===');
// Due motivi diversi per "non si tira": un Requisito fallito e` un Idle.
// Un solo messaggio per entrambi farebbe credere a un tiro fallito.
const srcMath = require('fs').readFileSync((process.env.CARTELLA || '.').replace(/\/?$/, '/') + 'calcolatore_math.js', 'utf8');
ok(/Requisito non soddisfatto: Idle, nessun tiro/.test(srcMath),
   'la frase del requisito fallito esiste nell adattatore');
ok(/Valore di Successo sotto 1/.test(srcMath),
   'e la frase del valore sotto 1 e un altra');
// E si misura il comportamento, non solo la presenza del testo: un ARO di
// Hacking dichiarato da chi non e` Hacker produce requisitoFallito.
require('./database_nomad.js'); require('./database_panoceania.js');
const TUTTI9 = [].concat(window.DB_NOMADI || [], window.DB_PANOCEANIA || []);
const nonHacker = Object.assign(JSON.parse(JSON.stringify(TUTTI9.find(u => /^Fusilier \(Combi Rifle\)/.test(u.nome)))), { states: {}, combatGroup: 1 });
const bersaglio9 = Object.assign(JSON.parse(JSON.stringify(TUTTI9.find(u => /^Alguacil \(Combi Rifle\)/.test(u.nome)))), { states: {}, combatGroup: 1 });
window.gameState = { activeFaction: 'NOMADI', nomads: [bersaglio9], panoceania: [nonHacker] };
window.latestAroData = [{ nome: nonHacker.nome, azione: 'HACKING', arma: 'TRINITY', burst: 1 }];
const r9 = window.generaRisoluzioneDaDati({
    attacchi: [{ attaccante: bersaglio9.nome, azione: M.AZIONI.BS_ATTACK, arma: combi,
                 bersagli: [{ name: nonHacker.nome, burst: 3, rangeIndex: 1, rangeMod: 0, cover: false, ammo: 'N', terrain: 'NESSUNO' }] }]
});
ok(Array.isArray(r9) && r9.length >= 1, `lo scontro con l ARO di Hacking viene prodotto (${Array.isArray(r9) ? r9.length : typeof r9})`);
const d9 = String(((r9[0] || {}).attivo || {}).dettagliMod || '') + ' ' + String(((r9[0] || {}).reattivo || {}).dettagliMod || '');
const haIdle = /Requisito non soddisfatto: Idle, nessun tiro/.test(d9);
const haSotto1 = /Valore di Successo sotto 1/.test(d9);
ok(!(haIdle && haSotto1),
   `e i due messaggi non compaiono insieme (idle ${haIdle}, sotto1 ${haSotto1})`);

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
