import { CompilationError } from "./compileErrors"
import type { Parser } from "../../jison_types"

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
