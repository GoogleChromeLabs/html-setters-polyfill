/**
 *  @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert';
import yargs from 'yargs/yargs';
import {hideBin} from 'yargs/helpers';

const argv = yargs(hideBin(process.argv)).parse();
const testsFilter = argv.tests;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const unitTestsDir = path.resolve(__dirname, '../');

describe('HTML Setters Unit Tests', function () {
  const files = fs.readdirSync(unitTestsDir).filter((file) => {
    return (
      file.endsWith('.html') && file !== "index.html" && (!testsFilter || file.includes(testsFilter))
    );
  });

  files.forEach((file) => {
    let passed = 0;
    let failed = 0;
    
    it(`should pass ${file}`, async function() {

      // setHTML doesn't exist in Safari so can't stream safe HTML :-(
      // Skip the test to avoid CI errors
      if (browser.capabilities.browserName === 'Safari' &&
        (file === 'stream-append-html.html' || file === 'stream-html.html')) {
          const supportsSetHTML = await browser.execute(() => {
            'setHTML' in Element.prototype;
          });
          if (!supportsSetHTML) return this.skip();
      }

      const urlPath = `http://localhost:9090/tests/${file}`;

      await browser.url(urlPath);

      // In Firefox and Safari, if the global PageLoadStrategy is set to
      // "none", then it's possible that `browser.url()` will return before the
      // navigation has started and the old page will still be around, so we
      // have to manually wait until the URL matches the passed URL. Note that
      // this can still fail if the prior test navigated to a page with the
      // same URL.
      if (browser.capabilities.browserName !== 'chrome') {
        await browser.waitUntil(
          async () => {
            // Get the URL from the browser and webdriver to ensure the page has
            // actually started to load.
            const url = await browser.execute(() => location.href);

            return url.endsWith(urlPath);
          },
          {interval: 50}
        );
      }

      await browser.waitUntil(
          async () => {
            return await browser.execute(() => {
                return document.getElementById('results')?.children?.length > 0;
            })
          },
          {
              timeout: 5000, // Timeout in milliseconds (5 seconds)
              timeoutMsg: 'Results did not load within 5 seconds'
          }
      );

      // Get the results
      passed = await browser.execute(() => document.getElementById('results').querySelectorAll('.pass').length);
      failed = await browser.execute(() => document.getElementById('results').querySelectorAll('.fail').length);

      console.log(`${file}: Passed: ${passed} Failed: ${failed}`);

      assert(passed > 0);
      assert.strictEqual(failed, 0, `Failures in ${file}`);
    });
  });
});
