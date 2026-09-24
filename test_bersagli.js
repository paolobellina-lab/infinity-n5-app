// Test bersagliValidi — node test_bersagli.js
global.window = global;
require('./catalogo_n5.js');
require('./database_comune.js');
const M = require('./motore_regole_n5.js');

let passati = 0, falliti = 0;
function ok(cond, nome, extra) {
    if (cond) { passati++; console.log(`  ✅ ${nome}`); }
    else { falliti++; console.log(`  ❌ ${nome}${extra ? '\n       ' + extra : ''}`); }
}

// --- un tavolo con un bersaglio per ogni stato interessante ---
const T = {
    normale:     { id: 'a', alias: 'Fusilier',   tipo: 'LI',  states: {} },
    incosciente: { id: 'b', alias: 'Bolt KO',    tipo: 'LI',  state: 'UNCONSCIOUS', states: { unconscious: true } },
    morto:       { id: 'c', alias: 'Orc Morto',  tipo: 'HI',  state: 'DEAD', states: {} },
    camo:        { id: 'd', alias: 'Croc Man',   tipo: 'LI',  deployState: 'CAMO', states: { camo: true } },
    imp:         { id: 'e', alias: 'Speculo',    tipo: 'LI',  deployState: 'IMP', states: { impersonation: true } },
    hidden:      { id: 'f', alias: 'Nascosto',   tipo: 'LI',  deployState: 'HIDDEN', states: {} },
    decoy:       { id: 'g', alias: 'Replica',    tipo: 'DECOY', states: {} },
    targeted:    { id: 'h', alias: 'Designato',  tipo: 'LI',  states: { targeted: true } },
    tag:         { id: 'i', alias: 'Squalo',     tipo: 'TAG', states: {} },
    hacker:      { id: 'j', alias: 'Hacker Pano', tipo: 'LI', skills: 'Hacker', states: {} },
    rem:         { id: 'k', alias: 'Fugazi',     tipo: 'REM', states: {} },
    engaged:     { id: 'l', alias: 'In Mischia', tipo: 'LI',  states: { engaged: true } }
};
const tavolo = Object.values(T);

M._fazione = 'NOMADI';
M._rosterNemico = tavolo;
M._rosterProprio = [
    { id: 'n1', alias: 'Alguacil' },
    { id: 'n2', alias: 'Occhio di Lince', skills: 'Multispectral Visor L3' },
    { id: 'n3', alias: 'Compagno KO', states: { unconscious: true } }
];

function g(azione, bers, opz) {
    return M.bersagliValidi(azione, [bers], opz || {})[0];
}
function ammesso(azione, bers, opz) { return g(azione, bers, opz).ammesso; }

console.log('\n=== 1. Regole valide per tutte le azioni ===');
[M.AZIONI.BS_ATTACK, M.AZIONI.CC_ATTACK, M.AZIONI.HACKING, M.AZIONI.INTUITIVO, M.AZIONI.SCOPRIRE].forEach(a => {
    if (ammesso(a, T.morto)) { falliti++; console.log(`  ❌ ${a} accetta un Morto`); }
    if (ammesso(a, T.hidden)) { falliti++; console.log(`  ❌ ${a} accetta uno Schieramento Nascosto`); }
});
ok(true, 'Morto e Schieramento Nascosto esclusi da ogni azione');

console.log('\n=== 2. LA DECISIONE: si può bersagliare un Incosciente? ===');
ok(ammesso(M.AZIONI.BS_ATTACK, T.incosciente), 'BS Attack su Incosciente: AMMESSO (il modulo BS lo escludeva: era un bug)');
const cc = g(M.AZIONI.CC_ATTACK, T.incosciente);
ok(cc.ammesso && cc.note.some(n => n.includes('Colpo di Grazia')),
   'CC Attack su Incosciente: ammesso, con nota sul Colpo di Grazia');

console.log('\n=== 3. Marker CAMO e IMP ===');
ok(!ammesso(M.AZIONI.BS_ATTACK, T.camo), 'BS Attack su Marker CAMO: negato (va Scoperto)');
ok(!ammesso(M.AZIONI.BS_ATTACK, T.imp), 'BS Attack su Marker IMP: negato');
ok(!ammesso(M.AZIONI.CC_ATTACK, T.camo), 'CC Attack su Marker CAMO: negato (no contatto base-base)');
ok(!ammesso(M.AZIONI.HACKING, T.camo), 'Hacking su Marker CAMO: negato');

const conMSV3 = g(M.AZIONI.BS_ATTACK, T.camo, { attaccante: M._rosterProprio[1] });
ok(conMSV3.ammesso && conMSV3.note.some(n => n.includes('L3')),
   'BS Attack su CAMO con Multispectral Visor L3: AMMESSO, con nota sul Mimetismo',
   conMSV3.motivo || '');

console.log('\n=== 4. Scoprire e Intuitivo sono filtri INVERSI ===');
ok(ammesso(M.AZIONI.SCOPRIRE, T.camo), 'Scoprire su Marker: ammesso');
ok(!ammesso(M.AZIONI.SCOPRIRE, T.normale), 'Scoprire su unità visibile: negato (niente da scoprire)');
ok(ammesso(M.AZIONI.INTUITIVO, T.camo), 'Intuitivo su Marker: ammesso');
ok(!ammesso(M.AZIONI.INTUITIVO, T.normale), 'Intuitivo su unità visibile: negato (usa un BS normale)');
ok(ammesso(M.AZIONI.INTUITIVO, T.normale, { fuoriLoF: true }),
   'Intuitivo su unità fuori LoF per Zona di Visibilità Zero: ammesso');

console.log('\n=== 5. Speculativo ignora la LoF ===');
ok(ammesso(M.AZIONI.SPECULATIVO, T.camo), 'Speculativo su Marker: ammesso (tira su un punto)');
ok(ammesso(M.AZIONI.SPECULATIVO, T.normale), 'Speculativo su unità visibile: ammesso');

console.log('\n=== 6. Guidato: primario vs secondario ===');
ok(ammesso(M.AZIONI.GUIDATO, T.targeted, { ruolo: 'primario' }), 'primario Bersagliato: ammesso');
ok(!ammesso(M.AZIONI.GUIDATO, T.normale, { ruolo: 'primario' }), 'primario NON Bersagliato: negato');
const sec = g(M.AZIONI.GUIDATO, T.normale, { ruolo: 'secondario' });
ok(sec.ammesso && sec.note.some(n => /sagoma/i.test(n)),
   'secondario non Bersagliato: ammesso, preso dalla sagoma');
// Il contenuto giusto: chi è preso da una Sagoma può SCHIVARE. Prima la
// nota diceva "fa solo il proprio Tiro Salvezza", ed era sbagliato.
ok(sec.note.some(n => /Schivare/i.test(n)),
   'e la nota dice che può Schivare, non "solo il Tiro Salvezza"');

console.log('\n=== 7. Hacking: filtro per programma ===');
ok(ammesso(M.AZIONI.HACKING, T.tag, { programma: 'CARBONITE' }), 'Carbonite su TAG: ammesso');
ok(ammesso(M.AZIONI.HACKING, T.rem, { programma: 'CARBONITE' }), 'Carbonite su REM: ammesso');
ok(!ammesso(M.AZIONI.HACKING, T.normale, { programma: 'CARBONITE' }), 'Carbonite su LI non hackerabile: negato');
ok(ammesso(M.AZIONI.HACKING, T.normale, { programma: 'SPOTLIGHT' }), 'Spotlight su chiunque: ammesso');
ok(ammesso(M.AZIONI.HACKING, T.hacker, { programma: 'TRINITY' }), 'Trinity su Hacker: ammesso');
ok(!ammesso(M.AZIONI.HACKING, T.tag, { programma: 'TRINITY' }), 'Trinity su TAG non hacker: negato');
ok(ammesso(M.AZIONI.HACKING, T.tag, { programma: 'TOTAL CONTROL' }), 'Total Control su TAG: ammesso');
ok(!ammesso(M.AZIONI.HACKING, T.rem, { programma: 'TOTAL CONTROL' }), 'Total Control su REM: negato');

console.log('\n=== 8. Decoy: bersagliabile, a differenza dei Marker ===');
const dec = g(M.AZIONI.BS_ATTACK, T.decoy);
ok(dec.ammesso && dec.note.some(n => n.includes('replica')),
   'Decoy: ammesso come modello, con avvertenza');

console.log('\n=== 9. Note informative, non blocchi ===');
const eng = g(M.AZIONI.BS_ATTACK, T.engaged);
ok(eng.ammesso && eng.note.some(n => n.includes('-6')), 'unità in mischia: ammessa, nota sul -6 BS');
const des = g(M.AZIONI.BS_ATTACK, T.targeted);
ok(des.ammesso && des.note.some(n => n.includes('+3')), 'unità Bersagliata: ammessa, nota sul +3');

console.log('\n=== 10. Supporto bersaglia ALLEATI ===');
const spec = M.SPEC[M.AZIONI.SUPPORTO_WIP];
ok(spec.schieramento === 'alleato', 'SUPPORTO_WIP dichiarato su schieramento alleato');
const tuttiAlleati = M.bersagliValidi(M.AZIONI.SUPPORTO_WIP);
ok(tuttiAlleati.length === 3, 'senza candidati espliciti pesca dal roster alleato');
ok(tuttiAlleati.filter(e => e.ammesso).length === 1 &&
   tuttiAlleati.find(e => e.ammesso).nome === 'Compagno KO',
   'solo l alleato Incosciente è un bersaglio valido per il Dottore');

console.log('\n=== 11. Il filtro restituisce TUTTI i candidati col motivo ===');
const tutti = M.bersagliValidi(M.AZIONI.BS_ATTACK, tavolo);
ok(tutti.length === tavolo.length, `${tavolo.length} candidati in, ${tutti.length} out (nessuno sparisce)`);
console.log('   BS Attack sul tavolo di prova:');
tutti.forEach(e => console.log(`     ${e.ammesso ? '✓' : '✗'} ${e.nome.padEnd(16)} ${e.ammesso ? (e.note[0] || '') : e.motivo}`));
ok(tutti.filter(e => !e.ammesso).every(e => !!e.motivo), 'ogni esclusione ha un motivo leggibile');

console.log('\n=== 12. Integrazione col contratto: blocco all invio ===');
const combi = M.profiloArma('Combi Rifle');
const suMarker = M.creaAttacco({
    attaccante: M._rosterProprio[0], azione: M.AZIONI.BS_ATTACK, arma: combi,
    bersagli: [{ id: 'd', name: 'Croc Man', burst: 3, rangeIndex: 0, rangeMod: 3 }]
});
ok(!suMarker.ok && suMarker.errori.some(e => e.codice === 'E15'),
   'BS Attack su Marker: invio BLOCCATO con E15',
   JSON.stringify(suMarker.errori.map(e => e.codice)));

const suKO = M.creaAttacco({
    attaccante: M._rosterProprio[0], azione: M.AZIONI.BS_ATTACK, arma: combi,
    bersagli: [{ id: 'b', name: 'Bolt KO', burst: 3, rangeIndex: 0, rangeMod: 3 }]
});
ok(suKO.ok, 'BS Attack su Incosciente: invio CONSENTITO', JSON.stringify(suKO.errori));

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
