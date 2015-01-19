var theGame;

var game = function () {

	var  startTime,
		countCorrect,
		countWrong,
		thisN1,
		thisN2,
		operation ='*',
		maxOperand = 12,
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
		var remaining  = 60 - Math.round (((new Date()) - startTime)  / 1000);
		updateBGColor (remaining);
		$("#showTime").html ("0:" + remaining);
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
		thisN1 = Math.floor(Math.random () * maxOperand) + 1;
		thisN2 = Math.floor(Math.random () * maxOperand) + 1;
		showQuestion();
	};

	var showQuestion = function () {
		$("#n1").html ("" + thisN1);
		$("#n2").html ("" + thisN2);
		$("#operator").html (operation);
	}

	var endGame = function () {
		$(".game-off").show();		
		$(".game-on").hide();
		$(".keyboardrow div").css ("background-color", "#fff");
		gameState = 0;
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
		var answer = thisN1 * thisN2;
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

	return {
		startGame: startGame,
		nextQuestion: nextQuestion,
		init: init,
		handlekeyclick: handlekeyclick
	};
};

var newGame = function() {
	theGame = new game();
	theGame.init();
	theGame.startGame();
};

// Init page

function handlekeyclick (k) {
	if (theGame) {
		theGame.handlekeyclick(k);
	}
}

