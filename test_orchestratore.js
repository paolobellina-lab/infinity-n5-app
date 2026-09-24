// @versione 2026-09-23.1 | test_orchestratore.js | proprieta`: chat TEST
// Test dell'orchestratore — node test_orchestratore.js
global.window = global;
require('./catalogo_n5.js'); require('./database_comune.js');
const M = require('./motore_regole_n5.js');

let passati = 0, falliti = 0;
function ok(c, n, e) { if (c) { passati++; console.log(`  ✅ ${n}`); } else { falliti++; console.log(`  ❌ ${n}${e ? '\n       ' + e : ''}`); } }

const alg  = { alias: 'Alguacil', bs: 11, cc: 13, ph: 10, wip: 12, arm: 1, bts: 0, skills: '', states: {} };
const fus  = { alias: 'Fusilier', bs: 12, cc: 13, ph: 10, wip: 13, arm: 1, bts: 0, skills: '', states: {} };
const tag  = { alias: 'Squalo',   bs: 13, cc: 18, ph: 14, wip: 13, arm: 8, bts: 6, skills: '', states: {} };
const hack = { alias: 'Interventor', bs: 11, ph: 10, wip: 14, arm: 1, bts: 6, skills: 'Hacker, Hacking Device', states: {} };

const combi = M.profiloArma('Combi Rifle');
const chain = M.profiloArma('Chain Rifle');

function sc(a, r, c) { return M.risolviScontro(a, r, c || {}); }

console.log('\n=== 1. Scontro completo con Schivata ===');
const s1 = sc({ attaccante: alg, azione: M.AZIONI.BS_ATTACK, arma: combi, bersaglio: fus,
                burst: 3, rangeIndex: 2, cover: true },
              { difensore: fus, azione: 'DODGE', hasLoF: true });
ok(s1.tipo === 'F2F' && s1.titolo === 'TIRO FACCIA A FACCIA', 'Faccia a Faccia');
ok(s1.attivo.mod === 5, `attivo: BS 11 -3 gittata -3 copertura = 5 (ottenuto ${s1.attivo.mod})`);
ok(s1.attivo.burst === 3, 'Burst 3 in attivo');
ok(s1.reattivo.mod === 10 && s1.reattivo.burst === 1, 'reattivo: PH 10, Burst 1 in ARO');
ok(s1.attivo.salvezzaInflitta.valoreSuccesso === 11, 'salvezza del difensore: ARM 1 +3 cop +7 PS = 11');
ok(!s1.reattivo.salvezzaInflitta.offensivo, 'la Schivata non infligge danno');

console.log('\n=== 2. Contrattacco: entrambi i versi hanno un danno ===');
const s2 = sc({ attaccante: alg, azione: M.AZIONI.BS_ATTACK, arma: combi, bersaglio: fus, burst: 3, rangeIndex: 1 },
              { difensore: fus, azione: 'BS_ATTACK', arma: combi, bersaglio: alg, rangeIndex: 1 });
ok(s2.tipo === 'F2F', 'Faccia a Faccia reciproco');
ok(s2.attivo.salvezzaInflitta.offensivo && s2.reattivo.salvezzaInflitta.offensivo,
   'entrambi infliggono danno');
ok(s2.attivo.mod === 14 && s2.reattivo.mod === 15, 'BS 11+3 e BS 12+3');

console.log('\n=== 3. Sagoma Diretta: colpo automatico ===');
const s3 = sc({ attaccante: alg, azione: M.AZIONI.BS_ATTACK, arma: chain, bersaglio: fus, burst: 1, cover: true },
              { difensore: fus, azione: 'DODGE', hasLoF: false });
ok(s3.tipo === 'NORMALE', 'la reazione è un Tiro Normale, non un F2F');
ok(s3.attivo.automatico === true && s3.attivo.mod === 'Auto', 'nessun tiro per colpire');
ok(s3.attivo.salvezzaInflitta.valoreSuccesso === 8,
   'ma il danno c è, e la Copertura NON dà il +3 contro una Sagoma');
ok(s3.reattivo.mod === 10, 'la Schivata contro Sagoma non subisce il -3 senza LoF');

console.log('\n=== 4. Nessun ARO ===');
const s4 = sc({ attaccante: alg, azione: M.AZIONI.BS_ATTACK, arma: combi, bersaglio: fus, burst: 3, rangeIndex: 1 }, null);
ok(s4.tipo === 'NORMALE' && s4.reattivo.burst === 0, 'Tiro Normale, reattivo fermo');
ok(s4.attivo.salvezzaInflitta.offensivo, 'il danno si calcola lo stesso');

console.log('\n=== 5. Hacking ===');
const carb = M.armaDaProgramma('CARBONITE');
const s5 = sc({ attaccante: hack, azione: M.AZIONI.HACKING, arma: carb, bersaglio: tag, burst: 2, ammo: carb.ammo },
              { difensore: tag, azione: 'RESET' });
ok(s5.attivo.attributo === 'WIP' && s5.attivo.mod === 14, 'attacco Comms su WIP 14');
ok(s5.attivo.salvezzaInflitta.attributo === 'BTS', 'la salvezza è su BTS, non su ARM');
ok(s5.attivo.salvezzaInflitta.tiri === 2, 'Carbonite usa DA: due salvezze');
ok(s5.reattivo.attributo === 'WIP', 'il Reset tira su WIP');

console.log('\n=== 6. Ogni numero è risalibile ===');
ok(s1.attivo.voci.every(v => v.fonte && v.motivo), 'ogni voce dell attivo ha fonte e motivo');
ok(s1.attivo.salvezzaInflitta.voci.every(v => v.fonte && v.motivo), 'e anche quelle della salvezza');
ok(typeof s1.motivoConfronto === 'string' && s1.motivoConfronto.length > 0,
   'il tipo di confronto è motivato');

console.log('\n=== 7. risolviPayload: un ordine intero ===');
const roster = [alg, fus, tag, hack];
const trovaUnita = (n) => roster.find(u => M.nomeUnita(u).toUpperCase() === String(n).toUpperCase()) || {};
const scontri = M.risolviPayload({
    attacchi: [{
        attaccante: 'Alguacil', azione: M.AZIONI.BS_ATTACK, arma: combi,
        bersagli: [
            { name: 'Fusilier', burst: 2, rangeIndex: 1, cover: false, ammo: 'N' },
            { name: 'Squalo',   burst: 1, rangeIndex: 1, cover: true,  ammo: 'N' }
        ]
    }]
}, [{ nome: 'Fusilier', azione: 'DODGE', hasLoF: true }], { trovaUnita });
ok(scontri.length === 2, 'due bersagli, due scontri');
ok(scontri[0].tipo === 'F2F', 'il Fusilier che schiva: Faccia a Faccia');
ok(scontri[1].tipo === 'NORMALE', 'lo Squalo che non reagisce: Tiro Normale');
ok(scontri[0].attivo.burst === 2 && scontri[1].attivo.burst === 1, 'i dadi sono divisi come nel payload');
ok(scontri[1].attivo.salvezzaInflitta.valoreSuccesso === 8 + 3 + 7,
   `lo Squalo in copertura: ARM 8 +3 +7 PS = 18 (ottenuto ${scontri[1].attivo.salvezzaInflitta.valoreSuccesso})`);

console.log('\n=== 8. Difese pure ===');
const dif = M.risolviPayload({
    attacchi: [{ attaccante: 'Fusilier', azione: M.AZIONI.SCHIVATA,
                 arma: { isDifesa: true }, bersagli: [{ id: 'all', name: 'Minaccia Reattiva', burst: 1 }] }]
}, [], { trovaUnita });
ok(dif.length === 1 && dif[0].titolo === 'TIRO DI SUPPORTO / DIFESA', 'Schivata pura: un tiro solo');
ok(dif[0].attivo.mod === 10, 'PH 10');
ok(!dif[0].attivo.salvezzaInflitta.offensivo, 'nessun danno');

console.log('\n=== 9. Bersagli senza dadi ===');
const zero = M.risolviPayload({
    attacchi: [{ attaccante: 'Alguacil', azione: M.AZIONI.BS_ATTACK, arma: combi,
                 bersagli: [{ name: 'Fusilier', burst: 0, rangeIndex: 1 }] }]
}, [], { trovaUnita });
ok(zero.length === 0, 'un bersaglio a Burst 0 non produce scontri');

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
