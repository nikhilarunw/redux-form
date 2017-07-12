import getValue from './getValue';
var createOnChange = function createOnChange(name, change, isReactNative) {
  return function (event) {
    return change(name, getValue(event, isReactNative));
  };
};
export default createOnChange;