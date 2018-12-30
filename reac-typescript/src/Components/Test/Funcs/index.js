var Person = /** @class */ (function () {
    function Person(name) {
        this.name = name;
    }
    Person.prototype.getName = function () {
        console.log(this.name);
    };
    Person.flag = "hello world";
    return Person;
}());
var p = new Person("xiaoming");
p.getName();
