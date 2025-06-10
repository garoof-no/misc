/* globals
  Maybe
  BeepBoop
  Booper
  Sounds
  Editor
  Tree
  Parse
  Slides
*/

window.addEventListener("load", (event) => {
  const editors = [...document.getElementsByName("lambs")].map(Editor.create);

  const test = document.getElementById("test");
  if (test !== null) {
    test.appendChild(
      Tree.draw(Parse.parse("λf.λx.f x (λx.(λf.x) x)").expression, 20)
    );
  }

  const boopers = [...document.getElementsByName("beep-boop")].map(
    Booper.configure
  );
  if (boopers.length === 1) {
    Booper.setCurrent(Maybe.just(boopers[0].booper));
  }

  for (const el of document.getElementsByName("eval")) {
    const div = document.createElement("div");
    el.parentNode.insertBefore(div, el);
    const inputDiv = document.createElement("div");
    div.appendChild(inputDiv);
    inputDiv.appendChild(el);
    const button = document.createElement("button");
    inputDiv.appendChild(button);
    button.innerText = "Eval";
    const result = document.createElement("div");
    div.appendChild(result);

    const update = (res) => {
      result.innerHTML = "";
      if (res instanceof SVGElement || res instanceof HTMLElement) {
        result.appendChild(res);
      } else {
        const resPre = document.createElement("pre");
        resPre.innerText = `${res}`;
        result.appendChild(resPre);
      }
      button.disabled = false;
    };

    button.onclick = () => {
      result.innerText = "↻";
      button.disabled = true;
      setTimeout(() => {
        let res = null;
        try {
          res = eval(el.innerText);
        } catch (err) {
          update(err);
        }
        if (res !== null) {
          update(res);
        }
      }, 0);
    };
  }

  const commands = new Map([
    ["a", (booper) => booper.add("beep")],
    ["s", (booper) => booper.add("boop")],
    ["d", (booper) => booper.add("bap")],
    ["f", (booper) => booper.add("pling")],
    [" ", (booper) => booper.nextCmd()],
    ["backspace", (booper) => booper.undo()],
  ]);

  document.addEventListener("keydown", (e) => {
    const el = document.activeElement;
    if (el.localName === "textarea" || el.contentEditable === "true") {
      return;
    }
    for (const e of editors) {
      if (e.hasFocus()) {
        return;
      }
    }
    const key = e.key.toLowerCase();
    const booper = Booper.current();
    if (commands.has(key) && !booper.isEmpty()) {
      e.preventDefault();
      commands.get(key)(booper.value);
      return;
    }
    return Slides.keyDown(e);
  });
});
