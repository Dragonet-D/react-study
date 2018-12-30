import {strict} from "assert";

class Person {
    public static flag: string = "hello world";
    private name: string;
    constructor(name: string) {
        this.name = name;
    }
    public getName(): void {
        console.log(this.name);
    }
}

const p: Person = new Person("xiaoming");
p.getName();

function f<T>(x: T, y: T): any {
    if (typeof x === "string") {
        return x + y;
    } else {
        return ""
    }
}

f<string>("a", "b");