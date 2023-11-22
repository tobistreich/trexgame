const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

let gameStarted = false;
let score = 0;
let isJumping = false;

const player = createPlayer();
let obstacle = createObstacle();

let scoreElement: HTMLHeadElement | null = null;

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
    const headingText = 'press space to play!';
    const heading = createHeading(headingText);
    document.body.appendChild(heading);

    // Blink every 0.5 seconds
    setInterval(() => {
        heading.style.visibility =
            heading.style.visibility === 'hidden' ? 'visible' : 'hidden';
    }, 500);
}

function createHeading(text: string) {
    const heading = document.createElement('h2');
    heading.innerHTML = text;
    heading.style.position = 'absolute';
    heading.style.top = '6rem';
    heading.style.color = '#FFF';
    heading.style.fontFamily = 'Monospace';
    heading.style.textAlign = 'center';
    return heading;
}

function removeStartGameHeading() {
    const heading = document.querySelector('h2');
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
    const headingText = 'GAME OVER <br> <br> press space to play again!';
    const heading = createHeading(headingText);
    document.body.appendChild(heading);
    removeScore();
}

// Draw-Section

function drawRectangle(
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function draw() {
    // draw Playfield
    drawRectangle(0, 0, canvas.width, canvas.height, '#000');

    // draw Players
    drawRectangle(
        player.x,
        player.y,
        player.width,
        player.height,
        player.color,
    );

    // draw Obstacles
    if (gameStarted) {
        drawRectangle(
            obstacle.x,
            obstacle.y,
            obstacle.width,
            obstacle.height,
            obstacle.color,
        );
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
        player.y -= player.jumpHeight;
        isJumping = true;
        setTimeout(() => {
            player.y += player.jumpHeight;
            isJumping = false;
        }, 600);
    }
}

// check hit / update score
function checkHit() {
    if (
        player.x < obstacle.x + obstacle.width &&
        player.x + player.width > obstacle.x &&
        player.y < obstacle.y + obstacle.height &&
        player.y + player.height > obstacle.y
    ) {
        createGameOverHeading();
        removeScore();
        removeObstacle();
        resetObstacleSpeed();
        gameStarted = false;
    } else if (obstacle.x + obstacle.width < player.x - 40) {
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
    scoreElement?.remove();
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
window.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && !gameStarted) {
        gameStarted = true;
        removeStartGameHeading();
    }
    if (event.code === 'Space' && gameStarted) {
        jump();
    }
});

setInterval(gameLoop, 1000 / 60);
