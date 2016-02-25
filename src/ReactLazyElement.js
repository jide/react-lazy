var ReactElement = require('ReactElement');
var assign = require('Object.assign');
var ReactCurrentOwner = require('ReactCurrentOwner');
var createElement = ReactElement.createElement;

function pathsMatch(path1, path2) {
  if (Array.isArray(path2)) {
    var length = path1.length - 1;
    for (var i = length; i >= 0; i--) {
      return path2.indexOf(path1[i]) > -1;
    }
  }
  else {
    return path1.indexOf(path2) > -1;
  }
}

var ReactLazy = {
  createElement: function(updatePaths, type, key, props, children) {
    if (ReactCurrentOwner.current._pendingLazyUpdate) {
      if (updatePaths === false || (updatePaths !== true && !pathsMatch(ReactCurrentOwner.current._pendingLazyUpdate, updatePaths))) {
        return createElement(type, key ? assign({ key: key }, { __lazy: true }) : { __lazy: true }, children);
      }
      else {
        var props = typeof props === 'function' ? props() : props;
        return createElement(type, key ? assign({ key: key }, props) : props, children);
      }
    }
    else {
      ReactCurrentOwner.current._registerUpdatePaths(updatePaths);
      var props = typeof props === 'function' ? props() : props;
      return createElement(type, key ? assign({ key: key }, props) : props, children);
    }
  }
};

module.exports = ReactLazy;
