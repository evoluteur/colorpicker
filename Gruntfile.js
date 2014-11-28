module.exports = function (grunt) {

    grunt.initConfig({

        // *************************************************************************************
        //      CONFIG OPTIONS
        // *************************************************************************************

        pkg: grunt.file.readJSON('package.json'),
        banner :  '/*\n   <%= pkg.name %> <%= pkg.version %>\n   <%= pkg.copyright %>\n   <%= pkg.homepage %>\n*/\n',

        // *************************************************************************************
        //      JSHINT options
        // *************************************************************************************
        jshint: {
            all: [
                'Gruntfile.js',
                'package.json',
                'js/evol.colorpicker.js'
            ]
        },

        // *************************************************************************************
        //      UGLIFY options
        // *************************************************************************************
        uglify: {
            options: {
                banner: '<%= banner %>',
                mangle: true
            },
            js: {
                files: { 
                'js/evol.colorpicker.min.js': ['js/evol.colorpicker.js']
                }
            }
        },

        // *************************************************************************************
        //      LESS
        // *************************************************************************************
        less: {
            options: {
            },
            dev: {
                files: {
                    "css/evol.colorpicker.css": "less/evol.colorpicker.less",
                    "css/demo.css": "less/demo.less"
                }
            },
            prod: {
                options: {
                    compress: true
                },
                files: {
                    "css/evol.colorpicker.min.css": "less/evol.colorpicker.less"
                }
            }
        }

    });

// Load the plugin that provides the tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');

// Custom tasks

    // *************************************************************************************
    //      BUILD TASKS : dev prod
    // *************************************************************************************
    // Default task(s).
    grunt.registerTask('default', ['dev']);

    // Dev only task(s).
    grunt.registerTask('dev', ['jshint', 'less:dev']);

    // Prod only task(s).
    grunt.registerTask('prod', ['jshint', 'uglify', 'less']);

};

