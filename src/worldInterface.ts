import { ErrorType } from "./runtimeErrors"

export interface GetWorldStatus {
    /**Number of times Karel moved, it is null it has no data of it */
    get moveCount(): number | null
    /**Number of times Karel turned left, it is null it has no data of it */
    get turnLeftCount(): number | null
    /**Number of times Karel picked beepers, it is null it has no data of it */
    get pickBuzzerCount(): number | null
    /**Number of times Karel left beepers, it is null it has no data of it */
    get leaveBuzzerCount(): number | null
    /**It is set if the output ended on error */
    get error(): ErrorType | null
    /**Row at which Karel ended, it is null it has no data of it */
    get i(): number | null
    /**Column at which Karel ended, it is null it has no data of it */
    get j(): number | null
    /**Number of beepers that are in the KarelBag, it is null it has no data of it */
    get bagBuzzers(): number | null
    /**Orientation Karel ended at, it is null it has no data of it 
     * - 0 is West
     * - 1 is North
     * - 2 is East
     * - 3 is South
    */
    get orientation(): number | null

    buzzers(i: number, j: number) : number | null
}