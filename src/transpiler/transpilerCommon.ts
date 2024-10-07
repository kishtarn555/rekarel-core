export function tabs(indentation:number):string{
    let result="";
    for (let i=0; i < indentation; i++) {
        result+="\t";
    }
    return result;
}