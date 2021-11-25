export default function Tile(props) {
  // Number between 0-42, corresponding to the Mahjong Tiles Unicode block.
  const tileNum = parseInt(props.tile, 10);

  // Check if tile is valid.
  if (isNaN(tileNum) || tileNum < 0 || tileNum >= 43) {
    let pathnodeClass = "";

    if (props.pathnode) {
      props.pathnode.forEach((dir, index) => {
        if (index === 0)
          pathnodeClass = pathnodeClass.concat(
            "game-tile-path game-tile-path-",
            dir
          );
        else pathnodeClass = pathnodeClass.concat(dir);
      });
    }

    return props.glyph ? (
      <span className={`game-tile-glyph game-tile-empty ${pathnodeClass}`}>
        &#x1F02B;&#xFE0E;
      </span>
    ) : (
      <span className={`game-tile-emoji game-tile-empty ${pathnodeClass}`}>
        &#x1F02B;
      </span>
    );
  }

  let tileStatusClass = "";

  if (props.selected) tileStatusClass = "game-tile-selected";
  else if (props.hinted) tileStatusClass = "game-tile-hinted";

  if (props.glyph) {
    // If the font uses the glyph variant, give them a colorized border.
    let tileColorClass = "";

    if ((tileNum >= 7 && tileNum <= 15) || tileNum === 4) {
      tileColorClass = "game-tile-glyph-red";
    } else if ((tileNum >= 16 && tileNum <= 24) || tileNum === 5) {
      tileColorClass = "game-tile-glyph-green";
    } else if ((tileNum >= 25 && tileNum <= 33) || tileNum === 6) {
      tileColorClass = "game-tile-glyph-blue";
    } else if (tileNum >= 34 && tileNum <= 37) {
      tileColorClass = "game-tile-glyph-flowers";
    } else if (tileNum >= 38 && tileNum <= 41) {
      tileColorClass = "game-tile-glyph-seasons";
    }

    return (
      <span
        className={`game-tile-glyph ${tileColorClass} ${tileStatusClass} ${
          props.pointer ? "game-tile-pointer" : ""
        } ${props.fade ? "game-tile-anim-fadeout" : ""}`}
        onClick={props.onClick}
      >
        {String.fromCodePoint(0x1f000 + tileNum)}&#xFE0E;
      </span>
    );
  } else {
    return (
      <span
        className={`game-tile-emoji ${tileStatusClass} ${
          props.pointer ? "game-tile-pointer" : ""
        } ${props.fade ? "game-tile-anim-fadeout" : ""}`}
        onClick={props.onClick}
      >
        {String.fromCodePoint(0x1f000 + tileNum)}
      </span>
    );
  }
}
