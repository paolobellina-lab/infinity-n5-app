// @versione 2026-10-06.2 | test_hacking_firewall.js | proprieta`: chat MOTORE
// ============================================================================
//  HACKER, FIREWALL, ECM E REPEATER NEMICO — DAL LATO MOTORE.
//
//  Punti 10-13 e 15 dell'elenco di MOTORE del 6 ottobre. Il punto 14 (il
//  pulsante del Repeater) sta in test_modulo_hacking.js, dove c'e` gia`
//  l'intelaiatura del modulo; la parte di schermata la copre
//  test_aro_filtro_repeater.js di INTERFACCIA.
//
//  DUE SCOPERTE DEL 6 OTTOBRE, scritte qui perche` e` qui che si leggono.
//
//  1. IL FIREWALL DEL BERSAGLIO, chiuso nella 2026-10-06.12.
//     Fino alla .11 M.modHacking faceva `parseInt(ctx.firewallNemico,10) || 0`:
//     chi chiamava senza quel campo otteneva 0 — "il bersaglio non ha
//     Firewall" — mentre il Firewall c'era, e M.firewallApplicato sullo
//     stesso bersaglio rispondeva altro. Due funzioni, una domanda, due
//     risposte a seconda che il chiamante si ricordasse di un campo.
//     Segnalato il 6 ottobre e corretto da MOTORE. Contratto di oggi:
//     ctx.firewallNemico ASSENTE o null -> il motore legge dal bersaglio;
//     PRESENTE -> vale quello, anche 0. Le sezioni 4 e 5 fissano le due
//     meta`: che le due strade concordino, e che "assente" e "zero" restino
//     due risposte DIVERSE. Serve la coppia: con una sola, un ritorno al
//     `|| 0` o un campo ignorato passerebbero.
//
//  2. Il bersaglio del punto 13 e` il Fusilier HACKER, non il Fusilier.
//     "Intruder KHD contro un Fusilier" con TRINITY: TRINITY colpisce solo
//     un Hacker NEMICO (bersaglio 'soloHackerNemico'), e Fusilier (Combi
//     Rifle) non lo e` — il motore risponde requisitoFallito e nessuna
//     salvezza. Col profilo Fusilier (Hacker, Hacking Device), PanOceania,
//     BTS 0, i numeri dichiarati tornano alla cifra: 17 e salvezza 6 senza
//     Repeater, 14 e salvezza 9 con. La salvezza e` BTS del bersaglio + PS 6,
//     piu` 3 col Firewall. Stessa forma di BS-06: i numeri erano giusti, era
//     il profilo a non essere nominato per intero.
//
//  USO:  node test_hacking_firewall.js  |  CARTELLA=/percorso/ node ...
// ============================================================================
const DIR = (process.env.CARTELLA || (__dirname + '/')).replace(/\/?$/, '/');
global.window = global;

let passati = 0, falliti = 0;
const J = JSON.stringify;
function ok(c, d, visto) {
    if (c) { passati++; console.log('  ✓ ' + d); }
    else { falliti++; console.log('  ✗ ' + d + (visto !== undefined ? '  [visto: ' + J(visto) + ']' : '')); }
}

require(DIR + 'catalogo_n5.js'); require(DIR + 'database_comune.js');
require(DIR + 'database_nomad.js'); require(DIR + 'database_panoceania.js');
const M = require(DIR + 'motore_regole_n5.js');

const NOM = window.DB_NOMADI || [], PAN = window.DB_PANOCEANIA || [];
const TUTTI = [].concat(NOM, PAN);
const trova = (lista, rx) => lista.find(u => rx.test(u.nome));

const intruderKHD = trova(TUTTI, /^Intruder \(Hacker, Killer Hacking Device\)/);
const fusHacker   = trova(PAN,   /^Fusilier \(Hacker, Hacking Device\)/);
const fusCombi    = trova(PAN,   /^Fusilier \(Combi Rifle\)/);
const brigada     = trova(NOM,   /^Mobile Brigada \(Hacker\)/);
const meteor      = trova(TUTTI, /^Meteor Zond$/) || trova(TUTTI, /^Meteor Zond/);
const bambadroid  = trova(TUTTI, /^Bambadroid/);

const programmaDi = (u, nome) => {
    const p = M.programmiDisponibili(u);
    const l = Array.isArray(p) ? p : ((p && p.programmi) || []);
    return l.find(x => new RegExp('^' + nome + '$', 'i').test(String(x.nome || x)));
};
const TRINITY = programmaDi(intruderKHD, 'TRINITY');

console.log('\n=== 0. I profili di prova ===');
ok(!!intruderKHD && !!fusHacker && !!fusCombi && !!brigada && !!meteor && !!bambadroid,
   'Intruder KHD, Fusilier Hacker, Fusilier Combi, Mobile Brigada, Meteor Zond, Bambadroid');
ok(!!TRINITY && TRINITY.ps === 6 && TRINITY.modAttacco === 3,
   `TRINITY: PS 6 e +3 WIP (${TRINITY && TRINITY.ps}, ${TRINITY && TRINITY.modAttacco})`);

console.log('\n=== 1. Punto 10: M.eHacker guarda la VOCE, non il testo ===');
ok(TUTTI.length === 765, `profili nei due database: 765 (${TUTTI.length})`);
const quantiHacker = TUTTI.filter(u => M.eHacker(u)).length;
ok(quantiHacker === 86, `M.eHacker vero su 86 profili (${quantiHacker})`);
// CONTROPROVA, ed e` il cuore del punto: "ECM (Hacker -3)" CONTIENE la
// parola Hacker. Se eHacker cercasse la sottostringa, Meteor Zond e
// Bambadroid sarebbero Hacker. Non lo sono: la voce e` esatta.
// L'ECM del Meteor Zond sta in `equip`, non in `skills` (verificato il 6
// ottobre: skills non contiene affatto "Hack"). M.eHacker legge SOLO il
// campo skills, ed e` giusto cosi` — ma la prova deve guardare dove la cosa
// sta davvero, altrimenti misura un campo vuoto e si convince di aver
// provato qualcosa.
const testoEcm = String(meteor.skills) + ' | ' + String(meteor.equip);
ok(/ECM\s*\(\s*Hack/i.test(testoEcm),
   `il Meteor Zond porta "ECM (Hacking -3)", nel campo equip (${String(testoEcm).match(/ECM[^,]*/i)})`);
ok(!/HACK/i.test(String(meteor.skills)),
   'e nel campo skills, che e quello che eHacker legge, non c e nulla di Hacking');
ok(M.eHacker(meteor) === false, `percio M.eHacker e falso (${M.eHacker(meteor)})`);
// La forma piu` dura della controprova, con un'unita` FINTA che porta la
// grafia VECCHIA "ECM (Hacker -3)" — quella che il motore legge ancora. Qui
// la parola "Hacker" c'e` per intero, dentro le parentesi di un'altra voce:
// chi cercasse la sottostringa direbbe Hacker. La voce esatta dice no.
const FINTA_ecmVecchiaGrafia = { id: 'finta3', nome: 'FINTA: ECM con la grafia vecchia',
    alias: 'Finta3', wip: 13, bts: 3, skills: 'ECM (Hacker -3), Remote Presence', states: {} };
ok(/HACKER/i.test(String(FINTA_ecmVecchiaGrafia.skills)),
   'l unita finta scrive "ECM (Hacker -3)": la parola Hacker c e per intero');
ok(M.eHacker(FINTA_ecmVecchiaGrafia) === false,
   `e M.eHacker dice NO comunque: guarda la voce, non la sottostringa (${M.eHacker(FINTA_ecmVecchiaGrafia)})`);
ok(M.valoreEcmHacking(FINTA_ecmVecchiaGrafia) === -3,
   `mentre l ECM lo legge: -3 (${M.valoreEcmHacking(FINTA_ecmVecchiaGrafia)})`);
ok(M.eHacker(bambadroid) === false, `e falso anche per il Bambadroid (${M.eHacker(bambadroid)})`);
ok(M.eHacker(intruderKHD) === true && M.eHacker(fusHacker) === true,
   'mentre e vero per i due profili che la voce ce l hanno davvero');
ok(M.valoreEcmHacking(meteor) === -3,
   `e il Meteor Zond ha comunque il suo ECM -3 (${M.valoreEcmHacking(meteor)})`);

console.log('\n=== 2. Punto 11: il Repeater nemico porta un Firewall -3 ===');
// Si chiama come lo chiama ordine_hacking.js: con firewallNemico preso da
// M.valoreFirewall. Chiamarlo senza quel campo misurerebbe un'altra cosa
// (vedi la sezione 4).
const comeIlModulo = (att, dif, ctx) => M.modHacking(att, dif, TRINITY,
    Object.assign({ firewallNemico: M.valoreFirewall(dif) }, ctx || {}));
const vFw = (r) => (r.voci || []).filter(v => /firewall|repeater/i.test(v.fonte));

ok(M.valoreFirewall(fusHacker) === 0, `il Fusilier Hacker non ha Firewall (${M.valoreFirewall(fusHacker)})`);
let r = comeIlModulo(intruderKHD, fusHacker, { repeaterNemico: true });
ok(r.firewall === -3, `bersaglio senza Firewall, via Repeater nemico: -3 (${r.firewall})`);
ok(r.firewallFonte === 'REPEATER_NEMICO', `e la fonte e REPEATER_NEMICO (${r.firewallFonte})`);
// CONTROPROVA: senza Repeater, nessun Firewall e nessuna voce.
let rs = comeIlModulo(intruderKHD, fusHacker, {});
ok(rs.firewall === 0 && vFw(rs).length === 0,
   `senza Repeater: nessun Firewall e nessuna voce (${rs.firewall}, ${vFw(rs).length} voci)`);

console.log('\n=== 3. Punto 11: due Firewall non si sommano — -6, non -9 ===');
ok(M.valoreFirewall(brigada) === -6, `la Mobile Brigada (Hacker) ha Firewall -6 (${M.valoreFirewall(brigada)})`);
let rb = comeIlModulo(intruderKHD, brigada, { repeaterNemico: true });
ok(rb.firewall === -6, `col Repeater nemico si applica -6, NON -9 (${rb.firewall})`);
ok(rb.firewallFonte === 'PROPRIO', `e la fonte e il Firewall del bersaglio (${rb.firewallFonte})`);
const motivoFw = vFw(rb).map(v => String(v.motivo)).join(' | ');
ok(/lo sceglie il giocatore del bersaglio/i.test(motivoFw),
   `e il motivo dice che la scelta e del giocatore del bersaglio (${motivoFw.slice(0, 80)})`);
// CONTROPROVA del "non si sommano": -6 e -3 insieme darebbero -9. Il valore
// applicato e` uno dei due, e il motore dichiara quali sono le alternative.
const fa = M.firewallApplicato(brigada, { repeaterNemico: true });
ok(fa.sceltaDelBersaglio === true && fa.alternative.length === 2 &&
   fa.alternative.indexOf(-6) >= 0 && fa.alternative.indexOf(-3) >= 0,
   `le due alternative sono dichiarate, -6 e -3 (${J(fa.alternative)})`);
ok(rb.firewall !== -9, `e la somma -9 non compare mai (${rb.firewall})`);

console.log('\n=== 4. LE DUE STRADE DANNO LA STESSA RISPOSTA ===');
// GIRATA IL 6 OTTOBRE, motore 2026-10-06.12.
// Fino alla .11 M.modHacking faceva `parseInt(ctx.firewallNemico,10) || 0`:
// chi chiamava senza quel campo otteneva 0, cioe` "il bersaglio non ha
// Firewall", e il Firewall c'era. Lo stesso bersaglio chiesto a
// M.firewallApplicato dava un'altra risposta. Questo banco fissava quella
// differenza, e con la .12 e` diventato rosso — come doveva.
// Il contratto di oggi: ctx.firewallNemico ASSENTE o null -> il motore lo
// legge dal bersaglio; PRESENTE -> vale quello, anche 0.
// Percio` "assente" e "zero" ora sono due cose diverse, che e` la regola
// "assente non e` vuoto" applicata al codice.
const senzaCampo = M.modHacking(intruderKHD, brigada, TRINITY, { repeaterNemico: true });
ok(senzaCampo.firewall === -6 && senzaCampo.firewallFonte === 'PROPRIO',
   `senza firewallNemico il motore legge dal bersaglio: -6, PROPRIO (${senzaCampo.firewall}, ${senzaCampo.firewallFonte})`);
ok(senzaCampo.firewall === rb.firewall,
   `cioe la stessa risposta della chiamata che lo passa (${senzaCampo.firewall} e ${rb.firewall})`);
ok(M.firewallApplicato(brigada, { repeaterNemico: true }).valore === senzaCampo.firewall,
   `e la stessa di M.firewallApplicato: le due strade concordano (${M.firewallApplicato(brigada, { repeaterNemico: true }).valore})`);
// Anche senza Repeater: prima il Firewall del bersaglio non si applicava
// affatto da questa strada.
const nudo = M.modHacking(intruderKHD, brigada, TRINITY, {});
ok(nudo.firewall === -6 && nudo.firewallFonte === 'PROPRIO',
   `senza Repeater e senza il campo: -6, PROPRIO (${nudo.firewall}, ${nudo.firewallFonte})`);
ok(M.firewallApplicato(brigada, {}).valore === nudo.firewall,
   `e concorda con M.firewallApplicato (${M.firewallApplicato(brigada, {}).valore})`);

console.log('\n=== 5. "Assente" e "zero" sono due risposte diverse ===');
// LA PROVA CHE IL CAMPO VIENE LETTO, e non solo ignorato: passare 0 NON e`
// come non passare niente. Se il motore tornasse a leggere sempre dal
// bersaglio, questa diventerebbe rossa; se tornasse al `|| 0`, diventerebbe
// rossa quella di sopra. Le due insieme chiudono il caso.
const esplicitoZero = M.modHacking(intruderKHD, brigada, TRINITY, { firewallNemico: 0 });
ok(esplicitoZero.firewall === 0,
   `firewallNemico: 0 vince sul profilo: 0 (${esplicitoZero.firewall})`);
ok(esplicitoZero.firewall !== nudo.firewall,
   `e "zero" da una risposta diversa da "assente" (${esplicitoZero.firewall} contro ${nudo.firewall})`);
const esplicitoNull = M.modHacking(intruderKHD, brigada, TRINITY, { firewallNemico: null });
ok(esplicitoNull.firewall === -6,
   `mentre null conta come assente: -6 (${esplicitoNull.firewall})`);
const esplicitoSei = M.modHacking(intruderKHD, brigada, TRINITY, { firewallNemico: -6, repeaterNemico: true });
ok(esplicitoSei.firewall === -6 && esplicitoSei.firewallFonte === 'PROPRIO',
   `e passare -6 esplicito non cambia nulla (${esplicitoSei.firewall}, ${esplicitoSei.firewallFonte})`);
// CONTROPROVA: leggere dal bersaglio non significa inventare un Firewall a
// chi non ce l'ha. Il Fusilier Hacker non ne ha, e resta 0.
const senzaFw = M.modHacking(intruderKHD, fusHacker, TRINITY, {});
ok(senzaFw.firewall === 0 && !senzaFw.firewallFonte,
   `un bersaglio senza Firewall resta a 0 (${senzaFw.firewall}, ${senzaFw.firewallFonte})`);
// E con il Repeater quello stesso bersaglio prende il -3 del Repeater: la
// lettura dal profilo non ha spento la fonte del Repeater.
const senzaFwRep = M.modHacking(intruderKHD, fusHacker, TRINITY, { repeaterNemico: true });
ok(senzaFwRep.firewall === -3 && senzaFwRep.firewallFonte === 'REPEATER_NEMICO',
   `e col Repeater prende il -3 del Repeater (${senzaFwRep.firewall}, ${senzaFwRep.firewallFonte})`);
// ordine_hacking.js passa ancora firewallNemico (righe 207 e 299): ora e`
// ridondante, non sbagliato, e questa prova dice che le due forme di
// chiamata restano equivalenti.
ok(M.modHacking(intruderKHD, brigada, TRINITY, { firewallNemico: M.valoreFirewall(brigada) }).firewall === nudo.firewall,
   'la chiamata del modulo e quella nuda danno lo stesso numero');

console.log('\n=== 6. Punto 11: l ECM si somma al Firewall, e non da il +3 ===');
// Nei due database NON c'e` nessun profilo con Firewall E ECM insieme
// (misurato: 0 su 765). Serve un'unita` di prova, e si dichiara FINTA.
const conFwEdEcm = TUTTI.filter(u => M.valoreFirewall(u) < 0 && M.valoreEcmHacking(u) < 0).length;
ok(conFwEdEcm === 0, `profili con Firewall E ECM nei database: 0 (${conFwEdEcm}) — serve un unita di prova`);
// UNITA` DI PROVA FINTA, dichiarata: non esiste in nessun database.
const FINTA_fwEcm = { id: 'finta1', nome: 'FINTA: Firewall -3 + ECM -3', alias: 'Finta',
    wip: 13, bts: 3, skills: 'Hacker, Hacking Device, TinBot: Firewall (-3), ECM (Hacking -3)', states: {} };
ok(M.valoreFirewall(FINTA_fwEcm) === -3 && M.valoreEcmHacking(FINTA_fwEcm) === -3,
   `l unita finta ha Firewall -3 e ECM -3 (${M.valoreFirewall(FINTA_fwEcm)}, ${M.valoreEcmHacking(FINTA_fwEcm)})`);
let rfe = comeIlModulo(intruderKHD, FINTA_fwEcm, {});
const sommaVoci = (r) => (r.voci || []).filter(v => /firewall|ecm|repeater/i.test(v.fonte))
                                       .reduce((a, v) => a + v.valore, 0);
ok(sommaVoci(rfe) === -6, `Firewall -3 piu ECM -3 fa -6: si sommano (${sommaVoci(rfe)})`);
// Senza Repeater, bersaglio col SOLO ECM: -3 e NESSUN +3 alla salvezza.
let rm = comeIlModulo(intruderKHD, meteor, {});
ok(sommaVoci(rm) === -3, `il solo ECM -3 da -3 al tiro (${sommaVoci(rm)})`);
const noteDi = (r) => [].concat(r.note || []).join(' | ');
ok(!/\+3 BTS/i.test(noteDi(rm)),
   `e NON promette il +3 BTS alla salvezza: quello e del Firewall (${noteDi(rm).slice(0, 70)})`);
// CONTROPROVA: col Firewall quella nota c'e`. Senza, "non c'e` la nota" non
// distingue "l ECM non la da" da "la nota non esiste piu` per nessuno".
ok(/\+3 BTS/i.test(noteDi(rb)), 'mentre col Firewall la nota del +3 BTS c e');

console.log('\n=== 7. Punto 11: chi non e Hacker non hackera ===');
// Il requisito guarda il BERSAGLIO di TRINITY: solo un Hacker nemico.
let rn = comeIlModulo(intruderKHD, fusCombi, { repeaterNemico: true });
ok(rn.requisitoFallito === true, `bersaglio non Hacker: requisitoFallito (${rn.requisitoFallito})`);
ok(rn.impossibile === true, `e impossibile (${rn.impossibile})`);
// CONTROPROVA: lo stesso Fusilier, profilo Hacker, e un bersaglio valido.
ok(comeIlModulo(intruderKHD, fusHacker, { repeaterNemico: true }).requisitoFallito === false,
   'mentre il profilo Fusilier (Hacker, Hacking Device) e un bersaglio valido');

console.log('\n=== 8. Punto 12: il +3 alla salvezza da Firewall e SEMPRE +3 ===');
const combi = M.profiloArma('Combi Rifle');
const aro = (attivo, reattivo, rep) => M.risolviScontro(
    { attaccante: attivo, azione: M.AZIONI.BS_ATTACK, arma: combi, bersaglio: reattivo, burst: 3, rangeIndex: 1 },
    { difensore: reattivo, azione: 'HACKING', arma: 'TRINITY', bersaglio: M.nomeUnita(attivo), burst: 3, repeaterNemico: !!rep },
    {});
// La salvezza si legge normalizzando: quando il requisito fallisce il campo
// c'e` ma valoreSuccesso non c'e`, e un undefined confrontato con null
// farebbe cadere una prova per il motivo sbagliato.
const salvezzaDi = (sc) => {
    const s = (sc.reattivo || {}).salvezzaInflitta;
    return (s && s.valoreSuccesso != null) ? s.valoreSuccesso : null;
};
// Il bonus si guarda VOCE PER VOCE, non come differenza fra due totali: un
// bersaglio che ha gia` il suo Firewall parte con il +3 addosso, e la
// differenza fra "con Repeater" e "senza" sarebbe 0 anche se tutto
// funzionasse. E` proprio il caso della Mobile Brigada (12 -> 12): la
// differenza dice zero, la voce dice +3 una volta sola. La voce e` la
// domanda giusta.
const vociFirewallSalvezza = (sc) => {
    const s = (sc.reattivo || {}).salvezzaInflitta || {};
    return (s.voci || []).filter(v => /firewall/i.test(v.fonte)).map(v => v.valore);
};
const senzaRep = salvezzaDi(aro(fusHacker, intruderKHD, false));
const conRep   = salvezzaDi(aro(fusHacker, intruderKHD, true));
ok(senzaRep === 6 && conRep === 9, `bersaglio senza Firewall: 6 senza Repeater, 9 con (${senzaRep}, ${conRep})`);
ok(J(vociFirewallSalvezza(aro(fusHacker, intruderKHD, true))) === J([3]),
   `e la voce del Firewall e UNA sola da +3 (${J(vociFirewallSalvezza(aro(fusHacker, intruderKHD, true)))})`);
// Con un Firewall -6 il bonus NON scala: resta +3. E col Repeater in piu`
// resta UNA voce da +3, non due e non +6.
const bSenza = vociFirewallSalvezza(aro(brigada, intruderKHD, false));
const bCon   = vociFirewallSalvezza(aro(brigada, intruderKHD, true));
ok(J(bSenza) === J([3]), `Firewall -6: il bonus alla salvezza e +3, non +6 (${J(bSenza)})`);
ok(J(bCon) === J([3]), `e col Repeater in piu resta una voce sola da +3 (${J(bCon)})`);
ok(salvezzaDi(aro(brigada, intruderKHD, false)) === salvezzaDi(aro(brigada, intruderKHD, true)),
   `percio il totale non cambia: chi ha gia il Firewall non prende un secondo +3 (${salvezzaDi(aro(brigada, intruderKHD, true))})`);

console.log('\n=== 9. Punto 13: i numeri dell ARO di Hacking ===');
// Intruder KHD (WIP 14) reagisce con TRINITY. Il bersaglio e` il Fusilier
// HACKER (BTS 0): col Fusilier (Combi Rifle) TRINITY non si dichiara.
const a1 = aro(fusHacker, intruderKHD, false), a2 = aro(fusHacker, intruderKHD, true);
ok((a1.reattivo || {}).mod === 17, `senza Repeater: 17 (${(a1.reattivo || {}).mod})`);
ok(salvezzaDi(a1) === 6, `e salvezza BTS 6 (${salvezzaDi(a1)})`);
ok((a2.reattivo || {}).mod === 14, `con Repeater: 14 (${(a2.reattivo || {}).mod})`);
ok(salvezzaDi(a2) === 9, `e salvezza BTS 9 (${salvezzaDi(a2)})`);
ok((a1.reattivo || {}).requisitoFallito === false,
   'e il requisito e soddisfatto: il bersaglio e un Hacker nemico');
// LA PROVA CHE LO SCENARIO CONTA: lo stesso ARO contro il Fusilier NON
// Hacker non produce ne burst ne salvezza.
const a3 = aro(fusCombi, intruderKHD, false);
ok((a3.reattivo || {}).requisitoFallito === true,
   'contro il Fusilier (Combi Rifle) il requisito FALLISCE: TRINITY vuole un Hacker');
ok(salvezzaDi(a3) === null && (a3.reattivo || {}).burst === 0,
   `e non c e ne salvezza ne burst (${salvezzaDi(a3)}, burst ${(a3.reattivo || {}).burst})`);

console.log('\n=== 10. Punto 13: chi non e Hacker non puo DICHIARARE l ARO ===');
// MISURATO IL 6 OTTOBRE, e la posizione del controllo conta:
// il cancello e` M.azioniAroPossibili, che a un non Hacker nega HACKING col
// motivo "Non e` un Hacker". M.risolviScontro NON lo ricontrolla: risolve la
// reazione che gli viene passata, e se qualcuno gli passasse un TRINITY
// dichiarato da chi non ha il Dispositivo, lo calcolerebbe (burst 1,
// salvezza 6). Non e` un difetto — e` un livello: il "no" sta prima. Ma va
// scritto, perche` un chiamante che salti il cancello non trova una seconda
// rete, e un domani in cui il cancello si sposta deve farsi notare qui.
[['Fusilier (Combi Rifle), non Hacker', fusCombi, false],
 ['Fusilier (Hacker, Hacking Device)', fusHacker, true]].forEach(([et, u, atteso]) => {
    const voce = M.azioniAroPossibili(u, 'ATTACCO BS').find(a => /HACK/i.test(a.id));
    ok(!!voce, `${et}: HACKING compare fra le opzioni ARO`);
    ok(voce && voce.ammesso === atteso,
       `  e ammesso e ${atteso} (${voce && voce.ammesso})`, voce && voce.motivo);
});
const negata = M.azioniAroPossibili(fusCombi, 'ATTACCO BS').find(a => /HACK/i.test(a.id)) || {};
ok(/non e` un hacker|non è un hacker/i.test(String(negata.motivo)),
   `e il motivo del rifiuto e "Non e un Hacker" (${negata.motivo})`);
// La seconda metà del fatto: risolviScontro si fida del chiamante.
const passatoAvanti = aro(fusHacker, fusCombi, false).reattivo || {};
ok(passatoAvanti.requisitoFallito === false && passatoAvanti.burst === 1,
   `risolviScontro invece non ricontrolla: calcola comunque (burst ${passatoAvanti.burst}, reqFallito ${passatoAvanti.requisitoFallito})`);

console.log('\n=== 11. Punto 15: l avviso A90 non scatta su nessun profilo ===');
let conA90 = [];
TUTTI.forEach(function (u) {
    const p = M.programmiDisponibili(u);
    const av = (p && p.avvisi) || [];
    if (av.some(a => String(a.codice || '') === 'A90')) conA90.push(u.nome);
});
ok(conA90.length === 0, `A90 su 0 profili (${conA90.length}${conA90.length ? ': ' + conA90.slice(0, 3).join(', ') : ''})`);
// CONTROPROVA: l avviso ESISTE e sa scattare. Senza questa prova, "0
// profili" non distingue "i dati sono a posto" da "il controllo non c e`".
const FINTA_hackerSenzaDispositivo = { id: 'finta2', nome: 'FINTA: Hacker senza dispositivo',
    alias: 'Finta2', wip: 13, skills: 'Hacker', equip: '', states: {} };
const pf = M.programmiDisponibili(FINTA_hackerSenzaDispositivo);
const avF = (pf && pf.avvisi) || [];
ok(avF.some(a => String(a.codice) === 'A90'),
   `su un unita finta con la skill Hacker e nessun dispositivo A90 scatta (${J(avF.map(a => a.codice))})`);
ok(avF.some(a => /ha la skill Hacker ma nessun Dispositivo di Hacking/.test(String(a.messaggio))),
   'col testo dichiarato da MOTORE');

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
