// @versione 2026-09-23.1 | test_armi.js | proprieta`: chat TEST
// Test profiloArma / bandeGittata — node test_armi.js
global.window = global;
require('./catalogo_n5.js');
require('./database_comune.js');
const M = require('./motore_regole_n5.js');

let passati = 0, falliti = 0;
function ok(cond, nome, extra) {
    if (cond) { passati++; console.log(`  ✅ ${nome}`); }
    else { falliti++; console.log(`  ❌ ${nome}${extra ? '\n       ' + extra : ''}`); }
}

console.log('\n=== 1. Regressione: TUTTE le armi del database ===');
const armi = Object.keys(window.RULES_WEAPONS);
let rotte = [], senzaBande = [], conAvvisi = [];
armi.forEach(nome => {
    const p = M.profiloArma(nome);
    if (p.nonTrovata) rotte.push(nome);
    const w = window.RULES_WEAPONS[nome];
    if (w.ranges && p.bands.length !== Object.keys(w.ranges).length) senzaBande.push(nome);
    if (p.avvisi.length) conAvvisi.push(`${nome}: ${p.avvisi.map(a => a.codice + ' ' + a.messaggio).join('; ')}`);
});
ok(rotte.length === 0, `tutte le ${armi.length} armi risolte`, rotte.join(', '));
ok(senzaBande.length === 0, 'nessuna banda persa nel parsing', senzaBande.join(', '));

console.log('\n=== 2. Combi Rifle: il caso della segnalazione #2 ===');
const combi = M.profiloArma('Combi Rifle');
console.log('   bande:', combi.bands.map(b => `${b.mod > 0 ? '+' : ''}${b.mod} (${b.label})`).join('  '));
ok(JSON.stringify(combi.bands.map(b => b.mod)) === '[3,3,-3,-3,-6,-6]',
   'MOD ufficiali +3 +3 / -3 -3 / -6 -6 (i vecchi +3/0/-3 erano di un altra edizione)');
ok(combi.bands[1].da === 8 && combi.bands[1].a === 16, 'griglia uniforme da 8": la seconda banda copre 8-16"');
ok(combi.bands.length === 6 && combi.bands[5].a === 48, 'sei bande fino a 48"');
ok(combi.burst === 3 && combi.dam === 7 && combi.ammo === 'N', 'burst 3, danno 7, munizione N');

console.log('\n=== 3. Chiavi anomale che prima funzionavano per caso ===');
const mk = M.profiloArma('Marksman Rifle');
console.log('   Marksman:', mk.bands.map(b => `${b.mod > 0 ? '+' : ''}${b.mod} (${b.label})`).join('  '));
ok(mk.bands.length > 0 && mk.bands.every(b => typeof b.mod === 'number'), 'Marksman Rifle: bande tutte numeriche');
const sniper = M.profiloArma('MULTI Sniper Rifle (AP Mode)');
ok(sniper.bands.length === 12 && sniper.bands[11].a === 96,
   'MULTI Sniper: 12 bande fino a 96" (il vecchio formato non poteva esprimerle)');
ok(sniper.bands[0].mod === -3 && sniper.bands[1].mod === 0,
   'la seconda banda del MULTI Sniper è 0, non +3');
ok(sniper.bands.filter(b => b.mod === -3).length >= 2,
   'due bande con lo STESSO MOD -3: impossibili col vecchio formato a chiavi');
ok(M.modDaChiaveGittata('m6b') === -6 && M.modDaChiaveGittata('p3_2') === 3, 'suffissi futuri (m6b, p3_2) gestiti');
ok(M.modDaChiaveGittata('vicino') === null, 'chiave incomprensibile -> null, non 0');

console.log('\n=== 4. Il bug dello split munizioni ===');
const emarat = M.profiloArma('E/Marat');
console.log('   E/Marat ammo:', JSON.stringify(emarat.ammoOpzioni));
ok(emarat.ammoOpzioni.length === 1 && emarat.ammoOpzioni[0] === 'E/M', '"E/M" resta intera (prima diventava "E" e "M")');
ok(M.opzioniMunizioni('N/A').length === 1 && M.opzioniMunizioni('N/A')[0] === 'N/A',
   '"N/A" resta intera, non spezzata in "N" e "A"');
// La voce di collaudo ARMA DA TEST MULTIPLA è stata rimossa dal database:
// la separazione delle munizioni si verifica su una stringa costruita qui,
// senza dipendere da un dato che il database non deve più portare.
// Il separatore è la VIRGOLA, non la barra: è esattamente ciò che tiene
// insieme "E/M" e "N/A", che altrimenti si spezzerebbero in due munizioni
// inesistenti.
const opz = M.opzioniMunizioni('N, AP, DA, EXP, SHOCK, E/M, PARA, T2, ECLIPSE, SMOKE, STUN, ADH, PLASMA, FLASH');
ok(opz.length === 14, `14 munizioni separate correttamente (trovate ${opz.length})`);
ok(opz.indexOf('E/M') >= 0, 'e "E/M" resta intera, non spezzata in "E" e "M"');
// Non si verifica qui che siano note al catalogo: ADH, PLASMA e FLASH non
// lo sono, e non devono esserlo — questo test guarda la SEPARAZIONE, e
// mescolarci il catalogo lo farebbe fallire per la ragione sbagliata.
ok(M.munizioneNota('E/M') && M.munizioneNota('SHOCK'),
   'le munizioni N5 restano riconosciute dal catalogo');

console.log('\n=== 5. Arma non trovata: niente default silenzioso ===');
const inesistente = M.profiloArma('Fucile Immaginario');
ok(inesistente.nonTrovata === true, 'nonTrovata = true');
ok(inesistente.avvisi.some(a => a.codice === 'A42'), 'avviso A42 emesso');
const vuoto = M.profiloArma('');
ok(vuoto.nonTrovata === true, 'nome vuoto -> nonTrovata');

console.log('\n=== 6. Ambiguità dichiarata invece che risolta a caso ===');
const amb = M.profiloArma('MULTI Sniper Rifle');
ok(amb.soloModalita === true && amb.modalita.length === 3,
   '"MULTI Sniper Rifle" è una voce-contenitore: chiede di scegliere una modalità');
ok(amb.bands.length === 0 && amb.avvisi.some(a => a.codice === 'A51b'),
   'e non espone bande: leggerle sarebbe l errore da intercettare');
ok(M.variantiArma('MULTI Sniper Rifle').length === 3,
   'variantiArma la espande nelle sue tre modalità');

console.log('\n=== 7. Notazioni di profilo estratte dal nome ===');
const conNotazione = M.profiloArma('Combi Rifle (+1B)');
ok(conNotazione.nome === 'Combi Rifle' && conNotazione.notazioni.includes('+1B'),
   '"Combi Rifle (+1B)" -> profilo Combi + notazione +1B',
   'nome=' + conNotazione.nome + ' notazioni=' + JSON.stringify(conNotazione.notazioni));
const modeName = M.profiloArma('MULTI Rifle (AP Mode)');
ok(modeName.nome === 'MULTI Rifle (AP Mode)' && modeName.notazioni.length === 0,
   'le parentesi che fanno parte del nome ufficiale non diventano notazioni');

console.log('\n=== 8. bandaPerDistanza ===');
ok(M.bandaPerDistanza(combi, 10).banda.mod === 3, '10" -> +3');
ok(M.bandaPerDistanza(combi, 16).banda.mod === 3, '16" (limite) -> +3');
ok(M.bandaPerDistanza(combi, 17).banda.mod === -3, '17" -> -3');
ok(M.bandaPerDistanza(combi, 48).banda.mod === -6, '48" -> -6');
const oltre = M.bandaPerDistanza(combi, 60);
ok(oltre.fuoriGittata === true && oltre.massimo === 48, '60" -> fuori gittata (max 48")');

console.log('\n=== 9. Integrazione col contratto (parte 1) ===');
M._fazione = 'NOMADI';
M._rosterProprio = [{ id: 'n1', alias: 'Alguacil Ana' }];
M._rosterNemico = [{ id: 'p1', alias: 'Fusilier Carlo', states: {} }];

const buono = M.creaAttacco({
    attaccante: M._rosterProprio[0], azione: M.AZIONI.BS_ATTACK, arma: combi,
    bersagli: [{ id: 'p1', name: 'Fusilier Carlo', burst: 3, rangeIndex: 1, rangeMod: -3 }]
});
ok(buono.ok, 'profiloArma reale accettato dal contratto', JSON.stringify(buono.errori));

const cattivo = M.creaAttacco({
    attaccante: M._rosterProprio[0], azione: M.AZIONI.BS_ATTACK,
    arma: M.profiloArma('Fucile Immaginario'),
    bersagli: [{ id: 'p1', name: 'Fusilier Carlo', burst: 1, rangeIndex: 0, rangeMod: 0 }]
});
ok(!cattivo.ok && cattivo.errori.some(e => e.codice === 'E08'),
   'arma inesistente -> invio bloccato dal contratto');

console.log('\n=== 10. Munizioni non coperte dal catalogo ===');
const senzaCatalogo = new Set();
armi.forEach(n => M.profiloArma(n).avvisi.filter(a => a.codice === 'A46')
    .forEach(a => senzaCatalogo.add(a.messaggio.match(/"([^"]+)"/)[1])));
console.log('   ' + (senzaCatalogo.size ? [...senzaCatalogo].join(', ') : '(nessuna)'));

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
