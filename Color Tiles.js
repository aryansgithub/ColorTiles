// Selecting html elements and putting them in variables
var mainGrid = document.querySelector('.mainGrid');
var targetGrid = document.querySelector('.targetGrid');
var hardMainGrid = document.querySelector('.hardMainGrid');
var hardTargetGrid = document.querySelector('.hardTargetGrid');
var targetGridTile = document.querySelectorAll('.targetGridTile');
var mainGridTile = document.querySelectorAll('.mainGridTile');
var innerGridTile = document.querySelectorAll('#innerGrid');
var hardTargetGridTile = document.querySelectorAll('.hardTargetGridTile');
var hardMainGridTile = document.querySelectorAll('.hardMainGridTile');
var hardInnerGridTile = document.querySelectorAll('#hardInnerGrid');
var resetBtn = document.querySelector('#resetBtn');
var statusText = document.querySelector('.status');
var timeText = document.querySelector('.time');
var heading = document.querySelector('#heading');
var easyBtn = document.querySelector('#easy');
var hardBtn = document.querySelector('#hard');


// Creating variables for audio files
var resetAudio = new Audio('Reset Button audio final.mp3');
var switchAudio = new Audio('Tile Switch audio.mp3');
var victoryAudio = new Audio('Victory audio.mp3');


// Creating other variables needed to implement logic
var colors = ["red", "purple", "green", "yellow", "orange", "pink"];
var blank = -1;
var moves = 0;
var t0 = 0;
var t1 = 0;
var difficulty = 0;


// Adding an event to the reset button
resetBtn.addEventListener('click', resetAction);

function resetAction() {
    // These are the basic things that are common to both easy and hard mode.
    resetAudio.play();
    moves = 0;
    resetBtn.textContent = "RESET";
    heading.textContent = "COLOR TILES";
    timeText.textContent = "";

    // This if block contains actions of reset button on easy mode
    if(difficulty == 0) { 
        easyBtn.style.backgroundColor = "lightcoral";
        hardBtn.style.backgroundColor = "black";
        statusText.textContent = "Try to match the 3x3 grid.";

        //making the hard mode grid disappear.
        hardMainGrid.style.display = "none";
        hardTargetGrid.style.display = "none";

        //making the easy mode grid appear.
        mainGrid.style.display = "grid";
        targetGrid.style.display = "grid";

        // Making the inner grid separately visible
        for(var j = 0; j<9; j++) {
            innerGridTile[j].style.borderColor = "black";
        }

        // Coloring the main grid with random colors from the array
        for(var j = 0; j<25; j++){
            var i = Math.floor(Math.random() * 6);
            mainGridTile[j].style.backgroundColor = colors[i];
        }

        // Adding random colors to target grid
        for(var j = 0; j<9; j++) {
            var i = Math.floor(Math.random() * 6);
            targetGridTile[j].style.backgroundColor = colors[i];
            // Overwriting the main grid with these colours in random mutually exclusive positions, so that the game is solvable.
            var t = Math.floor(Math.random() * 2);
            var u = 24 - ((2*j) + t);
            mainGridTile[u].style.backgroundColor = colors[i];
        }

        // Adding the blank tile at a random position
        var i = Math.floor(Math.random() * 25);
        if((i>=6 && i<=8) || (i>=11 && i<=13) || (i>=16 && i<=18)) {
            mainGridTile[i].style.backgroundColor = "black";  // If blank tile is part of inner grid, make it black.
        }
        else {
            mainGridTile[i].style.backgroundColor = "cornflowerblue";  // If blank tile is not a part of inner grid, make it corn flower blue.
        }
        blank = i;   // Storing position of the blank tile
    }

    // This else block contains actions of reset button on hard mode
    else {
        hardBtn.style.backgroundColor = "lightcoral";
        easyBtn.style.backgroundColor = "black";
        statusText.textContent = "Try to match the 4x4 grid.";

        //making the easy mode grid disappear.
        mainGrid.style.display = "none";
        targetGrid.style.display = "none";

        //making the hard mode grid appear.
        hardMainGrid.style.display = "grid";
        hardTargetGrid.style.display = "grid";

        // Making the inner grid separately visible
        for(var j = 0; j<16; j++) {
            hardInnerGridTile[j].style.borderColor = "black";
        }

        // Coloring the main grid with random colors from the array
        for(var j = 0; j<36; j++){
            var i = Math.floor(Math.random() * 6);
            hardMainGridTile[j].style.backgroundColor = colors[i];
        }

        // Adding random colors to target grid
        for(var j = 0; j<16; j++) {
            var i = Math.floor(Math.random() * 6);
            hardTargetGridTile[j].style.backgroundColor = colors[i];
            // Overwriting the main grid with these colours in random mutually exclusive positions, so that the game is solvable.
            var t = Math.floor(Math.random() * 2);
            var u = 36 - ((2*j) + t);
            hardMainGridTile[u].style.backgroundColor = colors[i];
        }

        // Adding the blank tile at a random position
        var i = Math.floor(Math.random() * 36);
        if((i>=7 && i<=10) || (i>=13 && i<=16) || (i>=19 && i<=22) || (i>=25 && i<=28)) {
            hardMainGridTile[i].style.backgroundColor = "black";  // If blank tile is part of inner grid, make it black.
        }
        else {
            hardMainGridTile[i].style.backgroundColor = "cornflowerblue";  // If blank tile is not a part of inner grid, make it corn flower blue.
        }
        blank = i;   // Storing position of the blank tile

    }

    t0 = performance.now();  // Storing the current time in t0 to start the timer.
    
}

// Adding a click event to all Main grid tiles using a loop. (For easy mode)
for(var a = 0; a<25; a++) {
    mainGridTile[a].addEventListener('click', easySwitchTiles);
}

    function easySwitchTiles(e) {

        // Checking whether the clicked tile is to the right of blank tile
        if((blank+1)%5 != 0 && blank != -1) {  // Checking whether blank tile isn't a part of the rightmost column. We are also checking for -1 to make sure the game hasn't ended.
            if(e.target == mainGridTile[blank+1]) {
                switchAudio.play();
                var x = e.target.style.backgroundColor;
                if((blank+1>=6 && blank+1<=8) || (blank+1>=11 && blank+1<=13) || (blank+1>=16 && blank+1<=18)) {
                    mainGridTile[blank+1].style.backgroundColor = "black";
                }
                else {
                    mainGridTile[blank+1].style.backgroundColor = "cornflowerblue";
                }
                mainGridTile[blank].style.backgroundColor = x;
                blank++;
                moves++;
            }
        }

        // Checking whether the clicked tile is to the left of blank tile
        if((blank-1)%5 != 4) {  // Checking whether blank tile isn't a part of leftmost column. If the game is over, blank = -1 and it won't satisfy the condition anyway.
            if(e.target == mainGridTile[blank-1]) {
                switchAudio.play();
                var x = e.target.style.backgroundColor;
                if((blank-1>=6 && blank-1<=8) || (blank-1>=11 && blank-1<=13) || (blank-1>=16 && blank-1<=18)) {
                    mainGridTile[blank-1].style.backgroundColor = "black";
                }
                else {
                    mainGridTile[blank-1].style.backgroundColor = "cornflowerblue";
                }
                mainGridTile[blank].style.backgroundColor = x;
                blank--;
                moves++;
            }
        }

        // Checking whether the clicked tile is below the blank tile
        if(blank+5<=24 && blank != -1) {  // Checking whether blank tile is not in the bottom row. Checking for -1 to make sure game isn't over.
            if(e.target == mainGridTile[blank+5]) {
                switchAudio.play();
                var x = e.target.style.backgroundColor;
                if((blank+5>=6 && blank+5<=8) || (blank+5>=11 && blank+5<=13) || (blank+5>=16 && blank+5<=18)) {
                    mainGridTile[blank+5].style.backgroundColor = "black";
                }
                else {
                    mainGridTile[blank+5].style.backgroundColor = "cornflowerblue";
                }
                mainGridTile[blank].style.backgroundColor = x;
                blank += 5;
                moves++;
            }
        }

        // Checking whether clicked tile is above the blank tile. 
        if(blank-5>=0) {  // Checking whether blank tile is not in the top row. If game is over, blank = -1, and it won't satisfy the condition anyway.
            if(e.target == mainGridTile[blank-5]) {
                switchAudio.play();
                var x = e.target.style.backgroundColor;
                if((blank-5>=6 && blank-5<=8) || (blank-5>=11 && blank-5<=13) || (blank-5>=16 && blank-5<=18)) {
                    mainGridTile[blank-5].style.backgroundColor = "black";
                }
                else {
                    mainGridTile[blank-5].style.backgroundColor = "cornflowerblue";
                }
                mainGridTile[blank].style.backgroundColor = x;
                blank -= 5;
                moves++;
            }
        }

        // In this block we will check whether the target grid has been matched.
        var flag = true;
        for(var j = 0; j<9; j++) {
            if(targetGridTile[j].style.backgroundColor != innerGridTile[j].style.backgroundColor) {
                flag = false;
                break;
            }
        }

        // This if block contains actions to be performed if the target grid is matched.
        if(flag) {
            if(blank != -1) {  // This is to make sure that it doesn't run again if you click a tile after the game is over.
                var t1 = performance.now();
                victoryAudio.play();
                blank = -1;
                heading.textContent = "YOU WIN !";
                statusText.textContent = "Moves Taken = " +moves;
                resetBtn.textContent = "START NEW GAME";
                const s = (Math.round((t1-t0)/1000));   // declaring this as a constant so that value of time taken doesn't change when you click on tiles without starting new game.
                timeText.textContent = "Time Taken = " +s+" seconds";
            }
        }
    }

    easyBtn.addEventListener('click', easyBtnAction);

    function easyBtnAction(e) {
        if(difficulty == 0) {
            return;
        }
        resetAudio.play();
        difficulty = 0;
        resetAction();
    }

    hardBtn.addEventListener('click', hardBtnAction);

    function hardBtnAction(e) {
        if(difficulty == 1) {
            return;
        }
        resetAudio.play();
        difficulty = 1;
        resetAction();
    }
