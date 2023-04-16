const GameWinModalBody = (props) => {
  return (
    <div>
      <h1>You Win!</h1>
      <div>
        You cleared all {props.numTiles} tiles in
        {props.clearTimeHours
          ? ` ${props.clearTimeHours} hour${
              props.clearTimeHours > 1 ? "s" : ""
            }` + (props.clearTimeMinutes || props.clearTimeSeconds ? "," : "")
          : ""}
        {props.clearTimeMinutes
          ? ` ${props.clearTimeMinutes} minute${
              props.clearTimeMinutes > 1 ? "s" : ""
            }` + (props.clearTimeSeconds ? "," : "")
          : ""}
        {props.clearTimeSeconds
          ? ` ${props.clearTimeSeconds} second${
              props.clearTimeSeconds > 1 ? "s" : ""
            }`
          : ""}
        !
      </div>
      <div>
        Board #{props.seed}, {props.layout}
      </div>
      <div>
        <button onClick={props.handleResetBoard}>
          Start New Board with Same Layout
        </button>
      </div>
      <div>
        <button onClick={props.newBoardModal}>Start New Board</button>
      </div>
      <div>
        <button onClick={() => props.handleResetBoard(props.seed)}>
          Reset Current Board
        </button>
      </div>
    </div>
  );
};

export default GameWinModalBody;
