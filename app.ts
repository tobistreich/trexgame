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
    const playerImage = new Image();
    playerImage.src = '/dino.png';
    return {
        x: canvas.width / 2 - 240,
        y: (canvas.height / 4) * 3 - 43,
        width: 40,
        height: 43,
        image: playerImage,
        jumpHeight: 10,
    };
}

function createObstacle() {
    const sizes = [10, 20, 30];
    const selectedSize = sizes[Math.floor(Math.random() * sizes.length)];

    return {
        x: canvas.width,
        y: (canvas.height / 4) * 3,
        width: selectedSize,
        height: 20,
        color: '#535353',
        speed: -2,
    };
}

function spawnNewObstacle() {
    if (obstacle.x + obstacle.width <= 0) {
        obstacle = createObstacle();
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
    heading.style.color = '#000';
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
    drawRectangle(0, 0, canvas.width, canvas.height, '#F0F0F0');

    // draw Player
    ctx.drawImage(
        player.image,
        player.x,
        player.y,
        player.width,
        player.height,
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
        isJumping = true;
        let jumpHeight = player.jumpHeight;
        let jumpInterval = setInterval(() => {
            player.y -= jumpHeight;
            jumpHeight -= 1;

            if (jumpHeight <= 0) {
                clearInterval(jumpInterval);
                setTimeout(() => {
                    descend();
                }, 150);
            }
        }, 20);
    }
}

function descend() {
    let descentInterval = setInterval(() => {
        if (player.y < (canvas.height / 4) * 3 - 23) {
            player.y += 4; // Adjust the descent speed as needed
        } else {
            clearInterval(descentInterval);
            player.y = (canvas.height / 4) * 3 - 23; // Set to the original height
            isJumping = false;
        }
    }, 20);
}

// check hit / update score
function checkHit() {
    if (
        player.x + 5 < obstacle.x + obstacle.width &&
        player.x + player.width - 15 > obstacle.x &&
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
        obstacle.speed *= 1.12;
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
player.image.onload = () => {
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
};
