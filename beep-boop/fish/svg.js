const Svg = (() => {
  const createElement = (name, stuff, style) => {
    const el = document.createElementNS("http://www.w3.org/2000/svg", name);
    const strs = stuff.map((cmd) => cmd.toString());
    const d = strs.reduce((prev, curr) => prev + " " + curr, "");
    el.setAttribute("d", d);
    for (const prop in style) {
      el.setAttribute(prop, style[prop]);
    }
    return el;
  };

  const create = (w, h, children) => {
    const el = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    el.setAttribute("width", `${w}`);
    el.setAttribute("height", `${h}`);
    for (const child of children) {
      el.appendChild(child);
    }
    return el;
  };

  return { createElement: createElement, create: create };
})();
