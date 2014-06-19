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

    // Generate the 'no value' option element that must appear at the start of each menu.
    // Needs to be visible at the start of the game, before any new menu is generated on hover.
    var firstOption = document.createElement('option');
    firstOption.textContent = 'Remove Value';
    firstOption.value = '';
    selectMenuObject.appendChild(firstOption);

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
    var selectActualValue = (function() {

        // Array of the possible actualValues that the square can take.
        // These are the values not taken by sharedSquares, and not removed due to being dead ends in grid generation.
        var possibleActualValues;

        return function() {

            if (actualValue === null) {
                // If actualValue is null, selectActualValue() isn't being invoked on a backtrack.
                // So, create a new possibleActualValues array.
                possibleActualValues = computePossibleValues( getSharedSquaresActualValues() );
            } else {
                // Otherwise, selectActualValue() is being invoked on a backtrack.
                // So, remove the current actualValue from the possibleActualValues array, as that value is a dead end.
                possibleActualValues.splice( possibleActualValues.indexOf(actualValue), 1);
            }

            // If there are no more possible values, then return 'false' to the grid object, and reset the actualValue.
            if (possibleActualValues.length === 0) {
                actualValue = null;
                return false;
            }

            // Select a new actualValue from the possibleActualValues array.
            actualValue = possibleActualValues[ Math.floor( Math.random() * possibleActualValues.length ) ];

        };

    }());

    // >> End selecting the actualValue.



    // >> Whether square is revealed at game start.

    // Square can be revealed value, whose actualValue is visible at the start of the game.
    // Boolean, set on every new game.
    var isRevealedValue = false;

    var getRevealedStatus = function() { return isRevealedValue; };

    var setAsRevealed = function() {
        isRevealedValue = true;
        tdObject.classList.add('revealed');
    };

    // >> End revealed square.



    // >> Dealing with user value.

    // The user tries to guess the actualValue of the square, and provides a userValue integer.
    // The userValue is not necessarily the same as the actualValue.
    // Game is won when the userValue equals the actualValue for every square.
    var userValue = null;

    // Returns a boolean, true if userValue is correct, false if not.
    var hasCorrectUserValue = function() { return userValue === actualValue; };

    var getUserValue = function() { return userValue; };

    // Sets user value and outputs it in the DOM. If falsy, eg empty string or null, resets userValue to null.
    // If userValue is now correct, check for win.
    var setUserValue = function(value) {
        if (!value) {
            userValue = null;
            spanObject.textContent = '';
        } else {
            userValue = Number(value);
            spanObject.textContent = userValue;
            if ( hasCorrectUserValue() ) {
                grid.checkForWin();
            }
        }
    };

    // Invoke setUserValue() with the new value entered by the user, every time they change the value of the select menu.
    selectMenuObject.addEventListener('change', function(eventObject) {
        setUserValue(eventObject.currentTarget.value);
    }, false);

    // Sets the userValue back to null. Invoked when removing incorrect values.
    var removeUserValue = function() { setUserValue(null); };

    // Returns an array of the shared square's actualValues for revealed squares, and userValues where available.
    // These are the values that are visible to the user.
    var getSharedSquaresUserAndRevealedValues = function() {
        var values = [];
        sharedSquares.forEach( function(el) {
            if (el.getRevealedStatus()) {
                values.push(el.getActualValue());
            } else {
                var uVal = el.getUserValue();
                if (uVal) {
                    values.push(uVal);
                }
            }
        } );
        return values;
    };

    // Generates the option elements for the select menu element whenever the menu is clicked and the options made visible.
    // This will be the values [1,2,3,4,5,6,7,8,9], minus the revealed actual values and userValues for sharedSquares,
    // ie minus the values that are visible to the user.
    // If the user selects an incorrect value elsewhere in the same row, column or small square, then the correct
    // actualValue may be prevented from appearing in the menu until the incorrect value is removed.
    var generateMenuOptions = function() {

        // Remove the previous option elements, except the first 'remove value' option.
        while (selectMenuObject.children.length > 1) {
            selectMenuObject.removeChild(selectMenuObject.children[selectMenuObject.children.length-1]);
        }

        var fragment = document.createDocumentFragment();

        // Compute the possible values, and create 'option' elements for each. The userValue should be selected.
        computePossibleValues( getSharedSquaresUserAndRevealedValues() ).sort().forEach( function(el) {
            var option = document.createElement('option');
            option.textContent = el;
            if (el === userValue) { option.setAttribute('selected', ''); }
            fragment.appendChild(option);
        } );

        selectMenuObject.appendChild(fragment);

    };

    // Generate new menu options every time the user focuses the select menu.
    selectMenuObject.addEventListener('focus', generateMenuOptions, false);

    // >> End user value.


    return {
        setSharedSquares: setSharedSquares,
        getActualValue: getActualValue,
        selectActualValue: selectActualValue,
        getRevealedStatus: getRevealedStatus,
        setAsRevealed: setAsRevealed,
        getUserValue: getUserValue,
    };


};
