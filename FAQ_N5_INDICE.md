<!-- @versione 2026-09-21.2 | FAQ_N5_INDICE.md | proprieta`: chat REGOLE -->

# INDICE DELLE FAQ N5 (wiki ufficiale) — da affiancare a REGOLE_N5_v5_1_1.txt

> **A cosa serve.** Le FAQ di Corvus Belli non sono nel PDF del progetto: la wiki
> (`infinitythewiki.com`) le riporta in fondo alle pagine a cui si riferiscono, con
> versione e data. Questo file dice **dove stanno** e **cosa rispondono**, così una regola
> del motore che poggia su una FAQ si può citare e ricontrollare.
>
> **Come citare una FAQ nel codice o nei messaggi:** `wiki "<Pagina>", FAQ <versione> (<data>) — F<nn>`.
> Esempio: `wiki "Firewall", FAQ 0.1 (set 2026) — F01`.
>
> **Le risposte sono riassunte con parole mie**, non trascritte: per il testo esatto si
> apre la pagina indicata. Se un riassunto e la pagina divergono, vale la pagina.
>
> **Versioni.** FAQ 0.0.0 = ottobre 2025 (con l'aggiornamento N5.2). FAQ 0.1 = settembre
> 2026 (con N5.3). La wiki dichiara di essere aggiornata a N5.3 + FAQ 0.1.
>
> **Letto il 21 settembre 2026.**

---

## 1. Copertura: cosa è stato letto e cosa no

La categoria wiki **"N5 FAQ 0.1"** elenca 28 pagine. Ogni FAQ compare su **più** pagine
(lo dice la riga "Related Pages" sotto ogni risposta): per questo alcune pagine risultano
coperte anche senza averle aperte.

| Stato | Pagine |
|---|---|
| ✅ **Letta, con FAQ** (18) | Firewall · Coordinated Orders · Camouflaged State · Disco Baller · Engaged State · Fireteam Integrity · Fireteams: Basic Rules · Fireteams Chart · FT Master · Hacking Device · Immobilized-A State · Isolated State · Peripheral · Mines · Multispectral Visor · Order Expenditure Sequence · Saturation · Transmutation |
| ⚠️ **Letta ma in versione vecchia** (2) — il lettore ha restituito la copia N5.2, senza FAQ | Ballistic Skills · White Noise |
| 🔗 **Non aperta, coperta dalle "Related Pages"** (7) | Drop Bears, Mine Dispenser, Pitcher (→ F10, F11) · Immobilized-B State, Stunned State (→ F12) · Skills and Equipment Module (→ F04) · Traits (→ F09) |
| ❌ **Non aperta** (1) | ITS FAQ (regolamento torneo; → F16) |

**Fuori da questa lista:** anche la pagina **BS Attack** (non nella categoria 0.1) porta una
FAQ 0.0.0 che il motore usa → F05.

> ⚠️ **Limiti da sapere.** (a) Le pagine "coperte" potrebbero avere **altre** FAQ proprie non
> collegate altrove: vanno aperte prima di dire che non ne hanno. (b) Le **FAQ 0.0.0** qui
> sono solo quelle incontrate su queste pagine: la categoria 0.0.0 completa non l'ho trovata,
> e ce ne sono sicuramente su altre pagine (Surprise Attack, Stealth, Sixth Sense, Dodge…).

---

## 2. FAQ che toccano i calcoli dell'app

| ID | FAQ | Cosa cambia nel calcolo | Stato nel motore |
|---|---|---|---|
| **F01** | Firewall del Dispositivo di Hacking | niente MOD Firewall se il dispositivo è disabilitato (Isolato o **qualsiasi** Null) | ✅ motore 2026-09-21.10: `M.eNullo`. Limite dichiarato: il motore non distingue la fonte del Firewall |
| **F02** | Surprise Attack di più truppe sullo stesso bersaglio | i MOD **non si sommano**: ognuno vale per sé | ✅ già rispettata (uno scontro per attaccante); test corretto in 2026-09-21.10 |
| **F04** | Dadi speciali (+1 SD) nel Coordinato | valgono: non cambiano il Burst | ✅ righe ~1801, ~4999 |
| **F05** | Skill con etichetta BS Attack (Intuitivo, Speculativo, FO, Triangulated) | contano come BS Attack per `(SR-1)`, `(AP)`, `(+1 SD)`; il `+1 SD` mai sulle Long Skill | ✅ riga ~2129 |
| **F12** | Controller che non può dichiarare (Stordito, IMM…) | la Periferica agisce lo stesso; chi non può fa Idle | ℹ️ l'app non modella Controller e Periferica insieme |
| **F17** | Sesto Senso + MSV L1 + Visibilità Zero | chi ha entrambi, bersaglio attraverso una Zona Zero, ignora il −6 | ⏳ da verificare |

**Regole lette sulle stesse pagine (non FAQ) che il motore deve rispettare:**

| Regola | Pagina | Stato nel motore |
|---|---|---|
| **MSV L3 ignora i MOD di Surprise Attack** se ha LoF verso l'attaccante, e **sempre** quelli da CC Attack | Multispectral Visor | ✅ motore 2026-09-21.10 (3 profili PanOceania) |
| Isolato disabilita skill/equip con **etichetta o Tratto** Comms Attack / Comms Equipment, e tutti i Programmi | Isolated State | ✅ coerente |
| In N5.3 **tutti i Dispositivi di Hacking** e il **Firewall** sono *Automatic Equipment* | Hacking Device, Firewall | ℹ️ il Disconnesso perde gli Automatici → niente Firewall |
| IMM-A: Schivata a PH−6; se vince il F2F cancella anche l'IMM-A (chiarimento 5.2) | Immobilized-A State | ✅ |
| Mine: Schivata a PH−3 (Sagoma + Deployable). Cybermine: Attacco Comms, solo Reset a WIP−3, 2 salvezze BTS PS5 | Mines | ⏳ da verificare |
| Saturazione: −1 Burst per bersaglio dopo la divisione, mai sotto 1, non cumulabile | Saturation | ⏳ da verificare |
| Engaged: non si attiva se l'altro è IMM o Null, **eccetto** Posseduto/Sepsitorizzato | Engaged State | ℹ️ coerente con `M.eNullo` + eccezione esplicita |

---

## 3. Tutte le FAQ, per argomento

Formato: **ID · versione · pagine** — *domanda* → risposta.

### Attacchi e MOD

**F05 · 0.0.0 (ott 2025) · BS Attack; collegate: Forward Observer, Intuitive Attack, Labels, Triangulated Fire**
*Le skill che fanno un tiro di BS Attack (Intuitivo, Speculativo) o che hanno l'etichetta BS
Attack contano come BS Attack per i MOD di profilo come `(SR-1)`, `(+1 SD)`, `(AP)`?*
→ Sì. Il `+1 SD` però non si applica alle Long Skill.

**F02 · 0.0.0 (ott 2025) · Coordinated Orders, Peripheral; collegata: Surprise Attack**
*Se più truppe usano Surprise Attack sullo stesso bersaglio (Coordinato, o Controller +
Periferica), i MOD si sommano?*
→ No. Il MOD di ciascuna truppa si applica separatamente.

**F04 · 0.1 (set 2026) · Coordinated Orders, Saturation, Skills and Equipment Module**
*Come funzionano i MOD a dadi speciali (+1 SD) negli Ordini Coordinati?*
→ Si applicano: non modificano il valore di Burst.
(Stessa logica per la Saturazione, che toglie Burst ma non i dadi SD.)

**F18 · 0.1 (set 2026) · Order Expenditure Sequence; collegate: Ballistic Skills, White Noise**
*Alla dichiarazione di una skill vanno specificati tutti i dettagli (bersaglio di un BS Attack,
punto della sagoma di White Noise)?*
→ Sì, tranne la **posizione** del bersaglio, che si sceglie nella Risoluzione prima di misurare
le gittate. Se conta chi dichiara prima, sceglie il giocatore attivo.

### Hacking

**F01 · 0.1 (set 2026) · Firewall, Hacking Device, Isolated State**
*Se il Dispositivo di Hacking di una truppa ha un Firewall, quando valgono i suoi MOD?*
→ Contro ogni Attacco Comms diretto alla truppa, **salvo** che il dispositivo sia disabilitato:
per esempio in stato Isolato o in qualsiasi stato Null.
(Riguarda il Firewall **del dispositivo**; non dice nulla su TinBot: Firewall o Fairy Dust.)

### Stati, Marker e visibilità

**F06 · 0.0.0 (ott 2025) · Camouflaged State; collegate: Impersonation State, Open and Private Information, Stealth**
*Quali skill o equipaggiamenti Automatici vanno dichiarati quando si è in stato Marker?*
→ Quelli che cambiano il modo in cui un Ordine attiva la truppa o che limitano gli ARO
(per esempio Stealth).

**F07 · 0.0.0 (ott 2025) · Camouflaged State; collegata: Infiltration**
*Una truppa con Camouflage (1 uso) schierata come Modello può entrare in Camuffato più tardi?
E se ha fallito il tiro di Infiltrazione?*
→ Sì, può entrarci più tardi. Ma se ha tentato di schierarsi come Marker e ha fallito
l'Infiltrazione, l'uso è consumato.

**F08 · 0.0.0 (ott 2025) · Camouflaged State; collegate: Cautious Movement, Disconnected State, Impersonation State, Labels, Unconscious State**
*Un nemico Disconnesso o Incosciente impedisce di tornare Marker, o annulla un Movimento Cauto?*
→ No.

**F09 · 0.1 (set 2026) · Camouflaged State, Mines, Multispectral Visor, Traits, Transmutation**
*Un BS Attack colpisce un Marker Camuffato, ma l'elemento che rappresenta è in Copertura Totale
(una mina Concealed, un Transmutation (Hatching) dietro un muretto)?*
→ Se l'attacco obbliga a una salvezza, il Marker si rivela; l'elemento però **non** è colpito,
perché è in Copertura Totale.

**F17 · 0.0.0 (ott 2025) · Multispectral Visor; collegate: Sixth Sense, Visibility Conditions**
*Come interagiscono Sesto Senso, Zone di Visibilità Zero e MSV di Livello 1?*
→ Una truppa con MSV L1 **e** Sesto Senso, bersaglio di un BS Attack attraverso una Zona di
Visibilità Zero, ignora il −6 del tracciare LoF attraverso quella zona.

### Deployable

**F10 · 0.0.0 (ott 2025) · Disco Baller, Drop Bears, Mine Dispenser, Pitcher, Place Deployable**
*Con Place Deployable, se prima della Conclusione una truppa occupa il punto dichiarato?*
→ Si può piazzare altrove rispettando le regole di Place Deployable; se non è possibile, il
Deployable è perso. Vale anche per le armi che piazzano un Deployable su tiro riuscito
(Disco Baller, Pitcher, Drop Bears in modo BS).

**F11 · 0.1 (set 2026) · Disco Baller, Drop Bears, Mine Dispenser, Pitcher**
*Si può sparare un Deployable su una superficie verticale?*
→ No: il token deve poggiare interamente sulla superficie e non può stare in verticale.

### Periferiche

**F12 · 0.1 (set 2026) · Engaged State, Immobilized-A State, Immobilized-B State, Peripheral, Stunned State**
*In Turno Attivo, se il Controller non può dichiarare una skill (Stordito, Immobilizzato…), la
Periferica può dichiararla?*
→ Sì. Controller e Periferiche dichiarano la stessa skill; chi non può farla esegue un Idle.

**F16 · 0.1 (set 2026) · Peripheral, ITS FAQ**
*Una Periferica (Ancillary) mai schierata a fine partita conta come Uccisa per gli obiettivi?*
→ No. Conta come Uccisa solo se è stata schierata e poi è entrata in Morto, o è in uno stato
Null a fine partita.

### Fireteam

**F13 · 0.1 (set 2026) · Fireteam Integrity, Fireteams Chart, FT Master**
*Se un Fireteam perde una truppa necessaria a formarlo, si cancella?*
→ No: la colonna "minimo" dei Fireteams Chart vale solo alla creazione. FT Master ha regole
proprie che possono prevalere.

**F14 · 0.1 (set 2026) · Fireteam Integrity, Fireteams Chart, Fireteams: Basic Rules**
*Il tipo di Fireteam cambia quando perde membri?*
→ No: un Haris da 3 che perde un membro resta un Haris da 2, non diventa un Duo.

**F15 · 0.0.0 (ott 2025) · Fireteams: Basic Rules; collegate: Booty, Coherency, Decoy State, Deployment Phase, Holoecho State, MetaChemistry, Minelayer**
*Nella propria fase di Schieramento si possono riposizionare truppe e Deployable?*
→ Sì, finché non si fa un tiro o una misura per quell'elemento: da lì la posizione è fissa
(per esempio, dopo il controllo di Coerenza di un Fireteam appena creato).

**F03 · 0.0.0 (ott 2025) · Coordinated Orders, Peripheral; collegate: Fireteams in the Active Turn, Stealth**
*Con più truppe attivate insieme (Coordinato, Fireteam), gli ARO possono prendere di mira una
truppa attiva che usa Stealth?*
→ Sì, ma l'ARO diventa un Idle se chi usa Stealth non dichiara una skill che consente ARO.

---

## 4. Aggiornamenti 5.2 / 5.3 trovati su queste pagine

La wiki segna ogni modifica con "Update PDF 5.x" e, per i cambi di testo, mostra
**l'originale accanto al nuovo**. Qui solo quelli che interessano il calcolatore.

| Ver. | Pagina | Cosa cambia |
|---|---|---|
| 5.3 | Firewall | il Firewall diventa **Automatic Equipment** (prima: Equipment) |
| 5.3 | Hacking Device | tutti i Dispositivi di Hacking: **Automatic Equipment**, etichetta Comms Equipment |
| 5.3 | Camouflaged State | contro un Marker CAMO si possono **dichiarare** come ARO solo Discover, Dodge, Look Out!, Reset (prima "eseguire") |
| 5.3 | Fireteam Integrity | il Fireteam si cancella se il Leader diventa Controller di una Periferica; una truppa esce dal Fireteam se diventa Controller |
| 5.3 | Peripheral | Periferica (Cyberplug): profilo Connesso / Autonomo; con Controller Isolato o Null passa ad Autonomo invece di diventare Disconnessa |
| 5.2 | Ballistic Skills | chi sta su una **superficie verticale** non beneficia della Copertura Parziale (prima: "chi sta scalando o è aggrappato") |
| 5.2 | BS Attack | Guidato senza modalità circolare: si sceglie una modalità qualsiasi ma si applica **sempre** la Sagoma Circolare centrata sul bersaglio |
| 5.2 | Immobilized-A State | chiarito che vincendo la Schivata F2F si cancella anche l'IMM-A |
| 5.2 | Order Expenditure Sequence | se nello stesso Ordine una truppa riceve e toglie Ferite o Stati, si applica **prima l'effetto positivo** poi il negativo |
| 5.2 | Peripheral | il Controller di una Periferica (Ancillary) può stare in Coordinato o Fireteam se non l'ha schierata o se è Disconnessa/Null |
| 5.2 | Transmutation | Escape System: il passaggio al secondo profilo cancella il Posseduto |
| 5.2 | Multispectral Visor | chi ha MSV **o Marksmanship** subisce White Noise, Reflective, Albedo |

---

## 5. Da fare

1. **Aprire le 7 pagine "coperte"** e le 2 in versione vecchia, per escludere FAQ proprie non
   collegate altrove. Priorità: **Traits** e **Skills and Equipment Module** (le più grandi).
2. **Trovare l'elenco completo della FAQ 0.0.0.** La categoria wiki equivalente non è emersa
   dalle ricerche; in alternativa, aprire le pagine delle skill che il motore implementa
   (Surprise Attack, Sixth Sense, Stealth, Dodge, Reset, Martial Arts, Natural Born Warrior…).
3. Quando esce una FAQ nuova, aggiungerla qui con un ID nuovo: gli ID già dati non si riusano.
