var WIDTH = 450;
var HEIGHT = 500;
setSize(WIDTH, HEIGHT);

var DELAY = 40;
var SPEED = 5; 
var helicopter;
var dy = SPEED;
var maxSpeed = 12;
var minSpeed = -12;
var obstacles = [];
var clicking;
var TERRAIN_WIDTH = 10; 
var MIN_TERRAIN_HEIGHT = 20;
var MAX_TERRAIN_HEIGHT = 50;
var topTerrain = []; 
var botTerrain = [];
var points = 0;
var pointsPerRound = 5;
var txt;
var dust = [];
var DUST_RADIUS = 3; 
var DUST_BUFFER = 10;
var NUM_OBJECTS = 3;
var COIN_RADIUS = 15;
var coins = [];
var counter = 0 ;
var distance = -1;

function start(){
	setup();
	
	setTimer(game, DELAY);
	mouseDownMethod(downMeth);
	mouseUpMethod(upMeth);
}


function setup(){
    setBackgroundColor(Color.black);
    helicopter = new WebImage(ImageLibrary.Objects.helicopter);
    helicopter.setSize(50,25);
    helicopter.setPosition(getWidth()/3, getHeight()/3);
    helicopter.setColor(Color.blue);
    add(helicopter);
    
    
    makeObjects();
    
    makeTerrain();
    
    addPoints();
    
    makeCoins();
    
   
    
    
}
function makeObjects(){
    for(var i = 0; i < NUM_OBJECTS ; i ++){
        var obstacle = new Rectangle(30,100);
        obstacle.setPosition(getWidth() + i * (getWidth()/NUM_OBJECTS), Randomizer.nextInt(0, getHeight()-100));
        obstacle.setColor(Color.green);
        obstacles.push(obstacle);
        add(obstacle);
    }
    
}

function makeCoins(){

        var coin = new Circle(COIN_RADIUS);
        //coin.setPosition(getWidth() + i * getWidth()/3 + getWidth()/6, Randomizer.nextInt(50 + COIN_RADIUS, getHeight()-50 - COIN_RADIUS));
        coin.setPosition(75, Randomizer.nextInt(50 + COIN_RADIUS, getHeight()-50 - COIN_RADIUS));
        coin.setColor(Color.yellow);
        coins.push(coin);
        add(coin);
        var coin = new Circle(COIN_RADIUS);
        //coin.setPosition(getWidth() + i * getWidth()/3 + getWidth()/6, Randomizer.nextInt(50 + COIN_RADIUS, getHeight()-50 - COIN_RADIUS));
        coin.setPosition(375, Randomizer.nextInt(50 + COIN_RADIUS, getHeight()-50 - COIN_RADIUS));
        coin.setColor(Color.yellow);
        coins.push(coin);
        add(coin);

    distance = coins[1].getX() - coins[0].getX() ;
    var txt = new Text(distance);
    txt.setPosition( 100,100);
    txt.setColor(Color.white);
    add(txt);
    
}
function addPoints(){
    txt = new Text(points);
    txt.setPosition(0, txt.getHeight());
    txt.setColor(Color.white);
    add(txt);
}


function game(){
    if(points > 600){
        SPEED += 0.005
    }
    points += pointsPerRound;
    txt.setText(points);
    if(hitWall()){
        lose();
        return;
    }
    moveTerrain();
    addTrail();
    moveTrail();
    moveCoin();
    var checking = hitObstacle();
    
    if(checking != null && checking != helicopter){
        for(var i = 0 ; i < coins.length ; i ++){
            if(checking == coins[i]){
                counter++;
                points += 200;
                remove(coins[i])
                
            }
        }
        if(counter == 0){
            lose();
            return;
        }else{
            counter = 0 
        }
        
    }
    if(clicking){
        dy -=1;
        if(dy < minSpeed){
            dy = minSpeed;
        }
    }else{
        dy+=1;
        if(dy > maxSpeed){
            dy = maxSpeed;
        }
    }
    helicopter.move(0, dy);
    
    for(var i = 0 ; i < obstacles.length; i ++){
       obstacles[i].move(-SPEED, 0);
        if(obstacles[i].getX() < 0){
            obstacles[i].setPosition(getWidth(), Randomizer.nextInt(0, getHeight()-100));
        } 
    }
    
}

function addTrail(){
    var trail = new Circle(DUST_RADIUS);
    trail.setColor('#cccccc');
    trail.setPosition(helicopter.getX() - trail.getWidth(), helicopter.getY() + DUST_BUFFER);
    add(trail);
    
    dust.push(trail);
}

function moveCoin(){
    var xcoord = 0;
    for(var i = 0 ; i < coins.length; i ++){
        coins[i].move(-SPEED,0);
        if (coins[i].getX()< 0) {
            coins[i].setPosition(450,Randomizer.nextInt(50 + COIN_RADIUS, getHeight()-50 - COIN_RADIUS) );
            add(coins[i]);
        }
    }
    /*
    for(var i = 0 ; i < coins.length; i ++){

        if(coins[i].getX()< 0){
            if(i == 1){
                xcoord = coins[0].getX() + distance;
            }else{
                xcoord = coins[1].getX() + distance;
            }
            add(coins[i]);
            coins[i].setPosition(xcoord, Randomizer.nextInt(50 + COIN_RADIUS, getHeight()-50 - COIN_RADIUS));
            var x = coins[i].getX()
            var y = coins[i].getY()
            var point1 = x- coins[i].getRadius() - 1;
            var point2 = y - coins[i].getRadius() - 1;
            var point3 = x + coins[i].getRadius() + 1;
            var point4 = y + coins[i].getRadius() + 1;
            var element1 = getElementAt(point1, y);
            var element2 = getElementAt(x, point2);
            var element3 = getElementAt(point3, y);
            var element4 = getElementAt(x, point4);
            while(element1 != null || element2 != null || element3 != null || element4 != null){
                    coins[i].setPosition(xcoord, Randomizer,nextInt(50 + COIN_RADIUS, getHeight()- 50 - COIN_RADIUS));
                    x = coins[i].getX()
                    y = coins[i].getY()
                    point1 = x- coins[i].getRadius();
                    point2 = y - coins[i].getRadius();
                    point3 = x + coins[i].getRadius();
                    point4 = y + coins[i].getRadius();
                    element1 = getElementAt( point1, y);
                    element2 = getElementAt(x, point2);
                    element3 = getElementAt(point3, y);
                    element4 = getElementAt(x, point4);
            }
        }
    }
    */
    
}
function moveTrail(){
    for(var i = 0; i  < dust.length ;i ++){
        dust[i].move(-SPEED, 0);
        dust[i].setRadius(dust[i].getRadius() - 0.1)
        if(dust[i].getX() < 0){
            remove(dust[i]);
            dust.remove(dust[i]);
        }
    }
}

function downMeth(){
    clicking = true;
} 

function upMeth(){
    clicking = false;
}


function hitWall(){
    var hitTop = helicopter.getY() <0; 
    var hitBot = helicopter.getY() + helicopter.getHeight() > getHeight();
    return hitBot || hitTop;
}

function lose(){
    stopTimer(game);
    
    var txt = new Text("You Lose!");
    txt.setColor(Color.red);
    txt.setPosition(getWidth()/2 - txt.getWidth()/2, getHeight()/2);
    add(txt);
}

function hitObstacle(){
    var check1 = getElementAt(helicopter.getX() - 1, helicopter.getY()-1);
    if(check1 != null){
        return check1;
    }
    
    var check2 = getElementAt(helicopter.getX() + helicopter.getWidth() + 1, helicopter.getY()- 1);
    if(check2 != null){
        return check2;
    }
    
    var check3 = getElementAt(helicopter.getX() - 1, helicopter.getY() + helicopter.getHeight()+1);
    if(check3 != null){
        return check3;
    }
    
    var check4 = getElementAt(helicopter.getX() + helicopter.getWidth() + 1, helicopter.getY() + helicopter.getHeight()+1);
    if(check4 != null){
        return check4;
    }
}

function makeTerrain(){
    for(var i = 0 ; i <= getWidth()/TERRAIN_WIDTH ; i ++){
        var height = Randomizer.nextInt(MIN_TERRAIN_HEIGHT, MAX_TERRAIN_HEIGHT);
        var terrain = new Rectangle( TERRAIN_WIDTH, height);
        terrain.setPosition(TERRAIN_WIDTH * i, 0);
        terrain.setColor(Color.green);
        topTerrain.push(terrain);
        add(terrain);
        
        var height2 = Randomizer.nextInt(MIN_TERRAIN_HEIGHT, MAX_TERRAIN_HEIGHT);
        var terrain2 = new Rectangle( TERRAIN_WIDTH, height2);
        terrain2.setPosition(TERRAIN_WIDTH * i, getHeight() - height2);
        terrain2.setColor(Color.green);
        botTerrain.push(terrain2);
        add(terrain2);
    }
}

function moveTerrain(){
    for(var i = 0 ; i < topTerrain.length ; i ++){
        var obj = topTerrain[i];
        obj.move(-SPEED,0);
        if(obj.getX()< -obj.getWidth()){
            obj.setPosition(getWidth(),0);
        }
    }
    
    for(var j = 0 ; j < botTerrain.length ; j ++){
        var obj = botTerrain[j];
        obj.move(-SPEED,0);
        if(obj.getX()< -obj.getWidth()){
            obj.setPosition(getWidth(),getHeight() - obj.getHeight());
        }
    }
}[]