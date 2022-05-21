const tileDisplay = document.querySelector('.tile-container');
const keyboard = document.querySelector('.key-container');
const messageDisplay = document.querySelector('.message-container');

let wordle;
const wordLength = 6;
const rowLength = 6;

const getWordle = () => {
    fetch("http://localhost:8000/word")
        .then(response => response.json())
        .then(json => {
            wordle = json.toUpperCase()
        })
        .catch(err => console.log(err));
};

getWordle();

const keys = [
    'Q',
    'W',
    'E',
    'R',
    'T',
    'Y',
    'U',
    'I',
    'O',
    'P',
    'A',
    'S',
    'D',
    'F',
    'G',
    'H',
    'J',
    'K',
    'L',
    '<<',
    'Z',
    'X',
    'C',
    'V',
    'B',
    'N',
    'M',
    'ENTER',
];

const guessRows = [
    ['', '', '', '', '', ''],
    ['', '', '', '', '', ''],
    ['', '', '', '', '', ''],
    ['', '', '', '', '', ''],
    ['', '', '', '', '', ''],
    ['', '', '', '', '', ''],
];

let currentRow = 0;
let currentTile = 0;
let isGameOver = false;

guessRows.forEach((guessRow, guessRowIndex) => {
    const rowElement = document.createElement('div');
    rowElement.setAttribute('id', 'guessRow-' + guessRowIndex);
    guessRow.forEach((guess, guessIndex) => {
        const tileElement = document.createElement('div');
        tileElement.setAttribute('id', 'guessRow-' + guessRowIndex + '-tile-' + guessIndex)
        tileElement.classList.add("tile");
        rowElement.append(tileElement);
    })
    tileDisplay.append(rowElement);
});

keys.forEach(key => {
   const buttonElement = document.createElement('button');
   buttonElement.textContent = key;
   buttonElement.setAttribute('id', key)
   buttonElement.addEventListener('click', () => handleClick(key))
   keyboard.append(buttonElement);
});

const handleClick = (letter) => {
    // console.log('clicked', letter);
    if (!isGameOver) {
        if (letter === '<<') {
            deleteLetter();
            console.log('guessRows', guessRows)
            return;
        }
        if (letter === "ENTER" ) {
            checkRow();
            return;
        }
        addLetter(letter);
        console.log('guessRows', guessRows);
    }
}

const addLetter = (letter) => {
    if (currentTile < wordLength && currentRow < rowLength) {
    const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile);
    tile.textContent = letter;
    guessRows[currentRow][currentTile] = letter;
    tile.setAttribute('data', letter);
    currentTile++;
    console.log(guessRows);
    }
}

const deleteLetter = () => {
    if (currentTile > 0) {
        currentTile--;
        const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile);
        tile.textContent = '';
        guessRows[currentRow][currentTile] = '';
        tile.setAttribute('data', '');
    }
}

const checkRow = () => {
    const guess = guessRows[currentRow].join('');
    console.log(guess);

    if (currentTile > wordLength - 1) {
        fetch(`http://localhost:8000/check/?word=${guess}`) 
            .then(response => response.json())
            .then(json => {
                if (json == 462) {
                    showMessage('Enter a real word gurrrl');
                    return;
                } else {
                    // console.log('guess is: ' + guess, 'wordle is ' + wordle);

                    flipTile();
                    if (wordle == guess) {
                        showMessage('DOPE, you did it!');
                        isGameOver = true;
                        return;
                    } else {
                        if (currentRow >= rowLength - 1) {
                            isGameOver = true;
                            showMessage('Game Over');
                            return;
                        } 
                        if (currentRow <= rowLength) {
                            currentRow++;
                            currentTile = 0;
                        }
                    }
                }
            })
            .catch(err => console.log(err))
    }
}

const showMessage = (message) => {
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    messageDisplay.append(messageElement);
    setTimeout(() => messageDisplay.removeChild(messageElement), 3000);
}

const addColorToKey = (keyLetter, color) => {
    const key = document.getElementById(keyLetter);
    key.classList.add(color);
};


const flipTile = () => {
    const rowTiles = document.querySelector('#guessRow-' + currentRow).childNodes;
    let checkWorldle = wordle;
    const guess = [];

    rowTiles.forEach(tile => {
        guess.push({ letter: tile.getAttribute('data'), color: 'grey-overlay'})
    })

    guess.forEach((guess, index) => {
        if (guess.letter == wordle[index]) {
            guess.color = 'green-overlay';
            checkWorldle = checkWorldle.replace(guess.letter, '');
        }
    })

    guess.forEach(guess => {
        if(checkWorldle.includes(guess.letter)) {
            guess.color = 'yellow-overlay';
            checkWorldle = checkWorldle.replace(guess.letter, '');
        }
    })
    console.log('guess', guess)

    rowTiles.forEach((tile, index) => {
        setTimeout(() => {
            tile.classList.add('flip');
            tile.classList.add(guess[index].color)
            addColorToKey(guess[index].letter, guess[index].color)
        }, 500 * index)
    })
}

