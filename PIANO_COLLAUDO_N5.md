<!-- @versione 2026-10-15.1 | PIANO_COLLAUDO_N5.md | proprieta`: chat TEST -->

# Piano di collaudo — Calcolatore Infinity N5 (revisione 30)

Bozza scritta dalla chat MOTORE il 15 ottobre, su richiesta di Paolo, da far
adottare a TEST. Segue il motore **2026-10-15.1**, `motore_core.js`,
`ordine_attacco_bs.js`, `ordine_attacco_guidato.js`,
`ordine_attacco_intuitivo.js` e `ordine_fuoco_speculativo.js` **2026-10-15.1**,
i database **2026-10-15.1** e i file di INTERFACCIA **2026-10-15.1**.

Ogni prova dice **chi** agisce, **quale Ordine** dichiara, **con che cosa**,
**contro chi**, **a che distanza** (in pollici) e **cosa si deve leggere**. Dove
un dato non cambia il risultato è scelto comunque, così la prova si esegue senza
decidere niente al tavolo.

# 0. Come si legge una prova

```
CODICE — titolo
  Attivo:    unità (stato) · Ordine (1ª metà → 2ª metà)
  Con:       arma / programma
  Bersaglio: unità (stato), distanza, copertura sì/no
  ARO:       unità (stato) → reazione, arma, distanza, contro chi
  Atteso:    quello che devi leggere
```

**Le unità** si indicano col nome del profilo e il numero del roster
(*Nomadi #1*, *PanOceania #4*): il roster è nel capitolo 1.

**Le distanze** sono in pollici, nelle fasce del Weapon Chart: 0-8", 8-16",
16-24", 24-32", 32-40", 40-48" e così via. Sulla barra delle gittate della
schermata si tocca la casella della fascia indicata. **FUORI** è l'ultima
casella della barra.

**Tre convenzioni** valgono per tutte le prove:
1. **Stato non scritto = Normale.**
2. **Ordine scritto con una sola azione** = si dichiara quella e basta. Per un
   Ordine in due metà la prova scrive tutte e due (*MUOVERE → ATTACCO BS*).
3. **`ARO: nessuno`** vuol dire che il reattivo tocca **NESSUN ARO**. Non basta
   che resti fermo: l'Hub aspetta la risposta prima di calcolare, e senza
   risposta lo scontro non compare.

**Il valore che si legge** sul tabellone è il **Valore di Successo**: attributo
più tutti i MOD. Si tira 1d20 e serve **uguale o meno**. La salvezza si scrive
**ARM VS 8 ×1**: ARM (o BTS, o PH) più il PS dell'arma, un dado.

**Il conteggio.** Il piano contiene **284 prove, tutte nello stesso formato**:
tutte e 284, nelle stesse cinque righe; le convenzioni servono a non scrivere
la stessa riga 284 volte. I codici sono uno per prova: alla revisione 30 sono 284.
Prove con un campo da completare: 0 prove su 284
Il numero lo controlla `test_piano_schieramento.js`: non si cambia a mano.

**Se un numero non torna**, guarda prima la scheda ufficiale della miniatura e
il roster di prova, poi segnala: codice della prova, unità e stato, cosa hai
letto, cosa ti aspettavi.

---

# 1. Preparazione

## 1.1 Roster

**Nomadi**

| # | Profilo | Serve per |
|---|---|---|
| 1 | Alguacil (Combi Rifle) | BS base, gittate, reattivo di riferimento (PH 10, WIP 13) |
| 2 | Alguacil (HMG) | Burst 4, Coordinato |
| 3 | Alguacil (Missile Launcher) | Sagoma d'Impatto, EXP |
| 4 | Alguacil (Forward Observer) | Flash Pulse, Stato Bersagliato |
| 5 | Alguacil (Paramedic) | MediKit |
| 6 | Daktari (Doctor) | Dottore |
| 7 | Clockmaker (Engineer) | Ingegnere, GizmoKit(+1B) |
| 8 | Interventor (Hacker Plus) | Carbonite, Oblivion, Spotlight, Total Control, Cybermask |
| 9 | Zero (Hacker, Killer Hacking Device) | Trinity, Camo, Shock Mine |
| 10 | Intruder (MULTI Sniper Rifle) | MSV L2, `MULTI Sniper Rifle (+1SD)` |
| 11 | Grenzer (Marksmanship) | Marksmanship, MULTI Sniper Rifle |
| 12 | Grenzer (Forward Observer, Sensor, NCO) | MSV L1, Forward Observer, Sensor, Light Flamethrower(+1B) |
| 13 | Morlock (Assault Pistol) | Martial Arts L2, Chain Rifle, Smoke Grenades |
| 14 | Chimera | Natural Born Warrior, CC Attack (-3), Nanopulser |
| 15 | Reaktion Zond (HMG) | Total Reaction, REM, PARA CC Weapon |
| 16 | Mobile Brigada (HMG) | HI, ARM 5 |
| 17 | Puppetbot (Red Fury) | BS Attack (+1B), Dodge (+3) |
| 18 | Zondmate (REM) | PARA CC Weapon(-3) |
| 19 | Moran (Surprise Attack [-3], Camouflage [1 Use], Combi Rifle) | CrazyKoalas, D-Charges, Camouflage (1 Use) |
| 20 | Sin-Eater (MULTI Sniper Rifle) | Neurocinetics |
| 21 | Mary Problems (Hacker) | Pitcher, Zapper, upgrade di hacking, Climbing Plus |
| 22 | Puppet Masters (Minelayer) | Minelayer, Shock Mine |
| 23 | Kulak (Hacker, Killer Hacking Device) | Disco Baller, Cybermine |
| 24 | Intruder (HMG) | MSV L2, Camouflage, Heavy Machine Gun |
| 25 | Intruder (Hacker, Killer Hacking Device) | Grenades (Fuoco Speculativo), Pulzar(+1B), AP Submachine Gun |
| 26 | Wolfgang Amadeus | Berserk, Martial Arts L3 |
| 27 | Warcor (Sixth Sense) | Sesto Senso |
| 28 | Vertigo Zond (Missile Launcher) | BS Attack (Guided) |
| 29 | Spector (Parachutist, Combat Jump) | Schieramento Aereo, `Drop Bears (+1SD)` |
| 30 | Triphammer (Heavy Shotgun, Heavy Rocket Launcher, Panzerfaust) | `Panzerfaust (+1B)` |
| 31 | Krakot Renegade (Boarding Shotgun) | Chest Mine |
| 32 | Bambabot-1 (Chain Rifle (ps=6)) | Mine Dispenser (AP) |
| 33 | Saito Togan (T2 Boarding Shotgun) | munizione T2 |
| 34 | Go-Pod (MULTI Rifle) | E/Mitter |
| 35 | Racerbot Mk-I (Adhesive Launcher Rifle) | Adhesive Launcher Rifle |
| 36 | Morlock (Kobra Pistol, DA CC) | Kobra Pistol, Irregolare |
| 37 | Hawkwood (K1 Sniper Rifle) | ARM = 0 |
| 38 | **Marspider (Grenades)** | **nuova**: Grenades senza visore (TER-06) |
| 39 | **Clockmaker (Armed Turret)** | **nuova**: Armed Turret (DEP-11) |

**PanOceania**

| # | Profilo | Serve per |
|---|---|---|
| 1 | Fusilier (Combi Rifle) | bersaglio di riferimento (ARM 1, BTS 0, PH 10, BS 12) |
| 2 | Fusilier (Missile Launcher) | secondo bersaglio, ARO con arma pesante |
| 3 | Fusilier (Forward Observer) | Flash Pulse in ARO |
| 4 | Orc (Hacker, Hacking Device) | hackerabile, ARM 4, BTS 3, PH 14, MULTI Rifle |
| 5 | Nisse (Heavy Machine Gun) | Mimetismo -3, ARM 3 |
| 6 | Croc Man (MULTI Sniper Rifle) | Camo, Mimetismo -6, X Visor, Hidden Deployment |
| 7 | Teutonic Knight (TinBot: Firewall) | Firewall -3, Martial Arts L2, Panzerfaust |
| 8 | Tikbalang | TAG, ECM (Guided -6) |
| 9 | Sierra Dronbot (Heavy Machine Gun) | Total Reaction in ARO |
| 10 | Zulu-Cobra (Triangulated Fire, Sensor) | Camo, Mimetismo -3, Triangulated Fire |
| 11 | Aquila | MSV L3, ECM (Hacking -3) |
| 12 | Squalo Mk-II (MULTI Marksman Rifle) | Combat Instinct, TAG |
| 13 | Machinist (Combi Rifle) | Deployable Cover, GizmoKit senza notazione |
| 14 | Dr. Harper FTO | No Cover, No Wound Incapacitation, Plasma Carbine |
| 15 | Swiss Guard (Heavy Machine Gun, Pulzar) | Mimetismo -6 |
| 16 | **Laxmee (Hacker)** | **nuova**: Fairy Dust (HK-07) |

## 1.2 Terreni

In schieramento: **TER_10 Bosco**, **TER_11 Giungla**, **TER_13 Foresta
Primordiale**, **TER_15 Tempesta**, **TER_17 Sala Generatori**. Senza, il blocco
T non è eseguibile.

---

# 2. Preflight — una volta, in console, su app.html

**PRE-01 — Contratto del motore**
- **Attivo:** in console `MotoreN5.autotest()`
- **Atteso:** `["contratto coerente"]`

**PRE-02 — Router**
- **Attivo:** in console `verificaRouter()`
- **Atteso:** `["router coerente col motore"]`. Un *modulo NON CARICATO* vuol dire uno `<script>` mancante in `app.html`

**PRE-03 — Dati**
- **Attivo:** in console `MotoreN5.verificaDati()`
- **Atteso:** `{ok:true, mancanti:[], firme:[]}`

**PRE-04 — Versioni**
- **Attivo:** in console `MotoreN5.verificaVersioni()`
- **Atteso:** nessun disallineamento

**PRE-05 — Dati mancanti**
- **Attivo:** in console `MotoreN5.datiMancanti()`
- **Atteso:** array vuoto

**PRE-06 — Ordini nascosti**
- **Attivo:** in console `riepilogaOrdiniNascosti()`
- **Atteso:** vuoto

**PRE-07 — Impronta**
- **Attivo:** in console `MotoreN5.improntaProgetto()`
- **Atteso:** annotala: serve per citare i file alle altre chat

**PRE-08 — Console pulita**
- **Attivo:** ricarica la pagina e guarda la console
- **Atteso:** nessun `⛔`, nessun *modulo mancante*

**PRE-09 — Immagini**
- **Attivo:** guarda la console per errori sulle immagini
- **Atteso:** nessuno. Le cartelle `img/`, `img/nomadi/`, `img/panoceania/` e `img/programmi/` stanno accanto ad `app.html`

Se PRE-01 o PRE-02 falliscono, fermati.

---

# 3. Blocco A — Ordini senza tiro e generazione ARO

**A-01 — Movimento semplice**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* · MUOVERE → MUOVERE
- **ARO:** nessuno
- **Atteso:** nessun calcolo, Ordine intero consumato, **ARO generato**.

**A-02 — Movimento + attacco**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* · MUOVERE → ATTACCO BS
- **Con:** Combi Rifle
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)*, a 0-8", senza copertura
- **ARO:** nessuno
- **Atteso:** la prima metà non chiede nulla; il calcolo parte sulla seconda: **BS 14** (11 +3) **B3**, salvezza del Fusilier **ARM VS 8 ×1**.

**A-03 — Cauto: la domanda viene prima**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* · MOVIMENTO CAUTO
- **ARO:** nessuno
- **Atteso:** prima di rispondere non parte niente: nessun allarme, nessuna busta all'Hub. A schermo due tasti, *fuori da LoF e ZdC* e *dentro*. Rispondendo **dentro**: allarme spedito, ARO generato, una busta sola.

**A-04 — Cauto fuori da LoF e ZdC**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* · MOVIMENTO CAUTO, rispondendo **fuori da LoF e ZdC**; poi un secondo MOVIMENTO CAUTO
- **ARO:** nessuno
- **Atteso:** **nessun allarme**, con il motivo; la busta all'Hub parte lo stesso. Il secondo Cauto **richiede di nuovo** la risposta: non eredita quella del primo.

**A-05 — Cauto negato**
- **Attivo:** apri il menu degli Ordini di Reaktion Zond (HMG) *(Nomadi #15)*, Zondmate (REM) *(Nomadi #18)* e Alguacil (Combi Rifle) *(Nomadi #1)* messo **Bersagliato** dall'editor degli stati
- **Atteso:** MOVIMENTO CAUTO **non compare** per nessuno dei tre (REM; AI Motorcycle; Bersagliato).

**A-06 — Idle**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* · IDLE
- **ARO:** nessuno
- **Atteso:** nessuna azione, ma **ARO generato**.

**A-07 — Requisito non soddisfatto → Idle**
- **Attivo:** Moran *(Nomadi #19)*, schierato come Marker CAMO · PIAZZARE EQUIPAGGIAMENTO, rispondendo **sì** a *«c'è un Marker nemico nell'Area d'Innesco?»*
- **Con:** CrazyKoalas
- **ARO:** nessuno
- **Atteso:** il tasto diventa **IDLE** giallo. Premendolo: **ARO generato**, **uso del CrazyKoala speso** (1 su 2), e il Moran **si rivela** (da Marker a Modello).

**A-08 — Salto**
- **Attivo:** Morlock (Assault Pistol) *(Nomadi #13)* · SALTO
- **ARO:** nessuno
- **Atteso:** nessun calcolo, ARO generato, **Ordine intero** consumato.

**A-09 — Climbing Plus**
- **Attivo:** Mary Problems (Hacker) *(Nomadi #21, Climbing Plus)* · ARRAMPICARSI; poi Alguacil (Combi Rifle) *(Nomadi #1)* · ARRAMPICARSI
- **ARO:** nessuno
- **Atteso:** per Mary Problems l'arrampicata è **mezzo Ordine** e resta la seconda metà; per l'Alguacil è un **Ordine intero**.

**A-10 — Nessuna voce senza modulo**
- **Attivo:** Grenzer (Forward Observer, Sensor, NCO) *(Nomadi #12)*: apri il menu degli Ordini e tocca ogni voce, una per una, tornando indietro ogni volta
- **Atteso:** ogni voce apre la sua schermata. Nessuna risponde *«Azione non riconosciuta»*.

**A-11 — Voci che devono mancare**
- **Attivo:** apri il menu degli Ordini di queste truppe
- **Atteso:**
  - **FUOCO DI SOPPRESSIONE** non c'è su Morlock (Assault Pistol) *(#13)*; c'è su Alguacil (Combi Rifle) *(#1)*.
  - **HACKING** c'è solo sugli hacker: Interventor *(#8)* sì, Alguacil *(#1)* no. Mary Problems *(#21)*, con due dispositivi, vede Trinity, Carbonite, Oblivion, Spotlight e Total Control.
  - **SUPPORTO (MED / ING)** c'è su Daktari *(#6)*, Alguacil (Paramedic) *(#5)* e Clockmaker *(#7)*; non su Alguacil (Combi Rifle) *(#1)*.
  - **PIAZZARE EQUIPAGGIAMENTO** c'è su Moran *(#19)*, Zero *(#9)*, Puppet Masters *(#22)* e Kulak *(#23)*; non su Krakot *(#31)* né su Bambabot-1 *(#32)*.

**A-12 — Io muovo, tu mi spari**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* · MUOVERE → MUOVERE
- **ARO:** Fusilier (Combi Rifle) *(PanOceania #1)* → ATTACCO BS, Combi Rifle, a 8-16", contro l'Alguacil
- **Atteso:** **TIRO NORMALE**, un solo scontro. Il Fusilier tira **15** con **un dado**, l'Alguacil non oppone niente e, se colpito, fa **ARM VS 8 ×1**. Il Fusilier compare sotto **PanOceania**.

**A-13 — Lo stesso con gli altri Ordini senza tiro**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* · tre Ordini, uno alla volta: MOVIMENTO CAUTO (risposta *dentro*), SALTO, IDLE
- **ARO:** Fusilier (Combi Rifle) *(PanOceania #1)* → ATTACCO BS, Combi Rifle, a 8-16", contro l'Alguacil
- **Atteso:** in tutti e tre l'avversario riceve l'allarme e il tiro del Fusilier compare (**15**, B1).

**A-14 — Ordine Intero: dopo l'ARO si va al calcolo da soli** *(nuova)*
- **Attivo:** Intruder (Hacker, Killer Hacking Device) *(Nomadi #25)* · FUOCO SPECULATIVO; poi Morlock (Assault Pistol) *(Nomadi #13)* · ATTACCO INTUITIVO
- **Con:** Grenades; Chain Rifle
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)*, a 0-8"; per l'Intuitivo Zulu-Cobra *(PanOceania #10)* in Camo
- **ARO:** nessuno
- **Atteso:** dopo la conferma dei bersagli compare *IN ATTESA DI ARO*. Appena il reattivo tocca NESSUN ARO l'app passa **da sola** alla pagina del calcolo. Il tasto *«ABILITÀ LUNGA DICHIARATA (Procedi al calcolo)»* **non compare**. Controprova: con MUOVERE → … dopo l'ARO si sceglie ancora la seconda metà.

---

# 4. Blocco B — Attacco BS

**BS-01 — Faccia a Faccia**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* · ATTACCO BS
- **Con:** Combi Rifle
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)*, a 0-8", senza copertura
- **ARO:** Fusilier (Combi Rifle) → ATTACCO BS, Combi Rifle, a 0-8", contro l'Alguacil
- **Atteso:** **un solo scontro**, FACCIA A FACCIA. Attivo **14** B3, reattivo **15** B1. Salvezza Fusilier **ARM VS 8 ×1**; salvezza Alguacil **ARM VS 8 ×1**. Due scontri con due Tiri Normali sono un difetto.

**BS-02 — Reagisce chi non è bersaglio**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* · ATTACCO BS
- **Con:** Combi Rifle
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)*, a 0-8", senza copertura
- **ARO:** il Fusilier #1 tocca NESSUN ARO; Fusilier (Missile Launcher) *(PanOceania #2)*, che **non** è bersaglio, → ATTACCO BS, Missile Launcher (Hit Mode), a 0-8", contro l'Alguacil
- **Atteso:** **due scontri**, tutti e due **TIRO NORMALE**. Alguacil contro Fusilier #1: **14** B3, salvezza **ARM VS 8 ×1**. Fusilier ML contro Alguacil: **9** B1 (12 −3), salvezza dell'Alguacil **ARM VS 6 ×3**, con la nota *«reagisce senza essere bersaglio dell'attacco: il suo è un Tiro Normale a sé»*.

**BS-03 — Gittata negativa e copertura, contro Schivata**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* · ATTACCO BS
- **Con:** Combi Rifle
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)*, a 16-24", **in copertura**
- **ARO:** Fusilier → SCHIVATA
- **Atteso:** F2F. Attivo **5** (11 −3 −3) B3, reattivo **PH 10** B1. Salvezza Fusilier **ARM VS 11 ×1**.

**BS-04 — Mimetismo senza visore**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* · ATTACCO BS
- **Con:** Combi Rifle
- **Bersaglio:** Zulu-Cobra (Triangulated Fire, Sensor) *(PanOceania #10)*, **schierato come Modello** (non in Camo), a 8-16", senza copertura
- **ARO:** nessuno
- **Atteso:** **11** (11 +3 −3 di Mimetismo).

**BS-05 — MSV L1 contro Mimetismo −3**
- **Attivo:** Grenzer (Forward Observer, Sensor, NCO) *(Nomadi #12, MSV L1)* · ATTACCO BS
- **Con:** Combi Rifle
- **Bersaglio:** Zulu-Cobra *(PanOceania #10)* come Modello, a 8-16", senza copertura
- **ARO:** nessuno
- **Atteso:** **16** (13 +3), con la nota che il visore annulla il Mimetismo.

**BS-06 — Mimetismo −6 e copertura**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* · ATTACCO BS
- **Con:** Combi Rifle
- **Bersaglio:** Croc Man (MULTI Sniper Rifle) *(PanOceania #6)*, **schierato come Modello**, a 8-16", **in copertura**
- **ARO:** nessuno
- **Atteso:** **5** (11 +3 −3 −6), salvezza **ARM VS 11 ×1**. Controprova: col Croc Man schierato come Marker CAMO l'Attacco BS è rifiutato e l'avviso dice *«va Scoperto prima, oppure usa un Attacco Intuitivo»*.

**BS-07 — MSV L2 annulla il Mimetismo −6**
- **Attivo:** Intruder (HMG) *(Nomadi #24)* · ATTACCO BS
- **Con:** Heavy Machine Gun
- **Bersaglio:** Croc Man *(PanOceania #6)* come Modello, a 16-24", **in copertura**
- **ARO:** nessuno
- **Atteso:** **13** (13 +3 −3) B4, con la nota *«Multispectral Visor L2+: il Mimetismo (−6) non si applica»*.

**BS-08 — X Visor su una fascia negativa**
- **Attivo:** Croc Man (MULTI Sniper Rifle) *(PanOceania #6, BS 12, X Visor)* · ATTACCO BS
- **Con:** MULTI Sniper Rifle, munizione **AP** (B2)
- **Bersaglio:** Alguacil (Combi Rifle) *(Nomadi #1)*, a 0-8", senza copertura
- **ARO:** nessuno
- **Atteso:** la voce della gittata **non compare**, totale **12**.

**BS-09 — L'X Visor toglie il malus, non crea un bonus**
- **Attivo:** Croc Man *(PanOceania #6)* · ATTACCO BS
- **Con:** MULTI Sniper Rifle, munizione AP
- **Bersaglio:** Alguacil (Combi Rifle) *(Nomadi #1)*, a 48-56", senza copertura; poi a 24-32"
- **Atteso:** a 48-56" **12**, non 15; a 24-32" **15** (+3 vero).

**BS-10 — Senza X Visor la stessa fascia vale −3**
- **Attivo:** Nisse (Heavy Machine Gun) *(PanOceania #5, BS 13)* · ATTACCO BS
- **Con:** Heavy Machine Gun
- **Bersaglio:** Alguacil (Combi Rifle) *(Nomadi #1)*, a 0-8", senza copertura
- **ARO:** nessuno
- **Atteso:** voce *«Gittata: −3»*, totale **10**.

**BS-11 — Marksmanship ignora la copertura**
- **Attivo:** Grenzer (Marksmanship) *(Nomadi #11)* · ATTACCO BS
- **Con:** MULTI Sniper Rifle, munizione AP
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)*, a 24-32", **in copertura**
- **ARO:** nessuno
- **Atteso:** **16** (13 +3), con la nota del Marksmanship. La salvezza resta **ARM VS 9 ×1**: la copertura vale sull'ARM.

**BS-12 — Stato Bersagliato**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* · ATTACCO BS
- **Con:** Combi Rifle
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)*, **Bersagliato**, a 0-8", senza copertura
- **ARO:** nessuno
- **Atteso:** **17** (11 +3 +3).

**BS-13 — Bersaglio in Soppressione entro 24"**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* · ATTACCO BS
- **Con:** Combi Rifle
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)*, **in Soppressione**, a 0-8", senza copertura
- **ARO:** Fusilier → ATTACCO BS, Combi Rifle, a 0-8", contro l'Alguacil
- **Atteso:** attivo **11** (11 +3 −3 della Soppressione). Il Fusilier reagisce col profilo **Combi Rifle (SF Mode)**: Burst **3**, fasce 0 / 0 / −3, gittata massima 24", avviso **A98**. Burst 1 è un difetto.

**BS-14 — Soppressione oltre le 24"**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* · ATTACCO BS
- **Con:** Combi Rifle
- **Bersaglio:** Fusilier *(PanOceania #1)*, in Soppressione, a 24-32", senza copertura
- **ARO:** nessuno
- **Atteso:** **8** (11 −3 di gittata); il −3 della Soppressione **non** c'è.

**BS-15 — Attaccante Stordito**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)*, **Stordito** · apri il menu degli Ordini
- **Atteso:** ATTACCO BS **non compare**. Controprova: senza lo stato compare.

**BS-16 — Total Reaction**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* · MUOVERE → MUOVERE
- **ARO:** Sierra Dronbot (Heavy Machine Gun) *(PanOceania #9)* → ATTACCO BS, Heavy Machine Gun, a 8-16", contro l'Alguacil
- **Atteso:** Burst **4**, con le voci *«In Turno Reattivo il Burst è 1»* e *«Total Reaction: Burst pieno dell'arma in ARO»*.

**BS-17 — Il (+1B) non vale in ARO**
- **Attivo:** Fusilier (Combi Rifle) *(PanOceania #1)* · MUOVERE → MUOVERE
- **ARO:** Puppetbot (Red Fury) *(Nomadi #17)* → ATTACCO BS, Red Fury, a 8-16", contro il Fusilier
- **Atteso:** Burst **1**, con la sola voce *«In Turno Reattivo il Burst è 1»*.

**BS-18 — Il (+1B) vale in attivo**
- **Attivo:** Puppetbot (Red Fury) *(Nomadi #17)* · ATTACCO BS
- **Con:** Red Fury
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)*, a 8-16", senza copertura
- **ARO:** nessuno
- **Atteso:** Burst **5** (4 +1), con le voci *«Burst dell'arma Red Fury»* e *«BS Attack (+1B): +1 Burst in Turno Attivo»*. Tiro **15**.

**BS-19 — Burst su due bersagli**
- **Attivo:** Alguacil (HMG) *(Nomadi #2)* · ATTACCO BS
- **Con:** Heavy Machine Gun
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)* con **2** dadi e Orc (Hacker, Hacking Device) *(PanOceania #4)* con **2** dadi, tutti e due a 16-24", senza copertura
- **ARO:** nessuno
- **Atteso:** due scontri, 2 + 2 dadi. Salvezze: Fusilier **ARM VS 6**, Orc **ARM VS 9**.

**BS-20 — ARM alto**
- **Attivo:** Mobile Brigada (HMG) *(Nomadi #16)* · ATTACCO BS
- **Con:** Heavy Machine Gun
- **Bersaglio:** Orc (Hacker, Hacking Device) *(PanOceania #4)*, a 0-8", senza copertura
- **ARO:** Orc → ATTACCO BS, MULTI Rifle munizione AP, a 0-8", contro la Mobile Brigada
- **Atteso:** F2F. Attivo **10** (13 −3) B4, reattivo **17** (14 +3) B1. Salvezza Orc **ARM VS 9 ×1**, salvezza Mobile Brigada **ARM VS 10 ×1**.

**BS-21 — Tiro dentro una mischia**
- **Attivo:** Intruder (HMG) *(Nomadi #24)* · ATTACCO BS
- **Con:** Heavy Machine Gun
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)*, **Ingaggiato**, a 16-24", senza copertura. Alla domanda *«quanti TUOI alleati in quella mischia»* tocca **1**
- **ARO:** nessuno
- **Atteso:** **10** (13 +3 −6), voci *«Gittata: +3»* e *«Tiro dentro una mischia: −6»*.

**BS-22 — Il tetto dei MOD**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* · ATTACCO BS
- **Con:** Combi Rifle
- **Bersaglio:** Swiss Guard (Heavy Machine Gun, Pulzar) *(PanOceania #15)*, come Modello, a 32-40", **in copertura**
- **ARO:** nessuno
- **Atteso:** gittata −6, copertura −3, Mimetismo −6, più la voce *«MOD minimo −12»* (+3): **MOD −12**, Valore −1, **fallimento automatico**. Variante a 16-24": −3 −3 −6 = −12 esatti, fallimento automatico, **senza** la voce del tetto.

**BS-23 — No Cover**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* · ATTACCO BS
- **Con:** Combi Rifle
- **Bersaglio:** Dr. Harper FTO *(PanOceania #14)*, a 0-8", dichiarato **in copertura**
- **ARO:** nessuno
- **Atteso:** niente −3 al tiro, niente +3 all'ARM: tiro **14**, salvezza **ARM VS 8 ×1**.

**BS-24 — Limited Cover**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* · ATTACCO BS
- **Con:** Combi Rifle
- **Bersaglio:** Teutonic Knight (TinBot: Firewall) *(PanOceania #7, Limited Cover)*, a 0-8", **in copertura**
- **ARO:** nessuno
- **Atteso:** cade il −3 al tiro, resta il +3 all'ARM: tiro **14**, salvezza **ARM VS 13 ×1** (ARM 3 +3 +7).

**BS-25 — Combat Instinct**
- **Attivo:** Intruder (HMG) *(Nomadi #24)*, schierato come Marker CAMO · ATTACCO BS (si rivela attaccando)
- **Con:** Heavy Machine Gun
- **Bersaglio:** Squalo Mk-II (MULTI Marksman Rifle) *(PanOceania #12)*, a 16-24", senza copertura
- **ARO:** Squalo → ATTACCO BS, MULTI Marksman Rifle munizione AP, a 16-24", contro l'Intruder
- **Atteso:** lo Squalo tira **15** (15 +3 −3), con **due** voci soltanto: *«Gittata: +3»* e *«Mimetismo del bersaglio: −3»*. Il −3 dell'Attacco a Sorpresa **non** c'è.

**BS-26 — Neurocinetics**
- **Attivo:** Sin-Eater (MULTI Sniper Rifle) *(Nomadi #20)* · ATTACCO BS
- **Con:** MULTI Sniper Rifle, munizione AP
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)*, a 16-24", senza copertura
- **ARO:** nessuno
- **Atteso:** in attivo Burst **1**, con la voce *«Neurocinetics: Burst 1 in Turno Attivo»*. Poi a parti invertite (Fusilier #1 · MUOVERE → MUOVERE, Sin-Eater in ARO con la stessa arma a 16-24"): Burst **2**, con la voce *«Neurocinetics: Burst pieno dell'arma in ARO»*.

**BS-27 — Un bottone per arma, la modalità nella tendina** *(nuova)*
- **Attivo:** Grenzer (Marksmanship) *(Nomadi #11)* · ATTACCO BS
- **Con:** MULTI Sniper Rifle
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)*, a 24-32", senza copertura
- **ARO:** nessuno
- **Atteso:** nella scelta dell'arma c'è **un solo** bottone MULTI Sniper Rifle. Nella pagina della gittata la tendina accanto al bersaglio offre *«Munizioni: AP · B2»*, *«Munizioni: SHOCK · B2»* e *«Munizioni: DA · B2»*. Scegliendo DA i dadi si riassegnano e la salvezza diventa **ARM VS 6 ×2**.
- **Lo stesso per le armi a Sagoma e a gittata:** Alguacil (Missile Launcher) *(Nomadi #3)* ha **un** bottone Missile Launcher; la tendina offre *«Munizioni: EXP · B1 · Sagoma d'Impatto»* e *«Munizioni: AP+EXP · B1»*, e tutte e due hanno la barra delle gittate.

---

# 5. Blocco C — Munizioni e Tiri Salvezza

Bersagli di riferimento: **Fusilier (Combi Rifle)** *(PanOceania #1: ARM 1, BTS
0, PH 10)* e **Orc (Hacker, Hacking Device)** *(PanOceania #4: ARM 4, BTS 3, PH
14)*. Per ogni prova si fa un ATTACCO BS sul Fusilier e poi uno sull'Orc, a
**0-8"**, **senza copertura**, `ARO: nessuno`, salvo dove scritto.

**MU-01 — Combi Rifle (N)**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* · ATTACCO BS
- **Con:** Combi Rifle, munizione N
- **Atteso:** Fusilier **ARM VS 8 ×1**; Orc **ARM VS 11 ×1**. Un Critico aggiunge una salvezza.

**MU-02 — AP Submachine Gun (AP)**
- **Attivo:** Intruder (Hacker, Killer Hacking Device) *(Nomadi #25)* · ATTACCO BS
- **Con:** AP Submachine Gun, munizione AP
- **Atteso:** Fusilier **ARM VS 8 ×1**; Orc **ARM VS 9 ×1** (ARM dimezzato).

**MU-03 — Missile Launcher, Sagoma d'Impatto (EXP)**
- **Attivo:** Alguacil (Missile Launcher) *(Nomadi #3)* · ATTACCO BS
- **Con:** Missile Launcher, nella tendina *«Munizioni: EXP · B1 · Sagoma d'Impatto»*
- **Atteso:** Fusilier **ARM VS 7 ×3**; Orc **ARM VS 10 ×3**.

**MU-04 — Missile Launcher, colpo diretto (AP+EXP)**
- **Attivo:** Alguacil (Missile Launcher) *(Nomadi #3)* · ATTACCO BS
- **Con:** Missile Launcher, nella tendina *«Munizioni: AP+EXP · B1»*
- **Atteso:** Fusilier **ARM VS 7 ×3**; Orc **ARM VS 8 ×3** (dimezza e tre tiri).

**MU-05 — Red Fury (SHOCK)**
- **Attivo:** Puppetbot (Red Fury) *(Nomadi #17)* · ATTACCO BS
- **Con:** Red Fury, munizione SHOCK
- **Atteso:** Fusilier **ARM VS 8 ×1**; Orc **ARM VS 11 ×1**. La nota dice che una truppa a VITA 1 che diventa Incosciente passa a Morto.

**MU-06 — DA CC Weapon (DA)**
- **Attivo:** Teutonic Knight (TinBot: Firewall) *(PanOceania #7)* · ATTACCO CC
- **Con:** DA CC Weapon(PS=5)
- **Bersaglio:** Alguacil (Combi Rifle) *(Nomadi #1, ARM 1)*, poi Mobile Brigada (HMG) *(Nomadi #16, ARM 5)*
- **Atteso:** Alguacil **ARM VS 6 ×2**; Mobile Brigada **ARM VS 10 ×2**.

**MU-07 — T2 Boarding Shotgun (T2)**
- **Attivo:** Saito Togan (T2 Boarding Shotgun) *(Nomadi #33)* · ATTACCO BS
- **Con:** T2 Boarding Shotgun, munizione T2
- **Atteso:** Fusilier **ARM VS 7 ×1**; Orc **ARM VS 10 ×1**. Ogni salvezza fallita = **2 Ferite**.

**MU-08 — E/Mitter (E/M)**
- **Attivo:** Go-Pod (MULTI Rifle) *(Nomadi #34)* · ATTACCO BS
- **Con:** E/Mitter, munizione E/M
- **Bersaglio:** Fusilier e Orc a **8-16"** (l'E/Mitter a 0-8" ha −3)
- **Atteso:** Fusilier **BTS VS 7 ×2**; Orc **BTS VS 9 ×2**. Fallita: Isolato.

**MU-09 — PARA CC Weapon (PARA)**
- **Attivo:** Reaktion Zond (HMG) *(Nomadi #15)* · ATTACCO CC
- **Con:** PARA CC Weapon(-3)
- **Atteso:** Fusilier **PH VS 4 ×1**; Orc **PH VS 8 ×1** (PH −6). Nessuna Ferita: Immobilizzato-A.

**MU-10 — Adhesive Launcher Rifle**
- **Attivo:** Racerbot Mk-I (Adhesive Launcher Rifle) *(Nomadi #35)* · ATTACCO BS
- **Con:** Adhesive Launcher Rifle
- **Bersaglio:** Fusilier e Orc a **8-16"**
- **Atteso:** Fusilier **PH VS 4 ×1**; Orc **PH VS 8 ×1**. Nessuna Ferita: Immobilizzato-A.

**MU-11 — Flash Pulse (STUN)**
- **Attivo:** Alguacil (Forward Observer) *(Nomadi #4)* · ATTACCO BS
- **Con:** Flash Pulse
- **Bersaglio:** Fusilier e Orc a **8-16"**
- **Atteso:** tiro su **WIP** (13 +3 = 16). Fusilier **BTS VS 7 ×1**; Orc **BTS VS 10 ×1**.

**MU-12 — Nanopulser**
- **Attivo:** Chimera *(Nomadi #14)* · ATTACCO BS
- **Con:** Nanopulser
- **Atteso:** colpo automatico (Sagoma Diretta). Fusilier **BTS VS 7 ×1**; Orc **BTS VS 10 ×1**: l'arma tira su BTS.

**MU-13 — Smoke Grenades**
- **Attivo:** Morlock (Assault Pistol) *(Nomadi #13)* · FUOCO SPECULATIVO
- **Con:** Smoke Grenades
- **Bersaglio:** un punto del tavolo a 0-8" vicino al Fusilier
- **Atteso:** **nessuna** salvezza, nessuna domanda sugli alleati sotto la Sagoma.

**MU-14 — Panzerfaust (AP+EXP)**
- **Attivo:** Teutonic Knight (TinBot: Firewall) *(PanOceania #7)* · ATTACCO BS
- **Con:** Panzerfaust
- **Bersaglio:** Alguacil (Combi Rifle) *(Nomadi #1)*, poi Mobile Brigada (HMG) *(Nomadi #16)*, a 8-16"
- **Atteso:** tiro **13** B1. Alguacil **ARM VS 6 ×3**; Mobile Brigada **ARM VS 9 ×3**. Uso Disposable scalato: 1 su 2.

**MU-15 — Copertura sulla salvezza**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* · ATTACCO BS
- **Con:** Combi Rifle
- **Bersaglio:** Fusilier *(PanOceania #1)*, a 0-8", **in copertura**
- **Atteso:** **ARM VS 11 ×1**.

**MU-16 — Lo Speculativo non dà il +3 di copertura alla salvezza**
- **Attivo:** Intruder (Hacker, Killer Hacking Device) *(Nomadi #25)* · FUOCO SPECULATIVO
- **Con:** Grenades
- **Bersaglio:** Fusilier *(PanOceania #1)*, a 0-8", **in copertura**
- **Atteso:** tiro su **PH 9** (12 +3 −6). Salvezza **ARM VS 8 ×1**: il +3 della copertura non c'è.

**MU-17 — Munizioni N3** *(in console)*
- **Attivo:** in console, `MotoreN5.tiroSalvezza` sul Fusilier #1 con il Combi Rifle e la munizione forzata, una alla volta: VIRAL, BREAKER, K1, PLASMA, NANOTECH, ADHESIVE, FLASH, MONOFILAMENT, BIOWEAPON
- **Atteso:** per tutte e nove l'avviso **A50** *(«Munizione "X" non esiste in N5 (era N3)»)* e il calcolo non si ferma. La BREAKER ne porta due: A50 e **A53**.

**MU-18 — Munizione sconosciuta** *(in console)*
- **Attivo:** come MU-17, con la munizione **FUFFA**, poi **AP+FUFFA**
- **Atteso:** FUFFA: **A51** e **A52**, nessun numero inventato. AP+FUFFA: **A51** e **A53**.

**MU-19 — Tiro Salvezza combinato**
- **Attivo:** Dr. Harper FTO *(PanOceania #14)* · ATTACCO BS
- **Con:** Plasma Carbine, nella tendina la modalità a Sagoma (Blast), poi quella senza Sagoma (Hit)
- **Bersaglio:** Alguacil (Combi Rifle) *(Nomadi #1, ARM 1, BTS 0)*, a 0-8", senza copertura
- **Atteso:** Blast: **ARM VS 8** e **BTS VS 7**, descritte come Tiro Salvezza Combinato. Hit: **ARM VS 7** e **BTS VS 6**.

**MU-20 — Kobra Pistol, due modalità**
- **Attivo:** Morlock (Kobra Pistol, DA CC) *(Nomadi #36)* · ATTACCO BS, poi ATTACCO CC
- **Con:** Kobra Pistol (BS Mode); Kobra Pistol (CC Mode)
- **Bersaglio:** Fusilier *(PanOceania #1)*, a 0-8", senza copertura (in CC: a contatto)
- **Atteso:** BS Mode: munizione **SHOCK**, Burst 2, **una** salvezza (**ARM VS 8 ×1**). CC Mode: munizione **DA**, Burst 1, **due** salvezze (**ARM VS 8 ×2**), Tratto Anti-materiel. Nell'ATTACCO BS il Morlock ha esattamente Chain Rifle, Smoke Grenades e Kobra Pistol (BS Mode); la CC Mode è fra le escluse col motivo.

**MU-21 — BioWeapon condizionale**
- **Attivo:** Chimera *(Nomadi #14)* · ATTACCO CC
- **Con:** Viral CC Weapon(PS=6)
- **Bersaglio:** Fusilier *(PanOceania #1, VITA)*, poi Tikbalang *(PanOceania #8, STR)*
- **Atteso:** Fusilier **BTS VS 6** con la nota *«Bersaglio con VITA: si applica la combinazione DA+Shock»*; Tikbalang **BTS VS 12** con la nota *«Bersaglio senza VITA: il BioWeapon non lo potenzia»*.

**MU-22 — ARM = 0**
- **Attivo:** Hawkwood (K1 Sniper Rifle) *(Nomadi #37)* · ATTACCO BS; poi Alguacil (Combi Rifle) *(Nomadi #1)* sullo stesso bersaglio
- **Con:** K1 Sniper Rifle; Combi Rifle
- **Bersaglio:** Nisse (Heavy Machine Gun) *(PanOceania #5, ARM 3)*, a 16-24", senza copertura
- **Atteso:** K1 → **ARM VS 7** (vale solo il PS); Combi → **ARM VS 10**. Il tiro salvezza c'è comunque.

---

# 6. Blocco D — Sagome

**TPL-01 — Sagoma Diretta: colpo automatico**
- **Attivo:** Morlock (Assault Pistol) *(Nomadi #13)* · ATTACCO BS
- **Con:** Chain Rifle
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)* sotto la Sagoma, *BERSAGLIO SOTTO LA SAGOMA*
- **ARO:** Fusilier → SCHIVATA, con LoF
- **Atteso:** **TIRO NORMALE**: attivo **Auto**, reattivo **PH 10**, salvezza Fusilier **ARM VS 8 ×1**. Nota: chi è colpito da una Sagoma non prende il +3 di copertura.

**TPL-02 — Continuous Damage**
- **Attivo:** Grenzer (Forward Observer, Sensor, NCO) *(Nomadi #12)* · ATTACCO BS
- **Con:** Light Flamethrower(+1B)
- **Bersaglio:** Orc (Hacker, Hacking Device) *(PanOceania #4)*, preso da **1** Sagoma
- **ARO:** nessuno
- **Atteso:** colpo automatico, **ARM VS 11 ×1**, e la nota che le salvezze si ripetono finché una non riesce.

**TPL-03 — Sagoma che colpisce il BTS**
- **Attivo:** Intruder (Hacker, Killer Hacking Device) *(Nomadi #25)* · ATTACCO BS
- **Con:** Pulzar(+1B)
- **Bersaglio:** Orc *(PanOceania #4)*, preso da **1** Sagoma
- **ARO:** nessuno
- **Atteso:** colpo automatico, **BTS VS 10 ×1**.

**TPL-04 — Sagoma d'Impatto: il tiro serve**
- **Attivo:** Alguacil (Missile Launcher) *(Nomadi #3)* · ATTACCO BS
- **Con:** Missile Launcher, nella tendina *«Munizioni: EXP · B1 · Sagoma d'Impatto»*
- **Bersaglio:** Orc (Hacker, Hacking Device) *(PanOceania #4)*, a 24-32", senza copertura
- **ARO:** Orc → ATTACCO BS, MULTI Rifle munizione AP, a 24-32", contro l'Alguacil
- **Atteso:** **F2F**, non "Auto". Attivo **14** (11 +3) B1; reattivo **11** (14 −3) B1. Salvezza Orc **ARM VS 10 ×3**; salvezza Alguacil **ARM VS 8 ×1**.

**TPL-05 — Schivata senza LoF contro una Sagoma**
- **Attivo:** Morlock (Assault Pistol) *(Nomadi #13)* · ATTACCO BS
- **Con:** Chain Rifle
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)* sotto la Sagoma
- **ARO:** Fusilier → SCHIVATA **senza LoF** verso il Morlock; poi la stessa prova **con LoF**
- **Atteso:** la Schivata è **sempre concessa** contro una Sagoma, con la nota. Senza LoF **PH 7** (10 −3); con LoF **PH 10**.

**TPL-06 — Critico solo sul Principale**
- **Attivo:** Alguacil (Missile Launcher) *(Nomadi #3)* · ATTACCO BS
- **Con:** Missile Launcher, Sagoma d'Impatto
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)* come primo bersaglio, Fusilier (Missile Launcher) *(PanOceania #2)* come secondo, tutti e due a 16-24", senza copertura
- **ARO:** nessuno
- **Atteso:** due scontri. Il primo porta la nota *«Questo è il Bersaglio Principale»*, il secondo *«Questo è un bersaglio secondario»*. Il Critico vale come Critico **solo** sul Principale.

**TPL-07 — Una Sagoma, due bersagli**
- **Attivo:** Grenzer (Forward Observer, Sensor, NCO) *(Nomadi #12)* · ATTACCO BS
- **Con:** Light Flamethrower(+1B) — Burst 2, cioè **2 Sagome**
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)* e Orc (Hacker, Hacking Device) *(PanOceania #4)*, **1 Sagoma** ciascuno (tocca **−** sul Fusilier, che parte da 2)
- **ARO:** nessuno
- **Atteso:** in testa alla pagina *«2 SAGOME: per ogni bersaglio indica da quante Sagome è preso»*; nessun *DADI DA ASSEGNARE*. Sul tabellone **due** scontri, tutti e due colpo automatico: Fusilier **ARM VS 8**, Orc **ARM VS 11**.

**TPL-08 — Due Sagome sullo stesso bersaglio** *(nuova)*
- **Attivo:** come TPL-07
- **Bersaglio:** Fusilier con **2 Sagome**, Orc con **1**
- **Atteso:** il contatore del Fusilier arriva a **2** e non oltre; quello dell'Orc non scende sotto **1**. Sul tabellone il Fusilier ha **2** colpi (due Tiri Salvezza), l'Orc **1**, con la nota *«2 Sagome, ognuna è un colpo che vale per tutti quelli sotto la sua area»*.
- **Controprova con un'arma senza Sagoma:** Teutonic Knight *(PanOceania #7)*, Panzerfaust (B1), su Alguacil #1 e Alguacil (HMG) #2: c'è *DADI BS DA ASSEGNARE: 1* e si può dare il dado a uno solo.

**TPL-09 — Una sola Sagoma: nessun dado da assegnare** *(nuova)*
- **Attivo:** Morlock (Assault Pistol) *(Nomadi #13)* · ATTACCO BS
- **Con:** Chain Rifle (B1)
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)* e Fusilier (Missile Launcher) *(PanOceania #2)*
- **ARO:** nessuno
- **Atteso:** in testa *«UNA SAGOMA: ogni bersaglio scelto è sotto l'area e ne subisce il colpo»*; accanto ai due nomi *«1 Sagoma»*, senza tasti − e +. Sul tabellone due scontri, ARM VS 8 per tutti e due.

---

# 7. Blocco E — Attacco Intuitivo

**INT-01 — Contro un Marker**
- **Attivo:** Morlock (Assault Pistol) *(Nomadi #13)* · ATTACCO INTUITIVO
- **Con:** Chain Rifle
- **Bersaglio:** Croc Man (MULTI Sniper Rifle) *(PanOceania #6)*, schierato come **Marker CAMO**. Nella pagina dei bersagli lascia *HO LINEA DI TIRO (solo Marker bersagliabili)*
- **ARO:** Croc Man → SCHIVATA
- **Atteso:** **F2F**. Attivo **WIP 14**, Burst 1, nessuna voce di MOD, con la nota *«nessun MOD si applica, da nessuna fonte»*. Reattivo **PH 12**.

**INT-02 — Bersaglio visibile**
- **Attivo:** Morlock (Assault Pistol) *(Nomadi #13)* · ATTACCO INTUITIVO
- **Con:** Chain Rifle
- **Bersaglio:** Croc Man *(PanOceania #6)* schierato come **Modello**
- **Atteso:** con *HO LINEA DI TIRO* il Croc Man **non è fra i bersagli**: con la Linea di Tiro si attaccano solo i Marker.

**INT-03 — Fuori LoF per una Zona di Visibilità Zero** *(nuova)*
- **Attivo:** Morlock (Assault Pistol) *(Nomadi #13)* · ATTACCO INTUITIVO
- **Con:** Chain Rifle
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)*, Modello, dietro il Fumo. Nella pagina dei bersagli tocca *NESSUNA LoF — Zona di Visibilità Zero*
- **ARO:** nessuno
- **Atteso:** il Fusilier compare fra i bersagli. Nella pagina dopo c'è solo *BERSAGLIO SOTTO LA SAGOMA*, **senza** il tasto LINEA DI TIRO, e il tasto in fondo è *LANCIA ATTACCO INTUITIVO*. Tiro **WIP 14**, salvezza **ARM VS 8 ×1**.

**INT-04 — Quali armi lo aprono**
- **Attivo:** apri il menu degli Ordini di Zero (Hacker, Killer Hacking Device) *(Nomadi #9, Shock Mine)*, Mary Problems *(Nomadi #21, Zapper)* e Kulak *(Nomadi #23, Cybermine)*
- **Atteso:** ATTACCO INTUITIVO compare per tutti e tre. Non compare per Alguacil (Combi Rifle) *(Nomadi #1)*.

---

# 8. Blocco F — Fuoco Speculativo

**SPEC-01 — Il −6 e il cambio di attributo**
- **Attivo:** Intruder (Hacker, Killer Hacking Device) *(Nomadi #25)* · FUOCO SPECULATIVO
- **Con:** Grenades
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)*, a 0-8", in copertura
- **ARO:** nessuno
- **Atteso:** tiro su **PH**, con la nota *«Grenades: Tratto BS Weapon (PH)»*: 12 +3 −6 = **9**, B1. La copertura non compare fra i MOD.

**SPEC-02 — Bersaglio Bersagliato**
- **Attivo:** Intruder (Hacker, Killer Hacking Device) *(Nomadi #25)* · FUOCO SPECULATIVO
- **Con:** Grenades
- **Bersaglio:** Fusilier *(PanOceania #1)*, **Bersagliato**, a 0-8"
- **ARO:** nessuno
- **Atteso:** 12 +3 −6 +3 = **12**, con tutte e tre le voci.

**SPEC-03 — Armi ammesse**
- **Attivo:** Alguacil (Missile Launcher) *(Nomadi #3)*: apri il menu; poi Mary Problems *(Nomadi #21)* · FUOCO SPECULATIVO
- **Con:** per Mary Problems il Pitcher
- **Atteso:** l'Alguacil **non** ha la voce FUOCO SPECULATIVO (il Missile Launcher non ha il Tratto Speculative Attack). Mary Problems ha **un** bottone, Pitcher, e sotto le altre armi escluse col motivo.

**SPEC-04 — FUORI nella barra delle gittate** *(nuova)*
- **Attivo:** Intruder (Hacker, Killer Hacking Device) *(Nomadi #25)* · FUOCO SPECULATIVO
- **Con:** Grenades
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)*
- **ARO:** nessuno
- **Atteso:** la barra ha le due fasce delle Grenades (+3 e −3) e in fondo **FUORI**. Non c'è il tasto *IN GITTATA SÌ*. Toccando FUORI il tasto in fondo diventa **IDLE** giallo; toccando 0-8" torna *LANCIA ATTACCO SPECULATIVO*.

**SPEC-05 — Principale e bersagli sotto la Sagoma, nella pagina dei bersagli** *(nuova)*
- **Attivo:** Intruder (Hacker, Killer Hacking Device) *(Nomadi #25)* · FUOCO SPECULATIVO
- **Con:** Grenades
- **Bersaglio:** nella pagina dei bersagli tocca, in quest'ordine, Zulu-Cobra *(PanOceania #10, Marker CAMO)*, poi Fusilier (Combi Rifle) *(PanOceania #1)*, poi Zulu-Cobra, poi Orc *(PanOceania #4)*
- **ARO:** nessuno
- **Atteso:** le righe hanno la foto, come negli altri elenchi. Il primo tocco sul Zulu-Cobra è **rifiutato**: *«non può essere il Bersaglio Principale»*. Il Fusilier diventa **[ PRINCIPALE ]**, il Zulu-Cobra e l'Orc **[ SOTTO LA SAGOMA ]**. Nella pagina della gittata non c'è più la scelta dei secondari, solo il promemoria *«ANCHE SOTTO LA SAGOMA: …»*. Sul tabellone **tre** scontri con lo stesso tiro **9** (PH 12 +3 −6); sul Zulu-Cobra nessuna voce di Mimetismo.
- **Controprova:** togliendo il Principale, diventa Principale l'Orc, non il Marker.

**SPEC-06 — Arma senza Sagoma: un bersaglio solo** *(nuova)*
- **Attivo:** Mary Problems *(Nomadi #21)* · FUOCO SPECULATIVO
- **Con:** Pitcher
- **Bersaglio:** Fusilier #1, poi Orc #4
- **Atteso:** in testa *«Un solo bersaglio: quest'arma non ha una Sagoma Circolare»*; toccando l'Orc, il Fusilier esce.

---

# 9. Blocco G — Attacco Guidato

**GUI-01 — L'Ordine si raggiunge**
- **Attivo:** Vertigo Zond (Missile Launcher) *(Nomadi #28)* · apri il menu degli Ordini
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)* messo **Bersagliato** dall'editor degli stati
- **Atteso:** ATTACCO GUIDATO c'è; il bottone dell'arma è Missile Launcher (Blast Mode). Controprova: Alguacil (Missile Launcher) *(Nomadi #3)*, che ha l'arma ma non la Skill, **non** ha la voce.

**GUI-02 — Bersaglio Bersagliato**
- **Attivo:** Vertigo Zond *(Nomadi #28, BS 12)* · ATTACCO GUIDATO
- **Con:** Missile Launcher (Blast Mode)
- **Bersaglio:** Fusilier *(PanOceania #1)*, Bersagliato, a 24-32", in copertura
- **ARO:** nessuno
- **Atteso:** 12 +3 +3 = **18**, voci *«Gittata: +3»* e *«Bersaglio Bersagliato: +3 BS»*, nota *«Attacco Guidato: ignora Copertura e Mimetismo»*. Salvezza **ARM VS 7 ×3**.

**GUI-03 — La lista dei bersagli** *(riscritta)*
- **Attivo:** Vertigo Zond *(Nomadi #28)* · ATTACCO GUIDATO
- **Con:** Missile Launcher (Blast Mode)
- **Bersaglio:** sul tavolo Fusilier (Combi Rifle) #1 **Bersagliato**, Fusilier (Missile Launcher) #2 senza stato, Croc Man #6 Marker CAMO. Tocca prima il Fusilier #2, poi il #1, poi il #2
- **ARO:** nessuno
- **Atteso:** una **lista sola** con le righe con la foto, come gli altri elenchi; il Croc Man non c'è. Il primo tocco sul #2 è rifiutato: *«non può essere il Primario»*. Poi il #1 è **[ PRIMARIO ]** e il #2 **[ PRESO DALLA SAGOMA ]**. Sul tabellone due scontri: il Faccia a Faccia e il Critico restano del solo Primario.

**GUI-04 — ECM (Guided −6)**
- **Attivo:** Vertigo Zond *(Nomadi #28)* · ATTACCO GUIDATO
- **Con:** Missile Launcher (Blast Mode)
- **Bersaglio:** Tikbalang *(PanOceania #8)*, Bersagliato, a 24-32"
- **ARO:** nessuno
- **Atteso:** 12 +3 +3 −6 = **12**, con la voce *«ECM (Guided -6) del bersaglio: -6 BS»*. Salvezza **ARM VS 12 ×3**.

**GUI-05 — La difesa contro un Guidato**
- **Attivo:** Vertigo Zond *(Nomadi #28)* · ATTACCO GUIDATO
- **Con:** Missile Launcher (Blast Mode)
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)*, Bersagliato, a 0-8"
- **ARO:** il Fusilier apre il menu ARO
- **Atteso:** sono offerte **SCHIVATA** e **RESET**, più Attacco BS e Attacco CC. Il Reset ha la nota *«Stato Bersagliato: −3 WIP»*. Nei modificatori: Schivata **PH 7** (10 −3, Sagoma senza LoF), Reset **WIP 9** (12 −3).

---

# 10. Blocco H — Corpo a corpo

**CC-01 — Martial Arts sui due lati**
- **Attivo:** Morlock (Assault Pistol) *(Nomadi #13)* · ATTACCO CC
- **Con:** AP CC Weapon(PS=6)
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)*, a contatto
- **ARO:** Fusilier → ATTACCO CC, CC Weapon, contro il Morlock
- **Atteso:** Faccia a Faccia. Attivo CC 23 +3 = **26**, una voce: *«Martial Arts L2: +3 CC»*. Reattivo 13 −3 = **10**, una voce: *«Martial Arts L2 del nemico: -3 al tuo CC»*. Salvezza del Fusilier **ARM VS 7 ×1**: è il PS=6 del profilo, non il PS 8 del CC Weapon generico. Salvezza del Morlock **ARM VS 9 ×1**. Se leggi ARM VS 9 sul Fusilier, il PS del profilo si è perso.

**CC-02 — NBW e CC Attack (−3)**
- **Attivo:** Chimera *(Nomadi #14)* · ATTACCO CC
- **Con:** Viral CC Weapon(PS=6)
- **Bersaglio:** Teutonic Knight (TinBot: Firewall) *(PanOceania #7)*, a contatto
- **ARO:** Teutonic Knight → ATTACCO CC, DA CC Weapon(PS=5), contro la Chimera
- **Atteso:** attivo CC **24**, nessuna voce di MOD, e la nota *«Natural Born Warrior annulla il -3 delle Martial Arts L2 nemiche»*. Reattivo 22 +3 −3 = **22**, due voci: *«Martial Arts L2: +3 CC»* e *«Il nemico ha CC Attack (-3): si applica a te nel Faccia a Faccia»*. Salvezza del Teutonic **BTS VS 9 ×2**; salvezza della Chimera **ARM VS 6 ×2**.

**CC-03 — Colpo di Grazia**
- **Attivo:** Morlock (Assault Pistol) *(Nomadi #13)* · ATTACCO CC
- **Con:** AP CC Weapon(PS=6)
- **Bersaglio:** (a) Fusilier (Combi Rifle) *(PanOceania #1)* messo **Incosciente**; (b) Fusilier sano; (c) Dr. Harper FTO *(PanOceania #14, No Wound Incapacitation)* messo **Incosciente**
- **ARO:** nessuno
- **Atteso:** (a) riquadro rosso **☠️ COLPO DI GRAZIA**: nessun tiro d'attacco, nessun Tiro Salvezza, *«Senza alcun tiro, il bersaglio passa automaticamente da Incosciente a Morto, senza possibilità di Tiro Salvezza.»* (b) nessun riquadro: *«Il bersaglio non è Incosciente.»* (c) riquadro giallo **⚠️ COLPO DI GRAZIA NON APPLICABILE**: *«Il bersaglio ha Dogged o No Wound Incapacitation: il Colpo di Grazia non si usa, il CC Attack si risolve normalmente.»*

**CC-04 — PARA CC Weapon**
- **Attivo:** Zondmate (REM) *(Nomadi #18)* · ATTACCO CC
- **Con:** PARA CC Weapon(-3)
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)*, a contatto
- **ARO:** nessuno
- **Atteso:** CC **13** (il −3 dell'arma va al nemico, non a chi la usa). Salvezza **PH VS 4 ×1**: nessuna Ferita, l'effetto è Immobilizzato-A.

**CC-05 — Berserk**
- **Attivo:** Wolfgang Amadeus *(Nomadi #26)* · BERSERK
- **Con:** prima PARA CC Weapon(-6), poi DA CC Weapon(PS=4)
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)*, a contatto
- **ARO:** Fusilier → ATTACCO CC, CC Weapon, contro Wolfgang
- **Atteso:** Faccia a Faccia (in N5 il Berserk non lo evita). Attivo CC 22 +3 = **25**, una voce: *«Martial Arts L3: +3 CC»*. Reattivo 13 −3 −6 = **4** con la PARA, voci *«Martial Arts L3 del nemico: -3 al tuo CC»* e *«PARA CC Weapon (-6) dell'avversario: -6 nel Faccia a Faccia»*. Salvezza del Fusilier: con la PARA **PH VS 4 ×1**, con la DA **ARM VS 5 ×2**. Salvezza di Wolfgang **ARM VS 11 ×1**.

**CC-06 — Ingaggiato**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* messo **Ingaggiato** · apri il menu degli Ordini
- **Atteso:** compaiono **solo** ATTACCO CC, SCHIVATA, RESET, IDLE (il BERSERK non c'è perché l'Alguacil non ha la Skill; su Wolfgang #26 Ingaggiato c'è anche BERSERK). Controprova: lo stesso Alguacil senza lo stato ha il menu intero.

**CC-07 — Gang-Up**
- **Attivo:** Morlock (Assault Pistol) *(Nomadi #13)* · ATTACCO CC
- **Con:** AP CC Weapon(PS=6)
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)*, a contatto. Alla domanda *«Quanti TUOI alleati sono ingaggiati in questa mischia?»* rispondi **0**, poi **1**, **2**, **3**
- **ARO:** nessuno
- **Atteso:** Burst **1 / 2 / 3 / 4**, con la voce *«Close Combat with Multiple Troopers: +1B (N alleato/i nella mischia)»*. Il numero degli alleati lo dichiara il giocatore: l'app non sa chi ha dichiarato Schivata o Idle.

---

# 11. Blocco I — Hacking

Tutte le prove di hacking: bersaglio **nell'Area di Hacking**. Gittata e
copertura non contano e la schermata non le chiede.

**HK-00 — Programmi per dispositivo**
- **Attivo:** Interventor (Hacker Plus) *(Nomadi #8)*, Zero (Hacker, Killer Hacking Device) *(Nomadi #9)*, Orc (Hacker, Hacking Device) *(PanOceania #4)* · HACKING, guarda l'elenco dei programmi
- **Atteso:** Interventor: Carbonite, Oblivion, Spotlight, Total Control fra gli attacchi (più Cybermask e White Noise). Zero: **solo Trinity** fra gli attacchi. Orc: i quattro programmi base, nessun Cybermask.

**HK-01 — Carbonite**
- **Attivo:** Interventor (Hacker Plus) *(Nomadi #8)* · HACKING
- **Con:** CARBONITE
- **Bersaglio:** Orc (Hacker, Hacking Device) *(PanOceania #4)*
- **ARO:** Orc → RESET, contro l'Interventor
- **Atteso:** Faccia a Faccia. Attivo WIP **15** B2, reattivo Reset WIP **12** B1. Salvezza dell'Orc **BTS VS 10 ×2**.

**HK-02 — Oblivion**
- **Attivo:** Interventor (Hacker Plus) *(Nomadi #8)* · HACKING
- **Con:** OBLIVION
- **Bersaglio:** Orc (Hacker, Hacking Device) *(PanOceania #4)*
- **ARO:** nessuno
- **Atteso:** WIP **15** B1. Salvezza **BTS VS 6 ×1** (BTS dimezzato + PS 4), effetto Isolato.

**HK-03 — Spotlight su un non hacker**
- **Attivo:** Interventor (Hacker Plus) *(Nomadi #8)* · HACKING
- **Con:** SPOTLIGHT
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)*
- **ARO:** nessuno
- **Atteso:** ammesso. WIP **15** B1, salvezza **BTS VS 5 ×1**, effetto Bersagliato.

**HK-04 — Trinity**
- **Attivo:** Zero (Hacker, Killer Hacking Device) *(Nomadi #9)*, **rivelato** (Scoprilo o schieralo come Modello) · HACKING
- **Con:** TRINITY
- **Bersaglio:** Orc (Hacker, Hacking Device) *(PanOceania #4)*
- **ARO:** nessuno
- **Atteso:** WIP 13 +3 = **16** B3, con la voce *«TRINITY: +3 WIP»*. Salvezza **BTS VS 9 ×1**.

**HK-05 — Filtro bersagli**
- **Attivo:** Interventor (Hacker Plus) *(Nomadi #8)* per CARBONITE, OBLIVION, TOTAL CONTROL e SPOTLIGHT; Zero (Hacker, Killer Hacking Device) *(Nomadi #9)* per TRINITY · HACKING
- **Bersaglio:** sul tavolo Tikbalang *(PanOceania #8)*, Orc *(#4)*, Fusilier (Combi Rifle) *(#1)* e Croc Man (MULTI Sniper Rifle) *(#6)* come Marker CAMO
- **ARO:** nessuno
- **Atteso:** CARBONITE e OBLIVION: Tikbalang e Orc ammessi; Fusilier no (*«non hackerabile»*); Croc Man no (*«va Scoperto prima»*). TOTAL CONTROL: solo il Tikbalang. TRINITY: solo l'Orc. SPOTLIGHT: anche il Fusilier.

**HK-06 — Firewall**
- **Attivo:** Interventor (Hacker Plus) *(Nomadi #8, WIP 15)* · HACKING
- **Con:** CARBONITE
- **Bersaglio:** Teutonic Knight (TinBot: Firewall) *(PanOceania #7, BTS 3)*
- **ARO:** nessuno
- **Atteso:** tiro **12**, voce *«Firewall del bersaglio: −3 WIP»*. Salvezza **BTS VS 13 ×2**, voce *«Firewall del bersaglio: +3 BTS (equivalente Copertura)»*. Il Firewall fa due cose: se ne vedi una sola, metà della regola manca.

**HK-07 — Due fonti dello stesso Firewall**
- **Attivo:** prima Laxmee (Hacker) *(PanOceania #16)* · HACKING · **FAIRY DUST** sugli **HI**; poi, nel turno nomade, Interventor (Hacker Plus) *(Nomadi #8)* · HACKING
- **Con:** CARBONITE
- **Bersaglio:** Teutonic Knight (TinBot: Firewall) *(PanOceania #7, HI)*
- **ARO:** nessuno
- **Atteso:** Firewall **−3, non −6**: tiro **12**, salvezza **BTS VS 13 ×2** con il +3 una volta sola. La nota dice che le fonti sono due — *«il suo (-3) e il Fairy Dust di … (-3)»* — e che la scelta spetta al giocatore del bersaglio. Il Repeater non compare.

**HK-08 — Firewall spento**
- **Attivo:** Interventor (Hacker Plus) *(Nomadi #8)* · HACKING
- **Con:** CARBONITE
- **Bersaglio:** Teutonic Knight (TinBot: Firewall) *(PanOceania #7)* messo **Isolato**
- **ARO:** nessuno
- **Atteso:** tiro **15** e salvezza **BTS VS 10 ×2**: niente −3, niente +3. È la controprova di HK-06.

**HK-09 — ECM (Hacking −3)**
- **Attivo:** Interventor (Hacker Plus) *(Nomadi #8)* · HACKING
- **Con:** CARBONITE
- **Bersaglio:** Aquila *(PanOceania #11)*
- **ARO:** nessuno
- **Atteso:** tiro **12**, voce *«ECM (Hacking -3) del bersaglio: -3 WIP»*. L'ECM non dà il +3 alla salvezza: la salvezza è **BTS VS 13 ×2** perché il BTS dell'Aquila è 6.

**HK-10 — Dati da verificare**
- **Attivo:** Interventor (Hacker Plus) *(Nomadi #8)* con TOTAL CONTROL sul Tikbalang *(PanOceania #8)*; Zero *(Nomadi #9)* con TRINITY sull'Orc *(#4)* · HACKING
- **ARO:** nessuno
- **Atteso:** l'avviso **A91** — *«Dati di "<programma>" non verificati sulla scheda ufficiale»* — compare sui programmi che il catalogo marca `fonte: 'DA VERIFICARE'`. Se non compare su nessuno dei due, chiedi a DATABASE se sono stati verificati prima di segnalarlo.

**HK-11 — Upgrade dai profili**
- **Attivo:** Mary Problems (Hacker) *(Nomadi #21, UPGRADE: Oblivion +1B)*, poi Kulak (Hacker, Killer Hacking Device) *(Nomadi #23, UPGRADE: Carbonite)* · HACKING
- **Con:** OBLIVION per Mary Problems, CARBONITE per il Kulak
- **Bersaglio:** Orc (Hacker, Hacking Device) *(PanOceania #4)*
- **ARO:** nessuno
- **Atteso:** l'upgrade entra nel calcolo — l'Oblivion di Mary Problems a **Burst 2** — oppure compare l'avviso **A94**. Mai ignorato in silenzio.

**HK-12 — Reset contro l'hacking, Schivata contro il BS**
- **Attivo:** prima Interventor (Hacker Plus) *(Nomadi #8)* · HACKING · CARBONITE; poi Alguacil (Combi Rifle) *(Nomadi #1)* · ATTACCO BS · Combi Rifle a 8-16", copertura no
- **Bersaglio:** Orc (Hacker, Hacking Device) *(PanOceania #4)*
- **ARO:** l'Orc apre il menu degli ARO
- **Atteso:** contro l'HACKING: Reset sì, **Schivata no**. Contro l'ATTACCO BS: Schivata sì, e Reset sì anche lui (vedi AR-01). La differenza da leggere è la Schivata.

---

# 12. Blocco J — Scoprire e osservazione

Il bersaglio delle prove SCO è il **Croc Man (MULTI Sniper Rifle)**
*(PanOceania #6)* schierato come **Marker CAMO**, senza copertura.

**SCO-01 — Scoprire vicino**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1, WIP 13)* · SCOPRIRE
- **Bersaglio:** Croc Man (Marker CAMO) a 0-8"
- **ARO:** nessuno
- **Atteso:** **10** (13 +3 gittata −6 Mimetismo), B1, Tiro Normale. La nota dice che chi fallisce non ritenta sullo stesso Marker fino al proprio Turno successivo.

**SCO-02 — Scoprire lontano**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* · SCOPRIRE
- **Bersaglio:** Croc Man (Marker CAMO) a 32-40"
- **ARO:** nessuno
- **Atteso:** **4** (13 −3 −6). Le fasce dello Scoprire sono sue: +3 fino a 8", 0 fino a 32", −3 fino a 48", −6 oltre.

**SCO-03 — Sensor e visore**
- **Attivo:** Grenzer (Forward Observer, Sensor, NCO) *(Nomadi #12, MSV L1)* · SCOPRIRE
- **Bersaglio:** Croc Man (Marker CAMO) a 8-16"
- **ARO:** nessuno
- **Atteso:** **16**, con due voci: *«Mimetismo -6, ridotto a -3 dal Multispectral Visor L1»* e *«Sensor: +6 WIP scoprendo un Marker Mimetico»*.

**SCO-04 — Niente da Scoprire**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* · SCOPRIRE
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)*, Modello visibile
- **ARO:** nessuno
- **Atteso:** il Fusilier non è fra i bersagli ammessi: *«Non è in forma di Marker: non c'è niente da Scoprire.»*

**OSS-01 — Forward Observer**
- **Attivo:** Grenzer (Forward Observer, Sensor, NCO) *(Nomadi #12, WIP 13)* · FORWARD OBSERVER
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)* a 8-16"
- **ARO:** nessuno
- **Atteso:** tiro su **WIP 13**, Burst 2, nessun MOD di gittata fino a 24". **Nessun Tiro Salvezza**: il bersaglio entra in Stato **Bersagliato**.

**OSS-02 — Sensor**
- **Attivo:** Grenzer (Forward Observer, Sensor, NCO) *(Nomadi #12)* · SENSOR
- **ARO:** nessuno
- **Atteso:** **WIP 13 +6 = 19**, senza bersaglio e senza Linea di Tiro: scopre tutti i Marker nella sua Zona di Controllo. Nessun MOD di gittata né di Mimetismo. La schermata non diventa mai IDLE.

**OSS-03 — Triangulated Fire**
- **Attivo:** Zulu-Cobra (Triangulated Fire, Sensor) *(PanOceania #10, BS 13)*, **rivelato** · TRIANGULATED FIRE
- **Con:** Combi Rifle
- **Bersaglio:** Intruder (HMG) *(Nomadi #24, Mimetismo −3)*, rivelato, a 32-40", **in copertura**
- **ARO:** nessuno
- **Atteso:** la schermata ha **un bottone per arma** (Combi Rifle, Jammer, Assault Pistol). Il tiro è su **BS 13 pieno**, MOD 0. I MOD ignorati compaiono **barrati**: *«Gittata: -6»*, *«Bersaglio in Copertura Parziale: -3»*, *«Mimetismo del bersaglio: -3»*; con quei MOD il tiro sarebbe stato **1**. Controprova: Alguacil (Combi Rifle) *(Nomadi #1)* non ha la voce, *«Serve l'Abilità Triangulated Fire.»*

---

# 13. Blocco K — Supporto

**SUP-01 — Dottore**
- **Attivo:** Daktari (Doctor) *(Nomadi #6, WIP 13)* · DOTTORE
- **Bersaglio:** Alguacil (Combi Rifle) *(Nomadi #1)* messo **Incosciente**
- **ARO:** nessuno
- **Atteso:** tira il Daktari su **WIP 13**, una voce *«WIP di Daktari: 13»*, nessun bonus. Il fallimento è **letale**: *«⚠️ Il bersaglio entra AUTOMATICAMENTE in Stato Morto e viene rimosso dal tavolo.»*

**SUP-02 — MediKit**
- **Attivo:** Alguacil (Paramedic) *(Nomadi #5, BS 11)* · MEDIKIT
- **Bersaglio:** Morlock (Assault Pistol) *(Nomadi #13, PH 13)* messo **Incosciente**
- **ARO:** nessuno
- **Atteso:** due tiri in ordine: l'Alguacil colpisce su **BS 11**, poi il **Morlock** tira su **PH 13** (il PH del bersaglio, non dell'utente). Nessun Tiro Salvezza. Fallimento: Morto.

**SUP-03 — Ingegnere**
- **Attivo:** Clockmaker (Engineer) *(Nomadi #7, WIP 15)* · INGEGNERE
- **Bersaglio:** Reaktion Zond (HMG) *(Nomadi #15)* messo **Incosciente**
- **ARO:** nessuno
- **Atteso:** **WIP 15**; il fallimento dà **1 Ferita**, non la morte: *«il bersaglio riceve 1 Ferita invece di rimuoverla»*.

**SUP-04 — GizmoKit(+1B)**
- **Attivo:** Clockmaker (Engineer) *(Nomadi #7, BS 11)* · GIZMOKIT
- **Bersaglio:** Reaktion Zond (HMG) *(Nomadi #15)* messo **Incosciente**
- **ARO:** nessuno
- **Atteso:** **BS 11** per colpire, **Burst 2** con le voci *«Burst dell'arma GizmoKit»* e *«BS Attack (+1B): +1 Burst in Turno Attivo»*; poi il bersaglio su PH. Fallimento: 1 Ferita. Controprova: Machinist (Combi Rifle) *(PanOceania #13)*, GizmoKit senza notazione, Burst **1**.

**SUP-05 — Filtro dei bersagli**
- **Attivo:** Daktari *(Nomadi #6)* · DOTTORE; poi Clockmaker *(Nomadi #7)* · INGEGNERE
- **Bersaglio:** sul tavolo Alguacil (Combi Rifle) *(#1)* **Incosciente** (ha VITA), Reaktion Zond (HMG) *(#15)* **Incosciente** (ha STR), Alguacil (HMG) *(#2)* sano
- **ARO:** nessuno
- **Atteso:** per regola il Dottore accetta solo l'Alguacil #1; l'Ingegnere solo il Reaktion Zond. L'Alguacil sano è rifiutato da tutti e due: *«il Supporto bersaglia solo gli Incoscienti»*. **Difetto aperto** (blocco V): oggi tutti e due gli Incoscienti sono offerti a tutti e due gli strumenti.

**SUP-06 — Strumento sconosciuto**
- **Attivo:** in console, `MotoreN5.regoleSupporto(<Daktari>, <Alguacil incosciente>, 'SCATOLETTA')`
- **Atteso:** `valido: false` e l'avviso **A58**, *«Strumento di supporto "SCATOLETTA" sconosciuto.»*, gravità `azione`.

**SUP-07 — Ri-tiri col Command Token**
- **Attivo:** Daktari *(Nomadi #6)* · DOTTORE sull'Alguacil (Combi Rifle) *(#1, ha `Cube`)* Incosciente; poi Clockmaker *(Nomadi #7)* · INGEGNERE sul Reaktion Zond *(#15, ha Remote Presence)* Incosciente
- **ARO:** nessuno
- **Atteso:** due note diverse. Dottore: *«Se il bersaglio ha un Cubo, si possono spendere Command Token per ripetere un tiro fallito.»* Ingegnere: *«Se il bersaglio ha Remote Presence, si possono spendere Command Token per ripetere un tiro fallito.»* La nota si mostra sempre: la condizione la controlla il giocatore sul profilo.

---

# 14. Blocco L — Difese e Soppressione

Nelle prove DIF-01…04 attacca il **Fusilier (Combi Rifle)** *(PanOceania #1)*
con ATTACCO BS, Combi Rifle, a 8-16", senza copertura. Nelle DIF-05…08
attacca l'**Interventor (Hacker Plus)** *(Nomadi #8)* con HACKING, CARBONITE.

**DIF-01 — Schivata con LoF**
- **Bersaglio e ARO:** Alguacil (Combi Rifle) *(Nomadi #1, PH 10)* → SCHIVATA, **con** LoF verso il Fusilier
- **Atteso:** **10**, nessuna voce di MOD.

**DIF-02 — Schivata senza LoF**
- **Bersaglio e ARO:** Alguacil (Combi Rifle) *(Nomadi #1)* → SCHIVATA, **senza** LoF
- **Atteso:** **7**, con la voce *«Schivata a −3: nessuna LoF verso l'attaccante»*.

**DIF-03 — Dodge (+3)**
- **Bersaglio e ARO:** Puppetbot (Red Fury) *(Nomadi #17, PH 10)* → SCHIVATA, con LoF
- **Atteso:** **13**, con la voce *«Dodge (+3)»*.

**DIF-04 — Schivata da IMM-A**
- **Bersaglio e ARO:** Alguacil (Combi Rifle) *(Nomadi #1)* messo **IMM-A** → SCHIVATA, con LoF
- **Atteso:** **4**, con la voce *«Stato Immobilizzato-A: −6 PH»*.

**DIF-05 — Reset**
- **Bersaglio e ARO:** Orc (Hacker, Hacking Device) *(PanOceania #4, WIP 12)* → RESET, senza LoF
- **Atteso:** **12**, nessun MOD, e la nota che il −3 per la LoF vale sulla Schivata e non sul Reset.

**DIF-06 — Reset da Bersagliato**
- **Bersaglio e ARO:** Orc *(PanOceania #4)* messo **Bersagliato** → RESET
- **Atteso:** **9**, con la voce *«Stato Bersagliato: −3 WIP»*.

**DIF-07 — Reset da IMM-B**
- **Bersaglio e ARO:** Orc *(PanOceania #4)* messo **IMM-B** → RESET
- **Atteso:** **9**, con la voce *«Stato Immobilizzato-B: −3 WIP»*.

**DIF-08 — Reset da Isolato**
- **Bersaglio e ARO:** Orc *(PanOceania #4)* messo **Isolato** → RESET
- **Atteso:** **3**, con la voce *«Stato Isolato: −9 WIP»*.

**DIF-09 — Sesto Senso**
- **Attivo:** Fusilier (Combi Rifle) *(PanOceania #1, BS 12)* · ATTACCO BS
- **Con:** Combi Rifle, a 0-8"
- **Bersaglio:** Warcor (Sixth Sense) *(Nomadi #27, PH 11)* messo **in Soppressione**
- **ARO:** Warcor → SCHIVATA, **senza** LoF
- **Atteso:** Schivata **11**, nessuna voce, e la nota *«Sesto Senso: ignorato il -3 (nessuna LoF verso l'attaccante).»* Il −3 della Soppressione cade sull'**attaccante**: il Fusilier passa da 15 a **12**, voce *«Bersaglio in Fuoco di Soppressione a 8": -3»*. Controprova: Alguacil (Combi Rifle) *(Nomadi #1)* nelle stesse condizioni schiva a **7**.

**DIF-10 — Dichiarare la Soppressione**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* · FUOCO DI SOPPRESSIONE
- **Con:** Combi Rifle
- **Atteso:** nessun tiro. Lo stato compare sul tabellone e l'arma passa al profilo **Combi Rifle (SF Mode)**.

**DIF-11 — Armi ammesse**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)*, poi Morlock (Assault Pistol) *(Nomadi #13)* · FUOCO DI SOPPRESSIONE
- **Atteso:** l'Alguacil sì, col Combi Rifle. Il Morlock non ha la voce nel menu: Chain Rifle, Smoke Grenades e Assault Pistol non hanno il Tratto *Suppressive Fire*.

**DIF-12 — SF Mode in ARO**
- **Attivo:** Fusilier (Combi Rifle) *(PanOceania #1)* · MUOVERE
- **ARO:** Alguacil (Combi Rifle) *(Nomadi #1)* **in Soppressione** → ATTACCO BS, Combi Rifle, a 8-16", contro il Fusilier
- **Atteso:** l'arma diventa **Combi Rifle (SF Mode)**, Burst **3**, fasce 0 / 0 / −3, gittata massima 24", avviso **A98**.

**DIF-13 — Attivarsi cancella la Soppressione**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* **in Soppressione** · IDLE
- **ARO:** nessuno
- **Atteso:** la Soppressione sparisce dalla riga dell'unità e dal tabellone appena parte l'Ordine.

---

# 15. Blocco M — Stati dell'attivo

Per tutte: **Alguacil (Combi Rifle)** *(Nomadi #1)*, messo nello stato indicato
dall'editor degli stati; si apre il menu degli Ordini. Il menu pieno
dell'Alguacil è: MUOVERE, ATTACCO BS, ATTACCO CC, SCOPRIRE, SCHIVATA, RESET,
IDLE, CAUTO, SALTO, ARRAMPICARSI, SOPPRESSIONE, REQUEST SPEEDBALL.

**ST-01 — Normale**
- **Atteso:** il menu pieno.

**ST-02 — Morto**
- **Atteso:** nessun Ordine.

**ST-03 — Incosciente**
- **Atteso:** nessun Ordine.

**ST-04 — Isolato**
- **Atteso:** nessun Ordine dal Pool, col motivo.

**ST-05 — Disconnesso**
- **Atteso:** nessun Ordine.

**ST-06 — IMM-A**
- **Atteso:** solo SCHIVATA.

**ST-07 — IMM-B**
- **Atteso:** solo RESET.

**ST-08 — Stordito**
- **Atteso:** tutto tranne ATTACCO BS e ATTACCO CC.

**ST-09 — Ingaggiato**
- **Atteso:** solo ATTACCO CC, SCHIVATA, RESET, IDLE.

**ST-10 — In Ritirata**
- **Atteso:** solo MUOVERE, SCOPRIRE, SCHIVATA, RESET, IDLE, CAUTO.

**ST-11 — Foxhole**
- **Atteso:** il menu pieno: il Foxhole non nega nessuna voce. Muovendosi lo si cancella (ST-15).

**ST-12 — Bersagliato**
- **Atteso:** tutto tranne CAUTO.

**ST-13 — Soppressione**
- **Atteso:** il menu pieno; dichiarare un Ordine cancella lo stato (DIF-13).

**ST-14 — Tre stati insieme**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* messo IMM-A, Bersagliato e Mimetizzato (CAMO) · guarda il tabellone
- **Atteso:** i tre stati, tutti visibili.

**ST-15 — Foxhole al tavolo**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* in **Foxhole** · guarda la riga dell'unità e una scheda di bersaglio nemica
- **Atteso:** Silhouette 3, Copertura Parziale a 360°, Mimetism (−3) e Courage. Nessun movimento, nemmeno dopo una Schivata riuscita. Si cancella andando Prono, o dichiarando una Skill di Movimento.

**ST-16 — L'ordine degli stati sul tabellone**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* messo Incosciente, IMM-A, Bersagliato e CAMO · guarda il tabellone
- **Atteso:** in quest'ordine: **Incosciente, Immobilizzato-A, Bersagliato, CAMO**.

**ST-17 — Una riga malata non svuota il tabellone**
- **Attivo:** in console, con tre unità sul tabellone, forza `MotoreN5.statiPerCategoria` a sollevare un errore solo sulla seconda
- **Atteso:** tre righe su tre; la seconda dice **STATI ILLEGGIBILI**; `window.ultimaEccezione` contiene il messaggio.

**ST-18 — Il segno NULL**
- **Attivo:** sei unità nomadi *(#1-#6)*, ciascuna con uno stato: Incosciente, Ritirata, Isolato, Disconnesso, Posseduto, Sepsitorizzato · guarda il tabellone
- **Atteso:** col bordo rosso e la parola NULL: Incosciente, Disconnesso, Posseduto, Sepsitorizzato. Senza: Ritirata! e Isolato.

**ST-19 — Prono e Scarico non sono stati**
- **Attivo:** apri l'editor degli stati dell'Alguacil #1
- **Atteso:** nessuna casella per Prono e Scarico; le caselle sono **16**.

**ST-20 — Il Marker si chiama CAMO**
- **Attivo:** Croc Man (MULTI Sniper Rifle) *(PanOceania #6)* schierato Marker · guarda il tabellone e le note di uno Scoprire su di lui
- **Atteso:** **CAMO** in tutti e due i posti. La Skill Mimetismo si chiama ancora così, con il suo −6.

---

# 16. Blocco N — Stati del reattivo

Per tutte: il reattivo è l'**Orc (Hacker, Hacking Device)** *(PanOceania #4)*,
messo nello stato indicato; si apre il suo menu degli ARO. L'attivo è
**Alguacil (Combi Rifle)** *(Nomadi #1)* · ATTACCO BS, Combi Rifle a 8-16",
contro l'Orc; oppure, dove la prova dice HACKING, **Interventor (Hacker Plus)**
*(Nomadi #8)* · HACKING, CARBONITE, contro l'Orc.

**AR-01 — Normale, contro un ATTACCO BS**
- **Atteso:** ATTACCO BS, ATTACCO CC, HACKING, SCHIVATA e **RESET**. Il Reset si dichiara anche contro un BS: non difende dal colpo, e il tabellone mostra due Tiri Normali.

**AR-02 — Normale, contro un HACKING**
- **Atteso:** come AR-01 ma **senza SCHIVATA**.

**AR-03 — IMM-A, contro un ATTACCO BS**
- **Atteso:** solo SCHIVATA.

**AR-04 — IMM-B, contro un HACKING**
- **Atteso:** solo RESET.

**AR-05 — IMM-B, contro un ATTACCO BS**
- **Atteso:** solo RESET.

**AR-06 — Stordito, contro un ATTACCO BS**
- **Atteso:** solo SCHIVATA e RESET.

**AR-07 — Ingaggiato, contro un ATTACCO BS**
- **Atteso:** solo ATTACCO CC, SCHIVATA e RESET.

**AR-08 — Isolato, contro un HACKING**
- **Atteso:** ATTACCO BS, ATTACCO CC e RESET; **HACKING no** (e Schivata no, perché è un hacking).

**AR-09 — Incosciente**
- **Atteso:** l'Orc non compare fra i reattivi; è nell'elenco *«non possono reagire»*, col motivo. Ripeti con Morto e Disconnesso: lo stesso.

**AR-10 — Nascosto o in Riserva**
- **Attivo:** come sopra, ma il reattivo è il Croc Man (MULTI Sniper Rifle) *(PanOceania #6)* in **Hidden Deployment**, poi il Fusilier (Missile Launcher) *(#2)* in **Riserva**
- **Atteso:** nessuno dei due compare nell'elenco dei reattivi: chi è nascosto o in Riserva non è sul tavolo.

**AR-11 — Soppressione, contro un ATTACCO BS**
- **Atteso:** tutte le voci di AR-01, col badge **SF MODE** e l'arma col profilo SF.

---

# 17. Blocco O — Deployable

**DEP-01 — Chi può piazzare**
- **Attivo:** le truppe nomadi del roster · apri il menu degli Ordini di ognuna
- **Atteso:** PIAZZARE EQUIPAGGIAMENTO compare, con queste armi: Moran *(#19)* CrazyKoalas e D-Charges; Zero *(#9)* Shock Mine; Puppet Masters *(#22)* Shock Mine; Kulak *(#23)* Cybermine e D-Charges; Clockmaker (Armed Turret) *(#39)* Armed Turret e D-Charges; Clockmaker (Engineer) *(#7)* e Intruder (Hacker, Killer Hacking Device) *(#25)* solo D-Charges. Non compare al Puppetbot *(#17)*, al Krakot *(#31)* né al Bambabot-1 *(#32)*: Chest Mine e Mine Dispenser non hanno il Tratto Deployable.

**DEP-02 — Le domande bloccano prima**
- **Attivo:** Moran *(Nomadi #19)* · IDLE → PIAZZARE EQUIPAGGIAMENTO
- **Con:** CrazyKoalas
- **ARO:** nessuno
- **Atteso:** due domande (Marker nell'area d'innesco; percorso libero). Il tasto resta **RISPONDI ALLE DOMANDE** finché ne manca una. La risposta che lascia piazzare è **verde**, quella che blocca **gialla**. Rispondendo **sì** al Marker il tasto diventa **IDLE** giallo: premendolo nessun segnalino nasce e l'uso non si scala.

**DEP-03 — Piazzamento riuscito**
- **Attivo:** Moran *(Nomadi #19)* · IDLE → PIAZZARE EQUIPAGGIAMENTO, rispondendo **no** al Marker e **sì** al percorso
- **Con:** CrazyKoalas
- **ARO:** nessuno
- **Atteso:** nasce **CrazyKoala #1**, categoria PERIMETER, a vista, ARM 0 BTS 0 STR 1 S 1. L'uso scende a **1/2**. La schermata dice che il segnalino è bersagliabile **dal prossimo Ordine**, e che in questo il nemico reagisce solo contro il Moran.

**DEP-04 — Terzo koala**
- **Attivo:** Moran *(Nomadi #19)*, dopo due piazzamenti · IDLE → PIAZZARE EQUIPAGGIAMENTO
- **Con:** CrazyKoalas
- **Atteso:** l'arma è bloccata, *«usi esauriti»* (E17). Nessun terzo segnalino.

**DEP-05 — ARO contro chi piazza**
- **Attivo:** Moran *(Nomadi #19)*, schierato come Modello · IDLE → PIAZZARE EQUIPAGGIAMENTO
- **Con:** CrazyKoalas
- **ARO:** Fusilier (Combi Rifle) *(PanOceania #1)* → ATTACCO BS, Combi Rifle, a 8-16", contro il Moran
- **Atteso:** **TIRO NORMALE**, *«L'attaccante non tira: Burst 0»*. Il Fusilier tira **12** (12 +3 −3 Mimetismo del Moran) B1; salvezza del Moran **ARM VS 7 ×1**. Il segnalino appena nato non è fra i bersagli dell'ARO.

**DEP-06 — Il koala scatta**
- **Attivo:** nel turno PanOceania, Fusilier (Combi Rifle) *(PanOceania #1)* · MUOVERE, e finisce nella Zona di Controllo del CrazyKoala del Moran
- **ARO:** il CrazyKoala → si attiva da solo; alla domanda *«è dentro la ZdC, con percorso libero?»* rispondi **sì**. Il Fusilier risponde con una SCHIVATA
- **Atteso:** il segnalino compare nella schermata ARO **separato** dalle truppe: non dichiara, si attiva. **TIRO NORMALE**: attivo **Auto**, Schivata del Fusilier a **PH 10** senza il −3 per la LoF, salvezza **ARM VS 6**. Due note, una volta sola ciascuna: *«Se la Schivata riesce, l'attacco è evitato del tutto»* e *«Dopo la detonazione l'arma è rimossa dal gioco»*.

**DEP-07 — Il koala non scatta**
- **Attivo:** nel turno PanOceania, nella Zona di Controllo del CrazyKoala: (a) Zulu-Cobra *(PanOceania #10)* come **Marker CAMO** · MUOVERE; (b) Fusilier *(#1)* · MUOVERE, lasciando **senza risposta** la domanda sulla ZdC
- **ARO:** il CrazyKoala
- **Atteso:** (a) non scatta: *«Non scatta contro Marker Mimetici o Impersonation…»*. (b) non si risolve finché non rispondi: *«Percorso non verificato: chiedere se è libero prima di risolvere.»* Il caso *«un Deployable non ne attiva un altro»* non si costruisce al tavolo (un segnalino non si attiva da solo): sta nel banco.

**DEP-08 — Il segnalino muore**
- **Attivo:** prima, nel turno PanOceania, Fusilier (Forward Observer) *(PanOceania #3)* · IDLE → PIAZZARE EQUIPAGGIAMENTO · Deployable Repeater. Poi, nel turno nomade, Alguacil (Combi Rifle) *(Nomadi #1)* · ATTACCO BS
- **Con:** Combi Rifle
- **Bersaglio:** il Deployable Repeater, a 8-16", senza copertura
- **ARO:** nessuno
- **Atteso:** salvezza **ARM VS 7 ×1** (ARM 0 + PS 7). Se fallisce passa **direttamente a Morto** e si rimuove: *«Un Deployable che entra in Stato Incosciente passa automaticamente a Morto…»*. Controprova: Machinist (Combi Rifle) *(PanOceania #13)* · TECH RECOVERY sul Repeater: rifiutato, *«È un Deployable: passa direttamente a Morto, non c'è nulla da riparare.»*

**DEP-09 — Disco Ball**
- **Attivo:** Kulak (Hacker, Killer Hacking Device) *(Nomadi #23)* · FUOCO SPECULATIVO
- **Con:** Disco Baller (l'unica arma che la schermata offre)
- **Bersaglio:** un punto del tavolo: il Disco Baller è Targetless
- **ARO:** nessuno
- **Atteso:** il Disco Ball non è fra le armi di PIAZZARE EQUIPAGGIAMENTO: nasce solo da un tiro riuscito del Disco Baller, con la Sagoma Circolare Eclipse. Alla Fase Stati si toglie **la Sagoma, non il segnalino**.

**DEP-10 — Minelayer in schieramento**
- **Attivo:** Puppet Masters (Minelayer) *(Nomadi #22)*, nella fase di schieramento
- **Con:** Shock Mine
- **Atteso:** l'app offre solo le armi Deployable e chiede due conferme: nessun nemico né Marker nell'Area d'Innesco; punto dentro la propria Zona di Schieramento. Senza tutte e due non si piazza. Piazzata, la mina arriva all'avversario come **SEGNALINO MIMETICO**. Un secondo piazzamento col Minelayer è rifiutato.

**DEP-11 — La torretta non è scenografia**
- **Attivo:** prima Clockmaker (Armed Turret) *(Nomadi #39)* · IDLE → PIAZZARE EQUIPAGGIAMENTO · Armed Turret. Poi, nel turno PanOceania: Fusilier (Combi Rifle) *(#1)* · ATTACCO BS; Orc (Hacker, Hacking Device) *(#4)* · HACKING; Machinist (Combi Rifle) *(#13)* · DEACTIVATOR
- **Atteso:** l'Armed Turret arriva a PanOceania **a vista**. È fra i bersagli dell'ATTACCO BS e del Deactivator, **non** fra quelli dell'HACKING, e non compare fra gli elementi scenici.

---

# 18. Blocco P — Logistica

**LOG-02 — Ingresso in campo**
- **Attivo:** Spector (Parachutist, Combat Jump) *(Nomadi #29, PH 13)*, in Riserva · INGRESSO IN CAMPO (AD)
- **ARO:** nessuno
- **Atteso:** la schermata mostra **PH 13** con la voce *«PH di <soprannome>: 13»*, poi una domanda bloccante sul punto di atterraggio con **sei divieti** (l'ultimo, solo per il Combat Jump: niente Visibilità Bassa, Pessima o Zero, Fumo ed Eclipse compresi). Finché non rispondi il tasto dice **RISPONDI ALLA DOMANDA**. Prima del tiro il riquadro *SE IL TIRO FALLISCE*: si entra comunque dalla propria Zona di Schieramento, come Modello e senza i Deployable. Controprova: Alguacil (Combi Rifle) *(#1)* non ha la voce.

**LOG-03 — Request Speedball**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1, PH 10)*, poi Squalo Mk-II (MULTI Marksman Rifle) *(PanOceania #12, PH 15)* · REQUEST SPEEDBALL
- **ARO:** nessuno
- **Atteso:** per tutti e due **14**, con la voce *«PH fisso 14: non quello della truppa»*. Servono **due** Token: il primo si sceglie, il secondo si tira sulla tabella (1-3 VITAPACK, 4-6 AUTOREPAIRS, 7-10 SWITCH ON, 11-13 JETPACK, 14-16 OVERKILL, 17-20 NANOSHIELD).

---

# 19. Blocco Q — Fireteam

**FT-01 — Livello = truppe della stessa Unità**
- **Attivo:** Fireteam con Alguacil *(Nomadi #1, #2, #3, #4, #5)* · apri la schermata del Fireteam
- **Atteso:** **LIVELLO 5 (5 membri)** e i cinque bonus.

**FT-02 — Cinque truppe diverse**
- **Attivo:** Fireteam con Alguacil *(#1)*, Grenzer (Marksmanship) *(#11)*, Zero *(#9)*, Daktari *(#6)*, Morlock (Assault Pistol) *(#13)* · apri la schermata del Fireteam
- **Atteso:** **LIVELLO 1 (5 membri)**, con la nota, e nessun bonus.

**FT-03 — Il +1 BS**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)*, in Fireteam con gli Alguacil #2, #3, #4 (Livello 4) · ATTACCO BS
- **Con:** Combi Rifle
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)* a 8-16", copertura no
- **ARO:** nessuno
- **Atteso:** **15**, con le voci *«Gittata: +3»* e *«Fireteam di Livello 4: +1 BS»*. Con un Fireteam di tre Alguacil (Livello 3): **14**. **Difetto aperto** (blocco V): dal Livello 2 il banner scrive *BS Attack (+1 SD)*, ma il dado speciale non arriva al Burst.

**FT-04 — Non vale per lo Scoprire**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* in Fireteam di Livello 4 (#1-#4) · SCOPRIRE
- **Bersaglio:** Croc Man (MULTI Sniper Rifle) *(PanOceania #6)* come Marker CAMO, a 0-8"
- **ARO:** nessuno
- **Atteso:** **13** = 13 +3 −6 +3, con la voce *«Fireteam di Livello 4: +3 Discover»*: c'è il +3 Discover e **non** il +1 BS. La nota dice *«I bonus "BS Attack (+1 SD)" e "+1 BS" NON si applicano a Discover.»* (Per l'HACKING servirebbero quattro Interventor: la prova sta nel banco.)

**FT-05 — Rotture**
- **Attivo:** Fireteam con gli Alguacil #1-#4 · metti all'Alguacil #2, uno per volta, gli stati Incosciente, Morto, Isolato, Soppressione, IMM-A, IMM-B
- **Atteso:** escono dal Fireteam con Incosciente e Morto (causa Stato Nullo), Isolato, Soppressione. **Non** escono con IMM-A e IMM-B, e la nota lo dice.

**FT-06 — Neurocinetics**
- **Attivo:** Sin-Eater (MULTI Sniper Rifle) *(Nomadi #20)* · ATTACCO BS
- **Con:** MULTI Sniper Rifle (AP Mode)
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)* a 24-32", copertura no
- **ARO:** nessuno
- **Atteso:** Burst **1**, voce *«Neurocinetics: Burst 1 in Turno Attivo su tutte le armi BS»*. In ARO (vedi BS-25) la stessa arma ha Burst **2**.

---

# 20. Blocco R — Ordine Coordinato

Tutte le prove: truppe dello stesso Gruppo, dove non è scritto altro. Bersaglio
**Fusilier (Combi Rifle)** *(PanOceania #1)* a 8-16", copertura no.

**CO-01 — Burst della Punta di Lancia**
- **Attivo:** Coordinato con Alguacil (HMG) *(Nomadi #2)* Punta di Lancia, Alguacil (Combi Rifle) *(#1)* e Alguacil (Missile Launcher) *(#3)* · ATTACCO BS
- **Con:** Heavy Machine Gun per la Punta
- **ARO:** nessuno
- **Atteso:** la Punta ha Burst **2**: *«Burst dell'arma Heavy Machine Gun»* e *«Punta di Lancia: metà del Burst arrotondata per eccesso»*.

**CO-02 — Gregari**
- **Attivo:** lo stesso Coordinato di CO-01
- **Con:** Combi Rifle per il #1, Missile Launcher (Blast Mode) per il #3
- **Atteso:** tutti e due Burst **1**, *«Gregario in Ordine Coordinato: Burst 1»*.

**CO-03 — Leader di Fireteam gregario**
- **Attivo:** Fireteam con gli Alguacil #1, #3, #4, #5, Leader il #1. Coordinato con Alguacil (HMG) *(#2)* Punta di Lancia e il #1 gregario · ATTACCO BS
- **Con:** HMG per la Punta, Combi Rifle per il #1
- **Atteso:** per regola il Leader del Fireteam ha il Burst pieno, **3**. **Difetto aperto** (blocco V): oggi leggi **1**.

**CO-04 — Cinque unità**
- **Attivo:** Coordinato con gli Alguacil #1-#5
- **Atteso:** **E41**, *«Ordine Coordinato con 5 unità: il massimo è 4»*.

**CO-05 — Nessuna unità**
- **Attivo:** apri il Coordinato e conferma senza selezionare nessuno
- **Atteso:** **E40**.

**CO-06 — Senza Punta**
- **Attivo:** Coordinato con gli Alguacil #1 e #2, senza designare la Punta di Lancia
- **Atteso:** **E45**, *«Nessuna Punta di Lancia designata»*.

**CO-07 — Punta fuori dal gruppo**
- **Attivo:** in console, un Coordinato con #1 e #2 e come Punta l'Alguacil #3
- **Atteso:** **E46**, *«La Punta di Lancia non è fra le unità selezionate»*.

**CO-08 — Unità non attivabile**
- **Attivo:** Coordinato con #1 Punta e #2 messo **Incosciente**
- **Atteso:** **E42**, col nome dell'Alguacil #2: *«…: Stato Nullo: non può dichiarare Ordini attivi»*.

**CO-09 — Gruppi e Addestramento**
- **Attivo:** (a) #1 nel Gruppo 1 e #2 nel Gruppo 2, Punta il #1; (b) Morlock (Kobra Pistol, DA CC) *(#36, Irregolare)* e Alguacil #1, Punta l'Alguacil; (c) i due Morlock *(#13 e #36)*
- **Atteso:** (a) **E43**, *«Le unità appartengono a 2 Gruppi di Combattimento diversi»*. (b) **E44**, *«Le unità hanno Addestramento diverso: Regolari e Irregolari non possono coordinarsi.»* (c) passa: due Irregolari hanno lo stesso Addestramento.

**CO-10 — Fuori gittata in un Coordinato**
- **Attivo:** Coordinato con Alguacil (Missile Launcher) *(#3)* Punta e Alguacil (Combi Rifle) *(#1)* · ATTACCO BS
- **Bersaglio:** il Fusilier a 48-56": dentro la gittata del Missile Launcher (−3), **FUORI** per il Combi Rifle, che arriva a 48"
- **Atteso:** il #1 va a **Idle** col motivo (Burst 0), la Punta tira. L'Ordine non si blocca e l'ARO resta.

**CO-11 — Coordinato in CC**
- **Attivo:** Coordinato con Morlock (Assault Pistol) *(#13)* Punta, Chimera *(#14)* e Alguacil *(#1)* · ATTACCO CC
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)*, a contatto con tutti e tre
- **Atteso:** tira solo la Punta, Burst **3**, *«Punta di Lancia: +2B per gli alleati»*. I due gregari Burst **0**, *«Gregario in Ordine Coordinato: in mischia non tira»*.

**CO-12 — Un ARO per nemico**
- **Attivo:** Coordinato con gli Alguacil #1 e #2 · MUOVERE
- **ARO:** Fusilier (Combi Rifle) *(PanOceania #1)* → ATTACCO BS, Combi Rifle, a 8-16"
- **Atteso:** l'elenco dei bersagli dell'ARO offre tutti e due gli Alguacil, ma se ne sceglie **uno solo**.

**CO-13 — Command Token**
- **Attivo:** Coordinato con gli Alguacil #1 e #2
- **Atteso:** il promemoria che il Command Token si scala **a mano**.

---

# 21. Blocco S — Schieramento

**SCH-01 — Anti-spoiler**
- **Attivo:** PanOceania schiera Croc Man *(#6)* **Nascosto**, Fusilier (Combi Rifle) *(#1)* normale, Zulu-Cobra *(#10)* **Marker CAMO**, Fusilier (Missile Launcher) *(#2)* in **Riserva**
- **Atteso:** l'app nomade riceve il Fusilier (Combi Rifle), un **SEGNALINO MIMETICO** al posto dello Zulu-Cobra e il Fusilier (Missile Launcher). Il Croc Man non compare.

**SCH-02 — Chi è nascosto non è sul tavolo**
- **Attivo:** con lo schieramento di SCH-01, Alguacil (Combi Rifle) *(Nomadi #1)* · ATTACCO BS, poi SCOPRIRE; Alguacil (Missile Launcher) *(#3)* · ATTACCO BS in Blast Mode sul Fusilier #1
- **Atteso:** il Croc Man non è bersagliabile, non è Scopribile, e la Sagoma non lo prende. Il promemoria dell'Infiltrazione compare anche per lui, col numero: **Tiro a 9 (PH 12 − 3)**.

**SCH-03 — Senza motore non si spedisce**
- **Attivo:** togli lo `<script>` del motore da `app.html` e schiera
- **Atteso:** non parte niente, con un messaggio esplicito.

**SCH-04 — Bersagli solo fra gli schierati**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* · ATTACCO BS
- **Atteso:** l'elenco dei bersagli ha solo le truppe PanOceania schierate.

**SCH-05 — Terreni solo fra quelli in schieramento**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* · ATTACCO BS sul Fusilier #1 · tocca la riga Terreno
- **Atteso:** compaiono solo i cinque terreni del capitolo 1.2, più Fumo ed Eclipse.

---

# 22. Blocco T — Terreni

Tre attaccanti, uno per livello di visore: **senza visore** Alguacil (Combi
Rifle) *(Nomadi #1, BS 11)*; **MSV L1** Grenzer (Forward Observer, Sensor, NCO)
*(#12, BS 13)*, col Combi Rifle; **MSV L2** Intruder (HMG) *(#24, BS 13)*, con
la Heavy Machine Gun. Ognuno · ATTACCO BS sul **Fusilier (Combi Rifle)**
*(PanOceania #1)* a 8-16", copertura no, ARO nessuno; il terreno si sceglie
sulla riga Terreno della scheda del bersaglio. Senza terreno i tre tirano a
**14 B3**, **16 B3** e **13 B4**.

**TER-01 — Bosco (TER_10)**
- **Atteso:** Alguacil **11 B2**, con la voce *«Zona di Saturazione: -1 B. Bassa Visibilità: -3 BS.»*; Grenzer **16 B2**; Intruder **13 B3**. Il −1 al Burst lo prendono tutti: nessun visore toglie la Saturazione.

**TER-02 — Giungla (TER_11)**
- **Atteso:** Alguacil **8 B2** (Pessima Visibilità −6); Grenzer **13 B2**, voce *«Pessima Visibilità: MSV1 riduce a -3 BS.»*; Intruder **13 B3**. Qui L1 e L2 si separano.

**TER-03 — Foresta Primordiale (TER_13)**
- **Atteso:** Alguacil **nessuna LoF**: l'attacco non ha un Valore; Grenzer **10 B2**, voce *«Visibilità Zero: MSV1 permette LoF con -6 BS.»*; Intruder **13 B3**.

**TER-04 — Sala Generatori (TER_17)**
- **Atteso:** Alguacil **14 B2** (solo la Saturazione); Grenzer e Intruder **nessuna LoF**. Il Rumore Bianco punisce chi ha il visore.

**TER-05 — Tempesta (TER_15)**
- **Atteso:** Alguacil **11 B3**, voce *«Bassa Visibilità (dalla Tempesta…): -3 BS.»*, e **nessun** −1 al Burst; Grenzer **16 B3**; Intruder **13 B4**. La Tempesta non è una Zona di Saturazione.

**TER-06 — Lo Speculativo ignora la Visibilità**
- **Attivo:** Marspider (Grenades) *(Nomadi #38, PH 13, nessun visore)* · FUOCO SPECULATIVO; poi lo stesso · ATTACCO BS
- **Con:** Grenades
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)* a 0-8", terreno **TER_10 Bosco**, copertura no
- **ARO:** nessuno
- **Atteso:** Speculativo **10** = 13 +3 −6 fisso, voci *«Gittata: +3»* e *«Fuoco Speculativo: -6 fisso»*: il −3 della Bassa Visibilità **non** c'è. ATTACCO BS **13** = 13 +3 −3, voce *«Zona di Saturazione: -1 B. Bassa Visibilità: -3 BS.»*.

**TER-07 — Saturazione prima dell'allocazione**
- **Attivo:** Alguacil (HMG) *(Nomadi #2)* · ATTACCO BS
- **Con:** Heavy Machine Gun
- **Bersaglio:** Fusilier (Combi Rifle) *(#1)* e Fusilier (Missile Launcher) *(#2)*, a 8-16", terreno **TER_10 Bosco**
- **ARO:** nessuno
- **Atteso:** i dadi da dividere sono **3**, non 4: la Saturazione toglie il dado prima.

**TER-08 — Fumo contro MSV**
- **Attivo:** Intruder (HMG) *(Nomadi #24, MSV L2)* · ATTACCO BS
- **Con:** Heavy Machine Gun
- **Bersaglio:** Fusilier (Combi Rifle) *(#1)* a 16-24", copertura no; sulla riga Terreno scegli prima **Fumo**, poi **Eclipse**
- **ARO:** Fusilier → SCHIVATA
- **Atteso:** col Fumo **TIRO NORMALE**, e la nota che il Fumo non ferma l'MSV L2. Con l'Eclipse **FACCIA A FACCIA**: l'Eclipse ferma anche i visori.

---

# 23. Blocco U — Contratto

L'invio deve essere **bloccato**. Le ER-01…ER-21 si eseguono in console,
modificando la busta prima dell'invio: sono la rete sotto i moduli.

**ER-01 — Un'azione non nel vocabolario**
- **Atteso:** **E01**.

**ER-02 — Un attaccante non nel roster**
- **Atteso:** **E03**.

**ER-03 — Un attacco senza arma**
- **Atteso:** **E07**.

**ER-04 — Un'arma inesistente**
- **Atteso:** **E08** + **A42**; **E09** se manca ogni modo di risoluzione.

**ER-05 — Nessun bersaglio**
- **Atteso:** **E04** + **E20**.

**ER-06 — Un avversario non schierato**
- **Atteso:** **E05**.

**ER-07 — Il bersaglio `generic1` («Bersaglio Primario»)**
- **Atteso:** **E06**.

**ER-08 — Un bersaglio non schierato**
- **Atteso:** **E06**.

**ER-09 — Lo stesso bersaglio due volte**
- **Atteso:** **E12**.

**ER-10 — Un bersaglio non valido per l'azione**
- **Atteso:** **E15** col motivo.

**ER-11 — Nessuna fascia di gittata**
- **Atteso:** **E13**, con l'elenco delle fasce.

**ER-12 — Fascia e MOD incoerenti**
- **Atteso:** avviso **A13**, MOD riallineato: non è un errore.

**ER-13 — Zero dadi**
- **Atteso:** **E20**.

**ER-14 — Più dadi del Burst**
- **Atteso:** **E21**.

**ER-15 — Un Burst oltre 6**
- **Atteso:** **E22**.

**ER-16 — Una difesa con due segnaposto**
- **Atteso:** **E11**.

**ER-17 — Una Soppressione con bersagli**
- **Atteso:** avviso **A10**.

**ER-18 — Un Coordinato con 5 unità**
- **Atteso:** **E31** / **E41**.

**ER-19 — Un deployable con un'arma non piazzabile**
- **Atteso:** **E16**.

**ER-20 — Un deployable con gli usi esauriti**
- **Atteso:** **E17**.

**ER-21 — `creaDeployable` con un nome invece del profilo**
- **Atteso:** **E18**.

**ER-22 — Un attacco valido**
- **Attivo:** Alguacil (Combi Rifle) *(Nomadi #1)* · ATTACCO BS · Combi Rifle sul Fusilier #1 a 8-16"
- **Atteso:** nessun errore, nessun avviso, invio eseguito.

**ER-23 — Come si legge un blocco**
- **Attivo:** il caso di ER-13 (zero dadi)
- **Atteso:** a schermo un messaggio che inizia con **⛔ INVIO BLOCCATO**, un punto per errore. Mai un oggetto JavaScript.

**ER-24 — Un'eccezione in un modulo**
- **Attivo:** in console `window.goToModifiersBS = () => { throw new Error('prova') }`, poi Alguacil (Combi Rifle) *(#1)* · ATTACCO BS fino alla scelta della gittata
- **Atteso:** l'app resta viva, dice quale modulo ha ceduto, e l'Ordine **non** è consumato.

**ER-25 — Avvisi prima del calcolo**
- **Attivo:** il caso di ER-17 (Soppressione con un bersaglio: A10 ha gravità **azione**); alla finestra *«Prima di calcolare…»* tocca **Annulla**
- **Atteso:** la finestra elenca l'avviso col suo messaggio. Annullando, il payload torna con `ok:false` ed errore **UI01**, e niente parte per l'Hub. Controprova: MU-17 con la BREAKER (A50, gravità **nota**) non apre nessuna finestra.

---

# 24. Blocco DIS — Usi Disposable e dado speciale

**DIS-01 — Il Panzerfaust ha due usi**
- **Attivo:** Teutonic Knight (TinBot: Firewall) *(PanOceania #7, BS 13)* · ATTACCO BS, in tre Ordini di seguito
- **Con:** Panzerfaust
- **Bersaglio:** Alguacil (Combi Rifle) *(Nomadi #1)* a 8-16", copertura no
- **ARO:** nessuno
- **Atteso:** **13** B1, salvezza **ARM VS 7 ×3**. Dopo il primo colpo resta **1** uso, dopo il secondo **0**; al terzo Ordine il Panzerfaust è bloccato, *«usi esauriti»*.

**DIS-02 — Il (+1B) costa due usi, il (+1SD) uno**
- **Attivo:** Triphammer *(Nomadi #30, BS 13)* · ATTACCO BS; poi Spector (Parachutist, Combat Jump) *(Nomadi #29)* · FUOCO SPECULATIVO
- **Con:** Panzerfaust (+1B) per il Triphammer; Drop Bears (+1SD) per lo Spector
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)* a 0-8", copertura no
- **ARO:** nessuno
- **Atteso:** Triphammer: **2** dadi, voci *«Burst dell'arma Panzerfaust · BS Attack (+1B): +1 Burst in Turno Attivo»*, Successo al **10** (13 −3). Dopo il colpo il Panzerfaust è a **2 su 2** usi spesi. Spector: Burst **1** più un dado speciale, e si spende **un** uso su 3.

**DIS-03 — Una Schivata non consuma**
- **Attivo:** Fusilier (Combi Rifle) *(PanOceania #1)* · ATTACCO BS sul Triphammer *(Nomadi #30)*
- **ARO:** Triphammer → SCHIVATA
- **Atteso:** gli usi del Panzerfaust non cambiano.

**DIS-04 — Scarico è l'arma, non la truppa**
- **Attivo:** Zero (Hacker, Killer Hacking Device) *(Nomadi #9)*, rivelato, dopo tre Shock Mine piazzate (DIS-06) · IDLE → PIAZZARE EQUIPAGGIAMENTO
- **Atteso:** la Shock Mine è bloccata, *«usi esauriti»*, e il messaggio nomina lo stato **Scarico** e come si toglie (Reload, nella ZdC di un alleato con Baggage). Le altre armi dello Zero restano usabili.

**DIS-05 — Il dado speciale si vede**
- **Attivo:** Intruder (MULTI Sniper Rifle) *(Nomadi #10)*, rivelato · ATTACCO BS
- **Con:** MULTI Sniper Rifle (AP Mode) (+1SD)
- **Bersaglio:** prima Fusilier (Combi Rifle) *(PanOceania #1)*; poi Fusilier #1 e Orc #4 insieme; a 24-32", copertura no
- **ARO:** nessuno
- **Atteso:** fra i MOD *«tira 1 dado in più, poi scartane 1»*, e il Burst dell'arma **non** cresce. Con due bersagli il dado va a **uno solo**. Controprova: Alguacil (Combi Rifle) *(#1)*: Burst 3 e nessuna frase. Terza strada: Wolfgang Amadeus *(#26)* in ATTACCO CC con la DA CC Weapon, nota *«Martial Arts L3: (+1 SD)…»*.

**DIS-06 — Tre mine, e la quarta no**
- **Attivo:** Zero (Hacker, Killer Hacking Device) *(Nomadi #9)*, rivelato · IDLE → PIAZZARE EQUIPAGGIAMENTO, in quattro Ordini
- **Con:** Shock Mine
- **ARO:** nessuno
- **Atteso:** tre mine piazzate, usi spesi 1, 2, 3 anche riaprendo il menu. Il terzo uso **non** è respinto all'invio. Al quarto la mina è bloccata, nessun segnalino nuovo, niente parte per l'Hub.

---

# 25. Blocco DET — Detonazione e Schivata

Per DET-01…03: Puppet Masters (Minelayer) *(Nomadi #22)* ha una **Shock Mine**
già sul tavolo. Nel turno PanOceania si muove il **Fusilier (Combi Rifle)**
*(PanOceania #1, PH 10)* dentro l'area d'innesco.

**DET-01 — La mina detona e chi l'ha innescata schiva**
- **Attivo:** Fusilier *(PanOceania #1)* · MUOVERE → SCHIVATA
- **ARO:** la Shock Mine → DETONAZIONE, contro il Fusilier
- **Atteso:** a sinistra **SCHIVATA (Tiro Normale) 7** (PH 10 −3), sotto la salvezza della mina con la sua munizione.

**DET-02 — Senza Schivata dichiarata**
- **Attivo:** Fusilier *(PanOceania #1)* · MUOVERE → MUOVERE
- **ARO:** la Shock Mine → DETONAZIONE
- **Atteso:** **NESSUNA SCHIVATA**: l'app non la presume.

**DET-03 — Il −3 viene dalla Sagoma**
- **Attivo:** nel turno PanOceania, Fusilier *(#1)* · MUOVERE → SCHIVATA, nella ZdC del CrazyKoala del Moran *(Nomadi #19)*
- **ARO:** il CrazyKoala → DETONAZIONE
- **Atteso:** Schivata **10**, PH pieno: il koala non è una Sagoma. Se leggi 7, il −3 è dato a tutti i deployable.

**DET-04 — Le tre domande dell'innesco**
- **Attivo:** la Shock Mine della Puppet Masters, in DETONAZIONE contro il Fusilier #1; poi Krakot Renegade *(Nomadi #31)* e Bambabot-1 *(#32)*: apri il loro menu
- **Atteso:** tre domande bloccanti: un nemico nell'area d'innesco; solo il movimento di una Schivata o di un Guts fallito; un alleato sotto la Sagoma, anche Incosciente. Con una risposta mancante la detonazione non scatta e l'app lo dice. Krakot e Bambabot-1: niente PIAZZARE EQUIPAGGIAMENTO.

**DET-05 — Il segnalino esce dal tavolo**
- **Attivo:** dopo DET-01, guarda il tabellone e riapri l'app; poi passa alla Fase Stati
- **Atteso:** la mina sparisce dal tabellone e dalla copia locale, e non torna riaprendo.

**DET-06 — Le D-Charges detonano nello stesso Ordine**
- **Attivo:** Moran *(Nomadi #19)*, schierato come Modello · IDLE → PIAZZARE EQUIPAGGIAMENTO
- **Con:** D-Charges (Demolition Mode)
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)* messo **IMM-A**. Un Fusilier sano è fra i *Non ammessi*, col motivo
- **ARO:** nessuno
- **Atteso:** detonano subito, senza tiro, e nel roster non resta nessun segnalino. Sul tabellone il lato reattivo è il Fusilier: **SUBISCE L'ESPLOSIONE**, **3 Tiri Salvezza su ARM: riesce con 7 o meno**. Nessun E16, nessun E20. La terza carica parte, la quarta è bloccata.

---

# 26. Blocco RIP — Riprendere una partita

**RIP-01 — L'Hub riaperto**
- **Attivo:** a metà partita chiudi la pagina dell'Hub e riaprila
- **Atteso:** niente si cancella. L'Hub non trasmette finché non ha letto il server; poi tornano roster, fazione attiva, scenario e ferite.

**RIP-02 — Lettura non riuscita**
- **Attivo:** stacca la rete e riapri l'Hub
- **Atteso:** riquadro **PARTITA NON LETTA DAL SERVER**, nessuna trasmissione, un nuovo tentativo ogni quattro secondi.

**RIP-03 — RIPRENDI PARTITA**
- **Attivo:** apri l'app (a) con una copia locale; (b) dopo un reset dall'Hub; (c) con un allarme ARO pendente
- **Atteso:** (a) il pulsante c'è; (b) non c'è e la copia è dimenticata; (c) avvisa, e l'allarme resta sul server.

**RIP-04 — Una copia vecchia**
- **Attivo:** riapri l'app con una copia locale senza il campo dei segnalini
- **Atteso:** si carica, zero segnalini, nessun errore.

---

# 27. Blocco ORD — Ordini senza tiro con una domanda davanti

**ORD-01 — Piazzare equipaggiamento**
- **Attivo:** Moran *(Nomadi #19)* · IDLE → PIAZZARE EQUIPAGGIAMENTO · CrazyKoalas
- **Atteso:** le domande sono bloccanti: senza una risposta non si esegue. È il modello della famiglia (DEP-02, DET-04).

**ORD-02 — Cybermask**
- **Attivo:** Interventor (Hacker Plus) *(Nomadi #8)*; Zero (Hacker, Killer Hacking Device) *(#9)*, schierato Marker; Orc (Hacker, Hacking Device) *(PanOceania #4)*; Alguacil (Combi Rifle) *(Nomadi #1)* · apri il menu e, dove c'è, CYBERMASK
- **ARO:** nessuno
- **Atteso:** la voce c'è per Interventor e Zero (anche da Marker). Non c'è per l'Orc né per l'Alguacil: *«Serve il programma Cybermask: Hacking Device Plus o Killer Hacking Device.»* Toccandola, una domanda: *«L'Hacker è FUORI dalla Linea di Tiro di ogni Modello e di ogni Marker nemico?»*. **SÌ**: entra in IMP-2 senza tiro, Ordine speso. **NO**: Idle, Ordine speso. **Senza risposta**: non si esegue. La voce sparisce all'hacker **Isolato** e a chi è già in Impersonation.

**ORD-03 — Rientrare in CAMO**
- **Attivo:** Intruder (HMG) *(Nomadi #24)*, prima Marker, poi rivelato; Moran *(#19)*, schierato Marker e poi rivelato; Alguacil (Combi Rifle) *(#1)* · apri il menu
- **ARO:** nessuno
- **Atteso:** la voce si chiama **RIENTRARE IN CAMO**. Intruder Marker: non c'è, *«È già in forma di Marker.»* Intruder rivelato: c'è; la domanda sulla LoF ha i tre esiti di ORD-02 (SÌ torna Marker, NO Idle, senza risposta niente). Moran rivelato: non c'è, *«Camouflage (1 Use): lo stato CAMO è già stato usato in questa partita (F07).»* Alguacil: *«Serve l'Abilità Camouflage.»* Per vedere il Moran rientrare una volta, schieralo come Modello.

---

# 28. Blocco SP — Scoprire + Piazzare, e il Coordinato con lo Scoprire

Il **Marker avversario** di queste prove è lo **Zulu-Cobra (Triangulated Fire,
Sensor)** *(PanOceania #10)* schierato come Marker CAMO, a 0-8". Chi piazza è
la **Puppet Masters (Minelayer)** *(Nomadi #22)*, con la **Shock Mine**.

**SP-01 — Dopo lo Scoprire il menu offre il Piazzare**
- **Attivo:** Puppet Masters *(Nomadi #22)* · SCOPRIRE → guarda il menu della seconda metà
- **Bersaglio:** lo Zulu-Cobra (Marker)
- **ARO:** nessuno
- **Atteso:** fra le seconde metà ci sono PIAZZARE EQUIPAGGIAMENTO e ATTACCO BS; non un secondo SCOPRIRE.

**SP-02 — In un Coordinato il Piazzare non si offre**
- **Attivo:** Coordinato con gli Alguacil *(Nomadi #1 e #2)* · SCOPRIRE → guarda il menu della seconda metà
- **Bersaglio:** lo Zulu-Cobra (Marker)
- **ARO:** nessuno
- **Atteso:** c'è ATTACCO BS, non PIAZZARE EQUIPAGGIAMENTO. Nel menu della prima metà non ci sono Fuoco Speculativo né Attacco Intuitivo.

**SP-03 — Prima lo Scoprire, poi il piazzamento**
- **Attivo:** Puppet Masters *(#22)* · SCOPRIRE → PIAZZARE EQUIPAGGIAMENTO
- **Con:** Shock Mine
- **Bersaglio:** lo Zulu-Cobra (Marker), copertura no
- **ARO:** nessuno
- **Atteso:** prima la schermata dello Scoprire, col tasto **AVANTI: PIAZZA EQUIPAGGIAMENTO**; poi l'arma e le domande del piazzamento, col tasto **PIAZZA**.

**SP-04 — Sul tabellone lo Scoprire viene prima**
- **Attivo:** come SP-03, rispondendo **no** alla domanda sul Marker nell'area d'innesco
- **ARO:** nessuno
- **Atteso:** un solo invio, due righe: **SCOPRIRE** sopra, **PIAZZARE EQUIPAGGIAMENTO** (*ABILITÀ SENZA TIRO*) sotto. Nessun avviso. Il segnalino finisce nel roster nomade.

**SP-05 — Marker nell'area d'innesco: piazzamento condizionato**
- **Attivo:** come SP-03, rispondendo **sì** alla domanda sul Marker nell'area d'innesco
- **ARO:** nessuno
- **Atteso:** compare una seconda domanda. Sul tabellone, a vista, **PIAZZAMENTO CONDIZIONATO** col nome del segnalino e del Marker, e **tira PRIMA questo Scoprire** sulla riga dello Scoprire.

**SP-06 — Senza Marker nell'area la nota non c'è**
- **Attivo:** come SP-04
- **Atteso:** nessun PIAZZAMENTO CONDIZIONATO e nessun *tira PRIMA*.

**SP-07 — Coordinato con tre partecipanti**
- **Attivo:** Coordinato con gli Alguacil *(#1, #2, #3)* · SCOPRIRE → ATTACCO BS
- **Con:** l'arma di ciascuno
- **Bersaglio:** lo Zulu-Cobra (Marker), a 8-16"
- **ARO:** nessuno
- **Atteso:** l'Ordine parte: sei voci, nessun errore sul numero di unità.

**SP-08 — Coordinato con cinque partecipanti**
- **Attivo:** Coordinato con gli Alguacil *(#1-#5)* · SCOPRIRE → ATTACCO BS
- **Atteso:** rifiutato: *«Ordine Coordinato con 5 unità: il massimo è 4»* (cinque, non dieci).

**SP-09 — Il reattivo deve rispondere**
- **Attivo:** come SP-04
- **ARO:** il giocatore PanOceania prima non tocca niente, poi tocca **NESSUN ARO**
- **Atteso:** finché non risponde l'Hub non calcola e il tabellone resta vuoto; appena risponde, lo scontro compare.

**SP-10 — Reagisce il Marker stesso**
- **Attivo:** come SP-05
- **ARO:** lo Zulu-Cobra → ATTACCO BS, Combi Rifle, a 0-8", contro la Puppet Masters
- **Atteso:** sulla schermata dello Scoprire il nome vero e il riquadro **SCOPRIRE: NON SI TIRA** (*«… si è rivelato da solo (ha dichiarato un ARO)…»*). Sul tabellone tre scontri: lo Scoprire che non si tira, il piazzamento condizionato, l'ARO come Tiro Normale. Il *tira PRIMA* non c'è.

**SP-11 — Coordinato con quattro partecipanti**
- **Attivo:** Coordinato con gli Alguacil *(#1-#4)*, Punta il #2 (HMG) · SCOPRIRE → ATTACCO BS
- **Bersaglio:** lo Zulu-Cobra (Marker), a 8-16"
- **ARO:** nessuno
- **Atteso:** otto scontri; Burst **2** alla Punta, **1** ai gregari.

---

# 29. Blocco SG — La Sagoma e i tuoi alleati

Per arma senza Sagoma la domanda è *«quanti tuoi alleati in quella mischia»*
(tasti 0, 1, 2, 3+) e compare solo se il bersaglio è Ingaggiato. Per arma a
Sagoma è *«la Sagoma prende anche un tuo alleato?»* (tasti **NO** verde, **SÌ**
giallo) e compare sempre. Per Fumo ed Eclipse non c'è domanda.

**SG-01 — Senza Sagoma: quattro tasti, e solo in mischia**
- **Attivo:** Intruder (HMG) *(Nomadi #24)* · ATTACCO BS
- **Con:** Heavy Machine Gun
- **Bersaglio:** Fusilier (Combi Rifle) *(PanOceania #1)* **Ingaggiato**, a 8-16", copertura no
- **ARO:** nessuno
- **Atteso:** la domanda con i tasti 0, 1, 2, 3+, che parte da **1**. Con il Fusilier non Ingaggiato la domanda non c'è.

**SG-02 — Senza Sagoma: il tetto a −12**
- **Attivo:** Intruder (HMG) *(Nomadi #24, BS 13)* · ATTACCO BS
- **Con:** Heavy Machine Gun
- **Bersaglio:** Fusilier *(#1)* **Ingaggiato**, a 8-16" (fascia 0 dell'HMG), copertura no
- **ARO:** nessuno
- **Atteso:** con 1 alleato **7** (13 −6); con 2 **1** (13 −12); con 3+ ancora **1**, e compare la voce **MOD minimo −12**.

**SG-03 — A Sagoma: SÌ/NO, anche fuori dalla mischia**
- **Attivo:** Alguacil (Missile Launcher) *(Nomadi #3)* · ATTACCO BS
- **Con:** Missile Launcher (Blast Mode)
- **Bersaglio:** Fusilier *(#1)* non Ingaggiato, a 24-32", copertura no
- **ARO:** nessuno
- **Atteso:** la domanda c'è, parte da **NO**, nomina il neutrale e il Marker Impersonation nemico, e dice *«anche passato nell'area durante l'Ordine»*. I tasti 0/1/2/3+ non ci sono.

**SG-04 — A Sagoma su una mischia: parte da SÌ**
- **Attivo:** Alguacil (Missile Launcher) *(Nomadi #3)* · ATTACCO BS
- **Con:** Missile Launcher (Blast Mode)
- **Bersaglio:** Fusilier *(#1)* **Ingaggiato**, a 24-32"
- **ARO:** nessuno
- **Atteso:** la stessa domanda, che parte da **SÌ**.

**SG-05 — SÌ: annullato per tutti**
- **Attivo:** Alguacil (Missile Launcher) *(Nomadi #3)* · ATTACCO BS
- **Con:** Missile Launcher (Blast Mode); rispondi **SÌ**
- **Bersaglio:** Fusilier (Combi Rifle) *(#1)* **Ingaggiato** come Principale, a 24-32"; Fusilier (Missile Launcher) *(#2)* non Ingaggiato sotto la stessa Sagoma
- **ARO:** nessuno
- **Atteso:** nessun dado e nessun Tiro Salvezza per tutti e due. Sul #1 *«SAGOMA SU UNA MISCHIA CON UN TUO ALLEATO»*, sul #2 *«UN TUO ALLEATO, UN NEUTRALE O UN MARKER IMPERSONATION SOTTO LA SAGOMA»*. Tutte e due dicono che gli ARO restano e che l'uso Disposable si consuma.

**SG-06 — NO: il colpo vale**
- **Attivo:** come SG-04, rispondendo **NO**
- **Atteso:** il colpo vale, e nei dettagli *«Bersaglio Ingaggiato, ma nessun tuo alleato né neutrale sotto la Sagoma: il colpo vale.»*

**SG-07 — Colpo unico: una domanda sola**
- **Attivo:** Intruder (Hacker, Killer Hacking Device) *(Nomadi #25)*, rivelato · FUOCO SPECULATIVO; poi Vertigo Zond *(#28)* · ATTACCO GUIDATO
- **Con:** Grenades per l'Intruder; Missile Launcher (Blast Mode) per il Vertigo
- **Bersaglio:** Fusilier (Combi Rifle) *(#1)* **Ingaggiato** e **Bersagliato** come Principale; Fusilier (Missile Launcher) *(#2)* **Ingaggiato** sotto la Sagoma; a 8-16"
- **ARO:** nessuno
- **Atteso:** la domanda compare una volta, sulla scheda del Principale. Rispondendo **NO** il colpo vale per tutti e due.

**SG-08 — Fumo: nessuna domanda**
- **Attivo:** Morlock (Assault Pistol) *(Nomadi #13)* · ATTACCO BS
- **Con:** Smoke Grenades
- **Bersaglio:** il Fusilier *(#1)* **Ingaggiato**, a 8-16"
- **ARO:** nessuno
- **Atteso:** nessuna domanda, nessun annullamento, nessun −6. Nei dettagli: l'arma è **Targetless**.

**SG-09 — Due Sagome: ognuna vale per sé**
- **Attivo:** Grenzer (Forward Observer, Sensor, NCO) *(Nomadi #12)* · ATTACCO BS
- **Con:** Light Flamethrower(+1B): Burst 2, cioè **2 Sagome**
- **Bersaglio:** Fusilier (Combi Rifle) *(#1)* **Ingaggiato**, sotto **1** Sagoma, e rispondi **SÌ**; Fusilier (Missile Launcher) *(#2)* non Ingaggiato, sotto **1** Sagoma, e rispondi **NO**
- **ARO:** nessuno
- **Atteso:** in testa *«2 SAGOME: per ogni bersaglio indica da quante Sagome è preso (da 1 a 2)»*. Il #1 è annullato; il #2 è colpito, senza tiro (Sagoma Diretta), e fa **un** Tiro Salvezza. Portando il #2 a **2** Sagome fa **due** Tiri Salvezza, e la nota lo dice: *«…Questo bersaglio è preso da 2: un Tiro Salvezza per ciascuna.»*

**SG-10 — Il secondario arriva sul tabellone**
- **Attivo:** Vertigo Zond *(Nomadi #28)* · ATTACCO GUIDATO
- **Con:** Missile Launcher (Blast Mode)
- **Bersaglio:** Fusilier (Combi Rifle) *(#1)* **Bersagliato** come Primario, a 24-32"; Fusilier (Missile Launcher) *(#2)* sotto la Sagoma
- **ARO:** nessuno
- **Atteso:** due scontri sul tabellone, ognuno col suo nome. Il Faccia a Faccia e il Critico restano del solo Primario.

---

# 30. Quello che i banchi già tengono

Questi comportamenti hanno un banco che li misura a ogni giro: al tavolo non
serve ripeterli. Se un numero al tavolo li contraddice, il banco da guardare è
quello indicato.

| Area | Banco |
|---|---|
| Rientro in CAMO e Cybermask: i tre esiti, Frenzy, Isolato | `test_camo_cybermask.js` |
| Hacker, Firewall, ECM, Repeater, Fairy Dust | `test_hacking_firewall.js`, `test_modulo_hacking.js` |
| Classi d'azione, Stati, Foxhole | `test_stati_classi_foxhole.js` |
| Ordini senza tiro e adattatore del tabellone | `test_ordini_senza_tiro.js`, `test_adattatore.js` |
| Un allarme per Ordine, il giro a tre dispositivi | `test_allarme_una_volta.js`, `test_giro_aggiornamento.js` |
| Bersagli dello Speculativo e del Guidato | `test_modulo_speculativo.js`, `test_modulo_guidato.js` |
| Total Control, Coordinato col SALTO, Schieramento Nascosto, successo automatico | `test_sei_casi.js` |
| Requisiti dichiarati al tavolo (lof, gittata, sagoma, contatto, area) | `test_novita_7ott.js` e i banchi dei moduli |
| Le cinque spazzate sul database (armi, bande, salvezze, notazioni, deployable) | `test_coerenza_dati.js` sezioni 8-12 |
| Il conteggio di questo piano e le unità del roster | `test_piano_schieramento.js` |

Una trappola da sapere scrivendo una prova nuova: la chiave di un requisito non
è il nome del campo. `gittata` legge `fuoriGittata` (manca se **true**),
`sagoma` legge `fuoriSagoma`, `area` legge `inArea`.

---

# 31. Difetti aperti

| Difetto | Prova | A chi |
|---|---|---|
| Il Burst reattivo in Soppressione esce 1 invece di 3 quando il reattivo è bersaglio di un attacco | BS-12 | MOTORE |
| Il +1 SD del Fireteam di Livello 2 non arriva al Burst | FT-03 | MOTORE |
| Il filtro del Supporto non distingue VITA da STR | SUP-05 | MOTORE |
| Il Leader di un Fireteam gregario di un Coordinato va a Burst 1 | CO-03 | MOTORE |
| A58 non elenca gli strumenti attesi | SUP-06 | MOTORE |
| Deployable Cover (Cutting Foam) e (Vitroferro) disegnano lo stesso bottone | — (`test_bottone_arma.js` sez. 11) | MOTORE |
| `M.esitoTerreni` ha due implementazioni che non danno lo stesso esito | — (`test_terreni_combinati.js` sez. 8) | MOTORE |
| Con un MSV3 la nota del terreno dice "MSV2" | — (`test_terreni_combinati.js`) | MOTORE |
| `profiloArma` scrive munizione N dove il database ha `null` (Deployable Cover) | — | MOTORE |
| La gittata del Missile Launcher in TPL-04: da confermare con la foto della schermata | TPL-04 | Paolo |

**Divergenze che restano per una ragione:** le mine non sanno se detonano (il
motore risponde *non lo so* e l'app chiede di toglierle a mano: → DATABASE);
*un pilota, un segnalino* è una lettura e non una regola (→ REGOLE); il
recupero parziale di una partita senza copia locale non esiste, e potrebbe
recuperare solo le unità visibili (→ INTERFACCIA); due identificativi ignoti,
`?219` sul Monstrucker e `?227` su Shona Carano (→ DATABASE).

---

# 32. Ordine di esecuzione

1. **Preflight.** Se PRE-01 o PRE-02 falliscono, fermati. Dopo ogni
   sostituzione di file, prima di tutto: `node test_caricamento_pagine.js`.
2. **RIP**: se l'Hub non riapre bene, il resto si gioca su una partita che può
   cancellarsi.
3. **A, B, C**.
4. **U** (contratto).
5. **DIS**.
6. **M, N** (stati).
7. **O, DET** (deployable e detonazione).
8. **D, E, F, G, H, I, J, K, L, P, ORD**, un blocco per sessione.
9. **Q, R, S, T, SP, SG**: servono uno schieramento dedicato.
10. Il capitolo 31: riconferma i difetti aperti.

Segna ogni fallimento con: codice, unità e stato, cosa hai letto, cosa ti
aspettavi. Quando un numero non torna, guarda prima il dato di prova.
