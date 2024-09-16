import { compile, World } from "../index";
import { runAll } from "./world.test";
import { DOMParser} from '@xmldom/xmldom';

const problemList = [
    "3 y 5", 
    "baches",
    "caminoMasCorto",
    "despliegaInstrucciones",
    "pegadito", 
];
import fs from "fs"
import path from "path"
import { RawProgram } from "../compiler/opcodes";

function RunWorld(doc: Document, opcode:RawProgram) {
    const world = new World(10,10);
    world.load(doc);
    runAll(world, opcode);
    return world.output();
}

function validateOutput(real:string, expected:string) {
    expect(real.trim().split(/[\s\n]+/g))
        .toEqual(expected.trim().split(/[\s\n]+/g));
}

describe("Test all problems", () => {
    for (const problem of problemList) {
        test(`Test solution of ${problem}`, () => {
            const java = fs.readFileSync(`${__dirname}/problems/${problem}/solution.kj`).toString();
            const pascal = fs.readFileSync(`${__dirname}/problems/${problem}/solution.kp`).toString();
            const javaOpcode = compile(java);
            const pascalOpcode = compile(pascal);
            expect(javaOpcode).not.toBeNull();
            expect(pascalOpcode).not.toBeNull();
            const dirPath = `${__dirname}/problems/${problem}/cases`;
            fs.readdir(dirPath, (err, files) => {
                if (err) {
                    console.error(`Error reading directory: ${err.message}`);
                    return;
                }
        
                files.forEach((file) => {
                    const inFilePath = path.join(dirPath, file);
        
                    // Check if the file has a .in extension
                    if (path.extname(file) === '.in') {
                        const outFilePath = path.join(dirPath, `${path.basename(file, '.in')}.out`);
                        const XMLIn = fs.readFileSync(inFilePath).toString();
                        const XMLOut = fs.readFileSync(outFilePath).toString();
                        const inputDocument = new DOMParser().parseFromString(XMLIn, 'text/xml') as unknown as Document;
                        const javaResult = RunWorld(inputDocument , javaOpcode!);
                        const pascalResult = RunWorld(inputDocument , pascalOpcode!);
                        validateOutput(javaResult, XMLOut);
                        validateOutput(pascalResult, XMLOut);
                        
                    }
                });
            });


        });
    }
});

