import { RawProgram } from "../../compiler/opcodes";
import { compile, World } from "../../index";
import { runAll } from "../world.test";
import { DOMParser } from '@xmldom/xmldom';

import fs from 'fs'
import path from 'path'

export function RunWorld(doc: Document, opcode: RawProgram) {
    const world = new World(10, 10);
    world.load(doc);
    runAll(world, opcode);
    return world.output();
}

function processWorld(xml: string): string[] {
    const ans = xml.split(/\s+/g).filter(x => x);
    return ans;
}

export function validateOutput(real: string, expected: string) {
    expect(processWorld(real))
        .toEqual(processWorld(expected));
}

export function simpleProblemTest (dirname:string) {
    const java = fs.readFileSync(`${dirname}/solution.kj`).toString();
    const pascal = fs.readFileSync(`${dirname}/solution.kp`).toString();
    const javaOpcode = compile(java);
    const pascalOpcode = compile(pascal);
    expect(javaOpcode).not.toBeNull();
    expect(pascalOpcode).not.toBeNull();
    const dirPath = `${dirname}/cases`;
    const files = fs.readdirSync(dirPath);
    files.forEach((file) => {
        test(`case ${file}`, async ()=>{
            const inFilePath = path.join(dirPath, file);

            // Check if the file has a .in extension
            if (path.extname(file) === '.in') {
                const outFilePath = path.join(dirPath, `${path.basename(file, '.in')}.out`);
                const XMLIn = fs.readFileSync(inFilePath).toString();
                const XMLOut = fs.readFileSync(outFilePath).toString();
                const inputDocument = new DOMParser().parseFromString(XMLIn, 'text/xml') as unknown as Document;
                const javaResult = RunWorld(inputDocument, javaOpcode[0]);
                const pascalResult = RunWorld(inputDocument, pascalOpcode[0]);
                validateOutput(javaResult, XMLOut);
                validateOutput(pascalResult, XMLOut);

            }
        }, 10000);
    });
}

describe("Dummy test", () => {
    it("dummy", ()=> {
        expect(true).toBe(true);
    })
})
