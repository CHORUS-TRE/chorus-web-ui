// Serializes the NEXT_PUBLIC_* snapshot for inlining into a <script> tag.
// JSON.stringify escapes quotes but not `<`, so a value containing
// "</script>" would otherwise terminate the inline script at the HTML level.
// `\u003c` is equivalent to `<` in a JS string, so the output stays valid
// JSON/JS while being inert as HTML. U+2028/U+2029 are escaped because they
// are line terminators in JS source and would break the inline script.
export function serializePublicEnv(
  publicEnv: Record<string, string | undefined>
): string {
  return JSON.stringify(publicEnv)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}
