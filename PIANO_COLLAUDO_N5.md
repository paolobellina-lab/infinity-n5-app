<!-- @versione 2026-09-30.1 | PIANO_COLLAUDO_N5.md | proprieta`: chat TEST -->

# Piano di collaudo — Calcolatore Infinity N5 (revisione 7)

Sostituisce la revisione 6 del 29 settembre.

# 0. Quello che è cambiato dalla revisione 6

**Tre difetti trovati al tavolo sono aperti**, e tre prove di questo piano oggi
non arrivano in fondo: l'anello della scelta dell'arma (BS-06), il Burst della
Soppressione in reazione (BS-12), e gli ordini senza tiro che non avvisano
l'avversario (A-13). Stanno tutti nel blocco V, con la riga di regolamento.

**Cinque prove avevano il bersaglio sbagliato**, e sono corrette: BS-22 usava il
Morlock, che è Nomade come l'attaccante; BS-23 lo Zondnautica-A, idem; BS-16
chiedeva al Fusiliere un (+1B) che nessuno dei suoi dieci profili ha. A-11 diceva
che la Soppressione va a pochi: la portano **462 profili su 765**, e per provare
il filtro serve chi NON ce l'ha.

**A-07, A-10, A-20 e A-21 erano troppo corte** per essere eseguite da chi non le
ha scritte: ora dicono cosa preparare e cosa guardare.

**Un blocco nuovo, ORD**: le tre voci che non tirano e hanno una domanda davanti
— piazzare equipaggiamento, Cybermask, rientrare in Camuffato. Le ultime due sono
da costruire.

**I numeri delle truppe vengono dal JSON ufficiale**: 765 profili. Se una prova dà
un numero diverso da quello scritto qui, guarda prima la scheda ufficiale — il
piano invecchia insieme ai dati.

Le prove si eseguono **dall'app**. Tutto ciò che si poteva verificare col motore è
verde: 71 file di test, 2596 prove, banco di confronto a zero divergenze.
I valori attesi sono calcolati con `motore_regole_n5.js` 2026-09-29.2 sui profili
veri. Le regole citate rimandano a `REGOLE_N5_v5_1_1.txt`, con `grep -n`.

## Come leggere una prova

```
CODICE — titolo
  Attivo:    unità (stato) · 1ª metà → 2ª metà
  Con:       arma / programma
  Bersaglio: unità (stato) @ banda, copertura sì/no
  ARO:       unità (stato) → azione, arma, banda, contro chi
  Atteso:    quello che devi leggere
```

Senza ARO il reattivo dichiara **Nessun ARO** e il confronto deve uscire
**TIRO NORMALE**. Le bande si contano dal Weapon Chart, otto pollici l'una:
banda 0 = 0-8", banda 1 = 8-16", banda 2 = 16-24", e così via.

---

# 1. Preparazione

## 1.1 Roster

**Nomadi** — Sessione A i primi dieci, Sessione B gli altri. Nessuna prova
salta fra le due.

| # | Profilo | Serve per |
|---|---|---|
| 1 | Alguacil (Combi Rifle) | BS base, gittate, contratto |
| 2 | Alguacil (HMG) | bande negative, Burst 4, Coordinato |
| 3 | Alguacil (Missile Launcher) | Sagoma a Impatto, EXP, **Guidato** |
| 4 | Alguacil (Forward Observer) | Flash Pulse, Stato Bersagliato |
| 5 | Alguacil (Paramedic) | MediKit |
| 6 | Daktari (Doctor) | Dottore |
| 7 | Clockmaker (Engineer) | Ingegnere, GizmoKit(+1B) |
| 8 | Interventor (Hacker Plus) | Carbonite, Oblivion, Spotlight, Total Control |
| 9 | Zero (Hacker, Killer Hacking Device) | Trinity, Camo, mine |
| 10 | Intruder (X Visor) | MSV L2 + X Visor, Surprise Attack |
| 11 | Grenzer (Marksmanship) | Marksmanship |
| 12 | Grenzer (Forward Observer, Sensor, NCO) | MSV L1, **le tre osservazioni** |
| 13 | Morlock (Assault Pistol) | Martial Arts L2, Chain Rifle, **No Cover** |
| 14 | Chimera | Natural Born Warrior, CC Attack (-3) |
| 15 | Reaktion Zond (HMG) | Total Reaction, REM |
| 16 | Mobile Brigada (HMG) | HI, ARM 5 |
| 17 | Puppetbot (Minelayer) | BS Attack (+1B), Dodge (+3), **Minelayer** |
| 18 | Zondmate (REM) | PARA CC Weapon |
| 19 | **Moran (Surprise Attack, Camouflage)** | **CrazyKoalas, D-Charges** |
| 20 | **Sin-Eater (MULTI Sniper Rifle)** | **Neurocinetics** |
| 21 | **Mary Problems (Hacker)** | Pitcher, Zapper, upgrade hacking |

**PanOceania**

| # | Profilo | Serve per |
|---|---|---|
| 1 | Fusilier (Combi Rifle) | bersaglio di riferimento (ARM 1, BTS 0, PH 10) |
| 2 | Fusilier (Missile Launcher) | ARO con arma pesante |
| 3 | Fusilier (Forward Observer) | Flash Pulse in ARO, Repeater |
| 4 | Orc (Hacker, Hacking Device) | hackerabile, ARM 4 / BTS 3 |
| 5 | Nisse (Heavy Machine Gun) | Mimetismo -3 + MSV L2 |
| 6 | Croc Man (MULTI Sniper Rifle) | TO Camo, Mimetismo -6, **Hidden Deployment** |
| 7 | Teutonic Knight (TinBot: Firewall) | Firewall -3, Martial Arts L2 |
| 8 | Tikbalang | TAG, **ECM (Guided -6)**, Heavy Flamethrower |
| 9 | Sierra Dronbot (Heavy Machine Gun) | Total Reaction in ARO |
| 10 | Zulu-Cobra (Triangulated Fire, Sensor) | Camo, **Triangulated Fire** |
| 11 | Aquila | MSV L3, ARM 6 |
| 12 | **Squalo Mk-II (MULTI Marksman Rifle)** | **Combat Instinct**, TAG |
| 13 | **Kulak** | **Disco Baller** → Disco Ball |
| 14 | Machinist | Ingegnere lato Pano |

## 1.2 Terreni

In schieramento: **TER_10 Bosco**, **TER_11 Giungla**, **TER_13 Foresta
Primordiale**, **TER_17 Sala Generatori**. Senza, il menu terreni resta su
"Nessun Terreno Speciale" e il blocco R non è eseguibile.

---

# 2. Preflight — una volta, in console, su app.html

| # | Comando | Atteso |
|---|---|---|
| PRE-01 | `MotoreN5.autotest()` | `["contratto coerente"]` |
| PRE-02 | `verificaRouter()` | `["router coerente col motore"]`. Qualunque "modulo NON CARICATO" significa uno `<script>` mancante in `app.html` |
| PRE-03 | `MotoreN5.verificaDati()` | `{ok:true, mancanti:[], firme:[]}` |
| PRE-04 | `MotoreN5.verificaVersioni()` | nessun disallineamento |
| PRE-05 | `MotoreN5.datiMancanti()` | array vuoto |
| PRE-06 | `riepilogaOrdiniNascosti()` | l'elenco degli ordini che il filtro nasconde, col motivo. Atteso oggi: vuoto o quasi |
| PRE-07 | `MotoreN5.improntaProgetto()` | annotala: serve per citare i file alle altre chat |
| PRE-08 | ricarica e guarda la console | nessun `⛔`, nessun `modulo mancante` |
| PRE-09 | guarda se ci sono errori sulle immagini | la cartella `img/` deve stare accanto ad `app.html`: senza, mancano i ritratti e le icone di stato, e il blocco M si legge male |

Se PRE-01 o PRE-02 falliscono, fermati.

---

# 3. Blocco A — Ordini senza tiro e generazione ARO

**A-01 — Movimento semplice**
- Alguacil (Combi Rifle), Normale · MUOVERE → MUOVERE
- Atteso: nessun calcolo, ordine intero consumato, **ARO generato**.

**A-02 — Movimento + attacco**
- MUOVERE → ATTACCO BS · Atteso: la prima metà non chiede nulla, il calcolo parte sulla seconda.

**A-03 — Cauto: la domanda viene prima** *(risolto, da confermare)*
- MOVIMENTO CAUTO
- Atteso: **prima di rispondere non parte niente** — nessun allarme all'avversario e nessuna busta all'Hub — e a schermo ci sono due pulsanti, "fuori da LoF e ZdC" e "dentro".
- Rispondendo **dentro**: allarme spedito, ARO generato, una busta sola.
- Nella revisione 3 l'allarme partiva sempre come "dentro" e l'interruttore compariva dopo, quando non cambiava più nulla.

**A-04 — Cauto fuori da LoF e ZdC**
- Stesso, rispondendo **fuori** · Atteso: **nessun allarme**, con il motivo completo; la busta all'Hub parte lo stesso, perché l'ordine è finito.
- E ogni nuovo ordine riparte senza risposta: il secondo Cauto non eredita quella del primo.

**A-05 — Cauto negato**
- Reaktion Zond, Zondmate, e un Alguacil **Bersagliato** · Atteso: il bottone non compare per REM, TAG, VH, AI Motorcycle e Bersagliati.

**A-06 — Idle** *(risolto, confermato in Node)*
- Alguacil · IDLE
- Atteso: nessuna azione, ma **ARO generato** — regolamento p.80, "its declaration just activates the Trooper, potentially generating AROs". Nella revisione 1 il catalogo diceva il contrario, ed era l'unica azione di movimento a non generarne.

**A-07 — Requisito non soddisfatto → Idle**
Non è una prova sui requisiti: è sulle **tre cose che devono succedere insieme**
quando un requisito fallisce.
- Prendi un **Moran (Surprise Attack, Camouflage)**, che porta i CrazyKoalas, e
  mettilo in copertura come segnalino mimetico. Dichiara **PIAZZARE
  EQUIPAGGIAMENTO** e rispondi **sì** alla domanda "c'è un nemico nell'Area
  d'Innesco?": il requisito non è soddisfatto.
- Atteso, tutte e tre: l'azione diventa **Idle**; l'**ARO viene generato lo
  stesso**; l'**uso del CrazyKoala è speso** e non torna indietro; e il Moran
  **si rivela**, col modello messo dov'era il segnalino.
- Le ultime due sono quelle che si dimenticano, e al tavolo costano un ordine,
  un uso e la copertura tutti insieme.

**A-08 — Salto e scalata**
- Morlock · SALTO · Atteso: nessun calcolo, ARO generato, **ordine intero** consumato.

**A-09 — Climbing Plus** *(risolto, da confermare)*
- Mary Problems (Climbing Plus) che arrampica, e un Alguacil che fa lo stesso
- Atteso: con la skill l'arrampicata è **mezzo ordine** e resta la seconda metà per un'altra Abilità Breve; senza, ordine intero. La funzione del motore rispondeva giusto da giorni, ma il modulo chiedeva il tipo a chi non conosce l'unità.

**A-10 — Ordini senza modulo**
È una prova che deve dare **zero risultati**: si apre il menu di una truppa e si
prova ogni voce, una per una.
- Atteso: ogni voce apre una schermata. Se una dà **"Azione non riconosciuta"**,
  manca lo `<script>` di quel modulo in `app.html`.
- È il controllo inverso di quello che ha trovato ARRAMPICARSI e SOPPRESSIONE
  mancanti dal menu: quello cercava azioni senza voce, questo voci senza modulo.
- Utile anche `verificaRouter()` in console, che risponde su tutte insieme.

**A-11 — Requisiti di menu**
Attenzione: qui si prova che una voce **manchi** dove deve mancare. Vederla quasi
sempre non è un difetto.
- **SOPPRESSIONE**: ce l'hanno **462 profili su 765**, perché Combi Rifle, Rifle,
  HMG, Spitfire e Red Fury portano tutti il Tratto Suppressive Fire. Per provare
  il filtro serve una truppa **senza**: **Grenzer (Missile Launcher)**,
  **Grenzer (MULTI Sniper Rifle)**, **Hellcat (Boarding Shotgun)** — lì la voce
  NON deve comparire. Attenzione al profilo e non alla truppa: il **Morlock
  (Combi Rifle) la ha**, il Morlock (Assault Pistol) no.
- **HACKING** solo a chi ha Hacker o un dispositivo. Con **due** dispositivi i
  programmi si sommano: **Mary Problems** vede Trinity, Carbonite, Oblivion,
  Spotlight e Total Control.
- **SUPPORTO** deve comparire su **Daktari (Doctor)**, **Alguacil (Paramedic)**,
  **Hellcat (Paramedic)** e su chi porta un GizmoKit (i **Clockmaker**). NON su
  un Alguacil (Combi Rifle) qualunque.
- **PIAZZARE EQUIPAGGIAMENTO**: 116 profili. Sì su **Moran (Surprise Attack,
  Camouflage)** coi CrazyKoalas, **Spektr (Minelayer)** con E/M Mine e Shock
  Mine, **Heckler (Hacker, Killer Hacking Device)**. NO su un Fusiliere.

**A-12 — Io muovo, tu mi spari** *(era il difetto che bloccava)*
- Attivo: Alguacil (Combi Rifle) · MUOVERE → MUOVERE
- ARO: Fusilier (Combi Rifle) → ATTACCO BS, Combi Rifle, banda 1, contro l'Alguacil
- Atteso: **TIRO NORMALE**, un solo scontro. Il Fusiliere tira **15** con **un dado**, l'Alguacil non oppone niente e fa il Tiro Salvezza **ARM VS 8** se colpito.
- Sul tabellone il Fusiliere deve comparire sotto **PanOceania**, non sotto la fazione attiva: lo scontro è marcato come reazione non bersagliata.
- Nella revisione 3 usciva "NESSUN TIRO DI DADO DA EFFETTUARE".

**A-13 — Lo stesso con gli altri ordini senza tiro** **[DIFETTO APERTO]**
- Ripeti A-12 con CAUTO (rispondendo "dentro"), SALTO, IDLE e PIAZZARE
  EQUIPAGGIAMENTO
- Atteso: in tutti, l'avversario riceve l'allarme e il tiro del reattivo compare.
- **Oggi NON funziona con PIAZZARE EQUIPAGGIAMENTO e con IDLE**: l'ordine passa
  diritto al calcolo senza generare l'ARO (trovato da Paolo il 30 settembre). Il
  motore dice che quelle azioni l'ARO lo generano — `generaAro` risponde sì per
  entrambe — ma i due moduli non chiamano mai `inviaAllarmeAro`.
- È il caso più comune della partita, e vale per ogni ordine che non tira.

---

# 4. Blocco B — Attacco BS

**BS-01 — Gittata positiva, Faccia a Faccia**
- Alguacil (Combi Rifle) · Combi Rifle · Fusilier @ banda 0, senza copertura
- ARO: Fusilier → ATTACCO BS, Combi Rifle, banda 0, contro l'Alguacil
- Atteso: **un solo scontro**, FACCIA A FACCIA. Attivo BS 11 +3 = **14** B3. Reattivo BS 12 +3 = **15** B1. Salvezza Fusilier ARM **VS 8** ×1; salvezza Alguacil ARM **VS 8** ×1.
- Se ne compaiono **due**, ognuno con un Tiro Normale, è tornato il difetto del contratto: i bersagli si cercavano con `name` mentre il payload li scrive con `nome`, e la reazione non si accoppiava più con l'attacco.

**BS-02 — Reazione contro un altro**
- Come BS-01 ma l'ARO bersaglia un'altra unità · Atteso: **TIRO NORMALE**, "La reazione non è diretta contro l'attaccante." Stessi numeri.

**BS-03 — Gittata negativa e copertura, contro Schivata**
- Combi @ banda 2, bersaglio **in copertura** · ARO: SCHIVATA
- Atteso: F2F. Attivo 11 −3 −3 = **5** B3. Reattivo PH **10** B1. Salvezza Fusilier ARM **VS 11**.

**BS-04 — Mimetismo senza visore**
- Combi @ banda 1 vs Zulu-Cobra (Mim −3), nessun ARO · Atteso: **11**.

**BS-05 — MSV L1**
- Grenzer (FO, Sensor) · Combi @ banda 1 vs Zulu-Cobra · Atteso: **16**, con la nota sul visore.

**BS-06 — Mimetismo −6 e copertura** **[DIFETTO APERTO: anello]**
- Alguacil · Combi @ banda 1 vs **Croc Man (MULTI Sniper Rifle)**, PanOceania,
  **in copertura** · Atteso: **5**, salvezza ARM **VS 11**. I numeri sono giusti,
  verificati sul motore.
- **Oggi la prova non arriva in fondo**: dopo la scelta dell'arma l'app torna a
  chiedere l'arma, in anello (trovato da Paolo il 30 settembre). Ha la stessa
  firma dell'anello dell'hacking chiuso il 29: la seconda metà non ritrova
  l'arma della prima. Segnalando, indica **quale arma** avevi scelto — se aveva
  una parentesi o una modalità, è quasi certamente lo stesso punto.

**BS-07 — MSV L2 annulla il −6**
- Intruder · HMG @ banda 2 vs Croc Man in copertura · Atteso: 13 +3 −3 = **13** B4.

**BS-08 — X-Visor su banda negativa**
- Intruder (X Visor) · MULTI Sniper AP @ **banda 0 (−3)** · Atteso: gittata **0**, totale **13**. Se leggi 10 l'X-Visor non si applica.

**BS-09 — X-Visor non crea bonus**
- Stesso @ banda 6 (−3) · Atteso: gittata **0**, mai +3.

**BS-10 — Marksmanship ignora la copertura**
- Grenzer (Marksmanship) · MULTI Sniper AP @ banda 3 vs Fusilier **in copertura**
- Atteso: **16**, con la nota. Ma la salvezza resta **VS 9**: la copertura vale sull'ARM anche quando non vale sul tiro.

**BS-11 — Stato Bersagliato**
- Combi @ banda 0 vs Fusilier **Bersagliato** · Atteso: **17**.

**BS-12 — Bersaglio in Soppressione entro 24"**
- Combi @ banda 0 vs Fusilier **in Soppressione** · ARO: ATTACCO BS in SF Mode
- Atteso: attivo **11** (−3 Soppressione). Reattivo col profilo **Combi Rifle
  (SF Mode)**: Burst **3**, bande 0/0/−3, gittata massima 24", avviso **A98**.
- **Il Burst 3 è la parte che conta**, ed è regola scritta (riga 14649): *"Suppressive
  Fire allows the affected Trooper to react in ARO with the full B3 value of the
  SF Mode"*. Se vedi **Burst 1**, è un difetto — ed è quello che oggi succede
  **quando l'attivo spara**: misurato, con un attacco attivo il reattivo in
  Soppressione scende a 1, senza attacco resta 3. La regola generale dell'ARO
  sta scavalcando la Soppressione, come faceva con Neurocinetics.
- Il Burst pieno va tutto su **un solo** bersaglio: non si divide.

**BS-13 — Soppressione oltre le 24"** · @ banda 3 · Atteso: il −3 **non** si applica.

**BS-14 — Attaccante Stordito** · Atteso: ATTACCO BS **non compare** nel menu.

**BS-15 — Total Reaction** · Sierra Dronbot in ARO · Atteso: **Burst 3**, con la voce.

**BS-16 — ARO normale e il (+1B) che non vale in reazione**
- Per il Burst 1 in ARO va bene qualunque **Fusilier**: Atteso **Burst 1**.
- Ma il Fusiliere **non ha** il (+1B) — nessuno dei suoi dieci profili — quindi
  per vedere la nota serve un profilo che ce l'abbia davvero: **Puppetbot (Red
  Fury)** o un altro dei 25 con *BS Attack (+1B)*. Atteso: in attivo il Burst
  sale, **in ARO no**, con la nota che lo dice.

**BS-17 — BS Attack (+1B) solo in attivo**
- Puppetbot · Red Fury @ banda 1 · Atteso: **Burst 5**, tiro **15**. Lo stesso Puppetbot in ARO: Burst **1**.

**BS-18 — Burst su due bersagli**
- Alguacil (HMG) @ banda 2, 2 dadi al Fusilier e 2 all'Orc · Atteso: due scontri, somma 4. Salvezze: Fusilier ARM **VS 6**, Orc ARM **VS 9**.

**BS-19 — ARM alto**
- Mobile Brigada (HMG) @ banda 0 vs Orc, ARO HMG · Atteso: attivo **10** B4, reattivo **11** B1, salvezza Orc **VS 9**, salvezza Brigada **VS 10**.

**BS-20 — Tiro dentro una mischia**
- Spari a un bersaglio che è **ingaggiato in mischia** con un'altra truppa:
  rischi di colpire chi non volevi.
- Atteso: fra i modificatori compare la voce **−6**.

**BS-21 — Limite dei MOD**
- Accumula modificatori negativi finché la somma supera −12: fuori gittata,
  bersaglio mimetico, in copertura, tiro dentro una mischia.
- Atteso: compare la voce **"MOD minimo −12"** — oltre non si va — e se il
  Valore di Successo finisce a **zero o sotto**, l'app deve dire **fallimento
  automatico**, non mostrare 1. Un 1 sullo schermo si tira; un fallimento
  automatico no, ed è la differenza fra sprecare un dado e sprecare un Ordine.

**BS-22 — No Cover** *(risolto, da confermare)*
- Alguacil · Combi @ banda 0 vs **Dr. Harper FTO** (PanOceania) **"in copertura"**
- Atteso: niente −3 all'attaccante e niente +3 all'ARM → tiro **14**, salvezza
  **VS 8**. Nella revisione 2 erano 11 e VS 11: sei punti regalati al bersaglio.
- La revisione 6 usava il **Morlock**, che è dei Nomadi come l'Alguacil: due
  truppe della stessa fazione non si sparano. Il Dr. Harper ha No Cover e non ha
  Mimetismo, quindi i due MOD non si confondono.

**BS-23 — Limited Cover** *(risolto, da confermare)*
- Alguacil · Combi @ banda 0 vs **Teutonic Knight (Light Shotgun, Panzerfaust)**
  (PanOceania) in copertura
- Atteso: cade **solo** il −3 all'attaccante, il +3 all'ARM resta (p.98) → tiro
  **14**, salvezza **VS 13**. Nell'elenco MOD non deve comparire la copertura;
  nel Tiro Salvezza sì.
- La revisione 6 indicava Zondnautica-A, che è **dei Nomadi**: dei 26 profili con
  Limited Cover, 14 sono PanOceania, e il Teutonic Knight è il più semplice
  perché non ha Mimetismo.
- **Prima di cominciare, controlla che il bersaglio sia davvero schierato**: una
  prova contro un'unità che non è sul tavolo non misura niente.

**BS-24 — Combat Instinct** *(risolto, da confermare)*
- Intruder **in Camo** attacca · ARO: **Squalo Mk-II** → ATTACCO BS
- Atteso: lo Squalo **non** prende il −3 di Attacco a Sorpresa (p.88); il −3 di Mimetismo resta. Nell'elenco del reattivo devono comparire gittata e mimetismo, e nient'altro.

**BS-25 — Neurocinetics** *(risolto, da confermare)*
- Sin-Eater in ARO contro un singolo bersaglio
- Atteso (p.102): Burst **1 in attivo** e **Burst pieno in reazione** — **3** col Mk12, **2** col MULTI Sniper, **4** con l'HMG. Controprova: un Alguacil con la stessa HMG resta a **1**.
- La radice era il contenitore: "MULTI Sniper Rifle" non ha Burst proprio, e `null` diventava 1. Se in ARO vedi 1 col Mk12, è tornata.

---

# 5. Blocco C — Munizioni e Tiri Salvezza

Valore di Successo = ARM o BTS (dimezzato se AP, +3 se copertura) + PS
dell'arma; si tira 1d20 e serve **uguale o meno**. Bersagli: **Fusilier**
(ARM 1, BTS 0, PH 10) e **Orc** (ARM 4, BTS 3, PH 14).

| # | Arma / munizione | vs Fusilier | vs Orc | Da controllare oltre al numero |
|---|---|---|---|---|
| MU-01 | Combi Rifle (N) | ARM VS 8 ×1 | ARM VS 11 ×1 | Critico = 1 salvezza extra |
| MU-02 | AP Submachine Gun (AP) | ARM VS 8 ×1 | **ARM VS 9** ×1 | l'ARM dell'Orc dimezzato |
| MU-03 | Missile Launcher (Blast) (EXP) | ARM VS 7 ×**3** | ARM VS 10 ×3 | tutte e 3 obbligatorie |
| MU-04 | Missile Launcher (Hit) (AP+EXP) | ARM VS 7 ×3 | **ARM VS 8** ×3 | dimezza **e** 3 tiri |
| MU-05 | Red Fury (SHOCK) | ARM VS 8 ×1 | ARM VS 11 ×1 | VITA 1 + Incosciente → **Morto**; annulla Dogged/NWI |
| MU-06 | DA CC Weapon (DA) | ARM VS 9 ×**2** | ARM VS 12 ×2 | entrambe obbligatorie |
| MU-07 | T2 Boarding Shotgun (T2) | ARM VS 7 ×1 | ARM VS 10 ×1 | ogni fallimento = **2 Ferite** |
| MU-08 | E/Mitter (E/M) | BTS VS 7 ×2 | **BTS VS 9** ×2 | BTS dimezzato, fallimento = Isolato |
| MU-09 | PARA CC Weapon (PARA) | **PH VS 4** ×1 | PH VS 8 ×1 | è PH−6, non ARM/BTS. Nessuna Ferita, IMM-A |
| MU-10 | Adhesive Launcher Rifle | PH VS 4 ×1 | PH VS 8 ×1 | come sopra, ma con gittate |
| MU-11 | Flash Pulse (STUN) | **BTS VS 7** ×1 | BTS VS 10 ×1 | l'attributo BTS viene dall'arma |
| MU-12 | Nanopulser | BTS VS 7 ×1 | BTS VS 10 ×1 | l'arma sovrascrive la munizione |
| MU-13 | Smoke Grenades | nessuna | nessuna | "azione non offensiva" |
| MU-14 | Panzerfaust (AP+EXP) | ARM VS 7 ×3 | ARM VS 8 ×3 | Disposable (2): l'uso va scalato |

**MU-15 — Copertura sulla salvezza** · Combi vs Fusilier in copertura → **VS 11**.

**MU-16 — Guidato e Speculativo ignorano la copertura** · stesso colpo come Speculativo → **VS 8**.

**MU-17 — Munizioni N3** · VIRAL, BREAKER, K1, PLASMA, NANOTECH, ADHESIVE, FLASH, MONOFILAMENT, BIOWEAPON → avviso **A50** con l'equivalente N5, e il calcolo non si ferma.

**MU-18 — Munizione sconosciuta** · avvisi **A51** e **A52**, nessun numero inventato.

**MU-19 — Tiro Salvezza Combinato** · ARM+BTS → due salvezze con attributi diversi, descritte come tali.

**MU-20 — Contenitore di modalità** · MULTI Rifle o Missile Launcher senza modalità scelta → avviso **A51b**, nessun calcolo a caso.

**MU-21 — Kobra Pistol** · BS Mode **SHOCK**, CC Mode **DA con 2 salvezze** e Anti-materiel.

**MU-22 — BioWeapon condizionale** *(nuovo)*
- **Viral Rifle** contro **Fusilier (VITA 1)**: BTS **VS 7 ×2**, con la nota "Bersaglio con VITA: si applica la combinazione DA+Shock" e l'effetto Shock.
- Lo stesso contro un **Gecko (STR)**: BTS **VS 13 ×1**, nota "Bersaglio senza VITA: il BioWeapon non lo potenzia".
- Se passa un solo caso dei due, la condizione non è implementata. Sono sette armi: Rifle, Combi, Marksman, Sniper, Pistol, CC Weapon, Mine.

**MU-23 — ARM = 0** *(chiarito)*
- **ARM=0 non vuol dire "nessun Tiro Salvezza"**: il tiro c'è, e vale solo il PS dell'arma. Vive in `salvAttr`, non fra i Tratti condizionali: cinque armi lo portano — K1 Combi, K1 Marksman, K1 Sniper, Monofilament CC Weapon, Monofilament Mine.
- K1 Combi Rifle contro ARM 3 → **ARM VS 7**; un Combi normale contro lo stesso bersaglio → VS 10.
- **Target (Attribute)** esiste solo nelle Pheroware Tohaa e **BTS = 0** su nessuna arma delle due fazioni: non sono lacune, sono fuori dalle nostre liste.

---

# 6. Blocco D — Sagome

**TPL-01 — Sagoma Diretta: colpo automatico**
- Morlock · **Chain Rifle** vs Fusilier · ARO: SCHIVATA
- Atteso: **TIRO NORMALE**, attivo **"Auto"** senza Valore di Successo, reattivo PH **10**, salvezza Fusilier ARM **VS 8**. E la nota: chi è colpito da una Sagoma **non prende il +3 di copertura**.

**TPL-02 — Continuous Damage** · Light Flamethrower vs Orc · Atteso: colpo automatico, ARM **VS 11**, e la nota che le salvezze si ripetono fino a una riuscita.

**TPL-03 — Sagoma che colpisce il BTS** · Pulzar vs Orc · Atteso: **BTS VS 10**.

**TPL-04 — Sagoma a Impatto: il tiro serve**
- Alguacil (Missile Launcher) · **Blast Mode** @ banda 3 vs Orc · ARO: ATTACCO BS
- Atteso: **F2F**, attivo 11 +3 = **14** B1 — *non* "Auto". Salvezza Orc ARM **VS 10 ×3**.

**TPL-05 — Schivata senza LoF contro Sagoma** · Atteso: **nessun −3**, con la nota.

**TPL-06 — Critico** · Atteso: vale come Critico **solo sul Bersaglio Principale**; sui secondari è un successo normale.

**TPL-07 — Bersagli secondari** *(risolto, da confermare)*
- Grenzer · Light Flamethrower (B1) su **due** nemici sotto l'area
- Atteso: ammesso. Due scontri, uno per bersaglio, entrambi **colpo automatico**, ognuno col proprio Tiro Salvezza — 8 al Fusiliere, 11 all'Orc.
- Controprove: due dadi su **un** bersaglio con la stessa Sagoma danno ancora **E21** (il conteggio non è sparito, ha cambiato criterio); e un Panzerfaust, B1 e non a Sagoma, su due bersagli dà **E21**, perché la raffica si divide.
- Sagoma a **Impatto** su due bersagli: lo stesso tiro in entrambi gli scontri. Al tavolo si tira una volta sola.

**TPL-08 — Alleati sotto la sagoma** **[NON CHIESTO]**
- `regoleTemplate` prevede `colpoAnnullatoSeAlleatiInArea`, ma l'app non chiede nulla. Verifica se la domanda compare: oggi no.

---

# 7. Blocco E — Attacco Intuitivo

**INT-01 — Contro un Marker**
- Zondnautica-A o Morlock · **Chain Rifle** · ATTACCO INTUITIVO vs Croc Man in Camo · ARO: SCHIVATA
- Atteso: **F2F**. Attivo **WIP nudo**, Burst **1**, con la nota "nessun MOD si applica, da nessuna fonte" — nell'elenco MOD non deve comparire niente. Reattivo: Schivata PH 12.

**INT-02 — Bersaglio visibile** · Atteso: **E15** con il motivo, invio bloccato.

**INT-03 — Burst forzato** · 2 dadi → avviso **A20**.

**INT-04 — Quali armi lo aprono** *(cambiato)*
- Zero (Boarding Shotgun) con Shock Mine e PARA Mine, Mary Problems con Zapper, Heckler con Cybermine
- Atteso: l'ordine **compare**, perché il filtro ora passa da `M.armiIntuitive` e non dai nomi. Nella revisione 1 era un bug: verifica che sia chiuso.

---

# 8. Blocco F — Fuoco Speculativo

**SPEC-01 — Il −6 e il cambio di attributo**
- Intruder · **Grenades** @ banda 0 vs Fusilier in copertura
- Atteso: si tira su **PH** ("Grenades: Tratto BS Weapon (PH)"), PH 12 +3 −6 = **9**, B1. La copertura **non** compare fra i MOD.

**SPEC-02 — Bersaglio Bersagliato** · il −6 salta → **18**.

**SPEC-03 — Burst 1** · avviso A20.

**SPEC-04 — Armi ammesse** *(cambiato)*
- Atteso: Alguacil (Missile Launcher) **non** ottiene più l'ordine (il Missile Launcher non ha il Tratto), mentre Mary Problems col **Pitcher** sì. Nella revisione 1 era l'opposto.

**SPEC-05 — Tratti dedotti** · avviso **A80** o **A49** dove la provenienza non è la scheda.

---

# 9. Blocco G — Attacco Guidato *(ora eseguibile)*

**GUI-01 — L'ordine si raggiunge**
- Alguacil (Missile Launcher) con un nemico Bersagliato in campo
- Atteso: ATTACCO GUIDATO **nella lista**. Sono 40 profili Nomadi e 68 PanOceania. Nella revisione 1 non compariva a nessuno.

**GUI-02 — Guidato su bersaglio Bersagliato**
- Blast Mode @ banda 3 vs Fusilier **Bersagliato, in copertura**
- Atteso: 11 +3 +3 = **17**, con la nota che ignora Copertura e Mimetismo. Salvezza **VS 7 ×3**.

**GUI-03 — Senza Stato Bersagliato** · bersaglio rifiutato, col motivo. Un Marker non può essere Bersagliato.

**GUI-04 — ECM (Guided −6)** *(risolto, da confermare)*
- Bersaglio **Tikbalang**, Bersagliato, @ banda 3
- Atteso: 11 +3 +3 **−6** = **11**, con la voce "ECM (Guided -6) del bersaglio". Nella revisione 1 il −6 non si applicava.

**GUI-05 — Reset come difesa** · contro un Guidato il menu ARO offre **RESET**, non Schivata.

---

# 10. Blocco H — Corpo a corpo

**CC-01 — Martial Arts sui due lati**
- Morlock (MA L2) · **AP CC Weapon(PS=6)** vs Fusilier · ARO: ATTACCO CC
- Atteso: F2F. Attivo CC 23 **+3** = **26**. Reattivo 13 **−3** = **10**. Salvezza Fusilier ARM **VS 7** — il PS=6 del profilo, non il PS 8 del database armi. Se leggi VS 9 la notazione si è persa nel giro di ritorno.

**CC-02 — NBW e CC Attack (−3)**
- Chimera vs Teutonic Knight (MA L2) · Atteso: attivo CC **24 pieno** con la nota su NBW; reattivo 22 +3 −3 = **22**. Salvezza Teutonic **BTS VS 11**; salvezza Chimera ARM VS 9 ×2.

**CC-03 — Colpo di Grazia** · CC contro un Incosciente · Atteso: **nessun tiro e nessuna salvezza**, passaggio automatico a Morto.

**CC-04 — PARA CC Weapon** · Zondmate vs Fusilier · Atteso: CC **13** (il −3 è per il nemico), salvezza **PH VS 4**, Non-Lethal, IMM-A.

**CC-05 — Berserk** *(chiuso)* · Atteso: **F2F**. In N5 il Berserk non evita il Faccia a Faccia — nella revisione 1 era segnato come divergenza, non lo è.

**CC-06 — Ingaggiato** · Atteso: solo ATTACCO CC, BERSERK, SCHIVATA, RESET, IDLE.

**CC-07 — Gang-Up** · +1 Burst per alleato in contatto di Silhouette col bersaglio, **escludendo** chi è in Stato Nullo o Immobilizzato e chi ha dichiarato Schivata, Idle o Reset.

---

# 11. Blocco I — Hacking

**HK-00 — Programmi per dispositivo**
- Interventor (**HD Plus**): Carbonite, Oblivion, Spotlight, Total Control fra gli attacchi. Zero / Intruder (**KHD**): **solo Trinity**. Alguacil (**HD**): i quattro base. Salyut (**EVO**): **nessun programma d'attacco**.

**HK-01 — Carbonite** · Interventor vs Orc (Hacker) · ARO: RESET
- Atteso: F2F. Attivo WIP **15** B2, reattivo Reset WIP **12** B1. Salvezza Orc **BTS VS 10 ×2** (BTS pieno + PS 7). Nessuna gittata, nessuna copertura.

**HK-02 — Oblivion** · Atteso: **BTS VS 6 ×1** (BTS dimezzato + PS 4), effetto Isolato.

**HK-03 — Spotlight su non-hacker** · vs Fusilier · Atteso: ammesso, **BTS VS 5 ×1**, effetto Bersagliato.

**HK-04 — Trinity** *(risolto, da confermare)*
- Zero (KHD) vs Orc (Hacker) · Atteso: WIP 13 **+3** = **16**, B3, salvezza **BTS VS 9 ×1**. Nella revisione 1 il +3 si perdeva.

**HK-05 — Filtro bersagli**
- CARBONITE / OBLIVION: Tikbalang e Orc ammessi; Fusilier no ("non hackerabile"); Croc Man in Camo no ("va Scoperto prima").
- TOTAL CONTROL: **solo Tikbalang**. TRINITY: **solo Orc**. SPOTLIGHT: anche il Fusilier.

**HK-06 — Firewall** · Interventor vs Teutonic (TinBot: Firewall)
- Atteso: attivo 15 **−3** = **12**, e salvezza del Teutonic **BTS VS 13** (BTS 3 **+3 Firewall** + PS 7).

**HK-07 — Firewall doppio** · se ne usa **uno solo**, a scelta.

**HK-08 — Firewall disabilitato** · Teutonic **Isolato** → Firewall **0**: niente −3 e niente +3 BTS.

**HK-09 — ECM (Hacker −3)** *(risolto, da confermare)* · vs Meteor Zond · Atteso: **−3** al tiro dell'hacker.

**HK-10 — Dati non verificati** · con TOTAL CONTROL o TRINITY → avviso **A91**.

**HK-11 — Upgrade dai profili** · Jazz, Mary Problems, Kulak · Atteso: l'upgrade nel calcolo, oppure **A94**. Mai ignorato in silenzio.

**HK-12 — Reset, non Schivata** · contro HACKING: Schivata assente, Reset presente. Contro ATTACCO BS: il contrario.

---

# 12. Blocco J — Scoprire e osservazione *(blocco nuovo)*

**DIS-01 — Bande dello Scoprire** · Alguacil · SCOPRIRE vs Croc Man in Camo @ banda 0
- Atteso: **WIP 13** +3 −6 = **10**, B1, **nessun Faccia a Faccia**. Chi fallisce non ritenta sullo stesso Marker fino al proprio Turno.

**DIS-02 — Banda lontana** · @ banda 4 → **4**. Le bande dello Scoprire sono 12 e diverse da quelle del Combi.

**DIS-03 — Sensor applicato allo Scoprire** · Grenzer (Sensor) @ banda 1 → mimetismo ridotto dal visore **+6** da Sensor = **16**.

**DIS-04 — Bersaglio non Marker** · rifiutato, "non c'è niente da Scoprire".

**DIS-05 — Bersagliato aiuta** · Marker Bersagliato → **+3**.

**OSS-01 — Forward Observer** *(ordine nuovo)*
- Grenzer (Forward Observer, Sensor, NCO) · FORWARD OBSERVER vs Fusilier @ banda 1
- Atteso: Breve/ARO su **WIP**, arma "Forward Observer" con Burst 2 e bande tutte a 0 fino a 24" (nessun MOD di gittata), **serve LoF**.
- **Nessun Tiro Salvezza**: impone lo Stato **Bersagliato**. Se l'app ti chiede una salvezza, segnalalo — la regola è Non-Lethal.

**OSS-02 — Sensor** *(ordine nuovo)*
- Grenzer · SENSOR, senza bersaglio
- Atteso: Breve su **WIP +6** = **19**, **senza LoF** e **senza bersaglio**: scopre tutti i Marker nella ZdC insieme. Nessun MOD di gittata né di Mimetismo.

**OSS-03 — Triangulated Fire** *(ordine nuovo)*
- Zulu-Cobra (Triangulated Fire) · Ordine **Intero** su **BS**, **senza alcun MOD**
- Atteso: contro un Croc Man in copertura a media distanza il tiro resta il BS pieno. I MOD ignorati vanno mostrati **barrati**: senza spiegazione un 12 al posto di uno 0 sembra un difetto del calcolatore.
- Requisito: senza l'abilità l'ordine è rifiutato con "Serve l'Abilità Triangulated Fire".

---

# 13. Blocco K — Supporto

**SUP-01 — Dottore** · Daktari su un nomade **Incosciente con VITA**
- Atteso: tira il **Daktari** su **WIP 13**, Tiro Normale, **nessun bonus**. Fallimento: **MORTO**.

**SUP-02 — MediKit** · Alguacil (Paramedic) su Incosciente
- Atteso: **due tiri in ordine** — prima l'Alguacil colpisce (**BS 11**), poi **tira il bersaglio** su **PH 10**. Nessun Tiro Salvezza. Fallimento: **MORTO** (N5.2).

**SUP-03 — Ingegnere** · Clockmaker su Reaktion Zond Incosciente · Atteso: **WIP 15**, fallimento **+1 Ferita**, non la morte.

**SUP-04 — GizmoKit(+1B)** · BS 11 per colpire, poi il bersaglio su **PH 10**; il (+1B) deve portare il Burst a **2**.

**SUP-05 — Filtro bersagli** *(risolto, da confermare)*
- Dottore e MediKit: **solo alleati con VITA e Incoscienti**; un REM va rifiutato con "Non ha l'attributo VITA".
- Ingegnere e GizmoKit: **solo alleati con STR**.
- Nella revisione 1 erano invertiti: il Dottore accettava i REM.

**SUP-06 — Strumento sconosciuto** · avviso **A58** con l'elenco degli id attesi.

**SUP-07 — Ri-tiri** · Cubo per il Dottore, Remote Presence per l'Ingegnere: la nota sui Command Token.

---

# 14. Blocco L — Difese e Soppressione

**DIF-01 — Schivata con LoF** · PH **10**, nessun MOD.
**DIF-02 — Schivata senza LoF** · **7**, con la voce.
**DIF-03 — Dodge (+3)** · Puppetbot → **13**.
**DIF-04 — Schivata da IMM-A** *(risolto)* · PH 10 **−6** = **4**, con la voce "Stato IMM-A". Nella revisione 1 restava 10.
**DIF-05 — Reset base** · WIP **13**, con la nota che il −3 senza LoF vale sulla Schivata e non sul Reset.
**DIF-06 — Reset da Bersagliato** · **10**.
**DIF-07 — Reset da IMM-B** *(risolto)* · **10**.
**DIF-08 — Reset da Isolato** *(risolto)* · **4**.

**DIF-09 — Sesto Senso** *(risolto, da confermare)*
- Un reattivo con Sixth Sense che dichiara Schivata **sotto Soppressione** e senza LoF
- Atteso (p.109): **nessun MOD negativo**, salvo IMM-A (−6 PH), IMM-B (−3 WIP), Isolato (−9 WIP). Quindi PH pieno: nell'elenco MOD non deve comparire né il −3 della LoF né quello della Soppressione.

**DIF-10 — Dichiarare la Soppressione** · nessun tiro, stato visibile sul tabellone, arma che passa al profilo SF Mode.

**DIF-11 — Armi ammesse** · Alguacil col Combi sì, **Morlock no**: tutte e tre le sue armi escluse col motivo.

**DIF-12 — SF Mode in ARO** · arma "Combi Rifle (SF Mode)", Burst **3**, bande 0/0/−3, gittata massima 24", avviso **A98**.

**DIF-13 — Attivare cancella la Soppressione** · anche se l'ordine viene poi speso in altro.

---

# 15. Blocco M — Stati dell'attivo

Imposta lo stato e guarda **la lista ordini**.

| # | Stato | Atteso |
|---|---|---|
| ST-01 | Normale | lista piena |
| ST-02 | **Morto** | nessun ordine |
| ST-03 | **Incosciente** | nessun ordine |
| ST-04 | **Isolato** | nessun ordine dal Pool, con il motivo |
| ST-05 | **Disconnesso** | nessun ordine, né ARO |
| ST-06 | **IMM-A** | **solo SCHIVATA** |
| ST-07 | **IMM-B** | **solo RESET** |
| ST-08 | **Stordito** | tutto tranne BS, CC, BERSERK, PROTHEION, HACKING |
| ST-09 | **Ingaggiato** | solo CC, BERSERK, SCHIVATA, RESET, IDLE |
| ST-10 | **In Ritirata** | solo MOVIMENTO, SCOPRIRE, SCHIVATA, RESET, CAUTO |
| ST-11 | **Foxhole** | tutto tranne il movimento. Vedi ST-15 |
| ST-12 | **Bersagliato** | tutto tranne MOVIMENTO CAUTO |
| ST-13 | **Soppressione** | lista piena, ma attivare annulla lo stato |
| ST-14 | IMM-A + Bersagliato + Prono | tutti e tre visibili sul tabellone |

**ST-15 — Foxhole** *(verificabile adesso)*
- Regolamento p.158: Silhouette **3** (o il proprio valore se più alto), **Copertura Parziale in arco 360°**, **Mimetism (−3)** e **Courage**, posizione fissa che non consente **alcun** movimento — nemmeno quello di una Schivata riuscita.
- Cancellazione: andando Prono, oppure in Turno Attivo dichiarando una Skill con Label Movimento e annunciando la cancellazione, a costo zero.
- Confronta con quello che mostra l'app: veniva dal vecchio codice, non dal regolamento.

**ST-16 — Gli stati arrivano al tabellone, in ordine** *(risolto, da confermare)*
- Unità con `immobilizedA`, `targeted`, `prone`, `camo`, `unconscious` (deployState CAMO_1)
- Atteso sul tabellone, in quest'ordine: **Incosciente, Immobilizzato-A, Bersagliato, Prono, Mimetizzato** — cioè NULLO, IMM, INFOGUERRA, POSTURA, MARKER. I nomi li dice il motore, non una tabella dell'interfaccia.
- Nella revisione 2 questa prova diceva che gli stati non arrivavano: era una mia segnalazione sbagliata, la correzione c'era dal 14 settembre.

**ST-17 — Una riga malata non svuota il tabellone**
- Tre unità sul tabellone, con `M.statiPerCategoria` forzato a sollevare **solo sulla seconda**
- Atteso: **tre righe su tre**; la seconda mostra **STATI ILLEGGIBILI**, le altre i loro stati normali; `window.ultimaEccezione` contiene il messaggio.
- È l'unica prova che avrebbe preso la regressione del 21 settembre, quando due protezioni si erano perse costruendo il controller su una copia più vecchia. Simula il guasto: resta valida qualunque cosa cambi nei database.

**ST-18 — Il segno NULL viene dal campo, non dalla categoria**
- Unità con `unconscious`, `retreat`, `isolated`, `disconnected`, `possessed`, `sepsitorized`, `prone`
- Atteso **col segno** (bordo rosso e la parola NULL): Incosciente, Disconnesso, Posseduto, Sepsitorizzato.
- Atteso **senza segno**: Ritirata! (sta nel gruppo NULLO ma non è Null) e Isolato (sta in INFOGUERRA accanto a Disconnesso, ma non è Null). Il Prono, che era il terzo caso, dal 23 settembre non è più uno stato.
- Se un giorno il segno venisse ricavato dalla categoria, Ritirata! lo prenderebbe e Posseduto lo perderebbe: è il caso che lo scopre.

---

**ST-19 — Prono e Scarico non sono più stati** *(nuovo)*
- Apri la pagina degli stati di una truppa qualunque
- Atteso: **nessuna casella** per il Prono e per lo Scarico; i flag impostabili sono **16**.
- Decisione di Paolo: nessuno dei due dà MOD — lo Unloaded impedisce di usare l'arma esaurita, e gli usi Disposable il motore li conta già. Entrambi sono dichiarati in `CATALOGO_N5.STATI_NON_GESTITI` con la riga del regolamento, il perché, e il promemoria per il tavolo.
- Controprova: una partita salvata **prima** del ritiro, con `prone: true` ancora scritto, si carica senza allarmi e senza mostrare niente. È la differenza fra *tolto* e *sconosciuto*.

**ST-20 — Il Marker si chiama CAMO** *(nuovo)*
- Metti una truppa in Camo e guarda il tabellone e le note del calcolo
- Atteso: **CAMO** in tutti e due i posti. Prima erano due nomi — "Mimetizzato" sul tabellone, "Camuffato" nelle note — e il primo si confondeva con la skill **Mimetismo**, che è un'altra cosa e dà il −3.
- Controprova: la skill Mimetismo si chiama ancora così, e i suoi −3 e −6 non sono cambiati.

---

# 16. Blocco N — Stati del reattivo

| # | Stato | Attacco in arrivo | Atteso |
|---|---|---|---|
| AR-01 | Normale | ATTACCO BS | BS, CC, Hacking, Schivata. **Reset assente** |
| AR-02 | Normale | HACKING | Reset presente, **Schivata assente** |
| AR-03 | **IMM-A** | ATTACCO BS | **solo Schivata** |
| AR-04 | **IMM-B** | HACKING | **solo Reset** |
| AR-05 | **IMM-B** | ATTACCO BS | **nessuna ARO** — può solo il Reset, che contro il BS non difende. È corretto |
| AR-06 | **Stordito** | ATTACCO BS | nessun attacco: solo Schivata |
| AR-07 | **Ingaggiato** | ATTACCO BS | solo CC, Schivata, Reset |
| AR-08 | **Isolato** | HACKING | Reset sì, Hacking no |
| AR-09 | Incosciente / Morto / Disconnesso | qualunque | non compare fra i reattivi, e appare nell'elenco "non possono reagire" col motivo |
| AR-10 | **Nascosto / in Riserva** | qualunque | non compare |
| AR-11 | **Soppressione** | ATTACCO BS | badge SF MODE, arma col profilo SF |

---

# 17. Blocco O — Deployable *(blocco nuovo)*

**DEP-01 — Chi può piazzare**
- Atteso: PIAZZARE EQUIPAGGIAMENTO compare al **Moran** (CrazyKoalas, usi 2/2), all'**Heckler** (Cybermine 3/3), al **Puppetbot**. Non compare a chi non ha armi col Tratto Deployable.

**DEP-02 — Le due domande bloccano prima**
- Attivo: Moran · PIAZZARE EQUIPAGGIAMENTO · CrazyKoalas
- Atteso: il pulsante resta **RISPONDI ALLE DOMANDE** finché mancano risposte, e diventa **PIAZZAMENTO NON CONSENTITO** se una risposta blocca. I CrazyKoalas hanno Perimeter, quindi **due** domande: Marker mimetico nell'area d'innesco, e percorso libero.
- Rispondendo "sì" al Marker: **nessun token creato**, nessun uso scalato.

**DEP-03 — Piazzamento riuscito**
- Rispondendo "no": token **CrazyKoala #1** creato, categoria PERIMETER, `isCamo` false, ARM 0 BTS 0 STR 1 S 1, e uso del Moran sceso a **1/2**.
- Atteso anche: la riga che dichiara che **il token non è stato spedito all'avversario** finché il canale non esiste. Se non la leggi, l'app sta facendo credere che sia arrivato.

**DEP-04 — Terzo koala** · dopo due piazzamenti · Atteso: **E17 usi esauriti**, non un terzo token.

**DEP-05 — ARO contro chi piazza**
- Moran piazza · ARO: Fusilier → ATTACCO BS, Combi, banda 1
- Atteso: **TIRO NORMALE**, "L'attaccante non tira: Burst 0". Attivo **Auto**, B0. Reattivo **12** (BS 12 +3 gittata −3 Mimetismo del Moran) B1. Salvezza al Moran ARM **VS 7**.
- E il **token non è bersagliabile** in questo ordine (p.5532 del regolamento vecchio, riga corrispondente nel file nuovo): il nemico reagisce solo contro chi piazza.

**DEP-06 — Il Boost scatta**
- Turno successivo, un nemico si attiva nella ZdC del koala
- Atteso: il deployable compare nella schermata ARO **fuori dal percorso normale** — non dichiara, si attiva — con la domanda "è dentro la ZdC, con percorso libero?".
- Se scatta: **TIRO NORMALE**, attivo **Auto**, difensore che schiva a **PH 10** senza il −3 per assenza di LoF, salvezza **ARM VS 6**. Note: "Se la Schivata riesce, l'attacco è evitato del tutto" e "Dopo la detonazione l'arma è rimossa dal gioco" — **una volta sola** ciascuna.

**DEP-07 — Il Boost non scatta**
- Contro un **Marker mimetico**: "Non scatta contro Marker Mimetici o Impersonation".
- Contro un altro **deployable**: "Per il Tratto Deployable, l'arma non attiva altri Deployable".
- Con percorso non verificato: scatta, ma con la nota "Percorso non verificato: chiedere se è libero".
- E lo **Stealth non lo protegge**: il regolamento dice che lo Stealth non è efficace contro le armi Deployable.

**DEP-08 — Il token muore** · un colpo che passa · Atteso: STR 1 più il Tratto Deployable = passa **direttamente a Morto** e si rimuove. Niente Incosciente, niente Ingegnere.

**DEP-09 — Disco Ball** · Kulak · il Disco Ball **non** compare fra le armi piazzabili: nasce dall'esito del tiro del **Disco Baller**, quindi passa dal Fuoco Speculativo. Verifica che il token nasca dopo un tiro riuscito, con la Sagoma Circolare Eclipse centrata, e che alla Fase Stati si rimuova **la sagoma e non il token**.

**DEP-10 — Minelayer in schieramento** *(implementato, da provare in app)*
- Spektr (Minelayer) e Firefly (Minelayer) in fase di schieramento
- Atteso: l'app offre **solo** le armi Deployable della truppa — Spektr E/M Mine e Shock Mine, Firefly AP Mine e **Armed Turret** — e chiede **due** conferme: nessun nemico né Marker nell'Area d'Innesco, e punto dentro la propria zona di schieramento. Senza entrambe non si piazza; rispondendo "c'è un nemico" non nasce nessun token.
- Piazzato: il token entra nel roster e **arriva all'avversario con lo schieramento**, senza canale nuovo. La mina si vede come **SEGNALINO MIMETICO**, la torretta **a vista**.
- Il pezzo si scala: un secondo piazzamento con Minelayer (1) è rifiutato.
- Se il Tiro di Schieramento Superiore fallisce, il Deployable si perde e l'uso si scala.

**DEP-11 — La torretta non è scenografia** *(nuovo)*
- Atteso: l'Armed Turret **non compare** fra gli elementi scenici, ed è bersagliabile come un Deployable nemico — BS e CC sì, Hacking no. Il Deactivator la trova perché è un dispositivo dell'avversario.

---

# 18. Blocco P — Trincerarsi e logistica *(blocco nuovo)*

**LOG-01 — Trincerarsi** · Ordine Intero, nessun tiro · Atteso: l'unità entra in Foxhole, con gli effetti di ST-15.

**LOG-02 — Ingresso in campo**
- Atteso: la schermata dice **prima del tiro** che fallire non significa "non entri": si entra nella **propria Zona di Schieramento**, a contatto col bordo, come Modello e **senza i Deployable**. È la regola che cambia la decisione, non l'esito.

**LOG-03 — Request Speedball**
- Atteso: **non è un Ordine**, è un'Abilità Automatica, e il tiro è su **PH 14 fisso** — non il PH della truppa. Primo Token scelto, secondo tirato sulla Chart.

---

# 19. Blocco Q — Fireteam

**FT-01 — Livello = truppe della stessa Unità** · 5 Alguacil → **LIVELLO 5 (5 membri)** e i cinque bonus.

**FT-02 — Cinque truppe diverse** · Alguacil + Moderator + Grenzer + Zero + Daktari → **LIVELLO 1 (5 membri)**, nota esplicita, **nessun bonus**.

**FT-03 — Il +1 BS nel calcolo** · da Livello 4 in su, con la voce.

**FT-04 — Non vale per Scoprire né Hacking** · con la nota.

**FT-05 — Rotture** · escono Incoscienti, Morti, Isolati, in Soppressione. **Non** escono IMM-A e IMM-B, con la nota.

**FT-06 — Neurocinetics in Fireteam** *(nuovo)* · un Sin-Eater in un Fireteam di Livello alto · Atteso: il bonus di Burst **non** si applica in Turno Attivo. Dipende da BS-25.

---

# 20. Blocco R — Ordine Coordinato

**CO-01 — Burst della Punta di Lancia** · HMG B4 → **2**, con la voce "metà arrotondata per eccesso".
**CO-02 — Gregari** · Burst **1** per tutti.
**CO-03 — Leader di Fireteam ≠ Punta di Lancia** · in Fireteam il Leader ha Burst pieno.
**CO-04 — Cinque unità** · **E41**. **CO-05 — Nessuna** · **E40**. **CO-06 — Punta mancante** · **E45**. **CO-07 — Punta non selezionata** · **E46**.
**CO-08 — Unità non attivabile** · un Incosciente nel gruppo → **E42** col motivo.
**CO-09 — Gruppi diversi** · **E43**; **addestramento diverso** · **E44**.
**CO-10 — Stesso bersaglio** · chi non soddisfa i requisiti fa **Idle**, che genera comunque ARO e spende i Disposable (A-07).
**CO-11 — CC coordinato** · tira solo la Punta, con +1 Burst e +1 PH per alleato **partecipante** ingaggiato.
**CO-12 — ARO** · un solo ARO per nemico, contro una sola delle truppe attivate.
**CO-13 — Command Token** · promemoria: il motore non lo scala.

---

# 21. Blocco S — Schieramento

**SCH-01 — Anti-spoiler**
- Pano schiera: Croc Man **Nascosto**, Fusilier normale, Zulu-Cobra in **Camo**, Fusilier (ML) in **Riserva**
- Atteso nel roster che arriva all'altra app: Fusilier (Combi Rifle), un **SEGNALINO MIMETICO di tipo MARKER** al posto dello Zulu-Cobra, e Fusilier (Missile Launcher). Il **Croc Man Nascosto non compare affatto**.

**SCH-02 — Hidden Deployment è anche una regola** *(risolto, da confermare)*
- Atteso: chi è in Hidden Deployment **non è sul tavolo**: non è bersagliabile, non è Scopribile, e le Sagome non lo colpiscono. Il rifiuto deve dire il motivo.
- L'anti-spoiler resta necessario, ma non è più l'unica difesa: la truppa che si rivela cambia stato, non roster.
- E il promemoria dell'Infiltrazione **compare anche per chi è nascosto** (riga 13896), con il numero: per lo Zero, "Tiro a 9 (PH 12 − 3)".

**SCH-03 — Senza motore non si spedisce** · togli lo `<script>` e schiera · Atteso: **niente parte**, con un messaggio esplicito.

**SCH-04 — Bersagli solo fra gli schierati** · mai l'intero database.

**SCH-05 — Terreni** · solo quelli messi in schieramento.

---

# 22. Blocco T — Terreni

Stesso attacco, cambia il terreno. Attaccante senza visore, poi MSV L1, L2/L3, poi Marksmanship.

| # | Terreno | Senza visore | MSV L1 | MSV L2/L3 | Marksmanship |
|---|---|---|---|---|---|
| TER-01 | TER_10 Bosco | **−3 BS**, −1 Burst | −1 Burst | −1 Burst | −3, −1 Burst |
| TER-02 | TER_11 Giungla | **−6**, −1 Burst | **−3**, −1 Burst | −1 Burst | −6, −1 Burst |
| TER-03 | TER_13 Foresta | **nessuna LoF** | **−6**, −1 Burst | LoF libera, −1 Burst | nessuna LoF |
| TER-04 | TER_17 Sala Generatori | nessun effetto, −1 Burst | **−6**, −1 Burst | LoF libera, −1 Burst | **nessuna LoF** |
| TER-05 | TER_15 Tempesta | −3 | niente | niente | −3 |

**TER-06 — Speculativo ignora le Zone di Visibilità** · il MOD del terreno non entra nel tiro, il −1 al Burst sì.
**TER-07 — Saturazione** · il Burst scende **prima** dell'allocazione.
**TER-08 — Fumo contro MSV** · Smoke → **TIRO NORMALE** con la nota; Eclipse → **F2F**.

---

# 23. Blocco U — Contratto: quale errore deve uscire

L'invio deve essere **bloccato**. Se il calcolo parte lo stesso, è grave.

| # | Cosa forzare | Atteso |
|---|---|---|
| ER-01 | azione non nel vocabolario | **E01** |
| ER-02 | attaccante non nel roster | **E03** |
| ER-03 | attacco senza arma | **E07** |
| ER-04 | arma inesistente | **E08** + **A42**; **E09** se manca ogni modo di risoluzione |
| ER-05 | nessun bersaglio | **E04** + **E20** |
| ER-06 | avversario non schierato | **E05** |
| ER-07 | bersaglio "Bersaglio Primario" / `generic1` | **E06** — la vecchia segnalazione #5 |
| ER-08 | bersaglio non schierato | **E06** |
| ER-09 | stesso bersaglio due volte | **E12** |
| ER-10 | bersaglio non valido per l'azione | **E15** + motivo |
| ER-11 | nessuna banda scelta | **E13**, con l'elenco delle bande |
| ER-12 | banda e MOD incoerenti | **avviso A13**, MOD riallineato. Non è errore |
| ER-13 | zero dadi | **E20** |
| ER-14 | più dadi del Burst | **E21** |
| ER-15 | Burst oltre 6 | **E22** |
| ER-16 | difesa con due segnaposto | **E11** |
| ER-17 | Soppressione con bersagli | **avviso A10** |
| ER-18 | Coordinato con 5 unità | **E31** / **E41** |
| ER-19 | deployable: arma non piazzabile | **E16** |
| ER-20 | deployable: usi esauriti | **E17** |
| ER-21 | creaDeployable con un nome invece del profilo | **E18** |
| ER-22 | attacco valido e completo | **nessun errore, nessun avviso**, invio eseguito |

**ER-23 — Come si vede il blocco** · messaggio leggibile che inizia con "⛔ INVIO BLOCCATO", un punto per errore. Mai un oggetto JavaScript.

**ER-24 — Eccezione in un modulo** · l'app resta viva, dice quale modulo, e **l'ordine non è consumato**.

**ER-25 — Avvisi prima dell'invio** *(risolto, da confermare)* · gli avvisi di gravità **azione** compaiono prima del calcolo, con messaggio e dettaglio; annullando, il payload torna con `ok:false` ed errore UI01 e il modulo non spedisce. Controprova: un avviso di gravità **nota** non deve fermare niente.

---

# 23-bis. Blocco DIS — Usi Disposable e dado speciale

Fino al 27 settembre gli usi si scalavano solo piazzando un Deployable: sparare
non ne consumava nessuno. Il numero sullo schermo era giusto, era la sua storia
a non esistere — ed è il genere di difetto che al tavolo non si vede finché
qualcuno non conta i colpi.

**DIS-01 — Il Panzerfaust ha due usi, e finiscono**
- Triphammer (Panzerfaust) · due Attacchi BS di seguito contro lo stesso bersaglio
- Atteso: dopo il primo colpo **1 uso**, dopo il secondo **0**, e al terzo
  tentativo il Burst possibile è **0**: non si può più tirare.
- Se dopo due colpi ne restano ancora due, è tornato il difetto.

**DIS-02 — Il (+1B) costa due usi, il (+1SD) uno**
- La stessa arma con le due notazioni
- Atteso: col **(+1B)** si tirano due dadi e si spendono **due** usi; col
  **(+1SD)** si tira un dado in più ma si spende **un** uso solo — il dado
  speciale non consuma. Sono due notazioni che si somigliano e fanno l'opposto.

**DIS-03 — Una Schivata non consuma niente**
- Stessa truppa, SCHIVATA · Atteso: usi invariati.

**DIS-04 — Scarico è l'oggetto, non la truppa**
- Zero (Boarding Shotgun), che porta Shock Mine **e** PARA Mine: esaurita la
  prima, l'altra deve restare usabile — atteso **3 usi** e Burst 1.
- Il messaggio nomina lo stato **Scarico** e dice come si toglie: Reload,
  Abilità Breve nella ZdC di un alleato con Baggage.

**DIS-05 — Il dado speciale si vede** *(nuovo)*
- Triggermen (BS Attack [+1SD]) · Attacco BS
- Atteso: fra i modificatori compare **"tira 1 dado in più, poi scartane 1"**,
  e il Burst **non** aumenta. Con due bersagli il dado va a **uno solo**: il
  primo con dadi assegnati, o quello che hai marcato.
- Controprova: un Alguacil non deve vedere quella frase.

---

# 23-ter. Blocco DET — Detonazione e Schivata

**DET-01 — La mina detona e chi ha innescato schiva**
- Attivo: Alguacil · MUOVERE + **SCHIVATA** · una Shock Mine nemica innesca
- Atteso: a sinistra **SCHIVATA (Tiro Normale) 7** — PH 10 meno 3 — e sotto la
  salvezza della mina con la sua munizione.

**DET-02 — Chi non la dichiara non la riceve**
- Stesso caso con MUOVERE + MUOVERE · Atteso: **NESSUNA SCHIVATA**. L'app non
  presume niente: al tavolo una Schivata non dichiarata non esiste.

**DET-03 — Il −3 viene dalla Sagoma**
- Ripeti DET-01 contro un **CrazyKoala** e contro le **MadTraps**
- Atteso: **10** in entrambi i casi, PH pieno. Solo la mina, che è una Sagoma,
  toglie 3. Se vedi 7 contro il Koala, il −3 è stato dato a tutti i deployable.

**DET-04 — Le tre domande dell'innesco**
- Scegliendo DETONAZIONE per una mina: **tre domande**, ciascuna bloccante —
  un nemico nell'area d'innesco; solo il movimento di una Schivata o di un Guts
  fallito; un alleato sotto la Sagoma, anche Incosciente.
- Atteso: se manca **anche una sola risposta**, la detonazione **non scatta** e
  l'app lo dice. Al tavolo una detonazione non si annulla: "non so" deve
  fermare, non procedere.
- Il Chest Mine e il Mine Dispenser **non** ricevono la voce DETONAZIONE.

**DET-05 — Il token esce dal tavolo**
- Dopo l'innesco: la mina **sparisce** dal tabellone e dalla copia locale, e
  non torna riaprendo l'app. Alla Fase Stati invece **non** si toglie: si toglie
  la Sagoma, non il token.

---

# 23-quater. Blocco RIP — Riprendere una partita

**RIP-01 — L'Hub riaperto a metà partita**
- Chiudi la pagina dell'Hub durante una partita e riaprila
- Atteso: **niente si cancella**. Finché la prima lettura dal server non è
  conclusa l'Hub non trasmette; poi la partita torna da sola — roster di
  entrambe le fazioni, fazione attiva, scenario e **ferite**.
- Il difetto che questo blocco sorveglia: prima il primo invio a stato vuoto
  cancellava la partita **per entrambi**, e bastava riaprire la pagina.

**RIP-02 — Lettura non riuscita**
- Stacca la rete e riapri l'Hub · Atteso: riquadro **"PARTITA NON LETTA DAL
  SERVER"**, nessuna trasmissione, e un nuovo tentativo ogni quattro secondi.

**RIP-03 — RIPRENDI PARTITA nell'app**
- Atteso: il pulsante compare **solo** se sul dispositivo c'è una copia locale.
  Dopo un reset dall'Hub **non** compare, e la copia viene dimenticata.
- Con un allarme ARO pendente: avvisa, e l'allarme **resta** sul server — non
  va cancellato, o l'avversario perde la sua reazione.

**RIP-04 — Una copia salvata prima di questo giro**
- Riapri con una copia locale vecchia, senza il campo dei token
- Atteso: si carica, con zero token piazzati e **nessun errore**. È il caso che
  capita per primo, alla prima riapertura dopo un aggiornamento.

---

# 23-quinquies. Blocco ORD — Ordini che non tirano, con una domanda davanti

Tre voci con la stessa struttura: **Abilità Lunga, nessun tiro, un requisito che
l'app non può vedere** — la linea di tiro la sa solo chi guarda il tavolo — e un
effetto che cambia lo stato di chi agisce, non di un avversario. Due sono da
costruire; la terza esiste già ed è il modello.

**ORD-01 — Piazzare equipaggiamento** *(esiste)*
- È il modello della famiglia: domande bloccanti, e se manca una risposta non si
  esegue. Vedi DEP-10 e DET-04.

**ORD-02 — Cybermask** *(da costruire)*
- Programma già nel catalogo, su **Hacking Device Plus** e **Killer Hacking
  Device**: un Hacking Device normale NON deve mostrarlo.
- Regola (riga 5150): Abilità Lunga, **NFB**, nessun tiro. Requisito: l'utente
  dev'essere **fuori dalla LoF di Modelli e Marker nemici**.
- Atteso: una domanda sola — *"Nessun nemico ha LoF verso di te?"* — e tre esiti:
  **no** non si può dichiarare, col motivo; **sì** l'hacker diventa Marker
  **IMP-2** senza tirare, Ordine intero speso; **non risposto** non si esegue.
- In IMP-2 vale l'NFB: nessun'altra Skill o Equipaggiamento. Le altre voci del
  menu devono sparire.

**ORD-03 — Rientrare in Camuffato** *(da costruire)*
- Regola (riga 13597): *"During the Active Turn, Troopers may only return to this
  state by spending a Long Skill, while outside the LoF of enemy Markers or
  Troopers."*
- Stessa domanda e stessi tre esiti. In più: la truppa deve **avere
  Camouflage**, e con **Camouflage (1 Use)** l'uso dev'essere ancora disponibile
  (FAQ F07) — l'**Heckler** è il profilo da usare per quel caso.
- Da non perdere (riga 13605): una truppa rivelata che **rientra** in Camuffato
  **non conta come lo stesso Marker**. Chi aveva fallito uno Scoprire contro di
  lei può ritentare subito, senza aspettare il turno dopo.

---

# 24. Blocco V — Difetti aperti e divergenze note

## Difetti trovati al tavolo, non ancora chiusi

**D-01 — L'anello della scelta dell'arma (BS-06).** Dopo la scelta, l'app torna a
chiederla. Stessa firma dell'anello dell'hacking chiuso il 29 settembre: la
seconda metà non ritrova l'arma della prima. → MOTORE.

**D-02 — Il Burst della Soppressione in reazione (BS-12).** Con un attacco attivo
il reattivo in Fuoco di Soppressione scende a **Burst 1**; senza attacco resta
**3**. La regola (riga 14649) dice 3 sempre: la regola generale dell'ARO sta
scavalcando la Soppressione, come faceva con Neurocinetics. → MOTORE.

**D-03 — Gli ordini senza tiro che non avvisano (A-13).** PIAZZARE
EQUIPAGGIAMENTO e IDLE passano al calcolo **senza generare l'ARO**. Il motore
dice che lo genererebbero; i due moduli non chiamano `inviaAllarmeAro`. → MOTORE.

## Divergenze note, che restano aperte per una ragione

**T-01 — Le mine non sanno se detonano.** Nel database non hanno un modo di
risoluzione. All'innesco il motore risponde `null` — *non lo so* — e l'app dice
che la mina **resta sul tavolo**, invitando a toglierla a mano. È corretto così:
un "no" sarebbe falso. → DATABASE, quando la fonte darà il dato.

**T-02 — "Un pilota, un segnalino" è una lettura, non una regola.** La wiki vieta
esplicitamente solo il secondo segnalino sullo stesso REM. → REGOLE.

**T-03 — Il recupero parziale non esiste.** Se la copia locale manca del tutto,
il pulsante non compare. Costruirlo è possibile, ma potrebbe recuperare **solo le
unità visibili**: per regola (riga 13896) un Hidden non mette il suo Ordine nel
pool, e l'esistenza di quell'Ordine è informazione privata. Se si fa, deve dire
"non conoscibili dall'Hub, per regola" — non zero. → INTERFACCIA.

**T-04 — Due identificativi ignoti:** `?219` sul Monstrucker e `?227` su Shona
Carano. Le tabelle di decodifica sono ridotte per fazione e questi non stanno in
nessuna delle due. → DATABASE.

## Da costruire, deciso ma non fatto

**C-01 — Cybermask** e **C-02 — Rientrare in Camuffato** (blocco ORD): due voci di
menu con la stessa forma del piazzamento. → MOTORE per la regola e la domanda,
INTERFACCIA per il menu.

**C-03 — Le due zone temporanee.** Fumo ed Eclipse non sono terreni dello
scenario: nascono da un'azione e durano un turno. Vanno **sempre** disponibili nel
menu del calcolo, indipendentemente dallo schieramento, e si dichiarano al
momento del tiro come la copertura. Servono entrambe, perché un MSV L2 attraversa
il Fumo ma non l'Eclipse: con una voce sola il giocatore col visore sceglierebbe
quella sbagliata. → INTERFACCIA per il menu, MOTORE per il MOD.

**C-04 — Le icone dei due pulsanti.** Copertura e linea di tiro hanno ora le
quattro immagini (bersaglio in copertura parziale, bersaglio non in copertura, LoF
libera, LoF interrotta); vanno nella cartella `img/` accanto ad `app.html`.
→ INTERFACCIA.

**Chiuse dalla revisione 6**, da confermare in app: l'anello dell'hacking, il
RemDriver col rifiuto nel motore, l'Albedo col valore del profilo, gli usi
Disposable, il dado speciale, la Schivata contro le mine, la ripresa di app e Hub.

# 25. Blocco W — Sweep in console

**SW-01 — Tutte le armi si risolvono**
```js
Object.keys(RULES_WEAPONS).forEach(n => {
  const a = MotoreN5.profiloArma(n);
  const av = (a.avvisi||[]).map(x=>x.codice).join(',');
  if (a.nonTrovata || av) console.log(n, '->', av || 'NON TROVATA');
});
```
Atteso: solo **A51b** sui 21 contenitori di modalità e **A47** su Jammer e D-Charges (Demolition Mode), che sono modi dedotti. Ogni altro codice è una segnalazione.

**SW-02 — Bande anomale** *(corretto: va escluso anche `senzaGittata`)*
```js
Object.keys(RULES_WEAPONS).forEach(n => {
  const a = MotoreN5.profiloArma(n);
  if (a.isTemplate || a.isCC || a.modalita || a.senzaGittata) return;
  if (!a.bands || !a.bands.length) console.log('SENZA BANDE:', n);
  if (a.bands && a.bands.every(b => b.mod === 0)) console.log('TUTTE A ZERO:', n);
});
```
Atteso: nessuna riga. Senza il filtro `senzaGittata` escono otto falsi positivi — i deployable, che hanno la banda finta con l'etichetta del modo.

**SW-03 — Salvezze complete**
```js
const b = DB_PANOCEANIA.find(u=>u.nome==='Fusilier (Combi Rifle)');
Object.keys(RULES_WEAPONS).forEach(n => {
  const a = MotoreN5.profiloArma(n);
  if (a.modalita) return;
  const s = MotoreN5.tiroSalvezza(b, {arma:a, ammo:a.ammo});
  if (s.offensivo !== false && (!s.attributo || !s.tiri)) console.log('INCOMPLETA:', n);
});
```

**SW-04 — Notazioni sconosciute nei profili**
```js
[...DB_NOMADI, ...DB_PANOCEANIA].forEach(u =>
  MotoreN5.tutteLeNotazioni(u).forEach(x => { if (x.sconosciuta) console.log(u.nome, x.raw); }));
```
Atteso: nessuna.

**SW-05 — Deployable collegati**
```js
DB_DEPLOYABLES.forEach(d => {
  if (!d.chiaveArma) return console.log(d.id, '-> nessuna arma (voluto?)');
  const a = MotoreN5.profiloArma(d.chiaveArma);
  if (a.nonTrovata) console.log('SCOLLEGATO:', d.id, '->', d.chiaveArma);
});
```
Atteso: solo `deployable_repeater` e `dazer`, che hanno `chiaveArma: null` di proposito.

---

# 26. Ordine di esecuzione

1. **Preflight**. Se PRE-01 o PRE-02 falliscono, fermati. E dopo **ogni**
   sostituzione di file, prima di qualunque altra cosa: `node
   test_caricamento_pagine.js`. È l'unico controllo che vede un file
   dichiarato dalla pagina e non presente — è già successo due volte in un
   mese, e senza di lui l'app semplicemente non parte.
2. **RIP** (ripresa): se l'Hub non riapre bene, tutto quello che viene dopo si
   gioca su una partita che potrebbe cancellarsi da sola.
3. **A, B, C** — il grosso, e i più veloci.
4. **U** (contratto): trova subito le regressioni sui bersagli e sugli errori
   bloccanti.
5. **DIS** (usi Disposable): poche prove, e sono quelle che al tavolo cambiano
   quanti colpi hai davvero.
6. **M, N** (stati): sono quelli che fanno perdere ordini.
7. **O, DEP, DET** (deployable, mine e detonazione): il blocco con più cose da
   confermare.
8. **D, E, F, G, H, I, J, K, L, P** — un blocco per sessione.
9. **Q, R, S, T** — servono uno schieramento dedicato.
10. **W** in console, una volta, alla fine.
11. **V**: conferma le quattro divergenze rimaste e le correzioni chiuse dalla
    revisione 5.

Segna ogni fallimento con: codice della prova, unità e stato, cosa hai letto,
cosa ti aspettavi. Col codice, chi riceve la segnalazione sa già quale riga di
quale file guardare.

E una cosa imparata in questi giorni, che vale anche al tavolo: quando un
numero non torna, **guarda prima il dato di prova**. In due settimane, di tutti
i rossi arrivati alle quattro chat, uno solo ha migliorato il codice — tutti
gli altri erano prove che misuravano la cosa sbagliata, o profili cercati nella
fazione sbagliata, o campi costruiti a mano più completi della realtà.
