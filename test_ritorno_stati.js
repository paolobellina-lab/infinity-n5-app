// @versione 2026-09-21.1 | test_ritorno_stati.js | proprieta`: chat TEST
// ================================================================
// Dove torna l'app quando si chiude la pagina degli stati.
// logica_stati.js 2026-09-21.1: annullaStati ha tre ritorni, e
// salvaStatiUnita chiude passando da lei. Il terzo ritorno — lo
// schieramento — prima lo gestiva un ponte in app.html; ora e` qui.
//
// Ogni ritorno ha la sua controprova: dimostrare che si va in un posto
// non basta, bisogna dimostrare che NON si va negli altri due.
// ================================================================
let passati = 0, falliti = 0;
const ok = (c, m) => { if (c) { passati++; console.log('  ✅ ' + m); } else { falliti++; console.log('  ❌ ' + m); } };

global.window = global;
const elementi = {};
const el = (id) => ({ id, checked: false, value: '', innerHTML: '', style: {}, appendChild(){}, addEventListener(){}, classList: { add(){}, remove(){} } });
global.document = {
    title: 'NOMADS', getElementById: (id) => (elementi[id] = elementi[id] || el(id)),
    querySelectorAll: () => Object.values(elementi), querySelector: () => el('q'),
    createElement: () => el('nuovo'), addEventListener(){}, body: el('body')
};
global.localStorage = { getItem: () => null, setItem(){}, removeItem(){} };
global.alert = () => {};
require('./catalogo_n5.js'); require('./database_comune.js');
require('./database_nomad.js'); require('./database_panoceania.js');
require('./motore_regole_n5.js');
require('./logica_stati.js');

// --- spie ---
let chiamate;
const azzera = () => {
    chiamate = { goToStep: [], apriSelezioneTruppe: [], renderReactiveRoster: 0 };
    Object.values(elementi).forEach(e => { e.style = {}; });
};
window.goToStep = (s) => chiamate.goToStep.push(s);
window.apriSelezioneTruppe = (g, c) => chiamate.apriSelezioneTruppe.push([g, c]);
window.renderReactiveRoster = () => { chiamate.renderReactiveRoster++; };

console.log('\n=== 1. Aperta dallo schieramento ===');
azzera();
window.statiApertiDalloSchieramento = true; window.isReactiveMode = false;
window.annullaStati();
ok(chiamate.goToStep.length === 1 && chiamate.goToStep[0] === 'step-deploy-units', 'torna a step-deploy-units');
ok(window.statiApertiDalloSchieramento === false, 'e il flag torna falso');
ok(chiamate.apriSelezioneTruppe.length === 0, 'controprova: NON chiama apriSelezioneTruppe');
ok(chiamate.renderReactiveRoster === 0, 'controprova: NON ridisegna il roster reattivo');

console.log('\n=== 2. Lo schieramento vince sul turno reattivo ===');
azzera();
window.statiApertiDalloSchieramento = true; window.isReactiveMode = true;
window.annullaStati();
ok(chiamate.goToStep[0] === 'step-deploy-units', 'con entrambi i flag veri si torna allo schieramento');
ok(chiamate.renderReactiveRoster === 0, 'e non al turno reattivo');

console.log('\n=== 3. Turno reattivo ===');
azzera();
window.statiApertiDalloSchieramento = false; window.isReactiveMode = true;
window.annullaStati();
ok(elementi['step-reactive-turn'] && elementi['step-reactive-turn'].style.display === 'flex', 'mostra step-reactive-turn');
ok(chiamate.renderReactiveRoster === 1, 'e ridisegna il roster reattivo');
ok(chiamate.apriSelezioneTruppe.length === 0, 'controprova: NON chiama apriSelezioneTruppe');
ok(chiamate.goToStep.indexOf('step-deploy-units') < 0, 'controprova: NON torna allo schieramento');

console.log('\n=== 4. Turno attivo (il caso normale) ===');
azzera();
window.statiApertiDalloSchieramento = false; window.isReactiveMode = false;
window.currentGroup = 'G1'; window.isCoordinated = true;
window.annullaStati();
ok(chiamate.apriSelezioneTruppe.length === 1, 'chiama apriSelezioneTruppe una volta');
ok(chiamate.apriSelezioneTruppe[0] && chiamate.apriSelezioneTruppe[0][0] === 'G1' && chiamate.apriSelezioneTruppe[0][1] === true,
   'con il gruppo e il flag Coordinato correnti');
ok(chiamate.goToStep.indexOf('step-deploy-units') < 0, 'controprova: NON torna allo schieramento');

console.log('\n=== 5. salvaStatiUnita chiude passando da annullaStati ===');
// Contratto su cui si regge l'interfaccia: se un giorno salvaStatiUnita
// chiudesse da sola, i tre ritorni qui sopra smetterebbero di valere per il
// salvataggio senza che nessuno se ne accorga.
const vera = window.annullaStati;
let passaggi = 0;
window.annullaStati = () => { passaggi++; };
const alg = JSON.parse(JSON.stringify(window.DB_NOMADI.find(u => u.nome === 'Alguacil (Combi Rifle)')));
alg.states = {};
window.unitToEdit = alg;
window.statiApertiDalloSchieramento = false; window.isReactiveMode = false;
let eccezione = null;
try { window.salvaStatiUnita(); } catch (e) { eccezione = e; }
ok(!eccezione, 'salvaStatiUnita non solleva' + (eccezione ? ': ' + eccezione.message : ''));
ok(passaggi === 1, `passa da annullaStati esattamente una volta (${passaggi})`);
window.annullaStati = vera;

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
