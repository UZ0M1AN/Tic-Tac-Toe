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
        gameboardArr: [
            ['', '', ''],
            ['', '', ''],
            ['', '', ''],
        ],
    }
})();

const eventsModule = (function() {
    // Private Methods
    function _changeClass(elem, func, cssClass) {
        elem.classList[func](cssClass);
    }

    function _threeInARow() {
        const arr = varModule.gameboardArr;
        const [c1, c2, c3] = [arr[0][0], arr[0][1], arr[0][2]];
        const [c4, c5, c6] = [arr[1][0], arr[1][1], arr[1][2]];
        const [c7, c8, c9] = [arr[2][0], arr[2][1], arr[2][2]];

        return (
            _equal(c1, c2, c3) ? ['0-0', '0-1', '0-2']
            : _equal(c4, c5, c6) ? ['1-0', '1-1', '1-2']
            : _equal(c7, c8, c9) ? ['2-0', '2-1', '2-2']
            : _equal(c1, c4, c7) ? ['0-0', '1-0', '2-0']
            : _equal(c2, c5, c8) ? ['0-1', '1-1', '2-1']
            : _equal(c3, c6, c9) ? ['0-2', '1-2', '2-2']
            : _equal(c1, c5, c9) ? ['0-0', '1-1', '2-2']
            : _equal(c3, c5, c7) ? ['0-2', '1-1', '2-0']
            : false
        );
                
    }
    
    function _equal(a, b, c) {
        return (a == 'x' && b == 'x' && c == 'x') || (a == 'o' && b == 'o' && c == 'o');
    }

    function _winGame(datacells = _threeInARow()) {
        if (!datacells) return;

        // Style the winning row
        const cells = [...elemModule.gameCells].filter(gamecell => datacells.includes(gamecell.dataset.cell));
        cells.forEach(cell => {
            _changeClass(cell, 'add', 'win');
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
        const player1 = elemModule.p1.value || 'Uzoma';
        const player2 = elemModule.p2.className == 'no-display' ? 'Robot' : elemModule.p2.value || 'Mary';   
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
        // Hide Player 2 input field
        _changeClass(elemModule.p2, 'toggle', 'no-display');

        // Toggle text content of Players' labels and Game Mode
        if (elemModule.p2Label.textContent) {
            elemModule.p2Label.textContent = '';
            elemModule.p1Label.textContent = 'Player';
            e.target.textContent = 'Play with Human';
        }
        else {
            elemModule.p2Label.textContent = 'Player 2';
            elemModule.p1Label.textContent = 'Player 1';
            e.target.textContent = 'Play with AI';
        }
    }

    function displayXAndO(e) {   
        if (e.target.textContent) return;

        // Change active player name
        _changeClass(elemModule.p2Name, 'toggle', 'active');
        _changeClass(elemModule.p1Name, 'toggle', 'active');

        // Display X and O in DOM and in gameboardArr
        const i = e.target.dataset.cell;
        
        e.target.textContent = varModule.counter % 2 ? 'o' : 'x';
        varModule.gameboardArr[i[0]][i.slice(-1)] = e.target.textContent;

        // Check for win
        if (_threeInARow()) _winGame();

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
            _changeClass(gameCell, 'remove', 'win');
        })

        // ...and in Array
        varModule.gameboardArr = varModule.gameboardArr.map(x => ['', '', '']);

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
        displayXAndO,
        newGame,
        closeWinnerDisplay,
    }
})();


const DOMModule = (function() {
    elemModule.startBtn.addEventListener('click', eventsModule.startGame);
    elemModule.gameMode.addEventListener('click', eventsModule.changeToAIMode);
    elemModule.newGameBtns.forEach(newGameBtn => newGameBtn.addEventListener('click', eventsModule.newGame));
    elemModule.okBtn.addEventListener('click', eventsModule.closeWinnerDisplay);
})();
