"use strict";

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
  PARAM
};

export type OpCodeLiteral = keyof typeof OpCodeID

export function getOpCodeID(literal: string): number {
  if (literal in OpCodeID) {
    return OpCodeID[literal];
  }
  return -1;
}


export enum ErrorType {
  INSTRUCTION = "INSTRUCTION",
  STACK = "STACK",
  WALL = "WALL",
  WORLDUNDERFLOW = "WORLDUNDERFLOW",
  BAGUNDERFLOW = "BAGUNDERFLOW",
  INVALIDOPCODE = "INVALIDOPCODE"
}


export type ErrorLiteral = keyof typeof ErrorType;

export type OpCode =
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
  [instruction: "JZ"] |
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
  [instruction: "PARAM", index: number]
  ;

export type RawProgram = OpCode[]
