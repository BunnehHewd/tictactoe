const body = document.getElementById("body")
const lines = document.querySelectorAll(".line"); 
const PVCBTN = document.querySelector(".PVC");
const PVPBTN = document.querySelector(".PVP");
const roseBTN = document.querySelector(".rose");
const heartBTN = document.querySelector(".heart");
const playBTN = document.querySelector(".play");
const tile = document.querySelectorAll(".tile");
const vsDIV = document.querySelector(".playerSelectBTN");
const iconDIV = document.querySelector(".iconSelectBTN");
const playDIV = document.querySelector(".playStartBTN");
const resetBTN = document.querySelector(".reset");
const container = document.querySelector(".gameboard");
const winLine = document.createElement("div");
winLine.classList.add("winLine");
const burger = document.querySelector(".menu");
const scoreMenu = document.querySelector(".scoreboardContainer");
const collapse = document.querySelector(".collapse");
const closeWinBanner = document.querySelector(".egClose");
const endGameBanner = document.querySelector(".endGameBanner");

let PVPON = false;
let playerIcon = "";
let currentTurn = "";
let PlayerTurn = false; // Player 1 in PVP; Heart in PVP
let canClick = false;
let currentTurnCount = 0;
let pulseActive = false;
let gameOver = false;

let heartScore = 0;
let roseScore = 0;

let board = [
    ["", "" , ""],
    ["", "" , ""],
    ["", "" , ""]
];

/* PRE-GAME */

document.onload = () => {
    iconDIV.classList.add("DIVLoadTrans");
    playDIV.classList.add("DIVLoadTrans");
}

PVCBTN.addEventListener("click", () => {
    PVCBTN.classList.remove("notSelectedBTN");
    PVPBTN.classList.remove("selectedBTN");
    PVCBTN.classList.add("selectedBTN");
    PVPBTN.classList.add("notSelectedBTN");
    iconDIV.style.height = "4.5rem";
    roseBTN.style.display = "flex";
    heartBTN.style.display = "flex";
    PVPON = false;
});

PVPBTN.addEventListener("click", () => {
    PVPBTN.classList.remove("notSelectedBTN");
    PVCBTN.classList.remove("selectedBTN");
    PVPBTN.classList.add("selectedBTN");
    PVCBTN.classList.add("notSelectedBTN");
    iconDIV.style.height = "0";
    roseBTN.style.display = "none";
    heartBTN.style.display = "none";
    PVPON = true;
    showPlay();
})

roseBTN.addEventListener("click", () => {
    heartBTN.classList.remove("selectedBTN");
    roseBTN.classList.add("selectedBTN");
    heartBTN.classList.add("notSelectedBTN");
    roseBTN.classList.remove("notSelectedBTN");
    playerIcon = "Rose";
    showPlay();
});

heartBTN.addEventListener("click", () => {
    roseBTN.classList.remove("selectedBTN");
    heartBTN.classList.add("selectedBTN");
    roseBTN.classList.add("notSelectedBTN");
    heartBTN.classList.remove("notSelectedBTN");
    playerIcon = "Heart";
    showPlay();
});

function showPlay() {
    playDIV.style.height = "4.5rem";
    playBTN.style.display = "flex";
};

/* GAME */

playBTN.addEventListener("click", () => {
    playBTN.classList.add("selectedBTN");
    playDIV.classList.add("DIVUnloadTrans");
    vsDIV.classList.add("DIVUnloadTrans");
    vsDIV.style.height = 0;
    playDIV.style.height = 0;
    disableBTNS();

    if (!PVPON) {
        iconDIV.classList.add("DIVUnloadTrans");
        iconDIV.style.height = 0;
    } else {
        playerIcon = "Heart";
    }
        drawLines();
        populatePlayerTurnDiv();

        setTimeout(function() {
           createTileEvents(); 
           playGame();
        }, 5000);

        

});

function disableBTNS() {
    PVPBTN.disabled = true;
    PVCBTN.disabled = true;
    roseBTN.disabled = true;
    heartBTN.disabled = true;
    playBTN.disabled = true;
}

function drawLines() {
    lines.forEach((line) => {
       line.classList.remove("lineHidden"); 
    });
}

function populatePlayerTurnDiv() { // Initial creation
    const turn = document.createElement("div");
    const turnIcon = document.createElement("img");
    turnIcon.classList.add("turnIcon");

    const rand = getRandomNumber(1,2);

    if (rand == 1) {
        turnIcon.src = "svg/heart.svg";
        turnIcon.dataset.icon = "heart";
        currentTurn = "Heart";
    } else {
        turnIcon.src = "svg/rose.svg";
        turnIcon.dataset.icon = "rose";
        currentTurn = "Rose";
    }

    turn.appendChild(turnIcon);
    body.insertBefore(turn, vsDIV);
    turn.classList.add("playerTurnIconHidden");

    setTimeout(function() {
       turn.classList.add("playerTurnIcon"); 
      }, 1000);
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max-min + 1) + min);
}

function ChangePlayerTurnDiv() {
    const turnIcon = document.querySelector(".turnIcon");
    const state = turnIcon.getAttribute("data-icon");
    
    if (state == "heart") {
        turnIcon.src = "svg/rose.svg";
        turnIcon.setAttribute("data-icon", "rose");
    } else {
        turnIcon.src = "svg/heart.svg";   
        turnIcon.setAttribute("data-icon", "heart");
    }
}

function playGame() {
    if (playerIcon == currentTurn) {
        canClick = true;
        PlayerTurn = true;
    } 

    if (!PVPON) {
        if (!PlayerTurn) {
           CompAI(); 
        }    
    }
}

function CompAI() {

    for (var i = 0; i < 3; i++) { // Offensive
        for (var j = 0; j < 3; j++) {
            if (board[i][j] == "") {
                if (AggrOffMove(i, j, 2) != -1) {
                    return;
                }
            }
        }
    }

    for (var i = 0; i < 3; i++) { // Defensive
        for (var j = 0; j < 3; j++) {
            if (board[i][j] == "") {
                if (AggrOffMove(i, j, 1) != -1) {
                    return;
                }
            }
        }
    }

    if (board[1][1] == "") { // Center
        const tileE = document.getElementById("11");
        iconClick(tileE);
        return;
    }

    const rand = getRandomNumber(1,4);

    if (rand == 1) {
        if (board[0][0] == "") { // Upper Left
            const tileE = document.getElementById("00");
            iconClick(tileE);
            return;
        }
    }

    if (rand == 2) {
        if (board[0][2] == "") { // Upper Right
            const tileE = document.getElementById("02");
            iconClick(tileE);
            return;
        }
    }

    if (rand == 3) {
        if (board[2][0] == "") { // Lower Left
            const tileE = document.getElementById("20");
            iconClick(tileE);
            return;
        }
    }

    if (rand == 4) {
        if (board[2][2] == "") { // Lower Right
            const tileE = document.getElementById("22");
            iconClick(tileE);
            return;
        }
    }
    
    for (var i = 0; i < 3; i++) { // Failsafe
        for (var j = 0; j < 3; j++) {
            if (board[i][j] == "") {
                let found = x.toString() + y.toString();
                const tileE = document.getElementById(found);
                iconClick(tileE);
                return;
            }
        }
    }
    resetPulseTimer();
    TieBanner();
}

function AggrOffMove(x, y, c) {
    let tileAggr = -1;
    let found = "";

    // Check Diags     
        if ((x == 0 && y == 0) ||
            (x == 2 && y == 2) || 
            (x == 1 && y == 1)) {
                if ((board[0][0] == c && board[1][1] == c) ||
                    (board[0][0] == c && board[2][2] == c) ||
                    (board[1][1] == c && board[2][2] == c)) {
                        found = x.toString() + y.toString();
                        tileAggr = document.getElementById(found);
                        iconClick(tileAggr);
                        return (1);
                    }
                }

        if ((x == 0 && y == 2) || 
            (x == 2 && y == 0) || 
            (x == 1 && y == 1)) {
                if ((board[0][2] == c && board[1][1] == c) ||
                    (board[0][2] == c && board[2][0] == c) ||
                    (board[1][1] == c && board[2][0] == c)) {
                        found = x.toString() + y.toString();
                        tileAggr = document.getElementById(found);
                        iconClick(tileAggr);
                        return (1);
                    }
            }
    

    // Check Horizontals
    if ((board[x][0] == c && board[x][1] == c) ||
        (board[x][0] == c && board[x][2] == c) ||
        (board[x][1] == c && board[x][2] == c)) {
            found = x.toString() + y.toString();
            tileAggr = document.getElementById(found);
            iconClick(tileAggr);
            return (1);
        }

    // Check Verticals
    if ((board[0][y] == c && board[1][y] == c) ||
        (board[0][y] == c && board[2][y] == c) ||
        (board[1][y] == c && board[2][y] == c)) {
            found = x.toString() + y.toString();
            tileAggr = document.getElementById(found);
            iconClick(tileAggr);
            return (1);
        }

    return tileAggr;
}

function whoWon() {
    const heartScoreP = document.querySelector(".hScore");
    const roseScoreP = document.querySelector(".rScore");
    stopPulse();
    gameOver = true;
    removeTileEvents();

    if (PlayerTurn) {
        if (playerIcon == "Heart") {
            showWinBanner("rose");
            roseScore++;
            roseScoreP.innerHTML = roseScore;
        } else {
            showWinBanner("heart");
            heartScore++;
            heartScoreP.innerHTML = heartScore;
        }
    } else {
        if (playerIcon == "Heart") {
            showWinBanner("heart");
            heartScore++;
            heartScoreP.innerHTML = heartScore;
        } else {
            showWinBanner("rose");
            roseScore++;
            roseScoreP.innerHTML = roseScore;
        }
    }
}

function TieBanner() {
    stopPulse();
    gameOver = true;
    removeTileEvents();
    showWinBanner("tie");
}

function showWinBanner(winner) {
    const winBanner = document.querySelector(".winTop");

    while (winBanner.firstChild) {
        winBanner.removeChild(winBanner.firstChild);
    }

    const winImg = document.createElement("img");
    const winsText = document.createElement("span");
    winsText.innerHTML = " wins!";
    winImg.classList.add("winImg");
    if (winner == "rose") {
        winImg.src = "svg/rose.svg";
        winBanner.appendChild(winImg);
    } else if (winner == "heart") {
        winImg.src = "svg/heart.svg";
        winBanner.appendChild(winImg);
    } else {
        winsText.innerHTML = "Tie!";
    }

    winBanner.appendChild(winsText);
    endGameBanner.style.display = "flex";
}

function CheckForWins() {
    
    // Diagonals
    if (board[1][1] != "") {
        // \
        if(board[0][0] == board[1][1] && board[0][0] == board[2][2]) {
            winLine.style.transform = "rotate(45deg)";
            winLine.style.width = "125%";
            winLine.style.height = "5px";
            winLine.style.display = "block";
            container.append(winLine);
            whoWon();
            return;
                // /
        } else if (board[0][2] == board[1][1] && board[0][2] == board[2][0]) {
            winLine.style.transform = "rotate(-45deg)";
            winLine.style.top = "94%";
            winLine.style.width = "125%";
            winLine.style.height = "5px";
            winLine.style.display = "block";
            container.append(winLine);
            whoWon();
            return;
        }
    }

    // Horizontals
    for (var i = 0; i < 3; i++) {
        if (board[i][0] == board [i][1] && board[i][1] == board[i][2] && board[i][2] != "") {
            winLine.style.height = "5px";
            winLine.style.width = "90%";

            if (i == 0) {
                winLine.style.top = "7rem";
            } else if (i == 1) {
                winLine.style.top = "22rem";
            } else {
                winLine.style.top = "37rem";
            }
            winLine.style.display = "block";
            container.append(winLine);
            whoWon();
            return;
        }
    }

    // Verticals
    for (var i = 0; i < 3; i++) {
        if (board[0][i] == board [1][i] && board[1][i] == board[2][i] && board[2][i] != "") {
            winLine.style.height = "90%";
            winLine.style.width = "5px";

            if (i == 0) {
                winLine.style.left = "8rem";
            } else if (i == 1) {
                winLine.style.left = "22rem";
            } else {
                winLine.style.left = "37rem";
            }
            winLine.style.display = "block";
            container.append(winLine);
            whoWon();
            return;
        }
    }
}


/* TILES */

let resetTimerId;
let timeoutIds = [];

const clickE = (e) => {
    if (canClick || PVPON) {
        iconClick(e.target);
        e.target.removeEventListener("click", clickE); 

        resetPulseTimer();
    }
};

function createTileEvents() {
    tile.forEach((tile) => {
        tile.addEventListener("click", clickE);
    
        pulseActive = true; 
    
        tile.style.transitionDelay = "20s";

        removeDelay(tile);

        if (pulseActive) {
            startPulsing(tile);
        }
    });
}

function removeDelay(tile) {
    setTimeout(() => {
        console.log("remove");
        tile.style.transitionDelay = "0s";
    }, 20000);
}

function resetPulseTimer() {
    clearTimeout(resetTimerId);

    resetTimerId = setTimeout(() => {
        pulseActive = true;
        tile.forEach((tile) => {
            if (pulseActive && !gameOver) {
                startPulsing(tile); 
            }
        });
    }, 20000); 
}

function startPulsing(tile) {
    const pulse = () => {
        if (!pulseActive) return; 

        if (tile.children.length == 0) {
            tile.classList.remove("tileInnerOverride");
            tile.classList.add("tileInner");  
        }


        const outer = setTimeout(() => {
            tile.classList.remove("tileInner");

            const inner = setTimeout(pulse, 2000);
            timeoutIds.push(inner); 
        }, 2000); 

        timeoutIds.push(outer);
    };

    pulse(); 
}

function removeTileEvents() {
    tile.forEach((tile) => {
        tile.removeEventListener("click", clickE);
    });
}

function stopPulse() {
    pulseActive = false;

    timeoutIds.forEach((id) => clearTimeout(id));
    timeoutIds = [];

    tile.forEach((tile) => {
        tile.classList.add("tileInnerOverride");
        tile.classList.remove("tileInner");
    });
}


function iconClick(tile) {

    stopPulse();

        const icon = document.createElement("img");
        icon.classList.add("tileIconadded");

        if (!PVPON && !PlayerTurn) {
            tile.removeEventListener("click", clickE);
        }

        if (PlayerTurn) {
            if (playerIcon == "Heart") {
                icon.src= "svg/heart.svg"; 
            } else {
                icon.src = "svg/rose.svg";
            }
            tile.appendChild(icon);
            var number = tile.id;
            alterBoard(number);

            PlayerTurn = false;
            canClick = false;
        } else {
            if (playerIcon == "Heart") {
                icon.src= "svg/rose.svg"; 
            } else {
                icon.src = "svg/heart.svg";
            }
            tile.appendChild(icon);
            var number = tile.id;
            alterBoard(number);

            PlayerTurn = true;
            canClick = true;
    }
        currentTurnCount++;

        if (currentTurnCount >= 5) {
            CheckForWins();

            if (currentTurnCount == 9) {
                TieBanner();
            }
        }

        if (!gameOver) {
            ChangePlayerTurnDiv();

            if (!PVPON && !PlayerTurn) {
                setTimeout(() => {
                CompAI();  
                }, 3000);
            }
        }
}

function alterBoard(tileNumber) {
    const idArray = tileNumber.split("");

    let charInsert = "";
    if (PlayerTurn) {
        charInsert = 1;
    } else {
        charInsert = 2;
    }

    board[idArray[0]][idArray[1]] = charInsert;

    console.log(board);
}

resetBTN.addEventListener("click", () => {
    reset();
});

function reset() {
    board = [
        ["", "" , ""],
        ["", "" , ""],
        ["", "" , ""]
    ];

    removeTileIcons();
    currentTurnCount = 0;
    createTileEvents();
    ChangePlayerTurnDiv();
    gameOver = false;
    winLine.style.display="none";
    winLine.style.top = "5%";
    winLine.style.left= "5%";
    winLine.style.transform = "rotate(0deg)";
}



function removeTileIcons() {
    tile.forEach((tile) => {
        if(tile.children.length > 0) {
           tile.removeChild(tile.childNodes[0]); 
        }
    })
}

burger.addEventListener("click", showScore);

function showScore() {
    scoreMenu.style.display = "flex";
}

collapse.addEventListener("click", hideScore);

function hideScore() {
    scoreMenu.style.display = "none";
}

closeWinBanner.addEventListener("click", closeBanner);

function closeBanner() {
    endGameBanner.style.display = "none";
}

const pAgain = document.querySelector(".pAgain");
pAgain.addEventListener("click", playAgain);
function playAgain() {
    endGameBanner.style.display = "none";
    reset();
}
