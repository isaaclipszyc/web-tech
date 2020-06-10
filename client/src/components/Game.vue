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
        obstacles: [],
        wormholes: [],
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
            this.createObstacles();
            this.createWormholes();
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

            if (this.outOfBounds(newHeadCell) || this.bodyLength(this.snake[0]) > 1 || this.hitObstacle(newHeadCell)) {
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

            if (this.hitHole()){
                if(newHeadCell.x === this.wormholes[0].a.x){
                    newHeadCell.x = this.wormholes[0].b.x;
                    newHeadCell.y = this.wormholes[0].b.y;
                } else{
                    newHeadCell.x = this.wormholes[0].a.x;
                    newHeadCell.y = this.wormholes[0].a.y;
                }
            }

            this.board.beginPath();
            this.snake.forEach(this.drawSnakeBody);
            this.board.closePath();

            this.board.beginPath();
            this.obstacles.forEach(this.drawObstacle);
            this.board.closePath();

            this.board.beginPath();
            this.drawWormholes(this.wormholes[0], "yellow");
            this.board.closePath();

            // this.board.beginPath();
            // this.drawWormholes(this.wormholes[1], "purple");
            // this.board.closePath();

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
            var purple = 'rgb(187, 111, 231)'
            this.board.fillStyle = purple;
            this.board.fill();
        },
        drawObstacle({ x, y }) {
            this.board.rect(
                x * this.cellSize,
                y * this.cellSize,
                this.cellSize,
                this.cellSize
            );
            this.board.fillStyle = "black";
            this.board.fill();
        },
        drawWormholes(pair, colour) {
            this.board.rect(
                pair.a.x * this.cellSize,
                pair.a.y * this.cellSize,
                this.cellSize,
                this.cellSize
            );
            this.board.fillStyle = colour;
            this.board.fill();
            
            this.board.rect(
                pair.b.x * this.cellSize,
                pair.b.y * this.cellSize,
                this.cellSize,
                this.cellSize
            );
            this.board.fillStyle = colour;
            this.board.fill();
        },
        getMoveDelay() {
            return (1 / Number(this.speed)) * 1000;
        },
        outOfBounds({ x, y }) {
            return x < 0 || y < 0 || x >= this.boardSize || y >= this.boardSize;
        },
        hitObstacle({x, y}) {
            var hit = false
            this.obstacles.forEach(obstacle => {
                if( x === obstacle.x && y === obstacle.y){
                    hit = true;
                }
            });
            return hit;
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
                while (this.bodyLength(targetCell) > 0 && this.notSameLocation(targetCell)) {
                    targetCell = this.getRandomCell();
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
        notSameLocation({x,y}){
            var same = false;
            this.obstacles.forEach(obstacle => {
                if(x === obstacle.x && y === obstacle.y){
                    same = true;
                }
            });
            this.wormholes.forEach(pair=> {
                pair.forEach( hole => {
                    if(x === hole.x && y === hole.y){
                    same = true;
                    }
                });
            });
            return same;
        },
        createObstacles() {
            var obstacles = [];
            var numOfObstacles = 0;
            while(numOfObstacles < 10){
                var randomLocation = this.getRandomCell();
                if(Math.abs(randomLocation.x - this.getMiddleCell()) > 10 || Math.abs(randomLocation.y - this.getMiddleCell()) > 10){
                    obstacles.push(randomLocation);
                    numOfObstacles++;
                }
            }
            this.obstacles = obstacles;
        },
        createWormholes() {
            var wormholes = [];
            var numOfWormholes = 0;
            while(numOfWormholes < 1){
                var randomLocation = this.getRandomCell();
                var randomLocation2 = this.getRandomCell();
                if(Math.abs(randomLocation.x - randomLocation2.x) > 20 || Math.abs(randomLocation.y != randomLocation2.y) > 20){
                    this.obstacles.forEach(obstacle => {
                        if(obstacle.x != randomLocation.x && obstacle.y != randomLocation.y){
                            var pair = {
                                a: randomLocation, 
                                b: randomLocation2
                            }
                            wormholes.push(pair);
                            numOfWormholes++;
                        }
                        
                    })
                }
                
            }
            this.wormholes = wormholes;
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
        },
        hitHole() {
            return (
                this.snake[0].x === this.wormholes[0].a.x &&
                this.snake[0].y === this.wormholes[0].a.y ||
                this.snake[0].x === this.wormholes[0].b.x &&
                this.snake[0].y === this.wormholes[0].b.y
            )
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


