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
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,5],$V1=[1,11],$V2=[1,12],$V3=[5,13],$V4=[9,15],$V5=[2,19],$V6=[1,37],$V7=[1,22],$V8=[1,23],$V9=[1,24],$Va=[1,25],$Vb=[1,26],$Vc=[1,27],$Vd=[1,32],$Ve=[1,34],$Vf=[1,35],$Vg=[1,36],$Vh=[2,72],$Vi=[1,48],$Vj=[9,15,40],$Vk=[9,15,40,45],$Vl=[23,54,56,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75],$Vm=[7,20,25],$Vn=[1,67],$Vo=[1,68],$Vp=[1,69],$Vq=[1,77],$Vr=[1,73],$Vs=[1,75],$Vt=[1,78],$Vu=[1,79],$Vv=[1,80],$Vw=[1,81],$Vx=[1,82],$Vy=[1,83],$Vz=[1,84],$VA=[1,85],$VB=[1,86],$VC=[1,87],$VD=[1,88],$VE=[1,89],$VF=[1,90],$VG=[1,91],$VH=[1,92],$VI=[1,93],$VJ=[1,94],$VK=[1,95],$VL=[24,49,79],$VM=[1,109],$VN=[24,44,47,50],$VO=[1,110],$VP=[24,44,47,50,52];
var parser = {trace: function trace () { },
yy: {},
symbols_: {"error":2,"program":3,"import_list":4,"BEGINPROG":5,"def_list":6,"BEGINEXEC":7,"expr_list":8,"ENDEXEC":9,"ENDPROG":10,"EOF":11,"import":12,"IMPORT":13,"package":14,";":15,"VAR":16,".":17,"*":18,"def":19,"PROTO":20,"line":21,"var":22,"(":23,")":24,"DEF":25,"AS":26,"expr":27,"genexpr":28,"FORWARD":29,"LEFT":30,"PICKBUZZER":31,"LEAVEBUZZER":32,"HALT":33,"RET":34,"call":35,"cond":36,"loop":37,"repeat":38,"BEGIN":39,"END":40,"integer":41,"IF":42,"term":43,"THEN":44,"ELSE":45,"WHILE":46,"DO":47,"REPEAT":48,"TIMES":49,"OR":50,"and_term":51,"AND":52,"not_term":53,"NOT":54,"clause":55,"IFZ":56,"bool_fun":57,"IFNFWALL":58,"IFFWALL":59,"IFNLWALL":60,"IFLWALL":61,"IFNRWALL":62,"IFRWALL":63,"IFWBUZZER":64,"IFNWBUZZER":65,"IFBBUZZER":66,"IFNBBUZZER":67,"IFW":68,"IFN":69,"IFE":70,"IFS":71,"IFNW":72,"IFNN":73,"IFNE":74,"IFNS":75,"int_literal":76,"INC":77,"DEC":78,",":79,"NUM":80,"$accept":0,"$end":1},
terminals_: {2:"error",5:"BEGINPROG",7:"BEGINEXEC",9:"ENDEXEC",10:"ENDPROG",11:"EOF",13:"IMPORT",15:";",16:"VAR",17:".",18:"*",20:"PROTO",23:"(",24:")",25:"DEF",26:"AS",29:"FORWARD",30:"LEFT",31:"PICKBUZZER",32:"LEAVEBUZZER",33:"HALT",34:"RET",39:"BEGIN",40:"END",42:"IF",44:"THEN",45:"ELSE",46:"WHILE",47:"DO",48:"REPEAT",49:"TIMES",50:"OR",52:"AND",54:"NOT",56:"IFZ",58:"IFNFWALL",59:"IFFWALL",60:"IFNLWALL",61:"IFLWALL",62:"IFNRWALL",63:"IFRWALL",64:"IFWBUZZER",65:"IFNWBUZZER",66:"IFBBUZZER",67:"IFNBBUZZER",68:"IFW",69:"IFN",70:"IFE",71:"IFS",72:"IFNW",73:"IFNN",74:"IFNE",75:"IFNS",77:"INC",78:"DEC",79:",",80:"NUM"},
productions_: [0,[3,8],[3,7],[3,7],[3,6],[4,2],[4,1],[12,3],[14,3],[14,3],[6,3],[6,2],[19,3],[19,6],[19,5],[19,8],[8,3],[8,1],[28,1],[28,0],[27,1],[27,1],[27,1],[27,1],[27,1],[27,1],[27,1],[27,1],[27,1],[27,1],[27,3],[35,1],[35,4],[36,5],[36,7],[37,5],[38,5],[43,3],[43,1],[51,3],[51,1],[53,2],[53,1],[55,4],[55,1],[55,3],[57,1],[57,1],[57,1],[57,1],[57,1],[57,1],[57,1],[57,1],[57,1],[57,1],[57,1],[57,1],[57,1],[57,1],[57,1],[57,1],[57,1],[57,1],[41,1],[41,1],[41,4],[41,4],[41,6],[41,6],[76,1],[22,1],[21,0]],
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
case 6: case 17: case 18: case 26: case 27: case 28: case 29: case 38: case 40: case 42: case 44:
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
case 11: case 30: case 45:
 this.$ = $$[$0-1]; 
break;
case 12:
 
      this._$.first_line = _$[$0-2].first_line;
      this._$.first_column = _$[$0-2].first_column;
      this._$.last_line = _$[$0].last_line;
      this._$.last_column = _$[$0].last_column;
      this.$ = [[$$[$0].toLowerCase(), null, [],  this._$] ]; 
    
break;
case 13:
 
      this._$.first_line = _$[$0-5].first_line;
      this._$.first_column = _$[$0-5].first_column;
      this._$.last_line = _$[$0].last_line;
      this._$.last_column = _$[$0].last_column;
      this.$ = [[$$[$0-3].toLowerCase(), null, [$$[$0-1]],  this._$] ]; 
      
break;
case 14:
 
      this._$.first_line = _$[$0-4].first_line;
      this._$.first_column = _$[$0-4].first_column;
      this._$.last_line = _$[$0-2].last_line;
      this._$.last_column = _$[$0-2].last_column;

      this.$ = [[$$[$0-2],  $$[$0-3].concat($$[$0]).concat([['RET']]), [], this._$]]; 
    
break;
case 15:

      
      this._$.first_line = _$[$0-7].first_line;
      this._$.first_column = _$[$0-7].first_column;
      this._$.last_line = _$[$0-5].last_line;
      this._$.last_column = _$[$0-5].last_column;

    	this.$ = [[$$[$0-5],  $$[$0-6].concat($$[$0]).concat([['RET']]), [$$[$0-3]], this._$]];
    
break;
case 16:
 this.$ = $$[$0-2].concat($$[$0]); 
break;
case 19:
 this.$ = []; 
break;
case 20:
 this.$ = [['LINE', yylineno], ['WORLDWALLS'], ['ORIENTATION'], ['MASK'], ['AND'], ['NOT'], ['EZ', 'WALL'], ['FORWARD']]; 
break;
case 21:
 this.$ = [['LINE', yylineno], ['LEFT']]; 
break;
case 22:
 this.$ = [['LINE', yylineno], ['WORLDBUZZERS'], ['EZ', 'WORLDUNDERFLOW'], ['PICKBUZZER']]; 
break;
case 23:
 this.$ = [['LINE', yylineno], ['BAGBUZZERS'], ['EZ', 'BAGUNDERFLOW'], ['LEAVEBUZZER']]; 
break;
case 24:
 this.$ = [['LINE', yylineno], ['HALT']]; 
break;
case 25:
 this.$ = [['LINE', yylineno], ['RET']]; 
break;
case 31:
 this.$ = [['LINE', yylineno], ['LOAD', 0], ['CALL', $$[$0].toLowerCase(), 1, _$[$0], _$[$0]], ['LINE', yylineno]]; 
break;
case 32:
 this.$ = [['LINE', yylineno]].concat($$[$0-1]).concat([['CALL', $$[$0-3].toLowerCase(), 2, _$[$0-3], _$[$0-1]], ['LINE', yylineno]]); 
break;
case 33:
 this.$ = $$[$0-3].concat($$[$0-2]).concat([['JZ', $$[$0].length]]).concat($$[$0]); 
break;
case 34:
 this.$ = $$[$0-5].concat($$[$0-4]).concat([['JZ', 1 + $$[$0-2].length]]).concat($$[$0-2]).concat([['JMP', $$[$0].length]]).concat($$[$0]); 
break;
case 35:
 this.$ = $$[$0-3].concat($$[$0-2]).concat([['JZ', 1 + $$[$0].length]]).concat($$[$0]).concat([['JMP', -1 -($$[$0-2].length + $$[$0].length + 2)]]); 
break;
case 36:
 this.$ = $$[$0-3].concat($$[$0-2]).concat([['DUP'], ['LOAD', 0], ['EQ'], ['NOT'], ['JZ', $$[$0].length + 2]]).concat($$[$0]).concat([['DEC', 1], ['JMP', -1 -($$[$0].length + 6)], ['POP']]); 
break;
case 37:
 this.$ = $$[$0-2].concat($$[$0]).concat([['OR']]); 
break;
case 39:
 this.$ = $$[$0-2].concat($$[$0]).concat([['AND']]); 
break;
case 41:
 this.$ = $$[$0].concat([['NOT']]); 
break;
case 43:
 this.$ = $$[$0-1].concat([['NOT']]); 
break;
case 46:
 this.$ = [['WORLDWALLS'], ['ORIENTATION'], ['MASK'], ['AND'], ['NOT']]; 
break;
case 47:
 this.$ = [['WORLDWALLS'], ['ORIENTATION'], ['MASK'], ['AND']]; 
break;
case 48:
 this.$ = [['WORLDWALLS'], ['ORIENTATION'], ['ROTL'], ['MASK'], ['AND'], ['NOT']]; 
break;
case 49:
 this.$ = [['WORLDWALLS'], ['ORIENTATION'], ['ROTL'], ['MASK'], ['AND']]; 
break;
case 50:
 this.$ = [['WORLDWALLS'], ['ORIENTATION'], ['ROTR'], ['MASK'], ['AND'], ['NOT']]; 
break;
case 51:
 this.$ = [['WORLDWALLS'], ['ORIENTATION'], ['ROTR'], ['MASK'], ['AND']]; 
break;
case 52:
 this.$ = [['WORLDBUZZERS'], ['LOAD', 0], ['EQ'], ['NOT']]; 
break;
case 53:
 this.$ = [['WORLDBUZZERS'], ['NOT']]; 
break;
case 54:
 this.$ = [['BAGBUZZERS'], ['LOAD', 0], ['EQ'], ['NOT']]; 
break;
case 55:
 this.$ = [['BAGBUZZERS'], ['NOT']]; 
break;
case 56:
 this.$ = [['ORIENTATION'], ['LOAD', 0], ['EQ']]; 
break;
case 57:
 this.$ = [['ORIENTATION'], ['LOAD', 1], ['EQ']]; 
break;
case 58:
 this.$ = [['ORIENTATION'], ['LOAD', 2], ['EQ']]; 
break;
case 59:
 this.$ = [['ORIENTATION'], ['LOAD', 3], ['EQ']]; 
break;
case 60:
 this.$ = [['ORIENTATION'], ['LOAD', 0], ['EQ'], ['NOT']]; 
break;
case 61:
 this.$ = [['ORIENTATION'], ['LOAD', 1], ['EQ'], ['NOT']]; 
break;
case 62:
 this.$ = [['ORIENTATION'], ['LOAD', 2], ['EQ'], ['NOT']]; 
break;
case 63:
 this.$ = [['ORIENTATION'], ['LOAD', 3], ['EQ'], ['NOT']]; 
break;
case 64:
 this.$ = [['VAR', $$[$0].toLowerCase(), _$[$0]]]; 
break;
case 65:
 this.$ = [['LOAD',  $$[$0]]]; 
break;
case 66:
 this.$ = $$[$0-1].concat([['INC', 1]]); 
break;
case 67:
 this.$ = $$[$0-1].concat([['DEC', 1]]); 
break;
case 68:
 this.$ = $$[$0-3].concat([['INC', $$[$0-1]]]); 
break;
case 69:
 this.$ = $$[$0-3].concat([['DEC', $$[$0-1]]]); 
break;
case 70:
 this.$ = parseInt(yytext); 
break;
case 71:
 this.$ = yytext; 
break;
case 72:
 this.$ = [['LINE', yylineno]]; 
break;
}
},
table: [{3:1,4:2,5:[1,3],12:4,13:$V0},{1:[3]},{5:[1,6],12:7,13:$V0},{6:8,7:[1,9],19:10,20:$V1,25:$V2},o($V3,[2,6]),{14:13,16:[1,14]},{6:15,7:[1,16],19:10,20:$V1,25:$V2},o($V3,[2,5]),{7:[1,17],19:18,20:$V1,25:$V2},o($V4,$V5,{8:19,28:20,27:21,35:28,36:29,37:30,38:31,22:33,16:$V6,29:$V7,30:$V8,31:$V9,32:$Va,33:$Vb,34:$Vc,39:$Vd,42:$Ve,46:$Vf,48:$Vg}),{15:[1,38]},{16:$Vh,21:39},{16:$Vh,21:40},{15:[1,41]},{17:[1,42]},{7:[1,43],19:18,20:$V1,25:$V2},o($V4,$V5,{28:20,27:21,35:28,36:29,37:30,38:31,22:33,8:44,16:$V6,29:$V7,30:$V8,31:$V9,32:$Va,33:$Vb,34:$Vc,39:$Vd,42:$Ve,46:$Vf,48:$Vg}),o($V4,$V5,{28:20,27:21,35:28,36:29,37:30,38:31,22:33,8:45,16:$V6,29:$V7,30:$V8,31:$V9,32:$Va,33:$Vb,34:$Vc,39:$Vd,42:$Ve,46:$Vf,48:$Vg}),{15:[1,46]},{9:[1,47],15:$Vi},o($Vj,[2,17]),o($Vj,[2,18]),o($Vk,[2,20]),o($Vk,[2,21]),o($Vk,[2,22]),o($Vk,[2,23]),o($Vk,[2,24]),o($Vk,[2,25]),o($Vk,[2,26]),o($Vk,[2,27]),o($Vk,[2,28]),o($Vk,[2,29]),o([15,40],$V5,{28:20,27:21,35:28,36:29,37:30,38:31,22:33,8:49,16:$V6,29:$V7,30:$V8,31:$V9,32:$Va,33:$Vb,34:$Vc,39:$Vd,42:$Ve,46:$Vf,48:$Vg}),o($Vk,[2,31],{23:[1,50]}),o($Vl,$Vh,{21:51}),o($Vl,$Vh,{21:52}),o([16,77,78,80],$Vh,{21:53}),o([9,15,23,24,26,40,45,49,79],[2,71]),o($Vm,[2,11]),{16:$V6,22:54},{16:$V6,22:55},o($V3,[2,7]),{16:[1,56],18:[1,57]},o($V4,$V5,{28:20,27:21,35:28,36:29,37:30,38:31,22:33,8:58,16:$V6,29:$V7,30:$V8,31:$V9,32:$Va,33:$Vb,34:$Vc,39:$Vd,42:$Ve,46:$Vf,48:$Vg}),{9:[1,59],15:$Vi},{9:[1,60],15:$Vi},o($Vm,[2,10]),{10:[1,61]},o($Vj,$V5,{27:21,35:28,36:29,37:30,38:31,22:33,28:62,16:$V6,29:$V7,30:$V8,31:$V9,32:$Va,33:$Vb,34:$Vc,39:$Vd,42:$Ve,46:$Vf,48:$Vg}),{15:$Vi,40:[1,63]},{16:$V6,22:65,41:64,76:66,77:$Vn,78:$Vo,80:$Vp},{23:$Vq,43:70,51:71,53:72,54:$Vr,55:74,56:$Vs,57:76,58:$Vt,59:$Vu,60:$Vv,61:$Vw,62:$Vx,63:$Vy,64:$Vz,65:$VA,66:$VB,67:$VC,68:$VD,69:$VE,70:$VF,71:$VG,72:$VH,73:$VI,74:$VJ,75:$VK},{23:$Vq,43:96,51:71,53:72,54:$Vr,55:74,56:$Vs,57:76,58:$Vt,59:$Vu,60:$Vv,61:$Vw,62:$Vx,63:$Vy,64:$Vz,65:$VA,66:$VB,67:$VC,68:$VD,69:$VE,70:$VF,71:$VG,72:$VH,73:$VI,74:$VJ,75:$VK},{16:$V6,22:65,41:97,76:66,77:$Vn,78:$Vo,80:$Vp},{15:[2,12],23:[1,98]},{23:[1,100],26:[1,99]},{15:[2,8]},{15:[2,9]},{9:[1,101],15:$Vi},{10:[1,102]},{10:[1,103]},{11:[1,104]},o($Vj,[2,16]),o($Vk,[2,30]),{24:[1,105]},o($VL,[2,64]),o($VL,[2,65]),{23:[1,106]},{23:[1,107]},o($VL,[2,70]),{44:[1,108],50:$VM},o($VN,[2,38],{52:$VO}),o($VP,[2,40]),{23:$Vq,55:111,56:$Vs,57:76,58:$Vt,59:$Vu,60:$Vv,61:$Vw,62:$Vx,63:$Vy,64:$Vz,65:$VA,66:$VB,67:$VC,68:$VD,69:$VE,70:$VF,71:$VG,72:$VH,73:$VI,74:$VJ,75:$VK},o($VP,[2,42]),{23:[1,112]},o($VP,[2,44]),{23:$Vq,43:113,51:71,53:72,54:$Vr,55:74,56:$Vs,57:76,58:$Vt,59:$Vu,60:$Vv,61:$Vw,62:$Vx,63:$Vy,64:$Vz,65:$VA,66:$VB,67:$VC,68:$VD,69:$VE,70:$VF,71:$VG,72:$VH,73:$VI,74:$VJ,75:$VK},o($VP,[2,46]),o($VP,[2,47]),o($VP,[2,48]),o($VP,[2,49]),o($VP,[2,50]),o($VP,[2,51]),o($VP,[2,52]),o($VP,[2,53]),o($VP,[2,54]),o($VP,[2,55]),o($VP,[2,56]),o($VP,[2,57]),o($VP,[2,58]),o($VP,[2,59]),o($VP,[2,60]),o($VP,[2,61]),o($VP,[2,62]),o($VP,[2,63]),{47:[1,114],50:$VM},{49:[1,115]},{16:$V6,22:116},{16:$V6,22:33,27:117,29:$V7,30:$V8,31:$V9,32:$Va,33:$Vb,34:$Vc,35:28,36:29,37:30,38:31,39:$Vd,42:$Ve,46:$Vf,48:$Vg},{16:$V6,22:118},{10:[1,119]},{11:[1,120]},{11:[1,121]},{1:[2,4]},o($Vk,[2,32]),{16:$V6,22:65,41:122,76:66,77:$Vn,78:$Vo,80:$Vp},{16:$V6,22:65,41:123,76:66,77:$Vn,78:$Vo,80:$Vp},{16:$V6,22:33,27:124,29:$V7,30:$V8,31:$V9,32:$Va,33:$Vb,34:$Vc,35:28,36:29,37:30,38:31,39:$Vd,42:$Ve,46:$Vf,48:$Vg},{23:$Vq,51:125,53:72,54:$Vr,55:74,56:$Vs,57:76,58:$Vt,59:$Vu,60:$Vv,61:$Vw,62:$Vx,63:$Vy,64:$Vz,65:$VA,66:$VB,67:$VC,68:$VD,69:$VE,70:$VF,71:$VG,72:$VH,73:$VI,74:$VJ,75:$VK},{23:$Vq,53:126,54:$Vr,55:74,56:$Vs,57:76,58:$Vt,59:$Vu,60:$Vv,61:$Vw,62:$Vx,63:$Vy,64:$Vz,65:$VA,66:$VB,67:$VC,68:$VD,69:$VE,70:$VF,71:$VG,72:$VH,73:$VI,74:$VJ,75:$VK},o($VP,[2,41]),{16:$V6,22:65,41:127,76:66,77:$Vn,78:$Vo,80:$Vp},{24:[1,128],50:$VM},{16:$V6,22:33,27:129,29:$V7,30:$V8,31:$V9,32:$Va,33:$Vb,34:$Vc,35:28,36:29,37:30,38:31,39:$Vd,42:$Ve,46:$Vf,48:$Vg},{16:$V6,22:33,27:130,29:$V7,30:$V8,31:$V9,32:$Va,33:$Vb,34:$Vc,35:28,36:29,37:30,38:31,39:$Vd,42:$Ve,46:$Vf,48:$Vg},{24:[1,131]},{15:[2,14]},{24:[1,132]},{11:[1,133]},{1:[2,2]},{1:[2,3]},{24:[1,134],79:[1,135]},{24:[1,136],79:[1,137]},o($Vj,[2,33],{45:[1,138]}),o($VN,[2,37],{52:$VO}),o($VP,[2,39]),{24:[1,139]},o($VP,[2,45]),o($Vk,[2,35]),o($Vk,[2,36]),{15:[2,13]},{26:[1,140]},{1:[2,1]},o($VL,[2,66]),{76:141,80:$Vp},o($VL,[2,67]),{76:142,80:$Vp},{16:$V6,22:33,27:143,29:$V7,30:$V8,31:$V9,32:$Va,33:$Vb,34:$Vc,35:28,36:29,37:30,38:31,39:$Vd,42:$Ve,46:$Vf,48:$Vg},o($VP,[2,43]),{16:$V6,22:33,27:144,29:$V7,30:$V8,31:$V9,32:$Va,33:$Vb,34:$Vc,35:28,36:29,37:30,38:31,39:$Vd,42:$Ve,46:$Vf,48:$Vg},{24:[1,145]},{24:[1,146]},o($Vk,[2,34]),{15:[2,15]},o($VL,[2,68]),o($VL,[2,69])],
defaultActions: {56:[2,8],57:[2,9],104:[2,4],117:[2,14],120:[2,2],121:[2,3],131:[2,13],133:[2,1],144:[2,15]},
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
case 9: return 25; 
break;
case 10: return 25; 
break;
case 11: return 13; 
break;
case 12: return 20; 
break;
case 13: return 20; 
break;
case 14: return 34; 
break;
case 15: return 34; 
break;
case 16: return 26; 
break;
case 17: return 33; 
break;
case 18: return 33; 
break;
case 19: return 30; 
break;
case 20: return 29; 
break;
case 21: return 31; 
break;
case 22: return 32; 
break;
case 23: return 39; 
break;
case 24: return 40; 
break;
case 25: return 44; 
break;
case 26: return 46; 
break;
case 27: return 47; 
break;
case 28: return 48; 
break;
case 29: return 49; 
break;
case 30: return 78; 
break;
case 31: return 77; 
break;
case 32: return 56; 
break;
case 33: return 58; 
break;
case 34: return 59; 
break;
case 35: return 60; 
break;
case 36: return 61; 
break;
case 37: return 62; 
break;
case 38: return 63; 
break;
case 39: return 64; 
break;
case 40: return 65; 
break;
case 41: return 66; 
break;
case 42: return 66; 
break;
case 43: return 67; 
break;
case 44: return 67; 
break;
case 45: return 69; 
break;
case 46: return 71; 
break;
case 47: return 70; 
break;
case 48: return 68; 
break;
case 49: return 73; 
break;
case 50: return 75; 
break;
case 51: return 74; 
break;
case 52: return 72; 
break;
case 53: return 45; 
break;
case 54: return 45; 
break;
case 55: return 42; 
break;
case 56: return 54; 
break;
case 57: return 50; 
break;
case 58: return 50; 
break;
case 59: return 52; 
break;
case 60: return 52; 
break;
case 61: return 23; 
break;
case 62: return 24; 
break;
case 63: return 15; 
break;
case 64: return 17; 
break;
case 65: return 18; 
break;
case 66: return 80; 
break;
case 67: return 16; 
break;
case 68: return 11; 
break;
case 69:console.log(yy_.yytext);
break;
}
},
rules: [/^(?:\s+)/,/^(?:\{[^}]*\})/,/^(?:\(\*(?:[^*]|\*(?!\)))*\*\))/,/^(?:iniciar-programa)/,/^(?:inicia-ejecucion)/,/^(?:inicia-ejecución)/,/^(?:termina-ejecucion)/,/^(?:termina-ejecución)/,/^(?:finalizar-programa)/,/^(?:define-nueva-instruccion)/,/^(?:define-nueva-instrucción)/,/^(?:usa)/,/^(?:define-prototipo-instruccion)/,/^(?:define-prototipo-instrucción)/,/^(?:sal-de-instruccion)/,/^(?:sal-de-instrucción)/,/^(?:como)/,/^(?:apagate)/,/^(?:apágate)/,/^(?:gira-izquierda)/,/^(?:avanza)/,/^(?:coge-zumbador)/,/^(?:deja-zumbador)/,/^(?:inicio)/,/^(?:fin)/,/^(?:entonces)/,/^(?:mientras)/,/^(?:hacer)/,/^(?:repetir)/,/^(?:veces)/,/^(?:precede)/,/^(?:sucede)/,/^(?:si-es-cero)/,/^(?:frente-libre)/,/^(?:frente-bloqueado)/,/^(?:izquierda-libre)/,/^(?:izquierda-bloqueada)/,/^(?:derecha-libre)/,/^(?:derecha-bloqueada)/,/^(?:junto-a-zumbador)/,/^(?:no-junto-a-zumbador)/,/^(?:algun-zumbador-en-la-mochila)/,/^(?:algún-zumbador-en-la-mochila)/,/^(?:ningun-zumbador-en-la-mochila)/,/^(?:ningún-zumbador-en-la-mochila)/,/^(?:orientado-al-norte)/,/^(?:orientado-al-sur)/,/^(?:orientado-al-este)/,/^(?:orientado-al-oeste)/,/^(?:no-orientado-al-norte)/,/^(?:no-orientado-al-sur)/,/^(?:no-orientado-al-este)/,/^(?:no-orientado-al-oeste)/,/^(?:sino)/,/^(?:si-no)/,/^(?:si)/,/^(?:no)/,/^(?:o)/,/^(?:u)/,/^(?:y)/,/^(?:e)/,/^(?:\()/,/^(?:\))/,/^(?:;)/,/^(?:\.)/,/^(?:\*)/,/^(?:[0-9]+)/,/^(?:[A-Za-zÀ-ÖØ-öø-ÿ_][A-Za-zÀ-ÖØ-öø-ÿ0-9_-]*)/,/^(?:$)/,/^(?:.)/],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69],"inclusive":true}}
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