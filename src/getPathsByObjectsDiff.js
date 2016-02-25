var shallowEqual = require('shallowEqual');

function getObjectValueByPath(obj, path, current = 0) {
  if (current < path.length - 1 && typeof(obj[path[current]]) !== 'undefined') {
    return getObjectValueByPath(obj[path[current]], path, current + 1);
  }
  else {
    return obj[path[current]];
  }
}

function getPathsByObjectsDiff(current, next, paths) {
  var matchingPaths = [];

  for (var i in paths) {
    var pathParts = paths[i].split('.');
    var value = getObjectValueByPath(current, pathParts);
    var nextValue = getObjectValueByPath(next, pathParts);

    // Check for strict equality of primitives
    if ((typeof value !== 'object' && value !== null ||
      typeof nextValue !== 'object' && nextValue !== null) 
        && value !== nextValue) {
          matchingPaths.push(paths[i]);
    }
    // Check for shallow equality of array and objects
    else if (!shallowEqual(value, nextValue)) {
      matchingPaths.push(paths[i]);
    }
  }

  return matchingPaths;
}

module.exports = getPathsByObjectsDiff;
