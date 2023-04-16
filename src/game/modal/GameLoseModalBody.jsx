const GameLoseModalBody = (props) => {
  return (
    <div>
      <h1>You Have No Valid Moves!</h1>
      <div>
        You still have {props.remainingTiles} tiles remaining, but cannot match
        any more tiles!
      </div>
      <div>
        Board #{props.seed}, {props.layout}
      </div>
      <div>
        <button onClick={props.handleUndoMatch} disabled={props.canUndo}>
          Undo Last Match
        </button>
      </div>
      <div>
        <button onClick={() => props.handleResetBoard(props.seed)}>
          Reset Current Board
        </button>
      </div>
      <div>
        <button onClick={props.handleResetBoard}>
          Start New Board with Same Layout
        </button>
      </div>
      <div>
        <button onClick={props.newBoardModal}>Start New Board</button>
      </div>
    </div>
  );
};

export default GameLoseModalBody;
