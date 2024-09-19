"use strict";
import type { Runtime } from "./runtime"

type CallEventDetails = {
    type: "call",
    function: string,
    params: Int32Array,
    line: number,
    target: Runtime
}

type ReturnEventDetails = {
    type: "return",
    params: Int32Array,
    function: string,
    line: number,
    returnValue: number,
    target: Runtime,
}

type DebugDetails = {
    type: "debug",
    debugType: string,
    message: string,
    target: Runtime,
}

type KarelRuntimeEventDetails = CallEventDetails | ReturnEventDetails | ReturnEventDetails | DebugDetails

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

    fireEvent(type:string, runtime:Runtime, data:any ) {
        const evt = new KarelRuntimeEvent(type, runtime, data);
        this.dispatchEvent(evt);
    }
}
