# Third-Party Notices

The license in [`LICENSE`](./LICENSE) covers code written for CHORUS. The components
listed here are third-party: they keep their own licenses, and the terms of `LICENSE`
do not apply to them.

This matters legally, not just editorially. MPL-2.0 §3.3 allows distributing covered
code as part of a larger work under other terms **only if** the covered files stay
under the MPL and recipients keep the rights the MPL grants them — including uses that
`LICENSE` restricts for CHORUS-authored code.

## xpra-html5 — `public/vendor/xpra/`

The Xpra HTML5 client, used to render remote sessions.

- **Upstream:** https://github.com/Xpra-org/xpra-html5, commit
  `41af47a87818d75d4ce74a9f5b525bc908280e9b`, client version 22
- **License:** MPL-2.0 — full text at [`public/vendor/xpra/LICENSE`](./public/vendor/xpra/LICENSE)
- **Form distributed:** Source Code Form, served verbatim from `public/`. The build does
  not minify or transform it, so recipients receive the source itself.
- **Modified by CHORUS:** `public/vendor/xpra/index.html` carries an integration bridge
  (`window.chorusXpra`, around line 1465). As a modification of MPL-covered source, that
  file remains under MPL-2.0.
- **Vendoring details:** [`public/vendor/xpra/CHORUS-VENDOR.md`](./public/vendor/xpra/CHORUS-VENDOR.md)

### Libraries bundled inside xpra-html5

`public/vendor/xpra/js/lib/` is vendored exactly as upstream ships it. Licenses below are
those **declared in the vendored files themselves**:

| File | License as declared in the file |
|---|---|
| `FileSaver.js` | MIT (points to `eligrey/FileSaver.js` `LICENSE.md`) |
| `StreamSaver.js` | MIT — Jimmy Wärting |
| `brotli_decode.js` | MIT |
| `detect-zoom.js` | dual WTFPL / MIT |
| `hmac.js` | no formal license; the author invites the user to pick any permissive license and disclaims warranty |
| `jquery-transform-draggable.js` | MPL-2.0 |
| `jquery-ui.js` | MIT — jQuery Foundation |
| `jquery.ba-throttle-debounce.js` | dual MIT / GPL |
| `jquery.js` | MIT |
| `jsmpeg.js` | MIT — Dominic Szablewski |
| `lz4.js` | BSD (referenced in the file body) |
| `rencode.js` | Copyright (c) 2021 Antoine Martin — part of Xpra, MPL-2.0 |
| `simple-keyboard.js` | MIT |
| `slick.js` | none declared in the vendored copy (slick 1.8.1, Ken Wheeler; MIT in the upstream project) |
| `web-streams-ponyfill.es6.js` | none declared in the vendored copy |
| `aurora/aurora.js`, `aurora/mp3.js` | no license header; `aurora.js` carries "Copyright (C) 2011-2015 Grant Galitz" |

Same situation for a few assets: `css/slick.css` and `css/simple-keyboard.css` (MIT is
declared in `simple-keyboard.css`, not in `slick.css`), and
`icons/materialicons-regular.{ttf,woff,woff2}`, which carry no notice in the vendored copy
(Material Icons is Apache-2.0 upstream).

**On the gaps:** upstream xpra-html5 ships a single MPL-2.0 `LICENSE` at its root with no
per-library notices, and `sw.js` has no header there either. Nothing was stripped during
vendoring — the copy is faithful. If a complete notice list is ever required for
distribution, it has to be resolved with upstream (Xpra-org) or with PACTT, not by
guessing licenses here.

## Keeping this file current

When `public/vendor/xpra/` is updated (see `CHORUS-VENDOR.md`), re-check the upstream
commit recorded above, whether the bridge patch still needs reapplying, and whether
`js/lib/` gained or lost libraries.
