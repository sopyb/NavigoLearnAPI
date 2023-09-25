/*
  The following regular expressions are derived from
  the 'badwords' project by 'mogade':
  https://github.com/mogade/badwords

  Their work is licensed under
  the Creative Commons Attribution 3.0 Unported License:
  http://creativecommons.org/licenses/by/3.0/
 */
const words = [
  /^[a@][s\\$][s\\$]$/,
  /[a@][s\\$][s\\$]h[o0][l1][e3][s\\$]?/,
  /b[a@][s\\$][t\\+][a@]rd/,
  /b[e3][a@][s\\$][t\\+][i1][a@]?[l1]([i1][t\\+]y)?/,
  /b[e3][a@][s\\$][t\\+][i1][l1][i1][t\\+]y/,
  /b[e3][s\\$][t\\+][i1][a@][l1]([i1][t\\+]y)?/,
  /b[i1][t\\+]ch[s\\$]?/,
  /b[i1][t\\+]ch[e3]r[s\\$]?/,
  /b[i1][t\\+]ch[e3][s\\$]/,
  /b[i1][t\\+]ch[i1]ng?/,
  /b[l1][o0]wj[o0]b[s\\$]?/,
  /c[l1][i1][t\\+]/,
  /^(c|k|ck|q)[o0](c|k|ck|q)[s\\$]?$/,
  /(c|k|ck|q)[o0](c|k|ck|q)[s\\$]u/,
  /(c|k|ck|q)[o0](c|k|ck|q)[s\\$]u(c|k|ck|q)[e3]d/,
  /(c|k|ck|q)[o0](c|k|ck|q)[s\\$]u(c|k|ck|q)[e3]r/,
  /(c|k|ck|q)[o0](c|k|ck|q)[s\\$]u(c|k|ck|q)[i1]ng/,
  /(c|k|ck|q)[o0](c|k|ck|q)[s\\$]u(c|k|ck|q)[s\\$]/,
  /^cum[s\\$]?$/,
  /cumm??[e3]r/,
  /cumm?[i1]ngcock/,
  /(c|k|ck|q)um[s\\$]h[o0][t\\+]/,
  /(c|k|ck|q)un[i1][l1][i1]ngu[s\\$]/,
  /(c|k|ck|q)un[i1][l1][l1][i1]ngu[s\\$]/,
  /(c|k|ck|q)unn[i1][l1][i1]ngu[s\\$]/,
  /(c|k|ck|q)un[t\\+][s\\$]?/,
  /(c|k|ck|q)un[t\\+][l1][i1](c|k|ck|q)/,
  /(c|k|ck|q)un[t\\+][l1][i1](c|k|ck|q)[e3]r/,
  /(c|k|ck|q)un[t\\+][l1][i1](c|k|ck|q)[i1]ng/,
  /cyb[e3]r(ph|f)u(c|k|ck|q)/,
  /d[a@]mn/,
  /d[i1]ck/,
  /d[i1][l1]d[o0]/,
  /d[i1][l1]d[o0][s\\$]/,
  /d[i1]n(c|k|ck|q)/,
  /d[i1]n(c|k|ck|q)[s\\$]/,
  /[e3]j[a@]cu[l1]/,
  /(ph|f)[a@]g[s\\$]?/,
  /(ph|f)[a@]gg[i1]ng/,
  /(ph|f)[a@]gg?[o0][t\\+][s\\$]?/,
  /(ph|f)[a@]gg[s\\$]/,
  /(ph|f)[e3][l1][l1]?[a@][t\\+][i1][o0]/,
  /(ph|f)u(c|k|ck|q)/,
  /(ph|f)u(c|k|ck|q)[s\\$]?/,
  /g[a@]ngb[a@]ng[s\\$]?/,
  /g[a@]ngb[a@]ng[e3]d/,
  /g[a@]y/,
  /h[o0]m?m[o0]/,
  /h[o0]rny/,
  /j[a@](c|k|ck|q)\\-?[o0](ph|f)(ph|f)?/,
  /j[e3]rk\\-?[o0](ph|f)(ph|f)?/,
  /j[i1][s\\$z][s\\$z]?m?/,
  /[ck][o0]ndum[s\\$]?/,
  /mast(e|ur)b(8|ait|ate)/,
  /n+[i1]+[gq]+[e3]*r+[s\\$]*/,
  /[o0]rg[a@][s\\$][i1]m[s\\$]?/,
  /[o0]rg[a@][s\\$]m[s\\$]?/,
  /p[e3]nn?[i1][s\\$]/,
  /p[i1][s\\$][s\\$]/,
  /p[i1][s\\$][s\\$][o0](ph|f)(ph|f)/,
  /p[o0]rn/,
  /p[o0]rn[o0][s\\$]?/,
  /p[o0]rn[o0]gr[a@]phy/,
  /pr[i1]ck[s\\$]?/,
  /pu[s\\$][s\\$][i1][e3][s\\$]/,
  /pu[s\\$][s\\$]y[s\\$]?/,
  /[s\\$][e3]x/,
  /[s\\$]h[i1][t\\+][s\\$]?/,
  /[s\\$][l1]u[t\\+][s\\$]?/,
  /[s\\$]mu[t\\+][s\\$]?/,
  /[s\\$]punk[s\\$]?/,
  /[t\\+]w[a@][t\\+][s\\$]?/,
];

export default words.map((pattern) => new RegExp(pattern, 'gi'));