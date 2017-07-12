import expect, { createSpy } from 'expect';
import createOnDragStart, { dataKey } from '../createOnDragStart';

describe('createOnDragStart', function () {
  it('should return a function', function () {
    expect(createOnDragStart()).toExist().toBeA('function');
  });

  it('should return a function that calls dataTransfer.setData with key and result from getValue', function () {
    var getValue = createSpy().andReturn('bar');
    var setData = createSpy();
    createOnDragStart('foo', getValue)({
      dataTransfer: { setData: setData }
    });
    expect(getValue).toHaveBeenCalled();
    expect(setData).toHaveBeenCalled().toHaveBeenCalledWith(dataKey, 'bar');
  });
});