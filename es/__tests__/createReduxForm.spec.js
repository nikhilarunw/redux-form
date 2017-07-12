var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* eslint react/no-multi-comp:0 */
import expect, { createSpy } from 'expect';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import { combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from '../reducer';
import { makeFieldValue } from '../fieldValue';
import createReduxForm from '../createReduxForm';

var createRestorableSpy = function createRestorableSpy(fn) {
  return createSpy(fn, function restore() {
    this.calls = [];
  });
};

describe('createReduxForm', function () {
  var reduxForm = createReduxForm(false, React, connect);
  var makeStore = function makeStore() {
    var initialState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return createStore(combineReducers({
      form: reducer
    }), { form: initialState });
  };

  it('should return a decorator function', function () {
    expect(reduxForm).toBeA('function');
  });

  var Form = function (_Component) {
    _inherits(Form, _Component);

    function Form() {
      _classCallCheck(this, Form);

      return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
    }

    _createClass(Form, [{
      key: 'render',
      value: function render() {
        return React.createElement('div', null);
      }
    }]);

    return Form;
  }(Component);

  var Passthrough = function (_Component2) {
    _inherits(Passthrough, _Component2);

    function Passthrough() {
      _classCallCheck(this, Passthrough);

      return _possibleConstructorReturn(this, (Passthrough.__proto__ || Object.getPrototypeOf(Passthrough)).apply(this, arguments));
    }

    _createClass(Passthrough, [{
      key: 'render',
      value: function render() {
        return React.createElement('div', this.props);
      }
    }]);

    return Passthrough;
  }(Component);

  var expectField = function expectField(_ref) {
    var field = _ref.field,
        name = _ref.name,
        value = _ref.value,
        initial = _ref.initial,
        valid = _ref.valid,
        dirty = _ref.dirty,
        error = _ref.error,
        touched = _ref.touched,
        visited = _ref.visited,
        readonly = _ref.readonly,
        autofilled = _ref.autofilled;

    expect(field).toBeA('object');
    expect(field.name).toBe(name);
    expect(field.value).toEqual(value);
    if (readonly) {
      expect(field.autofill).toNotExist();
      expect(field.onBlur).toNotExist();
      expect(field.onChange).toNotExist();
      expect(field.onDragStart).toNotExist();
      expect(field.onDrop).toNotExist();
      expect(field.onFocus).toNotExist();
      expect(field.onUpdate).toNotExist();
    } else {
      expect(field.autofill).toBeA('function');
      expect(field.onBlur).toBeA('function');
      expect(field.onChange).toBeA('function');
      expect(field.onDragStart).toBeA('function');
      expect(field.onDrop).toBeA('function');
      expect(field.onFocus).toBeA('function');
      expect(field.onUpdate).toBeA('function');
    }
    expect(field.initialValue).toEqual(initial);
    expect(field.valid).toBe(valid);
    expect(field.invalid).toBe(!valid);
    expect(field.dirty).toBe(dirty);
    expect(field.pristine).toBe(!dirty);
    expect(field.error).toEqual(error);
    expect(field.touched).toBe(touched);
    expect(field.visited).toBe(visited);
    if (autofilled) {
      expect(field.autofilled).toBe(autofilled);
    } else {
      expect(autofilled in field).toBe(false);
    }
  };

  it('should render without error', function () {
    var store = makeStore();
    expect(function () {
      var Decorated = reduxForm({
        form: 'testForm',
        fields: ['foo', 'bar']
      })(Form);
      TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(Decorated, null)
      ));
    }).toNotThrow();
  });

  it('should pass fields as props', function () {
    var store = makeStore();
    var Decorated = reduxForm({
      form: 'testForm',
      fields: ['foo', 'bar']
    })(Form);
    var dom = TestUtils.renderIntoDocument(React.createElement(
      Provider,
      { store: store },
      React.createElement(Decorated, null)
    ));
    var stub = TestUtils.findRenderedComponentWithType(dom, Form);
    expect(stub.props.fields).toBeA('object');
    expectField({
      field: stub.props.fields.foo,
      name: 'foo',
      value: '',
      initial: '',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });
    expectField({
      field: stub.props.fields.bar,
      name: 'bar',
      value: '',
      initial: '',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });
  });

  it('should initialize field values', function () {
    var store = makeStore();
    var Decorated = reduxForm({
      form: 'testForm',
      fields: ['foo', 'bar']
    })(Form);
    var dom = TestUtils.renderIntoDocument(React.createElement(
      Provider,
      { store: store },
      React.createElement(Decorated, { initialValues: { foo: 'fooValue', bar: 'barValue' } })
    ));
    var stub = TestUtils.findRenderedComponentWithType(dom, Form);
    expect(stub.props.fields).toBeA('object');
    expectField({
      field: stub.props.fields.foo,
      name: 'foo',
      value: 'fooValue',
      initial: 'fooValue',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });
    expectField({
      field: stub.props.fields.bar,
      name: 'bar',
      value: 'barValue',
      initial: 'barValue',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });
  });

  it('should set value and autofilled and NOT touch field on autofill', function () {
    var store = makeStore();
    var form = 'testForm';
    var Decorated = reduxForm({
      form: form,
      fields: ['foo', 'bar']
    })(Form);
    var dom = TestUtils.renderIntoDocument(React.createElement(
      Provider,
      { store: store },
      React.createElement(Decorated, null)
    ));
    var stub = TestUtils.findRenderedComponentWithType(dom, Form);

    stub.props.fields.foo.autofill('fooValue');

    expect(stub.props.fields).toBeA('object');
    expectField({
      field: stub.props.fields.foo,
      name: 'foo',
      value: 'fooValue',
      initial: '',
      valid: true,
      dirty: true,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false,
      autofilled: true
    });
    expectField({
      field: stub.props.fields.bar,
      name: 'bar',
      value: '',
      initial: '',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });
  });

  it('should set value and touch field on blur', function () {
    var store = makeStore();
    var form = 'testForm';
    var Decorated = reduxForm({
      form: form,
      fields: ['foo', 'bar']
    })(Form);
    var dom = TestUtils.renderIntoDocument(React.createElement(
      Provider,
      { store: store },
      React.createElement(Decorated, null)
    ));
    var stub = TestUtils.findRenderedComponentWithType(dom, Form);

    stub.props.fields.foo.onBlur('fooValue');

    expect(stub.props.fields).toBeA('object');
    expectField({
      field: stub.props.fields.foo,
      name: 'foo',
      value: 'fooValue',
      initial: '',
      valid: true,
      dirty: true,
      error: undefined,
      touched: true,
      visited: false,
      readonly: false
    });
    expectField({
      field: stub.props.fields.bar,
      name: 'bar',
      value: '',
      initial: '',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });
  });

  it('should set value and NOT touch field on blur if touchOnBlur is disabled', function () {
    var store = makeStore();
    var form = 'testForm';
    var Decorated = reduxForm({
      form: form,
      fields: ['foo', 'bar'],
      touchOnBlur: false
    })(Form);
    var dom = TestUtils.renderIntoDocument(React.createElement(
      Provider,
      { store: store },
      React.createElement(Decorated, null)
    ));
    var stub = TestUtils.findRenderedComponentWithType(dom, Form);

    stub.props.fields.foo.onBlur('fooValue');

    expect(stub.props.fields).toBeA('object');
    expectField({
      field: stub.props.fields.foo,
      name: 'foo',
      value: 'fooValue',
      initial: '',
      valid: true,
      dirty: true,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });
    expectField({
      field: stub.props.fields.bar,
      name: 'bar',
      value: '',
      initial: '',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });
  });

  it('should set value and NOT touch field on change', function () {
    var store = makeStore();
    var form = 'testForm';
    var Decorated = reduxForm({
      form: form,
      fields: ['foo', 'bar']
    })(Form);
    var dom = TestUtils.renderIntoDocument(React.createElement(
      Provider,
      { store: store },
      React.createElement(Decorated, null)
    ));
    var stub = TestUtils.findRenderedComponentWithType(dom, Form);

    stub.props.fields.foo.onChange('fooValue');

    expect(stub.props.fields).toBeA('object');
    expectField({
      field: stub.props.fields.foo,
      name: 'foo',
      value: 'fooValue',
      initial: '',
      valid: true,
      dirty: true,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });
    expectField({
      field: stub.props.fields.bar,
      name: 'bar',
      value: '',
      initial: '',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });
  });

  it('should set value and touch field on change if touchOnChange is enabled', function () {
    var store = makeStore();
    var form = 'testForm';
    var Decorated = reduxForm({
      form: form,
      fields: ['foo', 'bar'],
      touchOnChange: true
    })(Form);
    var dom = TestUtils.renderIntoDocument(React.createElement(
      Provider,
      { store: store },
      React.createElement(Decorated, null)
    ));
    var stub = TestUtils.findRenderedComponentWithType(dom, Form);

    stub.props.fields.foo.onChange('fooValue');

    expect(stub.props.fields).toBeA('object');
    expectField({
      field: stub.props.fields.foo,
      name: 'foo',
      value: 'fooValue',
      initial: '',
      valid: true,
      dirty: true,
      error: undefined,
      touched: true,
      visited: false,
      readonly: false
    });
    expectField({
      field: stub.props.fields.bar,
      name: 'bar',
      value: '',
      initial: '',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });
  });

  it('should set visited field on focus', function () {
    var store = makeStore();
    var form = 'testForm';
    var Decorated = reduxForm({
      form: form,
      fields: ['foo', 'bar']
    })(Form);
    var dom = TestUtils.renderIntoDocument(React.createElement(
      Provider,
      { store: store },
      React.createElement(Decorated, null)
    ));
    var stub = TestUtils.findRenderedComponentWithType(dom, Form);

    expect(stub.props.active).toBe(undefined);

    stub.props.fields.foo.onFocus();

    expect(stub.props.active).toBe('foo');

    expect(stub.props.fields).toBeA('object');
    expectField({
      field: stub.props.fields.foo,
      name: 'foo',
      value: '',
      initial: '',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: true,
      readonly: false
    });
    expectField({
      field: stub.props.fields.bar,
      name: 'bar',
      value: '',
      initial: '',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });
  });

  it('should set dirty when field changes', function () {
    var store = makeStore();
    var form = 'testForm';
    var Decorated = reduxForm({
      form: form,
      fields: ['foo', 'bar']
    })(Form);
    var dom = TestUtils.renderIntoDocument(React.createElement(
      Provider,
      { store: store },
      React.createElement(Decorated, { initialValues: { foo: 'fooValue', bar: 'barValue' } })
    ));
    var stub = TestUtils.findRenderedComponentWithType(dom, Form);

    expectField({
      field: stub.props.fields.foo,
      name: 'foo',
      value: 'fooValue',
      initial: 'fooValue',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });

    stub.props.fields.foo.onChange('fooValue!');

    expectField({
      field: stub.props.fields.foo,
      name: 'foo',
      value: 'fooValue!',
      initial: 'fooValue',
      valid: true,
      dirty: true,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });
  });

  it('should set dirty when and array field changes', function () {
    var store = makeStore();
    var form = 'testForm';
    var Decorated = reduxForm({
      form: form,
      fields: ['children[].name']
    })(Form);
    var dom = TestUtils.renderIntoDocument(React.createElement(
      Provider,
      { store: store },
      React.createElement(Decorated, { initialValues: { children: [{ name: 'Tom' }, { name: 'Jerry' }] } })
    ));
    var stub = TestUtils.findRenderedComponentWithType(dom, Form);
    expect(stub.props.fields.children).toBeA('array');
    expect(stub.props.fields.children.length).toBe(2);

    expectField({
      field: stub.props.fields.children[0].name,
      name: 'children[0].name',
      value: 'Tom',
      initial: 'Tom',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });
    expectField({
      field: stub.props.fields.children[1].name,
      name: 'children[1].name',
      value: 'Jerry',
      initial: 'Jerry',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });

    stub.props.fields.children[0].name.onChange('Tim');

    expectField({
      field: stub.props.fields.children[0].name,
      name: 'children[0].name',
      value: 'Tim',
      initial: 'Tom',
      valid: true,
      dirty: true,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });
    expectField({
      field: stub.props.fields.children[1].name,
      name: 'children[1].name',
      value: 'Jerry',
      initial: 'Jerry',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });
  });

  it('should delete autofilled when field changes', function () {
    var store = makeStore();
    var form = 'testForm';
    var Decorated = reduxForm({
      form: form,
      fields: ['foo', 'bar']
    })(Form);
    var dom = TestUtils.renderIntoDocument(React.createElement(
      Provider,
      { store: store },
      React.createElement(Decorated, null)
    ));
    var stub = TestUtils.findRenderedComponentWithType(dom, Form);

    stub.props.fields.foo.autofill('fooValue');

    expectField({
      field: stub.props.fields.foo,
      name: 'foo',
      value: 'fooValue',
      initial: '',
      valid: true,
      dirty: true,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false,
      autofilled: true
    });

    stub.props.fields.foo.onChange('fooValue!');

    expectField({
      field: stub.props.fields.foo,
      name: 'foo',
      value: 'fooValue!',
      initial: '',
      valid: true,
      dirty: true,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });
  });

  it('should trigger sync error on change that invalidates value', function () {
    var store = makeStore();
    var form = 'testForm';
    var Decorated = reduxForm({
      form: form,
      fields: ['foo', 'bar'],
      validate: function validate(values) {
        var errors = {};
        if (values.foo && values.foo.length > 8) {
          errors.foo = 'Too long';
        }
        if (!values.bar) {
          errors.bar = 'Required';
        }
        return errors;
      }
    })(Form);
    var dom = TestUtils.renderIntoDocument(React.createElement(
      Provider,
      { store: store },
      React.createElement(Decorated, { initialValues: { foo: 'fooValue', bar: 'barValue' } })
    ));
    var stub = TestUtils.findRenderedComponentWithType(dom, Form);

    expectField({
      field: stub.props.fields.foo,
      name: 'foo',
      value: 'fooValue',
      initial: 'fooValue',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });

    expectField({
      field: stub.props.fields.bar,
      name: 'bar',
      value: 'barValue',
      initial: 'barValue',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });
    expect(stub.props.valid).toBe(true);
    expect(stub.props.invalid).toBe(false);
    expect(stub.props.errors).toEqual({});

    stub.props.fields.foo.onChange('fooValue!');

    expectField({
      field: stub.props.fields.foo,
      name: 'foo',
      value: 'fooValue!',
      initial: 'fooValue',
      valid: false,
      dirty: true,
      error: 'Too long',
      touched: false,
      visited: false,
      readonly: false
    });

    stub.props.fields.bar.onChange('');

    expectField({
      field: stub.props.fields.bar,
      name: 'bar',
      value: '',
      initial: 'barValue',
      valid: false,
      dirty: true,
      error: 'Required',
      touched: false,
      visited: false,
      readonly: false
    });

    expect(stub.props.valid).toBe(false);
    expect(stub.props.invalid).toBe(true);
    expect(stub.props.errors).toEqual({
      foo: 'Too long',
      bar: 'Required'
    });
  });

  it('should trigger sync error on change that invalidates nested value', function () {
    var store = makeStore();
    var form = 'testForm';
    var Decorated = reduxForm({
      form: form,
      fields: ['foo.bar'],
      validate: function validate(values) {
        var errors = {};
        if (values.foo.bar && values.foo.bar.length > 8) {
          errors.foo = { bar: 'Too long' };
        }
        return errors;
      }
    })(Form);
    var dom = TestUtils.renderIntoDocument(React.createElement(
      Provider,
      { store: store },
      React.createElement(Decorated, { initialValues: { foo: { bar: 'fooBar' } } })
    ));
    var stub = TestUtils.findRenderedComponentWithType(dom, Form);

    expectField({
      field: stub.props.fields.foo.bar,
      name: 'foo.bar',
      value: 'fooBar',
      initial: 'fooBar',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });
    expect(stub.props.valid).toBe(true);
    expect(stub.props.invalid).toBe(false);
    expect(stub.props.errors).toEqual({});

    stub.props.fields.foo.bar.onChange('fooBarBaz');

    expectField({
      field: stub.props.fields.foo.bar,
      name: 'foo.bar',
      value: 'fooBarBaz',
      initial: 'fooBar',
      valid: false,
      dirty: true,
      error: 'Too long',
      touched: false,
      visited: false,
      readonly: false
    });

    expect(stub.props.valid).toBe(false);
    expect(stub.props.invalid).toBe(true);
    expect(stub.props.errors).toEqual({
      foo: {
        bar: 'Too long'
      }
    });
  });

  it('should trigger sync error on change that invalidates array value', function () {
    var store = makeStore();
    var form = 'testForm';
    var Decorated = reduxForm({
      form: form,
      fields: ['foo[]', 'bar[].name'],
      validate: function validate(values) {
        var errors = {};
        if (values.foo && values.foo.length && values.foo[0] && values.foo[0].length > 8) {
          errors.foo = ['Too long'];
        }
        if (values.bar && values.bar.length && values.bar[0] && values.bar[0].name === 'Ralphie') {
          errors.bar = [{ name: 'You\'ll shoot your eye out, kid!' }];
        }
        return errors;
      }
    })(Form);
    var dom = TestUtils.renderIntoDocument(React.createElement(
      Provider,
      { store: store },
      React.createElement(Decorated, { initialValues: { foo: ['fooBar'], bar: [{ name: '' }] } })
    ));
    var stub = TestUtils.findRenderedComponentWithType(dom, Form);

    expectField({
      field: stub.props.fields.foo[0],
      name: 'foo[0]',
      value: 'fooBar',
      initial: 'fooBar',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });

    expectField({
      field: stub.props.fields.bar[0].name,
      name: 'bar[0].name',
      value: '',
      initial: '',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });
    expect(stub.props.valid).toBe(true);
    expect(stub.props.invalid).toBe(false);
    expect(stub.props.errors).toEqual({});

    stub.props.fields.foo[0].onChange('fooBarBaz');

    expectField({
      field: stub.props.fields.foo[0],
      name: 'foo[0]',
      value: 'fooBarBaz',
      initial: 'fooBar',
      valid: false,
      dirty: true,
      error: 'Too long',
      touched: false,
      visited: false,
      readonly: false
    });

    stub.props.fields.bar[0].name.onChange('Ralphie');

    expectField({
      field: stub.props.fields.bar[0].name,
      name: 'bar[0].name',
      value: 'Ralphie',
      initial: '',
      valid: false,
      dirty: true,
      error: 'You\'ll shoot your eye out, kid!',
      touched: false,
      visited: false,
      readonly: false
    });

    expect(stub.props.valid).toBe(false);
    expect(stub.props.invalid).toBe(true);
    expect(stub.props.errors).toEqual({
      foo: ['Too long'],
      bar: [{ name: 'You\'ll shoot your eye out, kid!' }]
    });
  });

  it('should call destroy on unmount', function () {
    var store = makeStore();
    var form = 'testForm';
    var Decorated = reduxForm({
      form: form,
      fields: ['foo', 'bar']
    })(Form);

    var div = document.createElement('div');
    ReactDOM.render(React.createElement(
      Provider,
      { store: store },
      React.createElement(Decorated, { initialValues: { foo: 'fooValue', bar: 'barValue' } })
    ), div);
    var before = store.getState();
    expect(before.form).toBeA('object');
    expect(before.form[form]).toBeA('object');
    expect(before.form[form].foo).toBeA('object');
    expect(before.form[form].bar).toBeA('object');

    ReactDOM.unmountComponentAtNode(div);

    var after = store.getState();
    expect(after.form).toBeA('object');
    expect(after.form[form]).toNotExist();
  });

  it('should NOT call destroy on unmount if destroyOnUnmount is disabled', function () {
    var store = makeStore();
    var form = 'testForm';
    var Decorated = reduxForm({
      form: form,
      fields: ['foo', 'bar'],
      destroyOnUnmount: false
    })(Form);

    var div = document.createElement('div');
    ReactDOM.render(React.createElement(
      Provider,
      { store: store },
      React.createElement(Decorated, { initialValues: { foo: 'fooValue', bar: 'barValue' } })
    ), div);
    var before = store.getState();
    expect(before.form).toBeA('object');
    expect(before.form[form]).toBeA('object');
    expect(before.form[form].foo).toBeA('object');
    expect(before.form[form].bar).toBeA('object');

    ReactDOM.unmountComponentAtNode(div);

    var after = store.getState();
    expect(after.form).toBeA('object');
    expect(after.form[form]).toBeA('object');
    expect(after.form[form].foo).toBeA('object');
    expect(after.form[form].bar).toBeA('object');
  });

  it('should hoist statics', function () {
    var FormWithStatics = function (_Component3) {
      _inherits(FormWithStatics, _Component3);

      function FormWithStatics() {
        _classCallCheck(this, FormWithStatics);

        return _possibleConstructorReturn(this, (FormWithStatics.__proto__ || Object.getPrototypeOf(FormWithStatics)).apply(this, arguments));
      }

      _createClass(FormWithStatics, [{
        key: 'render',
        value: function render() {
          return React.createElement('div', null);
        }
      }]);

      return FormWithStatics;
    }(Component);

    FormWithStatics.someStatic1 = 'cat';
    FormWithStatics.someStatic2 = 42;

    var Decorated = reduxForm({
      form: 'testForm',
      fields: ['foo', 'bar']
    })(FormWithStatics);

    expect(Decorated.someStatic1).toBe('cat');
    expect(Decorated.someStatic2).toBe(42);
  });

  it('should not provide mutators when readonly', function () {
    var store = makeStore();
    var form = 'testForm';
    var Decorated = reduxForm({
      form: form,
      fields: ['foo', 'bar'],
      readonly: true
    })(Form);
    var dom = TestUtils.renderIntoDocument(React.createElement(
      Provider,
      { store: store },
      React.createElement(Decorated, null)
    ));
    var stub = TestUtils.findRenderedComponentWithType(dom, Form);

    expectField({
      field: stub.props.fields.foo,
      name: 'foo',
      value: '',
      initial: '',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false,
      readonly: true
    });

    expectField({
      field: stub.props.fields.bar,
      name: 'bar',
      value: '',
      initial: '',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false,
      readonly: true
    });
  });

  it('should initialize an array field', function () {
    var store = makeStore();
    var form = 'testForm';
    var Decorated = reduxForm({
      form: form,
      fields: ['children[].name'],
      initialValues: {
        children: [{ name: 'Tom' }, { name: 'Jerry' }]
      }
    })(Form);
    var dom = TestUtils.renderIntoDocument(React.createElement(
      Provider,
      { store: store },
      React.createElement(Decorated, null)
    ));
    var stub = TestUtils.findRenderedComponentWithType(dom, Form);

    expectField({
      field: stub.props.fields.children[0].name,
      name: 'children[0].name',
      value: 'Tom',
      initial: 'Tom',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });

    expectField({
      field: stub.props.fields.children[1].name,
      name: 'children[1].name',
      value: 'Jerry',
      initial: 'Jerry',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
  });

  it('should call onSubmit prop', function (done) {
    var submit = function submit(values) {
      expect(values).toEqual({
        foo: undefined,
        bar: undefined
      });
      done();
    };

    var FormComponent = function (_Component4) {
      _inherits(FormComponent, _Component4);

      function FormComponent() {
        _classCallCheck(this, FormComponent);

        return _possibleConstructorReturn(this, (FormComponent.__proto__ || Object.getPrototypeOf(FormComponent)).apply(this, arguments));
      }

      _createClass(FormComponent, [{
        key: 'render',
        value: function render() {
          return React.createElement('form', { onSubmit: this.props.handleSubmit });
        }
      }]);

      return FormComponent;
    }(Component);

    FormComponent.propTypes = {
      handleSubmit: PropTypes.func.isRequired
    };

    var store = makeStore();
    var form = 'testForm';
    var Decorated = reduxForm({
      form: form,
      fields: ['foo', 'bar'],
      readonly: true
    })(FormComponent);
    var dom = TestUtils.renderIntoDocument(React.createElement(
      Provider,
      { store: store },
      React.createElement(Decorated, { onSubmit: submit })
    ));
    var formElement = TestUtils.findRenderedDOMComponentWithTag(dom, 'form');

    TestUtils.Simulate.submit(formElement);
  });

  it('should call async onSubmit prop', function (done) {
    var submit = function submit(values) {
      expect(values).toEqual({
        foo: undefined,
        bar: undefined
      });
      return new Promise(function (resolve) {
        setTimeout(function () {
          resolve();
        }, 100);
      }).then(done);
    };

    var FormComponent = function (_Component5) {
      _inherits(FormComponent, _Component5);

      function FormComponent() {
        _classCallCheck(this, FormComponent);

        return _possibleConstructorReturn(this, (FormComponent.__proto__ || Object.getPrototypeOf(FormComponent)).apply(this, arguments));
      }

      _createClass(FormComponent, [{
        key: 'render',
        value: function render() {
          return React.createElement('form', { onSubmit: this.props.handleSubmit });
        }
      }]);

      return FormComponent;
    }(Component);

    FormComponent.propTypes = {
      handleSubmit: PropTypes.func.isRequired
    };

    var store = makeStore();
    var form = 'testForm';
    var Decorated = reduxForm({
      form: form,
      fields: ['foo', 'bar'],
      readonly: true
    })(FormComponent);
    var dom = TestUtils.renderIntoDocument(React.createElement(
      Provider,
      { store: store },
      React.createElement(Decorated, { onSubmit: submit })
    ));
    var formElement = TestUtils.findRenderedDOMComponentWithTag(dom, 'form');

    TestUtils.Simulate.submit(formElement);
  });

  it('should NOT call async validation if form is pristine and initialized', function () {
    var store = makeStore();
    var form = 'testForm';
    var errorValue = { foo: 'no bears allowed' };
    var asyncValidate = createSpy().andReturn(Promise.reject(errorValue));
    var Decorated = reduxForm({
      form: form,
      fields: ['foo', 'bar'],
      asyncValidate: asyncValidate,
      asyncBlurFields: ['foo'],
      initialValues: {
        foo: 'dog',
        bar: 'cat'
      }
    })(Form);
    var dom = TestUtils.renderIntoDocument(React.createElement(
      Provider,
      { store: store },
      React.createElement(Decorated, null)
    ));
    var stub = TestUtils.findRenderedComponentWithType(dom, Form);

    stub.props.fields.foo.onBlur('dog');
    expect(asyncValidate).toNotHaveBeenCalled();
  });

  it('should call async validation if form is dirty and initialized', function () {
    var store = makeStore();
    var form = 'testForm';
    var errorValue = { foo: 'no bears allowed' };
    var asyncValidate = createSpy().andReturn(Promise.reject(errorValue));
    var Decorated = reduxForm({
      form: form,
      fields: ['foo', 'bar'],
      asyncValidate: asyncValidate,
      asyncBlurFields: ['foo'],
      initialValues: {
        foo: 'dog',
        bar: 'cat'
      }
    })(Form);
    var dom = TestUtils.renderIntoDocument(React.createElement(
      Provider,
      { store: store },
      React.createElement(Decorated, null)
    ));
    var stub = TestUtils.findRenderedComponentWithType(dom, Form);

    stub.props.fields.foo.onBlur('bear');
    expect(asyncValidate).toHaveBeenCalled();
  });

  it('should call async validation if form is pristine and NOT initialized', function () {
    var store = makeStore();
    var form = 'testForm';
    var errorValue = { foo: 'no bears allowed' };
    var asyncValidate = createSpy().andReturn(Promise.reject(errorValue));
    var Decorated = reduxForm({
      form: form,
      fields: ['foo', 'bar'],
      asyncValidate: asyncValidate,
      asyncBlurFields: ['foo']
    })(Form);
    var dom = TestUtils.renderIntoDocument(React.createElement(
      Provider,
      { store: store },
      React.createElement(Decorated, null)
    ));
    var stub = TestUtils.findRenderedComponentWithType(dom, Form);

    stub.props.fields.foo.onBlur();
    expect(asyncValidate).toHaveBeenCalled();
  });

  it('should call async validation for matching array field', function () {
    var store = makeStore({
      testForm: {
        foo: [makeFieldValue({ value: 'dog' }), makeFieldValue({ value: 'cat' })]
      }
    });
    var form = 'testForm';
    var errorValue = { foo: 'no bears allowed' };
    var asyncValidate = createSpy().andReturn(Promise.reject(errorValue));
    var Decorated = reduxForm({
      form: form,
      fields: ['foo[].name'],
      asyncValidate: asyncValidate,
      asyncBlurFields: ['foo[].name']
    })(Form);
    var dom = TestUtils.renderIntoDocument(React.createElement(
      Provider,
      { store: store },
      React.createElement(Decorated, null)
    ));
    var stub = TestUtils.findRenderedComponentWithType(dom, Form);

    stub.props.fields.foo[0].name.onBlur();
    expect(asyncValidate).toHaveBeenCalled();
  });

  it('should call async validation on submit even if pristine and initialized', function () {
    var submit = createSpy();

    var FormComponent = function (_Component6) {
      _inherits(FormComponent, _Component6);

      function FormComponent() {
        _classCallCheck(this, FormComponent);

        return _possibleConstructorReturn(this, (FormComponent.__proto__ || Object.getPrototypeOf(FormComponent)).apply(this, arguments));
      }

      _createClass(FormComponent, [{
        key: 'render',
        value: function render() {
          return React.createElement('form', { onSubmit: this.props.handleSubmit(submit) });
        }
      }]);

      return FormComponent;
    }(Component);

    FormComponent.propTypes = {
      handleSubmit: PropTypes.func.isRequired
    };

    var store = makeStore();
    var form = 'testForm';
    var errorValue = { foo: 'no dogs allowed' };
    var asyncValidate = createSpy().andReturn(Promise.reject(errorValue));
    var Decorated = reduxForm({
      form: form,
      fields: ['foo', 'bar'],
      asyncValidate: asyncValidate,
      asyncBlurFields: ['foo'],
      initialValues: {
        foo: 'dog',
        bar: 'cat'
      }
    })(FormComponent);
    var dom = TestUtils.renderIntoDocument(React.createElement(
      Provider,
      { store: store },
      React.createElement(Decorated, null)
    ));
    var formElement = TestUtils.findRenderedDOMComponentWithTag(dom, 'form');

    TestUtils.Simulate.submit(formElement);

    expect(asyncValidate).toHaveBeenCalled();
    expect(submit).toNotHaveBeenCalled();
  });

  it('should call async validation if form is pristine and initialized but alwaysAsyncValidate is true', function () {
    var store = makeStore();
    var form = 'testForm';
    var errorValue = { foo: 'no bears allowed' };
    var asyncValidate = createSpy().andReturn(Promise.reject(errorValue));
    var Decorated = reduxForm({
      form: form,
      fields: ['foo', 'bar'],
      asyncValidate: asyncValidate,
      asyncBlurFields: ['foo'],
      alwaysAsyncValidate: true,
      initialValues: {
        foo: 'dog',
        bar: 'cat'
      }
    })(Form);
    var dom = TestUtils.renderIntoDocument(React.createElement(
      Provider,
      { store: store },
      React.createElement(Decorated, null)
    ));
    var stub = TestUtils.findRenderedComponentWithType(dom, Form);

    stub.props.fields.foo.onBlur('dog');
    expect(asyncValidate).toHaveBeenCalled();
  });

  it('should call submit function passed to handleSubmit', function (done) {
    var submit = function submit(values) {
      expect(values).toEqual({
        foo: undefined,
        bar: undefined
      });
      done();
    };

    var FormComponent = function (_Component7) {
      _inherits(FormComponent, _Component7);

      function FormComponent() {
        _classCallCheck(this, FormComponent);

        return _possibleConstructorReturn(this, (FormComponent.__proto__ || Object.getPrototypeOf(FormComponent)).apply(this, arguments));
      }

      _createClass(FormComponent, [{
        key: 'render',
        value: function render() {
          return React.createElement('form', { onSubmit: this.props.handleSubmit(submit) });
        }
      }]);

      return FormComponent;
    }(Component);

    FormComponent.propTypes = {
      handleSubmit: PropTypes.func.isRequired
    };

    var store = makeStore();
    var form = 'testForm';
    var Decorated = reduxForm({
      form: form,
      fields: ['foo', 'bar'],
      readonly: true
    })(FormComponent);
    var dom = TestUtils.renderIntoDocument(React.createElement(
      Provider,
      { store: store },
      React.createElement(Decorated, null)
    ));
    var formElement = TestUtils.findRenderedDOMComponentWithTag(dom, 'form');

    TestUtils.Simulate.submit(formElement);
  });

  it('should call submit function passed to async handleSubmit', function (done) {
    var submit = function submit(values) {
      expect(values).toEqual({
        foo: undefined,
        bar: undefined
      });
      return new Promise(function (resolve) {
        setTimeout(function () {
          resolve();
        }, 100);
      }).then(done);
    };

    var FormComponent = function (_Component8) {
      _inherits(FormComponent, _Component8);

      function FormComponent() {
        _classCallCheck(this, FormComponent);

        return _possibleConstructorReturn(this, (FormComponent.__proto__ || Object.getPrototypeOf(FormComponent)).apply(this, arguments));
      }

      _createClass(FormComponent, [{
        key: 'render',
        value: function render() {
          return React.createElement('form', { onSubmit: this.props.handleSubmit(submit) });
        }
      }]);

      return FormComponent;
    }(Component);

    FormComponent.propTypes = {
      handleSubmit: PropTypes.func.isRequired
    };

    var store = makeStore();
    var form = 'testForm';
    var Decorated = reduxForm({
      form: form,
      fields: ['foo', 'bar'],
      readonly: true
    })(FormComponent);
    var dom = TestUtils.renderIntoDocument(React.createElement(
      Provider,
      { store: store },
      React.createElement(Decorated, null)
    ));
    var formElement = TestUtils.findRenderedDOMComponentWithTag(dom, 'form');

    TestUtils.Simulate.submit(formElement);
  });

  it('should initialize a non-array field with an array value and let it read it back', function () {
    var store = makeStore();
    var form = 'testForm';
    var Decorated = reduxForm({
      form: form,
      fields: ['children'],
      initialValues: {
        children: [1, 2]
      }
    })(Form);
    var dom = TestUtils.renderIntoDocument(React.createElement(
      Provider,
      { store: store },
      React.createElement(Decorated, null)
    ));
    var stub = TestUtils.findRenderedComponentWithType(dom, Form);

    expectField({
      field: stub.props.fields.children,
      name: 'children',
      value: [1, 2],
      initial: [1, 2],
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
  });

  it('should initialize an array field with an array value', function () {
    var store = makeStore();
    var form = 'testForm';
    var Decorated = reduxForm({
      form: form,
      fields: ['colors[]'],
      initialValues: {
        colors: ['red', 'blue']
      }
    })(Form);
    var dom = TestUtils.renderIntoDocument(React.createElement(
      Provider,
      { store: store },
      React.createElement(Decorated, null)
    ));
    var stub = TestUtils.findRenderedComponentWithType(dom, Form);

    expect(stub.props.fields.colors).toBeA('array');
    expect(stub.props.fields.colors.length).toBe(2);
    expectField({
      field: stub.props.fields.colors[0],
      name: 'colors[0]',
      value: 'red',
      initial: 'red',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
    expectField({
      field: stub.props.fields.colors[1],
      name: 'colors[1]',
      value: 'blue',
      initial: 'blue',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
  });

  it('should initialize a deep array field with values', function () {
    var store = makeStore();
    var form = 'testForm';
    var Decorated = reduxForm({
      form: form,
      fields: ['users[].name', 'users[].age'],
      initialValues: {
        users: [{
          name: 'Bob',
          age: 27
        }]
      }
    })(Form);
    var dom = TestUtils.renderIntoDocument(React.createElement(
      Provider,
      { store: store },
      React.createElement(Decorated, null)
    ));
    var stub = TestUtils.findRenderedComponentWithType(dom, Form);

    expect(stub.props.fields.users).toBeA('array');
    expect(stub.props.fields.users.length).toBe(1);
    expect(stub.props.fields.users[0]).toBeA('object');
    expectField({
      field: stub.props.fields.users[0].name,
      name: 'users[0].name',
      value: 'Bob',
      initial: 'Bob',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
    expectField({
      field: stub.props.fields.users[0].age,
      name: 'users[0].age',
      value: 27,
      initial: 27,
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
  });

  it('should add array values with defaults', function () {
    var store = makeStore();
    var form = 'testForm';
    var Decorated = reduxForm({
      form: form,
      fields: ['users[].name', 'users[].age']
    })(Form);
    var dom = TestUtils.renderIntoDocument(React.createElement(
      Provider,
      { store: store },
      React.createElement(Decorated, null)
    ));
    var stub = TestUtils.findRenderedComponentWithType(dom, Form);

    expect(stub.props.fields.users).toBeA('array');
    expect(stub.props.fields.users.length).toBe(0);
    expect(stub.props.fields.users.addField).toBeA('function');

    var before = stub.props.fields.users;

    // add field
    stub.props.fields.users.addField({ name: 'Bob', age: 27 });

    // check field
    expect(stub.props.fields.users.length).toBe(1);
    expect(stub.props.fields.users[0]).toBeA('object');
    expectField({
      field: stub.props.fields.users[0].name,
      name: 'users[0].name',
      value: 'Bob',
      initial: 'Bob',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
    expectField({
      field: stub.props.fields.users[0].age,
      name: 'users[0].age',
      value: 27,
      initial: 27,
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
    var after = stub.props.fields.users;
    expect(after).toNotBe(before); // should be a new instance

    // check state
    expect(store.getState().form.testForm.users).toBeA('array');
    expect(store.getState().form.testForm.users.length).toBe(1);
    expect(store.getState().form.testForm.users[0].name).toEqual({
      initial: 'Bob',
      value: 'Bob',
      _isFieldValue: true
    });
    expect(store.getState().form.testForm.users[0].age).toEqual({
      initial: 27,
      value: 27,
      _isFieldValue: true
    });
  });

  // Test to demonstrate bug: https://github.com/erikras/redux-form/issues/630
  it('should add array values when root is not an array', function () {
    var store = makeStore();
    var form = 'testForm';
    var Decorated = reduxForm({
      form: form,
      fields: ['acknowledgements.items[].number', 'acknowledgements.items[].name', 'acknowledgements.show']
    })(Form);
    var dom = TestUtils.renderIntoDocument(React.createElement(
      Provider,
      { store: store },
      React.createElement(Decorated, null)
    ));
    var stub = TestUtils.findRenderedComponentWithType(dom, Form);

    expect(stub.props.fields.acknowledgements).toBeA('object');
    expect(stub.props.fields.acknowledgements.items).toBeA('array');
    expect(stub.props.fields.acknowledgements.items.length).toBe(0);
    expect(stub.props.fields.acknowledgements.items.addField).toBeA('function');

    // add field
    stub.props.fields.acknowledgements.items.addField({
      number: 1,
      name: 'foo'
    });

    // check field
    expect(stub.props.fields.acknowledgements.items.length).toBe(1);
    expect(stub.props.fields.acknowledgements.items[0]).toBeA('object');
    expectField({
      field: stub.props.fields.acknowledgements.items[0].number,
      name: 'acknowledgements.items[0].number',
      value: 1,
      initial: 1,
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
    expectField({
      field: stub.props.fields.acknowledgements.items[0].name,
      name: 'acknowledgements.items[0].name',
      value: 'foo',
      initial: 'foo',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
  });

  // Test to demonstrate bug: https://github.com/erikras/redux-form/issues/468
  it('should add array values with DEEP defaults', function () {
    var store = makeStore();
    var form = 'testForm';
    var Decorated = reduxForm({
      form: form,
      fields: ['proposals[].arrival', 'proposals[].departure', 'proposals[].note', 'proposals[].rooms[].name', 'proposals[].rooms[].adults', 'proposals[].rooms[].children', 'proposals[].meta.items[].name']
    })(Form);
    var dom = TestUtils.renderIntoDocument(React.createElement(
      Provider,
      { store: store },
      React.createElement(Decorated, null)
    ));
    var stub = TestUtils.findRenderedComponentWithType(dom, Form);

    expect(stub.props.fields.proposals).toBeA('array');
    expect(stub.props.fields.proposals.length).toBe(0);
    expect(stub.props.fields.proposals.addField).toBeA('function');

    // add field
    var today = new Date();
    stub.props.fields.proposals.addField({
      arrival: today,
      departure: today,
      note: '',
      rooms: [{
        name: 'Room 1',
        adults: 2,
        children: 0
      }],
      meta: {
        items: [{
          name: 'Bilbo'
        }]
      }
    });

    stub.props.fields.proposals[0].rooms.addField({
      name: 'Room 2',
      adults: 0,
      children: 2
    });

    stub.props.fields.proposals[0].meta.items.addField({
      name: 'Frodo'
    });

    // check field
    expect(stub.props.fields.proposals.length).toBe(1);
    expect(stub.props.fields.proposals[0]).toBeA('object');
    expectField({
      field: stub.props.fields.proposals[0].arrival,
      name: 'proposals[0].arrival',
      value: today,
      initial: today,
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
    expectField({
      field: stub.props.fields.proposals[0].departure,
      name: 'proposals[0].departure',
      value: today,
      initial: today,
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
    expectField({
      field: stub.props.fields.proposals[0].note,
      name: 'proposals[0].note',
      value: '',
      initial: '',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
    expectField({
      field: stub.props.fields.proposals[0].rooms[0].name,
      name: 'proposals[0].rooms[0].name',
      value: 'Room 1',
      initial: 'Room 1',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
    expectField({
      field: stub.props.fields.proposals[0].rooms[0].adults,
      name: 'proposals[0].rooms[0].adults',
      value: 2,
      initial: 2,
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
    expectField({
      field: stub.props.fields.proposals[0].rooms[0].children,
      name: 'proposals[0].rooms[0].children',
      value: 0,
      initial: 0,
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
    expectField({
      field: stub.props.fields.proposals[0].rooms[1].name,
      name: 'proposals[0].rooms[1].name',
      value: 'Room 2',
      initial: 'Room 2',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
    expectField({
      field: stub.props.fields.proposals[0].rooms[1].adults,
      name: 'proposals[0].rooms[1].adults',
      value: 0,
      initial: 0,
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
    expectField({
      field: stub.props.fields.proposals[0].rooms[1].children,
      name: 'proposals[0].rooms[1].children',
      value: 2,
      initial: 2,
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });

    expectField({
      field: stub.props.fields.proposals[0].meta.items[0].name,
      name: 'proposals[0].meta.items[0].name',
      value: 'Bilbo',
      initial: 'Bilbo',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });

    expectField({
      field: stub.props.fields.proposals[0].meta.items[1].name,
      name: 'proposals[0].meta.items[1].name',
      value: 'Frodo',
      initial: 'Frodo',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
  });

  // Test to demonstrate https://github.com/erikras/redux-form/issues/612
  //it('should work with a root-level array field', () => {
  //  const store = makeStore();
  //  const form = 'testForm';
  //  const Decorated = reduxForm({
  //    form,
  //    fields: ['tags[]']
  //  })(Form);
  //  const dom = TestUtils.renderIntoDocument(
  //    <Provider store={store}>
  //      <Decorated/>
  //    </Provider>
  //  );
  //  const stub = TestUtils.findRenderedComponentWithType(dom, Form);
  //
  //  expect(stub.props.fields.tags).toBeA('array');
  //  expect(stub.props.fields.tags.length).toBe(0);
  //  expect(stub.props.fields.tags.addField).toBeA('function');
  //
  //  // add field
  //  stub.props.fields.proposals.addField('foo');
  //
  //  // check field
  //  expect(stub.props.fields.tags.length).toBe(1);
  //  expect(stub.props.fields.tags[0]).toBeA('object');
  //  expectField({
  //    field: stub.props.fields.tags[0],
  //    name: 'tags[0]',
  //    value: 'foo',
  //    initial: 'foo',
  //    valid: true,
  //    dirty: false,
  //    error: undefined,
  //    touched: false,
  //    visited: false
  //  });
  //});

  it('should initialize an array field, blowing away existing value', function () {
    var store = makeStore();
    var form = 'testForm';
    var Decorated = reduxForm({
      form: form,
      fields: ['children']
    })(Form);
    var dom = TestUtils.renderIntoDocument(React.createElement(
      Provider,
      { store: store },
      React.createElement(Decorated, null)
    ));
    var stub = TestUtils.findRenderedComponentWithType(dom, Form);

    // set value
    stub.props.fields.children.onChange([1, 2]);
    // check value
    expectField({
      field: stub.props.fields.children,
      name: 'children',
      value: [1, 2],
      initial: '',
      valid: true,
      dirty: true,
      error: undefined,
      touched: false,
      visited: false
    });
    // initialize new values
    stub.props.initializeForm({ children: [3, 4] });
    // check value
    expectField({
      field: stub.props.fields.children,
      name: 'children',
      value: [3, 4],
      initial: [3, 4],
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
    // check state
    expect(store.getState().form.testForm.children).toEqual({
      initial: [3, 4],
      value: [3, 4],
      _isFieldValue: true
    });
    // reset form to newly initialized values
    stub.props.resetForm();
    // check value
    expectField({
      field: stub.props.fields.children,
      name: 'children',
      value: [3, 4],
      initial: [3, 4],
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
  });

  it('should only initialize on mount once', function () {
    var store = makeStore();
    var form = 'testForm';
    var Decorated = reduxForm({
      form: form,
      fields: ['name']
    })(Form);
    var dom = TestUtils.renderIntoDocument(React.createElement(
      Provider,
      { store: store },
      React.createElement(Decorated, { initialValues: { name: 'Bob' } })
    ));
    var stub = TestUtils.findRenderedComponentWithType(dom, Form);

    // check value
    expectField({
      field: stub.props.fields.name,
      name: 'name',
      value: 'Bob',
      initial: 'Bob',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
    // check state
    expect(store.getState().form.testForm.name).toEqual({
      initial: 'Bob',
      value: 'Bob',
      _isFieldValue: true
    });
    // set value
    stub.props.fields.name.onChange('Dan');
    // check value
    expectField({
      field: stub.props.fields.name,
      name: 'name',
      value: 'Dan',
      initial: 'Bob',
      valid: true,
      dirty: true,
      error: undefined,
      touched: false,
      visited: false
    });
    // check state
    expect(store.getState().form.testForm.name).toEqual({
      initial: 'Bob',
      value: 'Dan',
      _isFieldValue: true
    });

    // should NOT dispatch INITIALIZE this time
    var dom2 = TestUtils.renderIntoDocument(React.createElement(
      Provider,
      { store: store },
      React.createElement(Decorated, { initialValues: { name: 'Bob' } })
    ));
    var stub2 = TestUtils.findRenderedComponentWithType(dom2, Form);
    // check that value is unchanged
    expectField({
      field: stub2.props.fields.name,
      name: 'name',
      value: 'Dan',
      initial: 'Bob',
      valid: true,
      dirty: true,
      error: undefined,
      touched: false,
      visited: false
    });
    // check state
    expect(store.getState().form.testForm.name).toEqual({
      initial: 'Bob',
      value: 'Dan',
      _isFieldValue: true
    });

    // manually initialize new values
    stub2.props.initializeForm({ name: 'Tom' });
    // check value
    expectField({
      field: stub2.props.fields.name,
      name: 'name',
      value: 'Tom',
      initial: 'Tom',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
    // check state
    expect(store.getState().form.testForm.name).toEqual({
      initial: 'Tom',
      value: 'Tom',
      _isFieldValue: true
    });
  });

  it('should allow initialization from action', function () {
    var store = makeStore();
    var form = 'testForm';
    var Decorated = reduxForm({
      form: form,
      fields: ['name']
    })(Form);
    var dom = TestUtils.renderIntoDocument(React.createElement(
      Provider,
      { store: store },
      React.createElement(Decorated, null)
    ));
    var stub = TestUtils.findRenderedComponentWithType(dom, Form);

    // check value
    expectField({
      field: stub.props.fields.name,
      name: 'name',
      value: '',
      initial: '',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
    // manually initialize new values
    stub.props.initializeForm({ name: 'Tom' });
    // check state
    expect(store.getState().form.testForm.name).toEqual({
      initial: 'Tom',
      value: 'Tom',
      _isFieldValue: true
    });
    // check value
    expectField({
      field: stub.props.fields.name,
      name: 'name',
      value: 'Tom',
      initial: 'Tom',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
  });

  it('should allow deep sync validation error values', function () {
    var store = makeStore();
    var form = 'testForm';
    var deepError = {
      some: 'object with',
      deep: 'values'
    };
    var Decorated = reduxForm({
      form: form,
      fields: ['name'],
      validate: function validate() {
        return { name: deepError };
      }
    })(Form);
    var dom = TestUtils.renderIntoDocument(React.createElement(
      Provider,
      { store: store },
      React.createElement(Decorated, null)
    ));
    var stub = TestUtils.findRenderedComponentWithType(dom, Form);

    expectField({
      field: stub.props.fields.name,
      name: 'name',
      value: '',
      initial: '',
      valid: false,
      dirty: false,
      error: deepError,
      touched: false,
      visited: false
    });
  });

  it('should allow deep async validation error values', function () {
    var store = makeStore();
    var form = 'testForm';
    var deepError = {
      some: 'object with',
      deep: 'values'
    };
    var Decorated = reduxForm({
      form: form,
      fields: ['name'],
      initialValues: { name: 'Tom' },
      asyncValidate: function asyncValidate() {
        return Promise.reject({ name: deepError });
      }
    })(Form);
    var dom = TestUtils.renderIntoDocument(React.createElement(
      Provider,
      { store: store },
      React.createElement(Decorated, null)
    ));
    var stub = TestUtils.findRenderedComponentWithType(dom, Form);

    // check field before validation
    expectField({
      field: stub.props.fields.name,
      name: 'name',
      value: 'Tom',
      initial: 'Tom',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });

    // form must be dirty for asyncValidate()
    stub.props.fields.name.onChange('Moe');

    return stub.props.asyncValidate().then(function () {
      expect(true).toBe(false); // should not be in success block
    }, function () {
      // check state
      expect(store.getState().form.testForm.name).toEqual({
        initial: 'Tom',
        value: 'Moe',
        asyncError: deepError,
        _isFieldValue: true
      });
      // check field
      expectField({
        field: stub.props.fields.name,
        name: 'name',
        value: 'Moe',
        initial: 'Tom',
        valid: false,
        dirty: true,
        error: deepError,
        touched: false,
        visited: false
      });
    });
  });

  it('should allow deep submit validation error values', function () {
    var store = makeStore();
    var form = 'testForm';
    var deepError = {
      some: 'object with',
      deep: 'values'
    };
    var Decorated = reduxForm({
      form: form,
      fields: ['name'],
      initialValues: { name: 'Tom' },
      onSubmit: function onSubmit() {
        return Promise.reject({ name: deepError });
      }
    })(Form);
    var dom = TestUtils.renderIntoDocument(React.createElement(
      Provider,
      { store: store },
      React.createElement(Decorated, null)
    ));
    var stub = TestUtils.findRenderedComponentWithType(dom, Form);

    // check before validation
    expectField({
      field: stub.props.fields.name,
      name: 'name',
      value: 'Tom',
      initial: 'Tom',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
    return stub.props.handleSubmit().then(function () {
      // check state
      expect(store.getState().form.testForm.name).toEqual({
        initial: 'Tom',
        value: 'Tom',
        submitError: deepError,
        touched: true,
        _isFieldValue: true
      });
      // check field
      expectField({
        field: stub.props.fields.name,
        name: 'name',
        value: 'Tom',
        initial: 'Tom',
        valid: false,
        dirty: false,
        error: deepError,
        touched: true,
        visited: false
      });
    });
  });

  it('should only mutate the field that changed', function () {
    var store = makeStore();
    var form = 'testForm';
    var Decorated = reduxForm({
      form: form,
      fields: ['larry', 'moe', 'curly']
    })(Form);
    var dom = TestUtils.renderIntoDocument(React.createElement(
      Provider,
      { store: store },
      React.createElement(Decorated, null)
    ));
    var stub = TestUtils.findRenderedComponentWithType(dom, Form);

    var larry = stub.props.fields.larry;
    var moe = stub.props.fields.moe;
    var curly = stub.props.fields.curly;

    moe.onChange('BONK!');

    expect(stub.props.fields.larry).toBe(larry);
    expect(stub.props.fields.moe).toNotBe(moe);
    expect(stub.props.fields.curly).toBe(curly);
  });

  it('should only change the deep field that changed', function () {
    var store = makeStore();
    var form = 'testForm';
    var Decorated = reduxForm({
      form: form,
      fields: ['address.street', 'address.postalCode']
    })(Form);
    var dom = TestUtils.renderIntoDocument(React.createElement(
      Provider,
      { store: store },
      React.createElement(Decorated, null)
    ));
    var stub = TestUtils.findRenderedComponentWithType(dom, Form);

    var address = stub.props.fields.address;
    var street = stub.props.fields.address.street;
    var postalCode = stub.props.fields.address.postalCode;

    postalCode.onChange('90210');

    expect(stub.props.fields.address).toNotBe(address);
    expect(stub.props.fields.address.street).toBe(street);
    expect(stub.props.fields.address.postalCode).toNotBe(postalCode);
  });

  it('should change field tree up to array that changed', function () {
    var store = makeStore();
    var form = 'testForm';
    var Decorated = reduxForm({
      form: form,
      fields: ['contact.shipping.phones[]', 'contact.billing.phones[]']
    })(Form);
    var dom = TestUtils.renderIntoDocument(React.createElement(
      Provider,
      { store: store },
      React.createElement(Decorated, null)
    ));
    var stub = TestUtils.findRenderedComponentWithType(dom, Form);

    var contact = stub.props.fields.contact;
    var shipping = stub.props.fields.contact.shipping;
    var shippingPhones = stub.props.fields.contact.shipping.phones;
    var billing = stub.props.fields.contact.billing;
    var billingPhones = stub.props.fields.contact.billing.phones;

    shippingPhones.addField();

    expect(stub.props.fields.contact.shipping.phones).toNotBe(shippingPhones);
    expect(stub.props.fields.contact.shipping).toNotBe(shipping);
    expect(stub.props.fields.contact).toNotBe(contact);
    expect(stub.props.fields.contact.billing).toBe(billing);
    expect(stub.props.fields.contact.billing.phones).toBe(billingPhones);

    contact = stub.props.fields.contact;
    shipping = stub.props.fields.contact.shipping;
    shippingPhones = stub.props.fields.contact.shipping.phones;
    var shippingPhones0 = stub.props.fields.contact.shipping.phones[0];

    shippingPhones[0].onChange('555-1234');

    expect(stub.props.fields.contact.shipping.phones[0]).toNotBe(shippingPhones0);
    expect(stub.props.fields.contact.shipping.phones).toNotBe(shippingPhones);
    expect(stub.props.fields.contact.shipping).toNotBe(shipping);
    expect(stub.props.fields.contact).toNotBe(contact);
    expect(stub.props.fields.contact.billing).toBe(billing);
    expect(stub.props.fields.contact.billing.phones).toBe(billingPhones);
  });

  it('should not replace existing values when initialValues changes if overwriteOnInitialValuesChange is set to false', function () {
    var store = makeStore();
    var form = 'testForm';

    var Decorated = reduxForm({
      form: form,
      fields: ['firstName', 'lastName', 'instrument'],
      overwriteOnInitialValuesChange: false
    })(Form);

    var StatefulContainer = function (_Component9) {
      _inherits(StatefulContainer, _Component9);

      function StatefulContainer(props) {
        _classCallCheck(this, StatefulContainer);

        var _this9 = _possibleConstructorReturn(this, (StatefulContainer.__proto__ || Object.getPrototypeOf(StatefulContainer)).call(this, props));

        _this9.starrMe = _this9.starrMe.bind(_this9);
        _this9.state = {
          beatle: { firstName: 'John', lastName: 'Lennon' }
        };
        return _this9;
      }

      _createClass(StatefulContainer, [{
        key: 'starrMe',
        value: function starrMe() {
          this.setState({
            beatle: { firstName: 'Ringo', lastName: 'Starr' }
          });
        }
      }, {
        key: 'render',
        value: function render() {
          return React.createElement(
            'div',
            null,
            React.createElement(Decorated, { initialValues: this.state.beatle }),
            React.createElement(
              'button',
              { onClick: this.starrMe },
              'Ringo Me!'
            )
          );
        }
      }]);

      return StatefulContainer;
    }(Component);

    var dom = TestUtils.renderIntoDocument(React.createElement(
      Provider,
      { store: store },
      React.createElement(StatefulContainer, null)
    ));
    var stub = TestUtils.findRenderedComponentWithType(dom, Form);

    // initialized to John Lennon, pristine
    expect(stub.props.fields.firstName.value).toBe('John');
    expect(stub.props.fields.firstName.pristine).toBe(true);
    expect(stub.props.fields.lastName.value).toBe('Lennon');
    expect(stub.props.fields.lastName.pristine).toBe(true);

    // users changes to George Harrison
    stub.props.fields.firstName.onChange('George');
    stub.props.fields.lastName.onChange('Harrison');
    stub.props.fields.instrument.onChange('guitar');

    // values are now George Harrison (guitar)
    expect(stub.props.fields.firstName.value).toBe('George');
    expect(stub.props.fields.firstName.pristine).toBe(false);
    expect(stub.props.fields.lastName.value).toBe('Harrison');
    expect(stub.props.fields.lastName.pristine).toBe(false);
    expect(stub.props.fields.instrument.value).toBe('guitar');
    expect(stub.props.fields.instrument.pristine).toBe(false);

    // change initialValues to Ringo Starr
    var button = TestUtils.findRenderedDOMComponentWithTag(dom, 'button');
    TestUtils.Simulate.click(button);

    // values are STILL George Harrison
    expect(stub.props.fields.firstName.value).toBe('George');
    expect(stub.props.fields.firstName.pristine).toBe(false);
    expect(stub.props.fields.lastName.value).toBe('Harrison');
    expect(stub.props.fields.lastName.pristine).toBe(false);
    expect(stub.props.fields.instrument.value).toBe('guitar');
    expect(stub.props.fields.instrument.pristine).toBe(false);

    // but, if we reset form
    stub.props.resetForm();

    // values now go back to Ringo Starr, pristine
    expect(stub.props.fields.firstName.value).toBe('Ringo');
    expect(stub.props.fields.firstName.pristine).toBe(true);
    expect(stub.props.fields.lastName.value).toBe('Starr');
    expect(stub.props.fields.lastName.pristine).toBe(true);
    expect(stub.props.fields.instrument.value).toBe('');
    expect(stub.props.fields.instrument.pristine).toBe(true);
  });

  it('should replace existing values when initialValues changes', function () {
    var store = makeStore();
    var form = 'testForm';

    var Decorated = reduxForm({
      form: form,
      fields: ['firstName', 'lastName']
    })(Form);

    var StatefulContainer = function (_Component10) {
      _inherits(StatefulContainer, _Component10);

      function StatefulContainer(props) {
        _classCallCheck(this, StatefulContainer);

        var _this10 = _possibleConstructorReturn(this, (StatefulContainer.__proto__ || Object.getPrototypeOf(StatefulContainer)).call(this, props));

        _this10.starrMe = _this10.starrMe.bind(_this10);
        _this10.state = {
          beatle: { firstName: 'John', lastName: 'Lennon' }
        };
        return _this10;
      }

      _createClass(StatefulContainer, [{
        key: 'starrMe',
        value: function starrMe() {
          this.setState({
            beatle: { firstName: 'Ringo', lastName: 'Starr' }
          });
        }
      }, {
        key: 'render',
        value: function render() {
          return React.createElement(
            'div',
            null,
            React.createElement(Decorated, { initialValues: this.state.beatle }),
            React.createElement(
              'button',
              { onClick: this.starrMe },
              'Ringo Me!'
            )
          );
        }
      }]);

      return StatefulContainer;
    }(Component);

    var dom = TestUtils.renderIntoDocument(React.createElement(
      Provider,
      { store: store },
      React.createElement(StatefulContainer, null)
    ));
    var stub = TestUtils.findRenderedComponentWithType(dom, Form);

    // initialized to John Lennon, pristine
    expect(stub.props.fields.firstName.value).toBe('John');
    expect(stub.props.fields.firstName.pristine).toBe(true);
    expect(stub.props.fields.lastName.value).toBe('Lennon');
    expect(stub.props.fields.lastName.pristine).toBe(true);

    // users changes to George Harrison
    stub.props.fields.firstName.onChange('George');
    stub.props.fields.lastName.onChange('Harrison');

    // values are now George Harrison
    expect(stub.props.fields.firstName.value).toBe('George');
    expect(stub.props.fields.firstName.pristine).toBe(false);
    expect(stub.props.fields.lastName.value).toBe('Harrison');
    expect(stub.props.fields.lastName.pristine).toBe(false);

    // change initialValues to Ringo Starr
    var button = TestUtils.findRenderedDOMComponentWithTag(dom, 'button');
    TestUtils.Simulate.click(button);

    // values are now Ringo Starr, pristine
    expect(stub.props.fields.firstName.value).toBe('Ringo');
    expect(stub.props.fields.firstName.pristine).toBe(true);
    expect(stub.props.fields.lastName.value).toBe('Starr');
    expect(stub.props.fields.lastName.pristine).toBe(true);
  });

  it('should provide a submit() method to submit the form', function () {
    var store = makeStore();
    var form = 'testForm';
    var initialValues = { firstName: 'Bobby', lastName: 'Tables', age: 12 };
    var onSubmit = createSpy().andCall(function (values, dispatch, props) {
      expect(values).toEqual(initialValues);
      expect(dispatch).toEqual(store.dispatch);
      expect(props.testProp).toEqual(1337);
      return Promise.resolve();
    });
    var Decorated = reduxForm({
      form: form,
      fields: ['firstName', 'lastName', 'age'],
      initialValues: initialValues,
      onSubmit: onSubmit
    })(Form);

    var Container = function (_Component11) {
      _inherits(Container, _Component11);

      function Container(props) {
        _classCallCheck(this, Container);

        var _this11 = _possibleConstructorReturn(this, (Container.__proto__ || Object.getPrototypeOf(Container)).call(this, props));

        _this11.submitFromParent = _this11.submitFromParent.bind(_this11);
        return _this11;
      }

      _createClass(Container, [{
        key: 'submitFromParent',
        value: function submitFromParent() {
          this.refs.myForm.submit();
        }
      }, {
        key: 'render',
        value: function render() {
          return React.createElement(
            'div',
            null,
            React.createElement(Decorated, { ref: 'myForm', testProp: 1337 }),
            React.createElement(
              'button',
              { type: 'button', onClick: this.submitFromParent },
              'Submit From Parent'
            )
          );
        }
      }]);

      return Container;
    }(Component);

    var dom = TestUtils.renderIntoDocument(React.createElement(
      Provider,
      { store: store },
      React.createElement(Container, null)
    ));

    var button = TestUtils.findRenderedDOMComponentWithTag(dom, 'button');

    expect(onSubmit).toNotHaveBeenCalled();

    TestUtils.Simulate.click(button);

    expect(onSubmit).toHaveBeenCalled();
  });

  it('submitting from parent should fail if sync validation errors', function () {
    var store = makeStore();
    var form = 'testForm';
    var initialValues = { firstName: 'Bobby', lastName: 'Tables', age: 12 };
    var onSubmit = createSpy().andReturn(Promise.resolve());
    var onSubmitFail = createSpy();
    var validate = createSpy().andReturn({ firstName: 'Go to your room, Bobby.' });
    var Decorated = reduxForm({
      form: form,
      fields: ['firstName', 'lastName', 'age'],
      initialValues: initialValues,
      onSubmit: onSubmit,
      onSubmitFail: onSubmitFail,
      validate: validate
    })(Form);

    var Container = function (_Component12) {
      _inherits(Container, _Component12);

      function Container(props) {
        _classCallCheck(this, Container);

        var _this12 = _possibleConstructorReturn(this, (Container.__proto__ || Object.getPrototypeOf(Container)).call(this, props));

        _this12.submitFromParent = _this12.submitFromParent.bind(_this12);
        return _this12;
      }

      _createClass(Container, [{
        key: 'submitFromParent',
        value: function submitFromParent() {
          this.refs.myForm.submit();
        }
      }, {
        key: 'render',
        value: function render() {
          return React.createElement(
            'div',
            null,
            React.createElement(Decorated, { ref: 'myForm' }),
            React.createElement(
              'button',
              { type: 'button', onClick: this.submitFromParent },
              'Submit From Parent'
            )
          );
        }
      }]);

      return Container;
    }(Component);

    var dom = TestUtils.renderIntoDocument(React.createElement(
      Provider,
      { store: store },
      React.createElement(Container, null)
    ));

    var button = TestUtils.findRenderedDOMComponentWithTag(dom, 'button');

    expect(onSubmit).toNotHaveBeenCalled();
    expect(onSubmitFail).toNotHaveBeenCalled();

    TestUtils.Simulate.click(button);

    expect(validate).toHaveBeenCalled();
    expect(onSubmit).toNotHaveBeenCalled();
    expect(onSubmitFail).toHaveBeenCalled();
  });

  it('should only rerender the form that changed', function () {
    var store = makeStore();
    var fooRender = createRestorableSpy().andReturn(React.createElement('div', null));
    var barRender = createRestorableSpy().andReturn(React.createElement('div', null));

    var FooForm = function (_Component13) {
      _inherits(FooForm, _Component13);

      function FooForm() {
        _classCallCheck(this, FooForm);

        return _possibleConstructorReturn(this, (FooForm.__proto__ || Object.getPrototypeOf(FooForm)).apply(this, arguments));
      }

      _createClass(FooForm, [{
        key: 'render',
        value: function render() {
          return fooRender();
        }
      }]);

      return FooForm;
    }(Component);

    var BarForm = function (_Component14) {
      _inherits(BarForm, _Component14);

      function BarForm() {
        _classCallCheck(this, BarForm);

        return _possibleConstructorReturn(this, (BarForm.__proto__ || Object.getPrototypeOf(BarForm)).apply(this, arguments));
      }

      _createClass(BarForm, [{
        key: 'render',
        value: function render() {
          return barRender();
        }
      }]);

      return BarForm;
    }(Component);

    var DecoratedFooForm = reduxForm({
      form: 'foo',
      fields: ['name']
    })(FooForm);
    var DecoratedBarForm = reduxForm({
      form: 'bar',
      fields: ['name']
    })(BarForm);

    var dom = TestUtils.renderIntoDocument(React.createElement(
      Provider,
      { store: store },
      React.createElement(
        'div',
        null,
        React.createElement(DecoratedFooForm, null),
        React.createElement(DecoratedBarForm, null)
      )
    ));
    var fooStub = TestUtils.findRenderedComponentWithType(dom, FooForm);

    // first render
    expect(fooRender).toHaveBeenCalled();
    expect(barRender).toHaveBeenCalled();

    // restore spies
    fooRender.restore();
    barRender.restore();

    // change field on foo
    fooStub.props.fields.name.onChange('Tom');

    // second render: only foo form
    expect(fooRender).toHaveBeenCalled();
    expect(barRender).toNotHaveBeenCalled();
  });

  it('should only rerender the field components that change', function () {
    var store = makeStore();
    var fooRenders = 0;
    var barRenders = 0;

    var FooInput = function (_Component15) {
      _inherits(FooInput, _Component15);

      function FooInput() {
        _classCallCheck(this, FooInput);

        return _possibleConstructorReturn(this, (FooInput.__proto__ || Object.getPrototypeOf(FooInput)).apply(this, arguments));
      }

      _createClass(FooInput, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps) {
          return this.props.field !== nextProps.field;
        }
      }, {
        key: 'render',
        value: function render() {
          fooRenders++;
          var field = this.props.field;

          return React.createElement('input', _extends({ type: 'text' }, field));
        }
      }]);

      return FooInput;
    }(Component);

    FooInput.propTypes = {
      field: PropTypes.object.isRequired
    };

    var BarInput = function (_Component16) {
      _inherits(BarInput, _Component16);

      function BarInput() {
        _classCallCheck(this, BarInput);

        return _possibleConstructorReturn(this, (BarInput.__proto__ || Object.getPrototypeOf(BarInput)).apply(this, arguments));
      }

      _createClass(BarInput, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps) {
          return this.props.field !== nextProps.field;
        }
      }, {
        key: 'render',
        value: function render() {
          barRenders++;
          var field = this.props.field;

          return React.createElement('input', _extends({ type: 'password' }, field));
        }
      }]);

      return BarInput;
    }(Component);

    BarInput.propTypes = {
      field: PropTypes.object.isRequired
    };

    var FieldTestForm = function (_Component17) {
      _inherits(FieldTestForm, _Component17);

      function FieldTestForm() {
        _classCallCheck(this, FieldTestForm);

        return _possibleConstructorReturn(this, (FieldTestForm.__proto__ || Object.getPrototypeOf(FieldTestForm)).apply(this, arguments));
      }

      _createClass(FieldTestForm, [{
        key: 'render',
        value: function render() {
          var _props$fields = this.props.fields,
              foo = _props$fields.foo,
              bar = _props$fields.bar;

          return React.createElement(
            'div',
            null,
            React.createElement(FooInput, { field: foo }),
            React.createElement(BarInput, { field: bar })
          );
        }
      }]);

      return FieldTestForm;
    }(Component);

    FieldTestForm.propTypes = {
      fields: PropTypes.object.isRequired
    };

    var DecoratedForm = reduxForm({
      form: 'fieldTest',
      fields: ['foo', 'bar']
    })(FieldTestForm);

    var dom = TestUtils.renderIntoDocument(React.createElement(
      Provider,
      { store: store },
      React.createElement(DecoratedForm, null)
    ));
    var stub = TestUtils.findRenderedComponentWithType(dom, FieldTestForm);

    // first render
    expect(fooRenders).toBe(1);
    expect(barRenders).toBe(1);

    // change field foo
    stub.props.fields.foo.onChange('Tom');

    // second render, only foo should rerender
    expect(fooRenders).toBe(2);
    expect(barRenders).toBe(1);

    // change field bar
    stub.props.fields.bar.onChange('Jerry');

    // third render, only bar should rerender
    expect(fooRenders).toBe(2);
    expect(barRenders).toBe(2);
  });

  // Test to show bug https://github.com/erikras/redux-form/issues/550
  // ---
  // It's caused by the fact that we're no longer using the same field instance
  // throughout the lifetime of the component. Since the fields are immutable now,
  // the field.value given to createOnDragStart() no longer refers to the current
  // value.
  // ---
  //it('should drag the current value', () => {
  //  const store = makeStore();
  //  const form = 'testForm';
  //  const Decorated = reduxForm({
  //    form,
  //    fields: ['name']
  //  })(Form);
  //  const dom = TestUtils.renderIntoDocument(
  //    <Provider store={store}>
  //      <Decorated/>
  //    </Provider>
  //  );
  //  const stub = TestUtils.findRenderedComponentWithType(dom, Form);
  //
  //  stub.props.fields.name.onChange('FOO');
  //  const setData = createSpy();
  //  stub.props.fields.name.onDragStart({dataTransfer: {setData}});
  //
  //  expect(setData)
  //    .toHaveBeenCalled()
  //    .toHaveBeenCalledWith('value', 'FOO');
  //});

  // Test to show bug https://github.com/erikras/redux-form/issues/629
  // ---
  // It's caused by the fact that RESET is just copying values from initial to value,
  // but what it needs to do is blow away the whole state tree and re-initialize it
  // with the initial values.
  // ---
  //it('resetting the form should reset array fields', () => {
  //  const store = makeStore();
  //  const form = 'testForm';
  //  const Decorated = reduxForm({
  //    form,
  //    fields: ['kennel', 'dogs[].name', 'dogs[].breed']
  //  })(Form);
  //  const dom = TestUtils.renderIntoDocument(
  //    <Provider store={store}>
  //      <Decorated initialValues={{
  //        kennel: 'Bob\'s Dog House',
  //        dogs: [
  //          {name: 'Fido', breed: 'Pit Bull'},
  //          {name: 'Snoopy', breed: 'Beagle'},
  //          {name: 'Scooby Doo', breed: 'Great Dane'}
  //        ]
  //      }}/>
  //    </Provider>
  //  );
  //  const stub = TestUtils.findRenderedComponentWithType(dom, Form);
  //
  //  expect(stub.props.fields.dogs.length).toBe(3);
  //
  //  stub.props.fields.dogs.addField({name: 'Lassie', breed: 'Collie'});
  //
  //  expect(stub.props.fields.dogs.length).toBe(4);
  //
  //  stub.props.resetForm();
  //
  //  expect(stub.props.fields.dogs.length).toBe(3);
  //});

  // Test to show bug https://github.com/erikras/redux-form/issues/621
  // ---
  // It's caused by the fact that we are letting the initialValues prop override
  // the data from the store for the initialValue and defaultValue props, but NOT for
  // value. So the value prop does not get populated until the second render.
  // ---
  it('initial values should be present on first render', function () {
    var store = makeStore();
    var form = 'testForm';

    var InitialValuesTestForm = function (_Component18) {
      _inherits(InitialValuesTestForm, _Component18);

      function InitialValuesTestForm() {
        _classCallCheck(this, InitialValuesTestForm);

        return _possibleConstructorReturn(this, (InitialValuesTestForm.__proto__ || Object.getPrototypeOf(InitialValuesTestForm)).apply(this, arguments));
      }

      _createClass(InitialValuesTestForm, [{
        key: 'render',
        value: function render() {
          var mingzi = this.props.fields.mingzi;

          expect(mingzi.initialValue).toBe('Bob');
          expect(mingzi.value).toBe('Bob');
          return React.createElement(
            'div',
            null,
            React.createElement('input', mingzi)
          );
        }
      }]);

      return InitialValuesTestForm;
    }(Component);

    InitialValuesTestForm.propTypes = {
      fields: PropTypes.object.isRequired
    };
    var Decorated = reduxForm({
      form: form,
      fields: ['mingzi']
    })(InitialValuesTestForm);
    TestUtils.renderIntoDocument(React.createElement(
      Provider,
      { store: store },
      React.createElement(Decorated, { initialValues: { mingzi: 'Bob' } })
    ));
  });

  it('should throw when trying to access the wrapped instance if withRef is not specified', function () {
    var store = makeStore();

    var Container = function (_Component19) {
      _inherits(Container, _Component19);

      function Container() {
        _classCallCheck(this, Container);

        return _possibleConstructorReturn(this, (Container.__proto__ || Object.getPrototypeOf(Container)).apply(this, arguments));
      }

      _createClass(Container, [{
        key: 'render',
        value: function render() {
          return React.createElement(Passthrough, null);
        }
      }]);

      return Container;
    }(Component);

    var DecoratedForm = reduxForm({
      form: 'withoutRefTest',
      fields: ['foo', 'bar']
    })(Container);

    var dom = TestUtils.renderIntoDocument(React.createElement(
      Provider,
      { store: store },
      React.createElement(DecoratedForm, null)
    ));

    var decorated = TestUtils.findRenderedComponentWithType(dom, DecoratedForm);
    expect(function () {
      return decorated.getWrappedInstance();
    }).toThrow(/To access the wrapped instance, you need to specify \{ withRef: true \} as the fourth argument of the connect\(\) call\./);
  });

  it('should return the instance of the wrapped component for use in calling child methods', function () {

    var store = makeStore();

    var someData = {
      some: 'data'
    };

    var Container = function (_Component20) {
      _inherits(Container, _Component20);

      function Container() {
        _classCallCheck(this, Container);

        return _possibleConstructorReturn(this, (Container.__proto__ || Object.getPrototypeOf(Container)).apply(this, arguments));
      }

      _createClass(Container, [{
        key: 'someInstanceMethod',
        value: function someInstanceMethod() {
          return someData;
        }
      }, {
        key: 'render',
        value: function render() {
          return React.createElement(Passthrough, null);
        }
      }]);

      return Container;
    }(Component);

    var DecoratedForm = reduxForm({
      form: 'withRefTest',
      fields: ['foo', 'bar']
    }, null, null, null, { withRef: true })(Container);

    var dom = TestUtils.renderIntoDocument(React.createElement(
      Provider,
      { store: store },
      React.createElement(DecoratedForm, null)
    ));

    var decorated = TestUtils.findRenderedComponentWithType(dom, DecoratedForm);

    expect(function () {
      return decorated.someInstanceMethod();
    }).toThrow();
    expect(decorated.getWrappedInstance().someInstanceMethod()).toBe(someData);
    expect(decorated.refs.wrappedInstance.refs.wrappedInstance.getWrappedInstance().refs.wrappedInstance.someInstanceMethod()).toBe(someData);
  });

  it('should change nested fields', function () {
    var lastPrevBarValue = void 0; // eslint-disable-line
    var lastNextBarValue = void 0; // eslint-disable-line

    var FormComponent = function (_Component21) {
      _inherits(FormComponent, _Component21);

      function FormComponent() {
        _classCallCheck(this, FormComponent);

        return _possibleConstructorReturn(this, (FormComponent.__proto__ || Object.getPrototypeOf(FormComponent)).apply(this, arguments));
      }

      _createClass(FormComponent, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
          /*
           console.info(
           this.props.fields.foo.bar.value,
           nextProps.fields.foo.bar.value,
           this.props.fields.foo === nextProps.fields.foo,
           this.props.fields.foo.bar === nextProps.fields.foo.bar,
           this.props.fields.foo.bar.value === nextProps.fields.foo.bar.value);
            Prints out:
            previous previous false true true
           next next false true true
           */
          lastPrevBarValue = this.props.fields.foo.bar.value;
          lastNextBarValue = nextProps.fields.foo.bar.value;
        }
      }, {
        key: 'render',
        value: function render() {
          return React.createElement('div', null);
        }
      }]);

      return FormComponent;
    }(Component);

    FormComponent.propTypes = {
      fields: PropTypes.object.isRequired
    };

    var store = makeStore();
    var Decorated = reduxForm({
      form: 'testForm',
      fields: ['foo.bar']
    })(FormComponent);
    var dom = TestUtils.renderIntoDocument(React.createElement(
      Provider,
      { store: store },
      React.createElement(Decorated, { initialValues: {
          foo: {
            bar: 'previous'
          }
        } })
    ));

    var stub = TestUtils.findRenderedComponentWithType(dom, FormComponent);

    var previousFields = stub.props.fields;
    var previousFoo = previousFields.foo;
    var previousFooBar = previousFields.foo.bar;
    var previousFooBarValue = previousFields.foo.bar.value;

    expect(previousFooBarValue).toBe('previous');

    stub.props.fields.foo.bar.onChange('next');

    var nextFields = stub.props.fields;
    var nextFoo = nextFields.foo;
    var nextFooBar = nextFields.foo.bar;
    var nextFooBarValue = nextFields.foo.bar.value;

    expect(nextFooBarValue).toBe('next').toNotBe(previousFooBarValue);
    expect(nextFooBar).toNotBe(previousFooBar);
    expect(nextFoo).toNotBe(previousFoo);

    // FAILS
    //expect(lastPrevBarValue).toNotEqual(lastNextBarValue);
  });

  // Test to show bug https://github.com/erikras/redux-form/issues/1241
  it('pass correct initial values to validate when initialValues not given', function () {
    var store = makeStore();
    var form = 'testForm';
    var validate = function validate(values) {
      expect(values.name).toBe(undefined);
      expect(values.company.name).toBe('Foo');
    };

    var ValidateTestForm = function (_Component22) {
      _inherits(ValidateTestForm, _Component22);

      function ValidateTestForm() {
        _classCallCheck(this, ValidateTestForm);

        return _possibleConstructorReturn(this, (ValidateTestForm.__proto__ || Object.getPrototypeOf(ValidateTestForm)).apply(this, arguments));
      }

      _createClass(ValidateTestForm, [{
        key: 'render',
        value: function render() {
          var name = this.props.fields.name;

          return React.createElement(
            'div',
            null,
            React.createElement('input', name)
          );
        }
      }]);

      return ValidateTestForm;
    }(Component);

    ValidateTestForm.propTypes = {
      fields: PropTypes.object.isRequired
    };

    var Decorated = reduxForm({
      form: form,
      fields: ['name', 'company.name'],
      validate: validate
    })(ValidateTestForm);

    var initialValues = {
      company: { name: 'Foo' }
    };

    TestUtils.renderIntoDocument(React.createElement(
      Provider,
      { store: store },
      React.createElement(Decorated, { initialValues: initialValues })
    ));
  });
});