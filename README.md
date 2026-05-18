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

## Limitations

- Streaming is not natively "streamed" to the parser (it buffers first).
- Safe streaming is only supported if `setHTML` is supported in the target browser (not Safari).
- Declarative Shadow DOM (DSD) is supported if `innerHTML` or `createContextualFragment` supports it in the target browser.

## License

[Apache 2.0](LICENSE)

## Contributing

We'd love to accept your patches and contributions to this project. See the enclosed [`CONTRIBUTING.md`](./CONTRIBUTING.md) for details.

## Disclaimer

This is not an officially supported Google product. This project is not eligible for the [Google Open Source Software Vulnerability Rewards Program](https://bughunters.google.com/open-source-security).
