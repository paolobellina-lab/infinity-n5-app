// @versione 2026-09-23.1 | test_correzioni_regole.js | proprieta`: chat TEST
// Correzioni segnalate dalla chat REGOLE, giro del 20 settembre
// node test_correzioni_regole.js
global.window = global;
global.document = { title: 'NOMADS TACTICAL TERMINAL' };
require('./catalogo_n5.js'); require('./database_comune.js');
const M = require('./motore_regole_n5.js');

let passati = 0, falliti = 0;
function ok(c, n, e) { if (c) { passati++; console.log(`  ✅ ${n}`); } else { falliti++; console.log(`  ❌ ${n}${e ? '\n       ' + e : ''}`); } }

console.log('\n=== 1. Fuoco Speculativo contro Bersagliato ===');
// In N5 il -6 si applica SEMPRE (riga 3920). Il +3 del Bersagliato vale per
// ogni BS Attack (riga 14646), e lo Speculativo lo è.
const att = { alias: 'A', bs: 12, ph: 12, skills: '', states: {} };
const gren = M.profiloArma('Grenades');                 // banda 0 = +3
const bersagliato = { alias: 'D', arm: 1, skills: '', states: { targeted: true } };
const normale     = { alias: 'D', arm: 1, skills: '', states: {} };
const e1 = M.modAttacco(att, bersagliato, gren, M.AZIONI.SPECULATIVO, { rangeIndex: 0, rangeMod: 3 });
ok(e1.valore === 12, `PH 12, gittata +3, Bersagliato -> SV 12 (ottenuto ${e1.valore}; prima 15)`);
ok(e1.voci.some(v => v.fonte === 'speculativo' && v.valore === -6), 'il -6 c è, anche col Bersagliato');

// 🔴 La trappola: il totale 12 si ottiene anche contando il +3 due volte e
// dimenticando la gittata. Si verificano le VOCI, non solo la somma.
const conti = e1.voci.filter(v => v.fonte === 'bersagliato').length;
ok(conti === 1, `il +3 Bersagliato compare UNA volta (trovato ${conti} volte)`);
ok(e1.voci.some(v => v.fonte === 'gittata' && v.valore === 3), 'e la gittata +3 c è');

const e1n = M.modAttacco(att, normale, gren, M.AZIONI.SPECULATIVO, { rangeIndex: 0, rangeMod: 3 });
ok(e1n.valore === 9, `senza Bersagliato -> SV 9 (ottenuto ${e1n.valore})`);
// e vale anche su un arma BS, non solo sulle PH
const katy = M.profiloArma('Katyusha MRL');
ok(M.modAttacco(att, bersagliato, katy, M.AZIONI.SPECULATIVO, { rangeIndex: 1, rangeMod: 3 }).valore === 12,
   'Katyusha (BS): stesso risultato, SV 12');

console.log('\n=== 2. Il filtro armi guarda il TRATTO ===');
const u = { alias: 'X', bs: 12, ph: 12, skills: '', states: {},
            weapon: 'Combi Rifle, Heavy Flamethrower, Grenade Launcher, Chain Rifle, Grenades' };
// armiDisponibili restituisce un ARRAY: leggere .armi dava undefined e il
// file andava in crash senza stampare nulla — output vuoto, non "verde".
function nomiArmi(r) { return (Array.isArray(r) ? r : (r.armi || [])).map(a => a.nome); }
const spec = nomiArmi(M.armiDisponibili(u, 'FUOCO SPECULATIVO'));
ok(spec.indexOf('Combi Rifle') < 0, 'lo Speculativo NON offre più il Combi Rifle');
ok(spec.every(n => /Speculative Attack/i.test(String(window.RULES_WEAPONS[n].traits))),
   'e tutte le armi offerte hanno il Tratto Speculative Attack');
const intu = nomiArmi(M.armiDisponibili(u, 'ATTACCO INTUITIVO'));
ok(intu.every(n => /Intuitive Attack/i.test(String(window.RULES_WEAPONS[n].traits))),
   'l Intuitivo offre solo armi col Tratto Intuitive Attack');

console.log('\n=== 3. Sotto 1 è fallimento automatico, non 1 ===');
// Per regola SV < 1 = non si tira. Portarlo a 1 inventava un valore.
const sch = M.modSchivata({ alias: 'S', ph: 8, skills: '', states: { immobilizedA: true } },
                          { haLoFVersoAttaccante: false });
ok(sch.valore < 1, `Schivata PH 8, IMM-A -6, senza LoF -3: valore ${sch.valore}, non 1`);
ok(sch.impossibile === true, 'con il flag impossibile');
const res = M.modReset({ alias: 'R', wip: 5, skills: '', states: { isolated: true } }, {});
ok(res.valore < 1 && res.impossibile === true, `Reset WIP 5, Isolato -9: ${res.valore}, impossibile`);
ok(M.modSchivata({ alias: 'S', ph: 12, skills: '', states: {} }, { haLoFVersoAttaccante: true }).impossibile === false,
   'e un tiro normale NON è marcato impossibile');
// il Burst invece non scende sotto 1: quello va bene così
const src = require('fs').readFileSync('./motore_regole_n5.js', 'utf8');
ok((src.match(/if \(valore < 1\) valore = 1;/g) || []).length === 1,
   'resta un solo clamp a 1 in tutto il motore: quello del Burst');

console.log('\n=== 4. Il Reset rispetta il tetto dei MOD ===');
// Bersagliato -3 + IMM-B -3 + Isolato -9 = -15 -> -12.
const r4 = M.modReset({ alias: 'R', wip: 13, skills: '',
                        states: { targeted: true, immobilizedB: true, isolated: true } }, {});
ok(r4.mod === -12, `MOD -15 portato a -12 (ottenuto ${r4.mod})`);
ok(r4.voci.some(v => v.fonte === 'limite'), 'con la voce "limite", come nelle altre funzioni');
ok(r4.valore === 1, `WIP 13 - 12 = 1 (ottenuto ${r4.valore})`);

console.log('\n=== 5. Nessun bonus Fireteam agli Attacchi Comms ===');
// Il +1 di Livello 4 vale solo sul BS Attack (riga 11932).
const hk = { alias: 'H', wip: 13, skills: 'Hacker', states: {} };
const bt = { alias: 'T', bts: 0, skills: '', states: {} };
const h5 = M.modHacking(hk, bt, { membriFireteam: 5 });
ok(!h5.voci.some(v => v.fonte === 'fireteam'), 'modHacking con 5 membri: nessun +1');
ok(h5.valore === 13, `WIP 13 resta 13 (ottenuto ${h5.valore})`);
const hb = M.modAttacco(hk, bt, { nome: 'Prog', bands: [], isCC: false }, M.AZIONI.HACKING,
                        { bonusHackingFireteam: true });
ok(!hb.voci.some(v => v.fonte === 'fireteam'),
   'e nemmeno passando bonusHackingFireteam: l altro percorso è chiuso');

console.log('\n=== 6. I secondari del Guidato possono Schivare ===');
M._fazione = 'NOMADI';
const sec = M.bersagliValidi(M.AZIONI.GUIDATO,
    [{ id: 's', alias: 'Sec', tipo: 'LI', arm: 1, skills: '', states: {} }], { ruolo: 'secondario' })[0];
ok(sec.note.some(n => /Schivare/.test(n)), 'la nota dice che possono Schivare');
ok(!sec.note.some(n => /solo il proprio Tiro Salvezza/.test(n)), 'e non più "solo il Tiro Salvezza"');
// Deciso da REGOLE (righe 7746-7752) e chiuso nel motore .17: il secondario
// schiva e NON resetta, e il ruolo non serve nel contratto — il designato è
// quello in Stato Bersagliato. La prova sta in test_casi_regole.js sezione 4;
// qui resta il lato dei bersagli validi.
ok(!(sec.avvisi || []).some(a => a.codice === 'A78'),
   'il Reset dei secondari non è più un punto aperto: niente A78');

console.log('\n=== 7. Total Control e Trinity dal regolamento ===');
const k = Object.keys(window.CATALOGO_N5).find(x => window.CATALOGO_N5[x] && window.CATALOGO_N5[x]['TOTAL CONTROL']);
const P = window.CATALOGO_N5[k];
ok(P['TOTAL CONTROL'].fonte === 'regolamento p.58', 'Total Control: fonte regolamento');
ok(P['TRINITY'].fonte === 'regolamento p.58', 'Trinity: fonte regolamento');

console.log('\n=== 10. Total Control su un TAG Posseduto ===');
// "an enemy TAG, or a TAG in Possessed State" (riga 5286)
M._fazione = 'NOMADI';
const tagP = { id: 't', alias: 'TAG', tipo: 'TAG', bts: 3, skills: '', states: { possessed: true } };
const gT = M.bersagliValidi(M.AZIONI.HACKING, [tagP], { programma: 'TOTAL CONTROL' })[0];
ok(gT.ammesso, 'un TAG Posseduto è bersaglio legittimo');
ok(gT.note.some(n => /cancella il Posseduto/.test(n)), 'e la nota dice che la salvezza fallita lo libera');

console.log('\n=== 11. Jammer: il modo non è più dedotto ===');
const jam = M.profiloArma('Jammer');
ok(!jam.avvisi.some(a => a.codice === 'A47'), 'nessun A47: il modo è confermato');
ok(jam.modoRisoluzione.attaccoComms === true, 'ed è un Attacco Comms: Reset e Firewall si applicano');
// la prova sono i Tratti, non una citazione per posizione nel blocco
const tj = String(jam.traits);
['BS Weapon (WIP)', 'Comms Attack', 'Zone of Control', 'No LoF'].forEach(function (t) {
    ok(tj.indexOf(t) >= 0, `il Jammer porta ${t}`);
});

console.log('\n=== 12. MadTraps: PARA, PH-6 ===');
const mad = M.profiloArma('Madtraps');
const sMad = M.tiroSalvezza({ alias: 'F', ph: 10, arm: 1, bts: 0, w: 1, s: 2 }, { arma: mad });
ok(sMad.attributo === 'PH' && sMad.valoreSuccesso === 4, `PH 10 - 6 = 4 (ottenuto ${sMad.valoreSuccesso})`);

console.log('\n=== D-Charges: il filtro legge i bersagli DICHIARATI ===');
// Il nome CONTATTO_STRUTTURA faceva credere "solo strutture".
const dcV = window.RULES_WEAPONS['D-Charges (Demolition Mode)'];
const avevaCampi = Array.isArray(dcV.bersagliAmmessi);
dcV.bersagliAmmessi = dcV.bersagliAmmessi || ['STRUTTURA', 'EDIFICIO', 'NEMICO_IMMOBILIZZATO', 'NEMICO_NULL'];
dcV.bersagliEsclusi = dcV.bersagliEsclusi || ['SEPSITORIZZATO', 'POSSEDUTO'];
const dch = M.profiloArma('D-Charges (Demolition Mode)');
ok(M.bersaglioAmmessoDaArma(dch, { tipoScena: 'STRUTTURA', states: {} }).ammesso, 'una struttura: sì');
ok(M.bersaglioAmmessoDaArma(dch, { states: { immobilizedA: true } }).ammesso, 'un nemico Immobilizzato: sì');
ok(!M.bersaglioAmmessoDaArma(dch, { states: {} }).ammesso, 'un nemico sano: no');
ok(!M.bersaglioAmmessoDaArma(dch, { states: { immobilizedA: true, possessed: true } }).ammesso,
   'un nemico Immobilizzato ma Posseduto: NO — l esclusione vince sull ammissione');
if (!avevaCampi) { delete dcV.bersagliAmmessi; delete dcV.bersagliEsclusi; }
ok(M.bersaglioAmmessoDaArma(M.profiloArma('Combi Rifle'), { states: {} }).dichiarato === false,
   'un arma senza bersagli dichiarati non viene filtrata');
// usi CONDIVISI fra Demolition Mode e CC Mode (riga ~6053)
ok(M.usiResidui({ alias: 'P', usiSpesi: { 'D-Charges (CC Mode)': 2 } }, dch).residui === 1,
   '2 usi spesi in CC Mode: la Demolition Mode ne vede 1 su 3');

console.log('\n=== RULES_AMMO: rimossa, e nessuno la cerca più ===');
ok(typeof window.RULES_AMMO === 'undefined', 'RULES_AMMO non esiste più nel database');
ok(!M.datiMancanti().some(d => d.nome === 'RULES_AMMO'),
   'e verificaDati non la segnala come mancante: nessun falso allarme');

console.log('\n=== PARA 1. Natural Born Warrior ignora il (-3) ===');
// "In the CC Face to Face Roll, the user ignores all negative MODs imposed
// by the opposing Trooper" — PARA CC Weapon (-3) compresa (righe 9270-9282).
const paraW = M.profiloArma('PARA CC Weapon(-3)'), ccW = M.profiloArma('CC Weapon');
function ccContro(dif, armaAtt, opz) {
    // 🔴 L attaccante ha Surprise Attack e camo SOLO se il caso lo chiede.
    // Prima li aveva sempre: il test "solo PARA" subiva anche la sorpresa,
    // e il NBW passava perché ignora ENTRAMBI i MOD — verde per la ragione
    // sbagliata. Un fattore alla volta.
    const conSorpresa = !!opz.sorpresa;
    return M.risolviScontro({ attaccante: { alias: 'A', cc: 15,
        skills: conSorpresa ? 'Surprise Attack (-3)' : '', states: conSorpresa ? { camo: true } : {} },
        azione: M.AZIONI.CC_ATTACK, arma: armaAtt, bersaglio: dif, burst: 1 },
        { difensore: dif, azione: opz.reazione, arma: opz.reazione === 'CC_ATTACK' ? ccW : null, bersaglio: 'A', burst: 1 },
        { attaccoASorpresa: !!opz.sorpresa });
}
const NBW = { alias: 'NBW', cc: 15, ph: 12, skills: 'Natural Born Warrior', states: {} };
const NOR = { alias: 'Norm', cc: 15, ph: 12, skills: '', states: {} };
ok(ccContro(NOR, paraW, { reazione: 'CC_ATTACK' }).reattivo.mod === 12, 'truppa normale contro PARA (-3): 12');
ok(ccContro(NBW, paraW, { reazione: 'CC_ATTACK' }).reattivo.mod === 15, 'NBW contro PARA (-3): 15, il -3 è ignorato');
ok(ccContro(NBW, paraW, { reazione: 'CC_ATTACK' }).reattivo.note.some(n => /Natural Born Warrior/.test(n)),
   'e la nota dice perché');

console.log('\n=== PARA 1b. NBW ignora anche l Attacco a Sorpresa — trovato verificando ===');
// L esempio del regolamento nomina per PRIMO proprio "Surprise Attack (-3)".
ok(ccContro(NOR, ccW, { reazione: 'CC_ATTACK', sorpresa: true }).reattivo.mod === 12, 'normale in CC contro sorpresa: 12');
ok(ccContro(NBW, ccW, { reazione: 'CC_ATTACK', sorpresa: true }).reattivo.mod === 15, 'NBW in CC contro sorpresa: 15');
// ma SOLO quando dichiara CC Attack: "and declares CC Attack themselves"
ok(ccContro(NBW, ccW, { reazione: 'DODGE', sorpresa: true }).reattivo.mod === 9,
   'NBW che SCHIVA subisce la sorpresa: 12 - 3 = 9');

console.log('\n=== PARA 2. Anteprima e risultato leggono dalla stessa funzione ===');
// Prima l anteprima (modCC) non conosceva la PARA: la schermata non
// mostrava il -3 che poi il risultato applicava.
const Aa = { alias: 'A', cc: 15, skills: '', states: {} };
const Dp = { alias: 'D', cc: 15, ph: 12, skills: '', states: {} };
const anteprima = M.modCC(Aa, Dp, ccW, { inF2F: true, armaAvversario: paraW });
const risultato = M.risolviScontro({ attaccante: Aa, azione: M.AZIONI.CC_ATTACK, arma: ccW, bersaglio: Dp, burst: 1 },
    { difensore: Dp, azione: 'CC_ATTACK', arma: paraW, bersaglio: 'A', burst: 1 }, {});
ok(anteprima.valore === risultato.attivo.mod, `anteprima ${anteprima.valore} = risultato ${risultato.attivo.mod}`);
ok(risultato.attivo.voci.filter(v => v.fonte === 'profilo-avversario').length === 1,
   'il -3 compare UNA volta: nessun doppio conteggio fra i due percorsi');
ok(typeof M.modProfiloAvversario === 'function', 'e la funzione unica esiste');

console.log('\n=== PARA 3. Il commento in modCC dice la cosa giusta ===');
const srcM = require('fs').readFileSync('./motore_regole_n5.js', 'utf8');
ok(!/NON va qui: e` un MOD al TIRO SALVEZZA/.test(srcM), 'non dice più che è un MOD al Tiro Salvezza');
ok(/E` un MOD al Faccia a Faccia\s*\n\s*\/\/ dell'AVVERSARIO/.test(srcM), 'dice che è un MOD al F2F dell avversario');

console.log('\n=== NBW 1. Ignora anche il CC Attack (-3) del nemico ===');
// L esempio (righe 9275-9282) nomina "CC Attack (-3)". Un fattore solo.
const nemCC = { alias: 'N', cc: 15, skills: 'CC Attack (-3)', states: {} };
const nbw1 = { alias: 'NBW', cc: 15, ph: 12, skills: 'Natural Born Warrior', states: {} };
ok(M.modCC(nbw1, nemCC, ccW, { inF2F: true }).valore === 15, 'NBW contro CC Attack (-3): 15, prima 12');
ok(M.modCC({ alias: 'X', cc: 15, skills: '', states: {} }, nemCC, ccW, { inF2F: true }).valore === 12,
   'una truppa normale lo subisce: 12');

console.log('\n=== NBW 2. Un NBW che SCHIVA subisce la PARA ===');
// "must be the target of a CC Attack AND must declare a CC Attack" (9266-9267).
// Prima l esenzione guardava l azione dell ATTIVO, non la sua.
ok(ccContro(NBW, paraW, { reazione: 'CC_ATTACK' }).reattivo.mod === 15, 'NBW che risponde in CC: 15');
ok(ccContro(NBW, paraW, { reazione: 'DODGE' }).reattivo.mod === 9, 'NBW che schiva: PH 12 - 3 = 9');

console.log('\n=== SESTO SENSO. Annulla la Sorpresa solo su Schivata o Reset ===');
// "If the user declares Dodge or Reset" (riga 9941). Su ogni ARO era N4.
const spk = { alias: 'Spk', bs: 12, cc: 15, skills: 'Surprise Attack (-3)', states: { camo: true } };
const ss = { alias: 'SS', bs: 12, ph: 12, wip: 12, skills: 'Sixth Sense', states: {} };
const combiW = M.profiloArma('Combi Rifle');
function sorpresaSu(reaz) {
    const r = M.risolviScontro({ attaccante: spk, azione: M.AZIONI.BS_ATTACK, arma: combiW, bersaglio: ss, burst: 1, rangeIndex: 0 },
        { difensore: ss, azione: reaz, arma: reaz === 'BS_ATTACK' ? combiW : null, bersaglio: 'Spk', burst: 1, rangeIndex: 0 }, {});
    return r.reattivo.voci.filter(v => v.fonte === 'sorpresa').reduce((a, v) => a + v.valore, 0);
}
ok(sorpresaSu('BS_ATTACK') === -3, 'Sesto Senso che risponde con BS Attack: la Sorpresa -3 SI applica');
ok(sorpresaSu('DODGE') === 0, 'Sesto Senso che schiva: annullata');
ok(sorpresaSu('RESET') === 0, 'Sesto Senso che fa Reset: annullata');
// 🔴 azioneCanonica('DODGE') restituisce 'SCHIVATA': un controllo solo su
// 'DODGE' falliva su ogni Schivata vera. Il test lo copre passando DODGE.

console.log('\n=== SORPRESA. Il valore viene dal profilo ===');
const def = { alias: 'D', bs: 12, cc: 15, ph: 12, skills: '', states: {} };
function sorpresaDi(skill, armaA, reaz) {
    const a = { alias: 'A', bs: 12, cc: 15, skills: skill, states: { camo: true } };
    const cc = !!armaA.isCC;
    const r = M.risolviScontro({ attaccante: a, azione: cc ? M.AZIONI.CC_ATTACK : M.AZIONI.BS_ATTACK, arma: armaA, bersaglio: def, burst: 1, rangeIndex: 0 },
        { difensore: def, azione: reaz, arma: reaz === 'DODGE' ? null : armaA, bersaglio: 'A', burst: 1, rangeIndex: 0 }, {});
    return r.reattivo.voci.filter(v => v.fonte === 'sorpresa').reduce((x, v) => x + v.valore, 0);
}
ok(sorpresaDi('Surprise Attack (-3)', combiW, 'BS_ATTACK') === -3, '(-3): -3');
ok(sorpresaDi('Surprise Attack (-6)', combiW, 'BS_ATTACK') === -6, '(-6): -6, non più il -3 fisso');
ok(sorpresaDi('Surprise Attack (CC-6)', ccW, 'CC_ATTACK') === -6, '(CC-6) in Corpo a Corpo: -6');
ok(sorpresaDi('Surprise Attack (CC-6)', combiW, 'BS_ATTACK') === 0, '(CC-6) in un attacco BS: non si applica');

console.log('\n=== STATI NULL: cinque per regola, letti dal flag ===');
// Morto 13734, Disconnesso 13820, Posseduto 14500, Sepsitorizzato 14580,
// Incosciente 14691. Ritirata! (14545) non ha l etichetta Null.
function nullo(st) { return M.eNullo({ alias: 'X', states: st }); }
[['Morto', { dead: true }], ['Incosciente', { unconscious: true }], ['Disconnesso', { disconnected: true }],
 ['Posseduto', { possessed: true }], ['Sepsitorizzato', { sepsitorized: true }]
].forEach(c => ok(nullo(c[1]) === true, `${c[0]}: Nullo`));
[['Isolato', { isolated: true }], ['Ritirata!', { retreat: true }], ['sano', {}]]
    .forEach(c => ok(nullo(c[1]) === false, `${c[0]}: NON Nullo`));
// il flag sta nel CATALOGO, non in una lista a mano
const ST = window.CATALOGO_N5.STATI;
// Le chiavi del catalogo sono quelle dei flag dal 24 settembre (unificazione
// dei due vocabolari): morto, incosciente, disconnesso, posseduto,
// sepsitorizzato — non piu` le maiuscole italiane.
ok(['morto', 'incosciente', 'disconnesso', 'posseduto', 'sepsitorizzato'].every(k => ST[k] && ST[k].statoNullo === true),
   'i cinque portano statoNullo nel catalogo degli STATI');
ok(Object.entries(ST).filter(([, v]) => v.statoNullo).length === 5,
   'e sono cinque: il flag non si e` allargato ad altri stati'.replace('si e` allargato', 'si è allargato'));

console.log('\n=== I quattro test della chat REGOLE ===');
// 1. Periferica nemica Disconnessa, bersaglio di D-Charges -> ammessa
const dch2 = M.profiloArma('D-Charges (Demolition Mode)');
ok(M.bersaglioAmmessoDaArma(dch2, { alias: 'Periferica', states: { disconnected: true } }).ammesso === true,
   'Periferica nemica Disconnessa: bersaglio ammesso delle D-Charges');
// e Posseduto/Sepsitorizzato restano esclusi: la lista esplicita vince
ok(M.bersaglioAmmessoDaArma(dch2, { alias: 'P', states: { possessed: true } }).ammesso === false,
   'Posseduto: escluso, l esclusione vince sul Null');
// 2. Membro di Fireteam che diventa Posseduto -> il Fireteam si rompe
const rot = M.rotturaFireteam({ alias: 'Membro', skills: '', states: { possessed: true } }, {});
ok(JSON.stringify(rot).indexOf('STATO_NULLO') >= 0, 'membro Posseduto: il Fireteam si rompe (STATO_NULLO)');
// 3. Truppa in Soppressione che diventa Sepsitorizzata -> Soppressione cancellata
const sop = M.soppressioneCancellata({ alias: 'S', skills: '', states: { suppressive: true, sepsitorized: true } }, {});
ok(JSON.stringify(sop).indexOf('Stato Nullo') >= 0, 'Sepsitorizzata in Soppressione: Soppressione cancellata');
// 4. Posseduto a cui si chiede un ARO -> NON bloccato da "Stato Nullo"
//    "Null" vuol dire niente Ordini, non "non agisce": reagisce, per l avversario.
const aroPos = M.azioniAroPossibili({ alias: 'Pos', bs: 12, ph: 12, skills: '', states: { possessed: true }, weapon: 'Combi Rifle' }, 'ATTACCO BS');
ok(!JSON.stringify(aroPos).includes('Stato Nullo: non può dichiarare ARO'),
   'Posseduto: l ARO NON è bloccato da "Stato Nullo"');
// e il Disconnesso invece sì: non agisce
const aroDis = M.azioniAroPossibili({ alias: 'Dis', bs: 12, ph: 12, skills: '', states: { disconnected: true }, weapon: 'Combi Rifle' }, 'ATTACCO BS');
ok(JSON.stringify(aroDis).includes('Disconnessa'), 'Disconnesso: ARO bloccato, non può agire');

console.log('\n=== Trincerarsi chiede "può agire", non "è Nullo" ===');
const sap = st => M.puoTrincerarsi({ alias: 'Z', skills: 'Sapper', states: st }).puo;
ok(sap({ disconnected: true }) === false, 'Disconnesso: non si trincera');
ok(sap({ possessed: true }) === true, 'Posseduto: può, agisce per l avversario');

console.log('\n=== FIREWALL (F01 + N5.3) ===');
const hd = { alias: 'HD', bts: 3, skills: 'Hacking Device (Firewall (-3))', states: {} };
const fwCon = st => M.valoreFirewall(Object.assign({}, hd, { states: st }));
ok(fwCon({}) === -3, 'truppa sana con Hacking Device e Firewall (-3): -3');
ok(fwCon({ possessed: true }) === 0, 'Posseduta: l hacker che la attacca NON applica il -3');
ok(fwCon({ disconnected: true }) === 0, 'Disconnessa: niente Firewall (N5.3, Automatico)');
ok(fwCon({ isolated: true }) === 0, 'Isolata: dispositivo disabilitato');
const srcFw = require('fs').readFileSync('./motore_regole_n5.js', 'utf8');
ok(!/FONTE NON VERIFICATA — FAQ 0\.1 citata/.test(srcFw), 'il commento non è più marcato come non verificato');
ok(/F01/.test(srcFw), 'e cita F01');

console.log('\n=== MSV L3 E ATTACCO A SORPRESA ===');
const spkM = { alias: 'Spk', bs: 12, cc: 15, skills: 'Surprise Attack (-3)', states: { camo: true } };
const msvU = { alias: 'MSV', bs: 12, cc: 15, ph: 12, skills: 'Multispectral Visor L3', states: {} };
function sorpMSV(arma, reaz, lof) {
    const r = M.risolviScontro({ attaccante: spkM, azione: arma.isCC ? M.AZIONI.CC_ATTACK : M.AZIONI.BS_ATTACK, arma: arma,
        bersaglio: msvU, burst: 1, rangeIndex: 0 },
        { difensore: msvU, azione: reaz, arma: reaz === 'DODGE' ? null : arma, bersaglio: 'Spk', burst: 1, rangeIndex: 0, hasLoF: lof }, {});
    return r.reattivo.voci.filter(v => v.fonte === 'sorpresa').reduce((a, v) => a + v.valore, 0);
}
const combiM = M.profiloArma('Combi Rifle'), ccM = M.profiloArma('CC Weapon');
ok(sorpMSV(combiM, 'BS_ATTACK', true) === 0, 'MSV L3 con LoF, risponde con BS: nessun -3');
ok(sorpMSV(combiM, 'DODGE', false) === -3, 'MSV L3 senza LoF, contro BS: -3');
ok(sorpMSV(ccM, 'DODGE', false) === 0, 'MSV L3 senza LoF, contro CC Attack: nessun -3');

console.log('\n=== F02: le Sorprese di più truppe NON si sommano ===');
// Nel Coordinato ognuno si applica a sé: il motore risolve uno scontro per
// attaccante, quindi ogni scontro porta SOLO la Sorpresa del proprio.
const bersF = { id: 'b', alias: 'Bersaglio', bs: 12, ph: 12, arm: 1, bts: 0, w: 1, s: 2, skills: '', states: {} };
const a1 = { id: 'a1', alias: 'Primo', bs: 12, skills: 'Surprise Attack (-3)', states: { camo: true } };
const a2 = { id: 'a2', alias: 'Secondo', bs: 12, skills: 'Surprise Attack (-3)', states: { camo: true } };
const scF = M.risolviPayload({ attacchi: [
    { attaccante: 'Primo', attaccanteId: 'a1', azione: M.AZIONI.BS_ATTACK, arma: combiM, bersagli: [{ id: 'b', name: 'Bersaglio', burst: 1, rangeIndex: 0, rangeMod: 0 }] },
    { attaccante: 'Secondo', attaccanteId: 'a2', azione: M.AZIONI.BS_ATTACK, arma: combiM, bersagli: [{ id: 'b', name: 'Bersaglio', burst: 1, rangeIndex: 0, rangeMod: 0 }] }
] }, [{ nome: 'Bersaglio', difensore: bersF, azione: 'BS_ATTACK', arma: combiM, bersaglio: 'Primo', burst: 1, rangeIndex: 0 }],
   { trovaUnita: (n, id) => [a1, a2, bersF].find(u => u.id === id || u.alias === n) });
const sorpPerScontro = scF.filter(x => x.reattivo).map(x =>
    x.reattivo.voci.filter(v => v.fonte === 'sorpresa').reduce((a, v) => a + v.valore, 0));
// 🔴 La prima versione di questo test passava con (0, 0): la Sorpresa non
// veniva applicata affatto — l attaccante era passato come oggetto invece
// che per nome — e "ogni valore >= -3" era vero comunque. Un test che non
// può fallire. Ora si pretende che la Sorpresa CI SIA, e che non raddoppi.
ok(sorpPerScontro.length > 0 && sorpPerScontro.some(v => v === -3),
   `la Sorpresa viene applicata davvero (${sorpPerScontro.join(', ')})`);
ok(sorpPerScontro.every(v => v === 0 || v === -3),
   'e nessuno scontro la somma: mai -6, ognuno porta solo la propria');

console.log('\n=== ECM (Hacker -N): Automatico, SENZA etichetta Comms ===');
// Non segue il Firewall: l Isolato non lo spegne, il Disconnesso sì.
const ecmU = { alias: 'ECM', bts: 3, skills: 'ECM (Hacker -3)', states: {} };
const ecmCon = st => M.valoreFirewall(Object.assign({}, ecmU, { states: st }));
ok(ecmCon({}) === -3, 'sana: -3');
ok(ecmCon({ isolated: true }) === -3, 'Isolata: l hacker applica -3 — l ECM resta');
ok(ecmCon({ disconnected: true }) === 0, 'Disconnessa: 0, perde gli Automatici');
ok(ecmCon({ possessed: true }) === -3, 'Posseduta: -3, gli Automatici restano');
ok(ecmCon({ unconscious: true }) === 0, 'Incosciente: 0, invariato');

console.log('\n=== SORPRESA N5.2: solo sui Faccia a Faccia dei bersagli ===');
// Decisione di Paolo: vale la wiki. La 5.1.1 diceva "any Skill Roll" (10137).
const spk5 = { alias: 'Spk', bs: 12, cc: 15, skills: 'Surprise Attack (-3)', states: { camo: true } };
const dif5 = { alias: 'D', bs: 12, ph: 12, wip: 12, skills: '', states: {} };
function sp5(reaz) {
    const r = M.risolviScontro({ attaccante: spk5, azione: M.AZIONI.BS_ATTACK, arma: combiM, bersaglio: dif5, burst: 1, rangeIndex: 0 },
        { difensore: dif5, azione: reaz, arma: reaz === 'BS_ATTACK' ? combiM : null, bersaglio: 'Spk', burst: 1, rangeIndex: 0 }, {});
    return { tipo: r.tipo, s: r.reattivo.voci.filter(v => v.fonte === 'sorpresa').reduce((a, v) => a + v.valore, 0) };
}
ok(sp5('DODGE').s === -3, 'bersaglio che Schiva un BS Attack a sorpresa: -3');
const rs = sp5('RESET');
ok(rs.tipo === 'NORMALE' && rs.s === 0, 'Reset contro lo stesso BS Attack: Tiro Normale, nessun -3');
// la truppa NON bersaglio fa il proprio scontro come attaccante: nessun -3
const nb = { id: 'nb', alias: 'NonBersaglio', bs: 12, ph: 12, skills: '', states: {} };
const scNB = M.risolviPayload({ attacchi: [
    { attaccante: 'Spk', attaccanteId: 'spk', azione: M.AZIONI.BS_ATTACK, arma: combiM,
      bersagli: [{ id: 'd5', name: 'D', burst: 1, rangeIndex: 0, rangeMod: 0 }] }] },
    [{ nome: 'NonBersaglio', difensore: nb, azione: 'BS_ATTACK', arma: combiM, bersaglio: 'Spk', burst: 1, rangeIndex: 0 }],
    { trovaUnita: (n, id) => [Object.assign({ id: 'spk' }, spk5), Object.assign({ id: 'd5' }, dif5), nb].find(u => u.id === id || u.alias === n) });
const suNB = scNB.filter(x => x.attivo && x.attivo.nome === 'NonBersaglio');
ok(suNB.length === 1, 'la truppa non bersaglio ha il proprio scontro');
ok(suNB.every(x => !x.attivo.voci.some(v => v.fonte === 'sorpresa')), 'e non subisce la Sorpresa');

console.log('\n=== BIOMETRIC VISOR contro Impersonation / Holoecho ===');
const impA = { alias: 'Imp', bs: 12, cc: 15, skills: 'Surprise Attack (-3)', states: { impersonation: true } };
const bioD = { alias: 'Bio', bs: 12, cc: 15, ph: 12, skills: 'Biometric Visor', states: {} };
function spB(arma, reaz, lof) {
    const r = M.risolviScontro({ attaccante: impA, azione: arma.isCC ? M.AZIONI.CC_ATTACK : M.AZIONI.BS_ATTACK, arma: arma, bersaglio: bioD, burst: 1, rangeIndex: 0 },
        { difensore: bioD, azione: reaz, arma: reaz === 'DODGE' ? null : arma, bersaglio: 'Imp', burst: 1, rangeIndex: 0, hasLoF: lof }, {});
    return r.reattivo.voci.filter(v => v.fonte === 'sorpresa').reduce((a, v) => a + v.valore, 0);
}
ok(spB(combiM, 'BS_ATTACK', true) === 0, 'con LoF: ignora la Sorpresa di chi è in Impersonation');
ok(spB(combiM, 'DODGE', false) === -3, 'senza LoF, contro BS: -3');
ok(spB(ccM, 'DODGE', false) === 0, 'contro CC Attack: sempre ignorata');

console.log('\n=== ECM: la nota DA VERIFICARE è tolta ===');
const srcE = require('fs').readFileSync('./motore_regole_n5.js', 'utf8');
ok(!/etichetta 5\.3 DA VERIFICARE/.test(srcE), 'la pagina wiki ECM è N5.3: verificato');

console.log('\n=== SATURAZIONE: per bersaglio, mai sotto 1, anche sul reattivo ===');
const Asat = { alias: 'A', bs: 12, skills: '', states: {} };
const Dsat = { alias: 'D', bs: 12, ph: 12, skills: '', states: {} };
const hmgS = M.profiloArma('Heavy Machine Gun');
function scSat(burstA, terrA, dif, reaz, armaR, terrR) {
    return M.risolviScontro({ attaccante: Asat, azione: M.AZIONI.BS_ATTACK, arma: combiM, bersaglio: dif, burst: burstA, rangeIndex: 0, terrain: terrA },
        { difensore: dif, azione: reaz, arma: armaR, bersaglio: 'A', burst: 1, rangeIndex: 0, terrain: terrR }, {});
}
// a) il ramo morto sul totale è tolto
const srcSat = require('fs').readFileSync('./motore_regole_n5.js', 'utf8');
ok(!/if \(typeof opzioni\.modBurstTerreno/.test(srcSat), 'il ramo morto modBurstTerreno è tolto');
// b) pavimento a 1 per l attivo
ok(scSat(1, 'TER_03', Dsat, 'DODGE', null).attivo.burst === 1, 'arma B1 attraverso TER_03: 1 colpo, non 0');
ok(scSat(3, 'TER_03', Dsat, 'DODGE', null).attivo.burst === 2, 'B3 attraverso TER_03: 2');
// c) il reattivo la subisce — si prova la DIFFERENZA, non un valore assoluto
const trS = { alias: 'TR', bs: 12, ph: 12, skills: 'Total Reaction', states: {} };
const senzaZona = scSat(1, null, trS, 'BS_ATTACK', hmgS, null).reattivo.burst;
const conZona = scSat(1, null, trS, 'BS_ATTACK', hmgS, 'TER_03').reattivo.burst;
ok(conZona === senzaZona - 1, `reattivo attraverso TER_03: un colpo in meno (${senzaZona} -> ${conZona})`);
ok(scSat(1, null, Dsat, 'BS_ATTACK', combiM, 'TER_03').reattivo.burst === 1, 'reattivo B1: resta 1, mai 0');

console.log('\n=== F17: MSV L1 + Sesto Senso contro la Zona di Visibilità Zero ===');
// TER_13 "Foresta Primordiale". Si prova rompendo: senza Sesto Senso il -6 c è.
function meno6(skills) {
    const d = { alias: 'X', bs: 12, ph: 12, skills: skills, states: {} };
    return scSat(1, null, d, 'BS_ATTACK', combiM, 'TER_13').reattivo.voci.some(v => v.fonte === 'terreno' && v.valore === -6);
}
ok(meno6('Multispectral Visor L1, Sixth Sense') === false, 'MSV L1 + Sesto Senso: nessun -6');
ok(meno6('Multispectral Visor L1') === true, 'solo MSV L1: il -6 c è — il test sa distinguere');

console.log('\n=== La presunzione del bersaglio è dichiarata ===');
const rP = M.modReazione({ alias: 'R', bs: 12, ph: 12, skills: '', states: {} },
    { azione: 'DODGE' }, { attacco: { azione: M.AZIONI.BS_ATTACK, arma: combiM, attaccante: Asat } });
ok(rP.note.some(n => /presunto l.attaccante/.test(n)), 'senza bersaglio indicato, la nota lo dice');

console.log('\n=== TOTAL REACTION: Burst PIENO dell arma in ARO, non 3 fisso ===');
// righe 10221-10228: "full Burst (B) of their weapon. Any MOD to B will also apply."
function trB(arma, terr) {
    return M.risolviScontro({ attaccante: Asat, azione: M.AZIONI.BS_ATTACK, arma: combiM, bersaglio: trS, burst: 1, rangeIndex: 0 },
        { difensore: trS, azione: 'BS_ATTACK', arma: arma, bersaglio: 'A', burst: 1, rangeIndex: 0, terrain: terr }, {}).reattivo.burst;
}
ok(trB(hmgS) === 4, 'HMG (B4) con Total Reaction in ARO: 4');
ok(trB(hmgS, 'TER_03') === 3, 'la stessa attraverso TER_03: 3, il MOD al Burst si applica');
ok(trB(combiM) === 3, 'Combi (B3): 3');
ok(M.burstReattivo({ alias: 'N', skills: '', states: {} }, hmgS).valore === 1,
   'senza Total Reaction la HMG in ARO resta B1');
const piu1 = M.burstReattivo(trS, M.profiloArma('Combi Rifle(+1B)'));
ok(piu1.valore === 3, 'Combi (+1B) con Total Reaction: 3, il (+1B) non è applicato in ARO — comportamento invariato');
// Deciso da REGOLE: in ARO il Total Reaction dà il Burst pieno dell'ARMA e il
// (+1B) del profilo non si somma. Non è più un punto da verificare.
ok(!piu1.note.some(n => /DA VERIFICARE/.test(n)),
   'e la nota non lo segnala più come da verificare: la regola è decisa');

console.log('\n=== TOTAL REACTION IN SOPPRESSIONE: il B3 del profilo SF ===');
// Il Math.max(pieno, base) non puo` dare B4 con gittate SF: il profilo SF
// Mode porta burst 3. Il test lo blocca, così se un domani il profilo SF
// ereditasse il Burst dell arma, diventa rosso.
const hmgSF = M.profiloSF(hmgS);
ok(hmgSF.sfMode === true && hmgSF.burst === 3, 'il profilo SF Mode della HMG ha burst 3');
const trSop = { alias: 'T', skills: 'Total Reaction', states: { suppressive: true }, weapon: 'Heavy Machine Gun', bs: 12 };
ok(M.burstReattivo(trSop, hmgSF).valore === 3, 'HMG con Total Reaction in Soppressione, SF Mode: 3');
const aroSop = M.armiARO(trSop, 'BS_ATTACK');
ok((aroSop.armi || []).every(a => a.sfMode), 'in Soppressione si offre solo il profilo SF Mode');
// Decisione di Paolo: il modo normale ORA è offerto, e la nota lo spiega.
ok((aroSop.note || []).some(n => /si ANNULLA/.test(n)),
   'e la nota dice che il modo normale annulla la Soppressione');

console.log('\n=== IL BERSAGLIO CHE RISPONDE: Zona Zero e Rumore Bianco ===');
// applicaModTerreno ha il sesto argomento `bersaglio` (database_comune.js
// 2026-09-21.2, 997b877e.49987). Il reattivo che risponde all attaccante lo passa vero.
function rZ(skills, terr, azione) {
    const d = { alias: 'X', bs: 12, ph: 12, skills: skills, states: {} };
    const r = M.risolviScontro({ attaccante: Asat, azione: M.AZIONI.BS_ATTACK, arma: combiM, bersaglio: d, burst: 1, rangeIndex: 0 },
        { difensore: d, azione: azione || 'BS_ATTACK', arma: azione === 'DODGE' ? null : combiM, bersaglio: 'A', burst: 1, rangeIndex: 0, terrain: terr }, {});
    return { t: r.reattivo.voci.filter(v => v.fonte === 'terreno').reduce((a, v) => a + v.valore, 0),
             lof: r.reattivo.mod !== null, note: r.reattivo.note };
}
const z0 = rZ('', 'TER_13');
ok(z0.t === -6 && z0.lof === true, 'senza visore, BS attraverso TER_13: -6 e LoF — prima niente LoF');
ok(rZ('Sixth Sense', 'TER_13').t === 0, 'col Sesto Senso DA SOLO: 0 — prima serviva anche l MSV L1');
ok(rZ('Multispectral Visor L1', 'TER_13').t === -6, 'MSV L1 senza Sesto Senso: -6');
ok(rZ('Multispectral Visor L1, Sixth Sense', 'TER_13').t === 0, 'MSV L1 + Sesto Senso: 0 (F17)');
ok(rZ('Multispectral Visor L2', 'TER_17').t === -6, 'MSV L2 attraverso TER_17 (Rumore Bianco), da BERSAGLIO: -6');
// 🔴 Il verso conta: lo stesso MSV L2 come ATTACCANTE attraverso TER_17 ha la
// LoF BLOCCATA. Senza questa controprova il test sopra passerebbe anche su
// una funzione che ignorasse il verso. (Chat DATABASE, 21 settembre.)
const attRB = M.modAttacco({ alias: 'Att', bs: 12, skills: 'Multispectral Visor L2', states: {} },
    { alias: 'B', arm: 1, skills: '', states: {} }, combiM, M.AZIONI.BS_ATTACK, { rangeIndex: 0, terrain: 'TER_17' });
ok(attRB.lofBloccata === true, 'lo stesso MSV L2 da ATTACCANTE attraverso TER_17: LoF bloccata');
const schZ = rZ('', 'TER_13', 'DODGE');
ok(schZ.t === 0, 'Schivata attraverso TER_13: nessun MOD di visibilità');
// Deciso da REGOLE (F17) e chiuso nel motore .17: con Visore E Sesto Senso il
// -6 del Rumore Bianco cade. La controprova — solo Visore, il -6 resta — è in
// test_casi_regole.js sezione 5.
const wn = rZ('Multispectral Visor L2, Sixth Sense', 'TER_17');
ok(wn.t === 0, `Sesto Senso + Rumore Bianco: nessun -6 (${wn.t})`);
ok(!wn.note.some(n => /DA VERIFICARE/.test(n)), 'e la nota non lo dà più per aperto');

// 🔴 Controprova: l ATTACCANTE (bersaglio=false) attraverso la Zona Zero
// senza visore resta senza LoF. Senza questa, il test non distinguerebbe
// il flag da una Zona Zero che non blocca più niente.
const attZ = M.modAttacco({ alias: 'At', bs: 12, skills: '', states: {} },
    { alias: 'Df', arm: 1, skills: '', states: {} }, combiM, M.AZIONI.BS_ATTACK, { rangeIndex: 0, terrain: 'TER_13' });
ok(attZ.lofBloccata === true, 'l attaccante senza visore attraverso TER_13: LoF bloccata, come prima');

console.log('\n=== La firma documentata ===');
// La firma documenta ENTRAMBE le forme: posizionale (sesto argomento
// `bersaglio`) e a oggetto, che è quella usata dal motore dalla .19.
const firmaT = M.FUNZIONI_DATI.modTerreno.firma;
ok(/hasMSV3, bersaglio\)/.test(firmaT) && /\{ msv1, msv2, msv3, marksmanship, bersaglio \}/.test(firmaT),
   'la firma documenta sia la forma posizionale sia quella a oggetto');
const srcT = require('fs').readFileSync('./motore_regole_n5.js', 'utf8');
ok(!/Una chiamata a quattro argomenti resta\s*\n\s*\/\/ valida/.test(srcT), 'il commento falso sulle quattro argomenti è tolto');

console.log('\n=== ZONA ZERO: solo il BERSAGLIO di un BS Attack ha la LoF ===');
// "Any Trooper who is the target of a BS Attack" — non ogni reazione.
const Az = { id: 'a', alias: 'A', bs: 12, wip: 13, skills: 'Hacker', states: {} };
const Rz = { id: 'r', alias: 'R', bs: 12, ph: 12, skills: '', states: {} };
const Oz = { id: 'o', alias: 'Altro', bs: 12, skills: '', states: {} };
function zz(azione, bersaglio) {
    const e = M.modReazione(Rz, { azione: 'BS_ATTACK', arma: combiM, bersaglio: 'A', rangeIndex: 0, terrain: 'TER_13' },
        { attacco: { azione: azione, arma: combiM, attaccante: Az, bersaglio: bersaglio }, rangeIndex: 0, terrain: 'TER_13' });
    return { lof: !e.lofBloccata, terr: e.voci.filter(v => v.fonte === 'terreno').reduce((a, v) => a + v.valore, 0), note: e.note || [] };
}
ok(zz('MOVIMENTO', Rz).lof === false, 'attivo che MUOVE attraverso TER_13: il reattivo non ha LoF');
ok(zz(M.AZIONI.HACKING, Rz).lof === false, 'attivo che HACKERA il reattivo: nessuna LoF per un BS in ARO');
const zb = zz(M.AZIONI.BS_ATTACK, Rz);
ok(zb.lof === true && zb.terr === -6, 'attivo che spara al reattivo: -6, LoF sì (invariato)');
ok(zz(M.AZIONI.BS_ATTACK, Oz).lof === false, 'attivo che spara a un ALTRO: il terzo non ha LoF');
ok(zz(M.AZIONI.SPECULATIVO, Rz).lof === true, 'anche lo Speculativo: etichetta BS Attack (F05)');
ok(zz(M.AZIONI.BS_ATTACK, undefined).note.some(n => /presunto questo reattivo/.test(n)),
   'bersaglio non indicato: presunto, e la nota lo dice — non più in un campo che nessuno legge');

console.log('\n=== a) statiPerCategoria porta il flag nullo ===');
function nulloDi(st) {
    const g = M.statiPerCategoria({ alias: 'X', states: st });
    return g.length ? g[0].stati[0].nullo : null;
}
ok(nulloDi({ possessed: true }) === true, 'Posseduto: nullo true');
ok(nulloDi({ isolated: true }) === false, 'Isolato: nullo false');
ok(nulloDi({ retreat: true }) === false, 'Ritirata!: nullo false');
ok(nulloDi({ unconscious: true }) === true, 'Incosciente: nullo true');

console.log('\n=== b2) In Soppressione si offre ANCHE il modo normale ===');
const trSopN = { id: 'ts', alias: 'T', bs: 12, skills: 'Total Reaction', states: { suppressive: true }, weapon: 'Heavy Machine Gun' };
const esN = M.armiARO(trSopN, 'BS_ATTACK');
ok((esN.armi || []).every(a => a.sfMode), 'armi: i profili SF, come prima');
const norm = (esN.armiModoNormale || [])[0];
ok(norm && norm.annullaSoppressione === true && !norm.sfMode, 'armiModoNormale: il profilo normale, marcato annullaSoppressione');
// SF Mode: B3, stato attivo
ok(M.burstReattivo(trSopN, esN.armi[0]).valore === 3, 'SF Mode: B3, e resta in Soppressione');
// modo normale: B4, stato cancellato
const ann = M.annullaSoppressione(trSopN);
ok(ann.unitaAggiornata.states.suppressive === false, 'scegliendo il modo normale lo stato si cancella');
ok(trSopN.states.suppressive === true, 'e l originale non è toccato: lo sostituisce l app');
ok(M.burstReattivo(ann.unitaAggiornata, norm).valore === 4, 'modo normale con Total Reaction: B4');

console.log('\n=== b1, b2 passando da logica_aro.js ===');
{
    const el = {};
    const nd = id => el[id] || (el[id] = { id, innerHTML: '', style: {}, appendChild() {}, remove() {} });
    const docPrima = global.document;
    global.document = Object.assign({}, docPrima, { getElementById: nd, querySelector: () => nd('q'), querySelectorAll: () => [] });
    global.goToAroStep = () => {};
    require('./logica_aro.js');
    window.roster = [trSopN];
    window.aroCurrentConfig = { id: 'ts' };
    window.selectedAroUnits = ['ts']; window.currentAroIndex = 0;
    // il passo che mostra le armi: si chiama con l azione BS
    if (typeof window.selezionaAzioneAro === 'function') window.selezionaAzioneAro('BS_ATTACK');
    const htmlArmi = nd('aro-weapon-list').innerHTML;
    // Niente scappatoie: la prima versione passava anche con l'HTML vuoto.
    ok(htmlArmi.length > 0, 'il passo delle armi disegna qualcosa');
    ok(/si ANNULLA/.test(htmlArmi), 'la nota restituita compare sotto il riquadro');
    ok(/MODO NORMALE/.test(htmlArmi) && /ANNULLA LA SOPPRESSIONE/.test(htmlArmi),
       'e il modo normale compare con l avviso arancione');
    window.selezionaArmaAro('Heavy Machine Gun', true);
    ok(window.roster[0].states.suppressive === false, 'cliccando il modo normale, il roster ha la Soppressione annullata');
    ok(window.aroCurrentConfig.annullaSoppressione === true, 'e la configurazione dell ARO lo ricorda');
    global.document = docPrima;
}

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
