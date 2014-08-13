/*
 * Written by P Cope.
 * Controller for the game buttons.
 */

var gameController = (function() {

    var containerElement = document.getElementById('sudokuContainer'),
        startButton = document.getElementById('startGameButton'),
        removeIncorrectValuesButton = document.getElementById('removeIncorrectValuesButton'),
        numRevealedSquaresSpan = document.getElementById('numSquares'),
        revealedSquaresSlider = containerElement.querySelector('[type="range"]');

    removeIncorrectValuesButton.addEventListener('click', grid.removeIncorrectUserValues, false); 

    var updateRevealedSquaresSpan = function() { numRevealedSquaresSpan.textContent = revealedSquaresSlider.value };

    revealedSquaresSlider.addEventListener('change', updateRevealedSquaresSpan, false);
 
    var startNewGame = function() {
        containerElement.classList.remove('gameWon');
        removeIncorrectValuesButton.removeAttribute('disabled');
        grid.newGame(revealedSquaresSlider.value);
    };

    startGameButton.addEventListener('click', startNewGame, false); 

    // Handle game being won.
    var gameWon = function() {
        containerElement.classList.add('gameWon');
        removeIncorrectValuesButton.setAttribute('disabled', '');
        // The select menu on the final square retains focus after game won, and so isn't un-displayed by CSS.
        // Take the focus away from the select menu, so that the user can't change the value of that square after win.
        revealedSquaresSlider.focus();
    };

    // Creates a new game on load.
    startNewGame();
    updateRevealedSquaresSpan();

    return {
        gameWon: gameWon,
    };

}());
