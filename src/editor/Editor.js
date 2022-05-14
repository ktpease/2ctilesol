import { useState, useEffect } from "react";
import Tile from "./Tile.js";

export default function Editor() {
  const [board, setBoard] = useState([]);
  const [layoutCode, setLayoutCode] = useState("");
  const [numTiles, setNumTiles] = useState(0);

  const numTileTypes = 2;
  const layoutCodeRadix = 32,
    layoutCodeRadixBits = 5; // log_2(layoutCodeRadix)

  useEffect(() => {
    let newBoard = [];

    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 12; j++) {
        newBoard.push(0);
      }
    }

    setBoard(newBoard);
    setNumTiles(0);
  }, []);

  const resetBoard = () => {
    let newBoard = [];

    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 12; j++) {
        newBoard.push(0);
      }
    }

    setBoard(newBoard);
    setNumTiles(0);
  };

  const toggleTile = (id) => {
    const updatedBoard = board.slice();

    updatedBoard[id] = (updatedBoard[id] + 1) % numTileTypes;

    if (updatedBoard[id] === 1) setNumTiles(numTiles + 1);
    else setNumTiles(numTiles - 1);

    setBoard(updatedBoard);
  };

  const getLayoutCode = () => {
    let code = "001";

    // Get margins of layout.
    let margins = [0, 20, 0, 12];

    // Left
    let marginPoint = false;

    for (let x = 0; x < 20; x++) {
      for (let y = 0; y < 12; y++) {
        if (board[y * 20 + x] !== 0) {
          marginPoint = true;
          break;
        }
      }
      if (marginPoint) {
        margins[0] = x;
        break;
      }
    }

    // Right
    marginPoint = false;

    for (let x = 19; x >= 0; x--) {
      for (let y = 0; y < 12; y++) {
        if (board[y * 20 + x] !== 0) {
          marginPoint = true;
          break;
        }
      }
      if (marginPoint) {
        margins[1] = x + 1;
        break;
      }
    }

    // Top
    marginPoint = false;

    for (let y = 0; y < 12; y++) {
      for (let x = 0; x < 20; x++) {
        if (board[y * 20 + x] !== 0) {
          marginPoint = true;
          break;
        }
      }
      if (marginPoint) {
        margins[2] = y;
        break;
      }
    }

    // Bottom
    marginPoint = false;

    for (let y = 11; y >= 0; y--) {
      for (let x = 0; x < 20; x++) {
        if (board[y * 20 + x] !== 0) {
          marginPoint = true;
          break;
        }
      }
      if (marginPoint) {
        margins[3] = y + 1;
        break;
      }
    }

    const width = margins[1] - margins[0],
      height = margins[3] - margins[2];

    code += width.toString(layoutCodeRadix).slice(0, 1);
    code += height.toString(layoutCodeRadix).slice(0, 1);

    const digitsPerLine = Math.ceil((width + 1) / layoutCodeRadixBits);

    for (let y = margins[2]; y < margins[3]; y++) {
      let lineMask = "1";

      for (let x = margins[0]; x < margins[1]; x++) {
        if (board[y * 20 + x] === 1) lineMask += "1";
        else lineMask += "0";
      }

      console.log(
        lineMask
          .padEnd(digitsPerLine * layoutCodeRadixBits, "0")
          .toString(layoutCodeRadix)
      );

      code += parseInt(
        lineMask.padEnd(digitsPerLine * layoutCodeRadixBits, "0"),
        2
      ).toString(layoutCodeRadix);
    }

    setLayoutCode(code);
  };

  const renderBoard = () => {
    let renderBoard = [];
    for (let i = 0; i < 12; i++) {
      renderBoard.push(<div key={"board-hori-row" + i}>{renderRow(i)}</div>);
    }

    return renderBoard;
  };

  const renderRow = (row) => {
    const rowStart = row * 20;
    let renderRow = [];
    for (let x = 0; x < 20; x++) {
      renderRow.push(
        <Tile
          onClick={() => toggleTile(rowStart + x)}
          key={rowStart + x}
          type={board[rowStart + x]}
        />
      );
    }

    return renderRow;
  };

  return (
    <>
      <div
        className={
          "game-board game-board-horizontal game-board-size-12 game-board-glyph"
        }
        style={{ paddingTop: "50px", paddingBottom: "50px" }}
      >
        {renderBoard()}
      </div>
      <div className="game-bar" style={{ fontSize: "1rem" }}>
        <span style={{ userSelect: "text" }}>Current Code: {layoutCode}</span>
        <span>Tiles: {numTiles}</span>
        <button onClick={() => getLayoutCode()}>Get Code</button>
        <button onClick={() => resetBoard()}>Reset</button>
      </div>
    </>
  );
}
