let boxes = document.querySelectorAll(".box");
let turn = "X";
let isGameOver = false;
let aiPlayer = "O";

boxes.forEach(e => {
    e.innerHTML = "";
    e.addEventListener("click", () => {
        if (!isGameOver && e.innerHTML === "" && turn === "X") {
            e.innerHTML = turn;
            checkWin();
            checkDraw();
            if (!isGameOver) {
                changeTurn();
                setTimeout(aiMove, 500); // Delay AI move for better UX
            }
        }
    });
});

function changeTurn() {
    turn = turn === "X" ? "O" : "X";
    document.querySelector(".bg").style.left = turn === "X" ? "0" : "85px";
}

function checkWin() {
    let winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    for (let i = 0; i < winConditions.length; i++) {
        let [a, b, c] = winConditions[i];
        if (boxes[a].innerHTML && boxes[a].innerHTML === boxes[b].innerHTML && boxes[a].innerHTML === boxes[c].innerHTML) {
            isGameOver = true;
            document.querySelector("#results").innerHTML = turn + " wins";
            document.querySelector("#play-again").style.display = "inline";
            [a, b, c].forEach(index => {
                boxes[index].style.backgroundColor = "#08D9D6";
                boxes[index].style.color = "#000";
            });
            return;
        }
    }
}

function checkDraw() {
    if (!isGameOver) {
        let isDraw = [...boxes].every(box => box.innerHTML !== "");
        if (isDraw) {
            isGameOver = true;
            document.querySelector("#results").innerHTML = "Draw";
            document.querySelector("#play-again").style.display = "inline";
        }
    }
}

function aiMove() {
    if (isGameOver) return;
    
    // Check for winning move
    let aiWinMove = findWinningMove(aiPlayer);
    if (aiWinMove !== -1) {
        makeMove(aiWinMove);
        return;
    }
    
    // Block player's winning move
    let blockMove = findWinningMove("X");
    if (blockMove !== -1) {
        makeMove(blockMove);
        return;
    }
    
    // Take center if available
    if (boxes[4].innerHTML === "") {
        makeMove(4);
        return;
    }
    
    // Take a corner
    let corners = [0, 2, 6, 8];
    let availableCorners = corners.filter(i => boxes[i].innerHTML === "");
    if (availableCorners.length > 0) {
        makeMove(availableCorners[Math.floor(Math.random() * availableCorners.length)]);
        return;
    }
    
    // Take any available space
    let availableSpaces = [...boxes].map((box, i) => box.innerHTML === "" ? i : null).filter(i => i !== null);
    if (availableSpaces.length > 0) {
        makeMove(availableSpaces[Math.floor(Math.random() * availableSpaces.length)]);
    }
}

function findWinningMove(player) {
    let winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    for (let condition of winConditions) {
        let [a, b, c] = condition;
        if (boxes[a].innerHTML === player && boxes[b].innerHTML === player && boxes[c].innerHTML === "") return c;
        if (boxes[a].innerHTML === player && boxes[c].innerHTML === player && boxes[b].innerHTML === "") return b;
        if (boxes[b].innerHTML === player && boxes[c].innerHTML === player && boxes[a].innerHTML === "") return a;
    }
    return -1;
}

function makeMove(index) {
    boxes[index].innerHTML = aiPlayer;
    checkWin();
    checkDraw();
    if (!isGameOver) {
        changeTurn();
    }
}

document.querySelector("#play-again").addEventListener("click", () => {
    isGameOver = false;
    turn = "X";
    document.querySelector(".bg").style.left = "0";
    document.querySelector("#results").innerHTML = "";
    document.querySelector("#play-again").style.display = "none";

    boxes.forEach(e => {
        e.innerHTML = "";
        e.style.removeProperty("background-color");
        e.style.color = "#fff";
    });
});
