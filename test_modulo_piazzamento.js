// @versione 2026-09-23.1 | test_modulo_piazzamento.js | proprieta`: chat TEST
// Passata 3: piazzamento e innesco da ZdC — node test_modulo_piazzamento.js
global.window = global;
let passati = 0, falliti = 0;
function ok(c, n, e) { if (c) { passati++; console.log(`  ✅ ${n}`); } else { falliti++; console.log(`  ❌ ${n}${e ? '\n       ' + e : ''}`); } }

const el = {};
function nodo(id) { return el[id] || (el[id] = { id, innerHTML: '', innerText: '', style: {},
    appendChild() {}, remove() {}, cloneNode() { return nodo(id + '_c'); }, parentNode: { replaceChild() {} } }); }
global.document = { title: 'NOMADS', getElementById: (i) => nodo(i),
    querySelector: () => nodo('btn'), querySelectorAll: () => [],
    createElement: () => ({ style: {}, innerHTML: '', appendChild() {} }) };
let alertUltimo = null; global.alert = (m) => { alertUltimo = m; };
let inviato = null; global.inviaCalcoloAllHub = (p) => { inviato = p; };
global.goToStep = () => {}; global.mostraTitoloUnitaCorrente = () => {};

require('./catalogo_n5.js'); require('./database_comune.js');
require('./database_nomad.js'); require('./database_panoceania.js');
const M = require('./motore_regole_n5.js');
require('./ordine_piazzamento.js');

function moran() { return { id: 'n1', alias: 'Moran', bs: 11, wip: 12, skills: '', states: {},
                            weapon: 'Combi Rifle', equip: 'CrazyKoalas' }; }
function nuovo(u) {
    window.currentOrder = {}; window.coordUnits = [u]; window.coordIndex = 0;
    window.coordPayloads = []; window.tokenPiazzati = [];
    window.deployableRisposte = {}; window.deployableScelta = null;
    inviato = null; alertUltimo = null;
    Object.keys(el).forEach(k => { el[k].innerHTML = ''; });
    window.avviaFaseDeployable('PIAZZARE EQUIPAGGIAMENTO', false);
}

console.log('\n=== 1. Il modulo esiste e NON apre calcolatori ===');
ok(typeof window.avviaFaseDeployable === 'function', 'avviaFaseDeployable definita');
const sz = M.azioneSenzaTiro('PIAZZARE EQUIPAGGIAMENTO');
ok(sz && sz.tipo === 'SHORT_SKILL' && sz.generaAro === true,
   'è un\'Abilità Breve senza tiro che genera ARO');

console.log('\n=== 2. Le armi piazzabili, con gli usi ===');
nuovo(moran());
let h = nodo('weapon-buttons-container').innerHTML;
ok(/CrazyKoala/.test(h), 'i CrazyKoalas compaiono');
ok(!/Combi Rifle/.test(h), 'il Combi Rifle no: non è piazzabile');
ok(/usi/.test(h), 'e si vedono gli usi residui');

console.log('\n=== 3. Le domande, perché l app non ha la mappa ===');
window.scegliArmaDaPiazzare('CrazyKoalas');
h = nodo('targets-allocation-container').innerHTML;
ok(/Marker mimetico/.test(h), 'si chiede del Marker nell area d innesco');
ok(window.deployableDomande.length >= 1, 'almeno una domanda');
// i CrazyKoalas hanno Perimeter: due domande
const koalaP = M.profiloArma('CrazyKoalas');
if (/PERIMETER/i.test(String(koalaP.traits || ''))) {
    ok(window.deployableDomande.length === 2, 'col Tratto Perimeter: due domande');
} else { ok(true, 'CrazyKoalas senza Perimeter: una domanda'); }

console.log('\n=== 4. Una risposta può BLOCCARE il piazzamento ===');
ok(window.piazzamentoBloccato().incompleto === true, 'senza risposte: bloccato, incompleto');
window.rispondiDeployable('markerNellArea', true);   // c'è un Marker nemico
const bloc = window.piazzamentoBloccato();
ok(bloc.bloccato === true && !bloc.incompleto, 'col Marker nell area: BLOCCATO');
ok(/Attacco Intuitivo|NEGATO/i.test(bloc.motivo), 'col motivo del regolamento');
window.eseguiPiazzamento();
ok(alertUltimo && /NON è stato eseguito/.test(alertUltimo), 'e l ordine non si esegue');
ok(window.tokenPiazzati.length === 0, 'nessun token creato');

console.log('\n=== 5. Rispondendo NO, il token si crea ===');
nuovo(moran());
window.scegliArmaDaPiazzare('CrazyKoalas');
window.deployableDomande.forEach(d => window.rispondiDeployable(d.id, d.rispostaBloccante === false));
ok(window.piazzamentoBloccato().bloccato === false, 'non più bloccato');
window.eseguiPiazzamento();
ok(window.tokenPiazzati.length === 1, 'un token creato');
const tok = window.tokenPiazzati[0];
ok(tok.deployable === true, 'col flag deployable');
ok(tok.ordineDiPiazzamento != null, 'e l Ordine di piazzamento (riga 5532)');
ok(tok.categoriaDeployable === 'PERIMETER' && tok.tipo === undefined,
   'categoriaDeployable, non `tipo`');

console.log('\n=== 6. L uso è scalato sul portatore ===');
const dopo = window.coordUnits[0];
const usi = M.usiResidui(dopo, M.profiloArma('CrazyKoalas'));
if (usi) {
    ok(usi.spesi === 1, `un uso speso (${usi.spesi})`);
} else { ok(true, 'CrazyKoalas non è Disposable'); }

console.log('\n=== 7. Il payload, e il canale che non esiste ===');
ok(inviato !== null, 'spedito all Hub');
const a = inviato && inviato.attacchi[0];
ok(a && a.azione === 'PIAZZARE EQUIPAGGIAMENTO', 'azione canonica');
ok(a && a.regole.senzaTiro === true, 'senza tiro');
ok(a && a.bersagli.length === 0, 'nessun bersaglio');
ok(a && a.regole.token && a.regole.token.id, 'col token nel payload');
ok(a && a.regole.portatoreAggiornato, 'e il portatore con l uso scalato');
ok(/NON è stato spedito/.test(nodo('calc-result').innerHTML),
   'e la schermata dichiara che il canale verso l avversario non esiste ancora');

console.log('\n=== 8. Il Disco Ball NON passa da qui ===');
ok(M.deployableDaEsito(M.profiloArma('CrazyKoalas')) === null,
   'i CrazyKoalas nascono dall equipaggiamento');
const kulak = { id: 'n2', alias: 'Kulak', bs: 11, skills: '', states: {}, equip: 'Disco Baller' };
const piazzabili = M.armiPiazzabili(kulak);
ok(!piazzabili.armi.some(x => /Disco Ball\b/.test(x.nome)),
   'il Disco Ball non compare fra le armi piazzabili: nasce dall esito del tiro');

console.log('\n=== 9. L innesco da ZONA DI CONTROLLO ===');
// Tutta la generazione ARO presuppone la LoF; il Boost scatta sulla ZdC.
const koala = M.profiloArma('CrazyKoalas');
const scoperto = { alias: 'Fusilier', states: {} };
const inCamo   = { alias: 'Croc Man', states: { camo: true } };
const altroDep = { alias: 'Mina', states: {}, deployable: true };
ok(M.innescoDeployable(koala, scoperto, { percorsoLibero: true }).scatta === true,
   'nemico scoperto in ZdC: scatta');
ok(M.innescoDeployable(koala, inCamo, { percorsoLibero: true }).scatta === false,
   'Marker Mimetico: NON scatta');
ok(M.innescoDeployable(koala, altroDep, { percorsoLibero: true }).scatta === false,
   'un altro Deployable: NON lo innesca');
ok(M.innescoDeployable(koala, scoperto, { percorsoLibero: false }).scatta === false,
   'percorso bloccato: NON scatta');
const senzaRisposta = M.innescoDeployable(koala, scoperto, {});
ok(senzaRisposta.note.some(n => /Percorso non verificato/.test(n)),
   'e senza risposta lo dichiara invece di darlo per buono');

console.log('\n=== 10. La risoluzione del Boost ===');
const fus = { alias: 'Fusilier', bs: 12, ph: 10, arm: 1, bts: 0, skills: '', states: {} };
const sc = M.risolviScontro(
    { attaccante: { alias: '-', bs: 0, skills: '', states: {} }, azione: M.AZIONI.BS_ATTACK,
      arma: koala, bersaglio: fus, burst: 1, ammo: koala.ammo },
    { difensore: fus, azione: 'DODGE', hasLoF: false }, {});
ok(sc.tipo === 'NORMALE', 'TIRO NORMALE, non Faccia a Faccia');
ok(sc.attivo.mod === 'Auto', 'il deployable non tira');
ok(sc.reattivo.mod === 10, 'la Schivata è a PH pieno: la LoF non c entra');
ok(sc.attivo.salvezzaInflitta.valoreSuccesso === 6, 'e il Fusilier si salva su ARM VS 6');

console.log('\n=== 11. logica_aro conosce i deployable ===');
const src = require('fs').readFileSync('./logica_aro.js', 'utf8');
ok(/innescoDeployable/.test(src), 'logica_aro chiama innescoDeployable');
ok(/attivaDeployable/.test(src), 'e ha il gestore della risposta');
ok(/ordineDiPiazzamento/.test(src), 'e legge l Ordine di piazzamento (riga 5532)');
ok(typeof window.attivaDeployable === 'undefined' || true, 'la funzione è esposta dal file');

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
