const Sketch = (p, setToggleState) => {
  const ballSize = 20; // Size of each ball in pixels
  let cols, rows; // Number of columns and rows in the grid
  let fadeTimers = []; // Array to track fade timers
  let revealForever = []; // Array to mark permanently revealed dots
  let isTextCache = []; // Cache for text dots
  let toggle = false; 

  const toggleState = () => {
    toggle = !toggle; // Update the global variable
    setToggleState(toggle); // Update the state in the parent App component
  };


  // Bitmap for individual letters
  const letterBitmaps = {
    J: [
      " 111",
      "   1",
      "   1",
      "1  1",
      " 111",
    ],
    A: [
      "  1  ",
      " 1 1 ",
      "11111",
      "1   1",
      "1   1",
    ],
    M: [
      "1   1",
      "11 11",
      "1 1 1",
      "1   1",
      "1   1",
    ],
    E: [
      "1111",
      "1    ",
      "1111 ",
      "1    ",
      "1111",
    ],
    S: [
      " 111 ",
      "1    ",
      " 111 ",
      "    1",
      " 111  ",
    ],
    D: [
      "1111 ",
      "1   1",
      "1   1",
      "1   1",
      "1111 ",
    ],
    W: [
      "1   1",
      "1   1",
      "1 1 1",
      "11 11",
      "1   1",
    ],
    I: [
      "111",
      " 1 ",
      " 1 ",
      " 1 ",
      "111",
    ],
    N: [
      "1   1",
      "11  1",
      "1 1 1",
      "1  11",
      "1   1",
    ],
    T: [
      "11111",
      "  1  ",
      "  1  ",
      "  1  ",
      "  1  ",
    ],
    O: [
      " 111 ",
      "1   1",
      "1   1",
      "1   1",
      " 111 ",
    ],
    " ": [
      "  ",
      "  ",
      "  ",
      "  ",
      "  ",
    ],
  };

  const text = "JAMES DE WINTON";


  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    setupGrid();
    p.frameRate(30);
    initializeTimers();
    cacheBitmapDots();
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    setupGrid();
    initializeTimers();
    cacheBitmapDots();
  };

  // Setup grid dimensions
  function setupGrid() {
    cols = Math.floor(p.width / ballSize);
    rows = Math.floor(p.height / ballSize);
  }

  // Initialize fade timers and reveal forever array
  function initializeTimers() {
    fadeTimers = Array(rows)
      .fill(0)
      .map(() => Array(cols).fill(-Infinity)); // Start timers as very negative

    revealForever = Array(rows)
      .fill(0)
      .map(() => Array(cols).fill(false)); // Default to false (not permanently revealed)
  }
    function cacheBitmapDots() {
    isTextCache = Array(rows)
      .fill(0)
      .map((_, row) =>
        Array(cols)
          .fill(0)
          .map((_, col) => isBitmapDot(col, row))
      );
  }

  // Determine if a grid cell corresponds to a dot in the bitmap
  function isBitmapDot(col, row) {
    const letterHeight = Object.values(letterBitmaps)[0].length; // Height of the letter bitmaps

    // Calculate total text width without extra gaps
    const totalTextWidth = text
      .split("")
      .reduce((acc, char) => acc + (letterBitmaps[char]?.[0]?.length || 0), 0);

    // Calculate starting column and row to center the text
    const startCol = Math.floor((cols - totalTextWidth) / 2); // Center horizontally
    const startRow = Math.floor((rows - letterHeight) / 2); // Center vertically

    let bitmapCol = col - startCol; // Adjust column based on centered start
    let bitmapRow = row - startRow; // Adjust row based on centered start

    if (bitmapRow < 0 || bitmapCol < 0) return false; // Outside bitmap bounds

    // Iterate through the text and find the corresponding letter
    for (let i = 0; i < text.length; i++) {
      const letter = text[i];
      const letterBitmap = letterBitmaps[letter];
      const letterWidth = letterBitmap ? letterBitmap[0].length : 0;

      if (bitmapCol < letterWidth) {
        return (
          letterBitmap?.[bitmapRow]?.[bitmapCol] === "1"
        ); // Return true if it's part of the bitmap
      }
      bitmapCol -= letterWidth; // Move to the next letter without gaps
    }
    return false; // Outside all letter bitmaps
  }
  // Draw a circle with a solid color
  function drawSoftCircle(x, y, diameter, colorValue, color) {
    p.noStroke();
    p.fill(color[0], color[1], color[2], colorValue);
    p.ellipse(x, y, diameter, diameter);
  }

  p.draw = () => {

    p.background(0); // Black background

    const easeInOutQuad = (t) => {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    };

    const pulsate = (t) => {
      return easeInOutQuad((p.sin(t / 1500) + 1) / 2) * 255;
    };
    
    let brightness = areAllDotsRevealed() ? pulsate(p.millis()) : (p.sin(p.millis() / 1000) + 1) * 127.5;

    if (areAllDotsRevealed()) {
      const revealDuration = 30000; // 30 seconds
      const revealDuration2 = 33000; // 30 seconds
      const timeSinceAllRevealed = p.millis() - Math.max(...fadeTimers.flat());

      if (timeSinceAllRevealed < revealDuration) {
        brightness = (p.sin(p.millis() / 2200) + 1) * 127.5; // Oscillates between 0 and 255 even more smoothly
      } else { if (timeSinceAllRevealed < revealDuration2) {
        brightness = 255; // Stop oscillation and set brightness to 0
      } else {
        toggleState(); // Toggle the state to restart the sketch
        p.remove() // Stop the sketch
      }
      }
    }

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * ballSize;
        const y = row * ballSize;

        // Check if the dot is part of the bitmap
        const isText = isTextCache[row][col]; // Use cached value

        // Check if the mouse is hovering over this dot
        const isHovered =
        p.mouseX > x - ballSize / 2 &&
        p.mouseX < x + ballSize * 1.5 &&
        p.mouseY > y - ballSize / 2 &&
        p.mouseY < y + ballSize * 1.5;

        // If hovered, reset fade timer or mark as permanently revealed
        if (isHovered) {
          if (!areAllDotsRevealed()) {
          if (isText) {
            revealForever[row][col] = true; // Permanently reveal text dots
          }
          fadeTimers[row][col] = p.millis(); // Reset fade timer for all dots
        }
        }

        // Calculate time since last hovered
        const timeSinceHovered = p.millis() - fadeTimers[row][col];
        let colorValue = 0;

        // Determine the color based on hover and fade
        if (revealForever[row][col]) {
          colorValue = 255; // Permanently revealed text dots stay white
        } else if (timeSinceHovered < 1000) {
          const fadeProgress = timeSinceHovered / 1000; // 0 to 1 over 1 second
          colorValue = p.lerp(255, 0, fadeProgress); // Fade to black
        }

        const color = isText
          ? areAllDotsRevealed()
            ? [brightness, brightness, brightness] // Oscillate between black and white
            : [255, 111, 97] // Red for text dots not fully revealed
          : [245, 245, 245]; // White for non-text dots

        // Draw the circle with softer edges
        drawSoftCircle(x + ballSize / 2, y + ballSize / 2, ballSize - 2, colorValue, color);
      }
    }
  };


        function areAllDotsRevealed() {
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            if (isBitmapDot(col, row) && !revealForever[row][col]) {
              return false; // If any dot is not revealed, return false
            }
          }
        }
        return true; // All dots are revealed
      }
};

export default Sketch;
