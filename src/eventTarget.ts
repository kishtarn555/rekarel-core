"use strict";
import type { Runtime } from "./runtime"
import type { World } from "./world";

/**
 * An event result of a call
 */
type CallEventDetails = {
    /**
     * Event type
     */
    type: "call",
    /**
     * Name of the function that was called
     */
    function: string,
    /**
     * Parameters of the call
     */
    params: Int32Array,
    /**
     * Line from where the call was made
     */
    line: number,
    /**
     * Runtime target
     */
    target: Runtime
}

/**
 * An event result of a return
 */
type ReturnEventDetails = {
    /**
     * Event type
     */
    type: "return",
    /**
     * The parameters of the function **to** which we returned and **now** stands on top of the stack
     */
    params: Int32Array,
    /**
     * The function name of the function **to** which we returned and **now** stands on top of the stack
     * If it is the main program, then it will be N/A
     */
    function: string,
    /**
     * Line from the function we returned **to** was called. The line from which the function that **now** stands on top of the stack was called from.
     * If it is the main program, the line will be -2
     */
    line: number,
    /**
     * The name of the function that was returned **from** and **no longer** is in the stack
     */
    fromFunction: string,    
    /**
     * The value that was returned by the function that we returned **from**.
     */
    returnValue: number,
    /**
     * Runtime target
     */
    target: Runtime,
}

/**
 * An event result of a debug message
 */
type DebugDetails = {
    /**
     * Event type
     */
    type: "debug",
    /**
     * Event subtype
     */
    debugType: string,
    /**
     * Debug message
     */
    message: string,
    /**
     * Runtime target
     */
    target: Runtime,
}

/**
 * An event result of the execution stopping
 */
type StopDetails = {
    /**
     * Event type
     */
    type: "stop",
    /**
     * World where the runtime is running on
     */
    world: World
    /**
     * Runtime target
     */
    target: Runtime,
}


/**
 * An event result of the execution starting
 */
type StartDetails = {
    /**
     * Event type
     */
    type: "start",
    /**
     * World where the runtime is running on
     */
    world: World
    /**
     * Runtime target
     */
    target: Runtime,
}


/**
 * Runtime events that Karel rises
 */
export type KarelRuntimeEventDetails = 
    CallEventDetails
    | DebugDetails
    | ReturnEventDetails 
    | StartDetails
    | StopDetails

class KarelRuntimeEvent extends Event {
    runtime: Runtime
    details: KarelRuntimeEventDetails
    constructor(type:string, runtime:Runtime, details: KarelRuntimeEventDetails) {
        super(type);
        this.details = details;
        this.runtime = runtime;

    }
}


type KarelCallback = (event:KarelRuntimeEvent)=>void
export class KarelRuntimeEventTarget  {
    listeners: {[key:string]:KarelCallback[]}
    constructor() {
        this.listeners = {}
    }
    addEventListener(type: string, callback: KarelCallback ): void {
        if (!this.listeners.hasOwnProperty(type)) {
            this.listeners[type]=[];
        }
        this.listeners[type].push(callback);
    }
    dispatchEvent(event: KarelRuntimeEvent): boolean {
        if (!this.listeners.hasOwnProperty(event.type)) {
            return false;
        }
        for (const listener of this.listeners[event.type]) {
            listener(event);
        }
        return true;
    }
    removeEventListener(type: string, callback: KarelCallback): void {
        if (!this.listeners.hasOwnProperty(type)) {
            return;
        }
        const index = this.listeners[type].indexOf(callback);
        if (index === -1) return;
        this.listeners[type] = this.listeners[type].splice(index, 1);
    }

    fireEvent(type:string, runtime:Runtime, data:KarelRuntimeEventDetails ) {
        const evt = new KarelRuntimeEvent(type, runtime, data);
        this.dispatchEvent(evt);
    }
}
