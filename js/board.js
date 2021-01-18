import {
  createCellAnim,
  createCellOptions,
  animateRoundPoints,
} from './animations.js';
export default class GameBoard {
  constructor() {
    this.boardCellsHTML = Array.from(
      document.querySelectorAll(".board-cell")
    );
    this.boardCellsCoordinates = this.boardCellsHTML.map((cell) => {
      const { x, y } = cell.getBoundingClientRect();
      return [x, y];
    });

    this.scoreHTML = document.getElementById('current-score');
    this.bestScoreHTML = document.getElementById('best-score');

    this.score = 0;
    this.bestScore = 0;




    this.boardCellsData = [];
    for (let i = 0; i < this.boardCellsHTML.length; i++) {
      this.boardCellsData.push({
        id: i,
        indexBefore: i,
        numberBefore: 0,
        number: 0,
        isMerged: false,
        mergedTo: undefined,
      });
    }
    this.resetBoard();
    this.createRandomCell();
    this.createRandomCell();
    this.renderBoard();
  }

  flipBoard() {
    /**
    * In place flips the board on the horizontal axis
    *
    * |0  1  2  3 |      |3  2  1  0 |
    * |4  5  6  7 | ---> |7  6  5  4 |
    * |8  9  10 11|      |11 10 9  8 |
    * |12 13 14 15|      |15 14 13 12|
    *
     */
    let newBoardCellNumbers = [];
    for (let row = 0; row < 4; row++) {
      for (let col = 3; col >= 0; col--) {
        newBoardCellNumbers.push(this.boardCellsData[row * 4 + col]);
      }
    }
    this.boardCellsData = newBoardCellNumbers;
  }

  transposeBoard() {
     /**
    * In place transposes the board
    *
    * |0  1  2  3 |      |0  4  8  12|
    * |4  5  6  7 | ---> |1  5  9  13|
    * |8  9  10 11|      |2  6  10 14|
    * |12 13 14 15|      |3  7  11 15|
    *
     */
    let newBoardCellNumbers = [];
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        newBoardCellNumbers.push(this.boardCellsData[row + col * 4]);
      }
    }
    this.boardCellsData = newBoardCellNumbers;
  }

  slideRow(row) {
    /**
     * Slide the cells in the row all the way to the right.
     *
     * [0 2 0 2] ---> [0 0 2 2]
     * [2 0 2 2] ---> [0 2 2 2]
     * [2 4 0 0] ---> [0 0 2 4]
     */
    const numbers = row.filter((cell) => cell.number !== 0);
    const zeroes = row.filter((cell) => cell.number === 0);
    return zeroes.concat(numbers);
  }

  mergeRow(row) {
    /**
     * Merge consecutive cells if their number is equal.
     * The merge is done from right to left, that is: check if the last two cells
     * are equal, if not, check the second and third last cells and so on.
     * One cell can only be merged once, so when a merge happens two cells are
     * not eligible for merging anymore.
     * The merge *has* to happen after a slide, to guarantee that all zeroes are
     * in the leftmost portion of the row. Another slide is required after the
     * merge is done to finish the movement.
     *
     * [0 0 2 2] ---> [0 0 0 4]
     * [0 2 2 2] ---> [0 2 0 4]
     * [2 2 2 2] ---> [0 4 0 4]
     */
    let rowFlipped = row.slice().reverse();
    let newRow = [];
    let points = 0;

    while (newRow.length < 4) {
      const cellNumber = rowFlipped.shift();
      if (this.isCellMergeable(newRow, cellNumber)) {
        const newMergedNumber = newRow[0].number * 2

        points += newMergedNumber;
        newRow[0].number = newMergedNumber;

        cellNumber.number = 0;
        cellNumber.isMerged = true;
        cellNumber.mergedTo = newRow[0].id;
        newRow.unshift(cellNumber);
      } else {
        newRow.unshift(cellNumber);
      }
    }
    const mergedInfo = {
      newRow,
      points,
    }
    return mergedInfo;
  }

  isCellMergeable(newRow, cellNumber) {
    if (newRow.length === 0) return false;

    const previousNumber = newRow[0].number;
    const currentNumber = cellNumber.number;

    return previousNumber === currentNumber && currentNumber !== 0;
  }

  slideBoard() {
    /**
     * Apply the slideRow for each row in the board
     */
    let newBoardCellData = [];
    for (let rowStart = 0; rowStart < 4; rowStart++) {
      let boardRowStart = this.boardCellsData.slice(
        rowStart * 4,
        rowStart * 4 + 4
      );
      let boardRow = this.slideRow(boardRowStart);
      newBoardCellData.push(...boardRow);
    }
    this.boardCellsData = newBoardCellData;
  }

  mergeBoard() {
    /**
     * Apply mergeRow for each row in the board
     */
    let newBoardCellsData = [];
    let roundPoints = 0;

    for (let rowStart = 0; rowStart < 4; rowStart++) {
      let boardRowStart = this.boardCellsData.slice(
        rowStart * 4,
        rowStart * 4 + 4
      );
      let { newRow, points } = this.mergeRow(boardRowStart);
      newBoardCellsData.push(...newRow);
      roundPoints += points;
    }
    this.boardCellsData = newBoardCellsData;
    this.score += roundPoints;
    if (roundPoints){
      animateRoundPoints(roundPoints, this.scoreHTML);
    }
  }

  createRandomCell() {
    /**
     * Create a new cell in the board.
     * This function filters all positions in the board that have zero as their
     * number, then get one of this cells randomly.
     * The number created in the cell has 90% of chance of being two(2)
     * and 10% of being four(4)
     **/
    const zeroCellsIndex = [];
    this.boardCellsData.map((cell, index) => {
      if (cell.number === 0) {
        return zeroCellsIndex.push(index);
      }
    });
    const numCells = zeroCellsIndex.length;
    if (numCells === 0) {
      return;
    }
    const indexNewCell = zeroCellsIndex[Math.floor(Math.random() * numCells)];

    let cellNumber;
    Math.random() < 0.9 ? cellNumber = 2 : cellNumber = 4;
    this.boardCellsData[indexNewCell].number = cellNumber;
    this.boardCellsHTML[indexNewCell].dataset.cellValue = cellNumber;
    this.boardCellsHTML[indexNewCell].animate(createCellAnim, createCellOptions);
  }

  renderBoard() {
  /**
   * Draws the board after a move is made
   */
    this.boardCellsData.map((cell, index) => {
      this.boardCellsHTML[index].dataset.cellValue = cell.number;
      if (cell.number !== 0) {
        this.boardCellsHTML[index].innerText = cell.number;
      } else {
        this.boardCellsHTML[index].innerText = "";
      }
    });
    this.scoreHTML.textContent = this.score;
    this.resetBoardNumbersIndex();
  }

  resetBoardNumbersIndex() {
    /**
     * After a move is done, all cells need to reset before another move is done.
     * This ensures that all the flags and numbers are updated properly.
     */
    for (let index = 0; index < this.boardCellsData.length; index++) {
      this.boardCellsData[index].indexBefore = index;
      this.boardCellsData[index].numberBefore = this.boardCellsData[index].number;
      this.boardCellsData[index].isMerged = false;
      this.boardCellsData[index].mergedTo = undefined;
    }
  }

  resetBoard() {
   /**
    * Reset the board to a starting state so the game can be played again.
    */
    this.boardCellsData.map((cell, index) => {
      cell.number = 0;
      cell.numberBefore = 0;
      cell.indexBefore = index;
      this.boardCellsHTML[index].dataset.cellValue = 0;
      this.boardCellsHTML[index].innerText = "";
    });
  }

  getCurrentState(){
    const listCellsNumbers = this.boardCellsData.map(cell => cell.number);
    return listCellsNumbers.toString();
  }
}