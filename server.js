// server.js
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';
import { MongoClient } from 'mongodb';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, 'dist');
const port = Number(process.env.PORT || 4173);
const databaseFile = process.env.DATABASE_FILE || path.join(__dirname, 'data', 'productivity-hub.sqlite');
const mongoUri = process.env.MONGODB_URI || '';
const mongoDatabaseName = process.env.MONGODB_DB || 'caretrack_mrms';

fs.mkdirSync(path.dirname(databaseFile), { recursive: true });
const sqliteDatabase = new DatabaseSync(databaseFile);
sqliteDatabase.exec(`
  CREATE TABLE IF NOT EXISTS app_state (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);
let mongoClient = null;
let mongoCollection = null;

const stateKeys = new Set(['eisenhower', 'timeBlocks', 'pomodoro', 'kanban']);

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.json': 'application/json; charset=utf-8'
};

const sendJson = (response, status, payload) => {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-cache'
  });
  response.end(JSON.stringify(payload));
};

const readRequestBody = (request) => new Promise((resolve, reject) => {
  let body = '';
  request.on('data', (chunk) => {
    body += chunk;
    if (body.length > 2_000_000) {
      reject(new Error('Request body too large'));
      request.destroy();
    }
  });
  request.on('end', () => resolve(body));
  request.on('error', reject);
});

const initializeDatabase = async () => {
  if (!mongoUri) return;
  mongoClient = new MongoClient(mongoUri, {
    appName: 'ProductivityHub'
  });
  await mongoClient.connect();
  const mongoDatabase = mongoClient.db(mongoDatabaseName);
  mongoCollection = mongoDatabase.collection('productivity_hub_state');
  await mongoCollection.createIndex({ key: 1 }, { unique: true });
};

const getPersistenceInfo = () => mongoCollection
  ? { type: 'mongodb', database: mongoDatabaseName, collection: 'productivity_hub_state' }
  : { type: 'sqlite', database: path.basename(databaseFile) };

const getAllState = async () => {
  if (mongoCollection) {
    const documents = await mongoCollection.find({}, { projection: { _id: 0, key: 1, value: 1, updatedAt: 1 } }).toArray();
    return Object.fromEntries(documents.map((document) => [document.key, { value: document.value, updatedAt: document.updatedAt }]));
  }

  const rows = sqliteDatabase.prepare('SELECT key, value, updated_at FROM app_state').all();
  return Object.fromEntries(rows.map((row) => [row.key, { value: JSON.parse(row.value), updatedAt: row.updated_at }]));
};

const getState = async (key) => {
  if (mongoCollection) {
    const document = await mongoCollection.findOne({ key }, { projection: { _id: 0, value: 1, updatedAt: 1 } });
    return document ? { key, value: document.value, updatedAt: document.updatedAt } : { key, value: null };
  }

  const row = sqliteDatabase.prepare('SELECT value, updated_at FROM app_state WHERE key = ?').get(key);
  return row ? { key, value: JSON.parse(row.value), updatedAt: row.updated_at } : { key, value: null };
};

const saveState = async (key, value) => {
  if (mongoCollection) {
    const updatedAt = new Date().toISOString();
    await mongoCollection.updateOne(
      { key },
      { $set: { key, value, updatedAt } },
      { upsert: true }
    );
    return;
  }

  sqliteDatabase.prepare(`
    INSERT INTO app_state (key, value, updated_at)
    VALUES (?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
  `).run(key, JSON.stringify(value));
};

const handleApiRequest = async (request, response, pathname) => {
  if (pathname === '/api/health') {
    sendJson(response, 200, { ok: true, persistence: getPersistenceInfo() });
    return true;
  }

  if (pathname === '/api/state' && request.method === 'GET') {
    sendJson(response, 200, { state: await getAllState() });
    return true;
  }

  const match = pathname.match(/^\/api\/state\/([a-zA-Z0-9_-]+)$/);
  if (match && request.method === 'GET') {
    const key = match[1];
    if (!stateKeys.has(key)) {
      sendJson(response, 404, { error: 'Unknown state key' });
      return true;
    }
    sendJson(response, 200, await getState(key));
    return true;
  }

  if (match && request.method === 'PUT') {
    const key = match[1];
    if (!stateKeys.has(key)) {
      sendJson(response, 404, { error: 'Unknown state key' });
      return true;
    }
    try {
      const body = await readRequestBody(request);
      const payload = JSON.parse(body || '{}');
      if (!Object.hasOwn(payload, 'value')) {
        sendJson(response, 400, { error: 'Missing value' });
        return true;
      }
      await saveState(key, payload.value);
      sendJson(response, 200, { ok: true, key });
      return true;
    } catch (error) {
      sendJson(response, 400, { error: error.message });
      return true;
    }
  }

  if (pathname.startsWith('/api/')) {
    sendJson(response, 404, { error: 'Not found' });
    return true;
  }

  return false;
};

const server = http.createServer(async (request, response) => {
  const requestedPath = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname);
  if (await handleApiRequest(request, response, requestedPath)) return;

  const safePath = requestedPath === '/' ? '/index.html' : requestedPath;
  const filePath = path.normalize(path.join(distDir, safePath));

  if (!filePath.startsWith(distDir)) {
    response.writeHead(403);
    response.end('Forbidden');
    return;
  }

  const finalPath = fs.existsSync(filePath) && fs.statSync(filePath).isFile()
    ? filePath
    : path.join(distDir, 'index.html');
  const extension = path.extname(finalPath);
  response.writeHead(200, {
    'Content-Type': mimeTypes[extension] || 'application/octet-stream',
    'Cache-Control': extension === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable'
  });
  fs.createReadStream(finalPath).pipe(response);
});

await initializeDatabase();
server.listen(port, '0.0.0.0', () => {
  console.log(`Productivity Hub web server running on port ${port}`);
  console.log(`Persistence: ${JSON.stringify(getPersistenceInfo())}`);
});

const shutdown = (signal) => {
  console.log(`${signal} received, shutting down Productivity Hub web server.`);
  server.close(() => {
    sqliteDatabase.close();
    mongoClient?.close();
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
