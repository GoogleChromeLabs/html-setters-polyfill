# HTML Setters Polyfill

A polyfill for new HTML setters (`streamHTML`, `appendHTML`... etc. and unsafe variants) as proposed in [WHATWG HTML issue #11669](https://github.com/whatwg/html/issues/11669).

## Features

- **Insertion variants**: `setHTML`, `beforeHTML`, `afterHTML` on `Element` and `ShadowRoot`.
- **Child insertion variants**: `replaceWithHTML`, `prependHTML`, `appendHTML` on nodes with children.
- **Insertion Unsafe variants**: `setHTMLUnsafe`, `appendHTMLUnsafe`, `prependHTMLUnsafe`, `beforeHTMLUnsafe`, `afterHTMLUnsafe`, `replaceWithHTMLUnsafe`.
- **Streaming variants**: `steamHTML`, `streamHTMLUnsafe`, `streamBeforeHTML`...etc. return a `WritableStream` that buffers and applies the HTML on close.
- Supports `runScripts: true` using `createContextualFragment`.
- JSDoc types for TypeScript compatibility in JS.
- No dependencies.
- No Trusted Types support on streaming.

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
- Safe streaming is only supported if `setHTML` is supported in the target browser (i.e. not Safari).
- Declarative Shadow DOM (DSD) is supported if `createContextualFragment` supports it in the target browser.

## License

[Apache 2.0](LICENSE)

## Contributing

We'd love to accept your patches and contributions to this project. See the enclosed [`CONTRIBUTING.md`](./CONTRIBUTING.md) for details.

## Disclaimer

This is not an officially supported Google product. This project is not eligible for the [Google Open Source Software Vulnerability Rewards Program](https://bughunters.google.com/open-source-security).
