import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function walkDir(dir, callback) {
    if (dir.includes('node_modules') || dir.includes('.git') || dir.includes('.next')) return;
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        try {
            let isDirectory = fs.statSync(dirPath).isDirectory();
            isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
        } catch (e) {
            // ignore
        }
    });
}

walkDir(__dirname, function(filePath) {
    if (!filePath.match(/\.(js|jsx|ts|tsx|html|css|json|md|env)$/)) return;
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let newContent = content
            .replace(/Classgrid/g, 'Classgrid')
            .replace(/classgrid/g, 'classgrid')
            .replace(/Classgrid/g, 'Classgrid')
            .replace(/Classgrid/g, 'Classgrid')
            .replace(/classgrid/g, 'classgrid');
        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`Replaced in ${filePath}`);
        }
    } catch (e) {
        // ignore
    }
});
