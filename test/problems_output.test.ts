import { RawProgram } from "../src/compiler/opcodes";
import { compile, World, WorldOutput } from "../src/index";
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

export function simpleProblemTest (dirname:string) {
    const solutionPath = path.join(dirname, 'solution.kj');
    const codePath = path.join(dirname, 'code.kcode');
    
    let source: string;
    if (fs.existsSync(solutionPath)) {
        source = fs.readFileSync(solutionPath).toString();
    } else if (fs.existsSync(codePath)) {
        source = fs.readFileSync(codePath).toString();
    } else {
        throw new Error(`Neither solution.kj nor code.kcode exists in ${dirname}`);
    }    const opcodes = compile(source);
    expect(opcodes).not.toBeNull();
    const dirPath = `${dirname}/cases`;
    const files = fs.readdirSync(dirPath);
    files.forEach((file) => {
        test.concurrent(`case ${file}`, async ()=>{
            const inFilePath = path.join(dirPath, file);

            // Check if the file has a .in extension
            if (path.extname(file) === '.in') {
                const outFilePath = path.join(dirPath, `${path.basename(file, '.in')}.out`);
                const XMLIn = fs.readFileSync(inFilePath).toString();
                const XMLOut = fs.readFileSync(outFilePath).toString();
                const inputDocument = new DOMParser().parseFromString(XMLIn, 'text/xml') as unknown as Document;
                const outputDocument = new DOMParser().parseFromString(XMLOut, 'text/xml') as unknown as Document;
                const result = RunWorld(inputDocument, opcodes[0]);
                const output = new WorldOutput(result);
                expect(output.compareToOutput(result)).toBe(true);
                output.load(outputDocument);
                expect(output.compareToOutput(result)).toBe(true);

            }
        }, 10000);
    });
}


// Directory to iterate through
const problemsDir = path.join(__dirname, 'testsuite', 'problems');
const rteDir = path.join(__dirname, 'testsuite', 'rte');


function processProblemDirs(directory: string) {
    // Get all subdirectories in problemsDir
    const problemDirs = fs.readdirSync(directory).filter(dir => fs.lstatSync(path.join(directory, dir)).isDirectory());

    problemDirs.forEach(problemDir => {
        const problemPath = path.join(directory, problemDir);
        describe(`Problem ${problemDir}`,()=>simpleProblemTest(problemPath));
    });
}

processProblemDirs(problemsDir);
processProblemDirs(rteDir);