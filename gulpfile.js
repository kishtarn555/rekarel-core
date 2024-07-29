import gulp from "gulp"
import replace from 'gulp-replace'
import insert  from 'gulp-insert'



gulp.task('process-jison-pascal', ()=> {

    const path = 'js/kareljava.js'
    return gulp.src(path) 
        .pipe(insert.append('\nfunction javaParser() {\n    return kareljava.parse.apply(kareljava, arguments);\n}\nexport {kareljava, javaParser }\n'))
        .pipe(replace("_token_stack:", '// _token_stack:'))
        .pipe(replace("loc: yyloc,", 'loc: lexer.yylloc, // Implement fix: https://github.com/zaach/jison/pull/356'))
        .pipe(gulp.dest('js/')); 

})


gulp.task('process-jison-pascal', ()=> {

    const path = 'js/karelpascal.js'
    return gulp.src(path) 
        .pipe(insert.append('\nfunction pascalParser () {\n    return karelpascal.parse.apply(karelpascal, arguments);\n}\nexport {karelpascal, pascalParser}'))
        .pipe(replace("_token_stack:", '// _token_stack:'))
        .pipe(replace("loc: yyloc,", 'loc: lexer.yylloc, // Implement fix: https://github.com/zaach/jison/pull/356'))
        .pipe(gulp.dest('js/')); 

})


gulp.task('process-jison-java2pascal', ()=> {

    const path = 'js/java2pascal.js'
    return gulp.src(path) 
        .pipe(insert.append('\nfunction java2pascalParser () {\n    return java2pascal.parse.apply(java2pascal, arguments);\n}\nexport {java2pascal, java2pascalParser}'))
        .pipe(replace("_token_stack:", '// _token_stack:'))
        .pipe(replace("loc: yyloc,", 'loc: lexer.yylloc, // Implement fix: https://github.com/zaach/jison/pull/356'))
        .pipe(gulp.dest('js/')); 

})


gulp.task('process-jison-pascal2java', ()=> {

    const path = 'js/pascal2java.js'
    return gulp.src(path) 
        .pipe(insert.append('\nfunction pascal2javaParser () {\n    return pascal2java.parse.apply(pascal2java, arguments);\n}\nexport {pascal2java, pascal2javaParser}'))
        .pipe(replace("_token_stack:", '// _token_stack:'))
        .pipe(replace("loc: yyloc,", 'loc: lexer.yylloc, // Implement fix: https://github.com/zaach/jison/pull/356'))
        .pipe(gulp.dest('js/')); 

})

 gulp.task('default', gulp.series('process-jison-pascal2java', 'process-jison-java2pascal', 'process-jison-pascal', 'process-jison-pascal'));
