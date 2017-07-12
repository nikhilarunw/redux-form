var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

import { isFieldValue, makeFieldValue } from './fieldValue';

var reset = function reset(value) {
  return makeFieldValue(value === undefined || value && value.initial === undefined ? {} : { initial: value.initial, value: value.initial });
};

/**
 * Sets the initial values into the state and returns a new copy of the state
 */
var resetState = function resetState(values) {
  return values ? Object.keys(values).reduce(function (accumulator, key) {
    var value = values[key];
    if (Array.isArray(value)) {
      accumulator[key] = value.map(function (item) {
        return isFieldValue(item) ? reset(item) : resetState(item);
      });
    } else if (value) {
      if (isFieldValue(value)) {
        accumulator[key] = reset(value);
      } else if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value !== null) {
        accumulator[key] = resetState(value);
      } else {
        accumulator[key] = value;
      }
    }
    return accumulator;
  }, {}) : values;
};

export default resetState;