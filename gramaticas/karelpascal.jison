/* Karel-pascal */

%lex
%options case-insensitive
%options flex
%%

\s+                                         {/* ignore */}
\{[^}]*\}                                   {/* ignore */}
\(\*(?:[^*]|\*(?!\)))*\*\)                  {/* ignore */}
"iniciar-programa"                          { return 'BEGINPROG'; }
"inicia-ejecucion"                          { return 'BEGINEXEC'; }
"inicia-ejecución"                          { return 'BEGINEXEC'; }
"termina-ejecucion"                         { return 'ENDEXEC'; }
"termina-ejecución"                         { return 'ENDEXEC'; }
"finalizar-programa"                        { return 'ENDPROG'; }
"define-nueva-instruccion"                  { return 'DEF'; }
"define-nueva-instrucción"                  { return 'DEF'; }
"usa"			                                  { return 'IMPORT'; }
"define-prototipo-instruccion"              { return 'PROTO'; }
"define-prototipo-instrucción"              { return 'PROTO'; }
"define-prototipo-entero"                   { return 'PROTO_INT'; }
"define-instrucción-entera"                 { return 'DEF_INT'; }
"define-instruccion-entera"                 { return 'DEF_INT'; }
"sal-de-instruccion"                        { return 'RET'; }
"sal-de-instrucción"                        { return 'RET'; }
"regresa"                                   { return 'RET'; }
"como"                                      { return 'AS'; }
"apagate"                                   { return 'HALT'; }
"apágate"                                   { return 'HALT'; }
"gira-izquierda"                            { return 'LEFT'; }
"avanza"                                    { return 'FORWARD'; }
"coge-zumbador"                             { return 'PICKBUZZER'; }
"deja-zumbador"                             { return 'LEAVEBUZZER'; }
"inicio"                                    { return 'BEGIN'; }
"fin"                                       { return 'END'; }
"entonces"                                  { return 'THEN'; }
"mientras"                                  { return 'WHILE'; }
"hacer"                                     { return 'DO'; }
"repetir"                                   { return 'REPEAT'; }
"veces"                                     { return 'TIMES'; }
"precede"                                   { return 'DEC'; }
"sucede"                                    { return 'INC'; }
"si-es-cero"                                { return 'IFZ'; }
"frente-libre"                              { return 'IFNFWALL'; }
"frente-bloqueado"                          { return 'IFFWALL'; }
"izquierda-libre"                           { return 'IFNLWALL'; }
"izquierda-bloqueada"                       { return 'IFLWALL'; }
"derecha-libre"                             { return 'IFNRWALL'; }
"derecha-bloqueada"                         { return 'IFRWALL'; }
"junto-a-zumbador"                          { return 'IFWBUZZER'; }
"no-junto-a-zumbador"                       { return 'IFNWBUZZER'; }
"algun-zumbador-en-la-mochila"              { return 'IFBBUZZER'; }
"algún-zumbador-en-la-mochila"              { return 'IFBBUZZER'; }
"ningun-zumbador-en-la-mochila"             { return 'IFNBBUZZER'; }
"ningún-zumbador-en-la-mochila"             { return 'IFNBBUZZER'; }
"orientado-al-norte"                        { return 'IFN'; }
"orientado-al-sur"                          { return 'IFS'; }
"orientado-al-este"                         { return 'IFE'; }
"orientado-al-oeste"                        { return 'IFW'; }
"no-orientado-al-norte"                     { return 'IFNN'; }
"no-orientado-al-sur"                       { return 'IFNS'; }
"no-orientado-al-este"                      { return 'IFNE'; }
"no-orientado-al-oeste"                     { return 'IFNW'; }
"sino"                                      { return 'ELSE'; }
"si-no"                                     { return 'ELSE'; }
"si"                                        { return 'IF'; }
"no"                                        { return 'NOT'; }
"o"                                         { return 'OR'; }
"u"                                         { return 'OR'; }
"y"                                         { return 'AND'; }
"e"                                         { return 'AND'; }
"("                                         { return '('; }
")"                                         { return ')'; }
";"                                         { return ';'; }
"."                                         { return '.'; }
","                                         { return ','; }
"*"                                         { return '*'; }
[0-9]+                                      { return 'NUM'; }
[A-Za-zÀ-ÖØ-öø-ÿ_][A-Za-zÀ-ÖØ-öø-ÿ0-9_-]*   { return 'VAR'; }
<<EOF>>                                     { return 'EOF'; }
/lex

%nonassoc XIF
%nonassoc ELSE

%{

const COMPILER= "RKP 1.0.0";
const LANG = "ReKarel Pascal"

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
  : import_list BEGINPROG def_list BEGINEXEC expr_list ENDEXEC ENDPROG EOF
    %{ 
      resetCompiler();
      return {
        compiler: COMPILER,
        language: LANG,
        requieresFunctionPrototypes: true, 
        packages: $import_list,
        functions: $def_list,
        program: $expr_list.concat([['LINE', yylineno], ['HALT']]),
        yy:yy,
      }; 
    %}
  | import_list  BEGINPROG BEGINEXEC expr_list ENDEXEC ENDPROG EOF
    %{ 
      resetCompiler();
      return {
        compiler: COMPILER,
        language: LANG,
        requieresFunctionPrototypes: true,
        packages: $import_list,
        functions: [],
        program: $expr_list.concat([['LINE', yylineno], ['HALT']]),
        yy:yy,
      }; 
    %}
    | BEGINPROG def_list BEGINEXEC expr_list ENDEXEC ENDPROG EOF
    %{ 
      resetCompiler();
      return {
        compiler: COMPILER,
        language: LANG,
        requieresFunctionPrototypes: true, 
        packages: [],
        functions: $def_list,
        program: $expr_list.concat([['LINE', yylineno], ['HALT']]),
        yy:yy,
      }; 
    %}
  |  BEGINPROG BEGINEXEC expr_list ENDEXEC ENDPROG EOF
    %{ 
      resetCompiler();
      return {
        compiler: COMPILER,
        language: LANG,
        requieresFunctionPrototypes: true,
        packages: [],
        functions: [],
        program: $expr_list.concat([['LINE', yylineno], ['HALT']]),
        yy:yy,
      }; 
    %}
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
  : def_list def ';'
    { $$ = $def_list.concat($def); }
  | def ';'
    { $$ = $def; }
  ;

def
  : prototype_type line var
    { 
      @$.first_line = @1.first_line;
      @$.first_column = @1.first_column;
      @$.last_line = @3.last_line;
      @$.last_column = @3.last_column;
      $$ = [{
        name: $var.toLowerCase(), 
        code: null, 
        params: [],  
        loc: @$,
        returnType: $funct_type
      }]; 
    }
  | prototype_type line var '(' var ')'
    { 
      @$.first_line = @1.first_line;
      @$.first_column = @1.first_column;
      @$.last_line = @6.last_line;
      @$.last_column = @6.last_column;
      $$ = [{
        name: $var.toLowerCase(), 
        code: null, 
        params: [$5],  
        loc: @$,
        returnType: $funct_type
      }]; 
      }
  | funct_type line var  AS expr
    { 
      @$.first_line = @1.first_line;
      @$.first_column = @1.first_column;
      @$.last_line = @3.last_line;
      @$.last_column = @3.last_column;

      $$ = [{
        name: $var,  
        code: $line.concat($expr).concat([['RET', '__DEFAULT', @1]]), //FIXME: This should be in the end of the expression
        params: [], 
        loc: @$,
        returnType: $funct_type
      }]; 
    }
  | funct_type line var '(' var ')' AS expr
    %{
      
      @$.first_line = @1.first_line;
      @$.first_column = @1.first_column;
      @$.last_line = @3.last_line;
      @$.last_column = @3.last_column;

    	$$ = [{
        name: $3,
        code: $line.concat($expr).concat([['RET', '__DEFAULT', @1]]), //FIXME: This should be in the end of the expression
        params: [$5],
        loc: @$,        
        returnType: $funct_type
      }];
    %}
  ;

funct_type
  : DEF_INT
    { $$ = "INT"; }
  | DEF
    { $$ = "VOID"; }
  ;

prototype_type
  : PROTO_INT
    { $$ = "INT"; }
  | PROTO
    { $$ = "VOID"; }
  ;

expr_list
  : expr_list ';' genexpr
    { $$ = $expr_list.concat($genexpr); }
  | genexpr
    { $$ = $genexpr; }
  ;

genexpr
  : expr
    { $$ = $expr; }
  |
    { $$ = []; }
  ;

expr
  : FORWARD
    { $$ = [['LINE', yylineno], ['WORLDWALLS'], ['ORIENTATION'], ['MASK'], ['AND'], ['NOT'], ['EZ', 'WALL'], ['FORWARD']]; }
  | LEFT
    { $$ = [['LINE', yylineno], ['LEFT']]; }
  | PICKBUZZER
    { $$ = [['LINE', yylineno], ['WORLDBUZZERS'], ['EZ', 'WORLDUNDERFLOW'], ['PICKBUZZER']]; }
  | LEAVEBUZZER
    { $$ = [['LINE', yylineno], ['BAGBUZZERS'], ['EZ', 'BAGUNDERFLOW'], ['LEAVEBUZZER']]; }
  | HALT
    { $$ = [['LINE', yylineno], ['HALT']]; }
  | return
    { $$ = $return; }
  | call
    { $$ = $call; }
  | cond
    { $$ = $cond; }
  | loop
    { $$ = $loop; }
  | repeat
    { $$ = $repeat; }
  | BEGIN expr_list END
    { $$ = $expr_list; }
  ;

return
  : RET 
    { $$ = [['LINE', yylineno], ['RET', 'VOID', @1]]; }
  | RET integer
    { $$ = [['LINE', yylineno], ...$integer, ['SRET'], [ 'RET', 'INT', @1]]; }
  ;

call
  : var
    { 
      $$ = [
        ['LINE', yylineno],
        ['LOAD', 0],
        [
          'CALL', 
          {
            target:$var.toLowerCase(), 
            argCount:1, 
            nameLoc: @1, 
            argLoc: @1
          }
        ],
        ['LINE', yylineno]
      ];
    }
  | parameteredCall
    { $$ = $parameteredCall; } 
    
  ;

parameteredCall 
  : var '(' integer ')'
    { 
      $$ = [
        ['LINE', yylineno], 
        ...$integer, 
        [
          'CALL', 
          {
            target: $var.toLowerCase(), 
            argCount: 2, 
            nameLoc: @1, 
            argLoc: @3
          }
        ], 
        ['LINE', yylineno]
      ]; 
    }
  ;

cond
  : IF line bool_term THEN expr %prec XIF
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
  | IF line bool_term THEN expr ELSE expr
     %{ 
      const toElse = UniqueTag('ielse');
      const skipElse = UniqueTag('iskipelse');
      $$ = [
        ...$line, 
        ...$bool_term, 
        ['TJZ', toElse ], 
        ...$5, 
        ['TJMP',  skipElse], 
        ['TAG', toElse  ],
        ...$7,        
        ['TAG', skipElse ],
      ]; 
    %}
  ;

loop
  : WHILE line bool_term DO expr
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
  : REPEAT line integer TIMES expr
    %{ 
      const repeatEnd = UniqueTag('rend');
      const repeatLoop = UniqueTag('rloop');
      $$ = [ 
        ...$line,
        ...$integer,
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

clause
  : IFZ '(' integer ')'
    { 
       $$ = {
        operation: "ATOM",
        instructions: $integer.concat([['NOT']]),
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
  : var
    { $$ = [[
        'VAR',
        {
          target: $var.toLowerCase(), 
          loc: @1, 
          couldBeFunction: true,
          expectedType: 'INT'
        }
      ]]; 
    }
  | int_literal
    { $$ = [['LOAD',  $int_literal]]; }
  | INC '(' integer ')'
    { $$ = $integer.concat([['INC', 1]]); }
  | DEC	 '(' integer ')'
    { $$ = $integer.concat([['DEC', 1]]); }
  | INC '(' integer ',' int_literal ')'
    { $$ = $integer.concat([['INC', $int_literal]]); }
  | DEC	 '(' integer ',' int_literal ')'
    { $$ = $integer.concat([['DEC', $int_literal]]); }
  | parameteredCall 
    %{
      const call = $parameteredCall
      call[call.length-2][1].expectedType = "INT"
      $$ = [...call, ["LRET"]]      
    %}
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
