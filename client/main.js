Meteor.startup(function() {

	WebFontConfig = {
		google: { families: [ 'Open+Sans:400,700:latin,latin-ext', 'Raleway:400,700'] }
	};
	(function() {
		var wf = document.createElement('script');
		wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
			'://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
		wf.type = 'text/javascript';
		wf.async = 'true';
		var s = document.getElementsByTagName('script')[0];
		s.parentNode.insertBefore(wf, s);
		//console.log("async fonts loaded", WebFontConfig);
	})();

});

$( document ).ready(function() {
});

Template.registerHelper('equals', function (a, b) {
	return a === b;
});

Template.registerHelper('lessThan', function (a, b) {
	return a < b;
});

Template.main.helpers({
	whichView: function() {
		return Session.get('currentView');
	}
});

Template.main.events({
	'click button.btn-tooltip': function (event) {
		showInfoMessage($(event.target).attr('data-tooltip'));
	},
});

function getInt(name) {
	var value = parseInt($('#'+name).val());
	if (!value || value <= 0)
		value = 100;
	return value;
}

function getBool(name) {
	var value = false;
	if ($('#'+name).is(':checked'))
		value = true;
	return value;
}

function getString(name) {
	var value = $('#'+name).val();
	return value;
}

Template.startmenu.helpers({
	numGood: function () {
		var value = Session.get('numGood');
		return value ? value : 2;
	},
	numBad: function () {
		var value = Session.get('numBad');
		return value ? value : 1;
	},
	hasRedHerring: function () {
		var value = Session.get('hasRedHerring');
		if (value == null)
			value = false;
		return value;
	},
	isEvilWise: function () {
		var value = Session.get('isEvilWise');
		if (value == null)
			value = true;
		return value;
	},
	gotConspiracy: function () {
		var value = Session.get('gotConspiracy');
		if (value == null)
			value = true;
		return value;
	},
	preventAccidents: function () {
		var value = Session.get('preventAccidents');
		if (value == null)
			value = true;
		return value;
	},
	gameSet: function () {
		var value = Session.get('gameSet');
		//if (value == null)
		//	value = "Standard";
		return value;
	},
	gameSets: function () {
		return $.map(choiceSets, function(element,index) {return index});
	},
});

Template.startmenu.events({
	'click button#newgame': function () {
		var numGood = getInt('numGood');
		var numBad = getInt('numBad');
		var hasRedHerring = getBool('hasRedHerring');
		var isEvilWise = getBool('isEvilWise');
		var gotConspiracy = getBool('gotConspiracy');
		var preventAccidents = getBool('preventAccidents');
		var gameSet = getString('gameSet');
		var gameOptions = {
			numGood: numGood,
			numBad: numBad,
			hasRedHerring: hasRedHerring,
			isEvilWise: isEvilWise,
			gotConspiracy: gotConspiracy,
			gameSet: gameSet,
		};
		newGame(gameOptions);
		Session.set("currentView", "lobby");
		Session.set("numGood", numGood);
		Session.set("numBad", numBad);
		Session.set("hasRedHerring", hasRedHerring);
		Session.set("isEvilWise", isEvilWise);
		Session.set("gotConspiracy", gotConspiracy);
		Session.set("preventAccidents", preventAccidents);
		Session.set("gameSet", gameSet);
	}
});

Template.lobby.helpers({
	choices: function () {
		var choiceTable = [];
		choices.forEach(function(choice) {
			var choiceRow = "<tr>";
			choiceRow += "<td class='makeGuess' data-id='"+choice["id"]+"'>"+choice["name"]+"</td>";
			parameters.forEach(function(parameter) {
				choiceRow += "<td>"+choice[parameter.toLowerCase()]+"</td>";
			});
			choiceRow += "</tr>";
			choiceTable.push(choiceRow);
		});
		return choiceTable;
	},
	parameters: function () {
		return parameters;
	},
	players: function () {
		var players = Session.get('players');
		if (!players)
			return null;
		players = players || [];
		return _.map(players, function(value, index){
			return {value: value, index: index+1};
		});
	},
	correctChoice: function () {
		var value = Session.get('correctChoice');
		if (!value)
			return null;
		return choicesDict[value].name;
	},
	selectedHints: function () {
		var values = Session.get('selectedHints');
		if (!values)
			return null;
		var selectedHints = [];
		values.forEach(function(value) {
			selectedHints.push(hintsDict[value].desc);
		});
		return selectedHints;
	},
	redHerring: function () {
		var value = Session.get('redHerring');
		if (!value)
			return "N/A";
		return hintsDict[value].desc;
	}
});

Template.lobby.events({
	'click button': function () {//this must be before the specific buttons, otherwise messages may never appear (if they are cleared immediately)
		clearMessage();
	},
	'click button.leavegame.inlobby': leaveGame,
	'click button.secret.tapToShow': function (event) {
		if ($('button.secret.tapToHide').length > 0)
			return false;
		var content = $(event.target).attr('data-value');
		var index = $(event.target).html();
		$(event.target).html(content);
		$(event.target).attr('data-value', index);
		$(event.target).removeClass('tapToShow');
		$(event.target).addClass('tapToHide');
	},
	'click button.secret.tapToHide': function (event) {
		var index = $(event.target).attr('data-value');
		var content = $(event.target).html();
		$(event.target).html(index);
		$(event.target).attr('data-value', content);
		$(event.target).removeClass('tapToHide');
		$(event.target).addClass('tapToShow');

		if (Session.get('preventAccidents')) {
			$(event.target).addClass('disabled');
		}
	},
	'click td.makeGuess': function (event) {
		var guessId = $(event.target).attr('data-id');
		var correctChoice = Session.get('correctChoice');
		if (!correctChoice)
			return null;
		var infoMsg = choicesDict[guessId].name+" - ";
		if (guessId == correctChoice)
			infoMsg += "Right!";
		else
			infoMsg += "Wrong!";
		showInfoMessage(infoMsg);
	},
});

function leaveGame () {
	Session.set("currentView", "startmenu");
	Session.set("players", null);
	Session.set("correctChoice", null);
	Session.set("selectedHints", null);
	Session.set("redHerring", null);
}

function shuffleArray(array) {
	for (var i = array.length - 1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1));
			var temp = array[i];
			array[i] = array[j];
			array[j] = temp;
	}
	return array;
}

function showErrorMessage(msg) {
	FlashMessages.sendError(msg);
}

function showInfoMessage(msg) {
	FlashMessages.sendInfo(msg);
}

function clearMessage() {
	FlashMessages.clear();
}

Template.ruleBox.events({
	'click button#togglerules': function () {
		$('#ruleContent').toggle();
	},
});

Template.footer.helpers({
	versionNo: function () {
		return VERSION_NUMBER;
	}
});

/* deduce */

function newGame(gameOptions) {
	parameters = parameterSets[gameOptions.gameSet];

	choices = choiceSets[gameOptions.gameSet];
	choicesDict = {};
	choices.forEach(function(choice){
		choicesDict[choice.id] = choice;
	});

	hints = hintSets[gameOptions.gameSet];
	hintsDict = {};
	hints.forEach(function(hint){
		hintsDict[hint.id] = hint;
	});

	var randomisedStuff = null;
	while (randomisedStuff == null) {
		randomisedStuff = randomiseHints(gameOptions.gameSet);
	}

	var players = assignHints(gameOptions, randomisedStuff);
	Session.set("players", players);
}

function assignHints(gameOptions, randomisedStuff) {
	var numGood = gameOptions.numGood;
	var numBad = gameOptions.numBad;
	var hasRedHerring = gameOptions.hasRedHerring;
	var isEvilWise = gameOptions.isEvilWise;
	var gotConspiracy = gameOptions.gotConspiracy;
	var correctChoice = randomisedStuff.correctChoice;
	var selectedHints = randomisedStuff.correctHints;
	var redHerring = randomisedStuff.redHerring;
	var gameSet = randomisedStuff.gameSet;

	var numPlayers = numGood + numBad;
	if (hasRedHerring) {
		selectedHints.push(redHerring);
	} else {
		redHerring = null;
	}
	Session.set("selectedHints", selectedHints);
	Session.set("redHerring", redHerring);
	Session.set("correctChoice", correctChoice);

	var evilPlayerNos = [];
	while (evilPlayerNos.length < numBad) {
		var randNo = getRandNo(numPlayers);
		if ($.inArray(randNo, evilPlayerNos) < 0) {
			evilPlayerNos.push(randNo);
		}
	}

	var players = new Array(numPlayers);

	var factor = Math.floor(selectedHints.length / numPlayers);
	var poolOfHints = selectedHints; //duplicate by factor
	poolOfHints.forEach(function(thisHint) {
		var randNo = getRandNo(numPlayers);
		while ($.inArray(randNo, evilPlayerNos) >= 0) {
			randNo = getRandNo(numPlayers);
		}
		if (players[randNo] == null)
			players[randNo] = [];
		players[randNo].push(hintsDict[thisHint].desc+" ");
	});

	var evilInfo = "";
	var evilPlayersInfo = "";
	if (isEvilWise) {
		evilInfo = "The correct answer is " + choicesDict[correctChoice].name + ".";
	} else {
		evilInfo = "You know nothing.";
	}
	if (gotConspiracy) {
		var evilPlayerNosDisplay = _.map(evilPlayerNos, function(value, index){
			return value+1;
		});
		evilPlayerNosDisplay.sort();
		evilPlayersInfo = " The evil players are numbered " + evilPlayerNosDisplay.join(', ') + ".";
	}
	var evilMessage = ["You are evil. " + evilInfo + evilPlayersInfo];
	// evilPlayerNos.forEach(function(thisPlayer) {
	// 	players[thisPlayer] = evilMessage;
	// });

	for (i=0;i<players.length;i++) {
		if ($.inArray(i, evilPlayerNos) >= 0) {
			players[i] = evilMessage;
		} else if (players[i] == null) {
			var thisHint = selectedHints[getRandNo(selectedHints.length)];
			players[i] = [hintsDict[thisHint].desc];
		} else {
			var tempArray = players[i].filter(function(item, pos, self) {
				return self.indexOf(item) == pos;
			});
			players[i] = shuffleArray(tempArray);
		}
	}

	// for (i=0;i<players.length;i++) {
	// 	console.log(players[i]);
	// }

	return players;
}

function getRandNo(length) {
	return Math.floor((Math.random() * length));
}

function randomiseHints(gameSet) {
	var theseChoices = Choices.find({'gameSet': gameSet}).fetch();
	var theseHints = Hints.find({'gameSet': gameSet}).fetch();

	var randChoiceNo = getRandNo(theseChoices.length);
	var correctChoiceFull = theseChoices[randChoiceNo];

	if (correctChoiceFull == null) {
		return 331;
	}

	var correctChoice = correctChoiceFull.id;

	var correctHints = [];
	var wrongHints = [];
	var correctHintsToHide = [];

	var currOverlap = [];
	theseChoices.forEach(function(thisChoice) {
		currOverlap.push(thisChoice.id);
	});

	theseHints = shuffleArray(theseHints);
	theseHints.forEach(function(thisHint) {
		if ($.inArray(correctChoice, thisHint.matches) >= 0) {
			var newOverlap = getIntersection(thisHint.matches, currOverlap);
			if (newOverlap.length < currOverlap.length) {
				correctHints.push(thisHint.id);
				currOverlap = newOverlap;
			} else {
				correctHintsToHide.push(thisHint.id);
			}
		} else {
			wrongHints.push(thisHint.id);
		}
	});

	var redHerring = wrongHints[getRandNo(wrongHints.length)];

	//console.log("choice: " + correctChoice + "; end result: " + currOverlap.toString() + "; correct hints: " + correctHints.toString() + "; wrong hints: " + wrongHints.toString() + "; hidden correct hints: " + correctHintsToHide.toString() + "; red herring: " + redHerring);

	if (currOverlap.length != 1)
		return null;

	return {
		correctChoice: correctChoice,
		correctHints: correctHints,
		redHerring: redHerring
	}; 
}

function getIntersection(array1, array2) {
	return array1.filter(function(n) {
		return array2.indexOf(n) != -1;
	});
}
