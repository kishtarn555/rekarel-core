import { CompilerPackage, replaceMap } from "./package";
const javaNumbers: replaceMap = new Map();
const javaBooleans: replaceMap = new Map();
javaNumbers.set("beepersInBag", [["BAGBUZZERS"]]);
javaNumbers.set("beepersOnFloor", [["WORLDBUZZERS"]]);
javaNumbers.set("currentRow", [["ROW"]]);
javaNumbers.set("currentColumn", [["COLUMN"]]);
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
pascalNumbers.set("columna-actual", [["COLUMN"]]);
pascalNumbers.set("fila-actual", [["ROW"]]);
pascalBooleans.set("verdadero", [["LOAD", 1]]);
pascalBooleans.set("falso", [["LOAD", 0]]);

export const rekarelGlobalsPascal: CompilerPackage = {
    booleanVariables: pascalBooleans,
    numberVariables: pascalNumbers
};