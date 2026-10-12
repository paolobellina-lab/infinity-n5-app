// @versione 2026-09-14.1 | banco_confronto.js | proprieta`: chat MOTORE
// ==========================================
// ⚖️ BANCO DI CONFRONTO — node banco_confronto.js
// ------------------------------------------
// Fa girare il monolite dell'Hub (generaRisoluzioneDaDati) e il motore
// sugli STESSI scenari, e confronta le decisioni.
//
// Non serve a dire chi ha ragione: serve a far emergere OGNI differenza,
// così che nessuna passi inosservata mentre si smonta il vecchio codice.
// Ogni divergenza va poi classificata a mano:
//    ATTESA   -> il vecchio sbagliava, il motore corregge (documentata qui)
//    DA VEDERE-> nessuno dei due è chiaramente giusto: serve il regolamento
//    REGRESSIONE -> il motore sbaglia: si corregge il motore
// ==========================================

global.window = global;
require('./catalogo_n5.js');
require('./database_comune.js');
require('./database_panoceania.js');
require('./database_nomad.js');
const M = require('./motore_regole_n5.js');
// ⚠️ Si carica l'ORIGINALE, non l'adattatore: il confronto ha senso solo
// contro il monolite di 492 righe che stiamo sostituendo.
require('./calcolatore_math_ORIGINALE.js');
const VECCHIO = { calcolaSalvezza: window.calcolaSalvezza, generaRisoluzioneDaDati: window.generaRisoluzioneDaDati };
require('./calcolatore_math.js');   // l'adattatore sovrascrive le due funzioni
const NUOVO = { calcolaSalvezza: window.calcolaSalvezza, generaRisoluzioneDaDati: window.generaRisoluzioneDaDati };

// --- tavolo di prova -------------------------------------------------
const ATT = [
    { id: 'a1', alias: 'Alguacil',   nome: 'Alguacil', tipo: 'LI', bs: 11, cc: 13, ph: 10, wip: 12, arm: 1, bts: 0, w: 1, skills: '', states: {} },
    { id: 'a2', alias: 'Moran',      nome: 'Moran',    tipo: 'LI', bs: 11, cc: 13, ph: 10, wip: 13, arm: 1, bts: 3, w: 1, skills: '', states: {} },
    { id: 'a3', alias: 'Occhio',     nome: 'Occhio',   tipo: 'LI', bs: 12, cc: 13, ph: 10, wip: 12, arm: 1, bts: 0, w: 1, skills: 'Multispectral Visor L2', states: {} },
    { id: 'a4', alias: 'Interventor', nome: 'Interventor', tipo: 'LI', bs: 11, cc: 13, ph: 10, wip: 14, arm: 1, bts: 6, w: 1, skills: 'Hacker, Hacking Device', states: {} }
];
const DIF = [
    { id: 'd1', alias: 'Fusilier', nome: 'Fusilier', tipo: 'LI', bs: 12, cc: 13, ph: 10, wip: 13, arm: 1, bts: 0, w: 1, skills: '', states: {} },
    { id: 'd2', alias: 'Bolt',     nome: 'Bolt',     tipo: 'MI', bs: 12, cc: 15, ph: 11, wip: 13, arm: 3, bts: 3, w: 1, skills: '', states: {} },
    { id: 'd3', alias: 'Vedetta',  nome: 'Vedetta',  tipo: 'LI', bs: 12, cc: 13, ph: 11, wip: 14, arm: 1, bts: 3, w: 1, skills: 'Multispectral Visor L2', states: {} },
    { id: 'd4', alias: 'Squalo',   nome: 'Squalo',   tipo: 'TAG', bs: 13, cc: 18, ph: 14, wip: 13, arm: 8, bts: 6, w: 2, skills: '', states: {} }
];

window.gameState = { activeFaction: 'NOMADI', nomads: ATT, panoceania: DIF };

// --- generatore di scenari -------------------------------------------
const ARMI_ATT = ['Combi Rifle', 'Heavy Machine Gun', 'Chain Rifle', 'Grenades', 'CC Weapon'];
const AZIONI_ATT = [
    M.AZIONI.BS_ATTACK, M.AZIONI.CC_ATTACK, M.AZIONI.HACKING,
    M.AZIONI.INTUITIVO, M.AZIONI.SPECULATIVO, M.AZIONI.SCOPRIRE
];
const REAZIONI = [null, 'BS_ATTACK', 'CC_ATTACK', 'DODGE', 'RESET', 'HACKING'];

function scenari() {
    const out = [];
    ATT.forEach(att => DIF.forEach(dif =>
        ARMI_ATT.forEach(nomeArma => AZIONI_ATT.forEach(azione =>
            REAZIONI.forEach(reaz => [true, false].forEach(versoAttaccante => {
                if (reaz === null && !versoAttaccante) return;   // caso unico
                out.push({ att, dif, nomeArma, azione, reaz, versoAttaccante });
            }))
        ))
    ));
    return out;
}

// --- esecuzione del VECCHIO -------------------------------------------
function eseguiVecchio(sc) {
    const arma = M.profiloArma(sc.nomeArma);
    window.latestAroData = sc.reaz ? [{
        nome: sc.dif.alias,
        azione: sc.reaz,
        arma: sc.reaz === 'CC_ATTACK' ? 'CC Weapon' : 'Combi Rifle',
        bersaglio: sc.versoAttaccante ? sc.att.alias : 'Altro',
        burst: 1, rangeMod: 0, cover: false, ammo: 'N', terrain: 'NESSUNO'
    }] : [];

    const dati = {
        attacchi: [{
            attaccante: sc.att.alias,
            azione: sc.azione,
            arma: arma,
            bersagli: [{ id: sc.dif.id, name: sc.dif.alias, burst: 1, rangeMod: 0, rangeIndex: 0, cover: false, ammo: arma.ammo || 'N', terrain: 'NESSUNO' }]
        }]
    };
    try {
        const r = VECCHIO.generaRisoluzioneDaDati(dati);
        if (!r || r.length === 0) return { tipo: 'NESSUNO', grezzo: '(nessuno scontro)' };
        const t = String(r[0].titolo || '');
        if (t.indexOf('FACCIA A FACCIA') >= 0) return { tipo: 'F2F', grezzo: t };
        if (t.indexOf('SUPPORTO') >= 0) return { tipo: 'NESSUNO', grezzo: t };
        return { tipo: 'NORMALE', grezzo: t };
    } catch (e) {
        return { tipo: 'ERRORE', grezzo: e.message };
    }
}

// --- esecuzione del NUOVO ---------------------------------------------
function eseguiNuovo(sc) {
    const arma = M.profiloArma(sc.nomeArma);
    const attacco = {
        azione: sc.azione, arma: arma, attaccante: sc.att,
        bersaglio: sc.dif, burst: 1, ammo: arma.ammo
    };
    const reazione = sc.reaz ? {
        azione: sc.reaz,
        arma: M.profiloArma(sc.reaz === 'CC_ATTACK' ? 'CC Weapon' : 'Combi Rifle'),
        bersaglio: sc.versoAttaccante ? sc.att : { alias: 'Altro' },
        burst: 1, ammo: 'N'
    } : null;
    try {
        const e = M.tipoConfronto(attacco, reazione, {
            attaccanteHaMSV: /MULTISPECTRAL/i.test(sc.att.skills || ''),
            difensoreHaMSV: /MULTISPECTRAL/i.test(sc.dif.skills || '')
        });
        return { tipo: e.tipo, motivo: e.motivo };
    } catch (e) {
        return { tipo: 'ERRORE', motivo: e.message };
    }
}

// ======================================================================
// SECONDA PARTE: confronto dei TIRI SALVEZZA
// Il vecchio calcolaSalvezza restituisce HTML: si estrae il numero dal
// testo "N o MENO". Brutto ma efficace per un confronto.
// ======================================================================
function numeroDaHtml(html) {
    const m = /([0-9]+)\s*o\s*(?:meno|MENO)/i.exec(String(html || ''));
    return m ? parseInt(m[1], 10) : null;
}
function dadiDaHtml(html) {
    const m = /Tira\s*<b[^>]*>\s*([0-9]+)\s*Dad/i.exec(String(html || ''));
    if (m) return parseInt(m[1], 10);
    if (/Tira 1 Dado/i.test(String(html || ''))) return 1;
    if (/Tira 2 Dadi/i.test(String(html || ''))) return 2;
    return null;
}
function attributoDaHtml(html) {
    const m = /su\s*<b[^>]*>\s*(ARM|BTS|PH)\s*<\/b>/i.exec(String(html || ''));
    if (m) return m[1].toUpperCase();
    if (/su BTS/i.test(String(html || ''))) return 'BTS';
    return null;
}

const BERSAGLI_SALV = [
    { alias: 'Fusilier', tipo: 'LI',  arm: 1, bts: 0, ph: 10, skills: '' },
    { alias: 'Bolt',     tipo: 'MI',  arm: 3, bts: 3, ph: 11, skills: '' },
    { alias: 'Squalo',   tipo: 'TAG', arm: 8, bts: 6, ph: 14, skills: '' },
    { alias: 'Fugazi',   tipo: 'REM', arm: 0, bts: 0, ph: 8,  skills: '' }
];

function confrontaSalvezze() {
    const armi = Object.keys(window.RULES_WEAPONS).filter(function (n) {
        const a = M.profiloArma(n);
        return !a.nonTrovata && !a.soloModalita && a.dam != null;
    });
    const ris = { uguali: 0, attese: {}, daVedere: [], saltati: 0 };

    armi.forEach(function (nomeArma) {
        const arma = M.profiloArma(nomeArma);
        BERSAGLI_SALV.forEach(function (b) {
            [false, true].forEach(function (cover) {
                let vecchio;
                try {
                    vecchio = VECCHIO.calcolaSalvezza(arma.ammo, arma.dam, b.arm, b.bts, b.ph, cover, b, false, '');
                } catch (e) { ris.saltati++; return; }

                const vNum = numeroDaHtml(vecchio);
                const vAttr = attributoDaHtml(vecchio);
                const vDadi = dadiDaHtml(vecchio);
                if (vNum === null) { ris.saltati++; return; }   // fumogeni ecc.

                const n = M.tiroSalvezza(b, { arma: arma, cover: cover });
                if (!n.offensivo) { ris.saltati++; return; }
                if (n.combinato) {
                    // il vecchio non conosce il Tiro Salvezza Combinato
                    ris.attese['Tiro Salvezza Combinato non gestito dal vecchio'] =
                        (ris.attese['Tiro Salvezza Combinato non gestito dal vecchio'] || 0) + 1;
                    return;
                }

                const stesso = (vNum === n.valoreSuccesso) && (vAttr === n.attributo) &&
                               (vDadi === null || vDadi === n.tiri);
                if (stesso) { ris.uguali++; return; }

                // --- divergenze attese: l'arma dichiara salvAttr propri ---
                // Il vecchio calcolaSalvezza ignora salvAttr e deduce tutto
                // dalla munizione. Ogni differenza che si spiega col campo
                // del Weapon Chart è una correzione, non una regressione.
                if (arma.salvAttr) {
                    const sa = M.parseSalvAttr(arma.salvAttr);
                    if (sa && vAttr !== n.attributo) {
                        const k = `attributo dal Weapon Chart (${arma.salvAttr}) invece che dalla munizione (${arma.ammo})`;
                        ris.attese[k] = (ris.attese[k] || 0) + 1;
                        return;
                    }
                    // stesso attributo, trattamento diverso: azzerato, dimezzato
                    // o con MOD fisso — nessuna di queste cose il vecchio la sa.
                    const mun = M.risolviMunizione(arma.ammo);
                    if (sa && sa.azzera) {
                        const k = `attributo AZZERATO dal Weapon Chart (${arma.salvAttr}): la munizione ${arma.ammo} non lo direbbe`;
                        ris.attese[k] = (ris.attese[k] || 0) + 1;
                        return;
                    }
                    if (sa && sa.dimezza && !mun.dimezza) {
                        const k = `attributo DIMEZZATO dal Weapon Chart (${arma.salvAttr}): la munizione ${arma.ammo} non lo direbbe`;
                        ris.attese[k] = (ris.attese[k] || 0) + 1;
                        return;
                    }
                    if (sa && sa.mod && sa.mod !== 0) {
                        const k = `MOD fisso dal Weapon Chart (${arma.salvAttr})`;
                        ris.attese[k] = (ris.attese[k] || 0) + 1;
                        return;
                    }
                }
                if (arma.salvTiri && vDadi !== null && vDadi !== n.tiri) {
                    const k = `numero di salvezze dal Weapon Chart (${arma.salvTiri}) invece che dalla munizione`;
                    ris.attese[k] = (ris.attese[k] || 0) + 1;
                    return;
                }
                if (arma.isTemplate && cover && vNum !== n.valoreSuccesso) {
                    ris.attese['Sagoma: nessun +3 di Copertura al Tiro Salvezza'] =
                        (ris.attese['Sagoma: nessun +3 di Copertura al Tiro Salvezza'] || 0) + 1;
                    return;
                }
                ris.daVedere.push({ nomeArma, b: b.alias, cover, vNum, vAttr, vDadi,
                                    nNum: n.valoreSuccesso, nAttr: n.attributo, nDadi: n.tiri,
                                    ammo: arma.ammo, salvAttr: arma.salvAttr, salvTiri: arma.salvTiri });
            });
        });
    });
    return ris;
}

// ======================================================================
// TERZA PARTE: confronto dei MOD D'ATTACCO
// Dall'HTML dell'Hub si estrae il numero-bersaglio ("mod" nello scontro).
// ======================================================================
const STATI_PROVA = [
    { nome: 'normale',     s: {} },
    { nome: 'bersagliato', s: { targeted: true } },
    { nome: 'soppressione', s: { suppressive: true } }
];
const DIF_TRATTI = [
    { alias: 'Fusilier',  tipo: 'LI', bs: 12, cc: 13, ph: 10, wip: 13, arm: 1, bts: 0, skills: '' },
    { alias: 'CamoMan',   tipo: 'LI', bs: 12, cc: 13, ph: 10, wip: 13, arm: 1, bts: 0, skills: 'Mimetism (-3)' },
    { alias: 'CamoTO',    tipo: 'LI', bs: 12, cc: 13, ph: 10, wip: 13, arm: 1, bts: 0, skills: 'Mimetism (-6)' }
];
const ATT_TRATTI = [
    { alias: 'Alguacil', tipo: 'LI', bs: 11, cc: 13, ph: 10, wip: 12, arm: 1, bts: 0, skills: '' },
    { alias: 'Occhio',   tipo: 'LI', bs: 12, cc: 13, ph: 10, wip: 12, arm: 1, bts: 0, skills: 'Multispectral Visor L2' },
    { alias: 'Lince',    tipo: 'LI', bs: 12, cc: 13, ph: 10, wip: 12, arm: 1, bts: 0, skills: 'Multispectral Visor L1' },
    { alias: 'Tiratore', tipo: 'LI', bs: 13, cc: 13, ph: 10, wip: 12, arm: 1, bts: 0, skills: 'Marksmanship' },
    { alias: 'Visore',   tipo: 'LI', bs: 12, cc: 13, ph: 10, wip: 12, arm: 1, bts: 0, skills: 'X-Visor' }
];

function inCCazione(az) { const sp = M.SPEC[az] || {}; return sp.attributo === 'CC'; }

function confrontaModAttacco() {
    const ris = { uguali: 0, attese: {}, daVedere: [], saltati: 0 };
    const armi = ['Combi Rifle', 'Heavy Machine Gun', 'Grenades'];
    const azioni = [M.AZIONI.BS_ATTACK, M.AZIONI.SPECULATIVO, M.AZIONI.GUIDATO];

    ATT_TRATTI.forEach(function (a) {
        DIF_TRATTI.forEach(function (dBase) {
            STATI_PROVA.forEach(function (st) {
                const d = Object.assign({}, dBase, { states: st.s, id: 'x1' });
                armi.forEach(function (nomeArma) {
                    const arma = M.profiloArma(nomeArma);
                    if (arma.nonTrovata || arma.soloModalita) return;
                    azioni.forEach(function (azione) {
                        [0, 1].forEach(function (rangeIndex) {
                            if (!arma.bands[rangeIndex]) return;
                            [false, true].forEach(function (cover) {

                                window.gameState = { activeFaction: 'NOMADI', nomads: [a], panoceania: [d] };
                                window.latestAroData = [];
                                const dati = { attacchi: [{
                                    attaccante: a.alias, azione: azione, arma: arma,
                                    bersagli: [{ id: d.id, name: d.alias, burst: 1,
                                        rangeMod: arma.bands[rangeIndex].mod, rangeIndex: rangeIndex,
                                        cover: cover, ammo: arma.ammo, terrain: 'NESSUNO' }]
                                }] };
                                let vecchio;
                                try { vecchio = VECCHIO.generaRisoluzioneDaDati(dati); }
                                catch (e) { ris.saltati++; return; }
                                if (!vecchio || !vecchio.length) { ris.saltati++; return; }
                                const vMod = vecchio[0].attivo.mod;
                                if (typeof vMod !== 'number') { ris.saltati++; return; }

                                const n = M.modAttacco(a, d, arma, azione, {
                                    rangeIndex: rangeIndex, cover: cover, terrain: 'NESSUNO'
                                });
                                if (n.automatico || n.lofBloccata) { ris.saltati++; return; }

                                if (vMod === n.valore) { ris.uguali++; return; }

                                // --- divergenza ATTESA: l'Hub non riconosce i visori ---
                                // Cerca la sigla "MSV", ma tutti e 35 i profili dei due
                                // database scrivono "Multispectral Visor Lx" per esteso.
                                // Risultato: nell'Hub NESSUN visore funziona, e ogni
                                // unità che ne ha uno subisce il Mimetismo per intero.
                                // --- ATTESA: le Granate tirano su PH, non su BS ---
                                // Tratto "BS Weapon (PH)" sul Weapon Chart. L'Hub usa
                                // sempre il BS.
                                const attrNuovo = M.attributoArma(arma, azione).attributo;
                                if (attrNuovo !== 'BS' && !inCCazione(azione)) {
                                    const k = `attributo dell'arma dal Tratto (${nomeArma} tira su ${attrNuovo}, l'Hub usa il BS)`;
                                    ris.attese[k] = (ris.attese[k] || 0) + 1;
                                    return;
                                }

                                // --- ATTESA: limite di ±12 ai MOD ---
                                // Regola N5 (CATALOGO_N5.MECCANICHE). L'Hub non lo applica
                                // e lascia scendere il tiro senza fondo.
                                if (n.voci.some(v => v.fonte === 'limite')) {
                                    const k = 'limite di ±12 ai MOD applicato (l\'Hub non lo applica)';
                                    ris.attese[k] = (ris.attese[k] || 0) + 1;
                                    return;
                                }

                                // --- ATTESA: lo Speculativo applica il -6 anche sul Bersagliato ---
                                // Il vecchio Hub lo toglieva: era la regola N4. In N5 il -6
                                // si applica SEMPRE (REGOLE_N5_v5_1_1.txt riga 3920), e il
                                // +3 del Bersagliato si somma. Differenza: esattamente 6.
                                // (Correzione segnalata dalla chat REGOLE, 20 settembre.)
                                if (azione === M.AZIONI.SPECULATIVO && st.nome === 'bersagliato' &&
                                    n.voci.some(v => v.fonte === 'speculativo' && v.valore === -6) &&
                                    (vMod - n.valore) === 6) {
                                    const k = 'Speculativo su Bersagliato: il -6 si applica in N5 (il vecchio Hub usava la regola N4)';
                                    ris.attese[k] = (ris.attese[k] || 0) + 1;
                                    return;
                                }

                                const attHaVisore = /MULTISPECTRAL VISOR/i.test(a.skills || '');
                                const difHaMimetismo = M.valoreMimetismo(d) < 0;
                                if (attHaVisore && difHaMimetismo) {
                                    const k = 'Multispectral Visor riconosciuto (l\'Hub cerca la sigla MSV, i database scrivono il nome per esteso)';
                                    ris.attese[k] = (ris.attese[k] || 0) + 1;
                                    return;
                                }

                                const firma = `${azione} | ${nomeArma} | att ${a.alias} | dif ${dBase.alias} ${st.nome} | banda ${rangeIndex}${cover ? ' +cop' : ''}`;
                                ris.daVedere.push({ firma, vMod, nMod: n.valore, voci: n.voci, note: n.note,
                                                    azione, arma: nomeArma, att: a.alias, dif: dBase.alias, stato: st.nome, cover });
                            });
                        });
                    });
                });
            });
        });
    });
    return ris;
}

// ======================================================================
// QUARTA PARTE: lo SCONTRO COMPLETO
// Confronta risolviScontro() con generaRisoluzioneDaDati() su tutti i
// campi che contano: titolo, MOD dei due lati, Burst, salvezze.
// ======================================================================
function confrontaScontri() {
    const ris = { uguali: 0, attese: {}, daVedere: [], saltati: 0 };
    const armi = ['Combi Rifle', 'Heavy Machine Gun'];
    const reazioniP = [null, 'BS_ATTACK', 'DODGE'];

    ATT_TRATTI.slice(0, 3).forEach(function (a) {
        DIF_TRATTI.forEach(function (dBase) {
            STATI_PROVA.forEach(function (st) {
                const d = Object.assign({}, dBase, { states: st.s, id: 'x1' });
                armi.forEach(function (nomeArma) {
                    const arma = M.profiloArma(nomeArma);
                    reazioniP.forEach(function (reaz) {
                        [0, 2].forEach(function (rangeIndex) {
                            if (!arma.bands[rangeIndex]) return;
                            [false, true].forEach(function (cover) {

                                window.gameState = { activeFaction: 'NOMADI', nomads: [a], panoceania: [d] };
                                window.latestAroData = reaz ? [{
                                    nome: d.alias, azione: reaz,
                                    arma: reaz === 'BS_ATTACK' ? arma : null,
                                    bersaglio: a.alias, burst: 1, rangeMod: 0,
                                    cover: false, ammo: 'N', terrain: 'NESSUNO', hasLoF: true
                                }] : [];

                                const bers = { id: d.id, name: d.alias, burst: 1,
                                    rangeMod: arma.bands[rangeIndex].mod, rangeIndex: rangeIndex,
                                    cover: cover, ammo: arma.ammo, terrain: 'NESSUNO' };
                                let vecchio;
                                try { vecchio = VECCHIO.generaRisoluzioneDaDati({ attacchi: [{
                                    attaccante: a.alias, azione: M.AZIONI.BS_ATTACK, arma: arma, bersagli: [bers]
                                }] }); } catch (e) { ris.saltati++; return; }
                                if (!vecchio || !vecchio.length) { ris.saltati++; return; }
                                const V = vecchio[0];

                                const N = M.risolviScontro({
                                    attaccante: a, azione: M.AZIONI.BS_ATTACK, arma: arma,
                                    bersaglio: d, burst: 1, ammo: arma.ammo,
                                    cover: cover, rangeIndex: rangeIndex, terrain: 'NESSUNO'
                                }, reaz ? {
                                    difensore: d, azione: reaz,
                                    arma: reaz === 'BS_ATTACK' ? arma : null,
                                    bersaglio: a, rangeMod: 0, hasLoF: true, ammo: 'N'
                                } : null, {});

                                const diff = [];
                                if (V.titolo !== N.titolo) diff.push(`titolo ${V.titolo} -> ${N.titolo}`);
                                if (typeof V.attivo.mod === 'number' && V.attivo.mod !== N.attivo.mod)
                                    diff.push(`MOD attivo ${V.attivo.mod} -> ${N.attivo.mod}`);
                                if (V.attivo.burst !== N.attivo.burst)
                                    diff.push(`Burst attivo ${V.attivo.burst} -> ${N.attivo.burst}`);
                                if (reaz && typeof V.reattivo.mod === 'number' && N.reattivo &&
                                    V.reattivo.mod !== N.reattivo.mod)
                                    diff.push(`MOD reattivo ${V.reattivo.mod} -> ${N.reattivo.mod}`);
                                const vSalv = numeroDaHtml(V.reattivo.salvezza);
                                const nSalv = N.attivo.salvezzaInflitta.valoreSuccesso;
                                if (vSalv !== null && nSalv != null && vSalv !== nSalv)
                                    diff.push(`salvezza inflitta ${vSalv} -> ${nSalv}`);

                                if (diff.length === 0) { ris.uguali++; return; }

                                // le stesse correzioni gia` classificate altrove
                                const attHaVisore = /MULTISPECTRAL VISOR/i.test(a.skills || '');
                                const difHaMim = M.valoreMimetismo(d) < 0;
                                if (attHaVisore && difHaMim) {
                                    ris.attese['Multispectral Visor riconosciuto'] =
                                        (ris.attese['Multispectral Visor riconosciuto'] || 0) + 1;
                                    return;
                                }
                                if (N.attivo.voci.some(v => v.fonte === 'limite') ||
                                    (N.reattivo && N.reattivo.voci && N.reattivo.voci.some(v => v.fonte === 'limite'))) {
                                    ris.attese['limite di ±12 ai MOD'] = (ris.attese['limite di ±12 ai MOD'] || 0) + 1;
                                    return;
                                }
                                if (st.nome === 'soppressione' && diff.some(x => x.indexOf('MOD reattivo') === 0)) {
                                    ris.attese['Burst 3 in Soppressione col profilo SF'] =
                                        (ris.attese['Burst 3 in Soppressione col profilo SF'] || 0) + 1;
                                    return;
                                }
                                ris.daVedere.push({ a: a.alias, d: dBase.alias, st: st.nome, nomeArma,
                                                    reaz: reaz || '-', rangeIndex, cover, diff });
                            });
                        });
                    });
                });
            });
        });
    });
    return ris;
}

// --- classificazione delle divergenze note ----------------------------
// Ogni voce spiega PERCHÉ la differenza è voluta. Una divergenza che non
// combacia con nessuna di queste è da guardare a mano.
const ATTESE = [
    // Il Reset e` F2F SOLO contro Attacchi Comms e Guidati; contro BS, CC o
    // Speculativo e` un Tiro Normale (REGOLE_N5_v5_1_1.txt riga 7753). Il
    // vecchio Hub lo contava sempre F2F. (Chat REGOLE, 21 settembre.)
    { nome: 'Reset contro un attacco non Comms ne` Guidato: Tiro Normale (il vecchio Hub lo faceva F2F)',
      vale: (sc, v, n) => String((sc.reaz && sc.reaz.azione) || sc.reaz || '').toUpperCase() === 'RESET'
                          && v.tipo === 'F2F' && n.tipo === 'NORMALE' },
    {
        nome: 'Intuitivo: F2F invece di Tiro Normale',
        vale: (sc, v, n) => sc.azione === M.AZIONI.INTUITIVO && v.tipo === 'NORMALE' && n.tipo === 'F2F',
        perche: "L'Hub forza il Tiro Normale per l'Intuitivo. Il regolamento dice che l'Intuitivo richiede un tiro WIP, quindi la reazione è simultanea e si risolve in Faccia a Faccia."
    },
    {
        nome: 'Sagoma Diretta: Tiro Normale invece di F2F',
        vale: (sc, v, n) => {
            const a = M.profiloArma(sc.nomeArma);
            const t = M.regoleTemplate(a);
            return t && t.tipo === 'DIRETTO' && sc.azione !== M.AZIONI.INTUITIVO &&
                   v.tipo === 'F2F' && n.tipo === 'NORMALE';
        },
        perche: "Con una Sagoma Diretta non c'è tiro per colpire: chi reagisce fa un Tiro Normale, qualunque attacco dichiari."
    },
    {
        nome: 'Scoprire: nessun confronto',
        vale: (sc, v, n) => sc.azione === M.AZIONI.SCOPRIRE && v.tipo !== n.tipo && n.tipo === 'NORMALE',
        perche: "Scoprire non è un Attacco: non può generare un Faccia a Faccia."
    }
];

// --- confronto ---------------------------------------------------------
const casi = scenari();
const conteggi = { uguali: 0, attese: {}, daVedere: [], errori: [] };

casi.forEach(function (sc) {
    const v = eseguiVecchio(sc);
    const n = eseguiNuovo(sc);

    if (v.tipo === 'ERRORE' || n.tipo === 'ERRORE') {
        conteggi.errori.push({ sc, v, n });
        return;
    }
    if (v.tipo === n.tipo) { conteggi.uguali++; return; }

    const attesa = ATTESE.find(a => a.vale(sc, v, n));
    if (attesa) {
        conteggi.attese[attesa.nome] = (conteggi.attese[attesa.nome] || 0) + 1;
        return;
    }
    conteggi.daVedere.push({ sc, v, n });
});

// --- rapporto ----------------------------------------------------------
console.log('\n══════════ BANCO DI CONFRONTO ══════════');
console.log(`scenari generati: ${casi.length}`);
console.log(`decisioni identiche: ${conteggi.uguali}`);

console.log('\n--- divergenze ATTESE (il motore corregge il vecchio) ---');
const nomiAttese = Object.keys(conteggi.attese);
if (nomiAttese.length === 0) console.log('  (nessuna)');
nomiAttese.forEach(function (nome) {
    const a = ATTESE.find(x => x.nome === nome);
    console.log(`  ${String(conteggi.attese[nome]).padStart(4)}x  ${nome}`);
    console.log(`         ${a.perche}`);
});

console.log('\n--- divergenze DA GUARDARE ---');
if (conteggi.daVedere.length === 0) {
    console.log('  (nessuna)');
} else {
    // raggruppa per firma, altrimenti sono centinaia di righe uguali
    const gruppi = {};
    conteggi.daVedere.forEach(function (d) {
        const k = `${d.sc.azione} | ${d.sc.nomeArma} | reaz ${d.sc.reaz || '-'}${d.sc.versoAttaccante ? ' (sull attaccante)' : ''} | vecchio ${d.v.tipo} -> nuovo ${d.n.tipo}`;
        gruppi[k] = (gruppi[k] || 0) + 1;
    });
    Object.keys(gruppi).sort().forEach(k => console.log(`  ${String(gruppi[k]).padStart(4)}x  ${k}`));
    console.log(`\n  esempio: ${conteggi.daVedere[0].n.motivo}`);
}

console.log('\n--- ERRORI di esecuzione ---');
if (conteggi.errori.length === 0) console.log('  (nessuno)');
else {
    const g = {};
    conteggi.errori.forEach(function (e) {
        const k = `${e.v.tipo === 'ERRORE' ? 'VECCHIO' : 'NUOVO'}: ${e.v.tipo === 'ERRORE' ? e.v.grezzo : e.n.motivo}`;
        g[k] = (g[k] || 0) + 1;
    });
    Object.keys(g).forEach(k => console.log(`  ${String(g[k]).padStart(4)}x  ${k}`));
}

const totAttese = nomiAttese.reduce((s, k) => s + conteggi.attese[k], 0);
console.log('\n════════════════════════════════════════');
console.log(`TIPO DI CONFRONTO — identiche ${conteggi.uguali} | attese ${totAttese} | da guardare ${conteggi.daVedere.length} | errori ${conteggi.errori.length}`);

// ---------------------------------------------------------------------
const sal = confrontaSalvezze();
console.log('\n══════════ TIRI SALVEZZA ══════════');
console.log(`identiche: ${sal.uguali}   saltate (fumogeni, non offensive): ${sal.saltati}`);
console.log('\n--- divergenze ATTESE ---');
const nA = Object.keys(sal.attese);
if (nA.length === 0) console.log('  (nessuna)');
nA.sort((a, b) => sal.attese[b] - sal.attese[a]).forEach(k => console.log(`  ${String(sal.attese[k]).padStart(4)}x  ${k}`));

console.log('\n--- divergenze DA GUARDARE ---');
if (sal.daVedere.length === 0) console.log('  (nessuna)');
else {
    const g = {};
    sal.daVedere.forEach(function (d) {
        const k = `${d.nomeArma} (ammo ${d.ammo}${d.salvAttr ? ', salvAttr ' + d.salvAttr : ''}) — vecchio ${d.vDadi}d ${d.vAttr} ${d.vNum} -> nuovo ${d.nDadi}d ${d.nAttr} ${d.nNum}`;
        g[k] = (g[k] || 0) + 1;
    });
    Object.keys(g).sort().slice(0, 25).forEach(k => console.log(`  ${String(g[k]).padStart(3)}x  ${k}`));
    if (Object.keys(g).length > 25) console.log(`  ... e altri ${Object.keys(g).length - 25} casi distinti`);
}

const totSal = nA.reduce((s, k) => s + sal.attese[k], 0);
console.log('\n════════════════════════════════════════');
console.log(`SALVEZZE — identiche ${sal.uguali} | attese ${totSal} | da guardare ${sal.daVedere.length}`);
console.log('');
// ---------------------------------------------------------------------
const ma = confrontaModAttacco();
console.log('\n══════════ MOD D\'ATTACCO ══════════');
console.log(`identiche: ${ma.uguali}   saltate: ${ma.saltati}`);
console.log('\n--- divergenze ATTESE ---');
const nMA = Object.keys(ma.attese);
if (nMA.length === 0) console.log('  (nessuna)');
nMA.sort((x, y) => ma.attese[y] - ma.attese[x]).forEach(k => console.log(`  ${String(ma.attese[k]).padStart(4)}x  ${k}`));
console.log('\n--- divergenze DA GUARDARE ---');
if (ma.daVedere.length === 0) console.log('  (nessuna)');
else {
    const g = {};
    ma.daVedere.forEach(function (d) {
        const k = `${d.azione} | dif ${d.dif} ${d.stato}${d.cover ? ' +cop' : ''} | att ${d.att} — vecchio ${d.vMod} -> nuovo ${d.nMod}`;
        if (!g[k]) g[k] = { n: 0, esempio: d };
        g[k].n++;
    });
    Object.keys(g).sort().slice(0, 20).forEach(function (k) {
        console.log(`  ${String(g[k].n).padStart(3)}x  ${k}`);
        console.log(`         voci: ${g[k].esempio.voci.map(v => (v.valore > 0 ? '+' : '') + v.valore + ' ' + v.fonte).join(', ') || '(nessuna)'}`);
    });
    if (Object.keys(g).length > 20) console.log(`  ... e altri ${Object.keys(g).length - 20} casi distinti`);
}

console.log('\n════════════════════════════════════════');
const totMA = Object.keys(ma.attese).reduce((x, k) => x + ma.attese[k], 0);
console.log(`MOD ATTACCO — identiche ${ma.uguali} | attese ${totMA} | da guardare ${ma.daVedere.length} | saltate ${ma.saltati}`);
console.log('');

// ---------------------------------------------------------------------
const sc = confrontaScontri();
console.log('\n══════════ SCONTRO COMPLETO ══════════');
console.log(`identiche: ${sc.uguali}   saltate: ${sc.saltati}`);
console.log('\n--- divergenze ATTESE ---');
const nSC = Object.keys(sc.attese);
if (nSC.length === 0) console.log('  (nessuna)');
nSC.sort((x, y) => sc.attese[y] - sc.attese[x]).forEach(k => console.log(`  ${String(sc.attese[k]).padStart(4)}x  ${k}`));
console.log('\n--- divergenze DA GUARDARE ---');
if (sc.daVedere.length === 0) console.log('  (nessuna)');
else {
    const g = {};
    sc.daVedere.forEach(function (x) {
        const k = `att ${x.a} | dif ${x.d} ${x.st} | ${x.nomeArma} | reaz ${x.reaz}${x.cover ? ' +cop' : ''} — ${x.diff.join('; ')}`;
        g[k] = (g[k] || 0) + 1;
    });
    Object.keys(g).sort().slice(0, 20).forEach(k => console.log(`  ${String(g[k]).padStart(3)}x  ${k}`));
    if (Object.keys(g).length > 20) console.log(`  ... e altri ${Object.keys(g).length - 20} casi distinti`);
}
const totSC = nSC.reduce((x, k) => x + sc.attese[k], 0);
console.log('\n════════════════════════════════════════');
console.log(`SCONTRO COMPLETO — identiche ${sc.uguali} | attese ${totSC} | da guardare ${sc.daVedere.length}`);
console.log('');

const male = conteggi.daVedere.length + conteggi.errori.length + sal.daVedere.length + ma.daVedere.length + sc.daVedere.length;
process.exit(male === 0 ? 0 : 1);
