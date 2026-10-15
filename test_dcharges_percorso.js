// @versione 2026-10-12.1 | test_dcharges_percorso.js | proprieta`: chat TEST
// 2026-10-12.1: sezioni 6-8 — la Demolition Mode DETONA nello stesso Ordine
//    (motore 2026-10-12.6, ordine_piazzamento 2026-10-12.1, righe 6043-6047):
//    niente segnalino (E23 da creaDeployable), niente E16 all'invio, la busta
//    col bersaglio e i suoi Tiri Salvezza, lo scontro col lato reattivo che
//    SUBISCE; tre usi, il terzo non respinto con E17, il quarto bloccato, e
//    l'uso che resta sull'unita` del roster (sostituisciUnita vero).
// D-Charges: il filtro agisce PASSANDO DAL MODULO — node test_dcharges_percorso.js
// Il test precedente chiamava la funzione isolata ed era verde anche con la
// funzione scollegata dall'app. Questo passa dal modulo di piazzamento.
global.window = global;
let passati = 0, falliti = 0;
function ok(c, n, e) { if (c) { passati++; console.log(`  ✅ ${n}`); } else { falliti++; console.log(`  ❌ ${n}${e ? '\n       ' + e : ''}`); } }
const el = {};
function nodo(id) { return el[id] || (el[id] = { id, innerHTML: '', style: {}, appendChild() {}, remove() {},
    cloneNode() { return nodo(id + '_c'); }, parentNode: { replaceChild() {} } }); }
global.document = { title: 'NOMADS TACTICAL TERMINAL', getElementById: i => nodo(i),
    querySelector: () => nodo('btn'), querySelectorAll: () => [], createElement: () => nodo('tmp') };
let ultimoAlert = null; global.alert = m => { ultimoAlert = m; };
global.goToStep = () => {}; global.mostraTitoloUnitaCorrente = () => {};
let spedito = null; global.inviaCalcoloAllHub = (p) => { spedito = p; };
require('./catalogo_n5.js'); require('./database_comune.js');
const M = require('./motore_regole_n5.js');
require('./ordine_piazzamento.js');

const dc = M.profiloArma('D-Charges (Demolition Mode)');
const v = window.RULES_WEAPONS['D-Charges (Demolition Mode)'];
ok(Array.isArray(v.bersagliAmmessi), 'il database dichiara i bersagli ammessi delle D-Charges');

console.log('\n=== 1. Il modulo offre le D-Charges ===');
// Non hanno il Tratto Deployable, ma "Are placed using the Place Deployable
// Short Skill" (riga 6044): prima il modulo non le offriva.
ok(M.ePiazzabile(dc) === true, 'la Demolition Mode è piazzabile');
const portatore = { id: 'n1', alias: 'Geniere', skills: '', states: {}, weapon: 'D-Charges', equip: '' };
M._fazione = 'NOMADI';
M._rosterNemico = [
    { id: 'sano', alias: 'Fusilier sano', tipo: 'LI', states: {} },
    { id: 'imm',  alias: 'Fusilier IMM-A', tipo: 'LI', states: { immobilizedA: true } },
    { id: 'pos',  alias: 'TAG posseduto e IMM-A', tipo: 'TAG', states: { immobilizedA: true, possessed: true } }
];
window.currentOrder = {}; window.coordUnits = [portatore]; window.coordIndex = 0; window.coordPayloads = [];
// Si parte dall'AVVIO della fase, come fa l'app: saltarlo lasciava
// deployableRisposte non inizializzato e il test andava in crash.
window.avviaFaseDeployable('PIAZZARE EQUIPAGGIAMENTO', false);

console.log('\n=== 2. Scegliendo l arma, il modulo chiede SU COSA ===');
window.scegliArmaDaPiazzare('D-Charges (Demolition Mode)');
const g = window.bersagliPiazzamento || [];
ok(g.length === 3, `tre candidati valutati dal modulo (${g.length})`);
const per = id => g.find(x => x.unita.id === id);
ok(per('sano') && per('sano').ammesso === false, 'un nemico SANO: rifiutato dal modulo');
ok(per('imm') && per('imm').ammesso === true, 'un nemico Immobilizzato: ammesso');
ok(per('pos') && per('pos').ammesso === false, 'Immobilizzato ma Posseduto: rifiutato, l esclusione vince');
ok(/Non ammessi/.test(nodo('enemy-target-buttons').innerHTML), 'e la schermata mostra i rifiutati col motivo');

console.log('\n=== 3. Il click su un bersaglio rifiutato non passa ===');
window.scegliBersaglioPiazzamento('sano');
ok(ultimoAlert && /non ammesso/.test(ultimoAlert), 'scegliere il nemico sano: bloccato');
ok(!window.deployableBersaglio, 'e nessun bersaglio registrato');
window.scegliBersaglioPiazzamento('imm');
ok(window.deployableBersaglio && window.deployableBersaglio.id === 'imm', 'il nemico Immobilizzato: registrato');

console.log('\n=== 4. 🔴 La prova che il test guarda il modulo: scollego la funzione ===');
const vera = M.bersaglioAmmessoDaArma;
M.bersaglioAmmessoDaArma = function () { return { dichiarato: false, ammesso: true }; };
window.scegliArmaDaPiazzare('D-Charges (Demolition Mode)');
const scollegato = (window.bersagliPiazzamento || []).find(x => x.unita.id === 'sano');
ok(scollegato && scollegato.ammesso === true,
   'con la funzione scollegata il nemico sano PASSA: quindi il modulo la usa davvero');
M.bersaglioAmmessoDaArma = vera;

console.log('\n=== 5. vietatoInAro: le D-Charges non compaiono fra le armi ARO ===');
ok(v.vietatoInAro === true, 'il database lo dichiara');
const aro = M.armiARO({ alias: 'X', skills: '', states: {}, weapon: 'D-Charges' }, 'BS_ATTACK');
const armiAro = (aro.armi || aro || []).map(a => a.nome);
ok(armiAro.indexOf('D-Charges (Demolition Mode)') < 0, 'la Demolition Mode non è offerta in ARO');


console.log('\n=== 6. La Demolition Mode non diventa un segnalino, e all invio non da` E16 ===');
{ const lg = console.log, lw = console.warn; console.log = () => {}; console.warn = () => {};
  require('./database_nomad.js'); require('./database_panoceania.js'); console.log = lg; console.warn = lw; }
const vero = (A, n, id, extra) => { const p = (A || []).find(x => x.nome === n); if (!p) throw new Error('assente: ' + n);
    return Object.assign(JSON.parse(JSON.stringify(p)), { id, alias: id, combatGroup: 1, states: {}, deployState: 'NORMAL', state: 'ACTIVE' }, extra || {}); };
const spektr = vero(window.DB_NOMADI, 'Spektr (Minelayer)', 'spektr');
const fusIMM = vero(window.DB_PANOCEANIA, 'Fusilier (Combi Rifle)', 'fusIMM', { states: { immobilizedA: true } });
const cd = M.creaDeployable(spektr, dc, { ordineId: 'o1', viaEsito: false });
ok(cd.token === null && cd.errori.some(e => e.codice === 'E23' && /detona nello stesso Ordine/.test(e.messaggio)),
   `creaDeployable la respinge con E23 e il motivo (${JSON.stringify(cd.errori.map(e => e.codice))})`);
const shock = M.creaDeployable(spektr, M.profiloArma('Shock Mine'), { ordineId: 'o1', viaEsito: false });
ok(shock.token && shock.errori.length === 0, 'CONTROPROVA: la Shock Mine dello stesso Spektr diventa un segnalino');
const bustaDi = (att, arma, regole) => ({ attaccante: att, azione: M.AZIONI.PIAZZA_DEPLOYABLE, arma, bersagli: [], burstDisponibile: 0, regole: regole || {} });
const ca = M.creaAttacco(bustaDi(spektr, dc, { senzaTiro: true }));
ok(!(ca.errori || []).some(e => e.codice === 'E16'), `all invio la Demolition Mode non da\` piu\` E16 (${JSON.stringify((ca.errori || []).map(e => e.codice))})`);
const caCombi = M.creaAttacco(bustaDi(spektr, M.profiloArma('Combi Rifle'), { senzaTiro: true }));
ok((caCombi.errori || []).some(e => e.codice === 'E16'), 'CONTROPROVA: un Combi Rifle da piazzare da` ancora E16');

console.log('\n=== 7. Dalla pagina: si piazza e detona, senza segnalino ===');
// sostituisciUnita VERO, preso da motore_core.js: e` lui che porta l'uso
// scalato nel roster. Il modulo prima chiamava window.aggiornaUnitaRoster,
// che non esiste, e l'uso moriva con l'ordine.
{
    const core = require('fs').readFileSync(__dirname + '/motore_core.js', 'utf8');
    const i = core.indexOf('window.sostituisciUnita = function');
    const j = core.indexOf('\n};\n', i);
    ok(i >= 0 && j > i, 'sostituisciUnita si trova in motore_core.js');
    if (i >= 0 && j > i) { const lg = console.log; eval(core.slice(i, j + 3)); console.log = lg; }
}
global.window.MotoreN5 = global.window.MotoreN5 || M;
const zittoLog = (fn) => { const lg = console.log, lw = console.warn; console.log = () => {}; console.warn = () => {}; try { return fn(); } finally { console.log = lg; console.warn = lw; } };
M._rosterNemico = [fusIMM];
function detona(portatoreNelRoster) {
    window.currentOrder = {}; window.coordUnits = [portatoreNelRoster]; window.coordIndex = 0; window.coordPayloads = [];
    window.deployableRisposte = {}; window.deployableScelta = null; spedito = null; ultimoAlert = null;
    zittoLog(() => {
        window.avviaFaseDeployable('PIAZZARE EQUIPAGGIAMENTO', false);
        window.scegliArmaDaPiazzare('D-Charges (Demolition Mode)');
        window.scegliBersaglioPiazzamento('fusIMM');
        (window.deployableDomande || []).forEach(d => window.rispondiDeployable(d.id, d.rispostaBloccante === false));
        window.eseguiPiazzamento();
    });
    // La busta GREZZA, prima di creaPayload: quella spedita ha l'attaccante
    // ridotto a {} + attaccanteId, e su quella E17 non si puo` misurare.
    return (window.coordPayloads || [])[window.coordPayloads.length - 1] || null;
}
window.roster = [Object.assign({}, spektr)];
detona(window.roster[0]);
ok(ultimoAlert === null && spedito !== null, `la detonazione parte, senza avvisi (${ultimoAlert})`);
ok(window.roster.length === 1, `nessun segnalino nel roster (${window.roster.length} voci)`);
ok(((window.roster[0].usiSpesi || {})['D-CHARGES']) === 1, `l uso scalato sta sull unita\` del ROSTER (${JSON.stringify(window.roster[0].usiSpesi)})`);
const b1 = spedito && spedito.attacchi && spedito.attacchi[0];
const R1 = (b1 && b1.regole) || {};
ok(R1.detonazioneAContatto === true && R1.bersaglioDetonazione && R1.bersaglioDetonazione.id === 'fusIMM',
   'nella busta: detonazioneAContatto e il bersaglio');
ok(R1.salvezzaDetonazione && R1.salvezzaDetonazione.tiri === 3 && R1.salvezzaDetonazione.attributo === 'ARM' && R1.salvezzaDetonazione.valoreSuccesso === 7,
   `e i Tiri Salvezza del Fusilier: 3 su ARM, riesce con 7 o meno (${JSON.stringify(R1.salvezzaDetonazione && [R1.salvezzaDetonazione.tiri, R1.salvezzaDetonazione.attributo, R1.salvezzaDetonazione.valoreSuccesso])})`);
ok(b1 && b1.bersagli.length === 0 && !R1.token, 'nessun bersaglio di tiro e nessun token nella busta');
const sc = (zittoLog(() => M.risolviPayload(spedito, [], {})) || [])[0] || {};
ok(sc.reattivo && sc.reattivo.nome === M.nomeUnita(fusIMM) && sc.reattivo.azione === "SUBISCE L'ESPLOSIONE",
   `lo scontro: il lato reattivo e\` chi subisce, col suo nome (${sc.reattivo && sc.reattivo.nome}, ${sc.reattivo && sc.reattivo.azione})`);
ok(sc.reattivo && sc.reattivo.salvezzaSubita && sc.reattivo.salvezzaSubita.tiri === 3, 'e ha i suoi 3 Tiri Salvezza');
ok(sc.attivo && sc.attivo.salvezzaSubita && sc.attivo.salvezzaSubita.offensivo === false, 'il lato attivo non subisce nulla');

console.log('\n=== 8. Tre usi: il terzo parte, il quarto no ===');
detona(window.roster[0]); const spedito2 = spedito;
const grezza3 = detona(window.roster[0]); const spedito3 = spedito;
ok(spedito2 && spedito3 && ((window.roster[0].usiSpesi || {})['D-CHARGES']) === 3,
   `secondo e terzo uso partono, e nel roster gli usi spesi sono 3 (${JSON.stringify(window.roster[0].usiSpesi)})`);
detona(window.roster[0]);
ok(spedito === null && ultimoAlert && /esaurit|usi|Disposable/i.test(ultimoAlert) && ((window.roster[0].usiSpesi || {})['D-CHARGES']) === 3,
   `il quarto e\` bloccato, non parte niente e gli usi restano 3 (${String(ultimoAlert).slice(0, 80)})`);
// L'invio del terzo: con usoGiaScalato il portatore ha speso 3 su 3, ed e`
// giusto. Senza il campo, lo stesso portatore e` "esaurito" (test_deployable).
const terzo = grezza3;
ok(terzo && terzo.attaccante && ((terzo.attaccante.usiSpesi || {})['D-CHARGES']) === 3 && terzo.regole.usoGiaScalato === true,
   `premessa: la busta grezza del terzo uso porta l attaccante con 3 usi spesi e usoGiaScalato (${JSON.stringify(terzo && terzo.attaccante && terzo.attaccante.usiSpesi)})`);
if (terzo && terzo.regole && terzo.attaccante) {
    ok(!(M.creaAttacco(terzo).errori || []).some(e => e.codice === 'E17'), 'la busta del terzo uso non da` E17 all invio (usoGiaScalato)');
    const senzaCampo = Object.assign({}, terzo, { regole: Object.assign({}, terzo.regole, { usoGiaScalato: false }) });
    ok((M.creaAttacco(senzaCampo).errori || []).some(e => e.codice === 'E17'), 'CONTROPROVA: la stessa busta senza usoGiaScalato da` E17');
    const oltre = Object.assign({}, terzo, { attaccante: Object.assign({}, terzo.attaccante, { usiSpesi: { 'D-CHARGES': 4 } }) });
    ok((M.creaAttacco(oltre).errori || []).some(e => e.codice === 'E17'), 'e con usoGiaScalato ma 4 usi su 3 blocca l eccesso: E17');
} else {
    ok(false, 'manca la busta del terzo uso: le tre prove sull invio non si possono fare');
}

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
