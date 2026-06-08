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

walkDir('public', function(filePath) {
    if (!filePath.match(/\.html$/)) return;
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;

        // Target both the classes and their img children, e.g., .logo-container img
        const logoClasses = [
            '\\.logo-container', '\\.logo-img', '\\.nav-logo', '\\.f-logo', '\\.footer-logo-img', '\\.welcome-logo', '\\[data-theme="dark"\\] \\.logo-img',
            '\\.logo-container\\s+img', '\\.nav-logo\\s+img', '\\.welcome-logo\\s+img'
        ];
        
        logoClasses.forEach(cls => {
            let regex = new RegExp(`(${cls}\\s*{[^}]*})`, 'g');
            content = content.replace(regex, (match) => {
                let replaced = match;
                replaced = replaced.replace(/border-radius:\s*[^;]+;/g, '');
                replaced = replaced.replace(/border:\s*[^;]+;/g, '');
                replaced = replaced.replace(/box-shadow:\s*[^;]+;/g, '');
                replaced = replaced.replace(/overflow:\s*hidden;/g, '');
                replaced = replaced.replace(/object-fit:\s*cover;/g, 'object-fit: contain;');
                // Also remove background colors/gradients from logo containers since they create boxes
                replaced = replaced.replace(/background:\s*[^;]+;/g, '');
                replaced = replaced.replace(/background-color:\s*[^;]+;/g, '');
                return replaced;
            });
        });

        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated borders in ${filePath}`);
        }
    } catch (e) {}
});
