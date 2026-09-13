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
status, a lone "Hello!" may be left waiting a while.

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

## Deploying to GitHub Pages

`.github/workflows/pages.yml` publishes the site with GitHub Actions — no `gh-pages`
branch and no build step; the repo root is uploaded as-is and `.nojekyll` stops Jekyll
from reinterpreting it.

The first run calls `actions/configure-pages` with `enablement: true`, which switches Pages
on and sets its source to GitHub Actions, so no manual setup should be needed. If that step
is refused (some org policies don't allow a workflow to enable Pages), turn it on once by
hand under **Settings → Pages → Build and deployment → Source → GitHub Actions** and re-run
the workflow.

It runs on every push to `main`, and can be started by hand from the Actions tab via
*Run workflow*. The site publishes to `https://nidplays.github.io/no-hello/`.
