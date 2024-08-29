import { OpCode } from "../opcodes"

/**
 * This packages work directly with the compiler
 */
export type replaceMap = Map<string, OpCode[]>

export interface CompilerPackage {
    numberVariables:replaceMap
    booleanVariables:replaceMap
}


export function UnitePackages(packages:CompilerPackage[]): CompilerPackage {
    const booleans:replaceMap = new Map();
    const numbers:replaceMap = new Map();

    for (const pack of packages) {
        pack.numberVariables.forEach((value, key,_) => {
            numbers.set(key, value);
        });
        pack.booleanVariables.forEach((value, key,_) => {
            booleans.set(key, value);
        });
    }

    return {
        booleanVariables:booleans,
        numberVariables: numbers
    };
}