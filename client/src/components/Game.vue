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
        speed: 60,
        scores: 0,
        snake: [
                {
                    x: 0,
                    y: 0
                }
        ],
        obstacles: [],
        wormholes: [],
        directions: [{
            direction: "left",
            keyCode: 37,
            move: {
            x: -0.25,
            y: 0
            }
        },
        {
            direction: "up",
            keyCode: 38,
            move: {
            x: 0,
            y: -0.25
            }
        },
        {
            direction: "right",
            keyCode: 39,
            move: {
            x: 0.25,
            y: 0
            }
        },
        {
            direction: "down",
            keyCode: 40,
            move: {
            x: 0,
            y: 0.25
            }
        }],
        newDirection: {
            direction: "",
            keyCode: 0,
            move: {
            x: 0,
            y: 0
            }
        },
        elongate: false,
    }),

    computed: {
        canvasSize() {
            return  this.cellSize * this.boardSize;
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
            this.direction = this.directions[randomDirectionIndex];
            this.newDirection = this.direction;
            this.gem = null;
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
            this.createGem();

            if(this.direction !== this.newDirection && this.snake[0].x % 1 === 0 && this.snake[0].y % 1 === 0){
                this.direction = this.newDirection;
            } 

            this.board.beginPath();
            this.snake.forEach(this.drawSnakeBody);
            this.board.closePath();

            this.board.beginPath();
            this.obstacles.forEach(this.drawObstacle);
            this.board.closePath();

            this.board.beginPath();
            this.drawWormholes(this.wormholes[0], "#6698FF");
            this.board.closePath();

            const newHeadCell = {
                x: this.snake[0].x + this.direction.move.x,
                y: this.snake[0].y + this.direction.move.y
            };

            if (this.hitGem()) {
                for(var i = 0; i < 4; i++){
                    var newHead = {
                        x: this.gem.x + this.direction.move.x * i,
                        y: this.gem.y + this.direction.move.y * i
                    }
                    this.snake.unshift(newHead);
                }
                this.gem = null;
                this.scores++;
            } else {
                this.snake.unshift(newHeadCell);
                this.snake.pop();
            }

            if (this.hitWormhole()){
                if(newHeadCell.x === this.wormholes[0].a.x){
                    newHeadCell.x = this.wormholes[0].b.x;
                    newHeadCell.y = this.wormholes[0].b.y;
                } else{
                    newHeadCell.x = this.wormholes[0].a.x;
                    newHeadCell.y = this.wormholes[0].a.y;
                }
            }

            if (this.outOfBounds(this.snake[0]) || this.bodyLength(this.snake[0]) > 1 || this.hitObstacle(this.snake[0])) {
                this.$emit('scoreAchieved', this.scores);
                console.log("emmitted score");
            }

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
            var purple = 'rgb(187, 111, 231)';
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
            var hit = false;
            this.obstacles.forEach(obstacle => {
                if( x === obstacle.x && y === obstacle.y){
                    hit = true;
                }
            });
            return hit;
        },
        onKeyPress(event) {
            const newDirection = this.directions.find(c => c.keyCode === event.keyCode);

            if (!newDirection) {
                return;
            }

            if (Math.abs(newDirection.keyCode - this.direction.keyCode) !== 2) {
                this.newDirection = newDirection;
            }
        },
        createGem() {
            if (!this.gem) {
                let gem = this.getRandomCell();
                while (this.bodyLength(gem) > 0 && this.notSameLocation(gem)) {
                    gem = this.getRandomCell();
                }
                this.gem = gem;
            }
            this.board.beginPath();
            this.board.rect(
                this.gem.x * this.cellSize,
                this.gem.y * this.cellSize,
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
                if(Math.abs(randomLocation.x - this.getMiddleCell()) > 5 || Math.abs(randomLocation.y - this.getMiddleCell()) > 5){
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
        hitGem() {
            return (
                this.snake[0].x + (this.direction.move.x * 4) === this.gem.x &&
                this.snake[0].y + (this.direction.move.y * 4) === this.gem.y
            );
        },
        hitWormhole() {
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


