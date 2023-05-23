import { HexColorPicker } from "react-colorful";

import { BackgroundOptions, BACKGROUND_COLOR_DEFAULT } from "../../App";
import { useState } from "react";

const BackgroundColorModalBody = ({
  backgroundOption,
  backgroundColor,
  backgroundImage,
  setBackgroundOption,
  setBackgroundColor,
  setBackgroundImage,
  backModal,
}) => {
  const [newBackgroundColor, setNewBackgroundColor] = useState(backgroundColor);
  const [newBackgroundImage, setNewBackgroundImage] = useState(backgroundImage);
  const [newBackgroundOption, setNewBackgroundOption] =
    useState(backgroundOption);

  const [displayAdvanced, setDisplayAdvanced] = useState(false);

  return (
    <div>
      <div>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-evenly",
          }}
        >
          <HexColorPicker
            color={newBackgroundColor}
            onChange={setNewBackgroundColor}
            style={{
              width: "75%",
            }}
          />
          <div
            style={{
              backgroundColor: newBackgroundColor,
              width: "20%",
              borderRadius: "8px",
            }}
          />
        </div>
        <label htmlFor="optBgColor">Change Background Color</label>
      </div>
      <div style={{ marginTop: "1em" }}>
        <button
          onClick={() => {
            setNewBackgroundColor(BACKGROUND_COLOR_DEFAULT);
            setNewBackgroundImage("");
            setNewBackgroundOption(BackgroundOptions.BACKGROUND_NORMAL);
          }}
          style={{
            fontSize: "large",
            padding: "0.5em",
          }}
        >
          Reset Background
        </button>
      </div>
      <hr style={{ margin: "2em 3em" }} />
      <button
        onClick={() => setDisplayAdvanced(!displayAdvanced)}
        style={{
          fontSize: "large",
          padding: "0.5em",
        }}
      >
        {displayAdvanced ? "Hide" : "Show"} Advanced Settings
      </button>
      {displayAdvanced && (
        <>
          <div style={{ marginTop: "2em" }}>
            <div>
              <input
                type="text"
                id="optBgImage"
                value={newBackgroundImage}
                onChange={(e) => setNewBackgroundImage(e.target.value)}
                style={{
                  width: "70%",
                }}
              ></input>
            </div>
            <div>
              <label htmlFor="optBgImage">
                Background Image URL (optional, animated backgrounds may
                decrease performance and battery life)
              </label>
            </div>
          </div>
          <div style={{ marginTop: "2em" }}>
            <input
              type="checkbox"
              id="optAnimatedBg"
              checked={
                newBackgroundOption === BackgroundOptions.BACKGROUND_FANCY
              }
              onChange={() =>
                setNewBackgroundOption(
                  newBackgroundOption === BackgroundOptions.BACKGROUND_FANCY
                    ? BackgroundOptions.BACKGROUND_NORMAL
                    : BackgroundOptions.BACKGROUND_FANCY
                )
              }
            ></input>
            <label htmlFor="optAnimatedBg">
              Enable Fancy Animated Background (ignores all of the above, may
              decrease performance and battery life)
            </label>
          </div>
        </>
      )}
      <hr style={{ margin: "2em 3em" }} />
      <div>
        <button
          onClick={() => {
            setBackgroundOption(newBackgroundOption);
            setBackgroundColor(newBackgroundColor);
            setBackgroundImage(newBackgroundImage);
            backModal();
          }}
          style={{
            fontSize: "larger",
            margin: "0 1em",
            padding: "1em",
          }}
        >
          Accept Changes
        </button>
        <button
          onClick={backModal}
          style={{
            fontSize: "larger",
            margin: "0 1em",
            padding: "1em",
          }}
        >
          Cancel Changes
        </button>
      </div>
    </div>
  );
};

export default BackgroundColorModalBody;
