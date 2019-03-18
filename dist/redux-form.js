(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ReduxForm"] = factory();
	else
		root["ReduxForm"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

	import React from 'react';
	import { connect } from 'react-redux';
	import createAll from './createAll';

	var isNative = typeof window !== 'undefined' && window.navigator && window.navigator.product && window.navigator.product === 'ReactNative';

	var _createAll = createAll(isNative, React, connect);

	var actionTypes = _createAll.actionTypes,
	    addArrayValue = _createAll.addArrayValue,
	    autofill = _createAll.autofill,
	    autofillWithKey = _createAll.autofillWithKey,
	    blur = _createAll.blur,
	    change = _createAll.change,
	    changeWithKey = _createAll.changeWithKey,
	    destroy = _createAll.destroy,
	    focus = _createAll.focus,
	    reducer = _createAll.reducer,
	    reduxForm = _createAll.reduxForm,
	    removeArrayValue = _createAll.removeArrayValue,
	    getValues = _createAll.getValues,
	    initialize = _createAll.initialize,
	    initializeWithKey = _createAll.initializeWithKey,
	    propTypes = _createAll.propTypes,
	    reset = _createAll.reset,
	    startAsyncValidation = _createAll.startAsyncValidation,
	    startSubmit = _createAll.startSubmit,
	    stopAsyncValidation = _createAll.stopAsyncValidation,
	    stopSubmit = _createAll.stopSubmit,
	    swapArrayValues = _createAll.swapArrayValues,
	    touch = _createAll.touch,
	    touchWithKey = _createAll.touchWithKey,
	    untouch = _createAll.untouch,
	    untouchWithKey = _createAll.untouchWithKey;
	export { actionTypes, addArrayValue, autofill, autofillWithKey, blur, change, changeWithKey, destroy, focus, reducer, reduxForm, removeArrayValue, getValues, initialize, initializeWithKey, propTypes, reset, startAsyncValidation, startSubmit, stopAsyncValidation, stopSubmit, swapArrayValues, touch, touchWithKey, untouch, untouchWithKey };

/***/ })
/******/ ])
});
;