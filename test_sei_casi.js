// @versione 2026-10-09.1 | test_sei_casi.js | proprieta`: chat TEST
// I SEI CASI CHE NESSUNO AVEVA MISURATO — node test_sei_casi.js
//
// Elencati da MOTORE come scoperti il 6 ottobre:
//   1. Total Control contro un bersaglio che non e` un TAG
//   2. Ordine Coordinato con un SALTO: la Copertura negata a TUTTI
//   3. Cybermask e Rientro in CAMO: l'Ordine speso e l'ARO del reattivo
//   4. Ingresso in campo e Trincerarsi
//   5. Schieramento Nascosto: non bersagliabile, ma puo` rivelarsi
//   6. Successo automatico: una parola, due significati
//
// AVVERTENZA ONESTA. I valori dichiarati da MOTORE per questi sei casi non
// li ho sotto gli occhi: l'allegato che li portava non e` piu` nella mia
// memoria di lavoro. Tutti i numeri scritti qui sono MISURATI da me sul
// motore 2026-10-06.14 e vanno confrontati con quelli dichiarati. Dove la
// misura non coincide con l'attesa di MOTORE, il banco e` da girare: non
// e` detto che sia il motore a sbagliare.
//
// LE QUATTRO FIRME CHE INGANNAVANO. Scrivendo questo banco ho sbagliato la
// chiamata quattro volte, e ogni volta il motore rispondeva un numero
// PLAUSIBILE invece di un errore: la specie peggiore di difetto, perche` la
// schermata sembra sana. SEGNALATO a MOTORE il 6 ottobre e CORRETTO nella
// .16 — i ripari hanno un contratto, e la sezione 7 lo misura. Le firme
// canoniche restano queste:
//   M.modAttacco(att, dif, arma, AZIONE, ctx)        azione POSIZIONALE
//   M.bersagliValidi(az, cand, { programma: NOME })  NOME (oggetto: .nome)
//   M.rientraInCamo(unita, RISPOSTE, ctx)            oggetto di risposte
//   M.risolviTrincerarsi(unita, BOOLEANO)            booleano, oppure
//                                                    { spazioSufficiente }

const CARTELLA = process.env.CARTELLA || __dirname;
const path = require('path');
global.window = global;
let passati = 0, falliti = 0;
function ok(c, n, e) {
    if (c) { passati++; console.log(`  ✅ ${n}`); }
    else { falliti++; console.log(`  ❌ ${n}${e ? '\n       ' + e : ''}`); }
}
const P = (f) => path.join(CARTELLA, f);
require(P('catalogo_n5.js'));
require(P('database_comune.js'));
const M = require(P('motore_regole_n5.js'));

// Il motivo si legge con String(): quando il bersaglio e` ammesso il campo
// e` null, e un .slice() su null farebbe CADERE il banco invece di farlo
// diventare rosso — porterebbe via le prove che restano.
const perche = (g) => String((g && g.motivo) || '');

// ==================================================================
// CASO 1. TOTAL CONTROL CONTRO UN BERSAGLIO CHE NON E` UN TAG
//   "an enemy TAG, or a TAG in Possessed State" (riga 5286).
//   Il filtro sta in M.bersagliValidi, ramo HACKING.
// ==================================================================
console.log('\n=== CASO 1. Total Control: solo contro i TAG ===');

const interventor = { id: 'h1', alias: 'Interventor', wip: 14, bts: 6,
                      equip: 'Hacking Device Plus', skills: 'Hacking', states: {} };
const tagNemico   = { id: 'b1', alias: 'Szalamandra', tipo: 'TAG', bts: 6, wip: 13, states: {} };
const tagPosseduto = { id: 'b5', alias: 'Iguana', tipo: 'TAG', bts: 6, wip: 13, states: { possessed: true } };
const hiHacker    = { id: 'b2', alias: 'Orc Hacker', tipo: 'HI', bts: 6, wip: 13, states: {}, equip: 'Hacking Device' };
const rem         = { id: 'b3', alias: 'Pathfinder', tipo: 'REM', bts: 3, wip: 12, states: {} };
const liNuda      = { id: 'b4', alias: 'Fusilier', tipo: 'LI', bts: 0, wip: 13, states: {} };

// FIRMA: `programma` e` il NOME, una stringa. Fino alla .15 passandogli
// l'oggetto del catalogo diventava "[OBJECT OBJECT]", nessuna restrizione
// combaciava, e OGNI programma risultava ammesso su OGNI bersaglio: il 6
// ottobre ho creduto per un quarto d'ora che il motore non applicasse il
// soloTAG. Dalla .16 l'oggetto e` accettato (legge .nome) e un oggetto
// senza .nome alza chiamataSbagliata — misurato nella sezione 7.
// L'app passa window.currentOrder.weapon, che e` la stringa: giusta.
const giudizio = (prog, bers) =>
    M.bersagliValidi(M.AZIONI.HACKING, [bers], { attaccante: interventor, programma: prog })[0];

const tc = (b) => giudizio('TOTAL CONTROL', b);
ok(tc(tagNemico).ammesso, 'un TAG nemico è bersaglio ammesso del Total Control');
ok(!tc(hiHacker).ammesso && /solo contro i TAG/.test(perche(tc(hiHacker))),
   `una HI con Hacking Device è fuori, e il motivo lo dice (${perche(tc(hiHacker))})`);
ok(!tc(rem).ammesso && /solo contro i TAG/.test(perche(tc(rem))),
   'e anche una REM: hackerabile sì, TAG no');

// 🔴 Il TAG POSSEDUTO e` ammesso ANCHE se e` proprio: ogni salvezza
// fallita gli cancella il Posseduto (righe 5292-5295). Prima si
// ammettevano solo i TAG nemici e un proprio TAG posseduto non si
// poteva liberare.
ok(tagPosseduto.states.possessed === true, 'il TAG di controllo è davvero in Stato Posseduto');
ok(tc(tagPosseduto).ammesso,
   'un TAG Posseduto è ammesso: il Total Control serve anche a liberarlo');
const noteTP = ((tc(tagPosseduto) || {}).note || []).join(' ');
ok(/Posseduto/.test(noteTP) && /cancella/.test(noteTP),
   `e la nota spiega perché: ${noteTP.slice(0, 70)}…`);

// CONTROPROVE. Senza queste, "la HI è fuori" non distingue "il
// Total Control la rifiuta" da "quella HI non è hackerabile affatto".
console.log('\n--- CONTROPROVE del caso 1 ---');
ok(giudizio('CARBONITE', hiHacker).ammesso && giudizio('CARBONITE', rem).ammesso,
   'la STESSA HI e la STESSA REM sono bersagli validi del Carbonite: il rifiuto è del programma');
ok(!giudizio('CARBONITE', liNuda).ammesso &&
   /hackerabile/.test(perche(giudizio('CARBONITE', liNuda))),
   `una LI nuda non è hackerabile da nessun programma d attacco (${perche(giudizio('CARBONITE', liNuda))})`);
ok(giudizio('SPOTLIGHT', liNuda).ammesso,
   'tranne lo SPOTLIGHT, che è l unico a passare sopra al requisito di hackerabilità');
ok(!giudizio('TRINITY', tagNemico).ammesso &&
   /solo Hacker nemici/.test(perche(giudizio('TRINITY', tagNemico))),
   'e il Trinity fa il contrario: rifiuta il TAG perché non è un Hacker');
// Il Marker viene prima di tutto: un Attacco Comms non lo raggiunge.
const tagCamo = { id: 'b6', alias: 'Szalamandra', tipo: 'TAG', bts: 6, wip: 13,
                  deployState: 'CAMO', states: { camo: true } };
ok(!tc(tagCamo).ammesso && /Scoperto/.test(perche(tc(tagCamo))),
   `un TAG in forma di Marker va Scoperto prima (${perche(tc(tagCamo)).slice(0, 55)}…)`);

// ==================================================================
// CASO 2. ORDINE COORDINATO CON UN SALTO
//   "the Trooper does not benefit from Partial Cover" (righe 2762-2763).
//   In un Coordinato hanno dichiarato tutti la stessa Abilita`: la
//   Copertura e` negata a TUTTI, non al primo.
// ==================================================================
console.log('\n=== CASO 2. Coordinato col SALTO: Copertura negata a tutti ===');

const alguacil = { id: 'a1', alias: 'Alguacil', bs: 11, ph: 11, arm: 1, states: {}, weapon: 'Combi Rifle' };
const moran    = { id: 'a2', alias: 'Moran',    bs: 11, ph: 11, arm: 1, states: {}, weapon: 'Combi Rifle' };
const fusilier = { id: 'r1', alias: 'Fusilier', bs: 12, ph: 10, arm: 1, states: {}, weapon: 'Combi Rifle' };
const trovaC2 = (n) => [alguacil, moran, fusilier].find(u =>
    M.nomeUnita(u).toUpperCase() === String(M.nomeUnita(n) || n).toUpperCase()) || null;

const reazioneSu = (chi) => [{ nome: 'Fusilier', difensore: fusilier, azione: 'BS_ATTACK',
    arma: 'Combi Rifle', bersaglio: chi, burst: 3, rangeIndex: 1, cover: true }];
const coordinato = (azioni, chi) => (M.risolviPayload(
    { azioniDichiarate: azioni, attivi: [alguacil, moran], attacchi: [] },
    reazioneSu(chi), { trovaUnita: trovaC2 }) || [])[0];

// La tabella del catalogo, prima: senza questa, "negata" non si
// distingue da "negata sempre".
console.log('\n--- la tabella delle azioni ---');
ok(M.coperturaNegataDaAzioni(['SALTO']).negata === true,
   'SALTO: la Copertura è negata per tutto l Ordine');
ok(M.coperturaNegataDaAzioni(['SALTO']).riga === '2762-2763',
   `con la riga del regolamento (${M.coperturaNegataDaAzioni(['SALTO']).riga})`);
ok(M.coperturaNegataDaAzioni(['INGRESSO IN CAMPO']).negata === true,
   'anche l INGRESSO IN CAMPO la nega');
ok(M.coperturaNegataDaAzioni(['ATTACCO BS']).negata === false,
   'CONTROPROVA: un ATTACCO BS non la nega — non è un campo sempre acceso');
const arr = M.coperturaNegataDaAzioni(['ARRAMPICARSI']);
ok(arr.negata === false && arr.note.length === 1,
   'ARRAMPICARSI è il caso intermedio: non negata per l Ordine, ma una nota a chi tira');
ok(M.coperturaNegataDaAzioni(['SALTO', 'ATTACCO BS']).negata === true,
   'e un SALTO dichiarato insieme ad altro resta negante');

console.log('\n--- e lo scontro la porta, su CIASCUNO degli attivi ---');
const sPrimo = coordinato(['SALTO'], 'Alguacil');
const sSecondo = coordinato(['SALTO'], 'Moran');
// Il campo si legge con un lettore che non cade: quando la Copertura NON
// e` negata, `coperturaNegata` e` undefined, e un accesso diretto
// FAREBBE CADERE il banco invece di farlo diventare rosso — porterebbe
// via le prove che restano. Visto il 6 ottobre rompendo di proposito la
// lettura degli attivi del Coordinato: il banco moriva muto alla prova 2.
const cn = (s) => ((s || {}).coperturaNegata) || {};
ok(cn(sPrimo).azione === 'SALTO',
   `reazione contro il PRIMO attivo: lo scontro porta coperturaNegata (${cn(sPrimo).azione})`);
ok(cn(sSecondo).azione === 'SALTO',
   `reazione contro il SECONDO attivo: la porta anche lì — a tutti, non al primo (${cn(sSecondo).azione})`);
ok(cn(sSecondo).dichiarataEIgnorata === true,
   'e dice che la Copertura dichiarata nella reazione è stata IGNORATA, non dimenticata');
ok(cn(sSecondo).riga === '2762-2763',
   `con la riga, perché al tavolo si contesta (${cn(sSecondo).riga})`);
const noteS = (sSecondo.note || []).join(' ').normalize('NFC');
// I testi del motore hanno gli accenti DECOMPOSTI (e + U+0300): senza
// .normalize('NFC') /è/ è falso su un testo che si legge identico.
ok(/NON beneficia della Copertura Parziale/.test(noteS),
   'la nota spiega al giocatore cosa non si applica');
ok(/NON è stata applicata/.test(noteS),
   'e che la copertura dichiarata è stata scartata');

console.log('\n--- CONTROPROVA: la stessa busta senza SALTO ---');
const senza = coordinato(['ATTACCO BS'], 'Moran');
ok(senza && senza.coperturaNegata === undefined && !cn(senza).azione,
   'nessun SALTO, nessun campo coperturaNegata: non è un campo sempre presente');
ok(senza && !/NON beneficia della Copertura/.test((senza.note || []).join(' ').normalize('NFC')),
   'e nessuna nota sulla copertura negata');

// ==================================================================
// CASO 3. CYBERMASK E RIENTRO IN CAMO
//   Due Long Skill con un REQUISITO che il motore non puo` vedere (la
//   Linea di Tiro). La domanda va al giocatore, e le tre risposte
//   portano a tre esiti diversi. Il punto che nessuno aveva misurato:
//   anche quando il requisito FALLISCE l'Ordine e` speso e la truppa
//   genera ARO.
// ==================================================================
console.log('\n=== CASO 3. Cybermask e Rientro in CAMO: l Ordine è speso comunque ===');

const hacker3 = { id: 'h1', alias: 'Interventor', wip: 14, bts: 6,
                  equip: 'Hacking Device Plus', skills: 'Hacking', states: {} };
const spektr  = { id: 'c1', alias: 'Spektr', tipo: 'LI',
                  skills: 'Camouflage, CH: Camouflage', states: {} };

// FIRMA: rientraInCamo(unita, RISPOSTE, ctx) e attivaCybermask idem —
// il secondo argomento e` un OGGETTO di risposte per id, non un
// booleano. Il fratello risolviTrincerarsi (caso 4) vuole invece un
// booleano secco: due firme diverse per la stessa famiglia di domande.
console.log('\n--- il requisito e le tre risposte ---');
const preCy = M.puoUsareCybermask(hacker3, {});
ok(preCy.puo === true, 'un Hacker con Hacking Device Plus può usare il Cybermask');
ok(preCy.tipo === 'LONG_SKILL', `ed è una Long Skill (${preCy.tipo})`);
const domCy = preCy.domande || [];
ok(domCy.length === 1 && (domCy[0] || {}).id === 'fuoriDallaLoF',
   `con UNA domanda al giocatore: fuori dalla Linea di Tiro? (${domCy.length})`);
ok((domCy[0] || {}).blocca === true && (domCy[0] || {}).seBloccata === 'IDLE',
   'e la risposta sbagliata porta a un IDLE, non a un ordine annullato');

for (const [et, risp, atteso] of [
        ['NON RISPOSTO', {}, 'NON_RISPOSTO'],
        ['SI', { fuoriDallaLoF: true }, 'ENTRA'],
        ['NO', { fuoriDallaLoF: false }, 'IDLE']]) {
    const r = M.attivaCybermask(hacker3, risp, {});
    ok(r.esito === atteso, `Cybermask, risposta ${et} -> esito ${atteso} (ottenuto ${r.esito})`);
}

console.log('\n--- l Ordine speso e l ARO: il punto non misurato ---');
const cyNo = M.attivaCybermask(hacker3, { fuoriDallaLoF: false }, {});
ok(cyNo.entra === false, 'requisito fallito: l Hacker NON entra in IMP-2');
ok(cyNo.ordineSpeso === true, 'ma l Ordine è SPESO');
ok(cyNo.generaAro === true, 'e la truppa è stata ATTIVATA: genera ARO');
const noteCyNo = (cyNo.note || []).join(' ').normalize('NFC');
ok(/Ordine è comunque speso/.test(noteCyNo), 'e lo dice al giocatore');
ok(/Disposable/.test(noteCyNo), 'insieme alle munizioni Disposable spese comunque');
ok(/RIVELATA/.test(noteCyNo), 'e al Marker che viene rivelato');

const cyNonRisp = M.attivaCybermask(hacker3, {}, {});
ok(cyNonRisp.ordineSpeso === false && cyNonRisp.generaAro === false,
   'CONTROPROVA: senza risposta l Ordine NON è speso e nessun ARO — NON RISPOSTO non è un no');
ok(cyNonRisp.incompleto === true &&
   (cyNonRisp.mancanti || []).join(',') === 'fuoriDallaLoF',
   `e il motore dice quale risposta manca (${(cyNonRisp.mancanti || []).join(',')})`);

console.log('\n--- e quando entra: lo stato, non il tiro ---');
const cySi = M.attivaCybermask(hacker3, { fuoriDallaLoF: true }, {});
const statiCy = ((cySi.unitaAggiornata || {}).states) || {};
ok(cySi.entra === true && statiCy.impersonation === true,
   'risposta SI: entra in IMP-2 (stato impersonation)');
ok(statiCy.camo === false,
   'e il CAMO viene spento: sono due stati diversi, non si sommano');
const noteCySi = (cySi.note || []).join(' ').normalize('NFC');
ok(/Nessun tiro/.test(noteCySi), 'nessun tiro: il Cybermask non si contende');
ok(/Fireteam/.test(noteCySi), 'e chi entra in Impersonation lascia la Fireteam');
ok(hacker3.states.impersonation === undefined,
   'CONTROPROVA: l unità ORIGINALE non è stata toccata — il motore ne restituisce una copia');

console.log('\n--- il Rientro in CAMO: stessa forma, altro stato ---');
const rcSi = M.rientraInCamo(spektr, { fuoriDallaLoF: true }, {});
ok(rcSi.rientra === true && (((rcSi.unitaAggiornata || {}).states) || {}).camo === true,
   'risposta SI: rientra in Stato CAMO');
const noteRc = (rcSi.note || []).join(' ').normalize('NFC');
ok(/NON conta come lo stesso Marker/.test(noteRc),
   'e la nota avvisa che chi aveva fallito lo Scoprire può ritentare');
const rcNo = M.rientraInCamo(spektr, { fuoriDallaLoF: false }, {});
ok(rcNo.rientra === false && rcNo.ordineSpeso === true && rcNo.generaAro === true,
   'requisito fallito: non rientra, Ordine speso, ARO generato — come il Cybermask');
ok(M.rientraInCamo(spektr, {}, {}).esito === 'NON_RISPOSTO',
   'CONTROPROVA: anche qui NON RISPOSTO è un terzo esito');
ok(Object.keys(spektr.states).length === 0,
   'e nemmeno qui l unità originale viene toccata');

// ==================================================================
// CASO 4. INGRESSO IN CAMPO E TRINCERARSI
//   Due Abilita` con un requisito che vive sul tavolo, non nei dati.
//   Le due facce opposte: l'Ingresso in campo VIETA (scegli un altro
//   punto), il Trincerarsi fa un IDLE (l'Ordine e` perso).
// ==================================================================
console.log('\n=== CASO 4. Ingresso in campo e Trincerarsi ===');

const paracadutista = { id: 'p1', alias: 'Hardcase', bs: 11, ph: 11, wip: 12,
                        states: {}, skills: 'Parachutist (Deployment)' };
const zapatore = { id: 't1', alias: 'Zapatore', bs: 11, ph: 11, states: {}, skills: 'Sapper' };
const senzaSapper = { id: 't2', alias: 'Alguacil', bs: 11, ph: 11, states: {} };

console.log('\n--- Ingresso in campo: si tira su PH, e la Copertura è negata ---');
const ing = M.regoleIngressoInCampo(paracadutista, {});
ok(ing.valido === true, 'un Parachutist (Deployment) può entrare in campo');
ok(ing.attributo === 'PH' && ing.base === 11,
   `si tira sul PH della truppa: ${ing.attributo} ${ing.base}`);
ok(ing.mod === 0 && ing.valore === 11, `nessun MOD: valore ${ing.valore}`);
const divieti = ing.divieti || [];
// 🔴 GIRATA IL 9 OTTOBRE: erano cinque, ora sono SEI (il sesto e` del Combat
// Jump, righe 12755-12758). Il conteggio resta, ma accanto alle parole: cosi`
// un divieto SOSTITUITO da un altro — che lascia il numero fermo — non passa.
ok(divieti.length === 6,
   `sei divieti sul punto di atterraggio (${divieti.length})`);
ok(divieti.some(d => /Prono/.test(d)) && divieti.some(d => /edifici/.test(d)),
   'fra cui il Prono e gli interni degli edifici');
ok(divieti.some(d => /Combat Jump/i.test(d) && /Visibilit/i.test(d)),
   `e il sesto: col Combat Jump niente aree a Visibilita` + ` Bassa, Pessima o Zero (${(divieti.find(d => /Combat Jump/i.test(d)) || 'assente').slice(0, 50)})`);
const cnIng = ing.coperturaNegata || {};
ok(cnIng.negata === true,
   'e l Ingresso in campo NEGA la Copertura Parziale per tutto l Ordine');
// Qui si chiude il cerchio col caso 2: la stessa tabella, due strade.
ok(cnIng.azione === 'INGRESSO IN CAMPO' &&
   cnIng.riga === M.coperturaNegataDaAzioni(['INGRESSO IN CAMPO']).riga,
   `ed è la STESSA voce che legge risolviPayload: le due strade concordano (${cnIng.riga})`);

const domIng = M.domandeIngressoInCampo(paracadutista, {});
ok(domIng.length === 1 && domIng[0].id === 'puntoValido',
   'una domanda sola al giocatore: il punto rispetta i divieti?');
ok(domIng[0].seBloccata === 'VIETA',
   `e la risposta NO VIETA (${domIng[0].seBloccata}): si sceglie un altro punto, l Ordine non è perso`);

console.log('\n--- Trincerarsi: l altra faccia, qui l Ordine si perde ---');
// FIRMA: risolviTrincerarsi(unita, BOOLEANO). Fino alla .15 l'oggetto di
// risposte ({ spazioSufficiente: true }) veniva letto come "non risposto"
// e il motore rispondeva "manca la risposta": una frase sensata per una
// chiamata sbagliata. Dalla .16 quell'oggetto e` accettato, e un oggetto
// senza quel campo alza chiamataSbagliata — sezione 7.
const preTr = M.puoTrincerarsi(zapatore, {});
ok(preTr.puo === true, 'con l Abilità Sapper si può Trincerarsi');
ok(preTr.tipo === 'LONG_SKILL', `ed è una Long Skill (${preTr.tipo})`);
ok(/Idle/.test(String(preTr.seRequisitoFallisce)),
   'e il requisito fallito porta a un IDLE, non a un divieto');
ok(M.puoTrincerarsi(senzaSapper, {}).puo === false &&
   /Sapper/.test(String(M.puoTrincerarsi(senzaSapper, {}).motivo)),
   'CONTROPROVA: senza Sapper non si può, e il motivo lo nomina');

for (const [et, v] of [['undefined', undefined], ['null', null], ['stringa vuota', '']]) {
    const r = M.risolviTrincerarsi(zapatore, v);
    ok(r.entra === false && r.idle === false && r.incompleto === true,
       `${et} è NON RISPOSTO: non entra, non fa Idle, manca la risposta`);
}
const trSi = M.risolviTrincerarsi(zapatore, true);
ok(trSi.entra === true && trSi.stato === 'foxhole',
   'risposta SI: entra in Stato Foxhole');
ok(/Token/.test(String(trSi.token)), 'e il motore dice di piazzare il Token accanto alla truppa');
const trNo = M.risolviTrincerarsi(zapatore, false);
ok(trNo.entra === false && trNo.idle === true,
   'risposta NO: non entra, e fa un IDLE');
ok(trNo.generaAro === true, 'e quell Idle ATTIVA la truppa: genera ARO');
ok(/Ordine è comunque speso/.test((trNo.note || []).join(' ').normalize('NFC')),
   'con l avviso che l Ordine è comunque speso');
ok(M.risolviTrincerarsi(senzaSapper, true).entra === false,
   'CONTROPROVA: la risposta SI non basta se manca il Sapper');

// ==================================================================
// CASO 5. SCHIERAMENTO NASCOSTO
//   "does not affect LoF, is not affected by Template Weapons"
//   (regolamento p.94). Due cose distinte: non si bersaglia, e non lo
//   prende nemmeno una Sagoma, che non scegle un bersaglio ma un'area.
//   Ma puo` dichiarare: e` lui che decide di rivelarsi.
// ==================================================================
console.log('\n=== CASO 5. Schieramento Nascosto: non si bersaglia, ma si rivela ===');

const nascosto = { id: 'x1', alias: 'Spettro', tipo: 'LI', bs: 12, ph: 11,
                   states: { hidden: true }, weapon: 'Combi Rifle' };
const scoperto = { id: 'x2', alias: 'Fusilier', tipo: 'LI', bs: 12, ph: 10,
                   states: {}, weapon: 'Combi Rifle' };
const tiratore = { id: 'y1', alias: 'Granatiere', bs: 11, ph: 12, states: {}, weapon: 'Combi Rifle' };

const gN = M.bersagliValidi(M.AZIONI.BS_ATTACK, [nascosto], { attaccante: tiratore })[0];
ok(!gN.ammesso && /non è sul tavolo/.test(perche(gN).normalize('NFC')),
   `non è un bersaglio valido, e il motivo è che non è sul tavolo (${perche(gN).slice(0, 55)}…)`);
const gS = M.bersagliValidi(M.AZIONI.BS_ATTACK, [scoperto], { attaccante: tiratore })[0];
ok(gS.ammesso,
   'CONTROPROVA: la stessa LI senza lo stato hidden è bersaglio valido');

console.log('\n--- e la Sagoma, che non scegle un bersaglio ---');
const sagN = M.colpitoDaSagoma(nascosto);
ok(sagN.colpito === false, 'una Sagoma NON lo colpisce');
ok(/Hidden Deployment/.test(String(sagN.motivo)) && /p.94/.test(String(sagN.fonte)),
   `col motivo e la fonte (${sagN.fonte})`);
ok(M.colpitoDaSagoma(scoperto).colpito === true,
   'CONTROPROVA: la Sagoma colpisce chi è sul tavolo');
// Due funzioni, una regola: senza questa prova, la lista e il singolo
// potrebbero divergere senza che nessuno se ne accorga.
const sotto = M.bersagliSottoSagoma([nascosto, scoperto]);
ok(sotto.length === 2, 'bersagliSottoSagoma giudica tutti e due, non scarta in silenzio');
ok((sotto[0] || {}).colpito === false && (sotto[1] || {}).colpito === true,
   'e concorda con colpitoDaSagoma: le due strade dicono la stessa cosa');
ok(/Hidden Deployment/.test(String((sotto[0] || {}).motivo)) && (sotto[1] || {}).motivo === null,
   'il motivo c è dove serve e NON c è dove il bersaglio è colpito');

console.log('\n--- ma rivelarsi è una sua scelta: può dichiarare ---');
const aro = M.azioniAroPossibili(nascosto, {});
const ammessi = aro.filter(a => a.ammesso).map(a => a.id).sort().join(',');
ok(aro.length > 0, `il motore gli offre delle azioni in ARO (${aro.length})`);
ok(/BS_ATTACK/.test(ammessi),
   `fra cui l Attacco BS: chi è nascosto si rivela attaccando (ammessi: ${ammessi})`);
ok(/DODGE/.test(ammessi), 'e la Schivata');
const hackAro = aro.find(a => a.id === 'HACKING');
ok(hackAro && !hackAro.ammesso && /non è un hacker/i.test(String(hackAro.motivo).normalize('NFC')),
   'CONTROPROVA: non è un elenco che dice sì a tutto — l Hacking è negato col suo motivo');
// Il collegamento col caso 3: chi rientra in CAMO non deve contare i
// nascosti nella sua Linea di Tiro, finche` non si rivelano.
const domRc = M.puoRientrareInCamo({ id: 'c9', alias: 'Spektr', tipo: 'LI',
    skills: 'Camouflage, CH: Camouflage', states: {} }, {}).domande || [];
ok(domRc.length === 1 && /Schieramento Nascosto/.test(String((domRc[0] || {}).testo)),
   'e la domanda del rientro in CAMO lo dice al giocatore: i nascosti non contano');

// ==================================================================
// CASO 6. SUCCESSO AUTOMATICO: UNA PAROLA, DUE SIGNIFICATI
//   `automatico` nella busta vuol dire SAGOMA DIRETTA (colpo senza
//   tiro). Lo Scoprire automatico (Multispectral Visor L2+ contro un
//   Marker CAMO) usa la stessa parola per un'altra cosa: resta uno
//   Scoprire, non si tira, e lo dice `successoAutomatico`.
// ==================================================================
console.log('\n=== CASO 6. Successo automatico: una parola, due significati ===');

const zeroMsv = { id: 'a1', alias: 'Zero MSV', wip: 13, bs: 11, states: {},
                  equip: 'Multispectral Visor L2' };
const senzaVisore = { id: 'a2', alias: 'Fusilier', wip: 12, bs: 11, states: {} };
const markerCamo = { id: 'c1', alias: 'Spektr', tipo: 'LI', skills: 'Camouflage', states: { camo: true } };
const nonCamo = { id: 'c2', alias: 'Fusilier nemico', tipo: 'LI', states: {} };

const scoprire = (att, bers, reaz) => M.risolviScontro(
    { attaccante: att, attaccanteId: att.id, bersaglio: bers, azione: M.AZIONI.SCOPRIRE }, reaz || null, {});

console.log('\n--- lo Scoprire che riesce da solo ---');
ok(M.regoleScoprire(zeroMsv, markerCamo, {}).automatico === true,
   'Multispectral Visor L2 contro un Marker CAMO: lo Scoprire è automatico');
// Stesso riparo: `attivo` deve esserci, ma se il motore lo perdesse un
// accesso diretto ucciderebbe il resto del caso 6.
const att6 = (s) => (s || {}).attivo || {};
const sAuto = scoprire(zeroMsv, markerCamo);
ok(sAuto.titolo === 'SUCCESSO AUTOMATICO',
   `il titolo NON è "TIRO NORMALE" (${sAuto.titolo})`);
ok(att6(sAuto).mod === 'Auto', `e al posto del numero c è "Auto" (${att6(sAuto).mod})`);
ok(att6(sAuto).burst === 0, `con Burst 0: non si tira nessun dado (${att6(sAuto).burst})`);
ok(att6(sAuto).successoAutomatico === true, 'successoAutomatico: true');
ok(att6(sAuto).automatico === false,
   'e automatico: FALSE — è l altro significato, non una Sagoma');
ok(att6(sAuto).azione === M.AZIONI.SCOPRIRE,
   `l azione resta uno Scoprire (${att6(sAuto).azione})`);

console.log('\n--- se qualcuno reagisce, il suo tiro resta ---');
const sConAro = scoprire(zeroMsv, markerCamo, { difensore: markerCamo, azione: 'DODGE' });
ok(sConAro.titolo === 'TIRO NORMALE',
   `col reattivo il titolo torna "TIRO NORMALE" (${sConAro.titolo}): c è un dado in tavola, il suo`);
ok(att6(sConAro).successoAutomatico === true && att6(sConAro).burst === 0,
   'ma l attivo non tira comunque: successoAutomatico resta, Burst resta 0');
ok(String((sConAro.reattivo || {}).azione) === 'DODGE',
   `e la reazione è registrata (${(sConAro.reattivo || {}).azione})`);

console.log('\n--- CONTROPROVE: quando NON è automatico ---');
const sNudo = scoprire(senzaVisore, markerCamo);
ok(M.regoleScoprire(senzaVisore, markerCamo, {}).automatico === false,
   'senza visore lo Scoprire NON è automatico');
ok(sNudo.titolo === 'TIRO NORMALE' && att6(sNudo).mod === 12 && att6(sNudo).burst === 1,
   `e si tira davvero: WIP 12, un dado (titolo ${sNudo.titolo}, mod ${att6(sNudo).mod}, burst ${att6(sNudo).burst})`);
ok(att6(sNudo).successoAutomatico === false, 'successoAutomatico: false');
const sNonCamo = scoprire(zeroMsv, nonCamo);
ok(att6(sNonCamo).successoAutomatico === false && att6(sNonCamo).mod === 13,
   `e lo stesso visore su un bersaglio NON in CAMO tira: WIP 13 (mod ${att6(sNonCamo).mod})`);

console.log('\n--- l altro significato: la Sagoma diretta ---');
const lf = M.profiloArma('Light Flamethrower');
ok((M.regoleTemplate(lf) || {}).tiroPerColpire === false,
   'un Lanciafiamme non richiede un tiro per colpire: è una Sagoma diretta');
const sSagoma = M.risolviScontro({ attaccante: zeroMsv, attaccanteId: 'a1', bersaglio: nonCamo,
    azione: M.AZIONI.BS_ATTACK, arma: 'Light Flamethrower', automatico: true }, null, {});
ok(att6(sSagoma).azione === 'ATTACCO A SAGOMA',
   `qui l azione diventa ATTACCO A SAGOMA (${att6(sSagoma).azione})`);
ok(att6(sSagoma).automatico === true, 'automatico: true');
ok(att6(sSagoma).successoAutomatico === false,
   'e successoAutomatico: FALSE — le due parole non si confondono');
ok(att6(sSagoma).mod === 'Auto',
   'anche qui "Auto" al posto del numero: è il campo che le distingue, non il MOD');

// ==================================================================
// 7. I RIPARI DELLA .16 — quando la chiamata e` sbagliata
//   Le quattro firme che mi avevano ingannato sono state corrette da
//   MOTORE nella .16. Il riparo e` un contratto nuovo, e un contratto
//   che nessuno misura e` un contratto che si rompe in silenzio: fino
//   alla .15 questo banco documentava la trappola in COMMENTO, e un
//   commento non diventa rosso. Qui diventa rosso.
//   NESSUNO dei ripari solleva eccezioni, per scelta: M.bersagliValidi
//   e` chiamata dalla schermata ARO fuori da un try (logica_aro.js riga
//   911), e al tavolo un Hub che cade e` peggio di un numero sbagliato.
//   Perche` la prova valga, ogni riparo ha la sua CONTROPROVA: la
//   chiamata giusta, che deve restare pulita.
// ==================================================================
console.log('\n=== 7. I ripari della .16: una chiamata sbagliata si DICHIARA ===');

const hellcat = { id: 'n9', alias: 'Hellcat', bs: 12, ph: 12, wip: 13, states: {},
                  weapon: 'Grenades', skills: 'Hacking', equip: 'Hacking Device' };
// Il Mimetismo DAVVERO addosso: senza, "nessuna voce di mimetismo" sarebbe
// verde perche` il Mimetismo non c'e`, non perche` il ramo giusto l ha
// ignorato. Stessa trappola trovata il 6 ottobre nel banco Speculativo.
const crocMim = { id: 'p9', alias: 'Croc Man', tipo: 'LI', deployState: 'CAMO',
                  states: { camo: true }, skills: 'Mimetism (-3), Camouflage' };
const granate = M.profiloArma('Grenades');
const SPEC = M.AZIONI.SPECULATIVO;
const fonti = (r) => ((r || {}).voci || []).map(v => v.fonte).join(',');
const avvisiDi = (r) => ((r || {}).avvisi || [])
    .map(a => String(a.testo || a.messaggio || a)).join(' | ').normalize('NFC');

console.log('\n--- (a) M.modAttacco: tre modi di passare l azione, un solo risultato ---');
// Valori dichiarati da MOTORE: Hellcat (Hacker) con Grenades su Croc Man ->
// mod -3, voci [gittata, speculativo], nessun mimetismo, in tutte e tre.
const a1 = M.modAttacco(hellcat, crocMim, granate, SPEC, { rangeIndex: 0 });
const a2 = M.modAttacco(hellcat, crocMim, granate, { rangeIndex: 0, azione: SPEC });
const a3 = M.modAttacco(hellcat, crocMim, granate, undefined, { rangeIndex: 0, azione: SPEC });
ok(a1.mod === -3, `posizionale (la firma canonica): mod -3 (${a1.mod})`);
ok(a2.mod === -3, `ctx al QUARTO posto, azione dentro: mod -3 (${a2.mod})`);
ok(a3.mod === -3, `ctx al quinto, azione solo dentro: mod -3 (${a3.mod})`);
ok(fonti(a1) === 'gittata,speculativo' && fonti(a2) === fonti(a1) && fonti(a3) === fonti(a1),
   `e le stesse due voci in tutte e tre (${fonti(a1)})`);
ok(!/mimetismo/.test(fonti(a1) + fonti(a2) + fonti(a3)),
   'nessun Mimetismo in nessuna delle tre: il ramo dello Speculativo e` quello giusto');
ok(avvisiDi(a1) === '' && avvisiDi(a2) === '' && avvisiDi(a3) === '',
   'e nessun avviso: le tre forme sono tutte lecite');

// Il caso dell azione mancante: un AVVISO, non un eccezione, e il calcolo
// esce dal ramo generale — col Mimetismo applicato.
const a4 = M.modAttacco(hellcat, crocMim, granate, undefined, { rangeIndex: 0 });
ok(a4.mod === 0, `senza azione da nessuna parte il calcolo esce dal ramo generale: mod 0 (${a4.mod})`);
ok(/mimetismo/.test(fonti(a4)),
   `col Mimetismo applicato, che e` + ` il numero plausibile e sbagliato (${fonti(a4)})`);
// ATTENZIONE: l avviso e` una STRINGA, non un oggetto con .testo, e il
// testo scrive "non e` affidabile" col BACKTICK, non con l accento. Una
// regex sull accento e` falsa su un testo che a leggerlo e` identico —
// terza variante della stessa trappola, dopo gli accenti scomposti. Si
// cerca la parola, non la punteggiatura.
ok(/SENZA azione/.test(avvisiDi(a4)) && /non e.? affidabile/.test(avvisiDi(a4)),
   `ma ORA lo dice: 1 avviso che il calcolo non e` + ` affidabile (${avvisiDi(a4).slice(0, 60)}…)`);
ok(((a4.avvisi) || []).length === 1, `un avviso solo, non un diluvio (${((a4.avvisi) || []).length})`);
// Lo stesso con ctx al quarto posto senza azione: la scorciatoia non deve
// diventare un modo di perdere l avviso.
const a5 = M.modAttacco(hellcat, crocMim, granate, { rangeIndex: 0 });
ok(/SENZA azione/.test(avvisiDi(a5)),
   'e anche con ctx al quarto posto senza azione dentro l avviso c e');

console.log('\n--- (b) M.bersagliValidi: il programma come oggetto ---');
// Valori dichiarati da MOTORE: TOTAL CONTROL contro [Orc, TAG] -> per nome
// [false, true], per oggetto [false, true].
const orcHk = { id: 'b2', alias: 'Orc Hacker', tipo: 'HI', bts: 6, wip: 13, states: {}, equip: 'Hacking Device' };
const tagOk = { id: 'b1', alias: 'Szalamandra', tipo: 'TAG', bts: 6, wip: 13, states: {} };
const duePezzi = [orcHk, tagOk];
const progTC = M.programmiDisponibili(interventor).programmi.find(p => /total control/i.test(p.nome));
const esiti = (p) => M.bersagliValidi(M.AZIONI.HACKING, duePezzi,
    { attaccante: interventor, programma: p }).map(g => g.ammesso).join(',');
ok(progTC && progTC.nome === 'TOTAL CONTROL',
   `l oggetto del catalogo porta il nome nel campo .nome (${progTC && progTC.nome})`);
ok(esiti('TOTAL CONTROL') === 'false,true',
   `per NOME: l Orc fuori, il TAG dentro (${esiti('TOTAL CONTROL')})`);
ok(esiti(progTC) === 'false,true',
   `per OGGETTO: identico — il motore legge .nome (${esiti(progTC)})`);

// L oggetto SENZA nome: ogni candidato negato, chiamataSbagliata, e il
// motivo che nomina la funzione. Prima era il silenzio che mi aveva
// ingannato: ogni programma ammesso su ogni bersaglio.
const sbagliati = M.bersagliValidi(M.AZIONI.HACKING, duePezzi,
    { attaccante: interventor, programma: { tipo: 'ATTACCO', burst: 1 } });
ok(sbagliati.every(g => g.ammesso === false),
   `oggetto senza .nome: NESSUN candidato ammesso (${sbagliati.map(g => g.ammesso).join(',')})`);
ok(sbagliati.every(g => g.chiamataSbagliata === true),
   'e ciascuno porta chiamataSbagliata: true');
ok(/Chiamata sbagliata di M.bersagliValidi/.test(perche(sbagliati[0])),
   `col motivo che nomina la funzione (${perche(sbagliati[0]).slice(0, 55)}…)`);
// CONTROPROVA sul campo: chiamataSbagliata NON e` sempre acceso.
ok(M.bersagliValidi(M.AZIONI.HACKING, duePezzi,
       { attaccante: interventor, programma: 'TOTAL CONTROL' })
   .every(g => g.chiamataSbagliata === undefined),
   'CONTROPROVA: con il nome giusto il campo non c e — non e` sempre acceso');
// E il programma ASSENTE non e` una chiamata sbagliata: e` il caso legittimo
// "nessun programma scelto", dove la restrizione non puo` applicarsi.
const senzaProg = M.bersagliValidi(M.AZIONI.HACKING, duePezzi, { attaccante: interventor });
ok(senzaProg.every(g => g.ammesso === true && g.chiamataSbagliata === undefined),
   'programma assente: tutti ammessi e nessuna bandiera — non e` un errore, e` un altra domanda');

console.log('\n--- (c) e (d) le due firme delle domande al giocatore ---');
// (c) invariata: oggetto di risposte per id. Si rimisura qui perche` la
// sezione 3 la prova sul comportamento, non sulla firma.
ok(M.attivaCybermask(hacker3, { fuoriDallaLoF: true }, {}).entra === true &&
   M.rientraInCamo(spektr, { fuoriDallaLoF: true }, {}).rientra === true,
   '(c) rientraInCamo e attivaCybermask: oggetto di risposte per id, invariate');

// (d) ora accetta DUE forme. Valori dichiarati da MOTORE.
const zap = { id: 't9', alias: 'Zapatore', bs: 11, ph: 11, states: {}, skills: 'Sapper' };
ok(M.risolviTrincerarsi(zap, true).entra === true,
   '(d) booleano true: entra in Foxhole');
ok(M.risolviTrincerarsi(zap, { spazioSufficiente: true }).entra === true,
   'e ORA anche { spazioSufficiente: true } fa entrare');
ok(M.risolviTrincerarsi(zap, { spazioSufficiente: false }).idle === true,
   'e { spazioSufficiente: false } fa l Idle');
ok(M.risolviTrincerarsi(zap, undefined).incompleto === true,
   'undefined resta NON RISPOSTO');
// L oggetto che NON porta quel campo: incompleto, ma dichiarato. La
// differenza con undefined e` tutta in chiamataSbagliata — senza quel
// campo i due casi sarebbero indistinguibili, ed e` proprio il silenzio
// che avevo segnalato.
const storto = M.risolviTrincerarsi(zap, { fuoriDallaLoF: true });
ok(storto.entra === false && storto.incompleto === true,
   'un oggetto senza spazioSufficiente non fa entrare');
ok(storto.chiamataSbagliata === true,
   'ma ORA alza chiamataSbagliata: true');
ok(/Chiamata sbagliata di M.risolviTrincerarsi/.test(String(storto.motivo)),
   `col motivo che nomina la funzione (${String(storto.motivo).slice(0, 55)}…)`);
ok(M.risolviTrincerarsi(zap, undefined).chiamataSbagliata === undefined,
   'CONTROPROVA: con undefined il campo NON c e — i due "incompleto" si distinguono');
ok(M.risolviTrincerarsi(zap, {}).chiamataSbagliata === true,
   'e un oggetto vuoto conta come chiamata sbagliata: se passi un oggetto, il campo va nominato');

console.log('\n--- nessuno dei ripari solleva eccezioni ---');
// La ragione e` esplicita: logica_aro.js riga 911 chiama M.bersagliValidi
// fuori da un try. La .15 sollevava eccezioni in due punti ed e` durata
// pochi minuti. Questa prova e` la rete: se un riparo tornasse a lanciare,
// qui diventa rossa, non al tavolo.
const chiamateStorte = [
    ['bersagliValidi, programma oggetto senza nome',
     () => M.bersagliValidi(M.AZIONI.HACKING, duePezzi, { attaccante: interventor, programma: {} })],
    ['bersagliValidi, programma numero',
     () => M.bersagliValidi(M.AZIONI.HACKING, duePezzi, { attaccante: interventor, programma: 42 })],
    ['risolviTrincerarsi, oggetto storto',
     () => M.risolviTrincerarsi(zap, { fuoriDallaLoF: true })],
    ['risolviTrincerarsi, stringa',
     () => M.risolviTrincerarsi(zap, 'si')],
    ['modAttacco, senza azione',
     () => M.modAttacco(hellcat, crocMim, granate, undefined, { rangeIndex: 0 })],
    ['modAttacco, azione come numero',
     () => M.modAttacco(hellcat, crocMim, granate, 7, { rangeIndex: 0 })]
];
for (const [et, f] of chiamateStorte) {
    let caduta = null;
    try { f(); } catch (e) { caduta = e.message; }
    ok(caduta === null, `${et}: nessuna eccezione`, caduta ? 'sollevata: ' + caduta.slice(0, 80) : '');
}

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
