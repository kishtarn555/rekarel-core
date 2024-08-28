"use strict";

export enum OpCodeID {    
  HALT = 0 ,
  LINE ,
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
    if (OpCodeID[literal]) {
        return OpCodeID[literal];
    }
    return -1;
}

export type OpCode = [OpCodeLiteral] | [OpCodeLiteral, any, any]


export type RawProgram = OpCode[]
