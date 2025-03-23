export default function Scoreboard({ score, recordScore, isGameOver }) {
    return (
        <>
            {isGameOver ? <div>Game Over</div> : null}
            <div className="score-header">2048</div>

            <div className="score-container">
                <div className="current-score-container">
                    <div className="score-label">score</div>
                    <div className="current-score"> {score}</div>
                </div>
                <div className="high-score-container">
                    <div className="score-label">best</div>
                    <div className="high-score">{recordScore}</div>
                </div>
            </div>
        </>
    );
}
