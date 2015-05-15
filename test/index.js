'use strict';

/* global describe, it */

var assert = require('assert');

var oath = require('..');

describe('co', () => {
  it('returns a function with the appropriate length', () => {
    const f = oath.co(function*() {
      const a = yield Promise.resolve('foo');
      return a;
    });
    assert.strictEqual(f.length, 0);
    const g = oath.co(function*(a) {
      const foo = yield Promise.resolve(a);
      return foo;
    });
    assert.strictEqual(g.length, 1);
    const h = oath.co(function*(a, b) {
      const foo = yield Promise.resolve(a);
      return foo + b;
    });
    assert.strictEqual(h.length, 2);
  });

  it('returns a function which returns a promise', () => {
    const f = oath.co(function*() {
      const foo = yield Promise.resolve('foo');
      return foo;
    });
    const p = f();
    assert(p instanceof Promise);
  });

  it('can chain promises to resolve a value', () => {
    const f = oath.co(function*() {
      const one = yield Promise.resolve(1);
      const two = yield Promise.resolve(one + 1);
      yield Promise.resolve('foo');
      const three = yield Promise.resolve(two + 1);
      return three;
    });
    const p = f();
    p.then((value) => {
      assert.strictEqual(value, 3);
    });
  });

  it('rejects on a thrown error', () => {
    const f = oath.co(function*() {
      const a = yield Promise.resolve(1);
      a.thisMethodDoesNotExist();
      return a;
    });
    const p = f();
    p.then(() => {
      assert.fail();
    }, (error) => {
      assert.strictEqual(error.message, 'whoops!');
    });
  });

  it('rejects when a yielded promise rejects', () => {
    const f = oath.co(function*() {
      const a = yield Promise.reject(new Error('whoops!'));
      return a;
    });
    const p = f();
    p.then(() => {
      assert.fail();
    }, (error) => {
      assert.strictEqual(error.message, 'whoops!');
    });
  });
});
