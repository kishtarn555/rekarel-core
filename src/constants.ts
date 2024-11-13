export namespace KarelNumbers {
    /**
     * The minimum number supported by Karel
     */
    export const minimum = -999_999_999;
    
    /**
     * The maximum number supported by Karel
     */
    export const maximum = 999_999_999;
    /**
     * This is a number that is considered infinite by the runtime. The exact value of this constant is not guaranteed to remain stable
     * 
     * To check if a number is infinite you should not check against this value ever, but rather check with the KarelNumbers.isInfinite method
     */
    export const a_infinite = 1_000_000_005;

    /**
     * Checks if a number is infinite or not
     * @param x Number to check
     */
    export function isInfinite(x:number) {
        return x > maximum;
    }
}