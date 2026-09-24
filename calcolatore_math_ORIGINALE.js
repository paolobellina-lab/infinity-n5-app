// ==========================================
// 🧮 MOTORE MATEMATICO N5 - calcolatore_math.js
// ==========================================

// --- 1. CALCOLO SALVEZZE ---
// Formula ufficiale N5: Valore di Successo = ARM/BTS(+MOD) + PS dell'arma. Tira 1d20: risultato
// UGUALE O INFERIORE al Valore di Successo = salvo. Un Critico aggiunge 1 Tiro Salvezza extra
// (ricorda al giocatore di tirarne uno in più, il calcolatore non può sapere se il tiro d'attacco
// è stato un Critico). Il Valore di Successo non scende mai sotto 1 (regola generale dei tiri).
window.calcolaSalvezza = (ammo, danno, armBase, btsBase, phBase, cover, targetObj, isHacking, hackingProgram) => {
    // Gestione Infoguerra: ogni programma ha PS, munizione e bersaglio propri, sempre su BTS
    if (isHacking) {
        let bts = parseInt(btsBase) || 0;
        // "cover" qui trasporta il valore Firewall del bersaglio (es. -3/-6, o 0 se assente).
        // Il Firewall è l'equivalente della Copertura per gli Attacchi Hacking: dà sempre +3 al
        // Tiro Salvezza del bersaglio (indipendentemente da quanto WIP toglie all'attaccante).
        let firewallAttivo = (typeof cover === 'number' && cover < 0);
        if (firewallAttivo) bts += 3;
        const firewallNote = firewallAttivo ? `<br><span style="font-size:11px; color:#00ff00;">+3 BTS per Firewall (equivalente Copertura)</span>` : "";
        const critNote = `<br><span style="font-size:11px; color:#888;">Nota: un Critico aggiunge 1 Tiro Salvezza extra.</span>`;
        if (hackingProgram === 'SPOTLIGHT') {
            let sv = Math.ceil(bts / 2) + 5; if (sv < 1) sv = 1;
            return `<span style="color:#ffcc00; font-weight:bold;">🎯 SPOTLIGHT (AP, PS 5)</span><br>Tira 1 Dado su BTS dimezzato.<br><span style="color:#00ff00; font-size:22px; font-weight:bold;">${sv} o meno</span> sul D20. Se fallisci: BERSAGLIATO.${firewallNote}${critNote}`;
        }
        if (hackingProgram === 'CARBONITE') {
            let sv = bts + 7; if (sv < 1) sv = 1;
            return `<span style="color:#00ffff; font-weight:bold;">🛑 CARBONITE (DA, PS 7)</span><br>Tira 2 Dadi su BTS (munizione DA).<br><span style="color:#00ff00; font-size:22px; font-weight:bold;">${sv} o meno</span> per ciascuno. Se fallisci: IMM-B.${firewallNote}${critNote}`;
        }
        if (hackingProgram === 'OBLIVION') {
            let sv = Math.ceil(bts / 2) + 4; if (sv < 1) sv = 1;
            return `<span style="color:#00ffff; font-weight:bold;">📵 OBLIVION (AP, PS 4)</span><br>Tira 1 Dado su BTS dimezzato.<br><span style="color:#00ff00; font-size:22px; font-weight:bold;">${sv} o meno</span> sul D20. Se fallisci: ISOLATO.${firewallNote}${critNote}`;
        }
        if (hackingProgram === 'TOTAL CONTROL') {
            let sv = bts + 4; if (sv < 1) sv = 1;
            return `<span style="color:#ff9900; font-weight:bold;">🎮 TOTAL CONTROL (DA, PS 4 — solo contro TAG)</span><br>Tira 2 Dadi su BTS (munizione DA).<br><span style="color:#00ff00; font-size:22px; font-weight:bold;">${sv} o meno</span> per ciascuno. Se fallisci: POSSEDUTO (annulla Posseduto se già presente).${firewallNote}${critNote}`;
        }
        if (hackingProgram === 'TRINITY') {
            let sv = bts + 6; if (sv < 1) sv = 1;
            return `<span style="color:#ff0000; font-weight:bold;">☠️ TRINITY (PS 6, +3 MOD attacco — solo contro Hacker nemici)</span><br>Tira 1 Dado su BTS.<br><span style="color:#00ff00; font-size:22px; font-weight:bold;">${sv} o meno</span> sul D20. Se fallisci: 1 Ferita.${firewallNote}${critNote}`;
        }
        return `<span style="color:#00ffff;">Attacco Infoguerra! (Vedi regole programma)</span>`;
    }

    if (!ammo) ammo = "NORMALE";
    let up = ammo.toUpperCase();
    if (up === 'N/A' || ammo === 'SCOPRIRE') {
        return `<span style="color:#aaaaaa;">Nessun Tiro Salvezza (Azione di Scoperta)</span>`;
    }
    
    // Gestione Fumogeni ed Eclipse
    if (up.includes("SMOKE") || up.includes("FUMOGEN") || up.includes("ECLIPSE")) {
        let isEclipse = up.includes("ECLIPSE");
        let targetHasMSV = false;
        
        if (targetObj && typeof targetObj === 'object') {
            let tSkills = ((targetObj.skills || "") + " " + (targetObj.equip || "")).toUpperCase();
            if (tSkills.includes("MSV") || tSkills.includes("MARKSMANSHIP")) {
                targetHasMSV = true;
            }
        }
        
        if (targetHasMSV && !isEclipse) {
            return `<span style="color:#aaaaaa; font-weight:bold;">💨 MUNIZIONE: ${ammo}</span><br>
                    <b style="color:#ff3333; font-size:16px;">IL VISORE NEMICO IGNORA IL FUMO!</b><br>
                    <span style="font-size:12px; color:#888;">(Il fumo andrà a terra, ma non ferma i colpi nemici)</span>`;
        } else {
            return `<span style="color:#aaaaaa; font-weight:bold;">💨 MUNIZIONE: ${ammo}</span><br>
                    <b style="color:#00ffff;">EFFETTO: BLOCCA LINEA DI TIRO</b><br>
                    <span style="font-size:12px; color:#888;">(Nessun danno o tiro salvezza. Piazza la sagoma se ha successo)</span>`;
        }
    }

    let dadiSalvezza = 1;
    let effetti = [];
    let usaBTS = up.includes("VIRAL") || up.includes("BREAKER") || up.includes("NANOTECH") || up.includes("PLASMA") || up.includes("E/M") || up.includes("STUN");
    let usaPH = up.includes("PARA") || up.includes("ADHESIVE");
    
    let statName = usaPH ? "PH" : (usaBTS ? "BTS" : "ARM");
    let statValue = usaPH ? phBase : (usaBTS ? parseInt(btsBase) : parseInt(armBase));

    let isMachine = false;
    if (targetObj && typeof targetObj === 'object') {
        let tType = (targetObj.tipo || "LI").toUpperCase();
        let tSkills = ((targetObj.skills || "") + " " + (targetObj.equip || "")).toUpperCase();
        if (tType === 'HI' || tType === 'TAG' || tType === 'REM' || tType === 'VEH' || tSkills.includes('HACKABLE')) {
            isMachine = true;
        }
    }

    if (up.includes("EXP")) dadiSalvezza = 3;
    else if (up.includes("DA") || up.includes("VIRAL") || up.includes("BIOWEAPON") || up.includes("E/M")) dadiSalvezza = 2;

    if (up.includes("K1")) { effetti.push("Danno 12, Ignora ARM/Cover"); statValue = 0; danno = 12; cover = false; }
    if (up.includes("CONTINUOUS") || up.includes("CD")) effetti.push("<b style='color:red'>🔥 DANNO CONTINUO</b>");
    if (up.includes("BIOWEAPON")) effetti.push("Applica Shock");
    if (up.includes("SHOCK")) effetti.push("Ignora NWI / Uccide a 1W");
    
    if (up.includes("AP") && !up.includes("K1")) { effetti.push("Dimezza " + statName); statValue = Math.ceil(statValue / 2); }
    if (up.includes("BREAKER")) { effetti.push("Dimezza BTS (No Cover)"); statValue = Math.ceil(statValue / 2); cover = false; }
    if (up.includes("E/M")) { effetti.push("Dimezza BTS"); statValue = Math.ceil(statValue / 2); }

    if (cover && statName === "ARM" && !up.includes("K1")) { statValue += 3; effetti.push("+3 ARM (Copertura)"); }

    if (up.includes("E/M")) effetti.push(isMachine ? "Fallimento = ISOLATO + IMM-B" : "Fallimento = ISOLATO");
    if (up.includes("STUN") || up.includes("FLASH")) effetti.push("Fallimento = STORDITO");
    if (up.includes("PARA") || up.includes("ADHESIVE")) effetti.push("Fallimento = IMM-A");
    if (up.includes("T2")) effetti.push("<b style='color:#ff3333;'>🩸 T2: 2 Ferite per ogni fallimento!</b>");
    
    let effTesto = effetti.length > 0 ? `<br><span style="font-size:12px; color:#aaa;">${effetti.join(' | ')}</span>` : "";
    
    // PARA/Adhesive: caso speciale, NON usa la formula ARM+PS — è un Tiro PH-6 puro
    // (la munizione PARA/Adhesive non ha un valore PS proprio nel senso classico).
    if (usaPH) {
        let targetPara = statValue - 6;
        if (targetPara < 1) targetPara = 1;
        return `<span style="color:#00ccff; font-weight:bold;">Munizione: ${ammo}</span><br>
                Tira <b style="color:#ff3333;">${dadiSalvezza} Dadi</b> su <b style="color:#00ffff;">PH</b>.<br>
                Devi fare <b style="color:#00ff00; font-size:22px;">${targetPara} o MENO</b> sul D20.${effTesto}
                <br><span style="font-size:11px; color:#888;">Nota: un Critico aggiunge 1 Tiro Salvezza extra.</span>`;
    }

    // FORMULA UFFICIALE: Valore di Successo = ARM/BTS (già modificato sopra da Copertura/AP/ecc.) + PS dell'arma.
    // Tira 1d20: risultato UGUALE O INFERIORE al Valore di Successo = salvo (nessun danno).
    let successValue = statValue + danno;
    if (successValue < 1) successValue = 1;

    return `<span style="color:#00ccff; font-weight:bold;">Munizione: ${ammo}</span><br>
            Tira <b style="color:#ff3333;">${dadiSalvezza} Dadi</b> su <b style="color:#00ffff;">${statName}</b>.<br>
            <span style="color:#00ff00; font-size:22px; font-weight:bold;">${successValue} o MENO</span> <span style="font-size:12px; color:#888;">(${statName} ${statValue} + PS Arma ${danno})</span>
            ${effTesto}
            <br><span style="font-size:11px; color:#888;">Nota: un Critico aggiunge 1 Tiro Salvezza extra.</span>`;
};

// --- 2. GENERAZIONE RISOLUZIONE (FACCIA A FACCIA O NORMALE) ---
window.generaRisoluzioneDaDati = (dati) => {
    let scontri = [];
    let arrayAttacchi = dati.attacchi || [];
    let reazioni = window.latestAroData || [];

    let fazAttiva = window.gameState.activeFaction;
    let fazReattiva = fazAttiva === 'NOMADI' ? 'PANOCEANIA' : 'NOMADI';

    // --- AZIONI DI SUPPORTO E DIFESE PURE ---
    if (arrayAttacchi.length > 0) {
        let actT = arrayAttacchi[0].azione;
        if (actT === 'SUPPORTO_WIP' || actT === 'SUPPORTO_BS' || ((actT === 'SCHIVATA' || actT === 'RESET') && arrayAttacchi[0].arma && arrayAttacchi[0].arma.isDifesa)) {
            arrayAttacchi.forEach(att => {
                let statBase = actT === 'SUPPORTO_WIP' ? "WIP" : (actT === 'SCHIVATA' ? "PH" : (actT === 'RESET' ? "WIP" : "BS"));
                let factionArrayAtt = fazAttiva === 'NOMADI' ? window.gameState.nomads : window.gameState.panoceania;
                let trueAtt = factionArrayAtt.find(u => (u.alias || u.nome) === att.attaccante) || {};
                
                let bsA = parseInt(trueAtt.bs) || 11; let wipA = parseInt(trueAtt.wip) || 13; let phA = parseInt(trueAtt.ph) || 11;
                let statVal = actT === 'SUPPORTO_WIP' ? wipA : (actT === 'SCHIVATA' ? phA : (actT === 'RESET' ? wipA : bsA));
                
                let targetB = att.bersagli[0];
                let modAtt = targetB ? (targetB.rangeMod || 0) : 0;
                // Regola ufficiale N5: chi è in Stato Bersagliato applica -3 WIP ai propri tiri Reset
                // (per cancellare lo stato stesso). Non riguarda la Schivata.
                let bersagliatoTesto = "";
                if (actT === 'RESET' && trueAtt.states && trueAtt.states.targeted) {
                    modAtt -= 3;
                    bersagliatoTesto = `<span style="color:#ff3333">Stato Bersagliato: -3 WIP</span><br>`;
                }
                let tgNum = statVal + modAtt;
                
                let descAzione = actT === 'SCHIVATA' ? 'SCHIVATA PURA' : (actT === 'RESET' ? 'RESET PURO' : `SUPPORTO (${att.arma.ammo})`);

                scontri.push({
                    titolo: "TIRO DI SUPPORTO / DIFESA",
                    attivo: {
                        nome: att.attaccante, fazione: fazAttiva, azione: descAzione, 
                        mod: tgNum, burst: targetB ? targetB.burst : 1, 
                        dettagliMod: `Base (${statBase}): ${statVal}<br>${bersagliatoTesto}<span style="color:#00ff00">Modificatori: ${modAtt > 0 ? '+'+modAtt : modAtt}</span><br>`, 
                        salvezza: "<span style='color:#00ff00'>Tiro Non Offensivo</span>"
                    },
                    reattivo: {
                        nome: targetB && targetB.id !== "all" ? targetB.name : "Nessun Nemico Diretto", fazione: fazAttiva, azione: "Azione Passiva", 
                        mod: "-", burst: 0, dettagliMod: "-", salvezza: "<span style='color:#555;'>-</span>"
                    }
                });
            });
            return scontri; 
        }
    }

    let unitaCoinvolte = new Set();
    arrayAttacchi.forEach(att => {
        if(att.bersagli) att.bersagli.forEach(b => unitaCoinvolte.add(b.name || b.nome));
    });
    reazioni.forEach(r => unitaCoinvolte.add(r.nome));

    unitaCoinvolte.forEach(nomeDifensore => {
        let reazione = reazioni.find(r => r.nome === nomeDifensore);
        let attaccantiCheMiranoQui = arrayAttacchi.filter(att => att.bersagli && att.bersagli.some(b => (b.name || b.nome) === nomeDifensore));

        if (attaccantiCheMiranoQui.length > 0) {
            attaccantiCheMiranoQui.forEach(att => {
                let bersaglioSpecifico = att.bersagli.find(b => (b.name || b.nome) === nomeDifensore);
                
                let factionArrayAtt = fazAttiva === 'NOMADI' ? window.gameState.nomads : window.gameState.panoceania;
                let factionArrayDif = fazReattiva === 'NOMADI' ? window.gameState.nomads : window.gameState.panoceania;
                
                let trueAtt = factionArrayAtt.find(u => (u.alias || u.nome) === att.attaccante) || {};
                let trueDif = factionArrayDif.find(u => (u.alias || u.nome) === nomeDifensore) || {};
                
                let attSkills = ((trueAtt.skills || "") + " " + (trueAtt.equip || "")).toUpperCase();
                let difSkills = ((trueDif.skills || "") + " " + (trueDif.equip || "")).toUpperCase();
                let difType = (trueDif.tipo || "LI").toUpperCase();

                let isGuided = (att.azione === 'ATTACCO GUIDATO');
                let isHackingAtt = (att.azione === 'HACKING');
                let isDiscover = (att.azione === 'SCOPRIRE');
                let isIntuitivo = (att.azione === 'ATTACCO INTUITIVO');
                let isSpeculativo = (att.azione === 'FUOCO SPECULATIVO' || att.isSpeculative);
                let isTemplateAtt = (att.arma && att.arma.isTemplate);
                let isCCAttacker = (att.azione === 'CC_ATTACK' || (att.arma && att.arma.isCC));
                let isSurpriseAttack = (att.azione === 'ATTACCO SORPRESA');

                let attHasMSV1 = attSkills.includes("MSV1") || attSkills.includes("MSV L1");
                let attHasMSV2 = attSkills.includes("MSV2") || attSkills.includes("MSV L2") || attSkills.includes("MSV3");
                let difHasMSV1 = difSkills.includes("MSV1") || difSkills.includes("MSV L1");
                let difHasMSV2 = difSkills.includes("MSV2") || difSkills.includes("MSV L2") || difSkills.includes("MSV3");
                
                let difHasSixthSense = difSkills.includes("SIXTH SENSE") || difSkills.includes("SESTO SENSO");
                let attHasMarksmanship = attSkills.includes("MARKSMANSHIP");
                let difHasMarksmanship = difSkills.includes("MARKSMANSHIP");
                let attHasXVisor = attSkills.includes("X VISOR") || attSkills.includes("X-VISOR");
                let difHasXVisor = difSkills.includes("X VISOR") || difSkills.includes("X-VISOR");
                let difHasTR = difSkills.includes("TOTAL REACTION");
                let difHasNeuro = difSkills.includes("NEUROCINETICS");
                let difHasTinBot = difSkills.includes("TINBOT") || difSkills.includes("FIREWALL");
                let attHasTinBot = attSkills.includes("TINBOT") || attSkills.includes("FIREWALL");

                let attMimetism = attSkills.includes("MIMETISM (-6)") ? -6 : (attSkills.includes("MIMETISM") ? -3 : 0);
                let difMimetism = difSkills.includes("MIMETISM (-6)") ? -6 : (difSkills.includes("MIMETISM") ? -3 : 0);

                let attInSuppressive = trueAtt.states && trueAtt.states.suppressive;
                let difInSuppressive = trueDif.states && trueDif.states.suppressive;

                let attFTCount = trueAtt.states && trueAtt.states.fireteam ? factionArrayAtt.filter(u => u.combatGroup === trueAtt.combatGroup && u.states && u.states.fireteam === trueAtt.states.fireteam && u.state !== 'DEAD').length : 0;
                let difFTCount = trueDif.states && trueDif.states.fireteam ? factionArrayDif.filter(u => u.combatGroup === trueDif.combatGroup && u.states && u.states.fireteam === trueDif.states.fireteam && u.state !== 'DEAD').length : 0;
                if (difFTCount >= 5) difHasSixthSense = true;

                let difHasTinbotGuided = difSkills.includes("TINBOT: GUIDED") || difSkills.includes("TINBOT GUIDED");
                if (!difHasTinbotGuided && trueDif.states && trueDif.states.fireteam) {
                    let teamMembers = factionArrayDif.filter(u => u.combatGroup === trueDif.combatGroup && u.states && u.states.fireteam === trueDif.states.fireteam && u.state !== 'DEAD');
                    let teamSkills = teamMembers.map(u => ((u.skills || "") + " " + (u.equip || "")).toUpperCase()).join(" ");
                    if (teamSkills.includes("TINBOT: GUIDED") || teamSkills.includes("TINBOT GUIDED")) {
                        difHasTinbotGuided = true;
                    }
                }

                // --- 1. MATEMATICA ATTACCANTE ---
                let bsAtt = parseInt(trueAtt.bs) || 11; let ccAtt = parseInt(trueAtt.cc) || 11; 
                let wipAtt = parseInt(trueAtt.wip) || 13; let phAtt = parseInt(trueAtt.ph) || 11;
                
                let statNameAtt = isCCAttacker ? "CC" : (isHackingAtt ? "WIP" : (isDiscover || isIntuitivo ? "WIP" : "BS"));
                let statAtt = isCCAttacker ? ccAtt : (isHackingAtt ? wipAtt : (isDiscover || isIntuitivo ? wipAtt : bsAtt));
                
                let modAtt = (bersaglioSpecifico.rangeMod || 0);
                let burstAtt = bersaglioSpecifico.burst || 0;
                let damAtt = (att.arma && att.arma.dam) ? parseInt(att.arma.dam) : 13;
                let ammoAtt = bersaglioSpecifico.ammo || "NORMALE";
                
                let dettAtt = `Statistica Base (${statNameAtt}): ${statAtt}<br>`;
                let coverDifensore = bersaglioSpecifico.cover || false;

                // Firewall: equivalente della Copertura per gli Attacchi Hacking. Cerca un valore esplicito
                // tra parentesi quadre (es. "TinBot: Firewall [-3]" o "[-6]"); se il tratto è presente ma
                // senza valore esplicito, usa -3 come da default più comune.
                let firewallValoreDif = 0;
                if (difHasTinBot) {
                    let matchFW = difSkills.match(/FIREWALL\s*\[?\s*(-?\d+)\s*\]?/);
                    firewallValoreDif = matchFW ? parseInt(matchFW[1]) : -3;
                }

                if (isHackingAtt) {
                    dettAtt = `<span style="color:#00ffff">💻 INFOGUERRA (WIP)</span><br>Base (WIP): ${statAtt}<br>`;
                    modAtt = 0; 
                    if (firewallValoreDif < 0) { modAtt += firewallValoreDif; dettAtt += `<span style="color:#ff3333">Firewall nemico (TinBot): ${firewallValoreDif} WIP</span><br>`; }
                    if (attFTCount >= 5) { modAtt += 1; dettAtt += `<span style="color:#00ff00">Bonus Fireteam: +1 WIP</span><br>`; }
                } else if (isTemplateAtt && !isGuided) {
                    statAtt = "Auto (Sagoma)"; modAtt = 0; coverDifensore = false;
                    dettAtt = `<span style="color:#ff9900">🔥 ARMA A SAGOMA</span><br><span style="color:#00ff00">Successo Automatico (Ignora Mimetismo e Copertura)</span><br>`;
                } else if (!isCCAttacker) {
                    if (attHasXVisor && modAtt < 0) { modAtt += 3; if(modAtt>0)modAtt=0; dettAtt += `<span style="color:#00ffff">X-Visor riduce malus gittata</span><br>`; }
                    dettAtt += `<span style="color:#00ff00">Gittata: ${modAtt > 0 ? '+'+modAtt : modAtt}</span><br>`;
                    
                    if (attFTCount >= 4) { modAtt += 1; dettAtt += `<span style="color:#00ff00">Bonus Fireteam: +1 BS</span><br>`; }

                    if (isGuided) {
                        modAtt += 3; burstAtt = 1; ammoAtt = "EXP"; coverDifensore = false;
                        dettAtt += `<span style="color:#00ff00">Bersagliato (+3 BS)</span><br><span style="color:#00ffff">Guidato (No Cover, No Mimetismo)</span><br>`;
                        if (difHasTinbotGuided) {
                            modAtt -= 6;
                            dettAtt += `<span style="color:#ff3333">TinBot Guided Nemico: -6 BS</span><br>`;
                        }
                    } else if (isSpeculativo) {
                        let bersaglioBersagliato = (trueDif.states && trueDif.states.targeted);
                        if (bersaglioBersagliato) {
                            dettAtt += `<span style="color:#00ff00">Fuoco Speculativo: -6 BS ignorato (bersaglio Bersagliato)</span><br>`;
                        } else {
                            modAtt -= 6;
                            dettAtt += `<span style="color:#cc00ff">☄️ Fuoco Speculativo: -6 BS fisso</span><br>`;
                        }
                        dettAtt += `<span style="color:#00ffff">Ignora Copertura, Mimetismo e Zone di Visibilità del bersaglio (regola ufficiale)</span><br>`;
                    } else {
                        if (coverDifensore) {
                            if (attHasMarksmanship) dettAtt += `<span style="color:#00ffff">Marksmanship: Ignora -3 Copertura!</span><br>`;
                            else { modAtt -= 3; dettAtt += `<span style="color:#ff3333">Copertura nemica: -3 BS</span><br>`; }
                        }
                        // Il -3 per bersaglio in Fuoco di Soppressione viene applicato una volta sola,
                        // più sotto nel blocco condiviso a tutti i tipi di attacco (evita doppio conteggio).
                        
                        if (difMimetism < 0) {
                            if (attHasMSV2) dettAtt += `<span style="color:#00ffff">MSV2: Ignora Mimetismo!</span><br>`;
                            else if (attHasMSV1) {
                                let r = difMimetism + 3;
                                if (r < 0) { modAtt += r; dettAtt += `<span style="color:#ff3333">MSV1 riduce Mimetismo: ${r} BS</span><br>`; }
                            } else { modAtt += difMimetism; dettAtt += `<span style="color:#ff3333">Mimetismo: ${difMimetism} BS</span><br>`; }
                        }
                    }

                    let attTerrain = bersaglioSpecifico.terrain || "NESSUNO";
                    // Il Fuoco Speculativo ignora anche le Zone di Visibilità (regola ufficiale) — la
                    // Zona di Saturazione invece si applica sempre (riduce il Burst, non la Linea di Tiro).
                    let esitoTerrAtt = window.applicaModTerreno(attTerrain, attHasMSV1, attHasMSV2, attHasMarksmanship);
                    if (esitoTerrAtt.modB < 0 && burstAtt > 1) burstAtt += esitoTerrAtt.modB;
                    if (!isSpeculativo) {
                        modAtt += esitoTerrAtt.modBS;
                        if (esitoTerrAtt.lofBloccata) { modAtt -= 99; dettAtt += `<span style="color:#ff0000">⚠️ Nessuna Linea di Tiro (Zona di Visibilità/Rumore Bianco)!</span><br>`; }
                    }
                    if (esitoTerrAtt.note) dettAtt += `<span style="color:#ff3333">${esitoTerrAtt.note}</span><br>`;

                    if (reazione && reazione.azione === 'CC_ATTACK') { modAtt -= 6; dettAtt += `<span style="color:#ff0000; font-weight:bold;">⚠️ Tiro in Mischia: -6 BS!</span><br>`; }
                }
                
                if (isCCAttacker) dettAtt += `<span style="color:#ff9900">⚔️ Mischia (Applica Arti Marziali a mente)</span><br>`;

                if (trueDif.states && trueDif.states.targeted && !isGuided && !isCCAttacker) { modAtt += 3; dettAtt += `<span style="color:#00ff00">Nemico Bersagliato: +3 ${isHackingAtt ? 'WIP' : 'BS'}</span><br>`; }
                // Regola ufficiale N5: chi attacca un nemico in Fuoco di Soppressione (entro il raggio 0-24")
                // subisce -3 al proprio Attributo nel Tiro Faccia a Faccia. Vale per qualsiasi tipo di attacco.
                if (trueDif.states && trueDif.states.suppressive) { modAtt -= 3; dettAtt += `<span style="color:#ff3333">Bersaglio in Fuoco di Soppressione: -3</span><br>`; }
                if (trueAtt.states && trueAtt.states.stunned) { modAtt -= 3; dettAtt += `<span style="color:#ff3333">Stato Stordito: -3</span><br>`; }

                let tgNumberAtt = (statAtt === "Auto (Sagoma)") ? "Auto" : (statAtt + modAtt);

                // --- 2. MATEMATICA DIFENSORE (REAZIONE ARO) ---
                let phDif = parseInt(trueDif.ph) || 11; let bsDif = parseInt(trueDif.bs) || 11;
                let ccDif = parseInt(trueDif.cc) || 11; let wipDif = parseInt(trueDif.wip) || 12;
                
                let isCCDDefender = (reazione && (reazione.azione === 'CC_ATTACK' || (reazione.arma && reazione.arma.isCC)));
                let isHackingDif = (reazione && reazione.azione === 'HACKING');

                let tgNumberDif = 10; let dettReazione = ``; let burstDif = 0; 
                let azioneReazione = "Nessuna Reazione"; let damDif = 13; let ammoDif = "NORMALE";

                if (reazione && reazione.azione !== "Nessun ARO" && reazione.azione !== "Passa") {
                    azioneReazione = reazione.azione;
                    burstDif = 1;
                    ammoDif = reazione.ammo || "NORMALE";

                    if (reazione.azione === 'DODGE') { tgNumberDif = phDif; dettReazione = `Statistica Base (PH): ${phDif}<br>`; damDif = 0;}
                    else if (reazione.azione === 'RESET') { 
                        tgNumberDif = wipDif; dettReazione = `Statistica Base (WIP): ${wipDif}<br>`; damDif = 0;
                        if (trueDif.states && trueDif.states.targeted) { tgNumberDif -= 3; dettReazione += `<span style="color:#ff3333">Stato Bersagliato: -3 WIP</span><br>`; }
                    }
                    else if (isCCDDefender) { tgNumberDif = ccDif; dettReazione = `Statistica Base (CC): ${ccDif}<br><span style="color:#ff9900">⚔️ Mischia (Applica Arti Marziali a mente)</span><br>`;}
                    else if (isHackingDif) { 
                        tgNumberDif = wipDif; dettReazione = `<span style="color:#00ffff">💻 INFOGUERRA (WIP)</span><br>Base: ${tgNumberDif}<br>`; 
                        if (attHasTinBot) { tgNumberDif -= 3; dettReazione += `<span style="color:#ff3333">Firewall nemico: -3 WIP</span><br>`; }
                        if (difFTCount >= 5) { tgNumberDif += 1; dettReazione += `<span style="color:#00ff00">Bonus Fireteam: +1 WIP</span><br>`; }
                    }
                    else if (reazione.azione === 'BS_ATTACK') { 
                        tgNumberDif = bsDif; dettReazione = `Statistica Base (BS): ${tgNumberDif}<br>`;
                        
                        if (difHasTR || difHasNeuro || difInSuppressive) { burstDif = 3; dettReazione += `<span style="color:#00ffff">Total Reaction/Soppressione: B3</span><br>`; }
                        if (difFTCount >= 4) { tgNumberDif += 1; dettReazione += `<span style="color:#00ff00">Bonus Fireteam: +1 BS</span><br>`; }

                        if (reazione.rangeMod) {
                            let dRange = reazione.rangeMod;
                            if (difHasXVisor && dRange < 0) { dRange += 3; if(dRange>0)dRange=0; }
                            tgNumberDif += dRange; dettReazione += `<span style="color:#00ff00">Gittata: ${dRange>0?'+'+dRange:dRange}</span><br>`;
                        }

                        if (attInSuppressive) { tgNumberDif -= 3; dettReazione += `<span style="color:#ff3333">Bersaglio in Soppressione: -3 BS</span><br>`; }
                        
                        if (attMimetism < 0) {
                            if (difHasSixthSense) dettReazione += `<span style="color:#00ffff">Sesto Senso ignora Mimetismo!</span><br>`;
                            else if (difHasMSV2) dettReazione += `<span style="color:#00ffff">Visore MSV2 ignora Mimetismo!</span><br>`;
                            else if (difHasMSV1) {
                                let r = attMimetism + 3;
                                if (r < 0) { tgNumberDif += r; dettReazione += `<span style="color:#ff3333">MSV1 riduce Mimetismo: ${r} BS</span><br>`; }
                            } else { tgNumberDif += attMimetism; dettReazione += `<span style="color:#ff3333">Mimetismo: ${attMimetism} BS</span><br>`; }
                        }

                        let defTerrain = reazione.terrain || "NESSUNO";
                        let esitoTerrDif = window.applicaModTerreno(defTerrain, difHasMSV1, difHasMSV2, difHasMarksmanship);
                        if (esitoTerrDif.modB < 0 && burstDif > 1) burstDif += esitoTerrDif.modB;
                        tgNumberDif += esitoTerrDif.modBS;
                        if (esitoTerrDif.lofBloccata) { tgNumberDif -= 99; dettReazione += `<span style="color:#ff0000">⚠️ Nessuna Linea di Tiro (Zona di Visibilità/Rumore Bianco)!</span><br>`; }
                        if (esitoTerrDif.note) dettReazione += `<span style="color:#ff3333">${esitoTerrDif.note}</span><br>`;
                    }

                    if (difHasSixthSense) dettReazione += `<span style="color:#00ffff">👁️ Sesto Senso Attivo!</span><br>`;
                    if (isSurpriseAttack) {
                        if (difHasSixthSense) dettReazione += `<span style="color:#00ffff">Sesto Senso annulla Attacco a Sorpresa!</span><br>`;
                        else { tgNumberDif -= 3; dettReazione += `<span style="color:#ff3333">Attacco a Sorpresa: -3</span><br>`; }
                    }
                    if (reazione.azione === "DODGE" && reazione.hasLoF === false) {
                        if (difHasSixthSense || isTemplateAtt) dettReazione += `<span style="color:#00ffff">Sesto Senso/Sagoma ignora malus LoF in Schivata</span><br>`;
                        else { tgNumberDif -= 3; dettReazione += `<span style="color:#ff3333">Schivata senza LoF: -3 PH</span><br>`; }
                    }

                    if (trueDif.states && trueDif.states.stunned) { tgNumberDif -= 3; dettReazione += `<span style="color:#ff3333">Stato Stordito: -3</span><br>`; }
                }

                // --- 3. RISOLUZIONE FACCIA A FACCIA O NORMALE ---
                let isF2F = false;
                if (reazione && burstDif > 0 && burstAtt > 0) {
                    if (isDiscover || isIntuitivo) { 
                        isF2F = false; 
                    }
                    else if (reazione.azione === 'DODGE' || reazione.azione === 'RESET') {
                        isF2F = true;
                    }
                    else if (reazione.bersaglio && att.attaccante === reazione.bersaglio) {
                        isF2F = true; 
                        
                        let upAmmoAtt = (ammoAtt || "").toUpperCase();
                        let upAmmoDif = (ammoDif || "").toUpperCase();
                        let attUsaSmoke = upAmmoAtt.includes("SMOKE") || upAmmoAtt.includes("FUMOGEN");
                        let difUsaSmoke = upAmmoDif.includes("SMOKE") || upAmmoDif.includes("FUMOGEN");
                        let attUsaEclipse = upAmmoAtt.includes("ECLIPSE");
                        let difUsaEclipse = upAmmoDif.includes("ECLIPSE");

                        if ((attUsaSmoke && !attUsaEclipse && (difHasMSV1 || difHasMSV2)) || 
                            (difUsaSmoke && !difUsaEclipse && (attHasMSV1 || attHasMSV2))) {
                            isF2F = false;
                        }
                    }
                }

                // Calcolo Salvezze Reali
                let difSaveText = "<span style='color:#555;'>Nessun danno</span>";
                if (burstAtt > 0 && damAtt > 0 && !isTemplateAtt) {
                    let isHack = (att.azione === 'HACKING');
                    // Per l'Hacking il parametro "cover" trasporta il Firewall (equivalente Copertura per WIP/BTS)
                    let coverOFirewall = isHack ? firewallValoreDif : coverDifensore;
                    difSaveText = window.calcolaSalvezza(ammoAtt, damAtt, trueDif.arm || 1, trueDif.bts || 0, trueDif.ph || 11, coverOFirewall, trueDif, isHack, window.currentOrder ? window.currentOrder.weapon : "");
                } else if (isTemplateAtt) {
                    difSaveText = window.calcolaSalvezza(ammoAtt, damAtt, trueDif.arm || 1, trueDif.bts || 0, trueDif.ph || 11, false, trueDif, false, ""); 
                }

                let attSaveText = "<span style='color:#555;'>Nessun danno</span>";
                if (burstDif > 0 && damDif > 0 && reazione && (reazione.azione === 'BS_ATTACK' || reazione.azione === 'CC_ATTACK' || isHackingDif)) {
                    attSaveText = window.calcolaSalvezza(ammoDif, damDif, trueAtt.arm || 1, trueAtt.bts || 0, trueAtt.ph || 11, false, trueAtt, isHackingDif, reazione.arma);
                }

                scontri.push({
                    titolo: isF2F ? "TIRO FACCIA A FACCIA" : "TIRO NORMALE",
                    attivo: {
                        nome: att.attaccante, fazione: fazAttiva, azione: isTemplateAtt ? 'ATTACCO A SAGOMA' : att.azione, 
                        mod: tgNumberAtt, burst: burstAtt, dettagliMod: dettAtt, salvezza: attSaveText
                    },
                    reattivo: {
                        nome: nomeDifensore, fazione: fazReattiva, azione: azioneReazione, 
                        mod: tgNumberDif, burst: burstDif, dettagliMod: dettReazione, salvezza: difSaveText
                    }
                });
            });
        } 
        else if (reazione && reazione.azione !== "Nessun ARO" && reazione.azione !== "Passa") {
            scontri.push({
                titolo: "TIRO NORMALE",
                attivo: {
                    nome: dati.isCoordinated ? "Squadra Coordinata" : (arrayAttacchi[0] ? arrayAttacchi[0].attaccante : "Attaccante"), 
                    fazione: fazAttiva, azione: "Nessuna Azione Diretta", mod: "-", burst: 0,
                    dettagliMod: "Ignorato dal difensore o non bersagliato.",
                    salvezza: reazione.azione.includes("ATTACK") ? window.calcolaSalvezza(reazione.ammo||"NORMALE", 13, 3, 0, 11, false, null, false, "") : "Nessun danno"
                },
                reattivo: {
                    nome: nomeDifensore, fazione: fazReattiva, azione: reazione.azione, 
                    mod: reazione.azione === "DODGE" ? (parseInt(window.gameState.panoceania.find(u=>u.alias===nomeDifensore)?.ph)||11) : 11, 
                    burst: 1, dettagliMod: "Tiro in ARO libero.", salvezza: "<span style='color:#555;'>Nessun danno</span>"
                }
            });
        }
    });

    return scontri;
};
console.log("🧮 N5 Math Engine Caricato!");