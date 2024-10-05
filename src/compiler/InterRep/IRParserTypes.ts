import { CompilationError } from "./compileErrors"

/**
 * Represents a JISON parser
 * 
 */
export interface Parser {
    /**
     * @throws It throws a error
     * @param str errorMessage
     * @param hash errorData
     */
    parseError(str: string, hash: CompilationError.ErrorStatus)
}

/**
 * JISON YY object
 */
export interface YY {
    parser: Parser
}

/**
 * A JISON YY location
 */
export type YYLoc = {
    first_line: number,
    first_column: number,
    last_line: number,
    last_column: number,
}
