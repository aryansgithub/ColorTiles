var targetGridTile = document.querySelectorAll('.targetGridTile');
var mainGridTile = document.querySelectorAll('.mainGridTile');
var innerGridTile = document.querySelectorAll('#innerGrid');
var resetBtn = document.querySelector('#resetBtn');
var statusText = document.querySelector('.status');
var timeText = document.querySelector('.time');
var heading = document.querySelector('#heading');

var colors = ["red", "purple", "green", "yellow", "orange", "pink"];
var blank = -1;
var moves = 0;
var t0 = 0;
var t1 = 0;

resetBtn.addEventListener('click', resetAction);

function resetAction(e) {
    moves = 0;
    e.target.textContent = "RESET";
    heading.textContent = "COLOR TILES";
    statusText.textContent = "Try to match the 3x3 grid.";
    timeText.textContent = "";

    for(var j = 0; j<9; j++) {
        innerGridTile[j].style.borderColor = "black";
    }

    for(var j = 0; j<25; j++){
        var i = Math.floor(Math.random() * 6);
        mainGridTile[j].style.backgroundColor = colors[i];
    }

    for(var j = 0; j<9; j++) {
        var i = Math.floor(Math.random() * 6);
        targetGridTile[j].style.backgroundColor = colors[i];
        // Now we are going to overwrite the main grid with these colours in random mutually exclusive positions, so that the game is solvable.
        var t = Math.floor(Math.random() * 2);
        var u = 24 - ((2*j) + t);
        mainGridTile[u].style.backgroundColor = colors[i];
    }

    var i = Math.floor(Math.random() * 25);
    if((i>=6 && i<=8) || (i>=11 && i<=13) || (i>=16 && i<=18)) {
        mainGridTile[i].style.backgroundColor = "black";
    }
    else {
        mainGridTile[i].style.backgroundColor = "cornflowerblue";
    }
    blank = i;
    t0 = performance.now();
}

for(var a = 0; a<25; a++) {
    mainGridTile[a].addEventListener('click', switchTiles);
}

    function switchTiles(e) {
        if((blank+1)%5 != 0 && blank != -1) {
            if(e.target == mainGridTile[blank+1]) {
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

        if((blank-1)%5 != 4) {
            if(e.target == mainGridTile[blank-1]) {
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

        if(blank+5<=24 && blank != -1) {
            if(e.target == mainGridTile[blank+5]) {
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

        if(blank-5>=0) {
            if(e.target == mainGridTile[blank-5]) {
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

        var flag = true;
        for(var j = 0; j<9; j++) {
            if(targetGridTile[j].style.backgroundColor != innerGridTile[j].style.backgroundColor) {
                flag = false;
                break;
            }
        }
        if(flag) {
            var t1 = performance.now();
            blank = -1;
            heading.textContent = "YOU WIN !";
            statusText.textContent = "Moves Taken = " +moves;
            resetBtn.textContent = "START NEW GAME";
            var s = (Math.round((t1-t0)/1000));
            timeText.textContent = "Time Taken = " +s+" seconds";
        }
    }
