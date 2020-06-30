function f<A, B, C, D>(fn: (A, B, C) => D, a: A, b: B, c: C): D {
  return fn(a, b, c)
}