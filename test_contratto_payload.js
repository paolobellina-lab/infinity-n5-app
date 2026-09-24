// @versione 2026-09-23.2 | test_contratto_payload.js | proprieta`: chat TEST
// ================================================================
// Il contratto di M.risolviPayload, scritto da MOTORE il 23 settembre.
// Nasce dal quinto difetto della famiglia "campo letto e mai scritto":
// i bersagli venivano cercati con `b.name`, ma creaPayload li scrive con
// `nome`. L'app usava `name` e funzionava; chi seguiva la convenzione del
// motore no — e un Faccia a Faccia diventava due Tiri Normali.
//
// Il test non guarda il codice: costruisce i payload nelle DUE forme vere
// — quella di creaAttacco/creaPayload e quella di app.html riga 1100 — e
// verifica che ogni campo del contratto arrivi. Per ogni campo la prova e`
// la stessa: cambiarlo deve cambiare il risultato. Un campo che non cambia
// niente non e` letto.
// ================================================================
let passati = 0, falliti = 0;
const ok = (c, m) => { if (c) { passati++; console.log('  ✅ ' + m); } else { falliti++; console.log('  ❌ ' + m); } };
const J = JSON.stringify;

global.window = global;
require('./catalogo_n5.js'); require('./database_comune.js');
require('./database_nomad.js'); require('./database_panoceania.js');
const M = require('./motore_regole_n5.js');
const U = (db, n) => Object.assign(JSON.parse(J(db.find(u => u.nome === n))), { states: {} });
const alg = U(window.DB_NOMADI, 'Alguacil (Combi Rifle)');
const fus = U(window.DB_PANOCEANIA, 'Fusilier (Combi Rifle)');
M._rosterProprio = [alg]; M._rosterNemico = [fus];
const ctx = { trovaUnita: (n, id) => [alg, fus].find(u => u.id === id || u.nome === M.nomeUnita(n) || u.nome === n) || null };

// --- i due produttori veri ---
// 1. creaAttacco + creaPayload: il bersaglio esce con `nome`.
const daContratto = (extra) => {
    const b = Object.assign({ nome: 'Fusilier (Combi Rifle)', burst: 3, rangeIndex: 1, rangeMod: 3 }, extra || {});
    const a = M.creaAttacco({ azione: M.AZIONI.BS_ATTACK, attaccante: alg, arma: M.profiloArma('Combi Rifle'), bersagli: [b] });
    return M.creaPayload([a.attacco || a], {}).payload;
};
// 2. app.html riga 1100: il bersaglio esce con `id` e `name`.
const daApp = (extra) => ({ attacchi: [{
    attaccante: 'Alguacil (Combi Rifle)', azione: M.AZIONI.BS_ATTACK, arma: 'Combi Rifle',
    bersagli: [Object.assign({ id: fus.id, name: 'Fusilier (Combi Rifle)', rangeIndex: 1, rangeMod: 3,
                               burst: 3, cover: false, terrain: 'NESSUNO' }, extra || {})] }] });
const reazione = (extra) => [Object.assign({ nome: 'Fusilier (Combi Rifle)', azione: 'BS_ATTACK',
    arma: 'Combi Rifle', rangeIndex: 1, rangeMod: 3, bersaglio: 'Alguacil (Combi Rifle)', difensore: fus }, extra || {})];
const risolvi = (pay, reaz) => M.risolviPayload(pay, reaz || [], ctx);

console.log('\n=== 1. Le due forme del bersaglio danno lo stesso scontro ===');
for (const [lab, pay] of [['creaPayload (nome)', daContratto()], ['app.html (id + name)', daApp()]]) {
    const s = risolvi(pay, reazione());
    ok(s.length === 1, `${lab}: UN solo scontro, non due (${s.length})`);
    ok(s[0] && s[0].tipo === 'F2F', `${lab}: FACCIA A FACCIA (${s[0] && s[0].tipo})`);
    ok(s[0] && s[0].attivo.mod === 14 && s[0].reattivo.mod === 15,
       `${lab}: 14 contro 15 (${s[0] && s[0].attivo.mod} / ${s[0] && s[0].reattivo.mod})`);
}
// Controprova: senza reazione resta un solo scontro, ma senza opposizione.
const senza = risolvi(daContratto(), []);
ok(senza.length === 1 && senza[0].tipo !== 'F2F', 'senza reazione: uno scontro, e non e` un Faccia a Faccia');

console.log('\n=== 2. I campi del bersaglio arrivano tutti ===');
const modAttivo = (pay) => { const s = risolvi(pay, []); return s[0] && s[0].attivo.mod; };
const salvezza = (pay) => { const s = risolvi(pay, []); const sv = s[0] && s[0].attivo.salvezzaInflitta; return sv && sv.valoreSuccesso; };
const burst = (pay) => { const s = risolvi(pay, []); return s[0] && s[0].attivo.burst; };
// Lo stesso attacco contro l'Orc, per i campi che con ARM 1 non si vedrebbero.
const orc = U(window.DB_PANOCEANIA, 'Orc (Heavy Machine Gun)');
M._rosterNemico = [fus, orc];
const salvezzaSu = (bers, f, extra) => {
    const pay = f(Object.assign({ nome: bers.nome, name: bers.nome, id: bers.id }, extra || {}));
    const s = M.risolviPayload(pay, [], { trovaUnita: (n, id) => [alg, fus, orc].find(u => u.id === id || u.nome === M.nomeUnita(n) || u.nome === n) || null });
    const sv = s[0] && s[0].attivo.salvezzaInflitta; return sv && sv.valoreSuccesso;
};
for (const [lab, f] of [['creaPayload', daContratto], ['app.html', daApp]]) {
    ok(modAttivo(f({ rangeIndex: 2, rangeMod: -3 })) === 8, `${lab}: rangeIndex e rangeMod cambiano il tiro (11 -3 = 8)`);
    ok(modAttivo(f({ cover: true })) === 11 && salvezza(f({ cover: true })) === 11,
       `${lab}: cover vale sul tiro (-3) e sull ARM (+3)`);
    ok(burst(f({ burst: 2 })) === 2, `${lab}: burst allocato al bersaglio`);
    // `ammo` del bersaglio non SCEGLIE la munizione: è solo eco di quella
    // dell'arma (decisione di MOTORE, 23 settembre — nessuna arma del
    // database ha più di una munizione scegliibile: le MULTI la scelgono
    // con la modalità, che è un'arma a sé). Coerente, passa senza dire
    // niente; incoerente, viene rifiutato invece che ignorato.
    ok(salvezzaSu(orc, f, { ammo: 'N' }) === 11, `${lab}: ammo coerente: la salvezza resta quella dell arma (11)`);
}
// terrain: la Zona di Saturazione toglie un dado; se il campo non arrivasse,
// il Burst resterebbe quello scritto.
const terreno = daContratto({ terrain: 'SATURAZIONE' });

ok(daContratto({ terrain: 'SATURAZIONE' }).attacchi[0].bersagli[0].terrain === 'SATURAZIONE',
   'terrain sopravvive a creaPayload');
// copertura: DA QUALE copertura. Cambia le note, non il numero.
// copertura: DA QUALE copertura. Il Vitroferro da` +6 al Tiro Salvezza invece
// di +3 (righe 10681-10689). Si vede nel numero, non in una nota.
ok(salvezza(daContratto({ cover: true })) === 11 && salvezza(daContratto({ cover: true, copertura: 'VITROFERRO' })) === 14,
   `copertura VITROFERRO: +6 invece di +3 (${salvezza(daContratto({ cover: true }))} -> ${salvezza(daContratto({ cover: true, copertura: 'VITROFERRO' }))})`);


console.log('\n=== 2-bis. Una munizione incoerente viene rifiutata, non ignorata ===');
// Il difetto che questa sezione ha scoperto: la salvezza diceva
// "munizione: AP" e contava N. Un dato che SEMBRAVA usato.
const incoerente = M.creaAttacco({ azione: M.AZIONI.BS_ATTACK, attaccante: alg, arma: M.profiloArma('Combi Rifle'),
    bersagli: [{ nome: 'Orc (Heavy Machine Gun)', burst: 3, rangeIndex: 1, rangeMod: 3, ammo: 'AP' }] });
ok(incoerente.ok === false && (incoerente.errori || []).some(e => e.codice === 'E56'),
   `Combi Rifle con ammo AP: rifiutato alla creazione, E56 (${J((incoerente.errori || []).map(e => e.codice))})`);
const svIncoerente = M.tiroSalvezza(orc, { arma: M.profiloArma('Combi Rifle'), ammo: 'AP' });
ok(svIncoerente.valoreSuccesso === 11 && svIncoerente.munizione === 'N',
   `e se arriva lo stesso: calcola con la munizione dell arma, N, VS ${svIncoerente.valoreSuccesso} — non l etichetta AP`);
ok((svIncoerente.avvisi || []).some(a => a.codice === 'A81'), 'con l avviso A81, invece che in silenzio');
const svCoerente = M.tiroSalvezza(orc, { arma: M.profiloArma('Combi Rifle'), ammo: 'N' });
ok((svCoerente.avvisi || []).length === 0, 'controprova: ammo coerente, nessun avviso');
// E la munizione che conta resta quella dell'arma: un'arma AP vera dimezza.
const ap = M.profiloArma('AP Submachine Gun');
ok(M.tiroSalvezza(orc, { arma: ap, ammo: ap.ammo }).valoreSuccesso === 9,
   'controprova: con un arma AP vera l ARM dell Orc e` dimezzata, VS 9');

console.log('\n=== 3. I campi della reazione ===');
const reatt = (extra) => { const s = risolvi(daContratto(), reazione(extra)); return s[0] && s[0].reattivo; };
ok(reatt({ rangeIndex: 2, rangeMod: -3 }).mod === 9, `reazione: gittata (12 -3 = 9, letto ${reatt({ rangeIndex: 2, rangeMod: -3 }).mod})`);
ok(reatt({ cover: true }).mod === 12, `reazione: cover è la copertura del SUO bersaglio, -3 al suo tiro (${reatt({ cover: true }).mod})`);
ok(reatt({ arma: M.profiloArma('Combi Rifle') }).mod === reatt({ arma: 'Combi Rifle' }).mod,
   'reazione: arma come profilo o come nome, stesso esito');
ok(reatt({ azione: 'DODGE' }).attributo === 'PH' && reatt({ azione: 'BS_ATTACK' }).attributo === 'BS',
   'reazione: azione sceglie l attributo');
const conSalvezza = reatt({});
ok(conSalvezza.salvezzaInflitta && conSalvezza.salvezzaInflitta.valoreSuccesso === 8,
   `reazione: il suo colpo fa fare una salvezza vera (ARM VS ${conSalvezza.salvezzaInflitta && conSalvezza.salvezzaInflitta.valoreSuccesso})`);

console.log('\n=== 4. Il payload senza attacchi ===');
const orfano = M.risolviPayload({ attacchi: [], attivo: 'Alguacil (Combi Rifle)' }, reazione(), ctx);
ok(orfano.length === 1 && orfano[0].reattivoNonBersagliato === true,
   'attacchi vuoto + attivo per nome: uno scontro, marcato reattivoNonBersagliato');
const orfano2 = M.risolviPayload({ attacchi: [], unita: 'Alguacil (Combi Rifle)' }, reazione(), ctx);
ok(orfano2.length === 1, 'e `unita` vale come `attivo`');

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
