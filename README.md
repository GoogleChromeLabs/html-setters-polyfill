# HTML Setters Polyfill

A polyfill for the new HTML `*Unsafe` setters (setHTMLUnsafe, parseHTMLUnsafe, and insertion variants) as proposed in [WHATWG HTML issue #11669](https://github.com/whatwg/html/issues/11669).

## Features
- `setHTMLUnsafe` on `Element` and `ShadowRoot`.
- Insertion variants: `appendHTMLUnsafe`, `prependHTMLUnsafe`, `beforeHTMLUnsafe`, `afterHTMLUnsafe`, `replaceWithHTMLUnsafe`.
- Static `Document.parseHTMLUnsafe(html)`.
- **Streaming Support**: `streamHTMLUnsafe`, `streamAppendHTMLUnsafe`, etc. return a `WritableStream` that buffers and applies the HTML on close.
- Supports `runScripts: true` using `createContextualFragment`.
- JSDoc types for TypeScript compatibility in JS.
- No dependencies.
- No sanitization or Trusted Types support.

## Usage

```javascript
// Set HTML unsafe
element.setHTMLUnsafe('<div><script>console.log("hi")</script></div>', { runScripts: true });

// Stream HTML
const stream = element.streamHTMLUnsafe({ runScripts: true });
const writer = stream.getWriter();
writer.write('<div>Hello ');
writer.write('World!</div>');
writer.close();
```

## Build
The only build step is minification. Use `uglify-js`:
```bash
npm install
npm run build
```

## Testing
WPT tests are imported into the `tests/` directory as a guide.
Manual tests for streaming are in `tests/streaming-tests.html`.

## Limitations
- Streaming is not natively "streamed" to the parser (it buffers first).
- Declarative Shadow DOM (DSD) is supported if `innerHTML` or `createContextualFragment` supports it in the target browser.
