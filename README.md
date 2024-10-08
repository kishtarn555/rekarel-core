![NPM Version](https://img.shields.io/npm/v/%40rekarel%2Fcore)


ReKarel/Core is a typescript package that enables the usage of ReKarel. You may use it to include ReKarel into an IDE, package, or even create your own ReKarel compatible language.

This library includes a Compiler for both ReKarel Java and ReKarel Pascal, and a interpreter (virtual machine) to run the code. As well as a compilers


The library can be seen in two parts. The compiler and the Virtual Machine.

# Compiler

First let's check the compiler:

![ReKarelCore drawio](https://github.com/user-attachments/assets/e1b94421-1cdb-405f-babf-8bede370223f)



ReKarel works on the Karel Virtual Machine, which can run a small instruction set to perform the instructions.



## compile(code, exportDebug?)

This function takes either a java source code or a pascal source code and generates the program for the VM, it may also generate extra data about the program.

Arguments
* `code`: string
* `exportDebug`: boolean - (optional, default false). If false, DebugData will be null.

Returns
* [program, DebugData] - A pair containing both the array of instructions for the VM and extra data about the program, useful for debuging it.

Throws
* If the source code is not valid, it throws an compiler error

### Example 

```javascript
compile("class program { program() { move(); }}", false)
```

```javascript
[
 [["LINE",0,28],["WORLDWALLS"],["ORIENTATION"],["MASK"],["AND"],["NOT"],["EZ","WALL"],["FORWARD"],["LINE",0,0],["HALT"]],
 null
]

```

## detectLanguage(code)

This functions detects the language using the first token ("iniciar-programa"/"usa" or "class"/"import")

Arguments
* `code`: string - The source code to analyze 

Returns
* "java" | "pascal" | "unknown" - A string with the identified language, if it cannot identify a valid syntax, it returns "unknown"

### Example

```javascript
detectLanguage("class") // returns 'java'
detectLanguage("inicia-ejecucion") // returns 'pascal'
detectLanguage("Random string") // returns 'unknown'
detectLanguage("/* comment */ import") // returns 'java'
detectLanguage("{ comment } usa") // returns 'pascal'
```

## javaCompiler(code, exportDebug?)

This function takes a java source code and generates the program for the VM, it may also generate extra data about the program.

Arguments
* `code`: string
* `exportDebug`: boolean - (optional, default false). If false, DebugData will be null.

Returns
* [program, DebugData] - A pair containing both the array of instructions for the VM and extra data about the program, useful for debuging it.

Throws
* If the source code is not valid, it throws an compiler error

## pascalCompiler(code, exportDebug?)

This function takes a pascal source code and generates the program for the VM, it may also generate extra data about the program.

Arguments
* `code`: string
* `exportDebug`: boolean - (optional, default false). If false, DebugData will be null.

Returns
* [program, DebugData] - A pair containing both the array of instructions for the VM and extra data about the program, useful for debuging it.

Throws
* If the source code is not valid, it throws an compiler error

## transpileCode(code, target)

Takes a code and transpile it into the target language

> *Notice*: This does not perform a thorough check in the grammar of the source code. So undefined functions and such will be passed as is.

Arguments
* code: string - The source code to transpile
* target: "java"|"pascal" - The target language to transpile to

Returns
* A string thats the resulting source code

Throws: If the code is not valid

### Example

```javascript
transpileCode("class program { program() { move(); } }", "pascal")
```

Returns the following

```
iniciar-programa

	inicia-ejecucion
		avanza;
	termina-ejecucion   
finalizar-programa
```
## generateOpcodesFromIR(data, exportDebug)

This function takes an IRObject and returns the program for the VM and extra data

Arguments
* data: IRObject -  An Abstract syntax tree
* exportDebug: boolean - a flag, if false the debugData will be null, otherwise it will be emitted.

Returns:
* [program, DebugData] - A pair containing both the array of instructions for the VM and extra data about the program, useful for debuging it.

Throws: If the AST is not valid

## generateJavaFromIR(data)

This function takes an IRObject and returns a java source code. It does not check grammar rules.

Arguments
* data: IRObject -  An Abstract syntax tree

Returns
* A string containing the java source code

## generatePascalFromIR(data)

This function takes an IRObject and returns a pascal source code. It does not check grammar rules.

Arguments
* data: IRObject -  An Abstract syntax tree

Returns
* A string containing the java source code

# Virtual Machine 

ReKarel/core also includes object to process a Karel World and it's runtime (VM)

It contains the following

![UML drawio](https://github.com/user-attachments/assets/08bdbf88-28b4-4b72-933f-a9f2d431e319)


## World

Represents a Karel World, it keeps track of both the starting state and the current state. Contains information such as beepers, walls, Karel position, etc.

More information about this class can be found [here](https://github.com/kishtarn555/rekarel-core/wiki/World)

### Example

```javascript
let world = new World(30, 40) //Create a world of 30x40
world.setBagBuzzers(-1) //Set infinite beepers in the bag
world.move(3, 4) // Move Karel to row 3, column 4.
console.log(world.output()) // Generate the output XML
```

## Runtime
 A class that holds the state of computation and executes opcodes.

The Karel Virtual Machine is a simple, stack-based virtual machine with a small number of opcodes, based loosely on the Java Virtual Machine.

More information can be found [here](https://github.com/kishtarn555/rekarel-core/wiki/Runtime).

### Example

```javascript
let world = new World(30, 40) //Create a world of 30x40

//Let's then run completely a program:

let runtime = world.runtime //A world generates a runtime automatically, it is recommended to always use a world runtime.
runtime.load( [["LINE",0,28],["WORLDWALLS"],["ORIENTATION"],["MASK"],["AND"],["NOT"],["EZ","WALL"],["FORWARD"],["LINE",0,0],["HALT"]] ) //Load the program
runtime.start() // Fire the start event
while (runtime.state.running) {
  runtime.step() //Advance the program
}

```
