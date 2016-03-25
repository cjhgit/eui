module.exports = function (grunt) {

    grunt.initConfig({
        // 元数据
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*!\n' +
                 ' * Bootstrap v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
                 ' * Copyright 2011-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
                 ' * Licensed under the <%= pkg.license %> license\n' +
                 ' */\n',

        // 任务配置
        uglify: {
            options: {
                stripBanners: true,
                banner: '/*! <%=pkg.name%>-<%=pkg.version%>.js <%=grunt.template.today("yyyy-mm-dd") %>*/\n'
            },
            build: {
                src: 'dist/js/eui.js',
                dest: 'dist/js/eui.min.js'
            }
        },
        concat: {
            options: {
                separator: ';',
                stripBanners: true,
                banner: '/*! hello - v1.2.3 - 2014-2-4 */'
            },
            dist: {
                src: [
                    'src/js/affix.js',
                    'src/js/alert.js',
                    'src/js/button.js',
                    'src/js/carousel.js',
                    'src/js/collapse.js',
                    'src/js/dropdown.js',
                    'src/js/modal.js',
                    'src/js/tooltip.js',
                    'src/js/popover.js',
                    'src/js/scrollspy.js',
                    'src/js/tab.js',
                    'src/js/transition.js',
                    'src/base.js',
                    'src/box/box.js',
                    'src/totop/totop.js',
                    'src/hover-dropdown.js'
                ],
                dest: 'dist/js/eui.js'
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
                        "src/base.css",
                        "src/box/box.css",
                        "src/totop/totop.css"
                    ]
                    /*
                    'dist/css/eui.min.css': [

                    ]
                    */
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
            task1:{
                options: {
                    compress: false,
                    yuicompress: false
                },
                files: {
                    "dist/css/eui.css": "src/less/bootstrap.less",
                    "src/index.css": "src/index.less"
                }
            }

        }
    });


    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-less');

    grunt.registerTask('default', ['concat', 'uglify', 'cssmin']);
    grunt.registerTask('lessc',['less:task1', 'cssmin', 'concat', 'uglify']);
};
