// @versione 2026-09-23.1 | test_template.js | proprieta`: chat TEST
// Test regole Sagoma — node test_template.js
global.window = global;
require('./catalogo_n5.js');
require('./database_comune.js');
const M = require('./motore_regole_n5.js');

let passati = 0, falliti = 0;
function ok(cond, nome, extra) {
    if (cond) { passati++; console.log(`  ✅ ${nome}`); }
    else { falliti++; console.log(`  ❌ ${nome}${extra ? '\n       ' + extra : ''}`); }
}

const chain   = M.profiloArma('Chain Rifle');          // Goccia Grande -> Diretto
const missile = M.profiloArma('Missile Launcher (Blast)'); // Circolare -> Impatto
const smoke   = M.profiloArma('Smoke Grenades');
const combi   = M.profiloArma('Combi Rifle');          // non a sagoma

console.log('\n=== 1. Diretto vs Impatto ===');
ok(M.tipoTemplate(chain).tipo === 'DIRETTO', 'Chain Rifle (Goccia) = Diretto');
ok(M.tipoTemplate(missile).tipo === 'IMPATTO', 'Missile Launcher Blast (Circolare) = Impatto');
ok(M.tipoTemplate(combi).tipo === null, 'Combi Rifle: non è una Sagoma');

const rC = M.regoleTemplate(chain);
const rM = M.regoleTemplate(missile);
ok(rC.tiroPerColpire === false, 'Diretto: nessun tiro per colpire');
ok(rM.tiroPerColpire === true, 'Impatto: richiede il tiro d attacco');

console.log('\n=== 2. Punto 5: la reazione contro un Diretto è un Tiro Normale ===');
ok(rC.reazione === 'TIRO_NORMALE', 'Diretto: chi reagisce fa un Tiro Normale, non un F2F');
ok(rM.reazione === 'FACCIA_A_FACCIA', 'Impatto: ogni colpito fa il proprio F2F');
ok(rM.confrontoSecondari === 'F2F_INDIPENDENTE', 'i secondari fanno F2F indipendenti fra loro');

console.log('\n=== 3. Punto 1: la Copertura NON dà il +3 al Tiro Salvezza ===');
const conSagoma = M.coperturaValeSullaSalvezza({ inCopertura: true, arma: chain });
ok(!conSagoma.vale && conSagoma.mod === 0, 'in Copertura + lanciafiamme: nessun +3');
console.log('   ' + conSagoma.motivo);
const conFucile = M.coperturaValeSullaSalvezza({ inCopertura: true, arma: combi });
ok(conFucile.vale && conFucile.mod === 3, 'in Copertura + Combi Rifle: +3 regolare');
ok(!M.coperturaValeSullaSalvezza({ inCopertura: false, arma: combi }).vale, 'senza Copertura: niente +3');
ok(!M.coperturaValeSullaSalvezza({ inCopertura: true, arma: combi, ignoraCopertura: true }).vale,
   'attacco che ignora la Copertura (Guidato): niente +3');
ok(rC.coperturaAnnullaSalvezza && rM.coperturaAnnullaSalvezza,
   'la regola vale per entrambi i tipi di Sagoma');

console.log('\n=== 4. Il -3 BS all attaccante NON è toccato dalla stessa regola ===');
ok(rM.coperturaRiduceAttacco === true,
   'Impatto: un tiro c è, quindi il -3 BS per Copertura resta');
ok(rC.coperturaRiduceAttacco === false,
   'Diretto: nessun tiro, quindi nessun -3 da applicare');

console.log('\n=== 5. Punti 2, 3 e 4 ===');
ok(rM.criticoSoloSulPrincipale, 'Critico solo sul Bersaglio Principale');
ok(rM.modDalBersaglioPrincipale, 'MOD calcolati una volta sola sul Principale');
ok(rM.fallisceSePrincipaleFuoriArea, 'Principale fuori area = attacco fallito, nessuno colpito');

console.log('\n=== 6. Punto 6 e schivata a PH-3 ===');
ok(rC.schivata.concessaSenzaLoF, 'Schivata concessa anche senza LoF verso chi attacca');
ok(M.regoleTemplate(chain, {}).schivata.mod === 0, 'con LoF: Schivata su PH pieno');
const senzaLoF = M.regoleTemplate(chain, { haLoFVersoAttaccante: false });
ok(senzaLoF.schivata.mod === -3, 'senza LoF verso l attaccante: PH-3');
const mina = M.regoleTemplate(chain, { armaDeployable: true });
ok(mina.schivata.mod === -3, 'arma Deployable (mina): PH-3');
console.log('   motivi PH-3: ' + senzaLoF.schivata.motivi.concat(mina.schivata.motivi).join(', '));

console.log('\n=== 7. Punto 7: alleati nell area ===');
ok(rC.colpoAnnullatoSeAlleatiInArea, 'lanciafiamme + alleato nell area: colpo annullato');
ok(rC.consumaUsoSeDisposable, 'se Disposable, l uso viene consumato lo stesso');
const rS = M.regoleTemplate(smoke);
ok(rS.puoCoinvolgereAlleati && !rS.colpoAnnullatoSeAlleatiInArea,
   'Smoke (nessun PS, nessuno Stato): PUÒ coinvolgere alleati',
   'ammo=' + smoke.ammo);

console.log('\n=== 8. Punto 8: Sagoma su una mischia ===');
const inCC = M.regoleTemplate(chain, { inCorpoACorpo: true });
ok(inCC.coinvolgeTuttaLaMischia, 'colpisce tutti i partecipanti al Corpo a Corpo');
ok(inCC.note.some(n => n.includes('Corpo a Corpo')), 'con la nota di regolamento allegata');

console.log('\n=== 9. Copertura del database ===');
const sagome = Object.keys(window.RULES_WEAPONS).filter(k => window.RULES_WEAPONS[k].isTemplate);
const senzaTipo = sagome.filter(k => M.tipoTemplate(M.profiloArma(k)).avvisi.length > 0);
ok(senzaTipo.length === 0, `tutte le ${sagome.length} armi a Sagoma classificate senza ambiguità`,
   senzaTipo.join(', '));

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
