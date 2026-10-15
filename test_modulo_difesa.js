// @versione 2026-09-23.1 | test_modulo_difesa.js | proprieta`: chat TEST
// Test end-to-end del modulo Difesa — node test_modulo_difesa.js
global.window = global;
let passati = 0, falliti = 0;
function ok(c, n, e) { if (c) { passati++; console.log(`  ✅ ${n}`); } else { falliti++; console.log(`  ❌ ${n}${e ? '\n       ' + e : ''}`); } }

const el = {};
function nodo(id) { return el[id] || (el[id] = { id, innerHTML: '', innerText: '', style: {},
    appendChild() {}, remove() {}, cloneNode() { return nodo(id + '_c'); }, parentNode: { replaceChild() {} } }); }
global.document = { title: 'NOMADS', getElementById: (i) => nodo(i), querySelector: () => nodo('btn'),
    querySelectorAll: () => [], createElement: () => ({ style: {}, innerHTML: '', appendChild() {} }) };
let alertUltimo = null; global.alert = (m) => { alertUltimo = m; };
let inviato = null; global.inviaCalcoloAllHub = (p) => { inviato = p; };
let allarme = null; global.inviaAllarmeAro = (p) => { allarme = p; };
global.inviaSchieramentoAllHub = () => {};
global.goToStep = () => {}; global.confirmMultiAro = () => {};

require('./catalogo_n5.js'); require('./database_comune.js');
const M = require('./motore_regole_n5.js');
require('./ordine_difesa.js');

const alguacil = { id: 'n1', alias: 'Alguacil', ph: 10, wip: 12, arm: 1,
                   weapon: 'Combi Rifle, Pistol', skills: '', states: {} };
const acrobata = { id: 'n2', alias: 'Acrobata', ph: 13, wip: 12,
                   weapon: 'Combi Rifle', skills: 'Dodge (+3)', states: {} };
const corazza  = { id: 'n3', alias: 'Corazza', ph: 10, wip: 12, arm: 4,
                   weapon: 'Combi Rifle', skills: 'Dodge (ARM+3)', states: {} };
const designato = { id: 'n4', alias: 'Designato', ph: 10, wip: 13,
                    weapon: 'Combi Rifle', skills: '', states: { targeted: true } };
const hmg      = { id: 'n5', alias: 'Mitragliere', ph: 10, wip: 12,
                   weapon: 'Heavy Machine Gun, Chain Rifle, Knife', skills: '', states: { fireteam: 'A' } };

M._fazione = 'NOMADI';
M._rosterProprio = [alguacil, acrobata, corazza, designato, hmg];
M._rosterNemico = [{ id: 'p1', alias: 'Fusilier', tipo: 'LI', states: {} }];
global.roster = M._rosterProprio;

function nuovo(units) {
    window.currentOrder = {}; window.coordUnits = units; window.coordIndex = 0;
    window.coordPayloads = []; window.combatTargets = []; window.coordMode = false;
    units.forEach(u => { delete u.difesaOpts; delete u.difesaEsito; });
    inviato = null; alertUltimo = null; allarme = null;
}

console.log('\n=== 1. Schivata: i valori ora si calcolano ===');
ok(M.modSchivata(alguacil, { haLoFVersoAttaccante: true }).valore === 10, 'con LoF: PH 10 pieno');
ok(M.modSchivata(alguacil, { haLoFVersoAttaccante: false }).valore === 7, 'senza LoF: PH 7');
ok(M.modSchivata(acrobata, { haLoFVersoAttaccante: true }).valore === 16, 'Dodge (+3): PH 16');
ok(M.modSchivata(acrobata, { haLoFVersoAttaccante: false }).valore === 13, 'Dodge (+3) senza LoF: 13 +3 -3');
ok(M.modSchivata(alguacil, { haLoFVersoAttaccante: true, membriFireteam: 3 }).valore === 11,
   'Fireteam da 3+: +1 Schivata');

const doppio = M.modSchivata(alguacil, { haLoFVersoAttaccante: false, armaDeployable: true });
ok(doppio.valore === 7 && doppio.note.some(n => n.includes('non si sommano')),
   'due cause di -3 insieme: resta -3, e lo dice');

const arm3 = M.modSchivata(corazza, { haLoFVersoAttaccante: true });
ok(arm3.note.some(n => n.includes('FALLISCI')),
   'Dodge (ARM+3): la nota spiega che vale solo se il tiro PH fallisce');

console.log('\n=== 2. Reset ===');
ok(M.modReset(alguacil, {}).valore === 12, 'Reset normale: WIP 12');
const res = M.modReset(designato, {});
// La fonte è 'stato': il -3 viene da CATALOGO_N5.STATI, non da un ramo
// scritto a mano. Il valore è lo stesso, l'origine è unica.
ok(res.valore === 10 && res.voci.some(v => v.fonte === 'stato'), 'Bersagliato: -3 WIP');
ok(res.voci.filter(v => v.valore === -3).length === 1, 'e contato una sola volta');
ok(res.note.some(n => n.includes('non sul Reset')), 'e il -3 di LoF NON si applica al Reset');

console.log('\n=== 3. Schermata difensiva ===');
nuovo([alguacil]);
window.avviaFaseDifesa('SCHIVATA', true);
let h = nodo('targets-allocation-container').innerHTML;
ok(h.includes('PH 10 →') && h.includes('10'), 'mostra base e valore finale');
ok(h.includes('LINEA DI TIRO'), 'interruttore LoF presente');
ok(h.includes('Sagoma'), 'interruttore "sto schivando una Sagoma" presente (era assente)');
window.toggleDifesaLoF(0, 'SCHIVATA');
h = nodo('targets-allocation-container').innerHTML;
ok(h.includes('-3'), 'togliendo la LoF compare il -3 nel dettaglio');

nuovo([designato]);
window.avviaFaseDifesa('RESET', true);
h = nodo('targets-allocation-container').innerHTML;
ok(!h.includes('LINEA DI TIRO'), 'sul Reset l interruttore LoF NON compare: è una regola della Schivata');
ok(h.includes('BERSAGLIATO') || h.includes('Bersagliato'),
   'ma il -3 da Bersagliato sì (ora la voce lo attribuisce allo Stato)');

console.log('\n=== 4. Invio difensivo ===');
nuovo([alguacil]);
window.avviaFaseDifesa('SCHIVATA', true);
window.eseguiCalcoloDifesa();
ok(inviato !== null, 'spedito');
const a = inviato && inviato.attacchi[0];
ok(a && a.azione === M.AZIONI.SCHIVATA, 'azione canonica');
ok(a && a.regole.valoreSuccesso === 10, 'il Valore di Successo calcolato è nel payload');
ok(a && a.bersagli.length === 1 && a.bersagli[0].id === 'all',
   'il motore mette il segnaposto: la difesa non ha un bersaglio singolo');

console.log('\n=== 5. SOPPRESSIONE: ora si sceglie un arma ===');
nuovo([hmg]);
window.currentOrder.unit = hmg;
window.avviaSoppressione();
h = nodo('weapon-buttons-container').innerHTML;
ok(h.includes('Heavy Machine Gun'), 'la Heavy Machine Gun è offerta');
ok(h.includes('SF Mode: B3'), 'il Burst della SF Mode è 3');
ok(h.includes('PS e munizioni invariati'), 'e la schermata dice cosa NON cambia');
ok(h.includes('Chain Rifle') && h.includes('non ha il Tratto'),
   'la Sagoma è esclusa perché il database dice che non ha il Tratto Suppressive Fire');
ok(h.includes('0 / 0 / -3'),
   'la schermata mostra le gittate SF ufficiali: 0 / 0 / -3');

console.log('\n=== 6. SF Mode: cambia solo gittata e Burst ===');
const combi = M.profiloArma('Combi Rifle');
const sf = M.profiloSF(combi);
ok(sf.burst === 3, 'Burst SF = 3');
ok(sf.dam === combi.dam && sf.ammo === combi.ammo, 'PS e munizioni INVARIATI, come da regolamento');
ok(JSON.stringify(sf.bands.map(b => b.mod)) !== JSON.stringify(combi.bands.map(b => b.mod)),
   'le bande di gittata invece cambiano');
ok(!sf.avvisi.some(x => x.codice === 'A97'),
   'i MOD della SF Mode non sono più un ripiego: vengono dal Weapon Chart');
ok(sf.avvisi.some(x => x.codice === 'A98'),
   'ma il motore avvisa che la gittata massima scende');
ok(sf.bands.length === 3 && sf.bands[2].a === 24,
   'SF Mode: tre bande, massimo 24" — anche per una HMG che arriva a 48"');
ok(M.bandaPerDistanza(sf, 40).fuoriGittata === true,
   'a 40" in Soppressione si è FUORI GITTATA (prima il calcolatore lo permetteva)');

console.log('\n=== 7. Attivazione ===');
window.confermaSoppressione('Heavy Machine Gun');
ok(hmg.states.suppressive === true, 'stato attivato');
ok(hmg.states.suppressiveWeapon.includes('SF Mode'), 'l arma in SF Mode è registrata');
ok(hmg.states.fireteam === '', 'l unità è uscita dal Fireteam (Fireteam Integrity)');
ok(allarme && allarme.sfMode.burst === 3, 'il profilo SF è nel payload verso l Hub (prima non c era)');
ok(allarme && allarme.sfMode.malusAiNemici === -3, 'il -3 ai nemici è nel payload');
ok(allarme && allarme.sfMode.burstSuUnSoloBersaglio === true,
   'e il vincolo "tutto il Burst su un bersaglio solo"');
ok(alertUltimo.includes('UN SOLO bersaglio'), 'il vincolo è spiegato anche al giocatore');
ok(alertUltimo.includes('Ingaggiato') && alertUltimo.includes('Isolato'),
   'le cause di cancellazione sono elencate (prima era solo la nuova attivazione)');

console.log('\n=== 8. Cancellazione dello stato ===');
ok(M.soppressioneCancellata(hmg, 'ORDINE').cancellata, 'dichiarare un Ordine annulla');
ok(M.soppressioneCancellata(hmg, 'ARO_NON_BS').cancellata, 'un ARO diverso da BS in SF Mode annulla');
ok(!M.soppressioneCancellata(hmg, null).cancellata, 'restando fermo lo stato regge');
const ingaggiato = { states: { engaged: true } };
ok(M.soppressioneCancellata(ingaggiato, null).cause.includes('Ingaggiato'), 'Ingaggiato annulla');
const isolato = { states: { isolated: true } };
ok(M.soppressioneCancellata(isolato, null).cause.includes('Isolato'), 'Isolato annulla');

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
