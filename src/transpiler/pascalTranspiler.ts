import { IRCall, IRComplexInstruction, IRConditional, IRFunction, IRInstruction, IRInstructionTerm, IRRepeat, IRTerm, IRTermAtom, IRWhile } from "../compiler/InterRep/IRInstruction";
import { IRObject } from "../compiler/InterRep/IRProcessor"
import { tabs, TranspilerData } from "./transpilerCommon";

function resolveCall(data:IRCall, transpilerData: TranspilerData) {
    if (data.params.length > 0) {
        const params = data.params.map(
            (param)=>processTerm(param, transpilerData)
        ).join(", ");
        return `${data.target}(${params})`;
    }
    return `${data.target}`;
}

function processAtom(atom:IRTermAtom, data: TranspilerData):string {
    const atomType = atom.atomType.split(".")[0];

    const boolFunctions:Record<string, string> = {
        "IFNFWALL": "frente-libre",
        "IFFWALL": "frente-bloqueado",
        "IFNLWALL": "izquierda-libre",
        "IFLWALL": "izquierda-bloqueada",
        "IFNRWALL": "derecha-libre",
        "IFRWALL": "derecha-bloqueada",
        "IFWBUZZER": "junto-a-zumbador",
        "IFNWBUZZER": "no-junto-a-zumbador",
        "IFBBUZZER": "algun-zumbador-en-la-mochila",
        "IFNBBUZZER": "ningun-zumbador-en-la-mochila",
        "IFN": "orientado-al-norte",
        "IFS": "orientado-al-sur",
        "IFE": "orientado-al-este",
        "IFW": "orientado-al-oeste",
        "IFNN": "no-orientado-al-norte",
        "IFNS": "no-orientado-al-sur",
        "IFNE": "no-orientado-al-este",
        "IFNW": "no-orientado-al-oeste",
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
        return `es-cero(${body})`;
    }
    if (atomType === "IS_INFINITE") {
        const body = processTerm(
            (atom.instructions[1] as IRInstructionTerm)[1],
            data
        );
        return `es-infinito(${body})`;
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
            return `sucede(${term})`;
        }
        const literal = atom.atomType.split(".")[1];        
        return `sucede(${term}, ${literal})`;
    }
    if (atomType === "DEC") {
        const term = processTerm((
            atom.instructions[0] as IRInstructionTerm)[1],
            data
        );
        if (atomType === atom.atomType) {
            return `precede(${term})`;
        }
        const literal = atom.atomType.split(".")[1];        
        return `precede(${term}, ${literal})`;
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
        if (word === "beepersOnFloor") {
            return "zumbadores-del-piso";
        }
        if (word === "beepersInBeeperBag") {
            return "zumbadores-en-la-mochila";
        }
        if (word === "true") {
            return "verdadero";
        }
        if (word === "false") {
            return "falso";
        }
        if (word === "currentRow") {
            return "fila-actual";
        }
        if (word === "currentColumn") {
            return "columna-actual";
        }
    }
    return word;
}

function translatePackages(packName:string):string {
    if (packName === "rekarel.globals") {
        return "rekarel.globales";
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
        return `${processTerm(term.left, data)} y ${processTerm(term.right, data)}`;
    }
    if (term.operation === "OR") {
        return `${processTerm(term.left, data)} o ${processTerm(term.right, data)}`;
    }
    if (term.operation === "NOT") {
        return `no ${processTerm(term.term, data)}`;
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
    result.push(`${tabs(indentation)}si ${condition} entonces`);
    result.push(`${tabs(indentation)}inicio`);
    result = result.concat(processInstructions(conditional.trueCase, indentation+1, data));
    if (conditional.skipFalseTag == null) {
        result.push(`${tabs(indentation)}fin;`);
        return result;
    }
    result.push(`${tabs(indentation)}fin`);
    result.push(`${tabs(indentation)}sino`);
    result.push(`${tabs(indentation)}inicio`);
    result = result.concat(processInstructions(conditional.falseCase!, indentation+1, data));    
    result.push(`${tabs(indentation)}fin;`);
    return result;

}

function processRepeat(conditional: IRRepeat, indentation: number, data: TranspilerData):string[] {
    let result:string[]=[];
    const iterations = processTerm(conditional.loopCount[1], data);
    result.push(`${tabs(indentation)}repetir ${iterations} veces`);
    result.push(`${tabs(indentation)}inicio`);
    result = result.concat(processInstructions(conditional.instructions, indentation+1, data));  
    result.push(`${tabs(indentation)}fin;`);
    return result;

}

function processWhile(conditional: IRWhile, indentation: number, data: TranspilerData):string[] {
    let result:string[]=[];
    const condition = processTerm(conditional.condition[1], data);
    result.push(`${tabs(indentation)}mientras ${condition} hacer`);
    result.push(`${tabs(indentation)}inicio`);
    result = result.concat(processInstructions(conditional.instructions, indentation+1, data));  
    result.push(`${tabs(indentation)}fin;`);
    return result;
}

function processInstructions(instructions: IRInstruction[], indentation:number, transpilerData: TranspilerData): string[] {

    let result:string[]= [];
    for (const instruction of instructions) {
        if (instruction[0]=== "LINE") {
            continue;
        }
        if (instruction[0]==="HALT") {
            result.push(`${tabs(indentation)}apagate;`);
            continue;
        }
        if (instruction[0] === "LEFT") {
            result.push(`${tabs(indentation)}gira-izquierda;`);
            continue;
        }
        if (instruction[0] === "FORWARD") {
            result.push(`${tabs(indentation)}avanza;`);
            continue;
        }
        if (instruction[0] === "PICKBUZZER") {
            result.push(`${tabs(indentation)}coge-zumbador;`);
            continue;
        }
        if (instruction[0] === "LEAVEBUZZER") {
            result.push(`${tabs(indentation)}deja-zumbador;`);
            continue;
        }
        if (instruction[0]==="CALL") {
            const data = instruction[1];            
            result.push(`${tabs(indentation)}${resolveCall(data, transpilerData)};`);            
            continue;
        }
        if (instruction[0]==="RET" ) {
            if (instruction[1] === "__DEFAULT") {
                continue;
            }
            const data = instruction[1];
            const term = processTerm(data.term, transpilerData);
            if (term === "") {
                result.push(`${tabs(indentation)}regresa;`)
            } else {
                result.push(`${tabs(indentation)}regresa ${term};`)
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
            result.push(`${tabs(indentation)}continua;`);
            break;
        }
        if (instruction[0]==="BREAK") {
            result.push(`${tabs(indentation)}rompe;`);
            break;
        }
        result.push(`${tabs(indentation)}/** @PARSER Instruccion desconocida ${instruction[0]}*/`)
        
    }
    return result;
}

function processFunction(func: IRFunction, transpilerData: TranspilerData):string {
    let body:string = processInstructions(func.code, 2, transpilerData).join("\n");
    let func_type = "define";
    if (func.returnType === "INT") {
        func_type = "define-calculo";
    } else if (func.returnType === "BOOL") {
        func_type = "define-condicion";
    }
    let head = `${func_type} ${func.name}`;
    if (func.params.length > 0) {
        let params = func.params.map(
            (param)=> param.name
        ).join(", ");
        head+= ` (${params})`;
    }

    return `\t${head} como
\tinicio
${body}
\tfin;
`;
}


/**
 * Generates Pascal source code from an Abstract Syntax Tree (IRObject), such as the one generated by JISON
 * 
 * **Notice:** This code generator does not check grammar rules, so if it gets invalid AST code, 
 *  it'll generate invalid Pascal Code without throwing. (For example, it does not check if variables are defined)
 * @param data the AST (IRObject)
 * @returns The source code
 */
export function generatePascalFromIR(data: IRObject): string {
    let transpilerData: TranspilerData = {
        hasGlobals: 
            data.packages.findIndex(
                (val)=>translatePackages(val[0])==="rekarel.globales"
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
            `usa ${translatePackages(packImport[0])};\n`
    ).join();
return `${packageData}iniciar-programa
${functions}
\tinicia-ejecucion
${mainBody}
\ttermina-ejecucion   
finalizar-programa`;
}