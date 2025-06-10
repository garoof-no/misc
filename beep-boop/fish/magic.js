/* globals
  Point
*/

const Magic = (() => {
  const createMagicMapper = (box) => {
    const a = box.a();
    const b = box.b();
    const c = box.c();
    return (pt) => {
      const v = a.add(b.scale(pt.x()).add(c.scale(pt.y())));
      return Point.create(v.x(), v.y());
    };
  };

  const createPicture = (shapes) => (lens) => {
    const box = lens.box;
    const hue = lens.hue;
    const mapper = createMagicMapper(box);
    const styled = shapes.map(s => {
      return { style: s.styleFn(lens), shape: s.shape.transpose(mapper) };
    });
    return styled;
  };
  return { createPicture: createPicture };
})();