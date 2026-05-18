/**
 *  @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import http from 'node:http';
import fs from 'fs-extra';
import path from 'node:path';
import {Readable, Transform} from 'node:stream';

const MIME_TYPES = {
  '.js': 'text/javascript',
  '.cjs': 'text/javascript',
  '.html': 'text/html',
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const query = Object.fromEntries(url.searchParams);

  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const root = process.cwd();
  let filePath = path.join(root, url.pathname);

  // Static file serving
  // Check if filePath is within root (avoids ../../ escaping)
  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  if (req.method !== 'GET') {
    res.writeHead(405);
    res.end('Method not allowed');
    return;
  }

  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  // Map any /dist/ or /static/ path to the root dist/ or static/ directory
  if (
    url.pathname.startsWith('/index.js') ||
    url.pathname.startsWith('/tests/resources/')
  ) {
    try {
      const content = fs.readFileSync(filePath);
      res.end(content);
    } catch (error) {
      console.error(error.stack);
      res.writeHead(500);
      res.end(error.stack);
    }
    return;
  }

  if (url.pathname.startsWith('/tests/')) {
    try {
      const content = fs.readFileSync(filePath);
      res.setHeader('Content-Type', contentType);

      if (query.delayResponse) {
        res.write(content + '\n');
        setTimeout(() => {
          res.write('</body></html>');
          res.end();
        }, Number(query.delayResponse));
      } else {
        res.end(content);
      }
    } catch (error) {
      console.error(error.stack);
      res.writeHead(500);
      res.end(error.stack);
    }
    return;
  }
});

const port = process.env.PORT || 9090;
server.listen(port, () => {
  console.log(`Server running:\nhttp://localhost:${port}`);
});
