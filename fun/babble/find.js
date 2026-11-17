var FILTER_ARMOR = false;
var FILTER_DAMAGE = false;
var FILTER_HEALTH = false;
var FILTER_RANGE = false;
var FILTER_RATE = false;

var FILTER_CHAIN = false;
var FILTER_CRIT = false;
var FILTER_KNOCKBACK = false;
var FILTER_MULTISHOT = false;
var FILTER_PIERCE = false;
var FILTER_POISON = false;
var FILTER_SHRED = false;
var FILTER_SLOW = false;
var FILTER_SPLASH = false;
var FILTER_STUN = false;
var FILTER_ARMOR_AURA = false;
var FILTER_RATE_AURA = false;
var FILTER_BURN_AURA = false;
var FILTER_DAMAGE_AURA = false;
var FILTER_HEAL_AURA = false;
var FILTER_SLOW_AURA = false;
var FILTER_HARVEST_AMOUNT = false;
var FILTER_HARVEST_SPEED = false;
var FILTER_MULTI_HARVEST = false;
var FILTER_HARVEST_AURA = false;

var FILTER_WOOD = false;
var FILTER_CRYSTAL = false;
var FILTER_ORE = false;

var RACK = "";
var UNIT_TYPE = "";
const SELECT_TOWER = "tower";
const SELECT_HARVESTER = "harvester";
const SELECT_MOD = "mod";

const TYPE_TOWER = "TOWER";
const TYPE_HARVESTER = "HARVESTER";
const TYPE_MOD_ACTION = "MODIFIER_ACTION";
const TYPE_MOD_QUALITY = "MODIFIER_QUALITY";

const DEFAULT_ARMOR = 1;
const DEFAULT_DAMAGE = 5;
const DEFAULT_HEALTH = 100;
const DEFAULT_HARVEST_RANGE = 3;
const DEFAULT_RANGE = 4;
const DEFAULT_RATE = 1;

function search() {
    // read page inputs into vars
    readInputs();
    var units = data.units;
    
    // remove invalid words
    units = units.filter(u => u.word.length > 2 && u.word.indexOf("_") == -1);
    
    // filter by type
    if (UNIT_TYPE == SELECT_TOWER) units = units.filter(u => u.kind == TYPE_TOWER);
    if (UNIT_TYPE == SELECT_HARVESTER) units = units.filter(u => u.kind == TYPE_HARVESTER);
    if (UNIT_TYPE == SELECT_MOD) units = units.filter(u => u.kind == TYPE_MOD_ACTION || u.kind == TYPE_MOD_QUALITY);
    
    // basic qualities
    if (FILTER_ARMOR) {
        units = units.filter(u =>
            (UNIT_TYPE == SELECT_TOWER && u.armor && u.armor > DEFAULT_ARMOR) || 
            (UNIT_TYPE == SELECT_MOD && u.deltas && u.deltas.some(d => d.stat == "armor")));
    }
    if (FILTER_DAMAGE) {
        units = units.filter(u =>
            (UNIT_TYPE == SELECT_TOWER && u.damage && u.damage > DEFAULT_DAMAGE) || 
            (UNIT_TYPE == SELECT_MOD && u.deltas && u.deltas.some(d => d.stat == "damage")));
    }
    if (FILTER_RANGE) {
        units = units.filter(u =>
            (UNIT_TYPE == SELECT_TOWER && u.range && u.range > DEFAULT_RANGE) || 
            (UNIT_TYPE == SELECT_HARVESTER && u.harvestRange && u.harvestRange > DEFAULT_HARVEST_RANGE) ||
            (UNIT_TYPE == SELECT_MOD && u.deltas && u.deltas.some(d => d.stat == "range")));
    }
    if (FILTER_HEALTH) {
        units = units.filter(u => 
            (UNIT_TYPE == SELECT_TOWER && u.health && u.health > DEFAULT_HEALTH) ||
            (UNIT_TYPE == SELECT_MOD && u.deltas && u.deltas.some(d => d.stat == "toughness")));
    }
    if (FILTER_RATE) {
        units = units.filter(u =>
            (UNIT_TYPE == SELECT_TOWER && u.attackInterval && u.attackInterval < DEFAULT_RATE) || 
            (UNIT_TYPE == SELECT_MOD && u.deltas && u.deltas.some(d => d.stat == "attack_speed")));
    }
    
    // tower properties
    if (FILTER_CHAIN) {
        units = units.filter(u => 
            (UNIT_TYPE == SELECT_TOWER && u.specials && u.specials.some(d => d.name == "chain")) ||
            (UNIT_TYPE == SELECT_MOD && u.deltas && u.deltas && u.deltas.some(d => d.stat == "chain")));
    }
    if (FILTER_CRIT) {
        units = units.filter(u => 
            (UNIT_TYPE == SELECT_TOWER && u.specials && u.specials.some(d => d.name == "crit")) ||
            (UNIT_TYPE == SELECT_MOD && u.deltas && u.deltas && u.deltas.some(d => d.stat == "crit")));
    }
    if (FILTER_KNOCKBACK) {
        units = units.filter(u => 
            (UNIT_TYPE == SELECT_TOWER && u.specials && u.specials.some(d => d.name == "knockback")) ||
            (UNIT_TYPE == SELECT_MOD && u.deltas && u.deltas && u.deltas.some(d => d.stat == "knockback")));
    }
    if (FILTER_MULTISHOT) {
        units = units.filter(u => 
            (UNIT_TYPE == SELECT_TOWER && u.specials && u.specials.some(d => d.name == "multishot")) ||
            (UNIT_TYPE == SELECT_MOD && u.deltas && u.deltas && u.deltas.some(d => d.stat == "multishot")));
    }
    if (FILTER_PIERCE) {
        units = units.filter(u => 
            (UNIT_TYPE == SELECT_TOWER && u.specials && u.specials.some(d => d.name == "pierce")) ||
            (UNIT_TYPE == SELECT_MOD && u.deltas && u.deltas && u.deltas.some(d => d.stat == "pierce")));
    }
    if (FILTER_POISON) {
        units = units.filter(u => 
            (UNIT_TYPE == SELECT_TOWER && u.specials && u.specials.some(d => d.name == "poison")) ||
            (UNIT_TYPE == SELECT_MOD && u.deltas && u.deltas && u.deltas.some(d => d.stat == "poison")));
    }
    if (FILTER_SHRED) {
        units = units.filter(u => 
            (UNIT_TYPE == SELECT_TOWER && u.specials && u.specials.some(d => d.name == "armor_shred")) ||
            (UNIT_TYPE == SELECT_MOD && u.deltas && u.deltas && u.deltas.some(d => d.stat == "armor_shred")));
    }
    if (FILTER_SLOW) {
        units = units.filter(u => 
            (UNIT_TYPE == SELECT_TOWER && u.specials && u.specials.some(d => d.name == "slow")) ||
            (UNIT_TYPE == SELECT_MOD && u.deltas && u.deltas && u.deltas.some(d => d.stat == "slow")));
    }
    if (FILTER_SPLASH) {
        units = units.filter(u => 
            (UNIT_TYPE == SELECT_TOWER && u.specials && u.specials.some(d => d.name == "splash")) ||
            (UNIT_TYPE == SELECT_MOD && u.deltas && u.deltas && u.deltas.some(d => d.stat == "splash")));
    }
    if (FILTER_STUN) {
        units = units.filter(u => 
            (UNIT_TYPE == SELECT_TOWER && u.specials && u.specials.some(d => d.name == "stun")) ||
            (UNIT_TYPE == SELECT_MOD && u.deltas && u.deltas && u.deltas.some(d => d.stat == "stun")));
    }
    if (FILTER_ARMOR_AURA) {
        units = units.filter(u => 
            (UNIT_TYPE == SELECT_TOWER && u.specials && u.specials.some(d => d.name == "armor_buff_aura")) ||
            (UNIT_TYPE == SELECT_MOD && u.deltas && u.deltas && u.deltas.some(d => d.stat == "armor_buff_aura")));
    }
    if (FILTER_RATE_AURA) {
        units = units.filter(u => 
            (UNIT_TYPE == SELECT_MOD && u.deltas && u.deltas && u.deltas.some(d => d.stat == "firerate_buff_aura")));
            (UNIT_TYPE == SELECT_TOWER && u.specials && u.specials.some(d => d.name == "firerate_buff_aura"));
    }
    if (FILTER_BURN_AURA) {
        units = units.filter(u => 
            (UNIT_TYPE == SELECT_TOWER && u.specials && u.specials.some(d => d.name == "burn_aura")) ||
            (UNIT_TYPE == SELECT_MOD && u.deltas && u.deltas && u.deltas.some(d => d.stat == "burn_aura")));
    }
    if (FILTER_DAMAGE_AURA) {
        units = units.filter(u => 
            (UNIT_TYPE == SELECT_TOWER && u.specials && u.specials.some(d => d.name == "dmg_buff_aura")) ||
            (UNIT_TYPE == SELECT_MOD && u.deltas && u.deltas && u.deltas.some(d => d.stat == "dmg_buff_aura")));
    }
    if (FILTER_HEAL_AURA) {
        units = units.filter(u => 
            (UNIT_TYPE == SELECT_TOWER && u.specials && u.specials.some(d => d.name == "heal_aura")) ||
            (UNIT_TYPE == SELECT_MOD && u.deltas && u.deltas && u.deltas.some(d => d.stat == "heal_aura")));
    }
    if (FILTER_SLOW_AURA) {
        units = units.filter(u => 
            (UNIT_TYPE == SELECT_TOWER && u.specials && u.specials.some(d => d.name == "slow_aura")) ||
            (UNIT_TYPE == SELECT_MOD && u.deltas && u.deltas && u.deltas.some(d => d.stat == "slow_aura")));
    }

    // harvester properties
    if (FILTER_HARVEST_AMOUNT) {
        units = units.filter(u => 
            (UNIT_TYPE == SELECT_HARVESTER && u.specials && u.harvestAmount && u.harvestAmount != 2) ||
            (UNIT_TYPE == SELECT_MOD && u.deltas && u.deltas && u.deltas.some(d => d.stat == "harvest_amount")));
    }
    if (FILTER_HARVEST_SPEED) {
        units = units.filter(u => 
            (UNIT_TYPE == SELECT_HARVESTER && u.specials && u.harvestInterval && u.harvestInterval != 3.2) ||
            (UNIT_TYPE == SELECT_MOD && u.deltas && u.deltas && u.deltas.some(d => d.stat == "harvest_speed")));
    }
    if (FILTER_MULTI_HARVEST) {
        units = units.filter(u => 
            (UNIT_TYPE == SELECT_HARVESTER && u.specials && u.specials.some(d => d.name == "multi_harvest")) ||
            (UNIT_TYPE == SELECT_MOD && u.deltas && u.deltas && u.deltas.some(d => d.stat == "multi_harvest")));
    }
    if (FILTER_HARVEST_AURA) {
        units = units.filter(u => 
            (UNIT_TYPE == SELECT_HARVESTER && u.specials && u.specials.some(d => d.name == "harvest_aura")) ||
            (UNIT_TYPE == SELECT_MOD && u.deltas && u.deltas && u.deltas.some(d => d.stat == "harvest_aura")));
    }

    console.log(units.length);
    
    if (FILTER_WOOD) units = units.filter(u => UNIT_TYPE == SELECT_HARVESTER && u.harvestResources.includes("wood"));
    if (FILTER_CRYSTAL) units = units.filter(u => UNIT_TYPE == SELECT_HARVESTER && u.harvestResources.includes("crystal"));
    if (FILTER_ORE) units = units.filter(u => UNIT_TYPE == SELECT_HARVESTER && u.harvestResources.includes("ore"));
    
    console.log(units.length);
    if (RACK != "") units = units.filter(u => canFormWord(RACK, answerize(u.word)));
    console.log(units.length);

    // then dump them in the table
    displayUnits(units);
}

function readInputs() {
    UNIT_TYPE = document.getElementById("type-select").value;
    FILTER_ARMOR = document.getElementById("armor").checked;
    FILTER_RATE = document.getElementById("rate").checked;
    FILTER_CHAIN = document.getElementById("chain").checked;
    FILTER_CRIT = document.getElementById("crit").checked;
    FILTER_DAMAGE = document.getElementById("damage").checked;
    FILTER_HEALTH = document.getElementById("health").checked;
    FILTER_KNOCKBACK = document.getElementById("knockback").checked;
    FILTER_MULTISHOT = document.getElementById("multishot").checked;
    FILTER_PIERCE = document.getElementById("pierce").checked;
    FILTER_POISON = document.getElementById("poison").checked;
    FILTER_RANGE = document.getElementById("range").checked;
    FILTER_SHRED = document.getElementById("shred").checked;
    FILTER_SLOW = document.getElementById("slow").checked;
    FILTER_SPLASH = document.getElementById("splash").checked;
    FILTER_STUN = document.getElementById("stun").checked;
    FILTER_ARMOR_AURA = document.getElementById("armor_aura").checked;
    FILTER_RATE_AURA = document.getElementById("rate_aura").checked;
    FILTER_BURN_AURA = document.getElementById("burn_aura").checked;
    FILTER_DAMAGE_AURA = document.getElementById("damage_aura").checked;
    FILTER_HEAL_AURA = document.getElementById("heal_aura").checked;
    FILTER_SLOW_AURA = document.getElementById("slow_aura").checked;
    FILTER_HARVEST_AMOUNT = document.getElementById("harvest_amount").checked;
    FILTER_HARVEST_SPEED = document.getElementById("harvest_speed").checked;
    FILTER_MULTI_HARVEST = document.getElementById("multi_harvest").checked;
    FILTER_HARVEST_AURA = document.getElementById("harvest_aura").checked;
    FILTER_WOOD = document.getElementById("wood").checked;
    FILTER_CRYSTAL = document.getElementById("crystal").checked;
    FILTER_ORE = document.getElementById("ore").checked;
    RACK = answerize(document.getElementById("rack").value);
}

function displayUnits(units) {
    document.getElementById("output").innerHTML = "";
    
    const VARIABLE_FILTERS = [FILTER_CHAIN, FILTER_CRIT, FILTER_KNOCKBACK, FILTER_MULTISHOT, FILTER_PIERCE, FILTER_POISON, FILTER_SHRED, FILTER_SLOW, FILTER_SPLASH, FILTER_STUN, FILTER_ARMOR_AURA, FILTER_RATE_AURA, FILTER_BURN_AURA, FILTER_DAMAGE_AURA, FILTER_HEAL_AURA, FILTER_SLOW_AURA, FILTER_MULTI_HARVEST, FILTER_HARVEST_AURA];
    const VARIABLE_NAMES = ["Chain", "Crit", "Knockback", "Multishot", "Pierce", "Poison", "Shred", "Slow", "Splash", "Stun", "Armor Aura", "Atk Spd Aura", "Burn Aura", "Damage Aura", "Heal Aura", "Slow Aura", "Multi-Harvest", "Harvest Aura"];
    const VARIABLE_REFS = ["chain", "crit", "knockback", "multishot", "pierce", "poison", "armor_shred", "slow", "splash", "stun", "armor_buff_aura", "firerate_buff_aura", "burn_aura", "dmg_buff_aura", "heal_aura", "slow_aura", "multi_harvest", "harvest_aura"];
    const NUM_VARIABLES = VARIABLE_FILTERS.length;
    
    const USUAL_FILTERS = [FILTER_HEALTH, FILTER_DAMAGE, FILTER_RATE, FILTER_ARMOR, FILTER_RANGE];
    const USUAL_NAMES = ["Health", "Damage", "Atk Spd", "Armor", "Range"];
    const USUAL_REFS = ["toughness", "damage", "attack_speed", "armor", "range"];
    const NUM_USUALS = USUAL_FILTERS.length;
    
    const ALL_FILTERS = [...USUAL_FILTERS, ...VARIABLE_FILTERS];
    const ALL_NAMES = [...USUAL_NAMES, ...VARIABLE_NAMES];
    const ALL_REFS = [...USUAL_REFS, ...VARIABLE_REFS];
    const NUM_ALL = ALL_FILTERS.length;

    // decide columns
    // always:
    // Tower: Word, HP, Damage, Speed, Armor, Range
    // Harvester: Word, HP, Amount, Speed
    // Mod: Word
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    if (UNIT_TYPE == SELECT_TOWER) {
        for (col of ["Word", "Health", "Damage", "Atk Spd", "Armor", "Range"]) {
            const th = document.createElement("th");
            th.textContent = col;
            headerRow.appendChild(th);
        }
    }
    if (UNIT_TYPE == SELECT_HARVESTER) {
        for (col of ["Word", "Health", "Harvest Amount", "Harvest interval"]) {
            const th = document.createElement("th");
            th.textContent = col;
            headerRow.appendChild(th);
        }
    }
    if (UNIT_TYPE == SELECT_MOD) {
        for (col of ["Word"]) {
            const th = document.createElement("th");
            th.textContent = col;
            headerRow.appendChild(th);
        }
    }
    for (var i = 0; i < (UNIT_TYPE == SELECT_MOD ? NUM_ALL : NUM_VARIABLES); i++) {
        if (UNIT_TYPE == SELECT_MOD ? ALL_FILTERS[i] : VARIABLE_FILTERS[i]) {
            const th = document.createElement("th");
            th.textContent = UNIT_TYPE == SELECT_MOD ? ALL_NAMES[i] : VARIABLE_NAMES[i];
            headerRow.appendChild(th);
        }
    }
    const others_th = document.createElement("th");
    others_th.textContent = "Others";
    headerRow.appendChild(others_th);

    thead.appendChild(headerRow);
    
    const tbody = document.createElement("tbody");
    
    units.sort((a, b) => b.budget - a.budget); 
    units.forEach(unit => {
        const row = document.createElement("tr");
        const name_td = document.createElement("td");
        name_td.textContent = unit.word.toUpperCase();
        row.appendChild(name_td);
        if (UNIT_TYPE == SELECT_TOWER) {
            for (col of [unit.health, unit.damage, 1 / unit.attackInterval, unit.armor, unit.range]) {
                const td = document.createElement("td");
                td.textContent = col;
                row.appendChild(td);
            }
            for (var i = 0; i < NUM_VARIABLES; i++) {
                if (VARIABLE_FILTERS[i]) {
                    const td = document.createElement("td");
                    var maybeSpecial = unit.specials.filter(s => s.name == VARIABLE_REFS[i]);
                    td.textContent = maybeSpecial.length ? maybeSpecial[0].value : "";
                    row.appendChild(td);
                }
            }
        }
        if (UNIT_TYPE == SELECT_HARVESTER) {
            for (col of [unit.health, unit.harvestAmount, unit.harvestInterval]) {
                const td = document.createElement("td");
                td.textContent = col;
                row.appendChild(td);
            }
        }
        if (UNIT_TYPE == SELECT_MOD) {
            for (var i = 0; i < NUM_ALL; i++) {
                if (ALL_FILTERS[i]) {
                    const td = document.createElement("td");
                    var maybeSpecial = unit.deltas.filter(s => s.stat == ALL_REFS[i]);
                    td.textContent = maybeSpecial.length ? formatDelta(maybeSpecial[0]) : "";
                    row.appendChild(td);
                }
            }
        }
        tbody.appendChild(row);
    });
    table.appendChild(thead);
    table.appendChild(tbody);
    document.getElementById("output").appendChild(table);
}

// utils
function answerize(ans) {
    return ans.replace(/[^a-zA-Z0-9]/gi, "").toUpperCase();
}

function canFormWord(rackString, word) {
    var rack = [...rackString];
    for (letter of [...word]) {
        if (rack.indexOf(letter) != -1) {
            rack.splice(rack.indexOf(letter), 1);
        } else {
            return false;
        }
    }
    return true;
}

function formatDelta(delta) {
    const op_string = delta.op == "grant" ? "+" : delta.op == "add" ? "+" : delta.op == "mult" ? "x" : "";
    return op_string + delta.value;
}

function formatDeltaWithStatName(delta) {
    const op_string = delta.op == "grant" ? "+" : delta.op == "add" ? "+" : delta.op == "mult" ? "x" : "";
    return op_string + delta.value + " " + delta.stat;
}
