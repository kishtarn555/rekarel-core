import type { IRTerm, IRInstruction, IRTagRecord, IRVar, IRCall, IRRet, IRParam, IRSemiSimpleInstruction, IRRepeat, IRWhile, IRConditional } from "./IRInstruction";
import { YY } from "./IRParserTypes";
import { DefinitionTable } from "./IRVarTable";
import { Scope } from "./Scope";

/**
 * @throws If the AST is not type correct
 * @param tree The ast expression to solve
 * @param table Definition table
 * @param yy Requiered to emmit compilation error
 * @param scope.expectedReturn The type of the return in the current scope
 * @returns Returns the equivalent AST into IRInstructions without AST
 */
function resolveTerm(tree: IRTerm, definitions: DefinitionTable, scope:Scope, target: IRSemiSimpleInstruction[], tags: IRTagRecord, yy: YY): string {
    if (tree.operation === "ATOM") {
        resolveListWithASTs(tree.instructions, definitions, scope, target, tags, yy);
        if (tree.dataType.startsWith("$")) {
            const termType = tree.dataType.substring(1);
            if (scope.parameters.some(e =>  e.name === termType)) {
                return "INT";
            }
            return definitions.getType(tree.dataType.substring(1));
        }
        return tree.dataType;
    }

    if (tree.operation === "AND" || tree.operation === "OR") {
        const leftType = resolveTerm(tree.left, definitions, scope, target, tags, yy);
        const rightType = resolveTerm(tree.right, definitions, scope, target, tags, yy);
        if (leftType !== "BOOL") {
            yy.parser.parseError(`${tree.operation} operator uses booleans terms only, left is of type: ${leftType}`, {
                //FIXME: Add data (?)
            });
        }
        if (rightType !== "BOOL") {
            yy.parser.parseError(`${tree.operation} operator uses booleans terms only, right is of type: ${rightType}`, {
                //FIXME: Add data (?)
            });
        }
        target.push([tree.operation]);
        return tree.dataType;
    }
    
    if (tree.operation === "EQ") {
        const leftType = resolveTerm(tree.left, definitions, scope, target, tags, yy);
        const rightType = resolveTerm(tree.right, definitions, scope, target, tags, yy);
        if (leftType !== rightType) {
            yy.parser.parseError(`An equality comparison cannot be performed between type ${leftType} and ${rightType}`, {
                //FIXME: Add data (?)
            });
        }
        target.push([tree.operation]);
        return tree.dataType;
    }

    

    if (tree.operation === "LT" || tree.operation === "LTE") {
        const leftType = resolveTerm(tree.left, definitions, scope, target, tags, yy);
        const rightType = resolveTerm(tree.right, definitions, scope, target, tags, yy);
        if (leftType !== "INT") {
            yy.parser.parseError(`${tree.operation} operator uses integer terms only, left is of type: ${leftType}`, {
                //FIXME: Add data (?)
            });
        }
        if (rightType !== "INT") {
            yy.parser.parseError(`${tree.operation} operator uses integer terms only, right is of type: ${rightType}`, {
                //FIXME: Add data (?)
            });
        }
        target.push([tree.operation]);
        return tree.dataType;
    }

    if (tree.operation === "NOT") {
        const termType = resolveTerm(tree.term, definitions, scope, target, tags, yy);
        if (termType !== "BOOL") {
            yy.parser.parseError(`${tree.operation} operator uses a boolean terms only, but tried to negate a term of type: ${termType}`, {
                //FIXME: Add data (?)
            });
        }
        target.push([tree.operation]);
        return tree.dataType;
    }
    if (tree.operation === "PASS") {
        const termType = resolveTerm(tree.term, definitions, scope, target, tags, yy);
        if (termType !== tree.dataType) {
            yy.parser.parseError(`Expected a term of type ${tree.dataType}, but got ${termType}`, {
                //FIXME: Add data (?)
            });
        }
        return tree.dataType;

    }

}


function resolveVar(data: IRVar, definitions: DefinitionTable, scope:Scope, target: IRSemiSimpleInstruction[], yy: YY) {
    const parameterIdx = scope.parameters.findIndex(e => data.target === e.name);
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
                argLoc: data.loc,
                nameLoc: data.loc,
                expectedType: data.expectedType,
                params: [],

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


function resolveCall(data: IRCall, definitions: DefinitionTable, scope:Scope, target: IRSemiSimpleInstruction[], tags: IRTagRecord, yy: YY) {
    target.push(
        ["LINE", data.nameLoc.first_line - 1]
    );
    for (const parameter of data.params) {
        resolveTerm(parameter, definitions, scope, target, tags, yy);
    }
    target.push(["LOAD", data.params.length]);
    target.push(["CALL", data]);
    target.push(
        ["LINE", data.nameLoc.first_line - 1]
    );


}
function resolveReturn(data: IRRet, definitions: DefinitionTable, scope:Scope, target: IRSemiSimpleInstruction[], tags: IRTagRecord, yy: YY) {
    const retType = resolveTerm(data.term, definitions, scope,  target, tags, yy);
    if (scope.expectedReturn !== retType) {
        yy.parser.parseError(`Cannot return a type: ${retType}, in a function of type: ${scope.expectedReturn}`, {
            line: data.loc.first_line - 1,
            loc: data.loc
        });
    }
    target.push(["SRET"]);
    target.push(["RET", data]);


}


function resolveRepeat(data: IRRepeat, definitions: DefinitionTable, scope:Scope, target: IRSemiSimpleInstruction[], tags: IRTagRecord, yy: YY) {
    // Add line marker
    target.push(data.line);    
    // Add load counter
    resolveTerm(
        data.loopCount[1],
        definitions,
        scope,
        target,
        tags,
        yy
    );    
    // Add counter logic
    resolveListWithASTs(
        [
            ['TAG', data.repeatTag],
            ['DUP'],
            ['LOAD', 0], 
            ['EQ'], 
            ['NOT'], 
            ['TJZ', data.endTag]
        ],
        definitions,
        scope,
        target,
        tags,
        yy
    );
    // Add loop body
    resolveListWithASTs(
        data.instructions,
        definitions,
        scope,
        target,
        tags,
        yy
    );
    // Add loop end logic
    resolveListWithASTs(
        [            
            ['DEC', 1], 
            ['TJMP', data.repeatTag], 
            ['TAG', data.endTag],
            ['POP'], 
        ],
        definitions,
        scope,
        target,
        tags,
        yy
    );

}

/**
 * Resolves a while
 * @param data 
 * @param definitions 
 * @param scope.parameters 
 * @param scope.expectedReturn 
 * @param target 
 * @param tags 
 * @param yy 
 */
function resolveWhile(data: IRWhile, definitions: DefinitionTable, scope:Scope, target: IRSemiSimpleInstruction[], tags: IRTagRecord, yy: YY) {
    // Add repeat tag
    resolveListWithASTs(
        [
            ['TAG', data.repeatTag],
        ],
        definitions,
        scope,
        target,
        tags,
        yy
    );
    // Add line marker
    target.push(data.line);   
    // Add condition check
    resolveTerm(
        data.condition[1],
        definitions,
        scope,
        target,
        tags,
        yy
    );    
    // Add skip logic
    resolveListWithASTs(
        [
            ['TJZ',  data.endTag]
        ],
        definitions,
        scope,
        target,
        tags,
        yy
    );
    // Add loop body
    resolveListWithASTs(
        data.instructions,
        definitions,
        scope,
        target,
        tags,
        yy
    );
    // Add loop end logic
    resolveListWithASTs(
        [            
            ['TJMP', data.repeatTag],
            ['TAG', data.endTag],
        ],
        definitions,
        scope,
        target,
        tags,
        yy
    );

}

function resolveConditional(data: IRConditional, definitions: DefinitionTable, scope:Scope, target: IRSemiSimpleInstruction[], tags: IRTagRecord, yy: YY) {
    // Add line marker
    target.push(data.line);

    resolveTerm(
        data.condition[1], 
        definitions, 
        scope,
        target, 
        tags, 
        yy
    );
    resolveListWithASTs(
        [["TJZ", data.skipTrueTag]],
        definitions,
        scope,
        target,
        tags,
        yy
    );
    resolveListWithASTs(
        data.trueCase,
        definitions,
        scope,
        target,
        tags,
        yy
    );
    if (data.skipFalseTag) {
        resolveListWithASTs(
            [["TJMP", data.skipFalseTag]],
            definitions,
            scope,
            target,
            tags,
            yy
        );
    }
    resolveListWithASTs(
        [["TAG", data.skipTrueTag]],
        definitions,
        scope,
        target,
        tags,
        yy
    );
    if (data.skipFalseTag && data.falseCase) {
        resolveListWithASTs(
            data.falseCase,
            definitions,
            scope,
            target,
            tags,
            yy
        );        
        resolveListWithASTs(
            [["TAG", data.skipFalseTag]],
            definitions,
            scope,
            target,
            tags,
            yy
        );        
    }
    
}



/**
 * @throws Iterates through an IR list and resolve any AST it finds
 * @param tree The ast expression to solve
 * @param definitions Definition table
 * @param yy Requiered to emmit compilation error
 * @returns Returns the equivalent AST into IRInstructions without AST
 */
export function resolveListWithASTs(IRInstructions: IRInstruction[], definitions: DefinitionTable, scope: Scope, target: IRSemiSimpleInstruction[], tags: IRTagRecord, yy: YY) {
    for (const instruction of IRInstructions) {
        // Fixme: All vars should be in terms
        if (instruction[0] === "VAR") {
            resolveVar(instruction[1], definitions, scope, target, yy);
            continue;
        }

        if (instruction[0] === "TERM") {
            resolveTerm(instruction[1], definitions, scope, target, tags, yy);
            continue;
        }

        if (instruction[0] === "TAG") {
            tags[instruction[1]] = target.length;
            continue;
        }

        if (instruction[0] === "CALL") {
            resolveCall(instruction[1], definitions, scope, target, tags, yy);
            continue;
        }
        if (instruction[0] === "RET"  ) {
            if (instruction[1] === "__DEFAULT") {
                //set SRET to 0
                target.push(["LOAD",0])
                target.push(["SRET"])
                target.push(instruction);
                continue;
            }
            resolveReturn(instruction[1], definitions, scope, target, tags, yy);
            continue;
        }        
        if (instruction[0] === "REPEAT"  ) {
            
            resolveRepeat(instruction[1], definitions, scope, target, tags, yy);
            continue;
        }      
        if (instruction[0] === "WHILE"  ) {
            
            resolveWhile(instruction[1], definitions, scope, target, tags, yy);
            continue;
        }
              
        if (instruction[0] === "IF"  ) {
            
            resolveConditional(instruction[1], definitions, scope, target, tags, yy);
            continue;
        }

        

        target.push(instruction);
    }
}