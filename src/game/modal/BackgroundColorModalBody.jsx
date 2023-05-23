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
      <div>
        <button onClick={() => setNewBackgroundColor(BACKGROUND_COLOR_DEFAULT)}>
          Reset Background Color
        </button>
      </div>
      <div>
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
          <label htmlFor="optBgImage">Background Image URL (optional)</label>
        </div>
      </div>
      <div>
        <input
          type="checkbox"
          id="optAnimatedBg"
          checked={
            newBackgroundOption === BackgroundOptions.BACKGROUND_ANIMATED
          }
          onChange={() =>
            setNewBackgroundOption(
              newBackgroundOption === BackgroundOptions.BACKGROUND_ANIMATED
                ? BackgroundOptions.BACKGROUND_IMAGE
                : BackgroundOptions.BACKGROUND_ANIMATED
            )
          }
        ></input>
        <label htmlFor="optAnimatedBg">
          Enable Animated Background (may decrease performance)
        </label>
      </div>
      <div>
        <button
          onClick={() => {
            setBackgroundOption(newBackgroundOption);
            setBackgroundColor(newBackgroundColor);
            setBackgroundImage(newBackgroundImage);
            backModal();
          }}
        >
          Confirm
        </button>
        <button onClick={backModal}>Cancel</button>
      </div>
    </div>
  );
};

export default BackgroundColorModalBody;
