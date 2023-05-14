"use strict";

// BOARD MODULE
const gameBoard = (() => {
  const board = [];
  for (let i = 0; i < 3; i++) {
    board[i] = [];
    for (let j = 0; j < 3; j++) {
      board[i].push("");
    }
  }

  const getBoard = () => board;

  return {
    board,
    getBoard,
  };
})();

// PLAYER FACTORY
const Player = (name, sign) => {
  const getName = () => name;
  const getSign = () => sign;
  return {
    getName,
    getSign,
  };
};

// CREATE PLAYERS
let playerOne = Player("Player One", "X");
let playerTwo = Player("Player Two", "O");

// GAME LOGIC MODULE
const gameController = (() => {
  let board = gameBoard.board;

  const getPlayerValue = () => {
    const playerOneInput = document.querySelector(".player-one");
    const playerOneValue = playerOneInput.value;
    return { playerOneValue };
  };

  let activePlayer = playerOne;

  const getActivePlayer = () => activePlayer;

  const switchTurn = () => {
    activePlayer = activePlayer === playerOne ? playerTwo : playerOne;
  };

  const checkAvailable = (row, col) => {
    if (board[row][col] !== "") {
      return false;
    } else return true;
  };

  const win = () => {
    if (
      (board[0][0] === "X" && board[0][1] === "X" && board[0][2] === "X") ||
      (board[1][0] === "X" && board[1][1] === "X" && board[1][2] === "X") ||
      (board[2][0] === "X" && board[2][1] === "X" && board[2][2] === "X") ||
      (board[0][0] === "X" && board[1][0] === "X" && board[2][0] === "X") ||
      (board[0][1] === "X" && board[1][1] === "X" && board[2][1] === "X") ||
      (board[0][2] === "X" && board[1][2] === "X" && board[2][2] === "X") ||
      (board[0][0] === "X" && board[1][1] === "X" && board[2][2] === "X") ||
      (board[0][2] === "X" && board[1][1] === "X" && board[2][0] === "X") ||
      (board[0][0] === "O" && board[0][1] === "O" && board[0][2] === "O") ||
      (board[1][0] === "O" && board[1][1] === "O" && board[1][2] === "O") ||
      (board[2][0] === "O" && board[2][1] === "O" && board[2][2] === "O") ||
      (board[0][0] === "O" && board[1][0] === "O" && board[2][0] === "O") ||
      (board[0][1] === "O" && board[1][1] === "O" && board[2][1] === "O") ||
      (board[0][2] === "O" && board[1][2] === "O" && board[2][2] === "O") ||
      (board[0][0] === "O" && board[1][1] === "O" && board[2][2] === "O") ||
      (board[0][2] === "O" && board[1][1] === "O" && board[2][0] === "O")
    ) {
      return true;
    } else false;
  };

  const winningScenario = () => `${getActivePlayer().getName()} Is The Winner!`;

  const checkTie = () => {
    const numbers = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        numbers.push(board[i][j]);
      }
    }
    return numbers;
  };

  const tie = () => {
    if (!checkTie().includes("")) {
      return true;
    } else return false;
  };

  const resetGame = () => {
    board = board.map((row) => row.map((cell) => (cell = "")));
    activePlayer = playerOne;
    displayController.updateScreen();
  };

  const playRound = (row, col) => {
    if (checkAvailable(row, col)) {
      board[row][col] = getActivePlayer().getSign();
      if (win()) {
        winningScenario();
        return;
      }
      switchTurn();
      displayController.updateScreen();
    } else {
      return;
    }
  };

  return {
    playRound,
    resetGame,
    getActivePlayer,
    win,
    getPlayerValue,
    winningScenario,
    tie,
    checkTie,
  };
})();

// DISPLAY MODULE
const displayController = (() => {
  const btnContainer = document.querySelector(".buttons-container");
  const board = document.querySelector(".board");
  const turn = document.querySelector(".turn");

  // update screen content
  const updateScreen = () => {
    turn.textContent = `It's ${gameController
      .getActivePlayer()
      .getName()}'s Turn!`;
    gameBoard.board.forEach((row, index) => {
      const rowNum = index;
      row.forEach((cell, index) => {
        const btn = document.createElement("button");
        btn.classList.add("cell");
        btn.dataset.row = rowNum;
        btn.dataset.col = index;
        board.appendChild(btn);
        btn.addEventListener("click", cellClickHandler);
      });
    });
  };

  // submit players
  const openForm = () => {
    const startBtn = document.querySelector(".start");
    startBtn.removeEventListener("click", openFormClickHandler);
    startBtn.addEventListener("click", openFormClickHandler);
  };

  // start the game
  const start = () => {
    const submitBtn = document.querySelector(".submit-button");
    submitBtn.addEventListener("click", submitClickHandler);
  };

  const restartGame = () => {
    const restart = document.createElement("button");
    restart.classList.add("restart");
    restart.textContent = "Restart";
    restart.addEventListener("click", restartClickHandler);
    btnContainer.appendChild(restart);
    const btn = document.querySelectorAll(".cell");
    btn.forEach((btn) => (btn.disabled = true));
  };

  // click handlers
  const submitClickHandler = (event) => {
    event.preventDefault();
    const playerOneInput = document.querySelector(".player-one-input");
    const playerOneValue = playerOneInput.value;

    const playerTwoInput = document.querySelector(".player-two-input");
    const playerTwoValue = playerTwoInput.value;
    playerOne.getName = () => playerOneValue;
    playerTwo.getName = () => playerTwoValue;
    updateScreen();

    const form = document.querySelector(".player-submit");
    form.classList.remove("active");

    const overlay = document.querySelector(".overlay");
    overlay.classList.remove("active");

    const game = document.querySelector(".game");
    game.classList.add("active");
  };

  const openFormClickHandler = () => {
    const form = document.querySelector(".player-submit");
    form.classList.add("active");

    const startBtn = document.querySelector(".start");
    startBtn.classList.remove("active");

    const overlay = document.querySelector(".overlay");
    overlay.classList.add("active");
    overlay.removeEventListener("click", overlayClickHandler);
    overlay.addEventListener("click", overlayClickHandler);
  };

  const overlayClickHandler = (e) => {
    if (e.target.classList.contains("active")) {
      const form = document.querySelector(".player-submit");
      form.classList.remove("active");

      const overlay = document.querySelector(".overlay");
      overlay.classList.remove("active");

      const start = document.querySelector(".start");
      start.classList.add("active");
    }
  };

  const restartClickHandler = () => {
    gameController.resetGame();
    const btn = document.querySelectorAll(".cell");
    btn.forEach((cell) => {
      cell.textContent = "";
      cell.disabled = false;
    });
    const restartBtn = document.querySelector(".restart");
    btnContainer.removeChild(restartBtn);
  };

  const cellClickHandler = (e) => {
    if (e.target.textContent !== "") {
      return;
    } else {
      e.target.textContent = gameController.getActivePlayer().getSign();
      gameController.playRound(e.target.dataset.row, e.target.dataset.col);
      if (gameController.tie()) {
        restartGame();
        turn.textContent = `It's A Tie!`;
      }
      if (gameController.win()) {
        restartGame();
        turn.textContent = gameController.winningScenario();
      }
    }
  };

  openForm();
  start();
  updateScreen();

  return {
    updateScreen,
    turn,
  };
})();
