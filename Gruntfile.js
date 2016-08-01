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
        },
        concat: {
            options: {
                separator: ';',
                stripBanners: true,
                banner: '/*! hello - v1.2.3 - 2014-2-4 */'
            },
            test: {
                src: [
                    'src/js/alert.js',
                    'src/js/button.js',
                    'src/js/slider.js',
                    'src/js/collapse.js',
                    'src/js/dropdown.js',
                    'src/js/modal.js',
                    'src/js/tooltip.js',
                    'src/js/popover.js',
                    'src/js/scrollspy.js',
                    'src/js/tab.js',
                    'src/js/transition.js',
                    // eUI 组件
                    'src/box/box.js',
                    'src/totop/totop.js',
                    //'src/hover-dropdown.js'
                ],
                dest: 'dist/js/eui.js'
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
            }
        },
        cssmin: {
            options: {
                keepSpecialComments: 0
            },
            compress: {
                files: {
                    'dist/css/eui.min.css': [
                        "dist/css/eui.css",
                        "src/box/box.css",
                        "src/totop/totop.css"
                    ]
                    /*
                    'dist/css/eui.min.css': [

                    ]
                    */
                }
            },
            simple: {
                files: {
                    'dist/css/simple/eui.min.css': [
                        "dist/css/simple/eui.css",
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
                    "dist/css/eui.css": "src/less/bootstrap.less",
                    "dist/css/toastr.css": "src/toastr/toastr.less",
                    "dist/css/timeline.css": "src/less/timeline.less"
                }
            },
            simple:{
                options: {
                    compress: false,
                    yuicompress: false
                },
                files: {
                    "dist/css/simple/eui.css": "src/less/bootstrap-simple.less",
                }
            },
            dist: {
                options: {
                    compress: true,
                    yuicompress: false
                },
                files: {
                    "dist/css/glyphicons.min.css": "src/less/glyphicons.less",
                }
            }
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
    grunt.registerTask('dist', ['less:dist', 'concat:dist', 'uglify:dist', 'uglify:dist2']);

    // 精简
    grunt.registerTask('simple', ['less:simple', 'cssmin:simple']);
    //grunt.registerTask('clean', ['clean:dist']);
};
