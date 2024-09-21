import { RawProgram } from "../compiler/opcodes";
import { compile, World } from "../index"

import fs from "fs"
import { runAll } from "./world.test";
const sourceFiles = [
    "turnoff.kj", 
    "importAll.kj", 
    "simpleFloor.kj", 
    "simpleBackpack.kj", 
    "globals.not.kj",
    "testInc.kj",
    "testDec.kj",
    "intfunc.kj",
    "ifReturn.kj"
]


const compilationError:[string,string | RegExp][] = [
    ["returnVoidToInt.kj", "Cannot return a type: VOID, in a function of type: INT"],
    ["returnIntToVoid.kj", "Cannot return a type: INT, in a function of type: VOID"],
    ["voidAsInt.kj", "Expected a term of type INT, but got VOID"],
    ["emptyReturn.kj", "Explicit return is required in function pasos"],
    ["halfTrueReturn.kj", "Explicit return is required in function pasos"],
    ["halfFalseReturn.kj", "Explicit return is required in function pasos"],
    ["undefinedCallInTerm.kj", "Undefined function: prueba"],
]



describe("Java compilation tests ", ()=> {
    test("Test simple turnoff", ()=> {
        const turnoffJava = fs.readFileSync(__dirname +"/kj/turnoff.kj").toString();
        const result = compile (turnoffJava);
        expect(result).toEqual([ [ 'LINE', 3, 2], [ 'HALT' ], [ 'LINE', 5, 0 ], [ 'HALT' ] ])
        
    });
    test("Test that codes compile correctly", ()=> {
        for (const file of sourceFiles) {
            const source = fs.readFileSync(__dirname +"/kj/"+file).toString();
            const result = compile (source);
            expect(Array.isArray(result)).toBe(true);
        }
        
    });

    test("Test simple sucede", () => {
        const source = fs.readFileSync(__dirname + "/kj/testInc.kj").toString();
        const opcodes = compile(source);
        expect(opcodes).toBeDefined()
        const world = new World(10, 10);
        world.setBagBuzzers(20);
        runAll(world, opcodes!);
        expect(world.buzzers(1, 1)).toBe(16);
        expect(world.bagBuzzers).toBe(4);

    });

    test("Test simple precede", () => {
        const source = fs.readFileSync(__dirname + "/kj/testDec.kj").toString();
        const opcodes = compile(source);
        expect(opcodes).toBeDefined()
        const world = new World(10, 10);
        world.setBagBuzzers(20);
        runAll(world, opcodes!);
        expect(world.buzzers(1, 1)).toBe(9);
        expect(world.bagBuzzers).toBe(11);

    });

    test("Test integer function", () => {
        const source = fs.readFileSync(__dirname + "/kj/intfunc.kj").toString();
        const opcodes = compile(source);
        expect(opcodes).toBeDefined()
        const world = new World(10, 10);
        world.setBagBuzzers(-1);
        runAll(world, opcodes!);
        expect(world.buzzers(1, 1)).toBe(5);
        expect(world.buzzers(10, 1)).toBe(40);
        expect(world.i).toBe(10); 
        expect(world.j).toBe(1);
        
    });
});

test("Test continue statement", () => {
    const source = fs.readFileSync(__dirname + "/kj/testContinue.kj").toString();
    const opcodes = compile(source);
    expect(opcodes).toBeDefined()
    const world = new World(10, 10);
    world.setBagBuzzers(-1);
    runAll(world, opcodes!);
    expect(world.buzzers(1, 1)).toBe(12);
    expect(world.orientation).toBe(1);    
});


describe("Test Java compilation errors" ,  ()=> {
    for (const [file, expectedError] of compilationError) {
        test("Test CE of "+file,  ()=> {
            const source = fs.readFileSync(__dirname + "/kj/ce/"+file).toString();
            expect( ()=> compile(source)).toThrow(expectedError);
        });
    }
});

describe("Java globals test ", ()=> {
    test("Test floor variable", ()=> {
        const floorSrc = fs.readFileSync(__dirname +"/kj/simpleFloor.kj").toString();
        const opcodes = compile (floorSrc);
        expect(opcodes).toBeDefined()
        const world = new World(10,10);
        world.setBuzzers(1, 1, 5);
        world.setBuzzers(3, 1, 2);
        world.setBagBuzzers(20);
        runAll(world, opcodes!);
        expect(world.buzzers(2, 1)).toBe(5);
        expect(world.buzzers(3, 1)).toBe(0);
        expect(world.bagBuzzers).toBe(17);
        
    });
    test("Test backpack variable", ()=> {
        const backpackSrc = fs.readFileSync(__dirname +"/kj/simpleBackpack.kj").toString();
        const opcodes = compile (backpackSrc);
        expect(opcodes).toBeDefined()
        const world = new World(25,25);
        world.setBagBuzzers(12);
        runAll(world, opcodes!);
        expect(world.i).toBe(13);
        expect(world.j).toBe(1);
        expect(world.buzzers(13, 1)).toBe(12);
        expect(world.bagBuzzers).toBe(0);
        
    });
    test("Test shadowing compilation error", ()=> {
        const backpackSrc = fs.readFileSync(__dirname +"/kj/globals.ce.kj").toString();
        expect(()=>compile (backpackSrc)).toThrow(
            /^Cannot name a parameter as a global variable/
        );
    });
    test("Test shadowing compilation error", ()=> {
        const src = fs.readFileSync(__dirname +"/kj/globals.ce.kj").toString();
        expect(()=>compile (src)).toThrow(
            /^Cannot name a parameter as a global variable/
        );
    });
    test("Test the compatibility when not importing", ()=> {
        const src = fs.readFileSync(__dirname +"/kj/globals.not.kj").toString();
        const opcodes = compile (src);
        expect(opcodes).toBeDefined()
        const world = new World(25,25);
        world.setBagBuzzers(120);
        world.setBuzzers(1,1,10);
        runAll(world, opcodes!);
        expect(world.buzzers(1, 1)).toBe(14);
        expect(world.bagBuzzers).toBe(116);
    });
});



describe("Test Java functions", ()=>{
    test("Multiple parameters", ()=> {
        const src = fs.readFileSync(__dirname + "/kj/multiParams.kj").toString();
        const opcodes = compile(src);
        expect(opcodes).toBeDefined()
        const world = new World(10, 10);
        world.setBagBuzzers(-1);
        runAll(world, opcodes!);
        expect(world.runtime.state.error).toBeUndefined();
        expect(world.buzzers(1, 1)).toBe(1);
        expect(world.buzzers(2, 1)).toBe(2);
        expect(world.buzzers(3, 1)).toBe(3);
    });
});