import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import ReactModal from "react-modal";

import { checkSimplestPath, checkAllPossibleMatches } from "./PathLogic";
import {
  generateBoardWithSimpleShuffle,
  generateBoardWithPresolvedShuffle,
  generateRectangularBoardWithSimpleShuffle,
  generateRectangularBoardWithPresolvedShuffle,
} from "./BoardGenerator";

import GameBoard from "./GameBoard";

import GameTimer from "./GameTimer";

import SettingsModalBody from "./modal/SettingsModalBody";
import NewBoardModalBody from "./modal/NewBoardModalBody";
import AdvancedSettingsModalBody from "./modal/AdvancedSettingsModalBody";
import GameWinModalBody from "./modal/GameWinModalBody";
import GameLoseModalBody from "./modal/GameLoseModalBody";

import "./Modal.css";
import "./GameBar.css";

ReactModal.setAppElement(document.getElementById("root"));

export default function Game() {
  const gameStateVer = 5;

  // Settings
  const [useEmoji, setUseEmoji] = useState(false);
  const [allowDeselect, setAllowDeselect] = useState(true);
  const [showMatchingTiles, setShowMatchingTiles] = useState(false);
  const [showAllValidMatches, setShowAllValidMatches] = useState(false);
  const [fixChromeAndroidEmojiBug, setFixChromeAndroidEmojiBug] =
    useState(false);

  // Game State
  const [gameEnded, setGameEnded] = useState(true);

  // Modal
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

  useEffect(() => {
    checkFontCompatibility();

    const gameState = getStateFromLocal(),
      layout = searchParams?.get("l"),
      seed = searchParams?.get("s"),
      blindShuffle = searchParams?.get("ts") !== null,
      noSinglePairs = searchParams?.get("nsp") !== null;

    if (layout !== null) {
      resetBoard(seed, null, null, blindShuffle, noSinglePairs, layout);
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
        resetBoard(null, 17, 8);
      }
    } else {
      resetBoard();
    }
  }, []);

  function getStateFromLocal() {
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

  function saveStateToLocal() {
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

  function checkFontCompatibility() {
    // Checks with some font issues regarding the Mahjong Tiles Unicode Block.

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
    // always render the Red Dragon tile as emoji. For compatibility, just
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
      setFixChromeAndroidEmojiBug(true);
    }
  }

  function resetBoard(seed, width, height, bs, nsp, layoutCode) {
    const _width = width !== undefined ? width : boardWidth,
      _height = height !== undefined ? height : boardHeight,
      _blindShuffle = bs !== undefined ? bs : blindShuffle,
      _noSinglePairs = nsp !== undefined ? nsp : noSinglePairs;

    let generatedBoard;

    let layoutDescription;

    if (layoutCode !== null && layoutCode !== undefined) {
      if (_blindShuffle) {
        generatedBoard = generateBoardWithSimpleShuffle(
          seed,
          layoutCode,
          _noSinglePairs
        );
      } else {
        generatedBoard = generateBoardWithPresolvedShuffle(
          seed,
          layoutCode,
          _noSinglePairs
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
      if (_blindShuffle) {
        generatedBoard = generateRectangularBoardWithSimpleShuffle(
          seed,
          _width,
          _height,
          _noSinglePairs
        );
      } else {
        generatedBoard = generateRectangularBoardWithPresolvedShuffle(
          seed,
          _width,
          _height,
          _noSinglePairs
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
    }${_blindShuffle ? " TrueShuffle" : ""}${
      _noSinglePairs ? " NoSinglePairs" : ""
    }`;

    setTiles(generatedBoard.tiles);
    setBoardWidth(generatedBoard.width);
    setBoardHeight(generatedBoard.height);
    setSeed(generatedBoard.seed);
    setLayoutCode(generatedBoard.layoutCode);
    setBlindShuffle(_blindShuffle);
    setNoSinglePairs(_noSinglePairs);
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

  useEffect(() => {
    if (!gameEnded) {
      checkAllValidMatches();
      saveStateToLocal();
    }
  }, [tiles]);

  function checkAllValidMatches() {
    const allValidMatches = checkAllPossibleMatches(
      tiles,
      boardWidth,
      boardHeight
    );

    console.log(
      `Number of Valid Matches: ${allValidMatches.length}` +
        (showAllValidMatches === true
          ? ", Valid Matches: " +
            allValidMatches.reduce(
              (a, b) =>
                a.concat(
                  `[${(b[0] % (boardWidth + 2)) - 1 + 1},${
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
          : "")
    );

    setAllValidMatchingTiles([...new Set(allValidMatches.flat())]);

    // If there are no matching tiles, then we either won or lost the game.
    if (allValidMatches.length === 0) {
      timerRef.current.pause();
      setGameEnded(true);

      if (numTiles - tileHistory.length * 2 > 0) showModal("Game Lost");
      else showModal("Game Won");
    }
  }

  function handleTileClick(tileId) {
    // Don't click empty or tiles being removed.
    if (tiles[tileId].char === null || tiles[tileId].inRemovalAnim === true) {
      return;
    }

    // Clicking the same tile either de-selects the tile or does nothing.
    if (selectedTile === tileId) {
      if (allowDeselect === true) {
        setSelectedTile(null);
        setHintedTiles([]);
      }

      return;
    }

    // If selecting a second tile, check to make sure it matches the first,
    // then check the pathing to see if it's valid, then clear valid matches.
    if (
      selectedTile !== null &&
      tiles[tileId].char === tiles[selectedTile].char
    ) {
      const path = checkSimplestPath(
        tileId,
        selectedTile,
        tiles.slice(),
        boardWidth,
        boardHeight
      );

      if (path !== null) {
        // Create an updated board, first by removing the tiles in its
        // fadeout animation, then putting the match in that same animation.
        const newTiles = tiles.slice();

        newTiles.forEach((tile) => {
          if (tile.inRemovalAnim === true) {
            tile.inRemovalAnim = false;
            tile.char = null;
          }
        });

        newTiles[tileId].inRemovalAnim = true;
        newTiles[selectedTile].inRemovalAnim = true;

        const newTileHistory = tileHistory.slice();

        newTileHistory.push({
          char: tiles[tileId].char,
          tile1: tileId,
          tile2: selectedTile,
        });

        // Generate the pathing tiles for display.
        const pathingTiles = tiles.map(() => []);

        path.forEach((line) => {
          line.segment.forEach((node) => {
            pathingTiles[node].push(line.dir);
          });
        });

        pathingTiles[selectedTile].push("-start");
        pathingTiles[tileId].push("-end");

        setTiles(newTiles);
        setSelectedTile(null);
        setTileHistory(newTileHistory);
        setHintedTiles([]);

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
        return;
      }
    }

    setSelectedTile(tileId);

    // Update the hinting system, if it's enabled.
    if (showMatchingTiles === true) {
      const hintedTiles = tiles.filter((t) => t.char === tiles[tileId].char);

      setHintedTiles(hintedTiles);
      return;
    }
  }

  function undoMatch(hideModal) {
    if (tileHistory.length > 0) {
      const newTiles = tiles.slice();
      const lastMatch = tileHistory.pop();

      newTiles[lastMatch.tile1].char = lastMatch.char;
      newTiles[lastMatch.tile1].inRemovalAnim = false;

      newTiles[lastMatch.tile2].char = lastMatch.char;
      newTiles[lastMatch.tile2].inRemovalAnim = false;

      setTiles(newTiles);
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
      case "Settings":
        return (
          <SettingsModalBody
            seed={seed}
            layout={layoutDescription}
            canUndo={tileHistory.length === 0}
            tilesMatchable={allValidMatchingTiles.length}
            handleResetBoard={resetBoard}
            handleUndoMatch={() => {
              undoMatch(true);
            }}
            newBoardModal={() => showModal("New Board")}
            advancedSettingsModal={() => showModal("Advanced Settings")}
          />
        );
      case "Advanced Settings":
        return (
          <AdvancedSettingsModalBody
            toggleHighlightAllMatches={() =>
              setShowAllValidMatches((prevState) => !prevState)
            }
            toggleHighlightMatchesForTile={() =>
              setShowMatchingTiles((prevState) => !prevState)
            }
            toggleEmojiMode={() => setUseEmoji((prevState) => !prevState)}
            backModal={() => showModal("Settings")}
          />
        );
      case "New Board":
        return (
          <NewBoardModalBody
            prevWidth={boardWidth}
            prevHeight={boardHeight}
            prevBlindShuffle={blindShuffle}
            prevNoSinglePairs={noSinglePairs}
            prevSeed={seed}
            handleResetBoard={resetBoard}
            backModal={() => showModal("Settings")}
          />
        );
      case "Game Won":
        return (
          <GameWinModalBody
            numTiles={numTiles}
            clearTimeHours={timerRef.current.hours}
            clearTimeMinutes={timerRef.current.minutes}
            clearTimeSeconds={timerRef.current.seconds}
            seed={seed}
            layout={layoutDescription}
            handleResetBoard={resetBoard}
            newBoardModal={() => showModal("New Board")}
          />
        );
      case "Game Lost":
        return (
          <GameLoseModalBody
            remainingTiles={numTiles - tileHistory.length * 2}
            seed={seed}
            layout={layoutDescription}
            canUndo={tileHistory.length === 0}
            handleUndoMatch={() => undoMatch(true)}
            handleResetBoard={resetBoard}
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
        boardWidth={boardWidth}
        boardHeight={boardHeight}
        tiles={tiles}
        pathingTiles={pathingTiles}
        pathingTilesAlt={pathingTilesAlt}
        hintedTiles={hintedTiles}
        allValidMatchingTiles={allValidMatchingTiles}
        selectedTile={selectedTile}
        useEmoji={useEmoji}
        fixChromeAndroidEmojiBug={fixChromeAndroidEmojiBug}
        showAllValidMatches={showAllValidMatches}
        handleTileClick={handleTileClick}
      />

      <div className="game-bar">
        <GameTimer ref={timerRef} />
        <button
          className={`settings-button ${
            modalDisplayed ? "settings-button-opened" : ""
          }`}
          onClick={() => showModal("Settings")}
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
