//variables are storage of values, and it helps to make the values reusable
//variable - reusable words that represent a value
let board;
let score = 0;
let rows = 4;
let columns = 4;
// example of variables algebra (a=5, b=7)

//This variables will be used to assure that the player will be congratualted only one time after reaching 2048, 4096, or 8192.
let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;

//for phone device touch swiping
let startX = 0;
let startY = 0;


//reusable tasks = function
function setGame(){

	board = [
        [32, 8, 4, 0],
        [4, 128, 64, 256],
        [8, 32, 16, 2],
        [16, 2, 256, 1024]
    ];  //Goal, we will use this backend board to create our frontend board.

//loop = code for repeating tasks inside it until it's done or fulfilled/completed the whole task - here, until the board will have a tile with their proper colors)
	for(let r=0; r< rows; r++){
		for(let c=0; c<columns; c++){
			//create and design a tile

			//created tile
			let tile = document.createElement("div");
			
			//each tile will have an invisible id
			tile.id = r.toString() + "-" + c.toString();

			//created number of the tile
			let num = board[r][c];

			updateTile(tile, num);

			document.getElementById("board").append(tile)
		}
	}

	setTwo();
	setTwo();
}

//updateTile() - updates the appearance of the tile (that should have tile number and background color)
function updateTile(tile, num){

	tile.innerText = "";
	tile.classList.value = "";

	tile.classList.add("tile");

	//updataTile() uses our prepared styles in style.css
	if(num > 0){
		tile.innerText = num.toString();
	
		if(num <= 4096){
					//class -> x - class sa styles.css (.x2, .x4, .x8, etc...)
			tile.classList.add("x" + num.toString());		
		}
		else{
			tile.classList.add("x8192");
		}
	}
}

window.onload = function(){
	setGame(); //syntax for calling functions
}

function handleSlide(event){ 
	
	//event.code - is the pressed key in our keyboard
	console.log(event.code); //aalamin ang input ni user or kung ano ang napindot sa keyboard

	if(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.code)){

		event.preventDefault();  //Prevents the default behaviour in our browser, where the arrow keys (default behaviour to prevent:  Whenever pressing arrow keys, the game also joins in sliding)
	
	if(event.code == "ArrowLeft"){
		slideLeft();
		setTwo();
	}
	else if(event.code == "ArrowRight"){
		slideRight();
		setTwo();
	}
	else if(event.code == "ArrowUp"){
		slideUp();
		setTwo();
	}
	else if(event.code == "ArrowDown"){
		slideDown();
		setTwo();
	}
  }

  document.getElementById("score").innerText = score;  //getElementById - galing sa html doc na may id name na "score" update

  checkWin(); //checks if we already won every time we click the arrows

  if(hasLost() == true){
  	alert("Gamer Over! You have lost the game. Game will restart.");
  	restartGame();
  	alert("Click any arrow key to restart.");

  }

}

//addEventListener - observes if we pressed any keys so that the handleSlide function will work
document.addEventListener("keydown", handleSlide);

function slideLeft(){
	for(let r=0; r<rows; r++){
		let row = board[r]

//for animation of slide
		let originalRow = row.slice(); //added

		row = slide(row); //slideLeft() function uses slide() function to merge tiles with the same values.
		
		board[r] = row;
		
		for(let c = 0; c<columns; c++){

			// this line of code is the retrieve our tile element --- ito yung e-a-update na tile
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			
			let num = board[r][c];
			
			//for animation:
			if (originalRow[c] !== num && num !== 0) {
				tile.style.animation = "slide-from-right 0.3s";
				setTimeout(()=> {
					tile.style.animation = "";
				}, 300);
			}

			//updates the appearance of the tile
			updateTile(tile, num);
		}
	}
}

function filterZero(row){
	return row.filter(num => num !=0);	
}

//slide function merges the same adjacent tile
//core function for sliding and merging tiles
function slide(row){
	row = filterZero(row);  //reason for filter 0 - para makapag focus yung program natin doon sa mga tiles na may ibang values
	for(let i = 0; i<row.length - 1; i++){
		if(row[i] == row[i+1]){
			row[i] *= 2;   //2 2
			row[i+1] = 0;  //4 0
			score += row[i];  //every time na magmemerge ang tile, magiging score points siya ni user
		}
	}

	// Add zeroes back
	while(row.length < columns){
		row.push(0);  //4 0 0 0 
	}

	return row;

}


function slideRight(){

	for(let r=0; r<rows; r++){

		let row = board[r]

	//added
		let originalRow = row.slice();
		row.reverse();
		row = slide(row); //slideLeft() function uses slide() function to merge tiles with the same values.
		row.reverse();

		board[r] = row;

		for(let c = 0; c<columns; c++){

			// this line of code is the retrieve our tile element --- ito yung e-a-update na tile
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			
			let num = board[r][c];
			// Animation code
			if(originalRow[c] !== num && num!==0){
				
				tile.style.animation = "slide-from-left 0.3s";
				setTimeout(()=> {
					tile.style.animation = "";
				}, 300);
			}
			
			//updates the appearance of the tile
			updateTile(tile, num);
		}
	}
}

function slideUp(){

	for(let c=0; c<columns; c++){

		let col = [ board[0][c], board[1][c], board[2][c], board[3][c] ];

		let originalCol = col.slice();
		col = slide(col); // slideUp() function uses slide() function to merge tiles with the same values.

		let changeIndices = [];
		for(let r=0; r<rows; r++){
			if(originalCol[r] !== col[r]){
				changeIndices.push(r);
			}
		}
		
		for(let r = 0; r<rows; r++){

			board[r][c] = col[r];

			// this code is the retrieve our tile element
			let tile = document.getElementById(r.toString() + "-" + c.toString());

			let num = board[r][c];

			if(changeIndices.includes(r) && num!==0){
				tile.style.animation = "slide-from-bottom 0.3s";
				setTimeout(()=>{
					tile.style.animation = "";
				}, 300);
			}

			// Updates the appearance of the tile
			updateTile(tile, num);
		}
	}
}

function slideDown(){
	for(let c=0; c<columns; c++){
	
	let col = [board[0][c], board[1][c], board[2][c], board[3][c] ];
		
		let originalCol = col.slice();

		col.reverse();
		col = slide(col); //slideUp() function uses slide() function to merge tiles with the same values.
		col.reverse();

		let changeIndices = [];
		for(let r=0; r<rows; r++){
			if(originalCol[r] !== col[r]){
				changeIndices.push(r);
			}
		}


		for(let r = 0; r<rows; r++){ // r here represents 1 tile

			board[r][c] = col[r];

			// this line of code is the retrieve our tile element --- ito yung e-a-update na tile
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			
			let num = board[r][c];
			
			if(changeIndices.includes(r) && num!==0){
				tile.style.animation = "slide-from-top 0.3s";
				setTimeout(()=>{
					tile.style.animation = "";
				}, 300);
			}

			//updates the appearance of the tile
			updateTile(tile, num);
		}
	}
}

//hasEmptyTile checks the game baord if it contains any empty (zero) tiles.
function hasEmptyTile(){

	//loop
	for(let r=0; r<rows; r++){
		for(let c=0; c<columns; c++){
			if(board[r][c] == 0){
				return true;
			}
		}
	}
	return false;
}

function setTwo(){

	//if hasEmptyTile() function returns false, the setTwo() function will not generate a new tile.
	if(hasEmptyTile() == false){
		return; //"I will do nothing, I don't have to generate a new tile"
	}

	//hasEmptyTile -> true
	//the codes below are the codes to be executed once the condition above is not satisfied.
	let found = false;

	while(!found){
		
		// This is to generate a random row and column position to check a random tile, and generate a tile with number 2 in it.
		//This is to generate a random row and column position to generate a random 2.
		let r = Math.floor(Math.random()* rows);
		let c = Math.floor(Math.random()* columns);

		//if the random tile is an emty tile, the program will make it a tile with number 2.
		if(board[r][c] == 0 ){

			//the random vacant tile becomes 2
			board[r][c] = 2;

			let tile = document.getElementById(r.toString() + "-" + c.toString());
			
			tile.innerText = "2";
			tile.classList.add("x2");

			found = true;

		}
	}

	// codes 
}

function checkWin(){
	for(let r=0; r<rows; r++){
		for(let c=0; c<columns; c++){

			if(board[r][c] == 2048 && is2048Exist == false){
				alert("WOWWW YOU WIN! You got 2048!");
				is2048Exist = true;
			}
			else if(board[r][c] == 4096 && is4096Exist == false){
				alert("You are unstoppable at 4096!");
				is4096Exist = true;
			}
			else if(board[r][c] == 8198 && is8192Exist == false){
				alert("You're awesome, now you got 8198!");
				is8192Exist = true;
			}
		}
	}
}


function hasLost(){
	for(let r=0; r < rows; r++){
		for(let c=0; c < columns; c++){

			//if there is an empty tile, the players has not yet lose the game.
			if(board[r][c]==0){
				return false; //false siya if meron pang blank tiles
			}

			const currentTile = board[r][c];

			if(
				//check the current tile if it has a possible merge in its upper tile.
				r > 0 && board[r-1][c] === currentTile ||
				//check the current tile if it has a possible merge in its lower tile.
				//r< 3 (4-1 = 3) dili na need magcheck sa tiles nga before sa first tile sa baba or sa taas
				r < rows - 1 && board[r+1][c] === currentTile ||
				
				//check the current tile if it has a possible merge in its right tile.
				c > 0 && board[r][c-1] === currentTile ||
				//check the current tile if it has a possible merge in its left tile.
				//c < 3 (4-1 = 3 ) dili na naeed magcheck sa tiles nga before sa first tile sa kilid
				c < columns - 1 && board[r][c+1] === currentTile
			){
				return false;
			}
		}
	}
	return true;
}


//RestartGame by replacing all values into zero.
function restartGame(){
    // Iterate in the board and 
    for(let r = 0; r < rows; r++){
        for(let c = 0; c < columns; c++){
            board[r][c] = 0;    // change all values to 0
        }
    }

    score = 0; //score will get back to 0
    setTwo()    // new tile   
}

document.addEventListener('touchstart', (event) =>{
	startX = event.touches[0].clientX;
	startY = event.touches[0].clientY;
})

document.addEventListener('touchend', (event) => {

	if(!event.target.className.includes("tile")){
		return; // "I will do nothing, since you haven't touched a tile"
	}

	// touchstart - touchend
	let diffX = startX - event.changedTouches[0].clientX;
	let diffY = startY - event.changedTouches[0].clientY;

	if(Math.abs(diffX) > Math.abs(diffY)){
		if(diffX > 0 ){
			slideLeft();
			setTwo();
		}
		else{
			slideRight();
			setTwo();
		}
	}
	else{

		if(diffY > 0 ){
			slideUp();
			setTwo();
		}
		else{
			slideDown();
			setTwo();
		}

	}

	document.getElementById("score").innerText = score;

	checkWin();

	if(hasLost() == true){
		alert("Game Over! You have lost the game. Game will restart");
		restartGame();
		alert("Click any arrow key to restart");
	}

});

document.addEventListener('touchmove', (event)=>{
	if(!event.target.className.includes("tile")){
		return; //"I will do nothing since the user/player did not touch a tile"
	}

	event.preventDefault();  //default behaviour - kapag nagsswipe ay sumasama yung mismong page, kailangan yung sumasama lang ay yong tiles

}, {passive: false}); //use passive: false, to make preventDefault() work.

