import { CompilerPackage, replaceMap } from "./package";
const javaNumbers: replaceMap = new Map();
javaNumbers.set("beeperBag", [["BAGBUZZERS"]]);
javaNumbers.set("floor", [["WORLDBUZZERS"]]);

export const rekarelGlobalsJava: CompilerPackage = {
    booleanVariables: new Map(),
    numberVariables: javaNumbers
};


const pascalNumbers: replaceMap = new Map();
pascalNumbers.set("mochila", [["BAGBUZZERS"]]);
pascalNumbers.set("piso", [["WORLDBUZZERS"]]);

export const rekarelGlobalsPascal: CompilerPackage = {
    booleanVariables: new Map(),
    numberVariables: pascalNumbers
};