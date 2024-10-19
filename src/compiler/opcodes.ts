"use strict";

/**
 * The Opcodes that conform the instruction set of Karel
 */
export enum OpCodeID {
  HALT = 0,
  LINE,
  LEFT,
  WORLDWALLS,
  ORIENTATION,
  ROTL,
  ROTR,
  MASK,
  NOT,
  AND,
  OR,
  EQ,
  EZ,
  JZ,
  JMP,
  FORWARD,
  WORLDBUZZERS,
  BAGBUZZERS,
  PICKBUZZER,
  LEAVEBUZZER,
  LOAD,
  POP,
  DUP,
  DEC,
  INC,
  CALL,
  RET,
  PARAM,
  SRET,
  LRET,
  LT,
  LTE,
  COLUMN,
  ROW
};

/**
 * String type OPCODES 
 */
export type OpCodeLiteral = keyof typeof OpCodeID

/**
 * Converts from String mnemonic to numeric opcode
 * @param literal Opcode Literal
 * @returns The opcode numeric value, or -1 if the literal is not valid
 */
export function getOpCodeID(literal: string): number {
  if (literal in OpCodeID) {
    return OpCodeID[literal];
  }
  return -1;
}

/**
 * Runtime Errors types
 */
export enum ErrorType {
  INSTRUCTION = "INSTRUCTION",
  STACK = "STACK",
  WALL = "WALL",
  WORLDUNDERFLOW = "WORLDUNDERFLOW",
  BAGUNDERFLOW = "BAGUNDERFLOW",
  INVALIDOPCODE = "INVALIDOPCODE",
  STACKMEMORY = "STACKMEMORY",
  CALLSIZE = "CALLSIZE"
}


export type ErrorLiteral = keyof typeof ErrorType;

/**
 * An instruction the Runtime can run
 */
export type OpCode =
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
  [instruction: "CALL", location: number, fname: string] |
  [instruction: "RET"] |
  [instruction: "PARAM", index: number] |
  [instruction: "SRET"] |
  [instruction: "LRET"] | 
  [instruction: "LT"]  |
  [instruction: "LTE"] |
  [instruction: "COLUMN"]  |
  [instruction: "ROW"] 
  ;


/**
 * A set of instructions that conform a program. 
 */
export type RawProgram = OpCode[]
