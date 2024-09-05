import { ErrorLiteral } from "../opcodes";
import { YYLoc } from "./IRParserTypes";

/**
 * Data for a call IRInstructions
 */
export type IRCall = {
    target: string,
    argCount: number,
    nameLoc: YYLoc,
    argLoc: YYLoc,
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
 * IR Function representation
 */
export type IRFunction = {
    name: string,
    code: null | IRInstruction[],
    params: string[],
    loc: YYLoc,
    returnType: string
}

/**
 * Represents and IR instruction
 */
export type IRTerm = 
    {
        operation: "AND" | "OR",
        left: IRTerm,
        right: IRTerm,
        dataType: "BOOL"
    } 
    | {
        operation: "NOT",
        term: IRTerm,
        dataType: "BOOL"
    } 
    | {
        operation: "ATOM",
        instructions: IRInstruction[],
        dataType: string
    }
    | {
        operation: "PASS",
        term: IRTerm,
        dataType: string
    }
;

export type IRRet = {
    term:IRTerm,
    loc: YYLoc
}

export type IRTagRecord = Record<string, number>;
/**
 * Represents the type of instructions that are available in the IR
 */
export type IRInstruction =
    [instruction: "HALT"] |
    [instruction: "LINE", lineNumber: number] |
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
    [instruction: "RET", "__DEFAULT", loc:YYLoc] |
    [instruction: "PARAM", index: number] |
    [instruction: "SRET"] |
    [instruction: "LRET"] |
    //These ones are a IR only instructions, they must be resolved to a correct opcode
    [instruction: "VAR", data:IRVar] |
    [instruction: "TERM", data:IRTerm] | //Represents a term like a || b || !(x)
    [instruction: "TAG", data:string] | //Represents a tag
    [instruction: "TJMP", data:string] |  //Jumps to a opcode by tag
    [instruction: "TJZ", data:string]  //Jumps to a opcode by tag if stack has zerp
    ;