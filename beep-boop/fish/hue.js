const Hue = (() => {

  const create = (color) => {
    return ({
      what: "hue",
      color: color,
      next: () => {
        switch (color) {
          case "black": return create("grey");
          case "grey": return create("white");
          case "white": return create("black");
          default: return create(color);
        }
      }
    });
  };
  return { create: create };
})();