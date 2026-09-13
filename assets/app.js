/* no hello — page behaviour
   Everything here is decoration; the page reads fine with JS off. */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  var calm = reduced.matches;

  function motionOff() { return calm; }

  /* ---------------------------------------------------------------
     1. The hero demo: a chat that opens with "hi" and goes nowhere
     --------------------------------------------------------------- */

  var list = document.getElementById("demo-msgs");
  var clock = document.getElementById("clock");
  var clockVal = document.getElementById("clock-val");
  var clockLabel = clock ? clock.querySelector(".clock-label") : null;
  var replay = document.getElementById("replay");
  var timers = [];
  var ticker = null;

  var SCRIPT = [
    { at: 0, who: "them", name: "Keith", time: "2:15 PM", text: "hi" },
    { at: 1200, typing: "me", name: "Tim" },
    { at: 2600, who: "me", name: "Tim", time: "2:19 PM", text: "...?" },
    { at: 3600, typing: "them", name: "Keith" },
    { at: 5400, who: "them", name: "Keith", time: "2:20 PM", text: "what time was taht thing again?", stops: true },
    { at: 6400, who: "me", name: "Tim", time: "2:20 PM", text: "oh — 3:30 mate" },
    { at: 7600, sys: true, text: "4 minutes 51 seconds. All of it avoidable." }
  ];

  var TOTAL_SIM = 291; /* 4:51 in seconds */
  var STOP_AT = 5400;  /* the moment the question finally lands */

  function fmt(s) {
    var m = Math.floor(s / 60);
    var r = Math.floor(s % 60);
    return m + ":" + (r < 10 ? "0" : "") + r;
  }

  function bubble(item) {
    var li = document.createElement("li");
    if (item.sys) {
      li.className = "msg sys";
      li.innerHTML = "<p></p>";
      li.querySelector("p").textContent = item.text;
    } else {
      li.className = "msg " + item.who;
      var meta = document.createElement("span");
      meta.className = "meta";
      meta.innerHTML = "<b></b> <time></time>";
      meta.querySelector("b").textContent = item.name;
      meta.querySelector("time").textContent = item.time;
      var p = document.createElement("p");
      p.textContent = item.text;
      li.appendChild(meta);
      li.appendChild(p);
    }
    if (!motionOff()) li.classList.add("enter");
    return li;
  }

  function typingBubble(side, name) {
    var li = document.createElement("li");
    li.className = "msg typing " + side;
    li.dataset.typing = "1";
    li.innerHTML = '<span class="meta"><b></b> <time>typing…</time></span><p><i></i><i></i><i></i></p>';
    li.querySelector("b").textContent = name;
    return li;
  }

  function clearTyping() {
    var t = list.querySelector('[data-typing="1"]');
    if (t) t.remove();
  }

  function setClock(sec, stopped) {
    clockVal.textContent = fmt(sec);
    clock.classList.toggle("hot", !stopped && sec > 90);
    clock.classList.toggle("done", !!stopped);
  }

  function stopAll() {
    timers.forEach(clearTimeout);
    timers = [];
    if (ticker) { cancelAnimationFrame(ticker); ticker = null; }
  }

  function runDemo() {
    if (!list) return;
    stopAll();
    list.innerHTML = "";
    clock.classList.remove("hot", "done");
    clockLabel.textContent = "Question still unasked for";
    setClock(0, false);

    if (motionOff()) {
      SCRIPT.filter(function (s) { return !s.typing; }).forEach(function (s) {
        list.appendChild(bubble(s));
      });
      clockLabel.textContent = "Time wasted before the question";
      setClock(TOTAL_SIM, true);
      return;
    }

    var start = performance.now();
    function tick(now) {
      var elapsed = now - start;
      if (elapsed >= STOP_AT) { ticker = null; return; }
      setClock(Math.min(TOTAL_SIM, (elapsed / STOP_AT) * TOTAL_SIM), false);
      ticker = requestAnimationFrame(tick);
    }
    ticker = requestAnimationFrame(tick);

    SCRIPT.forEach(function (step) {
      timers.push(setTimeout(function () {
        clearTyping();
        if (step.typing) {
          list.appendChild(typingBubble(step.typing, step.name));
          return;
        }
        list.appendChild(bubble(step));
        if (step.stops) {
          if (ticker) { cancelAnimationFrame(ticker); ticker = null; }
          clockLabel.textContent = "Time wasted before the question";
          setClock(TOTAL_SIM, true);
        }
      }, step.at));
    });
  }

  if (replay) replay.addEventListener("click", runDemo);
  runDemo();

  /* ---------------------------------------------------------------
     2. Ping lab
     --------------------------------------------------------------- */

  var toasts = document.getElementById("toasts");
  var phone = document.getElementById("phone");
  var phoneClock = document.getElementById("phone-clock");
  var rAnswer = document.getElementById("r-answer");
  var rCost = document.getElementById("r-cost");
  var rAway = document.getElementById("r-away");

  var READOUT = {
    bad: {
      answer: ["No — there's nothing to answer.", "bad"],
      cost: "One interruption, no progress. They now owe you a reply and a wait.",
      away: "The thread is dead until you're both online at the same time."
    },
    good: {
      answer: ["Yes — right now, in one message.", "good"],
      cost: "One interruption, one resolved request.",
      away: "They answer at 7am from a phone. Done before you're up."
    },
    nudge: {
      answer: ["Still no — a nudge adds volume, not information.", "bad"],
      cost: "A second interruption for the same zero information.",
      away: "Now there are two unanswerable notifications waiting."
    }
  };

  var toastCount = 0;

  function pushToast(text, kind, sender) {
    if (!toasts) return;
    toastCount++;
    var el = document.createElement("div");
    el.className = "toast" + (kind === "good" ? " is-good" : kind === "nudge" ? " is-nudge" : "");
    var head = document.createElement("div");
    head.className = "toast-head";
    head.innerHTML = '<span class="dot"></span><b></b><span class="when mono"></span>';
    head.querySelector("b").textContent = sender || "Keith";
    head.querySelector(".when").textContent = kind === "nudge" ? "now · nudge" : "now";
    var p = document.createElement("p");
    p.textContent = text;
    el.appendChild(head);
    el.appendChild(p);
    toasts.appendChild(el);
    while (toasts.children.length > 3) toasts.removeChild(toasts.firstChild);
    if (phoneClock) phoneClock.textContent = "2:1" + Math.min(9, 5 + toastCount) + " PM";
  }

  function setReadout(key) {
    var r = READOUT[key];
    if (!r) return;
    rAnswer.textContent = r.answer[0];
    rAnswer.className = r.answer[1];
    rCost.textContent = r.cost;
    rAway.textContent = r.away;
  }

  var openers = Array.prototype.slice.call(document.querySelectorAll(".opener"));
  openers.forEach(function (btn) {
    btn.addEventListener("click", function () {
      openers.forEach(function (b) { b.classList.remove("is-on"); });
      btn.classList.add("is-on");
      pushToast(btn.dataset.text, btn.dataset.kind === "good" ? "good" : "bad", "Keith");
      setReadout(btn.dataset.kind);
    });
  });

  var nudge = document.getElementById("nudge");
  if (nudge) {
    nudge.addEventListener("click", function () {
      pushToast("Hello?? 👋", "nudge", "Keith");
      setReadout("nudge");
      if (!motionOff() && phone) {
        phone.classList.remove("shake");
        void phone.offsetWidth;
        phone.classList.add("shake");
      }
    });
  }

  /* seed the lab so it opens in a working state */
  pushToast("Hello", "bad", "Keith");

  /* ---------------------------------------------------------------
     3. Rail: scroll-spy + unread badge that clears once you've read
     --------------------------------------------------------------- */

  var links = Array.prototype.slice.call(document.querySelectorAll(".rail-nav a"));
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + e.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  }

  window.addEventListener("scroll", function () {
    if (window.scrollY > 400) {
      var badge = document.querySelector(".unread");
      if (badge) badge.remove();
    }
  }, { passive: true });

  /* ---------------------------------------------------------------
     4. Reveals — armed only when motion is welcome
     --------------------------------------------------------------- */

  function armReveals() {
    if (motionOff() || !("IntersectionObserver" in window)) return;
    root.classList.add("js-reveal");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("shown"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
  }
  armReveals();

  /* ---------------------------------------------------------------
     5. Calm mode
     --------------------------------------------------------------- */

  var calmBtn = document.getElementById("motion-toggle");
  function syncCalm() {
    document.body.classList.toggle("calm", calm);
    if (calmBtn) {
      calmBtn.setAttribute("aria-pressed", String(calm));
      calmBtn.textContent = calm ? "Calm mode: on" : "Calm mode";
    }
  }
  syncCalm();
  if (calmBtn) {
    calmBtn.addEventListener("click", function () {
      calm = !calm;
      syncCalm();
      if (calm) {
        root.classList.remove("js-reveal");
        document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("shown"); });
      } else {
        armReveals();
      }
      runDemo();
    });
  }

  /* ---------------------------------------------------------------
     6. Copy link
     --------------------------------------------------------------- */

  var copy = document.getElementById("copy");
  var copyNote = document.getElementById("copy-note");
  if (copy) {
    copy.addEventListener("click", function () {
      var url = window.location.href.split("#")[0];
      var done = function () { copyNote.textContent = "Copied. Use it kindly. 🙂"; };
      var failed = function () { copyNote.textContent = url; };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(done, failed);
      } else {
        failed();
      }
    });
  }
})();
