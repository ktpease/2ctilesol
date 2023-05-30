import React, { useState } from "react";

const NewBoardModalBody = ({
  prevWidth,
  prevHeight,
  prevBlindShuffle,
  prevNoSinglePairs,
  prevSeed,
  layoutCode,
  handleResetBoard,
  backModal,
}) => {
  const [boardWidth, setBoardWidth] = useState(prevWidth);
  const [boardHeight, setBoardHeight] = useState(prevHeight);
  const [customWidth, setCustomWidth] = useState(prevWidth);
  const [customHeight, setCustomHeight] = useState(prevHeight);
  const [blindShuffle, setBlindShuffle] = useState(prevBlindShuffle ?? false);
  const [noSinglePairs, setNoSinglePairs] = useState(
    prevNoSinglePairs ?? false
  );
  const [seed, setSeed] = useState(prevSeed);

  const [newLayoutCode, setNewLayoutCode] = useState(layoutCode);

  const [useSimpleBoard, setUseSimpleBoard] = useState(true);

  const [useCustomSeed, setUseCustomSeed] = useState(false);
  const [useCustomSize, setUseCustomSize] = useState(false);

  const [sizeSelected, setSizeSelected] = useState(false);

  return (
    <div>
      <h1>Start New Board</h1>
      <div>
        <h2>Board Layout</h2>
        <div>
          <input
            type="radio"
            name="layoutType"
            id="layoutTypeSimple"
            value="simple"
            onChange={() => {
              setUseSimpleBoard(true);
            }}
            checked={useSimpleBoard}
          ></input>
          <label htmlFor="layoutTypeSimple">Simple Board</label>
        </div>
        <div>
          <input
            type="radio"
            name="layoutType"
            id="layoutTypeCustom"
            value="custom"
            onChange={() => {
              setUseSimpleBoard(false);
            }}
            checked={!useSimpleBoard}
          ></input>
          <label htmlFor="layoutTypeCustom">Use Custom Layout Code</label>
        </div>
      </div>
      <div style={{ paddingTop: "1em" }}>
        {useSimpleBoard && (
          <>
            <div>
              <input
                type="radio"
                name="size"
                id="sizeShort"
                value="short"
                onChange={() => {
                  setBoardWidth(8);
                  setBoardHeight(5);
                  setUseCustomSize(false);
                  setSizeSelected(true);
                }}
              ></input>
              <label htmlFor="sizeShort">Short (8&#x2a2f;5)</label>
            </div>
            <div>
              <input
                type="radio"
                name="size"
                id="sizeMedium"
                value="medium"
                onChange={() => {
                  setBoardWidth(12);
                  setBoardHeight(7);
                  setUseCustomSize(false);
                  setSizeSelected(true);
                }}
              ></input>
              <label htmlFor="sizeMedium">Medium (12&#x2a2f;7)</label>
            </div>
            <div>
              <input
                type="radio"
                name="size"
                id="sizeLarge"
                value="large"
                onChange={() => {
                  setBoardWidth(17);
                  setBoardHeight(8);
                  setUseCustomSize(false);
                  setSizeSelected(true);
                }}
              ></input>
              <label htmlFor="sizeLarge">Large (17&#x2a2f;8)</label>
            </div>
            <div>
              <input
                type="radio"
                name="size"
                id="sizeCustom"
                value="custom"
                onChange={() => {
                  setUseCustomSize(true);
                  setSizeSelected(true);
                }}
              ></input>
              <label htmlFor="sizeCustom">Custom</label>
            </div>
            <div style={{ display: useCustomSize ? "block" : "none", paddingTop: "1em" }}>
              <input
                type="range"
                id="customWidth"
                min="2"
                max="20"
                value={customWidth}
                onChange={({ target: { value: v } }) => {
                  setCustomWidth(v);
                }}
                style={{width: "75%"}}
              ></input>{customWidth}<br/>
              <label htmlFor="customWidth">Board Width</label>
            </div>
            <div style={{ display: useCustomSize ? "block" : "none" }}>
              <input
                type="range"
                id="customHeight"
                min="2"
                max="12"
                value={customHeight}
                onChange={({ target: { value: v } }) => {
                  setCustomHeight(v);
                }}
                style={{width: "75%"}}
                ></input>{customHeight}<br/>
              <label htmlFor="customHeight">Board Height</label>
            </div>
          </>
        )}
        {!useSimpleBoard && (
          <div>
            <input
              type="text"
              id="layoutCode"
              value={newLayoutCode}
              onChange={({ target: { value: v } }) => {
                setNewLayoutCode(v);
              }}
              style={{ width: "75%" }}
            ></input>
            <br />
            <label htmlFor="layoutCode">Layout Code</label>
          </div>
        )}
      </div>
      <div>
        <h2>Advanced Options</h2>
        <div>
          <input
            type="radio"
            name="shuffle"
            id="shuffleNormal"
            value="normal"
            onChange={() => {
              setBlindShuffle(false);
            }}
            checked={!blindShuffle}
          ></input>
          <label htmlFor="shuffleNormal">
            Normal Mode - Always generates winnable boards.
          </label>
        </div>
        <div>
          <input
            type="radio"
            name="shuffle"
            id="shuffleHard"
            value="hard"
            onChange={() => {
              setBlindShuffle(true);
            }}
            checked={blindShuffle}
          ></input>
          <label htmlFor="shuffleHard">
            Hard Mode - True random shuffle, may generate unwinnable boards.
          </label>
        </div>
        <div style={{ paddingTop: "1em" }}>
          <input
            type="checkbox"
            id="optNoSinglePairs"
            checked={noSinglePairs}
            onChange={() => setNoSinglePairs(!noSinglePairs)}
          ></input>
          <label htmlFor="optNoSinglePairs">
            Force Multiple Pairs Per Tile. This makes smaller boards easier.
          </label>
        </div>
        <div style={{ paddingTop: "1em" }}>
          <input
            type="checkbox"
            id="optSeed"
            checked={useCustomSeed}
            onChange={() => setUseCustomSeed(!useCustomSeed)}
          ></input>
          <label htmlFor="optSeed">Use custom board number</label>
        </div>
        <div>
          <label htmlFor="optSeedNumber">Board Number: </label>
          <input
            type="text"
            id="optSeedNumber"
            value={seed}
            onChange={({ target: { value: v } }) => setSeed(v)}
            disabled={!useCustomSeed}
          ></input>
        </div>
      </div>
      <div style={{paddingTop: "1em"}}>
        <button
          onClick={() =>
            useSimpleBoard
              ? handleResetBoard(
                  useCustomSeed ? parseInt(seed) : null,
                  useCustomSize ? parseInt(customWidth) : boardWidth,
                  useCustomSize ? parseInt(customHeight) : boardHeight,
                  blindShuffle,
                  noSinglePairs,
                  null
                )
              : handleResetBoard(
                  useCustomSeed ? parseInt(seed) : null,
                  null,
                  null,
                  blindShuffle,
                  noSinglePairs,
                  layoutCode
                )
          }
        >
          Start New Board
        </button>
      </div>
      <div>
        <button onClick={backModal}>Go Back</button>
      </div>
    </div>
  );
};

export default NewBoardModalBody;
