import { KarelNumbers } from "../../constants";
import { CompilationError } from "./compileErrors";
import type { IRTerm, IRInstruction, IRTagRecord, IRVar, IRCall, IRRet, IRParam, IRSemiSimpleInstruction, IRRepeat, IRWhile, IRConditional } from "./IRInstruction";
import { YY } from "./IRParserTypes";
import { DefinitionTable } from "./IRVarTable";
import { Scope } from "./Scope";


/**
 * Represents the info after traversing an AST subtree
 */
type ASTInfo = {
    /**
     * True if the AST subtree always has an explicit return
     */
    explicitReturn: boolean
}

/**
 * Resolves a Term
 * @throws If the AST is not type correct
 * @param tree The ast expression to solve
 * @param table Definition table
 * @param yy Requiered to emmit compilation error
 * @param scope.expectedReturn The type of the return in the current scope
 * @returns Returns the dataType the term resolved to.
 */
function resolveTerm(tree: IRTerm, definitions: DefinitionTable, scope:Scope, target: IRSemiSimpleInstruction[], tags: IRTagRecord, yy: YY): string {
    if (tree.operation === "ATOM") {
        resolveListWithASTs(tree.instructions, definitions, scope, target, tags, yy);
        const atomData = tree.atomType.split("#");
        if (
            atomData.length > 1 &&
            (
                atomData[0] === "NUMBER"
                || atomData[0] === "INC"
                || atomData[0] === "DEC"
            ) 
        ) {
            const literal = atomData[1];
            if (literal.length > KarelNumbers.maximum.toString().length
                || Number(literal) > KarelNumbers.maximum
            ) {
                yy.parser.parseError(`The number is to large. It must not exceed ${KarelNumbers.maximum}, but it is ${literal}`, {
                    error: CompilationError.Errors.NUMBER_TOO_LARGE,
                    line: tree.loc.first_line - 1,
                    loc: tree.loc
                })
            }
        }
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
        //Resolve left
        const leftType = resolveTerm(tree.left, definitions, scope, target, tags, yy);
        // Add short circuit
        target.push(["DUP"]);
        if (tree.operation === "OR") {
            target.push(["NOT"]);
        }
        const shortCircuit = definitions.getUniqueTag("shortCircuit");
        target.push(["TJZ", shortCircuit]);
        // Resolve right
        const rightType = resolveTerm(tree.right, definitions, scope, target, tags, yy);
        // Add short circuit tag
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
        resolveListWithASTs([["TAG", shortCircuit]], definitions, scope, target, tags, yy);
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
                loc: tree.totalLoc,
                line: tree.totalLoc.first_line - 1,
                expectedType: tree.dataType,
                actualType: termType
            });
        }
        return tree.dataType;

    }
    if (tree.operation === "PARENTHESIS") {
        const termType = resolveTerm(tree.term, definitions, scope, target, tags, yy);        
        return termType;

    }

}

/**
 * Resolves a variable into the SemiSimple Instructions
 * 
 * If the language has active the flag VariablesCanBeFunctions (such as pascal),
 * the it may attempt to resolve it to a parameter-less function call
 * 
 * @param data the Variable IR
 * @param definitions Table of definitions
 * @param scope Scope data
 * @param target target where the SemiSimple Instructions are appended to
 * @param yy to emit compilation errors
 * 
 * 
 * @throws 
 * CompilationError.Errors.UNKNOWN_VARIABLE | CompilationError.Errors.UNDEFINED_FUNCTION
 * 
 * if the variable is not defined
 * 
 */
function resolveVar(data: IRVar, definitions: DefinitionTable, scope:Scope, target: IRSemiSimpleInstruction[], yy: YY) {
    const parameterIdx = scope.parameters.findIndex(e => data.target === e.name);
    if (parameterIdx !== -1) {
        target.push(["PARAM", scope.parameters.length - parameterIdx -1]);
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
        resolveCall(
            {
                nameLoc: data.loc,
                params: [],
                target: data.target,
                expectedType: data.expectedType,
            },
            definitions, scope, target, {}, yy
        );
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


/**
 * Resolves a call into the SemiSimple Instructions
 * It resolves its parameters and formats it properly for the VM
 * 
 * @param data the Call IR
 * @param definitions Table of definitions
 * @param scope Scope data
 * @param target target where the SemiSimple Instructions are appended to
 * @param tags A record of tags
 * @param yy to emit compilation errors
 * 
 * 
 * @throws 
 * CompilationError.Errors.UNDEFINED_FUNCTION
 * If the function is not defined
 */
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
        [
            "LINE", 
            data.nameLoc.first_line - 1, 
            data.nameLoc.first_column + data.target.length
        ],
    );


}


/**
 * Resolves a return
 * 
 * @param data the Return IR
 * @param definitions Table of definitions
 * @param scope Scope data
 * @param target target where the SemiSimple Instructions are appended to
 * @param tags A record of tags
 * @param yy to emit compilation errors
 * 
 * 
 * @throws 
 * CompilationError.Errors.RETURN_TYPE
 * If the return type is not correct
 */
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
    target.push(["LINE", data.loc.first_line - 1, data.loc.first_column])
    target.push(["RET", data]);


}

/**
 * Resolves a repeat loop
 * @param data The repeat AST
 * @param definitions Table of definitions
 * @param scope Scope data
 * @param target the SemiSimple Instruction array where instructions are inserted
 * @param tags Available tags record
 * @param yy For compilation error purposes
 * 
 * @throws If inner blocks fail to be resolved
 */
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
            ['LTE'], 
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
 * Resolves a while AST
 * @param data While data
 * @param definitions  table of definitions
 * @param scope Scope data
 * @param target Target where SemiSimpleInstructions are emitted to
 * @param tags Available tags
 * @param yy Parser errors
 * 
 * @throws
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

/**
 * Resolves a conditional
 * @param data Conditional data
 * @param definitions Table of definitions
 * @param scope Scope info
 * @param target Target where the SemiSimple instructions are emitted to
 * @param tags Tags available
 * @param yy Parser errors
 * @returns Flow data
 */

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
 * @param yy Required to emit compilation error
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
        if (instruction[0] === "FORWARD") {
            target.push(['WORLDWALLS']);
            target.push(['ORIENTATION']);
            target.push(['MASK']);
            target.push(['AND']);
            target.push(['NOT']);
            target.push(['EZ', 'WALL']);
            target.push(instruction);
            continue;
        }
        if (instruction[0] === "PICKBUZZER") {
            target.push(['WORLDBUZZERS']);
            target.push(['EZ', 'WORLDUNDERFLOW']);
            target.push(instruction);
            continue;
        }
        if (instruction[0] === "LEAVEBUZZER") {
            target.push(['BAGBUZZERS']);
            target.push(['EZ', 'BAGUNDERFLOW']);
            target.push(instruction);
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
                target.push([
                    "LINE", 
                    instruction[2].first_line - 1,
                    instruction[2].first_column
                ]);
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