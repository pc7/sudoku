/*
 * Generates a grid square object, and an associated DOM td object. The DOM object is appended to the argument tr object.
 */

var createGridSquare = function(trObject) {

    "use strict";

    // Each grid square has an associated td DOM object.
    // The td object contains a span, which contains the userValue, and a 'select' menu, which contains the selection options.
    // The span and select elements visibility is controlled using CSS.
    var tdObject = document.createElement('td'),
        spanObject = document.createElement('span'),
        selectMenuObject = document.createElement('select');

    tdObject.appendChild(spanObject);
    tdObject.appendChild(selectMenuObject);
    trObject.appendChild(tdObject);

    // Arrays of grid squares that share the same row, column or small square as this square, duplicates removed.
    // Should be 20 squares in total. Will not change once created.
    var sharedSquares;

    // Sets the shared squares to the argument value passed from the grid object, and removes itself on invokation.
    var setSharedSquares = function(squares) {
        sharedSquares = squares;
        delete this.setSharedSquares;
    };

    return {
        setSharedSquares: setSharedSquares,
    };

};
