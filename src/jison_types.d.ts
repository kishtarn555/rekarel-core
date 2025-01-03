// Declare the Parser class
declare class Parser {
  yy: Record<string, any>; // Object for custom parser data, FIXME: specify the structure if known

  trace: () => void;

  symbols_: Record<string, number>; // Associative list: name => number
  terminals_: Record<number, string>; // Associative list: number => name
  productions_: any[]; // FIXME: Specify array structure if known

  performAction: (
    yytext: string,
    yyleng: number,
    yylineno: number,
    yy: any,
    yystate: number,
    $$: any[],
    _$: any
  ) => void; // Main parser logic, FIXME: add detailed types

  table: any[]; // FIXME: Define structure if known
  defaultActions: Record<number, any>; // Default parsing actions, FIXME: clarify type

  parseError: (str: string, hash: any) => void; // Handles parsing errors
  parse: (input: string) => any; // Parses input, returns result

  lexer: {
    EOF: number;
    parseError: (str: string, hash: any) => void;

    setInput: (input: string) => void;
    input: () => string;
    unput: (str: string) => void;
    more: () => void;
    less: (n: number) => void;
    pastInput: () => string;
    upcomingInput: () => string;
    showPosition: () => string;

    test_match: (regex_match_array: RegExpMatchArray, rule_index: number) => any; // FIXME: clarify return type
    next: () => any; // FIXME: clarify return type
    lex: () => any; // Returns next token, FIXME: clarify return type
    begin: (condition: string) => void;
    popState: () => string;
    _currentRules: () => any; // FIXME: clarify return type
    topState: () => string;
    pushState: (condition: string) => void;

    options: {
      ranges ?: boolean; // Token location info includes .range[]
      flex ?: boolean; // Longest match
      backtrack_lexer ?: boolean; // Regexes tested in order
    };

    performAction: (
      yy: any,
      yy_: any,
      $avoiding_name_collisions: any,
      YY_START: any
    ) => void; // Lexer action logic, FIXME: clarify types

    rules: any[]; // Lexer rules, FIXME: clarify structure
    conditions: Record<string, any>; // Conditions map, FIXME: clarify type
  };
}
export { Parser };