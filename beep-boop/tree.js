/* globals
  Parse
  Match
  BeepBoop
  DeBruijn
  */

const Tree = (() => {
  const node = (stuff, children) => ({ stuff: stuff, children: children });

  const svgNS = "http://www.w3.org/2000/svg";

  const leaves = Match.matchf({
    Var: (n) => 1,
    Lam: (p, b) => leaves(b),
    App: (a, f) => leaves(a) + leaves(f),
  });
  const depth = Match.matchf({
    Var: (n) => 1,
    Lam: (p, b) => 1 + depth(b),
    App: (a, f) => Math.max(depth(a), depth(f)),
  });

  const draw = (parentSvg, exp) => {
    const space = document.createElementNS(svgNS, "text");
    space.textContent = "MM";
    parentSvg.appendChild(space);
    const spacew = space.getBoundingClientRect().width;
    const spaceh = space.getBoundingClientRect().height;
    space.remove();

    const text = (p, s) => {
      const t = document.createElementNS(svgNS, "text");
      p.appendChild(t);
      t.textContent = `${s}`;
      const rect = t.getBoundingClientRect();
      t.setAttribute("x", 0);
      t.setAttribute("y", `${rect.height}`);
      return coords(t);
    };

    const coords = (el, x) => {
      const r = el.getBoundingClientRect();
      return { el: el, w: r.width, h: r.height };
    };

    const line = (parent, x1, y1, x2, y2) => {
      const l = document.createElementNS(svgNS, "line");
      parent.appendChild(l);
      const extra = spaceh * 0.3;
      l.setAttribute("x1", `${x1}`);
      l.setAttribute("y1", `${y1 + extra}`);
      l.setAttribute("x2", `${x2}`);
      l.setAttribute("y2", `${y2 + extra * 2}`);
      l.setAttribute("stroke", "black");
    };

    const translate = (el, x, y) =>
      el.setAttribute("transform", `translate(${x} ${y})`);

    const halp = (par, node) => {
      if (node.children.length === 0) {
        return text(par, node.stuff);
      }
      const g = document.createElementNS(svgNS, "g");
      par.appendChild(g);
      const tr = text(g, node.stuff);
      const cg = document.createElementNS(svgNS, "g");
      const transy = tr.h + spaceh;
      g.appendChild(cg);
      const crs = node.children.map((c) => halp(cg, c));
      const cw =
        crs.reduce((sum, c) => sum + c.w, 0) + (crs.length - 1) * spacew;
      let topx;
      let botx;
      if (tr.w < cw) {
        topx = cw / 2 - tr.w / 2;
        botx = 0;
        translate(tr.el, topx, 0);
        translate(cg, 0, transy);
      } else {
        topx = 0;
        botx = tr.w / 2 - cw / 2;
        translate(cg, botx, transy);
      }
      if (crs.length === 1) {
        topx = topx + tr.w / 2;
      }
      const topxstep = tr.w / (crs.length - 1);
      for (const cr of crs) {
        translate(cr.el, botx, 0);
        line(g, topx, tr.h, botx + cr.w / 2, transy);
        topx = topx + topxstep;
        botx = botx + cr.w + spacew;
      }
      return coords(g);
    };

    const res = halp(parentSvg, exp);
    parentSvg.setAttribute("width", `${res.w + spacew}`);
    parentSvg.setAttribute("height", `${res.h + spaceh}`);
  };

  const beops = (svg, bs) => {
    let i = 0;
    const read = () => {
      if (i >= bs.length) {
        return Tree.node("", []);
      }
      if (bs[i] === "beep") {
        i++;
        return Tree.node("beep", [read()]);
      }
      if (bs[i] === "boop") {
        let str = "boop";
        for (i++; i < bs.length; i++) {
          if (bs[i] === "boop") {
            str = str + " boop";
          } else if (bs[i] === "bap") {
            i++;
            return Tree.node(str + " bap", []);
          } else {
            i++;
            return Tree.node(str + " ??" + bs[i] + "??", []);
          }
        }
        return Tree.node(str, []);
      }
      if (bs[i] === "pling") {
        i++;
        return Tree.node("pling", [read(), read()]);
      }
      i++;
      return Tree.node("??" + bs[i] + "??", []);
    };
    Tree.draw(svg, read());
  };
  
  const lambs = (svg, exp) => {
    const halp = Match.matchf({
      Var: (n) => node(n, []),
      BadVar: (n) => node(`?${n}`, []),
      Bad: (s) => node(s, []),
      Lam: (p, b) => node(`λ${p}.`, [halp(b)]),
      App: (f, a) => node("app", [halp(f), halp(a)]),
      Missing: () => node("", []),
    });
    Tree.draw(svg, halp(exp));
  };
  
  const bru = (svg, exp) => {
    const halp = Match.matchf({
      Var: (n) => node(n, []),
      BadVar: (n) => node(`?${n}`, []),
      Bad: (s) => node(s, []),
      Lam: (p, b) => node("λ", [halp(b)]),
      App: (f, a) => node("app", [halp(f), halp(a)]),
      Missing: () => node("", []),
    });
    Tree.draw(svg, halp(exp));
  };

  return { draw: draw, beops: beops, lambs: lambs, bru: bru, node: node };
})();
