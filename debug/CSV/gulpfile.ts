let gulp = require('gulp')
import * as loglevel from 'loglevel'
const log = loglevel.getLogger('gulpfile')
log.setLevel((process.env.DEBUG_LEVEL || 'warn') as log.LogLevelDesc)
import * as rename from 'gulp-rename'
const errorHandler = require('gulp-error-handle'); // handle all errors in one handler, but still stop the stream if there are errors

import * as vinylPaths from 'vinyl-paths';
import * as del from 'del';

const csvtojson = require('gulp-csvtojson') // uses old (1.0) version of csvtojson, which doesn't appear to be supported/documented
// var aCsvToJson = require('gulp-advanced-csv-to-json'); // doesn't support streams
// var csv2json = require('gulp-csv2json'); // doesn't support streams
// var csv2json = require('gulp-csv-to-json'); // doesn't support streams

const pkginfo = require('pkginfo')(module); // project package.json info into module.exports
const PLUGIN_NAME = module.exports.name;

// control the plugin's logging level separately from this 'gulpfile' logging
//const pluginLog = loglevel.getLogger(PLUGIN_NAME)
//pluginLog.setLevel('debug')


// allCaps makes sure all string properties on the top level of lineObj have values that are all caps
const allCaps = (lineObj: object): object => {
  log.debug(lineObj)
  for (let propName in lineObj) {
    let obj = (<any>lineObj)
    if (typeof (obj[propName]) == "string")
      obj[propName] = obj[propName].toUpperCase()
  }
  
  // for testing: cause an error
  // let err; 
  // let zz = (err as any).nothing;

  return lineObj
}


function demonstrateHandlelines(callback: any) {
  log.info('gulp starting for ' + PLUGIN_NAME)
  return gulp.src('../../testdata/csv/*.csv',{buffer:true})
      .pipe(errorHandler(function(err:any) {
        log.error('whoops: ' + err)
        callback(err)
      }))
      .pipe(csvtojson({ toArrayString: true }))
      // .pipe(aCsvToJson({
      //   tabSize : 4
      // }))
      // .pipe(csv2json({}))
      // .pipe(csv2json({}))
      .pipe(rename({extname: '.json'}))     
      .pipe(gulp.dest('../../testdata/csv/processed'))
      // .pipe(vinylPaths((path) => {
      //   // experimenting with deleting files, per https://github.com/gulpjs/gulp/blob/master/docs/recipes/delete-files-folder.md.
      //   // This actually deletes the NEW files, not the originals! Try gulp-revert-path
      //   return del(path, {force:true})
      // }))
      .on('end', function () {
        log.info('end')
        callback()
      })
    }



    function test(callback: any) {
      log.info('This seems to run only after a successful run of demonstrateHandlelines! Do deletions here?')
      callback()
    }

exports.default = gulp.series(demonstrateHandlelines, test)