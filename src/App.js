import { useEffect, useState, useRef } from 'react';
import p5 from 'p5';
import Sketch from './Sketch';
import Snake from './Snake';

const App = () => {
  const sketchRef = useRef();
  const [isSketchRunning, setIsSketchRunning] = useState(true);

  useEffect(() => {
    let myP5;
    if (isSketchRunning) {
      myP5 = new p5((p) => {
        Sketch(p, setIsSketchRunning);
      }, sketchRef.current);
    } else {
      myP5 = new p5((p) => {
        Snake(p);
      }, sketchRef.current);
    }

    return () => {
      if (myP5) {
        myP5.remove();
      }
    };
  }, [isSketchRunning]);

  return <div ref={sketchRef}></div>;
};

export default App;