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
     * This is a number that is considered infinite by the runtime, any number above the maximum is considered infinite
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