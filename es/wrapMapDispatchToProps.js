var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { bindActionCreators } from 'redux';

var wrapMapDispatchToProps = function wrapMapDispatchToProps(mapDispatchToProps, actionCreators) {
  if (mapDispatchToProps) {
    if (typeof mapDispatchToProps === 'function') {
      if (mapDispatchToProps.length > 1) {
        return function (dispatch, ownProps) {
          return _extends({
            dispatch: dispatch
          }, mapDispatchToProps(dispatch, ownProps), bindActionCreators(actionCreators, dispatch));
        };
      }
      return function (dispatch) {
        return _extends({
          dispatch: dispatch
        }, mapDispatchToProps(dispatch), bindActionCreators(actionCreators, dispatch));
      };
    }
    return function (dispatch) {
      return _extends({
        dispatch: dispatch
      }, bindActionCreators(mapDispatchToProps, dispatch), bindActionCreators(actionCreators, dispatch));
    };
  }
  return function (dispatch) {
    return _extends({
      dispatch: dispatch
    }, bindActionCreators(actionCreators, dispatch));
  };
};

export default wrapMapDispatchToProps;