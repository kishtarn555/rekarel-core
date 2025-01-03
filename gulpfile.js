import gulp from "gulp"
import replace from 'gulp-replace'
import insert  from 'gulp-insert'



gulp.task('process-jison-java', ()=> {

    const path = 'src/kareljava.js'
    return gulp.src(path) 
        .pipe(insert.append('\nfunction javaParser() {\n    return kareljava.parse.apply(kareljava, arguments);\n}\nexport {kareljava, javaParser }\n'))
        .pipe(replace("_token_stack:", '// _token_stack:'))
        .pipe(replace("loc: yyloc,", 'loc: lexer.yylloc, // Implement fix: https://github.com/zaach/jison/pull/356'))
        .pipe(gulp.dest('src/')); 

})


gulp.task('process-jison-pascal', ()=> {

    const path = 'src/karelpascal.js'
    return gulp.src(path) 
        .pipe(insert.append('\nfunction pascalParser () {\n    return karelpascal.parse.apply(karelpascal, arguments);\n}\nexport {karelpascal, pascalParser}'))
        .pipe(replace("_token_stack:", '// _token_stack:'))
        .pipe(replace("loc: yyloc,", 'loc: lexer.yylloc, // Implement fix: https://github.com/zaach/jison/pull/356'))
        .pipe(gulp.dest('src/')); 

})


gulp.task('copy-dts', () => {
    return gulp.src('src/**/*.d.ts') 
      .pipe(gulp.dest('dist/built')); 
  });

 gulp.task('default', gulp.series('process-jison-java', 'process-jison-pascal'));
