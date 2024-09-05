import { RawProgram } from "../opcodes";
import { CompilerPackage, UnitePackages } from "../packages/package";
import { JavaPackages, PascalPackages } from "../packages/rekarel.all";
import { YY, YYLoc } from "./IRParserTypes";
import { IRFunction, IRInstruction, IRTagRecord } from "./IRInstruction";
import { DefinitionTable, FunctionData } from "./IRVarTable";
import { resolveListWithASTs } from "./AstExpression";



/**
 * Represents an Intermediate Representation Object.
 *  It is used to abstract some logic from the parser and avoid repeating code for Pascal and Java interpreter
 */
export interface IRObject {
    compiler: string,
    language: string,
    packages: [string, YYLoc][],
    program: IRInstruction[],
    functions: IRFunction[],
    requieresFunctionPrototypes: boolean,
    variablesCanBeFunctions: boolean
    yy: YY //TODO: fix type
}


type PrototypeData = { argCount: number, defined: boolean };

/**
 * Checks that functions calls are valid, not defined multiple times and prototypes match
 * @param data The IR generated by the parser
 * @param bundle The bundle generated by the packages
 * @param definitionTable The definition table to populate
 */
function validateAndGetFunctionDefinitions(data: IRObject, definitionTable: DefinitionTable): boolean {
    const yy = data.yy;
    const prototypes = new Map<string, PrototypeData>();
    for (const func of data.functions) {
        //Check that the parameters do not overload a global
        for (const parameter of func.params) {
            if (definitionTable.hasVar(parameter)) {
                yy.parser.parseError("Cannot name a parameter as a global variable", {
                    text: parameter,
                    line: func.loc.first_line - 1
                })
                return false;
            }
        }

        // Check that the function does not shadow a variable
        if (definitionTable.hasVar(func.name)) {
            yy.parser.parseError("Cannot name a function as a global variable", {
                text: func.name,
                line: func.loc.first_line - 1,
                loc: func.loc
            })
            return false;
        }

        //Check if current func is a prototype
        if (func.code == null) {
            if (prototypes.has(func.name)) {
                yy.parser.parseError("Prototype redefinition: " + func.name, {
                    text: func.name,
                    line: func.loc.first_line - 1,
                    loc: func.loc,
                });
                return false;
            }
            prototypes.set(func.name, { argCount: func.params.length, defined: false });
            continue;
        }

        if (!prototypes.has(func.name)) {
            prototypes.set(func.name, { argCount: func.params.length, defined: false });
        }
        const proto = prototypes.get(func.name);
        if (proto.defined) {
            yy.parser.parseError("Function redefinition: " + func.name, {
                text: func.name,
                line: func.loc.first_line - 1,
                loc: func.loc,
            });
            return false;
        }

        if (proto.argCount !== func.params.length) {
            yy.parser.parseError("Prototype parameter mismatch: " + func.name, {
                text: func.name,
                line: func.loc.first_line - 1,
                loc: func.loc,
            });
            return false;
        }

        prototypes.set(func.name, { argCount: func.params.length, defined: true });
        definitionTable.registerFunction(func);


        for (const instruction of func.code) {
            if (data.requieresFunctionPrototypes && instruction[0] === "CALL") {
                //This check is only needed if declaration order mater, for languages like C or Pascal
                //Checks that the function called at this time has been declared above.
                const data = instruction[1];
                if (!prototypes.has(data.target)) {


                    yy.parser.parseError("Undefined function: " + data.target, {
                        text: data.target,
                        line: data.nameLoc.first_line - 1,
                        loc: data.nameLoc
                    });
                    return false;
                }
            }
        }

    }
    return true;
}

/**
 * This functions  creates a  bundle with all packages that the code has
 * @throws Compilation error if it imports and invalid package
 * @param data IntermediateRepresentation Object
 * @param keywords Set of keywords, each package may add it
 */
function loadPackages(data: IRObject, definitions: DefinitionTable) {
    const compPackages = data.language === "ReKarel Java" ? JavaPackages : PascalPackages;
    const yy = data.yy;

    for (const pack of data.packages) {
        const packageName = pack[0].split(".")[0];
        const moduleName = pack[0].split(".")[1];

        if (packageName !== "rekarel") {
            yy.parser.parseError("Package not recognized: " + pack[0], {
                package: packageName,
                module: moduleName,
                full: pack[0],
                loc: pack[1]
            });
        }
        if (!compPackages[pack[0]]) {
            yy.parser.parseError("Module not found: " + pack[0], {
                package: packageName,
                module: moduleName,
                full: pack[0],
                loc: pack[1]
            });
        }
        const packObject: CompilerPackage = compPackages[pack[0]];
        for (let [varName, varVal] of packObject.numberVariables) {
            definitions.registerVar(
                varName,
                {
                    instructions: varVal,
                    dataType: "INT",
                }
            )
        }
        for (let [varName, varVal] of packObject.booleanVariables) {
            definitions.registerVar(
                varName,
                {
                    instructions: varVal,
                    dataType: "BOOL",
                }
            )
        }
    }



}

/**
 * Resolves AST instructions, Tags and TJMP. 
 * @throws If there's a type error
 * @param IRInstructions The instructions to resolve
 * @param yy Compiler information, used to throw compilation errors
 * @param definitions Table of global definitions
 * @param parameters Parameters of the scope
 * @param expectedReturn The return type of the current scope
 * @returns The IR with the complex IR resolved into simple IR
 */
function resolveComplexIR(IRInstructions: IRInstruction[], yy: YY, definitions: DefinitionTable, parameters: string[], expectedReturn:string): IRInstruction[] {
    let result: IRInstruction[] = [];
    const tags: IRTagRecord = {};
    //Resolve AST and populate tags
    resolveListWithASTs(IRInstructions, definitions, parameters, expectedReturn, result, tags, yy);
    // Resolve TJMP to JMP
    result = result.map((instruction, idx): IRInstruction => {
        if (instruction[0] === "TJMP") {
            const delta = tags[instruction[1]] - idx - 1;
            return ["JMP", delta];
        }
        if (instruction[0] === "TJZ") {
            const delta = tags[instruction[1]] - idx - 1;
            return ["JZ", delta];
        }
        return instruction
    });
    return result;
}

export function generateOpcodesFromIR(data: IRObject): RawProgram {
    const definitions = new DefinitionTable(data.variablesCanBeFunctions);
    // Step 1 - Populate global definitions, and check for repeated definitions
    loadPackages(data, definitions);
    if (!validateAndGetFunctionDefinitions(data, definitions))
        throw new Error("This should not be reachable, it should have thrown before");

    // Step 2 - Resolve all AST/tags, such as terms.
    let IRProgram = resolveComplexIR(data.program, data.yy, definitions,  [], "VOID");

    // Step 3 - Resolve all AST/tags from functions and Generate a single IR array.
    for (const func of data.functions) {
        if (func.code == null) {
            //Skip prototypes
            continue;
        }
        definitions.setFunctionLoc(func.name, IRProgram.length)
        const code = resolveComplexIR(func.code, data.yy, definitions, func.params, func.returnType);
        IRProgram = IRProgram.concat(code);
    }
    //Step 4: Generate opcode. Resolve CALL into correct opcode
    const program: RawProgram = []
    for (const instruction of IRProgram) {
        if (
            instruction[0] === "VAR" ||
            instruction[0] === "TJMP" ||
            instruction[0] === "TAG" ||
            instruction[0] === "TERM" ||
            instruction[0] === "TJZ"

        ) {
            throw new Error(instruction + "should have been removed in previous steps!");
        }

        if (instruction[0] === "CALL") {
            const iData = instruction[1];
            if (!definitions.hasFunction(iData.target)) {
                data.yy.parser.parseError("Undefined function: " + iData.target, {
                    text: iData.target,
                    line: iData.nameLoc.first_line - 1,
                    loc: iData.nameLoc
                });
                return null;
            }
            const targetFunc = definitions.getFunction(iData.target);
            if (targetFunc.arguments.length != iData.argCount - 1) {
                data.yy.parser.parseError("Function parameter mismatch: " + iData.target, {
                    text: iData.target,
                    line: iData.argLoc.first_line - 1,
                    loc: iData.argLoc,
                    parameters: iData.argLoc, //Fixme: add Parameter IR location
                });
            }
            if (iData.expectedType != null && iData.expectedType !== targetFunc.returnType) {
                data.yy.parser.parseError(`Expected a function of type ${iData.expectedType}, but ${iData.target} is ${targetFunc.returnType}`, {
                    text: iData.target,
                    line: iData.argLoc.first_line - 1,
                    loc: iData.nameLoc,
                    expectedType: iData.expectedType,
                    actualType: targetFunc.returnType
                });
            }

            program.push([
                "CALL",
                targetFunc.location,
                iData.target,
            ]);
            continue;
        }
        if (instruction[0] === "RET") {
            program.push(["RET"]);
            continue;
        }
        program.push(instruction);
    }
    return program;
}
