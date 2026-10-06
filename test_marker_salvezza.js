// @versione 2026-10-05.1 | test_marker_salvezza.js | proprieta`: chat MOTORE
// ================================================================
// IL MARKER COSTRETTO A UN TIRO SALVEZZA.
// Regola: un segnalino che e` costretto a un Tiro Salvezza perde lo stato
// ANCHE SE LO SUPERA. Vale per CAMO (riga 13638), Decoy (13781), Holoecho
// (13993) e HoloMask (14073) — e NON per l'Impersonation, la cui lista di
// cancellazione quella voce non ce l'ha (verifica REGOLE del 5 ottobre).
//
// DECISIONE DI PAOLO: il motore NON cambia lo stato e non fa domande. Dice
// soltanto, nel risultato del calcolatore, che quel segnalino va girato.
// Quindi queste prove guardano la NOTA e il campo informativo, non lo stato:
// chiedere allo stato di cambiare sarebbe pretendere una regola che
// abbiamo deciso di non applicare.
// ================================================================
let passati = 0, falliti = 0;
const ok = (c, m) => { if (c) { passati++; console.log('  ✅ ' + m); } else { falliti++; console.log('  ❌ ' + m); } };
const J = JSON.stringify;

global.window = global;
require('./catalogo_n5.js'); require('./database_comune.js');
require('./database_nomad.js'); require('./database_panoceania.js');
const M = require('./motore_regole_n5.js');
const T = [].concat(window.DB_NOMADI, window.DB_PANOCEANIA);
const base = T.find(u => /^Intruder \(HMG\)/.test(u.nome)) || T.find(u => /^Intruder/.test(u.nome));
const con = (st, deploy) => Object.assign(JSON.parse(J(base)),
    { deployState: deploy || 'NORMAL', state: deploy || 'ACTIVE', states: st });
const combi = M.profiloArma('Combi Rifle');

console.log('\n=== 1. I quattro stati che cadono, e quello che non cade ===');
const ST = window.CATALOGO_N5.STATI || {};
[['camo', 13638], ['decoy', 13781], ['holoecho', 13993], ['holomask', 14073]].forEach(([k, riga]) => {
    ok(ST[k] && ST[k].cadePerTiroSalvezza && ST[k].cadePerTiroSalvezza.riga === riga,
       `${k}: cade per Tiro Salvezza, riga ${riga} (${J(ST[k] && ST[k].cadePerTiroSalvezza)})`);
});
// L'Impersonation NON ce l'ha, ed e` la prova che distingue "il campo e` stato
// messo a ragion veduta" da "il campo e` stato messo a tutti i Marker".
ok(!(ST.imp && ST.imp.cadePerTiroSalvezza),
   `Impersonation: nessun campo — la sua lista non ha quella voce (${J(ST.imp && ST.imp.cadePerTiroSalvezza)})`);

console.log('\n=== 2. La nota arriva nel Tiro Salvezza ===');
const salvezzaDi = (stati, deploy) => M.tiroSalvezza(con(stati, deploy), { arma: combi });
const inCamo = salvezzaDi({ camo: true }, 'CAMO');
ok(inCamo.cancellaMarker === true, `in CAMO: cancellaMarker true (${J(inCamo.cancellaMarker)})`);
ok((inCamo.note || []).some(n => /13638/.test(n)), 'e la nota cita la riga del regolamento');
ok((inCamo.note || []).some(n => /anche|superat/i.test(n)),
   'e dice la parte che si dimentica: vale ANCHE se la salvezza riesce');

console.log('\n=== 3. I numeri della salvezza non cambiano ===');
// La nota informa, non calcola. Se un domani toccasse il valore, al tavolo si
// tirerebbe un numero diverso per una regola che riguarda il segnalino.
const modello = salvezzaDi({}, 'NORMAL');
ok(inCamo.valoreSuccesso === modello.valoreSuccesso,
   `stesso VS con e senza Marker: ${inCamo.valoreSuccesso} e ${modello.valoreSuccesso}`);
ok(modello.cancellaMarker !== true, `controprova: un Modello non ha il campo (${J(modello.cancellaMarker)})`);
ok((modello.note || []).every(n => !/13638/.test(n)), 'e nessuna nota sul Marker');

console.log('\n=== 4. Gli altri tre stati, e l Impersonation che tace ===');
[['decoy', { decoy: true }, 13781], ['holoecho', { holoecho: true }, 13993], ['holomask', { holomask: true }, 14073]]
    .forEach(([nome, stati, riga]) => {
        const s = salvezzaDi(stati, 'NORMAL');
        ok(s.cancellaMarker === true && (s.note || []).some(n => new RegExp(String(riga)).test(n)),
           `${nome}: nota con la riga ${riga} (${J(s.cancellaMarker)})`);
    });
const imp = salvezzaDi({ impersonation: true, imp: true }, 'IMP');
ok(imp.cancellaMarker !== true,
   'Impersonation: nessuna nota, perché la regola non lo elenca (' + J(imp.cancellaMarker) + ')');

console.log('\n=== 5. Lo stato NON viene toccato ===');
// La decisione di Paolo, resa prova: il motore dice e non fa. Se un domani
// cambiasse lo stato da solo, il giocatore si troverebbe il segnalino tolto
// senza averlo girato — e il tabellone direbbe una cosa che al tavolo non è
// ancora successa.
const prima = con({ camo: true }, 'CAMO');
const copia = JSON.parse(J(prima));
M.tiroSalvezza(prima, { arma: combi });
ok(J(prima.states) === J(copia.states) && prima.deployState === copia.deployState,
   'dopo il Tiro Salvezza l unità è intatta: la nota informa, non applica');


console.log('\n=== 6. Le note degli ordini SENZA TIRO arrivano nel risultato ===');
// Difetto corretto il 5 ottobre: nel ramo "nessun bersaglio" di risolviPayload
// attivo.note era sempre vuoto, quindi tutto quello che il modulo aveva da
// dire — compresa la nota del rientro — si perdeva fra la busta e lo schermo.
// È la forma della settimana: un dato prodotto che non arriva a chi legge.
const intruder = con({}, 'NORMAL');
const rientro = M.rientraInCamo(intruder, { fuoriDallaLoF: true }, {});
ok(rientro.esito === 'RIENTRA', `il rientro riesce (${rientro.esito})`);
ok((rientro.note || []).length > 0, `e il motore produce ${(rientro.note || []).length} note`);
const busta = {
    attacchi: [{ attaccante: intruder.nome, azione: 'RIENTRARE IN CAMO', arma: null, bersagli: [],
                 burstDisponibile: 0, regole: { senzaTiro: true, note: rientro.note } }],
    attivo: intruder.nome
};
const ctx = { trovaUnita: (n) => intruder };
const scontri = M.risolviPayload(busta, [], ctx);
ok(scontri.length > 0, `il risultato ha uno scontro (${scontri.length})`);
ok(scontri[0] && (scontri[0].attivo.note || []).length > 0,
   `e le note del modulo ci sono (${scontri[0] && (scontri[0].attivo.note || []).length})`);
// Controprova: un'azione CON tiro non deve ereditare le note della busta, o
// ogni Schivata si porterebbe dietro il testo di un altro ordine.
const conTiro = {
    attacchi: [{ attaccante: intruder.nome, azione: 'SCHIVATA', arma: null, bersagli: [],
                 burstDisponibile: 0, regole: { note: ['nota che non deve comparire'] } }],
    attivo: intruder.nome
};
const sc2 = M.risolviPayload(conTiro, [], ctx);
ok(!sc2.length || !(sc2[0].attivo.note || []).some(n => /non deve comparire/.test(n)),
   'controprova: un azione con tiro non eredita le note della busta');

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
