import React from "react";

// Card titles and formulas arrive as plain strings, so they cannot carry
// <sub>/<sup> of their own. Turn "E_F", "d_k", "ω^(-1/2)" into real markup.
const TOKEN = /([A-Za-z0-9\u03c1\u03bc\u03b5\u03c3\u03bb\u03bd\u03c9\u03b7\u03b1\u03b2\u03b3\u03b4\u03b8\u03ba\u03c4\u03c6\u03c7\u03c8\u0394\u03a3\u03a8\u03a6\u03a9\u0393\u039b\u03a0\u0398)\]])([_^])(\{[^}]{1,14}\}|\([^)]{1,16}\)|[A-Za-z0-9+\-]{1,8})/g;

export default function fx(s) {
  if (typeof s !== "string" || !/[_^]/.test(s)) return s;
  const out = [];
  let last = 0, m, k = 0;
  TOKEN.lastIndex = 0;
  while ((m = TOKEN.exec(s)) !== null) {
    out.push(s.slice(last, m.index) + m[1]);
    const body = m[3].replace(/^[{(]|[})]$/g, "");
    out.push(m[2] === "_" ? <sub key={k++}>{body}</sub> : <sup key={k++}>{body}</sup>);
    last = m.index + m[0].length;
  }
  out.push(s.slice(last));
  return out;
}
