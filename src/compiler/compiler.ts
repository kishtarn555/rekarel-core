import { RawProgram } from './opcodes.js';

import { javaParser as importedJava } from '../kareljava.js';
import { pascalParser as importedPascal } from '../karelpascal.js';
import { generateOpcodesFromIR, IRObject } from './InterRep/IRProcessor.js';

export type Compiler = (code: string) => RawProgram
type Parser = (code: string) => IRObject

const javaParser: Parser = importedJava as unknown as Parser;
const pascalParser: Parser = importedPascal as unknown as Parser;



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


export function compile(code:string) : RawProgram | null {
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
        return null;
    }  
    const result = compiler(code);
    return result;
  }
  

export function javaCompiler(code:string): RawProgram {
    const IR = javaParser(code);
    return generateOpcodesFromIR(IR); 
}

export function pascalCompiler(code:string): RawProgram {
    const IR = pascalParser(code);
    return generateOpcodesFromIR(IR); 
}
