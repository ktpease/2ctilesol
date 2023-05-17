import "./App.css";

import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Game from "./game/Game";
import Editor from "./editor/Editor";

function App() {
  const [preload, setPreload] = useState(true);

  const [animateBackground, setAnimateBackground] = useState(false);

  // Get the current state from the browser's web stoarge.
  useEffect(() => {
    // Check if LocalStorage is active.
    if (typeof localStorage !== "undefined") {
      try {
        localStorage.setItem("test", "1");
        if (localStorage.getItem("test") === "1") {
          localStorage.removeItem("test");
        }
      } catch (e) {
        return;
      }
    } else {
      return;
    }

    const appSettingsJson = localStorage.getItem("appSettings");
    const appSettings = JSON.parse(appSettingsJson);

    console.log(appSettings.animateBackground);

    if (appSettings !== null) {
      setAnimateBackground(appSettings.animateBackground);
    }

    setPreload(false);
  }, []);

  // Save the current state to the browser's web storage.
  useEffect(() => {
    if (preload) {
      return;
    }

    // Check if LocalStorage is active.
    if (typeof localStorage !== "undefined") {
      try {
        localStorage.setItem("test", "1");
        if (localStorage.getItem("test") === "1") {
          localStorage.removeItem("test");
        }
      } catch (e) {
        return;
      }
    } else {
      return;
    }

    localStorage.setItem(
      "appSettings",
      JSON.stringify({
        animateBackground: animateBackground,
      })
    );
  }, [animateBackground]);

  return (
    <div className={`App ${animateBackground && "animatedBackground"}`}>
      <BrowserRouter>
        <Routes>
          <Route path="/editor" element={<Editor />} />
          <Route
            path="*"
            element={<Game {...{ animateBackground, setAnimateBackground }} />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
