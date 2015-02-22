var GLOBAL_CONFIG = {
	MAX_MAX_OPERAND: 30,
	MAX_MAX_TIME: 600
};

var config = {
	maxTime: 60,
	maxOperand: 10,
	operations: ['a', 's', 'm', 'd', 'q', 'sq']
};

var theGame;

var game = function () {

	var startTime,
		countCorrect,
		countWrong,
		wrongAnswers,
		thisN1,
		thisN2,
		thisOperation,
		liveTimer,
		gameState;
	
	var startGame = function() {
		$(".game-off").hide();
		$(".game-on").show();
		$("#txtAnswer").val('');
		gameState = 1;
		startTime = new Date();
		countCorrect = countWrong = 0;
		wrongAnswers = [];
		updateCountDisplay();
		startTimer();
		nextQuestion();
	};

	var init = function () {
		$(".game-on").hide();
		$(".game-off").show();
		gameState = 0;
	};

	var startTimer = function() {
		liveTimer = window.setTimeout (eachSecond, 1000);
	}

	var eachSecond = function() {
		// update the time on screen and check for max time done
		var remaining  = config.maxTime - Math.round (((new Date()) - startTime)  / 1000);
		updateBGColor (remaining);
		$("#showTime").html (getDisplayTime(remaining));
		if (remaining > 0) {
			liveTimer = window.setTimeout (eachSecond, 1000);	
		} else {
			endGame();
		}
	};

	var updateBGColor = function (remaining) {
		if (remaining < 10) {
			$(".keyboardrow div").css ("background-color", "yellow");
		}
		if (remaining < 3) {
			$(".keyboardrow div").css ("background-color", "#ff0000");	
		}
	};

	var nextQuestion = function() {
		$("#txtAnswer").val('');
		updateAnswerDisplay();
		thisOperation = _getOperation();
		_getQ ();
		showQuestion();
	};

	var showQuestion = function () {
		var q = getQuestionAsHtml (thisOperation, thisN1, thisN2);
		$("#question").html (q);
	};

	var endGame = function () {
		$(".game-off").show();		
		$(".game-on").hide();
		$(".keyboardrow div").css ("background-color", "#fff");
		gameState = 0;
		$("#dlgCorrectCount").html('' + countCorrect);
		$("#dlgWrongCount").html('' + countWrong);
		$("#reviewSection").hide();
		$("#modalResultsDlg").modal('show');
	};

	var handlekeyclick = function (k) {
		var last;
		if (gameState==0) { return; }
		if (k.match(/[0-9]/)) {
			last = $("#txtAnswer").val();
			if (last) {
				$("#txtAnswer").val (last + k);	
			} else {
				$("#txtAnswer").val (k);
			}
			updateAnswerDisplay();
		} else if (k === 'DEL') {
			last = $("#txtAnswer").val();
			if (last.length > 0) {
				$("#txtAnswer").val (last.substr(0,last.length-1));
			}
			updateAnswerDisplay();
		} else if (k === 'ANSWER') {
			last = $("#txtAnswer").val();
			handleAnswer(last);
		}
	};

	var handleAnswer = function (a) {
		var userSaid = parseInt(a);
		var answer = allOperations[thisOperation].getAnswer (thisN1, thisN2);
		if (userSaid == answer) {
			countCorrect++;
		} else {
			countWrong++;
			if (navigator && navigator.notification && navigator.notification.vibrate) {
				navigator.notification.vibrate(700);				
			}
			wrongAnswers.push ({
				operation: thisOperation, 
				n1: thisN1, 
				n2: thisN2, 
				userAnswer: userSaid, 
				correctAnswer: answer
			});
		}
		updateCountDisplay();
		nextQuestion();
	};

	var updateCountDisplay = function() {
		$('#countCorrect').html ("" + countCorrect);
		$('#countWrong').html ("" + countWrong);
	};

	var updateAnswerDisplay = function () {
		var last = $('#txtAnswer').val();
		$('#displayAnswer').html (last);
	};

	var _getQ = function () {
		allOperations[thisOperation].questionGenerator();
	};

	var _getQ_add = function () {
		thisN1 = Math.floor(Math.random () * config.maxOperand) + 1;
		thisN2 = Math.floor(Math.random () * config.maxOperand) + 1;
	};

	var _getQ_mult = _getQ_add;

	var _getQ_sub = function () {
		thisN1 = Math.floor(Math.random () * config.maxOperand) + 1;
		thisN2 = Math.floor(Math.random () * thisN1);		
	};

	var _getQ_div = function () {
		var tempAnswer = Math.floor(Math.random () * config.maxOperand) + 1;
		thisN2 = Math.floor(Math.random () * config.maxOperand) + 1;
		thisN1 = Math.floor(tempAnswer * thisN2);
	};

	var _getQ_sqrt = function () {
		var tempAnswer = Math.floor(Math.random () * config.maxOperand) + 1;
		thisN1 = tempAnswer * tempAnswer;
		thisN2 = undefined;
	};

	var _getQ_square = function () {
		thisN1 = Math.floor(Math.random () * config.maxOperand) + 1;
		thisN2 = undefined;
	};

	var _getOperation = function () {
		return config.operations[Math.floor(Math.random () * config.operations.length)];
	};

	var _getAnswer_add = function (x, y) {
		return x + y;
	};

	var _getAnswer_sub = function (x, y) {
		return x - y;
	};

	var _getAnswer_mult = function (x, y) {
		return x * y;
	};

	var _getAnswer_div = function (x, y) {
		return Math.floor(x / y);
	};

	var _getAnswer_sqrt = function (x) {
		return Math.floor (Math.sqrt(x));
	};

	var _getAnswer_square = function (x) {
		return x*x;
	};

	var allOperations = {
		a: {questionGenerator: _getQ_add, getAnswer: _getAnswer_add, name: "+"},
		s: {questionGenerator: _getQ_sub, getAnswer: _getAnswer_sub, name: "-"},
		m: {questionGenerator: _getQ_mult, getAnswer: _getAnswer_mult, name: "*"},
		d: {questionGenerator: _getQ_div, getAnswer: _getAnswer_div, name: "/"},
		q: {questionGenerator: _getQ_sqrt, getAnswer: _getAnswer_sqrt, name: "&radic;", prefixOp: true},
		sq: {questionGenerator: _getQ_square, getAnswer: _getAnswer_square, name: "<sup>2</sup>"}
	};

	var getQuestionAsHtml = function (operation, n1, n2) {
		var q = '';
		if (allOperations[operation].prefixOp) {
			q = allOperations[operation].name + "&nbsp;" + 
				n1 + "&nbsp;" + (n2 === undefined ? "" : "" + n2);
		} else {
			q = "" + n1 + "&nbsp;" + allOperations[operation].name + 
				"&nbsp;" + (n2 === undefined ? "" : "" + n2);
		}
		return q;
	};

	var getDisplayTime = function (secs) {
		var mins = Math.floor (secs / 60);
		var secs = secs % 60;
		if (secs > 9) {
			return '' + mins + ":" + secs;
		} else {
			return '' + mins + ":0" + secs;
		}
	};

	var getWrongAnswers = function () {
		console.log ("Get Wrong: " + JSON.stringify (wrongAnswers));		
		return wrongAnswers;
	};

	return {
		startGame: startGame,
		nextQuestion: nextQuestion,
		init: init,
		handlekeyclick: handlekeyclick,
		allOperations: allOperations,
		getWrongAnswers: getWrongAnswers,
		getQuestionAsHtml: getQuestionAsHtml
	};
};

var newGame = function() {
	theGame = new game();
	theGame.init();
	theGame.startGame();
};

var showOptionsDialog = function () {
	saveConfigToOptionsDialog();
	$("#optionsDlg").modal('show');	
};

var showAboutDialog = function () {
	$("#modalAboutDlg").modal('show');	
};

var showReviewDetails = function() {
	var wrongAnswers = theGame.getWrongAnswers();
	console.log ("Wrong in show rev details: " + JSON.stringify (wrongAnswers));
	$("#reviewSection").html (getWrongAnswersTable(wrongAnswers));
	$("#reviewSection").toggle(700);
};

var saveConfigToOptionsDialog = function () {
	$("#maxTime").val (config.maxTime);
	$("#maxOperand").val (config.maxOperand);
	$("input[name=rbOps]").each (function() {
		$(this).prop ('checked', jQuery.inArray($(this).val(), config.operations) > -1);
	});	
};

var saveOptionsDialogToConfig = function () {
	if (optionsAreValid()) {
		config.maxTime = $("#maxTime").val();
		config.maxOperand = $("#maxOperand").val ();
		config.operations=[];
		$("input[name=rbOps]:checked").each (function() {
			config.operations.push ($(this).val());
		});
		$("#optionsDlg").modal('hide');	
		return true;
	} else {
		alert ("Options are not valid.");
		return false;
	}
};

var optionsAreValid = function () {
	var maxTime = parseInt($("#maxTime").val());
	var maxOperand = parseInt ($("#maxOperand").val ());
	var theseOperations = [];
	$("input[name=rbOps]:checked").each (function() {
		theseOperations.push ($(this).val());
	});	
	return (maxTime > 0 && maxTime < GLOBAL_CONFIG.MAX_MAX_TIME &&
		maxOperand > 1 && maxOperand < GLOBAL_CONFIG.MAX_MAX_OPERAND &&
		theseOperations.join(';') !== '');
};

// Init page

function handlekeyclick (k) {
	if (theGame) {
		theGame.handlekeyclick(k);
	}
}

function fnKeyclick () {
	var thisId = $(this).attr("id");
	if (thisId) {
		handlekeyclick (thisId.split('_')[1]);
	}
}

var _wrongAnswersTableHeader = function () {
	return "<thead><tr><th>Problem</th><th>Correct Answer</th><th>Your Answer</th></tr></thead>";
};

var _wrongAnswerTemplate = function (answer) {
	return "<tr><td>" + theGame.getQuestionAsHtml (answer.operation, answer.n1, answer.n2) + 
		"</td><td>" + answer.correctAnswer + 
		"</td><td>" + (isNaN(answer.userAnswer) ? 'No Answer' : answer.userAnswer)  + "</td></tr>";
};

var _wrongAnswersTableBody = function (wrongAnswers) {
	var html = wrongAnswers.reduce (function(p,n) {return p + _wrongAnswerTemplate(n);}, '');
	return html;
};

function getWrongAnswersTable (wrongAnswers) {
	console.log ("Wrong in table: " + JSON.stringify (wrongAnswers));

	var html = "<table>";
	if (wrongAnswers) {
		html += _wrongAnswersTableHeader();
		html += _wrongAnswersTableBody (wrongAnswers);
	}
	html += "</table>";
	return html;
};

function isMobileDevice () {
	return (navigator && navigator.notification && navigator.notification.vibrate);
}

$(function() {
	var eventName = isMobileDevice() ? 'touchstart' : 'click';
	alert (eventName);
	$(".keyboardrow button[id]").on (eventName, fnKeyclick);
	FastClick.attach(document.body);
}) ();

