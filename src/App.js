import { useEffect, useState, useRef } from 'react';
import p5 from 'p5';
import Sketch from './Sketch';

const App = () => {
  const sketchRef = useRef();
  const setIsSketchRunning = useState(true)[1];

  useEffect(() => {
    const myP5 = new p5((p) => {
      Sketch(p, setIsSketchRunning);
    }, sketchRef.current);

    return () => {
      myP5.remove();
    };
  }, []);

  return <div ref={sketchRef}></div>;
};

export default App;
