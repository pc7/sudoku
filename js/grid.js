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



    // >> Generate grid array and DOM objects. Happens once, when the page is loaded.

    var gridArray = [];

    var fragment = document.createDocumentFragment(),
        tableEl = document.querySelector('#sudokuContainer table');

    for (var rowNum = 0, fullSideLength = Math.pow(smallSquareLength, 2); rowNum < fullSideLength; rowNum++) {

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
    for (var rowNum = 0, fullSideLength = Math.pow(smallSquareLength, 2); rowNum < fullSideLength; rowNum++) {

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
                var whetherValueAssigned = gridArray[rowIndex][colIndex].setActualValue();

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


    var newGame = function() {
        generateValues();
    };

    return {
        getSmallSquareLength: getSmallSquareLength,
        newGame: newGame,
    };

}());
