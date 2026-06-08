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

const replacements = [
    // Clean up messy duplicates created from previous replacements
    { regex: /support@classgrid\.in or support@classgrid\.in/gi, replacement: 'support@classgird.in' },
    { regex: /support@classgrid\.in\s+or\s+support@classgrid\.in/gi, replacement: 'support@classgird.in' },
    { regex: /support@classgrid\.in,support@classgrid\.in/gi, replacement: 'support@classgird.in' },
    { regex: /mailto:support@classgrid\.in,support@classgrid\.in/gi, replacement: 'mailto:support@classgird.in' },
    
    // Catch-all to change any remaining correct spelling or previous substitutions to the requested typo
    { regex: /support@classgrid\.in/gi, replacement: 'support@classgird.in' },
    
    // Also clean up any lingering classgrid25 or support@classgrid.site just in case
    { regex: /classgrid25@gmail\.com or support@classgrid\.site/gi, replacement: 'support@classgird.in' },
    { regex: /classgrid25@gmail\.com,support@classgrid\.site/gi, replacement: 'support@classgird.in' },
    { regex: /classgrid25@gmail\.com/gi, replacement: 'support@classgird.in' },
    { regex: /support@classgrid\.site/gi, replacement: 'support@classgird.in' },
    { regex: /academic@classgrid\.site/gi, replacement: 'support@classgird.in' }
];

walkDir(__dirname, function(filePath) {
    if (!filePath.match(/\.(html|js|jsx|ts|tsx|css|json|md|txt|env)$/)) return;
    if (filePath.endsWith('package-lock.json')) return;
    if (filePath === __filename || filePath.endsWith('replace_emails.js')) return;

    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;

        for (let { regex, replacement } of replacements) {
            content = content.replace(regex, replacement);
        }

        // Specifically target features.html duplicated lists if they exist
        // Ex: Two exact li elements back to back with the email. We'll leave them as is for now, but with updated email.

        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated to support@classgird.in in ${filePath}`);
        }
    } catch (e) {}
});

// Update .env file
try {
    const envPath = path.join(__dirname, '.env');
    if (fs.existsSync(envPath)) {
        let envContent = fs.readFileSync(envPath, 'utf8');
        let newEnvContent = envContent.replace(/support@classgrid\.in/g, 'support@classgird.in');
        if (newEnvContent !== envContent) {
            fs.writeFileSync(envPath, newEnvContent, 'utf8');
            console.log(`Updated .env`);
        }
    }
} catch (e) {}

console.log("Email replacement script completed.");
