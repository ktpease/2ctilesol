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
import GameWinModalBody from "./modal/GameWinModalBody.js";
import GameLoseModalBody from "./modal/GameLoseModalBody.js";

import "./Game.css";
import "./Modal.css";
import "./GameBar.css";

ReactModal.setAppElement(document.getElementById("root"));

export default class Game extends React.Component {
  constructor(props) {
    super(props);

    this.gameStateVer = 3;

    this.state = {
      // Settings
      useEmoji: false,
      allowDeselect: true,
      showMatchingTiles: false,
      showAllValidMatches: false,
      fixChromeAndroidEmojiBug: false,
      // Game State
      gameEnded: false,
      // Modal
      showModal: false,
      modalState: null,
      // Board Generation Options
      boardWidth: 17,
      boardHeight: 8,
      seed: 1,
      blindShuffle: false,
      noSinglePairs: false,
      layoutDescription: "Rectangle 17\u2a2f8",
      // Tile State
      tiles: [],
      selectedTile: null,
      totalMatchableTiles: 136,
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
    this.checkFontCompatibility();

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
            blindShuffle: gameState.blindShuffle,
            noSinglePairs: gameState.noSinglePairs,
            layoutDescription: gameState.layoutDescription,
            totalMatchableTiles: gameState.totalMatchableTiles,
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
        blindShuffle: this.state.blindShuffle,
        noSinglePairs: this.state.noSinglePairs,
        layoutDescription: this.state.layoutDescription,
        totalMatchableTiles: this.state.totalMatchableTiles,
        tileHistory: this.state.tileHistory,
        timer: {
          seconds: this.timerRef.current.seconds,
          minutes: this.timerRef.current.minutes,
          hours: this.timerRef.current.hours,
        },
      })
    );
  }

  checkFontCompatibility() {
    // Checks with some font issues, namely with regards to emojis.

    // Currently, all mahjong tiles are Non-RGI with the exception of Red Dragon,
    // and the only system font that supports all of these tiles as emojis is the
    // Segoe UI Emoji family, included in Windows 10+.
    //
    // It is unlikely that future Unicode Emoji specifications will support
    // all tiles as RGI, and I'm unsure if other system font providers will
    // support them. So for now, we'll just assume that only desktop Windows 10+
    // can run the emoji mode.

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

    // Chrome for Android has a bug where it'll not respect VS15/U+FE0E and
    // always render the Red Dragon tile as emoji. For compatibility sake, just
    // change it to a red version of the blue White Dragon tile.
    if (
      navigator.userAgentData
        ? navigator.userAgentData.brands.some((item) => {
            return item.brand === "Chromium";
          }) === true && navigator.userAgentData.mobile === true
        : window.navigator &&
          window.navigator.userAgent.includes("Chrome") &&
          window.navigator.userAgent.includes("Mobile")
    ) {
      this.setState({ fixChromeAndroidEmojiBug: true });
    }
  }

  resetBoard(seed, width, height, blindShuffle, noSinglePairs) {
    const _width = width !== undefined ? width : this.state.boardWidth,
      _height = height !== undefined ? height : this.state.boardHeight,
      _blindShuffle =
        blindShuffle !== undefined ? blindShuffle : this.state.blindShuffle,
      _noSinglePairs =
        noSinglePairs !== undefined ? noSinglePairs : this.state.noSinglePairs;

    let generatedBoard;

    if (_blindShuffle) {
      generatedBoard = generateBoardWithSimpleShuffle(
        seed,
        _width,
        _height,
        _noSinglePairs
      );
    } else {
      generatedBoard = generateBoardWithPresolvedShuffle(
        seed,
        _width,
        _height,
        _noSinglePairs
      );
    }

    const layoutDescription = `Rectangle ${_width}\u2a2f${_height}${
      _blindShuffle ? " TrueShuffle" : ""
    }${_noSinglePairs ? " NoSinglePairs" : ""}`;

    this.setState(
      {
        tiles: generatedBoard.tiles,
        boardWidth: _width,
        boardHeight: _height,
        seed: generatedBoard.seed,
        blindShuffle: _blindShuffle,
        noSinglePairs: _noSinglePairs,
        layoutDescription: layoutDescription,
        totalMatchableTiles: generatedBoard.totalMatchableTiles,
        selectedTile: null,
        tileHistory: [],
        hintedTiles: [],
        allValidMatches: [],
        pathingTiles: [],
        pathingTilesAlt: [],
        showModal: false,
        gameEnded: false,
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
      `Number of Valid Matches: ${allValidMatches.length}` +
        (this.state.showAllValidMatches === true
          ? ", Valid Matches: " +
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
          : "")
    );

    this.setState(
      {
        allValidMatchingTiles: [...new Set(allValidMatches.flat())],
      },
      () => {
        // If there are no matching tiles, then we either won or lost the game.
        if (allValidMatches.length === 0) {
          this.timerRef.current.pause();
          this.setState({ gameEnded: true });

          if (
            this.state.totalMatchableTiles - this.state.tileHistory.length * 2 >
            0
          )
            this.showModal("Game Lost");
          else this.showModal("Game Won");
        }
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
            if (!this.state.gameEnded) this.saveStateToLocal();
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

  undoMatch(hideModal) {
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
          gameEnded: false,
        },
        () => {
          if (hideModal) this.hideModal();
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
    if (!this.state.gameEnded) this.timerRef.current.start();

    this.setState({ showModal: false });
  }

  renderModalBody(modalState) {
    switch (modalState) {
      case "Settings":
        return (
          <SettingsModalBody
            seed={this.state.seed}
            layout={this.state.layoutDescription}
            canUndo={this.state.tileHistory.length === 0}
            tilesMatchable={this.state.allValidMatchingTiles.length}
            handleResetBoard={this.resetBoard.bind(this)}
            handleUndoMatch={() => {
              this.undoMatch(true);
            }}
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
            prevWidth={this.state.boardWidth}
            prevHeight={this.state.boardHeight}
            prevBlindShuffle={this.state.blindShuffle} 
            prevNoSinglePairs={this.state.noSinglePairs}
            prevSeed={this.state.seed}
            handleResetBoard={this.resetBoard.bind(this)}
            backModal={() => this.showModal("Settings")}
          />
        );
      case "Game Won":
        return (
          <GameWinModalBody
            numTiles={this.state.totalMatchableTiles}
            clearTimeHours={this.timerRef.current.hours}
            clearTimeMinutes={this.timerRef.current.minutes}
            clearTimeSeconds={this.timerRef.current.seconds}
            seed={this.state.seed}
            layout={this.state.layoutDescription}
            handleResetBoard={this.resetBoard.bind(this)}
            newBoardModal={() => this.showModal("New Board")}
          />
        );
      case "Game Lost":
        return (
          <GameLoseModalBody
            remainingTiles={
              this.state.totalMatchableTiles - this.state.tileHistory.length * 2
            }
            seed={this.state.seed}
            layout={this.state.layoutDescription}
            canUndo={this.state.tileHistory.length === 0}
            handleUndoMatch={() => this.undoMatch(true)}
            handleResetBoard={this.resetBoard.bind(this)}
            newBoardModal={() => this.showModal("New Board")}
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
          fixChromeAndroidEmojiBug={this.state.fixChromeAndroidEmojiBug}
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
            onClick={() => this.undoMatch(false)}
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
          <button onClick={() => this.hideModal()}>Close</button>
        </ReactModal>
      </>
    );
  }
}
