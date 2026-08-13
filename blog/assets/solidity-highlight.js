// Minimal Solidity syntax highlighter. No external dependencies.
// Tokenizes text content of <pre><code class="language-solidity"> blocks
// and wraps recognized tokens in <span class="tok-*"> for CSS coloring.
(function () {
  var KEYWORDS = new Set([
    'pragma', 'solidity', 'contract', 'interface', 'library', 'abstract', 'is', 'import', 'using', 'for',
    'function', 'modifier', 'event', 'error', 'struct', 'enum', 'mapping', 'constructor', 'fallback', 'receive',
    'public', 'private', 'internal', 'external', 'pure', 'view', 'payable', 'constant', 'immutable', 'override', 'virtual',
    'returns', 'return', 'if', 'else', 'while', 'do', 'break', 'continue', 'emit', 'revert', 'require', 'assert',
    'memory', 'storage', 'calldata', 'indexed', 'anonymous', 'new', 'delete', 'try', 'catch', 'throw',
    'assembly', 'let', 'unchecked', 'this', 'super', 'type', 'as', 'from', 'global',
    'true', 'false', 'wei', 'gwei', 'ether', 'seconds', 'minutes', 'hours', 'days', 'weeks', 'years'
  ]);

  var TYPE_RE = /^(address|bool|string|bytes([1-9]|[12][0-9]|3[0-2])?|u?int(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?)$/;

  var BUILTINS = new Set([
    'msg', 'block', 'tx', 'abi', 'keccak256', 'sha256', 'ripemd160', 'ecrecover', 'addmod', 'mulmod',
    'selfdestruct', 'blockhash', 'gasleft', 'sender', 'value', 'data', 'sig', 'origin',
    'timestamp', 'number', 'difficulty', 'gaslimit', 'chainid', 'basefee', 'coinbase', 'encode', 'encodePacked',
    'decode', 'encodeWithSelector', 'encodeWithSignature', 'call', 'delegatecall', 'staticcall',
    'send', 'transfer', 'balance', 'code', 'codehash', 'slot', 'offset', 'push', 'pop', 'erc7201'
  ]);

  var TOKEN_RE = /(\/\/[^\n]*)|(\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(\b0x[0-9a-fA-F]+\b|\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b)|([A-Za-z_$][A-Za-z0-9_$]*)/g;

  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function highlight(src) {
    var out = '';
    var last = 0;
    var m;
    TOKEN_RE.lastIndex = 0;
    while ((m = TOKEN_RE.exec(src))) {
      out += escapeHtml(src.slice(last, m.index));
      var full = m[0], comment = m[1], block = m[2], str = m[3], num = m[4], word = m[5];
      if (comment || block) {
        out += '<span class="tok-comment">' + escapeHtml(full) + '</span>';
      } else if (str) {
        out += '<span class="tok-string">' + escapeHtml(full) + '</span>';
      } else if (num) {
        out += '<span class="tok-number">' + escapeHtml(full) + '</span>';
      } else if (word) {
        if (KEYWORDS.has(word)) {
          out += '<span class="tok-keyword">' + word + '</span>';
        } else if (TYPE_RE.test(word)) {
          out += '<span class="tok-type">' + word + '</span>';
        } else if (BUILTINS.has(word)) {
          out += '<span class="tok-builtin">' + word + '</span>';
        } else {
          out += word;
        }
      }
      last = TOKEN_RE.lastIndex;
    }
    out += escapeHtml(src.slice(last));
    return out;
  }

  function run() {
    document.querySelectorAll('pre code.language-solidity').forEach(function (el) {
      el.innerHTML = highlight(el.textContent);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
