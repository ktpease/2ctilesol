import React from "react";
import seedrandom from "seedrandom";

import { checkSimplestPath } from "./PathLogic.js";

import Tile from "./Tile.js";

import "./Game.css";

export default class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      useEmoji: false,
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
    this.checkEmojiMode();
    this.generateBoard(null);
  }

  checkEmojiMode() {
    // Currently, all majong tiles are Non-RGI with the exception of Red Dragon,
    // and the only system font that supports all of these tiles as emojis is the
    // Segoe UI Emoji family, included in Windows 10+.
    //
    // It is unlikely that future Unicode Emoji specifications will support
    // all tiles as RGI, and I'm unsure if other system font providers will
    // support them. So for now, we'll just assume that only desktop Windows 10+
    // can run the emoji mode.
    //
    // If any other system or custom font providers begin supporting this, just
    // please make sure they're front-facing (looking at you, Noto Emoji).

    // If we don't care that it breaks previous Windows versions, we can just
    // use the is-windows package. But for compatibility, we'll just check the
    // browser's user agent string.
    //
    // Conveniently, Windows 10 and up have double-digit version numbers!
    if (
      window.navigator &&
      /Windows NT \d{2}/.test(window.navigator.userAgent)
    ) {
      this.setState({ useEmoji: true });
    }
  }

  generateBoard(seed) {
    const tiles = [],
      allValidTiles = [];

    let id = 0,
      char = -1,
      chardupe = -1;

    // Determine if we need to generate a random seed
    // or use a pre-determined one from the seed argument.
    // This will be used in both tile selection and board shuffling.
    const finalSeed = isNaN(parseInt(seed, 10))
      ? seedrandom().int32() >>> 0
      : parseInt(seed, 10) >>> 0;

    const seededRng = seedrandom(finalSeed);

    // Generate which tiles are used. This is done by listing all
    // possible tiles (without duplicates), then shuffling with
    // a simple Fisher-Yates shuffle.
    let tileCharUsed = [...Array(34).keys()],
      randValue = 0;
    
    // Chrome for Android has a bug where it'll not respect VS15/U+FE0E and
    // always render the Red Dragon tile as emoji. Until it is fixed, replace
    // the Red Dragon with the unused Joker tile.
    if (
      window.navigator &&
      window.navigator.userAgent.includes("Chrome") &&
      window.navigator.userAgent.includes("Mobile")
    ) {
      tileCharUsed[4] = 42;
    }

    for (let i = tileCharUsed.length - 1; i > 0; i--) {
      randValue = Math.floor(seededRng() * (i + 1));

      char = tileCharUsed[i];
      tileCharUsed[i] = tileCharUsed[randValue];
      tileCharUsed[randValue] = char;
    }

    // Top outer edge.
    for (let x = 0; x < this.state.boardWidth + 2; x++)
      id = tiles.push({ id: id, char: null });

    // Generate the initial unshuffled layout of tiles.
    for (let y = 0; y < this.state.boardHeight; y++) {
      // Left outer edge.
      id = tiles.push({ id: id, char: null });

      for (let x = 0; x < this.state.boardWidth; x++) {
        if ((chardupe = (chardupe + 1) % 4) === 0) {
          char = (char + 1) % tileCharUsed.length;
        }

        allValidTiles.push(id);
        id = tiles.push({ id: id, char: tileCharUsed[char] });
      }

      // Right outer edge.
      id = tiles.push({ id: id, char: null });
    }

    // Bottom outer edge.
    for (let x = 0; x < this.state.boardWidth + 2; x++)
      id = tiles.push({ id: id, char: null });

    // Shuffle the board using a simple Fisher-Yates shuffle.
    for (let i = allValidTiles.length - 1; i > 0; i--) {
      randValue = Math.floor(seededRng() * (i + 1));

      char = tiles[allValidTiles[i]].char;
      tiles[allValidTiles[i]].char = tiles[allValidTiles[randValue]].char;
      tiles[allValidTiles[randValue]].char = char;
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
        console.debug(`Unclicked ${tileId}`);
      }

      return;
    }

    console.debug(`Clicked ${tileId}`);

    // If selecting a second tile, check to make sure it matches the first,
    // then check the pathing to see if it's valid, then clear valid matches.
    if (
      this.state.selectedTile !== null &&
      this.state.tiles[tileId].char ===
        this.state.tiles[this.state.selectedTile].char
    ) {
      const path = checkSimplestPath(
        tileId,
        this.state.selectedTile,
        this.state.tiles.slice(),
        this.state.boardWidth,
        this.state.boardHeight
      );

      if (path !== null) {
        console.debug(path);

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
