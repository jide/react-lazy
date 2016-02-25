import React, { Component, PropTypes } from 'react/lib/ReactIsomorphic';
import ReactDOM from 'react-dom';
import ReactLazy from '../src/ReactLazyElement';

class Bold extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.label !== this.props.label;
  }

  render() {
    return ReactLazy.createElement(false, 'b', null, () => ({ }), this.props.label);
  }
}

class Button extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.label !== this.props.label;
  }

  render() {
    return ReactLazy.createElement(false, 'div', null, () => ({ onClick: this.props.onClick, style: { padding: 10, display: 'inline-block', border: '1px solid black' } }),
      [
        this.props.label,
        ReactLazy.createElement(false, Bold, null, () => ({ label: this.props.label }), null)
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
      if (i < 1000) {
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
    return children.map(i => ReactLazy.createElement(null, 'div', null, null, i * 10));
  }

  render() {
    var children = [];

    for (var i = 0; i < this.state.counter; i++) {
      children.push(i);
    }

    return ReactLazy.createElement(false, 'div', 'test', null,
      ReactLazy.createElement(false, 'div', 'test2', null,
        ReactLazy.createElement(false, 'div', null, null, [
          ReactLazy.createElement('state.counter', 'div', null, () => ({ onClick: this.handleClick.bind(this), style: { color: 'white', background: 'blue', width: this.state.counter * 30 } }), this.state.counter),
          ReactLazy.createElement('state.counter', 'div', null, () => ({ onClick: this.handleClick.bind(this), style: { color: 'white', background: 'blue', width: this.state.counter * 30 } }), this.state.counter),
          ReactLazy.createElement('state.counter', 'div', null, () => ({ onClick: this.handleClick.bind(this), style: { color: 'white', background: 'blue', width: this.state.counter * 30 } }), this.state.counter),
          ReactLazy.createElement('state.counter', 'div', null, () => ({ onClick: this.handleClick.bind(this), style: { color: 'white', background: 'blue', width: this.state.counter * 30 } }), this.state.counter),
          ReactLazy.createElement('state.crosses', Button, null, () => ({ onClick: this.handleClick2.bind(this), label: this.state.crosses }), null),
          ReactLazy.createElement('state.crosses', Button, null, () => ({ onClick: this.handleClick2.bind(this), label: this.state.crosses }), null),
          ReactLazy.createElement('state.crosses', Button, null, () => ({ onClick: this.handleClick2.bind(this), label: this.state.crosses }), null),
          ReactLazy.createElement('state.crosses', Button, null, () => ({ onClick: this.handleClick2.bind(this), label: this.state.crosses }), null),
          ReactLazy.createElement('state.crosses', Button, null, () => ({ onClick: this.handleClick2.bind(this), label: this.state.crosses }), null),
          ReactLazy.createElement('state.counter', 'div', null, () => ({ onClick: this.handleClick.bind(this), style: { color: 'white', background: 'blue', width: this.state.counter * 30 } }), this.state.counter),
          ReactLazy.createElement('state.counter', 'div', null, () => ({ onClick: this.handleClick.bind(this), style: { color: 'white', background: 'blue', width: this.state.counter * 30 } }), this.state.counter),
          ReactLazy.createElement('state.counter', 'div', null, () => ({ onClick: this.handleClick.bind(this), style: { color: 'white', background: 'blue', width: this.state.counter * 30 } }), this.state.counter),
          ReactLazy.createElement('state.counter', 'div', null, () => ({ onClick: this.handleClick.bind(this), style: { color: 'white', background: 'blue', width: this.state.counter * 30 } }), this.state.counter),
          ReactLazy.createElement('state.crosses', Button, null, () => ({ onClick: this.handleClick2.bind(this), label: this.state.crosses }), null),
          ReactLazy.createElement('state.crosses', Button, null, () => ({ onClick: this.handleClick2.bind(this), label: this.state.crosses }), null),
          ReactLazy.createElement('state.crosses', Button, null, () => ({ onClick: this.handleClick2.bind(this), label: this.state.crosses }), null),
          ReactLazy.createElement('state.crosses', Button, null, () => ({ onClick: this.handleClick2.bind(this), label: this.state.crosses }), null),
          ReactLazy.createElement('state.crosses', Button, null, () => ({ onClick: this.handleClick2.bind(this), label: this.state.crosses }), null)
        ])
      )
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('root'));
