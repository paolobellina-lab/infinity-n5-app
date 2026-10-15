// @versione 2026-10-07.2 | test_novita_7ott.js | proprieta`: chat TEST
// I COMPORTAMENTI NUOVI DEL 7 OTTOBRE — node test_novita_7ott.js
//
// Elencati da MOTORE come "comportamenti nuovi senza banco", dal collaudo
// al tavolo di Paolo del 7 ottobre:
//   B1. Arma a modalita` + notazione: M.variantiArma e il nomeRichiesto
//   B2. Tiro in mischia: il -6 per ogni alleato ingaggiato
//   B4. Place Deployable e` un Attacco: rivela i Marker, vietato allo Stordito
//   B5. Requisiti dichiarati al tavolo (M.REQUISITI_TAVOLO e compagnia)
//   B7. Il gettone piazzato: combatGroup del portatore, e la foto
// B3 (un allarme per Ordine in window.inviaAllarmeAro) NON sta qui: vive in
// motore_core.js, che e` di MOTORE, e il suo banco e`
// test_allarme_una_volta.js, che porta "proprieta`: chat MOTORE". Le misure
// gliele ho consegnate; il banco lo scrive chi possiede il codice.
//
// LE FIRME CHE INGANNAVANO, settima e ottava della serie. Scrivendo questo
// banco ho sbagliato la chiamata altre due volte, e ogni volta il motore
// rispondeva qualcosa di PLAUSIBILE invece di un errore. SEGNALATE a MOTORE
// il 7 ottobre e CORRETTE nella .9 — la sezione 6 misura i ripari.
//   M.bersagliConRequisiti(bersagli, REQ)   REQ e` il risultato di
//       M.requisitiDichiarati, non l'elenco delle chiavi. Fino alla .5
//       passando le chiavi sollevava un'eccezione; ora stampa un
//       console.error e restituisce i bersagli INVARIATI.
//   M.filtraPerAvversario(unita | array)    fino alla .5 voleva UNA unita` e
//       a un array rispondeva {} — un oggetto vuoto che a valle sembra
//       un'unita` senza campi. Ora accetta anche un array e lo filtra voce
//       per voce.
// Entrambi i chiamanti veri nell'app erano giusti anche prima (verificato);
// il rischio era per chi scrive un chiamante nuovo.

const CARTELLA = process.env.CARTELLA || __dirname;
const path = require('path');
global.window = global;
let passati = 0, falliti = 0;
function ok(c, n, e) {
    if (c) { passati++; console.log(`  ✅ ${n}`); }
    else { falliti++; console.log(`  ❌ ${n}${e !== undefined ? '\n       [visto: ' + JSON.stringify(e) + ']' : ''}`); }
}
const P = (f) => path.join(CARTELLA, f);
require(P('catalogo_n5.js'));
require(P('database_comune.js'));
require(P('database_nomad.js'));
require(P('database_panoceania.js'));
const M = require(P('motore_regole_n5.js'));

const fonti = (r) => ((r || {}).voci || []).map(v => v.fonte).join(',');
const valori = (r) => ((r || {}).voci || []).map(v => v.fonte + ':' + v.valore).join(' ');
const note = (r) => ((r || {}).note || []).join(' | ').normalize('NFC');

// ==================================================================
// B1. ARMA A MODALITA` PIU` NOTAZIONE
//   Un "MULTI Sniper Rifle" e` un CONTENITORE: le modalita` (AP, Shock,
//   Anti-Materiel) sono le armi vere. Le notazioni del profilo — (+1SD),
//   (+1B), (PS=n) — stanno scritte accanto al contenitore.
//   Prima i tre bottoni dichiaravano il contenitore e l'attacco non
//   arrivava al tiro: la modalita` si perdeva fra la scelta e il calcolo.
//   Ora M.variantiArma da` il `nomeRichiesto`, che porta la modalita` E la
//   notazione, e M.profiloArma di quel nome ritorna l'arma vera.
// ==================================================================
console.log('\n=== B1. Arma a modalità + notazione ===');

const vSD = M.variantiArma('MULTI Sniper Rifle (+1SD)');
ok(Array.isArray(vSD) && vSD.length === 3,
   `il MULTI Sniper Rifle ha tre modalità (${Array.isArray(vSD) ? vSD.length : typeof vSD})`);
const modalita = (vSD || []).map(x => x.nome).sort();
ok(modalita.join(' | ') === 'MULTI Sniper Rifle (AP Mode) | MULTI Sniper Rifle (Anti-Materiel Mode) | MULTI Sniper Rifle (Shock Mode)',
   `e sono AP, Anti-Materiel e Shock (${modalita.join(', ')})`);
// IL PUNTO: il nomeRichiesto porta la modalita` E la notazione insieme.
const richiesti = (vSD || []).map(x => x.nomeRichiesto);
ok(richiesti.every(n => /\(\+1SD\)$/.test(String(n))),
   `ogni nomeRichiesto conserva la notazione (+1SD) in coda (${richiesti[0]})`);
ok(richiesti.indexOf('MULTI Sniper Rifle (AP Mode) (+1SD)') >= 0,
   'fra cui "MULTI Sniper Rifle (AP Mode) (+1SD)": modalità e notazione nello stesso nome');

// E il profilo di quel nome e` l'arma VERA, non il contenitore: e` il
// passaggio che si perdeva.
const ap = M.profiloArma('MULTI Sniper Rifle (AP Mode) (+1SD)');
ok(ap && !ap.nonTrovata, 'M.profiloArma del nomeRichiesto trova il profilo');
ok(ap && ap.nome === 'MULTI Sniper Rifle (AP Mode)',
   `e il profilo è la MODALITÀ, non il contenitore (${ap && ap.nome})`);
ok(ap && ap.burst === 2, `col Burst della modalità: 2 (${ap && ap.burst})`);
ok(ap && (ap.bands || []).length === 12, `e le sue 12 bande (${ap && (ap.bands || []).length})`);
ok(ap && ap.ammo === 'AP', `e la munizione AP (${ap && ap.ammo})`);
ok(ap && (ap.notazioni || []).join(',') === '+1SD',
   `con la notazione raccolta in notazioni (${ap && JSON.stringify(ap.notazioni)})`);

// CONTROPROVA 1: lo STESSO nome senza la notazione da` lo stesso profilo con
// notazioni VUOTE. Senza questa, "+1SD in notazioni" non distingue "letta
// dal nome" da "scritta sempre".
const apNudo = M.profiloArma('MULTI Sniper Rifle (AP Mode)');
ok(apNudo && apNudo.burst === 2 && (apNudo.bands || []).length === 12,
   'senza notazione il profilo della modalità è identico');
ok(apNudo && (apNudo.notazioni || []).length === 0,
   `ma notazioni è VUOTO (${apNudo && JSON.stringify(apNudo.notazioni)})`);
// CONTROPROVA 2: un'arma SENZA modalita` da` una variante sola, e il
// nomeRichiesto e` il nome stesso. Il meccanismo non inventa modalita`.
const vCombi = M.variantiArma('Combi Rifle');
ok(Array.isArray(vCombi) && vCombi.length === 1,
   `un Combi Rifle non ha modalità: una variante sola (${Array.isArray(vCombi) ? vCombi.length : typeof vCombi})`);
ok(vCombi[0].nome === 'Combi Rifle' && vCombi[0].nomeRichiesto === 'Combi Rifle',
   'e il nomeRichiesto è il nome stesso');
// CONTROPROVA 3: la stessa catena con le ALTRE due notazioni, perche` MOTORE
// dice "stesso giro per (+1B) e (PS=n)". Una prova sul solo +1SD non lo
// distingue da un caso particolare.
const vB = M.variantiArma('MULTI Rifle (+1B)');
ok(Array.isArray(vB) && vB.length === 3 && vB.every(x => /\(\+1B\)$/.test(String(x.nomeRichiesto))),
   `(+1B): tre modalità, notazione conservata (${(vB || []).length})`);
const apB = M.profiloArma('MULTI Rifle (AP Mode) (+1B)');
ok(apB && apB.nome === 'MULTI Rifle (AP Mode)' && (apB.notazioni || []).join(',') === '+1B',
   `e il profilo è la modalità con la sua notazione (${apB && apB.nome}, ${apB && JSON.stringify(apB.notazioni)})`);
const vPS = M.variantiArma('Combi Rifle (PS=15)');
ok(Array.isArray(vPS) && vPS.length === 1 && vPS[0].nomeRichiesto === 'Combi Rifle (PS=15)',
   `(PS=n) su un'arma senza modalità: una variante, notazione conservata (${vPS && vPS[0] && vPS[0].nomeRichiesto})`);

// ==================================================================
// B2. TIRO IN MISCHIA
//   Righe 3389-3396, 3622-3626, 3586-3594. Chi tira contro un bersaglio
//   INGAGGIATO prende -6 per OGNI suo alleato in quel Corpo a Corpo, e ogni
//   tiro fallito e` un colpo su quell'alleato.
//   Il numero di alleati l'app non lo sa: lo chiede. Il contratto di
//   ctx.alleatiInMischia ha tre casi, e la differenza fra "non passato" e
//   "zero" e` quella che al tavolo conta.
// ==================================================================
console.log('\n=== B2. Tiro in mischia: il -6 per ogni alleato ingaggiato ===');

const tiratore = { id: 'a1', alias: 'Alguacil', bs: 11, ph: 11, states: {} };
const ingaggiato = { id: 'b1', alias: 'Fusilier', tipo: 'LI', arm: 1, states: { engaged: true } };
const libero = { id: 'b2', alias: 'Fusilier libero', tipo: 'LI', arm: 1, states: {} };
const combi = M.profiloArma('Combi Rifle');
const lanciafiamme = M.profiloArma('Light Flamethrower');
const bs = (bers, ctx) => M.modAttacco(tiratore, bers, combi, M.AZIONI.BS_ATTACK,
    Object.assign({ rangeIndex: 0 }, ctx || {}));

console.log('\n--- quanti alleati: tre casi diversi ---');
// NON PASSATO: conta 1, e lo DICE. E` la scelta prudente — un -6 scritto in
// chiaro, non uno zero silenzioso.
const nonPassato = bs(ingaggiato, {});
// NOTA SUI NUMERI: `mod` e` la SOMMA DEI MODIFICATORI, non il Valore di
// Successo. Qui +3 di gittata -6 di mischia fa MOD -3, e il tiro esce a
// BS 11 - 3 = 8. Scrivere "BS 11 ... = -3" in un'etichetta sarebbe un
// numero che al tavolo non si trova su nessuno schermo.
ok(nonPassato.mod === -3, `alleatiInMischia non passato: MOD +3 gittata -6 mischia = -3, tiro a 8 (${nonPassato.mod})`);
ok(/mischia/.test(fonti(nonPassato)), `con la voce "mischia" nel dettaglio (${valori(nonPassato)})`);
ok(/contato 1 TUO alleato/.test(note(nonPassato)),
   'e la nota dice che ne ha contato UNO, perché nessuno gliel ha detto');

// ZERO: il bersaglio e` ingaggiato ma nessuno dei MIEI e` in quella mischia.
// Nessun MOD, e lo dice. "Assente non e` vuoto", un'altra volta.
const zero = bs(ingaggiato, { alleatiInMischia: 0 });
ok(zero.mod === 3, `alleatiInMischia: 0 -> nessun -6, resta MOD +3 di gittata, tiro a 14 (${zero.mod})`);
ok(!/mischia/.test(fonti(zero)), `e nessuna voce "mischia" (${fonti(zero)})`);
ok(/nessun TUO alleato/.test(note(zero)),
   'con la nota che spiega perché non si applica');
ok(nonPassato.mod !== zero.mod,
   `🔴 "non passato" e "zero" NON danno lo stesso numero: -3 contro +3 (${nonPassato.mod} / ${zero.mod})`);

// N: -6 per ciascuno.
const uno = bs(ingaggiato, { alleatiInMischia: 1 });
const due = bs(ingaggiato, { alleatiInMischia: 2 });
ok(uno.mod === -3, `un alleato: -6, MOD totale -3 (${uno.mod})`);
ok(due.mod === -9, `due alleati: -12, cioè -6 per ciascuno, MOD totale -9 (${due.mod})`);
ok(/mischia:-12/.test(valori(due)), `e la voce porta il -12 intero (${valori(due)})`);
// Tre alleati: il tetto dei MOD entra in gioco. Fissato perche` -18 non
// esiste: il motore lo limita e lo DICE con una voce a parte.
const tre = bs(ingaggiato, { alleatiInMischia: 3 });
ok(/mischia:-18/.test(valori(tre)), `tre alleati: la voce mischia dice -18 (${valori(tre)})`);
ok(tre.mod === -12, `ma il MOD totale si ferma al tetto: -12 (${tre.mod})`);
ok(/limite/.test(fonti(tre)), `con una voce "limite" che lo dichiara (${valori(tre)})`);

console.log('\n--- CONTROPROVA: il bersaglio NON ingaggiato ---');
// Senza questa, "il -6 c è" non distingue "per la mischia" da "sempre".
const fuoriMischia = bs(libero, { alleatiInMischia: 2 });
ok(fuoriMischia.mod === 3, `bersaglio libero, due alleati dichiarati: nessun -6, MOD +3 (${fuoriMischia.mod})`);
ok(!/mischia/.test(fonti(fuoriMischia)),
   `nessuna voce mischia: il MOD dipende dallo STATO del bersaglio (${fonti(fuoriMischia)})`);
ok(note(fuoriMischia) === '', 'e nessuna nota: non c è niente da dire');

console.log('\n--- la Sagoma su una mischia: non è un MOD, è il colpo annullato ---');
const sagomaUno = M.modAttacco(tiratore, ingaggiato, lanciafiamme, M.AZIONI.BS_ATTACK,
    { rangeIndex: 0, alleatiInMischia: 1 });
ok(sagomaUno.colpoAnnullato === true,
   'arma a Sagoma con un tuo alleato nella mischia: colpoAnnullato true');
ok(/ANNULLATO/.test(note(sagomaUno)),
   `col motivo scritto per il giocatore (${note(sagomaUno).slice(0, 60)}…)`);
// CONTROPROVA: zero alleati, la Sagoma funziona.
const sagomaZero = M.modAttacco(tiratore, ingaggiato, lanciafiamme, M.AZIONI.BS_ATTACK,
    { rangeIndex: 0, alleatiInMischia: 0 });
ok(sagomaZero.colpoAnnullato === undefined,
   'CONTROPROVA: con zero alleati il colpo NON è annullato — non è un campo sempre acceso');
ok(/Sagoma Diretta/.test(note(sagomaZero)),
   'e resta il colpo automatico della Sagoma Diretta');
// E anche qui "non passato" conta 1, quindi annulla: la scelta prudente
// vale pure per la Sagoma.
ok(M.modAttacco(tiratore, ingaggiato, lanciafiamme, M.AZIONI.BS_ATTACK, { rangeIndex: 0 })
    .colpoAnnullato === true,
   'e "non passato" annulla come 1: la prudenza è la stessa');

// LA CONSEGUENZA CHE CONTA AL TAVOLO: Burst 0 e NESSUN Tiro Salvezza. Un
// colpo annullato che lasciasse la salvezza in tavola sarebbe peggio di
// nessun avviso — il giocatore tirerebbe.
const scontroAnnullato = M.risolviScontro({ attaccante: tiratore, attaccanteId: 'a1',
    bersaglio: ingaggiato, azione: M.AZIONI.BS_ATTACK, arma: lanciafiamme, alleatiInMischia: 1 }, null, {});
ok(scontroAnnullato.titolo === 'NESSUN TIRO',
   `sul tabellone il titolo è NESSUN TIRO (${scontroAnnullato.titolo})`);
ok(scontroAnnullato.attivo.burst === 0, `Burst 0 (${scontroAnnullato.attivo.burst})`);
ok(scontroAnnullato.attivo.colpoAnnullato === true, 'il campo arriva allo scontro');
ok((scontroAnnullato.attivo.salvezzaInflitta || {}).offensivo === false,
   'e NESSUN Tiro Salvezza da infliggere: non si tira niente');

// ==================================================================
// B4. PLACE DEPLOYABLE E` UN ATTACCO (riga 7551)
//   Non e` una formalita`: se e` un Attacco, un Marker che lo dichiara si
//   RIVELA, e uno Stordito non puo` dichiararlo. Due conseguenze che al
//   tavolo cambiano la pedina sul tavolo.
// ==================================================================
console.log('\n=== B4. Place Deployable è un Attacco ===');

const PIAZZA = 'PIAZZARE EQUIPAGGIAMENTO';
// Il catalogo lo nomina con la regola del regolamento: non e` "un Attacco"
// scritto in un campo, e` la regola Place Deployable che e` un Attacco
// (riga 7551). Quello che si misura sono le due CONSEGUENZE.
const classe = M.classeAzione(PIAZZA);
ok(classe && classe.nomeRegola === 'Place Deployable',
   `l azione è la regola Place Deployable (${(classe || {}).nomeRegola})`);
ok(classe && classe.classe === 'SHORT' && classe.aro === true,
   `Abilità Breve che genera ARO (${(classe || {}).classe}, aro ${(classe || {}).aro})`);

const spektr = { id: 'c1', alias: 'Spektr', tipo: 'LI', deployState: 'CAMO', states: { camo: true }, equip: 'CrazyKoalas' };
const speculo = { id: 'i1', alias: 'Speculo', tipo: 'LI', deployState: 'IMP', states: { impersonation: true }, equip: 'CrazyKoalas' };
const moranSano = { id: 'n1', alias: 'Moran', tipo: 'LI', states: {}, equip: 'CrazyKoalas' };
// 🔴 LA CHIAVE DELLO STATO E` QUELLA DEL CATALOGO, NON IL NOME ITALIANO:
// 'stunned', non 'stordito'. Scrivendo states:{stordito:true} il motore
// risponde "permessa: true" — un'unità SANA — e la prova passa dicendo il
// contrario di quello che crede. Ci sono cascato il 7 ottobre scrivendo
// questo banco, dopo averlo già annotato in test_stati_classi_foxhole.js:
// il nome italiano è quello della VOCE, la chiave è il campo.
const CH = (nome) => ((((global.CATALOGO_N5 || {}).STATI || {})[nome] || {}).chiave) || nome;
ok(CH('stordito') === 'stunned',
   `premessa: la chiave dello stato Stordito è "${CH('stordito')}", non "stordito"`);
const moranStordito = { id: 's1', alias: 'Moran stordito', tipo: 'LI',
                        states: { [CH('stordito')]: true }, equip: 'CrazyKoalas' };

// PRIMA CONSEGUENZA: un Marker che lo dichiara si RIVELA. Non c'è un campo
// `rivela`: si legge nel passaggio di stato, che è il dato vero.
const dopoCamo = M.statoDopoAbilita(spektr, PIAZZA, {});
ok(dopoCamo && dopoCamo.prima.marker === 'CAMO' && dopoCamo.dopo.marker === null,
   `un Marker CAMO che piazza si RIVELA: da CAMO a nessun Marker (${(dopoCamo || {}).prima && dopoCamo.prima.marker} -> ${JSON.stringify((dopoCamo || {}).dopo && dopoCamo.dopo.marker)})`);
ok(dopoCamo && dopoCamo.unitaAggiornata.deployState === 'NORMAL' &&
   dopoCamo.unitaAggiornata.states.camo === false,
   'e l unità aggiornata è NORMAL, col CAMO spento');
ok(dopoCamo && (dopoCamo.mutazioni || []).some(m => m.campo === 'deployState' && m.a === 'NORMAL'),
   `con la mutazione scritta, così l editor sa cosa cambiare (${JSON.stringify((dopoCamo.mutazioni || [])[0])})`);
const dopoImp = M.statoDopoAbilita(speculo, PIAZZA, {});
ok(dopoImp && dopoImp.dopo.marker === null && dopoImp.unitaAggiornata.deployState === 'NORMAL',
   'e così un Marker Impersonation');
// CONTROPROVA: un Modello già scoperto non ha niente da rivelare — nessuna
// mutazione. Senza, "si rivela" non si distingue da "il motore riscrive
// sempre lo stato".
const dopoSano = M.statoDopoAbilita(moranSano, PIAZZA, {});
ok(dopoSano && (dopoSano.mutazioni || []).length === 0,
   `CONTROPROVA: un Modello già scoperto non muta nulla (${(dopoSano.mutazioni || []).length} mutazioni)`);

// SECONDA CONSEGUENZA: lo Stordito non può dichiararlo.
const permStordito = M.azionePermessaDaStati(moranStordito, PIAZZA);
ok(permStordito && permStordito.permessa === false,
   `uno Stordito NON può dichiararlo (${JSON.stringify((permStordito || {}).permessa)})`);
ok(permStordito && /Stordito/.test(String(permStordito.motivo)),
   `col motivo che nomina lo stato (${String((permStordito || {}).motivo).slice(0, 55)}…)`);
ok(permStordito && (permStordito.bloccanti || []).length === 1,
   `e un bloccante solo, nominato (${JSON.stringify((permStordito.bloccanti || [])[0])})`);
// TRE CONTROPROVE, perché "vietato" deve distinguersi da tre cose diverse:
// che sia vietato a tutti, che sia vietato tutto allo Stordito, e che il
// divieto valga solo per questa azione.
ok((M.azionePermessaDaStati(moranSano, PIAZZA) || {}).permessa === true,
   'CONTROPROVA 1: la stessa unità sana PUÒ piazzare — non è il piazzamento a essere vietato');
ok((M.azionePermessaDaStati(moranStordito, 'MOVIMENTO') || {}).permessa === true,
   'CONTROPROVA 2: lo stesso Stordito PUÒ muoversi — non è un divieto generale');
ok((M.azionePermessaDaStati(moranStordito, 'ATTACCO BS') || {}).permessa === false,
   'CONTROPROVA 3: e gli è vietato anche l ATTACCO BS — è la classe Attacco che lo blocca, come Place Deployable');

// ==================================================================
// B5. REQUISITI DICHIARATI AL TAVOLO
//   L'app non ha la mappa: Linea di Tiro, gittata, Sagoma, contatto e Area
//   di Hacking li dichiara il giocatore. Il motore ne fa tre cose: i dadi
//   persi sul singolo bersaglio (righe 3111-3114), l'Idle quando mancano a
//   TUTTI (righe 1244-1247), e il fuori gittata (righe 3512-3514).
//
//   🔴 LA TRAPPOLA, da sapere prima di scrivere una prova: la CHIAVE non e`
//   il nome del campo, e due chiavi hanno la POLARITA` INVERTITA.
//      lof      -> campo 'lof',          manca se FALSE
//      gittata  -> campo 'fuoriGittata', manca se TRUE
//      sagoma   -> campo 'fuoriSagoma',  manca se TRUE
//      contatto -> campo 'contatto',     manca se FALSE
//      area     -> campo 'inArea',       manca se FALSE
//   Scrivere { gittata: false } intendendo "fuori gittata" da` un bersaglio
//   SANO: il campo non viene nemmeno letto. E` la stessa famiglia delle
//   chiavi degli stati (immobilizedA, non immA) — un dato scritto col nome
//   sbagliato non protesta, risponde "tutto bene". Visto il 7 ottobre.
// ==================================================================
console.log('\n=== B5. Requisiti dichiarati al tavolo ===');

// GIRATA sul motore 2026-10-07.9: le chiavi sono SEI, non cinque. La
// sesta, 'scoperto', e` arrivata col giro Scoprire + Attacco BS. Questa
// prova fissa il NUMERO proprio perche` diventi rossa quando ne compare
// una nuova, invece di lasciarla passare inosservata: ha funzionato.
ok(M.REQUISITI_TAVOLO && Object.keys(M.REQUISITI_TAVOLO).sort().join(',') === 'area,contatto,gittata,lof,sagoma,scoperto',
   `sei chiavi: ${Object.keys(M.REQUISITI_TAVOLO || {}).sort().join(', ')}`);
// La tabella chiave -> campo -> polarita`, fissata voce per voce. E` la
// parte che si sbaglia, quindi e` la parte che va scritta.
const attese = { lof: ['lof', false], gittata: ['fuoriGittata', true], sagoma: ['fuoriSagoma', true],
                 contatto: ['contatto', false], area: ['inArea', false],
                 scoperto: ['nonScoperto', true] };
Object.keys(attese).forEach(function (k) {
    const R = M.REQUISITI_TAVOLO[k] || {};
    ok(R.campo === attese[k][0] && R.mancaSe === attese[k][1],
       `${k} legge il campo ${attese[k][0]}, manca se ${attese[k][1]} (${R.campo}, ${R.mancaSe})`);
});
// E la prova della trappola: il campo scritto col nome della CHIAVE non
// viene letto. Questa prova esiste per chi riscrivera` queste righe.
ok(M.requisitoManca({ gittata: false }, 'gittata') === false,
   '🔴 { gittata: false } NON è "fuori gittata": il campo giusto è fuoriGittata');
ok(M.requisitoManca({ fuoriGittata: true }, 'gittata') === true,
   'e { fuoriGittata: true } sì');
// Lo stesso per la sesta chiave, che ha la polarita` invertita come le
// altre due: 'scoperto' legge `nonScoperto`.
ok(M.requisitoManca({ scoperto: false }, 'scoperto') === false,
   "🔴 { scoperto: false } NON è \"non scoperto\": il campo giusto è nonScoperto");
ok(M.requisitoManca({ nonScoperto: true }, 'scoperto') === true,
   'e { nonScoperto: true } sì');

// 🔴 'scoperto' NON È UN INTERRUTTORE da schermata: a differenza delle
// altre cinque non ha etichette (`si` e `no` sono vuote), perché il
// giocatore non lo dichiara — lo deriva la catena SCOPRIRE + ATTACCO,
// quando allo Scoprire è mancato un requisito e il Marker resta Marker.
// Si fissa, perché una riga di interruttori che lo includesse stamperebbe
// un bottone VUOTO: cliccabile, senza scritta, e nessuno capirebbe cosa fa.
const Rsc = M.REQUISITI_TAVOLO.scoperto;
ok(!Rsc.si && !Rsc.no,
   `la chiave scoperto non ha etichette: non è un interruttore (si ${JSON.stringify(Rsc.si)}, no ${JSON.stringify(Rsc.no)})`);
ok(/Marker resta Marker/.test(String(Rsc.motivo)),
   `ma ha il suo motivo, che dice cosa è andato storto (${String(Rsc.motivo).slice(0, 55)}…)`);
const rigaSc = String(M.rigaRequisiti(['scoperto'], { nonScoperto: false }, 0, 'window.x')).replace(/<[^>]*>/g, '').trim();
ok(rigaSc === '',
   `e infatti rigaRequisiti non le disegna nessun bottone (${JSON.stringify(rigaSc)})`);
// CONTROPROVA: una chiave vera DISEGNA il suo bottone. Senza, "non
// disegna niente" non si distingue da "rigaRequisiti non disegna mai".
ok(/LINEA DI TIRO/.test(String(M.rigaRequisiti(['lof'], { lof: true }, 0, 'window.x'))),
   'CONTROPROVA: la chiave lof invece il suo bottone lo disegna');

console.log('\n--- i dadi persi sul singolo bersaglio ---');
const treBersagli = () => [
    { id: 'b1', name: 'Uno', burst: 3, lof: true, fuoriGittata: false },
    { id: 'b2', name: 'Due', burst: 2, lof: false, fuoriGittata: false },
    { id: 'b3', name: 'Tre', burst: 1, lof: true, fuoriGittata: true }];
const B = treBersagli();
const req = M.requisitiDichiarati(B, ['lof', 'gittata']);
ok(req.mancanti.length === 2, `due bersagli su tre mancano di un requisito (${req.mancanti.length})`);
ok(req.mancanti.map(m => m.nome).sort().join(',') === 'Due,Tre',
   `e sono Due (senza LoF) e Tre (fuori gittata) (${req.mancanti.map(m => m.nome).join(',')})`);
ok(/Linea di Tiro/.test(req.motivo) && /fuori gittata/.test(req.motivo),
   `il motivo nomina entrambe le mancanze (${req.motivo})`);
ok(req.idle === false, 'e NON è un Idle: qualcuno è ancora bersagliabile');

// FIRMA: bersagliConRequisiti(bersagli, REQ) — il risultato, non le chiavi.
const conReq = M.bersagliConRequisiti(B, req);
const perNome = (n) => conReq.find(t => t.name === n) || {};
ok(perNome('Uno').burst === 3 && perNome('Uno').dadiPersi === undefined,
   `chi ha i requisiti resta col suo Burst (Uno: ${perNome('Uno').burst})`);
ok(perNome('Due').burst === 0 && perNome('Due').dadiPersi === 2,
   `chi manca va a Burst 0, e i dadi persi sono scritti (Due: burst ${perNome('Due').burst}, persi ${perNome('Due').dadiPersi})`);
ok(/Linea di Tiro/.test(String(perNome('Due').requisitoMancante)),
   `col motivo accanto, così il tabellone lo dice (${String(perNome('Due').requisitoMancante)})`);
ok(perNome('Tre').burst === 0 && perNome('Tre').dadiPersi === 1,
   `e il terzo pure (Tre: burst ${perNome('Tre').burst}, persi ${perNome('Tre').dadiPersi})`);
// 🔴 I bersagli RESTANO nella busta: non si cancellano. Un bersaglio
// scomparso dal tabellone non si distingue da uno dimenticato.
ok(conReq.length === 3, `e restano TUTTI E TRE nella busta (${conReq.length})`);

console.log('\n--- quando mancano a TUTTI: Idle ---');
const tuttiSenza = [{ id: 'x1', name: 'Uno', burst: 3, lof: false },
                    { id: 'x2', name: 'Due', burst: 2, lof: false }];
const reqIdle = M.requisitiDichiarati(tuttiSenza, ['lof']);
ok(reqIdle.idle === true, 'tutti i bersagli senza requisito: idle true');
ok(reqIdle.mancanti.length === 2, `con tutti e due fra i mancanti (${reqIdle.mancanti.length})`);
// CONTROPROVA: nessuno manca -> niente. Senza, "idle true" non si
// distingue da "idle sempre".
const reqPieno = M.requisitiDichiarati([{ id: 'y1', name: 'Uno', burst: 3, lof: true, fuoriGittata: false }],
    ['lof', 'gittata']);
ok(reqPieno.idle === false && reqPieno.mancanti.length === 0 && reqPieno.motivo === '',
   'CONTROPROVA: nessuna mancanza, nessun idle, motivo vuoto');
ok(M.bersagliConRequisiti([{ id: 'y1', name: 'Uno', burst: 3, lof: true, fuoriGittata: false }], reqPieno)[0].burst === 3,
   'e bersagliConRequisiti non tocca niente');
// E una lista VUOTA non e` un Idle: zero bersagli non e` "tutti mancano".
// Un .length === mancanti.length su due zeri sarebbe vero per sbaglio.
ok(M.requisitiDichiarati([], ['lof']).idle === false,
   'CONTROPROVA: zero bersagli NON è un Idle (due zeri non fanno una regola)');

console.log('\n--- il tasto: tre stati, e porta all Idle vero ---');
function tasto(r) {
    const t = { innerText: '', style: {}, onclick: null };
    M.tastoConRequisiti(t, r, 'ESEGUI', function () { t.__eseguito = true; });
    return t;
}
const tIdle = tasto(reqIdle), tPieno = tasto(reqPieno), tParziale = tasto(req);
ok(tIdle.innerText === 'IDLE', `tutti mancano: il tasto dice IDLE (${tIdle.innerText})`);
ok(tIdle.style.background === M.COLORE_TASTO.idle, `ed è giallo, il colore che il motore chiama idle (${tIdle.style.background})`);
// GIRATA sul motore 2026-10-07.11: i due colori del tasto stanno nel motore,
// M.COLORE_TASTO. Il valido non e` piu` lo sfondo vuoto ma l'arancione della
// pagina: scrivendo '' il tasto lo perdeva, e al tavolo si vedeva cambiare
// colore. Si leggono dal motore, non scritti a mano.
ok(M.COLORE_TASTO && M.COLORE_TASTO.valido && M.COLORE_TASTO.idle,
   `il motore dichiara i due colori del tasto (${JSON.stringify(M.COLORE_TASTO)})`);
ok(M.COLORE_TASTO.valido !== M.COLORE_TASTO.idle,
   'e sono diversi fra loro: altrimenti IDLE non si distinguerebbe a vista');
ok(tPieno.innerText === 'ESEGUI' && tPieno.style.background === M.COLORE_TASTO.valido,
   `nessuno manca: l etichetta dell azione e il colore valido (${tPieno.innerText}, ${tPieno.style.background})`);
ok(tParziale.innerText === 'ESEGUI',
   `ALCUNI mancano: si esegue comunque, a dadi ridotti (${tParziale.innerText})`);
// Il terzo caso e` quello che conta: "alcuni" NON e` "tutti". Un tasto che
// diventasse IDLE con un bersaglio solo mancante toglierebbe l'attacco agli
// altri due.
ok(tParziale.innerText !== tIdle.innerText,
   'e i due casi si distinguono: alcuni ≠ tutti');
// E il tasto PORTA all Idle vero, l unico della pagina, col motivo del
// motore. Senza questa prova "il tasto dice IDLE" non si distingue da "il
// tasto dice IDLE e non fa niente".
let motivoArrivato = null;
window.dichiaraRequisitoFallito = function (m) { motivoArrivato = m; return true; };
tIdle.onclick();
ok(motivoArrivato !== null, 'cliccandolo chiama window.dichiaraRequisitoFallito');
ok(motivoArrivato === reqIdle.motivo,
   `col motivo scritto dal motore, identico (${String(motivoArrivato).slice(0, 55)}…)`);
ok(tIdle.__eseguito === undefined, 'e NON esegue l azione: l Idle la sostituisce');
// CONTROPROVA: il tasto non-idle esegue, e non chiama l Idle.
motivoArrivato = null;
tPieno.onclick();
ok(tPieno.__eseguito === true && motivoArrivato === null,
   'CONTROPROVA: col requisito a posto il tasto ESEGUE e non chiama l Idle');
delete window.dichiaraRequisitoFallito;

console.log('\n--- gli interruttori, e il giro completo di una risposta ---');
const riga = String(M.rigaRequisiti(['lof', 'gittata'], B[0], 0, 'window.cambia'));
ok(/LINEA DI TIRO S/.test(riga) && /IN GITTATA S/.test(riga),
   'la riga di interruttori porta l etichetta di ogni requisito');
ok(/window.cambia/.test(riga), 'e chiama il comando che la schermata le passa');
ok(/\(0, ?'lof'\)/.test(riga) || /0, *'lof'/.test(riga),
   `col indice del bersaglio e la chiave (${(/window\.cambia\([^)]*\)/.exec(riga) || ['?'])[0]})`);
// FIRMA: invertiRequisito(BERSAGLIO, chiave) — muta il bersaglio.
const uno2 = { id: 'z1', name: 'Uno', burst: 3, lof: true, fuoriGittata: false };
ok(M.requisitoManca(uno2, 'lof') === false, 'premessa: il bersaglio ha la Linea di Tiro');
ok(M.invertiRequisito(uno2, 'lof') === true, 'invertiRequisito risponde true');
ok(uno2.lof === false && M.requisitoManca(uno2, 'lof') === true,
   `e il campo è girato: ora la LoF manca (lof ${uno2.lof})`);
M.invertiRequisito(uno2, 'lof');
ok(uno2.lof === true && M.requisitoManca(uno2, 'lof') === false,
   'girandolo di nuovo torna come prima: è un interruttore, non un senso unico');
// La polarita` invertita, girata: fuoriGittata parte false e diventa true.
const uno3 = { id: 'z2', name: 'Uno', burst: 3, fuoriGittata: false };
M.invertiRequisito(uno3, 'gittata');
ok(uno3.fuoriGittata === true && M.requisitoManca(uno3, 'gittata') === true,
   `e sulla gittata gira il campo fuoriGittata, non "gittata" (${JSON.stringify(uno3)})`);

// ==================================================================
// B7. IL GETTONE PIAZZATO
//   Due cose distinte: il Gruppo di Combattimento, che prima non ereditava,
//   e la FOTO, che adesso e` un nome di file e non deve arrivare
//   all'avversario quando sotto c'e` un Marker.
// ==================================================================
console.log('\n=== B7. Il gettone piazzato: Gruppo e foto ===');

const portatore2 = { id: 'n1', alias: 'Moran', bs: 11, states: {}, equip: 'CrazyKoalas',
                     combatGroup: 2, imgVariant: 'alguaciles_2.png' };
const creato = M.creaDeployable(portatore2, M.profiloArma('CrazyKoalas'), {});
ok(creato.token && creato.token.deployable === true, 'il gettone nasce');
ok(creato.token && creato.token.combatGroup === 2,
   `col Gruppo di Combattimento del portatore: 2 (${creato.token && creato.token.combatGroup})`);
// CONTROPROVA: un portatore di un altro Gruppo da` un gettone di
// quell altro Gruppo. Senza, "2" non si distingue da un 2 scritto fisso.
const creato3 = M.creaDeployable(Object.assign({}, portatore2, { id: 'n2', combatGroup: 3 }),
    M.profiloArma('CrazyKoalas'), {});
ok(creato3.token && creato3.token.combatGroup === 3,
   `CONTROPROVA: portatore nel Gruppo 3 -> gettone nel Gruppo 3 (${creato3.token && creato3.token.combatGroup})`);

console.log('\n--- la foto: un nome di file, e il Marker la perde ---');
// FIRMA: filtraPerAvversario(UNA unita`), non un array.
const modello = { id: 'u1', alias: 'Alguacil', tipo: 'LI', states: {}, imgVariant: 'alguaciles_2.png' };
const markerCamo = { id: 'u2', alias: 'Spektr', tipo: 'LI', deployState: 'CAMO',
                     states: { camo: true }, imgVariant: 'spektr_1.png' };
const markerImp = { id: 'u3', alias: 'Speculo', tipo: 'LI', deployState: 'IMP',
                    states: { imp: true }, imgVariant: 'speculo_0.png' };
const pubModello = M.filtraPerAvversario(modello);
ok(pubModello && pubModello.imgVariant === 'alguaciles_2.png',
   `di un Modello la foto passa, col NOME DEL FILE (${pubModello && pubModello.imgVariant})`);
const pubCamo = M.filtraPerAvversario(markerCamo);
ok(pubCamo && pubCamo.imgVariant === '0',
   `di un Marker CAMO torna a '0': la foto NON deve arrivare all avversario (${pubCamo && JSON.stringify(pubCamo.imgVariant)})`);
ok(pubCamo && pubCamo.tipo === 'MARKER' && !/Spektr/.test(String(pubCamo.alias)),
   `e nemmeno il nome vero (${pubCamo && pubCamo.alias})`);
const pubImp = M.filtraPerAvversario(markerImp);
ok(pubImp && pubImp.imgVariant === '0', 'e così per un Marker Impersonation');
// 🔴 IL PUNTO CHE ROMPE LE PROVE VECCHIE: imgVariant non è più '0'..'3'.
// Chi scrive imgVariant: '2' aspettandosi "Nome_2.png" non trova più il
// file. Si fissa che una cifra NON viene trasformata in un nome.
const cifra = M.filtraPerAvversario({ id: 'u4', alias: 'Alguacil', tipo: 'LI', states: {}, imgVariant: '2' });
ok(cifra && cifra.imgVariant === '2',
   `una cifra passa come cifra, non diventa "Alguacil_2.png" (${cifra && JSON.stringify(cifra.imgVariant)})`);

// ==================================================================
// 6. I DUE RIPARI DELLA .9 — le firme che avevo segnalato
//   Il 7 ottobre ho segnalato due chiamate che rispondevano qualcosa di
//   plausibile invece di un errore. MOTORE le ha corrette, e un riparo
//   che nessuno misura e` un riparo che si rompe in silenzio — la
//   lezione della .16, dove avevo documentato in COMMENTO e il commento
//   non diventa rosso.
// ==================================================================
console.log('\n=== 6. I due ripari della .9 ===');

console.log('\n--- (a) bersagliConRequisiti: niente eccezione, e lo dice ---');
// Il motivo per cui NON deve sollevare: queste funzioni disegnano
// schermate, e al tavolo un Hub che cade e` peggio di un numero
// sbagliato. Stessa scelta della .16 per bersagliValidi.
const bers6 = [{ id: 'b1', name: 'Uno', burst: 3, lof: true, fuoriGittata: false },
               { id: 'b2', name: 'Due', burst: 2, lof: false, fuoriGittata: false }];
function conErroriRaccolti(f) {
    const raccolti = [];
    const salva = console.error;
    console.error = function () { raccolti.push(Array.prototype.join.call(arguments, ' ')); };
    let esito = null, caduta = null;
    try { esito = f(); } catch (e) { caduta = e.message; }
    console.error = salva;
    return { esito: esito, caduta: caduta, errori: raccolti };
}
// La chiamata SBAGLIATA: le chiavi invece del risultato.
const storta = conErroriRaccolti(() => M.bersagliConRequisiti(bers6, ['lof', 'gittata']));
ok(storta.caduta === null,
   `le chiavi invece del risultato: NESSUNA eccezione (${storta.caduta || 'nessuna'})`);
ok(Array.isArray(storta.esito) && storta.esito.length === 2,
   `e risponde comunque con i due bersagli (${(storta.esito || []).length})`);
ok(storta.esito[0] === bers6[0] && storta.esito[1] === bers6[1],
   'restituiti INVARIATI, gli stessi oggetti: non inventa dadi persi');
ok(storta.errori.length === 1 && /bersagliConRequisiti/.test(storta.errori[0]),
   `ma lo DICE, con un console.error che nomina la funzione (${(storta.errori[0] || '').slice(0, 60)}…)`);
// CONTROPROVA 1: col risultato giusto funziona, e NON stampa niente.
const buona = conErroriRaccolti(() => M.bersagliConRequisiti(bers6, M.requisitiDichiarati(bers6, ['lof'])));
ok(buona.esito[1].burst === 0 && buona.esito[1].dadiPersi === 2,
   `CONTROPROVA: col risultato giusto Due va a Burst 0 con 2 dadi persi (${buona.esito[1].burst}, ${buona.esito[1].dadiPersi})`);
ok(buona.errori.length === 0,
   `e nessun console.error: non e` + ` un rumore sempre acceso (${buona.errori.length})`);
// CONTROPROVA 2, la distinzione fine: `undefined` NON e` una chiamata
// sbagliata — e` "nessun requisito da guardare", che e` legittimo. Quindi
// NON stampa l'errore. Senza questa prova, "stampa quando sbagli" non si
// distingue da "stampa quando il secondo argomento non e` un risultato".
const vuota = conErroriRaccolti(() => M.bersagliConRequisiti(bers6, undefined));
ok(vuota.caduta === null && vuota.esito[0] === bers6[0],
   'req undefined: nessuna eccezione, bersagli invariati');
ok(vuota.errori.length === 0,
   `e NESSUN console.error: "nessun requisito" non è una chiamata sbagliata (${vuota.errori.length})`);

console.log('\n--- (b) filtraPerAvversario: accetta anche un array ---');
const treUnita = [
    { id: 'u1', alias: 'Alguacil', tipo: 'LI', states: {}, imgVariant: 'alguaciles_2.png' },
    { id: 'u2', alias: 'Spektr', tipo: 'LI', deployState: 'CAMO', states: { camo: true }, imgVariant: 'spektr_1.png' },
    { id: 'u3', alias: 'Nascosto', tipo: 'LI', states: { hidden: true }, imgVariant: 'nascosto.png' }
];
const filtrate = M.filtraPerAvversario(treUnita);
ok(Array.isArray(filtrate),
   `con un array risponde un ARRAY, non un oggetto vuoto (${Array.isArray(filtrate) ? 'array' : typeof filtrate})`);
ok(filtrate.length === 2,
   `e togle chi non è sul tavolo: tre dentro, due fuori (${filtrate.length})`);
ok(filtrate.map(p => p && p.alias).join(',') === 'Alguacil,SEGNALINO MIMETICO',
   `il Modello col suo nome, il Marker col segnalino, il Nascosto via (${filtrate.map(p => p && p.alias).join(',')})`);
ok(filtrate[1].imgVariant === '0' && filtrate[0].imgVariant === 'alguaciles_2.png',
   'e la regola della foto vale anche passando dall array: 0 sul Marker, il file sul Modello');
// CONTROPROVA 1: UNA unita` risponde come prima — il riparo non ha
// cambiato il caso che gia` funzionava.
const unaSola = M.filtraPerAvversario(treUnita[0]);
ok(unaSola && !Array.isArray(unaSola) && unaSola.alias === 'Alguacil',
   'CONTROPROVA: con UNA unità risponde come prima, un oggetto solo');
// CONTROPROVA 2: un array VUOTO da` un array vuoto, non null e non {}.
ok(Array.isArray(M.filtraPerAvversario([])) && M.filtraPerAvversario([]).length === 0,
   'e un array vuoto dà un array vuoto');
// CONTROPROVA 3: una unita` NASCOSTA da sola risponde null, come prima —
// cosi` "due su tre" non si confonde con "l array perde sempre uno".
ok(M.filtraPerAvversario(treUnita[2]) === null,
   'e la singola unità nascosta risponde null: è lei che non è sul tavolo');

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
