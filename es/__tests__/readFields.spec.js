var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import expect, { createSpy } from 'expect';
import readFields from '../readFields';

var createRestorableSpy = function createRestorableSpy(fn) {
  return createSpy(fn, function restore() {
    this.calls = [];
  });
};

describe('readFields', function () {
  var blur = createRestorableSpy();
  var change = createRestorableSpy();
  var focus = createRestorableSpy();
  var noValidation = function noValidation() {
    return {};
  };

  var expectField = function expectField(_ref) {
    var field = _ref.field,
        name = _ref.name,
        value = _ref.value,
        dirty = _ref.dirty,
        touched = _ref.touched,
        visited = _ref.visited,
        error = _ref.error,
        readonly = _ref.readonly,
        checked = _ref.checked;

    expect(field).toExist().toBeA('object');
    expect(field.name).toBe(name);
    expect(field.value).toEqual(value);
    if (readonly) {
      expect(field.onBlur).toNotExist();
      expect(field.onChange).toNotExist();
      expect(field.onDragStart).toNotExist();
      expect(field.onDrop).toNotExist();
      expect(field.onFocus).toNotExist();
      expect(field.onUpdate).toNotExist();
    } else {
      expect(field.onBlur).toBeA('function');
      expect(field.onChange).toBeA('function');
      expect(field.onDragStart).toBeA('function');
      expect(field.onDrop).toBeA('function');
      expect(field.onFocus).toBeA('function');
      expect(field.onUpdate).toBeA('function');
      expect(field.onUpdate).toBe(field.onChange);

      // call blur
      expect(blur.calls.length).toBe(0);
      field.onBlur('newValue');
      expect(blur.calls.length).toBe(1);
      expect(blur).toHaveBeenCalled().toHaveBeenCalledWith(name, 'newValue');

      // call change
      expect(change.calls.length).toBe(0);
      field.onChange('newValue');
      expect(change.calls.length).toBe(1);
      expect(change).toHaveBeenCalled().toHaveBeenCalledWith(name, 'newValue');

      // call focus
      expect(focus.calls.length).toBe(0);
      field.onFocus();
      expect(focus.calls.length).toBe(1);
      expect(focus).toHaveBeenCalled();
    }
    expect(field.error).toBe(error);
    expect(field.valid).toBe(!error);
    expect(field.invalid).toBe(!!error);
    expect(field.dirty).toBe(dirty);
    expect(field.pristine).toBe(!dirty);
    expect(field.touched).toBe(touched);
    expect(field.visited).toBe(visited);
    expect(field.checked).toBe(checked);

    blur.restore();
    change.restore();
    focus.restore();
  };

  it('should not provide mutators when readonly', function () {
    var result = readFields({
      asyncBlurFields: [],
      blur: blur,
      change: change,
      fields: ['foo', 'bar'],
      focus: focus,
      form: {},
      readonly: true,
      validate: noValidation
    }, {}, {});
    expectField({
      field: result.foo,
      name: 'foo',
      value: '',
      dirty: false,
      touched: false,
      visited: false,
      error: undefined,
      readonly: true
    });
    expectField({
      field: result.bar,
      name: 'bar',
      value: '',
      dirty: false,
      touched: false,
      visited: false,
      error: undefined,
      readonly: true
    });
    expect(result._meta.allPristine).toBe(true);
    expect(result._meta.allValid).toBe(true);
    expect(result._meta.values).toEqual({ foo: undefined, bar: undefined });
    expect(result._meta.errors).toEqual({});
  });

  //it('should mutate each node in the field tree up to the one that changed', () => {
  //  const props = {
  //    asyncBlurFields: [],
  //    blur,
  //    change,
  //    fields: [ 'foo.bar' ],
  //    focus,
  //    validate: noValidation
  //  };
  //  const previousFields = readFields({
  //    ...props,
  //    form: {
  //      foo: {
  //        bar: {
  //          value: 'previous'
  //        }
  //      }
  //    }
  //  }, {}, {});
  //
  //  expect(previousFields.foo.bar.value).toBe('previous');
  //
  //  const nextFields = readFields({
  //    ...props,
  //    form: {
  //      foo: {
  //        bar: {
  //          value: 'next'
  //        }
  //      }
  //    }
  //  }, {
  //    ...props,
  //    form: {
  //      foo: {
  //        bar: {
  //          value: 'previous'
  //        }
  //      }
  //    }
  //  }, previousFields);
  //
  //  const nextFoo = nextFields.foo;
  //  const nextFooBar = nextFields.foo.bar;
  //  const nextFooBarValue = nextFields.foo.bar.value;
  //
  //  expect(nextFields.foo.bar.value).toBe('next');
  //  expect(nextFields.foo.bar.value).toNotBe(previousFields.foo.bar.value);
  //  expect(nextFields.foo.bar).toNotBe(previousFields.foo.bar);
  //  expect(nextFields.foo).toNotBe(previousFields.foo);
  //});

  it('should initialize fields', function () {
    var result = readFields({
      asyncBlurFields: [],
      blur: blur,
      change: change,
      fields: ['foo', 'bar'],
      focus: focus,
      form: {
        foo: {
          value: 'fooValue'
        },
        bar: {
          value: 'barValue'
        }
      },
      validate: noValidation
    }, {}, {});
    expectField({
      field: result.foo,
      name: 'foo',
      value: 'fooValue',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      readonly: false
    });
    expectField({
      field: result.bar,
      name: 'bar',
      value: 'barValue',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      readonly: false
    });
    expect(result._meta.allPristine).toBe(false);
    expect(result._meta.allValid).toBe(true);
    expect(result._meta.values).toEqual({ foo: 'fooValue', bar: 'barValue' });
    expect(result._meta.errors).toEqual({});
  });

  it('should initialize fields with initial values', function () {
    var result = readFields({
      asyncBlurFields: [],
      blur: blur,
      change: change,
      fields: ['foo', 'bar'],
      focus: focus,
      form: {
        foo: {
          value: 'fooValue'
        },
        bar: {
          value: 43
        }
      },
      initialValues: {
        foo: 'initialFoo',
        bar: 42
      },
      validate: noValidation
    }, {}, {});
    expectField({
      field: result.foo,
      name: 'foo',
      value: 'fooValue',
      valid: true,
      dirty: true,
      error: undefined,
      visited: false,
      touched: false,
      readonly: false
    });
    expectField({
      field: result.bar,
      name: 'bar',
      value: 43,
      valid: true,
      dirty: true,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });
    expect(result._meta.allPristine).toBe(false);
    expect(result._meta.allValid).toBe(true);
    expect(result._meta.values).toEqual({ foo: 'fooValue', bar: 43 });
    expect(result._meta.errors).toEqual({});
  });

  it('should initialize fields with sync errors', function () {
    var result = readFields({
      asyncBlurFields: [],
      blur: blur,
      change: change,
      fields: ['foo', 'bar'],
      focus: focus,
      form: {
        foo: {
          value: 'fooValue'
        },
        bar: {
          value: 'barValue'
        }
      },
      validate: function validate() {
        return {
          foo: 'fooError',
          bar: 'barError'
        };
      }
    }, {}, {});
    expectField({
      field: result.foo,
      name: 'foo',
      value: 'fooValue',
      dirty: true,
      touched: false,
      visited: false,
      error: 'fooError',
      readonly: false
    });
    expectField({
      field: result.bar,
      name: 'bar',
      value: 'barValue',
      dirty: true,
      touched: false,
      visited: false,
      error: 'barError',
      readonly: false
    });
    expect(result._meta.allPristine).toBe(false);
    expect(result._meta.allValid).toBe(false);
    expect(result._meta.values).toEqual({ foo: 'fooValue', bar: 'barValue' });
    expect(result._meta.errors).toEqual({ foo: 'fooError', bar: 'barError' });
  });

  it('should initialize nested fields with sync errors', function () {
    var result = readFields({
      asyncBlurFields: [],
      blur: blur,
      change: change,
      fields: ['foo.bar'],
      focus: focus,
      form: {
        foo: {
          bar: {
            value: 'barValue'
          }
        }
      },
      validate: function validate() {
        return {
          foo: {
            bar: 'barError'
          }
        };
      }
    }, {}, {});
    expectField({
      field: result.foo.bar,
      name: 'foo.bar',
      value: 'barValue',
      dirty: true,
      touched: false,
      visited: false,
      error: 'barError',
      readonly: false
    });
    expect(result._meta.allPristine).toBe(false);
    expect(result._meta.allValid).toBe(false);
    expect(result._meta.values).toEqual({ foo: { bar: 'barValue' } });
    expect(result._meta.errors).toEqual({ foo: { bar: 'barError' } });
  });

  it('should initialize array fields with sync errors', function () {
    var result = readFields({
      asyncBlurFields: [],
      blur: blur,
      change: change,
      fields: ['foo[]', 'bar[].age'],
      focus: focus,
      form: {
        foo: [{
          value: 'fooValue'
        }],
        bar: [{
          age: {
            value: 'barValue'
          }
        }]
      },
      validate: function validate() {
        return {
          foo: ['fooError'],
          bar: [{ age: 'barError' }]
        };
      }
    }, {}, {});
    expectField({
      field: result.foo[0],
      name: 'foo[0]',
      value: 'fooValue',
      dirty: true,
      touched: false,
      visited: false,
      error: 'fooError',
      readonly: false
    });
    expectField({
      field: result.bar[0].age,
      name: 'bar[0].age',
      value: 'barValue',
      dirty: true,
      touched: false,
      visited: false,
      error: 'barError',
      readonly: false
    });
    expect(result._meta.allPristine).toBe(false);
    expect(result._meta.allValid).toBe(false);
    expect(result._meta.values).toEqual({ foo: ['fooValue'], bar: [{ age: 'barValue' }] });
    expect(result._meta.errors).toEqual({ foo: ['fooError'], bar: [{ age: 'barError' }] });
  });

  it('should update fields', function () {
    var props = {
      asyncBlurFields: [],
      blur: blur,
      change: change,
      fields: ['foo', 'bar'],
      focus: focus,
      form: {
        foo: {
          value: 'fooValue'
        },
        bar: {
          value: 'barValue'
        }
      },
      validate: noValidation
    };
    var previous = readFields(props, {}, {});
    var result = readFields(_extends({}, props, {
      form: {
        foo: {
          value: 'fooValueNew'
        },
        bar: {
          value: 'barValue'
        }
      },
      validate: noValidation
    }), _extends({}, props, {
      form: {
        foo: {
          value: 'fooValueNew'
        },
        bar: {
          value: 'barValue'
        }
      },
      validate: noValidation
    }), previous);
    expectField({
      field: result.foo,
      name: 'foo',
      value: 'fooValueNew',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      readonly: false
    });
    expectField({
      field: result.bar,
      name: 'bar',
      value: 'barValue',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      readonly: false
    });
    expect(result._meta.allPristine).toBe(false);
    expect(result._meta.allValid).toBe(true);
    expect(result._meta.values).toEqual({ foo: 'fooValueNew', bar: 'barValue' });
    expect(result._meta.errors).toEqual({});
  });

  it('should set checked for checkbox', function () {
    var result = readFields({
      asyncBlurFields: [],
      blur: blur,
      change: change,
      fields: ['foo', 'bar', 'another', 'stringBoolFoo', 'stringBoolBar', 'stringField'],
      focus: focus,
      form: {
        foo: {
          value: false
        },
        bar: {
          value: true
        },
        another: {
          value: ''
        },
        stringBoolFoo: {
          value: 'false'
        },
        stringBoolBar: {
          value: 'true'
        },
        stringField: {
          value: 'baz'
        }

      },
      validate: noValidation
    }, {}, {});
    expectField({
      field: result.foo,
      name: 'foo',
      value: false,
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      readonly: false,
      checked: false
    });
    expectField({
      field: result.bar,
      name: 'bar',
      value: true,
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      readonly: false,
      checked: true
    });
    expectField({
      field: result.another,
      name: 'another',
      value: '',
      dirty: false,
      touched: false,
      visited: false,
      error: undefined,
      readonly: false,
      checked: undefined
    });
    expectField({
      field: result.stringBoolFoo,
      name: 'stringBoolFoo',
      value: 'false',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      readonly: false,
      checked: false
    });
    expectField({
      field: result.stringBoolBar,
      name: 'stringBoolBar',
      value: 'true',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      readonly: false,
      checked: true
    });
    expectField({
      field: result.stringField,
      name: 'stringField',
      value: 'baz',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      readonly: false,
      checked: undefined
    });
  });

  it('should initialize new fields', function () {
    var props = {
      asyncBlurFields: [],
      blur: blur,
      change: change,
      fields: ['foo', 'bar'],
      focus: focus,
      form: {
        foo: {
          value: 'fooValue'
        },
        bar: {
          value: 'barValue'
        }
      },
      validate: noValidation
    };
    var previous = readFields(props, {}, {});
    var result = readFields(_extends({}, props, {
      fields: ['foo', 'bar', 'cat', 'dog']
    }), _extends({}, props, {
      fields: ['foo', 'bar', 'cat', 'dog']
    }), previous);
    expectField({
      field: result.foo,
      name: 'foo',
      value: 'fooValue',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      readonly: false
    });
    expectField({
      field: result.bar,
      name: 'bar',
      value: 'barValue',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      readonly: false
    });
    expectField({
      field: result.cat,
      name: 'cat',
      value: '',
      dirty: false,
      touched: false,
      visited: false,
      error: undefined,
      readonly: false
    });
    expectField({
      field: result.dog,
      name: 'dog',
      value: '',
      dirty: false,
      touched: false,
      visited: false,
      error: undefined,
      readonly: false
    });
    expect(result._meta.allPristine).toBe(false);
    expect(result._meta.allValid).toBe(true);
    expect(result._meta.values).toEqual({
      foo: 'fooValue',
      bar: 'barValue',
      cat: undefined,
      dog: undefined
    });
    expect(result._meta.errors).toEqual({});
  });

  it('should remove fields', function () {
    var props = {
      asyncBlurFields: [],
      blur: blur,
      change: change,
      fields: ['foo', 'bar'],
      focus: focus,
      form: {
        bar: {
          value: 'barValue'
        }
      },
      validate: noValidation
    };
    var previous = readFields(props, {}, {});
    var result = readFields(_extends({}, props, {
      fields: ['bar']
    }), props, previous);
    expect(Object.keys(result).length).toBe(1);
    expect(result.foo).toBe(undefined);
    expectField({
      field: result.bar,
      name: 'bar',
      value: 'barValue',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      readonly: false
    });
    expect(result._meta.allPristine).toBe(false);
    expect(result._meta.allValid).toBe(true);
    expect(result._meta.values).toEqual({ bar: 'barValue' });
    expect(result._meta.errors).toEqual({});
  });

  it('should handle dirty', function () {
    var result = readFields({
      asyncBlurFields: [],
      blur: blur,
      change: change,
      fields: ['foo', 'bar'],
      focus: focus,
      form: {
        foo: {
          value: 'fooValue',
          initial: 'fooValue'
        },
        bar: {
          value: 'barValue',
          initial: 'fooValue'
        }
      },
      validate: noValidation
    }, {}, {});
    expectField({
      field: result.foo,
      name: 'foo',
      value: 'fooValue',
      dirty: false,
      touched: false,
      visited: false,
      error: undefined,
      readonly: false
    });
    expectField({
      field: result.bar,
      name: 'bar',
      value: 'barValue',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      readonly: false
    });
    expect(result._meta.allPristine).toBe(false);
    expect(result._meta.allValid).toBe(true);
    expect(result._meta.values).toEqual({ foo: 'fooValue', bar: 'barValue' });
    expect(result._meta.errors).toEqual({});
  });

  it('should handle pristine', function () {
    var result = readFields({
      asyncBlurFields: [],
      blur: blur,
      change: change,
      fields: ['foo', 'bar'],
      focus: focus,
      form: {
        foo: {
          value: 'fooValue',
          initial: 'fooValue'
        },
        bar: {
          value: 'barValue',
          initial: 'barValue'
        }
      },
      validate: noValidation
    }, {}, {});
    expectField({
      field: result.foo,
      name: 'foo',
      value: 'fooValue',
      dirty: false,
      touched: false,
      visited: false,
      error: undefined,
      readonly: false
    });
    expectField({
      field: result.bar,
      name: 'bar',
      value: 'barValue',
      dirty: false,
      touched: false,
      visited: false,
      error: undefined,
      readonly: false
    });
    expect(result._meta.allPristine).toBe(true);
    expect(result._meta.allValid).toBe(true);
    expect(result._meta.values).toEqual({ foo: 'fooValue', bar: 'barValue' });
    expect(result._meta.errors).toEqual({});
  });

  it('should handle touched', function () {
    var result = readFields({
      asyncBlurFields: [],
      blur: blur,
      change: change,
      fields: ['foo', 'bar'],
      focus: focus,
      form: {
        foo: {
          value: 'fooValue',
          touched: true
        },
        bar: {
          value: 'barValue'
        }
      },
      validate: noValidation
    }, {}, {});
    expectField({
      field: result.foo,
      name: 'foo',
      value: 'fooValue',
      dirty: true,
      touched: true,
      visited: false,
      error: undefined,
      readonly: false
    });
    expectField({
      field: result.bar,
      name: 'bar',
      value: 'barValue',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      readonly: false
    });
    expect(result._meta.allPristine).toBe(false);
    expect(result._meta.allValid).toBe(true);
    expect(result._meta.values).toEqual({ foo: 'fooValue', bar: 'barValue' });
    expect(result._meta.errors).toEqual({});
  });

  it('should handle visited', function () {
    var result = readFields({
      asyncBlurFields: [],
      blur: blur,
      change: change,
      fields: ['foo', 'bar'],
      focus: focus,
      form: {
        foo: {
          value: 'fooValue',
          visited: true
        },
        bar: {
          value: 'barValue',
          visited: true
        }
      },
      validate: noValidation
    }, {}, {});
    expectField({
      field: result.foo,
      name: 'foo',
      value: 'fooValue',
      dirty: true,
      touched: false,
      visited: true,
      error: undefined,
      readonly: false
    });
    expectField({
      field: result.bar,
      name: 'bar',
      value: 'barValue',
      dirty: true,
      touched: false,
      visited: true,
      error: undefined,
      readonly: false
    });
    expect(result._meta.allPristine).toBe(false);
    expect(result._meta.allValid).toBe(true);
    expect(result._meta.values).toEqual({ foo: 'fooValue', bar: 'barValue' });
    expect(result._meta.errors).toEqual({});
  });

  it('should handle async errors', function () {
    var result = readFields({
      asyncBlurFields: [],
      blur: blur,
      change: change,
      fields: ['foo', 'bar'],
      focus: focus,
      form: {
        foo: {
          value: 'fooValue',
          asyncError: 'fooAsyncError'
        },
        bar: {
          value: 'barValue',
          asyncError: 'barAsyncError'
        }
      },
      validate: noValidation
    }, {}, {});
    expectField({
      field: result.foo,
      name: 'foo',
      value: 'fooValue',
      dirty: true,
      touched: false,
      visited: false,
      error: 'fooAsyncError',
      readonly: false
    });
    expectField({
      field: result.bar,
      name: 'bar',
      value: 'barValue',
      dirty: true,
      touched: false,
      visited: false,
      error: 'barAsyncError',
      readonly: false
    });
    expect(result._meta.allPristine).toBe(false);
    expect(result._meta.allValid).toBe(false);
    expect(result._meta.values).toEqual({ foo: 'fooValue', bar: 'barValue' });
    expect(result._meta.errors).toEqual({ foo: 'fooAsyncError', bar: 'barAsyncError' });
  });

  it('should handle submit errors', function () {
    var result = readFields({
      asyncBlurFields: [],
      blur: blur,
      change: change,
      fields: ['foo', 'bar'],
      focus: focus,
      form: {
        foo: {
          value: 'fooValue',
          submitError: 'fooSubmitError'
        },
        bar: {
          value: 'barValue',
          submitError: 'barSubmitError'
        }
      },
      validate: noValidation
    }, {}, {});
    expectField({
      field: result.foo,
      name: 'foo',
      value: 'fooValue',
      dirty: true,
      touched: false,
      visited: false,
      error: 'fooSubmitError',
      readonly: false
    });
    expectField({
      field: result.bar,
      name: 'bar',
      value: 'barValue',
      dirty: true,
      touched: false,
      visited: false,
      error: 'barSubmitError',
      readonly: false
    });
    expect(result._meta.allPristine).toBe(false);
    expect(result._meta.allValid).toBe(false);
    expect(result._meta.values).toEqual({ foo: 'fooValue', bar: 'barValue' });
    expect(result._meta.errors).toEqual({ foo: 'fooSubmitError', bar: 'barSubmitError' });
  });

  it('should prioritize submit errors over async errors', function () {
    var result = readFields({
      asyncBlurFields: [],
      blur: blur,
      change: change,
      fields: ['foo', 'bar'],
      focus: focus,
      form: {
        foo: {
          value: 'fooValue',
          asyncError: 'fooAsyncError',
          submitError: 'fooSubmitError'
        },
        bar: {
          value: 'barValue',
          asyncError: 'barAsyncError',
          submitError: 'barSubmitError'
        }
      },
      validate: noValidation
    }, {}, {});
    expectField({
      field: result.foo,
      name: 'foo',
      value: 'fooValue',
      dirty: true,
      touched: false,
      visited: false,
      error: 'fooSubmitError',
      readonly: false
    });
    expectField({
      field: result.bar,
      name: 'bar',
      value: 'barValue',
      dirty: true,
      touched: false,
      visited: false,
      error: 'barSubmitError',
      readonly: false
    });
    expect(result._meta.allPristine).toBe(false);
    expect(result._meta.allValid).toBe(false);
    expect(result._meta.values).toEqual({ foo: 'fooValue', bar: 'barValue' });
    expect(result._meta.errors).toEqual({ foo: 'fooSubmitError', bar: 'barSubmitError' });
  });

  it('should prioritize sync errors over submit errors', function () {
    var result = readFields({
      asyncBlurFields: [],
      blur: blur,
      change: change,
      fields: ['foo', 'bar'],
      focus: focus,
      form: {
        foo: {
          value: 'fooValue',
          submitError: 'fooSubmitError'
        },
        bar: {
          value: 'barValue',
          submitError: 'barSubmitError'
        }
      },
      validate: function validate() {
        return {
          foo: 'fooSyncError',
          bar: 'barSyncError'
        };
      }
    }, {}, {});
    expectField({
      field: result.foo,
      name: 'foo',
      value: 'fooValue',
      dirty: true,
      touched: false,
      visited: false,
      error: 'fooSyncError',
      readonly: false
    });
    expectField({
      field: result.bar,
      name: 'bar',
      value: 'barValue',
      dirty: true,
      touched: false,
      visited: false,
      error: 'barSyncError',
      readonly: false
    });
    expect(result._meta.allPristine).toBe(false);
    expect(result._meta.allValid).toBe(false);
    expect(result._meta.values).toEqual({ foo: 'fooValue', bar: 'barValue' });
    expect(result._meta.errors).toEqual({ foo: 'fooSyncError', bar: 'barSyncError' });
  });

  it('should handle form error via sync errors', function () {
    var result = readFields({
      asyncBlurFields: [],
      blur: blur,
      change: change,
      fields: ['foo', 'bar'],
      focus: focus,
      form: {
        foo: {
          value: 'fooValue'
        },
        bar: {
          value: 'barValue'
        }
      },
      validate: function validate() {
        return {
          _error: 'formSyncError'
        };
      }
    }, {}, {});
    expectField({
      field: result.foo,
      name: 'foo',
      value: 'fooValue',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      readonly: false
    });
    expectField({
      field: result.bar,
      name: 'bar',
      value: 'barValue',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      readonly: false
    });
    expect(result._meta.allPristine).toBe(false);
    expect(result._meta.allValid).toBe(false);
    expect(result._meta.values).toEqual({ foo: 'fooValue', bar: 'barValue' });
    expect(result._meta.errors).toEqual({});
    expect(result._meta.formError).toEqual('formSyncError');
  });

  it('should handle form error via reducer state', function () {
    var result = readFields({
      asyncBlurFields: [],
      blur: blur,
      change: change,
      fields: ['foo', 'bar'],
      focus: focus,
      form: {
        foo: {
          value: 'fooValue'
        },
        bar: {
          value: 'barValue'
        },
        _error: 'formReducerError'
      },
      validate: noValidation
    }, {}, {});
    expectField({
      field: result.foo,
      name: 'foo',
      value: 'fooValue',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      readonly: false
    });
    expectField({
      field: result.bar,
      name: 'bar',
      value: 'barValue',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      readonly: false
    });
    expect(result._meta.allPristine).toBe(false);
    expect(result._meta.allValid).toBe(false);
    expect(result._meta.values).toEqual({ foo: 'fooValue', bar: 'barValue' });
    expect(result._meta.errors).toEqual({});
    expect(result._meta.formError).toEqual('formReducerError');
  });

  it('should prioritize sync form error over reducer form error', function () {
    var result = readFields({
      asyncBlurFields: [],
      blur: blur,
      change: change,
      fields: ['foo', 'bar'],
      focus: focus,
      form: {
        foo: {
          value: 'fooValue'
        },
        bar: {
          value: 'barValue'
        },
        _error: 'formReducerError'
      },
      validate: function validate() {
        return {
          _error: 'formSyncError'
        };
      }
    }, {}, {});
    expectField({
      field: result.foo,
      name: 'foo',
      value: 'fooValue',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      readonly: false
    });
    expectField({
      field: result.bar,
      name: 'bar',
      value: 'barValue',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      readonly: false
    });
    expect(result._meta.allPristine).toBe(false);
    expect(result._meta.allValid).toBe(false);
    expect(result._meta.values).toEqual({ foo: 'fooValue', bar: 'barValue' });
    expect(result._meta.errors).toEqual({});
    expect(result._meta.formError).toEqual('formSyncError');
  });

  it('should not modify existing field object on change', function () {
    var props1 = {
      asyncBlurFields: [],
      blur: blur,
      change: change,
      fields: ['foo', 'bar'],
      focus: focus,
      form: {
        foo: {
          value: 'fooValue'
        },
        bar: {
          value: 'barValue'
        }
      },
      validate: noValidation
    };
    var result1 = readFields(props1, {}, {});
    var foo1 = result1.foo;
    var bar1 = result1.bar;
    expect(foo1.value).toBe('fooValue');
    var props2 = {
      asyncBlurFields: [],
      blur: blur,
      change: change,
      fields: ['foo', 'bar'],
      focus: focus,
      form: {
        foo: {
          value: 'newValue'
        },
        bar: {
          value: 'barValue'
        }
      },
      validate: noValidation
    };
    var result2 = readFields(props2, props1, result1);
    var foo2 = result2.foo;
    var bar2 = result2.bar;
    expect(foo1.value).toBe('fooValue');
    expect(foo2.value).toBe('newValue');
    expect(foo1).toNotBe(foo2);
    expect(bar1).toBe(bar2);
  });

  it('should init deep fields', function () {
    var result = readFields({
      asyncBlurFields: [],
      blur: blur,
      change: change,
      fields: ['foo.dog', 'foo.cat', 'bar.rat', 'bar.ram'],
      focus: focus,
      form: {},
      validate: noValidation
    }, {}, {});
    expectField({
      field: result.foo.dog,
      name: 'foo.dog',
      value: '',
      dirty: false,
      touched: false,
      visited: false,
      error: undefined,
      readonly: false
    });
    expectField({
      field: result.foo.cat,
      name: 'foo.cat',
      value: '',
      dirty: false,
      touched: false,
      visited: false,
      error: undefined,
      readonly: false
    });
    expectField({
      field: result.bar.rat,
      name: 'bar.rat',
      value: '',
      dirty: false,
      touched: false,
      visited: false,
      error: undefined,
      readonly: false
    });
    expectField({
      field: result.bar.ram,
      name: 'bar.ram',
      value: '',
      dirty: false,
      touched: false,
      visited: false,
      error: undefined,
      readonly: false
    });
  });

  it('should not error on undefined errors', function () {
    var result = readFields({
      asyncBlurFields: [],
      blur: blur,
      change: change,
      fields: ['foo'],
      focus: focus,
      form: {
        foo: {
          value: 'fooValue'
        }
      },
      validate: function validate() {
        return undefined;
      }
    }, {}, {});
    expectField({
      field: result.foo,
      name: 'foo',
      value: 'fooValue',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      readonly: false
    });
    expect(result._meta.allPristine).toBe(false);
    expect(result._meta.allValid).toBe(true);
    expect(result._meta.values).toEqual({ foo: 'fooValue' });
    expect(result._meta.errors).toEqual({});
  });
});