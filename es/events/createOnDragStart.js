export var dataKey = 'value';
var createOnDragStart = function createOnDragStart(name, getValue) {
  return function (event) {
    event.dataTransfer.setData(dataKey, getValue());
  };
};

export default createOnDragStart;