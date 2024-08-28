import { javaCompiler, pascalCompiler, detectLanguage, compile } from "./compiler.js";
import { World } from "./world";
import { Runtime } from "./runtime";
import { java2PascalTranspiler, pascal2JavaTranspiler } from "./transpiler.js";

export {
  compile,
  detectLanguage,
  javaCompiler,
  java2PascalTranspiler,
  pascalCompiler,
  pascal2JavaTranspiler,
  Runtime,
  World,
};