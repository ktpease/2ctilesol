import React, { useState, useEffect } from "react";

import Tile from "./Tile";
import PathNode from "./PathNode";

import "./Game.css";

export default function GameBoard({
  boardWidth,
  boardHeight,
  tiles,
  pathingTiles,
  pathingTilesAlt,
  hintedTiles,
  allValidMatchingTiles,
  selectedTile,
  useEmoji,
  fixChromeAndroidEmojiBug,
  showAllValidMatches,
  handleTileClick,
}) {
  // Tile maps, which are used to correlate each tile object with their
  // proper placement on the board. Standard tile maps are used for the
  // landscape orientation while rotated tile maps are "rotated" for better
  // use in portrait orientation (such as smartphones). These are stored as
  // arrays of rows of tiles.
  const [horizontalTileMap, setHorizontalTileMap] = useState([]);
  const [verticalTileMap, setVerticalTileMap] = useState([]);

  // Regenerate tile maps every time the tile layout changes.
  useEffect(() => {
    const horizontalTileMap = [],
      verticalTileMap = [];

    // Generate standard tile map, used for the landscape orientation.
    for (let y = 0; y < boardHeight + 2; y++) {
      horizontalTileMap[y] = tiles.slice(
        y * (boardWidth + 2),
        (y + 1) * (boardWidth + 2)
      );
    }

    setHorizontalTileMap(horizontalTileMap);

    // Generate rotated tile map, used for the portrait orientation.
    for (let x = 0; x < boardWidth + 2; x++) {
      verticalTileMap[x] = tiles
        .filter((_el, index) => index % (boardWidth + 2) === x)
        .reverse();
    }

    setVerticalTileMap(verticalTileMap);
  }, [tiles]);

  const renderTileMap = (tileMap, keyprefix) => {
    // For each row in the tile map, create a div with each of the tile
    // entries as a span, which contains both the corresponding Tile component 
    // and pathing node.
    return tileMap.map((row, index) => (
      <div key={keyprefix + "-" + index}>
        {row.map((val) => (
          <span key={val.id}>
            <Tile
              tile={val.char}
              glyph={!useEmoji}
              selected={val.id === selectedTile}
              hintCurrent={hintedTiles.includes(val) && !val.inRemovalAnim}
              hintAll={
                showAllValidMatches && allValidMatchingTiles.includes(val.id)
              }
              fade={val.inRemovalAnim}
              onClick={() => handleTileClick(val.id)}
              fixChromeAndroidEmojiBug={fixChromeAndroidEmojiBug}
            />
            <PathNode node={pathingTiles[val.id]} />
            <PathNode node={pathingTilesAlt[val.id]} />
          </span>
        ))}
      </div>
    ));
  };

  return (
    <div>
      <div
        className={`game-board game-board-horizontal game-board-size-${boardHeight} ${
          useEmoji ? "game-board-emoji" : "game-board-glyph"
        }`}
      >
        {renderTileMap(horizontalTileMap, "board-hori")}
      </div>
      <div
        className={`game-board game-board-vertical game-board-size-${boardHeight} ${
          useEmoji ? "game-board-emoji" : "game-board-glyph"
        }`}
      >
        {renderTileMap(verticalTileMap, "board-vert")}
      </div>
    </div>
  );
}
