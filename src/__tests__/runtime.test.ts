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
});