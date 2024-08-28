import { compile } from "../index"

import fs from "fs"
const sourceFiles = ["turnoff.kj", "importAll.kj"]
describe("Java compilation tests ", ()=> {
    test("Test simple turnoff", ()=> {
        const turnoffJava = fs.readFileSync(__dirname +"/kj/turnoff.kj").toString();
        const result = compile (turnoffJava);
        expect(result).toEqual([ [ 'LINE', 3 ], [ 'HALT' ], [ 'LINE', 5 ], [ 'HALT' ] ])
        
    });
    test("Test that codes compile correctly", ()=> {
        for (const file of sourceFiles) {
            const source = fs.readFileSync(__dirname +"/kj/"+file).toString();
            const result = compile (source);
            expect(Array.isArray(result)).toBe(true);
        }
        
    });
});
