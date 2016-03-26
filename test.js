var testsRan = false;

(function() {
"use strict";

var fail;
var assert;
var freezer;

if( typeof module !== 'undefined' ) {
	// Node!
	freezer = require('./DeepFreezer.js');
	
	fail = function(message) {
		process.stderr.write(message+"\n");
		process.exit(1);
	};
} else if( typeof failForTheBrowser !== 'undefined' ) {
	freezer = DeepFreezer;
	fail = failForTheBrowser;
} else {
	freezer = DeepFreezer;
	// Oh, or we could've just done this.
	fail = function(message) {
		throw new Exception(message);
	};
}

assert = function(value, message) {
	if( !value ) {
		fail("Assertion failed: "+message);
	}
};

// Need:
// - Recursive freeze
// - Thaw

var pizza = {
	topping: {
		name: "Mushrooms"
	}
};

assert( !freezer.isDeepFrozen(pizza), "Pizza should not seem deep frozen before we've deep frozen it" );

var frozenPizza = freezer.deepFreeze(pizza);

assert( !Object.is(pizza, frozenPizza), "Frozen pizza should have been a new instance");
assert( !Object.isFrozen(pizza), "Original pizza should not be frozen" );
assert( !Object.is(pizza.topping, frozenPizza.topping), "Frozen pizza topping should have been a new instance");
assert( !Object.isFrozen(pizza.topping), "Original pizza topping should not be frozen" );

// Okay, now back to our usual 'allow freezing in-place' tests:
frozenPizza = freezer.deepFreeze(pizza, true);

assert( Object.is(pizza, frozenPizza), "Pizza should not have needed to be cloned to be frozen" );
assert( Object.isFrozen(frozenPizza), "Frozen pizza should be frozen" );
assert( freezer.isDeepFrozen(frozenPizza), "Frozen pizza should be deep frozen" );
assert( Object.isFrozen(frozenPizza.topping), "Frozen pizza's topping should be frozen" );
assert( freezer.isDeepFrozen(frozenPizza.topping), "Frozen pizza's topping should be deep frozen" );

var thawedPizza = freezer.thaw(frozenPizza);

assert( !Object.is(thawedPizza, frozenPizza), "Thawed and frozen pizza should be different objects" );
assert( !Object.isFrozen(thawedPizza), "Thawed pizza should not be frozen" );
assert( !freezer.isDeepFrozen(thawedPizza), "Thawed pizza should not be deep frozen" );
assert( Object.isFrozen(thawedPizza.topping), "Thawed pizza's topping should still be frozen" );
assert( freezer.isDeepFrozen(thawedPizza.topping), "Thawed pizza's topping should still be deep frozen" );

var deepThawedPizza = freezer.deepThaw(thawedPizza);
assert( Object.is(deepThawedPizza, thawedPizza), "Should not have needed to clone already-thawed pizza to deep-thaw it" );

assert( !Object.isFrozen(thawedPizza.topping), "Deep thawed pizza's topping should not still be frozen" );
assert( !freezer.isDeepFrozen(thawedPizza.topping), "Deep thawed pizza's topping should not still be deep frozen" );

thawedPizza.topping = {name: 'Bacon'};

// And the whole point of the library:
assert( thawedPizza.topping.name != pizza.topping.name, "Toppings should have differed between frozen/thawed and never-frozen pizzas" );

var anArray = [1,2,3];

assert( anArray.length === 3 );

var frozenArray = freezer.deepFreeze(anArray);

assert( freezer.isDeepFrozen(frozenArray) );
assert( frozenArray.length === 3, "Array length should still be a thing on frozen arrays" );

var thawedArray = freezer.thaw(frozenArray);

assert( !Object.is(thawedArray, anArray), "Thawed array must be a different object from the original array" );
assert( !Object.isFrozen(thawedArray), "Thawed array must not be frozen" );
assert( !freezer.isDeepFrozen(thawedArray), "Thawed array must not be deep frozen" );
assert( thawedArray.length === 3, "Array length should still be a thing on thawed arrays" );
assert( Object.is(Object.getPrototypeOf(thawedArray), Object.getPrototypeOf(anArray)),
		  "Thawed array should have the same prototype as the original array" );

testsRan = true;

})();
