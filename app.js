const X_CLASS = "x";
const CIRCLE_CLASS = "circle";
const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
const cellElements = document.querySelectorAll("[data-cell]");
const board = document.getElementById("board");
const winningMessageElement = document.getElementById("winningMessage");
const restartButton = document.getElementById("restartButton");
const winningMessageTextElement = document.querySelector("[data-winning-message-text]");
const statusEl = document.getElementById("status");
const scoreEls = {
  x: document.getElementById("scoreX"),
  circle: document.getElementById("scoreO"),
  draw: document.getElementById("scoreD"),
};
const scores = { x: 0, circle: 0, draw: 0 };
let circleTurn;
let ended;

restartButton.addEventListener("click", startGame);
document.getElementById("newBtn").addEventListener("click", startGame);
cellElements.forEach((cell) => cell.addEventListener("click", handleClick));

const describe = (cell, i) => {
  const mark = cell.classList.contains(X_CLASS) ? "X" : cell.classList.contains(CIRCLE_CLASS) ? "O" : "empty";
  cell.setAttribute("aria-label", `Row ${Math.floor(i / 3) + 1}, column ${(i % 3) + 1}, ${mark}`);
};

function startGame() {
  circleTurn = false;
  ended = false;
  cellElements.forEach((cell, i) => {
    cell.classList.remove(X_CLASS, CIRCLE_CLASS, "win");
    describe(cell, i);
  });
  board.classList.remove("ended");
  setBoardHoverClass();
  winningMessageElement.classList.remove("show");
}

function handleClick(e) {
  const cell = e.currentTarget;
  if (ended || cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS)) return;
  const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
  cell.classList.add(currentClass);
  describe(cell, [...cellElements].indexOf(cell));
  const line = winningLine(currentClass);
  if (line) {
    line.forEach((i) => cellElements[i].classList.add("win"));
    endGame(currentClass);
  } else if (isDraw()) {
    endGame(null);
  } else {
    circleTurn = !circleTurn;
    setBoardHoverClass();
  }
}

function endGame(winner) {
  ended = true;
  board.classList.add("ended");
  const text = winner ? `${winner === CIRCLE_CLASS ? "O" : "X"} wins!` : "Draw!";
  scores[winner || "draw"]++;
  Object.entries(scoreEls).forEach(([k, el]) => (el.textContent = scores[k]));
  statusEl.textContent = text;
  winningMessageTextElement.textContent = text;
  // short pause so the winning line stays visible before the result covers the board
  setTimeout(() => {
    if (ended) {
      winningMessageElement.classList.add("show");
      restartButton.focus();
    }
  }, 700);
}

function isDraw() {
  return [...cellElements].every(
    (cell) => cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS)
  );
}

function setBoardHoverClass() {
  board.classList.remove(X_CLASS, CIRCLE_CLASS);
  board.classList.add(circleTurn ? CIRCLE_CLASS : X_CLASS);
  statusEl.textContent = circleTurn ? "O's turn" : "X's turn";
}

function winningLine(currentClass) {
  return WINNING_COMBINATIONS.find((combination) =>
    combination.every((index) => cellElements[index].classList.contains(currentClass))
  );
}

startGame();
