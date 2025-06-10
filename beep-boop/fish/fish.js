/* globals
  Shape
*/

const Fish = (() => {

  const simplePath = (moveTo, curveTo) => {
    const getStrokeWidth = (box) => {
      const s = Math.max(box.b().len(), box.c().len());
      return s / 80.0;
    };

    const getStyle = (lens) => {
      return {
        'stroke-width': getStrokeWidth(lens.box),
        'stroke': "red",
        'fill': "none"
      };
    };
    return {
      styleFn: getStyle,
      shape: Shape.path(moveTo, curveTo)
    };
  };

  const simple = () => {

    const simplePaths =
      [simplePath(
        Shape.M(0.116, 0.702),
        Shape.C(0.260, 0.295, 0.330, 0.258, 0.815, 0.078)),
      simplePath(
        Shape.M(0.564, 0.032),
        Shape.C(0.730, 0.056, 0.834, 0.042, 1.000, 0.000)),
      simplePath(
        Shape.M(0.250, 0.250),
        Shape.C(0.372, 0.194, 0.452, 0.132, 0.564, 0.032)),
      simplePath(
        Shape.M(0.000, 0.000),
        Shape.C(0.110, 0.110, 0.175, 0.175, 0.250, 0.250)),
      simplePath(
        Shape.M(-0.250, 0.250),
        Shape.C(-0.150, 0.150, -0.090, 0.090, 0.000, 0.000)),
      simplePath(
        Shape.M(-0.250, 0.250),
        Shape.C(-0.194, 0.372, -0.132, 0.452, -0.032, 0.564)),
      simplePath(
        Shape.M(-0.032, 0.564),
        Shape.C(0.055, 0.355, 0.080, 0.330, 0.250, 0.250)),
      simplePath(
        Shape.M(-0.032, 0.564),
        Shape.C(-0.056, 0.730, -0.042, 0.834, 0.000, 1.000)),
      simplePath(Shape.M(0.000, 1.000), Shape.C(0.104, 0.938, 0.163, 0.893, 0.234, 0.798)),
      simplePath(Shape.M(0.234, 0.798), Shape.C(0.368, 0.650, 0.232, 0.540, 0.377, 0.377)),
      simplePath(Shape.M(0.377, 0.377), Shape.C(0.400, 0.350, 0.450, 0.300, 0.500, 0.250)),
      simplePath(Shape.M(0.500, 0.250), Shape.C(0.589, 0.217, 0.660, 0.208, 0.766, 0.202)),
      simplePath(Shape.M(0.766, 0.202), Shape.C(0.837, 0.107, 0.896, 0.062, 1.000, 0.000)),
      simplePath(Shape.M(0.234, 0.798), Shape.C(0.340, 0.792, 0.411, 0.783, 0.500, 0.750)),
      simplePath(Shape.M(0.500, 0.750), Shape.C(0.500, 0.625, 0.500, 0.575, 0.500, 0.500)),
      simplePath(Shape.M(0.500, 0.500), Shape.C(0.460, 0.460, 0.410, 0.410, 0.377, 0.377)),
      simplePath(Shape.M(0.315, 0.710), Shape.C(0.378, 0.732, 0.426, 0.726, 0.487, 0.692)),
      simplePath(Shape.M(0.340, 0.605), Shape.C(0.400, 0.642, 0.435, 0.647, 0.489, 0.626)),
      simplePath(Shape.M(0.348, 0.502), Shape.C(0.400, 0.564, 0.422, 0.568, 0.489, 0.563)),
      simplePath(Shape.M(0.451, 0.418), Shape.C(0.465, 0.400, 0.480, 0.385, 0.490, 0.381)),
      simplePath(Shape.M(0.421, 0.388), Shape.C(0.440, 0.350, 0.455, 0.335, 0.492, 0.325)),
      simplePath(
        Shape.M(-0.170, 0.237),
        Shape.C(-0.125, 0.355, -0.065, 0.405, 0.002, 0.436)),
      simplePath(
        Shape.M(-0.121, 0.188),
        Shape.C(-0.060, 0.300, -0.030, 0.330, 0.040, 0.375)),
      simplePath(
        Shape.M(-0.058, 0.125),
        Shape.C(-0.010, 0.240, 0.030, 0.280, 0.100, 0.321)),
      simplePath(
        Shape.M(-0.022, 0.063),
        Shape.C(0.060, 0.200, 0.100, 0.240, 0.160, 0.282)),
      simplePath(Shape.M(0.053, 0.658), Shape.C(0.075, 0.677, 0.085, 0.687, 0.098, 0.700)),
      simplePath(Shape.M(0.053, 0.658), Shape.C(0.042, 0.710, 0.042, 0.760, 0.053, 0.819)),
      simplePath(Shape.M(0.053, 0.819), Shape.C(0.085, 0.812, 0.092, 0.752, 0.098, 0.700)),
      simplePath(Shape.M(0.130, 0.718), Shape.C(0.150, 0.730, 0.175, 0.745, 0.187, 0.752)),
      simplePath(Shape.M(0.130, 0.718), Shape.C(0.110, 0.795, 0.110, 0.810, 0.112, 0.845)),
      simplePath(Shape.M(0.112, 0.845), Shape.C(0.150, 0.805, 0.172, 0.780, 0.187, 0.752))];

    return simplePaths;
  };
  const getStrokeWidth = (box) => {
    const s = Math.max(box.b().len(), box.c().len());
    return s / 80.0;
  };

  const getInnerEyeStyle = (lens) => {
    const color = lens.hue.color;
    const fillColor = color == "white" ? "black" : color;
    return {
      'fill': fillColor
    };
  };

  const getOuterEyeStyle = (lens) => ({
      'stroke-width': getStrokeWidth(lens.box),
      'stroke': getHighlightColor(lens.hue),
      'stroke-linecap': "butt",
      'fill': "white"
  });

  const getHighlightColor = (hue) => hue.color == "white" ? "black" : "white";

  const getHighlightStyle = (lens) => {
    return {
      'stroke-width': getStrokeWidth(lens.box),
      'stroke': getHighlightColor(lens.hue),
      'stroke-linecap': "butt",
      'fill': "none"
    };
  };

  const getStyle = (lens) => ({ 'fill': lens.hue.color });

  const fancy = () => {

    const bodyPath =
      Shape.path(
        Shape.M(0.000, 0.000),
        Shape.C(0.110, 0.110, 0.175, 0.175, 0.250, 0.250),
        Shape.C(0.372, 0.194, 0.452, 0.132, 0.564, 0.032),
        Shape.C(0.730, 0.056, 0.834, 0.042, 1.000, 0.000),
        Shape.C(0.896, 0.062, 0.837, 0.107, 0.766, 0.202),
        Shape.C(0.660, 0.208, 0.589, 0.217, 0.500, 0.250),
        Shape.C(0.500, 0.410, 0.500, 0.460, 0.500, 0.500),
        Shape.C(0.500, 0.575, 0.500, 0.625, 0.500, 0.750),
        Shape.C(0.411, 0.783, 0.340, 0.792, 0.234, 0.798),
        Shape.C(0.163, 0.893, 0.104, 0.938, 0.000, 1.000),
        Shape.C(-0.042, 0.834, -0.056, 0.730, -0.032, 0.564),
        Shape.C(-0.132, 0.452, -0.194, 0.372, -0.250, 0.250),
        Shape.C(-0.150, 0.150, -0.050, 0.050, 0.000, 0.000),
        Shape.Z());

    const leftOuterEyePath =
      Shape.path(
        Shape.M(0.004, 0.800),
        Shape.C(0.040, 0.772, 0.068, 0.696, 0.074, 0.685),
        Shape.C(0.045, 0.660, 0.010, 0.617, -0.008, 0.592),
        Shape.C(-0.017, 0.685, -0.012, 0.770, 0.004, 0.800),
        Shape.Z());

    const leftInnerEyePath =
      Shape.path(
        Shape.M(0.018, 0.720),
        Shape.C(0.038, 0.708, 0.053, 0.684, 0.057, 0.674),
        Shape.C(0.035, 0.652, 0.010, 0.622, 0.008, 0.618),
        Shape.C(0.005, 0.685, 0.010, 0.700, 0.018, 0.720),
        Shape.Z());

    const rightOuterEyePath =
      Shape.path(
        Shape.M(0.095, 0.870),
        Shape.C(0.160, 0.840, 0.200, 0.790, 0.205, 0.782),
        Shape.C(0.165, 0.760, 0.140, 0.740, 0.115, 0.715),
        Shape.C(0.095, 0.775, 0.090, 0.830, 0.095, 0.870),
        Shape.Z());

    const rightInnerEyePath =
      Shape.path(
        Shape.M(0.128, 0.810),
        Shape.C(0.150, 0.805, 0.174, 0.783, 0.185, 0.774),
        Shape.C(0.154, 0.756, 0.139, 0.740, 0.132, 0.736),
        Shape.C(0.126, 0.760, 0.122, 0.795, 0.128, 0.810),
        Shape.Z());

    const mainSpinePath =
      Shape.path(
        Shape.M(0.840, 0.070),
        Shape.C(0.350, 0.120, 0.140, 0.500, 0.025, 0.900));

    const leftFinStemPath =
      Shape.path(
        Shape.M(-0.015, 0.520),
        Shape.C(0.040, 0.400, 0.120, 0.300, 0.210, 0.260));

    const rightFinStemPath =
      Shape.path(
        Shape.M(0.475, 0.270),
        Shape.C(0.320, 0.350, 0.340, 0.600, 0.240, 0.770));

    const rightFinBottomDelimiterPath =
      Shape.path(
        Shape.M(0.377, 0.377),
        Shape.C(0.410, 0.410, 0.460, 0.460, 0.495, 0.495));

    const tailFinStemPath =
      Shape.path(
        Shape.M(0.430, 0.165),
        Shape.C(0.480, 0.175, 0.490, 0.220, 0.490, 0.230));

    const tailFinBottomLinePath =
      Shape.path(
        Shape.M(0.452, 0.178),
        Shape.C(0.510, 0.130, 0.540, 0.110, 0.600, 0.080));

    const tailFinTopLinePath =
      Shape.path(
        Shape.M(0.482, 0.215),
        Shape.C(0.520, 0.200, 0.600, 0.160, 0.740, 0.150));

    const leftFinTopLinePath =
      Shape.path(
        Shape.M(-0.170, 0.237),
        Shape.C(-0.125, 0.355, -0.065, 0.405, 0.010, 0.480));

    const leftFinMiddleLinePath =
      Shape.path(
        Shape.M(-0.110, 0.175),
        Shape.C(-0.060, 0.250, -0.030, 0.300, 0.080, 0.365));

    const leftFinBottomLinePath =
      Shape.path(
        Shape.M(-0.045, 0.115),
        Shape.C(0.010, 0.180, 0.060, 0.230, 0.170, 0.280));

    const rightFinTopLinePath =
      Shape.path(
        Shape.M(0.270, 0.700),
        Shape.C(0.340, 0.720, 0.426, 0.710, 0.474, 0.692));

    const rightFinMiddleLinePath =
      Shape.path(
        Shape.M(0.310, 0.570),
        Shape.C(0.400, 0.622, 0.435, 0.618, 0.474, 0.615));

    const rightFinBottomLinePath =
      Shape.path(
        Shape.M(0.350, 0.435),
        Shape.C(0.400, 0.505, 0.422, 0.520, 0.474, 0.538));

    const shapes =
      [{ styleFn: getStyle, shape: bodyPath }
        , { styleFn: getOuterEyeStyle, shape: leftOuterEyePath }
        , { styleFn: getInnerEyeStyle, shape: leftInnerEyePath }
        , { styleFn: getOuterEyeStyle, shape: rightOuterEyePath }
        , { styleFn: getInnerEyeStyle, shape: rightInnerEyePath }
        , { styleFn: getHighlightStyle, shape: mainSpinePath }
        , { styleFn: getHighlightStyle, shape: leftFinStemPath }
        , { styleFn: getHighlightStyle, shape: rightFinStemPath }
        , { styleFn: getHighlightStyle, shape: rightFinBottomDelimiterPath }
        , { styleFn: getHighlightStyle, shape: tailFinStemPath }
        , { styleFn: getHighlightStyle, shape: tailFinBottomLinePath }
        , { styleFn: getHighlightStyle, shape: tailFinTopLinePath }
        , { styleFn: getHighlightStyle, shape: leftFinTopLinePath }
        , { styleFn: getHighlightStyle, shape: leftFinMiddleLinePath }
        , { styleFn: getHighlightStyle, shape: leftFinBottomLinePath }
        , { styleFn: getHighlightStyle, shape: rightFinTopLinePath }
        , { styleFn: getHighlightStyle, shape: rightFinMiddleLinePath }
        , { styleFn: getHighlightStyle, shape: rightFinBottomLinePath }
      ];

    return shapes;
  };
  return { simple: simple, fancy: fancy };
})();

