function Tile(props) {
  const tileNum = parseInt(props.tile);

  // Check if tile is valid.
  if (isNaN(tileNum) || tileNum < 0 || tileNum >= 34)
    return props.glyph ? (
      <span className="game-tile-glyph game-tile-empty">&#x1F02B;&#xFE0E;</span>
    ) : (
      <span className="game-tile-emoji game-tile-empty">&#x1F02B;</span>
    );

  if (props.glyph) {
    // If the font uses the glyph variant, give them a colorized border.
    let tileColorClass = "";

    if ((tileNum >= 7 && tileNum <= 15) || tileNum === 4) {
      tileColorClass = "game-tile-glyph-red";
    } else if ((tileNum >= 16 && tileNum <= 24) || tileNum === 5) {
      tileColorClass = "game-tile-glyph-green";
    } else if ((tileNum >= 25 && tileNum <= 33) || tileNum === 6) {
      tileColorClass = "game-tile-glyph-blue";
    }

    return (
      <span className={`game-tile-glyph ${tileColorClass}`}>
        {String.fromCodePoint(0x1f000 + tileNum)}&#xFE0E;
      </span>
    );
  } else {
    return (
      <span className="game-tile-emoji">
        {String.fromCodePoint(0x1f000 + tileNum)}
      </span>
    );
  }
}

export default Tile;
