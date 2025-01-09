import React from "react";
import "./App.css";

const App = () => {
  const balls = Array.from({ length: 10000 }); // Generate a large number of balls

  return (
    <div className="App">
      <div className="ball-container">
        {balls.map((_, i) => (
          <div key={i} className="ball"></div>
        ))}
      </div>
    </div>
  );
};

export default App;
