import React from 'react-native';
import { connect } from 'react-redux';
import createAll from './createAll';

var _createAll = createAll(true, React, connect);

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
    getValues = _createAll.getValues,
    initialize = _createAll.initialize,
    initializeWithKey = _createAll.initializeWithKey,
    propTypes = _createAll.propTypes,
    removeArrayValue = _createAll.removeArrayValue,
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
export { actionTypes, addArrayValue, autofill, autofillWithKey, blur, change, changeWithKey, destroy, focus, reducer, reduxForm, getValues, initialize, initializeWithKey, propTypes, removeArrayValue, reset, startAsyncValidation, startSubmit, stopAsyncValidation, stopSubmit, swapArrayValues, touch, touchWithKey, untouch, untouchWithKey };