const Sketch = (p) => {
  const ballSize = 20; // Size of each ball in pixels
  let cols, rows; // Number of columns and rows in the grid
  let fadeTimers = []; // Array to track fade timers
  let revealForever = []; // Array to mark permanently revealed dots
  let colorHue = 0; // Initial hue for cycling colors
  let isTextCache = []; // Cache for text dots


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


  // Draw a soft circle with gradient edges
  function drawSoftCircle(x, y, diameter, colorValue, color) {
    const layers = 10; // Number of gradient layers
    for (let i = layers; i > 0; i--) {
      const alpha = p.map(i, 0, layers, 0, colorValue); // Decrease opacity for each layer
      const size = p.map(i, 0, layers, 0, diameter); // Decrease size for each layer
      p.fill(...color, alpha); // Set color with decreasing opacity
      p.noStroke(); // Remove stroke
      p.circle(x, y, size); // Draw circle
    }
  }

  p.draw = () => {
    p.background(0); // Black background
    let brightness = (p.sin(p.millis() / 1000) + 1) * 127.5;

    if (areAllDotsRevealed()) {
      brightness = (p.sin(p.millis() / 1000) + 1) * 127.5; // Oscillates between 0 and 255
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
          if (isText) {
            revealForever[row][col] = true; // Permanently reveal text dots
          }
          fadeTimers[row][col] = p.millis(); // Reset fade timer for all dots
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
            : [255, 0, 0] // Red for text dots not fully revealed
          : [255, 255, 255]; // White for non-text dots


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
