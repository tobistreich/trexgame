var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');
var gameStarted = false;
var score = 0;
var isJumping = false;
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
        jumpHeight: 25,
    };
}
function createObstacle() {
    return {
        x: 800,
        y: (canvas.height / 4) * 3,
        width: Math.random() * (50 - 10) + 10,
        height: 20,
        color: '#FFF',
        speed: -2,
    };
}
function spawnNewObstacle() {
    if (obstacle.x <= -50) {
        removeObstacle();
        obstacle = createObstacle();
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
function jump() {
    if (!isJumping) {
        player.y -= player.jumpHeight;
        isJumping = true;
        setTimeout(function () {
            player.y += player.jumpHeight;
            isJumping = false;
        }, 700);
    }
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
        gameStarted = false;
    }
    if (player.x < obstacle.x + obstacle.width &&
        player.x < obstacle.x + obstacle.width - 1) {
        score += 10;
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
