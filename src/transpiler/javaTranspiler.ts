import { IRComplexInstruction, IRConditional, IRFunction, IRInstruction, IRInstructionTerm, IRRepeat, IRTerm, IRTermAtom, IRWhile } from "../compiler/InterRep/IRInstruction";
import { IRObject } from "../compiler/InterRep/IRProcessor"

function tabs(indentation:number):string{
    let result="";
    for (let i=0; i < indentation; i++) {
        result+="\t";
    }
    return result;
}

function processAtom(atom:IRTermAtom):string {
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
            (atom.instructions[0] as IRInstructionTerm)[1]
        );
        return `iszero(${body})`;
    }
    if (atomType === "NUMBER") {
        const argument = atom.atomType.split(".")[1];
        return argument;
    }
    if (atomType === "INC") {
        const term = processTerm((
            atom.instructions[0] as IRInstructionTerm)[1]
        );
        if (atomType === atom.atomType) {
            return `succ(${term})`;
        }
        const literal = atom.atomType.split(".")[1];        
        return `succ(${term}, ${literal})`;
    }
    if (atomType === "DEC") {
        const term = processTerm((
            atom.instructions[0] as IRInstructionTerm)[1]
        );
        if (atomType === atom.atomType) {
            return `pred(${term})`;
        }
        const literal = atom.atomType.split(".")[1];        
        return `pred(${term}, ${literal})`;
    }

    if (atomType === "VAR") {
        const variable = atom.atomType.split(".")[1];
        return translateVars(variable);
    }

    if (atomType in boolFunctions) {
        return boolFunctions[atomType];
    }
    return `/* UNKNOWN ATOM TYPE ${atomType }*/`;
}


function translateVars(word: string):string {
    if (word === "zumbador-del-piso") {
        return "floorBeepers";
    }
    if (word === "mochila") {
        return "beeperBag";
    }
    return word;
}

function translatePackages(packName:string):string {
    if (packName === "rekarel.globales") {
        return "rekarek.globals";
    }
    return packName;
}


function processTerm(term:IRTerm):string {
    if (term.operation === "ATOM") {
        return processAtom(term);
    }
    if (term.operation === "PASS") {
        return processTerm(term.term);
    }
    if (term.operation === "PARENTHESIS") {
        return `(${processTerm(term.term)})`;
    }
    if (term.operation === "AND") {
        return `${processTerm(term.left)} && ${processTerm(term.right)}`;
    }
    if (term.operation === "OR") {
        return `${processTerm(term.left)} || ${processTerm(term.right)}`;
    }
    if (term.operation === "NOT") {
        return `!${processTerm(term.term)}`;
    }
    if (term.operation === "EQ") {
        return `${processTerm(term.left)} == ${processTerm(term.right)}`;
    }
    if (term.operation === "LT") {
        return `${processTerm(term.left)} < ${processTerm(term.right)}`;
    }
    if (term.operation === "LTE") {
        return `${processTerm(term.left)} <= ${processTerm(term.right)}`;
    }
}

function processIf(conditional: IRConditional, indentation: number):string[] {
    let result:string[]=[];
    const condition = processTerm(conditional.condition[1]);
    result.push(`${tabs(indentation)}if (${condition}) {`);
    result = result.concat(processInstructions(conditional.trueCase, indentation+1));
    if (conditional.skipFalseTag == null) {
        result.push(`${tabs(indentation)}}`);
        return result;
    }
    result.push(`${tabs(indentation)}} else {`);
    result = result.concat(processInstructions(conditional.falseCase!, indentation+1));    
    result.push(`${tabs(indentation)}}`);
    return result;

}

function processRepeat(conditional: IRRepeat, indentation: number):string[] {
    let result:string[]=[];
    const iterations = processTerm(conditional.loopCount[1]);
    result.push(`${tabs(indentation)}iterate (${iterations}) {`);
    result = result.concat(processInstructions(conditional.instructions, indentation+1));  
    result.push(`${tabs(indentation)}}`);
    return result;

}

function processWhile(conditional: IRWhile, indentation: number):string[] {
    let result:string[]=[];
    const condition = processTerm(conditional.condition[1]);
    result.push(`${tabs(indentation)}while (${condition}) {`);
    result = result.concat(processInstructions(conditional.instructions, indentation+1));  
    result.push(`${tabs(indentation)}}`);
    return result;
}

function processInstructions(instructions: IRInstruction[], indentation:number): string[] {

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
            const params = data.params.map(
                (param)=>processTerm(param)
            ).join(", ");
            result.push(`${tabs(indentation)}${data.target}(${params});`)
            continue;
        }
        if (instruction[0]==="RET" ) {
            if (instruction[1] === "__DEFAULT") {
                continue;
            }
            const data = instruction[1];
            const term = processTerm(data.term);
            if (term === "") {
                result.push(`${tabs(indentation)}return;`)
            } else {
                result.push(`${tabs(indentation)}return ${term};`)
            }
            continue;
        }
        
        if (instruction[0]==="IF") {
            result = result.concat(processIf(instruction[1], indentation));
            
            continue;
        }
        
        if (instruction[0]==="REPEAT") {
            result = result.concat(processRepeat(instruction[1], indentation));
            
            continue;
        }
        
        if (instruction[0]==="WHILE") {
            result = result.concat(processWhile(instruction[1], indentation));            
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

function processFunction(func: IRFunction):string {
    let body:string = processInstructions(func.code, 2).join("\n");
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

export function generateJavaFromIR(data: IRObject): string {

    let functions:string = 
        data.functions.map(
            (func)=> processFunction(func)
        ).join("\n");
    // remove extra turnoff
    const program:IRInstruction[] = data.program.slice(0, -1); 
    let mainBody:string = processInstructions(program, 2).join("\n");
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