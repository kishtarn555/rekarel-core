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
        runtime.next();
        expect(runtime.state.ret).toBe(12);
        runtime.next();
        expect(runtime.state.ret).toBe(12);
        runtime.next();
        expect(runtime.state.ret).toBe(10);



    });
});