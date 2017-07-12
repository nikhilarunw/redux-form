import getValue from './getValue';
var createOnBlur = function createOnBlur(name, blur, isReactNative, afterBlur) {
  return function (event) {
    var value = getValue(event, isReactNative);
    blur(name, value);
    if (afterBlur) {
      afterBlur(name, value);
    }
  };
};
export default createOnBlur;