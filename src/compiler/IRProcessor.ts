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
    [instruction: "CALL", fname: string, argCount: number, nameLoc: YYLoc, argLoc: YYLoc] |
    [instruction: "RET", returnType: string, retLoc:YYLoc] |
    [instruction: "PARAM", index: number] |
    //This one is a IR instruction only, it must be resolved to a correct opcode
    [instruction: "VAR", name: string, loc: YYLoc]
    ;

/**
 * IR Function representation
 */
type IRFunction = [name: string, code: null | IRInstruction[], params: string[], loc: YYLoc, returnType: string]


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
type FunctionData = { location: number, arguments: string[] };
/**
 * Checks that functions calls are valid, not defined multiple times and prototypes match
 * @param data The IR generated by the parser
 */
export function validateFunctions(data: IRObject, bundle: CompilerPackage): boolean {
    const yy = data.yy;
    const prototypes = new Map<string, PrototypeData>();
    for (const func of data.functions) {
        const name = func[0];

        //Check that the parameters do not overload a global
        for (const parameter of func[2]) {
            if (
                bundle.numberVariables.has(parameter) ||
                bundle.booleanVariables.has(parameter)
            ) {
                yy.parser.parseError("Cannot name a parameter as a global variable", {
                    text: parameter,
                    line: func[3].first_line - 1
                })
                return false;
            }
        }

        //Check if current func is a prototype
        if (func[1] == null) {
            if (prototypes.has(name)) {
                yy.parser.parseError("Prototype redefinition: " + name, {
                    text: name,
                    line: func[3].first_line - 1,
                    loc: func[3],
                });
                return false;
            }
            prototypes.set(name, { argCount: func[2].length, defined: false });
            continue;
        }

        if (!prototypes.has(name)) {
            prototypes.set(name, { argCount: func[2].length, defined: false });
        }
        const proto = prototypes.get(name);
        if (proto.defined) {
            yy.parser.parseError("Function redefinition: " + name, {
                text: name,
                line: func[3].first_line - 1,
                loc: func[3],
            });
            return false;
        }

        if (proto.argCount !== func[2].length) {
            yy.parser.parseError("Prototype parameter mismatch: " + name, {
                text: name,
                line: func[3].first_line - 1,
                loc: func[3],
            });
            return false;
        }

        prototypes.set(name, { argCount: func[2].length, defined: true });


        for (const instruction of func[1]) {
            if (data.requieresFunctionPrototypes && instruction[0] === "CALL") {
                //This check is only needed if declaration order mater, for languages like C or Pascal
                //Checks that the function called at this time has been declared above.
                const target = instruction[1];
                    if (!prototypes.has(target)) {
                        

                    yy.parser.parseError("Undefined function: " + target, {
                        text: target,
                        line: instruction[3].first_line - 1,
                        loc: instruction[3]
                    });
                    return false;
                }
            }

            if (instruction[0] === "RET") {
                // Check that it returns the correct type
                if (instruction[1] !== "__DEFAULT" && instruction[1] !== func[4]) {
                    yy.parser.parseError("Cannot return a type: " + instruction[1]+", in a function of type: "+func[4], {
                        expectedType: func[4],
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
        const varName = instruction[1];
        const parameterIdx = parameters.indexOf(varName);
        if (parameterIdx !== -1) {
            result.push(["PARAM", parameterIdx]);
            continue;
        }
        if (!bundle.numberVariables.has(varName)) {
            yy.parser.parseError("Unknown variable or parameter: " + varName, {
                text: varName,
                line: instruction[2].first_line - 1,
                loc: instruction[2]
            });
        }
        result = result.concat(bundle.numberVariables.get(varName));
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
        if (func[1] == null) {
            //Skip prototypes
            continue;
        }
        funcData.set(func[0], {
            arguments: func[2],
            location: IRProgram.length
        });
        const code = resolveVariables(func[1], data.yy, bundle, func[2]);
        IRProgram = IRProgram.concat(code);
    }
    const program: RawProgram = []
    for (const instruction of IRProgram) {
        if (instruction[0] === "VAR") {
            throw new Error("VAR should have been removed");
        }
        if (instruction[0] === "CALL") {
            let target = instruction[1];
            if (!funcData.has(target)) {
                data.yy.parser.parseError("Undefined function: " + target, {
                    text: target,
                    line: instruction[3].first_line - 1,
                    loc: instruction[3]
                });
                return null;
            }
            const targetFunc = funcData.get(target);
            if (targetFunc.arguments.length != instruction[2] - 1) {
                data.yy.parser.parseError("Function parameter mismatch: " + target, {
                    text: target,
                    line: instruction[3].first_line - 1,
                    loc: instruction[3],
                    parameters: instruction[3], //Fixme: add Parameter IR location
                });
            }

            program.push([
                "CALL",
                targetFunc.location,
                target,
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
