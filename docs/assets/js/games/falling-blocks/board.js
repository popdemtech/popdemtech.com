"use strict";

var TETRIS = TETRIS || {};
var Board = TETRIS.Board = function(params) {
  this.blockArray = [];
  this.piece = undefined;
  this.edges = {
    top: params.top,
    right: params.right,
    bottom: params.bottom,
    left: params.left
  }
  this.boardState = new Array(20).fill(0)

  this.resetState = function(index){
    this.boardState[index] = 0
  }
}