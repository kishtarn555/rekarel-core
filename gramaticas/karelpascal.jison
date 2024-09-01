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
"entera"                                    { return 'INT'; }
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
%}

%%

program
  : import_list BEGINPROG def_list BEGINEXEC expr_list ENDEXEC ENDPROG EOF
    { 
      return {
        compiler: COMPILER,
        language: LANG,
        requieresFunctionPrototypes: true, 
        packages: $import_list,
        functions: $def_list,
        program: $expr_list.concat([['LINE', yylineno], ['HALT']]),
        yy:yy,
      }; 
    }
  | import_list  BEGINPROG BEGINEXEC expr_list ENDEXEC ENDPROG EOF
    { 
      return {
        compiler: COMPILER,
        language: LANG,
        requieresFunctionPrototypes: true,
        packages: $import_list,
        functions: [],
        program: $expr_list.concat([['LINE', yylineno], ['HALT']]),
        yy:yy,
      }; 
    }
    | BEGINPROG def_list BEGINEXEC expr_list ENDEXEC ENDPROG EOF
    { 
      return {
        compiler: COMPILER,
        language: LANG,
        requieresFunctionPrototypes: true, 
        packages: [],
        functions: $def_list,
        program: $expr_list.concat([['LINE', yylineno], ['HALT']]),
        yy:yy,
      }; 
    }
  |  BEGINPROG BEGINEXEC expr_list ENDEXEC ENDPROG EOF
    { 
      return {
        compiler: COMPILER,
        language: LANG,
        requieresFunctionPrototypes: true,
        packages: [],
        functions: [],
        program: $expr_list.concat([['LINE', yylineno], ['HALT']]),
        yy:yy,
      }; 
    }
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
  : PROTO funct_type line var
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
  | PROTO funct_type line var '(' var ')'
    { 
      @$.first_line = @1.first_line;
      @$.first_column = @1.first_column;
      @$.last_line = @6.last_line;
      @$.last_column = @6.last_column;
      $$ = [{
        name: $var.toLowerCase(), 
        code: null, 
        params: [$6],  
        loc: @$,
        returnType: $funct_type
      }]; 
      }
  | DEF funct_type line var  AS expr
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
  | DEF funct_type line var '(' var ')' AS expr
    %{
      
      @$.first_line = @1.first_line;
      @$.first_column = @1.first_column;
      @$.last_line = @3.last_line;
      @$.last_column = @3.last_column;

    	$$ = [{
        name: $4,
        code: $line.concat($expr).concat([['RET', '__DEFAULT', @1]]), //FIXME: This should be in the end of the expression
        params: [$6],
        loc: @$,        
        returnType: $funct_type
      }];
    %}
  ;

funct_type
  : INT
    { $$ = "INT"; }
  | 
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
  | RET '(' integer ')'
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
  : IF line term THEN expr %prec XIF
    { $$ = $line.concat($term).concat([['JZ', $expr.length]]).concat($expr); }
  | IF line term THEN expr ELSE expr
    { $$ = $line.concat($term).concat([['JZ', 1 + $5.length]]).concat($5).concat([['JMP', $7.length]]).concat($7); }
  ;

loop
  : WHILE line term DO expr
    { $$ = $line.concat($term).concat([['JZ', 1 + $expr.length]]).concat($expr).concat([['JMP', -1 -($term.length + $expr.length + 2)]]); }
  ;

repeat
  : REPEAT line integer TIMES expr
    { $$ = $line.concat($integer).concat([['DUP'], ['LOAD', 0], ['EQ'], ['NOT'], ['JZ', $expr.length + 2]]).concat($expr).concat([['DEC', 1], ['JMP', -1 -($expr.length + 6)], ['POP']]); }
  ;

term
  : term OR and_term
    { $$ = $term.concat($and_term).concat([['OR']]); }
  | and_term
    { $$ = $and_term; }
  ;

and_term
  : and_term AND not_term
    { $$ = $and_term.concat($not_term).concat([['AND']]); }
  | not_term
    { $$ = $not_term; }
  ;

not_term
  : NOT clause
    { $$ = $clause.concat([['NOT']]); }
  | clause
    { $$ = $clause; }
  ;

clause
  : IFZ '(' integer ')'
    { $$ = $integer.concat([['NOT']]); }
  | bool_fun
    { $$ = $bool_fun; }
  | '(' term ')'
    { $$ = $term; }
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
          couldBeFunction: true
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
