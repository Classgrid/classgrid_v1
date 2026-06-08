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

walkDir(__dirname, function(filePath) {
    if (!filePath.match(/\.html$/)) return;
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;

        // Remove <link rel="icon" ... >
        content = content.replace(/<link[^>]*rel=["'](icon|shortcut icon|apple-touch-icon)["'][^>]*>/gi, '');
        
        // Remove <link rel="manifest" ... >
        content = content.replace(/<link[^>]*rel=["']manifest["'][^>]*>/gi, '');

        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated icons in ${filePath}`);
        }
    } catch (e) {}
});
