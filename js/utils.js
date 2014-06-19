var utils = {

    // Takes two arrays as arguments.
    // Returns a new array which contains the elements that are in the first array but not in the second.
    diff: function(first, second) {
        return first.filter( function(el) { return second.indexOf(el) === -1 } );
    },

    // Removes duplicate elements from the argument array.
    removeDuplicates: function(argArray) {
        argArray.forEach( function(el, currentIndex, argArray) {
            while (argArray.lastIndexOf(el) !== currentIndex) {
                argArray.splice(argArray.lastIndexOf(el), 1);
            }
        } );
    },

    // Returns a random integer between 0 and limit-1. Can be used to select random array elements.
    randomInt: function(limit) { return Math.floor(Math.random() * limit); },

};
