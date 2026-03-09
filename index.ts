import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = createServer((req, res) => {
  // Serve static files from dist
  const filePath = join(__dirname, '..', 'dist', req.url === '/' ? 'index.html' : req.url);
  
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath);
    const ext = filePath.split('.').pop();
    const contentType = {
      'html': 'text/html',
      'js': 'application/javascript',
      'css': 'text/css',
      'json': 'application/json',
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'svg': 'image/svg+xml',
      'txt': 'text/plain',
    }[ext] || 'application/octet-stream';
    
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  } else {
    // Fallback to index.html for SPA routing
    const indexPath = join(__dirname, '..', 'dist', 'index.html');
    if (fs.existsSync(indexPath)) {
      const content = fs.readFileSync(indexPath);
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    } else {
      res.writeHead(404);
      res.end('Not Found');
    }
  }
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default server;
