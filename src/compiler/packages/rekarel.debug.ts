import { CompilerPackage, replaceMap } from "./package";
const javaNumbers: replaceMap = new Map();
const javaBooleans: replaceMap = new Map();
const javaFunctions: replaceMap = new Map();
javaFunctions.set("snapshot", [["SNAPSHOT"]]);

export const rekarelDebugJava: CompilerPackage = {
    booleanVariables: javaBooleans,
    numberVariables: javaNumbers,
    functions: javaFunctions,
};


const pascalNumbers: replaceMap = new Map();
const pascalBooleans: replaceMap = new Map();
const pascalFunctions: replaceMap = new Map();
pascalFunctions.set("captura-estado", [["SNAPSHOT"]]);


export const rekarelDebugPascal: CompilerPackage = {
    booleanVariables: pascalBooleans,
    numberVariables: pascalNumbers,
    functions:pascalFunctions,
};