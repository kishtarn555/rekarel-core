import { run } from "jest";
import { KarelRuntimeEventDetails } from "../eventTarget";
import { Runtime } from "../runtime";
import { World } from "../world";
import { KarelNumbers } from "../constants";
import { OpCode, RawProgram } from "../compiler/opcodes";
import { kareljava } from "../kareljava";


describe("Test runtime", () => {

    test("Test SRET", () => {
        const world = new World(10,10)
        const runtime = new Runtime(world);
        world.runtime = runtime;
        runtime.load([
            ["LOAD", 12],
            ["SRET"],
            ["LOAD", 10],
            ["SRET"]
        ]);
        runtime.next();
            expect(runtime.state.error).toBeUndefined(); 
        runtime.next();
            expect(runtime.state.error).toBeUndefined(); 
            expect(runtime.state.ret).toBe(12);
            expect(runtime.state.sp).toBe(-1);
            runtime.next();
            expect(runtime.state.error).toBeUndefined(); 
            expect(runtime.state.ret).toBe(12);
            runtime.next();
            expect(runtime.state.error).toBeUndefined(); 
            expect(runtime.state.ret).toBe(10);
            expect(runtime.state.sp).toBe(-1);
        });
        
        test("Test LRET", () => {
        const world = new World(10,10)
        const runtime = new Runtime(world);
        world.runtime = runtime;
        runtime.load([
            ["LOAD", 12],
            ["SRET"],
            ["LOAD", 1],
            ["LRET"]
        ]);
        runtime.next();
        expect(runtime.state.error).toBeUndefined();  
        runtime.next();
        expect(runtime.state.error).toBeUndefined();  
        runtime.next();
        expect(runtime.state.error).toBeUndefined();  
        runtime.next();
        expect(runtime.state.error).toBeUndefined();
        expect(runtime.state.ret).toBe(12);        
        expect(runtime.state.stack[0]).toBe(1);
        expect(runtime.state.stack[1]).toBe(12);    
    });
    
    test("Test LT", () => {
        const world = new World(10,10)
        const runtime = new Runtime(world);
        world.runtime = runtime;
        runtime.load([
            ["LOAD", 2],
            ["LOAD", 5],
            ["LT"],

            ["POP"],            
            ["LOAD", 5],
            ["LOAD", 2],
            ["LT"],

            ["POP"],            
            ["LOAD", 5],
            ["LOAD", 5],
            ["LT"],
            
        ]);
        runtime.next();
        expect(runtime.state.error).toBeUndefined();  
        runtime.next();
        expect(runtime.state.error).toBeUndefined();  
        runtime.next();
        expect(runtime.state.error).toBeUndefined();  
        expect(runtime.state.stack[0]).toBe(1);
        expect(runtime.state.sp).toBe(0);

        
        runtime.next();
        expect(runtime.state.error).toBeUndefined();
          
        runtime.next();
        expect(runtime.state.error).toBeUndefined();  
        runtime.next();
        expect(runtime.state.error).toBeUndefined();  
        runtime.next();
        expect(runtime.state.stack[0]).toBe(0);
        expect(runtime.state.sp).toBe(0);
        
        runtime.next();
        expect(runtime.state.error).toBeUndefined();
          
        runtime.next();
        expect(runtime.state.error).toBeUndefined();  
        runtime.next();
        expect(runtime.state.error).toBeUndefined();  
        runtime.next();
        expect(runtime.state.error).toBeUndefined();  
        expect(runtime.state.stack[0]).toBe(0);
        expect(runtime.state.sp).toBe(0);
        
        expect(runtime.state.error).toBeUndefined();  
    });

    
    
    test("Test LTE",() => {
        const world = new World(10,10)
        const runtime = new Runtime(world);
        world.runtime = runtime;
        runtime.load([
            ["LOAD", 2],
            ["LOAD", 5],
            ["LTE"],

            ["POP"],            
            ["LOAD", 5],
            ["LOAD", 2],
            ["LTE"],

            ["POP"],            
            ["LOAD", 5],
            ["LOAD", 5],
            ["LTE"],
            
        ]);
        runtime.next();
        expect(runtime.state.error).toBeUndefined();  
        runtime.next();
        expect(runtime.state.error).toBeUndefined();  
        runtime.next();
        expect(runtime.state.error).toBeUndefined();  
        expect(runtime.state.stack[0]).toBe(1);
        expect(runtime.state.sp).toBe(0);

        
        runtime.next();
        expect(runtime.state.error).toBeUndefined();
          
        runtime.next();
        expect(runtime.state.error).toBeUndefined();  
        runtime.next();
        expect(runtime.state.error).toBeUndefined();  
        runtime.next();
        expect(runtime.state.stack[0]).toBe(0);
        expect(runtime.state.sp).toBe(0);
        
        runtime.next();
        expect(runtime.state.error).toBeUndefined();
          
        runtime.next();
        expect(runtime.state.error).toBeUndefined();  
        runtime.next();
        expect(runtime.state.error).toBeUndefined();  
        runtime.next();
        expect(runtime.state.error).toBeUndefined();  
        expect(runtime.state.stack[0]).toBe(1);
        expect(runtime.state.sp).toBe(0);
        
        expect(runtime.state.error).toBeUndefined();  
    });

    test("Test COLUMN", ()=> {
        const world = new World(10, 10);
        world.orientation = 2;
        const runtime = new Runtime(world);
        world.runtime = runtime;

        runtime.load([
            ["COLUMN"],
            ["FORWARD"],
            ["COLUMN"],
            ["LEFT"],
            ["FORWARD"],
            ["COLUMN"],
        ]);
        for (let i =0; i < 6; i++) {
            runtime.next();
            expect(runtime.state.error).toBeUndefined();
        }
        expect(runtime.state.stack[0]).toBe(1);
        expect(runtime.state.stack[1]).toBe(2); 
        expect(runtime.state.stack[2]).toBe(2); 
    });

    test("Test ROW", ()=> {
        const world = new World(10, 10);
        world.orientation = 2;
        const runtime = new Runtime(world);
        world.runtime = runtime;

        runtime.load([
            ["ROW"],
            ["FORWARD"],
            ["ROW"],
            ["LEFT"],
            ["FORWARD"],
            ["ROW"],
            ["FORWARD"],
            ["ROW"],
        ]);
        for (let i =0; i < 8; i++) {
            runtime.next();
            expect(runtime.state.error).toBeUndefined();
        }
        expect(runtime.state.stack[0]).toBe(1);
        expect(runtime.state.stack[1]).toBe(1); 
        expect(runtime.state.stack[2]).toBe(2); 
        expect(runtime.state.stack[3]).toBe(3); 
    });

    test("Test function events",() => {
        const world = new World(10,10)
        const runtime = new Runtime(world);
        world.runtime = runtime;
        runtime.load([
            ["LOAD", 3],
            ["LOAD", 1],
            ["LINE", 1, 0],
            ["CALL", 6, "F1"],
            ["LINE", 1, 0],
            ["HALT"],
            ["LOAD", 1],
            ["LOAD", 2],
            ["LOAD", 2],            
            ["LINE", 2, 0],
            ["CALL", 12, "F2"],
            ["LINE", 2, 0],
            ["RET"]
            
        ]);
        const events: KarelRuntimeEventDetails[] = []

        const expectedEvents: KarelRuntimeEventDetails[] = [
            {
                type: "call",
                function: "F1",
                line: 1,
                params: new Int32Array([3]),
                // @ts-ignore
                target: null
            },
            {
                type: "call",
                function: "F2",
                line: 2,
                params: new Int32Array([1, 2]),
                // @ts-ignore
                target: null
            },
            {
                type: "return",
                function: "F1",
                line: 1,
                params: new Int32Array([3]),
                fromFunction: "F2",
                returnValue: 0,
                // @ts-ignore
                target: null
            },
            {
                type: "return",
                function: "N/A",
                line: -2,
                params: new Int32Array([]),
                returnValue: 0,
                fromFunction: "F1",
                // @ts-ignore
                target: null
            },
        ]
        
        runtime.eventController.addEventListener("call", e=> {             
            // @ts-ignore
            e.details.target = null;
            events.push(e.details);
        });
        runtime.eventController.addEventListener("return", e=> {             
            // @ts-ignore
            e.details.target = null;
            events.push(e.details);
        });
        for (let i =0; i < runtime.program.length; i++)
            runtime.next();
        expect(events).toMatchObject(expectedEvents);
    });

    test("Test function events",() => {
        const world = new World(10,10)
        const runtime = new Runtime(world);
        world.runtime = runtime;
        runtime.load([
            ["LINE",0,0],
            ["LOAD", 1],
            ["LOAD", 2],
            ["LOAD", 3],
            ["LOAD", 4],
            ["LOAD", 5],
            ["LOAD", 6],
            ["LOAD", 6],
            ["CALL", 10, "_"],
            ["LINE",0,0],
            ["HALT"]
        ])
        while (runtime.step()) {
            //step
        }
        expect(runtime.state.error).toBeDefined()
        expect(runtime.state.error).toBe("CALLSIZE")

    });

    test("Test infinite bag", ()=> {        
        const world = new World(10,10)
        world.setBagBuzzers(KarelNumbers.a_infinite);

        const runtime = new Runtime(world);
        world.runtime = runtime;

        let program:RawProgram = []
        for (let i =1; i < world.maxInstructions; i++)
            program.push(["LEAVEBUZZER"]);
        program.push(["HALT"]);
        runtime.load(program);

        while (runtime.step());  

        expect(runtime.state.error).toBeUndefined();
        expect(KarelNumbers.isInfinite(world.bagBuzzers)).toBe(true);
    });

    

    test("Test infinite cell", ()=> {        
        const world = new World(10,10)
        world.setBuzzers(1, 1, KarelNumbers.a_infinite);

        const runtime = new Runtime(world);
        world.runtime = runtime;

        let program:RawProgram = []
        for (let i =1; i < world.maxInstructions; i++)
            program.push(["PICKBUZZER"]);
        program.push(["HALT"]);
        runtime.load(program);

        while (runtime.step());       

        expect(runtime.state.error).toBeUndefined();
        expect(KarelNumbers.isInfinite(world.buzzers(1,1))).toBe(true);
        expect(world.bagBuzzers).toBe(world.maxInstructions-1);
    });
});

describe("Test numeric values", ()=> {
    test.each([
        [KarelNumbers.maximum, 1],
        [5, KarelNumbers.maximum]
    ])(
        "Test overflow", (start, delta)=> {
            const world = new World(10,10)
            

            const runtime = new Runtime(world);
            world.runtime = runtime;

            let program:RawProgram = [
                ["LOAD", start],
                ["INC", delta]
            ]
            
            runtime.load(program);
            while (runtime.step());
            expect(runtime.state.error).toBe("INTEGEROVERFLOW");
        }
    );
    test.each([
        [KarelNumbers.minimum, 1],
        [KarelNumbers.minimum+5, 100]
    ])(
        "Test underflow", (start, delta)=> {
            const world = new World(10,10)
            

            const runtime = new Runtime(world);
            world.runtime = runtime;

            let program:RawProgram = [
                ["LOAD", start],
                ["DEC", delta]
            ]
            
            runtime.load(program);
            while (runtime.step());
            expect(runtime.state.error).toBe("INTEGERUNDERFLOW");
        }
    );

    test("Test negative comparison", ()=> {
        const world = new World(10,10)           

        const runtime = new Runtime(world);
        world.runtime = runtime;

        let program:RawProgram = [
            ["LOAD", 0],
            ["DEC", 1],            
            ["DUP"],
            ["LOAD", 0],
            ["LT"],
            ["JZ", 1],
            ["FORWARD"],
            ["HALT"],
            ["HALT"],
        ]
        
        runtime.load(program);
        while (runtime.step());
        expect(runtime.state.error).toBeUndefined();
        expect(runtime.state.moveCount).toBe(1);
        expect(world.i).toBe(2);
        expect(runtime.state.stack[0]).toBe(-1);
    })

    

    test.each([
        [KarelNumbers.a_infinite, KarelNumbers.a_infinite, "LT", 0],
        [KarelNumbers.a_infinite, KarelNumbers.a_infinite, "LTE", 1],
        [KarelNumbers.a_infinite, KarelNumbers.a_infinite, "EQ", 1],
        [KarelNumbers.a_infinite+2, KarelNumbers.a_infinite, "LT", 0],
        [KarelNumbers.a_infinite+2, KarelNumbers.a_infinite, "LTE", 1],
        [KarelNumbers.a_infinite+2, KarelNumbers.a_infinite, "EQ", 1],
        [KarelNumbers.maximum, KarelNumbers.a_infinite, "LT", 1],
        [KarelNumbers.maximum, KarelNumbers.a_infinite, "LTE", 1],
        [KarelNumbers.a_infinite+2, KarelNumbers.maximum, "LT", 0],
        [KarelNumbers.a_infinite+2, KarelNumbers.maximum, "LTE", 0],
    ])("Test infinite comparison", (first, second, op, expected)=> {
        const world = new World(10,10)           

        const runtime = new Runtime(world);
        world.runtime = runtime;

        let program:RawProgram = [
            ["LOAD",first],
            ["LOAD", second],            
            [op as "LT" | "LTE" | "EQ" ],
            ["HALT"]
        ]
        
        runtime.load(program);
        while (runtime.step());
        expect(runtime.state.error).toBeUndefined();
        expect(runtime.state.stack[0]).toBe(expected);
    })

})


describe("Test beepers", ()=> {
    test("Test world overflow", ()=> {
        const world = new World(10,10)           
        world.setBuzzers(1,1, KarelNumbers.maximum);

        const runtime = new Runtime(world);
        world.runtime = runtime;

        let program:RawProgram = [
            ["LEAVEBUZZER"],
            ["HALT"]
        ]
        
        runtime.load(program);
        while (runtime.step());
        expect(runtime.state.error).toBe("WORLDOVERFLOW");
    })
});