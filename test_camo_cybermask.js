// @versione 2026-10-06.1 | test_camo_cybermask.js | proprieta`: chat MOTORE
// ============================================================================
//  RIENTRARE IN CAMO E CYBERMASK, DAL LATO MOTORE.
//
//  Punti 6-9 dell'elenco di MOTORE del 6 ottobre. La parte di SCHERMATA la
//  coprono i banchi di INTERFACCIA (test_voce_rientro_camo.js,
//  test_voce_cybermask.js): qui si misura il motore, cioe` l'esito delle due
//  funzioni date le risposte alle domande.
//
//  LA FORMA DELLE CHIAMATE, che l'elenco abbreviava:
//    M.rientraInCamo(unita, risposte, ctx)
//    M.attivaCybermask(unita, risposte, ctx)
//  `{ fuoriDallaLoF: false }` e `{ frenzyAttivo: true }` sono RISPOSTE, non
//  contesto: sono le risposte alle domande che il motore pone prima di
//  lasciar agire. Scritte nel posto sbagliato non danno errore — danno
//  NON_RISPOSTO, che e` un esito legittimo e passerebbe per un caso diverso.
//
//  PERCHE` LE CONTROPROVE SONO META` DEL BANCO
//  "fuoriDallaLoF false -> IDLE" da solo non distingue "ha letto la
//  risposta" da "finisce sempre in IDLE". Per ogni esito negato c'e` qui il
//  caso che riesce, e per ogni domanda c'e` il profilo a cui NON viene posta.
//
//  PROFILI: veri, dal database. L'Intruder (Hacker, Killer Hacking Device)
//  ha Camouflage e il programma Cybermask e nasce Marker; il Liberto ha
//  Camouflage e Frenzy, che e` l'unico modo di far comparire la domanda sul
//  Frenzy. Niente profili scritti a mano: una copia a mano e` sempre piu`
//  ordinata della realta`.
//
//  USO:  node test_camo_cybermask.js   |   CARTELLA=/percorso/ node ...
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

const TUTTI = [].concat(window.DB_NOMADI || [], window.DB_PANOCEANIA || []);
const copia = (u, extra) => Object.assign(JSON.parse(J(u)), extra || {});

const intruderKHD = TUTTI.find(u => /^Intruder \(Hacker, Killer Hacking Device\)/.test(u.nome));
const liberto     = TUTTI.find(u => /^Liberto/.test(u.nome) && /FRENZY/i.test(String(u.skills)));

console.log('\n=== 0. I profili di prova esistono e hanno quello che serve ===');
ok(!!intruderKHD, 'Intruder (Hacker, Killer Hacking Device) nel database', intruderKHD && intruderKHD.nome);
ok(!!liberto, 'un Liberto con Camouflage e Frenzy nel database', liberto && liberto.nome);
ok(intruderKHD && /CAMOUFLAGE/i.test(String(intruderKHD.skills)) && M.haProgramma(intruderKHD, 'CYBERMASK'),
   'l Intruder ha Camouflage E il programma Cybermask');
ok(liberto && /CAMOUFLAGE/i.test(String(liberto.skills)) && /FRENZY/i.test(String(liberto.skills)),
   'il Liberto ha Camouflage E Frenzy');

// Un Modello rivelato: il profilo nasce Marker, e per rientrare in CAMO deve
// essere fuori dalla forma di Marker. `states` esplicito vince sul
// predefinito del profilo (M.statoBersaglio), cosi` non serve ripulire.
const rivelato = () => copia(intruderKHD, { deployState: 'NORMAL', state: 'ACTIVE', states: { camo: false, imp: false } });
const marker   = () => copia(intruderKHD, { deployState: 'CAMO', state: 'CAMO', states: { camo: true } });

console.log('\n=== 1. Punto 6: rientro in CAMO dentro la LoF -> IDLE ===');
let u = rivelato();
let r = M.rientraInCamo(u, { fuoriDallaLoF: false });
ok(r.esito === 'IDLE', `esito IDLE (${r.esito})`, { esito: r.esito, motivo: r.motivo });
ok(r.ordineSpeso === true, `l Ordine e speso comunque (${r.ordineSpeso})`);
ok(r.generaAro === true, `e genera ARO (${r.generaAro})`);
ok(r.rientra === false, `ma NON rientra in CAMO (${r.rientra})`);
ok(String((r.unitaAggiornata || {}).deployState || 'NORMAL').toUpperCase() === 'NORMAL',
   `e il deployState resta quello di prima (${(r.unitaAggiornata || {}).deployState})`);

console.log('\n=== 2. CONTROPROVA: fuori dalla LoF il rientro riesce ===');
// Senza questa, "IDLE" non distingue "ha letto la risposta" da "finisce
// sempre in IDLE": un motore che ignorasse la domanda darebbe gli stessi
// cinque verdi di sopra.
let r2 = M.rientraInCamo(rivelato(), { fuoriDallaLoF: true });
ok(r2.rientra === true, `fuori dalla LoF: rientra (${r2.rientra})`, { esito: r2.esito, motivo: r2.motivo });
ok(String((r2.unitaAggiornata || {}).deployState).toUpperCase() === 'CAMO',
   `e il deployState diventa CAMO (${(r2.unitaAggiornata || {}).deployState})`);
ok(r2.esito !== 'IDLE', `l esito non e IDLE (${r2.esito})`);

console.log('\n=== 3. CONTROPROVA: senza risposta non si inventa un esito ===');
// "Assente non e` vuoto": non rispondere non vale come rispondere no.
let r3 = M.rientraInCamo(rivelato(), {});
ok(r3.esito === 'NON_RISPOSTO' && r3.incompleto === true,
   `senza risposte: NON_RISPOSTO, incompleto (${r3.esito})`, { esito: r3.esito, mancanti: r3.mancanti });
ok(Array.isArray(r3.mancanti) && r3.mancanti.length >= 1,
   `e dice quale risposta manca (${J(r3.mancanti)})`);

console.log('\n=== 4. Punto 6: con il Frenzy attivo e VIETATO ===');
const lib = () => copia(liberto, { deployState: 'NORMAL', state: 'ACTIVE', states: { camo: false, imp: false } });
let rf = M.rientraInCamo(lib(), { fuoriDallaLoF: true, frenzyAttivo: true });
ok(rf.esito === 'VIETATO', `esito VIETATO (${rf.esito})`, { esito: rf.esito, motivo: rf.motivo });
ok(rf.ordineSpeso === false, `e l Ordine NON e speso (${rf.ordineSpeso})`);
ok(rf.rientra === false, `e non rientra (${rf.rientra})`);
// CONTROPROVA: lo stesso Liberto, Frenzy NON attivo, rientra. Il divieto sta
// nella risposta, non nel profilo.
let rf2 = M.rientraInCamo(lib(), { fuoriDallaLoF: true, frenzyAttivo: false });
ok(rf2.rientra === true, `col Frenzy non attivo lo stesso Liberto rientra (${rf2.rientra})`,
   { esito: rf2.esito, motivo: rf2.motivo });
// CONTROPROVA: a chi non ha il Frenzy la domanda non viene nemmeno posta.
const domandeDi = (unita) => (M.puoRientrareInCamo(unita).domande || []).map(d => d.id);
ok(domandeDi(lib()).indexOf('frenzyAttivo') >= 0,
   `al Liberto si chiede del Frenzy (${J(domandeDi(lib()))})`);
ok(domandeDi(rivelato()).indexOf('frenzyAttivo') < 0,
   `all Intruder, che non ha Frenzy, no (${J(domandeDi(rivelato()))})`);

console.log('\n=== 5. Punto 7: Cybermask dentro la LoF -> IDLE, e non entra in IMP-2 ===');
let c = M.attivaCybermask(rivelato(), { fuoriDallaLoF: false });
ok(c.esito === 'IDLE', `esito IDLE (${c.esito})`, { esito: c.esito, motivo: c.motivo });
ok(c.entra === false, `non entra in Impersonation (${c.entra})`);
ok(String((c.unitaAggiornata || {}).deployState || 'NORMAL').toUpperCase() !== 'IMP_2',
   `e il deployState non diventa IMP-2 (${(c.unitaAggiornata || {}).deployState})`);
ok(c.ordineSpeso === true, `l Ordine e speso (${c.ordineSpeso})`);
// CONTROPROVA: fuori dalla LoF entra, e li` IMP_2 compare.
let c2 = M.attivaCybermask(rivelato(), { fuoriDallaLoF: true });
ok(c2.entra === true && String((c2.unitaAggiornata || {}).deployState).toUpperCase() === 'IMP_2',
   `fuori dalla LoF entra in IMP-2 (${c2.entra}, ${(c2.unitaAggiornata || {}).deployState})`,
   { esito: c2.esito, motivo: c2.motivo });

console.log('\n=== 6. Punto 8: un Marker CAMO puo usare il Cybermask ===');
const pm = M.puoUsareCybermask(marker());
ok(pm.puo === true, `puo (${pm.puo})`, { motivo: pm.motivo, blocchi: pm.blocchi });
ok(pm.daCamo === true, `e il motore dice che viene dal CAMO (${pm.daCamo})`);
// CONTROPROVA: un Modello puo, ma daCamo e false. Il campo guarda lo stato,
// non e` acceso per tutti.
const pr = M.puoUsareCybermask(rivelato());
ok(pr.puo === true && pr.daCamo === false,
   `un Modello puo, e daCamo e false (${pr.puo}, ${pr.daCamo})`, { motivo: pr.motivo });

console.log('\n=== 7. Punto 8: lo stato dopo il Cybermask, e la nota sul Mimetism ===');
const sd = M.statoDopoAbilita(marker(), 'CYBERMASK');
ok(sd && sd.dopo && String(sd.dopo.deployState).toUpperCase() === 'NORMAL',
   `dopo il Cybermask il Marker CAMO e NORMAL (${sd && sd.dopo && sd.dopo.deployState})`, sd && sd.dopo);
const note = [].concat(sd && sd.note || []).join(' | ');
// La frase, non la parola: "Mimetism" da solo comparirebbe anche in una nota
// scritta per un altro motivo, e un verde su una regex troppo larga e` un
// verde che non sa cosa ha letto. Verificato il 6 ottobre: la frase sta nella
// seconda nota, "perde il MOD del Mimetism (NFB)".
ok(/perde il MOD del Mimetism/i.test(note),
   `e la nota dice che perde il MOD del Mimetism (${note.length} caratteri di note)`);
// CONTROPROVA: un Modello che usa il Cybermask non ha niente da perdere dal
// Mimetism di un Marker, e quella frase non c'e`.
const noteModello = [].concat((M.statoDopoAbilita(rivelato(), 'CYBERMASK') || {}).note || []).join(' | ');
ok(!/perde il MOD del Mimetism/i.test(noteModello),
   `e a un Modello quella frase non viene detta (${noteModello.slice(0, 60) || 'nessuna nota'})`);

console.log('\n=== 8. Punto 8: un Marker IMP-2 NON puo, e non viene rivelato ===');
const imp2 = copia(intruderKHD, { deployState: 'IMP_2', state: 'ACTIVE', states: { imp: true, camo: false } });
const pi = M.puoUsareCybermask(imp2);
ok(pi.puo === false, `non puo (${pi.puo})`, { motivo: pi.motivo });
ok(/Impersonation/i.test(String(pi.motivo)), `e il motivo è l Impersonation (${pi.motivo})`);
const ci = M.attivaCybermask(imp2, { fuoriDallaLoF: true });
ok(ci.esito === 'NON_DISPONIBILE', `l azione non e disponibile (${ci.esito})`);
ok(String((ci.unitaAggiornata || {}).deployState).toUpperCase() === 'IMP_2',
   `e non viene rivelato: resta IMP-2 (${(ci.unitaAggiornata || {}).deployState})`);

console.log('\n=== 9. Punto 9: Isolato — Cybermask no, rientro in CAMO si ===');
// L'asimmetria E` il punto: l'Isolato spegne cio` che e` Comms, e il
// Cybermask e` un programma di Hacking; rientrare in CAMO non lo e`.
const isolatoMarker = copia(intruderKHD, { deployState: 'NORMAL', state: 'ACTIVE',
    states: { camo: false, imp: false, isolated: true } });
const pcIso = M.puoUsareCybermask(isolatoMarker);
const prIso = M.puoRientrareInCamo(isolatoMarker);
ok(pcIso.puo === false, `Isolato: Cybermask NO (${pcIso.puo})`, { motivo: pcIso.motivo });
ok(prIso.puo === true, `Isolato: rientro in CAMO SI (${prIso.puo})`, { motivo: prIso.motivo, blocchi: prIso.blocchi });
// CONTROPROVA: senza Isolato il Cybermask si puo. Altrimenti il "no" di
// sopra potrebbe venire da qualunque altra cosa di quel profilo.
ok(M.puoUsareCybermask(rivelato()).puo === true,
   'e senza Isolato lo stesso profilo il Cybermask lo puo usare');

console.log('\n=== 10. Il nome dell azione: canonico o ignorato in silenzio ===');
// Trovato il 6 ottobre provando a rompere il punto 9. La lista vietaAzioni
// di uno Stato confronta i nomi con M.azioneCanonica: un nome NON canonico
// non da` errore, viene semplicemente ignorato. Scrivere 'RIENTRO CAMO'
// invece di 'RIENTRARE IN CAMO' in un catalogo produce un divieto che non
// vieta niente e non si lamenta — la famiglia di difetti che inseguiamo.
// Questa prova sta qui perche` e` qui che qualcuno andra` a leggere.
ok(M.azioneCanonica(M.AZIONI.RIENTRO_CAMO) === 'RIENTRARE IN CAMO',
   `il nome canonico e quello del vocabolario: ${M.azioneCanonica(M.AZIONI.RIENTRO_CAMO)}`);
ok(M.azioneCanonica('RIENTRO CAMO') === null,
   `'RIENTRO CAMO' NON e un nome: azioneCanonica da null (${J(M.azioneCanonica('RIENTRO CAMO'))})`);
ok(M.azioneCanonica('CYBERMASK') === 'CYBERMASK',
   `'CYBERMASK' invece è canonico (${M.azioneCanonica('CYBERMASK')})`);

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
