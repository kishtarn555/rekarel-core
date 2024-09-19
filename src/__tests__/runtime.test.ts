import { run } from "jest";
import { KarelRuntimeEventDetails } from "../eventTarget";
import { Runtime } from "../runtime";
import { World } from "../world";


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
});