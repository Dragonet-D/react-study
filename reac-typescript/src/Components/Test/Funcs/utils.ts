const stringTest: string = "hello";
const arr1: number[] = [1, 2, 3];
const arr2: string[] = ["1", "2", "3"];

export const test = (): string | string[] => {
    return stringTest;
};

export const test1 = (): any[] => {
    return [...arr1, ...arr2];
};
enum Enum {
    Red = 1
}

console.log(Enum.Red);

function f(x: number, y?: number) {
    if(y) {
        return x + y;
    } else {
        return x
    }
}

f(1, 2);