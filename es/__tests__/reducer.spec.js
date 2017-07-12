var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import expect from 'expect';
import { createStore } from 'redux';
import reducer, { globalErrorKey } from '../reducer';
import bindActionData from '../bindActionData';
import { addArrayValue, autofill, blur, change, focus, initialize, removeArrayValue, reset, startAsyncValidation, startSubmit, stopAsyncValidation, stopSubmit, swapArrayValues, touch, untouch, destroy } from '../actions';
import { isFieldValue, makeFieldValue } from '../fieldValue';

var compare = function compare(a, b) {
  if (a.value > b.value) {
    return 1;
  }
  if (a.value < b.value) {
    return -1;
  }
  return 0;
};

describe('reducer', function () {
  it('should initialize state to {}', function () {
    var state = reducer();
    expect(state).toExist().toBeA('object');
    expect(Object.keys(state).length).toBe(0);
  });

  it('should not modify state when action has no form', function () {
    var state = { foo: 'bar' };
    expect(reducer(state, { type: 'SOMETHING_ELSE' })).toBe(state);
  });

  it('should initialize form state when action has form', function () {
    var _expect$toExist$toBeA;

    var state = reducer(undefined, { form: 'foo' });
    expect(state).toExist().toBeA('object');
    expect(Object.keys(state).length).toBe(1);
    expect(state.foo).toExist().toBeA('object').toEqual((_expect$toExist$toBeA = {
      _active: undefined,
      _asyncValidating: false
    }, _defineProperty(_expect$toExist$toBeA, globalErrorKey, undefined), _defineProperty(_expect$toExist$toBeA, '_initialized', false), _defineProperty(_expect$toExist$toBeA, '_submitting', false), _defineProperty(_expect$toExist$toBeA, '_submitFailed', false), _expect$toExist$toBeA));
  });

  it('should add an empty array value with empty state', function () {
    var _expect$toEqual;

    var state = reducer({}, _extends({}, addArrayValue('myField'), {
      form: 'foo'
    }));
    expect(state.foo).toEqual((_expect$toEqual = {
      myField: [{
        value: undefined,
        _isFieldValue: true
      }],
      _active: undefined,
      _asyncValidating: false
    }, _defineProperty(_expect$toEqual, globalErrorKey, undefined), _defineProperty(_expect$toEqual, '_initialized', false), _defineProperty(_expect$toEqual, '_submitting', false), _defineProperty(_expect$toEqual, '_submitFailed', false), _expect$toEqual));
    expect(isFieldValue(state.foo.myField)).toBe(false);
    expect(isFieldValue(state.foo.myField[0])).toBe(true);
  });

  it('should add an empty deep array value with empty state', function () {
    var _expect$toEqual2;

    var state = reducer({}, _extends({}, addArrayValue('myField.myArray'), {
      form: 'foo'
    }));
    expect(state.foo).toEqual((_expect$toEqual2 = {
      myField: {
        myArray: [{
          value: undefined,
          _isFieldValue: true
        }]
      },
      _active: undefined,
      _asyncValidating: false
    }, _defineProperty(_expect$toEqual2, globalErrorKey, undefined), _defineProperty(_expect$toEqual2, '_initialized', false), _defineProperty(_expect$toEqual2, '_submitting', false), _defineProperty(_expect$toEqual2, '_submitFailed', false), _expect$toEqual2));
    expect(isFieldValue(state.foo.myField)).toBe(false);
    expect(isFieldValue(state.foo.myField.myArray)).toBe(false);
    expect(isFieldValue(state.foo.myField.myArray[0])).toBe(true);
  });

  it('should add a deep array value with initial value', function () {
    var _expect$toEqual3;

    var state = reducer({}, _extends({}, addArrayValue('myField.myArray', 20, undefined), {
      form: 'foo'
    }));
    expect(state.foo).toEqual((_expect$toEqual3 = {
      myField: {
        myArray: [{
          value: 20,
          _isFieldValue: true
        }]
      },
      _active: undefined,
      _asyncValidating: false
    }, _defineProperty(_expect$toEqual3, globalErrorKey, undefined), _defineProperty(_expect$toEqual3, '_initialized', false), _defineProperty(_expect$toEqual3, '_submitting', false), _defineProperty(_expect$toEqual3, '_submitFailed', false), _expect$toEqual3));
    expect(isFieldValue(state.foo.myField)).toBe(false);
    expect(isFieldValue(state.foo.myField.myArray)).toBe(false);
    expect(isFieldValue(state.foo.myField.myArray[0])).toBe(true);
  });

  it('should push an array value', function () {
    var _testForm, _expect$toEqual4;

    var state = reducer({
      testForm: (_testForm = {
        myField: [makeFieldValue({
          value: 'foo'
        }), makeFieldValue({
          value: 'bar'
        })],
        _active: undefined,
        _asyncValidating: false
      }, _defineProperty(_testForm, globalErrorKey, undefined), _defineProperty(_testForm, '_initialized', false), _defineProperty(_testForm, '_submitting', false), _defineProperty(_testForm, '_submitFailed', false), _testForm)
    }, _extends({}, addArrayValue('myField', 'baz'), {
      form: 'testForm'
    }));
    expect(state.testForm).toEqual((_expect$toEqual4 = {
      myField: [{
        value: 'foo',
        _isFieldValue: true
      }, {
        value: 'bar',
        _isFieldValue: true
      }, {
        value: 'baz',
        _isFieldValue: true
      }],
      _active: undefined,
      _asyncValidating: false
    }, _defineProperty(_expect$toEqual4, globalErrorKey, undefined), _defineProperty(_expect$toEqual4, '_initialized', false), _defineProperty(_expect$toEqual4, '_submitting', false), _defineProperty(_expect$toEqual4, '_submitFailed', false), _expect$toEqual4));
    expect(isFieldValue(state.testForm.myField)).toBe(false);
    expect(isFieldValue(state.testForm.myField[0])).toBe(true);
    expect(isFieldValue(state.testForm.myField[1])).toBe(true);
    expect(isFieldValue(state.testForm.myField[2])).toBe(true);
  });

  it('should insert an array value', function () {
    var _testForm2, _expect$toEqual5;

    var state = reducer({
      testForm: (_testForm2 = {
        myField: [makeFieldValue({
          value: 'foo'
        }), makeFieldValue({
          value: 'bar'
        })],
        _active: undefined,
        _asyncValidating: false
      }, _defineProperty(_testForm2, globalErrorKey, undefined), _defineProperty(_testForm2, '_initialized', false), _defineProperty(_testForm2, '_submitting', false), _defineProperty(_testForm2, '_submitFailed', false), _testForm2)
    }, _extends({}, addArrayValue('myField', 'baz', 1), {
      form: 'testForm'
    }));
    expect(state.testForm).toEqual((_expect$toEqual5 = {
      myField: [{
        value: 'foo',
        _isFieldValue: true
      }, {
        value: 'baz',
        _isFieldValue: true
      }, {
        value: 'bar',
        _isFieldValue: true
      }],
      _active: undefined,
      _asyncValidating: false
    }, _defineProperty(_expect$toEqual5, globalErrorKey, undefined), _defineProperty(_expect$toEqual5, '_initialized', false), _defineProperty(_expect$toEqual5, '_submitting', false), _defineProperty(_expect$toEqual5, '_submitFailed', false), _expect$toEqual5));
    expect(isFieldValue(state.testForm.myField)).toBe(false);
    expect(isFieldValue(state.testForm.myField[0])).toBe(true);
    expect(isFieldValue(state.testForm.myField[1])).toBe(true);
    expect(isFieldValue(state.testForm.myField[2])).toBe(true);
  });

  // TODO: Find a way to make this pass:
  /*
   it('should push an array value which is a deep object', () => {
   const state = reducer({
   testForm: {
   friends: [
   {
   name: {
   initial: 'name-1',
   value: 'name-1'
   },
   address: {
   street: {
   initial: 'street-1',
   value: 'street-1'
   },
   postalCode: {
   initial: 'postalCode-1',
   value: 'postalCode-1'
   }
   }
   },
   {
   name: {
   initial: 'name-2',
   value: 'name-2'
   },
   address: {
   street: {
   initial: 'street-2',
   value: 'street-2'
   },
   postalCode: {
   initial: 'postalCode-2',
   value: 'postalCode-2'
   }
   }
   }
   ],
   _active: undefined,
   _asyncValidating: false,
   _error: undefined,
   _initialized: false,
   _submitting: false,
   _submitFailed: false
   }
   }, {
   ...addArrayValue('friends', {
   name: 'name-3',
   address: {
   street: 'street-3',
   postalCode: 'postalCode-3'
   }
   }, undefined),
   form: 'testForm'
   });
   expect(state.testForm)
   .toEqual({
   friends: [
   {
   name: {
   initial: 'name-1',
   value: 'name-1'
   },
   address: {
   street: {
   initial: 'street-1',
   value: 'street-1'
   },
   postalCode: {
   initial: 'postalCode-1',
   value: 'postalCode-1'
   }
   }
   },
   {
   name: {
   initial: 'name-2',
   value: 'name-2'
   },
   address: {
   street: {
   initial: 'street-2',
   value: 'street-2'
   },
   postalCode: {
   initial: 'postalCode-2',
   value: 'postalCode-2'
   }
   }
   },
   {
   name: {
   initial: 'name-3',
   value: 'name-3'
   },
   address: {
   street: {
   initial: 'street-3',
   value: 'street-3'
   },
   postalCode: {
   initial: 'postalCode-3',
   value: 'postalCode-3'
   }
   }
   }
   ],
   _active: undefined,
   _asyncValidating: false,
   _error: undefined,
   _initialized: false,
   _submitting: false,
   _submitFailed: false
   });
   });
   */

  it('should push a deep array value which is a nested object', function () {
    var state = reducer({
      testForm: {
        myField: [{
          foo: makeFieldValue({
            initial: { a: 'foo-a1', b: 'foo-b1' },
            value: { a: 'foo-a1', b: 'foo-b1' }
          }),
          bar: makeFieldValue({
            initial: { a: 'bar-a1', b: 'bar-b1' },
            value: { a: 'bar-a1', b: 'bar-b1' }
          })
        }, {
          foo: makeFieldValue({
            initial: { a: 'foo-a2', b: 'foo-b2' },
            value: { a: 'foo-a2', b: 'foo-b2' }
          }),
          bar: makeFieldValue({
            initial: { a: 'bar-a2', b: 'bar-b2' },
            value: { a: 'bar-a2', b: 'bar-b2' }
          })
        }],
        _active: undefined,
        _asyncValidating: false,
        _error: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      }
    }, _extends({}, addArrayValue('myField', {
      foo: { a: 'foo-a3', b: 'foo-b3' },
      bar: { a: 'bar-a3', b: 'bar-b3' }
    }, undefined), {
      form: 'testForm'
    }));
    expect(state.testForm).toEqual({
      myField: [{
        foo: {
          initial: { a: 'foo-a1', b: 'foo-b1' },
          value: { a: 'foo-a1', b: 'foo-b1' },
          _isFieldValue: true
        },
        bar: {
          initial: { a: 'bar-a1', b: 'bar-b1' },
          value: { a: 'bar-a1', b: 'bar-b1' },
          _isFieldValue: true
        }
      }, {
        foo: {
          initial: { a: 'foo-a2', b: 'foo-b2' },
          value: { a: 'foo-a2', b: 'foo-b2' },
          _isFieldValue: true
        },
        bar: {
          initial: { a: 'bar-a2', b: 'bar-b2' },
          value: { a: 'bar-a2', b: 'bar-b2' },
          _isFieldValue: true
        }
      }, {
        foo: {
          initial: { a: 'foo-a3', b: 'foo-b3' },
          value: { a: 'foo-a3', b: 'foo-b3' },
          _isFieldValue: true
        },
        bar: {
          initial: { a: 'bar-a3', b: 'bar-b3' },
          value: { a: 'bar-a3', b: 'bar-b3' },
          _isFieldValue: true
        }
      }],
      _active: undefined,
      _asyncValidating: false,
      _error: undefined,
      _initialized: false,
      _submitting: false,
      _submitFailed: false
    });
    expect(isFieldValue(state.testForm.myField)).toBe(false);
    expect(isFieldValue(state.testForm.myField[0])).toBe(false);
    expect(isFieldValue(state.testForm.myField[0].foo)).toBe(true);
    expect(isFieldValue(state.testForm.myField[0].bar)).toBe(true);
    expect(isFieldValue(state.testForm.myField[1])).toBe(false);
    expect(isFieldValue(state.testForm.myField[1].foo)).toBe(true);
    expect(isFieldValue(state.testForm.myField[1].bar)).toBe(true);
    expect(isFieldValue(state.testForm.myField[2])).toBe(false);
    expect(isFieldValue(state.testForm.myField[2].foo)).toBe(true);
    expect(isFieldValue(state.testForm.myField[2].bar)).toBe(true);
  });

  it('should push a subarray value which is an object', function () {
    var state = reducer({
      testForm: {
        myField: [{
          myField2: [{
            foo: makeFieldValue({
              initial: 'foo-1-1',
              value: 'foo-1-1'
            }),
            bar: makeFieldValue({
              initial: 'bar-1-1',
              value: 'bar-1-1'
            })
          }, {
            foo: makeFieldValue({
              initial: 'foo-1-2',
              value: 'foo-1-2'
            }),
            bar: makeFieldValue({
              initial: 'bar-1-2',
              value: 'bar-1-2'
            })
          }]
        }, {
          myField2: [{
            foo: makeFieldValue({
              initial: 'foo-2-1',
              value: 'foo-2-1'
            }),
            bar: makeFieldValue({
              initial: 'bar-2-1',
              value: 'bar-2-1'
            })
          }, {
            foo: makeFieldValue({
              initial: 'foo-2-2',
              value: 'foo-2-2'
            }),
            bar: makeFieldValue({
              initial: 'bar-2-2',
              value: 'bar-2-2'
            })
          }]
        }],
        _active: undefined,
        _asyncValidating: false,
        _error: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      }
    }, _extends({}, addArrayValue('myField[1].myField2', { foo: 'foo-2-3', bar: 'bar-2-3' }, undefined), {
      form: 'testForm'
    }));
    expect(state.testForm).toEqual({
      myField: [{
        myField2: [{
          foo: {
            initial: 'foo-1-1',
            value: 'foo-1-1',
            _isFieldValue: true
          },
          bar: {
            initial: 'bar-1-1',
            value: 'bar-1-1',
            _isFieldValue: true
          }
        }, {
          foo: {
            initial: 'foo-1-2',
            value: 'foo-1-2',
            _isFieldValue: true
          },
          bar: {
            initial: 'bar-1-2',
            value: 'bar-1-2',
            _isFieldValue: true
          }
        }]
      }, {
        myField2: [{
          foo: {
            initial: 'foo-2-1',
            value: 'foo-2-1',
            _isFieldValue: true
          },
          bar: {
            initial: 'bar-2-1',
            value: 'bar-2-1',
            _isFieldValue: true
          }
        }, {
          foo: {
            initial: 'foo-2-2',
            value: 'foo-2-2',
            _isFieldValue: true
          },
          bar: {
            initial: 'bar-2-2',
            value: 'bar-2-2',
            _isFieldValue: true
          }
        }, {
          foo: {
            initial: 'foo-2-3',
            value: 'foo-2-3',
            _isFieldValue: true
          },
          bar: {
            initial: 'bar-2-3',
            value: 'bar-2-3',
            _isFieldValue: true
          }
        }]
      }],
      _active: undefined,
      _asyncValidating: false,
      _error: undefined,
      _initialized: false,
      _submitting: false,
      _submitFailed: false
    });
    expect(isFieldValue(state.testForm.myField)).toBe(false);
    expect(isFieldValue(state.testForm.myField[0])).toBe(false);
    expect(isFieldValue(state.testForm.myField[0].myField2)).toBe(false);
    expect(isFieldValue(state.testForm.myField[0].myField2[0])).toBe(false);
    expect(isFieldValue(state.testForm.myField[0].myField2[0].foo)).toBe(true);
    expect(isFieldValue(state.testForm.myField[0].myField2[0].bar)).toBe(true);
    expect(isFieldValue(state.testForm.myField[0].myField2[1])).toBe(false);
    expect(isFieldValue(state.testForm.myField[0].myField2[1].foo)).toBe(true);
    expect(isFieldValue(state.testForm.myField[0].myField2[1].bar)).toBe(true);
    expect(isFieldValue(state.testForm.myField[1])).toBe(false);
    expect(isFieldValue(state.testForm.myField[1].myField2)).toBe(false);
    expect(isFieldValue(state.testForm.myField[1].myField2[0])).toBe(false);
    expect(isFieldValue(state.testForm.myField[1].myField2[0].foo)).toBe(true);
    expect(isFieldValue(state.testForm.myField[1].myField2[0].bar)).toBe(true);
    expect(isFieldValue(state.testForm.myField[1].myField2[1])).toBe(false);
    expect(isFieldValue(state.testForm.myField[1].myField2[1].foo)).toBe(true);
    expect(isFieldValue(state.testForm.myField[1].myField2[1].bar)).toBe(true);
    expect(isFieldValue(state.testForm.myField[1].myField2[2])).toBe(false);
    expect(isFieldValue(state.testForm.myField[1].myField2[2].foo)).toBe(true);
    expect(isFieldValue(state.testForm.myField[1].myField2[2].bar)).toBe(true);
  });

  it('should set value on autofill with empty state', function () {
    var _expect$toEqual6;

    var state = reducer({}, _extends({}, autofill('myField', 'myValue'), {
      form: 'foo'
    }));
    expect(state.foo).toEqual((_expect$toEqual6 = {
      myField: {
        value: 'myValue',
        autofilled: true,
        _isFieldValue: true
      },
      _active: undefined,
      _asyncValidating: false
    }, _defineProperty(_expect$toEqual6, globalErrorKey, undefined), _defineProperty(_expect$toEqual6, '_initialized', false), _defineProperty(_expect$toEqual6, '_submitting', false), _defineProperty(_expect$toEqual6, '_submitFailed', false), _expect$toEqual6));
    expect(isFieldValue(state.foo.myField)).toBe(true);
  });

  it('should set value on autofill with initial value', function () {
    var _foo, _expect$toEqual7;

    var state = reducer({
      foo: (_foo = {
        myField: makeFieldValue({
          value: 'initial'
        }),
        _active: 'myField',
        _asyncValidating: false
      }, _defineProperty(_foo, globalErrorKey, 'Some global error'), _defineProperty(_foo, '_initialized', false), _defineProperty(_foo, '_submitting', false), _defineProperty(_foo, '_submitFailed', false), _foo)
    }, _extends({}, autofill('myField', 'different'), {
      form: 'foo'
    }));
    expect(state.foo).toEqual((_expect$toEqual7 = {
      myField: {
        value: 'different',
        autofilled: true,
        _isFieldValue: true
      },
      _active: 'myField',
      _asyncValidating: false
    }, _defineProperty(_expect$toEqual7, globalErrorKey, 'Some global error'), _defineProperty(_expect$toEqual7, '_initialized', false), _defineProperty(_expect$toEqual7, '_submitting', false), _defineProperty(_expect$toEqual7, '_submitFailed', false), _expect$toEqual7));
    expect(isFieldValue(state.foo.myField)).toBe(true);
  });

  it('should set value on blur with empty state', function () {
    var _expect$toEqual8;

    var state = reducer({}, _extends({}, blur('myField', 'myValue'), {
      form: 'foo'
    }));
    expect(state.foo).toEqual((_expect$toEqual8 = {
      myField: {
        value: 'myValue',
        _isFieldValue: true
      },
      _asyncValidating: false
    }, _defineProperty(_expect$toEqual8, globalErrorKey, undefined), _defineProperty(_expect$toEqual8, '_initialized', false), _defineProperty(_expect$toEqual8, '_submitting', false), _defineProperty(_expect$toEqual8, '_submitFailed', false), _expect$toEqual8));
    expect(isFieldValue(state.foo.myField)).toBe(true);
  });

  it('should set value on blur and touch with empty state', function () {
    var _expect$toEqual9;

    var state = reducer({}, _extends({}, blur('myField', 'myValue'), {
      form: 'foo',
      touch: true
    }));
    expect(state.foo).toEqual((_expect$toEqual9 = {
      myField: {
        value: 'myValue',
        touched: true,
        _isFieldValue: true
      },
      _asyncValidating: false
    }, _defineProperty(_expect$toEqual9, globalErrorKey, undefined), _defineProperty(_expect$toEqual9, '_initialized', false), _defineProperty(_expect$toEqual9, '_submitting', false), _defineProperty(_expect$toEqual9, '_submitFailed', false), _expect$toEqual9));
    expect(isFieldValue(state.foo.myField)).toBe(true);
  });

  it('should set value on blur and touch with initial value', function () {
    var _foo2, _expect$toEqual10;

    var state = reducer({
      foo: (_foo2 = {
        myField: makeFieldValue({
          initial: 'initialValue',
          value: 'initialValue',
          touched: false
        }),
        _asyncValidating: false
      }, _defineProperty(_foo2, globalErrorKey, undefined), _defineProperty(_foo2, '_initialized', false), _defineProperty(_foo2, '_submitting', false), _defineProperty(_foo2, '_submitFailed', false), _foo2)
    }, _extends({}, blur('myField', 'myValue'), {
      form: 'foo',
      touch: true
    }));
    expect(state.foo).toEqual((_expect$toEqual10 = {
      myField: {
        initial: 'initialValue',
        value: 'myValue',
        touched: true,
        _isFieldValue: true
      },
      _asyncValidating: false
    }, _defineProperty(_expect$toEqual10, globalErrorKey, undefined), _defineProperty(_expect$toEqual10, '_initialized', false), _defineProperty(_expect$toEqual10, '_submitting', false), _defineProperty(_expect$toEqual10, '_submitFailed', false), _expect$toEqual10));
    expect(isFieldValue(state.foo.myField)).toBe(true);
  });

  it('should not modify value if undefined is passed on blur (for android react native)', function () {
    var _foo3, _expect$toEqual11;

    var state = reducer({
      foo: (_foo3 = {
        myField: makeFieldValue({
          initial: 'initialValue',
          value: 'myValue',
          touched: false
        }),
        _active: 'myField',
        _asyncValidating: false
      }, _defineProperty(_foo3, globalErrorKey, undefined), _defineProperty(_foo3, '_initialized', false), _defineProperty(_foo3, '_submitting', false), _defineProperty(_foo3, '_submitFailed', false), _foo3)
    }, _extends({}, blur('myField'), {
      form: 'foo',
      touch: true
    }));
    expect(state.foo).toEqual((_expect$toEqual11 = {
      myField: {
        initial: 'initialValue',
        value: 'myValue',
        touched: true,
        _isFieldValue: true
      },
      _asyncValidating: false
    }, _defineProperty(_expect$toEqual11, globalErrorKey, undefined), _defineProperty(_expect$toEqual11, '_initialized', false), _defineProperty(_expect$toEqual11, '_submitting', false), _defineProperty(_expect$toEqual11, '_submitFailed', false), _expect$toEqual11));
    expect(isFieldValue(state.foo.myField)).toBe(true);
  });

  it('should not modify value if undefined is passed on blur, even if no value existed (for android react native)', function () {
    var _foo4, _expect$toEqual12;

    var state = reducer({
      foo: (_foo4 = {
        myField: makeFieldValue({
          value: undefined
        }),
        _active: 'myField',
        _asyncValidating: false
      }, _defineProperty(_foo4, globalErrorKey, undefined), _defineProperty(_foo4, '_initialized', false), _defineProperty(_foo4, '_submitting', false), _defineProperty(_foo4, '_submitFailed', false), _foo4)
    }, _extends({}, blur('myField'), {
      form: 'foo',
      touch: true
    }));
    expect(state.foo).toEqual((_expect$toEqual12 = {
      myField: {
        value: undefined,
        touched: true,
        _isFieldValue: true
      },
      _asyncValidating: false
    }, _defineProperty(_expect$toEqual12, globalErrorKey, undefined), _defineProperty(_expect$toEqual12, '_initialized', false), _defineProperty(_expect$toEqual12, '_submitting', false), _defineProperty(_expect$toEqual12, '_submitFailed', false), _expect$toEqual12));
    expect(isFieldValue(state.foo.myField)).toBe(true);
  });

  it('should set nested value on blur', function () {
    var _foo5, _expect$toEqual13;

    var state = reducer({
      foo: (_foo5 = {
        myField: {
          mySubField: makeFieldValue({
            value: undefined
          })
        },
        _active: 'myField.mySubField',
        _asyncValidating: false
      }, _defineProperty(_foo5, globalErrorKey, undefined), _defineProperty(_foo5, '_initialized', false), _defineProperty(_foo5, '_submitting', false), _defineProperty(_foo5, '_submitFailed', false), _foo5)
    }, _extends({}, blur('myField.mySubField', 'hello'), {
      form: 'foo',
      touch: true
    }));
    expect(state.foo).toEqual((_expect$toEqual13 = {
      myField: {
        mySubField: {
          value: 'hello',
          touched: true,
          _isFieldValue: true
        }
      },
      _asyncValidating: false
    }, _defineProperty(_expect$toEqual13, globalErrorKey, undefined), _defineProperty(_expect$toEqual13, '_initialized', false), _defineProperty(_expect$toEqual13, '_submitting', false), _defineProperty(_expect$toEqual13, '_submitFailed', false), _expect$toEqual13));
    expect(isFieldValue(state.foo.myField)).toBe(false);
    expect(isFieldValue(state.foo.myField.mySubField)).toBe(true);
  });

  it('should set array value on blur', function () {
    var _foo6, _expect$toEqual14;

    var state = reducer({
      foo: (_foo6 = {
        myArray: [makeFieldValue({ value: undefined })],
        _active: 'myArray[0]',
        _asyncValidating: false
      }, _defineProperty(_foo6, globalErrorKey, undefined), _defineProperty(_foo6, '_initialized', false), _defineProperty(_foo6, '_submitting', false), _defineProperty(_foo6, '_submitFailed', false), _foo6)
    }, _extends({}, blur('myArray[0]', 'hello'), {
      form: 'foo',
      touch: true
    }));
    expect(state.foo).toEqual((_expect$toEqual14 = {
      myArray: [{
        value: 'hello',
        touched: true,
        _isFieldValue: true
      }],
      _asyncValidating: false
    }, _defineProperty(_expect$toEqual14, globalErrorKey, undefined), _defineProperty(_expect$toEqual14, '_initialized', false), _defineProperty(_expect$toEqual14, '_submitting', false), _defineProperty(_expect$toEqual14, '_submitFailed', false), _expect$toEqual14));
    expect(isFieldValue(state.foo.myArray[0])).toBe(true);
  });

  it('should set value on change with empty state', function () {
    var _expect$toEqual15;

    var state = reducer({}, _extends({}, change('myField', 'myValue'), {
      form: 'foo'
    }));
    expect(state.foo).toEqual((_expect$toEqual15 = {
      myField: {
        value: 'myValue',
        _isFieldValue: true
      },
      _active: undefined, // CHANGE doesn't touch _active
      _asyncValidating: false
    }, _defineProperty(_expect$toEqual15, globalErrorKey, undefined), _defineProperty(_expect$toEqual15, '_initialized', false), _defineProperty(_expect$toEqual15, '_submitting', false), _defineProperty(_expect$toEqual15, '_submitFailed', false), _expect$toEqual15));
    expect(isFieldValue(state.foo.myField)).toBe(true);
  });

  it('should set value on change and touch with empty state', function () {
    var _expect$toEqual16;

    var state = reducer({}, _extends({}, change('myField', 'myValue'), {
      form: 'foo',
      touch: true
    }));
    expect(state.foo).toEqual((_expect$toEqual16 = {
      myField: {
        value: 'myValue',
        touched: true,
        _isFieldValue: true
      },
      _active: undefined, // CHANGE doesn't touch _active
      _asyncValidating: false
    }, _defineProperty(_expect$toEqual16, globalErrorKey, undefined), _defineProperty(_expect$toEqual16, '_initialized', false), _defineProperty(_expect$toEqual16, '_submitting', false), _defineProperty(_expect$toEqual16, '_submitFailed', false), _expect$toEqual16));
    expect(isFieldValue(state.foo.myField)).toBe(true);
  });

  it('should set value on change and touch with initial value', function () {
    var _foo7, _expect$toEqual17;

    var state = reducer({
      foo: (_foo7 = {
        myField: makeFieldValue({
          initial: 'initialValue',
          value: 'initialValue',
          touched: false
        }),
        _active: 'myField',
        _asyncValidating: false
      }, _defineProperty(_foo7, globalErrorKey, 'Some global error'), _defineProperty(_foo7, '_initialized', false), _defineProperty(_foo7, '_submitting', false), _defineProperty(_foo7, '_submitFailed', false), _foo7)
    }, _extends({}, change('myField', 'myValue'), {
      form: 'foo',
      touch: true
    }));
    expect(state.foo).toEqual((_expect$toEqual17 = {
      myField: {
        initial: 'initialValue',
        value: 'myValue',
        touched: true,
        _isFieldValue: true
      },
      _active: 'myField',
      _asyncValidating: false
    }, _defineProperty(_expect$toEqual17, globalErrorKey, 'Some global error'), _defineProperty(_expect$toEqual17, '_initialized', false), _defineProperty(_expect$toEqual17, '_submitting', false), _defineProperty(_expect$toEqual17, '_submitFailed', false), _expect$toEqual17));
    expect(isFieldValue(state.foo.myField)).toBe(true);
  });

  it('should set value on change and remove field-level submit and async errors', function () {
    var _foo8, _expect$toEqual18;

    var state = reducer({
      foo: (_foo8 = {
        myField: makeFieldValue({
          value: 'initial',
          submitError: 'submit error',
          asyncError: 'async error'
        }),
        _active: 'myField',
        _asyncValidating: false
      }, _defineProperty(_foo8, globalErrorKey, 'Some global error'), _defineProperty(_foo8, '_initialized', false), _defineProperty(_foo8, '_submitting', false), _defineProperty(_foo8, '_submitFailed', false), _foo8)
    }, _extends({}, change('myField', 'different'), {
      form: 'foo'
    }));
    expect(state.foo).toEqual((_expect$toEqual18 = {
      myField: {
        value: 'different',
        _isFieldValue: true
      },
      _active: 'myField',
      _asyncValidating: false
    }, _defineProperty(_expect$toEqual18, globalErrorKey, 'Some global error'), _defineProperty(_expect$toEqual18, '_initialized', false), _defineProperty(_expect$toEqual18, '_submitting', false), _defineProperty(_expect$toEqual18, '_submitFailed', false), _expect$toEqual18));
    expect(isFieldValue(state.foo.myField)).toBe(true);
  });

  it('should set value on change and remove autofilled', function () {
    var _foo9, _expect$toEqual19;

    var state = reducer({
      foo: (_foo9 = {
        myField: makeFieldValue({
          value: 'initial',
          autofilled: true
        }),
        _active: 'myField',
        _asyncValidating: false
      }, _defineProperty(_foo9, globalErrorKey, 'Some global error'), _defineProperty(_foo9, '_initialized', false), _defineProperty(_foo9, '_submitting', false), _defineProperty(_foo9, '_submitFailed', false), _foo9)
    }, _extends({}, change('myField', 'different'), {
      form: 'foo'
    }));
    expect(state.foo).toEqual((_expect$toEqual19 = {
      myField: {
        value: 'different',
        _isFieldValue: true
      },
      _active: 'myField',
      _asyncValidating: false
    }, _defineProperty(_expect$toEqual19, globalErrorKey, 'Some global error'), _defineProperty(_expect$toEqual19, '_initialized', false), _defineProperty(_expect$toEqual19, '_submitting', false), _defineProperty(_expect$toEqual19, '_submitFailed', false), _expect$toEqual19));
    expect(isFieldValue(state.foo.myField)).toBe(true);
  });

  it('should set nested value on change with empty state', function () {
    var _expect$toEqual20;

    var state = reducer({}, _extends({}, change('myField.mySubField', 'myValue'), {
      form: 'foo'
    }));
    expect(state.foo).toEqual((_expect$toEqual20 = {
      myField: {
        mySubField: {
          value: 'myValue',
          _isFieldValue: true
        }
      },
      _active: undefined, // CHANGE doesn't touch _active
      _asyncValidating: false
    }, _defineProperty(_expect$toEqual20, globalErrorKey, undefined), _defineProperty(_expect$toEqual20, '_initialized', false), _defineProperty(_expect$toEqual20, '_submitting', false), _defineProperty(_expect$toEqual20, '_submitFailed', false), _expect$toEqual20));
    expect(isFieldValue(state.foo.myField)).toBe(false);
    expect(isFieldValue(state.foo.myField.mySubField)).toBe(true);
  });

  it('should set visited on focus and update active with no previous state', function () {
    var _expect$toEqual21;

    var state = reducer({}, _extends({}, focus('myField'), {
      form: 'foo'
    }));
    expect(state.foo).toEqual((_expect$toEqual21 = {
      myField: {
        visited: true,
        _isFieldValue: true
      },
      _active: 'myField',
      _asyncValidating: false
    }, _defineProperty(_expect$toEqual21, globalErrorKey, undefined), _defineProperty(_expect$toEqual21, '_initialized', false), _defineProperty(_expect$toEqual21, '_submitting', false), _defineProperty(_expect$toEqual21, '_submitFailed', false), _expect$toEqual21));
    expect(isFieldValue(state.foo.myField)).toBe(true);
  });

  it('should set visited on focus and update active on deep field with no previous state', function () {
    var _expect$toEqual22;

    var state = reducer({}, _extends({}, focus('myField.subField'), {
      form: 'foo'
    }));
    expect(state.foo).toEqual((_expect$toEqual22 = {
      myField: {
        subField: {
          visited: true,
          _isFieldValue: true
        }
      },
      _active: 'myField.subField',
      _asyncValidating: false
    }, _defineProperty(_expect$toEqual22, globalErrorKey, undefined), _defineProperty(_expect$toEqual22, '_initialized', false), _defineProperty(_expect$toEqual22, '_submitting', false), _defineProperty(_expect$toEqual22, '_submitFailed', false), _expect$toEqual22));
    expect(isFieldValue(state.foo.myField)).toBe(false);
    expect(isFieldValue(state.foo.myField.subField)).toBe(true);
  });

  it('should set visited on focus and update current with previous state', function () {
    var _foo10, _expect$toEqual23;

    var state = reducer({
      foo: (_foo10 = {
        myField: makeFieldValue({
          initial: 'initialValue',
          value: 'initialValue',
          visited: false
        }),
        _active: 'otherField',
        _asyncValidating: false
      }, _defineProperty(_foo10, globalErrorKey, undefined), _defineProperty(_foo10, '_initialized', false), _defineProperty(_foo10, '_submitting', false), _defineProperty(_foo10, '_submitFailed', false), _foo10)
    }, _extends({}, focus('myField'), {
      form: 'foo'
    }));
    expect(state.foo).toEqual((_expect$toEqual23 = {
      myField: {
        initial: 'initialValue',
        value: 'initialValue',
        visited: true,
        _isFieldValue: true
      },
      _active: 'myField',
      _asyncValidating: false
    }, _defineProperty(_expect$toEqual23, globalErrorKey, undefined), _defineProperty(_expect$toEqual23, '_initialized', false), _defineProperty(_expect$toEqual23, '_submitting', false), _defineProperty(_expect$toEqual23, '_submitFailed', false), _expect$toEqual23));
    expect(isFieldValue(state.foo.myField)).toBe(true);
  });

  it('should set initialize values on initialize on empty state', function () {
    var _expect$toEqual24;

    var state = reducer({}, _extends({}, initialize({ myField: 'initialValue' }, ['myField']), {
      form: 'foo'
    }));
    expect(state.foo).toEqual((_expect$toEqual24 = {
      myField: {
        initial: 'initialValue',
        value: 'initialValue',
        _isFieldValue: true
      },
      _active: undefined,
      _asyncValidating: false
    }, _defineProperty(_expect$toEqual24, globalErrorKey, undefined), _defineProperty(_expect$toEqual24, '_initialized', true), _defineProperty(_expect$toEqual24, '_submitting', false), _defineProperty(_expect$toEqual24, '_submitFailed', false), _expect$toEqual24));
    expect(isFieldValue(state.foo.myField)).toBe(true);
  });

  it('should allow initializing null values', function () {
    var _expect$toEqual25;

    var state = reducer({}, _extends({}, initialize({ bar: 'baz', dog: null }, ['bar', 'dog']), {
      form: 'foo'
    }));
    expect(state.foo).toEqual((_expect$toEqual25 = {
      bar: {
        initial: 'baz',
        value: 'baz',
        _isFieldValue: true
      },
      dog: {
        initial: null,
        value: null,
        _isFieldValue: true
      },
      _active: undefined,
      _asyncValidating: false
    }, _defineProperty(_expect$toEqual25, globalErrorKey, undefined), _defineProperty(_expect$toEqual25, '_initialized', true), _defineProperty(_expect$toEqual25, '_submitting', false), _defineProperty(_expect$toEqual25, '_submitFailed', false), _expect$toEqual25));
    expect(isFieldValue(state.foo.bar)).toBe(true);
    expect(isFieldValue(state.foo.dog)).toBe(true);
  });

  it('should initialize nested values on initialize on empty state', function () {
    var _expect$toEqual26;

    var state = reducer({}, _extends({}, initialize({ myField: { subField: 'initialValue' } }, ['myField.subField'], {}), {
      form: 'foo'
    }));
    expect(state.foo).toEqual((_expect$toEqual26 = {
      myField: {
        subField: {
          initial: 'initialValue',
          value: 'initialValue',
          _isFieldValue: true
        }
      },
      _active: undefined,
      _asyncValidating: false
    }, _defineProperty(_expect$toEqual26, globalErrorKey, undefined), _defineProperty(_expect$toEqual26, '_initialized', true), _defineProperty(_expect$toEqual26, '_submitting', false), _defineProperty(_expect$toEqual26, '_submitFailed', false), _expect$toEqual26));
    expect(isFieldValue(state.foo.myField)).toBe(false);
    expect(isFieldValue(state.foo.myField.subField)).toBe(true);
  });

  it('should initialize array values on initialize on empty state', function () {
    var _expect$toEqual27;

    var state = reducer({}, _extends({}, initialize({ myField: ['initialValue'] }, ['myField[]'], {}), {
      form: 'foo'
    }));
    expect(state.foo).toEqual((_expect$toEqual27 = {
      myField: [{
        initial: 'initialValue',
        value: 'initialValue',
        _isFieldValue: true
      }],
      _active: undefined,
      _asyncValidating: false
    }, _defineProperty(_expect$toEqual27, globalErrorKey, undefined), _defineProperty(_expect$toEqual27, '_initialized', true), _defineProperty(_expect$toEqual27, '_submitting', false), _defineProperty(_expect$toEqual27, '_submitFailed', false), _expect$toEqual27));
    expect(isFieldValue(state.foo.myField)).toBe(false);
    expect(isFieldValue(state.foo.myField[0])).toBe(true);
  });

  it('should initialize array values with subvalues on initialize on empty state', function () {
    var _expect$toEqual28;

    var state = reducer({}, _extends({}, initialize({
      accounts: [{
        name: 'Bobby Tables',
        email: 'bobby@gmail.com'
      }, {
        name: 'Sammy Tables',
        email: 'sammy@gmail.com'
      }]
    }, ['accounts[].name', 'accounts[].email'], {}), {
      form: 'foo'
    }));
    expect(state.foo).toEqual((_expect$toEqual28 = {
      accounts: [{
        name: {
          initial: 'Bobby Tables',
          value: 'Bobby Tables',
          _isFieldValue: true
        },
        email: {
          initial: 'bobby@gmail.com',
          value: 'bobby@gmail.com',
          _isFieldValue: true
        }
      }, {
        name: {
          initial: 'Sammy Tables',
          value: 'Sammy Tables',
          _isFieldValue: true
        },
        email: {
          initial: 'sammy@gmail.com',
          value: 'sammy@gmail.com',
          _isFieldValue: true
        }
      }],
      _active: undefined,
      _asyncValidating: false
    }, _defineProperty(_expect$toEqual28, globalErrorKey, undefined), _defineProperty(_expect$toEqual28, '_initialized', true), _defineProperty(_expect$toEqual28, '_submitting', false), _defineProperty(_expect$toEqual28, '_submitFailed', false), _expect$toEqual28));
    expect(isFieldValue(state.foo.accounts)).toBe(false);
    expect(isFieldValue(state.foo.accounts[0])).toBe(false);
    expect(isFieldValue(state.foo.accounts[0].name)).toBe(true);
    expect(isFieldValue(state.foo.accounts[0].email)).toBe(true);
    expect(isFieldValue(state.foo.accounts[1])).toBe(false);
    expect(isFieldValue(state.foo.accounts[1].name)).toBe(true);
    expect(isFieldValue(state.foo.accounts[1].email)).toBe(true);
  });

  it('should set initialize values, making form pristine when initializing', function () {
    var _foo11, _expect$toEqual29;

    var state = reducer({
      foo: (_foo11 = {
        myField: makeFieldValue({
          value: 'dirtyValue',
          touched: true
        }),
        _active: 'myField',
        _asyncValidating: false
      }, _defineProperty(_foo11, globalErrorKey, undefined), _defineProperty(_foo11, '_initialized', false), _defineProperty(_foo11, '_submitting', false), _defineProperty(_foo11, '_submitFailed', false), _foo11)
    }, _extends({}, initialize({ myField: 'cleanValue' }, ['myField']), {
      form: 'foo',
      touch: true
    }));
    expect(state.foo).toEqual((_expect$toEqual29 = {
      myField: {
        initial: 'cleanValue',
        value: 'cleanValue',
        _isFieldValue: true
      },
      _active: undefined,
      _asyncValidating: false
    }, _defineProperty(_expect$toEqual29, globalErrorKey, undefined), _defineProperty(_expect$toEqual29, '_initialized', true), _defineProperty(_expect$toEqual29, '_submitting', false), _defineProperty(_expect$toEqual29, '_submitFailed', false), _expect$toEqual29));
    expect(isFieldValue(state.foo.myField)).toBe(true);
  });

  it('should set initialize values, not overwriting values when overwriteValues is false', function () {
    var _foo12, _expect$toEqual30;

    var state = reducer({
      foo: (_foo12 = {
        myField: makeFieldValue({
          value: 'dirtyValue',
          touched: true
        }),
        _active: 'myField',
        _asyncValidating: false
      }, _defineProperty(_foo12, globalErrorKey, undefined), _defineProperty(_foo12, '_initialized', false), _defineProperty(_foo12, '_submitting', false), _defineProperty(_foo12, '_submitFailed', false), _foo12)
    }, _extends({}, initialize({ myField: 'cleanValue' }, ['myField'], false), {
      form: 'foo',
      touch: true
    }));
    expect(state.foo).toEqual((_expect$toEqual30 = {
      myField: {
        initial: 'cleanValue',
        value: 'dirtyValue',
        _isFieldValue: true
      },
      _active: undefined,
      _asyncValidating: false
    }, _defineProperty(_expect$toEqual30, globalErrorKey, undefined), _defineProperty(_expect$toEqual30, '_initialized', true), _defineProperty(_expect$toEqual30, '_submitting', false), _defineProperty(_expect$toEqual30, '_submitFailed', false), _expect$toEqual30));
    expect(isFieldValue(state.foo.myField)).toBe(true);
  });

  it('should pop an array value', function () {
    var _testForm3, _expect$toEqual31;

    var state = reducer({
      testForm: (_testForm3 = {
        myField: [makeFieldValue({
          value: 'foo'
        }), makeFieldValue({
          value: 'bar'
        })],
        _active: undefined,
        _asyncValidating: false
      }, _defineProperty(_testForm3, globalErrorKey, undefined), _defineProperty(_testForm3, '_initialized', false), _defineProperty(_testForm3, '_submitting', false), _defineProperty(_testForm3, '_submitFailed', false), _testForm3)
    }, _extends({}, removeArrayValue('myField'), {
      form: 'testForm'
    }));
    expect(state.testForm).toEqual((_expect$toEqual31 = {
      myField: [{
        value: 'foo',
        _isFieldValue: true
      }],
      _active: undefined,
      _asyncValidating: false
    }, _defineProperty(_expect$toEqual31, globalErrorKey, undefined), _defineProperty(_expect$toEqual31, '_initialized', false), _defineProperty(_expect$toEqual31, '_submitting', false), _defineProperty(_expect$toEqual31, '_submitFailed', false), _expect$toEqual31));
    expect(isFieldValue(state.testForm.myField)).toBe(false);
    expect(isFieldValue(state.testForm.myField[0])).toBe(true);
  });

  it('should not change empty array value on remove', function () {
    var _testForm4, _expect$toEqual32;

    var state = reducer({
      testForm: (_testForm4 = {
        myField: [],
        _active: undefined,
        _asyncValidating: false
      }, _defineProperty(_testForm4, globalErrorKey, undefined), _defineProperty(_testForm4, '_initialized', false), _defineProperty(_testForm4, '_submitting', false), _defineProperty(_testForm4, '_submitFailed', false), _testForm4)
    }, _extends({}, removeArrayValue('myField'), {
      form: 'testForm'
    }));
    expect(state.testForm).toEqual((_expect$toEqual32 = {
      myField: [],
      _active: undefined,
      _asyncValidating: false
    }, _defineProperty(_expect$toEqual32, globalErrorKey, undefined), _defineProperty(_expect$toEqual32, '_initialized', false), _defineProperty(_expect$toEqual32, '_submitting', false), _defineProperty(_expect$toEqual32, '_submitFailed', false), _expect$toEqual32));
  });

  it('should remove an array value from start of array', function () {
    var _testForm5, _expect$toEqual33;

    var state = reducer({
      testForm: (_testForm5 = {
        myField: [makeFieldValue({
          value: 'foo'
        }), makeFieldValue({
          value: 'bar'
        }), makeFieldValue({
          value: 'baz'
        })],
        _active: undefined,
        _asyncValidating: false
      }, _defineProperty(_testForm5, globalErrorKey, undefined), _defineProperty(_testForm5, '_initialized', false), _defineProperty(_testForm5, '_submitting', false), _defineProperty(_testForm5, '_submitFailed', false), _testForm5)
    }, _extends({}, removeArrayValue('myField', 0), {
      form: 'testForm'
    }));
    expect(state.testForm).toEqual((_expect$toEqual33 = {
      myField: [{
        value: 'bar',
        _isFieldValue: true
      }, {
        value: 'baz',
        _isFieldValue: true
      }],
      _active: undefined,
      _asyncValidating: false
    }, _defineProperty(_expect$toEqual33, globalErrorKey, undefined), _defineProperty(_expect$toEqual33, '_initialized', false), _defineProperty(_expect$toEqual33, '_submitting', false), _defineProperty(_expect$toEqual33, '_submitFailed', false), _expect$toEqual33));
    expect(isFieldValue(state.testForm.myField)).toBe(false);
    expect(isFieldValue(state.testForm.myField[0])).toBe(true);
    expect(isFieldValue(state.testForm.myField[1])).toBe(true);
  });

  it('should remove an array value from middle of array', function () {
    var _testForm6, _expect$toEqual34;

    var state = reducer({
      testForm: (_testForm6 = {
        myField: [makeFieldValue({
          value: 'foo'
        }), makeFieldValue({
          value: 'bar'
        }), makeFieldValue({
          value: 'baz'
        })],
        _active: undefined,
        _asyncValidating: false
      }, _defineProperty(_testForm6, globalErrorKey, undefined), _defineProperty(_testForm6, '_initialized', false), _defineProperty(_testForm6, '_submitting', false), _defineProperty(_testForm6, '_submitFailed', false), _testForm6)
    }, _extends({}, removeArrayValue('myField', 1), {
      form: 'testForm'
    }));
    expect(state.testForm).toEqual((_expect$toEqual34 = {
      myField: [{
        value: 'foo',
        _isFieldValue: true
      }, {
        value: 'baz',
        _isFieldValue: true
      }],
      _active: undefined,
      _asyncValidating: false
    }, _defineProperty(_expect$toEqual34, globalErrorKey, undefined), _defineProperty(_expect$toEqual34, '_initialized', false), _defineProperty(_expect$toEqual34, '_submitting', false), _defineProperty(_expect$toEqual34, '_submitFailed', false), _expect$toEqual34));
    expect(isFieldValue(state.testForm.myField)).toBe(false);
    expect(isFieldValue(state.testForm.myField[0])).toBe(true);
    expect(isFieldValue(state.testForm.myField[1])).toBe(true);
  });

  it('should not change empty array value on swap', function () {
    var _testForm7, _expect$toEqual35;

    var state = reducer({
      testForm: (_testForm7 = {
        myField: [],
        _active: undefined,
        _asyncValidating: false
      }, _defineProperty(_testForm7, globalErrorKey, undefined), _defineProperty(_testForm7, '_initialized', false), _defineProperty(_testForm7, '_submitting', false), _defineProperty(_testForm7, '_submitFailed', false), _testForm7)
    }, _extends({}, swapArrayValues('myField'), {
      form: 'testForm'
    }));
    expect(state.testForm).toEqual((_expect$toEqual35 = {
      myField: [],
      _active: undefined,
      _asyncValidating: false
    }, _defineProperty(_expect$toEqual35, globalErrorKey, undefined), _defineProperty(_expect$toEqual35, '_initialized', false), _defineProperty(_expect$toEqual35, '_submitting', false), _defineProperty(_expect$toEqual35, '_submitFailed', false), _expect$toEqual35));
  });

  it('should should swap two array values at different indexes', function () {
    var _testForm8, _expect$toEqual36;

    var state = reducer({
      testForm: (_testForm8 = {
        myField: [makeFieldValue({
          value: 'foo'
        }), makeFieldValue({
          value: 'bar'
        }), makeFieldValue({
          value: 'baz'
        })],
        _active: undefined,
        _asyncValidating: false
      }, _defineProperty(_testForm8, globalErrorKey, undefined), _defineProperty(_testForm8, '_initialized', false), _defineProperty(_testForm8, '_submitting', false), _defineProperty(_testForm8, '_submitFailed', false), _testForm8)
    }, _extends({}, swapArrayValues('myField', 0, 2), {
      form: 'testForm'
    }));
    expect(state.testForm).toEqual((_expect$toEqual36 = {
      myField: [{
        value: 'baz',
        _isFieldValue: true
      }, {
        value: 'bar',
        _isFieldValue: true
      }, {
        value: 'foo',
        _isFieldValue: true
      }],
      _active: undefined,
      _asyncValidating: false
    }, _defineProperty(_expect$toEqual36, globalErrorKey, undefined), _defineProperty(_expect$toEqual36, '_initialized', false), _defineProperty(_expect$toEqual36, '_submitting', false), _defineProperty(_expect$toEqual36, '_submitFailed', false), _expect$toEqual36));
    expect(isFieldValue(state.testForm.myField)).toBe(false);
    expect(isFieldValue(state.testForm.myField[0])).toBe(true);
    expect(isFieldValue(state.testForm.myField[1])).toBe(true);
    expect(isFieldValue(state.testForm.myField[2])).toBe(true);
  });

  it('should not change array on swap with the same index', function () {
    var _testForm9, _expect$toEqual37;

    var state = reducer({
      testForm: (_testForm9 = {
        myField: [makeFieldValue({
          value: 'foo'
        }), makeFieldValue({
          value: 'bar'
        }), makeFieldValue({
          value: 'baz'
        })],
        _active: undefined,
        _asyncValidating: false
      }, _defineProperty(_testForm9, globalErrorKey, undefined), _defineProperty(_testForm9, '_initialized', false), _defineProperty(_testForm9, '_submitting', false), _defineProperty(_testForm9, '_submitFailed', false), _testForm9)
    }, _extends({}, swapArrayValues('myField', 1, 1), {
      form: 'testForm'
    }));
    expect(state.testForm).toEqual((_expect$toEqual37 = {
      myField: [{
        value: 'foo',
        _isFieldValue: true
      }, {
        value: 'bar',
        _isFieldValue: true
      }, {
        value: 'baz',
        _isFieldValue: true
      }],
      _active: undefined,
      _asyncValidating: false
    }, _defineProperty(_expect$toEqual37, globalErrorKey, undefined), _defineProperty(_expect$toEqual37, '_initialized', false), _defineProperty(_expect$toEqual37, '_submitting', false), _defineProperty(_expect$toEqual37, '_submitFailed', false), _expect$toEqual37));
    expect(isFieldValue(state.testForm.myField)).toBe(false);
    expect(isFieldValue(state.testForm.myField[0])).toBe(true);
    expect(isFieldValue(state.testForm.myField[1])).toBe(true);
    expect(isFieldValue(state.testForm.myField[2])).toBe(true);
  });

  it('should not change array on swap with out of bounds index', function () {
    var _testForm10, _expect$toEqual38;

    var state = reducer({
      testForm: (_testForm10 = {
        myField: [makeFieldValue({
          value: 'foo'
        }), makeFieldValue({
          value: 'bar'
        }), makeFieldValue({
          value: 'baz'
        })],
        _active: undefined,
        _asyncValidating: false
      }, _defineProperty(_testForm10, globalErrorKey, undefined), _defineProperty(_testForm10, '_initialized', false), _defineProperty(_testForm10, '_submitting', false), _defineProperty(_testForm10, '_submitFailed', false), _testForm10)
    }, _extends({}, swapArrayValues('myField', 1, 4), {
      form: 'testForm'
    }));
    expect(state.testForm).toEqual((_expect$toEqual38 = {
      myField: [{
        value: 'foo',
        _isFieldValue: true
      }, {
        value: 'bar',
        _isFieldValue: true
      }, {
        value: 'baz',
        _isFieldValue: true
      }],
      _active: undefined,
      _asyncValidating: false
    }, _defineProperty(_expect$toEqual38, globalErrorKey, undefined), _defineProperty(_expect$toEqual38, '_initialized', false), _defineProperty(_expect$toEqual38, '_submitting', false), _defineProperty(_expect$toEqual38, '_submitFailed', false), _expect$toEqual38));
    expect(isFieldValue(state.testForm.myField)).toBe(false);
    expect(isFieldValue(state.testForm.myField[0])).toBe(true);
    expect(isFieldValue(state.testForm.myField[1])).toBe(true);
    expect(isFieldValue(state.testForm.myField[2])).toBe(true);
  });

  it('should reset values on reset on with previous state', function () {
    var _foo13, _expect$toEqual39;

    var state = reducer({
      foo: (_foo13 = {
        myField: makeFieldValue({
          initial: 'initialValue',
          value: 'dirtyValue',
          touched: true
        }),
        myOtherField: makeFieldValue({
          initial: 'otherInitialValue',
          value: 'otherDirtyValue',
          touched: true
        }),
        _active: 'myField',
        _asyncValidating: false
      }, _defineProperty(_foo13, globalErrorKey, undefined), _defineProperty(_foo13, '_initialized', false), _defineProperty(_foo13, '_submitting', false), _defineProperty(_foo13, '_submitFailed', false), _foo13)
    }, _extends({}, reset(), {
      form: 'foo'
    }));
    expect(state.foo).toEqual((_expect$toEqual39 = {
      myField: {
        initial: 'initialValue',
        value: 'initialValue',
        _isFieldValue: true
      },
      myOtherField: {
        initial: 'otherInitialValue',
        value: 'otherInitialValue',
        _isFieldValue: true
      },
      _active: undefined,
      _asyncValidating: false
    }, _defineProperty(_expect$toEqual39, globalErrorKey, undefined), _defineProperty(_expect$toEqual39, '_initialized', false), _defineProperty(_expect$toEqual39, '_submitting', false), _defineProperty(_expect$toEqual39, '_submitFailed', false), _expect$toEqual39));
    expect(isFieldValue(state.foo.myField)).toBe(true);
    expect(isFieldValue(state.foo.myOtherField)).toBe(true);
  });

  it('should reset deep values on reset on with previous state', function () {
    var _foo14, _expect$toEqual40;

    var state = reducer({
      foo: (_foo14 = {
        deepField: {
          myField: makeFieldValue({
            initial: 'initialValue',
            value: 'dirtyValue',
            touched: true
          }),
          myOtherField: makeFieldValue({
            initial: 'otherInitialValue',
            value: 'otherDirtyValue',
            touched: true
          })
        },
        _active: 'myField',
        _asyncValidating: false
      }, _defineProperty(_foo14, globalErrorKey, undefined), _defineProperty(_foo14, '_initialized', false), _defineProperty(_foo14, '_submitting', false), _defineProperty(_foo14, '_submitFailed', false), _foo14)
    }, _extends({}, reset(), {
      form: 'foo'
    }));
    expect(state.foo).toEqual((_expect$toEqual40 = {
      deepField: {
        myField: {
          initial: 'initialValue',
          value: 'initialValue',
          _isFieldValue: true
        },
        myOtherField: {
          initial: 'otherInitialValue',
          value: 'otherInitialValue',
          _isFieldValue: true
        }
      },
      _active: undefined,
      _asyncValidating: false
    }, _defineProperty(_expect$toEqual40, globalErrorKey, undefined), _defineProperty(_expect$toEqual40, '_initialized', false), _defineProperty(_expect$toEqual40, '_submitting', false), _defineProperty(_expect$toEqual40, '_submitFailed', false), _expect$toEqual40));
    expect(isFieldValue(state.foo.deepField)).toBe(false);
    expect(isFieldValue(state.foo.deepField.myField)).toBe(true);
    expect(isFieldValue(state.foo.deepField.myOtherField)).toBe(true);
  });

  it('should set asyncValidating on startAsyncValidation', function () {
    var _foo15, _expect$toEqual41;

    var state = reducer({
      foo: (_foo15 = {
        doesnt: 'matter',
        should: 'notchange',
        _active: undefined,
        _asyncValidating: false
      }, _defineProperty(_foo15, globalErrorKey, undefined), _defineProperty(_foo15, '_initialized', false), _defineProperty(_foo15, '_submitting', false), _defineProperty(_foo15, '_submitFailed', false), _foo15)
    }, _extends({}, startAsyncValidation(), {
      form: 'foo'
    }));
    expect(state.foo).toEqual((_expect$toEqual41 = {
      doesnt: 'matter',
      should: 'notchange',
      _active: undefined,
      _asyncValidating: true
    }, _defineProperty(_expect$toEqual41, globalErrorKey, undefined), _defineProperty(_expect$toEqual41, '_initialized', false), _defineProperty(_expect$toEqual41, '_submitting', false), _defineProperty(_expect$toEqual41, '_submitFailed', false), _expect$toEqual41));
  });

  it('should set asyncValidating with field name on startAsyncValidation', function () {
    var _foo16, _expect$toEqual42;

    var state = reducer({
      foo: (_foo16 = {
        myField: makeFieldValue({
          initial: 'initialValue',
          value: 'initialValue'
        }),
        doesnt: 'matter',
        should: 'notchange',
        _active: undefined,
        _asyncValidating: false
      }, _defineProperty(_foo16, globalErrorKey, undefined), _defineProperty(_foo16, '_initialized', false), _defineProperty(_foo16, '_submitting', false), _defineProperty(_foo16, '_submitFailed', false), _foo16)
    }, _extends({}, startAsyncValidation('myField'), {
      form: 'foo'
    }));
    expect(state.foo).toEqual((_expect$toEqual42 = {
      myField: {
        initial: 'initialValue',
        value: 'initialValue',
        _isFieldValue: true
      },
      doesnt: 'matter',
      should: 'notchange',
      _active: undefined,
      _asyncValidating: 'myField'
    }, _defineProperty(_expect$toEqual42, globalErrorKey, undefined), _defineProperty(_expect$toEqual42, '_initialized', false), _defineProperty(_expect$toEqual42, '_submitting', false), _defineProperty(_expect$toEqual42, '_submitFailed', false), _expect$toEqual42));
    expect(isFieldValue(state.foo.myField)).toBe(true);
  });

  it('should set submitting on startSubmit', function () {
    var _foo17, _expect$toEqual43;

    var state = reducer({
      foo: (_foo17 = {
        doesnt: 'matter',
        should: 'notchange',
        _active: undefined,
        _asyncValidating: false
      }, _defineProperty(_foo17, globalErrorKey, undefined), _defineProperty(_foo17, '_initialized', false), _defineProperty(_foo17, '_submitting', false), _defineProperty(_foo17, '_submitFailed', false), _foo17)
    }, _extends({}, startSubmit(), {
      form: 'foo'
    }));
    expect(state.foo).toEqual((_expect$toEqual43 = {
      doesnt: 'matter',
      should: 'notchange',
      _active: undefined,
      _asyncValidating: false
    }, _defineProperty(_expect$toEqual43, globalErrorKey, undefined), _defineProperty(_expect$toEqual43, '_initialized', false), _defineProperty(_expect$toEqual43, '_submitting', true), _defineProperty(_expect$toEqual43, '_submitFailed', false), _expect$toEqual43));
  });

  it('should set submitting on startSubmit, and NOT reset submitFailed', function () {
    var _foo18, _expect$toEqual44;

    var state = reducer({
      foo: (_foo18 = {
        doesnt: 'matter',
        should: 'notchange',
        _active: undefined,
        _asyncValidating: false
      }, _defineProperty(_foo18, globalErrorKey, undefined), _defineProperty(_foo18, '_initialized', false), _defineProperty(_foo18, '_submitting', false), _defineProperty(_foo18, '_submitFailed', true), _foo18)
    }, _extends({}, startSubmit(), {
      form: 'foo'
    }));
    expect(state.foo).toEqual((_expect$toEqual44 = {
      doesnt: 'matter',
      should: 'notchange',
      _active: undefined,
      _asyncValidating: false
    }, _defineProperty(_expect$toEqual44, globalErrorKey, undefined), _defineProperty(_expect$toEqual44, '_initialized', false), _defineProperty(_expect$toEqual44, '_submitting', true), _defineProperty(_expect$toEqual44, '_submitFailed', true), _expect$toEqual44));
  });

  it('should set asyncError on nested fields on stopAsyncValidation', function () {
    var _foo19, _expect$toEqual45;

    var state = reducer({
      foo: (_foo19 = {
        bar: {
          myField: makeFieldValue({
            initial: 'initialValue',
            value: 'dirtyValue',
            touched: true
          }),
          myOtherField: makeFieldValue({
            initial: 'otherInitialValue',
            value: 'otherDirtyValue',
            touched: true
          })
        },
        _active: undefined,
        _asyncValidating: true
      }, _defineProperty(_foo19, globalErrorKey, undefined), _defineProperty(_foo19, '_initialized', false), _defineProperty(_foo19, '_submitting', false), _defineProperty(_foo19, '_submitFailed', false), _foo19)
    }, _extends({}, stopAsyncValidation({
      bar: {
        myField: 'Error about myField',
        myOtherField: 'Error about myOtherField'
      }
    }), {
      form: 'foo'
    }));
    expect(state.foo).toEqual((_expect$toEqual45 = {
      bar: {
        myField: {
          initial: 'initialValue',
          value: 'dirtyValue',
          touched: true,
          _isFieldValue: true,
          asyncError: 'Error about myField'
        },
        myOtherField: {
          initial: 'otherInitialValue',
          value: 'otherDirtyValue',
          touched: true,
          _isFieldValue: true,
          asyncError: 'Error about myOtherField'
        }
      },
      _active: undefined,
      _asyncValidating: false
    }, _defineProperty(_expect$toEqual45, globalErrorKey, undefined), _defineProperty(_expect$toEqual45, '_initialized', false), _defineProperty(_expect$toEqual45, '_submitting', false), _defineProperty(_expect$toEqual45, '_submitFailed', false), _expect$toEqual45));
    expect(isFieldValue(state.foo.bar)).toBe(false);
    expect(isFieldValue(state.foo.bar.myField)).toBe(true);
    expect(isFieldValue(state.foo.bar.myOtherField)).toBe(true);
  });

  it('should set asyncError on array fields on stopAsyncValidation', function () {
    var _foo20, _expect$toEqual46;

    var state = reducer({
      foo: (_foo20 = {
        bar: [makeFieldValue({
          initial: 'initialValue',
          value: 'dirtyValue',
          touched: true
        }), makeFieldValue({
          initial: 'otherInitialValue',
          value: 'otherDirtyValue',
          touched: true
        })],
        _active: undefined,
        _asyncValidating: true
      }, _defineProperty(_foo20, globalErrorKey, undefined), _defineProperty(_foo20, '_initialized', false), _defineProperty(_foo20, '_submitting', false), _defineProperty(_foo20, '_submitFailed', false), _foo20)
    }, _extends({}, stopAsyncValidation({
      bar: ['Error about myField', 'Error about myOtherField']
    }), {
      form: 'foo'
    }));
    expect(state.foo).toEqual((_expect$toEqual46 = {
      bar: [{
        initial: 'initialValue',
        value: 'dirtyValue',
        touched: true,
        _isFieldValue: true,
        asyncError: 'Error about myField'
      }, {
        initial: 'otherInitialValue',
        value: 'otherDirtyValue',
        touched: true,
        _isFieldValue: true,
        asyncError: 'Error about myOtherField'
      }],
      _active: undefined,
      _asyncValidating: false
    }, _defineProperty(_expect$toEqual46, globalErrorKey, undefined), _defineProperty(_expect$toEqual46, '_initialized', false), _defineProperty(_expect$toEqual46, '_submitting', false), _defineProperty(_expect$toEqual46, '_submitFailed', false), _expect$toEqual46));
    expect(isFieldValue(state.foo.bar)).toBe(false);
    expect(isFieldValue(state.foo.bar[0])).toBe(true);
    expect(isFieldValue(state.foo.bar[1])).toBe(true);
  });

  it('should unset asyncValidating on stopAsyncValidation', function () {
    var _foo21, _expect$toEqual47;

    var state = reducer({
      foo: (_foo21 = {
        myField: makeFieldValue({
          initial: 'initialValue',
          value: 'dirtyValue',
          touched: true
        }),
        myOtherField: makeFieldValue({
          initial: 'otherInitialValue',
          value: 'otherDirtyValue',
          touched: true
        }),
        _active: undefined,
        _asyncValidating: true
      }, _defineProperty(_foo21, globalErrorKey, undefined), _defineProperty(_foo21, '_initialized', false), _defineProperty(_foo21, '_submitting', false), _defineProperty(_foo21, '_submitFailed', false), _foo21)
    }, _extends({}, stopAsyncValidation({
      myField: 'Error about myField',
      myOtherField: 'Error about myOtherField'
    }), {
      form: 'foo'
    }));
    expect(state.foo).toEqual((_expect$toEqual47 = {
      myField: {
        initial: 'initialValue',
        value: 'dirtyValue',
        touched: true,
        _isFieldValue: true,
        asyncError: 'Error about myField'
      },
      myOtherField: {
        initial: 'otherInitialValue',
        value: 'otherDirtyValue',
        touched: true,
        _isFieldValue: true,
        asyncError: 'Error about myOtherField'
      },
      _active: undefined,
      _asyncValidating: false
    }, _defineProperty(_expect$toEqual47, globalErrorKey, undefined), _defineProperty(_expect$toEqual47, '_initialized', false), _defineProperty(_expect$toEqual47, '_submitting', false), _defineProperty(_expect$toEqual47, '_submitFailed', false), _expect$toEqual47));
    expect(isFieldValue(state.foo.myField)).toBe(true);
    expect(isFieldValue(state.foo.myOtherField)).toBe(true);
  });

  it('should unset field async errors on stopAsyncValidation', function () {
    var _foo22, _expect$toEqual48;

    var state = reducer({
      foo: (_foo22 = {
        myField: makeFieldValue({
          initial: 'initialValue',
          value: 'dirtyValue',
          asyncError: 'myFieldError',
          touched: true
        }),
        myOtherField: makeFieldValue({
          initial: 'otherInitialValue',
          value: 'otherDirtyValue',
          asyncError: 'myOtherFieldError',
          touched: true
        }),
        _active: undefined,
        _asyncValidating: true
      }, _defineProperty(_foo22, globalErrorKey, undefined), _defineProperty(_foo22, '_initialized', false), _defineProperty(_foo22, '_submitting', false), _defineProperty(_foo22, '_submitFailed', false), _foo22)
    }, _extends({}, stopAsyncValidation(), {
      form: 'foo'
    }));
    expect(state.foo).toEqual((_expect$toEqual48 = {
      myField: {
        initial: 'initialValue',
        value: 'dirtyValue',
        touched: true,
        _isFieldValue: true
      },
      myOtherField: {
        initial: 'otherInitialValue',
        value: 'otherDirtyValue',
        touched: true,
        _isFieldValue: true
      },
      _active: undefined,
      _asyncValidating: false
    }, _defineProperty(_expect$toEqual48, globalErrorKey, undefined), _defineProperty(_expect$toEqual48, '_initialized', false), _defineProperty(_expect$toEqual48, '_submitting', false), _defineProperty(_expect$toEqual48, '_submitFailed', false), _expect$toEqual48));
    expect(isFieldValue(state.foo.myField)).toBe(true);
    expect(isFieldValue(state.foo.myOtherField)).toBe(true);
  });

  it('should unset asyncValidating on stopAsyncValidation and set global error', function () {
    var _foo23, _expect$toEqual49;

    var state = reducer({
      foo: (_foo23 = {
        myField: makeFieldValue({
          initial: 'initialValue',
          value: 'dirtyValue',
          touched: true
        }),
        myOtherField: makeFieldValue({
          initial: 'otherInitialValue',
          value: 'otherDirtyValue',
          touched: true
        }),
        _active: undefined,
        _asyncValidating: true
      }, _defineProperty(_foo23, globalErrorKey, undefined), _defineProperty(_foo23, '_initialized', false), _defineProperty(_foo23, '_submitting', false), _defineProperty(_foo23, '_submitFailed', false), _foo23)
    }, _extends({}, stopAsyncValidation(_defineProperty({}, globalErrorKey, 'This is a global error')), {
      form: 'foo'
    }));
    expect(state.foo).toEqual((_expect$toEqual49 = {
      myField: {
        initial: 'initialValue',
        value: 'dirtyValue',
        touched: true,
        _isFieldValue: true
      },
      myOtherField: {
        initial: 'otherInitialValue',
        value: 'otherDirtyValue',
        touched: true,
        _isFieldValue: true
      },
      _active: undefined,
      _asyncValidating: false
    }, _defineProperty(_expect$toEqual49, globalErrorKey, 'This is a global error'), _defineProperty(_expect$toEqual49, '_initialized', false), _defineProperty(_expect$toEqual49, '_submitting', false), _defineProperty(_expect$toEqual49, '_submitFailed', false), _expect$toEqual49));
    expect(isFieldValue(state.foo.myField)).toBe(true);
    expect(isFieldValue(state.foo.myOtherField)).toBe(true);
  });

  it('should unset submitting on stopSubmit', function () {
    var _foo24, _expect$toEqual50;

    var state = reducer({
      foo: (_foo24 = {
        doesnt: 'matter',
        should: 'notchange',
        _active: undefined,
        _asyncValidating: false
      }, _defineProperty(_foo24, globalErrorKey, undefined), _defineProperty(_foo24, '_initialized', false), _defineProperty(_foo24, '_submitting', true), _defineProperty(_foo24, '_submitFailed', false), _foo24)
    }, _extends({}, stopSubmit(), {
      form: 'foo'
    }));
    expect(state.foo).toEqual((_expect$toEqual50 = {
      doesnt: 'matter',
      should: 'notchange',
      _active: undefined,
      _asyncValidating: false
    }, _defineProperty(_expect$toEqual50, globalErrorKey, undefined), _defineProperty(_expect$toEqual50, '_initialized', false), _defineProperty(_expect$toEqual50, '_submitting', false), _defineProperty(_expect$toEqual50, '_submitFailed', false), _expect$toEqual50));
  });

  it('should set submitError on nested fields on stopSubmit', function () {
    var _foo25, _expect$toEqual51;

    var state = reducer({
      foo: (_foo25 = {
        bar: {
          myField: makeFieldValue({
            initial: 'initialValue',
            value: 'dirtyValue',
            touched: true
          }),
          myOtherField: makeFieldValue({
            initial: 'otherInitialValue',
            value: 'otherDirtyValue',
            touched: true
          })
        },
        _active: undefined,
        _asyncValidating: false
      }, _defineProperty(_foo25, globalErrorKey, undefined), _defineProperty(_foo25, '_initialized', false), _defineProperty(_foo25, '_submitting', true), _defineProperty(_foo25, '_submitFailed', false), _foo25)
    }, _extends({}, stopSubmit({
      bar: {
        myField: 'Error about myField',
        myOtherField: 'Error about myOtherField'
      }
    }), {
      form: 'foo'
    }));
    expect(state.foo).toEqual((_expect$toEqual51 = {
      bar: {
        myField: {
          initial: 'initialValue',
          value: 'dirtyValue',
          touched: true,
          _isFieldValue: true,
          submitError: 'Error about myField'
        },
        myOtherField: {
          initial: 'otherInitialValue',
          value: 'otherDirtyValue',
          touched: true,
          _isFieldValue: true,
          submitError: 'Error about myOtherField'
        }
      },
      _active: undefined,
      _asyncValidating: false
    }, _defineProperty(_expect$toEqual51, globalErrorKey, undefined), _defineProperty(_expect$toEqual51, '_initialized', false), _defineProperty(_expect$toEqual51, '_submitting', false), _defineProperty(_expect$toEqual51, '_submitFailed', true), _expect$toEqual51));
    expect(isFieldValue(state.foo.bar)).toBe(false);
    expect(isFieldValue(state.foo.bar.myField)).toBe(true);
    expect(isFieldValue(state.foo.bar.myOtherField)).toBe(true);
  });

  it('should set submitError on array fields on stopSubmit', function () {
    var _foo26, _expect$toEqual52;

    var state = reducer({
      foo: (_foo26 = {
        bar: [makeFieldValue({
          initial: 'initialValue',
          value: 'dirtyValue',
          touched: true
        }), makeFieldValue({
          initial: 'otherInitialValue',
          value: 'otherDirtyValue',
          touched: true
        })],
        _active: undefined,
        _asyncValidating: false
      }, _defineProperty(_foo26, globalErrorKey, undefined), _defineProperty(_foo26, '_initialized', false), _defineProperty(_foo26, '_submitting', true), _defineProperty(_foo26, '_submitFailed', false), _foo26)
    }, _extends({}, stopSubmit({
      bar: ['Error about myField', 'Error about myOtherField']
    }), {
      form: 'foo'
    }));
    expect(state.foo).toEqual((_expect$toEqual52 = {
      bar: [{
        initial: 'initialValue',
        value: 'dirtyValue',
        touched: true,
        _isFieldValue: true,
        submitError: 'Error about myField'
      }, {
        initial: 'otherInitialValue',
        value: 'otherDirtyValue',
        touched: true,
        _isFieldValue: true,
        submitError: 'Error about myOtherField'
      }],
      _active: undefined,
      _asyncValidating: false
    }, _defineProperty(_expect$toEqual52, globalErrorKey, undefined), _defineProperty(_expect$toEqual52, '_initialized', false), _defineProperty(_expect$toEqual52, '_submitting', false), _defineProperty(_expect$toEqual52, '_submitFailed', true), _expect$toEqual52));
    expect(isFieldValue(state.foo.bar)).toBe(false);
    expect(isFieldValue(state.foo.bar[0])).toBe(true);
    expect(isFieldValue(state.foo.bar[1])).toBe(true);
  });

  it('should unset submitFailed on stopSubmit with no errors', function () {
    var _foo27, _expect$toEqual53;

    var state = reducer({
      foo: (_foo27 = {
        doesnt: 'matter',
        should: 'notchange',
        _active: undefined,
        _asyncValidating: false
      }, _defineProperty(_foo27, globalErrorKey, undefined), _defineProperty(_foo27, '_initialized', false), _defineProperty(_foo27, '_submitting', true), _defineProperty(_foo27, '_submitFailed', true), _foo27)
    }, _extends({}, stopSubmit(), {
      form: 'foo'
    }));
    expect(state.foo).toEqual((_expect$toEqual53 = {
      doesnt: 'matter',
      should: 'notchange',
      _active: undefined,
      _asyncValidating: false
    }, _defineProperty(_expect$toEqual53, globalErrorKey, undefined), _defineProperty(_expect$toEqual53, '_initialized', false), _defineProperty(_expect$toEqual53, '_submitting', false), _defineProperty(_expect$toEqual53, '_submitFailed', false), _expect$toEqual53));
  });

  it('should unset submitting and set submit errors on stopSubmit', function () {
    var _foo28, _expect$toEqual54;

    var state = reducer({
      foo: (_foo28 = {
        myField: makeFieldValue({
          initial: 'initialValue',
          value: 'dirtyValue',
          touched: true
        }),
        myOtherField: makeFieldValue({
          initial: 'otherInitialValue',
          value: 'otherDirtyValue',
          touched: true
        }),
        _active: undefined,
        _asyncValidating: false
      }, _defineProperty(_foo28, globalErrorKey, undefined), _defineProperty(_foo28, '_initialized', false), _defineProperty(_foo28, '_submitting', true), _defineProperty(_foo28, '_submitFailed', false), _foo28)
    }, _extends({}, stopSubmit({
      myField: 'Error about myField',
      myOtherField: 'Error about myOtherField'
    }), {
      form: 'foo'
    }));
    expect(state.foo).toEqual((_expect$toEqual54 = {
      myField: {
        initial: 'initialValue',
        value: 'dirtyValue',
        touched: true,
        _isFieldValue: true,
        submitError: 'Error about myField'
      },
      myOtherField: {
        initial: 'otherInitialValue',
        value: 'otherDirtyValue',
        touched: true,
        _isFieldValue: true,
        submitError: 'Error about myOtherField'
      },
      _active: undefined,
      _asyncValidating: false
    }, _defineProperty(_expect$toEqual54, globalErrorKey, undefined), _defineProperty(_expect$toEqual54, '_initialized', false), _defineProperty(_expect$toEqual54, '_submitting', false), _defineProperty(_expect$toEqual54, '_submitFailed', true), _expect$toEqual54));
    expect(isFieldValue(state.foo.myField)).toBe(true);
    expect(isFieldValue(state.foo.myOtherField)).toBe(true);
  });

  it('should unset submitting and set submit global error on stopSubmit', function () {
    var _foo29, _expect$toEqual55;

    var state = reducer({
      foo: (_foo29 = {
        myField: makeFieldValue({
          initial: 'initialValue',
          value: 'dirtyValue',
          touched: true
        }),
        myOtherField: makeFieldValue({
          initial: 'otherInitialValue',
          value: 'otherDirtyValue',
          touched: true
        }),
        _active: undefined,
        _asyncValidating: false
      }, _defineProperty(_foo29, globalErrorKey, undefined), _defineProperty(_foo29, '_initialized', false), _defineProperty(_foo29, '_submitting', true), _defineProperty(_foo29, '_submitFailed', false), _foo29)
    }, _extends({}, stopSubmit(_defineProperty({}, globalErrorKey, 'This is a global error')), {
      form: 'foo'
    }));
    expect(state.foo).toEqual((_expect$toEqual55 = {
      myField: {
        initial: 'initialValue',
        value: 'dirtyValue',
        touched: true,
        _isFieldValue: true
      },
      myOtherField: {
        initial: 'otherInitialValue',
        value: 'otherDirtyValue',
        touched: true,
        _isFieldValue: true
      },
      _active: undefined,
      _asyncValidating: false
    }, _defineProperty(_expect$toEqual55, globalErrorKey, 'This is a global error'), _defineProperty(_expect$toEqual55, '_initialized', false), _defineProperty(_expect$toEqual55, '_submitting', false), _defineProperty(_expect$toEqual55, '_submitFailed', true), _expect$toEqual55));
    expect(isFieldValue(state.foo.myField)).toBe(true);
    expect(isFieldValue(state.foo.myOtherField)).toBe(true);
  });

  it('should mark fields as touched on touch', function () {
    var _foo30, _expect$toEqual56;

    var state = reducer({
      foo: (_foo30 = {
        myField: makeFieldValue({
          value: 'initialValue',
          touched: false
        }),
        myOtherField: makeFieldValue({
          value: 'otherInitialValue',
          touched: false
        }),
        _active: undefined,
        _asyncValidating: false
      }, _defineProperty(_foo30, globalErrorKey, undefined), _defineProperty(_foo30, '_initialized', false), _defineProperty(_foo30, '_submitting', false), _defineProperty(_foo30, '_submitFailed', false), _foo30)
    }, _extends({}, touch('myField', 'myOtherField'), {
      form: 'foo'
    }));
    expect(state.foo).toEqual((_expect$toEqual56 = {
      myField: {
        value: 'initialValue',
        touched: true,
        _isFieldValue: true
      },
      myOtherField: {
        value: 'otherInitialValue',
        touched: true,
        _isFieldValue: true
      },
      _active: undefined,
      _asyncValidating: false
    }, _defineProperty(_expect$toEqual56, globalErrorKey, undefined), _defineProperty(_expect$toEqual56, '_initialized', false), _defineProperty(_expect$toEqual56, '_submitting', false), _defineProperty(_expect$toEqual56, '_submitFailed', false), _expect$toEqual56));
    expect(isFieldValue(state.foo.myField)).toBe(true);
    expect(isFieldValue(state.foo.myOtherField)).toBe(true);
  });

  it('should mark deep fields as touched on touch', function () {
    var _foo31, _expect$toEqual57;

    var state = reducer({
      foo: (_foo31 = {
        deep: {
          myField: makeFieldValue({
            value: 'initialValue',
            touched: false
          }),
          myOtherField: makeFieldValue({
            value: 'otherInitialValue',
            touched: false
          })
        },
        _active: undefined,
        _asyncValidating: false
      }, _defineProperty(_foo31, globalErrorKey, undefined), _defineProperty(_foo31, '_initialized', false), _defineProperty(_foo31, '_submitting', false), _defineProperty(_foo31, '_submitFailed', false), _foo31)
    }, _extends({}, touch('deep.myField', 'deep.myOtherField'), {
      form: 'foo'
    }));
    expect(state.foo).toEqual((_expect$toEqual57 = {
      deep: {
        myField: {
          value: 'initialValue',
          touched: true,
          _isFieldValue: true
        },
        myOtherField: {
          value: 'otherInitialValue',
          touched: true,
          _isFieldValue: true
        }
      },
      _active: undefined,
      _asyncValidating: false
    }, _defineProperty(_expect$toEqual57, globalErrorKey, undefined), _defineProperty(_expect$toEqual57, '_initialized', false), _defineProperty(_expect$toEqual57, '_submitting', false), _defineProperty(_expect$toEqual57, '_submitFailed', false), _expect$toEqual57));
    expect(isFieldValue(state.foo.deep)).toBe(false);
    expect(isFieldValue(state.foo.deep.myField)).toBe(true);
    expect(isFieldValue(state.foo.deep.myOtherField)).toBe(true);
  });

  it('should mark array fields as touched on touch', function () {
    var _foo32, _expect$toEqual58;

    var state = reducer({
      foo: (_foo32 = {
        myFields: [makeFieldValue({
          value: 'initialValue',
          touched: false
        }), makeFieldValue({
          value: 'otherInitialValue',
          touched: false
        })],
        _active: undefined,
        _asyncValidating: false
      }, _defineProperty(_foo32, globalErrorKey, undefined), _defineProperty(_foo32, '_initialized', false), _defineProperty(_foo32, '_submitting', false), _defineProperty(_foo32, '_submitFailed', false), _foo32)
    }, _extends({}, touch('myFields[0]', 'myFields[1]'), {
      form: 'foo'
    }));
    expect(state.foo).toEqual((_expect$toEqual58 = {
      myFields: [{
        value: 'initialValue',
        touched: true,
        _isFieldValue: true
      }, {
        value: 'otherInitialValue',
        touched: true,
        _isFieldValue: true
      }],
      _active: undefined,
      _asyncValidating: false
    }, _defineProperty(_expect$toEqual58, globalErrorKey, undefined), _defineProperty(_expect$toEqual58, '_initialized', false), _defineProperty(_expect$toEqual58, '_submitting', false), _defineProperty(_expect$toEqual58, '_submitFailed', false), _expect$toEqual58));
    expect(isFieldValue(state.foo.myFields)).toBe(false);
    expect(isFieldValue(state.foo.myFields[0])).toBe(true);
    expect(isFieldValue(state.foo.myFields[1])).toBe(true);
  });

  it('should mark index-less array fields as touched on touch', function () {
    var _foo33, _expect$toEqual59;

    var state = reducer({
      foo: (_foo33 = {
        myFields: [makeFieldValue({
          value: 'initialValue',
          touched: false
        }), makeFieldValue({
          value: 'otherInitialValue',
          touched: false
        })],
        _active: undefined,
        _asyncValidating: false
      }, _defineProperty(_foo33, globalErrorKey, undefined), _defineProperty(_foo33, '_initialized', false), _defineProperty(_foo33, '_submitting', false), _defineProperty(_foo33, '_submitFailed', false), _foo33)
    }, _extends({}, touch('myFields[]'), {
      form: 'foo'
    }));
    expect(state.foo).toEqual((_expect$toEqual59 = {
      myFields: [{
        value: 'initialValue',
        touched: true,
        _isFieldValue: true
      }, {
        value: 'otherInitialValue',
        touched: true,
        _isFieldValue: true
      }],
      _active: undefined,
      _asyncValidating: false
    }, _defineProperty(_expect$toEqual59, globalErrorKey, undefined), _defineProperty(_expect$toEqual59, '_initialized', false), _defineProperty(_expect$toEqual59, '_submitting', false), _defineProperty(_expect$toEqual59, '_submitFailed', false), _expect$toEqual59));
    expect(isFieldValue(state.foo.myFields)).toBe(false);
    expect(isFieldValue(state.foo.myFields[0])).toBe(true);
    expect(isFieldValue(state.foo.myFields[1])).toBe(true);
  });

  it('should mark index-less array subfields as touched on touch', function () {
    var _foo34, _expect$toEqual60;

    var state = reducer({
      foo: (_foo34 = {
        myFields: [{
          name: makeFieldValue({
            value: 'initialValue',
            touched: false
          })
        }, {
          name: makeFieldValue({
            value: 'otherInitialValue',
            touched: false
          })
        }],
        _active: undefined,
        _asyncValidating: false
      }, _defineProperty(_foo34, globalErrorKey, undefined), _defineProperty(_foo34, '_initialized', false), _defineProperty(_foo34, '_submitting', false), _defineProperty(_foo34, '_submitFailed', false), _foo34)
    }, _extends({}, touch('myFields[].name'), {
      form: 'foo'
    }));
    expect(state.foo).toEqual((_expect$toEqual60 = {
      myFields: [{
        name: {
          value: 'initialValue',
          touched: true,
          _isFieldValue: true
        }
      }, {
        name: {
          value: 'otherInitialValue',
          touched: true,
          _isFieldValue: true
        }
      }],
      _active: undefined,
      _asyncValidating: false
    }, _defineProperty(_expect$toEqual60, globalErrorKey, undefined), _defineProperty(_expect$toEqual60, '_initialized', false), _defineProperty(_expect$toEqual60, '_submitting', false), _defineProperty(_expect$toEqual60, '_submitFailed', false), _expect$toEqual60));
    expect(isFieldValue(state.foo.myFields)).toBe(false);
    expect(isFieldValue(state.foo.myFields[0])).toBe(false);
    expect(isFieldValue(state.foo.myFields[0].name)).toBe(true);
    expect(isFieldValue(state.foo.myFields[1])).toBe(false);
    expect(isFieldValue(state.foo.myFields[1].name)).toBe(true);
  });

  it('should ignore empty index-less array fields on touch', function () {
    var _foo35, _expect$toEqual61;

    var state = reducer({
      foo: (_foo35 = {
        _active: undefined,
        _asyncValidating: false
      }, _defineProperty(_foo35, globalErrorKey, undefined), _defineProperty(_foo35, '_initialized', false), _defineProperty(_foo35, '_submitting', false), _defineProperty(_foo35, '_submitFailed', false), _foo35)
    }, _extends({}, touch('myFields[]'), {
      form: 'foo'
    }));
    expect(state.foo).toEqual((_expect$toEqual61 = {
      _active: undefined,
      _asyncValidating: false
    }, _defineProperty(_expect$toEqual61, globalErrorKey, undefined), _defineProperty(_expect$toEqual61, '_initialized', false), _defineProperty(_expect$toEqual61, '_submitting', false), _defineProperty(_expect$toEqual61, '_submitFailed', false), _expect$toEqual61));
  });

  it('should ignore empty index-less array subfields on touch', function () {
    var _foo36, _expect$toEqual62;

    var state = reducer({
      foo: (_foo36 = {
        _active: undefined,
        _asyncValidating: false
      }, _defineProperty(_foo36, globalErrorKey, undefined), _defineProperty(_foo36, '_initialized', false), _defineProperty(_foo36, '_submitting', false), _defineProperty(_foo36, '_submitFailed', false), _foo36)
    }, _extends({}, touch('myFields[].name'), {
      form: 'foo'
    }));
    expect(state.foo).toEqual((_expect$toEqual62 = {
      _active: undefined,
      _asyncValidating: false
    }, _defineProperty(_expect$toEqual62, globalErrorKey, undefined), _defineProperty(_expect$toEqual62, '_initialized', false), _defineProperty(_expect$toEqual62, '_submitting', false), _defineProperty(_expect$toEqual62, '_submitFailed', false), _expect$toEqual62));
  });

  it('should unmark fields as touched on untouch', function () {
    var _foo37, _expect$toEqual63;

    var state = reducer({
      foo: (_foo37 = {
        myField: makeFieldValue({
          value: 'initialValue',
          touched: true
        }),
        myOtherField: makeFieldValue({
          value: 'otherInitialValue',
          touched: true
        }),
        _active: undefined,
        _asyncValidating: false
      }, _defineProperty(_foo37, globalErrorKey, undefined), _defineProperty(_foo37, '_initialized', false), _defineProperty(_foo37, '_submitting', false), _defineProperty(_foo37, '_submitFailed', false), _foo37)
    }, _extends({}, untouch('myField', 'myOtherField'), {
      form: 'foo'
    }));
    expect(state.foo).toEqual((_expect$toEqual63 = {
      myField: {
        value: 'initialValue',
        _isFieldValue: true
      },
      myOtherField: {
        value: 'otherInitialValue',
        _isFieldValue: true
      },
      _active: undefined,
      _asyncValidating: false
    }, _defineProperty(_expect$toEqual63, globalErrorKey, undefined), _defineProperty(_expect$toEqual63, '_initialized', false), _defineProperty(_expect$toEqual63, '_submitting', false), _defineProperty(_expect$toEqual63, '_submitFailed', false), _expect$toEqual63));
    expect(isFieldValue(state.foo.myField)).toBe(true);
    expect(isFieldValue(state.foo.myOtherField)).toBe(true);
  });

  it('should unmark deep fields as touched on untouch', function () {
    var _foo38, _expect$toEqual64;

    var state = reducer({
      foo: (_foo38 = {
        deep: {
          myField: makeFieldValue({
            value: 'initialValue',
            touched: true
          }),
          myOtherField: makeFieldValue({
            value: 'otherInitialValue',
            touched: true
          })
        },
        _active: undefined,
        _asyncValidating: false
      }, _defineProperty(_foo38, globalErrorKey, undefined), _defineProperty(_foo38, '_initialized', false), _defineProperty(_foo38, '_submitting', false), _defineProperty(_foo38, '_submitFailed', false), _foo38)
    }, _extends({}, untouch('deep.myField', 'deep.myOtherField'), {
      form: 'foo'
    }));
    expect(state.foo).toEqual((_expect$toEqual64 = {
      deep: {
        myField: {
          value: 'initialValue',
          _isFieldValue: true
        },
        myOtherField: {
          value: 'otherInitialValue',
          _isFieldValue: true
        }
      },
      _active: undefined,
      _asyncValidating: false
    }, _defineProperty(_expect$toEqual64, globalErrorKey, undefined), _defineProperty(_expect$toEqual64, '_initialized', false), _defineProperty(_expect$toEqual64, '_submitting', false), _defineProperty(_expect$toEqual64, '_submitFailed', false), _expect$toEqual64));
    expect(isFieldValue(state.foo.deep)).toBe(false);
    expect(isFieldValue(state.foo.deep.myField)).toBe(true);
    expect(isFieldValue(state.foo.deep.myOtherField)).toBe(true);
  });

  it('should unmark array fields as touched on untouch', function () {
    var _foo39, _expect$toEqual65;

    var state = reducer({
      foo: (_foo39 = {
        myFields: [makeFieldValue({
          value: 'initialValue',
          touched: true
        }), makeFieldValue({
          value: 'otherInitialValue',
          touched: true
        })],
        _active: undefined,
        _asyncValidating: false
      }, _defineProperty(_foo39, globalErrorKey, undefined), _defineProperty(_foo39, '_initialized', false), _defineProperty(_foo39, '_submitting', false), _defineProperty(_foo39, '_submitFailed', false), _foo39)
    }, _extends({}, untouch('myFields[0]', 'myFields[1]'), {
      form: 'foo'
    }));
    expect(state.foo).toEqual((_expect$toEqual65 = {
      myFields: [{
        value: 'initialValue',
        _isFieldValue: true
      }, {
        value: 'otherInitialValue',
        _isFieldValue: true
      }],
      _active: undefined,
      _asyncValidating: false
    }, _defineProperty(_expect$toEqual65, globalErrorKey, undefined), _defineProperty(_expect$toEqual65, '_initialized', false), _defineProperty(_expect$toEqual65, '_submitting', false), _defineProperty(_expect$toEqual65, '_submitFailed', false), _expect$toEqual65));
    expect(isFieldValue(state.foo.myFields)).toBe(false);
    expect(isFieldValue(state.foo.myFields[0])).toBe(true);
    expect(isFieldValue(state.foo.myFields[1])).toBe(true);
  });

  it('should mark index-less array fields as touched on touch', function () {
    var _foo40, _expect$toEqual66;

    var state = reducer({
      foo: (_foo40 = {
        myFields: [makeFieldValue({
          value: 'initialValue',
          touched: true
        }), makeFieldValue({
          value: 'otherInitialValue',
          touched: true
        })],
        _active: undefined,
        _asyncValidating: false
      }, _defineProperty(_foo40, globalErrorKey, undefined), _defineProperty(_foo40, '_initialized', false), _defineProperty(_foo40, '_submitting', false), _defineProperty(_foo40, '_submitFailed', false), _foo40)
    }, _extends({}, untouch('myFields[]'), {
      form: 'foo'
    }));
    expect(state.foo).toEqual((_expect$toEqual66 = {
      myFields: [{
        value: 'initialValue',
        _isFieldValue: true
      }, {
        value: 'otherInitialValue',
        _isFieldValue: true
      }],
      _active: undefined,
      _asyncValidating: false
    }, _defineProperty(_expect$toEqual66, globalErrorKey, undefined), _defineProperty(_expect$toEqual66, '_initialized', false), _defineProperty(_expect$toEqual66, '_submitting', false), _defineProperty(_expect$toEqual66, '_submitFailed', false), _expect$toEqual66));
    expect(isFieldValue(state.foo.myFields)).toBe(false);
    expect(isFieldValue(state.foo.myFields[0])).toBe(true);
    expect(isFieldValue(state.foo.myFields[1])).toBe(true);
  });

  it('should mark index-less array subfields as touched on touch', function () {
    var _foo41, _expect$toEqual67;

    var state = reducer({
      foo: (_foo41 = {
        myFields: [{
          name: makeFieldValue({
            value: 'initialValue',
            touched: true
          })
        }, {
          name: makeFieldValue({
            value: 'otherInitialValue',
            touched: true
          })
        }],
        _active: undefined,
        _asyncValidating: false
      }, _defineProperty(_foo41, globalErrorKey, undefined), _defineProperty(_foo41, '_initialized', false), _defineProperty(_foo41, '_submitting', false), _defineProperty(_foo41, '_submitFailed', false), _foo41)
    }, _extends({}, untouch('myFields[].name'), {
      form: 'foo'
    }));
    expect(state.foo).toEqual((_expect$toEqual67 = {
      myFields: [{
        name: {
          value: 'initialValue',
          _isFieldValue: true
        }
      }, {
        name: {
          value: 'otherInitialValue',
          _isFieldValue: true
        }
      }],
      _active: undefined,
      _asyncValidating: false
    }, _defineProperty(_expect$toEqual67, globalErrorKey, undefined), _defineProperty(_expect$toEqual67, '_initialized', false), _defineProperty(_expect$toEqual67, '_submitting', false), _defineProperty(_expect$toEqual67, '_submitFailed', false), _expect$toEqual67));
    expect(isFieldValue(state.foo.myFields)).toBe(false);
    expect(isFieldValue(state.foo.myFields[0])).toBe(false);
    expect(isFieldValue(state.foo.myFields[0].name)).toBe(true);
    expect(isFieldValue(state.foo.myFields[1])).toBe(false);
    expect(isFieldValue(state.foo.myFields[1].name)).toBe(true);
  });

  it('should destroy forms on destroy', function () {
    var _foo42, _bar, _bar2;

    var state = reducer({
      foo: (_foo42 = {
        _active: undefined,
        _asyncValidating: false
      }, _defineProperty(_foo42, globalErrorKey, undefined), _defineProperty(_foo42, '_initialized', false), _defineProperty(_foo42, '_submitting', false), _defineProperty(_foo42, '_submitFailed', false), _foo42),
      bar: (_bar = {
        _active: undefined,
        _asyncValidating: false
      }, _defineProperty(_bar, globalErrorKey, undefined), _defineProperty(_bar, '_initialized', false), _defineProperty(_bar, '_submitting', false), _defineProperty(_bar, '_submitFailed', false), _bar)
    }, _extends({}, destroy(), {
      form: 'foo'
    }));
    expect(state).toEqual({
      bar: (_bar2 = {
        _active: undefined,
        _asyncValidating: false
      }, _defineProperty(_bar2, globalErrorKey, undefined), _defineProperty(_bar2, '_initialized', false), _defineProperty(_bar2, '_submitting', false), _defineProperty(_bar2, '_submitFailed', false), _bar2)
    });
  });

  it('should destroy last form on destroy', function () {
    var _foo43;

    var state = reducer({
      foo: (_foo43 = {
        _active: undefined,
        _asyncValidating: false
      }, _defineProperty(_foo43, globalErrorKey, undefined), _defineProperty(_foo43, '_initialized', false), _defineProperty(_foo43, '_submitting', false), _defineProperty(_foo43, '_submitFailed', false), _foo43)
    }, _extends({}, destroy(), {
      form: 'foo'
    }));
    expect(state).toEqual({});
  });

  it('should destroy form and formkey on destroy', function () {
    var _barKey, _bazKey, _bazKey2;

    var destroyWithKey = function destroyWithKey(key) {
      return bindActionData(destroy, { key: key })();
    };
    var state = reducer({
      fooForm: {
        barKey: (_barKey = {
          _active: undefined,
          _asyncValidating: false
        }, _defineProperty(_barKey, globalErrorKey, undefined), _defineProperty(_barKey, '_initialized', false), _defineProperty(_barKey, '_submitting', false), _defineProperty(_barKey, '_submitFailed', false), _barKey),
        bazKey: (_bazKey = {
          _active: undefined,
          _asyncValidating: false
        }, _defineProperty(_bazKey, globalErrorKey, undefined), _defineProperty(_bazKey, '_initialized', false), _defineProperty(_bazKey, '_submitting', false), _defineProperty(_bazKey, '_submitFailed', false), _bazKey)
      }
    }, _extends({}, destroyWithKey('barKey'), {
      form: 'fooForm'
    }));
    expect(state.fooForm).toEqual({
      bazKey: (_bazKey2 = {
        _active: undefined,
        _asyncValidating: false
      }, _defineProperty(_bazKey2, globalErrorKey, undefined), _defineProperty(_bazKey2, '_initialized', false), _defineProperty(_bazKey2, '_submitting', false), _defineProperty(_bazKey2, '_submitFailed', false), _bazKey2)
    });
  });

  describe('reducer.plugin', function () {
    it('should initialize form state when there is a reducer plugin', function () {
      var _expect$toExist$toBeA2;

      var result = reducer.plugin({
        foo: function foo(state) {
          return state;
        }
      })();
      expect(result).toExist().toBeA('object');
      expect(Object.keys(result).length).toBe(1);
      expect(result.foo).toExist().toBeA('object').toEqual((_expect$toExist$toBeA2 = {
        _active: undefined,
        _asyncValidating: false
      }, _defineProperty(_expect$toExist$toBeA2, globalErrorKey, undefined), _defineProperty(_expect$toExist$toBeA2, '_initialized', false), _defineProperty(_expect$toExist$toBeA2, '_submitting', false), _defineProperty(_expect$toExist$toBeA2, '_submitFailed', false), _expect$toExist$toBeA2));
    });
  });

  describe('reducer.normalize', function () {
    it('should initialize form state when there is a normalizer', function () {
      var _expect$toExist$toBeA3;

      var state = reducer.normalize({
        foo: {
          'myField': function myField() {
            return 'normalized';
          },
          'person.name': function personName() {
            return 'John Doe';
          },
          'pets[].name': function petsName() {
            return 'Fido';
          }
        }
      })();
      expect(state).toExist().toBeA('object');
      expect(Object.keys(state).length).toBe(1);
      expect(state.foo).toExist().toBeA('object').toEqual((_expect$toExist$toBeA3 = {
        _active: undefined,
        _asyncValidating: false
      }, _defineProperty(_expect$toExist$toBeA3, globalErrorKey, undefined), _defineProperty(_expect$toExist$toBeA3, '_initialized', false), _defineProperty(_expect$toExist$toBeA3, '_submitting', false), _defineProperty(_expect$toExist$toBeA3, '_submitFailed', false), _defineProperty(_expect$toExist$toBeA3, 'myField', {
        value: 'normalized',
        _isFieldValue: true
      }), _defineProperty(_expect$toExist$toBeA3, 'person', {
        name: {
          value: 'John Doe',
          _isFieldValue: true
        }
      }), _defineProperty(_expect$toExist$toBeA3, 'pets', []), _expect$toExist$toBeA3));
    });

    it('should normalize keyed forms depending on action form key', function () {
      var _defaultFields;

      var defaultFields = (_defaultFields = {
        _active: undefined,
        _asyncValidating: false
      }, _defineProperty(_defaultFields, globalErrorKey, undefined), _defineProperty(_defaultFields, '_initialized', false), _defineProperty(_defaultFields, '_submitting', false), _defineProperty(_defaultFields, '_submitFailed', false), _defaultFields);
      var normalize = reducer.normalize({
        foo: {
          'myField': function myField() {
            return 'normalized';
          },
          'person.name': function personName() {
            return 'John Doe';
          },
          'pets[].name': function petsName() {
            return 'Fido';
          }
        }
      });
      var state = normalize({
        foo: {
          firstSubform: {}
        }
      }, {
        form: 'foo',
        key: 'firstSubform'
      });
      var nextState = normalize(state, {
        form: 'foo',
        key: 'secondSubForm'
      });
      expect(state).toExist().toBeA('object');
      expect(Object.keys(state).length).toBe(1);
      expect(state.foo).toExist().toBeA('object').toEqual({
        firstSubform: _extends({}, defaultFields, {
          myField: {
            value: 'normalized',
            _isFieldValue: true
          },
          person: {
            name: {
              value: 'John Doe',
              _isFieldValue: true
            }
          },
          pets: []
        })
      });
      expect(nextState.foo).toEqual({
        firstSubform: _extends({}, defaultFields, {
          myField: {
            value: 'normalized',
            _isFieldValue: true
          },
          person: {
            name: {
              value: 'John Doe',
              _isFieldValue: true
            }
          },
          pets: []
        }),
        secondSubForm: _extends({}, defaultFields, {
          myField: {
            value: 'normalized',
            _isFieldValue: true
          },
          person: {
            name: {
              value: 'John Doe',
              _isFieldValue: true
            }
          },
          pets: []
        })
      });
    });

    it('should normalize simple form values', function () {
      var _defaultFields2;

      var defaultFields = (_defaultFields2 = {
        _active: undefined,
        _asyncValidating: false
      }, _defineProperty(_defaultFields2, globalErrorKey, undefined), _defineProperty(_defaultFields2, '_initialized', false), _defineProperty(_defaultFields2, '_submitting', false), _defineProperty(_defaultFields2, '_submitFailed', false), _defaultFields2);
      var normalize = reducer.normalize({
        foo: {
          'name': function name() {
            return 'normalized';
          },
          'person.name': function personName(name) {
            return name && name.toUpperCase();
          },
          'pets[].name': function petsName(name) {
            return name && name.toLowerCase();
          }
        }
      });
      var state = normalize({
        foo: {
          name: {
            value: 'dog'
          },
          person: {
            name: {
              value: 'John Doe',
              _isFieldValue: true
            }
          },
          pets: [{
            name: {
              value: 'Fido',
              _isFieldValue: true
            }
          }, {
            name: {
              value: 'Tucker',
              _isFieldValue: true
            }
          }]
        }
      });
      expect(state).toExist().toBeA('object');
      expect(state.foo).toExist().toBeA('object').toEqual(_extends({}, defaultFields, {
        name: {
          value: 'normalized',
          _isFieldValue: true
        },
        person: {
          name: {
            value: 'JOHN DOE',
            _isFieldValue: true
          }
        },
        pets: [{
          name: {
            value: 'fido',
            _isFieldValue: true
          }
        }, {
          name: {
            value: 'tucker',
            _isFieldValue: true
          }
        }]
      }));
    });

    it('should allow resetForm to work on a normalized form', function () {
      var _defaultFields3;

      var defaultFields = (_defaultFields3 = {
        _active: undefined,
        _asyncValidating: false
      }, _defineProperty(_defaultFields3, globalErrorKey, undefined), _defineProperty(_defaultFields3, '_initialized', false), _defineProperty(_defaultFields3, '_submitting', false), _defineProperty(_defaultFields3, '_submitFailed', false), _defaultFields3);
      var normalizingReducer = reducer.normalize({
        foo: {
          'name': function name(value) {
            return value && value.toUpperCase();
          },
          'person.name': function personName(name) {
            return name && name.toUpperCase();
          },
          'pets[].name': function petsName(name) {
            return name && name.toLowerCase();
          }
        }
      });
      var empty = normalizingReducer();
      var state = normalizingReducer(empty, _extends({
        form: 'foo'
      }, change('name', 'dog')));
      state = normalizingReducer(state, _extends({
        form: 'foo'
      }, change('person.name', 'John Doe')));
      state = normalizingReducer(state, _extends({
        form: 'foo'
      }, addArrayValue('pets', { name: 'Fido' })));
      expect(state).toExist().toBeA('object');
      expect(state.foo).toExist().toBeA('object').toEqual(_extends({}, defaultFields, {
        name: {
          value: 'DOG',
          _isFieldValue: true
        },
        person: {
          name: {
            value: 'JOHN DOE',
            _isFieldValue: true
          }
        },
        pets: [{
          name: {
            initial: 'Fido',
            value: 'fido',
            _isFieldValue: true
          }
        }]
      }));
      var result = normalizingReducer(state, _extends({
        form: 'foo'
      }, reset()));
      expect(result).toExist().toBeA('object');
      expect(result.foo).toExist().toBeA('object').toEqual(_extends({}, defaultFields, {
        name: {
          value: undefined,
          _isFieldValue: true
        },
        person: {
          name: {
            value: undefined,
            _isFieldValue: true
          }
        },
        pets: [{
          name: {
            initial: 'Fido',
            value: 'fido',
            _isFieldValue: true
          }
        }]
      }));
    });

    it('should normalize arbitrarily deeply nested fields', function () {
      var _defaultFields4;

      var defaultFields = (_defaultFields4 = {
        _active: undefined,
        _asyncValidating: false
      }, _defineProperty(_defaultFields4, globalErrorKey, undefined), _defineProperty(_defaultFields4, '_initialized', false), _defineProperty(_defaultFields4, '_submitting', false), _defineProperty(_defaultFields4, '_submitFailed', false), _defaultFields4);
      var normalize = reducer.normalize({
        foo: {
          'name': function name() {
            return 'normalized';
          },
          'person.name': function personName(name) {
            return name && name.toUpperCase();
          },
          'pets[].name': function petsName(name) {
            return name && name.toLowerCase();
          },
          'cats[]': function cats(array) {
            return array && array.map(function (_ref) {
              var value = _ref.value;
              return { value: value.toUpperCase() };
            });
          },
          'programming[].langs[]': function programmingLangs(array) {
            return array && array.slice(0).sort(compare);
          },
          'some.numbers[]': function someNumbers(array) {
            return array && array.filter(function (_ref2) {
              var value = _ref2.value;
              return value % 2 === 0;
            });
          },
          'a.very.deep.object.property': function aVeryDeepObjectProperty(value) {
            return value && value.toUpperCase();
          },
          'my[].deeply[].nested.item': function myDeeplyNestedItem(value) {
            return value && value.toUpperCase();
          }
        }
      });
      var state = normalize({
        foo: {
          person: {
            name: makeFieldValue({ value: 'John Doe' })
          },
          pets: [{ name: makeFieldValue({ value: 'Fido' }) }, { name: makeFieldValue({ value: 'Tucker' }) }],
          cats: [makeFieldValue({ value: 'lion' }), makeFieldValue({ value: 'panther' }), makeFieldValue({ value: 'garfield' }), makeFieldValue({ value: 'whiskers' })],
          programming: [{
            langs: [makeFieldValue({ value: 'ml' }), makeFieldValue({ value: 'ocaml' }), makeFieldValue({ value: 'lisp' }), makeFieldValue({ value: 'haskell' }), makeFieldValue({ value: 'f#' })]
          }, {
            langs: [makeFieldValue({ value: 'smalltalk' }), makeFieldValue({ value: 'ruby' }), makeFieldValue({ value: 'java' }), makeFieldValue({ value: 'c#' }), makeFieldValue({ value: 'c++' })]
          }],
          some: {
            numbers: [makeFieldValue({ value: 1 }), makeFieldValue({ value: 2 }), makeFieldValue({ value: 3 }), makeFieldValue({ value: 4 }), makeFieldValue({ value: 5 }), makeFieldValue({ value: 6 }), makeFieldValue({ value: 7 }), makeFieldValue({ value: 8 }), makeFieldValue({ value: 9 }), makeFieldValue({ value: 10 })]
          },
          a: {
            very: {
              deep: {
                object: {
                  property: makeFieldValue({ value: 'test' })
                }
              }
            }
          },
          my: [{
            deeply: [{
              nested: {
                item: makeFieldValue({ value: 'hello' }),
                not: makeFieldValue({ value: 'lost' })
              },
              otherKey: makeFieldValue({ value: 'Goodbye' })
            }, {
              nested: {
                item: makeFieldValue({ value: 'hola' }),
                not: makeFieldValue({ value: 'lost' })
              },
              otherKey: makeFieldValue({ value: 'Adios' })
            }],
            stays: makeFieldValue({ value: 'intact' })
          }, {
            deeply: [{
              nested: {
                item: makeFieldValue({ value: 'world' }),
                not: makeFieldValue({ value: 'lost' })
              },
              otherKey: makeFieldValue({ value: 'Later' })
            }, {
              nested: {
                item: makeFieldValue({ value: 'mundo' }),
                not: makeFieldValue({ value: 'lost' })
              },
              otherKey: makeFieldValue({ value: 'Hasta luego' })
            }],
            stays: makeFieldValue({ value: 'intact' })
          }]
        }
      });
      expect(state).toExist().toBeA('object');
      expect(state.foo).toExist().toBeA('object').toEqual(_extends({}, defaultFields, {
        name: {
          value: 'normalized',
          _isFieldValue: true
        },
        person: {
          name: {
            value: 'JOHN DOE',
            _isFieldValue: true
          }
        },
        pets: [{
          name: {
            value: 'fido',
            _isFieldValue: true
          }
        }, {
          name: {
            value: 'tucker',
            _isFieldValue: true
          }
        }],
        cats: [{
          value: 'LION',
          _isFieldValue: true
        }, {
          value: 'PANTHER',
          _isFieldValue: true
        }, {
          value: 'GARFIELD',
          _isFieldValue: true
        }, {
          value: 'WHISKERS',
          _isFieldValue: true
        }],
        programming: [{
          langs: [{
            value: 'f#',
            _isFieldValue: true
          }, {
            value: 'haskell',
            _isFieldValue: true
          }, {
            value: 'lisp',
            _isFieldValue: true
          }, {
            value: 'ml',
            _isFieldValue: true
          }, {
            value: 'ocaml',
            _isFieldValue: true
          }]
        }, {
          langs: [{
            value: 'c#',
            _isFieldValue: true
          }, {
            value: 'c++',
            _isFieldValue: true
          }, {
            value: 'java',
            _isFieldValue: true
          }, {
            value: 'ruby',
            _isFieldValue: true
          }, {
            value: 'smalltalk',
            _isFieldValue: true
          }]
        }],
        some: {
          numbers: [{
            value: 2,
            _isFieldValue: true
          }, {
            value: 4,
            _isFieldValue: true
          }, {
            value: 6,
            _isFieldValue: true
          }, {
            value: 8,
            _isFieldValue: true
          }, {
            value: 10,
            _isFieldValue: true
          }]
        },
        a: {
          very: {
            deep: {
              object: {
                property: {
                  value: 'TEST',
                  _isFieldValue: true
                }
              }
            }
          }
        },
        my: [{
          deeply: [{
            nested: {
              item: {
                value: 'HELLO',
                _isFieldValue: true
              },
              not: {
                value: 'lost',
                _isFieldValue: true
              }
            },
            otherKey: {
              value: 'Goodbye',
              _isFieldValue: true
            }
          }, {
            nested: {
              item: {
                value: 'HOLA',
                _isFieldValue: true
              },
              not: {
                value: 'lost',
                _isFieldValue: true
              }
            },
            otherKey: {
              value: 'Adios',
              _isFieldValue: true
            }
          }],
          stays: {
            value: 'intact',
            _isFieldValue: true
          }
        }, {
          deeply: [{
            nested: {
              item: {
                value: 'WORLD',
                _isFieldValue: true
              },
              not: {
                value: 'lost',
                _isFieldValue: true
              }
            },
            otherKey: {
              value: 'Later',
              _isFieldValue: true
            }
          }, {
            nested: {
              item: {
                value: 'MUNDO',
                _isFieldValue: true
              },
              not: {
                value: 'lost',
                _isFieldValue: true
              }
            },
            otherKey: {
              value: 'Hasta luego',
              _isFieldValue: true
            }
          }],
          stays: {
            value: 'intact',
            _isFieldValue: true
          }
        }]
      }));
      expect(isFieldValue(state.foo.name)).toBe(true);
      expect(isFieldValue(state.foo.person.name)).toBe(true);
      expect(isFieldValue(state.foo.pets[0].name)).toBe(true);
      expect(isFieldValue(state.foo.pets[1].name)).toBe(true);
      expect(isFieldValue(state.foo.cats[0])).toBe(true);
      expect(isFieldValue(state.foo.cats[1])).toBe(true);
      expect(isFieldValue(state.foo.cats[2])).toBe(true);
      expect(isFieldValue(state.foo.cats[3])).toBe(true);
      expect(isFieldValue(state.foo.programming[0].langs[0])).toBe(true);
      expect(isFieldValue(state.foo.programming[0].langs[1])).toBe(true);
      expect(isFieldValue(state.foo.programming[0].langs[2])).toBe(true);
      expect(isFieldValue(state.foo.programming[0].langs[3])).toBe(true);
      expect(isFieldValue(state.foo.programming[0].langs[4])).toBe(true);
      expect(isFieldValue(state.foo.programming[1].langs[0])).toBe(true);
      expect(isFieldValue(state.foo.programming[1].langs[1])).toBe(true);
      expect(isFieldValue(state.foo.programming[1].langs[2])).toBe(true);
      expect(isFieldValue(state.foo.programming[1].langs[3])).toBe(true);
      expect(isFieldValue(state.foo.programming[1].langs[4])).toBe(true);
      expect(isFieldValue(state.foo.some.numbers[0])).toBe(true);
      expect(isFieldValue(state.foo.some.numbers[1])).toBe(true);
      expect(isFieldValue(state.foo.some.numbers[2])).toBe(true);
      expect(isFieldValue(state.foo.some.numbers[3])).toBe(true);
      expect(isFieldValue(state.foo.some.numbers[4])).toBe(true);
      expect(isFieldValue(state.foo.a.very.deep.object.property)).toBe(true);
      expect(isFieldValue(state.foo.my[0].deeply[0].nested.item)).toBe(true);
      expect(isFieldValue(state.foo.my[0].deeply[0].nested.not)).toBe(true);
      expect(isFieldValue(state.foo.my[0].deeply[0].otherKey)).toBe(true);
      expect(isFieldValue(state.foo.my[0].deeply[1].nested.item)).toBe(true);
      expect(isFieldValue(state.foo.my[0].deeply[1].nested.not)).toBe(true);
      expect(isFieldValue(state.foo.my[0].deeply[1].otherKey)).toBe(true);
      expect(isFieldValue(state.foo.my[0].stays)).toBe(true);
      expect(isFieldValue(state.foo.my[1].deeply[0].nested.item)).toBe(true);
      expect(isFieldValue(state.foo.my[1].deeply[0].nested.not)).toBe(true);
      expect(isFieldValue(state.foo.my[1].deeply[0].otherKey)).toBe(true);
      expect(isFieldValue(state.foo.my[1].deeply[1].nested.item)).toBe(true);
      expect(isFieldValue(state.foo.my[1].deeply[1].nested.not)).toBe(true);
      expect(isFieldValue(state.foo.my[1].deeply[1].otherKey)).toBe(true);
      expect(isFieldValue(state.foo.my[1].stays)).toBe(true);
    });

    it('should use a copy of the original field', function () {

      var normalize = reducer.normalize({
        foo: {
          'name': function name() {
            return 'normalized';
          }
        }
      });

      var state0 = {
        foo: {
          name: makeFieldValue({ value: 'John Doe' })
        }
      };

      var state1 = normalize(state0);
      expect(state0.foo.name.value).toEqual('John Doe');
      expect(state1.foo.name.value).toEqual('normalized');
    });
  });

  it('should flag the correct field as active', function () {
    var store = createStore(reducer);

    store.dispatch(_extends({ form: 'foo' }, initialize({}, ['a', 'b'])));
    store.dispatch(_extends({ form: 'foo' }, focus('a')));
    store.dispatch(_extends({ form: 'foo' }, focus('b')));

    expect(store.getState()).toMatch({
      foo: { _active: 'b' }
    });

    store.dispatch(_extends({ form: 'foo' }, blur('a')));

    expect(store.getState()).toMatch({
      foo: { _active: 'b' }
    });

    store.dispatch(_extends({ form: 'foo' }, blur('b')));

    expect(store.getState().foo).toExcludeKey('_active');
  });
});