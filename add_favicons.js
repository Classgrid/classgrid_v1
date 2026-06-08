import fs from 'fs';
import path from 'path';

const linkTags = `
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
`;

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
    if (!filePath.match(/\.html$/)) return;
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;

        // If the tags are already there, remove them first to avoid duplicates
        content = content.replace(/<link[^>]*href="\/favicon-32x32\.png"[^>]*>/gi, '');
        content = content.replace(/<link[^>]*href="\/favicon-16x16\.png"[^>]*>/gi, '');
        content = content.replace(/<link[^>]*href="\/apple-touch-icon\.png"[^>]*>/gi, '');

        // Insert just before </head>
        content = content.replace(/<\/head>/i, `${linkTags}</head>`);

        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Added favicons to ${filePath}`);
        }
    } catch (e) {}
});
