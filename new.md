<!--
 * @Author: your name
 * @Date: 2020-10-26 11:51:57
 * @LastEditTime: 2020-10-26 12:58:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \source-code\new.md
-->
### new 操作符的底层实现
js在创建一个对象实例时，通过new 一个构造函数来实现，但是new执行时，底层原理是如何实现的呢？
1.  创建一个新对象
2.  将构造函数的作用域赋给新的对象（此时this就指向这个新对象）
3.  执行构造函数的代码，为这个新对象添加属性
4.  返回新对象

```javascript
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

```
