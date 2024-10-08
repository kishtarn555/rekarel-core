import { IRFunction, IRInstruction, IRParam, IRSemiSimpleInstruction, IRVar } from "./IRInstruction"

/**
 * Data of a function used by the definition table
 */
export type FunctionData = { 
    /**
     * Location where the function starts in the program
     */
    location: number, 
    /**
     * List of the parameters it takes
     */
    arguments: IRParam[],
    /**
     * The data return type
     */
    returnType: string
};

/**
 * Data of a variable used by the definition table
 */
export type VarData = {
    /**
     * The instructions to which a variable parses to
     * 
     * @example
     * beeperBag compiles to ['BAGBUZZERS']
     */
    instructions: IRSemiSimpleInstruction[]
    /**
     * The data type of the variable
     */
    dataType: string
}

type FunctionTable = Map<string, FunctionData>
type VariableTable = Map<string, VarData>

/**
 * Represents a table with all the definitions. It maps identifiers to functions and variables
 */
export class DefinitionTable {    
    private functions: FunctionTable
    private variables: VariableTable
    private variablesCanBeFunctions: boolean
    private tagCounter: number

    constructor(variablesCanBeFunctions: boolean) {
        this.functions = new Map();
        this.variables = new Map();
        this.variablesCanBeFunctions = variablesCanBeFunctions;
        this.tagCounter = 0;
    }

    /**
     * Checks the dataType that a variable is or a function returns.
     * @param identifier The identifier
     * @returns The data type the identifier is linked to
     * 
     * @public
     */
    getType(identifier: string) {
        if (this.variables.has(identifier)) {
            return this.variables.get(identifier).dataType;
        }
        if (this.functions.has(identifier)) {
            return this.functions.get(identifier).returnType;
        }
        return "undefined";        
    }

    /**
     * Register a function from 
     * @param func The Function data
     */
    registerFunction(func: IRFunction) {
        this.functions.set(func.name, {
            arguments: func.params,
            location: 0,
            returnType: func.returnType
        })
    }

    /**
     * Tests if a function is in the definition
     * @param name Function name
     * @returns true if the function exists, otherwise false
     */
    hasFunction(name:string) {
        return this.functions.has(name);
    }
    

    /**
     * Gets the Function data
     * @param name Function name
     * @returns Function data, or undefined if this does not exist.
     */
    getFunction(name: string) {
        return this.functions.get(name);
    }

    /**
     * 
     * @param target Function name
     * @param location References which instruction of the program is the first instruction of this program used by the CALL instruction, 
     */
    setFunctionLoc(target:string, location: number) {
        this.functions.get(target).location = location;
    }

    /**
     * Registers a variable
     * @param name Variable name
     * @param val Variable data
     */
    registerVar(name:string, val:VarData) {
        this.variables.set(name, val);
    }

    /**
     * Checks if a variable is defined
     * @param name The variable name
     * @returns true if the variable exists, otherwise false
     */
    hasVar(name:string) {
        return this.variables.has(name);
    }

    /**
     * Gets the variable data
     * @param name variable name
     * @returns The variable data, or undefined if it does not exist
     */
    getVar(name: string) {
        return this.variables.get(name);
    }

    /**
     * Gets a unique tag in the format of 'name.number'
     * @param name a hint to be included in the unique tag
     * @returns the unique tag
     * 
     * @example 
     * getUniqueTag('a')
     *   > 'a.0'
     * getUniqueTag('a')
     *   > 'a.1'
     * getUniqueTag('b')
     *   > 'a.2'
     *
     */
    getUniqueTag(name: string) {
        return `${name}.${this.tagCounter++}`;
    }

}