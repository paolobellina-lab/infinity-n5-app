// @versione 2026-09-23.1 | test_finiture.js | proprieta`: chat TEST
// Test delle ultime rifiniture — node test_finiture.js
global.window = global;
require('./catalogo_n5.js'); require('./database_comune.js');
const M = require('./motore_regole_n5.js');
require('./calcolatore_math.js');

let passati = 0, falliti = 0;
function ok(c, n, e) { if (c) { passati++; console.log(`  ✅ ${n}`); } else { falliti++; console.log(`  ❌ ${n}${e ? '\n       ' + e : ''}`); } }

const combi = M.profiloArma('Combi Rifle');
const ccw   = M.profiloArma('CC Weapon');

console.log('\n=== 1. La Soppressione oltre le 24" ===');
const alg  = { alias: 'Alguacil', bs: 11, cc: 13, ph: 10, skills: '', states: {} };
const sopp = { alias: 'Soppress', bs: 11, cc: 13, ph: 10, arm: 1, skills: '', states: { suppressive: true } };
function sp(i) {
    const e = M.modAttacco(alg, sopp, combi, M.AZIONI.BS_ATTACK, { rangeIndex: i });
    return e.voci.some(v => v.fonte === 'soppressione');
}
ok(sp(0) && sp(1) && sp(2), 'bande 0-8", 8-16", 16-24": il -3 si applica');
ok(!sp(3) && !sp(4) && !sp(5), 'bande oltre le 24": NON si applica');
ok(combi.bands[2].a === 24 && combi.bands[3].da === 24,
   'le 24" sono un confine fra bande: la banda basta a decidere, senza la distanza esatta');
const esplicita = M.modAttacco(alg, sopp, combi, M.AZIONI.BS_ATTACK, { rangeIndex: 0, distanzaPollici: 30 });
ok(!esplicita.voci.some(v => v.fonte === 'soppressione'),
   'una distanza esplicita ha comunque la precedenza sulla banda');
const cieca = M.modAttacco(alg, sopp, ccw, M.AZIONI.CC_ATTACK, {});
ok(cieca.voci.some(v => v.fonte === 'soppressione'),
   'senza banda né distanza (CC) il -3 si applica, in via prudenziale');

console.log('\n=== 2. LE ARTI MARZIALI IN REAZIONE ===');
// Il caso ufficiale della wiki, con i ruoli scambiati: chi reagisce è il
// maestro. I MOD dell'avversario devono applicarsi nel verso giusto.
const maestro = { alias: 'Maestro', cc: 23, bs: 11, ph: 10, skills: 'Martial Arts L3', states: {} };
const allievo = { alias: 'Allievo', cc: 21, bs: 11, ph: 10, skills: 'Martial Arts L1', states: {} };

const attivoMaestro = M.modCC(maestro, allievo, ccw, { inF2F: true });
ok(attivoMaestro.valore === 23, `attivo: 23 +3 (L3) -3 (L1 nemiche) = 23 (ottenuto ${attivoMaestro.valore})`);

const reattivoMaestro = M.modReazione(maestro, { azione: 'CC_ATTACK', arma: ccw },
    { attacco: { azione: M.AZIONI.CC_ATTACK, arma: ccw, attaccante: allievo } });
ok(reattivoMaestro.valore === 23,
   `reattivo: gli stessi 23, i MOD valgono in Attivo E in Reattivo (ottenuto ${reattivoMaestro.valore})`);
ok(reattivoMaestro.voci.some(v => v.fonte === 'martial-arts'), 'il +3 proprio compare');
ok(reattivoMaestro.voci.some(v => v.fonte === 'martial-arts-nemiche'), 'e il -3 nemico anche');

const reattivoAllievo = M.modReazione(allievo, { azione: 'CC_ATTACK', arma: ccw },
    { attacco: { azione: M.AZIONI.CC_ATTACK, arma: ccw, attaccante: maestro } });
ok(reattivoAllievo.valore === 18, `l allievo che reagisce: 21 -3 = 18 (ottenuto ${reattivoAllievo.valore})`);

const nbw = { alias: 'Belva', cc: 21, ph: 10, skills: 'Natural Born Warrior', states: {} };
const reattivoNBW = M.modReazione(nbw, { azione: 'CC_ATTACK', arma: ccw },
    { attacco: { azione: M.AZIONI.CC_ATTACK, arma: ccw, attaccante: maestro } });
ok(reattivoNBW.valore === 21, 'Natural Born Warrior annulla il -3 anche in reazione');

console.log('\n=== 3. Scontro CC completo, ruoli scambiati ===');
const s = M.risolviScontro(
    { attaccante: allievo, azione: M.AZIONI.CC_ATTACK, arma: ccw, bersaglio: maestro, burst: 1, ammo: 'N' },
    { difensore: maestro, azione: 'CC_ATTACK', arma: ccw, bersaglio: allievo });
ok(s.tipo === 'F2F', 'mischia reciproca: Faccia a Faccia');
ok(s.attivo.mod === 18 && s.reattivo.mod === 23,
   `attivo 18, reattivo 23 (ottenuti ${s.attivo.mod} e ${s.reattivo.mod})`);
ok(s.attivo.salvezzaInflitta.offensivo && s.reattivo.salvezzaInflitta.offensivo,
   'entrambi infliggono danno');

console.log('\n=== 4. Le reazioni si passano come argomento ===');
const fus = { alias: 'Fusilier', bs: 12, ph: 10, arm: 1, skills: '', states: {} };
window.gameState = { activeFaction: 'NOMADI', nomads: [alg], panoceania: [fus] };
window.latestAroData = [];   // il globale è VUOTO

const r = window.generaRisoluzioneDaDati({ attacchi: [{
    attaccante: 'Alguacil', azione: M.AZIONI.BS_ATTACK, arma: combi,
    bersagli: [{ name: 'Fusilier', burst: 3, rangeIndex: 1, rangeMod: 3, ammo: 'N', terrain: 'NESSUNO' }]
}] }, [{ nome: 'Fusilier', azione: 'DODGE', hasLoF: true, burst: 1 }]);
ok(r[0].titolo === 'TIRO FACCIA A FACCIA',
   'la reazione passata come argomento viene usata, malgrado il globale vuoto');
ok(r[0].reattivo.mod === 10, 'e produce il tiro di Schivata');

window.latestAroData = [{ nome: 'Fusilier', azione: 'DODGE', hasLoF: true, burst: 1 }];
const r2 = window.generaRisoluzioneDaDati({ attacchi: [{
    attaccante: 'Alguacil', azione: M.AZIONI.BS_ATTACK, arma: combi,
    bersagli: [{ name: 'Fusilier', burst: 3, rangeIndex: 1, rangeMod: 3, ammo: 'N', terrain: 'NESSUNO' }]
}] });
ok(r2[0].titolo === 'TIRO FACCIA A FACCIA',
   'senza argomento si ripiega sul globale: i chiamanti esistenti non si rompono');

console.log('\n=== 5. Firewall: aggiornato a N5.3 + FAQ 0.1 ===');
function fw(skills, states) { return M.valoreFirewall({ alias: 'X', skills: skills, states: states || {} }); }
ok(fw('TinBot: Firewall (-3)') === -3, 'parentesi tonde, come nei profili');
ok(fw('TinBot: Firewall [-3]') === -3, 'parentesi quadre, come nel codice storico');
ok(fw('TinBot: Firewall (-6)') === -6, 'il valore -6 si legge');
ok(fw('Firewall') === -3, 'presente senza valore: -3, il caso più comune');
ok(fw('Hacking Device') === 0, 'senza Firewall: 0');

// FAQ 0.1 (set. 2026): il Dispositivo disabilitato annulla il Firewall.
ok(fw('TinBot: Firewall (-6)', { isolated: true }) === 0,
   'Stato Isolato: il Dispositivo è disabilitato, niente Firewall');
ok(fw('TinBot: Firewall (-6)', { unconscious: true }) === 0, 'Stato Nullo: idem');

const doppio = { alias: 'Y', skills: 'TinBot: Firewall (-3), Hacking Device (Firewall (-6))', states: {} };
const multi = M.firewallMultipli(doppio);
ok(multi.sceltaRichiesta === true && multi.valori.length === 2,
   'due Firewall: se ne applica UNO SOLO, la scelta è del giocatore');

// e l'effetto sul Tiro Salvezza resta +3 fisso, qualunque sia il MOD
const tag = { alias: 'Squalo', arm: 8, bts: 6, ph: 14 };
const carb = M.armaDaProgramma('CARBONITE');
const senza = M.tiroSalvezza(tag, { arma: carb, ammo: carb.ammo });
[-3, -6].forEach(function (v) {
    const con = M.tiroSalvezza(tag, { arma: carb, ammo: carb.ammo, firewall: v });
    ok(con.valoreSuccesso === senza.valoreSuccesso + 3,
       `Firewall ${v}: il bonus alla salvezza è sempre +3, non ${Math.abs(v)}`);
});

console.log('\n=== 6. Dadi speciali, secondo N5.3 ===');
const combiSD = M.profiloArma('Combi Rifle');
const conSD = { skills: 'BS Attack (+1SD)' };
ok(M.burstIniziale(conSD, combiSD, { azione: M.AZIONI.BS_ATTACK }).sd === 1, 'Turno Attivo: 1 dado extra');
ok(M.burstIniziale(conSD, combiSD, { azione: M.AZIONI.BS_ATTACK, inARO: true }).sd === 1,
   'Turno Reattivo: il (+1 SD) vale anche in ARO (prima veniva perso)');
const coord = M.burstIniziale(conSD, combiSD, { azione: M.AZIONI.BS_ATTACK, coordMode: true, indiceCoord: 1 });
ok(coord.sd === 1 && coord.valore === 1,
   'Ordine Coordinato: Burst 1 ma il dado extra resta (FAQ 0.1: gli SD non cambiano il Burst)');
ok(M.burstIniziale(conSD, combiSD, { azione: M.AZIONI.BS_ATTACK }).valore === 3,
   'e il Burst NON aumenta: resta 3');

ok(M.dadiSpeciali(conSD, M.profiloArma('Chain Rifle'), { azione: M.AZIONI.BS_ATTACK }) === 0,
   'Sagoma Diretta: nessun dado extra, perché non si tira');
ok(M.dadiSpeciali(conSD, combiSD, { azione: M.AZIONI.SPECULATIVO }) === 0,
   'Long Skill: il (+1 SD) non si applica');
ok(M.dadiSpeciali(conSD, combiSD, { azione: M.AZIONI.INTUITIVO }) === 0,
   'anche l Intuitivo è una Long Skill');

console.log('\n=== 7. I MOD negativi sono di DUE classi ===');
function cl(et, v) { return M.parseNotazione(v, et); }
ok(cl('Mimetism', '-6').automatica === true && cl('Mimetism', '-6').soloInF2F === false,
   'Mimetism: Skill automatica, si applica SEMPRE');
ok(cl('Surprise Attack', '-3').automatica === true, 'Surprise Attack: idem');
ok(cl('Dodge', '-3').soloInF2F === true, 'Dodge (-3): solo nei Tiri Faccia a Faccia');
ok(cl('CC Attack', '-3').soloInF2F === true, 'CC Attack (-3): idem');
ok(cl('PARA CC Weapon', '-6').soloInF2F === true, 'PARA CCW (-6): idem');
ok(cl('Dodge', '+3').soloInF2F === false, 'i MOD positivi non sono in questa distinzione');

console.log('\n=== 8. Le notazioni sopravvivono alla scelta di modalità ===');
const hrl = M.profiloArma('Heavy Rocket Launcher (PS=5)');
ok(hrl.soloModalita === true, 'è una voce-contenitore');
ok(hrl.notazioni.indexOf('PS=5') >= 0,
   'il PS=5 scritto sul nome base vale per TUTTE le modalità e non si perde');

console.log('\n=== 9. Lettura di un profilo intero ===');
const prof = { skills: 'Mimetism (-3), Dodge (+3), BS Attack (SR-1), Multispectral Visor L2' };
const tutte = M.tutteLeNotazioni(prof);
ok(tutte.length === 3, `tre notazioni lette (ottenute ${tutte.length})`);
ok(tutte.some(n => n.etichetta === 'MIMETISM' && n.automatica), 'il Mimetism è riconosciuto come automatico');
ok(tutte.some(n => n.etichetta === 'BS ATTACK' && n.tipo === 'SALVEZZA'), 'il SR-1 è classificato come Tiro Salvezza');

console.log('\n=== 10. Critici ===');
ok(M.critici(13).valori.join() === '13', 'Critico con un 13 quando il SV è 13');
ok(M.critici(20).valori.join() === '20', 'SV 20: Critico solo col 20');
ok(M.critici(23).valori.join() === '20,1,2,3',
   'SV 23: Critico con 20, 1, 2 e 3 (l esempio del regolamento)');
ok(M.critici(23).riesceSempre === true, 'e sopra il 20 ogni tiro riesce');
ok(M.critici(0).nessunTiro === true && M.critici(-4).nessunTiro === true,
   'SV sotto 1: non si tira affatto');
ok(M.critici(24).valori.join() === '20,1,2,3,4', 'SV 24: cinque risultati critici — 20, 1, 2, 3, 4');

console.log('\n=== 11. L ESEMPIO UFFICIALE del regolamento ===');
// Pagina "Rolls": BS 13, Mimetismo -6, Copertura -3, Gittata -6 = -15,
// limitato a -12, Valore di Successo 13 - 12 = 1.
const attUff = { alias: 'A', bs: 13, skills: '', states: {} };
const difUff = { alias: 'B', arm: 1, skills: 'Mimetism (-6)', states: {} };
const uff = M.modAttacco(attUff, difUff, M.profiloArma('Combi Rifle'),
                         M.AZIONI.BS_ATTACK, { rangeIndex: 5, cover: true });
const grezza = uff.voci.filter(v => v.fonte !== 'limite').reduce((a, v) => a + v.valore, 0);
ok(grezza === -15, `somma grezza dei MOD: -15 (ottenuta ${grezza})`);
ok(uff.mod === -12, 'limitata a -12');
ok(uff.valore === 1, 'Valore di Successo 1, esattamente come nel manuale');
ok(uff.critici.valori.join() === '1', 'e il Critico è con un 1');

// e le bande ufficiali del Combi, dalla stessa tabella del manuale
const cUff = M.profiloArma('Combi Rifle');
ok(cUff.bands.map(b => b.mod).join() === '3,3,-3,-3,-6,-6',
   'le bande del Combi coincidono con la riga del Weapon Chart nel manuale');
ok(cUff.dam === 7 && cUff.burst === 3 && cUff.ammo === 'N' && cUff.salvAttr === 'ARM',
   'e così PS 7, B3, munizione N, salvezza su ARM');

console.log('\n=== 12. IL WEAPON CHART: la domanda aperta è chiusa ===');
// Il chart è sul wiki, con la colonna Tratti. Tutte e sette le Sagome
// Dirette a cui avevo attribuito l Intuitive Attack per deduzione CE L HANNO.
const setteSagome = ['Chain Rifle', 'Chain-colt', 'Light Flamethrower',
                     'Heavy Flamethrower', 'Nanopulser', 'Pulzar', 'E/Marat'];
setteSagome.forEach(function (n) {
    const a = M.profiloArma(n);
    ok(!a.nonTrovata && M.haTratto(a, 'Intuitive Attack'),
       `${n}: Tratto Intuitive Attack confermato dal Weapon Chart`);
});

const intuitive = { alias: 'X', weapon: 'Chain Rifle, Nanopulser, Combi Rifle', equip: '' };
const ei = M.armiIntuitive(intuitive);
ok(ei.avvisi.length === 0,
   'nessun avviso di Tratto dedotto: ora vengono dal database, verificati sul chart');
ok(ei.armi.length === 2 && !ei.armi.some(a => a.nome === 'Combi Rifle'),
   'e il Combi Rifle resta escluso');

console.log('\n=== 13. Il profilo SF Mode è una riga del Weapon Chart ===');
const sfChart = window.CATALOGO_N5.SF_MODE;
ok(String(sfChart.fonte).indexOf('Weapon Chart') >= 0, 'la fonte è dichiarata');
ok(JSON.stringify(sfChart.bande) === '[0,0,-3]',
   'bande 0 | 0 | -3, esattamente la riga "Suppressive Fire Mode"');
ok(sfChart.burst === 3, 'Burst 3');
const sfHmg = M.profiloSF(M.profiloArma('Heavy Machine Gun'));
ok(!sfHmg.avvisi.some(a => a.codice === 'A97'), 'e nessun avviso di ripiego');

console.log('\n=== 14. Il database concorda col chart ===');
[['Combi Rifle', 'N', 'ARM', 1], ['Breaker Combi Rifle', 'AP', 'BTS/2', 1],
 ['K1 Combi Rifle', 'N', 'ARM=0', 1], ['Nanopulser', 'N', 'BTS', 1],
 ['E/Marat', 'E/M', 'BTS/2', 2], ['PARA CC Weapon', 'PARA', 'PH-6', 1]
].forEach(function (r) {
    const a = M.profiloArma(r[0]);
    ok(a.ammo === r[1] && a.salvAttr === r[2] && String(a.salvTiri) === String(r[3]),
       `${r[0]}: ${r[1]} / ${r[2]} / ${r[3]} salvezze — come sul chart`,
       `ottenuto ${a.ammo} / ${a.salvAttr} / ${a.salvTiri}`);
});

console.log('\n=== 15. Gli avvisi devono essere pochi e veri ===');
// Un avviso che scatta su dati corretti addestra a ignorare gli avvisi,
// e vanifica tutto il progetto "niente default silenziosi".
const conta = {};
Object.keys(window.RULES_WEAPONS).forEach(function (n) {
    (M.profiloArma(n).avvisi || []).forEach(function (a) { conta[a.codice] = (conta[a.codice] || 0) + 1; });
});
ok((conta.A53 || 0) <= 5,
   `A53 "assunto ARM": ${conta.A53 || 0} volte, non 45 — il salvAttr del chart risponde già`);
ok(!M.parametriSalvezza(M.profiloArma('Breaker Combi Rifle')).avvisi.some(a => a.codice === 'A53'),
   'la Breaker non avvisa: il suo attributo è dichiarato');

console.log('\n=== 16. L Intuitivo richiede il TRATTO, non la Sagoma ===');
const conMissile = M.armiIntuitive({ weapon: 'Chain Rifle, Missile Launcher, Grenades, Combi Rifle' });
ok(conMissile.armi.length === 1 && conMissile.armi[0].nome === 'Chain Rifle',
   'solo il Chain Rifle: le Sagome a IMPATTO non fanno Attacchi Intuitivi');
ok(conMissile.armi.every(a => !/Missile|Grenades/.test(a.nome)),
   'missili e granate esclusi (venivano offerti tutti)');
ok(conMissile.avvisi.length === 0,
   'e nessun avviso: i Tratti vengono dal database, non sono dedotti');

console.log('\n=== 17. PARA: il MOD va sul TIRO SALVEZZA, non sul F2F ===');
// Il regolamento (Melee Weapon Profile): "la colonna Attributo del Tiro
// Salvezza puo` mostrare l'attributo con dei MOD, di solito negativi".
// Il motore lo applicava anche come MOD al Faccia a Faccia: doppio conteggio.
const ber = { alias: 'B', arm: 2, bts: 1, ph: 12, skills: '', states: {} };
ok(M.tiroSalvezza(ber, { arma: M.profiloArma('PARA CC Weapon') }).valoreSuccesso === 6,
   'PARA CC Weapon: salvezza su PH-6, cioè 6 con PH 12');
// 🔴 Il (-3) del profilo NON sovrascrive la salvezza. Il testo dice
// "Saving Roll (PH-6)" senza eccezioni (REGOLE_N5_v5_1_1.txt righe
// 5715-5718): la salvezza PARA è SEMPRE PH-6. Il (-3) è un MOD al tiro
// dell AVVERSARIO nel Faccia a Faccia. Questo test asseriva il contrario —
// l interpretazione sbagliata — e l ha corretta la chat DATABASE
// (database_comune.js 2026-09-20.3, campo modProfiloSu).
const p3 = M.profiloArma('PARA CC Weapon(-3)');
ok(M.tiroSalvezza({ alias: 'X', ph: 12 }, { arma: p3 }).valoreSuccesso === 6,
   'PARA CC Weapon (-3): la salvezza resta PH-6, cioè 6 con PH 12');
const sc3 = M.risolviScontro(
    { attaccante: { alias: 'A', cc: 15, skills: '', states: {} }, azione: M.AZIONI.CC_ATTACK, arma: p3,
      bersaglio: { alias: 'D', cc: 15, ph: 12, skills: '', states: {} }, burst: 1 },
    { difensore: { alias: 'D', cc: 15, ph: 12, skills: '', states: {} }, azione: 'CC_ATTACK',
      arma: M.profiloArma('CC Weapon'), bersaglio: 'A', burst: 1 }, {});
ok(sc3.reattivo.mod === 12, `e il (-3) colpisce il F2F dell avversario: CC 15 -> 12 (ottenuto ${sc3.reattivo.mod})`);

const attCC = { alias: 'A', cc: 20, skills: '', states: {} };
const difPara = { alias: 'D', cc: 18, skills: 'PARA CC Weapon (-6)', states: {} };
const eCC = M.modCC(attCC, difPara, M.profiloArma('CC Weapon'), { inF2F: true });
ok(eCC.valore === 20,
   'e il -6 NON tocca il Faccia a Faccia: CC 20 resta 20, non 14');
ok(!eCC.voci.some(v => /PARA/.test(v.motivo || '')),
   'nessuna voce PARA fra i MOD del tiro');

// il CC Attack (-N) invece SI` va sul F2F: la distinzione regge
const difCC = { alias: 'D', cc: 18, skills: 'CC Attack (-3)', states: {} };
ok(M.modCC(attCC, difCC, M.profiloArma('CC Weapon'), { inF2F: true }).valore === 17,
   'ma "CC Attack (-3)" resta un MOD al F2F: 20 - 3 = 17');

console.log('\n=== 18. ALBEDO: era a catalogo ma non nel motore ===');
const combiA = M.profiloArma('Combi Rifle');
const nudoA   = { alias: 'Fante',     bs: 12, skills: '', states: {} };
const visoreA = { alias: 'Occhio',    bs: 12, skills: 'Multispectral Visor L2', states: {} };
const tiratA  = { alias: 'Tiratore',  bs: 12, skills: 'Marksmanship', states: {} };
const alb6    = { alias: 'Albedo6',   arm: 1, skills: 'Albedo (-6)', states: {} };
const alb3    = { alias: 'Albedo3',   arm: 1, skills: 'Albedo (-3)', states: {} };
function bs(att, dif) { return M.modAttacco(att, dif, combiA, M.AZIONI.BS_ATTACK, { rangeIndex: 1 }).valore; }

ok(bs(nudoA, alb6) === 15, 'senza visore né Marksmanship: l Albedo non si applica');
ok(bs(visoreA, alb6) === 9, 'con Multispectral Visor: -6');
ok(bs(tiratA, alb6) === 9, 'con Marksmanship: -6');
ok(bs(visoreA, alb3) === 12, 'il valore viene dal profilo: Albedo (-3) dà -3, non -6');
ok(M.modAttacco(nudoA, alb6, combiA, M.AZIONI.BS_ATTACK, { rangeIndex: 1 })
    .note.some(n => /Albedo/.test(n)),
   'e quando non si applica il motore spiega perché');

console.log('\n=== 19. Livelli fuori intervallo ===');
ok(M.livelloDaTabella('MARTIAL_ARTS', 3).voce !== null, 'MA L3 esiste');
const fuori = M.livelloDaTabella('MARTIAL_ARTS', 7);
ok(fuori.voce === null && fuori.avviso, 'MA L7 non esiste: avviso, non silenzio');
ok(M.livelloDaTabella('MARTIAL_ARTS', 0).avviso === null,
   'nessun livello (0) è normale: nessun avviso');

console.log('\n=== 18. Tabelle a livelli: un accessore solo ===');
ok(M.livelloDaTabella('MARTIAL_ARTS', 3).voce.attaccoMod === 3, 'Martial Arts L3');
ok(M.livelloDaTabella('Strategos', 2).voce.spostaTruppaSenzaToken === true,
   'Strategos L2: sposta senza Command Token (sta dentro SKILL, non è una sezione)');
ok(M.livelloDaTabella('Strategos', 1).voce.spostaTruppaSenzaToken === false,
   'Strategos L1: no — la differenza L1/L2 resta');
ok(M.livelloDaTabella('Strategos', 1).voce.includePeripheral === true,
   'e i Peripheral valgono su entrambi i livelli (novità N5.3)');

// fuori intervallo NON è come "non ce l'ha": il primo va segnalato
const livFuoriRange = M.livelloDaTabella('MARTIAL_ARTS', 7);
ok(livFuoriRange.voce === null && livFuoriRange.avviso, 'L7 fuori intervallo: null CON avviso');
const assente = M.livelloDaTabella('MARTIAL_ARTS', 0);
ok(assente.voce === null && !assente.avviso, 'livello 0: null SENZA avviso, semplicemente non ce l ha');
const stFuori = M.livelloDaTabella('Strategos', 3);
ok(stFuori.voce === null && stFuori.avviso, 'Strategos L3 non esiste: segnalato');

console.log('\n=== 19. Nessuna tabella duplicata resta nel catalogo ===');
ok(window.CATALOGO_N5.SKILL['Strategos'].tabella === undefined,
   'Strategos: la doppia struttura è stata tolta');
ok(window.CATALOGO_N5.SKILL['Strategos'].livelli !== undefined, 'resta livelli');

console.log('\n=== 20. Le due metà del catalogo devono CONCORDARE e non TACERE ===');
// Il controllo di prima verificava solo la letalità, e solo su due coppie.
// Ma una metà che tace è più insidiosa di una che mente: chi legge un campo
// assente ricava il valore per analogia dalle voci vicine, e sul MediKit
// l'analogia porta a WIP invece che a PH.
const COPPIE = [
    { skill: 'Doctor',    sez: 'DOTTORE',   in: 'SKILL' },
    { skill: 'Engineer',  sez: 'INGEGNERE', in: 'SKILL' },
    { skill: 'MediKit',   sez: 'MEDIKIT',   in: 'EQUIP' },
    { skill: 'GizmoKit',  sez: 'GIZMOKIT',  in: 'EQUIP' }
];
COPPIE.forEach(function (c) {
    const meta = window.CATALOGO_N5[c.in][c.skill];
    const sez  = window.CATALOGO_N5.SUPPORTO[c.sez];
    const e = (meta && meta.effetto) || {};

    // 1. nessuna delle due metà tace
    ok(e.chiTira !== undefined, `${c.skill}: la metà ${c.in} dichiara CHI tira`);
    ok(e.tiro !== undefined, `${c.skill}: e su quale attributo`);

    // 2. le due metà concordano
    ok(e.chiTira === sez.chiTira,
       `${c.skill}: ${c.in} e SUPPORTO concordano su chi tira (${sez.chiTira})`);
    ok(e.tiro === sez.attributo,
       `${c.skill}: e sull attributo (${sez.attributo})`,
       `${c.in} dice ${e.tiro}, SUPPORTO dice ${sez.attributo}`);

    // 3. e sulla letalità del fallimento
    const letaleSkill = (e.fallimento === 'MORTO');
    ok(letaleSkill === !!sez.fallimentoLetale,
       `${c.skill}: e sulla letalità del fallimento`);
});

// L'errore concreto che questo controllo impedisce
ok(window.CATALOGO_N5.EQUIP['MediKit'].effetto.tiro === 'PH',
   'MediKit: si lancia su PH, non su WIP — sono tre punti a ogni cura');

console.log('\n=== 20b. Dottore e Ingegnere: il fallimento non è uguale ===');
const C = window.CATALOGO_N5;
ok(C.SKILL['Doctor'].effetto.fallimento === 'MORTO',
   'Doctor: fallire UCCIDE il bersaglio (era 1_FERITA, copiato dall Engineer)');
ok(C.SKILL['Engineer'].effetto.fallimento === '1_FERITA_se_ripara',
   'Engineer: fallire infligge 1 Ferita — e resta così');

// le due metà del catalogo devono concordare: è la contraddizione che sfuggiva
ok(C.SUPPORTO.DOTTORE.fallimentoLetale === true &&
   C.SKILL['Doctor'].effetto.fallimento === 'MORTO',
   'SKILL e SUPPORTO ora dicono la stessa cosa sul Dottore');
ok(C.SUPPORTO.INGEGNERE.fallimentoLetale === false &&
   C.SKILL['Engineer'].effetto.fallimento !== 'MORTO',
   'e la stessa cosa sull Ingegnere');

// e il motore, che legge SUPPORTO
const dott = { alias: 'D', wip: 14, skills: 'Doctor', states: {} };
const ing  = { alias: 'I', wip: 13, skills: 'Engineer', states: {} };
const koVita = { alias: 'F', w: 1, ph: 10, skills: '', states: { unconscious: true } };
const koStr  = { alias: 'R', s: 1, ph: 8,  skills: '', states: { unconscious: true } };
ok(M.regoleSupporto(dott, koVita, 'DOTTORE', {}).fallimentoLetale === true,
   'il motore: col Dottore fallire è letale');
ok(M.regoleSupporto(ing, koStr, 'INGEGNERE', {}).fallimentoLetale === false,
   'con l Ingegnere no');

console.log('\n=== 21. Regeneration (PH=N) non si perde più ===');
ok(C.SKILL['Regeneration'].haValore === true, 'haValore attivo');
const rig = M.attributoEffettivo({ ph: 9, skills: 'Regeneration (PH=13)' }, 'PH', 'Regeneration');
ok(rig.sostituito && rig.valore === 13,
   'Regeneration (PH=13) su PH 9: si tira su 13, non su 9');
ok(/1 Ferita IN PIU/i.test(C.SKILL['Regeneration'].note),
   'e la nota ricorda che fallendo si prende 1 Ferita in più');

console.log('\n=== 22. Nessuna tabella duplicata nel catalogo ===');
ok(C.SKILL['Martial Arts'].tabella === undefined, 'Martial Arts: la seconda tabella è sparita');
ok(C.SKILL['Martial Arts'].tabellaIn === 'MARTIAL_ARTS.livelli', 'e rinvia alla fonte unica');
ok(M.livelloDaTabella('MARTIAL_ARTS', 5).voce.sd === 1, 'i valori si leggono sempre da lì');

['Hacking Device', 'Hacking Device Plus', 'Killer Hacking Device', 'EVO Hacking Device']
    .forEach(function (d) {
        ok(C.EQUIP[d].programmi === undefined, `${d}: programmi duplicati rimossi`);
        ok(C.DISPOSITIVI_HACKING[d].programmi.length > 0, `${d}: la fonte unica c è`);
    });
ok(M.programmiAttacco({ alias: 'I', skills: 'Hacker, Killer Hacking Device' })
    .programmi.map(p => p.nome).join() === 'TRINITY',
   'e il motore continua a trovarli: Killer -> solo Trinity');

console.log('\n=== 23. Gravità degli avvisi ===');
ok(M.gravitaAvviso('A43') === 'azione', 'arma ambigua: il giocatore può ancora scegliere');
ok(M.gravitaAvviso('A51b') === 'azione', 'modalità da scegliere: idem');
ok(M.gravitaAvviso('A13') === 'nota', 'gittata riallineata: non c è niente da fare');
ok(M.gravitaAvviso('A97') === 'nota', 'dato non verificato: idem');
// un codice che non esiste ancora cade dalla parte prudente
ok(M.gravitaAvviso('A999') === 'azione',
   'un codice NUOVO vale azione: meglio disturbare che nascondere una scelta');

const conAvviso = M.profiloArma('MULTI Sniper Rifle');
ok(conAvviso.avvisi.every(a => a.gravita === 'azione' || a.gravita === 'nota'),
   'ogni avviso porta il campo gravita');
ok(conAvviso.avvisi.some(a => a.gravita === 'azione'),
   'e il contenitore di modalità è azione: serve una scelta prima di spedire');

console.log('\n=== 24. statiAttivi: la lista, non la mappa ===');
const unitaMista = { id: 'x', alias: 'X', state: 'UNCONSCIOUS', deployState: 'CAMO_1', tipo: 'LI', w: 2,
    skills: 'Martial Arts L3', states: { targeted: true, prone: true, suppressive: true, immobilizedB: true } };
const attivi = M.statiAttivi(unitaMista);
ok(Array.isArray(attivi), 'restituisce una lista');
// Cinque, non sei: il Prono e` uscito dalla gestione stati il 23 settembre
// (decisione di Paolo: non da` MOD e non e` nel catalogo). L'unita` di prova
// lo dichiara ancora, ed e` voluto — un salvataggio vecchio con prone: true
// non deve diventare un allarme "stato sconosciuto".
ok(attivi.length === 5, 'cinque stati attivi, il Prono non è più fra questi (ottenuti ' + attivi.length + ')');
ok(!attivi.some(x => x.id === 'prone'), 'e infatti il Prono non compare');
ok(attivi.every(x => x.id && x.nome && x.categoria), 'ognuno con id, nome leggibile e categoria');
ok(attivi[0].categoria === 'NULLO', 'ordinati: prima ciò che toglie la truppa dal gioco');
ok(attivi[attivi.length - 1].categoria === 'MARKER', 'e per ultimi i Marker');
ok(M.statiAttivi({ alias: 'sano', states: {} }).length === 0, 'unità sana: lista vuota');

// i tre depositi vengono unificati: è il guasto che l interfaccia aveva
ok(M.statiAttivi({ state: 'UNCONSCIOUS', states: {} }).some(x => x.id === 'incosciente'),
   'legge unit.state (singolare)');
ok(M.statiAttivi({ states: { targeted: true } }).some(x => x.id === 'targeted'),
   'legge unit.states.* (plurale)');
ok(M.statiAttivi({ deployState: 'CAMO_1', states: {} }).some(x => x.id === 'camo'),
   'legge unit.deployState');

// gli stati che mancavano al motore
[['stordito', { stunned: true }], ['retreat', { retreat: true }], ['immA', { immobilizedA: true }]
].forEach(function (c) {
    ok(M.statiAttivi({ states: c[1] }).some(x => x.id === c[0]),
       `${c[0]}: riconosciuto (prima il motore non lo vedeva)`);
});
// Il Prono non e` piu` uno stato: dichiararlo non produce niente, e non
// produce nemmeno un allarme. E` la differenza fra "tolto" e "sconosciuto".
ok(M.statiAttivi({ states: { prone: true } }).length === 0,
   'prone: non e` piu` uno stato, e non lascia residui'.replace('e` piu`', 'è più'));

console.log('\n=== 25. Le quantità sono separate dagli stati ===');
const q = M.quantitaUnita(unitaMista);
ok(q.vitaTotale === 2 && q.attributo === 'VITA', 'VITA e valore');
ok(q.martialArts === 3, 'livello di Arti Marziali');
ok(attivi.every(x => x.valore === undefined),
   'e la lista degli stati NON porta quantità: sono due domande diverse');

console.log('\n=== 26. L id dell attaccante nel payload ===');
M._fazione = 'NOMADI';
const alg1 = { id: 'n1', alias: 'Alguacil', bs: 11, skills: '', states: {} };
const alg2 = { id: 'n2', alias: 'Alguacil', bs: 11, skills: '', states: {} };
M._rosterProprio = [alg1, alg2];
M._rosterNemico = [{ id: 'p1', alias: 'Fusilier', arm: 1, skills: '', states: {} }];
const pl = M.creaPayload([{
    attaccante: alg2, azione: M.AZIONI.BS_ATTACK, arma: M.profiloArma('Combi Rifle'),
    bersagli: [{ id: 'p1', name: 'Fusilier', burst: 3, rangeIndex: 1, rangeMod: 3, ammo: 'N', terrain: 'NESSUNO' }]
}]);
ok(pl.payload.attacchi[0].attaccanteId === 'n2',
   'con due Alguacil identici l id dice QUALE ha sparato (prima c era solo il nome)');
ok(pl.payload.attacchi[0].attaccante === 'Alguacil', 'e il nome resta, per chi lo usa già');

console.log('\n=== 23. nonNormalizzati elenca STATI, non VALORI ===');
// Segnalato dalla chat INTERFACCIA: `wounds` finiva fra gli stati non
// normalizzati mentre è una quantità, e andava filtrato a valle.
// Il criterio per nome sarebbe rimasto indietro comunque: fuori lista
// c'era anche `suppressiveWeapon`.
const conValori = M.statoBersaglio({
    alias: 'A', tipo: 'LI', w: 3, skills: '',
    states: { prone: true, suppressive: true, wounds: 2,
              suppressiveWeapon: 'Combi Rifle (SF Mode)', statoIgnoto: true, spento: false }
});
ok(conValori.nonNormalizzati.indexOf('wounds') < 0, 'wounds NON è uno stato non normalizzato');
ok(conValori.nonNormalizzati.indexOf('suppressiveWeapon') < 0, 'e nemmeno suppressiveWeapon');
ok(conValori.nonNormalizzati.join() === 'statoIgnoto',
   'resta solo lo stato davvero sconosciuto');
ok(conValori.attivi.indexOf('wounds') < 0, 'e non compare fra gli attivi');

// un valore non-booleano futuro non finisce fra gli stati, qualunque sia
const futuro = M.statoBersaglio({ alias: 'B', skills: '', states: { campoNuovo: 7, testo: 'x' } });
ok(futuro.nonNormalizzati.length === 0,
   'un campo numerico o testuale aggiunto domani non diventa uno stato');
ok(futuro.dettagli.campoNuovo === 7 && futuro.dettagli.testo === 'x',
   'ma resta leggibile in `dettagli`');
ok(M.statoBersaglio({ alias: 'C', skills: '', states: { spento: false } }).attivi.length === 0,
   'e un booleano falso non accende niente');

console.log('\n=== 24. Ferite subite e ferite totali sono due numeri ===');
ok(conValori.quantita.feriteSubite === 2, 'feriteSubite: 2, da states.wounds (scritto a runtime)');
ok(conValori.quantita.ferite === 3, 'ferite: 3, il totale del profilo');
ok(conValori.quantita.armaSoppressione === 'Combi Rifle (SF Mode)',
   'e l arma in SF Mode è una quantità, non uno stato');
const sano = M.statoBersaglio({ alias: 'D', w: 1, skills: '', states: {} });
ok(sano.quantita.feriteSubite === 0, 'senza ferite subite: 0, non null');

console.log('\n=== 23. Leggere un esito senza doverlo indovinare ===');
// Il motore usa tre nomi per il campo booleano: ok, puo, ammesso.
// Chi legge quello sbagliato ottiene undefined, che è falso — e il
// risultato è "nessuno può fare niente", plausibile e silenzioso.
M._fazione = 'NOMADI';
M._rosterNemico = [{ id: 'p1', alias: 'B', arm: 1, skills: '', states: {} }];

ok(M.esito(M.puoRicevereOrdine({ alias: 'X', states: {} })) === true, 'legge "puo"');
ok(M.esito(M.validaCoordinato([], null)) === false, 'legge "ok"');
ok(M.esito(M.bersagliValidi(M.AZIONI.BS_ATTACK, M._rosterNemico, {})[0]) === true, 'legge "ammesso"');
ok(M.esito(M.regoleSupporto({ alias: 'D', wip: 14, skills: 'Doctor' },
    { alias: 'F', w: 1, states: { unconscious: true } }, 'DOTTORE', {})) === true, 'legge "valido"');

// il punto vero: un campo assente NON deve passare per "falso"
let sollevato = false;
try { M.esito({ qualcosa: 1 }); } catch (e) { sollevato = true; }
ok(sollevato, 'un oggetto senza campo di giudizio SOLLEVA invece di rispondere falso');
let sollevato2 = false;
try { M.esito(undefined); } catch (e) { sollevato2 = true; }
ok(sollevato2, 'e anche undefined');

// il motivo, con lo stesso criterio
ok(/Nessuna unità/.test(M.motivoEsito(M.validaCoordinato([], null))), 'motivoEsito legge da "errori"');
ok(M.motivoEsito(M.puoRicevereOrdine({ alias: 'X', states: { dead: true } })) !== null,
   'e da "blocchi"');

console.log('\n=== 24. Un nome solo per ogni dato ===');
// Un ripiego a un nome che nessuno definisce non protegge: lo tiene in vita
// e lo fa sembrare una variante legittima. È successo con DB_PANO, che
// roster_manager.js cercava e nessun file definiva.
const src = require('fs').readFileSync('./motore_regole_n5.js', 'utf8');
const codice = src.split('\n').filter(r => !/^\s*\/\//.test(r)).join('\n');
ok(!/DB_PANO\b/.test(codice), 'il motore non cerca DB_PANO da nessuna parte');
ok(!/DB_ARMI\b/.test(codice), 'né DB_ARMI, che nessun file definisce');
ok(/DB_PANOCEANIA/.test(src) && /DB_NOMADI/.test(src), 'usa i nomi canonici');

ok(M.NOMI_DATI.rosterPano.nome === 'DB_PANOCEANIA', 'DB_PANOCEANIA è il nome canonico del roster PanO');
ok(M.NOMI_DATI.rosterNomadi.nome === 'DB_NOMADI', 'DB_NOMADI quello dei Nomadi');
ok(M.NOMI_DATI.armi.nome === 'RULES_WEAPONS', 'RULES_WEAPONS quello delle armi');

// L'elenco deve essere COMPLETO: un elenco parziale fa sembrare esaustivo
// un controllo che copre una parte. Prima erano 6 nomi su 12.
// 🔴 Asserire la COMPLETEZZA, non una costante. Il numero fisso 12 è
// diventato falso appena DATABASE ha tolto RULES_AMMO — un dato che
// nessuno leggeva — e il test sarebbe andato rosso per una pulizia
// corretta. Quello che conta è che ogni nome in elenco ESISTA davvero.
const tuttiINomi = Object.keys(M.NOMI_DATI).concat(Object.keys(M.FUNZIONI_DATI));
ok(tuttiINomi.length >= 10, `elenco non vuoto: ${tuttiINomi.length} nomi canonici, dati e funzioni`);
ok(Object.keys(M.NOMI_DATI).every(k => M.NOMI_DATI[k].nome !== 'RULES_AMMO'),
   'RULES_AMMO non è più fra i nomi canonici: è stata rimossa dal database');
['RULES_WEAPONS_ALIAS', 'DB_STRUTTURE', 'DB_TERRENI', 'TRATTI_TERRENO'].forEach(function (n) {
    ok(Object.keys(M.NOMI_DATI).some(k => M.NOMI_DATI[k].nome === n), n + ' è in elenco');
});
['generaOpzioniTerreni', 'applicaModTerreno'].forEach(function (n) {
    ok(Object.keys(M.FUNZIONI_DATI).some(k => M.FUNZIONI_DATI[k].nome === n),
       n + ' è in elenco come FUNZIONE');
});
// una funzione si verifica con typeof, non con la sola presenza
const salvata = window.applicaModTerreno;
window.applicaModTerreno = 'non sono una funzione';
ok(M.datiMancanti().some(f => f.nome === 'applicaModTerreno' && /non e` una funzione/.test(f.dettaglio)),
   'una variabile omonima non passa per funzione');
window.applicaModTerreno = salvata;
ok(M.verificaFirme().length === 0, 'e la firma di applicaModTerreno accetta i 5 argomenti attesi');

// Questo file non carica i database di fazione: datiMancanti deve dirlo,
// ed è proprio il suo scopo — nominare col nome CANONICO ciò che manca.
const mancanti = M.datiMancanti();
ok(mancanti.length === 2, `mancano i due roster di fazione (trovati ${mancanti.length})`);
ok(mancanti.map(x => x.nome).sort().join() === 'DB_NOMADI,DB_PANOCEANIA',
   'e li nomina col nome canonico, non con un sinonimo');
require('./database_panoceania.js'); require('./database_nomad.js');
ok(M.datiMancanti().length === 0, 'caricandoli, non manca più niente');

console.log('\n=== salvAttrDaProfilo è RITIRATO, e la trappola è chiusa ===');
// Il ramo che lo leggeva faceva salvare il PARA su PH-3. Era inerte —
// nessuna voce portava più il campo — ma chi lo avesse rimesso credendo
// che servisse avrebbe riattivato in silenzio la salvezza sbagliata.
// Si prova ROMPENDO: si rimette il campo e si verifica che non cambi niente.
const Wf = window.RULES_WEAPONS;
Wf['PARA CC Weapon'].salvAttrDaProfilo = 'PH';
const trappola = M.tiroSalvezza({ alias: 'X', ph: 12 }, { arma: M.profiloArma('PARA CC Weapon(-3)') });
ok(trappola.valoreSuccesso === 6, 'rimettendo il campo, la salvezza resta PH-6: 6');
ok((trappola.avvisi || []).some(a => a.codice === 'A79'),
   'e il motore avvisa che il campo è ritirato, invece di ignorarlo in silenzio');
delete Wf['PARA CC Weapon'].salvAttrDaProfilo;
const srcRimando = require('fs').readFileSync('./motore_regole_n5.js', 'utf8');
ok(/NON REINTRODURRE `salvAttrDaProfilo`/.test(srcRimando), 'e nel sorgente c è il rimando che lo spiega');

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
