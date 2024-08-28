import { RawProgram } from './opcodes.js';

import { javaParser as importedJava } from './kareljava.js';
import { pascalParser as importedPascal } from './karelpascal.js';

export type Compiler = (code: string) => RawProgram

const javaCompiler: Compiler = importedJava as unknown as Compiler;
const pascalCompiler: Compiler = importedPascal as unknown as Compiler;



function detectLanguage(code: string): "java" | "pascal" | "unknown" {
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
                    if (m[0] == 'class') {
                        return 'java';
                    } else if (m[0].toLowerCase() == 'iniciar-programa') {
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


function compile(code:string) : RawProgram | null {
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
    return compiler(code);
  }
  

export { javaCompiler, pascalCompiler, detectLanguage, compile }