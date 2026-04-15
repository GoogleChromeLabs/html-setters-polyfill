/**
 *  @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

export {};

declare global {
  interface SetHTMLUnsafeOptions {
    runScripts?: boolean;
    sanitizer?: any;
  }

  interface SetHTMLOptions {
    sanitizer?: any;
  }

  interface Element {
    setHTMLUnsafe(html: string, options?: SetHTMLUnsafeOptions): void;
    appendHTMLUnsafe(html: string, options?: SetHTMLUnsafeOptions): void;
    prependHTMLUnsafe(html: string, options?: SetHTMLUnsafeOptions): void;
    streamHTMLUnsafe(options?: SetHTMLUnsafeOptions): WritableStream<string>;
    streamAppendHTMLUnsafe(options?: SetHTMLUnsafeOptions): WritableStream<string>;
    streamPrependHTMLUnsafe(options?: SetHTMLUnsafeOptions): WritableStream<string>;
    
    appendHTML(html: string, options?: SetHTMLOptions): void;
    prependHTML(html: string, options?: SetHTMLOptions): void;
    streamHTML(options?: SetHTMLOptions): WritableStream<string>;
    streamAppendHTML(options?: SetHTMLOptions): WritableStream<string>;
    streamPrependHTML(options?: SetHTMLOptions): WritableStream<string>;
  }

  interface ShadowRoot {
    setHTMLUnsafe(html: string, options?: SetHTMLUnsafeOptions): void;
    appendHTMLUnsafe(html: string, options?: SetHTMLUnsafeOptions): void;
    prependHTMLUnsafe(html: string, options?: SetHTMLUnsafeOptions): void;
    streamHTMLUnsafe(options?: SetHTMLUnsafeOptions): WritableStream<string>;
    streamAppendHTMLUnsafe(options?: SetHTMLUnsafeOptions): WritableStream<string>;
    streamPrependHTMLUnsafe(options?: SetHTMLUnsafeOptions): WritableStream<string>;
    
    appendHTML(html: string, options?: SetHTMLOptions): void;
    prependHTML(html: string, options?: SetHTMLOptions): void;
    streamHTML(options?: SetHTMLOptions): WritableStream<string>;
    streamAppendHTML(options?: SetHTMLOptions): WritableStream<string>;
    streamPrependHTML(options?: SetHTMLOptions): WritableStream<string>;
  }

  interface ChildNode {
    beforeHTMLUnsafe(html: string, options?: SetHTMLUnsafeOptions): void;
    afterHTMLUnsafe(html: string, options?: SetHTMLUnsafeOptions): void;
    replaceWithHTMLUnsafe(html: string, options?: SetHTMLUnsafeOptions): void;
    streamBeforeHTMLUnsafe(options?: SetHTMLUnsafeOptions): WritableStream<string>;
    streamAfterHTMLUnsafe(options?: SetHTMLUnsafeOptions): WritableStream<string>;
    streamReplaceWithHTMLUnsafe(options?: SetHTMLUnsafeOptions): WritableStream<string>;
    
    beforeHTML(html: string, options?: SetHTMLOptions): void;
    afterHTML(html: string, options?: SetHTMLOptions): void;
    replaceWithHTML(html: string, options?: SetHTMLOptions): void;
    streamBeforeHTML(options?: SetHTMLOptions): WritableStream<string>;
    streamAfterHTML(options?: SetHTMLOptions): WritableStream<string>;
    streamReplaceWithHTML(options?: SetHTMLOptions): WritableStream<string>;
  }
}
