import { transpileCode } from "../index"

import fs from "fs"
describe("Transpiler tests ", ()=> {
    test("Test stability", ()=> {
        const allJava = fs.readFileSync(__dirname +"/kj/allCode.kj").toString();
        const allPascal = fs.readFileSync(__dirname +"/kp/allCode.kp").toString();

        const java_java = transpileCode(allJava, "java");
        const java_java_java = transpileCode(java_java, "java");
        //The transpiler should be stable
        expect(java_java).toBe(java_java_java);

        const pascal_pascal = transpileCode(allPascal, "pascal");
        const pascal_pascal_pascal = transpileCode(pascal_pascal, "pascal");
        //The transpiler should be stable
        expect(pascal_pascal).toBe(pascal_pascal_pascal);
        
    });
    
});

describe("", ()=> {    
    const codes:Record<string,[string,string]> = {
        rowVar:["kp/simpleRow.kp", "kj/simpleRow.kj"],
        columnVar:["kp/simpleColumn.kp", "kj/simpleColumn.kj"],
        backpackVar:["kp/simpleBackpack.kp", "kj/simpleBackpack.kj"],
        floorVar:["kp/simpleFloor.kp", "kj/simpleFloor.kj"],
    }
    for (const [caseName, sources] of Object.entries(codes)) {
        const [pascalCode, javaCode] = sources;
        test(`Test ${caseName}`, ()=> {
            const allJava = fs.readFileSync(`${__dirname}/${javaCode}`).toString();
            const allPascal = fs.readFileSync(`${__dirname}/${pascalCode}`).toString();

            const java_java = transpileCode(allJava, "java");
            const java_pascal = transpileCode(allJava, "pascal");

            const pascal_java = transpileCode(allPascal, "java");
            const pascal_pascal = transpileCode(allPascal, "pascal");

            expect(java_java).toBe(pascal_java);
            expect(java_pascal).toBe(pascal_pascal);
        })
        
    }

    
})
