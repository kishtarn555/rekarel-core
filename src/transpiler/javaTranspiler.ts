import { IRComplexInstruction, IRFunction, IRInstruction, IRInstructionTerm, IRTerm, IRTermAtom } from "../compiler/InterRep/IRInstruction";
import { IRObject } from "../compiler/InterRep/IRProcessor"

function tabs(indentation:number):string{
    let result="";
    for (let i=0; i < indentation; i++) {
        result+="\t";
    }
    return result;
}

function processAtom(atom:IRTermAtom):string {
    const atomType = atom.dataType.split(".")[0];
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
    if (atomType === "") {

    }
    return "000";
}


function processTerm(term:IRTerm):string {
    if (term.operation === "ATOM") {
        return processAtom(term);
    }
}

function processInstructions(instructions: IRInstruction[], indentation:number): string {
    let result:string[]= [];
    for (const instruction of instructions) {
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
            result.push(`${tabs(indentation)}${data.target}`)
            continue;
        }
        if (instruction[0]==="RET" && instruction[1] !== "__DEFAULT") {
            const data = instruction[1];
            const term = processTerm(data.term);
            result.push(`${tabs(indentation)}return ${term};`)
            continue;
        }
    }
    return result.join("\n");
}

function processFunction(func: IRFunction):string {
    let body = processInstructions(func.code, 2);
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

    let functions:string[] = 
        data.functions.map(
            (func)=> processFunction(func)
        );
    let mainBody = "";
return `class program {
${functions}

\tprogram() {
${mainBody}
\t}   
\n}`;
}