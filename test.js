"use strict";

var freezer = require('./freezer.js');

// Need:
// - Recursive freeze
// - Thaw

var pizza = {
	topping: {
		name: "Mushrooms"
	}
};

var frozenPizza = freezer.freeze(pizza);
var thawedPizza = freezer.thaw(pizza);

console.log(Object.isFrozen(pizza) ? "pizza is frozen" : "pizz ain't frozen");

thawedPizza.topping = {name: 'Bacon'};

console.log("Pizza topping is now "+pizza.topping.name);
console.log("Thawed topping is now "+thawedPizza.topping.name);
