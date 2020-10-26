function myNew() {
    //1.创建一个新对象
    let obj = new Object()
    // 取得外部传入的构造器
    let constructor = Array.prototype.shift.call(arguments)
    //实现继承，实例可访问构造器内部作用域
    obj.__proto__ = constructor.prototype
    // let obj = Object.create(constructor.prototype) //__proto__兼容性问题，可使用Object.create()，修改原型指向
    //调用构造器，并改变其this指向实例
    let ret = constructor.apply(obj, arguments)
    return typeof ret === "object" ? ret : obj
}

const testFn = function (name) {
    this.name = name
}
testFn.prototype.say = function () {
    console.log(1)
}
const newObj = myNew(testFn, 'foo')
console.log(newObj); // { name: "foo" }
console.log(newObj instanceof testFn); // true
// ========= 有返回值 =============
console.log(newObj) // {}
console.log(newObj instanceof testFn); // false