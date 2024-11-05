// MAKING THE GRADE
var collection = [];
var submission = [];
var current_grade_level = 1;
var last_pass = [];
// Check types.
const [NUM_EQ_CHECK, NUM_GTE_CHECK, TRUE_FALSE_CHECK, WD_CHECK] = [0, 1, 2, 3];
// Legibility states.
const [LEGIBILITY_PASS, NOT_A_WORD_FAIL, PICTURE_FRONT_FAIL] = [0, 1, 2];
// Check information.
const GRADE_CHECKS = {1: [[legibility, "legibility", WD_CHECK, LEGIBILITY_PASS], [textContent, "text content", NUM_GTE_CHECK, 6],
                          [organization, "organization", TRUE_FALSE_CHECK, true], [color, "color", NUM_EQ_CHECK, 1]],
                      
                      2: [[legibility, "legibility", WD_CHECK, LEGIBILITY_PASS], [organization, "organization", TRUE_FALSE_CHECK, true],
                          [extravagance, "extravagance", NUM_GTE_CHECK, 38], [familiarity, "familiarity", NUM_GTE_CHECK, 2]],
                      
                      3: [[legibility, "legibility", WD_CHECK, LEGIBILITY_PASS], [familiarity, "familiarity", NUM_GTE_CHECK, 5]]};
// Passing or failing string templates.
const PASS_PHRASES = [defer`Ah yes, its <b>${null}</b> value is exactly ${null}! Brilliant!`,
                      defer`Its <b>${null}</b> value is exactly ${null}! That was just what I was looking for!`,
                      defer`In terms of <b>${null}</b>, at least, it's absolutely perfect with its value of ${null}!`];
const FAIL_PHRASES = [defer`Hmm, its <b>${null}</b> value is ${null}... I was looking for something more like ${null}.`,
                      defer`Its <b>${null}</b> value is exactly ${null}... that's not great, ideally it would be ${null}.`];
const TF_PASS_PHRASES = [defer`Great! It passes its <b>${null}</b> check.`,
                         defer`Alright! It looks good to me in terms of <b>${null}</b>.`];
const TF_FAIL_PHRASES = [defer`Hmm, unfortunately I can't give it a pass on its <b>${null}</b> check.`,
                         defer`It could use some work in terms of <b>${null}</b>.`];
const GTE_PASS_PHRASES = [defer`Its <b>${null}</b> value is ${null}. I was looking for something at least ${null}, so that's great!`,
                         defer`Very nice, its <b>${null}</b> value of ${null} satisfies my expectation of ${null}.`];
const GTE_FAIL_PHRASES = [defer`Sadly, its <b>${null}</b> value of ${null} doesn't quite reach the ideal of at least ${null}.`,
                         defer`Its <b>${null}</b> value of ${null} is a bit low&mdash;I'd want it to be at least ${null}.`];
// Every enable1 word that can be formed in this game.
const LEGAL_WORDS = ['ACACIA', 'AAHED', 'ABACA', 'ABACI', 'ABIDE', 'ACHED', 'ADAGE', 'ADDED', 'AECIA', 'AGGIE', 'AHEAD', 'AIDED', 'AIDES', 'BAAED', 'BACCA', 'BADGE', 'BEACH', 'BEECH', 'BEIGE', 'BIALI', 'BICES', 'BIDED', 'BIDET', 'BIFID', 'BIKED', 'BIKIE', 'CACHE', 'CADGE', 'CAECA', 'CAGED', 'CEBID', 'CECAL', 'CEDED', 'CEIBA', 'CHAFE', 'CHAFF', 'CHIDE', 'CHIEF', 'CILIA', 'DACHA', 'DAGGA', 'DEBIT', 'DECAF', 'DEFOG', 'DEICE', 'DICED', 'DIDIE', 'EAGER', 'EBBED', 'ECHED', 'EDGED', 'EGGED', 'FACED', 'FACIA', 'FADED', 'FADGE', 'FECES', 'FICHE', 'FIDGE', 'FIFED', 'GADDI', 'GADID', 'GAFFE', 'GAGED', 'GELEE', 'GELID', 'GIBED', 'GIGHE', 'HABIT', 'HADED', 'HADJI', 'HAIRS', 'HAJJI', 'HEDGE', 'HEIGH', 'HEMIC', 'HIDED', 'IDEAS', 'JADED', 'JAGGY', 'JAGRA', 'JEHAD', 'JIBED', 'JIHAD'];
const GRADE_CARD_FUNCS = [s=>'A', s=>'B', s=>'C', s=>'D', s=>'E', s=>'F', s=>'G', s=>'H', s=>'I', s=>'J', s=>s, queen, king];

const TICK_PREFIX = '&#10004;&#65039; ';
const CROSS_PREFIX = '&#10060; ';

// Listener for card playing.
function clickGradeHandListener(ev) {
    if (submission.length == 5) return;
    const x = ev.target.cellIndex;
    if (x === undefined) return;
    submission.push(collection.splice(x, 1)[0]);
    collection.sort((a,b)=>a-b);
    renderOneHand('locked-hand-1', 1, collection);
    renderOneHand('psa-submission', 1, submission);
    if (submission.length == 5) {
        toggleVisibility("psa-grade-button", TOGGLE_ON);
    } else {
        toggleVisibility("psa-grade-button", TOGGLE_OFF);
        toggleVisibility("advance-grade-button", TOGGLE_OFF);
    }
}

// Listener for card unplaying.
function clickGradeSubmissionListener(ev) {
    const x = ev.target.cellIndex;
    if (x === undefined) return;
    collection.push(submission.splice(x, 1)[0]);
    collection.sort((a,b)=>a-b);
    renderOneHand('locked-hand-1', 1, collection);
    renderOneHand('psa-submission', 1, submission);
    toggleVisibility("psa-results", TOGGLE_OFF);
    if (submission.length == 5) {
        toggleVisibility("psa-grade-button", TOGGLE_ON);
    } else {
        toggleVisibility("psa-grade-button", TOGGLE_OFF);
        toggleVisibility("advance-grade-button", TOGGLE_OFF);
    }
}

function getSucceedString(check_tag, check_type, actual, target, calc_val) {
    var judgement_string;
    if (check_type == NUM_EQ_CHECK) {
        judgement_string = PASS_PHRASES[Math.floor(Math.random() * PASS_PHRASES.length)](check_tag, target);
    } else if (check_type == NUM_GTE_CHECK) {
        judgement_string = GTE_PASS_PHRASES[Math.floor(Math.random() * GTE_PASS_PHRASES.length)](check_tag, actual, target);
    } else if (check_type == TRUE_FALSE_CHECK) {
        judgement_string = TF_PASS_PHRASES[Math.floor(Math.random() * TF_PASS_PHRASES.length)](check_tag);
    } else if (check_type == WD_CHECK) {
        judgement_string = `Ah, I see it spells out ${calc_val}! That looks like a pass on <b>legibility</b> to me!`;
    }
    return TICK_PREFIX + judgement_string;
}

function getFailString(check_tag, check_type, actual, target, calc_val) {
    var judgement_string;
    if (check_type == NUM_EQ_CHECK) {
        judgement_string = FAIL_PHRASES[Math.floor(Math.random() * FAIL_PHRASES.length)](check_tag, actual, target);
    } else if (check_type == NUM_GTE_CHECK) {
        judgement_string = GTE_FAIL_PHRASES[Math.floor(Math.random() * GTE_FAIL_PHRASES.length)](check_tag, actual, target);
    } else if (check_type == TRUE_FALSE_CHECK) {
        judgement_string = TF_FAIL_PHRASES[Math.floor(Math.random() * TF_FAIL_PHRASES.length)](check_tag);
    } else if (check_type == WD_CHECK && actual == PICTURE_FRONT_FAIL) {
        judgement_string = `Unfortunately, starting your hand with a picture card isn't very good for <b>legibility</b>.`
    } else if (check_type == WD_CHECK && actual == NOT_A_WORD_FAIL) {
        judgement_string = `Hmm, looks like it says ${calc_val}... that can't be right! Sorry, I'll have to fail it on <b>legibility</b>.`;
    }
    return CROSS_PREFIX + judgement_string;
}

function legibility(hand) {
    var s = '';
    if (valOf(hand[0]) > 9) return [PICTURE_FRONT_FAIL, 0];
    for (var card of hand) s += GRADE_CARD_FUNCS[valOf(card)](s);
    if (LEGAL_WORDS.indexOf(s) >= 0) return [LEGIBILITY_PASS, s];
    return [NOT_A_WORD_FAIL, s];
}

function textContent(hand) {
    var [_, word] = legibility(hand)
    if (word) return [word.length, 0];
    return [0, 0];
}

function queen(s) {
    const c = s.slice(-1);
    return c == 'Z' ? 'A' : String.fromCharCode(c.charCodeAt() + 1);
}

function king(s) {
    var t = 0;
    for (var c of s) {
        t += c.charCodeAt() - 'A'.charCodeAt() + 1;
    }
    t = (t - 1) % 26;
    return String.fromCharCode(t + 'A'.charCodeAt());
}

function organization(hand) {
    for (var i = 0; i < hand.length - 1; i++) {
        if (hand[i] > hand[i+1]) return [false, 0];
    }
    return [true, 0];
}

function color(hand) {
    const KING_OF_CLUBS = 12;
    const ACE_OF_SPADES = 39;
    N = 0;
    for (var card of hand) {
        N <<= 1;
        if (card <= KING_OF_CLUBS || card >= ACE_OF_SPADES) {
            N += 1;
        }
    }
    return [N, 0];
}

function extravagance(hand) {
    t = 0;
    for (var card of hand) t += valOf(card) + 1 > 10 ? 10 : valOf(card) + 1;
    return [t, 0];
}

function familiarity(hand) {
    t = 0;
    for (var card of hand) t += last_pass.indexOf(card) >= 0;
    return [t, 0];
}

function gradeCollection() {
    var exactly_same = true;
    for (var i = 0; i < 5; i++) {
        if (last_pass[i] != submission[i]) exactly_same = false;
    }
    if (exactly_same) {
        document.getElementById("psa-results").innerHTML =
            '<article class="puzzle-box c2"><p>Hey, you can\'t submit the same submission twice!</p></article>';
    toggleVisibility("psa-results", TOGGLE_ON);
        return;
    }
    
    var [passed, judgements] = gradeLevel(submission, current_grade_level);
    document.getElementById("psa-results").innerHTML = buildFeedbackList(passed, judgements);
    toggleVisibility("psa-results", TOGGLE_ON);
    if (passed && current_grade_level < 3) {
        toggleVisibility("advance-grade-button", TOGGLE_ON);
    } else if (passed) {
        completeGradeGame();
    }
}

function gradeLevel(hand, level) {
    var judgements = [];
    var passed = true;
    for (var [check_function, check_tag, check_type, target] of GRADE_CHECKS[level]) {
        var [actual, calc_val] = check_function(hand);
        if (passedCheck(check_type, actual, target)) {
            judgements.push(getSucceedString(check_tag, check_type, actual, target, calc_val));
        } else {
            judgements.push(getFailString(check_tag, check_type, actual, target, calc_val));
            passed = false;
        }
    }
    return [passed, judgements];    
}

function passedCheck(check_type, actual, target) {
    if (check_type == NUM_GTE_CHECK) return actual >= target;
    else return actual == target;
}

function buildFeedbackList(passed, judgements) {
    const grader_preamble = '<article class="puzzle-box c2"><p>';
    const grader_postamble = '</p>'
    const passed_text = '<p>You passed!</p>';
    const end_postamble = '</article>';
    return grader_preamble + judgements.join('<br/>') + grader_postamble + (passed ? passed_text : '') + end_postamble;
}

function advanceGradeLevel() {
    current_grade_level++;
    document.getElementById("grade-stage").innerHTML = current_grade_level;
    last_pass = [];
    for (var card of submission) {
        collection.push(card);
        last_pass.push(card);
    }
    submission = [];
    collection.sort((a,b)=>a-b);
    renderOneHand('locked-hand-1', 1, collection);
    renderOneHand('psa-submission', 1, submission);
    toggleVisibility("psa-grade-button", TOGGLE_OFF);
    toggleVisibility("psa-results", TOGGLE_OFF);
    toggleVisibility("advance-grade-button", TOGGLE_OFF);
}

function completeGradeGame() {
    // Remove clickability. (It's easier.)
    document.getElementById('locked-hand-1').removeEventListener('click', clickGradeHandListener);
    document.getElementById('psa-submission').removeEventListener('click', clickGradeSubmissionListener);
    toggleVisibility("psa-grade-button", TOGGLE_OFF);
    quest_statuses[1] = 1;
    saveCompletionState();
    renderQuestCompletions();
}
