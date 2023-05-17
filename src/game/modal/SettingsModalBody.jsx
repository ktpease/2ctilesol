const SettingsModalBody = (props) => {
  return (
    <div>
      <div>
        Board #{props.seed}, {props.layout}
      </div>
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
        <div>
          <input
            type="checkbox"
            id="optAnimatedBg"
            checked={props.animateBackground}
            onChange={() =>
              props.setAnimateBackground(!props.animateBackground)
            }
          ></input>
          <label htmlFor="optAnimatedBg">
            Enable Animated Background (may decrease performance)
          </label>
        </div>
      </div>
      <div>
        <button onClick={props.advancedSettingsModal}>Advanced Options</button>
      </div>
    </div>
  );
};

export default SettingsModalBody;
