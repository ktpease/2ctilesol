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
    let tileCharUsed = [...Array(34).keys()], randValue = 0;

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
      const path = this.checkValidPath(tileId, this.state.selectedTile);

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

  checkValidPath(firstTile, secondTile) {
    if (firstTile === secondTile) return null;

    const boardWidthWithEdges = this.state.boardWidth + 2,
      boardHeightWithEdges = this.state.boardHeight + 2;

    let paths = [],
      simplestPath = null;

    const tileXdelta =
      (secondTile % boardWidthWithEdges) - (firstTile % boardWidthWithEdges);
    const tileYdelta =
      (secondTile -
        (secondTile % boardWidthWithEdges) -
        (firstTile - (firstTile % boardWidthWithEdges))) /
      boardWidthWithEdges;

    let DEBUG_pathsEaten = 0;
    console.debug(`tile X delta: ${tileXdelta}`);
    console.debug(`tile Y delta: ${tileYdelta}`);

    // Do not check opposite direction if in the same row or column.

    if (tileYdelta !== 0 || tileXdelta > 0) {
      paths.push([{ segment: [firstTile], dir: "R" }]);
    }

    if (tileYdelta !== 0 || tileXdelta < 0) {
      paths.push([{ segment: [firstTile], dir: "L" }]);
    }

    if (tileXdelta !== 0 || tileYdelta > 0) {
      paths.push([{ segment: [firstTile], dir: "D" }]);
    }

    if (tileXdelta !== 0 || tileYdelta < 0) {
      paths.push([{ segment: [firstTile], dir: "U" }]);
    }

    for (let i = 0; i < paths.length; i++) {
      console.debug(paths[i]);
    }

    while (paths.length > 0) {
      const path = paths.pop();
      DEBUG_pathsEaten++;

      console.debug(
        `Checking path: ${path.at(-1).segment} | ${path.at(-1).dir} | length: ${
          path.length
        } | queue: ${paths.length}`
      );

      // If we already found a three-line path, we shouldn't look for more
      // three-line paths.
      if (simplestPath !== null && path.length === 3) {
        console.debug("- Looking for less-line paths");
        continue;
      }

      const curSegment = path.at(-1);
      const lastTile = curSegment.segment.at(-1);
      let nextTile;

      switch (curSegment.dir) {
        case "R":
          nextTile = this.state.tiles[lastTile + 1];

          // We found the path, or a simpler one!
          if (nextTile.id === secondTile) {
            console.debug("- Found simplest path?");
            curSegment.segment.push(nextTile.id);

            // If it is a one-line or two-line path, it's one of the
            // absolute shortest paths. We're done!
            if (path.length < 3) {
              console.debug("-- It is!");
              console.debug(`${DEBUG_pathsEaten} PATHS EATEN`);
              return path;
            }

            console.debug("-- Maybe?");
            simplestPath = path;
            continue;
          }

          // Obstruction in the path. Skip.
          if (nextTile.char !== null) {
            console.debug("- Obstruction in path");
            continue;
          }

          curSegment.segment.push(nextTile.id);

          // On first and second segment, check U if second tile is above and
          // check D if the second tile is below.
          // On second segment, only check if on same column.
          if (
            path.length < 3 &&
            !(
              path.length === 2 &&
              secondTile % boardWidthWithEdges !==
                nextTile.id % boardWidthWithEdges
            )
          ) {
            if (secondTile < nextTile.id) {
              console.debug("- Add path U");
              const newPath = path.slice();
              newPath.push({ segment: [nextTile.id], dir: "U" });
              paths.push(newPath);
            } else if (secondTile > nextTile.id) {
              console.debug("- Add path D");
              const newPath = path.slice();
              newPath.push({ segment: [nextTile.id], dir: "D" });
              paths.push(newPath);
            }
          }

          if (
            (path.length === 2 &&
              secondTile % boardWidthWithEdges <
                nextTile.id % boardWidthWithEdges) ||
            nextTile.id % boardWidthWithEdges === boardWidthWithEdges - 1
          ) {
            console.debug("- Do not proceed further, will miss");
            continue;
          }

          console.debug("- Continuing path");
          paths.push(path);
          continue;
        case "L":
          nextTile = this.state.tiles[lastTile - 1];

          // We found the path, or a simpler one!
          if (nextTile.id === secondTile) {
            console.debug("- Found simplest path");
            curSegment.segment.push(nextTile.id);

            // If it is a one-line or two-line path, it's one of the
            // absolute shortest paths. We're done!
            if (path.length < 3) {
              console.debug("-- It is!");
              console.debug(`${DEBUG_pathsEaten} PATHS EATEN`);
              return path;
            }

            console.debug("-- Maybe?");
            simplestPath = path;
            continue;
          }

          // Obstruction in the path. Skip.
          if (nextTile.char !== null) {
            console.debug("- Obstruction in path");
            continue;
          }

          curSegment.segment.push(nextTile.id);

          // On first and second segment, check U if second tile is above and
          // check D if the second tile is below.
          // On second segment, only check if on same column.
          if (
            path.length < 3 &&
            !(
              path.length === 2 &&
              secondTile % boardWidthWithEdges !==
                nextTile.id % boardWidthWithEdges
            )
          ) {
            if (secondTile < nextTile.id) {
              console.debug("- Add path U");
              const newPath = path.slice();
              newPath.push({ segment: [nextTile.id], dir: "U" });
              paths.push(newPath);
            } else if (secondTile > nextTile.id) {
              console.debug("- Add path D");
              const newPath = path.slice();
              newPath.push({ segment: [nextTile.id], dir: "D" });
              paths.push(newPath);
            }
          }

          if (
            (path.length === 2 &&
              secondTile % boardWidthWithEdges >
                nextTile.id % boardWidthWithEdges) ||
            nextTile.id % boardWidthWithEdges === 0
          ) {
            console.debug("- Do not proceed further, will miss");
            continue;
          }

          console.debug("- Continuing path");
          paths.push(path);
          continue;
        case "D":
          nextTile = this.state.tiles[lastTile + boardWidthWithEdges];

          // We found the path, or a simpler one!
          if (nextTile.id === secondTile) {
            console.debug("- Found simplest path");
            curSegment.segment.push(nextTile.id);

            // If it is a one-line or two-line path, it's one of the
            // absolute shortest paths. We're done!
            if (path.length < 3) {
              console.debug("-- It is!");
              console.debug(`${DEBUG_pathsEaten} PATHS EATEN`);
              return path;
            }

            console.debug("-- Maybe?");
            simplestPath = path;
            continue;
          }

          // Obstruction in the path. Skip.
          if (nextTile.char !== null) {
            console.debug("- Obstruction in path");
            continue;
          }

          curSegment.segment.push(nextTile.id);

          // On first and second segment, check L if second tile is left and
          // check R if the second tile is right.
          // On second segment, only check if on same row.
          if (
            path.length < 3 &&
            !(
              path.length === 2 &&
              secondTile - (secondTile % boardWidthWithEdges) !==
                nextTile.id - (nextTile.id % boardWidthWithEdges)
            )
          ) {
            if (
              secondTile % boardWidthWithEdges <
              nextTile.id % boardWidthWithEdges
            ) {
              console.debug("- Add path L");
              const newPath = path.slice();
              newPath.push({ segment: [nextTile.id], dir: "L" });
              paths.push(newPath);
            } else if (
              secondTile % boardWidthWithEdges >
              nextTile.id % boardWidthWithEdges
            ) {
              console.debug("- Add path R");
              const newPath = path.slice();
              newPath.push({ segment: [nextTile.id], dir: "R" });
              paths.push(newPath);
            }
          }

          if (
            (path.length === 2 && secondTile < nextTile.id) ||
            nextTile.id >= boardWidthWithEdges * (boardHeightWithEdges - 1)
          ) {
            console.debug("- Do not proceed further, will miss");
            continue;
          }

          console.debug("- Continuing path");
          paths.push(path);
          continue;
        case "U":
          nextTile = this.state.tiles[lastTile - boardWidthWithEdges];

          // We found the path, or a simpler one!
          if (nextTile.id === secondTile) {
            console.debug("- Found simplest path");
            curSegment.segment.push(nextTile.id);

            // If it is a one-line or two-line path, it's one of the
            // absolute shortest paths. We're done!
            if (path.length < 3) {
              console.debug("-- It is!");
              console.debug(`${DEBUG_pathsEaten} PATHS EATEN`);
              return path;
            }

            console.debug("-- Maybe?");
            simplestPath = path;
            continue;
          }

          // Obstruction in the path. Skip.
          if (nextTile.char !== null) {
            console.debug("- Obstruction in path");
            continue;
          }

          curSegment.segment.push(nextTile.id);

          // On first and second segment, check L if second tile is left and
          // check R if the second tile is right.
          // On second segment, only check if on same row.
          if (
            path.length < 3 &&
            !(
              path.length === 2 &&
              secondTile - (secondTile % boardWidthWithEdges) !==
                nextTile.id - (nextTile.id % boardWidthWithEdges)
            )
          ) {
            if (
              secondTile % boardWidthWithEdges <
              nextTile.id % boardWidthWithEdges
            ) {
              console.debug("- Add path L");
              const newPath = path.slice();
              newPath.push({ segment: [nextTile.id], dir: "L" });
              paths.push(newPath);
            } else if (
              secondTile % boardWidthWithEdges >
              nextTile.id % boardWidthWithEdges
            ) {
              console.debug("- Add path R");
              const newPath = path.slice();
              newPath.push({ segment: [nextTile.id], dir: "R" });
              paths.push(newPath);
            }
          }

          if (
            (path.length === 2 && secondTile > nextTile.id) ||
            nextTile.id < boardWidthWithEdges
          ) {
            console.debug("- Do not proceed further, will miss");
            continue;
          }

          console.debug("- Continuing path");
          paths.push(path);
          continue;
        default:
          break;
      }
    }

    console.debug(`${DEBUG_pathsEaten} PATHS EATEN`);
    return simplestPath;
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
