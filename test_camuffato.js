// @versione 2026-09-22.1 | test_camuffato.js | proprieta`: chat TEST
// ================================================================
// Il segnalino Camuffato e l'uso singolo del Camouflage.
// Richiesta della chat REGOLE.
//
// FONTI
//   REGOLE_N5_v5_1_1.txt riga 13607: "Camouflaged Markers can possess the
//     Mimetism Skill, so Camouflaged Markers indicate the MOD level that
//     Mimetism applies, if they have it." Il MOD del segnalino e` quello del
//     MIMETISMO del profilo. Nient'altro.
//   FAQ_N5_INDICE.md F07: Camouflage (1 Use) — la truppa schierata come
//     Modello puo` entrare in Camuffato piu` tardi; ma se ha tentato di
//     schierarsi come Marker e ha fallito l'Infiltrazione, l'uso e` consumato.
//
// IL CONTRATTO (logica_stati.js di motore 2026-09-21.25):
//   lo STATO e` uno solo, "CAMO" — nessun livello, come dice la regola;
//   il MOD si vede nell'ICONA, che viene da M.valoreMimetismo(unita):
//   -6 -> icon_camo6 · -3 -> icon_camo3 · nessun Mimetismo -> icon_camo.
// La prima versione di questo test asseriva CAMO_0 / CAMO_3 / CAMO_6 come
// stato: era il contratto vecchio, con il livello dentro lo stato. Il
// difetto da cui era nata — il "-3" di Surprise Attack letto come
// Mimetismo — resta la controprova della sezione 1.
// ================================================================
let passati = 0, falliti = 0;
const ok = (c, m) => { if (c) { passati++; console.log('  ✅ ' + m); } else { falliti++; console.log('  ❌ ' + m); } };

global.window = global;
const elementi = {};
const el = (id) => ({ id, checked: false, value: '', innerHTML: '', innerText: '', src: '', title: '', style: {},
    appendChild(){}, addEventListener(){}, setAttribute(){}, classList: { add(){}, remove(){}, toggle(){} } });
global.document = {
    title: 'NOMADS', getElementById: (id) => (elementi[id] = elementi[id] || el(id)),
    querySelectorAll: () => Object.values(elementi), querySelector: () => el('q'),
    createElement: () => el('nuovo'), addEventListener(){}, body: el('body')
};
global.localStorage = { getItem: () => null, setItem(){}, removeItem(){} };
global.alert = () => {};
require('./catalogo_n5.js'); require('./database_comune.js');
require('./database_nomad.js'); require('./database_panoceania.js');
const M = require('./motore_regole_n5.js');
require('./logica_stati.js');
window.renderFTPanel = () => {};

const TUTTI = [...window.DB_NOMADI, ...window.DB_PANOCEANIA];
const profilo = (nome) => {
    const u = TUTTI.find(x => x.nome === nome);
    if (!u) throw new Error('profilo assente dal database: ' + nome);
    return JSON.parse(JSON.stringify(u));
};
// Apre la pagina degli stati e legge cosa propone per il Camuffato.
// L'icona si legge dall'attributo src="...": il markup contiene anche un
// ripiego onerror con 'img/icon_camo.png' fra apici singoli, e una ricerca
// meno precisa troverebbe sempre quello — il test passerebbe con il difetto.
const apri = (u) => { window.roster = [u]; window.apriPaginaStati(0);
    const html = (elementi['states-content'] || {}).innerHTML || '';
    const m = html.match(/src="(img\/icon_camo\d?\.png)"/);
    return { stato: window.tempCamoState, icona: m ? m[1].replace('img/', '').replace('.png', '') : null }; };
const iconaAttesa = (u) => { const m = M.valoreMimetismo(u); return m <= -6 ? 'icon_camo6' : m <= -3 ? 'icon_camo3' : 'icon_camo'; };

console.log('\n=== 0. I profili sono quelli che la regola presuppone ===');
const HELOT    = 'Helot Militiaman (Surprise Attack [-3], Camouflage, Red Fury)';
const BEAST    = 'Beasthunters (Surprise Attack [-3], Camouflage, Forward Deployment [+8"], AP Mine)';
const INTRUDER = 'Intruder (HMG)';
const SPEKTR   = 'Spektr (MULTI Sniper Rifle)';
const LIBERTO  = 'Liberto';
const sk = (n) => profilo(n).skills || '';
ok(/Camouflage/.test(sk(HELOT)) && /Surprise Attack \(-3\)/.test(sk(HELOT)) && !/Mimetism/.test(sk(HELOT)),
   'Helot: Camouflage e Surprise Attack (-3), niente Mimetism');
ok(/Camouflage/.test(sk(INTRUDER)) && /Mimetism \(-3\)/.test(sk(INTRUDER)), 'Intruder: Mimetism (-3)');
ok(/Camouflage/.test(sk(SPEKTR)) && /Mimetism \(-6\)/.test(sk(SPEKTR)), 'Spektr: Mimetism (-6)');
ok(/Camouflage/.test(sk(LIBERTO)) && !/-3|-6/.test(sk(LIBERTO)), 'Liberto: Camouflage, nessun "-3" o "-6" nel profilo');

console.log('\n=== 1. Un solo stato, il MOD nell\'icona ===');
const a = (n) => apri(profilo(n));
for (const n of [HELOT, INTRUDER, SPEKTR, LIBERTO]) {
    ok(a(n).stato === 'CAMO', `${n.split(' (')[0]}: stato "CAMO", senza livello (${a(n).stato})`);
}
ok(a(SPEKTR).icona === 'icon_camo6', `Spektr, Mimetism -6: icon_camo6 (${a(SPEKTR).icona})`);
ok(a(INTRUDER).icona === 'icon_camo3', `Intruder, Mimetism -3: icon_camo3 (${a(INTRUDER).icona})`);
ok(a(LIBERTO).icona === 'icon_camo', `Liberto, senza Mimetism: icon_camo (${a(LIBERTO).icona})`);
// Controprova: il -3 della Sorpresa non e` Mimetismo.
ok(a(HELOT).icona === 'icon_camo', `controprova — Helot, Surprise Attack (-3) senza Mimetism: icon_camo, non icon_camo3 (${a(HELOT).icona})`);

// La relazione su tutti i profili con Camouflage: regge quando il database
// cresce, dove un elenco di nomi no.
const camuffabili = TUTTI.filter(u => /Camouflage/i.test(u.skills || ''));
const discordi = camuffabili.filter(u => { const r = apri(JSON.parse(JSON.stringify(u))); return r.stato !== 'CAMO' || r.icona !== iconaAttesa(u); });
ok(discordi.length === 0,
   `su ${camuffabili.length} profili con Camouflage: stato CAMO e icona = Mimetismo del profilo (discordi: ${discordi.length}` +
   (discordi.length ? ', es. ' + discordi.slice(0, 3).map(u => u.nome).join(' | ') : '') + ')');

console.log('\n=== 2. Beasthunters: segnalino CAMO (-3) ===');
// Chiuso da REGOLE: la regola e` una sola (riga 13607) — il segnalino mostra
// il MOD del Mimetism del profilo; il Camouflage da solo non da` MOD.
// I Beasthunters hanno Mimetism (-3): stanno fra i casi CON MOD, accanto
// all'Intruder. La prima richiesta li metteva fra i "senza MOD" perche` la
// ricerca si fermava sulle virgolette di Forward Deployment (+8") e non vedeva
// il Mimetism che segue: un testo di skill con le virgolette dentro va letto
// per intero, non fino al primo apice.
const beastTutti = TUTTI.filter(u => /^Beasthunter/.test(u.nome));
ok(beastTutti.length > 0 && beastTutti.every(u => /Mimetism \(-3\)/.test(u.skills || '')),
   `Beasthunters: tutti i ${beastTutti.length} profili portano Mimetism (-3)`);
ok(beastTutti.filter(u => /Camouflage/.test(u.skills || '')).every(u => apri(JSON.parse(JSON.stringify(u))).icona === 'icon_camo3'),
   'quelli con Camouflage: icon_camo3, come l\'Intruder');
ok(/Forward Deployment \(\+8"\)/.test(profilo(BEAST).skills) && /Mimetism/.test(profilo(BEAST).skills.split('Forward Deployment')[1] || ''),
   'e il Mimetism sta DOPO le virgolette di Forward Deployment (+8") — il caso che aveva ingannato la ricerca');

// I casi "senza MOD": tutti e soli i profili con Camouflage e senza
// Mimetism. Oggi sono i quattro Helot e il Liberto — il test non li conta,
// li ricava, e verifica che il segnalino non abbia MOD.
const senzaMim = TUTTI.filter(u => /Camouflage/.test(u.skills || '') && !/Mimetism/.test(u.skills || ''));
ok(senzaMim.length > 0 && senzaMim.every(u => apri(JSON.parse(JSON.stringify(u))).icona === 'icon_camo'),
   `senza Mimetism, nessun MOD: ${senzaMim.map(u => u.nome.split(' (')[0]).join(', ')}`);

console.log('\n=== 3. Camouflage (1 Use) — FAQ F07 ===');
// M.camoUnUso riconosce le tre grafie dell'uso singolo, e non la skill normale.
const conSkill = (t) => ({ skills: t });
ok(M.camoUnUso(conSkill('Camouflage (1 Use)')) === true, '"Camouflage (1 Use)": uso singolo');
ok(M.camoUnUso(conSkill('Camouflage [1 Use]')) === true, '"Camouflage [1 Use]": uso singolo');
ok(M.camoUnUso(conSkill('Limited Camouflage')) === true, '"Limited Camouflage" (nome N4): uso singolo');
ok(M.camoUnUso(conSkill('Camouflage')) === false, 'controprova — "Camouflage": NON uso singolo');
// Sui profili veri: il Locust e` (1 Use), lo Spektr no.
const LOCUST = 'Locust (Boarding Shotgun)';
ok(/Camouflage \(1 Use\)/.test(sk(LOCUST)) && M.camoUnUso(profilo(LOCUST)) === true, 'Locust nel database: Camouflage (1 Use)');
ok(!/1 Use/.test(sk(SPEKTR)) && M.camoUnUso(profilo(SPEKTR)) === false, 'Spektr nel database: Camouflage normale');

console.log('\n=== 4. Si puo` entrare in Camuffato? ===');
const locust = Object.assign(profilo(LOCUST), { states: {} });
ok(M.puoEntrareInCamo(locust).puo === true, 'Locust mai camuffato: si`');
const consumato = M.consumaCamo(locust);
// "Rivelato" si dichiara con states.camo = false: il profilo del Locust porta
// deployState CAMO come predefinito di schieramento, e col silenzio vale il
// predefinito (contratto di statoBersaglio). Senza il false esplicito il test
// misurerebbe un Locust ancora Marker, non uno rivelato.
const rivelato = Object.assign({}, consumato.unitaAggiornata, { states: { camo: false } });
ok(M.statoBersaglio(rivelato).camo === false, 'il Locust rivelato non e` piu` Marker');
const dopo = M.puoEntrareInCamo(rivelato);
ok(dopo.puo === false, 'Locust dopo consumaCamo, rivelato: no');
ok(/1 Use|F07/.test(dopo.motivo || ''), 'e il motivo cita l\'uso singolo (' + (dopo.motivo || 'nessun motivo') + ')');
const ancoraCamo = Object.assign({}, consumato.unitaAggiornata, { states: { camo: true } });
ok(M.puoEntrareInCamo(ancoraCamo).puo === true, 'Locust ancora camuffato: si` — l\'uso si perde uscendo, non restando');
const spektr = Object.assign(profilo(SPEKTR), { states: {}, camoUsato: true });
ok(M.puoEntrareInCamo(spektr).puo === true, 'controprova — Spektr (Camouflage normale) gia` usato: puo` tornare Camuffato');
// Controprova sul "si`": chi non ha Camouflage non ci entra, altrimenti i
// "si`" qui sopra non distinguerebbero niente.
const fus = Object.assign(profilo('Fusilier (Combi Rifle)'), { states: {} });
ok(M.puoEntrareInCamo(fus).puo === false, 'controprova — Fusilier senza Camouflage: no');

console.log('\n=== 5. consumaCamo non modifica l\'unita` passata ===');
const originale = Object.assign(profilo(LOCUST), { states: {} });
const fotografia = JSON.stringify(originale);
const r = M.consumaCamo(originale);
ok(JSON.stringify(originale) === fotografia, 'l\'unita` passata e` identica a prima');
ok(r.unitaAggiornata !== originale && r.unitaAggiornata.camoUsato === true, 'l\'uso consumato sta nella copia restituita');
ok(r.mutazioni.length === 1 && r.mutazioni[0].campo === 'camoUsato', 'e la mutazione e` dichiarata');
const rN = M.consumaCamo(Object.assign(profilo(SPEKTR), { states: {} }));
ok(rN.mutazioni.length === 0 && !rN.unitaAggiornata.camoUsato, 'controprova — Camouflage normale: nessun uso da consumare');

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
