import { useSearchParams } from "react-router-dom";

import Game from "./Game";

export default function GameWithParamsHook(props) {
  let [searchParams] = useSearchParams();

  return (
    <Game
      {...props}
      searchParams={searchParams}
    />
  );
}
