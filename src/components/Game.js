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
    };
  }

  componentDidMount() {
    this.generateBoard(null);
  }

  generateBoard(seed) {
    const tiles = [];

    let id = 0,
      char = 0;

    // Generate the initial unshuffled layout of tiles.
    for (let y = 0; y < this.state.boardHeight; y++) {
      for (var x = 0; x < this.state.boardWidth; x++) {
        id = tiles.push({ id: id, char: char });
        char = (char + 1) % 34;
      }
    }

    // Determine if we need to generate a random seed
    // or use a pre-determined one from the seed argument.
    const finalSeed = isNaN(parseInt(seed, 10))
      ? seedrandom().int32() >>> 0
      : parseInt(seed, 10) >>> 0;

    const seededRng = seedrandom(finalSeed);

    let randTile = 0;

    // Shuffle the board using a simple Fisher-Yates shuffle.
    for (let i = tiles.length - 1; i > 0; i--) {
      randTile = Math.floor(seededRng() * (i + 1));

      char = tiles[i].char;
      tiles[i].char = tiles[randTile].char;
      tiles[randTile].char = char;
    }

    console.log(`Game board seed is ${finalSeed}`);

    this.setState({ tiles: tiles, seed: finalSeed });
  }

  handleTileClick(tileId) {
    if (this.state.selectedTile === tileId) {
      return;
    }

    if (
      this.state.selectedTile !== null &&
      this.state.tiles[tileId].char ===
        this.state.tiles[this.state.selectedTile].char
    ) {
      // TODO: Actual nikakudori path checking.
      // For now assume it's good.
      const newTiles = this.state.tiles.slice();

      newTiles[tileId].char = null;
      newTiles[this.state.selectedTile].char = null;

      this.setState({ tiles: newTiles, selectedTile: null, hintedTiles: [] });
      return;
    }

    if (this.state.showMatchingTiles === true) {
      const hintedTiles = this.state.tiles.filter(
        (t) => t.char === this.state.tiles[tileId].char
      );

      this.setState({ hintedTiles: hintedTiles, selectedTile: tileId });
      return;
    }

    this.setState({ selectedTile: tileId });
  }

  renderHorizontalMap() {
    const tileMap = [];

    // Standard horizontal board. Used for landscape orientation.
    for (let y = 0; y < this.state.boardHeight; y++) {
      tileMap[y] = (
        <div key={"board-hori-row" + y}>
          {this.state.tiles
            .slice(y * this.state.boardWidth, (y + 1) * this.state.boardWidth)
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
            .filter((_el, index) => index % this.state.boardWidth === x)
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
          </div>
          <div>Board #{this.state.seed}</div>
        </div>
      </>
    );
  }
}

export default Game;
