import React, { useState } from "react";

const NewBoardModalBody = (props) => {
  const [boardWidth, setBoardWidth] = useState(props.prevWidth);
  const [boardHeight, setBoardHeight] = useState(props.prevHeight);
  const [customWidth, setCustomWidth] = useState(props.prevWidth);
  const [customHeight, setCustomHeight] = useState(props.prevHeight);
  const [blindShuffle, setBlindShuffle] = useState(props.prevBlindShuffle);
  const [seed, setSeed] = useState(props.prevSeed);

  const [useCustomSeed, setUseCustomSeed] = useState(false);
  const [useCustomSize, setUseCustomSize] = useState(false);

  const [sizeSelected, setSizeSelected] = useState(false);

  return (
    <div>
      <h1>Start New Board</h1>
      <div>
        <h2>Board Size</h2>
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
        <div style={{ visibility: useCustomSize ? "visible" : "hidden" }}>
          <input
            type="range"
            id="customWidth"
            min="2"
            max="20"
            value={customWidth}
            onChange={({ target: { value: v } }) => {
              setCustomWidth(v);
            }}
          ></input>
          <label htmlFor="customWidth">{customWidth} Board Width</label>
        </div>
        <div style={{ visibility: useCustomSize ? "visible" : "hidden" }}>
          <input
            type="range"
            id="customHeight"
            min="2"
            max="12"
            value={customHeight}
            onChange={({ target: { value: v } }) => {
              setCustomHeight(v);
            }}
          ></input>
          <label htmlFor="customHeight">{customHeight} Board Height</label>
        </div>
      </div>
      <div>
        <h2>Advanced Options</h2>
        <div>
          <input
            type="checkbox"
            id="optHard"
            checked={blindShuffle}
            onChange={() => setBlindShuffle(!blindShuffle)}
          ></input>
          <label htmlFor="optHard">
            Enable Hard Mode. This may generate unwinnable boards!
          </label>
        </div>
        <div>
          <input
            type="checkbox"
            id="optSeed"
            checked={useCustomSeed}
            onChange={() => setUseCustomSeed(!useCustomSeed)}
          ></input>
          <label htmlFor="optSeed">Use custom board number</label>
        </div>
        <div style={{ visibility: useCustomSeed ? "visible" : "hidden" }}>
          <input
            type="text"
            id="optSeedNumber"
            value={seed}
            onChange={({ target: { value: v } }) => {
              setSeed(v);
            }}
          ></input>
          <label htmlFor="optSeedNumber">Board Number</label>
        </div>
      </div>
      <div>
        <button
          disabled={!sizeSelected}
          onClick={() =>
            props.handleResetBoard(
              useCustomSeed ? parseInt(seed) : null,
              useCustomSize ? parseInt(customWidth) : boardWidth,
              useCustomSize ? parseInt(customHeight) : boardHeight,
              blindShuffle
            )
          }
        >
          Start New Board
        </button>
      </div>
      <div>
        <button onClick={props.backModal}>Go Back</button>
      </div>
    </div>
  );
};

export default NewBoardModalBody;
