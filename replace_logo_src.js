import fs from 'fs';
import path from 'path';

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

walkDir('./', function(filePath) {
    if (!filePath.match(/\.(html|js)$/)) return;
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;

        content = content.replace(/Classgrid\.png/g, 'logo.png');
        content = content.replace(/Classgrid_transparent\.png/g, 'logo.png');

        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated logo reference in ${filePath}`);
        }
    } catch (e) {}
});
