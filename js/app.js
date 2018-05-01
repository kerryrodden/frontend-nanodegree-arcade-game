const COL_WIDTH = 101;
const ROW_HEIGHT = 83;
const ROW_OFFSET = 20;
const NUM_COLS = 5;
const NUM_ROWS = 6;
const BOARD_WIDTH = COL_WIDTH * NUM_COLS;
const NUM_ENEMIES = 3;

// Utility function to generate a random speed for the enemy (in pixels per second)
function randomSpeed() {
    // Choose a random number of columns per second, then multiply by column width
    return (Math.random() * 3 + 3) * COL_WIDTH;
}

// Enemies our player must avoid
// Parameters:
// row, which of the 3 road lanes this enemy should appear in (1, 2, or 3)
var Enemy = function (row) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    // Initial location
    this.x = -COL_WIDTH;
    this.y = ROW_HEIGHT * row - ROW_OFFSET; // This never changes, for a given enemy

    // Speed (pixels per second)
    this.speed = randomSpeed();
};

Enemy.prototype.checkCollisions = function () {
    var playerPosition = player.getPosition();
    var playerX = playerPosition.col * COL_WIDTH;
    var playerY = playerPosition.row * ROW_HEIGHT;
    var xDist = Math.abs(playerX - this.x);
    var yDist = Math.abs(playerY - this.y);
    if (xDist < COL_WIDTH * 0.4 && yDist === ROW_OFFSET) {
        player.reset();
    }
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + this.speed * dt;
    if (this.x > BOARD_WIDTH) {
        // Enemy has gone off screen; start again from the beginning
        this.x = -COL_WIDTH;
        // Change the enemy's speed, to keep things interesting
        this.speed = randomSpeed();
    }
    this.checkCollisions();
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// The character representing our player
var Player = function () {
    this.sprite = 'images/char-boy.png';

    // Initial (zero based) location
    this.col = 2;
    this.row = 5;

    // If the player is currently in a winning state
    this.won = false;
};

// Update the player's screen coordinates
Player.prototype.update = function () {
    this.x = COL_WIDTH * this.col;
    this.y = ROW_HEIGHT * this.row - ROW_OFFSET;
};

// Draw the player on the screen
Player.prototype.render = function () {
    if (this.won) {
        ctx.drawImage(Resources.get('images/Selector.png'), this.x, this.y);
    }
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Change the player's position according to keyboard input
Player.prototype.handleInput = function (direction) {
    // Temporarily ignore input during winning state
    if (this.won) {
        return;
    }
    switch (direction) {
        case 'up':
            this.row = Math.max(this.row - 1, 0);
            this.checkForWinningState();
            break;
        case 'down':
            this.row = Math.min(this.row + 1, NUM_ROWS - 1);
            break;
        case 'left':
            this.col = Math.max(this.col - 1, 0);
            break;
        case 'right':
            this.col = Math.min(this.col + 1, NUM_COLS - 1);
            break;
    }
};

// Return an object indicating which row and column the player is currently in
Player.prototype.getPosition = function () {
    return { col: this.col, row: this.row };
};

Player.prototype.reset = function () {
    this.col = 2;
    this.row = 5;
    this.won = false;
};

Player.prototype.checkForWinningState = function () {
    if (this.row === 0) {
        this.won = true;
        setTimeout(this.reset.bind(this), 2000);
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = [];
for (var i = 0; i < NUM_ENEMIES; i++) {
    var row = i % 3 + 1;
    allEnemies.push(new Enemy(row));
}

var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
