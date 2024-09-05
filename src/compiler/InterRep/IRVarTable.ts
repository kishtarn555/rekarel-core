import { IRFunction, IRInstruction, IRVar } from "./IRInstruction"

export type FunctionData = { 
    location: number, 
    arguments: string[],
    returnType: string
};

export type VarData = {
    instructions: IRInstruction[]
    dataType: string
}

type FunctionTable = Map<string, FunctionData>
type VariableTable = Map<string, VarData>

/**
 * Represents a table with all definition data
 */
export class DefinitionTable {    
    private functions: FunctionTable
    private variables: VariableTable
    private variablesCanBeFunctions: boolean

    constructor(variablesCanBeFunctions: boolean) {
        this.functions = new Map();
        this.variables = new Map();
        this.variablesCanBeFunctions = variablesCanBeFunctions;
    }


    getType(identifier: string) {
        if (this.variables.has(identifier)) {
            return this.variables.get(identifier).dataType;
        }
        if (this.functions.has(identifier)) {
            return this.functions.get(identifier).returnType;
        }
        return "undefined";        
    }


    registerFunction(func: IRFunction) {
        this.functions.set(func.name, {
            arguments: func.params,
            location: 0,
            returnType: func.returnType
        })
    }

    
    hasFunction(name:string) {
        return this.functions.has(name);
    }

    getFunction(name: string) {
        return this.functions.get(name);
    }

    setFunctionLoc(target:string, location: number) {
        this.functions.get(target).location = location;
    }

    registerVar(name:string, val:VarData) {
        this.variables.set(name, val);
    }

    hasVar(name:string) {
        return this.variables.has(name);
    }

    getVar(name: string) {
        return this.variables.get(name);
    }

}