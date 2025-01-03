
import { Parser } from "./jison_types";

declare const kareljava: Parser;

declare function javaParser(...args: any[]): ReturnType<typeof kareljava.parse>;

export { kareljava, javaParser };
