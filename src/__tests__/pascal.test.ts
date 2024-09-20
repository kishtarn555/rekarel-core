// TODO: Fix this some time
import { compile, World } from "../index"

import fs from "fs"
import { runAll } from "./world.test";

/**
 * All valid source files, this list is tested for it to compile correctly
 */
const sourceFiles = [
    "turnoff.kp", 
    "simpleFloor.kp", 
    "simpleBackpack.kp", 
    "globals.not.kp",
    "testInc.kp", 
    "testDec.kp",
    "ifReturn.kp",
    "protoTypeTest.kp"
]


const compilationError:[string,string | RegExp][] = [
    ["returnVoidToInt.kp", "Cannot return a type: VOID, in a function of type: INT"],
    ["returnIntToVoid.kp", "Cannot return a type: INT, in a function of type: VOID"],
    ["voidAsInt.kp", "Expected a term of type INT, but got VOID"],
    ["emptyReturn.kp", "Explicit return is required in function pasos"],
    ["halfTrueReturn.kp", "Explicit return is required in function pasos"],
    ["halfFalseReturn.kp", "Explicit return is required in function pasos"],
    ["prototypeType.kp", "Prototype type mismatch: pasos"],
    ["undefinedCallInTerm.kp", "Undefined function or variable: prueba"],
]



describe("Pascal compilation tests ", () => { 
    test("Test simple turnoff", () => {
        const source = fs.readFileSync(__dirname + "/kp/turnoff.kp").toString();
        const result = compile(source);
        expect(result).toEqual([['LINE', 3, 2], ['HALT'], ['LINE', 5, 0], ['HALT']])

    });

    test("Test simple sucede", () => {
        const source = fs.readFileSync(__dirname + "/kp/testInc.kp").toString();
        const opcodes = compile(source);
        expect(opcodes).toBeDefined()
        const world = new World(10, 10);
        world.setBagBuzzers(20);
        runAll(world, opcodes!);
        expect(world.buzzers(1, 1)).toBe(16);
        expect(world.bagBuzzers).toBe(4);

    });

    test("Test simple precede", () => {
        const source = fs.readFileSync(__dirname + "/kp/testDec.kp").toString();
        const opcodes = compile(source);
        expect(opcodes).toBeDefined()
        const world = new World(10, 10);
        world.setBagBuzzers(20);
        runAll(world, opcodes!);
        expect(world.buzzers(1, 1)).toBe(9);
        expect(world.bagBuzzers).toBe(11);

    });

    test("Test integer function", () => {
        const source = fs.readFileSync(__dirname + "/kp/intfunc.kp").toString();
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

    test("Test continue statement", () => {
        const source = fs.readFileSync(__dirname + "/kp/testContinue.kp").toString();
        const opcodes = compile(source);
        expect(opcodes).toBeDefined()
        const world = new World(10, 10);
        world.setBagBuzzers(-1);
        runAll(world, opcodes!);
        expect(world.buzzers(1, 1)).toBe(12);
        expect(world.orientation).toBe(0);    
    });
});


describe("Test Pascal compilation errors" ,  ()=> {
    for (const [file, expectedError] of compilationError) {
        test("Test CE of "+file,  ()=> {
            const source = fs.readFileSync(__dirname + "/kp/ce/"+file).toString();
            expect( ()=> compile(source)).toThrow(expectedError);
        });
    }
});


describe("Test Pascal compilations", ()=> {
    for (const file of sourceFiles) {
        test(`Test compilation of ${file}`, ()=> {            
            const source = fs.readFileSync(__dirname +"/kp/"+file).toString();
            const result = compile (source);
            expect(Array.isArray(result)).toBe(true);            
            
        });
    }
})

describe("Pascal globals test ", () => {
    test("Test floor variable", () => {
        const floorSrc = fs.readFileSync(__dirname + "/kp/simpleFloor.kp").toString();
        const opcodes = compile(floorSrc);
        expect(opcodes).toBeDefined()
        const world = new World(10, 10);
        world.setBuzzers(1, 1, 5);
        world.setBuzzers(3, 1, 2);
        world.setBagBuzzers(20);
        runAll(world, opcodes!);
        expect(world.buzzers(2, 1)).toBe(5);
        expect(world.buzzers(3, 1)).toBe(0);
        expect(world.bagBuzzers).toBe(17);

    });
    test("Test backpack variable", () => {
        const backpackSrc = fs.readFileSync(__dirname + "/kp/simpleBackpack.kp").toString();
        const opcodes = compile(backpackSrc);
        expect(opcodes).toBeDefined()
        const world = new World(25, 25);
        world.setBagBuzzers(12);
        runAll(world, opcodes!);
        expect(world.i).toBe(13);
        expect(world.j).toBe(1);
        expect(world.buzzers(13, 1)).toBe(12);
        expect(world.bagBuzzers).toBe(0);

    });

    test("Test shadowing compilation error", () => {
        const backpackSrc = fs.readFileSync(__dirname + "/kp/globals.ce.kp").toString();
        expect(() => compile(backpackSrc)).toThrow(
            /^Cannot name a parameter as a global variable/
        );
    });

    test("Test the compatibility when not importing", () => {
        const src = fs.readFileSync(__dirname + "/kp/globals.not.kp").toString();
        const opcodes = compile(src);
        expect(opcodes).toBeDefined()
        const world = new World(25, 25);
        world.setBagBuzzers(120);
        world.setBuzzers(1, 1, 10);
        runAll(world, opcodes!);
        expect(world.buzzers(1, 1)).toBe(14);
        expect(world.bagBuzzers).toBe(116);
    });
});