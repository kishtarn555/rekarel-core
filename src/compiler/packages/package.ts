import type { IRSemiSimpleInstruction } from "../InterRep/IRInstruction";

/**
 * This packages work directly with the compiler
 */
export type replaceMap = Map<string, IRSemiSimpleInstruction[]>

export interface CompilerPackage {
    numberVariables:replaceMap
    booleanVariables:replaceMap
    functions: replaceMap
}


export function UnitePackages(packages:CompilerPackage[]): CompilerPackage {
    const booleans:replaceMap = new Map();
    const numbers:replaceMap = new Map();
    const funcs:replaceMap = new Map();

    for (const pack of packages) {
        pack.numberVariables.forEach((value, key,_) => {
            numbers.set(key, value);
        });
        pack.booleanVariables.forEach((value, key,_) => {
            booleans.set(key, value);
        });
        pack.functions.forEach((value, key,_) => {
            funcs.set(key, value);
        });
    }

    return {
        booleanVariables:booleans,
        numberVariables: numbers,
        functions: funcs,
    };
}