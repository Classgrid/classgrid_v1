import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function walkDir(dir, callback) {
    if (dir.includes('node_modules') || dir.includes('.git') || dir.includes('.next')) return;
    try {
        fs.readdirSync(dir).forEach(f => {
            let dirPath = path.join(dir, f);
            try {
                let isDirectory = fs.statSync(dirPath).isDirectory();
                isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
            } catch (e) {}
        });
    } catch (e) {}
}

const emailReplacements = [
    { regex: /classgrid25@gmail\.com or support@classgrid\.site/g, replacement: 'support@classgrid.in' },
    { regex: /classgrid25@gmail\.com,support@classgrid\.site/g, replacement: 'support@classgrid.in' },
    { regex: /classgrid25@gmail\.com/g, replacement: 'support@classgrid.in' },
    { regex: /support@classgrid\.site/g, replacement: 'support@classgrid.in' },
    { regex: /academic@classgrid\.site/g, replacement: 'support@classgrid.in' },
    { regex: /classgird25@gmail\.com/g, replacement: 'support@classgrid.in' }
];

walkDir(__dirname, function(filePath) {
    if (!filePath.match(/\.(html|js|jsx|ts|tsx|css|json|md|txt)$/)) return;
    if (filePath.endsWith('package-lock.json')) return;
    if (filePath === __filename) return;

    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;

        for (let { regex, replacement } of emailReplacements) {
            content = content.replace(regex, replacement);
        }

        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated emails in ${filePath}`);
        }
    } catch (e) {}
});

console.log("Email replacement script completed.");
