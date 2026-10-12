// @versione 2026-09-22.1 | test_azioni_equivalenti.js | proprieta`: chat TEST
// ================================================================
// Etichetta del menu e id del motore devono dare SEMPRE lo stesso esito.
// Suggerimento di MOTORE (motore 2026-09-22.1): gli id di M.AZIONI non sono
// uniformi — M.AZIONI.BS_ATTACK vale 'ATTACCO BS', M.AZIONI.CC_ATTACK vale
// 'CC_ATTACK' — e il catalogo scrive le etichette del menu. Ovunque il motore
// confronta un'azione in forma grezza, il BS puo` funzionare per coincidenza
// e il CC no. Un test di equivalenza li prende in blocco.
// Le coppie sono etichetta/id; ogni riga confronta l'esito, non il nome.
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

console.log('\n=== 1. azioneCanonica: etichetta e id finiscono nello stesso posto ===');
const COPPIE = [['ATTACCO BS', 'BS_ATTACK'], ['ATTACCO CC', 'CC_ATTACK'], ['SCHIVATA', 'DODGE'], ['HACKING', 'HACKING'], ['RESET', 'RESET']];
for (const [et, id] of COPPIE) {
    ok(M.azioneCanonica(et) === M.azioneCanonica(id), `"${et}" e "${id}" -> ${M.azioneCanonica(et)} / ${M.azioneCanonica(id)}`);
}

console.log('\n=== 2. scenografiaBersagliabile: ogni struttura, ogni coppia ===');
const AZ = [['ATTACCO BS', M.AZIONI.BS_ATTACK], ['ATTACCO CC', M.AZIONI.CC_ATTACK], ['HACKING', M.AZIONI.HACKING]];
const diffScen = [];
for (const st of window.DB_STRUTTURE.filter(s => String(s.tipo).toUpperCase() === 'STRUTTURA')) {
    for (const [et, id] of AZ) {
        const a = M.scenografiaBersagliabile(st, et, {}).ammesso, b = M.scenografiaBersagliabile(st, id, {}).ammesso;
        if (a !== b) diffScen.push(`${st.nome}: ${et}=${a}, ${id}=${b}`);
    }
}
ok(diffScen.length === 0, `nessuna differenza fra etichetta e id (${diffScen.length})` + (diffScen.length ? ' — ' + diffScen.join(' | ') : ''));

console.log('\n=== 3. La reazione nello scontro completo ===');
// Il reattivo dichiara la stessa reazione con l'etichetta o con l'id ARO:
// tipo di confronto, attributo e valore devono coincidere.
const scontro = (reazione) => {
    // "ATTACCO BS" contiene "CC" in ATTA-CC-O: con /CC/ costruivo uno scontro in
    // mischia per l'etichetta e uno a distanza per l'id, cioè due scontri
    // diversi. Segnalato da MOTORE, ed è la stessa specie del "Surprise
    // Attack (-3)" letto come Mimetismo: una ricerca più larga di quel che
    // si voleva trovare.
    const cc = /CC_ATTACK|ATTACCO CC/.test(reazione);
    const arma = M.profiloArma(cc ? 'CC Weapon' : 'Combi Rifle');
    const r = M.risolviScontro(
        { attaccante: alg, arma, azione: cc ? M.AZIONI.CC_ATTACK : M.AZIONI.BS_ATTACK, rangeIndex: 0, burst: 1, bersaglio: fus },
        { difensore: fus, azione: reazione, arma, rangeIndex: 0, bersaglio: alg });
    return { tipo: r.tipo, attributo: r.reattivo.attributo, mod: r.reattivo.mod };
};
for (const [et, id] of [['SCHIVATA', 'DODGE'], ['ATTACCO CC', 'CC_ATTACK'], ['ATTACCO BS', 'BS_ATTACK']]) {
    const a = scontro(et), b = scontro(id);
    ok(J(a) === J(b), `reazione "${et}" = "${id}" (${J(a)} / ${J(b)})`);
}

console.log('\n=== 4. Ogni lato dello scontro dice su che attributo tira ===');
// Il Hub stampa "Statistica Base (X)" solo se l'attributo c'e`: senza, la
// riga sparisce e il giocatore non vede la base del reattivo.
const cc = M.risolviScontro(
    { attaccante: alg, arma: M.profiloArma('CC Weapon'), azione: M.AZIONI.CC_ATTACK, burst: 1, bersaglio: fus },
    { difensore: fus, azione: 'CC_ATTACK', arma: M.profiloArma('CC Weapon'), bersaglio: alg });
ok(cc.attivo.attributo === 'CC', `attivo in mischia: attributo CC (${cc.attivo.attributo})`);
ok(cc.reattivo.attributo === 'CC', `reattivo in mischia: attributo CC (${cc.reattivo.attributo})`);

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
