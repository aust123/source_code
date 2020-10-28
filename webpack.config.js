/*
 * @Author: wayne
 * @Date: 2020-10-28 12:27:55
 * @LastEditTime: 2020-10-28 13:47:16
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \source-code\webpack.config.js
 */
const path = require("path");
module.exports = {
    mode: 'production',
    entry: {
        app: path.resolve(__dirname, './src/promise.js')
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'promise.min.js'
    }
}
