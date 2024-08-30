import { RawProgram } from "../compiler/opcodes";
import { compile, World } from "../index"

import fs from "fs"
import { runAll } from "./world.test";
const sourceFiles = ["turnoff.kj", "importAll.kj", "simpleFloor.kj", "simpleBackpack.kj", "globals.not.kj"]



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