import { CompilerPackage, replaceMap } from "./package";
const javaNumbers: replaceMap = new Map();
const javaBooleans: replaceMap = new Map();
javaNumbers.set("beeperBag", [["BAGBUZZERS"]]);
javaNumbers.set("floorBeepers", [["WORLDBUZZERS"]]);
javaNumbers.set("row", [["ROW"]]);
javaNumbers.set("column", [["COLUMN"]]);
javaBooleans.set("true", [["LOAD", 1]]);
javaBooleans.set("false", [["LOAD", 0]]);

export const rekarelGlobalsJava: CompilerPackage = {
    booleanVariables: javaBooleans,
    numberVariables: javaNumbers
};


const pascalNumbers: replaceMap = new Map();
const pascalBooleans: replaceMap = new Map();
pascalNumbers.set("mochila", [["BAGBUZZERS"]]);
pascalNumbers.set("zumbadores-del-piso", [["WORLDBUZZERS"]]);
pascalNumbers.set("columna", [["COLUMN"]]);
pascalNumbers.set("fila", [["ROW"]]);
pascalBooleans.set("verdadero", [["LOAD", 1]]);
pascalBooleans.set("falso", [["LOAD", 0]]);

export const rekarelGlobalsPascal: CompilerPackage = {
    booleanVariables: pascalBooleans,
    numberVariables: pascalNumbers
};