/*
 * Generates a grid square object, and an associated DOM td object. The DOM object is appended to the argument tr object.
 */

var createGridSquare = function(trObject) {

    "use strict";

    // >> Generating the grid square. Happens once, when grid square instantiated.

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

    // >> End generating the grid square.



    // >> Selecting the actualValue. Happens when a new game is started.

    // Bug in Chrome where grid generation fails around 1 in 25 times. Doesn't happen at all in Firefox.

    // The 1-9 integer that is the value of the square for the duration of game. Starts as null.
    // The user tries to guess this value. The inputted userValue may be different to the actualValue.
    var actualValue = null;

    var getActualValue = function() {
        return actualValue;
    };

    // Returns an array of the actual values of the square's sharedSquares. Duplicates and null removed.
    var getSharedSquaresActualValues = function() {
        var values = sharedSquares.map( function(el) { return el.getActualValue() } );
        values = values.filter( function(el) { return el !== null } );
        utils.removeDuplicates(values);
        return values;
    };

    // Returns an array of all possible integers that are not taken as the sharedSquares actualValues or userValues.
    // So it basically returns [1,2,3,4,5,6,7,8,9] minus the values taken by the sharedSquares.
    // Used to compute possible values for the possibleActualValues array, and for the userValue options in the 'select' element.
    var computePossibleValues = function(sharedSquaresValues) {
        var allValues = [];
        for (var i = 1; i <= Math.pow(grid.getSmallSquareLength(), 2); i++) {
            allValues.push(i);
        };
        return utils.diff(allValues, sharedSquaresValues);
    };

    // Randomly selects a new actualValue from the possible options. Invokation is dealt with by the grid object.
    // Generates new values at the start of a new game.
    var setActualValue = (function() {

        // Array of the possible actualValues that the square can take.
        // These are the values not taken by sharedSquares, and not removed due to being dead ends in grid generation.
        var possibleActualValues;

        return function() {

            console.log('setActualValue() invoked');

            if (actualValue === null) {
                // If actualValue is null, setActualValue() isn't being invoked on a backtrack.
                // So, create a new possibleActualValues array.
                possibleActualValues = computePossibleValues( getSharedSquaresActualValues() );
                console.log('...possibleActualValues generated to: ' + possibleActualValues);
            } else {
                // Otherwise, setActualValue() is being invoked on a backtrack.
                // So, remove the current actualValue from the possibleActualValues array, as that value is a dead end.
                possibleActualValues.splice( possibleActualValues.indexOf(actualValue), 1);
                console.log('...actualValue removed from possibleActualValues');
            }

            // If there are no more possible values, then return 'false' to the grid object, and reset the actualValue.
            if (possibleActualValues.length === 0) {
                actualValue = null;
                console.log('...possibleActualValues length is 0, so return false');
                return false;
            }

            console.log('...actualValue can be set');

            // Select a new actualValue from the possibleActualValues array.
            actualValue = possibleActualValues[ Math.floor( Math.random() * possibleActualValues.length ) ];

            console.log('...actualValue set to ' + String(actualValue));


            // TEST. DELETE THIS.
            spanObject.innerHTML = 'actualValue: ' + actualValue + '<br /> possibleActualValues: ' + possibleActualValues;

        };

    }());

    // >> End selecting the actualValue.



    return {
        setSharedSquares: setSharedSquares,
        getActualValue: getActualValue,
        setActualValue: setActualValue,
    };

};
