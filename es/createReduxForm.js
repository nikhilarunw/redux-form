var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import createReduxFormConnector from './createReduxFormConnector';
import hoistStatics from 'hoist-non-react-statics';
import invariant from 'invariant';

/**
 * The decorator that is the main API to redux-form
 */
var createReduxForm = function createReduxForm(isReactNative, React, connect) {
  var Component = React.Component;

  var reduxFormConnector = createReduxFormConnector(isReactNative, React, connect);
  return function (config, mapStateToProps, mapDispatchToProps, mergeProps, options) {
    return function (WrappedComponent) {
      var ReduxFormConnector = reduxFormConnector(WrappedComponent, mapStateToProps, mapDispatchToProps, mergeProps, options);

      var _ref = options || {},
          _ref$withRef = _ref.withRef,
          withRef = _ref$withRef === undefined ? false : _ref$withRef;

      var configWithDefaults = _extends({
        overwriteOnInitialValuesChange: true,
        touchOnBlur: true,
        touchOnChange: false,
        destroyOnUnmount: true
      }, config);

      var ConnectedForm = function (_Component) {
        _inherits(ConnectedForm, _Component);

        function ConnectedForm(props) {
          _classCallCheck(this, ConnectedForm);

          var _this = _possibleConstructorReturn(this, (ConnectedForm.__proto__ || Object.getPrototypeOf(ConnectedForm)).call(this, props));

          _this.handleSubmitPassback = _this.handleSubmitPassback.bind(_this);
          return _this;
        }

        _createClass(ConnectedForm, [{
          key: 'getWrappedInstance',
          value: function getWrappedInstance() {
            invariant(withRef, 'To access the wrapped instance, you need to specify ' + '{ withRef: true } as the fourth argument of the connect() call.');
            return this.refs.wrappedInstance.refs.wrappedInstance.getWrappedInstance().refs.wrappedInstance;
          }
        }, {
          key: 'handleSubmitPassback',
          value: function handleSubmitPassback(submit) {
            this.submit = submit;
          }
        }, {
          key: 'render',
          value: function render() {
            if (withRef) {
              return React.createElement(ReduxFormConnector, _extends({}, configWithDefaults, this.props, {
                ref: 'wrappedInstance',
                submitPassback: this.handleSubmitPassback }));
            }
            return React.createElement(ReduxFormConnector, _extends({}, configWithDefaults, this.props, {
              submitPassback: this.handleSubmitPassback }));
          }
        }]);

        return ConnectedForm;
      }(Component);

      return hoistStatics(ConnectedForm, WrappedComponent);
    };
  };
};

export default createReduxForm;