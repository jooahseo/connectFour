/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
  for(let i = 0; i<HEIGHT; i++){
    const innerArr = [];
    for(let j=0; j<WIDTH; j++){
      innerArr.push(null);
    }
    board.push(innerArr);

  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.querySelector('#board');

  // TODO: add comment for this code
  // create top row where user click to play: id = "column-top" & 
  // create table data of row and give them id = index & apeend to row and htmlBoard
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  // top.addEventListener("hover",function(){
  //   top.style.backgroundColor = currPlayer === 1 ? 'red':'blue';
  // })
  top.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    headCell.addEventListener("mouseover",function(){
      headCell.style.backgroundColor = currPlayer === 1 ? 'red':'blue';
    });
    headCell.addEventListener("mouseout",function(){
      headCell.style.backgroundColor = "white";
    });
    top.append(headCell);
  }
  
  htmlBoard.append(top);

  // TODO: add comment for this code
  // create board under the top row. Create each element, give them an id based on
  // their position, and append to row => append to htmlBaord. 
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // TODO: write the real version of this, rather than always returning 0
  for(let y = HEIGHT-1; y>=0; y--){
    if(board[y][x] !== 1 && board[y][x] !== 2){
      return y;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  //create div and add "piece" and "p1 or p2" class in it. 
  const occupied = document.createElement('div');
  occupied.classList.add('piece'); 
  occupied.classList.add(`p${currPlayer}`);
  //insert div into correct table cell
  const selected = document.getElementById(`${y}-${x}`);
  selected.append(occupied);
  
}

/** endGame: announce game end */

function endGame(msg) {
  // TODO: pop up alert message
  const newDiv = document.createElement('div');
  const msgBoard = document.querySelector('#message');
  const btn = document.createElement('button');
  btn.innerText ="Restart";
  btn.addEventListener('click',restart);
  newDiv.innerText = msg;
  newDiv.append(btn);
  msgBoard.append(newDiv);
  disableBoard();
}

function disableBoard(){
  const top = document.querySelector("#column-top");
  top.removeEventListener("click", handleClick);
}
function restart(){
  currPlayer = 1;
  board.splice(0, board.length);
  const htmlBoard = document.querySelector('#board');
  htmlBoard.innerHTML ="";

  const msgBoard = document.querySelector('#message');
  msgBoard.innerHTML ="";
  makeBoard();  
  makeHtmlBoard();
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  const x = +evt.target.id;
  
  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  board[y][x] = currPlayer;
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame
  if(checkBoardFilled()){
    return endGame("no winner in this game.");
  }
  // switch players
  // TODO: switch currPlayer 1 <-> 2
  currPlayer = currPlayer === 1 ? 2:1;
}

function checkBoardFilled(){
  let count = 0;
  for(let y = 0; y<HEIGHT; y++){
    if(!board[y].every(isFilled)){
      count++;
    }
  }
  return count === 0;
}

const isFilled = (val) => val !== null;
/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.
  // this function checking the entire board everytime instead of checking 
  // it from the point where user dropped a piece. 
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
