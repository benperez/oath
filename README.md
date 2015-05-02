# oath
A simple, straightforward library that makes working with promises slightly simpler

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
