import { javaCompiler, pascalCompiler, detectLanguage, compile } from "./compiler/compiler";
import { World, DumpTypes } from "./world";
import { Runtime } from "./runtime";
import { java2PascalTranspiler, pascal2JavaTranspiler } from "./transpiler";
import { CompilationError } from "./compiler/InterRep/compileErrors";
import { DebugData } from "./compiler/debugData";
import { transpileCode } from "./transpiler/transpiler";

export {
  compile,
  detectLanguage,
  javaCompiler,
  java2PascalTranspiler,
  pascalCompiler,
  pascal2JavaTranspiler,
  transpileCode,
  Runtime,
  World,
  DumpTypes,
  CompilationError,
  DebugData
};