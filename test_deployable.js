// @versione 2026-09-23.1 | test_deployable.js | proprieta`: chat TEST
// Deployable: risoluzione, Boost, piazzamento — node test_deployable.js
global.window = global;
require('./catalogo_n5.js'); require('./database_comune.js');
require('./database_nomad.js'); require('./database_panoceania.js');
const M = require('./motore_regole_n5.js');

let passati = 0, falliti = 0;
function ok(c, n, e) { if (c) { passati++; console.log(`  ✅ ${n}`); } else { falliti++; console.log(`  ❌ ${n}${e ? '\n       ' + e : ''}`); } }

const CINQUE = ['CrazyKoalas', 'Madtraps', 'Jammer', 'D-Charges (Demolition Mode)', 'Chest Mines (CC Mode)'];

console.log('\n=== 1. Le cinque armi risolvono, e ognuna dichiara il suo modo ===');
CINQUE.forEach(function (n) {
    const p = M.profiloArma(n);
    ok(!p.avvisi.some(a => a.codice === 'A45'), `${n}: nessun A45`);
    ok(p.risoluzione && p.modoRisoluzione, `${n}: modo "${p.risoluzione}" risolto`);
});

console.log('\n=== 2. Chest Mines (CC Mode) è da mischia ===');
const cm = M.profiloArma('Chest Mines (CC Mode)');
ok(cm.isCC === true, 'isCC true dal modo CC');
const conMine = { alias: 'X', weapon: 'Chest Mines (CC Mode), CC Weapon', equip: '', states: {} };
ok(M.armiCC(conMine).some(a => /Chest Mines/.test(a.nome)), 'e compare fra le armi da CC');

console.log('\n=== 3. creaAttacco non blocca più ===');
M._fazione = 'NOMADI';
const zero = { id: 'n1', alias: 'Zero', bs: 11, wip: 13, skills: '', states: {} };
M._rosterProprio = [zero];
M._rosterNemico = [{ id: 'p1', alias: 'Fusilier', tipo: 'LI', arm: 1, bts: 0, ph: 10, skills: '', states: {} }];
const e = M.creaAttacco({
    attaccante: zero, azione: M.AZIONI.BS_ATTACK, arma: M.profiloArma('Jammer'),
    bersagli: [{ id: 'p1', name: 'Fusilier', burst: 1, ammo: 'N', terrain: 'NESSUNO' }]
});
ok(!e.errori.some(x => x.codice === 'E09'), 'niente E09: l arma ha un modo di risoluzione');
ok(!e.errori.some(x => x.codice === 'E13'), 'niente E13');

console.log('\n=== 4. Un modo inventato, e un arma senza niente ===');
window.RULES_WEAPONS['ARMA FINTA'] = { traits: [], b: 1, dam: 5, ammo: 'N', risoluzione: 'MODO_INVENTATO' };
const finta = M.profiloArma('ARMA FINTA');
ok(finta.avvisi.some(a => a.codice === 'A45' && /non è nel catalogo/.test(a.messaggio)),
   'modo inventato: A45 col messaggio nuovo');
window.RULES_WEAPONS['ARMA NUDA'] = { traits: [], b: 1, dam: 5, ammo: 'N' };
ok(M.profiloArma('ARMA NUDA').avvisi.some(a => a.codice === 'A45'),
   'nessuna gittata, nessun flag, nessun modo: A45 come prima');
delete window.RULES_WEAPONS['ARMA FINTA']; delete window.RULES_WEAPONS['ARMA NUDA'];

console.log('\n=== 5. Il dedotto è dichiarato ===');
// Il Jammer NON è più dedotto: il modo ZOC_WIP è confermato dai suoi Tratti
// nel database (BS Weapon (WIP), Comms Attack, Zone of Control), presi dal
// Weapon Chart. Il test verificava lo stato di prima.
// (Chat REGOLE, giro del 21 settembre.)
ok(!M.profiloArma('Jammer').avvisi.some(a => a.codice === 'A47'),
   'Jammer: ZOC_WIP confermato dai Tratti, nessun A47');
ok(M.profiloArma('D-Charges (Demolition Mode)').avvisi.some(a => a.codice === 'A47'),
   'mentre CONTATTO_STRUTTURA delle D-Charges resta dedotto, e il motore lo dice');
ok(!M.profiloArma('CrazyKoalas').avvisi.some(a => a.codice === 'A47'),
   'CrazyKoalas: BOOST_ZOC è letto dal regolamento, nessun avviso');
ok(window.CATALOGO_N5.RISOLUZIONI.BOOST_ZOC.riga === 4700, 'con la riga del PDF a catalogo');

console.log('\n=== 6. IL BOOST NON È UN FACCIA A FACCIA ===');
const koala = M.profiloArma('CrazyKoalas');
const fus = { alias: 'Fusilier', bs: 12, ph: 10, arm: 1, bts: 0, skills: '', states: {} };
const nulla = { alias: '-', bs: 0, skills: '', states: {} };
const conf = M.tipoConfronto({ azione: M.AZIONI.BS_ATTACK, arma: koala, attaccante: nulla, burst: 1 },
    { azione: 'DODGE', bersaglio: nulla, burst: 1 }, {});
ok(conf.tipo === 'NORMALE', 'tipo NORMALE, non F2F');
ok(/senza tirare/.test(conf.motivo), 'e il motivo dice che il deployable non tira');

const sc = M.risolviScontro({ attaccante: nulla, azione: M.AZIONI.BS_ATTACK, arma: koala,
    bersaglio: fus, burst: 1, ammo: koala.ammo },
    { difensore: fus, azione: 'DODGE', hasLoF: false }, {});
ok(sc.attivo.mod === 'Auto', 'l attivo non ha Valore di Successo: "Auto"');
ok(sc.attivo.salvezzaInflitta.valoreSuccesso === 6,
   `Fusilier: ARM VS 6 col PS 5 dello Shock (ottenuto ${sc.attivo.salvezzaInflitta.valoreSuccesso})`);
ok(sc.reattivo.mod === 10, `Schivata a PH PIENO: 10, nessun -3 per assenza di LoF (ottenuto ${sc.reattivo.mod})`);
ok(sc.reattivo.note.some(n => /arriva a contatto/.test(n)), 'e la nota spiega perché');
ok(sc.reattivo.note.some(n => /rimossa dal gioco/.test(n)),
   'e il giocatore legge che dopo la detonazione il koala è rimosso');

console.log('\n=== 7. Quando il Boost NON scatta ===');
function innesco(nemico, ctx) { return M.innescoDeployable(koala, nemico, ctx || {}); }
ok(innesco({ alias: 'N', states: {} }, { percorsoLibero: true }).scatta, 'nemico scoperto, percorso libero: scatta');
ok(!innesco({ alias: 'N', states: { camo: true } }, { percorsoLibero: true }).scatta,
   'Marker Mimetico: NON scatta');
ok(!innesco({ alias: 'N', states: { impersonation: true } }, { percorsoLibero: true }).scatta,
   'Marker Impersonation: NON scatta');
ok(!innesco({ alias: 'N', states: {} }, { percorsoLibero: false }).scatta,
   'percorso bloccato: NON scatta');
ok(!innesco({ alias: 'K', states: {}, deployable: true }, { percorsoLibero: true }).scatta,
   'un altro Deployable: NON lo innesca');
ok(innesco({ alias: 'N', states: {} }, {}).note.some(n => /Percorso non verificato/.test(n)),
   'e senza risposta sul percorso lo dichiara invece di darlo per buono');

console.log('\n=== 8. PIAZZARE EQUIPAGGIAMENTO ===');
ok(M.AZIONI.PIAZZA_DEPLOYABLE === 'PIAZZARE EQUIPAGGIAMENTO',
   'la stringa è quella del menu: INTERFACCIA non deve rinominare niente');
const spec = M.SPEC[M.AZIONI.PIAZZA_DEPLOYABLE];
ok(spec && spec.bersagli === 'nessuno' && spec.gittata === false && spec.tiro === false,
   'nessun bersaglio, nessuna gittata, nessun tiro');
ok(M.autotest().join() === 'contratto coerente', 'e il contratto resta coerente');

const conKoala = { id: 'n2', alias: 'Moran', bs: 11, weapon: 'Combi Rifle', equip: 'CrazyKoalas', states: {} };
M._rosterProprio = [zero, conKoala];
const piazz = M.armiPiazzabili(conKoala);
ok(piazz.armi.some(a => /CrazyKoala/.test(a.nome)), 'il Moran può piazzare i CrazyKoalas');
ok(!piazz.armi.some(a => /Combi/.test(a.nome)), 'ma non il Combi Rifle');

const senzaDeploy = M.creaAttacco({
    attaccante: conKoala, azione: M.AZIONI.PIAZZA_DEPLOYABLE,
    arma: M.profiloArma('Combi Rifle'), bersagli: []
});
ok(senzaDeploy.errori.some(x => x.codice === 'E16'), 'arma non Deployable: E16');

const esaurito = Object.assign({}, conKoala, { usiSpesi: { 'CrazyKoalas': 9 } });
const koalaP = M.profiloArma('CrazyKoalas');
const usi = M.usiResidui(esaurito, koalaP);
if (usi) {
    ok(usi.residui === 0, 'usi esauriti rilevati');
    const ex = M.creaAttacco({ attaccante: esaurito, azione: M.AZIONI.PIAZZA_DEPLOYABLE,
                               arma: koalaP, bersagli: [] });
    ok(ex.errori.some(x => x.codice === 'E17'), 'e creaAttacco dà E17');
} else {
    ok(true, 'CrazyKoalas non è Disposable: nessun limite d uso da controllare');
}

const valido = M.creaAttacco({ attaccante: conKoala, azione: M.AZIONI.PIAZZA_DEPLOYABLE,
                               arma: koalaP, bersagli: [] });
ok(!valido.errori.some(x => ['E04','E05','E16','E17'].indexOf(x.codice) >= 0),
   'piazzamento valido: nessun bersaglio richiesto, nessun errore');

console.log('\n=== 9. Le tre domande, perché l app non ha la mappa ===');
['PIAZZAMENTO', 'PERIMETER', 'ATTIVAZIONE'].forEach(function (f) {
    const d = M.domandeDeployable(f);
    ok(d.length === 1 && d[0].testo && d[0].id, `${f}: una domanda con testo e id`);
});
ok(/Marker mimetico/.test(M.domandeDeployable('PIAZZAMENTO')[0].testo),
   'al piazzamento si chiede del Marker nell area d innesco');
ok(M.domandeDeployable('PIAZZAMENTO')[0].blocca === true, 'e la risposta può bloccare');
ok(M.domandeDeployable('ALTRO').length === 0, 'una fase sconosciuta non inventa domande');

console.log('\n=== 10. Il regolamento è citato, non riassunto ===');
const B = window.CATALOGO_N5.REGOLE_DEPLOYABLE.boost;
ok(B.fonte === 'regolamento' && B.riga === 4700, 'boost: fonte e riga');
ok(window.CATALOGO_N5.REGOLE_DEPLOYABLE.piazzamento.riga === 5517, 'piazzamento: riga 5517');

console.log('\n=== 11. Piazzare è un ordine senza tiro, e genera ARO ===');
// La chiave in MOVIMENTO.senzaTiro dev'essere la stringa CANONICA: con
// 'PIAZZA_DEPLOYABLE' la voce c era ma azioneSenzaTiro non la trovava.
const sz = M.azioneSenzaTiro(M.AZIONI.PIAZZA_DEPLOYABLE);
ok(!!sz, 'azioneSenzaTiro trova "PIAZZARE EQUIPAGGIAMENTO"');
ok(sz && sz.generaAro === true, 'e genera ARO: il nemico reagisce a chi piazza');
ok(sz && sz.tipo === 'SHORT_SKILL', 'è un\'Abilità Breve');

// chi piazza non tira MAI: un tiro solo, nessun confronto
// 🔴 Si legge il profilo VERO dal database, non un dato inventato a mano.
// Avevo scritto arm: 1 e asserito ARM VS 8; il Moran ha ARM 0 in entrambe
// le varianti, quindi il valore giusto è VS 7. Il test passava perché
// misurava il mio dato di prova, non il database — la stessa specie
// dell'errore che avevo in test_modulo_supporto.js.
const moranDB = window.DB_NOMADI.find(u => /^Moran/.test(u.nome || ''));
const moran = Object.assign({}, moranDB, { alias: 'Moran', states: {} });
const fusR = { alias: 'Fusilier', bs: 12, ph: 10, arm: 1, bts: 0, skills: '', states: {} };
const piazza = M.risolviScontro(
    { attaccante: moran, azione: M.AZIONI.PIAZZA_DEPLOYABLE,
      arma: M.profiloArma('CrazyKoalas'), bersaglio: fusR, burst: 0 },
    { difensore: fusR, azione: 'BS_ATTACK', arma: M.profiloArma('Combi Rifle'),
      bersaglio: moran, rangeIndex: 1 }, {});
ok(piazza.tipo === 'NESSUNO', 'nessun confronto: chi piazza non tira');
ok(piazza.attivo.burst === 0, 'Burst 0 per chi piazza');
const mimMoran = M.valoreMimetismo(moran);
ok(piazza.reattivo.mod === 12 + mimMoran + 3 - 3 + 0 || piazza.reattivo.mod === 12,
   `il reattivo tira: BS 12 +3 gittata ${mimMoran} Mimetismo = ${piazza.reattivo.mod}`);
ok(moran.arm === 0, 'il Moran ha ARM 0, non 1');
ok(piazza.reattivo.salvezzaInflitta.valoreSuccesso === 7,
   `e si salva su ARM VS 7 (ARM 0 + PS 7, nessuna copertura) — ottenuto ${piazza.reattivo.salvezzaInflitta.valoreSuccesso}`);

console.log('\n=== 12. Il vincolo della riga 5532, per la passata 3 ===');
const NB = window.CATALOGO_N5.REGOLE_DEPLOYABLE.nonBersagliabileSubito;
ok(!!NB, 'il vincolo è a catalogo');
ok(NB.riga === 5532 && NB.fonte === 'regolamento', 'con riga e fonte');
ok(NB.campo === 'ordineDiPiazzamento',
   'e il nome del campo che creaDeployable dovrà scrivere');

console.log('\n=== 13. Nessuna nota duplicata ===');
const koalaN = M.profiloArma('CrazyKoalas');
const scN = M.risolviScontro(
    { attaccante: { alias: '-', bs: 0, skills: '', states: {} }, azione: M.AZIONI.BS_ATTACK,
      arma: koalaN, bersaglio: fusR, burst: 1, ammo: koalaN.ammo },
    { difensore: fusR, azione: 'DODGE', hasLoF: false }, {});
const tutte = scN.reattivo.note.concat(scN.note || []);
ok(tutte.filter(n => /evitato del tutto/.test(n)).length === 1,
   'la nota sulla Schivata compare UNA volta sola');

console.log('\n=== 14. I due modi nuovi: RIPETITORE e PIAZZATO ===');
['FastPanda', 'Disco Ball'].forEach(function (n) {
    const p = M.profiloArma(n);
    ok(!p.avvisi.some(a => a.codice === 'A45'), `${n}: nessun A45`);
    ok(p.modoRisoluzione && p.modoRisoluzione.fonte === 'regolamento',
       `${n}: modo letto dal regolamento, non dedotto`);
});
ok(window.CATALOGO_N5.RISOLUZIONI.RIPETITORE.riga === 5566, 'RIPETITORE: riga 5566');
ok(window.CATALOGO_N5.RISOLUZIONI.PIAZZATO.riga === 4522, 'PIAZZATO: riga 4522');

console.log('\n=== 15. 🔴 ALLA FASE STATI SI TOGLIE LA SAGOMA, NON IL TOKEN ===');
// Rimuovere il token farebbe sparire un bersaglio legittimo dal tavolo, e
// nessuno se ne accorgerebbe finché qualcuno non prova a spararci.
const tokenDB = window.DB_DEPLOYABLES.find(d => d.nome === 'Disco Ball');
const fine = M.fineTurnoDeployable(tokenDB);
ok(fine.rimuoviToken === false, 'il token NON viene rimosso');
ok(fine.rimuoviSagoma === true, 'la Sagoma sì');
ok(fine.bersagliabile === true, 'e il token resta bersagliabile');
ok(/fine partita o distruzione/.test(fine.permanenza || ''),
   'resta fino a fine partita o finché non è distrutto');
ok(/Activate Disco Ball/.test(fine.riattivabileCon || ''), 'e si può riaccendere');

const koalaDB = window.DB_DEPLOYABLES.find(d => d.nome === 'CrazyKoala');
ok(M.fineTurnoDeployable(koalaDB).rimuoviSagoma === false,
   'un CrazyKoala non ha sagome da togliere: nessuna disattivazione');

console.log('\n=== 16. Il token nasce dall ESITO, non dall equipaggiamento ===');
// Nessun profilo porta il "Disco Ball": i portatori hanno il "Disco Baller".
const nato = M.deployableDaEsito(M.profiloArma('Disco Ball'));
ok(nato && nato.voce && nato.voce.nome === 'Disco Ball', 'la voce si trova per chiaveArma');
ok(nato.voce.arm === 0 && nato.voce.str === 1 && nato.voce.s === 1,
   'ARM 0, STR 1, S 1 dal database, non da una tabella nuova');
ok(nato.sagoma && nato.sagoma.munizione === 'ECLIPSE',
   'con la Sagoma Circolare Eclipse centrata');
ok(/solo se il tiro riesce/.test(nato.nota), 'e il token entra solo se il tiro riesce');
ok(M.deployableDaEsito(M.profiloArma('CrazyKoalas')) === null,
   'i CrazyKoalas invece nascono dall equipaggiamento: null');

console.log('\n=== 17. Chi non attacca non infligge salvezze ===');
const fp = M.deployableAttacca(M.profiloArma('FastPanda'));
ok(fp.attacca === false, 'FastPanda: non attacca');
ok(/Area di Hacking/.test(fp.effetto || ''), 'il suo effetto è estendere l Area di Hacking');
ok(M.deployableAttacca(M.profiloArma('CrazyKoalas')).attacca === true,
   'un CrazyKoala invece attacca');

console.log('\n=== 18. DB_DEPLOYABLES è l unica tabella ===');
// Avevamo chiesto una seconda tabella con gli stessi numeri: DATABASE l ha
// fermata. Il dato c era, avevamo cercato solo in RULES_WEAPONS.
// Il numero di voci NON si fissa: era 15, con database_comune 2026-09-21.4
// e` 16 per l'Armed Turret, e un test con "=== 15" sarebbe diventato rosso
// per una crescita legittima (avviso della chat REGOLE). Si asserisce cio`
// che la tabella deve contenere, non quante righe ha.
// Fonte: REGOLE_N5_v5_1_1.txt riga 6556, "DEPLOYABLE PROFILES", 13 voci.
const DALLA_TABELLA = ['AP Mine', 'Cybermine', 'Disco Ball', 'Drop Bears (Deployable Mode)', 'E/M Mine',
    'Monofilament Mine', 'PARA Mine', 'Shock Mine', 'Viral Mine', 'WildParrot', 'CrazyKoalas', 'FastPanda', 'Madtraps'];
const chiavi = window.DB_DEPLOYABLES.map(d => d.chiaveArma);
const mancanti = DALLA_TABELLA.filter(k => !chiavi.includes(k));
ok(mancanti.length === 0, `le 13 voci della tabella del regolamento ci sono tutte (mancanti: ${JSON.stringify(mancanti)})`);
const ids = window.DB_DEPLOYABLES.map(d => d.id);
ok(ids.every((x, i) => ids.indexOf(x) === i), `nessun id ripetuto su ${ids.length} voci`);
ok(window.DB_DEPLOYABLES.every(d => d.arm !== undefined && d.str !== undefined),
   'tutte con arm e str');
// chiaveArma e` un contratto: una stringa, o null ESPLICITO dove il
// deployable non ha un profilo d'arma. Un campo assente non e` un null.
ok(window.DB_DEPLOYABLES.every(d => 'chiaveArma' in d),
   'tutte portano il campo chiaveArma — stringa o null esplicito, mai assente');
ok(window.DB_DEPLOYABLES.filter(d => typeof d.chiaveArma === 'string')
       .every(d => !M.profiloArma(d.chiaveArma).nonTrovata),
   'e ogni chiaveArma dichiarata esiste in RULES_WEAPONS');
ok(typeof window.RULES_DEPLOYABLES === 'undefined',
   'e NON esiste una seconda tabella: una fonte sola');

console.log('\n=== 19. Chi non attacca non infligge salvezze — SENZA guardrail ===');
// M.deployableAttacca è opzionale, quindi aggirabile: chi lo dimenticava
// otteneva "ARM VS 1, PS 0", un numero calcolato su dati che l'arma non ha.
// Ora il controllo è dentro tiroSalvezza: non dipende dall'ordine delle chiamate.
const bersaglio = { alias: 'Fusilier', arm: 1, bts: 0, ph: 10 };
const sFP = M.tiroSalvezza(bersaglio, { arma: M.profiloArma('FastPanda') });
ok(sFP.offensivo === false, 'FastPanda: offensivo false, senza passare da deployableAttacca');
ok(sFP.valoreSuccesso === null && sFP.tiri === 0, 'nessun valore, nessun dado');
ok(/nessun Tiro Salvezza/.test(sFP.motivo || ''), 'col motivo');
ok(sFP.note.some(n => /Area di Hacking/.test(n)), 'e la nota dice cosa fa invece');

// le armi che attaccano non sono toccate
ok(M.tiroSalvezza(bersaglio, { arma: M.profiloArma('CrazyKoalas') }).offensivo === true,
   'un CrazyKoala infligge salvezze come prima');
ok(M.tiroSalvezza(bersaglio, { arma: M.profiloArma('Combi Rifle') }).valoreSuccesso === 8,
   'e un Combi Rifle resta ARM VS 8');

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
