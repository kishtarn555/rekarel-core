import { IRParam } from "./IRInstruction"

interface ScopeData {
    parameters: IRParam[]
    expectedReturn: string
    continueTarget?: string
    breakTarget?: string
}

export class Scope implements ScopeData {
    readonly parameters: IRParam[]
    readonly expectedReturn: string
    readonly continueTarget?: string
    readonly breakTarget?: string

    constructor(data: ScopeData) {
        this.parameters = data.parameters;
        this.expectedReturn = data.expectedReturn;
        this.continueTarget = data.continueTarget;
        this.breakTarget = data.breakTarget;
    }

    withContinueTarget(continueTarget: string) {
        return new Scope({
            parameters: this.parameters,
            expectedReturn: this.expectedReturn,
            continueTarget: continueTarget,
            breakTarget: this.breakTarget
        });
    }
    withBreakTarget(breakTarget: string) {
        return new Scope({
            parameters: this.parameters,
            expectedReturn: this.expectedReturn,
            continueTarget: this.continueTarget,
            breakTarget: breakTarget
        });
    }
    withContinueBreakTarget(continueTarget: string, breakTarget: string) {        
        return new Scope({
            parameters: this.parameters,
            expectedReturn: this.expectedReturn,
            continueTarget: continueTarget,
            breakTarget: breakTarget
        });
    }
}


export const MAIN_SCOPE = new Scope({
    expectedReturn: "VOID",
    parameters: []
})