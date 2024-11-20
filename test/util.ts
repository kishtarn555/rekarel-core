import { RawProgram } from "../src/compiler/opcodes";
import {  World } from "../src/index"

export function runAll(world:World, code:RawProgram) {
    world.runtime.load(code);
    world.runtime.start();
    while (world.runtime.state.running) {
        world.runtime.step();
    }
}