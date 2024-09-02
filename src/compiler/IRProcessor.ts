import { ErrorLiteral, RawProgram } from "./opcodes";
import { CompilerPackage, UnitePackages } from "./packages/package";
import { JavaPackages, PascalPackages } from "./packages/rekarel.all";

// TODO: complete the parser
interface Parser {
    /**
     * @throws It throws a error
     * @param str errorMessage
     * @param hash errorData
     */
    parseError(str: string, hash: any)
}

interface YY {
    parser: Parser
}

type YYLoc = {
    first_line: number,
    first_column: number,
    last_line: number,
    last_column: number,
}

/**
 * Data for a call IRInstructions
 */
type IRCall = {
    target: string,
    argCount: number,
    nameLoc: YYLoc,
    argLoc: YYLoc,
    expectedType?: string
};

/**
 * Data for a var IRInstructions
 */
type IRVar= {
    target: string,
    loc: YYLoc,
    couldBeFunction:boolean,
    expectedType: string
};

/**
 * Represents the type of instructions that are available in the IR
 */
export type IRInstruction =
    [instruction: "HALT"] |
    [instruction: "LINE", lineNumber: number] |
    [instruction: "LEFT"] |
    [instruction: "WORLDWALLS"] |
    [instruction: "ORIENTATION"] |
    [instruction: "ROTL"] |
    [instruction: "ROTR"] |
    [instruction: "MASK"] |
    [instruction: "NOT"] |
    [instruction: "AND"] |
    [instruction: "OR"] |
    [instruction: "EQ"] |
    [instruction: "EZ", error: ErrorLiteral] |
    [instruction: "JZ"] |
    [instruction: "JMP", offset: number] |
    [instruction: "FORWARD"] |
    [instruction: "WORLDBUZZERS"] |
    [instruction: "BAGBUZZERS"] |
    [instruction: "PICKBUZZER"] |
    [instruction: "LEAVEBUZZER"] |
    [instruction: "LOAD", value: number] |
    [instruction: "POP"] |
    [instruction: "DUP"] |
    [instruction: "DEC", amount: number] |
    [instruction: "INC", amount: number] |
    [instruction: "CALL", data:IRCall] |
    [instruction: "RET", returnType: string, retLoc:YYLoc] |
    [instruction: "PARAM", index: number] |
    [instruction: "SRET"] |
    [instruction: "LRET"] |
    //This one is a IR instruction only, it must be resolved to a correct opcode
    [instruction: "VAR", data:IRVar]
    ;

/**
 * IR Function representation
 */
type IRFunction = {
    name: string, 
    code: null | IRInstruction[], 
    params: string[], 
    loc: YYLoc, 
    returnType: string
}


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
    yy: YY //TODO: fix type
}


type PrototypeData = { argCount: number, defined: boolean };
type FunctionData = { 
    location: number, 
    arguments: string[],
    returnType:string
};
/**
 * Checks that functions calls are valid, not defined multiple times and prototypes match
 * @param data The IR generated by the parser
 */
export function validateFunctions(data: IRObject, bundle: CompilerPackage): boolean {
    const yy = data.yy;
    const prototypes = new Map<string, PrototypeData>();
    for (const func of data.functions) {
        //Check that the parameters do not overload a global
        for (const parameter of func.params) {
            if (
                bundle.numberVariables.has(parameter) ||
                bundle.booleanVariables.has(parameter)
            ) {
                yy.parser.parseError("Cannot name a parameter as a global variable", {
                    text: parameter,
                    line: func.loc.first_line - 1
                })
                return false;
            }
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
            yy.parser.parseError("Function redefinition: " + name, {
                text: name,
                line: func.loc.first_line - 1,
                loc: func.loc,
            });
            return false;
        }

        if (proto.argCount !== func.params.length) {
            yy.parser.parseError("Prototype parameter mismatch: " + name, {
                text: name,
                line: func.loc.first_line - 1,
                loc: func.loc,
            });
            return false;
        }

        prototypes.set(func.name, { argCount: func.params.length, defined: true });


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

            if (instruction[0] === "RET") {
                // Check that it returns the correct type
                if (instruction[1] !== "__DEFAULT" && instruction[1] !== func.returnType) {
                    yy.parser.parseError("Cannot return a type: " + instruction[1]+", in a function of type: "+func.returnType, {
                        expectedType: func.returnType,
                        returnedType: instruction[1],
                        line: instruction[2].first_line - 1,
                        loc: instruction[2]
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
function loadPackages(data: IRObject): CompilerPackage {
    const compPackages = data.language === "ReKarel Java" ? JavaPackages : PascalPackages;
    const yy = data.yy;

    let bundle: CompilerPackage = {
        booleanVariables: new Map(),
        numberVariables: new Map(),
    };

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
        bundle = UnitePackages([bundle, packObject]);
    }

    return bundle;


}

function resolveVariables(IRInstructions: IRInstruction[], yy: YY, bundle: CompilerPackage, parameters: string[]): IRInstruction[] {
    let result: IRInstruction[] = [];
    for (const instruction of IRInstructions) {
        if (instruction[0] !== "VAR") {
            result.push(instruction);
            continue;
        }
        const data = instruction[1];
        const parameterIdx = parameters.indexOf(data.target);
        if (parameterIdx !== -1) {
            result.push(["PARAM", parameterIdx]);
            continue;
        }

        if (bundle.numberVariables.has(data.target)) {            
            result = result.concat(bundle.numberVariables.get(data.target));
            continue;
        }

        if (data.couldBeFunction) {
            //Resolve as an parameterless call
            result.push(["LOAD", 0]); //FIXME: Don't forget to remove me after you change how variables work!
            result.push([
                "CALL",
                {
                    target: data.target,
                    argCount:1,
                    argLoc: data.loc,
                    nameLoc: data.loc,
                    expectedType: data.expectedType
                }
            ]);
            result.push(["LRET"]);
            continue;
        }
        
        yy.parser.parseError("Unknown variable or parameter: " + data.target, {
            text: data.target,
            line: data.loc.first_line - 1,
            loc: data.loc
        });
    }
    return result;
}

export function generateOpcodesFromIR(data: IRObject): RawProgram {
    const bundle = loadPackages(data);

    if (!validateFunctions(data, bundle))
        throw new Error("This should not be reachable, it should have thrown before");

    let IRProgram = resolveVariables(data.program, data.yy, bundle, []);


    const funcData = new Map<string, FunctionData>();

    for (const func of data.functions) {
        if (func.code == null) {
            //Skip prototypes
            continue;
        }
        funcData.set(func.name, {
            arguments: func.params,
            location: IRProgram.length,
            returnType: func.returnType
        });
        const code = resolveVariables(func.code, data.yy, bundle, func.params);
        IRProgram = IRProgram.concat(code);
    }
    const program: RawProgram = []
    for (const instruction of IRProgram) {
        if (instruction[0] === "VAR") {
            throw new Error("VAR should have been removed");
        }
        if (instruction[0] === "CALL") {
            const iData = instruction[1];
            if (!funcData.has(iData.target)) {
                data.yy.parser.parseError("Undefined function: " + iData.target, {
                    text: iData.target,
                    line: iData.nameLoc.first_line - 1,
                    loc: iData.nameLoc
                });
                return null;
            }
            const targetFunc = funcData.get(iData.target);
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
