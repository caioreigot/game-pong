const canvas = document.getElementById('mycanvas');
const ctx = canvas.getContext('2d');

// Game variables
let madePoint = false, timeToStart = 60, player1win = 0, player2win = 0;

// Loading background image
img = new Image();
img.src = "./images/sheet.png";

const keys = {};

const ball = {
    // Placing the ball in the middle of the canvas
    x: canvas.width / 2 - 16, // 15 == half its width
    y: canvas.height / 2 - 17, // 17 == half its height

    height: 34,
    width: 32,

    dirx: Math.random() < 0.5 ? 1 : -1, // "x" going left
    diry: Math.random() < 0.5 ? 1 : -1,
    mod: 0, // Speed modifier (when the ball hit the bar, it will increase)
    speed: 4,

    draw() {
        spriteBall.draw(this.x, this.y);
    }
}

const leftBar = {
    x: 10,
    y: canvas.height / 2 - 60,

    height: 120,
    width: 20,

    score: 0,
    speed: 14,
    speedBonus: 0
}

const rightBar = {
    x: 570,
    y: canvas.height / 2 - 60,

    height: 120,
    width: 20,

    score: 0,
    speed: 8
}

const speedBoost = {

    height: 30,
    width: 30,

    _orbs: [],
    insertTime: 300,
    maxInsertTime: 300,

    update() {
        if (this.insertTime == 0 && this._orbs.length == 0) {

            this._orbs.push({
                x: canvas.width / 2 - this.width / 2,
                y: 20 + (Math.random() * (canvas.height - 60)),
                height: this.height,
                width: this.width
            })

            leftBar.speedBonus = 0;

        } else {
            this.insertTime--;
        }

        // Collision with the ball
        if (this._orbs.length == 1) {
            let orb = this._orbs[0];

            if (ball.x + ball.width >= orb.x
                && ball.x <= orb.x + orb.width
                && ball.y + ball.height >= orb.y
                && ball.y <= orb.y + orb.height) {

                this._orbs.splice(0, 1)
                this.insertTime = this.maxInsertTime;

                if (ball.dirx > 0)
                    leftBar.speedBonus = 4;
            }
        }
    },

    draw() {
        if (this._orbs.length == 1) {
            let orb = this._orbs[0];
            spriteSpeedBoost.draw(orb.x, orb.y);
        }
    }

}

// Identify if the user pressed any key
document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
})

document.addEventListener("keyup", (e) => {
    delete keys[e.code];
})

// Function responsible for moving the left bar
function moveBar() {
    if ("KeyW" in keys) {
        leftBar.y -= (leftBar.speed + leftBar.speedBonus);
    }
    if (leftBar.y < 20) leftBar.y = 20;

    else if ("KeyS" in keys) {
        leftBar.y += (leftBar.speed + leftBar.speedBonus);
    }
    if  (leftBar.y + leftBar.height > canvas.height - 20) leftBar.y = canvas.height - leftBar.height - 20;
}

function IArightBar() {
    if (rightBar.y + rightBar.height / 2 < ball.y) {
        rightBar.y += rightBar.speed;
    }
    if (rightBar.y + rightBar.height + 20 > canvas.height) rightBar.y = canvas.height - rightBar.height - 20;

    else if (rightBar.y > ball.y) {
        rightBar.y -= rightBar.speed;
    }
    if  (rightBar.y < 20) rightBar.y = 20;
}

// Function responsible for moving the ball
function moveBall() {

    if (timeToStart == 0) {
        if (madePoint == false) {
            if (ball.y + ball.height >= leftBar.y && ball.y <= leftBar.y + leftBar.height && ball.x <= leftBar.x + leftBar.width) {
                ball.dirx = 1;
                ball.diry = Math.random() < 0.5 ? Math.random() * 2 : Math.random() * -2;
                ball.mod += 0.2;
            } else if (ball.y + ball.height >= rightBar.y && ball.y <= rightBar.y + rightBar.height && ball.x + ball.width >= rightBar.x) {
                ball.dirx = -1;
                ball.diry = Math.random() < 0.5 ? Math.random() * 2 : Math.random() * -2;
                ball.mod += 0.2;
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
                pointOf('player 2');
                player2win = 1;
            } else if (ball.x + ball.width > rightBar.x + 15) {
                pointOf('player 1');
                player1win = 1;
            }    
        }
    } else {
        timeToStart--;
    }

}

function pointOf(winner) {
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

    madePoint = true;
}

function update() {
    moveBar();
    moveBall();
    IArightBar();

    speedBoost.update();
}

function draw() {
    
    bg.draw(0, 0);

    // Ball color, text and bars
    ctx.fillStyle = '#b090ea';

    ctx.fillRect(leftBar.x, leftBar.y, leftBar.width, leftBar.height);
    ctx.fillRect(rightBar.x, rightBar.y, rightBar.width, rightBar.height);

    ball.draw();
    speedBoost.draw();

    // Score
    ctx.font = '40px Arial';
    ctx.fillText(leftBar.score, 220, 70);
    ctx.fillText(rightBar.score, canvas.width - 240, 70);

    // Player 1/2++ 
    if (madePoint == true) {
        ctx.fillStyle = '#fff';
        ctx.fillRect(canvas.width / 2 - 125, canvas.height / 2 - 148, 250, 70);

        ctx.fillStyle = '#482883';
        ctx.fillText(player1win == 1 ? 'Player 1++' : 'Player 2++', canvas.width / 2 - 95, canvas.height / 2 - 100)
        setTimeout(() => {madePoint = false}, 1000);
    }

    document.querySelector('#difficultyValue').textContent = rightBar.speed;
}

function decreaseDifficulty() {
    if (rightBar.speed - 1 >= 1)
        rightBar.speed--;
}

function increaseDifficulty() {
    if (rightBar.speed + 1 <= 18)
        rightBar.speed++;
}

function defaultDifficulty() {
    rightBar.speed = 8;
}

function run() {
    update();
    draw();

    window.requestAnimationFrame(run); // loop
}

// setInterval(run, 10);
run();
