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
  ["HALT"] |
  ["LINE", lineNumber: number] |
  ["LEFT"] |
  ["WORLDWALLS"] |
  ["ORIENTATION"] |
  ["ROTL"] |
  ["ROTR"] |
  ["MASK"] |
  ["NOT"] |
  ["AND"] |
  ["OR"] |
  ["EQ"] |
  ["EZ", ErrorLiteral] |
  ["JZ"] |
  ["JMP", offset: number] |
  ["FORWARD"] |
  ["WORLDBUZZERS"] |
  ["BAGBUZZERS"] |
  ["PICKBUZZER"] |
  ["LEAVEBUZZER"] |
  ["LOAD", value: number] |
  ["POP"] |
  ["DUP"] |
  ["DEC"] |
  ["INC"] |
  ["CALL", fname: string, argCount: string] |
  ["RET"] |
  ["PARAM", index: number]
  ;

export type RawProgram = OpCode[]
