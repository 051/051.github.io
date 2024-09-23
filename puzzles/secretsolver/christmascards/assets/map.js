/*~*~ CARDINAL DIRECTIONS ~*~*/
const MAPS = [[[1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1],[1,1,0,0,0,0,0,0,1,1],[1,1,0,0,0,0,0,0,1,1],[1,1,0,0,0,0,3,0,1,1],[1,1,0,5,0,4,0,0,1,1],[1,1,0,0,0,0,0,0,1,1],[1,1,1,0,1,1,1,1,1,1],[1,1,23,0,1,1,1,1,1,1],[1,1,0,0,0,0,0,0,1,1],[1,1,0,0,1,0,1,0,1,1],[1,1,0,0,0,0,0,0,1,1],[1,1,1,0,0,1,0,1,1,1],[1,1,0,0,0,0,1,0,1,1],[1,1,1,0,0,0,0,0,1,1],[1,1,0,1,0,1,0,0,1,1],[1,1,0,0,0,0,0,0,1,1],[1,1,1,0,0,1,0,0,1,1],[1,1,0,0,1,0,1,0,1,1],[1,1,0,1,0,0,0,0,1,1],[1,1,0,0,0,1,0,0,1,1],[1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1]],
              [[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],[2,2,0,0,0,0,2,0,0,0,0,0,11,2,2],[2,2,0,0,0,0,2,0,0,0,0,0,0,2,2],[2,2,0,0,0,0,2,0,0,0,0,0,0,2,2],[2,2,8,0,0,0,2,0,0,2,0,0,0,2,2],[2,2,0,0,0,0,0,0,0,2,0,9,0,2,2],[2,2,2,0,2,2,2,0,0,2,2,10,2,2,2],[2,2,27,0,0,27,0,0,0,2,0,9,0,2,2],[2,2,0,0,0,0,0,0,0,2,0,0,12,2,2],[2,2,6,0,0,0,0,0,0,2,2,2,2,2,2],[2,2,7,6,0,0,0,0,0,0,0,0,0,0,24],[2,2,6,0,0,0,0,0,0,2,2,2,2,2,2],[2,2,0,0,0,0,0,0,0,2,0,0,13,2,2],[2,2,27,0,0,27,0,0,0,2,0,9,0,2,2],[2,2,2,0,2,2,2,0,0,2,2,10,2,2,2],[2,2,0,0,0,0,2,0,0,0,0,9,0,2,2],[2,2,0,0,0,0,2,0,0,0,0,0,0,2,2],[2,2,0,0,0,0,2,0,0,0,0,0,0,2,2],[2,2,0,0,0,0,0,0,0,0,0,0,0,2,2],[2,2,27,0,0,0,2,0,0,0,0,0,14,2,2],[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]],
              [[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],[2,2,0,0,0,2,0,0,0,0,0,2,2,2,2],[2,2,0,0,9,10,9,0,0,0,0,0,2,2,2],[2,2,0,0,0,2,0,0,0,0,0,0,15,2,2],[2,2,0,0,0,2,2,0,0,0,0,0,0,2,2],[2,2,0,9,0,0,2,0,0,0,0,0,0,2,2],[2,2,2,10,2,2,2,2,2,2,2,2,2,2,2],[2,2,0,9,0,0,0,25,26,2,0,0,0,2,2],[2,2,0,0,0,0,0,0,22,2,0,0,16,2,2],[2,2,27,0,0,0,0,0,0,2,0,2,2,2,2],[2,2,0,0,0,0,27,0,0,0,0,20,21,2,2],[2,2,0,0,0,0,0,0,0,2,0,2,2,2,2],[2,2,0,0,0,0,0,0,0,2,0,0,17,2,2],[2,2,0,0,0,0,0,27,28,2,0,0,0,2,2],[2,2,0,0,0,0,0,2,2,2,2,2,2,2,2],[2,2,0,0,0,0,2,2,0,0,0,0,0,2,2],[2,2,0,0,0,2,2,0,0,0,0,0,0,2,2],[2,2,0,27,0,19,0,0,0,0,0,0,18,2,2],[2,2,0,0,0,2,0,0,0,0,0,0,2,2,2],[2,2,0,0,0,2,0,0,0,0,0,2,2,2,2],[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]]
             ];
const MAP_SIZES = [[23,10],[23,15],[21,15]];
const TILE_EMOJI = ['','🌲','🧱','📿','💎','🧰','','🤴','🔑','','🔒','⬆️','⬆️','⬆️','⬆️','⬇️','⬇️','⬇️','⬇️','🧱','','🗄️','⛳','🏰','🚪','🏸','🏹','🪑','🛏️'];
const GLIMPSE_MSGS = ["","","","You notice something shiny in the ground as you pass by.","You notice something shiny in the ground as you pass by.","You notice a toolbox on the ground as you pass by.","You pass by a young man who seems to be in some distress.","","You see a bunch of keys on the wall as you pass by.","You notice a door in the wall as you pass by. It seems firmly locked. (What's that? You're wondering how you figured that out just by looking at it? Uhh, magic.)","","","","","","","","","","You find a secret button underneath a lamp-holder on the wall. A panel in the wall swivels as you press it, allowing you to step through the false wall.","You notice a chest sitting in an alcove as you pass by.","","You notice an assortment of golf equipment as you pass by.","","","You notice an assortment of rackets and other sports equipment as you pass by.","You notice an assortment of archery equipment as you pass by.","",""];
const VIEW_MSGS = ["","","","You notice something shiny on the ground. Looking closer, you see it appears to be a heart-shaped ornament of some kind half-buried in the ground.","You notice something shiny on the ground. Looking closer, you see it appears to be a precious gem of some kind half-buried in the ground.","There's a toolbox on the ground here. You look into it and find it contains all manners of useful equipment for gardening and general grounds maintenance.","There's a young man nearby who seems to be in some distress. Upon closer inspection, you realize he's probably a member of the royal family here and hastily make a proper greeting.</p><p> \"What shall I do?\" he snivels, seemingly unbothered by your previous lack of manners. \"I've lost my locket! It was gifted to me by my dear mother, and I've gone and lost it, like I always do... the last time I remember having it, I was sitting in the grove north of here and enjoying the weather. But that field is so wide, how will I know where to start looking?\"","","There's a bunch of keys hanging from the wall here. It looks like they're used to unlock doors in the castle.","There's a door in the wall here. You try it, but it seems locked.","","You climb up the stairs.","You climb up the stairs.","You climb up the stairs.","You climb up the stairs.","You climb down the stairs.","You climb down the stairs.","You climb down the stairs.","You climb down the stairs.","You find a secret button underneath a lamp-holder on the wall. A panel in the wall swivels as you press it, allowing you to step into the false wall.","There's a chest sitting in an alcove in front of you. It appears to be unlocked, but it looks a bit stuck, as if you'll need a lever of some kind to pry it open.</p><p>There's also a CROWBAR on the floor here. How convenient! I think.","","There's an assortment of golfing equipment next to the wall here. A bag labelled 'Ann Achronism' hangs from the wall, with a selection of sturdy clubs poking out from it.","You step into the castle. It's a pretty regal affair. You hear the vague sound of self-pitying sniffling coming from the west.","You step out of the castle, into the sunlight.","There's a set of rackets sitting atop a chest of drawers next to the wall. Looking in the drawers, you find some projectiles meant for use with the aforementioned rackets.","There's a bunch of archery equipment here, including several finely-made bows and a quiver full of arrows.","",""];
const WARP_FROM = ['0/8/2',  '1/2/12','1/9/12','1/13/12','1/20/12','1/11/14','2/4/12','2/9/12','2/13/12','2/18/12'];
const WARP_TO =   [[1,11,13],[2,4,11],[2,9,11],[2,13,11],[2,18,11],[0,8,3],  [1,2,11],[1,9,11],[1,13,11],[1,20,11]];

const directions = [[0,-1],[1,0],[0,1],[-1,0]];
const dir_word = ['WEST', 'SOUTH', 'EAST', 'NORTH'];

// Some states.
// locket and gem: buried, dug up (after USE SPADE), or taken (after TAKE HEART/DIAMOND)
const ITEM_BURIED = 0;
const ITEM_FOUND = 1;
const ITEM_TAKEN = 2;
var locket_state = ITEM_BURIED;
var gem_state = ITEM_BURIED;
// prince: initial, happy (after USE HEART)
const PRINCE_SAD = 0;
const PRINCE_HAPPY = 1;
var prince_state = PRINCE_SAD;
// Has the item moved from its original position?
var items_moved = [0, 0, 0, 0];
// Has the user found the secret passage?
var secret_passage_found = +localStorage.getItem("mapSecretPassageFound");

// Some IDs for convenience.
const LOCKET_ID = 3;
const GEM_ID = 4;
const SPADE_ID = 5;
const TALK_PRINCE_ID = 6;
const OPEN_CHEST_ID = 20;
const GOLF_ID = 22;
const ITEM_NAMES = ['GOLF CLUB', 'SHINY DIAMOND', 'HEART LOCKET', 'GARDEN SPADE'];

var actions_left = [];
var [player_row, player_col, player_map] = [20,7,0];
var item_locs = [[2,9,8],[0,5,5],[0,4,6],[0,5,3]];
var inventory = [0,0,0,0];

// Listener for card playing.
function clickMapHandListener(ev) {
    const x = ev.target.cellIndex;
    if (x === undefined) return;
    var card = actions_left[x];
    var turn_header = `You attempted to play <b>${getCardStringFromNum(card)}</b>.`;
    mapMessage(turn_header);
    // Only lose card on successful action.
    if (mapPlayCard(card)) {
        actions_left.splice(x, 1);
    }
    renderOneHand('locked-hand-2', 2, actions_left);
}

function mapPlayCard(card) {
    var success = true;
    var val = valOf(card) + 1;
    var suit = suitOf(card);
    if (val == 11) {
        success = take(suit);
    } else if (val == 12) {
        success = drop(suit);
    } else if (val == 13) {
        success = use(suit);
    } else {
        success = move(suit, val);
    }
    return success;
}

function inb(r, c, m) {
    const R = MAP_SIZES[m][0];
    const C = MAP_SIZES[m][1];
    return 0 <= r && r < R && 0 <= c && c < C;
}

function blocked(r, c, m) {
    var pix = MAPS[m][r][c];
    if (pix == 19) return secret_passage_found < 1;
    return [1, 2, 7, 10, 21, 27, 28].indexOf(pix) > -1;
}

// CDHS = 0123 = WSEN
function viable(d, steps) {
    var [r,c,m] = [player_row, player_col, player_map];
    for (var i = 1; i <= steps; i++) {
        [r, c] = [r+directions[d][0], c+directions[d][1]];
        if (!inb(r, c, m) || blocked(r, c, m)) {
            return false;
        }
    }
    return true;
}        

function move(d, steps) {
    if (!viable(d, steps)) {
        mapMessage("There's something blocking that path!");
        return false;
    }
    var msgs = [];
    for (var i = 0; i < steps; i++) {
        [player_row, player_col] = [player_row+directions[d][0], player_col+directions[d][1]];
        msgs.push(`You move to the ${dir_word[d]}.`);
        // Don't give a glimpse on the last step, since we give the full view.
        if (i < steps - 1) {
            var glimpse_msg = glimpse(player_row, player_col, player_map);
            if (glimpse_msg) msgs.push(glimpse_msg);
        }
        for (var suit = 0; suit < 4; suit++) {
            if (items_moved[suit] && item_locs[suit][0] == player_map && item_locs[suit][1] == player_row && item_locs[suit][2] == player_col) {
                msgs.push(`You see a ${ITEM_NAMES[suit]} on the ground` + (i < steps - 1 ? "as you pass by." : "."));
            }
        }
    }
    msgs.push(view(player_row, player_col, player_map));
    sendCondensedMapMessages(msgs);
    possibly_warp(player_row, player_col, player_map);
    renderGrid();
    return true;
}

function possibly_warp(r, c, m) {
    var cstr = [m, r, c].join('/');
    var warp_index = WARP_FROM.indexOf(cstr);
    if (warp_index > -1) {
        var [mp, rp, cp] = WARP_TO[warp_index];
        player_row = rp;
        player_col = cp;
        player_map = mp;
    }
}

function renderInventory() {
    const inv_slots = document.getElementById("inventory-row");
    for (var i = 0; i < 4; i++) {
        if (inventory[i]) {
            inv_slots.children[i].innerHTML = SUIT_SYMBOLS[i];
        } else {
            inv_slots.children[i].innerHTML = "-";
        }
    }
}    

function take(d) {
    var state_ok = true;
    if ((d == DIAMOND_SUIT && gem_state < ITEM_FOUND) || (d == HEART_SUIT && locket_state < ITEM_FOUND)) state_ok = false;
    if (state_ok && item_locs[d][0] == player_map && item_locs[d][1] == player_row && item_locs[d][2] == player_col) {
        item_locs[d] = [-1,-1,-1];
        mapMessage(`You pick up the ${ITEM_NAMES[d]}.`);
        inventory[d] = 1;
        renderInventory();
        if (d == DIAMOND_SUIT && gem_state == ITEM_FOUND) {
            gem_state = ITEM_TAKEN;
        }
        if (d == HEART_SUIT && locket_state == ITEM_FOUND) {
            locket_state = ITEM_TAKEN;
        }
        items_moved[d] = 1;
        return true;
    }
    mapMessage("You don't see anything of the sort to pick up.");
    return false;
}

function drop(d) {
    if (inventory[d] == 0) {
        if (d == HEART_SUIT) {
            mapMessage("You don't have a heart to drop. Your heart drops.");
        } else {
            mapMessage("You don't have anything of that kind to drop.");
        }
        return false;
    }
    mapMessage(`You drop your ${ITEM_NAMES[d]}.`);
    item_locs[d] = [player_map, player_row, player_col];
    inventory[d] = 0;
    renderInventory();
    return true;
}

// Fuck it, I'm just gonna hard code all the events in this function
function use(d) {
    var e = MAPS[player_map][player_row][player_col];
    if (inventory[d] == 0) {
        mapMessage("You don't have anything of that kind to use.");
        return false;
    }
    if (d == DIAMOND_SUIT) {
        mapMessage("You take out the diamond and look at it. I don't know, it doesn't seem that useful to me.");
    } else if (d == HEART_SUIT) {
        if (e == TALK_PRINCE_ID) {
            mapMessage("The prince gasps. \"This is it! My mother's locket! How can I repay your kindness?\", he asks.");
            mapMessage("Huh, this is some royalist propaganda, you think, but you mention the key piece you're looking " +
                        "for. \"Ah, that sounds familiar! You can find it in my <b>personal chest of belongings</b> upstairs. " +
                        "You'll have to pass through the secret entrance in the southern wing to get there, though; go up the stairs " +
                        "and go straight and it's right in front of you. There's a button under a lamp that triggers the hinges.\" " +
                        "Wow, he turned out surprisingly and conveniently loose-lipped.");
            prince_state = PRINCE_HAPPY;
            inventory[HEART_SUIT] = 0;
            secret_passage_found = 1;
            localStorage.setItem("mapSecretPassageFound", 1);
            renderInventory();
        } else {
            mapMessage("You take out the HEART LOCKET and inspect it. It contains a photo of a young woman cradling a baby boy, " +
                       "and on the other side&mdash;quite inexplicably&mdash;the words \"bingle my beloved\" written in Arial.");
        }
    } else if (d == SPADE_SUIT) {
        if (e == GEM_ID) {
            mapMessage("You dig in the earth a bit with your GARDEN SPADE. You dig up a SHINY DIAMOND; looks like this was " +
                       "where the sparkle you noticed earlier came from.");
            mapMessage("There's a SHINY DIAMOND lying in the ground here.");
            gem_state = ITEM_FOUND;
        } else if (e == LOCKET_ID) {
            mapMessage("You dig in the earth a bit with your GARDEN SPADE. You dig up a HEART LOCKET; looks like this was " +
                       "where the sparkle you noticed earlier came from.");
            mapMessage("There's a HEART LOCKET lying in the ground here.");
            locket_state = ITEM_FOUND;
        } else if (e == OPEN_CHEST_ID) {
            mapMessage("Okay, I'm pretty sure this is an impossible state. How did you do this? The spade breaks because I said so.");
            inventory[3] = 0;
            renderInventory();
        } else if (e == TALK_PRINCE_ID) {
            mapMessage("Please do not spade the prince.");
            return false;
        } else if (player_map == 0) {
            mapMessage("You dig around in the earth bit, but don't find anything. Great, now someone's going to have to clean up " +
                       "this mess, and it sure won't be you. What, do you have an Antiking of Spades? Yeah, didn't think so. Hope " +
                       "you're pleased with yourself.");
        } else {
            mapMessage("You swing your GARDEN SPADE at the stone floor of the castle. It leaves a chip. Why did you think that was a " +
                       "good idea? Better hope no one notices.");
        }
    } else if (d == CLUB_SUIT) {
        if (e == OPEN_CHEST_ID) {
            mapMessage("It takes a bit of doing, but you lever the top of the chest open. Inside you find riches untold, but more " +
                       "importantly, a golden compass! You'll never lose your way now!");
            completeQuest(2);
        } else if (e == GOLF_ID) {
            mapMessage("You play a few holes on the mini-golf course. You're pretty subpar.");
        }
    }
    return true;
}

function mapMessage(msg) {
    const map_log = document.getElementById("map-log");
    map_log.innerHTML += `<p>${msg}</p>`;
    map_log.scrollTop = map_log.scrollHeight;
}

function sendCondensedMapMessages(msgs) {
    var curr = msgs[0];
    var compiled_message;
    var count = 1;
    for (var i = 1; i < msgs.length; i++) {
        if (msgs[i] == curr) count++;
        else {
            compiled_message = count > 1 ? `${curr} (&times;${count})` : curr;
            mapMessage(compiled_message);
            curr = msgs[i];
            count = 1;
        }
    }
    compiled_message = count > 1 ? `${curr} (&times;${count})` : curr;
    mapMessage(compiled_message);
}

// shorter message when passing by.
function glimpse(r, c, m) {
    var e = MAPS[m][r][c];
    if (e == SPADE_ID && (item_locs[3][0] != m || item_locs[3][1] != r || item_locs[3][2] != c)) {
        return "There's a toolbox on the ground here. As you pass by notice that someone seems to " +
               "have stolen the poor gardener's spade. Oh wait, that was you.";
    }
    if (e == LOCKET_ID && (item_locs[2][0] != m || item_locs[2][1] != r || item_locs[2][2] != c) && locket_state == ITEM_TAKEN) {
        return "You see an unsightly hole in the ground as you pass by.";
    }
    if (e == GEM_ID && (item_locs[1][0] != m || item_locs[1][1] != r || item_locs[1][2] != c) && gem_state == ITEM_TAKEN) {
        return "You see an unsightly hole in the ground as you pass by.";
    }
    return GLIMPSE_MSGS[e];
}

// longer message when there.
function view(r, c, m) {
    const area_name = ['a forest', 'a castle', 'the upper floor of a castle'][m]; // sue me
    document.getElementById('map-description').innerHTML = `You are currently in ${area_name}.`;
    var e = MAPS[m][r][c];
    // Some special cases.
    if (e == SPADE_ID && (item_locs[3][0] != m || item_locs[3][1] != r || item_locs[3][2] != c)) {
        return "There's a toolbox on the ground here. You look into it and find that someone seems to " +
               "have stolen the poor gardener's spade. Oh wait, that was you.</p><p>You begin to feel " +
               "guilt as you stand and ruminate your actions... better get going!";
    }
    if (e == LOCKET_ID && (item_locs[2][0] != m || item_locs[2][1] != r || item_locs[2][2] != c) && locket_state == ITEM_TAKEN) {
        return "There's an unsightly hole in the ground here.";
    }
    if (e == GEM_ID && (item_locs[1][0] != m || item_locs[1][1] != r || item_locs[1][2] != c) && gem_state == ITEM_TAKEN) {
        return "There's an unsightly hole in the ground here.";
    }
    return VIEW_MSGS[e];
}

function renderGrid() {
    document.getElementById('map').innerHTML = '';
    var table = document.createElement('table');
    table.id = 'text-map';
    document.getElementById('map').appendChild(table);
    var tbody = document.createElement('tbody');
    table.appendChild(tbody);
    var up_limit = player_row - 4;
    var down_limit = player_row + 4;
    if (up_limit < 0) {
        down_limit += (0 - up_limit);
        up_limit = 0;
    }
    if (down_limit >= MAP_SIZES[player_map][0]) {
        up_limit -= (down_limit - MAP_SIZES[player_map][0] + 1);
        down_limit = MAP_SIZES[player_map][0] - 1;
    }
    var left_limit = player_col - 4;
    var right_limit = player_col + 4;
    if (left_limit < 0) {
        right_limit += (0 - left_limit);
        left_limit = 0;
    }
    if (right_limit >= MAP_SIZES[player_map][1]) {
        left_limit -= (right_limit - MAP_SIZES[player_map][1] + 1);
        right_limit = MAP_SIZES[player_map][1] - 1;
    }
    
    for (var i = up_limit; i <= down_limit; i++) {
        var tr = document.createElement('tr');
        tbody.appendChild(tr);
        for (var j = left_limit; j <= right_limit; j++) {
            var td = document.createElement('td');
            
            // find what r and c are for this tile
            td.innerHTML = getEmojiForTile(i, j);
            tr.appendChild(td);
            if (player_map < 1) {
                td.style.backgroundColor = 'rgb(208,243,160)';
            } else {
                td.style.backgroundColor = 'rgb(220,220,220)';
            }
        }
    }
}

function getEmojiForTile(r, c) {
    if (r == player_row && c == player_col) {
        return '🧍‍♂️';
    }
    var e = MAPS[player_map][r][c];
    if (e == SPADE_ID) {
        
    }
    if (e == LOCKET_ID) {
        return ['✨','📿','🕳️'][locket_state];
    }
    if (e == GEM_ID) {
        return ['✨','💎','🕳️'][gem_state];
    }
    return TILE_EMOJI[e];
}
