// @versione 2026-09-23.1 | test_confronto.js | proprieta`: chat TEST
// Test di tipoConfronto — node test_confronto.js
global.window = global;
require('./catalogo_n5.js'); require('./database_comune.js');
const M = require('./motore_regole_n5.js');

let passati = 0, falliti = 0;
function ok(c, n, e) { if (c) { passati++; console.log(`  ✅ ${n}`); } else { falliti++; console.log(`  ❌ ${n}${e ? '\n       ' + e : ''}`); } }

const alguacil = { alias: 'Alguacil', skills: '' };
const fusilier = { alias: 'Fusilier', skills: '' };
const vedetta  = { alias: 'Vedetta', skills: 'Multispectral Visor L2' };
const combi = M.profiloArma('Combi Rifle');
const chain = M.profiloArma('Chain Rifle');            // Sagoma DIRETTA
const missile = M.profiloArma('Missile Launcher (Blast Mode)'); // Sagoma a IMPATTO

function att(azione, arma, extra) {
    return Object.assign({ azione: azione, arma: arma, attaccante: alguacil, burst: 1, ammo: arma ? arma.ammo : 'N' }, extra || {});
}
function reaz(azione, versoAttaccante, extra) {
    return Object.assign({ azione: azione, arma: combi, burst: 1, ammo: 'N',
        bersaglio: versoAttaccante ? alguacil : { alias: 'Altro' } }, extra || {});
}
function tipo(a, r, c) { return M.tipoConfronto(a, r, c).tipo; }

console.log('\n=== 1. Casi base ===');
ok(tipo(att(M.AZIONI.BS_ATTACK, combi), null) === 'NORMALE', 'nessun ARO: Tiro Normale');
ok(tipo(att(M.AZIONI.BS_ATTACK, combi), reaz('BS_ATTACK', true)) === 'F2F',
   'attacco e contrattacco reciproci: Faccia a Faccia');
ok(tipo(att(M.AZIONI.BS_ATTACK, combi), reaz('BS_ATTACK', false)) === 'NORMALE',
   'il reattivo spara a un terzo: tiri indipendenti');
ok(tipo(att(M.AZIONI.BS_ATTACK, combi), reaz('DODGE', false)) === 'F2F',
   'Schivata: sempre opposta, non ha un bersaglio');
// 🔴 Il Reset NON è "idem" alla Schivata: si oppone solo agli Attacchi Comms
// e ai Guidati. Contro un BS Attack è un Tiro Normale (riga 7753). Il test
// asseriva F2F — la regola sbagliata, trovata col punto Sorpresa 5.2.
ok(tipo(att(M.AZIONI.BS_ATTACK, combi), reaz('RESET', false)) === 'NORMALE',
   'Reset contro BS Attack: Tiro Normale, non contrapposto');
ok(tipo(att(M.AZIONI.BS_ATTACK, combi, { burst: 0 }), reaz('DODGE', true)) === 'NESSUNO',
   'attaccante a Burst 0: nessun tiro');
ok(tipo(att(M.AZIONI.BS_ATTACK, combi), reaz('DODGE', true, { burst: 0 })) === 'NORMALE',
   'reattivo a Burst 0: l attaccante tira da solo');

console.log('\n=== 2. LA CORREZIONE: Attacco Intuitivo ===');
ok(tipo(att(M.AZIONI.INTUITIVO, chain), reaz('DODGE', true)) === 'F2F',
   'Intuitivo: Faccia a Faccia (l Hub lo forzava a Tiro Normale)');
ok(tipo(att(M.AZIONI.INTUITIVO, chain), reaz('BS_ATTACK', true)) === 'F2F',
   'e vale anche contro un contrattacco');
const e1 = M.tipoConfronto(att(M.AZIONI.INTUITIVO, chain), reaz('DODGE', true));
ok(e1.note.some(n => n.includes('Sagoma Diretta')),
   'la nota spiega che la regola dell Intuitivo batte quella della Sagoma');

console.log('\n=== 3. LA CORREZIONE: Sagome Dirette ===');
ok(tipo(att(M.AZIONI.BS_ATTACK, chain), reaz('DODGE', true)) === 'NORMALE',
   'lanciafiamme: la Schivata è un Tiro Normale, non un F2F');
ok(tipo(att(M.AZIONI.BS_ATTACK, chain), reaz('BS_ATTACK', true)) === 'NORMALE',
   'e vale per QUALSIASI attacco di reazione, non solo per la Schivata');
ok(tipo(att(M.AZIONI.BS_ATTACK, missile), reaz('DODGE', true)) === 'F2F',
   'ma una Sagoma a IMPATTO richiede il tiro: resta Faccia a Faccia');

console.log('\n=== 4. Scoprire non è un attacco ===');
ok(tipo(att(M.AZIONI.SCOPRIRE, null), reaz('BS_ATTACK', true)) === 'NORMALE',
   'Scoprire: nessun Faccia a Faccia');

console.log('\n=== 5. Fumo contro Multispectral Visor ===');
const fumo = att(M.AZIONI.BS_ATTACK, combi, { ammo: 'SMOKE' });
ok(tipo(fumo, reaz('BS_ATTACK', true), { difensoreHaMSV: true }) === 'NORMALE',
   'fumo contro chi ha l MSV: il confronto salta');
ok(tipo(fumo, reaz('BS_ATTACK', true), { difensoreHaMSV: false }) === 'F2F',
   'senza MSV il fumo non salta niente');
const eclipse = att(M.AZIONI.BS_ATTACK, combi, { ammo: 'ECLIPSE' });
ok(tipo(eclipse, reaz('BS_ATTACK', true), { difensoreHaMSV: true }) === 'F2F',
   'l Eclipse blocca anche l MSV: il Faccia a Faccia resta');

console.log('\n=== 6. Ogni esito ha un motivo leggibile ===');
[[att(M.AZIONI.BS_ATTACK, combi), null],
 [att(M.AZIONI.INTUITIVO, chain), reaz('DODGE', true)],
 [att(M.AZIONI.BS_ATTACK, chain), reaz('DODGE', true)],
 [att(M.AZIONI.BS_ATTACK, combi), reaz('BS_ATTACK', false)]
].forEach(function (c, i) {
    const e = M.tipoConfronto(c[0], c[1]);
    if (!e.motivo) { falliti++; console.log(`  ❌ caso ${i}: nessun motivo`); }
});
ok(true, 'tutti gli esiti motivati');

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
