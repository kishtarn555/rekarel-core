/* parser generated by jison 0.4.18 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var karelpascal = (function(){
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,5],$V1=[1,11],$V2=[1,12],$V3=[5,13],$V4=[9,15],$V5=[2,21],$V6=[1,39],$V7=[1,22],$V8=[1,23],$V9=[1,24],$Va=[1,25],$Vb=[1,26],$Vc=[1,32],$Vd=[1,33],$Ve=[1,36],$Vf=[1,37],$Vg=[1,38],$Vh=[2,17],$Vi=[1,42],$Vj=[1,51],$Vk=[9,15,42],$Vl=[9,15,42,49],$Vm=[24,58,60,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79],$Vn=[2,77],$Vo=[7,20,26],$Vp=[1,71],$Vq=[1,72],$Vr=[1,73],$Vs=[1,82],$Vt=[1,78],$Vu=[1,80],$Vv=[1,83],$Vw=[1,84],$Vx=[1,85],$Vy=[1,86],$Vz=[1,87],$VA=[1,88],$VB=[1,89],$VC=[1,90],$VD=[1,91],$VE=[1,92],$VF=[1,93],$VG=[1,94],$VH=[1,95],$VI=[1,96],$VJ=[1,97],$VK=[1,98],$VL=[1,99],$VM=[1,100],$VN=[25,53,83],$VO=[1,114],$VP=[25,48,51,54],$VQ=[1,115],$VR=[25,48,51,54,56];
var parser = {trace: function trace () { },
yy: {},
symbols_: {"error":2,"program":3,"import_list":4,"BEGINPROG":5,"def_list":6,"BEGINEXEC":7,"expr_list":8,"ENDEXEC":9,"ENDPROG":10,"EOF":11,"import":12,"IMPORT":13,"package":14,";":15,"VAR":16,".":17,"*":18,"def":19,"PROTO":20,"funct_type":21,"line":22,"var":23,"(":24,")":25,"DEF":26,"AS":27,"expr":28,"INT":29,"genexpr":30,"FORWARD":31,"LEFT":32,"PICKBUZZER":33,"LEAVEBUZZER":34,"HALT":35,"return":36,"call":37,"cond":38,"loop":39,"repeat":40,"BEGIN":41,"END":42,"RET":43,"integer":44,"parameteredCall":45,"IF":46,"term":47,"THEN":48,"ELSE":49,"WHILE":50,"DO":51,"REPEAT":52,"TIMES":53,"OR":54,"and_term":55,"AND":56,"not_term":57,"NOT":58,"clause":59,"IFZ":60,"bool_fun":61,"IFNFWALL":62,"IFFWALL":63,"IFNLWALL":64,"IFLWALL":65,"IFNRWALL":66,"IFRWALL":67,"IFWBUZZER":68,"IFNWBUZZER":69,"IFBBUZZER":70,"IFNBBUZZER":71,"IFW":72,"IFN":73,"IFE":74,"IFS":75,"IFNW":76,"IFNN":77,"IFNE":78,"IFNS":79,"int_literal":80,"INC":81,"DEC":82,",":83,"NUM":84,"$accept":0,"$end":1},
terminals_: {2:"error",5:"BEGINPROG",7:"BEGINEXEC",9:"ENDEXEC",10:"ENDPROG",11:"EOF",13:"IMPORT",15:";",16:"VAR",17:".",18:"*",20:"PROTO",24:"(",25:")",26:"DEF",27:"AS",29:"INT",31:"FORWARD",32:"LEFT",33:"PICKBUZZER",34:"LEAVEBUZZER",35:"HALT",41:"BEGIN",42:"END",43:"RET",46:"IF",48:"THEN",49:"ELSE",50:"WHILE",51:"DO",52:"REPEAT",53:"TIMES",54:"OR",56:"AND",58:"NOT",60:"IFZ",62:"IFNFWALL",63:"IFFWALL",64:"IFNLWALL",65:"IFLWALL",66:"IFNRWALL",67:"IFRWALL",68:"IFWBUZZER",69:"IFNWBUZZER",70:"IFBBUZZER",71:"IFNBBUZZER",72:"IFW",73:"IFN",74:"IFE",75:"IFS",76:"IFNW",77:"IFNN",78:"IFNE",79:"IFNS",81:"INC",82:"DEC",83:",",84:"NUM"},
productions_: [0,[3,8],[3,7],[3,7],[3,6],[4,2],[4,1],[12,3],[14,3],[14,3],[6,3],[6,2],[19,4],[19,7],[19,6],[19,9],[21,1],[21,0],[8,3],[8,1],[30,1],[30,0],[28,1],[28,1],[28,1],[28,1],[28,1],[28,1],[28,1],[28,1],[28,1],[28,1],[28,3],[36,1],[36,4],[37,1],[37,1],[45,4],[38,5],[38,7],[39,5],[40,5],[47,3],[47,1],[55,3],[55,1],[57,2],[57,1],[59,4],[59,1],[59,3],[61,1],[61,1],[61,1],[61,1],[61,1],[61,1],[61,1],[61,1],[61,1],[61,1],[61,1],[61,1],[61,1],[61,1],[61,1],[61,1],[61,1],[61,1],[44,1],[44,1],[44,4],[44,4],[44,6],[44,6],[80,1],[23,1],[22,0]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:
 
      return {
        compiler: COMPILER,
        language: LANG,
        requieresFunctionPrototypes: true, 
        packages: $$[$0-7],
        functions: $$[$0-5],
        program: $$[$0-3].concat([['LINE', yylineno], ['HALT']]),
        yy:yy,
      }; 
    
break;
case 2:
 
      return {
        compiler: COMPILER,
        language: LANG,
        requieresFunctionPrototypes: true,
        packages: $$[$0-6],
        functions: [],
        program: $$[$0-3].concat([['LINE', yylineno], ['HALT']]),
        yy:yy,
      }; 
    
break;
case 3:
 
      return {
        compiler: COMPILER,
        language: LANG,
        requieresFunctionPrototypes: true, 
        packages: [],
        functions: $$[$0-5],
        program: $$[$0-3].concat([['LINE', yylineno], ['HALT']]),
        yy:yy,
      }; 
    
break;
case 4:
 
      return {
        compiler: COMPILER,
        language: LANG,
        requieresFunctionPrototypes: true,
        packages: [],
        functions: [],
        program: $$[$0-3].concat([['LINE', yylineno], ['HALT']]),
        yy:yy,
      }; 
    
break;
case 5:
 this.$ = $$[$0-1].concat($$[$0]); 
break;
case 6: case 19: case 20: case 27: case 28: case 29: case 30: case 31: case 36: case 43: case 45: case 47: case 49:
 this.$ = $$[$0]; 
break;
case 7:
 this.$ = [[$$[$0-1]]]; 
break;
case 8:

    this.$= $$[$0-2]+"."+$$[$0];
  
break;
case 9:

    this.$= $$[$0-2]+".*";
  
break;
case 10:
 this.$ = $$[$0-2].concat($$[$0-1]); 
break;
case 11: case 32: case 50:
 this.$ = $$[$0-1]; 
break;
case 12:
 
      this._$.first_line = _$[$0-3].first_line;
      this._$.first_column = _$[$0-3].first_column;
      this._$.last_line = _$[$0-1].last_line;
      this._$.last_column = _$[$0-1].last_column;
      this.$ = [[
        $$[$0].toLowerCase(), 
        null, 
        [],  
        this._$,
        $$[$0-2]
      ]]; 
    
break;
case 13:
 
      this._$.first_line = _$[$0-6].first_line;
      this._$.first_column = _$[$0-6].first_column;
      this._$.last_line = _$[$0-1].last_line;
      this._$.last_column = _$[$0-1].last_column;
      this.$ = [[
        $$[$0-3].toLowerCase(), 
        null, 
        [$$[$0-1]],  
        this._$,
        $$[$0-5]
      ]]; 
      
break;
case 14:
 
      this._$.first_line = _$[$0-5].first_line;
      this._$.first_column = _$[$0-5].first_column;
      this._$.last_line = _$[$0-3].last_line;
      this._$.last_column = _$[$0-3].last_column;

      this.$ = [[
        $$[$0-2],  
        $$[$0-3].concat($$[$0]).concat([['RET', '__DEFAULT', _$[$0-5]]]), //FIXME: This should be in the end of the expression
        [], 
        this._$,
        $$[$0-4]
      ]]; 
    
break;
case 15:

      
      this._$.first_line = _$[$0-8].first_line;
      this._$.first_column = _$[$0-8].first_column;
      this._$.last_line = _$[$0-6].last_line;
      this._$.last_column = _$[$0-6].last_column;

    	this.$ = [[
        $$[$0-5],
        $$[$0-6].concat($$[$0]).concat([['RET', '__DEFAULT', _$[$0-8]]]), //FIXME: This should be in the end of the expression
        [$$[$0-3]],
        this._$,        
        $$[$0-7]
      ]];
    
break;
case 16:
 this.$ = "INT"; 
break;
case 17:
 this.$ = "VOID"; 
break;
case 18:
 this.$ = $$[$0-2].concat($$[$0]); 
break;
case 21:
 this.$ = []; 
break;
case 22:
 this.$ = [['LINE', yylineno], ['WORLDWALLS'], ['ORIENTATION'], ['MASK'], ['AND'], ['NOT'], ['EZ', 'WALL'], ['FORWARD']]; 
break;
case 23:
 this.$ = [['LINE', yylineno], ['LEFT']]; 
break;
case 24:
 this.$ = [['LINE', yylineno], ['WORLDBUZZERS'], ['EZ', 'WORLDUNDERFLOW'], ['PICKBUZZER']]; 
break;
case 25:
 this.$ = [['LINE', yylineno], ['BAGBUZZERS'], ['EZ', 'BAGUNDERFLOW'], ['LEAVEBUZZER']]; 
break;
case 26:
 this.$ = [['LINE', yylineno], ['HALT']]; 
break;
case 33:
 this.$ = [['LINE', yylineno], ['RET', 'VOID', _$[$0]]]; 
break;
case 34:
 this.$ = [['LINE', yylineno], ...$$[$0-1], ['SRET'], [ 'RET', 'INT', _$[$0-3]]]; 
break;
case 35:
 
      this.$ = [
        ['LINE', yylineno],
        ['LOAD', 0],
        [
          'CALL', 
          {
            target:$$[$0].toLowerCase(), 
            argCount:1, 
            nameLoc: _$[$0], 
            argCount: _$[$0]
          }
        ],
        ['LINE', yylineno]
      ];
    
break;
case 37:
 
      this.$ = [
        ['LINE', yylineno], 
        ...$$[$0-1], 
        [
          'CALL', 
          {
            target: $$[$0-3].toLowerCase(), 
            argCount: 2, 
            nameLoc: _$[$0-3], 
            argLoc: _$[$0-1]
          }
        ], 
        ['LINE', yylineno]
      ]; 
    
break;
case 38:
 this.$ = $$[$0-3].concat($$[$0-2]).concat([['JZ', $$[$0].length]]).concat($$[$0]); 
break;
case 39:
 this.$ = $$[$0-5].concat($$[$0-4]).concat([['JZ', 1 + $$[$0-2].length]]).concat($$[$0-2]).concat([['JMP', $$[$0].length]]).concat($$[$0]); 
break;
case 40:
 this.$ = $$[$0-3].concat($$[$0-2]).concat([['JZ', 1 + $$[$0].length]]).concat($$[$0]).concat([['JMP', -1 -($$[$0-2].length + $$[$0].length + 2)]]); 
break;
case 41:
 this.$ = $$[$0-3].concat($$[$0-2]).concat([['DUP'], ['LOAD', 0], ['EQ'], ['NOT'], ['JZ', $$[$0].length + 2]]).concat($$[$0]).concat([['DEC', 1], ['JMP', -1 -($$[$0].length + 6)], ['POP']]); 
break;
case 42:
 this.$ = $$[$0-2].concat($$[$0]).concat([['OR']]); 
break;
case 44:
 this.$ = $$[$0-2].concat($$[$0]).concat([['AND']]); 
break;
case 46:
 this.$ = $$[$0].concat([['NOT']]); 
break;
case 48:
 this.$ = $$[$0-1].concat([['NOT']]); 
break;
case 51:
 this.$ = [['WORLDWALLS'], ['ORIENTATION'], ['MASK'], ['AND'], ['NOT']]; 
break;
case 52:
 this.$ = [['WORLDWALLS'], ['ORIENTATION'], ['MASK'], ['AND']]; 
break;
case 53:
 this.$ = [['WORLDWALLS'], ['ORIENTATION'], ['ROTL'], ['MASK'], ['AND'], ['NOT']]; 
break;
case 54:
 this.$ = [['WORLDWALLS'], ['ORIENTATION'], ['ROTL'], ['MASK'], ['AND']]; 
break;
case 55:
 this.$ = [['WORLDWALLS'], ['ORIENTATION'], ['ROTR'], ['MASK'], ['AND'], ['NOT']]; 
break;
case 56:
 this.$ = [['WORLDWALLS'], ['ORIENTATION'], ['ROTR'], ['MASK'], ['AND']]; 
break;
case 57:
 this.$ = [['WORLDBUZZERS'], ['LOAD', 0], ['EQ'], ['NOT']]; 
break;
case 58:
 this.$ = [['WORLDBUZZERS'], ['NOT']]; 
break;
case 59:
 this.$ = [['BAGBUZZERS'], ['LOAD', 0], ['EQ'], ['NOT']]; 
break;
case 60:
 this.$ = [['BAGBUZZERS'], ['NOT']]; 
break;
case 61:
 this.$ = [['ORIENTATION'], ['LOAD', 0], ['EQ']]; 
break;
case 62:
 this.$ = [['ORIENTATION'], ['LOAD', 1], ['EQ']]; 
break;
case 63:
 this.$ = [['ORIENTATION'], ['LOAD', 2], ['EQ']]; 
break;
case 64:
 this.$ = [['ORIENTATION'], ['LOAD', 3], ['EQ']]; 
break;
case 65:
 this.$ = [['ORIENTATION'], ['LOAD', 0], ['EQ'], ['NOT']]; 
break;
case 66:
 this.$ = [['ORIENTATION'], ['LOAD', 1], ['EQ'], ['NOT']]; 
break;
case 67:
 this.$ = [['ORIENTATION'], ['LOAD', 2], ['EQ'], ['NOT']]; 
break;
case 68:
 this.$ = [['ORIENTATION'], ['LOAD', 3], ['EQ'], ['NOT']]; 
break;
case 69:
 this.$ = [[
        'VAR',
        {
          target: $$[$0].toLowerCase(), 
          loc: _$[$0], 
          couldBeFunction: true
        }
      ]]; 
    
break;
case 70:
 this.$ = [['LOAD',  $$[$0]]]; 
break;
case 71:
 this.$ = $$[$0-1].concat([['INC', 1]]); 
break;
case 72:
 this.$ = $$[$0-1].concat([['DEC', 1]]); 
break;
case 73:
 this.$ = $$[$0-3].concat([['INC', $$[$0-1]]]); 
break;
case 74:
 this.$ = $$[$0-3].concat([['DEC', $$[$0-1]]]); 
break;
case 75:
 this.$ = parseInt(yytext); 
break;
case 76:
 this.$ = yytext; 
break;
case 77:
 this.$ = [['LINE', yylineno]]; 
break;
}
},
table: [{3:1,4:2,5:[1,3],12:4,13:$V0},{1:[3]},{5:[1,6],12:7,13:$V0},{6:8,7:[1,9],19:10,20:$V1,26:$V2},o($V3,[2,6]),{14:13,16:[1,14]},{6:15,7:[1,16],19:10,20:$V1,26:$V2},o($V3,[2,5]),{7:[1,17],19:18,20:$V1,26:$V2},o($V4,$V5,{8:19,30:20,28:21,36:27,37:28,38:29,39:30,40:31,23:34,45:35,16:$V6,31:$V7,32:$V8,33:$V9,34:$Va,35:$Vb,41:$Vc,43:$Vd,46:$Ve,50:$Vf,52:$Vg}),{15:[1,40]},{16:$Vh,21:41,29:$Vi},{16:$Vh,21:43,29:$Vi},{15:[1,44]},{17:[1,45]},{7:[1,46],19:18,20:$V1,26:$V2},o($V4,$V5,{30:20,28:21,36:27,37:28,38:29,39:30,40:31,23:34,45:35,8:47,16:$V6,31:$V7,32:$V8,33:$V9,34:$Va,35:$Vb,41:$Vc,43:$Vd,46:$Ve,50:$Vf,52:$Vg}),o($V4,$V5,{30:20,28:21,36:27,37:28,38:29,39:30,40:31,23:34,45:35,8:48,16:$V6,31:$V7,32:$V8,33:$V9,34:$Va,35:$Vb,41:$Vc,43:$Vd,46:$Ve,50:$Vf,52:$Vg}),{15:[1,49]},{9:[1,50],15:$Vj},o($Vk,[2,19]),o($Vk,[2,20]),o($Vl,[2,22]),o($Vl,[2,23]),o($Vl,[2,24]),o($Vl,[2,25]),o($Vl,[2,26]),o($Vl,[2,27]),o($Vl,[2,28]),o($Vl,[2,29]),o($Vl,[2,30]),o($Vl,[2,31]),o([15,42],$V5,{30:20,28:21,36:27,37:28,38:29,39:30,40:31,23:34,45:35,8:52,16:$V6,31:$V7,32:$V8,33:$V9,34:$Va,35:$Vb,41:$Vc,43:$Vd,46:$Ve,50:$Vf,52:$Vg}),o($Vl,[2,33],{24:[1,53]}),o($Vl,[2,35],{24:[1,54]}),o($Vl,[2,36]),o($Vm,$Vn,{22:55}),o($Vm,$Vn,{22:56}),o([16,81,82,84],$Vn,{22:57}),o([9,15,24,25,27,42,49,53,83],[2,76]),o($Vo,[2,11]),{16:$Vn,22:58},{16:[2,16]},{16:$Vn,22:59},o($V3,[2,7]),{16:[1,60],18:[1,61]},o($V4,$V5,{30:20,28:21,36:27,37:28,38:29,39:30,40:31,23:34,45:35,8:62,16:$V6,31:$V7,32:$V8,33:$V9,34:$Va,35:$Vb,41:$Vc,43:$Vd,46:$Ve,50:$Vf,52:$Vg}),{9:[1,63],15:$Vj},{9:[1,64],15:$Vj},o($Vo,[2,10]),{10:[1,65]},o($Vk,$V5,{28:21,36:27,37:28,38:29,39:30,40:31,23:34,45:35,30:66,16:$V6,31:$V7,32:$V8,33:$V9,34:$Va,35:$Vb,41:$Vc,43:$Vd,46:$Ve,50:$Vf,52:$Vg}),{15:$Vj,42:[1,67]},{16:$V6,23:69,44:68,80:70,81:$Vp,82:$Vq,84:$Vr},{16:$V6,23:69,44:74,80:70,81:$Vp,82:$Vq,84:$Vr},{24:$Vs,47:75,55:76,57:77,58:$Vt,59:79,60:$Vu,61:81,62:$Vv,63:$Vw,64:$Vx,65:$Vy,66:$Vz,67:$VA,68:$VB,69:$VC,70:$VD,71:$VE,72:$VF,73:$VG,74:$VH,75:$VI,76:$VJ,77:$VK,78:$VL,79:$VM},{24:$Vs,47:101,55:76,57:77,58:$Vt,59:79,60:$Vu,61:81,62:$Vv,63:$Vw,64:$Vx,65:$Vy,66:$Vz,67:$VA,68:$VB,69:$VC,70:$VD,71:$VE,72:$VF,73:$VG,74:$VH,75:$VI,76:$VJ,77:$VK,78:$VL,79:$VM},{16:$V6,23:69,44:102,80:70,81:$Vp,82:$Vq,84:$Vr},{16:$V6,23:103},{16:$V6,23:104},{15:[2,8]},{15:[2,9]},{9:[1,105],15:$Vj},{10:[1,106]},{10:[1,107]},{11:[1,108]},o($Vk,[2,18]),o($Vl,[2,32]),{25:[1,109]},o($VN,[2,69]),o($VN,[2,70]),{24:[1,110]},{24:[1,111]},o($VN,[2,75]),{25:[1,112]},{48:[1,113],54:$VO},o($VP,[2,43],{56:$VQ}),o($VR,[2,45]),{24:$Vs,59:116,60:$Vu,61:81,62:$Vv,63:$Vw,64:$Vx,65:$Vy,66:$Vz,67:$VA,68:$VB,69:$VC,70:$VD,71:$VE,72:$VF,73:$VG,74:$VH,75:$VI,76:$VJ,77:$VK,78:$VL,79:$VM},o($VR,[2,47]),{24:[1,117]},o($VR,[2,49]),{24:$Vs,47:118,55:76,57:77,58:$Vt,59:79,60:$Vu,61:81,62:$Vv,63:$Vw,64:$Vx,65:$Vy,66:$Vz,67:$VA,68:$VB,69:$VC,70:$VD,71:$VE,72:$VF,73:$VG,74:$VH,75:$VI,76:$VJ,77:$VK,78:$VL,79:$VM},o($VR,[2,51]),o($VR,[2,52]),o($VR,[2,53]),o($VR,[2,54]),o($VR,[2,55]),o($VR,[2,56]),o($VR,[2,57]),o($VR,[2,58]),o($VR,[2,59]),o($VR,[2,60]),o($VR,[2,61]),o($VR,[2,62]),o($VR,[2,63]),o($VR,[2,64]),o($VR,[2,65]),o($VR,[2,66]),o($VR,[2,67]),o($VR,[2,68]),{51:[1,119],54:$VO},{53:[1,120]},{15:[2,12],24:[1,121]},{24:[1,123],27:[1,122]},{10:[1,124]},{11:[1,125]},{11:[1,126]},{1:[2,4]},o($Vl,[2,34]),{16:$V6,23:69,44:127,80:70,81:$Vp,82:$Vq,84:$Vr},{16:$V6,23:69,44:128,80:70,81:$Vp,82:$Vq,84:$Vr},o($Vl,[2,37]),{16:$V6,23:34,28:129,31:$V7,32:$V8,33:$V9,34:$Va,35:$Vb,36:27,37:28,38:29,39:30,40:31,41:$Vc,43:$Vd,45:35,46:$Ve,50:$Vf,52:$Vg},{24:$Vs,55:130,57:77,58:$Vt,59:79,60:$Vu,61:81,62:$Vv,63:$Vw,64:$Vx,65:$Vy,66:$Vz,67:$VA,68:$VB,69:$VC,70:$VD,71:$VE,72:$VF,73:$VG,74:$VH,75:$VI,76:$VJ,77:$VK,78:$VL,79:$VM},{24:$Vs,57:131,58:$Vt,59:79,60:$Vu,61:81,62:$Vv,63:$Vw,64:$Vx,65:$Vy,66:$Vz,67:$VA,68:$VB,69:$VC,70:$VD,71:$VE,72:$VF,73:$VG,74:$VH,75:$VI,76:$VJ,77:$VK,78:$VL,79:$VM},o($VR,[2,46]),{16:$V6,23:69,44:132,80:70,81:$Vp,82:$Vq,84:$Vr},{25:[1,133],54:$VO},{16:$V6,23:34,28:134,31:$V7,32:$V8,33:$V9,34:$Va,35:$Vb,36:27,37:28,38:29,39:30,40:31,41:$Vc,43:$Vd,45:35,46:$Ve,50:$Vf,52:$Vg},{16:$V6,23:34,28:135,31:$V7,32:$V8,33:$V9,34:$Va,35:$Vb,36:27,37:28,38:29,39:30,40:31,41:$Vc,43:$Vd,45:35,46:$Ve,50:$Vf,52:$Vg},{16:$V6,23:136},{16:$V6,23:34,28:137,31:$V7,32:$V8,33:$V9,34:$Va,35:$Vb,36:27,37:28,38:29,39:30,40:31,41:$Vc,43:$Vd,45:35,46:$Ve,50:$Vf,52:$Vg},{16:$V6,23:138},{11:[1,139]},{1:[2,2]},{1:[2,3]},{25:[1,140],83:[1,141]},{25:[1,142],83:[1,143]},o($Vk,[2,38],{49:[1,144]}),o($VP,[2,42],{56:$VQ}),o($VR,[2,44]),{25:[1,145]},o($VR,[2,50]),o($Vl,[2,40]),o($Vl,[2,41]),{25:[1,146]},{15:[2,14]},{25:[1,147]},{1:[2,1]},o($VN,[2,71]),{80:148,84:$Vr},o($VN,[2,72]),{80:149,84:$Vr},{16:$V6,23:34,28:150,31:$V7,32:$V8,33:$V9,34:$Va,35:$Vb,36:27,37:28,38:29,39:30,40:31,41:$Vc,43:$Vd,45:35,46:$Ve,50:$Vf,52:$Vg},o($VR,[2,48]),{15:[2,13]},{27:[1,151]},{25:[1,152]},{25:[1,153]},o($Vl,[2,39]),{16:$V6,23:34,28:154,31:$V7,32:$V8,33:$V9,34:$Va,35:$Vb,36:27,37:28,38:29,39:30,40:31,41:$Vc,43:$Vd,45:35,46:$Ve,50:$Vf,52:$Vg},o($VN,[2,73]),o($VN,[2,74]),{15:[2,15]}],
defaultActions: {42:[2,16],60:[2,8],61:[2,9],108:[2,4],125:[2,2],126:[2,3],137:[2,14],139:[2,1],146:[2,13],154:[2,15]},
parseError: function parseError (str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        var error = new Error(str);
        error.hash = hash;
        throw error;
    }
},
parse: function parse(input) {
    var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    var args = lstack.slice.call(arguments, 1);
    var lexer = Object.create(this.lexer);
    var sharedState = { yy: {} };
    for (var k in this.yy) {
        if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
            sharedState.yy[k] = this.yy[k];
        }
    }
    lexer.setInput(input, sharedState.yy);
    sharedState.yy.lexer = lexer;
    sharedState.yy.parser = this;
    if (typeof lexer.yylloc == 'undefined') {
        lexer.yylloc = {};
    }
    var yyloc = lexer.yylloc;
    lstack.push(yyloc);
    var ranges = lexer.options && lexer.options.ranges;
    if (typeof sharedState.yy.parseError === 'function') {
        this.parseError = sharedState.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    // _token_stack:
        var lex = function () {
            var token;
            token = lexer.lex() || EOF;
            if (typeof token !== 'number') {
                token = self.symbols_[token] || token;
            }
            return token;
        };
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: lexer.yylineno,
                    loc: lexer.yylloc, // Implement fix: https://github.com/zaach/jison/pull/356
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(lexer.yytext);
            lstack.push(lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = lexer.yyleng;
                yytext = lexer.yytext;
                yylineno = lexer.yylineno;
                yyloc = lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.apply(yyval, [
                yytext,
                yyleng,
                yylineno,
                sharedState.yy,
                action[1],
                vstack,
                lstack
            ].concat(args));
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};


const COMPILER= "RKP 1.0.0";
const LANG = "ReKarel Pascal"
/* generated by jison-lex 0.3.4 */
var lexer = (function(){
var lexer = ({

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function(match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex () {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin (condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState () {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules () {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState (n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState (condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {"flex":true},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:/* ignore */
break;
case 1:/* ignore */
break;
case 2:/* ignore */
break;
case 3: return 5; 
break;
case 4: return 7; 
break;
case 5: return 7; 
break;
case 6: return 9; 
break;
case 7: return 9; 
break;
case 8: return 10; 
break;
case 9: return 26; 
break;
case 10: return 26; 
break;
case 11: return 13; 
break;
case 12: return 20; 
break;
case 13: return 20; 
break;
case 14: return 29; 
break;
case 15: return 43; 
break;
case 16: return 43; 
break;
case 17: return 43; 
break;
case 18: return 27; 
break;
case 19: return 35; 
break;
case 20: return 35; 
break;
case 21: return 32; 
break;
case 22: return 31; 
break;
case 23: return 33; 
break;
case 24: return 34; 
break;
case 25: return 41; 
break;
case 26: return 42; 
break;
case 27: return 48; 
break;
case 28: return 50; 
break;
case 29: return 51; 
break;
case 30: return 52; 
break;
case 31: return 53; 
break;
case 32: return 82; 
break;
case 33: return 81; 
break;
case 34: return 60; 
break;
case 35: return 62; 
break;
case 36: return 63; 
break;
case 37: return 64; 
break;
case 38: return 65; 
break;
case 39: return 66; 
break;
case 40: return 67; 
break;
case 41: return 68; 
break;
case 42: return 69; 
break;
case 43: return 70; 
break;
case 44: return 70; 
break;
case 45: return 71; 
break;
case 46: return 71; 
break;
case 47: return 73; 
break;
case 48: return 75; 
break;
case 49: return 74; 
break;
case 50: return 72; 
break;
case 51: return 77; 
break;
case 52: return 79; 
break;
case 53: return 78; 
break;
case 54: return 76; 
break;
case 55: return 49; 
break;
case 56: return 49; 
break;
case 57: return 46; 
break;
case 58: return 58; 
break;
case 59: return 54; 
break;
case 60: return 54; 
break;
case 61: return 56; 
break;
case 62: return 56; 
break;
case 63: return 24; 
break;
case 64: return 25; 
break;
case 65: return 15; 
break;
case 66: return 17; 
break;
case 67: return 83; 
break;
case 68: return 18; 
break;
case 69: return 84; 
break;
case 70: return 16; 
break;
case 71: return 11; 
break;
case 72:console.log(yy_.yytext);
break;
}
},
rules: [/^(?:\s+)/,/^(?:\{[^}]*\})/,/^(?:\(\*(?:[^*]|\*(?!\)))*\*\))/,/^(?:iniciar-programa)/,/^(?:inicia-ejecucion)/,/^(?:inicia-ejecución)/,/^(?:termina-ejecucion)/,/^(?:termina-ejecución)/,/^(?:finalizar-programa)/,/^(?:define-nueva-instruccion)/,/^(?:define-nueva-instrucción)/,/^(?:usa)/,/^(?:define-prototipo-instruccion)/,/^(?:define-prototipo-instrucción)/,/^(?:entera)/,/^(?:sal-de-instruccion)/,/^(?:sal-de-instrucción)/,/^(?:regresa)/,/^(?:como)/,/^(?:apagate)/,/^(?:apágate)/,/^(?:gira-izquierda)/,/^(?:avanza)/,/^(?:coge-zumbador)/,/^(?:deja-zumbador)/,/^(?:inicio)/,/^(?:fin)/,/^(?:entonces)/,/^(?:mientras)/,/^(?:hacer)/,/^(?:repetir)/,/^(?:veces)/,/^(?:precede)/,/^(?:sucede)/,/^(?:si-es-cero)/,/^(?:frente-libre)/,/^(?:frente-bloqueado)/,/^(?:izquierda-libre)/,/^(?:izquierda-bloqueada)/,/^(?:derecha-libre)/,/^(?:derecha-bloqueada)/,/^(?:junto-a-zumbador)/,/^(?:no-junto-a-zumbador)/,/^(?:algun-zumbador-en-la-mochila)/,/^(?:algún-zumbador-en-la-mochila)/,/^(?:ningun-zumbador-en-la-mochila)/,/^(?:ningún-zumbador-en-la-mochila)/,/^(?:orientado-al-norte)/,/^(?:orientado-al-sur)/,/^(?:orientado-al-este)/,/^(?:orientado-al-oeste)/,/^(?:no-orientado-al-norte)/,/^(?:no-orientado-al-sur)/,/^(?:no-orientado-al-este)/,/^(?:no-orientado-al-oeste)/,/^(?:sino)/,/^(?:si-no)/,/^(?:si)/,/^(?:no)/,/^(?:o)/,/^(?:u)/,/^(?:y)/,/^(?:e)/,/^(?:\()/,/^(?:\))/,/^(?:;)/,/^(?:\.)/,/^(?:,)/,/^(?:\*)/,/^(?:[0-9]+)/,/^(?:[A-Za-zÀ-ÖØ-öø-ÿ_][A-Za-zÀ-ÖØ-öø-ÿ0-9_-]*)/,/^(?:$)/,/^(?:.)/],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72],"inclusive":true}}
});
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();
function pascalParser () {
    return karelpascal.parse.apply(karelpascal, arguments);
}
export {karelpascal, pascalParser}