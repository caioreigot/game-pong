const canvas = document.getElementById('mycanvas');
const ctx = canvas.getContext('2d');

// Game variables
let newGame = false, player1win = 0, player2win = 0;

// Loading background image
img = new Image();
img.src = "./images/sheet.png";

const keys = {};

const ball = {
    // Placing the ball in the middle of the canvas
    x: canvas.width / 2 - 15, // 15 == half its width
    y: canvas.height / 2 - 15, // 15 == half its height

    height: spriteBall.height,
    width: spriteBall.width,
    dirx: -1, // "x" going left
    diry: 1,
    mod: 0, // Speed modifier (when you hit the blocks, it will increase)
    speed: 4,

    draw() {
        spriteBall.draw(this.x, this.y);
    }
};

const leftBar = {
    x: 10,
    y: canvas.height / 2 - 60,
    height: 120,
    width: 30,
    score: 0,
    speed: 15
};

const rightBar = {
    x: 560,
    y: canvas.height / 2 - 60,
    height: 120,
    width: 30,
    score: 0,
    speed: 15
};

// Identify if the user pressed any key
document.addEventListener('keydown', (e) => {
    keys[e.keyCode] = true;
    // alert(e.keyCode);
});

document.addEventListener("keyup", (e) => {
    delete keys[e.keyCode];
});

// Function responsible for moving the bars
function moveBlock() {
    // key code W = 87
    // key code S = 83

    // leftBar
    if (87 in keys && leftBar.y > 0 + 20) {
        leftBar.y -= leftBar.speed;
    }

    else if (83 in keys && leftBar.y + leftBar.height < canvas.height - 20) {
        leftBar.y += leftBar.speed;
    }

    // rightBar
    if (38 in keys && rightBar.y > 0 + 20) {
        rightBar.y -= rightBar.speed;
    }

    else if (40 in keys && rightBar.y + rightBar.height < canvas.height - 20) {
        rightBar.y += rightBar.speed;
    }
};

// Function responsible for moving the ball
function moveBall() {

    if (newGame == false) {
        if (ball.y + ball.height >= leftBar.y && ball.y <= leftBar.y + leftBar.height && ball.x <= leftBar.x + leftBar.width) {
            ball.dirx = 1;
            ball.mod += 0.1;
        } else if (ball.y + ball.height >= rightBar.y && ball.y <= rightBar.y + rightBar.height && ball.x + ball.width >= rightBar.x) {
            ball.dirx = -1;
            ball.mod += 0.1;
        }
    
        if (ball.y <= 20) {
            ball.diry = 1;
        } else if (ball.y + ball.height >= canvas.height - 20) {
            ball.diry = -1;
        }

        ball.x += (ball.speed + ball.mod) * ball.dirx;
        ball.y += (ball.speed + ball.mod) * ball.diry;
    
        // If the player failed to hit the ball
        if (ball.x < leftBar.x + leftBar.width - 15) {
            newgame('player 2');
            player2win = 1;
        } else if (ball.x + ball.width > rightBar.x + 15) {
            newgame('player 1');
            player1win = 1;
        }    
    }

};

function newgame(winner) {
    if (winner == 'player 1') {
        leftBar.score++;
    } else {
        rightBar.score++;
    }

    // Resetting the position of objects
    leftBar.y = canvas.height / 2 - leftBar.height / 2;
    rightBar.y = leftBar.y

    ball.y = canvas.height / 2 - ball.height / 2;
    ball.x = canvas.width / 2 - ball.width / 2;
    ball.mod = 0;

    newGame = true;
};

function draw() {
    
    bg.draw(0, 0);

    moveBlock();
    moveBall();

    if (newGame == true) {
        ctx.fillStyle = '#fff';
        ctx.fillRect(canvas.width / 2 - 125, canvas.height / 2 - 148, 250, 70);

        ctx.fillStyle = '#482883';
        ctx.fillText(player1win == 1 ? 'Player 1++' : 'Player 2++', canvas.width / 2 - 95, canvas.height / 2 - 100)
        setTimeout(() => {newGame = false}, 1000);
    }

    // Ball color, text and bars
    ctx.fillStyle = '#b090ea';

    ctx.fillRect(leftBar.x, leftBar.y, leftBar.width, leftBar.height);
    ctx.fillRect(rightBar.x, rightBar.y, rightBar.width, rightBar.height);

    ball.draw();

    // Score
    ctx.font = '40px Arial';
    ctx.fillText(leftBar.score, 220, 70);
    ctx.fillText(rightBar.score, canvas.width - 240, 70);

    window.requestAnimationFrame(draw); // loop
};

// setInterval(draw, 10);
draw();