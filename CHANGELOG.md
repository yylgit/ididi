## 0.6.0
`didi release -o`
所有的被引用的ttf文件自动压缩：根据CSS文件样式所匹配的DOM元素，自动抽取该DOM元素里面的文字，产生缩减版本字体文件。

## 0.5.1

- 判断`token`是否符合规则

- 新增 `install --token` 命令

	```
	didi install --token RZTer_CSK6-nfUK-MT6i
	```
	
	解决 `Reset Private token` 之后无法下载的问题

- 升级 fis 到最新版本

 解决新版本 nodejs 无法压缩 png 的问题

- didi server start 启动后的主页，显示 didi 的文档

- 支持给 script 添加属性，添加例如 crossorigin 属性

 可以用于 `wf` 组件发送报错信息(onerror 事件可以接收到错误信息)

- 添加 `install --clean` 命令

	允许清除缓存的安装文件

## 0.2.8 

repair bugs

## 0.2.8 

- 新增`didi init page --smarty`

- 默认扩展名:

JS

```javascript
require('./main')
```

等价于

```javascript
require('./main.js')`
```

CSS

/*javascript
* @require ./a
*/
```

等价于

/*
* @require ./a.js
*/

