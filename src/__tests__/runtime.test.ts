import { World } from "../index"
import { RawProgram } from "../opcodes";

describe("Runtime tests ", () => {

    test("Test event independency", () => {
        const world1 = new World(100, 100);
        const world2 = new World(100, 100);
        const code:RawProgram = [
            ['LINE', 6], ['LOAD', 2],
            ['CALL', 6, 'aba'], ['LINE', 6],
            ['LINE', 8], ['HALT'],
            ['LINE', 1], ['LINE', 2],
            ['WORLDWALLS'], ['ORIENTATION'],
            ['MASK'], ['AND'],
            ['NOT'], ['EZ', 'WALL'],
            ['FORWARD'], ['RET']
        ];
        let callCount = 0;
        world1.runtime.load(code);
        world2.runtime.load(code);

        world1.runtime.eventController.addEventListener("call", () => {
            callCount++;
        });
        world2.runtime.eventController.addEventListener("call", () => {
            expect(true).toBe(false); //This should not be called
        });

        world1.runtime.start();
        while (world1.runtime.state.running)
            world1.runtime.step();

        expect(callCount).toBe(1);
        
    });
});
