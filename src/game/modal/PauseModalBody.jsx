const PauseModalBody = ({
  seed,
  layoutDescription,
  shareUrls,
  tilesMatchable,
  resetGameState,
  hideModal,
  newBoardModal,
  advancedSettingsModal,
  backgroundColorModal,
  layoutEditModal,
}) => {
  return (
    <div>
      <h1>Paused</h1>
      <div>
        Board #{seed}, {layoutDescription}
      </div>
      <div>Current number of tiles that can be matched: {tilesMatchable}</div>
      <div>
        <button onClick={newBoardModal}>Start New Board</button>
      </div>
      <div>
        <button onClick={() => resetGameState(seed)}>
          Reset Current Board
        </button>
      </div>
      <div>
        <button onClick={() => navigator.clipboard.writeText(shareUrls.gameUrl)}>
          Copy Link to Game
        </button>
        <button onClick={() => navigator.clipboard.writeText(shareUrls.layoutUrl)}>
          Copy Link to Layout
        </button>
      </div>
      <div>
        <button onClick={backgroundColorModal}>Change Background</button>
      </div>
      <div>
        <button onClick={advancedSettingsModal}>Advanced Options</button>
      </div>
      <div>
        <button onClick={layoutEditModal}>Puzzle Layout Edit</button>
      </div>
      <div></div>
      <div>
        <button onClick={hideModal}>Return to Game</button>
      </div>
    </div>
  );
};

export default PauseModalBody;
