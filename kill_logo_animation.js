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

let fixedFiles = [];

walkDir('public', function(filePath) {
    if (!filePath.match(/\.html$/)) return;
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let original = content;

        // 1. Remove @keyframes rotateLogo entirely
        content = content.replace(/@keyframes\s+rotateLogo\s*{[^}]*{[^}]*}[^}]*{[^}]*}\s*}/gs, '');
        
        // 2. Remove any animation property referencing rotateLogo
        content = content.replace(/animation:\s*rotateLogo[^;]*;/g, '');

        // 3. Remove any animation property referencing pulse (on logo)
        // Keep pulse for non-logo things by being targeted
        
        // 4. Remove ALL transform on hover for logo-container, nav-logo, nav-brand, welcome-logo
        // Kill: transform: rotate(...), transform: scale(...), transform: translateY(...)
        // in hover blocks for logo elements
        
        // Remove .nav-brand:hover .logo-container transform
        content = content.replace(/\.nav-brand:hover\s+\.logo-container\s*{[^}]*}/gs, '');
        
        // Remove .nav-brand:hover .nav-logo transform  
        content = content.replace(/\.nav-brand:hover\s+\.nav-logo\s*{[^}]*}/gs, '');
        
        // Remove .logo-container:hover transform blocks
        content = content.replace(/\.logo-container:hover\s*{[^}]*}/gs, '');
        
        // Remove .logo-container:active transform blocks
        content = content.replace(/\.logo-container:active\s*{[^}]*}/gs, '');

        // 5. Remove animation property from .logo-container CSS blocks
        content = content.replace(/(\.logo-container\s*{[^}]*?)animation:\s*[^;]+;/gs, '$1');
        
        // 6. Remove animation property from .welcome-logo CSS blocks
        content = content.replace(/(\.welcome-logo\s*{[^}]*?)animation:\s*[^;]+;/gs, '$1');
        
        // 7. Remove animation property from .nav-logo CSS blocks
        content = content.replace(/(\.nav-logo\s*{[^}]*?)animation:\s*[^;]+;/gs, '$1');

        // 8. Remove transition: transform from logo containers (prevents hover wobble)
        content = content.replace(/(\.logo-container\s*{[^}]*?)transition:\s*[^;]*transform[^;]*;/gs, '$1');
        content = content.replace(/(\.nav-logo\s*{[^}]*?)transition:\s*[^;]*transform[^;]*;/gs, '$1');

        // 9. Remove .nav-brand:hover transform
        content = content.replace(/(\.nav-brand:hover\s*{[^}]*?)transform:\s*[^;]+;/gs, '$1');
        content = content.replace(/(\.nav-brand\s*{[^}]*?)transition:\s*transform[^;]*;/gs, '$1');

        // 10. Remove the media query block that adds rotateLogo animation
        content = content.replace(/@media\s*\(min-width:\s*769px\)\s*{\s*\.logo-container\s*{\s*animation:\s*rotateLogo[^}]*}\s*}/gs, '');
        
        // 11. Remove media query block for welcome-logo pulse animation
        content = content.replace(/@media\s*\(min-width:\s*769px\)\s*{\s*\.welcome-logo\s*{\s*animation:\s*pulse[^}]*}\s*}/gs, '');

        // 12. Remove hover transform on .logo-container inside media queries
        content = content.replace(/@media\s*\(min-width:\s*769px\)\s*{\s*\.logo-container:hover\s*{[^}]*}\s*}/gs, '');

        if (content !== original) {
            fs.writeFileSync(filePath, content, 'utf8');
            fixedFiles.push(filePath);
        }
    } catch (e) {
        console.error(`Error processing ${filePath}:`, e.message);
    }
});

console.log(`Killed ALL logo animations in ${fixedFiles.length} files:`);
fixedFiles.forEach(f => console.log(`  ✓ ${f}`));
