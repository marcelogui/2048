export const createCellAnim = [
    { transform: "scale(0.5, 0.5)" },
    { transform: " scale(1, 1)" },
  ];

  export const createCellOptions = {
    duration: 150,
    easing: "ease-out",
    fill: "forwards",
  };

  const translateAnimKeyframes = function (x1, y1, x2, y2) {
    // As the moving cell has different start and end positions
    // it was easier to create a function to calculate the translation
    // needed than to do that on the renderAnimationFunction
    return [
      { transform: `translate(${0}px, ${0}px)`,
        opacity: 1
      },
      { transform: `translate(${x2 - x1}px, ${y2 - y1}px)`},
    ];
  };

  const translateAnimOptions = {
    duration: 150,
    iterations: 1,
  };

  const scaleAnimKeyframes = [
    { transform: `scale(1.2)`, borderRadius: "5px" },
    { transform: `scale(1)` },
  ];

  const scaleAnimOptions = {
    duration: 200,
    iterations: 1,
    fill: "forwards",
  };

  export function renderCellAnimation(cell, [x1, y1], [x2, y2]) {

    // The moving cell is a copy of the actual cell. Is just used for animation
    // purposes as the renderBoard is the responsible for drawing the final state
    // of the board after the player move
    const cellCopy = cell.cloneNode(true);
    cellCopy.style.position = "absolute";
    cell.dataset.cellValue = 0;
    cellCopy.style.zIndex = 1;
    cell.innerText = "";
    cell.appendChild(cellCopy);

    return cellCopy
      .animate(translateAnimKeyframes(x1, y1, x2, y2), translateAnimOptions).finished
  }

  export function animateSliding(board) {
    // This functions has the purpose of setting the right properties
    // to animate each individual cell. The actual animation is done by
    // the renderCellAnimation
    const animations = [];
    for (let index = 0; index < board.boardCellsData.length; index++) {

      const indexBefore = board.boardCellsData[index].indexBefore;

      // If the cell started with no number we don't need to animate it
      if (board.boardCellsData[index].numberBefore == 0) continue;

      // We get the start coordinates and the end coordinates for the cell
      const cellBefore = board.boardCellsHTML[indexBefore];
      const [x1, y1] = board.boardCellsCoordinates[indexBefore];
      let [x2, y2] = board.boardCellsCoordinates[index];

      // if the cell has the isMerged flag set as true, we have to move it to the mergedCell
      // coordinates instead
      if (board.boardCellsData[index].isMerged){
        const mergedIndex = board.boardCellsData.findIndex((cell) => cell.id === board.boardCellsData[index].mergedTo)
        x2 = board.boardCellsCoordinates[mergedIndex][0];
        y2 = board.boardCellsCoordinates[mergedIndex][1];
      }
      // We build the animation for each one of the movind cells and store it on a vector
      animations.push(renderCellAnimation(cellBefore, [x1, y1], [x2, y2]));
    }
    return animations;
  }

  export function animateMerging(board) {
    // To animate the merging cell I had to identify which cell was merged. To do that
    // I created an attribute id for each cell so i could identify the correct one
    const animations = [];
    for (let index = 0; index < board.boardCellsData.length; index++) {
        if (board.boardCellsData[index].isMerged) {
          const indexMerged = board.boardCellsData.findIndex((cell) => cell.id === board.boardCellsData[index].mergedTo)
          animations.push(
            board.boardCellsHTML[indexMerged].animate(scaleAnimKeyframes, scaleAnimOptions)
            );
          }
    }
    return animations;
  }


