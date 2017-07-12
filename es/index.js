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