var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import PropTypes from 'prop-types';
import LazyCache from 'react-lazy-cache/noGetters';
import getDisplayName from './getDisplayName';
import createHigherOrderComponent from './createHigherOrderComponent';

/**
 * This component tracks props that affect how the form is mounted to the store. Normally these should not change,
 * but if they do, the connected components below it need to be redefined.
 */
var createReduxFormConnector = function createReduxFormConnector(isReactNative, React, connect) {
  return function (WrappedComponent, mapStateToProps, mapDispatchToProps, mergeProps, options) {
    var Component = React.Component;

    var _ref = options || {},
        _ref$withRef = _ref.withRef,
        withRef = _ref$withRef === undefined ? false : _ref$withRef;

    var ReduxFormConnector = function (_Component) {
      _inherits(ReduxFormConnector, _Component);

      function ReduxFormConnector(props) {
        _classCallCheck(this, ReduxFormConnector);

        var _this = _possibleConstructorReturn(this, (ReduxFormConnector.__proto__ || Object.getPrototypeOf(ReduxFormConnector)).call(this, props));

        _this.cache = new LazyCache(_this, {
          ReduxForm: {
            params: [
            // props that effect how redux-form connects to the redux store
            'reduxMountPoint', 'form', 'formKey', 'getFormState'],
            fn: createHigherOrderComponent(props, isReactNative, React, connect, WrappedComponent, mapStateToProps, mapDispatchToProps, mergeProps, options)
          }
        });
        return _this;
      }

      _createClass(ReduxFormConnector, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
          this.cache.componentWillReceiveProps(nextProps);
        }
      }, {
        key: 'render',
        value: function render() {
          var ReduxForm = this.cache.get('ReduxForm');
          // remove some redux-form config-only props

          var _props = this.props,
              reduxMountPoint = _props.reduxMountPoint,
              destroyOnUnmount = _props.destroyOnUnmount,
              form = _props.form,
              getFormState = _props.getFormState,
              touchOnBlur = _props.touchOnBlur,
              touchOnChange = _props.touchOnChange,
              passableProps = _objectWithoutProperties(_props, ['reduxMountPoint', 'destroyOnUnmount', 'form', 'getFormState', 'touchOnBlur', 'touchOnChange']); // eslint-disable-line no-redeclare


          if (withRef) {
            return React.createElement(ReduxForm, _extends({}, passableProps, { ref: 'wrappedInstance' }));
          }
          return React.createElement(ReduxForm, passableProps);
        }
      }]);

      return ReduxFormConnector;
    }(Component);

    ReduxFormConnector.displayName = 'ReduxFormConnector(' + getDisplayName(WrappedComponent) + ')';
    ReduxFormConnector.WrappedComponent = WrappedComponent;
    ReduxFormConnector.propTypes = {
      destroyOnUnmount: PropTypes.bool,
      reduxMountPoint: PropTypes.string,
      form: PropTypes.string.isRequired,
      formKey: PropTypes.string,
      getFormState: PropTypes.func,
      touchOnBlur: PropTypes.bool,
      touchOnChange: PropTypes.bool
    };
    ReduxFormConnector.defaultProps = {
      reduxMountPoint: 'form',
      getFormState: function getFormState(state, reduxMountPoint) {
        return state[reduxMountPoint];
      }
    };
    return ReduxFormConnector;
  };
};

export default createReduxFormConnector;