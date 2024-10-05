import { RawProgram } from './opcodes.js';

import { javaParser as importedJava } from '../kareljava.js';
import { pascalParser as importedPascal } from '../karelpascal.js';
import { generateOpcodesFromIR, IRObject } from './InterRep/IRProcessor.js';
import { DebugData } from './debugData.js';
import { CompilationError } from './InterRep/compileErrors.js'

export type Compiler = (
    ((code: string) => RawProgram ) 
    | ( (code: string, exportDebug: boolean) => [RawProgram, DebugData])
)

type Parser = (code: string) => IRObject

const javaParser: Parser = importedJava as unknown as Parser;
const pascalParser: Parser = importedPascal as unknown as Parser;


/**
 * Uses the first line of text to detect the language
 * @param code Source code
 * @returns Java, pascal or unknown
 */
export function detectLanguage(code: string): "java" | "pascal" | "unknown" {
    let rules = [
        /^\s+/,
        /^\/\/[^\n]*/,
        /^#[^\n]*/,
        /^(?:\/\*(?:[^*]|\*[^)])*\*\/)/,
        /^{[^}]*}/,
        /^\(\*([^*]|\*[^)])*\*\)/,
        /^[^a-zA-Z0-9_-]+/,
        /^[a-zA-Z0-9_-]+/,
    ];
    let i = 0;

    while (i < code.length) {
        for (let j = 0; j < rules.length; j++) {
            let m = rules[j].exec(code.substring(i));
            if (m !== null) {
                if (j == rules.length - 1) {
                    // el primer token de verdad.
                    if (m[0] == 'class' || m[0] == 'import') {
                        return 'java';
                    } else if (m[0].toLowerCase() == 'iniciar-programa' || m[0].toLowerCase() == 'usa') {
                        return 'pascal';
                    } else {
                        return 'unknown';
                    }
                } else {
                    // comentario o no-token.
                    i += m[0].length;
                    break;
                }
            }
        }
    }

    return 'unknown';
}

/**
 * This function produces the program for the VM from a source code
 * @param code the source code, which may be either java or pascal
 * @param exportDebug If true, it returns the DebugData, otherwise the DebugData is null. It may increase compilation resource consumption. If not present it is false
 * @returns A tuple array containing the compiled program and the debug data (or null)
 * 
 * @throws On compilation error. Check the error.status for information on the error
 * 
 * @public
 */
export function compile(code:string, exportDebug: boolean = false) : [RawProgram, DebugData] {
    let lang = detectLanguage(code);
    let compiler:Compiler = null;  
    switch (lang) {
      case 'java':
        compiler = javaCompiler;
        break;  
      case 'pascal':
        compiler = pascalCompiler;
        break;
      default:
        let errorStatus:CompilationError.ErrorStatus = {
            error: CompilationError.Errors.UNKNOWN_SYNTAX,
            line:0,
            loc: {
                first_column:0, first_line: 1, last_column: 0, last_line: 1
            }
        }
        let error = new Error("Unknown syntax, the start of the file must be either 'class' or 'iniciar-programa'");
        // @ts-ignore Adding extra error data
        error.hash = errorStatus
        throw error;
    }  
    const result = compiler(code, exportDebug);
    return result;
  }
  
  

/**
 * This function produces the program for the VM from a Karel Java source code
 * @param code the source code, which must be Java
 * @param exportDebug If true, it returns the DebugData, otherwise the DebugData is null. It may increase compilation resource consumption. If not present it is false
 * @returns A tuple array containing the compiled program and the debug data (or null)
 */
export function javaCompiler(code:string, exportDebug: boolean = false):  [RawProgram, DebugData] {
    const IR = javaParser(code);
    return generateOpcodesFromIR(IR, exportDebug); 
}

/**
 * This function produces the program for the VM from a Karel Pascal source code
 * @param code the source code, which must be Pascal
 * @param exportDebug If true, it returns the DebugData, otherwise the DebugData is null. It may increase compilation resource consumption. If not present it is false
 * @returns A tuple array containing the compiled program and the debug data (or null)
 */
export function pascalCompiler(code:string, exportDebug: boolean = false): [RawProgram, DebugData] {
    const IR = pascalParser(code);
    return generateOpcodesFromIR(IR, exportDebug); 
}
