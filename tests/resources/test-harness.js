/**
 *  @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || "Assertion failed");
  }
}

function assertEquals(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message || "Assertion failed"}: expected "${expected}", got "${actual}"`);
  }
}

function assertTrue(condition, message) {
  assert(condition, message);
}

function assertFalse(condition, message) {
  assert(!condition, message);
}

function assertNotEquals(actual, expected, message) {
  if (actual === expected) {
    throw new Error(`${message || "Assertion failed"}: expected not to be "${expected}"`);
  }
}

function assert_node(actual, expected) {
    assertTrue(actual instanceof expected.type,
                'Node type mismatch: actual = ' + actual.constructor.name + ', expected = ' + expected.type.name);
    if (typeof(expected.id) !== 'undefined')
        assertEquals(actual.id, expected.id, expected.idMessage);
}

let testTimeout;
function scheduleDoneCheck() {
  clearTimeout(testTimeout);
  testTimeout = setTimeout(() => {
    const resultsDiv = document.getElementById('results');
    const failed = resultsDiv.querySelector('.fail');
    window.parent.postMessage({
      type: 'test-complete',
      file: window.location.pathname.split('/').pop(),
      success: !failed
    }, '*');
  }, 500);
}

async function test(name, fn) {
  const resultsDiv = document.getElementById('results');
  if (!resultsDiv) {
    console.error("Results div not found! Make sure <div id=\"results\"></div> exists.");
    return;
  }
  const resultEl = document.createElement('div');
  const cleanups = [];
  const t = {
    add_cleanup: (cleanupFn) => cleanups.push(cleanupFn)
  };
  try {
    await fn(t);
    resultEl.innerHTML = `<span class="pass">PASS</span> ${name}`;
    console.log(`PASS: ${name}`);
  } catch (e) {
    resultEl.innerHTML = `<span class="fail">FAIL</span> ${name}: ${e.message}`;
    console.error(`FAIL: ${name}`, e);
  } finally {
    for (const cleanup of cleanups) {
      try {
        cleanup();
      } catch (cleanupError) {
        console.error(`Error during cleanup for ${name}:`, cleanupError);
      }
    }
  }
  resultsDiv.appendChild(resultEl);
  
  if (window.parent !== window) {
    scheduleDoneCheck();
  }
}
