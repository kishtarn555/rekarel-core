import { DumpTypes, World, WorldOutput } from "../index"

describe("Test parsing from world", ()=> {
    it("Test worldOutput from World", ()=> {
        const world = new World(10, 20);
        world.setDumps(DumpTypes.DUMP_ALL_BUZZERS, true);
        world.setDumps(DumpTypes.DUMP_BAG, true);
        world.setDumps(DumpTypes.DUMP_POSITION, true);
        world.setDumps(DumpTypes.DUMP_ORIENTATION, true);
        for (let i = 1; i <=20; i++) {
            for (let j = 1; j <= 10; j++) {
                world.setBuzzers(i, j, i*100+j);
            }
        }
        world.setBagBuzzers(15);
        world.rotate("SUR");
        world.move(4, 5);
        const output = new WorldOutput(world);
        for (let i = 1; i <=20; i++) {
            for (let j = 1; j <= 10; j++) {
                expect(output.buzzers(i, j)).toBe(i*100+j);
            }
        }
        expect(output.bagBuzzers).toBe(15);
        expect(output.i).toBe(4);
        expect(output.j).toBe(5);
        expect(output.error).toBe(null)
        expect(output.moveCount).toBe(null)
        expect(output.turnLeftCount).toBe(null)
        expect(output.leaveBuzzerCount).toBe(null)
        expect(output.pickBuzzerCount).toBe(null)
    });

})