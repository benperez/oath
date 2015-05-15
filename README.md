# oath
A simple, straightforward library that makes working with promises easier

## Proposed Functions
### Promise.all with a set level of concurrency
```haskell
concurrent :: Int -> [Promise a] -> Promise [a]
```

### Converts a generator which yields promises into a function which returns a promise
```haskell
co :: (Generator (arguments -> a)) -> (arguments -> Promise a)
```

### Converts a function which accepts a callback into a function which returns a promise
```haskell
promote :: (arguments -> (Error -> a -> ()) -> ()) -> (arguments -> Promise a)
```

## Examples
### `co`
```javascript
const fs = require('fs');

// readFile :: String -> Promise String
const readFile = function(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (err, data) => {
      if (err != null) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

// writeFile :: (String, String) -> Promise ()
const writeFile = function(filename, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, data, err => {
      if (err != null) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

// readAndWrite :: String -> Promise ()
const readAndWrite = oath.co(function*(suffix) {
  const fileContents = yield readFile('numbers.txt');
  const lines = filesContents.split('\n');
  for (let idx = i; idx < lines.length; idx++) {
    if (lines[idx].startsWith('write me!')) {
      yield writeFile(idx + '.txt', lines[idx] + suffix);
    }
  }
  return lines.length;
});

readAndWrite('foo').then(console.log, console.err);
```
