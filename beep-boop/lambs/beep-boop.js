/*
  globals
  Match
  Exp
*/

const BeepBoop = (() => {
  class Result {
    #value;
    #index;
    constructor(value, index) {
      this.#value = value;
      this.#index = index;
    }
    get value() {
      return this.#value;
    }
    get index() {
      return this.#index;
    }
    map(f) {
      return f(this.#value, this.#index);
    }
  }

  const parse = (arr) => {
    const halp = (arrIdx, varIdx) => {
      if (arrIdx >= arr.length) {
        return new Result(Exp.Missing, arrIdx);
      }
      const x = arr[arrIdx];
      if (x === "beep") {
        return halp(arrIdx + 1, varIdx + 1).map(
          (res, idx) => new Result(new Exp.Lam(varIdx, res), idx)
        );
      } else if (x === "boop") {
        var idx = arrIdx + 1;
        var ref = varIdx - 1;
        while (arr[idx] === "boop") {
          idx = idx + 1;
          ref = ref - 1;
        }
        if (idx >= arr.length) {
          return new Result(new Exp.BadVar(ref), idx);
        } else if (arr[idx] !== "bap") {
          return new Result(new Exp.Bad("bad_boop_" + arr[idx]), idx);
        } else {
          return new Result(new Exp.Var(ref), idx + 1);
        }
      } else if (x === "pling") {
        return halp(arrIdx + 1, varIdx).map((fun, argIdx) =>
          halp(argIdx, varIdx).map(
            (arg, idx) => new Result(new Exp.App(fun, arg), idx)
          )
        );
      } else {
        return new Result(new Exp.Bad("bad_" + x), idx);
      }
    };
    return halp(0, 0).value;
  };

  const bruparse = (bs) => {
    let i = 0;
    const read = () => {
      if (i >= bs.length) {
        return Exp.Missing;
      }
      if (bs[i] === "beep") {
        i++;
        return new Exp.Lam("", read());
      }
      if (bs[i] === "boop") {
        let n = 1;
        for (i++; i < bs.length; i++) {
          const s = bs[i];
          if (s === "boop") {
            n++;
          } else if (s === "bap") {
            i++;
            return new Exp.Var(n);
          } else {
            i++;
            return new Exp.Bad(`${n}?${s}`);
          }
        }
        return new Exp.BadVar(n);
      }
      if (bs[i] === "pling") {
        i++;
        return new Exp.App(read(), read());
      }
      i++;
      return new Exp.Bad("??" + bs[i] + "??");
    };
    return read();
  };

  const unparse = (exp) => {
    const Cons = (a, d) => ({ a: a, d: d });
    const Nil = Symbol("Nil");
    const res = [];

    const addBoops = (num, vars) => {
      res.push("boop");
      var current = vars;
      while (current !== Nil) {
        if (current.a === num) {
          return;
        }
        res.push("boop");
        current = current.d;
      }
      if (num < 0) {
        for (var i = num; i < -1; i++) {
          res.push("boop");
        }
      } else {
        res.push("boops?");
      }
    };

    const halp = (exp, vars) =>
      exp.match({
        Var: (num) => {
          addBoops(num, vars);
          res.push("bap");
        },
        BadVar: (num) => {
          addBoops(num, vars);
        },
        Lam: (p, b) => {
          res.push("beep");
          halp(b, Cons(p, vars));
        },
        App: (f, a) => {
          res.push("pling");
          halp(f, vars);
          halp(a, vars);
        },
        Missing: () => {},
        Bad: (s, idx) => res.push(s),
      });
    halp(exp, Nil);
    return res;
  };

  const varNameForNum = (num) => {
    if (num < 0) {
      return "*" + varNameForNum(-num - 1);
    }
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    var res = [alphabet[num % alphabet.length]];
    var i = Math.floor(num / alphabet.length) - 1;
    if (i < 0) {
      return res.join("");
    }

    while (true) {
      res.unshift(alphabet[i % alphabet.length]);
      i = Math.floor(i / alphabet.length) - 1;
      if (i < 0) {
        return res.join("");
      }
    }
  };

  const nameVars = Match.matchf({
    Lam: (p, b) => new Exp.Lam(varNameForNum(p), nameVars(b)),
    Var: (v) => new Exp.Var(varNameForNum(v)),
    BadVar: (v) => new Exp.BadVar(varNameForNum(v)),
    App: (f, a) => new Exp.App(nameVars(f), nameVars(a)),
    default: (x) => x,
  });

  return {
    parse: parse,
    unparse: unparse,
    bruparse: bruparse,
    nameVars: nameVars,
  };
})();
