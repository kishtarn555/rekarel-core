import { RawProgram } from "../src/compiler/opcodes";
import { compile, World } from "../src/index";
import { runAll, validateOutput } from "./util";
import { DOMParser } from '@xmldom/xmldom';

import fs from 'fs'
import path from 'path'

export function RunWorld(doc: Document, opcode: RawProgram) {
    const world = new World(10, 10);
    world.load(doc);
    runAll(world, opcode);
    return world;
}

export function testRTE (dirname:string) {
    const source = fs.readFileSync(`${dirname}/code.kcode`).toString();
    const opcode = compile(source);
    expect(opcode).not.toBeNull();
    const dirPath = `${dirname}/cases`;
    const files = fs.readdirSync(dirPath);
    files.forEach((file) => {
        test.concurrent(`[rte] case ${file}`, async ()=>{
            const inFilePath = path.join(dirPath, file);

            // Check if the file has a .in extension
            if (path.extname(file) === '.in') {
                const outFilePath = path.join(dirPath, `${path.basename(file, '.in')}.out`);
                const XMLIn = fs.readFileSync(inFilePath).toString();
                const XMLOut = fs.readFileSync(outFilePath).toString();
                const inputDocument = new DOMParser().parseFromString(XMLIn, 'text/xml') as unknown as Document;
                const outputWorld = RunWorld(inputDocument, opcode[0]);
                const outputRuntimeState = outputWorld.runtime.state;
                expect(outputRuntimeState.error).toBeDefined();                
                const result = outputWorld.output();                
                validateOutput(result, XMLOut);

            }
        }, 10000);
    });
}


// Directory to iterate through
const problemsDir = path.join(__dirname, 'testsuite', 'rte');

function processProblemDirs() {
    // Get all subdirectories in problemsDir
    const problemDirs = fs.readdirSync(problemsDir).filter(dir => fs.lstatSync(path.join(problemsDir, dir)).isDirectory());

    problemDirs.forEach(problemDir => {
        const problemPath = path.join(problemsDir, problemDir);
        describe(`Problem ${problemDir}`,()=>testRTE(problemPath));
    });
}

processProblemDirs();