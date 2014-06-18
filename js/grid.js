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

    for (var i = 0, fullSideLength = Math.pow(smallSquareLength, 2); i < fullSideLength; i++) {

        // Create row.
        gridArray.push([]);

        var trEl = document.createElement('tr');
        fragment.appendChild( trEl );

        for (var j = 0; j < fullSideLength; j++) {

            // Create grid squares within row. The grid square's td object will be appended to the argument tr object.
            gridArray[i].push( createGridSquare( trEl ) );

        }

    }

    tableEl.appendChild(fragment);

}());
