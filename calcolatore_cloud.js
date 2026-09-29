// @versione 2026-09-28.1 | calcolatore_cloud.js | proprieta`: chat MOTORE
// Trasporto dell'Hub. Dal 28 settembre il codice NON sta piu` qui: e` una
// funzione sola nel motore, M.installaTrasportoCloud, usata anche dall'app
// (motore_core.js). Prima erano due copie, e una correzione dell'app — la
// cancellazione immediata in locale — non era mai arrivata all'Hub.
// ⚠️ ORDINE: nell'Hub va caricato DOPO motore_regole_n5.js e dopo Firebase.

const trasportoCloud = window.MotoreN5.installaTrasportoCloud();
window.cloudPronto  = trasportoCloud.attesa.pronto;
window.riprovaCloud = trasportoCloud.attesa.riprova;
window.statoCloud   = trasportoCloud.attesa.stato;
console.log("☁️ N5 Cloud Manager Inizializzato (trasporto unico del motore).");
