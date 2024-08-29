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
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,6],$V1=[1,7],$V2=[8,12],$V3=[2,12],$V4=[1,13],$V5=[1,14],$V6=[1,15],$V7=[1,16],$V8=[1,17],$V9=[1,18],$Va=[1,23],$Vb=[1,25],$Vc=[1,26],$Vd=[1,27],$Ve=[1,28],$Vf=[2,62],$Vg=[1,35],$Vh=[8,12,33],$Vi=[8,12,33,38],$Vj=[16,47,49,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68],$Vk=[6,13,18],$Vl=[1,49],$Vm=[1,50],$Vn=[1,51],$Vo=[1,59],$Vp=[1,55],$Vq=[1,57],$Vr=[1,60],$Vs=[1,61],$Vt=[1,62],$Vu=[1,63],$Vv=[1,64],$Vw=[1,65],$Vx=[1,66],$Vy=[1,67],$Vz=[1,68],$VA=[1,69],$VB=[1,70],$VC=[1,71],$VD=[1,72],$VE=[1,73],$VF=[1,74],$VG=[1,75],$VH=[1,76],$VI=[1,77],$VJ=[17,42],$VK=[1,89],$VL=[17,37,40,43],$VM=[1,90],$VN=[17,37,40,43,45];
var parser = {trace: function trace () { },
yy: {},
symbols_: {"error":2,"program":3,"BEGINPROG":4,"def_list":5,"BEGINEXEC":6,"expr_list":7,"ENDEXEC":8,"ENDPROG":9,"EOF":10,"def":11,";":12,"PROTO":13,"line":14,"var":15,"(":16,")":17,"DEF":18,"AS":19,"expr":20,"genexpr":21,"FORWARD":22,"LEFT":23,"PICKBUZZER":24,"LEAVEBUZZER":25,"HALT":26,"RET":27,"call":28,"cond":29,"loop":30,"repeat":31,"BEGIN":32,"END":33,"integer":34,"IF":35,"term":36,"THEN":37,"ELSE":38,"WHILE":39,"DO":40,"REPEAT":41,"TIMES":42,"OR":43,"and_term":44,"AND":45,"not_term":46,"NOT":47,"clause":48,"IFZ":49,"bool_fun":50,"IFNFWALL":51,"IFFWALL":52,"IFNLWALL":53,"IFLWALL":54,"IFNRWALL":55,"IFRWALL":56,"IFWBUZZER":57,"IFNWBUZZER":58,"IFBBUZZER":59,"IFNBBUZZER":60,"IFW":61,"IFN":62,"IFE":63,"IFS":64,"IFNW":65,"IFNN":66,"IFNE":67,"IFNS":68,"NUM":69,"INC":70,"DEC":71,"VAR":72,"$accept":0,"$end":1},
terminals_: {2:"error",4:"BEGINPROG",6:"BEGINEXEC",8:"ENDEXEC",9:"ENDPROG",10:"EOF",12:";",13:"PROTO",16:"(",17:")",18:"DEF",19:"AS",22:"FORWARD",23:"LEFT",24:"PICKBUZZER",25:"LEAVEBUZZER",26:"HALT",27:"RET",32:"BEGIN",33:"END",35:"IF",37:"THEN",38:"ELSE",39:"WHILE",40:"DO",41:"REPEAT",42:"TIMES",43:"OR",45:"AND",47:"NOT",49:"IFZ",51:"IFNFWALL",52:"IFFWALL",53:"IFNLWALL",54:"IFLWALL",55:"IFNRWALL",56:"IFRWALL",57:"IFWBUZZER",58:"IFNWBUZZER",59:"IFBBUZZER",60:"IFNBBUZZER",61:"IFW",62:"IFN",63:"IFE",64:"IFS",65:"IFNW",66:"IFNN",67:"IFNE",68:"IFNS",69:"NUM",70:"INC",71:"DEC",72:"VAR"},
productions_: [0,[3,7],[3,6],[5,3],[5,2],[11,3],[11,6],[11,5],[11,8],[7,3],[7,1],[21,1],[21,0],[20,1],[20,1],[20,1],[20,1],[20,1],[20,1],[20,1],[20,1],[20,1],[20,1],[20,3],[28,1],[28,4],[29,5],[29,7],[30,5],[31,5],[36,3],[36,1],[44,3],[44,1],[46,2],[46,1],[48,4],[48,1],[48,3],[50,1],[50,1],[50,1],[50,1],[50,1],[50,1],[50,1],[50,1],[50,1],[50,1],[50,1],[50,1],[50,1],[50,1],[50,1],[50,1],[50,1],[50,1],[34,1],[34,1],[34,4],[34,4],[15,1],[14,0]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:
 
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
case 2:
 
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
case 3:
 this.$ = $$[$0-2].concat($$[$0-1]); 
break;
case 4: case 23: case 38:
 this.$ = $$[$0-1]; 
break;
case 5:
 
      this._$.first_line = _$[$0-2].first_line;
      this._$.first_column = _$[$0-2].first_column;
      this._$.last_line = _$[$0].last_line;
      this._$.last_column = _$[$0].last_column;
      this.$ = [[$$[$0].toLowerCase(), null, [],  this._$] ]; 
    
break;
case 6:
 
      this._$.first_line = _$[$0-5].first_line;
      this._$.first_column = _$[$0-5].first_column;
      this._$.last_line = _$[$0].last_line;
      this._$.last_column = _$[$0].last_column;
      this.$ = [[$$[$0-3].toLowerCase(), null, [$$[$0-1]],  this._$] ]; 
      
break;
case 7:
 
      this._$.first_line = _$[$0-4].first_line;
      this._$.first_column = _$[$0-4].first_column;
      this._$.last_line = _$[$0-2].last_line;
      this._$.last_column = _$[$0-2].last_column;

      this.$ = [[$$[$0-2], $$[$0-3].concat($block).concat([['RET']]), [], this._$]]; 
    
break;
case 8:

      
      this._$.first_line = _$[$0-7].first_line;
      this._$.first_column = _$[$0-7].first_column;
      this._$.last_line = _$[$0-5].last_line;
      this._$.last_column = _$[$0-5].last_column;

    	this.$ = [[$$[$0-5], $$[$0-6].concat($block).concat([['RET']]), [$$[$0-3]], this._$]];
    
break;
case 9:
 this.$ = $$[$0-2].concat($$[$0]); 
break;
case 10: case 11: case 19: case 20: case 21: case 22: case 31: case 33: case 35: case 37:
 this.$ = $$[$0]; 
break;
case 12:
 this.$ = []; 
break;
case 13:
 this.$ = [['LINE', yylineno], ['WORLDWALLS'], ['ORIENTATION'], ['MASK'], ['AND'], ['NOT'], ['EZ', 'WALL'], ['FORWARD']]; 
break;
case 14:
 this.$ = [['LINE', yylineno], ['LEFT']]; 
break;
case 15:
 this.$ = [['LINE', yylineno], ['WORLDBUZZERS'], ['EZ', 'WORLDUNDERFLOW'], ['PICKBUZZER']]; 
break;
case 16:
 this.$ = [['LINE', yylineno], ['BAGBUZZERS'], ['EZ', 'BAGUNDERFLOW'], ['LEAVEBUZZER']]; 
break;
case 17:
 this.$ = [['LINE', yylineno], ['HALT']]; 
break;
case 18:
 this.$ = [['LINE', yylineno], ['RET']]; 
break;
case 24:
 this.$ = [['LINE', yylineno], ['LOAD', 0], ['CALL', $$[$0].toLowerCase(), 1, _$[$0], _$[$0]], ['LINE', yylineno]]; 
break;
case 25:
 this.$ = [['LINE', yylineno]].concat($$[$0-1]).concat([['CALL', $$[$0-3].toLowerCase(), 2, _$[$0-3], _$[$0-1]], ['LINE', yylineno]]); 
break;
case 26:
 this.$ = $$[$0-3].concat($$[$0-2]).concat([['JZ', $$[$0].length]]).concat($$[$0]); 
break;
case 27:
 this.$ = $$[$0-5].concat($$[$0-4]).concat([['JZ', 1 + $$[$0-2].length]]).concat($$[$0-2]).concat([['JMP', $$[$0].length]]).concat($$[$0]); 
break;
case 28:
 this.$ = $$[$0-3].concat($$[$0-2]).concat([['JZ', 1 + $$[$0].length]]).concat($$[$0]).concat([['JMP', -1 -($$[$0-2].length + $$[$0].length + 2)]]); 
break;
case 29:
 this.$ = $$[$0-3].concat($$[$0-2]).concat([['DUP'], ['LOAD', 0], ['EQ'], ['NOT'], ['JZ', $$[$0].length + 2]]).concat($$[$0]).concat([['DEC'], ['JMP', -1 -($$[$0].length + 6)], ['POP']]); 
break;
case 30:
 this.$ = $$[$0-2].concat($$[$0]).concat([['OR']]); 
break;
case 32:
 this.$ = $$[$0-2].concat($$[$0]).concat([['AND']]); 
break;
case 34:
 this.$ = $$[$0].concat([['NOT']]); 
break;
case 36:
 this.$ = $$[$0-1].concat([['NOT']]); 
break;
case 39:
 this.$ = [['WORLDWALLS'], ['ORIENTATION'], ['MASK'], ['AND'], ['NOT']]; 
break;
case 40:
 this.$ = [['WORLDWALLS'], ['ORIENTATION'], ['MASK'], ['AND']]; 
break;
case 41:
 this.$ = [['WORLDWALLS'], ['ORIENTATION'], ['ROTL'], ['MASK'], ['AND'], ['NOT']]; 
break;
case 42:
 this.$ = [['WORLDWALLS'], ['ORIENTATION'], ['ROTL'], ['MASK'], ['AND']]; 
break;
case 43:
 this.$ = [['WORLDWALLS'], ['ORIENTATION'], ['ROTR'], ['MASK'], ['AND'], ['NOT']]; 
break;
case 44:
 this.$ = [['WORLDWALLS'], ['ORIENTATION'], ['ROTR'], ['MASK'], ['AND']]; 
break;
case 45:
 this.$ = [['WORLDBUZZERS'], ['LOAD', 0], ['EQ'], ['NOT']]; 
break;
case 46:
 this.$ = [['WORLDBUZZERS'], ['NOT']]; 
break;
case 47:
 this.$ = [['BAGBUZZERS'], ['LOAD', 0], ['EQ'], ['NOT']]; 
break;
case 48:
 this.$ = [['BAGBUZZERS'], ['NOT']]; 
break;
case 49:
 this.$ = [['ORIENTATION'], ['LOAD', 0], ['EQ']]; 
break;
case 50:
 this.$ = [['ORIENTATION'], ['LOAD', 1], ['EQ']]; 
break;
case 51:
 this.$ = [['ORIENTATION'], ['LOAD', 2], ['EQ']]; 
break;
case 52:
 this.$ = [['ORIENTATION'], ['LOAD', 3], ['EQ']]; 
break;
case 53:
 this.$ = [['ORIENTATION'], ['LOAD', 0], ['EQ'], ['NOT']]; 
break;
case 54:
 this.$ = [['ORIENTATION'], ['LOAD', 1], ['EQ'], ['NOT']]; 
break;
case 55:
 this.$ = [['ORIENTATION'], ['LOAD', 2], ['EQ'], ['NOT']]; 
break;
case 56:
 this.$ = [['ORIENTATION'], ['LOAD', 3], ['EQ'], ['NOT']]; 
break;
case 57:
 this.$ = [['VAR', $$[$0].toLowerCase()]]; 
break;
case 58:
 this.$ = [['LOAD', parseInt(yytext)]]; 
break;
case 59:
 this.$ = $$[$0-1].concat([['INC']]); 
break;
case 60:
 this.$ = $$[$0-1].concat([['DEC']]); 
break;
case 61:
 this.$ = yytext; 
break;
case 62:
 this.$ = [['LINE', yylineno]]; 
break;
}
},
table: [{3:1,4:[1,2]},{1:[3]},{5:3,6:[1,4],11:5,13:$V0,18:$V1},{6:[1,8],11:9,13:$V0,18:$V1},o($V2,$V3,{7:10,21:11,20:12,28:19,29:20,30:21,31:22,15:24,22:$V4,23:$V5,24:$V6,25:$V7,26:$V8,27:$V9,32:$Va,35:$Vb,39:$Vc,41:$Vd,72:$Ve}),{12:[1,29]},{14:30,72:$Vf},{14:31,72:$Vf},o($V2,$V3,{21:11,20:12,28:19,29:20,30:21,31:22,15:24,7:32,22:$V4,23:$V5,24:$V6,25:$V7,26:$V8,27:$V9,32:$Va,35:$Vb,39:$Vc,41:$Vd,72:$Ve}),{12:[1,33]},{8:[1,34],12:$Vg},o($Vh,[2,10]),o($Vh,[2,11]),o($Vi,[2,13]),o($Vi,[2,14]),o($Vi,[2,15]),o($Vi,[2,16]),o($Vi,[2,17]),o($Vi,[2,18]),o($Vi,[2,19]),o($Vi,[2,20]),o($Vi,[2,21]),o($Vi,[2,22]),o([12,33],$V3,{21:11,20:12,28:19,29:20,30:21,31:22,15:24,7:36,22:$V4,23:$V5,24:$V6,25:$V7,26:$V8,27:$V9,32:$Va,35:$Vb,39:$Vc,41:$Vd,72:$Ve}),o($Vi,[2,24],{16:[1,37]}),o($Vj,$Vf,{14:38}),o($Vj,$Vf,{14:39}),o([69,70,71,72],$Vf,{14:40}),o([8,12,16,17,19,33,38,42],[2,61]),o($Vk,[2,4]),{15:41,72:$Ve},{15:42,72:$Ve},{8:[1,43],12:$Vg},o($Vk,[2,3]),{9:[1,44]},o($Vh,$V3,{20:12,28:19,29:20,30:21,31:22,15:24,21:45,22:$V4,23:$V5,24:$V6,25:$V7,26:$V8,27:$V9,32:$Va,35:$Vb,39:$Vc,41:$Vd,72:$Ve}),{12:$Vg,33:[1,46]},{15:48,34:47,69:$Vl,70:$Vm,71:$Vn,72:$Ve},{16:$Vo,36:52,44:53,46:54,47:$Vp,48:56,49:$Vq,50:58,51:$Vr,52:$Vs,53:$Vt,54:$Vu,55:$Vv,56:$Vw,57:$Vx,58:$Vy,59:$Vz,60:$VA,61:$VB,62:$VC,63:$VD,64:$VE,65:$VF,66:$VG,67:$VH,68:$VI},{16:$Vo,36:78,44:53,46:54,47:$Vp,48:56,49:$Vq,50:58,51:$Vr,52:$Vs,53:$Vt,54:$Vu,55:$Vv,56:$Vw,57:$Vx,58:$Vy,59:$Vz,60:$VA,61:$VB,62:$VC,63:$VD,64:$VE,65:$VF,66:$VG,67:$VH,68:$VI},{15:48,34:79,69:$Vl,70:$Vm,71:$Vn,72:$Ve},{12:[2,5],16:[1,80]},{16:[1,82],19:[1,81]},{9:[1,83]},{10:[1,84]},o($Vh,[2,9]),o($Vi,[2,23]),{17:[1,85]},o($VJ,[2,57]),o($VJ,[2,58]),{16:[1,86]},{16:[1,87]},{37:[1,88],43:$VK},o($VL,[2,31],{45:$VM}),o($VN,[2,33]),{16:$Vo,48:91,49:$Vq,50:58,51:$Vr,52:$Vs,53:$Vt,54:$Vu,55:$Vv,56:$Vw,57:$Vx,58:$Vy,59:$Vz,60:$VA,61:$VB,62:$VC,63:$VD,64:$VE,65:$VF,66:$VG,67:$VH,68:$VI},o($VN,[2,35]),{16:[1,92]},o($VN,[2,37]),{16:$Vo,36:93,44:53,46:54,47:$Vp,48:56,49:$Vq,50:58,51:$Vr,52:$Vs,53:$Vt,54:$Vu,55:$Vv,56:$Vw,57:$Vx,58:$Vy,59:$Vz,60:$VA,61:$VB,62:$VC,63:$VD,64:$VE,65:$VF,66:$VG,67:$VH,68:$VI},o($VN,[2,39]),o($VN,[2,40]),o($VN,[2,41]),o($VN,[2,42]),o($VN,[2,43]),o($VN,[2,44]),o($VN,[2,45]),o($VN,[2,46]),o($VN,[2,47]),o($VN,[2,48]),o($VN,[2,49]),o($VN,[2,50]),o($VN,[2,51]),o($VN,[2,52]),o($VN,[2,53]),o($VN,[2,54]),o($VN,[2,55]),o($VN,[2,56]),{40:[1,94],43:$VK},{42:[1,95]},{15:96,72:$Ve},{15:24,20:97,22:$V4,23:$V5,24:$V6,25:$V7,26:$V8,27:$V9,28:19,29:20,30:21,31:22,32:$Va,35:$Vb,39:$Vc,41:$Vd,72:$Ve},{15:98,72:$Ve},{10:[1,99]},{1:[2,2]},o($Vi,[2,25]),{15:48,34:100,69:$Vl,70:$Vm,71:$Vn,72:$Ve},{15:48,34:101,69:$Vl,70:$Vm,71:$Vn,72:$Ve},{15:24,20:102,22:$V4,23:$V5,24:$V6,25:$V7,26:$V8,27:$V9,28:19,29:20,30:21,31:22,32:$Va,35:$Vb,39:$Vc,41:$Vd,72:$Ve},{16:$Vo,44:103,46:54,47:$Vp,48:56,49:$Vq,50:58,51:$Vr,52:$Vs,53:$Vt,54:$Vu,55:$Vv,56:$Vw,57:$Vx,58:$Vy,59:$Vz,60:$VA,61:$VB,62:$VC,63:$VD,64:$VE,65:$VF,66:$VG,67:$VH,68:$VI},{16:$Vo,46:104,47:$Vp,48:56,49:$Vq,50:58,51:$Vr,52:$Vs,53:$Vt,54:$Vu,55:$Vv,56:$Vw,57:$Vx,58:$Vy,59:$Vz,60:$VA,61:$VB,62:$VC,63:$VD,64:$VE,65:$VF,66:$VG,67:$VH,68:$VI},o($VN,[2,34]),{15:48,34:105,69:$Vl,70:$Vm,71:$Vn,72:$Ve},{17:[1,106],43:$VK},{15:24,20:107,22:$V4,23:$V5,24:$V6,25:$V7,26:$V8,27:$V9,28:19,29:20,30:21,31:22,32:$Va,35:$Vb,39:$Vc,41:$Vd,72:$Ve},{15:24,20:108,22:$V4,23:$V5,24:$V6,25:$V7,26:$V8,27:$V9,28:19,29:20,30:21,31:22,32:$Va,35:$Vb,39:$Vc,41:$Vd,72:$Ve},{17:[1,109]},{12:[2,7]},{17:[1,110]},{1:[2,1]},{17:[1,111]},{17:[1,112]},o($Vh,[2,26],{38:[1,113]}),o($VL,[2,30],{45:$VM}),o($VN,[2,32]),{17:[1,114]},o($VN,[2,38]),o($Vi,[2,28]),o($Vi,[2,29]),{12:[2,6]},{19:[1,115]},o($VJ,[2,59]),o($VJ,[2,60]),{15:24,20:116,22:$V4,23:$V5,24:$V6,25:$V7,26:$V8,27:$V9,28:19,29:20,30:21,31:22,32:$Va,35:$Vb,39:$Vc,41:$Vd,72:$Ve},o($VN,[2,36]),{15:24,20:117,22:$V4,23:$V5,24:$V6,25:$V7,26:$V8,27:$V9,28:19,29:20,30:21,31:22,32:$Va,35:$Vb,39:$Vc,41:$Vd,72:$Ve},o($Vi,[2,27]),{12:[2,8]}],
defaultActions: {84:[2,2],97:[2,7],99:[2,1],109:[2,6],117:[2,8]},
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
case 3: return 4; 
break;
case 4: return 6; 
break;
case 5: return 6; 
break;
case 6: return 8; 
break;
case 7: return 8; 
break;
case 8: return 9; 
break;
case 9: return 18; 
break;
case 10: return 18; 
break;
case 11: return 13; 
break;
case 12: return 13; 
break;
case 13: return 27; 
break;
case 14: return 27; 
break;
case 15: return 19; 
break;
case 16: return 26; 
break;
case 17: return 26; 
break;
case 18: return 23; 
break;
case 19: return 22; 
break;
case 20: return 24; 
break;
case 21: return 25; 
break;
case 22: return 32; 
break;
case 23: return 33; 
break;
case 24: return 37; 
break;
case 25: return 39; 
break;
case 26: return 40; 
break;
case 27: return 41; 
break;
case 28: return 42; 
break;
case 29: return 71; 
break;
case 30: return 70; 
break;
case 31: return 49; 
break;
case 32: return 51; 
break;
case 33: return 52; 
break;
case 34: return 53; 
break;
case 35: return 54; 
break;
case 36: return 55; 
break;
case 37: return 56; 
break;
case 38: return 57; 
break;
case 39: return 58; 
break;
case 40: return 59; 
break;
case 41: return 59; 
break;
case 42: return 60; 
break;
case 43: return 60; 
break;
case 44: return 62; 
break;
case 45: return 64; 
break;
case 46: return 63; 
break;
case 47: return 61; 
break;
case 48: return 66; 
break;
case 49: return 68; 
break;
case 50: return 67; 
break;
case 51: return 65; 
break;
case 52: return 38; 
break;
case 53: return 38; 
break;
case 54: return 35; 
break;
case 55: return 47; 
break;
case 56: return 43; 
break;
case 57: return 43; 
break;
case 58: return 45; 
break;
case 59: return 45; 
break;
case 60: return 16; 
break;
case 61: return 17; 
break;
case 62: return 12; 
break;
case 63: return 69; 
break;
case 64: return 72; 
break;
case 65: return 10; 
break;
case 66:console.log(yy_.yytext);
break;
}
},
rules: [/^(?:\s+)/,/^(?:\{[^}]*\})/,/^(?:\(\*(?:[^*]|\*(?!\)))*\*\))/,/^(?:iniciar-programa)/,/^(?:inicia-ejecucion)/,/^(?:inicia-ejecución)/,/^(?:termina-ejecucion)/,/^(?:termina-ejecución)/,/^(?:finalizar-programa)/,/^(?:define-nueva-instruccion)/,/^(?:define-nueva-instrucción)/,/^(?:define-prototipo-instruccion)/,/^(?:define-prototipo-instrucción)/,/^(?:sal-de-instruccion)/,/^(?:sal-de-instrucción)/,/^(?:como)/,/^(?:apagate)/,/^(?:apágate)/,/^(?:gira-izquierda)/,/^(?:avanza)/,/^(?:coge-zumbador)/,/^(?:deja-zumbador)/,/^(?:inicio)/,/^(?:fin)/,/^(?:entonces)/,/^(?:mientras)/,/^(?:hacer)/,/^(?:repetir)/,/^(?:veces)/,/^(?:precede)/,/^(?:sucede)/,/^(?:si-es-cero)/,/^(?:frente-libre)/,/^(?:frente-bloqueado)/,/^(?:izquierda-libre)/,/^(?:izquierda-bloqueada)/,/^(?:derecha-libre)/,/^(?:derecha-bloqueada)/,/^(?:junto-a-zumbador)/,/^(?:no-junto-a-zumbador)/,/^(?:algun-zumbador-en-la-mochila)/,/^(?:algún-zumbador-en-la-mochila)/,/^(?:ningun-zumbador-en-la-mochila)/,/^(?:ningún-zumbador-en-la-mochila)/,/^(?:orientado-al-norte)/,/^(?:orientado-al-sur)/,/^(?:orientado-al-este)/,/^(?:orientado-al-oeste)/,/^(?:no-orientado-al-norte)/,/^(?:no-orientado-al-sur)/,/^(?:no-orientado-al-este)/,/^(?:no-orientado-al-oeste)/,/^(?:sino)/,/^(?:si-no)/,/^(?:si)/,/^(?:no)/,/^(?:o)/,/^(?:u)/,/^(?:y)/,/^(?:e)/,/^(?:\()/,/^(?:\))/,/^(?:;)/,/^(?:[0-9]+)/,/^(?:[A-Za-zÀ-ÖØ-öø-ÿ_][A-Za-zÀ-ÖØ-öø-ÿ0-9_-]*)/,/^(?:$)/,/^(?:.)/],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66],"inclusive":true}}
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