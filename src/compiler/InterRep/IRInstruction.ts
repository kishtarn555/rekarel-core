import { ErrorLiteral } from "../../runtimeErrors";
import { YYLoc } from "./IRParserTypes";

/**
 * Data for a call IRInstructions
 */
export type IRCall = {
    target: string,
    nameLoc: YYLoc,
    params: IRTerm[],
    expectedType?: string
};

/**
 * Data for a var IRInstructions
 */
export type IRVar= {
    target: string,
    loc: YYLoc,
    couldBeFunction:boolean,
    expectedType: string
};

/**
 * A parameter definition Data
 */
export type IRParam = {
    /**
     * Param name
     */
    name: string,
    loc: YYLoc,
}

/**
 * IR Function representation
 */
export type IRFunction = {
    name: string,
    code: null | IRInstruction[],
    params: IRParam[],
    loc: YYLoc,
    returnType: string
}

export type IRTermAtom = {
    operation: "ATOM",
    atomType: string
    instructions: IRInstruction[],
    dataType: string,
    loc: YYLoc,
    totalLoc: YYLoc,
};

/**
 * Represents and IR instruction
 */
export type IRTerm = 
    {
        operation: "AND" | "OR" | "EQ" | "LT" | "LTE",
        left: IRTerm,
        right: IRTerm,
        dataType: "BOOL",
        loc: YYLoc,
        totalLoc: YYLoc,
    } 
    | {
        operation: "NOT",
        term: IRTerm,
        dataType: "BOOL",
        loc: YYLoc,
        totalLoc: YYLoc,
    } 
    | IRTermAtom
    | {
        operation: "PASS",
        term: IRTerm,
        dataType: string,
        loc: YYLoc,
        totalLoc: YYLoc,
    }
    | {
        operation: "PARENTHESIS",
        term: IRTerm,
        dataType: string,
        loc: YYLoc,
        totalLoc: YYLoc,
    }
;

/**
 * Represents an IR return
 */
export type IRRet = {
    term:IRTerm,
    loc: YYLoc
}

export type IRTagRecord = Record<string, number>;


/**
 * AST of a repeat loop
 */
export type IRRepeat = {
    loopCount:IRInstructionTerm,
    continueTag: string,
    repeatTag: string,
    endTag: string,
    line: IRSimpleInstruction,
    instructions: IRInstruction[]
}


/**
 * AST of a while loop
 */
export type IRWhile = {
    condition:IRInstructionTerm,
    repeatTag: string,
    endTag: string,
    line: IRSimpleInstruction,
    instructions: IRInstruction[]
}

/**
 * AST of a Conditional
 */
export type IRConditional = {
    condition: IRInstructionTerm,
    line: IRSimpleInstruction,
    skipTrueTag: string,
    skipFalseTag?: string,
    trueCase: IRInstruction[],
    falseCase?: IRInstruction[],
};

/**
 * IR tag jumps
 */
export type IRJumps =     
    [instruction: "TJMP", data:string] |  //Jumps to a opcode by tag
    [instruction: "TJZ", data:string]  //Jumps to a opcode by tag if stack has zero
;

/**
 * Represents a term like a || b || !(x)
 */
export type IRInstructionTerm = 
    [instruction: "TERM", data:IRTerm]; 

/**
 * These are Complex instructions that are generated by the IR Parser and cannot be converted easily to a opcode instruction
 * They must be resolved by step 2.
 */
export type IRComplexInstruction =     
    //These ones are a IR only instructions, they must be resolved to a correct opcode
    [instruction: "VAR", data:IRVar] |
    IRInstructionTerm |
    [instruction: "TAG", data:string] | //Represents a tag
    [instruction: "REPEAT", data:IRRepeat] |
    [instruction: "WHILE", data:IRWhile] |
    [instruction: "IF", data:IRConditional] |
    IRJumps |
    [instruction: "CONTINUE", loc: YYLoc] | 
    [instruction: "BREAK", loc: YYLoc]
;

/**
 * Represents the type of instructions that are available in the IR
 * Simple instructions are those which convert 1 - 1 to opcode
 */
export type IRSimpleInstruction =
    [instruction: "HALT"] |
    [instruction: "LINE", lineNumber: number, columnNumber: number] |
    [instruction: "LEFT"] |
    [instruction: "WORLDWALLS"] |
    [instruction: "ORIENTATION"] |
    [instruction: "ROTL"] |
    [instruction: "ROTR"] |
    [instruction: "MASK"] |
    [instruction: "NOT"] |
    [instruction: "AND"] |
    [instruction: "OR"] |
    [instruction: "EQ"] |
    [instruction: "EZ", error: ErrorLiteral] |
    [instruction: "JZ", offset:number] |
    [instruction: "JMP", offset: number] |
    [instruction: "FORWARD"] |
    [instruction: "WORLDBUZZERS"] |
    [instruction: "BAGBUZZERS"] |
    [instruction: "PICKBUZZER"] |
    [instruction: "LEAVEBUZZER"] |
    [instruction: "LOAD", value: number] |
    [instruction: "POP"] |
    [instruction: "DUP"] |
    [instruction: "DEC", amount: number] |
    [instruction: "INC", amount: number] |
    [instruction: "CALL", data:IRCall] |
    [instruction: "RET", term: IRRet] |
    [instruction: "RET", dummy:"__DEFAULT", loc:YYLoc] |
    [instruction: "PARAM", index: number] |
    [instruction: "SRET"] |
    [instruction: "LRET"] | 
    [instruction: "LT"]  |
    [instruction: "LTE"] |
    [instruction: "COLUMN"]  |
    [instruction: "ROW"] 
    ;


/**
 * This is a complete type of all IR instructions, simple and complex
 */
export type IRInstruction = IRSimpleInstruction | IRComplexInstruction;
/**
 * This is a restricted set of IR that is used up to step 3.
 */
export type IRSemiSimpleInstruction = IRSimpleInstruction | IRJumps;