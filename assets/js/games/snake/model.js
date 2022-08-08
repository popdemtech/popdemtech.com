var snake = {};

snake.model = {
  boardWidth: 700,
  boardHeight: 500,
  divWidth: 50,
  directions: {
    up: [0,-50],
    down: [0,50],
    left: [-50, 0],
    right: [50,0]
  },
  boardEdges: {
    top: 0,
    bottom: this.boardHeight,
    left: 0,
    right: this.boardWidth
  },

  init: function() {
    this.setRandomFood();
    this.snakeBody = [[350, 250]];
    this.direction = 'left';
    this.score = 0;
    this.gameOver = false;
  },

  takeTurn: function() {
    this.move();
    this.gameOver = this.collisionCheck(); 
  },

  checkGameOver: function() {
    return snake.model.gameOver;
  },

  reset: function() {
    this.init();
  },

  getSnake: function() {
    return this.snakeBody;
  },

  getFood: function() {
    return this.foodPosition;
  },

  // Helpers
  getSnakeHead: function() {
    return this.snakeBody[0];
  },

  setRandomFood: function() {
    var x = Math.floor(Math.random() * this.boardWidth - this.divWidth);
    var y = Math.floor(Math.random() * this.boardHeight - this.divWidth);

    if (x < 50) { x = 50 }
    if (y < 50) { y = 50 }
    this.foodPosition = [x, y];
  },

  collisionCheck: function() {
    return this.hitWall() || this.hitSelf();
  },

  hitWall: function() {
    var snakeHead = this.getSnakeHead();
    var hitRightWall = (snakeHead[0] + this.divWidth) > this.boardWidth;
    var hitLeftWall = snakeHead[0] < 0;
    var hitTopWall = snakeHead[1] < 0;
    var hitBottomWall = (snakeHead[1] + this.divWidth) > this.boardHeight;
    return (hitRightWall || hitLeftWall || hitTopWall || hitBottomWall);
  },

  hitSelf: function() {
    var snakeHead = this.getSnakeHead();
    var hasLongBody = this.snakeBody.length > 1;
    var headHitBody = false;

    for (var i = 1; i < this.snakeBody.length; i++) {
      if (this.snakeBody[i][0] === snakeHead[0] &&
          this.snakeBody[i][1] === snakeHead[1]) {
        headHitBody = true;
        break;
      }
    }
    return hasLongBody && headHitBody;
  },

  move: function() {
    this.moveForward();
    if (this.atFood()) {
      this.eatFood();
    } else {
      this.snakeBody.pop();
    }
  },

  moveForward: function() {
    // TODO check why this.snakeHead returns
    // different value than getSnakeHead
    var currentHead = this.getSnakeHead();
    var directionVector = this.directions[this.direction];
    var directionX = directionVector[0];
    var directionY = directionVector[1];
    var newHeadX = currentHead[0] + directionX;
    var newHeadY = currentHead[1] + directionY;
    var newHead = [newHeadX, newHeadY];
    this.snakeBody.unshift(newHead);
  },

  eatFood: function() {
    this.setRandomFood();
    this.score++;
  },

  atFood: function() {
    var withinFood = false;
    if (this.checkTopLeft()) {
      withinFood = true;
    } else if (this.checkTopRight()) {
      withinFood = true;
    } else if (this.checkBottomLeft()) {
      withinFood = true;
    } else if (this.checkBottomRight()) {
      withinFood = true;
    }
    return withinFood;
  },

  checkTopLeft: function() {
    currentSnakeHead = this.getSnakeHead();
    snakeX = currentSnakeHead[0];
    snakeY = currentSnakeHead[1];
    var withinWidth = snakeX >= this.foodPosition[0] && snakeX <= this.foodPosition[0] + 50;
    var withinHeight = snakeY >= this.foodPosition[1] && snakeY <= this.foodPosition[1] + 50;
    return withinHeight && withinWidth;
  },
  checkTopRight: function() {
    currentSnakeHead = this.getSnakeHead();
    snakeX = currentSnakeHead[0] + 50;
    snakeY = currentSnakeHead[1];
    var withinWidth = snakeX >= this.foodPosition[0] && snakeX <= this.foodPosition[0] + 50;
    var withinHeight = snakeY >= this.foodPosition[1] && snakeY <= this.foodPosition[1] + 50;
    return withinHeight && withinWidth;
  },
  checkBottomLeft: function() {
    currentSnakeHead = this.getSnakeHead();
    snakeX = currentSnakeHead[0];
    snakeY = currentSnakeHead[1] + 50;
    var withinWidth = snakeX >= this.foodPosition[0] && snakeX <= this.foodPosition[0] + 50;
    var withinHeight = snakeY >= this.foodPosition[1] && snakeY <= this.foodPosition[1] + 50;
    return withinHeight && withinWidth;
  },
  checkBottomRight: function() {
    currentSnakeHead = this.getSnakeHead();
    snakeX = currentSnakeHead[0] + 50;
    snakeY = currentSnakeHead[1] + 50;
    var withinWidth = snakeX >= this.foodPosition[0] && snakeX <= this.foodPosition[0] + 50;
    var withinHeight = snakeY >= this.foodPosition[1] && snakeY <= this.foodPosition[1] + 50;
    return withinHeight && withinWidth;
  }
}