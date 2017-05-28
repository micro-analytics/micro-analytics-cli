module.exports = function testAdapter(options) {
  describe('micro-analytics adapter ' + options.name, () => {
    const adapter = require(options.modulePath);

    if (typeof options.beforeEach === 'function') {
      beforeEach(async () => {
        await options.beforeEach(adapter);
      });
    }

    if (typeof options.afterEach === 'function') {
      afterEach(async () => {
        await options.afterEach(adapter);
      });
    }

    if (typeof options.beforeAll === 'function') {
      beforeAll(async () => {
        await options.beforeAll(adapter);
      });
    }

    if (typeof options.afterAll === 'function') {
      afterAll(async () => {
        await options.afterAll(adapter);
        if (typeof adapter.close === 'function') {
          await adapter.close();
        }
      });
    }

    test('get() should return a promise', () => {
      expect(adapter.get('/a-key').constructor.name).toEqual('Promise');
    });

    test('getAll() should return a promise', () => {
      expect(adapter.getAll({ pathname: '/' }).constructor.name).toEqual(
        'Promise'
      );
    });

    test('has() should return a promise', () => {
      expect(adapter.has('/a-key').constructor.name).toEqual('Promise');
    });

    test('keys() should return a promise', () => {
      expect(adapter.keys().constructor.name).toEqual('Promise');
    });

    test('put() should return a promise', () => {
      expect(adapter.put('/a-key', {}).constructor.name).toEqual('Promise');
    });

    if (typeof adapter.options !== 'undefined') {
      test('options should be an array of args options', () => {
        expect(Array.isArray(adapter.options)).toBe(true);
        if (adapter.options.length >= 0) {
          let counter = 0;
          adapter.options.forEach(option => {
            expect(option.name).toBeDefined();
            expect(option.description).toBeDefined();
            counter++;
          });

          // if the forEach somehow breaks the test should break
          expect(counter).toBe(adapter.options.length);
        }
      });

      test('init should be a defined when options is defined', () => {
        expect(typeof adapter.init).not.toBe('undefined');
      });
    } else {
      test.skip('options should be an array of args options', () => {});
      test.skip('init should be a defined when options is defined', () => {});
    }

    if (typeof adapter.init !== 'undefined') {
      test('init should be a function', () => {
        expect(typeof adapter.init).toBe('function');
      });

      test('call init should not throw', () => {
        adapter.init(options.initOptions || {});
      });
    } else {
      test.skip('init should be a function', () => {});
      test.skip('call init should not throw', () => {});
    }

    it('should save and read', async () => {
      await adapter.put('/a-key', { views: [{ time: 1490623474639 }] });

      expect(await adapter.get('/a-key')).toEqual({
        views: [{ time: 1490623474639 }]
      });
    });

    it('should return empty list of views when key has no views', async () => {
      expect(await adapter.get('/c-key')).toEqual({ views: [] });
    });

    it('should return all saves on getAll', async () => {
      await adapter.put('/a-key', { views: [{ time: 1490623474639 }] });
      await adapter.put('/another-key', { views: [{ time: 1490623474639 }] });

      expect(await adapter.getAll({ pathname: '/' })).toEqual({
        '/a-key': { views: [{ time: 1490623474639 }] },
        '/another-key': { views: [{ time: 1490623474639 }] }
      });
    });

    it('should return filtered saves from getAll based on pathname', async () => {
      await adapter.put('/a-key', { views: [{ time: 1490623474639 }] });
      await adapter.put('/another-key', { views: [{ time: 1490623474639 }] });
      await adapter.put('/b-key', { views: [{ time: 1490623474639 }] });

      expect(await adapter.getAll({ pathname: '/a' })).toEqual({
        '/a-key': { views: [{ time: 1490623474639 }] },
        '/another-key': { views: [{ time: 1490623474639 }] }
      });
    });

    it('should return filtered saves from getAll based on before', async () => {
      await adapter.put('/a-key', { views: [{ time: 1490623474639 }] });
      await adapter.put('/another-key', { views: [{ time: 1490623478639 }] });
      await adapter.put('/b-key', { views: [{ time: 1490623484639 }] });

      expect(
        await adapter.getAll({ pathname: '/', before: 1490623478640 })
      ).toEqual({
        '/a-key': { views: [{ time: 1490623474639 }] },
        '/another-key': { views: [{ time: 1490623478639 }] },
        '/b-key': { views: [] }
      });
    });

    it('should return filtered saves from getAll based on after', async () => {
      await adapter.put('/a-key', { views: [{ time: 1490623474639 }] });
      await adapter.put('/another-key', { views: [{ time: 1490623478639 }] });
      await adapter.put('/b-key', { views: [{ time: 1490623484639 }] });

      expect(
        await adapter.getAll({ pathname: '/', after: 1490623478638 })
      ).toEqual({
        '/a-key': { views: [] },
        '/another-key': { views: [{ time: 1490623478639 }] },
        '/b-key': { views: [{ time: 1490623484639 }] }
      });
    });

    it('should return filtered saves from get based on before', async () => {
      await adapter.put('/a-key', {
        views: [{ time: 1490623474639 }, { time: 1490623478639 }]
      });

      expect(await adapter.get('/a-key', { before: 1490623475640 })).toEqual({
        views: [{ time: 1490623474639 }]
      });
    });

    it('should return filtered saves from get based on after', async () => {
      await adapter.put('/a-key', {
        views: [{ time: 1490623474639 }, { time: 1490623478639 }]
      });

      expect(await adapter.get('/a-key', { after: 1490623475640 })).toEqual({
        views: [{ time: 1490623478639 }]
      });
    });

    it('should have check whether a key is stored with has', async () => {
      await adapter.put('/a-key', { views: [{ time: 1490623474639 }] });

      expect(await adapter.has('/a-key')).toEqual(true);
      expect(await adapter.has('/non-existing-key')).toEqual(false);
    });

    if (typeof adapter.subscribe === 'function') {
      it('should allow subscription with observables', async () => {
        const listener = jest.fn();
        const unsubscribe = adapter.subscribe(listener);

        await adapter.put('/a-key', { views: [{ time: 1490623474639 }] });

        expect(listener).toHaveBeenCalledWith({
          key: '/a-key',
          value: { views: [{ time: 1490623474639 }] }
        });
      });

      it('should allow multiple subscription with observables and handle unsubscribption', async () => {
        const listener1 = jest.fn();
        const listener2 = jest.fn();
        const subscription = adapter.subscribe(listener1);
        adapter.subscribe(listener2);

        await adapter.put('/a-key', { views: [{ time: 1490623474639 }] });
        subscription.unsubscribe();
        await adapter.put('/b-key', { views: [{ time: 1490623474639 }] });

        expect(listener1).toHaveBeenCalledWith({
          key: '/a-key',
          value: { views: [{ time: 1490623474639 }] }
        });
        expect(listener1).not.toHaveBeenCalledWith({
          key: '/b-key',
          value: { views: [{ time: 1490623474639 }] }
        });
        expect(listener2).toHaveBeenCalledWith({
          key: '/a-key',
          value: { views: [{ time: 1490623474639 }] }
        });
        expect(listener2).toHaveBeenCalledWith({
          key: '/b-key',
          value: { views: [{ time: 1490623474639 }] }
        });
      });
    } else {
      it.skip('should allow subscription with observables', () => {});
      it.skip(
        'should allow multiple subscription with observables and handle unsubscribption',
        () => {}
      );
    }
  });
};
