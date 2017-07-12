import expect from 'expect';
import getValue from '../getValue';

describe('getValue', function () {
  it('should return value if non-event value is passed', function () {
    expect(getValue(undefined, true)).toBe(undefined);
    expect(getValue(undefined, false)).toBe(undefined);
    expect(getValue(null, true)).toBe(null);
    expect(getValue(null, false)).toBe(null);
    expect(getValue(5, true)).toBe(5);
    expect(getValue(5, false)).toBe(5);
    expect(getValue(true, true)).toBe(true);
    expect(getValue(true, false)).toBe(true);
    expect(getValue(false, true)).toBe(false);
    expect(getValue(false, false)).toBe(false);
  });

  it('should unwrap value if non-event object containing value key is passed', function () {
    expect(getValue({ value: 5 }, true)).toBe(5);
    expect(getValue({ value: 5 }, false)).toBe(5);
    expect(getValue({ value: true }, true)).toBe(true);
    expect(getValue({ value: true }, false)).toBe(true);
    expect(getValue({ value: false }, true)).toBe(false);
    expect(getValue({ value: false }, false)).toBe(false);
  });

  it('should return value if object NOT containing value key is passed', function () {
    var foo = { bar: 5, baz: 8 };
    expect(getValue(foo)).toBe(foo);
  });

  it('should return event.nativeEvent.text if defined and not react-native', function () {
    expect(getValue({
      preventDefault: function preventDefault() {
        return null;
      },
      stopPropagation: function stopPropagation() {
        return null;
      },
      nativeEvent: {
        text: 'foo'
      }
    }, false)).toBe('foo');
  });

  it('should return event.nativeEvent.text if react-native', function () {
    expect(getValue({
      preventDefault: function preventDefault() {
        return null;
      },
      stopPropagation: function stopPropagation() {
        return null;
      },
      nativeEvent: {
        text: 'foo'
      }
    }, true)).toBe('foo');
    expect(getValue({
      preventDefault: function preventDefault() {
        return null;
      },
      stopPropagation: function stopPropagation() {
        return null;
      },
      nativeEvent: {
        text: undefined
      }
    }, true)).toBe(undefined);
    expect(getValue({
      preventDefault: function preventDefault() {
        return null;
      },
      stopPropagation: function stopPropagation() {
        return null;
      },
      nativeEvent: {
        text: null
      }
    }, true)).toBe(null);
  });

  it('should return event.target.checked if checkbox', function () {
    expect(getValue({
      preventDefault: function preventDefault() {
        return null;
      },
      stopPropagation: function stopPropagation() {
        return null;
      },
      target: {
        type: 'checkbox',
        checked: true
      }
    }, true)).toBe(true);
    expect(getValue({
      preventDefault: function preventDefault() {
        return null;
      },
      stopPropagation: function stopPropagation() {
        return null;
      },
      target: {
        type: 'checkbox',
        checked: true
      }
    }, false)).toBe(true);
    expect(getValue({
      preventDefault: function preventDefault() {
        return null;
      },
      stopPropagation: function stopPropagation() {
        return null;
      },
      target: {
        type: 'checkbox',
        checked: false
      }
    }, true)).toBe(false);
    expect(getValue({
      preventDefault: function preventDefault() {
        return null;
      },
      stopPropagation: function stopPropagation() {
        return null;
      },
      target: {
        type: 'checkbox',
        checked: false
      }
    }, false)).toBe(false);
  });

  it('should return event.target.files if file', function () {
    var myFiles = ['foo', 'bar'];
    expect(getValue({
      preventDefault: function preventDefault() {
        return null;
      },
      stopPropagation: function stopPropagation() {
        return null;
      },
      target: {
        type: 'file',
        files: myFiles
      }
    }, true)).toBe(myFiles);
    expect(getValue({
      preventDefault: function preventDefault() {
        return null;
      },
      stopPropagation: function stopPropagation() {
        return null;
      },
      target: {
        type: 'file',
        files: myFiles
      }
    }, false)).toBe(myFiles);
  });

  it('should return event.dataTransfer.files if file and files not in target.files', function () {
    var myFiles = ['foo', 'bar'];
    expect(getValue({
      preventDefault: function preventDefault() {
        return null;
      },
      stopPropagation: function stopPropagation() {
        return null;
      },
      target: {
        type: 'file'
      },
      dataTransfer: {
        files: myFiles
      }
    }, true)).toBe(myFiles);
    expect(getValue({
      preventDefault: function preventDefault() {
        return null;
      },
      stopPropagation: function stopPropagation() {
        return null;
      },
      target: {
        type: 'file'
      },
      dataTransfer: {
        files: myFiles
      }
    }, false)).toBe(myFiles);
  });
  it('should return selected options if is a multiselect', function () {
    var options = [{ selected: true, value: 'foo' }, { selected: true, value: 'bar' }, { selected: false, value: 'baz' }];
    var expected = options.filter(function (option) {
      return option.selected;
    }).map(function (option) {
      return option.value;
    });
    expect(getValue({
      preventDefault: function preventDefault() {
        return null;
      },
      stopPropagation: function stopPropagation() {
        return null;
      },
      target: {
        type: 'select-multiple',
        options: options
      }
    }, true)).toEqual(expected);
    expect(getValue({
      preventDefault: function preventDefault() {
        return null;
      },
      stopPropagation: function stopPropagation() {
        return null;
      },
      target: {
        type: 'select-multiple',
        options: options
      }
    }, false)).toEqual(expected);
  });
  it('should return a number type for numeric inputs, when a value is set', function () {
    expect(getValue({
      preventDefault: function preventDefault() {
        return null;
      },
      stopPropagation: function stopPropagation() {
        return null;
      },
      target: {
        type: 'number',
        value: '3.1415'
      }
    }, true)).toBe(3.1415);
    expect(getValue({
      preventDefault: function preventDefault() {
        return null;
      },
      stopPropagation: function stopPropagation() {
        return null;
      },
      target: {
        type: 'range',
        value: '2.71828'
      }
    }, true)).toBe(2.71828);
    expect(getValue({
      preventDefault: function preventDefault() {
        return null;
      },
      stopPropagation: function stopPropagation() {
        return null;
      },
      target: {
        type: 'number',
        value: '3'
      }
    }, false)).toBe(3);
    expect(getValue({
      preventDefault: function preventDefault() {
        return null;
      },
      stopPropagation: function stopPropagation() {
        return null;
      },
      target: {
        type: 'range',
        value: '3.1415'
      }
    }, false)).toBe(3.1415);
    expect(getValue({
      preventDefault: function preventDefault() {
        return null;
      },
      stopPropagation: function stopPropagation() {
        return null;
      },
      target: {
        type: 'range',
        value: ''
      }
    }, false)).toBe('');
  });
  it('should return event.target.value if not file or checkbox', function () {
    expect(getValue({
      preventDefault: function preventDefault() {
        return null;
      },
      stopPropagation: function stopPropagation() {
        return null;
      },
      target: {
        value: undefined
      }
    }, true)).toBe(undefined);
    expect(getValue({
      preventDefault: function preventDefault() {
        return null;
      },
      stopPropagation: function stopPropagation() {
        return null;
      },
      target: {
        value: undefined
      }
    }, false)).toBe(undefined);
    expect(getValue({
      preventDefault: function preventDefault() {
        return null;
      },
      stopPropagation: function stopPropagation() {
        return null;
      },
      target: {
        value: null
      }
    }, true)).toBe(null);
    expect(getValue({
      preventDefault: function preventDefault() {
        return null;
      },
      stopPropagation: function stopPropagation() {
        return null;
      },
      target: {
        value: null
      }
    }, false)).toBe(null);
    expect(getValue({
      preventDefault: function preventDefault() {
        return null;
      },
      stopPropagation: function stopPropagation() {
        return null;
      },
      target: {
        value: true
      }
    }, true)).toBe(true);
    expect(getValue({
      preventDefault: function preventDefault() {
        return null;
      },
      stopPropagation: function stopPropagation() {
        return null;
      },
      target: {
        value: true
      }
    }, false)).toBe(true);
    expect(getValue({
      preventDefault: function preventDefault() {
        return null;
      },
      stopPropagation: function stopPropagation() {
        return null;
      },
      target: {
        value: false
      }
    }, true)).toBe(false);
    expect(getValue({
      preventDefault: function preventDefault() {
        return null;
      },
      stopPropagation: function stopPropagation() {
        return null;
      },
      target: {
        value: false
      }
    }, false)).toBe(false);
    expect(getValue({
      preventDefault: function preventDefault() {
        return null;
      },
      stopPropagation: function stopPropagation() {
        return null;
      },
      target: {
        value: 42
      }
    }, true)).toBe(42);
    expect(getValue({
      preventDefault: function preventDefault() {
        return null;
      },
      stopPropagation: function stopPropagation() {
        return null;
      },
      target: {
        value: 42
      }
    }, false)).toBe(42);
    expect(getValue({
      preventDefault: function preventDefault() {
        return null;
      },
      stopPropagation: function stopPropagation() {
        return null;
      },
      target: {
        value: 'foo'
      }
    }, true)).toBe('foo');
    expect(getValue({
      preventDefault: function preventDefault() {
        return null;
      },
      stopPropagation: function stopPropagation() {
        return null;
      },
      target: {
        value: 'foo'
      }
    }, false)).toBe('foo');
  });
  it('should return event.target.value if radio and checked', function () {
    expect(getValue({
      preventDefault: function preventDefault() {
        return null;
      },
      stopPropagation: function stopPropagation() {
        return null;
      },
      target: {
        type: 'radio',
        checked: true,
        value: 'foo'
      }
    }, true)).toBe('foo');
    expect(getValue({
      preventDefault: function preventDefault() {
        return null;
      },
      stopPropagation: function stopPropagation() {
        return null;
      },
      target: {
        type: 'radio',
        checked: true,
        value: 'foo'
      }
    }, false)).toBe('foo');
  });
  it('should return empty string if radio and not checked', function () {
    expect(getValue({
      preventDefault: function preventDefault() {
        return null;
      },
      stopPropagation: function stopPropagation() {
        return null;
      },
      target: {
        type: 'radio',
        checked: false,
        value: 'foo'
      }
    }, true)).toBe('');
    expect(getValue({
      preventDefault: function preventDefault() {
        return null;
      },
      stopPropagation: function stopPropagation() {
        return null;
      },
      target: {
        type: 'radio',
        checked: false,
        value: 'foo'
      }
    }, false)).toBe('');
  });
});