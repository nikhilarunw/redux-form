var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { globalErrorKey } from './reducer';
import initializeState from './initializeState';

var createInitialState = function createInitialState(data, fields, state) {
  var _extends2;

  var overwriteValues = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  var markInitialized = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;

  return _extends({}, initializeState(data, fields, state, overwriteValues), (_extends2 = {
    _asyncValidating: false,
    _active: undefined
  }, _defineProperty(_extends2, globalErrorKey, undefined), _defineProperty(_extends2, '_initialized', markInitialized), _defineProperty(_extends2, '_submitting', false), _defineProperty(_extends2, '_submitFailed', false), _extends2));
};

export default createInitialState;