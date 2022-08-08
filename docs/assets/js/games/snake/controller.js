snake.controller = {
    init: function() {
      snake.model.init();
      snake.view.init(this.callbacks);
      this.speed = 200;
    },
  
    loop: function() {
      // Reference the snake obj because called
      // in setInterval -- `this` is window
      snake.model.takeTurn();
      if (snake.model.checkGameOver()) {
        snake.controller.gamesOver();
      } else {
        snake.controller.nextFrame();
      }
    },
  
    runLoop: function() {
      this.gameLoop = setInterval(this.loop, this.speed);
    },
  
    callbacks: {
      changeDirection: function(e) {
        e.preventDefault();
        var direction;
        if (e.which === 38) {
         direction = 'up';
        } else if (e.which === 40) {
         direction = 'down';
        } else if (e.which === 37) {
         direction = 'left';
        } else if(e.which === 39) {
         direction = 'right';
        }
        snake.model.direction = direction || snake.model.direction;
      },
  
      startGame: function() {
        snake.controller.runLoop();
      }
    },
  
    // Helpers
    gamesOver: function() {
      snake.view.gameOver(snake.model.score);
      snake.model.reset();
      clearInterval(this.gameLoop);
    },
  
    nextFrame: function() {
      var snakeCoords = snake.model.getSnake();
      var foodPosition = snake.model.getFood();
      snake.view.render(snakeCoords, foodPosition);
    }
  }