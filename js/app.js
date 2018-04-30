const COL_HEIGHT = 101;
const ROW_HEIGHT = 83;
const ROW_OFFSET = 20;
const NUM_COLS = 5;
const NUM_ROWS = 6;

// Enemies our player must avoid
// Parameter: row, which of the 3 road lanes this enemy should appear in (1, 2, or 3)
var Enemy = function (row) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    // Initial location
    this.col = 0;
    this.row = row;
    this.x = COL_HEIGHT * this.col;
    this.y = ROW_HEIGHT * this.row - ROW_OFFSET;

    // TODO: speed
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// The character representing our player
var Player = function () {
    this.sprite = 'images/char-boy.png';

    // Initial location
    this.col = 2;
    this.row = 5;
    this.x = COL_HEIGHT * this.col;
    this.y = ROW_HEIGHT * this.row - ROW_OFFSET;

    // TODO: speed
};

// Update the player's position
// Parameter: dt, a time delta between ticks (TODO: is dt needed for the player?)
Player.prototype.update = function (dt) {
    this.x = COL_HEIGHT * this.col;
    this.y = ROW_HEIGHT * this.row - ROW_OFFSET;
};

// Draw the player on the screen
Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Change the player's position according to keyboard input
Player.prototype.handleInput = function (direction) {
    switch (direction) {
        case 'up':
            this.row = Math.max(this.row - 1, 0);
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
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = [];
allEnemies.push(new Enemy(1));
allEnemies.push(new Enemy(2));
allEnemies.push(new Enemy(3));

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
