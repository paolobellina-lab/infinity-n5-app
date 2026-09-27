// @versione 2026-09-25.3 | test_produttori_busta.js | proprieta`: chat TEST
// ================================================================
// Chi spedisce dati all'Hub, e cosa lascia passare.
// La busta di schieramento ha QUATTRO produttori — fase_schieramento,
// logica_stati, motore_core, roster_manager — e le fughe del 25 settembre
// venivano da un produttore che scavalcava il filtro, non dal filtro.
// Questo banco prova ognuno con lo STESSO caso: un Camuffato ferito, un
// nascosto, una truppa visibile. Il nascosto non deve uscire da nessuna
// parte, del Camuffato devono uscire solo camo e impersonation.
//
// Se MOTORE farà una sola funzione che costruisce la busta, questo banco
// resta valido: prova i produttori, non la strada che prendono.
// ================================================================
let passati = 0, falliti = 0;
const ok = (c, m) => { if (c) { passati++; console.log('  ✅ ' + m); } else { falliti++; console.log('  ❌ ' + m); } };
const J = JSON.stringify;

global.window = global;
const memoria = {}; const scritture = [];
global.localStorage = { getItem: k => (k in memoria ? memoria[k] : null),
    setItem: (k, v) => { memoria[k] = String(v); scritture.push({ canale: k, testo: String(v) }); },
    removeItem: k => { delete memoria[k]; } };
// Due destinazioni diverse, e il banco le tiene separate:
//   - localStorage   la copia privata, che resta sul dispositivo
//   - firebase       quello che arriva all'avversario
// motore_core intercetta setItem: le chiavi di M.CANALI NON finiscono nel
// localStorage, vanno a db.ref(k).set(v). Un Firebase finto che ingoia senza
// registrare fa sembrare la busta VUOTA quando non lo è — è successo a
// INTERFACCIA, e alla prima stesura di questo banco. Qui conserva tutto.
const spediti = [];
global.firebase = { initializeApp: () => ({}), database: () => ({ ref: (k) => ({
    set: (v) => spediti.push({ canale: k, testo: String(v) }),
    on(){}, update(){}, remove(){}, once: () => Promise.resolve({ val: () => null }) }) }) };
const soloCloud = () => spediti;
// Gli elementi restano gli stessi fra una chiamata e l'altra: la pagina degli
// stati legge le caselle, e un DOM che le ricrea vuote ogni volta risponde
// "tutto spento" — cioè cambia il caso invece di misurarlo.
const elementi = {};
const el = (id) => (elementi[id] = elementi[id] || { id, innerHTML: '', style: {}, value: '', checked: false,
    appendChild(){}, addEventListener(){}, classList: { add(){}, remove(){} } });
global.document = { title: 'NOMADS', getElementById: el, querySelector: () => el('q'),
    querySelectorAll: () => [], createElement: () => el('n'), addEventListener(){}, body: el('body') };
global.alert = () => {}; global.confirm = () => true; global.setInterval = () => 0; global.addEventListener = () => {};
require('./catalogo_n5.js'); require('./database_comune.js');
require('./database_nomad.js'); require('./database_panoceania.js');
const M = require('./motore_regole_n5.js');
// motore_core va caricato: dal 25.2 è lui l'UNICO che scrive i canali di
// setup, e tutti i produttori passano da window.inviaSchieramentoAllHub.
require('./motore_core.js');
require('./fase_schieramento.js'); require('./logica_stati.js'); require('./roster_manager.js');
require('./ordine_difesa.js');

const T = [...window.DB_NOMADI, ...window.DB_PANOCEANIA];
const prof = (re, extra) => Object.assign(JSON.parse(J(T.find(u => re.test(u.nome)))), extra);
const squadra = () => [
    prof(/^Croc Man \(MULTI Sniper/, { id: 'c1', alias: 'Croc', deployState: 'CAMO', states: { camo: true, wounds: 1 } }),
    prof(/^Spektr \(MULTI Sniper/,   { id: 'h1', alias: 'Spek', deployState: 'HIDDEN', states: { hidden: true } }),
    prof(/^Fusilier \(Combi/,        { id: 'v1', alias: 'Fus',  states: {} })
];
// Cosa NON deve comparire nel testo spedito, qualunque sia la forma della busta.
const segretiFuori = (testo) => {
    const perde = [];
    if (/Spek|Spektr/.test(testo)) perde.push('il nascosto');
    if (/MULTI Sniper Rifle/.test(testo)) perde.push('l arma del Camuffato');
    if (/"wounds"\s*:\s*[1-9]/.test(testo)) perde.push('le ferite');
    return perde;
};

console.log('\n=== 1. fase_schieramento: la busta dello schieramento ===');
const busta = window.faseSchieramento.preparaPayloadHub(squadra(), [], []);
ok(busta.roster.length === 2, `due unità su tre: il nascosto non parte (${busta.roster.length})`);
ok(J(segretiFuori(J(busta))) === '[]', `niente segreti nella busta (${J(segretiFuori(J(busta)))})`);
ok(!('rosterPrivato' in busta), 'e nessuna copia privata allegata');

console.log('\n=== 2. Il mittente unico: inviaSchieramentoAllHub ===');
// Dal 25.2 chi vuole spedire passa di qui, e la busta la costruisce lui: un
// chiamante non può più consegnargli un roster non filtrato.
spediti.length = 0; scritture.length = 0;
const esitoM = window.inviaSchieramentoAllHub('NOMADI', { roster: squadra(), strutture: [], terreni: [] });
ok(esitoM && esitoM.inviato === true, `inviato (${J(esitoM && esitoM.motivo || '')})`);
ok(esitoM.busta && esitoM.busta.roster.length === 2, `la busta porta due unità (${esitoM.busta && esitoM.busta.roster.length})`);
ok(J(segretiFuori(J(esitoM.busta))) === '[]', 'e nessun segreto');
const suSetup = spediti.filter(s => /canale_setup/.test(s.canale));
ok(suSetup.length === 1, `scrive UNA volta sul canale di setup (${suSetup.length})`);
ok(J(segretiFuori(suSetup.map(s => s.testo).join(''))) === '[]', 'e quello che scrive è la busta filtrata');
// La firma vecchia (busta, fazione) va rifiutata, non eseguita in silenzio.
spediti.length = 0; scritture.length = 0;
const vecchia = window.inviaSchieramentoAllHub({ roster: squadra() }, 'NOMADI');
ok(vecchia && vecchia.inviato === false, `la firma vecchia è rifiutata (${J(vecchia && vecchia.motivo)})`);
ok(spediti.length === 0, 'e non scrive niente');

console.log('\n=== 2-bis. roster_manager: sendDataToServer passa dal mittente ===');
window.roster = squadra(); window.fazione = 'NOMADI';
spediti.length = 0; scritture.length = 0;
if (typeof window.sendDataToServer === 'function') {
    window.sendDataToServer();
    soloCloud();
    ok(spediti.length > 0, `spedisce su ${spediti.length} canale/i del cloud`);
    ok(scritture.some(s => /partita_locale/.test(s.canale)),
       'e salva la copia privata in locale PRIMA, che al server non va');
    const perde = spediti.map(s => segretiFuori(s.testo)).reduce((a, b) => a.concat(b), []);
    ok(perde.length === 0, `niente segreti sul canale di setup (${J(perde)})`);
    const dentro = JSON.parse(spediti[spediti.length - 1].testo);
    ok((dentro.roster || []).length === 2, `e sono due unità (${(dentro.roster || []).length})`);
} else { ok(false, 'sendDataToServer non è esposta'); }

console.log('\n=== 3. roster_manager senza motore: non manda niente ===');
// Meglio zero che un roster crudo: era la forma della fuga.
const vero = window.MotoreN5; window.MotoreN5 = undefined;
spediti.length = 0; scritture.length = 0;
try { window.sendDataToServer(); } catch (e) { /* anche sollevare va bene: non spedisce */ }
window.MotoreN5 = vero;
ok(soloCloud().length === 0, `senza motore non spedisce (${spediti.length} invii)`);

console.log('\n=== 4. logica_stati: il salvataggio degli stati ===');
window.roster = squadra();
window.unitToEdit = window.roster[0];          // il Camuffato ferito
elementi['st-camo'] = Object.assign(el('st-camo'), { checked: true });   // la casella è spuntata
spediti.length = 0; scritture.length = 0;
window.annullaStati = () => {};
window.renderFTPanel = () => {};
try { window.salvaStatiUnita(); } catch (e) { ok(false, 'salvaStatiUnita solleva: ' + e.message); }
soloCloud();
const perdeStati = spediti.map(s => segretiFuori(s.testo)).reduce((a, b) => a.concat(b), []);
ok(spediti.length > 0, `salvando gli stati spedisce su ${spediti.length} canale/i del cloud`);
ok(perdeStati.length === 0, `e non porta segreti (${J(perdeStati)})`);
const statoHub = spediti.map(s => s.testo).filter(t => /fullStates/.test(t))[0];
if (statoHub) {
    const st = JSON.parse(statoHub).fullStates || {};
    ok(J(st) === J({ camo: true, impersonation: false }), `del Camuffato arrivano solo camo e impersonation (${J(st)})`);
} else { ok(false, 'nessun aggiornamento di stato spedito'); }

console.log('\n=== 5. Un nascosto non manda nemmeno il proprio stato ===');
window.unitToEdit = window.roster[1];          // lo Spektr nascosto
elementi['st-camo'].checked = false;
spediti.length = 0; scritture.length = 0;
try { window.salvaStatiUnita(); } catch (e) { /* niente da spedire è un esito valido */ }
const parlaDelNascosto = soloCloud().filter(s => /Spek|hidden/.test(s.testo));
ok(parlaDelNascosto.length === 0, `nessun canale nomina il nascosto (${J(parlaDelNascosto.map(s => s.canale))})`);

console.log('\n=== 6. Controprova: la truppa visibile passa intera ===');
// Senza, i cinque "no" qui sopra starebbero solo descrivendo un filtro che
// blocca tutto.
window.unitToEdit = window.roster[2];
spediti.length = 0; scritture.length = 0;
try { window.salvaStatiUnita(); } catch (e) {}
ok(soloCloud().some(s => /Fus/.test(s.testo)), 'la visibile arriva all Hub');
const bustaV = window.faseSchieramento.preparaPayloadHub([window.roster[2]], [], []);
ok(bustaV.roster[0] && bustaV.roster[0].weapon === 'Combi Rifle',
   `e nella busta porta la sua arma (${bustaV.roster[0] && bustaV.roster[0].weapon})`);

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
