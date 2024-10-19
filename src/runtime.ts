"use strict";

import { KarelRuntimeEventTarget } from './eventTarget';
import {  ErrorLiteral, ErrorType, getOpCodeID, OpCodeID, OpCodeLiteral, RawProgram } from './compiler/opcodes';
import type { World } from './world';




/**
 * A Karel program Represented as a flattened integer array. 
 * Each instruction occupies three consecutive elements in the format of
 * [OpcodeID, Arg1, Arg2]
 */
type ByteProgram = Int32Array

/**
 * Error instruction type error
 * Used to report too many instructions
 */
type ErrorData = {
  type:ErrorType.INSTRUCTION,
  instruction?: OpCodeLiteral
}

/**
 * Stores the registers and memory of an execution
 */
type RuntimeState = {
  pc: number
  sp: number
  fp: number
  line: number
  column: number
  ic: number
  ret: number
  stack: Int32Array
  stackSize: number
  stackMemory: number

  moveCount: number
  turnLeftCount: number
  pickBuzzerCount: number
  leaveBuzzerCount: number

  jumped: boolean
  running: boolean
  error?: ErrorType  
  errorData?:ErrorData
};



/**
 * A class that holds the state of computation and executes opcodes.
 *
 * The Karel Virtual Machine is a simple, stack-based virtual machine with
 * a small number of opcodes, based loosely on the Java Virtual Machine.
 * All opcodes are represented as an array where the first element is the
 * opcode name, followed by zero or one parameters.
 */
export class Runtime {
  world: World
  debug: boolean
  /**
   * If true, it does no fire stack events 
   */
  disableStackEvents: boolean
  /**
   * @deprecated This should not be here, use eventController instead
   * 
   */
  events: KarelRuntimeEventTarget
  /**
   * Object representing the opcodes as given by the compiler
   */
  rawOpcodes: RawProgram
  /**
   * The program in the numeric machine code representation
   */
  program: ByteProgram
  /*
   * Array containing the functions name in the same order as they are referenced by the ByteProgram
  */
  functionNames: string[]
  /**
   * The current state of the execution. Stores the registers and memory of an execution
  */
  state: RuntimeState
  /**
   * Event controller that fires and notifies the listeners of any event
   */
  eventController: KarelRuntimeEventTarget

  constructor(world: World) {
    this.world = world;
    this.debug = false;
    this.disableStackEvents = false;
    this.eventController = new KarelRuntimeEventTarget();
    this.load([['HALT']]);
    

  }

  /**
   * Loads the runtime with an opcode
   * @param opcodes The program as given by the compiler
   */
  load(opcodes: RawProgram) {

    let error_mapping: ErrorLiteral[] = ['WALL', 'WORLDUNDERFLOW', 'BAGUNDERFLOW', 'INSTRUCTION'];

    this.rawOpcodes = opcodes;
    let function_map = {};
    this.functionNames = [];
    let function_idx = 0;
    this.program = new Int32Array(new ArrayBuffer(opcodes.length * 3 * 4));
    for (let i = 0; i < opcodes.length; i++) {
      const currentOpcode = opcodes[i];
      this.program[3 * i] = getOpCodeID(currentOpcode[0]);
      if (currentOpcode.length > 1) {
        this.program[3 * i + 1] = currentOpcode[1] as number;
      }
      
      if (currentOpcode[0] == "LINE") {
        this.program[3 * i + 2] = currentOpcode[2];
      }
      if (currentOpcode[0] == 'CALL') {
        if (!function_map.hasOwnProperty(currentOpcode[2])) {
          function_map[currentOpcode[2]] = function_idx;
          this.functionNames[function_idx++] = currentOpcode[2];
        }
        this.program[3 * i + 2] = function_map[currentOpcode[2]];
      } else if (currentOpcode[0] == 'EZ') {
        this.program[3 * i + 1] = error_mapping.indexOf(currentOpcode[1] as ErrorLiteral);
        if (this.program[3 * i + 1] == -1) {
          throw new Error('Invalid error: ' + currentOpcode[1]);
        }
      }
    }
    this.reset();
  }

  /**
   * Starts the execution
   */
  start(): void {
    this.eventController.fireEvent(
      'start',
      this,
      { 
        type: "start",
        target: this, 
        world: this.world 
      }
    );
  }

  /**
   * Resets the state. **Does not** reset the world
   */
  reset() {

    this.state = {
      pc: 0,
      sp: -1,
      fp: -1,
      line: -1,
      column: -1,
      ic: 0,
      ret:0,
      stack: new Int32Array(new ArrayBuffer((0xffff * 16 + 40) * 4)),
      stackSize: 0,
      stackMemory: 0,

      // Instruction counts
      moveCount: 0,
      turnLeftCount: 0,
      pickBuzzerCount: 0,
      leaveBuzzerCount: 0,

      // Flags
      jumped: false,
      running: true,
    };

    if (this.debug) {
      this.eventController.fireEvent('debug', this, {
        type: "debug",
        target: this,
        message: JSON.stringify(this.rawOpcodes),
        debugType: 'program',
      });
    }
  }

  /**
   * Runs the program until the next Line instruction or until it stops running.
   */
  step(): boolean {
    while (this.state.running) {
      try {
        if (this.program[3 * this.state.pc] == OpCodeID.LINE) {
          this.next();
          break;
        }
        this.next();
      } finally {
        if (!this.state.running) {
          this.eventController.fireEvent(
            'stop', 
            this, 
            { 
              type: "stop",
              target: this, 
              world: this.world,
            }
          );
        }
      }
    }

    return this.state.running;
  }

  /**
   * Executes the instruction at the program counter.
   */
  next(): boolean {
    if (!this.state.running) return;

    let world = this.world;

    if (this.state.ic >= world.maxInstructions) {
      this.state.running = false;
      this.state.error = ErrorType.INSTRUCTION;

      return false;
    } else if (this.state.stackSize >= this.world.maxStackSize) {
      this.state.running = false;
      this.state.error = ErrorType.STACK;

      return false;
    }

    let rot;
    let di = [0, 1, 0, -1];
    let dj = [-1, 0, 1, 0];
    let paramCount, newSP, op1, op2, fname, params, line, fromFName, npc;
    try {
      if (this.debug) {
        this.eventController.fireEvent('debug', this, {
          type: "debug",
          target: this,
          message: JSON.stringify(
            this.program[3 * this.state.pc] +
            ' ' +
            this.rawOpcodes[this.state.pc],
          ),
          debugType: 'opcode',
        });
      }

      switch (this.program[3 * this.state.pc]) {
        case OpCodeID.HALT: {
          this.state.running = false;
          break;
        }

        case OpCodeID.LINE: {
          this.state.line = this.program[3 * this.state.pc + 1];
          this.state.column = this.program[3 * this.state.pc + 2];
          break;
        }

        case OpCodeID.LEFT: {
          this.state.ic++;
          this.world.orientation--;
          if (this.world.orientation < 0) {
            this.world.orientation = 3;
          }
          this.world.dirty = true;
          this.state.turnLeftCount++;
          if (
            this.world.maxTurnLeft >= 0 &&
            this.state.turnLeftCount > this.world.maxTurnLeft
          ) {
            this.state.running = false;
            this.state.error = ErrorType.INSTRUCTION_LEFT;
            this.state.errorData = {
              type: ErrorType.INSTRUCTION,
              instruction: 'LEFT'
            };
          }
          break;
        }

        case OpCodeID.WORLDWALLS: {
          this.state.stack[++this.state.sp] = world.walls(world.i, world.j);
          break;
        }

        case OpCodeID.ORIENTATION: {
          this.state.stack[++this.state.sp] = world.orientation;
          break;
        }

        case OpCodeID.ROTL: {
          rot = this.state.stack[this.state.sp] - 1;
          if (rot < 0) {
            rot = 3;
          }
          this.state.stack[this.state.sp] = rot;
          break;
        }

        case OpCodeID.ROTR: {
          rot = this.state.stack[this.state.sp] + 1;
          if (rot > 3) {
            rot = 0;
          }
          this.state.stack[this.state.sp] = rot;
          break;
        }

        case OpCodeID.MASK: {
          this.state.stack[this.state.sp] = 1 << this.state.stack[this.state.sp];
          break;
        }

        case OpCodeID.NOT: {
          this.state.stack[this.state.sp] =
            this.state.stack[this.state.sp] === 0 ? 1 : 0;
          break;
        }

        case OpCodeID.AND: {
          op2 = this.state.stack[this.state.sp--];
          op1 = this.state.stack[this.state.sp--];
          this.state.stack[++this.state.sp] = op1 & op2 ? 1 : 0;
          break;
        }

        case OpCodeID.OR: {
          op2 = this.state.stack[this.state.sp--];
          op1 = this.state.stack[this.state.sp--];
          this.state.stack[++this.state.sp] = op1 | op2 ? 1 : 0;
          break;
        }

        case OpCodeID.EQ: {
          op2 = this.state.stack[this.state.sp--];
          op1 = this.state.stack[this.state.sp--];
          this.state.stack[++this.state.sp] = op1 == op2 ? 1 : 0;
          break;
        }

        case OpCodeID.EZ: {
          if (this.state.stack[this.state.sp--] === 0) {
            this.state.error = [ErrorType.WALL, ErrorType.WORLDUNDERFLOW, ErrorType.BAGUNDERFLOW][
              this.program[3 * this.state.pc + 1]
            ];
            this.state.running = false;
          }
          break;
        }

        case OpCodeID.JZ: {
          this.state.ic++;
          if (this.state.stack[this.state.sp--] === 0) {
            this.state.pc += this.program[3 * this.state.pc + 1];
          }
          break;
        }

        case OpCodeID.JMP: {
          this.state.ic++;
          this.state.pc += this.program[3 * this.state.pc + 1];
          break;
        }

        case OpCodeID.FORWARD: {
          this.state.ic++;
          this.world.i += di[this.world.orientation];
          this.world.j += dj[this.world.orientation];
          this.world.dirty = true;
          this.state.moveCount++;
          if (
            this.world.maxMove >= 0 &&
            this.state.moveCount > this.world.maxMove
          ) {
            this.state.running = false;
            this.state.error = ErrorType.INSTRUCTION_FORWARD;
            this.state.errorData = {
              type: ErrorType.INSTRUCTION,
              instruction: 'FORWARD'
            };
          }
          break;
        }

        case OpCodeID.WORLDBUZZERS: {
          this.state.stack[++this.state.sp] = this.world.buzzers(
            world.i,
            world.j,
          );
          break;
        }

        case OpCodeID.BAGBUZZERS: {
          this.state.stack[++this.state.sp] = this.world.bagBuzzers;
          break;
        }

        case OpCodeID.PICKBUZZER: {
          this.state.ic++;
          this.world.pickBuzzer(this.world.i, this.world.j);
          this.state.pickBuzzerCount++;
          if (
            this.world.maxPickBuzzer >= 0 &&
            this.state.pickBuzzerCount > this.world.maxPickBuzzer
          ) {
            this.state.running = false;
            this.state.error = ErrorType.INSTRUCTION_PICKBUZZER;
            this.state.errorData = {
              type: ErrorType.INSTRUCTION,
              instruction: 'PICKBUZZER'
            };
          }
          break;
        }

        case OpCodeID.LEAVEBUZZER: {
          this.state.ic++;
          this.world.leaveBuzzer(this.world.i, this.world.j);
          this.state.leaveBuzzerCount++;
          if (
            this.world.maxLeaveBuzzer >= 0 &&
            this.state.leaveBuzzerCount > this.world.maxLeaveBuzzer
          ) {
            this.state.running = false;
            this.state.error = ErrorType.INSTRUCTION_PUTBUZZER
            this.state.errorData = {
              type: ErrorType.INSTRUCTION,
              instruction: 'LEAVEBUZZER'
            };
          }
          break;
        }

        case OpCodeID.LOAD: {
          this.state.stack[++this.state.sp] = this.program[3 * this.state.pc + 1];
          break;
        }

        case OpCodeID.POP: {
          this.state.sp--;
          break;
        }

        case OpCodeID.DUP: {
          this.state.stack[++this.state.sp] = this.state.stack[this.state.sp - 1];
          break;
        }

        case OpCodeID.DEC: {
          this.state.stack[this.state.sp] -= this.program[3 * this.state.pc + 1];
          break;
        }

        case OpCodeID.INC: {
          this.state.stack[this.state.sp] += this.program[3 * this.state.pc + 1];
          break;
        }

        case OpCodeID.CALL: {
          this.state.ic++;
          // sp, pc, param
          paramCount = this.state.stack[this.state.sp--];
          newSP = this.state.sp - paramCount;
          fname = this.functionNames[this.program[3 * this.state.pc + 2]];

          this.state.stack[++this.state.sp] = this.state.fp;
          this.state.stack[++this.state.sp] = newSP;
          this.state.stack[++this.state.sp] = this.state.pc;
          this.state.stack[++this.state.sp] = paramCount;

          this.state.fp = newSP + 1 + paramCount;
          this.state.pc = this.program[3 * this.state.pc + 1];
          this.state.jumped = true;
          this.state.stackSize++;
          this.state.stackMemory += Math.max(1, paramCount);

          if (this.state.stackSize >= this.world.maxStackSize) {
            this.state.running = false;
            this.state.error = ErrorType.STACK;
          } else if (this.state.stackMemory >= this.world.maxStackMemory) {
            this.state.running = false;
            this.state.error = ErrorType.STACKMEMORY;
          } else if (paramCount > this.world.maxCallSize) {
            
            this.state.running = false;
            this.state.error = ErrorType.CALLSIZE;
          } else if (!this.disableStackEvents) {
            this.eventController.fireEvent('call', this, {
              type: "call",
              function: fname,
              params: this.state.stack.subarray(this.state.fp - paramCount, this.state.fp),
              line: this.state.line,
              target: this,
            });
          }
          break;
        }

        case OpCodeID.RET: {
          if (this.state.fp < 0) {
            this.state.running = false;
            break;
          }
          paramCount = this.state.stack[this.state.fp + 3];
          this.state.pc = this.state.stack[this.state.fp + 2];
          this.state.sp = this.state.stack[this.state.fp + 1];
          this.state.fp = this.state.stack[this.state.fp];
          this.state.stackSize--;
          this.state.stackMemory -= Math.max(1, paramCount);;
          if (!this.disableStackEvents) {
            params = this.state.stack.subarray(0,0);
            fromFName = this.functionNames[this.program[3 * this.state.pc + 2]];

            fname = "N/A";
            line = -2;
            if (this.state.stackSize >= 1) {
              npc = this.state.stack[this.state.fp + 2]; //Get the function name from the function that called me
              fname = this.functionNames[this.program[3 * npc + 2]];
              line = this.program[3 * (npc + 1) + 1]; //Get line. A call always is LINE -> LOAD PARAM -> CALL -> LINE
              paramCount = this.state.stack[this.state.fp + 3];
              params = this.state.stack.subarray(this.state.fp - paramCount, this.state.fp);
            }

            this.eventController.fireEvent('return', this,  {
              type: "return",
              target: this,
              params: params,
              function: fname,
              fromFunction: fromFName, 
              line: line,
              returnValue: this.state.ret
            });
          }
          break;
        }

        case OpCodeID.PARAM: {
          this.state.stack[++this.state.sp] =
            this.state.stack[
            this.state.fp - 1 - this.program[3 * this.state.pc + 1]
            ];
          break;
        }
        
        case OpCodeID.SRET: {
          this.state.ret = this.state.stack[this.state.sp--];
          break;
        }

        case OpCodeID.LRET: {
          this.state.stack[++this.state.sp] = this.state.ret;
          break;
        }

        case OpCodeID.LT: {
          op2 = this.state.stack[this.state.sp--];
          op1 = this.state.stack[this.state.sp--];
          this.state.stack[++this.state.sp] = op1 < op2 ? 1 : 0;
          break;
        }

        case OpCodeID.LTE: {          
          op2 = this.state.stack[this.state.sp--];
          op1 = this.state.stack[this.state.sp--];
          this.state.stack[++this.state.sp] = op1 <= op2 ? 1 : 0;
          break;
        }

        case OpCodeID.ROW: 
          this.state.stack[++this.state.sp] = this.world.i
          break;
        
        case OpCodeID.COLUMN:
          this.state.stack[++this.state.sp] = this.world.j
          break;

        default: {
          this.state.running = false;
          if (this.debug) {
            this.eventController.fireEvent('debug', this, {
              type: "debug",
              target: this,
              message: 'Missing opcode ' + this.rawOpcodes[this.state.pc][0],
              debugType: 'opcode',
            });
          }

          this.state.error = ErrorType.INVALIDOPCODE;
          this.state.errorData = {
            type:ErrorType.INSTRUCTION,
            instruction: OpCodeID[this.program[this.state.pc*3]] as OpCodeLiteral
          }
          return false;
        }
      }

      if (this.state.jumped) {
        this.state.jumped = false;
      } else {
        this.state.pc++;
      }

      if (this.debug) {
        let copy = {
          pc: this.state.pc,
          stackSize: this.state.stackSize,
          expressionStack: Array.from(
            this.state.stack.slice(this.state.fp + 4, this.state.sp + 1),
          ),
          line: this.state.line,
          ic: this.state.ic,
          running: this.state.running,
        };
        this.eventController.fireEvent('debug', this, {
          type: "debug",
          target: this,
          message: JSON.stringify(copy),
          debugType: 'state',
        });
      }
    } catch (e) {
      this.state.running = false;
      console.error(e);
      console.log(e.stack);
      throw e;
    }

    return true;
  }
}
