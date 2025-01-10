const Snake = (p) => {
    const ballSize = 20; // Size of each ball in pixels
    let cols, rows; // Number of columns and rows in the grid


    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);
      setupGrid();
      p.frameRate(30);
      initializeTimers();
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
        }
        
        
        let snake;
        let direction;
        let food;
        const initialLength = 5;
    
        p.draw = () => {
          p.background(220);
          drawGrid();
          moveSnake();
          checkCollision();
          drawSnake();
          drawFood();
        };
    
        function initializeTimers() {
          snake = [];
          for (let i = 0; i < initialLength; i++) {
            snake.push({ x: Math.floor(cols / 2), y: Math.floor(rows / 2) });
          }
          direction = { x: 1, y: 0 };
          placeFood();
        }
    
        function drawGrid() {
          p.stroke(200);
          for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
              p.noFill();
              p.rect(i * ballSize, j * ballSize, ballSize, ballSize);
            }
          }
        }
    

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
        p.noLoop();
      }
      for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
          p.noLoop();
        }
      }
    }

    function drawSnake() {
      p.fill(0);
      for (let part of snake) {
        p.rect(part.x * ballSize, part.y * ballSize, ballSize, ballSize);
      }
    }

    function placeFood() {
      food = {
        x: Math.floor(p.random(cols)),
        y: Math.floor(p.random(rows))
      };
    }

    function drawFood() {
      p.fill(255, 0, 0);
      p.rect(food.x * ballSize, food.y * ballSize, ballSize, ballSize);
    }

    p.keyPressed = () => {
      if (p.keyCode === p.LEFT_ARROW && direction.x === 0) {
        direction = { x: -1, y: 0 };
      } else if (p.keyCode === p.RIGHT_ARROW && direction.x === 0) {
        direction = { x: 1, y: 0 };
      } else if (p.keyCode === p.UP_ARROW && direction.y === 0) {
        direction = { x: 0, y: -1 };
      } else if (p.keyCode === p.DOWN_ARROW && direction.y === 0) {
        direction = { x: 0, y: 1 };
      }
    };
}