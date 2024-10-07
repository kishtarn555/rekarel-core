/* Karel-java */

%lex
%%

\s+                                             {/* ignore */}
\/\/[^\n]*			                                {/* ignore */}
\/\*(?:[^*]|\*(?!\/))*\*\/	                    {/* ignore */}
"class"				                                  { return 'CLASS'; }
"program"		                                    { return 'PROG'; }
"define"			                                  { return 'DEF'; }
"import"			                                  { return 'IMPORT'; }
"void"				                                  { return 'DEF'; }
"int"				                                    { return 'INT'; }
"bool"				                                  { return 'BOOL'; }
"return"                                        { return 'RET'; }
"turnoff"                                       { return 'HALT'; }
"turnleft"	                                    { return 'LEFT'; }
"move" 		                                      { return 'FORWARD'; }
"pickbeeper"	                                  { return 'PICKBUZZER'; }
"putbeeper"                                     { return 'LEAVEBUZZER'; }
"continue"                                      { return 'CONTINUE'; }
"break"                                         { return 'BREAK'; }
"while"                                         { return 'WHILE'; }
"iterate"                                       { return 'REPEAT'; }
"pred" 		                                      { return 'DEC'; }
"succ"          	                              { return 'INC'; }
"iszero" 	                                      { return 'IFZ'; }
"frontIsClear"                                  { return 'IFNFWALL'; }
"frontIsBlocked"                                { return 'IFFWALL'; }
"leftIsClear"	                                  { return 'IFNLWALL'; }
"leftIsBlocked"                                 { return 'IFLWALL'; }
"rightIsClear"                                  { return 'IFNRWALL'; }
"rightIsBlocked"                                { return 'IFRWALL'; }
"nextToABeeper"                                 { return 'IFWBUZZER'; }
"notNextToABeeper"   	                          { return 'IFNWBUZZER'; }
"anyBeepersInBeeperBag" 	                      { return 'IFBBUZZER'; }
"noBeepersInBeeperBag"		                      { return 'IFNBBUZZER'; }
"facingNorth"		                                { return 'IFN'; }
"facingSouth"	                                  { return 'IFS'; }
"facingEast"		                                { return 'IFE'; }
"facingWest"	                                  { return 'IFW'; }
"notFacingNorth"	                              { return 'IFNN'; }
"notFacingSouth"	                              { return 'IFNS'; }
"notFacingEast"		                              { return 'IFNE'; }
"notFacingWest"		                              { return 'IFNW'; }
"else"                                          { return 'ELSE'; }
"if"                                            { return 'IF'; }
"!"                                             { return 'NOT'; }
"||"                                            { return 'OR'; }
"&&"                                            { return 'AND'; }
"&"				                                      { return 'AND'; }
"("                                             { return '('; }
")"                                             { return ')'; }
"{"                                             { return 'BEGIN'; }
"}"                                             { return 'END'; }
";"                                             { return ';'; }
"."                                             { return '.'; }
"*"                                             { return '*'; }
","                                             { return ','; }
"=="                                            { return '=='; }
"<="                                            { return '<='; }
"<"                                             { return '<'; }
[0-9]+                                          { return 'NUM'; }
[A-Za-zÀ-ÖØ-öø-ÿ_][A-Za-zÀ-ÖØ-öø-ÿ0-9_-]*       { return 'VAR'; }
<<EOF>>                                         { return 'EOF'; }
/lex

%nonassoc XIF
%nonassoc ELSE

%{

const COMPILER= "RKJ 1.0.0";
const LANG = "ReKarel Java";
const VarsAsFuncs = false;
const reqsPrototypes = false;
//Tag counter
let tagCnt = 1;


function UniqueTag(tag) {
  return `${tag}.${tagCnt++}`;
}
function resetCompiler(tag) {
  tagCnt = 1;
}

function mergeLocs(first, second) {
  return {
    first_line: first.first_line,
    first_column: first.first_column,
    last_line: second.last_line,
    last_column: second.last_column,
  }
}

function locToIR(loc) {
  return [
    "LINE",
    loc.first_line - 1,
    loc.first_column
  ]
}

%}


%left OR
%left AND
%nonassoc '=='
%nonassoc '<' '<='
%right NOT

%%

program
  : CLASS PROG BEGIN def_list PROG '(' ')' block END EOF
    %{ 
      resetCompiler();
      return {
        compiler: COMPILER,
        language: LANG,
        variablesCanBeFunctions: VarsAsFuncs,
        requieresFunctionPrototypes: reqsPrototypes,
        packages: [],
        functions: $def_list,
        program: $block.concat([['LINE', yylineno, 0], ['HALT']]),
        yy:yy,
      } 
    %}
  | CLASS PROG BEGIN PROG '(' ')' block END EOF
    %{  
      resetCompiler();
      return {
        compiler: COMPILER,
        language: LANG,
        requieresFunctionPrototypes: reqsPrototypes,
        variablesCanBeFunctions: VarsAsFuncs,
        packages: [],
        functions: [],
        program: $block.concat([['LINE', yylineno, 0], ['HALT']]),
        yy:yy,
      }
    %}
  |  import_list CLASS PROG BEGIN def_list PROG '(' ')' block END EOF
    %{  
      resetCompiler();
      return {
        compiler: COMPILER,
        language: LANG,
        requieresFunctionPrototypes: reqsPrototypes,
        variablesCanBeFunctions: VarsAsFuncs,
        packages: $import_list,
        functions: $def_list,
        program: $block.concat([['LINE', yylineno, 0], ['HALT']]),
        yy:yy,
      }
    %}
  | import_list CLASS PROG BEGIN PROG '(' ')' block END EOF
    %{  
      resetCompiler();
      return {
        compiler: COMPILER,
        language: LANG,
        packages: $import_list,
        requieresFunctionPrototypes: reqsPrototypes,
        variablesCanBeFunctions: VarsAsFuncs,
        functions: [],
        program: $block.concat([['LINE', yylineno, 0], ['HALT']]),
        yy:yy,
      }
    %}
  ;

block
  : BEGIN expr_list END
    { $$ = $expr_list; }
  ;

import_list 
  : import_list import
    { $$ = $import_list.concat($import); }
  | import
    { $$ = $import; }
  ;

import
  : IMPORT package ';'
  { $$ = [[$package, @2]]; }
  ;

package
  : VAR '.' VAR 
  {
    $$= $1+"."+$3;
  }
  | VAR '.' '*'
  {
    $$= $1+".*";
  }
  ;


def_list
  : def_list def
    { $$ = $def_list.concat($def); }
  | def
    { $$ = $def; }
  ;

def
  : funct_type var '(' ')' block
    { 
      @$.first_line = @1.first_line;
      @$.first_column = @1.first_column;
      @$.last_line = @3.last_line;
      @$.last_column = @3.last_column;
      $$ = [{
        name: $var, 
        code: [
          locToIR(@2),
          ...$block,
          ['RET', '__DEFAULT', @1],
        ],  
        params: [], 
        loc: @$, 
        returnType: $funct_type
      }];
    }
  | funct_type var '(' paramList ')' block
    %{
      @$.first_line = @1.first_line;
      @$.first_column = @1.first_column;
      @$.last_line = @3.last_line;
      @$.last_column = @3.last_column;
    	let result = [
        
          locToIR(@2),
          ...$block,
          ['RET', '__DEFAULT', @1]
      ];
      let params = [$5];
    	$$ = [{
        name: $var, 
        code: result, 
        params: $paramList,
        loc: @$, 
        returnType: $funct_type
      }];
    %}
  ;

paramList 
  : param ',' paramList
   { $$=$param.concat($paramList); }
  | param
    { $$ = $param; }
  ;

param
  : var
    { 
      $$= [{
        name: $var,
        loc: @1
      }];
    }
  ;

funct_type
  : DEF 
    { $$ = "VOID"; }
  | INT
    { $$ = "INT"; }
  | BOOL
    { $$ = "BOOL"; }
  ;


expr_list
  : expr_list expr
    { $$ = $expr_list.concat($expr); }
  | 
    { $$ = []; }

  ;

expr
  : FORWARD '(' ')' ';'
    { $$ = [locToIR(@1), ['WORLDWALLS'], ['ORIENTATION'], ['MASK'], ['AND'], ['NOT'], ['EZ', 'WALL'], ['FORWARD']]; }
  | LEFT '(' ')' ';'
    { $$ = [locToIR(@1), ['LEFT']]; }
  | PICKBUZZER '(' ')' ';'
    { $$ = [locToIR(@1), ['WORLDBUZZERS'], ['EZ', 'WORLDUNDERFLOW'], ['PICKBUZZER']]; }
  | LEAVEBUZZER '(' ')' ';'
    { $$ = [locToIR(@1), ['BAGBUZZERS'], ['EZ', 'BAGUNDERFLOW'], ['LEAVEBUZZER']]; }
  | HALT '(' ')' ';'
    { $$ = [locToIR(@1), ['HALT']]; }
  | CONTINUE ';'
    { $$ = [locToIR(@1), ['CONTINUE', @1]]; }
  | BREAK ';'
    { $$ = [locToIR(@1), ['BREAK', @1]]; }
  | return ';'
    { $$ = $return; }
  | call ';'
    { $$ = $call; }
  | cond
    { $$ = $cond; }
  | loop
    { $$ = $loop; }
  | repeat
    { $$ = $repeat; }
  | block
    { $$ = $block; }
  | ';'
    { $$ = []; }
  ;

return
  : RET '(' ')'
    { $$ = [
      ['RET', {
        term: { 
          operation: "ATOM",
          instructions:[["LOAD", 0]],
          dataType:"VOID",
          atomType:"IMPLICIT.0"
        },
        loc: @1
      }],
      locToIR(@1)
    ]; }
  | RET 
    { $$ = [
      ['RET', {
        term: {
          operation: "ATOM",
          instructions:[["LOAD", 0]],
          dataType:"VOID",
          atomType:"IMPLICIT.0"
        },
        loc: @1
      }],      
      locToIR(@1)
    ]; }
  | RET  term 
    
    { $$ = [
      locToIR(@1),
      ['RET', {
        term: $term,
        loc: @1
      }]
    ]; }
  ;

call
  : var '(' ')'
    
    %{ 
      
      var loc = {
        first_line: @2.first_line,
        first_column: @2.first_column,
        last_line: @3.last_line,
        last_column: @3.last_column,
      };
      $$ = [[
        'CALL', 
        {
          target: $var,
          params: [],
          nameLoc: @1, 
          argLoc: loc,
        }
      ]]; 
    %}
  | var '(' int_termList ')'
    { 
      @$.first_column = @1.first_column;
      @$.first_line = @1.first_line;
      @$.last_column = @4.last_column;
      @$.last_line = @4.last_line;
      $$ = [[
        'CALL', 
        {
          target: $var, 
          params: $int_termList,
          nameLoc: @1, 
          argLoc: loc,
        }
      ]];  
    }
  ;

int_termList
  : int_termList ',' term
    { 
      $$ = $int_termList.concat([
        {
          term:$term, 
          operation: 'PASS',
          dataType: 'INT',
          loc: $term.loc,
          totalLoc: $term.totalLoc,
        } 
      ])
    }
  | term 
    { 
      $$ = [
        {
          term:$term, 
          operation: 'PASS',
          dataType: 'INT',
          loc: $term.loc,
          totalLoc: $term.totalLoc,
        } 
      ]; 
    }
  ;

cond

  : IF '(' bool_term ')' expr %prec XIF
    %{ 
      const skipTag = UniqueTag('iskip');
      $$ = [[
        "IF",
        {
          condition: $bool_term[0],
          line: locToIR(@1),
          skipTrueTag: skipTag,
          trueCase: $expr
        }
      ]];
    %}
  | IF '(' bool_term ')' expr ELSE expr
    %{ 
      const toElse = UniqueTag('ielse');
      const skipElse = UniqueTag('iskipelse');
      $$ = [[
        "IF",
        {
          condition: $bool_term[0],
          line: locToIR(@1),
          skipTrueTag: toElse,
          skipFalseTag: skipElse,
          trueCase: $5,
          falseCase: $7
        }
      ]];
    %}
  ;

loop
  : WHILE '(' bool_term ')' expr
    %{ 
      const repeatTag = UniqueTag('lrepeat');
      const endTag = UniqueTag('lend');
      $$ = [[
        'WHILE',  
        {
          condition:   $bool_term[0],
          line:         locToIR(@1),
          repeatTag:    repeatTag,
          endTag:       endTag,
          instructions: $expr
        }
      ]];
    %}
  ;

repeat
  : REPEAT'(' int_term ')' expr
    %{ 
      const repeatEnd = UniqueTag('rend');
      const repeatLoop = UniqueTag('rloop');
      const continueLoop = UniqueTag('rcontinue');
      $$ = [[
        "REPEAT",
        {
          line:       locToIR(@1),
          loopCount:  $int_term[0],
          repeatTag:  repeatLoop,
          continueTag: continueLoop,
          endTag:     repeatEnd,
          instructions: $expr
        }
      ]]; 
    %}
  ;




term
  : term OR term 
    %{ 
      @$ = mergeLocs(@1, @3);
      $$ = {
        left: $1, 
        right: $3, 
        operation: "OR", 
        dataType:"BOOL",
        loc: @2,
        totalLoc: @$
      }; 
    %}
  | term AND term 
    %{      
      @$ = mergeLocs(@1, @3);
      $$ = {
        left: $1, 
        right: $3, 
        operation: "AND", 
        dataType:"BOOL",
        loc: @2,
        totalLoc: @$
      };
    %}
  | term '==' term 
    %{ 
      @$ = mergeLocs(@1, @3);
      $$ = {
        left: $1, 
        right: $3, 
        operation: "EQ",
        loc: @2,
        totalLoc: @$,
        dataType:"BOOL"
      };
    %}
  | term '<' term 
    %{
      @$ = mergeLocs(@1, @3);
      $$ = {
        left: $1, 
        right: $3, 
        operation: "LT", 
        dataType:"BOOL",
        loc: @2,
        totalLoc: @$
      };
    %}
  | term '<=' term 
    %{
      @$ = mergeLocs(@1, @3);
      $$ = {
        left: $1, 
        right: $3, 
        operation: "LTE", 
        dataType:"BOOL",
        loc: @2,
        totalLoc: @$
      };
    %}
  | NOT term 
    %{ 
      @$ = mergeLocs(@1, @2);
      $$ = {
        term: $2,       
        operation: "NOT",
        dataType:"BOOL",
        loc: @1,
        totalLoc: @$
      };
    %}
  | '(' term ')'
    { 
      $$ = { 
        term: $term
        operation: "PARENTHESIS",
        dataType: $term.dataType,
        loc: $term.loc,
        totalLoc: @$
      };
    }
  | clause
    { $$ = $1; }
  ;

bool_term
  : term 
    { 
      $$ = [[
        'TERM', 
        {
          term:$term, 
          operation: 'PASS',
          dataType: 'BOOL',
          loc: $term.loc,
          totalLoc: $term.totalLoc
        }    
      ]];
    }
  ;

int_term
  : term 
    { 
      $$ = [[
        'TERM', 
        {
          term:$term, 
          operation: 'PASS',
          dataType: 'INT',
          loc: $term.loc,
          totalLoc: $term.totalLoc
        }    
      ]];
    }
  ;


clause
  : IFZ '(' int_term ')'
    %{ 
      @$ = mergeLocs(@1, @4)
      $$ = {
        operation: "ATOM",
        instructions: $int_term.concat([['NOT']]),
        dataType: "BOOL",
        atomType:"IS_ZERO",
        loc: @1,
        totalLoc: @$
      };
    %}
  | bool_fun
    %{ 
      @$ = @1;
      $$ = {
        operation: "ATOM",
        instructions: $bool_fun.code,
        atomType: $bool_fun.name,
        dataType: "BOOL",
        loc: @$,
        totalLoc: @$
      };
    %}
  | bool_fun '(' ')'
    { 
      @$ = mergeLocs(@1, @3);
      $$ = {
        operation: "ATOM",
        instructions: $bool_fun.code,
        atomType: $bool_fun.name,
        dataType: "BOOL",
        loc: @1,
        totalLoc: @$
      };
    }
  | integer
    {
      @$ = @1;
      $$ = {
        operation: "ATOM",
        instructions: $integer.code,
        atomType: $integer.data,
        dataType: "INT",
        loc: @1,
        totalLoc: @1
      };
    }
  | call 
    %{ 
      const callIR = $call;
      const callData = callIR[0][1];
      $$ = {
        operation: "ATOM",
        instructions: [...callIR, ['LRET']],
        dataType: "$"+callData.target,
        atomType:"CALL",
        loc: @1,
        totalLoc: @1
      }
    %}
  | var
    %{ 
      const ir = [[
        'VAR', 
        {
          target:$var, 
          loc: @1,
          couldBeFunction: false,
        }
      ]];        
      @$=@1;
      $$ = {
        operation: "ATOM",
        instructions: ir,
        dataType: "$"+$var,
        atomType: `VAR.${$var}`,
        loc: @1,
        totalLoc: @1
      }; 
    %}
  ;

bool_fun
  : IFNFWALL
    { 
      $$ = {
        name: "IFNFWALL",
        code: [['WORLDWALLS'], ['ORIENTATION'], ['MASK'], ['AND'], ['NOT']]
      }; 
    }
  | IFFWALL
    { 
      $$ = {
        name: "IFFWALL",
        code: [['WORLDWALLS'], ['ORIENTATION'], ['MASK'], ['AND']]
      }; 
    }
  | IFNLWALL
    { 
      $$ = {
        name: "IFNLWALL",
        code: [['WORLDWALLS'], ['ORIENTATION'], ['ROTL'], ['MASK'], ['AND'], ['NOT']]
      }; 
    }
  | IFLWALL
    { 
      $$ = {
        name: "IFLWALL",
        code: [['WORLDWALLS'], ['ORIENTATION'], ['ROTL'], ['MASK'], ['AND']]
      };
    }
  | IFNRWALL
    { 
      $$ = {
        name: "IFNRWALL",
        code: [['WORLDWALLS'], ['ORIENTATION'], ['ROTR'], ['MASK'], ['AND'], ['NOT']]
      };
    }
  | IFRWALL
    { 
      $$ = {
        name: "IFRWALL",
        code: [['WORLDWALLS'], ['ORIENTATION'], ['ROTR'], ['MASK'], ['AND']]
      };
    }
  | IFWBUZZER
    { 
      $$ = {
        name: "IFWBUZZER",
        code: [['WORLDBUZZERS'], ['LOAD', 0], ['EQ'], ['NOT']]
      };
    }
  | IFNWBUZZER
    { 
      $$ = {
        name: "IFNWBUZZER",
        code: [['WORLDBUZZERS'], ['NOT']]
      };
    }
  | IFBBUZZER
    { 
      $$ = {
        name: "IFBBUZZER",
        code: [['BAGBUZZERS'], ['LOAD', 0], ['EQ'], ['NOT']]
      };
    }
  | IFNBBUZZER
    {
      $$ = {
        name: "IFNBBUZZER",
        code: [['BAGBUZZERS'], ['NOT']]
      };
    }
  | IFW
    { 
      $$ = {
        name: "IFW",
        code: [['ORIENTATION'], ['LOAD', 0], ['EQ']]
      };
    }
  | IFN
    {
      $$ = {
        name: "IFN",
        code: [['ORIENTATION'], ['LOAD', 1], ['EQ']]
      };
    }
  | IFE
    {
      $$ = {
        name: "IFE",
        code: [['ORIENTATION'], ['LOAD', 2], ['EQ']]
      };
    }
  | IFS
    {
      $$ = {
        name: "IFS",
        code: [['ORIENTATION'], ['LOAD', 3], ['EQ']]
      };
    }
  | IFNW
    {
      $$ = {
        name: "IFNW",
        code: [['ORIENTATION'], ['LOAD', 0], ['EQ'], ['NOT']]
      };
    }
  | IFNN
    {
      $$ = {
        name: "IFNN",
        code: [['ORIENTATION'], ['LOAD', 1], ['EQ'], ['NOT']]
      };
    }
  | IFNE
    { 
      $$ = {
        name: "IFNE",
        code: [['ORIENTATION'], ['LOAD', 2], ['EQ'], ['NOT']]
      };
    }
  | IFNS
    {
      $$ = {
        name: "IFNS",
        code: [['ORIENTATION'], ['LOAD', 3], ['EQ'], ['NOT']]
      };
    }
  ;

integer
  : int_literal
    { 
      $$ = {
        data: `NUMBER.${$int_literal}`, 
        code: [['LOAD', $int_literal]]
      };
    }
  | INC '(' int_term ')'
    { 
      $$ = {
        data: "INC",
        code: $int_term.concat([['INC', 1]])
      };
    }
  | DEC	 '(' int_term ')'
    { 
      $$ = {
        data: "DEC",
        code: $int_term.concat([['DEC', 1]])
      };
    }
  | INC '(' int_term ',' int_literal ')'
    { 
      $$ = {
        data: `INC.${$int_literal}`,
        code: $int_term.concat([['INC', $int_literal]])
      }; 
    }
  | DEC	 '(' int_term ',' int_literal ')'
    { 
      $$ = {
        data: `DEC.${$int_literal}`,
        code: $int_term.concat([['DEC', $int_literal]])
      };
    }
  
  ;

int_literal
  : NUM
    { $$ = parseInt(yytext); }
  ;

var
  : VAR
    { $$ = yytext; }
  ;
