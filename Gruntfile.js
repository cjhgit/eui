module.exports = function (grunt) {

    grunt.initConfig({
        // 元数据
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*!\n' +
                 ' * Bootstrap v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
                 ' * Copyright 2011-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
                 ' * Licensed under the <%= pkg.license %> license\n' +
                 ' */\n',

        uglify: {
            options: {
                stripBanners: true,
                banner: '/*! <%=pkg.name%>-<%=pkg.version%>.js <%=grunt.template.today("yyyy-mm-dd") %>*/\n'
            },
            test: {
                src: 'dist/js/eui.js',
                dest: 'dist/js/eui.min.js'
            },
            custom: {
                src: 'dist/js/eui-custom.js',
                dest: 'dist/js/eui-custom.min.js'
            },
            dist: {
                options: {
                    stripBanners: true,
                    banner: '/*! bootstrap v3.3.6 | MIT License | getbootstrap.com */\n'
                },
                src: 'src/js/affix.js',
                dest: 'dist/js/affix.min.js'
            },
            dist2: {
                options: {
                    stripBanners: true,
                    banner: '/*! <%=pkg.name%> <%= pkg.version %> | MIT License | chenjianhang.com/ */\n'
                },
                files: {
                    'dist/js/totop.min.js': ['src/totop/totop.js'],
                    'dist/js/eui.dialog.min.js': ['src/eui.dialog.js']
                }
            },
            widget: {
                options: {
                    stripBanners: true,
                    banner: '/*! <%=pkg.name%> <%= pkg.version %> | MIT License | chenjianhang.com/ */\n'
                },
                src: 'src/js/complete.js',
                dest: 'dist/js/eui-complete.min.js'
            },
        },
        concat: {
            options: {
                separator: ';',
                stripBanners: true,
                banner: '/*! eUI - v1.0.0 */'
            },
            test: {
                src: [
                    'src/js/base.js',
                    'src/js/selectable.js',
                    'src/js/draggable.js',
                    'src/js/sortable.js',
                    'src/js/resizable.js',
                    'src/js/position.js',
                    'src/js/alert.js',
                    'src/js/button.js',
                    'src/js/slider.js',
                    'src/js/collapse.js',
                    'src/js/dialog.js',
                    'src/js/dropdown.js',
                    //'src/js/modal.js',
                    'src/js/tooltip.js',
                    'src/js/popover.js',
                    'src/js/scrollspy.js',
                    'src/js/tab.js',
                    'src/js/transition.js',
                    // eUI 组件
                    'src/box/box.js',
                    'src/totop/totop.js'
                    // 封装

                    //'src/hover-dropdown.js'
                ],
                dest: 'dist/js/eui.js'
            },
            custom: {
                src: [
                    'src/js/base.js',
                    'src/js/selectable.js',
                    'src/js/draggable.js',
                    //'src/js/sortable.js',
                    //'src/js/resizable.js',
                    'src/js/position.js',
                    //'src/js/alert.js',
                    'src/js/button.js',
                    'src/js/slider.js',
                    //'src/js/collapse.js',
                    'src/js/dialog.js',
                    'src/js/dropdown.js',
                    //'src/js/modal.js',
                    'src/js/tooltip.js',
                    'src/js/popover.js',
                    //'src/js/scrollspy.js',
                    'src/js/tab.js',
                    'src/js/transition.js',
                    // eUI 组件
                    //'src/box/box.js',
                    //'src/totop/totop.js'
                    // 封装

                    //'src/hover-dropdown.js'
                ],
                dest: 'dist/js/eui-custom.js'
            },
            dist: {
                options: {
                    stripBanners: true,
                    banner: '/*! bootstrap v3.3.6 | MIT License | getbootstrap.com */\n'
                    //mangle: false, //不混淆变量名
                    //preserveComments: 'all', //不删除注释，还可以为 false（删除全部注释），some（保留@preserve @license @cc_on等注释）
                    //footer:'\n/*! <%= pkg.name %> 最后修改于： <%= grunt.template.today("yyyy-mm-dd") %> */'//添加footer
                },
                src: [
                    'src/js/affix.js',
                ],
                dest: 'dist/js/affix.js'
            },
        },
        cssmin: {
            options: {
                keepSpecialComments: 0
            },
            compress: {
                files: {
                    'dist/css/eui.min.css': [
                        "dist/css/eui.css",
                        "src/totop/totop.css"
                    ]
                    /*
                    'dist/css/eui.min.css': [

                    ]
                    */
                }
            },
            reset: {
                files: {
                    'dist/css/eui-reset.min.css': [
                        "dist/css/eui-reset.css",
                    ]
                }
            },
            custom: {
                files: {
                    'dist/css/eui-custom.min.css': [
                        "dist/css/eui-custom.css",
                    ]
                }
            },
            widget: {
                files: {
                    'dist/css/eui-icon.min.css': [
                        "dist/css/eui-icon.css",
                    ]
                }
            }
        },
        watch: {
            scripts: {
                files: ['**/*.js'],
                tasks: ['uglify']
            }
        },
        less: {
            default:{
                options: {
                    compress: false,
                    yuicompress: false
                },
                files: {
                    "dist/css/eui.css": "src/less/eui.less",
                    "dist/css/toastr.css": "src/toastr/toastr.less",
                    "dist/css/timeline.css": "src/less/timeline.less"
                }
            },
            custom:{
                options: {
                    compress: false,
                    yuicompress: false
                },
                files: {
                    "dist/css/eui-custom.css": "src/less/eui-custom.less",
                }
            },
            dist: {
                options: {
                    compress: true,
                    yuicompress: false
                },
                files: {
                }
            },
            widget:{
                options: {
                    compress: false,
                    yuicompress: false
                },
                files: {
                    "dist/css/eui-icon.css": "src/less/icon.less",
                }
            },
            reset:{
                options: {
                    compress: false,
                    yuicompress: false
                },
                files: {
                    "dist/css/eui-reset.css": "src/less/eui-reset.less",
                }
            },
        },
        clean: {
            dist: 'dist/js',
            docs: 'docs/dist'
        },
    });


    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-less');

    // 测试
    grunt.registerTask('default',['less:default', 'cssmin', 'concat:test', 'uglify:test']);
    // 发布
    grunt.registerTask('dist', ['less:default', 'concat:dist', 'uglify:dist', 'uglify:dist2']);
    // 组件
    grunt.registerTask('widget', ['less:widget', 'cssmin:widget']);
    // custom
    grunt.registerTask('custom', ['less:custom', 'cssmin:custom', 'concat:custom', 'uglify:custom',]);
    // reset
    grunt.registerTask('reset',['less:reset', 'cssmin:reset']);
    //grunt.registerTask('clean', ['clean:dist']);
};
