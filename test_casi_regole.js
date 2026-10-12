// @versione 2026-09-24.2 | test_casi_regole.js | proprieta`: chat TEST
// ================================================================
// I cinque casi chiusi dalla chat REGOLE il 23 settembre, ognuno con la sua
// controprova — senza, un "sì" non distingue la regola dalla fortuna.
// Righe citate: REGOLE_N5_v5_1_1.txt 6646-6648, 11130-11131, 7746-7752, F17.
// ================================================================
let passati = 0, falliti = 0;
const ok = (c, m) => { if (c) { passati++; console.log('  ✅ ' + m); } else { falliti++; console.log('  ❌ ' + m); } };
const J = JSON.stringify;

global.window = global;
require('./catalogo_n5.js'); require('./database_comune.js');
require('./database_nomad.js'); require('./database_panoceania.js');
const M = require('./motore_regole_n5.js');
const T = [...window.DB_NOMADI, ...window.DB_PANOCEANIA];
const U = (n, s) => { const u = T.find(x => x.nome === n); if (!u) throw new Error('profilo assente: ' + n);
                      return Object.assign(JSON.parse(J(u)), { states: s || {} }); };

console.log('\n=== 1. Total Reaction e il (+1B) del profilo (righe 6646-6648) ===');
// In ARO il Total Reaction dà il Burst PIENO DELL'ARMA: il (+1B) scritto nel
// profilo non si somma. In Turno Attivo invece sì.
const tb = U('Reaktion Zond (Thunderbolt)');
ok(/\(\+1B\)/.test(tb.weapon || ''), `il profilo porta la notazione (${tb.weapon})`);
const pTb = M.profiloArma(tb.weapon);
ok(pTb.burst === 2, `Thunderbolt: B2 nel database (${pTb.burst})`);
ok(M.burstReattivo(tb, pTb, {}).valore === 2, `in ARO: B2, il (+1B) non si somma (${M.burstReattivo(tb, pTb, {}).valore})`);
ok(M.burstIniziale(tb, pTb, { azione: M.AZIONI.BS_ATTACK }).valore === 3,
   `controprova — in Turno Attivo: B3, il (+1B) si applica (${M.burstIniziale(tb, pTb, { azione: M.AZIONI.BS_ATTACK }).valore})`);
// E il caso dell'HMG, quello citato da REGOLE: B4 e non B5.
const hmg = U('Reaktion Zond (HMG)');
ok(M.burstReattivo(hmg, M.profiloArma('Heavy Machine Gun'), {}).valore === 4, 'HMG con Total Reaction in ARO: B4');

console.log('\n=== 2. Il Firewall del TinBot su una truppa Posseduta (righe 11130-11131) ===');
const conTin = T.find(u => /TinBot/i.test((u.equip || '') + (u.skills || '')));
ok(!!conTin, `profilo con TinBot: ${conTin && conTin.nome}`);
const sana = U(conTin.nome, {});
const posseduta = U(conTin.nome, { possessed: true });
ok(M.valoreFirewall(sana) !== 0, `controprova — sana: il Firewall vale ${M.valoreFirewall(sana)}`);
ok(M.valoreFirewall(posseduta) === 0, `Posseduta: nessun Firewall (${M.valoreFirewall(posseduta)})`);
// Il MOD dell'hacker segue: senza Firewall non c'è il -3 (o -6) da applicare.
const inter = U('Interventor (Hacker Plus)');
const modSu = (b) => M.modAttacco(inter, b, null, M.AZIONI.HACKING, { programma: 'CARBONITE' });
const vociSana = modSu(sana).voci.filter(v => /Firewall/i.test(v.motivo));
const vociPoss = modSu(posseduta).voci.filter(v => /Firewall/i.test(v.motivo));
ok(vociSana.length > 0 && vociPoss.length === 0,
   `e il MOD dell hacker lo segue: sana ${J(vociSana.map(v => v.valore))}, Posseduta nessuna voce`);

console.log('\n=== 3. Hidden Deployment scoperto dal Sensor ===');
const sp = Object.assign(U('Spektr (MULTI Sniper Rifle)', { hidden: true }), { deployState: 'HIDDEN', state: 'HIDDEN' });
const dopo = (ab) => M.statoDopoAbilita(sp, ab, {}).dopo;
ok(dopo('SENSOR').marker === null && dopo('SENSOR').deployState === 'NORMAL',
   `scoperto dal Sensor: Modello, non Marker (${dopo('SENSOR').deployState})`);
ok(dopo('MOVIMENTO CAUTO').marker === 'CAMO',
   `controprova — lo stesso che dichiara Movimento Cauto: resta Marker (${dopo('MOVIMENTO CAUTO').marker})`);
ok(M.statoBersaglio(M.statoDopoAbilita(sp, 'SENSOR', {}).unitaAggiornata).camo === false,
   'e il motore lo vede come Modello, non solo il riepilogo');

console.log('\n=== 4. Guidato: il secondario schiva ma non resetta (righe 7746-7752) ===');
// Il ruolo non serve nel contratto: il bersaglio designato del Guidato è uno
// solo, quello in Stato Bersagliato, e il motore lo legge dallo stato della
// truppa. azioniAroPossibili resta a due argomenti (chiarimento di MOTORE).
const ammesse = (st, arrivo) => (M.azioniAroPossibili({ states: st }, arrivo) || [])
    .filter(a => a.ammesso).map(a => a.id);
const designato = ammesse({ targeted: true }, M.AZIONI.GUIDATO);
const secondario = ammesse({}, M.AZIONI.GUIDATO);
ok(designato.includes('DODGE') && designato.includes('RESET'),
   `il bersaglio designato può Schivare e Resettare (${J(designato)})`);
ok(secondario.includes('DODGE') && !secondario.includes('RESET'),
   `il secondario sotto la sagoma schiva ma non resetta (${J(secondario)})`);
// Controprova: contro un Hacking il Reset spetta a chiunque — lì il
// Bersagliato non c'entra, e senza questa prova il "no" sopra potrebbe essere
// un Reset negato per un altro motivo.
ok(ammesse({}, M.AZIONI.HACKING).includes('RESET'),
   'controprova: contro un Hacking il Reset resta ammesso anche senza Bersagliato');

console.log('\n=== 5. Sesto Senso e Rumore Bianco (F17) ===');
// Il terreno si dichiara sulla REAZIONE, chiave `terrain` (misurato da
// MOTORE: su modReazione diretto è ignorato). Nessun profilo dei due
// database ha Visore e Sesto Senso insieme, quindi la truppa si costruisce —
// è un caso di regola, non di dati, e la differenza sta in una skill sola.
const rumore = (window.DB_TERRENI || []).find(t => /Rumore Bianco/i.test(String(t.tratti || t.traits || '')));
ok(!!rumore, `il terreno di Rumore Bianco è nel database: ${rumore && rumore.id} (${rumore && rumore.nome})`);
const fusBase = U('Fusilier (Combi Rifle)');
const conVisore = (skills) => Object.assign({}, fusBase, { skills: skills, states: {} });
const attraverso = (d) => M.risolviScontro(
    { attaccante: U('Alguacil (Combi Rifle)'), arma: M.profiloArma('Combi Rifle'),
      azione: M.AZIONI.BS_ATTACK, rangeIndex: 1, burst: 3, bersaglio: d },
    { difensore: d, azione: 'BS_ATTACK', arma: M.profiloArma('Combi Rifle'), rangeIndex: 1,
      bersaglio: U('Alguacil (Combi Rifle)'), terrain: rumore.id }).reattivo;
const soloVisore = attraverso(conVisore('Multispectral Visor L2'));
const visoreESS = attraverso(conVisore('Multispectral Visor L2, Sixth Sense'));
ok(soloVisore.voci.some(v => v.valore === -6),
   `controprova — solo Visore L2: il -6 del Rumore Bianco c'è, tira a ${soloVisore.mod}`);
ok(!visoreESS.voci.some(v => v.valore === -6),
   `con il Sesto Senso: nessun -6, tira a ${visoreESS.mod}`);
ok(visoreESS.mod - soloVisore.mod === 6, `la differenza è esattamente 6 (${soloVisore.mod} -> ${visoreESS.mod})`);
// E il motore riconosce i due Tratti separatamente: la prova sopra cambia
// una skill sola, quindi misura quella e non il profilo.
ok(M.trattiTiro(conVisore('Multispectral Visor L2')).sestoSenso === false &&
   M.trattiTiro(conVisore('Multispectral Visor L2, Sixth Sense')).sestoSenso === true,
   'e la differenza fra le due truppe è solo il Sesto Senso');

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
