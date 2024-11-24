import { IRCall, IRComplexInstruction, IRConditional, IRFunction, IRInstruction, IRInstructionTerm, IRRepeat, IRTerm, IRTermAtom, IRWhile } from "../compiler/InterRep/IRInstruction";
import { IRObject } from "../compiler/InterRep/IRProcessor"
import { tabs, TranspilerData } from "./transpilerCommon";

function resolveCall(data:IRCall, transpilerData:TranspilerData) {    
    const params = data.params.map(
        (param)=>processTerm(param, transpilerData)
    ).join(", ");

    return `${data.target} (${params})`;
}

function processAtom(atom:IRTermAtom, data: TranspilerData):string {
    const atomType = atom.atomType.split(".")[0];

    const boolFunctions:Record<string, string> = {
        "IFNFWALL": "frontIsClear",
        "IFFWALL": "frontIsBlocked",
        "IFNLWALL": "leftIsClear",
        "IFLWALL": "leftIsBlocked",
        "IFNRWALL": "rightIsClear",
        "IFRWALL": "rightIsBlocked",
        "IFWBUZZER": "nextToABeeper",
        "IFNWBUZZER": "notNextToABeeper",
        "IFBBUZZER": "anyBeepersInBeeperBag",
        "IFNBBUZZER": "noBeepersInBeeperBag",
        "IFN": "facingNorth",
        "IFS": "facingSouth",
        "IFE": "facingEast",
        "IFW": "facingWest",
        "IFNN": "notFacingNorth",
        "IFNS": "notFacingSouth",
        "IFNE": "notFacingEast",
        "IFNW": "notFacingWest",
    }
    if (atomType === "IMPLICIT") {
        // Ignore implicit type
        return "";
    }
    if (atomType === "IS_ZERO") {
        const body = processTerm(
            (atom.instructions[0] as IRInstructionTerm)[1],
            data
        );
        return `iszero(${body})`;
    }
    if (atomType === "IS_INFINITE") {
        const body = processTerm(
            (atom.instructions[1] as IRInstructionTerm)[1],
            data
        );
        return `isinfinite(${body})`;
    }
    if (atomType === "NUMBER") {
        const argument = atom.atomType.split(".")[1];
        return argument;
    }
    if (atomType === "INC") {
        const term = processTerm((
            atom.instructions[0] as IRInstructionTerm)[1],
            data
        );
        if (atomType === atom.atomType) {
            return `succ(${term})`;
        }
        const literal = atom.atomType.split(".")[1];        
        return `succ(${term}, ${literal})`;
    }
    if (atomType === "DEC") {
        const term = processTerm((
            atom.instructions[0] as IRInstructionTerm)[1],
            data
        );
        if (atomType === atom.atomType) {
            return `pred(${term})`;
        }
        const literal = atom.atomType.split(".")[1];        
        return `pred(${term}, ${literal})`;
    }

    if (atomType === "VAR") {
        const variable = atom.atomType.split(".")[1];
        return translateVars(variable, data);
    }
    if (atomType === "CALL") {
        return resolveCall(
            atom.instructions[0][1] as IRCall,
            data
        );
    }

    if (atomType in boolFunctions) {
        return boolFunctions[atomType];
    }
    return `/* UNKNOWN ATOM TYPE ${atomType }*/`;
}


function translateVars(word: string, data: TranspilerData):string {
    if (data.hasGlobals) {
        if (word === "zumbadores-del-piso") {
            return "beepersOnFloor";
        }
        if (word === "zumbadores-en-la-mochila") {
            return "beepersInBeeperBag";
        }
        if (word === "verdadero") {
            return "true";
        }
        if (word === "falso") {
            return "false";
        }
        if (word === "fila-actual") {
            return "currentRow";
        }
        if (word === "columna-actual") {
            return "currentColumn";
        }
    }
    if (data.functions.has(word)) {
        return `${word} ()`;
    }
    return word;
}

function translatePackages(packName:string):string {
    if (packName === "rekarel.globales") {
        return "rekarel.globals";
    }
    return packName;
}


function processTerm(term:IRTerm, data: TranspilerData):string {
    if (term.operation === "ATOM") {
        return processAtom(term, data);
    }
    if (term.operation === "PASS") {
        return processTerm(term.term, data);
    }
    if (term.operation === "PARENTHESIS") {
        return `(${processTerm(term.term, data)})`;
    }
    if (term.operation === "AND") {
        return `${processTerm(term.left, data)} && ${processTerm(term.right, data)}`;
    }
    if (term.operation === "OR") {
        return `${processTerm(term.left, data)} || ${processTerm(term.right, data)}`;
    }
    if (term.operation === "NOT") {
        return `!${processTerm(term.term, data)}`;
    }
    if (term.operation === "EQ") {
        return `${processTerm(term.left, data)} == ${processTerm(term.right, data)}`;
    }
    if (term.operation === "LT") {
        return `${processTerm(term.left, data)} < ${processTerm(term.right, data)}`;
    }
    if (term.operation === "LTE") {
        return `${processTerm(term.left, data)} <= ${processTerm(term.right, data)}`;
    }
}

function processIf(conditional: IRConditional, indentation: number, data: TranspilerData):string[] {
    let result:string[]=[];
    const condition = processTerm(conditional.condition[1], data);
    result.push(`${tabs(indentation)}if (${condition}) {`);
    result = result.concat(processInstructions(conditional.trueCase, indentation+1, data));
    if (conditional.skipFalseTag == null) {
        result.push(`${tabs(indentation)}}`);
        return result;
    }
    result.push(`${tabs(indentation)}} else {`);
    result = result.concat(processInstructions(conditional.falseCase!, indentation+1, data));    
    result.push(`${tabs(indentation)}}`);
    return result;

}

function processRepeat(conditional: IRRepeat, indentation: number, data: TranspilerData):string[] {
    let result:string[]=[];
    const iterations = processTerm(conditional.loopCount[1], data);
    result.push(`${tabs(indentation)}iterate (${iterations}) {`);
    result = result.concat(processInstructions(conditional.instructions, indentation+1, data));  
    result.push(`${tabs(indentation)}}`);
    return result;

}

function processWhile(conditional: IRWhile, indentation: number, data: TranspilerData):string[] {
    let result:string[]=[];
    const condition = processTerm(conditional.condition[1], data);
    result.push(`${tabs(indentation)}while (${condition}) {`);
    result = result.concat(processInstructions(conditional.instructions, indentation+1, data));  
    result.push(`${tabs(indentation)}}`);
    return result;
}

function processInstructions(instructions: IRInstruction[], indentation:number, transpilerData: TranspilerData): string[] {

    let result:string[]= [];
    for (const instruction of instructions) {
        if (instruction[0]=== "LINE") {
            continue;
        }
        if (instruction[0]==="HALT") {
            result.push(`${tabs(indentation)}turnoff();`);
            continue;
        }
        if (instruction[0] === "LEFT") {
            result.push(`${tabs(indentation)}turnleft();`);
            continue;
        }
        if (instruction[0] === "FORWARD") {
            result.push(`${tabs(indentation)}move();`);
            continue;
        }
        if (instruction[0] === "PICKBUZZER") {
            result.push(`${tabs(indentation)}pickbeeper();`);
            continue;
        }
        if (instruction[0] === "LEAVEBUZZER") {
            result.push(`${tabs(indentation)}putbeeper();`);
            continue;
        }
        if (instruction[0]==="CALL") {
            const data = instruction[1];
            result.push(`${tabs(indentation)}${resolveCall(data, transpilerData)};`)
            continue;
        }
        if (instruction[0]==="RET" ) {
            if (instruction[1] === "__DEFAULT") {
                continue;
            }
            const data = instruction[1];
            const term = processTerm(data.term, transpilerData);
            if (term === "") {
                result.push(`${tabs(indentation)}return;`)
            } else {
                result.push(`${tabs(indentation)}return ${term};`)
            }
            continue;
        }
        
        if (instruction[0]==="IF") {
            result = result.concat(
                processIf(instruction[1], indentation, transpilerData)
            );
            
            continue;
        }
        
        if (instruction[0]==="REPEAT") {
            result = result.concat(
                processRepeat(instruction[1], indentation, transpilerData)
            );
            
            continue;
        }
        
        if (instruction[0]==="WHILE") {
            result = result.concat(
                processWhile(instruction[1], indentation, transpilerData)
            );            
            continue;
        }
        if (instruction[0]==="CONTINUE") {
            result.push(`${tabs(indentation)}continue;`);
            break;
        }
        if (instruction[0]==="BREAK") {
            result.push(`${tabs(indentation)}break;`);
            break;
        }
        result.push(`${tabs(indentation)}/** @PARSER Unknown intruction ${instruction[0]}*/`)
        
    }
    return result;
}

function processFunction(func: IRFunction, transpilerData: TranspilerData):string {
    let body:string = processInstructions(func.code, 2, transpilerData).join("\n");
    let func_type = "define";
    if (func.returnType === "INT") {
        func_type = "int";
    } else if (func.returnType === "BOOL") {
        func_type = "bool";
    }
    let params = func.params.map(
        (param)=> param.name
    ).join(", ");

    return `\t${func_type} ${func.name} (${params}) {
${body}
\t}
`;
}

/**
 * Generates Java source code from an Abstract Syntax Tree (IRObject), such as the one generated by JISON
 * 
 * **Notice:** This code generator does not check grammar rules, so if it gets invalid AST code, 
 *  it'll generate invalid Java Code without throwing. (For example, it does not check if variables are defined)
 * @param data the AST (IRObject)
 * @returns The source code
 */
export function generateJavaFromIR(data: IRObject): string {
    let transpilerData: TranspilerData = {
        hasGlobals: 
            data.packages.findIndex(
                (val)=>translatePackages(val[0])==="rekarel.globals"
            ) !== -1,
        functions: new Set(data.functions.map((func) => func.name))
    }
    let functions:string = 
        data.functions
        .filter((func)=> //Remove deprecated prototypes
            func.code != null
        )
        .map(
            (func)=> processFunction(func, transpilerData)
        ).join("\n");
    // remove extra turnoff
    const program:IRInstruction[] = data.program.slice(0, -1); 
    let mainBody:string = 
        processInstructions(program, 2, transpilerData).join("\n");
    let packageData = data.packages.map(
        (packImport) => 
            `import ${translatePackages(packImport[0])};\n`
    ).join();
return `${packageData}class program {
${functions}
\tprogram() {
${mainBody}
\t}   
\n}`;
}