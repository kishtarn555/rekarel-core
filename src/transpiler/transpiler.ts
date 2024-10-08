
import { 
    Compiler,
    detectLanguage,
    javaCompiler,
    javaParser,
    Parser,
    pascalCompiler
} from "../compiler/compiler";


import { CompilationError } from "../compiler/InterRep/compileErrors";
import { pascalParser } from "../karelpascal";
import { generateJavaFromIR } from "./javaTranspiler";
import { generatePascalFromIR } from "./pascalTranspiler";

/**
 * Takes a source code and transpiles it to a target language
 * @param source Original source code
 * @param target Target source code
 * @returns 
 */
export function transpileCode(source: string, target: "java"|"pascal"):string {
    let lang = detectLanguage(source);
    let parser: Parser = null;
    switch (lang) {
        case 'java':
            parser = javaParser;
            break;
        case 'pascal':
            parser = pascalParser;
            break;
        default:
            let errorStatus: CompilationError.ErrorStatus = {
                error: CompilationError.Errors.UNKNOWN_SYNTAX,
                line: 0,
                loc: {
                    first_column: 0, first_line: 1, last_column: 0, last_line: 1
                }
            }
            let error = new Error("Unknown syntax, the start of the file must be either 'class' or 'iniciar-programa'");
            // @ts-ignore Adding extra error data
            error.hash = errorStatus
            throw error;
    }
    const result = parser(source);
    if (target === "java") {
        return generateJavaFromIR(result);
    }
    if (target === "pascal") {
        return generatePascalFromIR(result);
    }
    return "000";
}

