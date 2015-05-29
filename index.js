'use strict';

//
const arity = function(n, f) {
  const params = Array(n + 1).join('x').replace(/x/g, function(_, n) {
    return n === 0 ? '$0' : ', $' + n;
  });
  return Function(  // jshint ignore:line
    'f',
    'return function(' + params + ') { return f.apply(this, arguments); }'
  ).call(this, f);
};

// co :: (Generator (arguments -> a)) -> (arguments -> Promise a)
// Accepts a generator function which yields promises and converts it to
// a promise-resolving state machine. Yielded promises are chained together
// using .then, rejected errors are thrown through the generator, and a
// returned value is resolved as the settled value of the promise.
exports.co = function(generator) {
  const generator_length = generator.length;
  return arity(generator_length, () => {
    const coroutine = generator.apply(null, arguments);
    return new Promise((resolve, reject) => {
      const go = (method, value) => {
        try {
          const result = coroutine[method](value);
          if (result.done) {
            resolve(result.value);
          } else {
            result.value.then(v => go('next', v), e => go('throw', e));
          }
        } catch (error) {
          reject(error);
        }
      };
      go('next', null);
    });
  });
};

// promote :: (a -> (Error -> b -> ()) -> ()) -> (a -> Promise b)
exports.promote = function(nodeFunction) {
  return arity(nodeFunction.length - 1, () => {
    const $functionArgs = arguments;
    return new Promise((resolve, reject) => {
      Array.prototype.push.call(
        $functionArgs,
        error => {
          if (error != null) {
            reject(error);
          } else {
            resolve.apply(null, Array.prototype.slice.call(arguments, 1));
          }
        }
      );
      nodeFunction.apply(null, $functionArgs);
    });
  });
};
