import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import GameWithParamsHook from "./game/GameWithParamsHook";
import Editor from "./editor/Editor";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/editor" element={<Editor />} />
          <Route path="*" element={<GameWithParamsHook />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
