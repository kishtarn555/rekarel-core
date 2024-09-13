import { CompilationError } from "./compileErrors"

// TODO: complete the parser
export interface Parser {
    /**
     * @throws It throws a error
     * @param str errorMessage
     * @param hash errorData
     */
    parseError(str: string, hash: CompilationError.ErrorStatus)
}

export interface YY {
    parser: Parser
}

export type YYLoc = {
    first_line: number,
    first_column: number,
    last_line: number,
    last_column: number,
}
