const escapeRegexp = require('escape-regex');

function createKeyRegex(str) {
  str = str.split('*').map(s => escapeRegexp(s)).join('*');
  return new RegExp('^' + str.replace('*', '.*'));
}

function createPathFilter(options) {
  return key =>
    options.ignoreWildcard
      ? key.startsWith(options.pathname)
      : key.match(createKeyRegex(options.pathname));
}

function filterPaths(paths, options) {
  return (paths || []).filter(createPathFilter(options));
}

function createViewFilter(options) {
  return view => {
    if (options && options.before && view.time > options.before) return false;
    if (options && options.after && view.time < options.after) return false;
    return true;
  };
}

function filterViews(views, options) {
  return (views || []).filter(createViewFilter(options));
}

module.exports = {
  createKeyRegex,
  createPathFilter,
  filterPaths,
  createViewFilter,
  filterViews,
};
