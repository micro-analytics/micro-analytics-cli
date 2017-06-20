const {
  createKeyRegex,
  createPathFilter,
  filterPaths,
  createViewFilter,
  filterViews,
} = require('../src/filtering');

test('createKeyRegex', () => {
  expect(createKeyRegex('/path').test('/pathname')).toBe(true);
  expect(createKeyRegex('/p*th').test('/pathname')).toBe(true);
  expect(createKeyRegex('/path').test('/athname')).toBe(false);
});

test('createPathFilter with ignoreWildcard', () => {
  const keys = ['/path', '/other-path', '/pathname', '/p-ath'];
  const filterFunc = createPathFilter({
    ignoreWildcard: true,
    pathname: '/path',
  });

  expect(keys.filter(filterFunc)).toEqual(['/path', '/pathname']);
});

test('createPathFilter without ignoreWildcard', () => {
  const keys = ['/path', '/other-path', '/pathname', '/p-ath'];
  const filterFunc = createPathFilter({
    ignoreWildcard: false,
    pathname: '/p*ath',
  });

  expect(keys.filter(filterFunc)).toEqual(['/path', '/pathname', '/p-ath']);
});

test('filterPaths should return array when paths is undefined', () => {
  expect(filterPaths(undefined)).toEqual([]);
});

test('filterPaths with ignoreWildcard', () => {
  const keys = ['/path', '/other-path', '/pathname', '/p-ath'];
  const filtered = filterPaths(keys, {
    ignoreWildcard: true,
    pathname: '/path',
  });

  expect(filtered).toEqual(['/path', '/pathname']);
});

test('filterPaths without ignoreWildcard', () => {
  const keys = ['/path', '/other-path', '/pathname', '/p-ath'];
  const filtered = filterPaths(keys, {
    ignoreWildcard: false,
    pathname: '/p*ath',
  });

  expect(filtered).toEqual(['/path', '/pathname', '/p-ath']);
});

const one = { time: new Date(2017, 4, 4, 1, 0).getTime() };
const two = { time: new Date(2017, 4, 4, 2, 0).getTime() };
const three = { time: new Date(2017, 4, 4, 3, 0).getTime() };
const four = { time: new Date(2017, 4, 4, 4, 0).getTime() };
const views = [one, two, three, four];

const after = new Date(2017, 4, 4, 2, 30).getTime();
const before = new Date(2017, 4, 4, 3, 30).getTime();

test('createViewFilter should with before filter', () => {
  expect(views.filter(createViewFilter({ before }))).toEqual([one, two, three]);
});

test('createViewFilter should with after filter', () => {
  expect(views.filter(createViewFilter({ after }))).toEqual([three, four]);
});

test('createViewFilter should with after and before filter', () => {
  expect(views.filter(createViewFilter({ after, before }))).toEqual([three]);
});

test('filterViews should return array when views is undefined', () => {
  expect(filterViews(undefined)).toEqual([]);
});

test('filterViews should not filter without options', () => {
  expect(filterViews(views)).toEqual([one, two, three, four]);
});

test('filterViews should with before filter', () => {
  expect(filterViews(views, { before })).toEqual([one, two, three]);
});

test('filterViews should with after filter', () => {
  expect(filterViews(views, { after })).toEqual([three, four]);
});

test('filterViews should with after and before filter', () => {
  expect(filterViews(views, { after, before })).toEqual([three]);
});
