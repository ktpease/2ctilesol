const SettingsModalBody = (props) => {
  return (
    <div>
      <div>
        <div>Board #{props.seed}</div>
        <button onClick={() => props.handleResetBoard(props.seed)}>
          Reset board
        </button>
        <button onClick={props.handleUndoMatch} disabled={props.canUndo}>
          Undo
        </button>
      </div>
      <div>
        Current number of tiles that can be matched: {props.tilesMatchable}
      </div>
      <div>
        <button onClick={props.newBoardModal}>New Board</button>
      </div>
      <div>
        <button onClick={props.advancedSettingsModal}>Advanced Options</button>
      </div>
    </div>
  );
};

export default SettingsModalBody;
