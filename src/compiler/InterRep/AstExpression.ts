import type { IRTerm, IRInstruction, IRTagRecord, IRVar, IRCall } from "./IRInstruction";
import { YY } from "./IRParserTypes";
import { DefinitionTable } from "./IRVarTable";


/**
 * @throws If the AST is not type correct
 * @param tree The ast expression to solve
 * @param table Definition table
 * @param yy Requiered to emmit compilation error
 * @returns Returns the equivalent AST into IRInstructions without AST
 */
function resolveTerm(tree: IRTerm, definitions: DefinitionTable, parameters: string[], target: IRInstruction[], tags: IRTagRecord, yy: YY): string {
    if (tree.operation === "ATOM") {
        resolveListWithASTs(tree.instructions, definitions, parameters, target, tags, yy);
        if (tree.dataType.startsWith("$")) {
            const termType = tree.dataType.substring(1);
            if (parameters.includes(termType)) {
                return "INT";
            }
            return definitions.getType(tree.dataType.substring(1));
        }
        return tree.dataType;
    }

    if (tree.operation === "AND" || tree.operation === "OR") {        
        const leftType = resolveTerm(tree.left, definitions, parameters, target, tags, yy);
        const rightType = resolveTerm(tree.right, definitions, parameters, target, tags, yy);
        if (leftType !== "BOOL") {
            yy.parser.parseError(`${tree.operation} operator uses booleans terms only, left is of type: ${leftType}`, {
                //FIXME: Add data (?)
            } );
        }
        if (rightType !== "BOOL") {
            yy.parser.parseError(`${tree.operation} operator uses booleans terms only, right is of type: ${rightType}`, {
                //FIXME: Add data (?)
            } );
        }
        target.push([tree.operation]);
        return tree.dataType;
    }
    if (tree.operation === "NOT") {        
        const termType = resolveTerm(tree.term, definitions, parameters, target, tags, yy);        
        if (termType !== "BOOL") {
            yy.parser.parseError(`${tree.operation} operator uses a boolean terms only, but tried to negate a term of type: ${termType}`, {
                //FIXME: Add data (?)
            } );
        }        
        target.push([tree.operation]);
        return tree.dataType;
    }
    if (tree.operation === "PASS") {
        const termType = resolveTerm(tree.term, definitions, parameters, target, tags, yy);        
        if (termType !== tree.dataType) {
            yy.parser.parseError(`Expected a term of type ${tree.dataType}, but got ${termType}`, {
                //FIXME: Add data (?)
            } );
        }
        return tree.dataType;  

    }

}


function resolveVar(data: IRVar, definitions: DefinitionTable, parameters: string[], target: IRInstruction[], yy: YY) {
    const parameterIdx = parameters.indexOf(data.target);
    if (parameterIdx !== -1) {
        target.push(["PARAM", parameterIdx]);
        return;
    }

    if (definitions.hasVar(data.target)) {
        const IRs = definitions.getVar(data.target).instructions;
        for (const instruction of IRs) {
            target.push(instruction);
        }
        return;
    }

    if (data.couldBeFunction) {
        //Resolve as an parameterless call
        target.push(["LOAD", 0]); //FIXME: Don't forget to remove me after you change how variables work!
        target.push([
            "CALL",
            {
                target: data.target,
                argCount: 1,
                argLoc: data.loc,
                nameLoc: data.loc,
                expectedType: data.expectedType,
                params:[],
                
            }
        ]);
        target.push(["LRET"]);
        return;
    }

    yy.parser.parseError("Unknown variable or parameter: " + data.target, {
        text: data.target,
        line: data.loc.first_line - 1,
        loc: data.loc
    });
}


function resolveCall(data: IRCall, definitions: DefinitionTable, parameters: string[], target: IRInstruction[], tags: IRTagRecord, yy: YY) {
    target.push(
        ["LINE", data.nameLoc.first_line]
    );
    for (const parameter of data.params) {
        resolveTerm(parameter, definitions, parameters, target, tags, yy);
    }
    target.push(["CALL", data]); 
    target.push(
        ["LINE", data.nameLoc.first_line]
    );


}

/**
 * @throws Iterates through an IR list and resolve any AST it finds
 * @param tree The ast expression to solve
 * @param definitions Definition table
 * @param yy Requiered to emmit compilation error
 * @returns Returns the equivalent AST into IRInstructions without AST
 */
export function resolveListWithASTs(IRInstructions: IRInstruction[], definitions: DefinitionTable, parameters: string[], target: IRInstruction[], tags: IRTagRecord, yy: YY) {
    for (const instruction of IRInstructions) {
        // Fixme: All vars should be in terms
        if (instruction[0] === "VAR") {
            resolveVar(instruction[1], definitions, parameters, target, yy);
            continue;
        }

        if (instruction[0] === "TERM") {
            resolveTerm(instruction[1], definitions, parameters, target, tags, yy);
            continue;
        }

        if (instruction[0] === "TAG") {
            tags[instruction[1]] = target.length;
            continue;
        }

        if (instruction[0] === "CALL") {
            resolveCall(instruction[1], definitions, parameters, target, tags, yy);
            continue;
        }

        target.push(instruction);
    }
}