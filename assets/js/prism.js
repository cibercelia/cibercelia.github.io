/* PrismJS 1.29.0 Core & Languages: markup, css, clike, javascript, bash, python, yaml, json, markdown */
var _self = typeof window !== 'undefined' ? window : (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope ? self : {});
var Prism = (function(_self){
  var lang = /(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i;
  var uniqueId = 0;
  var _ = {
    manual: _self.Prism && _self.Prism.manual,
    disableWorkerMessageHandler: _self.Prism && _self.Prism.disableWorkerMessageHandler,
    util: {
      encode: function encode(tokens) {
        if (tokens instanceof Token) {
          return new Token(tokens.type, encode(tokens.content), tokens.alias);
        } else if (Array.isArray(tokens)) {
          return tokens.map(encode);
        } else {
          return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
        }
      },
      type: function (o) {
        return Object.prototype.toString.call(o).slice(8, -1);
      },
      objId: function (obj) {
        if (!obj['__id']) {
          Object.defineProperty(obj, '__id', { value: ++uniqueId });
        }
        return obj['__id'];
      },
      clone: function deepClone(o, visited) {
        visited = visited || {};
        var clone; var id;
        switch (_.util.type(o)) {
          case 'Object':
            id = _.util.objId(o);
            if (visited[id]) return visited[id];
            clone = {};
            visited[id] = clone;
            for (var key in o) {
              if (o.hasOwnProperty(key)) {
                clone[key] = deepClone(o[key], visited);
              }
            }
            return clone;
          case 'Array':
            id = _.util.objId(o);
            if (visited[id]) return visited[id];
            clone = [];
            visited[id] = clone;
            o.forEach(function (v, i) {
              clone[i] = deepClone(v, visited);
            });
            return clone;
          default:
            return o;
        }
      }
    },
    languages: {
      plain: {},
      plaintext: {},
      text: {},
      txt: {}
    },
    plugins: {},
    highlightAll: function(async, callback) {
      _.highlightAllUnder(document, async, callback);
    },
    highlightAllUnder: function(container, async, callback) {
      var env = {
        callback: callback,
        container: container,
        selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
      };
      var elements = env.container.querySelectorAll(env.selector);
      for (var i = 0, element; (element = elements[i++]); ) {
        _.highlightElement(element, async === true, env.callback);
      }
    },
    highlightElement: function(element, async, callback) {
      var language = _.util.getLanguage(element);
      var grammar = _.languages[language];
      element.className = element.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;
      var parent = element.parentElement;
      if (parent && parent.nodeName.toLowerCase() === 'pre') {
        parent.className = parent.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;
      }
      var code = element.textContent;
      var env = {
        element: element,
        language: language,
        grammar: grammar,
        code: code
      };
      if (!grammar) {
        env.highlightedCode = _.util.encode(code);
      } else {
        env.highlightedCode = _.highlight(code, grammar, language);
      }
      element.innerHTML = env.highlightedCode;
      if (callback) callback.call(element);
    },
    highlight: function(text, grammar, language) {
      var env = {
        code: text,
        grammar: grammar,
        language: language
      };
      var tokens = _.tokenize(env.code, env.grammar);
      return Token.stringify(_.util.encode(tokens), env.language);
    },
    tokenize: function(text, grammar) {
      var rest = grammar.rest;
      if (rest) {
        for (var token in rest) {
          grammar[token] = rest[token];
        }
        delete grammar.rest;
      }
      var tokenList = new LinkedList();
      addAfter(tokenList, tokenList.head, text);
      matchGrammar(text, tokenList, grammar, tokenList.head, 0);
      return toArray(tokenList);
    }
  };

  function Token(type, content, alias, matchedStr) {
    this.type = type;
    this.content = content;
    this.alias = alias;
    this.length = (matchedStr || '').length | 0;
  }
  Token.stringify = function stringify(o, language) {
    if (typeof o == 'string') {
      return o;
    }
    if (Array.isArray(o)) {
      var s = '';
      for (var i = 0; i < o.length; i++) {
        s += stringify(o[i], language);
      }
      return s;
    }
    var env = {
      type: o.type,
      content: stringify(o.content, language),
      tag: 'span',
      classes: ['token', o.type],
      attributes: {},
      language: language
    };
    var alias = o.alias;
    if (alias) {
      if (Array.isArray(alias)) {
        Array.prototype.push.apply(env.classes, alias);
      } else {
        env.classes.push(alias);
      }
    }
    var attributes = '';
    for (var name in env.attributes) {
      attributes += ' ' + name + '="' + (env.attributes[name] || '').replace(/"/g, '&quot;') + '"';
    }
    return '<' + env.tag + ' class="' + env.classes.join(' ') + '"' + attributes + '>' + env.content + '</' + env.tag + '>';
  };

  function matchPattern(pattern, pos, text, lookbehind) {
    pattern.lastIndex = pos;
    var match = pattern.exec(text);
    if (match && lookbehind && match[1]) {
      var lookbehindLength = match[1].length;
      match.index += lookbehindLength;
      match[0] = match[0].slice(lookbehindLength);
    }
    return match;
  }

  function matchGrammar(text, tokenList, grammar, startNode, startPos, rematch) {
    for (var token in grammar) {
      if (!grammar.hasOwnProperty(token) || !grammar[token]) continue;
      var patterns = grammar[token];
      patterns = Array.isArray(patterns) ? patterns : [patterns];
      for (var j = 0; j < patterns.length; ++j) {
        if (rematch && rematch.cause == token + ',' + j) return;
        var patternObj = patterns[j];
        var inside = patternObj.inside;
        var lookbehind = !!patternObj.lookbehind;
        var greedy = !!patternObj.greedy;
        var alias = patternObj.alias;
        var pattern = patternObj.pattern || patternObj;
        for (var currentNode = startNode.next, pos = startPos; currentNode !== tokenList.tail; pos += currentNode.value.length, currentNode = currentNode.next) {
          if (rematch && pos >= rematch.reach) break;
          var str = currentNode.value;
          if (tokenList.length > text.length) return;
          if (str instanceof Token) continue;
          var match;
          if (greedy) {
            match = matchPattern(pattern, pos, text, lookbehind);
            if (!match || match.index >= text.length) break;
            var from = match.index;
            var to = match.index + match[0].length;
            var p = pos;
            p += currentNode.value.length;
            while (from >= p) {
              currentNode = currentNode.next;
              p += currentNode.value.length;
            }
            p -= currentNode.value.length;
            pos = p;
            if (currentNode.value instanceof Token) continue;
            for (var k = currentNode; k !== tokenList.tail && (p < to || typeof k.value === 'string'); k = k.next) {
              p += k.value.length;
            }
            str = text.slice(pos, p);
            match.index -= pos;
          } else {
            match = matchPattern(pattern, 0, str, lookbehind);
            if (!match) continue;
          }
          var from = match.index;
          var matchStr = match[0];
          var before = str.slice(0, from);
          var after = str.slice(from + matchStr.length);
          var reach = pos + str.length;
          if (before) {
            currentNode = addAfter(tokenList, currentNode, before);
            pos += before.length;
          }
          removeRange(tokenList, currentNode.next, reach);
          var wrapped = new Token(token, inside ? _.tokenize(matchStr, inside) : matchStr, alias, matchStr);
          currentNode = addAfter(tokenList, currentNode, wrapped);
          if (after) {
            addAfter(tokenList, currentNode, after);
          }
        }
      }
    }
  }

  function LinkedList() {
    var head = { value: null, prev: null, next: null };
    var tail = { value: null, prev: head, next: null };
    head.next = tail;
    this.head = head;
    this.tail = tail;
    this.length = 0;
  }
  function addAfter(list, node, value) {
    var next = node.next;
    var newNode = { value: value, prev: node, next: next };
    node.next = newNode;
    next.prev = newNode;
    list.length++;
    return newNode;
  }
  function removeRange(list, node, to) {
    var next = node.next;
    var i = 0;
    for (; next !== null && i < to; i++, next = next.next) {}
    node.next = next;
    if (next) next.prev = node;
    list.length -= i;
  }
  function toArray(list) {
    var array = [];
    var node = list.head.next;
    while (node !== list.tail) {
      array.push(node.value);
      node = node.next;
    }
    return array;
  }

  _.util.getLanguage = function (element) {
    while (element) {
      var m = lang.exec(element.className);
      if (m) return m[1].toLowerCase();
      element = element.parentElement;
    }
    return 'plaintext';
  };

  return _;
})(_self);

/* Languages definition */
Prism.languages.clike = {
  'comment': [{ pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/, lookbehind: true, greedy: true }, { pattern: /(^|[^\\:])\/\/.*/, lookbehind: true, greedy: true }],
  'string': { pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/, greedy: true },
  'keyword': /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
  'boolean': /\b(?:true|false)\b/,
  'function': /\b\w+(?=\()/,
  'number': /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
  'operator': /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
  'punctuation': /[{}[\];(),.:]/
};

Prism.languages.javascript = Prism.languages.extend('clike', {
  'keyword': /\b(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/
});

Prism.languages.bash = {
  'comment': { pattern: /(^|[\s#])#.*$/m, lookbehind: true },
  'string': { pattern: /(["'])(?:\\[\s\S]|\$\([^)]+\)|\$(?!\()|`[^`]+`|(?!\1)[^\\`$])*\1/, greedy: true },
  'variable': /\$([a-zA-Z0-9_]+|\{[^}]+\})/,
  'function': /\b(?:docker|nmap|git|sudo|apt|chmod|chown|systemctl|cat|grep|curl|wget|ssh|nc|wireshark|metasploit|python|python3|pip|bash|sh)\b/,
  'keyword': /\b(?:if|then|else|elif|fi|for|while|in|do|done|case|esac|return|exit|function)\b/,
  'boolean': /\b(?:true|false)\b/,
  'operator': /&&?|\|\|?|>>?|<|==?|!=/,
  'punctuation': /[{}[\];(),]/
};
Prism.languages.sh = Prism.languages.bash;
Prism.languages.shell = Prism.languages.bash;

Prism.languages.yaml = {
  'comment': /#.*$/m,
  'key': /(?:^\s*|\s+)(?:[\w.-]+)(?=\s*:)/m,
  'string': { pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/, greedy: true },
  'boolean': /\b(?:true|false|yes|no)\b/i,
  'number': /\b\d+(?:\.\d+)?\b/,
  'punctuation': /[:-]/
};
Prism.languages.yml = Prism.languages.yaml;

Prism.languages.json = {
  'property': { pattern: /(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?=\s*:)/, lookbehind: true, greedy: true },
  'string': { pattern: /(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?!\s*:)/, lookbehind: true, greedy: true },
  'comment': { pattern: /\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/, greedy: true },
  'number': /-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,
  'punctuation': /[{}[\],]/,
  'operator': /:/,
  'boolean': /\b(?:true|false)\b/,
  'null': /\bnull\b/
};

if (typeof window !== 'undefined') {
  window.Prism = Prism;
}
