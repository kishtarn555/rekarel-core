import { DOMParser } from '@xmldom/xmldom';

import { KarelNumbers, World } from "../index"



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
        while (world.runtime.state.running)
            world.runtime.step();


        const after_start = world.save("start");
        const after_current = world.save("current");
        expect(after_start).not.toEqual(after_current); // Check that current and start shouldn't be the same
        expect(before_start).toEqual(after_start); // Check that both start should be equal
    });

    test("Test world setDumpCell", () => {
        const world = new World(10, 20);
        
        function compareDumpCells(arr:[number,number, boolean][], length: number) {
            expect(world.getDumpCellCount()).toBe(length);
            for (let i=0; i < arr.length; i++) {
                expect(world.getDumpCell(arr[i][0], arr[i][1])).toBe(arr[i][2]);
            }
        }

        compareDumpCells([
            [1, 2, false], 
            [8, 9, false], 
            [5, 4, false],
            [3, 3, false],
            [6, 7, false]
        ], 0);
        //Test inserts
        world.setDumpCell(1, 2, true);
        world.setDumpCell(5, 4, true);
        world.setDumpCell(8, 9, true);

        
        compareDumpCells([
            [1, 2, true], 
            [8, 9, true], 
            [5, 4, true],
            [3, 3, false],
            [6, 7, false]
        ], 3);

        //Test removal
        world.setDumpCell(5, 4, false);
        compareDumpCells([
            [1, 2, true], 
            [8, 9, true], 
            [5, 4, false],
            [3, 3, false],
            [6, 7, false]
        ], 2);

        //Test non element removal
        world.setDumpCell(3, 3, false);
        compareDumpCells([
            [1, 2, true], 
            [8, 9, true], 
            [5, 4, false],
            [3, 3, false],
            [6, 7, false]
        ], 2);

        //Test repeated non element removal
        world.setDumpCell(5, 4, false);
        world.setDumpCell(5, 4, false);
        
        compareDumpCells([
            [1, 2, true], 
            [8, 9, true], 
            [5, 4, false],
            [3, 3, false],
            [6, 7, false]
        ], 2);
        //Test already element insert
        world.setDumpCell(1, 2, true);        
        compareDumpCells([
            [1, 2, true], 
            [8, 9, true], 
            [5, 4, false],
            [3, 3, false],
            [6, 7, false]
        ], 2);

        //Test remove all
        world.setDumpCell(1, 2, false);
        world.setDumpCell(8, 9, false);
        
        compareDumpCells([
            [1, 2, false], 
            [8, 9, false], 
            [5, 4, false],
            [3, 3, false],
            [6, 7, false]
        ], 0);

        //Test insertion after emptying it
        world.setDumpCell(6, 7, true);
        
        compareDumpCells([
            [1, 2, false], 
            [8, 9, false], 
            [5, 4, false],
            [3, 3, false],
            [6, 7, true]
        ], 1);
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

        function compareWalls() {
            for (let i =1; i <= 5; i++) {
                for (let j=1; j<= 5; j++) {
                    expect(world.walls(i, j)).toBe(start[i*5+j]);
                }
            }
        }

        compareWalls();
        world.setWallMask(0,0, 15);
        world.setWallMask(6,6, 15);
        compareWalls();
        world.setWallMask(1,1, 0);
        world.setWallMask(1,5, 0);
        world.setWallMask(5,1, 0);
        world.setWallMask(5,5, 0);
        world.setWallMask(3,5, 0);
        world.setWallMask(5,3, 0);
        world.setWallMask(3,1, 0);
        world.setWallMask(1,3, 0);
        compareWalls();
        world.toggleWall(3,1, 0);
        world.toggleWall(3,5, 2);
        world.toggleWall(5,3, 1);
        world.toggleWall(1,3, 3);
        compareWalls();
    });

    test("Test dumpcell outside the world return false",()=> {
        const world = new World(2, 2);
        world.setDumpCell(1, 1, true);
        world.setDumpCell(1, 2, true);
        world.setDumpCell(2, 1, true);
        world.setDumpCell(2, 2, true);

        for (let i = -2; i <= 4; i++) {
            for (let j = -2; j <=4; j++) {
                expect(world.getDumpCell(i, j)).toBe(i >= 1 && j>=1 && i <= 2 && j <=2);
            }
        }
        
    });

    test("Test toggle in the world border",()=> {
        const world = new World(3, 3);

        expect(world.getDumpCell(1,1)).toBe(false);
        world.toggleDumpCell(1,1);
        expect(world.getDumpCell(1,1)).toBe(true);

        expect(world.getDumpCell(2,2)).toBe(false);
        world.toggleDumpCell(2,2);
        expect(world.getDumpCell(2,2)).toBe(true);

        expect(world.getDumpCell(3,3)).toBe(false);
        world.toggleDumpCell(3,3);
        expect(world.getDumpCell(3,3)).toBe(true);
        world.toggleDumpCell(3,3);
        expect(world.getDumpCell(3,3)).toBe(false);
        
        expect(world.getDumpCell(2,3)).toBe(false);
        world.toggleDumpCell(2,3);
        expect(world.getDumpCell(2,3)).toBe(true);
        
        expect(world.getDumpCell(3,1)).toBe(false);
        world.toggleDumpCell(3,1);
        expect(world.getDumpCell(3,1)).toBe(true);
    });


    test("Test world save-load idempotency", ()=> {
        const world = new World(10, 10);
        world.setDumpCell(1, 4, true);
        world.setBuzzers(3, 2, 5);
        world.setBuzzers(3, 4, KarelNumbers.a_infinite);
        world.setBagBuzzers(13);

        const firstSave = world.save("start");
        const firstXML = new DOMParser().parseFromString(firstSave, 'text/xml') as unknown as Document;
        const world2 = new World(3, 2);
        world2.load(firstXML);
        const secondSave = world2.save("current");
        expect(firstSave).toEqual(secondSave);


    })
});
