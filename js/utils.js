var utils = {

    // Takes two arrays as arguments.
    // Returns a new array which contains the elements that are in the first array but not in the second.
    diff: function(first, second) {
        return first.filter( function(el) { return second.indexOf(el) === -1 } );
    },

};
