import { World } from "../index"

describe("World save", () => {
    test("Test save start vs current world", () => {
        const world = new World(100, 100);
        world.setBagBuzzers(50);
        world.addWall(4, 4, 3);
        world.setBuzzers(1, 1, 10);
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

    test("Test world setDumpCell", () => {
        const world = new World(10, 20);
        expect(world.dumpCells).toEqual([]);

        //Test inserts
        world.setDumpCell(1, 2, true);
        world.setDumpCell(5, 4, true);
        world.setDumpCell(8, 9, true);
        expect(world.dumpCells).toEqual([[1, 2], [5, 4], [8, 9]]);

        //Test removal
        world.setDumpCell(5, 4, false);
        expect(world.dumpCells).toEqual([[1, 2], [8, 9]]);

        //Test non element removal
        world.setDumpCell(3, 3, false);
        expect(world.dumpCells).toEqual([[1, 2], [8, 9]]);

        //Test repeated non element removal
        world.setDumpCell(5, 4, false);
        world.setDumpCell(5, 4, false);
        expect(world.dumpCells).toEqual([[1, 2], [8, 9]]);

        //Test already element insert
        world.setDumpCell(1, 2, true);
        expect(world.dumpCells).toEqual([[1, 2], [8, 9]]);

        //Test remove all
        world.setDumpCell(1, 2, false);
        world.setDumpCell(8, 9, false);
        expect(world.dumpCells).toEqual([]);

        //Test insertion after emptying it
        world.setDumpCell(6, 7, true);
        expect(world.dumpCells).toEqual([[6, 7]]);
    });

    test("Test that the border wall cannot be deleted", ()=> {
        const world = new World(5,5);
        const start = new Uint8Array( [
            0, 0, 0, 0, 0, 0, 
            9, 8, 8, 8, 12,
            1, 0, 0, 0, 4,
            1, 0, 0, 0, 4,
            1, 0, 0, 0, 4,
            3, 2, 2, 2, 6,
            0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0
        ]);

        expect(world.wallMap).toEqual(start);
        world.setWallMask(0,0, 15);
        world.setWallMask(6,6, 15);
        expect(world.wallMap).toEqual(start);        
        world.setWallMask(1,1, 0);        
        world.setWallMask(1,5, 0);        
        world.setWallMask(5,1, 0);        
        world.setWallMask(5,5, 0);        
        world.setWallMask(3,5, 0);        
        world.setWallMask(5,3, 0);        
        world.setWallMask(3,1, 0);        
        world.setWallMask(1,3, 0);        
        expect(world.wallMap).toEqual(start);    
        world.toggleWall(3,1, 0);        
        world.toggleWall(3,5, 2);        
        world.toggleWall(5,3, 1);        
        world.toggleWall(1,3, 3);        
        expect(world.wallMap).toEqual(start);
    });
});
