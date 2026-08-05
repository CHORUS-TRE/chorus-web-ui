# Vendored Xpra HTML5 client

- Upstream: https://github.com/Xpra-org/xpra-html5
- Upstream commit: `41af47a87818d75d4ce74a9f5b525bc908280e9b`
- Client version: 22
- License: MPL-2.0 (see `LICENSE`)

`index.html` contains a small `window.chorusXpra` bridge used by the React
`XpraWeb` component. When updating the vendor tree, preserve or reapply that
bridge and verify compatibility with the Xpra server image.

The bridge exposes: `listWindows`, `focusWindow`, `resize` (pre-existing), and
`setAudio`, `setKeyboard`, `uploadFile`, `downloadFile`, `getSessionInfo`,
`reconnect` (added for the CHORUS session-settings panel). `setAudio` and
`setKeyboard` mirror the sound button's click handler (`#sound_button`,
around line 1262) and `toggle_keyboard()` (around line 1146) respectively,
so a live setting change behaves exactly like the corresponding manual
action, and `setKeyboard` is idempotent (checks `.simple-keyboard` visibility
before toggling). `uploadFile`/`downloadFile` call the existing `upload_file`/
`download_file` functions. `getSessionInfo` returns
`{ endpoint, display, platform, connectedSince }` as plain data (unlike the
built-in Session Info dialog, it does not open `#sessioninfo`); the values
come from `client.uri`, `client.server_display`, `client.server_platform`,
and `client.client_start_time` (ISO string) — note this last one marks when
the client object was constructed, not a server-reported connection
timestamp, since this client version never populates a server-side
start time. `reconnect` sets `client.disconnect_reason` and calls
`client.close()`, the same mechanism the client's own disconnect paths use.

Because that bridge modifies MPL-covered source, `index.html` stays under
MPL-2.0. This whole directory keeps its own license and is **not** covered by the
repository's `LICENSE`; see `THIRD-PARTY-NOTICES.md` at the repository root, and
update it whenever this tree is refreshed.

This tree is excluded from ESLint (`eslint.config.mjs`) and Prettier
(`.prettierignore`): `--fix` / `--write` would rewrite upstream sources and make
the next update, and reapplying the bridge, far harder.
