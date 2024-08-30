import { RawProgram } from "../compiler/opcodes";
import {  World } from "../index"

export function runAll(world:World, code:RawProgram) {
    world.runtime.load(code);
    world.runtime.start();
    while (world.runtime.state.running) {
        world.runtime.step();
    }
}


describe("World save", ()=> {
    test("Test save start vs current world", ()=> {
        const world = new World(100, 100);
        world.setBagBuzzers(50);
        world.addWall(4,4, 3);
        world.setBuzzers(1,1, 10);
        const before_start = world.save("start");
        const before_current = world.save("current");
        expect(before_start).toEqual(before_current); // Check that current and start match at the beginning
        world.runtime.load([
            ['PICKBUZZER'], 
            ['FORWARD'], 
            ['LEAVEBUZZER']
        ]);
        world.runtime.start();
        while (world.runtime.state.running)
            world.runtime.step();
        
        
        const after_start = world.save("start");
        const after_current = world.save("current"); 
        expect(after_start).not.toEqual(after_current); // Check that current and start shouldn't be the same
        expect(before_start).toEqual(after_start); // Check that both start should be equal

        
    });
});
