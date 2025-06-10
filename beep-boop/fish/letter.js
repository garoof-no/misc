/* globals
  Shape Point
*/

const Letter = (() => {

  const createStyledLetterPolygon = (pts) => {
    const getStrokeWidth = (box) => {
      const s = Math.max(box.b().len(), box.c().len());
      return s / 50.0;
    };

    const getStyle = (lens) => {
      return {
        'stroke-width': getStrokeWidth(lens.box),
        'stroke': lens.hue.color,
        'fill': "white"
      };
    };
    return {
      styleFn: getStyle,
      shape: Shape.polygon(pts)
    };
  };

  const f = () => {
    const points =
      [Point.create(0.30, 0.20)
        , Point.create(0.40, 0.20)
        , Point.create(0.40, 0.45)
        , Point.create(0.60, 0.45)
        , Point.create(0.60, 0.55)
        , Point.create(0.40, 0.55)
        , Point.create(0.40, 0.70)
        , Point.create(0.70, 0.70)
        , Point.create(0.70, 0.80)
        , Point.create(0.30, 0.80)];
    return [createStyledLetterPolygon(points)];
  };

  const h = () => {
    const points =
      [Point.create(0.30, 0.20)
        , Point.create(0.40, 0.20)
        , Point.create(0.40, 0.45)
        , Point.create(0.60, 0.45)
        , Point.create(0.60, 0.20)
        , Point.create(0.70, 0.20)
        , Point.create(0.70, 0.80)
        , Point.create(0.60, 0.80)
        , Point.create(0.60, 0.55)
        , Point.create(0.40, 0.55)
        , Point.create(0.40, 0.80)
        , Point.create(0.30, 0.80)];
    return [createStyledLetterPolygon(points)];
  };

  const e = () => {
    const points =
      [Point.create(0.30, 0.20)
        , Point.create(0.70, 0.20)
        , Point.create(0.70, 0.30)
        , Point.create(0.40, 0.30)
        , Point.create(0.40, 0.45)
        , Point.create(0.60, 0.45)
        , Point.create(0.60, 0.55)
        , Point.create(0.40, 0.55)
        , Point.create(0.40, 0.70)
        , Point.create(0.70, 0.70)
        , Point.create(0.70, 0.80)
        , Point.create(0.30, 0.80)];
    return [createStyledLetterPolygon(points)];
  };

  const n = () => {
    const points =
      [Point.create(0.30, 0.20)
        , Point.create(0.40, 0.20)
        , Point.create(0.40, 0.60)
        , Point.create(0.60, 0.20)
        , Point.create(0.70, 0.20)
        , Point.create(0.70, 0.80)
        , Point.create(0.60, 0.80)
        , Point.create(0.60, 0.40)
        , Point.create(0.40, 0.80)
        , Point.create(0.30, 0.80)];
    return [createStyledLetterPolygon(points)];
  };

  const d = () => {
    const pts1 =
      [Point.create(0.30, 0.20)
        , Point.create(0.55, 0.20)
        , Point.create(0.70, 0.35)
        , Point.create(0.70, 0.65)
        , Point.create(0.55, 0.80)
        , Point.create(0.30, 0.80)];
    const pts2 =
      [Point.create(0.40, 0.30)
        , Point.create(0.52, 0.30)
        , Point.create(0.60, 0.38)
        , Point.create(0.60, 0.62)
        , Point.create(0.52, 0.70)
        , Point.create(0.40, 0.70)];
    const all = [pts1, pts2];
    return all.map(createStyledLetterPolygon);
  };

  const r = () => {
    const pts1 =
      [Point.create(0.30, 0.20)
        , Point.create(0.40, 0.20)
        , Point.create(0.40, 0.45)
        , Point.create(0.45, 0.45)
        , Point.create(0.60, 0.20)
        , Point.create(0.70, 0.20)
        , Point.create(0.55, 0.45)
        , Point.create(0.70, 0.45)
        , Point.create(0.70, 0.80)
        , Point.create(0.30, 0.80)];
    const pts2 =
      [Point.create(0.40, 0.55)
        , Point.create(0.60, 0.55)
        , Point.create(0.60, 0.70)
        , Point.create(0.40, 0.70)];
    const all = [pts1, pts2];
    return all.map(createStyledLetterPolygon);
  };

  const s = () => {
    const points =
      [Point.create(0.30, 0.20)
        , Point.create(0.70, 0.20)
        , Point.create(0.70, 0.55)
        , Point.create(0.40, 0.55)
        , Point.create(0.40, 0.70)
        , Point.create(0.70, 0.70)
        , Point.create(0.70, 0.80)
        , Point.create(0.30, 0.80)
        , Point.create(0.30, 0.45)
        , Point.create(0.60, 0.45)
        , Point.create(0.60, 0.30)
        , Point.create(0.30, 0.30)];
    return [createStyledLetterPolygon(points)];
  };

  const o = () => {
    const pts1 =
      [Point.create(0.30, 0.20)
        , Point.create(0.70, 0.20)
        , Point.create(0.70, 0.80)
        , Point.create(0.30, 0.80)];
    const pts2 =
      [Point.create(0.40, 0.30)
        , Point.create(0.60, 0.30)
        , Point.create(0.60, 0.70)
        , Point.create(0.40, 0.70)];
    const all = [pts1, pts2];
    return all.map(createStyledLetterPolygon);
  };

  return { f: f, h: h, e: e, n: n, d: d, r: r, s: s, o: o };
})();