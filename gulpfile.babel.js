'use strict';

import gulp     from 'gulp';
import gutil    from 'gulp-util';
import connect  from 'gulp-connect';
import concat   from 'gulp-concat';
import sourcemaps from 'gulp-sourcemaps';
import sass     from 'gulp-sass';
import babel    from 'gulp-babel';
import wait     from 'gulp-wait';
import del      from 'del';

// 기본 폴더 경로 설정
const DIR = {
    SRC: 'src',
    PUB: 'public',
};

// 작업 폴더 경로 및 설정
const SRC = {
    JS: DIR.SRC + '/js/*.js',
    CSS: DIR.SRC + '/css/*.css',
    SCSS: DIR.SRC + '/scss/**/*.scss',
	HTML: DIR.SRC + '/**/*.html',
	IMAGE: DIR.SRC + '/img/**/*',
};

// 작업후 최종 변환 폴더 경로
const DEST = {
    JS: DIR.PUB + '/assets/js',
	CSS: DIR.PUB + '/assets/css',
	IMAGE: DIR.PUB + '/assets/img',
    HTML: DIR.PUB,
};

// html
gulp.task('html', () => gulp.src(SRC.HTML)
	.pipe(gulp.dest(DEST.HTML))
);

// image
gulp.task('image', () => gulp.src(SRC.IMAGE)
	.pipe(gulp.dest(DEST.IMAGE))
);

// scss 변환
gulp.task('sass', () => {
        return gulp
        .src(SRC.SCSS)
        .pipe(wait(500))
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'expanded'
        }))
        .pipe(sourcemaps.write({includeContent: false}))
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write('.'))
        // .pipe(concat('master.css'))
        .pipe(gulp.dest(DEST.CSS))
    }
);

// js
gulp.task('js', () => gulp.src(SRC.JS)
    .pipe(babel())
    // .pipe(concat('master.js'))
    .pipe(gulp.dest(DEST.JS))
);

// 생성되는 폴더 정리
gulp.task('clean', () => del.sync([DIR.PUB]));

// 서버 생성후 테스트
gulp.task('connect', function(){
    connect.server({
        root: DIR.PUB,
        livereload: true,
		port: 4040,
		debug: true,
    });
});

//livereload
gulp.task('livereload', function() {
	gulp.src(allSources).pipe(connect.reload());
});

const allSources = DIR.SRC + '/**/**/*';

// watch
gulp.task('watch', () => {
    let watcher = {
        sass  : gulp.watch(SRC.SCSS, ['sass']),
		html  : gulp.watch(SRC.HTML, ['html']),
        image : gulp.watch(SRC.IMAGE, ['image']),
        js    : gulp.watch(SRC.JS, ['js']),
    };
 
    let notify = (event) => {
		gutil.log('File', gutil.colors.yellow(event.path), 'was', gutil.colors.magenta(event.type));
    };

    for(let key in watcher) {
        watcher[key].on('change', notify);
	}

    return gutil.log('Watcher is running');
});

gulp.watch(allSources, ['livereload']);

// front end 용 변환 묶음
gulp.task('frontEnd', () => gulp.start('clean','sass'));

gulp.task('start', ['frontEnd' ,'watch', 'connect'], () => {
    return gutil.log('Gulp Default is running');
});

gulp.task('default', ['clean', 'watch', 'sass', 'js', 'image', 'livereload', 'connect'], () => {
	return gutil.log('Gulp is running');
});