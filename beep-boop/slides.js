/* globals
  Maybe
  Tree Parse Unparse DeBruijn BeepBoop Booper
 */

const Slides = (() => {
  const bound = (i, b) => Math.min(b - 1, Math.max(0, i));

  const container = document.getElementById("slides");
  const slides = [...container.children];

  let current = Maybe.Nope;

  const setSlide = (x) => {
    const value = bound(x, slides.length);
    current = Maybe.Just(value);
    let currentSlide = slides[value];
    container.innerHTML = "";
    container.appendChild(currentSlide);
    const booperElems = document.getElementsByName("beep-boop");
    if (booperElems.length === 1) {
      Booper.setCurrent(Maybe.Just(booperElems[0].booper));
    }
  };

  const sliide = (x) => current.forEach((value) => setSlide(value + x));

  const escape = () => {
    if (!current.isEmpty()) {
      const slide = slides[current.value];
      current = Maybe.Nope;
      container.innerHTML = "";
      for (const x of slides) {
        container.appendChild(x);
      }
      slide.scrollIntoView(true);
    }
  };

  const slideLink = (text, title, f) => {
    const el = document.createElement("button");
    el.innerText = text;
    el.title = title;
    el.onclick = f;
    return el;
  };

  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];
    const el = document.createElement("div");
    el.classList.add("nav");
    const prev = slideLink("◀", "Previous slide", () => setSlide(i - 1));
    if (i === 0) {
      prev.disabled = true;
    }
    el.appendChild(prev);
    el.appendChild(
      slideLink("⛶", "Toggle fullscreen", () => {
        if (current.isEmpty()) {
          setSlide(i);
        } else {
          escape();
        }
      })
    );
    const next = slideLink("▶", "Next slide", () => setSlide(i + 1));
    if (i === slides.length - 1) {
      next.disabled = true;
    }
    el.appendChild(next);
    const first = slide.firstChild;
    if (first === null) {
      slide.appendChild(el);
    } else {
      slide.insertBefore(el, first);
    }
  }

  let showTime = false;

  const setCurrentSlide = () => {
    if (!current.isEmpty()) {
      return;
    }
    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      if (slide.getBoundingClientRect().bottom > 0) {
        setSlide(i);
        return;
      }
    }
    setSlide(0);
  };

  const commands = new Map([
    [
      "q",
      () => {
        setCurrentSlide();
        sliide(-1);
      },
    ],
    [
      "e",
      () => {
        setCurrentSlide();
        sliide(1);
      },
    ],
    ["escape", escape],
    ["w", setCurrentSlide],
    [
      "t",
      () => {
        showTime = !showTime;
        refreshTime();
      },
    ],
  ]);

  const keyDown = (e) => {
    const key = e.key.toLowerCase();
    if (commands.has(key)) {
      e.preventDefault();
      commands.get(key)();
    }
  };

  for (const el of document.getElementsByName("slide-command")) {
    el.onclick = () => commands.get(el.getAttribute("command"))();
  }

  for (const el of document.getElementsByName("tree")) {
    const type = el.getAttribute("type");
    const lambstr = el.innerText;
    el.innerHTML = "";
    const p = document.createElement("p");
    el.appendChild(p);
    const res = Parse.parse(lambstr).match({
      Expression: (x) => Maybe.Just(x),
      default: (u) => Maybe.Nope,
    });

    res.either(
      (exp) => {
        const svg = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "svg"
        );
        el.appendChild(svg);
        if (type === "bru") {
          const bru = DeBruijn.unnameVars(exp);
          p.innerText = DeBruijn.unparse(bru);
          Tree.bru(svg, bru);
        } else if (type === "beops") {
          const bs = BeepBoop.unparse(exp);
          p.innerText = bs.join(" ");
          Tree.beops(svg, bs);
        } else {
          p.innerText = Unparse.unparse(exp);
          Tree.lambs(svg, exp);
        }
      },
      () => (p.innerText = `bad: ${lambstr}`)
    );
  }

  const timeEl = document.getElementById("time");

  const refreshTime = () => {
    const tstr = (i) => `${i}`.padStart(2, "0");
    const now = new Date();
    timeEl.innerHTML = showTime
      ? `${tstr(now.getHours())}:${tstr(now.getMinutes())}`
      : "";
  };
  const timer = () => {
    refreshTime();
    setTimeout(timer, 500);
  };
  timer();
  return { keyDown: keyDown };
})();
