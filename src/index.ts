import { javaCompiler, pascalCompiler, detectLanguage, compile } from "./compiler/compiler";
import { World, DumpTypes } from "./world";
import { Runtime } from "./runtime";
import { CompilationError } from "./compiler/InterRep/compileErrors";
import { DebugData } from "./compiler/debugData";
import { transpileCode } from "./transpiler/transpiler";
import { generateOpcodesFromIR } from "./compiler/InterRep/IRProcessor";
import { generateJavaFromIR } from "./transpiler/javaTranspiler";
import { generatePascalFromIR } from "./transpiler/pascalTranspiler";

export {
  compile,
  detectLanguage,
  javaCompiler,
  pascalCompiler,
  transpileCode,
  Runtime,
  World,
  DumpTypes,
  CompilationError,
  DebugData,
  generateJavaFromIR,
  generateOpcodesFromIR,
  generatePascalFromIR
};