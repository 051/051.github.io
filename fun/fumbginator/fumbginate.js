const fumbgyInput = document.getElementById("fumbgy-input");
const fumbgyOutput = document.getElementById("fumbgy-output");
const fumbgyButton = document.getElementById("fumbginator-button");

fumbgyInput.addEventListener("keyup", function(event) {
	if (event.keyCode === 13) {
		event.preventDefault();
		fumbgyButton.click();
	}
});

var fumbgyCount = 0;

function fumbginate() {
	
	if (fumbgyInput.value.toLowerCase() == "fumbgy") {
		fumbgyOutput.innerHTML = "Your word is already fumbgy enough!";
		return;
	}
	fumbgyCount++;
	var output = "Your fumbginated word is: <br/><font size=\"40px\">Fumbgy</font>";
	if (fumbgyCount > 10) {
		output += "<br/>Stop trying to change your fate.";
	}
	fumbgyOutput.innerHTML = output;		
}
