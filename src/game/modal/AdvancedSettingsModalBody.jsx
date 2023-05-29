const AdvancedSettingsModalBody = ({
  toggleHighlightAllMatches,
  toggleHighlightMatchesForTile,
  toggleEmojiMode,
  backModal,
}) => {
  return (
    <div>
      <div>
        <button onClick={toggleHighlightAllMatches}>
          Toggle Highlight All Matches
        </button>
        <button onClick={toggleHighlightMatchesForTile}>
          Toggle Highlight Matching Tiles
        </button>
        <button onClick={toggleEmojiMode}>Change tile type</button>
      </div>
      <div>
        <button onClick={backModal}>Back to Settings</button>
      </div>
    </div>
  );
};

export default AdvancedSettingsModalBody;
