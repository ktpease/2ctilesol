/**
 * Check the simplest (i.e. least amount of segments) nikakudori path between
 * two tiles on the provided game board.
 *
 * This utilizes an iterative depth-first search approach, with special modifications
 * to account for the limited amount of line segments.
 *
 * @param {!number} firstTile The tile index to start from
 * @param {!number} secondTile The tile index to end up on
 * @param {!{{<id: number, char: number>}}[]} board The tiles
 * themselves, which should be (1 + boardWidth + 1) * (1 + boardHeight + 1)
 * to account for the edges.
 * @param {!number} boardWidth Width of the board, excluding the edges.
 * @param {!number} boardHeight Height of the board, excluding the edges.
 * @returns {?{{<segment: number[], dir: string>}}[]} An array of line segments showing
 * one of the simplest paths. Segments are list of tile indexes in order.
 * Dir can be "U", "D", "L", or "R".
 */
export function checkSimplestPath(
  firstTile,
  secondTile,
  board,
  boardWidth,
  boardHeight
) {
  if (firstTile === secondTile) return null;

  const boardWidthWithEdges = boardWidth + 2,
    boardHeightWithEdges = boardHeight + 2;

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
    if (tileXdelta < 0) paths.push([{ segment: [firstTile], dir: "L" }]);
    else paths.unshift([{ segment: [firstTile], dir: "L" }]);
  }

  if (tileXdelta !== 0 || tileYdelta > 0) {
    if (tileYdelta >= 0) paths.push([{ segment: [firstTile], dir: "D" }]);
    else paths.unshift([{ segment: [firstTile], dir: "D" }]);
  }

  if (tileXdelta !== 0 || tileYdelta < 0) {
    if (tileYdelta < 0) paths.push([{ segment: [firstTile], dir: "U" }]);
    else paths.push([{ segment: [firstTile], dir: "U" }]);
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
        nextTile = board[lastTile + 1];

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
            const newPath = path.map((i) => ({
              segment: [].concat(i.segment),
              dir: i.dir,
            }));
            newPath.push({ segment: [nextTile.id], dir: "U" });
            if (tileYdelta < 0) paths.push(newPath);
            else paths.unshift(newPath);
          } else if (secondTile > nextTile.id) {
            console.debug("- Add path D");
            const newPath = path.map((i) => ({
              segment: [].concat(i.segment),
              dir: i.dir,
            }));
            newPath.push({ segment: [nextTile.id], dir: "D" });
            if (tileYdelta >= 0) paths.push(newPath);
            else paths.unshift(newPath);
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
        if (tileXdelta >= 0) paths.push(path);
        else paths.unshift(path);
        continue;
      case "L":
        nextTile = board[lastTile - 1];

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
            const newPath = path.map((i) => ({
              segment: [].concat(i.segment),
              dir: i.dir,
            }));
            newPath.push({ segment: [nextTile.id], dir: "U" });
            if (tileYdelta < 0) paths.push(newPath);
            else paths.unshift(newPath);
          } else if (secondTile > nextTile.id) {
            console.debug("- Add path D");
            const newPath = path.map((i) => ({
              segment: [].concat(i.segment),
              dir: i.dir,
            }));
            newPath.push({ segment: [nextTile.id], dir: "D" });
            if (tileYdelta >= 0) paths.push(newPath);
            else paths.unshift(newPath);
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
        if (tileXdelta < 0) paths.push(path);
        else paths.unshift(path);
        continue;
      case "D":
        nextTile = board[lastTile + boardWidthWithEdges];

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
            const newPath = path.map((i) => ({
              segment: [].concat(i.segment),
              dir: i.dir,
            }));
            newPath.push({ segment: [nextTile.id], dir: "L" });
            if (tileXdelta < 0) paths.push(newPath);
            else paths.unshift(newPath);
          } else if (
            secondTile % boardWidthWithEdges >
            nextTile.id % boardWidthWithEdges
          ) {
            console.debug("- Add path R");
            const newPath = path.map((i) => ({
              segment: [].concat(i.segment),
              dir: i.dir,
            }));
            newPath.push({ segment: [nextTile.id], dir: "R" });
            if (tileXdelta >= 0) paths.push(newPath);
            else paths.unshift(newPath);
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
        if (tileYdelta >= 0) paths.push(path);
        else paths.unshift(path);
        continue;
      case "U":
        nextTile = board[lastTile - boardWidthWithEdges];

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
            const newPath = path.map((i) => ({
              segment: [].concat(i.segment),
              dir: i.dir,
            }));
            newPath.push({ segment: [nextTile.id], dir: "L" });
            if (tileXdelta < 0) paths.push(newPath);
            else paths.unshift(newPath);
          } else if (
            secondTile % boardWidthWithEdges >
            nextTile.id % boardWidthWithEdges
          ) {
            console.debug("- Add path R");
            const newPath = path.map((i) => ({
              segment: [].concat(i.segment),
              dir: i.dir,
            }));
            newPath.push({ segment: [nextTile.id], dir: "R" });
            if (tileXdelta >= 0) paths.push(newPath);
            else paths.unshift(newPath);
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
        if (tileYdelta < 0) paths.push(path);
        else paths.unshift(path);
        continue;
      default:
        break;
    }
  }

  console.debug(`${DEBUG_pathsEaten} PATHS EATEN`);
  return simplestPath;
}
