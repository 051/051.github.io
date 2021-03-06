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

function check(str, h) {
	if (str.length > 0) {
		if (hash(str) === h) {
			document.getElementById("yes").innerHTML=
				"<font color='green'><h3>✅ Solved!</h3>The answer was <strong>"
				+ document.getElementById("checker").value.replace(/[^a-zA-Z ]/gi, "").toUpperCase()
				+ "</strong>.";
		} else {
			document.getElementById("yes").innerHTML=
				"<font color='#B00000'><h3>❌ Incorrect!</h3><strong>"
				+ document.getElementById("checker").value.replace(/[^a-zA-Z ]/gi, "").toUpperCase()
				+ "</strong> was not the answer.</font>";
		}
	}
}