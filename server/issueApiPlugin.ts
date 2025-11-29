/**
 * Vite plugin to provide a dev server API for reading/writing issue files
 * This enables repo-backed storage during development
 */

import { Plugin } from 'vite';
import fs from 'fs';
import path from 'path';

const DATA_DIR = 'data/issues';
const INDEX_FILE = 'index.json';

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readJsonFile(filePath: string): unknown | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

function writeJsonFile(filePath: string, data: unknown): boolean {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing file:', filePath, error);
    return false;
  }
}

export function issueApiPlugin(): Plugin {
  return {
    name: 'issue-api',
    configureServer(server) {
      // Health check endpoint
      server.middlewares.use('/__api/health', (_req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: true, mode: 'development' }));
      });

      // GET /issues - list all issues (index.json)
      server.middlewares.use('/__api/issues', (req, res, next) => {
        if (req.method === 'GET' && req.url === '/') {
          ensureDataDir();
          const indexPath = path.join(DATA_DIR, INDEX_FILE);
          const index = readJsonFile(indexPath) || { issues: [] };
          
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, data: index }));
          return;
        }
        
        // PUT /issues - update index.json
        if (req.method === 'PUT' && req.url === '/') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const index = JSON.parse(body);
              ensureDataDir();
              const indexPath = path.join(DATA_DIR, INDEX_FILE);
              
              if (writeJsonFile(indexPath, index)) {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true }));
              } else {
                res.statusCode = 500;
                res.end(JSON.stringify({ success: false, error: 'Failed to write index file' }));
              }
            } catch (error) {
              res.statusCode = 400;
              res.end(JSON.stringify({ success: false, error: 'Invalid JSON' }));
            }
          });
          return;
        }
        
        next();
      });

      // GET/PUT/DELETE /__api/issues/:slug
      server.middlewares.use((req, res, next) => {
        const match = req.url?.match(/^\/__api\/issues\/([^/?]+)/);
        if (!match) {
          next();
          return;
        }
        
        const slug = match[1];
        const filePath = path.join(DATA_DIR, `${slug}.json`);
        
        // GET - load issue
        if (req.method === 'GET') {
          const issue = readJsonFile(filePath);
          
          if (issue) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, data: issue }));
          } else {
            res.statusCode = 404;
            res.end(JSON.stringify({ success: false, error: 'Issue not found' }));
          }
          return;
        }
        
        // PUT - save issue
        if (req.method === 'PUT') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const issue = JSON.parse(body);
              ensureDataDir();
              
              if (writeJsonFile(filePath, issue)) {
                console.log(`[issue-api] Saved issue: ${slug}.json`);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true }));
              } else {
                res.statusCode = 500;
                res.end(JSON.stringify({ success: false, error: 'Failed to write issue file' }));
              }
            } catch (error) {
              res.statusCode = 400;
              res.end(JSON.stringify({ success: false, error: 'Invalid JSON' }));
            }
          });
          return;
        }
        
        // DELETE - delete issue
        if (req.method === 'DELETE') {
          try {
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
              console.log(`[issue-api] Deleted issue: ${slug}.json`);
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true }));
            } else {
              res.statusCode = 404;
              res.end(JSON.stringify({ success: false, error: 'Issue not found' }));
            }
          } catch (error) {
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, error: 'Failed to delete issue' }));
          }
          return;
        }
        
        next();
      });
    },
  };
}
