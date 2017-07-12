var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

import { isFieldValue } from './fieldValue';

/**
 * A different version of getValues() that does not need the fields array
 */
var getValuesFromState = function getValuesFromState(state) {
  if (!state) {
    return state;
  }
  var keys = Object.keys(state);
  if (!keys.length) {
    return undefined;
  }
  return keys.reduce(function (accumulator, key) {
    var field = state[key];
    if (field) {
      if (isFieldValue(field)) {
        if (field.value !== undefined) {
          accumulator[key] = field.value;
        }
      } else if (Array.isArray(field)) {
        accumulator[key] = field.map(function (arrayField) {
          return isFieldValue(arrayField) ? arrayField.value : getValuesFromState(arrayField);
        });
      } else if ((typeof field === 'undefined' ? 'undefined' : _typeof(field)) === 'object') {
        var result = getValuesFromState(field);

        if (result && Object.keys(result).length > 0) {
          accumulator[key] = result;
        }
      }
    }
    return accumulator;
  }, {});
};

export default getValuesFromState;