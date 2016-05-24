Meteor.startup(function () {
	// Delete all collections on startup
	Choices.remove({});
	Hints.remove({});
	initChoices();
});

function initChoices() {
	for (var key in choiceSets) {
		choiceSets[key].forEach(function(choice){
			choice.gameSet = key;
			Choices.insert(choice);
		});
	}

	for (var key in hintSets) {
		hintSets[key].forEach(function(hint){
			var hintQuery = hint.query;
			hintQuery["gameSet"] = key;
			var matches = Choices.find(hintQuery).fetch();
			var listy = [];
			matches.forEach(function(match) {
				listy.push(match.id);
			});
			hint.matches = listy;
			hint.query = null;
			hint.gameSet = key;
			Hints.insert(hint);
		});
	}
}
