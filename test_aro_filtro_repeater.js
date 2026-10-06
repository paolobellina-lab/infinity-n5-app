// @versione 2026-10-06.2 | test_aro_filtro_repeater.js | proprieta`: chat INTERFACCIA
// ============================================================================
//  Dalla chat INTERFACCIA, 6 ottobre 2026.
//
//  COSA PROVA, dalla pagina vera del giocatore reattivo (app.html caricata
//  per intero, si entra da avviaCicloAroUnita e dai comandi dei pulsanti):
//  1. I pulsanti delle ARO sono quelli che dice M.azioniAroPossibili, anche
//     con uno stato addosso. C'era un secondo filtro (puoFareAzione, scritta
//     per il Turno Attivo) che a un Isolato toglieva tutti i pulsanti e a un
//     Ingaggiato l'Attacco CC.
//  2. Salto / Ingresso in Campo: se l'allarme porta coperturaNegata, la
//     schermata dell'ARO non offre la Copertura e dice perche`.
//  3. Hacking in ARO via Repeater nemico: il pulsante, il campo
//     reazione.repeaterNemico (sempre true/false), l'avviso se l'attivo non
//     e` un Hacker.
//  4. Sul tabellone dell'Hub: requisito fallito -> si legge IDLE.
//     ATTENZIONE: qui la busta dell'attivo e` scritta a mano, nella forma di
//     eseguiCalcoloBS. Il giro intero su tre dispositivi (attivo, Hub,
//     reattivo) NON sta in questo banco: e` del banco del giro, chat TEST.
//
//  NON PROVA le regole (quali ARO, Firewall, quando la Copertura e` negata):
//  sono del MOTORE. Qui si guarda solo che la schermata le rispetti.
//
//  USO:  CARTELLA=/percorso/ node test_aro_filtro_repeater.js
// ============================================================================
const DIR = (process.env.CARTELLA || '/mnt/project/').replace(/\/?$/, '/');
const fs = require('fs'), vm = require('vm');
const nonCaricati = [], assenti = [];
let passati = 0, falliti = 0;
function ok(c, d, visto) {
  if (c) { passati++; console.log('  \u2713 ' + d); }
  else { falliti++; console.log('  \u2717 ' + d + (visto !== undefined ? '  [visto: ' + JSON.stringify(visto) + ']' : '')); }
}
const pagina = fs.readFileSync(DIR + 'app.html', 'utf8');

function apri() {
  const g = {}; g.window = g; g.globalThis = g; g.console = { log: () => {}, warn: () => {}, error: () => {} };
  const el = {}; const finto = (id) => { if (!el[id]) el[id] = { id, innerHTML: '', innerText: '', style: {}, disabled: false, appendChild: () => {}, addEventListener: () => {}, value: '', classList: { add: () => {}, remove: () => {} }, setAttribute: () => {}, getAttribute: () => null, options: [], cloneNode() { return finto(id + '_c'); }, parentNode: { replaceChild: () => {}, insertBefore: () => {} }, querySelector: () => null }; return el[id]; };
  const locale = {};
  g.localStorage = { getItem: k => (k in locale ? locale[k] : null), setItem: (k, v) => locale[k] = v, removeItem: k => delete locale[k] };
  g.location = { search: '?fazione=nomadi', replace: () => {}, href: '' };
  let t = 'NOMADS TACTICAL TERMINAL';
  g.document = { get title() { return t; }, set title(v) { t = v; }, documentElement: { setAttribute: () => {} }, scripts: [], getElementById: finto, createElement: () => finto('n'), querySelector: () => finto('q'), querySelectorAll: () => [], addEventListener: () => {}, write: () => {} };
  g.alert = () => {}; ['scrollTo', 'addEventListener'].forEach(k => g[k] = () => {});
  g.setInterval = () => 0; g.setTimeout = (fn) => { fn && fn(); return 0; };
  g.history = { pushState: () => {}, replaceState: () => {}, back: () => {} }; g.navigator = {};
  g.prompt = () => 'fuori distanza'; g.confirm = () => true;
  g.firebase = { initializeApp: () => {}, database: () => ({ ref: () => ({ on: () => {}, set: () => {}, remove: () => {} }) }) };
  const ctx = vm.createContext(g);
  g.cloudPronto = Promise.resolve({ confermato: true });
  [...pagina.matchAll(/<script(?:\s+src="([^"]+)")?\s*>([\s\S]*?)<\/script>/g)].forEach(m => {
    const s = m[1];
    if (s) { if (/^https?:/.test(s)) return; const f = DIR + s.split('?')[0]; if (!fs.existsSync(f)) { assenti.push(s); return; }
      try { vm.runInContext(fs.readFileSync(f, 'utf8'), ctx, { filename: s }); } catch (e) { nonCaricati.push(s + ': ' + e.message); } }
    else { try { vm.runInContext(m[2], ctx); } catch (e) { nonCaricati.push('script in linea: ' + e.message); } }
  });
  g.el = finto;
  return g;
}
const pulsanti = (g) => (g.el('aro-action-list').innerHTML.match(/selezionaAzioneAro\('([^']+)'\)/g) || []).map(s => s.replace(/.*\('|'\)/g, '')).sort();
// Il giocatore Nomadi reagisce; l'attivo e` di PanOceania. Profili dal database.
function tavolo(reNomade, stati, attivi) {
  const g = apri(); const M = g.MotoreN5;
  const u = { ...g.DB_NOMADI.find(x => reNomade.test(x.nome)), id: 'n1', alias: 'Reattivo', states: stati || {}, deployState: 'NORMAL', state: 'ACTIVE', combatGroup: 1 };
  const nemici = (attivi || [/^Fusilier \(Combi/]).map((re, i) => ({ ...g.DB_PANOCEANIA.find(x => re.test(x.nome)), id: 'p' + i, alias: 'Attivo' + i, states: {} }));
  g.roster = [u];
  g.gameState = { nomads: g.roster, panoceania: nemici, activeFaction: 'PANOCEANIA' };
  // Il roster nemico il motore lo legge dallo stato del tavolo: qui glielo
  // si da` dalla sua porta di prova, come fanno i banchi del MOTORE.
  M._statoGioco = g.gameState;
  g.aro = (azione, extra) => {
    g.currentAttackData = Object.assign({ attaccanti: ['Attivo0'], azione: azione }, extra || {});
    g.selectedAroUnits = ['n1']; g.currentAroIndex = 0; g.aroReactions = []; g.aroSfMode = false;
    g.avviaCicloAroUnita();
  };
  g.attesi = (azione) => M.azioniAroPossibili(u, azione, { attivo: g.unitaAttivaDiTurno() }).filter(a => a.ammesso).map(a => a.id).sort();
  return g;
}

console.log('--- la pagina ---');
let g = tavolo(/^Alguacil \(Combi/);
ok(assenti.length === 0 && nonCaricati.length === 0, 'tutti gli script si caricano', assenti.concat(nonCaricati).slice(0, 3));

console.log('\n--- 1. i pulsanti sono quelli del motore ---');
g.aro('ATTACCO BS');
ok(pulsanti(g).length > 0 && pulsanti(g).join() === g.attesi('ATTACCO BS').join(), 'senza stati: ' + pulsanti(g).join(', '));
[['isolated', 'Isolato'], ['engaged', 'Ingaggiato'], ['possessed', 'Posseduto'], ['stunned', 'Stordito'], ['immobilizedA', 'IMM-A'], ['immobilizedB', 'IMM-B'], ['retreat', 'Ritirata!'], ['foxhole', 'Trincerato']].forEach(([st, nome]) => {
  ['ATTACCO BS', 'MOVIMENTO'].forEach(az => {
    const h = tavolo(/^Alguacil \(Combi/, { [st]: true }); h.aro(az);
    ok(pulsanti(h).join() === h.attesi(az).join(), nome + ' contro ' + az + ': [' + pulsanti(h).join(', ') + ']', { attesi: h.attesi(az) });
  });
});
let h = tavolo(/^Alguacil \(Combi/, { isolated: true }); h.aro('ATTACCO BS');
ok(pulsanti(h).includes('BS_ATTACK'), 'il caso misurato: un Isolato puo` rispondere al fuoco', pulsanti(h));
h = tavolo(/^Alguacil \(Combi/, { engaged: true }); h.aro('ATTACCO CC');
ok(pulsanti(h).includes('CC_ATTACK'), 'il caso misurato: un Ingaggiato ha l\'Attacco CC', pulsanti(h));

const fxh = tavolo(/^Alguacil \(Combi/, { foxhole: true }); fxh.aro('ATTACCO BS');
const notaFx = fxh.MotoreN5.foxholeAllaDichiarazione(fxh.roster[0], 'SCHIVATA', { inAro: true }).nota;
ok(!!notaFx && fxh.el('aro-action-list').innerHTML.includes(notaFx), 'Trincerato che reagisce: legge la nota del motore sul Foxhole in ARO', notaFx);
ok(!/Foxhole/.test(g.el('aro-action-list').innerHTML), 'controprova: chi non e` Trincerato non la legge');

console.log('\n--- 2. Copertura negata dall\'azione dell\'attivo ---');
const M = g.MotoreN5;
const negata = M.coperturaNegataDaAzioni(['SALTO']);
ok(!!negata, 'premessa: per il motore il SALTO nega la Copertura', negata);
function finoAiMod(x, extra) { x.aro('SALTO', extra); x.selezionaAzioneAro('BS_ATTACK'); x.selezionaArmaAro('Combi Rifle'); x.selezionaBersaglioAro('Attivo0'); return x.el('aro-modifiers-content').innerHTML; }
let conNeg = finoAiMod(g, { coperturaNegata: negata });
ok(!/toggleAroCover/.test(conNeg), 'con coperturaNegata nell\'allarme: niente interruttore della Copertura');
ok(/NIENTE COPERTURA/.test(conNeg) && (!negata.motivo || conNeg.includes(negata.motivo)), 'e il motivo e` a schermo, col testo del motore', conNeg.replace(/<[^>]+>/g, ' ').slice(-300));
g.aroCurrentConfig.cover = true; g.renderAroModifiersUI(); g.inviaAro = () => {}; g.salvaAroCorrente();
ok(g.aroReactions[0] && g.aroReactions[0].cover === false, 'e la reazione parte con cover false anche se era rimasta accesa', g.aroReactions[0] && g.aroReactions[0].cover);
let k = tavolo(/^Alguacil \(Combi/);
ok(/toggleAroCover/.test(finoAiMod(k, { coperturaNegata: null })), 'controprova: senza coperturaNegata l\'interruttore c\'e`');

console.log('\n--- 3. Hacking in ARO via Repeater nemico ---');
const REP = g.CATALOGO_N5.REPEATER_NEMICO;
function hack(attivi) {
  const x = tavolo(/^Intruder \(Hacker, Killer/, {}, attivi);
  x.aro('MOVIMENTO'); x.selezionaAzioneAro('HACKING'); x.selezionaArmaAro('TRINITY'); x.selezionaBersaglioAro('Attivo0');
  x.schermo = () => x.el('aro-modifiers-content').innerHTML; x.inviaAro = () => {};
  return x;
}
let a = hack([/^Fusilier \(Hacker/]);
ok(a.schermo().includes(REP.pulsante) && /toggleAroRepeater/.test(a.schermo()), 'il pulsante c\'e`, col testo del catalogo', a.schermo().replace(/<[^>]+>/g, ' ').slice(0, 300));
ok(/: NO</.test(a.schermo()), 'e nasce su NO');
ok(/ZONA HACKING/.test(a.schermo()) && !/setAroAmmo|setAroTerreno/.test(a.schermo()), 'la schermata e` quella dell\'Hacking: riquadro ZONA HACKING, niente munizioni ne` terreno');
a.toggleAroRepeater();
ok(a.schermo().includes(REP.spiegazione) && /REQUISITO NON SODDISFATTO/.test(a.schermo()) === false, 'acceso contro un Hacker: spiegazione si`, avviso di Idle no');
a.salvaAroCorrente();
ok(a.aroReactions[0].repeaterNemico === true, 'e la reazione porta repeaterNemico true', a.aroReactions[0].repeaterNemico);
let b = hack([/^Fusilier \(Combi/]);
b.toggleAroRepeater();
ok(/REQUISITO NON SODDISFATTO/.test(b.schermo()) && b.schermo().includes(REP.seNonHacker), 'acceso contro un NON Hacker: avviso di Idle, col testo del catalogo', b.schermo().replace(/<[^>]+>/g, ' ').slice(-300));
b.toggleAroRepeater(); b.salvaAroCorrente();
ok(b.aroReactions[0].repeaterNemico === false, 'spento: repeaterNemico false (non assente)', b.aroReactions[0].repeaterNemico);
let c = tavolo(/^Alguacil \(Combi/); c.aro('ATTACCO BS'); c.selezionaAzioneAro('BS_ATTACK'); c.selezionaArmaAro('Combi Rifle'); c.selezionaBersaglioAro('Attivo0');
ok(!/toggleAroRepeater/.test(c.el('aro-modifiers-content').innerHTML), 'controprova: in un Attacco BS il pulsante non compare');
c.inviaAro = () => {}; c.salvaAroCorrente();
ok(c.aroReactions[0].repeaterNemico === false, 'e la reazione BS porta repeaterNemico false');

console.log('\n--- 4. sul tabellone dell\'Hub ---');
// Lo scontro lo calcola il motore e lo adatta calcolatore_math: qui si
// costruisce solo la busta, con la reazione uscita dalla schermata sopra.
(function () {
  const w = b; // stessa finestra: motore e database sono gia` caricati
  vm.runInContext(fs.readFileSync(DIR + 'calcolatore_math.js', 'utf8'), w);
  vm.runInContext(fs.readFileSync(DIR + 'calcolatore_controller.js', 'utf8'), w);
  const fus = w.MotoreN5._statoGioco.panoceania[0]; w.gameState = w.MotoreN5._statoGioco;
  function disegna(rep) {
    const r = Object.assign({}, b.aroReactions[0], { repeaterNemico: rep });
    w.gameState.activeFaction = 'PANOCEANIA';
    // La busta dell'attivo ha la forma che scrive eseguiCalcoloBS
    // (ordine_attacco_bs.js): attaccante, azione, arma dal motore, bersagli.
    const scontri = w.generaRisoluzioneDaDati({ attivo: fus.alias, attacchi: [{
      attaccante: fus.alias, arma: w.MotoreN5.profiloArma('Combi Rifle'), azione: 'ATTACCO BS',
      bersagli: [{ id: 'n1', name: 'Reattivo', nome: 'Reattivo', burst: 3, rangeIndex: 1, rangeMod: 3, cover: false, terrain: 'NESSUNO' }] }] }, [r]);
    w.mostraSchermataRisoluzione(scontri);
    return { scontri, testo: w.el('clash-container').innerHTML.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ') };
  }
  let d; try { d = disegna(true); } catch (e) { d = { errore: e.message, testo: '', scontri: [] }; }
  const lato = d.scontri[0] && d.scontri[0].reattivo;
  ok(lato && lato.dati && lato.dati.requisitoFallito === true && lato.burst === 0, 'premessa: il motore da` requisitoFallito e burst 0 al reattivo', d.errore || (lato && { burst: lato.burst, dati: lato.dati && lato.dati.requisitoFallito }));
  ok(/IDLE/.test(d.testo) && /Requisito non soddisfatto/.test(d.testo), 'e il tabellone lo DICE: IDLE, requisito non soddisfatto', d.testo.slice(0, 400));
  let e2; try { e2 = disegna(false); } catch (e) { e2 = { testo: 'ERR ' + e.message }; }
  ok(!/IDLE/.test(e2.testo) && /Successo al/.test(e2.testo), 'controprova: senza Repeater e` un tiro normale, niente IDLE', e2.testo.slice(0, 300));

  // Le note dello scontro e i valori mancanti. Qui lo scontro e` scritto a
  // mano nella forma che esce da generaRisoluzioneDaDati: si prova solo il
  // disegno, il calcolo e` del MOTORE.
  const finto = (extra) => Object.assign({ nome: 'X', fazione: 'NOMADI', azione: 'SALTO', mod: 12, burst: 1, dettagliMod: '', salvezza: '' }, extra);
  const disegnaScontro = (s) => { w.mostraSchermataRisoluzione([s]); return w.el('clash-container').innerHTML.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '); };
  const conNota = disegnaScontro({ titolo: 'TIRO NORMALE', attivo: finto({}), reattivo: finto({ fazione: 'PANOCEANIA', burst: 0 }),
    coperturaNegata: { azione: 'SALTO', riga: '2762-2763', dichiarataEIgnorata: true }, note: ['TESTO-DEL-MOTORE sulla copertura'] });
  ok(/COPERTURA PARZIALE NEGATA/.test(conNota) && /TESTO-DEL-MOTORE sulla copertura/.test(conNota), 'scontro.coperturaNegata e scontro.note si leggono sul tabellone, fuori dai dettagli', conNota.slice(0, 300));
  const senzaNota = disegnaScontro({ titolo: 'TIRO NORMALE', attivo: finto({}), reattivo: finto({ fazione: 'PANOCEANIA', burst: 0 }) });
  ok(!/COPERTURA PARZIALE NEGATA/.test(senzaNota), 'controprova: senza note nessun riquadro');
  const nullo = disegnaScontro({ titolo: 'TIRO DI SUPPORTO / DIFESA', attivo: finto({ mod: null }), reattivo: finto({ fazione: 'PANOCEANIA', burst: 0 }) });
  ok(!/Successo al: null/.test(nullo) && /non fornito dal calcolo/.test(nullo), 'mod null con burst 1: non si stampa "Successo al: null"', nullo.slice(0, 200));
})();

console.log('\n' + passati + ' passati, ' + falliti + ' falliti');
process.exit(falliti ? 1 : 0);
