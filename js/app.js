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

// Superclass of Enemy and Player
class Character {

    constructor() {
        // Current position on screen
        this.x = 0;
        this.y = 0;
        // Image used to render character (set by subclasses)
        this.sprite = '';
    }

    // Render this character's image on the screen (using canvas)
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

// Enemies our player must avoid - subclass of Character
// Parameters:
// row, which of the 3 road lanes this enemy should appear in (1, 2, or 3)
class Enemy extends Character {

    constructor(row) {
        super();

        // The image/sprite for our enemies, this uses
        // a helper we've provided to easily load images
        this.sprite = 'images/enemy-bug.png';

        // Initial location: start in the given row, offscreen to the left
        this.x = -COL_WIDTH;
        this.y = ROW_HEIGHT * row - ROW_OFFSET; // This never changes, for a given enemy

        // New property, specific to Enemy and not from Character:
        // Speed (pixels per second)
        this.speed = randomSpeed();
    }

    // Determine whether this enemy is near enough to the player to cause a collision
    checkCollisions() {
        var playerPosition = player.getPosition();
        var xDist = Math.abs(player.x - this.x);
        var yDist = Math.abs(player.y - this.y);
        // Horizontal collision distance = 40% of the column width
        if (xDist < COL_WIDTH * 0.4 && yDist === 0) {
            // Move the player back to their initial square
            player.reset();
        }
    }

    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update(dt) {
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
    }
}

// The character representing our player - subclass of Character
class Player extends Character {

    constructor() {
        super();
        this.sprite = 'images/char-boy.png';

        // New properties, specific to Player (not from Character):

        // Initial (zero based) location in the game grid
        this.col = 2;
        this.row = 5;

        // If the player is currently in a winning state
        this.won = false;
    }

    // Update the player's screen coordinates
    update() {
        this.x = COL_WIDTH * this.col;
        this.y = ROW_HEIGHT * this.row - ROW_OFFSET;
    }

    // Draw the player on the screen - override parent to include winning state
    render() {
        if (this.won) {
            ctx.drawImage(Resources.get('images/Selector.png'), this.x, this.y);
        }
        // Use parent's method to render the character's sprite
        super.render();
    }

    // Change the player's position according to keyboard input
    handleInput(direction) {
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
    }

    // Return an object indicating the player's current x,y position on the screen
    getPosition() {
        return { x: this.x, y: this.y };
    }

    // Reset the player's position and winning state
    reset() {
        this.col = 2;
        this.row = 5;
        this.won = false;
    }

    // Check whether the player is now in a winning position
    checkForWinningState() {
        if (this.row === 0) {
            this.won = true;
            // Reset the player's position after a delay to show the winning state
            // Use bind() to retain the current "this", because setTimeout uses "window" as "this"
            setTimeout(this.reset.bind(this), 2000);
        }
    }
}

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
