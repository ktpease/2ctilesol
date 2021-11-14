import React from "react";

import "./Game.css";

import Tile from "./Tile.js";

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tiles: [],
      boardWidth: 17,
      boardHeight: 8,
      useEmoji: true
    };
  }

  componentDidMount() {
    this.generateBoard();
  }

  generateBoard() {
    const tiles = [];

    let id = 0, char = 0;

    for (let y = 0; y < this.state.boardHeight; y++) {
      for (var x = 0; x < this.state.boardWidth; x++) {
        id = tiles.push({id: id, char: char});
        char = (char + 1) % 34;
      }
    }

    this.setState({ tiles: tiles });
  }

  renderHorizontalMap() {
    const tileMap = [];

    // Standard horizontal board. Used for landscape orientation.
    for (let y = 0; y < this.state.boardHeight; y++) {
      tileMap[y] = (
        <div key={"board-hori-row" + y}>
          {this.state.tiles
            .slice(y * this.state.boardWidth, (y + 1) * this.state.boardWidth)
            .map((i) => (
              <Tile tile={i.char} key={i.id} glyph={!this.state.useEmoji} />
            ))}
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
            .map((i) => (
              <Tile tile={i.char} key={i.id} glyph={!this.state.useEmoji} />
            ))}
        </div>
      );
    }

    return tileMap;
  }

  render() {
    return (
      <>
        <div>
          <div className="game-board game-board-horizontal">
            {this.renderHorizontalMap()}
          </div>
          <div className="game-board game-board-vertical">
            {this.renderVerticalMap()}
          </div>
          <div>
            <button onClick={() => this.setState((state) => ({useEmoji: !state.useEmoji}))}>Change tile type</button>
          </div>
        </div>
      </>
    );
  }
}

export default Game;
