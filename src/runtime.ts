"use strict";

import { KarelRuntimeEventTarget } from './eventTarget';
import {  getOpCodeID, OpCodeID, OpCodeLiteral, RawProgram } from './compiler/opcodes';
import type { World } from './world';
import { KarelNumbers } from './constants';
import { ErrorLiteral, ErrorType } from './runtimeErrors';



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
  /**Program counter */
  pc: number
  /**Stack pointer */
  sp: number
  /**Function pointer */
  fp: number
  /**Line register, relates source code to machine code */
  line: number
  /**Column register, relates source code to machine code */
  column: number
  /**Instruction counter */
  ic: number
  /**Ret register, last returned value */
  ret: number
  stack: Int32Array
  stackSize: number
  stackMemory: number

  moveCount: number
  turnLeftCount: number
  pickBuzzerCount: number
  leaveBuzzerCount: number
  /**If true, the program just jumped and should not auto-increment pc */
  jumped: boolean
  /**If true, the program has not finished or crashed. Notice this is true even if the program has not run any instruction */
  running: boolean
  /**
   * The program has already run an instruction and has not been reset
   */
  clean: boolean
  /**Runtime error, if undefined then there has been no error */
  error?: ErrorType  
  /**Additional information on the runtime error, if undefined then there has been no error */
  errorData?:ErrorData
};



/**
 * A class that holds the state of computation and executes opcodes.
 *
 * The Karel Virtual Machine is a simple, stack-based virtual machine with
 * a small number of opcodes, based loosely on the Java Virtual Machine.
 * All opcodes are represented as an array where the first element is the
 * opcode name, followed by zero, one or two parameters.
 */
export class Runtime {
  /**
   * The world that this runtime is linked to
   * @private
   */
  private _world: World
  /**
   * If set, it runs in debug mode
   */
  debug: boolean
  /**
   * If true, it does no fire stack events 
   */
  disableStackEvents: boolean
  /**
   * Object representing the opcodes as given by the compiler
   * @private
   */
  private _rawOpcodes: RawProgram
  /**
   * The program in the numeric machine code representation
   * @private
   */
  private _program: ByteProgram
  /**
   * Array containing the functions name in the same order as they are referenced by the ByteProgram
   * @private
  */
  private _functionNames: string[]
  /**
   * The current state of the execution. Stores the registers and memory of an execution
   * @private
  */
  private _state: RuntimeState
  /**
   * Event controller that fires and notifies the listeners of any event
   * @private
   */
  private _eventController: KarelRuntimeEventTarget

  constructor(world: World) {
    this._world = world;
    this.debug = false;
    this.disableStackEvents = false;
    this._eventController = new KarelRuntimeEventTarget();
    this.load([['HALT']]);
    

  }

  /**
   * The world that this runtime is linked to this runtime
   * @readonly
   */
  get world ()  {
    return this._world
  }
  
  /**
   * The current state of the execution. Stores the registers and memory of an execution
   * @readonly
  */
  get state () {
    return this._state
  }
  /**
   * Event controller that fires and notifies the listeners of any event
   * @readonly
   */
  get eventController () {
    return this._eventController
  }

  /**
   * Loads the runtime with an opcode
   * @param opcodes The program as given by the compiler
   */
  load(opcodes: RawProgram) {

    let error_mapping: ErrorLiteral[] = ['WALL', 'WORLDUNDERFLOW', 'BAGUNDERFLOW', 'INSTRUCTION'];

    this._rawOpcodes = opcodes;
    let function_map = {};
    this._functionNames = [];
    let function_idx = 0;
    this._program = new Int32Array(new ArrayBuffer(opcodes.length * 3 * 4));
    for (let i = 0; i < opcodes.length; i++) {
      const currentOpcode = opcodes[i];
      this._program[3 * i] = getOpCodeID(currentOpcode[0]);
      if (currentOpcode.length > 1) {
        this._program[3 * i + 1] = currentOpcode[1] as number;
      }
      
      if (currentOpcode[0] == "LINE") {
        this._program[3 * i + 2] = currentOpcode[2];
      }
      if (currentOpcode[0] == 'CALL') {
        if (!function_map.hasOwnProperty(currentOpcode[2])) {
          function_map[currentOpcode[2]] = function_idx;
          this._functionNames[function_idx++] = currentOpcode[2];
        }
        this._program[3 * i + 2] = function_map[currentOpcode[2]];
      } else if (currentOpcode[0] == 'EZ') {
        this._program[3 * i + 1] = error_mapping.indexOf(currentOpcode[1] as ErrorLiteral);
        if (this._program[3 * i + 1] == -1) {
          throw new Error('Invalid error: ' + currentOpcode[1]);
        }
      }
    }
    this.reset();
  }

  /**
   * Starts the execution
   * @private
   */
  private _start(): void {    
    this._state.clean = false;
    this._eventController.fireEvent(
      'start',
      this,
      { 
        type: "start",
        target: this, 
        world: this._world 
      }
    );
  }

  /**
   * Resets the state. **Does not** reset the world
   */
  reset() {

    this._state = {
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
      clean: true
    };

    if (this.debug) {
      this._eventController.fireEvent('debug', this, {
        type: "debug",
        target: this,
        message: JSON.stringify(this._rawOpcodes),
        debugType: 'program',
      });
    }
  }

  /**
   * Runs the program until the next Line instruction or until it stops running.
   * @returns {boolean} true if the code is still running after the step performed
   */
  step(): boolean {
    while (this._state.running) {
      try {
        if (this._program[3 * this._state.pc] == OpCodeID.LINE) {
          this.next();
          break;
        }
        this.next();
      } finally {
        if (!this._state.running) {
          this._eventController.fireEvent(
            'stop', 
            this, 
            { 
              type: "stop",
              target: this, 
              world: this._world,
            }
          );
        }
      }
    }

    return this._state.running;
  }

  /**
   * Executes the instruction at the program counter.
   * * @returns {boolean} true if the code is still running after the instruction executed
   */
  next(): boolean {
    if (this._state.clean) {
      this._start();
    }
    if (!this._state.running) return;
    let world = this._world;

    if (this._state.ic >= world.maxInstructions) {
      this._state.running = false;
      this._state.error = ErrorType.INSTRUCTION;

      return false;
    } else if (this._state.stackSize >= this._world.maxStackSize) {
      this._state.running = false;
      this._state.error = ErrorType.STACK;

      return false;
    }

    let rot;
    let di = [0, 1, 0, -1];
    let dj = [-1, 0, 1, 0];
    let paramCount, newSP, op1, op2, fname, params, line, fromFName, npc, tmp;
    try {
      if (this.debug) {
        this._eventController.fireEvent('debug', this, {
          type: "debug",
          target: this,
          message: JSON.stringify(
            this._program[3 * this._state.pc] +
            ' ' +
            this._rawOpcodes[this._state.pc],
          ),
          debugType: 'opcode',
        });
      }

      switch (this._program[3 * this._state.pc]) {
        case OpCodeID.HALT: {
          this._state.running = false;
          break;
        }

        case OpCodeID.LINE: {
          this._state.line = this._program[3 * this._state.pc + 1];
          this._state.column = this._program[3 * this._state.pc + 2];
          break;
        }

        case OpCodeID.LEFT: {
          this._state.ic++;
          this._world.orientation--;
          if (this._world.orientation < 0) {
            this._world.orientation = 3;
          }
          this._world.dirty = true;
          this._state.turnLeftCount++;
          if (
            this._world.maxTurnLeft >= 0 &&
            this._state.turnLeftCount > this._world.maxTurnLeft
          ) {
            this._state.running = false;
            this._state.error = ErrorType.INSTRUCTION_LEFT;
            this._state.errorData = {
              type: ErrorType.INSTRUCTION,
              instruction: 'LEFT'
            };
          }
          break;
        }

        case OpCodeID.WORLDWALLS: {
          this._state.stack[++this._state.sp] = world.walls(world.i, world.j);
          break;
        }

        case OpCodeID.ORIENTATION: {
          this._state.stack[++this._state.sp] = world.orientation;
          break;
        }

        case OpCodeID.ROTL: {
          rot = this._state.stack[this._state.sp] - 1;
          if (rot < 0) {
            rot = 3;
          }
          this._state.stack[this._state.sp] = rot;
          break;
        }

        case OpCodeID.ROTR: {
          rot = this._state.stack[this._state.sp] + 1;
          if (rot > 3) {
            rot = 0;
          }
          this._state.stack[this._state.sp] = rot;
          break;
        }

        case OpCodeID.MASK: {
          this._state.stack[this._state.sp] = 1 << this._state.stack[this._state.sp];
          break;
        }

        case OpCodeID.NOT: {
          this._state.stack[this._state.sp] =
            this._state.stack[this._state.sp] === 0 ? 1 : 0;
          break;
        }

        case OpCodeID.AND: {
          op2 = this._state.stack[this._state.sp--];
          op1 = this._state.stack[this._state.sp--];
          this._state.stack[++this._state.sp] = op1 & op2 ? 1 : 0;
          break;
        }

        case OpCodeID.OR: {
          op2 = this._state.stack[this._state.sp--];
          op1 = this._state.stack[this._state.sp--];
          this._state.stack[++this._state.sp] = op1 | op2 ? 1 : 0;
          break;
        }

        case OpCodeID.EQ: {
          op2 = this._state.stack[this._state.sp--];
          op1 = this._state.stack[this._state.sp--];
          if (KarelNumbers.isInfinite(op1)) {
            this._state.stack[++this._state.sp] = KarelNumbers.isInfinite(op2)?1:0;
          } else if (KarelNumbers.isInfinite(op2)) {
            this._state.stack[++this._state.sp] = 0;
          }else {
            this._state.stack[++this._state.sp] = op1 == op2 ? 1 : 0;
          }
          break;
        }

        case OpCodeID.EZ: {
          if (this._state.stack[this._state.sp--] === 0) {
            this._state.error = [ErrorType.WALL, ErrorType.WORLDUNDERFLOW, ErrorType.BAGUNDERFLOW][
              this._program[3 * this._state.pc + 1]
            ];
            this._state.running = false;
          }
          break;
        }

        case OpCodeID.JZ: {
          this._state.ic++;
          if (this._state.stack[this._state.sp--] === 0) {
            this._state.pc += this._program[3 * this._state.pc + 1];
          }
          break;
        }

        case OpCodeID.JMP: {
          this._state.ic++;
          this._state.pc += this._program[3 * this._state.pc + 1];
          break;
        }

        case OpCodeID.FORWARD: {
          this._state.ic++;
          this._world.i += di[this._world.orientation];
          this._world.j += dj[this._world.orientation];
          this._world.dirty = true;
          this._state.moveCount++;
          if (
            this._world.maxMove >= 0 &&
            this._state.moveCount > this._world.maxMove
          ) {
            this._state.running = false;
            this._state.error = ErrorType.INSTRUCTION_FORWARD;
            this._state.errorData = {
              type: ErrorType.INSTRUCTION,
              instruction: 'FORWARD'
            };
          }
          break;
        }

        case OpCodeID.WORLDBUZZERS: {
          this._state.stack[++this._state.sp] = this._world.buzzers(
            world.i,
            world.j,
          );
          break;
        }

        case OpCodeID.BAGBUZZERS: {
          this._state.stack[++this._state.sp] = this._world.bagBuzzers;
          break;
        }

        case OpCodeID.PICKBUZZER: {
          this._state.ic++;
          tmp = this._world.bagBuzzers
          this._world.pickBuzzer(this._world.i, this._world.j);
          if (!KarelNumbers.isInfinite(tmp)) {
            if (this._world.bagBuzzers > KarelNumbers.maximum) {
              this._state.running = false;
              this._state.error = ErrorType.BAGOVERFLOW;
            }
          }
          this._state.pickBuzzerCount++;
          if (
            this._world.maxPickBuzzer >= 0 &&
            this._state.pickBuzzerCount > this._world.maxPickBuzzer &&
            this._state.running // Gives priority to bag overflow
          ) {
            this._state.running = false;
            this._state.error = ErrorType.INSTRUCTION_PICKBUZZER;
            this._state.errorData = {
              type: ErrorType.INSTRUCTION,
              instruction: 'PICKBUZZER'
            };
          }
          break;
        }

        case OpCodeID.LEAVEBUZZER: {
          this._state.ic++;
          tmp = this._world.buzzers(this._world.i, this._world.j)
          this._world.leaveBuzzer(this._world.i, this._world.j);
          if (!KarelNumbers.isInfinite(tmp)) {
            if (this._world.buzzers(this._world.i, this._world.j) > KarelNumbers.maximum) {
              this._state.running = false;
              this._state.error = ErrorType.WORLDOVERFLOW;
            }
          }
          this._state.leaveBuzzerCount++;
          if (
            this._world.maxLeaveBuzzer >= 0 &&
            this._state.leaveBuzzerCount > this._world.maxLeaveBuzzer &&
            this._state.running // If world overflow flag was rised, that takes priority over this error.
          ) {
            this._state.running = false;
            this._state.error = ErrorType.INSTRUCTION_LEAVEBUZZER
            this._state.errorData = {
              type: ErrorType.INSTRUCTION,
              instruction: 'LEAVEBUZZER'
            };
          }
          break;
        }

        case OpCodeID.LOAD: {
          this._state.stack[++this._state.sp] = this._program[3 * this._state.pc + 1];
          break;
        }

        case OpCodeID.POP: {
          this._state.sp--;
          break;
        }

        case OpCodeID.DUP: {
          this._state.stack[++this._state.sp] = this._state.stack[this._state.sp - 1];
          break;
        }

        case OpCodeID.DEC: {          
          if (!KarelNumbers.isInfinite(this._state.stack[this._state.sp])) {
            this._state.stack[this._state.sp] -= this._program[3 * this._state.pc + 1];
            this.validateNumber(this._state.stack[this._state.sp]); 
          }
          break;
        }

        case OpCodeID.INC: {
          if (!KarelNumbers.isInfinite(this._state.stack[this._state.sp])) {
            this._state.stack[this._state.sp] += this._program[3 * this._state.pc + 1];
            this.validateNumber(this._state.stack[this._state.sp]);
          }
          break;
        }

        case OpCodeID.CALL: {
          this._state.ic++;
          // sp, pc, param
          paramCount = this._state.stack[this._state.sp--];
          newSP = this._state.sp - paramCount;
          fname = this._functionNames[this._program[3 * this._state.pc + 2]];

          this._state.stack[++this._state.sp] = this._state.fp;
          this._state.stack[++this._state.sp] = newSP;
          this._state.stack[++this._state.sp] = this._state.pc;
          this._state.stack[++this._state.sp] = paramCount;

          this._state.fp = newSP + 1 + paramCount;
          this._state.pc = this._program[3 * this._state.pc + 1];
          this._state.jumped = true;
          this._state.stackSize++;
          this._state.stackMemory += Math.max(1, paramCount);

          if (this._state.stackSize >= this._world.maxStackSize) {
            this._state.running = false;
            this._state.error = ErrorType.STACK;
          } else if (this._state.stackMemory >= this._world.maxStackMemory) {
            this._state.running = false;
            this._state.error = ErrorType.STACKMEMORY;
          } else if (paramCount > this._world.maxCallSize) {
            
            this._state.running = false;
            this._state.error = ErrorType.CALLSIZE;
          } else if (!this.disableStackEvents) {
            this._eventController.fireEvent('call', this, {
              type: "call",
              function: fname,
              params: this._state.stack.subarray(this._state.fp - paramCount, this._state.fp),
              line: this._state.line,
              target: this,
            });
          }
          break;
        }

        case OpCodeID.RET: {
          if (this._state.fp < 0) {
            this._state.running = false;
            break;
          }
          paramCount = this._state.stack[this._state.fp + 3];
          this._state.pc = this._state.stack[this._state.fp + 2];
          this._state.sp = this._state.stack[this._state.fp + 1];
          this._state.fp = this._state.stack[this._state.fp];
          this._state.stackSize--;
          this._state.stackMemory -= Math.max(1, paramCount);;
          if (!this.disableStackEvents) {
            params = this._state.stack.subarray(0,0);
            fromFName = this._functionNames[this._program[3 * this._state.pc + 2]];

            fname = "N/A";
            line = -2;
            if (this._state.stackSize >= 1) {
              npc = this._state.stack[this._state.fp + 2]; //Get the function name from the function that called me
              fname = this._functionNames[this._program[3 * npc + 2]];
              line = this._program[3 * (npc + 1) + 1]; //Get line. A call always is LINE -> LOAD PARAM -> CALL -> LINE
              paramCount = this._state.stack[this._state.fp + 3];
              params = this._state.stack.subarray(this._state.fp - paramCount, this._state.fp);
            }

            this._eventController.fireEvent('return', this,  {
              type: "return",
              target: this,
              params: params,
              function: fname,
              fromFunction: fromFName, 
              line: line,
              returnValue: this._state.ret
            });
          }
          break;
        }

        case OpCodeID.PARAM: {
          this._state.stack[++this._state.sp] =
            this._state.stack[
            this._state.fp - 1 - this._program[3 * this._state.pc + 1]
            ];
          break;
        }
        
        case OpCodeID.SRET: {
          this._state.ret = this._state.stack[this._state.sp--];
          break;
        }

        case OpCodeID.LRET: {
          this._state.stack[++this._state.sp] = this._state.ret;
          break;
        }

        case OpCodeID.LT: {
          op2 = this._state.stack[this._state.sp--];
          op1 = this._state.stack[this._state.sp--];
          if (KarelNumbers.isInfinite(op1)) {
            this._state.stack[++this._state.sp] = 0;
          } else if (KarelNumbers.isInfinite(op2)) {
            this._state.stack[++this._state.sp] = 1;
          }else {
            this._state.stack[++this._state.sp] = op1 < op2 ? 1 : 0;
          }
          break;
        }

        case OpCodeID.LTE: {          
          op2 = this._state.stack[this._state.sp--];
          op1 = this._state.stack[this._state.sp--];
          if (KarelNumbers.isInfinite(op1)) {
            this._state.stack[++this._state.sp] = KarelNumbers.isInfinite(op2)?1:0;
          } else if (KarelNumbers.isInfinite(op2)) {
            this._state.stack[++this._state.sp] = 1;
          }else {
            this._state.stack[++this._state.sp] = op1 <= op2 ? 1 : 0;
          }
          break;
        }

        case OpCodeID.ROW: 
          this._state.stack[++this._state.sp] = this._world.i
          break;
        
        case OpCodeID.COLUMN:
          this._state.stack[++this._state.sp] = this._world.j
          break;

        default: {
          this._state.running = false;
          if (this.debug) {
            this._eventController.fireEvent('debug', this, {
              type: "debug",
              target: this,
              message: 'Missing opcode ' + this._rawOpcodes[this._state.pc][0],
              debugType: 'opcode',
            });
          }

          this._state.error = ErrorType.INVALIDOPCODE;
          this._state.errorData = {
            type:ErrorType.INSTRUCTION,
            instruction: OpCodeID[this._program[this._state.pc*3]] as OpCodeLiteral
          }
          return false;
        }
      }

      if (this._state.jumped) {
        this._state.jumped = false;
      } else {
        this._state.pc++;
      }

      if (this.debug) {
        let copy = {
          pc: this._state.pc,
          stackSize: this._state.stackSize,
          expressionStack: Array.from(
            this._state.stack.slice(this._state.fp + 4, this._state.sp + 1),
          ),
          line: this._state.line,
          ic: this._state.ic,
          running: this._state.running,
        };
        this._eventController.fireEvent('debug', this, {
          type: "debug",
          target: this,
          message: JSON.stringify(copy),
          debugType: 'state',
        });
      }
    } catch (e) {
      this._state.running = false;
      console.error(e);
      console.log(e.stack);
      throw e;
    }

    return true;
  }

  /**
   * Validates a number and if it is over the top it stops the runtime and rises the related error
   * @param number Number to validate
   * @returns 
   */
  private validateNumber(number:number) {
    if (number < KarelNumbers.minimum) {
      this._state.running = false;
      this._state.error = ErrorType.INTEGERUNDERFLOW;
      return;
    }
    if (number > KarelNumbers.maximum) {
      this._state.running = false;
      this._state.error = ErrorType.INTEGEROVERFLOW;
      return;
    }
  }
}
