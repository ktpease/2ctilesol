import React from "react";
import ReactModal from "react-modal";

import { checkSimplestPath, checkAllPossibleMatches } from "./PathLogic.js";
import {
  generateBoardWithSimpleShuffle,
  generateBoardWithPresolvedShuffle,
} from "./BoardGenerator.js";

import Tile from "./Tile.js";
import PathNode from "./PathNode.js";
import GameTimer from "./GameTimer.js";

import SettingsModalBody from "./modal/SettingsModalBody.js";
import NewBoardModalBody from "./modal/NewBoardModalBody.js";
import AdvancedSettingsModalBody from "./modal/AdvancedSettingsModalBody.js";

import "./Game.css";
import "./SettingsModal.css";
import "./GameBar.css";

ReactModal.setAppElement(document.getElementById("root"));

export default class Game extends React.Component {
  constructor(props) {
    super(props);

    this.gameStateVer = 0;

    this.state = {
      // Settings
      useEmoji: false,
      allowDeselect: true,
      showMatchingTiles: false,
      showAllValidMatches: false,
      // Modal
      showModal: false,
      modalState: null,
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
      allValidMatchingTiles: [],
      // Pathing Maps
      pathingTiles: [],
      pathingTilesAlt: [],
      useAltPathingTiles: false,
      // Tile Display Maps
      horizontalTileMap: [],
      verticalTileMap: [],
    };

    this.timerRef = React.createRef();
  }

  componentDidMount() {
    this.checkEmojiMode();

    const gameState = this.getStateFromLocal();

    if (
      gameState !== null &&
      "v" in gameState &&
      gameState.v === this.gameStateVer
    ) {
      try {
        this.setState(
          {
            tiles: gameState.tiles.map((t, i) => ({
              id: i,
              char: t,
              inRemovalAnim: false,
            })),
            boardWidth: gameState.boardWidth,
            boardHeight: gameState.boardHeight,
            seed: gameState.seed,
            tileHistory: gameState.tileHistory,
          },
          () => {
            this.generateHorizontalMap();
            this.generateVerticalMap();

            this.checkAllValidMatches();

            const newTimer = new Date();

            newTimer.setSeconds(
              newTimer.getSeconds() +
                gameState.timer.seconds +
                gameState.timer.minutes * 60 +
                gameState.timer.hours * 3600
            );

            this.timerRef.current.reset(newTimer);
          }
        );
      } catch {
        this.resetBoard(null, 17, 8);
      }
    } else {
      this.resetBoard();
    }
  }

  getStateFromLocal() {
    // Check if LocalStorage is active.
    if (typeof localStorage !== "undefined") {
      try {
        localStorage.setItem("test", "1");
        if (localStorage.getItem("test") === "1") {
          localStorage.removeItem("test");
        }
      } catch (e) {
        return null;
      }
    } else {
      return null;
    }

    const gameStateJson = localStorage.getItem("gamestate");

    if (gameStateJson !== null) {
      return JSON.parse(gameStateJson);
    } else {
      return null;
    }
  }

  saveStateToLocal() {
    // Check if LocalStorage is active.
    if (typeof localStorage !== "undefined") {
      try {
        localStorage.setItem("test", "1");
        if (localStorage.getItem("test") === "1") {
          localStorage.removeItem("test");
        }
      } catch (e) {
        return;
      }
    } else {
      return;
    }

    localStorage.setItem(
      "gamestate",
      JSON.stringify({
        v: this.gameStateVer,
        tiles: this.state.tiles.map((t) => (t.inRemovalAnim ? null : t.char)),
        boardWidth: this.state.boardWidth,
        boardHeight: this.state.boardHeight,
        seed: this.state.seed,
        tileHistory: this.state.tileHistory,
        timer: {
          seconds: this.timerRef.current.seconds,
          minutes: this.timerRef.current.minutes,
          hours: this.timerRef.current.hours,
        },
      })
    );
  }

  checkEmojiMode() {
    // Currently, all mahjong tiles are Non-RGI with the exception of Red Dragon,
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

  resetBoard(seed, width, height, shuffleType) {
    const newWidth = width ? width : this.state.boardWidth,
      newHeight = height ? height : this.state.boardHeight;

    let generatedBoard;

    if (shuffleType && shuffleType === "simple") {
      generatedBoard = generateBoardWithSimpleShuffle(
        seed,
        newWidth,
        newHeight
      );
    } else {
      generatedBoard = generateBoardWithPresolvedShuffle(
        seed,
        newWidth,
        newHeight
      );
    }

    this.setState(
      {
        tiles: generatedBoard.tiles,
        boardWidth: newWidth,
        boardHeight: newHeight,
        seed: generatedBoard.seed,
        selectedTile: null,
        tileHistory: [],
        hintedTiles: [],
        allValidMatches: [],
        pathingTiles: [],
        pathingTilesAlt: [],
        showModal: false,
      },
      () => {
        this.generateHorizontalMap();
        this.generateVerticalMap();

        this.checkAllValidMatches();
        this.timerRef.current.reset();

        this.saveStateToLocal();
      }
    );
  }

  checkAllValidMatches() {
    const allValidMatches = checkAllPossibleMatches(
      this.state.tiles,
      this.state.boardWidth,
      this.state.boardHeight
    );

    console.log(
      this.state.showAllValidMatches === true
        ? "Valid Matches: " +
            allValidMatches.reduce(
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

    this.setState({
      allValidMatchingTiles: [...new Set(allValidMatches.flat())],
    });
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
            this.saveStateToLocal();
          }
        );

        // Switch between primary and alternate pathing maps. This is used
        // as a makeshift solution to consecutive matches using the same tile
        // path, as the CSS animation doesn't get reset.
        if (this.state.useAltPathingTiles === true)
          this.setState((prevState) => ({
            pathingTiles: prevState.tiles.map(() => []),
            pathingTilesAlt: pathingTiles,
            useAltPathingTiles: false,
          }));
        else
          this.setState((prevState) => ({
            pathingTiles: pathingTiles,
            pathingTilesAlt: prevState.tiles.map(() => []),
            useAltPathingTiles: true,
          }));
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
          this.saveStateToLocal();
        }
      );
    }
  }

  showModal(modalState) {
    this.timerRef.current.pause();

    if (modalState) this.setState({ showModal: true, modalState: modalState });
    else this.setState({ showModal: true });
  }

  hideModal() {
    this.timerRef.current.start();

    this.setState({ showModal: false });
  }

  renderModalBody(modalState) {
    switch (modalState) {
      case "Settings":
        return (
          <SettingsModalBody
            seed={this.state.seed}
            canUndo={this.state.tileHistory.length === 0}
            tilesMatchable={this.state.allValidMatchingTiles.length}
            handleResetBoard={this.resetBoard.bind(this)}
            handleUndoMatch={this.undoMatch.bind(this)}
            newBoardModal={() => this.showModal("New Board")}
            advancedSettingsModal={() => this.showModal("Advanced Settings")}
          />
        );
      case "Advanced Settings":
        return (
          <AdvancedSettingsModalBody
            toggleHighlightAllMatches={() =>
              this.setState((state) => ({
                showAllValidMatches: !state.showAllValidMatches,
              }))
            }
            toggleHighlightMatchesForTile={() =>
              this.setState((state) => ({
                showMatchingTiles: !state.showMatchingTiles,
              }))
            }
            toggleEmojiMode={() =>
              this.setState((state) => ({ useEmoji: !state.useEmoji }))
            }
            backModal={() => this.showModal("Settings")}
          />
        );
      case "New Board":
        return (
          <NewBoardModalBody
            handleResetBoard={this.resetBoard.bind(this)}
            backModal={() => this.showModal("Settings")}
          />
        );
      default:
        return null;
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
      <span key={tileobj.id}>
        <Tile
          tile={tileobj.char}
          glyph={!this.state.useEmoji}
          selected={tileobj.id === this.state.selectedTile}
          hinted={
            this.state.hintedTiles.includes(tileobj) && !tileobj.inRemovalAnim
          }
          highlighted={
            this.state.showAllValidMatches &&
            this.state.allValidMatchingTiles.includes(tileobj.id)
          }
          fade={tileobj.inRemovalAnim}
          onClick={() => this.handleTileClick(tileobj.id)}
        />
        <PathNode node={this.state.pathingTiles[tileobj.id]} />
        <PathNode node={this.state.pathingTilesAlt[tileobj.id]} />
      </span>
    );
  }

  render() {
    return (
      <>
        <div>
          <div
            className={`game-board game-board-horizontal game-board-size-${
              this.state.boardHeight
            } ${this.state.useEmoji ? "game-board-emoji" : "game-board-glyph"}`}
          >
            {this.renderHorizontalMap()}
          </div>
          <div
            className={`game-board game-board-vertical game-board-size-${
              this.state.boardHeight
            } ${this.state.useEmoji ? "game-board-emoji" : "game-board-glyph"}`}
          >
            {this.renderVerticalMap()}
          </div>
        </div>
        <div className="game-bar">
          <GameTimer ref={this.timerRef} />
          <button
            className={`settings-button ${
              this.state.showModal ? "settings-button-opened" : ""
            }`}
            onClick={() => this.showModal("Settings")}
          >
            &#x2699;
          </button>
          <button
            className="undo-button"
            onClick={() => this.undoMatch()}
            disabled={this.state.tileHistory.length === 0}
          >
            &#x21B6;
          </button>
        </div>

        <ReactModal
          isOpen={this.state.showModal}
          contentLabel={this.state.modalState}
          onRequestClose={() => this.hideModal()}
          shouldCloseOnOverlayClick={false}
        >
          {this.renderModalBody(this.state.modalState)}
          <button onClick={() => this.hideModal()}>Close Modal</button>
        </ReactModal>
      </>
    );
  }
}
