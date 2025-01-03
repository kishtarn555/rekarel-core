
import { Parser } from "./jison_types";

declare const karelpascal: Parser;

declare function pascalParser(...args: any[]): ReturnType<typeof karelpascal.parse>;

export { karelpascal, pascalParser };
