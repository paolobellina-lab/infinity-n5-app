// @versione 2026-09-23.1 | test_sagome_multibersaglio.js | proprieta`: chat TEST
// ================================================================
// Due cose che il motore 2026-09-23.9 ha sistemato, e che si somigliano:
// una funzione giusta che nessuno chiamava, e un conteggio applicato a
// un'arma che non conta i dadi come le altre.
//
// 1. CLIMBING PLUS. M.tipoScalata rispondeva bene da giorni, ma
//    ordine_movimento chiedeva il tipo ad azioneSenzaTiro, che non conosce
//    l'unita` e diceva sempre LONG_SKILL.
// 2. SAGOME CON PIU` BERSAGLI. creaAttacco sommava i dadi dei bersagli:
//    due truppe sotto l'area di un lanciafiamme B1 davano "Assegnati 2
//    dadi ma ne hai solo 1". Una Sagoma non divide i dadi — con un uso
//    colpisce tutti quelli sotto l'area (REGOLE_N5_v5_1_1.txt, Template
//    Weapons: il tiro e` uno e ogni altro nemico si oppone separatamente).
// ================================================================
let passati = 0, falliti = 0;
const ok = (c, m) => { if (c) { passati++; console.log('  ✅ ' + m); } else { falliti++; console.log('  ❌ ' + m); } };
const J = JSON.stringify;

global.window = global;
require('./catalogo_n5.js'); require('./database_comune.js');
require('./database_nomad.js'); require('./database_panoceania.js');
const M = require('./motore_regole_n5.js');
const U = (db, n) => Object.assign(JSON.parse(J(db.find(u => u.nome === n))), { states: {} });
const gre = U(window.DB_NOMADI, 'Grenzer (Forward Observer, Sensor, NCO)');
const fus = U(window.DB_PANOCEANIA, 'Fusilier (Combi Rifle)');
const orc = U(window.DB_PANOCEANIA, 'Orc (Heavy Machine Gun)');
M._rosterProprio = [gre]; M._rosterNemico = [fus, orc];

console.log('\n=== 1. Climbing Plus: la scalata diventa mezzo ordine ===');
const mary = U(window.DB_NOMADI, 'Mary Problems (Hacker)');
const alg  = U(window.DB_NOMADI, 'Alguacil (Combi Rifle)');
ok(/Climbing Plus/i.test(mary.skills || ''), 'Mary Problems ha Climbing Plus nel database');
ok(!/Climbing Plus/i.test(alg.skills || ''), 'controprova: l Alguacil no');
const tipo = (u) => (M.azioneSenzaTiro('ARRAMPICARSI', u) || {}).tipo;
ok(tipo(mary) === 'SHORT_SKILL', `con Climbing Plus: SHORT_SKILL, mezzo ordine (${tipo(mary)})`);
ok(tipo(alg) === 'LONG_SKILL', `senza: LONG_SKILL, ordine intero (${tipo(alg)})`);
ok(tipo(undefined) === 'LONG_SKILL', 'senza unità: LONG_SKILL, la risposta del catalogo (' + tipo(undefined) + ')');
// La funzione del motore e la scorciatoia devono dire la stessa cosa: era
// proprio il disallineamento fra le due a tenere il difetto in vita.
ok(M.tipoScalata(mary).tipo === tipo(mary) && M.tipoScalata(alg).tipo === tipo(alg),
   'azioneSenzaTiro e tipoScalata danno la stessa risposta');
ok(/p\.87/.test(M.tipoScalata(mary).fonte || ''), `e tipoScalata cita la fonte (${M.tipoScalata(mary).fonte})`);
// Controprova: il Movimento non cambia per nessuno.
ok((M.azioneSenzaTiro('MOVIMENTO', mary) || {}).tipo === (M.azioneSenzaTiro('MOVIMENTO', alg) || {}).tipo,
   'controprova: il MOVIMENTO resta uguale con o senza la skill');

console.log('\n=== 2. Una Sagoma colpisce tutti quelli sotto l area ===');
const crea = (arma, bersagli) => M.creaAttacco({ azione: M.AZIONI.BS_ATTACK, attaccante: gre,
    arma: M.profiloArma(arma), bersagli: bersagli });
const codici = (r) => (r.errori || []).map(e => e.codice);
const due = [{ nome: 'Fusilier (Combi Rifle)', burst: 1 }, { nome: 'Orc (Heavy Machine Gun)', burst: 1 }];

const sagoma = crea('Light Flamethrower', due);
ok(sagoma.ok === true, `Light Flamethrower B1, due bersagli da 1 dado: ammesso (${J(codici(sagoma))})`);
// Il dado resta uno: quello che cambia e` come si contano i bersagli.
ok(M.profiloArma('Light Flamethrower').burst === 1, 'e il Burst dell arma resta 1');
ok(codici(crea('Light Flamethrower', [{ nome: 'Fusilier (Combi Rifle)', burst: 2 }])).indexOf('E21') >= 0,
   'due dadi su UN bersaglio con una Sagoma B1: E21 — il conteggio non e` sparito');
// Controprova con un arma normale dello stesso Burst: li` i dadi si dividono.
const b1 = 'Panzerfaust';
ok(M.profiloArma(b1).burst === 1 && !M.profiloArma(b1).isTemplate, `${b1}: B1 e non a Sagoma`);
ok(codici(crea(b1, [{ nome: 'Fusilier (Combi Rifle)', burst: 1, rangeIndex: 1, rangeMod: 0 },
                    { nome: 'Orc (Heavy Machine Gun)', burst: 1, rangeIndex: 1, rangeMod: 0 }])).indexOf('E21') >= 0,
   'controprova: ' + b1 + ' B1 su due bersagli: E21, perché la raffica si divide');

console.log('\n=== 3. E arrivano due scontri, uno per bersaglio ===');
const pay = M.creaPayload([sagoma.attacco], {}).payload;
const ctx = { trovaUnita: (n, id) => [gre, fus, orc].find(u => u.id === id || u.nome === M.nomeUnita(n) || u.nome === n) || null };
const s = M.risolviPayload(pay, [], ctx);
ok(s.length === 2, `due scontri, uno per bersaglio (${s.length})`);
ok(s.every(x => x.attivo.mod === 'Auto'), 'entrambi colpo automatico: la Sagoma Diretta non tira per colpire');
ok(J(s.map(x => x.reattivo && x.reattivo.nome)).indexOf('Fusilier') >= 0 && J(s.map(x => x.reattivo && x.reattivo.nome)).indexOf('Orc') >= 0,
   'e i due bersagli sono quelli scelti');
ok(s.every(x => x.attivo.salvezzaInflitta && x.attivo.salvezzaInflitta.valoreSuccesso > 0),
   `ognuno fa il proprio Tiro Salvezza (${s.map(x => x.attivo.salvezzaInflitta.valoreSuccesso).join(', ')})`);

console.log('\n=== 4. Due limiti dichiarati, non nascosti ===');
// Una Sagoma d'Impatto e` UN tiro solo che vale per tutti: gli scontri di
// una stessa Sagoma devono mostrare lo stesso valore dell'attivo, altrimenti
// al tavolo si tirerebbe due volte.
const impatto = crea('Missile Launcher (Blast Mode)', [
    { nome: 'Fusilier (Combi Rifle)', burst: 1, rangeIndex: 3, rangeMod: 3 },
    { nome: 'Orc (Heavy Machine Gun)', burst: 1, rangeIndex: 3, rangeMod: 3 }]);
if (impatto.ok) {
    const si = M.risolviPayload(M.creaPayload([impatto.attacco], {}).payload, [], ctx);
    const valori = si.map(x => x.attivo.mod);
    ok(valori.every(v => v === valori[0]),
       `Sagoma a Impatto: lo stesso tiro per tutti i bersagli (${J(valori)}) — al tavolo si tira una volta sola`);
} else {
    ok(false, `Sagoma a Impatto su due bersagli: rifiutata (${J(codici(impatto))})`);
}
// "Se il Bersaglio Principale e` fuori dall area, nessuno e` colpito" e`
// geometria: il motore non la vede, e non deve fingere di vederla.
console.log('  — il Bersaglio Principale fuori area resta una regola del tavolo: il motore non vede la geometria, nessuna prova qui');

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
