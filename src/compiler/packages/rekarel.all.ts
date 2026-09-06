import { UnitePackages } from "./package";
import { rekarelDebugJava, rekarelDebugPascal } from "./rekarel.debug";
import { rekarelGlobalsJava, rekarelGlobalsPascal } from "./rekarel.globals";

const java = [rekarelGlobalsJava, rekarelGlobalsPascal]

export const JavaPackages= {
    "rekarel.globals":rekarelGlobalsJava,
    "rekarel.debug":rekarelDebugJava,
    "rekarel.*": UnitePackages(java)
} as const;


const pascal = [rekarelGlobalsPascal, rekarelDebugPascal];

export const PascalPackages= {
    "rekarel.globales":rekarelGlobalsPascal,    
    "rekarel.depurar":rekarelDebugPascal,    
    "rekarel.*": UnitePackages(pascal)
} as const;