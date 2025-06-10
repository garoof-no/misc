/* globals
  Shape Point
*/

const George = (() => {

  const createStyledPolylineForGeorge = (pts) => {
    const getStrokeWidth = (box) => {
      const s = Math.max(box.b().len(), box.c().len());
      return s / 80.0;
    };
    const getStyle = (lens) => {
      return {
        'stroke-width': getStrokeWidth(lens.box),
        'stroke': "purple",
        'fill': "none"
      };
    };
    return {
      styleFn: getStyle,
      shape: Shape.polyline(pts)
    };
  };

  const create = () => {

    const pts1 =
      [Point.create(0.00, 0.55)
        , Point.create(0.15, 0.45)
        , Point.create(0.30, 0.55)
        , Point.create(0.40, 0.50)
        , Point.create(0.20, 0.00)];

    const pts2 =
      [Point.create(0.00, 0.80)
        , Point.create(0.15, 0.60)
        , Point.create(0.30, 0.65)
        , Point.create(0.40, 0.65)
        , Point.create(0.35, 0.80)
        , Point.create(0.40, 1.00)];

    const pts3 =
      [Point.create(0.60, 1.00)
        , Point.create(0.65, 0.80)
        , Point.create(0.60, 0.65)
        , Point.create(0.80, 0.65)
        , Point.create(1.00, 0.45)];

    const pts4 =
      [Point.create(1.00, 0.20)
        , Point.create(0.60, 0.50)
        , Point.create(0.80, 0.00)];

    const pts5 =
      [Point.create(0.40, 0.00)
        , Point.create(0.50, 0.30)
        , Point.create(0.60, 0.00)];

    const all = [pts1, pts2, pts3, pts4, pts5];

    return all.map(createStyledPolylineForGeorge);
  };
  return { create: create };
})();