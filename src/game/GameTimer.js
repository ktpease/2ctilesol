import React from "react";
import { useStopwatch } from "react-timer-hook";

const GameTimer = React.forwardRef((props, ref) => {
  const { seconds, minutes, hours, start, pause, reset } = useStopwatch({
    autoStart: true,
  });

  React.useImperativeHandle(ref, () => ({
    start,
    pause,
    reset,
  }));

  return (
    <span style={{ textAlign: "center" }}>
      {hours.toString().padStart(2, "0")}:{minutes.toString().padStart(2, "0")}:
      {seconds.toString().padStart(2, "0")}
    </span>
  );
});

export default GameTimer;
