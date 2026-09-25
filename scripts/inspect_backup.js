import fs from 'fs';
let content = fs.readFileSync('data/backup_pre_clean.json', 'utf8');
if (content.charCodeAt(0) === 0xFEFF) {
  content = content.slice(1);
}
const data = JSON.parse(content);
console.log('Sample class IDs:', (data.classes || []).slice(0, 5).map(c => ({ id: c?.id, name: c?.name })));
console.log('Sample student IDs:', (data.students || []).slice(0, 5).map(s => ({ id: s?.id, name: s?.name, classId: s?.classId })));
console.log('Sample assignment IDs:', (data.assignments || []).slice(0, 5).map(a => ({ id: a?.id, title: a?.title })));
