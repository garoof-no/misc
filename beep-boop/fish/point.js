const Point = (() => {

  const create = (x, y) => ({
    x: () => x,
    y: () => y,
    displace: (v) => Point.create(x + v.x(), y + v.y()),
    toString: () => `${x},${y}`
  });
  
  return { create: create };
})();
