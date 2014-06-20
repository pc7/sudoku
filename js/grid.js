/*
 * Grid is a two-dimensional array containing grid square objects.
 * Parallel to this is a DOM table object, with each grid square having an associated td object.
 */

var grid = (function() {

    "use strict";

    // Length of one of the small squares within the grid. A 9x9 grid will contain nine 3x3 squares, so its length is 3.
    var smallSquareLength = 3;

    var getSmallSquareLength = function() {
        return smallSquareLength;
    };

    var getSideLength = function() { return Math.pow(smallSquareLength, 2) };

    // Number of squares which have their actualValues revealed at the start of the game.
    // Set to a new value when newGame is invoked.
    var numberOfRevealedValues;



    // >> Generate grid array and DOM objects. Happens once, when the page is loaded.

    var gridArray = [];

    var fragment = document.createDocumentFragment(),
        tableEl = document.querySelector('#sudokuContainer table');

    for (var rowNum = 0, fullSideLength = getSideLength(); rowNum < fullSideLength; rowNum++) {

        // Create row.
        gridArray.push([]);

        var trEl = document.createElement('tr');
        fragment.appendChild( trEl );

        for (var colNum = 0; colNum < fullSideLength; colNum++) {

            // Create grid squares within row. The grid square's td object will be appended to the argument tr object.
            gridArray[rowNum].push( createGridSquare(trEl) );

        }

    }

    tableEl.appendChild(fragment);


    // Get shiared squares for each grid square, once all grid squares generated.
    for (var rowNum = 0, fullSideLength = getSideLength(); rowNum < fullSideLength; rowNum++) {

        for (var colNum = 0; colNum < fullSideLength; colNum++) {

            var sharedSquares = [];

            // Add all squares in the same row.
            sharedSquares = gridArray[rowNum].slice(0);

            // Add all squares in the same column.
            for (var k = 0; k < fullSideLength; k++) {
                sharedSquares.push(gridArray[k][colNum]);
            }

            // Add all squares in the same small square.
            // Get the top row and left column of the small square.
            var topRow = Math.floor(rowNum / 3) * smallSquareLength,
                leftCol = Math.floor(colNum / 3) * smallSquareLength;
            for (var x = topRow; x < topRow+smallSquareLength; x++) {

                for (var y = leftCol; y < leftCol+smallSquareLength; y++ ) {
                    sharedSquares.push(gridArray[x][y]);
                }

            }

            // Remove self and duplicates from the sharedSquares array.
            sharedSquares = sharedSquares.filter( function(el) { return el !== gridArray[rowNum][colNum]; } );
            utils.removeDuplicates(sharedSquares);

            gridArray[rowNum][colNum].setSharedSquares(sharedSquares);

        }

    }

    // >> End grid generation.



    // >> Assign values to the grid squares at the start of every new game.

    // Backtrack algorithm. A grid square's value is a dead end if the next square cannot select a valid value.
    // In this case, generate a new value for the previous grid square.
    // A grid square returns 'false' if it cannot assign itself a value, and the previous square must have its value changed.
    // Backtrack example, showing the top two rows:
    // 1 2 3  4 5 6  7 8 9
    // 6 5 4  3 2 1  . . .
    // Here, the next square cannot be assigned a value, as the values 7, 8 and 9 are within the same small square.
    // The square with the value '1' needs to have its value regenerated, as the value '1' is a dead end here.
    // Values 7, 8 and 9 will be tried in that position, but ultimately several squares before it will need to be backtracked.
    var generateValues = function() {

        for (var rowIndex = 0, rLength = gridArray.length; rowIndex < rLength; rowIndex++) {

            for (var colIndex = 0, cLength = gridArray[rowIndex].length; colIndex < cLength; colIndex++ ) {

                // Set actualValue, and store the return value.
                var whetherValueAssigned = gridArray[rowIndex][colIndex].selectActualValue();

                // Backtrack if needed.
                if (whetherValueAssigned === false) {
                    if (colIndex !== 0) {
                        // If the current square is not at the end of its row, jump back to the previous square.
                        colIndex = colIndex - 2;
                    } else {
                        // Else, jump back to the last square on the previous row.
                        colIndex = gridArray[rowIndex].length-1;
                        rowIndex = rowIndex - 2;
                        break;
                    }
                }
            }
        }
    };

    // >> End assign values to squares.


    // Invokes callback for each grid square, with the square as an argument to the callback.
    var allSquares = function(callback) {
        gridArray.forEach( function(el) {
            el.forEach( function(el) { callback(el); } );
        } );
    };

    // Returns a random grid square.
    var getRandomSquare = function() {
        return gridArray[utils.randomInt(gridArray.length)][utils.randomInt(gridArray[0].length)];
    };

    // Set an amount of random squares to have their actualValues revealed. Squares must not have a user value.
    var revealRandomSquares = function(amount) {
        var revealedSquares = 0;
        while (revealedSquares < amount) {
            var randomSquare = getRandomSquare();
            if (!randomSquare.getRevealedStatus() && !randomSquare.hasUserValue()) {
                randomSquare.setAsRevealed();
                revealedSquares++;
            }
        }
    };

    // Invoked at the start of a new game. Invokes reset() on every grid square, removing the old values.
    // Then generates new values for the grid squares, and sets random grid squares to be revealed.
    var newGame = function(revealedValues) {
        numberOfRevealedValues = revealedValues;
        allSquares( function(el) { el.reset(); } );
        generateValues();
        revealRandomSquares(numberOfRevealedValues);
    };

    // Resets the userValue on squares which have a userValue, where the userValue does not equal the actualValue.
    var removeIncorrectUserValues = function() {
        allSquares( function(el) {
            if ( el.hasUserValue() && !el.hasCorrectUserValue() ) {
                el.setUserValue();
            }
        } );
    };

    // Game won if all userValues equal the actualValues on non-revealed squares.
    // Can abandon search when incorrect value found, so more efficient to use loops rather than allSquares().
    var checkForWin = function() {
        for (var i = 0, sideLength = getSideLength(); i < sideLength; i++ ) {
            for (var j = 0; j < sideLength; j++) {
                if (!gridArray[i][j].getRevealedStatus() && !gridArray[i][j].hasCorrectUserValue()) {
                    return false;
                }
            }
        }
        gameController.gameWon();
    };

    return {
        getSmallSquareLength: getSmallSquareLength,
        newGame: newGame,
        removeIncorrectUserValues: removeIncorrectUserValues,
        checkForWin: checkForWin, 
    };

}());
