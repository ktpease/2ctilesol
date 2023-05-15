import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import ReactModal from "react-modal";

import { checkSimplestPath, checkAllPossibleMatches } from "./util/PathLogic";
import {
  generateBoardWithSimpleShuffle,
  generateBoardWithPresolvedShuffle,
  generateRectangularBoardWithSimpleShuffle,
  generateRectangularBoardWithPresolvedShuffle,
} from "./util/BoardGenerator";

import GameBoard from "./board/GameBoard";

import GameTimer from "./GameTimer";

import SettingsModalBody from "./modal/SettingsModalBody";
import NewBoardModalBody from "./modal/NewBoardModalBody";
import AdvancedSettingsModalBody from "./modal/AdvancedSettingsModalBody";
import GameWinModalBody from "./modal/GameWinModalBody";
import GameLoseModalBody from "./modal/GameLoseModalBody";

import "./modal/Modal.css";
import "./GameBar.css";

ReactModal.setAppElement(document.getElementById("root"));

export default function Game() {
  const gameStateVer = 5;

  // Settings
  const [useEmoji, setUseEmoji] = useState(false);
  const [showMatchingTiles, setShowMatchingTiles] = useState(false);
  const [showAllValidMatches, setShowAllValidMatches] = useState(false);
  const [fixChromeAndroidEmojiBug, setFixChromeAndroidEmojiBug] =
    useState(false);

  const DeselectBehavior = {
    ON_ANOTHER_TILE: "ON_ANOTHER_TILE",
    ON_SAME_TILE: "ON_SAME_TILE",
    ON_ANY_TILE: "ON_ANY_TILE",
  };

  const [deselectBehavior, setDeselectBehavior] = useState(
    DeselectBehavior.ON_ANOTHER_TILE
  );

  const EmptySpace = {
    BLANK: "BLANK",
    TILE_BACK: "TILE_BACK",
  };

  const [emptySpace, setEmptySpace] = useState(EmptySpace.BLANK);

  // Game State
  const [gameEnded, setGameEnded] = useState(true);

  // Modal
  const GameModals = {
    SETTINGS: "SETTINGS",
    SETTINGS_ADVANCED: "SETTINGS_ADVANCED",
    NEW_BOARD: "NEW_BOARD",
    GAME_WON: "GAME_WON",
    GAME_LOST: "GAME_LOST",
  };
  const [modalDisplayed, setModalDisplayed] = useState(false);
  const [modalState, setModalState] = useState(null);

  // Board Generation Options
  const [boardWidth, setBoardWidth] = useState(17);
  const [boardHeight, setBoardHeight] = useState(8);
  const [seed, setSeed] = useState(1);
  const [layoutCode, setLayoutCode] = useState(0);
  const [blindShuffle, setBlindShuffle] = useState(false);
  const [noSinglePairs, setNoSinglePairs] = useState(false);
  const [layoutDescription, setLayoutDescription] = useState(
    "Rectangle 17\u2a2f8"
  );

  // Tile State
  const [tiles, setTiles] = useState([]);
  const [selectedTile, setSelectedTile] = useState(null);
  const [numTiles, setNumTiles] = useState(136);

  // Tile History
  const [tileHistory, setTileHistory] = useState([]);

  // Tile Hinting
  const [hintedTiles, setHintedTiles] = useState([]);
  const [allValidMatchingTiles, setAllValidMatchingTiles] = useState([]);

  // Pathing Maps
  const [pathingTiles, setPathingTiles] = useState([]);
  const [pathingTilesAlt, setPathingTilesAlt] = useState([]);
  const [useAltPathingTiles, setUseAltPathingTiles] = useState(false);

  const [searchParams] = useSearchParams();

  const timerRef = useRef();

  // First time initialization.
  useEffect(() => {
    checkFontCompatibility();

    const gameState = loadGameState(),
      layout = searchParams?.get("l"),
      seed = searchParams?.get("s"),
      blindShuffle = searchParams?.get("ts") !== null,
      noSinglePairs = searchParams?.get("nsp") !== null;

    // Get the initial board, in order of priority:
    // - Create from URL search parameters. (Shared hyperlink)
    // - Recreate from the browser's web storage. (Persistence)
    // - Create basic 17x8 board. (Default)
    if (layout !== null) {
      resetGameState(seed, null, null, blindShuffle, noSinglePairs, layout);
    } else if (
      gameState !== null &&
      "v" in gameState &&
      gameState.v === gameStateVer
    ) {
      try {
        setTiles(
          gameState.tiles.map((t, i) => ({
            id: i,
            char: t,
            inRemovalAnim: false,
          }))
        );
        setBoardWidth(gameState.boardWidth);
        setBoardHeight(gameState.boardHeight);
        setSeed(gameState.seed);
        setLayoutCode(gameState.layoutCode);
        setBlindShuffle(gameState.blindShuffle);
        setNoSinglePairs(gameState.noSinglePairs);
        setLayoutDescription(gameState.layoutDescription);
        setNumTiles(gameState.numTiles);
        setTileHistory(gameState.tileHistory);

        const newTimer = new Date();

        newTimer.setSeconds(
          newTimer.getSeconds() +
            gameState.timer.seconds +
            gameState.timer.minutes * 60 +
            gameState.timer.hours * 3600
        );

        timerRef.current.reset(newTimer);
      } catch {
        resetGameState(null, 17, 8);
      }
    } else {
      resetGameState();
    }
  }, []);

  // Get the current game state from the browser's web stoarge.
  function loadGameState() {
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

  // Save the current game state to the browser's web storage.
  function saveGameState() {
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
        v: gameStateVer,
        tiles: tiles.map((t) => (t.inRemovalAnim ? null : t.char)),
        boardWidth: boardWidth,
        boardHeight: boardHeight,
        seed: seed,
        layoutCode: layoutCode,
        blindShuffle: blindShuffle,
        noSinglePairs: noSinglePairs,
        layoutDescription: layoutDescription,
        numTiles: numTiles,
        tileHistory: tileHistory,
        timer: {
          seconds: timerRef.current.seconds,
          minutes: timerRef.current.minutes,
          hours: timerRef.current.hours,
        },
      })
    );
  }

  // Checks with some font issues regarding the Mahjong Tiles Unicode Block.
  function checkFontCompatibility() {
    // Currently, all mahjong tiles are Non-RGI with the exception of Red Dragon,
    // and the only system font that supports all of these tiles as emojis is the
    // Segoe UI Emoji family, included in Windows 10+.
    //
    // It is unlikely that future Unicode Emoji specifications will support
    // all tiles as RGI, and I'm unsure if other system font providers will
    // support them (whether in the proper orientation or just outright).
    // So for now, we'll just assume that only desktop Windows 10+ can run the
    // emoji mode.

    // If we don't care that it breaks previous Windows versions, we can just
    // use the is-windows package. But for compatibility, we'll just use the UA-CH
    // API.
    if (navigator.userAgentData)
      navigator.userAgentData
        .getHighEntropyValues(["platform", "platformVersion"])
        .then((ua) => {
          if (ua.platform === "Windows" && parseInt(ua.platformVersion) >= 10) {
            console.log("Windows 10+ detected, using emoji tiles.");
            setUseEmoji(true);
          }
        });
    else if (
      window.navigator &&
      /Windows NT \d{2}/.test(window.navigator.userAgent)
    ) {
      console.log("Windows 10+ detected, using emoji tiles.");
      setUseEmoji(true);
    }

    // Chrome for Android has a bug where it'll not respect VS15/U+FE0E and
    // always render the Red Dragon tile as emoji. For now, just replace it
    // with a red version of the blue White Dragon tile.
    if (
      navigator.userAgentData
        ? navigator.userAgentData.brands.some((item) => {
            return item.brand === "Chromium";
          }) === true && navigator.userAgentData.mobile === true
        : window.navigator &&
          window.navigator.userAgent.includes("Chrome") &&
          window.navigator.userAgent.includes("Mobile")
    ) {
      setFixChromeAndroidEmojiBug(true);
    }
  }

  // Resets the game state while generating a new board.
  function resetGameState(
    seed,
    width = boardWidth,
    height = boardHeight,
    bs = blindShuffle,
    nsp = noSinglePairs,
    layoutCode
  ) {
    let generatedBoard;
    let layoutDescription;

    if (layoutCode !== null && layoutCode !== undefined) {
      // Generate the board based on the provided layout code. Fallback to the
      // default board if it fails.

      if (bs) {
        generatedBoard = generateBoardWithSimpleShuffle(seed, layoutCode, nsp);
      } else {
        generatedBoard = generateBoardWithPresolvedShuffle(
          seed,
          layoutCode,
          nsp
        );
      }

      if (generatedBoard === null) {
        console.error(
          "Invalid generated board, switching to default 17x8 board."
        );

        generatedBoard = generateRectangularBoardWithPresolvedShuffle(
          null,
          17,
          8
        );

        layoutDescription = "Rectangle";
      } else {
        layoutDescription = "Custom";
      }
    } else {
      // Generate a basic rectangular board based on the provided width and
      // height.

      if (bs) {
        generatedBoard = generateRectangularBoardWithSimpleShuffle(
          seed,
          width,
          height,
          nsp
        );
      } else {
        generatedBoard = generateRectangularBoardWithPresolvedShuffle(
          seed,
          width,
          height,
          nsp
        );
      }

      layoutDescription = "Rectangle";
    }

    if (generatedBoard === null) {
      console.log("Failed to generate board! Cancel board reset.");
      return;
    }

    layoutDescription += ` ${generatedBoard.width}\u2a2f${
      generatedBoard.height
    }${bs ? " TrueShuffle" : ""}${nsp ? " NoSinglePairs" : ""}`;

    setTiles(generatedBoard.tiles);
    setBoardWidth(generatedBoard.width);
    setBoardHeight(generatedBoard.height);
    setSeed(generatedBoard.seed);
    setLayoutCode(generatedBoard.layoutCode);
    setBlindShuffle(bs);
    setNoSinglePairs(nsp);
    setLayoutDescription(layoutDescription);
    setNumTiles(generatedBoard.numTiles);
    setSelectedTile(null);
    setTileHistory([]);
    setHintedTiles([]);
    setAllValidMatchingTiles([]);
    setPathingTiles([]);
    setPathingTilesAlt([]);
    setModalDisplayed(false);
    setGameEnded(false);
    timerRef.current.reset();
  }

  // Every time the tile array is updated, save the game state and check the
  // number of valid matches.
  useEffect(() => {
    if (!gameEnded) {
      checkAllValidMatches();
      saveGameState();
    }
  }, [tiles]);

  // Check all possible matches for the current board. Display them in debugging
  // options, and check the game end state when there are no matches remaining.
  function checkAllValidMatches() {
    const allValidMatches = checkAllPossibleMatches(
      tiles,
      boardWidth,
      boardHeight
    );

    console.log(`Number of Valid Matches: ${allValidMatches.length}`);

    // Debug: Show all the valid matches in the console.
    if (showAllValidMatches) {
      console.log(
        "Valid Matches: " +
          allValidMatches.reduce(
            (a, b) =>
              a.concat(
                `[${String.fromCodePoint(0x1f000 + tiles[b[0]].char)}, ${
                  (b[0] % (boardWidth + 2)) - 1 + 1
                },${
                  (b[0] - (b[0] % (boardWidth + 2)) - (boardWidth + 2)) /
                    (boardWidth + 2) +
                  1
                } <-> ${(b[1] % (boardWidth + 2)) - 1 + 1},${
                  (b[1] - (b[1] % (boardWidth + 2)) - (boardWidth + 2)) /
                    (boardWidth + 2) +
                  1
                }] `
              ),
            ""
          )
      );
    }

    setAllValidMatchingTiles([...new Set(allValidMatches.flat())]);

    // If there are no matching tiles, then we either won or lost the game.
    if (allValidMatches.length === 0) {
      timerRef.current.pause();
      setGameEnded(true);

      if (numTiles - tileHistory.length * 2 > 0)
        showModal(GameModals.GAME_LOST);
      else showModal(GameModals.GAME_WON);
    }
  }

  function handleTileClick(tileId) {
    if (tiles[tileId].char === null || tiles[tileId].inRemovalAnim === true) {
      // Clicked an empty space.
      return;
    } else if (selectedTile === tileId) {
      // Clicked the same tile.
      if (
        deselectBehavior === DeselectBehavior.ON_SAME_TILE ||
        deselectBehavior === DeselectBehavior.ON_ANY_TILE
      ) {
        setSelectedTile(null);
        setHintedTiles([]);
      }
    } else if (
      selectedTile !== null &&
      tiles[tileId].char === tiles[selectedTile].char
    ) {
      // Clicked a matching tile.

      const path = checkSimplestPath(
        tileId,
        selectedTile,
        tiles.slice(),
        boardWidth,
        boardHeight
      );

      // Match found.
      if (path !== null) {
        const newTiles = tiles.slice();

        // Remove tiles that were in their fadeout animation from the board.
        newTiles.forEach((tile) => {
          if (tile.inRemovalAnim === true) {
            tile.inRemovalAnim = false;
            tile.char = null;
          }
        });

        // Change the matched tiles to their fadeout animation.
        newTiles[tileId].inRemovalAnim = true;
        newTiles[selectedTile].inRemovalAnim = true;

        setTiles(newTiles);

        // Push the match into the tile history stack.
        setTileHistory([
          ...tileHistory,
          {
            char: tiles[tileId].char,
            tile1: tileId,
            tile2: selectedTile,
          },
        ]);

        // Generate the pathing tiles for display.
        const pathingTiles = tiles.map(() => []);

        path.forEach((line) => {
          line.segment.forEach((node) => {
            pathingTiles[node].push(line.dir);
          });
        });

        pathingTiles[selectedTile].push("-start");
        pathingTiles[tileId].push("-end");

        // Switch between primary and alternate pathing maps. This is used
        // as a makeshift solution to consecutive matches using the same tile
        // path, as the CSS animation doesn't get reset.
        if (useAltPathingTiles === true) {
          setPathingTiles(newTiles.map(() => []));
          setPathingTilesAlt(pathingTiles);
          setUseAltPathingTiles(false);
        } else {
          setPathingTiles(pathingTiles);
          setPathingTilesAlt(newTiles.map(() => []));
          setUseAltPathingTiles(true);
        }

        setSelectedTile(null);
        setHintedTiles([]);
      }
    } else if (
      selectedTile === null ||
      deselectBehavior === DeselectBehavior.ON_ANOTHER_TILE ||
      deselectBehavior === DeselectBehavior.ON_ANY_TILE
    ) {
      // Clicked a non-matching tile.
      setSelectedTile(tileId);

      // Update the hinting system, if it's enabled.
      if (showMatchingTiles === true) {
        const hintedTiles = tiles.filter((t) => t.char === tiles[tileId].char);

        setHintedTiles(hintedTiles);
      }
    }
  }

  // Revert the board to the previous state.
  function undoMatch(hideModal) {
    if (tileHistory.length > 0) {
      const newTiles = tiles.slice();
      const lastMatch = tileHistory.slice(-1)[0];

      newTiles[lastMatch.tile1].char = lastMatch.char;
      newTiles[lastMatch.tile1].inRemovalAnim = false;

      newTiles[lastMatch.tile2].char = lastMatch.char;
      newTiles[lastMatch.tile2].inRemovalAnim = false;

      setTiles(newTiles);
      setTileHistory(tileHistory.slice(0, -1));
      setHintedTiles([]);
      setPathingTiles([]);
      setPathingTilesAlt([]);
      setSelectedTile(null);
      setGameEnded(false);

      if (hideModal) hideModal();
    }
  }

  function showModal(modalState) {
    timerRef.current.pause();

    setModalDisplayed(true);

    if (modalState) setModalState(modalState);
  }

  function hideModal() {
    if (!gameEnded) timerRef.current.start();

    setModalDisplayed(false);
  }

  function renderModalBody(modalState) {
    switch (modalState) {
      case GameModals.SETTINGS:
        return (
          <SettingsModalBody
            seed={seed}
            layout={layoutDescription}
            canUndo={tileHistory.length === 0}
            tilesMatchable={allValidMatchingTiles.length}
            handleResetBoard={resetGameState}
            handleUndoMatch={() => {
              undoMatch(true);
            }}
            newBoardModal={() => showModal(GameModals.NEW_BOARD)}
            advancedSettingsModal={() =>
              showModal(GameModals.SETTINGS_ADVANCED)
            }
          />
        );
      case GameModals.SETTINGS_ADVANCED:
        return (
          <AdvancedSettingsModalBody
            toggleHighlightAllMatches={() =>
              setShowAllValidMatches((prevState) => !prevState)
            }
            toggleHighlightMatchesForTile={() =>
              setShowMatchingTiles((prevState) => !prevState)
            }
            toggleEmojiMode={() => setUseEmoji((prevState) => !prevState)}
            backModal={() => showModal(GameModals.SETTINGS)}
          />
        );
      case GameModals.NEW_BOARD:
        return (
          <NewBoardModalBody
            prevWidth={boardWidth}
            prevHeight={boardHeight}
            prevBlindShuffle={blindShuffle}
            prevNoSinglePairs={noSinglePairs}
            prevSeed={seed}
            handleResetBoard={resetGameState}
            backModal={() => showModal(GameModals.SETTINGS)}
          />
        );
      case GameModals.GAME_WON:
        return (
          <GameWinModalBody
            numTiles={numTiles}
            clearTimeHours={timerRef.current.hours}
            clearTimeMinutes={timerRef.current.minutes}
            clearTimeSeconds={timerRef.current.seconds}
            seed={seed}
            layout={layoutDescription}
            handleResetBoard={resetGameState}
            newBoardModal={() => showModal(GameModals.NEW_BOARD)}
          />
        );
      case GameModals.GAME_LOST:
        return (
          <GameLoseModalBody
            remainingTiles={numTiles - tileHistory.length * 2}
            seed={seed}
            layout={layoutDescription}
            canUndo={tileHistory.length === 0}
            handleUndoMatch={() => undoMatch(true)}
            handleResetBoard={resetGameState}
            newBoardModal={() => showModal("New Board")}
          />
        );
      default:
        return null;
    }
  }

  return (
    <>
      <GameBoard
        {...{
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
        }}
      />

      <div className="game-bar">
        <GameTimer ref={timerRef} />
        <button
          className={`settings-button ${
            modalDisplayed ? "settings-button-opened" : ""
          }`}
          onClick={() => showModal(GameModals.SETTINGS)}
        >
          &#x2699;
        </button>
        <button
          className="undo-button"
          onClick={() => undoMatch(false)}
          disabled={tileHistory.length === 0}
        >
          &#x21B6;
        </button>
      </div>

      <ReactModal
        isOpen={modalDisplayed}
        contentLabel={modalState}
        onRequestClose={() => hideModal()}
        shouldCloseOnOverlayClick={false}
      >
        {renderModalBody(modalState)}
        <button onClick={() => hideModal()}>Close</button>
      </ReactModal>
    </>
  );
}
