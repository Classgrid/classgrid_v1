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
    if (!filePath.match(/\.(html|js|css)$/)) return;
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;

        // Replace HTML styled brands
        content = content.replace(/Classgrid\s*<\s*em\s*>\s*Chem\s*<\s*\/\s*em\s*>/gi, 'Classgrid');
        content = content.replace(/Classgrid\s*<\s*span[^>]*>\s*Chem\s*<\s*\/\s*span\s*>/gi, 'Classgrid');
        content = content.replace(/Classgrid\s*<\s*span\s*>\s*Chem\s*<\s*\/\s*span\s*>/gi, 'Classgrid');
        content = content.replace(/Classgrid\s*Chem/gi, 'Classgrid');
        
        // Replace in classnames/ids
        content = content.replace(/classgrid-loader/g, 'classgrid-loader');
        content = content.replace(/classgridLoader/g, 'classgridLoader');
        content = content.replace(/classgrid-container/g, 'classgrid-container');
        content = content.replace(/classgridContainer/g, 'classgridContainer');
        content = content.replace(/classgrid-header/g, 'classgrid-header');
        content = content.replace(/classgrid-footer/g, 'classgrid-footer');
        
        // Theme name 
        content = content.replace(/data-theme="classgrid"/g, 'data-theme="classgrid"');
        content = content.replace(/theme="classgrid"/g, 'theme="classgrid"');
        content = content.replace(/Classgrid Dark/g, 'Classgrid Dark');
        content = content.replace(/'classgrid'/g, "'classgrid'");

        // Generic Classgrid -> Classgrid for visual texts
        content = content.replace(/Physics/g, 'Physics');
        content = content.replace(/Mechanics/g, 'Mechanics');

        // Other generic replacements
        content = content.replace(/Classgrid/g, 'Classgrid');
        content = content.replace(/classgrid/g, 'classgrid');

        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Deep cleaned Classgrid in ${filePath}`);
        }
    } catch (e) {}
});
