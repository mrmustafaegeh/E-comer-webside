import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.resolve(__dirname, '../src');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

function migrateFile(filePath) {
  if (!filePath.endsWith('.js') && !filePath.endsWith('.jsx')) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Replace imports
  content = content.replace(/import clientPromise from ["']@\/lib\/mongodb["'];?/g, 'import { prisma } from "@/lib/prisma";');
  content = content.replace(/import \{ ObjectId \} from ["']mongodb["'];?/g, '');
  
  // Replace simple db references that are extremely common in standard endpoints
  // Note: Only for easy replacements. Others we did manually.
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Migrated imports in:', filePath);
  }
}

walk(srcDir, migrateFile);
