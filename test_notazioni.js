// @versione 2026-09-23.1 | test_notazioni.js | proprieta`: chat TEST
// Test del parser notazioni sul database PanOceania reale — node test_notazioni.js
global.window = global;
require('./catalogo_n5.js'); require('./database_comune.js'); require('./database_panoceania.js'); require('./database_nomad.js');
const M = require('./motore_regole_n5.js');

let passati = 0, falliti = 0;
function ok(c, n, e) { if (c) { passati++; console.log(`  ✅ ${n}`); } else { falliti++; console.log(`  ❌ ${n}${e ? '\n       ' + e : ''}`); } }
const P = (x) => M.parseNotazione(x);

console.log('\n=== 1. LA SEGNALAZIONE: Dodge (+1") è movimento ===');
ok(P('+1"').tipo === 'MOVIMENTO' && P('+1"').valore === 1, '+1" riconosciuto come movimento');
ok(P('+2"').tipo === 'MOVIMENTO', '+2" idem');
ok(P('3"').tipo === 'MOVIMENTO', '3" (Climb) idem');
ok(P('+4"').tipo === 'MOVIMENTO', '+4" (Forward Deployment) idem');

const mov = M.modSchivata({ ph: 10, skills: 'Dodge (+1")' }, { haLoFVersoAttaccante: true });
ok(mov.valore === 10, 'Dodge (+1"): il PH resta 10, il pollice NON si somma al tiro');
ok(mov.note.some(n => n.includes('movimento')), 'e la schermata spiega cos è');

console.log('\n=== 2. Dodge (PH=N) SOSTITUISCE il PH — era ignorato ===');
ok(P('PH=11').tipo === 'SOSTITUZIONE' && P('PH=11').valore === 11, 'PH=11 riconosciuto come sostituzione');
const sost = M.modSchivata({ ph: 10, skills: 'Dodge (PH=13)' }, { haLoFVersoAttaccante: true });
ok(sost.valore === 13, `Dodge (PH=13) su unità PH 10 -> 13 (ottenuto ${sost.valore})`);
ok(sost.base === 13 && sost.note.some(n => n.includes('al posto del')), 'con la spiegazione');
const sostSenzaLoF = M.modSchivata({ ph: 10, skills: 'Dodge (PH=13)' }, { haLoFVersoAttaccante: false });
ok(sostSenzaLoF.valore === 10, 'e i MOD si applicano DOPO la sostituzione: 13 -3 = 10');

console.log('\n=== 3. BS Attack (+1SD) non è Burst — era ignorato ===');
ok(P('+1SD').tipo === 'DADO_SPECIALE', '+1SD riconosciuto');
ok(P('+1B').tipo === 'BURST', '+1B resta Burst');
const combi = M.profiloArma('Combi Rifle');
const bSD = M.burstIniziale({ skills: 'BS Attack (+1SD)' }, combi, { azione: M.AZIONI.BS_ATTACK });
ok(bSD.valore === 3 && bSD.sd === 1, `+1SD: Burst resta 3, dado extra 1 (ottenuto B${bSD.valore} SD${bSD.sd})`);
const bB = M.burstIniziale({ skills: 'BS Attack (+1B)' }, combi, { azione: M.AZIONI.BS_ATTACK });
ok(bB.valore === 4 && bB.sd === 0, '+1B: Burst 4, nessun dado extra');

console.log('\n=== 4. (PS=N) sostituisce il danno dell arma — era ignorato ===');
ok(P('PS=6').tipo === 'SOSTITUZIONE' && P('PS=6').attributo === 'PS', 'PS=6 riconosciuto');
const ccBase = M.profiloArma('AP CC Weapon');
const ccSost = M.profiloArma('AP CC Weapon (PS=6)');
ok(ccSost.dam === 6, `AP CC Weapon (PS=6) -> PS 6, non ${ccBase.dam} del database`);
ok(ccSost.avvisi.some(a => a.codice === 'A48'), 'e la sostituzione è dichiarata');

console.log('\n=== 5. Le altre famiglie ===');
ok(P('SR-1').tipo === 'SALVEZZA' && P('SR-1').valore === -1, 'SR-1: MOD al Tiro Salvezza del bersaglio');
ok(P('+3').tipo === 'MOD' && P('+3').valore === 3, '+3: MOD normale');
ok(P('-3').tipo === 'MOD' && P('-3').versoAvversario === true, '-3: MOD verso l avversario');
ok(P('Shock').tipo === 'MUNIZIONE', 'Shock: munizione');
ok(P('Total').tipo === 'TESTO', 'Total (Terrain): testo');
ok(P('ReRoll').tipo === 'TESTO', 'ReRoll: testo');

console.log('\n=== 6. Passata su TUTTO il database PanOceania ===');
const db = window.DB_PANOCEANIA;
const perTipo = {};
const nonClassificate = new Set();
db.forEach(u => ['skills', 'equip', 'weapon'].forEach(k => {
    String(u[k] || '').replace(/\(([^)]*)\)/g, (m, val) => {
        const n = P(val.trim());
        perTipo[n.tipo] = (perTipo[n.tipo] || 0) + 1;
        if (n.tipo === 'TESTO') nonClassificate.add(val.trim());
        return m;
    });
}));
console.log('   ' + Object.entries(perTipo).sort((a, b) => b[1] - a[1]).map(([t, c]) => `${t}:${c}`).join('  '));
ok(db.length === 269, `${db.length} unità PanOceania lette`);
ok((perTipo.MOVIMENTO || 0) >= 60, `${perTipo.MOVIMENTO} notazioni di movimento, tutte tenute fuori dai tiri`);
ok((perTipo.SOSTITUZIONE || 0) >= 60, `${perTipo.SOSTITUZIONE} sostituzioni riconosciute (prima: ignorate)`);
ok((perTipo.DADO_SPECIALE || 0) >= 6, `${perTipo.DADO_SPECIALE} dadi speciali riconosciuti (prima: ignorati)`);
console.log('\n   Restano qualitative (corrette come TESTO):');
console.log('   ' + [...nonClassificate].sort().slice(0, 18).join(', '));

console.log('\n=== 7. Nessuna unità PanO rompe il motore ===');
let errori = 0;
db.forEach(u => {
    try {
        M.modSchivata(u, { haLoFVersoAttaccante: true });
        M.modReset(u, {});
        M.livelloMartialArts(u);
        M.programmiDisponibili(u);
        M.armiCC(u); M.armiIntuitive(u); M.armiSpeculative(u); M.armiGuidate(u); M.armiSoppressione(u);
    } catch (e) { errori++; if (errori < 3) console.log(`     ${u.nome}: ${e.message}`); }
});
ok(errori === 0, `tutte le ${db.length} unità passano dal motore senza eccezioni`);

console.log('\n=== 8. DATABASE NOMADI: famiglie che PanOceania non usa ===');
const nom = window.DB_NOMADI;
ok(nom.length === 173, `${nom.length} unità Nomadi lette`);

ok(P('PH+3').tipo === 'MOD_ATTRIBUTO' && P('PH+3').attributo === 'PH' && P('PH+3').valore === 3,
   'PH+3: MOD a un attributo specifico (i Nomadi lo usano, PanO no)');
ok(P('PH=11').tipo === 'SOSTITUZIONE',
   'e resta distinto da PH=11, che invece sostituisce');
const modAttr = M.modSchivata({ ph: 11, skills: 'Dodge (PH+3)' }, { haLoFVersoAttaccante: true });
ok(modAttr.valore === 14, `Dodge (PH+3) su PH 11 -> 14 (ottenuto ${modAttr.valore})`);
const sostAttr = M.modSchivata({ ph: 13, skills: 'Dodge (PH=11)' }, { haLoFVersoAttaccante: true });
ok(sostAttr.valore === 11, `Dodge (PH=11) su PH 13 -> 11, non 24 (ottenuto ${sostAttr.valore})`);

const arm = M.modSchivata({ ph: 10, arm: 2, skills: 'Dodge (ARM+3)' }, { haLoFVersoAttaccante: true });
ok(arm.valore === 10 && arm.note.some(n => n.includes('FALLISCI')),
   'Dodge (ARM+3): NON tocca il tiro, vale sul Tiro Salvezza se fallisci');

console.log('\n=== 9. UPGRADE dei dispositivi di hacking ===');
ok(P('UPGRADE Zero Pain').tipo === 'UPGRADE', 'UPGRADE riconosciuto');
ok(P('UPGRADE Zero Pain').voci[0].programma === 'ZERO PAIN', 'e il programma estratto');
const up2 = P('UPGRADE Oblivion +1B, Trinity AP');
ok(up2.voci.length === 2 && up2.voci[0].modifica === '+1B',
   'upgrade multiplo con modifiche scomposto correttamente');

const zoe = nom.find(u => /UPGRADE Zero Pain/.test(u.equip || ''));
ok(!!zoe, 'trovata un unità Nomade con un upgrade');
if (zoe) {
    const e = M.programmiAttacco(zoe);
    ok(e.upgrade.length > 0, `${zoe.nome}: upgrade riconosciuto (prima veniva ignorato)`);
}
const conMod = nom.find(u => /UPGRADE Trinity SR-1/.test(u.equip || ''));
if (conMod) {
    const e = M.programmiAttacco(conMod);
    const tri = e.programmi.find(p => p.nome === 'TRINITY');
    ok(tri && tri.modSalvezzaBersaglio === -1,
       `${conMod.nome}: l upgrade Trinity SR-1 è APPLICATO, non solo segnalato`);
    ok(e.avvisi.length === 0, 'e nessun avviso residuo');
}

console.log('\n=== 10. Passata sul database Nomadi ===');
const perTipoN = {};
nom.forEach(u => ['skills', 'equip', 'weapon'].forEach(k =>
    String(u[k] || '').replace(/\(([^)]*)\)/g, (m, v) => {
        const t = P(v.trim()).tipo; perTipoN[t] = (perTipoN[t] || 0) + 1; return m;
    })));
console.log('   ' + Object.entries(perTipoN).sort((a, b) => b[1] - a[1]).map(([t, c]) => `${t}:${c}`).join('  '));
ok((perTipoN.MOD_ATTRIBUTO || 0) >= 3, `${perTipoN.MOD_ATTRIBUTO} MOD_ATTRIBUTO nel conteggio piatto (prima: ignorati)`);

// Il database ha una notazione ANNIDATA: "TAGCom (Dodge (PH+3))".
// Il conteggio piatto qui sopra non la vede, il motore sì.
const tagcom = nom.find(u => /TAGCom \(Dodge/.test((u.skills || '') + ' ' + (u.equip || '')));
ok(!!tagcom, 'trovata un unità con notazione annidata TAGCom (Dodge (PH+3))');
if (tagcom) {
    const e = M.modSchivata(tagcom, { haLoFVersoAttaccante: true });
    ok(e.valore === tagcom.ph + 3,
       `notazione annidata letta comunque: PH ${tagcom.ph} -> ${e.valore}`);
}
ok((perTipoN.UPGRADE || 0) >= 7, `${perTipoN.UPGRADE} UPGRADE (prima: ignorati)`);

let erroriN = 0;
nom.forEach(u => {
    try {
        M.modSchivata(u, { haLoFVersoAttaccante: true }); M.modReset(u, {});
        M.programmiDisponibili(u); M.armiCC(u); M.armiIntuitive(u);
        M.armiSpeculative(u); M.armiGuidate(u); M.armiSoppressione(u);
    } catch (e) { erroriN++; if (erroriN < 3) console.log(`     ${u.nome}: ${e.message}`); }
});
ok(erroriN === 0, `tutte le ${nom.length} unità Nomadi passano dal motore senza eccezioni`);

console.log('\n=== 11. UPGRADE ora APPLICATI, non solo riconosciuti ===');
const tcBase = M.armaDaProgramma('TOTAL CONTROL');
const tcUp = M.armaDaProgramma('TOTAL CONTROL', '+1B');
ok(tcBase.burst === 1 && tcUp.burst === 2, 'UPGRADE Total Control +1B: Burst 1 -> 2');
const triUp = M.armaDaProgramma('TRINITY', 'SR-1');
ok(triUp.modSalvezzaBersaglio === -1, 'UPGRADE Trinity SR-1: -1 ai Tiri Salvezza del bersaglio');
const triAp = M.armaDaProgramma('TRINITY', 'AP');
ok(triAp.ammo === 'AP' && triAp.dimezzaBTS === true,
   'UPGRADE Trinity AP: munizione N -> AP, e il BTS ora si dimezza');
const oblUp = M.armaDaProgramma('OBLIVION', '+1B');
ok(oblUp.burst === 3, 'UPGRADE Oblivion +1B: Burst 2 -> 3');

const mary = nom.find(u => /UPGRADE Oblivion/.test(u.equip || ''));
if (mary) {
    const obl = M.programmiAttacco(mary).programmi.find(p => p.nome === 'OBLIVION');
    ok(obl && obl.burst === 3, `${mary.nome}: Oblivion arriva a B3 dal profilo (prima restava B2)`);
}
const kulak = nom.find(u => /Killer Hacking Device.*UPGRADE Carbonite|UPGRADE Carbonite/.test(u.equip || ''));
if (kulak) {
    const e = M.programmiAttacco(kulak);
    ok(e.programmi.some(p => p.nome === 'CARBONITE'),
       `${kulak.nome}: l upgrade AGGIUNGE Carbonite a un Killer Hacking Device che non l avrebbe`);
}

console.log('\n=== 12. Tratti dal database, non più dedotti ===');
const combiDb = M.profiloArma('Combi Rifle');
ok(combiDb.traitsFonte === 'database', 'i Tratti ora vengono dal database');
ok(M.haTratto(combiDb, 'Suppressive Fire'), 'Combi Rifle ha il Tratto Suppressive Fire');
const ap = M.profiloArma('MULTI Rifle (AP Mode)');
const am = M.profiloArma('MULTI Rifle (Anti-Materiel Mode)');
ok(M.haTratto(ap, 'Suppressive Fire'), 'MULTI Rifle modalità AP: può sopprimere');
ok(!M.haTratto(am, 'Suppressive Fire'),
   'MULTI Rifle modalità Anti-materiel: NON può (il Tratto è della modalità)');
const eSopp = M.armiSoppressione({ weapon: 'MULTI Rifle, Chain Rifle' });
ok(eSopp.armi.every(a => M.haTratto(a, 'Suppressive Fire')), 'solo modalità col Tratto ammesse');
ok(eSopp.escluse.some(x => /Anti-Materiel/i.test(x.nome)), 'l Anti-materiel è escluso col motivo');
ok(eSopp.avvisi.length === 0, 'e nessun avviso: non si tira più a indovinare');

console.log('\n=== 13. SF Mode: profilo unico, gittata massima 24" ===');
const hmg = M.profiloArma('Heavy Machine Gun');
const sf = M.profiloSF(hmg);
ok(sf.burst === 3, 'Burst 3');
ok(JSON.stringify(sf.bands.map(b => b.mod)) === '[0,0,-3]', '0 / 0 / -3');
ok(sf.bands[sf.bands.length - 1].a === 24, 'ultima banda a 24"');
ok(hmg.bands[hmg.bands.length - 1].a === 48,
   'mentre l HMG normale arriva a 48": in Soppressione la gittata si dimezza');
ok(M.bandaPerDistanza(sf, 40).fuoriGittata === true,
   'un ARO in Soppressione a 40" è FUORI GITTATA (prima sarebbe passato)');
ok(sf.dam === hmg.dam && sf.ammo === hmg.ammo, 'PS e munizione restano quelli dell arma');
ok(!M.profiloSF(M.profiloArma('Heavy Machine Gun')).avvisi.some(a => a.codice === 'A97'),
   'nessun avviso di ripiego: il profilo SF ora è quello ufficiale');

console.log('\n=== 14. Formato bande: lista nuova e oggetto legacy ===');
const nuovo = M.bandeGittata([3, 3, -3, -3, -6, -6]);
ok(nuovo.formato === 'lista' && nuovo.bande.length === 6, 'formato a lista: 6 bande da 8"');
ok(nuovo.bande[0].a === 8 && nuovo.bande[5].a === 48, 'colonne 0-8 ... 40-48');
ok(nuovo.bande[0].mod === 3 && nuovo.bande[2].mod === -3, 'MOD nell ordine dato');
const doppio = M.bandeGittata([-3, 3, -3]);
ok(doppio.bande.length === 3 && doppio.bande[0].mod === -3 && doppio.bande[2].mod === -3,
   'due bande con lo STESSO MOD: impossibile nel formato vecchio, naturale in questo');
const legacy = M.bandeGittata({ p3: 16, m3: 32, m6: 48 });
ok(legacy.formato === 'legacy' && legacy.bande.length === 3, 'formato vecchio ancora supportato');
const esplicito = M.bandeGittata([{ a: 16, mod: 3 }, { a: 96, mod: -3 }]);
ok(esplicito.bande[1].a === 96, 'e la lista esplicita {a, mod} per bande non multiple di 8"');

console.log('\n=== 11. Divisore consapevole delle parentesi ===');
ok(M.dividiLista('A, B, C').length === 3, 'lista semplice: 3 voci');
const conVirgola = M.dividiLista('Killer Hacking Device (UPGRADE Oblivion +1B, Trinity AP), Pistol, CC Weapon');
ok(conVirgola.length === 3, `virgola dentro le parentesi: 3 voci, non 4 (ottenute ${conVirgola.length})`);
ok(conVirgola[0] === 'Killer Hacking Device (UPGRADE Oblivion +1B, Trinity AP)',
   'la voce col doppio upgrade resta intera');
ok(M.dividiLista('Combi Rifle, -, Pistol').length === 2, 'il segnaposto "-" viene scartato');
ok(M.dividiLista('Commlink [+1], Pistol').length === 2, 'anche le parentesi quadre sono rispettate');

console.log('\n=== 12. Equipaggiamento non è arma mancante ===');
ok(M.classificaVoceProfilo('X Visor').tipo === 'EQUIPAGGIAMENTO', 'X Visor: equipaggiamento');
ok(M.classificaVoceProfilo('Deployable Cover').tipo === 'EQUIPAGGIAMENTO', 'Deployable Cover: equipaggiamento');
ok(M.classificaVoceProfilo('TinBot: Firewall (-3)').tipo === 'EQUIPAGGIAMENTO', 'TinBot: equipaggiamento');
ok(M.classificaVoceProfilo('Combi Rifle').tipo === 'ARMA', 'Combi Rifle: arma');
ok(M.classificaVoceProfilo('MULTI Rifle').tipo === 'CONTENITORE', 'MULTI Rifle: contenitore di modalità');
ok(M.classificaVoceProfilo('Fucile Immaginario').tipo === 'SCONOSCIUTA', 'un nome inventato resta sconosciuto');

console.log('\n=== 13. Nomi arma con spazi attorno al + ===');
ok(M.profiloArma('AP + DA CC Weapon (PS=6)').nome === 'AP+DA CC Weapon',
   '"AP + DA CC Weapon" risolve su "AP+DA CC Weapon"');
ok(M.profiloArma('AP + DA CC Weapon (PS=6)').dam === 6, 'e il PS=6 del profilo si applica');

console.log('\n=== 14. Nessuna voce di profilo resta sconosciuta ===');
const ignote = {};
[...window.DB_PANOCEANIA, ...window.DB_NOMADI].forEach(u =>
    M.dividiLista((u.weapon || '') + ',' + (u.equip || '')).forEach(n => {
        if (M.classificaVoceProfilo(n).tipo === 'SCONOSCIUTA') ignote[n] = (ignote[n] || 0) + 1;
    }));
ok(Object.keys(ignote).length === 0,
   'tutte le voci dei 442 profili sono classificate',
   Object.keys(ignote).join(', '));

console.log('\n=== 15. Armi ex-munizione: i campi battono il nome ===');
// TRAPPOLA: K1 e BREAKER non sono più munizioni N5, ma sopravvivono nei NOMI
// di alcune armi. Se un giorno qualcuno riscrive il calcolo deducendo la
// munizione dal nome dell'arma, queste ricadono nel vuoto. Il motore deve
// leggere ammo/salvAttr/salvTiri dal profilo e mai dal nome.
const exMunizione = [
    ['K1 Combi Rifle',         'N',  'ARM', { azzera: true }],
    ['Breaker Combi Rifle',    'AP', 'BTS', { dimezza: true }],
    ['Breaker Pistol',         'AP', 'BTS', { dimezza: true }],
    ['Monofilament CC Weapon', 'N',  'ARM', { azzera: true }]
];
exMunizione.forEach(function (caso) {
    const nome = caso[0], ammoAtteso = caso[1], attrAtteso = caso[2], flag = caso[3];
    const arma = M.profiloArma(nome);
    if (arma.nonTrovata) { falliti++; console.log(`  ❌ ${nome} non trovata`); return; }
    const s = M.parametriSalvezza(arma);
    ok(arma.ammo === ammoAtteso, `${nome}: munizione ${ammoAtteso} letta dal campo, non dedotta dal nome`);
    ok(s.attributo === attrAtteso, `${nome}: salvezza su ${attrAtteso}`,
       `ottenuto ${s.attributo}`);
    if (flag.dimezza) ok(s.dimezza === true, `${nome}: attributo dimezzato`);
    if (flag.azzera) ok(s.azzera === true, `${nome}: attributo azzerato`);
    ok(s.fonte === 'arma', `${nome}: parametri presi dall arma, non dalla munizione`);
    ok(!s.avvisi.some(a => a.codice === 'A50' || a.codice === 'A52'),
       `${nome}: nessun avviso di munizione ritirata o sconosciuta`);
});

// E i nomi delle munizioni ritirate NON devono risolvere come munizioni.
ok(M.risolviMunizione('K1').rimossa === true, '"K1" resta una munizione N3 ritirata');
ok(M.risolviMunizione('K1 Combi Rifle').ok === false,
   'un NOME D ARMA non risolve come munizione: il nome non è una fonte');

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
