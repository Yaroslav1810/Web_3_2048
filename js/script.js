const gridElement = document.getElementById("grid");

const newGameButton = document.getElementById("restart-button");
const scoreValue = document.getElementById("score");

let score = 0;

let board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
];

for (let i = 0; i < 16; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    gridElement.append(cell);
}

function add(line, direction) {
    let numbers = [...line]; // копия

    let reversed = false;

    if (direction === "ArrowRight" || direction === "ArrowDown") {
        reversed = true;
    }

    if (reversed) {
        numbers.reverse();
    }

    numbers = numbers.filter(number => number !== 0);

    for (let index = 0; index < numbers.length - 1; index++) {
        if (numbers[index] == numbers[index + 1]) {
            numbers[index] = numbers[index] + numbers[index + 1];
            score += numbers[index];
            numbers.splice(index + 1, 1);

            index = -1;
        }
    }

    while (numbers.length < 4) {
        numbers.push(0);
    }

    if (reversed) {
        numbers.reverse();
    }

    return numbers;
}

function add_row(direction) {
    const result = [];

    for (const line of board) {
        result.push(add(line, direction));
    }

    board = result;
}

function add_column(direction) {
    for (let column = 0; column < 4; column++) {
        const line = [];

        for (let row = 0; row < 4; row++) {
            line.push(board[row][column]);
        }

        const result = add(line, direction);

        for (let row = 0; row < 4; row++) {
            board[row][column] = result[row];
        }
    }
}

function renderBoard() {
    const cells = gridElement.children;
    let Index = 0;

    for (let row = 0; row < 4; row++) {
        for (let column = 0; column < 4; column++) {
            const cell = cells[Index];
            const value = board[row][column];

            if (value == 0) {
                cell.textContent = "";
            } else {
                cell.textContent = value;
            }

            Index++;
        }
    }

    scoreValue.textContent = score;

    localStorage.setItem("board", JSON.stringify(board));
    localStorage.setItem("score", JSON.stringify(score));
}

function addRandomTile() {
    let cords = [];

    for (let row = 0; row < 4; row++) {
        for (let column = 0; column < 4; column++) {
            if (board[row][column] === 0) {
                cords.push([row, column]);
            }
        }
    }

    let new_tiles = Math.floor(Math.random() * 2) + 1;

    if (new_tiles > cords.length) {
        new_tiles = cords.length;
    }

    for (let i = 0; i < new_tiles; i++) {
        let cord = Math.floor(Math.random() * cords.length);

        board[cords[cord][0]][cords[cord][1]] = (Math.floor(Math.random() * 2) + 1) * 2;

        cords.splice(cord, 1);
    }
}

function isGameOver() {
    for (let row = 0; row < 4; row++) {
        for (let column = 0; column < 4; column++) {
            if (board[row][column] === 0) {
                return false;
            }

            if (column < 3) { // правый сосед
                if (board[row][column] === board[row][column + 1]) {
                    return false;
                }
            }

            if (row < 3) { // нижний сосед
                if (board[row][column] === board[row + 1][column]) {
                    return false;
                }
            }
        }
    }

    return true;
}

function newBoard () {

    let cords = [];

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            board[i][j] = 0;
            cords.push([i, j]);
        }
    }

    let new_tiles = Math.floor(Math.random() * 3) + 1;

    for (let i = 0; i < new_tiles; i++) {
        let cord = Math.floor(Math.random() * cords.length);

        board[cords[cord][0]][cords[cord][1]] = (Math.floor(Math.random() * 2) + 1) * 2;

        cords.splice(cord, 1);
    }

    score = 0;
    renderBoard();

}

document.addEventListener("keydown", function (event) {
    const previousBoard = JSON.stringify(board); // старая доска
    switch (event.key) {
        case "ArrowLeft":
        case "ArrowRight":
            event.preventDefault();
            add_row(event.key);
            break;

        case "ArrowUp":
        case "ArrowDown":
            event.preventDefault();
            add_column(event.key);
            break;

        default:
            return;
    }

    if (JSON.stringify(board) !== previousBoard) {
        addRandomTile();
    }

    renderBoard();

    if (isGameOver()) {
        newBoard();
        // сохранить счет и таблица рекордов и тд.
        score = 0; // пока что так
    }
});

newGameButton.addEventListener("click", newBoard);

if (localStorage.getItem("board") != null) {
    board = JSON.parse(localStorage.getItem("board"));
}
else {
    newBoard();
}

if (localStorage.getItem("score") != null) {
    score = JSON.parse(localStorage.getItem("score"));
}
else {
    score = 0;
}

renderBoard();