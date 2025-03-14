import Cell from './Cell';
import { Fragment } from 'react';

export default function Grid( { board }) {
    console.log("board", board);

    return (
        <div className="grid-container">
            {board.map((row, rowIndex) => (
                    <Fragment key={rowIndex}>
                        {row.map((entry, itemIndex) => (
                            <Cell key={rowIndex*4+itemIndex} entry={entry} />
                        ))}
                    </Fragment>
                ))}
        </div>
    )
}