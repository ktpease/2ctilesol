const SettingsModalBody = (props) => {
  return (
    <div>
      <div>Board #{props.seed}, {props.layout}</div>
      <div>
        Current number of tiles that can be matched: {props.tilesMatchable}
      </div>
      <div>
        <button onClick={props.newBoardModal}>Start New Board</button>
      </div>
      <div>
        <button onClick={() => props.handleResetBoard(props.seed)}>
          Reset Current Board
        </button>
      </div>
      <div>
        <button onClick={props.handleUndoMatch} disabled={props.canUndo}>
          Undo Last Match
        </button>
      </div>
      <div>
        <button onClick={props.advancedSettingsModal}>Advanced Options</button>
      </div>
    </div>
  );
};

export default SettingsModalBody;
