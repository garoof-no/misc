/* globals 
  Repl
  CodeMirror
*/

const Editor = (() => {
  let repl = new Repl.Repl();

  const eval1 = (cm) => {
    const res = repl.execute(cm.getLine(cm.getCursor().line));
    cm.operation(() => insertResult(cm, res));
  };

  const evalN = (maxSteps) => (cm) => {
    eval1(cm);
    for (let i = 0; i < maxSteps; i++) {
      const res = repl.next();
      if (res.isEmpty()) {
        return;
      }
      cm.operation(() => insertResult(cm, res.value));
    }
  };

  const insertResult = (cm, str) => {
    const line = cm.getCursor().line;
    const pos = { line: line, ch: cm.getLine(line).length };
    cm.replaceRange(str, pos, pos, "lambs");
    const newPos = { line: line + 1, ch: str.length };
    cm.setSelection(newPos, newPos, { origin: "lambs" });
  };

  const replaceStuff = (cm) => {
    const res = repl.replaceDefs(cm.getLine(cm.getCursor().line));
    insertResult(cm, res);
  };

  const keyMap = {};
  keyMap["Ctrl-Enter"] = eval1;
  keyMap["Shift-Ctrl-Enter"] = evalN(1000);
  keyMap["Shift-Ctrl-R"] = replaceStuff;
  keyMap["Ctrl-R"] = replaceStuff;
  keyMap["Ctrl-L"] = (cm) => cm.replaceSelection("λ");
  keyMap["Ctrl-D"] = (cm) => cm.replaceSelection("≜");

  const evalPrelude = (str) => {
    const lines = str.split(/\r?\n/).map((line) => {
      if (line.trim().length > 0) {
        const res = Repl.execute(line);
        return line + res;
      } else {
        return "";
      }
    });
    return lines.join("\n");
  };

  const editorProps = (str) => ({
    value: str,
    lineNumbers: true,
    extraKeys: keyMap,
  });

  const preluditorProps = (str) => {
    return {
      value: evalPrelude(str),
      lineNumbers: true,
      readOnly: true,
    };
  };

  const create = (elem) => {
    const str = elem.innerText;
    elem.innerText = "";
    const props =
      elem.getAttribute("prelude") === "true"
        ? preluditorProps(str)
        : editorProps(str);

    return CodeMirror(elem, props);
  };
  return { create: create };
})();
