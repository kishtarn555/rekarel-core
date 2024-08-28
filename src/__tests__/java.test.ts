import { compile } from "../index"

import fs from "fs"
describe("Java compilation tests ", ()=> {
    test("Test simple turnoff", ()=> {
        const turnoffJava = fs.readFileSync(__dirname +"/kj/turnoff.kj").toString();
        const result = compile (turnoffJava);
        expect(result).toEqual([ [ 'LINE', 3 ], [ 'HALT' ], [ 'LINE', 5 ], [ 'HALT' ] ])
        
    });
});
