var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');
var gameStarted = false;
var score = 0;
var isJumping = false;
var jumpDuration = 0;
var player = createPlayer();
var obstacle = createObstacle();
var scoreElement = null;
// Element Creation-Section
function createPlayer() {
    return {
        x: canvas.width / 2 - 240,
        y: (canvas.height / 4) * 3,
        width: 20,
        height: 20,
        color: '#FFF',
        jumpHeight: 10,
    };
}
function createObstacle() {
    return {
        x: canvas.width,
        y: (canvas.height / 4) * 3,
        width: Math.random() * (70 - 5) + 5,
        height: 20,
        color: '#FFF',
        speed: -2,
    };
}
function spawnNewObstacle() {
    if (obstacle.x <= -50) {
        obstacle = createObstacle();
    }
    if (!gameStarted) {
        obstacle.width = Math.random() * (70 - 5) + 5;
    }
}
function removeObstacle() {
    obstacle.x = canvas.width + Math.random() * 100;
}
function createStartGameHeading() {
    var headingText = 'press space to play!';
    var heading = createHeading(headingText);
    document.body.appendChild(heading);
    // Blink every 0.5 seconds
    setInterval(function () {
        heading.style.visibility =
            heading.style.visibility === 'hidden' ? 'visible' : 'hidden';
    }, 500);
}
function createHeading(text) {
    var heading = document.createElement('h2');
    heading.innerHTML = text;
    heading.style.position = 'absolute';
    heading.style.top = '6rem';
    heading.style.color = '#FFF';
    heading.style.fontFamily = 'Monospace';
    heading.style.textAlign = 'center';
    return heading;
}
function removeStartGameHeading() {
    var heading = document.querySelector('h2');
    if (heading) {
        heading.remove();
    }
    createScoreElement();
}
function createScoreElement() {
    scoreElement = createHeading('');
    document.body.appendChild(scoreElement);
}
function createGameOverHeading() {
    var headingText = 'GAME OVER <br> <br> press space to play again!';
    var heading = createHeading(headingText);
    document.body.appendChild(heading);
    removeScore();
}
// Draw-Section
function drawRectangle(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}
function draw() {
    // draw Playfield
    drawRectangle(0, 0, canvas.width, canvas.height, '#000');
    // draw Players
    drawRectangle(player.x, player.y, player.width, player.height, player.color);
    // draw Obstacles
    if (gameStarted) {
        drawRectangle(obstacle.x, obstacle.y, obstacle.width, obstacle.height, obstacle.color);
    }
}
// Movement-Section
function moveObstacle() {
    if (gameStarted) {
        obstacle.x += obstacle.speed;
    }
}
function resetObstacleSpeed() {
    obstacle.speed = -2;
}
function jump() {
    if (!isJumping) {
        isJumping = true;
        jumpDuration = 0;
        var jumpInterval_1 = setInterval(function () {
            if (player.y > 0) {
                player.y -= player.jumpHeight * (1 + jumpDuration / 50);
                jumpDuration++;
            }
            else {
                clearInterval(jumpInterval_1);
                player.y = 0;
                isJumping = false;
                descend();
            }
        }, 20);
    }
}
function descend() {
    var descentInterval = setInterval(function () {
        if (player.y < (canvas.height / 4) * 3) {
            player.y += 4; // Adjust the descent speed as needed
        }
        else {
            clearInterval(descentInterval);
            player.y = (canvas.height / 4) * 3; // Set to the original height
            isJumping = false;
        }
    }, 20);
}
// check hit / update score
function checkHit() {
    if (player.x < obstacle.x + obstacle.width &&
        player.x + player.width > obstacle.x &&
        player.y < obstacle.y + obstacle.height &&
        player.y + player.height > obstacle.y) {
        createGameOverHeading();
        removeScore();
        removeObstacle();
        resetObstacleSpeed();
        gameStarted = false;
    }
    else if (obstacle.x + obstacle.width < player.x - 40) {
        score += 10;
        removeObstacle();
        obstacle.speed *= 1.08;
    }
}
function updateScore() {
    if (gameStarted) {
        if (!scoreElement) {
            scoreElement = createHeading('');
            document.body.appendChild(scoreElement);
        }
        scoreElement.textContent = 'score: ' + score;
    }
}
function removeScore() {
    score = 0;
    scoreElement === null || scoreElement === void 0 ? void 0 : scoreElement.remove();
}
// GameLoop-Section
function gameLoop() {
    draw();
    moveObstacle();
    spawnNewObstacle();
    checkHit();
    updateScore();
}
// Main Program
createStartGameHeading();
window.addEventListener('keydown', function (event) {
    if (event.code === 'Space' && !gameStarted) {
        gameStarted = true;
        removeStartGameHeading();
    }
    if (event.code === 'Space' && gameStarted) {
        jump();
    }
});
setInterval(gameLoop, 1000 / 60);
