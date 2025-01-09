import React, { useEffect } from "react";
import Sketch from "./Sketch";
import p5 from "p5";

const App = () => {
  useEffect(() => {
    const myP5 = new p5(Sketch);

    // Cleanup p5 instance on component unmount
    return () => {
      myP5.remove();
    };
  }, []);

  return <div id="p5-container"></div>;
};

export default App;
