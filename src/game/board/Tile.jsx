// The component for each individual tile, displayed as a mahjong tile from
// the Mahjong Tiles Unicode block (U+1F000 to U+1F02B).
export default function Tile({
  char,
  useEmoji,
  isSelected,
  canBeMatchedWithSelected,
  canBeMatchedWithOther,
  showPointer,
  isFadingOut,
  fixChromeAndroidEmojiBug,
  onClick,
}) {
  // Check if tile is valid to display. They should be sent in the "char"
  // property from 0 (U+1F000) to 43 (U+1F02B).

  if (typeof char !== "number" || char < 0 || char > 43) {
    return useEmoji ? (
      <span className="game-tile-emoji game-tile-empty">&#x1F02B;</span>
    ) : (
      <span className="game-tile-glyph game-tile-empty">&#x1F02B;&#xFE0E;</span>
    );
  }

  // Colorize the tile by status.
  let tileStatusClass = "";

  // Whether or not the tile is currently selected.
  if (isSelected) tileStatusClass = "game-tile-selected";
  // Whether or not the tile is highlighted as a valid match of a currently selected tile.
  else if (canBeMatchedWithSelected) tileStatusClass = "game-tile-hint-current";
  // Whether or not the tile is highlighted as a valid match in general.
  else if (canBeMatchedWithOther) tileStatusClass = "game-tile-hint-all";
  // Whether or not we're currently in the removal fade-out animation.
  else if (isFadingOut) tileStatusClass = "game-tile-anim-fadeout";

  // Whether or not we use the pointer cursor when hovering over it.
  if (showPointer) tileStatusClass += "game-tile-pointer";

  if (useEmoji) {
    // If we're using the non-standard emoji variant, just display them normally.
    return (
      <span className={`game-tile-emoji ${tileStatusClass}`} onClick={onClick}>
        {String.fromCodePoint(0x1f000 + char)}
      </span>
    );
  } else {
    // If we're using the standard text presentation, make them colorized.
    let tileColorClass = "";

    if ((char >= 7 && char <= 15) || char === 4) {
      tileColorClass = "game-tile-glyph-red";

      // In certain browsers, change the Red Dragon glyph to a re-colored
      // White Dragon glyph so that it isn't forced as an emoji.
      if (char === 4 && fixChromeAndroidEmojiBug) char = 6;
    } else if ((char >= 16 && char <= 24) || char === 5) {
      tileColorClass = "game-tile-glyph-green";
    } else if ((char >= 25 && char <= 33) || char === 6 || char === 43) {
      tileColorClass = "game-tile-glyph-blue";
    } else if (char >= 34 && char <= 37) {
      tileColorClass = "game-tile-glyph-flowers";
    } else if (char >= 38 && char <= 41) {
      tileColorClass = "game-tile-glyph-seasons";
    }

    return (
      <span
        className={`game-tile-glyph ${tileColorClass} ${tileStatusClass}`}
        onClick={onClick}
      >
        {String.fromCodePoint(0x1f000 + char)}&#xFE0E;
      </span>
    );
  }
}
