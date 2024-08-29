import { UnitePackages } from "./package";
import { rekarelGlobalsJava, rekarelGlobalsPascal } from "./rekarel.globals";

const java = [rekarelGlobalsJava]

export const JavaPackages= {
    "rekarel.globals":rekarelGlobalsJava,
    "rekarel.*": UnitePackages(java)
} as const;


const pascal = [rekarelGlobalsPascal];

export const PascalPackages= {
    "rekarel.globals":rekarelGlobalsPascal,    
    "rekarel.*": UnitePackages(pascal)
} as const;