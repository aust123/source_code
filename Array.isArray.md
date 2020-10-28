<!--
 * @Author: wayne
 * @Date: 2020-10-26 13:48:55
 * @LastEditTime: 2020-10-26 14:19:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \source-code\Array.isArray.md
-->
### Array.isArray的实现方式
通过`Object.prototype.toSting`转换成对应类型字符串来判断

```javascript
   Array.myIsArray=function (arr){
      return Object.prototype.toString.call(arr)==="[object Array]"
   } 
   console.log(Array.myIsArray([]))//true
```