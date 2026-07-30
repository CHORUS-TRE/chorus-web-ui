# Vendored Xpra HTML5 client

- Upstream: https://github.com/Xpra-org/xpra-html5
- Upstream commit: `41af47a87818d75d4ce74a9f5b525bc908280e9b`
- Client version: 22
- License: MPL-2.0 (see `LICENSE`)

`index.html` contains a small `window.chorusXpra` bridge used by the React
`XpraWeb` component. When updating the vendor tree, preserve or reapply that
bridge and verify compatibility with the Xpra server image.

Because that bridge modifies MPL-covered source, `index.html` stays under
MPL-2.0. This whole directory keeps its own license and is **not** covered by the
repository's `LICENSE`; see `THIRD-PARTY-NOTICES.md` at the repository root, and
update it whenever this tree is refreshed.

This tree is excluded from ESLint (`eslint.config.mjs`) and Prettier
(`.prettierignore`): `--fix` / `--write` would rewrite upstream sources and make
the next update, and reapplying the bridge, far harder.
