//global variables 
var gameWidth;
var gameHeight;
var balloonsTab = [];
var interval1;
var interval2;
var points = 100;
var record = points;
var whichLevel = 1;
var ballStepMin = 1;
var ballStepMax = 4;

function start() {
    gameWidth = window.innerWidth / 1.5 - 20;
    gameHeight = window.innerHeight - 20;
    makeDiv();
    makeStartBtn();
    makeTitle();
}

function makeDiv() { // make GAME BOARD 
    var gameDiv = document.createElement('div');
    gameDiv.id = "game";
    gameDiv.style.width = gameWidth + 'px';
    gameDiv.style.height = gameHeight + 'px';
    gameDiv.style.border = '2px lightgreen solid';
    gameDiv.style.backgroundImage = 'url("gfx/1.png")';
    gameDiv.style.backgroundSize = 'cover';
    gameDiv.style.position = 'relative';
    gameDiv.style.cursor = 'url("gfx/revolver.png"), crosshair';
    // onclick ATTRIBUTE
    gameDiv.setAttribute("onclick", "divClick(event)");
    //append
    var body = document.getElementsByTagName('body')[0];
    body.style.userSelect = "none"; // user cant select when click many times
    body.appendChild(gameDiv);
}

function makeTitle() {
    var title = document.createElement('img');
    title.id = "title";
    title.src = 'gfx/title.gif';
    title.style.position = 'absolute';
    title.style.top = '150px';
    title.style.left = gameWidth / 2 - 385 + 'px';
    var game = document.querySelector("#game");
    game.appendChild(title);
}

function makeStartBtn() {
    makeBtn("startBtn", "Start!", "startGame()"); // CREATE START BUTTON
}

function startGame() {
    var game = document.querySelector("#game");
    var screen = document.querySelector("#startBtn");
    var title = document.querySelector("#title");
    game.removeChild(screen);
    game.removeChild(title);
    for (var i = 0; i < 6; i++) {
        makeBalloon();
    }
    makeResultScreen();
    resultCheck();
    resultScreenUpgrade();
    interval1 = setInterval('animation()', 30); //  make balloons animate
    interval2 = setInterval('howMany()', 1000); //  check if there is enough ballons at the game board
}

function makeBalloon() { // MAKE BALLONS AT THE GAME BOARD AND ADD THEM TO BALLOONS TAB
    var balloon = document.createElement('img');
    var balloonId = 'balloon' + random(1, 1000000);
    balloon.id = balloonId;
    balloon.setAttribute('balloon', 'true');
    balloon.setAttribute('explosion', 'false');
    //baloon-color
    balloon.src = 'gfx/balloons/b' + random(1, 10) + '.png';
    //size
    var ballSize = random(80, 150);
    balloon.style.width = ballSize + "px";
    //position
    balloon.style.position = "absolute";
    var ballPositionLeft = random(0, gameWidth - ballSize - 5);
    var ballPositionLeftStart = ballPositionLeft;
    balloon.style.bottom = "0px";
    balloon.style.left = ballPositionLeft + "px";
    //steps
    var ballStepY = random(ballStepMin, ballStepMax);
    var ballStepX = random(ballStepMin, ballStepMax);
    var ballStepXDirection = random(0, 1);
    if (ballStepXDirection == 0) {
        ballStepX = -ballStepX;
    }
    //add to ballonsTab
    balloonsTab[balloonId] = [0, ballStepY, ballPositionLeft, ballStepX, ballPositionLeftStart];
    //append at the game board
    var game = document.querySelector("#game");
    game.appendChild(balloon);
}

function makeResultScreen() {
    var screen = document.createElement('div');
    screen.id = 'screen';
    screen.style.position = 'absolute';
    screen.style.bottom = '50px';
    screen.style.left = '50px';
    screen.style.fontSize = '30px';
    screen.style.fontFamily = 'Century Gothic';
    var game = document.querySelector("#game");
    game.appendChild(screen);
}

function animation() {
    for (var id in balloonsTab) {
        // ballonsTab[id][0] - balloon bottom
        // ballonsTab[id][1] - balloon Step Y
        // ballonsTab[id][2] - balloon left
        // ballonsTab[id][3] - balloon Step X
        // ballonsTab[id][4] - balloon left on start
        var ball = document.querySelector("#" + id);
        var ballWidth = ball.style.width;
        ballWidth = parseInt(ballWidth);
        //add steps
        balloonsTab[id][0] += balloonsTab[id][1];
        balloonsTab[id][2] += balloonsTab[id][3];
        //balloon flight over the game screen
        if (balloonsTab[id][0] >= gameHeight) {
            deleteBalloon(id);
            points -= 10;
            resultCheck();
            resultScreenUpgrade();
            continue;
        }
        //balloon float
        else if (balloonsTab[id][2] >= (gameWidth - ballWidth) || balloonsTab[id][2] <= 0 || balloonsTab[id][2] > (balloonsTab[id][4] + 80) || balloonsTab[id][2] < (balloonsTab[id][4] - 80)) {
            balloonsTab[id][2] -= balloonsTab[id][3]; // step cancel
            balloonsTab[id][3] = -balloonsTab[id][3]; // turnover step
        }
        ball.style.bottom = balloonsTab[id][0] + 'px'; //position upgrade
        ball.style.left = balloonsTab[id][2] + 'px';
    }//loop end
}

function divClick(e) { // to check if user click on the ballon or not
    var object = e.target;
    var ballAtt = object.getAttribute("balloon");
    var expAtt = object.getAttribute("explosion");
    if (ballAtt == "true" && expAtt == "false") {
        points += 5;
        if (points > record) {
            record = points;
        }
        balloonsTab[object.id][1] = 0; // stop the balloon
        balloonsTab[object.id][3] = 0; // stop the balloon
        object.setAttribute("explosion", "true");
        object.src = 'gfx/explosion.gif';
        setTimeout(function () {
            deleteBalloon(object.id);
        }, 300);
        resultScreenUpgrade();
        resultCheck();
    }
}

function deleteBalloon(balloonId) {
    var ball = document.querySelector("#" + balloonId);
    var game = document.querySelector("#game");
    game.removeChild(ball);
    delete balloonsTab[balloonId];
}

function resultScreenUpgrade() {
    var screen = document.querySelector("#screen");
    screen.innerHTML = "Points: " + points;
    screen.innerHTML += "<br>";
    screen.innerHTML += "Record: " + record;
//    screen.innerHTML += "<br>";
//    screen.innerHTML += "Level: " + whichLevel;
}

function howMany() {
    if (Object.keys(balloonsTab).length < 6) {
        makeBalloon();
    }
}

function resultCheck() {
    if (points < 0) {
        points = 0;
        resultScreenUpgrade();
        gameOver();
        clearInterval(interval1);
        clearInterval(interval2);
        turnOffOnclick();
        deleteAll();
        makeRestartBtn();
    } else if (points >= 100 * (whichLevel + 1)) {
        whichLevel++;
        for (var id in balloonsTab) {
            // step increase 
            balloonsTab[id][1] += 3;
        }
        ballStepMax++;
        ballStepMin++;
        levelScreen();
    }
}

function gameOver() {
    var go = document.createElement('img');
    go.id = "go";
    go.src = 'gfx/GO.gif';
    go.style.position = 'absolute';
    go.style.top = '150px';
    go.style.left = gameWidth / 2 - 220 + 'px';
    var game = document.querySelector("#game");
    game.appendChild(go);
}

function turnOffOnclick() {
    var game = document.querySelector("#game");
    game.onclick = null;
}

function deleteAll() {
    for (var id in balloonsTab) {
        var ball = document.querySelector("#" + id);
        ball.src = 'gfx/explosion.gif';
        deleteWithDelay(id);
    }
}

function deleteWithDelay(balloonId) {
    var ball = document.querySelector("#" + balloonId);
    var game = document.querySelector("#game");
    setTimeout(function () {
        game.removeChild(ball);
        delete balloonsTab[balloonId];
    }, 1000);
}

function levelScreen() {
    var screen = document.createElement('div');
    screen.innerHTML = "Level " + whichLevel;
    screen.style.fontSize = "30px";
    screen.style.fontFamily = "Century Gothic";
    screen.style.fontWeight = "bold";
    screen.style.width = "200px";
    screen.style.height = "60px";
    screen.style.lineHeight = "60px";
    screen.style.position = 'absolute';
    screen.style.top = gameHeight / 2 + 'px';
    screen.style.left = gameWidth / 2 - 100 + 'px';
    screen.style.border = '5px #00ff00 solid';
    screen.style.backgroundColor = '#6cffb1';
    screen.style.textAlign = 'center';
    var game = document.querySelector('#game');
    game.appendChild(screen);
    setTimeout(function () {
        game.removeChild(screen);
    }, 2000);
}

function makeRestartBtn() {
    makeBtn("restart", "Try Again !", "restart()");
}

function restart() {
    var game = document.querySelector("#game");
    var body = document.getElementsByTagName('body')[0];
    body.removeChild(game); //remove all from body
    //restart points,level,balloon speed, create new game
    points = 100;
    record = points;
    whichLevel = 1;
    ballStepMin = 1;
    ballStepMax = 4;
    makeDiv();
    for (var i = 0; i < 6; i++) {
        makeBalloon();
    }
    makeResultScreen();
    resultCheck();
    resultScreenUpgrade();
    interval1 = setInterval('animation()', 30);
    interval2 = setInterval('howMany()', 1000);
}

function makeBtn(id, inner, onclickFunction) {
    var btn = document.createElement('div');
    btn.id = id;
    btn.innerHTML = inner;
    btn.style.fontSize = "30px";
    btn.style.fontFamily = "Century Gothic";
    btn.style.fontWeight = "bold";
    btn.style.width = "200px";
    btn.style.height = "60px";
    btn.style.lineHeight = "60px";
    btn.style.position = 'absolute';
    btn.style.top = gameHeight / 2 + 'px';
    btn.style.left = gameWidth / 2 - 100 + 'px';
    btn.style.border = '5px #00ff00 solid';
    btn.style.backgroundColor = '#6cffb1';
    btn.style.textAlign = 'center';
    btn.setAttribute("onclick", onclickFunction);

    btn.onmouseenter = function () {
        this.style.backgroundColor = "#e7b2ff";
        this.style.cursor = "pointer";
        this.style.color = "#65015c";
    };
    btn.onmouseout = function () {
        this.style.backgroundColor = "#6cffb1";
        this.style.color = "black";
    };

    var game = document.querySelector("#game");
    game.appendChild(btn);
}