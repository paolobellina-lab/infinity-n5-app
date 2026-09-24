<!-- @versione 2026-09-23.1 | SCHEDE_SKILL_N5_gruppoB.md | proprieta`: chat REGOLE -->

# SCHEDE SKILL — GRUPPO B: le 11 skill a catalogo, mai citate dal codice, che toccano il gioco

> **Cos'è.** Delle 33 skill presenti in `CATALOGO_N5.SKILL` e mai citate da motore o moduli,
> queste 11 hanno effetti che l'app potrebbe dover calcolare o almeno mostrare. Per ognuna:
> la riga del regolamento, l'effetto, **cosa cambierebbe nell'app**, e quanti profili la portano.
> Serve a Paolo per decidere una per una se integrarle.
>
> Fonte: `REGOLE_N5_v5_1_1.txt`. Le pagine wiki corrispondenti non sono state riaperte per
> tutte: dove non l'ho fatto, lo dico.
>
> Gli altri due gruppi: **A** (7 skill che in N5 non esistono più — da togliere) e **C**
> (15 organizzative, nessun tiro da calcolare).

| Skill | Profili (Nomadi / PanO) | Impatto |
|---|---|---|
| Stealth | 34 / 77 | **alto**: cambia quali ARO il nemico può dichiarare |
| Courage | 92 / 79 | medio: Guts e Ritirata |
| Specialist Operative | 17 / 30 | solo scenari |
| Remote Presence | 19 / 22 | **alto**: due livelli di Incosciente, cure |
| Super-Jump | 12 / 21 | medio: niente Copertura lungo la traiettoria |
| Warhorse | 14 / 22 | medio: annulla `BS Attack (−X)` e l'Isolato |
| Regeneration | 4 / 0 | basso: un tiro PH nella Fase Stati |
| Aerial | 3 / 1 | medio: niente contatto di Silhouette, niente Engaged |
| Explode | 1 / 1 | basso: un attacco a sagoma alla morte |
| Exrah | 0 / 1 | basso: niente cure |
| Shasvastii | 0 / 1 | basso: stato al posto dell'Incosciente |

> ⚠️ Exrah e Shasvastii compaiono su due profili PanOceania (Samsa e Aïda Swanson
> (Minelayer)): sono skill razziali di altre fazioni, quindi probabilmente mercenari.
> Da confermare a DATABASE sull'elenco ufficiale.

---

## 1. STEALTH — righe 9974–9998
**Automatic Skill, Optional. Solo in Turno Attivo.**

- Permette il **Movimento Cauto dentro la ZdC e le Hacking Area** di Modelli e Marker nemici.
- Dichiarando Movimento Cauto, Idle o una Basic Short Skill con etichetta Movimento, concede
  ARO **solo ai nemici che hanno LoF** su di lui. Con qualunque altra skill, gli ARO sono normali.
- Se entra in contatto di Silhouette **senza entrare in LoF** e dichiara una di quelle altre
  skill, quel nemico può dichiarare **solo** CC Attack, Schivata, Reset o skill da Engaged.
- **Non funziona** contro Combat Instinct, Sesto Senso, né contro armi ed equipaggiamenti Deployable.

**Nell'app:** non cambia nessun MOD, cambia **chi può reagire**. È la skill del gruppo con
l'effetto più forte sul percorso ARO, e la più diffusa (111 profili). Il motore la conosce già
per rovescio, perché Combat Instinct e Sesto Senso la annullano.

---

## 2. COURAGE — righe 8076–8090
**Automatic Skill, Optional.**

- Passa **automaticamente** qualunque Guts Roll, a scelta dell'utente.
- **Non** entra in Ritirata!: continua ad agire normalmente fino a fine partita.
- **È** invece soggetto alla Perdita del Tenente.

**Nell'app:** niente MOD. Serve dove l'app propone un Guts o segna la Ritirata. Il Foxhole la
concede già (scheda 1.15 del prontuario).

---

## 3. SPECIALIST OPERATIVE — righe 9926–9940
**Automatic Skill, Optional.**

- L'utente conta come **Specialista** per missioni e scenari, anche se il suo tipo non lo sarebbe.

**Nell'app:** nessun effetto sui tiri. Serve solo se l'app gestirà gli obiettivi di scenario.

---

## 4. REMOTE PRESENCE — righe 9792–9824
**Automatic Skill, Obligatory. Resta attiva anche in stato Null.**

- Chi ha **STR** e questa skill ha **due livelli di Incosciente**: al raggiungimento della STR
  entra in Incosciente; con una Ferita in più **non muore**, entra in un secondo livello di
  Incosciente; solo con un'altra Ferita ancora entra in Morto.
- Un **solo** tiro riuscito di Ingegnere (WIP) o di GizmoKit (PH) toglie **tutte** le Ferite
  necessarie a cancellare l'Incosciente, da qualunque livello.
- Riparandolo con l'Ingegnere si possono spendere **Command Token per ritirare** un WIP fallito.

**Nell'app:** tocca il modulo Supporto (scheda 1.8) e il conteggio delle Ferite. È la skill del
gruppo che cambia più direttamente un esito: oggi l'app manderebbe a Morto un REM che invece
resta Incosciente. 41 profili.

---

## 5. SUPER-JUMP — righe 10062–10095
**Automatic Skill, Movement, Optional.**

- Il **Jump** diventa una Basic Short Skill, se dichiarato come prima Corta Base dell'ordine, e
  si può combinare con un'altra Corta (per esempio Jump + BS Attack).
- Come Long Skill salta fino al **primo valore di MOV + 4"**, invece dei 2" del Jump normale.
- Col valore fra parentesi nel profilo, quella distanza sostituisce i 2".
- **Restrizione che tocca i calcoli: dichiarando Jump non si beneficia della Copertura Parziale
  in nessun punto della traiettoria.**
- `Super-Jump (Jet Propulsion)`: può cambiare direzione a mezz'aria.

**Nell'app:** il pezzo che conta è la Copertura. Chi ha dichiarato Jump non prende il +3 alla
salvezza né impone il −3 a chi gli spara. 33 profili.

---

## 6. WARHORSE — righe 10373–10390
**Automatic Skill, Optional.**

- Non subisce la **Perdita del Tenente** e resta Regolare.
- Non subisce la **Ritirata!**: resta Regolare e agisce normalmente fino a fine partita.
- **Non può entrare in stato Isolato**, da qualunque fonte: munizioni, programmi di hacking,
  regole di scenario.
- **`BS Attack (−X)` non ha effetto contro di lui.**

**Nell'app:** due effetti sul calcolo. Il `BS Attack (−X)` dell'attaccante va ignorato, e
l'Isolato non deve poter essere applicato (quindi niente Oblivion né E/M). 36 profili.

---

## 7. REGENERATION — righe 9715–9738
**Automatic Skill, States Phase, Optional. Resta attiva in stato Null.**

- Nella **Fase Stati**, tiro **Normale di PH**: riuscito toglie 1 Ferita, e cancella
  l'Incosciente se serve; **fallito infligge 1 Ferita in più**.

**Nell'app:** un tiro nuovo, fuori dagli ordini. 4 profili, tutti Nomadi.

---

## 8. AERIAL — righe 7775–7795
**Automatic Skill, Obligatory.**

- **Non** può essere in Prono né in Engaged.
- **Non entra mai in contatto di Silhouette** con Modelli, obiettivi, scenografia o altri
  elementi, e viceversa, anche se i pezzi si toccano.
- **Non** può dichiarare Movimento Cauto.
- Il **Guard** non si usa contro di lui, salvo che sia Incosciente.

**Nell'app:** vieta CC, Engaged e Movimento Cauto. 4 profili.

---

## 9. EXPLODE — righe 8275–8300
**Automatic Skill, Attack, Obligatory.**

- Scatta **automaticamente** quando l'utente entra in Incosciente.
- Alla fine di quell'ordine, **prima dei Guts**, fa un attacco con **Sagoma Diretta**, sagoma
  Circolare centrata sulla propria base.
- Munizione **Shock**, salvezza su **ARM**, **PS 7**.
- Chi aveva dichiarato **Schivata** e ha passato il PH **evita** l'esplosione.
- Poi l'utente entra in Morto ed è rimosso.

**Nell'app:** un attacco completo da calcolare, innescato da un esito. 2 profili.

---

## 10. EXRAH — righe 8315–8330
**Automatic Skill, Obligatory. Resta attiva in stato Null.**

- Entrando in Incosciente passa **direttamente a Morto**, senza Ferita aggiuntiva, e va rimosso.
- Quindi **non è curabile in alcun modo**: Dottore, MediKit, Regeneration, nulla.

**Nell'app:** il contrario di Remote Presence. Va tolto dai bersagli del Supporto. 1 profilo.

---

## 11. SHASVASTII — righe 9885–9915
**Automatic Skill, Obligatory.**

- Entrando in Incosciente, il giocatore può **dichiarare** l'uso della skill: invece del
  segnalino Incosciente si piazza il segnalino **Shasvastii-Embryo**.
- Va dichiarata **nel momento** in cui entra in Incosciente, in Attivo o in Reattivo.
- In quello stato la truppa conta comunque per i Punti Vittoria della Ritirata!
- ⚠️ Il resto degli effetti dell'Embryo (cosa può fare, come si cancella) sta su una pagina
  impaginata su due colonne: da rileggere sulla wiki prima di implementarlo.

**Nell'app:** uno stato nuovo. 1 profilo.

---

## Cosa consiglierei, se si parte da qualcosa

1. **Remote Presence** ed **Exrah**: cambiano l'esito di una cura o di una morte, e i profili
   sono tanti (41) o pochissimi ma netti (1). Sono le uniche due che oggi fanno dare all'app
   una risposta sbagliata, non solo incompleta.
2. **Warhorse**: due MOD da ignorare, regola semplice, 36 profili.
3. **Super-Jump**: la sola Copertura lungo la traiettoria.
4. **Stealth**: grande effetto, ma tutto sul percorso ARO, quindi il lavoro è più grosso.
Il resto può aspettare.
