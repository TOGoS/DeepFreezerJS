var DeepFreezer = (function() {
	"use strict";
	
	//// Object cloning utilities
	
	var identity = function(x) { return x; };
	
	var _map = function(from, to, mapFunc) {
		Object.getOwnPropertyNames(from).forEach(function(k) {
			to[k] = mapFunc(from[k]);
		});
	};
	
	var map = function(obj, mapFunc) {
		//var clone = {}; // Fails array copy test!
		//var clone = new (Object.getPrototypeOf(obj).constructor)(); // Works but is more complex than...
		var clone = Object.create(Object.getPrototypeOf(obj));
		_map(obj, clone, mapFunc);
		return clone;
	};
	
	////

	var deepFrozen = Symbol("deeply frozen");
	
	var isDeepFrozen = function(val) {
		return !!((typeof val !== 'function' && typeof val !== 'object') || val === null || val[deepFrozen]);
	};
	
	/**
	 * Differs from object.feeze only in that this will add the deepFrozen
	 * property if the object happens to be deep frozen.
	 * 
	 * Why would you use this instead of deepFreeze?
	 * Probably shouldn't.
	 */
	var freeze = function(obj) {
		var hasAnyMutableProperties = false;
		Object.getOwnPropertyNames(obj).forEach(function(k) {
			if( !isDeepFrozen(obj[k]) ) {
				hasAnyMutableProperties = true;
			}
		});
		if( !hasAnyMutableProperties ) obj[deepFrozen] = true;
		return Object.freeze(obj);
	};
	
	var deepFreeze = function(obj) {
		if( isDeepFrozen(obj) ) return obj;
		
		// If it ain't /deep frozen/ we're going to have
		// to thaw it at least to add the deepFrozen property.
		obj = thaw(obj);
		_map( obj, obj, deepFreeze );
		obj[deepFrozen] = true;
		Object.freeze(obj);
		return obj;
	};
	
	var thaw = function(obj) {
		if( !Object.isFrozen(obj) ) return obj;
		if( typeof obj !== 'object' && typeof obj !== 'function' ) return obj;
		return map(obj, identity);
	};
	
	var deepThaw = function(obj) {
		obj = thaw(obj);
		_map(obj, obj, thaw);
		return obj;
	};
	
	var myOwnCopyOf = function(obj) {
		return deepThaw(deepFreeze(obj));
	};
	
	return {
		// Stuff I'm making public because it's handy for my other
		// libraries, especially when dealing with deep frozen stuff
		map: map,
		
		// Our API
		freeze: freeze,
		deepFreeze: deepFreeze,
		isDeepFrozen: isDeepFrozen,
		thaw: thaw,
		deepThaw: deepThaw,
		myOwnCopyOf: myOwnCopyOf
	};
})();

if( typeof module !== 'undefined' ) module.exports = DeepFreezer;
