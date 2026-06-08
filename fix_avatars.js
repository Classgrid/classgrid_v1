import fs from 'fs';
import path from 'path';

let filePath = path.join('public', 'classgrid_assistant.html');
let content = fs.readFileSync(filePath, 'utf8');

// Replace border-radius 50% for all avatars
content = content.replace(/\.message-avatar\s*{[^}]*}/, (match) => {
    return match.replace(/border-radius:\s*50%;/, 'border-radius: 8px;');
});

content = content.replace(/\.typing-avatar\s*{[^}]*}/, (match) => {
    return match.replace(/border-radius:\s*50%;/, 'border-radius: 8px;');
});

// Also double check .logo-container in case there is STILL a glowing circle.
content = content.replace(/\.logo-container\s*{[^}]*}/, (match) => {
    let replaced = match;
    replaced = replaced.replace(/box-shadow:\s*[^;]+;/g, '');
    replaced = replaced.replace(/border:\s*[^;]+;/g, '');
    return replaced;
});

content = content.replace(/\.welcome-logo\s*{[^}]*}/, (match) => {
    let replaced = match;
    replaced = replaced.replace(/box-shadow:\s*[^;]+;/g, '');
    replaced = replaced.replace(/border:\s*[^;]+;/g, '');
    return replaced;
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed avatars and glow in assistant');
