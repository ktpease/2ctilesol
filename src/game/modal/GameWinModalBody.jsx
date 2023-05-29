const GameWinModalBody = ({
  numTiles,
  clearTime,
  seed,
  layoutDescription,
  handleResetBoard,
  newBoardModal,
}) => {
  return (
    <div>
      <h1>You Win!</h1>
      <div>
        You cleared all {numTiles} tiles in
        {clearTime.hours
          ? ` ${clearTime.hours} hour${clearTime.hours > 1 ? "s" : ""}` +
            (clearTime.minutes || clearTime.seconds ? "," : "")
          : ""}
        {clearTime.minutes
          ? ` ${clearTime.minutes} minute${clearTime.minutes > 1 ? "s" : ""}` +
            (clearTime.seconds ? "," : "")
          : ""}
        {clearTime.seconds
          ? ` ${clearTime.seconds} second${clearTime.seconds > 1 ? "s" : ""}`
          : ""}
        !
      </div>
      <div>
        Board #{seed}, {layoutDescription}
      </div>
      <div>
        <button onClick={handleResetBoard}>
          Start New Board with Same Layout
        </button>
      </div>
      <div>
        <button onClick={newBoardModal}>Start New Board</button>
      </div>
      <div>
        <button onClick={() => handleResetBoard(seed)}>
          Reset Current Board
        </button>
      </div>
    </div>
  );
};

export default GameWinModalBody;
