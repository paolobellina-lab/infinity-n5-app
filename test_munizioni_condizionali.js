// @versione 2026-09-23.1 | test_munizioni_condizionali.js | proprieta`: chat TEST
// Tratti condizionali — node test_munizioni_condizionali.js
global.window = global;
require('./catalogo_n5.js'); require('./database_comune.js');
const M = require('./motore_regole_n5.js');

let passati = 0, falliti = 0;
function ok(c, n, e) { if (c) { passati++; console.log(`  ✅ ${n}`); } else { falliti++; console.log(`  ❌ ${n}${e ? '\n       ' + e : ''}`); } }

const fus   = { alias: 'Fusilier', arm: 1, bts: 0, w: 1, s: 2 };   // VITA
const gecko = { alias: 'Gecko',    arm: 5, bts: 3, str: 3, s: 5 }; // STR

console.log('\n=== 1. La condizione È PARTE DELLA REGOLA ===');
// "This weapon applies the combination of DA+Shock Special Ammunition to
//  targets with the Vitality (VITA) Attribute." (wiki N5, Traits)
// Mettere DA+SHOCK e salvTiri 2 fissi nel database avrebbe prodotto due
// salvezze obbligatorie anche contro STR, che la regola esclude.
ok(M.haAttributo(fus, 'VITA') === true, 'il Fusilier ha VITA');
ok(M.haAttributo(gecko, 'VITA') === false, 'il Gecko no');
ok(M.haAttributo(gecko, 'STR') === true, 'il Gecko ha STR');

console.log('\n=== 2. Tutti e sei i Viral, ENTRAMBI i rami ===');
// Se passa un caso solo, la condizione non c'è.
// SETTE, non sei: c'è anche il Viral CC Weapon, che non era nell'elenco.
const VIRAL = ['Viral Rifle', 'Viral Combi Rifle', 'Viral Marksman Rifle',
               'Viral Sniper Rifle', 'Viral Pistol', 'Viral Mine', 'Viral CC Weapon'];
VIRAL.forEach(function (n) {
    const a = M.profiloArma(n);
    if (a.nonTrovata) { ok(false, `${n}: non nel database`); return; }
    const vVita = M.tiroSalvezza(fus, { arma: a });
    const vStr  = M.tiroSalvezza(gecko, { arma: a });
    ok(vVita.tiri === 2, `${n} vs VITA: DUE tiri (ottenuto ${vVita.tiri})`);
    ok(vStr.tiri === 1,  `${n} vs STR: UN tiro (ottenuto ${vStr.tiri})`);
    ok(vVita.attributo === 'BTS' && vStr.attributo === 'BTS',
       `${n}: salvezza su BTS in entrambi i casi`);
});

console.log('\n=== 3. I numeri esatti del Viral Rifle ===');
const vr = M.profiloArma('Viral Rifle');
const sv = M.tiroSalvezza(fus, { arma: vr });
ok(sv.valoreSuccesso === 7, `vs Fusilier: BTS VS 7 (ottenuto ${sv.valoreSuccesso})`);
ok(sv.tiri === 2, 'con due tiri');
ok(sv.note.some(n => /DA\+Shock/i.test(n)), 'e la nota dice che si applica DA+Shock');
const ss = M.tiroSalvezza(gecko, { arma: vr });
ok(ss.valoreSuccesso === 10, `vs Gecko: BTS VS 10 (ottenuto ${ss.valoreSuccesso})`);
ok(ss.tiri === 1, 'con un tiro solo');
ok(ss.note.some(n => /senza VITA/i.test(n)), 'e la nota spiega che il BioWeapon non lo potenzia');

console.log('\n=== 4. Il database resta com era: nessun valore fisso ===');
const voce = window.RULES_WEAPONS['Viral Rifle'];
ok(voce.ammo === 'N', 'ammo resta N nel database');
ok(voce.salvTiri === 1, 'e salvTiri resta 1');
ok(/BioWeapon/.test(String(voce.traits)), 'la condizione vive nel Tratto, non nei campi');

console.log('\n=== 5. La forma vale per tutti, non solo per il Viral ===');
const C = window.CATALOGO_N5.TRATTI_CONDIZIONALI;
ok(!!C, 'TRATTI_CONDIZIONALI esiste');
ok(C !== window.CATALOGO_N5.TRATTI_ARMA,
   'ed è una sezione diversa da TRATTI_ARMA, che è la mappa arma -> Tratti');
ok(C['BioWeapon'].condizione.attributoBersaglio === 'VITA', 'BioWeapon: condizione su VITA');
ok(C['BioWeapon'].fonte === 'wiki N5, pagina Traits', 'con la fonte');

console.log('\n=== 6. Tre esiti, non due ===');
// Il terzo lo abbiamo trovato leggendo la pagina Traits: un Tratto può
// annullare il Tiro Salvezza del tutto, non solo cambiare la munizione.
ok(C['BioWeapon'].seVero.munizione === 'DA+SHOCK', 'esito 1: munizione potenziata');
ok(C['Vs'].seFalso.nessunEffetto === true, 'esito 2: NESSUN Tiro Salvezza');
// Il terzo esito esiste nella struttura, ma ARM=0 non è più l esempio:
// quel dato vive in salvAttr. Si verifica sulla forma, non su una voce
// che abbiamo deliberatamente tolto.
ok(typeof C['ARM=0'] === 'string' && /salvAttr/.test(C['ARM=0']),
   'ARM=0 è un rimando a salvAttr, non una seconda regola');

// il caso "nessun effetto" funziona
window.RULES_WEAPONS['ARMA VS VITA'] = { traits: ['Vs (VITA)'], b: 1, dam: 10, ammo: 'N', salvAttr: 'ARM', salvTiri: 1 };
const solo = M.profiloArma('ARMA VS VITA');
ok(M.tiroSalvezza(fus, { arma: solo }).offensivo === true, 'vs VITA: il Tiro Salvezza si fa');
const niente = M.tiroSalvezza(gecko, { arma: solo });
ok(niente.offensivo === false && niente.tiri === 0,
   'vs STR: NESSUN Tiro Salvezza, l arma non ha effetto');
ok(/nessun effetto|non ha effetto/i.test(niente.motivo || ''), 'col motivo');
delete window.RULES_WEAPONS['ARMA VS VITA'];

console.log('\n=== 7. Il non verificato è dichiarato ===');
ok(C['Albedo'].fonte === 'DA VERIFICARE', 'Albedo: fonte non riletta dalla scheda');
window.RULES_WEAPONS['ARMA ALBEDO'] = { traits: ['Albedo'], b: 1, dam: 10, ammo: 'N', salvAttr: 'ARM', salvTiri: 1 };
ok(M.trattiCondizionali(M.profiloArma('ARMA ALBEDO'), fus).avvisi.some(a => a.codice === 'A69'),
   'e il motore lo segnala invece di applicarlo in silenzio');
delete window.RULES_WEAPONS['ARMA ALBEDO'];

console.log('\n=== 8. Le armi senza Tratti condizionali non cambiano ===');
ok(M.tiroSalvezza(fus, { arma: M.profiloArma('Combi Rifle') }).valoreSuccesso === 8,
   'Combi Rifle: ARM VS 8 come prima');
ok(M.tiroSalvezza(fus, { arma: M.profiloArma('Combi Rifle') }).tiri === 1, 'un tiro');
ok(M.trattiCondizionali(M.profiloArma('Combi Rifle'), fus).applicati.length === 0,
   'e nessun Tratto condizionale rilevato');

console.log('\n=== 9. Sono SETTE le armi col BioWeapon ===');
const conBio = Object.keys(window.RULES_WEAPONS)
    .filter(k => /BioWeapon/i.test(String(window.RULES_WEAPONS[k].traits)));
ok(conBio.length === 7, `sette armi, non sei (trovate ${conBio.length}: ${conBio.join(', ')})`);
ok(conBio.indexOf('Viral CC Weapon') >= 0, 'compreso il Viral CC Weapon, che mancava nell elenco');

console.log('\n=== 10. 🔴 ARM=0 vive in salvAttr, NON fra i tratti condizionali ===');
// Il regolamento lo elenca fra i Tratti, il Weapon Chart lo mette nella
// colonna "Saving Roll Attribute": due letture della stessa riga. Il dato
// vive in salvAttr, che ha già la precedenza sulla munizione — lo stesso
// meccanismo delle Breaker su BTS/2. Duplicarlo avrebbe creato due fonti.
const arm3 = { alias: 'Fusilier', arm: 3, bts: 0, w: 1, s: 2 };
const conARM0 = Object.keys(window.RULES_WEAPONS)
    .filter(k => String(window.RULES_WEAPONS[k].salvAttr) === 'ARM=0');
// Il numero non si fissa (era "=== 5"): se DATABASE aggiunge un'arma K1, e`
// crescita, non difetto. Si asserisce la regola su TUTTE: ognuna da` un Tiro
// Salvezza vero, su ARM, con l'ARM azzerata. ARM=0 NON vuol dire "nessun
// Tiro Salvezza" (chiarimento di DATABASE): il tiro c'e`, e vale solo il PS.
ok(conARM0.length > 0, `armi con salvAttr ARM=0: ${conARM0.length}`);
const sbagliateARM0 = conARM0.filter(k => {
    const a = M.profiloArma(k), sv = M.tiroSalvezza(arm3, { arma: a, ammo: a.ammo });
    return !(sv.offensivo !== false && sv.attributo === 'ARM' && sv.valoreSuccesso === a.dam);
});
ok(sbagliateARM0.length === 0,
   `ognuna: Tiro Salvezza su ARM con l'ARM azzerata, VS = PS dell'arma (sbagliate: ${JSON.stringify(sbagliateARM0)})`);
['K1 Combi Rifle', 'K1 Marksman Rifle', 'K1 Sniper Rifle',
 'Monofilament CC Weapon', 'Monofilament Mine'].forEach(function (n) {
    ok(conARM0.indexOf(n) >= 0, `${n}: presente`);
});
ok(M.tiroSalvezza(arm3, { arma: M.profiloArma('K1 Combi Rifle') }).valoreSuccesso === 7,
   'K1 contro ARM 3: VS 7, l ARM è azzerata — funziona senza tratto condizionale');
ok(M.tiroSalvezza(arm3, { arma: M.profiloArma('Combi Rifle') }).valoreSuccesso === 10,
   'e un Combi normale resta VS 10');
ok(typeof window.CATALOGO_N5.TRATTI_CONDIZIONALI['ARM=0'] === 'string',
   'in TRATTI_CONDIZIONALI resta solo un rimando, non una seconda regola');

console.log('\n=== 11. "Targetless" NON è "Target" ===');
// Undici armi hanno il Tratto Targetless, che contiene "Target" ma è il suo
// opposto: un confronto per prefisso le prenderebbe tutte.
// 🔴 CHIAVI o OGGETTI DISTINTI. Undici CHIAVI portano il Tratto, ma due
// sono alias della stessa voce: gli oggetti distinti sono nove. È lo
// stesso errore che avevo segnalato alla chat DATABASE sullo sweep delle
// armi, e l ho appena rifatto io.
const targetless = Object.keys(window.RULES_WEAPONS)
    .filter(k => /Targetless/i.test(String(window.RULES_WEAPONS[k].traits)));
const targetlessDistinti = new Set(targetless.map(k => window.RULES_WEAPONS[k]));
// 🔴 La RELAZIONE, non i valori fissi: regge anche quando il database
// cresce. I due alias sono "Mine Dispenser" e "Mine Dispenser(Cybermines)",
// che puntano entrambi a "Mine Dispenser (Cybermines)".
// Gli alias sono enumerabili o no a seconda del database: si contano
// quelli che Object.keys vede DAVVERO, invece di assumerne 19.
const targetlessAlias = targetless.filter(k => k in (window.RULES_WEAPONS_ALIAS || {}));
ok(targetless.length - targetlessAlias.length === targetlessDistinti.size,
   `chiavi viste (${targetless.length}) - alias visti (${targetlessAlias.length}) = voci distinte (${targetlessDistinti.size})`);
ok(targetlessDistinti.size >= 1, 'e almeno una voce porta davvero il Tratto');
let falsiPositivi = 0;
targetless.forEach(function (k) {
    const t = M.trattiCondizionali(M.profiloArma(k), arm3);
    if (t.applicati.length > 0 || t.avvisi.length > 0) falsiPositivi++;
});
ok(falsiPositivi === 0, `nessun falso positivo su nessuna delle 11 chiavi (trovati ${falsiPositivi})`);
// e il confine di parola regge su un caso costruito
window.RULES_WEAPONS['ARMA FINTA VS'] = { traits: ['Targetless', 'Suppressive Fire'], b: 1, dam: 5, ammo: 'N', salvAttr: 'ARM', salvTiri: 1 };
ok(M.trattiCondizionali(M.profiloArma('ARMA FINTA VS'), arm3).applicati.length === 0,
   'un Tratto che CONTIENE il nome di un altro non lo attiva');
delete window.RULES_WEAPONS['ARMA FINTA VS'];

console.log('\n=== 12. E il Viral non si è rotto ===');
ok(M.tiroSalvezza({ alias: 'F', arm: 1, bts: 0, w: 1, s: 2 },
    { arma: M.profiloArma('Viral Rifle') }).tiri === 2,
   'Viral Rifle contro VITA: ancora due tiri');

console.log('\n=== 13. Contare le CHIAVI non è contare le armi ===');
// Chiavi, alias e voci distinte si misurano, non si ricordano. Object.keys() sembra la cosa
// ovvia da fare, e per questo l errore è ricomparso due volte a tre
// settimane di distanza — una per parte.
const conto = M.contaArmi();
ok(conto.coerente === true,
   `chiavi - alias enumerabili = voci distinte: ${conto.chiavi} - ${conto.aliasEnumerabili} = ${conto.distinti}`);
// Il numero degli alias NON si fissa (era "=== 19"): si misura contro la
// tabella che li dichiara. Un alias nuovo, dichiarato, e` una crescita
// legittima; un alias che non sta in RULES_WEAPONS_ALIAS e` il difetto.
const dichiarati = Object.keys(window.RULES_WEAPONS_ALIAS || {}).length;
ok(dichiarati > 0 && conto.alias === dichiarati,
   `gli alias contati sono quelli DICHIARATI in RULES_WEAPONS_ALIAS (${conto.alias} = ${dichiarati})`);
ok(conto.avviso === null, 'nessun doppione non dichiarato');
ok(M.armiCanoniche().length === conto.distinti,
   'armiCanoniche(): tante quante le voci distinte, con o senza alias enumerabili');
ok(M.armiVere().length === conto.armiVere,
   `armiVere(): ${conto.armiVere}, cioè i distinti meno i ${conto.contenitori} contenitori`);
ok(M.contenitoriArma().every(k => window.RULES_WEAPONS[k].modalita),
   'e i contenitori hanno tutti `modalita`');

// 🔴 Il valore del controllo sta qui: un doppione NON dichiarato lo rompe.
window.RULES_WEAPONS['DOPPIONE NON DICHIARATO'] = window.RULES_WEAPONS['Combi Rifle'];
const rotto = M.contaArmi();
ok(rotto.coerente === false, 'un doppione non dichiarato rende il conto incoerente');
ok(rotto.avviso && rotto.avviso.codice === 'A77', 'con A77');
ok(/RULES_WEAPONS_ALIAS/.test(rotto.avviso.dettaglio || ''),
   'e il dettaglio dice dove andrebbe dichiarato');
delete window.RULES_WEAPONS['DOPPIONE NON DICHIARATO'];
ok(M.contaArmi().coerente === true, 'tolto il doppione, il conto torna');

console.log('\n=== 14. E21 è generico sui contenitori, non scritto per Drop Bears ===');
const portatore = { id: 'n1', alias: 'P', skills: '', states: {}, usiSpesi: {} };
['Drop Bears', 'Plasma Carbine', 'Missile Launcher', 'Feuerbach', 'Kobra Pistol']
  .forEach(function (n) {
    const a = M.profiloArma(n);
    if (a.nonTrovata) { ok(true, `${n}: non nel database, saltato`); return; }
    const e = M.creaDeployable(portatore, a, { ordineId: 'o1' });
    ok(e.errori.some(x => x.codice === 'E21'), `${n}: E21, senza modalità`);
});

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
