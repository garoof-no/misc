/* globals
  Point Svg
*/
const Shape = (() => {
  const createMoveToCommand = (point) => {
    return ({
      what: "moveTo",
      command: "moveTo",
      transpose: (mapper) => {
        return createMoveToCommand(mapper(point));
      },
      toString: () => {
        return `M${point.x()} ${point.y()}`;
      }
    });
  };

  const createCurveToCommand = (cp1, cp2, ep) => {
    return ({
      what: "curveTo",
      command: "curveTo",
      transpose: (mapper) => {
        return createCurveToCommand(mapper(cp1), mapper(cp2), mapper(ep));
      },
      toString: () => {
        return `C ${cp1.x()} ${cp1.y()}, ${cp2.x()} ${cp2.y()}, ${ep.x()} ${ep.y()}`;
      }
    });
  };

  const createCloseCommand = () => {
    return ({
      what: "close",
      command: "close",
      transpose: (mapper) => {
        return createCloseCommand();
      },
      toString: () => {
        return `Z`;
      }
    });
  };

  const M = (x, y) => createMoveToCommand(Point.create(x, y));

  const C = (x1, y1, x2, y2, x3, y3) => createCurveToCommand(Point.create(x1, y1), Point.create(x2, y2), Point.create(x3, y3));

  const Z = createCloseCommand;

  const path = (...commands) => ({
    what: "path",
    shape: "path",
    commands: () => commands,
    transpose: (mapper) => {
      const transposed = commands.map(c => c.transpose(mapper));
      return path(...transposed);
    },
    toSvgElement: (style) => Svg.createElement("path", commands, style)
  });

  const poly = (what, shape, svg, points) => ({
    what: what,
    shape: shape,
    points: () => points,
    transpose: (mapper) => poly(what, shape, svg, points.map(mapper)),
    toSvgElement: (style) => Svg.createElement(svg, points, style)
  });

  const polygon = points => poly("polygon", "polygon", "polygon", points);
  const polyline = points => poly("polyline", "polyline", "polyline", points);

  return { M: M, C: C, Z: Z, path: path, polygon: polygon, polyline: polyline };
})();