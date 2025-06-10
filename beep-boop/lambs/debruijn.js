/* globals
  Match Exp
*/

const DeBruijn = (() => {
  const unnameVar = (env, n) => {
    const i = env.findIndex((x) => n === x);
    return i < 0 ? n : i + 1;
  };
  const unnameVars = (exp) => {
    const halp = (env, exp) =>
      exp.match({
        Var: (n) => new Exp.Var(unnameVar(env, n)),
        BadVar: (n) => new Exp.BadVar(unnameVar(env, n)),
        Lam: (p, b) => new Exp.Lam(p, halp([p, ...env], b)),
        App: (f, a) => new Exp.App(halp(env, f), halp(env, a)),
        default: (x) => x,
      });
    return halp([], exp);
  };

  const pstring = (s) => `(${s})`;

  const argstring = Match.matchf({
    Var: (n) => `${n}`,
    BadVar: (n) => `?${n}`,
    Missing: () => "_",
    default: (x) => pstring(unparse(x)),
  });

  const fstring = (x) =>
    x.match({ Lam: (p, b) => pstring(unparse(x)), default: (u) => unparse(x) });

  const unparse = Match.matchf({
    BadVar: (n) => `?${n}`,
    Missing: () => "_",
    Bad: (x) => `${x}`,
    Var: (n) => `${n}`,
    Lam: (p, b) => `λ${unparse(b)}`,
    App: (f, a) => `${fstring(f)} ${argstring(a)}`,
  });

  return { unnameVars: unnameVars, unparse: unparse };
})();
