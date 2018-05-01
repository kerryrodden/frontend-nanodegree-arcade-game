// Width of a column
const COL_WIDTH = 101;

// Height of a row
const ROW_HEIGHT = 83;

// How many pixels we need to shift an image inside a row, so it looks good when rendered
const ROW_OFFSET = 20;

// Number of columns
const NUM_COLS = 5;

// Number of rows
const NUM_ROWS = 6;

// Width of the board
const BOARD_WIDTH = COL_WIDTH * NUM_COLS;

// Total number of enemies we want
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
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    // Initial location: start in the given row, offscreen to the left
    this.x = -COL_WIDTH;
    this.y = ROW_HEIGHT * row - ROW_OFFSET; // This never changes, for a given enemy

    // Speed (pixels per second)
    this.speed = randomSpeed();
};

// Determine whether this enemy is near enough to the player to cause a collision
Enemy.prototype.checkCollisions = function () {
    var playerPosition = player.getPosition();
    var playerX = playerPosition.col * COL_WIDTH;
    var playerY = playerPosition.row * ROW_HEIGHT;
    var xDist = Math.abs(playerX - this.x);
    var yDist = Math.abs(playerY - this.y);
    // Horizontal collision distance = 40% of the column width
    if (xDist < COL_WIDTH * 0.4 && yDist === ROW_OFFSET) {
        player.reset();
    }
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
    // Multiply any movement by the dt parameter, to ensure the game runs
    // at the same speed for all computers.
    this.x = this.x + this.speed * dt;
    if (this.x > BOARD_WIDTH) {
        // Enemy has gone off screen to the right; start again from the beginning
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

    // Initial (zero based) location in the game grid
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
    // Determine new position based on which arrow key was pressed
    // Use Math.max and Math.min as needed to ensure that the player does not move offscreen
    switch (direction) {
        case 'up':
            this.row = Math.max(this.row - 1, 0);
            // Moving up is the only way to win, so check for a winning state at this point
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

// Reset the player's position and winning state
Player.prototype.reset = function () {
    this.col = 2;
    this.row = 5;
    this.won = false;
};

// Check whether the player is now in a winning position
Player.prototype.checkForWinningState = function () {
    if (this.row === 0) {
        this.won = true;
        // Reset the player's position after a delay to show the winning state
        // Use bind() to retain the current "this", because setTimeout uses "window" as "this"
        setTimeout(this.reset.bind(this), 2000);
    }
};

// Instantiate the objects.
// Place all enemy objects in an array called allEnemies
var allEnemies = [];
for (var i = 0; i < NUM_ENEMIES; i++) {
    var row = i % 3 + 1;
    allEnemies.push(new Enemy(row));
}

// Place the player object in a variable called player
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
