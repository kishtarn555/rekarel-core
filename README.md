This is the core of the Karel language. It contains the compiler, transpiler and the Karel Interpreter

# How Karel works

A parser is implemented in jison, this parser converts Karel pascal and Karel java into an intermediate language which is then run by javascript.


# How to build the project


If you're using a fresh clone, then you'll need to run the following commands

## Build the parsers from Jison to JS

```
npm run jison_all
```

If you modify a .jison file, you need to run either the previous command, or the specific one from the following list:

```
npm run jison_java
```

```
npm run jison_pascal
```

```
npm run jison_java2pascal
```

```
npm run jison_pascal2java
```

## Builds dist folder, compiling and bundling TS files

```
npm run build
```