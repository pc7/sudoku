/*
 * Grid is a two-dimensional array containing grid square objects.
 * Parallel to this is a DOM table object, with each grid square having an associated td object.
 */

var grid = (function() {

    "use strict";

    // Length of one of the small squares within the grid. A 9x9 grid will contain nine 3x3 squares, so its length is 3.
    var smallSquareLength = 3;

    // Generate grid array and DOM objects.

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
}());
