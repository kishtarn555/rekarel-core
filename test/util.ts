import { RawProgram } from "../src/compiler/opcodes";
import {  World } from "../src/index"

export function runAll(world:World, code:RawProgram) {
    world.runtime.load(code);
    world.runtime.start();
    while (world.runtime.state.running) {
        world.runtime.step();
    }
}


function processWorld(xml: string): string[] {
    const ans = xml.split(/\s+/g).filter(x => x);
    return ans;
}

export function validateOutput(real: string, expected: string) {
    expect(processWorld(real))
        .toEqual(processWorld(expected));
}