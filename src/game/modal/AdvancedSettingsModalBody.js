const AdvancedSettingsModalBody = (props) => {
  return (
    <div>
      <div>
        <button onClick={props.toggleHighlightAllMatches}>
          Toggle Highlight All Matches
        </button>
        <button onClick={props.toggleHighlightMatchesForTile}>
          Toggle Highlight Matching Tiles
        </button>
        <button onClick={props.toggleEmojiMode}>
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
