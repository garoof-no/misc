/* globals
  Picture Rects
*/

const FishLamb = (() => {
  const varfish = (p) => Picture.rehue(p);
  const appfish = (f, a) =>
    Picture.over(
      Picture.flip(Picture.toss(f)),
      Picture.turn(Picture.turn(Picture.flip(Picture.toss(a))))
    );
  const lamfish = (p, b) =>
    Picture.over(
      p,
      Picture.turn(Picture.turn(Picture.turn(Picture.flip(Picture.toss(b)))))
    );

  const picture = (pal, pic, exp) => {
    const halp = (pic, exp) =>
      exp.match({
        Var: (n) => Picture.color(pic, pal(n)),
        Lam: (p, b) => lamfish(Picture.color(pic, pal(p)), halp(pic, b)),
        App: (f, a) => appfish(halp(pic, f), halp(pic, a)),
        BadVar: (n) => Picture.color(pic, pal(n)),
        Bad: (s) => pic,
        Missing: () => Picture.blank,
      });
    return halp(pic, exp);
  };
  return { picture: picture };
})();
