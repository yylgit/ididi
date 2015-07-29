# fis-didi

基于 fis-didi 前端解决方案

### 安装
- 安装nodejs
 
...
- 安装php-cgi
 
...
- 安装java
 
...
- 安装fis-didi

``` bash
npm install -g fis-didi
```

遇到权限问题？


```
sudo chown -R ${USER} /usr/local/lib/node_modules
```
- 查看安装是否成功
``` bash
didi -v
```

## 在本地环境测试
- 执行初始化本地测试环境

``` bash

didi server install rewrite #安装rewrite

didi server install smarty  #安装smarty

cd `didi server info | grep 'root=' | sed -E 's/root=(.+)/\1/' ` && git clone https://github.com/webzhangnan/fis-didi-server.git &&  mv fis-didi-server/* ./ && rm -rf fis-didi-server/ && cd - 

#安装其他

```

- 开启本地测试环境


``` bash
didi server start #开启一个本地http服务
``` 


- 将项目发布到本地测试环境

``` bash
didi release 
```


## 发布到测试机环境


```
didi release -d test
```

## 发布给QA测试

编译


``` bash
sh build.sh test
```

提交output



## 发布上线

``` bash
sh build.sh '上线说明'
```

以上命令执行之后自动静态文件提交到对应的SVN目录（可配置），然后输出以下在huston需要上线的格式。


``` 
2015-07-16--01:31:25


https://svn.xiaojukeji.com/xiaoju/server/static/trunk/pinche/release/page/driver_register_edition/main_2a3a2cd.js 112488
https://svn.xiaojukeji.com/xiaoju/server/static/trunk/pinche/release/pkg/driver_register_edition_86ef1c2.js 112488

```


- 支持一次开发发布多次。
在当前目录下的文件`./filelist.txt`里面看到本次开发所有新增（需要上线）的文件。


```

2015-07-16--01:31:02


https://svn.xiaojukeji.com/xiaoju/server/static/trunk/pinche/release/page/driver_register_edition/main_2a3a2cd.js 112488
https://svn.xiaojukeji.com/xiaoju/server/static/trunk/pinche/release/pkg/driver_register_edition_86ef1c2.js 112488





2015-07-16--01:31:25


https://svn.xiaojukeji.com/xiaoju/server/static/trunk/pinche/release/page/driver_register_edition/main_2a3a2cd.js 112488
https://svn.xiaojukeji.com/xiaoju/server/static/trunk/pinche/release/pkg/driver_register_edition_86ef1c2.js 112488
```




## 功能


#### 新增[weinre](http://people.apache.org/~pmuellr/weinre/docs/latest/Home.html)调试

```
didi release --weinre
```

#### 新增手机调试输出功能

可以在手机页面打印错误日志，
像Chrome devTool一样折叠展开数组和对象的的内部属性详情

```bash
didi release -C
```


#### 自动同步/异步加载依赖的模块组件
- 同步依赖语法


``` html 
<!--main.html-->
<script>
!function(){
    var a_model = require('./a.js')
}();
</script>
```
``` js
// a.js
var b_model = requrie('./b.js')
```
``` js
// b.js
var c_model = requrie('./c.js')
```
在main.html里面依赖的a.js，a.js依赖了b.js，b.js依赖了c.js，则main.html自动加入`<script>`将`a.js`、`b.js`、`c.js`，按照`c.js`->`b.js`->`a.js`顺序引入进来。
``` html 
<!--main.html-->
<script src="./c.js"></script>
<script src="./b.js"></script>
<script src="./a.js"></script>
<script>
require('./a.js')
</script>
```

- 异步依赖语法


``` js
//a.js
exports.show = function(){
    require.async('./b.js', function(b_model){
        b_model.enjoy_dinner();
    });
}
```

以上代码`./b.js`不会被立刻加载，仅仅在执行到`require('./a.js').show()`时才会去异步加载`b.js`，如果`b.js`被直接打包到其他同步模块里面当然会顺便加载下来。

#### 自由配置的打包策略
如果可以通过`fis-conf.js`里面配置`a.js + b.js + c.js`打包成`c_b_a.js`则`main.html`自动引入`c_b_a.js`。


``` html 
<!--main.html-->
<script src="./c_b_a.js"></script>
<script>
require('./a.js')
</script>
```

#### 模块化开发和非模块化兼容
有很多JS模块是取自网上的开源组件，我不想浪费事件去改造，只想直接使用，`fis-didi`必然也会求同存异。


```
//目录结构
- _iscroll/iscroll_lite.js
- a.js
```

```js
/**
* @require _iscroll/iscroll-lite.js
**/
new iScroll(document.body);
```


在a.js里面使用到了`scroll`功能组件。

#### 测试数据模拟

```html
<!--/page/home/mian.html-->
<script>
var pagePrams = {
    username: '<?php echo isset($username) ? $username : "";?>'
}
</script>
```

```php
/* /test/home/mian.php */
<?php
	$fis_data = array(
		"username" => "zhangnan03",
	);
?>
```

在`/page`和`/test`文件夹一一对应的关系，预览时效果如下

```html
<!--/page/home/mian.html-->
<script>
var pagePrams = {
    username: 'zhangnan03'
}
</script>
```

#### GET/POST请求模拟

#### 重定向支持

#### codeigniter默认模板语法支持

支持本地预览codeigniter默认模板语法

```
/page/[page_name]/main.html
```
本地预览地址 http://${host}:${port}/page_name/

#### smarty语法支持

```
/template/[page_name]/main.tpl
```
本地预览地址 http://${host}:${port}/smarty/page_name/


#### 规范
- codeigniter页面模板
放到 `/page/[页面名]/main.html` 里，发布之后到达 `/page/[页面名称].html`

- smarty页面模板
放到 `/template/[页面名]/main.html` 里，发布之后到达 `/template/[页面名称].tpl`


- 测试数据
放在 `/test/[页面名/main.php`，页面模板关联映射。
- 下划线`_`文件或者文件夹
开头`_`的js文件或者文件夹(里面的js文件)不会作为模块化js组件发布
- 前端模板预编译
自动把了`underscore.js`的前端模板预编译，只需要把模板写进`tmpl`扩展名的文件里面，在JS里面通过`mytpl = __inline('./.underscore.tmpl')`，引进来使用即可。

``` html
<!--a.tmpl---->
<div style="display:none" class="layer_box_card">
	<img src="<%=img_src%>"/>
</div>
```

``` javascript
//main.js
var a_tmpl = __inline('./a.tmpl');
var a_tmpl_content = a_tmpl({
	img_src: 'http://xxx.png'
});
```

``` javascript
// 发布后的main.js 已经将a.tmpl预编译成一个函数
var a_tmpl = function(obj){
	var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
	with(obj||{}){
	__p+='<div style="display:none" class="layer_box_card">\n\t<img src="'+
	((__t=(img_src))==null?'':__t)+
	'"/>\n</div>';
	}
	return __p;
};

var a_tmpl_content = a_tmpl({
	img_src: 'http://xxx.png'
});

/*
* a_tmpl_content等于
* <div style="display:none" class="layer_box_card">
*	<img src="http://xxx.png"/>
* </div>
*
*/

```




#### 如何将以前的页面移入
- 新建文件夹`/page/文件名称/main.html`
- 公用的css移入`/css`，同时将所移入的css里面引入的图片拷贝到`/img`文件夹下，并将图片文件引用改成/img/xxx.jpg
- 将`/main.html`引入css的路径改成`/css/xxx.css`
- 私用的css移入`/page/文件名称/`文件夹，将所移入的css里面引用的图片拷贝到`/page/文件名称/img`文件夹下，并将图片文件引用改成`./img/xxx.png`
- 将私用的js和公用的js分别移入`/page/文件名称/_rough`和`/lib`，并将js文佳引用分别改成`./_rough/xxx.js`和`/lib/xxx.js`

- 将非模块化的文件放在放在下划线开头的文件夹（或者lib文件夹）里面，或者以下划线命名，通过`inline`嵌入，或者使用以下形式声明


```
/*
* @require xxx.js
*
*
*
*/
```

模块化的文件使用`require`声明依赖



## 更多使用细节
http://fis.baidu.com/docs/api/fis-conf.html
