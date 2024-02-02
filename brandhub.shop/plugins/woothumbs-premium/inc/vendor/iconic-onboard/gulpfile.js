var gulp = require('gulp');
replace = require( 'gulp-string-replace' );
const CHANGE_TO = "Class_Prefix_";

/* Change this */
//const CHANGE_FROM = "Iconic_WSSV_";
const CHANGE_FROM = "Iconic_WooThumbs_";


gulp.task( 'undo_deps', async function() { 
    return gulp.src( "**/*.php" )
            .pipe( replace(  new RegExp( CHANGE_FROM , 'g' ) , CHANGE_TO ) )
            .pipe( gulp.dest( "." ) );
});

