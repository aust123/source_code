<!--
 * @Author: wayne
 * @Date: 2020-10-26 13:41:17
 * @LastEditTime: 2020-10-26 14:19:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \source-code\Object.create.md
-->
### Object.create的实现原理
1. 创建一个构造函数
2. 将构造函数的原型对象，指向obj
3. 返回构造函数的实例
```javascript
    function create(obj) {
        let F = function () { }
        F.prototype = obj
        return new F()
    }
```

