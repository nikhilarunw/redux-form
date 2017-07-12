var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { isFieldValue, makeFieldValue } from './fieldValue';

var isMetaKey = function isMetaKey(key) {
  return key[0] === '_';
};

/**
 * Sets an error on a field deep in the tree, returning a new copy of the state
 */
var setErrors = function setErrors(state, errors, destKey) {
  var clear = function clear() {
    if (Array.isArray(state)) {
      return state.map(function (stateItem, index) {
        return setErrors(stateItem, errors && errors[index], destKey);
      });
    }
    if (state && (typeof state === 'undefined' ? 'undefined' : _typeof(state)) === 'object') {
      var result = Object.keys(state).reduce(function (accumulator, key) {
        return isMetaKey(key) ? accumulator : _extends({}, accumulator, _defineProperty({}, key, setErrors(state[key], errors && errors[key], destKey)));
      }, state);
      if (isFieldValue(state)) {
        makeFieldValue(result);
      }
      return result;
    }
    return makeFieldValue(state);
  };
  if (typeof File !== 'undefined' && state instanceof File) {
    return state;
  }
  if (!errors) {
    if (!state) {
      return state;
    }
    if (state[destKey]) {
      var copy = _extends({}, state);
      delete copy[destKey];
      return makeFieldValue(copy);
    }
    return clear();
  }
  if (typeof errors === 'string') {
    return makeFieldValue(_extends({}, state, _defineProperty({}, destKey, errors)));
  }
  if (Array.isArray(errors)) {
    if (!state || Array.isArray(state)) {
      var _copy = (state || []).map(function (stateItem, index) {
        return setErrors(stateItem, errors[index], destKey);
      });
      errors.forEach(function (errorItem, index) {
        return _copy[index] = setErrors(_copy[index], errorItem, destKey);
      });
      return _copy;
    }
    return setErrors(state, errors[0], destKey); // use first error
  }
  if (isFieldValue(state)) {
    return makeFieldValue(_extends({}, state, _defineProperty({}, destKey, errors)));
  }
  var errorKeys = Object.keys(errors);
  if (!errorKeys.length && !state) {
    return state;
  }
  return errorKeys.reduce(function (accumulator, key) {
    return isMetaKey(key) ? accumulator : _extends({}, accumulator, _defineProperty({}, key, setErrors(state && state[key], errors[key], destKey)));
  }, clear() || {});
};

export default setErrors;