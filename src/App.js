import React, { useState } from "react";
import "./App.css";

const App = () => {
  // Generate a grid of balls (dynamic to fill the screen)
  const ballCount = 1500; // Adjust the number of balls if necessary
  const [balls, setBalls] = useState(
    Array.from({ length: ballCount }, (_, i) => ({
      id: i,
      hovered: false,
    }))
  );

  const handleHover = (id) => {
    setBalls((prevBalls) =>
      prevBalls.map((ball) =>
        ball.id === id ? { ...ball, hovered: true } : ball
      )
    );
  };

  const handleHoverOut = (id) => {
    setBalls((prevBalls) =>
      prevBalls.map((ball) =>
        ball.id === id ? { ...ball, hovered: false } : ball
      )
    );
  };

  return (
    <div className="App">
      <div className="ball-container">
        {balls.map((ball) => (
          <div
            key={ball.id}
            className={`ball ${ball.hovered ? "hovered" : ""}`}
            onMouseEnter={() => handleHover(ball.id)}
            onMouseLeave={() => handleHoverOut(ball.id)}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default App;
