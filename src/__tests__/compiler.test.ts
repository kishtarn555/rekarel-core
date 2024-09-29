import {compile} from '../index'


describe("Test compiler", ()=> {
    test("Test empty code", ()=> {
        let compilation = ()=>{
            compile("")
        }
        expect(compilation).toThrow("Unknown syntax, the start of the file must be either 'class' or 'iniciar-programa'");
    });
    test("Test no proper syntax code", ()=> {
        let compilation = ()=>{
            compile("this is a dummy code")
        }
        expect(compilation).toThrow("Unknown syntax, the start of the file must be either 'class' or 'iniciar-programa'");
    });
});