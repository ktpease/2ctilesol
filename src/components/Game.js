import React from "react";
import seedrandom from "seedrandom";

import "./Game.css";

import Tile from "./Tile.js";

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      useEmoji: document.fonts.check("12px Segoe UI Emoji"),
      boardWidth: 17,
      boardHeight: 8,
      seed: 1,
      tiles: [],
      selectedTile: null,
      hintedTiles: [],
      showMatchingTiles: true,
      allowDeselect: true,
    };
  }

  componentDidMount() {
    this.generateBoard(null);
  }

  generateBoard(seed) {
    const tiles = [],
      allValidTiles = [];

    let id = 0,
      char = 0;

    // Top outer edge.
    for (let x = 0; x < this.state.boardWidth + 2; x++)
      id = tiles.push({ id: id });

    // Generate the initial unshuffled layout of tiles.
    for (let y = 0; y < this.state.boardHeight; y++) {
      // Left outer edge.
      id = tiles.push({ id: id });

      for (let x = 0; x < this.state.boardWidth; x++) {
        allValidTiles.push(id);
        id = tiles.push({ id: id, char: char });
        char = (char + 1) % 34;
      }

      // Right outer edge.
      id = tiles.push({ id: id });
    }

    // Bottom outer edge.
    for (let x = 0; x < this.state.boardWidth + 2; x++)
      id = tiles.push({ id: id });

    // Determine if we need to generate a random seed
    // or use a pre-determined one from the seed argument.
    const finalSeed = isNaN(parseInt(seed, 10))
      ? seedrandom().int32() >>> 0
      : parseInt(seed, 10) >>> 0;

    const seededRng = seedrandom(finalSeed);

    let randTile = 0;

    // Shuffle the board using a simple Fisher-Yates shuffle.
    for (let i = allValidTiles.length - 1; i > 0; i--) {
      randTile = Math.floor(seededRng() * (i + 1));

      char = tiles[allValidTiles[i]].char;
      tiles[allValidTiles[i]].char = tiles[allValidTiles[randTile]].char;
      tiles[allValidTiles[randTile]].char = char;
    }

    console.log(`Game board seed is ${finalSeed}`);

    this.setState({
      tiles: tiles,
      seed: finalSeed,
      selectedTile: null,
      hintedTiles: [],
    });
  }

  handleTileClick(tileId) {
    // Clicking the same tile either de-selects the tile or does nothing.
    if (this.state.selectedTile === tileId) {
      if (this.state.allowDeselect === true) {
        this.setState({ selectedTile: null, hintedTiles: [] });
        console.log(`Unclicked ${tileId}`);
      }

      return;
    }

    console.log(`Clicked ${tileId}`);

    // If selecting a second tile, check to make sure it matches the first,
    // then check the pathing to see if it's valid, then clear valid matches.
    if (
      this.state.selectedTile !== null &&
      this.state.tiles[tileId].char ===
        this.state.tiles[this.state.selectedTile].char
    ) {
      const path = this.checkValidPath(tileId, this.state.selectedTile);

      if (path !== null) {
        console.log(path);

        const newTiles = this.state.tiles.slice();

        newTiles[tileId].char = null;
        newTiles[this.state.selectedTile].char = null;

        this.setState({ tiles: newTiles, selectedTile: null, hintedTiles: [] });
        return;
      }
    }

    // Update the hinting system, if it's enabled.
    if (this.state.showMatchingTiles === true) {
      const hintedTiles = this.state.tiles.filter(
        (t) => t.char === this.state.tiles[tileId].char
      );

      this.setState({ hintedTiles: hintedTiles, selectedTile: tileId });
      return;
    }

    this.setState({ selectedTile: tileId });
  }

  checkValidPath(tile1, tile2) {
    let valid = false;
    let path = [];

    const tilesXdelta =
      (tile2 % (this.state.boardWidth + 2)) -
      (tile1 % (this.state.boardWidth + 2));
    const tilesYdelta =
      (tile2 -
        (tile2 % (this.state.boardWidth + 2)) -
        (tile1 - (tile1 % (this.state.boardWidth + 2)))) /
      (this.state.boardWidth + 2);

    console.log(`tile X delta: ${tilesXdelta}`);
    console.log(`tile Y delta: ${tilesYdelta}`);

    // Tile 1 and Tile 2 are on same column.
    if (tile1 % this.state.boardWidth === tile2 % this.state.boardWidth) {
      valid = true;
      path = [tile1];

      // (S) Tile 1 is above Tile 2
      if (tile1 < tile2) {
        console.log("Checking S");

        for (
          let i = tile1 + this.state.boardWidth;
          i < tile2;
          i += this.state.boardWidth
        ) {
          path.push(i);

          console.log(`S1 - ${i} - ${this.state.tiles[i].char}`);

          if (this.state.tiles[i].char !== null) {
            valid = false;
            break;
          }
        }
        // (N) Tile 1 is below Tile 2
      } else {
        console.log("Checking N");
        for (
          let i = tile1 - this.state.boardWidth;
          i > tile2;
          i -= this.state.boardWidth
        ) {
          path.push(i);

          console.log(`N1 - ${i} - ${this.state.tiles[i].char}`);

          if (this.state.tiles[i].char !== null) {
            valid = false;
            break;
          }
        }
      }

      if (valid) {
        path.push(tile2);
        return path;
      }
    }

    // Tile 1 and Tile 2 are on same row.
    const rowStart = tile1 - (tile1 % this.state.boardWidth),
      rowEnd = rowStart + this.state.boardWidth;

    if (
      tile1 >= rowStart &&
      tile2 >= rowStart &&
      tile1 < rowEnd &&
      tile2 < rowEnd
    ) {
      valid = true;
      path = [tile1];

      // (E) Tile 1 is left of Tile 2
      if (tile1 < tile2) {
        console.log("Checking E");

        for (let i = tile1 + 1; i < tile2; i++) {
          path.push(i);

          console.log(`E1 - ${i} - ${this.state.tiles[i].char}`);

          if (this.state.tiles[i].char !== null) {
            valid = false;
            break;
          }
        }
        // (W) Tile 1 is right of Tile 2
      } else {
        console.log("Checking W");
        for (let i = tile1 - 1; i > tile2; i--) {
          path.push(i);

          console.log(`W1 - ${i} - ${this.state.tiles[i].char}`);

          if (this.state.tiles[i].char !== null) {
            valid = false;
            break;
          }
        }
      }

      if (valid) {
        path.push(tile2);
        return path;
      }
    }

    return null;
  }

  renderHorizontalMap() {
    const tileMap = [];

    // Standard horizontal board. Used for landscape orientation.
    for (let y = 0; y < this.state.boardHeight; y++) {
      tileMap[y] = (
        <div key={"board-hori-row" + y}>
          {this.state.tiles
            .slice(
              (y + 1) * (this.state.boardWidth + 2) + 1,
              (y + 2) * (this.state.boardWidth + 2) - 1
            )
            .map((i) => this.renderTile(i))}
        </div>
      );
    }

    return tileMap;
  }

  renderVerticalMap() {
    const tileMap = [];

    // Rotated vertical board. Used for portrait orientation.
    for (let x = 0; x < this.state.boardWidth; x++) {
      tileMap[x] = (
        <div key={"board-vert-row" + x}>
          {this.state.tiles
            .slice(
              this.state.boardWidth + 2,
              (this.state.boardWidth + 2) * (this.state.boardHeight + 1)
            )
            .filter(
              (_el, index) => index % (this.state.boardWidth + 2) === x + 1
            )
            .reverse()
            .map((i) => this.renderTile(i))}
        </div>
      );
    }

    return tileMap;
  }

  renderTile(tileobj) {
    return (
      <Tile
        tile={tileobj.char}
        key={tileobj.id}
        glyph={!this.state.useEmoji}
        selected={tileobj.id === this.state.selectedTile}
        hinted={this.state.hintedTiles.includes(tileobj)}
        onClick={() => this.handleTileClick(tileobj.id)}
      />
    );
  }

  render() {
    return (
      <>
        <div>
          <div
            className={`game-board game-board-horizontal ${
              this.state.useEmoji ? "game-board-emoji" : "game-board-glyph"
            }`}
          >
            {this.renderHorizontalMap()}
          </div>
          <div
            className={`game-board game-board-vertical ${
              this.state.useEmoji ? "game-board-emoji" : "game-board-glyph"
            }`}
          >
            {this.renderVerticalMap()}
          </div>
          <div>
            <button
              onClick={() =>
                this.setState((state) => ({ useEmoji: !state.useEmoji }))
              }
            >
              Change tile type
            </button>
            <button onClick={() => this.generateBoard()}>New board</button>
            <button onClick={() => this.generateBoard(this.state.seed)}>
              Reset board
            </button>
          </div>
          <div>Board #{this.state.seed}</div>
        </div>
      </>
    );
  }
}

export default Game;
