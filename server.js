const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3005; // Port máy chủ riêng cho thư mục ABCD
const BASE_DIR = __dirname;

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// Xử lý các API cho cả Joe và PN
function handleApi(req, res) {
  const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const referer = req.headers['referer'] || '';
  const isPN = referer.includes('/PN') || urlObj.searchParams.get('model') === 'PN';
  const currentModel = isPN ? 'PN' : 'Joe';
  const modelDir = path.join(BASE_DIR, currentModel);

  // 1. API ĐỒNG BỘ MARKS: GET & POST /api/marks
  if (urlObj.pathname === '/api/marks') {
    const dbFile = path.join(modelDir, 'marks_db.json');

    if (req.method === 'GET') {
      if (!fs.existsSync(dbFile)) {
        fs.writeFileSync(dbFile, JSON.stringify({}, null, 2), 'utf8');
      }
      fs.readFile(dbFile, 'utf8', (err, data) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Cannot read DB' }));
          return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(data || '{}');
      });
      return true;
    }

    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const incomingData = JSON.parse(body);
          let currentDB = {};
          if (fs.existsSync(dbFile)) {
            const raw = fs.readFileSync(dbFile, 'utf8');
            currentDB = raw ? JSON.parse(raw) : {};
          }
          Object.assign(currentDB, incomingData);
          fs.writeFileSync(dbFile, JSON.stringify(currentDB, null, 2), 'utf8');
          console.log(`[Auto-Sync] Đã lưu ${Object.keys(incomingData).length} bản ghi vào ${currentModel}/marks_db.json`);
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ success: true, count: Object.keys(currentDB).length }));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
      });
      return true;
    }
  }

  // 2. API CẬP NHẬT BẢNG MÀU: POST /api/palette (cho color picker)
  if (urlObj.pathname === '/api/palette' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { category, hexColor } = JSON.parse(body);
        console.log(`[Palette] Model ${currentModel} cập nhật màu ${category}: ${hexColor}`);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: true }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid Palette JSON' }));
      }
    });
    return true;
  }

  return false;
}

function serveStaticFile(filePath, res) {
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }
    const ext = path.extname(filePath);
    let contentType = 'text/html; charset=utf-8';
    if (ext === '.js') contentType = 'text/javascript; charset=utf-8';
    if (ext === '.css') contentType = 'text/css; charset=utf-8';
    if (ext === '.json') contentType = 'application/json; charset=utf-8';
    if (ext === '.md') contentType = 'text/markdown; charset=utf-8';
    if (ext === '.png') contentType = 'image/png';
    if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
}

const server = http.createServer((req, res) => {
  setCors(res);
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Xử lý API
  if (handleApi(req, res)) return;

  // Xử lý file tĩnh trong thư mục ABCD
  const cleanUrl = decodeURIComponent(req.url.split('?')[0]);
  let relativePath = cleanUrl.replace(/^\/+/, '');

  if (!relativePath) {
    relativePath = 'index.html';
  } else if (fs.existsSync(path.join(BASE_DIR, relativePath)) && fs.statSync(path.join(BASE_DIR, relativePath)).isDirectory()) {
    relativePath = path.join(relativePath, 'index.html');
  }

  const targetPath = path.join(BASE_DIR, relativePath);
  serveStaticFile(targetPath, res);
});

server.listen(PORT, () => {
  console.log(`=============================================================`);
  console.log(` 🚀 ABCD Host Server đang chạy tại: http://localhost:${PORT}`);
  console.log(` 👉 Joe Viewer & Mark DB: http://localhost:${PORT}/Joe/`);
  console.log(` 👉 PN Viewer & Mark DB:  http://localhost:${PORT}/PN/`);
  console.log(`=============================================================`);
});
