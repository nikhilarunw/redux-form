var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import PropTypes from 'prop-types';
import * as importedActions from './actions';
import getDisplayName from './getDisplayName';
import { initialState } from './reducer';
import deepEqual from 'deep-equal';
import bindActionData from './bindActionData';
import getValues from './getValues';
import isValid from './isValid';
import readFields from './readFields';
import _handleSubmit from './handleSubmit';
import asyncValidation from './asyncValidation';
import silenceEvents from './events/silenceEvents';
import silenceEvent from './events/silenceEvent';
import wrapMapDispatchToProps from './wrapMapDispatchToProps';
import wrapMapStateToProps from './wrapMapStateToProps';
import createInitialState from './createInitialState';

/**
 * Creates a HOC that knows how to create redux-connected sub-components.
 */
var createHigherOrderComponent = function createHigherOrderComponent(config, isReactNative, React, connect, WrappedComponent, mapStateToProps, mapDispatchToProps, mergeProps, options) {
  var Component = React.Component;

  return function (reduxMountPoint, formName, formKey, getFormState) {
    var _ref = options || {},
        _ref$withRef = _ref.withRef,
        withRef = _ref$withRef === undefined ? false : _ref$withRef;

    var ReduxForm = function (_Component) {
      _inherits(ReduxForm, _Component);

      function ReduxForm(props) {
        _classCallCheck(this, ReduxForm);

        // bind functions
        var _this = _possibleConstructorReturn(this, (ReduxForm.__proto__ || Object.getPrototypeOf(ReduxForm)).call(this, props));

        _this.asyncValidate = _this.asyncValidate.bind(_this);
        _this.handleSubmit = _this.handleSubmit.bind(_this);
        var _this$props = _this.props,
            initialValues = _this$props.initialValues,
            submitPassback = _this$props.submitPassback;
        // Check if form state was initialized, if not, initialize it.

        var form = deepEqual(props.form, initialState) ? createInitialState(initialValues, config.fields, {}, true, false) : props.form;
        _this.fields = readFields(_extends({}, props, { form: form }), {}, {}, _this.asyncValidate, isReactNative);
        submitPassback(function () {
          return _this.handleSubmit();
        }); // wrapped in function to disallow params
        return _this;
      }

      _createClass(ReduxForm, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
          var _props = this.props,
              fields = _props.fields,
              form = _props.form,
              initialize = _props.initialize,
              initialValues = _props.initialValues;

          if (initialValues && !form._initialized) {
            initialize(initialValues, fields);
          }
        }
      }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
          if (!deepEqual(this.props.fields, nextProps.fields) || !deepEqual(this.props.form, nextProps.form, { strict: true })) {
            this.fields = readFields(nextProps, this.props, this.fields, this.asyncValidate, isReactNative);
          }
          if (!deepEqual(this.props.initialValues, nextProps.initialValues)) {
            this.props.initialize(nextProps.initialValues, nextProps.fields, this.props.overwriteOnInitialValuesChange || !this.props.form._initialized);
          }
        }
      }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          if (config.destroyOnUnmount) {
            this.props.destroy();
          }
        }
      }, {
        key: 'asyncValidate',
        value: function asyncValidate(name, value) {
          var _this2 = this;

          var _props2 = this.props,
              alwaysAsyncValidate = _props2.alwaysAsyncValidate,
              asyncValidate = _props2.asyncValidate,
              dispatch = _props2.dispatch,
              fields = _props2.fields,
              form = _props2.form,
              startAsyncValidation = _props2.startAsyncValidation,
              stopAsyncValidation = _props2.stopAsyncValidation,
              validate = _props2.validate;

          var isSubmitting = !name;
          if (asyncValidate) {
            var values = getValues(fields, form);
            if (name) {
              values[name] = value;
            }
            var syncErrors = validate(values, this.props);
            var allPristine = this.fields._meta.allPristine;

            var initialized = form._initialized;

            // if blur validating, only run async validate if sync validation passes
            // and submitting (not blur validation) or form is dirty or form was never initialized
            // unless alwaysAsyncValidate is true
            var syncValidationPasses = isSubmitting || isValid(syncErrors[name]);
            if (alwaysAsyncValidate || syncValidationPasses && (isSubmitting || !allPristine || !initialized)) {
              return asyncValidation(function () {
                return asyncValidate(values, dispatch, _this2.props);
              }, startAsyncValidation, stopAsyncValidation, name);
            }
          }
        }
      }, {
        key: 'handleSubmit',
        value: function handleSubmit(submitOrEvent) {
          var _this3 = this;

          var _props3 = this.props,
              onSubmit = _props3.onSubmit,
              fields = _props3.fields,
              form = _props3.form;

          var check = function check(submit) {
            if (!submit || typeof submit !== 'function') {
              throw new Error('You must either pass handleSubmit() an onSubmit function or pass onSubmit as a prop');
            }
            return submit;
          };
          return !submitOrEvent || silenceEvent(submitOrEvent) ?
          // submitOrEvent is an event: fire submit
          _handleSubmit(check(onSubmit), getValues(fields, form), this.props, this.asyncValidate) :
          // submitOrEvent is the submit function: return deferred submit thunk
          silenceEvents(function () {
            return _handleSubmit(check(submitOrEvent), getValues(fields, form), _this3.props, _this3.asyncValidate);
          });
        }
      }, {
        key: 'render',
        value: function render() {
          var _this4 = this;

          var allFields = this.fields;

          var _props4 = this.props,
              addArrayValue = _props4.addArrayValue,
              asyncBlurFields = _props4.asyncBlurFields,
              autofill = _props4.autofill,
              blur = _props4.blur,
              change = _props4.change,
              destroy = _props4.destroy,
              focus = _props4.focus,
              fields = _props4.fields,
              form = _props4.form,
              initialValues = _props4.initialValues,
              initialize = _props4.initialize,
              onSubmit = _props4.onSubmit,
              propNamespace = _props4.propNamespace,
              reset = _props4.reset,
              removeArrayValue = _props4.removeArrayValue,
              returnRejectedSubmitPromise = _props4.returnRejectedSubmitPromise,
              startAsyncValidation = _props4.startAsyncValidation,
              startSubmit = _props4.startSubmit,
              stopAsyncValidation = _props4.stopAsyncValidation,
              stopSubmit = _props4.stopSubmit,
              submitFailed = _props4.submitFailed,
              swapArrayValues = _props4.swapArrayValues,
              touch = _props4.touch,
              untouch = _props4.untouch,
              validate = _props4.validate,
              passableProps = _objectWithoutProperties(_props4, ['addArrayValue', 'asyncBlurFields', 'autofill', 'blur', 'change', 'destroy', 'focus', 'fields', 'form', 'initialValues', 'initialize', 'onSubmit', 'propNamespace', 'reset', 'removeArrayValue', 'returnRejectedSubmitPromise', 'startAsyncValidation', 'startSubmit', 'stopAsyncValidation', 'stopSubmit', 'submitFailed', 'swapArrayValues', 'touch', 'untouch', 'validate']); // eslint-disable-line no-redeclare


          var _allFields$_meta = allFields._meta,
              allPristine = _allFields$_meta.allPristine,
              allValid = _allFields$_meta.allValid,
              errors = _allFields$_meta.errors,
              formError = _allFields$_meta.formError,
              values = _allFields$_meta.values;


          var props = {
            // State:
            active: form._active,
            asyncValidating: form._asyncValidating,
            dirty: !allPristine,
            error: formError,
            errors: errors,
            fields: allFields,
            formKey: formKey,
            invalid: !allValid,
            pristine: allPristine,
            submitting: form._submitting,
            submitFailed: form._submitFailed,
            valid: allValid,
            values: values,

            // Actions:
            asyncValidate: silenceEvents(function () {
              return _this4.asyncValidate();
            }),
            // ^ doesn't just pass this.asyncValidate to disallow values passing
            destroyForm: silenceEvents(destroy),
            handleSubmit: this.handleSubmit,
            initializeForm: silenceEvents(function (initValues) {
              return initialize(initValues, fields);
            }),
            resetForm: silenceEvents(reset),
            touch: silenceEvents(function () {
              return touch.apply(undefined, arguments);
            }),
            touchAll: silenceEvents(function () {
              return touch.apply(undefined, _toConsumableArray(fields));
            }),
            untouch: silenceEvents(function () {
              return untouch.apply(undefined, arguments);
            }),
            untouchAll: silenceEvents(function () {
              return untouch.apply(undefined, _toConsumableArray(fields));
            })
          };
          var passedProps = propNamespace ? _defineProperty({}, propNamespace, props) : props;
          if (withRef) {
            return React.createElement(WrappedComponent, _extends({}, _extends({}, passableProps, passedProps), { ref: 'wrappedInstance' }));
          }
          return React.createElement(WrappedComponent, _extends({}, passableProps, passedProps));
        }
      }]);

      return ReduxForm;
    }(Component);

    ReduxForm.displayName = 'ReduxForm(' + getDisplayName(WrappedComponent) + ')';
    ReduxForm.WrappedComponent = WrappedComponent;
    ReduxForm.propTypes = {
      // props:
      alwaysAsyncValidate: PropTypes.bool,
      asyncBlurFields: PropTypes.arrayOf(PropTypes.string),
      asyncValidate: PropTypes.func,
      dispatch: PropTypes.func.isRequired,
      fields: PropTypes.arrayOf(PropTypes.string).isRequired,
      form: PropTypes.object,
      initialValues: PropTypes.any,
      onSubmit: PropTypes.func,
      onSubmitSuccess: PropTypes.func,
      onSubmitFail: PropTypes.func,
      overwriteOnInitialValuesChange: PropTypes.bool.isRequired,
      propNamespace: PropTypes.string,
      readonly: PropTypes.bool,
      returnRejectedSubmitPromise: PropTypes.bool,
      submitPassback: PropTypes.func.isRequired,
      validate: PropTypes.func,

      // actions:
      addArrayValue: PropTypes.func.isRequired,
      autofill: PropTypes.func.isRequired,
      blur: PropTypes.func.isRequired,
      change: PropTypes.func.isRequired,
      destroy: PropTypes.func.isRequired,
      focus: PropTypes.func.isRequired,
      initialize: PropTypes.func.isRequired,
      removeArrayValue: PropTypes.func.isRequired,
      reset: PropTypes.func.isRequired,
      startAsyncValidation: PropTypes.func.isRequired,
      startSubmit: PropTypes.func.isRequired,
      stopAsyncValidation: PropTypes.func.isRequired,
      stopSubmit: PropTypes.func.isRequired,
      submitFailed: PropTypes.func.isRequired,
      swapArrayValues: PropTypes.func.isRequired,
      touch: PropTypes.func.isRequired,
      untouch: PropTypes.func.isRequired
    };
    ReduxForm.defaultProps = {
      asyncBlurFields: [],
      form: initialState,
      readonly: false,
      returnRejectedSubmitPromise: false,
      validate: function validate() {
        return {};
      }
    };

    // bind touch flags to blur and change
    var unboundActions = _extends({}, importedActions, {
      blur: bindActionData(importedActions.blur, {
        touch: !!config.touchOnBlur
      }),
      change: bindActionData(importedActions.change, {
        touch: !!config.touchOnChange
      })
    });

    // make redux connector with or without form key
    var decorate = formKey !== undefined && formKey !== null ? connect(wrapMapStateToProps(mapStateToProps, function (state) {
      var formState = getFormState(state, reduxMountPoint);
      if (!formState) {
        throw new Error('You need to mount the redux-form reducer at "' + reduxMountPoint + '"');
      }
      return formState && formState[formName] && formState[formName][formKey];
    }), wrapMapDispatchToProps(mapDispatchToProps, bindActionData(unboundActions, {
      form: formName,
      key: formKey
    })), mergeProps, options) : connect(wrapMapStateToProps(mapStateToProps, function (state) {
      var formState = getFormState(state, reduxMountPoint);
      if (!formState) {
        throw new Error('You need to mount the redux-form reducer at "' + reduxMountPoint + '"');
      }
      return formState && formState[formName];
    }), wrapMapDispatchToProps(mapDispatchToProps, bindActionData(unboundActions, { form: formName })), mergeProps, options);

    return decorate(ReduxForm);
  };
};

export default createHigherOrderComponent;