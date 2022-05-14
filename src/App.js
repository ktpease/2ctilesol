import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import GameWithParamsHook from "./game/GameWithParamsHook.js";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<GameWithParamsHook />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
