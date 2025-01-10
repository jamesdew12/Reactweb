import React, { useEffect, useRef, useState } from 'react';
import p5 from 'p5';
import Sketch from './Sketch';

const App = () => {
  const sketchRef = useRef();
  const snakeRef = useRef();
  const [isSketchRunning, setIsSketchRunning] = useState(true);

  useEffect(() => {
    const myP5 = new p5((p) => {
      Sketch(p, setIsSketchRunning);
    }, sketchRef.current);

    return () => {
      myP5.remove();
    };
  }, []);

  useEffect(() => {
    const snake = new p5((p) => {
      console.log('Snake effect running');
    }, snakeRef.current);

    return () => {
      snake.remove();
      console.log('Snake effect cleanup');
    };
  }, []);

  return (
    <div>
      <div ref={sketchRef}></div>
      <div ref={snakeRef}></div>
      {!isSketchRunning && <p>The sketch has stopped.</p>}
    </div>
  );
};

export default App;