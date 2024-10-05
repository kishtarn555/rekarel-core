import { IRParam } from "./IRInstruction"

/**
 * This object contains data that is relevant only to a scope such as parameters or locations
 */
interface ScopeData {
    /**
     * Parameters available in the current scope
     */
    parameters: IRParam[]
    /**
     * The type returns should use in the current scope
     */
    expectedReturn: string
    /**
     * The tag that continue jumps to in this scope
     * If not set, then it means continue cannot be used in the
     * current scope
     */
    continueTarget?: string
    
    /**
     * The tag that break jumps to in this scope
     * If not set, then it means break cannot be used in the
     * current scope
     */
    breakTarget?: string
}

/**
 * A readonly class containing the scope data
 */
export class Scope implements ScopeData {
    /**
     * Parameters available in the current scope
     */
    readonly parameters: IRParam[]
    /**
     * The type returns should use in the current scope
     */
    readonly expectedReturn: string
    /**
     * The tag that continue jumps to in this scope
     * If not set, then it means continue cannot be used in the
     * current scope
     */
    readonly continueTarget?: string
    
    /**
     * The tag that break jumps to in this scope
     * If not set, then it means break cannot be used in the
     * current scope
     */
    readonly breakTarget?: string

    constructor(data: ScopeData) {
        this.parameters = data.parameters;
        this.expectedReturn = data.expectedReturn;
        this.continueTarget = data.continueTarget;
        this.breakTarget = data.breakTarget;
    }

    /**
     * Creates a copy of itself, with the continue Target modified
     * @param continueTarget The new continue target
     * @returns A new Scope with the same values, except for continue target
     */
    withContinueTarget(continueTarget: string) {
        return new Scope({
            parameters: this.parameters,
            expectedReturn: this.expectedReturn,
            continueTarget: continueTarget,
            breakTarget: this.breakTarget
        });
    }

    /**
     * Creates a copy of itself, with the break Target modified
     * @param breakTarget The new break target
     * @returns A new Scope with the same values, except for break target
     */
    withBreakTarget(breakTarget: string) {
        return new Scope({
            parameters: this.parameters,
            expectedReturn: this.expectedReturn,
            continueTarget: this.continueTarget,
            breakTarget: breakTarget
        });
    }

    /**
     * Creates a copy of itself, changing the continue and break target
     * @param continueTarget The new continue target
     * @param breakarget The new break target
     * @returns A new Scope with modified values
     */
    withContinueBreakTarget(continueTarget: string, breakTarget: string) {        
        return new Scope({
            parameters: this.parameters,
            expectedReturn: this.expectedReturn,
            continueTarget: continueTarget,
            breakTarget: breakTarget
        });
    }
}

/**
 * The default scope used in the main program
 */
export const MAIN_SCOPE = new Scope({
    expectedReturn: "VOID",
    parameters: []
})