import React from "react";
import ReactModal from "react-modal";
import seedrandom from "seedrandom";

import { checkSimplestPath, checkAllPossibleMatches } from "./PathLogic.js";

import Tile from "./Tile.js";
import PathNode from "./PathNode.js";

import "./Game.css";
import "./SettingsModal.css";
import "./GameBar.css";

ReactModal.setAppElement(document.getElementById("root"));

export default class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // Settings
      showSettingsModal: false,
      useEmoji: false,
      allowDeselect: true,
      showMatchingTiles: true,
      showAllValidMatches: true,
      // Board Generation Options
      boardWidth: 17,
      boardHeight: 8,
      seed: 1,
      // Tile State
      tiles: [],
      selectedTile: null,
      // Tile History
      tileHistory: [],
      // Tile Hinting
      hintedTiles: [],
      allValidMatches: [],
      allValidMatchTiles: [],
      // Pathing Maps
      pathingTiles: [],
      pathingTilesAlt: [],
      useAltPathingTiles: false,
      // Tile Display Maps
      horizontalTileMap: [],
      verticalTileMap: [],
    };
  }

  componentDidMount() {
    this.checkEmojiMode();
    this.generateBoard();
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
    // use the is-windows package. But for compatibility, we'll just use the UA-CH
    // API.
    if (navigator.userAgentData)
      navigator.userAgentData
        .getHighEntropyValues(["platform", "platformVersion"])
        .then((ua) => {
          if (ua.platform === "Windows" && parseInt(ua.platformVersion) >= 10) {
            console.log("Windows 10+ detected, using emoji tiles.");
            this.setState({ useEmoji: true });
          }
        });
    else if (
      window.navigator &&
      /Windows NT \d{2}/.test(window.navigator.userAgent)
    ) {
      console.log("Windows 10+ detected, using emoji tiles.");
      this.setState({ useEmoji: true });
    }
  }

  generateBoard(seed, width, height) {
    const tiles = [],
      allValidTiles = [];

    const newWidth = width ? width : this.state.boardWidth,
      newHeight = height ? height : this.state.boardHeight;

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
      navigator.userAgentData
        ? navigator.userAgentData.brands.some((item) => {
            return item.brand === "Chromium";
          }) === true && navigator.userAgentData.mobile === true
        : window.navigator &&
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
    for (let x = 0; x < newWidth + 2; x++)
      id = tiles.push({ id: id, char: null, inRemovalAnim: false });

    // Generate the initial unshuffled layout of tiles.
    for (let y = 0; y < newHeight; y++) {
      // Left outer edge.
      id = tiles.push({ id: id, char: null, inRemovalAnim: false });

      for (let x = 0; x < newWidth; x++) {
        if ((chardupe = (chardupe + 1) % 4) === 0) {
          char = (char + 1) % tileCharUsed.length;
        }

        allValidTiles.push(id);
        id = tiles.push({
          id: id,
          char: tileCharUsed[char],
          inRemovalAnim: false,
        });
      }

      // Right outer edge.
      id = tiles.push({ id: id, char: null, inRemovalAnim: false });
    }

    // Bottom outer edge.
    for (let x = 0; x < newWidth + 2; x++)
      id = tiles.push({ id: id, char: null, inRemovalAnim: false });

    // Shuffle the board using a simple Fisher-Yates shuffle.
    for (let i = allValidTiles.length - 1; i > 0; i--) {
      randValue = Math.floor(seededRng() * (i + 1));

      char = tiles[allValidTiles[i]].char;
      tiles[allValidTiles[i]].char = tiles[allValidTiles[randValue]].char;
      tiles[allValidTiles[randValue]].char = char;
    }

    console.log(`Game board seed is ${finalSeed}`);

    this.setState(
      {
        tiles: tiles,
        boardWidth: newWidth,
        boardHeight: newHeight,
        seed: finalSeed,
        selectedTile: null,
        tileHistory: [],
        hintedTiles: [],
        allValidMatches: [],
        pathingTiles: [],
        pathingTilesAlt: [],
        showSettingsModal: false,
      },
      () => {
        this.generateHorizontalMap();
        this.generateVerticalMap();

        this.checkAllValidMatches();
      }
    );
  }

  checkAllValidMatches() {
    this.setState(
      {
        allValidMatches: checkAllPossibleMatches(
          this.state.tiles,
          this.state.boardWidth,
          this.state.boardHeight
        ),
      },
      () => {
        this.setState({
          allValidMatchTiles: [...new Set(this.state.allValidMatches.flat())],
        });

        console.log(
          this.state.showAllValidMatches === true
            ? "Valid Matches: " +
                this.state.allValidMatches.reduce(
                  (a, b) =>
                    a.concat(
                      `[${(b[0] % (this.state.boardWidth + 2)) - 1 + 1},${
                        (b[0] -
                          (b[0] % (this.state.boardWidth + 2)) -
                          (this.state.boardWidth + 2)) /
                          (this.state.boardWidth + 2) +
                        1
                      } <-> ${(b[1] % (this.state.boardWidth + 2)) - 1 + 1},${
                        (b[1] -
                          (b[1] % (this.state.boardWidth + 2)) -
                          (this.state.boardWidth + 2)) /
                          (this.state.boardWidth + 2) +
                        1
                      }] `
                    ),
                  ""
                )
            : ""
        );
      }
    );
  }

  handleTileClick(tileId) {
    // Don't click empty or tiles being removed.
    if (
      this.state.tiles[tileId].char === null ||
      this.state.tiles[tileId].inRemovalAnim === true
    ) {
      return;
    }

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

        // Create an updated board, first by removing the tiles in its
        // fadeout animation, then putting the match in that same animation.
        const newTiles = this.state.tiles.slice();

        newTiles.forEach((tile) => {
          if (tile.inRemovalAnim === true) {
            tile.inRemovalAnim = false;
            tile.char = null;
          }
        });

        newTiles[tileId].inRemovalAnim = true;
        newTiles[this.state.selectedTile].inRemovalAnim = true;

        const tileHistory = this.state.tileHistory.slice();

        tileHistory.push({
          char: this.state.tiles[tileId].char,
          tile1: tileId,
          tile2: this.state.selectedTile,
        });

        // Generate the pathing tiles for display.
        const pathingTiles = this.state.tiles.map(() => []);

        path.forEach((line) => {
          line.segment.forEach((node) => {
            pathingTiles[node].push(line.dir);
          });
        });

        pathingTiles[this.state.selectedTile].push("-start");
        pathingTiles[tileId].push("-end");

        this.setState(
          {
            tiles: newTiles,
            selectedTile: null,
            tileHistory: tileHistory,
            hintedTiles: [],
          },
          () => {
            this.checkAllValidMatches();
          }
        );

        // Switch between primary and alternate pathing maps. This is used
        // as a makeshift solution to consecutive matches using the same tile
        // path, as the CSS animation doesn't get reset.
        if (this.state.useAltPathingTiles === true)
          this.setState({
            pathingTiles: this.state.tiles.map(() => []),
            pathingTilesAlt: pathingTiles,
            useAltPathingTiles: false,
          });
        else
          this.setState({
            pathingTiles: pathingTiles,
            pathingTilesAlt: this.state.tiles.map(() => []),
            useAltPathingTiles: true,
          });
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

  undoMatch() {
    if (this.state.tileHistory.length > 0) {
      const newTiles = this.state.tiles.slice();
      const lastMatch = this.state.tileHistory.pop();

      newTiles[lastMatch.tile1].char = lastMatch.char;
      newTiles[lastMatch.tile1].inRemovalAnim = false;

      newTiles[lastMatch.tile2].char = lastMatch.char;
      newTiles[lastMatch.tile2].inRemovalAnim = false;

      this.setState(
        {
          tiles: newTiles,
          hintedTiles: [],
          pathingTiles: [],
          pathingTilesAlt: [],
          selectedTile: null,
        },
        () => {
          this.checkAllValidMatches();
        }
      );
    }
  }

  generateHorizontalMap() {
    const tileMap = [];

    // Standard horizontal board. Used for landscape orientation.
    for (let y = 0; y < this.state.boardHeight + 2; y++) {
      tileMap[y] = this.state.tiles.slice(
        y * (this.state.boardWidth + 2),
        (y + 1) * (this.state.boardWidth + 2)
      );
    }

    this.setState({ horizontalTileMap: tileMap });
  }

  renderHorizontalMap() {
    const tileMap = [];

    if (typeof this.state.horizontalTileMap === "undefined") {
      return;
    }

    for (let y = 0; y < this.state.horizontalTileMap.length; y++) {
      tileMap[y] = (
        <div key={"board-hori-row" + y}>
          {this.state.horizontalTileMap[y].map((i) =>
            this.renderTileAndPath(i, "hori")
          )}
        </div>
      );
    }

    return tileMap;
  }

  generateVerticalMap() {
    const tileMap = [];

    // Rotated vertical board. Used for portrait orientation.
    for (let x = 0; x < this.state.boardWidth + 2; x++) {
      tileMap[x] = this.state.tiles
        .filter((_el, index) => index % (this.state.boardWidth + 2) === x)
        .reverse();
    }

    this.setState({ verticalTileMap: tileMap });
  }

  renderVerticalMap() {
    const tileMap = [];

    if (typeof this.state.verticalTileMap === "undefined") {
      return;
    }

    for (let x = 0; x < this.state.verticalTileMap.length; x++) {
      tileMap[x] = (
        <div key={"board-vert-row" + x}>
          {this.state.verticalTileMap[x].map((i) =>
            this.renderTileAndPath(i, "vert")
          )}
        </div>
      );
    }

    return tileMap;
  }

  renderTileAndPath(tileobj, boardprefix) {
    return (
      <span key={boardprefix + "span" + tileobj.id}>
        <Tile
          tile={tileobj.char}
          key={boardprefix + "-" + tileobj.id}
          glyph={!this.state.useEmoji}
          selected={tileobj.id === this.state.selectedTile}
          hinted={
            this.state.hintedTiles.includes(tileobj) && !tileobj.inRemovalAnim
          }
          highlighted={this.state.allValidMatchTiles.includes(tileobj.id)}
          fade={tileobj.inRemovalAnim}
          onClick={() => this.handleTileClick(tileobj.id)}
        />
        <PathNode
          key={boardprefix + "-node-" + tileobj.id}
          node={this.state.pathingTiles[tileobj.id]}
        />
        <PathNode
          key={boardprefix + "-altnode-" + tileobj.id}
          node={this.state.pathingTilesAlt[tileobj.id]}
        />
      </span>
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
        </div>
        <div className="game-bar">
          <span>00:00:01</span>
          <button
            className={`settings-button ${
              this.state.showSettingsModal ? "settings-button-opened" : ""
            }`}
            onClick={() =>
              this.setState((state) => ({ showSettingsModal: true }))
            }
          >
            &#8801;
          </button>
          <button
            className="undo-button"
            onClick={() => this.undoMatch()}
            disabled={this.state.tileHistory.length === 0}
          >
            &#11148;
          </button>
        </div>

        <ReactModal
          isOpen={this.state.showSettingsModal}
          contentLabel="Settings"
          onRequestClose={() =>
            this.setState((state) => ({
              showSettingsModal: false,
            }))
          }
          shouldCloseOnOverlayClick={false}
        >
          <div>
            <div>Board #{this.state.seed}</div>
            <button
              onClick={() =>
                this.setState((state) => ({ useEmoji: !state.useEmoji }))
              }
            >
              Change tile type
            </button>
            <button onClick={() => this.generateBoard(this.state.seed)}>
              Reset board
            </button>
            <button
              onClick={() => this.undoMatch()}
              disabled={this.state.tileHistory.length === 0}
            >
              Undo
            </button>
          </div>
          <div>
            <button onClick={() => this.generateBoard(null, 8, 5)}>
              New board (easy)
            </button>
            <button onClick={() => this.generateBoard(null, 12, 7)}>
              New board (medium)
            </button>
            <button onClick={() => this.generateBoard(null, 17, 8)}>
              New board (hard)
            </button>
          </div>
          <button
            onClick={() =>
              this.setState((state) => ({
                showSettingsModal: false,
              }))
            }
          >
            Close Modal
          </button>
        </ReactModal>
      </>
    );
  }
}
