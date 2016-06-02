var gulp   = require('gulp');

// gulp-rsync - https://www.npmjs.com/package/gulp-rsync
var rsync = require('gulp-rsync');


gulp.task('deploy', ['default'], function(cb) {
 // Dirs and Files to sync
  rsyncPaths = ["./dist"];

  // Default options for rsync
  rsyncConf = {
    progress: true,
    incremental: true,
    relative: true,
    emptyDirectories: true,
    recursive: true,
    clean: true,
    exclude: [],
    hostname: 'bauerj.eu',
    username: 'bauerj',
    destination: '/var/www/ovpn-stats'
  };

  // Use gulp-rsync to sync the files
  return gulp.src(rsyncPaths)
  .pipe(rsync(rsyncConf));
});
