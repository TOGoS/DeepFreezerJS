"use strict";

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
	
	Object.getOwnPropertyNames(obj).forEach(function(k) {
		obj[k] = deepFreeze(obj[k]);
	});
	
	obj[deepFrozen] = true;
	Object.freeze(obj);
	return obj;
};

var thaw = function(obj) {
	if( !Object.isFrozen(obj) ) return obj;
	
	var clone = Object.create(Object.getPrototypeOf(obj));
	Object.getOwnPropertyNames(obj).forEach(function(k) {
		clone[k] = obj[k];
	});
	
	return clone;
};

var deepThaw = function(obj) {
	obj = thaw(obj);
	Object.getOwnPropertyNames(obj).forEach(function(k) {
		obj[k] = thaw(obj[k]);
	});
	return obj;
};

module.exports = {
	feeze: freeze,
	deepFreeze: deepFreeze,
	isDeepFrozen: isFeepFrozen,
	thaw: thaw,
	deepThaw: deepThaw
};
