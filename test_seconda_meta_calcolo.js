// @versione 2026-09-23.1 | test_seconda_meta_calcolo.js | proprieta`: chat TEST
// I quattro punti del calcolo — node test_seconda_meta_calcolo.js
global.window = global;
global.document = { title: 'NOMADS TACTICAL TERMINAL' };
require('./catalogo_n5.js'); require('./database_comune.js');
const M = require('./motore_regole_n5.js');
require('./calcolatore_math.js');

let passati = 0, falliti = 0;
function ok(c, n, e) { if (c) { passati++; console.log(`  ✅ ${n}`); } else { falliti++; console.log(`  ❌ ${n}${e ? '\n       ' + e : ''}`); } }
const pulisci = t => String(t).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

const alg  = { id: 'n1', alias: 'Alguacil',   bs: 11, ph: 10, arm: 1, bts: 0, w: 1, s: 2, skills: '', states: {} };
const fus  = { id: 'p1', alias: 'Fusilier',   bs: 12, ph: 10, arm: 3, bts: 0, w: 1, s: 2, skills: '', states: {} };
const fus2 = { id: 'p2', alias: 'Fusilier B', bs: 12, ph: 10, arm: 1, bts: 0, w: 1, s: 2, skills: '', states: {} };
window.gameState = { activeFaction: 'NOMADI', nomads: [alg], panoceania: [fus, fus2] };

const combi = M.profiloArma('Combi Rifle');
const hmg = M.profiloArma('Heavy Machine Gun');
function attacco() {
    return { attacchi: [{ attaccante: 'Alguacil', attaccanteId: 'n1', azione: 'ATTACCO BS', arma: combi,
        bersagli: [{ id: 'p1', name: 'Fusilier', burst: 3, rangeIndex: 1, rangeMod: 3, cover: false, ammo: 'N', terrain: 'NESSUNO' }] }] };
}

console.log('\n=== 1. Il reattivo INFLIGGE danno ===');
// L'elenco diceva 'BS_ATTACK', l'Hub manda 'ATTACCO BS': non combaciavano mai,
// e a schermo usciva "il reattivo non infligge danno" accanto a un tiro a 15.
const s1 = M.risolviScontro(
    { attaccante: alg, azione: M.AZIONI.BS_ATTACK, arma: combi, bersaglio: fus, burst: 3, rangeIndex: 1, rangeMod: 3, ammo: 'N' },
    { difensore: fus, azione: 'ATTACCO BS', arma: hmg, bersaglio: 'Alguacil', burst: 1, rangeIndex: 1, rangeMod: 3 }, {});
ok(s1.reattivo.salvezzaInflitta.offensivo === true, 'il reattivo infligge un Tiro Salvezza');
ok(s1.reattivo.salvezzaInflitta.valoreSuccesso === 6,
   `Alguacil ARM 1 + PS 5 dell HMG = 6 (ottenuto ${s1.reattivo.salvezzaInflitta.valoreSuccesso})`);
// le forme canoniche continuano a funzionare
const s1b = M.risolviScontro(
    { attaccante: alg, azione: M.AZIONI.BS_ATTACK, arma: combi, bersaglio: fus, burst: 3, rangeIndex: 1, rangeMod: 3, ammo: 'N' },
    { difensore: fus, azione: 'BS_ATTACK', arma: hmg, bersaglio: 'Alguacil', burst: 1, rangeIndex: 1, rangeMod: 3 }, {});
ok(s1b.reattivo.salvezzaInflitta.offensivo === true, 'e anche con la forma "BS_ATTACK"');

console.log('\n=== 2 e 3. I reattivi che NON sono bersaglio ===');
// Il ciclo girava sui bersagli dell attacco: chi reagiva senza essere
// bersagliato spariva del tutto, e il giocatore non vedeva il tiro subito.
const due = window.generaRisoluzioneDaDati(attacco(), [
    { nome: 'Fusilier',   azione: 'ATTACCO BS', arma: combi, bersaglio: 'Alguacil', burst: 1, rangeIndex: 1, rangeMod: 3 },
    { nome: 'Fusilier B', azione: 'ATTACCO BS', arma: combi, bersaglio: 'Alguacil', burst: 1, rangeIndex: 1, rangeMod: 3 }]);
ok(due.length === 2, `due ARO, DUE scontri (ottenuti ${due.length})`);
ok(due[0].titolo === 'TIRO FACCIA A FACCIA', 'il bersagliato: Faccia a Faccia');
ok(due[1].titolo === 'TIRO NORMALE', 'chi non è bersaglio: Tiro Normale a sé');
// Dal 26 settembre l'adattatore mette SEMPRE a sinistra la fazione attiva:
// nello scontro orfano scambia i due slot, così chi ha speso l'Ordine resta a
// sinistra con "Nessun tiro" e chi reagisce va a destra col suo tiro.
// Prima questa prova cercava il tiro in `attivo`: cercarlo lì oggi vorrebbe
// dire pretendere il lato sbagliato.
const chiTira = due[1].reattivo && due[1].reattivo.mod != null ? due[1].reattivo : due[1].attivo;
const chiNonTira = chiTira === due[1].reattivo ? due[1].attivo : due[1].reattivo;
ok(chiTira.nome === 'Fusilier B', `e il suo tiro si vede, col suo nome (${chiTira.nome})`);
ok(chiTira.mod !== null && chiTira.mod !== undefined, 'con un valore vero');
ok(/Fusilier B/.test(due[1].reattivo.nome), `chi reagisce sta a DESTRA (${due[1].reattivo.nome})`);
ok(/Alguacil/.test(due[1].attivo.nome), `e a sinistra resta chi ha speso l Ordine (${due[1].attivo.nome})`);
// Il lato che non tira porta "-", non un numero: per il tabellone è la riga
// "Nessun tiro". Un null qui diventerebbe una casella vuota, che si legge
// come "non lo so" invece che come "non deve tirare".
ok(chiNonTira.mod === '-' || chiNonTira.mod == null,
   `che infatti non tira (${JSON.stringify(chiNonTira.mod)})`);
// E le due fazioni devono essere diverse: era il difetto per cui l'Alguacil
// compariva a destra, azzurro, come se fosse PanOceania.
ok(due[1].attivo.fazione !== due[1].reattivo.fazione,
   `i due riquadri portano fazioni diverse (${due[1].attivo.fazione} / ${due[1].reattivo.fazione})`);

// tre ARO, tre scontri
const tre = window.generaRisoluzioneDaDati(attacco(), [
    { nome: 'Fusilier',   azione: 'ATTACCO BS', arma: combi, bersaglio: 'Alguacil', burst: 1, rangeIndex: 1, rangeMod: 3 },
    { nome: 'Fusilier B', azione: 'ATTACCO BS', arma: combi, bersaglio: 'Alguacil', burst: 1, rangeIndex: 1, rangeMod: 3 },
    { nome: 'Fusilier B', azione: 'SCHIVATA', burst: 1 }]);
ok(tre.length === 3, `tre reazioni, tre scontri (ottenuti ${tre.length})`);

// e un solo ARO non produce doppioni
const uno = window.generaRisoluzioneDaDati(attacco(), [
    { nome: 'Fusilier', azione: 'SCHIVATA', bersaglio: 'Alguacil', burst: 1 }]);
ok(uno.length === 1, 'un solo ARO dal bersaglio: un solo scontro, nessun doppione');

console.log('\n=== 4. Ciascuno vede LA PROPRIA salvezza ===');
// Sotto la truppa attiva va il valore che LEI deve superare, non quello
// che infligge: il giocatore leggeva sotto il proprio nome il numero
// dell avversario.
const inv = window.generaRisoluzioneDaDati(attacco(), [
    { nome: 'Fusilier', azione: 'ATTACCO BS', arma: hmg, bersaglio: 'Alguacil', burst: 1, rangeIndex: 1, rangeMod: 3 }]);
const s = inv[0];
ok(/ARM.*6 o MENO/i.test(pulisci(s.attivo.salvezza)),
   'sotto Alguacil (ARM 1) il 6: quello che DEVE superare contro l HMG');
ok(/ARM.*10 o MENO/i.test(pulisci(s.reattivo.salvezza)),
   'sotto Fusilier (ARM 3) il 10: quello che DEVE superare contro il Combi');
ok(s.attivo.dati.salvezzaSubita && s.attivo.dati.salvezzaInflitta,
   'e i dati grezzi portano entrambe, distinte');
ok(s.attivo.dati.salvezzaSubita.valoreSuccesso === 6 &&
   s.attivo.dati.salvezzaInflitta.valoreSuccesso === 10,
   'subita 6, inflitta 10: due numeri diversi, non più confusi');

console.log('\n=== 5. Il caso senza ARO non è cambiato ===');
const senza = window.generaRisoluzioneDaDati(attacco(), []);
ok(senza.length === 1, 'un attacco senza reazioni: uno scontro');
ok(senza[0].titolo === 'TIRO NORMALE', 'Tiro Normale');
ok(/ARM.*10 o MENO/i.test(pulisci(senza[0].reattivo.salvezza)),
   'e il Fusilier vede la propria salvezza, 10');

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
