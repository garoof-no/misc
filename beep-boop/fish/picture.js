const Picture = (() => {

  const blank = (_) => { return []; }

  const turn = (picture) => {
    return (lens) => {
      return picture(lens.turn());
    };
  };

  const flip = (picture) => {
    return (lens) => {
      return picture(lens.flip());
    };
  };

  const toss = (picture) => {
    return (lens) => {
      return picture(lens.toss());
    };
  };

  const aboveRatio = (m, n, p1, p2) => (lens) => {
    const f = m / (m + n);
    const [top, bot] = lens.splitVertically(f);
    return p1(top).concat(p2(bot));
  };

  const above = (p1, p2) => {
    return aboveRatio(1, 1, p1, p2);
  };

  const besideRatio = (m, n, p1, p2) => (lens) => {
    const f = m / (m + n);
    const [left, right] = lens.splitHorizontally(f);
    return p1(left).concat(p2(right));
  };


  const beside = (p1, p2) => {
    return besideRatio(1, 1, p1, p2);
  };

  const quartet = (nw, ne, sw, se) => {
    return above(beside(nw, ne || nw), beside(sw || nw, se || nw));
  };

  const row = (...ps) => {
    const [h, ...t] = ps;
    if (t.length == 0) {
      return h;
    }
    else {
      return besideRatio(1, t.length, h, row(...t));
    }
  }

  const column = (...ps) => {
    const [h, ...t] = ps;
    if (t.length == 0) {
      return h;
    }
    else {
      return aboveRatio(1, t.length, h, column(...t));
    }
  }

  const nonet = (nw, nm, ne, mw, mm, me, sw, sm, se) => {
    return column(
      row(nw, nm, ne),
      row(mw, mm, me),
      row(sw, sm, se));
  }

  const over = (p1, p2) => {
    return (lens) => {
      return p1(lens).concat(p2(lens));
    };
  };

  const rehue = (p) => {
    return (lens) => {
      return p(lens.change());
    };
  }
  
  const color = (p, c) => {
    return (lens) => {
      return p(lens.color(c));
    };
  }

  const ttile = (p) => {
    const pn = flip(toss(p));
    const pe = turn(turn(turn(pn)));
    return over(pe, over(pn, p));
  };

  const ttileColor = (p, rehueN, rehueE) => {
    const pn = flip(toss(p));
    const pe = turn(turn(turn(pn)));
    return over(rehueE(pe), over(rehueN(pn), p));
  };

  const ttileColor1 = (p) => {
    const rehueN = (p) => rehue(p);
    const rehueE = (p) => rehue(rehue(p));
    return ttileColor(p, rehueN, rehueE);
  };

  const ttileColor2 = (p) => {
    const rehueN = (p) => rehue(rehue(p));
    const rehueE = (p) => rehue(p);
    return ttileColor(p, rehueN, rehueE);
  };

  const utile = (p) => {
    const pn = flip(toss(p));
    const pw = turn(pn);
    const ps = turn(pw);
    const pe = turn(ps);
    return over(pe, over(ps, over(pw, pn)));
  };

  const utileColor = (p, rehueN, rehueW, rehueS, rehueE) => {
    const pn = flip(toss(p));
    const pw = turn(pn);
    const ps = turn(pw);
    const pe = turn(ps);
    return over(rehueE(pe), over(rehueS(ps), over(rehueW(pw), rehueN(pn))));
  };

  const utileColor1 = (p) => {
    const rehueNS = (p) => rehue(rehue(p));
    const rehueWE = (p) => p;
    return utileColor(p, rehueNS, rehueWE, rehueNS, rehueWE);
  };

  const utileColor2 = (p) => {
    const rehueN = (p) => p;
    const rehueW = (p) => rehue(rehue(p));
    const rehueS = rehue;
    const rehueE = rehueW;
    return utileColor(p, rehueN, rehueW, rehueS, rehueE);
  };

  const utileColor3 = (p) => {
    const rehueN = (p) => rehue(rehue(p));
    const rehueW = (p) => p;
    const rehueS = rehue;
    const rehueE = rehueW;
    return utileColor(p, rehueN, rehueW, rehueS, rehueE);
  };

  const side = (n, p) => {
    if (n == 0) {
      return blank;
    } else {
      const s = side(n - 1, p);
      const t = ttile(p);
      return quartet(s, s, turn(t), t);
    };
  };

  const sideColor = (tt, rehueSW, rehueSE, n, p) => {
    const aux = (n, p) => {
      const t = tt(p);
      const r = n == 1 ? blank : aux(n - 1, p);
      return quartet(r, r, rehueSW(turn(t)), rehueSE(t));
    }
    return aux(n, p);
  };

  const sideColorNS = (n, p) => {
    const rehueSW = (p) => p;
    const rehueSE = rehue;
    return sideColor(ttileColor1, rehueSW, rehueSE, n, p);
  };

  const sideColorWE = (n, p) => {
    const rehueSW = (p) => rehue(rehue(p));
    const rehueSE = rehue;
    return sideColor(ttileColor2, rehueSW, rehueSE, n, p);
  };

  const corner = (n, p) => {
    if (n == 0) {
      return blank;
    } else {
      const c = corner(n - 1, p);
      const s = side(n - 1, p);
      return quartet(c, s, turn(s), utile(p));
    };
  };

  const cornerColor = (ut, side1, side2, n, p) => {
    const u = ut(p);
    const fn = (x) => {
      const [c, ne, sw] = x == 1
        ? [blank, blank, blank]
        : [fn(x - 1), side1(x - 1, p), side2(x - 1, p)];
      return quartet(c, ne, turn(sw), u);
    };
    return fn(n);
  };

  const cornerColorNWSE = (n, p) => {
    return cornerColor(utileColor3, sideColorNS, sideColorWE, n, p);
  };

  const cornerColorNESW = (n, p) => {
    return cornerColor(utileColor2, sideColorWE, sideColorNS, n, p);
  };

  const squareLimit = (n, p) => {
    const nw = corner(n, p);
    const sw = turn(nw);
    const se = turn(sw);
    const ne = turn(se);
    const nm = side(n, p);
    const mw = turn(nm);
    const sm = turn(mw);
    const me = turn(sm);
    const mm = utile(p);
    return Picture.nonet(nw, nm, ne, mw, mm, me, sw, sm, se);
  };

  const squareLimitColor = (n, p) => {
    const nw = cornerColorNWSE(n, p);
    const sw = turn(cornerColorNESW(n, p));
    const se = turn(turn(nw));
    const ne = turn(turn(sw));
    const nm = sideColorNS(n, p);
    const mw = turn(sideColorWE(n, p));
    const sm = turn(turn(nm));
    const me = turn(turn(mw));
    const mm = utileColor1(p);
    return Picture.nonet(nw, nm, ne, mw, mm, me, sw, sm, se);
  };
  return {blank: blank, squareLimit: squareLimit, squareLimitColor: squareLimitColor, nonet: nonet, column: column, row: row, turn: turn, flip: flip, toss: toss, rehue: rehue, over: over, beside: beside, color: color };
})();