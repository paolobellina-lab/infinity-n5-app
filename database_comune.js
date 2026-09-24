// @versione 2026-09-22.2 | database_comune.js | proprieta`: chat DATABASE
// ==========================================
// --- database_comune.js ---
// Regole, armi, equipaggiamenti, strutture e terreni
// ==========================================

// RULES_AMMO e` stata RIMOSSA il 2026-09-20.
// Duplicava in forma ridotta CATALOGO_N5.MUNIZIONI (catalogo_n5.js), che e` l'unica
// fonte usata dal motore per risolvere le munizioni, combinate comprese. Nessun modulo
// la leggeva per calcolare, e conteneva un errore che il catalogo non ha: T2 con
// `saves: 2`, mentre in N5 la T2 e` UNA salvezza su ARM per colpo e ogni fallita
// infligge 2 Ferite (regolamento v5.1.1, righe 5855-5869).
// Due fonti per lo stesso dato divergono: e` il caso Dottore/Ingegnere.
// Per le munizioni leggere CATALOGO_N5.MUNIZIONI e CATALOGO_N5.MUNIZIONI_COMBINATE.


// `chiaveArma`  = voce di RULES_WEAPONS con cui il token RISOLVE i suoi attacchi.
// `generatoDa`  = voce di RULES_WEAPONS che PRODUCE il token. null = nasce
//                 dall'equipaggiamento del portatore con Place Deployable.
//                 Disco Ball nasce dall'esito del tiro del Disco Baller (reg. riga 4518),
//                 Deployable Repeater dal Pitcher, che e` una BS Weapon che li spara
//                 (reg. riga 4749). Il Dazer NO: e` Automatic Equipment piazzato
//                 direttamente dal portatore, quindi resta null.
// `armaDalProfilo` = solo per armed_turret: chiaveArma serve a PIAZZARLA (Tratto
//                 Deployable), ma l'attacco lo fa l'arma fra parentesi nel profilo
//                 del portatore. tipo TORRETTA e non MARKER: MARKER vuol dire
//                 mimetizzabile per logica_stati.js e roster_manager.js.
window.DB_DEPLOYABLES = [
    { id: "deployable_cover", generatoDa: null, chiaveArma: "Deployable Cover",
      nome: "Deployable Cover", tipo: "STRUTTURA", isCamo: false,
      arm: null, bts: null, str: null, s: 3,
      equip: "Deployable Cover", armi: null,
      traits: ["Deployable", "Disposable (1)", "Indiscriminate"] },
    { id: "armed_turret", generatoDa: null, chiaveArma: "Armed Turret", armaDalProfilo: true,
      nome: "Armed Turret", tipo: "TORRETTA", isCamo: false,
      mov: "-", cc: 5, bs: 10, ph: "-", wip: "-", arm: 2, bts: 3, str: 1, s: 2,
      equip: "360 Visor", skills: "Total Reaction", ccWeapon: "PARA CC Weapon (-3)",
      armi: null, traits: ["Disposable (1)", "Deployable", "Non-Reloadable", "Perimeter"] },
    { id: "mina_ap", generatoDa: null, chiaveArma: "AP Mine", nome: "Mina AP", tipo: "MARKER", isCamo: true, arm: 0, bts: 0, str: 1, s: 0, equip: "Mina AP", armi: "AP", traits: ["Small Teardrop"] },
    { id: "mina_shock", generatoDa: null, chiaveArma: "Shock Mine", nome: "Mina Shock", tipo: "MARKER", isCamo: true, arm: 0, bts: 0, str: 1, s: 0, equip: "Mina Shock", armi: "Shock", traits: ["Small Teardrop"] },
    { id: "mina_em", generatoDa: null, chiaveArma: "E/M Mine", nome: "Mina E/M", tipo: "MARKER", isCamo: true, arm: 0, bts: 0, str: 1, s: 0, equip: "Mina E/M", armi: "E/M", traits: ["Small Teardrop"] },
    { id: "mina_viral", generatoDa: null, chiaveArma: "Viral Mine", nome: "Mina Virale", tipo: "MARKER", isCamo: true, arm: 0, bts: 0, str: 1, s: 0, equip: "Mina Virale", armi: "N (BTS)", traits: ["Small Teardrop", "BioWeapon"] },
    { id: "cybermine", generatoDa: null, chiaveArma: "Cybermine", nome: "Cybermina", tipo: "MARKER", isCamo: true, arm: 0, bts: 0, str: 1, s: 0, equip: "Cybermina", armi: "Comms Attack", traits: ["Small Teardrop", "IMM-B/Stunned"] },
    { id: "mina_monofilamento", generatoDa: null, nome: "Mina Monofilamento", tipo: "MARKER", isCamo: true, arm: 0, bts: 0, str: 1, s: 0, equip: "Mina Monofilamento", armi: "N (ARM=0)", traits: ["Small Teardrop", "State: Dead"], chiaveArma: "Monofilament Mine" },
    { id: "mina_para", generatoDa: null, nome: "Mina PARA", tipo: "MARKER", isCamo: true, arm: 0, bts: 0, str: 1, s: 0, equip: "Mina PARA", armi: "PARA", traits: ["Small Teardrop", "State: Immobilized-A"], chiaveArma: "PARA Mine" },
    { id: "crazykoala", generatoDa: null, chiaveArma: "CrazyKoalas", nome: "CrazyKoala", tipo: "PERIMETER", isCamo: false, arm: 0, bts: 0, str: 1, s: 1, equip: "CrazyKoala", armi: "Shock", traits: ["Boost"] },
    { id: "fastpanda", generatoDa: null, chiaveArma: "FastPanda", nome: "FastPanda", tipo: "PERIMETER", isCamo: false, arm: 0, bts: 0, str: 1, s: 1, equip: "Repeater", armi: "-", traits: ["Hacking Area"] },
    { id: "dropbear", generatoDa: null, chiaveArma: "Drop Bears (Deployable Mode)", nome: "Drop Bear", tipo: "MARKER", isCamo: true, arm: 0, bts: 0, str: 1, s: 0, equip: "Drop Bear", armi: "Shock", traits: ["Small Teardrop"] },
    { id: "wildparrot", generatoDa: null, chiaveArma: "WildParrot", nome: "WildParrot", tipo: "PERIMETER", isCamo: false, arm: 0, bts: 0, str: 1, s: 1, equip: "WildParrot", armi: "E/M", traits: ["Small Teardrop"] },
    { id: "deployable_repeater", generatoDa: "Pitcher", chiaveArma: null, nome: "Deployable Repeater", tipo: "MARKER", isCamo: false, arm: 0, bts: 0, str: 1, s: 1, equip: "Deployable Repeater", armi: "-", traits: ["Disposable (3)", "Deployable"] },
    { id: "dazer", generatoDa: null, chiaveArma: null, nome: "Dazer", tipo: "MARKER", isCamo: false, arm: 0, bts: 0, str: 1, s: 1, equip: "Dazer", armi: "-", traits: ["Disposable (3)", "Deployable", "Zone of Control"] },
    { id: "disco_ball", generatoDa: "Disco Baller", chiaveArma: "Disco Ball", nome: "Disco Ball", tipo: "MARKER", isCamo: false, arm: 0, bts: 0, str: 1, s: 1, equip: "Disco Baller", armi: "-", traits: ["Deployable"] },
    { id: "madtraps", generatoDa: null, chiaveArma: "Madtraps", nome: "MadTraps", tipo: "PERIMETER", isCamo: false, arm: 0, bts: 0, str: 1, s: 1, equip: "MadTraps", armi: "PARA", traits: ["Boost", "IMM-A"] }
];

// ===== TABELLA ARMI — trascritta dal Weapon Chart ufficiale (N5.2 / agg. Mazebreaker) =====
// `bande`: una voce per fascia da 8", in ordine. Indice i => da i*8" a (i+1)*8".
//          null / fine array = FUORI GITTATA. Le armi con colonna 96" hanno 12 voci.
// `risoluzione`: per le armi che NON si risolvono a gittata (nessuna banda, nessuna sagoma).
//          BOOST_ZOC          = Perimetro+Boost: detona su nemico nella sua ZoC, il bersaglio
//                               tira PH (Schivata); nessun MOD di gittata, nessun tiro per colpire.
//          ZOC_WIP            = F2F su WIP dentro la ZoC, senza LoF.
//          CONTATTO_STRUTTURA = uso a contatto di Silhouette contro Building/Scenery Structure
//                               OPPURE contro un Modello nemico in stato Immobilizzato o Null
//                               (esclusi Sepsitorizzato e Posseduto). Reg. v5.1.1 riga 6036.
//                               Il nome e` storico: i campi bersagliAmmessi/Esclusi dicono il vero.
//          CC                 = solo corpo a corpo.
// `salvAttr` e `salvTiri` vengono dalla tabella e hanno la precedenza sulla munizione:
//          es. Breaker Combi Rifle usa munizione AP ma si salva su BTS/2, non su ARM/2.
window.RULES_WEAPONS = {
    "Tactical Bow": { traits: ["Anti-materiel","Silent (-6)"], b: 1, dam: 8, ammo: "DA", salvAttr: "ARM", salvTiri: 2, bande: [3, 0, -6] },
    "E/M Carbine": { traits: ["Non-Lethal"], b: 2, dam: 7, ammo: "E/M", salvAttr: "BTS/2", salvTiri: 2, bande: [3, 3, -3, -3, -6] },
    "Plasma Carbine (Blast Mode)": { traits: ["Impact Template (Circular)"], b: 2, dam: 7, ammo: "N", salvAttr: "ARM+BTS", salvTiri: "1e1", bande: [3, 3, -3, -3, -6], isTemplate: true, template: "Circular" },
    "Plasma Carbine (Hit Mode)": { traits: [], b: 2, dam: 6, ammo: "N", salvAttr: "ARM+BTS", salvTiri: "1e1", bande: [3, 3, -3, -3, -6] },
    "CC Weapon": { traits: ["CC"], b: 1, dam: 8, ammo: "N", salvAttr: "ARM", salvTiri: 1, isCC: true },
    "AP CC Weapon": { traits: ["CC"], b: 1, dam: 8, ammo: "AP", salvAttr: "ARM/2", salvTiri: 1, isCC: true },
    "AP+DA CC Weapon": { traits: ["Anti-materiel","CC"], b: 1, dam: 8, ammo: "AP+DA", salvAttr: "ARM/2", salvTiri: 2, isCC: true },
    "AP+EXP CC Weapon": { traits: ["Anti-materiel","CC"], b: 1, dam: 8, ammo: "AP+EXP", salvAttr: "ARM/2", salvTiri: 3, isCC: true },
    "AP+Shock CC Weapon": { traits: ["CC"], b: 1, dam: 8, ammo: "AP+SHOCK", salvAttr: "ARM/2", salvTiri: 1, isCC: true },
    "AP+T2 CC Weapon": { traits: ["Anti-materiel","CC"], b: 1, dam: 8, ammo: "AP+T2", salvAttr: "ARM/2", salvTiri: 1, isCC: true },
    "DA CC Weapon": { traits: ["Anti-materiel","CC"], b: 1, dam: 8, ammo: "DA", salvAttr: "ARM", salvTiri: 2, isCC: true },
    "E/M CC Weapon": { traits: ["CC"], b: 1, dam: 8, ammo: "N+E/M", salvAttr: "BTS/2", salvTiri: 2, isCC: true },
    "EXP CC Weapon": { traits: ["Anti-materiel","CC"], b: 1, dam: 8, ammo: "EXP", salvAttr: "ARM", salvTiri: 3, isCC: true },
    "Monofilament CC Weapon": { traits: ["CC","State: Dead"], b: 1, dam: 8, ammo: "N", salvAttr: "ARM=0", salvTiri: 1, isCC: true },
    // PARA CC Weapon — la salvezza e` SEMPRE PH-6 (reg. v5.1.1 righe 5715-5718).
    // Il (-3)/(-6)/(-9) scritto nel profilo NON tocca la salvezza: e` un MOD
    // all'AVVERSARIO nel Faccia a Faccia di CC (righe 9270-9282, esempio del
    // Natural Born Warrior). Sono due numeri distinti. In una versione precedente
    // c'era qui salvAttrDaProfilo: "PH", che faceva salvare su PH-3: era sbagliato.
    "PARA CC Weapon": { traits: ["CC","State: Immobilized-A","Non-Lethal"], b: 1, dam: null, ammo: "PARA", salvAttr: "PH-6", salvTiri: 1, isCC: true, modProfiloSu: "F2F_AVVERSARIO" },
    "Shock CC Weapon": { traits: ["CC"], b: 1, dam: 8, ammo: "SHOCK", salvAttr: "ARM", salvTiri: 1, isCC: true },
    "T2 CC Weapon": { traits: ["Anti-materiel","CC"], b: 1, dam: 8, ammo: "T2", salvAttr: "ARM", salvTiri: 1, isCC: true },
    "Viral CC Weapon": { traits: ["BioWeapon (DA+Shock)","CC"], b: 1, dam: 8, ammo: "N", salvAttr: "BTS", salvTiri: 1, isCC: true },
    "Trench-Hammer (BS Mode)": { traits: ["Anti-materiel","BS Weapon (PH)"], b: 1, dam: 6, ammo: "DA", salvAttr: "ARM", salvTiri: 2, bande: [0, 0, -3] },
    "Trench-Hammer (CC Mode)": { traits: ["Anti-materiel","CC"], b: 1, dam: 6, ammo: "DA", salvAttr: "ARM", salvTiri: 2, isCC: true },
    "Akrylat-Kanone": { traits: ["Disposable (2)","State: Immobilized-A","Non-Lethal"], b: 1, dam: null, ammo: "PARA", salvAttr: "PH-6", salvTiri: 1, bande: [-3, 0, 3, 3, -3, -3] },
    "Blitzen": { traits: ["Disposable (2)","Non-Lethal"], b: 1, dam: 6, ammo: "E/M", salvAttr: "BTS/2", salvTiri: 2, bande: [-3, 0, 3, 3, -3, -3] },
    "Panzerfaust": { traits: ["Anti-materiel","Disposable (2)"], b: 1, dam: 6, ammo: "AP+EXP", salvAttr: "ARM/2", salvTiri: 3, bande: [-3, 0, 3, 3, -3, -3] },
    "Heavy Flamethrower": { traits: ["Intuitive Attack","Continuous Damage","Direct Template (Large Teardrop)"], b: 1, dam: 6, ammo: "N", salvAttr: "ARM", salvTiri: 1, isTemplate: true, template: "LargeTeardrop" },
    "Light Flamethrower": { traits: ["Intuitive Attack","Continuous Damage","Direct Template (Small Teardrop)"], b: 1, dam: 7, ammo: "N", salvAttr: "ARM", salvTiri: 1, isTemplate: true, template: "SmallTeardrop" },
    "Grenades": { traits: ["Speculative Attack","BS Weapon (PH)","Impact Template (Circular)"], b: 1, dam: 7, ammo: "N", salvAttr: "ARM", salvTiri: 1, bande: [3, -3], isTemplate: true, template: "Circular" },
    "E/M Grenades": { traits: ["Speculative Attack","BS Weapon (PH)","Impact Template (Circular)","Non-Lethal"], b: 1, dam: 7, ammo: "E/M", salvAttr: "BTS/2", salvTiri: 2, bande: [3, -3], isTemplate: true, template: "Circular" },
    "Eclipse Grenades": { traits: ["Speculative Attack","BS Weapon (PH)","Impact Template (Circular)","Non-Lethal","Reflective","Targetless"], b: 1, dam: null, ammo: "ECLIPSE", salvAttr: null, salvTiri: null, bande: [0, -3], isTemplate: true, template: "Circular" },
    "Smoke Grenades": { traits: ["Speculative Attack","BS Weapon (PH)","Impact Template (Circular)","Non-Lethal","Targetless"], b: 1, dam: null, ammo: "SMOKE", salvAttr: null, salvTiri: null, bande: [0, -3], isTemplate: true, template: "Circular" },
    "Grenade Launcher": { traits: ["Speculative Attack","Impact Template (Circular)"], b: 1, dam: 7, ammo: "N", salvAttr: "ARM", salvTiri: 1, bande: [0, 0, 0, -3, -6, -6], isTemplate: true, template: "Circular" },
    "E/M Grenade Launcher": { traits: ["Speculative Attack","Non-Lethal","Impact Template (Circular)"], b: 1, dam: 7, ammo: "E/M", salvAttr: "BTS/2", salvTiri: 2, bande: [0, 0, 0, -3, -6, -6], isTemplate: true, template: "Circular" },
    "Eclipse Grenade Launcher": { traits: ["Speculative Attack","Non-Lethal","Impact Template (Circular)","Reflective","Targetless"], b: 1, dam: null, ammo: "ECLIPSE", salvAttr: null, salvTiri: null, bande: [0, 0, 0, -3, -6, -6], isTemplate: true, template: "Circular" },
    "Smoke Grenade Launcher": { traits: ["Speculative Attack","Non-Lethal","Impact Template (Circular)","Targetless"], b: 1, dam: null, ammo: "SMOKE", salvAttr: null, salvTiri: null, bande: [0, 0, 0, -3, -6, -6], isTemplate: true, template: "Circular" },
    "Heavy Machine Gun": { traits: ["Suppressive Fire"], b: 4, dam: 5, ammo: "N", salvAttr: "ARM", salvTiri: 1, bande: [-3, 0, 3, 3, -3, -3] },
    "AP Heavy Machine Gun": { traits: ["Suppressive Fire"], b: 4, dam: 5, ammo: "AP", salvAttr: "ARM/2", salvTiri: 1, bande: [-3, 0, 3, 3, -3, -3] },
    "MULTI Heavy Machine Gun (Anti-Materiel Mode)": { traits: ["Anti-materiel"], b: 1, dam: 5, ammo: "EXP", salvAttr: "ARM", salvTiri: 3, bande: [-3, 0, 3, 3, -3, -3] },
    "MULTI Heavy Machine Gun (AP Mode)": { traits: ["Suppressive Fire"], b: 4, dam: 5, ammo: "AP", salvAttr: "ARM/2", salvTiri: 1, bande: [-3, 0, 3, 3, -3, -3] },
    "MULTI Heavy Machine Gun (Shock Mode)": { traits: ["Suppressive Fire"], b: 4, dam: 5, ammo: "SHOCK", salvAttr: "ARM", salvTiri: 1, bande: [-3, 0, 3, 3, -3, -3] },
    "Marksman Rifle": { traits: ["Suppressive Fire"], b: 3, dam: 7, ammo: "N", salvAttr: "ARM", salvTiri: 1, bande: [-3, 3, 3, -3, -3, -6] },
    "AP Marksman Rifle": { traits: ["Suppressive Fire"], b: 3, dam: 7, ammo: "AP", salvAttr: "ARM/2", salvTiri: 1, bande: [-3, 3, 3, -3, -3, -6] },
    "K1 Marksman Rifle": { traits: ["Anti-materiel","Suppressive Fire"], b: 3, dam: 7, ammo: "N", salvAttr: "ARM=0", salvTiri: 1, bande: [-3, 3, 3, -3, -3, -6] },
    "Shock Marksman Rifle": { traits: ["Suppressive Fire"], b: 3, dam: 7, ammo: "SHOCK", salvAttr: "ARM", salvTiri: 1, bande: [-3, 3, 3, -3, -3, -6] },
    "T2 Marksman Rifle": { traits: ["Anti-materiel","Suppressive Fire"], b: 3, dam: 7, ammo: "T2", salvAttr: "ARM", salvTiri: 1, bande: [-3, 3, 3, -3, -3, -6] },
    "Viral Marksman Rifle": { traits: ["BioWeapon (DA+Shock)","Suppressive Fire"], b: 3, dam: 7, ammo: "N", salvAttr: "BTS", salvTiri: 1, bande: [-3, 3, 3, -3, -3, -6] },
    "MULTI Marksman Rifle (Anti-Materiel Mode)": { traits: ["Anti-materiel"], b: 1, dam: 7, ammo: "DA", salvAttr: "ARM", salvTiri: 2, bande: [-3, 3, 3, -3, -3, -6] },
    "MULTI Marksman Rifle (AP Mode)": { traits: ["Suppressive Fire"], b: 3, dam: 7, ammo: "AP", salvAttr: "ARM/2", salvTiri: 1, bande: [-3, 3, 3, -3, -3, -6] },
    "MULTI Marksman Rifle (Shock Mode)": { traits: ["Suppressive Fire"], b: 3, dam: 7, ammo: "SHOCK", salvAttr: "ARM", salvTiri: 1, bande: [-3, 3, 3, -3, -3, -6] },
    "AP Mine": { traits: ["Intuitive Attack","Concealed","Disposable (3)","Direct Template (Small Teardrop)","Deployable"], b: 1, dam: 7, ammo: "AP", salvAttr: "ARM/2", salvTiri: 1, isTemplate: true, template: "SmallTeardrop" },
    "E/M Mine": { traits: ["Intuitive Attack","Concealed","Disposable (3)","Direct Template (Small Teardrop)","Non-Lethal","Deployable"], b: 1, dam: 7, ammo: "E/M", salvAttr: "BTS/2", salvTiri: 2, isTemplate: true, template: "SmallTeardrop" },
    "Shock Mine": { traits: ["Intuitive Attack","Concealed","Disposable (3)","Direct Template (Small Teardrop)","Deployable"], b: 1, dam: 7, ammo: "SHOCK", salvAttr: "ARM", salvTiri: 1, isTemplate: true, template: "SmallTeardrop" },
    "PARA Mine": { traits: ["Intuitive Attack","Concealed","Disposable (3)","Direct Template (Small Teardrop)","Non-Lethal","Deployable"], b: 1, dam: null, ammo: "PARA", salvAttr: "PH-6", salvTiri: 1, isTemplate: true, template: "SmallTeardrop" },
    "Viral Mine": { traits: ["Intuitive Attack","BioWeapon (DA+Shock)","Concealed","Disposable (3)","Direct Template (Small Teardrop)","Deployable"], b: 1, dam: 7, ammo: "N", salvAttr: "BTS", salvTiri: 1, isTemplate: true, template: "SmallTeardrop" },
    "Monofilament Mine": { traits: ["Intuitive Attack","Concealed","Disposable (3)","Direct Template (Small Teardrop)","Deployable","State: Dead"], b: 1, dam: 8, ammo: "N", salvAttr: "ARM=0", salvTiri: 1, isTemplate: true, template: "SmallTeardrop" },
    "Cybermine": { traits: ["Comms Attack","Intuitive Attack","Concealed","Disposable (3)","State: Stunned/Immobilized-B","Non-Lethal","Direct Template (Small Teardrop)","Deployable"], b: 1, dam: 5, ammo: null, salvAttr: "BTS", salvTiri: 2, isTemplate: true, template: "SmallTeardrop" },
    "Mine Dispenser (Cybermines)": { traits: ["Speculative Attack","Double Shot","Disposable (2)","Targetless"], b: 1, dam: null, ammo: null, salvAttr: null, salvTiri: null, bande: [0, 3, -3, -6, -6, -6] },
    "WildParrot": { traits: ["Intuitive Attack","Disposable (1)","Non-Lethal","Perimeter","Direct Template (Small Teardrop)","Deployable"], b: 1, dam: 7, ammo: "E/M", salvAttr: "BTS/2", salvTiri: 2, isTemplate: true, template: "SmallTeardrop" },
    "CrazyKoalas": { risoluzione: "BOOST_ZOC",  traits: ["Disposable (2)","Boost","Perimeter","Deployable"], b: 1, dam: 5, ammo: "SHOCK", salvAttr: "ARM", salvTiri: 1 },
    "Madtraps": { risoluzione: "BOOST_ZOC",  traits: ["Disposable (2)","Boost","Non-Lethal","Perimeter","Deployable"], b: 1, dam: null, ammo: "PARA", salvAttr: "PH-6", salvTiri: 1 },
    "Pistol": { traits: [], b: 2, dam: 9, ammo: "N", salvAttr: "ARM", salvTiri: 1, bande: [3, 0, -6] },
    "Heavy Pistol": { traits: [], b: 2, dam: 6, ammo: "SHOCK", salvAttr: "ARM", salvTiri: 1, bande: [3, 0, -6] },
    "AP Heavy Pistol": { traits: [], b: 2, dam: 6, ammo: "AP", salvAttr: "ARM/2", salvTiri: 1, bande: [3, 0, -6] },
    "Assault Pistol": { traits: [], b: 4, dam: 7, ammo: "N", salvAttr: "ARM", salvTiri: 1, bande: [3, 0, -6] },
    "Breaker Pistol": { traits: [], b: 2, dam: 8, ammo: "AP", salvAttr: "BTS/2", salvTiri: 1, bande: [3, 0, -6] },
    "Silenced Pistol": { traits: ["Silent (-6)"], b: 2, dam: 8, ammo: "AP+SHOCK", salvAttr: "BTS/2", salvTiri: 1, bande: [3, 0, -6] },
    "Stun Pistol": { traits: ["Non-Lethal","State: Stunned"], b: 2, dam: 8, ammo: "STUN", salvAttr: "BTS", salvTiri: 1, bande: [3, 0, -6] },
    "Viral Pistol": { traits: ["BioWeapon (DA+Shock)"], b: 2, dam: 8, ammo: "N", salvAttr: "BTS", salvTiri: 1, bande: [3, 0, -6] },
    "Boarding Pistol (Blast Mode)": { traits: ["Intuitive Attack","Direct Template (Small Teardrop)"], b: 1, dam: 7, ammo: "N", salvAttr: "ARM", salvTiri: 1, isTemplate: true, template: "SmallTeardrop" },
    "Boarding Pistol (Hit Mode)": { traits: [], b: 2, dam: 7, ammo: "N", salvAttr: "ARM", salvTiri: 1, bande: [3, 0, -6] },
    "Kobra Pistol (BS Mode)": { traits: [], b: 2, dam: 7, ammo: "SHOCK", salvAttr: "ARM", salvTiri: 1, bande: [3, 0, -6] },
    "Kobra Pistol (CC Mode)": { traits: ["Anti-materiel","CC"], b: 1, dam: 7, ammo: "DA", salvAttr: "ARM", salvTiri: 2, isCC: true },
    "MULTI Pistol (Anti-Materiel Mode)": { traits: ["Anti-materiel"], b: 1, dam: 7, ammo: "DA", salvAttr: "ARM", salvTiri: 2, bande: [3, 0, -6] },
    "MULTI Pistol (AP Mode)": { traits: [], b: 2, dam: 7, ammo: "AP", salvAttr: "ARM/2", salvTiri: 1, bande: [3, 0, -6] },
    "MULTI Pistol (Shock Mode)": { traits: [], b: 2, dam: 7, ammo: "SHOCK", salvAttr: "ARM", salvTiri: 1, bande: [3, 0, -6] },
    "Red Fury": { traits: ["Suppressive Fire"], b: 4, dam: 7, ammo: "SHOCK", salvAttr: "ARM", salvTiri: 1, bande: [0, 3, 3, -3, -3, -6] },
    "AP Red Fury": { traits: ["Suppressive Fire"], b: 4, dam: 7, ammo: "AP", salvAttr: "ARM/2", salvTiri: 1, bande: [0, 3, 3, -3, -3, -6] },
    "MULTI Red Fury (Anti-Materiel Mode)": { traits: ["Anti-materiel"], b: 1, dam: 7, ammo: "DA", salvAttr: "ARM", salvTiri: 2, bande: [0, 3, 3, -3, -3, -6] },
    "MULTI Red Fury (AP Mode)": { traits: ["Suppressive Fire"], b: 4, dam: 7, ammo: "AP", salvAttr: "ARM/2", salvTiri: 1, bande: [0, 3, 3, -3, -3, -6] },
    "MULTI Red Fury (Shock Mode)": { traits: ["Suppressive Fire"], b: 4, dam: 7, ammo: "SHOCK", salvAttr: "ARM", salvTiri: 1, bande: [0, 3, 3, -3, -3, -6] },
    "Rifle": { traits: ["Suppressive Fire"], b: 3, dam: 7, ammo: "N", salvAttr: "ARM", salvTiri: 1, bande: [0, 3, -3, -3, -6, -6] },
    "AP Rifle": { traits: ["Suppressive Fire"], b: 3, dam: 7, ammo: "AP", salvAttr: "ARM/2", salvTiri: 1, bande: [0, 3, -3, -3, -6, -6] },
    "Breaker Rifle": { traits: ["Suppressive Fire"], b: 3, dam: 7, ammo: "AP", salvAttr: "BTS/2", salvTiri: 1, bande: [0, 3, -3, -3, -6, -6] },
    "T2 Rifle": { traits: ["Anti-materiel","Suppressive Fire"], b: 3, dam: 7, ammo: "T2", salvAttr: "ARM", salvTiri: 1, bande: [0, 3, -3, -3, -6, -6] },
    "Viral Rifle": { traits: ["BioWeapon (DA+Shock)","Suppressive Fire"], b: 3, dam: 7, ammo: "N", salvAttr: "BTS", salvTiri: 1, bande: [0, 3, -3, -3, -6, -6] },
    "Adhesive Launcher Rifle": { traits: ["Non-Lethal"], b: 2, dam: null, ammo: "PARA", salvAttr: "PH-6", salvTiri: 1, bande: [0, 3, -3, -3, -6, -6] },
    "Combi Rifle": { traits: ["Suppressive Fire"], b: 3, dam: 7, ammo: "N", salvAttr: "ARM", salvTiri: 1, bande: [3, 3, -3, -3, -6, -6] },
    "Breaker Combi Rifle": { traits: ["Suppressive Fire"], b: 3, dam: 7, ammo: "AP", salvAttr: "BTS/2", salvTiri: 1, bande: [3, 3, -3, -3, -6, -6] },
    "K1 Combi Rifle": { traits: ["Anti-materiel","Suppressive Fire"], b: 3, dam: 7, ammo: "N", salvAttr: "ARM=0", salvTiri: 1, bande: [3, 3, -3, -3, -6, -6] },
    "Viral Combi Rifle": { traits: ["BioWeapon (DA+Shock)","Suppressive Fire"], b: 3, dam: 7, ammo: "N", salvAttr: "BTS", salvTiri: 1, bande: [3, 3, -3, -3, -6, -6] },
    "MULTI Rifle (Anti-Materiel Mode)": { traits: ["Anti-materiel"], b: 1, dam: 7, ammo: "DA", salvAttr: "ARM", salvTiri: 2, bande: [3, 3, -3, -3, -6, -6] },
    "MULTI Rifle (AP Mode)": { traits: ["Suppressive Fire"], b: 3, dam: 7, ammo: "AP", salvAttr: "ARM/2", salvTiri: 1, bande: [3, 3, -3, -3, -6, -6] },
    "MULTI Rifle (Shock Mode)": { traits: ["Suppressive Fire"], b: 3, dam: 7, ammo: "SHOCK", salvAttr: "ARM", salvTiri: 1, bande: [3, 3, -3, -3, -6, -6] },
    "Plasma Rifle (Blast Mode)": { traits: ["Suppressive Fire","Impact Template (Circular)"], b: 3, dam: 7, ammo: "N", salvAttr: "ARM+BTS", salvTiri: "1e1", bande: [3, 3, -3, -3, -6, -6], isTemplate: true, template: "Circular" },
    "Plasma Rifle (Hit Mode)": { traits: ["Suppressive Fire"], b: 3, dam: 6, ammo: "N", salvAttr: "ARM+BTS", salvTiri: "1e1", bande: [3, 3, -3, -3, -6, -6] },
    "Heavy Riotstopper": { traits: ["State: Immobilized-A","Intuitive Attack","Non-Lethal","Direct Template (Large Teardrop)"], b: 1, dam: null, ammo: "PARA", salvAttr: "PH-6", salvTiri: 1, isTemplate: true, template: "LargeTeardrop" },
    "Light Riotstopper": { traits: ["State: Immobilized-A","Intuitive Attack","Non-Lethal","Direct Template (Small Teardrop)"], b: 1, dam: null, ammo: "PARA", salvAttr: "PH-6", salvTiri: 1, isTemplate: true, template: "SmallTeardrop" },
    "Heavy Rocket Launcher (Blast Mode)": { traits: ["Continuous Damage","Impact Template (Circular)"], b: 2, dam: 6, ammo: "N", salvAttr: "ARM", salvTiri: 1, bande: [-3, 0, 3, 3, -3, -3], isTemplate: true, template: "Circular" },
    "Heavy Rocket Launcher (Hit Mode)": { traits: ["Continuous Damage"], b: 2, dam: 5, ammo: "N", salvAttr: "ARM", salvTiri: 1, bande: [-3, 0, 3, 3, -3, -3] },
    "Light Rocket Launcher (Blast Mode)": { traits: ["Continuous Damage","Impact Template (Circular)"], b: 2, dam: 7, ammo: "N", salvAttr: "ARM", salvTiri: 1, bande: [0, 3, 3, -3, -6, -6], isTemplate: true, template: "Circular" },
    "Light Rocket Launcher (Hit Mode)": { traits: ["Continuous Damage"], b: 2, dam: 6, ammo: "N", salvAttr: "ARM", salvTiri: 1, bande: [0, 3, 3, -3, -6, -6] },
    "Boarding Shotgun": { traits: [], b: 2, dam: 6, ammo: "AP", salvAttr: "ARM/2", salvTiri: 1, bande: [6, 0, -3] },
    "Heavy Shotgun": { traits: [], b: 2, dam: 5, ammo: "AP", salvAttr: "ARM/2", salvTiri: 1, bande: [6, 0, -3] },
    "Light Shotgun": { traits: [], b: 2, dam: 7, ammo: "N", salvAttr: "ARM", salvTiri: 1, bande: [6, 0, -3] },
    "T2 Boarding Shotgun": { traits: ["Anti-materiel"], b: 2, dam: 6, ammo: "T2", salvAttr: "ARM", salvTiri: 1, bande: [6, 0, -3] },
    "Vulkan Shotgun": { traits: ["Continuous Damage"], b: 2, dam: 6, ammo: "AP", salvAttr: "ARM/2", salvTiri: 1, bande: [6, 0, -3] },
    "Sniper Rifle": { traits: [], b: 2, dam: 5, ammo: "SHOCK", salvAttr: "ARM", salvTiri: 1, bande: [-3, 0, 3, 3, 3, 3, -3, -3, -3, -3, -3, -3] },
    "AP Sniper Rifle": { traits: [], b: 2, dam: 5, ammo: "AP", salvAttr: "ARM/2", salvTiri: 1, bande: [-3, 0, 3, 3, 3, 3, -3, -3, -3, -3, -3, -3] },
    "K1 Sniper Rifle": { traits: ["Anti-materiel"], b: 2, dam: 7, ammo: "N", salvAttr: "ARM=0", salvTiri: 1, bande: [-3, 0, 3, 3, 3, 3, -3, -3, -3, -3, -3, -3] },
    "T2 Sniper Rifle": { traits: ["Anti-materiel"], b: 2, dam: 5, ammo: "T2", salvAttr: "ARM", salvTiri: 1, bande: [-3, 0, 3, 3, 3, 3, -3, -3, -3, -3, -3, -3] },
    "Viral Sniper Rifle": { traits: ["BioWeapon (DA+Shock)"], b: 2, dam: 5, ammo: "N", salvAttr: "BTS", salvTiri: 1, bande: [-3, 0, 3, 3, 3, 3, -3, -3, -3, -3, -3, -3] },
    "MULTI Sniper Rifle (Anti-Materiel Mode)": { traits: ["Anti-materiel"], b: 2, dam: 5, ammo: "DA", salvAttr: "ARM", salvTiri: 2, bande: [-3, 0, 3, 3, 3, 3, -3, -3, -3, -3, -3, -3] },
    "MULTI Sniper Rifle (AP Mode)": { traits: [], b: 2, dam: 5, ammo: "AP", salvAttr: "ARM/2", salvTiri: 1, bande: [-3, 0, 3, 3, 3, 3, -3, -3, -3, -3, -3, -3] },
    "MULTI Sniper Rifle (Shock Mode)": { traits: [], b: 2, dam: 5, ammo: "SHOCK", salvAttr: "ARM", salvTiri: 1, bande: [-3, 0, 3, 3, 3, 3, -3, -3, -3, -3, -3, -3] },
    "Spitfire": { traits: ["Suppressive Fire"], b: 4, dam: 6, ammo: "N", salvAttr: "ARM", salvTiri: 1, bande: [0, 3, 3, -3, -6, -6] },
    "AP Spitfire": { traits: ["Suppressive Fire"], b: 4, dam: 6, ammo: "AP", salvAttr: "ARM/2", salvTiri: 1, bande: [0, 3, 3, -3, -6, -6] },
    "MULTI Spitfire (Anti-Materiel Mode)": { traits: ["Anti-materiel"], b: 1, dam: 6, ammo: "DA", salvAttr: "ARM", salvTiri: 2, bande: [0, 3, 3, -3, -6, -6] },
    "MULTI Spitfire (AP Mode)": { traits: ["Suppressive Fire"], b: 4, dam: 6, ammo: "AP", salvAttr: "ARM/2", salvTiri: 1, bande: [0, 3, 3, -3, -6, -6] },
    "MULTI Spitfire (Shock Mode)": { traits: ["Suppressive Fire"], b: 4, dam: 6, ammo: "SHOCK", salvAttr: "ARM", salvTiri: 1, bande: [0, 3, 3, -3, -6, -6] },
    "Submachine Gun": { traits: ["Suppressive Fire"], b: 3, dam: 7, ammo: "N", salvAttr: "ARM", salvTiri: 1, bande: [3, 0, -3, -6] },
    "AP Submachine Gun": { traits: ["Suppressive Fire"], b: 3, dam: 7, ammo: "AP", salvAttr: "ARM/2", salvTiri: 1, bande: [3, 0, -3, -6] },
    "Chain Rifle": { traits: ["Intuitive Attack","Direct Template (Large Teardrop)"], b: 1, dam: 7, ammo: "N", salvAttr: "ARM", salvTiri: 1, isTemplate: true, template: "LargeTeardrop" },
    "Chain-colt": { traits: ["Intuitive Attack","Direct Template (Small Teardrop)"], b: 1, dam: 7, ammo: "N", salvAttr: "ARM", salvTiri: 1, isTemplate: true, template: "SmallTeardrop" },
    "Nanopulser": { traits: ["Direct Template (Small Teardrop)","Intuitive Attack"], b: 1, dam: 7, ammo: "N", salvAttr: "BTS", salvTiri: 1, isTemplate: true, template: "SmallTeardrop" },
    "Pulzar": { traits: ["Intuitive Attack","Direct Template (Large Teardrop)"], b: 1, dam: 7, ammo: "N", salvAttr: "BTS", salvTiri: 1, isTemplate: true, template: "LargeTeardrop" },
    "E/Marat": { traits: ["Intuitive Attack","Non-Lethal","Direct Template (Large Teardrop)"], b: 1, dam: 7, ammo: "E/M", salvAttr: "BTS/2", salvTiri: 2, isTemplate: true, template: "LargeTeardrop" },
    "Zapper": { traits: ["Intuitive Attack","Non-Lethal","Direct Template (Small Teardrop)"], b: 1, dam: 7, ammo: "E/M", salvAttr: "BTS/2", salvTiri: 2, isTemplate: true, template: "SmallTeardrop" },
    "Jammer": { risoluzione: "ZOC_WIP",  traits: ["BS Weapon (WIP)","Comms Attack","Intuitive Attack","Disposable (2)","State: Isolated","Non-Lethal","No LoF","Zone of Control"], b: 1, dam: 7, ammo: "N", salvAttr: "BTS", salvTiri: 1 },
    "E/Mitter": { traits: ["Non-Lethal"], b: 2, dam: 7, ammo: "E/M", salvAttr: "BTS/2", salvTiri: 2, bande: [-3, 0, 3, 3, 0, 0] },
    "Contender": { traits: ["Anti-materiel"], b: 2, dam: 7, ammo: "T2", salvAttr: "ARM", salvTiri: 1, bande: [0, 3, 3, 0] },
    "Thunderbolt": { traits: [], b: 2, dam: 6, ammo: "N", salvAttr: "ARM", salvTiri: 1, bande: [-3, 0, 3, 3, 0, 0] },
    "AP Thunderbolt": { traits: [], b: 2, dam: 6, ammo: "N", salvAttr: "ARM/2", salvTiri: 1, bande: [-3, 0, 3, 3, 0, 0] },
    "Feuerbach (Blast Mode)": { traits: ["Anti-materiel"], b: 1, dam: 6, ammo: "EXP", salvAttr: "ARM", salvTiri: 3, bande: [-3, 0, 3, 3, 0, 0] },
    "Feuerbach (Burst Mode)": { traits: ["Anti-materiel"], b: 2, dam: 6, ammo: "AP+DA", salvAttr: "ARM/2", salvTiri: 2, bande: [-3, 0, 3, 3, 0, 0] },
    "Hyper-Rapid Magnetic Cannon (Anti-Materiel Mode)": { traits: ["Anti-materiel"], b: 1, dam: 5, ammo: "DA", salvAttr: "ARM", salvTiri: 2, bande: [-3, 0, 3, 3, 0, 0] },
    "Hyper-Rapid Magnetic Cannon (AP Mode)": { traits: ["Suppressive Fire"], b: 5, dam: 5, ammo: "AP", salvAttr: "ARM/2", salvTiri: 1, bande: [-3, 0, 3, 3, 0, 0] },
    "Hyper-Rapid Magnetic Cannon (Shock Mode)": { traits: ["Suppressive Fire"], b: 5, dam: 5, ammo: "SHOCK", salvAttr: "ARM", salvTiri: 1, bande: [-3, 0, 3, 3, 0, 0] },
    "Portable Autocannon": { traits: ["Anti-materiel"], b: 2, dam: 5, ammo: "AP+EXP", salvAttr: "ARM/2", salvTiri: 3, bande: [-3, 0, 3, 3, -3, -3] },
    "Katyusha MRL": { traits: ["Anti-materiel","Speculative Attack","Impact Template (Circular)"], b: 1, dam: 6, ammo: "DA", salvAttr: "ARM", salvTiri: 2, bande: [-3, 3, 3, 0, 0, -6], isTemplate: true, template: "Circular" },
    "Uragan MRL (Blast Mode)": { traits: ["Speculative Attack","Impact Template (Circular)","Burst: Single Target"], b: 3, dam: 6, ammo: "AP+SHOCK", salvAttr: "ARM/2", salvTiri: 1, bande: [-3, 3, 3, 0, 0, -6], isTemplate: true, template: "Circular" },
    "Uragan MRL (Hit Mode)": { traits: ["Burst: Single Target"], b: 3, dam: 5, ammo: "AP+SHOCK", salvAttr: "ARM/2", salvTiri: 1, bande: [-3, 3, 3, 0, 0, -6] },
    "Mk12": { traits: ["Suppressive Fire"], b: 3, dam: 5, ammo: "N", salvAttr: "ARM", salvTiri: 1, bande: [0, 3, 3, -3, -6, -6] },
    "Ohotnik": { traits: ["Anti-materiel"], b: 2, dam: 6, ammo: "T2", salvAttr: "ARM", salvTiri: 1, bande: [0, 3, 3, 3, 0, -3, -6, -6, -6, -6, -6, -6] },
    "Missile Launcher (Blast Mode)": { traits: ["Anti-materiel","Impact Template (Circular)"], b: 1, dam: 6, ammo: "EXP", salvAttr: "ARM", salvTiri: 3, bande: [-3, 0, 0, 3, 3, -3, -3, -3, -3, -3, -3, -3], isTemplate: true, template: "Circular" },
    "Missile Launcher (Hit Mode)": { traits: ["Anti-materiel"], b: 1, dam: 6, ammo: "AP+EXP", salvAttr: "ARM/2", salvTiri: 3, bande: [-3, 0, 0, 3, 3, -3, -3, -3, -3, -3, -3, -3] },
    "Flash Pulse": { traits: ["BS Weapon (WIP)","Non-Lethal","State: Stunned"], b: 1, dam: 7, ammo: "STUN", salvAttr: "BTS", salvTiri: 1, bande: [0, 3, 3, -3, -3, -3, -6, -6, -6, -6, -6, -6] },
    "Forward Observer": { traits: ["BS Weapon (WIP)","State: Targeted","Non-Lethal"], b: 2, dam: null, ammo: null, salvAttr: null, salvTiri: null, bande: [0, 0, 0, -3, -3, -3, -6, -6, -6, -6, -6, -6] },
    "Pitcher": { traits: ["Speculative Attack","Disposable (2)","Indiscriminate","Non-Lethal","Targetless"], b: 1, dam: null, ammo: null, salvAttr: null, salvTiri: null, bande: [0, 0, -3, -6, -6, -6] },
    "Disco Baller": { traits: ["Speculative Attack","Disposable (2)","Double Shot","Targetless"], b: 1, dam: null, ammo: null, salvAttr: null, salvTiri: null, bande: [0, 3, -3, -6] },
    "D-Charges (Demolition Mode)": { risoluzione: "CONTATTO_STRUTTURA",
      bersagliAmmessi: ["STRUTTURA", "EDIFICIO", "NEMICO_IMMOBILIZZATO", "NEMICO_NULL"],
      bersagliEsclusi: ["SEPSITORIZZATO", "POSSEDUTO"],
      vietatoInAro: true, senzaTiro: true,
      traits: ["Anti-materiel","Disposable (3)"], b: 1, dam: 6, ammo: "AP+EXP", salvAttr: "ARM/2", salvTiri: 3 },
    "D-Charges (CC Mode)": { risoluzione: "CC",  traits: ["Anti-materiel","CC","Disposable (3)","Improvised"], b: 1, dam: 6, ammo: "AP+EXP", salvAttr: "ARM/2", salvTiri: 3, isCC: true },
    // Deployable Cover — reg. v5.1.1 righe 10650-10689. Automatic Equipment che con
    // Place Deployable mette sul tavolo un ELEMENTO SCENICO con Silhouette 3.
    // Non spara: risoluzione COPERTURA, senza tiro. Si rimuove solo con un attacco
    // riuscito del Deactivator, non a Ferite — per questo in DB_DEPLOYABLES ha
    // arm/bts/str a null e non a zero.
    // DUE VARIANTI, e il giocatore deve dichiarare quale usa al piazzamento (riga
    // 10668). Se il profilo ne scrive una fra parentesi, puo` usare solo quella
    // (riga 10689): il Clockmaker scrive "Deployable Cover" e quindi sceglie.
    // I Tratti stanno sulle MODALITA` e non sul contenitore, perche` e` li` che
    // il motore cerca "Deployable" (motore_regole_n5.js, piazzabiliDaVoce).
    // `varianteCopertura` e` il valore che l'interfaccia deve passare al motore sul
    // colpo, nel campo `copertura`, per far scattare le regole della variante.
    "Deployable Cover": { modalita: ["Deployable Cover (Cutting Foam)", "Deployable Cover (Vitroferro)"] },
    "Deployable Cover (Cutting Foam)": { risoluzione: "COPERTURA", varianteCopertura: "CUTTING_FOAM", silhouette: 3, traits: ["Deployable", "Disposable (1)", "Indiscriminate"], b: null, dam: null, ammo: null, salvAttr: null, salvTiri: null },
    "Deployable Cover (Vitroferro)": { risoluzione: "COPERTURA", varianteCopertura: "VITROFERRO", silhouette: 3, traits: ["Deployable", "Disposable (1)", "Indiscriminate"], b: null, dam: null, ammo: null, salvAttr: null, salvTiri: null },
    "Deactivator": { traits: ["BS Weapon (WIP)"], b: 1, dam: null, ammo: null, salvAttr: null, salvTiri: null, bande: [6, 3, -6] },
    "GizmoKit": { traits: ["Non-Lethal"], b: 1, dam: null, ammo: null, salvAttr: null, salvTiri: null, bande: [3, 0, -6] },
    "MediKit": { traits: ["Non-Lethal"], b: 1, dam: null, ammo: null, salvAttr: null, salvTiri: null, bande: [3, 0, -6] },
    "SCOPRIRE": { traits: [], dam: null, ammo: null, salvAttr: null, salvTiri: null, bande: [3, 0, 0, 0, -3, -3, -6, -6, -6, -6, -6, -6] },

    // --- aggiunte dal Weapon Chart N5.3 ---
    "Breaker Marksman Rifle": { traits: ["Suppressive Fire"], b: 3, dam: 7, ammo: "AP", salvAttr: "BTS/2", salvTiri: 1, bande: [-3, 3, 3, -3, -3, -6] },
    // FastPanda — regolamento N5 v5.1.1, riga 5566. NON e` un'arma che colpisce:
    // e` un Ripetitore piazzabile che estende l'Area di Hacking. Per questo
    // salvezze, munizione e PS restano nulli e la risoluzione e` RIPETITORE.
    // Armed Turret — reg. v5.1.1 righe 6483-6523. E` l'OGGETTO che si piazza, non
    // l'arma che spara: riga 6502, "the Armed Turret's BS Weapon is listed in brackets
    // after the weapon's name in the Trooper's Unit Profile". armaDalProfilo: true dice
    // al motore di NON risolvere l'attacco con questa voce, ma con l'arma fra parentesi
    // nel profilo del portatore (es. Armed Turret (Marksman Rifle) -> Marksman Rifle).
    // Il profilo del token (CC 5, BS 10, ARM 2...) sta in DB_DEPLOYABLES, id armed_turret.
    "Armed Turret": { traits: ["Disposable (1)", "Deployable", "Non-Reloadable", "Perimeter"], armaDalProfilo: true, b: null, dam: null, ammo: null, salvAttr: null, salvTiri: null },
    "FastPanda": { risoluzione: "RIPETITORE", traits: ["Disposable (1)", "Indiscriminate", "Perimeter", "Deployable", "Zone of Control"], b: 1, dam: null, ammo: null, salvAttr: null, salvTiri: null },
    // Disco Ball — il TOKEN piazzato dal Disco Baller, non il lanciatore.
    // Stessa relazione fra Pitcher e Ripetitore Piazzabile. Non attacca:
    // porta una Sagoma Circolare di munizione Eclipse e si disattiva nella Fase Stati.
    "Disco Ball": { risoluzione: "PIAZZATO", traits: ["Deployable", "Impact Template (Circular)", "Non-Lethal", "Targetless"], b: 1, dam: null, ammo: "ECLIPSE", salvAttr: null, salvTiri: null },
    "Chest Mines (BS Mode)": { traits: ["Intuitive Attack","Disposable (2)","Double Shot","Direct Template (Small Teardrop)"], b: 1, dam: 7, ammo: "SHOCK", salvAttr: "ARM", salvTiri: 1, isTemplate: true, template: "SmallTeardrop" },
    "Chest Mines (CC Mode)": { risoluzione: "CC", traits: ["CC Attack (+3)","Disposable (2)"], b: 1, dam: 7, ammo: "SHOCK", salvAttr: "ARM", salvTiri: 1 },
    "Drop Bears (BS Mode)": { traits: ["BS Weapon (PH)","Speculative Attack","Disposable (3)","Targetless"], b: 1, dam: null, ammo: null, salvAttr: null, salvTiri: null, bande: [3, -3] },
    "Drop Bears (Deployable Mode)": { traits: ["Intuitive Attack","Disposable (3)","Direct Template (Small Teardrop)","Deployable"], b: 1, dam: 7, ammo: "SHOCK", salvAttr: "ARM", salvTiri: 1, isTemplate: true, template: "SmallTeardrop" },

    // --- armi MULTI: il nome base elenca le modalita`, il motore ne fa scegliere una ---
    "Missile Launcher": { modalita: ["Missile Launcher (Blast Mode)", "Missile Launcher (Hit Mode)"] },
    "Heavy Rocket Launcher": { modalita: ["Heavy Rocket Launcher (Blast Mode)", "Heavy Rocket Launcher (Hit Mode)"] },
    "Light Rocket Launcher": { modalita: ["Light Rocket Launcher (Blast Mode)", "Light Rocket Launcher (Hit Mode)"] },
    "Feuerbach": { modalita: ["Feuerbach (Blast Mode)", "Feuerbach (Burst Mode)"] },
    "Plasma Rifle": { modalita: ["Plasma Rifle (Blast Mode)", "Plasma Rifle (Hit Mode)"] },
    "Plasma Carbine": { modalita: ["Plasma Carbine (Blast Mode)", "Plasma Carbine (Hit Mode)"] },
    "Boarding Pistol": { modalita: ["Boarding Pistol (Blast Mode)", "Boarding Pistol (Hit Mode)"] },
    "Kobra Pistol": { modalita: ["Kobra Pistol (BS Mode)", "Kobra Pistol (CC Mode)"] },
    "Trench-Hammer": { modalita: ["Trench-Hammer (BS Mode)", "Trench-Hammer (CC Mode)"] },
    "Uragan MRL": { modalita: ["Uragan MRL (Blast Mode)", "Uragan MRL (Hit Mode)"] },
    "Hyper-Rapid Magnetic Cannon": { modalita: ["Hyper-Rapid Magnetic Cannon (AP Mode)", "Hyper-Rapid Magnetic Cannon (Shock Mode)", "Hyper-Rapid Magnetic Cannon (Anti-Materiel Mode)"] },
    "D-Charges": { modalita: ["D-Charges (Demolition Mode)", "D-Charges (CC Mode)"] },
    "Chest Mines": { modalita: ["Chest Mines (BS Mode)", "Chest Mines (CC Mode)"] },
    "Drop Bears": { modalita: ["Drop Bears (BS Mode)", "Drop Bears (Deployable Mode)"] },
    "MULTI Rifle": { modalita: ["MULTI Rifle (AP Mode)","MULTI Rifle (Shock Mode)","MULTI Rifle (Anti-Materiel Mode)"] },
    "MULTI Marksman Rifle": { modalita: ["MULTI Marksman Rifle (AP Mode)","MULTI Marksman Rifle (Shock Mode)","MULTI Marksman Rifle (Anti-Materiel Mode)"] },
    "MULTI Sniper Rifle": { modalita: ["MULTI Sniper Rifle (AP Mode)","MULTI Sniper Rifle (Shock Mode)","MULTI Sniper Rifle (Anti-Materiel Mode)"] },
    "MULTI Heavy Machine Gun": { modalita: ["MULTI Heavy Machine Gun (AP Mode)","MULTI Heavy Machine Gun (Shock Mode)","MULTI Heavy Machine Gun (Anti-Materiel Mode)"] },
    "MULTI Spitfire": { modalita: ["MULTI Spitfire (AP Mode)","MULTI Spitfire (Shock Mode)","MULTI Spitfire (Anti-Materiel Mode)"] },
    "MULTI Red Fury": { modalita: ["MULTI Red Fury (AP Mode)","MULTI Red Fury (Shock Mode)","MULTI Red Fury (Anti-Materiel Mode)"] },
    "MULTI Pistol": { modalita: ["MULTI Pistol (AP Mode)","MULTI Pistol (Shock Mode)","MULTI Pistol (Anti-Materiel Mode)"] },
};

// --- alias: nomi alternativi usati nei profili, puntano alla voce canonica ---
window.RULES_WEAPONS_ALIAS = {
    "Crazykoala": "CrazyKoalas",
    "CrazyKoala": "CrazyKoalas",
    "Mine Dispenser": "Mine Dispenser (Cybermines)",
    "Mine Dispenser(Cybermines)": "Mine Dispenser (Cybermines)",
    "Chest Mine": "Chest Mines (BS Mode)",
    "Armed Turret (Combi Rifle)": "Combi Rifle",
    "Armed Turret (Marksman Rifle)": "Marksman Rifle",
    "MULTI Rifle (AP)": "MULTI Rifle (AP Mode)",
    "MULTI Rifle (Shock)": "MULTI Rifle (Shock Mode)",
    "MULTI Rifle (Anti-Materiel)": "MULTI Rifle (Anti-Materiel Mode)",
    "MULTI Sniper Rifle (AP)": "MULTI Sniper Rifle (AP Mode)",
    "MULTI Sniper Rifle (Anti-Materiel)": "MULTI Sniper Rifle (Anti-Materiel Mode)",
    "MULTI Heavy Machine Gun (AP)": "MULTI Heavy Machine Gun (AP Mode)",
    "Missile Launcher (Blast)": "Missile Launcher (Blast Mode)",
    "Missile Launcher (Hit)": "Missile Launcher (Hit Mode)",
    "Feuerbach (Blast)": "Feuerbach (Blast Mode)",
    "Feuerbach (Burst)": "Feuerbach (Burst Mode)",
    "Heavy Rocket Launcher (Blast)": "Heavy Rocket Launcher (Blast Mode)",
    "Cybermines": "Cybermine",
};
// Gli alias sono creati NON ENUMERABILI di proposito: risolvono per lookup
// diretto (W[alias], 'alias' in W) ma NON compaiono in Object.keys, Object.entries
// ne` in for...in. Cosi` un ciclo ingenuo conta le 181 voci distinte invece delle
// 200 chiavi, che e` sempre il numero che chi scrive il ciclo voleva davvero.
// Chi ha bisogno anche degli alias li trova in RULES_WEAPONS_ALIAS, che resta
// l'unica fonte: qui non c'e` una seconda lista.
// NOTA: JSON.stringify(RULES_WEAPONS) non li riporta. Verificato che nessun file
// del progetto serializzi la tabella — si carica da script, non viaggia.
Object.entries(window.RULES_WEAPONS_ALIAS).forEach(([da, a]) => {
    if (!(da in window.RULES_WEAPONS) && window.RULES_WEAPONS[a])
        Object.defineProperty(window.RULES_WEAPONS, da, {
            value: window.RULES_WEAPONS[a], writable: true, configurable: true, enumerable: false
        });
});


// Solo elementi scenici neutri. La Armed Turret NON sta qui: per decisione di Paolo
// non e` scenografia ma un equipaggiamento Deployable del portatore, quindi vive in
// RULES_WEAPONS["Armed Turret"] e DB_DEPLOYABLES id "armed_turret", con l'arma presa
// dalla parentesi del profilo. Rimossa il 2026-09-22 col via libera di MOTORE,
// REGOLE, TEST e INTERFACCIA. Non rimetterla qui.
window.DB_STRUTTURE = [
    { id: "obj_console", traits: [], nome: "Console di Comando", tipo: "STRUTTURA", mov: "-", cc: "-", bs: "-", ph: "-", wip: "-", arm: 1, bts: 3, str: 1, s: 2, skills: "Hackable, Objective", weapon: "-", equip: "-" },
    { id: "obj_techcoffin", traits: [], nome: "Tech-Coffin", tipo: "STRUTTURA", mov: "-", cc: "-", bs: "-", ph: "-", wip: "-", arm: 2, bts: 6, str: 2, s: 3, skills: "Objective, Indestructible (Opzionale)", weapon: "-", equip: "-" },
    { id: "obj_antenna", traits: [], nome: "Antenna di Trasmissione", tipo: "STRUTTURA", mov: "-", cc: "-", bs: "-", ph: "-", wip: "-", arm: 1, bts: 3, str: 2, s: 3, skills: "Hackable, Repeater (Objective)", weapon: "-", equip: "-" },
    { id: "door_light", traits: [], nome: "Porta Blindata (Leggera)", tipo: "STRUTTURA", mov: "-", cc: "-", bs: "-", ph: "-", wip: "-", arm: 4, bts: 0, str: 1, s: "-", skills: "Destructible", weapon: "-", equip: "-" },
    { id: "door_heavy", traits: [], nome: "Porta Bulkhead (Pesante)", tipo: "STRUTTURA", mov: "-", cc: "-", bs: "-", ph: "-", wip: "-", arm: 8, bts: 0, str: 2, s: "-", skills: "Destructible, Anti-Materiel Only", weapon: "-", equip: "-" }
];

window.DB_TERRENI = [
    { id: 'TER_01', nome: 'Spiaggia', tratti: [] },
    { id: 'TER_02', nome: 'Mare Aperto', tratti: [] },
    { id: 'TER_03', nome: 'Palude', tratti: ['Zona di Saturazione'] },
    { id: 'TER_04', nome: 'Terreno Roccioso', tratti: ['Zona di Saturazione'] },
    { id: 'TER_05', nome: 'Dune di Sabbia', tratti: [] },
    { id: 'TER_06', nome: 'Bassa Montagna o Colline Ripide', tratti: [] },
    { id: 'TER_07', nome: 'Pianure Artiche', tratti: [] },
    { id: 'TER_08', nome: 'Media Montagna', tratti: ['Bassa Visibilità'] },
    { id: 'TER_09', nome: 'Alta Montagna', tratti: ['Bassa Visibilità', 'Zona di Saturazione'] },
    { id: 'TER_10', nome: 'Bosco', tratti: ['Bassa Visibilità', 'Zona di Saturazione'] },
    { id: 'TER_11', nome: 'Giungla', tratti: ['Pessima Visibilità', 'Zona di Saturazione'] },
    { id: 'TER_12', nome: 'Giungla Fitta', tratti: ['Pessima Visibilità', 'Zona di Saturazione'] },
    { id: 'TER_13', nome: 'Foresta Primordiale', tratti: ['Visibilità Zero', 'Zona di Saturazione'] },
    { id: 'TER_14', nome: 'Gravità Zero', tratti: [] },
    { id: 'TER_15', nome: 'Tempesta', tratti: ['Peggiora Visibilità di 1'] },
    { id: 'TER_16', nome: 'Sala Macchine', tratti: ['Bassa Visibilità', 'Zona di Saturazione'] },
    { id: 'TER_17', nome: 'Sala Generatori', tratti: ['Rumore Bianco', 'Zona di Saturazione'] },
    { id: 'TER_18', nome: 'Sala del Nucleo Energetico', tratti: ['Bassa Visibilità', 'Rumore Bianco'] }
];

window.TRATTI_TERRENO = {
    'Bassa Visibilità': { modBS: -3, modB: 0 },
    'Pessima Visibilità': { modBS: -6, modB: 0 },
    'Visibilità Zero': { modBS: -6, modB: 0, lof: false },
    'Zona di Saturazione': { modBS: 0, modB: -1 },
    'Rumore Bianco': { msv_only: true, lof: false },
    'Peggiora Visibilità di 1': { modBS: -3, modB: 0 } 
};

// ==========================================
// 🗺️ MENU TERRENO — funzione mancante che bloccava il selettore in ordine_attacco_bs.js
// e logica_aro.js (window.generaOpzioniTerreni() era richiamata ma non esisteva da nessuna parte).
// ==========================================
window.generaOpzioniTerreni = (valoreAttuale) => {
    let opts = `<option value="NESSUNO" ${(!valoreAttuale || valoreAttuale === "NESSUNO") ? 'selected' : ''}>Nessun Terreno Speciale</option>`;
    // Il menu mostra SOLO i terreni impostati in fase di schieramento (window.activeTerrains),
    // non l'intero catalogo DB_TERRENI — su un tavolo reale non tutti i tipi di terreno sono presenti.
    let terreniDisponibili = (window.activeTerrains && window.activeTerrains.length > 0) ? window.activeTerrains : [];
    terreniDisponibili.forEach(t => {
        let tratti = (t.tratti && t.tratti.length > 0) ? ` (${t.tratti.join(', ')})` : '';
        let sel = (valoreAttuale === t.id) ? 'selected' : '';
        opts += `<option value="${t.id}" ${sel}>${t.nome}${tratti}</option>`;
    });
    return opts;
};

// ==========================================
// 🌍 MOTORE MODIFICATORI TERRENO — legge i tratti del terreno (DB_TERRENI) e applica
// i MOD di visibilita` con le interazioni dei Visori. Fonte: wiki N5 "Visibility
// Conditions" (per la regola di precedenza fissata da Paolo, vale la wiki).
//
// REGOLE APPLICATE
// - NON CUMULO: i MOD delle Zone di Visibilita` non si sommano mai fra loro; se un
//   tiro e` toccato da piu` zone si applica solo il piu` restrittivo. La Zona di
//   Saturazione (-1 B) NON e` una zona di visibilita`: resta cumulativa.
// - MSV L1: Bassa -> 0, Pessima -> -3, Zero -> LoF con -6. MSV L2/L3: ignora Bassa,
//   Pessima e Zero. NESSUN visore ignora il Rumore Bianco (vedi sotto).
// - RUMORE BIANCO: agisce come Zona Zero SOLO per chi ha Marksmanship o un
//   Multispectral Visor di qualunque livello — cioe` a loro NEGA la LoF. Per tutti
//   gli altri non ha alcun effetto.
// - IL BERSAGLIO CHE RISPONDE (parametro `bersaglio`): chi e` bersaglio di un BS
//   Attack dentro, attraverso o fuori da una zona puo` rispondere all'attaccante.
//     Zona Zero:     BS Attack con -6, LoF consentita anche senza visore.
//     Rumore Bianco: la zona diventa Pessima (-6) e il Visore NON puo` ridurla.
//   La Schivata in questa situazione si fa SENZA il MOD: questa funzione restituisce
//   un modBS, quindi chi la chiama per una Schivata non deve applicarlo.
//
// FIRMA — due forme, equivalenti:
//   applicaModTerreno(terrainId, { msv1, msv2, msv3, marksmanship, bersaglio })   <- da preferire
//   applicaModTerreno(terrainId, hasMSV1, hasMSV2, hasMarksmanship, hasMSV3, bersaglio)
// La forma a oggetto esiste perche` sei booleani posizionali sono indistinguibili al sito
// di chiamata: invertire bersaglio e hasMSV3 non lo nota nessun controllo. Con l'oggetto
// l'inversione e` impossibile, e una chiave sconosciuta (un refuso, es. "bersagio")
// produce un avviso in console invece di diventare false in silenzio.
// La forma posizionale resta valida per retrocompatibilita`. hasMSV3 conta come L2.
// ==========================================
window.applicaModTerreno = (terrainId, hasMSV1, hasMSV2, hasMarksmanship, hasMSV3, bersaglio) => {
    if (hasMSV1 !== null && typeof hasMSV1 === 'object') {
        const o = hasMSV1;
        const noti = ['msv1', 'msv2', 'msv3', 'marksmanship', 'bersaglio'];
        const ignoti = Object.keys(o).filter(k => !noti.includes(k));
        if (ignoti.length && typeof console !== 'undefined')
            console.warn('applicaModTerreno: chiavi sconosciute ' + JSON.stringify(ignoti) +
                         ', attese ' + JSON.stringify(noti) + '. Ignorate: controlla un refuso.');
        hasMSV1 = !!o.msv1; hasMSV2 = !!o.msv2; hasMSV3 = !!o.msv3;
        hasMarksmanship = !!o.marksmanship; bersaglio = !!o.bersaglio;
    }
    if (hasMSV3) hasMSV2 = true;
    const hasMSV = !!(hasMSV1 || hasMSV2);
    let risultato = { modBS: 0, modB: 0, lofBloccata: false, note: "" };
    if (!terrainId || terrainId === "NESSUNO") return risultato;

    let terr = (window.DB_TERRENI || []).find(t => t.id === terrainId);
    if (!terr || !terr.tratti || terr.tratti.length === 0) return risultato;

    // Ogni tratto di visibilita` propone UN effetto; alla fine si tiene il piu` restrittivo.
    const candidati = [];
    const proponi = (modBS, lofBloccata, nota) => candidati.push({ modBS, lofBloccata, nota });

    terr.tratti.forEach(nomeTratto => {
        if (nomeTratto === 'Zona di Saturazione') {
            risultato.modB -= 1;                                   // cumulativa: non e` visibilita`
            risultato.note += `Zona di Saturazione: -1 B. `;
        }
        else if (nomeTratto === 'Bassa Visibilità' || nomeTratto === 'Peggiora Visibilità di 1') {
            if (hasMSV) proponi(0, false, `${nomeTratto}: ignorata (Visore).`);
            else        proponi(-3, false, `${nomeTratto}: -3 BS.`);
        }
        else if (nomeTratto === 'Pessima Visibilità') {
            if (hasMSV2)      proponi(0, false, `Pessima Visibilità: ignorata (MSV2).`);
            else if (hasMSV1) proponi(-3, false, `Pessima Visibilità: MSV1 riduce a -3 BS.`);
            else              proponi(-6, false, `Pessima Visibilità: -6 BS.`);
        }
        else if (nomeTratto === 'Visibilità Zero') {
            if (hasMSV2)        proponi(0, false, `Visibilità Zero: MSV2 permette LoF senza MOD.`);
            // Bersaglio con MSV L1: resta -6, confermato dalla chat REGOLE.
            // Fonte: FAQ F17 (wiki "Multispectral Visor", FAQ 0.0.0), che concede a
            // MSV L1 PIU` Sixth Sense l'annullamento di questo -6: quindi l'MSV L1 da
            // solo lo subisce. Il caso con Sixth Sense lo gestisce il motore, perche`
            // questa funzione non riceve le skill.
            else if (bersaglio) proponi(-6, false, `Visibilità Zero: bersaglio che risponde, -6 BS con LoF.`);
            else if (hasMSV1)   proponi(-6, false, `Visibilità Zero: MSV1 permette LoF con -6 BS.`);
            else                proponi(0, true,  `Visibilità Zero: NESSUNA LoF senza Visore MSV.`);
        }
        else if (nomeTratto === 'Rumore Bianco') {
            if (!hasMSV && !hasMarksmanship)
                proponi(0, false, `Rumore Bianco: nessun effetto (serve MSV o Marksmanship).`);
            else if (bersaglio)
                proponi(-6, false, `Rumore Bianco: bersaglio che risponde, Pessima -6 BS, il Visore non la riduce.`);
            else
                proponi(0, true, `Rumore Bianco: NESSUNA LoF per chi ha ${hasMSV ? 'un Multispectral Visor' : 'Marksmanship'}.`);
        }
    });

    // NON CUMULO: LoF bloccata batte qualunque MOD; altrimenti vince il MOD piu` negativo.
    if (candidati.length) {
        const peggiore = candidati.reduce((a, b) => {
            if (a.lofBloccata !== b.lofBloccata) return a.lofBloccata ? a : b;
            return (b.modBS < a.modBS) ? b : a;
        });
        risultato.modBS = peggiore.modBS;
        risultato.lofBloccata = peggiore.lofBloccata;
        risultato.note += peggiore.nota + ' ';
        if (candidati.length > 1)
            risultato.note += '(Zone di visibilita non cumulabili: applicata solo la piu restrittiva.) ';
    }

    return risultato;
};

// Dichiarazione di versione per il controllo incrociato fra chat.
// UN SOLO punto in cui il numero e` scritto: la riga @versione in testa al file.
// Qui non viene ripetuto, viene LETTO da li`, cosi` non possono divergere.
// Funziona anche se questo file si carica PRIMA del motore: in quel caso la
// versione resta in coda e il motore la raccoglie all'avvio.
(function () {
    var g = (typeof window !== 'undefined') ? window : globalThis;
    var FILE = 'database_comune.js';
    var vers = null;

    // Node / test: leggo l'intestazione dal sorgente stesso.
    try {
        if (typeof require === 'function' && typeof __filename === 'string') {
            var testa = require('fs').readFileSync(__filename, 'utf8').slice(0, 200);
            var m = testa.match(/@versione\s+(\S+)/);
            if (m) vers = m[1];
        }
    } catch (e) { /* ambiente senza fs: si passa al ramo browser */ }

    // Browser: l'intestazione non e` leggibile a runtime. Il motore la ricava
    // dal sorgente gia` caricato; se non ci riesce resta null e viene segnalata
    // come "da verificare" invece di essere data per buona.
    if (!vers && g.MotoreN5 && g.MotoreN5.versioneDaIntestazione)
        vers = g.MotoreN5.versioneDaIntestazione(FILE);

    var v = { file: FILE, versione: vers, proprieta: 'DATABASE' };
    if (g.MotoreN5 && g.MotoreN5.dichiaraVersione) g.MotoreN5.dichiaraVersione(v.file, v.versione, v.proprieta);
    else { g.__versioniN5 = g.__versioniN5 || []; g.__versioniN5.push(v); }
})();
