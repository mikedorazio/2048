import Grid from "./Grid";
import { useState, useEffect } from "react";
import useBoard from "./useBoard";
import Scoreboard from "./Scoreboard";

export default function Board() {
    const rows = 4;
    const columns = 4;
    const [board, setBoard] = useState(initBoard);
    const [score, setScore] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);
    const { handleKeyup } = useBoard(board, setBoard, rows, columns, score, setScore, setIsGameOver);

    function initBoard() {
        let dataGrid = [];
        for (let i = 0; i < 4; i++) {
            // Initialize an empty array for the current row
            dataGrid[i] = [];
            // Inner loop for columns
            for (let j = 0; j < 4; j++) {
                dataGrid[i][j] = 0;
            }
        }
        let randomNumber1 = Math.random() < 0.9 ? 2 : 4;
        let randomCellEntry1 = Math.floor(Math.random() * 16);
        let row = Math.floor(randomCellEntry1 / 4);
        let column = randomCellEntry1 % 4;
        dataGrid[row][column] = randomNumber1;

        let randomCellEntry2 = randomCellEntry1;
        let randomNumber2 = 0;
        while (randomCellEntry1 == randomCellEntry2) {
            randomCellEntry2 = Math.floor(Math.random() * 16);
        }
        randomNumber2 = Math.random() < 0.9 ? 2 : 4;
        row = Math.floor(randomCellEntry2 / 4);
        column = randomCellEntry2 % 4;
        dataGrid[row][column] = randomNumber2;

        // test data
        // dataGrid[0][0] = 2;
        // dataGrid[0][1] = 0;
        // dataGrid[0][2] = 4;
        // dataGrid[0][3] = 0;
        // dataGrid[1][0] = 8;
        // dataGrid[1][1] = 64;
        // dataGrid[1][2] = 2;
        // dataGrid[1][3] = 4;
        // dataGrid[2][0] = 128;
        // dataGrid[2][1] = 8;
        // dataGrid[2][2] = 16;
        // dataGrid[2][3] = 16;
        // dataGrid[3][0] = 64;
        // dataGrid[3][1] = 32;
        // dataGrid[3][2] = 2;
        // dataGrid[3][3] = 2;

        return dataGrid;
    }

    useEffect(() => {
        window.addEventListener("keyup", handleKeyup);

        if (isGameOver) {
            console.log("game over in useEffect");
            window.removeEventListener("keyup", handleKeyup);
        }
        return () => {
            window.removeEventListener("keyup", handleKeyup);
        };
    }, [handleKeyup]);

    return (
        <>
            <div className="scoreboard">
                <Scoreboard score={score} isGameOver={isGameOver} />
            </div>
            <div className="board-container">
                <Grid board={board} />
            </div>
        </>
    );
}
