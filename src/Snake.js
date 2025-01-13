const Snake = (p) => {
  const ballSize = 20; // Size of each ball in pixels
  let direction = { x: 1, y: 0 }; 
  let cols, rows; // Number of columns and rows in the grid
  let snake;
  let food;
  const initialLength = 5;


  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    setupGrid();
    initializeTimers();
    p.frameRate(30);
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    setupGrid();
    initializeTimers();
  };

  // Setup grid dimensions
  function setupGrid() {
    cols = Math.floor(p.width / ballSize);
    rows = Math.floor(p.height / ballSize);
    placeFood();
  }

  // Initialize the snake and direction
  function initializeTimers() {
    snake = [];
    for (let i = 0; i < initialLength; i++) {
      snake.push({ x: Math.floor(cols / 2), y: Math.floor(rows / 2) });
    }
    direction = { x: 1, y: 0 };
    placeFood();
  }

  p.draw = () => {
    p.background(220);
    moveSnake();
    checkCollision();
    drawSnake();
    drawFood();

    // Display message when snake length is 5

      p.fill(0);
      p.textSize(32);
      p.textFont('Helvetica');
      p.textStyle(p.BOLD);
      p.textAlign(p.CENTER, p.TOP);
      const formattedText = `${snake.length - 5} / 7`;
      p.text(formattedText, p.width / 2, 10);
      

      if (snake.length === 11) {
        window.location.href = "https://jamesdewinton.com/nothing-tech";
      }

  };
  

  function moveSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      placeFood();
    } else {
      snake.pop();
    }
  }


function checkCollision() {
    const head = snake[0];
    if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
        freezeAndRestart();
    }
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            freezeAndRestart();
        }
    }
}

function freezeAndRestart() {
    p.noLoop(); // Stop the draw loop
    setTimeout(() => {
        initializeTimers();
        p.loop(); // Restart the draw loop
    }, 2000); // Freeze for 3 seconds
}
  function drawSnake() {
    p.fill(0);
    for (let part of snake) {
        drawSoftCircle(part.x * ballSize + ballSize / 2, part.y * ballSize + ballSize / 2, ballSize, 255, [245, 245, 245]);
    }
  }

  function placeFood() {
    food = {
      x: Math.floor(p.random(cols)),
      y: Math.floor(p.random(rows))
    };
  }

  function drawFood() {

    drawSoftCircle(food.x * ballSize + ballSize / 2, food.y * ballSize + ballSize / 2, ballSize, 255, [255, 111, 97]);
  }

  p.keyPressed = (kp) => {
    if (p.keyCode === p.LEFT_ARROW && direction.x === 0) {
      direction = { x: -1, y: 0 };
      kp.preventDefault(); 
    } else if (p.keyCode === p.RIGHT_ARROW && direction.x === 0) {
      direction = { x: 1, y: 0 };
      kp.preventDefault();  
    } else if (p.keyCode === p.UP_ARROW && direction.y === 0) {
      direction = { x: 0, y: -1 };
      kp.preventDefault();   
    } else if (p.keyCode === p.DOWN_ARROW && direction.y === 0) {
      direction = { x: 0, y: 1 };
      kp.preventDefault();  
    }
  };

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
};

export default Snake;