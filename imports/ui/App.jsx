import React from "react";
import Hello from "./Hello.jsx";
import Info from "./Info.jsx";
import SearchBar from "./SearchBar.jsx";

const App = () => (
  <div>
    <h1>Jankapedia</h1>
    <SearchBar />
    <Hello />
    <Info />
  </div>
);

export default App;
