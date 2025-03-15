export default function useBoard( board, setBoard, rows, columns, score, setScore, setIsGameOver ) {
    let tempBoard = [];
    let deltaScore = 0;
    let backupBoard = [];

    function filterZeros(row) {
        return row.filter(num => num != 0);
    }

    // slide cells to the left. this will be called with all directions since we will first rearrange the cells in the position that will
    // simulate them being shifted left, then after, we will reposition them back the way they should appear in the grid.
    // pretend we came in with this as the row: 2, 2, 0, 4
    function slide(row, direction) {
        //console.log("slide.called with row", row, row.length);
        // clear out zero values. now the row will look like: 2, 2, 4
        row = filterZeros(row);

        // merge cells with the one on the left if it is the same value
        for (let i = 0; i < row.length - 1; i++) {
            console.log("slide.values about to check", row[i], row[i+1])
            // combine the 2 cells that are of the same value
            if (row[i] == row[i+1]) {
                console.log("slide.values found to be equal", i, i+1)
                row[i] *= 2;
                row[i+1] = 0;
                deltaScore = deltaScore + row[i];
            }
        }
        // now the row will look like: 4, 0, 4
        // clear out zero values again. now it will look like 4, 4
        row = filterZeros(row);
        // put zero values back. now it will be: 4, 4, 0, 0
        while(row.length < columns) {
            row.push(0);
        }
        return row;
    }

    // call the slide() method for each row.
    function slideLeft() {
        for (let r = 0; r < rows; r++) {
            //console.log("slideLeft.processing row", tempBoard[r])
            let row = tempBoard[r];
            row = slide(row, "l");
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
            row = slide(row, "r");
            row.reverse();
            tempBoard[r] = row;
        }
    }

    function slideUp() {
        for (let c = 0; c < columns; c++) {
            let row = [tempBoard[0][c], tempBoard[1][c], tempBoard[2][c], tempBoard[3][c]];
            row = slide(row, "u");
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
            row = slide(row, "d");
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

     // use FLIP technique to exchange hint positions
     function swapEntries(fromElement, toElement, containerElement) {
        const nextSibling = fromElement.nextSibling;
        // FIRST: get the current bounds
        const fromRect = fromElement.getBoundingClientRect();
        const toRect = toElement.getBoundingClientRect();
        // Last
        containerElement.insertBefore(fromElement, toElement);
        containerElement.insertBefore(toElement, nextSibling);
        const fromRectLast = fromElement.getBoundingClientRect();
        const toRectLast = toElement.getBoundingClientRect();
        // Invert 
        const fromDeltaX = fromRect.left - fromRectLast.left;
        const fromDeltaY = fromRect.top - fromRectLast.top;
        //console.log("creamDeltaX", creamDeltaX, "creamDeltaY", creamDeltaY);
        const toDeltaX = toRect.left - toRectLast.left;
        const toDeltaY = toRect.top - toRectLast.top;

        fromElement.animate([{
            transformOrigin: 'top left',
            transform: `
              translate(${fromDeltaX}px, ${fromDeltaY}px)
            `
          }, {
            transformOrigin: 'top left',
            transform: 'none'
          }], {
            duration: 300,
            easing: 'ease-in-out',
            fill: 'both'
          });

          toElement.animate([{
            transformOrigin: 'top left',
            transform: `
              translate(${toDeltaX}px, ${toDeltaY}px)
            `
          }, {
            transformOrigin: 'top left',
            transform: 'none'
          }], {
            duration: 300,
            easing: 'ease-in-out',
            fill: 'both'
          });
    }

    // check to see if the original board and the new resulting board that got created when the 
    // user hit an arrow key are the same exact board. if so, we will not add a new entry
    function areBoardsSimilar() {
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < columns; c++) {
                if (tempBoard[r][c] != backupBoard[r][c]) {
                    return false;
                }
            }
        }
        return true;
    }

    // handles the event of a key being hit. ignore all keys hit unless it is an arrow key.  move the cells in the direction related to 
    // which arrow key was hit. 
    function handleKeyup(event) {
        console.log("handleKeyup.event", event);
        tempBoard = JSON.parse(JSON.stringify(board));
        // keep backup copy so we can compare it with new copy to see if anything changed.
        backupBoard = JSON.parse(JSON.stringify(board));

        // first check to see if the last time we insterted a random number ended the game
        let gameOver = isGameOver();
        if (gameOver) {
            setIsGameOver(true);
            console.log("handleKeyup.no more moves.....Game Over");
            return;
        }

        // get the exact key that was hit and call the appropriate slide method
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
        
        // if the key that was hit caused a cell to become available, fill it with a new random entry
        let boardsAreSimilar = areBoardsSimilar();
        if (boardsAreSimilar == true) {
            console.log("handleKeyup.nothing changed...not adding new entry")
        }
        else {
            console.log("handleKeyup.something changed...adding new entry")
            addRandomEntry();
        }

        // the board has now been updated to handle the direction the user selected.  we can check to be sure the game is still valid
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