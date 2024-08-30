import { getOpCodeID } from "../compiler/opcodes";

describe("OpCode test", ()=> {
    test("Test Halt Opcode", ()=> {
        const id = getOpCodeID("HALT");
        expect(id).toBe(0);
    });
});
