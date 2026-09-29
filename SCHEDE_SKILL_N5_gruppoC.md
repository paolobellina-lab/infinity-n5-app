<!-- @versione 2026-09-28.1 | SCHEDE_SKILL_N5_gruppoC.md | proprieta`: chat REGOLE -->

# SCHEDE SKILL — GRUPPO C: le 15 organizzative

> Completa il lavoro sulle 33 skill a catalogo mai citate dal codice. Il **gruppo A**
> (7 skill che in N5 non esistono più) va tolto; il **gruppo B** (11 che toccano il calcolo)
> è in `SCHEDE_SKILL_N5_gruppoB.md`. Queste 15 **non producono nessun tiro da calcolare**:
> agiscono su Ordini, Tenente, schieramento, Fireteam e scenari.
>
> Fonte: `REGOLE_N5_v5_1_1.txt`, riga indicata per ciascuna. Due voci non sono nel PDF e
> sono segnate ⚠️.
>
> **Perché guardarle comunque:** cinque toccano il **conteggio degli Ordini** o la
> **Perdita del Tenente**, che l'app mostra anche se non li tira.

| Skill | Riga | Tipo | Tocca |
|---|---|---|---|
| Tactical Awareness | 10153 | Automatic | **Ordini** |
| Impetuous | 8695 | Automatic, Fase Impetuosa | **Ordini** |
| Inspiring Leadership | 8819 | Automatic, Obbligatoria | **Ordini, Training** |
| Chain of Command | 7923 | Automatic | **Perdita del Tenente** |
| Number 2 | 9427 | Automatic | Fireteam |
| Religious Troop | 9752 | Automatic, Obbligatoria | Guts, Ritirata! |
| Counterintelligence | 8098 | Automatic | Command Token |
| Booty | 7862 | Deployment | equipaggiamento |
| MetaChemistry | 9074 | Deployment | attributi e skill |
| Forward Deployment | 8339 | Deployment | schieramento |
| Strategic Deployment | 9955 | Deployment | schieramento del Fireteam |
| TAGCom | 10177 | Automatic | MOD ai TAG |
| Specialist Operative | 9926 | Automatic | scenari |
| Frenzy | 8396 | Automatic, Fase Stati | Impetuous |
| FT Master | ⚠️ | — | Fireteam |

---

## Quelle che toccano gli Ordini

**Tactical Awareness** — riga 10153. Dà all'utente un **Ordine Tattico in più**, oltre a quello
del suo Training. Si piazza accanto a lui nel Conteggio Ordini, se è sul tavolo come Modello o
Marker. L'Ordine Tattico si spende **solo su di lui**.

**Impetuous** — riga 8695. Nella Fase Tattica si piazza un segnalino Impetuoso accanto a ogni
truppa che ce l'ha. Nella **Fase Impetuosa** ciascuna può essere attivata **una volta senza
spendere Ordini**. Il segnalino si toglie all'attivazione, o alla fine della fase.

**Inspiring Leadership** — riga 8819. L'utente deve essere il **Tenente**, sul tavolo e non in
stato Null. Finché lo è, tutte le truppe della lista che danno Ordini sono **Regolari** e hanno
**Courage** (non chi ha Religious Troop, che ha regole proprie).

**Chain of Command** — riga 7923. Si usa all'inizio del controllo di Perdita del Tenente,
quando il Tenente è Isolato o in uno stato Null. L'utente, se è sul tavolo e non Isolato né
Null, **diventa automaticamente il nuovo Tenente**: la Perdita del Tenente non avviene.

**Frenzy** — riga 8396, Fase Stati, Obbligatoria. Se l'utente ha inflitto almeno una Ferita o
causato un Morto, dalla Fase Stati successiva guadagna **Impetuous** e lo tiene per il resto
della partita. Quindi entra negli Ordini attraverso l'Impetuoso, non da sola.

## Fireteam

**Number 2** — riga 9427. Se il Leader del proprio Fireteam entra in Isolato o in uno stato
Null, l'utente **diventa Leader**. Resta Leader anche se il precedente si riprende.

**Strategic Deployment** — riga 9955. L'utente deve essere schierato **per primo** fra i membri
del Fireteam e **come Leader**. Allora lui e poi il resto del Fireteam si schierano come se
avessero il Forward Deployment (o la regola indicata nel profilo).

**FT Master** — ⚠️ non è nel PDF 5.1.1 fra le Special Skill: sta nelle regole dei Fireteam, e
sulla wiki ha pagina propria. Le sue regole di composizione prevalgono sui Fireteams Chart
(FAQ **F13**). Da riaprire sulla wiki prima di implementarla.

## Schieramento

**Forward Deployment** — riga 8339, Superior Deployment. Ci si schiera **oltre** la propria Zona
di Schieramento, dei pollici indicati fra parentesi nel profilo. Restano i divieti generali:
mai a contatto di Modelli, Marker o segnalini nemici e neutrali, né di un obiettivo.

**Booty** — riga 7862. Dopo aver piazzato la truppa come Modello, si tira sulla **Booty Chart**:
l'oggetto ottenuto **si aggiunge** all'equipaggiamento, non sostituisce niente. La tabella
contiene anche armi vere (per esempio il Panzerfaust al 13), quindi il risultato può cambiare
cosa la truppa può fare in partita.

**MetaChemistry** — riga 9074. Come Booty, ma sulla **MetaChemistry Chart**: dà un MOD o una
Special Skill in più (da +3 PH a Super-Jump, Regeneration, +6 BTS, NWI, Dogged…), che **si
aggiunge** alle skill del profilo. È l'unica del gruppo che può far comparire una skill del
gruppo B su una truppa che non ce l'aveva.

## Le altre

**Religious Troop** — riga 9752. Passa **automaticamente** i Guts Roll, quindi non può
arretrare né cercare copertura; se il giocatore lo vuole, può tentare un **Tiro di WIP**: se
riesce, applica gli effetti del Guts fallito. Non entra in Ritirata!.

**Counterintelligence** — riga 8098. Vale solo se l'utente è stato schierato. Riduce a **uno**
il numero di Ordini che l'avversario può annullare con l'Uso Strategico di un Command Token,
oppure annulla il limite imposto all'uso dei propri Command Token.

**TAGCom** — riga 10177. Finché l'utente è sul tavolo in stato non Null, **tutti i TAG del suo
Gruppo di Combattimento** ricevono i MOD scritti fra parentesi nel suo profilo. MOD uguali non
si sommano: si applicano solo quelli diversi fra loro.

**Specialist Operative** — riga 9926. L'utente conta come **Specialista** negli scenari, anche
se il suo tipo non lo sarebbe.

**Journalist** — ⚠️ non è nel PDF 5.1.1, ma è su 3 profili del database e sulla wiki. Da
riaprire prima di scriverla.

---

## Cosa ne farei

- **Nessuna di queste cambia un tiro**, quindi nessuna è urgente.
- Le due da guardare per prime, se un giorno l'app conterà gli Ordini, sono **Tactical
  Awareness** e **Impetuous**: aggiungono attivazioni, e sono le uniche che cambiano quanto si
  può fare in un turno.
- **MetaChemistry** e **Booty** meritano una nota nell'interfaccia più che nel motore: il loro
  esito va scritto a mano dal giocatore, perché nasce da un tiro fatto allo schieramento.
- **FT Master** e **Journalist** restano aperte: le due voci che il PDF non copre.
