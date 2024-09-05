This is the core of the Karel language. It contains the compiler, transpiler and the Karel Interpreter

# How Karel works

A parser is implemented in jison, this parser converts Karel pascal and Karel java into an intermediate language which is then run by javascript.


# How to build the project


If you're using a fresh clone, then you'll need to run the following commands

## Build the parsers from Jison to JS

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

These commands need to be re-run if you modifiy the .jison files.

## Builds dist folder, compiling and bundling TS files

```
npm run build
```