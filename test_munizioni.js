// @versione 2026-09-23.1 | test_munizioni.js | proprieta`: chat TEST
// Test munizioni — node test_munizioni.js
global.window = global;
require('./catalogo_n5.js');
require('./database_comune.js');
const M = require('./motore_regole_n5.js');

let passati = 0, falliti = 0;
function ok(cond, nome, extra) {
    if (cond) { passati++; console.log(`  ✅ ${nome}`); }
    else { falliti++; console.log(`  ❌ ${nome}${extra ? '\n       ' + extra : ''}`); }
}
function r(n, o) { return M.risolviMunizione(n, o); }

console.log('\n=== 1. Le undici munizioni N5 ===');
const valide = M.munizioniValide();
console.log('   ' + valide.join(', '));
ok(valide.length === 11, `esattamente 11 tipi (trovati ${valide.length})`);
['N', 'AP', 'DA', 'EXP', 'SHOCK', 'E/M', 'T2', 'PARA', 'STUN', 'SMOKE', 'ECLIPSE']
    .forEach(a => { const x = r(a); if (!x.ok) { falliti++; console.log(`  ❌ ${a} non risolta`); } });
ok(true, 'tutte e 11 risolvono');
ok(r('NORMALE').basi[0] === 'N', 'alias NORMALE -> N');

console.log('\n=== 2. Basi ===');
ok(r('DA').salvezze === 2, 'DA = 2 salvezze');
ok(r('EXP').salvezze === 3, 'EXP = 3 salvezze');
ok(r('T2').dannoPerFallimento === 2, 'T2 = 2 Ferite per fallimento');
ok(r('E/M').attributo === 'BTS' && r('E/M').dimezza && r('E/M').salvezze === 2, 'E/M = 2 salvezze BTS dimezzato');
ok(r('PARA').attributo === 'PH' && r('PARA').tiroSpeciale === 'PH-6', 'PARA = tiro PH-6');
ok(r('SMOKE').nonOffensiva && r('SMOKE').salvezze === 0, 'SMOKE non offensiva');
ok(r('STUN').statiFallimento.includes('STORDITO'), 'STUN applica Stordito');

console.log('\n=== 3. Composizione — i casi documentati dalla wiki ===');
const apda = r('AP+DA');
ok(apda.salvezze === 2 && apda.dimezza === true,
   'AP+DA = 2 salvezze con attributo dimezzato',
   `salvezze=${apda.salvezze} dimezza=${apda.dimezza}`);
const apexp = r('AP+EXP');
ok(apexp.salvezze === 3 && apexp.dimezza === true, 'AP+EXP = 3 salvezze dimezzate');
const nem = r('N+E/M');
ok(nem.salvezze === 2 && nem.attributo === 'BTS' && nem.dimezza === true &&
   nem.dannoPerFallimento === 1 && nem.statiFallimento.includes('ISOLATO'),
   'N+E/M = 2 salvezze BTS dimezzato, 1 Ferita ciascuna, Isolato',
   JSON.stringify({ s: nem.salvezze, a: nem.attributo, d: nem.dimezza, w: nem.dannoPerFallimento }));

console.log('\n=== 4. La composizione riproduce la tabella del catalogo ===');
const tab = window.CATALOGO_N5.MUNIZIONI_COMBINATE;
['AP+DA', 'AP+EXP', 'N+E/M'].forEach(k => {
    const atteso = tab[k], calc = r(k);
    ok(calc.salvezze === atteso.salvezze && calc.dimezza === atteso.dimezza,
       `${k}: composizione == voce di catalogo`,
       `catalogo ${atteso.salvezze}/${atteso.dimezza} vs calcolato ${calc.salvezze}/${calc.dimezza}`);
});

console.log('\n=== 5. Combinazioni mai tabellate ===');
const t2ap = r('AP+T2');
ok(t2ap.ok && t2ap.dimezza && t2ap.dannoPerFallimento === 2,
   'AP+T2 (non a catalogo) composta correttamente');
const shockda = r('SHOCK+DA');
ok(shockda.ok && shockda.salvezze === 2, 'SHOCK+DA composta correttamente');

console.log('\n=== 6. AP: attributo ereditato dall arma ===');
const apSolo = r('AP');
ok(apSolo.attributo === 'ARM' && apSolo.avvisi.some(a => a.codice === 'A53'),
   'AP da solo -> assume ARM ma lo dichiara');
const apBts = r('AP', { attributoArma: 'BTS' });
ok(apBts.attributo === 'BTS' && apBts.avvisi.length === 0,
   'AP con attributoArma:BTS -> dimezza il BTS, nessun avviso');

console.log('\n=== 7. Munizioni N3 non piu esistenti ===');
const viral = r('VIRAL');
ok(viral.rimossa && viral.avvisi.some(a => a.codice === 'A50'), 'VIRAL segnalata come residuo N3');
const breaker = r('BREAKER');
ok(breaker.rimossa && breaker.basi.includes('AP') && breaker.dimezza,
   'BREAKER risolta come AP (equivalente N5)',
   'basi=' + JSON.stringify(breaker.basi));
const flash = r('FLASH');
ok(flash.rimossa && flash.statiFallimento.includes('STORDITO'), 'FLASH risolta come STUN');
const adhesive = r('ADHESIVE');
ok(adhesive.rimossa && adhesive.tiroSpeciale === 'PH-6', 'ADHESIVE risolta come PARA');
const plasma = r('PLASMA');
ok(plasma.rimossa && plasma.attributo === 'ARM+BTS', 'PLASMA risolta come Tiro Salvezza Combinato');
const k1 = r('K1');
ok(k1.rimossa && !k1.ok, 'K1 senza sostituto -> non risolvibile');

console.log('\n=== 8. Tiro Salvezza Combinato ===');
const comb = r('ARM+BTS');
ok(comb.ok && comb.attributo === 'ARM+BTS' && comb.salvezze === 2,
   'ARM+BTS = 1 salvezza ARM + 1 BTS');

console.log('\n=== 9. Casi limite ===');
ok(r('N/A').nonOffensiva && r('N/A').salvezze === 0, '"N/A" -> nessun tiro salvezza');
ok(r('').nonOffensiva, 'stringa vuota -> nessun tiro salvezza');
const inventata = r('LASERONE');
ok(!inventata.ok && inventata.avvisi.some(a => a.codice === 'A52'), 'munizione inventata -> A52');

console.log('\n=== 10. Regressione sul database armi reale ===');
// Il database non deve piu` contenere munizioni N3: ARMA DA TEST MULTIPLA e`
// stata rimossa da database_comune.js, e con lei l'ultima voce "sporca".
// RULES_WEAPONS contiene alias (piu` chiavi per lo stesso oggetto): senza
// deduplicare, la stessa arma verrebbe segnalata fino a tre volte.
const vistiPerOggetto = new Set();
const residui = {};
Object.keys(window.RULES_WEAPONS).forEach(nome => {
    const oggetto = window.RULES_WEAPONS[nome];
    if (vistiPerOggetto.has(oggetto)) return;   // alias della stessa arma
    vistiPerOggetto.add(oggetto);
    M.profiloArma(nome).avvisi.filter(a => a.codice === 'A50' || a.codice === 'A52').forEach(a => {
        (residui[nome] = residui[nome] || []).push(a.messaggio);
    });
});
const armiSporche = Object.keys(residui);
console.log('   armi distinte esaminate: ' + vistiPerOggetto.size +
            ' su ' + Object.keys(window.RULES_WEAPONS).length + ' chiavi');
console.log('   armi con munizioni non-N5: ' + (armiSporche.length ? armiSporche.join(', ') : '(nessuna)'));
ok(armiSporche.length === 0,
   'nessuna arma del database contiene munizioni N3',
   armiSporche.map(n => n + ': ' + residui[n].join(' / ')).join(' | '));

console.log('\n=== 11. Separazione della stringa ammo (voce costruita qui) ===');
// Sostituisce ARMA DA TEST MULTIPLA: il dato di collaudo vive nel test, non nel
// database di produzione, dove poteva comparire fra le armi selezionabili.
// Serve a una cosa sola: verificare che una stringa con tutte le munizioni
// insieme venga separata sulla virgola e non sulla barra — "E/M" e "N/A"
// contengono una barra e non vanno spezzate in due.
const NOME_FIXTURE = '__FIXTURE MUNIZIONI__';
const TIPI_FIXTURE = ['N', 'AP', 'DA', 'EXP', 'SHOCK', 'E/M', 'T2', 'PARA', 'STUN',
                      'SMOKE', 'ECLIPSE', 'AP+DA', 'AP+EXP', 'ARM+BTS'];
window.RULES_WEAPONS[NOME_FIXTURE] = {
    b: 1, dam: 13, ammo: TIPI_FIXTURE.join(', '),
    bande: [{ label: '0-8', mod: 0 }], traits: ''
};
try {
    const fx = M.profiloArma(NOME_FIXTURE);
    ok(fx.ammoOpzioni.length === TIPI_FIXTURE.length,
       `separate tutte e ${TIPI_FIXTURE.length} le munizioni`,
       'trovate ' + fx.ammoOpzioni.length + ': ' + fx.ammoOpzioni.join(' | '));
    ok(fx.ammoOpzioni.includes('E/M'),
       '"E/M" non spezzata dalla barra',
       fx.ammoOpzioni.join(' | '));
    ok(!fx.ammoOpzioni.includes('E') && !fx.ammoOpzioni.includes('M'),
       'nessun frammento "E" o "M" fra le opzioni');
    ok(TIPI_FIXTURE.every(t => fx.ammoOpzioni.includes(t)),
       'ogni munizione dichiarata compare fra le opzioni');
    ok(fx.ammoOpzioni.every(t => r(t).ok),
       'ognuna delle opzioni separate risolve');
    // "N/A" e` l'altro caso con la barra: non e` una munizione, e` l'assenza.
    window.RULES_WEAPONS[NOME_FIXTURE].ammo = 'N/A';
    const fxNA = M.profiloArma(NOME_FIXTURE);
    ok(fxNA.ammoOpzioni.length <= 1 && !fxNA.ammoOpzioni.includes('A'),
       '"N/A" non spezzata in "N" + "A"',
       fxNA.ammoOpzioni.join(' | '));
} finally {
    delete window.RULES_WEAPONS[NOME_FIXTURE];
}
ok(window.RULES_WEAPONS[NOME_FIXTURE] === undefined,
   'la voce di collaudo non resta nel database dopo il test');

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
