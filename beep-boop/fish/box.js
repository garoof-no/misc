const Box = (() => {
  const create = (a, b, c) => {
    return ({
      what: "box",
      a: () => a,
      b: () => b,
      c: () => c,
      turn: () => create(a.add(b), c, b.neg()),
      flip: () => create(a.add(b), b.neg(), c),
      toss: () => {
        const a1 = a.add(b.add(c).scale(0.5));
        const b1 = b.add(c).scale(0.5);
        const c1 = c.sub(b).scale(0.5);
        return create(a1, b1, c1);
      },
      moveVertically: (f) => create(a.add(c.scale(f)), b, c),
      moveHorizontally: (f) => create(a.add(b.scale(f)), b, c),
      scaleVertically: (f) => create(a, b, c.scale(f)),
      scaleHorizontally: (f) => create(a, b.scale(f), c),
      splitVertically: (f) => {
        const g = 1.0 - f;
        const top = create(a, b, c).moveVertically(g).scaleVertically(f);
        const bot = create(a, b, c).scaleVertically(g);
        return [top, bot];
      },
      splitHorizontally: (f) => {
        const g = 1.0 - f;
        const left = create(a, b, c).scaleHorizontally(f);
        const right = create(a, b, c).moveHorizontally(f).scaleHorizontally(g);
        return [left, right];
      }
    });
  };
  return { create: create };
})();