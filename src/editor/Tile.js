export default function Tile(props) {
  let type = parseInt(props.type, 10);

  if (isNaN(type) || type < 0 || type > 1) {
    return (
      <span className="game-tile-glyph game-tile-empty">&#x1F02B;&#xFE0E;</span>
    );
  }

  switch (type) {
    case 1:
      return (
        <span
          className="game-tile-glyph game-tile-glyph-blue"
          onClick={props.onClick}
        >
          &#x1F02B;&#xFE0E;
        </span>
      );
    default:
      return (
        <span
          className="game-tile-glyph game-tile-glyph-blue"
          style={{opacity: "50%"}}
          onClick={props.onClick}
        >
          &#x1F02B;&#xFE0E;
        </span>
      );
  }
}
