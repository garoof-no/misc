const Vector = (() => {

  const create = (x, y) => {
    return ({
      what: "vector",
      x: () => x,
      y: () => y,
      add: (v) => create(x + v.x(), y + v.y()),
      sub: (v) => create(x - v.x(), y - v.y()),
      neg: () => create(-x, -y),
      scale: (f) => create(f * x, f * y),
      len: () => Math.sqrt(x * x + y * y),
      equals: (v) => v.x() === x && v.y() === y,
      values: () => [x, y]
    });
  };
  return { create: create };
})();
