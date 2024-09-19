import type { YYLoc } from "./IRParserTypes"

export namespace CompilationError {
    export enum Errors {
        BINARY_OPERATOR_TYPE_ERROR,
        CALL_TYPE,
        COMPARISON_TYPE,
        FUNCTION_ILLEGAL_NAME,        
        FUNCTION_REDEFINITION,
        ILLEGAL_BREAK,
        ILLEGAL_CONTINUE,
        NO_EXPLICIT_RETURN,
        PARAMETER_ILLEGAL_NAME,
        PARAMETER_REDEFINITION,
        PROTOTYPE_PARAMETERS_MISS_MATCH,
        PROTOTYPE_TYPE_MISS_MATCH,
        PROTOTYPE_REDEFINITION,
        RETURN_TYPE,
        TOO_FEW_PARAMS_IN_CALL,
        TOO_MANY_PARAMS_IN_CALL,
        TYPE_ERROR,
        UNDEFINED_FUNCTION,
        UNDEFINED_FUNCTION_OR_VARIABLE,
        UNARY_OPERATOR_TYPE_ERROR,
        UNKNOWN_MODULE,
        UNKNOWN_PACKAGE,    
        UNKNOWN_VARIABLE,
        VOID_COMPARISON,
    }

    type BinaryOperatorTypeErrorStatus = {
        error: Errors.BINARY_OPERATOR_TYPE_ERROR,
        loc: YYLoc,
        line: number,
        operator: string,
        direction: "LEFT"|"RIGHT",
        expectedType: string,
        actualType: string
    }

    type CallTypeErrorStatus = {
        error: Errors.CALL_TYPE,
        loc: YYLoc,
        line: number,
        funcName:string,
        expectedCallType: string,
        functionType: string,
    }
    
    type ComparisonTypeErrorStatus = {
        error: Errors.COMPARISON_TYPE,
        loc: YYLoc,
        line: number,
        leftType: string,
        rightType: string
    }
    
    type IllegalFunctionNameErrorStatus = {
        error: Errors.FUNCTION_ILLEGAL_NAME,
        loc: YYLoc,
        line: number,
        functionName: string
    }
    
    type FunctionRedefinitionErrorStatus = {
        error: Errors.FUNCTION_REDEFINITION,
        loc: YYLoc,
        line: number,
        functionName: string
    }
    
    type IllegalBreakErrorStatus = {
        error: Errors.ILLEGAL_BREAK,
        loc: YYLoc,
        line: number,
    }
    
    type IllegalContinueErrorStatus = {
        error: Errors.ILLEGAL_CONTINUE,
        loc: YYLoc,
        line: number,
    }
    
    type NoExplicitReturnErrorStatus = {
        error: Errors.NO_EXPLICIT_RETURN,
        loc: YYLoc,
        line: number,
        functionName: string,
        returnType: string
    }
    
    
    type IllegalParameterNameErrorStatus = {
        error: Errors.PARAMETER_ILLEGAL_NAME,
        loc: YYLoc,
        line: number,
        parameterName: string
    }
    
    type ParameterRedefinitionErrorStatus = {
        error: Errors.PARAMETER_REDEFINITION,
        loc: YYLoc,
        line: number,
        parameterName: string
    }
    type PrototypeParametersMissMatchRedefinitionErrorStatus = {
        error: Errors.PROTOTYPE_PARAMETERS_MISS_MATCH,
        loc: YYLoc,
        line: number,
        functionName: string
        prototypeParamCount: number,
        functionParamCount: number
    }
    
    type PrototypeRedefinitionErrorStatus = {
        error: Errors.PROTOTYPE_REDEFINITION,
        loc: YYLoc,
        line: number,
        prototypeName: string
    }
    
    type PrototypeTypeMissMatchRedefinitionErrorStatus = {
        error: Errors.PROTOTYPE_TYPE_MISS_MATCH,
        loc: YYLoc,
        line: number,
        functionName: string
        functionType: string,
        prototypeType: string
    }
    
    type ReturnTypeErrorStatus = {
        error: Errors.RETURN_TYPE,
        loc: YYLoc,
        line: number,
        expectedType: string,
        actualType: string
    }
    
    type TooFewParamsInCallErrorStatus = {
        error: Errors.TOO_FEW_PARAMS_IN_CALL,
        loc: YYLoc,
        line: number,
        funcName: string,
        expectedParams: number,
        actualParams: number
    }

    type TooManyParamsInCallErrorStatus = {
        error: Errors.TOO_MANY_PARAMS_IN_CALL,
        loc: YYLoc,
        line: number,
        functionName: string,
        expectedParams: number,
        actualParams: number
    }

    
    type TypeErrorStatus = {
        error: Errors.TYPE_ERROR,
        loc: YYLoc,
        line: number,
        expectedType: string,
        actualType: string
    }

    type UnaryOperatorTypeErrorStatus = {        
        error: Errors.UNARY_OPERATOR_TYPE_ERROR,
        loc: YYLoc,
        line: number,
        operator: string,
        expectedType: string,
        actualType: string
    }
    
    type UndefinedFunctionErrorStatus = {
        error: Errors.UNDEFINED_FUNCTION,
        loc: YYLoc,
        line: number,
        functionName: string
    }
    
    type UndefinedFunctionOrVariableErrorStatus = {
        error: Errors.UNDEFINED_FUNCTION_OR_VARIABLE,
        loc: YYLoc,
        line: number,
        functionName: string
    }
    
    type UnknownModuleErrorStatus = {
        error: Errors.UNKNOWN_MODULE,
        loc: YYLoc,
        line: number,
        package: string,
        module: string,
        full: string
    }
    
    type UnknownPackageErrorStatus = {
        error: Errors.UNKNOWN_PACKAGE,
        loc: YYLoc,
        line: number,
        package: string,
        module: string,
        full: string
    }
    
    type UnknownVariableErrorStatus = {
        error: Errors.UNKNOWN_VARIABLE,
        loc: YYLoc,
        line: number,
        variable: string
    }
    
    type VoidComparisonErrorStatus = {
        error: Errors.VOID_COMPARISON,
        loc: YYLoc,
        line: number,
        leftType: string,
        rightType: string
    }


    export type ErrorStatus = 
        BinaryOperatorTypeErrorStatus
        | CallTypeErrorStatus
        | ComparisonTypeErrorStatus
        | IllegalFunctionNameErrorStatus
        | FunctionRedefinitionErrorStatus
        | IllegalBreakErrorStatus
        | IllegalContinueErrorStatus
        | IllegalParameterNameErrorStatus
        | NoExplicitReturnErrorStatus
        | ParameterRedefinitionErrorStatus
        | PrototypeRedefinitionErrorStatus
        | PrototypeParametersMissMatchRedefinitionErrorStatus
        | PrototypeTypeMissMatchRedefinitionErrorStatus
        | ReturnTypeErrorStatus
        | TooManyParamsInCallErrorStatus
        | TooFewParamsInCallErrorStatus
        | TypeErrorStatus 
        | UnaryOperatorTypeErrorStatus
        | UndefinedFunctionErrorStatus
        | UnknownModuleErrorStatus
        | UnknownPackageErrorStatus
        | UnknownVariableErrorStatus
        | VoidComparisonErrorStatus
    ;
    
}