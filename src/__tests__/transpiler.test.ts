import { java2PascalTranspiler, pascalCompiler, javaCompiler } from "../index"

import fs from "fs"
describe("Java2Pascal tests ", ()=> {
    test("Test simple turnoff", ()=> {
        const turnoffJava = fs.readFileSync(__dirname +"/kj/turnoff.kj").toString();
        const javaResult = javaCompiler(turnoffJava);
        const pascal = java2PascalTranspiler (turnoffJava);
        const pascalResult = pascalCompiler(pascal);
        expect(javaResult).toEqual(pascalResult)
        
    });
});
