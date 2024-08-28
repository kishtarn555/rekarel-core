"use strict";
import type { Runtime } from "./runtime"

class KarelRuntimeEvent extends Event {
    runtime:Runtime
    details:any
    constructor(type:string, runtime:Runtime, details:any) {
        super(type);
        this.details = details;

    }
}


type KarelCallback = (KarelRuntimeEvent)=>void
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
