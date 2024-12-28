"use strict";

import { KarelNumbers } from "./constants";
import { Runtime } from "./runtime";

/**
 * Dump flags, they change what is emitted to the output of an world
 */
export enum DumpTypes {
    DUMP_WORLD = 'mundo',
    DUMP_POSITION = 'posicion',
    DUMP_ORIENTATION = 'orientacion',
    DUMP_INSTRUCTIONS = 'instrucciones',
    DUMP_ALL_BUZZERS = 'universo',
    DUMP_BAG = 'mochila',
    DUMP_MOVE = 'avanza',
    DUMP_LEFT = 'gira_izquierda',
    DUMP_PICK_BUZZER = 'coge_zumbador',
    DUMP_LEAVE_BUZZER = 'deja_zumbador',
}

type DumpData = {
    [key in DumpTypes]?: boolean
};

type Orientation = 'OESTE' | 'NORTE' | 'ESTE' | 'SUR';

const error_mapping = ['WALL', 'WORLDUNDERFLOW', 'BAGUNDERFLOW', 'INSTRUCTION'];

/**
 * Maps errors to their output message
 */
enum ERROR_MAPPING {
    BAGUNDERFLOW = 'ZUMBADOR INVALIDO MOCHILA',
    BAGOVERFLOW = 'DEMASIADOS ZUMBADORES (MOCHILA)',
    WALL = 'MOVIMIENTO INVALIDO',
    WORLDUNDERFLOW = 'ZUMBADOR INVALIDO MUNDO',
    WORLDOVERFLOW = 'DEMASIADOS ZUMBADORES (MUNDO)',
    STACK = 'STACK OVERFLOW',
    INTEGEROVERFLOW = 'INTEGER OVERFLOW',
    INTEGERUNDERFLOW = 'INTEGER UNDERFLOW',
    INSTRUCTION = 'LIMITE DE INSTRUCCIONES GENERAL',
    INSTRUCTION_LEFT = 'LIMITE DE INSTRUCCIONES IZQUIERDA',
    INSTRUCTION_FORWARD = 'LIMITE DE INSTRUCCIONES AVANZA',
    INSTRUCTION_PICKBUZZER = 'LIMITE DE INSTRUCCIONES COGE_ZUMBADOR',
    INSTRUCTION_LEAVEBUZZER = 'LIMITE DE INSTRUCCIONES DEJA_ZUMBADOR',
    STACKMEMORY = "LIMITE DE MEMORIA DEL STACK",
    CALLSIZE = "LIMITE DE LONGITUD DE LLAMADA"
}

/**
 * Represents a Karel World, it keeps track of both the starting state and the current state
 * Contains information such as beepers, walls, Karel position, etc.
 */
export class World {
    /**
     * Width of the world
     */
    w: number
    /**
     * Height of the world
     */
    h: number
    /**
     * Runtime linked to this world
     */
    runtime: Runtime
    /**
     * Stores the initial beepers. Any number over KarelNumbers.maximum is considered infinite
     * 
     * 
     */
    map: Int32Array | number[]
    
    /**
     * Stores the current beepers. Any number over KarelNumbers.maximum is considered infinite
     */
    currentMap: Int32Array | number[]
    /**
     * Stores the walls of the worlds.
     * Each cell contains a bitmask representing the cells
     * - bit 0: West
     * - bit 1: North
     * - bit 2: East
     * - bit 3: South
     */
    wallMap: Uint8Array | number[]
    /**
     * Flag set if the world is modified either by a function or runtime
     * It is not reset internally, but by an external controller
     */
    dirty: boolean
    /**
     * Array of [row, column] which select which cells are emitted to the output
     */
    dumpCells: [number, number][]
    /**
     * Dump flags, they control what is emitted to the output
     */
    dumps: DumpData
    /**
     * Maximum number of instructions that a program can execute
     */
    maxInstructions: number
    /**
     * Maximum number of moves a program can run
     */
    maxMove: number
    /**
     * Maximum number of turn lefts a program can run
     */
    maxTurnLeft: number
    /**
     * Maximum number of pick buzzers a program can run
     */
    maxPickBuzzer: number
    /**
     * Maximum number of leave buzzers a program can run
     */
    maxLeaveBuzzer: number
    /**
     * Maximum number of functions in the stack
     */
    maxStackSize: number
    /**
     * Maximum number of parameters a call can have
     */
    maxCallSize: number    
    /**
     * Maximum stack memory. A call consumes max(1, number of parameters) memory
     */
    maxStackMemory: number
    /**
     * Name of the world
     */
    worldName: string
    /**
     * Name of the program
     */
    programName: string
    /**
     * The current row where Karel is
     */
    i: number    
    /**
     * The current column where Karel is
     */
    j: number
    /**
     * The current orientation of Karel
     * - 0 is West
     * - 1 is North
     * - 2 is East
     * - 3 is South
     */
    orientation: number
    /**
     * Current number of beepers in the Bag. Any number over KarelNumbers.maximum is considered infinite
     */
    bagBuzzers: number
    /**
     * The start row of Karel
     */
    start_i: number
    /**
     * The start column of Karel
     */
    start_j: number
    /**
     * Start orientation of Karel
     * - 0 is West
     * - 1 is North
     * - 2 is East
     * - 3 is South
     */
    startOrientation: number
    /**
     * Start number of beepers in the Bag. Any number over KarelNumbers.maximum is considered infinite
     */
    startBagBuzzers: number


    constructor(w: number, h: number) {
        this.init(w, h);
    }

    init(w: number, h: number): void {
        this.w = w;
        this.h = h;
        this.runtime = new Runtime(this);
        this.createMaps();

        this.clear();
    }

    /**
     * Creates and reserves the memory for the arrays
     */
    createMaps(): void {
        if (ArrayBuffer) {
            let len = (this.w + 2) * (this.h + 2);
            this.map = new Int32Array(new ArrayBuffer(len * 4));
            this.currentMap = new Int32Array(new ArrayBuffer(len * 4));
            this.wallMap = new Uint8Array(new ArrayBuffer(len));
        } else {
            this.map = [];
            this.currentMap = [];
            this.wallMap = [];
            for (let i = 0; i <= this.h; i++) {
                for (let j = 0; j <= this.w; j++) {
                    this.map.push(0);
                    this.currentMap.push(0);
                    this.wallMap.push(0);
                }
            }
        }
    }

    /**
     * Changes the size of the world
     * @param w New width
     * @param h New Height
     */
    resize(w: number, h: number): void {
        // Eliminamos las paredes del borde
        for (let i = 1; i <= this.h; i++) {
            this.wallMap[this.w * i + 1] &= ~(1 << 0);
            this.wallMap[this.w * (i + 1)] &= ~(1 << 2);
        }
        for (let j = 1; j <= this.w; j++) {
            this.wallMap[this.w * this.h + j] &= ~(1 << 1);
            this.wallMap[this.w + j] &= ~(1 << 3);
        }

        let oldW = this.w;
        let oldH = this.h;
        let oldMap = this.map;
        //   let oldCurrentMap = this.oldCurrentMap;
        let oldWallMap = this.wallMap;
        let oldDumpCells = this.dumpCells;

        this.w = w;
        this.h = h;
        this.createMaps();
        this.addBorderWalls();

        // Copiamos todas las paredes y zumbadores
        for (let i = 1; i <= oldH; i++) {
            for (let j = 1; j <= oldW; j++) {
                this.setCellWalls(i, j, oldWallMap[oldW * i + j]);
                this.setBuzzers(i, j, oldMap[oldW * i + j]);
            }
        }

        // Vaciamos dumpCells y la llenamos de nuevo
        this.dumpCells = [];
        for (let dumpPos = 0; dumpPos < oldDumpCells.length; dumpPos++) {
            if (
                oldDumpCells[dumpPos][0] <= this.h &&
                oldDumpCells[dumpPos][1] <= this.w
            ) {
                this.setDumpCell(
                    oldDumpCells[dumpPos][0],
                    oldDumpCells[dumpPos][1],
                    true,
                );
            }
        }

        // Checamos si karel sigue dentro del mundo
        if (this.start_i > this.h) this.start_i = this.i = this.h;
        if (this.start_j > this.w) this.start_j = this.j = this.w;

        this.dirty = true;
    }

    /**
     * Sets all values to their default. 
     */
    clear(): void {
        for (let i = 0; i < this.wallMap.length; i++) {
            this.wallMap[i] = 0;
        }

        for (let i = 0; i < this.map.length; i++) {
            this.map[i] = this.currentMap[i] = 0;
        }

        this.addBorderWalls();

        this.orientation = 1;
        this.startOrientation = 1;
        this.start_i = 1;
        this.i = 1;
        this.start_j = 1;
        this.j = 1;
        this.startBagBuzzers = 0;
        this.bagBuzzers = 0;
        this.dumps = {};
        this.dumpCells = [];
        this.maxInstructions = 10000000;
        this.maxMove = -1;
        this.maxTurnLeft = -1;
        this.maxPickBuzzer = -1;
        this.maxLeaveBuzzer = -1;
        this.maxStackSize = 65000;
        this.maxStackMemory = 65000;
        this.maxCallSize = 5;
        this.worldName = 'mundo_0';
        this.programName = 'p1';

        this.dirty = true;
    }
    /**
     * Returns the wall mask at a location
     * @param i row
     * @param j column
     * @returns Wall Mask
     */

    walls(i: number, j: number): number {
        if (0 > i || i > this.h || 0 > j || j > this.w) return 0;
        return this.wallMap[this.w * i + j];
    }

    /**
     * Sets the current walls at the current position
     * 
     * Does not set modifies the neighboring cells, so it allows "one way" walls.
     * 
     * It cannot destroy border walls
     * 
     * @param i Row
     * @param j Column
     * @param wallMask Value of the mask
     */
    setWallMask = function (i: number, j: number, wallMask: number): void {
        let newMask = wallMask;
        if (
            wallMask < 0 ||
            wallMask >= 16 ||
            1 > i ||
            i > this.h ||
            1 > j ||
            j > this.w
        ) {
            return;
        }

        //This ifs avoid removing outer world walls
        if (j == 1) newMask |= 1 << 0;
        if (i == 1) newMask |= 1 << 3;
        if (i == this.h) newMask |= 1 << 1;
        if (j == this.w) newMask |= 1 << 2;

        this.wallMap[this.w * i + j] = newMask;
    }

    /**
     * Toggles a wall in the specified orientation. It keeps the border walls and toggles the corresponding neighbor wall
     *
     * @param i row
     * @param j column
     * @param orientation number, they're [west, north, east, south]
     */
    toggleWall(i: number, j: number, orientation: number): void {

        if (
            (j == 1 && orientation === 0) ||
            (i == 1 && orientation == 3) ||
            (i == this.h && orientation == 1) ||
            (j == this.w && orientation == 2)
        ) {
            return;
        }
        if (
            orientation < 0 ||
            orientation >= 4 ||
            1 > i ||
            i > this.h ||
            1 > j ||
            j > this.w
        ) {
            return;
        }
        this.wallMap[this.w * i + j] ^= 1 << orientation;

        // Needed to prevent Karel from traversing walls from one direction, but not
        // from the other side.
        if (orientation === 0 && j > 1) {
            this.wallMap[this.w * i + (j - 1)] ^= 1 << 2;
        } else if (orientation === 1 && i < this.h) {
            this.wallMap[this.w * (i + 1) + j] ^= 1 << 3;
        } else if (orientation === 2 && j < this.w) {
            this.wallMap[this.w * i + (j + 1)] ^= 1 << 0;
        } else if (orientation === 3 && i > 1) {
            this.wallMap[this.w * (i - 1) + j] ^= 1 << 1;
        }

        this.dirty = true;
    }

    /**
     * Adds the border walls
     */
    addBorderWalls(): void {
        for (let i = 1; i <= this.h; i++) {
            this.addWall(i, 1, 0);
            this.addWall(i, this.w, 2);
        }

        for (let j = 1; j <= this.w; j++) {
            this.addWall(this.h, j, 1);
            this.addWall(1, j, 3);
        }
    }

    /**
     * Adds the walls set in the wellMask to the specified cell and the corresponding neighbor's wall.
     * @param i row
     * @param j column
     * @param wallMask Walls (lsb to msb is West, North, East, South) 
     */
    setCellWalls(i: number, j: number, wallMask: number): void {
        for (let pos = 0; pos < 4; pos++) {
            if (wallMask & (1 << pos)) this.addWall(i, j, pos);
        }
    }

    /**
     * Adds a wall in to the specified cell and the corresponding neighbor's wall
     * @param i row
     * @param j column
     * @param orientation Wall number (0-West, 1-North, 2-East, 3-South)
     */
    addWall(i: number, j: number, orientation: number): void {


        if (
            orientation < 0 ||
            orientation >= 4 ||
            1 > i ||
            i > this.h ||
            1 > j ||
            j > this.w
        )
            return;
        this.wallMap[this.w * i + j] |= 1 << orientation;


        // Needed to prevent Karel from traversing walls from one direction, but not
        // from the other side.
        if (orientation === 0 && j > 1)
            this.wallMap[this.w * i + (j - 1)] |= 1 << 2;
        else if (orientation === 1 && i < this.h)
            this.wallMap[this.w * (i + 1) + j] |= 1 << 3;
        else if (orientation === 2 && j < this.w)
            this.wallMap[this.w * i + (j + 1)] |= 1 << 0;
        else if (orientation === 3 && i > 1)
            this.wallMap[this.w * (i - 1) + j] |= 1 << 1;

        this.dirty = true;
    }

    /**
     * Set the amount of buzzers in a cell in both the **start** and **current** state
     * @param i row
     * @param j column
     * @param count Number of beepers
     */
    setBuzzers(i: number, j: number, count: number): void {
        if (0 >= i || i > this.h || 0 >= j || j > this.w)
            return;
        this.map[this.w * i + j] =
            this.currentMap[this.w * i + j] =
            count > KarelNumbers.maximum ? KarelNumbers.a_infinite : count;
        this.dirty = true;
    }

    /**
     * Gets the amount of buzzers at a cell in the **current** state
     * @param i cell row
     * @param j cell column
     * @returns beeper amount
     */
    buzzers(i: number, j: number): number {
        if (0 >= i || i > this.h || 0 >= j || j > this.w)
            return 0;
        return this.currentMap[this.w * i + j];
    }

    /**
     * Gets the amount of buzzers at a cell in the **starting** state
     * @param i cell row
     * @param j cell column
     * @returns beeper amount
     */
    startBuzzers(i:number, j:number): number {
        if (0 >= i || i > this.h || 0 >= j || j > this.w)
            return 0;
        return this.map[this.w * i + j];        
    }

    /**
     * Reduces in one the **current** cell and increases in one the **current** beeperBag. Respects infinite cells and bag.
     * @param i cell
     * @param j row
     */
    pickBuzzer(i: number, j: number): void {
        if (0 >= i || i > this.h || 0 >= j || j > this.w)
            return;
        if (!KarelNumbers.isInfinite(this.currentMap[this.w * i + j])) {
            this.currentMap[this.w * i + j]--;
        }
        if (!KarelNumbers.isInfinite(this.bagBuzzers)) {
            this.bagBuzzers++;
        }
        this.dirty = true;
    }

    /**
     * Increases in one the **current** cell and reduces  in one the **current** beeperBag. Respects infinite cells and bag
     * @param i cell
     * @param j row
     */
    leaveBuzzer(i: number, j: number): void {
        if (0 >= i || i > this.h || 0 >= j || j > this.w)
            return;
        if (!KarelNumbers.isInfinite(this.currentMap[this.w * i + j])) {
            this.currentMap[this.w * i + j]++;
        }
        if (!KarelNumbers.isInfinite(this.bagBuzzers)) {
            this.bagBuzzers--;
        }
        this.dirty = true;
    }

    /**
     * Adds or removes a cell to the dump list
     * @param i row
     * @param j column
     * @param dumpState True if it should be added, false if not
     */
    setDumpCell(i: number, j: number, dumpState: boolean): void {
        let dumpPos = -1;

        if (0 >= i || i > this.h || 0 >= j || j > this.w)
            return;

        for (dumpPos = 0; dumpPos < this.dumpCells.length; dumpPos++) {
            if (this.dumpCells[dumpPos][0] == i && this.dumpCells[dumpPos][1] == j) {
                break;
            }
        }

        if (dumpPos < this.dumpCells.length) {
            if (dumpState)
                return;
            this.dumpCells.splice(dumpPos, 1);
        } else {
            if (!dumpState)
                return;
            this.dumpCells.push([i, j]);
        }

        this.dumps[DumpTypes.DUMP_WORLD] = this.dumpCells.length !== 0;
    }

    /**
     * Alternates a cell if it is dumped or not
     * @param i row
     * @param j column
     */
    toggleDumpCell(i: number, j: number): void {
        let dumpPos = 0;

        if (0 >= i || i >= this.h || 0 >= j || j >= this.w) return;

        for (; dumpPos < this.dumpCells.length; dumpPos++) {
            if (this.dumpCells[dumpPos][0] == i && this.dumpCells[dumpPos][1] == j) {
                break;
            }
        }

        if (dumpPos < this.dumpCells.length) {
            this.dumpCells.splice(dumpPos, 1);
        } else {
            this.dumpCells.push([i, j]);
        }

        this.dumps[DumpTypes.DUMP_WORLD] = this.dumpCells.length !== 0;
    }

    /**
     * Returns if a cell is in the dumped list
     * @param i row
     * @param j column
     */

    getDumpCell(i: number, j: number): boolean {
        let dumpPos = -1;

        for (dumpPos = 0; dumpPos < this.dumpCells.length; dumpPos++) {
            if (this.dumpCells[dumpPos][0] == i && this.dumpCells[dumpPos][1] == j) {
                return true;
            }
        }

        return false;
    }

    /**
     * Returns if a dump flag is set or not
     * @param dumpFlag Flag to get
     */
    getDumps(dumpFlag: DumpTypes): boolean {
        return this.dumps.hasOwnProperty(dumpFlag.toLowerCase()) && this.dumps[dumpFlag];
    }

    /**
     * Sets or disables a dump flag
     * @param dumpFlag Flag to set
     * @param flagValue True if it dumps, false if not
     */
    setDumps(dumpFlag: DumpTypes, flagValue: boolean) {
        this.dumps[dumpFlag] = flagValue;
    }

    /**
     * Toggles a dump flag
     * @param dumpFlag Flag to toggle
     */
    toggleDumps(dumpFlag: DumpTypes) {
        this.setDumps(dumpFlag, !this.getDumps(dumpFlag));
    }

    /**
     * Loads a world data into the this object
     * @param doc XML document that represents the world
     */
    load(doc: Document) {
        const self = this;
        self.clear();

        let rules = {
            mundo: function (mundo) {
                let alto = mundo.getAttribute('alto');
                let ancho = mundo.getAttribute('ancho');

                if (!alto || !ancho) {
                    return;
                }
                alto = parseInt(alto, 10);
                ancho = parseInt(ancho, 10);
                if (!alto || !ancho) {
                    return;
                }

                self.resize(ancho, alto);
            },

            condiciones: function (condiciones) {
                self.maxInstructions =
                    parseInt(
                        condiciones.getAttribute('instruccionesMaximasAEjecutar'),
                        10,
                    ) || 10000000;
                self.maxStackSize =
                    parseInt(condiciones.getAttribute('longitudStack'), 10) || 65000;
                self.maxStackMemory =
                    parseInt(condiciones.getAttribute('memoriaStack'), 10) || 65000;                    
                self.maxCallSize  =
                    parseInt(condiciones.getAttribute('llamadaMaxima'), 10) || 5;
            },

            comando: function (comando) {
                let name = comando.getAttribute('nombre');
                let val = parseInt(comando.getAttribute('maximoNumeroDeEjecuciones'), 10);

                if (!name || !val) {
                    return;
                }

                if (name == 'AVANZA') {
                    self.maxMove = val;
                } else if (name == 'GIRA_IZQUIERDA') {
                    self.maxTurnLeft = val;
                } else if (name == 'COGE_ZUMBADOR') {
                    self.maxPickBuzzer = val;
                } else if (name == 'DEJA_ZUMBADOR') {
                    self.maxLeaveBuzzer = val;
                }
            },

            monton: function (monton) {
                let i = parseInt(monton.getAttribute('y'), 10);
                let j = parseInt(monton.getAttribute('x'), 10);
                let zumbadores = monton.getAttribute('zumbadores');
                if (zumbadores == 'INFINITO') {
                    zumbadores = KarelNumbers.a_infinite;
                } else {
                    zumbadores = parseInt(zumbadores, 10);
                    if (isNaN(zumbadores)) zumbadores = 0;
                }
                self.setBuzzers(i, j, zumbadores);
            },

            pared: function (pared) {
                let i = parseInt(pared.getAttribute('y1'), 10) + 1;
                let j = parseInt(pared.getAttribute('x1'), 10) + 1;

                if (pared.getAttribute('x2')) {
                    let j2 = parseInt(pared.getAttribute('x2'), 10) + 1;

                    if (j2 > j) {
                        self.addWall(i, j, 3);
                    } else {
                        self.addWall(i, j2, 3);
                    }
                } else if (pared.getAttribute('y2')) {
                    let i2 = parseInt(pared.getAttribute('y2'), 10) + 1;

                    if (i2 > i) {
                        self.addWall(i, j, 0);
                    } else {
                        self.addWall(i2, j, 0);
                    }
                }
            },

            despliega: function (despliega) {
                self.dumps[despliega.getAttribute('tipo').toLowerCase()] = true;
            },

            posicionDump: function (dump) {
                let i = parseInt(dump.getAttribute('y'), 10)
                let j = parseInt(dump.getAttribute('x'), 10)
                if (i <= 0 || j <=0 || i > self.h || j > self.w) {
                    return;
                }
                self.dumpCells.push([
                    i,
                    j,
                ]);
            },            

            programa: function (programa) {
                let xKarel = parseInt(
                    programa.getAttribute('xKarel') || programa.getAttribute('xkarel'),
                    10,
                );
                let yKarel = parseInt(
                    programa.getAttribute('yKarel') || programa.getAttribute('ykarel'),
                    10,
                );
                self.rotate(
                    programa.getAttribute('direccionKarel') ||
                    programa.getAttribute('direccionkarel'),
                );
                self.worldName =
                    programa.getAttribute('mundoDeEjecucion') ||
                    programa.getAttribute('mundodeejecucion');
                self.programName = programa.getAttribute('nombre');
                self.move(yKarel, xKarel);
                let bagBuzzers =
                    programa.getAttribute('mochilaKarel') ||
                    programa.getAttribute('mochilakarel') ||
                    0;
                if (bagBuzzers == 'INFINITO') {
                    self.setBagBuzzers(KarelNumbers.a_infinite);
                } else {
                    self.setBagBuzzers(parseInt(bagBuzzers));
                }
            },
        };

        function traverse(node: XMLDocument | ChildNode) {
            let type = node.nodeName;
            if (rules.hasOwnProperty(type)) {
                rules[type](node);
            }

            for (let i = 0; i < node.childNodes.length; i++) {
                if (
                    node.childNodes.item(i).nodeType ===
                    (node.ELEMENT_NODE || Node.ELEMENT_NODE)
                ) {
                    traverse(node.childNodes.item(i));
                }
            }
        }

        traverse(doc);

        self.reset();
    }

    /**
     * Recursively converts a js object into an XML string
     * @param node A Object node/value
     * @param name The object name
     * @param indentation THe indentation for the xml
     * @returns A XML string
     */
    private serialize(node: any, name: string, indentation: number) {


        let result = '';
        for (let i = 0; i < indentation; i++) {
            result += '\t';
        }

        if (typeof node === 'string' || typeof node === 'number') {
            return result + node;
        }

        if (Array.isArray(node)) {
            result = '';

            for (let i = 0; i < node.length; i++) {
                result += this.serialize(node[i], name, indentation);
            }
        } else {
            let childResult = '';

            for (let p in node) {
                if (node.hasOwnProperty(p)) {
                    if (p[0] == '#') {
                        continue;
                    } else {
                        childResult += this.serialize(node[p], p, indentation + 1);
                    }
                }
            }

            result += '<' + name;

            if (node.hasOwnProperty('#attributes')) {
                for (let p in node['#attributes']) {
                    if (node['#attributes'].hasOwnProperty(p)) {
                        result += ' ' + p + '="' + node['#attributes'][p] + '"';
                    }
                }
            }

            if (node.hasOwnProperty('#text')) {
                result += '>' + node['#text'] + '</' + name + '>\n';
            } else if (childResult == '') {
                result += '/>\n';
            } else {
                result += '>\n';
                result += childResult;
                for (let i = 0; i < indentation; i++) {
                    result += '\t';
                }
                result += '</' + name + '>\n';
            }
        }

        return result;
    }

    /**
     * Generates the XML representation of the input
     * @param targetState if "current", it saves the current state. If "start" it saves the start state
     * @returns XML string representing the input
     */
    save(targetState:"current"|"start"): string {
        let result: any = {
            condiciones: {
                '#attributes': {
                    instruccionesMaximasAEjecutar: this.maxInstructions,
                    longitudStack: this.maxStackSize,
                    memoriaStack: this.maxStackMemory,
                    llamadaMaxima: this.maxCallSize,
                },
                comando: []
            },
            mundos: {
                mundo: {
                    '#attributes': { nombre: this.worldName, ancho: this.w, alto: this.h },
                    monton: [],
                    pared: [],
                    posicionDump: [],
                },
            },
            programas: {
                '#attributes': {
                    tipoEjecucion: 'CONTINUA',
                    intruccionesCambioContexto: 1,
                    milisegundosParaPasoAutomatico: 0,
                },
                programa: {
                    '#attributes': {
                        nombre: this.programName,
                        ruta: '{$2$}',
                        mundoDeEjecucion: this.worldName,
                        xKarel: targetState === "start" ? this.start_j:this.j,
                        yKarel: targetState === "start" ? this.start_i:this.i,
                        direccionKarel: ['OESTE', 'NORTE', 'ESTE', 'SUR'][targetState === "start" ? this.startOrientation: this.orientation],
                        mochilaKarel: KarelNumbers.isInfinite(this.bagBuzzers)  ? 'INFINITO' :( targetState === "start" ? this.startBagBuzzers: this.bagBuzzers),
                    },
                    despliega: [],
                },
            },
        };

        for (let i = 1; i <= this.h; i++) {
            for (let j = 1; j <= this.w; j++) {
                let buzzers =  targetState === "start" ? this.startBuzzers(i,j) : this.buzzers(i, j);
                if (buzzers !== 0) {
                    result.mundos.mundo.monton.push({
                        '#attributes': {
                            x: j,
                            y: i,
                            zumbadores: KarelNumbers.isInfinite(buzzers) ? 'INFINITO' : buzzers,
                        },
                    });
                }
            }
        }

        if (this.maxMove !== -1) {
            result.condiciones.comando.push({
                '#attributes': {
                    nombre: "AVANZA",
                    maximoNumeroDeEjecuciones: this.maxMove
                }
            });
        }
        if (this.maxTurnLeft !== -1) {
            result.condiciones.comando.push({
                '#attributes': {
                    nombre: "GIRA_IZQUIERDA",
                    maximoNumeroDeEjecuciones: this.maxTurnLeft
                }
            });
        }
        if (this.maxLeaveBuzzer !== -1) {
            result.condiciones.comando.push({
                '#attributes': {
                    nombre: "DEJA_ZUMBADOR",
                    maximoNumeroDeEjecuciones: this.maxLeaveBuzzer
                }
            });
        }
        if (this.maxPickBuzzer !== -1) {
            result.condiciones.comando.push({
                '#attributes': {
                    nombre: "COGE_ZUMBADOR",
                    maximoNumeroDeEjecuciones: this.maxPickBuzzer
                }
            });
        }

        for (let i = 1; i <= this.h; i++) {
            for (let j = 1; j <= this.w; j++) {
                let walls = this.walls(i, j);
                for (let k = 2; k < 8; k <<= 1) {
                    if (i == this.h && k == 2) continue;
                    if (j == this.w && k == 4) continue;

                    if ((walls & k) == k) {
                        if (k == 2) {
                            result.mundos.mundo.pared.push({
                                '#attributes': { x1: j - 1, y1: i, x2: j },
                            });
                        } else if (k == 4) {
                            result.mundos.mundo.pared.push({
                                '#attributes': { x1: j, y1: i - 1, y2: i },
                            });
                        }
                    }
                }
            }
        }

        for (let i = 0; i < this.dumpCells.length; i++) {
            result.mundos.mundo.posicionDump.push({
                '#attributes': { x: this.dumpCells[i][1], y: this.dumpCells[i][0] },
            });
        }

        for (let p in this.dumps) {
            if (this.dumps.hasOwnProperty(p) && this.dumps[p]) {
                result.programas.programa.despliega.push({
                    '#attributes': { tipo: p.toUpperCase() },
                });
            }
        }

        return this.serialize(result, 'ejecucion', 0);
    }

    /**
     * Generates the XML representation of the current state, 
     * you may need to first run the code to get the final output
     * @returns  XML string representing the output
    */
    output(): string {
        let result: any = {};

        if (this.dumps[DumpTypes.DUMP_WORLD] || this.dumps[DumpTypes.DUMP_ALL_BUZZERS]) {
            result.mundos = {
                mundo: { '#attributes': { nombre: this.worldName }, linea: [] },
            };

            let dumpCells = {};
            for (let i = 0; i < this.dumpCells.length; i++) {
                if (!dumpCells.hasOwnProperty(this.dumpCells[i][0])) {
                    dumpCells[this.dumpCells[i][0]] = {};
                }
                dumpCells[this.dumpCells[i][0]][this.dumpCells[i][1]] = true;
            }

            for (let i = this.h; i > 0; i--) {
                let printCoordinate = true;
                let line = '';

                for (let j = 1; j <= this.w; j++) {
                    if (
                        (dumpCells[i] && dumpCells[i][j]) ||
                        this.dumps[DumpTypes.DUMP_ALL_BUZZERS]
                    ) {
                        if (this.buzzers(i, j) !== 0) {
                            if (printCoordinate) {
                                line += '(' + j + ') ';
                            }
                            // TODO: Este es un bug en karel.exe.
                            line += (this.buzzers(i, j) & 0xffff) + ' ';
                        }
                        printCoordinate = this.buzzers(i, j) == 0;
                    }
                }

                if (line !== '') {
                    result.mundos.mundo.linea.push({
                        '#attributes': { fila: i, compresionDeCeros: 'true' },
                        '#text': line,
                    });
                }
            }
        }

        result.programas = {
            programa: { '#attributes': { nombre: this.programName } },
        };

        result.programas.programa['#attributes'].resultadoEjecucion = this.errorMap(
            this.runtime.state.error,
        );

        if (this.dumps[DumpTypes.DUMP_POSITION]) {
            result.programas.programa.karel = {
                '#attributes': { x: this.j, y: this.i },
            };
        }

        if (this.dumps[DumpTypes.DUMP_ORIENTATION]) {
            result.programas.programa.karel = result.programas.programa.karel || {
                '#attributes': {},
            };
            result.programas.programa.karel['#attributes'].direccion = [
                'OESTE',
                'NORTE',
                'ESTE',
                'SUR',
            ][this.orientation];
        }

        if (this.dumps[DumpTypes.DUMP_BAG]) {
            result.programas.programa.karel = result.programas.programa.karel || {
                '#attributes': {},
            };
            result.programas.programa.karel['#attributes'].mochila =
                KarelNumbers.isInfinite(this.bagBuzzers) ? 'INFINITO' : this.bagBuzzers;
        }

        if (this.dumps[DumpTypes.DUMP_MOVE]) {
            result.programas.programa.instrucciones = result.programas.programa
                .instrucciones || { '#attributes': {} };
            result.programas.programa.instrucciones['#attributes'].avanza =
                this.runtime.state.moveCount;
        }

        if (this.dumps[DumpTypes.DUMP_LEFT]) {
            result.programas.programa.instrucciones = result.programas.programa
                .instrucciones || { '#attributes': {} };
            result.programas.programa.instrucciones['#attributes'].gira_izquierda =
                this.runtime.state.turnLeftCount;
        }

        if (this.dumps[DumpTypes.DUMP_PICK_BUZZER]) {
            result.programas.programa.instrucciones = result.programas.programa
                .instrucciones || { '#attributes': {} };
            result.programas.programa.instrucciones['#attributes'].coge_zumbador =
                this.runtime.state.pickBuzzerCount;
        }

        if (this.dumps[DumpTypes.DUMP_LEAVE_BUZZER]) {
            result.programas.programa.instrucciones = result.programas.programa
                .instrucciones || { '#attributes': {} };
            result.programas.programa.instrucciones['#attributes'].deja_zumbador =
                this.runtime.state.leaveBuzzerCount;
        }

        return this.serialize(result, 'resultados', 0);
    }

    /**
     * Moves Karel both at the **start** and **current** state to a cell
     * @param i row
     * @param j column
     */
    move(i: number, j: number): void {
        this.i = this.start_i = i;
        this.j = this.start_j = j;
        this.dirty = true;
    }

    /**
     * Rotates Karel both at the **start** and **current**
     * @param orientation If set, it rotates to the specified rotation, otherwise it rotates to the left.
     */
    rotate(orientation?: Orientation): void {
        let orientations: Orientation[] = ['OESTE', 'NORTE', 'ESTE', 'SUR'];

        if (!orientation) {
            orientation = orientations[(this.orientation + 3) % 4]; // +3 to make the turn to the left
        }
        this.orientation = this.startOrientation = Math.max(
            0,
            orientations.indexOf(orientation),
        );
        this.dirty = true;
    }

    /**
     * Sets both the **start** and **current** state buzzer bag
     * @param buzzers 
     */
    setBagBuzzers(buzzers: number): void {
        if (isNaN(buzzers)) buzzers = 0;
        this.bagBuzzers = this.startBagBuzzers = buzzers > KarelNumbers.maximum ? KarelNumbers.a_infinite : buzzers;
        this.dirty = true;
    }

    /**
     * Restores the current state to the start state
     */
    reset () {
      
        this.orientation = this.startOrientation;
        this.move(this.start_i, this.start_j);
        this.bagBuzzers = this.startBagBuzzers;
      
        for (let i = 0; i < this.currentMap.length; i++) {
          this.currentMap[i] = this.map[i];
        }
      
        this.runtime.reset();
      
        this.dirty = true;
      }
    
    /**
     * Converts an error to an string output
     * @param s error, if not set, it is understood there was no error
     * @returns The program output
     */
    errorMap(s: string | null): string {
        if (!s) return 'FIN PROGRAMA';
        if (ERROR_MAPPING.hasOwnProperty(s)) {
            return ERROR_MAPPING[s];
        } else {
            return s;
        }
    }


}

