/* TUTORIAL!!!! */
var tutorial_level = 1;
const TUT_SUBMIT_LIMITS = [-1, 1, 1, 6, 2, 5];
var tutorial_submission = [];
const TUTORIAL_ANSWERS = [[], [26], [31], [32, 33, 36, 44, 45, 46], [3, 17], [9, 35, 37, 48, 50]];

// Listener for card playing.
function clickTutorialHandListener(ev) {
    if (tutorial_submission.length == TUT_SUBMIT_LIMITS[tutorial_level]) return;
    const x = ev.target.cellIndex;
    if (x === undefined) return;
    tutorial_submission.push(locked_hands[0].splice(x, 1)[0]);
    locked_hands[0].sort((a,b)=>a-b);
    renderOneHand('locked-hand-0', 0, locked_hands[0]);
    renderOneHand('tutorial-submission', 0, tutorial_submission);
    if (tutorial_submission.length == TUT_SUBMIT_LIMITS[tutorial_level]) {
        toggleVisibility("tutorial-submit", TOGGLE_ON);
    } else {
        toggleVisibility("tutorial-submit", TOGGLE_OFF);
        toggleVisibility("advance-tutorial-button", TOGGLE_OFF);
    }
}

// Listener for card unplaying.
function clickTutorialSubmissionListener(ev) {
    const x = ev.target.cellIndex;
    if (x === undefined) return;
    locked_hands[0].push(tutorial_submission.splice(x, 1)[0]);
    locked_hands[0].sort((a,b)=>a-b);
    renderOneHand('locked-hand-0', 0, locked_hands[0]);
    renderOneHand('tutorial-submission', 0, tutorial_submission);
    toggleVisibility("tutorial-results", TOGGLE_OFF);
    if (tutorial_submission.length == TUT_SUBMIT_LIMITS[tutorial_level]) {
        toggleVisibility("tutorial-submit", TOGGLE_ON);
    } else {
        toggleVisibility("tutorial-submit", TOGGLE_OFF);
        toggleVisibility("advance-tutorial-button", TOGGLE_OFF);
    }
}

function tutorialSubmit() {
    if (tutorial_submission.length != TUTORIAL_ANSWERS[tutorial_level].length) return;
    toggleVisibility("tutorial-results", TOGGLE_ON);
    const tutorial_judge = document.getElementById("tutorial-results");
    // Handle level 2 entirely separately.
    if (tutorial_level == 2) {
        respondToTutorialSubmission();
        return;
    }
    // Handle level 5 entirely separately.
    if (tutorial_level == 5) {
        checkFullHouse();
        return;
    }
    var solved = true;
    for (card of tutorial_submission) {
        if (TUTORIAL_ANSWERS[tutorial_level].indexOf(card) < 0) solved = false;
    }
    if (solved) {
        tutorialDisplay("Yes! That's exactly what I was looking for! Thank you so much!");
        completeTutorialLevel();
    } else {
        tutorialDisplay("Ahh, those cards don't seem like the right ones. Do you have any others?");
    }
}

function checkFullHouse() {
    if (tutorial_submission.map(valOf).filter(x=>x==9).length == 3
     && tutorial_submission.map(valOf).filter(x=>x==11).length == 2
     && tutorial_submission.map(suitOf).filter(x=>x==DIAMOND_SUIT).length == 0) {
        tutorialDisplay("Yes! That's exactly what I was looking for! Thank you so much!");
        completeTutorialLevel();
    } else {
        tutorialDisplay("Ahh, those cards don't seem like the right ones. Do you have any others?");
    }
}
        
function respondToTutorialSubmission() {
    if (tutorial_level != 2) return;
    toggleVisibility("tutorial-results", TOGGLE_ON);
    var card = tutorial_submission[0];
    const TRUE_CARD = 31;
    if (valOf(card) > valOf(TRUE_CARD) && suitOf(card) != suitOf(TRUE_CARD)) {
        tutorialDisplay("Ahh, I think that value's too high. Also, the suit doesn't seem right to me.");
    } else if (valOf(card) < valOf(TRUE_CARD) && suitOf(card) != suitOf(TRUE_CARD)) {
        tutorialDisplay("Ahh, I think that value's too low. Also, the suit doesn't seem right to me.");
    } else if (valOf(card) == valOf(TRUE_CARD) && suitOf(card) != suitOf(TRUE_CARD)) {
        tutorialDisplay("Oh, that value's absolutely right! The suit doesn't seem right to me, though...");
    } else if (valOf(card) > valOf(TRUE_CARD) && suitOf(card) == suitOf(TRUE_CARD)) {
        tutorialDisplay("Ahh, I think that value's too high. The suit seems like the right one though!");
    } else if (valOf(card) < valOf(TRUE_CARD) && suitOf(card) == suitOf(TRUE_CARD)) {
        tutorialDisplay("Ahh, I think that value's too low. The suit seems like the right one though!");
    } else if (valOf(card) == valOf(TRUE_CARD) && suitOf(card) == suitOf(TRUE_CARD)) {
        tutorialDisplay("Oh, that's it! The value's right and the suit is right too! Thank you so much!");
        completeTutorialLevel();
        return true;
    }
    return false;
}

function tutorialDisplay(msg) {
    const tutorial_judge = document.getElementById("tutorial-results");
    tutorial_judge.innerHTML = '<article class="puzzle-box c1"><p>' + msg + '</p></article>';
}

function completeTutorialLevel() {
    if (tutorial_level == 5) {
        completeTutorial();
        return;
    }
    toggleVisibility("advance-tutorial-button", TOGGLE_ON);
    return;
}

function advanceTutorialLevel() {
    toggleVisibility("advance-tutorial-button", TOGGLE_OFF);
    toggleVisibility("tutorial-submit", TOGGLE_OFF);
    toggleVisibility("tutorial-results", TOGGLE_OFF);
    toggleVisibility("tut-" + tutorial_level, TOGGLE_OFF);
    tutorial_level++;
    document.getElementById("tutorial-stage").innerHTML = tutorial_level;
    toggleVisibility("tut-" + tutorial_level, TOGGLE_ON);
    tutorial_submission = [];
    renderOneHand("tutorial-submission", 0, tutorial_submission);
}

function completeTutorial() {
    localStorage.setItem("tutorialComplete", "1");
    completeQuest(0);
}
