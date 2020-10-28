/*
 * @Author: wayne
 * @Date: 2020-10-26 14:28:21
 * @LastEditTime: 2020-10-27 22:19:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \source-code\promise.js
 */
(function () {
    //1.创建一个Promise的构造函数
    //2.new的时候，executor
    //3.创建一个promise状态参数[pending,fulfilled,rejected]
    //4.resolve=>onFulfilled,rejected=>onRejected
    //5.value,reason

    const PENDING = 'pending'
    const FULFILLED = "fulfilled"
    const REJECTED = 'rejected'
    function Promise(executor) {
        let that = this//缓存this指向
        that.status = PENDING//初始化promise的状态值
        that.value = undefined //resolve执行的value
        that.reason = undefined //reject执行的失败原因
        that.onFulfilledCallback = [];//resolve函数集合
        that.onRejectedCallback = [];//reject函数集合

        // 为什么resolve 加setTimeout?
        // 2.2.4规范 onFulfilled 和 onRejected 只允许在 execution context 栈仅包含平台代码时运行.
        // 注1 这里的平台代码指的是引擎、环境以及 promise 的实施代码。实践中要确保 onFulfilled 和 onRejected 方法异步执行，且应该在 then 方法被调用的那一轮事件循环之后的新执行栈中执行。

        function resolve(value) {
            if (value instanceof Promise) {
                return value.then(resolve, reject)
            }
            if (that.status !== PENDING) return
            setTimeout(() => {
                that.status = FULFILLED
                that.value = value
                that.onFulfilledCallback.forEach(cb => cb(that.value))
            })
        }

        function reject(reason) {
            if (that.status !== PENDING) return
            setTimeout(() => {
                that.status = REJECTED
                that.reason = reason
                that.onRejectedCallback.forEach(cb => cb(that.reason))
            })
        }

        try {
            executor(resolve, reject)
        } catch (err) {
            reject(err)
        }
    }
    /**
     * 对resolve 进行改造增强 针对resolve中不同值情况 进行处理
     * @param {promise} promise2  promise1.then方法返回的新的promise对象
     * @param {type} x  promise1中onFulfilled的返回值
     * @param {type} resolve    promise2的resolve方法
     * @param {type} reject  promise2的reject方法
     */

    function resolvePromise(promise2, x, resolve, reject) {
        if (promise2 === x) {
            return reject(new TypeError('循环引用'))
        }
        let called = false;
        if (x instanceof Promise) {
            if (x.status === PENDING) {
                x.then(y => {
                    resolvePromise(promise2, y, resolve, reject)
                }, reason => {
                    reject(reason)
                })
            } else {
                x.then(resolve, reject);
            }
        } else if (x !== null && ((typeof x === "object") || (typeof x === "function"))) {
            try {
                let then = x.then
                if (typeof then === 'function') {
                    then.call(x, y => {
                        if (called) return
                        called = true
                        resolvePromise(promise2, y, resolve, reject)
                    }, reason => {
                        if (called) return
                        called = true
                        reject(reason)
                    })
                } else {
                    resolve(x)
                }
            } catch (err) {
                if (called) return
                called = true
                reject(err)
            }
        } else {
            resolve(x)
        }

    }
    /**
     * [注册fulfilled状态/rejected状态对应的回调函数]
     * @param  {function} onFulfilled fulfilled状态时 执行的函数
     * @param  {function} onRejected  rejected状态时 执行的函数
     * @return {function} newPromsie  返回一个新的promise对象
     */

    Promise.prototype.then = function (onFulfilled, onRejected) {
        const that = this
        let newPromise
        debugger;
        console.log(that);
        onFulfilled = typeof onFulfilled === "function" ? onFulfilled : value => value
        onRejected = typeof onRejected === "function" ? onRejected : reason => { throw reason; }
        if (that.status === FULFILLED) {
            return newPromise = new Promise((resolve, reject) => {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(that.value);
                        resolvePromise(newPromise, x, resolve, reject);
                    } catch (err) {
                        reject(err)
                    }
                })
            })
        }
        if (that.status === REJECTED) {
            return newPromise = new Promise((resolve, reject) => {
                setTimeout(() => {
                    try {
                        let x = onRejected(that.reason);
                        resolvePromise(newPromise, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                });
            });
        }
        if (that.status === PENDING) {
            console.log('a')
            return newPromise = new Promise((resolve, reject) => {
                that.onFulfilledCallback.push((value) => {
                    try {
                        let x = onFulfilled(value);
                        resolvePromise(newPromise, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                });
                that.onRejectedCallback.push((reason) => {
                    try {
                        let x = onRejected(reason);
                        resolvePromise(newPromise, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                });
            });
        }
    }
    /**
     * Promise.all Promise进行并行处理
     * 参数: promise对象组成的数组作为参数
     * 返回值: 返回一个Promise实例
     * 当这个数组里的所有promise对象全部变为resolve状态的时候，才会resolve。
     */
    Promise.all = function (promises) {
        return new Promise((resolve, reject) => {
            let done = gen(promises.length, resolve);
            promises.forEach((promise, index) => {
                promise.then((value) => {
                    done(index, value)
                }, reject)
            })
        })
    }

    function gen(length, resolve) {
        let count = 0;
        let values = [];
        return function (i, value) {
            values[i] = value;
            if (++count === length) {
                console.log(values);
                resolve(values);
            }
        }
    }/**
 * Promise.race
 * 参数: 接收 promise对象组成的数组作为参数
 * 返回值: 返回一个Promise实例
 * 只要有一个promise对象进入 FulFilled 或者 Rejected 状态的话，就会继续进行后面的处理(取决于哪一个更快)
 */
    Promise.race = function (promises) {
        return new Promise((resolve, reject) => {
            promises.forEach((promise, index) => {
                promise.then(resolve, reject);
            });
        });
    }

    // 用于promise方法链时 捕获前面onFulfilled/onRejected抛出的异常
    Promise.prototype.catch = function (onRejected) {
        return this.then(null, onRejected);
    }

    Promise.resolve = function (value) {
        return new Promise(resolve => {
            resolve(value);
        });
    }

    Promise.reject = function (reason) {
        return new Promise((resolve, reject) => {
            reject(reason);
        });
    }
    /**
     * 基于Promise实现Deferred的
     * Deferred和Promise的关系
     * - Deferred 拥有 Promise
     * - Deferred 具备对 Promise的状态进行操作的特权方法（resolve reject）
     *
     *参考jQuery.Deferred
     *url: http://api.jquery.com/category/deferred-object/
     */
    Promise.deferred = function () { // 延迟对象
        let defer = {};
        defer.promise = new Promise((resolve, reject) => {
            defer.resolve = resolve;
            defer.reject = reject;
        });
        return defer;
    }
    if (typeof window !== "undefined") {
        window.Promise = Promise
    }
    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = Promise
    }

})()
