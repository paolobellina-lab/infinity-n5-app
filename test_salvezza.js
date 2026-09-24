// @versione 2026-09-23.1 | test_salvezza.js | proprieta`: chat TEST
// Test di tiroSalvezza — node test_salvezza.js
global.window = global;
require('./catalogo_n5.js'); require('./database_comune.js');
const M = require('./motore_regole_n5.js');

let passati = 0, falliti = 0;
function ok(c, n, e) { if (c) { passati++; console.log(`  ✅ ${n}`); } else { falliti++; console.log(`  ❌ ${n}${e ? '\n       ' + e : ''}`); } }

const fusilier = { alias: 'Fusilier', tipo: 'LI',  arm: 1, bts: 0, ph: 10 };
const bolt     = { alias: 'Bolt',     tipo: 'MI',  arm: 3, bts: 3, ph: 11 };
const squalo   = { alias: 'Squalo',   tipo: 'TAG', arm: 8, bts: 6, ph: 14 };
function sv(nomeArma, bersaglio, colpo) {
    return M.tiroSalvezza(bersaglio, Object.assign({ arma: M.profiloArma(nomeArma) }, colpo || {}));
}

console.log('\n=== 1. La formula base ===');
const base = sv('Combi Rifle', fusilier);
ok(base.valoreSuccesso === 8, `ARM 1 + PS 7 = 8 (ottenuto ${base.valoreSuccesso})`);
ok(base.tiri === 1 && base.attributo === 'ARM', '1 dado su ARM');
ok(base.voci.some(v => v.fonte === 'ps'), 'il PS compare nel dettaglio');

console.log('\n=== 2. Copertura ===');
ok(sv('Combi Rifle', fusilier, { cover: true }).valoreSuccesso === 11, 'in Copertura: +3 ARM');
const sag = sv('Chain Rifle', fusilier, { cover: true });
ok(sag.valoreSuccesso === sv('Chain Rifle', fusilier).valoreSuccesso,
   'contro una Sagoma la Copertura NON dà il +3');
ok(sag.note.some(n => n.includes('Sagoma')), 'e la schermata spiega perché');
ok(sv('Combi Rifle', fusilier, { cover: true, ignoraCopertura: true }).valoreSuccesso === 8,
   'un attacco che ignora la Copertura (Guidato): niente +3');

console.log('\n=== 3. Il Weapon Chart batte la munizione ===');
const breaker = sv('Breaker Combi Rifle', bolt);
ok(breaker.attributo === 'BTS', 'Breaker: salvezza su BTS malgrado la munizione AP');
ok(breaker.valoreSuccesso === Math.ceil(3 / 2) + 7, `BTS 3 dimezzato + PS 7 = ${Math.ceil(3/2)+7}`);

const k1 = sv('K1 Combi Rifle', squalo);
ok(k1.valoreAttributo === 0, 'K1: ARM azzerato, non dimezzato');
ok(k1.valoreSuccesso === M.profiloArma('K1 Combi Rifle').dam, 'quindi il tiro è il solo PS');
ok(sv('K1 Combi Rifle', squalo, { cover: true }).valoreSuccesso === k1.valoreSuccesso + 3,
   'ma la Copertura si applica lo stesso: azzerare l ARM non azzera la Copertura');

const para = sv('PARA CC Weapon', fusilier);
ok(para.attributo === 'PH' && para.valoreSuccesso === 4, 'PARA: tiro PH-6, senza PS (10-6=4)');

console.log('\n=== 4. Tiro Salvezza Combinato ===');
const plasma = sv('Plasma Rifle (Hit Mode)', bolt);
ok(plasma.combinato === true, 'Plasma: Tiro Salvezza Combinato');
ok(plasma.rami.length === 2 && plasma.rami[0].attributo === 'ARM' && plasma.rami[1].attributo === 'BTS',
   'due rami: uno su ARM, uno su BTS');
ok(plasma.tiriPerAttributo === 1, 'una salvezza per attributo ("1e1")');
ok(plasma.rami[0].valoreSuccesso === 9 && plasma.rami[1].valoreSuccesso === 9,
   'ARM 3 + PS 6 = 9 e BTS 3 + PS 6 = 9');

console.log('\n=== 5. Munizioni multi-salvezza ===');
ok(sv('AP+DA CC Weapon', squalo).tiri === 2, 'AP+DA: due Tiri Salvezza');
ok(sv('AP+DA CC Weapon', squalo).valoreAttributo === 4, 'e ARM 8 dimezzato = 4');

console.log('\n=== 6. Firewall: la Copertura degli Attacchi Comms ===');
const carb = M.armaDaProgramma('CARBONITE');
const senzaFw = M.tiroSalvezza(squalo, { arma: carb, ammo: carb.ammo });
const conFw = M.tiroSalvezza(squalo, { arma: carb, ammo: carb.ammo, firewall: -6 });
ok(conFw.valoreSuccesso === senzaFw.valoreSuccesso + 3, 'Firewall: +3 BTS al Tiro Salvezza');
ok(conFw.voci.some(v => v.fonte === 'firewall'), 'e compare nel dettaglio');

console.log('\n=== 7. Niente numeri inventati ===');
const cont = sv('Plasma Rifle', bolt);
ok(!cont.offensivo && cont.avvisi.some(a => a.codice === 'A55'),
   'voce-contenitore: nessun tiro calcolato, si chiede la modalità');
const ignota = M.tiroSalvezza(bolt, { arma: M.profiloArma('Fucile Immaginario') });
ok(!ignota.offensivo && ignota.avvisi.some(a => a.codice === 'A56'),
   'arma sconosciuta: nessun tiro inventato');
const fumo = sv('Smoke Grenades', fusilier);
ok(!fumo.offensivo, 'Smoke: nessun Tiro Salvezza');

console.log('\n=== 8. La trappola K1/Breaker, di nuovo ===');
[['K1 Combi Rifle', 'ARM', true], ['Breaker Combi Rifle', 'BTS', false],
 ['Monofilament CC Weapon', 'ARM', true], ['Viral Sniper Rifle', 'BTS', false]].forEach(function (c) {
    const e = sv(c[0], bolt);
    ok(e.attributo === c[1], `${c[0]}: salvezza su ${c[1]}, letta dal profilo e non dal nome`);
    ok(e.fonte === 'arma', `${c[0]}: parametri dal Weapon Chart`);
});

console.log('\n=== 9. Tutte le 193 armi producono un tiro sensato ===');
let rotte = 0;
Object.keys(window.RULES_WEAPONS).forEach(function (n) {
    const a = M.profiloArma(n);
    if (a.nonTrovata || a.soloModalita) return;
    const e = M.tiroSalvezza(bolt, { arma: a });
    if (!e.offensivo) return;
    const vals = e.combinato ? e.rami.map(r => r.valoreSuccesso) : [e.valoreSuccesso];
    if (vals.some(v => !isFinite(v) || v < 1 || v > 40)) { rotte++; console.log(`     ${n}: ${JSON.stringify(vals)}`); }
});
ok(rotte === 0, 'nessun valore di successo assurdo o non numerico');

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
