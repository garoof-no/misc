/* globals Match Exp Maybe */
let an;
const Rects = (() => {
  const colorsHtml = (arr) => {
    const existing = document.getElementById("colors");
    let div;
    if (existing === null) {
      div = document.createElement("div");
      document.body.appendChild(div);
    } else {
      div = existing;
      div.innerHTML = "";
    }
    div.setAttribute("id", "colors");
    for (const x of arr) {
      const input = document.createElement("input");
      div.appendChild(input);
      input.setAttribute("type", "color");
      input.value = x;
    }
  };

  const svgNS = "http://www.w3.org/2000/svg";

  const anim = (svgElement) => {
    const animate = document.createElementNS(svgNS, "animate");
    animate.setAttribute("attributeName", "fill");
    animate.setAttribute("from", "#FFFFFF");
    animate.setAttribute("to", svgElement.getAttribute("fill"));
    animate.setAttribute("dur", "1s");
    //animate.setAttribute("repeatCount","1");
    svgElement.appendChild(animate);
    an = animate;
    return animate;
  };

  const missing = Symbol("Missing");
  const bad = Symbol("Bad");

  const isMissing = Match.matchf({
    Missing: (u) => true,
    default: (u) => false,
  });

  const draw = (state, w, h, palette) => {
    const svg = document.createElementNS(svgNS, "svg");
    let anims = [];
    let stahp = false;
    const setAnims = (l, stp) => {
      if (stahp) {
        return;
      }
      anims = l;
      stahp = stp;
    };
    const rect = (x, y, w, h, i) => {
      var rect = document.createElementNS(svgNS, "rect");
      rect.setAttribute("x", x);
      rect.setAttribute("y", y);
      rect.setAttribute("width", w);
      rect.setAttribute("height", h);
      rect.setAttribute("fill", palette(i));
      rect.setAttribute("stroke", "black");
      svg.appendChild(rect);
      return rect;
    };
    const bs = state.beops;
    let bidx = 0;
    const beep = () => {
      if (bs[bidx] !== "beep") {
        throw "oh no";
      }
      bidx++;
      return ["beep"];
    };
    const pling = () => {
      if (bs[bidx] !== "pling") {
        throw "oh no";
      }
      bidx++;
      return ["pling"];
    };
    const boops = () => {
      if (bs[bidx] !== "boop") {
        throw "oh no";
      }
      const res = ["boop"];
      for (bidx++; bidx < bs.length; bidx++) {
        const next = bs[bidx];
        if (next === "bap") {
          bidx++;
          res.push("bap");
          return res;
        } else if (next === "boop") {
          res.push("boop");
        } else {
          throw "oh no";
        }
      }
      return res;
    };
    
    const list = [];
    const add = (beops, rects) => {
      const span = document.createElement("span");
      span.innerText = beops.join(" ");
      list.push({ beops: beops, rects: rects, span: span });
    };
    const halp = (exp, x, y, w, h) =>
      exp.match({
        Lam: (p, b) => {
          const split = h * 0.2;
          const pr = rect(x, y, w, split, p);
          if (isMissing(b)) {
            setAnims([pr], true);
          }
          add(beep(), [pr]);
          halp(b, x, y + split, w, h - split);
        },
        Var: (v) => {
          const r = rect(x, y, w, h, v);
          setAnims([r], false);
          add(boops(), [r]);
        },
        BadVar: (v) => {
          const r = rect(x, y, w, h, v);
          setAnims([r], false);
          add(boops(), [r]);
        },
        App: (f, a) => {
          const str = pling();
          const l = [];
          add(str, l);
          const split = w * 0.5;
          const fr = halp(f, x, y, split, h);
          const ar = halp(a, x + split, y, w - split, h);
          if (isMissing(f) && isMissing(a)) {
            setAnims([fr, ar], true);
            l.push(fr);
            l.push(ar);
          }
        },
        Missing: () => rect(x, y, w, h, "missing"),
        Bad: (b) => rect(x, y, w, h, bad),
      });
    halp(state.namesExp, 0, 0, w, h);
    for (const r of anims) {
      anim(r);
    }
    svg.setAttribute("width", w);
    svg.setAttribute("height", h);
    return { svg: svg, stuff: list };
  };

  return {
    draw: draw,
    anim: anim,
  };
})();
