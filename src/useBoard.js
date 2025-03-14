export default function useBoard( board, setBoard, rows, columns, score, setScore, setIsGameOver ) {
    let tempBoard = [];
    let deltaScore = 0;

    function filterZeros(row) {
        return row.filter(num => num != 0);
    }

    function slide(row) {
        //console.log("slide.called with row", row, row.length);
        // clear out zero values
        row = filterZeros(row);

        // merge cells with the one on the left if it is the same value
        for (let i = 0; i < row.length - 1; i++) {
            console.log("slide.values about to check", row[i], row[i+1])
            if (row[i] == row[i+1]) {
                //console.log("slide.values found to be equal", row[i], row[i+1])
                row[i] *= 2;
                row[i+1] = 0;
                deltaScore = deltaScore + row[i];
            }
        }
        // clear out zero values again
        row = filterZeros(row);
        // put zero values back
        while(row.length < columns) {
            row.push(0);
        }
        return row;
    }

    function slideLeft() {
        for (let r = 0; r < rows; r++) {
            //console.log("slideLeft.processing row", tempBoard[r])
            let row = tempBoard[r];
            row = slide(row);
            tempBoard[r] = row;
        }
    }

    // the idea to reverse() the row and have slideRight() work like slideLeft() was given to me by a YouTube video by
    // Kenny Yip Coding and can be found here: https://www.youtube.com/watch?v=XM2n1gu4530&ab_channel=KennyYipCoding
    function slideRight() {
        for (let r = 0; r < rows; r++) {
            //console.log("slideLeft.processing row", tempBoard[r])
            let row = tempBoard[r];
            row.reverse();
            row = slide(row);
            row.reverse();
            tempBoard[r] = row;
        }
    }

    function slideUp() {
        for (let c = 0; c < columns; c++) {
            let row = [tempBoard[0][c], tempBoard[1][c], tempBoard[2][c], tempBoard[3][c]];
            row = slide(row);
            tempBoard[0][c] = row[0];
            tempBoard[1][c] = row[1];
            tempBoard[2][c] = row[2];
            tempBoard[3][c] = row[3];
        } 
    }

    function slideDown() {
        for (let c = 0; c < columns; c++) {
            let row = [tempBoard[0][c], tempBoard[1][c], tempBoard[2][c], tempBoard[3][c]];
            row = row.reverse();
            row = slide(row);
            row = row.reverse();
            tempBoard[0][c] = row[0];
            tempBoard[1][c] = row[1];
            tempBoard[2][c] = row[2];
            tempBoard[3][c] = row[3];
        } 
    }

    function gameHasSpaces() {
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < columns; c++) {
                if (tempBoard[r][c] == 0) {
                    console.log("gameHasSpace at", r, c);
                    return true;
                }
            }
        }
        return false;
    }

    function gameHasHorizontalMoves() {
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < columns - 1; c++) {
              if (tempBoard[r][c] === tempBoard[r][c + 1]) {
                console.log("gameHasHorizontalMoves at",r,c, r,c+1);
                return true;
              }
            }
          }
        return false;
    }
    function gameHasVerticalMoves() {
        for (let r = 0; r < rows - 1; r++) {
            for (let c = 0; c < columns; c++) {
              if (tempBoard[r][c] === tempBoard[r + 1][c]) {
                console.log("gameHasVerticalMoves at", r,c, r+1,c);
                return true
              }
            }
        }
        return false;
    }

    // see if any cell is empty or any side by side cells are the same. if there is at least one of these
    // available, then the game is not over 
    function isGameOver() {
        if (gameHasSpaces()) return false;
        if (gameHasHorizontalMoves() || gameHasVerticalMoves()) return false;
        return true;
    }

    function addRandomEntry() {
        if (!gameHasSpaces()) {
            console.log("addRandomEntry. No spaces available to add. returning");
        }
        let randomNumber = Math.random() < 0.9 ? 2 : 4;
        let randomCellEntry = Math.floor(Math.random() * 16);
        let row = Math.floor(randomCellEntry / 4);
        let column = randomCellEntry % 4;

        let i = 0;
        while (tempBoard[row][column] != 0) {
            randomCellEntry = Math.floor(Math.random() * 16);
            row = Math.floor(randomCellEntry / 4);
            column = randomCellEntry % 4;
            if (i == 64) {
                console.log("error in finding a new entry...exiting");
                return;
            }
            i++;
        }
        tempBoard[row][column] = randomNumber;
    }

    function handleKeyup(event) {
        console.log("handleKeyup.event", event);
        tempBoard = JSON.parse(JSON.stringify(board));

        let gameOver = isGameOver();
        if (gameOver) {
            setIsGameOver(true);
            console.log("handleKeyup.no more moves.....Game Over");
            return;
        }

        switch(event.key) {
            case 'ArrowUp':
                console.log("ArrowUp");
                slideUp();
                break;
            case 'ArrowDown':
                console.log("ArrowDown");
                slideDown();
                break;
            case 'ArrowLeft':
                console.log("ArrowLeft");
                slideLeft();
                break;
            case 'ArrowRight':
                console.log("ArrowRight");
                slideRight();
                break;
            default:
                console.log("ignore");
        }
        // the board has now been updated to handle the direction the user selected.  we can check to be sure the game is still valid
        // and if it is, we can add a new random value in one of the blank entries.
       
        addRandomEntry();

        gameOver = isGameOver();
        if (gameOver) {
            setIsGameOver(true);
            console.log("handleKeyup.no more moves.....Game Over");
            setScore(prev => prev + deltaScore);
            setBoard(tempBoard);
            return;
        } 

        setBoard(tempBoard);
        setScore(prev => prev + deltaScore);
    }

    return { handleKeyup }
}