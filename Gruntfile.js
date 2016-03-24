module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                stripBanners: true,
                banner: '/*! <%=pkg.name%>-<%=pkg.version%>.js <%=grunt.template.today("yyyy-mm-dd") %>*/\n'
            },
            build: {
                src: 'src/test.js',
                dest: 'build/<%=pkg.name%>-<%=pkg.version%>.min.js'
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: [
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
                    'dist/css/eui.css': [
                        "src/base.css",
                        "src/box/box.css",
                        "src/totop/totop.css"
                    ],
                    'dist/css/bootstrap.min.css': [
                        "dist/css/bootstrap.css"
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
            task1:{
                options: {
                    compress: false,
                    yuicompress: false
                },
                files: {
                    "dist/css/bootstrap.css": "less/bootstrap.less",
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
    grunt.registerTask('lessc',['less:task1', 'cssmin']);
};
