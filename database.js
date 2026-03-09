// --- database.js ---

// ==========================================
// 1. REGOLE UNIVERSALI (Munizioni N5)
// ==========================================
window.RULES_AMMO = {
    'NORMALE': { modArm: 0, saves: 1, traits: [] },
    'AP': { modArm: 'HALVE', saves: 1, traits: ["Armor Piercing"] },
    'DA': { modArm: 0, saves: 2, traits: ["Double Action"] },
    'EXP': { modArm: 0, saves: 3, traits: ["Explosive"] },
    'K1': { modArm: 'ZERO', saves: 1, traits: ["K1"] },
    'SHOCK': { modArm: 0, saves: 1, traits: ["Shock"] },
    'FIRE': { modArm: 0, saves: 1, traits: ["Continuous Damage"] },
    'T2': { modArm: 0, saves: 2, traits: ["Damage 2"] },
    'VIRAL': { modArm: 0, saves: 2, traits: ["Shock"] },
    'STUN': { modArm: 0, saves: 1, traits: ["Non-lethal", "Stunned"] },
    'E/M': { modArm: 'HALVE', saves: 2, traits: ["Non-lethal", "Isolated", "IMM-B"] },
    'SMOKE': { modArm: 0, saves: 0, traits: ["Non-lethal", "Block LoF"] },
    'PARA': { modArm: 0, saves: 1, traits: ["Non-lethal", "IMM-A"] },
    'ECLIPSE': { modArm: 0, saves: 0, traits: ["Non-lethal", "Block LoF (MSV)"] }
};
// ==========================================
// 🗄️ DATABASE INFINITY N5 - NOMADS (FULL)
// ==========================================

// --- 1. DATABASE DEPLOYABLES (Regole e Statistiche N5) ---
// I valori isCamo indicano all'app se piazzare un modello o un segnalino Mimetico
window.DB_DEPLOYABLES = [
    { id: "mina_ap", nome: "Mina AP", tipo: "MARKER", isCamo: true, arm: 0, bts: 0, str: 1, s: 0, equip: "Mina AP", armi: "AP", traits: "Small Teardrop" },
    { id: "mina_shock", nome: "Mina Shock", tipo: "MARKER", isCamo: true, arm: 0, bts: 0, str: 1, s: 0, equip: "Mina Shock", armi: "Shock", traits: "Small Teardrop" },
    { id: "mina_em", nome: "Mina E/M", tipo: "MARKER", isCamo: true, arm: 0, bts: 0, str: 1, s: 0, equip: "Mina E/M", armi: "E/M", traits: "Small Teardrop" },
    { id: "mina_viral", nome: "Mina Virale", tipo: "MARKER", isCamo: true, arm: 0, bts: 0, str: 1, s: 0, equip: "Mina Virale", armi: "N (BTS)", traits: "Small Teardrop, BioWeapon" },
    { id: "cybermine", nome: "Cybermina", tipo: "MARKER", isCamo: true, arm: 0, bts: 0, str: 1, s: 0, equip: "Cybermina", armi: "Comms Attack", traits: "Small Teardrop, IMM-B/Stunned" },
    { id: "crazykoala", nome: "CrazyKoala", tipo: "PERIMETER", isCamo: false, arm: 0, bts: 0, str: 1, s: 1, equip: "CrazyKoala", armi: "Shock", traits: "Boost" },
    { id: "fastpanda", nome: "FastPanda", tipo: "PERIMETER", isCamo: false, arm: 0, bts: 0, str: 1, s: 1, equip: "Repeater", armi: "-", traits: "Hacking Area" },
    { id: "dropbear", nome: "Drop Bear", tipo: "MARKER", isCamo: true, arm: 0, bts: 0, str: 1, s: 0, equip: "Drop Bear", armi: "Shock", traits: "Small Teardrop" },
    { id: "wildparrot", nome: "WildParrot", tipo: "PERIMETER", isCamo: false, arm: 0, bts: 0, str: 1, s: 1, equip: "WildParrot", armi: "E/M", traits: "Small Teardrop" },
    { id: "madtraps", nome: "MadTraps", tipo: "PERIMETER", isCamo: false, arm: 0, bts: 0, str: 1, s: 1, equip: "MadTraps", armi: "PARA", traits: "Boost, IMM-A" }
];


// --- 2. DATABASE ARMI (Elenco completo Nomadi N5) ---
window.RULES_WEAPONS = {
    // --- Fucili e Armi Base ---
    "Combi Rifle": { b: 3, dam: 7, ammo: "N", ranges: { p3: 16, m3: 32, m6: 48 } },
    "Breaker Combi Rifle": { b: 3, dam: 7, ammo: "AP", ranges: { p3: 16, m3: 32, m6: 48 } },
    "MULTI Rifle (AP)": { b: 3, dam: 7, ammo: "AP", ranges: { p3: 16, m3: 32, m6: 48 } },
    "MULTI Rifle (Shock)": { b: 3, dam: 7, ammo: "Shock", ranges: { p3: 16, m3: 32, m6: 48 } },
    "MULTI Rifle (Anti-Materiel)": { b: 1, dam: 7, ammo: "DA", ranges: { p3: 16, m3: 32, m6: 48 } },
    "Boarding Shotgun": { b: 2, dam: 6, ammo: "AP", ranges: { p6: 8, p0: 16, m3: 24 } },
    "Heavy Shotgun": { b: 2, dam: 5, ammo: "AP", ranges: { p6: 8, p0: 16, m3: 24 } },
    "Submachine Gun": { b: 3, dam: 7, ammo: "N", ranges: { p3: 8, p0: 16, m3: 24, m6: 32 } },
    "AP Submachine Gun": { b: 3, dam: 7, ammo: "AP", ranges: { p3: 8, p0: 16, m3: 24, m6: 32 } },
    "Marksman Rifle": { b: 3, dam: 7, ammo: "N", ranges: { m3: 8, p3: 24, m3: 40, m6: 48 } },
    "AP Marksman Rifle": { b: 3, dam: 7, ammo: "AP", ranges: { m3: 8, p3: 24, m3: 40, m6: 48 } },
    "Shock Marksman Rifle": { b: 3, dam: 7, ammo: "Shock", ranges: { m3: 8, p3: 24, m3: 40, m6: 48 } },
    
    // --- Armi Pesanti (HMG, Spitfire, Sniper, Lanciamissili) ---
    "Heavy Machine Gun": { b: 4, dam: 5, ammo: "N", ranges: { m3: 16, p3: 32, m3: 48 } },
    "AP Heavy Machine Gun": { b: 4, dam: 5, ammo: "AP", ranges: { m3: 16, p3: 32, m3: 48 } },
    "MULTI Heavy Machine Gun (AP)": { b: 4, dam: 5, ammo: "AP", ranges: { m3: 16, p3: 32, m3: 48 } },
    "Spitfire": { b: 4, dam: 6, ammo: "N", ranges: { p0: 8, p3: 24, m3: 32, m6: 48 } },
    "AP Spitfire": { b: 4, dam: 6, ammo: "AP", ranges: { p0: 8, p3: 24, m3: 32, m6: 48 } },
    "Red Fury": { b: 4, dam: 7, ammo: "Shock", ranges: { p0: 8, p3: 24, m3: 32, m6: 48 } },
    "Missile Launcher (Blast)": { b: 1, dam: 6, ammo: "EXP", ranges: { m3: 16, p0: 24, p3: 40, m3: 96 }, isTemplate: true, template: "Circular" },
    "Missile Launcher (Hit)": { b: 1, dam: 6, ammo: "AP+EXP", ranges: { m3: 16, p0: 24, p3: 40, m3: 96 } },
    "Heavy Rocket Launcher (Blast)": { b: 2, dam: 6, ammo: "N", ranges: { m3: 8, p0: 16, p3: 32, m3: 48 }, isTemplate: true, template: "Circular" },
    "Sniper Rifle": { b: 2, dam: 5, ammo: "Shock", ranges: { m3: 16, p0: 32, p3: 48, m3: 96 } },
    "MULTI Sniper Rifle (AP)": { b: 2, dam: 5, ammo: "AP", ranges: { m3: 16, p0: 32, p3: 48, m3: 96 } },
    "MULTI Sniper Rifle (Anti-Materiel)": { b: 2, dam: 5, ammo: "DA", ranges: { m3: 16, p0: 32, p3: 48, m3: 96 } },
    "Feuerbach (Blast)": { b: 1, dam: 6, ammo: "EXP", ranges: { m3: 16, p0: 24, p3: 40, p0: 48 } },
    "Feuerbach (Burst)": { b: 2, dam: 6, ammo: "AP+DA", ranges: { m3: 16, p0: 24, p3: 40, p0: 48 } },
    "Hyper-Rapid Magnetic Cannon": { b: 5, dam: 5, ammo: "AP", ranges: { m3: 16, p0: 24, p3: 40, p0: 48 } },
    "Mk12": { b: 3, dam: 5, ammo: "N", ranges: { p0: 8, p3: 24, m3: 32, m6: 48 } },

    // --- Armi a Sagoma Diretta (No Tiro BS) ---
    "Chain Rifle": { b: 1, dam: 7, ammo: "N", isTemplate: true, template: "Large Teardrop" },
    "Chain-colt": { b: 1, dam: 7, ammo: "N", isTemplate: true, template: "Small Teardrop" },
    "Light Flamethrower": { b: 1, dam: 7, ammo: "N", isTemplate: true, template: "Small Teardrop" },
    "Heavy Flamethrower": { b: 1, dam: 6, ammo: "N", isTemplate: true, template: "Large Teardrop" },
    "Nanopulser": { b: 1, dam: 7, ammo: "N", isTemplate: true, template: "Small Teardrop" },
    "Pulzar": { b: 1, dam: 7, ammo: "N", isTemplate: true, template: "Large Teardrop" },
    "E/Marat": { b: 1, dam: 7, ammo: "E/M", isTemplate: true, template: "Large Teardrop" },

    // --- Pistole ---
    "Pistol": { b: 2, dam: 9, ammo: "N", ranges: { p3: 8, p0: 16, m6: 24 } },
    "Heavy Pistol": { b: 2, dam: 6, ammo: "Shock", ranges: { p3: 8, p0: 16, m6: 24 } },
    "AP Heavy Pistol": { b: 2, dam: 6, ammo: "AP", ranges: { p3: 8, p0: 16, m6: 24 } },
    "Breaker Pistol": { b: 2, dam: 8, ammo: "AP", ranges: { p3: 8, p0: 16, m6: 24 } },
    "Assault Pistol": { b: 4, dam: 7, ammo: "N", ranges: { p3: 8, p0: 16, m6: 24 } },
    "Stun Pistol": { b: 2, dam: 8, ammo: "Stun", ranges: { p3: 8, p0: 16, m6: 24 } },

    // --- Armi Corpo a Corpo (CC) ---
    "CC Weapon": { b: 1, dam: 8, ammo: "N", isCC: true },
    "AP CC Weapon": { b: 1, dam: 8, ammo: "AP", isCC: true },
    "DA CC Weapon": { b: 1, dam: 8, ammo: "DA", isCC: true },
    "EXP CC Weapon": { b: 1, dam: 8, ammo: "EXP", isCC: true },
    "Shock CC Weapon": { b: 1, dam: 8, ammo: "Shock", isCC: true },
    "PARA CC Weapon": { b: 1, dam: "-", ammo: "PARA", isCC: true },
    "Monofilament CC Weapon": { b: 1, dam: 8, ammo: "N", isCC: true }, // Forza ARM a 0 nel calcolatore
    "Viral CC Weapon": { b: 1, dam: 8, ammo: "N", isCC: true },

    // --- Equipaggiamenti e Armi Speciali ---
    "Flash Pulse": { b: 1, dam: 7, ammo: "Stun", ranges: { p0: 8, p3: 24, m3: 48, m6: 96 } },
    "Pitcher": { b: 1, dam: 1, ammo: "N", ranges: { p0: 8, m3: 24, m6: 48 } },
    "Grenades": { b: 1, dam: 7, ammo: "N", ranges: { p3: 8, m3: 16, m6: 96 }, isTemplate: true, template: "Circular" },
    "Smoke Grenades": { b: 1, dam: 1, ammo: "Smoke", ranges: { p3: 8, m3: 16, m6: 96 }, isTemplate: true, template: "Circular" },
    "D-Charges": { b: 1, dam: 6, ammo: "AP+EXP", isCC: true }, // Usate in CC o Piazzate
    "Panzerfaust": { b: 1, dam: 6, ammo: "AP+EXP", ranges: { p0: 8, p3: 24, m3: 32, m6: 48 } },
    "Blitzen": { b: 1, dam: 6, ammo: "E/M", ranges: { m3: 16, p0: 24, p3: 40, m3: 48 } },
    "Adhesive Launcher Rifle": { b: 2, dam: "-", ammo: "PARA", ranges: { p0: 8, p3: 24, m3: 32, m6: 48 } }
};


// --- 3. DATABASE UNITÀ (Nomads N5 - Parte 1: LI, MI, SK, WB) ---
window.DB_NOMADI = [

    // ==========================================
    // 🟢 FANTERIA LEGGERA (LI)
    // ==========================================
    
    // --- ALGUACILES --- [cite: 586, 590-597]
    { id: "alguacil_combi", nome: "Alguacil (Combi Rifle)", tipo: "LI", mov: "4-4", cc: 14, bs: 11, ph: 10, wip: 13, arm: 1, bts: 0, w: 1, s: 2, skills: "-", weapon: "Combi Rifle", equip: "Pistol, CC Weapon" },
    { id: "alguacil_hmg", nome: "Alguacil (HMG)", tipo: "LI", mov: "4-4", cc: 14, bs: 11, ph: 10, wip: 13, arm: 1, bts: 0, w: 1, s: 2, skills: "-", weapon: "Heavy Machine Gun", equip: "Pistol, CC Weapon" },
    { id: "alguacil_hacker", nome: "Alguacil (Hacker)", tipo: "LI", mov: "4-4", cc: 14, bs: 11, ph: 10, wip: 13, arm: 1, bts: 0, w: 1, s: 2, skills: "Hacker", weapon: "Combi Rifle", equip: "Hacking Device, Pistol, CC Weapon" },
    { id: "alguacil_paramedic", nome: "Alguacil (Paramedic)", tipo: "LI", mov: "4-4", cc: 14, bs: 11, ph: 10, wip: 13, arm: 1, bts: 0, w: 1, s: 2, skills: "Paramedic", weapon: "Combi Rifle", equip: "MediKit, Pistol, CC Weapon" },
    { id: "alguacil_ml", nome: "Alguacil (Missile Launcher)", tipo: "LI", mov: "4-4", cc: 14, bs: 11, ph: 10, wip: 13, arm: 1, bts: 0, w: 1, s: 2, skills: "-", weapon: "Missile Launcher", equip: "Pistol, CC Weapon" },

    // --- MODERATORS --- [cite: 1332, 1341-1349]
    { id: "moderator_combi", nome: "Moderator (Combi Rifle)", tipo: "LI", mov: "4-4", cc: 18, bs: 10, ph: 10, wip: 13, arm: 0, bts: 3, w: 1, s: 2, skills: "Immunity (Shock)", weapon: "Combi Rifle", equip: "Pistol, PARA CC Weapon(-6)" },
    { id: "moderator_spitfire", nome: "Moderator (Spitfire)", tipo: "LI", mov: "4-4", cc: 18, bs: 10, ph: 10, wip: 13, arm: 0, bts: 3, w: 1, s: 2, skills: "Immunity (Shock)", weapon: "Spitfire", equip: "Pistol, PARA CC Weapon(-6)" },
    { id: "moderator_hacker", nome: "Moderator (Hacker)", tipo: "LI", mov: "4-4", cc: 18, bs: 10, ph: 10, wip: 13, arm: 0, bts: 3, w: 1, s: 2, skills: "Hacker, Immunity (Shock)", weapon: "Combi Rifle", equip: "Hacking Device, Pistol, PARA CC Weapon(-6)" },

    // --- SECURITATE --- [cite: 1804, 1823-1829]
    { id: "securitate_combi", nome: "Securitate (Combi Rifle)", tipo: "LI", mov: "4-4", cc: 13, bs: 12, ph: 10, wip: 14, arm: 1, bts: 0, w: 1, s: 2, skills: "Warhorse", weapon: "Combi Rifle", equip: "Pistol, CC Weapon" },
    { id: "securitate_hmg", nome: "Securitate (HMG)", tipo: "LI", mov: "4-4", cc: 13, bs: 12, ph: 10, wip: 14, arm: 1, bts: 0, w: 1, s: 2, skills: "Warhorse", weapon: "Heavy Machine Gun", equip: "Pistol, CC Weapon" },

    // --- INTERVENTORS --- [cite: 1018, 1025-1034]
    { id: "interventor_hacker", nome: "Interventor (Hacker Plus)", tipo: "LI", mov: "4-4", cc: 13, bs: 11, ph: 10, wip: 15, arm: 1, bts: 9, w: 1, s: 2, skills: "Hacker", weapon: "Combi Rifle", equip: "Hacking Device Plus, FastPanda, Pistol, CC Weapon" },
    { id: "interventor_bsg", nome: "Interventor (Boarding Shotgun)", tipo: "LI", mov: "4-4", cc: 13, bs: 11, ph: 10, wip: 15, arm: 1, bts: 9, w: 1, s: 2, skills: "Hacker", weapon: "Boarding Shotgun", equip: "Hacking Device Plus, FastPanda, Pistol, CC Weapon" },

    // --- SUPPORT (Daktari & Clockmaker) --- [cite: 863-875, 866-880]
    { id: "daktari", nome: "Daktari (Doctor)", tipo: "LI", mov: "4-4", cc: 14, bs: 11, ph: 10, wip: 14, arm: 1, bts: 0, w: 1, s: 2, skills: "Doctor", weapon: "Combi Rifle", equip: "MediKit, Pistol, CC Weapon" },
    { id: "clockmaker", nome: "Clockmaker (Engineer)", tipo: "LI", mov: "4-4", cc: 14, bs: 11, ph: 10, wip: 15, arm: 1, bts: 3, w: 1, s: 2, skills: "Engineer", weapon: "Combi Rifle, D-Charges", equip: "Deactivator, GizmoKit, Pistol, CC Weapon" },


    // ==========================================
    // 🔵 FANTERIA MEDIA (MI)
    // ==========================================
    
    // --- GRENZERS --- [cite: 5, 11-15]
    { id: "grenzer_ml", nome: "Grenzer (Missile Launcher)", tipo: "MI", mov: "4-4", cc: 16, bs: 13, ph: 11, wip: 13, arm: 3, bts: 6, w: 1, s: 2, skills: "Courage, Immunity (Shock), Warhorse", weapon: "Missile Launcher", equip: "Multispectral Visor L1, Pistol, Breaker Pistol, CC Weapon" },
    { id: "grenzer_sniper", nome: "Grenzer (MULTI Sniper)", tipo: "MI", mov: "4-4", cc: 16, bs: 13, ph: 11, wip: 13, arm: 3, bts: 6, w: 1, s: 2, skills: "Marksmanship, Courage, Immunity (Shock), Warhorse", weapon: "MULTI Sniper Rifle", equip: "Multispectral Visor L1, Pistol, Breaker Pistol, CC Weapon" },
    { id: "grenzer_combi", nome: "Grenzer (Combi Rifle)", tipo: "MI", mov: "4-4", cc: 16, bs: 13, ph: 11, wip: 13, arm: 3, bts: 6, w: 1, s: 2, skills: "Forward Observer, Sensor, NCO, Courage, Immunity (Shock)", weapon: "Combi Rifle, Light Flamethrower, Flash Pulse", equip: "Multispectral Visor L1, Pistol, Breaker Pistol, CC Weapon" },

    // --- INTRUDERS --- [cite: 234, 237-245]
    { id: "intruder_hmg", nome: "Intruder (HMG)", tipo: "MI", mov: "4-4", cc: 14, bs: 13, ph: 12, wip: 14, arm: 3, bts: 0, w: 1, s: 2, skills: "Camouflage, Mimetism (-3), Stealth, Surprise Attack (-3), Terrain (Total)", weapon: "Heavy Machine Gun, Grenades", equip: "Multispectral Visor L2, Pistol, CC Weapon" },
    { id: "intruder_sniper", nome: "Intruder (MULTI Sniper)", tipo: "MI", mov: "4-4", cc: 14, bs: 13, ph: 12, wip: 14, arm: 3, bts: 0, w: 1, s: 2, skills: "Camouflage, Mimetism (-3), Stealth, Surprise Attack (-3), Terrain (Total)", weapon: "MULTI Sniper Rifle", equip: "Multispectral Visor L2, Pistol, CC Weapon" },

    // --- HELLCATS --- [cite: 99, 101-111]
    { id: "hellcat_bsg", nome: "Hellcat (Boarding Shotgun)", tipo: "MI", mov: "4-4", cc: 14, bs: 12, ph: 12, wip: 13, arm: 2, bts: 3, w: 1, s: 2, skills: "Combat Jump (+3), Courage, Parachutist, Super-Jump", weapon: "Boarding Shotgun, Adhesive Launcher Rifle, D-Charges", equip: "Pistol, CC Weapon" },
    { id: "hellcat_spitfire", nome: "Hellcat (Spitfire)", tipo: "MI", mov: "4-4", cc: 14, bs: 12, ph: 12, wip: 13, arm: 2, bts: 3, w: 1, s: 2, skills: "Combat Jump (+3), Courage, Parachutist, Super-Jump", weapon: "Spitfire", equip: "Pistol, CC Weapon" },

    // --- SIN-EATERS --- [cite: 1461, 1468-1470]
    { id: "sineater_hmg", nome: "Sin-Eater (HMG)", tipo: "MI", mov: "4-4", cc: 14, bs: 13, ph: 11, wip: 13, arm: 3, bts: 0, w: 1, s: 2, skills: "Immunity (Shock), Mimetism (-3), Neurocinetics, Religious Troop", weapon: "Heavy Machine Gun", equip: "Pistol, CC Weapon" },
    { id: "sineater_sniper", nome: "Sin-Eater (MULTI Sniper)", tipo: "MI", mov: "4-4", cc: 14, bs: 13, ph: 11, wip: 13, arm: 3, bts: 0, w: 1, s: 2, skills: "Immunity (Shock), Mimetism (-3), Neurocinetics, Religious Troop", weapon: "MULTI Sniper Rifle", equip: "Pistol, CC Weapon" },


    // ==========================================
    // 🟠 SKIRMISHERS (SK)
    // ==========================================
    
    // --- ZEROS --- [cite: 437, 443-445]
    { id: "zero_combi", nome: "Zero (Combi Rifle)", tipo: "SK", mov: "4-4", cc: 15, bs: 11, ph: 12, wip: 13, arm: 0, bts: 0, w: 1, s: 2, skills: "Camouflage, Infiltration, Mimetism (-3), Stealth, Surprise Attack (-3)", weapon: "Combi Rifle", equip: "Shock Mine, Pistol, CC Weapon" },
    { id: "zero_hacker", nome: "Zero (Hacker)", tipo: "SK", mov: "4-4", cc: 15, bs: 11, ph: 12, wip: 13, arm: 0, bts: 0, w: 1, s: 2, skills: "Hacker, Camouflage, Infiltration, Mimetism (-3), Stealth", weapon: "Combi Rifle", equip: "Shock Mine, Hacking Device, Pistol, CC Weapon" },
    { id: "zero_bsg", nome: "Zero (Boarding Shotgun)", tipo: "SK", mov: "4-4", cc: 15, bs: 11, ph: 12, wip: 13, arm: 0, bts: 0, w: 1, s: 2, skills: "Camouflage, Infiltration, Mimetism (-3), Stealth, Surprise Attack (-3)", weapon: "Boarding Shotgun", equip: "Shock Mine, PARA Mine, Pistol, CC Weapon" },

    // --- SPEKTRS --- [cite: 681, 684-690]
    { id: "spektr_combi", nome: "Spektr (Combi Rifle)", tipo: "SK", mov: "4-4", cc: 13, bs: 12, ph: 12, wip: 14, arm: 1, bts: 3, w: 1, s: 2, skills: "Camouflage, Hidden Deployment, Infiltration, Mimetism (-6), Stealth", weapon: "Combi Rifle, D-Charges", equip: "Silenced Pistol, CC Weapon" },
    { id: "spektr_bsg", nome: "Spektr (Boarding Shotgun)", tipo: "SK", mov: "4-4", cc: 13, bs: 12, ph: 12, wip: 14, arm: 1, bts: 3, w: 1, s: 2, skills: "Camouflage, Hidden Deployment, Infiltration, Mimetism (-6), Stealth", weapon: "Boarding Shotgun, Flash Pulse", equip: "Shock Mine, Silenced Pistol, CC Weapon" },
    { id: "spektr_sniper", nome: "Spektr (MULTI Sniper)", tipo: "SK", mov: "4-4", cc: 13, bs: 12, ph: 12, wip: 14, arm: 1, bts: 3, w: 1, s: 2, skills: "Camouflage, Hidden Deployment, Infiltration, Mimetism (-6), Stealth", weapon: "MULTI Sniper Rifle", equip: "Shock Mine, Silenced Pistol, CC Weapon" },

    // --- HECKLERS --- [cite: 266, 269-272]
    { id: "heckler_redfury", nome: "Heckler (Red Fury)", tipo: "SK", mov: "4-4", cc: 15, bs: 12, ph: 11, wip: 13, arm: 1, bts: 3, w: 1, s: 2, skills: "Camouflage, Forward Deployment (+4\"), Mimetism (-3), Stealth", weapon: "Red Fury", equip: "Pistol, CC Weapon" },
    { id: "heckler_hacker", nome: "Heckler (Hacker)", tipo: "SK", mov: "4-4", cc: 15, bs: 12, ph: 11, wip: 13, arm: 1, bts: 3, w: 1, s: 2, skills: "Hacker, Camouflage, Forward Deployment (+4\"), Mimetism (-3)", weapon: "Combi Rifle", equip: "Cybermine, Killer Hacking Device, Assault Pistol, CC Weapon" },

    // --- MORAN MASAI --- [cite: 1504, 1516-1518]
    { id: "moran_combi", nome: "Moran (Combi Rifle)", tipo: "SK", mov: "4-4", cc: 15, bs: 12, ph: 11, wip: 13, arm: 0, bts: 0, w: 1, s: 2, skills: "Courage, Forward Observer, Infiltration, Mimetism (-3), Minelayer", weapon: "Combi Rifle, Flash Pulse, D-Charges", equip: "Crazykoala, Pistol, CC Weapon" },
    { id: "moran_bsg", nome: "Moran (Boarding Shotgun)", tipo: "SK", mov: "4-4", cc: 15, bs: 12, ph: 11, wip: 13, arm: 0, bts: 0, w: 1, s: 2, skills: "Courage, Forward Observer, Infiltration, Mimetism (-3), Minelayer", weapon: "Boarding Shotgun, Flash Pulse", equip: "Crazykoala, Pistol, CC Weapon" },


    // ==========================================
    // 🟤 WARBANDS (WB)
    // ==========================================
    
    // --- MORLOCKS --- [cite: 750, 753-754]
    { id: "morlock_chain", nome: "Morlock (Chain Rifle)", tipo: "WB", mov: "4-4", cc: 23, bs: 11, ph: 13, wip: 14, arm: 1, bts: 0, w: 1, s: 2, skills: "Courage, Dodge (+1\"), Impetuous, Martial Arts L2, MetaChemistry, No Cover", weapon: "Chain Rifle, Smoke Grenades", equip: "Kobra Pistol, DA CC Weapon" },
    { id: "morlock_bsg", nome: "Morlock (Boarding Shotgun)", tipo: "WB", mov: "4-4", cc: 23, bs: 11, ph: 13, wip: 14, arm: 1, bts: 0, w: 1, s: 2, skills: "Courage, Dodge (+1\"), Impetuous, Martial Arts L2, MetaChemistry, No Cover", weapon: "Boarding Shotgun, Smoke Grenades", equip: "Kobra Pistol, DA CC Weapon" },
// ==========================================
    // 🔴 FANTERIA PESANTE (HI)
    // ==========================================
    
    // --- MOBILE BRIGADA --- 
    { id: "mobile_brigada_multi", nome: "Mobile Brigada (MULTI Rifle)", tipo: "HI", mov: "4-4", cc: 15, bs: 13, ph: 14, wip: 13, arm: 4, bts: 3, w: 2, s: 2, skills: "Courage, Hackable", weapon: "MULTI Rifle (AP)", equip: "Light Flamethrower, Pistol, CC Weapon" },
    { id: "mobile_brigada_hmg", nome: "Mobile Brigada (HMG)", tipo: "HI", mov: "4-4", cc: 15, bs: 13, ph: 14, wip: 13, arm: 4, bts: 3, w: 2, s: 2, skills: "Courage, Hackable", weapon: "Heavy Machine Gun", equip: "Pistol, CC Weapon" },
    { id: "mobile_brigada_ml", nome: "Mobile Brigada (Missile Launcher)", tipo: "HI", mov: "4-4", cc: 15, bs: 13, ph: 14, wip: 13, arm: 4, bts: 3, w: 2, s: 2, skills: "Courage, Hackable", weapon: "Missile Launcher (Blast)", equip: "Pistol, CC Weapon" },

    // --- KRIZA BORACS --- 
    { id: "kriza_hmg", nome: "Kriza Borac (HMG)", tipo: "HI", mov: "4-4", cc: 15, bs: 13, ph: 14, wip: 13, arm: 5, bts: 3, w: 2, s: 5, skills: "Courage, Hackable, Immunity (Shock)", weapon: "Heavy Machine Gun", equip: "Heavy Pistol, CC Weapon" },
    { id: "kriza_mk12", nome: "Kriza Borac (Mk12)", tipo: "HI", mov: "4-4", cc: 15, bs: 13, ph: 14, wip: 13, arm: 5, bts: 3, w: 2, s: 5, skills: "Courage, Hackable, Immunity (Shock)", weapon: "Mk12", equip: "Heavy Pistol, CC Weapon" },

    // --- TASKMASTERS --- 
    { id: "taskmaster_hmg", nome: "Taskmaster (HMG)", tipo: "HI", mov: "4-4", cc: 16, bs: 13, ph: 14, wip: 13, arm: 5, bts: 3, w: 2, s: 5, skills: "Courage, Hackable, Immunity (Shock)", weapon: "Heavy Machine Gun", equip: "CrazyKoala, Heavy Pistol, DA CC Weapon" },
    { id: "taskmaster_redfury", nome: "Taskmaster (Red Fury)", tipo: "HI", mov: "4-4", cc: 16, bs: 13, ph: 14, wip: 13, arm: 5, bts: 3, w: 2, s: 5, skills: "Courage, Hackable, Immunity (Shock)", weapon: "Red Fury", equip: "CrazyKoala, Heavy Pistol, DA CC Weapon" },

    // --- EVADERS --- 
    { id: "evader_spitfire", nome: "Evader (Spitfire)", tipo: "HI", mov: "4-4", cc: 16, bs: 13, ph: 13, wip: 13, arm: 3, bts: 3, w: 2, s: 2, skills: "Climbing Plus, Courage, Hackable", weapon: "Spitfire", equip: "Pistol, CC Weapon" },
    { id: "evader_feuerbach", nome: "Evader (Feuerbach)", tipo: "HI", mov: "4-4", cc: 16, bs: 13, ph: 13, wip: 13, arm: 3, bts: 3, w: 2, s: 2, skills: "Climbing Plus, Courage, Hackable", weapon: "Feuerbach (Blast)", equip: "Pistol, CC Weapon" },


    // ==========================================
    // ⚙️ TACTICAL ARMORED GEARS (TAG)
    // ==========================================
    
    // --- SZALAMANDRA SQUADRON --- 
    { id: "szalamandra", nome: "Szalamandra Squadron", tipo: "TAG", mov: "6-4", cc: 16, bs: 14, ph: 14, wip: 13, arm: 8, bts: 6, str: 3, s: 7, skills: "Courage, Hackable, Manned", weapon: "Hyper-Rapid Magnetic Cannon, Heavy Flamethrower", equip: "CC Weapon" },

    // --- IGUANA SQUADRON --- 
    { id: "iguana", nome: "Iguana Squadron", tipo: "TAG", mov: "6-4", cc: 16, bs: 14, ph: 14, wip: 13, arm: 6, bts: 6, str: 3, s: 7, skills: "Courage, Hackable, Manned, Ejection System", weapon: "Heavy Machine Gun, Heavy Flamethrower", equip: "CC Weapon" },

    // --- LIZARD SQUADRON --- 
    { id: "lizard", nome: "Lizard Squadron", tipo: "TAG", mov: "6-4", cc: 16, bs: 14, ph: 14, wip: 13, arm: 8, bts: 6, str: 3, s: 7, skills: "Courage, Hackable, Manned", weapon: "MULTI Heavy Machine Gun (AP), Heavy Flamethrower", equip: "CC Weapon" },


    // ==========================================
    // 🤖 REMOTI (REM)
    // ==========================================
    
    // --- LUNOKHOD SPUTNIKS --- 
    { id: "lunokhod", nome: "Lunokhod Sputnik", tipo: "REM", mov: "6-4", cc: 8, bs: 12, ph: 10, wip: 13, arm: 3, bts: 3, str: 1, s: 3, skills: "Courage, Hackable, Climbing Plus, Repeater", weapon: "Heavy Shotgun, Flash Pulse", equip: "CrazyKoala, CC Weapon" },

    // --- TSYKLON SPUTNIKS --- 
    { id: "tsyklon", nome: "Tsyklon Sputnik", tipo: "REM", mov: "6-4", cc: 8, bs: 12, ph: 10, wip: 13, arm: 3, bts: 3, str: 1, s: 3, skills: "Courage, Hackable, Climbing Plus, Repeater", weapon: "Spitfire, Flash Pulse", equip: "Pitcher, CC Weapon" },

    // --- ZONDS (Meteor, Stempler, Salyut) --- 
    { id: "stempler_zond", nome: "Stempler Zond", tipo: "REM", mov: "6-4", cc: 8, bs: 11, ph: 10, wip: 13, arm: 1, bts: 3, str: 1, s: 3, skills: "Courage, Hackable, Climbing Plus, Forward Observer, Sensor, Repeater", weapon: "Combi Rifle, Flash Pulse", equip: "CC Weapon" },
    { id: "meteor_zond", nome: "Meteor Zond", tipo: "REM", mov: "6-4", cc: 8, bs: 11, ph: 10, wip: 13, arm: 1, bts: 3, str: 1, s: 3, skills: "Combat Jump (+3), Courage, Hackable, Forward Observer, Sensor, Repeater", weapon: "Combi Rifle, Flash Pulse", equip: "CC Weapon" },
    { id: "salyut_zond", nome: "Salyut Zond (Baggage)", tipo: "REM", mov: "6-4", cc: 8, bs: 11, ph: 10, wip: 13, arm: 2, bts: 3, str: 1, s: 3, skills: "Courage, Hackable, Baggage, Repeater", weapon: "Combi Rifle, Flash Pulse", equip: "CC Weapon" },
    // ==========================================
    // ⭐ PERSONAGGI SPECIALI E MERCENARI (Lista Utente)
    // ==========================================
    
    { id: "mary_problems", nome: "Mary Problems (Hacker)", tipo: "SK", mov: "4-4", cc: 15, bs: 11, ph: 10, wip: 15, arm: 1, bts: 6, w: 1, s: 2, skills: "Hacker, Forward Deployment (+8\"), Mimetism (-3), Stealth", weapon: "Submachine Gun, Zapper, Pitcher", equip: "Pistol, CC Weapon" },
    
    { id: "gator_tag", nome: "Gator (MULTI HMG)", tipo: "TAG", mov: "6-4", cc: 16, bs: 14, ph: 14, wip: 13, arm: 6, bts: 6, str: 3, s: 7, skills: "Courage, Hackable, Manned", weapon: "MULTI Heavy Machine Gun, Chain Rifle, Mine Dispenser", equip: "E/M CC Weapon" },
    { id: "robbybot", nome: "Robbybot", tipo: "PERIPHERAL", mov: "6-4", cc: 8, bs: 11, ph: 10, wip: 13, arm: 0, bts: 3, str: 1, s: 3, skills: "Peripheral", weapon: "-", equip: "-" },
    
    { id: "jazz_hacker", nome: "Jazz (Hacker)", tipo: "LI", mov: "4-4", cc: 14, bs: 11, ph: 10, wip: 14, arm: 1, bts: 3, w: 1, s: 2, skills: "Hacker, Courage, Mimetism (-3)", weapon: "Submachine Gun, Pitcher, Cybermine", equip: "Boarding Pistol, PARA CC Weapon" },
    { id: "billie", nome: "Billie", tipo: "PERIPHERAL", mov: "6-4", cc: 8, bs: 11, ph: 10, wip: 13, arm: 0, bts: 3, str: 1, s: 1, skills: "Peripheral, Repeater, Sensor", weapon: "Flash Pulse, E/M Mine", equip: "Heavy Pistol, PARA CC Weapon" },

    // ==========================================
    // 📡 DRONI AGGIUNTIVI
    // ==========================================
    
    { id: "transductor_zond", nome: "Transductor Zond", tipo: "REM", mov: "6-4", cc: 8, bs: 11, ph: 10, wip: 13, arm: 0, bts: 3, str: 1, s: 3, skills: "Courage, Hackable, Climbing Plus, Repeater", weapon: "Flash Pulse", equip: "PARA CC Weapon" },
    { id: "vertigo_zond", nome: "Vertigo Zond", tipo: "REM", mov: "6-4", cc: 8, bs: 11, ph: 10, wip: 13, arm: 0, bts: 3, str: 1, s: 3, skills: "Courage, Hackable, Climbing Plus, Guided", weapon: "Missile Launcher", equip: "PARA CC Weapon" },

]; // <--- CHIUSURA DEL DATABASE UNITÀ!



window.DB_PANO = [
    // --- FANTERIA LEGGERA (LI) ---
    { id: "P001", nome: "Fusilier", weapon: "Combi Rifle", skills: "Nessuna", tipo: "LI", state: "ACTIVE" },
    { id: "P002", nome: "Fusilier (HMG)", weapon: "HMG", skills: "Nessuna", tipo: "LI", state: "ACTIVE" },
    { id: "P003", nome: "Fusilier (Missile)", weapon: "Missile Launcher", skills: "Nessuna", tipo: "LI", state: "ACTIVE" },
    { id: "P004", nome: "Fusilier (Sniper)", weapon: "MULTI Sniper", skills: "Nessuna", tipo: "LI", state: "ACTIVE" },
    { id: "P005", nome: "Fusilier (Hacker)", weapon: "Combi Rifle", skills: "Hacker, Hacking Device", tipo: "LI", state: "ACTIVE" },
    { id: "P006", nome: "Fusilier (Paramedic)", weapon: "Combi Rifle", skills: "Paramedic, MediKit", tipo: "LI", state: "ACTIVE" },
    { id: "P007", nome: "Fusilier (Lieutenant)", weapon: "Combi Rifle", skills: "Lieutenant", tipo: "LI", state: "ACTIVE" },
    { id: "P008", nome: "Trauma-Doc", weapon: "Combi Rifle", skills: "Doctor", tipo: "LI", state: "ACTIVE" },
    { id: "P009", nome: "Machinist", weapon: "Combi Rifle", skills: "Engineer", tipo: "LI", state: "ACTIVE" },

    // --- FANTERIA MEDIA (MI) ---
    { id: "P010", nome: "Nisse (HMG)", weapon: "HMG", skills: "Mimetism, MSV2", tipo: "MI", state: "ACTIVE" },
    { id: "P011", nome: "Nisse (Sniper)", weapon: "MULTI Sniper", skills: "Mimetism, MSV2", tipo: "MI", state: "ACTIVE" },
    { id: "P012", nome: "Bolt", weapon: "Combi Rifle", skills: "Drop Bears", tipo: "MI", state: "ACTIVE" },
    { id: "P013", nome: "Bolt (Spitfire)", weapon: "Spitfire", skills: "Nessuna", tipo: "MI", state: "ACTIVE" },

    // --- FANTERIA PESANTE (HI) - Bersagli Hackable ---
    { id: "P014", nome: "Orc Troop", weapon: "MULTI Rifle", skills: "Nessuna", tipo: "HI", state: "ACTIVE" },
    { id: "P015", nome: "Orc Troop (HMG)", weapon: "HMG", skills: "Nessuna", tipo: "HI", state: "ACTIVE" },
    { id: "P016", nome: "Orc Troop (Hacker)", weapon: "MULTI Rifle", skills: "Hacker, Hacking Device", tipo: "HI", state: "ACTIVE" },
    { id: "P017", nome: "Aquila Guard (HMG)", weapon: "HMG", skills: "MSV3", tipo: "HI", state: "ACTIVE" },
    { id: "P018", nome: "Swiss Guard (HMG)", weapon: "HMG", skills: "TO Camouflage", tipo: "HI", deployState: "CAMO", state: "CAMO" },
    { id: "P019", nome: "Swiss Guard (Missile)", weapon: "Missile Launcher", skills: "TO Camouflage", tipo: "HI", deployState: "CAMO", state: "CAMO" },
    { id: "P020", nome: "Joan of Arc", weapon: "MULTI Rifle", skills: "Lieutenant, NWI", tipo: "HI", state: "ACTIVE" },
    { id: "P021", nome: "Teutonic Knight", weapon: "Light Shotgun", skills: "Frenzy", tipo: "HI", state: "ACTIVE" },
    { id: "P022", nome: "Teutonic Knight (Missile)", weapon: "Missile Launcher", skills: "Frenzy", tipo: "HI", state: "ACTIVE" },

    // --- SKIRMISHERS (SK) - Infiltratori e Camo ---
    { id: "P023", nome: "Croc Man", weapon: "Boarding Shotgun", skills: "Camouflage, Infiltration", tipo: "SK", deployState: "CAMO", state: "CAMO" },
    { id: "P024", nome: "Croc Man (Sniper)", weapon: "MULTI Sniper", skills: "Camouflage, Infiltration", tipo: "SK", deployState: "CAMO", state: "CAMO" },
    { id: "P025", nome: "Croc Man (Hacker)", weapon: "Combi Rifle", skills: "Hacker, Camouflage", tipo: "SK", deployState: "CAMO", state: "CAMO" },
    { id: "P026", nome: "Locust", weapon: "Boarding Shotgun", skills: "Camouflage, Infiltration", tipo: "SK", deployState: "CAMO", state: "CAMO" },
    { id: "P027", nome: "Locust (Hacker)", weapon: "Combi Rifle", skills: "Hacker, Camouflage", tipo: "SK", deployState: "CAMO", state: "CAMO" },
    { id: "P028", nome: "Zulu-Cobra (Spitfire)", weapon: "Spitfire", skills: "Camouflage, Forward Deployment", tipo: "SK", deployState: "CAMO", state: "CAMO" },

    // --- REMOTI (REM) - Bersagli Hackable ---
    { id: "P029", nome: "Pathfinder Dronbot", weapon: "Combi Rifle", skills: "Sensor, FO", tipo: "REM", state: "ACTIVE" },
    { id: "P030", nome: "Sierra Dronbot", weapon: "HMG", skills: "Total Reaction", tipo: "REM", state: "ACTIVE" },
    { id: "P031", nome: "Clipper Dronbot", weapon: "Missile Launcher", skills: "BS Attack (Guided)", tipo: "REM", state: "ACTIVE" },
    { id: "P032", nome: "Fugazi Dronbot", weapon: "Flash Pulse", skills: "Mimetism", tipo: "REM", state: "ACTIVE" },
    { id: "P033", nome: "Bulleteer (Spitfire)", weapon: "Spitfire", skills: "Mimetism", tipo: "REM", state: "ACTIVE" },
    { id: "P034", nome: "Peacemaker", weapon: "Heavy Shotgun", skills: "Forward Deployment", tipo: "REM", state: "ACTIVE" },

    // --- TAG (TAG) - Bersagli Hackable ---
    { id: "P035", nome: "Cutter", weapon: "HMG", skills: "TO Camouflage, TAG", tipo: "TAG", deployState: "CAMO", state: "CAMO" },
    { id: "P036", nome: "Tikbalang", weapon: "HMG", skills: "Mimetism, TAG", tipo: "TAG", state: "ACTIVE" },
    { id: "P037", nome: "Squalo Mk-II", weapon: "HMG", skills: "TAG", tipo: "TAG", state: "ACTIVE" },

    // --- MERCENARI / WARBANDS ---
    { id: "P038", nome: "Yuan Yuan", weapon: "Chain Rifle", skills: "Combat Jump, Smoke", tipo: "WB", state: "ACTIVE" },
    { id: "P039", nome: "Señor Massacre", weapon: "Combi Rifle", skills: "Eclipse Grenades", tipo: "HI", state: "ACTIVE" },
    { id: "P040", nome: "Warcor", weapon: "Flash Pulse", skills: "Aerocam", tipo: "LI", state: "ACTIVE" }
];


// ==========================================
// 🏗️ DATABASE STRUTTURE E SCENOGRAFIE
// ==========================================
// Questi profili vengono usati per gli elementi di scenario distruttibili,
// gli obiettivi hackerabili o le torrette ostili che reagiscono in ARO.

window.DB_STRUTTURE = [
    // --- TORRETTE AUTOMATIZZATE ---
    { 
        id: "turret_combi", 
        nome: "Torretta Automatica (Combi Rifle)", 
        tipo: "TORRETTA", 
        mov: "-", cc: "-", bs: 11, ph: 10, wip: "-", arm: 2, bts: 3, str: 1, s: 2, 
        skills: "Automated, 360 Visor", 
        weapon: "Combi Rifle", 
        equip: "-" 
    },
    { 
        id: "turret_hmg", 
        nome: "Torretta Automatica Pesante (HMG)", 
        tipo: "TORRETTA", 
        mov: "-", cc: "-", bs: 11, ph: 10, wip: "-", arm: 3, bts: 3, str: 2, s: 3, 
        skills: "Automated, 360 Visor", 
        weapon: "Heavy Machine Gun", 
        equip: "-" 
    },

    // --- OBIETTIVI DI MISSIONE E SCENARI ---
    { 
        id: "obj_console", 
        nome: "Console di Comando", 
        tipo: "STRUTTURA", 
        mov: "-", cc: "-", bs: "-", ph: "-", wip: "-", arm: 1, bts: 3, str: 1, s: 2, 
        skills: "Hackable, Objective", 
        weapon: "-", 
        equip: "-" 
    },
    { 
        id: "obj_techcoffin", 
        nome: "Tech-Coffin", 
        tipo: "STRUTTURA", 
        mov: "-", cc: "-", bs: "-", ph: "-", wip: "-", arm: 2, bts: 6, str: 2, s: 3, 
        skills: "Objective, Indestructible (Opzionale)", 
        weapon: "-", 
        equip: "-" 
    },
    { 
        id: "obj_antenna", 
        nome: "Antenna di Trasmissione", 
        tipo: "STRUTTURA", 
        mov: "-", cc: "-", bs: "-", ph: "-", wip: "-", arm: 1, bts: 3, str: 2, s: 3, 
        skills: "Hackable, Repeater (Objective)", 
        weapon: "-", 
        equip: "-" 
    },

    // --- ELEMENTI SCENICI DISTRUTTIBILI ---
    { 
        id: "door_light", 
        nome: "Porta Blindata (Leggera)", 
        tipo: "STRUTTURA", 
        mov: "-", cc: "-", bs: "-", ph: "-", wip: "-", arm: 4, bts: 0, str: 1, s: "-", 
        skills: "Destructible", 
        weapon: "-", 
        equip: "-" 
    },
    { 
        id: "door_heavy", 
        nome: "Porta Bulkhead (Pesante)", 
        tipo: "STRUTTURA", 
        mov: "-", cc: "-", bs: "-", ph: "-", wip: "-", arm: 8, bts: 0, str: 2, s: "-", 
        skills: "Destructible, Anti-Materiel Only", 
        weapon: "-", 
        equip: "-" 
    }
];

// 5. DATABASE TERRENI E AMBIENTAZIONI (Mappatura Automatica Tratti)
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

// Mappa tecnica per il Calcolatore Centrale (Hub)
window.TRATTI_TERRENO = {
    'Bassa Visibilità': { modBS: -3, modB: 0 },
    'Pessima Visibilità': { modBS: -6, modB: 0 },
    'Visibilità Zero': { modBS: -6, modB: 0, lof: false },
    'Zona di Saturazione': { modBS: 0, modB: -1 },
    'Rumore Bianco': { msv_only: true, lof: false },
    'Peggiora Visibilità di 1': { modBS: -3, modB: 0 } // Convertito in malus base per semplificare i tiri
};