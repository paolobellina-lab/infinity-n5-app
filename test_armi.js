// @versione 2026-10-19.1 | test_armi.js | proprieta`: chat TEST
// 2026-10-19.1: premessa 747 -> 745 (database 2026-10-19 (DATABASE): tolti evader_multi, warcor_flash_pulse_3 (Nomadi), kaplan_blitzen, warcor_flash_pulse (PanOceania); aggiunti i due Drummer da 47 pt).
// 2026-10-16.2: premessa 758 -> 747 (database 2026-10-16.2).
// 2026-10-16.1: premessa 761 -> 758 (database 2026-10-16.1).
// 2026-10-12.2: premessa 765 -> 761 (database .12.3, quattro profili
//    cancellati); i messaggi leggono il numero dal database.
// 2026-10-12.1: sezione "armiDisponibili non offre l'equipaggiamento"
//    (motore 2026-10-12.6). Le 39 voci di equipaggiamento e le 8 che hanno
//    un'azione loro o si piazzano, nominate, su tutti i 765 profili; la
//    guardia: nessuna voce senza scheda (nonTrovata) e` offerta come arma.
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


console.log('\n=== armiDisponibili non offre l equipaggiamento come arma (motore 2026-10-12.6) ===');
// Fino al motore 2026-10-12.2 le voci di `equip` senza scheda (X Visor,
// TinBot, Albedo, ECM...) passavano come nonTrovata ed erano offerte come
// arma. Misura del 12 ottobre, motore vecchio contro nuovo, stessi database:
// nell'ATTACCO BS sono uscite 47 voci su 449 profili, nell'ATTACCO CC 39 su
// 395, e nessuna voce e` entrata. Le 8 in piu` dell'Attacco BS sono quelle
// con un'azione loro (MediKit, GizmoKit, Deactivator) e quelle che si
// piazzano (FastPanda, Deployable Cover).
{
    global.document = global.document || { title: 'N', getElementById: () => ({ style: {}, innerHTML: '' }), querySelectorAll: () => [], addEventListener(){} };
    { const lg = console.log, lw = console.warn; console.log = () => {}; console.warn = () => {};
      require('./database_nomad.js'); require('./database_panoceania.js'); console.log = lg; console.warn = lw; }
    const TUTTI = [...(window.DB_NOMADI || []), ...(window.DB_PANOCEANIA || [])];
    const EQUIP_39 = ["360 Visor", "AI Motorcycle", "Albedo (-3)", "Albedo (-6)", "Baggage", "Bangbomb (+4)", "Biometric Visor", "Commlink [+1]", "Deployable Repeater", "ECM (Guided -6)", "ECM (Hacking -3)", "EVO Hacking Device", "Hacking Device", "Hacking Device (UPGRADE: Firewall -3)", "Hacking Device (UPGRADE: Oblivion +1B)", "Hacking Device (UPGRADE: Total Control +1B)", "Hacking Device (UPGRADE: Trinity)", "Hacking Device (UPGRADE: White Noise)", "Hacking Device (UPGRADE: Zero Pain)", "Hacking Device Plus", "Hacking Device Plus (UPGRADE: Fairy Dust)", "Hacking Device Plus (UPGRADE: Total Control SR-2)", "Hacking Device Plus (UPGRADE: Trinity SR-1)", "Holomask", "Holoprojector", "Killer Hacking Device", "Killer Hacking Device (UPGRADE: Carbonite)", "Killer Hacking Device (UPGRADE: Firewall -3)", "Killer Hacking Device (UPGRADE: Trinity -3)", "Killer Hacking Device (UPGRADE: Trinity AP)", "Motorcycle", "Multispectral Visor L1", "Multispectral Visor L2", "Multispectral Visor L3", "Nanoscreen", "Repeater", "TinBot: Firewall (-3)", "TinBot: Firewall (-6)", "X Visor"];
    const SOLO_FUORI_DAL_CC = ["Deactivator", "Deactivator (ReRoll)", "Deployable Cover", "FastPanda", "GizmoKit", "GizmoKit(+1B)", "MediKit", "MediKit (+1B)"];
    const voci = new Set(); TUTTI.forEach(u => M.dividiLista((u.weapon || '') + ',' + (u.equip || '')).forEach(v => voci.add(v)));
    const assentiDalDb = [...EQUIP_39, ...SOLO_FUORI_DAL_CC].filter(v => !voci.has(v));
    ok(TUTTI.length === 745 && assentiDalDb.length === 0,   // 745 dal database 2026-10-19 (Nomadi 19.1, PanOceania 19.2): 4 tolti, 2 aggiunti
         // 747 dal database 2026-10-16.2: tolte 11 righe doppie (4 Nomadi, 7 PanOceania)
         // 758 dal database 2026-10-16.1: cancellati anche fusilier_lt2, orc_lieutenant, orc_lieutenant_2
         // 761 dal 12 ottobre sera (database .12.3): cancellati evader_multi_tb, triggermen_multi, hannibal_cmd, hannibal_strategic
      
       `premessa: le ${EQUIP_39.length + SOLO_FUORI_DAL_CC.length} voci nominate stanno tutte nei profili (assenti: ${assentiDalDb.length}) — la prova morde`,
       JSON.stringify(assentiDalDb));
    // Il confronto e` senza spazi: il database scrive "Oblivion +1B", il motore
    // restituisce nomeRichiesto "Oblivion+1B". Senza normalizzare, due voci
    // passerebbero a vuoto.
    const ns = (x) => String(x).replace(/\s+/g, '');
    const offerte = (az) => { const m = {}; TUTTI.forEach(u => M.armiDisponibili(u, az).forEach(a => {
        [a.nomeRichiesto, a.nome].filter(Boolean).forEach(n => { (m[ns(n)] = m[ns(n)] || []).push(u.nome); }); })); return m; };
    const bs = offerte(M.AZIONI.BS_ATTACK), cc = offerte(M.AZIONI.CC_ATTACK);
    const inBs = [...EQUIP_39, ...SOLO_FUORI_DAL_CC].filter(v => bs[ns(v)]);
    ok(inBs.length === 0, `ATTACCO BS: nessuna delle 47 voci e\` offerta su nessuno dei ${TUTTI.length} (offerte: ${inBs.length})`,
       inBs.map(v => v + ' -> ' + bs[ns(v)][0]).slice(0, 5).join(' | '));
    const inCc = EQUIP_39.filter(v => cc[ns(v)]);
    ok(inCc.length === 0, `ATTACCO CC: nessuna delle 39 voci di equipaggiamento e\` offerta (offerte: ${inCc.length})`,
       inCc.map(v => v + ' -> ' + cc[ns(v)][0]).slice(0, 5).join(' | '));
    // La guardia: una voce senza scheda non diventa mai un bottone. Il giorno
    // che il database aggiunge un equipaggiamento che il motore non conosce,
    // esce qui col suo nome.
    const azioni = ['BS_ATTACK', 'CC_ATTACK', 'INTUITIVO', 'SPECULATIVO'];
    const senzaScheda = {};
    azioni.forEach(az => TUTTI.forEach(u => M.armiDisponibili(u, M.AZIONI[az]).filter(a => a.nonTrovata)
        .forEach(a => { senzaScheda[az + ': ' + (a.nomeRichiesto || a.nome)] = u.nome; })));
    ok(Object.keys(senzaScheda).length === 0, `su ${TUTTI.length} profili e quattro azioni, nessuna voce senza scheda (nonTrovata) e\` offerta`,
       JSON.stringify(senzaScheda).slice(0, 300));
    // Controprove: le armi vere restano, e il risultato resta un array.
    const nomi = (n, az) => M.armiDisponibili(TUTTI.find(u => u.nome === n), M.AZIONI[az]).map(a => a.nomeRichiesto || a.nome);
    const alg = M.armiDisponibili(TUTTI.find(u => u.nome === 'Alguacil (Combi Rifle)'), M.AZIONI.BS_ATTACK);
    ok(Array.isArray(alg) && alg.some(a => a.nome === 'Combi Rifle'), 'CONTROPROVA: e` un array, e l Alguacil ha ancora il Combi Rifle');
    const dk = nomi('Daktari (Doctor)', 'BS_ATTACK');
    ok(dk.indexOf('Pistol') >= 0 && dk.indexOf('MediKit') < 0, `Daktari, Attacco BS: la Pistol c e\`, il MediKit no (${JSON.stringify(dk)})`);
    const kc = nomi('Clockmaker (Engineer)', 'BS_ATTACK');
    ok(kc.indexOf('Combi Rifle') >= 0 && !kc.some(n => /GizmoKit|Deactivator/.test(n)), `Clockmaker, Attacco BS: Combi Rifle si\`, GizmoKit e Deactivator no (${JSON.stringify(kc)})`);
    const dCC = nomi('Daktari (Doctor)', 'CC_ATTACK');
    ok(dCC.indexOf('CC Weapon') >= 0, `CONTROPROVA in CC: il Daktari ha la CC Weapon (${JSON.stringify(dCC)})`);
}

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
