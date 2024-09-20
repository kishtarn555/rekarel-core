import { CompilationError } from "./compileErrors";
import type { IRTerm, IRInstruction, IRTagRecord, IRVar, IRCall, IRRet, IRParam, IRSemiSimpleInstruction, IRRepeat, IRWhile, IRConditional } from "./IRInstruction";
import { YY } from "./IRParserTypes";
import { DefinitionTable } from "./IRVarTable";
import { Scope } from "./Scope";


/**
 * Represents the info after traversing an AST
 */
type ASTInfo = {
    explicitReturn: boolean
}

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
                error: CompilationError.Errors.BINARY_OPERATOR_TYPE_ERROR,
                operator: tree.operation,
                loc: tree.loc,
                line: tree.loc.first_line - 1,
                expectedType: "BOOL",
                actualType: leftType,
                direction: "LEFT"
            });
        }
        if (rightType !== "BOOL") {
            yy.parser.parseError(`${tree.operation} operator uses booleans terms only, right is of type: ${rightType}`, {
                error: CompilationError.Errors.BINARY_OPERATOR_TYPE_ERROR,
                operator: tree.operation,
                loc: tree.loc,
                line: tree.loc.first_line - 1,
                expectedType: "BOOL",
                actualType: rightType,
                direction: "RIGHT"
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
                error: CompilationError.Errors.COMPARISON_TYPE,
                loc: tree.loc,
                line: tree.loc.first_line - 1,
                leftType: leftType,
                rightType: rightType
            });
        }
        if (leftType === "VOID") {
            yy.parser.parseError(`An equality comparison cannot be performed on VOID`, {
                error: CompilationError.Errors.VOID_COMPARISON,
                loc: tree.loc,
                line: tree.loc.first_line - 1,
                leftType: leftType,
                rightType: rightType
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
                error: CompilationError.Errors.BINARY_OPERATOR_TYPE_ERROR,
                loc: tree.loc,
                operator: tree.operation,
                line: tree.loc.first_line - 1,
                direction: "LEFT",
                expectedType: "INT",
                actualType: leftType
            });
        }
        if (rightType !== "INT") {
            yy.parser.parseError(`${tree.operation} operator uses integer terms only, right is of type: ${rightType}`, {
                error: CompilationError.Errors.BINARY_OPERATOR_TYPE_ERROR,
                loc: tree.loc,
                operator: tree.operation,
                direction: "RIGHT",
                line: tree.loc.first_line - 1,
                expectedType: "INT",
                actualType: rightType
            });
        }
        target.push([tree.operation]);
        return tree.dataType;
    }

    if (tree.operation === "NOT") {
        const termType = resolveTerm(tree.term, definitions, scope, target, tags, yy);
        if (termType !== "BOOL") {
            yy.parser.parseError(`${tree.operation} operator uses a boolean terms only, but tried to negate a term of type: ${termType}`, {
                error: CompilationError.Errors.UNARY_OPERATOR_TYPE_ERROR,
                loc: tree.loc,
                operator: tree.operation,
                line: tree.loc.first_line - 1,
                expectedType: "BOOL",
                actualType: termType
            });
        }
        target.push([tree.operation]);
        return tree.dataType;
    }
    if (tree.operation === "PASS") {
        const termType = resolveTerm(tree.term, definitions, scope, target, tags, yy);
        if (termType !== tree.dataType) {
            yy.parser.parseError(`Expected a term of type ${tree.dataType}, but got ${termType}`, {
                error: CompilationError.Errors.TYPE_ERROR,
                loc: tree.loc,
                line: tree.loc.first_line - 1,
                expectedType: tree.dataType,
                actualType: termType
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
        target.push(["LOAD", 0]); // Load 0 parameters
        if (!definitions.hasFunction(data.target)) {           
            yy.parser.parseError("Undefined function or variable: " + data.target, {
                error: CompilationError.Errors.UNDEFINED_FUNCTION,
                functionName: data.target,
                line: data.loc.first_line - 1,
                loc: data.loc
            }); 
        }
        target.push(["LINE", data.loc.first_line - 1, data.loc.first_column]);
        target.push([
            "CALL",
            {
                target: data.target,
                nameLoc: data.loc,
                expectedType: data.expectedType,
                params: [],

            }
        ]);
        target.push(["LINE", data.loc.first_line - 1, data.loc.first_column]);
        target.push(["LRET"]);
        return;
    }

    yy.parser.parseError("Unknown variable or parameter: " + data.target, {
        error: CompilationError.Errors.UNKNOWN_VARIABLE,
        variable: data.target,
        line: data.loc.first_line - 1,
        loc: data.loc
    });
}


function resolveCall(data: IRCall, definitions: DefinitionTable, scope:Scope, target: IRSemiSimpleInstruction[], tags: IRTagRecord, yy: YY) {
    for (const parameter of data.params) {
        resolveTerm(parameter, definitions, scope, target, tags, yy);
    }
    target.push(["LOAD", data.params.length]);
    
    target.push(
        ["LINE", data.nameLoc.first_line - 1, data.nameLoc.first_column]
    );
    if (!definitions.hasFunction(data.target)) {
        yy.parser.parseError("Undefined function: " + data.target, {
            error: CompilationError.Errors.UNDEFINED_FUNCTION,
            functionName: data.target,
            line: data.nameLoc.first_line - 1,
            loc: data.nameLoc
        });
        return null;
    }

    target.push(["CALL", data]);
    target.push(
        ["LINE", data.nameLoc.first_line - 1, data.nameLoc.first_column]
    );


}
function resolveReturn(data: IRRet, definitions: DefinitionTable, scope:Scope, target: IRSemiSimpleInstruction[], tags: IRTagRecord, yy: YY) {
    const retType = resolveTerm(data.term, definitions, scope,  target, tags, yy);
    if (scope.expectedReturn !== retType) {
        yy.parser.parseError(`Cannot return a type: ${retType}, in a function of type: ${scope.expectedReturn}`, {
            error: CompilationError.Errors.RETURN_TYPE,
            line: data.loc.first_line - 1,
            loc: data.loc,
            expectedType: scope.expectedReturn,
            actualType: retType
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
    const loopScope = scope.withContinueBreakTarget(
        data.continueTag,
        data.endTag
    );
    // Add loop body
    resolveListWithASTs(
        data.instructions,
        definitions,
        loopScope,
        target,
        tags,
        yy
    );
    // Add loop end logic
    resolveListWithASTs(
        [            
            ['TAG', data.continueTag],
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
    const whileScope = scope.withContinueBreakTarget(
        data.repeatTag,
        data.endTag
    )
    // Add loop body
    resolveListWithASTs(
        data.instructions,
        definitions,
        whileScope,
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

function resolveConditional(data: IRConditional, definitions: DefinitionTable, scope:Scope, target: IRSemiSimpleInstruction[], tags: IRTagRecord, yy: YY): ASTInfo {
    let trueReturns = false, falseReturns = false;
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
    trueReturns = resolveListWithASTs(
        data.trueCase,
        definitions,
        scope,
        target,
        tags,
        yy
    ).explicitReturn;
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
        falseReturns = resolveListWithASTs(
            data.falseCase,
            definitions,
            scope,
            target,
            tags,
            yy
        ).explicitReturn;        
        resolveListWithASTs(
            [["TAG", data.skipFalseTag]],
            definitions,
            scope,
            target,
            tags,
            yy
        );        
    }

    return {
        explicitReturn: trueReturns && falseReturns
    }
    
}



/**
 * @throws Iterates through an IR list and resolve any AST it finds
 * @param tree The ast expression to solve
 * @param definitions Definition table
 * @param yy Requiered to emmit compilation error
 * @returns Returns the equivalent AST into IRInstructions without AST
 */
export function resolveListWithASTs(IRInstructions: IRInstruction[], definitions: DefinitionTable, scope: Scope, target: IRSemiSimpleInstruction[], tags: IRTagRecord, yy: YY): ASTInfo {
    const info: ASTInfo = {
        explicitReturn: false
    };
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
            info.explicitReturn = true;
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
            
            const ifInfo = resolveConditional(instruction[1], definitions, scope, target, tags, yy);
            if (ifInfo.explicitReturn) {
                info.explicitReturn = true;
            }
            continue;
        }
              
        if (instruction[0] === "CONTINUE"  ) {
            if (scope.continueTarget == null) {
                yy.parser.parseError("Cannot use continue in this scope", {
                    error: CompilationError.Errors.ILLEGAL_CONTINUE,
                    loc: instruction[1],
                    line: instruction[1].first_line - 1
                })
            }
            target.push(["TJMP", scope.continueTarget]);
            continue;
        }
              
        if (instruction[0] === "BREAK"  ) {
            if (scope.breakTarget == null) {
                yy.parser.parseError("Cannot use break in this scope", {
                    error: CompilationError.Errors.ILLEGAL_BREAK,
                    loc: instruction[1],
                    line: instruction[1].first_line - 1
                })
            }
            target.push(["TJMP", scope.breakTarget]);
            
            continue;
        }

        

        target.push(instruction);
    }
    return info;
}