// The object for each individual tile.
//
// Properties consist of:
// * tile (int) - The tile's face appearance, each corresponding to the
//    Mahjong Tiles Unicode block (from 1F000 to 1F02B).
// * glyph (boolean) - Whether we use standard text presentation for the
//    Tile (true) or the non-standard emoji variant (false).
// * selected (boolean) - Whether or not the tile is currently selected.
// * hintCurrent (boolean) - Whether or not the tile is highlighted as a
//    valid match of a currently selected tile.
// * hintAll (boolean) - Whether or not the tile is highlighted as a valid
//    match in general.
// * pointer (boolean) - Whether or not we use the pointer cursor when
//    hovering over it.
// * fade (boolean) - Whether or not we're currently in the removal
//    fade-out animation.
// * fixChromeAndroidEmojiBug (boolean) - Change the Red Dragon glyph
//    to a re-colored White Dragon glyph so that it isn't forced as an
//    emoji in Chrome on Android.
//
// * onClick - Callback reference to when a user clicks or taps on the Tile.
//
export default function Tile(props) {
  // Check if tile is valid to display.
  let tileNum = parseInt(props.tile, 10);

  if (isNaN(tileNum) || tileNum < 0 || tileNum > 43) {
    return props.glyph ? (
      <span className="game-tile-glyph game-tile-empty">&#x1F02B;&#xFE0E;</span>
    ) : (
      <span className="game-tile-emoji game-tile-empty">&#x1F02B;</span>
    );
  }

  // Colorize the tile by status.
  let tileStatusClass = "";

  if (props.selected) tileStatusClass = "game-tile-selected";
  else if (props.hintCurrent) tileStatusClass = "game-tile-hint-current";
  else if (props.hintAll) tileStatusClass = "game-tile-hint-all";
  else if (props.fade) tileStatusClass = "game-tile-anim-fadeout";

  if (props.pointer) tileStatusClass += "game-tile-pointer";

  if (props.glyph) {
    // If we're using the standard text presentation, make them colorized.
    let tileColorClass = "";

    if ((tileNum >= 7 && tileNum <= 15) || tileNum === 4) {
      tileColorClass = "game-tile-glyph-red";
      if (tileNum === 4 && props.fixChromeAndroidEmojiBug) tileNum = 6;
    } else if ((tileNum >= 16 && tileNum <= 24) || tileNum === 5) {
      tileColorClass = "game-tile-glyph-green";
    } else if (
      (tileNum >= 25 && tileNum <= 33) ||
      tileNum === 6 ||
      tileNum === 43
    ) {
      tileColorClass = "game-tile-glyph-blue";
    } else if (tileNum >= 34 && tileNum <= 37) {
      tileColorClass = "game-tile-glyph-flowers";
    } else if (tileNum >= 38 && tileNum <= 41) {
      tileColorClass = "game-tile-glyph-seasons";
    }

    return (
      <span
        className={`game-tile-glyph ${tileColorClass} ${tileStatusClass}`}
        onClick={props.onClick}
      >
        {String.fromCodePoint(0x1f000 + tileNum)}&#xFE0E;
      </span>
    );
  } else {
    // If we're using the non-standard emoji variant, just display them normally.
    return (
      <span
        className={`game-tile-emoji ${tileStatusClass}`}
        onClick={props.onClick}
      >
        {String.fromCodePoint(0x1f000 + tileNum)}
      </span>
    );
  }
}
