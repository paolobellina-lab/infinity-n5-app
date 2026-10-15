// @versione 2026-10-06.1 | test_stati_classi_foxhole.js | proprieta`: chat MOTORE
// ============================================================================
//  CLASSI D'AZIONE, STATI CHE VIETANO, E FOXHOLE.
//
//  Punti 16-20 dell'elenco di MOTORE del 6 ottobre. La parte di schermata la
//  coprono i banchi di INTERFACCIA (test_menu_stati.js per i menu,
//  test_riquadro_cambio_stato.js per il riquadro); qui si misura il motore.
//
//  UNA TRAPPOLA TROVATA SCRIVENDO QUESTO BANCO, e vale per chiunque scriva
//  una prova sugli stati: la chiave di uno Stato in `states` NON e` il nome
//  con cui lo si chiama. Immobilizzato-A si chiama `immA` nel catalogo ma la
//  sua chiave e` `immobilizedA` (campo `chiave`). Scrivere
//  `states: { immA: true }` NON accende lo stato: M.statiDiCatalogo non lo
//  trova, l'unita` risulta sana, e la prova misura un'unita` senza stati
//  convinta di misurare un Immobilizzato. Nessun errore, nessun avviso.
//  La prima versione di questa misura diceva "IDLE permesso da IMM-A" per
//  questo motivo. Qui le chiavi si chiedono al catalogo (sezione 0) invece
//  di scriverle a mano.
//
//  USO:  node test_stati_classi_foxhole.js  |  CARTELLA=/percorso/ node ...
// ============================================================================
const DIR = (process.env.CARTELLA || (__dirname + '/')).replace(/\/?$/, '/');
global.window = global;

let passati = 0, falliti = 0;
const J = JSON.stringify;
function ok(c, d, visto) {
    if (c) { passati++; console.log('  ✓ ' + d); }
    else { falliti++; console.log('  ✗ ' + d + (visto !== undefined ? '  [visto: ' + J(visto) + ']' : '')); }
}

require(DIR + 'catalogo_n5.js'); require(DIR + 'database_comune.js');
require(DIR + 'database_nomad.js'); require(DIR + 'database_panoceania.js');
const M = require(DIR + 'motore_regole_n5.js');

const N = window.DB_NOMADI || [], P = window.DB_PANOCEANIA || [];
const STATI = (window.CATALOGO_N5 || {}).STATI || {};
// La chiave si CHIEDE al catalogo: scritta a mano, uno stato che non esiste
// passa per uno stato spento.
const chiaveDi = (nome) => (STATI[nome] && STATI[nome].chiave) || String(nome).toLowerCase();
const conStato = (u, nomi) => {
    const st = {};
    [].concat(nomi || []).forEach(n => { st[chiaveDi(n)] = true; });
    return Object.assign(JSON.parse(J(u)), { states: st, deployState: 'NORMAL', state: 'ACTIVE' });
};

const fus = P.find(u => /^Fusilier \(Combi Rifle\)/.test(u.nome));
const alg = N.find(u => /^Alguacil \(Combi Rifle\)/.test(u.nome));
const combi = M.profiloArma('Combi Rifle');

console.log('\n=== 0. Le chiavi degli Stati, prese dal catalogo ===');
ok(chiaveDi('immA') === 'immobilizedA', `immA -> ${chiaveDi('immA')}`);
ok(chiaveDi('immB') === 'immobilizedB', `immB -> ${chiaveDi('immB')}`);
ok(chiaveDi('retreat') === 'retreat', `retreat -> ${chiaveDi('retreat')}`);
ok(chiaveDi('foxhole') === 'foxhole', `foxhole -> ${chiaveDi('foxhole')}`);
// CONTROPROVA della trappola: col nome invece della chiave lo stato NON si
// accende. Questa prova esiste per impedire che qualcuno "semplifichi" le
// righe di sopra scrivendo le chiavi a mano.
const conNomeSbagliato = Object.assign(JSON.parse(J(alg)), { states: { immA: true }, state: 'ACTIVE' });
ok(M.statiDiCatalogo(conNomeSbagliato).length === 0,
   `states:{immA:true} non accende nessuno stato (${M.statiDiCatalogo(conNomeSbagliato).length})`);
ok(M.statiDiCatalogo(conStato(alg, 'immA')).some(s => s.stato === 'immA'),
   'mentre con la chiave del catalogo lo stato c e');

console.log('\n=== 1. Punto 16: M.classeAzione ===');
const classi = {
    'MOVIMENTO': 'BASIC_SHORT', 'SCOPRIRE': 'BASIC_SHORT', 'IDLE': 'BASIC_SHORT',
    'CAUTO': 'LONG', 'SALTO': 'LONG', 'ARRAMPICARSI': 'LONG', 'BERSERK': 'LONG',
    'CYBERMASK': 'LONG', 'FUOCO SPECULATIVO': 'LONG',
    'SCHIVATA': 'SHORT', 'RESET': 'SHORT', 'ATTACCO BS': 'SHORT',
    'ALLERTA': 'AUTOMATIC'
};
Object.keys(classi).forEach(function (a) {
    const c = M.classeAzione(a) || {};
    ok(c.classe === classi[a], `${a}: ${classi[a]} (${c.classe})`);
});
const ch = M.classeAzione('HACKING', 'TRINITY') || {};
ok(ch.classe === 'SHORT' && ch.aro === true,
   `HACKING con TRINITY: SHORT e aro true (${ch.classe}, ${ch.aro})`);
// CONTROPROVA: le classi non sono tutte uguali ne tutte diverse a caso —
// se classeAzione rispondesse sempre la stessa cosa, le righe di sopra
// sarebbero tutte verdi o tutte rosse insieme. Qui si pretende che i
// quattro valori distinti ci siano davvero.
const distinte = Object.keys(classi).map(a => (M.classeAzione(a) || {}).classe)
    .filter((v, i, l) => l.indexOf(v) === i).sort();
ok(distinte.length === 4 && J(distinte) === J(['AUTOMATIC', 'BASIC_SHORT', 'LONG', 'SHORT']),
   `e le quattro classi distinte sono proprio quelle (${J(distinte)})`);

console.log('\n=== 2. Punto 17: azionePermessaDaStati in Ritirata! ===');
const inRitirata = conStato(alg, 'retreat');
const permessi = ['MOVIMENTO', 'SCOPRIRE', 'IDLE', 'CAUTO', 'SCHIVATA', 'RESET'];
const negati   = ['SALTO', 'ARRAMPICARSI', 'ATTACCO BS'];
permessi.forEach(a => ok(M.azionePermessaDaStati(inRitirata, a).permessa === true,
    `Ritirata!: ${a} permessa (${M.azionePermessaDaStati(inRitirata, a).permessa})`));
negati.forEach(a => {
    const p = M.azionePermessaDaStati(inRitirata, a);
    ok(p.permessa === false, `Ritirata!: ${a} NEGATA (${p.permessa})`);
    ok(/Basic Short/i.test((p.bloccanti || []).map(b => b.motivo).join(' ')),
       `  col motivo delle Basic Short Skill`);
});

console.log('\n=== 3. Punto 17: l IDLE sotto gli altri Stati ===');
ok(M.azionePermessaDaStati(conStato(alg, 'immA'), 'IDLE').permessa === false,
   `Immobilizzato-A nega l IDLE (${M.azionePermessaDaStati(conStato(alg, 'immA'), 'IDLE').permessa})`);
ok(M.azionePermessaDaStati(conStato(alg, 'immB'), 'IDLE').permessa === false,
   `Immobilizzato-B nega l IDLE (${M.azionePermessaDaStati(conStato(alg, 'immB'), 'IDLE').permessa})`);
ok(M.azionePermessaDaStati(conStato(alg, 'engaged'), 'IDLE').permessa === true,
   `Ingaggiato lo permette (${M.azionePermessaDaStati(conStato(alg, 'engaged'), 'IDLE').permessa})`);
// E i due Immobilizzati non negano TUTTO: ciascuno lascia passare la sua.
ok(M.azionePermessaDaStati(conStato(alg, 'immA'), 'SCHIVATA').permessa === true,
   'e l Immobilizzato-A lascia passare la SCHIVATA');
ok(M.azionePermessaDaStati(conStato(alg, 'immB'), 'RESET').permessa === true,
   'e l Immobilizzato-B lascia passare il RESET');

console.log('\n=== 4. Punto 17: il Foxhole non nega nessuna azione ===');
const inFoxhole = conStato(alg, 'foxhole');
const negateDalFoxhole = Object.keys(classi).concat(['HACKING'])
    .filter(a => M.azionePermessaDaStati(inFoxhole, a).permessa === false);
ok(negateDalFoxhole.length === 0, `nessuna azione negata dal Foxhole (${J(negateDalFoxhole)})`);
// CONTROPROVA: lo stato c e davvero. "Nessuna azione negata" su un'unita
// senza stati sarebbe vero per il motivo sbagliato.
ok(M.statiDiCatalogo(inFoxhole).some(s => s.stato === 'foxhole'),
   'e lo stato Foxhole e acceso sull unita di prova');

console.log('\n=== 5. Punto 18: le opzioni ARO di chi e in Ritirata! ===');
const aroRit = M.azioniAroPossibili(inRitirata, 'ATTACCO BS');
[['BS_ATTACK', false], ['CC_ATTACK', false], ['HACKING', false], ['DODGE', true]].forEach(([id, atteso]) => {
    const v = aroRit.find(a => a.id === id);
    ok(!!v, `${id} compare fra le opzioni ARO`);
    ok(v && v.ammesso === atteso, `  e ammesso e ${atteso} (${v && v.ammesso})`, v && v.motivo);
});
// CONTROPROVA: senza Ritirata! le tre tornano ammesse. Altrimenti "false"
// non distingue "lo Stato le nega" da "non sono mai ammesse".
const aroSano = M.azioniAroPossibili(Object.assign(JSON.parse(J(alg)), { states: {}, state: 'ACTIVE' }), 'ATTACCO BS');
const bsSano = aroSano.find(a => a.id === 'BS_ATTACK');
ok(bsSano && bsSano.ammesso === true, `senza Ritirata! il BS_ATTACK torna ammesso (${bsSano && bsSano.ammesso})`);

console.log('\n=== 6. Punto 19: il Foxhole alla dichiarazione ===');
const cancellano = ['MOVIMENTO', 'CAUTO', 'ARRAMPICARSI', 'SALTO', 'BERSERK', 'SCHIVATA'];
const nonCancellano = ['ATTACCO BS', 'RESET', 'IDLE'];
cancellano.forEach(a => {
    const f = M.foxholeAllaDichiarazione(inFoxhole, a, {});
    ok(f.puoCancellare === true, `${a}: puoCancellare true (${f.puoCancellare})`);
});
nonCancellano.forEach(a => {
    const f = M.foxholeAllaDichiarazione(inFoxhole, a, {});
    ok(f.puoCancellare === false, `${a}: puoCancellare false (${f.puoCancellare})`);
});
const inAro = M.foxholeAllaDichiarazione(inFoxhole, 'MOVIMENTO', { inAro: true });
ok(inAro.puoCancellare === false, `in ARO non si cancella (${inAro.puoCancellare})`);
ok(!!(inAro.nota || inAro.motivo), `e lo dice con una nota (${String(inAro.nota || inAro.motivo).slice(0, 70)})`);

console.log('\n=== 7. Punto 19: M.cancellaFoxhole ===');
const cancellato = M.cancellaFoxhole(inFoxhole);
ok(cancellato.cancellato === true, `cancellato (${cancellato.cancellato})`);
ok(cancellato.unitaAggiornata.states.foxhole === false,
   `states.foxhole false (${cancellato.unitaAggiornata.states.foxhole})`);
// CONTROPROVA: non tocca l unita originale. Una funzione che muta in casa
// farebbe passare per "cancellato" anche un'unita che nessuno ha toccato.
ok(inFoxhole.states.foxhole === true,
   `e l unita di partenza resta in Foxhole: la funzione non muta in casa (${inFoxhole.states.foxhole})`);

console.log('\n=== 8. Punto 20: i numeri del Foxhole nel calcolo ===');
// Fusilier (BS 12) contro Alguacil (BS 11), Combi Rifle, gittata +3.
const scontro = (attivo, reattivo, opt) => M.risolviScontro(
    { attaccante: attivo, azione: M.AZIONI.BS_ATTACK, arma: combi, bersaglio: reattivo,
      burst: 3, rangeIndex: 1, cover: !!(opt && opt.cover) },
    { difensore: reattivo, azione: 'ATTACCO BS', arma: combi, bersaglio: M.nomeUnita(attivo),
      burst: 3, rangeIndex: 1 }, {});
const salvAttivo = (r) => r.attivo.salvezzaInflitta && r.attivo.salvezzaInflitta.valoreSuccesso;
const salvReatt  = (r) => r.reattivo.salvezzaInflitta && r.reattivo.salvezzaInflitta.valoreSuccesso;

const base = scontro(conStato(fus, []), conStato(alg, []));
ok(base.attivo.mod === 15, `base: l attivo tira 15 (${base.attivo.mod})`);
ok(base.reattivo.mod === 14, `e il reattivo 14 (${base.reattivo.mod})`);
ok(salvAttivo(base) === 8, `e la salvezza del reattivo e 8 (${salvAttivo(base)})`);

const reattFox = scontro(conStato(fus, []), conStato(alg, 'foxhole'));
ok(reattFox.attivo.mod === 9, `reattivo in Foxhole: l attivo scende da 15 a 9 (${reattFox.attivo.mod})`);
ok(salvAttivo(reattFox) === 11, `e la salvezza del reattivo sale da 8 a 11 (${salvAttivo(reattFox)})`);

const reattFoxCopertura = scontro(conStato(fus, []), conStato(alg, 'foxhole'), { cover: true });
ok(reattFoxCopertura.attivo.mod === 9 && salvAttivo(reattFoxCopertura) === 11,
   `identico con la Copertura dichiarata: non si somma (${reattFoxCopertura.attivo.mod}, ${salvAttivo(reattFoxCopertura)})`);

const attFox = scontro(conStato(fus, 'foxhole'), conStato(alg, []));
ok(attFox.reattivo.mod === 8, `attivo in Foxhole: il reattivo scende da 14 a 8 (${attFox.reattivo.mod})`);
ok(salvReatt(attFox) === 11, `e la salvezza dell attivo e 11 (${salvReatt(attFox)})`);

console.log('\n=== 9. Punto 20: chi cancella il Foxhole muovendo non ha bonus ===');
// Si cancella davvero lo stato, con la funzione del motore, e si rifa` il
// conto: e` la differenza fra "il bonus sparisce" e "il bonus non c era".
const dopoMovimento = M.cancellaFoxhole(conStato(fus, 'foxhole')).unitaAggiornata;
const senzaBonus = scontro(dopoMovimento, conStato(alg, []));
ok(senzaBonus.reattivo.mod === 14,
   `cancellato il Foxhole, il reattivo torna a 14 (${senzaBonus.reattivo.mod})`);
ok(senzaBonus.reattivo.mod === base.reattivo.mod,
   'cioe esattamente il valore di chi il Foxhole non lo ha mai avuto');

console.log('\n=== 10. Punto 20: il Foxhole non si somma al Mimetismo ===');
const conMim = P.find(u => /Mimetism \(-6\)/i.test(String(u.skills)));
ok(!!conMim, `un profilo con Mimetism (-6) nel database (${conMim && conMim.nome})`);
const mimFox = M.modAttacco(conStato(fus, []), conStato(conMim, 'foxhole'), combi,
    M.AZIONI.BS_ATTACK, { rangeIndex: 1 });
const vociMim = (mimFox.voci || []).filter(v => /mimetismo|mimetism/i.test(v.fonte + ' ' + v.motivo));
const sommaMim = vociMim.reduce((a, v) => a + v.valore, 0);
ok(sommaMim === -6, `bersaglio con Mimetism (-6) in Foxhole: -6, non -9 (${sommaMim})`);
ok(vociMim.length === 1, `e la voce e una sola (${J(vociMim.map(v => v.valore))})`);

console.log('\n=== 11. Punto 20: Corpo a Corpo e Sagoma Diretta ===');
// Corpo a Corpo: nessuna copertura, quindi il Foxhole non protegge.
const cc = M.risolviScontro(
    { attaccante: conStato(fus, []), azione: M.AZIONI.CC_ATTACK, arma: M.profiloArma('CC Weapon'),
      bersaglio: conStato(alg, 'foxhole'), burst: 1 },
    { difensore: conStato(alg, 'foxhole'), azione: 'SCHIVATA', bersaglio: M.nomeUnita(fus), burst: 1 }, {});
// La copertura si vede nelle voci della SALVEZZA, non in quelle del tiro
// dell'attivo: cercandola nel posto sbagliato la prova resta verde anche
// togliendo il guardiano del Corpo a Corpo (provato il 6 ottobre: con
// `!(arma && arma.isCC)` rimosso la salvezza passa da 9 a 12 e la voce
// `copertura=3` compare — e l'asserzione che guardava l'attivo non se ne
// accorgeva).
const svCC = cc.attivo.salvezzaInflitta || {};
const vociCop = (svCC.voci || []).filter(v => /copertura|foxhole/i.test(v.fonte + ' ' + v.motivo));
ok(vociCop.length === 0,
   `Corpo a Corpo: nessuna copertura nella salvezza (vs ${svCC.valoreSuccesso}, voci ${J((svCC.voci || []).map(v => v.fonte))})`);
// Sagoma Diretta: nessun +3 alla salvezza.
const lanciafiamme = M.profiloArma('Light Flamethrower');
const sagoma = M.risolviScontro(
    { attaccante: conStato(fus, []), azione: M.AZIONI.BS_ATTACK, arma: lanciafiamme,
      bersaglio: conStato(alg, 'foxhole'), burst: 1, rangeIndex: 0 },
    { difensore: conStato(alg, 'foxhole'), azione: 'SCHIVATA', bersaglio: M.nomeUnita(fus), burst: 1 }, {});
const sv = sagoma.attivo.salvezzaInflitta || {};
const vociSalv = (sv.voci || []).filter(v => /copertura|foxhole/i.test(v.fonte + ' ' + v.motivo));
ok(vociSalv.length === 0,
   `Sagoma Diretta: nessun +3 alla salvezza dal Foxhole (${J(vociSalv.map(v => v.valore))})`);
// CONTROPROVA: con un'arma normale quel +3 c e. Senza, "nessuna voce" non
// distingue "la Sagoma lo toglie" da "il Foxhole non lo da mai".
const vociNormale = ((scontro(conStato(fus, []), conStato(alg, 'foxhole')).attivo.salvezzaInflitta || {}).voci || [])
    .filter(v => /copertura|foxhole/i.test(v.fonte + ' ' + v.motivo));
ok(vociNormale.length >= 1,
   `mentre col Combi Rifle il +3 del Foxhole c e (${J(vociNormale.map(v => v.valore))})`);

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
