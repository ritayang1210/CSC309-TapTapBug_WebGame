var canvasGame = document.getElementById("gameView");
var ctxGame = canvasGame.getContext("2d");

var canvasInfor = document.getElementById("inforBar");
var ctxInfor = canvasInfor.getContext("2d");
ctxInfor.font = "60px Courier New"

var timer = 60;
var timerfuc = setInterval(drawTimer, 1000);

var pause = false;
changeState();

var color = 'black';
var xCoord = canvasGame.width / 2;
var yCoord = canvasGame.height / 2;
var bugRot = 0;
var bugfuc = setInterval(moveBugs, 1000);

drawFoods();

function scoreCounter() {
    var highestScore = 2;
    var score = 3;
    if (score >= highestScore) {
        localStorage.setItem("highestScore", score);
    }
    document.getElementById("scoreCounter").textContent = localStorage.getItem("highestScore");
}

function startGame() {
    var level1 = document.getElementById("level1");
    var level2 = document.getElementById("level2");
    if (typeof(Storage) !== "undefined") {
        if (level1.checked) {
            localStorage.setItem("levelSelect", level1.value);
        } else if (level2.checked) {
            localStorage.setItem("levelSelect", level2.value);
        } else {
            alert("Please select game level!");
            return;
        }
        window.location='game.html';
    } else {
        alert("Sorry! No Web Storage support");
    }
}

function drawTimer() {
    if (timer == 0) {
        alert("Game Over");
        clearInterval(timerfuc);
        return;
    } else if (pause==true) {
        timer = timer - 1;
        ctxInfor.clearRect(0, 0, 100, 200);
        ctxInfor.fillText(timer + " sec", 10, 100, 50);
    }
}

function changeState() {
    if (pause == false) {
        drawPause();
        pause = true;
    } else if (pause == true) {
        drawResume();
        pause = false;
    }
}

function drawPause() {
    ctxInfor.clearRect(100, 0, 100, 200);
    var rectangle = new Path2D();
    rectangle.rect(140, 50, 5, 60);
    rectangle.rect(150, 50, 5, 60);
    ctxInfor.fill(rectangle);
}

function drawResume() {
    ctxInfor.clearRect(100, 0, 100, 200);

    var path=new Path2D();
    path.moveTo(160,80);
    path.lineTo(145,110);
    path.lineTo(145,50);
    ctxInfor.fill(path);
}

function drawBugs(xCoord, yCoord, color, rot) {
    ctxGame.save();

    var path = new Path2D();
    ctxGame.fillStyle = color;
    ctxGame.strokeStyle = color;

    ctxGame.translate(xCoord, yCoord);
    ctxGame.rotate(rot);

    path.arc(0, -17, 4, 0, 2 * Math.PI, false);
    path.ellipse(0, 0, 13, 3, 90 * Math.PI/180, 0, 2 * Math.PI);
    ctxGame.fill(path);

    ctxGame.beginPath();

    ctxGame.moveTo(0, -17);
    ctxGame.lineTo(-5, -27);

    ctxGame.moveTo(0, -17);
    ctxGame.lineTo(5, -27);

    ctxGame.moveTo(0, -3);
    ctxGame.lineTo(5, -10);
    ctxGame.lineTo(6, -15);

    ctxGame.moveTo(0, -3);
    ctxGame.lineTo(-5, -10);
    ctxGame.lineTo(-6, -15);

    ctxGame.moveTo(0, -4);
    ctxGame.lineTo(5, -4);
    ctxGame.lineTo(5, -1);

    ctxGame.moveTo(0, -4);
    ctxGame.lineTo(-5, -4);
    ctxGame.lineTo(-5, -1);

    ctxGame.moveTo(0, -3);
    ctxGame.lineTo(5, 3);
    ctxGame.lineTo(6, 8);

    ctxGame.moveTo(0, -3);
    ctxGame.lineTo(-5, 3);
    ctxGame.lineTo(-6, 8);

    ctxGame.stroke();

    ctxGame.restore();
}

function moveBugs(angle) {
    ctxGame.save();
    ctxGame.translate(xCoord, yCoord);
    ctxGame.rotate(bugRot);
    ctxGame.clearRect(-7, -28, 14, 42);
    ctxGame.restore();
    bugRot += 0.1;
    drawBugs(xCoord, yCoord, "black", bugRot);
}

function drawFoods() {
    var foodList = [];
    for (i = 0; i < 5; i++) {
        var newFood = new food();
        while (newFood.overlapWith(foodList)) {
            newFood = new food();
        }
        newFood.draw();
        foodList.push(newFood);
    }
}


window.addEventListener("mousedown", doMouseDown, false);
function doMouseDown(event) {
  x = event.pageX - canvasInfor.offsetLeft;
  y = event.pageY - canvasInfor.offsetTop;
  if (x>=190 && x<=220 && y>=27 && y<=60) {
     changeState();
  }
}

function food() {
    this.xCoord = Math.floor(Math.random() * (381) + 10);
    this.yCoord = Math.floor(Math.random() * (461) + 130);
    this.eaten = false;

    this.draw = function() {
        var path = new Path2D();
        path.arc(this.xCoord, this.yCoord, 10, 0, 2 * Math.PI, false);
        ctxGame.fillStyle = "blue";
        ctxGame.fill(path);
    }

    this.overlapWith = function(existingFoods) {
        for (i = 0; i < existingFoods.length; i++) {
            var existingFood = existingFoods[i]
            if (Math.sqrt(Math.pow(this.xCoord - existingFood.xCoord, 2) + Math.pow(this.yCoord - existingFood.yCoord, 2)) <= 20) {
                return true;
            }
        }
        return false;
    }
}