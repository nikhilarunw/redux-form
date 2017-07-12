var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import reducer from './reducer';
import createReduxForm from './createReduxForm';
import mapValues from './mapValues';
import bindActionData from './bindActionData';
import * as actions from './actions';
import * as actionTypes from './actionTypes';
import createPropTypes from './createPropTypes';
import getValues from './getValuesFromState';

// bind form as first parameter of action creators
var boundActions = _extends({}, mapValues(_extends({}, actions, {
  autofillWithKey: function autofillWithKey(key) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return bindActionData(actions.autofill, { key: key }).apply(undefined, args);
  },
  changeWithKey: function changeWithKey(key) {
    for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    return bindActionData(actions.change, { key: key }).apply(undefined, args);
  },
  initializeWithKey: function initializeWithKey(key) {
    for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      args[_key3 - 1] = arguments[_key3];
    }

    return bindActionData(actions.initialize, { key: key }).apply(undefined, args);
  },
  reset: function reset(key) {
    return bindActionData(actions.reset, { key: key })();
  },
  touchWithKey: function touchWithKey(key) {
    for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
      args[_key4 - 1] = arguments[_key4];
    }

    return bindActionData(actions.touch, { key: key }).apply(undefined, args);
  },
  untouchWithKey: function untouchWithKey(key) {
    for (var _len5 = arguments.length, args = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
      args[_key5 - 1] = arguments[_key5];
    }

    return bindActionData(actions.untouch, { key: key }).apply(undefined, args);
  },
  destroy: function destroy(key) {
    return bindActionData(actions.destroy, { key: key })();
  }
}), function (action) {
  return function (form) {
    for (var _len6 = arguments.length, args = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
      args[_key6 - 1] = arguments[_key6];
    }

    return bindActionData(action, { form: form }).apply(undefined, args);
  };
}));

var addArrayValue = boundActions.addArrayValue;
var autofill = boundActions.autofill;
var autofillWithKey = boundActions.autofillWithKey;
var blur = boundActions.blur;
var change = boundActions.change;
var changeWithKey = boundActions.changeWithKey;
var destroy = boundActions.destroy;
var focus = boundActions.focus;
var initialize = boundActions.initialize;
var initializeWithKey = boundActions.initializeWithKey;
var removeArrayValue = boundActions.removeArrayValue;
var reset = boundActions.reset;
var startAsyncValidation = boundActions.startAsyncValidation;
var startSubmit = boundActions.startSubmit;
var stopAsyncValidation = boundActions.stopAsyncValidation;
var stopSubmit = boundActions.stopSubmit;
var submitFailed = boundActions.submitFailed;
var swapArrayValues = boundActions.swapArrayValues;
var touch = boundActions.touch;
var touchWithKey = boundActions.touchWithKey;
var untouch = boundActions.untouch;
var untouchWithKey = boundActions.untouchWithKey;

export default function createAll(isReactNative, React, connect) {
  return {
    actionTypes: actionTypes,
    addArrayValue: addArrayValue,
    autofill: autofill,
    autofillWithKey: autofillWithKey,
    blur: blur,
    change: change,
    changeWithKey: changeWithKey,
    destroy: destroy,
    focus: focus,
    getValues: getValues,
    initialize: initialize,
    initializeWithKey: initializeWithKey,
    propTypes: createPropTypes(),
    reduxForm: createReduxForm(isReactNative, React, connect),
    reducer: reducer,
    removeArrayValue: removeArrayValue,
    reset: reset,
    startAsyncValidation: startAsyncValidation,
    startSubmit: startSubmit,
    stopAsyncValidation: stopAsyncValidation,
    stopSubmit: stopSubmit,
    submitFailed: submitFailed,
    swapArrayValues: swapArrayValues,
    touch: touch,
    touchWithKey: touchWithKey,
    untouch: untouch,
    untouchWithKey: untouchWithKey
  };
}