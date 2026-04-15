/**
 *  @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @typedef {Object} SetHTMLUnsafeOptions
 * @property {boolean} [runScripts]
 */

/**
 * @typedef {Object} SetHTMLOptions
 * @property {any} [sanitizer]
 */

(function () {
  'use strict';

  const nativeElementSetHTMLUnsafe = Element.prototype.setHTMLUnsafe;
  const nativeShadowSetHTMLUnsafe = ShadowRoot.prototype.setHTMLUnsafe;

  function applyDeclarativeShadowDOM(root) {
    const templates = root.querySelectorAll('template[shadowrootmode]');
    for (const template of templates) {
      const mode = template.getAttribute('shadowrootmode');
      const host = template.parentNode;
      if (host && (mode === 'open' || mode === 'closed')) {
        const shadowRoot = host.attachShadow({ mode });
        shadowRoot.appendChild(template.content);
        template.remove();
        applyDeclarativeShadowDOM(shadowRoot);
      }
    }
  }

  /**
   * @param {string} html
   * @param {boolean} runScripts
   * @param {"safe" | "unsafe"} safety
   * @param {Node} context
   * @returns {DocumentFragment}
   */
  function parseHTML(htmlStr, runScripts, safety, context, options = {}) {
    const safe = safety === 'safe';

    let contextEl = context;
    if (context instanceof ShadowRoot) {
      contextEl = context.host;
    }
    const tagName = (contextEl instanceof Element) ? contextEl.tagName : 'DIV';

    if (runScripts && !safe) {
      const range = document.createRange();
      if (context instanceof Element) {
        range.selectNodeContents(context);
      } else if (context instanceof ShadowRoot) {
        range.selectNodeContents(context.host);
      } else {
        const body = context.ownerDocument?.body || document.body;
        range.selectNodeContents(body);
      }
      const fragment = range.createContextualFragment(htmlStr);
      applyDeclarativeShadowDOM(fragment);
      return fragment;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString('<!DOCTYPE html><html><body></body></html>', 'text/html');
    const placeholder = doc.createElement(tagName);
    doc.body.appendChild(placeholder);

    if (safe) {
      if ('setHTML' in placeholder) {
        placeholder.setHTML(htmlStr, options);
      } else {
        throw new Error('Safe parsing requested but setHTML is not available.');
      }
    } else if ('setHTMLUnsafe' in placeholder) {
      placeholder.setHTMLUnsafe(htmlStr);
    } else {
      placeholder.innerHTML = htmlStr;
    }

    const fragment = document.createDocumentFragment();
    while (placeholder.firstChild) {
      fragment.appendChild(document.adoptNode(placeholder.firstChild));
    }
    return fragment;
  }

  /**
   * @param {Element | ShadowRoot} target
   * @param {string} htmlStr
   * @param {SetHTMLUnsafeOptions} [options]
   */
  /**
   * @param {Element | ShadowRoot} target
   * @param {any} htmlStr
   * @param {"safe" | "unsafe"} safety
   * @param {SetHTMLUnsafeOptions | SetHTMLOptions} [options]
   * @param {'replaceChildren' | 'before' | 'prepend' | 'append' | 'after' | 'replaceWith'} position
   */
  function insertHTML(target, htmlStr, safety, options = {}, position) {
    const safe = safety === 'safe';
    const runScripts = !!options.runScripts;

    if (position === 'replaceChildren') {
      if (safe) {
        if ('setHTML' in target) {
          target.setHTML(htmlStr, options);
          return;
        } else {
          throw new Error('Safe setting requested but setHTML is not available.');
        }
      }

      if (runScripts) {
        const fragment = parseHTML(htmlStr, true, 'unsafe', target, options);
        target.replaceChildren(fragment);
      } else {
        const nativeSet = (target instanceof ShadowRoot) ? nativeShadowSetHTMLUnsafe : nativeElementSetHTMLUnsafe;
        if (nativeSet) {
          nativeSet.call(target, htmlStr);
        } else {
          target.innerHTML = htmlStr;
        }
      }
      return;
    }

    const fragment = parseHTML(htmlStr, runScripts, safety, target, options);

    switch (position) {
      case 'replaceWith':
        target.replaceWith(fragment);
        break;
      case 'before':
        target.before(fragment);
        break;
      case 'prepend':
        target.prepend(fragment);
        break;
      case 'append':
        target.append(fragment);
        break;
      case 'after':
        target.after(fragment);
        break;
    }
  }

  /**
   * @param {Element | ShadowRoot} target
   * @param {"safe" | "unsafe"} safety
   * @param {SetHTMLUnsafeOptions | SetHTMLOptions} options
   * @param {'set' | 'before' | 'prepend' | 'append' | 'after' | 'replaceWith'} position
   * @returns {WritableStream}
   */
  function createHTMLStream(target, safety, options = {}, position) {
    let buffer = '';
    return new WritableStream({
      write(chunk) {
        buffer += chunk;
      },
      close() {
        insertHTML(target, buffer, safety, options, position);
      }
    });
  }

  for (const proto of [Element.prototype, ShadowRoot.prototype]) {
    // Unsafe methods
    const nativeSet = proto.setHTMLUnsafe;
    proto.setHTMLUnsafe = function (html, options) {
      if (options && options.runScripts) {
        insertHTML(this, html, 'unsafe', options, 'replaceChildren');
      } else if (nativeSet) {
        nativeSet.call(this, html);
      } else {
        insertHTML(this, html, 'unsafe', options, 'replaceChildren');
      }
    };
    proto.appendHTMLUnsafe ??= function (html, options) {
      insertHTML(this, html, 'unsafe', options, 'append');
    };
    proto.prependHTMLUnsafe ??= function (html, options) {
      insertHTML(this, html, 'unsafe', options, 'prepend');
    };

    // Streaming methods
    proto.streamHTMLUnsafe ??= function (options) {
      return createHTMLStream(this, 'unsafe', options, 'replaceChildren');
    };
    proto.streamAppendHTMLUnsafe ??= function (options) {
      return createHTMLStream(this, 'unsafe', options, 'append');
    };
    proto.streamPrependHTMLUnsafe ??= function (options) {
      return createHTMLStream(this, 'unsafe', options, 'prepend');
    };

    // Safe methods (only if setHTML is available)
    if (!('setHTML' in Element.prototype)) continue;

    proto.appendHTML ??= function (html, options) {
      insertHTML(this, html, 'safe', options, 'append');
    };
    proto.prependHTML ??= function (html, options) {
      insertHTML(this, html, 'safe', options, 'prepend');
    };
    proto.streamHTML ??= function (options) {
      return createHTMLStream(this, 'safe', options, 'replaceChildren');
    };
    proto.streamAppendHTML ??= function (options) {
      return createHTMLStream(this, 'safe', options, 'append');
    };
    proto.streamPrependHTML ??= function (options) {
      return createHTMLStream(this, 'safe', options, 'prepend');
    };
  }

  // ChildNode variants
  for (const proto of [Element.prototype, CharacterData.prototype, DocumentType.prototype]) {
    // Sync methods
    proto.beforeHTMLUnsafe ??= function (html, options) {
      insertHTML(this, html, 'unsafe', options, 'before');
    };
    proto.afterHTMLUnsafe ??= function (html, options) {
      insertHTML(this, html, 'unsafe', options, 'after');
    };
    proto.replaceWithHTMLUnsafe ??= function (html, options) {
      insertHTML(this, html, 'unsafe', options, 'replaceWith');
    };

    proto.streamBeforeHTMLUnsafe ??= function (options) {
      if (!this.parentNode) throw new Error('Node has no parent');
      return createHTMLStream(this, 'unsafe', options, 'before');
    };
    proto.streamAfterHTMLUnsafe ??= function (options) {
      if (!this.parentNode) throw new Error('Node has no parent');
      return createHTMLStream(this, 'unsafe', options, 'after');
    };
    proto.streamReplaceWithHTMLUnsafe ??= function (options) {
      if (!this.parentNode) throw new Error('Node has no parent');
      return createHTMLStream(this, 'unsafe', options, 'replaceWith');
    };

    // Safe methods (only if setHTML is available)
    if (!('setHTML' in Element.prototype)) continue;

    proto.beforeHTML ??= function (html, options) {
      insertHTML(this, html, 'safe', options, 'before');
    };
    proto.afterHTML ??= function (html, options) {
      insertHTML(this, html, 'safe', options, 'after');
    };
    proto.replaceWithHTML ??= function (html, options) {
      insertHTML(this, html, 'safe', options, 'replaceWith');
    };

    proto.streamBeforeHTML ??= function (options) {
      if (!this.parentNode) throw new Error('Node has no parent');
      return createHTMLStream(this, 'safe', options, 'before');
    };
    proto.streamAfterHTML ??= function (options) {
      if (!this.parentNode) throw new Error('Node has no parent');
      return createHTMLStream(this, 'safe', options, 'after');
    };
    proto.streamReplaceWithHTML ??= function (options) {
      if (!this.parentNode) throw new Error('Node has no parent');
      return createHTMLStream(this, 'safe', options, 'replaceWith');
    };
  }





})();
