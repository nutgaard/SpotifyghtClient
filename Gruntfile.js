/*global module:false*/
module.exports = function (grunt) {

    // Project configuration.
    var config = require('./config.json');

    console.log('config', config);

    grunt.initConfig({
        // Task configuration.
        jshint: {
            gruntfile: {
                src: 'Gruntfile.js'
            },
            dev: {
                src: [config.dev.resources + '/**/*.js']
            }
        },
        clean: {
            prod: {
                src: [config.prod.resources + '/**/*']
            },
            postprod: {
                src: [config.prod.resources + '/**/*.{js,css}', '!' + config.prod.resources + '/**/optimized.*.{js,css}']
            }
        },
        copy: {
            prod: {
                expand: true,
                cwd: 'app/app/',
                src: ['**/**.*', '!**/**.scss'],
                dest: 'app/www/'
            }
        },
        filerev: {
            options: {
                encoding: 'utf8',
                algorithm: 'sha512',
                length: 128
            },
            prod: {
                src: config.prod.resources + '**/optimized.{js,css}'
            }
        },
        compass: {
            dev: {
                options: {
                    sassDir: config.dev.resources+'sass',
                    cssDir: config.dev.resources+'css'
                }
            }
        },
        useminPrepare: {
            html: config.prod.resources + 'index.html',
            options: {
                dest: config.prod.resources
            }
        },
        usemin: {
            html: config.prod.resources + 'index.html',
            options: {
                blockReplacements: {
                    js: function (block) {
                        var name = config.prod.resources+block.dest;
                        if (typeof grunt.filerev.summary[name] === 'undefined'){
                            return '';
                        }
                        var path = grunt.filerev.summary[name].split('/').splice(2).join('/');
                        return '<script type="text/javascript" src="' + path + '"></script>';
                    },
                    css: function (block) {
                        var name = config.prod.resources+block.dest;
                        if (typeof grunt.filerev.summary[name] === 'undefined'){
                            return '';
                        }
                        var path = grunt.filerev.summary[name].split('/').splice(2).join('/');
                        return '<link rel="stylesheet" type="text/css" href="' + path + '">';
                    }
                }
            }
        },
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            js: {
                files: '<%= jshint.dev.src %>',
                tasks: ['jshint:dev']
            },
            sass: {
                files: '<%= compass.dev.options.sassDir %>'+'/**/*.scss',
                tasks: ['compass']
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-filerev');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task.
    grunt.registerTask('default', ['jshint:dev', 'compass', 'watch']);
    grunt.registerTask('dev', ['default']);
    grunt.registerTask('prod', ['clean:prod', 'copy:prod', 'compass', 'useminPrepare', 'concat:generated', 'cssmin:generated', 'uglify:generated', 'filerev:prod', 'usemin', 'clean:postprod']);

};
