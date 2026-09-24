// @versione 2026-09-21.4 | test_marker_mimetico.js | proprieta`: chat TEST
// ================================================================
// Marker Mimetico in N5. Richiesta della chat REGOLE.
// Fonte: REGOLE_N5_v5_1_1.txt
//   13607  CAMOUFLAGED: un solo tipo di Marker; "Camouflaged Markers
//          indicate the MOD level that Mimetism applies, if they have it".
//          Il MOD al Discover e` quello del Mimetismo del profilo, non di un
//          "livello" di Camouflage: la distinzione Camo / TO Camo e` N4.
//   13889, 13893  HIDDEN DEPLOYMENT: "considered not to be on the game table
//          at all" — non bersagliabile.
//   13917  cancellazione: si resta Marker con Movimento Cauto o un'Abilita`
//          Breve Base senza tiro; qualunque altra Abilita` o ARO cancella
//          sia l'Hidden Deployment sia lo Stato Mimetizzato.
//
// I profili si leggono dal database, mai costruiti a mano: un test che
// inventa i dati verifica se stesso.
// ================================================================
let passati = 0, falliti = 0;
const ok = (c, m) => { if (c) { passati++; console.log('  ✅ ' + m); } else { falliti++; console.log('  ❌ ' + m); } };

global.window = global;
require('./catalogo_n5.js'); require('./database_comune.js');
require('./database_nomad.js'); require('./database_panoceania.js');
const M = require('./motore_regole_n5.js');

const TUTTI = [...window.DB_NOMADI, ...window.DB_PANOCEANIA];
const profilo = (nome, extra) => {
    const u = TUTTI.find(x => x.nome === nome);
    if (!u) throw new Error('profilo assente dal database: ' + nome);
    return Object.assign(JSON.parse(JSON.stringify(u)), extra || {});
};
const alg = profilo('Alguacil (Combi Rifle)', { states: {} });
const mimDiscover = (u) => M.modScoprire(alg, u, { rangeIndex: 1 }).voci
    .filter(v => /Mimetismo/i.test(v.motivo)).reduce((a, v) => a + v.valore, 0);

console.log('\n=== 0. I profili hanno davvero le abilita` che il test presuppone ===');
const LOCUST = 'Locust (Boarding Shotgun)';
const HELOT  = 'Helot Militiaman (Surprise Attack [-3], Camouflage, Red Fury)';
const SPEKTR = 'Spektr (MULTI Sniper Rifle)';
const sk = (n) => profilo(n).skills || '';
ok(/Camouflage/.test(sk(LOCUST)) && /Mimetism \(-6\)/.test(sk(LOCUST)) && !/Hidden Deployment/.test(sk(LOCUST)),
   'Locust: Camouflage + Mimetism (-6), senza Hidden Deployment');
ok(/Camouflage/.test(sk(HELOT)) && !/Mimetism/.test(sk(HELOT)),
   'Helot: Camouflage senza Mimetism');
ok(/Camouflage/.test(sk(SPEKTR)) && /Hidden Deployment/.test(sk(SPEKTR)) && /Mimetism \(-6\)/.test(sk(SPEKTR)),
   'Spektr: Camouflage + Hidden Deployment + Mimetism (-6)');

console.log('\n=== 1. Locust: un solo tipo di Marker, -6 al Discover, nessun livello ===');
// Le vecchie etichette CAMO_1 / CAMO_2 (Camo / TO Camo) sono N4: in N5 devono
// dare lo stesso Marker. Se un giorno CAMO_2 desse un MOD diverso, sarebbe
// tornato il "livello".
for (const ds of ['CAMO', 'CAMO_1', 'CAMO_2']) {
    const u = profilo(LOCUST, { deployState: ds, state: ds, states: {} });
    const s = M.statoBersaglio(u);
    const chiaviLivello = Object.keys(s).concat(Object.keys(s.quantita || {})).filter(k => /livell|level/i.test(k));
    ok(s.camo === true && mimDiscover(u) === -6 && chiaviLivello.length === 0,
       `deployState ${ds}: Marker, -6 al Discover, nessun campo "livello" (${mimDiscover(u)}, ${JSON.stringify(chiaviLivello)})`);
}

console.log('\n=== 2. Helot: Marker senza MOD al Discover ===');
const helot = profilo(HELOT, { states: { camo: true } });
ok(M.statoBersaglio(helot).camo === true, 'e` un Marker Mimetizzato');
ok(mimDiscover(helot) === 0, `nessun MOD di Mimetismo al Discover (${mimDiscover(helot)})`);
// Controprova: il -6 del Locust non e` una costante del Marker.
ok(mimDiscover(profilo(LOCUST, { states: { camo: true } })) !== mimDiscover(helot),
   'controprova: Locust e Helot, stesso Marker, MOD diversi — il MOD viene dal Mimetismo');

console.log('\n=== 3. Spektr in Hidden Deployment: non e` sul tavolo ===');
const nascosto = profilo(SPEKTR, { deployState: 'HIDDEN', state: 'HIDDEN', states: { hidden: true } });
const sN = M.statoBersaglio(nascosto);
ok(sN.hidden === true, 'stato Hidden Deployment riconosciuto');
for (const [az, nome] of [[M.AZIONI.BS_ATTACK, 'ATTACCO BS'], [M.AZIONI.SCOPRIRE, 'SCOPRIRE']]) {
    const r = M.bersagliValidi(az, [nascosto], { attaccante: alg })[0];
    ok(r && r.ammesso === false && /Hidden Deployment|non (e|è) sul tavolo/i.test(r.motivo || ''),
       `${nome}: non bersagliabile, col motivo dell'Hidden Deployment`);
}
// Controprova: lo stesso Spektr come Marker normale E` un bersaglio di Scoprire.
const spMarker = profilo(SPEKTR, { states: { camo: true } });
const rScop = M.bersagliValidi(M.AZIONI.SCOPRIRE, [spMarker], { attaccante: alg })[0];
ok(rScop && rScop.ammesso === true, 'controprova: lo Spektr come Marker si puo` Scoprire');
ok(mimDiscover(spMarker) === -6, 'e il Discover prende il suo -6');

console.log('\n=== 5. TO Camouflage non esiste in N5 ===');
// Motore 2026-09-21.22: tolta la voce dal catalogo (REGOLE, riga 13607).
// Nessun test era diventato rosso — cioe` nessuno la guardava. Questa sezione
// la guarda, nome E alias, perche` una voce rientrata come alias di un'altra
// sarebbe lo stesso difetto sotto un altro nome.
const C = window.CATALOGO_N5;
const vociCatalogo = Object.entries(C.SKILL || {}).concat(Object.entries(C.EQUIP || {}));
const cerca = (re) => vociCatalogo.filter(([k, v]) => re.test(k) || (v.aliasTesto || []).some(a => re.test(a))).map(x => x[0]);
ok(cerca(/\bTO\b[^,]*camo/i).length === 0, `nessuna voce "TO Camouflage", ne' come nome ne' come alias (${JSON.stringify(cerca(/\bTO\b[^,]*camo/i))})`);
// Controprova: la ricerca funziona davvero — trova Camouflage. Senza questa, uno
// zero potrebbe voler dire che si sta cercando nell'oggetto sbagliato.
ok(cerca(/^camouflage$/i).length >= 1, 'controprova: la stessa ricerca trova "Camouflage"');
// E nei due database nessun profilo scrive piu` TO Camouflage.
const profiliTO = TUTTI.filter(u => /\bTO Camouflage\b/i.test((u.skills || '') + ' ' + (u.equip || '')));
ok(profiliTO.length === 0, `nessun profilo porta "TO Camouflage" (${profiliTO.length})`);

console.log('\n=== 6. Hidden Deployment non e` un Marker ===');
// Riga 13889: "without placing a Model or Marker on the battlefield".
const sHid = M.statoBersaglio(profilo(SPEKTR, { deployState: 'HIDDEN', state: 'HIDDEN', states: { hidden: true } }));
ok(sHid.hidden === true, 'HIDDEN: hidden vero');
ok(sHid.camo === false, 'HIDDEN: camo falso');
ok(M.inFormaMarker(sHid) === false, 'HIDDEN: inFormaMarker falso');
// Controprova: lo stesso profilo schierato come Marker lo e`.
const sCam = M.statoBersaglio(profilo(SPEKTR, { states: { camo: true } }));
ok(sCam.camo === true && sCam.hidden !== true && M.inFormaMarker(sCam) === true,
   'controprova: lo Spektr in CAMO e` un Marker (camo vero, hidden no, inFormaMarker vero)');

console.log('\n=== 4. Transizioni: cosa resta dopo un\'Abilita` (M.statoDopoAbilita) ===');
// Righe 13915-13921: l'Hidden Deployment si cancella con qualunque Ordine o
// ARO; chi ha Camouflage resta Marker se dichiara Movimento Cauto o
// un'Abilita` Corta Base senza tiro, altrimenti si piazza il modello.
// Righe 13634-13635: il Camuffato cade con un Attacco o un'Abilita` con tiro.
// Oltre al risultato dichiarato, ogni caso rilegge l'unita` aggiornata con
// statoBersaglio e bersagliValidi: il dato restituito deve essere quello che
// il resto del motore vede, non solo una descrizione corretta.
const spHidden = () => profilo(SPEKTR, { deployState: 'HIDDEN', state: 'HIDDEN', states: { hidden: true } });
const dopo = (abilita) => {
    const r = M.statoDopoAbilita(spHidden(), abilita, {});
    const s = M.statoBersaglio(r.unitaAggiornata);
    const bs = M.bersagliValidi(M.AZIONI.BS_ATTACK, [r.unitaAggiornata], { attaccante: alg })[0];
    return { r, s, bs };
};

const cauto = dopo('MOVIMENTO CAUTO');
ok(cauto.r.dopo.marker === 'CAMO' && cauto.r.dopo.modMarker === -6,
   `Hidden -> Movimento Cauto: resta Camuffato a -6 (${cauto.r.dopo.marker}, ${cauto.r.dopo.modMarker})`);
ok(cauto.s.hidden === false && cauto.s.camo === true, '... e il motore lo vede Marker, non piu` nascosto');
ok(cauto.bs && cauto.bs.ammesso === false, '... quindi non si spara: va Scoperto prima');
ok(mimDiscover(cauto.r.unitaAggiornata) === -6, '... e lo Scoprire prende il suo -6');

const bs = dopo('ATTACCO BS');
ok(bs.r.dopo.marker === null && bs.r.dopo.deployState === 'NORMAL',
   `controprova — Hidden -> ATTACCO BS: perde Hidden e Camuffato, è Modello (${bs.r.dopo.deployState})`);
ok(bs.s.hidden === false && bs.s.camo === false, '... e il motore non lo vede ne` nascosto ne` Marker');
ok(bs.bs && bs.bs.ammesso === true, '... quindi e` un bersaglio normale');

// La regola parla di "Abilita` Corta Base senza tiro", non solo del Cauto:
// l'Idle lo e`, e deve tenere il Marker come il Cauto.
const idle = dopo('IDLE');
ok(idle.r.dopo.marker === 'CAMO', 'Hidden -> Idle (Corta Base senza tiro): resta Camuffato');

// Senza una skill da Marker non c'e` niente da tenere: il Cauto piazza il modello.
const senzaCamo = M.statoDopoAbilita(
    Object.assign(profilo('Alguacil (Combi Rifle)'), { deployState: 'HIDDEN', states: { hidden: true } }), 'MOVIMENTO CAUTO', {});
ok(senzaCamo.dopo.marker === null && senzaCamo.dopo.deployState === "NORMAL",
   'controprova — un nascosto senza Camouflage che fa Movimento Cauto non diventa Marker');

// L'unita` passata non si tocca.
const origine = spHidden(); const foto = JSON.stringify(origine);
M.statoDopoAbilita(origine, 'ATTACCO BS', {});
ok(JSON.stringify(origine) === foto, 'statoDopoAbilita non modifica l\'unita` passata');

// Il campo singolare `state` (motore 2026-09-21.27): se c'e`, segue deployState;
// se non c'e`, non viene aggiunto. Un campo che mente e` come e` nato il bug
// unit.state contro unit.states.
ok(bs.r.unitaAggiornata.state === bs.r.unitaAggiornata.deployState && cauto.r.unitaAggiornata.state === 'CAMO',
   `con il campo state presente: segue deployState (BS ${bs.r.unitaAggiornata.state}, Cauto ${cauto.r.unitaAggiornata.state})`);
const senzaState = profilo(SPEKTR, { deployState: 'HIDDEN', states: { hidden: true } }); delete senzaState.state;
ok(!('state' in M.statoDopoAbilita(senzaState, 'ATTACCO BS', {}).unitaAggiornata), 'senza il campo state: non viene aggiunto');

// Ogni esito cita la sua fonte.
ok(cauto.r.fonti.some(f => /1391[5-9]|13920/.test(f)) && bs.r.fonti.some(f => /13921/.test(f)),
   'gli esiti citano le righe del regolamento (' + cauto.r.fonti.join(', ') + ' / ' + bs.r.fonti.join(', ') + ')');

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
