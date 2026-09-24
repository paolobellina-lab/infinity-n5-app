// @versione 2026-09-23.1 | test_collaudo_node.js | proprieta`: chat TEST
// Sette difetti del collaudo in Node — node test_collaudo_node.js
global.window = global;
require('./catalogo_n5.js'); require('./database_comune.js');
require('./database_panoceania.js'); require('./database_nomad.js');
const M = require('./motore_regole_n5.js');

let passati = 0, falliti = 0;
function ok(c, n, e) { if (c) { passati++; console.log(`  ✅ ${n}`); } else { falliti++; console.log(`  ❌ ${n}${e ? '\n       ' + e : ''}`); } }

const zero = { alias: 'Zero', wip: 13, bs: 11, ph: 10, arm: 1, bts: 0, skills: 'Hacker, Killer Hacking Device', states: {} };
const orc  = { alias: 'Orc', wip: 13, arm: 4, bts: 6, skills: 'Hacker, Hacking Device', states: {} };

console.log('\n=== 1. Il +3 WIP di Trinity non si perde più ===');
// modHacking lo applicava, risolviScontro no: due percorsi per lo stesso tiro.
const tri = M.armaDaProgramma('TRINITY');
ok(M.modHacking(zero, orc, tri, {}).valore === 16, 'modHacking: WIP 16');
const sc = M.risolviScontro({ attaccante: zero, azione: M.AZIONI.HACKING, arma: tri,
    bersaglio: orc, burst: 3, ammo: tri.ammo }, null, {});
ok(sc.attivo.mod === 16, `risolviScontro: 16 e non 13 (ottenuto ${sc.attivo.mod})`);
ok(sc.attivo.voci.some(v => v.fonte === 'programma'), 'e la voce dice da dove viene');
ok(sc.attivo.burst === 3 && sc.attivo.salvezzaInflitta.attributo === 'BTS',
   'Burst 3 e salvezza BTS restano corretti');

console.log('\n=== 2. I MOD degli stati arrivano ai tiri difensivi ===');
const immA = { alias: 'A', ph: 10, wip: 13, skills: '', states: { immobilizedA: true } };
const immB = { alias: 'B', ph: 10, wip: 13, skills: '', states: { immobilizedB: true } };
const iso  = { alias: 'C', ph: 10, wip: 13, skills: '', states: { isolated: true } };
ok(M.modSchivata(immA, { haLoFVersoAttaccante: true }).valore === 4, 'IMM-A: Schivata PH-6 = 4');
ok(M.modReset(immB, {}).valore === 10, 'IMM-B: Reset WIP-3 = 10');
ok(M.modReset(iso, {}).valore === 4, 'Isolato: Reset WIP-9 = 4');
ok(M.modSchivata(immA, { haLoFVersoAttaccante: true }).voci.some(v => v.fonte === 'stato'),
   'e il MOD è attribuito allo stato, non anonimo');
// Il Bersagliato NON penalizza la Schivata: il catalogo lo dà solo al Reset,
// e il regolamento pure (+3 a chi attacca, -3 al Reset).
const bers = { alias: 'D', ph: 10, wip: 13, skills: '', states: { targeted: true } };
ok(M.modSchivata(bers, { haLoFVersoAttaccante: true }).valore === 10,
   'Bersagliato: non tocca la Schivata');
// e sul Reset NON va contato due volte
const resetBers = M.modReset(bers, {});
ok(resetBers.valore === 10, `Reset con Bersagliato: -3 una sola volta (ottenuto ${resetBers.valore})`);
ok(resetBers.voci.filter(v => v.valore === -3).length === 1,
   'una sola voce da -3: collegare gli stati rischiava di contarlo due volte');

console.log('\n=== 3. Surprise Attack solo da uno stato che nasconde ===');
const spektr = { alias: 'Spektr', bs: 12, skills: 'Surprise Attack (-3), Camouflage', states: {} };
const dif = { alias: 'X', bs: 12, ph: 11, skills: '', states: {} };
function reaz(att) { return M.modReazione(dif, { azione: 'DODGE' }, { attacco: { attaccante: att } }); }
ok(reaz(spektr).valore === 11, 'attaccante allo scoperto: nessun -3');
ok(reaz(Object.assign({}, spektr, { states: { camo: true } })).valore === 8, 'da Mimetizzato: -3');
ok(reaz(Object.assign({}, spektr, { states: { hidden: true } })).valore === 8, 'da Nascosto: -3');
ok(reaz(Object.assign({}, spektr, { states: { impersonation: true } })).valore === 8, 'da Impersonation: -3');
ok(reaz(spektr).note.some(n => /non è in uno stato/.test(n)),
   'e allo scoperto il motore spiega perché non si applica');

console.log('\n=== 4. BERSERK: in N5 è Faccia a Faccia, non un difetto ===');
// "Berserk no longer avoids FtF rolls" — il comportamento N4 è stato rimosso.
const a1 = { alias: 'A', cc: 20, skills: '', states: {} };
const d1 = { alias: 'D', cc: 18, skills: '', states: {} };
const ccw = M.profiloArma('CC Weapon');
const conf = M.tipoConfronto({ azione: 'BERSERK', arma: ccw, attaccante: a1, burst: 1 },
    { azione: 'CC_ATTACK', arma: ccw, bersaglio: a1, burst: 1 }, {});
ok(conf.tipo === 'F2F', 'Berserk resta Faccia a Faccia: la regola N4 non vale più');

console.log('\n=== 5. bersagliSupporto FALLISCE, non ripiega ===');
const doc = { alias: 'Doc', wip: 14, skills: 'Doctor', states: {} };
const feritoVita = { id: 'a1', alias: 'Ferito', w: 1, ph: 10, skills: '', states: { unconscious: true } };
const rem = { id: 'a2', alias: 'REM', s: 1, ph: 8, skills: '', states: { unconscious: true } };
const sbagliato = M.bersagliSupporto('DOCTOR', [feritoVita, rem], doc);
ok(sbagliato.length === 1 && sbagliato[0].ammesso === false, 'un solo esito, negativo');
ok(sbagliato[0].errore && sbagliato[0].errore.codice === 'A58',
   'con A58, lo stesso codice di regoleSupporto');
ok(!sbagliato.some(x => x.unita === rem), 'e NON accetta il REM col filtro dell Ingegnere');
// col nome giusto funziona
const giusto = M.bersagliSupporto('DOTTORE', [feritoVita, rem], doc);
ok(giusto.find(x => x.unita === feritoVita).ammesso === true, 'DOTTORE: accetta chi ha VITA');
ok(giusto.find(x => x.unita === rem).ammesso === false, 'e rifiuta il REM');

console.log('\n=== 6. azioniAroPossibili guarda lo stato del reattivo ===');
const permA = M.azioniAroPossibili(immA, 'ATTACCO BS').filter(a => a.ammesso).map(a => a.id);
ok(permA.join() === 'DODGE', `IMM-A: solo Schivata (ottenuto ${permA.join(', ') || 'nulla'})`);
const permB = M.azioniAroPossibili(immB, 'HACKING').filter(a => a.ammesso).map(a => a.id);
ok(permB.join() === 'RESET', `IMM-B: solo Reset (ottenuto ${permB.join(', ') || 'nulla'})`);
const normale = { alias: 'N', bs: 12, cc: 13, ph: 11, wip: 13, skills: '', states: {} };
ok(M.azioniAroPossibili(normale, 'ATTACCO BS').filter(a => a.ammesso).length >= 3,
   'una truppa senza stati conserva le proprie opzioni');

console.log('\n=== 7. ECM: si accetta la grafia dei profili ===');
const tik = { alias: 'Tikbalang', arm: 5, bts: 6, skills: 'ECM (Guided -6)', states: {} };
const meteor = { alias: 'Meteor Zond', arm: 0, bts: 3, skills: 'ECM (Hacker -3)', states: {} };
ok(M.trattiTiro(tik).tinBotGuided === true, '"ECM (Guided -6)" riconosciuto');
ok(M.valoreFirewall(meteor) === -3, '"ECM (Hacker -3)" dà -3, non 0');
const att = { alias: 'A', bs: 11, skills: '', states: {} };
const gui = M.modAttacco(att, tik, M.profiloArma('Missile Launcher (Blast Mode)'),
    M.AZIONI.GUIDATO, { rangeIndex: 3 });
ok(gui.valore === 11, `Guidato contro Tikbalang: 11 e non 17 (ottenuto ${gui.valore})`);
ok(gui.voci.some(v => v.fonte === 'ecm'), 'e il MOD è attribuito all ECM');
// il valore viene dal profilo, non è fisso
const tik3 = { alias: 'T3', arm: 5, bts: 6, skills: 'ECM (Guided -3)', states: {} };
ok(M.modAttacco(att, tik3, M.profiloArma('Missile Launcher (Blast Mode)'),
    M.AZIONI.GUIDATO, { rangeIndex: 3 }).valore === 14,
   'e con "ECM (Guided -3)" il MOD è -3: si legge, non si assume');

console.log('\n=== 8. Le notazioni (PS=N) non si perdono nei moduli ===');
// profiloArma le agganciava, variantiArma no — e i moduli passano da lì.
const morlock = window.DB_NOMADI.find(u => /Morlock/.test(u.nome || ''));
ok(!!morlock, 'trovato il Morlock');
const apCC = M.armiCC(morlock).find(a => /AP CC/.test(a.nome));
ok(apCC && apCC.dam === 6, `armiCC: PS 6 dal profilo, non 8 dal database (ottenuto ${apCC && apCC.dam})`);
const fus = { alias: 'Fusilier', arm: 1, bts: 0, ph: 10 };
ok(M.tiroSalvezza(fus, { arma: apCC }).valoreSuccesso === 7,
   'Tiro Salvezza ARM VS 7, non 9');
ok(M.profiloArma('AP CC Weapon(PS=6)').dam === 6, 'e profiloArma resta coerente');

console.log('\n=== 9. Una sola definizione per funzione ===');
const src = require('fs').readFileSync('./motore_regole_n5.js', 'utf8');
[['M.variantiArma', 1], ['M.versioneDaIntestazione', 1], ['M.profiloArma', 1]].forEach(function (c) {
    const n = (src.match(new RegExp(c[0].replace('.', '\\.') + '\\s*=\\s*function', 'g')) || []).length;
    ok(n === c[1], `${c[0]}: definita ${c[1]} volta (trovate ${n})`);
});

console.log('\n=== 10. Il filtro di supporto era INVERTITO ===');
// `s` è la SILHOUETTE, non la STR, e ce l'hanno tutti i profili.
// Leggerla come STR rendeva haVita sempre falso e haStr sempre vero:
// il Dottore rifiutava tutti, l'Ingegnere accettava tutti.
const algP = window.DB_PANOCEANIA.find(u => /^Alguacil/.test(u.nome || '')) ||
             { nome: 'Alguacil', w: 1, s: 2 };
const remP = window.DB_NOMADI.find(u => /Reaktion Zond/.test(u.nome || ''));
ok(algP.w != null && algP.str == null, 'Alguacil: ha w (VITA), non str');
ok(remP.str != null && remP.w == null, 'Reaktion Zond: ha str (STR), non w');
ok(algP.s != null && remP.s != null, 'e la Silhouette ce l hanno entrambi: non distingue niente');

const koP = (u) => Object.assign({}, u, { id: u.nome, states: { unconscious: true } });
const dak = { alias: 'Daktari', wip: 14, skills: 'Doctor', states: {} };
function ammesso(strumento, u) {
    const g = M.bersagliSupporto(strumento, [koP(algP), koP(remP)], dak);
    const x = g.find(y => y.unita && y.unita.nome === u.nome);
    return x && x.ammesso;
}
ok(ammesso('DOTTORE', algP) && !ammesso('DOTTORE', remP), 'DOTTORE: solo chi ha VITA');
ok(ammesso('MEDIKIT', algP) && !ammesso('MEDIKIT', remP), 'MEDIKIT: idem');
ok(!ammesso('INGEGNERE', algP) && ammesso('INGEGNERE', remP), 'INGEGNERE: solo chi ha STR');
ok(!ammesso('GIZMOKIT', algP) && ammesso('GIZMOKIT', remP), 'GIZMOKIT: idem');

console.log('\n=== 11. Predefinito del profilo contro stato reale ===');
// 49 profili portano state:'CAMO' come PREDEFINITO di schieramento.
// Non è lo stato attuale: appena la truppa è Scoperta non lo è più.
const intrP = window.DB_NOMADI.find(u => /Intruder/.test(u.nome || ''));
ok(intrP.state === 'CAMO' && intrP.deployState === 'CAMO',
   'l Intruder porta CAMO dal database: è un predefinito, non uno stato');
ok(M.statoBersaglio(Object.assign({}, intrP, { states: {} })).camo === true,
   'con states={} vale il predefinito: la truppa si schiera come Marker');
ok(M.statoBersaglio(Object.assign({}, intrP, { states: { camo: false } })).camo === false,
   'con states={camo:false} vale lo stato dichiarato: è stata Scoperta');

const difP = { alias: 'D', bs: 12, ph: 11, skills: '', states: {} };
function reazDa(st) {
    return M.modReazione(difP, { azione: 'DODGE' },
        { attacco: { attaccante: Object.assign({}, intrP, { states: st }) } });
}
ok(reazDa({}).valore === 11,
   'Surprise Attack: col solo predefinito NON si applica — lo stato va dichiarato');
ok(reazDa({ camo: true }).valore === 8, 'dichiarando camo: -3');
ok(reazDa({}).note.some(n => /Surprise Attack/.test(n)), 'e la nota spiega perché no');

console.log('\n=== 12. E il Mimetismo non si è rotto ===');
// La verifica che la chat INTERFACCIA ha chiesto prima di consegnare.
const attP = { alias: 'A', bs: 11, skills: '', states: {} };
const combiP = M.profiloArma('Combi Rifle');
[{}, { camo: false }, { camo: true }].forEach(function (st) {
    const e = M.modAttacco(attP, Object.assign({}, intrP, { states: st }),
        combiP, M.AZIONI.BS_ATTACK, { rangeIndex: 1 });
    ok(e.voci.some(v => v.fonte === 'mimetismo' && v.valore === -3),
       'Mimetismo -3 applicato con states=' + JSON.stringify(st));
});
ok(M.valoreMimetismo(intrP) === -3, 'e valoreMimetismo lo legge dal profilo, non dallo stato');

console.log('\n=== 13. Il filtro Marker distingue i due casi ===');
M._fazione = 'NOMADI';
const marker = M.bersagliValidi(M.AZIONI.BS_ATTACK,
    [Object.assign({}, intrP, { id: 'x', states: {} })], {})[0];
ok(!marker.ammesso && /Scoperto/.test(marker.motivo), 'in forma di Marker: va Scoperto prima');
const rivelato = M.bersagliValidi(M.AZIONI.BS_ATTACK,
    [Object.assign({}, intrP, { id: 'x', states: { camo: false } })], {})[0];
ok(rivelato.ammesso, 'una volta Scoperto: bersagliabile');

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
