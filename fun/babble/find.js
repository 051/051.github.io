var OPTS = {
    "armor": false,
    "attack_speed": false,     // Atk Spd, "attack_speed" in mods...
    "attackInterval": false,   // ...and "attackInterval" in towers
    "chain": false,
    "crit": false,
    "damage": false,
    "health": false,           // Health, "health" in towers / harvesters...
    "toughness": false,        // ...and "toughness" in mods
    "knockback": false,
    "multishot": false,
    "pierce": false,
    "poison": false,
    "range": false,            // Range, "range" in towers / mods...
    "harvestRange": false,     // ...and "harvestRange" in harvesters
    "armor_shred": false,
    "slow": false,
    "splash": false,
    "stun": false,
    "armor_buff_aura": false,
    "firerate_buff_aura": false,
    "burn_aura": false,
    "dmg_buff_aura": false,
    "heal_aura": false,
    "slow_aura": false,
    "harvest_amount": false,   //
    "harvestAmount": false,    //
    "harvest_speed": false,    //
    "harvestInterval": false,  //
    "multi_harvest": false,
    "harvest_aura": false,
    "wood": false,
    "crystal": false,
    "ore": false,
    "rack": "",
    "must_have": "",
    "must_start": "",
    "unit_type": "",
};

// i cba man
const TOWER_NAMES = ["Health", "Damage", "Atk Spd", "Armor", "Range", "Chain", "Crit", "Knockback", "Multishot", "Pierce", "Poison", "Shred", "Slow", "Splash", "Stun", "Armor Aura", "Atk Spd Aura", "Burn Aura", "Damage Aura", "Heal Aura", "Slow Aura"];
const TOWER_REFS = ["health", "damage", "attackInterval", "armor", "range", "chain", "crit", "knockback", "multishot", "pierce", "poison", "armor_shred", "slow", "splash", "stun", "armor_buff_aura", "firerate_buff_aura", "burn_aura", "dmg_buff_aura", "heal_aura", "slow_aura"];

const HARVEST_NAMES = ["Health", "Harvest Amount", "Range", "Harvest Interval", "Multi-Harvest", "Harvest Aura", "Harvest Resources"];
const HARVEST_REFS = ["health", "harvestAmount", "harvestRange", "harvestInterval", "multi_harvest", "harvest_aura", "harvestResources"];
const HARVEST_RESOURCES = ["wood", "crystal", "ore"];

const MOD_NAMES = ["Health", "Damage", "Atk Spd", "Armor", "Range", "Chain", "Crit", "Knockback", "Multishot", "Pierce", "Poison", "Shred", "Slow", "Splash", "Stun", "Armor Aura", "Atk Spd Aura", "Burn Aura", "Damage Aura", "Heal Aura", "Slow Aura", "Harvest Amount", "Harvest Speed", "Multi-Harvest", "Harvest Aura"];
const MOD_REFS = ["toughness", "damage", "attack_speed", "armor", "range", "chain", "crit", "knockback", "multishot", "pierce", "poison", "armor_shred", "slow", "splash", "stun", "armor_buff_aura", "firerate_buff_aura", "burn_aura", "dmg_buff_aura", "heal_aura", "slow_aura", "harvest_amount", "harvest_speed", "multi_harvest", "harvest_aura"];

const SELECT_TOWER = "tower";
const SELECT_HARVESTER = "harvester";
const SELECT_MOD = "mod";

const TYPE_TOWER = "TOWER";
const TYPE_HARVESTER = "HARVESTER";
const TYPE_MOD_ACTION = "MODIFIER_ACTION";
const TYPE_MOD_QUALITY = "MODIFIER_QUALITY";

// used to filter out uninteresting towers on these properties
const DEFAULTS = {
    "armor": 1,
    "damage": 5,
    "health": 100,
    "range": 4,
    "attackInterval": 1,
    "harvestAmount": 2,
    "harvestInterval": 3.2,
    "harvestRange": 3,
}

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
    if (OPTS.unit_type == SELECT_TOWER) units = filterTowers(units);
    if (OPTS.unit_type == SELECT_HARVESTER) units = filterHarvesters(units);
    if (OPTS.unit_type == SELECT_MOD) units = filterMods(units);

    // letter checks at the end to reduce the number of words to run on
    if (OPTS.rack != "") units = units.filter(u => canFormWord(answerize(OPTS.rack), answerize(u.word)));
    if (OPTS.must_have != "") units = units.filter(u => canFormWord(answerize(u.word), answerize(OPTS.must_have)));
    if (OPTS.must_start != "") units = units.filter(u => answerize(u.word)[0] == answerize(OPTS.must_start)[0]);

    // rough sort for now -- approximately puts "better" stuff higher
    units.sort((a, b) => b.budget - a.budget);
    
    document.getElementById("output").innerHTML = "";
    if (OPTS.unit_type == SELECT_TOWER) displayTowers(units);
    if (OPTS.unit_type == SELECT_HARVESTER) displayHarvesters(units);
    if (OPTS.unit_type == SELECT_MOD) displayMods(units);
}

function readInputs() {
    for (ref of MOD_REFS) {
        OPTS[ref] = document.getElementById(ref).checked;
    }
    // add aliases
    OPTS.attackInterval = OPTS.attack_speed;
    OPTS.health = OPTS.toughness;
    OPTS.harvestAmount = OPTS.harvest_amount;
    OPTS.harvestInterval = OPTS.harvest_speed;
    OPTS.harvestRange = OPTS.range;

    for (resource of HARVEST_RESOURCES) {
        OPTS[resource] = document.getElementById(resource).checked;
    }
    
    OPTS.rack = answerize(document.getElementById("rack").value);
    OPTS.must_have = answerize(document.getElementById("must_have").value);
    OPTS.must_start = answerize(document.getElementById("must_start").value);
    OPTS.unit_type = document.getElementById("unit_type").value;
}

function filterTowers(units) {
    units = units.filter(u => u.kind == TYPE_TOWER);
    for (ref of TOWER_REFS) {
        if (OPTS[ref]) {
            units = units.filter(u => (u[ref] && DEFAULTS[ref] && isBetterThanDefault(ref, u[ref])) ||
                                      (u.specials && u.specials.some(d => d.name == ref)));
        }
    }
    return units;
}

function filterHarvesters(units) {
    units = units.filter(u => u.kind == TYPE_HARVESTER);
    for (ref of HARVEST_REFS) {
        if (OPTS[ref]) {
            units = units.filter(u => (u[ref] && DEFAULTS[ref] && isBetterThanDefault(ref, u[ref])) ||
                                      (u.specials && u.specials.some(d => d.name == ref)));
        }
    }
    for (resource of HARVEST_RESOURCES) {
        if (OPTS[resource]) {
            units = units.filter(u => u.harvestResources && u.harvestResources.includes(resource));
        }
    }
    return units;
}

function filterMods(units) {
    units = units.filter(u => u.kind == TYPE_MOD_ACTION || u.kind == TYPE_MOD_QUALITY);
    for (ref of MOD_REFS) {
        if (OPTS[ref]) {
            units = units.filter(u => u.deltas && u.deltas.some(d => d.stat == ref));
        }
    }
    return units;
}

function displayTowers(units) {
    // select columns
    var cols = ["health", "damage", "attackInterval", "armor", "range"];
    for (ref of TOWER_REFS) {
        if (OPTS[ref] && cols.indexOf(ref) == -1) {
            cols.push(ref);
        }
    }

    const table = document.createElement("table");
    
    // make headers
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    const name_th = document.createElement("th");
    name_th.textContent = "Word";
    headerRow.appendChild(name_th);
    for (col of cols) {
        const th = document.createElement("th");
        th.textContent = TOWER_NAMES[TOWER_REFS.indexOf(col)];
        headerRow.appendChild(th);
    }
    const others_th = document.createElement("th");
    others_th.textContent = "Others";
    headerRow.appendChild(others_th);
    thead.appendChild(headerRow);
    
    // add unit rows
    const tbody = document.createElement("tbody");
    units.forEach(unit => {
        const row = document.createElement("tr");
        // name
        const name_td = document.createElement("td");
        name_td.textContent = unit.word.toUpperCase();
        row.appendChild(name_td);
        // all attributes
        for (col of cols) {
            const td = document.createElement("td");
            if (col == "attackInterval") td.textContent = (1 / unit[col]).toFixed(2);
            else if (unit[col]) td.textContent = unit[col];
            else if (unit.specials) {
                var maybeSpecial = unit.specials.filter(s => s.name == col);
                if (maybeSpecial.length) td.textContent = maybeSpecial[0].value;
            }
            row.appendChild(td);
        }
        // unsearched attributes
        const other_td = document.createElement("td");
        if (unit.specials) {
            var otherSpecials = [];
            for (special of unit.specials) {
                // unit has a special that we haven't listed
                if (!OPTS[special.name]) {
                    const specialText = TOWER_NAMES[TOWER_REFS.indexOf(special.name)] + " " + special.value;
                    otherSpecials.push(specialText);
                }
            }
            if (otherSpecials.length) other_td.textContent = otherSpecials.join(", ");
        }
        row.appendChild(other_td);
        tbody.appendChild(row);
    });
    table.appendChild(thead);
    table.appendChild(tbody);
    document.getElementById("output").appendChild(table);
}

function displayHarvesters(units) {
    // select columns
    var cols = ["health", "harvestAmount", "harvestInterval", "harvestRange", "harvestResources"];
    for (ref of HARVEST_REFS) {
        if (OPTS[ref] && cols.indexOf(ref) == -1) {
            cols.push(ref);
        }
    }

    const table = document.createElement("table");
    
    // make headers
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    const name_th = document.createElement("th");
    name_th.textContent = "Word";
    headerRow.appendChild(name_th);
    for (col of cols) {
        const th = document.createElement("th");
        th.textContent = HARVEST_NAMES[HARVEST_REFS.indexOf(col)];
        headerRow.appendChild(th);
    }
    const others_th = document.createElement("th");
    others_th.textContent = "Others";
    headerRow.appendChild(others_th);
    thead.appendChild(headerRow);
    
    // add unit rows
    const tbody = document.createElement("tbody");
    units.forEach(unit => {
        const row = document.createElement("tr");
        // name
        const name_td = document.createElement("td");
        name_td.textContent = unit.word.toUpperCase();
        row.appendChild(name_td);
        // all attributes
        for (col of cols) {
            const td = document.createElement("td");
            if (unit[col]) td.textContent = unit[col];
            else if (unit.specials) {
                var maybeSpecial = unit.specials.filter(s => s.name == col);
                if (maybeSpecial.length) td.textContent = maybeSpecial[0].value;
            }
            row.appendChild(td);
        }
        // unsearched attributes
        const other_td = document.createElement("td");
        if (unit.specials) {
            var otherSpecials = [];
            for (special of unit.specials) {
                // unit has a special that we haven't listed
                if (!OPTS[special.name]) {
                    const specialText = HARVEST_NAMES[HARVEST_REFS.indexOf(special.name)] + " " + special.value;
                    otherSpecials.push(specialText);
                }
            }
            if (otherSpecials.length) other_td.textContent = otherSpecials.join(", ");
        }
        row.appendChild(other_td);
        tbody.appendChild(row);
    });
    table.appendChild(thead);
    table.appendChild(tbody);
    document.getElementById("output").appendChild(table);
}

function displayMods(units) {
    // select columns
    var cols = [];
    for (ref of MOD_REFS) {
        if (OPTS[ref] && cols.indexOf(ref) == -1) {
            cols.push(ref);
        }
    }

    const table = document.createElement("table");
    
    // make headers
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    const name_th = document.createElement("th");
    name_th.textContent = "Word";
    headerRow.appendChild(name_th);
    for (col of cols) {
        const th = document.createElement("th");
        th.textContent = MOD_NAMES[MOD_REFS.indexOf(col)];
        headerRow.appendChild(th);
    }
    const others_th = document.createElement("th");
    others_th.textContent = "Others";
    headerRow.appendChild(others_th);
    thead.appendChild(headerRow);
    
    // add unit rows
    const tbody = document.createElement("tbody");
    units.forEach(unit => {
        const row = document.createElement("tr");
        // name
        const name_td = document.createElement("td");
        name_td.textContent = unit.word.toUpperCase();
        row.appendChild(name_td);
        // all attributes
        for (col of cols) {
            const td = document.createElement("td");
            if (unit.deltas) {
                var maybeSpecial = unit.deltas.filter(s => s.stat == col);
                if (maybeSpecial.length) td.textContent = formatDelta(maybeSpecial[0]);
            }
            row.appendChild(td);
        }
        // unsearched attributes
        const other_td = document.createElement("td");
        if (unit.deltas) {
            var otherDeltas = [];
            for (delta of unit.deltas) {
                // unit has a special that we haven't listed
                if (!OPTS[delta.stat]) {
                    const deltaText = formatDeltaWithStatName(delta);
                    otherDeltas.push(deltaText);
                }
            }
            if (otherDeltas.length) other_td.textContent = otherDeltas.join(", ");
        }
        row.appendChild(other_td);
        tbody.appendChild(row);
    });
    table.appendChild(thead);
    table.appendChild(tbody);
    document.getElementById("output").appendChild(table);
}

// utils
function isBetterThanDefault(ref, val) {
    if (ref == "attackInterval" || ref == "harvestInterval") {
        return val < DEFAULTS[ref];
    }
    return val > DEFAULTS[ref];
}

function answerize(ans) {
    return ans.replace(/[^a-zA-Z]/gi, "").toUpperCase();
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
    return op_string + delta.value + " " + MOD_NAMES[MOD_REFS.indexOf(delta.stat)];
}
