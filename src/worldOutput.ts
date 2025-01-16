import { ErrorType } from "./runtimeErrors"
import { DumpTypes, World } from "./world";
import { GetWorldStatus } from "./worldInterface";

const maxSide = 4_000_100;
/**
 * This class represents a world output
 */
export class WorldOutput implements GetWorldStatus {
    /**Number of times Karel moved, it is null if it does not matter for the output */
    moveCount: number | null
    /**Number of times Karel turned left, it is null if it does not matter for the output */
    turnLeftCount: number | null
    /**Number of times Karel picked beepers, it is null if it does not matter for the output */
    pickBuzzerCount: number | null
    /**Number of times Karel left beepers, it is null if it does not matter for the output */
    leaveBuzzerCount: number | null
    /**If the output ended correctly it will be null, otherwise the error it ended on */
    error: ErrorType | null
    /**Row at which Karel ended, it is null if it does not matter for the output */
    i: number | null
    /**Column at which Karel ended, it is null if it does not matter for the output */
    j: number | null
    /**Number of beepers that are in the KarelBag, it is null if it does not matter for the output */
    bagBuzzers: number | null
    /**Orientation Karel ended at, it is null if it does not matter for the output 
     * - 0 is West
     * - 1 is North
     * - 2 is East
     * - 3 is South
    */
    orientation: number | null
    private _buzzers: Map<number, number>

    constructor(world?: World) {
        this._buzzers = new Map();
        this.clear();
        if (world == null) {
            return;
        }
        if (world.getDumps(DumpTypes.DUMP_POSITION)) {
            this.i = world.i;
            this.j = world.j;
        }
        if (world.getDumps(DumpTypes.DUMP_BAG)) {
            this.bagBuzzers = world.bagBuzzers
        }
        if (world.getDumps(DumpTypes.DUMP_MOVE)) {
            this.moveCount = world.runtime.state.moveCount;
        }
        if (world.getDumps(DumpTypes.DUMP_LEFT)) {
            this.turnLeftCount = world.runtime.state.turnLeftCount;
        }
        if (world.getDumps(DumpTypes.DUMP_LEAVE_BUZZER)) {
            this.leaveBuzzerCount = world.runtime.state.leaveBuzzerCount;
        }
        if (world.getDumps(DumpTypes.DUMP_PICK_BUZZER)) {
            this.pickBuzzerCount = world.runtime.state.pickBuzzerCount;
        }
        if (world.getDumps(DumpTypes.DUMP_ALL_BUZZERS) || world.getDumps(DumpTypes.DUMP_WORLD)) {
            for (let i =1; i <= world.w; i++) {
                for (let j =1; j <= world.h; j++) {
                    if (!world.getDumps(DumpTypes.DUMP_ALL_BUZZERS) && !world.getDumpCell(i, j))
                        continue; //This cell does not matter for the output
                    this._buzzers.set(
                        this.linearizeCoords(i, j),
                        world.buzzers(i, j)
                    );
                }
            }
        }
        if (world.runtime.state.error != null) {
            //Get error
            this.error = world.runtime.state.error;
        }

    }


    /**
     * Remove all data from the world
     */
    clear() {
        this.moveCount = null;
        this.turnLeftCount = null;
        this.pickBuzzerCount = null;
        this.leaveBuzzerCount = null;
        this.error = null;
        this.i = null;
        this.j = null;
        this.bagBuzzers = null;

        this._buzzers.clear();
    }

    registerBuzzer(i: number, j: number, amount: number) {
        this._buzzers.set(
            this.linearizeCoords(i, j),
            amount
        );
    }
    /**
     * Returns the buzzers at coord (i, j). If it is not registered, then it returns null
     * @param i row
     * @param j column
     * @param amount The buzzer registered at the specified coord or null if there's no such buzzer
     */
    buzzers(i: number, j: number): number | null {
        if (this._buzzers.has(this.linearizeCoords(i, j))) {
            return this._buzzers.get(this.linearizeCoords(i, j));
        }
        return null;
    }

    /**
     * Returns a generator for the buzzers
     * @returns {Generator<{ i: number; j: number; amount: number }>} Generator {i, j, amount}
     */
    *getDumpedBuzzers(): Generator<{ i: number; j: number; amount: number }> {       
        for (const [coord, amount] of this._buzzers) {
            let {i, j} = this.getCoordsFromLinearized(coord);
            yield {i, j, amount};
        }
    
    }

    /**
     * Compares this to other WorldStatus. This has priority, meaning that if the other has extra data, then it will still be considered correct
     * @param other Other WorldStatus to compare it to.
     */
    compareToOutput(other:GetWorldStatus) {
        if (this.moveCount != null && this.moveCount !== other.moveCount) {
            return false;
        }
        if (this.turnLeftCount != null && this.turnLeftCount !== other.turnLeftCount) {
            return false;
        }
        if (this.pickBuzzerCount != null && this.pickBuzzerCount !== other.pickBuzzerCount) {
            return false;
        }
        if (this.leaveBuzzerCount != null && this.leaveBuzzerCount !== other.leaveBuzzerCount) {
            return false;
        }
        if (this.i != null && this.i !== other.i) {
            return false;
        }
        if (this.j != null && this.j !== other.j) {
            return false;
        }
        if (this.orientation != null && this.orientation !== other.orientation) {
            return false;
        }
        if (this.bagBuzzers != null && this.bagBuzzers !== other.bagBuzzers) {
            return false;
        }
        if (this.error != null && this.error !== other.error) {
            return false;
        }
        for (let {i, j, amount} of this.getDumpedBuzzers()) {
            if (amount !== other.buzzers(i, j)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Converts a pair of coords into a unique number
     * @param i Row
     * @param j Column
     * @returns A integer that maps the keys
     */
    private linearizeCoords(i: number, j: number) {
        return i * maxSide + j;
    }

    private getCoordsFromLinearized(coord:number) {
        return {
            i: Math.floor( coord / maxSide ),
            j: coord % maxSide
        };
    }


}