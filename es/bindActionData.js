var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import mapValues from './mapValues';

/**
 * Adds additional properties to the results of the function or map of functions passed
 */
export default function bindActionData(action, data) {
  if (typeof action === 'function') {
    return function () {
      return _extends({}, action.apply(undefined, arguments), data);
    };
  }
  if ((typeof action === 'undefined' ? 'undefined' : _typeof(action)) === 'object') {
    return mapValues(action, function (value) {
      return bindActionData(value, data);
    });
  }
  return action;
}