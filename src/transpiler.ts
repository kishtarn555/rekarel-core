import { RawProgram } from './compiler/opcodes.js';

import { java2pascalParser as j2pImported} from './java2pascal.js';
import { pascal2javaParser as p2jImported} from './pascal2java.js';

export type Transpiler = (code:string) => string

const java2PascalTranspiler: Transpiler = j2pImported as unknown as Transpiler;
const pascal2JavaTranspiler: Transpiler = p2jImported as unknown as Transpiler;


export {java2PascalTranspiler, pascal2JavaTranspiler}