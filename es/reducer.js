var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _initialState, _behaviors;

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { ADD_ARRAY_VALUE, AUTOFILL, BLUR, CHANGE, DESTROY, FOCUS, INITIALIZE, REMOVE_ARRAY_VALUE, RESET, START_ASYNC_VALIDATION, START_SUBMIT, STOP_ASYNC_VALIDATION, STOP_SUBMIT, SUBMIT_FAILED, SWAP_ARRAY_VALUES, TOUCH, UNTOUCH } from './actionTypes';
import mapValues from './mapValues';
import read from './read';
import write from './write';
import getValuesFromState from './getValuesFromState';
import initializeState from './initializeState';
import resetState from './resetState';
import setErrors from './setErrors';
import { makeFieldValue } from './fieldValue';
import normalizeFields from './normalizeFields';
import createInitialState from './createInitialState';

export var globalErrorKey = '_error';

export var initialState = (_initialState = {
  _active: undefined,
  _asyncValidating: false
}, _defineProperty(_initialState, globalErrorKey, undefined), _defineProperty(_initialState, '_initialized', false), _defineProperty(_initialState, '_submitting', false), _defineProperty(_initialState, '_submitFailed', false), _initialState);

var behaviors = (_behaviors = {}, _defineProperty(_behaviors, ADD_ARRAY_VALUE, function (state, _ref) {
  var path = _ref.path,
      index = _ref.index,
      value = _ref.value,
      fields = _ref.fields;

  var array = read(path, state);
  var stateCopy = _extends({}, state);
  var arrayCopy = array ? [].concat(_toConsumableArray(array)) : [];
  var newValue = value !== null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' ? initializeState(value, fields || Object.keys(value)) : makeFieldValue({ value: value });
  if (index === undefined) {
    arrayCopy.push(newValue);
  } else {
    arrayCopy.splice(index, 0, newValue);
  }
  return write(path, arrayCopy, stateCopy);
}), _defineProperty(_behaviors, AUTOFILL, function (state, _ref2) {
  var field = _ref2.field,
      value = _ref2.value;

  return write(field, function (previous) {
    var _previous$value$autof = _extends({}, previous, { value: value, autofilled: true }),
        asyncError = _previous$value$autof.asyncError,
        submitError = _previous$value$autof.submitError,
        result = _objectWithoutProperties(_previous$value$autof, ['asyncError', 'submitError']);

    return makeFieldValue(result);
  }, state);
}), _defineProperty(_behaviors, BLUR, function (state, _ref3) {
  var field = _ref3.field,
      value = _ref3.value,
      touch = _ref3.touch;

  var _active = state._active,
      stateCopy = _objectWithoutProperties(state, ['_active']);

  if (_active && _active !== field) {
    // remove _active from state
    stateCopy._active = _active;
  }
  return write(field, function (previous) {
    var result = _extends({}, previous);
    if (value !== undefined) {
      result.value = value;
    }
    if (touch) {
      result.touched = true;
    }
    return makeFieldValue(result);
  }, stateCopy);
}), _defineProperty(_behaviors, CHANGE, function (state, _ref4) {
  var field = _ref4.field,
      value = _ref4.value,
      touch = _ref4.touch;

  return write(field, function (previous) {
    var _previous$value = _extends({}, previous, { value: value }),
        asyncError = _previous$value.asyncError,
        submitError = _previous$value.submitError,
        autofilled = _previous$value.autofilled,
        result = _objectWithoutProperties(_previous$value, ['asyncError', 'submitError', 'autofilled']);

    if (touch) {
      result.touched = true;
    }
    return makeFieldValue(result);
  }, state);
}), _defineProperty(_behaviors, DESTROY, function () {
  return undefined;
}), _defineProperty(_behaviors, FOCUS, function (state, _ref5) {
  var field = _ref5.field;

  var stateCopy = write(field, function (previous) {
    return makeFieldValue(_extends({}, previous, { visited: true }));
  }, state);
  stateCopy._active = field;
  return stateCopy;
}), _defineProperty(_behaviors, INITIALIZE, function (state, _ref6) {
  var data = _ref6.data,
      fields = _ref6.fields,
      overwriteValues = _ref6.overwriteValues;

  return createInitialState(data, fields, state, overwriteValues);
}), _defineProperty(_behaviors, REMOVE_ARRAY_VALUE, function (state, _ref7) {
  var path = _ref7.path,
      index = _ref7.index;

  var array = read(path, state);
  var stateCopy = _extends({}, state);
  var arrayCopy = array ? [].concat(_toConsumableArray(array)) : [];
  if (index === undefined) {
    arrayCopy.pop();
  } else if (isNaN(index)) {
    delete arrayCopy[index];
  } else {
    arrayCopy.splice(index, 1);
  }
  return write(path, arrayCopy, stateCopy);
}), _defineProperty(_behaviors, RESET, function (state) {
  var _extends2;

  return _extends({}, resetState(state), (_extends2 = {
    _active: undefined,
    _asyncValidating: false
  }, _defineProperty(_extends2, globalErrorKey, undefined), _defineProperty(_extends2, '_initialized', state._initialized), _defineProperty(_extends2, '_submitting', false), _defineProperty(_extends2, '_submitFailed', false), _extends2));
}), _defineProperty(_behaviors, START_ASYNC_VALIDATION, function (state, _ref8) {
  var field = _ref8.field;

  return _extends({}, state, {
    _asyncValidating: field || true
  });
}), _defineProperty(_behaviors, START_SUBMIT, function (state) {
  return _extends({}, state, {
    _submitting: true
  });
}), _defineProperty(_behaviors, STOP_ASYNC_VALIDATION, function (state, _ref9) {
  var errors = _ref9.errors;

  return _extends({}, setErrors(state, errors, 'asyncError'), _defineProperty({
    _asyncValidating: false
  }, globalErrorKey, errors && errors[globalErrorKey]));
}), _defineProperty(_behaviors, STOP_SUBMIT, function (state, _ref10) {
  var _extends4;

  var errors = _ref10.errors;

  return _extends({}, setErrors(state, errors, 'submitError'), (_extends4 = {}, _defineProperty(_extends4, globalErrorKey, errors && errors[globalErrorKey]), _defineProperty(_extends4, '_submitting', false), _defineProperty(_extends4, '_submitFailed', !!(errors && Object.keys(errors).length)), _extends4));
}), _defineProperty(_behaviors, SUBMIT_FAILED, function (state) {
  return _extends({}, state, {
    _submitFailed: true
  });
}), _defineProperty(_behaviors, SWAP_ARRAY_VALUES, function (state, _ref11) {
  var path = _ref11.path,
      indexA = _ref11.indexA,
      indexB = _ref11.indexB;

  var array = read(path, state);
  var arrayLength = array.length;
  if (indexA === indexB || isNaN(indexA) || isNaN(indexB) || indexA >= arrayLength || indexB >= arrayLength) {
    return state; // do nothing
  }
  var stateCopy = _extends({}, state);
  var arrayCopy = [].concat(_toConsumableArray(array));
  arrayCopy[indexA] = array[indexB];
  arrayCopy[indexB] = array[indexA];
  return write(path, arrayCopy, stateCopy);
}), _defineProperty(_behaviors, TOUCH, function (state, _ref12) {
  var fields = _ref12.fields;

  return _extends({}, state, fields.reduce(function (accumulator, field) {
    return write(field, function (value) {
      return makeFieldValue(_extends({}, value, { touched: true }));
    }, accumulator);
  }, state));
}), _defineProperty(_behaviors, UNTOUCH, function (state, _ref13) {
  var fields = _ref13.fields;

  return _extends({}, state, fields.reduce(function (accumulator, field) {
    return write(field, function (value) {
      if (value) {
        var touched = value.touched,
            rest = _objectWithoutProperties(value, ['touched']);

        return makeFieldValue(rest);
      }
      return makeFieldValue(value);
    }, accumulator);
  }, state));
}), _behaviors);

var reducer = function reducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var behavior = behaviors[action.type];
  return behavior ? behavior(state, action) : state;
};

function formReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var form = action.form,
      key = action.key,
      rest = _objectWithoutProperties(action, ['form', 'key']); // eslint-disable-line no-redeclare


  if (!form) {
    return state;
  }
  if (key) {
    if (action.type === DESTROY) {
      return _extends({}, state, _defineProperty({}, form, state[form] && Object.keys(state[form]).reduce(function (accumulator, stateKey) {
        return stateKey === key ? accumulator : _extends({}, accumulator, _defineProperty({}, stateKey, state[form][stateKey]));
      }, {})));
    }
    return _extends({}, state, _defineProperty({}, form, _extends({}, state[form], _defineProperty({}, key, reducer((state[form] || {})[key], rest)))));
  }
  if (action.type === DESTROY) {
    return Object.keys(state).reduce(function (accumulator, formName) {
      return formName === form ? accumulator : _extends({}, accumulator, _defineProperty({}, formName, state[formName]));
    }, {});
  }
  return _extends({}, state, _defineProperty({}, form, reducer(state[form], rest)));
}

/**
 * Adds additional functionality to the reducer
 */
function decorate(target) {
  target.plugin = function plugin(reducers) {
    var _this = this;

    // use 'function' keyword to enable 'this'
    return decorate(function () {
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var result = _this(state, action);
      return _extends({}, result, mapValues(reducers, function (pluginReducer, key) {
        return pluginReducer(result[key] || initialState, action);
      }));
    });
  };

  target.normalize = function normalize(normalizers) {
    var _this2 = this;

    // use 'function' keyword to enable 'this'
    return decorate(function () {
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var result = _this2(state, action);
      return _extends({}, result, mapValues(normalizers, function (formNormalizers, form) {
        var runNormalize = function runNormalize(previous, currentResult) {
          var previousValues = getValuesFromState(_extends({}, initialState, previous));
          var formResult = _extends({}, initialState, currentResult);
          var values = getValuesFromState(formResult);
          return normalizeFields(formNormalizers, formResult, previous, values, previousValues);
        };
        if (action.key) {
          return _extends({}, result[form], _defineProperty({}, action.key, runNormalize(state[form][action.key], result[form][action.key])));
        }
        return runNormalize(state[form], result[form]);
      }));
    });
  };

  return target;
}

export default decorate(formReducer);