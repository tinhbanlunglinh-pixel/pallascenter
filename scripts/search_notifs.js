import fs from 'fs';
import path from 'path';

function searchDir(dir, pattern) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== 'dist' && entry.name !== '.git' && entry.name !== 'data') {
        searchDir(fullPath, pattern);
      }
    } else if (/\.(tsx?|jsx?|html)$/.test(entry.name)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (pattern.test(line)) {
          console.log(`${fullPath}:${idx + 1}: ${line.trim().slice(0, 120)}`);
        }
      });
    }
  }
}

console.log('--- Searching for Notification / Bell / Toast / Sound ---');
searchDir('.', /(AdminNotificationBell|admin_notifications|notif|HỌC SINH VỪA NỘP BÀI|vừa nộp bài|chuông)/i);
