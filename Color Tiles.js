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
var highScoreInput = document.querySelector('.highScoreInput');
var highScoresDisplay = document.querySelector('.highScoresDisplay');
var multiplayerBtn = document.querySelector('#multiplayerBtn');
var highScoreBtn = document.querySelector('#highScoreBtn');
var clearHighScore = document.querySelector('#clearHighScore');
var form = document.querySelector('#inputForm');
var nameInput = document.querySelector('#name');


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
    highScoresDisplay.style.display = "none";
    highScoreInput.style.display = "none";
    clearHighScore.style.display = "none";
    moves = 0;
    resetBtn.textContent = "RESET";
    heading.textContent = "COLOR TILES";
    timeText.textContent = "";

    gridDisplay();
    generateRandomColors();
    addBlankTile();

    t0 = performance.now();  // Storing the current time in t0 to start the timer.
}

function gridDisplay() {
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
    }

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
    }
}

function generateRandomColors() {
    if(difficulty == 0) {
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
    }

    else {
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
            var u = 35 - ((2*j) + t);
            hardMainGridTile[u].style.backgroundColor = colors[i];
        }
    }
}

function addBlankTile() {
    if(difficulty == 0) {
        var i = Math.floor(Math.random() * 25);
        if((i>=6 && i<=8) || (i>=11 && i<=13) || (i>=16 && i<=18)) {
            mainGridTile[i].style.backgroundColor = "black";  // If blank tile is part of inner grid, make it black.
        }
        else {
            mainGridTile[i].style.backgroundColor = "cornflowerblue";  // If blank tile is not a part of inner grid, make it corn flower blue.
        }
        blank = i;   // Storing position of the blank tile
    }

    else {
        var i = Math.floor(Math.random() * 36);
        if((i>=7 && i<=10) || (i>=13 && i<=16) || (i>=19 && i<=22) || (i>=25 && i<=28)) {
            hardMainGridTile[i].style.backgroundColor = "black";  // If blank tile is part of inner grid, make it black.
        }
        else {
            hardMainGridTile[i].style.backgroundColor = "cornflowerblue";  // If blank tile is not a part of inner grid, make it corn flower blue.
        }
        blank = i;   // Storing position of the blank tile
    }
}

// Adding a click event to all Main grid tiles using a loop. (For easy mode)
for(var a = 0; a<25; a++) {
    mainGridTile[a].addEventListener('click', easySwitchTiles);
}

    function easySwitchTiles(e) {

        // Checking whether the puzzle has already been solved.
        if(blank == -1) {
            return;
        }

        // Checking whether the clicked tile is to the right of blank tile
        if((blank+1)%5 != 0) {  // Checking whether blank tile isn't a part of the rightmost column. We are also checking for -1 to make sure the game hasn't ended.
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
        if(blank+5<=24) {  // Checking whether blank tile is not in the bottom row. Checking for -1 to make sure game isn't over.
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
           win();
           newHighScore();
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

// Adding a click event to all Main grid tiles using a loop. (For hard mode)
for(var a = 0; a<36; a++) {
    hardMainGridTile[a].addEventListener('click', hardSwitchTiles);
}
    
function hardSwitchTiles(e) {

    // Checking whether the puzzle has already been solved.
    if(blank == -1) {
        return;
    }

    // Checking whether the clicked tile is to the right of blank tile
    if((blank+1)%6 != 0) {  // Checking whether blank tile isn't a part of the rightmost column.
        if(e.target == hardMainGridTile[blank+1]) {
            switchAudio.play();
            var x = e.target.style.backgroundColor;
            if((blank+1>=7 && blank+1<=10) || (blank+1>=13 && blank+1<=16) || (blank+1>=19 && blank+1<=22) || (blank+1>=25 && blank+1<=28)) {
                hardMainGridTile[blank+1].style.backgroundColor = "black";
            }
            else {
                hardMainGridTile[blank+1].style.backgroundColor = "cornflowerblue";
            }
            hardMainGridTile[blank].style.backgroundColor = x;
            blank++;
            moves++;
        }
    }

    // Checking whether the clicked tile is to the left of blank tile
    if((blank-1)%6 != 5) {  // Checking whether blank tile isn't a part of leftmost column. 
        if(e.target == hardMainGridTile[blank-1]) {
            switchAudio.play();
            var x = e.target.style.backgroundColor;
            if((blank-1>=7 && blank-1<=10) || (blank-1>=13 && blank-1<=16) || (blank-1>=19 && blank-1<=22) || (blank-1>=25 && blank-1<=28)) {
                hardMainGridTile[blank-1].style.backgroundColor = "black";
            }
            else {
                hardMainGridTile[blank-1].style.backgroundColor = "cornflowerblue";
            }
            hardMainGridTile[blank].style.backgroundColor = x;
            blank--;
            moves++;
        }
    }

    // Checking whether the clicked tile is below the blank tile
    if(blank+6<=35) {  // Checking whether blank tile is not in the bottom row. 
        if(e.target == hardMainGridTile[blank+6]) {
            switchAudio.play();
            var x = e.target.style.backgroundColor;
            if((blank+6>=7 && blank+6<=10) || (blank+6>=13 && blank+6<=16) || (blank+6>=19 && blank+6<=22) || (blank+6>=25 && blank+6<=28)) {
                hardMainGridTile[blank+6].style.backgroundColor = "black";
            }
            else {
                hardMainGridTile[blank+6].style.backgroundColor = "cornflowerblue";
            }
            hardMainGridTile[blank].style.backgroundColor = x;
            blank += 6;
            moves++;
        }
    }

    // Checking whether clicked tile is above the blank tile. 
    if(blank-6>=0) {  // Checking whether blank tile is not in the top row. 
        if(e.target == hardMainGridTile[blank-6]) {
            switchAudio.play();
            var x = e.target.style.backgroundColor;
            if((blank-6>=7 && blank-6<=10) || (blank-6>=13 && blank-6<=16) || (blank-6>=19 && blank-6<=22) || (blank-6>=25 && blank-6<=28)) {
                hardMainGridTile[blank-6].style.backgroundColor = "black";
            }
            else {
                hardMainGridTile[blank-6].style.backgroundColor = "cornflowerblue";
            }
            hardMainGridTile[blank].style.backgroundColor = x;
            blank -= 6;
            moves++;
        }
    }

    // In this block we will check whether the target grid has been matched.
    var flag = true;
    for(var j = 0; j<16; j++) {
        if(hardTargetGridTile[j].style.backgroundColor != hardInnerGridTile[j].style.backgroundColor) {
            flag = false;
            break;
        }
    }

    if(flag) {
        win();
        newHighScore();
    }
    
}

function win() {
    var t1 = performance.now();
    victoryAudio.play();
    blank = -1;
    heading.textContent = "YOU WIN !";
    statusText.textContent = "Moves Taken = " +moves;
    resetBtn.textContent = "START NEW GAME";
    const s = (Math.round((t1-t0)/1000));   // declaring this as a constant so that value of time taken doesn't change when you click on tiles without starting new game.
    timeText.textContent = "Time Taken = " +s+" seconds";
}

function inputName() {
    if(difficulty == 0) {
        mainGrid.style.display = "none";
        targetGrid.style.display = "none";
    }
    else {
        hardMainGrid.style.display = "none";
        hardTargetGrid.style.display = "none";
    }

    highScoreInput.style.display = "block";
}

form.addEventListener('submit', submitName);

    function submitName(e) {
        e.preventDefault();
        localStorage.setItem("moves", moves);
        var str = nameInput.textContent;
        localStorage.setItem("name", str);
        viewHighScore();
    }

function newHighScore() {
    if(localStorage.key(0) == null) {
        localStorage.setItem("moves", moves);
        inputName();
    }
    else {
        var m = localStorage.getItem("moves");
        if(moves < m || m == null) {
            localStorage.setItem("moves", moves);
            inputName();
        }
    }
}

highScoreBtn.addEventListener('click', viewHighScore);

function viewHighScore() {
    if(difficulty == 0) {
        mainGrid.style.display = "none";
        targetGrid.style.display = "none";
    }
    else {
        hardMainGrid.style.display = "none";
        hardTargetGrid.style.display = "none";
    }

    highScoreInput.style.display = "none";
    highScoresDisplay.style.display = "block";
    clearHighScore.style.display = "block";
    if(localStorage.key(0) == null) {
        highScoresDisplay.textContent = "No High Score yet.";
    }
    else {
        var m = localStorage.getItem("moves");
        var nm = localStorage.getItem("name");
        highScoresDisplay.textContent = "High Score = " +m+ " moves by : " +nm;
    }
}

clearHighScore.addEventListener('click', deleteHighScores);

    function deleteHighScores() {
        localStorage.clear();
        highScoresDisplay.textContent = "No High Score yet.";
    }