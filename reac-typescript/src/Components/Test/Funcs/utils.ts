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

function f1(x: number, y: number): number;
function f1(x: string, y: string): string;
function f1(x: any, y: any): any{
    if (typeof x === "number") {
        return x * y;
    } else {
        return x + y;
    }
}

f1(1, 2);
f1("1", "2");

class Person {
    public static flag: string = "光荣的人民教师";
    private name: string;
    private age: number;

    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }
    public say(): any{
        return `${this.name} ${this.age}`
    }
}

const p: Person = new Person("xiaoming", 20);
console.log(Person.flag);
p.say();