import expect, { createSpy } from 'expect';
import createOnBlur from '../createOnBlur';

describe('createOnBlur', function () {
  it('should return a function', function () {
    expect(createOnBlur()).toExist().toBeA('function');
  });

  it('should return a function that calls blur with name and value', function () {
    var blur = createSpy();
    createOnBlur('foo', blur)('bar');
    expect(blur).toHaveBeenCalled().toHaveBeenCalledWith('foo', 'bar');
  });

  it('should return a function that calls blur with name and value from event', function () {
    var blur = createSpy();
    createOnBlur('foo', blur)({
      target: {
        value: 'bar'
      },
      preventDefault: function preventDefault() {
        return null;
      },
      stopPropagation: function stopPropagation() {
        return null;
      }
    });
    expect(blur).toHaveBeenCalled().toHaveBeenCalledWith('foo', 'bar');
  });

  it('should return a function that calls blur and then afterBlur with name and value', function () {
    var blur = createSpy();
    var afterBlur = createSpy();
    createOnBlur('foo', blur, false, afterBlur)('bar');
    expect(blur).toHaveBeenCalled();
    expect(afterBlur).toHaveBeenCalled().toHaveBeenCalledWith('foo', 'bar');
  });
});