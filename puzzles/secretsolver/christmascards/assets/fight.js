/*~*~ HAND TO HAND COMBAT ~*~*/
var arsenal = [];
var current_fight_level = 1;
var turn_number = 0;
var candidate_card = NO_CARD_SELECTED;
var enemy_states = [];
var actions_remaining = 1;
const CASTER_NAME = 4;
const ACTUAL_DAMAGE = 8;

var you = {max_hp: 15, state: {hp: 15, diamond: 0, spade: 0}};

const FIGHT_ENEMIES = {1: [{name: "Vengeful Spirit", attack_rotation: [vengeance], max_hp: 350}],
                       2: [{name: "Magpie", attack_rotation: [gem_hunter], max_hp: 50}, 
                           {name: "Magpie", attack_rotation: [gem_hunter], max_hp: 50}],
                       3: [{name: "Mage of the Second Order", attack_rotation: [charge, decimate], max_hp: 420},
                           {name: "Mage of the Third Order", attack_rotation: [charge, charge, decimate], max_hp: 420}],
                       4: [{name: "Knight of the Square Table", attack_rotation: [square_me_up_daddy], max_hp: 300}]
                       };
var current_enemies = [];

function resetPlayerState() {
    you.state.hp = 15;
    you.state.diamond = 0;
    you.state.spade = 0;
    actions_remaining = 1;
    turn_number = 0;
}

/* ATTACKS */
function vengeance(caster) {
    if (caster.state.last_hit > 0) {
        var damage = caster.state.last_hit * 2;
        const vengeance_prefix = `The opposing <b>${caster.name}</b> casts <b>Vengeance</b>!`;
        const vengeance_template = defer`The opposing <b>${null}</b> takes their revenge for your last hit, hitting you for ${null} damage!`;
        damagePlayer(caster, damage, vengeance_prefix, vengeance_template);
    }
    if (caster.state.hp > 0) {
        const swipe_template = defer`The opposing <b>${null}</b> swipes at you for ${null} damage!`
        damagePlayer(caster, 3, '', swipe_template);
    }
}

function gem_hunter(caster) {
    var damage = 0;
    for (var card of arsenal) {
        if (suitOf(card) == 1) damage++;
    }
    if (you.state.diamond > 0) {
        logMessage(`The opposing <b>${caster.name}</b> snatches your <b>Sparkling Carapace</b>, removing its effects and powering up its attacks!`);
        damage *= (you.state.diamond + 1);
        you.state.diamond = 0;
    }
    const gem_prefix = `The opposing <b>${caster.name}</b> hunts for gems!`;
    const gem_template = defer`The opposing <b>${null}</b> pecked at your gems, hitting you for ${null} damage!`;
    damagePlayer(caster, damage, gem_prefix, gem_template);
}

function charge(caster) {
    logMessage(`The opposing <b>${caster.name}</b> is charging power!`);
}

function decimate(caster) {
    const decimate_prefix = `The opposing <b>${caster.name}</b> unleashes their charged energy to cast <b>Decimate</b>!`;
    const decimate_template = defer`The opposing <b>${null}</b> blasts you for ${null} damage!`;
    damagePlayer(caster, 200, decimate_prefix, decimate_template);
}

function square_me_up_daddy(caster) {
    if (Math.sqrt(caster.state.hp) % 1) {
        const square_prefix = `The opposing <b>${caster.name}</b> gets upset that their HP isn't neat!`
        const square_template = defer`The opposing <b>${null}</b> wallops you for ${null} damage, then heals themselves to full HP!`;
        damagePlayer(caster, 40, square_prefix, square_template);
        caster.state.hp = caster.max_hp;
    } else {
        logMessage(`The opposing <b>${caster.name}</b> is vibing contentedly. It seems they're happy with the state of their HP.`);
    }
}

/* UTILS */
function logMessage(msg) {
    const battle_log = document.getElementById("battle-log");
    battle_log.innerHTML += '<p>' + msg + '</p>';
    battle_log.scrollTop = battle_log.scrollHeight;
}

// Listener for hand.
function clickFightHandListener(ev) {
    const x = ev.target.cellIndex;
    if (x === undefined) return;
    if (candidate_card == x) {
        candidate_card = NO_CARD_SELECTED;
    } else {
        candidate_card = x;
    }
    for (card of document.getElementById("locked-hand-3").children[0].children[0].children[0].children) { // lol
        card.classList.remove("battle-focus");
    }
    if (candidate_card > -1) ev.target.classList.add("battle-focus");
}

// Listener for enemy.
function clickFightEnemyListener(ev) {
    var x = ev.target.cellIndex;
    if (candidate_card < 0 || candidate_card > arsenal.length || x == undefined) return;
    for (card of document.getElementById("locked-hand-3").children[0].children[0].children[0].children) { // lol
        card.classList.remove("battle-focus");
    }
    applyCard(arsenal[candidate_card], x);
    actions_remaining -= 1;
    arsenal.splice(candidate_card, 1);
    renderOneHand('locked-hand-3', 3, arsenal);
    if (actions_remaining < 1) endPlayerTurn();
    candidate_card = NO_CARD_SELECTED;
    renderEveryone();
}

function endPlayerTurn() {
    if (runEnemyActions()) resolveEndOfTurn();
}

function loadEnemies() {
    current_enemies = [];
    for (enemy of FIGHT_ENEMIES[current_fight_level]) {
        current_enemies.push({name: enemy.name, is_player: false, attack_rotation: enemy.attack_rotation,
                              max_hp: enemy.max_hp, state: {hp: enemy.max_hp, heart: 0, club: 0, spec: 0, last_hit: 0}});
    }
    renderEveryone();
}
    
function renderEveryone() {
    var all_elems = [];
    var all_bars = [];
    for (enemy of current_enemies) {
        var enemy_elem = `<td class="one-enemy">${enemy.name}<br/>HP ${enemy.state.hp} / ${enemy.max_hp}`;
        const heart_stacks = enemy.state.heart == 0 ? '' : `♥️ ${enemy.state.heart}`;
        const connector = enemy.state.heart * enemy.state.club > 0 ? ' ' : ''; 
        const club_stacks = enemy.state.club == 0 ? '' : `♣️ ${enemy.state.club}`;
        const hp_bar = `<td><progress value="${enemy.state.hp}" max="${enemy.max_hp}" /></td>`;
        all_elems.push(enemy_elem + '<br/><wbr>' + heart_stacks + connector + club_stacks + '</td>');
        all_bars.push(hp_bar);
    }
    const top_row = '<tr class="clickable" id="enemy-row">' + all_elems.join('') + '</tr>';
    const bottom_row = '<tr>' + all_bars.join('') + '</tr>';
    document.getElementById('fight-enemies').innerHTML = '<table>' + top_row + bottom_row + '</table>';
    for (var i = 0; i < current_enemies.length; i++) {
        document.getElementById("enemy-row").children[i].removeEventListener('click', clickFightEnemyListener);
        if (current_enemies[i].state.hp > 0) {
            document.getElementById("enemy-row").children[i].addEventListener('click', clickFightEnemyListener);
        }
    }
    var you_info = [];
    you_info.push('<b>You</b>');
    you_info.push(`HP ${you.state.hp} / ${you.max_hp}</div>` + (you.state.diamond > 0 ? ` ♦️ ${you.state.diamond}` : ''));
    you_info.push(`<progress value="${you.state.hp}" max="${you.max_hp}"></progress>`);
    you_info.push(`Actions remaining: ${actions_remaining}`);
    document.getElementById('fight-you').innerHTML = you_info.join('<br/>');
}

function applyCard(card, enemy_index) {
    var enemy = current_enemies[enemy_index];
    var damage = valOf(card) + 1 + enemy.state.club;
    var stacks = valOf(card) + 1;
    var suit = suitOf(card);
    // Really hacky. Don't think about it.
    var actual_damage = Math.min(enemy.state.hp, damage);
    logMessage(getPlayCardLog(card, enemy, actual_damage));
    damageEnemy(enemy, damage);
    enemy.state.last_hit = actual_damage;
    if (suit == 0) {
        enemy.state.club += stacks;
    } else if (suit == 1) {
        you.state.diamond += 1;
    } else if (suit == 2) {
        enemy.state.heart += stacks;
    } else if (suit == 3) {
        you.state.spade += 1;
    }
    renderEveryone();
}

function damageEnemy(enemy, damage) {
    var actual_damage = Math.min(enemy.state.hp, damage);
    enemy.state.hp -= actual_damage;
    if (enemy.state.hp == 0) {
        logMessage(`<b>${enemy.name}</b> is defeated!`);
        if (current_enemies.reduce((T,a)=>T+a.state.hp,0) == 0) {
            completeFightLevel();
        }
    }
    return actual_damage;
}

function damagePlayer(caster, damage, prefix, template, arg_flags) {
    var actual_damage = Math.min(you.state.hp, damage);
    prefix += prefix ? '<br/>' : '';
    if (you.state.diamond > 0) {
        actual_damage = 0;
        you.state.diamond -= 1;
        var reflected_damage = Math.ceil(damage / 2);
        var reflected_damage_dealt = Math.min(enemy.state.hp, reflected_damage);
        logMessage(prefix + `Your <b>Sparkling Carapace</b> absorbs all damage, shattering in the process and
                             reflecting ${reflected_damage_dealt} damage to the opposing ${caster.name}!`);
        damageEnemy(caster, reflected_damage);
    }
    you.state.hp -= actual_damage;
    
    if (actual_damage > 0) {
        logMessage(prefix + template(caster.name, actual_damage));
    }
    return actual_damage;
}

function getPlayCardLog(card, enemy, damage) {
    var stacks = valOf(card) + 1;
    var suit = suitOf(card);
    const first_line = `You attack <b>${enemy.name}</b> with the ${getVerboseCardName(card)}, dealing ${damage} damage!`;
    var second_line = '<br/>';
    const suit_stack_lines = [`You inflict ${stacks} stacks of <b>Brute Force</b>!`, `You gain a stack of <b>Sparkling Carapace</b> for this turn!`,
                              `You inflict ${stacks} stacks of <b>Life Sap</b>!`, `You gain a stack of <b>Dual Wielding</b>!`];
    second_line += suit_stack_lines[suit];
    return first_line + second_line;
}

function runEnemyActions() {
    var game_continues = true;
    for (enemy of current_enemies) {
        if (enemy.state.hp > 0) {
            var attack_pointer = turn_number % enemy.attack_rotation.length;
            enemy.attack_rotation[attack_pointer](enemy);
        }
        if (you.state.hp == 0) {
            game_continues = false;
            fightGameOver();
            break;
        }
    }
    renderEveryone();
    return game_continues;
}

function resolveEndOfTurn() {
    turn_number++;
    // Check if battle has ended.
    var game_continues = false;
    for (enemy of current_enemies) {
        if (enemy.state.hp > 0) game_continues = true;
    }
    if (game_continues && arsenal.length == 0) {
        fightGameOver();
        return;
    }
    if (!game_continues) {
        completeFightLevel();
        return;
    }
    // Deal Life Sap damage.
    for (enemy of current_enemies) {
        if (enemy.state.heart == 0 || enemy.state.hp == 0) continue;
        var damage_proposed = enemy.state.heart + enemy.state.club; // It's affected by Brute Force.
        // Hacky again :(
        var damage_dealt = Math.min(damage_proposed, enemy.state.hp);
        you.state.hp = Math.min(you.state.hp + damage_dealt, you.max_hp);
        logMessage(`Your Life Sap leeches <b>${damage_dealt}</b> HP from the opposing <b>${enemy.name}</b>,
                    and heals you by the same amount!`);
        damageEnemy(enemy, damage_proposed);
    }
    renderEveryone();
    // Check if battle has ended, again.
    var game_continues = false;
    for (enemy of current_enemies) {
        if (enemy.state.hp > 0) game_continues = true;
    }
    if (!game_continues) {
        completeFightLevel();
        return;
    }
    // Refresh actions / states for next turn.
    if (you.state.diamond > 0) {
        you.state.diamond = 0;
        logMessage('Your stacks of <b>Sparkling Carapace</b> faded.');
    }
    actions_remaining = 1;
    if (you.state.spade > 0) {
        actions_remaining += you.state.spade;
        you.state.spade = 0;
    }
    logMessage(`<b>Turn ${turn_number+1}</b>`);
}

function fightGameOver() {
    logMessage("You have been defeated!");
    document.getElementById('locked-hand-3').removeEventListener('click', clickFightHandListener);
    for (var enemy_elem of document.getElementById("enemy-row").children) {
        enemy_elem.removeEventListener('click', clickFightEnemyListener);
    }
}

function completeFightLevel() {
    if (current_fight_level < 4) {
        toggleVisibility('restart-fight', TOGGLE_OFF);
        toggleVisibility('next-fight', TOGGLE_ON);
    } else {
        toggleVisibility('restart-fight', TOGGLE_OFF);
        completeFightGame();
    }
}

function completeFightGame() {
    document.getElementById('locked-hand-3').removeEventListener('click', clickFightHandListener);
    for (var enemy_elem of document.getElementById("enemy-row").children) {
        enemy_elem.removeEventListener('click', clickFightEnemyListener);
    }
    quest_statuses[3] = 1;
    saveCompletionState();
    renderQuestCompletions();
}

function loadFightLevel() {
    resetPlayerState();
    document.getElementById('battle-log').innerHTML = '';
    logMessage(`<b>Turn ${turn_number+1}</b>`);
    arsenal = Array.from(locked_hands[3]);
    renderOneHand("locked-hand-3", 3, locked_hands[3]);
    document.getElementById('locked-hand-3').removeEventListener('click', clickFightHandListener);
    document.getElementById('locked-hand-3').addEventListener('click', clickFightHandListener);
    loadEnemies();
}

function startNextFightLevel() {
    toggleVisibility('restart-fight', TOGGLE_ON);
    toggleVisibility('next-fight', TOGGLE_OFF);
    logMessage("You emerge victorious from battle!");
    current_fight_level++;
    document.getElementById("fight-stage").innerHTML = current_fight_level;
    loadFightLevel();
}
