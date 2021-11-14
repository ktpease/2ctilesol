import React from "react";

import "./Game.css";

import Tile from "./Tile.js";

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      useEmoji: document.fonts.check("12px Segoe UI Emoji"),
      boardWidth: 17,
      boardHeight: 8,
      tiles: [],
      selectedTile: null,
      hintedTiles: [],
      showMatchingTiles: true,
    };
  }

  componentDidMount() {
    this.generateBoard();
  }

  generateBoard() {
    const tiles = [];

    let id = 0,
      char = 0;

    for (let y = 0; y < this.state.boardHeight; y++) {
      for (var x = 0; x < this.state.boardWidth; x++) {
        id = tiles.push({ id: id, char: char });
        char = (char + 1) % 34;
      }
    }

    this.setState({ tiles: tiles });
  }

  handleTileClick(tileId) {
    if (this.state.selectedTile === tileId) {
      return;
    }

    if (this.state.showMatchingTiles === true) {
      const hintedTiles = this.state.tiles.filter(
        (t) => (t.char === this.state.tiles[tileId].char)
      );

      this.setState({ hintedTiles: hintedTiles, selectedTile: tileId });
    } else {
      this.setState({ selectedTile: tileId });
    }
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
            .filter((_el, index) => index % 17 === x)
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
          </div>
        </div>
      </>
    );
  }
}

export default Game;
