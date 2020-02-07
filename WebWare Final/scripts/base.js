var testplay, transition, road , background, hint;
var divider = [];
var obstacle = [];
var gameWidth, gameHeight;
var finish;
var score;
var points = 0;
var retrys;
var lives = 3;
var cleared = true;
var gameOnePlay;
var gameTwoPlay;
var inter;
var endGame;
//Starts the game
function start(){
	WebWare.start();
	score = new characters("30px","Cooper","white", 10,490,"text")
	retrys = new characters("30px","Cooper","white",850,490,"text");
	transition = new characters(1000,700,"black",0,0,"transit");
	chooseGame();
}
var WebWare = {
	canvas : document.createElement("canvas"),
	start : function(){
		this.canvas.width = 1000;
		this.canvas.height = 500;
		this.frameNo = 0;
		this.context = this.canvas.getContext("2d");
		document.body.insertBefore(this.canvas,document.body.childNodes[0]);
		//Creates listeners for keyboard presses
		window.addEventListener('keydown', function (e) {
			WebWare.keys = (WebWare.keys || []);
			WebWare.keys[e.keyCode] = true;
		})
		
		window.addEventListener('keyup', function(e) {
			WebWare.keys[e.keyCode] = false;
		})
		
		this.interval = setInterval(updateGame, 20);
		this.interval = setInterval(updateInter,1000)
	},
	clear : function () {
		this.context.clearRect(0,0, this.canvas.width, this.canvas.height);
	},
    stop : function() {
        clearInterval(this.interval);
    }    
}
function everyinterval(num){
	if((WebWare.frameNo / num) % 1 == 0){return true;}
	return false;
}
function characters(width,height,skin,x,y,type) {
	this.type = type;
	this.width = width;
	this.height = height;
	this.score = score;
	this.speedX = 0;
	this.speedY = 0;
	this.MaxspeedX = 100;
	this.MaxspeedY = 100;
	this.x = x;
	this.y = y;
	this.gravity = 0;
	this.fallingSpeed = 0;
	if(type == "image"){
		this.image = new Image();
		this.image.src = skin;
	}
	this.update = function(){
		contex = WebWare.context;
		if(this.type == "text"){
			contex.font = this.width + " " + this.height;
			contex.fillStyle = skin;
			contex.fillText(this.text,this.x,this.y);
		} else if(this.type == "image"){
			contex.drawImage(this.image,this.x,this.y,this.width,this.height);
		} else if(this.type == "transit"){
			contex.fillStyle = skin;
			contex.fillRect(this.x,this.y,this.width,this.height);
			this.speedY = -10;
		} else if(this.type == "transitdown"){
			contex.fillStyle = skin;
			contex.fillRect(this.x,this.y,this.width,this.height);
			this.speedY = 10;
		}
		else {
			contex.fillStyle = skin;
			contex.fillRect(this.x,this.y,this.width,this.height);
		}

	}
	this.crashWith = function(obst) {
		var charLeft = this.x;
		var charRight = this.x + (this.width);
		var charUpper = this.y;
		var charLower = this.y + (this.height);
		var obsLeft = obst.x;
		var obsRight = obst.x + (obst.width);
		var obsUpper = obst.y;
		var obsLower = obst.y + (obst.height);
		var crash = true;
		if((charLower < obsUpper) ||
		(charUpper > obsLower) ||
		(charRight < obsLeft) ||
		(charLeft > obsRight)){
			crash = false;
	}
		return crash;
	}
	this.newPosition = function() {
		this.x += this.speedX;
		this.y += this.speedY;
	}
	this.new2Position = function() {
		this.fallingSpeed += this.gravity;
		this.x += this.speedX;
		this.y += this.speedY + this.fallingSpeed;
		if(this.y < 300){
			jump(1);
		}
		if(this.y > 300){
			this.y = 300;
			this.fallingSpeed = 0;
		}
			
	}
	this.changeSpeed = function(newSpeedX,newSpeedY){
		this.speedX = newSpeedX;
		this.speedY = newSpeedY;
	}
	this.del = function(){
		this.width = 0;
		this.height = 0;
	}
}
function updateGame(){
	var y;
	for (i=0;i<obstacle.length;i +=1){
		if(testplay.crashWith(obstacle[i])){
			badEnd();
			cleared = false;
		return;
		}
	}
	WebWare.clear();
	background.update();
	
	WebWare.frameNo += 1;
	road.update();
	if(gameOnePlay == true){
	if(WebWare.frameNo == 1 || everyinterval(50)){
		divider.push(new characters(55,10,"yellow",1000,175));
	}
	if(WebWare.frameNo == 1 || everyinterval(inter)){
		y = Math.floor(Math.random() * 2) + 1;
		if(y == 1)
		obstacle.push(new characters(250,100,"images/obstacle.png",1000,75,"image"));
		if(y == 2)
		obstacle.push(new characters(250,100,"images/obstacle.png",1000,200,"image"))
	}
	for(p = 0; p<divider.length; p+=1){
		divider[p].x += -10;
		divider[p].update();
	}

	for (i = 0; i<obstacle.length; i+=1){
		obstacle[i].x += -5;
		obstacle[i].update();
	}
	testplay.speedX = 0;
	testplay.speedY = 0;
	//Uses WASD to move the car
	if (WebWare.keys && WebWare.keys[65]) {testplay.speedX -= 1;}
	if (WebWare.keys && WebWare.keys[68]) {testplay.speedX += 1;}
	if (WebWare.keys && WebWare.keys[83]) {testplay.speedY += 2;}
	if (WebWare.keys && WebWare.keys[87]) {testplay.speedY -= 2;}
	}
	if(gameTwoPlay == true){
		if(WebWare.frameNo == 1 || everyinterval(inter)){
			obstacle.push(new characters(200,150,"images/koopa.png",1000,300,"image"))
		}
		for (i = 0; i<obstacle.length; i+=1){
			obstacle[i].x += -10;
			obstacle[i].new2Position();
			obstacle[i].update();
		}
		gravity = 20
		testplay.speedX = 0;
		testplay.speedY = 0;
		//Checks keys pressed and moves the character
		if (WebWare.keys && WebWare.keys[65]) {testplay.speedX = -1;}
		if (WebWare.keys && WebWare.keys[68]) {testplay.speedX = 1;}
		if (WebWare.keys && WebWare.keys[87]) {testplay.fallingSpeed = -10;}
	}
	if(gameOnePlay == true)
		testplay.newPosition();
	else
		testplay.new2Position();
	testplay.update();


	score.text = "Score: " + points;
	score.update();
	retrys.text = "Lives: " + lives;
	retrys.update();
	
	transition.newPosition();
	transition.update();
	hint.update();
}
//Chooses the games that are going to be played
function chooseGame(){
	var choice = Math.random() * 2;
	if (Math.ceil(choice) == 1){
		gameOne();
	}else if (Math.ceil(choice) == 2){
		gameTwo();
	}
}
function gameOne(){
	endGame = setTimeout(finishtransit,10000);
	WebWare.gravity = 0;
	WebWare.fallingSpeed = 0;
	transition = new characters(1000,700,"black",0,0,"transit");
	cleared = true;
	gameOnePlay = true;
	hint = new characters("50px","Goudy","white",400,50,"text");
	hint.text = "Avoid";
	setTimeout(eraseText,750);
	testplay = new characters(250,100,"images/testCar.png",50,200,"image");
	background = new characters(1000,500,"green",0,0);
	road = new characters(1000,250,"black",0,50);
}
function gameTwo(){
	transition = new characters(1000,700,"black",0,0,"transit");
	endGame = setTimeout(finishtransit,10000);
	WebWare.gravity = 10;
	WebWare.fallingSpeed = 100;
	cleared = true;
	gameTwoPlay = true;
	testplay = new characters(100,150,"images/mario.png",50,300,"image");
	background = new characters(1000,500,"blue",0,0);
	hint = new characters("50px","Goudy","white",400,50,"text");
	hint.text = "Jump";
	setTimeout(eraseText,750);
	road = new characters(1000,100,"brown",0,450);
}
//Creates a black screen
function finish(){
	transition = new characters(1000,1000,"black",0,0);
	if(cleared == true)
		points = points + 1;
	else
		lives = lives - 1;
	
	lifeCheck();
}
//Transitions a black block to hide the change from swapping microgames
function finishtransit(){
	transition = new characters(1000,700,"black",0,-700,"transitdown");
	setTimeout(finish,1500);
	obstacle.length = 0;
	divider.length = 0;
	gameOnePlay = false;
	gameTwoPlay = false;
}
function eraseText(){
	hint.x = -10000;
}
function badEnd() {
	clearTimeout(endGame);
	finishtransit();
}
function jump(speed) {
		testplay.gravity = speed;
		if(testplay.y > 300)
			testplay.fallingSpeed = -10
}
function lifeCheck() {
	if(lives == 0){
		hint = new characters("50px","Impact","white",400,250,"text");
		hint.text = "Game Over";
	}else
		setTimeout(chooseGame(),1000);
}
function updateInter(){
	inter = Math.floor(Math.random() * 400) + 200;	
}