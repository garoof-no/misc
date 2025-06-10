/* globals
  Unparse BeepBoop Exp Eval Maybe DeBruijn Rects Tree Sounds
*/

const Booper = (() => {
  let current = Maybe.Nope;

  class State {
    #exp;
    constructor(exp) {
      this.#exp = exp;
    }
    get exp() {
      return this.#exp;
    }

    get bruijnExp() {
      return BeepBoop.bruparse(this.beops);
    }
    get bruijnText() {
      return DeBruijn.unparse(this.bruijnExp);
    }
    get namesExp() {
      return BeepBoop.nameVars(this.#exp);
    }
    get namesExpText() {
      return Unparse.unparse(this.namesExp);
    }
    get beops() {
      return BeepBoop.unparse(this.#exp);
    }
    get beopsText() {
      return this.beops.join(" ");
    }
  }

  class Booper {
    #state;
    #todo;
    constructor() {
      this.#todo = (exp) => {};
      this.#state = new State(Exp.Missing);
    }

    #refresh() {
      this.#todo.newState(this.#state);
    }

    setBeops(str) {
      this.#setState(new State(BeepBoop.parse(str.split(" "))));
    }

    #setState(state) {
      this.#state = state;
      this.#refresh();
    }

    get state() {
      return this.#state;
    }

    set todo(todo) {
      this.#todo = todo;
      this.#refresh();
    }

    add(beop) {
      this.#todo.playOne(beop);
      const next = BeepBoop.parse([...this.#state.beops, beop]);
      if (!Exp.veryBad(next)) {
        this.#setState(new State(next));
      }
    }

    undo() {
      this.#todo.playOne("undo");
      this.#setState(new State(BeepBoop.parse(this.#state.beops.slice(0, -1))));
    }

    next() {
      if (!Exp.notBad(this.#state.exp)) {
        return false;
      }

      return Eval.step(this.#state.exp).match({
        Normal: (exp) => {
          return false;
        },
        Reduce: (a, b) => {
          this.#setState(new State(b));
          return true;
        },
        Rename: (aV, aExp, bV, bExp) => {
          this.#setState(new State(bExp));
          return true;
        },
      });
    }
    
    nextCmd() {
      this.#todo.playOne("next");
      return this.next();
    }

    play() {
      this.#todo.play();
    }
  }

  const addControls = (booper, controls, useSound) => {
    for (const x of [
      ["beep", () => booper.add("beep")],
      ["boop", () => booper.add("boop")],
      ["bap", () => booper.add("bap")],
      ["pling", () => booper.add("pling")],
      ["⌫", () => booper.undo()],
      ["→", () => booper.nextCmd()],
      ...(useSound ? [["⏵", () => booper.play()]] : []),
            ["2 + 3", () => booper.setBeops("pling pling beep beep beep beep pling pling boop boop boop boop bap boop boop bap pling pling boop boop boop bap boop boop bap boop bap beep beep pling boop boop bap pling boop boop bap boop bap beep beep pling boop boop bap pling boop boop bap pling boop boop bap boop bap")]
    ]) {
      const button = document.createElement("button");
      controls.appendChild(button);
      button.innerText = x[0];
      button.addEventListener("click", () => {
        current = Maybe.Just(booper);
        x[1]();
      });
    }
  };

  const palette = (() => {
    const rnd = () => "#" + Math.floor(Math.random() * 16777215).toString(16);
    const set = new Map([
      ["a", "#f4bb2c"],
      ["b", "#c83b6a"],
      ["c", "#0c5993"],
      ["d", "#5bcb0e"],
      ["e", "#5f1534"],
      ["f", "#661da8"],
      ["g", "#d56cfa"],
      ["h", "#d40b25"],
      ["i", "#f48fa5"],
      ["j", "#84ad57"],
      ["missing", "#1bf2b7"],
    ]);
    return (i) => {
      if (!set.has(i)) {
        set.set(i, rnd());
      }
      return set.get(i);
    };
  })();

  const configure = (elem) => {
    const booper = new Booper();
    const attribs = new Set(elem.getAttributeNames());
    const showBeops = attribs.has("beops");
    const showBruijn = attribs.has("bruijn");
    const showLambs = attribs.has("lambs");
    const showFish = attribs.has("fish");
    const useSound = attribs.has("sound");
    elem.innerHTML = "";
    elem.booper = booper;
    const controls = document.createElement("p");
    elem.appendChild(controls);
    addControls(booper, controls, useSound);
    const beops = document.createElement("p");
    elem.appendChild(beops);

    const rects = attribs.has("rects")
      ? Maybe.Just(document.createElement("div"))
      : Maybe.Nope;
    rects.forEach((relem) => elem.appendChild(relem));

    const fish = attribs.has("fish")
      ? Maybe.Just(document.createElement("div"))
      : Maybe.Nope;
    fish.forEach((felem) => elem.appendChild(felem));

    const beopsTree = attribs.has("beops-tree")
      ? Maybe.Just(document.createElement("div"))
      : Maybe.Nope;
    beopsTree.forEach((telem) => elem.appendChild(telem));

    const lambsTree = attribs.has("lambs-tree")
      ? Maybe.Just(document.createElement("div"))
      : Maybe.Nope;
    lambsTree.forEach((telem) => elem.appendChild(telem));

    let stuff;

    booper.todo = {
      playOne: (beop) => {
        if (useSound) {
          Sounds.playStuff(
            [{ beops: [beop], start: () => {}, stop: () => {} }],
            () => {}
          );
        }
      },
      play: () => {
        if (!useSound) {
          return;
        }
        Sounds.playStuff(
          stuff.map((x) => ({
            beops: x.beops,
            start: () => {
              x.span.classList.add("green");
              for (const r of x.rects) {
                r.innerHTML = "";
                if (r.isConnected) {
                  Rects.anim(r).beginElement();
                }
              }
            },
            stop: () => x.span.classList.remove("green"),
          })),
          () => {
            if (booper.next()) {
              booper.play();
            }
          }
        );
      },
      newState: (state) => {
        beops.innerHTML = "";
        let first = true;
        const res = Rects.draw(state, 640, 640, palette);
        stuff = res.stuff;
        const br = () => {
          if (first) {
            first = false;
          } else {
            beops.appendChild(document.createElement("br"));
          }
        };
        if (showBeops) {
          br();
          beops.append(">");
          for (const x of res.stuff) {
            beops.append(" ");
            beops.appendChild(x.span);
          }
        }
        if (showBruijn) {
          br();
          beops.append(state.bruijnText);
        }
        if (showLambs) {
          br();
          beops.append(state.namesExpText);
        }
        rects.forEach((relem) => {
          relem.innerHTML = "";
          relem.appendChild(res.svg);
        });
        fish.forEach((felem) => {
          felem.innerHTML = "";
          const p = Magic.createPicture(Fish.fancy());
          const box = Box.create(
            Vector.create(300, 300),
            Vector.create(200, 0),
            Vector.create(0, 200)
          );
          const rs = FishLamb.picture(
            palette,
            p,
            state.namesExp
          )(Lens.create(box, Hue.create("black")));
          const svg = Svg.create(
            800,
            800,
            rs.map((r) => r.shape.toSvgElement(r.style))
          );
          felem.appendChild(svg);
        });

        beopsTree.forEach((telem) => {
          telem.innerHTML = "";
          const svg = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
          );
          telem.appendChild(svg);
          Tree.beops(svg, state.beops);
        });
        lambsTree.forEach((telem) => {
          telem.innerHTML = "";
          const svg = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
          );
          telem.appendChild(svg);
          Tree.lambs(svg, state.namesExp);
        });
      },
    };
    return booper;
  };

  return {
    Booper: Booper,
    configure: configure,
    current: () => current,
    setCurrent: (m) => (current = m),
  };
})();
