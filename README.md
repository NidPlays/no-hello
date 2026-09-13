# no hello

A re-creation of [nohello.net](https://nohello.net/) / [no-hello.net](https://no-hello.net/) with
richer animation and chat-client graphics — presence dots, typing indicators, Teams-style
notification toasts and nudges, and a live "how long did that hello cost you" clock.

**The argument is not ours.** It was made in 2013 on [nohello.com](https://www.nohello.com/) and
made best on [nohello.net](https://nohello.net/), whose Keith/Tim/Dawn exchanges this page reuses
almost verbatim. See the credits section on the page for the full lineage, including
[nohello.club](https://nohello.club/), [dontasktoask.com](https://dontasktoask.com/),
[The XY Problem](https://xyproblem.info/) and
[How To Ask Questions The Smart Way](http://www.catb.org/~esr/faqs/smart-questions.html).

The original disclaimers are kept, because they matter as much as the point: this is only half
serious, don't get mad at whoever sent you here, norms differ — and if the URL is in someone's
status, expect a lone "Hello!" to be ignored.

## Running it

No build step, no dependencies. Open `index.html`, or serve the folder:

```sh
python3 -m http.server 8000
```

## Layout

| Path | What it is |
| --- | --- |
| `index.html` | The whole page — chat-rail shell, demo, ping lab, disclaimers, credits |
| `assets/styles.css` | Tokenised palette (dark-first, full light theme), layout, animation |
| `assets/app.js` | Demo playback, the ping lab, scroll-spy, calm mode, copy link |

Motion respects `prefers-reduced-motion`, and "Calm mode" in the sidebar turns it off by hand.
