# fis-didi

基于fis且适用于滴滴前端集成解决方案


# fis-didi 文档

[TOC]

## 快速开始

### 安装didi
```
npm i -g fis-didi
```
MAC遇到权限问题？
```
sudo chown -R ${USER}  `npm config get prefix`/lib/
```

查看安装是否成功
```bash
didi -v
```
![Alt text](./1441078501465.png)
### 开始新项目

```bash
didi init project
```
![Alt text](./1441037518228.png)

```
├── component.json          // 目前主要作用记录项目使用了哪些模块（由此命令安装：didi install <namespace>/<component name>）
├── fis-conf.js             // fis-didi的配置文件
├── css                       // 项目的基础css文件
│   └── lib.css             // 基础HTML文件
├── img                     // 基础图片文件
│   └── didi.png
├── lib                     // 基础JS文件，主意里面文件都是 非模块化文件
│   ├── lib.js              // 负责将其他文件内嵌进来
│   ├── mod.js              // 模块加载器，配合fis-didi的发布来实现模块化
│   └── zepto.js            // 号称移动端的jquery
├── page                    // 页面根目录
│   └── pop                 // 示例页面文件夹
│       ├── animate.css     // 示例页面分出来的单个CSS
│       ├── main.css        // 示例页面的入口CSS
│       ├── main.html       // 示例页面的入口HTML
│       └── main.js
├── test                    // 模拟数据目录，特别注意的是其内部的结构和page文件夹一致
│   └── pop                 // 示例页面pop的模拟数据文件夹
│       └── main.php        // 示例页面pop的模拟数据
└── components              // 项目工程模块的跟目录
    ├── first               // first模块文件夹
    │   ├── first.css       // first模块的入口css，文件名须与模块名(first)相同 
    │   ├── first.html      // first模块的入口HTML，文件名须与模块名(first)相同
    │   └── first.js        // first模块的入口JS，文件名须与模块名(first)相同，可通过 require('first') 来获取模块
    ├── second
    │   ├── second.css
    │   ├── second.html
    │   └── second.js
    └── third
        ├── third.css
        ├── third.html
        └── third.js
```

### 初始化本地预览服务器

```
didi server init
```

### 启动本地预览服务器

```bash
didi server start
```

### 发布项目到本地预览服务器

```
didi release 
```

打开浏览器访问 http://127.0.0.1:8080/pop/ 即可预览项目效果。


## [发布]功能介绍

### 开启[weinre](people.apache.org/~pmuellr/weinre/docs/latest/)调试功能

```
didi release -W
```
![Alt text](./1441099020066.png)

### 代码压缩

```
didi release -o
```
所有的JS/CSS代码都被压缩

### 代码合并

```
didi release -p
```

按照配置规则自动合并代码，并且自动使用合并后的代码包。

### 代码监听修改自动发布

```bash
#修改即编译
didi release -w
#修改即编译并且自动刷新浏览器
didi release -w -L
```

### 更多[发布]功能功能请查看帮助

```
didi release -h
```
```bash
  Usage: release [options]

  Options:

    -h, --help             output usage information
    -d, --dest <names>     release output destination
    -m, --md5 [level]      md5 release option
    -D, --domains          add domain name
    -l, --lint             with lint
    -t, --test             with unit testing
    -o, --optimize         with optimizing
    -p, --pack             with package
    -w, --watch            monitor the changes of project
    -L, --live             automatically reload your browser
    -C, --console          console.log tool within phone browser
    -W, --weinre [client]  use weinre debugger for web pages
    -c, --clean            clean compile cache
    -r, --root <path>      set project root
    -f, --file <filename>  set fis-conf file
    -u, --unique           use unique compile caching
    --verbose              enable verbose output
```

## 语言实现功能介绍

### `__inline`语法
#### 预编译的前端模板

项目中任意的`tmpl`扩展名的文件，里面书写了简易模板[underscore.js的template](http://underscorejs.org/#template)的语法代码。
```
<!--a.tmpl---->
<div class="layer_box_card">
    <img src="<%=img_src%>"/>
</div>
```
项目中某个JS文件可以这样使用它
```
//main.js
var a_tmpl = __inline('./a.tmpl');
var a_tmpl_content = a_tmpl({
    img_src: 'http://xxx.png'
});
```

在浏览器的效果是这个样子的，在`main.js`已经将`a.tmpl`**预编译**成一个函数。
```javascript
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
*   <img src="http://xxx.png"/>
* </div>
*
*/
```
细心的读者注意到这里的`__inline`函数，这个函数可以在任意的JS块里面使用，它的作用顾名思义是将一个文件里面的代码`嵌入`进来。
而嵌入`.tmpl`扩展名的文件更是可以预编译成为一个JS文件。

聪明的读者可能会想到能不能将CSS、HTML嵌入进来呢？答案是肯定的！这是`FIS`实现的基础功能。[猛击看文档](http://fex-team.github.io/fis-site/docs/more/fis-standard.html#内容嵌入)


### 模块化开发

在项目中任何一个JS都可以被`require`获取，就像NODEJS一样。
**同时页面中会自动加载依赖的模块文件**

#### require可以接受3种类型
- 相对路径
以点`.`为起点
```
var a = require('./a.js');
```

- 绝对路径
以项目`/`根目录（fis-conf.js所在目录)为起点
```
var a = require('/page/pop/a.js')
```

- component模块名称
```
var dd = require('dd');
```
### 模块生态

如上所述，`didi`的component模块可以有2种来源

- 工程模块
 
例如工程模块a，被放在项目的`/comonents/`目录下
`/components/a/a.js`
```javascript
exports.name = '我是a模块';
exports.sayName = function(){
    console.log(exports.name);
}
```

- 生态模块
将会被安装在项目`/component_modules/`目录下

```bash
didi install didi-component/dd
```

```
├── component_modules
│   └── didi-component-dd
│       ├── component.json
│       └── dd.js
```

可以使用`didi install`命令安装任何一个发布在[github](https://github.com)或者滴滴[GitLab](https://git.xiaojukeji.com)平台上，且符合component规范的模块包。

- github：https://github.com/component
- xiaojukeji GitLab: https://git.xiaojukeji.com/groups/didi-component

#### 创建工程模块

通过上面的命令，可以一键创建`a`模块

```bash
didi init component
```
该模块将会自动放在`/comopnents/a`文件夹内
该模块的基本形态
```bash
├── README.md        //  模块的说明
├── component.json   //  模块的表单
├── a.css            //  模块的入口CSS
├── a.js             //  模块的入口JS
└── dialog.js        //  其他JS
```

#### 发布生态模块

等我们把模块开发好了，可以分享给其他人使用，软件开发的最佳实践DRY (Don't Repeat Yourself) 。

我们为`a`模块在[GitLab](https://git.xiaojukeji.com/)创建一个仓库。

上文说过我们可以从[github](https://github.com)或者滴滴[GitLab](https://git.xiaojukeji.com)下载一个模块包，我们可以根据模块任意选择发布到哪一个平台。

将所有的修改提交(`git commit`)之后，推送到远程仓库（git push）。

之后我们就可以发布一个新版本了，正如软件发包一样。

- 创建一个仓库
可以是任何groups的命名空间(namespace)
例如在我的`zhangnan03`下创建仓库。
```
https://git.xiaojukeji.com/zhangnan03/a.git
```

- 进入a模块的根目录
```
cd components/a
```

- 将模块提交到仓库
```
git init
git add -A
git commit -am 'first comment for didi-compnent'
git push -u origin master
```
确认所有修改已经提交且推送到远程仓库。

- 发布新版本

通过`didi publish -t <version>`命令来发布模块
`-t`是指定版本号
`<version>`是特定版本号
版本号的规则应该是符合`/^\d[0-9\.]+\d$/`规则。
```
didi publish -t 0.0.2
```
你可能看到以下类似输出信息，就代表发布成功啦。
```
On branch master
Your branch is up-to-date with 'origin/master'.
nothing to commit, working directory clean
origin	https://git.xiaojukeji.com/zhangnan03/a.git (fetch)
origin	https://git.xiaojukeji.com/zhangnan03/a.git (push)
[master bebcd89] update new tag 0.0.2 use [didi publish]
 1 file changed, 2 insertions(+), 2 deletions(-)
To https://git.xiaojukeji.com/didi-component/ddplayer.git
   31c4f8f..bebcd89  master -> master
To https://git.xiaojukeji.com/didi-component/ddplayer.git
 * [new tag]         0.0.2 -> 0.0.2
```

其他人可以直接使用，以下命令来安装你的dd模块了
```
didi install zhangnan03/dd
```
其他人也可以指定安装某(如0.0.1)版本
```
didi install zhangnan03/dd@0.01
```
然后在JS项目里面如下使用
```
var dd = require('dd');
dd.sayName();
```




## 页面开发

### 一键创建页面

进入项目根(fis-conf.js所在)目录

```
cd <project_root>
```
```
didi init page
```
创建`newpage`页面
![Alt text](./1441091674383.png)
```
├── page
│   ├── newpage          //newpage页面文件夹
│   │   ├── main.css    //newpage页面的CSS入口文件
│   │   ├── main.html   //newpage页面的HTML文件
│   │   └── main.js     //newpage页面的JS入口文件
└── test
    ├── newpage
    │   └── main.php
```
首先来介绍`test/newpage/main.php`，这是在本地预览服务的数据模拟的。他负责模拟
`/page/newpage/main.html`的数据。
`main.html`默认是认为使用codeigniter的简单模板语法。

如果想要使用`smarty`语法需要(如果使用者较多将会考虑增加`didi init page --type smarty`命令)
- 创建`/template`文件夹
- 并将`/page/newpage`文件夹移入`/template`文件夹`mv /page/newpage /template`。
- 将`/template/newpage/main.html`改名`/template/newpage/main.tpl`

创建好的页面，发布一下(`didi release`)就可以看效果啦

- /page/newpage/main.html : http://127.0.0.1:8080/newpage/
- /template/newpage/main.tpl : http://127.0.0.1:8080/smarty/newpage/

## 总结
恭喜你，看到这里你已经基本掌握了`didi`的基本日常使用啦。

我们学习了

- 快速创建一个项目 
 
```
didi init project 
```

- 快速创建一个页面

```
didi init page
```

- 快速创建一个工程模块

```
didi init component
```

- 发布一个模块到生态圈

```
didi publish 
```

- 安装一个生态模块

```
didi install didi-component/dd
```

- 启动一个本地测试服务

```
didi server start
```

- 将项目发布到本地测试服务目录

```
didi release
```



## 相关链接

[优雅didi心得-如何快速发布(deploy)到远端测试机](#)
[优雅didi心得-如何轻松调试客户端Webview](#)
[优雅didi心得-如何轻松发布的上线](#)
[优雅didi心得-如何快速的线上调试](#)












