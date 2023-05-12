import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Game from "./game/Game";
import Editor from "./editor/Editor";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/editor" element={<Editor />} />
          <Route path="*" element={<Game />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
