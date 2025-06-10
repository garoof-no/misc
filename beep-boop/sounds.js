/* globals
  Rects
*/
const Sounds = (() => {
  let notes;

  const defaultNotes = new Map();

  const audioContext = (() => {
    let ctx = null;
    return () => {
      if (ctx === null) {
        ctx = new AudioContext();
        const vol = [
          { val: 0.13, time: 0.03 },
          { val: 0.1, time: 0.02 },
          { val: 0.1, time: 0.05 },
          { val: 0, time: 0.1 },
        ];
        const addNote = (name, freq) =>
          defaultNotes.set(name, makeNote([{ val: freq, time: 0 }], vol));

        addNote("beep", 440);
        addNote("boop", 493.88);
        addNote("bap", 523.25);
        addNote("pling", 587.33);
        addNote("undo", 800);
        addNote("next", 250);
        notes = defaultNotes;
      }
      return ctx;
    };
  })();

  const osc = () => {
    let oscillator = audioContext().createOscillator();
    let amp = audioContext().createGain();
    oscillator.connect(amp);
    amp.connect(audioContext().destination);
    amp.gain.setValueAtTime(0, audioContext().currentTime);
    oscillator.type = "sawtooth";
    oscillator.frequency.setValueAtTime(440, audioContext().currentTime);
    oscillator.start();
    return {
      osc: oscillator,
      amp: amp,
    };
  };

  const note = (duration, things) => ({ duration: duration, things: things });

  const makeNote = (freq, vol) => {
    let dur = 0;
    for (let i = 0; i < vol.length; i++) {
      dur = dur + vol[i].time;
    }
    dur = dur * 0.5;

    const o = osc();
    const f = o.osc.frequency;
    f.setValueAtTime(freq[freq.length - 1].val, audioContext().currentTime);
    const g = o.amp.gain;

    return note(dur, [
      { dial: f, vts: freq },
      { dial: g, vts: vol },
    ]);
  };

  const applyValTime = (thing, start) => {
    let total = 0;
    let t = start;
    const vts = thing.vts;
    const dial = thing.dial;
    for (const vt of vts) {
      dial.setTargetAtTime(vt.val, t, vt.time);
      t = t + vt.time;
    }
  };

  const playNote = (n, start) => {
    for (const thing of n.things) {
      applyValTime(thing, start);
    }
  };

  const playNotes = (ns, start) => {
    let total = 0;
    let t = start;
    for (const n of ns) {
      playNote(n, t);
      const dur = n.duration;
      t = t + dur;
      total = total + dur;
    }
    return total;
  };

  const noises = (xs) => {
    audioContext();
    const ns = xs.flatMap((x) => (notes.has(x) ? [notes.get(x)] : []));
    return playNotes(ns, audioContext().currentTime);
  };

  const noise = (x) => {
    audioContext();
    if (notes.has(x)) {
      playNote(notes.get(x), audioContext().currentTime);
    }
  };

  const jobs = [];
  const addJob = (fun, time) => {

    let i = 0;
    while (i < jobs.length) {
      if (time < jobs[i].time) {
        jobs.splice(i, 0, { fun: fun, time: time });
        return;
      }
      i++;
    }
    jobs.push({ fun: fun, time: time });
  };
  const timer = () => {
    while (jobs.length > 0 && jobs[0].time - audioContext().currentTime < 0.2) {
      const job = jobs.shift(0);
      setTimeout(
        job.fun,
        Math.max(0, (job.time - audioContext().currentTime) * 1000)
      );
    }
    setTimeout(timer, 100);
  };
  timer();
  const playStuff = (l, after) => {
    let time =  audioContext().currentTime;
    for (const x of l) {
      const t = playNotes(x.beops.map(x => notes.get(x)), time);
      if (typeof x.start !== "undefined") {
        addJob(x.start, time);
      }
      time = time + t;
      if (typeof x.stop !== "undefined") {
        addJob(x.stop, time);
      }
    }
    time = time + 0.5;
    if (typeof after !== "undefined") {
      addJob(after, time);
    }
  };

  return {
    noises: noises,
    noise: noise,
    note: note,
    makeNote: makeNote,
    playNote: playNote,
    playNotes: playNotes,
    audioContext: audioContext,
    setNotes: (ns) => (notes = ns),
    resetNotes: () => (notes = defaultNotes),
    getNotes: () => notes,
    playStuff: playStuff,
  };
})();
