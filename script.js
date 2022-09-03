console.log('uzomian...');

const log = (...a) => console.log(...a);

////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////// FACTORY FUNCTIONS ////////////////////////////////////////////////////////
function eventFactory() {
    
}

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
        ai: document.querySelector('.ai'),
        gameboard: document.querySelector('.gameboard'),
        gameCells: document.querySelectorAll('td'),
        p1Name: document.querySelector('.p1-name'),
        p2Name: document.querySelector('.p2-name'),
        newGameDiv: document.querySelector('.new-game'),
        newGameBtn: document.querySelector('.btn--new'),   
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

    function _winPattern() {
        // const arr = varModule.gameboardArr;
        // const [c1, c2, c3] = [arr[0][0], arr[0][1], arr[0][2]];
        // const [c4, c5, c6] = [arr[1][0], arr[1][1], arr[1][2]];
        // const [c7, c8, c9] = [arr[2][0], arr[2][1], arr[2][2]];
        // let [x, o] = [{}, {}]; 

        // for (let i = 0; i < arr.length; i++)
        //     for (let j = 0; j < arr[i].length; j++) {
        //         if (arr[i][j] == 'x') x[i] = j;
        //         if (arr[i][j] == 'o') o[i] = j;
        //     }
        
        // const keysX = Object.keys(x);
        // const diffX = Object.keys(x).map((key, i, arr) => +arr[i+1] - +key)
        // return diffX
        
        // return [_equality(c1,c2,c3), _equality(c4,c5,c6), _equality(c7,c8,c9), _equality(c1,c4,c7), _equality(c2,c5,c8), _equality(c3,c6,c9), _equality(c1,c5,c9), _equality(c3,c5,c7)].find(Boolean);
    }

    // function _equality(...val) {
    //     const result = val.every(v => v == 'x') || val.every(v => v == 'o');
    //     return result ? val : false;
    // }

    // Public Methods
    function startGame() {
        const player1 = elemModule.p1.value || 'Uzoma';
        const player2 = elemModule.p2.className == 'no-display' ? 'Robot' : elemModule.p2.value || 'Mary';   
        elemModule.p1Name.textContent = player1;
        elemModule.p2Name.textContent = player2;

        _changeClass(elemModule.gameboard, 'remove', 'no-display');
        _changeClass(elemModule.newGameDiv, 'remove', 'no-display');
        _changeClass(elemModule.form, 'add', 'no-display');

        // Clear the input fields
        elemModule.p1.value = elemModule.p2.value = '';
    }

    function changeForm(e) {
        _changeClass(elemModule.p2, 'toggle', 'no-display');

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
        // log(varModule.gameboardArr);
        // log(_winPattern())

        // Update counter
        varModule.counter++;
    }

    function newGame() {
        _changeClass(elemModule.gameboard, 'add', 'no-display');
        _changeClass(elemModule.newGameDiv, 'add', 'no-display');
        _changeClass(elemModule.form, 'remove', 'no-display');

        // Clear Gamebaord in DOM...
        elemModule.gameCells.forEach(gameCell => {
            gameCell.textContent = '';
        })

        // ...and in Array
        varModule.gameboardArr = varModule.gameboardArr.map(x => ['', '', '']);

        // Reset counter
        varModule.counter = 0;
    }


    return {
        startGame,
        changeForm,
        displayXAndO,
        newGame,
    }
})();


const DOMModule = (function() {
    elemModule.startBtn.addEventListener('click', eventsModule.startGame);
    elemModule.ai.addEventListener('click', eventsModule.changeForm);
    elemModule.newGameBtn.addEventListener('click', eventsModule.newGame);
    
    elemModule.gameCells.forEach(gameCell => {
        gameCell.addEventListener('click', eventsModule.displayXAndO);
    })
})();
