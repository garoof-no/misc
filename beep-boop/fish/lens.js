/* globals
  Hue
  */

const Lens = (() => {
  const create = (box, hue) => ({
    what: "lens",
    box: box,
    hue: hue,
    turn: () => create(box.turn(), hue),
    flip: () => create(box.flip(), hue),
    toss: () => create(box.toss(), hue),
    moveVertically: (f) => create(box.moveVertically(f), hue),
    moveHorizontally: (f) => create(box.moveHorizontally(f), hue),
    scaleVertically: (f) => create(box.scaleVertically(f), hue),
    scaleHorizontally: (f) => create(box.scaleHorizontally(f), hue),
    splitVertically: (f) => {
      const boxes = box.splitVertically(f);
      return boxes.map(b => create(b, hue));
    },
    splitHorizontally: (f) => {
      const boxes = box.splitHorizontally(f);
      return boxes.map(b => create(b, hue));
    },
    change: () => create(box, hue.next()),
    color: (c) => create(box, Hue.create(c))
  });

  return ({ create: create });
})();