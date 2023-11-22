const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

let gameStarted = false;
let score = 0;

const player = createPlayer();
const obstacle = createObstacle();

let scoreElement: HTMLHeadElement | null = null;

function createPlayer() {
    return {
        x: canvas.width / 2 - 240,
        y: (canvas.height / 4) * 3,
        width: 20,
        height: 20,
        color: '#FFF',
        jumpHeight: 15,
    };
}

function createObstacle() {
    return {
        x: Math.random() * (500 - 400) + 400,
        y: (canvas.height / 4) * 3,
        width: Math.random() * (50 - 10) + 10,
        height: 20,
        color: '#FFF',
        speed: -2,
    };
}

function spawnNewObstacle() {
    if (obstacle.x <= canvas.width )
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
}

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

function handleKeyDown(event: KeyboardEvent) {
    switch (event.key) {
        case 'Space':
            player.y += player.jumpHeight;
    }
}

function moveObstacle() {
    if (gameStarted) {
        obstacle.x += obstacle.speed;
    }
}

function gameLoop() {
    draw();
    moveObstacle();
}

// Main Program
createStartGameHeading();
window.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && !gameStarted) {
        gameStarted = true;
        removeStartGameHeading();
    }
});
setInterval(gameLoop, 1000 / 60);
