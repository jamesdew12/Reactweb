import { useEffect, useRef, useState } from 'react';
import p5 from 'p5';
import Sketch from './Sketch';
import Snake from './Snake';

const App = () => {
  // Create a ref to attach the p5 sketch to a DOM element
  const sketchRef = useRef();
  // State to toggle between Sketch and Snake
  const [toggleState, setToggleState] = useState(false);

  useEffect(() => {
    // Initialize the p5 instance with the appropriate sketch
    let myP5;

    if (toggleState) {
      // Create a new p5 instance with the Snake sketch
      myP5 = new p5((p) => {
        Snake(p);
      }, sketchRef.current);
    } else {
      // Create a new p5 instance with the Sketch sketch
      myP5 = new p5((p) => {
        Sketch(p, setToggleState);
      }, sketchRef.current);
    }

    // Cleanup function to remove the p5 instance when the component unmounts or toggleState changes
    return () => {
      if (myP5) {
        myP5.remove();
      }
    };
  }, [toggleState]); // Re-run the effect whenever toggleState changes

  return (
    <div
      ref={sketchRef} // Attach the p5 instance to this DOM element
      style={{ width: '100%', height: '100vh' }} // Ensure the container takes full screen
    />
  );
};

// Export the App component as the default export
export default App;
