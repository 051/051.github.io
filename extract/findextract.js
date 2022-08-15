function solve() {
	const words = document.getElementById("answers").value.split(/[\s,]+/).map(ans => ans.toUpperCase());
	const target = document.getElementById("target").value.toUpperCase();
	const V = words.length + target.length;
	const AL = makeGraph(words, target);
	[count, matching] = doMatch(AL, V); // this feels illegal
	document.getElementById("output").innerHTML = generateOutput(words, target, V, count, matching);
}

function makeGraph(words, target) {
	// words on left, chars on right
	var AL = [];
	const v_left = words.length;
	const v_right = target.length;
	for (var u = 0; u < v_left; u++) {
		AL[u] = [];
		for (var v = 0; v < v_right; v++) {
			if (words[u].includes(target.charAt(v))) {
				AL[u].push(v_left + v);
			}
		}
	}
	return AL;
}

function doMatch(AL, V) {
	const v_left = AL.length;
	var match = [];
	for (i = 0; i < V; i++) match[i] = -1;
	var vis = [];
	var MCBM = 0;
	
	function aug(L) {
		if (vis[L]) return 0;
		vis[L] = 1;
		for (const R of AL[L]) {
			if ((match[R] == -1) || aug(match[R])) {
				match[R] = L;
				return 1;
			}
		}
		return 0;
	}
	
	for (var i = 0; i < v_left; i++) {
		vis = [];
		for (var j = 0; j < v_left; j++) vis[j] = 0;
		MCBM += aug(i);
	}
	
	return [MCBM, match];
}

function generateOutput(words, target, V, count, matching) {
	if (count < target.length) return "Cannot extract the desired target phrase.";
	var str = "";
	for (var i = words.length; i < V; i++) {
		var thisWord = words[matching[i]];
		var thisChar = target.charAt(i - words.length);
		var thisIdx = thisWord.indexOf(thisChar) + 1;
		str += (thisWord + "\t" + thisChar + "\t" + thisIdx + "\n");
	}
	return "Output:<br/><textarea class='small'>" + str + "</textarea>";
}
