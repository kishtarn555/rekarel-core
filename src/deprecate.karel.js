
function detectLanguage(code) {
  var rules = [
    /^\s+/,
    /^\/\/[^\n]*/,
    /^#[^\n]*/,
    /^(?:\/\*(?:[^*]|\*[^)])*\*\/)/,
    /^{[^}]*}/,
    /^\(\*([^*]|\*[^)])*\*\)/,
    /^[^a-zA-Z0-9_-]+/,
    /^[a-zA-Z0-9_-]+/,
  ];
  var i = 0;

  while (i < code.length) {
    for (var j = 0; j < rules.length; j++) {
      var m = rules[j].exec(code.substring(i));
      if (m !== null) {
        if (j == rules.length - 1) {
          // el primer token de verdad.
          if (m[0] == 'class') {
            return 'java';
          } else if (m[0].toLowerCase() == 'iniciar-programa') {
            return 'pascal';
          } else {
            return 'ruby';
          }
        } else {
          // comentario o no-token.
          i += m[0].length;
          break;
        }
      }
    }
  }

  return 'none';
}

// !!! MODS TO FILE
import { javaParser } from './kareljava.js';
import { pascalParser } from './karelpascal.js';

function compile(code) {
  var lang = detectLanguage(code);
  var parser = null;

  switch (lang) {
    case 'java':
      parser = javaParser;
      break;

    case 'pascal':
      parser = pascalParser;
      break;


    default:
      return null;
  }

  return parser(code);
}


export { World, detectLanguage, compile, javaParser, pascalParser };
