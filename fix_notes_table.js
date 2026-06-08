import fs from 'fs';
import path from 'path';

let file = path.join('public', 'notes.html');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/\.from\('notes'\)/g, ".from('materials')");

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed notes to materials in notes.html');
