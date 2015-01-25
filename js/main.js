var GLOBAL_CONFIG = {
	MAX_MAX_OPERAND: 30,
	MAX_MAX_TIME: 600
};

var config = {
	maxTime: 60,
	maxOperand: 10,
	operations: ['a', 's', 'm']
};

var theGame;

var game = function () {

	var startTime,
		countCorrect,
		countWrong,
		thisN1,
		thisN2,
		thisOperation,
		//maxOperand = 12,
		liveTimer,
		gameState;
	
	var startGame = function() {
		$(".game-off").hide();
		$(".game-on").show();
		$("#txtAnswer").val('');
		gameState = 1;
		startTime = new Date();
		countCorrect = countWrong = 0;
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
		// update the time on screen and check for one minute done
		var remaining  = config.maxTime - Math.round (((new Date()) - startTime)  / 1000);
		updateBGColor (remaining);
		//$("#showTime").html ("0:" + remaining);
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
		//_getQ_mult ();
		showQuestion();
	};

	var showQuestion = function () {
		$("#n1").html ("" + thisN1);
		$("#n2").html ("" + thisN2);
		$("#operator").html (allOperations[thisOperation].name);
	}

	var endGame = function () {
		$(".game-off").show();		
		$(".game-on").hide();
		$(".keyboardrow div").css ("background-color", "#fff");
		gameState = 0;
		$("#dlgCorrectCount").html('' + countCorrect);
		$("#dlgWrongCount").html('' + countWrong);		
		$("#modalResultsDlg").modal('show');
	}

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
			countWrong++
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
		console.log (thisOperation);
		console.log (JSON.stringify (allOperations[thisOperation]));
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

	var allOperations = {
		a: {questionGenerator: _getQ_add, getAnswer: _getAnswer_add, name: "+"},
		s: {questionGenerator: _getQ_sub, getAnswer: _getAnswer_sub, name: "-"},
		m: {questionGenerator: _getQ_mult, getAnswer: _getAnswer_mult, name: "*"}
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

	return {
		startGame: startGame,
		nextQuestion: nextQuestion,
		init: init,
		handlekeyclick: handlekeyclick,
		allOperations: allOperations
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

var saveConfigToOptionsDialog = function () {
	$("#maxTime").val (config.maxTime);
	$("#maxOperand").val (config.maxOperand);
	//operations: ['a', 's', 'm']
};

var saveOptionsDialogToConfig = function () {
	if (optionsAreValid()) {
		config.maxTime = $("#maxTime").val();
		config.maxOperand = $("#maxOperand").val ();
		//operations: ['a', 's', 'm']		
		$("#optionsDlg").modal('hide');	
		return true;
	} else {
		alert ("Not valid - come on dude.");
		return false;
	}
};

var optionsAreValid = function () {
	var maxTime = parseInt($("#maxTime").val());
	var maxOperand = parseInt ($("#maxOperand").val ());
	return (maxTime > 0 && maxTime < GLOBAL_CONFIG.MAX_MAX_TIME &&
		maxOperand > 1 && maxOperand < GLOBAL_CONFIG.MAX_MAX_OPERAND);
};

// Init page

function handlekeyclick (k) {
	if (theGame) {
		theGame.handlekeyclick(k);
	}
}

$(function() {
	FastClick.attach(document.body);
}) ();

