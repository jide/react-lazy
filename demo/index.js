import React, { Component, PropTypes } from 'react/lib/ReactIsomorphic';
import ReactDOM from 'react-dom';
import ReactElement from 'ReactElement';
import ReactLazyElement from '../src/ReactLazyElement';
var assign = require('Object.assign');

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var lazy = getParameterByName('lazy');

if (lazy) {
  console.log('lazy');
}
else {
  console.log('normal');
}

function proxyCreateElement(updatePaths, type, key, props, children) {
  if (lazy) {
    return ReactLazyElement.createElement(updatePaths, type, key, props, children);
  }
  else {
    var props = typeof props === 'function' ? props() : props;
    return ReactElement.createElement(type, key ? assign({ key: key }, props) : props, children);
  }
}

class Bold extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.label !== this.props.label;
  }

  render() {
    return proxyCreateElement(false, 'b', null, () => ({ }), this.props.label);
  }
}

class Button extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.label !== this.props.label;
  }

  render() {
    return proxyCreateElement(false, 'div', null, () => ({ onClick: this.props.onClick, style: { padding: 10, display: 'inline-block', border: '1px solid black' } }),
      [
        this.props.label,
        proxyCreateElement(false, Bold, null, () => ({ label: this.props.label }), null)
      ]
    );
  }
}

class App extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      counter: 1,
      crosses: '+'
    };

    var i = 0;

    var it = setInterval(() => {
      i++;
      if (i < 500) {
        this.handleClick();
        setTimeout(() =>  this.handleClick2(), 15);
      }
      else {
        clearInterval(it);
        console.log(this.total + "ms")
      }
    }, 20);
  }

  componentWillUpdate() {
    this.t0 = performance.now();
  }

  componentDidUpdate() {
    this.t1 = performance.now();
    this.total = (this.total || 0) + (this.t1 - this.t0);
  }

  handleClick() {
    this.setState({ counter: this.state.counter + 1 })
  }

  handleClick2() {
    this.setState({ crosses: this.state.crosses + '+' })
  }

  renderChildren(children) {
    return children.map(i => proxyCreateElement(null, 'div', null, null, i * 10));
  }

  render() {
    var children = [];

    for (var i = 0; i < this.state.counter; i++) {
      children.push(i);
    }

    return proxyCreateElement(false, 'div', 'test', null,
      proxyCreateElement(false, 'div', 'test2', null,
        proxyCreateElement(false, 'div', null, null, [
          proxyCreateElement(false, 'a', null, { href: '/' }, 'normal'),
          ' ',
          proxyCreateElement(false, 'a', null, { href: '?lazy=1' }, 'lazy'),
          proxyCreateElement('state.counter', 'div', null, () => ({ onClick: this.handleClick.bind(this), style: { color: 'white', background: 'blue', width: this.state.counter * 30 } }), this.state.counter),
          proxyCreateElement('state.counter', 'div', null, () => ({ onClick: this.handleClick.bind(this), style: { color: 'white', background: 'blue', width: this.state.counter * 30 } }), this.state.counter),
          proxyCreateElement('state.counter', 'div', null, () => ({ onClick: this.handleClick.bind(this), style: { color: 'white', background: 'blue', width: this.state.counter * 30 } }), this.state.counter),
          proxyCreateElement('state.counter', 'div', null, () => ({ onClick: this.handleClick.bind(this), style: { color: 'white', background: 'blue', width: this.state.counter * 30 } }), this.state.counter),
          proxyCreateElement('state.crosses', Button, null, () => ({ onClick: this.handleClick2.bind(this), label: this.state.crosses }), null),
          proxyCreateElement('state.crosses', Button, null, () => ({ onClick: this.handleClick2.bind(this), label: this.state.crosses }), null),
          proxyCreateElement('state.crosses', Button, null, () => ({ onClick: this.handleClick2.bind(this), label: this.state.crosses }), null),
          proxyCreateElement('state.crosses', Button, null, () => ({ onClick: this.handleClick2.bind(this), label: this.state.crosses }), null),
          proxyCreateElement('state.crosses', Button, null, () => ({ onClick: this.handleClick2.bind(this), label: this.state.crosses }), null),
          proxyCreateElement('state.counter', 'div', null, () => ({ onClick: this.handleClick.bind(this), style: { color: 'white', background: 'blue', width: this.state.counter * 30 } }), this.state.counter),
          proxyCreateElement('state.counter', 'div', null, () => ({ onClick: this.handleClick.bind(this), style: { color: 'white', background: 'blue', width: this.state.counter * 30 } }), this.state.counter),
          proxyCreateElement('state.counter', 'div', null, () => ({ onClick: this.handleClick.bind(this), style: { color: 'white', background: 'blue', width: this.state.counter * 30 } }), this.state.counter),
          proxyCreateElement('state.counter', 'div', null, () => ({ onClick: this.handleClick.bind(this), style: { color: 'white', background: 'blue', width: this.state.counter * 30 } }), this.state.counter),
          proxyCreateElement('state.crosses', Button, null, () => ({ onClick: this.handleClick2.bind(this), label: this.state.crosses }), null),
          proxyCreateElement('state.crosses', Button, null, () => ({ onClick: this.handleClick2.bind(this), label: this.state.crosses }), null),
          proxyCreateElement('state.crosses', Button, null, () => ({ onClick: this.handleClick2.bind(this), label: this.state.crosses }), null),
          proxyCreateElement('state.crosses', Button, null, () => ({ onClick: this.handleClick2.bind(this), label: this.state.crosses }), null),
          proxyCreateElement('state.crosses', Button, null, () => ({ onClick: this.handleClick2.bind(this), label: this.state.crosses }), null)
        ])
      )
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('root'));
