// Enemies our player must avoid
var Enemy = function() {
  // Variables applied to each of our instances go here,
  // we've provided one for you to get started

  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.sprite = 'images/enemy-bug.png';

  // For now, assume all bugs travel left to right
  // starting just off canvas (x = -110)
  this.x = -110;

  // There are 3 valid starting positions
  // y = 60, 145, 230
  this.y = 60 + (Math.floor(Math.random() * 3) * 85);

  // Randomize the speed and quantize
  this.speed = 50 + (Math.floor(Math.random() * 5) * 50);
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  this.x = this.x + (dt * this.speed);
  //console.log(this.x);

  // If fall off rhs of canvas, wrap around
  if (this.x > 505) {
    this.x = -110;
  }
  //easier to do collision detection here
  //console.log(this.x, player.x, this.y, player.y);
  if ((this.x > player.x - 40) && (this.x < player.x + 40) && (this.y > player.y - 40) && (this.y < player.y + 40)) {
    //console.log('collision');
    //Reset player position (as no obvious way to use a destructor and create a new object)
    player.x = 200;
    player.y = 420;
  }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function() {
  // It's basically an enemy (although all this actually does is give it a
  // speed we never use, as other attributes are clobbered)
  Enemy.call(this);

  // The image/sprite for our player
  this.sprite = 'images/char-boy.png';

  // starting in middle of bottom row
  this.x = 200;
  this.y = 420;
};

// Player to inherit the methods of Enemy from prototype chain
// This *sounds* wrong, but has at least 2 advantages:
// 1 - saves writing duplicate render method on 2 different classes
// 2 - code executes earlier before writing all the Player specific methods
// (Probably cleaner to have a sprite parent class above Enemy and Player)

Player.prototype = Object.create(Enemy.prototype);
Player.prototype.constructor = Player;
Player.prototype.update = function() {};
Player.prototype.handleInput = function(direction) {
  // Random numbers that seem to work chosen to bound playing board
  if (direction == 'left' && this.x > 94) this.x = this.x - 95;
  if (direction == 'right' && this.x < 390) this.x = this.x + 95;
  // remember canvas counts Y axis upside down ...
  if (direction == 'up' && this.y > 50) this.y = this.y - 90;
  if (direction == 'down' & this.y < 420) this.y = this.y + 90;
  // Have we reached destination ?
  if (this.y < 50) {
    // add another enemy
    allEnemies.push(new Enemy());
    // reset position
    this.x = 200;
    this.y = 420;
  }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

// Next 3 lines minimum required to provide initial canvas render
firstEnemy = new Enemy();
allEnemies = [ firstEnemy ];
player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
// ... but I did anyway, as spent an hour trying to figure out why WASD
// kept returning undef in Player.handleInput!!!!
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    65: 'left',
    87: 'up',
    68: 'right',
    83: 'down'
  };
  //console.log(e.keyCode);
  player.handleInput(allowedKeys[e.keyCode]);
});
