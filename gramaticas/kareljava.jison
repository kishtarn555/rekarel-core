/* Karel-java */

%lex
%%

\s+                             {/* ignore */}
\/\/[^\n]*			{/* ignore */}
\/\*(?:[^*]|\*(?!\/))*\*\/	{/* ignore */}
"class"				{ return 'CLASS'; }
"program"		        { return 'PROG'; }
"define"			{ return 'DEF'; }
"import"			{ return 'IMPORT'; }
"void"				{ return 'DEF'; }
"int"				  { return 'INT'; }
"bool"				  { return 'BOOL'; }
"return"      { return 'RET'; }
"turnoff"                       { return 'HALT'; }
"turnleft"	                { return 'LEFT'; }
"move" 		                { return 'FORWARD'; }
"pickbeeper"	                { return 'PICKBUZZER'; }
"putbeeper"                     { return 'LEAVEBUZZER'; }
"while"                         { return 'WHILE'; }
"iterate"                       { return 'REPEAT'; }
"pred" 		                { return 'DEC'; }
"succ"          	        { return 'INC'; }
"iszero" 	                { return 'IFZ'; }
"frontIsClear"                  { return 'IFNFWALL'; }
"frontIsBlocked"                { return 'IFFWALL'; }
"leftIsClear"	                { return 'IFNLWALL'; }
"leftIsBlocked"                 { return 'IFLWALL'; }
"rightIsClear"                  { return 'IFNRWALL'; }
"rightIsBlocked"                { return 'IFRWALL'; }
"nextToABeeper"                 { return 'IFWBUZZER'; }
"notNextToABeeper"   	        { return 'IFNWBUZZER'; }
"anyBeepersInBeeperBag" 	{ return 'IFBBUZZER'; }
"noBeepersInBeeperBag"		{ return 'IFNBBUZZER'; }
"facingNorth"		        { return 'IFN'; }
"facingSouth"	                { return 'IFS'; }
"facingEast"		        { return 'IFE'; }
"facingWest"	                { return 'IFW'; }
"notFacingNorth"	        { return 'IFNN'; }
"notFacingSouth"	        { return 'IFNS'; }
"notFacingEast"		        { return 'IFNE'; }
"notFacingWest"		        { return 'IFNW'; }
"else"                          { return 'ELSE'; }
"if"                            { return 'IF'; }
"!"                             { return 'NOT'; }
"||"                            { return 'OR'; }
"&&"                            { return 'AND'; }
"&"				{ return 'AND'; }
"("                             { return '('; }
")"                             { return ')'; }
"{"                             { return 'BEGIN'; }
"}"                             { return 'END'; }
";"                             { return ';'; }
"."                             { return '.'; }
"*"                             { return '*'; }
","                             { return ','; }
[0-9]+                          { return 'NUM'; }
[a-zA-Z][a-zA-Z0-9_]*           { return 'VAR'; }
<<EOF>>                         { return 'EOF'; }
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

%}


%left OR
%left AND
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
        program: $block.concat([['LINE', yylineno], ['HALT']]),
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
        program: $block.concat([['LINE', yylineno], ['HALT']]),
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
        program: $block.concat([['LINE', yylineno], ['HALT']]),
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
        program: $block.concat([['LINE', yylineno], ['HALT']]),
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
  { $$ = [[$package]]; }
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
  : funct_type line var '(' ')' block
    { 
      @$.first_line = @1.first_line;
      @$.first_column = @1.first_column;
      @$.last_line = @3.last_line;
      @$.last_column = @3.last_column;
      $$ = [{
        name: $var, 
        code: $line.concat($block).concat([['RET', '__DEFAULT', @1]]),  //FIXME: This should be in the closing bracket of block
        params: [], 
        loc: @$, 
        returnType: $funct_type
      }];
    }
  | funct_type line var '(' paramList ')' block
    %{
      @$.first_line = @1.first_line;
      @$.first_column = @1.first_column;
      @$.last_line = @3.last_line;
      @$.last_column = @3.last_column;
    	let result = $line.concat($block).concat([['RET', '__DEFAULT', @1]]);
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
  | expr
    { $$ = $expr; }
  ;

expr
  : FORWARD '(' ')' ';'
    { $$ = [['LINE', yylineno], ['WORLDWALLS'], ['ORIENTATION'], ['MASK'], ['AND'], ['NOT'], ['EZ', 'WALL'], ['FORWARD']]; }
  | LEFT '(' ')' ';'
    { $$ = [['LINE', yylineno], ['LEFT']]; }
  | PICKBUZZER '(' ')' ';'
    { $$ = [['LINE', yylineno], ['WORLDBUZZERS'], ['EZ', 'WORLDUNDERFLOW'], ['PICKBUZZER']]; }
  | LEAVEBUZZER '(' ')' ';'
    { $$ = [['LINE', yylineno], ['BAGBUZZERS'], ['EZ', 'BAGUNDERFLOW'], ['LEAVEBUZZER']]; }
  | HALT '(' ')' ';'
    { $$ = [['LINE', yylineno], ['HALT']]; }
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
      ['LINE', yylineno],
      ['RET', {
        term: { operation: "ATOM", instructions:[["LOAD", 0]], dataType:"VOID" },
        loc: @1
      }]
    ]; }
  | RET 
    { $$ = [
      ['LINE', yylineno],
      ['RET', {
        term: { operation: "ATOM", instructions:[["LOAD", 0]], dataType:"VOID" },
        loc: @1
      }]
    ]; }
  | RET  term 
    
    { $$ = [
      ['LINE', yylineno],
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
          line: yylineno,
        }
      ]];  
    }
  ;

int_termList
  : term ',' int_termList
    { 
      $$ = $int_termList.concat([
        {
          term:$term, 
          operation: 'PASS',
          dataType: 'INT'
        } 
      ])
    }
  | term 
    { 
      $$ = [
        {
          term:$term, 
          operation: 'PASS',
          dataType: 'INT'
        } 
      ]; 
    }
  ;

cond

  : IF line '(' bool_term ')' expr %prec XIF
    %{ 
      const skipTag = UniqueTag('iskip');
      $$ = [
        ...$line, 
        ...$bool_term, 
        ['TJZ', skipTag],
        ...$expr,
        ['TAG', skipTag ],
      ];
    %}
  | IF line '(' bool_term ')' expr ELSE expr
    %{ 
      const toElse = UniqueTag('ielse');
      const skipElse = UniqueTag('iskipelse');
      $$ = [
        ...$line, 
        ...$bool_term, 
        ['TJZ', toElse ], 
        ...$6, 
        ['TJMP',  skipElse], 
        ['TAG', toElse  ],
        ...$8,        
        ['TAG', skipElse ],
      ]; 
    %}
  ;

loop
  : WHILE line  '(' bool_term ')' expr
    %{ 
      const repeatTag = UniqueTag('lrepeat');
      const endTag = UniqueTag('lend');
      $$ = [
        ['TAG',  repeatTag ],
        ...$line, 
        ...$bool_term, 
        ['TJZ',  endTag], 
        ...$expr, 
        ['TJMP', repeatTag],
        ['TAG', endTag],
      ];
    %}
  ;

repeat
  : REPEAT line '(' int_term ')' expr
    %{ 
      const repeatEnd = UniqueTag('rend');
      const repeatLoop = UniqueTag('rloop');
      $$ = [ 
        ...$line,
        ...$int_term,
        ['TAG', repeatLoop],
        ['DUP'],
        ['LOAD', 0], 
        ['EQ'], 
        ['NOT'], 
        ['TJZ', repeatEnd],
        ...$expr,
        ['DEC', 1], 
        ['TJMP', repeatLoop], 
        ['TAG', repeatEnd],
        ['POP'], 
      ]; 
    %}
  ;




term
  : term OR term 
    { $$ = {
        left: $1, 
        right: $3, 
        operation: "OR", 
        dataType:"BOOL" 
      }; }
  | term AND term 
    { 
      $$ = {
        left: $1, 
        right: $3, 
        operation: "AND", 
        dataType:"BOOL"
      };
    }
  | NOT term 
    { 
      $$ = {
        term: $2,       
        operation: "NOT",
        dataType:"BOOL" 
      };
      }
  | '(' term ')'
    { $$ = $term; }
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
          dataType: 'BOOL'
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
          dataType: 'INT'
        }    
      ]];
    }
  ;


clause
  : IFZ '(' int_term ')'
    { 
      $$ = {
        operation: "ATOM",
        instructions: $int_term.concat([['NOT']]),
        dataType: "BOOL"
      };
    }
  | bool_fun
    { 
      $$ = {
        operation: "ATOM",
        instructions: $bool_fun,
        dataType: "BOOL"
      };
    }
  | bool_fun '(' ')'
    { 
      $$ = {
        operation: "ATOM",
        instructions: $bool_fun,
        dataType: "BOOL"
      };
    }
  | integer
    {
      $$ = {
        operation: "ATOM",
        instructions: $integer,
        dataType: "INT"
      };
    }
  | call 
    %{ 
      const callIR = $call;
      const callData = callIR[0][1];
      $$ = {
        operation: "ATOM",
        instructions: [...callIR, ['LRET']],
        dataType: "$"+callData.target
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
      $$ = {
        operation: "ATOM",
        instructions: ir,
        dataType: "$"+$var
      }; 
    %}
  ;

bool_fun
  : IFNFWALL
    { $$ = [['WORLDWALLS'], ['ORIENTATION'], ['MASK'], ['AND'], ['NOT']]; }
  | IFFWALL
    { $$ = [['WORLDWALLS'], ['ORIENTATION'], ['MASK'], ['AND']]; }
  | IFNLWALL
    { $$ = [['WORLDWALLS'], ['ORIENTATION'], ['ROTL'], ['MASK'], ['AND'], ['NOT']]; }
  | IFLWALL
    { $$ = [['WORLDWALLS'], ['ORIENTATION'], ['ROTL'], ['MASK'], ['AND']]; }
  | IFNRWALL
    { $$ = [['WORLDWALLS'], ['ORIENTATION'], ['ROTR'], ['MASK'], ['AND'], ['NOT']]; }
  | IFRWALL
    { $$ = [['WORLDWALLS'], ['ORIENTATION'], ['ROTR'], ['MASK'], ['AND']]; }
  | IFWBUZZER
    { $$ = [['WORLDBUZZERS'], ['LOAD', 0], ['EQ'], ['NOT']]; }
  | IFNWBUZZER
    { $$ = [['WORLDBUZZERS'], ['NOT']]; }
  | IFBBUZZER
    { $$ = [['BAGBUZZERS'], ['LOAD', 0], ['EQ'], ['NOT']]; }
  | IFNBBUZZER
    { $$ = [['BAGBUZZERS'], ['NOT']]; }
  | IFW
    { $$ = [['ORIENTATION'], ['LOAD', 0], ['EQ']]; }
  | IFN
    { $$ = [['ORIENTATION'], ['LOAD', 1], ['EQ']]; }
  | IFE
    { $$ = [['ORIENTATION'], ['LOAD', 2], ['EQ']]; }
  | IFS
    { $$ = [['ORIENTATION'], ['LOAD', 3], ['EQ']]; }
  | IFNW
    { $$ = [['ORIENTATION'], ['LOAD', 0], ['EQ'], ['NOT']]; }
  | IFNN
    { $$ = [['ORIENTATION'], ['LOAD', 1], ['EQ'], ['NOT']]; }
  | IFNE
    { $$ = [['ORIENTATION'], ['LOAD', 2], ['EQ'], ['NOT']]; }
  | IFNS
    { $$ = [['ORIENTATION'], ['LOAD', 3], ['EQ'], ['NOT']]; }
  ;

integer
  : int_literal
    { $$ = [['LOAD', $int_literal]]; }
  | INC '(' int_term ')'
    { $$ = $int_term.concat([['INC', 1]]); }
  | DEC	 '(' int_term ')'
    { $$ = $int_term.concat([['DEC', 1]]); }
  | INC '(' int_term ',' int_literal ')'
    { $$ = $int_term.concat([['INC', $int_literal]]); }
  | DEC	 '(' int_term ',' int_literal ')'
    { $$ = $int_term.concat([['DEC', $int_literal]]); }
  
  ;

int_literal
  : NUM
    { $$ = parseInt(yytext); }
  ;

var
  : VAR
    { $$ = yytext; }
  ;

line
  : 
    { $$ = [['LINE', yylineno]]; }
  ;
