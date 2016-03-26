[![Build Status](https://travis-ci.org/TOGoS/DeepFreezerJS.svg?branch=master)](https://travis-ci.org/TOGoS/DeepFreezerJS)

# DeepFreezerJS

A library for [deep] freezing and [deep] thawing JavaScript objects.

Can be used from node or the browser.

## Examples

Freeze your pizza

```javascript
var pizza = {
    "toppings": [
        {
            "name": "Broccoli"
        },
        {
            "name": "Onions"
        }
    ]
}

pizza.toppings.push({"name": "Mushrooms"});

// #freeze always returns the same object passed in,
var frozenPizza = DeepFreezer.deepFreeze(pizza);

frozenPizza.toppings.push({"name": "Olives"}); // an error!  Pizza's frozen
pizza.toppings.push({"name": "Olives"}); // Also an error!  That's the same instance as frozenPizza.

var thawedPizza = DeepFreezer.thaw(pizza);

thawedPizza.toppings.push({"name": "Olives"}); // That's okay!

thawedPizza.toppings[1].name = "Extra sauce"; // An error!  The toppings were also each frozen.

var totallyThawedPizza = DeepFreezer.deepThaw(thawedPizza);

thawedPizza.toppings[1].name = "Extra sauce"; // Ahh there we go.

pizza.toppings[1].name; // Still "Onions"
```

See test.html and test.js for more examples.
