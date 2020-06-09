<template>
    <div id="gameArea">
    <p> Score: {{scores}} </p>
    <canvas ref="board" id="game-canvas" :width="canvasSize" :height="canvasSize"></canvas>
    </div>
</template>

<script>
  export default {
    name: 'Game',

    props: {
        isPlaying: Boolean,
    },

    data: () => ({
        cellSize: 10,
        boardSize: 50,
        speed: 20,
        scores: 0,

        constants: [{
            direction: "left",
            keyCode: 37,
            move: {
            x: -1,
            y: 0
            }
        },
        {
            direction: "top",
            keyCode: 38,
            move: {
            x: 0,
            y: -1
            }
        },
        {
            direction: "right",
            keyCode: 39,
            move: {
            x: 1,
            y: 0
            }
        },
        {
            direction: "bottom",
            keyCode: 40,
            move: {
            x: 0,
            y: 1
            }
        }],
    }),

    computed: {
        canvasSize() {
            return this.cellSize * this.boardSize;
        }
    },
    mounted() {
        this.board = this.$refs.board.getContext("2d");
        window.addEventListener("keydown", this.onKeyPress);
    },
    created() {
        this.resetSnake();
    },
    beforeDestroy() {
        window.removeEventListener("keydown", this.onKeyPress);
    },
    watch: {
        isPlaying(value) {
            this.clear();
            if (value) {
                this.resetSnake();
                this.move();
            } else {
                this.scores = 0;
            }
        }
    },
    methods: {
        resetSnake() {
            this.snake = [
                {
                    x: this.getMiddleCell(),
                    y: this.getMiddleCell()
                }
            ];
            const randomDirectionIndex = Math.floor(Math.random() * 4);
            this.direction = this.constants[randomDirectionIndex];
            this.targetCell = null;
        },
        getMiddleCell() {
            return Math.round(this.boardSize / 2);
        },
        move() {
            if (!this.isPlaying) {
                return;
            }

            this.clear();
            this.setTargetCell();

            const newHeadCell = {
                x: this.snake[0].x + this.direction.move.x,
                y: this.snake[0].y + this.direction.move.y
            };

            if (this.outOfBounds(newHeadCell) || this.bodyLength(this.snake[0]) > 1) {
                this.$emit('scoreAchieved', this.scores);
                console.log("emmitted score");
            }

            if (this.hitTarget()) {
                this.snake.unshift(this.targetCell);
                this.targetCell = null;
                this.scores++;
            } else {
                this.snake.unshift(newHeadCell);
                this.snake.pop();
            }

            this.board.beginPath();
            this.snake.forEach(this.drawSnakeBody);
            this.board.closePath();

            setTimeout(this.move, this.getMoveDelay());
        },
        clear() {
            this.board.fillStyle = "white";
            this.board.fillRect(0, 0, this.canvasSize, this.canvasSize);
        },
        drawSnakeBody({ x, y }) {
            this.board.rect(
                x * this.cellSize,
                y * this.cellSize,
                this.cellSize,
                this.cellSize
            );
            this.board.fillStyle = "black";
            this.board.fill();
        },
        getMoveDelay() {
            return (1 / Number(this.speed)) * 1000;
        },
        outOfBounds({ x, y }) {
            return x < 0 || y < 0 || x >= this.boardSize || y >= this.boardSize;
        },
        onKeyPress(event) {
            const newDirection = this.constants.find(c => c.keyCode === event.keyCode);

            if (!newDirection) {
                return;
            }

            if (Math.abs(newDirection.keyCode - this.direction.keyCode) !== 2) {
                this.direction = newDirection;
            }
        },
        setTargetCell() {
            if (!this.targetCell) {
                let targetCell = this.getRandomCell();
                while (this.bodyLength(targetCell) > 0) {
                    targetCell = this.getRandomCell;
                }
                this.targetCell = targetCell;
            }

            this.board.beginPath();
            this.board.rect(
                this.targetCell.x * this.cellSize,
                this.targetCell.y * this.cellSize,
                this.cellSize,
                this.cellSize
            );
            this.board.fillStyle = "red";
            this.board.fill();
            this.board.closePath();
        },
        getRandomCell() {
            return {
                x: Math.floor(Math.random() * this.boardSize),
                y: Math.floor(Math.random() * this.boardSize)
            };
        },
        bodyLength(cell) {
            return this.snake.filter(({ x, y }) => x === cell.x && y === cell.y)
                .length;
        },
        hitTarget() {
            return (
                this.snake[0].x + this.direction.move.x === this.targetCell.x &&
                this.snake[0].y + this.direction.move.y === this.targetCell.y
            );
        }
    }
  }
</script>

<style scoped>
    #game-canvas {
        border: 1px solid #ccc;
        background: white;
    }

</style>


