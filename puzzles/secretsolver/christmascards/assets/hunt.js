/* SET UP LOCALSTORAGE */
if (!localStorage.getItem("completionState")) localStorage.setItem("completionState", "0".repeat(5));
if (!localStorage.getItem("deckState")) localStorage.setItem("deckState", "0".repeat(52));
if (!localStorage.getItem("storyComplete")) localStorage.setItem("storyComplete", "0");
if (!localStorage.getItem("tutorialComplete")) localStorage.setItem("tutorialComplete", "0");
if (!localStorage.getItem("metaUnlocked")) localStorage.setItem("metaUnlocked", "0");
if (!localStorage.getItem("metaComplete")) localStorage.setItem("metaComplete", "0");
if (!localStorage.getItem("mapSecretPassageFound")) localStorage.setItem("mapSecretPassageFound", "0");

function clearAllStorage() {
    var confirmClear = confirm("Are you sure you want to reset all your progress?");
    if (!confirmClear) return;
    localStorage.removeItem("completionState");
    localStorage.removeItem("deckState");
    localStorage.removeItem("storyComplete");
    localStorage.removeItem("tutorialComplete");
    localStorage.removeItem("metaUnlocked");
    localStorage.removeItem("metaComplete");
    localStorage.removeItem("mapSecretPassageFound");
    window.location.reload();
}

/* FAVICON */
var favicon = document.createElement('link');
favicon.rel = 'icon';
favicon.href = 'assets/favicon_' + Math.floor(Math.random() * 4) + '.svg';
document.head.appendChild(favicon);

/* GLOBAL LOOKUPS */
const PUZZLE_IDS = ["tut", "psa", "dung", "fight"];
const NUM_PUZZLES = PUZZLE_IDS.length; // basically the number of answer checkers to deploy
const HAND_LIMITS = [15, 8, 15, 13];
const NUM_STYLES = NUM_PUZZLES;
const CLEAR_STYLE_INDEX = 0;
const CARD_VALS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const SUIT_SYMBOLS = ['♣️','♦️','♥️','♠️'];
const [CLUB_SUIT, DIAMOND_SUIT, HEART_SUIT, SPADE_SUIT] = [0, 1, 2, 3];
const SUIT_NAMES = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];
const VALUE_NAMES = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'];
const TOGGLE_ON = true;
const TOGGLE_OFF = false;
const DECK_LIST_ELEMENT = document.getElementById("deck-list");
const SELECTOR_ROW_ELEMENT = document.getElementById("selector-row");
const NO_CARD_SELECTED = -1;
const META_ANSWER_HASH = 750942631;

/* TEXT UTILITY */
var deck_tutorial_visible;

function toggleVisibility(class_name, on) {
    if (on) {
        for (var el of document.getElementsByClassName(class_name)) el.style.display = '';
    } else {
        for (var el of document.getElementsByClassName(class_name)) el.style.display = 'none';
    }
}

function toggleDeckTutorial() {
    const deck_tutorial = document.getElementById("deck-tutorial");
    if (deck_tutorial_visible) deck_tutorial.style.display = 'none';
    else deck_tutorial.style = '';
    deck_tutorial_visible = !deck_tutorial_visible;
}

// Helper function for delaying the evaluation of template strings until they're populated.
function defer([first, ...rest]) {
    return (...vals) => rest.reduce((acc, str, i) => acc + vals[i] + str, first);
}

function hash(str) {
    var hash = 0;
    var trimmed = str
        .toLowerCase()
        .toString()
        .replace(/[^a-zA-Z]/gi, "");
    if (trimmed.length == 0) {
        return hash;
    }
    for (var i = 0; i < trimmed.length; i++) {
        var char = trimmed.charCodeAt(i);
        hash = (hash << 6) - hash + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
}

/* DECK HANDLING */
var assignment = []; for (i = 0; i < 52; i++) assignment[i] = 0;
var hands = [[], [], [], []];
var locked_hands = [[], [], [], []];
var focus_style = CLEAR_STYLE_INDEX;
loadDeckState();

/* DECK UTILITY */
function suitOf(card) {
    return card / 13 | 0;
}

function valOf(card) {
    return card % 13;
}

function targetAt(card) {
    var col = suitOf(card);
    var row = valOf(card);
    return DECK_LIST_ELEMENT.children[0].children[row].children[col];
}

function getCardStringFromNum(card) {
    return CARD_VALS[valOf(card)] + SUIT_SYMBOLS[suitOf(card)];
}

function getVerboseCardName(card) {
    return `${VALUE_NAMES[valOf(card)]} of ${SUIT_NAMES[suitOf(card)]}`;
}

/* DECK LIST FUNCTIONS */
SELECTOR_ROW_ELEMENT.addEventListener('click', (ev) => {
    const x = ev.target.cellIndex;
    if (x === undefined) return;
    if (ev.target.classList.contains("focus")) {
        focus_style = CLEAR_STYLE_INDEX; // nothing is selected.
        ev.target.classList.remove("focus");
        return;
    }
    for (sel of document.getElementsByClassName("sel-opt")) {
        sel.classList.remove("focus");
    }
    ev.target.classList.add("focus");
    focus_style = x + 1;
});

DECK_LIST_ELEMENT.addEventListener('click', (ev) => {
    const [x, y] = [ev.target.cellIndex, ev.target.parentElement.rowIndex];
    if (x === undefined || y === undefined || (x == 0 && y == 0)) return;
    const card_num = x * 13 + y;
    if (focus_style < 0 || focus_style > NUM_STYLES) return;
    if (focus_style == assignment[card_num] || focus_style == CLEAR_STYLE_INDEX) {
        ungroup(card_num);
    } else {
        if (focus_style > 0 && hands[focus_style-1].length >= HAND_LIMITS[focus_style-1]) return;
        group(card_num, focus_style);
    }    
});

function ungroup(card_num) {
    // clear visual assignment.
    for (var i = 1; i <= NUM_STYLES; i++) {
        targetAt(card_num).classList.remove("c" + i);
    }
    // clear from global assignment.
    assignment[card_num] = 0;
    // clear from hands.
    for (var h = 0; h < NUM_PUZZLES; h++) {
        if (hands[h].indexOf(card_num) > -1) {
            hands[h] = hands[h].filter(c => c != card_num);
            resetQuestCompletion(h);
        }
    }
    renderHandInfo();
    saveDeckState();
}

function group(card_num, group_num) {
    // deassign from other groups first.
    ungroup(card_num);
    // assign visually.
    targetAt(card_num).classList.add("c" + group_num);
    // assign in global assignment and hand.
    assignment[card_num] = group_num;
    hands[group_num-1].push(card_num);
    renderHandInfo();
    saveDeckState();
}

function clearGroups() {
    var confirmClear = confirm("Are you sure you want to clear ALL your hands?");
    if (!confirmClear) return;
    for (var i = 0; i < 52; i++) {
        ungroup(i);
    }
}

/* Updates all visible hand display information (quest page hands, deck hand info). */
function renderHandInfo() {
    var any_hands = false;
    for (var i = 0; i < NUM_PUZZLES; i++) {
        updateHandInfo(i);
        if (hands[i].length) {
            any_hands = true;
            hands[i].sort((a,b)=>a-b);
            renderOneHand('hand-' + i, i, hands[i]);
            toggleVisibility('no-cards-' + i, TOGGLE_OFF);
            toggleVisibility('some-cards-' + i, TOGGLE_ON);
            if (hands[i].length == HAND_LIMITS[i]) {
                toggleVisibility('all-cards-' + i, TOGGLE_ON);
                toggleVisibility('not-all-cards-' + i, TOGGLE_OFF);
            } else {
                toggleVisibility('all-cards-' + i, TOGGLE_OFF);
                toggleVisibility('not-all-cards-' + i, TOGGLE_ON);
            }
        } else {
            toggleVisibility('no-cards-' + i, TOGGLE_ON);
            toggleVisibility('some-cards-' + i, TOGGLE_OFF);
            toggleVisibility('all-cards-' + i, TOGGLE_OFF);
            toggleVisibility('not-all-cards-' + i, TOGGLE_ON);
        }
    }
    if (any_hands) {
        toggleVisibility('no-cards-global', TOGGLE_OFF);
        toggleVisibility('yes-cards-global', TOGGLE_ON);
    } else {
        toggleVisibility('no-cards-global', TOGGLE_ON);
        toggleVisibility('yes-cards-global', TOGGLE_OFF);
    }
}

function renderOneHand(element_id, associated_game_id, hand) {
    const tds_open = '<td class="c' + (associated_game_id + 1) + '">'
    const tds_close = '</td>';
    var tds_string = '';
    for (var card of hand) {
        tds_string += tds_open + getCardStringFromNum(card) + tds_close;
    }
    document.getElementById(element_id).innerHTML = '<table><tr>' + tds_string + '</tr></table>';
}

// Updates the hand information underneath the deck for a given hand.
function updateHandInfo(hand_num) {
    const hand_size = hands[hand_num].length;
    document.getElementById('hand-size-' + hand_num).innerHTML = hand_size;
    if (hand_size == HAND_LIMITS[hand_num]) {
        document.getElementById('hand-info-' + hand_num).classList.add('full');
    } else {
        document.getElementById('hand-info-' + hand_num).classList.remove('full');
    }
}

/* SAVE STATES */
function saveDeckState() {
    state_string = '';
    for (var i = 0; i < 52; i++) {
        if (!assignment[i]) state_string += '0';
        else state_string += assignment[i];
    }
    localStorage.setItem("deckState", state_string);
}

function loadDeckState() {
    const loaded_state = localStorage.getItem("deckState");
    for (var i = 0; i < 52; i++) {
        if (+loaded_state[i]) {
            group(i, +loaded_state[i]);
        }
    }
}

/* QUESTS */
var quest_statuses = [0, 0, 0, 0];
loadCompletionState();

const GAME_FUNCTIONS = [runTutorial,        // tutorial
                        runGradePuzzle,        // making the grade
                        runMapPuzzle,        // cardinal directions
                        runFightPuzzle];    // hand to hand combat
const CLEAR_GAME_STATE_FUNCTIONS = [clearTutorial,
                                    clearGradePuzzle,
                                    clearMapPuzzle,
                                    clearFightPuzzle];

function clearCompletionState() {
    quest_statuses = [0, 0, 0, 0];
    saveCompletionState();
}

function saveCompletionState() {
    state_string = '';
    for (var i = 0; i < NUM_PUZZLES; i++) {
        state_string += quest_statuses[i] ? '1' : '0';
    }
    localStorage.setItem("completionState", state_string);
}

function loadCompletionState() {
    const loaded_state = localStorage.getItem("completionState");
    for (var i = 0; i < NUM_PUZZLES; i++) {
        if (+loaded_state[i]) {
            quest_statuses[i] = 1;
        }
    }
    renderQuestCompletions();
}

// Generic game starting function.
function startGame(game_id) {
    toggleVisibility("game-window-" + game_id, TOGGLE_ON);
    toggleVisibility("start-" + game_id, TOGGLE_OFF);
    toggleVisibility("restart-" + game_id, TOGGLE_ON);
    locked_hands[game_id] = Array.from(hands[game_id]);
    renderOneHand("locked-hand-" + game_id, game_id, locked_hands[game_id]);
    GAME_FUNCTIONS[game_id](); // set up game-specific code
}

function restartGame(game_id) {
    CLEAR_GAME_STATE_FUNCTIONS[game_id]();
    startGame(game_id);
}

function renderQuestCompletions() {
    if (+localStorage.getItem("storyComplete")) toggleVisibility("post-story", TOGGLE_ON);
    var completions = 0;
    for (quest_num = 0; quest_num < NUM_PUZZLES; quest_num++) {
        if (quest_statuses[quest_num]) {
            toggleVisibility("quest-complete-" + quest_num, TOGGLE_ON);
            completions++;
        } else {
            toggleVisibility("quest-complete-" + quest_num, TOGGLE_OFF);
        }
    }
    if (completions == 4) localStorage.setItem("metaUnlocked", 1);
    if (+localStorage.getItem("tutorialComplete")) {
        toggleVisibility('pre-tut', TOGGLE_OFF);
        toggleVisibility('post-tut', TOGGLE_ON);
    }
    if (+localStorage.getItem("metaUnlocked")) {
        unlockMeta();
    }
    if (+localStorage.getItem("metaComplete")) {
        toggleVisibility('epi', TOGGLE_ON);
    }
}

function resetQuestCompletion(i) {
    if (!quest_statuses[i]) return;
    restartGame(i);
    toggleVisibility("restart-" + i, TOGGLE_OFF);
    toggleVisibility("start-" + i, TOGGLE_ON);
    toggleVisibility("game-window-" + i, TOGGLE_OFF);
    quest_statuses[i] = 0;
    saveCompletionState();
    renderQuestCompletions();
}

function completeQuest(i) {
    quest_statuses[i] = 1;
    saveCompletionState();
    renderQuestCompletions();
}

function unlockMeta() {
    toggleVisibility("meta", TOGGLE_ON);
    document.getElementById("meta-input").addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("meta-submit").click();
        }
    });
}

function finishStory() {
    toggleVisibility("post-story", TOGGLE_ON);
    localStorage.setItem("storyComplete", 1);
}

/* GAME START / CLEAR FUNCTIONS */

function runTutorial() {
    document.getElementById('locked-hand-0').addEventListener('click', clickTutorialHandListener);
    document.getElementById('tutorial-submission').addEventListener('click', clickTutorialSubmissionListener);
}

function clearTutorial() {
    locked_hands[0] = [];
    tutorial_submission = [];
    tutorial_level = 1;
    
    // Reset listeners.
    document.getElementById('locked-hand-0').removeEventListener('click', clickGradeHandListener);
    document.getElementById('tutorial-submission').removeEventListener('click', clickGradeSubmissionListener);
    
    // Reset visible things.
    toggleVisibility("tutorial-submit", TOGGLE_OFF);
    toggleVisibility("tutorial-results", TOGGLE_OFF);
    toggleVisibility("advance-tutorial-button", TOGGLE_OFF);
    renderOneHand('locked-hand-0', 0, locked_hands[0]);
    renderOneHand('tutorial-submission', 0, submission);
    for (var lvl = 2; lvl <= 5; lvl++) {
        toggleVisibility("tut-" + lvl, TOGGLE_OFF);
    }
    toggleVisibility("tut-1", TOGGLE_ON);
}

function runGradePuzzle() {
    collection = Array.from(locked_hands[1]);
    last_pass = [];
    document.getElementById('locked-hand-1').removeEventListener('click', clickGradeHandListener);
    document.getElementById('locked-hand-1').addEventListener('click', clickGradeHandListener);
    document.getElementById('psa-submission').removeEventListener('click', clickGradeSubmissionListener);
    document.getElementById('psa-submission').addEventListener('click', clickGradeSubmissionListener);
}

function clearGradePuzzle() {
    // Reset variables.
    locked_hands[1] = [];
    submission = [];
    current_grade_level = 1;
    
    // Reset listeners.
    document.getElementById('locked-hand-1').removeEventListener('click', clickGradeHandListener);
    document.getElementById('psa-submission').removeEventListener('click', clickGradeSubmissionListener);
    
    // Reset visible things.
    toggleVisibility("psa-grade-button", TOGGLE_OFF);
    toggleVisibility("psa-results", TOGGLE_OFF);
    toggleVisibility("advance-grade-button", TOGGLE_OFF);
    renderOneHand('locked-hand-1', 1, collection);
    renderOneHand('psa-submission', 1, submission);
}

function runMapPuzzle() {
    actions_left = Array.from(locked_hands[2]);
    renderOneHand("locked-hand-2", 2, locked_hands[2]);
    document.getElementById('locked-hand-2').removeEventListener('click', clickMapHandListener);
    document.getElementById('locked-hand-2').addEventListener('click', clickMapHandListener);
    renderGrid();
    renderInventory();
}

function clearMapPuzzle() {
    // Reset variables.
    actions_left = [];
    [player_row, player_col, player_map] = [20,7,0];
    item_locs = [[2,9,8],[0,5,5],[0,4,6],[0,5,3]];
    inventory = [0,0,0,0];
    locket_state = 0;
    gem_state = 0;
    prince_state = 0;
    items_moved = [0,0,0,0];
    
    // Reset visuals.
    document.getElementById('map-log').innerHTML = '';
    
    // Reset listeners.
    document.getElementById('locked-hand-2').removeEventListener('click', clickMapHandListener);
}

function runFightPuzzle() {
    current_fight_level = 1;
    // Load enemies and your own health.
    loadFightLevel();
}

function clearFightPuzzle() {
    // Reset variables.
    locked_hands[3] = [];
    resetPlayerState();
    current_enemies = [];
    
    // Reset visuals.
    document.getElementById('battle-log').innerHTML = '';
    toggleVisibility('restart-fight', TOGGLE_ON);
    toggleVisibility('next-fight', TOGGLE_OFF);
    
    // Reset listeners.
    document.getElementById('locked-hand-3').removeEventListener('click', clickFightHandListener);
}

// Meta
function submitMeta() {
    const input = document.getElementById("meta-input");
    const ans = input.value;
    if (hash(ans) == META_ANSWER_HASH) {
        localStorage.setItem("metaComplete", 1);
        renderQuestCompletions();
    } else {
        input.value = '';
        input.placeholder = 'Incorrect, try again!';
    }
}
