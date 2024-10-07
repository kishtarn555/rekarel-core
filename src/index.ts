import { javaCompiler, pascalCompiler, detectLanguage, compile } from "./compiler/compiler";
import { World, DumpTypes } from "./world";
import { Runtime } from "./runtime";
import { CompilationError } from "./compiler/InterRep/compileErrors";
import { DebugData } from "./compiler/debugData";
import { transpileCode } from "./transpiler/transpiler";

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
  DebugData
};