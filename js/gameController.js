/*
 * Controller for the game buttons.
 */

var gameController = (function() {

    var removeIncorrectValuesButton = document.getElementById('removeIncorrectValuesButton');

    removeIncorrectValuesButton.addEventListener('click', grid.removeIncorrectUserValues, false); 

    // Creates a new game on load.
    grid.newGame();

}());
