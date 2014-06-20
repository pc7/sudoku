/*
 * Controller for the game buttons.
 */

var gameController = (function() {

    var containerElement = document.getElementById('sudokuContainer'),
        startButton = document.getElementById('startGameButton'),
        removeIncorrectValuesButton = document.getElementById('removeIncorrectValuesButton');

    removeIncorrectValuesButton.addEventListener('click', grid.removeIncorrectUserValues, false); 

    var startNewGame = function() {
        containerElement.classList.remove('gameWon');
        removeIncorrectValuesButton.removeAttribute('disabled');
        grid.newGame();
    };

    startGameButton.addEventListener('click', startNewGame, false); 

    // Handle game being won.
    var gameWon = function() {
        containerElement.classList.add('gameWon');
        removeIncorrectValuesButton.setAttribute('disabled', '');
    };

    // Creates a new game on load.
    startNewGame();

    return {
        gameWon: gameWon,
    };

}());
