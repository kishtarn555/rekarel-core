import type { IRTerm as ASTNode, IRInstruction } from "./IRInstruction";
import { YY } from "./IRParserTypes";
import { DefinitionTable } from "./IRVarTable";


/**
 * @throws If the AST is not type correct
 * @param tree The ast expression to solve
 * @param table Definition table
 * @param yy Requiered to emmit compilation error
 * @returns Returns the equivalent AST into IRInstructions without AST
 */
export function resolveAST(tree: ASTNode, table:DefinitionTable,  yy:YY ):IRInstruction[] {

    return[ ["LOAD", 0]];

}