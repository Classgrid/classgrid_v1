import fs from 'fs';
import path from 'path';

// This CSS override block will FORCE every possible logo element to be static and non-circular.
// It uses !important to override any existing styles.
const LOGO_OVERRIDE_CSS = `
    /* ====== GLOBAL LOGO FIX: NO CIRCLES, NO ANIMATION ====== */
    .logo img,
    .logo-container,
    .logo-container img,
    .logo-img,
    .nav-logo,
    .nav-brand img,
    .welcome-logo,
    .welcome-logo img,
    .footer-logo-img,
    [class*="logo"] img,
    .header-left img,
    .f-logo,
    .f-logo img {
        border-radius: 0 !important;
        border: none !important;
        box-shadow: none !important;
        animation: none !important;
        transition: none !important;
        transform: none !important;
        overflow: visible !important;
        object-fit: contain !important;
        background: transparent !important;
    }
    .logo-container:hover,
    .logo-container:active,
    .logo-container:hover img,
    .nav-logo:hover,
    .nav-brand:hover .logo-container,
    .nav-brand:hover .nav-logo,
    .nav-brand:hover img,
    .welcome-logo:hover,
    .logo:hover img,
    [class*="logo"]:hover img {
        transform: none !important;
        animation: none !important;
        box-shadow: none !important;
        border: none !important;
    }
    @keyframes rotateLogo { 0%, 100% { transform: none; } }
    /* ====== END GLOBAL LOGO FIX ====== */
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

let fixedFiles = [];

walkDir('public', function(filePath) {
    if (!filePath.match(/\.html$/)) return;
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Remove any previous injection (in case we run this again)
        content = content.replace(/\/\* ====== GLOBAL LOGO FIX: NO CIRCLES, NO ANIMATION ======[\s\S]*?\/\* ====== END GLOBAL LOGO FIX ====== \*\//g, '');
        
        // Inject right before </head>
        if (content.includes('</head>')) {
            content = content.replace('</head>', `<style>${LOGO_OVERRIDE_CSS}</style>\n</head>`);
            fs.writeFileSync(filePath, content, 'utf8');
            fixedFiles.push(filePath);
        }
    } catch (e) {
        console.error(`Error: ${filePath}: ${e.message}`);
    }
});

console.log(`Injected GLOBAL logo override into ${fixedFiles.length} files:`);
fixedFiles.forEach(f => console.log(`  ✓ ${f}`));
