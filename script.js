console.log('uzomian...');

const log = (...a) => console.log(...a);

////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////// FACTORY FUNCTIONS ////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// MODULE PATTERNS //////////////////////////////////////////////////////
const elemModule = (function () {
    return {
        form: document.querySelector('.form'),
        startBtn: document.querySelector('.btn--start'),
        p1: document.querySelector('#p1'),
        p2: document.querySelector('#p2'),
        p1Label: document.querySelector('.player-1 > label'),
        p2Label: document.querySelector('.player-2 > label'),
        gameMode: document.querySelector('.gamemode'),
        starter: document.querySelector('.starter'),
        gameboard: document.querySelector('.gameboard'),
        gameCells: document.querySelectorAll('td'),
        p1Name: document.querySelector('.p1-name'),
        p2Name: document.querySelector('.p2-name'),
        newGameDiv: document.querySelector('.new-game'),
        newGameBtns: document.querySelectorAll('.btn--new'),   
        winnerDisplay: document.querySelector('.overlay'),
        okBtn: document.querySelector('.btn--ok'),
        winner: document.querySelector('.winner'),
        trophyIcon: document.querySelector('.trophy'),
    }
})();

const varModule = (function() {
    return {
        counter: 0,
        gameboardArr: [0, 1, 2, 3, 4, 5, 6, 7, 8],
        PLAY_AI: 'Play with AI',
        PLAY_HUMAN: 'Play with Human',
        START_HUMAN: 'You start',
        START_AI: 'Robot starts',
        robotStarts: false,
    }
})();

const eventsModule = (function() {
    // Private Methods

    function _changeClass(elem, func, cssClass) {
        elem.classList[func](cssClass);
    }

    function _threeInARow() {
        const a = varModule.gameboardArr;

        return (
                    _equal(a[0], a[1], a[2]) ? [0, 1, 2].map(String)
                :   _equal(a[3], a[4], a[5]) ? [3, 4, 5].map(String)
                :   _equal(a[6], a[7], a[8]) ? [6, 7, 8].map(String)
                :   _equal(a[0], a[3], a[6]) ? [0, 3, 6].map(String)
                :   _equal(a[1], a[4], a[7]) ? [1, 4, 7].map(String)
                :   _equal(a[2], a[5], a[8]) ? [2, 5, 8].map(String)
                :   _equal(a[0], a[4], a[8]) ? [0, 4, 8].map(String)
                :   _equal(a[2], a[4], a[6]) ? [2, 4, 6].map(String)
                :   false
        );
    }
    
    function _equal(a, b, c) {
        return (a == 'x' && b == 'x' && c == 'x') || (a == 'o' && b == 'o' && c == 'o') ? [a,b,c].map(String) : false;
    }

    function _winGame(datacells = _threeInARow()) {
        if (!datacells) return;

        // Style the winning row
        const cells = [...elemModule.gameCells].filter(gamecell => datacells.includes(gamecell.dataset.cell));     
        cells.forEach(cell => {
            _changeClass(cell, 'add', `win-${elemModule.p1Name.className.includes('active') ? 'o' : 'x'}`);
        })

        // Display Winner 
        _changeClass(elemModule.winnerDisplay, 'remove', 'no-display');
        elemModule.winner.textContent = `${elemModule[elemModule.p1Name.className.includes('active') ? 'p2Name' : 'p1Name'].textContent} wins!`;
        elemModule.trophyIcon.innerHTML = '<i class="fa-solid fa-trophy"></i>';

        // Stop Game
        elemModule.gameCells.forEach(gameCell => {
            gameCell.removeEventListener('click', eventsModule.displayXAndO);
        })
    }

    function _drawGame() {
        // Display Draw
        _changeClass(elemModule.winnerDisplay, 'remove', 'no-display');
        elemModule.winner.textContent = 'It\'s a tie!';
        elemModule.trophyIcon.innerHTML = '<i class="fa-regular fa-handshake"></i>';
    }

    //////////////////////////////////////


    // Public Methods

    function startGame() {
        // Add click event handler to game cells
        elemModule.gameCells.forEach(gameCell => {
            gameCell.addEventListener('click', eventsModule.displayXAndO);
        })

        // Set player names on gameboard
        let player1, player2;

        player1 = elemModule.p1.value || 'Uzoma';
        player2 = elemModule.p2.className == 'no-display' ? 'Robot' : elemModule.p2.value || 'Mary';  

        // If in AI Mode and AI starts
        if (elemModule.p2.className == 'no-display' && varModule.robotStarts) {
            player2 = player1;
            player1 = 'Robot';
        }
        
        elemModule.p1Name.textContent = player1;
        elemModule.p2Name.textContent = player2;

        // Display gameboard and 'New Game' button, hide input fields
        _changeClass(elemModule.gameboard, 'remove', 'no-display');
        _changeClass(elemModule.newGameDiv, 'remove', 'no-display');
        _changeClass(elemModule.form, 'add', 'no-display');

        // Clear the input fields
        elemModule.p1.value = elemModule.p2.value = '';
    }

    function changeToAIMode(e) {
        // Toggle Player 2 input field and starter span
        _changeClass(elemModule.p2, 'toggle', 'no-display');
        _changeClass(elemModule.starter, 'toggle', 'no-display');

        // Toggle text content of Players' labels and Game Mode
        if (elemModule.p2Label.textContent) {
            elemModule.p2Label.textContent = '';
            elemModule.p1Label.textContent = 'Player';
            e.target.textContent = varModule.PLAY_HUMAN;
        }
        else {
            elemModule.p2Label.textContent = 'Player 2';
            elemModule.p1Label.textContent = 'Player 1';
            e.target.textContent = varModule.PLAY_AI;
        }
    }

    function startFirstOrSecond(e) {
        // Toggle text content of starter span
        e.target.textContent = e.target.textContent == varModule.START_AI ? varModule.START_HUMAN : varModule.START_AI;

        // Set robotStarts to true if robot starts
        varModule.robotStarts = e.target.textContent == varModule.START_AI;
    }

    function displayXAndO(e) {   
        if (e.target.textContent) return;

        // Change active player name
        _changeClass(elemModule.p2Name, 'toggle', 'active');
        _changeClass(elemModule.p1Name, 'toggle', 'active');

        // Display X and O in DOM and in gameboardArr
        const i = e.target.dataset.cell;
        
        e.target.textContent = varModule.counter % 2 ? 'o' : 'x';
        varModule.gameboardArr[i] = e.target.textContent;

        // Check for win
        if (_threeInARow()) return _winGame();

        // Check for tie
        if ([...elemModule.gameCells].every(gamecell => gamecell.textContent != '')) _drawGame();

        // Update counter
        varModule.counter++;
    }

    function newGame() {
        // Close winner display if it's open
        closeWinnerDisplay()

        // Display form and hide gameboard and new game button
        _changeClass(elemModule.gameboard, 'add', 'no-display');
        _changeClass(elemModule.newGameDiv, 'add', 'no-display');
        _changeClass(elemModule.form, 'remove', 'no-display');

        // Clear Gamebaord in DOM...
        elemModule.gameCells.forEach(gameCell => {
            gameCell.textContent = '';
            _changeClass(gameCell, 'remove', 'win-x');
            _changeClass(gameCell, 'remove', 'win-o');
        })

        // ...and in Array
        varModule.gameboardArr = [0, 1, 2, 3, 4, 5, 6, 7, 8];

        // Make Player 1 the active player
        _changeClass(elemModule.p2Name, 'remove', 'active');
        _changeClass(elemModule.p1Name, 'add', 'active');

        // Reset counter
        varModule.counter = 0;
    }

    function closeWinnerDisplay() {
        _changeClass(elemModule.winnerDisplay, 'add', 'no-display');
    }


    return {
        startGame,
        changeToAIMode,
        startFirstOrSecond,
        displayXAndO,
        newGame,
        closeWinnerDisplay,
    }
})();


const DOMModule = (function() {
    elemModule.startBtn.addEventListener('click', eventsModule.startGame);
    elemModule.gameMode.addEventListener('click', eventsModule.changeToAIMode);
    elemModule.starter.addEventListener('click', eventsModule.startFirstOrSecond);
    elemModule.newGameBtns.forEach(newGameBtn => newGameBtn.addEventListener('click', eventsModule.newGame));
    elemModule.okBtn.addEventListener('click', eventsModule.closeWinnerDisplay);
})();
