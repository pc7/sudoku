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

    return {

    };

};
