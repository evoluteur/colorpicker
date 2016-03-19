
/*
           _                  _      _             
  ___ ___ | | ___  _ __ _ __ (_) ___| | _____ _ __ 
 / __/ _ \| |/ _ \| '__| '_ \| |/ __| |/ / _ \ '__|
| (_| (_) | | (_) | |  | |_) | | (__|   <  __/ |   
 \___\___/|_|\___/|_|  | .__/|_|\___|_|\_\___|_|   
                       |_|                         
                                                   
*/

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
                'js/evol-colorpicker.js'
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
                    'js/evol-colorpicker.min.js': ['js/evol-colorpicker.js']
                }
            }
        },

        // *************************************************************************************
        //      LESS
        // *************************************************************************************
        less: {
            dev: {
                options: {
                    banner: '<%= banner %>'
                },
                files: {
                    "css/evol-colorpicker.css": "less/evol-colorpicker.less",
                    "css/demo.css": "less/demo.less"
                }
            },
            prod: {
                options: {
                    banner: '<%= banner %>',
                    compress: true
                },
                files: {
                    "css/evol-colorpicker.min.css": "less/evol-colorpicker.less"
                }
            }
        }

    });

// Load the plugin that provides the tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');

// Custom tasks

    grunt.registerTask('header', 'evol-colorpicker version', function(arg1) {
        var pkg=grunt.file.readJSON('package.json');
        console.log(
            (new Date()).toString() + '\n' + 
'            _                  _      _\n'+
'   ___ ___ | | ___  _ __ _ __ (_) ___| | _____ _ __\n'+
'  / __/ _ \\| |/ _ \\| \'__| \'_ \\| |/ __| |/ / _ \\ \'__|\n'+
' | (_| (_) | | (_) | |  | |_) | | (__|   <  __/ |\n'+
'  \\___\\___/|_|\\___/|_|  | .__/|_|\\___|_|\\_\\___|_|   \n'+
'                        |_|     '+ 
            arg1 + ' '+ pkg.version
        );
    });
    // *************************************************************************************
    //      BUILD TASKS : dev prod
    // *************************************************************************************
    // Default task(s).
    grunt.registerTask('default', ['prod']);

    // Dev only task(s).
    grunt.registerTask('dev', ['header:dev', 'jshint', 'less:dev']);

    // Prod task(s).
    grunt.registerTask('prod', ['header:prod', 'jshint', 'uglify', 'less']);

};

