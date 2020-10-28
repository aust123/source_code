/*
 * @Author: your name
 * @Date: 2020-10-26 13:42:38
 * @LastEditTime: 2020-10-28 09:49:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \source-code\objectCreate.js
 */
function create(obj) {
    let F = function () { }
    F.prototype = obj
    return new F()
}

Array.myIsArray = function (arr) {
    return Object.prototype.toString.call(arr) === "[object Array]"
}
console.log(Array.myIsArray([]))//true

function func() {
    return new Promise((resolve, reject) => {
        console.log(3)
        resolve(2)
    })
}

async function test() {
    let data = 1
    data = await func()
    console.log(1);
    if (data === 1) {
        console.log(true)
    } else if (data === 2) {
        console.log(false)
    }
}
test()


var foo='hello'; 
(function(foo){
   console.log(foo);
   var foo=foo||'world';
   console.log(foo);
    function foo(){}
})(foo);
console.log(foo);
//变量=>声明提升，赋值不提升
//函数=>变量和赋值都提升
//js是词法作用域（静态作用域）=>在声明的时候确定作用域，而不是调用的时候
var a=1;
function funcs(){ 
    var a=2  
   var test=()=>{
       console.log(this)
        console.log(a)
    }
    test()
   
}
funcs()
console.log(a)

var x=1
function func(x,y=function(){x=2}){
    var x=3
    y()
    console.log(x)
}
func(5)
console.log(x)



