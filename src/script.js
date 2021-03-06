const code = document.querySelector('#code');

var xCoord = 0;
var yCoord = 0;

var xVal = 0;
var yVal = 0;

var eXVal = 0;
var eYVal = 0;

var matrix = [];
var playerMatrix = [];
var enemyMatrix = [];

var shotLocs = [];

var enemyShotLocs = [];
var orientationFound = false;
var orientationPredicted = "";
var enemyFoundYourShip = false;
var enableAI = false;

var checkShipNumberChange = 5;
var checkPlayerShipNumberChange = 5;
var shipHasSunken = false;

var firstCorrectHitX = 0;
var firstCorrectHitY = 0;


var hittedShipSymbol = " ";
var hittedShipReach = 4;

var gameText = document.querySelector('#gameManager-text');
var gameBoard = document.querySelector('#grid-text');

var playerShip_text = document.querySelector('#playerShips-text');
var enemyShip_text = document.querySelector('#enemyShips-text');
var score_text = document.querySelector('#score-text');
var highScore_text = document.querySelector('#highScore-text');

var i = 0;
var announcement = '';
var speed = 50;

var canType = false;
var canRestart = false;

var gameStart = false;
var setupStart = false;
var setupProgress = 0;
var shipSymbol = "▦";
var gameEnd = false;


var s = 0;
var eS = 0;

var score = 0;
var highScore = 0;
var numWrongShoot = 0;

// fs = require('fs');

Initialize();

class Ship {
	constructor(length, symbol){
		this.length = length - 1;
		this.startLocX = 0;
		this.startLocY = 0;
		this.endLocX = 0;
		this.endLocY = 0;
		this.locX = [];
		this.locY = [];
		this.health = length;
		this.isDestroyed = false;
		this.symbol = symbol;
	}

	CalculateSpaceTaken(){

		if (this.startLocX < this.endLocX){
			for (let i = this.startLocX; i <= this.endLocX; i++){
				this.locX[i - this.startLocX] = i;
			}
		} else {
			for (let i = this.endLocX; i <= this.startLocX; i++){
				this.locX[i - this.endLocX] = i;
			}
		}

		if (this.startLocY < this.endLocY){
			for (let i = this.startLocY; i <= this.endLocY; i++){
				this.locY[i - this.startLocY] = i;
			}
		} else {
			for (let i = this.endLocY; i <= this.startLocY; i++){
				this.locY[i - this.endLocY] = i;
			}
		}
	}

	ResetSpaceTaken(){

		this.locX = [];
		this.locY = [];
	}

	TakeDamage(){
		if (this.health <= 1){
			this.isDestroyed = true;
		} else {
			this.health -= 1;
		}
	}

}

var ships = [new Ship(5,"▦"), new Ship(4,"▣"), new Ship(3,"▥"), new Ship(3,"▤"), new Ship(2,"◉")];
var enemyShips = [new Ship(5,"▦"), new Ship(4,"▣"), new Ship(3,"▥"), new Ship(3,"▤"), new Ship(2,"◉")];

function Initialize(){
	Announce("WELCOME TO BATTLESHIP!", 50, 0);
	setTimeout(function() {
		Announce("Input X = 0, Y = 0 to Start Game!", 50, 0);
		canType = true;
		canRestart = false;
	} , 2400);
}

function Confirm(){
	if (canType == true && gameEnd == false){

	xCoord = document.querySelector('#textX-input').value;
	yCoord = document.querySelector('#textY-input').value;

	document.querySelector('#textX-input').value = '';
	document.querySelector('#textY-input').value = '';

	xVal = xCoord - 1;

	switch(yCoord) {
		case "A":
			yVal = 0;
			break;
		case "B":
			yVal = 1;
			break;
		case "C":
			yVal = 2;
			break;
		case "D":
			yVal = 3;
			break;
		case "E":
			yVal = 4;
			break;
		case "F":
			yVal = 5;
			break;
		case "G":
			yVal = 6;
			break;
		case "H":
			yVal = 7;
			break;
	}

	if (setupStart == false && gameStart == false){

		if (xCoord == 0 && yCoord == 0) {
			Announce("SET YOUR SHIPS!", 50, 0);
			CreateBoard();
			CreatePlayerBoard();
			canType = false;

			setTimeout(function() {
				Announce("POSITION MOTHERSHIP ▦ (5 units)", 50, 0);
				setupStart = true;
				canType = true;
				canRestart = true;
			} , 5000);
		} else {
			alert("ERROR 000: PLEASE INPUT 0 TO X AND Y TO PROCEED. THANK YOU.");
		}
	}
	if (setupStart == true && gameStart == false){
		if (setupProgress % 2 == 0){
			ConfirmSetupPosition();
		} else {
			ConfirmSetupOrientation();
		}
	}
	if (gameStart == true){
		ConfirmShoot();
	}

}}

//FUNCTIONS NG SETUP

function AnnounceSetupProgression(){
	setupProgress += 1;

	switch(setupProgress){
		case 1:
			Announce("Set Orientation in X [↑(0),↓(1),←(2),→(3)]", 20, 0);
			break;
		case 2:
			Announce("POSITION SPACE LAB ▣ (4 units)", 50, 0);
			shipSymbol = "▣";
			break;
		case 3:
			Announce("Set Orientation in X [↑(0),↓(1),←(2),→(3)]", 20, 0);
			break;
		case 4:
			Announce("POSITION FIGHTER SHIP ▥ (3 units)", 50, 0);
			shipSymbol = "▥";
			break;
		case 5:
			Announce("Set Orientation in X [↑(0),↓(1),←(2),→(3)]", 20, 0);
			break;
		case 6:
			Announce("POSITION SPACE BUS ▤ (3 units)", 50, 0);
			shipSymbol = "▤";
			break;
		case 7:
			Announce("Set Orientation in X [↑(0),↓(1),←(2),→(3)]", 20, 0);
			break;
		case 8:
			Announce("POSITION SPACE SATELLITE ◉ (2 units)", 50, 0);
			shipSymbol = "◉";
			break;
		case 9:
			Announce("Set Orientation in X [↑(0),↓(1),←(2),→(3)]", 20, 0);
			break;
		case 10:
			Announce("PREPARE TO BATTLE!", 50, 0);
			canType = false;
			document.querySelector('.game-grid').style.backgroundImage="url(enemy-grid.png)";

			setTimeout(function() {
				Announce("First turn goes to you. Shoot your shot!", 50, 0);
				SetupEnemyBoard();
				eS = 5;
				gameStart = true;
				setupStart = false;
				canType = true;
			} , 2000);
			break;
	}
}

function ConfirmSetupPosition(){
	let yValues = ["A","B","C","D","E","F","G","H"];
	let xValid = (xCoord < 9 && xCoord > 0);
	let yValid = yValues.includes(yCoord);



	if (xValid && yValid) {
		if (CheckShipIntersection(false) == true){
			ships[s].startLocX = xVal;
			ships[s].startLocY = yVal;

			matrix[yVal] = placeMarker(matrix[yVal], shipSymbol, xVal);
			LoadBoard();

			AnnounceSetupProgression();
		}

	} else {
		alert("ERROR 001: COORDINATES ENTERED IS TOO FAR. PLEASE RETURN TO THE PLAYING FIELD. THANK YOU.");
	}
}

function ConfirmSetupOrientation(){
	let xValid = (xCoord < 4 && xCoord >= 0);

	if (xValid) {

		switch(xCoord){
			case('0'):
				if (ships[s].startLocY - ships[s].length >= 0){
					ships[s].endLocX = ships[s].startLocX;
					ships[s].endLocY = ships[s].startLocY - ships[s].length;
					if (CheckShipIntersection(true,false) == true){
						PlaceFullShip(0);
					}
				} else {

					if(ships[s].startLocX - ships[s].length < 0){
						alert("ERROR 002: ORIENTATION ENTERED IS INVALID. POSSIBLE ORIENTATIONS ARE DOWN(1) OR RIGHT(3)");
					} else if (ships[s].startLocX + ships[s].length > 7) {
						alert("ERROR 002: ORIENTATION ENTERED IS INVALID. POSSIBLE ORIENTATIONS ARE DOWN(1) OR LEFT(2)");
					} else {
						alert("ERROR 002: ORIENTATION ENTERED IS INVALID. POSSIBLE ORIENTATIONS ARE DOWN(1), LEFT(2), RIGHT(3)");
					}
					break;
				}
				break;
			case('1'):
				if (ships[s].startLocY + ships[s].length <= 7){
					ships[s].endLocX = ships[s].startLocX;
					ships[s].endLocY = ships[s].startLocY + ships[s].length;
					if (CheckShipIntersection(true,false) == true){
						PlaceFullShip(1);
					}
				} else {
					if(ships[s].startLocX - ships[s].length < 0){
						alert("ERROR 002: ORIENTATION ENTERED IS INVALID. POSSIBLE ORIENTATIONS ARE UP(0) OR RIGHT(3)");
					} else if (ships[s].startLocX + ships[s].length > 7) {
						alert("ERROR 002: ORIENTATION ENTERED IS INVALID. POSSIBLE ORIENTATIONS ARE UP(0) OR LEFT(2)");
					} else {
						alert("ERROR 002: ORIENTATION ENTERED IS INVALID. POSSIBLE ORIENTATIONS ARE UP(0), LEFT(2), RIGHT(3)");
					}
					break;
				}
				break;
			case('2'):
				if (ships[s].startLocX - ships[s].length >= 0){
					ships[s].endLocX = ships[s].startLocX - ships[s].length;
					ships[s].endLocY = ships[s].startLocY;
					if (CheckShipIntersection(true,true) == true){
						PlaceFullShip(2);
					}
				} else {
					if(ships[s].startLocY - ships[s].length < 0){
						alert("ERROR 002: ORIENTATION ENTERED IS INVALID. POSSIBLE ORIENTATIONS ARE DOWN(1) OR RIGHT(3)");
					} else if (ships[s].startLocY + ships[s].length > 7) {
						alert("ERROR 002: ORIENTATION ENTERED IS INVALID. POSSIBLE ORIENTATIONS ARE UP(0) OR RIGHT(3)");
					} else {
						alert("ERROR 002: ORIENTATION ENTERED IS INVALID. POSSIBLE ORIENTATIONS ARE UP(0), DOWN(1), RIGHT(3)");
					}
					break;
				}
				break;
			case('3'):
				if (ships[s].startLocX + ships[s].length <= 7){
					ships[s].endLocX = ships[s].startLocX + ships[s].length;
					ships[s].endLocY = ships[s].startLocY;
					if (CheckShipIntersection(true,true) == true){
						PlaceFullShip(3);
					}
				} else {
					if(ships[s].startLocY - ships[s].length < 0){
						alert("ERROR 002: ORIENTATION ENTERED IS INVALID. POSSIBLE ORIENTATIONS ARE DOWN(1) OR LEFT(2)");
					} else if (ships[s].startLocY + ships[s].length > 7) {
						alert("ERROR 002: ORIENTATION ENTERED IS INVALID. POSSIBLE ORIENTATIONS ARE UP(0) OR LEFT(2)");
					} else {
						alert("ERROR 002: ORIENTATION ENTERED IS INVALID. POSSIBLE ORIENTATIONS ARE UP(0), DOWN(1), LEFT(2)");
					}
					break;
				}
				break;
		
	}
	} else {
		alert("ERROR 002: ORIENTATION ENTERED IS INVALID. POSSIBLE ORIENTATIONS ARE UP(0), DOWN(1), LEFT(2), RIGHT(3)");
	}
}

function CheckShipIntersection(isCheckingOrientation, isHorizontal){
	if (s > 0){
		if (isCheckingOrientation == false){
			var inelligble = false;

			for (let i = 0; i < s; i++){
				if (ships[i].locX.includes(xVal) && ships[i].locY.includes(yVal)){
					alert("ERROR 001: COORDINATES ENTERED COLLIDES WITH ANOTHER SHIP. PLEASE SELECT ANOTHER COORDINATE. THANK YOU.");
					inelligble = true;
				}
			}

			if (!inelligble){ return true;}
		} else {
			var inelligble = false;

			ships[s].CalculateSpaceTaken();
			for (let i = 0; i < s; i++){
				for (let j = 0; j <= ships[s].length; j++){
					if (isHorizontal == true){
						if (ships[i].locX.includes(ships[s].locX[j]) && ships[i].locY.includes(ships[s].locY[0])){
							alert("ERROR 002: ORIENTATION WILL CAUSE SHIP TO COLLIDE WITH ANOTHER SHIP. PLEASE SELECT ANOTHER ORIENTATION. THANK YOU.");
							inelligble = true;
							break;
						}
					} else {
						if (ships[i].locX.includes(ships[s].locX[0]) && ships[i].locY.includes(ships[s].locY[j])){
							alert("ERROR 002: ORIENTATION WILL CAUSE SHIP TO COLLIDE WITH ANOTHER SHIP. PLEASE SELECT ANOTHER ORIENTATION. THANK YOU.");
							inelligble = true;
							break;
						}
					}
				}
			}
			if (!inelligble){ return true;}

		}
	} else {
		return true;
	}
}

function SetupEnemyBoard(){
	for (let i = 0; i < 8;i++){
		enemyMatrix[i] = '';
		for (let j = 0; j < 8;j++){
			enemyMatrix[i] += '▢';
		}
	}

	SetupEnemyBoardWithPlayerShips();

	RandomizeEnemyLocation();

	LoadEnemyBoard();

	eS = 5;
	enemyShip_text.textContent = "SHIPS: 0" + eS.toString();
}

function SetupEnemyBoardWithPlayerShips(){

	let playerX = 0;
	let playerY = 0;

	for (let playerX = 0; playerX < 8;playerX++){
		for (let playerY = 0; playerY < 8;playerY++){
			for (let i = 0; i < 5; i++){
				if (ships[i].locX.includes(playerX) && ships[i].locY.includes(playerY)){
					shipSymbol = ships[i].symbol;
					playerMatrix[playerY] = placeMarker(playerMatrix[playerY], shipSymbol, playerX);
				}
			}
		}
	}

}

function RandomizeEnemyLocation(){

	let mShipX = Math.floor(Math.random() * 3) + 0;
	let mShipY = Math.floor(Math.random() * 3) + 5;

	enemyShips[0].startLocX = mShipX;
	enemyShips[0].startLocY = mShipY;
	enemyShips[0].endLocX = mShipX + enemyShips[i].length + 1;
	enemyShips[0].endLocY = mShipY;
	enemyShips[0].CalculateSpaceTaken();


	let randX = Math.floor(Math.random() * 8);
	let randY = 0;

	let randomizedPos = []

	for (let i = 1; i < 5; i++){

		do {
			randX = Math.floor(Math.random() * 8);
		}
		while (randomizedPos.includes(randX));

		randomizedPos.push(randX);

		randY = Math.floor(Math.random() * (mShipY - enemyShips[i].length));

		enemyShips[i].startLocX = randX;
		enemyShips[i].startLocY = randY;
		enemyShips[i].endLocX = randX;
		enemyShips[i].endLocY = enemyShips[i].startLocY + enemyShips[i].length;
		enemyShips[i].CalculateSpaceTaken();
	}
}

//FUNCTIONS NG GAME


function ConfirmShoot(){
	let yValues = ["A","B","C","D","E","F","G","H"];
	let xValid = (xCoord < 9 && xCoord > 0);
	let yValid = yValues.includes(yCoord);

	selectedX = xVal.toString();
	selectedY = yVal.toString();
	selectedLoc = selectedX + selectedY;

	if (xValid && yValid && gameEnd == false) {
		if(!(shotLocs.includes(selectedLoc))){
			shotLocs.push(selectedLoc);
			canType = false;

			setTimeout(function() {
				EnemyTurn();
			} , 2000);

			if (CheckEnemyShip() == true){
				CheckAliveShips();

				enemyMatrix[yVal] = placeMarker(enemyMatrix[yVal], shipSymbol, xVal);
				LoadEnemyBoard();

				AnnouncePlayerHit(true);
				UpdateScore();
			} else {
				enemyMatrix[yVal] = placeMarker(enemyMatrix[yVal], '✛', xVal);
				LoadEnemyBoard();
				AnnouncePlayerHit(false);
				numWrongShoot++;
			}
		} else {
			alert("ERROR 003: COORDINATES ENTERED IS ALREADY BLOWN TO PIECES. PLEASE ENTER ANOTHER LOCATION TO SHOOT. THANK YOU.");
		}

	} else {
		alert("ERROR 001: COORDINATES ENTERED IS TOO FAR. PLEASE RETURN TO THE PLAYING FIELD. THANK YOU.");
	}
}

function CheckEnemyShip(){
	var shipShot = false;

	for (let i = 0; i < 5; i++){

		if (enemyShips[i].locX.includes(xVal) && enemyShips[i].locY.includes(yVal)){
			enemyShips[i].TakeDamage();
			shipShot = true;
			shipSymbol = enemyShips[i].symbol;
		} else {

		}
	}

	if (shipShot){return true} else {return false}
}

function CheckAliveShips(){
	eS = 5;

	for (var i = 0; i < 5; i++){
		if (enemyShips[i].isDestroyed == true){
			eS -= 1;
		}
	}

	if (eS < checkPlayerShipNumberChange){
		shipHasSunken = true;
	}

	checkPlayerShipNumberChange = eS;
	enemyShip_text.textContent = "SHIPS: 0" + eS.toString();

	EndGame();
}

function AnnouncePlayerHit(hit){

	if (gameEnd == false){
	if (hit == true){

		if (shipHasSunken == true){

			var randPhrase = Math.floor(Math.random() * 3); 

			switch(randPhrase){
			case 0:
				Announce("YOU HAVE DESTROYED AN ENEMY SHIP!", 20, 0);
				break;
			case 1:
				Announce("ENEMY SHIP IS ANNIHILATED!", 50, 0);
				break;
			case 2:
				Announce("ENEMY SHIP EXPLODES!", 20, 0);
				break;
			}

			shipHasSunken = false;

		} else {


			var randPhrase = Math.floor(Math.random() * 7); 

			switch(randPhrase){
			case 0:
				Announce("NICE SHOT!", 20, 0);
				break;
			case 1:
				Announce("YOU DID THE RIGHT SHOT!", 50, 0);
				break;
			case 2:
				Announce("SUCCESSFUL SHOT!", 20, 0);
				break;
			case 3:
				Announce("NICE HIT!", 50, 0);
				break;
			case 4:
				Announce("GOOD SHOT!", 20, 0);
				break;
			case 5:
				Announce("IT'S A HIT!", 20, 0);
				break;
			case 6:
				Announce("A SUCCESSFUL HIT!", 50, 0);
				break;
			}
		}
	} else {
		var randPhrase = Math.floor(Math.random() * 6); 

		switch(randPhrase){
		case 0:
			Announce("YOU MISSED!", 20, 0);
			break;
		case 1:
			Announce("OOF!", 50, 0);
			break;
		case 2:
			Announce("YOU MISSED THE ENEMY SHIP!", 20, 0);
			break;
		case 3:
			Announce("YOU ALMOST GOT IT!", 50, 0);
			break;
		case 4:
			Announce("YOU MISSED! THAT'S SAD!", 20, 0);
			break;
		case 5:
			Announce("IT'S A MISS!", 50, 0);
			break;
	}
}
}

	
}

//FUNCTIONS NG ENEMY AI
function EnemyTurn(){

	if (gameEnd == false){
		canType = false;
		Announce("ENEMY'S TURN!", 10, 0);
		LoadPlayerBoard();

		setTimeout(function() {
			Announce("Enemy is guessing where your ships at", 50, 0);
		} , 1000);

		setTimeout(function() {
			if (enableAI == true){
				EnemyAI();
			} else {
				CreateRandomTarget();
			}
		} , 3250);
	}
}

function CreateRandomTarget(){

	let randX = Math.floor(Math.random() * 8) + 0;
	let randY = Math.floor(Math.random() * 8) + 0;

	let randXString = randX.toString();
	let randYString = randY.toString();

	let randTarget = randXString + randYString;

	do {
		randX = Math.floor(Math.random() * 8) + 0;
		randY = Math.floor(Math.random() * 8) + 0;

		randXString = randX.toString();
		randYString = randY.toString();

		randTarget = randXString + randYString;

	}
	while (enemyShotLocs.includes(randTarget));


	eXVal = randX;
	eYVal = randY;
	EnemyShoot(eXVal,eYVal);
	enemyShotLocs.push(randTarget);

	firstCorrectHitX = eXVal;
	firstCorrectHitY = eYVal;
}


function EnemyAI(){

	if (orientationFound == true){
		DetermineFullShipLocation();
	} else {
		DetermineOrientation();
	}
}

function DetermineOrientation(){

	let predictX = firstCorrectHitX;
	let predictY = firstCorrectHitY;

	let insideBoard = false;

	let decided = false;

	let combinedUp = "";
	let combinedDown = "";
	let combinedLeft = "";
	let combinedRight = "";

	let predictXString = predictX.toString();
	let predictYString = predictY.toString();

	let combinedPredict = "";
	
	if (decided == false){

		predictY = firstCorrectHitY - 1;
		predictYString = predictY.toString();
		combinedUp = predictXString + predictYString;

		predictY = firstCorrectHitY + 1;
		predictYString = predictY.toString();
		combinedDown = predictXString + predictYString;

		predictYString = firstCorrectHitY.toString();

		predictX = firstCorrectHitX - 1;
		predictXString = predictX.toString();
		combinedLeft = predictXString + predictYString;

		predictX = firstCorrectHitX + 1;
		predictXString = predictX.toString();
		combinedRight = predictXString + predictYString;


		if (!(enemyShotLocs.includes(combinedUp)) && (firstCorrectHitY - 1) >= 0){	
			eXVal = firstCorrectHitX;
			eYVal = firstCorrectHitY - 1;

			EnemyShoot(eXVal,eYVal);
		} else if (!(enemyShotLocs.includes(combinedDown)) && (firstCorrectHitY + 1) <= 7) {
			eXVal = firstCorrectHitX;
			eYVal = firstCorrectHitY + 1;

			EnemyShoot(eXVal,eYVal);
		}  else if (!(enemyShotLocs.includes(combinedLeft)) && (firstCorrectHitX - 1) >= 0) {
			eXVal = firstCorrectHitX - 1;
			eYVal = firstCorrectHitY;

			EnemyShoot(eXVal,eYVal);
		}  else if (!(enemyShotLocs.includes(combinedRight)) && (firstCorrectHitX + 1) <= 7) {
			eXVal = firstCorrectHitX + 1;
			eYVal = firstCorrectHitY;

			EnemyShoot(eXVal,eYVal);
		} else {
			enableAI = false;
			CreateRandomTarget();
		}
	}

	predictXString = eXVal.toString();
	predictYString = eYVal.toString();

	combinedPredict = predictXString + predictYString;
	enemyShotLocs.push(combinedPredict);

	if (orientationFound == true){
		if (eXVal == firstCorrectHitX){
			orientationPredicted = "vertical";
		} else {
			orientationPredicted = "horizontal";
		}
	}

}

function DetermineFullShipLocation(){

	let predictX = firstCorrectHitX;
	let predictY = firstCorrectHitY;

	let predictXString = predictX.toString();
	let predictYString = predictY.toString();

	let combinedPredict = "";

	let giveUp = true;

	switch(hittedShipSymbol){
		case "▦":
			hittedShipReach = 4;
			break;
		case "▣":
			hittedShipReach = 3;
			break;
		case "▥":
			hittedShipReach = 2;
			break;
		case "▤":
			hittedShipReach = 2;
			break;
		case "◉":
			hittedShipReach = 1;
			break;
	}

	if (orientationPredicted == "horizontal"){

		for (let i = 0; i < 9; i++){

			predictX = (firstCorrectHitX - hittedShipReach) + i;

			predictXString = predictX.toString();
			predictYString = predictY.toString();

			combinedPredict = predictXString + predictYString;

			if (enemyShotLocs.includes(combinedPredict) == false){
				if (predictX >= 0 && predictX <= 7){
					eXVal = predictX;
					eYVal = predictY;
					giveUp = false;

					break;
				}
			}
		}	
	} else if (orientationPredicted == "vertical"){
		for (let i = 0; i < 9; i++){

			predictY = (firstCorrectHitY - hittedShipReach) + i;

			predictXString = predictX.toString();
			predictYString = predictY.toString();

			combinedPredict = predictXString + predictYString;

			if (enemyShotLocs.includes(combinedPredict) == false){
				if (predictY >= 0 && predictY <= 7){
					eXVal = predictX;
					eYVal = predictY;
					giveUp = false;

					break;
				}
			}
		}
	}

	if (giveUp == true){
		CreateRandomTarget();
		orientationFound = false;
		enableAI = false;
	} else {
		enemyShotLocs.push(combinedPredict);
		EnemyShoot(eXVal,eYVal);
	}
}

function EnemyShoot(x,y){
	if (CheckPlayerShip() == true){
		CheckEnemyAliveShips();

		if (playerMatrix[eYVal][eXVal] != "✛" && enableAI == false){
			hittedShipSymbol = playerMatrix[eYVal][eXVal];
		}

		if (enableAI == true && orientationFound == false){
			if (hittedShipSymbol == playerMatrix[eYVal][eXVal]){
				orientationFound = true;
			}
		} else {
			enableAI = true;
		}

		if (enemyFoundYourShip == true){
			enableAI = false;
			enemyFoundYourShip = false;
			orientationFound = false;
		}

		playerMatrix[eYVal] = placeMarker(playerMatrix[eYVal], '✛', eXVal);
		LoadPlayerBoard();

		AnnounceEnemyHit(true);
		lastHitCorrect = true;
	} else {
		playerMatrix[eYVal] = placeMarker(playerMatrix[eYVal], '✛', eXVal);
		LoadPlayerBoard();
		AnnounceEnemyHit(false);
		lastHitCorrect = false;
	}

	if (gameEnd == false){
		setTimeout(function() {
			Announce("Now is your turn. Shoot your shot!", 50, 0);
			LoadEnemyBoard();
			canType = true;
		} , 2500);
	}
}

function CheckPlayerShip(){
	let shipShot = false;

	for (let i = 0; i < 5; i++){

		if (ships[i].locX.includes(eXVal) && ships[i].locY.includes(eYVal)){
			ships[i].TakeDamage();
			shipShot = true;

			if (score > 0){
				score -= 10;
				score_text.textContent = "SCORE: " + score.toString();
			}

		}
	}

	if (shipShot == true){return true} else {return false}
}

function CheckEnemyAliveShips(){
	enemyFoundYourShip = false;
	s = 5;

	for (var i = 0; i < 5; i++){
		if (ships[i].isDestroyed == true){
			s -= 1;
		}
	}

	EndGame();

	if (s < checkShipNumberChange){
		orientationFound = false;
		enemyFoundYourShip = true;
		shipHasSunken = true;
	}

	checkShipNumberChange = s;
	playerShip_text.textContent = "SHIPS: 0" + s.toString();
}


function AnnounceEnemyHit(hit){

	if (gameEnd == false){
	if (hit == true){

		if (shipHasSunken == true){

			var randPhrase = Math.floor(Math.random() * 3); 

			switch(randPhrase){
			case 0:
				Announce("A SHIP OF YOURS WAS DESTROYED!", 20, 0);
				break;
			case 1:
				Announce("A SHIP OF YOURS WAS ANNIHILATED!", 50, 0);
				break;
			case 2:
				Announce("ENEMY DESTROYED YOUR SHIP!", 20, 0);
				break;
			}

			shipHasSunken = false;

		} else {

			var randPhrase = Math.floor(Math.random() * 6); 

			switch(randPhrase){
			case 0:
				Announce("YOU GOT HIT!", 20, 0);
				break;
			case 1:
				Announce("ENEMY HITTED YOU!", 50, 0);
				break;
			case 2:
				Announce("THE ENEMY FOUND YOUR SHIP!", 20, 0);
				break;
			case 3:
				Announce("NICE SHOT BY THE ENEMY!", 50, 0);
				break;
			case 4:
				Announce("GOOD SHOT BY THE ENEMY!", 20, 0);
				break;
			case 5:
				Announce("IT'S A HIT!", 20, 0);
				break;
			}
		}
	} else {
		var randPhrase = Math.floor(Math.random() * 6); 

		switch(randPhrase){
		case 0:
			Announce("ENEMY MISSED!", 20, 0);
			break;
		case 1:
			Announce("THE ENEMY MISSED YOU!", 50, 0);
			break;
		case 2:
			Announce("THE ENEMY MADE THE WRONG SHOT!", 20, 0);
			break;
		case 3:
			Announce("ENEMY FAILED TO SHOT YA!", 50, 0);
			break;
		case 4:
			Announce("ENEMY MISSED YOUR SHIP!", 20, 0);
			break;
		case 5:
			Announce("THE ENEMY MISSED!", 50, 0);
			break;
	}
}
}

	
}

//SCORING AND GAME MANAGER FUNCTIONS

function EndGame(){
	if (s == 0){
		gameEnd = true;
		Announce("ALL OF YOUR SHIPS ARE ANNIHILATED!", 20, 0);
		canRestart = false;

		if (score > highScore){
			highScore = score;
		}

		setTimeout(function() {
			Announce("TRY AGAIN NEXT TIME :(", 50, 0);
			canRestart = true;

			highScore_text.textContent = highScore.toString();
		} , 3200);


	} else if (eS == 0){
		gameEnd = true;
		Announce("ALL THE ENEMY SHIPS ARE ANNIHILATED!", 20, 0);
		canRestart = false;

		score += 150;


		setTimeout(function() {
			Announce("CONGRATULATIONS! PLEASE PLAY AGAIN!", 50, 0);
			canRestart = true;

			if (score > highScore){
				highScore = score;
			}

			score_text.textContent = "SCORE: " + score.toString();
			highScore_text.textContent = highScore.toString();

		} , 3200);
	}
}

function UpdateScore(){

	if (numWrongShoot < 10){
		score += 50;
	} else if (numWrongShoot < 16){
		score += 40;
	} else if (numWrongShoot < 24){
		score += 30;
	} else if (numWrongShoot < 32){
		score += 20;
	} else {
		score += 10;
	}

	score_text.textContent = "SCORE: " + score.toString();
}

// MISC FUNCTIONS

function Announce(text, typeSpeed, resetNum){
	announcement = text;
	speed = typeSpeed;
	i = resetNum;

	gameText.textContent = '';

	TypeWriter();
}

function TypeWriter(){
	if (i < announcement.length) {
		gameText.textContent += announcement.charAt(i);
		i++;
		setTimeout(TypeWriter, speed);
  }
}


function placeMarker(origString, replaceChar, index) {
    let firstPart = origString.substr(0, index);
    let lastPart = origString.substr(index + 1);
      
    let newString = firstPart + replaceChar + lastPart;
    return newString;
}

function placeMarkerHorizontally(origString, replaceChar, index1, index2, length) {
    let firstPart = origString.substr(0, index1);
    let lastPart = origString.substr(index2 + 1);

    var markers = '';
    for (let i = 0; i < length; i++){
    	markers += replaceChar;
    }

    let newString = firstPart + markers + lastPart;
    return newString;
}

function PlaceFullShip(direction) {
	switch(direction){
		case 0:
			for (let i = 0; i < ships[s].length; i++){
				matrix[ships[s].endLocY + i] = placeMarker(matrix[ships[s].endLocY + i], shipSymbol, ships[s].startLocX);
			}
			break;
		case 1:
			for (let i = 0; i < ships[s].length; i++){
				matrix[ships[s].endLocY - i] = placeMarker(matrix[ships[s].endLocY - i], shipSymbol, ships[s].startLocX);
			}
			break;
		case 2:
			matrix[ships[s].endLocY] = placeMarkerHorizontally(matrix[ships[s].endLocY], shipSymbol, ships[s].endLocX, ships[s].startLocX - 1, ships[s].length);
			break;
		case 3:
			matrix[ships[s].endLocY] = placeMarkerHorizontally(matrix[ships[s].endLocY], shipSymbol, ships[s].startLocX , ships[s].endLocX, ships[s].length + 1);
			break;
	}
	AnnounceSetupProgression();
	
	LoadBoard();


	ships[s].ResetSpaceTaken();
	ships[s].CalculateSpaceTaken();

	s += 1;
	playerShip_text.textContent = "SHIPS: 0" + s.toString();
}

//board for setup
function CreateBoard(){	

	for (let i = 0; i < 8;i++){
		matrix[i] = '';
		for (let j = 0; j < 8;j++){
			matrix[i] += '▦';
		}
	}

	LoadBoard();


	for (let i = 0; i < 8;i++){
		for (let j = 0; j < 8;j++){
			animateFunctionOne = AnimateOneFunction(i,j);
		}
	}

	setTimeout(function() { 

		for (let i = 0; i < 8;i++){
			for (let j = 0; j < 8;j++){
				animateFunctionTwo = AnimateTwoFunction(i,j);
			}
		}

	}, 2400); 

}

var animatorOneCounter = 0;
var animatorTwoCounter = 0;

function AnimateOneFunction(ith,jth) { 

	setTimeout(function() { 

		for (let i = ith; i < 8;i++){
			matrix[i] = '';
			for (let j = 0; j < 8;j++){
				if (i <= ith && j <= jth){
					matrix[i] += '▣';
				} else {
					matrix[i] += '▦';
				}

				LoadBoard();
			}
		}

	}, 40 * animatorOneCounter); 

	animatorOneCounter++;
} 

function AnimateTwoFunction(ith,jth) { 

	setTimeout(function() { 

		for (let i = ith; i < 8;i++){
			matrix[i] = '';
			for (let j = 0; j < 8;j++){
				if (i <= ith && j <= jth){
					matrix[i] += '▢';
				} else {
					matrix[i] += '▣';
				}

				LoadBoard();
			}
		}

	}, 40 * animatorTwoCounter); 

	animatorTwoCounter++;
} 

//board for actual game
function CreatePlayerBoard(){
	for (let i = 0; i < 8;i++){
		playerMatrix[i] = '';
		for (let j = 0; j < 8;j++){
			playerMatrix[i] += '▢';
		}
	}
}

function LoadBoard(){

	gameBoard.textContent = matrix.join('\n');

}


function LoadEnemyBoard(){

	document.querySelector('.game-grid').style.backgroundImage="url(game-grid.png)";
	gameBoard.textContent = enemyMatrix.join('\n');

}


function LoadPlayerBoard(){

	document.querySelector('.game-grid').style.backgroundImage="url(enemy-grid.png)";
	gameBoard.textContent = playerMatrix.join('\n');

}


// FILE FUNCTIONS

function Restart(){

	if (canRestart == true){

	canRestart = false;

	xCoord = 0;
	yCoord = 0;

	xVal = 0;
	yVal = 0;

	eXVal = 0;
	eYVal = 0;

	matrix = [];
	playerMatrix = [];
	enemyMatrix = [];

	shotLocs = [];

	enemyShotLocs = [];

	orientationFound = false;
	orientationPredicted = "";
	enemyFoundYourShip = false;
	enableAI = false;

	checkShipNumberChange = 5;
	checkPlayerShipNumberChange = 5;

	shipHasSunken = false;

	firstCorrectHitX = 0;
	firstCorrectHitY = 0;

	s = 0;
	eS = 0;

	i = 0;
	announcement = '';
	speed = 50;

	canType = false;

	gameStart = false;
	setupStart = false;
	setupProgress = 0;
	gameEnd = false;

	score = 0;
	numWrongShoot = 0;

	for (let i = 0; i < 5; i++){
		ships[i].startLocX = 0;
		ships[i].startLocY = 0;
		ships[i].endLocX = 0;
		ships[i].endLocY = 0;
		ships[i].locX = [];
		ships[i].locY = [];
		ships[i].health = ships[i].length + 1;
		ships[i].isDestroyed = false;

		enemyShips[i].startLocX = 0;
		enemyShips[i].startLocY = 0;
		enemyShips[i].endLocX = 0;
		enemyShips[i].endLocY = 0;
		enemyShips[i].locX = [];
		enemyShips[i].locY = [];
		enemyShips[i].health = enemyShips[i].length + 1;
		enemyShips[i].isDestroyed = false;
	}

	for (let i = 0; i < 8;i++){
		matrix[i] = '';
		for (let j = 0; j < 8;j++){
			matrix[i] += '▦';
		}
	}
	LoadBoard();

	playerShip_text.textContent = "SHIPS: 0" + s.toString();
	enemyShip_text.textContent = "SHIPS: 0" + eS.toString();
	score_text.textContent = "SCORE: 0" + score.toString();

	animatorOneCounter = 0;
	animatorTwoCounter = 0;

	document.querySelector('.game-grid').style.backgroundImage="url(game-grid.png)";

	Initialize();

	}
}

// function Save(){
// 	fs.writeFile('helloworld.txt', 'Hello World!', function (err) {
//   		if (err) return console.log(err);
//   		console.log('Hello World > helloworld.txt');
// 	});
// }

