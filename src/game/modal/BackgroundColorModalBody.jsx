import { HexColorPicker } from "react-colorful";

const BackgroundColorModalBody = (props) => {
  return (
    <div>
      <div>
        <div>
          <input
            type="checkbox"
            id="optAnimatedBg"
            checked={props.animateBackground}
            onChange={() =>
              props.setAnimateBackground(!props.animateBackground)
            }
          ></input>
          <label htmlFor="optAnimatedBg">
            Enable Animated Background (may decrease performance)
          </label>
        </div>
      </div>
      <div>
        <div>
          <HexColorPicker
            color={props.backgroundColor}
            onChange={props.setBackgroundColor}
          />
          <label htmlFor="optBgColor">Change Background Color</label>
        </div>
      </div>
      <div>
        <button onClick={props.backModal}>Go Back</button>
      </div>
    </div>
  );
};

export default BackgroundColorModalBody;
