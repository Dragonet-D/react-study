export interface IColor {
  red: number
  green: number
  blue: number
}

function f(name: keyof IColor): keyof IColor{
  return name
}

f('red')