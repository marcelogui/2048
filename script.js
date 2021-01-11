import GameBoard from "./board.js";
import { animateSliding, animateMerging } from "./animations.js";

const gameBoard = new GameBoard();


document.addEventListener("keydown", async (event) => {
  if (event.code === "ArrowRight") {
    gameBoard.slideBoard();
    gameBoard.mergeBoard();
    gameBoard.slideBoard();
  }
  if (event.code === "ArrowLeft") {
    gameBoard.flipBoard();
    gameBoard.slideBoard();
    gameBoard.mergeBoard();
    gameBoard.slideBoard();
    gameBoard.flipBoard();
  }
  if (event.code === "ArrowDown") {
    gameBoard.transposeBoard();
    gameBoard.slideBoard();
    gameBoard.mergeBoard();
    gameBoard.slideBoard();
    gameBoard.transposeBoard();
  }
  if (event.code === "ArrowUp") {
    gameBoard.transposeBoard();
    gameBoard.flipBoard();
    gameBoard.slideBoard();
    gameBoard.mergeBoard();
    gameBoard.slideBoard();
    gameBoard.flipBoard();
    gameBoard.transposeBoard();
  }
  await Promise.all(animateSliding(gameBoard));
  await Promise.all(animateMerging(gameBoard));

  gameBoard.createRandomCell();
  gameBoard.renderBoard();
  gameBoard.resetBoardNumbersIndex();

  console.log(checkCanMove(gameBoard.boardCellsData))

});

function checkCanMove(boardCellsData) {
  for (let cell of boardCellsData){
      if (cell.number === 0) {
          return true;
      }
  }

  for (let row=0; row<4; row++) {
    const slicedRow = boardCellsData.slice(row*4, row*4 + 4);
    const slicedTransposedRow = boardCellsData.filter((cell, index) => index % 4 === row)
    for (let col=0; col<slicedRow.length - 1; col++) {
      if (
          slicedRow[col].number === slicedRow[col + 1].number ||
          slicedTransposedRow[col].number === slicedTransposedRow[col+1].number
         ) {
        return true;
      }
    }
  }
  return false;
}