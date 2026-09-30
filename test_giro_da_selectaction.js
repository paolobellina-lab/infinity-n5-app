// @versione 2026-09-29.1 | test_giro_da_selectaction.js | proprieta`: chat TEST
// ================================================================
// Il giro completo che parte da SELECTACTION: l'identificativo dell'Ordine
// non è scritto a mano, lo crea il router quando il giocatore sceglie.
// Banco della chat INTERFACCIA, 29 settembre; qui è passato al formato
// comune — asserzioni invece di stampe, intestazione e riepilogo — perché
// nella forma originale i due banchi di controllo lo segnalavano come muto,
// ed era giusto: un file che stampa e non asserisce non può diventare rosso.
//
// PERCHÉ QUESTO TRATTO CONTA: i ritardatari dell'ARO sono legati all'Ordine,
// e tornano a dichiarare solo se la seconda metà porta lo stesso
// identificativo. Con l'identificativo scritto a mano le due metà lo
// condividono per costruzione, e quel caso non si vede mai — è il difetto
// che era stato temuto e che poi c'era davvero: il campo che si leggeva non
// lo scriveva nessuno.
// Il compagno di questo banco è test_giro_ritorno.js, che copre il RITORNO:
// insieme fanno il giro intero, e nessuno dei due da solo lo copre.
// ================================================================
let passati = 0, falliti = 0;
const ok = (c, m) => { if (c) { passati++; console.log('  ✅ ' + m); } else { falliti++; console.log('  ❌ ' + m); } };

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
//  USO:  node test_giro_da_selectaction.js
// ============================================================================

// Il giro completo partendo da dove parte DAVVERO: selectAction nell'app
// attiva. Tre contesti separati, un server finto che recapita.
const fs=require('fs'), vm=require('vm');
const server={};                       // il "Firebase": una copia sola condivisa
function apri(titolo, fazione){
  const h=fs.readFileSync('/mnt/project/app.html','utf8');
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
    if(s){ if(/^https?:/.test(s))return; const f='/mnt/project/'+s.split('?')[0]; if(!fs.existsSync(f))return;
      try{vm.runInContext(fs.readFileSync(f,'utf8'),ctx,{filename:s});}catch(e){} }
    else { try{vm.runInContext(m[2],ctx);}catch(e){} }
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

console.log('\n=== Il giro, dall azione scelta al reattivo ===');
ok(att.g.currentOrder.id === undefined || att.g.currentOrder.id === null,
   `prima di scegliere non c è nessun identificativo (${att.g.currentOrder.id})`);
att.g.selectAction('MOVIMENTO', false);
ok(!!att.g.currentOrder.id, `dopo selectAction il router ne crea uno: ${att.g.currentOrder.id}`);
ok(!!server['canale_comunicazione_infinity'], 'e l allarme è sul server');
if (server['canale_comunicazione_infinity']) {
  const a=JSON.parse(server['canale_comunicazione_infinity']);
  ok(a.ordineId === att.g.currentOrder.id, `l allarme porta quell identificativo, non un altro: ${a.ordineId}`);
}

// l'Hub in mezzo
const hub=(function(){
  const h=fs.readFileSync('/mnt/project/calcolatore_hub.html','utf8');
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
      const f='/mnt/project/'+nome; if(!fs.existsSync(f))return; try{vm.runInContext(fs.readFileSync(f,'utf8'),ctx,{filename:nome});}catch(e){} }
    else { try{vm.runInContext(m[2],ctx);}catch(e){} }
  });
  return {g, locale, giro:()=>{ Object.keys(server).forEach(k=>locale[k]=server[k]); if(tick) tick();
                                 Object.keys(locale).forEach(k=>{ server[k]=locale[k]; }); }};
})();
hub.g.hubPronto=true;
hub.giro();
ok(!!server['canale_attacco_allarme'] || !!(reat.g.currentAttackData), 'l Hub lo inoltra');
reat.giro();
ok(!!(reat.g.currentAttackData), 'il reattivo lo riceve e lo consuma');
ok((reat.g.currentAttackData || {}).ordineId === att.g.currentOrder.id,
   `e l identificativo è lo stesso che il router aveva generato (${(reat.g.currentAttackData || {}).ordineId})`);
const primo = att.g.currentOrder.id;
// seconda meta` dello stesso Ordine
att.g.selectAction('ATTACCO BS', true);
ok(att.g.currentOrder.id === primo,
   `la seconda metà dello stesso Ordine lo conserva (${att.g.currentOrder.id})`);
// Controprova: un Ordine NUOVO deve averne uno diverso, altrimenti "lo
// conserva" non si distinguerebbe da "è sempre lo stesso per tutti".
att.g.currentOrder = { unit: att.g.currentOrder.unit };
att.g.selectAction('ATTACCO BS', false);
ok(att.g.currentOrder.id && att.g.currentOrder.id !== primo,
   `e un Ordine nuovo ne ha uno diverso (${att.g.currentOrder.id})`);

console.log(`\n──────────────\n${passati} passati, ${falliti} falliti\n`);
process.exit(falliti ? 1 : 0);
