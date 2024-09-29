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
"define"                                    { return 'DEF'; }
"usa"			                                  { return 'IMPORT'; }
"define-prototipo-instruccion"              { return 'PROTO'; }
"define-prototipo-instrucción"              { return 'PROTO'; }
"define-prototipo-entero"                   { return 'PROTO_INT'; }
"define-instrucción-entera"                 { return 'DEF_INT'; }
"define-instruccion-entera"                 { return 'DEF_INT'; }
"define-calculo"                            { return 'DEF_INT'; }
"define-cálculo"                            { return 'DEF_INT'; }
"define-prototipo-booleano"                 { return 'PROTO_BOOL'; }
"define-instrucción-booleana"               { return 'DEF_BOOL'; }
"define-instruccion-booleana"               { return 'DEF_BOOL'; }
"define-condicion"                          { return 'DEF_BOOL'; }
"define-condición"                          { return 'DEF_BOOL'; }
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
"continua"                                  { return 'CONTINUE'; }
"continúa"                                  { return 'CONTINUE'; }
"rompe"                                     { return 'BREAK'; }
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
"es-cero"                                   { return 'IFZ'; }
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
"=="                                        { return '=='; }
"<="                                        { return '<='; }
"<"                                         { return '<'; }
[0-9]+                                      { return 'NUM'; }
[A-Za-zÀ-ÖØ-öø-ÿ_][A-Za-zÀ-ÖØ-öø-ÿ0-9_-]*   { return 'VAR'; }
<<EOF>>                                     { return 'EOF'; }
/lex

%nonassoc XIF
%nonassoc ELSE

%{

const COMPILER= "RKP 1.0.0";
const LANG = "ReKarel Pascal"
const VarsAsFuncs = true;
const reqsPrototypes = false;

let tagCnt = 1;

function UniqueTag(tag) {
  return `${tag}.${tagCnt++}`;
}
function resetCompiler(tag) {
  tagCnt = 1;
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
  : import_list BEGINPROG def_list BEGINEXEC expr_list ENDEXEC ENDPROG EOF
    %{ 
      resetCompiler();
      return {
        compiler: COMPILER,
        language: LANG,
        requieresFunctionPrototypes: reqsPrototypes, 
        variablesCanBeFunctions: VarsAsFuncs,
        packages: $import_list,
        functions: $def_list,
        program: $expr_list.concat([['LINE', yylineno, 0], ['HALT']]),
        yy:yy,
      }; 
    %}
  | import_list  BEGINPROG BEGINEXEC expr_list ENDEXEC ENDPROG EOF
    %{ 
      resetCompiler();
      return {
        compiler: COMPILER,
        language: LANG,
        requieresFunctionPrototypes: reqsPrototypes, 
        variablesCanBeFunctions: VarsAsFuncs,
        packages: $import_list,
        functions: [],
        program: $expr_list.concat([['LINE', yylineno, 0], ['HALT']]),
        yy:yy,
      }; 
    %}
    | BEGINPROG def_list BEGINEXEC expr_list ENDEXEC ENDPROG EOF
    %{ 
      resetCompiler();
      return {
        compiler: COMPILER,
        language: LANG,
        requieresFunctionPrototypes: reqsPrototypes,  
        variablesCanBeFunctions: VarsAsFuncs,
        packages: [],
        functions: $def_list,
        program: $expr_list.concat([['LINE', yylineno, 0], ['HALT']]),
        yy:yy,
      }; 
    %}
  |  BEGINPROG BEGINEXEC expr_list ENDEXEC ENDPROG EOF
    %{ 
      resetCompiler();
      return {
        compiler: COMPILER,
        language: LANG,
        requieresFunctionPrototypes: reqsPrototypes, 
        variablesCanBeFunctions: VarsAsFuncs,
        packages: [],
        functions: [],
        program: $expr_list.concat([['LINE', yylineno, 0], ['HALT']]),
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
  : def_list def ';'
    { $$ = $def_list.concat($def); }
  | def ';'
    { $$ = $def; }
  ;

def
  : prototype_type var
    { 
      @$.first_line = @1.first_line;
      @$.first_column = @1.first_column;
      @$.last_line = @2.last_line;
      @$.last_column = @2.last_column;
      $$ = [{
        name: $var.toLowerCase(), 
        code: null, 
        params: [],  
        loc: @$,
        returnType: $prototype_type
      }]; 
    }
  | prototype_type var '(' paramList ')'
    { 
      @$.first_line = @1.first_line;
      @$.first_column = @1.first_column;
      @$.last_line = @5.last_line;
      @$.last_column = @5.last_column;
      $$ = [{
        name: $var.toLowerCase(), 
        code: null, 
        params: $paramList,  
        loc: @$,
        returnType: $prototype_type
      }]; 
      }
  | funct_type var  AS expr
    { 
      @$.first_line = @1.first_line;
      @$.first_column = @1.first_column;
      @$.last_line = @2.last_line;
      @$.last_column = @2.last_column;

      $$ = [{
        name: $var.toLowerCase(),  
        code: [
          locToIR(@2),
          ...$expr,
          ['RET', '__DEFAULT', @1]
        ],
        params: [], 
        loc: @$,
        returnType: $funct_type
      }]; 
    }
  | funct_type var '(' paramList ')' AS expr
    %{
      
      @$.first_line = @1.first_line;
      @$.first_column = @1.first_column;
      @$.last_line = @2.last_line;
      @$.last_column = @2.last_column;

    	$$ = [{
        name: $2.toLowerCase(),
        code: [
          locToIR(@2),
          ...$expr,
          ['RET', '__DEFAULT', @1]
        ],
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
  : DEF_INT
    { $$ = "INT"; }
  | DEF_BOOL
    { $$ = "BOOL"; }
  | DEF
    { $$ = "VOID"; }
  ;

prototype_type
  : PROTO_INT
    { $$ = "INT"; }
  | PROTO_BOOL
    { $$ = "BOOL"; }
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
    { $$ = [locToIR(@1), ['WORLDWALLS'], ['ORIENTATION'], ['MASK'], ['AND'], ['NOT'], ['EZ', 'WALL'], ['FORWARD']]; }
  | LEFT
    { $$ = [locToIR(@1), ['LEFT']]; }
  | PICKBUZZER
    { $$ = [locToIR(@1), ['WORLDBUZZERS'], ['EZ', 'WORLDUNDERFLOW'], ['PICKBUZZER']]; }
  | LEAVEBUZZER
    { $$ = [locToIR(@1), ['BAGBUZZERS'], ['EZ', 'BAGUNDERFLOW'], ['LEAVEBUZZER']]; }
  | HALT
    { $$ = [locToIR(@1), ['HALT']]; }
  | CONTINUE
    { $$ = [locToIR(@1), ['CONTINUE', @1]]; }
  | BREAK
    { $$ = [locToIR(@1), ['BREAK', @1]]; }
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
    
    { $$ = [
      ['RET', {
        term: { operation: "ATOM", instructions:[["LOAD", 0]], dataType:"VOID" },
        loc: @1
      }],
      locToIR(@1)
    ]; }
  | RET term
    
    { $$ = [
      ['RET', {
        term: $term,
        loc: @1
      }],
      locToIR(@1)
    ]; }
  ;

call
  : var
    { 
      $$ = [
        [
          'CALL', 
          {
            target:$var.toLowerCase(), 
            params: [],
            nameLoc: @1, 
            argLoc: @1
          }
        ]
      ];
    }
  | parameteredCall
    { $$ = $parameteredCall; } 
    
  ;

parameteredCall 
  : var '(' int_termList ')'
    { 
      $$ = [
        [
          'CALL', 
          {
            target: $var.toLowerCase(),
            params: $int_termList,
            nameLoc: @1, 
            argLoc: @3,
          }
        ]
      ]; 
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
          loc: @term,
          totalLoc: @term
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
          loc: @term,
          totalLoc: @term
        } 
      ]; 
    }
  ;

cond
  : IF bool_term THEN expr %prec XIF
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
  | IF bool_term THEN expr ELSE expr
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
          trueCase: $4,
          falseCase: $6
        }
      ]];
    %}
  ;

loop
  : WHILE bool_term DO expr
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
  : REPEAT int_term TIMES expr
    %{ 
      const repeatEnd = UniqueTag('rend');
      const repeatLoop = UniqueTag('rloop');
      const continueLoop = UniqueTag('rcontinue');
      $$ = [[
        "REPEAT",
        {
          line:        locToIR(@1),
          loopCount:   $int_term[0],
          repeatTag:   repeatLoop,
          endTag:      repeatEnd,
          continueTag: continueLoop,
          instructions: $expr
        }
      ]]; 
    %}
  ;

term
  : term OR term 
    { $$ = {
        left: $1, 
        right: $3, 
        operation: "OR", 
        dataType:"BOOL",
        loc: @2,
        totalLoc: @$ 
      }; }
  | term AND term 
    { 
      $$ = {
        left: $1, 
        right: $3, 
        operation: "AND", 
        dataType:"BOOL",
        loc: @2,
        totalLoc: @$
      };
    }
  | term '==' term 
    { 
      $$ = {
        left: $1, 
        right: $3, 
        operation: "EQ", 
        dataType:"BOOL",
        loc: @2,
        totalLoc: @$
      };
    }
  | term '<' term 
    { 
      $$ = {
        left: $1, 
        right: $3, 
        operation: "LT", 
        dataType:"BOOL",
        loc: @2,
        totalLoc: @$
      };
    }
  | term '<=' term 
    { 
      $$ = {
        left: $1, 
        right: $3, 
        operation: "LTE", 
        dataType:"BOOL",
        loc: @2,
        totalLoc: @$
      };
    }
  | NOT term 
    { 
      $$ = {
        term: $2,       
        operation: "NOT",
        dataType:"BOOL" ,
        loc: @1,
        totalLoc: @$
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
          dataType: 'BOOL',
          loc: @term,
          totalLoc: @term
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
          loc: @term,
          totalLoc: @term
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
        dataType: "BOOL",
        loc: @1,
        totalLoc: @$
      };
    }
  | bool_fun
    { 
      $$ = {
        operation: "ATOM",
        instructions: $bool_fun,
        dataType: "BOOL",
        loc: @1,
        totalLoc: @1
      }; 
    }
  | integer 
    {
      $$ = {
        operation: "ATOM",
        instructions: $integer,
        dataType: "INT",
        loc: @1,
        totalLoc: @1
      }; 
      
    }
  |
    var
      %{ 
        const ir = [[
          'VAR',
          {
            target: $var.toLowerCase(), 
            loc: @1, 
            couldBeFunction: true
          }
        ]]; 
        $$ = {
          operation: "ATOM",
          instructions: ir,
          dataType: "$"+$var.toLowerCase(),
          loc: @1,
          totalLoc: @1
        }; 
      %}
  | parameteredCall 
    %{ 
      const callIR = $parameteredCall;
      const callData = callIR[0][1];
      $$ = {
        operation: "ATOM",
        instructions: [...callIR, ['LRET']],
        dataType: "$"+callData.target,
        loc: @1,
        totalLoc: @1
      }
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
    { $$ = [['LOAD',  $int_literal]]; }
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
