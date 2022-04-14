const AdvancedSettingsModalBody = (props) => {
  return (
    <div>
      <div>
        <button onClick={props.advancedToggleHighlightAllMatches}>
          Toggle Highlight All Matches
        </button>
        <button onClick={props.advancedToggleHighlightMatchesForTile}>
          Toggle Highlight Matching Tiles
        </button>
        <button onClick={props.advancedToggleEmojiMode}>
          Change tile type
        </button>
      </div>
      <div>
        <button onClick={props.backModal}>Back to Settings</button>
      </div>
    </div>
  );
};

export default AdvancedSettingsModalBody;
