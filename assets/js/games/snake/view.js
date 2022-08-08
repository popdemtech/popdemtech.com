snake.view = {
    init: function(callbacks) {
      $(document).keydown(callbacks.changeDirection);
      $('#play-button').click(function(e) {
        $(e.target).parent('#board-info').hide();
        callbacks.startGame();
      })
    },
  
    render: function(snakeCoords, foodPosition) {
      // Within forEach, `this` is window
      var self = this;
  
      self.clearBoard();
      snakeCoords.forEach(function(segmentCoord) {
        self.paintDiv(segmentCoord, 'snake')
      });
      self.paintDiv(foodPosition, 'food');
    },
  
    gameOver: function(score) {
      $('.boardBlock').remove();
      $('#main-info').text('Game over');
      $('.extra-info').text('Score: ' + score);
      $('#board-info').show();
    },
  
    // Helpers
    paintDiv: function(coordinates, divClass) {
      var x = coordinates[0];
      var y = coordinates[1];
      var $newDiv = $('<div>')
        .addClass(divClass)
        .addClass('boardBlock')
        .css({ top: y, left: x });
      $newDiv.appendTo('#board');
    },
  
    clearBoard: function() {
      $('.boardBlock').remove();
    }
  }