// @versione 2026-10-06.1 | test_giro_da_selectaction.js | proprieta`: chat TEST
// ============================================================================
//  test_giro_da_selectaction.js
//  Dalla chat INTERFACCIA, 29 settembre 2026.
//
//  COSA AGGIUNGE A test_giro_ritorno
//  Quello parte da inviaAllarmeAro con l'identificativo dell'Ordine messo a
//  mano. Questo parte da SELECTACTION, cioe' dal pulsante che il giocatore
//  tocca: l'identificativo lo genera il router, come in partita.
//
//  IL PERCORSO, per intero e con tre localStorage separati
//     app NOMADI      selectAction -> il router crea l'ordineId
//                     -> inviaAllarmeAro -> canale di comunicazione
//     HUB             il suo ciclo lo legge e lo inoltra come allarme
//     app PANOCEANIA  il suo ciclo lo consuma -> currentAttackData
//
//  COSA VERIFICA
//     l'ordineId nasce a selectAction (prima era undefined)
//     arriva intero fino a currentAttackData del reattivo
//     la seconda meta' dell'Ordine conserva lo stesso identificativo
//
//  PERCHE' CONTA
//  I ritardatari dell'ARO sono legati all'Ordine: se le due meta' avessero
//  identificativi diversi, chi ha scelto RITARDA perderebbe il turno in
//  silenzio. Con l'identificativo scritto a mano nel banco, quel caso non
//  si vede.
//
//  DI CHI E` IL CODICE PROVATO
//  selectAction e la creazione dell'identificativo stanno in motore_core.js,
//  che e` della chat MOTORE: questo banco prova il loro router attraverso le
//  schermate. Se cambia il router, e` il banco da far girare.
//
//  USO:  node test_giro_da_selectaction.js
//  ESITO: "N passati, M falliti"; uscita 1 se qualcosa fallisce.
// ============================================================================

// Le verifiche. Una dimostrazione che stampa e basta non puo` diventare
// rossa: se il router smettesse di creare l'identificativo, stamperebbe
// "undefined" e uscirebbe verde. (Segnalato dalla chat MOTORE.)
// La cartella si passa con CARTELLA=, come in tutti gli altri banchi: con un
// percorso fisso si prova solo quello che è GIÀ nel progetto, e non i file
// candidati — cioè proprio il momento in cui un banco serve di più. (Chiesto
// da MOTORE il 29 settembre: senza, non poteva provare il router prima di
// consegnarlo, e il suo verso rosso ha finito per misurare il router sano.)
const DIR = (process.env.CARTELLA || __dirname).replace(/\/?$/, '/');
// Un file che non si carica NON si salta in silenzio: è la forma del catalogo
// sparito del 28 settembre, dove a nominarlo fu test_caricamento_pagine. Qui
// si contano e si dicono, e la prova cade.
const nonCaricati = [], assenti = [];
let passati = 0, falliti = 0;
function ok(condizione, descrizione, visto) {
  if (condizione) { passati++; console.log('  \u2713 ' + descrizione); }
  else { falliti++; console.log('  \u2717 ' + descrizione + (visto !== undefined ? '  [visto: ' + JSON.stringify(visto) + ']' : '')); }
}

// Il giro completo partendo da dove parte DAVVERO: selectAction nell'app
// attiva. Tre contesti separati, un server finto che recapita.
const fs=require('fs'), vm=require('vm');
const server={};                       // il "Firebase": una copia sola condivisa
function apri(titolo, fazione){
  const h=fs.readFileSync(DIR+'app.html','utf8');
  const g={}; g.window=g; g.globalThis=g; g.console={log:()=>{},warn:()=>{},error:()=>{}};
  const el={}; const finto=(id)=>{if(!el[id])el[id]={id,innerHTML:'',style:{},appendChild:()=>{},addEventListener:()=>{},value:'',classList:{add:()=>{},remove:()=>{}},setAttribute:()=>{},getAttribute:()=>null,options:[],cloneNode(){return finto(id+'_c');},parentNode:{replaceChild:()=>{}},querySelector:()=>null};return el[id];};
  const locale={};                     // localStorage privato di questo dispositivo
  g.localStorage={getItem:k=>(k in locale?locale[k]:null),setItem:(k,v)=>locale[k]=v,removeItem:k=>delete locale[k]};
  g.location={search:'?fazione='+fazione,replace:()=>{},href:''};
  let t=titolo+' TACTICAL TERMINAL';
  g.document={get title(){return t;},set title(v){t=v;},documentElement:{setAttribute:()=>{}},scripts:[],getElementById:finto,createElement:()=>finto('n'),querySelector:()=>finto('q'),querySelectorAll:()=>[],addEventListener:()=>{},write:()=>{},readyState:'complete'};
  g.alert=()=>{}; ['scrollTo','addEventListener'].forEach(k=>g[k]=()=>{});
  let tick=null; g.setInterval=(fn)=>{tick=fn;return 0;}; g.setTimeout=(fn)=>{fn&&fn();return 0;};
  g.history={pushState:()=>{}}; g.navigator={}; g.prompt=()=>null; g.confirm=()=>true;
  // il trasporto: scrivere manda al server, e il ciclo del destinatario legge da li`
  g.firebase={initializeApp:()=>{},database:()=>({ref:(k)=>{
      const nome=String(k).split('/').pop();
      return { on:()=>{}, set:(v)=>{ server[nome]=(typeof v==='string')?v:JSON.stringify(v); }, remove:()=>{ delete server[nome]; } };
  }})};
  const ctx=vm.createContext(g);
  g.cloudPronto=Promise.resolve({confermato:true});
  [...h.matchAll(/<script(?:\s+src="([^"]+)")?\s*>([\s\S]*?)<\/script>/g)].forEach(m=>{
    const s=m[1];
    if(s){ if(/^https?:/.test(s))return; const f=DIR+s.split('?')[0]; if(!fs.existsSync(f)){ assenti.push(s); return; }
      try{vm.runInContext(fs.readFileSync(f,'utf8'),ctx,{filename:s});}catch(e){ nonCaricati.push(s+': '+e.message); } }
    else { try{vm.runInContext(m[2],ctx);}catch(e){ nonCaricati.push('script in linea: '+e.message); } }
  });
  // il recapito: prima di ogni giro del ciclo, il dispositivo riceve dal server
  return {g, el, locale, giro:()=>{ Object.keys(server).forEach(k=>locale[k]=server[k]); if(tick) tick(); }};
}
const att=apri('NOMADS','nomadi');
const reat=apri('PANOCEANIA','panoceania');
reat.g.isReactiveMode=true;

const alg=att.g.DB_NOMADI.find(u=>/^Alguacil \(Combi/.test(u.nome));
att.g.roster=[{...alg,id:'u1',alias:'Zero',states:{},combatGroup:1}];
att.g.spearheadUnit=att.g.roster[0];
att.g.selectedCoordinatedUnits=[];
att.g.currentOrder={};
att.g.gameState={nomads:att.g.roster,panoceania:[]};

console.log('--- l\'app attiva dichiara ---');
ok(!att.g.currentOrder.id, 'prima di scegliere non c\'e` nessun identificativo', att.g.currentOrder.id);
att.g.selectAction('MOVIMENTO', false);
const idGenerato = att.g.currentOrder.id;
ok(!!idGenerato, 'selectAction crea l\'identificativo dell\'Ordine', idGenerato);
ok(!!server['canale_comunicazione_infinity'], 'l\'allarme parte verso l\'Hub');
const allarme = server['canale_comunicazione_infinity'] ? JSON.parse(server['canale_comunicazione_infinity']) : {};
ok(allarme.ordineId === idGenerato, 'l\'allarme porta lo stesso identificativo', allarme.ordineId);

// l'Hub in mezzo
const hub=(function(){
  const h=fs.readFileSync(DIR+'calcolatore_hub.html','utf8');
  const g={}; g.window=g; g.globalThis=g; g.console={log:()=>{},warn:()=>{},error:()=>{}};
  const el={}; const finto=(id)=>{if(!el[id])el[id]={id,innerHTML:'',style:{display:'none'},appendChild:()=>{},addEventListener:()=>{},value:''};return el[id];};
  const locale={};
  g.localStorage={getItem:k=>(k in locale?locale[k]:null),setItem:(k,v)=>locale[k]=v,removeItem:k=>delete locale[k]};
  g.document={title:'HUB',getElementById:finto,createElement:()=>finto('n'),querySelector:()=>({style:{}}),querySelectorAll:()=>[],addEventListener:()=>{},scripts:[]};
  g.alert=()=>{}; g.addEventListener=()=>{}; g.history={pushState:()=>{}}; g.navigator={}; g.confirm=()=>true;
  let tick=null; g.setInterval=(fn)=>{tick=fn;return 0;}; g.setTimeout=(fn)=>{fn&&fn();return 0;};
  g.firebase={initializeApp:()=>{},database:()=>({ref:(k)=>{
      const nome=String(k).split('/').pop();
      return { on:()=>{}, set:(v)=>{ server[nome]=(typeof v==='string')?v:JSON.stringify(v); }, remove:()=>{ delete server[nome]; } };
  }})};
  const ctx=vm.createContext(g);
  g.cloudPronto=Promise.resolve({confermato:true}); g.riprovaCloud=()=>Promise.resolve({confermato:true});
  [...h.matchAll(/<script(?:\s+src="([^"]+)")?\s*>([\s\S]*?)<\/script>/g)].forEach(m=>{
    const s=m[1];
    if(s){ if(/^https?:/.test(s))return; const nome=s.split('?')[0]; if(nome==='calcolatore_cloud.js')return;
      const f=DIR+nome; if(!fs.existsSync(f)){ assenti.push(nome); return; }
      try{vm.runInContext(fs.readFileSync(f,'utf8'),ctx,{filename:nome});}catch(e){ nonCaricati.push(nome+': '+e.message); } }
    else { try{vm.runInContext(m[2],ctx);}catch(e){ nonCaricati.push('script in linea: '+e.message); } }
  });
  return {g, locale, giro:()=>{ Object.keys(server).forEach(k=>locale[k]=server[k]); if(tick) tick();
                                 Object.keys(locale).forEach(k=>{ server[k]=locale[k]; }); }};
})();
hub.g.hubPronto=true;
hub.giro();
console.log('\n--- l\'Hub in mezzo ---');
ok(!!server['canale_attacco_allarme'], 'l\'Hub inoltra l\'allarme al reattivo');

reat.giro();
console.log('\n--- l\'app reattiva riceve ---');
const ricevuto = (reat.g.currentAttackData||{}).ordineId;
ok(!!reat.g.currentAttackData, 'il reattivo riempie currentAttackData');
ok(ricevuto === idGenerato, 'l\'identificativo arriva intero fino al reattivo', ricevuto);

console.log('\n--- le due meta` dello stesso Ordine ---');
att.g.selectAction('ATTACCO BS', true);
ok(att.g.currentOrder.id === idGenerato, 'la seconda meta` conserva l\'identificativo', att.g.currentOrder.id);

console.log('\n--- un Ordine nuovo ---');
att.g.currentOrder = {};
att.g.selectAction('MOVIMENTO', false);
ok(!!att.g.currentOrder.id && att.g.currentOrder.id !== idGenerato,
   'un Ordine nuovo ne riceve uno diverso', att.g.currentOrder.id);

console.log('\n--- i file che le due pagine dichiarano ---');
// Un file che non carica, o che la pagina dichiara e non c'è, NON si salta in
// silenzio: il banco proverebbe metà app e direbbe di averla provata tutta.
// È la forma del catalogo sparito del 28 settembre, che a nominarlo fu
// test_caricamento_pagine.
ok(nonCaricati.length === 0,
   'tutti gli script delle due pagine si caricano',
   nonCaricati.length ? nonCaricati.slice(0, 3).join(' | ') : 'nessun errore');
ok(assenti.length === 0,
   'e nessun file dichiarato manca dalla cartella',
   assenti.length ? assenti.join(', ') : 'nessuno');

console.log('\n\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500');
console.log(passati + ' passati, ' + falliti + ' falliti');
process.exit(falliti ? 1 : 0);
