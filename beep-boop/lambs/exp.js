/* globals
  Match
*/

const Exp = (() => {
  class Var {
    #name;
    constructor(name) {
      this.#name = name;
    }
    match(cases) {
      return Match.match("Var", this, [this.#name], cases);
    }
  }

  class Lam {
    #parameter;
    #body;
    constructor(parameter, body) {
      this.#parameter = parameter;
      this.#body = body;
    }
    match(cases) {
      return Match.match("Lam", this, [this.#parameter, this.#body], cases);
    }
  }
  class App {
    #function;
    #argument;
    constructor(fun, arg) {
      this.#function = fun;
      this.#argument = arg;
    }
    match(cases) {
      return Match.match("App", this, [this.#function, this.#argument], cases);
    }
  }

  class Bad {
    #stuff;
    constructor(stuff) {
      this.#stuff = stuff;
    }
    match(cases) {
      return Match.match("Bad", this, [this.#stuff], cases);
    }
  }
  class BadVar {
    #name;
    constructor(name) {
      this.#name = name;
    }
    match(cases) {
      return Match.match("BadVar", this, [this.#name], cases);
    }
  }
  
  class Missing {
    match(cases) {
      return Match.match("Missing", this, [], cases);
    }
  }

  const notBad = Match.matchf({
    Var: (v) => true,
    Lam: (p, b) => notBad(b),
    App: (f, a) => notBad(f) && notBad(a),
    Bad: (x) => false,
    BadVar: (v) => false,
    Missing: () => false,
  });

  const veryBad = Match.matchf({
    Var: (v) => false,
    Lam: (p, b) => veryBad(b),
    App: (f, a) => veryBad(f) || veryBad(a),
    Bad: (x) => true,
    BadVar: (v) => false,
    Missing: () => false,
  });

  return {
    Var: Var,
    Lam: Lam,
    App: App,
    Bad: Bad,
    BadVar: BadVar,
    Missing: new Missing(),
    notBad: notBad,
    veryBad: veryBad,
  };
})();
