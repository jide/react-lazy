'use strict';

var ReactComponentEnvironment = require('ReactComponentEnvironment');
var ReactCurrentOwner = require('ReactCurrentOwner');
var ReactElement = require('ReactElement');
var ReactInstanceMap = require('ReactInstanceMap');
var ReactNodeTypes = require('ReactNodeTypes');
var ReactPerf = require('ReactPerf');
var ReactPropTypeLocations = require('ReactPropTypeLocations');
var ReactPropTypeLocationNames = require('ReactPropTypeLocationNames');
var ReactReconciler = require('ReactReconciler');
var ReactUpdateQueue = require('ReactUpdateQueue');

var assign = require('Object.assign');
var emptyObject = require('fbjs/lib/emptyObject');
var invariant = require('fbjs/lib/invariant');
var shouldUpdateReactComponent = require('shouldUpdateReactComponent');
var warning = require('fbjs/lib/warning');

var ReactCompositeComponent = require('react/lib/ReactCompositeComponent');
var getPathsByObjectsDiff = require('./getPathsByObjectsDiff');

var mixin = {
  construct: function() {
    ReactCompositeComponent.Mixin.construct.bind(this)(...arguments);

    this._updatePaths = [];
    this._pendingLazyUpdate = false;
  },

  // Register an update path (or an array of paths) for this component.
  _registerUpdatePaths(paths) {
    if (Array.isArray(paths)) {
      for (var i in paths) {
        if (this._updatePaths.indexOf(paths[i]) === -1) {
          this._updatePaths = this._updatePaths.concat(paths);
        }
      }
    }
    else if (typeof paths === 'string' && this._updatePaths.indexOf(paths) === -1) {
      this._updatePaths.push(paths);
    }
  },

  // Returns a subset of update paths affected by current update.
  _processUpdatePaths(context, props, state) {
    var inst = this._instance;
    var keys = ['context', 'props', 'state'];
    var prev = {};
    var next = {};

    for (var i = 2; i >= 0; i--) {
      if (arguments[i] !== null) {
        prev[keys[i]] = inst[keys[i]];
        next[keys[i]] = arguments[i];
      }
    }

    return getPathsByObjectsDiff(prev, next, this._updatePaths);
  },

  updateComponent: function (transaction, prevParentElement, nextParentElement, prevUnmaskedContext, nextUnmaskedContext) {
    var inst = this._instance;
    var willReceive = false;
    var nextContext;
    var nextProps;

    // If we are in a lazy element, bail out early.
    if (nextParentElement.props.__lazy && nextParentElement.children === prevParentElement.children) {
      return;
    }

    // Determine if the context has changed or not
    if (this._context === nextUnmaskedContext) {
      nextContext = inst.context;
    } else {
      nextContext = this._processContext(nextUnmaskedContext);
      willReceive = true;
    }

    // Distinguish between a props update versus a simple state update
    if (prevParentElement === nextParentElement) {
      // Skip checking prop types again -- we don't read inst.props to avoid
      // warning for DOM component props in this upgrade
      nextProps = nextParentElement.props;
    } else {
      nextProps = this._processProps(nextParentElement.props);
      willReceive = true;
    }

    // An update here will schedule an update but immediately set
    // _pendingStateQueue which will ensure that any state updates gets
    // immediately reconciled instead of waiting for the next batch.
    if (willReceive && inst.componentWillReceiveProps) {
      inst.componentWillReceiveProps(nextProps, nextContext);
    }

    var hasPendingState = this._pendingStateQueue !== null;

    var nextState = this._processPendingState(nextProps, nextContext);

    var shouldUpdate = this._pendingForceUpdate || !inst.shouldComponentUpdate || inst.shouldComponentUpdate(nextProps, nextState, nextContext);

    if (process.env.NODE_ENV !== 'production') {
      process.env.NODE_ENV !== 'production' ? warning(typeof shouldUpdate !== 'undefined', '%s.shouldComponentUpdate(): Returned undefined instead of a ' + 'boolean value. Make sure to return true or false.', this.getName() || 'ReactCompositeComponent') : undefined;
    }

    if (shouldUpdate) {
      // Compute updated paths for lazy update.
      if (!nextParentElement.props.__lazy) {
        this._pendingLazyUpdate = this._processUpdatePaths(
          this._context !== nextUnmaskedContext ? nextContext : null,
          prevParentElement !== nextParentElement ? nextProps : null,
          hasPendingState ? nextState : null
        );
      }

      this._pendingForceUpdate = false;
      // Will set `this.props`, `this.state` and `this.context`.
      this._performComponentUpdate(nextParentElement, nextProps, nextState, nextContext, transaction, nextUnmaskedContext);
    } else {
      // If it's determined that a component should not update, we still want
      // to set props and state but we shortcut the rest of the update.
      this._currentElement = nextParentElement;
      this._context = nextUnmaskedContext;
      inst.props = nextProps;
      inst.state = nextState;
      inst.context = nextContext;
    }
  }
};

var ReactLazyCompositeComponentMixin = assign({}, ReactCompositeComponent.Mixin, mixin);

ReactPerf.measureMethods(ReactLazyCompositeComponentMixin, 'ReactCompositeComponent', {
  mountComponent: 'mountComponent',
  updateComponent: 'updateComponent',
  _renderValidatedComponent: '_renderValidatedComponent'
});

var ReactLazyCompositeComponent = {

  Mixin: ReactLazyCompositeComponentMixin

};

module.exports = ReactLazyCompositeComponent;
