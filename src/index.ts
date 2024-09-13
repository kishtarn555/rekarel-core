import { javaCompiler, pascalCompiler, detectLanguage, compile } from "./compiler/compiler";
import { World, DumpTypes } from "./world";
import { Runtime } from "./runtime";
import { java2PascalTranspiler, pascal2JavaTranspiler } from "./transpiler";
import { CompilationError } from "./compiler/InterRep/compileErrors";

export {
  compile,
  detectLanguage,
  javaCompiler,
  java2PascalTranspiler,
  pascalCompiler,
  pascal2JavaTranspiler,
  Runtime,
  World,
  DumpTypes,
  CompilationError
};