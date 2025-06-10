/* globals
  Point
*/

const Mirror = (() => {
  const createMirrorMapper = (height) => {
    return (pt) => {
      return Point.create(pt.x(), height - pt.y());
    };
  };

  const mirrorShapes = (height, styledShapes) => {
    const mapper = createMirrorMapper(height);
    const mirroredShapes = styledShapes.map(s => {
      return { style: s.style, shape: s.shape.transpose(mapper) };
    });
    return mirroredShapes;
  };
  return { mirrorShapes: mirrorShapes };
})();