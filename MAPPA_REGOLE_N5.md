<!-- @versione 2026-09-23.1 | MAPPA_REGOLE_N5.md | proprieta`: chat REGOLE -->

# MAPPA REGOLE INFINITY N5 — riferimento per il calcolatore

> Documento di lavoro costruito verificando ogni voce dal PDF ufficiale inglese N5 v5.1.1.

> ⚠️ **VERSIONE DEL TESTO.** REGOLE_N5_v5_1_1.txt è la **v5.1.1**, superata dalla 5.2 (ottobre 2025) e dalla 5.3 (settembre 2026). Le modifiche che toccano il calcolo, **riportate dalla chat REGOLE** e **non verificabili sul testo del progetto**:
> - **5.3** — CC con **2 o più** truppe in contatto (prima "più di 2").
> - **PARA CC Weapon**: ~~passata a (-6) in 5.3~~ **ritirata**. Era una lettura sbagliata del changelog: il (-6) è un *esempio di notazione*, non un nuovo valore. Il numero fra parentesi è **per profilo** (negli elenchi ufficiali convivono -3, -6, -9) ed è un MOD al **Faccia a Faccia dell'avversario**, non alla salvezza, che resta **PH-6** (righe 5713-5715, 9270-9282, 15214).
> - **5.2** — Surprise Attack si applica solo ai **Faccia a Faccia** dei bersagli in ARO (la v5.1.1 dice "any Skill Roll": righe 10134-10137). Un Reset o una Schivata con Tiro Normale non lo subiscono. **Applicato** (decisione di Paolo, 21 settembre: dove PDF 5.1.1 e wiki divergono, vale la wiki N5.3 + FAQ).
> - **5.2** — Guidato senza modalità circolare: si applica comunque la Sagoma Circolare centrata sul bersaglio.
> - **Regola di precedenza** — dove il PDF 5.1.1 e la wiki divergono, vale la **wiki** (N5.3 + FAQ). Decisione di Paolo, 21 settembre 2026. Le FAQ si citano con gli ID di FAQ_N5_INDICE.md.
> - **FAQ N5** — Intuitivo, Speculativo e Forward Observer contano come BS Attack per (SR-1), (AP), (+1 SD); il +1 SD mai sulle Long Skill.
> **File collegati** (chat REGOLE): `PRONTUARIO_ORDINI_N5.md`, richiamo rapido ordine per ordine con la matrice MOD; `FAQ_N5_INDICE.md`, indice delle FAQ della wiki con gli ID F01–F18 da citare nel codice.
> Scopo: avere una fonte precisa e consultabile per correggere l'app, invece di andare a memoria.
> Ogni valore qui è stato letto dal regolamento, non ricordato.

---

## MECCANICHE DI BASE (fondamentali, valgono per tutto)

- **Success Value (SV)** = Attributo + tutti i MOD applicabili. Si tira 1d20: risultato **uguale o inferiore** al SV = successo.
- **MOD massimo cumulativo**: ±12. Somme oltre vengono troncate a +12 / -12.
- **SV sotto 1**: fallimento automatico, non si tira.
- **SV sopra 20**: i risultati eccedenti allargano il range del Critico (es. SV 23 → critico su 20, 1, 2, 3).
- **Arrotondamento**: SEMPRE per eccesso (metà di 5 = 3).
- **Critico**: risultato del dado = SV esatto. Nei Faccia a Faccia il critico vince sempre; doppio critico = pareggio (entrambi falliscono). Ogni critico in attacco = **+1 Tiro Salvezza aggiuntivo** per il bersaglio.
- **Tiro Normale vs Faccia a Faccia**: si fa un **Faccia a Faccia SOLO se la skill dichiarata dal bersaglio influenza l'esito dell'attacco** (es. il bersaglio dichiara BS Attack, Dodge, Reset...). Se il bersaglio non reagisce o fa qualcosa che non contrasta l'attacco → l'attaccante fa un **Tiro Normale**.
- **Sequenza Ordine**: 1. Attivazione (1.1 spesa ordine, 1.2 dichiarazione 1ª Skill) → 2. ARO Check → 3. dichiarazione 2ª Skill → 4. ARO Check + dichiarazione ARO → 5. Risoluzione (verifica Requisiti, misura gittate, applica MOD, si tira) → 5.1 Effetti (Tiri Salvezza, movimento Dodge) → 5.2 Conclusione (Guts Roll). I Requisiti si verificano in fase 5, non alla dichiarazione (eccezioni: Alert!, Basic Short Skills, Jump, Climb → alla dichiarazione).
- **Burst in ARO**: sempre ridotto a 1, salvo regole/skill che lo modificano (es. Total Reaction, Suppressive Fire).
- **Regola generale**: quando più skill si applicano, vince sempre l'opzione più restrittiva.

## TIPI DI ARMA
- **BS Weapons**: hanno Gittate e Range MOD, oppure usano un Template.
- **Melee Weapons**: solo CC, possiedono il Tratto CC.
- **Mixed Weapons**: hanno Gittate/Range MOD MA anche il Tratto CC (due modalità d'uso).
- **Deployable Weapons**: si piazzano sul tavolo e diventano un elemento indipendente (Tratto Deployable Weapon). → doppio profilo nel DB.
- **BS Weapons (PH)**: come BS ma usano PH invece di BS (tutti i MOD BS si applicano a PH).
- **BS Weapons (WIP)**: come BS ma usano WIP invece di BS. Non combinabili con BS Attack (Shock).

## SINTASSI PROFILO UNITÀ (come leggere/scrivere il database)
- Special Skill mostrata accanto al nome del Trooper.
- Equipaggiamento tra parentesi tonde accanto al nome/skill: es. `Hacker (Hacking Device)`.
- `|` separa le armi BS dall'Equipaggiamento nella colonna armi.
- `||` separa le Periferiche da armi/equip.
- Armi CC (o armi utilizzabili sia BS che CC) stanno nella colonna Melee Weapons.

---

## BLOCCO 1 — COMMON SKILLS (abilità base, ogni truppa può usarle)

### BS Attack
Attacco a distanza. Regole complete nel Combat Module. → gittata/copertura/mimetismo/munizioni gestiti dal motore.

### CC Attack
Attacco in mischia contro bersaglio in contatto Silhouette. Usa attributo CC.

### Cautious Movement
Basic Short Skill. Permette di muoversi senza generare ARO nemici in situazioni specifiche. NON dichiarabile da unità in stato Bersagliato o con la skill Aerial. Nessun tiro.

### Climb
Common Skill per scalare superfici verticali. Movement Module.

### Discover (Scoprire)
- **Etichetta**: Basic Short Skill / ARO.
- **Requisiti**: LoF al bersaglio; non usabile due volte contro lo stesso bersaglio nello stesso Ordine.
- **Tiro**: Normale su WIP, applicando gli stessi MOD di un Attacco BS (Copertura, Gittata, Mimetismo).
- **GITTATA PROPRIA del Discover** (diversa dalle armi!): +3 a 8" / 0 a 32" / -3 a 48" / -6 a 96".
- Combinabile con altre Basic Short Skill/Short Skill (es. Discover + Attack).
- Se il bersaglio Camo dichiara ARO rivelandosi, NON serve il tiro Discover prima di risolvere l'attacco. Se non dichiara ARO, serve passare Discover prima di risolvere l'attacco.

### Dodge (Schivata)
- **Etichetta**: Short Skill / ARO. Movement.
- **Requisiti**: essere il Trooper Attivo, OPPURE in Turno Reattivo se autorizzato a dichiarare ARO.
- **Effetti**: Faccia a Faccia per evitare TUTTI gli attacchi in un Ordine/ARO indipendentemente dal Burst. Usa PH contro l'attributo dell'attaccante (BS/CC/PH/WIP). Se non c'è Faccia a Faccia (es. non attaccato, o colpito da Template Diretto) → Tiro Normale su PH.
- **Dodge NON evita gli Attacchi Comms (Hacking)** — per quelli serve Reset.
- Successo → muove fino a 2 pollici (durante fase Effetti; non genera ARO né attiva Deployable). Può entrare in stato Engaged.
- Malus -3 PH se manca la LoF verso l'attaccante (verificato altrove nelle regole).

### Idle
Non fa nulla (passa). Usato quando i Requisiti di una skill dichiarata non sono soddisfatti.

### Alert! (riga 6769)
AUTOMATIC SKILL, senza tiro. Requisiti: la truppa NON è stata attivata da un Ordine o ARO in quello stesso Ordine, e lei o un alleato nella sua ZdC è stata bersaglio di un Attacco. Effetto: alla Conclusione dell'Ordine, DOPO i Tiri Salvezza, può ruotare sul posto senza spostarsi per cambiare l'angolo di LoF. Automatico, nessun tiro, non genera ARO.

### Jump (riga 2737)
LONG SKILL. Requisiti verificati alla dichiarazione: deve poter raggiungere un punto d'atterraggio orizzontale. Con Super-Jump diventa Basic Short Skill (vedi sotto); con Climbing Plus la scalata è un'Abilità Breve.

### Look Out! (riga 7506)
ARO, senza tiro per chi la dichiara. Requisito: LoF verso un nemico o Marker che dichiara o esegue un Ordine. Effetto: TUTTE le altre truppe dello stesso giocatore possono modificare la propria LoF senza spostarsi, come se avessero dichiarato un ARO — con una **Schivata (PH-3)**: Tiro Normale, oppure Faccia a Faccia se la truppa allertata è bersaglio di un Attacco evitabile con la Schivata. Solo per chi non ha già dichiarato un altro ARO.

### Move (Movimento)
Basic Short Skill. Movimento base. Non richiede tiro. Genera potenziali ARO.

### Place Deployable
Piazza un elemento deployable (mina, ripetitore, ecc.) sul tavolo.

### Request a Speedball
Skill legata agli scenari (richiamo equipaggiamento). Non rilevante per il calcolo tiri.

### Reload (riga 7619)
SHORT SKILL / ARO. Annulla lo Stato Scarico (Unloaded). Requisiti: la truppa è in Stato Scarico o ha speso usi di armi Disposable, e deve trovarsi nella ZdC di un alleato che lo consenta.

### Reset
- **Etichetta**: Short Skill / ARO. No LoF (non serve linea di tiro).
- **Requisiti**: essere il Trooper Attivo, OPPURE in Turno Reattivo se autorizzato a dichiarare ARO.
- **Effetti**: Faccia a Faccia SOLO contro Attacchi Comms (Hacking) e Attacchi BS (Guidato), indipendentemente dal Burst. Usa WIP contro WIP dell'attaccante. Se non è bersaglio di Comms Attack → Tiro Normale su WIP.
- **Reset NON evita altri tipi di attacco** — per quelli serve Dodge.
- Un Reset riuscito (Normale o Faccia a Faccia) permette di **cancellare lo stato Bersagliato e lo stato IMM-B**, applicando i MOD specifici di quegli stati (es. -3 WIP per Bersagliato).

### Suppressive Fire (Fuoco di Soppressione)
- **Etichetta**: Long Skill. Attack.
- **Requisiti**: selezionare un'arma con il Tratto Suppressive Fire.
- **Effetti**: l'utente entra nello stato Fuoco di Soppressione con l'arma selezionata. (Dettagli dello stato nel Blocco Stati.)

---

## BLOCCO 2 — SPECIAL SKILLS (skill specifiche elencate nel profilo unità)

> Nota: molte skill hanno un MOD numerico tra parentesi nel profilo (es. `Mimetism (-6)`).
> Il calcolatore deve leggere quel valore, non assumerne uno fisso.

### Skill con MOD/effetti diretti sul CALCOLO DEI TIRI (le più importanti per l'app)

**Mimetism (-X)**: MOD negativo (valore tra parentesi, -3 o -6) a chi dichiara BS Attack che richiede LoF, o Discover, contro l'utente. NON si applica ai CC Attack.

**Surprise Attack (-X)** [o (Attributo-X)]: l'utente deve essere in forma Marker (Camo/Impersonation/Decoy/Holoecho) o Hidden Deployment a inizio ordine, ed è il Turno Attivo. Applica un MOD negativo aggiuntivo (-3/-6) a TUTTI i bersagli dell'attacco — e questo MOD si applica a QUALSIASI tiro che quei bersagli fanno in ARO. Se è specificato un attributo (es. Surprise Attack (CC-6)), il MOD vale solo per quell'attributo. Non cumulabile con un altro Surprise Attack. Non riutilizzabile finché non torna in forma Marker.

**Marksmanship**: solo su BS Attack. L'utente ignora i MOD negativi da Copertura Parziale e Nanoscreen. (NON ignora il Mimetism.)

**Martial Arts (livelli L1-L5)**: solo CC. Il livello si scrive nel NOME (es. `Martial Arts L3`), NON tra parentesi. Tabella MOD:
| Livello | Attack MOD (a sé) | Opponent MOD (al nemico nel F2F) | Burst MOD |
|---|---|---|---|
| 1 | 0 | -3 | 0 |
| 2 | +3 | -3 | 0 |
| 3 | +3 | -3 | +1 SD |
| 4 | +3 | -3 | +1 B |
| 5 | +3 | -3 | +1 B, +1 SD |
I MOD dei due combattenti si combinano nel Faccia a Faccia (l'attaccante applica il suo Attack MOD + l'Opponent MOD del nemico; il difensore applica l'Opponent MOD dell'attaccante).

**Sixth Sense**: può reagire ad attacchi da fuori LoF (arco 360°). Se bersaglio di BS Attack attraverso Zona Visibilità Zero, ignora il -6 della Pessima Visibilità risultante. Se dichiara Dodge o Reset, NON applica MOD negativi — TRANNE -6 PH per IMM-A, -3 WIP per IMM-B, -9 WIP per Isolato.

**No Cover**: l'utente non beneficia MAI dei MOD di Copertura Parziale (nota: è un malus per sé, non un vantaggio).

**Total Reaction**: in ARO su BS Attack può usare il Burst PIENO dell'arma (con i relativi MOD a B). L'ARO deve scegliere come bersaglio uno dei Trooper attivati dall'ordine.

**Neurocinetics**: Turno Attivo → Burst di tutte le armi BS ridotto a 1. Turno Reattivo (ARO) → può usare il Burst pieno delle armi BS contro un singolo bersaglio. I MOD a B si applicano solo in Reattivo.

### Skill difensive / legate a Ferite e Stati

**Dogged**: entra in Incosciente ma lo ignora (agisce come Normale) fino a fine turno; poi entra automaticamente in Morto nella Fase Stati. Un'altra Ferita = Morto diretto. Non curabile una volta attivato. Munizione Shock lo manda direttamente a Morto.

**No Wound Incapacitation (NWI)**: come Dogged ma CURABILE (Dottore/MediKit/Regeneration/Protheion → toglie 1 Ferita, torna Normale). Un'altra Ferita = Morto diretto. Se la cura fallisce → Morto. Munizione Shock lo manda direttamente a Morto.

**Regeneration**: Fase Stati, Tiro Normale PH → successo = togli 1 Ferita.

**Immunity (categoria)**: (dettaglio importante per il calcolo salvezze)
- Immunity (Ammunition): la munizione indicata è trattata come Normale (N) — effetti/MOD/numero salvezze ignorati.
- Immunity (ARM): ogni munizione che richiede tiro su ARM è trattata come Normale. Immune anche ai Tratti che causano Stati/Ferite/riduzione attributi (es. State: Dead, Continuous Damage, ARM=0).
- Immunity (BTS): idem per BTS.
- Immunity (Enhanced): ha sia Immunity (ARM) sia (BTS).
- Immunity (State): immune a qualsiasi effetto Comms Attack o regola che causa lo Stato indicato.
- Immunity (Critical): NON fa il tiro salvezza aggiuntivo da Critico.
- NON si applica contro Comms Attack (eccetto Immunity State), né contro i Tratti Non-Lethal e State: Stunned (sempre applicati).

**Courage**: passa automaticamente qualsiasi Guts Roll. Non entra in Retreat!.

### Skill di supporto (riconferma per il modulo Supporto)

**Doctor**: Short Skill. Tiro Normale WIP (nessun bonus) per togliere Incosciente a un alleato con VITA in Incosciente. Fallimento → il bersaglio entra in Stato **MORTO** e viene rimosso dal tavolo (REGOLE_N5_v5_1_1.txt riga 8158). ⚠️ Non "1 Ferita": quella vale per Engineer e GizmoKit.

**Engineer**: Tiro Normale WIP (nessun bonus), bersaglio in contatto Silhouette con attributo STR (macchina) → toglie 1 Ferita da STR (cancella Incosciente). Fallimento → bersaglio riceve 1 Ferita. In alternativa, con un Tiro Normale WIP, cancella tutti gli Stati cancellabili dall'Engineer TRANNE Incosciente (IMM-A/B, Bersagliato, ecc.) — fallire questo non ha conseguenze negative. Engineer (ReRoll -X): un ritiro con MOD -X.

### Skill di movimento/deployment (rilevanti per la dichiarabilità ordini, non per i tiri)

**Camouflage**: permette di schierarsi/entrare in stato Camuffato.
**Climbing Plus**: muove su superfici verticali facendo altre Basic Short/Short Skill. Non beneficia della Copertura Parziale su superficie verticale.
**Super-Jump**: trasforma Jump in Basic Short Skill; permette altre skill durante il salto. Non beneficia della Copertura durante la traiettoria.
**Terrain (Tipo/Total)**: +1" al primo valore MOV in quel tipo di terreno; muove senza restrizioni in quel terreno. Terrain (Total) = tutti i tipi (Aquatic, Desert, Mountain, Jungle, Zero-G).
**Aerial**: capacità di volo; non in contatto Silhouette; non può Cauto né stato Prono/Engaged.
**Berserk**: Long Skill. Move + CC Attack combinati; MOD tra parentesi (es. Berserk (+3)) si applica al CC Attack. Applica ancora eventuale (+1 SD).

### Altre skill (contesto, non calcolo tiri diretto)
Chain of Command, NCO, Strategos, Tactical Awareness, Inspiring Leadership → gestione ordini/tenente (fuori scope calcolatore). Impersonation, Decoy, Holoprojector, Transmutation → forma Marker/doppio profilo. Counterintelligence, Sensor, Forward Observer → info/scenario. TAGCom → MOD ai TAG del gruppo. Frenzy/Impetuous → obbligo Impetuoso.

---

## BLOCCO 3 — EQUIPAGGIAMENTI

> Nota: alcuni equip hanno Livelli (MSV L1/L2, ecc.), NON cumulabili — vale solo il livello posseduto.

### Visori (fondamentali per Mimetismo/Visibilità)

**Multispectral Visor L1 (MSV1)**:
- Riduce a 0 i MOD di Mimetism (-3) E delle Zone di Bassa Visibilità.
- Riduce a -3 i MOD di Mimetism (-6) E delle Zone di Pessima Visibilità.
- Permette LoF attraverso Zone di Visibilità Zero, applicando -6 a qualsiasi skill che richiede LoF.
- Non fa Faccia a Faccia contro armi con munizione Smoke (le ignora).

**Multispectral Visor L2 (MSV2)**:
- Riduce a 0 TUTTI i MOD di Mimetism e di TUTTE le Zone di Visibilità.
- Permette LoF attraverso le Zone di Visibilità senza applicarne i MOD.
- Non fa Faccia a Faccia contro Smoke.

**Multispectral Visor L3 (MSV3)**: come L2 + (da verificare: tipicamente ignora anche Eclipse/altre; non estratto in questo blocco, lasciato per completamento se serve).

**X-Visor**: altera i Range MOD delle armi BS/skill/equip dell'utente da -3 a 0 e da -6 a -3. Vale anche per skill con bande di gittata come Discover e Suppressive Fire. (POTENZIALMENTE RILEVANTE per il bug "range Alguacil": se un'unità di test avesse X-Visor, i -3/-6 diventerebbero 0/-3.)

**360° Visor**: espande l'arco LoF dell'utente (nessun MOD ai tiri).

**Biometric Visor**: (info/scenario, tipicamente Counterintelligence-like — non estratto nel dettaglio, non critico per i tiri).

### Difese Comms / Hacking

**Firewall (equip)** [regola ufficiale, conferma il fix già fatto]:
- Chi dichiara un Comms Attack (Hacking) contro un Trooper con Firewall applica il MOD negativo indicato tra parentesi al proprio WIP: Firewall (-3), Firewall (-6).
- Il Trooper con Firewall applica ANCHE un +3 ai propri Tiri Salvezza (SR) contro Comms Attack.
- Si beneficia di UN SOLO Firewall alla volta (se più disponibili, il giocatore sceglie quale).
- È l'equivalente della Copertura per gli Attacchi Hacking.

**TinBot** (contenitore di MOD): concede al proprietario (e a tutto il suo Fireteam) il MOD/skill indicato nel profilo. Tipi comuni:
- TinBot: Firewall (-3) → -3 Firewall a chi lo attacca via Comms.
- TinBot: Guided (-6) → -6 a chi lo attacca con Attacco Guidato.
- TinBot: Discover (+3) → +3 WIP quando il proprietario dichiara Discover.
Un TinBot non è bersagliabile (è un Token di stato); se il proprietario muore, sparisce. Se il Fireteam ha più TinBot uguali, se ne usa uno solo per ordine/ARO.

### Difesa BS

**Nanoscreen**: quando l'utente è bersaglio di un BS Attack → -3 BS all'attaccante E +3 ai Tiri Salvezza dell'utente contro BS Attack. NON si applica agli attacchi con Tratto Comms Attack. NON usabile contro CC. (È come la Copertura ma cumulabile e non richiede terreno. Nota: Marksmanship ignora il -3 da Nanoscreen.)

**Albedo**: blocca i Multispectral Visor / sistemi di puntamento — impedisce al portatore di essere bersaglio di un nemico con MSV o Attacco Guidato.

**SymbioMate** (uso singolo): quando l'utente è forzato a un Tiro Salvezza, i suoi ARM/BTS diventano 9 (sostituiscono i valori del profilo) e ottiene Immunity (Enhanced). Utilizzabile anche contro Comms Attack (ma senza Immunity Enhanced in quel caso). Si rimuove a fine ordine.

### Supporto / riparazione (riconferma modulo Supporto)

**MediKit**: è un BS Weapon Non-Lethal (usa BS con gittata/MOD). Bersaglio = alleato con VITA in Incosciente. Se l'utente passa il BS Attack Roll (con MOD di Gittata/Copertura), il bersaglio fa un Tiro PH; passandolo toglie 1 Ferita (cancella Incosciente); fallendolo entra in Stato **MORTO** e viene rimosso dal tavolo (riga 10913). ⚠️ Non "1 Ferita": quella vale per GizmoKit. Il bersaglio NON fa Tiro Salvezza.

**GizmoKit**: bersaglio = alleato Modello con STR (macchina). Due modi: (a) a distanza = Non-Lethal BS Weapon, passare BS Attack Roll (MOD Gittata/Copertura), poi il bersaglio fa 1 tiro PH; (b) a contatto Silhouette = una Short Skill senza tiro, poi il bersaglio fa 1 tiro PH. Passando il PH toglie 1 Ferita (cancella Incosciente); fallendo riceve 1 Ferita. Il bersaglio NON fa Tiro Salvezza. GizmoKit(+X) nel profilo = valore PH da usare. Gittate GizmoKit: +3 a 8" / 0 a 16" / -6 a 24" / (96").

### Hacking Devices (quali programmi abilitano)
- **Hacking Device**: Carbonite, Oblivion, Spotlight, Total Control.
- **Hacking Device Plus**: Carbonite, Cybermask, Oblivion, Spotlight, Total Control, White Noise.
- **Killer Hacking Device**: Cybermask, Trinity.
- **EVO Hacking Device**: Assisted Fire, Controlled Jump, Enhanced Reaction, Fairy Dust (supportware, non attacchi).

### Altri equip
**Deactivator**: disattiva/rimuove deployable ed elementi (mine, ripetitori nemici). **ECM**: disturba hacking/guided (MOD negativo a chi attacca). **Repeater / Deployable Repeater**: estende l'area di hacking (Zona di Controllo). **Baggage**: bonus scenario/obiettivi. **Deployable Cover (Cutting Foam)**: crea copertura piazzabile.

---

## RIFERIMENTO ORDINE COORDINATO (verificato ora dal PDF)
- Max 4 Trooper, stesso Training (Regolare/Irregolare) e stesso Combat Group, uno designato Spearhead.
- Tutti dichiarano ed eseguono la STESSA sequenza di Skill; se una skill richiede un bersaglio, tutti sullo STESSO bersaglio.
- Spearhead usa METÀ del Burst indicato (arrotondato per eccesso, inclusi i bonus); tutti gli altri B ridotto a 1.
- CC Attack in Coordinato: solo lo Spearhead fa il CC Attack, +1 B per ogni alleato in contatto Silhouette col bersaglio.
- Se una unità non soddisfa i Requisiti → fa Idle, le altre agiscono normalmente.
- **Speculative Attack e Intuitive Attack NON sono ammessi in un Ordine Coordinato** (sono skill diverse dal BS Attack).
- Ogni reattivo sceglie un solo bersaglio tra le unità attivate (non obbligati allo stesso).
- Periferiche e Controller non possono far parte di Ordini Coordinati. Membri di un Fireteam nemmeno.

---

## BLOCCO 4 — MUNIZIONI (tabella completa per il calcolo Tiri Salvezza)

> Ogni munizione definisce: quanti Tiri Salvezza, su quale attributo, con eventuale dimezzamento, e l'effetto del fallimento. Un Critico aggiunge SEMPRE 1 Tiro Salvezza extra (salvo Immunity Critical).

| Munizione | N. Salvezze | Attributo | Dimezza? | Effetto fallimento |
|---|---|---|---|---|
| **Normale (N)** | 1 | ARM | no | 1 Ferita |
| **AP** (Armor Piercing) | 1 | ARM o BTS | SÌ (÷2, arr. ecc., min 1) | 1 Ferita |
| **DA** (Double Action) | 2 | ARM | no | 1 Ferita per salvezza fallita. La 2ª salvezza è obbligatoria anche se fallisce la 1ª o va Incosciente. (Critico → 3 salvezze totali) |
| **EXP** (Explosive) | 3 | ARM | no | 1 Ferita ciascuna. Tutte e 3 obbligatorie. (Critico → 4 salvezze totali) |
| **Shock** | 1 | ARM | no | 1 Ferita. Se il bersaglio ha VITA=1, un fallimento cancella qualsiasi Incosciente (attuale o entrato in questo ordine) → va direttamente a MORTO. Annulla gli effetti di Dogged/NWI/Shasvastii → Morto diretto. |
| **E/M** (Electromagnetic) | 2 | BTS | SÌ (BTS/2) | Isolato. Se HI/TAG/REM/VH → anche IMM-B. (Critico → 3 salvezze) |
| **T2** | 1 | ARM | no | **2 Ferite** per salvezza fallita. Critico → 1 salvezza extra che infligge solo +1 Ferita (non 2). |
| **PARA** (Paralysis) | 1 | **PH-6** (tiro speciale, non ARM/BTS) | — | IMM-A. Nessun effetto su bersagli senza attributo PH (non tira). (Critico → altro PH-6) |
| **Stun** | 1 | ARM | no | Stordito + fallisce automaticamente il Guts Roll successivo (salvo Courage). |
| **Smoke** | — | — | — | Non offensiva. Genera Zona Visibilità Zero (Template Circolare, altezza infinita) fino alla Fase Stati. Non causa danni. |
| **Eclipse** | — | — | — | Come Smoke, ma la Zona Visibilità Zero blocca ANCHE i Multispectral Visor (di qualsiasi livello). |

### Munizioni combinate (segnate col +, es. AP+DA)
Funzionano come una singola munizione che somma gli effetti. Es:
- **AP+DA**: 2 salvezze con ARM/BTS dimezzato. (Critico → 3 salvezze con attributo dimezzato.)
- **AP+EXP**: 3 salvezze con ARM/BTS dimezzato. (Critico → 4 salvezze dimezzate.)
- **N+E/M**: 2 salvezze con BTS dimezzato; ogni fallita infligge 1 Ferita E causa Isolato (+IMM-B se HI/TAG/REM/VH).

### Tiro Salvezza Combinato (attributi diversi, es. ARM+BTS del Plasma)
Segnato con `+` tra attributi (es. ARM+BTS). Il bersaglio fa una salvezza per ciascun attributo indicato. Con un Critico, la salvezza aggiuntiva si fa contro **ARM**.
Es. Plasma: 1 salvezza ARM + 1 salvezza BTS. Critico → +1 salvezza ARM (totale 2 ARM + 1 BTS).

### REGOLA SINTASSI MOD TRA PARENTESI (fondamentale per leggere i profili — VERIFICATA dalla wiki)
Qualsiasi MOD/valore tra parentesi tonde accanto a Skill/Arma/Equip si applica SOLO quando si usa quella Skill/Arma/Equip.

**REGOLA CARDINE (testo ufficiale):** *"Positive MODs only apply to the user. Negative MODs only apply to enemies."*
- **MOD POSITIVI (+N)**: si applicano SOLO all'UTENTE quando usa quella skill/arma/equip.
- **MOD NEGATIVI (-N)**: si applicano SOLO ai NEMICI, MAI all'unità stessa. Due casi:
  - **Skill/Equip AUTOMATICI** (Mimetism, Surprise Attack, ECM): il nemico li applica SEMPRE come da regola della skill (es. il nemico che ti spara applica il tuo Mimetism -6 al proprio tiro).
  - **Altri** (Dodge (-3), CC Attack (-3)): il nemico li applica SOLO durante i Tiri Faccia a Faccia.

**⚠️ Attenzione a non confondersi**: `CC Attack (-3)` NON è un malus che l'unità si dà da sola.
Esempio: la **Chimera** ha CC 24 e `CC Attack (-3)`. La Chimera tira sul suo **CC 24 pieno**; è il nemico che la affronta in mischia ad applicare **-3 al proprio CC** nel Faccia a Faccia. (Il -3 va all'avversario, non a lei.)

**Tabella completa di cosa significa ogni valore tra parentesi:**
| Notazione | Significato |
|---|---|
| `(+N)` es. Dodge (+3), BS Attack (+3) | +N al tiro dell'UTENTE quando usa quella skill |
| `(-N)` es. Dodge (-3), CC Attack (-3) | -N al tiro del NEMICO nel Faccia a Faccia (non all'utente) |
| `(+1B)` / `(+NB)` | +N al Burst dell'utente. SOLO in Turno Attivo, NON in ARO |
| `(+1 SD)` / `(+1 Special Die)` | Tira 1 dado extra e ne scarta uno. NON aumenta il Burst. Non vale per Long Skill |
| `(ReRoll)` | Ritira un dado del tiro (solo con quella skill/arma) |
| `(Shock)`, `(AP)`, ecc. su BS/CC Attack | L'utente aggiunge quella munizione a tutti i suoi attacchi |
| `(Continuous Damage)` su BS Attack | L'utente applica il tratto Continuous Damage ai suoi attacchi |
| `(SR-1)` / `(SR-2)` | **SR = Saving Roll**: i BERSAGLI colpiti applicano -1/-2 al proprio Tiro Salvezza (arma che perfora meglio le difese). NON è gittata! |
| `(PS=X)` es. CC Weapon (PS=6) | Fissa il PS dell'arma a X in tutte le modalità |
| `(PH=X)` / `(WIP=X)` es. Combat Jump (PH=10), Gizmokit (PH=11) | Usa il valore X per l'attributo di quel tiro, al posto di quello del profilo |
| `(ARM+N)` / `(BTS+N)` es. Dodge (ARM+3) | L'utente somma +N al PROPRIO valore ARM/BTS per il Tiro Salvezza, SE fallisce il tiro PH di Dodge |
| `(2W)` es. Doctor (2W) | Il bersaglio recupera 2 Ferite invece di 1 |
| `(ReRoll WIP=X)` / `(ReRoll -X)` es. Doctor | Ritiro del tiro con WIP fisso X, oppure con MOD -X al WIP |

**⚠️ Martial Arts — il LIVELLO è nel NOME, non tra parentesi:**
Si scrive `Martial Arts L1`, `Martial Arts L3`, ecc. — il numero fa parte del nome della skill.
Il numero tra parentesi tonde è SEMPRE un valore-MOD, MAI un livello. (Vale anche per altre skill a livelli: MSV L1/L2/L3, Fatality L1/L2, ecc.)

---

## BLOCCO 5 — ATTACCHI SPECIALI + STATI

### Attacchi speciali (Long Skill BS)

**Speculative Attack**:
- Requisiti: arma con Tratto Speculative Attack; traiettoria tracciabile fino al punto d'impatto (NON serve LoF).
- Burst SEMPRE 1 (indipendentemente dall'arma/MOD).
- MOD: **-6 BS** (o attributo corrispondente) + i MOD di Gittata. **Altri MOD negativi NON si applicano** (Mimetism, Copertura, Zone di Visibilità).
- Con arma Impact Template (Circular), il centro del template può essere posto altrove, purché il Bersaglio Principale sia nell'area d'effetto.

**Intuitive Attack**:
- Requisiti: arma con Tratto Intuitive Attack; il bersaglio deve essere fuori LoF per Zona Visibilità Zero, OPPURE in uno stato che normalmente impedisce l'attacco senza prima Scoprire (es. Camouflaged).
- Un singolo BS Attack Roll. Burst SEMPRE 1.
- Si passa un **Tiro WIP non modificato**: NESSUN MOD si applica (Copertura, Skill, Equip, nessuna fonte).
- Se il bersaglio reagisce (Attack/Dodge) → simultaneo, risolto in Faccia a Faccia.
- Critico WIP → conta come Critico solo sul Bersaglio Principale; sugli altri colpiti è successo (non critico).
- Fallito → non ritentabile sullo stesso bersaglio fino al prossimo turno attivo.

**BS Attack (Guided)** [skill nel profilo, non un'arma]:
- Turno Attivo: BS Attack contro bersaglio in stato Bersagliato, SENZA LoF.
- Va eseguito in Blast Mode dell'arma (o Modo con Impact Template Circular).
- Burst SEMPRE 1. Distanza ≤ Gittata massima dell'arma. Limite 5 Attacchi Guidati/turno per il giocatore attivo.
- Evitabile con Dodge o Reset (F2F). Un Reset riuscito annulla anche lo stato Bersagliato.
- Si applicano solo i MOD di Gittata (misurata in linea retta). Altri MOD negativi (Mimetism, Copertura, Visibilità) NON si applicano salvo diversa indicazione.
- Non usabile con armi BS Attack (PH) o BS Attack (WIP).

### STATI (con MOD e restrizioni — quelli che il calcolatore deve conoscere)

| Stato | Restrizione azioni | MOD | Cancellazione |
|---|---|---|---|
| **Immobilized-A** | Solo Dodge | -6 PH al Dodge | Dodge riuscito (con -6 PH); o Engineer (WIP Normale) |
| **Immobilized-B** | Solo Reset | -3 WIP al Reset | Reset riuscito (con -3 WIP); o Engineer |
| **Isolated** | Non riceve ordini dal Pool; skill/equip Comms disabilitate; non in Fireteam né Coordinato | -9 WIP al Reset | Reset riuscito (con -9 WIP); o Engineer |
| **Targeted (Bersagliato)** | Non può Cautious Movement, non può Stealth | +3 all'attaccante (BS/Comms/Discover); -3 WIP al proprio Reset | Reset riuscito (con -3 WIP); o Engineer |
| **Stunned (Stordito)** | (vedi sotto) | — | (Fase Stati / vedi regole) |
| **Suppressive Fire** | reagisce in ARO solo con BS Attack in SF Mode | nemici entro 0-24" hanno -3 in TUTTI i F2F contro di lui | si annulla se dichiara ordine, ARO diverso da BS SF, cambia arma, fallisce Guts, entra in Engaged/Isolato/Retreat/Null/IMM, entra in Fireteam |
| **Engaged** | Solo Berserk, CC Attack, Dodge, Idle, Reset (e skill CC) | — | non più in contatto Silhouette; o Dodge riuscito (esce dal contatto) |
| **Retreat!** | Solo Basic Short Skill, Cautious Movement, Dodge, Reset | — | inizio turno (fine situazione); o Command Token. Courage/Religious/Warhorse NON entrano in Retreat! |
| **Disconnected** (Periferiche) | Non attivabile, no ordini/ARO; skill/equip Automatiche disattivate | — | il Controller recupera da Isolato/Null |

**Profilo SF Mode Weapon** (Suppressive Fire, sostituisce il profilo BS normale mentre in stato):
- Gittata: 0 a 16" / -3 a 24" / (96"). Burst: 3. PS, Munizione, ecc. restano quelli originali dell'arma.

### Immobilized-A dettaglio
Non può dichiarare alcuna Skill o ARO tranne Dodge (-6 PH). Continua a fornire ordini al Pool. Le skill/equip Automatiche continuano a funzionare.

### Immobilized-B dettaglio
Non può dichiarare alcuna Skill, Attacco o ARO tranne Reset (-3 WIP). Continua a fornire ordini.

### Stunned (Stordito) dettaglio
Causato da munizione Stun (fallendo la salvezza) → Stordito + fallisce automaticamente il Guts Roll successivo (salvo Courage). (Blocca gli Attacchi come già implementato nel gating.)

### Nota su Engaged + Template
I Template piazzati su un gruppo di Trooper in Engaged colpiscono SEMPRE tutti i partecipanti, anche se il piazzamento ne toccherebbe solo uno.

### Nota su Guts Roll
Tiro Normale su WIP dopo aver subìto/sopravvissuto a un attacco (o perso membri vicini). Nessun MOD speciale. Courage lo passa automaticamente. Stun/Stunned lo fanno fallire automaticamente. Non serve logica di calcolo dedicata nel calcolatore (è un tiro WIP puro).

---

## (segue Blocco 6 — Fireteam, sotto)
Documento: Meccaniche base, Tipi arma, Sintassi profilo, Common Skills (Blocco 1), Special Skills (Blocco 2), Equipaggiamenti (Blocco 3), Munizioni (Blocco 4), Attacchi speciali + Stati (Blocco 5), Fireteam (Blocco 6). Costruito verificando ogni voce dal PDF ufficiale N5 v5.1.1.

---

## BLOCCO 6 — FIRETEAM

### Livello del Fireteam (determina i bonus)
Il **Livello** dipende da quanti membri appartengono alla STESSA unità (non dal numero totale di membri):
| Livello | Requisito |
|---|---|
| 1 | I Trooper possono appartenere tutti a unità diverse |
| 2 | Almeno 2 Trooper della stessa unità |
| 3 | Almeno 3 Trooper della stessa unità |
| 4 | Almeno 4 Trooper della stessa unità |
| 5 | Tutti e 5 della stessa unità |

Nota: un Trooper conta per il livello se il suo nome-unità (o il termine tra parentesi, es. "(Fennec)") compare nella Fireteams Chart. Es. un Griffin con "(Fennec)" fa livello con i Fennec.
Nel calcolatore: l'Infinity Army App calcola già il Livello — l'app deve solo contare i membri attivi e applicare le regole di scioglimento (non replicare il controllo pesante "stessa unità").

### Bonus Fireteam (CUMULATIVI — un Livello 5 ha anche i bonus di 2/3/4)
| Livello | Bonus |
|---|---|
| 1 | Attivazione di tutti i membri con un singolo Ordine Regolare (nessun bonus di combattimento) |
| 2 | **BS Attack (+1 SD)** — tira 1 dado extra e ne scarta uno; non aumenta il Burst; non applicabile a Long Skill né a Direct Template. Vale anche per MediKit/GizmoKit usati come BS Weapon |
| 3 | **+3 Discover** e **+1 Dodge** (Turno Attivo e Reattivo) |
| 4 | **+1 BS** su BS Attack (vale anche per armi BS Weapon (PH) e (WIP)) |
| 5 | **Sixth Sense** per tutti i membri |

Nota sul Burst massimo: il Burst di qualsiasi attacco non supera mai 6, per quanti MOD si applichino. I dadi extra da (+1 SD) NON contano verso questo massimo (non aumentano il Burst).

### Regole base Fireteam
- Da 2 a 5 Trooper (secondo la Fireteams Chart della fazione). Tutti nello stesso Combat Group.
- I membri devono rispettare la Coerenza (restare nella Zona di Controllo del Fireteam Leader). Chi rompe la Coerenza col Leader non conta come parte del Fireteam.
- Quando un Ordine Regolare è speso su un membro, quello diventa Fireteam Leader e attiva gli altri.
- Un Trooper non può essere in più di un Fireteam contemporaneamente.
- **Non possono far parte di un Fireteam**: Periferiche e Controller, Trooper in forma Marker, con Infiltration, con skill Airborne Deployment, in Fuoco di Soppressione, in Decoy, in Isolato o qualsiasi Stato Nullo.
- I membri di un Fireteam non possono partecipare a un Ordine Coordinato.

### Integrità del Fireteam — stati/eventi che fanno USCIRE un Trooper dal Fireteam
(già implementato in checkRottura del codice)
- Entra/è in Stato Isolato o qualsiasi Stato Nullo (Morto, Incosciente, Sepsitorizzato...).
- Rompe la Coerenza col Leader (posizionale).
- Entra in uno stato che permette sostituzione con Marker (Camuffato, Impersonation, Holoecho, Decoy).
- Entra in Fuoco di Soppressione.
- È Irregolare e usa il proprio ordine Irregolare / è Tenente e spende l'ordine speciale / è Impetuoso attivato in Fase Impetuosa (gestione ordini, fuori scope).
- Viene spostato in un altro Combat Group.
- NOTA: Immobilized-A/B NON scioglie il Fireteam (categoria separata da Stato Nullo).
Chi è uscito può RIENTRARE automaticamente alla fine della Fase Stati successiva, se è in Coerenza col Leader.

### Fireteam in ARO
- L'ARO del Fireteam è la Skill dichiarata dal Fireteam Leader (in reattivo il Leader porta la reazione).
- CC: se più membri sono nello stesso CC, solo il Leader fa il CC Roll (regola Close Combat con più Trooper); se il Leader non è ingaggiato, si sceglie un membro ingaggiato. In ARO il nemico può bersagliare un solo membro ingaggiato nel CC.

### Tipi di Fireteam
- **Duo**: 2 Trooper. **Haris**: 3 Trooper. **Core**: da 3 a 5 Trooper.

---

## BLOCCO 7 — TERRENO, VISIBILITÀ, STRUTTURE E TRATTI (Glossario)

### Zone di Visibilità (MOD a chi tira attraverso/dentro/fuori la zona)
| Zona | MOD | Note |
|---|---|---|
| **Bassa Visibilità (Low)** | -3 | a skill/attacco che richiede LoF (tranne Dodge) |
| **Pessima Visibilità (Poor)** | -6 | idem |
| **Visibilità Zero (Zero)** | LoF NON tracciabile dentro/attraverso/fuori | chi è bersaglio di BS Attack attraverso una Zona Zero la tratta come Pessima Visibilità (-6) per tracciare LoF verso l'attaccante |
| **Rumore Bianco (White Noise)** | agisce come Zona Visibilità Zero MA solo per chi ha Marksmanship o Multispectral Visor (qualsiasi livello) | un MSV bersaglio di BS Attack in/attraverso White Noise NON può ridurre i MOD della Pessima Visibilità risultante |

**REGOLA STACKING (fondamentale):**
- Il MOD di Visibilità si somma con altri MOD (Skill, Equip, Copertura Parziale, Gittata...) MA **mai con altri MOD di Zona di Visibilità**.
- Se un tiro è affetto da 2+ Zone di Visibilità → si applica UNA sola, sempre **la più restrittiva** (es. Bassa -3 + Pessima -6 = solo -6).
- **Speculative Attack** ignora tutti i MOD di Visibilità (applica solo il suo -6).

### Zona di Saturazione
- Qualsiasi BS Attack da/dentro/attraverso una Zona di Saturazione: **-1 Burst**.
- Applicato DOPO la divisione del Burst tra bersagli, al Burst assegnato a ciascun bersaglio.
- Il Burst assegnato a un bersaglio non scende MAI sotto 1.
- **Mai cumulativo** con altre Zone di Saturazione (attraversarne più = comunque -1).

### Terreno Difficile (Difficult Terrain)
Entrare in contatto Silhouette con Terreno Difficile termina immediatamente il movimento per quell'ordine. Per continuare serve un nuovo ordine con -1" a entrambi i valori MOV. (Non tocca i tiri d'attacco.)

### Tipi di Terreno (per la skill Terrain)
Aquatic, Desert, Mountain, Jungle, Zero-G. Da definire prima dello schieramento. La skill Terrain (Total) copre tutti.

### Strutture (Scenery Structures)
Access Width: **Narrow** (solo Silhouette ≤2) / **Wide** (tutti). I varchi sono sempre considerati aperti (non bloccano LoF) salvo regola contraria.

### TRATTI DELLE ARMI (Glossario — quelli che il calcolatore deve conoscere)
- **Continuous Damage**: dopo una salvezza fallita, il bersaglio riceve 1 Ferita e continua a tirare salvezze finché ne passa una o va Morto. Il critico dà 1 salvezza extra (che NON applica Continuous Damage).
- **Non-Lethal**: qualunque munizione usi, non infligge Ferite / non richiede Tiro Salvezza. Ha sempre precedenza (anche se combinato con altre munizioni).
- **Direct Template**: nessun tiro BS per colpire; si piazza il template. Chi lo subisce fa un Tiro Normale PH (o PH-3). Teardrop = punta a contatto con l'attaccante; Circular = centro sulla base dell'attaccante.
- **Impact Template**: piazza un template sul punto d'impatto (il tipo tra parentesi, es. Circular).
- **BS Weapon (PH)** / **BS Weapon (WIP)**: fa BS Attack ma usa PH/WIP al posto di BS (tutti i MOD BS vanno su PH/WIP). Con (WIP) non si combina BS Attack (Shock).
- **BTS=0 / ARM=0**: riduce l'attributo del bersaglio a 0 quando serve la salvezza.
- **Improvised**: -6 all'attributo dell'utente (arma usata impropriamente).
- **Silent (X)**: se attacchi dentro la ZoC del bersaglio e fuori dalla sua LoF, il bersaglio applica il MOD tra parentesi a qualsiasi Dodge Faccia a Faccia contro l'attacco (cumulativo con altri MOD Dodge).
- **Reflective**: gli effetti si applicano anche a chi ha Marksmanship o Multispectral Visor (qualsiasi livello). (Es. Eclipse: gli MSV fanno comunque Faccia a Faccia.)
- **Suppressive Fire (SF)**: l'arma permette di entrare in Fuoco di Soppressione, sostituendo il profilo con l'SF Mode.
- **Speculative Attack / Intuitive Attack**: l'arma può fare quel tipo di attacco (Tratto richiesto — il calcolatore dovrebbe leggere questo, non indovinare dal nome arma).
- **Target (Attributo)**: efficace solo contro bersagli con l'attributo indicato (VITA o STR). Se il bersaglio non ce l'ha, non fa salvezza (nessun effetto).
- **Disposable (X)**: usi limitati; ogni dichiarazione ne consuma uno (anche i MOD a Burst consumano usi). Esaurito → stato Unloaded.
- **Burst: Single Target**: tutti i colpi del Burst su un solo bersaglio.
- **Double Shot**: in Turno Attivo può applicare +1 Burst.

### FINE MAPPA COMPLETA
7 blocchi: Common Skills, Special Skills, Equipaggiamenti, Munizioni, Attacchi speciali + Stati, Fireteam, Terreno/Visibilità/Strutture/Tratti. Tutto verificato dal PDF ufficiale N5 v5.1.1.

---

## BLOCCO 8 — AGGIORNAMENTI N5.2 E N5.3 (dalla wiki ufficiale)

> La wiki infinitythewiki.com è aggiornata a **N5.3 (settembre 2026) con la FAQ 0.1** (più recente del PDF 5.1.1 usato per i blocchi 1-7). Le voci di questo blocco sono state scritte quando la wiki era alla 5.2: dove serve, l'aggiornamento 5.3 è in `PRONTUARIO_ORDINI_N5.md` §9 e in `FAQ_N5_INDICE.md` §4.
> N5.2 è descritto come "Minor text changes", ma alcune modifiche toccano il calcolo. La wiki mostra sia il testo N5.2 sia l'originale, quindi le differenze qui sotto sono confermate.
> 65 pagine totali cambiate in N5.2 (categoria "N5.2 Update"). Sotto solo quelle rilevanti per il calcolatore.

### MediKit (effetto del fallimento) — NON è un cambiamento di versione
- **Correzione (chat REGOLE, 23 settembre)**: questo blocco diceva che il passaggio a MORTO fosse una novità N5.2. È falso: il Morto c'è già nel testo **v5.1.1, riga 10914** (*"the target automatically enters Dead State and is removed from the game table"*). Non c'è nessuna differenza fra le versioni.
- **Regola**: PH fallito → il bersaglio va **automaticamente in MORTO** ed è rimosso dal tavolo.
- La "1 Ferita" vale per **Ingegnere e GizmoKit**, non per Dottore e MediKit.
- Bersaglio: alleato con VITA in Incosciente (invariato). PH passato → toglie 1 Ferita e cancella Incosciente.
- NUOVO N5.2: l'utente può usare il MediKit **su se stesso** per cancellare stati cancellabili dal MediKit (NON se in Stato Nullo).
- Gittate MediKit confermate: +3 a 8" / 0 a 16" / -6 a 24".

### GizmoKit (confermato, NON cambia l'effetto del fallimento — diverso dal MediKit!)
- PH fallito → il bersaglio riceve 1 Ferita (può andare Incosciente/Morto). **NON** morte diretta (a differenza del MediKit).
- NUOVO N5.2: l'utente può usarlo **su se stesso** per togliersi Ferite o cancellare stati cancellabili dal GizmoKit (NON se in Stato Nullo).
- Gittate GizmoKit confermate: +3 a 8" / 0 a 16" / -6 a 24".
- Nota app: MediKit e GizmoKit ora hanno effetto-fallimento DIVERSO — il calcolatore deve distinguerli (MediKit fallito = Morto; GizmoKit fallito = +1 Ferita).

### Dodge — chiarimento -3 PH (N5.2)
Il -3 PH al Dodge si applica in queste circostanze (e **anche se più di una si applica, si somma UN SOLO -3**, mai cumulativo tra loro):
- In ARO, se l'attaccante attivo è dentro la ZoC e fuori dalla LoF del difensore.
- Se si schiva un'arma Template senza LoF verso l'attaccante.
- Se si schiva il Template di un'arma Deployable (es. Mina).
(Resto di Dodge invariato: PH vs attributo attaccante, evade tutto tranne Comms Attack, muove 2", cancella Engaged e IMM-A.)

### Marksmanship (N5.2, confermato invariato nella sostanza)
Ignora i MOD negativi da Copertura Parziale e Nanoscreen (solo su BS Attack). Chi ha Marksmanship (come chi ha MSV) è affetto da: White Noise Zones, Tratto Reflective, Albedo. (NON ignora il Mimetism.)

### Immobilized-A / Immobilized-B (N5.2, confermati invariati)
IMM-A: solo Dodge (-6 PH). IMM-B: solo Reset (-3 WIP). Un Dodge/Reset riuscito cancella lo stato applicando il relativo MOD. Cancellabili anche da Engineer (WIP Normale).

### Technorganic (nuova interazione N5.2, minore)
Le unità con Technorganic possono essere curate dall'Incosciente sia da Doctor/MediKit (VITA) sia da Engineer/GizmoKit (STR), indipendentemente da quale attributo abbiano.

### NOTA GENERALE
Le altre pagine cambiate in N5.2 (Aerial, Camouflaged State, Frenzy, Engineer, Doctor, Surprise Attack, Sixth Sense, Super-Jump, Foxhole, ecc.) sono state controllate a campione e risultano "minor text changes" senza impatto sui valori/MOD già mappati nei blocchi 1-7. Se in futuro serve verificare una skill/equip specifica, la wiki è interrogabile e mostra sempre il confronto testo-nuovo/originale.

## FINE MAPPA COMPLETA (aggiornata a N5.2)
8 blocchi. Blocchi 1-7 dal PDF ufficiale 5.1.1; Blocco 8 = delta N5.2 dalla wiki. La modifica più importante per il calcolatore: MediKit fallito ora = Morto diretto (prima = +1 Ferita).

---

## BLOCCO 9 — CHIARIMENTI DA VERIFICHE MIRATE (punti sottili, verificati sulla wiki)

> Questi punti sono emersi da domande specifiche durante la costruzione del catalogo dati.
> Sono le insidie più facili da sbagliare — riportate qui per un ripasso mirato.

### Sensore (skill) — valore confermato
Dichiarando **Sensor** si fa un **Tiro WIP+6** (senza applicare MOD di Gittata né Mimetismo) per Scoprire simultaneamente TUTTI i nemici in Hidden Deployment/Camouflaged nella propria Zona di Controllo. Inoltre concede **+6 WIP** automatico quando l'utente dichiara Discover contro un Marker Camo.

### I MOD negativi vanno ai NEMICI, mai a se stessi
Vedi la tabella dettagliata nel Blocco "REGOLA SINTASSI MOD TRA PARENTESI". In sintesi:
- `CC Attack (-3)` (es. Chimera): la Chimera tira sul suo CC pieno; è il NEMICO che subisce -3 nel F2F.
- `Dodge (-3)`: gli avversari nei F2F contro chi schiva subiscono -3.
- `Mimetism (-6)`, `Surprise Attack (-3)`, `ECM (Hacking -3)`: il nemico che attacca applica il MOD al proprio tiro.

### SR = Saving Roll (non gittata!)
`BS Attack (SR-1)` / `(SR-2)`: i bersagli colpiti applicano **-1 / -2 al proprio Tiro Salvezza** contro i colpi di quell'unità. È un'arma che perfora meglio le difese, NON ha nulla a che vedere con la gittata o il Fuoco di Soppressione.

### Dodge (ARM+3) = il proprio ARM +3
Se l'utente dichiara Dodge e **fallisce** il tiro PH, applica **+3 al PROPRIO valore ARM** per il Tiro Salvezza. Es. unità con ARM 2 → salvezza con ARM 5. (È l'armatura del profilo +3, non un valore fisso.)

### Martial Arts: livello nel nome
`Martial Arts L3`, non `Martial Arts (3)`. Il numero tra parentesi è sempre un MOD, mai un livello. Stesso principio per MSV L1/L2/L3, Fatality L1/L2, ecc.

### +1 SD (Special Die) ≠ +1 Burst
`(+1 SD)` = tira 1 dado extra e ne scarti uno (aumenta le probabilità di successo/critico), ma NON aumenta il Burst e NON conta verso il massimo di 6. Non si applica alle Long Skill.

### Intuitive/Speculative Attack contano come BS Attack per i MOD
Un'unità con `BS Attack (SR-1)` o `BS Attack (AP)` applica quei MOD anche quando fa Intuitive o Speculative Attack (hanno l'etichetta BS Attack). Eccezione: `+1 SD` non si applica alle Long Skill (e Speculative è una Long Skill).

### FINE BLOCCO 9


---

## Aggiornamenti del 21 settembre 2026 (wiki N5.3 + FAQ)

### Surprise Attack — N5.2
Il MOD vale **solo per i bersagli** dell'attacco e **solo sui loro tiri Faccia a Faccia** in ARO. Un Reset contro un BS Attack è un Tiro Normale: niente MOD. (CC-X) vale solo nel Corpo a Corpo; non si cumula con un altro Surprise Attack della stessa truppa. Più truppe in Coordinato: i MOD non si sommano, ognuno vale per sé (F02).

**Reset**: è un Faccia a Faccia **solo** contro Attacchi Comms e BS Attack (Guided). Contro altri attacchi è un Tiro Normale (riga 7753).

### Multispectral Visor L3 (wiki "Multispectral Visor")
Ignora i MOD di Surprise Attack se ha LoF verso l'attaccante; **sempre** quelli da CC Attack, anche senza LoF.

### Biometric Visor (wiki "Surprise Attack", See also)
Ignora i MOD di Surprise Attack di attaccanti in **Impersonation o Holoecho** se ha LoF verso l'attaccante; **sempre** contro i loro CC Attack.

### Aperti, non verificati nel motore
- **F17** — MSV L1 + Sesto Senso contro BS Attack attraverso una Zona di Visibilità Zero: il -6 non dovrebbe comparire.
- **Cybermine** — Attacco Comms a sagoma: si evita solo con Reset a WIP-3, non con la Schivata.
- **Saturazione** — -1 al Burst di OGNI bersaglio dopo la divisione, mai sotto 1; più zone non si sommano.
