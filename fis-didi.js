var fis = module.exports = require('fis');

fis.cli.name = 'fis-didi';
fis.cli.info = fis.util.readJSON(__dirname + '/package.json');

fis.config.merge({
    roadmap: {
        ext: {
            html: 'html'
        }
    },
    //各个流程的配置
    modules: {
        parser: {
            //.tmpl后缀的文件使用fis-parser-utc插件编译
            tmpl: 'utc',
            css: 'less',
            less: 'less'
        },
        postprocessor: {
            js: 'jswrapper,require-async',
            html: "require-async",
            tpl: "require-async",
        },

        postpackager: ['autoload'],
        spriter: 'csssprites',
        optimizer: {
            tpl: 'html-minifier',
        }
    },
    settings: {
        postprocessor: {
            jswrapper: {
                type: 'amd'
            }
        },
        postpackager: {
            autoload: {
                useInlineMap: true,
                // include: '/page/**',
                optDeps: false
            }
        }
    },
   server: {
        rewrite: true,
        libs: 'pc',
        clean: {
            exclude: "fisdata**,smarty**,rewrite**,index.php**,WEB-INF**,combo**,qasync**"
        }
    }
});


















